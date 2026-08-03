---
category: around-the-house
tags: [3d-print]
status: complete
---

# Outlet Cover

Adds a switched outlet to an existing one. A printed cover stands off the wall
far enough to carry a WiFi relay in front of the drywall, the receptacle's brass
tab gets snapped off, and the top socket becomes a Home Assistant switch while
the bottom one stays always on.

The relay lives in the cover rather than in the box for two reasons: a 1-gang
box with a receptacle and two cables in it has no room left, and a steel box is
a shield the module's antenna never gets out of.

## Hardware

- 3D-printed outlet cover bracket, PETG — it sits over live terminals and a
  relay that makes heat, and PLA creeps
- Control relay — Shelly Plus 1 PM for one switched socket, or Shelly 2.5 if you
  want both halves switched independently
- Duplex receptacle with a break-off tab (any standard one; a new tamper-
  resistant Leviton is a dollar fifty)
- #6-32 wall plate screws, 20 mm — the stock 13 mm screws don't reach through a
  cover that stands off the wall
- Lever nuts for the line and neutral pigtails
- Non-contact voltage tester

The printed part is a mechanical cover, not a listed electrical enclosure. The
relay's own moulded case is the insulation, so leave it on, and never put a bare
hobby relay board in there. Where code wants an approved enclosure, use one.

Not on a GFCI receptacle — kitchens, bathrooms, garages, basements and anything
outdoors are out.

The build guide, the wiring and the traps are in [`index.mdx`](index.mdx).
