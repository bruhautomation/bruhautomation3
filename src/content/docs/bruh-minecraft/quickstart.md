---
title: Quick Start
description: Install BRUH Minecraft Server, accept the EULA, and connect from Java or Bedrock in under five minutes.
---

Five minutes from zero to a running Minecraft server.

## Prerequisites

- **Home Assistant OS** or **Supervised**
- A **modern 64-bit HA host** (Pi 4/5, x86 NUC, or any 64-bit server). Java 21 is required, which doesn't run on older 32-bit ARM hardware.
- ~**2 GB free RAM** beyond what HA itself uses (4 GB+ for plugin-heavy setups)

## 1. Add the repository

In Home Assistant: **Settings → Add-ons → Add-on Store → ⋮ → Repositories**, then paste:

```
https://github.com/bruhautomation/BRUH-HA-Apps
```

## 2. Install the add-on

Find **BRUH Minecraft Server** in the store and click **Install** (~600 MB image).

## 3. Accept the EULA

Open the **Configuration** tab and set:

```yaml
eula: true
```

This acknowledges the [Minecraft EULA](https://www.minecraft.net/eula) — required by Mojang.

While you're there, you'll likely want to set:

- `memory_mb: 4096` if you'll have more than ~5 players or any plugins
- `initial_ops: ["YourMinecraftUsername"]` so you're an OP the first time you join
- `online_mode: false` for LAN-only / no-Xbox-account play (see [Family mode](#family-mode-no-xbox-required) below)

## 4. Start

Click **Start**. Watch the **Log** tab — Paper takes ~30 seconds to reach `Done`. After the integration discovery prompt, click **Configure** in **Settings → Devices & Services**.

## 5. Connect

| Edition | Address | LAN auto-discovery |
|---------|---------|--------------------|
| Java | `<your-HA-host>:25565` | — |
| Bedrock (iOS, Android, console, Win10/11) | `<your-HA-host>:19132` | Yes — appears in the **Friends** tab |

The panel's dashboard tab shows the player count tick up as people join.

## Family mode (no Xbox required)

Want kids to join without Microsoft accounts?

```yaml
online_mode: false
```

That's the whole change. The add-on then fixes every downstream setting Microsoft and GeyserMC normally gate behind that one flag — secure-profile enforcement, Geyser auth-type, Floodgate, Bedrock login validation. Java and Bedrock both work without Xbox sign-in.

:::caution
**LAN-only.** Offline mode is unsafe on a public/internet-exposed server — anyone who guesses a username can join as that player.
:::

## Open it to the internet

Forward these on your router to your HA host:

| Port | Why |
|------|-----|
| `25565/tcp` + `25565/udp` | Minecraft Java |
| `19132/udp` | Minecraft Bedrock |

**Don't forward `25575`** — RCON is loopback-only by design.

## Common first-install hiccups

| Symptom | Fix |
|---------|-----|
| `EULA has NOT been accepted` | Set `eula: true`. |
| `address already in use: 25565` | Another server's running. Stop it, or change the port mapping. |
| Bedrock not in Friends tab | Same subnet/VLAN as HA? Try `<HA host IPv4>:19132` manually. |
| iOS hangs on "Connecting…" | Set `geyser_mtu: 1200`. |
| Plugin install warning, server still starts | A bad URL in `plugins:`. Add-on logs which one — fix or remove it. |

For more, see the [Reference](/bruh-minecraft/reference/#troubleshooting).
