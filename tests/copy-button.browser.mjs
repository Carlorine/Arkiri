// Run against `pnpm dev --port 4322`:
// ego-browser nodejs < tests/copy-button.browser.mjs
const task = await taskSpace("Arkiri copy tick debug 20261021");
const page = task.page("p1");
await page.goto("http://127.0.0.1:4322/posts/expressive-code/");
await page.focus(".copy-btn >> nth=0");
const measure = (icon) => page.evaluate((icon) => {
    const button = document.querySelector(".copy-btn");
    const bounds = button.getBoundingClientRect();
    const glyph = button.querySelector(icon).getBoundingClientRect();
    return {
        dx: glyph.x + glyph.width / 2 - (bounds.x + bounds.width / 2),
        dy: glyph.y + glyph.height / 2 - (bounds.y + bounds.height / 2),
        opacity: getComputedStyle(button.querySelector(icon)).opacity,
    };
}, icon);
const assertCentered = (state, label) => {
    if (Math.abs(state.dx) > 1 || Math.abs(state.dy) > 1 || state.opacity !== "1") {
        throw new Error(`${label} should be visible at button center: ${JSON.stringify(state)}`);
    }
    console.log(`PASS: ${label} centered`);
};
assertCentered(await measure(".copy-icon"), "copy icon");
await page.click(".copy-btn >> nth=0");
await page.waitForFunction(() => document.querySelector(".copy-btn").classList.contains("success"));
assertCentered(await measure(".success-icon"), "success tick");
await page.waitForFunction(() => !document.querySelector(".copy-btn").classList.contains("success"));
assertCentered(await measure(".copy-icon"), "copy icon after feedback resets");
console.log("PASS: copy feedback resets after timeout");
await task.finish({ keep: [] });
