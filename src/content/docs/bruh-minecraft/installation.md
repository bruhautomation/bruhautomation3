---
title: Installation
description: How to install and set up the BRUH Minecraft Server add-on in Home Assistant.
---

Getting a Minecraft server running takes about 5 minutes. Add the repository, install the add-on, accept the EULA, start it, and let Home Assistant set up the integration.

## Prerequisites

- **Home Assistant OS** or **Home Assistant Supervised** — the add-on system requires the Supervisor.
- A device on **amd64** or **aarch64**.
- At least **2 GB of free RAM** beyond what HA itself uses (4 GB+ recommended for plugin-heavy setups).
- About **1 GB of free disk** for the server jar, world, and a few backup snapshots.

:::note
BRUH Minecraft Server does **not** work on Home Assistant Container or Home Assistant Core installations — they don't support add-ons.
:::

## Step 1 — Add the Repository

Open Home Assistant → **Settings → Add-ons → Add-on Store**. Click the three-dot menu in the top right and select **Repositories**.

Paste this URL and click **Add**:

```
https://github.com/bruhautomation/BRUH-HA-Apps
```

The BRUH HA Apps repository will now appear in your add-on store.

## Step 2 — Install the Add-on

Find **BRUH Minecraft Server** in the store and click **Install**. The image is around 600 MB (Java 21 + tooling), so it may take a few minutes the first time.

## Step 3 — Accept the EULA

Open the **Configuration** tab and set:

```yaml
eula: true
```

This acknowledges the [Minecraft EULA](https://www.minecraft.net/eula). The add-on will refuse to start until you do this — that's a Mojang requirement, not ours.

While you're there, take a look at:

- `server_type` — defaults to `paper` (recommended). Switch to `vanilla`, `fabric`, `forge`, `purpur`, or `folia` if you have a reason.
- `minecraft_version` — defaults to `LATEST`. Pin a version (e.g. `1.21.3`) if you have version-locked plugins.
- `memory_mb` — defaults to `2048`. Bump to `4096` if you'll have more than ~5 players or any meaningful plugin pack.
- `online_mode` — leave on (the default) for Microsoft-account play. Flip off for LAN-only / kids without Xbox accounts (see [No-Xbox setup](/bruh-minecraft/features/#no-xbox-family-mode)).
- `initial_ops` — drop your Minecraft username here so you're an OP the first time you join.

See the [Configuration Reference](/bruh-minecraft/configuration/) for the full option list.

## Step 4 — Start the Add-on

Click **Start**. Open the **Log** tab to watch the boot:

1. Server jar resolution and download (cached, so subsequent starts are instant).
2. `server.properties` rendering from your add-on options.
3. Plugin downloads (with `If-Modified-Since`, so unchanged jars don't re-download).
4. Geyser / Floodgate setup if `enable_bedrock_support` is on.
5. JVM startup — about 30 seconds for Paper to reach `Done`.

## Step 5 — Set Up the HA Integration

The add-on registers a `bruh_minecraft` discovery service with the Supervisor. Home Assistant will automatically prompt you to set up the **BRUH Minecraft** integration in **Settings → Devices & Services**.

Click **Configure**. This deploys the `bruh_minecraft` custom component to `/config/custom_components/bruh_minecraft/` and registers all the [sensors, buttons, and services](/bruh-minecraft/integrations/).

If it doesn't auto-discover, add it manually: **Settings → Devices & Services → Add Integration → BRUH Minecraft**.

## Step 6 — Connect

- **Java Edition:** `<your-HA-host>:25565`
- **Bedrock (iOS / Android / consoles / Win10/11):** `<your-HA-host>:19132` (UDP). On the same LAN, the server should appear automatically in the **Friends** tab — no manual IP needed.

The panel's dashboard tab will show the player count tick up as people join.

## Do I need to restart Home Assistant?

Yes, **once**, after the integration deploys its custom component for the first time. HA only loads custom components at startup.

| Scenario | Restart HA? | Why |
|----------|-------------|-----|
| First install of the add-on | **Yes** | HA needs to load `bruh_minecraft` from `/config/custom_components/`. |
| Add-on **version** upgrade that ships new integration code | **Yes** | Updated Python files won't be picked up until HA restarts. The add-on raises a persistent notification when this is needed. |
| Add-on **restart** (same version) | No | HA already has the integration loaded. |
| Add-on **config change** (Configuration tab) | No | The add-on re-renders `server.properties` on its own boot. |
| Switching active world profile | No (just click **Restart** on the add-on) | The add-on container restarts and re-points `/config/minecraft` at the new profile. |

:::tip
Most config-tab changes only need an add-on restart, not a full HA restart. Use the panel's header **Restart** button for fast JVM-only restarts (~15 s); use the HA **Restart** button on the add-on page when you've changed something the boot script reads (worlds, plugins list, Geyser settings).
:::

## Ports

The add-on runs with `host_network: true` so Bedrock LAN auto-discovery works. These ports bind directly on the HA host:

| Port | Purpose |
|------|---------|
| `25565/tcp` + `25565/udp` | Minecraft Java Edition |
| `19132/udp` | Minecraft Bedrock / Geyser |
| `24454/udp` | Simple Voice Chat (optional plugin) |
| `25575/tcp` | RCON — bound to `127.0.0.1` only, never the LAN |
| `8099/tcp` (internal) | Ingress panel — proxied by HA, not exposed |

To play from outside your network, forward `25565/tcp` and `25565/udp` (and `19132/udp` for Bedrock) on your router to the HA host.

:::caution
**Don't forward port 25575.** RCON is loopback-only by design — opening it to the LAN or internet is a remote-code-execution risk.
:::

## Verify Everything Works

1. **Panel:** the **Minecraft** entry in the HA sidebar should show a green status dot, current version, and uptime ticking up.
2. **Sensors:** in HA → **Developer Tools → States**, search `sensor.bruh_minecraft_` — `players_online`, `version`, `tps_1m`, etc. should all be populated.
3. **Service call:** **Developer Tools → Actions → `bruh_minecraft.say`** with `message: "hello"`. The message should appear in the in-game chat.
4. **Backup:** in the panel header, click **Backup**. Refresh the **Backups** tab — your first git commit (or tar.gz) should be listed.

## Where Things Live

| Path | Contents |
|------|----------|
| `/config/minecraft/` | Symlink to the active world profile (legacy compat). |
| `/config/minecraft-worlds/<profile>/` | Each world profile's full server root — world files, `server.properties`, plugins, ops/whitelist. |
| `/config/minecraft-backups/<profile>/` | Per-profile backup history (git or archives). |
| `/config/.bruh_minecraft/` | HA bridge state — request/response queues, stats, players. |
| `/config/custom_components/bruh_minecraft/` | Auto-deployed companion integration. |
| `/data/server-cache/` | Cached server jars (content-addressed, survives restarts). |
| `/data/panel/` | Ingress panel state, RCON secret, console log. |

## Troubleshooting Installation

**Add-on won't start with `fatal: The Minecraft EULA has NOT been accepted`** — set `eula: true` in the Configuration tab. There's no other way around this.

**`address already in use: bind: 0.0.0.0:25565`** — something else is listening on the Minecraft port. Stop the conflicting process, or remap the port in the **Network** tab.

**Integration doesn't auto-discover** — make sure you restarted HA after the first add-on start. If it still doesn't appear, add it manually via Devices & Services.

**Add-on starts but the panel says "Offline"** — wait ~30 s for Paper to finish loading. Check the **Log** tab for errors. The most common first-boot failure is a bad plugin URL — the add-on will warn and continue, but if you've made `plugins:` mandatory upstream of that, fix the URL and restart.

For more, see [Troubleshooting](/bruh-minecraft/troubleshooting/).
