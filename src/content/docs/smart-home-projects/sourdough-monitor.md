---
title: Sourdough Monitor
description: Smart jar with TFT display showing fermentation history, temperature, and humidity
---

Smart fermentation monitor for sourdough starters, featuring a TFT display with historical temperature graphs, real-time humidity and pressure readings, and Home Assistant integration.

## Hardware

**Core Components:**
- **Microcontroller:** ESP32-S3 with octal PSRAM
- **Display:** TFT screen with backlight control
- **Sensors:** Temperature, humidity, and pressure (BME280 or similar)
- **Connectivity:** WiFi for Home Assistant sync
- **Storage:** 48-point history buffer in PSRAM

The PSRAM stores fermentation history for graphing without needing external storage.

## ESPHome Configuration

```yaml
esphome:
  name: smart-jar-2
  friendly_name: Sourdough Monitor
  on_boot:
    priority: -100
    then:
      - wait_until: api.connected
      - delay: 2s
      - homeassistant.event:
          event: esphome.smart_jar_request_history
          data:
            device: "smart_jar_2"
            hours: !lambda 'return id(chart_hours);'

esp32:
  board: esp32-s3-devkitc-1
  framework:
    type: esp-idf

psram:
  mode: octal
  speed: 80MHz

api:
  encryption:
    key: !secret api_key
  services:
    - service: force_display_update
      then:
        - logger.log: "Force display update requested"
        - component.update: smart_jar_display

    - service: set_chart_hours
      variables:
        hours: int
      then:
        - globals.set:
            id: chart_hours
            value: !lambda 'return hours;'

globals:
  - id: history_data
    type: float[48]
    restore_value: no

  - id: history_count
    type: int
    restore_value: no
    initial_value: '0'

  - id: history_min
    type: float
    restore_value: no
    initial_value: '0.0'

  - id: history_max
    type: float
    restore_value: no
    initial_value: '100.0'

  - id: chart_hours
    type: int
    restore_value: yes
    initial_value: '8'

output:
  - platform: ledc
    pin: GPIO14
    id: backlight_pwm
    frequency: 1000Hz

light:
  - platform: monochromatic
    output: backlight_pwm
    name: "Display Backlight"
    id: backlight
    restore_mode: RESTORE_DEFAULT_ON

font:
  - file: 'gfonts://Roboto'
    id: font_chart
    size: 14
  - file: 'gfonts://Roboto@bold'
    id: font_top_row
    size: 28

color:
  - id: color_black
    hex: '000000'
  - id: color_white
    hex: 'FFFFFF'
  - id: color_temp_ideal
    hex: '4CAF50'
  - id: color_temp_warm
    hex: 'FF9800'
```

## Features

- **Historical graphing:** 48-point buffer showing temperature trends
- **Real-time sensors:** temperature, humidity, pressure display
- **TFT color display:** rich UI with temperature color coding
- **Adjustable time window:** view 4, 8, 12, or 24 hour history
- **Auto brightness:** PWM backlight control
- **Home Assistant sync:** request history data via events
- **Temperature zones:** color-coded ideal, warm, hot ranges

## Display Zones

- **Cold (blue):** < 70°F — fermentation too slow
- **Ideal (green):** 70-80°F — perfect for sourdough
- **Warm (orange):** 80-90°F — acceptable but fast
- **Hot (red):** > 90°F — risk of over-fermentation

## Home Assistant Integration

The monitor sends temperature history to Home Assistant on boot, allowing you to:
- Log fermentation patterns over time
- Create statistics and trends
- Trigger notifications if temperature drifts

Call `esphome.smart_jar_force_display_update` to manually refresh the display.

## Calibration

Temperature sensors (especially if using BME280) should be calibrated:

```yaml
sensor:
  - platform: bme280_i2c
    temperature:
      filters:
        - offset: -2.0  # Adjust based on actual vs. expected readings
```

## Tips

- Octal PSRAM mode runs at 80 MHz—very fast memory access for graphing
- The 48-point buffer represents hourly or 30-minute samples depending on config
- Backlight is off by default to avoid attracting attention
- Place the sensor inside the jar for accurate fermentation tracking
- Graph updates when new data arrives or on manual refresh

## Customization

The lambda code in the display component controls the UI layout:

```yaml
lambda: |-
  // Draw temperature at top
  it.printf(5, 5, id(font_top_row), "%.1f°F", id(temp).state);

  // Draw mini history graph
  // (custom drawing code here)

  // Draw humidity and pressure
  it.printf(5, 40, id(font_chart), "H: %.0f%% P: %.0fhPa",
    id(humidity).state, id(pressure).state);
```

## Coming Soon

- Nested compartments for multiple starters
- WiFi OTA updates over-the-air
- SD card logging for long-term archive
