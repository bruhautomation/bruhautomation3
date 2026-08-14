---
category: mounts-enclosures
tags: [3d-print]
status: complete
---

# Pi Camera Mount

A bracket for a Raspberry Pi camera module and a printed clamp that snaps it
onto a 15 mm pipe, with a long ribbon running back to the Pi.

## What's in this folder

- `models/` — `cam_pipe_clamp_v2.stl`, the print-ready clamp
- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports. `cam_pipe_clamp_v2` is
  the clamp; `bruh_pi_2_camera_mount_v2` is the camera bracket, which is held in
  Fusion as a mesh body, so it has a `.f3d` and nothing else — a STEP export of
  it comes out empty

## The clamp, measured

- 15.0 mm bore, 18.0 mm outside diameter, 1.5 mm wall
- 57 mm long
- Wraps 305° of the pipe; the mouth is a 7 mm opening, so it snaps on
- Hinged cover on three links at 20 mm centres, riding on 1.6 mm rods that run
  the full length of the sleeve and the cover
- The STL is the assembly, not a print plate — the five bodies are interlocked
  where they sit when built

## Hardware

- Raspberry Pi (2 B through 4 B — the board mounting pattern is unchanged)
- Raspberry Pi Camera Module V2
- 18 in / 457 mm camera flex cable
- M2 screws for the camera board
- PETG for the clamp if it lives outdoors
