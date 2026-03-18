---
title: CLI Tools
description: Built-in command-line tools for managing your Home Assistant config from the BRUH Claude terminal.
---

BRUH Claude ships with a set of CLI tools that make common Home Assistant admin tasks fast and terminal-friendly. These are available in both the interactive terminal and can be used by Claude itself when working on your behalf.

## ha-reload

Reload Home Assistant configurations after editing YAML files — without leaving the terminal or restarting HA.

```bash
ha-reload automations     # Reload automations only
ha-reload scripts         # Reload scripts only
ha-reload scenes          # Reload scenes
ha-reload groups          # Reload groups
ha-reload core            # Reload core configuration (customize, persons, zones)
ha-reload all             # Reload everything at once
ha-reload check           # Validate config without applying (dry run)
```

The `check` subcommand is especially useful before reloading — it validates your YAML and reports errors without making any changes:

```bash
$ ha-reload check
✓ Configuration is valid
```

:::tip
Claude uses `ha-reload` automatically after editing your YAML files. If you ask Claude to "add a new automation for the garage door," it will write the YAML and reload automations in one go.
:::

## ha-log

View Home Assistant logs from inside the terminal. Supports filtering, following, and per-add-on logs.

```bash
ha-log core               # Last 100 lines of HA Core logs
ha-log supervisor         # Supervisor logs
ha-log host               # Host system logs
ha-log errors             # Filter for errors and warnings only
ha-log all                # Core + supervisor + errors combined

# Specific add-on logs
ha-log addon mosquitto
ha-log addon esphome

# Options
ha-log core -f            # Follow mode — streams logs in real-time
ha-log core -n 50         # Show last 50 lines instead of 100
ha-log errors -f          # Follow errors only (great for debugging)
```

### Example: Debugging a Zigbee Issue

```bash
$ ha-log errors -f
[homeassistant.components.zha] Device 0x00158d000xxxxxx is unavailable
[homeassistant.components.zha] Failed to send request: [ZigBee] ...
```

## ha-backup

Git-based configuration versioning. Every change to your `/config` directory is tracked, and you can restore individual files from any point in history.

### Creating Backups

```bash
ha-backup                                # Auto-generated commit message
ha-backup "Rewired all motion automations"   # Custom commit message
```

### Viewing History

```bash
ha-backup history          # Show recent commits (git log)
```

Example output:

```
abc1234 — 2026-03-17 10:30  Auto-backup
def5678 — 2026-03-17 09:15  Rewired all motion automations
ghi9012 — 2026-03-16 22:00  Auto-backup
```

### Comparing Changes

```bash
ha-backup diff             # Changes since last backup
ha-backup diff HEAD~3      # Changes across the last 3 backups
```

### Restoring Files

```bash
ha-backup restore automations.yaml         # Restore from the previous backup
ha-backup restore automations.yaml HEAD~5  # Restore from 5 backups ago
```

:::caution
Restore replaces the current file with the version from the specified commit. The current version is committed first as a safety net, so you can always undo a restore.
:::

## ha-context-gen

Regenerate the `CLAUDE.md` context file that gives Claude an overview of your HA installation. This runs automatically on startup when `auto_generate_context` is enabled, but you can trigger it manually after making significant changes.

```bash
ha-context-gen
```

The generated file includes entity counts by domain, a list of all automations with states and last-triggered times, installed add-ons, active integrations, and a directory structure map.

## persist-install

Install system packages and Python libraries that survive container restarts. Normally, anything you install inside an add-on container is wiped when the container is recreated. This tool stores your package list and reinstalls them on every startup.

### Install Packages

```bash
persist-install apk vim htop ncurses     # Alpine Linux packages
persist-install pip pandas numpy requests  # Python packages
```

### Manage Packages

```bash
persist-install list                # Show all persisted packages
persist-install remove apk vim      # Remove a package from the persist list
persist-install remove pip pandas   # Remove a Python package
```

Packages added via this tool are stored in the add-on's persistent `/data` volume and automatically installed during the startup sequence.

:::tip
You can also manage persistent packages through the add-on configuration UI using the `persistent_apk_packages` and `persistent_pip_packages` options.
:::

## health-check

Run startup diagnostics to verify that all components are working correctly.

```bash
health-check
```

This checks connectivity to the Supervisor API, MCP server status, file permissions, and integration health.

## claude-session-picker

An interactive tmux session manager with a TUI interface. This launches automatically when `auto_launch_claude` is `false`, or you can invoke it manually.

```bash
claude-session-picker
```

Features:

- List all active tmux sessions
- Create new Claude Code sessions with custom names
- Attach to existing sessions
- View session status and activity
