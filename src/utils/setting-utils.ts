import { DARK_MODE, DEFAULT_THEME } from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

/**
 * Two states only: light and dark. There is no "follow the system" mode —
 * the first visit is always light, even on a dark desktop.
 */
export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	document.documentElement.classList.toggle("dark", theme === DARK_MODE);

	// Expressive Code reads this attribute, not the class
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);

	const meta = document.getElementById("theme-color-meta");
	if (meta) {
		meta.setAttribute("content", theme === DARK_MODE ? "#191919" : "#f4f4f2");
	}
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

/**
 * Only an explicit "dark" is dark. Legacy values ("system", "auto", anything
 * else) are treated as light and normalised on the next write, so old
 * local storage can never drag a visitor into dark mode.
 */
export function getStoredTheme(): LIGHT_DARK_MODE {
	const stored = localStorage.getItem("theme");
	const theme = stored === DARK_MODE ? DARK_MODE : DEFAULT_THEME;
	if (stored !== theme) localStorage.setItem("theme", theme);
	return theme;
}
