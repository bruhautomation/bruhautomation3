---
title: UV Sensor
description: LTR390 UV index sensor with BME280 and OLED display
---

UV monitoring device with LTR390 UV sensor, BME280 environmental sensor, and SSD1306 OLED display showing real-time light levels, UV index, and environmental conditions.

## Hardware

**Core Components:**
- **Microcontroller:** ESP32
- **UV Sensor:** LTR390 (UV index and ambient light)
- **Environmental:** BME280 (temperature, humidity, pressure)
- **Display:** SSD1306 OLED 128×64
- **I2C:** Two separate buses (bus_a and bus_b)

Both sensors communicate via I2C with separate clock/data lines to avoid conflicts.

## ESPHome Configuration

```yaml
esphome:
  name: bruh-uv-sensor-1
  friendly_name: "BRUH UV Sensor"

esp32:
  board: esp32dev
  framework:
    type: arduino

api:
  encryption:
    key: !secret api_key

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

i2c:
  - id: bus_a
    sda: GPIO5
    scl: GPIO4
    scan: false
    frequency: 400kHz
  - id: bus_b
    sda: GPIO17
    scl: GPIO16
    scan: true
    frequency: 400kHz

sensor:
  - platform: ltr390
    update_interval: 10s
    i2c_id: bus_a
    uv_index:
      name: "UV index"
      id: uv_index
    uv:
      name: "UV sensor counts"
      id: uv_counts
      filters:
        - delta: 1
    light:
      name: "light"
      id: light
      filters:
        - delta: 1
      on_value:
        then:
          - component.update: my_display
    ambient_light:
      name: "light sensor counts"
      id: light_counts

  - platform: bme280_i2c
    i2c_id: bus_b
    temperature:
      name: "temperature"
      oversampling: 16x
    pressure:
      name: "pressure"
    humidity:
      name: "humidity"
    address: 0x76
    update_interval: 30s

display:
  - platform: ssd1306_i2c
    id: my_display
    i2c_id: bus_a
    model: "SSD1306 128x64"
    rotation: 180
    address: 0x3C
    lambda: |-
      it.printf(5, 5, id(font1), "light:  %.0f lx", id(light).state);
      it.printf(5, 40, id(font1), "UV:  %.0f", id(uv_index).state);

font:
  - file: 'Roboto-Medium.ttf'
    id: font1
    size: 15
```

## Features

- **UV Index monitoring:** real-time UV exposure tracking
- **Ambient light measurement:** lux (brightness) in foot-candles
- **Temperature, humidity, pressure:** full environmental snapshot
- **Delta filtering:** only update on significant changes (reduces noise)
- **Dual I2C buses:** independent addressing to avoid conflicts
- **OLED display:** instant visual feedback
- **16x oversampling:** BME280 for accurate readings

## UV Index Interpretation

- **0-2:** Low (safe all day)
- **3-5:** Moderate (protect eyes 10am-4pm)
- **6-7:** High (limit exposure)
- **8-10:** Very high (take precautions)
- **11+:** Extreme (stay indoors)

## Home Assistant Integration

Entities created:
- `sensor.uv_index` — UV index value (0-15+)
- `sensor.light` — ambient light in lux
- `sensor.temperature` — from BME280
- `sensor.humidity` — from BME280
- `sensor.pressure` — atmospheric pressure

Use in automations:
- Notify when UV index exceeds threshold
- Trigger reminders to apply sunscreen
- Log daily UV exposure trends

## Display Customization

```yaml
# Show all readings
lambda: |-
  it.printf(0, 0, id(font1), "Light: %.0f lx", id(light).state);
  it.printf(0, 15, id(font1), "UV: %.1f", id(uv_index).state);
  it.printf(0, 30, id(font1), "Temp: %.1f C", id(temperature).state);
  it.printf(0, 45, id(font1), "Humid: %.0f%%", id(humidity).state);

# Color-coded UV warning
lambda: |-
  if (id(uv_index).state > 8.0) {
    it.printf(0, 0, id(font1), "WARNING: UV %.1f", id(uv_index).state);
  } else {
    it.printf(0, 0, id(font1), "UV: %.1f", id(uv_index).state);
  }
```

## Sensor Placement

- **Outdoors:** direct sun exposure for accurate UV readings
- **Window:** filtered UV (glass blocks UVB)
- **Indoors:** only ambient light measurement works
- **Avoid shadows:** direct sunlight required for UV accuracy

The LTR390 is sensitive but should not be pointed directly at sun for extended periods.

## Tips

- Update intervals: UV every 10 seconds, BME280 every 30 seconds (balances accuracy and power)
- Delta filtering prevents constant Home Assistant updates for minimal noise
- The LTR390 has an internal photodiode—minimal thermal drift
- Calibrate display colors if UV readings seem off—different batches vary slightly

## Outdoor Enclosure (Coming Soon)

IP67-rated 3D-printed housing for weather-resistant outdoor deployment.
