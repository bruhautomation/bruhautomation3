---
category: home-automation
tags: [esphome, home-assistant, 3d-print]
status: complete
---

# Smart Candle

An oil candle that lights and snuffs itself on command from Home Assistant. Two
copper tubes arch over the wick and do both jobs — an arc jumps between their
tips to light it, and a diaphragm pump blows through one and draws through the
other to put it out.

**Build guide:** [bruhautomation.com/projects/smart-candle](https://bruhautomation.com/projects/smart-candle/)

## What's in this folder

- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports
- `preview/` — preview meshes tessellated from the CAD (generated; the site's 3D viewer loads these)
- `esphome/` — ESPHome configuration (`bruh-candle.yaml`)
- `images/` — photos and diagrams

## Models

`candle_legs_v2` is one part, 150 × 90 × 25 mm: a U-shaped base with 5 mm arms,
open at the back, with a 2 mm front shelf carrying a 16.5 mm centre hole and two
7 mm holes 30 mm either side of it. Print in PETG — it sits under an open flame.

## Hardware

- ESP32 board with a 1.14 in ST7789 LCD (T-Display pinout), running ESPHome
- USB-rechargeable plasma arc lighter, fired through an opto-isolated relay
- 5 V diaphragm vacuum pump with separate inlet and outlet, on a second relay
- Two 3/16 in copper tube arches — arc electrodes and air ducts at once
- Fixed-wick oil candle plus clean-burning lamp oil
- LiPo cell, boost module, two momentary buttons and a latching arming switch

Full bill of materials with links on the build guide.
