// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';

// Draft workflow (see scripts/build.mjs and src/content.config.ts):
// A page with `draft: true` is HIDDEN on the Vercel production deployment (the
// live site) and VISIBLE on every Vercel Preview deployment and in local dev.
// Page visibility is enforced by Starlight via the Astro build mode
// (scripts/build.mjs maps the deploy env to `--mode`); this flag only mirrors
// that decision for the dev-only "In Development" sidebar group below, so the
// nav matches the pages that were actually built. The build wrapper exports
// SHOW_DRAFTS during builds; force it manually with SHOW_DRAFTS=true|false. To
// take a draft live: set `draft: false` and move its sidebar entry into the
// matching category group.
const showDrafts =
	process.env.SHOW_DRAFTS != null
		? process.env.SHOW_DRAFTS === 'true'
		: process.env.VERCEL_ENV !== 'production';

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

// https://astro.build/config
export default defineConfig({
	site: 'https://bruhautomation.com',
	redirects: retiredAppUrls,
	integrations: [
		starlight({
			plugins: [starlightImageZoom()],
			title: 'BRUH Automation',
			editLink: { baseUrl: 'https://github.com/bruhautomation/bruhautomation3/edit/main/' },
			lastUpdated: true,
			components: {
				ThemeSelect: './src/components/ThemeToggle.astro',
			},
			logo: {
				dark: './src/assets/bruh-logo-light.svg',
				light: './src/assets/bruh-logo-dark.svg',
				replacesTitle: true,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/bruhautomation' },
				{ icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@BRUHAutomation' },
			],
			customCss: [
				'./src/styles/custom.css',
			],
			head: [
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
				{
					label: 'Smart Home',
					collapsed: true,
					items: [
						{ label: 'BRUH Playhouse', slug: 'smart-home-projects/bruh-playhouse' },
						{ label: 'Hype Button', slug: 'smart-home-projects/hype-button' },
						{ label: 'Irrigation System', slug: 'smart-home-projects/irrigation-system' },
						{ label: 'Smart Candle', slug: 'smart-home-projects/smart-candlet' },
					],
				},
				{
					label: 'Maker',
					collapsed: true,
					items: [
						{ label: 'Childproof Doorknob', slug: 'home-projects/beautiful-childproof-doorknob' },
						{ label: 'Couch Cupholder', slug: 'home-projects/3d-prints/couch-cupholder' },
						{ label: 'Tablet Wall Mount', slug: 'home-projects/tablet-wall-mount' },
					],
				},
				{
					label: 'Lab',
					collapsed: true,
					items: [
						{ label: '10mL Syringe Puller', slug: 'lab-projects/3d-prints/10ml-syringe-puller' },
						{ label: 'BSC Bottle Holder', slug: 'lab-projects/3d-prints/bsc-bottle-holder' },
						{ label: 'Tape Dispenser Clip', slug: 'lab-projects/3d-prints/lab-tape-dispenser-clip' },
					],
				},
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
					],
				},
				// Dev-only: in-development (draft) pages, visible under `npm run dev`,
				// omitted from production builds. See `showDrafts` at the top.
				...(showDrafts
					? [
							{
								label: '🚧 In Development',
								badge: { text: 'Dev only', variant: 'caution' },
								items: [
									{ label: 'LED Light for Lawnmower', slug: 'home-projects/led-light-for-lawnmower' },
									{ label: 'Magnetic Ring Unlocker', slug: 'home-projects/3d-prints/magnetic-ring-unlocker' },
									{ label: '3D Prints Overview', slug: 'home-projects/3d-prints/overview' },
									{ label: '15mL Tube Megarack', slug: 'lab-projects/3d-prints/15ml-tube-megarack' },
									{ label: '50mL Tube Mixer', slug: 'lab-projects/50ml-tube-mixer' },
									{ label: '96-Well Plate Inverter', slug: 'lab-projects/96-well-plate-inverter' },
									{ label: 'CEDEX BioHT Tube Rack', slug: 'lab-projects/3d-prints/tube-rack-for-cedex-bioht' },
									{ label: 'Cellcube Bioreactor Controller', slug: 'lab-projects/cellcube-bioreactor-controller' },
									{ label: 'Peristaltic Dosing Pump', slug: 'lab-projects/peristaltic-dosing-pump' },
									{ label: 'UV Flashlight', slug: 'lab-projects/3d-prints/uv-flashlight' },
								],
							},
						]
					: []),
				{
					label: 'Changelog',
					slug: 'changelog',
				},
			],
		}),
	],
});
