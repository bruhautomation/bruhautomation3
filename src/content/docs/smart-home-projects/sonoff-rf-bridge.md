---
title: Sonoff RF Bridge
description: 433MHz RF bridge for learning and transmitting wireless codes
---

Sonoff RF Bridge with 433MHz transceiver for learning RF remote codes and transmitting commands, enabling control of older wireless devices from Home Assistant.

## Hardware

**Integrated Components:**
- **Microcontroller:** ESP8266 (esp01_1m)
- **RF Module:** 433MHz transmitter/receiver
- **Protocol:** EV1527 and similar OOK (On-Off Keying) formats
- **Communication:** UART interface from RF module to ESP8266

Allows Home Assistant to act as a universal remote for any 433MHz device.

## ESPHome Configuration

```yaml
substitutions:
  device_name: "Sonoff RF Bridge"
  device_id: "sonoff-rf-bridge"

esp8266:
  board: esp01_1m

uart:
  tx_pin: 1
  rx_pin: 3
  baud_rate: 19200

logger:
  baud_rate: 0

rf_bridge:
  on_code_received:
    then:
      - homeassistant.event:
          event: esphome.rf_code_received
          data:
            sync: !lambda 'return format_hex(data.sync);'
            low: !lambda 'return format_hex(data.low);'
            high: !lambda 'return format_hex(data.high);'
            code: !lambda 'return format_hex(data.code);'

api:
  services:
    - service: send_rf_code
      variables:
        sync: int
        low: int
        high: int
        code: int
      then:
        - rf_bridge.send_code:
            sync: !lambda 'return sync;'
            low: !lambda 'return low;'
            high: !lambda 'return high;'
            code: !lambda 'return code;'
    - service: learn
      then:
        - rf_bridge.learn
```

## Features

- **Learn mode:** press remote button to capture code
- **Transmit:** send captured codes via Home Assistant service calls
- **Event-based:** codes received fire Home Assistant events
- **Flexible protocol:** supports EV1527 and compatible formats
- **Multiple devices:** learn and control different remotes

## How It Works

1. **Learn Phase:** Bridge enters learning mode, waits for RF signal
2. **Capture:** Records the raw RF code (sync, low, high, code bytes)
3. **Fire Event:** Sends event to Home Assistant with hex-encoded code
4. **Transmit:** Can replay codes on demand via service call

## Home Assistant Automation Example

Capture a remote button press:

```yaml
automation:
  - alias: "Learn RF Code"
    trigger:
      event: esphome.rf_code_received
    action:
      - service: notify.notify
        data:
          message: "RF Code: {{ trigger.event.data.code }}"

  - alias: "Retransmit Code"
    trigger:
      button.pressed:
    action:
      - service: esphome.sonoff_rf_bridge_service_send_rf_code
        data:
          sync: 8750
          low: 288
          high: 865
          code: 5206659
```

## Learning Remote Codes

Manual process in Home Assistant:
1. Call `esphome.sonoff_rf_bridge_service_learn` to start learning
2. Press a button on your RF remote within 30 seconds
3. Bridge captures the code and fires an event
4. Note down the `sync`, `low`, `high`, and `code` values

Use a helper automation to log these values to a Notes entity for reference.

## Code Format

RF Bridge reports codes as four hex values:
- **sync:** preamble/synchronization bits (timing reference)
- **low:** duration of "0" bits (microseconds)
- **high:** duration of "1" bits (microseconds)
- **code:** the actual data payload (device + command)

These can be replayed via the `send_rf_code` service to control devices.

## Compatible Devices

Most 433MHz RF remotes using OOK modulation:
- **Wireless doorbells**
- **Remote garage door openers**
- **Wireless switches**
- **Remote-controlled outlets**
- **Thermostat remotes**
- **Toy cars and helicopters**

Not compatible with:
- WiFi devices (use native integration instead)
- ZigBee or Z-Wave (different protocols)
- Modern frequency-hopping remotes (rolling codes)

## Tips

- Keep the bridge in a central location for best RF range
- A simple antenna wire (170mm for 433MHz) improves range significantly
- Learning is reliable—save codes in YAML for easy reference
- Test codes in Home Assistant before automating critical devices
- The bridge can learn and transmit simultaneously (full duplex)

## Automation Ideas

- Trigger lights on wireless doorbell press
- Control ceiling fan from old remote
- Integrate vintage RF remotes with smart home
- Send notifications when wireless device is activated
- Create macro buttons that sequence multiple RF codes

## Limitations

- Only supports OOK protocols (most 433MHz devices)
- Rolling code remotes (modern car remotes) won't work reliably
- Range depends on antenna quality and environment
- Each device learns codes individually—no universal learning

## Enclosure (Coming Soon)

3D-printed design for desktop or wall-mounted placement with extended antenna.
