---
category: lab-science
tags: [3d-print, arduino]
status: prototype
---

# Pipette Controller

A cordless, pump-driven controller for serological pipettes — the electronic
pipette aid, built at the price of the thumbwheel pump it replaces. Two mini
diaphragm pumps (one plumbed to aspirate, one to dispense) meet at a Y splitter
and a membrane filter; two buttons drive them under PWM, a dial sets the speed
ceiling, and the whole thing sits in a printed body that grips the pipette and
stays in one hand.

**Build guide:** [bruhautomation.com/projects/pipette-controller](https://bruhautomation.com/projects/pipette-controller/)

## Hardware

- 2 × mini 5–6 V diaphragm pump, joined by a 1/8 in barbed Y into one 3/16 in
  airline running to the pipette
- A 0.45 µm hydrophobic membrane filter at the nose end of that line — the only
  thing between the culture and the pump, and a consumable
- Dual-channel MOSFET trigger module, driven with PWM rather than switched, so
  the pumps have a throttle instead of an on switch
- ESP32 board with a 1.14 in colour LCD, two momentary buttons and a KY-040
  rotary encoder for the speed ceiling
- Single 3.7 V LiPo cell, TP4056 charger and a boost converter set to 5 V — the
  pumps are 5–6 V parts and sag badly straight off a cell
- Printed body and button caps: PETG for the shell (daily alcohol wipes), TPU
  for the nose insert so one nose grips 10 mL and 25 mL pipettes

The air never touches printed plastic. A printed duct leaks through its infill,
so the nose takes a barb and tubing carries the air the whole way.

## Not in this folder yet

- The STLs for the body, nose and button caps
- The firmware sketch
