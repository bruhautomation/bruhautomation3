import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Where the words live. Three roots, one collection:
//
//   projects/<slug>/index.mdx   → /projects/<slug>/    one folder per project,
//                                                      holding its guide, its
//                                                      photos, its STLs and its
//                                                      CAD source
//   apps/<app>/**.mdx           → /<app>/…             the add-on docs. The
//                                                      `apps/` segment is
//                                                      dropped so /brain/ and
//                                                      /bruh-minecraft/ — which
//                                                      are printed inside the
//                                                      add-ons themselves —
//                                                      keep working
//   site/content/docs/**.mdx    → /…                   the few pages that are
//                                                      neither: 404, the
//                                                      project list, the site
//                                                      changelog, fundamentals
//
// Starlight's own `docsLoader()` is hard-wired to `src/content/docs`, so this
// is a plain glob loader with the same pattern shape (a leading `_` still
// means "not a page") over the three roots.
//
// Only `projects/*/index.md(x)` is a page. A project folder's README.md is for
// people reading the repo on GitHub and is never published — which is what
// lets a project keep both without one of them turning into a stray URL.
const projectsLoader = glob({
	base: '.',
	pattern: [
		'projects/*/index.{md,mdx}',
		'apps/**/[^_]*.{md,mdx}',
		'site/content/docs/**/[^_]*.{md,mdx}',
	],
	generateId: ({ entry }) =>
		entry
			.replace(/\.(md|mdx)$/, '')
			.replace(/^apps\//, '')
			.replace(/^site\/content\/docs\//, '')
			.replace(/(^|\/)index$/, '$1')
			.replace(/\/$/, ''),
});

// Draft pages (`draft: true`) are hidden on the production site and visible on
// Vercel Preview deploys + local dev. Visibility is controlled by the Astro
// build mode, not here: Starlight drops drafts whenever
// `import.meta.env.MODE === 'production'`, and site/scripts/build.mjs maps the
// deploy environment to that mode. We deliberately leave the schema unmodified
// (no rewriting of the `draft` flag) so the content-layer cache can never carry
// a neutralised flag from a Preview build into a Production build and leak
// drafts onto the live site. See site/scripts/build.mjs and astro.config.mjs.
// A project's category and tags are NOT page frontmatter — they live in the
// project's README.md, next to the files they describe, and are read by
// site/catalog.mjs. One fact, one place: the sidebar, the project list and the
// landing page all read that, and a guide page never has to agree with it.
// `pending: true` means the files are in the repo and the write-up is not
// finished. Everything the reader sees calls that a *drafted* write-up; the flag
// keeps the older name so that the class, the storage key and the frontmatter on
// four dozen pages do not all have to move at once. It is emphatically not
// `draft:` — a `draft:` page is hidden, and these are deliberately published. The point is that someone looking for a part can find it, print it
// and read the config today, and knows before they start that the prose around
// it is still coming. The flag drives three things: the banner at the top of the
// page (site/components/Banner.astro), the badge beside it in the sidebar, and
// how it is listed on the project list — all read from this one field.
export const collections = {
	docs: defineCollection({
		loader: projectsLoader,
		schema: docsSchema({
			extend: z.object({ pending: z.boolean().default(false) }),
		}),
	}),
};
