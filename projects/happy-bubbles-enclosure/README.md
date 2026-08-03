---
category: mounts-enclosures
tags: [3d-print]
status: complete
---

# Happy Bubbles Enclosure

A two-piece printed oval case for the Happy Bubbles Bluetooth presence detector.
No screws — the base's lip presses into the lid. 71 × 64 mm and 12.9 mm tall
assembled, with a 65.6 × 57.6 × 10.9 mm cavity inside.

Happy Bubbles the company is gone. The case is still useful because an ESP32
running ESPHome's Bluetooth proxy does the same job and fits in the same cavity —
with the caveats in `index.mdx`.

## What's in this folder

- `models/happy_bubbles_v12.stl` — both halves in one file, already arranged on
  the plate: base opening-up, lid face-down. Print as exported, no supports.

## Features in the model

- **Port notch** at one end of the oval, split across the seam. 12.4 mm wide ×
  7.2 mm tall, lower edge 3.2 mm above the interior floor.
- **LED window** through the lid, 3.0 × 5.2 mm, offset toward the port end.
- **Logo** debossed 0.23 mm into the outer face of the lid.
- **No internal standoffs, posts or screw bosses.** The board is held by the lid
  and whatever you stick it down with.

## Hardware

- Happy Bubbles Bluetooth Presence Detector (discontinued) or an ESP32 dev board
- 3D-printed case (the STL above)
- Micro-USB cable and a 5 V USB supply
- Foam tape to set the board's height under the port notch

## Watch out

The lip fit is 0.08 mm per side. Deburr the base's lip and the lid's inner rim
and knock off the elephant's foot before assembling.
