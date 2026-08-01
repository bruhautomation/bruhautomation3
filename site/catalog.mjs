// The project taxonomy, and the reader that turns the `projects/` folders into
// the sidebar, the project list and the landing page counts.
//
// A project's category lives in the frontmatter of its own README.md — one
// fact, one place, inside the folder it describes — so re-categorising is a
// one-line edit that never moves a file or changes a URL. Project URLs are flat
// (`/projects/<folder>/`) for the same reason: the category is metadata, not a
// path segment. Every project folder has a README (it is what GitHub shows when
// you open the folder); only the ones with a written guide also have an
// `index.md(x)`, and that is the only file the site publishes as a page.
//
// This module is imported by `astro.config.mjs` (to build the sidebar) and by
// the pages, so it is plain Node with no dependencies — the Astro content
// collection does not exist yet while the config is still being read.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Where every project folder lives.
 *
 * Resolved from the working directory, not from `import.meta.url`: the pages
 * that import this module are bundled into `dist/` before they run, so a path
 * relative to this file would point inside the build output. Astro is always
 * invoked from the repo root — by `npm run dev`, by `npm run build`, and by
 * Vercel — so the working directory is the one fixed point both callers share.
 */
export const PROJECTS_DIR = join(process.cwd(), 'projects');

/**
 * The five categories, in the order they appear everywhere on the site.
 *
 * They describe what a project is *for*, not how it was made — a 3D print is a
 * technique, not a category, and sorting by technique is what left one bucket
 * holding a doorknob, a router sled and a lab tube rack. How it was made is a
 * tag (`3d-print`, `esphome`, `arduino`, `laser-cut`), and a project can carry
 * as many of those as it needs.
 */
export const CATEGORIES = [
	{
		id: 'home-automation',
		label: 'Home Automation',
		blurb: 'Connected devices built with ESPHome and Home Assistant.',
	},
	{
		id: 'mounts-enclosures',
		label: 'Mounts & Enclosures',
		blurb: 'Mounts, brackets, and cases for gear you already own.',
	},
	{
		id: 'around-the-house',
		label: 'Around the House',
		blurb: 'Fixes, organisers, and upgrades for everyday household annoyances.',
	},
	{
		id: 'workshop-garage',
		label: 'Workshop & Garage',
		blurb: 'Tool holders, jigs, and vehicle parts for the shop.',
	},
	{
		id: 'lab-science',
		label: 'Lab & Science',
		blurb: 'Bench equipment and automation for the biotech lab.',
	},
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

/** Tag → display label. Tags say how a project was built. */
export const TAGS = {
	'3d-print': '3D Print',
	esphome: 'ESPHome',
	'home-assistant': 'Home Assistant',
	arduino: 'Arduino',
	'laser-cut': 'Laser Cut',
	nextion: 'Nextion',
	electronics: 'Electronics',
};

/**
 * Minimal frontmatter reader: top-level `key: value` pairs only, which is all
 * the sidebar needs. Indented lines (Starlight's `hero:` block, for example)
 * belong to the key above them and are skipped.
 */
function readFrontmatter(file) {
	const raw = readFileSync(file, 'utf8');
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return {};
	const data = {};
	for (const line of match[1].split(/\r?\n/)) {
		const pair = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
		if (!pair) continue; // indented or blank — part of the value above
		let [, key, value] = pair;
		value = value.trim().replace(/\s+#.*$/, '');
		if (value === '') data[key] = '';
		else if (value === 'true' || value === 'false') data[key] = value === 'true';
		else if (value.startsWith('[')) {
			data[key] = value
				.replace(/^\[|\]$/g, '')
				.split(',')
				.map((v) => v.trim().replace(/^['"]|['"]$/g, ''))
				.filter(Boolean);
		} else data[key] = value.replace(/^['"]|['"]$/g, '');
	}
	return data;
}

/** The `# Heading` and the paragraph under it, for a README with no guide. */
function readHeadings(file) {
	const body = readFileSync(file, 'utf8').replace(/^---[\s\S]*?\n---\n/, '');
	const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
	const summary = body
		.split(/\r?\n/)
		.slice(body.split(/\r?\n/).findIndex((l) => l.startsWith('# ')) + 1)
		.find((l) => l.trim() && !l.startsWith('#'))
		?.trim();
	return { title, summary };
}

/**
 * Every project folder, as `{ slug, title, summary, category, tags, status,
 * guide, draft }`.
 *
 * `guide` is true when the folder has an `index.md(x)`, which is the only thing
 * that makes it a page on the site; the rest are source files people find
 * through the project list and read on GitHub. A project whose README is
 * missing or has no known `category` throws — a project that quietly vanishes
 * from the sidebar is worse than a build that stops and says which folder.
 */
export function readProjects() {
	const projects = [];
	for (const slug of readdirSync(PROJECTS_DIR, { withFileTypes: true })
		.filter((e) => e.isDirectory())
		.map((e) => e.name)
		.sort()) {
		const readme = join(PROJECTS_DIR, slug, 'README.md');
		if (!existsSync(readme)) {
			throw new Error(`projects/${slug}: every project folder needs a README.md.`);
		}

		const meta = readFrontmatter(readme);
		if (!CATEGORY_IDS.includes(meta.category)) {
			throw new Error(
				`projects/${slug}/README.md needs \`category:\` set to one of ` +
					`${CATEGORY_IDS.join(', ')} (got ${JSON.stringify(meta.category)}).`
			);
		}

		// A guide's own frontmatter wins for title and summary, so the sidebar
		// entry and the page heading can never disagree.
		const guideFile = ['index.mdx', 'index.md']
			.map((name) => join(PROJECTS_DIR, slug, name))
			.find(existsSync);
		const guide = guideFile ? readFrontmatter(guideFile) : null;
		const fallback = readHeadings(readme);

		projects.push({
			slug,
			title: guide?.title || fallback.title || slug,
			summary: guide?.description || fallback.summary || '',
			category: meta.category,
			tags: Array.isArray(meta.tags) ? meta.tags : [],
			status: meta.status || 'complete',
			guide: Boolean(guideFile),
			draft: guide?.draft === true,
		});
	}
	return projects;
}

/**
 * Projects grouped into `CATEGORIES` order, titles A–Z within a group. Empty
 * categories are dropped — a heading with nothing under it is a dead end.
 */
export function groupByCategory(projects) {
	return CATEGORIES.map((category) => ({
		...category,
		projects: projects
			.filter((p) => p.category === category.id)
			.sort((a, b) => a.title.localeCompare(b.title)),
	})).filter((group) => group.projects.length > 0);
}

/** Where a project is read: its guide if it has one, its folder on GitHub if not. */
export function projectHref(project) {
	return project.guide
		? `/projects/${project.slug}/`
		: `${REPO_URL}/tree/main/projects/${project.slug}`;
}

export const REPO_URL = 'https://github.com/bruhautomation/bruhautomation3';
