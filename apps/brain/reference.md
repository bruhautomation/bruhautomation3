---
title: Reference
description: Every brAIn configuration option with its default, the panel's settings, services, entities, events, CLI commands, ports and file locations, for brAIn 5.5.
---

Everything you might need to look up, as shipped in brAIn 5.5.38.

| Looking for | Go to |
| --- | --- |
| An add-on option | [Configuration options](#configuration-options) |
| A setting in ⚙ | [The panel](#the-panel) |
| A service to call from an automation | [HA services](#ha-services) |
| An entity or an event to trigger on | [Sensors](#sensors), [Events](#events) |
| A terminal command | [CLI](#cli) |
| Where a file lives | [Where data lives](#where-data-lives) |
| A fix for a symptom | [Troubleshooting](#troubleshooting) |

## Configuration options

Set these in **Settings → Add-ons → brAIn → Configuration**. The defaults work as shipped.

- **Also in the panel.** ⚙ → Model & usage writes `auto_refresh_hours`, `history_days`, `history_keep_runs`, `history_keep_days`, `model` and `generation_timeout_minutes` back to the add-on, and ⚙ → Permissions writes `dangerously_skip_permissions`. Both screens show the same value.
- **Setup's first screen** asks for a notify service and quiet hours. The panel stores that answer as a fallback under the add-on options, so it takes effect at once. An entry on the Configuration tab always wins.

### Faces

| Option | Label | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `enable_terminal` | Terminal | bool | `true` | Run the classic terminal on the Ask tab. Off runs brAIn as insights and voice only. |
| `enable_insights` | Insights tab | bool | `true` | Show the insight cards and let them regenerate on schedule. Off stops every scheduled Claude run. **Needs you stays** either way: the house checks cost nothing and still file there. |
| `auto_launch_claude` | Start Claude in the terminal | bool | `true` | Open Claude Code when you open the classic terminal. Off gives a plain shell with `claude` available. |
| `auto_generate_context` | Write CLAUDE.md for your config | bool | `true` | Keep `/config/CLAUDE.md` up to date with a summary of your entities, areas and integrations, so Claude starts every conversation knowing your home. |
| `enable_ha_mcp_server` | Home Assistant tools | bool | `true` | Give Claude tools for states, services, the registry, history and templates. Off leaves Claude able to read your files but not your house. |
| `enable_mobile_ui` | Mobile terminal toolbar | bool | `true` | An arrow-key and modifier toolbar for the classic terminal on phones and tablets, plus the iOS dictation fix. |
| `dangerously_skip_permissions` | Let brAIn act without asking | bool | `false` | Off, the terminal and the chat ask before Claude runs a command, edits a file or changes something in Home Assistant. On, they stop asking. The same switch as ⚙ → Permissions → *Act*. [Details](#let-brain-act-without-asking). |

#### Let brAIn act without asking

| | |
| --- | --- |
| **Off (default)** | The terminal and the chat ask before Claude runs a command, edits a file or changes something in Home Assistant. Only reading is pre-approved. |
| **On** | Both stop asking, and the action gate stops asking its own model what you meant. |
| **Still guarded when on** | brAIn's Home Assistant tools refuse your protected entities. So do plain shell service calls and YAML edits that name one. The tripwire, brAIn's own deny-list and your house rules still decide. A conversation about a card still asks before it changes Home Assistant. |
| **Not checked when on** | A shell command that reaches a protected entity some other way. A change a shell command makes cannot be undone with `brain undo`. |
| **Never applies to** | Apply runs, voice or background runs. |
| **Takes effect** | With no restart. A new terminal session and the chat's next message pick it up. An open terminal session keeps its setting until you end it with `/exit`. |

⚙ → Permissions also has a third level, **No limits**, which is a panel setting, not an option. brAIn may then do anything without asking, protected entities and house rules included. [Permissions & Safety →](/brain/safety/#three-permission-levels)

### Voice and automation

| Option | Label | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `enable_assist_integration` | Voice assistant | bool | `true` | Register brAIn under Settings → Voice assistants as a conversation agent. |
| `enable_automation_integration` | Automation tasks | bool | `true` | Let automations hand brAIn a job with `brain.run_task`. Also answers `brain.ask`, AI Task, and Morph's Tell and learning loop. |
| `assist_fast_mode` | Fast voice responses | bool | `true` | Keep warm Claude processes ready so voice answers in about a second. Uses more memory. |

What a voice agent may reach is set on the agent, under Settings → Devices & services → brAIn → the agent → Configure: *Voice assistant* (only what you expose to Assist, the default), *Whole house* or *Full admin*. [Voice →](/brain/voice/)

### Memory and learning

| Option | Label | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `learning` | Learn about your home | bool | `true` | The starting position of ⚙ › Features › **Learning loop**. Read once, on the first start of a version with the switch. After that the switch decides and this option does nothing. [The four switches →](/brain/features/) |
| `memory_injection` | Use memory in answers | bool | `true` | Include what brAIn has learned in its prompts. Off keeps the document but stops it informing answers. |
| `memory_max_kb` | Memory size limit | 1–64 | `32` | How large the memory document may grow. Not a speed setting: voice reads a separate 2 KB summary. |
| `study_timeout_minutes` | Study session timeout | 2–120 | `30` | How long a study session may run before it is stopped. |
| `ask_why` | Ask why you did something | bool | `true` | Once a day at most, one Claude run works out why somebody did something by hand, and records it or asks one short question on Needs you. Three a week at most, never twice about the same thing, never about locks, alarms or where anybody is. |

### Notifications

| Option | Label | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `findings_notify_service` | Send new findings to | string | *(empty)* | A notify service, such as `notify.mobile_app_your_phone`. Empty means no phone messages. Needs you, Repairs and the events work either way, and safety alarms go to Home Assistant's notifications. [Notifications →](/brain/notifications/) |
| `findings_notify_min_severity` | Notify from severity | `info` \| `warning` \| `serious` \| `critical` | `critical` | Only cards at or above this are pushed. `critical` keeps your phone for a leak, a freeze, a hub that stopped answering. `serious` also pushes a dying battery once. |
| `notify_quiet_start` | Quiet hours start (hour, 0-23) | string | `22` | From this hour only urgent messages ring your phone. The rest are held and arrive as one message when the quiet ends. Leave both empty, or set them the same, to notify at any hour. |
| `notify_quiet_end` | Quiet hours end (hour, 0-23) | string | `7` | When held messages are delivered, in your home's timezone. Anything fixed or dismissed overnight is dropped. |
| `morning_brief` | Send a morning brief | bool | `false` | One short message a day at the hour your home starts moving, only when there is something to say. Each one sent costs a Claude run. |
| `morning_brief_hour` | Morning brief fallback hour (0-23) | string | `7` | Used until brAIn has measured your own hour (about two weeks), or if your days are too irregular to have one. |
| `weekly_report` | Send a weekly report | bool | `false` | One message a week: what the house used, what was found and answered, what brAIn learned, and the one thing worth doing. A week with nothing in it sends nothing. |
| `weekly_report_day` | Weekly report day | `monday` … `sunday` | `sunday` | Which day it goes out. A report that missed its hour still goes out later the same day. |

### House checks and policy

| Option | Label | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `checks_interval_hours` | House checks every (hours) | 0–168 | `6` | How often the [house checks](/brain/checks/) run. They read Home Assistant and the Supervisor directly and never call Claude. `0` turns the schedule off; `brain check` still runs them by hand. |
| `self_healing` | Fix three things overnight | bool | `false` | Once a night, inside quiet hours, up to three repairs: start an add-on set to run at boot that is stopped, ping a dead Z-Wave node, reload an integration that failed to set up. Nothing else, and never a protected entity. [Self-healing →](/brain/self-healing/) |
| `protected_entities` | Protected entities | list | `[]` | Entities brAIn may never act on, from any face. One entity id per line (`lock.front_door`) or a whole domain (`alarm_control_panel.*`). They can still be looked at. [Protected entities →](/brain/safety/#protected-entities) |

### Insight cards

| Option | Label | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `auto_refresh_hours` | Refresh insights every | 0–168 | `24` | How often scheduled cards regenerate. `0` leaves you to regenerate by hand. |
| `history_days` | History to analyse | 1–30 | `7` | Days of history handed to a card run. More gives better trends and uses more per run. |
| `history_keep_runs` | Keep past versions | 0–200 | `40` | Previous versions kept per card. |
| `history_keep_days` | Discard versions after | 0–365 | `30` | How long past versions are kept. |
| `model` | Claude model | string | *(empty)* | A model id, such as `claude-sonnet-5`, to run **every** job. Empty lets brAIn choose per job. [Which model does which job](#which-model-does-which-job) |
| `generation_timeout_minutes` | Insight timeout | 2–30 | `8` | How long one card run may take before it is abandoned. |

### ESPHome

| Option | Label | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `esphome_dashboard_url` | ESPHome dashboard address | string | *(empty)* | Only when your ESPHome dashboard is not the ESPHome add-on (which brAIn finds by itself), e.g. `http://esphome.local:6052`. Editing device files never needs it; validating, compiling, installing and logs do. |
| `esphome_ha_token` | Home Assistant token for ESPHome | password | *(empty)* | A long-lived token from a Home Assistant administrator, needed to build and install through the ESPHome add-on on a current Home Assistant. Stored like every option, so it is in your backups. |

### Music Assistant

| Option | Label | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `music_assistant_url` | Music Assistant address | string | *(empty)* | Only for a Music Assistant server Home Assistant is not connected to. Empty uses the server Home Assistant uses, with its sign-in. |
| `music_assistant_token` | Music Assistant admin token | password | *(empty)* | Optional. With an admin's long-lived token brAIn can also manage providers and server settings. It is in backups, so use one you can revoke. |

### Undo and access

| Option | Label | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `edit_journal_days` | Keep undo history for | 0–365 | `14` | How long to keep the snapshots taken before Claude edits a file, so `brain undo` can put them back. `0` disables snapshots. |
| `access_share` | Access /share | bool | `true` | Read and write Home Assistant's share folder. |
| `access_media` | Access /media | bool | `true` | Read and write your media folder. |
| `access_backup` | Read backups | bool | `true` | Read (never write) the backup folder. |
| `access_addon_configs` | Access other add-on configs | bool | `true` | Read and edit other add-ons' configuration folders. A wide door. |
| `access_addons` | Access local add-ons | bool | `true` | Read and edit add-ons you are developing locally. |
| `additional_directories` | Extra folders | list | `[]` | Extra paths to mount, one per line. |
| `persistent_apk_packages` | Alpine packages to keep | list | `[]` | Alpine packages reinstalled on every start. |
| `persistent_pip_packages` | Python packages to keep | list | `[]` | Python packages reinstalled on every start. |
| `log_level` | Log level | `trace` \| `debug` \| `info` \| `notice` \| `warning` \| `error` \| `fatal` | `info` | How much brAIn writes to the add-on log. `debug` also turns the terminal's own websocket logging on. |

The add-on's **Network** settings hold one optional port, **7681**: the classic terminal's direct address, unpublished by default and password-protected either way. [Ports →](#ports)

## Recommended presets

### Quiet — terminal only

```yaml
enable_terminal: true
enable_insights: false
enable_assist_integration: false
enable_automation_integration: false
```

### Everything on

```yaml
findings_notify_service: notify.mobile_app_your_phone
morning_brief: true
weekly_report: true
protected_entities:
  - lock.front_door
  - alarm_control_panel.*
```

Then switch on what you want in ⚙ › Features.

## The panel

brAIn has one sidebar entry.

| Tab | Section | What it is | |
|-----|------|-----------|---|
| **Morph UI** | Home | The Morph dashboard, while it is on in ⚙ › Features | [Morph](/brain/morph/) |
| **Insights** | **Cards** | Your insight cards, the deep review and suggested cards | [Insights](/brain/insights/) |
| | **Needs you** | Every decision waiting on you, and To Do | [Needs you](/brain/needs-you/) |
| | **History** | What you answered: Snoozed, Ignored, Done, Set aside by brAIn | [Needs you](/brain/needs-you/#history) |
| **Ask** | Chat / Classic | Claude Code as a chat or a true terminal | [Ask](/brain/terminal/) |
| **Memory** | **Knowledge** | Every fact brAIn holds, the memory document, and a Teach box | [Memory](/brain/memory/) |
| | **Timeline** | What the house is doing now, and what caused each change | [Timeline](/brain/activity/) |
| | **House book** | How this house works, chapter by chapter | [Upkeep](/brain/upkeep/#the-house-book) |

The number on Insights is how many cards are waiting on you. Old links to the Findings, To-do, Proposals, Upkeep or Ideas panes open Insights. An old link to History opens Insights → History.

### ⚙ Settings

| Section | What's in it |
| --- | --- |
| **Features** | The [four switches](/brain/features/). |
| **Dashboard** | The Morph dashboard's own settings, history and code changes (while it is on). |
| **Account** | Signed in or not, **Recheck**, **Sign in again**, **Sign out**, and sharing the login with the other BRUH apps. |
| **Model & usage** | The model and how hard brAIn thinks, this session's and week's usage, your plan, **Automatic insights** and the share of each 5-hour session they may use, and how insight cards get their data and refresh. |
| **Permissions** | *Ask first*, *Act* or *No limits*; **Talk it through in chat**; house rules; which face Ask opens in and how many conversations keep a live process. |
| **Notifications** | What deserves a notification, in your words, and **Say urgent problems aloud**. |
| **Cameras & calendars** | Which cameras brAIn may look through on its own, and which calendars it may read. |
| **Personality** | The name, spoken voice and personality, and the assistant's own sections. [Learning →](/brain/learning/#shaping-who-it-is) |
| **Instructions** | What brAIn tells Claude, and your own additions. |
| **Diagnostics** | **Run all tests**, what is wrong right now, how right each kind of report has been, the measurements, the overnight check, who can reach the house, and **Report a problem**. [Deep Check & Rehearsal →](/brain/doctor/) |
| **Developer** | **Rehearse the house checks**, **Keep copies of card runs** ([capture](/brain/corpus/#capture)), and the [development loop](/brain/development-loop/)'s repository, token, streams and limits. |
| **Guide** | The full documentation, searchable and offline. |
| **Minecraft** | The companion's settings, shown only with BRUH Minecraft installed. |

![⚙ → Model & usage: "brAIn is working normally.", this session's and this week's usage bars, the Claude subscription picker, the model choice (CLI default, Opus, Sonnet, Haiku), how hard brAIn thinks (Light, Normal, Generous), the Automatic insights switch with its share of each 5-hour session, and the insight card settings](./images/settings-usage.webp)

### Panel settings

Stored by the panel, not the Configuration tab. They take effect without a restart.

| Setting | Values | Default | What it does |
|---------|--------|---------|--------------|
| `auto_enabled` | on / off | on | **Automatic insights**: the master pause for all scheduled work. Pressing something always runs. |
| `plan` | `pro`, `max5`, `max20` | `pro` | Your Claude plan, used only to estimate a session window when there is no real figure to read. |
| `budget_percent` | 5–100, or no limit | 25 | How much of each 5-hour session scheduled work may spend. |
| `thinking` | `light`, `normal`, `generous` | `normal` | Steps every job's model tier down where a wrong answer is cheap, or up where reasoning counts. |
| `dangerously_skip_permissions` / `yolo_mode` | on / off | off | The *Act* and *No limits* levels in ⚙ → Permissions. |
| `talk_first` | on / off | off | Send what would become a draft to the chat instead. |
| `terminal_ui` | `chat`, `classic` | | Which face Ask opens in. |
| `chat_model` | a model id, or unset | unset | The chat's own model, picked from the chat. Unset follows `model`. |
| `chat_max_sessions` | 1–32, or no limit | no limit | How many conversations keep a live Claude Code process. With no limit, the quietest idle one is put to sleep when memory runs short; a message wakes it. |
| `gather_mode` | `search`, `snapshot` | `search` | How a card gets its data: a map plus read-only tools, or the whole house up front. |
| `refresh_mode` | `changed`, `always`, `never` | `changed` | When a scheduled card re-runs: only when what it reads has changed, on the timer alone, or never on a schedule. |
| `capture` | on / off | off | Record what the analyst was sent and answered, for the [corpus](/brain/corpus/). |

### Token budget

The usage pill in the top bar shows two windows: the 5-hour **session** and the **week**. Press it for the reset times and what the budget gates.

- Only the session is budgeted against. Scheduled work pauses at the budget; anything you press still runs.
- The figures are your real Anthropic account usage, so brAIn backs off when you use Claude elsewhere.
- They need the subscription sign-in. With an API key the session is an estimate and the week is not shown.

### Which model does which job

brAIn plans every Claude run by job, not by one global model.

| Tier | Jobs |
|---|---|
| **Haiku** | The first look at every signal, scene naming, playbook text, the memory consolidator, the morning brief, the action gate's question, a follow-up look at a fix, compiling a house rule |
| **Sonnet** | Insight cards, fix plans, the weekly report, study, rules from a sentence, curiosity, onboarding |
| **Opus** | Applying a fix, turning a sentence into an automation, the weekly report's one thing |
| **The top tier** | The **deep review** you press for on Insights, never from a timer |

The **thinking** dial shifts the tiers. A model typed into the `model` option overrides every job, except that a top-tier model on a job nobody pressed for runs on its planned model instead.

## Voice assistant (Assist)

Select **brAIn** as a conversation agent in **Settings → Voice Assistants**. Guide: [Voice Assistant](/brain/voice/).

| Per agent | Details |
| --- | --- |
| **Reach** | *Voice assistant* (default), *Whole house* or *Full admin*. A *Voice assistant* agent may use only an entity's own services on entities you expose, so it cannot restart Home Assistant or create a login however a sentence is misheard. |
| **Blocked services** | New agents start with the administration services ticked: restarts, host shutdown, `update.install`, `recorder.purge`, `shell_command.*`, `backup.create` and the `brain.*` registry tools. |
| **Model** | New agents default to Claude Haiku. `Default` inherits the terminal's model. |
| **Name and personality** | Set per agent. |
| **Conversation memory** | `brain.clear_conversation` resets it. Omit `conversation_id` to reset all. |

## Insight jobs

Scheduled reports rendered to sensors. Create one from **Settings → Devices & Services → brAIn → Add Service → Insight job**. Templates, scheduling and dashboard recipes: [Automations & Insight Jobs](/brain/automations/#insight-jobs).

| Where | What |
| --- | --- |
| `sensor.<job>_insight` attributes | `preview` (first lines), `markdown` (full report), `card_yaml` (ready-to-paste card) |
| *Run now* button, one per job | Runs that job now |
| `brain_insight_complete` event | Fires after every run with `name`, `entity_id`, `success`, `preview` |

## HA services

brAIn registers eleven services of its own, plus `brain.minecraft_job` (used by BRUH Minecraft's companion) and the **91 [Power Tools](/brain/power-tools/)** admin services.

| Service | What it does | Fields | Admin only |
| --- | --- | --- | --- |
| `brain.send_prompt` | Send a prompt and wait for the response | `prompt`, `model` (`default`, `sonnet`, `opus`, `haiku`), `timeout` (10–600 s, default 120) | No |
| `brain.run_task` | Run a task in the background, with an optional notification | `prompt`, `model`, `notify`, `notify_entity`, `timeout` (default 300), `tools` (`full` default, `house`, `read_only`, `minecraft`) | For `tools` wider than `read_only` |
| `brain.ask` | Ask a question and get the answer as response data | `question`, `schema`, `tools` (`read_only` default, `house`, `full`, `minecraft`), `timeout` | For `tools` wider than `read_only` |
| `brain.run_insight` | Run one insight job now, or all | `name` (omit for all) | No |
| `brain.intent` | Say one thing to happen next time. Returns at once; a card lands on Needs you | `sentence` | Yes |
| `brain.study` | Study the home. Returns at once; results arrive in memory | `topic` (omit for whatever has gone stalest; built in: `naming`, `presence`, `energy`, `climate`, `devices`, `automations`, `lighting`) | Yes |
| `brain.add_memory` | Teach it a durable fact | `fact`, `confidence` (`high`, `medium`, `low`), `source` (default `service`) | Yes |
| `brain.answer_question` | Answer one of brAIn's open questions, the same as Yes or No on Needs you | `question` or `ts`, `answer` (must start with yes or no), `source` | Yes |
| `brain.add_todo` | Put something on To Do | `text` | No |
| `brain.check` | Run the house checks now. Returns at once | none | No |
| `brain.clear_conversation` | Reset conversation memory | `conversation_id` (omit for all) | No |

`tools` sets what a task may touch: `read_only` is Home Assistant's read-only tools, `house` adds every Home Assistant tool including control, `full` adds the shell, file edits and the web. `minecraft` is for requests typed in BRUH Minecraft's chat and never reaches a house service.

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
  notify_entity: notify.mobile_app_phone   # omit for a persistent notification
  model: haiku        # optional per-call override
  timeout: 300
  tools: read_only    # full (default) | house | read_only

# Run one or all insight jobs now
action: brain.run_insight
data:
  name: "Daily Briefing"   # omit to run all

# Do one thing next time. Returns immediately; the card lands on Needs you.
action: brain.intent
data:
  sentence: "Turn the porch light off when the guests leave"

# Study the home. Returns immediately; results arrive in memory.
action: brain.study
data:
  topic: "energy"          # omit to study whatever has gone stalest

# Teach it something durable
action: brain.add_memory
data:
  fact: "The garage fridge is meant to run 24/7"
  confidence: high         # high | medium | low
  source: "spouse"         # optional; default "service"

# Answer one of brAIn's open questions
action: brain.answer_question
data:
  question: "Is the garage fridge meant to run 24/7?"   # or ts: <id from the Questions waiting sensor>
  answer: "Yes, it holds the overflow from the kitchen."  # must start with yes or no

# Ask a question and get the answer as DATA an automation can branch on
action: brain.ask
data:
  question: "Which rooms are below 18 °C right now?"
  schema:                    # optional: the shape the answer must fit
    type: object
    properties:
      rooms: { type: array, items: { type: string } }
    required: [rooms]
  tools: read_only           # read_only (default) | house | full
response_variable: cold      # cold.data.rooms is a list

# Put something on To Do (the same list as todo.brain_system_to_do)
action: brain.add_todo
data:
  text: "Replace the hallway smoke alarm battery"

# Run the house checks now
# (also the "Run house checks" button on the brAIn System device)
action: brain.check

# Reset conversation memory
action: brain.clear_conversation
# data: { conversation_id: "..." }   # omit to clear all
```

Notes on behaviour:

- **`brain.ask`** returns `response` (text) and, when you pass a `schema`, `data`: the object Claude produced, validated against the schema first.
- **A failed task raises an error** naming the reason (an expired sign-in, a timeout). Your automation never receives an apology as if it were the answer.
- **Admin-only services** are the ones whose output every later run reads, or that can act. `brain.send_prompt` is open because it is the voice level Assist already gives any user.
- **`brain.answer_question`**: a yes files the question as something brAIn knows. A no closes it, and anything after the no is kept as a correction. An answer that does not start with yes or no is refused. Open questions and their ids are on the **Questions waiting** sensor.
- **`brain.intent`** returns a card on Needs you: a one-off, or a standing rule simulated against your history, including when brAIn will not arm it. Nothing is written until you accept. See [Rules & one-offs](/brain/intents/).
- **`brain.add_memory`** refuses the sources `correction`, `confirmed` and `person`, which are kept for the homeowner's own answers.
- **`brain.check`**: two calls a few seconds apart are one pass.

The Power Tools include the four that change [what a device shows as](/brain/power-tools/entities/#what-a-device-shows-as): `set_device_class`, `show_switch_as`, `stop_showing_switch_as`, `set_sensor_display`.

## Sensors

| Entity | State | Section |
| --- | --- | --- |
| `sensor.brain_memory_facts_learned` | Count of facts | [Learning](#learning-sensors) |
| `sensor.brain_memory_last_learned` | The most recent fact | [Learning](#learning-sensors) |
| `binary_sensor.brain_memory_questions_waiting` | On while a question waits | [Learning](#learning-sensors) |
| `binary_sensor.brain_needs_you` | On while a decision waits | [Needs you and status](#needs-you-and-status) |
| `sensor.brain_status` | The panel's status word | [Needs you and status](#needs-you-and-status) |
| `sensor.brain_findings_open_findings` | Open findings count | [Findings](#findings-sensor) |
| Session Usage, Weekly Usage, and their Resets At | Account usage | [Usage limits](#usage-limit-sensors) |
| Usage tracker | `ok` or the reason | [Usage tracker](#usage-tracker-diagnostic-sensor) |
| `sensor.brain_system_health` | `ok`, `degraded`, `failed` | [Health](#health-sensors) |
| `binary_sensor.brain_system_assist_healthy` | Voice pool health | [Health](#health-sensors) |
| `sensor.brain_house` | What the house is doing | [House](#house-sensor) |
| Buttons, AI Task, BRUH Browser, insight jobs | | [Other entities](#buttons-ai-task-and-other-entities) |
| `todo.brain_system_to_do` | To Do | [To-do list](#to-do-list) |

### Learning sensors

| Entity | Reports |
|--------|---------|
| `sensor.brain_memory_facts_learned` | How many things brAIn knows |
| `sensor.brain_memory_last_learned` | The most recent fact, with the text as an attribute |
| `binary_sensor.brain_memory_questions_waiting` | **Questions waiting**: on when brAIn has a yes/no question for you, with the questions and their ids as attributes. An install that had the older *Waiting on you* sensor keeps its entity id. |

A `brain_learned` logbook event fires for every new fact. See [Events](#events).

### Needs you and status

| Entity | What it is |
|--------|-----------|
| `binary_sensor.brain_needs_you` | On while anything waits for a decision. The same number as the badge on Insights. |
| `sensor.brain_status` | The panel's status line: `watching`, `paused` (with when it is back), `needs_restart`, `signed_out` or `degraded`, with the sentence as an attribute. |

### Findings sensor

`sensor.brain_findings_open_findings` exists so automations and dashboards can use the findings count.

| | |
| --- | --- |
| **State** | The open count |
| **Attributes** | The severity split (`critical`, `serious`, `warning`, `info`), the finding texts (first 20), and `newest` |
| **Unavailable** | Until the add-on has written its first mirror to `/config/.brain/findings_state.json`. That tells a fresh install apart from a clean house. |

### Usage-limit sensors

Your real Anthropic account usage, the same numbers as **claude.ai → Settings → Usage**. A tracker asks Anthropic's usage endpoint shortly after each Claude run finishes and otherwise every 30 minutes. The sensors read the tracker's file every 30 seconds.

| Sensor | Tracks | Key attributes |
|--------|--------|----------------|
| Session Usage | Percent of the current 5-hour session window used | `resets_at`, `data_source`, `last_updated` |
| Session Usage Resets At | When the 5-hour window resets | `utilization` |
| Weekly Usage | Percent of the rolling 7-day window used | `resets_at`, `data_source`, `last_updated` |
| Weekly Usage Resets At | When the 7-day window resets | `utilization` |

:::caution
These need an **OAuth / subscription login**, not an `ANTHROPIC_API_KEY`. With an API key, or before you sign in, they stay **unavailable**.

They also go unavailable during a run of 429s from the usage endpoint. The tracker backs off for 1, then 2, then 4 hours, and a reading older than two hours is not shown. The reason is on the **Usage tracker** sensor below, and `brain doctor` reports it too.
:::

### Usage tracker diagnostic sensor

The **Usage tracker** sensor never goes unavailable, so it can explain why the four above are.

| State | Meaning |
| --- | --- |
| `ok` | The figures are current |
| `no_oauth_token` | Not signed in with a subscription |
| `api_key_has_no_usage_limits` | An API key bills per token and has no subscription window. Not a failed sign-in |
| `http_401` | The sign-in was refused |
| `http_429` | The usage endpoint's own rate limit, not your account's usage. The `detail` attribute says so |
| `network_error` | The endpoint could not be reached |
| `stale` | The last reading is too old to trust |
| `not_running` | The tracker is not running |

A failed poll records `last_error` and `next_attempt_at` beside the reading it left showing.

### Health sensors

| Entity | What it is |
| --- | --- |
| `sensor.brain_system_health` (`sensor.brain_usage_limits_health` on an older install) | brAIn's verdict on itself: `ok`, `degraded` or `failed`, with the reason and the switch to look at as attributes. It never goes unavailable; if the add-on has stopped publishing, that is the state. While it is not `ok`, Home Assistant's **Repairs** carries the reason. A credential waiting for its next refresh does not degrade it. |
| `binary_sensor.brain_system_assist_healthy` | Voice-assistant pool health, with worker count, the pre-warmed spare and last-request latency as attributes. |

### House sensor

`sensor.brain_house` is what brAIn thinks the house is doing right now.

| | |
| --- | --- |
| **State** | `home`, `away`, `asleep`, `waking`, `guests`, or `unknown` |
| **Attributes** | `sentence`, `rooms_in_use`, `unusual_together`, `because`, `coming_up`, `published_age_minutes` |
| **Refresh** | Every few minutes. It never goes unavailable: a missing or stale reading is `unknown` with a `reason` attribute. |

It is context for brAIn's own looks. A wrong *away* never makes a leak alarm or a protected device less important.

### Buttons, AI Task and other entities

| Entity | What it is |
|--------|-----------|
| `button.brain_system_run_house_checks` | **Run house checks**, the same as `brain.check` |
| `sensor.bruh_browser_status`, `binary_sensor.bruh_browser_waiting_on_you` | With BRUH Browser installed: the current errand, and whether it is waiting on you |
| *Run now* button, one per insight job | Runs that job now |
| `ai_task.brain_system_ai_task` | brAIn as Home Assistant's **AI Task** entity (Home Assistant 2025.7 and later): `ai_task.generate_data` gets a read-only answer, checked against the structure you asked for |
| `sensor.<job>_insight` | One per insight job. See [Insight jobs](#insight-jobs) |

On Home Assistant versions that support it, other assistants can also ask brAIn what it has measured (what is normal for an entity, what it remembers, what caused a change) through Home Assistant's own LLM API, limited to what you expose to them.

### To-do list

`todo.brain_system_to_do` (`todo.brain_system_brain` on an install that had it before) is **To Do** in Home Assistant's To-do panel and app.

- It holds the cards you added to To Do, and anything added with `brain.add_todo` or typed in the app.
- Ticking one off is **Done**. Deleting one takes it off the list and lets brAIn raise the problem again.
- A card brAIn is still asking about is never on it.

Cards waiting on you also appear in Home Assistant's **Repairs**, with the same answers. [Notifications →](/brain/notifications/)

## Events

| Event | Fires | Payload |
|-------|-------|---------|
| `brain_finding` | Once per **newly filed** finding, never for a re-report | `finding`, `severity`, `entity_id`, `fixable`, `source`, `ts` |
| `brain_learned` | Once per fact filed into memory, and once per forget | `fact`, `source` |
| `brain_insight_complete` | After every insight-job run | `name`, `entity_id`, `success`, `preview` |
| `brain_case` | A finding opens on Needs you | `case_id`, `kind`, `claim`, `severity`, `status`, `entity_id`, `fixable`, `source` |
| `brain_case_ended` | That finding leaves the list, whichever ending it got | `case_id`, `kind`, `claim` |
| `brain_change` | brAIn changed something in the house (a fix landed) | `case_id`, `claim`, `entity_id` |
| `brain_task_complete` | A `brain.run_task` or `brain.ask` task finished | `task_id`, `status` (`completed` or `failed`), `error` on a failure |

- `brain_finding` still fires beside `brain_case`, so automations written against it keep working. Trigger on it for anything beyond the built-in push that `findings_notify_service` gives you.
- Snooze is not an ending. A snoozed case fires no `brain_case_ended` and comes back without a new `brain_case`.
- `brain_finding` and `brain_learned` also carry `name` and `message` fields phrased as sentences, so they read properly in the logbook.

## MCP server tools

The built-in MCP server gives Claude **120 tools** against your live install. The tool-by-tool tables, with who may use each, are on [MCP Tools](/brain/mcp/). `brain doctor` verifies them on your system.

| Group | Examples |
| --- | --- |
| Read your home | `get_entity_state`, `get_registry`, `get_history`, `get_camera_snapshot` |
| Automations and scripts | `get_automation_trace`, `get_automation_config`, `search_related` |
| Measurements | `what_is_normal`, `room_physics`, `habits`, `simulate_automation` |
| Act on the house | `call_service` (with `return_response` for [Power Tools](/brain/power-tools/)), `control_light`, `timed_action` |
| What a device shows as | `set_device_class`, `show_switch_as` |
| Other BRUH apps | `print_label`, `bright_show`, `bambu_print`, `garden_status` ([brAIn and the BRUH apps](/brain/apps/)) |
| ESPHome and Music Assistant | `esphome_install`, `music_assistant_play` |

## CLI

Two commands in the terminal. Full tables, flags and examples: [The CLI](/brain/cli/).

| `brain` | What it does |
| --- | --- |
| `memory` | `add`, `list`, `edit`, `forget`, `inbox`, `consolidate`, `hypotheses` (`guesses`), `confirm`, `reject`, `log`, `history`, `undo`, `clear`, `export`, `import` |
| `findings` | `list`, `fix`, `apply`, `cancel`, `undo`, `done`, `wrong`, `ack`, `snooze` |
| `learn [topic]` | Run a study session |
| `ask "<question>"` | One question, answered as text |
| `undo [n]` | List and revert Claude's file edits. `--all-today` |
| `own [-r] <path…>` | Make a file writable by Claude again |
| `check` | Run the house checks now. `list`, `--json` |
| `why [ask]` | What brAIn is curious about |
| `weekly [send]` | The week's report |
| `doctor` | Free diagnostic. `--json`, `--deep`, `--rehearse [--yes]`, `--sweep` |
| `eval` | `outcomes [--nightly]`, `first_look [--days --max-tokens --max-batches]` |
| `report [--no-names]` | One redacted file for a bug report |
| `devloop` | `status`, `run [stream]`, `look "<what to fix>"` |
| `tune "<asked>" "<answered>"` | Record how the assistant should be |
| `login [--status\|--share]` | Sign in to Claude; share the login |
| `help` | The full list |

| `ha` | What it does |
| --- | --- |
| `log` | `core`, `supervisor`, `host`, `addon <name>`, `errors`, `all`; `-f`, `-n N` |
| `reload <target>` | `automations`, `scripts`, `scenes`, `groups`, the helper domains, `core`, `all`, `check` |
| `check [path]` | Validate YAML. `--ha`, `--all`. Alias `yaml` |
| `context` | Regenerate `/config/CLAUDE.md` |
| `entity` | `get`, `set`, `list`, `search` |
| `service` | `call <domain>.<service> [--data] [--response]`, `list [domain]` |
| `addon` | `list`, `info`, `restart`, `stop`, `start`, `logs`, `options` |
| `notify "msg"` | `--title`, `--target` |
| `share` | `push`, `pull`, `ls` |
| `login [--status]` | Same as `brain login` |
| `help` | The full list |

Also on `PATH`: `persist-install apk|pip <pkgs>`, with `list` and `remove`.

`brain doctor` is free and never calls Claude. `--deep` (about five Claude turns) and `--rehearse` (one analyst run) never run on a timer. Both are also in the panel: **Run all tests** in ⚙ → Diagnostics and **Rehearse the house checks** in ⚙ → Developer. [Deep Check & Rehearsal](/brain/doctor/)

## Undo

brAIn does not back up your configuration. Home Assistant's own backups do that. brAIn keeps an **edit journal**: before a file under `/config` is written, its previous contents are snapshotted to `/data/.brain/edits/`.

```bash
brain undo                # list recent edits, newest first
brain undo 3              # revert edit #3
brain undo --all-today    # revert everything Claude changed today
```

| | |
| --- | --- |
| **Kept for** | `edit_journal_days` (default 14), and capped by total size |
| **Never snapshotted** | `secrets.yaml` |
| **A fix from [Needs you](/brain/needs-you/#plan-apply-and-undo)** | Has its own **Undo** on the card, which puts back the files it edited and lists the service calls it made. **Restore** puts those devices back. |
| **An old `/config/.git`** | Left alone. brAIn never writes to it; delete it yourself if you do not want it. |

What is and is not covered: [The CLI → Undo](/brain/cli/#undo).

## File ownership

Home Assistant saves `automations.yaml`, `scripts.yaml` and `scenes.yaml` as root, which can leave them read-only for Claude. brAIn hands them back by itself:

- at startup;
- before Claude edits a file it cannot write, or runs a command that names one;
- about once a minute for the files the editors rewrite.

This covers `/config`, `/addon_configs`, `/share`, `/media` and `/addons` while each is mounted. Claude is told never to ask you for `sudo` or `chown`.

`brain own <path…>` (or `brain own -r <folder…>`) does the same on demand. It never touches `.storage`, `.cloud`, brAIn's credentials, `secrets.yaml` or the recorder database. [The CLI → brain own](/brain/cli/#files-claude-cannot-write-brain-own)

## Transport & health

**Voice transport.** In fast mode the worker pool serves an internal HTTP API on **port 8098**, token-authenticated through the shared `/config` volume. The integration prefers it: there is no file polling, and replies stream so speech starts at the first sentence. If the API is unreachable, both sides fall back to the file protocol. The integration reads the port from the endpoint file the pool publishes.

![File-based IPC fallback flow](./images/ipc-flow.svg)

**`/api/health`** is the endpoint the Supervisor watchdog polls. It also reports which background daemons are running (worker pool, listeners, usage tracker, memory consolidator, study watcher, ttyd) and when the last consolidation pass landed. That part is informational only: one dead daemon never fails liveness, so the watchdog cannot restart-loop the add-on over it. `brain doctor` reads it and compares it with its own view.

### Diagnostics endpoints

All on the ingress panel (8099), reachable from the terminal over loopback.

| Route | What it does |
|-------|--------------|
| `GET /api/diagnostics` | The whole bundle: versions, options, the run journal's last day, store counts, the health verdict, which checks could not run and why, the last deep check and rehearsal, the shadow-mode lines, and the capture counts. No prompts, no replies, no entity states. Same payload as `/config/.brain/diagnostics.json` and Home Assistant's **Download diagnostics** button |
| `POST /api/doctor/deep` | Start a deep check. A second caller gets the run that is already going |
| `GET /api/doctor/deep` | The stages as they land, and the last run's verdict |
| `POST /api/doctor/rehearse` | Start a rehearsal. Without `{"consent": true}` it answers `428` with the exact list of what it would create, and writes nothing |
| `GET /api/doctor/rehearse` | The rehearsal's progress and last scores |
| `GET /api/capture` | One row per captured run: when, what, how many findings, how many endings label them |
| `GET /api/capture/{run id}` | One whole capture, exactly as it is on disk |
| `POST /api/capture/{run id}/export` | Copy that capture to `/share/brain/corpus/` |
| `DELETE /api/capture/{run id}` | Remove it |

## Permissions architecture

| Channel | Mechanism | Default access |
|---------|-----------|----------------|
| Interactive terminal and chat | Prompts for anything but reading, plus the action gate (unless *Act* or *No limits* is chosen in ⚙ → Permissions) | Everything; you approve actions |
| Voice / conversation agents | The agent's reach (*Voice assistant*, *Whole house*, *Full admin*) and its Blocked services | *Voice assistant*: exposed entities, their own services, HA tools only |
| Automation tasks | The task's `tools` (`full`, `house`, `read_only`). Wider than `read_only` needs an administrator | `full`: MCP, shell, file edits, web |
| Card rendering (snapshot mode) | `--disallowedTools "*"` | **No tools at all**. It renders what it was handed |
| The analyst: insight runs, study sessions, typed questions | An explicit allow-list **and** an explicit deny-list | **Read-only** HA tools; nothing that can change the house |
| **Plan and Apply** | A read-only plan first. **Apply** carries out exactly those steps, most of them by the panel itself, and any Claude run is held to the approved change. Never on a schedule | Only what you approved |

The last three are the panel's own Claude paths, and only Plan and Apply can change the house.

- **The analyst has two lists** because `--allowedTools` only governs what runs without a prompt. A headless run cannot be prompted, so an unlisted tool would fail instead of being forbidden. Every MCP tool is in exactly one list.
- **Background channels never use `--dangerously-skip-permissions`.** Their pre-approvals live in a separate headless settings file.
- **`/config/.claude/settings.local.json`**, which the terminal and the chat read, pre-approves only reading Home Assistant.
- **The action gate** stands in front of every acting call in the chat and the terminal. It decides from your own words, never from text brAIn read. Your `protected_entities` and house rules apply beneath it.
- **Everything runs as a non-root user** (UID 1000), limited to `/config`, `/data` and the enabled access options.

The homeowner's view: [Permissions & Safety](/brain/safety/). The order of checks: [What every action passes](/brain/how-brain-controls-ha/#what-every-action-passes).

## Ports

| Port | What | Needed? |
|------|------|---------|
| 8099 | The ingress panel. Also reverse-proxies `/terminal/`. | Internal; ingress handles it. |
| 7681 | ttyd, direct access to the terminal. | **Unpublished by default.** Assign a port in the add-on's **Network** panel to reach it from your LAN (for a kiosk or a bookmarked full-screen terminal). |
| 8098 | The assist worker pool's internal API. | Internal only. |
| 8096 | The Morph dashboard's service health check, on loopback only. | Internal only; never published. |

A published terminal port answers the LAN with no Home Assistant login in front of it, the exposure described in [GHSA-gh5m-4m97-c95h](https://github.com/home-assistant/core/security/advisories/GHSA-gh5m-4m97-c95h). That is why 7681 ships off.

ttyd always requires HTTP Basic auth, published or not: user `brain`, with a password generated into `/data/terminal-credential` and printed in the add-on log. The panel presents it on every proxied request, so you never see a prompt through ingress.

## Where data lives

| Path | Contents |
|------|----------|
| `/config/CLAUDE.md` | Auto-generated install context |
| `/config/.brain/memory/memory.md` | **The memory document**: plain markdown, yours to edit |
| `/config/.brain/memory/voice.md` | The summary of at most 2 KB used in voice prompts (derived) |
| `/config/.brain/memory/inbox/` | Candidate facts awaiting consolidation |
| `/config/.brain/` | IPC bridge: request/response queues, sessions, logs |
| `/config/.brain/usage_limits.json` | Cached account usage for the sensors |
| `/config/.brain/situation.json` | What the house is doing now; what `sensor.brain_house` reads |
| `/config/.brain/findings_state.json` | The findings mirror, republished on every change; what the sensor, event and push read (`/data` is invisible to Home Assistant) |
| `/config/.brain/diagnostics.json` | The diagnostics payload mirror |
| `/config/.brain/logs/{assist,automation}-YYYYMMDD.log` | Per-request debug logs |
| `/config/.brain/ui/house.css`, `house.js` | Optional changes to brAIn's own page, written by brAIn when you ask |
| `/config/.brain/features.json` | The four Feature switches, as published |
| `/config/custom_components/brain/` | The HA integration |
| `/config/morph/` | The Morph dashboard, a git repository: its file, card types, dashboards brAIn may change, and `LEARNED.md` |
| `/config/www/brain/` | Insight HTML for [dashboard cards](#dashboard-cards) |
| `/data/findings.json` | The findings work list itself (the mirror above is derived from it, never read back) |
| `/data/chat/` | The chat tab's scrollback, one capped file per conversation. Claude Code owns the real conversation, so losing it never costs context |
| `/data/chat-trash/` | Deleted chat conversations, where the toast's Undo restores from (time-limited and capped) |
| `/data/capture/` | Captured analyst runs, when `capture` is on: redacted as written, the newest 50, excluded from backups |
| `/data/terminal-credential` | ttyd's generated Basic-auth password |
| `/data/run-sources.jsonl` | Which face (voice, consolidator, study, chat…) started each conversation; keeps machine runs out of your Chats list |
| `/data/.brain/edits/` | The edit journal `brain undo` restores from |
| `/data/` (add-on volume) | OAuth credentials, persistent packages |
| `/share/brain/corpus/` | Where **Export** copies one capture. The only route out of the add-on |
| `/share/brain/reports/` | The redacted file `brain report` writes, and the problem files listed in ⚙ → Diagnostics → **Report a problem** |

## Dashboard cards

Put any insight on a dashboard from **Share** under its **⋯**: pick the dashboard and view, and brAIn adds the card. For a dashboard kept in YAML, the same dialog gives you the YAML to paste:

```yaml
type: iframe
url: /local/brain/energy-<your-card-token>.card.html   # or .html for just the chart
aspect_ratio: 110%
```

| | |
| --- | --- |
| **Where the files are** | Mirrored into `/config/www/brain/`, which Home Assistant serves at `/local/…`. Same origin as every dashboard, so cards work on HTTP, HTTPS and Nabu Casa with no port mapping. |
| **Two files per card** | `…card.html` is the whole card (heading, answer, numbers and chart, with the chart in a sandboxed frame). `….html` is the chart alone, which dashboard cards made before 2.8 point at. |
| **Freshness** | The card shows the latest run and reloads every 15 minutes. |
| **The token** | A per-install random secret in the file name. The mirror holds only insight HTML: no API, no credentials, no controls. Anyone with the exact URL can view that insight, so treat the token like a dashboard-level secret. |

## Privacy & security

- **What leaves your machine.** Home data is sent to Anthropic's API only when you ask for something or a run you scheduled fires.
- **Location.** Person GPS coordinates are never included in snapshots, only zone/state and areas.
- **Visualizations** render in sandboxed iframes (`sandbox="allow-scripts"`). They cannot touch your HA session, cookies or the panel.
- **Access.** The panel is reachable only through HA Ingress (admin users). The terminal port ships [unpublished and password-protected](#ports).
- **AppArmor.** A profile confines the container by denying the host-escape set: no mounting, no kernel modules, no raw sockets, no kernel tunables, no Docker socket, no ptracing out of the profile. brAIn rates **6/6** on the add-on store's security scale.
- **Backups.** `backup_exclude` keeps the OAuth credential, the terminal password, the chat scrollback, captures and the notification delivery ledger out of Home Assistant backups. Restoring a backup costs you one sign-in.
- **Secrets.** `secrets.yaml` is never snapshotted into the edit journal, and credentials are never read, written or included in any snapshot.

## Mobile

The panel is built for a phone:

- Every tab and button is at least 44px.
- No width collapses the tabs into bare icons.
- No text control is under 16px, so iOS Safari does not zoom in on focus.
- The **Ask** tab folds the top bar away while the software keyboard is up. **⤢** folds it away for good and brings it back.

In Ask's **Classic** face, a toolbar sits above the keyboard:

| Feature | Details |
| --- | --- |
| **21 keys** | `ESC`, `▾ Kbd`, `Tab`, `⇧Tab`, the four arrows, `PgUp`, `PgDn`, `^C`, `^D`, `^L`, `^U`, `/`, `@`, `#`, `!`, `\|`, `Paste`, `×`. No sticky modifiers. |
| **Swipe to scroll** | One-finger up/down (or the wheel on desktop) becomes PgUp/PgDn, so long-press text selection still works. |
| **Copying** | Works on iOS, including copying an OAuth URL out of the terminal. |
| **Add to Home Screen** | A full-screen launcher without Safari chrome. |
| **Voice dictation** | Turn off iOS **Voice Control** (Settings → Accessibility) to avoid double submission. |
| **Turn it off** | `enable_mobile_ui: false` |

## When to restart Home Assistant

| Scenario | Restart? |
|----------|----------|
| First install | **Yes**. Home Assistant must load the new custom component |
| Add-on version upgrade | **Yes**. Updated Python files need reloading (a notification and a repair appear) |
| Add-on restart, same version | No |
| Config option changes | No. They are read when the add-on starts |

:::tip[Update not showing up?]
The Supervisor re-pulls add-on repositories only periodically. To pick up a release now: **Add-on Store → ⋮ → Check for updates**.
:::

## Troubleshooting

Start with `brain doctor`, or ⚙ → Diagnostics → **Run all tests**.

| Symptom | Fix |
|---------|-----|
| Add-on won't start | Check the **Log** tab. Usually an architecture mismatch: the add-on builds for `amd64` and `aarch64` only. |
| Integration not discovered | Restart Home Assistant after the first add-on start. Add it manually in **Settings → Devices & Services** if needed. |
| Home Assistant needs a restart | `sensor.brain_status` reads `needs_restart` after an add-on update with a newer integration. Restart Home Assistant. |
| The terminal asks for a second login | One credential is shared with the CLI in both directions. If it does not take, `brain doctor`'s auth check names the file it found and the one it expected. |
| It can't see entities | Check `enable_ha_mcp_server: true`, then run `brain doctor`, which reports any tool that errors. |
| Voice can't see or control a device | It isn't exposed to Assist. **Settings → Voice assistants → Expose**, or set that agent's reach to *Whole house* (brAIn → the agent → Configure). |
| Claude says it can't write `automations.yaml` | Run `brain own /config/automations.yaml`. The startup log says how many files changed hands. |
| Voice agent answers wrong room | Run `brain doctor`. The "Assist area map" check confirms the room map is built. |
| A study session produced nothing | It probably hit `study_timeout_minutes`; the log says so. Raise it. |
| Cards look thin | The card found few matching entities. Check areas are assigned and the relevant sensors are enabled. |
| Generation timed out | Raise `generation_timeout_minutes`, or set a faster `model`. |
| Usage sensors *unavailable* | Read the **Usage tracker** sensor's state. `no_oauth_token` means sign in (an API key does not count). `http_429` means the tracker is waiting out the endpoint's rate limit, and `next_attempt_at` says until when. |
| New findings never reach my phone | `findings_notify_service` is unset (the default), or the finding is below `findings_notify_min_severity` (default `critical`; set `serious` to hear about dying batteries too). Needs you, Repairs and the `brain_case` event carry everything regardless. |
| Something else is wrong | ⚙ → Diagnostics → **Run all tests**, then **Report a problem** for one redacted file to share. |
| Anything else | **Settings → Add-ons → brAIn → Log**, with `log_level: debug`. |

### Per-request debug logs

Every Assist and automation request is logged with channel, prompt size, model, the speed path it took (`warm`/`spare`/`cold`/`…+fallback`), duration and a response preview.

```bash
tail -f /config/.brain/logs/assist-$(date +%Y%m%d).log
tail -f /config/.brain/logs/automation-$(date +%Y%m%d).log
```

Set `log_level: debug` before reproducing a bug for the most detail.

## Disclaimer

brAIn is an independent project, not affiliated with, endorsed by, or sponsored by Anthropic. "Claude" and "Claude Code" are trademarks of Anthropic, PBC. The add-on runs the official Claude Code CLI under your own Anthropic account; your use of Claude through it is governed by [Anthropic's terms](https://www.anthropic.com/legal/consumer-terms).
