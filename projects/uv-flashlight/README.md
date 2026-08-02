---
category: lab-science
tags: [3d-print]
status: idea
---

# UV Flashlight

A 365 nm UV inspection light for the bench — gel visualisation, contamination
checks, and finding what a spray bottle missed. Three 3 W COB emitters on 20 mm
star PCBs, a CC/CV buck module set to 450 mA, a switch, and an aluminium bar to
carry the heat. No microcontroller, no firmware.

**Build guide:** [bruhautomation.com/projects/uv-flashlight](https://bruhautomation.com/projects/uv-flashlight/)

## What's in this folder

Nothing yet — the write-up only.

The parts list, the series arithmetic, the current-setting procedure and the
thermal notes are all on the build page and are complete enough to build from.
What is missing is the printed body: there is no STL or CAD here, which is why
the page still carries `pending: true`.

This folder previously held `esphome/bruh-uv-sensor.yaml`, which was a copy of
the [UV sensor's](../uv-sensor/) config and had nothing to do with a flashlight.
It has been removed rather than left to mislead: there is no ESPHome config for
this build, and the `esphome` tag came off with it.
