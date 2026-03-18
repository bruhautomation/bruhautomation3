---
title: Desk Controller
description: Electric standing desk height controller with custom UART sensor
---

Smart controller for electric standing desks, reading desk height via a custom UART sensor and providing remote up/down control through Home Assistant.

## Hardware

**Core Components:**
- **Microcontroller:** ESP32 (NodeMCU-32S)
- **Height Sensor:** Custom UART sensor (reads desk controller's height output)
- **Control Relays:** Two GPIO relays for up/down commands
- **UART Interface:** GPIO16 (RX), GPIO17 (TX)

The controller connects to the desk's existing control circuit via relays that simulate button presses.

## ESPHome Configuration

```yaml
substitutions:
  device_name: "BRUH Desk"
  device_id: "bruh-desk"

esp32:
  board: nodemcu-32s
  includes:
    - table_height_sensor.h

api:
  services:
    - service: move_desk
      variables:
        delay_time: float
      then:
        - if:
            condition:
              lambda: 'return id(bruh_desk_set_height).state < id(bruh_desk_height).state;'
            then:
              - switch.turn_on: gpio_19
              - delay: !lambda 'return delay_time;'
              - switch.turn_off: gpio_19
        - if:
            condition:
              lambda: 'return id(bruh_desk_set_height).state > id(bruh_desk_height).state;'
            then:
              - switch.turn_on: gpio_18
              - delay: !lambda 'return delay_time;'
              - switch.turn_off: gpio_18

uart:
  id: uart_bus
  tx_pin: 16
  rx_pin: 17
  baud_rate: 9600

sensor:
  - platform: custom
    lambda: |-
      auto height_sensor = new TableHeightSensor(id(uart_bus));
      App.register_component(height_sensor);
      return {height_sensor};
    sensors:
      name: "${device_name} height"
      unit_of_measurement: cm
      id: bruh_desk_height
      accuracy_decimals: 1

  - platform: homeassistant
    id: bruh_desk_set_height
    name: "${device_name} Set Height"
    entity_id: input_number.bruh_desk_height
    internal: true

  - platform: wifi_signal
    name: "${device_name} WiFi Signal"
    update_interval: 300s

switch:
  - platform: gpio
    pin: 18
    id: gpio_18
    name: "${device_name} Up"
    inverted: true
    restore_mode: RESTORE_DEFAULT_OFF
    interlock: [gpio_19]

  - platform: gpio
    pin: 19
    id: gpio_19
    name: "${device_name} Down"
    inverted: true
    restore_mode: RESTORE_DEFAULT_OFF
    interlock: [gpio_18]
```

## Features

- **Real-time height tracking:** reads current desk height
- **Remote up/down control:** trigger via Home Assistant
- **Custom UART sensor:** decodes desk controller's height protocol (uses `table_height_sensor.h`)
- **Relay interlock:** prevents simultaneous up/down commands
- **Home Assistant integration:** set target height via input_number
- **WiFi signal monitoring:** track connection strength

## Custom Height Sensor

The `table_height_sensor.h` C++ component handles UART decoding:
- Reads serial frames from desk controller
- Parses height value in centimeters
- Filters noise with 1.0 cm accuracy decimals

This is desk-model specific—your desk's protocol may differ.

## Home Assistant Automation Example

```yaml
automation:
  - alias: "Desk Height Preset"
    trigger:
      button.pressed:
    action:
      - number.set_value:
          entity_id: input_number.bruh_desk_height
          value: 75  # Sitting height in cm
      - delay: 10s
      - service: esphome.desk_service_move_desk
        data:
          delay_time: 8000  # 8 seconds of movement
```

## Supported Desks

This config supports most electric desks with:
- A control panel that accepts momentary button presses
- An output showing height (analog or digital)
- 24V or 12V motor relays

The UART sensor decoding is specific to certain Flexispot or similar models. Verify your desk's protocol before deployment.

## Tips

- The `interlock` setting prevents "fighting" between up/down commands
- Increase `delay_time` for desks that move slowly
- Add a timeout to prevent the motor from stalling if stuck
- Place the ESP32 near the desk controller for short wire runs

## Coming Soon

- Preset height automations (sitting vs. standing)
- Height limits to prevent desk damage
- Slow-move mode for precise positioning
