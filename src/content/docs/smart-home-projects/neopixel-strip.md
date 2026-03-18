---
title: Neopixel LED Strip
description: ESP8266 addressable RGB LED strip controller with effects and WiFi integration
---

Simple addressable WS2812B/NeoPixel strip controller with multiple light effects, WiFi integration, and Home Assistant control.

## Hardware

**Core Components:**
- **Microcontroller:** ESP8266 (NodeMCU v2)
- **LED Strip:** WS2812B NeoPixel (24 LEDs per strip)
- **Data Pin:** GPIO3 (RX pin)

The strip connects directly to the ESP8266 with power and data lines. No additional driver circuitry needed for short runs.

## ESPHome Configuration

```yaml
substitutions:
  device_name: "BRUH Light"
  device_id: "bruh-light"

esp8266:
  board: nodemcuv2

light:
  - platform: neopixelbus
    type: GRB
    pin: GPIO3
    num_leds: 24
    name: "${device_name}"
    variant: 800KBPS
    method: ESP8266_DMA
    effects:
      - flicker:
      - strobe:
      - random:
      - addressable_rainbow:
      - addressable_scan:
      - addressable_color_wipe:
      - addressable_twinkle:
      - addressable_random_twinkle:
      - addressable_fireworks:
      - addressable_flicker:

sensor:
  - platform: wifi_signal
    name: "${device_name} WiFi Signal"
    update_interval: 300s
```

## Features

- **10 built-in effects:** flicker, strobe, random, rainbow, scan, color wipe, twinkle, fireworks, and more
- **Full RGB control:** set any color via Home Assistant
- **DMA method:** smooth animation without blocking the processor
- **Addressable control:** animate individual LEDs or groups
- **Low power:** typical 60mA at full brightness for 24-LED strip

## Home Assistant Integration

Control via the Light entity:
- Set brightness (0-255)
- Choose colors
- Select effect
- Transition time for smooth color changes

## Notes

For strips longer than 3 meters, add a dedicated 5V power supply to avoid voltage drop. The data line can run from the ESP8266, but power must come from an external PSU.

The 800KBPS variant (WS2812B) is the standard. Some older WS2811 strips use 400KBPS—adjust the variant if using those.
