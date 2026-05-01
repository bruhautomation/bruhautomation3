---
title: Troubleshooting
description: Fixes for the most common BRUH Minecraft Server issues — Bedrock hangs, plugin failures, OOM crashes, port conflicts, and more.
---

The fastest way to diagnose a misbehaving server is the **Log** tab on the add-on page (for boot / supervisor errors) and the panel's **Console** tab (for live JVM output). If you're filing a bug, set `log_level: debug` first.

## Server won't start

### `fatal: The Minecraft EULA has NOT been accepted`

Set `eula: true` in the add-on **Configuration** tab. That is the one and only way to start the server.

### `address already in use: bind: 0.0.0.0:25565`

Something else is already listening on the Minecraft port — another server, a duplicate add-on, or a leftover process from a crashed restart. Stop the conflicting process. If you genuinely need to run on a different port, change the mapping in the add-on's **Network** tab.

### Add-on exits immediately after "Installing configured plugins"

Before 1.2.5 a single bad plugin URL could kill `run.sh`. Since 1.2.5, per-plugin failures are isolated and the server starts anyway:

```
[INFO]: Plugin: NickNamer.jar -> https://.../NickNamer.jar
[WARNING]: Plugin install failed for https://.../NickNamer.jar — continuing
[WARNING]: 1 plugin(s) failed; see logs above. Server will start anyway.
```

If you see a failure:

- **Check the `[install-plugin]` line** — the HTTP status / curl exit code tells you whether the URL 404'd, timed out, or served HTML instead of a jar (`--max-time 60` caps each attempt).
- **GitHub `releases/latest/download/X.jar` URLs only work if an asset is named *exactly* `X.jar`.** Many projects version their filenames (`NickNamer-5.15.0.jar`) — pin a versioned URL or the project's own mirror.
- **Rate-limit HTML pages are rejected.** A jar must start with the ZIP magic bytes (`PK`); ~10 KB HTML blobs masquerading as jars are refused.

## Connection issues

### Players can't connect from the internet

Port forwarding is your router's job, not Home Assistant's. Forward `25565/tcp` *and* `25565/udp` from your public IP to your HA host. For Bedrock, also forward `19132/udp`.

### "Please log into Xbox to join this server"

You're trying to play without a Microsoft account but `online_mode` is still on. To allow no-Xbox play (LAN / family / kids):

```yaml
online_mode: false
```

The add-on then auto-fixes everything downstream: forces `enforce_secure_profile: false`, switches `geyser_auth_type: auto` to `offline`, uninstalls Floodgate, and disables Geyser's `validate-bedrock-login`. Restart the add-on. Any Java username now works, and Bedrock devices join under whatever username is set on the device.

:::caution
Offline mode is **not safe for public/internet-exposed servers**. Anyone who guesses a username can join as that player, including OPs. Use it only on LAN or behind a Velocity/Waterfall proxy.
:::

### "You are not permitted to join due to the enforce-secure-profile setting"

Same root cause as above — turn off `online_mode`, and `enforce_secure_profile` will auto-flip to `false`.

### iOS Bedrock hangs on "Connecting multiplayer server…"

Checklist in order of likelihood:

1. **MTU.** Set `geyser_mtu: 1200` and restart — many home Wi-Fi routers fragment UDP packets above ~1200 bytes mid-handshake, which Bedrock doesn't recover from.
2. **Ghost session from a previous hang.** If the retry shows *"You are already connected to this server!"*, the auto-kicker should clear it within a second (default `auto_kick_ghost_sessions: true`). Manual fallback: panel → Players tab → type the name → action **Kick**, or `kick <name>` in the Console tab.
3. **Connection-throttle.** Rapid iOS retries can hit Paper's per-IP throttle and get *"Slow down, you're connecting too fast!"*. Set `connection_throttle_ms: 0` on LAN.
4. **Apple Family Sharing.** Two iOS devices signed into the same Microsoft account share a gamertag and the server only accepts one at a time. Give each device its own (child) account, or sign out of Xbox on the second device and set a distinct offline username in Minecraft → Settings → Profile.
5. **Resource pack.** An unreachable `resource_pack` URL makes iOS hang silently. Clear `resource_pack` / `resource_pack_sha1`, or set `require_resource_pack: false`.

### Bedrock server doesn't show in the **Friends** tab

- Make sure the device is on the **same subnet/VLAN** as your HA host. Guest networks, IoT VLANs, and "client isolation" toggles block the UDP multicast Bedrock uses for LAN discovery.
- Manual fallback: **Servers** tab → **Add Server** → enter `<HA host IPv4>` and port `19132`.
- `homeassistant.local` sometimes fails on iOS — use the raw IPv4 address.

## Performance

### TPS sensors stay unavailable

TPS is reported by Paper / Purpur / Folia's `/tps` command. If you run `vanilla` / `fabric` / `forge`, those sensors will stay null — that's expected.

### Out-of-memory crashes

Bump `memory_mb`. Recommended sizing:

- 4 players, vanilla world: `2048`
- 10 players, some plugins: `4096`
- 20+ players, heavy plugin pack: `6144`–`8192`

### Server feels laggy / TPS sagging

- Lower `view_distance` (try `8`) and `simulation_distance` (try `6`).
- Make sure `use_aikar_flags: true` (the default).
- Check your plugin pack — chunk-generation plugins, world editors, and dynmap-style renderers are common offenders.
- Schedule a daily restart with `auto_restart_schedule: "03:00"` to clear any memory creep.

## Backups / restore

### Backups are slow

If your world is huge, switch to tar-archive mode (`backup_use_git: false`) — it's cheaper on CPU but uses more disk. Git mode is best for small-to-medium worlds that change slowly.

### Restore did not restart the server

After a restore, the panel sends `stop` over RCON. If you've turned `auto_restart_on_crash` off, the JVM stays down — toggle it back on (the default), or start the add-on manually from the HA add-on page.

### I lost my world after switching profiles

Worlds aren't deleted by switching — they're under `/config/minecraft-worlds/<profile>/`. Use the panel's **Worlds** tab to switch back. The legacy `/config/minecraft/` path is a symlink; pre-1.3.0 worlds were migrated to a profile named `default` on first boot of 1.3.0.

## RCON / panel

### `signal only works in main thread of the main interpreter`

Fixed in **1.2.0**. The old RCON client used `signal.SIGALRM`, which can't be set from worker threads — so the panel's command bar would crash. The add-on now ships its own thread-safe RCON client.

If you still see this, you're on an old version. Check **Add-on → Info** and update.

### Panel says "Online" but commands time out

RCON's loopback binding means the panel must be running inside the same container as the JVM. If you've sandboxed or proxy-routed the add-on in unusual ways, the panel won't reach `127.0.0.1:25575`. Run the default config and let the add-on manage its own networking.

### I can't find the RCON password

`/data/panel/rcon.secret` (mode `0600`). You almost never need this — the panel and HA bridge use it automatically. Don't expose RCON to the LAN; it's loopback-only by design.

## Updating

### Add-on update available but the new integration isn't loading

Restart Home Assistant once after an update that ships new integration code. The add-on will surface a persistent notification when this is needed. HA only loads `/config/custom_components/` Python code at startup.

### A jar update broke my world / plugins

Pin to the previous Minecraft version with `minecraft_version: 1.21.3` (replace with whichever build was working) and set `auto_update_server: false`. Then restore your world from the **Backups** tab if needed.

## Diagnostics

If you're filing a bug or asking for help:

1. Set `log_level: debug` in the add-on Configuration tab and restart.
2. Reproduce the issue.
3. Grab the relevant log:
   - **Add-on Log** tab — for boot, supervisor, and lifecycle issues.
   - **Panel → Console** — for live JVM / plugin output.
   - `/data/panel/console.log` — full historical JVM log.
4. Open an issue at <https://github.com/bruhautomation/BRUH-HA-Apps/issues> with the log and your add-on config (redact `rcon_password` if you set one manually).
