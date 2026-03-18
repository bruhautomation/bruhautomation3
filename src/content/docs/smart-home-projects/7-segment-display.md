---
title: 7-Segment Display
description: MAX7219-based 8-digit 7-segment display showing Home Assistant data
---

Wall-mounted 8-digit 7-segment display driven by MAX7219, displaying real-time data from Home Assistant like subscriber counts, sensor readings, or any numeric value.

## Hardware

**Core Components:**
- **Microcontroller:** ESP32 (NodeMCU-32S)
- **Display Driver:** MAX7219 (SPI interface)
- **Display:** 8-digit 7-segment common cathode
- **Intensity:** Configurable 0-15 (software control)

**SPI Connections:**
- CLK → GPIO21
- MOSI (Data) → GPIO22
- CS (Chip Select) → GPIO23

## ESPHome Configuration

```yaml
substitutions:
  device_name: "BRUH 7 Segment"
  device_id: "bruh-7-seg"

esp32:
  board: nodemcu-32s

sensor:
  - platform: homeassistant
    name: "Subscribers"
    entity_id: sensor.youtube_subscribers
    id: subscribers

  - platform: wifi_signal
    name: "${device_name} WiFi Signal"
    update_interval: 300s

spi:
  clk_pin: GPIO21
  mosi_pin: GPIO22

display:
  - platform: max7219
    cs_pin: GPIO23
    intensity: 8
    num_chips: 1
    lambda: |-
      it.printf(0, "%.0f", id(subscribers).state);

time:
  - platform: sntp
    id: sntp_time
```

## Features

- **Easy SPI interface:** standard MAX7219 protocol
- **Daisy-chainable:** stack multiple displays (set `num_chips`)
- **Flexible display:** lambda code controls what appears
- **Home Assistant integration:** fetch any numeric entity
- **16-level brightness:** adjust intensity for different room lighting
- **3D-printable enclosure:** minimal bezels for a clean look

## Customization

The `lambda:` function determines what displays. Examples:

```yaml
# Show temperature with one decimal
lambda: |-
  it.printf(0, "%.1f", id(temperature).state);

# Show multiple values (time + number)
lambda: |-
  it.set_intensity(6);
  it.printf(0, "%02d%02d", hour(id(sntp_time).now()), minute(id(sntp_time).now()));
```

## Common Entities to Display

- YouTube subscribers
- Current temperature
- Power usage (watts)
- Time of day (24-hour format as HHMM)
- Air quality index
- Stock prices (via Home Assistant template sensors)

## Notes

The MAX7219 can drive up to 8 7-segment displays or 64 individual LEDs. For longer chains, add a bypass capacitor (100µF) near the IC power pins.

Display data is updated whenever the Home Assistant sensor changes, so refreshes are near-instantaneous.
