#!/usr/bin/env python3
"""
Tessellates every `projects/*/cad/*.step` into `projects/*/preview/*.stl` so the
3D viewer can show parts that only exist as CAD.

Run by hand after adding or changing a STEP file, not during the site build:
it needs OpenCascade, which is a heavyweight native dependency and not
something to install on a docs deploy. The output is committed.

    pip install cascadio trimesh numpy
    python3 site/scripts/build-cad-previews.py

A part that already has a hand-exported STL in `models/` is skipped — that file
is the author's, and it wins. Dimensions come out exact (verified against the
hand exports: the keystone plate measures 88.9 x 133.35 x 9.8 mm either way);
what the tolerance controls is how finely curves are approximated, which is why
a part that comes out too heavy to load in a browser is re-tessellated coarser
rather than dropped. These are previews, not print files — the STEP is the
source of record and what the page offers for download.
"""

import glob
import os
import sys
import tempfile

try:
    import cascadio
    import trimesh
except ImportError:
    sys.exit('pip install cascadio trimesh numpy')

trimesh.util.log.setLevel(40)

BUDGET = 800 * 1024  # good enough to load over a phone connection
HARD_CAP = 4 * 1024 * 1024  # past this, no preview is better than a slow one
TOLERANCES = [0.05, 0.15, 0.4, 1.0, 2.5, 6.0]
STEP_TO_MM = 1000.0  # OpenCascade hands back metres; STL is conventionally mm


def convert(step_path):
    """Smallest acceptable tessellation of one STEP file, or None."""
    smallest = None
    for tolerance in TOLERANCES:
        glb = tempfile.mktemp(suffix='.glb')
        try:
            cascadio.step_to_glb(step_path, glb, tol_linear=tolerance, tol_angular=0.3)
            mesh = trimesh.load(glb, force='mesh')
        except Exception as error:  # noqa: BLE001 — report and move on
            print(f'  failed: {error}')
            return None
        finally:
            if os.path.exists(glb):
                os.unlink(glb)

        if not hasattr(mesh, 'faces') or len(mesh.faces) == 0:
            print('  no solid geometry (a sketch or an empty assembly)')
            return None

        mesh.apply_scale(STEP_TO_MM)
        mesh.merge_vertices()
        stl = tempfile.mktemp(suffix='.stl')
        mesh.export(stl)
        size = os.path.getsize(stl)

        if smallest is None or size < smallest[1]:
            if smallest:
                os.unlink(smallest[0])
            smallest = (stl, size, len(mesh.faces), tolerance)
        else:
            os.unlink(stl)

        if size <= BUDGET:
            break

    return smallest


def main():
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    os.chdir(root)
    written = 0
    total = 0

    for step_path in sorted(glob.glob('projects/*/cad/*.step')):
        slug = step_path.split('/')[1]
        stem = os.path.basename(step_path)[: -len('.step')]
        print(f'{slug}/{stem}')

        if os.path.exists(f'projects/{slug}/models/{stem}.stl'):
            print('  skipped: a hand-exported STL already exists')
            continue

        result = convert(step_path)
        if not result:
            continue

        stl, size, faces, tolerance = result
        if size > HARD_CAP:
            print(f'  skipped: still {size // 1024 // 1024} MB at the coarsest setting')
            os.unlink(stl)
            continue

        os.makedirs(f'projects/{slug}/preview', exist_ok=True)
        os.replace(stl, f'projects/{slug}/preview/{stem}.stl')
        written += 1
        total += size
        print(f'  {size // 1024} KB, {faces} faces, tolerance {tolerance}')

    print(f'\n{written} previews, {total / 1024 / 1024:.1f} MB')


if __name__ == '__main__':
    main()
