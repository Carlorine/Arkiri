import type I18nKey from "@i18n/i18nKey";
import { getTranslation } from "@i18n/translation";

/**
 * UI language: English and Simplified Chinese.
 *
 * The site is static and its i18n is compiled in, so switching works the other
 * way round: both translations are rendered into the DOM next to each other and
 * CSS shows the one that `<html data-ui-lang>` asks for. Nothing is translated
 * at runtime, and a Svelte re-render cannot lose the text.
 */
export type UiLang = "en" | "zh";

export const UI_LANG_KEY = "uiLang";

export function uiPair(key: I18nKey): { en: string; zh: string } {
	return {
		en: getTranslation("en")[key],
		zh: getTranslation("zh_CN")[key],
	};
}

/** Attributes cannot hold two values, so they carry both as data attributes. */
export function uiAttrs(key: I18nKey, attr: string): Record<string, string> {
	const { en, zh } = uiPair(key);
	return {
		"data-i18n-attr": attr,
		"data-i18n-en": en,
		"data-i18n-zh": zh,
	};
}

/** Same as uiAttrs, for strings that are not in the dictionaries yet. */
export function uiAttrsRaw(
	attr: string,
	en: string,
	zh: string,
): Record<string, string> {
	return {
		"data-i18n-attr": attr,
		"data-i18n-en": en,
		"data-i18n-zh": zh,
	};
}
