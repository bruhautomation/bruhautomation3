# ESPHome Configuration Files - BRUH Automation

Clean, production-ready ESPHome configuration files for all BRUH Automation devices.

Each config lives in its own project folder alongside that project's CAD files and
notes, rather than in one flat directory. No config `!include`s another, so each
can be copied out on its own — the one companion file is `bruh-desk.yaml`'s
custom sensor header, `table_height_sensor.h`, which lives beside it and moves
with it.

## Device Configurations

### Sensors
- [`multisensor/esphome/bruh-multisensor.yaml`](multisensor/esphome/bruh-multisensor.yaml) - ESP8266 room sensor (DHT22, PIR, RGB LED, light level)
- [`multisensor/esphome/bruh-multisensor-esp32.yaml`](multisensor/esphome/bruh-multisensor-esp32.yaml) - ESP32 variant with BME280, TSL2561, computed sensors
- [`uv-sensor/esphome/bruh-uv-sensor.yaml`](uv-sensor/esphome/bruh-uv-sensor.yaml) - LTR390 UV index sensor with BME280 and OLED display
- [`7-segment-display/esphome/bruh-7-segment-display.yaml`](7-segment-display/esphome/bruh-7-segment-display.yaml) - MAX7219 7-segment display for HA data

### Smart Plugs & Switches
- [`sonoff-s31/esphome/sonoff-s31.yaml`](sonoff-s31/esphome/sonoff-s31.yaml) - Sonoff S31 with real-time power monitoring (CSE7766)
- [`sonoff-s20/esphome/sonoff-s20.yaml`](sonoff-s20/esphome/sonoff-s20.yaml) - Sonoff S20 basic smart plug
- [`sonoff-rf-bridge/esphome/sonoff-rf-bridge.yaml`](sonoff-rf-bridge/esphome/sonoff-rf-bridge.yaml) - Sonoff RF Bridge for 433MHz RF codes
- [`hype-button/esphome/bruh-switch.yaml`](hype-button/esphome/bruh-switch.yaml) - Multi-click button controller with LED feedback

### Lighting
- [`neopixel-strip/esphome/bruh-neopixel-strip.yaml`](neopixel-strip/esphome/bruh-neopixel-strip.yaml) - ESP8266 addressable RGB LED strip
- [`nightlight/esphome/bruh-nightlight.yaml`](nightlight/esphome/bruh-nightlight.yaml) - ESP32 simple PWM LED nightlight
- [`nightlight/esphome/bruh-nightlight-rgb.yaml`](nightlight/esphome/bruh-nightlight-rgb.yaml) - ESP32-S3 RGB LED strip with effects

### Home Automation
- [`smart-candle/esphome/bruh-candle.yaml`](smart-candle/esphome/bruh-candle.yaml) - Auto-igniting/extinguishing candle with TFT display
- [`desk-controller/esphome/bruh-desk.yaml`](desk-controller/esphome/bruh-desk.yaml) - Electric desk height controller with custom UART sensor
- [`smart-blinds/esphome/bruh_blinds.yaml`](smart-blinds/esphome/bruh_blinds.yaml) - Servo-controlled blinds with touch sensor

### Audio & Video
- [`sound-machine/esphome/bruh-sound-machine.yaml`](sound-machine/esphome/bruh-sound-machine.yaml) - DFPlayer MP3 module audio player
- [`voice-assistant/esphome/bruh-voice-assistant.yaml`](voice-assistant/esphome/bruh-voice-assistant.yaml) - M5Stack Atom Echo voice assistant
- [`esp32-cam/esphome/bruh-esp32-cam.yaml`](esp32-cam/esphome/bruh-esp32-cam.yaml) - ESP32-CAM with OLED display and motion detection

### Specialized Controllers
- [`irrigation-system/esphome/bruh-pump.yaml`](irrigation-system/esphome/bruh-pump.yaml) - Irrigation pump controller with 7 zones, flow sensors, TDS monitoring
- [`irrigation-system/esphome/bruh-pump-s3.yaml`](irrigation-system/esphome/bruh-pump-s3.yaml) - ESP32-S3 variant of pump controller
- [`sourdough-monitor/esphome/bruh-sourdough-monitor.yaml`](sourdough-monitor/esphome/bruh-sourdough-monitor.yaml) - Smart jar for fermentation tracking

### Entertainment
- [`playhouse/esphome/bruh-playhouse.yaml`](playhouse/esphome/bruh-playhouse.yaml) - Complex playhouse controller with servos, DFPlayer, LEDs
- [`playhouse/esphome/bruh-playhouse-fan.yaml`](playhouse/esphome/bruh-playhouse-fan.yaml) - Playhouse fan speed controller
- [`playhouse/esphome/bruh-playhouse-mini.yaml`](playhouse/esphome/bruh-playhouse-mini.yaml) - Simplified playhouse controller

## Setup Instructions

### 1. Copy the config you want
Copy the YAML for your device into your ESPHome configuration directory:
```bash
cp multisensor/esphome/bruh-multisensor.yaml ~/.config/esphome/
```

### 2. Configure Secrets
Copy [`secrets.yaml.example`](secrets.yaml.example) to `secrets.yaml` in the same
directory, then fill in your WiFi credentials and OTA password:
```yaml
wifi_ssid: "your-ssid-here"
wifi_password: "your-password-here"
wifi_ssid_iot: "your-iot-ssid"
wifi_password_iot: "your-iot-password"
ota_password: "secure-ota-password"
api_key: "32-byte-base64-encryption-key"
```

To generate an API encryption key:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(24))"
```

### 3. Customize Device Names
Edit the `substitutions` section in each YAML file to customize:
- `device_name` - Friendly name shown in Home Assistant
- `device_id` - Device hostname (no spaces or special chars)
- Pin assignments for your hardware

### 4. Install
Use ESPHome CLI to compile and install:
```bash
esphome run bruh-multisensor.yaml
```

Or use Home Assistant's ESPHome add-on web interface.

> The commands above assume you copied the YAML into your ESPHome directory as in
> step 1; run `esphome` from wherever the file and its `secrets.yaml` live.

## Features

All configurations include:
- **No Hardcoded Secrets** - Uses `!secret` references for WiFi, passwords, API keys
- **No Hardcoded IPs** - Devices use mDNS hostname resolution
- **Modern Syntax** - Uses esp32/esp8266 board config (not deprecated platform)
- **Well Documented** - Header comments explaining device purpose and hardware
- **Clean Formatting** - Consistent 2-space indentation, no trailing whitespace

## Common Customizations

### WiFi Configuration
Change WiFi SSID/password in `secrets.yaml` (used by all devices).

### WiFi with Fallback Hotspot
Some devices include fallback hotspot for captive portal setup (requires custom password in each YAML).

### Pin Assignments
Edit pin numbers in `substitutions` section to match your hardware.

### Sensor Calibration
Many sensors have filters for calibration (offset, linear calibration, etc.) - adjust based on your environment.

### LED Effects
The RGB and monochromatic effect definitions are declared inline in each lighting
config — copy an `effects:` block between configs to keep animations consistent.

## Troubleshooting

**Device won't connect:**
- Check WiFi SSID and password in `secrets.yaml`
- Verify OTA password matches on device and in `secrets.yaml`
- Ensure device is in WiFi range and powered on

**API encryption errors:**
- Verify `api_key` in `secrets.yaml` is properly formatted base64
- Regenerate key if needed (see Setup Instructions above)

**Missing sensors or switches:**
- Check GPIO pins match your hardware
- Verify I2C/UART peripherals are properly configured
- Check device logs: `esphome logs device-name.yaml`

## References

- [ESPHome Documentation](https://esphome.io/)
- [Home Assistant Integration](https://www.home-assistant.io/integrations/esphome/)
- [BRUH Automation GitHub](https://github.com/bruhautomation)

## License

These configuration files are part of the BRUH Automation project.
