---
category: home-automation
tags: [esphome, home-assistant, 3d-print]
status: complete
---

# BRUH Playhouse

A servo-driven switch box built into a backyard cedar playhouse — five flip
lids, a bat-handle toggle, addressable strip lighting and DFPlayer audio on an
ESP32 — plus a separate ESPHome fan node.

**Build guide:** [bruhautomation.com/projects/playhouse](https://bruhautomation.com/projects/playhouse/)

## What's in this folder

- `cad/` — Fusion 360 source (`.f3d`) and a STEP export of the panel assembly
- `models/` — STL of the same assembly
- `esphome/` — three ESPHome configs (panel, mini, fan)

## The model

`smart_useless_box_box_mg995_copy_v2` is an **assembly**, not a print-ready
part. It contains the servos, the speaker, the LED strips and the toggle switch
alongside the plastic. Export the shell, the lids, the base plate and the arm
from the `.f3d` or `.step` before slicing.

Measured off the STL:

| Part | Size |
|---|---|
| Shell | 269 × 353 × 100 mm |
| Base plate | 260 × 344 × 3.5 mm |
| Lids (×5) | 71.5 × 59.7 × 8 mm, two columns, 60.7 mm pitch |
| Servo bays (×3) | 53.6 mm across the tabs, 20 mm wide |
| Speaker pocket | 52.5 mm square, 22.9 mm deep |
| LED channels (×2) | 13 mm wide, 2.5 mm deep, ~352 mm long |
| Toggle opening | 30 × 17 mm, lever 20 mm proud |
| Servo arm | 44 × 10 × 42.5 mm |

The shell is larger than a 256 mm bed. Split it, or print the mechanism and
build the outer box from ply.

## Hardware

- ESP32 (`board: esp32dev`, Arduino framework) ×2 — panel and fan
- Standard-size servos ×3 (the CAD component is an MG996R despite the file name)
- PCA9685 16-channel I²C servo driver
- DFPlayer Mini + microSD (FAT32) + 2-inch 4 Ω 3 W speaker
- Addressable RGBW strip, two runs
- Bat-handle toggle, monolever joystick, EC11 encoder, 22 mm buttons
- 5 V supply for the servo rail — **not** the ESP32's regulator
- PETG, M3 heat-set inserts

## Firmware status

`bruh-playhouse-fan.yaml` is complete: LEDC output on GPIO14 at 1 kHz driving a
`fan.speed` platform, plus `status_led` on GPIO2.

`bruh-playhouse.yaml` and `bruh-playhouse-mini.yaml` are shells — WiFi, API,
OTA, `status_led`, and (in the panel config) one restored global,
`s_toggle_1_top_max_pct`, which caps how far up its travel a servo arm may
swing. The servo, audio, light and input blocks are still to be written; the
hardware named in that file's header comments is intent, not configuration.
