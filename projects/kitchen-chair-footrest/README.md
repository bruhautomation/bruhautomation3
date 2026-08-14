---
category: around-the-house
tags: [3d-print]
status: complete
---

# Kitchen Chair Footrest

A printed bracket that slides onto a 1 inch square chair leg and locks at any
height on a single M6 bolt, giving a child at the dinner table somewhere to put
their feet. One bracket per leg — print two and put one on each front leg.

201 × 182 × 53 mm overall. The platform is 200 × 180 mm and 8 mm thick, with
three corners on a 50 mm radius and the fourth cut off at 45° where the leg
passes through. The socket is a 25.4 mm square running the full 53 mm, snug for
its top 20 mm and relieved to about 34 mm below that, so the bracket bears on the
leg in two places rather than along a sloppy sleeve.

## What's in this folder

- `models/` — the printable STL
- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports

## Hardware

- M6 × 40 mm hex socket cap screw, one per bracket
- M6 plain hex nut, 10 mm across flats, 5 mm thick — presses into the 9.8 mm
  pocket in the bottom face and stays captive
- ~300 g of filament a bracket. PLA+ indoors, PETG anywhere hot

## Printing

Flip it so the flat top of the platform sits on the bed and the collar points up.
The part is then a spire that narrows as it climbs and needs no supports
anywhere; the only bridge in it is the 5.9 mm clamp hole. 0.2 mm layers, 5 walls,
30% infill.

The clamp hole is drawn at 5.9 mm for a 6.0 mm bolt — ream it with a 6 mm bit by
hand. The socket is drawn at nominal 25.4 mm with no clearance, so deburr both
ends before trying to fit it.

**Only a 25.4 mm square leg fits.** Don't rescale the part to suit a different
leg — it moves the platform off the bed and opens the nut pocket up until the nut
spins. Change the socket sketch in the `.f3d` instead.
