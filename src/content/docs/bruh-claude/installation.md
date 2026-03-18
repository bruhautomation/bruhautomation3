---
title: Installation
description: How to install and set up BRUH Claude Terminal in Home Assistant.
---

Getting BRUH Claude running takes about 5 minutes. You'll add the repository, install the add-on, restart Home Assistant once, and authenticate with Anthropic.

## Prerequisites

Before you start, make sure you have:

- **Home Assistant OS** or **Home Assistant Supervised** (add-ons require the Supervisor)
- An **Anthropic account** with API access (Claude Code uses OAuth authentication)
- A device running **amd64** or **aarch64** architecture

:::note
BRUH Claude does **not** work with Home Assistant Container or Home Assistant Core installations, as these don't support the Supervisor add-on system.
:::

## Step 1 — Add the Repository

Open Home Assistant and navigate to **Settings → Add-ons → Add-on Store** (bottom right corner). Click the three-dot menu in the top right and select **Repositories**.

Paste this URL and click **Add**:

```
https://github.com/bruhautomation/BRUH-HA-Apps
```

The BRUH HA Apps repository will now appear in your add-on store.

## Step 2 — Install the Add-on

Find **BRUH Claude Terminal** in the store and click **Install**. The image is about 500 MB, so this may take a few minutes depending on your connection.

Once installed:

1. Go to the **Configuration** tab and review the default settings (see [Configuration Reference](/bruh-claude/configuration/) for details)
2. Click **Start**
3. Open the **Log** tab to verify the add-on starts successfully

## Step 3 — Restart Home Assistant

This step is **required on first install**. BRUH Claude deploys a custom integration (`custom_components/bruh_claude/`) that provides the conversation agent and sensor entities. Home Assistant only loads custom component code at startup, so a restart is needed.

Go to **Settings → System → Restart**.

:::tip
You'll see a persistent notification in HA when a restart is needed. After upgrades that change the add-on version, you'll need to restart again for the same reason.
:::

## Step 4 — Set Up the Integration

After the restart, Home Assistant will automatically discover the BRUH Claude integration. You'll see a notification in **Settings → Devices & Services** prompting you to set it up.

Click **Configure** to complete the integration setup. This registers:

- The **BRUH Claude** conversation agent
- **Token usage sensors** for monitoring API usage
- The `bruh_claude.send_prompt` and `bruh_claude.run_task` services

If auto-discovery doesn't appear, you can add it manually: **Settings → Devices & Services → Add Integration → BRUH Claude**.

## Step 5 — Authenticate with Anthropic

Open the BRUH Claude Terminal from the sidebar (look for the **BRUH Claude** panel icon) and complete the Anthropic OAuth login in the terminal. Claude Code will walk you through the authentication flow.

Once authenticated, your credentials are stored in the add-on's persistent storage (`/data`), so they survive container restarts.

## Verify Everything Works

After authentication, try a quick test:

```bash
# In the BRUH Claude terminal, ask Claude something about your HA instance
> How many entities do I have?
```

If Claude responds with real data about your installation, you're all set. It's using the MCP server to query your Home Assistant API in real time.

## What Gets Installed

Here's exactly what the add-on sets up on your system:

| Component | Location | Purpose |
|-----------|----------|---------|
| Add-on container | Managed by Supervisor | Runs Claude Code, MCP server, and listeners |
| Custom integration | `/config/custom_components/bruh_claude/` | Conversation agent, services, and sensors |
| IPC directory | `/config/.bruh_claude/` | File-based communication bridge |
| Persistent storage | `/data` (add-on volume) | OAuth credentials, git backups, packages |
| Context file | `/config/CLAUDE.md` | Auto-generated HA system description |

## When Do I Need to Restart?

| Scenario | Restart? | Why |
|----------|----------|-----|
| First install | **Yes** | HA must load the new custom component |
| Add-on version upgrade | **Yes** | Updated Python files need reloading |
| Add-on restart (same version) | No | HA already has the code loaded |
| Config option changes | No | Options are read at add-on startup |

## Troubleshooting

**Add-on won't start:** Check the Log tab for errors. Common issues include architecture mismatches (only amd64 and aarch64 are supported) and port conflicts on 7681.

**Integration not discovered:** Make sure you restarted HA after the first install. If it still doesn't appear, add it manually via Devices & Services.

**Authentication fails:** Ensure you have a valid Anthropic account. If OAuth fails after an upgrade, open the terminal and re-authenticate — this doesn't affect already-configured conversation agents.

**Claude can't access HA data:** Verify that `enable_ha_mcp_server` is `true` in the add-on configuration. Check the add-on logs for MCP server startup messages.
