---
title: Nextion Touch Panel
description: Wall-mounted Nextion display for Home Assistant control and status
---

Wall-mounted touchscreen dashboard using Nextion HMI displays (3.5" and 5" variants) with custom scenes, ESP32 integration, and Home Assistant connectivity.

## Hardware

**Available Variants:**
- **3.5" Nextion display** — compact, fits standard switch plate
- **5" Nextion display** — larger touch area, more detailed UI

**Core Setup:**
- **Microcontroller:** ESP32
- **Display:** Nextion HMI serial interface (UART)
- **Integration:** Home Assistant via ESPHome or MQTT
- **Power:** 5V from USB or external supply
- **Mounting:** 3D-printed enclosures for wall installation

## Nextion Configuration

The HMI files (`.HMI` format) define the user interface:
- Multiple scenes for different dashboard views
- Touch buttons that send commands to ESP32
- Real-time data display synchronized with Home Assistant

Available HMI versions:
- **bruh_nextion_5_inch_scene_ui_v3** — latest 5" interface with Home Assistant scene control
- **Older variants** — preserved in `/old-versions/` for reference

## ESPHome Integration

```yaml
esphome:
  name: nextion-panel
  platform: ESP32
  board: nodemcu-32s

uart:
  id: nextion_uart
  tx_pin: GPIO17
  rx_pin: GPIO16
  baud_rate: 9600

display:
  - platform: nextion
    uart_id: nextion_uart
    tft_url: "http://homeassistant.local:8123/local/nextion/bruh_nextion_5_inch_scene_ui_v3.tft"
    on_setup:
      then:
        - logger.log: "Nextion display initialized"

sensor:
  - platform: homeassistant
    entity_id: sensor.living_room_temperature
    id: ha_temp

binary_sensor:
  - platform: nextion
    name: "Nextion Button 1"
    page_id: 0
    component_id: 1
```

## Available Enclosures (3D Prints)

Multiple mounting options:

1. **Switch Plate Mount** (5")
   - Double-gang electrical box fit
   - Screwless bezel design
   - Fusion360 files: `Nextion_5_inch_double_gang_v14.f3d`

2. **Wall Panel (5")**
   - Flush mount with trim ring
   - Clean, minimal aesthetic
   - Fusion360 files: `bruh_nextion_5_inch_stand_v10.f3d`

3. **Screen-Only Enclosure (5")**
   - Compact border, maximum display area
   - Fusion360 files: `Nextion_5_inch_screen_only_v11.f3d`

4. **Bezel / Screwless Cover**
   - Holds display without visible screws
   - Multiple iterations available for perfect fit
   - Files: `screwless_nextion_5_inch_cover/`

3.5" versions also available—smaller but same design philosophy.

## CAD Files

All Fusion360 models available on GitHub:
https://github.com/bruhautomation/BRUH-CAD-Files/tree/main/smart-home/nextion-touch-panel

Includes:
- Enclosure STEPs for 3D printing
- Mounting brackets
- Bezel covers (with and without screws)

## Features

- **Multi-page interface:** switch between different dashboard views
- **Real-time data:** temperature, humidity, power consumption, time
- **Scene triggers:** tap to activate Home Assistant scenes
- **Device control:** buttons for lights, switches, covers
- **Custom graphics:** image support for icons and backgrounds
- **Dimming control:** adjust backlight brightness per time-of-day

## Typical Scenes

Common dashboard layouts:
1. **Home Overview** — temperature, humidity, time, weather
2. **Lighting Control** — room brightness sliders
3. **Climate** — thermostat setpoint, mode selection
4. **Security** — door/window sensors, armed status
5. **Entertainment** — media player controls

Each scene is customizable in the Nextion Editor.

## Power Supply Notes

- **5V 2A minimum** from USB-C or external power
- The display backlight is the main power consumer (~1W typical)
- Use a quality supply to avoid brownout resets
- Nextion module itself draws ~50mA at idle

## Connection to Home Assistant

Two approaches:

1. **ESPHome (native):** direct WiFi to Home Assistant
   - Lowest latency
   - Requires ESP32 with ESPHome firmware

2. **MQTT (alternative):** wireless decoupling
   - Works with any microcontroller
   - Requires MQTT broker in Home Assistant

## Customization

Edit HMI files in **Nextion Editor** (free software):
- Add/remove buttons and text fields
- Change colors and layout
- Update fonts and background images
- Create custom number displays
- Add timer objects for clock displays

Recompile the `.HMI` to `.tft` binary, then push via WiFi OTA or USB.

## Tips

- Mount at eye level (about 48-60" from floor)
- Angle slightly down for better reflection control
- Protect the touch surface from dust (covered enclosures help)
- Test WiFi signal strength before final installation
- Backlight is dimmable—set to 30-50% at night

## Coming Soon

- MQTT wireless connectivity (no WiFi needed)
- Custom scene designer with drag-and-drop UI
- Multiple HMI options for different use cases (media, lighting, climate)
