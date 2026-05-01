---
title: Management Panel
description: A guided tour of the BRUH Minecraft Server ingress panel — dashboard, console, players, server properties, plugins, backups, and worlds.
---

The management panel is the BRUH Minecraft Server's main interface. It's served over Home Assistant ingress, so it appears as the **Minecraft** entry in the HA sidebar with no extra setup, and works anywhere the HA Companion app does.

## Header (every tab)

The header sits above all tabs and has four lifecycle buttons that are always one click away:

| Button | What it does |
|--------|--------------|
| **Backup** | Triggers a one-shot backup (git or archive, per your config). |
| **Update** | Re-resolves the server jar and re-downloads if upstream has changed. |
| **Restart** | Sends `save-all flush` then RCON `stop`; the add-on's run loop relaunches the JVM in the same container (~15 s). Does *not* re-run `ensure_worlds_layout`, so it can't switch worlds. |
| **Stop** | Save + RCON `stop`, then writes a `no_restart` flag so the JVM stays down until you start it from the HA add-on page. |

## Dashboard

A single-glance health view of the server.

- **Status dot.** Green when the JVM is running and the status ping responds.
- **Version.** Resolved server jar version (e.g. `paper 1.21.3-build.42`).
- **Uptime, memory, TPS** (1 m / 5 m / 15 m on Paper / Purpur / Folia), latency.
- **Online players.** Pill badges with name + ping; click for one-shot actions.
- **Quick chat (`/say`)** input for broadcasting a message to everyone online.
- **One-shot RCON command** input for any arbitrary Minecraft command — response is shown inline.

## Console

A live terminal view of the server log, streamed via Server-Sent Events from `/api/logs/tail`.

- **Colour-coded** INFO / WARN / ERROR lines so problems jump out.
- **Command input** at the top — type a command (no leading `/` needed) and press Enter. The command runs over RCON.
- **Auto-scroll toggle** for when you need to read history without the view jumping.
- **Clear buffer** button.

This is the right tab to keep open while you're debugging a misbehaving plugin.

## Players

Active player management.

- Table of currently-online players with one-click **op / deop / kick / ban / pardon / whitelist-add / whitelist-remove** actions.
- Manual form for any player name + action (useful for OPs/whitelist/bans on offline players).
- Changes to `ops.json`, `whitelist.json`, and `banned-players.json` persist across restarts — they're not overwritten from add-on options.

:::tip
On a fresh install, dropping your username into the `initial_ops` config option is the easiest way to get OP'd before you've connected once. After that, use the panel's Players tab.
:::

## Server Properties

Live editor for `server.properties`.

- Shows every resolved key, with **editable** ones (MOTD, difficulty, gamemode, PVP, whitelist, etc.) interactive and the rest read-only.
- Editing an editable key writes to `server.properties` and (where supported) applies live via RCON — no JVM restart needed.
- **Important:** edits here are **transient** if the key is *managed* by the add-on Configuration tab. The next add-on restart rewrites that key from your add-on options. To persist a change across restarts, also set it in the Configuration tab.
- Non-managed keys (exotic Paper / plugin-specific settings) survive across restarts.

See [Settings precedence](/bruh-minecraft/configuration/#settings-precedence) for the full rule.

## Plugins

For Paper / Purpur / Folia.

- Lists every `.jar` under the active profile's `plugins/` folder with size and last-modified time.
- **Install by URL** form that uses the same downloader as the `plugins:` config option (validates the response is actually a ZIP/jar before saving).
- **Delete** button per plugin. Note: if the URL is still in your `plugins:` config, the add-on re-downloads it on the next boot. To remove permanently, delete it from `plugins:` *and* from the panel.

## Backups

Browse and restore world snapshots.

- **Git snapshots** with short SHA, timestamp, and commit subject (when `backup_use_git: true`).
- **Archive backups** with filename, size, and timestamp (when `backup_use_git: false`).
- **One-click Restore** on any row. The server is stopped, the world is restored from the snapshot, and the add-on relaunches the JVM automatically.
- The list is scoped to the **currently-active world profile**. Switch worlds from the Worlds tab to browse another profile's history.

## Worlds

Multi-world profile management. Each profile is a complete server root with its own world, `server.properties`, plugins, ops/whitelist, and backups.

- **List.** Every profile under `/config/minecraft-worlds/` with on-disk size and an "Active?" marker.
- **Switch.** Writes `active_world` to your add-on options via the Supervisor API and triggers a full add-on restart (~30 s) so `ensure_worlds_layout` re-points `/config/minecraft` at the new profile. The panel is unreachable while the container restarts; refresh after.
- **Create.** Stages an empty profile (with optional fixed seed). Names must be 1–32 characters, `[A-Za-z0-9_-]` only.
- **Delete.** Removes both the world directory and its backup history. Refuses to delete the currently-active profile — switch away first.

:::caution
Use the **Worlds tab Switch button** (or hand-edit `active_world` in the Configuration tab and click Restart on the HA add-on page) to actually change profiles. The header **Restart** button is JVM-only — it can't switch worlds because `ensure_worlds_layout` doesn't re-run.
:::

## Mobile use

The panel is fully responsive — see the [Mobile-Friendly Panel](/bruh-minecraft/features/#mobile-friendly-panel) section in Features for the specific tweaks (16 px input fonts, 44 px touch targets, horizontal-scroll tab row, etc.). On phones, expand the Companion app's panel tile to full-width for the most usable layout.
