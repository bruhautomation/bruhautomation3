---
category: home-automation
tags: [3d-print, home-assistant]
status: prototype
---

# Dog Treat Dispenser

Treats stack in a printed column, a servo pulls a slide at the bottom, one
biscuit falls out. Triggered from Home Assistant.

## What's in this folder

- `models/` — print-ready STL files (these are what the site previews)
  - `dog_treat_dispenser_1.stl` — the magazine column

The gate, the servo mount and the outlet chute are not modelled. They were built
to suit the wall the dispenser lives on, so the write-up stays flagged as
unfinished until they are.

## The column, measured off the STL

- 67 × 34 mm outside, 245 mm long, corners rounded 2 mm
- 2.0 mm wall throughout, so the bore is 63 × 30 mm
- Open at both ends
- A 10 mm slot cut through one 67 mm face, running 228 mm from one end
- 17 mm of unbroken tube at the other end — that end goes at the bottom, and it
  is where the gate runs

Print it standing on end: no overhangs, no bridge across the bore, and five
walls at 0.4 mm add up to exactly the 2 mm wall, so it needs no infill.

## Hardware

- ESP32 or ESP8266 with one free GPIO
- MG90S metal-gear micro servo (not the plastic-gear SG90 — it stalls on a
  wedged treat and strips)
- 5V supply the board and the servo share
- Optional: a VL53L0X down the tube for a treats-remaining reading

Full parts list with links, print settings and wiring are on the project page.
