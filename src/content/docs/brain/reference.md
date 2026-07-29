---
title: Reference
description: Every configuration option, service, sensor, CLI command, and MCP capability for the BRain add-on — in one place.
---

Everything you might need to look up. Configure from **Settings → Add-ons → BRain → Configuration**. The defaults work out of the box; the tables below mirror `config.yaml` as shipped.

## Configuration options

### Faces

One ingress panel serves everything; these turn either face off. The panel itself always runs, because it is the ingress target.

| Option | Default | What it does |
|--------|---------|--------------|
| `enable_terminal` | `true` | Run the ttyd terminal and show the **Terminal** tab. Off gives a dashboard-only install with no shell. |
| `enable_insights` | `true` | Run insight generation and show the **Insights** tab. |

### Startup

| Option | Default | What it does |
|--------|---------|--------------|
| `auto_launch_claude` | `true` | Launch Claude Code immediately in the terminal. `false` lands on the shell with a session picker instead. |
| `auto_generate_context` | `true` | Regenerate `/config/CLAUDE.md` on boot — a snapshot of your install (entities by domain, automations + states, add-ons, integrations, file tree, the two CLI dispatchers) that Claude reads at the start of each session. |
| `enable_mobile_ui` | `true` | Splice the touch toolbar + iOS fixes into the terminal. `false` falls back to ttyd's stock UI. |
| `log_level` | `info` | `trace`, `debug`, `info`, `notice`, `warning`, `error`, `fatal`. Bump to `debug` when filing a bug. |

### Native HA integrations

| Option | Default | What it does |
|--------|---------|--------------|
| `enable_ha_mcp_server` | `true` | The MCP server that gives Claude live entities, device control, cameras, history, traces, logs, templates, and reloads. |
| `enable_assist_integration` | `true` | Run as a conversation agent in HA Voice Assistants. |
| `assist_fast_mode` | `true` | Keep pre-warmed Claude workers alive for voice (one per active conversation plus a hot spare) so turns skip the CLI boot and MCP handshake. ~150–300 MB RAM per warm worker (max 3). `false` uses the classic spawn-per-request listener. |
| `enable_automation_integration` | `true` | Trigger BRain tasks from automations via `brain.run_task`. |

### Memory and learning

| Option | Default | What it does |
|--------|---------|--------------|
| `learning` | `true` | Master switch for **everything** BRain learns: the end-of-conversation reflection pass, the consolidator, and study sessions. Turning it off leaves existing memory in place and still used. |
| `memory_injection` | `true` | Splice learned memory into voice prompts. |
| `memory_max_kb` | `8` (1–64) | Size cap for the memory document. |
| `study_max_turns` | `60` (0–500) | Turn cap for a study session. **`0` removes the cap.** |
| `study_timeout_minutes` | `30` (2–120) | Wall-clock limit for a study session. |

### Turn budgets

These cap how many agentic loops BRain runs before returning.

| Option | Default | What it does |
|--------|---------|--------------|
| `assist_max_turns` | `8` (1–40) | Per-request cap for the voice agent. Deliberately modest: latency *is* the product for voice, and the cached area map means most commands take one or two turns anyway. |
| `automation_max_turns` | `30` (1–200) | Per-request cap for automation tasks. Nobody is waiting on those, so it's generous. |
| `study_max_turns` | `60` (0–500) | See above. |

:::note[Why the study limits are generous]
A turn cap is not a safety valve — it **truncates**. A study session that hits one stops mid-thought and produces nothing parseable, so the whole run is wasted *after* paying for every token. That makes a tight cap the most expensive setting in the add-on. Depth is the entire point of a study session, so the honest guards are wall-clock time and your account's own usage budget, not turn count. Hitting a limit is reported as hitting a limit, and study prompts tell the model to land its result if it senses it is running short, so a long session degrades to partial rather than losing everything.
:::

### Insights

| Option | Default | What it does |
|--------|---------|--------------|
| `auto_refresh_hours` | `24` (0–168) | How often recurring cards regenerate when they have no schedule of their own. `0` disables scheduled refresh — manual only. |
| `history_days` | `7` (1–30) | How many days of history/statistics each analysis sees. |
| `history_keep_runs` | `40` (0–200) | Past runs kept per card for the run selector. `0` disables history. |
| `history_keep_days` | `30` (0–365) | Past runs older than this are pruned. `0` disables history. |
| `model` | *(empty)* | Claude model override (e.g. `claude-sonnet-4-5`). Empty = the CLI default. |
| `generation_timeout_minutes` | `8` (2–30) | Hard per-generation timeout. |

These are also editable from the panel's **Settings** dialog, which writes changes back here through the Supervisor — both screens always show the same value.

Generation runs **one card at a time** through a queue, which keeps things friendly to subscription rate limits.

### Undo

| Option | Default | What it does |
|--------|---------|--------------|
| `edit_journal_days` | `14` (0–365) | How long to keep snapshots of files Claude edited. `0` disables the journal entirely. |

### Permissions & tool scoping

| Option | Default | What it does |
|--------|---------|--------------|
| `assist_tool_access` | `mcp_only` | What voice may do. `mcp_only` allows every HA MCP tool (full device control, cameras, history, any service call) but denies shell, **all** file access, and web — so voice can't author automations or read `secrets.yaml`. `full` lifts the restriction. |
| `dangerously_skip_permissions` | `false` | **Interactive terminal only.** Skips per-action confirmation prompts. Background channels (voice, automations, insights, study) are unaffected — they use a pre-approved allowlist instead. |

:::note[Per-agent blocked services]
Beyond the coarse `assist_tool_access` switch, each voice agent has its own **Blocked services** picker (in its config) — patterns like `lock.unlock` or a whole `alarm_control_panel.*` that *that* agent may never call. It's enforced in the MCP server's `call_service` chokepoint, so it covers every device tool and phrasing, not just the generic call.
:::

### Volume access

The container always mounts `/share`, `/media`, `/backup` (read-only), `/addon_configs`, and `/addons`. Toggling one off doesn't unmount it — it stops Claude's tools from being pointed at it (defence in depth).

| Option | Default |
|--------|---------|
| `access_share` | `true` |
| `access_media` | `true` |
| `access_backup` | `true` |
| `access_addon_configs` | `true` |
| `access_addons` | `true` |
| `additional_directories` | `[]` — extra absolute container paths to expose |

### Persistent packages

The container is rebuilt fresh on every update. These keep your tools installed across rebuilds.

| Option | Default | Example |
|--------|---------|---------|
| `persistent_apk_packages` | `[]` | `["vim", "htop", "ripgrep"]` |
| `persistent_pip_packages` | `[]` | `["pandas", "requests"]` |

## Recommended presets

### Quiet — terminal only

```yaml
enable_terminal: true
enable_insights: false
auto_launch_claude: true
auto_generate_context: true
enable_ha_mcp_server: true
enable_assist_integration: false
enable_automation_integration: false
learning: true
```

### Everything on

```yaml
enable_terminal: true
enable_insights: true
enable_ha_mcp_server: true
enable_assist_integration: true
assist_fast_mode: true
assist_tool_access: mcp_only
enable_automation_integration: true
assist_max_turns: 8
automation_max_turns: 30
study_max_turns: 0        # no cap — let it dig
study_timeout_minutes: 45
learning: true
```

## The panel

One ingress panel with four tabs.

### Insights

A fresh install has **no cards**. The first run studies your home, then proposes cards grounded in what it found, each with a one-line reason citing the evidence; you pick which to keep. Nothing generates, and the scheduler stays idle, until you do. If the home is too sparse to learn from, BRain says what's missing rather than inventing generic cards — see [Quick Start](/brain/quickstart/#let-it-learn-your-home).

- **Ask anything** — type a question and get a bespoke card back. **＋ Make recurring** promotes it onto its own schedule.
- **✎ per card** — edit that card's analysis focus, its refresh interval, or **fixed daily run times** (e.g. `07:00, 19:00`, up to 6) which take precedence over the interval and spend nothing in between.
- **💬 feedback** — standing instructions (*"show costs in dollars"*) injected into every future run of that card until removed.
- **Run history** — every run is stored per `history_keep_runs` / `history_keep_days`, with a run selector and prev-run comparisons on highlight stats.
- **Tags** — cards are tagged by what was found (`#anomaly`, `#batteries`, `#left-on`); the chip row filters live.

### Terminal

The same ttyd terminal the add-on runs, reverse-proxied through the panel at `/terminal/`, so it's a tab rather than a second sidebar entry. The frame only connects the first time you open the tab — no shell session is started for someone who never does. Port 7681 stays published for direct access (a kiosk, a bookmarked full-screen terminal).

### Memory

An editor over `memory.md`, plus any pending guesses awaiting a yes/no. The tab shows a count when guesses are waiting. Full model: [Memory & Learning](/brain/memory/).

### Docs

The built-in guide, searchable, with the matched term highlighted in the page.

### Token budget

The panel's **Settings** dialog caps how much of each 5-hour session window BRain may spend on scheduled work; automatic runs pause at the budget, manual clicks never do. The meter uses your **real Anthropic account utilization** from the usage-limits tracker, so BRain backs off when *you* are using Claude elsewhere. A topbar chip keeps the session's usage and reset time in view.

## Voice assistant (Assist)

Select **BRain** as a conversation agent in **Settings → Voice Assistants**. Each agent has its own name, model, personality, and blocked-services list. New agents default to Claude Haiku (`Default` inherits the terminal's model); `brain.clear_conversation` resets conversation memory (omit `conversation_id` to reset all). How it works — fast mode, the area map, personalities: [Voice Assistant](/brain/voice/).

## Insight jobs

Scheduled reports rendered to **sensors**, created from **Settings → Devices & Services → BRain → Add Service → Insight job**. The report lands in the sensor's attributes: `preview` (first lines), `markdown` (full report), `card_yaml` (ready-to-paste card). A `brain_insight_complete` event fires after every run with `name`, `entity_id`, `success`, and `preview`. Templates, scheduling, and dashboard recipes: [Automations & Insight Jobs](/brain/automations/#insight-jobs).

## HA services

```yaml
# Send a prompt and wait for the response
action: brain.send_prompt
data:
  prompt: "What entities are offline?"
  timeout: 120
  model: haiku        # optional per-call override

# Run a task in the background, with optional notification
action: brain.run_task
data:
  prompt: "Check today's error log and summarise the issues"
  notify: true
  timeout: 300

# Run one or all insight jobs now
action: brain.run_insight
data:
  name: "Daily Briefing"   # omit to run all

# Study the home. Returns immediately; results arrive in memory.
action: brain.study
data:
  topic: "energy"          # omit to study whatever has gone stalest

# Teach it something durable
action: brain.add_memory
data:
  fact: "The garage fridge is meant to run 24/7"
  confidence: high         # high | medium | low

# Reset conversation memory
action: brain.clear_conversation
# data: { conversation_id: "..." }   # omit to clear all
```

Plus the **56 [Power Tools](/brain/power-tools/)** services for registry administration.

## Sensors

### Learning sensors

| Entity | Reports |
|--------|---------|
| `sensor.brain_facts_learned` | How many things BRain knows |
| `sensor.brain_last_learned` | The most recent fact, with the text as an attribute |
| `binary_sensor.brain_waiting_on_you` | On when a guess needs a yes/no, with the text in `pending` |

A **`brain_learned`** logbook event fires for every new fact, so learning appears in your home's timeline next to lights and doors.

### Usage-limit sensors

Your real Anthropic account utilization — the same numbers as **claude.ai → Settings → Usage**, not estimates. A background tracker queries the Anthropic usage endpoint every ~2 minutes; the sensors poll it every 30 seconds.

| Sensor | Tracks | Key attributes |
|--------|--------|----------------|
| Session Usage | Percent of the current 5-hour session window used | `resets_at`, `data_source`, `last_updated` |
| Session Usage Resets At | When the 5-hour window resets | `utilization` |
| Weekly Usage | Percent of the rolling 7-day window used | `resets_at`, `data_source`, `last_updated` |
| Weekly Usage Resets At | When the 7-day window resets | `utilization` |

:::caution
These need an **OAuth / subscription login**, **not** an `ANTHROPIC_API_KEY`. With an API key — or before you've signed in — they stay **unavailable** and explain why in their `error` attribute. `brain doctor` reports this.
:::

### Health sensor

`binary_sensor.brain_system_assist_healthy` reports voice-assistant pool health, with worker count, the pre-warmed spare, and last-request latency as attributes.

## MCP server tools

The built-in MCP server gives Claude **36 tools** against your live install — including `get_registry` (areas, floors, labels, devices, entities, integrations, users) and `call_service` with `return_response` for the [Power Tools](/brain/power-tools/) workflow. Verify them on your own system with **`brain doctor`**. Full tool-by-tool reference: [MCP Tools](/brain/mcp/).

![MCP server tools by category](/images/brain/mcp-tools.svg)

## CLI

Two dispatchers in the terminal — `brain` for BRain's own faculties, `ha` for Home Assistant operations. `brain help` and `ha help` list everything; the full tables are on [The CLI](/brain/cli/).

```bash
brain memory list        brain learn energy      brain undo      brain doctor
ha log                   ha reload automations   ha check        ha context
```

## Undo

BRain **does not back up your configuration.** Home Assistant's own backups are whole-system and restorable, and versioning `/config` inside `/config` only made those backups bigger.

What it keeps instead is an **edit journal**: before Claude writes to any file under `/config`, the previous contents are snapshotted to `/data/.brain/edits/`.

```bash
brain undo                # list recent edits, newest first
brain undo 3              # revert edit #3
brain undo --all-today    # revert everything Claude changed today
```

Snapshots are pruned after `edit_journal_days` and capped by total size. **`secrets.yaml` is never snapshotted.** An existing `/config/.git` directory from an older add-on is left strictly alone — BRain never writes to it; delete it yourself if you don't want it.

## Transport & health

In fast mode the worker pool serves an internal HTTP API on **port 8098** (the panel owns 8099), token-authenticated via the shared `/config` volume. The integration prefers it — no file polling, and replies stream so TTS starts at the first sentence. If the API is ever unreachable, both sides fall back to the original file protocol automatically. Nothing hardcodes the port; the integration reads it from the endpoint file the pool publishes.

![File-based IPC fallback flow](/images/brain/ipc-flow.svg)

## Permissions architecture

| Channel | Mechanism | Default access |
|---------|-----------|----------------|
| Interactive terminal | Prompts (unless `dangerously_skip_permissions: true`) | Everything — you approve actions |
| Voice / conversation agents | Pre-approved allowlist + `assist_tool_access` + per-agent deny-list | All HA MCP tools; **no** shell, file, or web |
| Automation tasks, insight runs, study sessions | Pre-approved allowlist | All tools (MCP, shell, file edits, web) |

Background channels never use `--dangerously-skip-permissions` — they can't prompt, so the add-on writes `/config/.claude/settings.local.json` pre-approving the tools they need. Everything runs sandboxed as a non-root user (UID 1000), limited to `/config`, `/data`, and the enabled volume toggles.

## Ports

| Port | What | Needed? |
|------|------|---------|
| 8099 | The ingress panel. Also reverse-proxies `/terminal/`. | Internal; ingress handles it. |
| 7681 | ttyd, direct access. | Optional — handy for a kiosk or a bookmarked full-screen terminal. |
| 8098 | The assist worker pool's internal API. | Internal only. |

## Where data lives

| Path | Contents |
|------|----------|
| `/config/CLAUDE.md` | Auto-generated install context |
| `/config/.brain/memory/memory.md` | **The memory document** — plain markdown, yours to edit |
| `/config/.brain/memory/voice.md` | The ≤2 KB distillate spliced into voice prompts (derived) |
| `/config/.brain/memory/inbox/` | Candidate facts awaiting consolidation |
| `/config/.brain/` | IPC bridge — request/response queues, sessions, logs |
| `/config/.brain/usage_limits.json` | Cached account utilization for the sensors |
| `/config/.brain/logs/{assist,automation}-YYYYMMDD.log` | Per-request debug logs |
| `/config/custom_components/brain/` | The HA integration |
| `/data/.brain/edits/` | The edit journal `brain undo` restores from |
| `/data/` (add-on volume) | OAuth credentials, persistent packages |

## Dashboard cards

Any insight can be embedded on a dashboard with ready-to-paste YAML from the dashboard-card dialog:

```yaml
type: iframe
url: /local/brain/energy-<your-card-token>.html
title: Energy
aspect_ratio: 90%
```

Insight HTML is mirrored into `/config/www/brain/`, where Home Assistant itself serves it at `/local/…` — same origin as every dashboard, so cards work on HTTP, HTTPS, and Nabu Casa alike with no port mapping. The card always shows the latest run and reloads every 15 minutes. The card token is a per-install random secret embedded in the file name; the mirror holds *only* insight HTML — no API, no credentials, no controls. Anyone with the exact URL can view that insight, so treat the token like any dashboard-level secret.

## Privacy & security

- Home data is sent to Anthropic's API only when you ask for something or a run you scheduled fires; nothing else leaves your machine.
- Person **GPS coordinates are never included** in snapshots — only zone/state and areas.
- Generated visualizations render in **sandboxed iframes** (`sandbox="allow-scripts"`) — they cannot touch your HA session, cookies, or the panel.
- The panel is reachable only through **HA Ingress** (admin users).
- `secrets.yaml` is never snapshotted into the edit journal, and credentials are never read, written, or included in any snapshot.

## Mobile UI

The terminal auto-detects touch devices and shows an on-screen toolbar above the keyboard.

- **`ESC` / `Tab` / `Ctrl` / arrows / `PgUp` / `PgDn` / `^C` / `Paste`** — the keys iOS doesn't give you, plus paging Claude Code's chat history.
- **Scroll chat history** by swiping up/down with one finger (or the mouse wheel on desktop) — translated to PgUp/PgDn, so long-press text selection still works for copying an OAuth URL.
- **Add to Home Screen** for a full-screen launcher without Safari chrome.
- **Voice dictation:** turn off iOS **Voice Control** (Settings → Accessibility) to avoid double-submission.
- Disable the whole mobile UI with `enable_mobile_ui: false`.

## When to restart Home Assistant

| Scenario | Restart? |
|----------|----------|
| First install | **Yes** — HA must load the new custom component |
| Add-on version upgrade | **Yes** — updated Python files need reloading (a notification + repair appear) |
| Add-on restart, same version | No |
| Config option changes | No — read at add-on boot |

:::tip[Update not showing up?]
The Supervisor only re-pulls add-on repositories periodically. To pick up a fresh release immediately: **Add-on Store → ⋮ → Check for updates**.
:::

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Add-on won't start | Check the **Log** tab. Architecture mismatch or a port 7681 conflict. |
| Integration not discovered | Restart HA after the first add-on start. Add manually via **Settings → Devices & Services** if needed. |
| The terminal asks for a second login | One credential is shared with the CLI in both directions; if it doesn't take, `brain doctor`'s auth check names the file it found and the one it expected. |
| It can't see entities | `enable_ha_mcp_server: true`? Run **`brain doctor`** — it reports any tool that errors. |
| Voice replies cut off | Bump `assist_max_turns`. |
| Voice agent answers wrong room | Run `brain doctor` — the "Assist area map" check confirms the room map is built. |
| A study session produced nothing | It probably hit `study_max_turns` or `study_timeout_minutes`; both are reported as such in the log. Raise them, or set `study_max_turns: 0`. |
| Cards look thin | The card found few matching entities — check areas are assigned and the relevant sensors enabled in HA. |
| Generation timed out | Raise `generation_timeout_minutes`, or set a faster `model`. |
| Usage sensors *unavailable* | They need an OAuth/subscription login, not an API key (see above). |
| Anything else | **Settings → Add-ons → BRain → Log**, with `log_level: debug`. |

### Per-request debug logs

Every Assist and automation request is logged with channel, prompt size, model, the speed path it took (`warm`/`spare`/`cold`/`…+fallback`), duration, and a response preview.

```bash
tail -f /config/.brain/logs/assist-$(date +%Y%m%d).log
tail -f /config/.brain/logs/automation-$(date +%Y%m%d).log
```

Set `log_level: debug` in the add-on config before reproducing a bug for maximum detail.

## Disclaimer

BRain is an independent project, not affiliated with, endorsed by, or sponsored by Anthropic. "Claude" and "Claude Code" are trademarks of Anthropic, PBC. The add-on runs the official Claude Code CLI under your own Anthropic account; your use of Claude through it is governed by [Anthropic's terms](https://www.anthropic.com/legal/consumer-terms).
