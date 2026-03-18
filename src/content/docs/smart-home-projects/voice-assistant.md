---
title: Voice Assistant
description: M5Stack Atom Echo voice assistant with Home Assistant integration
---

M5Stack Atom Echo based voice assistant with native Home Assistant integration, microphone, speaker, and RGB LED status indicator.

## Hardware

**Core Components:**
- **Microcontroller:** M5Stack Atom Echo (ESP32-based, fully integrated)
- **Audio:** Built-in I2S microphone and amplified speaker
- **Status:** Single RGB LED
- **Button:** Capacitive touch for voice trigger and controls

Everything is integrated into one compact 24×24mm cube—no wiring needed.

## ESPHome Configuration

```yaml
substitutions:
  name: "bruh-voice-assistant"
  friendly_name: "BRUH Voice Assistant"

esp32:
  board: m5stack-atom
  framework:
    type: esp-idf

api:
  encryption:
    key: !secret api_key

voice_assistant:
  id: va
  microphone: echo_microphone
  speaker: echo_speaker
  noise_suppression_level: 2
  auto_gain: 31dBFS
  volume_multiplier: 2.0
  on_listening:
    - light.turn_on:
        id: led
        blue: 100%
        red: 0%
        green: 0%
        effect: "Slow Pulse"

i2s_audio:
  - id: i2s_bus
    i2s_lrclk_pin: GPIO33
    i2s_bclk_pin: GPIO19

microphone:
  - platform: i2s_audio
    id: echo_microphone
    i2s_audio_id: i2s_bus
    i2s_din_pin: GPIO23
    adc_type: external
    pdm: true

speaker:
  - platform: i2s_audio
    id: echo_speaker
    i2s_audio_id: i2s_bus
    i2s_dout_pin: GPIO22
    dac_type: external

light:
  - platform: esp32_rmt_led_strip
    id: led
    name: RGB LED
    pin: GPIO27
    chipset: SK6812
    num_leds: 1
    effects:
      - pulse:
          name: "Slow Pulse"
          transition_length: 250ms
          update_interval: 250ms
      - pulse:
          name: "Fast Pulse"
          transition_length: 100ms
          update_interval: 100ms

switch:
  - platform: template
    name: Use wake word
    id: use_wake_word
    optimistic: true
    restore_mode: RESTORE_DEFAULT_ON
    on_turn_on:
      - lambda: id(va).set_use_wake_word(true);
      - voice_assistant.start_continuous
```

## Features

- **Wake word detection:** "Okay Google" or "Alexa" (configurable)
- **Always-listening mode:** toggle between push-to-talk and always-on
- **Noise suppression:** suppresses background noise (level 0-3)
- **Auto gain:** normalizes volume dynamically
- **Status LED:** visual feedback (listening, processing, speaking, error)
- **Home Assistant native:** no cloud dependency
- **Multi-language:** supports dozens of languages

## LED Status

- **Blue slow pulse:** listening for command
- **Blue fast pulse:** processing speech
- **Solid blue:** speaking response
- **Red solid:** error occurred
- **Off:** not active or disabled wake word

## Button Controls

- **Press (250ms):** start or stop voice interaction (if not using wake word)
- **Long press (10s):** factory reset

## Wake Word Setup

The default wake word is "Okay Home" but can be customized in Home Assistant. Requires a local voice assistant add-on or service.

## Tips

- Place the device in a central location for even audio pickup
- The speaker is surprisingly loud—volume multiplier of 2.0 is strong for a small cube
- Noise suppression level 2 balances sensitivity and background noise rejection
- Enable "Use wake word" for always-listening mode (minimal power overhead)

## Integration with Home Assistant

Once connected, the voice assistant:
- Converts speech to text
- Routes to your configured voice assistant (built-in, or via remote service)
- Converts response to speech and plays it back
- Triggers automations and controls devices using your Home Assistant setup

No cloud services required—everything stays local.
