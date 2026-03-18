---
title: ESP32-CAM
description: OV2640 camera with OLED display and PIR motion detection
---

Compact ESP32-CAM module with integrated OV2640 camera, SSD1306 OLED display for status, and PIR motion detection for low-light security monitoring.

## Hardware

**Core Components:**
- **Microcontroller:** ESP32 (AI-Thinker ESP32-CAM module)
- **Camera:** OV2640 (640×480 resolution, JPEG compression)
- **Display:** SSD1306 OLED 128×64 (I2C)
- **Motion Sensor:** PIR on GPIO33
- **Button:** GPIO34
- **Power:** USB or 5V input (careful with reset timing)

The module is very compact but requires careful power management—use a quality USB supply.

## ESPHome Configuration

```yaml
esphome:
  name: esp32-cam-1
  friendly_name: "ESP32 Camera"

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
  sda: 21
  scl: 22

font:
  - file: "Roboto-Medium.ttf"
    id: roboto
    size: 14

display:
  - platform: ssd1306_i2c
    model: "SSD1306 128x64"
    rotation: 180
    lambda: |-
      it.print(0, 10, id(roboto), "Hello World!");

esp32_camera:
  name: Camera
  external_clock:
    pin: 32
    frequency: 20MHz
  i2c_pins:
    sda: 13
    scl: 12
  data_pins:
    - 5
    - 14
    - 4
    - 15
    - 18
    - 23
    - 36
    - 39
  vsync_pin: 27
  href_pin: 25
  pixel_clock_pin: 19
  resolution: 640x480

binary_sensor:
  - platform: gpio
    pin: 33
    name: "PIR Sensor"
    device_class: motion
  - platform: gpio
    pin: 34
    name: "Button"
```

## Features

- **Camera stream:** live video feed to Home Assistant
- **JPEG snapshots:** capture on demand or motion
- **OLED feedback:** display status and mode
- **Motion trigger:** PIR detection for automations
- **Button control:** physical input for manual capture
- **Low power:** consumes ~150mA when actively streaming

## Camera Integration

In Home Assistant, the camera is exposed as:
- Live stream (via `esp32_camera` component)
- Snapshot URL for dashboards
- Motion binary sensor for automations

## OLED Display Examples

```yaml
# Show WiFi status
lambda: |-
  it.printf(0, 0, id(roboto), "WiFi: %s", wifi::global_wifi_component->get_ssid().c_str());

# Show motion status and timestamp
lambda: |-
  if (id(pir_sensor).state) {
    it.print(0, 0, id(roboto), "MOTION DETECTED");
  } else {
    it.print(0, 0, id(roboto), "All Clear");
  }

# Show IP address
lambda: |-
  it.printf(0, 0, id(roboto), "IP: %s", wifi::global_wifi_component->get_ip_address().str().c_str());
```

## Power Supply Notes

The ESP32-CAM draws spikes up to 500mA during camera operation. Use:
- **5V 2A or better** USB supply
- Add a **10µF capacitor** near the module's power pins
- Avoid long USB cables (voltage drop causes reset loops)

## Tips

- The module has a small button on the board—hold for 3-5 seconds to reset
- Flip the display orientation (rotation: 180) if mounting upside-down
- Resolution can be reduced to 320×240 for faster snapshots
- PIR sensor has a warm-up period (~30 seconds) after boot

## Home Assistant Automations

Common triggers:
- Motion detected: take snapshot and save to media folder
- On button press: send notification with latest frame
- Scheduled snapshots: capture every 5 minutes

## Enclosure (Coming Soon)

3D-printable designs for wall-mounting or corner placement.
