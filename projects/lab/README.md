# Lab Equipment

Specialized devices and systems for laboratory automation, sample handling, and bioreactor operations. This subfolder contains all lab-specific projects.

## Equipment Categories

### Cell Culture & Bioreactors
- **cellcube-stand** — Advanced platform for cell culture with motorized circulation, Nextion touchscreen, and peristaltic pump integration

### Sample Handling & Processing
- **96-well-plate-inverter** — Motorized inverter for assay plate handling
- **15ml-tube-megarack** — High-capacity storage and organization
- **cedex-tube-rack** — Specialized rack for Cedex analyzer integration
- **centrifuge-shaker-mount** — Orbital shaker adapter for centrifuge bottles

### Liquid Transfer & Pumping
- **pump-controller-housing** — Laser-cut enclosure with Arduino firmware for peristaltic pump control
- **pipette-controller** — Motorized electronic pipette system
- **syringe-puller** — Automated micro-electrode needle fabrication

### Lab Organization & Tools
- **bsc-bottle-holder** — Bottle storage for biological safety cabinet
- **microscope-dock** — Microscope mounting and accessories
- **tape-dispenser-clip** — Bench-top tape dispenser attachment
- **uv-flashlight** — Portable UV light source for gel visualization

---

## Featured Project: Cellcube Stand

The Cellcube Stand is the centerpiece of lab automation. It features:
- **Nextion HMI** — Real-time monitoring and control interface
- **Pump Control** — Automated peristaltic pump operation
- **Motor Control** — Motorized sample circulation
- **Laser-cut Acrylic Panels** — Professional enclosure with thermal management
- **Multi-version Support** — Firmware for different screen sizes (2.5-inch, 5-inch, 10-inch)

See `cellcube-stand/README.md` for detailed specifications.

---

## Featured Project: Pump Controller Housing

Precision-engineered pump control system:
- **Laser-cut Design** — V4 latest, with previous versions archived
- **Arduino Firmware** — Full version history (V1-V6)
- **Modular Construction** — Front, side, and optional swirl panels
- **Integration Ready** — Works with peristaltic pumps and flow control

See `pump-controller-housing/README.md` for specifications.

---

## File Organization

Each lab project follows this structure:

```
[project-name]/
├── README.md                 — Project documentation
├── *.f3d / *.step           — 3D CAD models
├── *.stl                     — 3D-printed parts
├── firmware/                 — Arduino sketches, etc.
├── laser-cut/               — DXF/SVG cutting files
├── nextion-hmi/             — Nextion display HMI files
│   └── old-versions/        — Previous interface versions
└── fritzing/                — Wiring diagrams
```

---

## Active Development

Current focus areas:
- Cellcube Stand firmware updates and HMI optimization
- Pump controller integration and safety improvements
- Sample handling automation expansion

---

Last updated: 2026-03-18
