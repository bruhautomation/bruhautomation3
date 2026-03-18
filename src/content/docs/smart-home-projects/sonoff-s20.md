---
title: Sonoff S20
description: Basic smart plug with relay control and status LED
---

Sonoff S20 smart plug offering simple relay control and LED indicator without power metering. Ideal for controlling basic on/off devices and automation.

## Hardware

**Integrated Components:**
- **Microcontroller:** ESP8266 (esp01_1m, 1MB flash)
- **Relay:** 16A AC rated
- **LED:** Status indicator
- **Button:** Physical control for manual on/off

Standard outlet plug form factor. Simpler than the S31 (no power monitoring) but fully functional for automation.

## ESPHome Configuration

```yaml
substitutions:
  device_name: "Sonoff S20"
  device_id: "sonoff-s20"

esp8266:
  board: esp01_1m
  board_flash_mode: dout

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
              switch.is_on: relay
            then:
              - switch.turn_off: relay
              - light.turn_off: led
            else:
              - switch.turn_on: relay
              - light.turn_on: led

switch:
  - platform: gpio
    id: relay
    name: "${device_name} relay"
    pin: GPIO12
    restore_mode: RESTORE_DEFAULT_ON
  - platform: restart
    name: "${device_name} Restart"

status_led:
  pin:
    number: GPIO13
    inverted: true
```

## Features

- **Simple relay control:** on/off switching
- **16A capacity:** suitable for most household devices
- **LED feedback:** visual status indicator
- **Physical button:** manual control toggling relay and LED
- **WiFi connectivity:** remote control via Home Assistant
- **Status persistence:** remembers on/off state through power loss

## Home Assistant Integration

Entities exposed:
- **Switch:** `switch.sonoff_s20_relay` — on/off control
- **Light:** `light.sonoff_s20_led` — LED status (optional)
- **Sensor:** WiFi signal strength

Simple automation to toggle the device:

```yaml
automation:
  - alias: "Bedroom Light"
    trigger:
      button.pressed:
    action:
      - service: switch.toggle
        entity_id: switch.sonoff_s20_relay
```

## Supported Devices

The S20 works well for controlling:
- **Lights:** incandescent, LED, CFL bulbs
- **Fans:** ceiling fans, tower fans
- **Heaters:** space heaters, radiators
- **Pumps:** water pumps, air pumps
- **Motors:** any 16A or less motor

Not suitable for:
- **High-power devices:** > 3680W (16A @ 230V)
- **Inductive loads:** requires flyback diodes if high inrush current

## Power Consumption

- **On (no load):** ~1W
- **On (device):** depends on connected load
- **Off:** ~0.3W (WiFi off, relay open)

Very low standby power—safe to leave plugged in 24/7.

## Physical Design

Outlet plug with integrated switch:
- No additional cables required
- Fits most standard outlets (US, EU variants available)
- Small profile doesn't block adjacent outlets
- LED glows blue when relay is on

## Tips

- Button press toggles both relay and LED together
- The restore_mode setting keeps relay on after power loss (adjust if needed)
- Inductive loads (motors) may need external protection diodes
- 1MB flash is sufficient for basic ESPHome configs

## Typical Use Cases

- Trigger outdoor lights at sunset
- Control heater during cold months
- Schedule morning coffee maker power-up
- Create "bedtime" scene that turns off non-essential devices
- Monitor and control devices remotely during travel

## vs. S31

Choose S20 if:
- Power monitoring not needed
- Simpler, cheaper setup
- Dedicated for binary on/off control

Choose S31 if:
- Energy tracking is important
- Need to diagnose high power draws
- Monitoring device efficiency over time
