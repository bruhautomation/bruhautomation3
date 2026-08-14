---
category: workshop-garage
tags: [3d-print]
status: complete
---

# Honda Cupholder

A two-part printed mount for a Honda interior: a slotted bracket that takes the
load, and a small barbed rail key that snaps into a pocket in the bracket's top
edge and locks it in place. No fasteners — nothing in either part is threaded,
counterbored or tapped.

**Build guide:** [bruhautomation.com/projects/honda-cupholder](https://bruhautomation.com/projects/honda-cupholder/)

## What's in this folder

- `models/` — print-ready STLs
  - `honda_cup_holder_holder_v2.stl` — the bracket. 130 × 138.5 × 21.5 mm
  - `honda_cup_holder_rail_v1.stl` — the rail key. 18 × 12.9 × 16 mm
- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports, for editing the design

## Dimensions

Bracket:

- Plate 130 × 122.5 mm, 21.5 mm thick, shelled to a 2 mm skin over a hollow core
- Slot 30.0 mm wide, cut 75 mm into one long edge to a 15 mm radius end, through
  the full thickness
- Five Ø25 mm holes on a 45 × 40 mm grid; the slot sits on the sixth position of
  the same grid
- Tongue below the slot edge: 16 mm long, 21.5 mm across, 9.5 mm at the root
  tapering to 5.5 mm
- Pocket at the other end of that edge: 19.5 mm wide inside, 16.5 mm at the
  mouth, 10 mm deep in plan, 12.5 mm down from the top face, with a 2.7 mm slit
  in its inboard wall

Rail key:

- Body 15.5 × 10.4 mm, 18.0 mm across the barbs, 16 mm tall
- 2 mm fin on one side, keying into the bracket's 2.7 mm slit
- Top 5 mm tapers from 10.4 mm to 4.5 mm across; 3.5 mm of it stands proud of
  the bracket once seated

Model volumes: 127 cm³ for the bracket, 1.5 cm³ for the key.

## Fit

The slot, the tongue and the ridge on the key are all cut to one specific Honda
interior. Measure yours before printing — the slot width is the dimension with
no slack in it.

## Hardware

None. Two printed parts.

**Print them in PETG, not PLA.** A parked car's interior passes 60 °C in summer,
which is where PLA starts to creep. Print the bracket standing on its pocket end
— laid flat, the hollow core becomes a 100 mm internal bridge that no slicer
will make.
