// Run against `pnpm dev`: ego-browser nodejs < tests/sidebar.browser.mjs
// Uses the shipped Markdown example to exercise real nested sections and Swup.
const task = await taskSpace("Arkiri sidebar regression");
const page = task.page("p1");
const failures = [];
const check = (condition, message) => {
    console.log(`${condition ? "PASS" : "FAIL"}: ${message}`);
    if (!condition) failures.push(message);
};
const settled = async () => {
    await page.waitForFunction(() => window.swup && !document.documentElement.classList.contains("is-changing"));
    await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
};
const current = () => page.evaluate(() => [...document.querySelectorAll('.toc-link[aria-current="true"]')].map(link => link.hash));
const scrollTo = async (id, offset = 0) => {
    await page.evaluate(async ({ id, offset }) => {
        const heading = document.getElementById(id);
        window.scrollTo({ top: heading.getBoundingClientRect().top + scrollY + offset, behavior: "instant" });
        await new Promise(resolve => setTimeout(resolve, 100));
    }, { id, offset });
};
const checkHome = async (label) => {
    const state = await page.evaluate(() => ({
        profile: !!document.querySelector('#sidebar a[aria-label="Go to About Page"]'),
        widgets: !!document.querySelector("#sidebar-sticky"),
        article: !!document.querySelector(".is-article-margin"),
        toc: !!document.querySelector("table-of-contents"),
    }));
    check(state.profile && state.widgets && !state.article && !state.toc, `${label}: homepage profile, categories and tags restored (${JSON.stringify(state)})`);
};
try {
    await page.goto("http://127.0.0.1:4321/posts/markdown/");
    await settled();
    await scrollTo("an-h2-header", 400);
    let active = await current();
    check(active.length === 1 && active[0] === "#an-h2-header", `nested section tracks only the section being read (${active})`);
    await scrollTo("an-h1-header", 40);
    active = await current();
    check(active.length === 1 && active[0] === "#an-h1-header", `scrolling upward restores the first section (${active})`);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForFunction(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 2);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    active = await current();
    check(active.length === 1 && active[0] === "#footnote-label", `bottom of article tracks the final section (${active})`);
    await page.click('a[aria-label="Arkiri"]');
    await page.waitForURL("http://127.0.0.1:4321/");
    await settled();
    await checkHome("article to home");
    await page.click('a[aria-label="Expressive Code Example"]');
    await settled();
    check(await page.evaluate(() => !!document.querySelector('.is-article-margin table-of-contents') && !document.querySelector('#sidebar-sticky')), "home to article swaps the entire margin");
    await page.evaluate(() => history.back());
    await page.waitForURL("http://127.0.0.1:4321/");
    await settled();
    await checkHome("browser back to cached home");
    await page.evaluate(() => history.back());
    await page.waitForURL("http://127.0.0.1:4321/posts/markdown/");
    await settled();
    await scrollTo("an-h2-header", 400);
    active = await current();
    check(active.length === 1 && active[0] === "#an-h2-header", `cached article reinitializes tracking (${active})`);
    if (failures.length) throw new Error(failures.join("\n"));
    await task.finish({ keep: [] });
} catch (error) {
    console.log(`Browser space ${task.spaceId} kept open for diagnosis.`);
    throw error;
}
