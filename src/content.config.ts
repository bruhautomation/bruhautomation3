import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Draft visibility (keep this in sync with the same constant in astro.config.mjs):
// pages with `draft: true` are HIDDEN on the Vercel production deployment (the
// live site) and VISIBLE everywhere else — every Vercel Preview deployment and
// local dev — so you can review in-development pages on a preview URL without
// running `npm run dev`. Force it either way with SHOW_DRAFTS=true|false.
const showDrafts =
	process.env.SHOW_DRAFTS != null
		? process.env.SHOW_DRAFTS === 'true'
		: process.env.VERCEL_ENV !== 'production';

const docs = docsSchema();

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		// When drafts should be visible, neutralise each page's `draft` flag so
		// Starlight stops excluding it from the (production-mode) build that
		// Vercel always runs. On the production deployment the flag is left as-is,
		// so `draft: true` pages are excluded from the live site as normal.
		schema: showDrafts
			? (context) =>
					docs(context).transform((data) => ({ ...data, draft: false }))
			: docs,
	}),
};
