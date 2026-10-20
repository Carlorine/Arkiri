<script lang="ts">
import { onMount } from "svelte";

import I18nKey from "../i18n/i18nKey";
import { getTranslation, i18n } from "../i18n/translation";
import { getPostUrlBySlug } from "../utils/url-utils";

type ArchivePostData = {
	title: string;
	tags: string[];
	/* the collection schema allows null here */
	category?: string | null;
	published: Date | string;
};

type ArchivePost = {
	slug: string;
	data: ArchivePostData;
};

interface Group {
	year: number;
	posts: ArchivePost[];
}

export let sortedPosts: ArchivePost[] = [];
/** No.001 … — the same real number each post carries everywhere else */
export let numbers: Record<string, string> = {};

let groups: Group[] = [];
let total = 0;

const zhDict = getTranslation("zh_CN");
const postWord = (n: number) =>
	i18n(n === 1 ? I18nKey.postCount : I18nKey.postsCount);
const postWordZh = (n: number) =>
	zhDict[n === 1 ? I18nKey.postCount : I18nKey.postsCount];

const published = (post: ArchivePost) => new Date(post.data.published);

function efDate(date: Date) {
	return date.toISOString().substring(0, 10).replace(/-/g, ".");
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

function filterPosts(): ArchivePost[] {
	const params = new URLSearchParams(window.location.search);
	const tags = params.getAll("tag");
	const categories = params.getAll("category");
	const uncategorized = params.get("uncategorized");

	let posts = sortedPosts.slice();

	if (tags.length > 0) {
		posts = posts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		posts = posts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		posts = posts.filter((post) => !post.data.category);
	}

	return posts;
}

onMount(() => {
	const filtered = filterPosts();
	total = filtered.length;

	const byYear = new Map<number, ArchivePost[]>();
	for (const post of filtered) {
		const year = published(post).getFullYear();
		const list = byYear.get(year);
		if (list) {
			list.push(post);
		} else {
			byYear.set(year, [post]);
		}
	}

	groups = [...byYear.entries()]
		.sort((a, b) => b[0] - a[0])
		.map(([year, posts]) => ({ year, posts }));
});
</script>

<section class="archive">
    <header class="ef-sheet-head">
        <h1 class="ef-read"><span data-l="en">{i18n(I18nKey.archive)}</span><span data-l="zh">{zhDict[I18nKey.archive]}</span></h1>
        <p class="ef-field">{total} <span data-l="en">{postWord(total)}</span><span data-l="zh">{postWordZh(total)}</span></p>
    </header>

    {#if groups.length === 0}
        <p class="ef-empty"><span data-l="en">{i18n(I18nKey.noResults)}</span><span data-l="zh">{zhDict[I18nKey.noResults]}</span></p>
    {:else}
        {#each groups as group}
            <h2 class="ef-group-head">
                <span>{group.year}</span>
                <span class="ef-field">{group.posts.length} <span data-l="en">{postWord(group.posts.length)}</span><span data-l="zh">{postWordZh(group.posts.length)}</span></span>
            </h2>
            <ul class="ef-records">
                {#each group.posts as post}
                    <li>
                        <a class="ef-record" href={getPostUrlBySlug(post.slug)} aria-label={post.data.title}>
                            <span class="ef-tag">{numbers[post.slug] ?? ""}</span>
                            <time class="ef-field" datetime={published(post).toISOString()}>{efDate(published(post))}</time>
                            <span class="name ef-read">{post.data.title}</span>
                            <span class="ef-field arch-tags">{formatTag(post.data.tags)}</span>
                        </a>
                    </li>
                {/each}
            </ul>
        {/each}
    {/if}
</section>

<style>
    /* the tag column is the one field that has to give way on a narrow page */
    .arch-tags {
        max-width: 12rem;
        overflow: hidden;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    @media (max-width: 719px) {
        .arch-tags {
            display: none;
        }
    }
</style>
