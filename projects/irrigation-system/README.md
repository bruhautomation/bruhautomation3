---
category: home-automation
tags: [esphome, home-assistant, 3d-print]
status: active
---

# Irrigation System

Seven-zone ESP32 irrigation controller running about 1500 ft of drip tubing,
with a hall-effect flow meter on every zone, manifold pressure, water
temperature and TDS, and metered fertiliser injection.

**Build guide:** [bruhautomation.com/projects/irrigation-system](https://bruhautomation.com/projects/irrigation-system/)

## What's in this folder

- `esphome/bruh-pump.yaml` — the full controller (ESP32, `board: esp32dev`)
- `esphome/bruh-pump-s3.yaml` — ESP32-S3 variant; valves and the three injector
  meters only, no per-zone flow and no analog sensors
- `cad/` — Fusion 360 sources (`.f3d`) and STEP exports. `backyard_v2` and
  `garden_sketch_v6` are layout sketches, not parts
- `models/` — printable STLs: the air-injector drill guide and the timer
  indicator disk
- `preview/` — preview meshes tessellated from the CAD (generated; the site's 3D
  viewer loads these)

## Hardware

- **Board:** ESP32 dev board (`esp32dev`)
- **ADC:** ADS1115 at `0x48` — manifold pressure on A0, TDS on A1, thermistor
  divider on A2
- **I/O expander:** PCF8575 at `0x27` (declared under ESPHome's `pcf8574:`
  component with `pcf8575: true`) — seven zone relays plus the pump and
  fertiliser valves on pins 0–6, 14 and 15
- **Flow:** ten hall-effect pulse meters — seven zones, the manifold, and one
  either side of the EZ-FLO injector
- **Analog:** 0–80 psi pressure transducer, 10 kΩ B3950 NTC probe, TDS probe
- **Valves:** seven zone valves plus a pump water valve and a fertiliser output
  valve, switched by a 16-channel relay board
- **Box light:** 12 V COB panel on GPIO18 via LEDC PWM

## Known quirks

- `Z5 Flow` reads `${zone_6_pulse}` and `Z6 Flow` reads `${zone_5_pulse}` — the
  two flow inputs are crossed relative to the zone switches.
- The `zone_N_name` substitutions and `manifold_sensor_power` are defined but
  never referenced.
- The TDS conversion lambda multiplies by 3 and 2 where the standard curve cubes
  and squares, so it is linear. The downstream two-point `calibrate_linear`
  absorbs most of it.
