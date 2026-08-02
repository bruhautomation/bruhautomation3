---
category: home-automation
tags: [esphome, home-assistant]
status: complete
---

# Sound Machine

An ESP32 and a DFPlayer Mini that loop white noise, rain or a fan off a microSD
card, with volume, track selection and EQ exposed to Home Assistant as services.

## What's in this folder

- `esphome/bruh-sound-machine.yaml` — the ESPHome config

## Hardware

- ESP32 dev board (ESP-WROOM-32; `board: nodemcu-32s`)
- DFPlayer Mini / YX5200 MP3 module
- microSD card, 32 GB maximum, FAT32
- Small speaker on the module's `SPK_1` / `SPK_2` pins
- 5 V USB supply

## Wiring

| Function | ESP32 | DFPlayer Mini |
|---|---|---|
| UART TX | GPIO17 | RX |
| UART RX | GPIO16 | TX |
| Power | 5V / VIN | VCC |
| Ground | GND | GND |

GPIO16 and GPIO17 are UART2 on an ESP32, so the logger keeps UART0 and the USB
console stays usable. Do not build this on a WROVER-based board — those two pins
are wired to the PSRAM die there.

## Home Assistant

The config declares seventeen user-defined API services, exposed as
`esphome.<device_id>_<service>`. `dfplayer_play_loop_folder` is the one that
makes it a sound machine: give it a folder number and it loops that folder until
`dfplayer_stop`.

Volume is 0–30. The `set_eq` preset is 0–5 (normal, pop, rock, jazz, classic,
bass).

Full build notes, parts list and troubleshooting are on the project page.
