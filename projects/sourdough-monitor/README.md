---
category: home-automation
tags: [esphome, home-assistant]
status: active
---

# Sourdough Monitor

A printed lid for a 40 oz sourdough starter jar with a 3.5in colour touch screen
on it. Temperature and humidity in large type, a 48-point chart of the last few
hours under them, and an ESPHome node behind it so the same readings reach Home
Assistant. The node keeps no history on flash — two seconds after the API
connects it fires `esphome.smart_jar_request_history` and asks Home Assistant to
send its own history back.

## What's in this folder

- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports
- `models/` — STL exports
- `esphome/` — ESPHome configuration

## Known gaps in these files

Three things a builder needs to know before slicing or compiling anything:

- **One lid design, two filenames.** `smart_jar_lid_v3` and
  `smart_jar_touch_lid_v1` are the same geometry. The STLs are byte-identical and
  the two STEP files carry the same points under different product names.
- **The STL is two solids merged.** The STEP holds two bodies — a cup and a cover
  — and the exported mesh is their union, which is a sealed chamber that cannot be
  printed in one piece. Separate the bodies in the CAD and export two parts.
- **The ESPHome config is truncated.** `bruh-sourdough-monitor.yaml` ends after the
  `color:` block. It has no `i2c:`, `spi:`, `sensor:` or `display:` section, so it
  will not compile as it stands, even though the API service and the debounce
  script both call `component.update: smart_jar_display`.

## Hardware

- ESP32 board with an integrated 3.5in 320×480 ST7796U touch panel
- SHT31-D temperature and humidity sensor (I²C, `0x44`)
- VL53L0X time-of-flight laser distance sensor for rise (I²C, `0x29`)
- 5 V over the board's own USB socket
- Printed lid: 121.2 mm across, 45.8 mm tall, 114.8 mm skirt bore, friction fit
  over a straight-sided 40 oz starter jar

The only pin named in the config is GPIO14, an LEDC output driving the display
backlight at 1000 Hz.
