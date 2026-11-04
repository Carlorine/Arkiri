/**
 * Create a Markdown post under src/content/posts.
 *
 * Usage:
 *   pnpm new-post <slug> [--title <text>] [--lang <code>] [--publish]
 *
 * A slug without an extension becomes a page bundle (`<slug>/index.md`),
 * so images can sit beside the article. `.md` keeps the path you pass.
 * New posts are drafts until `--publish` or `draft: false`.
 */

import fs from "node:fs";
import path from "node:path";

const postsDir =
	process.env.ARKIRI_POSTS_DIR || path.join(process.cwd(), "src/content/posts");

function fail(message) {
	console.error(`Error: ${message}`);
	process.exit(1);
}

function help() {
	console.log(`用法: pnpm new-post <slug> [--title 标题] [--lang zh_CN] [--publish]

示例:
  pnpm new-post my-article --title "一篇笔记" --lang zh_CN
  pnpm new-post notes/hello.md --publish

未写扩展名时创建页面包 <slug>/index.md。新文章默认 draft: true，
正式构建不会发布。准备上线时把 draft 改成 false，或创建时加上 --publish。
当前未启用 MDX。`);
}

function today() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function takeValue(args, index, flag) {
	const value = args[index + 1];
	if (!value || value.startsWith("--")) {
		fail(`${flag} 需要一个值`);
	}
	return value;
}

function parseArgs(argv) {
	const positional = [];
	let title;
	let lang = "";
	let draft = true;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--help" || arg === "-h") {
			help();
			process.exit(0);
		} else if (arg === "--publish") {
			draft = false;
		} else if (arg === "--draft") {
			draft = true;
		} else if (arg === "--title") {
			title = takeValue(argv, i, "--title");
			i += 1;
		} else if (arg.startsWith("--title=")) {
			title = arg.slice("--title=".length);
		} else if (arg === "--lang") {
			lang = takeValue(argv, i, "--lang");
			i += 1;
		} else if (arg.startsWith("--lang=")) {
			lang = arg.slice("--lang=".length);
		} else if (arg.startsWith("-")) {
			fail(`未知参数 ${arg}。运行 pnpm new-post --help 查看用法。`);
		} else {
			positional.push(arg);
		}
	}

	if (positional.length === 0) {
		help();
		fail("请提供文章路径，例如 my-article");
	}
	if (positional.length > 1) {
		fail("一次只能新建一篇文章");
	}

	return { slug: positional[0], title, lang, draft };
}

function resolveRelative(slug) {
	const rel = slug.trim().replace(/\\/g, "/").replace(/^\.\//, "");
	if (!rel || rel.startsWith("/")) {
		fail("文章路径必须位于 src/content/posts/ 内");
	}
	const lower = rel.toLowerCase();
	if (lower.endsWith(".mdx")) {
		fail("当前没有启用 MDX。请使用 .md，或去掉扩展名以创建页面包。");
	}

	let file = rel;
	if (lower.endsWith(".md")) {
		file = rel;
	} else if (rel.endsWith("/") || rel.endsWith("/index") || rel === "index") {
		file =
			rel.endsWith("/index") || rel === "index"
				? `${rel}.md`
				: `${rel}index.md`;
	} else {
		file = `${rel}/index.md`;
	}

	const normalized = path.posix.normalize(file);
	if (
		normalized.startsWith("../") ||
		normalized === ".." ||
		normalized.startsWith("/") ||
		normalized.split("/").includes("..")
	) {
		fail("文章路径必须位于 src/content/posts/ 内");
	}
	return normalized;
}

function titleFromFile(file) {
	const parts = file.replace(/\.md$/i, "").split("/").filter(Boolean);
	if (parts.at(-1) === "index") parts.pop();
	const base = parts.at(-1) || "untitled";
	return base.replace(/[-_]+/g, " ");
}

function slugFromFile(file) {
	return file.replace(/\.md$/i, "").replace(/\/index$/, "");
}

const { slug, title, lang, draft } = parseArgs(process.argv.slice(2));
const relativeFile = resolveRelative(slug);
const resolvedTitle = (title ?? titleFromFile(relativeFile)).trim();
if (!resolvedTitle) fail("标题不能为空");

const fullPath = path.join(postsDir, relativeFile);
if (fs.existsSync(fullPath)) {
	fail(`文件已存在：${fullPath}`);
}

fs.mkdirSync(path.dirname(fullPath), { recursive: true });

const content = `---
title: ${JSON.stringify(resolvedTitle)}
published: ${today()}
description: ""
image: ""
tags: []
category: ""
draft: ${draft ? "true" : "false"}
lang: ${JSON.stringify(lang)}
---

`;

fs.writeFileSync(fullPath, content);
const postSlug = slugFromFile(relativeFile);
console.log(`已创建 ${path.relative(process.cwd(), fullPath) || fullPath}`);
console.log(`预览：/posts/${postSlug}/`);
if (draft) {
	console.log("这是草稿。pnpm dev 可以预览；pnpm build 不会发布。");
	console.log("发布前把 draft 改成 false。");
}
