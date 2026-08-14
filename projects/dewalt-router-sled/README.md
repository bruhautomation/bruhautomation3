---
category: workshop-garage
tags: [3d-print]
status: complete
---

# DeWalt Router Sled

A router sled for flattening slabs wider than a planer will take: two rails
either side of the slab, a bridge across them, and a DeWalt DWP611 hanging from
the base plate in this folder.

The plate copies the DWP611's stock sub-base — same 103 mm outline, same bit
opening, same hole patterns — at 6.35 mm (1/4 in) instead of the 4.35 mm plate it
replaces, so the router is not flexing its own base through the cut.

## What's in this folder

- `models/` — the printable base plate (STL)
- `cad/` — Fusion 360 source (`.f3d`) and a STEP export, if you would rather cut
  the plate from 1/4 in polycarbonate than print it

The file name carries an old Fusion design name. There is one part in it and it
is the base plate.

## Key dimensions

- Outline: 103.0 mm circle squared off at one end, 123.2 mm overall
- Thickness: 6.35 mm
- Bit opening: 37.9 mm — **a cutter wider than this will not pass through the
  plate**, so use a 1/4 in shank surfacing bit of 1-1/4 in or less
- Four arc slots on a 63.0 mm bolt circle: the router's sub-base screws
- Four 6.35 mm holes on a 60.96 mm (2.4 in) square, counterbored: the sled bridge

## Hardware

- DeWalt DWP611 compact router (1/4 in collet)
- 1/4 in shank slab-flattening bit
- 2020 aluminium extrusion for the rails and the bridge
