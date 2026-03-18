---
title: Smart Blinds
description: Servo-driven motorized blinds with touch control and NeoPixel feedback
---

Motorized blinds using a servo motor with capacitive touch control, NeoPixel LED feedback, and full Home Assistant integration for automated window management.

## Hardware

**Core Components:**
- **Microcontroller:** ESP32 (NodeMCU-32S)
- **Actuator:** Servo motor (PWM control)
- **Control:** Capacitive touch sensor (ESP32-native)
- **Feedback:** 24-LED NeoPixel strip
- **Output:** LEDC PWM on 50 Hz (servo control)

The servo drives a mechanical linkage that opens/closes the blinds. Tilt control allows partial opening.

## ESPHome Configuration

```yaml
esphome:
  name: ${device_id}
  platform: ESP32
  board: nodemcu-32s
  on_boot:
    priority: -10
    then:
      - servo.write:
          id: my_servo
          level: !lambda "return -1.0;"
      - cover.template.publish:
          id: cover_1
          tilt: 0.0
          state: CLOSED
      - delay: 1.0s
      - servo.detach: my_servo

esp32_touch:

binary_sensor:
  - platform: esp32_touch
    pin: ${esp_32_touch_pin}
    threshold: ${touch_threshold}
    id: sensor_1
    name: "${device_name} Button"
    on_multi_click:
      - timing:
          - ON for at most 0.75s
          - OFF for at least 0.2s
        then:
          - servo.write:
              id: my_servo
              level: !lambda "return ${open_setpoint_servo};"
          - cover.template.publish:
              id: cover_1
              tilt: ${open_setpoint_tilt}
          - delay: 4.0s
          - servo.detach: my_servo
      - timing:
          - ON for at least 0.75s
          - OFF for at least 0.5s
        then:
          - servo.write:
              id: my_servo
              level: !lambda "return -1.0;"
          - cover.template.publish:
              id: cover_1
              tilt: 0.0
          - delay: 4.0s
          - servo.detach: my_servo

servo:
  - id: my_servo
    output: pwm_output

output:
  - platform: ledc
    pin: ${servo_pin}
    id: pwm_output
    frequency: 50 Hz

cover:
  - platform: template
    name: "${device_name}"
    id: cover_1
    lambda: |-
      if (id(cover_1).tilt > 0.1) {
        return COVER_OPEN;
      } else {
        return COVER_CLOSED;
      }
    has_position: false
    assumed_state: false
    open_action:
      - servo.write:
          id: my_servo
          level: !lambda "return ${open_setpoint_servo};"
      - cover.template.publish:
          id: cover_1
          tilt: ${open_setpoint_tilt}
      - delay: 4.0s
      - servo.detach: my_servo
    close_action:
      - servo.write:
          id: my_servo
          level: !lambda "return -1.0;"
      - cover.template.publish:
          id: cover_1
          tilt: 0.0
      - delay: 4.0s
      - servo.detach: my_servo

light:
  - platform: neopixelbus
    type: GRB
    pin: ${led_pin}
    id: led_strip
    num_leds: 24
    name: "${device_name} LED"
    variant: 800KBPS
    method: ESP32_I2S_0
    effects:
      - flicker:
      - strobe:
      - random:
      - addressable_rainbow:
```

## Features

- **Touch control:** single tap to open/close, long press to reset
- **Servo-driven:** smooth, silent actuation
- **Tilt support:** partial opening for light control
- **NeoPixel feedback:** visual status with multiple effects
- **Home Assistant cover:** standard open/close/stop/tilt entities
- **Detachable servo:** powers down when not moving (low standby power)

## Configuration Substitutions

Required variables in your secrets or main config:
- `device_name` — friendly name
- `device_id` — unique identifier
- `servo_pin` — GPIO for servo PWM
- `esp_32_touch_pin` — GPIO for touch sensor (T0-T9 on ESP32)
- `touch_threshold` — sensitivity (typical 50-100)
- `open_setpoint_servo` — servo angle when open (-1.0 to 1.0)
- `open_setpoint_tilt` — tilt state (0.0 to 1.0)
- `led_pin` — GPIO for NeoPixel data

## Mechanical Linkage

The servo connects to the blind rod via a simple crank mechanism:
- **90° rotation opens** blinds fully
- **45° position** offers partial tilt
- **Full reverse** closes completely

Adjust `open_setpoint_servo` and delay timing based on blind span and weight.

## Home Assistant Control

The blinds appear as a Cover entity:
- **Open:** moves to open position
- **Close:** moves to closed position
- **Tilt (0-100):** controls partial opening angle
- **Stop:** halts movement mid-way

Example automation:

```yaml
automation:
  - alias: "Morning Blinds"
    trigger:
      time: "06:30:00"
    action:
      - service: cover.open_cover
        entity_id: cover.smart_blinds
```

## Touch Sensor Tuning

ESP32 capacitive touch is very sensitive. Tune the threshold:
- **Too low (< 30):** false triggers from dust/moisture
- **Too high (> 150):** requires firm press to activate
- **Optimal (50-100):** responsive without false triggers

Use `esphome validate --device COM3` to see raw touch values and adjust.

## Power Consumption

- **Moving:** ~500mA (servo under load)
- **Idle (servo detached):** ~50mA WiFi standby
- **At rest:** servo draws no current when detached

This design minimizes power for all-day operation, even on battery backup.

## CAD Files & 3D Prints

Fusion360 files available on GitHub: https://github.com/bruhautomation/BRUH-CAD-Files

Includes bracket, linkage arm, and servo mounting guides.

## Tips

- Detaching the servo after each command is key for low power
- NeoPixel strip can be omitted if not needed (saves GPIO)
- For heavier blinds, consider a stronger servo (6kg or more)
- Use window automation to close blinds at sunset or when brightness rises
