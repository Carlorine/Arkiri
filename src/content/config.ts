import { defineCollection, z } from "astro:content";

/** Accept a YAML date or a quoted date string. Empty values stay empty. */
function dateInput(value: unknown): unknown {
	if (value == null || value === "") return undefined;
	return value;
}

const publishedDate = z.preprocess(dateInput, z.coerce.date());
const optionalDate = z.preprocess(dateInput, z.coerce.date().optional());

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: publishedDate,
		updated: optionalDate.optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
