---
category: home-automation
tags: [esphome, home-assistant, nextion, 3d-print]
status: active
---

# Nextion Touch Panel

Wall-mounted Home Assistant touch display: a 5-inch Nextion and an ESP32 in a
13.4 mm printed shell, with printed Decora plates to trim it into the wall.

## What's in this folder

- `models/` — print-ready STL files (these are what the site previews)
- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports
- `preview/` — preview meshes tessellated from the CAD (generated; the site's 3D viewer loads these)
- `nextion-hmi/` — the Nextion Editor project, drawn for 800×480
- `nextion-assets/` — artwork for the Nextion display (21 icons at 48×48, plus a 454×454 background)

The ESPHome config that sits between the display's UART and Home Assistant is
**not** in this folder. The page sets out everything the display expects from a
host — 921600 baud, the text variables, the touch events, `remote_dim` — so the
middle is yours to write.

## Hardware

- Nextion 5-inch HMI touchscreen, 800×480 (the HMI project is drawn for it; a
  3.5-inch NX4832K035 needs the pages laid out again and fits none of the prints)
- ESP32 dev board, 38-pin narrow — the bay in the back shell is 29.5 mm wide
- 5 V supply, four wires, and nothing else electrical
- Decora switch plate mounting

## Printed parts

Two front options, and they are alternatives: the two-part shell
(`nextion_5_inch_esp32_top_v1` + `_bottom_v1`, 169.6 × 88.5 mm, 13.4 mm deep
assembled) or the separate bezel (`nextion_display_5_cover_v7`). Plus oversized
1-gang and 2-gang Decora plates, a standard toggle plate, and
`bruh_light_switch_buttons_v1` — a CAD assembly of a Decora-format encoder/OLED
keypad, not a print-ready part.
