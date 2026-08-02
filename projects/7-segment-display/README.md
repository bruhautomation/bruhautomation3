---
category: home-automation
tags: [esphome, home-assistant, 3d-print]
status: complete
---

# 7-Segment Display

An ESP32 driving a MAX7219 8-digit seven-segment module, in a printed desk wedge,
showing any numeric Home Assistant entity. The value is pushed down over the
ESPHome native API — no MQTT, no polling.

## What's in this folder

- `models/` — print-ready STL files (these are what the site previews)
- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports
- `preview/` — preview meshes tessellated from the CAD (generated; the site's 3D viewer loads these)
- `esphome/` — ESPHome configuration

`esp32_7seg_body.stl` and `esp32_7seg_back.stl` are the two parts you print.
`esp32_7_seg_v3.stl` is the assembled preview mesh.

## Hardware

- ESP32 dev board (ESP-WROOM-32); the config's `board:` key is `nodemcu-32s`
- MAX7219 8-digit 7-segment display module (`num_chips: 1`)
- Five female-to-female jumpers, a micro-USB lead and a USB charger

## Wiring

| MAX7219 | ESP32 | Config key |
|---|---|---|
| VCC | VIN / 5V | — |
| GND | GND | — |
| DIN | GPIO22 | `spi:` → `mosi_pin` |
| CS | GPIO23 | `display:` → `cs_pin` |
| CLK | GPIO21 | `spi:` → `clk_pin` |

## Case

The body is 87 × 28 × 22 mm with a 66 × 16 mm window leaning back at 43°. The only
opening is a 22 × 25.5 mm hatch at one end of the base, closed by the 2 mm plug-fit
lid — everything is installed through it, lengthwise, into an 85 mm cavity. There
is no cable hole in the model; notch the lid for the USB lead.

Full write-up: `index.mdx`.
