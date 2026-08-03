---
category: lab-science
tags: [3d-print, arduino]
status: complete
---

# 96-Well Plate Inverter

Motorised inverter for assay plates. Clamp a plate in the printed cradle, press
the button, and a servo sweeps it through 180° over a waste tray, holds while it
drains, and brings it back — the same flick every time, slow enough that nothing
crosses between columns.

**Build guide:** [bruhautomation.com/projects/96-well-plate-inverter](https://bruhautomation.com/projects/96-well-plate-inverter/)

## Hardware

- MG996R standard-size metal-gear servo driving one trunnion
- 608-2RS bearing on the idle trunnion
- Arduino Nano (or an ESP32, if you want it in Home Assistant) and one momentary button
- 12 V brick into two MP1495 step-downs — 6 V for the servo, 5 V for the board; the servo never runs off the board's regulator
- 3D-printed cradle in PETG, frame in PLA+, clamp pads in TPU
- M3 heat-set inserts throughout

The rotation axis runs through the middle of the plate, not under it. Balanced
that way the servo carries almost nothing; underslung, the plate's mass sits
above the pivot, gravity drags the sweep over faster than it was commanded, and
that is what splashes.
