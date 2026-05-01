---
title: Features & Usage
description: Everything BRUH Minecraft Server can do — cross-play, multi-world, plugins, backups, OPs and cheats, mobile UX, and offline mode.
---

What you actually get out of the box.

## Server Jar Management

Pick your distribution and version in the add-on config — the rest is automatic.

```yaml
server_type: paper          # paper | purpur | folia | vanilla | fabric | forge
minecraft_version: LATEST   # LATEST | SNAPSHOT | "1.21.3"
auto_update_server: true    # re-resolve the jar on every boot
```

- `LATEST` resolves to the newest stable release of the chosen type on every boot.
- `SNAPSHOT` tracks the latest dev snapshot (use carefully).
- A pinned version (`1.21.3`) downloads that specific build, then stays put.
- Jars are cached at `/data/server-cache/` (content-addressed), so subsequent boots are instant and work offline.
- Forge uses an installer; the first boot may take a few extra minutes while it pulls its library tree.

Set `auto_update_server: false` to freeze on the currently-installed jar — useful if you have version-locked plugins.

## Bedrock Cross-Play (iOS, Android, Consoles, Win10/11)

`enable_bedrock_support: true` is the default. The add-on downloads the latest Geyser + Floodgate from GeyserMC's v2 API on every boot and configures them automatically.

- **Connect from Bedrock** to `<your-HA-host>:19132` (UDP).
- **LAN auto-discovery** works because the add-on uses `host_network: true` — the server appears in the **Friends** tab on any phone, tablet, or console on the same subnet.
- **Cross-play** is supported for `paper`, `purpur`, `folia`, and `fabric`. Vanilla and Forge can't run Geyser as a plugin — set `enable_bedrock_support: false` for those.

Two knobs you might tune:

```yaml
geyser_auth_type: auto    # auto | floodgate | online | offline
geyser_mtu: 1400          # 576-1492; drop to 1200 if iOS hangs on "Connecting…"
```

| `geyser_auth_type` | Behaviour |
|---|---|
| `auto` | Picks `offline` when Java `online_mode: false`, `floodgate` otherwise. (Recommended default.) |
| `floodgate` | Bedrock players sign in to Xbox Live; Floodgate uses their XUID to identify them. |
| `online` | Bedrock client is asked to log into Xbox on every connect. Rarely what you want. |
| `offline` | No Xbox sign-in needed on Bedrock. Right choice for LAN-only / family servers. |

## No-Xbox Family Mode

The single most common ask: *"My kids don't have Microsoft accounts. How do I let them play?"*

```yaml
online_mode: false
```

That's it. The add-on then silently fixes every downstream setting Microsoft / Mojang and GeyserMC normally gate behind that flag:

- Forces `enforce-secure-profile: false` so MC 1.19+ doesn't kick offline accounts.
- Switches `geyser_auth_type: auto` to resolve `offline` instead of `floodgate`.
- **Uninstalls Floodgate**, because Floodgate requires a valid Xbox XUID.
- Sets Geyser's `advanced.bedrock.validate-bedrock-login: false` so Bedrock clients without a Mojang-signed JWT can connect.

Any Java username now works, and Bedrock devices join under whatever username is set on the device — no Xbox sign-in.

:::caution
Offline mode is **not safe for public/internet-exposed servers**. Anyone who guesses a username can join as that player, including OPs. Use it only on LAN, or behind a Velocity/Waterfall proxy that handles auth.
:::

## OPs and Cheats in One Click

Want `/gamemode`, `/give`, `/tp`, `/summon`, and `/fill` to just work?

```yaml
allow_cheats: true
initial_ops:
  - YourMinecraftUsername
  - KidUsername1
```

`allow_cheats: true` forces `enable-command-block=true` and ensures `op_permission_level` is at least 2. `initial_ops` runs once per boot via RCON to OP each listed name (works in both online and offline auth). After that, OP changes you make through the panel's **Players** tab persist in `ops.json` and aren't overwritten on restart.

## Switchable Multi-World Profiles

The add-on can host multiple independent servers and flip between them with one option change. Each profile is a full server root — its own world, `server.properties`, plugins, and backup history — living at `/config/minecraft-worlds/<name>/`. Only one is active at a time.

Why you might want this:

- A creative-mode sandbox for kids and a survival world for the adults.
- Seasonal events (a Halloween profile, a summer vanilla profile).
- A throwaway test server for plugin combos without risking the main save.

**How to switch:**

- **Panel → Worlds tab** (recommended). Click **Switch** on a profile — the panel writes `active_world` via the Supervisor API and triggers a full add-on restart. ~30 seconds and you're booted into the new profile.
- **Add-on Configuration tab.** Set `active_world: <name>` and restart.
- **CLI.** `world-manager.sh list | create <name> [seed] | switch <name> | delete <name> | active`.

### What's per-world vs shared

When you switch worlds, these things **travel with the profile**:

- World save files (`world/`, `world_nether/`, `world_the_end/`).
- `server.properties` (re-rendered from add-on options on boot, but non-managed keys persist).
- The `plugins/` folder on disk.
- Backup history.
- `ops.json`, `whitelist.json`, `banned-players.json`.

These are **shared across all profiles**:

- All add-on options (`difficulty`, `gamemode`, `memory_mb`, `motd`, the `plugins:` URL list, etc.).
- The RCON password.
- Geyser / Floodgate config (regenerated per profile, but from the same options).

**Implication:** to run, say, a peaceful creative world *and* a hard survival world, you can't change `difficulty` per profile via add-on options alone — they share that field. Workaround: edit the profile's `server.properties` directly via the panel's **Server Properties** tab. See [Settings precedence](/bruh-minecraft/configuration/#settings-precedence).

## Git-Versioned World Backups

Every world snapshot can be committed to a git repo (or written as a tar.gz archive). Restore any previous state with one click from the panel.

```yaml
auto_backup: true
backup_interval_minutes: 60
backup_keep_count: 48        # 1-500; older backups are pruned
backup_use_git: true         # false = tar.gz archives
```

| Mode | Where it lives | When to use |
|------|---------------|-------------|
| **git** | `/config/minecraft-backups/<profile>/git/` | Small-to-medium worlds, long history. Cheap deltas via git. |
| **archive** | `/config/minecraft-backups/<profile>/archives/*.tar.gz` | Huge worlds where git would churn too hard. |

Manual backups any time:

- Panel header → **Backup** button.
- HA service: `bruh_minecraft.backup_now`.

## Plugin Management (Paper / Purpur / Folia)

Drop a list of jar URLs into the add-on config and they'll be installed on every boot — with `If-Modified-Since`, so unchanged jars don't re-download.

```yaml
plugins:
  - url: https://example.com/Essentials.jar
    name: Essentials.jar          # optional rename on disk
  - url: https://example.com/ViaVersion.jar
  - "https://example.com/NickNamer.jar"   # shorthand: plain URL
```

You can mix forms in one list. Bad URLs (404s, GitHub rate-limit HTML pages, non-ZIP content) are skipped with a warning — they can't prevent the server from starting (since 1.2.5).

You can also install jars one-off from the panel's **Plugins** tab — but if a URL is still in the `plugins:` config, deleted jars will come back on the next boot. To remove a plugin permanently, delete it from `plugins:` *and* from the panel.

For Fabric/Forge, the `plugins:` list is ignored. Mods go in the profile's `mods/` folder instead.

## JVM Performance

```yaml
memory_mb: 4096            # 512-65536; applied as both -Xms and -Xmx
use_aikar_flags: true      # the recommended G1GC tuning for Minecraft
extra_jvm_args: ""         # append your own
```

Recommended sizing:

- 4 players, vanilla: `2048`
- 10 players, some plugins: `4096`
- 20+ players, heavy plugin pack: `6144`–`8192`

If the JVM crashes (OOM, plugin fault, etc.), `auto_restart_on_crash: true` re-launches it. A rate limit of **5 restarts per 5-minute rolling window** prevents runaway loops.

```yaml
auto_restart_on_crash: true
auto_restart_schedule: "03:00"   # optional daily restart, "" disables
```

## Mobile-Friendly Panel

The panel is served over HA ingress, so anywhere the Companion app works (iOS, Android, web), the panel works too. Specifically tuned for mobile:

- Tab row scrolls horizontally with momentum on iOS; right-edge fade hints at more tabs.
- Forms stack vertically on narrow viewports.
- Tables scroll horizontally inside their own container instead of breaking the layout.
- Inputs use 16 px font to avoid iOS Safari's auto-zoom on focus.
- Touch targets honour the 40–44 px minimum from iOS / Material design guides.

If a page feels cramped, expand the Companion app's **Sidebar → Minecraft** tile to full-width.

## Connection Self-Healing

A few real-world quirks the add-on handles automatically:

- **Ghost sessions.** When Paper rejects a new login with *"You are already connected to this server!"* (because the previous connection hung and hasn't timed out), a background daemon tails the server log and RCON-kicks the stale session so the retry succeeds. Toggle: `auto_kick_ghost_sessions: true`.
- **Connection throttle.** Paper's per-IP `connection-throttle` defaults to 4000 ms. Set `connection_throttle_ms: 0` on LAN-only servers to avoid the *"Slow down, you're connecting too fast!"* kick on rapid iOS retries.
- **Idle-timeout kick.** `player_idle_timeout_minutes: 5` cleans up stuck sessions in addition to the ghost-kicker.
- **Thread-safe RCON.** The add-on ships its own RCON client (`scripts/rcon_client.py`) — no `signal.SIGALRM` deadlocks like `mcrcon` had.

## Security Posture

- **RCON is loopback-only** — bound to `127.0.0.1:25575` with a 32-character random password at `/data/panel/rcon.secret` (mode `0600`). Never exposed to the LAN.
- **Ingress auth** — the panel inherits whatever auth your HA uses. No separate login.
- **Plugin URLs run with full server permissions.** Only add URLs you trust. The add-on verifies downloads start with the ZIP magic bytes (`PK`) so a rate-limit HTML page can't masquerade as a jar — but a malicious *signed* jar can still compromise the server.
- **JVM runs as UID 1000** (non-root).
- **Backups live under `/config/minecraft-backups/`** — bind-mounted to your HA host. Copy them off-host for true disaster recovery.

## Advanced Capabilities

- **Notify platform.** `notify.bruh_minecraft_broadcast` lets HA notification flows broadcast to in-game chat.
- **`bruh_minecraft.rcon_command` service** — run any arbitrary Minecraft command from HA, with the response returned in the UI.
- **Custom add-on options applied live.** Editable keys (MOTD, difficulty, gamemode, PVP, whitelist, etc.) on the panel's **Server Properties** tab apply over RCON without a restart — though they're transient until you also persist them via the Configuration tab.
- **Subset support for Simple Voice Chat.** Port `24454/udp` is exposed by default. Drop the SVC plugin into your `plugins:` list and players get spatial voice in-game.
- **`bruh_minecraft.give`, `set_weather`, `set_time` services** — the most common admin actions wrapped as first-class HA services so you can put them in scripts and Lovelace cards.

For the full integration surface, see [HA Integration](/bruh-minecraft/integrations/).
