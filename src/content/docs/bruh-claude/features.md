---
title: Features & Usage
description: Everything you can do with BRUH Claude — from the interactive terminal to voice-controlled AI.
---

BRUH Claude is built around one idea: Claude should understand your Home Assistant instance the way you do. Here's everything it can do.

## Interactive Terminal

The core experience is a web-based terminal (powered by ttyd and tmux) that runs Claude Code with full access to your HA configuration directory. Open it from the sidebar by clicking the **BRUH Claude** panel.

From here, you can have natural-language conversations with Claude about your smart home:

```
> Show me all automations that haven't triggered in the last 30 days

I'll check your automations and their last-triggered times.

Found 4 automations that haven't triggered in over 30 days:

1. automation.guest_room_welcome_lights — last triggered 47 days ago
2. automation.garage_door_reminder — last triggered 62 days ago
3. automation.holiday_lights_schedule — last triggered 91 days ago
4. automation.old_motion_sensor_test — never triggered

Would you like me to review any of these for issues, or disable the ones
that look unused?
```

Claude doesn't just read YAML files — it uses the MCP server to query live entity states, automation traces, and the device registry.

### Multi-Session Support

BRUH Claude uses tmux under the hood, so you can run multiple concurrent sessions:

```bash
# The session picker launches automatically if auto_launch_claude is false
# Or you can manage sessions manually:
tmux new-session -s debug       # Start a new session named "debug"
tmux list-sessions               # See all active sessions
tmux attach -t debug             # Reattach to a session
```

This is useful for running long background tasks while keeping your main terminal free.

## Native HA API Access (MCP Server)

The built-in MCP (Model Context Protocol) server is what makes BRUH Claude fundamentally different from running Claude Code on a regular machine. It provides Claude with 14 purpose-built tools that connect directly to the Home Assistant Supervisor API.

<div style="margin: 2rem 0;">
  <img src="/images/bruh-claude/mcp-tools.svg" alt="MCP Server Tools Overview" style="width: 100%; border-radius: 8px;" />
</div>

### What Claude Can Do

**Query entities and states:**

```
> What's the temperature in the bedroom right now?

The bedroom temperature sensor (sensor.bedroom_temperature) currently reads 68.4°F.
It was last updated 2 minutes ago.
```

**Call services to control devices:**

```
> Turn off all the lights downstairs

I'll call the light.turn_off service for the downstairs area.
✓ Turned off 6 lights in the Downstairs area.
```

**Debug automations with trace data:**

```
> Why didn't my morning routine automation run today?

Let me check the automation trace...

automation.morning_routine last ran yesterday at 7:00 AM.
Looking at today's trace: the trigger fired at 7:00 AM but the condition
"binary_sensor.workday" evaluated to false — today is Saturday.

Your condition blocks the automation on non-workdays. If you want it to run
on weekends too, I can update the condition for you.
```

**Render Jinja2 templates:**

```
> What would this template evaluate to: {{ states('sensor.energy_daily') | float * 0.12 }}

The template evaluates to: 2.736
(sensor.energy_daily is currently 22.8, multiplied by 0.12 = 2.736)
```

## Auto-Generated Context

On every startup (when `auto_generate_context` is enabled), BRUH Claude scans your installation and generates a `CLAUDE.md` file at `/config/CLAUDE.md`. This file gives Claude immediate context about:

- Entity counts by domain (e.g., "147 entities: 42 lights, 28 sensors, 15 automations…")
- Full automation list with states and last-triggered timestamps
- Installed add-ons and integrations
- Directory structure of `/config`

You can regenerate it manually at any time:

```bash
ha-context-gen
```

This means when you ask Claude something like "which integrations am I using?", it already knows — without having to query every API endpoint first.

## Git-Based Config Backup

BRUH Claude automatically versions your `/config` directory with git. Every change is tracked, and you can roll back individual files at any time.

### How It Works

1. On first run, the add-on initializes a git repository in `/config` with a sensible `.gitignore` (excludes secrets, databases, large log files)
2. A background watcher auto-commits changes at a configurable interval (default: 30 minutes)
3. You can trigger manual snapshots and restore files from any previous commit

### Backup Commands

```bash
ha-backup                           # Snapshot with auto-generated message
ha-backup "Rewired motion automations"  # Snapshot with custom message
ha-backup history                   # View commit log
ha-backup diff                      # Show changes since last backup
ha-backup diff HEAD~5               # Show changes across last 5 backups
ha-backup restore automations.yaml  # Restore a file from previous backup
```

:::caution
The git backup is local to your HA instance. For off-site protection, consider pushing to a remote repository.
:::

## Persistent Environment

Normally, anything you install inside a Home Assistant add-on container is lost when the container restarts. BRUH Claude solves this by persisting packages across restarts.

### Via Add-on Configuration

Add packages to the `persistent_apk_packages` or `persistent_pip_packages` lists in the add-on config. They'll be installed automatically on every startup.

### Via CLI

```bash
persist-install apk vim htop ncurses  # Install Alpine packages
persist-install pip pandas requests    # Install Python packages
persist-install list                   # See what's persisted
persist-install remove apk vim         # Remove from persistence list
```

## Token Usage Tracking

The integration exposes real-time token usage sensors in Home Assistant. These aren't estimates — they read actual values from the Anthropic API.

| Sensor | What It Tracks |
|--------|---------------|
| Session Input Tokens | Input tokens for the current Claude session |
| Session Output Tokens | Output tokens for the current session |
| Session Total Tokens | Combined tokens for the current session |
| Today Total Tokens | Total tokens consumed today (resets at midnight) |
| Weekly Total Tokens | Total tokens this week (Monday–Sunday) |
| Weekly Sessions | Number of distinct Claude sessions this week |
| All Time Total Tokens | Lifetime token usage |

A background tracker scans Claude Code's session JSONL files every 60 seconds and writes stats to a JSON file that the HA sensors poll every 30 seconds.

:::tip
Create a Lovelace dashboard card with these sensors to keep an eye on your API usage at a glance.
:::

## Permissions Model

Claude Code includes a `--dangerously-skip-permissions` flag that controls whether it asks for confirmation before executing actions (file edits, shell commands, MCP tool calls).

| Channel | Permission Behavior | Configurable? |
|---------|-------------------|---------------|
| Interactive terminal | Controlled by config option | Yes |
| Conversation agents (Assist) | Always skips permissions | No — can't prompt interactively |
| Automation tasks | Always skips permissions | No — runs non-interactively |

The add-on container provides natural sandboxing: Claude can only access `/config` and `/data`, runs as a non-root user (UID 1000), and cannot reach the host OS or other containers.

Additionally, the add-on writes a `settings.local.json` file that pre-allows all MCP tools, so background integrations can call HA services without manual approval.
