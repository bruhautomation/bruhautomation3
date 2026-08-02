---
category: lab-science
tags: [arduino, laser-cut]
status: active
---

# Peristaltic Dosing Pump Controller

An Arduino and a laser-cut acrylic panel that drive an existing lab peristaltic
pump through its DB25 remote port. Dial a volume on the encoder, tap a
footswitch, and the controller integrates the pump's own speed feedback until
the dose is delivered.

**Build guide:** [bruhautomation.com/projects/peristaltic-dosing-pump](https://bruhautomation.com/projects/peristaltic-dosing-pump/)

## What's in this folder

- `firmware/BRUHpumpcontrollerV6/` — the Arduino sketch (Adafruit NeoPixel + DigitLedDisplay)
- `laser-cut/` — DXF and SVG cut files. `pump_controller_housing_v4` is the current
  panel; `pump_controller_front` is the older portrait design. `front_final`,
  `front_only_final`, `Sides` and `swirl_final` are a second, larger panel set.

## Hardware

- Arduino Nano (ATmega328P)
- KY-040 rotary encoder, 24-pixel RGBW LED ring, MAX7219 8-digit display
- Two momentary footswitches
- 2-channel relay module for pinch valves
- Boost module on the speed output, voltage divider on the speed feedback
- DB25 male connector to the pump's remote port
- 12 V supply plus a buck module for the 5 V rail
- 1/4 in white opaque acrylic panel

This is not a pump. The head, motor and tubing are the pump you already own.
