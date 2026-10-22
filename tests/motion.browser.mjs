// Run against `pnpm dev --port 4322`: ego-browser nodejs < tests/motion.browser.mjs
const task = await taskSpace("Arkiri refresh entrance consistency");
const page = task.page("p1");
await page.goto("http://127.0.0.1:4322/");
await page.waitForFunction(() => !!window.swup);
const response = await page.fetch("/");
const serverRenderedTheme = await page.evaluate((html) => {
    const serverPage = new DOMParser().parseFromString(html, "text/html");
    return !!serverPage.querySelector("button.theme-toggle svg");
}, response.body);
if (!serverRenderedTheme) throw new Error("Theme icon must be present before client JavaScript loads");
const profileAnimation = await page.evaluate(() => {
    const wrapper = document.querySelector(".profile").closest(".onload-animation");
    return wrapper && getComputedStyle(wrapper).animationName;
});
if (profileAnimation !== "ef-come") throw new Error("Profile must use the same entrance as other sidebar blocks");
console.log("PASS: theme icon is server rendered and profile has a sidebar entrance");
const initial = await page.evaluate(() => {
    const snapshot = () => ({
        parent: getComputedStyle(document.querySelector("#swup-container")).animationName,
        components: [...document.querySelectorAll(".ef-in-drive,.onload-animation")].map(el => {
            const s = getComputedStyle(el);
            return [s.animationName, s.animationDuration, s.animationDelay];
        }),
    });
    window.__motionSnapshot = snapshot;
    window.__motionSamples = [];
    window.swup.hooks.on("animation:in:start", () => {
        window.__motionSamples.push({ path: location.pathname, ...snapshot() });
    });
    return snapshot();
});
await page.click('a[aria-label="Markdown Extended Features"]');
await page.waitForFunction(() => window.__motionSamples.length === 1 && !document.documentElement.classList.contains("is-changing"));
await page.click('a[aria-label="Arkiri"]');
await page.waitForFunction(() => window.__motionSamples.length === 2);
const navigation = await page.evaluate(() => window.__motionSamples[1]);
console.log({ initial, navigation });
if (initial.parent !== "ef-shutter" || initial.parent !== navigation.parent || JSON.stringify(initial.components) !== JSON.stringify(navigation.components)) {
    throw new Error("Refresh and internal navigation use different animation layers or component timings");
}
console.log("PASS: refresh and internal navigation use the same reveal and component animations");
await page.waitForFunction(() => !document.documentElement.classList.contains("is-changing"));
await page.evaluate(() => document.documentElement.dataset.efMotion = "calm");
const calm = await page.evaluate(() => window.__motionSnapshot());
if (calm.parent !== "none" || calm.components.some(([name]) => name !== "none")) {
    throw new Error(`Calm mode still plays entrance animations: ${JSON.stringify(calm)}`);
}
console.log("PASS: calm mode disables component and parent entrances");
await page.click('a[aria-label="Markdown Extended Features"]');
await page.waitForFunction(() => window.__motionSamples.length === 3);
if ((await page.evaluate(() => window.__motionSamples[2].parent)) !== "none") {
    throw new Error("Calm mode must also disable the Swup reveal while navigating");
}
await page.waitForFunction(() => !document.documentElement.classList.contains("is-changing"));
const originalTheme = await page.evaluate(() => document.documentElement.classList.contains("dark"));
await page.click(".theme-toggle");
await page.waitForFunction((original) => document.documentElement.classList.contains("dark") !== original, originalTheme);
await page.reload();
await page.waitForFunction(() => !!window.swup);
const theme = await page.evaluate(() => {
    const dark = document.documentElement.classList.contains("dark");
    const button = document.querySelector(".theme-toggle");
    return {
        dark,
        pressed: button.getAttribute("aria-pressed"),
        lightIcon: getComputedStyle(button.querySelector(".light-symbol")).display,
        darkIcon: getComputedStyle(button.querySelector(".dark-symbol")).display,
        width: button.getBoundingClientRect().width,
    };
});
await page.press(".theme-toggle", "Enter");
await page.waitForFunction((original) => document.documentElement.classList.contains("dark") === original, originalTheme);
if (theme.dark === originalTheme || theme.pressed !== String(theme.dark) || theme.width !== 44 ||
    (theme.dark ? theme.lightIcon !== "none" || theme.darkIcon === "none" : theme.darkIcon !== "none" || theme.lightIcon === "none")) {
    throw new Error(`Theme state or icon is inconsistent after refresh: ${JSON.stringify(theme)}`);
}
console.log("PASS: theme state, icon and button geometry survive refresh; keyboard toggle works");
await task.finish({ keep: [] });
