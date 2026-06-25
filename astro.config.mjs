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

// https://astro.build/config
export default defineConfig({
	site: 'https://bruhautomation.com',
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
				{
					tag: 'meta',
					attrs: {
						name: 'description',
						content: 'Smart home, maker, and lab projects by Ben — open-source designs, 3D print files, and build guides.',
					},
				},
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
						content: '/og-image.png',
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
							label: 'BRUH Claude',
							items: [
								{ label: 'Overview', slug: 'bruh-claude' },
								{ label: 'Quick Start', slug: 'bruh-claude/quickstart', badge: { text: 'Start here', variant: 'tip' } },
								{ label: 'Reference', slug: 'bruh-claude/reference' },
								{ label: 'Changelog', slug: 'bruh-claude/changelog' },
							],
						},
						{
							label: 'BRUH Minecraft Server',
							items: [
								{ label: 'Overview', slug: 'bruh-minecraft' },
								{ label: 'Quick Start', slug: 'bruh-minecraft/quickstart', badge: { text: 'Start here', variant: 'tip' } },
								{ label: 'Reference', slug: 'bruh-minecraft/reference' },
								{ label: 'Changelog', slug: 'bruh-minecraft/changelog' },
								{ label: 'Command Generator', link: '/bruh-minecraft/command-generator/', badge: { text: 'New', variant: 'tip' } },
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
