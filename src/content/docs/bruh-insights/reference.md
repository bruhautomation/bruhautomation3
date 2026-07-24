---
title: Reference
description: Every configuration option, auth method, panel feature, and privacy detail for the BRUH Insights Home Assistant add-on — in one place.
---

Everything you might need to look up. Configure from **Settings → Add-ons → BRUH Insights → Configuration**. The defaults work out of the box; the table below mirrors `config.yaml` as shipped.

## Configuration options

| Option | Default | What it does |
|--------|---------|--------------|
| `auto_refresh_hours` | `24` | Fallback interval: regenerate each category every N hours when it has no schedule or interval of its own (set per card via ✎, globally via the ⚙ Settings dialog). `0` disables scheduled refresh — manual only. |
| `history_days` | `7` | How many days of history/statistics each analysis sees. |
| `history_keep_runs` | `40` | Past runs kept per category for the date selector. `0` disables insight history. |
| `history_keep_days` | `30` | Past runs older than this are pruned. `0` disables insight history. |
| `model` | *(empty)* | Claude model override (e.g. `claude-sonnet-4-5`). Empty = the CLI default. |
| `generation_timeout_minutes` | `8` | Hard per-insight generation timeout. |
| `log_level` | `info` | `trace`, `debug`, `info`, `notice`, `warning`, `error`, `fatal`. |

Generation runs **one insight at a time** through a queue, which keeps things friendly to subscription rate limits. A full "Refresh all" takes several minutes — cards fill in one by one.

### Network

| Port | Default | What it does |
|------|---------|--------------|
| Ingress | *(always on)* | The Insights panel in the sidebar. Admin users only; never exposed on a host port. |

The add-on exposes **no host ports** (since 1.5.0): dashboard cards are served by Home Assistant itself via the `/local` mirror.

## Settings (⚙) — token budget & master switch

The **⚙ Settings** button in the panel controls how much of your Claude subscription Insights may spend — saved instantly, no restart:

| Control | What it does |
|---------|--------------|
| **Automatic insights** | Master switch. Off pauses every scheduled run (nothing spends tokens); manual **Generate**, **Refresh all**, and **Ask** still work. A topbar chip reminds you it's off. |
| **Your Claude subscription** | Pro, Max 5×, or Max 20× — sizes the estimate of your 5-hour session window. |
| **Session usage budget** | A slider: *let Insights use up to N% of each 5-hour session.* Once the window's usage reaches the budget, automatic runs pause until it rolls over (topbar chip says so). Manual clicks are never blocked. |

The dialog shows a live usage meter. With [BRUH Terminal](/bruh-claude/) installed, the meter and budget use your **real Anthropic account utilization** (its usage-limits tracker at `/config/.bruh_claude/usage_limits.json` — all Claude use counts, so Insights backs off when *you* are using Claude). Without it, Insights counts its own runs' tokens against a rough per-plan session estimate.

## Connecting a Claude account

| Method | How | Notes |
|--------|-----|-------|
| Shared login | Run `ha-share-login` in [BRUH Terminal](/bruh-claude/) | Credential shared at `/config/.bruh_claude/secrets/claude_auth.json`; the auth chip shows "Claude · shared login". A credential connected directly in Insights always takes precedence. |
| Guided sign-in | Panel runs `claude setup-token`, you paste the one-time code | Token stored in `/data/secrets` (mode 0600), never leaves the add-on. |
| Paste a token | `claude setup-token` anywhere → paste `sk-ant-oat…` | Same result as guided sign-in. |
| API key | Paste `sk-ant-api…` from console.anthropic.com | Billed to your API account instead of the subscription. |

**Sign out** (auth chip → logout) forgets the locally stored credential; if a shared BRUH Terminal login exists, Insights falls back to it automatically.

## The panel

### Categories & custom insights

- **Nine built-in categories**: Overview, Energy, Climate, Lighting, Security, Presence, Media, Device Health, Automations.
- **✎ prompt editor** per card: analysis focus (with "custom prompt" badge and **Restore default**), enable/disable, a per-category refresh interval (`0` = manual only, empty = add-on default), or **fixed daily run times** (e.g. `07:00, 19:00`, 24h clock, up to 6) which take precedence over the interval — the card regenerates right after each listed time and spends nothing in between. Each stored insight records the focus it was generated with (`focus_used`).
- **＋ New insight** creates up to **24 custom recurring insights** — name, icon, analysis prompt, optional refresh interval or daily run times. They behave exactly like shipped categories: auto-refresh, "Refresh all", run history, feedback.
- **＋ Make recurring** in any Ask card's footer promotes a one-off question into a recurring insight.

### Insight history

Every category run is stored as a dated copy (Ask cards are not kept). Each card's footer has a run selector and ‹/› step buttons; picking a past run pins the card ("Viewing … — Back to latest") and highlight stats show a "prev: …" comparison. Retention is governed by `history_keep_runs` / `history_keep_days`; individual runs can be deleted via `DELETE /api/insight/{id}/history/{timestamp}`.

### Feedback

💬 on any recurring card records **standing instructions** ("show costs in dollars") injected into every future generation until removed. Each entry is also handed to the home's shared memory. **Send & regenerate** applies it immediately.

### Tags

The analyst tags every card by what it found (`#anomaly`, `#batteries`, `#left-on`, …). The chip row is the live union of those tags with per-chip match counts; `#asked` collects your question cards.

### Memory

🧠 **Memory** shows everything Insights has learned: open questions (answer or dismiss inline), learned facts (remove or teach), answered Q&A, and — when BRUH Terminal maintains one — the shared memory file at `/config/.bruh_claude/memory/memory.md`. Questions have a lifecycle (open → answered/dismissed) with a hard never-re-ask rule. Findings and answers are handed to the `bruh_claude` integration (`bruh_claude.add_memory` / `bruh_claude.answer_question`) when installed, with a `/share/bruh_claude/memory-inbox/` fallback — Insights' own memory works either way.

### Dashboard cards

Press **▦** on a card and paste the YAML it gives you:

```yaml
type: iframe
url: /local/bruh_insights/energy-<your-card-token>.html
title: Energy
aspect_ratio: 90%
```

Insight HTML is mirrored into `/config/www/bruh_insights/` (created the first time you open the ▦ dialog), where Home Assistant itself serves it at `/local/…` — same origin as every dashboard, so cards work on HTTP, HTTPS, and Nabu Casa alike. The card always shows the **latest run** and reloads every 15 minutes. The card token is a per-install random secret (`/data/secrets/card_token`) embedded in the file name; the mirror holds *only* insight HTML — no API, no credentials, no controls. Anyone with the exact URL can view that insight, so treat the token like any dashboard-level secret.

## Deep presence

For Overview, Presence, and every Ask question, the add-on walks the device registry and includes the sibling entities on the same physical device as each presence tracker — typically the companion-app phone: WiFi SSID, geocoded address, detected activity, battery and charging state — with recent history. The analyst is instructed to cross-reference these signals and cite its evidence ("phone on home WiFi and charging since 10:41 PM") instead of parroting `home`/`not_home`.

## Privacy & security

- Home data is sent to Anthropic's API only when an insight is generated; nothing else leaves your machine, and nothing is sent on a schedule unless auto-refresh is enabled and an account is connected.
- Person **GPS coordinates are not included** in snapshots — only zone/state and areas. Device-context expansion does include the *states* of phone sensors such as the geocoded-address sensor; disable those sensors in the companion app or hide the entities in HA to exclude them.
- Generated visualizations render in **sandboxed iframes** (`sandbox="allow-scripts"`) — they cannot touch your HA session, cookies, or the panel.
- The panel is reachable only through **HA Ingress** (admin users). The add-on exposes no host ports; dashboard-card files embed the per-install token in their unguessable `/local` file names.
- Under `/config` the add-on writes only the home memory file (`/config/.bruh_claude/memory/memory.md`) and — once dashboard cards are first used — the card mirror (`/config/www/bruh_insights/`); `/share` is writable solely for the memory-inbox drop-files.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Claude auth failed" on the chip | The stored token is invalid/expired. Sign out and reconnect. Subscription tokens can be revoked from your Anthropic account settings. |
| Generation failed: timed out | Raise `generation_timeout_minutes`, or set a faster `model`. |
| Cards look thin ("data for this angle is thin") | The category found few matching entities — check areas are assigned and sensors enabled in HA. |
| "OAuth error … status code 400" during guided sign-in | The one-time code didn't match this sign-in attempt (codes are tied to the exact link and expire quickly). The panel fetches a **fresh link** after a failed attempt — open the new link, sign in again, paste the new code in full. |
| Guided sign-in never shows a link | Use the **Paste a token** tab instead (`claude setup-token` in any terminal with Claude Code). |
| Anything else | **Settings → Add-ons → BRUH Insights → Log**, with `log_level: debug`. |

## Disclaimer

BRUH Insights is an independent project, not affiliated with, endorsed by, or sponsored by Anthropic. "Claude" and "Claude Code" are trademarks of Anthropic, PBC. The add-on runs the official Claude Code CLI under your own Anthropic account; your use of Claude through it is governed by [Anthropic's terms](https://www.anthropic.com/legal/consumer-terms).
