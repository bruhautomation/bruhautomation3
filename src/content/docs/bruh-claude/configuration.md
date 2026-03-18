---
title: Configuration Reference
description: Every BRUH Claude Terminal configuration option explained.
---

All configuration is managed through the Home Assistant add-on UI. Navigate to **Settings → Add-ons → BRUH Claude Terminal → Configuration**.

## Options Reference

### auto_launch_claude

| | |
|---|---|
| **Type** | boolean |
| **Default** | `true` |

When `true`, the terminal automatically starts a Claude Code session when you open it. When `false`, you'll see a session picker that lets you choose which tmux session to attach to or create a new one.

Set to `false` if you frequently work with multiple tmux sessions and want to manage them manually.

### auto_backup

| | |
|---|---|
| **Type** | boolean |
| **Default** | `true` |

Enables automatic git-based versioning of your `/config` directory. When enabled, a background watcher commits changes at the interval specified by `backup_interval_minutes`.

The first run initializes a git repository in `/config` with a `.gitignore` that excludes secrets, databases, and log files.

### auto_generate_context

| | |
|---|---|
| **Type** | boolean |
| **Default** | `true` |

On startup, scans your Home Assistant installation and generates a `CLAUDE.md` file at `/config/CLAUDE.md`. This gives Claude immediate context about your entities, automations, integrations, and directory structure.

Disable if you maintain your own `CLAUDE.md` and don't want it overwritten.

### backup_interval_minutes

| | |
|---|---|
| **Type** | integer (5–1440) |
| **Default** | `30` |

How often the auto-backup watcher commits changes, in minutes. Lower values mean more granular history but more commits. Only applies when `auto_backup` is `true`.

### enable_ha_mcp_server

| | |
|---|---|
| **Type** | boolean |
| **Default** | `true` |

Starts the MCP (Model Context Protocol) server that gives Claude Code real-time access to the Home Assistant API. This is what powers entity queries, service calls, automation traces, and all the other live HA interactions.

There's rarely a reason to disable this unless you're debugging the MCP server itself.

### enable_assist_integration

| | |
|---|---|
| **Type** | boolean |
| **Default** | `true` |

Starts the Assist listener that watches for conversation requests from Home Assistant's voice/text assistant system. When enabled, you can select "BRUH Claude" as a conversation agent in **Settings → Voice Assistants**.

See [Integrations — Assist](/bruh-claude/integrations/#assist-voice--text-assistant) for setup details.

### enable_automation_integration

| | |
|---|---|
| **Type** | boolean |
| **Default** | `true` |

Starts the Automation listener that watches for task requests from HA automations. When enabled, automations can trigger Claude tasks via the `bruh_claude.run_task` service.

See [Integrations — Automation](/bruh-claude/integrations/#automation-triggered-tasks) for setup details.

### dangerously_skip_permissions

| | |
|---|---|
| **Type** | boolean |
| **Default** | `false` |

Controls whether the **interactive terminal** asks for confirmation before each tool call (file edits, shell commands, MCP tool calls).

- `true` — Claude executes actions without prompting. Faster workflow, relies on container sandboxing for safety.
- `false` — Claude prompts for confirmation on each action. Safer but slower.

:::note
This setting **only affects the interactive terminal**. Conversation agents and automation tasks always skip permissions because they run non-interactively.
:::

### assist_max_turns

| | |
|---|---|
| **Type** | integer (1–20) |
| **Default** | `5` |

Maximum number of agentic loop iterations for Assist conversation requests. Each "turn" is one round of Claude thinking, using a tool, and observing the result.

Higher values let Claude perform more complex multi-step tasks but increase response time and token usage. For simple Q&A, 3–5 turns is sufficient. For complex troubleshooting, you may want 10+.

### automation_max_turns

| | |
|---|---|
| **Type** | integer (1–50) |
| **Default** | `10` |

Maximum agentic loop iterations for automation-triggered tasks. These tend to be more complex than Assist queries, so the default is higher.

### persistent_apk_packages

| | |
|---|---|
| **Type** | list of strings |
| **Default** | `[]` |

Alpine Linux (APK) packages to install automatically on every container startup. Useful for tools you always want available.

```yaml
persistent_apk_packages:
  - vim
  - htop
  - ncurses
```

You can also manage these at runtime with `persist-install apk <package>`.

### persistent_pip_packages

| | |
|---|---|
| **Type** | list of strings |
| **Default** | `[]` |

Python (pip) packages to install on every startup.

```yaml
persistent_pip_packages:
  - pandas
  - requests
  - pyyaml
```

### log_level

| | |
|---|---|
| **Type** | list selection |
| **Default** | `info` |
| **Options** | `trace`, `debug`, `info`, `notice`, `warning`, `error`, `fatal` |

Controls logging verbosity for the add-on. Set to `debug` when troubleshooting startup issues or MCP server behavior.

## Recommended Configurations

### Casual User

For someone who primarily uses the interactive terminal for occasional troubleshooting:

```yaml
auto_launch_claude: true
auto_backup: true
auto_generate_context: true
enable_ha_mcp_server: true
enable_assist_integration: false
enable_automation_integration: false
dangerously_skip_permissions: false
```

### Power User

For someone who wants voice control, automation tasks, and a streamlined terminal experience:

```yaml
auto_launch_claude: true
auto_backup: true
auto_generate_context: true
backup_interval_minutes: 15
enable_ha_mcp_server: true
enable_assist_integration: true
enable_automation_integration: true
dangerously_skip_permissions: true
assist_max_turns: 10
automation_max_turns: 20
```

### Developer / Contributor

For someone developing or debugging the add-on itself:

```yaml
auto_launch_claude: false
auto_backup: false
auto_generate_context: false
enable_ha_mcp_server: true
enable_assist_integration: true
enable_automation_integration: true
dangerously_skip_permissions: false
log_level: debug
```
