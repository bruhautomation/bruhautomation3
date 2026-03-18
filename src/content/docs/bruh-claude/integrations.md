---
title: Integrations
description: Connect BRUH Claude to Home Assistant Assist for voice/text control, and trigger AI tasks from automations.
---

BRUH Claude integrates deeply with two Home Assistant systems: the **Assist** conversation pipeline (for voice and text interaction) and the **Automation** engine (for triggering AI tasks on schedules or events).

## Assist — Voice & Text Assistant

When enabled, BRUH Claude registers as a conversation agent that you can select in Home Assistant's Voice Assistants settings. This lets you talk to Claude through any Assist interface — voice satellites, the companion app, dashboard cards, or the built-in text input.

### Setup

1. Ensure `enable_assist_integration` is set to `true` in the add-on configuration
2. Go to **Settings → Voice Assistants**
3. Select **BRUH Claude** as the conversation agent for your preferred assistant

That's it. Claude is now handling Assist conversations.

### How It Works

When you send a message through Assist, here's what happens behind the scenes:

<div style="margin: 2rem 0;">
  <img src="/images/bruh-claude/ipc-flow.svg" alt="File-Based IPC Flow for Assist" style="width: 100%; border-radius: 8px;" />
</div>

1. You speak or type a message to Assist
2. HA Core routes the message to the `bruh_claude` custom integration
3. The integration writes a JSON request file to `/config/.bruh_claude/requests/`
4. The Assist listener (running inside the add-on) detects the new file via `inotifywait`
5. The listener invokes Claude Code with your message, conversation history, and the `--print` flag
6. Claude processes the request (using MCP tools as needed) and the listener writes a response file to `/config/.bruh_claude/responses/`
7. The integration polls for the response file and returns it to HA Core
8. You get Claude's reply through the Assist interface

### Conversation Memory

The integration maintains conversation history per session with a maximum of 20 turns. This means Claude can reference earlier messages in the same conversation:

```
You: Turn on the living room lights
Claude: Done — turned on 3 lights in the living room.

You: Actually, set them to 50%
Claude: I've set all 3 living room lights to 50% brightness.
```

You can clear conversation history programmatically:

```yaml
service: bruh_claude.clear_conversation
data:
  session_id: "my-session"
```

### Max Turns

The `assist_max_turns` config option (default: 5) controls how many agentic loop iterations Claude can perform per request. Each turn is one cycle of Claude thinking, calling a tool, and observing the result.

For simple queries like "what's the temperature?", Claude typically needs 1–2 turns. For complex requests like "check all my automations and tell me which ones are broken," it may need 5–10.

## Automation-Triggered Tasks

The automation integration lets you trigger Claude tasks from any HA automation, script, or service call. Use this for scheduled AI tasks, event-driven analysis, or any workflow where you want Claude to do something without manual interaction.

### Using the Service

The simplest way to trigger a Claude task:

```yaml
service: bruh_claude.run_task
data:
  prompt: "Check my error log and summarize any issues from the last 24 hours"
  notify: true
  timeout: 300
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | *required* | The task for Claude to perform |
| `notify` | boolean | `false` | Send a notification when the task completes |
| `timeout` | integer | `120` | Maximum seconds to wait for completion |

### Example Automations

**Morning Briefing:**

```yaml
automation:
  - alias: "Morning Claude Briefing"
    trigger:
      - platform: time
        at: "07:00:00"
    condition:
      - condition: state
        entity_id: binary_sensor.workday
        state: "on"
    action:
      - service: bruh_claude.run_task
        data:
          prompt: >
            Give me a morning briefing:
            1. Any errors in the HA log from overnight
            2. Which devices are unavailable
            3. Today's weather forecast from my weather entity
            4. Any automations that failed to trigger
          notify: true
```

**Weekly Config Audit:**

```yaml
automation:
  - alias: "Weekly Config Review"
    trigger:
      - platform: time
        at: "09:00:00"
    condition:
      - condition: time
        weekday:
          - sun
    action:
      - service: bruh_claude.run_task
        data:
          prompt: >
            Review my Home Assistant configuration and report:
            1. Automations that haven't triggered in over 30 days
            2. Entities that have been unavailable for more than 24 hours
            3. Any YAML syntax issues in my config files
            4. Suggestions for improving my automations
          notify: true
          timeout: 600
```

**Error Alert Handler:**

```yaml
automation:
  - alias: "Analyze Persistent Errors"
    trigger:
      - platform: persistent_notification
        notification_id: config_entry_error
    action:
      - service: bruh_claude.run_task
        data:
          prompt: >
            A persistent error notification just appeared. Check the error
            log, identify the root cause, and suggest a fix.
```

### Send Prompt Service

For simpler use cases where you just want a response (without task lifecycle management), use `send_prompt`:

```yaml
service: bruh_claude.send_prompt
data:
  prompt: "What entities are currently offline?"
  timeout: 120
```

The difference between `send_prompt` and `run_task`:

| | `send_prompt` | `run_task` |
|---|---|---|
| Returns response directly | Yes | Via notification or task result |
| Notification support | No | Yes |
| Best for | Quick queries in scripts | Long-running background tasks |

### Debugging

Both integration channels write detailed logs that include the full request, Claude's response, timing data, token usage, and any errors:

```bash
# Today's Assist logs
cat /config/.bruh_claude/logs/assist-$(date +%Y%m%d).log

# Today's automation logs
cat /config/.bruh_claude/logs/automation-$(date +%Y%m%d).log

# Follow in real-time
tail -f /config/.bruh_claude/logs/assist-$(date +%Y%m%d).log
```
