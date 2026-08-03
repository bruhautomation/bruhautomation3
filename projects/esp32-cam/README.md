---
category: home-automation
tags: [esphome, home-assistant]
status: active
---

# ESP32-CAM

An all-in-one ESP32 camera node running ESPHome: OV2640 camera, 0.96in OLED
status display, PIR motion and a button — all on one board, nothing to wire.

## What's in this folder

- `esphome/bruh-esp32-cam.yaml` — the ESPHome configuration

## Hardware

The config is written for a **TTGO T-Camera** (ESP32-WROVER-B with PSRAM,
OV2640, onboard 0.96in SSD1306 and PIR). It is *not* for the AI-Thinker
"ESP32-CAM" — that board uses a different camera pinout and has no display,
PIR or button.

| Function | GPIO |
|---|---|
| Camera XCLK | 32 (20 MHz) |
| Camera SCCB SDA / SCL | 13 / 12 |
| Camera data D0–D7 | 5, 14, 4, 15, 18, 23, 36, 39 |
| VSYNC / HREF / PCLK | 27 / 25 / 19 |
| OLED I2C SDA / SCL | 21 / 22 |
| PIR | 33 |
| Button | 34 |

The camera's SCCB bus and the OLED's I2C bus are separate on purpose.

## Notes

- PSRAM is required for the 640x480 framebuffer, which is why this has to be a
  WROVER-class module.
- `Roboto-Medium.ttf` must sit beside the YAML — the `font:` block references it
  by bare filename, and a missing font fails the compile.
- Secrets used: `wifi_ssid`, `wifi_password`, `api_key`, `ota_password`,
  `ap_password`.
- The display lambda prints `"Hello World!"` — a placeholder to replace with
  imported Home Assistant values.

Full write-up: https://bruhautomation.com/projects/esp32-cam/
