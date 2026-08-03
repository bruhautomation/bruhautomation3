---
category: home-automation
tags: [esphome, home-assistant]
status: active
---

# Sonoff S20

A Sonoff S20 flashed with ESPHome: relay, physical button and a dimmable status
LED, reporting to Home Assistant over the local network with no vendor cloud in
the path. The simplest ESPHome flash there is — no metering chip, no sensors.

For the same plug with real power monitoring, see `sonoff-s31/`.

## What's in this folder

- `esphome/sonoff-s20.yaml` — the ESPHome configuration

## Hardware

- Sonoff S20 smart plug (ESP8266, `esp01_1m`, 1 MB flash, `dout` flash mode)
- Flashed over serial through the board's four programming pads (`3V3`, `RX`,
  `TX`, `GND`) with a 3.3 V USB-to-serial adapter

## GPIO map

| Function | GPIO | Notes |
|---|---|---|
| Relay | GPIO12 | Switch entity |
| LED | GPIO13 | Inverted, PWM output (also claimed by `status_led`) |
| Button | GPIO0 | Inverted, `INPUT_PULLUP`; also the flash-mode button |

## Secrets

Reads `wifi_ssid`, `wifi_password` and `ota_password` from `secrets.yaml`. See
`../secrets.yaml.example`.

## Notes

- GPIO13 is used by both the `led` PWM output and the `status_led` block. Delete
  `status_led:` once the device is deployed if you want the LED driven from Home
  Assistant.
- The button's `on_press` toggles the relay and the LED together; switching the
  relay from Home Assistant does not change the LED.
- `restore_mode: RESTORE_DEFAULT_ON` — the plug powers up on after a power cut
  if no state is stored. Change to `RESTORE_DEFAULT_OFF` for loads that should
  stay off.
