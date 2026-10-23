// Run against pnpm dev: ego-browser nodejs < tests/toc-tracking.browser.mjs
// Real page scrolling must keep the tracked chapter inside the shortened TOC.
const task = await taskSpace("Arkiri 目录追踪修复");
const page = task.page("p1");
const failures = [];
const check = (condition, message, details) => {
    console.log(`${condition ? "PASS" : "FAIL"}: ${message} ${JSON.stringify(details)}`);
    if (!condition) failures.push(message);
};
const track = async (id) => {
    const requestedScroll = await page.evaluate((id) => {
        const heading = document.getElementById(id);
        const readingLine = (document.querySelector(".nav-shell")?.getBoundingClientRect().bottom ?? 0) + 40;
        window.scrollTo({ top: heading.getBoundingClientRect().top + scrollY - readingLine + 1, behavior: "instant" });
        return scrollY;
    }, id);
    await page.waitForFunction((id) => {
        const active = document.querySelector('.toc-link[aria-current="true"]');
        return active && decodeURIComponent(active.hash.slice(1)) === id;
    }, id);
    const state = await page.evaluate(() => {
        const active = document.querySelector('.toc-link[aria-current="true"]');
        const area = document.querySelector(".margin-inner");
        const linkBounds = active.getBoundingClientRect();
        const bounds = area.getBoundingClientRect();
        const inset = Math.min(40, area.clientHeight / 4);
        return {
            chapter: decodeURIComponent(active.hash.slice(1)),
            visible: linkBounds.top >= bounds.top + inset - 1 && linkBounds.bottom <= bounds.bottom - inset + 1,
            linkTop: Math.round(linkBounds.top - bounds.top),
            linkBottom: Math.round(linkBounds.bottom - bounds.top),
            areaHeight: area.clientHeight,
            tocScrollTop: area.scrollTop,
            pageScrollTop: scrollY,
        };
    });
    check(Math.abs(state.pageScrollTop - requestedScroll) <= 1, "TOC tracking does not move the article", state);
    return state;
};
try {
    console.log({ spaceId: task.spaceId });
    await page.cdp("Emulation.setDeviceMetricsOverride", { width: 1290, height: 772, deviceScaleFactor: 1, mobile: false });
    await page.cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    await page.goto("http://127.0.0.1:4321/posts/content-format-guide/");
    await page.waitForSelector('.toc-link[aria-current="true"]');
    for (const id of ["数学公式", "音频与视频", "新建一篇文章", "footnote-label"]) {
        const result = await track(id);
        check(result.visible, "tracked chapter remains visible while scrolling the article", result);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForFunction(() => scrollY === 0);
    await page.click('a[aria-label="Arkiri"]');
    await page.waitForURL("http://127.0.0.1:4321/");
    await page.click('a.ef-record[href="/posts/content-format-guide/"]');
    await page.waitForURL("http://127.0.0.1:4321/posts/content-format-guide/");
    await page.waitForSelector('.toc-link[aria-current="true"]');
    const afterNavigation = await track("数学公式");
    check(afterNavigation.visible, "tracking reinitializes after a cached article navigation", afterNavigation);
    if (failures.length) throw new Error(failures.join("\n"));
    console.log("PASS: TOC follows article scroll in both directions");
    await task.finish({ keep: [] });
} catch (error) {
    console.log(`Browser space ${task.spaceId} remains open for diagnosis.`);
    throw error;
}
