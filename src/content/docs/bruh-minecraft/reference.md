---
title: Reference
description: Every BRUH Minecraft Server option, sensor, button, service, and panel tab — in one place.
---

Everything you might need to look up. Configure from **Settings → Add-ons → BRUH Minecraft Server → Configuration**.

## Configuration options

### Required

| Option | Default | What it does |
|--------|---------|--------------|
| `eula` | `false` | **Set to `true` to start.** Accepts the Minecraft EULA. |

### Server type & version

| Option | Default | What it does |
|--------|---------|--------------|
| `server_type` | `paper` | `paper`, `purpur`, `folia`, `vanilla`, `fabric`, or `forge`. Paper recommended. |
| `minecraft_version` | `LATEST` | `LATEST`, `SNAPSHOT`, or pinned (`1.21.3`). |
| `auto_update_server` | `true` | Re-resolve the jar on every boot. Disable to pin. |
| `active_world` | `default` | Which saved profile is live. See [Multi-world](#multi-world-profiles). |

### Gameplay

| Option | Default | Notes |
|--------|---------|-------|
| `motd` | `A BRUH Minecraft Server` | |
| `difficulty` | `normal` | `peaceful`, `easy`, `normal`, `hard` |
| `gamemode` | `survival` | `survival`, `creative`, `adventure`, `spectator` |
| `max_players` | `20` | 1–1000 |
| `view_distance` / `simulation_distance` | `10` / `10` | 3–32 each |
| `pvp` / `hardcore` / `allow_flight` / `white_list` | `true` / `false` / `false` / `false` | |
| `spawn_protection` | `16` | 0–10000 |
| `online_mode` | `true` | **`false` = LAN/no-Xbox mode** — the addon auto-fixes everything downstream. |
| `enforce_secure_profile` | `false` | Auto-forced `false` whenever `online_mode: false`. |
| `level_name` / `level_seed` / `level_type` | `world` / random / `minecraft:normal` | Only takes effect on fresh world generation. |
| `allow_nether` / `generate_structures` | `true` / `true` | |
| `spawn_monsters` / `spawn_animals` / `spawn_npcs` | `true` / `true` / `true` | |
| `allow_cheats` | `false` | Forces `enable-command-block=true` and `op_permission_level ≥ 2`. |
| `initial_ops` | `[]` | Auto-OP these usernames at boot via RCON. Works in offline mode too. |
| `enable_command_block` | `false` | |
| `op_permission_level` | `4` | 1–4 |

### Performance

| Option | Default | Notes |
|--------|---------|-------|
| `memory_mb` | `2048` | 512–65536. Sized as both `-Xms` and `-Xmx`. |
| `use_aikar_flags` | `true` | Recommended G1GC tuning. |
| `extra_jvm_args` | `""` | Append your own JVM flags. |

**Sizing guide:** 4 players = 2048, 10 players + plugins = 4096, 20+ heavy = 6144–8192.

### Backups & uptime

| Option | Default | Notes |
|--------|---------|-------|
| `auto_backup` | `true` | Snapshot the world on a schedule. |
| `backup_interval_minutes` | `60` | 5–1440 |
| `backup_keep_count` | `48` | 1–500. Older snapshots pruned. |
| `backup_use_git` | `true` | `true` = git repo with deltas, `false` = tar.gz archives. |
| `auto_restart_on_crash` | `true` | 5/5min rate limit. |
| `auto_restart_schedule` | `""` | e.g. `"03:00"` for daily 3 AM. |

### Connection handling

| Option | Default | Notes |
|--------|---------|-------|
| `auto_kick_ghost_sessions` | `true` | Kicks stale "already connected" sessions over RCON. |
| `connection_throttle_ms` | `4000` | Set `0` to disable on LAN. |
| `player_idle_timeout_minutes` | `0` | Auto-kick after N idle minutes. `0` disables. |

### Bedrock cross-play

| Option | Default | Notes |
|--------|---------|-------|
| `enable_bedrock_support` | `true` | Auto-installs Geyser + Floodgate. |
| `geyser_auth_type` | `auto` | `auto` resolves to `offline` when `online_mode: false`, else `floodgate`. |
| `geyser_mtu` | `1400` | Drop to `1200` if iOS hangs on "Connecting…". |

### Plugins

Two ways to install plugins, mix and match freely.

#### One-click popular plugins (1.4.0+)

Tick a checkbox in the **Configuration** tab and the add-on resolves the latest Paper-compatible jar via the [Modrinth](https://modrinth.com) API on every boot. Bukkit-API only — Paper / Purpur / Folia.

| Checkbox | Plugin | What it does |
|----------|--------|--------------|
| `install_essentialsx` | EssentialsX | Homes, warps, kits, `/tpa`, `/repair`, basics |
| `install_essentialsx_chat` | EssentialsXChat | Chat formatting (companion to EssentialsX) |
| `install_luckperms` | LuckPerms | Modern permissions plugin |
| `install_worldedit` | WorldEdit | In-game block editing |
| `install_worldguard` | WorldGuard | Region protection |
| `install_coreprotect` | CoreProtect | Anti-grief logging + rollback |
| `install_multiverse_core` | Multiverse-Core | Multi-world support |
| `install_griefprevention` | GriefPrevention | Golden-shovel claim protection |
| `install_mcmmo` | mcMMO | RPG-style skills (Mining/Woodcutting/Swords) |
| `install_chestsort` | ChestSort | Left-click outside chest = instantly sorted |
| `install_veinminer` | VeinMiner | Break one ore → whole vein breaks |
| `install_spark` | Spark | Server profiler |

Toggling a checkbox **off** does NOT remove the jar — delete it from the panel's **Plugins** tab to remove.

#### Custom URL list

For anything not in the curated set:

```yaml
plugins:
  - url: https://example.com/Essentials.jar
    name: Essentials.jar          # optional rename
  - "https://example.com/ViaVersion.jar"   # plain URL also works
```

Loaded for `paper` / `purpur` / `folia`. Bad URLs are skipped with a warning, never block startup. Downloads use `If-Modified-Since` so unchanged jars don't re-fetch.

:::tip
GitHub `releases/latest/download/X.jar` URLs only resolve when the asset is named *exactly* `X.jar`. Versioned filenames like `NickNamer-5.15.0.jar` need a pinned URL.
:::

#### Where to browse for more plugins

| Marketplace | Notes |
|-------------|-------|
| [Modrinth](https://modrinth.com/plugins) | The cleanest source for direct download URLs. Used by the one-click checkboxes. |
| [Hangar](https://hangar.papermc.io) | PaperMC's official marketplace. ViaVersion, ViaBackwards, ViaRewind, ProtocolLib, PlaceholderAPI live here. |
| [SpigotMC](https://www.spigotmc.org/resources/categories/spigot.4/) | The original Bukkit-plugin marketplace. Some plugins are still SpigotMC-only. |
| [BukkitDev](https://dev.bukkit.org/bukkit-plugins) | Older but still hosts a few classics. |

### Other

| Option | Default | Notes |
|--------|---------|-------|
| `rcon_password` | auto-generated | Loopback-only at `127.0.0.1:25575`. You almost never need to set this. |
| `enable_ha_integration` | `true` | Deploys the `bruh_minecraft` integration and starts the IPC bridge. |
| `announce_ha_events` | `true` | Announce HA-triggered events in chat with `/say`. |
| `log_level` | `info` | `trace`–`fatal`. |

## Recommended presets

### Family LAN (no Xbox accounts)

```yaml
eula: true
online_mode: false
allow_cheats: true
initial_ops:
  - ParentUsername
difficulty: easy
memory_mb: 4096
auto_backup: true
backup_interval_minutes: 30
```

### Public survival

```yaml
eula: true
online_mode: true
white_list: true
difficulty: hard
memory_mb: 6144
prevent_proxy_connections: true
auto_backup: true
backup_keep_count: 96
auto_restart_schedule: "04:00"
```

### Performance / plugin-heavy

```yaml
eula: true
server_type: paper
memory_mb: 8192
view_distance: 8
simulation_distance: 6
network_compression_threshold: 512
auto_restart_schedule: "03:00"
```

## Settings precedence

The single most-confusing part of the addon. Memorise this:

1. **Add-on Configuration tab = source of truth.** Every boot rewrites `server.properties` from your options.
2. **Panel → Server Properties tab = live tweaks.** Applies via RCON immediately, but next add-on restart overwrites it.
3. **Panel ops/whitelist/bans persist.** They live in `ops.json` etc, not in add-on options.
4. **`plugins:` URLs re-download on every boot.** Deleting from the panel is temporary if the URL is still in the list.

**Rule:** persist via the Configuration tab. Use the panel for "try this now."

## Multi-world profiles

Each profile is a full server root at `/config/minecraft-worlds/<name>/` with its own world, `server.properties`, plugins, and backups. Only one is active at a time.

**Switch:** Panel → **Worlds tab → Switch**. Writes `active_world`, full restart, ~30 s.

**Per-profile:** world files, `server.properties`, plugins folder, ops/whitelist/bans, backup history.
**Shared across profiles:** all add-on options (difficulty, gamemode, memory_mb, motd, the `plugins:` URL list), RCON password.

## Offline mode

Since 1.3.0, the server starts even when the HA host has no internet — provided it's been online at least once to cache the jars.

**How it's detected:** at boot, the add-on hits `https://api.papermc.io/v2/` with a 5-second timeout. Reachable = online; otherwise the add-on logs a banner and runs in offline mode for the rest of the session.

**What gets skipped when offline:**

- Server-jar resolution / re-download — the existing `server.jar` is reused as-is.
- Plugin URL fetches in the `plugins:` list — whatever's already in `plugins/` keeps loading.
- Geyser / Floodgate auto-updates — cached jars are reused.

**What still happens offline:**

- `server.properties` is re-rendered from add-on options.
- Geyser config (auth-type, MTU, MOTD) is patched on every boot — those edits don't need network.
- `initial_ops`, world / backup / panel / RCON, all HA integration plumbing — fully functional.

**First-ever boot still needs internet** (there's nothing cached to fall back to). The add-on will log a clear actionable error if you try to start offline with no cached jar:

```
[download-server] ERROR: offline mode and no cached server.jar exists
[download-server]   Connect to the internet once so the initial jar can be downloaded;
[download-server]   subsequent boots will continue to work offline.
```

There's no config option for this — the behaviour kicks in automatically based on network reachability.

## Panel tabs

| Tab | What it does |
|-----|--------------|
| **Dashboard** | Status, uptime, memory, TPS, online players, quick `/say`, one-shot RCON. |
| **Console** | Live colour-coded JVM log via SSE; command input runs over RCON. |
| **Players** | Op / kick / ban / whitelist with one click. |
| **Server Properties** | Live editor; managed keys overwritten on next boot (see [precedence](#settings-precedence)). |
| **Plugins** | Install by URL, list with size/mtime, delete. |
| **Backups** | Git snapshots and archives, one-click restore. Scoped to active profile. |
| **Worlds** | List, switch, create, delete profiles. |

Header buttons (always visible): **Backup** • **Update** • **Restart** (JVM-only, ~15 s) • **Stop** (sets `no_restart`).

## Home Assistant entities

### Sensors

| Sensor | Notes |
|--------|-------|
| `players_online` | `players` list in attributes |
| `players_max` | |
| `tps_1m` / `tps_5m` / `tps_15m` | Paper / Purpur / Folia only |
| `latency_ms` / `uptime` | |
| `version` / `server_type` / `motd` / `difficulty` / `gamemode` | |

### Binary sensors

`reachable` (status ping ok), `rcon_ok` (disabled by default).

### Buttons

`backup_now`, `restart_server`, `stop_server`, `save_all`.

## Services

```yaml
# Broadcast to chat
service: bruh_minecraft.say
data: { message: "Dinner's ready — server going down in 2 min" }

# Any RCON command
service: bruh_minecraft.rcon_command
data: { command: "weather clear" }

# Give an item to an online player
service: bruh_minecraft.give
data: { player: "Alice", item: "minecraft:diamond_pickaxe", amount: 1 }

# Lifecycle
service: bruh_minecraft.backup_now
service: bruh_minecraft.restart_server
service: bruh_minecraft.stop_server

# Quality-of-life
service: bruh_minecraft.set_weather    # data: { weather: clear|rain|thunder }
service: bruh_minecraft.set_time       # data: { time: day|night|noon|midnight|"12000" }

# Player management — all take player: "<name>"
service: bruh_minecraft.op_player
service: bruh_minecraft.deop_player
service: bruh_minecraft.kick_player
service: bruh_minecraft.ban_player
service: bruh_minecraft.whitelist_add
service: bruh_minecraft.whitelist_remove

# Notify platform — broadcast as a notify target
service: notify.bruh_minecraft_broadcast
data: { message: "Doorbell rang!" }
```

## Automation recipes

```yaml
# Nightly backup at 4 AM
automation:
  - trigger: { platform: time, at: "04:00:00" }
    action: { service: bruh_minecraft.backup_now }

# Auto-stop when idle for 30 minutes
automation:
  - trigger:
      platform: numeric_state
      entity_id: sensor.bruh_minecraft_players_online
      below: 1
      for: "00:30:00"
    action: { service: bruh_minecraft.stop_server }

# Bedtime kick
automation:
  - trigger:
      platform: numeric_state
      entity_id: sensor.bruh_minecraft_players_online
      above: 0
    condition: { condition: time, after: "22:30:00", before: "06:00:00" }
    action:
      - service: bruh_minecraft.say
        data: { message: "Server going to sleep in 60s — save your work!" }
      - delay: "00:01:00"
      - service: bruh_minecraft.stop_server
```

## Where data lives

| Path | Contents |
|------|----------|
| `/config/minecraft/` | Symlink to the active profile |
| `/config/minecraft-worlds/<profile>/` | Full server root per profile |
| `/config/minecraft-backups/<profile>/` | Git snapshots or tar.gz archives |
| `/config/.bruh_minecraft/` | HA bridge — request/response queues, stats |
| `/config/custom_components/bruh_minecraft/` | Companion integration |
| `/data/server-cache/` | Cached jars (content-addressed) |
| `/data/panel/` | Panel state, RCON secret, console log |

## Troubleshooting

### Won't start

| Symptom | Fix |
|---------|-----|
| `EULA has NOT been accepted` | `eula: true`. |
| `address already in use: 25565` | Stop the conflicting process or remap the port. |
| Plugin install warning then continues | Bad URL — fix or remove from `plugins:`. |

### Connection issues

| Symptom | Fix |
|---------|-----|
| Can't connect from internet | Forward `25565/tcp` + `25565/udp` (and `19132/udp` for Bedrock) to HA host. |
| "Please log into Xbox" | Set `online_mode: false`. |
| iOS hangs on "Connecting…" | `geyser_mtu: 1200`. |
| "You are already connected" | Auto-kicker should clear it; manual kick from Players tab. |
| Bedrock not in Friends tab | Same subnet/VLAN as HA host? Try manual `<HA IPv4>:19132`. |

### Performance

| Symptom | Fix |
|---------|-----|
| TPS sensors null | TPS only reported by Paper / Purpur / Folia. |
| OOM crashes | Bump `memory_mb`. |
| Sagging TPS | Lower `view_distance` (8) and `simulation_distance` (6). Schedule a daily restart. |

### Diagnostics

Bump `log_level: debug` and reproduce. Check the **Log** tab for boot/supervisor errors and the panel's **Console** tab for live JVM output. Full historical JVM log: `/data/panel/console.log`.

File issues at <https://github.com/bruhautomation/BRUH-HA-Apps/issues>.
