---
title: Quick Start
description: Install BRUH Claude Terminal, restart HA once, sign in, and ask Claude something about your house.
---

5 minutes from zero to a working AI assistant in your Home Assistant.

## Prerequisites

- **Home Assistant OS** or **Supervised** (the add-on system requires the Supervisor)
- An **Anthropic account** — a **Claude Pro** or **Max** subscription is the most economical option since Claude Code authenticates via OAuth and uses your subscription. An API key works too if you'd rather pay per token.
- A **modern 64-bit HA host** (any Pi 4/5, x86 NUC, or generic 64-bit server). Older 32-bit ARM boards (Pi 3 and earlier) aren't supported.
- ~**1 GB of free RAM** beyond what HA itself uses.

## 1. Add the repository

In Home Assistant: **Settings → Add-ons → Add-on Store → ⋮ → Repositories**, then paste:

```
https://github.com/bruhautomation/BRUH-HA-Apps
```

## 2. Install the add-on

Find **BRUH Claude Terminal** in the store and click **Install**. Click **Start** when it's done.

## 3. Restart Home Assistant

**Required on first install** so HA loads the BRUH Claude integration.

**Settings → System → Restart.**

:::tip
You'll see a persistent notification when a restart is needed (after this first install, and after add-on version upgrades). Add-on restarts within the same version don't need an HA restart.
:::

## 4. Set up the integration

After the restart, HA will discover the integration automatically — accept the prompt in **Settings → Devices & Services**. This registers the conversation agent, token usage sensors, and the `bruh_claude.send_prompt` / `bruh_claude.run_task` services.

## 5. Sign in with Anthropic

Open the **BRUH Claude** entry in the HA sidebar and complete the OAuth login in the terminal.

:::tip[Use your Claude subscription]
Claude Code authenticates via OAuth, so a **Claude Pro** or **Max** subscription covers your usage — no per-token API billing for everyday use. You can also sign in with an API key if you prefer.
:::

Credentials are stored in the add-on's persistent volume — they survive restarts.

## Try it

Type into the terminal:

```
> How many entities do I have?
> Which lights are on right now?
> Show me automations that haven't run in 30 days
```

If Claude responds with real data about your installation, you're done.

## Next steps

- **Use Claude as your voice assistant.** Go to **Settings → Voice Assistants → [your pipeline]** and pick **BRUH Claude** as the conversation agent.
- **Trigger Claude from automations.** Call the `bruh_claude.run_task` service with a prompt — Claude runs in the background and (optionally) notifies you when it's done.
- **Tune behaviour.** See the [Reference](/bruh-claude/reference/) for every config option, recommended presets, and the full service / sensor list.

## Common first-install hiccups

| Symptom | Fix |
|---------|-----|
| Add-on won't start | Check the **Log** tab. Almost always architecture mismatch (only amd64/aarch64) or port 7681 conflict. |
| Integration not discovered | You probably skipped step 3. Restart HA, then check **Settings → Devices & Services**. |
| OAuth login fails | Verify the HA host can reach `console.anthropic.com`. After updates, you may need to re-authenticate. |
| "Claude can't see my entities" | Confirm `enable_ha_mcp_server: true` in the add-on config. |
