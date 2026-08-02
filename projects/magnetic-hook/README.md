---
category: around-the-house
tags: [3d-print]
status: complete
---

# Magnetic Hook

A printed closed hook that screws onto the M6 stud of a rubber-coated neodymium
magnet. Sticks to anything ferrous, comes off without a hole or a glue mark, and
the arm returns to within 27 mm of the mounting face so a load cannot slide off.

57.5 × 15 × 60 mm. Blind 6 mm stud bore, 16 mm deep, with a side-entry hex
pocket 10 mm across flats that captures an M6 nut 5 mm above the pad face.

## What's in this folder

- `models/` — the printable STL
- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports
- `preview/` — preview meshes tessellated from the CAD (generated; the site's 3D viewer loads these)

## Hardware

- M6 stud magnet base, rubber-coated (40 lb class)
- M6 hex nut, 10 mm across flats — plain (5 mm) or nyloc (6 mm), the pocket is 6 mm deep
- ~20 g of filament. PLA+ indoors, PETG anywhere warm

## Printing

Lay the part on the face the nut slot opens through, 15 mm tall. Every wall in
the profile is then vertical — no supports — and the layers run along the arch
instead of across the root of the arm. 0.2 mm layers, 5 walls, 40% infill.

**The STL carries a stray 10 × 5.4 × 5 mm block over the mouth of the nut slot**
(`Body3` in the CAD — the tool body that cut the slot). Delete it, or subtract it
in the slicer with a negative volume, before printing. Left in, it walls the slot
off and the nut will not go in.

Both fits are drawn at nominal — 6.0 mm bore for a 6.0 mm stud, 10.0 mm pocket
for a 10.0 mm nut. Ream the bore with a 1/4 in (6.35 mm) bit and file the pocket
walls if the nut is tight.
