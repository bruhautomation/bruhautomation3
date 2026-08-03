---
category: home-automation
tags: [3d-print]
status: idea
---

# Laser Turret

Pan-tilt laser turret for entertaining the cat, driven by an ESP32 on ESPHome so
the play pattern comes from a Home Assistant automation rather than a fixed sweep.

**Concept stage.** No STLs, no CAD and no firmware yet — the folder holds concept
renders. The parts are decided, though, and the write-up lists them.

## The build, in short

- **Pan/tilt bracket** cut for standard-size servos, with two **MG996R** metal-gear
  servos in it
- **650 nm 5 mW red laser diode module**, switched low-side through a MOSFET module
  so it never hangs off a GPIO
- **ESP32 DevKit** (38-pin) — hardware LEDC PWM, so the servos don't twitch
- **12 V 4 A supply** feeding two bucks: 6.0 V for the servos, 5.0 V for the ESP32
  and the laser. Servos never come off the board's regulator
- A printed base, which is the part still to be designed

## What's in this folder

- `images/` — concept renders

## Still to do

- Printed base with the bracket's bolt pattern, a laser barrel mount and a
  **physical** tilt-axis end stop so the beam cannot reach eye level
- ESPHome config: two `servo` outputs, the laser switch, and a pattern generator
