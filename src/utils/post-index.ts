import type { CollectionEntry } from "astro:content";

/**
 * No.001, No.002, ... — a real, stable number for every published post.
 *
 * The list is sorted newest-first (as getSortedPosts() returns it), so the
 * oldest post is No.001 and new posts only ever append a higher number.
 * The same map is used by the home list, the archive, the article header and
 * the previous/next rows, so a post carries one number everywhere.
 */
export function makePostNumbers(
	posts: CollectionEntry<"posts">[],
): Map<string, string> {
	const numbers = new Map<string, string>();
	const total = posts.length;
	posts.forEach((post, index) => {
		numbers.set(post.slug, `No.${String(total - index).padStart(3, "0")}`);
	});
	return numbers;
}

/** 2026.10.12 — the date style the kit uses in fields. */
export function efDate(date: Date): string {
	return date.toISOString().substring(0, 10).replace(/-/g, ".");
}
