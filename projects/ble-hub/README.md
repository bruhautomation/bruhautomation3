---
category: home-automation
tags: [esphome, home-assistant]
status: active
---

# BLE Hub

An ESP32 running ESPHome as a Bluetooth proxy for Home Assistant, plus an
iBeacon tracker. The proxy relays BLE traffic both directions, so every
Bluetooth integration in Home Assistant gains range wherever a node is plugged
in. The tracker watches specific iBeacon UUIDs and reports presence and RSSI.

Nothing is wired and nothing is printed — a board, a USB cable, and a config.

## What's in this folder

- `esphome/bruh-ble-hub.yaml` — the ESPHome config

## Hardware

- ESP32 dev board (`board: esp32dev`, plain ESP-WROOM-32). It must be an
  original ESP32 — neither the ESP8266 nor the ESP32-S2 has a Bluetooth radio,
  and `esp32_ble_tracker` refuses to compile for either.
- Micro-USB cable and a 5 V USB supply
- iBeacons to track. The shipped UUIDs are BlueCharm's factory defaults:
  `426C7565-4368-6172-6D42-6561636F6E73` is ASCII for `BlueCharmBeacons`, and
  the last byte varies by event — `73` idle, `74` motion, `79` button.

## Notes

- `esp32_ble_tracker` → `scan_parameters` → `active: false` is passive scanning
  (listen only). `bluetooth_proxy` → `active: true` is outbound connections from
  Home Assistant. They are different settings that share a name.
- Three `ble_presence` binary sensors, one `ble_rssi` sensor. The RSSI block is
  on the idle UUID only — the motion and button UUIDs transmit in bursts, so a
  signal reading from them would be stale most of the day.
- There is no `substitutions:` block — edit `esphome: name:` and the fallback
  hotspot SSID directly for each node you build.
- The `ota:` block has no `platform:` key. Current ESPHome requires
  `platform: esphome` under `ota:`.
- Build one per area. BLE range is roughly a room, not a house.
