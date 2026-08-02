/**
 * How much of the site this build publishes.
 *
 * `full` is everything. `apps` is the add-on documentation and nothing else —
 * brAIn and BRUH Minecraft, plus the changelog and the 404 page, which are
 * infrastructure rather than content. It exists so the add-ons' "Full
 * documentation" links can resolve against a finished site while the project
 * guides are still being written.
 *
 * Set `SITE_STAGE=apps` in the Vercel project to gate; remove it to publish
 * everything. Nothing in `projects/` is deleted, moved or marked in either
 * mode — the switch decides what gets built, so going back is removing an
 * environment variable rather than editing sixty-four files back.
 *
 * This is deliberately a separate axis from `draft:`. A draft is one page its
 * author has not finished; the stage is how much of a finished site is open
 * yet. Collapsing them would mean marking every project draft to gate them and
 * then unpicking which ones were *actually* drafts on the way back.
 *
 * Read by astro.config.mjs (sidebar, redirects), site/content.config.ts (which
 * files become pages) and site/pages/index.astro (which sends the root to the
 * add-on docs when there is no project list to land on). All three must agree,
 * so all three read it here.
 */

/** Everything the `apps` stage publishes, as content-collection glob patterns. */
export const APPS_ONLY_PATTERNS = [
	'apps/**/[^_]*.{md,mdx}',
	// The changelog and the 404 are the site's own furniture. Without the 404
	// a stale link gets Vercel's default error page instead of this one.
	'site/content/docs/changelog.{md,mdx}',
	'site/content/docs/404.{md,mdx}',
];

export const SITE_STAGE = process.env.SITE_STAGE === 'apps' ? 'apps' : 'full';

/** True when only the add-on docs are published. */
export const APPS_ONLY = SITE_STAGE === 'apps';

/** Where the root sends people when there is no landing page to show. */
export const APPS_ONLY_HOME = '/brain/';
