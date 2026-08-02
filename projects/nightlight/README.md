---
category: home-automation
tags: [esphome, home-assistant]
status: complete
---

# Nightlight

Two ESPHome nightlights: a dimmable single-colour countertop light, and an RGBW
build with a warm bulb and a 54-pixel fill strip.

## What's in this folder

- `esphome/bruh-nightlight.yaml` — the mono build. ESP32 (`nodemcu-32s`), one
  LEDC PWM channel on GPIO32 driving a single-colour LED strip through a MOSFET
  module, status LED on GPIO2.
- `esphome/bruh-nightlight-rgb.yaml` — the RGB build. ESP32-S3-DevKitC-1,
  Arduino framework. LEDC PWM on GPIO20 for the warm bulb, 54 SK6812 RGBW pixels
  on GPIO21, and the board's onboard WS2812 on GPIO48.

## Hardware

- ESP32 dev board (mono) / ESP32-S3-DevKitC-1 (RGB)
- MOSFET PWM driver module — one per single-colour channel
- 24 V white LED strip and 24 V supply (mono), or a 12 V dimmable G4 bulb,
  SK6812 RGBW strip and 12 V supply with a 5 V buck (RGB)
- Aluminium channel with a clear lens for the under-counter run

Full parts list, wiring tables and setup notes are on the project page.
