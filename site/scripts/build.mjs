import { spawnSync } from 'node:child_process';

/**
 * Build wrapper that controls draft-page visibility via the Astro build mode.
 *
 * Starlight only excludes `draft: true` pages when a build runs with
 * `import.meta.env.MODE === 'production'`. We therefore map the deploy
 * environment to Astro's `--mode` here, instead of rewriting each page's
 * `draft` flag in site/content.config.ts.
 *
 * Why not rewrite the flag: Astro's content layer caches parsed entry data
 * (which would include a neutralised `draft: false`) under `.astro/`. Vercel can
 * reuse a build cache across deployments, so a Preview build's cache could be
 * restored for a Production build and leak the in-development pages onto the live
 * site. Driving visibility purely by build mode is immune to that — the `draft`
 * frontmatter is never mutated, so a production build always drops drafts no
 * matter what cache is present.
 *
 * drafts: shown on Vercel Preview + local dev, hidden on Vercel Production.
 * Override either way with SHOW_DRAFTS=true|false.
 */
const showDrafts =
	process.env.SHOW_DRAFTS != null
		? process.env.SHOW_DRAFTS === 'true'
		: process.env.VERCEL_ENV !== 'production';

const mode = showDrafts ? 'preview' : 'production';

const result = spawnSync(`npx astro build --mode ${mode}`, {
	stdio: 'inherit',
	shell: true,
	// Export the resolved decision so astro.config.mjs renders the matching
	// "Write Up Pending" sidebar group (it reads SHOW_DRAFTS / VERCEL_ENV).
	env: { ...process.env, SHOW_DRAFTS: String(showDrafts) },
});

if (result.error) {
	console.error(result.error);
	process.exit(1);
}
process.exit(result.status ?? 1);
