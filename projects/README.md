# BRUH Projects

Source files for the smart home, maker, and lab projects at
[bruhautomation.com](https://bruhautomation.com) — CAD (`.f3d`, `.step`, `.stl`),
ESPHome YAML, Arduino firmware, laser-cut vectors, and display assets.

Everything for one project lives in one folder. A project that is a 3D print and a
firmware config keeps both side by side rather than splitting across repositories.

```
projects/<category>/<project>/
├── README.md                # what it is, hardware, status
├── *.f3d / *.step / *.stl   # CAD source, exchange, and print files
├── *.yaml                   # ESPHome configuration
├── arduino-legacy/          # pre-ESPHome Arduino sketches, kept for reference
├── laser-cut/               # DXF/SVG cut files
├── fritzing/                # wiring diagrams
└── nextion-hmi/             # Nextion display projects
```

Categories are `home/`, `lab/`, and `smart-home/`, matching the three project
sections of the site.

## Using the ESPHome configs

The YAML files reference secrets by name. Copy [`secrets.yaml.example`](secrets.yaml.example)
to `secrets.yaml` in your ESPHome directory and fill in your own values — WiFi
credentials, OTA password, and API encryption key. See
[`smart-home/ESPHOME.md`](smart-home/ESPHOME.md) for an overview of the device
configurations.

## Smart Home

ESP32/ESP8266 devices running ESPHome, built for Home Assistant.

| Project | Description | Guide |
|---|---|---|
| [7-Segment Display](smart-home/7-segment-display/) | MAX7219 display for Home Assistant data | |
| [BLE Hub](smart-home/ble-hub/) | Bluetooth presence detection proxy | |
| [Desk Controller](smart-home/desk-controller/) | Standing desk height controller | |
| [ESP32-CAM](smart-home/esp32-cam/) | Camera with OLED status display | |
| [Hype Button](smart-home/hype-button/) | Button for triggering celebration scenes | [Guide](https://bruhautomation.com/smart-home-projects/hype-button/) |
| [Irrigation System](smart-home/irrigation-system/) | 1500ft automated irrigation with flow and TDS sensors | [Guide](https://bruhautomation.com/smart-home-projects/irrigation-system/) |
| [Multisensor](smart-home/multisensor/) | Room sensor — temperature, humidity, motion, light | |
| [Neopixel Strip](smart-home/neopixel-strip/) | Addressable RGB LED strip with effects | |
| [Nextion Touch Panel](smart-home/nextion-touch-panel/) | Wall-mounted HA touch display (3.5" and 5") | |
| [Nightlight](smart-home/nightlight/) | ESP32 nightlight, mono and RGB variants | |
| [Playhouse](smart-home/playhouse/) | Connected outdoor playhouse with servos and audio | [Guide](https://bruhautomation.com/smart-home-projects/bruh-playhouse/) |
| [Smart Blinds](smart-home/smart-blinds/) | Servo-driven motorized blinds controller | |
| [Smart Candle](smart-home/smart-candle/) | Auto-igniting and auto-extinguishing candle with arc lighter | [Guide](https://bruhautomation.com/smart-home-projects/smart-candlet/) |
| [Sonoff RF Bridge](smart-home/sonoff-rf-bridge/) | 433MHz RF bridge (reference config) | |
| [Sonoff S20](smart-home/sonoff-s20/) | Basic smart plug (reference config) | |
| [Sonoff S31](smart-home/sonoff-s31/) | Smart plug with power monitoring | |
| [Sound Machine](smart-home/sound-machine/) | DFPlayer MP3 sound machine | |
| [Sourdough Monitor](smart-home/sourdough-monitor/) | Fermentation tracking smart jar | |
| [UV Sensor](smart-home/uv-sensor/) | UV index and environmental sensor with OLED display | |
| [Voice Assistant](smart-home/voice-assistant/) | M5Stack Atom Echo voice assistant | |

## Home

3D printed parts, mounts, and practical builds for around the house.

| Project | Description | Guide |
|---|---|---|
| [Childproof Doorknob](home/childproof-doorknob/) | Cover for Schlage Bowery knobs | [Guide](https://bruhautomation.com/home-projects/beautiful-childproof-doorknob/) |
| [Christmas Ornaments](home/christmas-ornaments/) | Smart home themed ornaments with integrated electronics | |
| [COB Panel Mount](home/cob-panel-mount/) | Bracket for chip-on-board LED panels | |
| [Cold Air Return Baffle](home/cold-air-return-baffle/) | HVAC baffle to redirect a cold air return | |
| [Couch Cupholder](home/couch-cupholder/) | Arm-mounted cupholder with inserts | [Guide](https://bruhautomation.com/home-projects/3d-prints/couch-cupholder/) |
| [DeWalt Router Sled](home/dewalt-router-sled/) | Router sled and cookie sheet divider | |
| [DeWalt Screwdriver Holder](home/dewalt-screwdriver-holder/) | Holder for the GYRO screwdriver and bits | |
| [Dinner Bowl Rest](home/dinner-bowl-rest/) | Dish support that stops bowls tipping | |
| [Dog Treat Dispenser](home/dog-treat-dispenser/) | Automated treat dispenser with HA integration | |
| [Duct Cap](home/duct-cap/) | 4" duct adapter and cap, plus a quick-tee fitting | |
| [Folding Wall Hooks](home/folding-wall-hooks/) | Space-saving folding wall hooks | |
| [Fridge Drawer Support](home/fridge-drawer-support/) | Bracket to reinforce refrigerator drawers | |
| [Google Mini Mount](home/google-mini-mount/) | Wall mount for Google Home Mini | |
| [Happy Bubbles Enclosure](home/happy-bubbles-enclosure/) | Enclosure for Happy Bubbles BLE beacons | |
| [Honda Cupholder](home/honda-cupholder/) | Cupholder and rail for Honda vehicles | |
| [Kitchen Chair Footrest](home/kitchen-chair-footrest/) | Footrest that clamps to chair legs | |
| [Label Peeler](home/label-peeler/) | Tool for cleanly removing container labels | |
| [Magnetic Hook](home/magnetic-hook/) | Wall-mounted magnetic hook | |
| [Magnetic Ring Unlocker](home/magnetic-ring-unlocker/) | Opens magnetic locks with a magnetic ring | [Guide](https://bruhautomation.com/home-projects/3d-prints/magnetic-ring-unlocker/) |
| [Outlet Cover](home/outlet-cover/) | Adds a switched outlet to an existing one | |
| [Pi Camera Mount](home/pi-camera-mount/) | Mount and pipe clamp for Raspberry Pi cameras | |
| [Popup Key Holder](home/popup-key-holder/) | Spring-loaded key holder | |
| [Shelly Case](home/shelly-case/) | Enclosure for Shelly devices | |
| [Tablet Wall Mount](home/tablet-wall-mount/) | Flush magnetic mount with keystone plate | [Guide](https://bruhautomation.com/home-projects/tablet-wall-mount/) |
| [UniFi Camera Mount](home/unifi-camera-mount/) | Bracket for UniFi security cameras | |
| [Village Lights](home/village-lights/) | Decorative village scene with controllable lighting | |
| [Vinyl Mounting Block](home/vinyl-mounting-block/) | Mounting block for vinyl siding | |
| [Wire Rack Shelf Brackets](home/wire-rack-shelf-brackets/) | Reinforcement brackets for wire shelving | |

## Lab

Laboratory automation, sample handling, and bioreactor equipment.

| Project | Description | Guide |
|---|---|---|
| [15mL Tube Megarack](lab/15ml-tube-megarack/) | High-capacity 15mL tube storage | [Guide](https://bruhautomation.com/lab-projects/3d-prints/15ml-tube-megarack/) |
| [96-Well Plate Inverter](lab/96-well-plate-inverter/) | Motorized inverter for assay plates | [Guide](https://bruhautomation.com/lab-projects/96-well-plate-inverter/) |
| [BSC Bottle Holder](lab/bsc-bottle-holder/) | Bottle storage for a biosafety cabinet | [Guide](https://bruhautomation.com/lab-projects/3d-prints/bsc-bottle-holder/) |
| [Cedex Tube Rack](lab/cedex-tube-rack/) | Rack for the Cedex Bio HT analyzer | [Guide](https://bruhautomation.com/lab-projects/3d-prints/tube-rack-for-cedex-bioht/) |
| [Cellcube Stand](lab/cellcube-stand/) | Motorized cell culture platform with Nextion HMI and pump control | [Guide](https://bruhautomation.com/lab-projects/cellcube-bioreactor-controller/) |
| [Centrifuge Shaker Mount](lab/centrifuge-shaker-mount/) | Orbital shaker adapter for 225mL bottles | |
| [Microscope Dock](lab/microscope-dock/) | Microscope mounting and accessories | |
| [Pipette Controller](lab/pipette-controller/) | Motorized electronic pipette system | |
| [Pump Controller Housing](lab/pump-controller-housing/) | Laser-cut enclosure and Arduino firmware for peristaltic pumps | [Guide](https://bruhautomation.com/lab-projects/peristaltic-dosing-pump/) |
| [Syringe Puller](lab/syringe-puller/) | Automated micro-electrode needle fabrication | [Guide](https://bruhautomation.com/lab-projects/3d-prints/10ml-syringe-puller/) |
| [Tape Dispenser Clip](lab/tape-dispenser-clip/) | Bench-top tape dispenser attachment | [Guide](https://bruhautomation.com/lab-projects/3d-prints/lab-tape-dispenser-clip/) |
| [UV Flashlight](lab/uv-flashlight/) | Portable UV light source for gel visualization | [Guide](https://bruhautomation.com/lab-projects/3d-prints/uv-flashlight/) |

## Relationship to `public/models/`

The site's interactive 3D previews load STLs from `public/models/`, which Astro
serves as static assets. Those files are copies of the print-ready STLs in this
tree; a project folder here is the source of record, and `public/models/` holds
only the subset a documentation page previews.

## License

See the repository [LICENSE](../LICENSE).
