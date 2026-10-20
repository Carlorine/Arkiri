<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";

let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;

const fakeResult: SearchResult[] = [
	{
		url: url("/"),
		meta: {
			title: "This Is a Fake Search Result",
		},
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: url("/"),
		meta: {
			title: "If You Want to Test the Search",
		},
		excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
	},
];

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (!panel || !isDesktop) return;

	if (show) {
		panel.classList.remove("float-panel-closed");
	} else {
		panel.classList.add("float-panel-closed");
	}
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		return;
	}

	if (!initialized) {
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(keyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else if (import.meta.env.DEV) {
			searchResults = fakeResult;
		} else {
			searchResults = [];
			console.error("Pagefind is not available in production environment.");
		}

		result = searchResults;
		setPanelVisibility(result.length > 0, isDesktop);
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		setPanelVisibility(false, isDesktop);
	} finally {
		isSearching = false;
	}
};

onMount(() => {
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		console.log("Pagefind status on init:", pagefindLoaded);
		if (keywordDesktop) search(keywordDesktop, true);
		if (keywordMobile) search(keywordMobile, false);
	};

	if (import.meta.env.DEV) {
		console.log(
			"Pagefind is not available in development mode. Using mock data.",
		);
		initializeSearch();
	} else {
		document.addEventListener("pagefindready", () => {
			console.log("Pagefind ready event received.");
			initializeSearch();
		});
		document.addEventListener("pagefindloaderror", () => {
			console.warn(
				"Pagefind load error event received. Search functionality will be limited.",
			);
			initializeSearch(); // Initialize with pagefindLoaded as false
		});

		// Fallback in case events are not caught or pagefind is already loaded by the time this script runs
		setTimeout(() => {
			if (!initialized) {
				console.log("Fallback: Initializing search after timeout.");
				initializeSearch();
			}
		}, 2000); // Adjust timeout as needed
	}
});

$: if (initialized && keywordDesktop) {
	(async () => {
		await search(keywordDesktop, true);
	})();
}

$: if (initialized && keywordMobile) {
	(async () => {
		await search(keywordMobile, false);
	})();
}
</script>

<!-- desktop: the field sits under the rail nav -->
<div id="search-bar" class="search-desktop">
    <label class="ef-search">
        <input
            type="search"
            placeholder={i18n(I18nKey.search)}
            aria-label={i18n(I18nKey.search)}
            bind:value={keywordDesktop}
            on:focus={() => search(keywordDesktop, true)}
        />
    </label>
</div>

<!-- phone / tablet: a 46px square button that opens the same panel -->
<button on:click={togglePanel} aria-label={i18n(I18nKey.search)} id="search-switch" class="icon-btn search-toggle">
    <Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- results: a paper panel with a hairline frame, one row per post -->
<div id="search-panel" class="float-panel float-panel-closed search-panel" role="region" aria-label={i18n(I18nKey.search)}>
    <label class="ef-search search-in-panel">
        <input
            type="search"
            placeholder={i18n(I18nKey.search)}
            aria-label={i18n(I18nKey.search)}
            bind:value={keywordMobile}
        />
    </label>

    {#if result.length > 0}
        <p class="ef-eyebrow slash results-head">{i18n(I18nKey.search)} · {result.length}</p>
        <div class="hits">
            {#each result as item}
                <a class="hit" href={item.url}>
                    <span class="hit-title">{item.meta.title}</span>
                    <span class="hit-excerpt">{@html item.excerpt}</span>
                </a>
            {/each}
        </div>
    {:else if initialized && (keywordDesktop || keywordMobile)}
        <p class="ef-empty">{i18n(I18nKey.noResults)}</p>
    {/if}
</div>

<style>
    .search-desktop {
        display: block;
    }
    .search-desktop .ef-search {
        width: 100%;
    }
    .search-toggle {
        display: none;
    }

    .search-panel {
        position: fixed;
        top: 4.5rem;
        inset-inline: 0;
        margin-inline: auto;
        width: min(46rem, calc(100vw - 2rem));
        max-height: min(70vh, 40rem);
        overflow-y: auto;
        padding: 0.75rem;
        border: 1px solid var(--ef-ink);
        background: var(--ef-panel);
        box-shadow: none;
        border-radius: 0;
    }
    .search-in-panel {
        margin-bottom: 0.5rem;
    }
    .results-head {
        margin: 0.5rem 0 0.25rem;
    }
    .hits {
        border-top: 1px solid var(--ef-rule);
    }
    .hit {
        display: block;
        padding: 0.6rem 0.5rem;
        border-bottom: 1px solid var(--ef-rule);
        color: var(--ef-ink);
        transition: background-color 120ms var(--ef-ease);
    }
    .hit:hover,
    .hit:focus-visible {
        background: var(--ef-chip);
    }
    .hit-title {
        display: block;
        font-weight: 700;
        font-size: 0.95rem;
    }
    .hit-excerpt {
        display: block;
        margin-top: 0.15rem;
        color: var(--ef-ink-2);
        font-size: 0.8125rem;
        line-height: 1.5;
    }
    .hit-excerpt :global(mark) {
        background: var(--ef-signal);
        color: var(--ef-on-signal);
    }
    .ef-empty {
        margin: 0.75rem 0.25rem;
    }

    @media (max-width: 1199px) {
        .search-desktop {
            display: none;
        }
        .search-toggle {
            display: flex;
            width: 46px;
            min-height: 44px;
            padding: 0;
            background: none;
        }
    }

    @media (min-width: 1200px) {
        .search-desktop {
            display: block;
        }
        .search-toggle {
            display: none;
        }
    }

    input:focus {
        outline: 0;
    }
</style>
