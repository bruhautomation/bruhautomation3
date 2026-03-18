---
title: Sonoff S31
description: Smart plug with real-time power monitoring and relay control
---

Sonoff S31 smart plug with integrated CSE7766 power metering for real-time current, voltage, and wattage monitoring. Full Home Assistant integration with relay control and LED indicator.

## Hardware

**Integrated Components:**
- **Microcontroller:** ESP8266 (esp01_1m, 1MB flash)
- **Power Meter:** CSE7766 (via UART)
- **Relay:** 16A AC rated
- **LED:** Status indicator
- **Button:** Physical control for manual on/off

Built into a standard outlet plug form factor—no wiring required, just plug into wall.

## ESPHome Configuration

```yaml
substitutions:
  device_name: "Sonoff S31"
  device_id: "sonoff-s31"

esp8266:
  board: esp01_1m
  board_flash_mode: dout

uart:
  rx_pin: RX
  baud_rate: 4800
  parity: EVEN

light:
  - platform: monochromatic
    id: led
    name: "${device_name} LED"
    output: output_pin
    effects:
      - flicker:
      - strobe:

output:
  - platform: esp8266_pwm
    id: output_pin
    pin:
      number: GPIO13
      inverted: true

sensor:
  - platform: cse7766
    current:
      name: "${device_name} Outlet Current"
      filters:
        - throttle_average: 5s
    voltage:
      name: "${device_name} Outlet Voltage"
      filters:
        - throttle_average: 5s
    power:
      name: "${device_name} Outlet Power"
      filters:
        - throttle_average: 5s

  - platform: wifi_signal
    name: "${device_name} WiFi Signal"
    update_interval: 300s

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: true
    name: "${device_name} button"
    on_press:
      then:
        - if:
            condition:
              light.is_on: led
            then:
              - light.turn_off: led
            else:
              - light.turn_on: led

switch:
  - platform: gpio
    id: relay
    name: "${device_name} relay"
    pin: GPIO12
    restore_mode: RESTORE_DEFAULT_ON
  - platform: restart
    name: "${device_name} Restart"
```

## Features

- **Real-time power monitoring:** current (A), voltage (V), power (W)
- **16A relay:** controls outlet on/off
- **Throttled averaging:** 5-second update window to reduce noise
- **Physical button:** manual control (toggles both relay and LED)
- **LED indicator:** shows relay state
- **WiFi status tracking:** connection quality monitoring

## Power Monitoring Ranges

- **Voltage:** 85-260V AC
- **Current:** 0-16A
- **Power:** 0-3680W (at 230V, 16A)

Accurate enough for energy usage tracking and load analysis.

## Home Assistant Integration

Entities exposed:
- **Switch:** `switch.sonoff_s31_relay` — on/off control
- **Sensor (current):** `sensor.sonoff_s31_outlet_current` — amps
- **Sensor (voltage):** `sensor.sonoff_s31_outlet_voltage` — volts
- **Sensor (power):** `sensor.sonoff_s31_outlet_power` — watts
- **Light:** `light.sonoff_s31_led` — status LED (optional)

## Example Automations

Monitor high power draw:

```yaml
automation:
  - alias: "High Power Alert"
    trigger:
      numeric_state:
        entity_id: sensor.sonoff_s31_outlet_power
        above: 1500
    action:
      - service: notify.notify
        data:
          message: "S31 drawing {{ states('sensor.sonoff_s31_outlet_power') }}W!"

  - alias: "Scheduled Control"
    trigger:
      time: "22:00:00"
    action:
      - service: switch.turn_off
        entity_id: switch.sonoff_s31_relay
```

## Energy Tracking

Home Assistant's Energy Dashboard automatically tracks consumption:
- Monitor daily/monthly usage per plug
- Compare against utility bills
- Identify phantom load (always-on devices)

## Tips

- The CSE7766 averages over ~5 seconds—readings are slightly delayed
- Throttle_average filter reduces Home Assistant updates (set to 5s)
- Physical button toggles relay AND LED together
- 1MB flash is tight—no room for many custom components
- DOUT flash mode is required for this variant

## Typical Loads

- **LED bulbs:** 5-15W
- **Coffee maker:** 1000-1500W
- **Heater:** 750-1500W
- **TV:** 100-300W (depending on size and type)
- **Game console:** 100-200W

Use power readings to identify underutilized devices or unexpected loads.

## Flashing with ESPHome

If replacing stock Tasmota firmware:
1. Use UART adapter connected to RX/TX pins
2. Hold button during power-up to enter bootloader
3. Flash via ESPHome's `esphome run` command
4. Reconfigure UART before first boot (initially unset)
