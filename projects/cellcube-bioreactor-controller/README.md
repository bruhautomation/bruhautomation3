---
category: lab-science
tags: [arduino, nextion, laser-cut, 3d-print]
status: active
---

# Cellcube Bioreactor Controller

A motorised tilt stand and fluidics panel for a CellCube module. A NEMA 23
stepper turns the stand through a 50:1 worm reducer onto a 1 in shaft, roller
limit switches define the ends of travel, and a Nextion Enhanced touchscreen
with a footswitch under each foot drives both the tilt and a volume-dosing
peristaltic pump.

**Build guide:** [bruhautomation.com/projects/cellcube-bioreactor-controller](https://bruhautomation.com/projects/cellcube-bioreactor-controller/)

## What's in this folder

- `models/` — print-ready STL files (these are what the site previews). Drive
  brackets on the NEMA 23 bolt pattern, shaft adapters, limit-switch mounts and
  cams, tilt indicators, pinch valves, retainer clips and enclosures. Most files
  are revisions; the highest-numbered one is the one that shipped.
- `laser-cut/` — DXF cut files for 1/4 in acrylic: the fluidics panel and its
  sides (with and without fan cutouts), the CellCube end cap, and the pump
  mounting profile. Note the filenames read `fludics`, not `fluidics`.
- `nextion-hmi/` — seven Nextion display projects. The six
  `cc_stand_nextion_display_footswitch*` files are one 480×320 design iterating;
  the `_float` pair adds decimal volumes. `nextion_10inch_dev_2` is the larger
  second-generation panel with the animated fluid path, driven by an ESP32.

## Hardware
- NEMA 23 stepper, NMRV-030 50:1 worm gearbox, 6.35 mm to 11 mm shaft sleeve
- Roller-lever limit switches at both ends of travel
- Nextion Enhanced 3.5 in NX4832K035 with the IO expansion board; two footswitches
  on the display's own GPIO (IO3 right, IO4 left)
- Peristaltic pump driven over the `/1`-addressed serial command set
  (`/1V…R`, `/1P…D…R`), 51,200 microsteps per revolution
- Printed pinch valves on the media lines
- 2020 extrusion frame with laser-cut acrylic panels
- Cole-Parmer Masterflex pump integration

## Not in this folder

The controller firmware that sits between the display's UART and the motors.
The HMI projects define the whole protocol, so what it has to do is documented
on the build guide — but it isn't published here yet.
