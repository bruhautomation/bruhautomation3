// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import vercel from '@astrojs/vercel';
import { APPS, OTHER_PROJECTS, groupByCategory, iconMaskUrl, readProjects } from './site/catalog.mjs';

// Draft workflow (see site/scripts/build.mjs and site/content.config.ts):
// A page with `draft: true` is HIDDEN on the Vercel production deployment (the
// live site) and VISIBLE on every Vercel Preview deployment and in local dev.
// Page visibility is enforced by Starlight via the Astro build mode
// (site/scripts/build.mjs maps the deploy env to `--mode`); this flag only
// mirrors that decision for the dev-only "Write Up Pending" sidebar group below,
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
	// A pending project stays in its own category rather than being herded into
	// a list of its own: it is a magnetic hook whether or not the write-up is
	// finished, and someone browsing Around the House is looking for the hook.
	//
	// It is marked with an attribute rather than a Starlight badge. A badge is a
	// pill with a word in it, and fifty-six of them down a sidebar is a wall of
	// yellow that reads as a warning about the site rather than a note about a
	// page. The attribute lets the stylesheet hide these rows until someone asks
	// for them (site/components/PendingToggle.astro) and mark them quietly when
	// they do — see `--- Pending write-ups ---` in site/styles/custom.css.
	items: group.projects.map((p) => ({
		label: p.title,
		slug: `projects/${p.slug}`,
		...(p.pending && { attrs: { 'data-pending': 'true' } }),
	})),
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
// something published, then Apps, then Other Projects — and the nth-child index
// falls out of it. The dev-only drafts group is last and iconless, so it needs
// no entry; anything added *between* these does, or the glyphs slide again.
const sidebarIcons = [
	null,
	...publishedGroups.map((g) => g.icon),
	APPS.icon,
	OTHER_PROJECTS.icon,
];
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
	output: 'static',
	adapter: vercel({
		webAnalytics: { enabled: true }
	}),
	// The repo is sorted by project: `projects/` and `apps/` hold the words,
	// pictures and files; `site/` holds the machinery that renders them.
	srcDir: './site',
	publicDir: './site/public',
	// On the `apps` stage the project URLs have nothing to land on, so they are
	// dropped rather than pointed at a missing page, and the root goes to the
	// add-on docs — the reason the site is up at that stage.
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
				// Starlight's sidebar with the drafted-write-ups switch on top of
				// it. The switch has to render exactly once, and this is the only
				// slot that is on screen at every width — the header's right group
				// is `display: none` below 50rem, and the mobile menu footer is a
				// second copy of the same component.
				Sidebar: './site/components/Sidebar.astro',
				// Renders the "still a draft" notice on a project whose files
				// are published ahead of its prose, and still passes a page's own
				// `banner:` through.
				Banner: './site/components/Banner.astro',
			},
			logo: {
				dark: './site/assets/bruh-logo-light.svg',
				light: './site/assets/bruh-logo-dark.svg',
				replacesTitle: true,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/bruhautomation' },
				{ icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@BRUHAutomation1' },
			],
			customCss: [
				'./site/styles/custom.css',
			],
			head: [
				// The sidebar group icons, generated above from the sidebar's own
				// running order so the two can never drift apart again.
				{ tag: 'style', content: sidebarIconCss },
				// The favicon is the BRUH lockup, cut from the same vector as the
				// header wordmark. Starlight emits the SVG link itself; this is
				// the fallback for anything that won't take an SVG icon, and for
				// the bare `/favicon.ico` request a browser makes anyway.
				{ tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } },
				// iOS composites a home-screen icon onto an opaque tile of its
				// own choosing; this is a deliberate one instead of a guess. It
				// is drawn square, because iOS rounds it again on the way in.
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
				// Set the pending-rows class before first paint. Read in `head`
				// rather than by the toggle's own script, which runs after the
				// sidebar has already been laid out without them.
				{
					tag: 'script',
					content:
						"try{if(localStorage.getItem('bruh:show-pending')==='true')" +
						"document.documentElement.classList.add('show-pending')}catch(e){}",
				},
				// Vercel Web Analytics. This is the same script the
				// `@vercel/analytics` package loads at runtime and nothing else —
				// on a static multi-page site there is no client router to hook,
				// so the package buys a dependency and a build step to arrive at
				// this one tag. Served by Vercel itself at the edge, so it 404s
				// harmlessly in local dev and on any other host.
				//
				// The package's own Astro component was tried first and does not
				// work here: it renders a `<vercel-analytics>` custom element
				// whose client `<script>` never made it into the bundle, so the
				// element shipped on every page with nothing to define it. That
				// failure is silent — no error, no request — which is the whole
				// reason to prefer a tag you can see in `view-source`.
				{ tag: 'script', attrs: { src: '/_vercel/insights/script.js', defer: true } },
				// Amazon OneLink. Product links are written once, tagged for the US
				// store (`brau01-20`); this rewrites them per reader to whichever
				// Amazon marketplace actually ships to them. Without it a reader in
				// the UK follows a link to amazon.com and is told the item cannot be
				// delivered — most of the audience for a 3D print is not in the US.
				// `defer` because it only rewrites anchors already in the document.
				{
					tag: 'script',
					attrs: {
						src: 'https://z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=brau01-20',
						defer: true,
					},
				},
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
										{ label: 'Proposals', slug: 'brain/proposals' },
										{ label: 'Activity', slug: 'brain/activity' },
										{ label: 'Terminal', slug: 'brain/terminal' },
										{ label: 'Memory & Learning', slug: 'brain/memory' },
									],
								},
								// What brAIn works out about this particular house, and
								// the rules that read it. Deliberately its own group:
								// these are not panel tabs, they are the measurements
								// every tab above is expressed against.
								{
									label: 'What It Measures',
									items: [
										{ label: 'What brAIn Measures', slug: 'brain/measurements' },
										{ label: 'House Checks', slug: 'brain/checks' },
										{ label: 'Heating & Climate', slug: 'brain/climate' },
										{ label: 'Shadow Runner & Replay', slug: 'brain/replay' },
										{ label: 'Emergency Playbooks', slug: 'brain/playbooks' },
										{ label: 'Overnight Self-Healing', slug: 'brain/self-healing' },
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
							label: 'BRight',
							items: [
								{ label: 'Overview', slug: 'bright' },
								{ label: 'Quick Start', slug: 'bright/quickstart' },
								{ label: 'How a Show Is Built', slug: 'bright/shows' },
							],
						},
						{
							label: 'BRUH Print',
							items: [
								{ label: 'Overview', slug: 'bruh-print' },
								{ label: 'Quick Start', slug: 'bruh-print/quickstart' },
								{ label: 'Labels, Stock & the Designer', slug: 'bruh-print/labels' },
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
					],
				},
				// Not a BRUH project and not in this repo — just a link out, so
				// there is no page here to send anyone to. Last, after everything
				// the repo can actually show you. These open in the same tab and
				// carry no external marker, which is what every other off-site
				// link here does; the heading is what says they leave the docs.
				{
					label: OTHER_PROJECTS.label,
					collapsed: true,
					items: [
						{ label: 'Endless', link: 'https://endless-devotional.vercel.app/' },
						{ label: 'Pray His Promises', link: 'https://prayhispromises.com/' },
					],
				},
				// Dev-only: in-development (draft) pages, visible under `npm run dev`,
				// omitted from production builds. See `showDrafts` at the top.
				...(showDrafts && draftProjects.length > 0
					? [
							{
								label: '🚧 Write Up Pending',
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
