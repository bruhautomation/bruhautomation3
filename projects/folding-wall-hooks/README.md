---
category: around-the-house
tags: [3d-print]
status: complete
---

# Folding Wall Hooks

A 21 × 13 in slat panel with sixteen printed hooks that swing down into 4 in
pegs and fold flat back into the gaps between the boards. Two rows of eight, all
pivoting on two lengths of 1/4 in steel rod that run the full width of the panel.

## What's in this folder

- `cad/` — Fusion 360 source (`.f3d`) and STEP export
- `models/` — STL of the **whole assembly**, not a printable part
- `preview/` — preview mesh tessellated from the CAD (generated; the site's 3D viewer loads these)

## Reading the model

The STL is the complete panel: 33 bodies — 9 slats, 2 stiles, 4 backer rails,
2 pivot rods and 16 hooks. **Split to objects** in the slicer to pull out a
single hook.

The rods are drawn passing through solid hooks, so **there is no pivot bore in
the model**. Add a 6.6 mm hole on the pivot centre (9.65 mm from each face,
15.6 mm up from the heel end) before printing, or drill it afterwards.

## Bill of materials

- 11 pieces of 3/4 × 1-1/2 × 12 in stock — 9 slats and 2 stiles
- 4 backer rails, 19-1/2 × 1-1/4 × 3/4 in
- 2 × 1/4 in steel rod, cut to 21 in
- ~500 g of PLA+ or PETG for sixteen hooks
- Pocket screws for the frame; wood screws and wall anchors to hang it

## Key dimensions

| | |
|---|---|
| Panel | 21 × 13 in, standing 1-1/2 in off the wall |
| Slat centres | 2-1/4 in, leaving eight 3/4 in gaps |
| Rod centres | 41.9 mm and 207.0 mm above the bottom of a slat |
| Rod depth | 9.65 mm behind the front face |
| Hook swing | 60°, from vertical to 30° above horizontal |
| Hook reach | 98.4 mm in front of the slat face |

The stiles sit an inch higher than the slats, so their rod holes are 16.5 mm and
181.6 mm from their own bottom ends — not the same numbers as the slats.

The rails are never drilled. They are the stop the hook's heel bears against at
both ends of its swing.
