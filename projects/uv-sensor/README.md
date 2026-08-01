---
category: home-automation
tags: [esphome, home-assistant]
status: complete
---

# UV Sensor

UV index and environmental sensor with an OLED display.

## What's in this folder

- `esphome/` — ESPHome configuration

## Hardware

- Board: ESP32
- Sensor: LTR390 UV/ambient light (I2C)
- Sensor: BME280 temperature/humidity/pressure (I2C)
- Display: SSD1306 128x64 OLED (I2C)
- Dual I2C buses for sensor isolation
