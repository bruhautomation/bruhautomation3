---
category: mounts-enclosures
tags: [3d-print]
status: complete
---

# Vinyl Mounting Block

A printed pad that gives a light, a camera or an outlet one flat, plumb face on
vinyl siding. The back is stepped to the siding profile; the front is a plate
drilled to the fixture-screw pattern of a 4 in round box.

200 mm tall × 190 mm wide, 7.3–20 mm thick, Ø55 mm wire bore through the middle.
Drawn for **5 in exposure with a 1/2 in lap** (D5, "double 5"). It does not fit
D4, D4.5, D6 or D7 — measure the wall before printing.

## What's in this folder

- `models/` — STL of the **whole assembly**, not a printable part
- `cad/` — Fusion 360 source (`.f3d`) and STEP export
- `preview/` — preview mesh tessellated from the CAD (generated; the site's 3D viewer loads these)

## Reading the model

`siding_block_v3.stl` holds three solids and only one of them is the part:

| Solid | What it is | Print |
|---|---|---|
| The block | 200 × 190 mm pad, stepped back, Ø55 mm bore, six Ø5.2 mm holes | yes |
| 4 in round weatherproof box | Ø101.6 mm barrel, five 3/4 in NPT hubs, two lugs — a manufacturer's model dropped in to check the screw pattern | no |
| Two Ø4.83 × 12.5 mm cylinders | thread bodies from two of that box's tapped holes | no |

**Split to objects will not separate them.** The block's six clearance holes and
the box's six tapped holes are drawn on the same six circles on the same plane,
so the meshes are stitched together there and a slicer sees one body. Open the
STEP or the `.f3d`, delete the box, export the block on its own.

## The back

Three flat ramps at 1 in 10, separated by two 12.7 mm (1/2 in) steps 127.0 mm
(5 in) apart. The steps face upward and tuck under the butt edge of a siding
panel, which is the part's only alignment feature: push it up the wall until
both ledges bite.

## The hole pattern

Six Ø5.2 mm through holes, all centred on the pad:

- 88.9 mm (3-1/2 in) apart vertically
- 88.9 mm (3-1/2 in) apart horizontally
- 69.85 mm (2-3/4 in) apart horizontally

Standard 4 in round / octagon box fixture and cover spacings. The Ø55 mm bore
passes wiring only — it is smaller than the box's Ø96.5 mm mouth, so a device
cannot be fed through it.

## Print

- Front face flat on the plate, no supports, nothing overhangs
- 0.2 mm layers, 4 walls, 15% infill — about 450 cm³ of model, roughly 175 g
- ASA outdoors; PETG if the printer is open-framed. Not PLA

## Hardware

- 4 in round weatherproof box (3/4 in NPT hubs) — bought, not printed
- Machine screws long enough to add the pad's thickness to the fixture's stack
- Butyl behind the top edge and sides; nothing along the bottom edge
