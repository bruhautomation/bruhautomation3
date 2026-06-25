import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Draft pages (`draft: true`) are hidden on the production site and visible on
// Vercel Preview deploys + local dev. Visibility is controlled by the Astro
// build mode, not here: Starlight drops drafts whenever
// `import.meta.env.MODE === 'production'`, and scripts/build.mjs maps the deploy
// environment to that mode. We deliberately leave the schema unmodified (no
// rewriting of the `draft` flag) so the content-layer cache can never carry a
// neutralised flag from a Preview build into a Production build and leak drafts
// onto the live site. See scripts/build.mjs and astro.config.mjs.
export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
