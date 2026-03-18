---
title: BRUH Multisensor
description: ESP8266 room sensor with temperature, humidity, motion, light detection, and RGB LED
---

All-in-one room sensor with DHT22 temperature and humidity, PIR motion detection, ambient light measurement, and an RGB status LED controlled from Home Assistant.

## Hardware

**Core Components:**
- **Microcontroller:** ESP8266 (NodeMCU v2)
- **Temperature/Humidity:** DHT22 sensor
- **Motion Detection:** PIR sensor
- **Light Level:** Photoresistor (analog)
- **Status LED:** RGB LED (common cathode)

**Pinout:**
- DHT22 → GPIO13 (D7)
- Photoresistor → A0 (ADC)
- PIR Motion → GPIO14 (D5)
- LED Red → GPIO5 (D1), Green → GPIO4 (D2), Blue → GPIO0 (D3)

## ESPHome Configuration

```yaml
substitutions:
  device_name: "BRUH Multisensor"
  device_id: "bruh-multisensor"

esp8266:
  board: nodemcuv2

binary_sensor:
  - platform: gpio
    pin: D5
    name: "${device_name} Motion"
    device_class: motion

light:
  - platform: rgb
    name: "${device_name} LED"
    red: red_pwm
    green: green_pwm
    blue: blue_pwm
    effects:
      - flicker:
      - strobe:
      - random:

output:
  - platform: esp8266_pwm
    pin: D1
    id: red_pwm
  - platform: esp8266_pwm
    pin: D2
    id: green_pwm
  - platform: esp8266_pwm
    pin: D3
    id: blue_pwm

sensor:
  - platform: dht
    pin: D7
    model: DHT22
    update_interval: 5s
    temperature:
      name: "${device_name} Temperature"
      filters:
        - lambda: return x * (9.0/5.0) + 32.0;
      unit_of_measurement: "°F"
    humidity:
      name: "${device_name} Humidity"

  - platform: adc
    pin: A0
    name: "${device_name} Luminance"
    update_interval: 2s
    unit_of_measurement: "%"
    accuracy_decimals: 0
    filters:
      - calibrate_linear:
          - 0.0 -> 0.0
          - 0.6 -> 100.0
      - delta: 3.0

  - platform: wifi_signal
    name: "${device_name} WiFi Signal"
    update_interval: 300s
```

## Features

- Real-time temperature and humidity tracking in Fahrenheit
- Motion detection with device class for Home Assistant automations
- Ambient light measurement with calibration for your specific room
- Addressable RGB LED for status indication (flicker, strobe, or random effects)
- Low-power WiFi signal monitoring
- 5-second sensor update interval for responsive readings

## CAD Files & 3D Prints

Available on GitHub: https://github.com/bruhautomation/BRUH-CAD-Files/tree/main/smart-home/multisensor

Includes 3D-printable enclosure designs and mounting brackets.

## Variants

- **ESP8266 version** (above) — lightweight, all sensors on board
- **ESP32 with BME280** — higher accuracy environmental sensor with pressure readings (coming soon)
