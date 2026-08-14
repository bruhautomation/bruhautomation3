---
category: lab-science
tags: [3d-print]
status: complete
---

# Centrifuge Shaker Mount

A printed rail that holds five 225 mL centrifuge bottles on their sides on an
orbital shaker platform. Bottles snap in from above; the rail bolts to the deck
with one M6 cap screw per half.

**Build guide:** [bruhautomation.com/projects/centrifuge-shaker-mount](https://bruhautomation.com/projects/centrifuge-shaker-mount/)

## What's in this folder

- `models/` — print-ready STL (both halves, in their assembled positions — run
  *split to objects* in the slicer before arranging)
- `cad/` — Fusion 360 source (`.f3d`) and STEP export

## The part

- 389 mm assembled, 59 mm deep, 20 mm tall, printed as two halves of ~199 mm
- Five cradles on an 80 mm pitch — 59 mm bore, 5 mm walls, 41.7 mm mouth, so a
  bottle snaps past the arms rather than dropping in
- The halves dovetail together through the middle cradle, so the bottle in
  position three sits across the seam and locks the joint
- One 6 mm hold-down hole per half, counterbored 10 mm on the cradle side for an
  M6 socket-head cap screw

## Hardware

- PETG, not PLA: the arms are permanently sprung by a snapped-in bottle, PLA
  creeps under a constant load, and the rail gets alcohol-wiped
- M6 × 16 mm stainless socket-head cap screws ×2, with blue threadlocker — a
  button head is 10.5 mm across and will not sit in the counterbore
- Print flat, as exported, so the arms flex along the extrusions and not across
  layer lines

Not autoclavable (PETG softens around 80 °C) and not sterilisable — an FDM part
is porous. It holds closed bottles and nothing else.
