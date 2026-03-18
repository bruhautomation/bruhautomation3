---
title: Nightlight
description: Monochromatic or RGB LED nightlight with PWM dimming and pulse effects
---

Simple LED nightlight with smooth PWM brightness control and customizable pulse effects. Available in monochromatic (white) or full RGB variants.

## Hardware

**Monochromatic Version (shown below):**
- **Microcontroller:** ESP32 (NodeMCU-32S)
- **Output:** Single white LED on GPIO32 via LEDC PWM
- **Frequency:** 1220 Hz for flicker-free dimming

**RGB Version (alternative):**
- Same hardware, but RGB LED with separate R, G, B pins
- Requires three LEDC PWM outputs

## ESPHome Configuration (Monochromatic)

```yaml
substitutions:
  device_name: "BRUH Countertop"
  device_id: "bubba-nightlight"

esp32:
  board: nodemcu-32s

output:
  - platform: ledc
    pin: GPIO32
    id: gpio_32
    frequency: "1220Hz"

light:
  - platform: monochromatic
    output: gpio_32
    restore_mode: restore_default_on
    name: "Nightlight"
    id: nightlight
    default_transition_length: 0.5s
    effects:
      - pulse:
      - pulse:
          name: "Fast Pulse"
          transition_length: 0.5s
          update_interval: 0.5s
      - pulse:
          name: "Slow Pulse"
          update_interval: 2s
      - strobe:
      - random:
      - automation:
          name: "Fade Alert"
          sequence:
            - light.turn_on:
                id: nightlight
                brightness: 100%
                transition_length: 1s
            - delay: 1s
            - light.turn_on:
                id: nightlight
                brightness: 75%
                transition_length: 1s
            - delay: 1s
```

## Features

- **Smooth PWM dimming:** no flickering or buzzing
- **Multiple pulse effects:** gentle breathing motion at different speeds
- **Transition control:** 0.5s default fade for smooth brightness changes
- **Status LED:** built-in WiFi status indicator
- **Restore on boot:** remembers brightness when power returns

## Home Assistant Integration

The nightlight appears as a Light entity:
- Adjust brightness (0-255)
- Select effect (default, fast pulse, slow pulse, strobe, random, fade alert)
- Set transition time for color changes

## Tips

- The "Slow Pulse" effect (2s interval) is ideal for bedside use
- Use the "Fade Alert" automation effect for gentle alarm functionality
- The 1220 Hz frequency is above human hearing range—no audible whine
- ESP32 LEDC PWM supports up to 16 independent channels for multi-zone setups

## RGB Variant (Coming Soon)

The RGB version allows full color control with the same effects applied across all three channels.
