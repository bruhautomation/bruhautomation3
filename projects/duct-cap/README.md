---
category: around-the-house
tags: [3d-print]
status: complete
---

# Duct Cap & Adapter

Three printed parts for 4 in round duct: an edge collar that clips onto a cut
pipe end, a vented cap that presses onto that collar, and a stepped sleeve that
joins a collared end to a plain one.

## What's in this folder

- `models/` — printable STLs
- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports
- `preview/` — preview meshes tessellated from the CAD (generated; the site's 3D viewer loads these)

`4_duct_adapter_and_cap_41df03f3_v8.stl` is the whole Fusion design exported in
one file. **Five solids, three of them parts.** Split to objects in the slicer
and delete the other two before printing:

| Solid | What it is | Print |
|---|---|---|
| Cap | 104.5 mm bore, 110.4 mm skirt, 124.8 mm across the lugs, 25.3 mm deep | yes |
| Adapter | 61 mm sleeve, 102.0 mm bore one end, 104.8 mm the other | yes |
| Collar | 104.6 mm OD, 98.6 mm ID, 11 mm tall, 0.95 x 7.2 mm groove on Ø101.4 | yes |
| Flat hex plate | 221 x 134 x 2 mm pattern body used to cut the honeycomb | no |
| Union tee | Vendor CAD for a Ø6 push-to-connect fitting, linked in as reference | no |

`quick_tee_v1.stl` is not a BRUH part. It is a set of manufacturer models for
push-to-connect union tees in Ø4, Ø6, Ø8, Ø10, Ø12 and Ø16 mm tube, laid out in
a row 434 mm long — reference geometry for laying out a run, not something to
print.

## Fits

The collar pushes onto the cut end of 4 in duct (101.6 mm OD) and leaves a
104.6 mm bead. The cap bore is 104.5 mm — a tenth of interference, so it presses
on and comes off by the four lugs. The adapter's large end is 104.8 mm, a slip
fit on the same bead; its small end is 102.0 mm, a slip fit over bare pipe.

Everything is inside half a millimetre, so print the collar first, measure it,
and apply the horizontal-expansion correction to all three parts.

## Hardware
- PETG for anything on a warm or sunlit run; PLA+ is fine on a cool interior one
- Aluminium foil tape to seal each joint — a printed sleeve is a mechanical
  joint, not an airtight one
- Two or three #8 x 1/2 in self-tapping screws through the adapter into the pipe
  if the joint is somewhere you can't get back to
- A push-to-connect union tee in the size your tube is, if you are using the
  cap's 12.2 mm centre port

Do not use the vented cap on a dryer exhaust termination — a screen at that
outlet packs with lint.
