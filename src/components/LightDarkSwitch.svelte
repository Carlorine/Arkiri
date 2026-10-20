<script lang="ts">
import { DARK_MODE, LIGHT_MODE } from "@constants/constants.ts";
import I18nKey from "@i18n/i18nKey";
import { getTranslation, i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
} from "@utils/setting-utils.ts";
import { onMount } from "svelte";
import { currentUiLang, onUiLangChange } from "../utils/ui-lang-client";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

/*
 * Theme: one button, two states.
 *
 * There is no "follow the system" option: the first visit is always light,
 * even on a dark desktop, and only an explicit stored "dark" starts dark.
 * A single 44px button keeps the rail (200px) from being overrun by a
 * three-column control, and it works the same on the phone bar.
 *
 * Label follows the state: "Switch to dark" while light, and the other way
 * round; aria-pressed carries the state for assistive tech.
 */
interface Props {
	/** extra classes for the button, for layout in the rail / phone bar */
	class?: string;
}
let { class: className = "" }: Props = $props();

let mode: LIGHT_DARK_MODE = $state(LIGHT_MODE);
let uiLang = $state(currentUiLang());
const zhDict = getTranslation("zh_CN");
const label = $derived(
	uiLang === "zh"
		? zhDict[mode === DARK_MODE ? I18nKey.switchToLight : I18nKey.switchToDark]
		: i18n(mode === DARK_MODE ? I18nKey.switchToLight : I18nKey.switchToDark),
);

onMount(() => {
	mode = getStoredTheme();
	const off = onUiLangChange((lang) => { uiLang = lang; });
	return off;
});

function toggle() {
	const next = mode === DARK_MODE ? LIGHT_MODE : DARK_MODE;
	mode = next;
	setTheme(next);
	applyThemeToDocument(next);
}
</script>

<button
    type="button"
    class="theme-toggle {className}"
    onclick={toggle}
    aria-pressed={mode === DARK_MODE}
    aria-label={label}
    title={label}
>
    <Icon
        icon={mode === DARK_MODE
            ? "material-symbols:dark-mode-outline-rounded"
            : "material-symbols:wb-sunny-outline-rounded"}
        class="text-[1.25rem]"
    />
</button>

<style>
    .theme-toggle {
        display: flex;
        flex: none;
        align-items: center;
        justify-content: center;
        width: 46px;
        min-height: 44px;
        background: var(--ef-chip);
        color: var(--ef-ink);
        border-radius: 0;
        transition: background-color 120ms var(--ef-ease);
    }
    .theme-toggle:hover {
        background: var(--ef-rule);
    }
    .theme-toggle:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }
    @media (max-width: 767px) {
        .theme-toggle {
            background: none;
        }
    }
</style>
