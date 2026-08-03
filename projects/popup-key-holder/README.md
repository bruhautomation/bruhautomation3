---
category: around-the-house
tags: [3d-print]
status: complete
---

# Popup Key Holder

Spring-loaded key holder. Two printed panels pivot on pins either side of a
central post; a spring-loaded slider running on that post drives both of them
together. Press the panels flat, drop your keys between them, let go, and the
spring shuts them and lifts the keys about 60 mm back up to hand height.

## What's in this folder

- `models/` — `popup_key_holder_v7.stl`, the **whole assembly in one mesh**, in
  the assembled position. Split it to objects before slicing; it is a viewer
  file, not a print file
- `cad/` — Fusion 360 source (`.f3d`) and a STEP export
- `preview/` — preview mesh tessellated from the CAD (generated; the site's 3D
  viewer loads these)

## Parts in the model

| Part | Notes |
|---|---|
| Base and post | 80 × 80 × 2.4 mm plate, 5 mm dia post 95.6 mm tall, 10 mm dia head |
| Slider | 30 mm dia × 54.0 mm, 6 mm bore on the post, 9 mm spring seat |
| Arm ×2 | 80 mm wide, 2.4 mm thick, 5 mm pivot bore, near-mirrors |
| Pin ×2 | 3 mm dia × 80 mm, steel |
| Stray body | `Body10`, a 1.95 × 16.3 × 85 mm slat with no counterpart — delete it |

Assembled and shut: 80 × 80 × 119.4 mm.

## Hardware

- Compression spring, 9 mm OD, over 5 mm ID, about 45 mm free length
- 3 mm (or 5 mm — see below) steel rod for the two hinge pins, 80 mm each
- Rubber bumpers or VHB tape under the base plate

## Known gaps in the CAD

- **The hinge pins have nothing to mount to.** They float 51.3 mm above the base
  plate, 67.0 mm apart, with no uprights or bearing blocks modelled. Those are
  yours to draw
- **The pivot bores are 5 mm and the pins drawn through them are 3 mm.** Use
  5 mm rod, or take the bores to 3.2 mm before you print
- No spring, no latch and no key hooks are modelled
