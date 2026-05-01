---
title: Configuration Reference
description: Every BRUH Minecraft Server option, what it does, and recommended presets for common setups.
---

All configuration is managed through the Home Assistant add-on UI: **Settings → Add-ons → BRUH Minecraft Server → Configuration**. The Supervisor validates every value against the schema in `config.yaml` before the add-on starts.

## Required

### eula

| | |
|---|---|
| **Type** | boolean |
| **Default** | `false` |

You **must** set this to `true` to start the server. It accepts the [Minecraft EULA](https://www.minecraft.net/eula). The add-on will refuse to start otherwise — that's a Mojang requirement.

## World selection

### active_world

| | |
|---|---|
| **Type** | string (`^[A-Za-z0-9_-]{1,32}$`) |
| **Default** | `default` |

Which saved server profile is currently live. Each profile lives at `/config/minecraft-worlds/<name>/` with its own world, `server.properties`, plugins, and backup history. See [Switchable multi-world profiles](/bruh-minecraft/features/#switchable-multi-world-profiles) for the full workflow.

## Server type & version

### server_type

| | |
|---|---|
| **Type** | `paper` \| `purpur` \| `folia` \| `vanilla` \| `fabric` \| `forge` |
| **Default** | `paper` |

Which distribution to run. `paper` is the recommended default — best performance, plugin ecosystem, and the only one with TPS sensors.

### minecraft_version

| | |
|---|---|
| **Type** | `LATEST` \| `SNAPSHOT` \| pinned (`x.y[.z]`) |
| **Default** | `LATEST` |

`LATEST` resolves to the newest stable release of the selected type on every boot. `SNAPSHOT` tracks the latest dev build. A pinned version (e.g. `1.21.3`) freezes to that exact build.

### auto_update_server

| | |
|---|---|
| **Type** | boolean |
| **Default** | `true` |

Re-resolve the jar on every add-on start. Disable to pin to the currently-installed jar.

## Gameplay

### motd / difficulty / gamemode

| Option | Type | Default |
|--------|------|---------|
| `motd` | string | `A BRUH Minecraft Server` |
| `difficulty` | `peaceful` \| `easy` \| `normal` \| `hard` | `normal` |
| `gamemode` | `survival` \| `creative` \| `adventure` \| `spectator` | `survival` |

### Player limits

| Option | Type | Default |
|--------|------|---------|
| `max_players` | 1–1000 | `20` |
| `view_distance` | 3–32 | `10` |
| `simulation_distance` | 3–32 | `10` |
| `spawn_protection` | 0–10000 | `16` |

### Auth & PvP

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `online_mode` | bool | `true` | Validate every login against Microsoft / Mojang. Turn **off** for cracked / offline / kids-without-Xbox play. |
| `enforce_secure_profile` | bool | `false` | Require Mojang-signed chat profiles (MC 1.19+). Auto-forced to `false` whenever `online_mode` is off. |
| `pvp` | bool | `true` | |
| `hardcore` | bool | `false` | |
| `allow_flight` | bool | `false` | |
| `white_list` | bool | `false` | |

### World generation

| Option | Type | Default |
|--------|------|---------|
| `level_name` | string | `world` |
| `level_seed` | string | `""` (random) |
| `level_type` | string | `minecraft:normal` |
| `allow_nether` | bool | `true` |
| `generate_structures` | bool | `true` |
| `spawn_monsters` / `spawn_animals` / `spawn_npcs` | bool | `true` |
| `max_world_size` | 1–29999984 | `29999984` |

:::caution
Changing `level_name` or `level_seed` only takes effect when a fresh world is being generated. To reset, move the world directory aside under the active profile and restart.
:::

### Resource pack

| Option | Type | Default |
|--------|------|---------|
| `resource_pack` | URL | `""` |
| `resource_pack_sha1` | string | `""` |
| `require_resource_pack` | bool | `false` |

### Networking

| Option | Type | Default |
|--------|------|---------|
| `network_compression_threshold` | -1–65536 | `256` |
| `entity_broadcast_range_percentage` | 10–1000 | `100` |
| `prevent_proxy_connections` | bool | `false` |
| `hide_online_players` | bool | `false` |

### Cheats & ops

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `enable_command_block` | bool | `false` | |
| `op_permission_level` | 1–4 | `4` | |
| `allow_cheats` | bool | `false` | One-click enables `/gamemode`, `/give`, `/tp`, `/summon`, `/fill`, etc. Forces `enable-command-block=true` and ensures `op_permission_level` ≥ 2. |
| `initial_ops` | list of `[A-Za-z0-9_]{1,16}` | `[]` | Auto-OP these names at boot via RCON (works in online and offline mode). |

## JVM / performance

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `memory_mb` | 512–65536 | `2048` | Applied as both `-Xms` and `-Xmx` for steady GC behaviour. |
| `use_aikar_flags` | bool | `true` | Aikar G1GC tuning recommended for Minecraft. |
| `extra_jvm_args` | string | `""` | Append your own JVM flags. |

## RCON

### rcon_password

| | |
|---|---|
| **Type** | password |
| **Default** | `""` (auto-generated) |

Pre-set the RCON password instead of letting the add-on generate one. Leave blank and a random 32-character password is written to `/data/panel/rcon.secret` (mode `0600`) on first boot.

RCON is always enabled on `127.0.0.1:25575` — never exposed to the LAN. You almost never need to set this yourself.

## Backups

| Option | Type | Default |
|--------|------|---------|
| `auto_backup` | bool | `true` |
| `backup_interval_minutes` | 5–1440 | `60` |
| `backup_keep_count` | 1–500 | `48` |
| `backup_use_git` | bool | `true` (= git) |

`backup_use_git: true` rsyncs the world into a git repo at `/config/minecraft-backups/<profile>/git/` and commits with a timestamped message. `false` writes timestamped tar.gz archives to `/config/minecraft-backups/<profile>/archives/`.

Either way, the oldest-past-`backup_keep_count` are pruned on each run.

## Auto-restart

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `auto_restart_on_crash` | bool | `true` | Re-launch the JVM when it exits unexpectedly. Rate-limited to 5 restarts per rolling 5-minute window. |
| `auto_restart_schedule` | cron-ish string | `""` | Optional scheduled restart. `"03:00"` = daily at 3 AM. Empty = disabled. |

The **Stop** button (and `bruh_minecraft.stop_server` service) writes a `no_restart` flag so the JVM stays down until you start it again.

## Connection handling

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `auto_kick_ghost_sessions` | bool | `true` | Kicks stale "You are already connected to this server!" sessions over RCON. |
| `connection_throttle_ms` | 0–60000 | `4000` | Paper's per-IP throttle. `0` disables (LAN-safe; not recommended on public servers). |
| `player_idle_timeout_minutes` | 0–1440 | `0` | Auto-kick players idle for this long. `0` disables. |

## Plugins

### plugins

| | |
|---|---|
| **Type** | list of objects (`url`, optional `name`) **or** plain URL strings |
| **Default** | `[]` |

```yaml
plugins:
  - url: https://example.com/Essentials.jar
    name: Essentials.jar          # optional rename on disk
  - url: https://example.com/ViaVersion.jar
  - "https://example.com/NickNamer.jar"   # shorthand
```

You can mix forms. Downloads use `If-Modified-Since`, so unchanged jars don't re-fetch on every boot. Bad URLs (404, HTML rate-limit bodies, non-ZIP content) are skipped with a warning. Only loaded for `paper` / `purpur` / `folia` — Fabric and Forge mods go in the profile's `mods/` folder.

:::tip
GitHub `releases/latest/download/X.jar` URLs only resolve when the asset is named *exactly* `X.jar`. Many projects version their filenames (`NickNamer-5.15.0.jar`), which 404s — pin the exact version in that case.
:::

## Bedrock cross-play

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `enable_bedrock_support` | bool | `true` | Auto-installs Geyser + Floodgate. |
| `geyser_auth_type` | `auto` \| `floodgate` \| `online` \| `offline` | `auto` | `auto` resolves to `offline` when `online_mode: false`, `floodgate` otherwise. |
| `geyser_mtu` | 576–1492 | `1400` | Drop to `1200` if iOS hangs on "Connecting multiplayer server…" |

See [No-Xbox Family Mode](/bruh-minecraft/features/#no-xbox-family-mode) for the full no-Xbox setup.

## HA integration

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `enable_ha_integration` | bool | `true` | Deploys the `bruh_minecraft` integration to `/config/custom_components/` and starts the file-IPC bridge. |
| `announce_ha_events` | bool | `true` | Announce HA-triggered events (restarts, backups) in chat with `/say`. |

## Diagnostics

### log_level

| | |
|---|---|
| **Type** | `trace` \| `debug` \| `info` \| `notice` \| `warning` \| `error` \| `fatal` |
| **Default** | `info` |

Verbosity of the add-on's own startup / lifecycle logging (the orange text in the **Log** tab). Has no effect on Minecraft's own log output, which is controlled by the server jar's `logback.xml`. Bump to `debug` or `trace` when filing a bug report.

## Settings precedence

This is the single most-confusing thing about the add-on, so here's the exact rule:

1. **Add-on Configuration tab = source of truth.** On every boot, `setup-server-properties.sh` renders `server.properties` from your add-on options. Any **managed key** (MOTD, difficulty, gamemode, max-players, view-distance, pvp, whitelist, etc.) is overwritten.
2. **Panel → Server Properties tab = live tweaks.** Editing a managed key here writes to `server.properties` and (where possible) applies live via RCON. **But it's transient** — the next add-on restart rewrites that key from step 1.
3. **Non-managed keys are preserved.** Any key you add to `server.properties` that isn't in the managed set (exotic Paper-only keys, plugin-specific settings) survives across restarts.
4. **`initial_ops` vs the panel Players tab.** `initial_ops` runs once per boot via RCON. Using the Players tab to op/deop someone applies immediately and persists in `ops.json` — restarts don't un-op them.
5. **Plugin list (`plugins:`) vs the panel Plugins tab.** The add-on downloads every URL in `plugins:` on boot. Deleting a plugin from the panel removes the jar, but if the URL is still in `plugins:`, the add-on re-downloads it on the next restart. Want it gone? Remove the entry from `plugins:` *and* delete the jar.

**Rule of thumb:** if you want a change to persist across add-on restarts, put it in the Configuration tab. Use the panel for "try this now" or for keys the Configuration tab doesn't manage.

## Recommended Presets

### Family / Kids LAN Server (no Xbox accounts)

```yaml
eula: true
online_mode: false        # everything else auto-adjusts
allow_cheats: true
initial_ops:
  - ParentUsername
difficulty: easy
gamemode: survival
memory_mb: 4096
enable_bedrock_support: true
geyser_auth_type: auto    # resolves to "offline" when online_mode=false
auto_backup: true
backup_interval_minutes: 30
```

### Public Survival Server

```yaml
eula: true
online_mode: true
white_list: true
spawn_protection: 50
difficulty: hard
memory_mb: 6144
enable_bedrock_support: true
geyser_auth_type: floodgate
connection_throttle_ms: 4000     # keep enabled to slow flood attacks
prevent_proxy_connections: true
auto_backup: true
backup_use_git: true
backup_keep_count: 96
auto_restart_schedule: "04:00"
```

### Performance / Plugin-Heavy

```yaml
eula: true
server_type: paper
memory_mb: 8192
use_aikar_flags: true
view_distance: 8
simulation_distance: 6
network_compression_threshold: 512
auto_restart_schedule: "03:00"
log_level: debug          # while tuning
```

### Creative Sandbox (e.g. for testing builds)

```yaml
eula: true
gamemode: creative
allow_cheats: true
allow_flight: true
spawn_monsters: false
difficulty: peaceful
initial_ops:
  - YourUsername
auto_backup: true
backup_interval_minutes: 15    # frequent saves while building
```
