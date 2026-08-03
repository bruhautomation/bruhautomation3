---
category: home-automation
tags: [esphome, home-assistant]
status: active
---

# Desk Controller

An ESP32 bolted onto an electric sit-stand desk. It reads the real height off
the serial line feeding the desk's handset, and drives the handset's up and down
buttons through two relay contacts — so Home Assistant gets a height sensor, two
switches and a `move_desk` service.

## What's in this folder

- `esphome/bruh-desk.yaml` — the ESPHome config
- `esphome/table_height_sensor.h` — custom component that decodes the height off
  the 9600-baud handset bus. Must sit beside the YAML; `includes:` pulls it in
  relative to the config

## Hardware

- ESP32 dev board (`board: nodemcu-32s`)
- 2-channel 5V relay module, **low-level trigger** (both switches are `inverted: true`)
- 5V USB supply

## Pins

| Signal | Pin |
|---|---|
| UART RX (height line) | GPIO17 |
| UART TX (unused) | GPIO16 |
| Relay — Up | GPIO18 |
| Relay — Down | GPIO19 |
| Status LED | GPIO2 |

## Notes

- The height sensor is declared `cm` but the decode `(byte + 256) / 10` produces
  inches. Change the unit before flashing.
- `move_desk` is open-loop: it pulses a relay for `delay_time` seconds. Call it
  repeatedly with short pulses rather than once with a long one.
- Needs an `input_number.bruh_desk_height` helper in Home Assistant as the setpoint.
- The `xiaomi_hhccjcy01` and `esp32_ble_tracker` blocks are an unrelated plant
  sensor using this board's BLE radio. Delete them, or put your own MAC in.
