---
category: home-automation
tags: [3d-print, home-assistant]
status: prototype
---

# Dog Treat Dispenser

Treats stack in a printed column with a closed floor, a servo pushes the bottom
one out through a gap in the side. Triggered from Home Assistant.

## What's in this folder

- `models/` — print-ready STL files (these are what the site previews)
  - `dog_treat_dispenser_1.stl` — the magazine column

The pusher, the servo mount and the catch tray are not modelled. They were built
to suit the wall the dispenser lives on, so the write-up stays flagged as
unfinished until they are.

## The column, measured off the STL

- 67 × 34 mm outside, 245 mm long, corners rounded 2 mm
- 2.0 mm wall throughout, so the bore is 63 × 30 mm
- One end is the full 63 × 30 bore, wide open — that is the top, and it is how
  you load it
- The other end is a solid 2 mm plate — the floor a biscuit rests on
- The 15 mm above that floor has no front wall and no side walls, so the bottom
  treat is open on three sides. That is the outlet, and a pusher shoves one
  biscuit out through it
- A 10 mm window down the centre of the front face, starting 17 mm above the
  base and running 228 mm off the open top

Print it lying flat on the back face — the unbroken one, opposite the window.
It is the only face that runs the full 245 mm, and the window splits the front
face into two 26.5 mm bridges instead of one 63 mm span. Five 0.4 mm perimeters
and five 0.2 mm top and bottom layers both add up to the 2 mm wall, so it needs
no infill. It wants a 245 mm bed; on a 220 mm one, stand it on the closed base
and support the first 17 mm.

## Hardware

- ESP32 or ESP8266 with one free GPIO
- MG90S metal-gear micro servo (not the plastic-gear SG90 — it stalls on a
  wedged treat and strips)
- 5V supply the board and the servo share
- Optional: a VL53L0X down the tube for a treats-remaining reading

Full parts list with links, print settings and wiring are on the project page.
