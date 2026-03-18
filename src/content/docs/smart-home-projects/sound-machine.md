---
title: Sound Machine
description: MP3 sound player with DFPlayer Mini module and Home Assistant integration
---

DFPlayer-based MP3 sound machine with Home Assistant integration for playing audio files from a microSD card via UART communication.

## Hardware

**Core Components:**
- **Microcontroller:** ESP32 (NodeMCU-32S)
- **Audio Module:** DFPlayer Mini
- **Storage:** microSD card (FAT32 format)
- **Speaker:** 3W 4Ω or similar
- **UART Pins:** GPIO16 (RX), GPIO17 (TX) at 9600 baud

The DFPlayer mini handles MP3 decoding and amplification—no external DAC or amplifier needed.

## ESPHome Configuration

```yaml
substitutions:
  device_name: "BRUH Sound Machine"
  device_id: "bruh-sound-machine"
  uart_b_rx: GPIO16
  uart_b_tx: GPIO17

esp32:
  board: nodemcu-32s

uart:
  tx_pin: ${uart_b_tx}
  rx_pin: ${uart_b_rx}
  id: uart_b
  baud_rate: 9600

api:
  services:
    - service: dfplayer_play_1
      then:
        - dfplayer.play:
            file: 1
            loop: false
    - service: dfplayer_next
      then:
        - dfplayer.play_next:
    - service: dfplayer_previous
      then:
        - dfplayer.play_previous:
    - service: dfplayer_play
      variables:
        file: int
      then:
        - dfplayer.play: !lambda 'return file;'
    - service: dfplayer_set_volume
      variables:
        volume: int
      then:
        - dfplayer.set_volume: !lambda 'return volume;'
    - service: dfplayer_volume_down
      then:
        - dfplayer.volume_down
    - service: dfplayer_volume_up
      then:
        - dfplayer.volume_up

dfplayer:
  uart_id: uart_b
  on_finished_playback:
    then:
      - logger.log: 'Playback finished event'
```

## Features

- **MP3 & WAV support:** plays most audio formats
- **Volume control:** 0-30 software volume steps
- **Track selection:** play by file number or folder
- **Playback control:** play, pause, next, previous, random
- **Automatic logging:** firmware ready for playback events
- **Low power:** requires only 5V, ~100mA during playback

## File Organization

Structure your microSD card:

```
/
├── 01.mp3
├── 02.mp3
├── 03.mp3
└── 01 (folder)
    ├── 001.mp3
    ├── 002.mp3
```

Files are numbered sequentially. Use folders to organize playlists.

## Home Assistant Services

Call from automations:
- `dfplayer_play_1`: play file 1 once
- `dfplayer_next` / `dfplayer_previous`: skip tracks
- `dfplayer_set_volume`: set volume 0-30
- `dfplayer_play_folder`: play from specific folder
- `dfplayer_volume_up` / `dfplayer_volume_down`: relative control

## Tips

- The DFPlayer auto-searches for MP3 files at power-on
- Ensure microSD is FAT32 formatted (not exFAT)
- For clear audio at low volumes, use a good quality speaker
- The finished playback event is logged—use it to trigger automations when a sound ends

## Enclosure (Coming Soon)

3D-printed designs available for mounting the speaker and DFPlayer module.
