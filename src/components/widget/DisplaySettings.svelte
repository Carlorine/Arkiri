<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { getTranslation, i18n } from "@i18n/translation";
import { onMount } from "svelte";
import { currentUiLang, onUiLangChange } from "../../utils/ui-lang-client";

/*
 * Display settings.
 *
 * The kit has exactly one accent colour, and density is fixed at "standard"
 * (the attribute lives in src/layouts/Layout.astro and the kit CSS still reads
 * it). The only setting left is the motion variant the kit supports:
 *   data-ef-motion   full | calm   (calm drops page entrances)
 * It is stored in localStorage and re-applied before first paint by the inline
 * script in src/layouts/Layout.astro, so there is no flash.
 */

type Motion = "full" | "calm";

const zhDict = getTranslation("zh_CN");
let uiLang = currentUiLang();

const MOTIONS: Motion[] = ["full", "calm"];

const motionLabel = {
	full: I18nKey.motionFull,
	calm: I18nKey.motionCalm,
} as const satisfies Record<Motion, I18nKey>;

let motion: Motion = "full";

function isMotion(v: string | null): v is Motion {
	return v === "full" || v === "calm";
}

function setMotion(next: Motion) {
	motion = next;
	localStorage.setItem("motion", next);
	document.documentElement.dataset.efMotion = next;
}

onMount(() => {
	const storedMotion = localStorage.getItem("motion");
	if (isMotion(storedMotion)) motion = storedMotion;
	const off = onUiLangChange((lang) => { uiLang = lang; });
	return off;
});
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute w-80 right-4 px-4 py-4">
    <p class="ef-field m-0 mb-2"><span data-l="en">{i18n(I18nKey.motion)}</span><span data-l="zh">{zhDict[I18nKey.motion]}</span></p>
    <div class="ef-seg" role="radiogroup" data-i18n-attr="aria-label" data-i18n-en={i18n(I18nKey.motion)} data-i18n-zh={zhDict[I18nKey.motion]} aria-label={uiLang === "zh" ? zhDict[I18nKey.motion] : i18n(I18nKey.motion)}>
        {#each MOTIONS as value}
            <label>
                <input
                    type="radio"
                    name="ef-motion"
                    value={value}
                    checked={motion === value}
                    onchange={() => setMotion(value)}
                />
                <span><span data-l="en">{i18n(motionLabel[value])}</span><span data-l="zh">{zhDict[motionLabel[value]]}</span></span>
            </label>
        {/each}
    </div>
</div>
