---
title: Reference
description: Every configuration option, service, sensor, CLI tool, and MCP capability for the BRUH Claude Terminal add-on — in one place.
---

Everything you might need to look up. Configure from **Settings → Add-ons → BRUH Claude Terminal → Configuration**.

## Configuration options

### Startup

| Option | Default | What it does |
|--------|---------|--------------|
| `auto_launch_claude` | `true` | Auto-start Claude when the terminal opens. `false` shows a session picker instead. |
| `auto_generate_context` | `true` | Regenerate `/config/CLAUDE.md` on boot — a snapshot of your install Claude reads at the start of each session. |
| `log_level` | `info` | `trace`, `debug`, `info`, `notice`, `warning`, `error`, `fatal`. Bump to `debug` when filing a bug. |

### Backups

| Option | Default | What it does |
|--------|---------|--------------|
| `auto_backup` | `true` | Git-based versioning of `/config`. Initialises a repo on first boot with sensible `.gitignore`. |
| `backup_interval_minutes` | `30` | Minutes between auto-commits (5–1440). |

### Native HA integrations

| Option | Default | What it does |
|--------|---------|--------------|
| `enable_ha_mcp_server` | `true` | The MCP server that gives Claude live entities, services, traces, logs, templates, reloads. |
| `enable_assist_integration` | `true` | Run as a conversation agent in HA Voice Assistants. |
| `enable_automation_integration` | `true` | Trigger Claude tasks from automations via the `bruh_claude.run_task` service. |
| `assist_max_turns` | `5` | Per-request agentic loop cap for Assist (1–20). |
| `automation_max_turns` | `10` | Per-request loop cap for automation tasks (1–50). |

### Permissions

| Option | Default | What it does |
|--------|---------|--------------|
| `dangerously_skip_permissions` | `false` | **Interactive terminal only.** Skips per-action confirmations. Conversation agents and automation tasks always skip permissions regardless (they can't prompt). |

### Volume access

The container always mounts `/share`, `/media`, `/backup` (read-only), `/addon_configs`, and `/addons`. Toggling these off doesn't unmount them — it just stops Claude from seeing them.

| Option | Default |
|--------|---------|
| `access_share` | `true` |
| `access_media` | `true` |
| `access_backup` | `true` |
| `access_addon_configs` | `true` |
| `access_addons` | `true` |
| `additional_directories` | `[]` — list of extra absolute paths inside the container |

### Persistent packages

The container is rebuilt fresh on every update. These keep your tools installed across rebuilds.

| Option | Default | Example |
|--------|---------|---------|
| `persistent_apk_packages` | `[]` | `["vim", "htop", "ripgrep"]` |
| `persistent_pip_packages` | `[]` | `["pandas", "requests"]` |

## Recommended presets

### Casual user — terminal only

```yaml
auto_launch_claude: true
auto_backup: true
auto_generate_context: true
enable_ha_mcp_server: true
enable_assist_integration: false
enable_automation_integration: false
dangerously_skip_permissions: false
```

### Power user — voice + automations

```yaml
auto_launch_claude: true
auto_backup: true
backup_interval_minutes: 15
enable_ha_mcp_server: true
enable_assist_integration: true
enable_automation_integration: true
dangerously_skip_permissions: true
assist_max_turns: 10
automation_max_turns: 20
```

## CLI tools

Available in the terminal.

| Command | What it does |
|---------|--------------|
| `ha-reload automations \| scripts \| scenes \| groups \| core \| all \| check` | Reload after editing YAML. |
| `ha-log core \| supervisor \| host \| addon <name> \| errors \| all` | View HA logs. Add `-f` to follow, `-n N` for line count. |
| `ha-backup ["msg"] \| history \| diff \| restore <file>` | Manual git backup, history, diff, single-file restore. |
| `ha-context-gen` | Regenerate `/config/CLAUDE.md`. |
| `persist-install apk\|pip <packages>` / `list` / `remove` | Manage persistent packages. |

## HA services

```yaml
# Send a prompt and wait for the response
service: bruh_claude.send_prompt
data:
  prompt: "What entities are offline?"
  timeout: 120

# Run a task in the background, with optional notification
service: bruh_claude.run_task
data:
  prompt: "Check today's error log and summarise the issues"
  notify: true
  timeout: 300
```

## Token usage sensors

Real values from the Anthropic API — not estimates. Updated every 30 seconds.

| Sensor | Tracks |
|--------|--------|
| Session Input / Output / Total | Current Claude session |
| Today Total | Resets at midnight |
| Weekly Total | Mon–Sun, with `session_count` attr |
| Weekly Sessions | Distinct sessions this week |
| All Time Total | Lifetime |

## MCP server tools

What Claude can do against your HA install:

| Tool | Use |
|------|-----|
| `get_entity_state` / `get_all_states` | Live entity state |
| `call_service` | Any HA service (turn on lights, etc.) |
| `get_automations` / `get_automation_trace` | Automation list and stored execution traces |
| `get_ha_config` / `get_services` / `get_device_registry` | Configuration and registry summaries |
| `get_logbook` / `get_error_log` | Recent activity and Supervisor journal |
| `render_template` | Jinja2 evaluation |
| `fire_event` | Custom events |
| `get_supervisor_info` | System info |
| `reload_config` | Reload after YAML edits |

## Where data lives

| Path | Contents |
|------|----------|
| `/config/CLAUDE.md` | Auto-generated install context |
| `/config/.bruh_claude/` | IPC bridge — request/response queues, logs |
| `/config/.bruh_claude/logs/{assist,automation}-YYYYMMDD.log` | Per-request debug logs |
| `/config/custom_components/bruh_claude/` | The HA integration |
| `/data/` (add-on volume) | OAuth credentials, git backups, persistent packages |

## Mobile UI

The terminal auto-detects touch devices and shows an on-screen toolbar.

- **`ESC` / `Tab` / `Ctrl` (sticky) / arrows / `^C` / `Paste`** — keys iOS doesn't give you.
- **Add to Home Screen** for a fullscreen launcher without Safari chrome.
- **Voice dictation** — turn off iOS **Voice Control** (Settings → Accessibility) to avoid double-submission. Auto-correct/auto-capitalize/spellcheck are already disabled in the terminal's text field.
- Disable the mobile UI entirely with `enable_mobile_ui: false`.

## When to restart Home Assistant

| Scenario | Restart? |
|----------|----------|
| First install | **Yes** — HA must load the new custom component |
| Add-on version upgrade | **Yes** — updated Python files need reloading (a notification appears) |
| Add-on restart, same version | No |
| Config option changes | No — read at add-on boot |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Add-on won't start | Check the **Log** tab. Architecture mismatch or port 7681 conflict. |
| Integration not discovered | Restart HA after the first add-on start. Add manually via **Settings → Devices & Services** if needed. |
| OAuth fails / "auth error" in Assist | Re-authenticate in the terminal. Existing agents work as long as the stored credentials are valid. |
| Claude can't see entities | `enable_ha_mcp_server: true`? Check the Log tab for `MCP server registered with Claude Code`. |
| Assist returns cut-off responses | Bump `assist_max_turns`. |
| Token sensors stay at zero | Brand-new installs show 0 until you've used Claude. If usage exists, verify `/config/.bruh_claude/token_stats.json` exists. |

### Per-request debug logs

Every Assist and automation request is logged with channel, prompt size, model, duration, response preview, and any stderr.

```bash
tail -f /config/.bruh_claude/logs/assist-$(date +%Y%m%d).log
tail -f /config/.bruh_claude/logs/automation-$(date +%Y%m%d).log
```

Set `log_level: debug` in the add-on config before reproducing a bug for maximum detail.
