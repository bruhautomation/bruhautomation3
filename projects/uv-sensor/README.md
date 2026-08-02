---
category: home-automation
tags: [esphome, home-assistant]
status: complete
---

# UV Sensor

UV index, light level, temperature, humidity and barometric pressure on one
ESP32, with a 0.96" OLED showing the live UV index and lux.

## What's in this folder

- `esphome/bruh-uv-sensor.yaml` — the ESPHome configuration

## Hardware

- Board: ESP32, 38-pin ESP-WROOM-32 (`board: esp32dev`)
- Sensor: LTR390 UV/ambient light (I2C, default address)
- Sensor: BME280 temperature/humidity/pressure (I2C, `0x76`)
- Display: SSD1306 128x64 OLED (I2C, `0x3C`)
- Dual I2C buses for sensor isolation

## Pins

| Signal | GPIO | Bus | Devices |
|---|---|---|---|
| SDA | 5 | `bus_a` | LTR390, SSD1306 |
| SCL | 4 | `bus_a` | LTR390, SSD1306 |
| SDA | 17 | `bus_b` | BME280 |
| SCL | 16 | `bus_b` | BME280 |

Both buses run at 400 kHz. `bus_a` has `scan: false`; `bus_b` has `scan: true`.

GPIO16 and GPIO17 are taken by PSRAM on ESP32-WROVER modules, so `bus_b` needs a
plain WROOM board.

## Before you compile

- `Roboto-Medium.ttf` must sit beside the YAML — the `font:` block references it
  by relative path and the build fails without it.
- `secrets.yaml` needs `wifi_ssid`, `wifi_password`, `ota_password`,
  `ap_password` and `api_key`.
- There is no `substitutions:` block. To build a second node, edit
  `esphome.name`, `friendly_name` and the fallback AP `ssid` directly.

## Entities

LTR390 every 10 s: UV index, light (lux), UV sensor counts, light sensor counts.
BME280 every 30 s: temperature (16x oversampled), humidity, pressure.

No calibration offsets are set in the config.
