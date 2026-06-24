---
title: Quick Start
description: Install BRUH Claude Terminal, restart HA once, sign in, and ask Claude something about your house — in about five minutes.
---

Five minutes from zero to a working AI assistant inside your Home Assistant.

## Prerequisites

- **Home Assistant OS** or **Supervised** (the add-on system requires the Supervisor).
- An **Anthropic account** — a **Claude Pro** or **Max** subscription is the most economical option, since Claude Code authenticates via OAuth and uses your subscription. An API key works too if you'd rather pay per token (note: usage-limit sensors need the subscription login).
- A **modern 64-bit HA host** (any Pi 4/5, x86 NUC, or generic 64-bit server). Older 32-bit ARM boards (Pi 3 and earlier) aren't supported — the add-on builds for `amd64` and `aarch64`.
- ~**1 GB of free RAM** beyond what HA itself uses. Fast voice mode keeps pre-warmed workers around (~150–300 MB each, max 3); you can turn it off on tight hosts.

## 1. Add the repository

In Home Assistant: **Settings → Add-ons → Add-on Store → ⋮ → Repositories**, then paste:

```text title="Repository URL"
https://github.com/bruhautomation/BRUH-HA-Apps
```

## 2. Install the add-on

Find **BRUH Claude Terminal** in the store and click **Install**, then **Start** when it's done.

## 3. Restart Home Assistant

**Required on first install** so HA loads the BRUH Claude integration.

**Settings → System → Restart.**

:::tip
You'll see a persistent notification when a restart is needed — after this first install, and after add-on version upgrades (a repair appears too). Add-on restarts within the same version don't need an HA restart.
:::

## 4. Set up the integration

After the restart, HA discovers the integration automatically — accept the prompt in **Settings → Devices & Services**. This registers the conversation agent, the usage-limit sensors, the assist-health binary sensor, and the `bruh_claude.send_prompt` / `run_task` / `run_insight` / `clear_conversation` services.

## 5. Sign in with Anthropic

Open the **BRUH Claude** entry in the HA sidebar and complete the OAuth login in the terminal.

:::tip[Use your Claude subscription]
Claude Code authenticates via OAuth, so a **Claude Pro** or **Max** subscription covers your usage — no per-token API billing for everyday use. You can also sign in with an API key if you prefer, though the usage-limit sensors only populate with a subscription login.
:::

Credentials are stored in the add-on's persistent volume — they survive restarts.

## Try it

Type into the terminal:

```text title="In the BRUH Claude terminal"
> How many entities do I have?
> Which lights are on right now?
> How cold did it get last night?
> Show me automations that haven't run in 30 days
```

If Claude responds with real data about your installation, you're done.

## Next steps

- **Use Claude as your voice assistant.** Go to **Settings → Voice Assistants → [your pipeline]** and pick **BRUH Claude** as the conversation agent. Give the agent a name, a model, and (optionally) a personality. By default voice can control everything but can't run shell commands or read files.
- **Schedule a daily briefing.** In the integration, **Add Service → Insight job**, pick the *Daily briefing* template, and set a time. The report lands in a sensor with dashboard card YAML you can paste straight onto a card.
- **Trigger Claude from automations.** Call `bruh_claude.run_task` with a prompt — Claude runs in the background and (optionally) notifies you when it's done.
- **Tune behaviour.** See the [Reference](/bruh-claude/reference/) for every config option, recommended presets, and the full service / sensor / tool list.

## Common first-install hiccups

| Symptom | Fix |
|---------|-----|
| Add-on won't start | Check the **Log** tab. Almost always an architecture mismatch (only `amd64`/`aarch64`) or a port 7681 conflict. |
| Integration not discovered | You probably skipped step 3. Restart HA, then check **Settings → Devices & Services** (or add **BRUH Claude** manually). |
| OAuth login fails | Verify the HA host can reach `console.anthropic.com`. After updates, you may need to re-authenticate. |
| "Claude can't see my entities" | Confirm `enable_ha_mcp_server: true`, then run **`ha-selftest`** in the terminal — it drives the MCP server end-to-end and reports any tool that errors. |
| Usage-limit sensors stay *unavailable* | They need an OAuth/subscription login (not an API key). New installs show data once you've used Claude; the sensor's `error` attribute explains why if not. |
