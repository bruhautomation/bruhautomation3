---
category: home-automation
tags: [esphome, home-assistant]
status: active
---

# Sonoff RF Bridge

A Sonoff RF Bridge 433 running ESPHome instead of its stock firmware. Every
433 MHz code it decodes becomes a Home Assistant event, and Home Assistant can
transmit codes back out through it.

## What's in this folder

- `esphome/sonoff-rf-bridge.yaml` — the ESPHome configuration

## Hardware

- Sonoff RF Bridge 433 (ESP8266, `board: esp01_1m`, powered over micro-USB)
- The bridge's onboard RF module, reached over the ESP's hardware UART on
  GPIO1/GPIO3 at 19200 baud
- 3.3 V USB-to-TTL serial adapter, for the first flash only

## What the config exposes

No entities. It publishes one Home Assistant event and two services:

- `esphome.rf_code_received` — fired on every decoded code, carrying `sync`,
  `low`, `high` and `code` as hex strings
- `esphome.sonoff_rf_bridge_send_rf_code` — transmits a code, taking those same
  four values as integers
- `esphome.sonoff_rf_bridge_learn` — runs the RF module's learn cycle

Serial logging is disabled (`logger: baud_rate: 0`) because the RF module owns
that UART. Read the logs over WiFi.

The full build write-up is on the project page.
