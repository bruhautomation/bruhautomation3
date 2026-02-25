# BRUH Automation

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

Home automation for everyone — DIY smart home, maker, and biotech lab projects by Ben. Open-source designs, 3D print files, ESPHome configs, and honest build guides.

**Live site:** [bruhautomation.com](https://bruhautomation.com)

## What's Here

This repo contains the source for the BRUH Automation docs site, built with [Astro Starlight](https://starlight.astro.build). The site covers three categories of projects:

- **Smart Home** — IoT and connected devices powered by ESPHome and Home Assistant (irrigation system, smart candlet, hype button, playhouse)
- **Home Projects** — 3D prints, mods, and maker builds (tablet wall mount, childproof doorknob, couch cupholder)
- **Lab Projects** — Biotech automation tools and 3D-printed lab accessories (bioreactor controller, dosing pump, tube mixer, plate inverter)

Most projects include downloadable STL/STEP files and an interactive 3D model viewer powered by Three.js.

## Getting Started

```bash
npm install
npm run dev
```

The dev server starts at `localhost:4321`.

## Commands

| Command            | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`      | Install dependencies                        |
| `npm run dev`      | Start dev server at `localhost:4321`         |
| `npm run build`    | Build production site to `./dist/`           |
| `npm run preview`  | Preview the production build locally         |

## Project Structure

```
src/
├── assets/
│   ├── bruh-logo-dark.svg      # Header logo (dark theme)
│   ├── bruh-logo-light.svg     # Header logo (light theme)
│   └── images/                 # Optimized images (processed by Astro)
├── components/
│   └── StlViewer.astro         # Interactive 3D model viewer
├── content/docs/
│   ├── index.mdx               # Landing page
│   ├── smart-home-projects/    # Smart home project pages
│   ├── home-projects/          # Home/maker project pages
│   ├── lab-projects/           # Lab automation project pages
│   ├── project-list.md         # Full project directory
│   └── changelog.md            # Site updates
└── styles/
    └── custom.css              # Brand accent colors and layout tweaks

public/
├── images/                     # Static images organized by project
├── models/                     # STL and STEP files for 3D printing
│   ├── couch-cupholder/
│   ├── doorknob/
│   └── tablet-wall-mount/
├── favicon.svg
├── og-image.png
└── robots.txt
```

## Tech Stack

- [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) — static site framework
- [Three.js](https://threejs.org) — 3D model viewer for STL files
- [Pagefind](https://pagefind.app) — client-side search (auto-generated at build)
- [starlight-image-zoom](https://github.com/HiDeoo/starlight-image-zoom) — lightbox for images

## License

Content and designs are shared openly. Feel free to remix and build on anything here.
