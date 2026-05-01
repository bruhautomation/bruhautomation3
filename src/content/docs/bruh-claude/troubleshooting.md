---
title: Troubleshooting
description: Fixes for the most common BRUH Claude issues — installation, integration discovery, authentication, conversation agents, and where to find debug logs.
---

The fastest way to diagnose a misbehaving BRUH Claude install is the **Log** tab on the add-on page (boot / supervisor errors) and the per-request debug logs at `/config/.bruh_claude/logs/` (Assist + automation behaviour). Set `log_level: debug` in the add-on configuration before reproducing if you're filing a bug.

## Installation

### Add-on won't start

Check the **Log** tab for errors. The most common causes:

- **Architecture mismatch.** Only `amd64` and `aarch64` are supported. Other architectures aren't built.
- **Port 7681 conflict.** Something else on the host is bound to 7681. Stop it, or change the mapping in the add-on's **Network** tab (ingress doesn't depend on the port mapping, but a clashing port stops the container from starting).
- **Stuck OAuth state from a prior install.** Clear `/data/.config/claude/` from the add-on's storage and restart.

### Integration not discovered

The `bruh_claude` integration is discovered via Supervisor on add-on startup. If it doesn't appear in **Settings → Devices & Services**:

1. Make sure you **restarted Home Assistant** after the first add-on start. HA only loads custom components at boot.
2. Check the add-on Log tab for the line `Custom integration deployed to /config/custom_components/bruh_claude/`. If it's missing, the deploy failed.
3. Add it manually: **Settings → Devices & Services → Add Integration → BRUH Claude**.

### Authentication fails

After an add-on update you may need to re-authenticate with Anthropic in the terminal.

- Existing conversation agents keep working as long as the stored OAuth credentials are valid.
- If conversation agents start returning auth errors, open the terminal and complete the OAuth login again — that refreshes the credentials at `/data/.config/claude/`.
- A failed OAuth flow that hangs forever is almost always a network issue from the HA host out — verify the host can reach `console.anthropic.com`.

## Runtime issues

### Claude can't access HA data

If Claude says it can't see entities, services, or automations:

1. Verify `enable_ha_mcp_server: true` in the add-on configuration.
2. Check the add-on Log tab for the line `MCP server registered with Claude Code`. If it's missing, Claude Code didn't pick up the `.mcp.json` config — restart the add-on.
3. From the terminal: `cat /home/claude/.config/claude-code/mcp.json` should show the `home-assistant` MCP server entry.

### Conversation agent ("BRUH Claude") doesn't respond in Assist

1. Confirm `enable_assist_integration: true` in the add-on config.
2. Make sure **BRUH Claude** is selected as the conversation agent in **Settings → Voice Assistants → [your pipeline]**.
3. Check `/config/.bruh_claude/logs/assist-YYYYMMDD.log` for the request — every Assist invocation is logged. If nothing's there, the listener isn't running (look in the add-on Log tab for startup errors).
4. Long replies cut off mid-thought? Bump `assist_max_turns` (default `5`).

### Automation tasks don't fire

1. Confirm `enable_automation_integration: true` in the add-on config.
2. Make sure your automation drops a JSON file into `/config/.bruh_claude/automation-tasks/` (or calls `bruh_claude.run_task`).
3. Check `/config/.bruh_claude/logs/automation-YYYYMMDD.log` for what was received and how long it took.
4. Complex tasks getting truncated? Bump `automation_max_turns` (default `10`, max `50`).

### Token sensors stay at zero / unavailable

The token tracker scans Claude Code's session JSONL files every 60 seconds and writes stats to `/config/.bruh_claude/token_stats.json`. The HA sensors poll that file every 30 seconds.

- A brand-new install with no Claude usage will show `0` everywhere — that's correct.
- If usage exists but the sensors stay unavailable, check `/config/.bruh_claude/token_stats.json`. If the file is missing, the tracker daemon isn't running — look for `token-stats-tracker.py` errors in the add-on Log tab.

## Debug logs

### Per-request logs

The add-on writes detailed debug logs for every conversation agent and automation task request, separately from the add-on system log. These tell you exactly what was sent to Claude, how long it took, and what came back.

| Log file | Contents |
|----------|----------|
| `/config/.bruh_claude/logs/assist-YYYYMMDD.log` | Conversation agent (Assist) requests and responses |
| `/config/.bruh_claude/logs/automation-YYYYMMDD.log` | Automation task requests and results |

Each entry includes:

- **Channel** — Assist vs automation
- **User text** — what the user said
- **Model** — which Claude model was used
- **History turns** — how many prior conversation turns were included
- **Prompt size** — total characters sent to Claude
- **Flags** — what CLI flags were passed (e.g., `--dangerously-skip-permissions`)
- **Duration** — wall-clock time for the Claude invocation
- **Response size** — characters and lines in the response
- **Token / cost info** — extracted from Claude Code's stderr output (when available)
- **Response preview** — first 200 characters of the response
- **Stderr output** — any errors or diagnostics from Claude Code

### Tailing logs from the terminal

```bash
# Today's conversation agent logs
cat /config/.bruh_claude/logs/assist-$(date +%Y%m%d).log

# Follow logs in real-time
tail -f /config/.bruh_claude/logs/assist-$(date +%Y%m%d).log

# Today's automation logs
cat /config/.bruh_claude/logs/automation-$(date +%Y%m%d).log

# List all log files
ls -la /config/.bruh_claude/logs/
```

### Add-on system logs

For startup issues and overall add-on health, the add-on **Log** tab in **Settings → Add-ons → BRUH Claude Terminal** is the single best place to look. From the terminal:

```bash
ha-log addon bruh_claude_terminal
```

Bump `log_level: debug` in the add-on Configuration tab before reproducing a bug to get the most detail.

## Filing a bug

If you've followed the steps above and still can't get something working:

1. Set `log_level: debug` in the add-on Configuration tab and restart.
2. Reproduce the issue once.
3. Grab:
   - The add-on **Log** tab output (boot + the failing operation).
   - The relevant `/config/.bruh_claude/logs/{assist,automation}-YYYYMMDD.log` entry, if applicable.
   - Your add-on configuration (redact any secrets).
4. Open an issue at <https://github.com/bruhautomation/BRUH-HA-Apps/issues>.
