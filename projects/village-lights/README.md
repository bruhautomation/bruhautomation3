---
category: around-the-house
tags: [3d-print]
status: prototype
---

# Village Lights

A printed Christmas village where every building has one 12 mm WS2811 bullet
pixel pressed into its base. One 12 V string does the wiring, one ESP drives it,
and an ESPHome partition light turns each pixel into its own entity — so the
church, the bakery and the toy shop are three lights in Home Assistant rather
than one strip.

**Build guide:** [bruhautomation.com/projects/village-lights](https://bruhautomation.com/projects/village-lights/)

## Hardware

- 12 V WS2811 12 mm diffused bullet pixel string — one node per building
- ESP32 (or a Wemos D1 mini), 12 V supply with a splitter, and an MP1495 buck
  set to 5 V to run the board off the same brick
- 470 Ω on the data line, 1000 µF across 12 V at the first node
- JST-SM 3-pin pigtails wherever two buildings sit further apart than the
  string's ~100 mm node pitch — those are also where the village comes apart for
  storage
- Matte brown/chocolate PLA for walls, black PLA+ for roofs and bases, clear PLA
  for window panes, matte white for snow
- 6 × 2 mm magnets, four per building, so the roof lifts off to reach the node

## Design notes

- **Walls opaque, windows clear.** A thin white shell glows all over and reads as
  a paper lantern. Three perimeters of an opaque colour and a black roof keep the
  light in, so it only escapes at the openings.
- **Roof as a separate part.** Prints flat with no supports, takes a different
  colour without a filament change, and lifts off on magnets to get at a dead
  pixel.
- **12 mm hole in the base**, opened with a needle file rather than reprinted, and
  enough height inside that the node sits back from the window instead of against
  it.
- **Node order is pixel order.** Write the number under each base as you thread
  the string.
- PETG instead of PLA if the mantel is above a fire that gets lit.

## Status

Prototype. The STLs and the ESPHome config are not in this folder yet — the build
guide covers the lighting, print settings, wiring and the config to write.
