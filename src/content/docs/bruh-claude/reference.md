---
title: Reference
description: Every configuration option, service, sensor, CLI tool, and MCP capability for the BRUH Terminal add-on — in one place.
---

Everything you might need to look up. Configure from **Settings → Add-ons → BRUH Terminal → Configuration**. The defaults work out of the box; the table below mirrors `config.yaml` as shipped.

## Configuration options

### Startup

| Option | Default | What it does |
|--------|---------|--------------|
| `auto_launch_claude` | `true` | Launch Claude Code immediately in the web terminal. `false` lands on the shell with a session picker instead. |
| `auto_generate_context` | `true` | Regenerate `/config/CLAUDE.md` on boot — a snapshot of your install (entities by domain, automations + states, add-ons, integrations, file tree) that Claude reads at the start of each session. |
| `log_level` | `info` | `trace`, `debug`, `info`, `notice`, `warning`, `error`, `fatal`. Bump to `debug` when filing a bug. |
| `enable_mobile_ui` | `true` | Splice the touch toolbar + iOS fixes into the terminal. `false` falls back to ttyd's stock UI. |

### Backups

| Option | Default | What it does |
|--------|---------|--------------|
| `auto_backup` | `true` | Git-based versioning of `/config`. Initialises a repo on first boot with a sensible `.gitignore` (excludes secrets, DBs, logs). |
| `backup_interval_minutes` | `30` | Minutes between auto-commits (5–1440). `ha-backup` triggers an on-demand commit any time. |

### Native HA integrations

| Option | Default | What it does |
|--------|---------|--------------|
| `enable_ha_mcp_server` | `true` | The MCP server that gives Claude live entities, device control, cameras, history, traces, logs, templates, and reloads. |
| `enable_assist_integration` | `true` | Run as a conversation agent in HA Voice Assistants. |
| `assist_fast_mode` | `true` | Keep pre-warmed Claude workers alive for voice (one per active conversation plus a hot spare) so turns skip the CLI boot and MCP handshake. ~150–300 MB RAM per warm worker (max 3). `false` uses the classic spawn-per-request listener. |
| `enable_automation_integration` | `true` | Trigger Claude tasks from automations via `bruh_claude.run_task`. |

### Turn budgets

These cap how many agentic loops Claude runs before returning — lower is cheaper and faster, higher gives room to chain tool calls.

| Option | Default | What it does |
|--------|---------|--------------|
| `assist_max_turns` | `5` | Per-request cap for the voice agent (1–20). Enough for the common check/toggle/summarise flows. |
| `automation_max_turns` | `10` | Per-request cap for automation tasks (1–50) — they do more multi-step work unattended. |

### Permissions & tool scoping

| Option | Default | What it does |
|--------|---------|--------------|
| `assist_tool_access` | `mcp_only` | What voice may do. `mcp_only` allows every HA MCP tool (full device control, cameras, history, any service call) but denies shell, **all** file access, and web — so voice can't author automations or read `secrets.yaml`. `full` lifts the restriction. |
| `dangerously_skip_permissions` | `false` | **Interactive terminal only.** Skips per-action confirmation prompts. Background channels (voice, automations, insights) are unaffected — they use a pre-approved allowlist instead. |

:::note[Per-agent Blocked services]
Beyond the coarse `assist_tool_access` switch, each voice agent has its own **Blocked services** picker (in its config) — patterns like `lock.unlock` or a whole `alarm_control_panel.*` that *that* agent may never call. It's enforced in the MCP server's `call_service` chokepoint, so it covers every device tool and phrasing, not just the generic call.
:::

### Volume access

The container always mounts `/share`, `/media`, `/backup` (read-only), `/addon_configs`, and `/addons`. Toggling one off doesn't unmount it — it stops Claude's tools from being pointed at it (defence in depth).

| Option | Default |
|--------|---------|
| `access_share` | `true` |
| `access_media` | `true` |
| `access_backup` | `true` |
| `access_addon_configs` | `true` |
| `access_addons` | `true` |
| `additional_directories` | `[]` — extra absolute container paths to expose |

### Persistent packages

The container is rebuilt fresh on every update. These keep your tools installed across rebuilds.

| Option | Default | Example |
|--------|---------|---------|
| `persistent_apk_packages` | `[]` | `["vim", "htop", "ripgrep"]` |
| `persistent_pip_packages` | `[]` | `["pandas", "requests"]` |

## Recommended presets

### Casual — terminal only

```yaml
auto_launch_claude: true
auto_backup: true
auto_generate_context: true
enable_ha_mcp_server: true
enable_assist_integration: false
enable_automation_integration: false
dangerously_skip_permissions: false
```

### Power user — voice + automations + insights

```yaml
auto_launch_claude: true
auto_backup: true
backup_interval_minutes: 15
enable_ha_mcp_server: true
enable_assist_integration: true
assist_fast_mode: true
assist_tool_access: mcp_only
enable_automation_integration: true
assist_max_turns: 8
automation_max_turns: 20
```

## Voice assistant (Assist)

Select **BRUH Claude** as a conversation agent in **Settings → Voice Assistants**. Each agent has its own name, model, personality, and blocked-services list. New agents default to Claude Haiku (`Default` inherits the terminal's model); `bruh_claude.clear_conversation` resets conversation memory (omit `conversation_id` to reset all). How it works — fast mode, the area map, personalities: [Voice Assistant](/bruh-claude/voice/).

## Insight jobs

Scheduled Claude reports, created from **Settings → Devices & Services → BRUH Claude → Add Service → Insight job**. The report lands in the sensor's attributes: `preview` (first lines), `markdown` (full report), `card_yaml` (ready-to-paste card). A `bruh_claude_insight_complete` event fires after every run with `name`, `entity_id`, `success`, and `preview`. Templates, scheduling, and dashboard recipes: [Automations & Insight Jobs](/bruh-claude/automations/#insight-jobs).

## HA services

```yaml
# Send a prompt and wait for the response
service: bruh_claude.send_prompt
data:
  prompt: "What entities are offline?"
  timeout: 120
  model: haiku        # optional per-call override

# Run a task in the background, with optional notification
service: bruh_claude.run_task
data:
  prompt: "Check today's error log and summarise the issues"
  notify: true
  timeout: 300

# Run one or all insight jobs now
service: bruh_claude.run_insight
data:
  name: "Daily Briefing"   # omit to run all

# Reset conversation memory
service: bruh_claude.clear_conversation
# data: { conversation_id: "..." }   # omit to clear all
```

## Sensors

### Usage-limit sensors

Your real Anthropic account utilization — the same numbers as **claude.ai → Settings → Usage**, not estimates. A background tracker queries the Anthropic usage endpoint every ~2 minutes; the sensors poll it every 30 seconds.

| Sensor | Tracks | Key attributes |
|--------|--------|----------------|
| Session Usage | Percent of the current 5-hour session window used | `resets_at`, `data_source`, `last_updated` |
| Session Usage Resets At | When the 5-hour window resets | `utilization` |
| Weekly Usage | Percent of the rolling 7-day window used | `resets_at`, `data_source`, `last_updated` |
| Weekly Usage Resets At | When the 7-day window resets | `utilization` |

:::caution
These need an **OAuth / subscription login** (the one you do in the terminal), **not** an `ANTHROPIC_API_KEY`. With an API key — or before you've logged in — they stay **unavailable** and explain why in their `error` attribute. `ha-selftest` reports this.
:::

### Health sensor

`binary_sensor.bruh_claude_system_assist_healthy` reports voice-assistant pool health, with worker count, the pre-warmed spare, and last-request latency as attributes.

## MCP server tools

The built-in MCP server gives Claude **34 tools** against your live install — including `get_registry` (areas, floors, labels, devices, entities, integrations, users) and `call_service` with `return_response` for the [Power Tools](/bruh-claude/power-tools/) workflow. Verify them on your own system with **`ha-selftest`**. Full tool-by-tool reference: [MCP Tools](/bruh-claude/mcp/).

![MCP server tools by category](/images/bruh-claude/mcp-tools.svg)

## CLI tools

Available in the terminal.

| Command | What it does |
|---------|--------------|
| `ha-reload automations \| scripts \| scenes \| groups \| core \| all \| check` | Reload after editing YAML. |
| `ha-log core \| supervisor \| host \| addon <name> \| errors \| all` | View HA logs. `-f` to follow, `-n N` for line count. |
| `ha-backup ["msg"] \| history \| diff \| restore <file>` | Manual git backup, history, diff, single-file restore. |
| `ha-context-gen` | Regenerate `/config/CLAUDE.md`. |
| `persist-install apk\|pip <packages>` / `list` / `remove` | Manage persistent packages. |
| `ha-selftest` | End-to-end diagnostic: API auth, the MCP server over stdio, the integration, listeners, login, sensors — PASS/FAIL with fix hints. |
| `ha-entity` / `ha-service` / `ha-yaml-check` / `ha-notify` / `ha-share` / `ha-addon` | Focused helpers for entity state, service calls, YAML validation, notifications, the share folder, and add-on info. |

## Transport & health

In fast mode the worker pool serves an internal HTTP API (port 8099 on the hassio network, token-authenticated via the shared `/config` volume). The integration prefers it — no file polling, and replies stream so TTS starts at the first sentence. If the API is ever unreachable, both sides fall back to the original file protocol automatically.

![File-based IPC fallback flow](/images/bruh-claude/ipc-flow.svg)

## Permissions architecture

| Channel | Mechanism | Default access |
|---------|-----------|----------------|
| Interactive terminal | Prompts (unless `dangerously_skip_permissions: true`) | Everything — you approve actions |
| Voice / conversation agents | Pre-approved allowlist + `assist_tool_access` + per-agent deny-list | All HA MCP tools; **no** shell, file, or web |
| Automation tasks & insight jobs | Pre-approved allowlist | All tools (MCP, shell, file edits, web) |

Background channels never use `--dangerously-skip-permissions` — they can't prompt, so the add-on writes `/config/.claude/settings.local.json` pre-approving the tools they need. Everything runs sandboxed as a non-root user (UID 1000), limited to `/config`, `/data`, and the enabled volume toggles.

## Where data lives

| Path | Contents |
|------|----------|
| `/config/CLAUDE.md` | Auto-generated install context |
| `/config/.bruh_claude/` | IPC bridge — request/response queues, sessions, logs |
| `/config/.bruh_claude/usage_limits.json` | Cached account utilization for the sensors |
| `/config/.bruh_claude/logs/{assist,automation}-YYYYMMDD.log` | Per-request debug logs |
| `/config/custom_components/bruh_claude/` | The HA integration |
| `/data/` (add-on volume) | OAuth credentials, git backups, persistent packages |

## Mobile UI

The terminal auto-detects touch devices and shows an on-screen toolbar above the keyboard.

- **`ESC` / `Tab` / `Ctrl` / arrows / `PgUp` / `PgDn` / `^C` / `Paste`** — the keys iOS doesn't give you, plus paging Claude Code's chat history.
- **Scroll chat history** by swiping up/down with one finger (or the mouse wheel on desktop) — translated to PgUp/PgDn, so long-press text selection still works for copying an OAuth URL.
- **Add to Home Screen** for a full-screen launcher without Safari chrome.
- **Voice dictation:** turn off iOS **Voice Control** (Settings → Accessibility) to avoid double-submission.
- Disable the whole mobile UI with `enable_mobile_ui: false`.

## When to restart Home Assistant

| Scenario | Restart? |
|----------|----------|
| First install | **Yes** — HA must load the new custom component |
| Add-on version upgrade | **Yes** — updated Python files need reloading (a notification + repair appear) |
| Add-on restart, same version | No |
| Config option changes | No — read at add-on boot |

:::tip[Update not showing up?]
The Supervisor only re-pulls add-on repositories periodically. To pick up a fresh release immediately: **Add-on Store → ⋮ → Check for updates**.
:::

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Add-on won't start | Check the **Log** tab. Architecture mismatch or port 7681 conflict. |
| Terminal opens then closes | Update to **3.2.0+** (older builds broke on a Claude Code native-binary/libc mismatch). |
| Integration not discovered | Restart HA after the first add-on start. Add manually via **Settings → Devices & Services** if needed. |
| Claude can't see entities | `enable_ha_mcp_server: true`? Run **`ha-selftest`** — it reports any tool that errors. |
| Voice replies cut off | Bump `assist_max_turns`. |
| Voice agent answers wrong room | Run `ha-selftest` — the "Assist area map" check confirms the room map is built. |
| Usage sensors *unavailable* | They need an OAuth/subscription login, not an API key (see above). |

### Per-request debug logs

Every Assist and automation request is logged with channel, prompt size, model, the speed path it took (`warm`/`spare`/`cold`/`…+fallback`), duration, and a response preview.

```bash
tail -f /config/.bruh_claude/logs/assist-$(date +%Y%m%d).log
tail -f /config/.bruh_claude/logs/automation-$(date +%Y%m%d).log
```

Set `log_level: debug` in the add-on config before reproducing a bug for maximum detail.

## Disclaimer

BRUH Terminal is an independent project, not affiliated with, endorsed by, or sponsored by Anthropic. "Claude" and "Claude Code" are trademarks of Anthropic, PBC. The add-on runs the official Claude Code CLI under your own Anthropic account; your use of Claude through it is governed by [Anthropic's terms](https://www.anthropic.com/legal/consumer-terms).
