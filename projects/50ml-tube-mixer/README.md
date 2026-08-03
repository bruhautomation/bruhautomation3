---
category: lab-science
tags: [3d-print, arduino]
status: prototype
---

# 50mL Tube Mixer

Motorised end-over-end mixer for 50mL tubes. A printed cup holds the tube on a
two-servo gimbal: one servo swings it through the inversion, the other rotates
it about its own axis. An ESP32 drives both, an OLED shows the speed and a
rotary encoder sets it.

**Build guide:** [bruhautomation.com/projects/50ml-tube-mixer](https://bruhautomation.com/projects/50ml-tube-mixer/)

## Hardware

- ESP32 dev board, 0.96" I2C OLED, KY-040 rotary encoder
- 2 × MG996R metal-gear servos in a two-axis (pan/tilt) yoke
- 12 V supply stepped down to a 6 V servo rail and a 5 V logic rail
- 3D-printed tube cup, yoke and electronics deck

## Not in this folder yet

- The STLs for the cup, yoke and deck
- The firmware sketch
