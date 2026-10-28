<script lang="ts">
import { url } from "@utils/url-utils";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";
import { currentUiLang, onUiLangChange } from "../utils/ui-lang-client";

let uiLang = "en";
let keyword = "";
let result: SearchResult[] = [];
let ready = false;
let isSearching = false;
let failed = false;
let requestId = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
let pagefind: Promise<Window["pagefind"]> | undefined;

$: copy =
	uiLang === "zh"
		? {
				label: "搜索文章",
				placeholder: "输入关键词…",
				hint: "搜索文章标题与正文。",
				loading: "正在搜索…",
				empty: "没有找到相关文章，试试其他关键词。",
				error: "搜索暂时不可用，请重试。",
				retry: "重试",
				count: "篇相关文章",
				dev: "搜索索引将在构建后生成，请在预览版本中搜索。",
			}
		: {
				label: "Search articles",
				placeholder: "Enter a keyword…",
				hint: "Search article titles and content.",
				loading: "Searching…",
				empty: "No articles found. Try a different keyword.",
				error: "Search is unavailable. Please try again.",
				retry: "Retry",
				count: "articles found",
				dev: "The search index is generated during build. Search is available in the preview.",
			};

async function search(query: string, id: number) {
	try {
		// Load the index only on the search page and reuse it between queries.
		pagefind ??= import(/* @vite-ignore */ url("/pagefind/pagefind.js"));
		const engine = await pagefind;
		const response = await engine.search(query);
		const hits = await Promise.all(response.results.map((item) => item.data()));
		if (id === requestId) result = hits;
	} catch (error) {
		if (id === requestId) {
			failed = true;
			result = [];
			pagefind = undefined;
		}
		console.error("Search failed:", error);
	} finally {
		if (id === requestId) isSearching = false;
	}
}

function scheduleSearch(value: string) {
	clearTimeout(timer);
	const id = ++requestId;
	const query = value.trim();
	result = [];
	failed = false;
	isSearching = !!query && import.meta.env.PROD;
	const current = new URL(window.location.href);
	if (query) current.searchParams.set("q", query);
	else current.searchParams.delete("q");
	window.history.replaceState(window.history.state, "", current);
	if (isSearching) timer = setTimeout(() => search(query, id), 200);
}

onMount(() => {
	uiLang = currentUiLang();
	const offLang = onUiLangChange((lang) => {
		uiLang = lang;
	});
	const restoreQuery = () => {
		keyword = new URL(window.location.href).searchParams.get("q") ?? "";
	};
	restoreQuery();
	ready = true;
	window.addEventListener("popstate", restoreQuery);
	return () => {
		offLang();
		clearTimeout(timer);
		++requestId;
		window.removeEventListener("popstate", restoreQuery);
	};
});

$: if (ready) scheduleSearch(keyword);
</script>

<div class="search-page">
    <label for="article-search" class="search-label">{copy.label}</label>
    <div class="ef-search">
        <input id="article-search" type="search" bind:value={keyword}
            placeholder={copy.placeholder} aria-describedby="search-status" autocomplete="off" />
    </div>
    <div id="search-status" class="search-status" role="status" aria-live="polite" aria-atomic="true">
        {#if !keyword.trim()}
            <p>{copy.hint}</p>
        {:else if import.meta.env.DEV}
            <p>{copy.dev}</p>
        {:else if isSearching}
            <p>{copy.loading}</p>
        {:else if failed}
            <p>{copy.error} <button class="retry" on:click={() => scheduleSearch(keyword)}>{copy.retry}</button></p>
        {:else if result.length === 0}
            <p>{copy.empty}</p>
        {:else}
            <p>{result.length} {copy.count}</p>
        {/if}
    </div>
    <div class="hits" aria-busy={isSearching}>
        {#each result as item}
            <a class="hit" href={item.url}>
                <h2 class="hit-title">{item.meta.title}</h2>
                <p class="hit-excerpt">{@html item.excerpt}</p>
            </a>
        {/each}
    </div>
</div>

<style>
    .search-page { margin-top: 1.5rem; }
    .search-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 700;
        color: var(--ef-ink);
    }
    .search-status {
        min-height: 3.5rem;
        padding-block: 0.75rem;
        color: var(--ef-ink-2);
        font-size: 0.875rem;
    }
    .search-status p { margin: 0; }
    .hit {
        display: block;
        padding: 1.25rem 0.5rem;
        border-bottom: 1px solid var(--ef-rule);
        color: var(--ef-ink);
        overflow-wrap: anywhere;
    }
    .hit:first-child { border-top: 1px solid var(--ef-rule); }
    .hit:hover, .hit:focus-visible { background: var(--ef-chip); }
    .hit:focus-visible, .retry:focus-visible {
        outline: 2px solid var(--ef-ink);
        outline-offset: 2px;
    }
    .hit-title {
        margin: 0;
        font-family: var(--ef-font-ui);
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.4;
    }
    .hit-excerpt {
        margin: 0.5rem 0 0;
        color: var(--ef-ink-2);
        font-size: 0.875rem;
        line-height: 1.65;
    }
    .hit-excerpt :global(mark) {
        background: var(--ef-signal);
        color: var(--ef-on-signal);
    }
    .retry {
        min-height: 44px;
        padding-inline: 0.75rem;
        color: var(--ef-ink);
        text-decoration: underline;
        text-underline-offset: 0.2em;
    }
</style>
