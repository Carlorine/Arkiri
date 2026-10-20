/** Client-side view of the UI language (the attribute the pre-paint script sets). */
export type UiLang = "en" | "zh";

export function currentUiLang(): UiLang {
	return document.documentElement.dataset.uiLang === "zh" ? "zh" : "en";
}

/**
 * Svelte islands mount after the first applyUiLang() run, so they read the
 * attribute once on mount and then follow the ui-lang-change event.
 */
export function onUiLangChange(fn: (lang: UiLang) => void): () => void {
	const handler = (event: Event) => {
		const detail = (event as CustomEvent<{ lang?: string }>).detail;
		fn(detail?.lang === "zh" ? "zh" : "en");
	};
	window.addEventListener("ui-lang-change", handler);
	return () => window.removeEventListener("ui-lang-change", handler);
}
