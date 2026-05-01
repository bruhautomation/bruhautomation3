// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';

// https://astro.build/config
export default defineConfig({
	site: 'https://bruhautomation.com',
	integrations: [
		starlight({
			plugins: [starlightImageZoom()],
			title: 'BRUH Automation',
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
						{ label: 'LED Light for Lawnmower', slug: 'home-projects/led-light-for-lawnmower' },
						{ label: 'Magnetic Ring Unlocker', slug: 'home-projects/3d-prints/magnetic-ring-unlocker' },
						{ label: 'Tablet Wall Mount', slug: 'home-projects/tablet-wall-mount' },
					],
				},
				{
					label: 'Lab',
					collapsed: true,
					items: [
						{ label: '10mL Syringe Puller', slug: 'lab-projects/3d-prints/10ml-syringe-puller' },
						{ label: '15mL Tube Megarack', slug: 'lab-projects/3d-prints/15ml-tube-megarack' },
						{ label: '50mL Tube Mixer', slug: 'lab-projects/50ml-tube-mixer' },
						{ label: '96-Well Plate Inverter', slug: 'lab-projects/96-well-plate-inverter' },
						{ label: 'BSC Bottle Holder', slug: 'lab-projects/3d-prints/bsc-bottle-holder' },
						{ label: 'CEDEX BioHT Tube Rack', slug: 'lab-projects/3d-prints/tube-rack-for-cedex-bioht' },
						{ label: 'Cellcube Bioreactor Controller', slug: 'lab-projects/cellcube-bioreactor-controller' },
						{ label: 'Peristaltic Dosing Pump', slug: 'lab-projects/peristaltic-dosing-pump' },
						{ label: 'Tape Dispenser Clip', slug: 'lab-projects/3d-prints/lab-tape-dispenser-clip' },
						{ label: 'UV Flashlight', slug: 'lab-projects/3d-prints/uv-flashlight' },
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
								{ label: 'Installation', slug: 'bruh-claude/installation' },
								{ label: 'Features & Usage', slug: 'bruh-claude/features' },
								{ label: 'Configuration', slug: 'bruh-claude/configuration' },
								{ label: 'CLI Tools', slug: 'bruh-claude/cli-tools' },
								{ label: 'Integrations', slug: 'bruh-claude/integrations' },
								{ label: 'Architecture', slug: 'bruh-claude/architecture' },
								{ label: 'Troubleshooting', slug: 'bruh-claude/troubleshooting' },
							],
						},
						{
							label: 'BRUH Minecraft Server',
							items: [
								{ label: 'Overview', slug: 'bruh-minecraft' },
								{ label: 'Installation', slug: 'bruh-minecraft/installation' },
								{ label: 'Features & Usage', slug: 'bruh-minecraft/features' },
								{ label: 'Configuration', slug: 'bruh-minecraft/configuration' },
								{ label: 'Management Panel', slug: 'bruh-minecraft/panel' },
								{ label: 'HA Integration', slug: 'bruh-minecraft/integrations' },
								{ label: 'Troubleshooting', slug: 'bruh-minecraft/troubleshooting' },
							],
						},
					],
				},
				{
					label: 'Changelog',
					slug: 'changelog',
				},
			],
		}),
	],
});
