# BRUH Projects

Every project at [bruhautomation.com](https://bruhautomation.com) lives in one
folder here — the guide, the photos, the print files, the CAD source and the
firmware, side by side. A project that is a 3D print *and* an ESPHome config
keeps both, rather than splitting across two repositories.

```
projects/<project>/
├── README.md          # what it is, what's in the folder, and its category
├── index.mdx          # the build guide, if it has one — this is the page on the site
├── images/            # photos and diagrams the guide uses
├── models/            # print-ready STL (these are what the site's 3D viewer loads)
├── cad/               # Fusion 360 sources (.f3d) and STEP exports
├── esphome/           # ESPHome YAML
├── firmware/          # microcontroller firmware
├── laser-cut/         # DXF and SVG cut files
├── fritzing/          # wiring diagrams
└── nextion-hmi/       # Nextion display projects
```

There are no category folders. A project's category lives in the `category:`
line at the top of its README, so re-filing one is a one-line edit that moves
it everywhere on the site — the sidebar, the project list, the landing page —
without moving a file or breaking a link. The categories are:

| Category | What goes in it |
|---|---|
| `home-automation` | Connected devices built with ESPHome and Home Assistant |
| `mounts-enclosures` | Mounts, brackets, and cases for gear you already own |
| `around-the-house` | Fixes, organisers, and upgrades for everyday household annoyances |
| `workshop-garage` | Tool holders, jigs, and vehicle parts for the shop |
| `lab-science` | Bench equipment and automation for the biotech lab |

Categories say what a project is *for*. How it was built is a tag —
`3d-print`, `esphome`, `arduino`, `laser-cut`, `nextion`, `electronics` — and a
project carries as many as it needs.

## Using the ESPHome configs

The YAML files reference secrets by name. Copy
[`secrets.yaml.example`](secrets.yaml.example) to `secrets.yaml` in your ESPHome
directory and fill in your own values — WiFi credentials, OTA password, and API
encryption key. [`ESPHOME.md`](ESPHOME.md) is an index of every device config.

## The projects

Only some projects have a written guide; the rest are files and notes you can
use today. The live list at
[bruhautomation.com/project-list](https://bruhautomation.com/project-list/) is
generated from these folders and is always current.

## Home Automation  — Connected devices built with ESPHome and Home Assistant.

| Project | What it is | Guide |
|---|---|---|
| [7-Segment Display](7-segment-display/) | MAX7219 seven-segment display that shows Home Assistant data. |  |
| [BLE Hub](ble-hub/) | Bluetooth presence-detection proxy for Home Assistant. |  |
| [BRUH Playhouse](playhouse/) | An outdoor playhouse with Home Assistant-controlled lights, sounds, and interactive features. | [Guide](https://bruhautomation.com/projects/playhouse/) |
| [Desk Controller](desk-controller/) | Standing-desk height controller with position presets. |  |
| [Dog Treat Dispenser](dog-treat-dispenser/) | Automated treat dispenser you can trigger from Home Assistant. |  |
| [ESP32-CAM](esp32-cam/) | Camera node with an OLED status display. |  |
| [Hype Button](hype-button/) | Physical multi-click button controller with NeoPixel feedback and rotary encoder support. | [Guide](https://bruhautomation.com/projects/hype-button/) |
| [Irrigation System](irrigation-system/) | Large-scale automated irrigation system with flow monitoring and zone control. | [Guide](https://bruhautomation.com/projects/irrigation-system/) |
| [Laser Turret](laser-turret/) | Pan-tilt laser turret for entertaining the cat. Concept renders only — no build files yet. |  |
| [Multisensor](multisensor/) | Room sensor — temperature, humidity, motion and light. |  |
| [Neopixel Strip](neopixel-strip/) | Addressable RGB LED strip with effects and OTA updates. |  |
| [Nextion Touch Panel](nextion-touch-panel/) | Wall-mounted Home Assistant touch display, 3.5" and 5". |  |
| [Nightlight](nightlight/) | ESP32 nightlight, in mono and RGB variants. |  |
| [Smart Blinds](smart-blinds/) | Servo-driven motorised blinds controller. |  |
| [Smart Candle](smart-candle/) | A WiFi-controlled, auto-igniting, auto-extinguishing candle built with ESPHome and an arc lighter. | [Guide](https://bruhautomation.com/projects/smart-candle/) |
| [Sonoff RF Bridge](sonoff-rf-bridge/) | 433MHz RF bridge — reference ESPHome configuration. |  |
| [Sonoff S20](sonoff-s20/) | Basic smart plug — reference ESPHome configuration. |  |
| [Sonoff S31](sonoff-s31/) | Smart plug with power monitoring. |  |
| [Sound Machine](sound-machine/) | DFPlayer-based white noise and ambient sound machine. |  |
| [Sourdough Monitor](sourdough-monitor/) | Fermentation-tracking smart jar for sourdough starter. |  |
| [UV Sensor](uv-sensor/) | UV index and environmental sensor with an OLED display. |  |
| [Voice Assistant](voice-assistant/) | M5Stack Atom Echo running the Home Assistant voice pipeline. |  |

## Mounts & Enclosures  — Mounts, brackets, and cases for gear you already own.

| Project | What it is | Guide |
|---|---|---|
| [COB Panel Mount](cob-panel-mount/) | Bracket for chip-on-board LED panels. |  |
| [Google Mini Mount](google-mini-mount/) | Wall mount for the Google Home Mini. |  |
| [Happy Bubbles Enclosure](happy-bubbles-enclosure/) | Enclosure for Happy Bubbles BLE presence beacons. |  |
| [Pi Camera Mount](pi-camera-mount/) | Mount and pipe clamp for Raspberry Pi camera modules. |  |
| [Shelly Case](shelly-case/) | Protective enclosure for Shelly relays. |  |
| [Tablet Wall Mount](tablet-wall-mount/) | A flush, magnetic, universal tablet wall mount built around a standard keystone jack plate. | [Guide](https://bruhautomation.com/projects/tablet-wall-mount/) |
| [UniFi Camera Mount](unifi-camera-mount/) | Bracket for Ubiquiti UniFi security cameras. |  |
| [Vinyl Mounting Block](vinyl-mounting-block/) | Mounting block for fixing hardware to vinyl siding. |  |

## Around the House  — Fixes, organisers, and upgrades for everyday household annoyances.

| Project | What it is | Guide |
|---|---|---|
| [Childproof Doorknob](childproof-doorknob/) | A low-profile, 3D printed child-proof cover for Schlage Bowery doorknobs. | [Guide](https://bruhautomation.com/projects/childproof-doorknob/) |
| [Christmas Ornaments](christmas-ornaments/) | Smart-home themed ornaments with electronics inside. |  |
| [Cold Air Return Baffle](cold-air-return-baffle/) | HVAC baffle that redirects a cold air return. |  |
| [Couch Cupholder](couch-cupholder/) | A 3D printed cupholder that slips over the arm of a couch, with swappable inserts for different cup sizes. | [Guide](https://bruhautomation.com/projects/couch-cupholder/) |
| [Dinner Bowl Rest](dinner-bowl-rest/) | Dish support that stops bowls tipping on the counter. |  |
| [Duct Cap & Adapter](duct-cap/) | 4" duct adapter and cap, plus a quick-tee for branching an existing run. |  |
| [Folding Wall Hooks](folding-wall-hooks/) | Space-saving hooks that fold flat against the wall. |  |
| [Fridge Drawer Support](fridge-drawer-support/) | Bracket that reinforces a sagging refrigerator drawer. |  |
| [Kitchen Chair Footrest](kitchen-chair-footrest/) | Footrest that clamps onto kitchen chair legs. |  |
| [Magnetic Hook](magnetic-hook/) | Wall-mounted magnetic hook. |  |
| [Magnetic Ring Unlocker](magnetic-ring-unlocker/) | A magnetic ring for quickly unlocking childproof cabinet and gate latches. |  |
| [Outlet Cover](outlet-cover/) | Adds a switched outlet to an existing one. |  |
| [Peltier Bottle Warmer](peltier-bottle-warmer/) | Peltier-driven baby bottle warmer. Prototype photo only — no build files yet. |  |
| [Popup Key Holder](popup-key-holder/) | Spring-loaded key holder that pops the keys up to meet your hand. |  |
| [Village Lights](village-lights/) | Decorative village scene with controllable lighting. |  |
| [Wire Rack Shelf Brackets](wire-rack-shelf-brackets/) | Reinforcement brackets for wire shelving. |  |

## Workshop & Garage  — Tool holders, jigs, and vehicle parts for the shop.

| Project | What it is | Guide |
|---|---|---|
| [DeWalt Router Sled](dewalt-router-sled/) | Router sled and cookie-sheet divider for flattening slabs. |  |
| [DeWalt Screwdriver Holder](dewalt-screwdriver-holder/) | Holder for the DeWalt GYRO screwdriver and its bits. |  |
| [Honda Cupholder](honda-cupholder/) | Cupholder and rail for Honda vehicles. |  |
| [Label Peeler](label-peeler/) | Tool for taking labels off containers cleanly. |  |
| [LED Light for Lawnmower](lawnmower-led-light/) | An aftermarket LED lighting upgrade for mowing after sunset. |  |

## Lab & Science  — Bench equipment and automation for the biotech lab.

| Project | What it is | Guide |
|---|---|---|
| [10mL Syringe Puller](syringe-puller/) | A 3D printed jig for consistent syringe plunger pulling. | [Guide](https://bruhautomation.com/projects/syringe-puller/) |
| [15mL Tube Megarack](15ml-tube-megarack/) | An oversized 3D printed rack for holding large quantities of 15mL tubes. |  |
| [50mL Tube Mixer](50ml-tube-mixer/) | A motorized mixer for 50mL conical tubes — 3D printed, adjustable speed. |  |
| [96-Well Plate Inverter](96-well-plate-inverter/) | A mechanical device for inverting 96-well plates without spilling. |  |
| [BSC Bottle Holder](bsc-bottle-holder/) | A 3D printed bottle holder for organizing reagents inside a biosafety cabinet. | [Guide](https://bruhautomation.com/projects/bsc-bottle-holder/) |
| [Cellcube Bioreactor Controller](cellcube-bioreactor-controller/) | A custom controller for automating Cellcube bioreactors with real-time monitoring and process control. |  |
| [Centrifuge Shaker Mount](centrifuge-shaker-mount/) | Orbital shaker adapter for 225mL centrifuge bottles. |  |
| [Lab Tape Dispenser Clip](tape-dispenser-clip/) | A magnetic or adhesive bench-mounted clip for lab tape dispensers. | [Guide](https://bruhautomation.com/projects/tape-dispenser-clip/) |
| [Microscope Dock](microscope-dock/) | Microscope mounting dock and accessories. |  |
| [Peristaltic Dosing Pump](peristaltic-dosing-pump/) | A custom peristaltic pump for precise, automated reagent dosing. |  |
| [Pipette Controller](pipette-controller/) | Motorised electronic pipette system. |  |
| [Tube Rack for CEDEX BioHT](cedex-tube-rack/) | A custom 3D printed tube rack designed for the CEDEX BioHT analyzer. |  |
| [UV Flashlight](uv-flashlight/) | A portable, 3D printed UV light source for lab use. |  |

## License

See the repository [LICENSE](../LICENSE).
