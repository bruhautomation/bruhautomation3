---
category: home-automation
tags: [esphome, home-assistant]
status: active
---

# Voice Assistant

M5Stack Atom Echo flashed with ESPHome — a voice satellite for Home Assistant's
Assist pipeline. The device is the microphone, the speaker and one status LED;
wake word, speech-to-text, the conversation agent and text-to-speech all run on
the Home Assistant server.

## What's in this folder

- `esphome/bruh-voice-assistant.yaml` — the ESPHome config

## Hardware

- M5Stack Atom Echo (ESP32, PDM microphone, speaker, one SK6812 LED, button)
- USB-C cable and any 5 V USB supply

Needs `wifi_ssid`, `wifi_password`, `ota_password` and `api_key` in
`secrets.yaml` — see `projects/secrets.yaml.example`.
