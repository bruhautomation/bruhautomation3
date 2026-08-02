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
rather than dropped.

A preview that landed at a printable tolerance is copied into `models/` as well,
so a project that only ever shipped CAD still has something to slice. That is
the whole point of the tolerance ladder: a mesh fine enough to print is a
different artefact from one coarsened to fit a preview budget, and only the
first gets offered as a part. The STEP stays the source of record either way.
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
# Below this chord deviation the mesh is finer than a 0.4 mm nozzle can lay
# down, so the tessellation stops being what limits the print.
PRINTABLE_TOLERANCE = 0.15
# A download is not loaded in a browser, so it only has to be a sane size to
# hand someone — a slicer opens a 25 MB STL without complaint.
PRINTABLE_CAP = 25 * 1024 * 1024
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


def export_printable(step_path):
    """The part at full fidelity, for downloading rather than previewing.

    Same tessellation, no preview budget: a mesh nobody has to load in a browser
    can be as heavy as the geometry actually requires. Returns a temp path, or
    None if even this comes out past `PRINTABLE_CAP`.
    """
    glb = tempfile.mktemp(suffix='.glb')
    try:
        cascadio.step_to_glb(step_path, glb, tol_linear=TOLERANCES[0], tol_angular=0.3)
        mesh = trimesh.load(glb, force='mesh')
    except Exception as error:  # noqa: BLE001 — report and move on
        print(f'  printable export failed: {error}')
        return None
    finally:
        if os.path.exists(glb):
            os.unlink(glb)

    if not hasattr(mesh, 'faces') or len(mesh.faces) == 0:
        return None

    mesh.apply_scale(STEP_TO_MM)
    mesh.merge_vertices()
    stl = tempfile.mktemp(suffix='.stl')
    mesh.export(stl)

    if os.path.getsize(stl) > PRINTABLE_CAP:
        print(f'  printable export skipped: {os.path.getsize(stl) // 1024 // 1024} MB')
        os.unlink(stl)
        return None

    return stl


def main():
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    os.chdir(root)
    written = 0
    total = 0
    printable = 0

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
            print(f'  no preview: still {size // 1024 // 1024} MB at the coarsest setting')
            os.unlink(stl)
            # Too heavy to preview is not too heavy to print. A part that cannot
            # go in the viewer is exactly the one a reader most needs to be able
            # to download, so the printable export is still attempted.
            fine = export_printable(step_path)
            if fine:
                os.makedirs(f'projects/{slug}/models', exist_ok=True)
                os.replace(fine, f'projects/{slug}/models/{stem}.stl')
                printable += 1
                print(f'  printable copy written, '
                      f'{os.path.getsize(f"projects/{slug}/models/{stem}.stl") // 1024} KB')
            continue

        os.makedirs(f'projects/{slug}/preview', exist_ok=True)
        os.replace(stl, f'projects/{slug}/preview/{stem}.stl')
        written += 1
        total += size
        print(f'  {size // 1024} KB, {faces} faces, tolerance {tolerance}')

        # A preview that came out at a printable tolerance is also a printable
        # part, and a project offering a viewer with nothing to download is a
        # project you can look at and not build. `PRINTABLE_TOLERANCE` is finer
        # than any nozzle resolves, so the mesh is not what limits the print —
        # but a part tessellated coarse to fit the preview budget is, and that
        # one stays preview-only rather than shipping as something to slice.
        if tolerance <= PRINTABLE_TOLERANCE:
            os.makedirs(f'projects/{slug}/models', exist_ok=True)
            with open(f'projects/{slug}/preview/{stem}.stl', 'rb') as source:
                data = source.read()
            with open(f'projects/{slug}/models/{stem}.stl', 'wb') as target:
                target.write(data)
            printable += 1
            print('  also exported to models/ — fine enough to print')
        else:
            # The preview had to be coarsened to stay loadable over a phone
            # connection. That budget is the viewer's problem and not the
            # slicer's, so the printable copy is tessellated again at full
            # fidelity and allowed to be as big as it needs to be.
            fine = export_printable(step_path)
            if fine:
                os.makedirs(f'projects/{slug}/models', exist_ok=True)
                os.replace(fine, f'projects/{slug}/models/{stem}.stl')
                printable += 1
                size = os.path.getsize(f'projects/{slug}/models/{stem}.stl')
                print(f'  preview coarsened to {tolerance} mm; printable copy re-cut '
                      f'at {TOLERANCES[0]} mm, {size // 1024} KB')
            else:
                print(f'  preview only: {tolerance} mm is too coarse to print from')

    print(f'\n{written} previews, {total / 1024 / 1024:.1f} MB')
    print(f'{printable} of them fine enough to also ship as printable parts')


if __name__ == '__main__':
    main()
