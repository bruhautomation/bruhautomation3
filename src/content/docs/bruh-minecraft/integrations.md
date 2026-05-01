---
title: Home Assistant Integration
description: Sensors, services, automation recipes, and the IPC bridge that connects BRUH Minecraft Server to Home Assistant.
---

The add-on auto-deploys a companion integration to `/config/custom_components/bruh_minecraft/` and registers itself with the Supervisor for auto-discovery. Once HA prompts you to set it up (in **Settings → Devices & Services**), all of the entities and services below are available.

## Device

All entities live under a single device named **BRUH Minecraft Server**. Find it in **Settings → Devices & Services → BRUH Minecraft → Device**.

## Sensors

| Entity | Description | Notable attributes |
|--------|-------------|--------------------|
| `sensor.bruh_minecraft_players_online` | Currently-online player count | `players` — list of names |
| `sensor.bruh_minecraft_players_max` | `max-players` from server.properties | |
| `sensor.bruh_minecraft_tps_1m` | 1-minute average TPS | Paper / Purpur / Folia only |
| `sensor.bruh_minecraft_tps_5m` | 5-minute average TPS | |
| `sensor.bruh_minecraft_tps_15m` | 15-minute average TPS | |
| `sensor.bruh_minecraft_latency_ms` | Status-ping latency in ms | |
| `sensor.bruh_minecraft_uptime` | Seconds since the JVM started | |
| `sensor.bruh_minecraft_version` | Server version string | `brand` — server brand string |
| `sensor.bruh_minecraft_server_type` | `paper` / `purpur` / etc. | |
| `sensor.bruh_minecraft_motd` | Current MOTD | |
| `sensor.bruh_minecraft_difficulty` | Current difficulty | |
| `sensor.bruh_minecraft_gamemode` | Current default gamemode | |

## Binary sensors

| Entity | Description |
|--------|-------------|
| `binary_sensor.bruh_minecraft_reachable` | `on` when the Minecraft status ping succeeds. |
| `binary_sensor.bruh_minecraft_rcon_ok` | `on` when the RCON handshake succeeds. *Disabled by default* — enable it from the device page if you want to alert on RCON outages specifically. |

## Buttons

Quick lifecycle actions on the device card.

| Entity | Action |
|--------|--------|
| `button.bruh_minecraft_backup_now` | Trigger an on-demand backup. |
| `button.bruh_minecraft_restart_server` | Save + RCON `stop`; the add-on auto-restarts the JVM. |
| `button.bruh_minecraft_stop_server` | Save + RCON `stop` with a `no_restart` flag — server stays down. |
| `button.bruh_minecraft_save_all` | Force-flush all chunk data to disk. |

## Services

All services route through a file-based IPC bridge at `/config/.bruh_minecraft/` — HA Core drops a JSON request, the add-on watches that folder, handles it via RCON, and writes a response file back.

```yaml
# Broadcast a message to everyone online
action: bruh_minecraft.say
data:
  message: "Dinner's ready — server going down in 2 minutes."

# Send any Minecraft command over RCON
action: bruh_minecraft.rcon_command
data:
  command: "weather clear"

# Give an item to an online player
action: bruh_minecraft.give
data:
  player: "Alice"
  item: "minecraft:diamond_pickaxe"
  amount: 1

# Set the weather
action: bruh_minecraft.set_weather
data:
  weather: "clear"   # clear | rain | thunder

# Set the time (shortcuts or absolute ticks)
action: bruh_minecraft.set_time
data:
  time: "day"        # day | night | noon | midnight | "12000"

# Lifecycle
action: bruh_minecraft.backup_now       # immediate backup
action: bruh_minecraft.restart_server   # graceful save + restart
action: bruh_minecraft.stop_server      # graceful save + stop (no auto-restart)

# Player management — all take player: "<name>"
action: bruh_minecraft.op_player
action: bruh_minecraft.deop_player
action: bruh_minecraft.kick_player
action: bruh_minecraft.ban_player
action: bruh_minecraft.whitelist_add
action: bruh_minecraft.whitelist_remove
```

## Notify platform

The integration registers a notify service called `notify.bruh_minecraft_broadcast`. Use it from any HA notification flow to broadcast to in-game chat:

```yaml
service: notify.bruh_minecraft_broadcast
data:
  message: "Doorbell just rang!"
```

Equivalent to `bruh_minecraft.say` but plumbed through the standard notify platform, so it works in places that expect a `notify.` target (HA companion app workflows, alert integrations, etc.).

## Example automations

### Nightly backup at 4 AM

```yaml
automation:
  - alias: Minecraft - nightly backup
    trigger: { platform: time, at: "04:00:00" }
    action:
      service: bruh_minecraft.backup_now
```

### Auto-stop when idle for 30 minutes

Saves CPU when nobody's playing. The server starts back up the next time you (or someone) hits the **Start** button on the add-on page or calls `bruh_minecraft.restart_server`.

```yaml
automation:
  - alias: Minecraft - auto-stop on idle
    trigger:
      - platform: numeric_state
        entity_id: sensor.bruh_minecraft_players_online
        below: 1
        for: "00:30:00"
    action:
      - service: bruh_minecraft.stop_server
```

### Bedtime kick

```yaml
automation:
  - alias: Minecraft - bedtime
    trigger:
      platform: numeric_state
      entity_id: sensor.bruh_minecraft_players_online
      above: 0
    condition:
      condition: time
      after: "22:30:00"
      before: "06:00:00"
    action:
      - service: bruh_minecraft.say
        data: { message: "Server going to sleep in 60s — save your work!" }
      - delay: "00:01:00"
      - service: bruh_minecraft.stop_server
```

### Low-TPS alert

```yaml
automation:
  - alias: Minecraft - lag alert
    trigger:
      - platform: numeric_state
        entity_id: sensor.bruh_minecraft_tps_1m
        below: 15
        for: "00:01:00"
    action:
      - service: notify.mobile_app_pixel
        data:
          title: "Minecraft server lagging"
          message: "TPS 1m is {{ states('sensor.bruh_minecraft_tps_1m') }}"
```

### Snapshot before a destructive command

```yaml
script:
  minecraft_safe_fill:
    sequence:
      - service: bruh_minecraft.backup_now
      - delay: "00:00:05"
      - service: bruh_minecraft.rcon_command
        data:
          command: "fill ~-10 ~ ~-10 ~10 ~ ~10 minecraft:stone"
```

### Voice control via BRUH Claude

If you have the [BRUH Claude](/bruh-claude/) add-on installed and use it as your Assist conversation agent, you can say things like:

> "Tell everyone on the server dinner's ready."

…and Claude will hit `bruh_minecraft.say` for you. No extra setup on the Minecraft side.

## How the IPC bridge works

The add-on container can't import `homeassistant` Python directly (different process, different lifecycle), so the integration and the add-on talk via the file system:

1. HA Core writes a JSON request to `/config/.bruh_minecraft/requests/<id>.json`.
2. The add-on's bridge daemon (`scripts/ha_bridge.py`) watches that folder, parses the request, runs the appropriate RCON command, and writes the result to `/config/.bruh_minecraft/responses/<id>.json`.
3. HA Core picks up the response and surfaces it as the service-call result.

State files (`stats.json`, `state.json`, `players.json`) in the same directory are how sensor values cross the boundary in the other direction. The integration polls them at a regular interval.

This design keeps the add-on container fully self-contained and survives HA restarts, integration reloads, and add-on upgrades without losing state.

## Disabling the integration

Set `enable_ha_integration: false` in the add-on configuration to skip deploying the custom component and stop the IPC bridge. The Minecraft server itself runs exactly the same — you just lose all of the entities, services, and the panel's HA-side wiring (the panel itself still works since it talks RCON directly).
