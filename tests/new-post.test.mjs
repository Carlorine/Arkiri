import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const script = path.resolve("scripts/new-post.js");

function run(args, dir) {
	return execFileAsync(process.execPath, [script, ...args], {
		env: { ...process.env, ARKIRI_POSTS_DIR: dir },
	});
}

async function withPosts(fn) {
	const dir = await mkdtemp(path.join(tmpdir(), "arkiri-post-"));
	try {
		await fn(dir);
	} finally {
		await rm(dir, { recursive: true, force: true });
	}
}

test("creates a draft page bundle and quotes the title", async () => {
	await withPosts(async (dir) => {
		const { stdout } = await run(
			["my-article", "--title", "第一篇：笔记", "--lang", "zh_CN"],
			dir,
		);
		const file = path.join(dir, "my-article", "index.md");
		const text = await readFile(file, "utf8");
		assert.match(stdout, /\/posts\/my-article\//);
		assert.match(stdout, /草稿/);
		assert.match(text, /title: "第一篇：笔记"/);
		assert.match(text, /^published: \d{4}-\d{2}-\d{2}$/m);
		assert.match(text, /draft: true/);
		assert.match(text, /lang: "zh_CN"/);
	});
});

test("--publish writes a flat markdown file when the slug ends in .md", async () => {
	await withPosts(async (dir) => {
		await run(["notes/hello.md", "--publish"], dir);
		const text = await readFile(path.join(dir, "notes", "hello.md"), "utf8");
		assert.match(text, /title: "hello"/);
		assert.match(text, /draft: false/);
		await assert.rejects(run(["notes/hello.md"], dir), (error) => {
			assert.match(error.stderr, /已存在/);
			return true;
		});
	});
});

test("rejects MDX, missing titles, and paths outside the posts directory", async () => {
	await withPosts(async (dir) => {
		await assert.rejects(run(["note.mdx"], dir), (error) => {
			assert.match(error.stderr, /MDX/);
			return true;
		});
		await assert.rejects(run(["../escape"], dir), (error) => {
			assert.match(error.stderr, /src\/content\/posts/);
			return true;
		});
		await assert.rejects(run(["my-article", "--title"], dir), (error) => {
			assert.match(error.stderr, /--title/);
			return true;
		});
	});
});
