---
category: around-the-house
tags: [3d-print]
status: complete
---

# Fridge Drawer Support

A printed shim that lifts a dropped refrigerator drawer back onto its rail.

The part is a flat bar **228 mm × 18 mm × 2 mm**. The underside is the full flat
rectangle and sits on the ledge; the entire top perimeter is rolled over with a
2 mm bullnose — the same radius as the thickness, so the upper face is all curve
and has no shoulder for the drawer to catch on. No holes, no fasteners. It is
held down with a strip of 12.7 mm VHB tape.

Print two, one per side. Lifting only one side racks the drawer.

## What's in this folder

- `models/` — printable STL
- `cad/` — Fusion 360 source (`.f3d`) and STEP export
- `preview/` — preview meshes tessellated from the CAD (generated; the site's 3D viewer loads these)

## Printing

PETG, flat as exported, no supports, 100% infill, brim. 0.15 mm layers keep the
bullnose smooth. Roughly 10 g per bar.

228 mm will not fit a 220 × 220 bed along an axis — rotate it 45° on the plate.

## Fitting it to your fridge

228 / 18 / 2 are the run length, the ledge width and the amount of drop for one
particular drawer. Measure yours and edit the STEP, or scale the X axis only —
uniform scaling changes the lift and the width along with the length.
