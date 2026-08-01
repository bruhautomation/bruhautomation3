// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import { APPS, groupByCategory, iconMaskUrl, readProjects } from './site/catalog.mjs';

// Draft workflow (see site/scripts/build.mjs and site/content.config.ts):
// A page with `draft: true` is HIDDEN on the Vercel production deployment (the
// live site) and VISIBLE on every Vercel Preview deployment and in local dev.
// Page visibility is enforced by Starlight via the Astro build mode
// (site/scripts/build.mjs maps the deploy env to `--mode`); this flag only
// mirrors that decision for the dev-only "In Development" sidebar group below,
// so the nav matches the pages that were actually built. The build wrapper
// exports SHOW_DRAFTS during builds; force it manually with
// SHOW_DRAFTS=true|false. To take a draft live, set `draft: false` — it moves
// into its category group on its own.
const showDrafts =
	process.env.SHOW_DRAFTS != null
		? process.env.SHOW_DRAFTS === 'true'
		: process.env.VERCEL_ENV !== 'production';

// The project sidebar is read from the project folders themselves: each
// project's README says which category it belongs to, so adding a project is
// adding a folder and nothing else, and re-filing one is a one-line edit
// inside that folder. See site/catalog.mjs.
const allProjects = readProjects().filter((p) => p.guide);
const publishedGroups = groupByCategory(allProjects.filter((p) => !p.draft));
const projectGroups = publishedGroups.map((group) => ({
	label: group.label,
	collapsed: true,
	items: group.projects.map((p) => ({ label: p.title, slug: `projects/${p.slug}` })),
}));
const draftProjects = allProjects
	.filter((p) => p.draft)
	.sort((a, b) => a.title.localeCompare(b.title))
	.map((p) => ({ label: p.title, slug: `projects/${p.slug}` }));

// Sidebar group icons.
//
// Starlight gives a sidebar group no hook of its own — no id, no class, nothing
// a stylesheet can match on — so the only way to reach one from CSS is by
// position. That is fine as long as the positions are counted from the same
// list that builds the sidebar, and a disaster when they are typed into a
// stylesheet by hand: adding Mounts & Enclosures and Workshop & Garage slid
// every icon one group along (Around the House wore the flask) and pushed the
// Apps icon off the end, where it silently rendered as nothing.
//
// So the rules are generated here. `sidebarIcons` is the running order of the
// top-level groups — Welcome first with no icon, then the categories that have
// something published, then Apps — and the nth-child index falls out of it.
const sidebarIcons = [null, ...publishedGroups.map((g) => g.icon), APPS.icon];
const sidebarIconCss = sidebarIcons
	.map((icon, i) =>
		icon
			? `.top-level > li:nth-child(${i + 1}) > details > summary > .group-label > .large::before {
	content: '';
	display: inline-block;
	width: 1.1em;
	height: 1.1em;
	flex-shrink: 0;
	background-color: currentColor;
	opacity: 0.6;
	-webkit-mask: ${iconMaskUrl(icon)} center / contain no-repeat;
	mask: ${iconMaskUrl(icon)} center / contain no-repeat;
}`
			: ''
	)
	.filter(Boolean)
	.join('\n');

// BRUH Terminal (`/bruh-claude/`) and BRUH Insights (`/bruh-insights/`) were
// merged into brAIn (`/brain/`). Those URLs are in the wild — in the add-on
// changelogs, in YouTube descriptions, in people's bookmarks — so every one of
// them keeps working. Old pages with no direct successor land on the section of
// the merged docs that now covers them, never on a bare index.
const retiredAppUrls = {
	'/bruh-claude/': '/brain/',
	'/bruh-claude/quickstart/': '/brain/quickstart/',
	'/bruh-claude/memory/': '/brain/memory/',
	'/bruh-claude/voice/': '/brain/voice/',
	'/bruh-claude/automations/': '/brain/automations/',
	'/bruh-claude/mcp/': '/brain/mcp/',
	'/bruh-claude/cli/': '/brain/cli/',
	'/bruh-claude/reference/': '/brain/reference/',
	'/bruh-claude/how-claude-controls-ha/': '/brain/how-brain-controls-ha/',
	// The two add-ons are one now, so "using them together" has no successor
	// page; what survived of it is the shared-memory model.
	'/bruh-claude/better-together/': '/brain/memory/',
	'/bruh-claude/changelog/': '/brain/archive/bruh-terminal-changelog/',
	'/bruh-claude/power-tools/': '/brain/power-tools/',
	'/bruh-insights/': '/brain/',
	'/bruh-insights/quickstart/': '/brain/quickstart/',
	'/bruh-insights/how-it-works/': '/brain/insights/',
	'/bruh-insights/reference/': '/brain/reference/',
	'/bruh-insights/changelog/': '/brain/archive/bruh-insights-changelog/',
};

const powerToolsPages = [
	'areas-and-floors',
	'labels',
	'entities',
	'devices-and-integrations',
	'helpers',
	'zones-and-persons',
	'blueprints-and-statistics',
	'dashboards',
	'users',
	'diagnostics-and-repairs',
];

for (const page of powerToolsPages) {
	retiredAppUrls[`/bruh-claude/power-tools/${page}/`] =
		`/brain/power-tools/${page}/`;
}

// Projects used to be filed by three sections — `/smart-home-projects/`,
// `/home-projects/`, `/lab-projects/` — with a `3d-prints/` sub-section under
// two of them, so a project's URL encoded both what it was for and how it was
// made. Every project now lives at `/projects/<folder>/`, flat, because the
// category is frontmatter: re-filing a project is a one-line edit and the link
// people saved still works. These are in the wild — in YouTube descriptions,
// in the GitHub READMEs, in bookmarks — so every one of them keeps working.
const retiredProjectUrls = {
	'/smart-home-projects/bruh-playhouse/': '/projects/playhouse/',
	'/smart-home-projects/hype-button/': '/projects/hype-button/',
	'/smart-home-projects/irrigation-system/': '/projects/irrigation-system/',
	'/smart-home-projects/smart-candlet/': '/projects/smart-candle/',
	'/home-projects/beautiful-childproof-doorknob/': '/projects/childproof-doorknob/',
	'/home-projects/tablet-wall-mount/': '/projects/tablet-wall-mount/',
	'/home-projects/led-light-for-lawnmower/': '/projects/lawnmower-led-light/',
	'/home-projects/3d-prints/couch-cupholder/': '/projects/couch-cupholder/',
	'/home-projects/3d-prints/magnetic-ring-unlocker/': '/projects/magnetic-ring-unlocker/',
	'/lab-projects/50ml-tube-mixer/': '/projects/50ml-tube-mixer/',
	'/lab-projects/96-well-plate-inverter/': '/projects/96-well-plate-inverter/',
	'/lab-projects/cellcube-bioreactor-controller/': '/projects/cellcube-bioreactor-controller/',
	'/lab-projects/peristaltic-dosing-pump/': '/projects/peristaltic-dosing-pump/',
	'/lab-projects/3d-prints/10ml-syringe-puller/': '/projects/syringe-puller/',
	'/lab-projects/3d-prints/15ml-tube-megarack/': '/projects/15ml-tube-megarack/',
	'/lab-projects/3d-prints/bsc-bottle-holder/': '/projects/bsc-bottle-holder/',
	'/lab-projects/3d-prints/lab-tape-dispenser-clip/': '/projects/tape-dispenser-clip/',
	'/lab-projects/3d-prints/tube-rack-for-cedex-bioht/': '/projects/cedex-tube-rack/',
	'/lab-projects/3d-prints/uv-flashlight/': '/projects/uv-flashlight/',
	// The two "3D prints" index pages were link lists of the pages either side
	// of them. The project list is generated from the projects themselves now,
	// so it can never fall behind the way a hand-written list did.
	'/home-projects/3d-prints/overview/': '/project-list/',
	'/lab-projects/3d-prints/overview/': '/project-list/',
};

// A redirect to a page this build didn't produce lands people on the 404 by way
// of a stop they didn't need. The old URLs of pages that are still drafts were
// never live either, so on production they simply stay 404 — and the redirect
// switches itself on with the page the day the draft ships.
const draftSlugs = new Set(draftProjects.map((p) => p.slug.replace(/^projects\//, '')));
const liveProjectUrls = Object.fromEntries(
	Object.entries(retiredProjectUrls).filter(
		([, to]) => showDrafts || !draftSlugs.has(to.replace(/^\/projects\/|\/$/g, ''))
	)
);

// https://astro.build/config
export default defineConfig({
	site: 'https://bruhautomation.com',
	// The repo is sorted by project: `projects/` and `apps/` hold the words,
	// pictures and files; `site/` holds the machinery that renders them.
	srcDir: './site',
	publicDir: './site/public',
	redirects: { ...retiredAppUrls, ...liveProjectUrls },
	integrations: [
		starlight({
			plugins: [starlightImageZoom()],
			title: 'BRUH Automation',
			editLink: { baseUrl: 'https://github.com/bruhautomation/bruhautomation3/edit/main/' },
			lastUpdated: true,
			components: {
				ThemeSelect: './site/components/ThemeToggle.astro',
				// Adds the site version to the header, linking to /changelog/.
				// The changelog is not in the sidebar: a "what changed on the
				// docs site" page does not deserve the same weight as the
				// projects people come here for.
				SocialIcons: './site/components/SocialIcons.astro',
			},
			logo: {
				dark: './site/assets/bruh-logo-light.svg',
				light: './site/assets/bruh-logo-dark.svg',
				replacesTitle: true,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/bruhautomation' },
				{ icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@BRUHAutomation' },
			],
			customCss: [
				'./site/styles/custom.css',
			],
			head: [
				// The sidebar group icons, generated above from the sidebar's own
				// running order so the two can never drift apart again.
				{ tag: 'style', content: sidebarIconCss },
				// Note: no global `description` meta — every page (docs frontmatter,
				// index.astro, command-generator.astro) sets its own, so a global one
				// here would emit a duplicate <meta name="description"> on every page.
				{
					tag: 'meta',
					attrs: {
						property: 'og:type',
						content: 'website',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:site_name',
						content: 'BRUH Automation',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://bruhautomation.com/og-image.png',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:width',
						content: '1200',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:height',
						content: '630',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:alt',
						content: 'BRUH Automation — smart home, maker, and lab projects',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:card',
						content: 'summary_large_image',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:site',
						content: '@braborern',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#1e90ff',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'apple-mobile-web-app-capable',
						content: 'yes',
					},
				},
			],
			sidebar: [
				{
					label: 'Welcome',
					items: [
						{ label: 'Home', link: '/' },
						{ label: 'Projects', slug: 'project-list' },
						{ label: 'Smart Home Fundamentals', slug: 'smart-home-fundamentals' },
					],
				},
				// Home Automation, Mounts & Enclosures, Around the House,
				// Workshop & Garage, Lab & Science — generated from the projects
				// themselves, so a new project folder is a new sidebar entry and
				// a category with nothing published in it does not appear at all.
				...projectGroups,
				{
					label: 'Apps',
					collapsed: true,
					items: [
						{
							label: 'brAIn',
							items: [
								{ label: 'Overview', slug: 'brain' },
								{ label: 'Quick Start', slug: 'brain/quickstart' },
								// The panel's own tabs, in the order they sit in the
								// panel — Insights opens first, so it leads here too.
								{
									label: 'The Panel',
									items: [
										{ label: 'Insights', slug: 'brain/insights' },
										{ label: 'Findings', slug: 'brain/findings' },
										{ label: 'Terminal', slug: 'brain/terminal' },
										{ label: 'Memory & Learning', slug: 'brain/memory' },
									],
								},
								{
									label: 'Beyond the Panel',
									items: [
										{ label: 'Voice Assistant', slug: 'brain/voice' },
										{ label: 'Automations & Insight Jobs', slug: 'brain/automations' },
									],
								},
								{
									label: 'Power Tools',
									collapsed: true,
									items: [
										{ label: 'Overview', slug: 'brain/power-tools' },
										{ label: 'Areas & Floors', slug: 'brain/power-tools/areas-and-floors' },
										{ label: 'Labels', slug: 'brain/power-tools/labels' },
										{ label: 'Entities', slug: 'brain/power-tools/entities' },
										{ label: 'Devices & Integrations', slug: 'brain/power-tools/devices-and-integrations' },
										{ label: 'Helpers', slug: 'brain/power-tools/helpers' },
										{ label: 'Zones & Persons', slug: 'brain/power-tools/zones-and-persons' },
										{ label: 'Blueprints & Statistics', slug: 'brain/power-tools/blueprints-and-statistics' },
										{ label: 'Dashboards', slug: 'brain/power-tools/dashboards' },
										{ label: 'Users', slug: 'brain/power-tools/users' },
										{ label: 'Diagnostics & Repairs', slug: 'brain/power-tools/diagnostics-and-repairs' },
									],
								},
								{
									label: 'Under the Hood',
									collapsed: true,
									items: [
										{ label: 'How brAIn Controls HA', slug: 'brain/how-brain-controls-ha' },
										{ label: 'MCP Tools', slug: 'brain/mcp' },
										{ label: 'The CLI', slug: 'brain/cli' },
									],
								},
								{ label: 'Reference', slug: 'brain/reference' },
								{ label: 'Changelog', slug: 'brain/changelog' },
								{
									label: 'Archive',
									collapsed: true,
									items: [
										{ label: 'BRUH Terminal changelog', slug: 'brain/archive/bruh-terminal-changelog' },
										{ label: 'BRUH Insights changelog', slug: 'brain/archive/bruh-insights-changelog' },
									],
								},
							],
						},
						{
							label: 'BRUH Minecraft',
							items: [
								{ label: 'Overview', slug: 'bruh-minecraft' },
								{ label: 'Quick Start', slug: 'bruh-minecraft/quickstart' },
								{ label: 'Home Assistant Integration', slug: 'bruh-minecraft/home-assistant' },
								{ label: 'Command Generator', link: '/bruh-minecraft/command-generator/' },
								{ label: 'Reference', slug: 'bruh-minecraft/reference' },
								{ label: 'Changelog', slug: 'bruh-minecraft/changelog' },
							],
						},
						// The web apps are links out, not docs. Everything above
						// this line has pages in `apps/`; these two are running
						// sites that document themselves, so the nav sends people
						// there rather than to a stub that would need keeping true.
						// They open in the same tab and carry no external marker,
						// which is what every other off-site link here does — the
						// group label is what says these two leave the docs.
						{
							label: 'Web Apps',
							items: [
								{ label: 'Endless', link: 'https://endless-devotional.vercel.app/' },
								{ label: 'Pray His Promises', link: 'https://prayhispromises.com/' },
							],
						},
					],
				},
				// Dev-only: in-development (draft) pages, visible under `npm run dev`,
				// omitted from production builds. See `showDrafts` at the top.
				...(showDrafts && draftProjects.length > 0
					? [
							{
								label: '🚧 In Development',
								badge: { text: 'Dev only', variant: 'caution' },
								items: draftProjects,
							},
						]
					: []),
				// The site's own changelog is deliberately NOT here. It is
				// reached from the version number in the header (see the
				// SocialIcons override) — a page about what changed on the
				// docs site does not belong beside the projects.
			],
		}),
	],
});
