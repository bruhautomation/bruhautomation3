---
category: home-automation
tags: [esphome, home-assistant, 3d-print, arduino]
status: active
---

# Multisensor

Room sensor — temperature, humidity, motion and light.

## What's in this folder

- `models/` — `nodemcu_top.stl` and `nodemcu_bottom.stl`, the two halves of the
  case (these are what the site previews)
- `esphome/` — `bruh-multisensor.yaml` (ESP8266, build this one) and
  `bruh-multisensor-esp32.yaml` (ESP32 with BME280 + TSL2561)
- `arduino-legacy/` — pre-ESPHome MQTT sketches, kept for reference only
- `fritzing/` — breadboard wiring diagrams

## Hardware

**ESP8266 build** — NodeMCU v2 (`board: nodemcuv2`), DHT22 on D7, PIR on D5,
photoresistor on A0, common-cathode RGB LED on D1/D2/D3. Case: two printed
halves, 54 × 30.5 mm footprint, three 9.4 mm sensor holes in the bottom.

**ESP32 build** — NodeMCU-32S, BME280 at `0x76` and TSL2561 at `0x39` on I²C
(SDA GPIO5, SCL GPIO4), PIR on GPIO18, four SK6812 RGBW pixels on GPIO19. No
printed case; the STLs here fit the NodeMCU only. The BME280 temperature and
humidity offsets in that config are one board's calibration — clear them before
trusting a reading.

The legacy sketches need an MQTT broker, `PubSubClient` and `ArduinoJson`. The
ESPHome configs need neither, and are discovered by Home Assistant on their own.
