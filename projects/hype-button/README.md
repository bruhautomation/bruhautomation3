---
category: home-automation
tags: [esphome, home-assistant, 3d-print]
status: active
---

# Hype Button

A 22 mm mushroom button on an ESP32. ESPHome counts how you hit it — one click
through five, or a long hold — and publishes each pattern to Home Assistant as a
different string, so one button drives six automations. An 8-pixel WS2812 board
shows a 0–7 level set by the same button.

**Build guide:** [bruhautomation.com/projects/hype-button](https://bruhautomation.com/projects/hype-button/)

## What's in this folder

- `esphome/bruh-switch.yaml` — the ESPHome configuration

## Hardware

- ESP32 dev board (`board: esp32dev`, arduino framework)
- 22 mm **momentary** mushroom-head push button on GPIO22 (internal pullup, inverted)
- 8-pixel WS2812 board on GPIO13 (`neopixelbus`, 800 KBPS, GRB)
- 22 mm two-hole control station box as the enclosure
- 5 V over micro-USB

## Notes

- The config's `encoder_sw` is named after a rotary encoder, but there is no
  `rotary_encoder:` component — only the switch is read.
- The `xiaomi_hhccjcy01` sensor and `esp32_ble_tracker:` blocks are a plant
  sensor riding along on the same board. Delete them unless you have one.
