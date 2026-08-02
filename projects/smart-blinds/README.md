---
category: home-automation
tags: [esphome, home-assistant, 3d-print, arduino]
status: active
---

# Smart Blinds

Motorised slat tilt for venetian blinds. It turns the tilt rod, not the lift
cord — Home Assistant gets a tilt-only cover entity.

Two generations live here, and they are different machines.

## What's in this folder

- `esphome/bruh_blinds.yaml` — the current build. ESP32 (`board: nodemcu-32s`),
  a hobby servo on the tilt rod through an `ledc` output at 50 Hz, an
  `esp32_touch` pad as a manual button, a 24-pixel WS2812B strip, and a template
  cover. Everything is a substitution; there are eight of them and the header
  comment only lists seven (`led_pin` is the missing one).
- `arduino-legacy/BRUHBlindsV4/` — the original. NodeMCU (ESP8266), a 28BYJ-48
  geared stepper on a ULN2003 board, and an MPU-6050 stuck to a slat for closed-
  loop angle feedback. MQTT, with optional DHT22 / PIR / photoresistor.
  **Contains hard-coded WiFi and MQTT credentials — replace them all before
  flashing.**
- `models/bruh_blinds_final.stl` — four printed pieces on one plate: a
  74 × 57 × 32 mm box, its lid, a headrail bracket, and a shaft coupler with a
  3.6 × 5.6 mm double-D socket. The coupler fits a 28BYJ-48, so these parts
  belong to the legacy build, not the servo one.
- `fritzing/` — the wiring diagram for the legacy build: NodeMCU, ULN2003,
  28BYJ-48, GY-521.

## Hardware

- ESPHome build: ESP32 dev board, MG90S metal-gear servo (180°), WS2812B strip,
  5 V supply.
- Legacy build: NodeMCU v2, 28BYJ-48 + ULN2003, MPU-6050 GY-521, 12 V supply and
  a step-down for the board's 5 V.

Full parts list with links, wiring tables, print settings and calibration are on
the project page.
