# BRUH Automation

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

Home automation for everyone — smart home devices, 3D prints, workshop builds
and biotech lab tools by Ben. Open-source designs, print files, ESPHome configs,
and honest build guides.

**Live site:** [bruhautomation.com](https://bruhautomation.com)

## What's Here

This repo is sorted by project. Everything about one project — the guide, the
photos, the print files, the CAD source, the firmware — is in that project's
folder, and nothing about it is anywhere else.

```
bruhautomation3/
├── projects/                # one folder per project
│   └── tablet-wall-mount/
│       ├── README.md        # what it is, what's in the folder, its category
│       ├── index.mdx        # the build guide → /projects/tablet-wall-mount/
│       ├── images/          # photos the guide uses
│       ├── models/          # print-ready STL (the site's 3D viewer loads these)
│       ├── cad/             # Fusion 360 sources and STEP exports
│       └── preview/         # meshes generated from the CAD, so parts that were
│                            #   never exported to STL are still previewable
├── apps/                    # Home Assistant add-on docs
│   ├── brain/               # → /brain/
│   └── bruh-minecraft/      # → /bruh-minecraft/
└── site/                    # the website that renders all of the above
    ├── pages/               # landing page, command generator
    ├── components/          # StlViewer, ThemeToggle, changelog/*
    ├── content/docs/        # the few pages that are neither project nor app
    ├── catalog.mjs          # the categories, and the reader for project metadata
    └── styles/  assets/  public/  scripts/
```

Add a project by adding a folder. The sidebar, the project list and the landing
page counts are all read from `projects/`, so there is no index to update by
hand — see [`projects/README.md`](projects/README.md) for the conventions.

## Categories

Projects are filed by **what they're for**, not how they were made:

| Category | |
|---|---|
| **Home Automation** | Connected devices built with ESPHome and Home Assistant |
| **Mounts & Enclosures** | Mounts, brackets, and cases for gear you already own |
| **Around the House** | Fixes, organisers, and upgrades for everyday household annoyances |
| **Workshop & Garage** | Tool holders, jigs, and vehicle parts for the shop |
| **Lab & Science** | Bench equipment and automation for the biotech lab |

How a project was made is a tag — `3d-print`, `esphome`, `arduino`,
`laser-cut`, `nextion`, `electronics` — because most projects are more than one
of those, and a 3D print for the lab has nothing in common with a 3D print for
the couch beyond the printer. Both live in a project's `README.md` frontmatter,
so re-categorising is a one-line edit that never moves a file or changes a URL.

Project URLs are flat and permanent: `/projects/<folder>/`.

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
| `npm run dev`      | Start dev server at `localhost:4321`        |
| `npm run build`    | Build production site to `./dist/`          |
| `npm run preview`  | Preview the production build locally        |

`dev` and `build` first run `site/scripts/sync-models.mjs`, which mirrors every
`projects/<slug>/models/` folder into `site/public/models/` so the 3D viewer can
reach them. That output is generated and gitignored — the STL in the project
folder is the only copy anyone edits.

## Tech Stack

- [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) — static site framework
- [Three.js](https://threejs.org) — 3D model viewer for STL files
- [Pagefind](https://pagefind.app) — client-side search (auto-generated at build)
- [starlight-image-zoom](https://github.com/HiDeoo/starlight-image-zoom) — lightbox for images

## License

Content and designs are shared openly. Feel free to remix and build on anything here.
