---
title: BLE Hub
description: Bluetooth Low Energy tracker and proxy for Home Assistant
---

Bluetooth Low Energy (BLE) hub for tracking iBeacon devices and proxying BLE signals to Home Assistant, enabling presence detection and device tracking.

## Hardware

**Core Components:**
- **Microcontroller:** ESP32
- **BLE Radio:** Integrated (dual-mode: Bluetooth Classic + BLE)
- **Range:** 30-50 meters indoors (varies by environment)

No additional hardware needed—BLE is built into every ESP32.

## ESPHome Configuration

```yaml
esphome:
  name: bruh-ble-hub-1

esp32:
  board: esp32dev
  framework:
    type: arduino

api:
  encryption:
    key: !secret api_key

esp32_ble_tracker:
  scan_parameters:
    interval: 320ms
    duration: 30s
    active: false
    continuous: true

bluetooth_proxy:
  active: true

binary_sensor:
  - platform: ble_presence
    ibeacon_uuid: '426C7565-4368-6172-6D42-6561636F6E73'
    name: "Trash Can"

  - platform: ble_presence
    ibeacon_uuid: '426C7565-4368-6172-6D42-6561636F6E74'
    name: "Trash Can Motion"

  - platform: ble_presence
    ibeacon_uuid: '426C7565-4368-6172-6D42-6561636F6E79'
    name: "Trash Can Button"

sensor:
  - platform: ble_rssi
    ibeacon_uuid: '426C7565-4368-6172-6D42-6561636F6E73'
    name: "Trash Can RSSI"
```

## Features

- **iBeacon tracking:** detect presence of tagged items or people
- **RSSI signal strength:** estimate distance based on signal power
- **BLE proxy:** relay other BLE devices to Home Assistant (thermometers, scales, door locks)
- **Continuous scanning:** always listening for nearby devices
- **Low power mode:** passive scanning (no advertising to devices)

## Typical Use Cases

- **Presence detection:** know when a person (with iBeacon tag) is home
- **Item tracking:** track keys, wallets, or important equipment
- **Integration:** use as a BLE bridge for non-WiFi devices
- **Multi-hub coverage:** deploy multiple hubs to extend range

## iBeacon UUIDs in This Config

The three UUIDs shown are examples for a trash can setup. To track your own devices:

1. Find the iBeacon UUID of your device (search "how to check iBeacon UUID")
2. Replace the UUID strings
3. Add more `ble_presence` entries as needed

## RSSI Interpretation

Signal strength (RSSI in dBm):
- **-30 to -50:** very close (< 2 meters)
- **-50 to -70:** nearby (2-5 meters)
- **-70 to -90:** moderate distance (5-15 meters)
- **-90 to -110:** far (15+ meters)

Use in Home Assistant automations to create distance-based triggers.

## Tips

- Place the hub in a central location for best coverage
- Multiple hubs improve accuracy (Home Assistant can triangulate)
- Passive scanning (active: false) uses less power
- Bluetooth range varies significantly by environment (walls, metal, etc.)

## Pairing with BLE Devices

Once configured, Home Assistant will discover nearby BLE devices automatically. No manual pairing needed for most modern BLE devices.
