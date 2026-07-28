#!/usr/bin/env node
/**
 * Guardrail for the Detail slider (src/components/Detail.astro).
 *
 * The authoring rule is that every page must read as a complete document at
 * level 1 (Overview) — level 1 is the default a first-time visitor sees, not
 * a stripped-down leftover. This script parses every docs page that uses
 * <Detail> and:
 *
 *   - fails the build on unbalanced <Detail>/</Detail> tags or invalid
 *     min/max/only attributes;
 *   - fails the build if a page's level-1 rendering falls below a minimum
 *     word count (a page that is all gated content);
 *   - warns when level 1 looks thin, so it gets a human look.
 *
 * Run standalone: node scripts/check-detail-levels.mjs
 * Wired into the production build by scripts/build.mjs.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DOCS_ROOT = 'src/content/docs';
const FAIL_BELOW_WORDS = 80;
const WARN_BELOW_WORDS = 160;

function* walk(dir) {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) yield* walk(path);
		else if (/\.mdx?$/.test(name)) yield path;
	}
}

/** Words in a chunk of MDX source, ignoring markup and code fences. */
function countWords(text) {
	return text
		.replace(/^---[\s\S]*?---/, '') // frontmatter
		.replace(/^import .*$/gm, '')
		.replace(/```[\s\S]*?```/g, ' ') // code fences don't count as prose
		.replace(/<[^>]+>/g, ' ') // tags
		.replace(/[|#>*`\-_:[\]()!]/g, ' ') // markdown punctuation
		.split(/\s+/)
		.filter((w) => /\w/.test(w)).length;
}

const OPEN_TAG = /<Detail\b([^>]*)>/;
const attrNum = (attrs, name) => {
	const m = attrs.match(new RegExp(`${name}=\\{(\\d+)\\}`));
	return m ? parseInt(m[1], 10) : null;
};

let failed = false;
let checked = 0;

for (const file of walk(DOCS_ROOT)) {
	const src = readFileSync(file, 'utf8');
	if (!src.includes('<Detail')) continue;
	checked++;

	// Tokenise into open tags, close tags, and everything between.
	const tokens = src.split(/(<Detail\b[^>]*>|<\/Detail>)/);
	const stack = [];
	let level1Text = '';
	let ok = true;

	for (const token of tokens) {
		const open = token.match(OPEN_TAG);
		if (open) {
			const attrs = open[1];
			const only = attrNum(attrs, 'only');
			const lo = only ?? attrNum(attrs, 'min') ?? 1;
			const hi = only ?? attrNum(attrs, 'max') ?? 3;
			if (lo < 1 || hi > 3 || lo > hi) {
				console.error(`✖ ${file}: invalid <Detail> range min=${lo} max=${hi}`);
				failed = ok = false;
			}
			const parent = stack[stack.length - 1] ?? { lo: 1, hi: 3 };
			stack.push({ lo: Math.max(parent.lo, lo), hi: Math.min(parent.hi, hi) });
		} else if (token === '</Detail>') {
			if (!stack.pop()) {
				console.error(`✖ ${file}: </Detail> with no matching <Detail>`);
				failed = ok = false;
			}
		} else {
			const scope = stack[stack.length - 1] ?? { lo: 1, hi: 3 };
			if (scope.lo <= 1 && scope.hi >= 1) level1Text += token;
		}
	}

	if (stack.length) {
		console.error(`✖ ${file}: ${stack.length} unclosed <Detail> tag(s)`);
		failed = ok = false;
	}
	if (!ok) continue;

	const words = countWords(level1Text);
	if (words < FAIL_BELOW_WORDS) {
		console.error(
			`✖ ${file}: only ~${words} words visible at Detail level 1 (minimum ${FAIL_BELOW_WORDS}). ` +
				'Level 1 must read as a complete page.',
		);
		failed = true;
	} else if (words < WARN_BELOW_WORDS) {
		console.warn(`⚠ ${file}: level 1 looks thin (~${words} words) — worth a read-through.`);
	}
}

if (failed) {
	console.error('\nDetail-level check failed.');
	process.exit(1);
}
console.log(`✓ Detail-level check passed (${checked} page(s) using <Detail>).`);
