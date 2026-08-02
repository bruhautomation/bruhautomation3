---
category: home-automation
tags: [esphome, home-assistant, arduino]
status: active
---

# Neopixel Strip

An ESP8266 driving a run of addressable RGB strip — one Home Assistant light
entity with brightness, colour and a menu of per-pixel effects.

## What's in this folder

- `esphome/bruh-neopixel-strip.yaml` — the build to use today. ESP8266
  (`nodemcuv2`), `neopixelbus` light on **GPIO3** with `method: ESP8266_DMA`,
  `type: GRB`, `variant: 800KBPS`, `num_leds: 24`, ten effects. Status LED on
  GPIO2, WiFi signal sensor, status binary sensor, restart switch.
- `arduino-legacy/` — the original MQTT JSON light sketch, kept because it has
  animations ESPHome does not (candy cane, fire, lightning, police, ripple,
  juggle, cyclon rainbow, noise, confetti). FastLED on `DATA_PIN 5` (**D1**),
  `NUM_LEDS 186`, `COLOR_ORDER BRG`, topics `bruh/porch` and `bruh/porch/set`,
  OTA on port 8266. Needs ArduinoJson **5.x** — v6 removed the API it uses.

The two firmwares use different data pins and different colour orders. Wire for
the one you are going to flash.

## Hardware

- NodeMCU v2 (ESP8266)
- Addressable strip — 5 V WS2812B for short runs, 12 V WS2811 or WS2815 for long
  ones
- A supply matched to the strip's voltage, plus a 12 V-to-5 V buck module if the
  strip is 12 V and the board has to run off the same brick
- 470 Ω series resistor on the data line, 1000 µF capacitor across the strip's
  power at the first pixel
- Aluminium channel with a diffusing lens
- JST-SM 3-pin connectors, 20 AWG two-conductor wire, an IP65 project box

Full parts list, wiring table, assembly and troubleshooting are on the project
page.
