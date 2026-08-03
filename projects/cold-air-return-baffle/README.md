---
category: around-the-house
tags: [3d-print]
status: complete
---

# Cold Air Return Baffle

HVAC baffle that redirects a cold air return. It fits in the sheet-metal throat
behind the grille, so nothing shows once the grille is back on.

## What's in this folder

- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports

`bruh_cold_air_return_baffle_v2.f3d` is the file to open. The STEP beside it
exported without geometry — 3.5 KB of product metadata and no solid — which is
why there is no `models/` STL and no generated `preview/`. Open the Fusion
archive, drive the sketch off your own return, export your own STL.

Return openings are not standardised, so the part is meant to be resized rather
than printed as-is. Measure the duct throat behind the grille, not the grille's
outer flange.

## Hardware
- 3D-printed baffle (PLA+ on a normal return; PETG if the run goes through an
  attic or sits near the furnace plenum)
- Foil tape to seal the baffle's edges to the boot
- Two or three #8 x 1/2 in self-tapping screws, VHB tape, or press-fit 6 x 3 mm
  magnets — whichever suits how permanent you want it
