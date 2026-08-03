---
category: home-automation
tags: [esphome, home-assistant]
status: active
---

# Sonoff S31

A Sonoff S31 smart plug reflashed with ESPHome, so it reports real voltage,
current and power to Home Assistant locally and never talks to a vendor server.

The S31 has a **CSE7766** metering chip on the mains side, which is what
separates it from every plug that only estimates. The S31 **Lite** is the same
shell without that chip — it cannot be made to meter, so check which one you
bought.

## What's in this folder

- `esphome/sonoff-s31.yaml` — the ESPHome configuration

## Hardware

- Sonoff S31 (not the S31 Lite)
- ESP8285 on the `esp01_1m` board profile, `board_flash_mode: dout`
- CSE7766 power metering, read over the hardware UART on `RX` at 4800 baud, even parity
- Relay on GPIO12, LED on GPIO13 (inverted, PWM), button on GPIO0
- 3.3 V USB-to-TTL serial adapter, for the first flash only

## Notes

- The button toggles the LED in this config, not the relay.
- GPIO13 is declared twice — as the PWM output and as `status_led:`. Delete one.
- Add `logger: baud_rate: 0`; the logger and the CSE7766 both want the UART.
- Power is reported, energy is not. Add a `total_daily_energy` sensor for the
  Energy dashboard.

The full write-up, wiring table and flashing procedure are on the project page.
