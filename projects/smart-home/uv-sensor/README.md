# UV Sensor

ESP32-based UV index and environmental sensor with OLED display. Measures UV index (LTR390), temperature, humidity, and barometric pressure (BME280) and reports to Home Assistant.

## Hardware

- Board: ESP32
- Sensor: LTR390 UV/ambient light (I2C)
- Sensor: BME280 temperature/humidity/pressure (I2C)
- Display: SSD1306 128x64 OLED (I2C)
- Dual I2C buses for sensor isolation

## Files

### Firmware
- `bruh-uv-sensor.yaml` — ESPHome configuration

## Status

Complete
