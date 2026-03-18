---
title: Architecture
description: Technical deep-dive into BRUH Claude's container design, MCP server, IPC bridge, and component interactions.
---

This page covers the internal architecture of BRUH Claude Terminal for contributors, developers, and anyone who wants to understand how the pieces fit together.

## System Overview

BRUH Claude is a Home Assistant add-on that runs in an Alpine Linux container managed by the HA Supervisor. It consists of several interconnected components that bridge Claude Code with the Home Assistant ecosystem.

<div style="margin: 2rem 0;">
  <img src="/images/bruh-claude/architecture-overview.svg" alt="Architecture Overview" style="width: 100%; border-radius: 8px;" />
</div>

### Component Map

| Component | Runtime | Language | Entry Point |
|-----------|---------|----------|-------------|
| Web Terminal | ttyd + tmux | Shell | `run.sh` → ttyd |
| MCP Server | stdio process | Python | `ha-mcp-server/ha_mcp_server.py` |
| Assist Listener | inotifywait loop | Shell | `integrations/assist-listener.sh` |
| Automation Listener | inotifywait loop | Shell | `integrations/automation-listener.sh` |
| Custom Integration | HA Core | Python | `custom_components/bruh_claude/` |
| Token Tracker | Daemon | Python | `scripts/token-stats-tracker.py` |
| Usage Limits Tracker | Daemon | Python | `scripts/usage-limits-tracker.py` |
| Backup Watcher | Daemon | Shell | `scripts/ha-backup-watcher.sh` |

## Container Architecture

### Base Image & Tooling

The container is built on the Home Assistant Alpine Linux 3.19 base image with these additions:

```dockerfile
# Core tools
bash, curl, nano, vim, jq, tree, git

# Runtime
nodejs (npm), python3, pip

# Terminal
tmux, ttyd (web terminal server)

# IPC
inotify-tools (file watching), websocat (WebSocket client)
```

Claude Code is installed via npm (not the binary installer) for Alpine compatibility.

### User Model

The container creates a non-root `claude` user (UID 1000) and runs Claude Code as that user via `su-exec`. This is required because Claude Code's `--dangerously-skip-permissions` flag refuses to operate as root — a safety guardrail that the add-on respects.

```
Root (startup) → su-exec claude → Claude Code
                               → MCP Server
                               → Listeners
```

### Persistent Storage

The add-on mounts a `/data` volume that persists across container restarts. The startup script creates symlinks from standard config paths to this persistent storage:

```
/data/
├── .config/claude/        ← OAuth credentials (symlinked from ~/.config/claude)
├── .claude/               ← Claude settings (symlinked from ~/.claude)
├── .claude.json           ← Session state
├── backups/               ← Git backup metadata
├── apk-packages.list      ← Persistent APK package list
├── pip-packages.list      ← Persistent pip package list
└── npm/                   ← Global npm packages
```

### Volume Mappings

| Mount | Access | Contents |
|-------|--------|----------|
| `/config` | Read/Write | HA configuration directory |
| `/data` | Read/Write | Persistent add-on storage |

The add-on also has access to the Supervisor API (`hassio_api`, `homeassistant_api`, `auth_api`) at the `manager` role level, which gives it broad but not unlimited access to HA's internals.

## MCP Server

The MCP (Model Context Protocol) server is a Python process that communicates with Claude Code over stdio. It implements the MCP protocol to expose 14 tools that query the Home Assistant Supervisor API.

### Communication Flow

```
Claude Code ←(stdio)→ MCP Server ←(HTTP)→ Supervisor API ←→ HA Core
```

The MCP server authenticates using the `SUPERVISOR_TOKEN` environment variable (provided automatically by the HA Supervisor to all add-ons) and makes requests to:

- `http://supervisor/core/api` — HA Core REST API
- `http://supervisor` — Supervisor API endpoints

### Tool Categories

**Entity & State** — Read current entity states, query the device registry, get logbook entries

**Service & Control** — Call HA services (turn on/off, set values), fire events, reload configurations

**Debugging & Info** — Get automation execution traces, read error logs, render Jinja2 templates, get HA config details

**System** — Get Supervisor info, list automations

Each tool handles error cases gracefully and returns structured data that Claude can reason about. The server includes rate limiting awareness and will report API errors clearly rather than crashing.

## File-Based IPC Bridge

The IPC (Inter-Process Communication) system connects the HA Core integration (running inside HA) with the add-on container (running separately). It uses a shared directory at `/config/.bruh_claude/` that both sides can read and write.

### Directory Structure

```
/config/.bruh_claude/
├── requests/          ← Integration writes, Listener reads
│   └── {uuid}.json
├── responses/         ← Listener writes, Integration reads
│   └── {uuid}.json
├── tasks/             ← Integration writes, Listener reads
│   └── {uuid}.json
├── task_results/      ← Listener writes, Integration reads
│   └── {uuid}.json
├── clear_sessions/    ← Session cleanup signals
├── logs/              ← Daily log files
│   ├── assist-YYYYMMDD.log
│   └── automation-YYYYMMDD.log
└── token_stats.json   ← Token usage data for sensors
```

### Request/Response Protocol

**Request JSON:**

```json
{
  "text": "What's the living room temperature?",
  "session_id": "abc123",
  "model": "sonnet",
  "conversation_history": [
    {"role": "user", "content": "Turn on the lights"},
    {"role": "assistant", "content": "Done — turned on 3 lights."}
  ]
}
```

**Response JSON:**

```json
{
  "response": "The living room temperature sensor reads 72.3°F.",
  "session_id": "abc123",
  "duration_seconds": 4.2,
  "tokens": {
    "input": 1250,
    "output": 45
  }
}
```

### Why File-Based?

The architecture uses file-based IPC rather than HTTP, WebSockets, or message queues for several reasons:

1. **No network dependencies** — works even if internal networking is disrupted
2. **Cross-container compatibility** — only requires a shared filesystem mount, which the Supervisor already provides via `/config`
3. **Simple debugging** — you can inspect request/response files directly with `cat` or `jq`
4. **Crash resilience** — incomplete requests are just orphaned files, not broken connections

The tradeoff is slightly higher latency compared to a direct API call, but for conversational AI responses (which take seconds anyway), the ~100ms overhead of file I/O is negligible.

## Custom Integration

The `custom_components/bruh_claude/` integration runs inside HA Core and provides:

### Conversation Agent

Registered as a conversation agent in HA's Voice Assistants system. Routes incoming messages through the IPC bridge to the add-on's Assist listener.

Key implementation details:

- Maintains in-memory conversation history per session (max 20 turns)
- Serializes conversation context into request JSON
- Polls for response files with configurable timeout (default 120s, 0.5s polling interval)

### Services

- `bruh_claude.send_prompt` — one-shot prompt, returns response directly
- `bruh_claude.run_task` — background task with optional notification
- `bruh_claude.clear_conversation` — clears session history

### Sensors

Token usage sensors that read from `/config/.bruh_claude/token_stats.json`, updated every 30 seconds. Session, daily, weekly, and all-time counters with attribution metadata.

## Startup Sequence

The `run.sh` script orchestrates a complex startup sequence:

```
1. Initialize persistent storage and symlinks
2. Create non-root 'claude' user (UID 1000)
3. Install persistent APK and pip packages
4. Deploy custom_components to /config
5. Install/update Claude Code via npm
6. Generate CLAUDE.md (if enabled)
7. Start background services:
   - Token stats tracker
   - Usage limits tracker
   - Backup watcher (if enabled)
   - Assist listener (if enabled)
   - Automation listener (if enabled)
8. Start MCP server
9. Launch ttyd web terminal
```

Each step includes error handling and logging. If a non-critical service fails to start, the add-on continues rather than failing entirely.

## Testing

The test suite covers all major components:

| Test File | Coverage |
|-----------|----------|
| `test_bridge.py` | File-based IPC communication |
| `test_config_validation.py` | Add-on config schema validation |
| `test_integration_python.py` | Python integration functionality |
| `test_mcp_server.py` | MCP server core tools |
| `test_mcp_device_tools.py` | Device control tools |
| `test_mcp_server_edge_cases.py` | Error handling and edge cases |
| `test_security.py` | Security validations |
| `test_shell_scripts.py` | Shell script functionality |

Run the tests from the repository root:

```bash
cd tests
python -m pytest -v
```

## Contributing

The source code is at [github.com/bruhautomation/BRUH-HA-Apps](https://github.com/bruhautomation/BRUH-HA-Apps). The main add-on code lives in `bruh-claude-terminal/`.

Key files to start with:

- `run.sh` — startup orchestration (the "main" function)
- `ha-mcp-server/ha_mcp_server.py` — MCP server implementation
- `custom_components/bruh_claude/` — HA integration
- `integrations/` — Assist and Automation listeners
- `config.yaml` — add-on manifest and option schema
