/**
 * Mirrors every `projects/<slug>/models/` folder into `site/public/models/<slug>/`
 * so the 3D viewer and the download links can reach them.
 *
 * The STL that a page previews and the STL you print are the same file, and it
 * lives in the project folder with the CAD it was exported from. Astro can only
 * serve static files out of one public directory, so this hardlinks (falling
 * back to copy) rather than asking anyone to keep a second copy in step by hand
 * — which is exactly what the old `public/models/` tree was, byte for byte.
 *
 * Runs before `dev` and before `build`; the output is generated and gitignored.
 */

import { existsSync, mkdirSync, readdirSync, rmSync, statSync, linkSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectsDir = fileURLToPath(new URL('../../projects', import.meta.url));
const outDir = fileURLToPath(new URL('../public/models', import.meta.url));

// Rebuilt from scratch each run, so a model deleted from a project folder
// stops being served instead of lingering as an orphan nobody remembers.
rmSync(outDir, { recursive: true, force: true });

let files = 0;
let projects = 0;

for (const slug of readdirSync(projectsDir)) {
	const src = join(projectsDir, slug, 'models');
	if (!existsSync(src) || !statSync(src).isDirectory()) continue;

	const dest = join(outDir, slug);
	mkdirSync(dest, { recursive: true });
	projects++;

	for (const name of readdirSync(src)) {
		const from = join(src, name);
		if (!statSync(from).isFile()) continue;
		const to = join(dest, name);
		try {
			linkSync(from, to);
		} catch {
			copyFileSync(from, to); // different filesystem, or a platform without links
		}
		files++;
	}
}

console.log(`sync-models: ${files} model${files === 1 ? '' : 's'} from ${projects} project${projects === 1 ? '' : 's'} → site/public/models/`);
