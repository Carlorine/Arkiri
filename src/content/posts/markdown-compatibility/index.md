---
title: Markdown 兼容性核对
published: "2026-11-04"
updated: "2026-11-04"
description: 逐项列出当前文章管线会渲染的语法、页面上的效果，以及明确不支持的写法。
tags: [Markdown, 兼容性, 示例]
category: Guides
draft: false
lang: zh_CN
---

这是一页核对清单，不是写作教程。每一节都是当前管线的真实渲染；写法细节在[内容与格式全览](/posts/content-format-guide/)。正文从二级标题开始，页面标题已经是一级标题。

日期写成了带引号的 `"2026-11-04"`，用来确认引号里的日期字符串也能通过内容校验。

## 支持范围

| 类型 | 状态 | 在本页 |
| :--- | :---: | :--- |
| 标题、强调、删除线、换行、分隔线 | 支持 | [基础排版](#基础排版) |
| 列表、任务、引用、GFM 表格 | 支持 | [结构](#结构内容) |
| 站内链接、锚点、引用式链接、脚注 | 支持 | [链接](#链接与脚注) |
| 行内代码、Expressive Code | 支持 | [代码](#代码) |
| 行内公式、块级公式、`\tag` | 支持 | [公式](#数学公式) |
| 图片、图片链接、图注、音视频 | 支持 | [媒体](#媒体) |
| 提示块、折叠、剧透、GitHub 卡片 | 支持 | [扩展](#扩展内容) |
| MDX、定义列表、Pandoc 表格、自动标点 | 不支持 | [界线](#不支持的写法) |

目录深度来自 `src/config.ts` 的 `toc.depth`（当前为 2），从正文里最浅的标题往下数。没有单篇文章的目录开关。

## 基础排版

中文与 English、数字 2026 可以写在同一段。**粗体**、*斜体*、***粗斜体***、~~删除线~~ 和 `inline code` 都在这一句里。

行末反斜线会换行，\
下一句仍属于这一段。

单独成行的三条短横线是分隔线，句子里的 `---` 和 `...` 保持原样。

---

一个很长的地址应当在栏内断开，而不是把页面撑宽：<https://example.com/posts/markdown-compatibility/this-segment-has-no-spaces-and-keeps-going/until-the-line-must-wrap-inside-the-reading-column>

```markdown
**粗体**、*斜体*、***粗斜体***、~~删除线~~、`inline code`

行末反斜线会换行，\
下一句仍属于这一段。
```

### 三级标题仍在目录里

四级到六级标题会渲染，但以当前目录深度，它们不进入右侧目录。

#### 四级标题

##### 五级标题

###### 六级标题

## 这一节的标题故意写得很长，用来检查目录和窄屏：EnglishHeadingWithoutSpacesShouldWrapInsideTheColumn

长标题应在栏内换行。目录里的同一行文字也不应把右栏撑出屏幕。

## 结构内容

- 无序列表
  - 第二层
    - 第三层
      - 第四层

1. 先写。
2. 再预览。
3. 最后把 `draft` 改成 `false`。

- [x] 已完成的核对项
- [ ] 还要自己看一遍的核对项
  - [x] 嵌套任务不该再画出列表破折号

> 引用里可以有**重点**和[站内链接](/blog/)。
>
> > 第二层引用。

| 左对齐 | 居中 | 右对齐 |
| :--- | :---: | ---: |
| 文字 | 12 | 3 |
| `code` | 中英 mix | 108 |

下面的表比阅读栏宽，应在表格区域内横向滚动，页面本身不跟着变宽。

| 字段 | 说明 | 示例 | 备注 | 来源 | 限制 | 预览 | 发布 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| title | 标题 | 兼容性核对 | 必填 | front matter | 无目录级别 | 可见 | 可见 |
| draft | 草稿 | true | 脚本默认 | `pnpm new-post` | 构建时排除 | 带标记 | 不生成 |
| lang | 正文语言 | zh_CN | 不翻译正文 | 可选 | 只影响声明 | 可见 | 可见 |
| image | 封面 | published-at-updated-at-description-image-category-tags | 不可断行 | 相对路径或 URL | 不是正文图 | 文章头图 | 文章头图 |

```markdown
- [x] 已完成
- [ ] 未完成

| 左对齐 | 右对齐 |
| :--- | ---: |
| 文字 | 3 |
```

## 链接与脚注

[归档](/archive/)是站内链接。[这一节](#链接与脚注)是标题锚点。[引用式链接][guide]指向写作教程。自动链接：<https://arkiri.pages.dev/>。

脚注把补充放到文末[^scope]，同一条可以再引用一次[^scope]。

```markdown
[归档](/archive/)
[这一节](#链接与脚注)
[引用式链接][guide]
<https://arkiri.pages.dev/>

补充说明[^scope]。

[guide]: /posts/content-format-guide/
[^scope]: 脚注正文。
```

## 代码

没有语言标记的围栏块：

```
plain fence
```

带文件名、行号、高亮和增删标记的块。右上角按钮复制代码；窄屏上按钮保持可见。

```ts title="publish.ts" showLineNumbers {1} ins={2} del={3}
const title = "Markdown 兼容性核对";
const draft = false;
const draft = true;
```

词高亮、新增标记和折叠。被折叠的行要点开代码块里的提示才出现。

```js title="markers.js" "title" ins="published" collapse={1}
const hidden = true;
const title = "核对";
const current = "published";
```

很长的一行默认换行，不应撑宽页面：

```text title="long-line.txt" wrap
article-title / published-at / updated-at / description / image / category / tags / language / draft / previous-article / next-article / table-of-contents
```

折叠、词高亮和终端窗口的其余写法见[内容与格式全览](/posts/content-format-guide/#代码高亮与窗口)和[Expressive Code 示例](/posts/expressive-code/)。

## 数学公式

行内公式 $A = \pi r^2$ 跟在句子里。块级公式单独成行：

$$
\frac{1}{n}\sum_{i=1}^{n} x_i = \bar{x}
$$

`\tag` 可以手写编号。没有自动编号，公式不会自己变成 (1)(2)(3)。

$$
E = mc^2 \tag{1}
$$

比栏更宽的公式在公式区域内横向滚动：

$$
\pi = 3.1415926535\;8979323846\;2643383279\;5028841971\;6939937510\;5820974944\;5923078164\;0628620899
$$

```latex
行内 $A = \pi r^2$

$$
E = mc^2 \tag{1}
$$
```

## 媒体

Markdown 图片。替代文字说明画面，点击后可以放大。

![蓝紫色天空与远处风景](../../../assets/images/demo-banner.png)

图片也可以是链接。链接不应在图片底下再画一条高亮横线。

[![Arkiri 浅色图标](/favicon/favicon-light-128.png)](/about/)

图注用 `figure`。Markdown 图片标题（`![替代文字](./a.png "标题")`）只会变成 `title` 属性，不会变成图注。

<figure>
  <img src="/favicon/favicon-light-128.png" alt="Arkiri 浅色站点图标" width="96" height="96">
  <figcaption>图：favicon，用来看 figcaption 的字号和颜色。</figcaption>
</figure>

音频和视频没有 Markdown 简写，使用 HTML。下面两个文件已经在站点里。

<audio controls preload="metadata" aria-label="三声合成提示音" style="width:100%">
  <source src="/media/content-guide/three-notes.wav" type="audio/wav">
</audio>

<video controls playsinline preload="metadata" width="960" height="540" poster="/media/content-guide/reading-progress.svg" aria-label="阅读进度动画" style="width:100%;height:auto">
  <source src="/media/content-guide/reading-progress.mp4" type="video/mp4">
  <track kind="captions" src="/media/content-guide/reading-progress.zh.vtt" srclang="zh" label="中文" default>
</video>

外部页面用 `iframe`。YouTube 与 Bilibili 的可运行例子在[内容与格式全览](/posts/content-format-guide/#外部视频与网页嵌入)，不在这里重复加载。

## 扩展内容

:::note
五种提示块共用同一种外观，靠标题区分。
:::

:::tip[自定义标题]
方括号里的文字会替换默认标题。
:::

:::important
结束标记 `:::` 单独成行。
:::

:::warning
不要把还是草稿的文章推上去就当作已经发布。
:::

:::caution
删掉图片文件后，引用它的文章会缺图。
:::

> [!NOTE]
> GitHub 的提示语法会转成同一种提示块。

点击或悬停这段遮罩：:spoiler[里面可以有**粗体**]。聚焦后按 Enter 或空格也能打开。

<details>
<summary>折叠区域</summary>

里面仍是 Markdown：**重点**、列表和[链接](/blog/)。

- 第一项
- 第二项

</details>

快捷键 <kbd>Ctrl</kbd> + <kbd>S</kbd>，下标 H<sub>2</sub>O，上标 x<sup>2</sup>。

::github{repo="withastro/astro"}

```markdown
:::note
提示。
:::

> [!NOTE]
> GitHub 提示语法。

:spoiler[里面可以有**粗体**]

::github{repo="withastro/astro"}
```

仓库卡片在浏览器里向 GitHub API 取描述和星标。取不到时，卡片仍链到该仓库。

## 文章信息

| 字段 | 本页的值 | 行为 |
| :--- | :--- | :--- |
| title | Markdown 兼容性核对 | 页面标题，不从正文第一个 `#` 读取 |
| published / updated | 2026-11-04 | 日期或日期字符串 |
| description | 本页摘要 | 列表和文章开头 |
| image | 空 | 不显示封面 |
| tags / category | 见文首 | 列表与归档 |
| draft | false | `true` 时开发预览可见并带草稿标记，正式构建不生成页面 |
| lang | zh_CN | 声明正文语言，不翻译正文 |

`prevTitle`、`prevSlug`、`nextTitle`、`nextSlug` 由构建时按日期填上，写在文首会被覆盖。

新建一篇草稿：

```bash
pnpm new-post my-article --title "一篇笔记" --lang zh_CN
```

## 不支持的写法

这些语法不会按其他工具的效果出现。需要时改用右边的写法。

| 写法 | 结果 | 改用 |
| :--- | :--- | :--- |
| MDX / 组件导入 | 未启用，`.mdx` 不能作为文章 | 继续用 `.md`，交互用 HTML |
| 定义列表 `词\n: 解释` | 普通段落 | 列表或表格 |
| Pandoc 网格表、行块 `\| 一行` | 普通文本 | GFM 表格 |
| `---`、`...` 自动变标点 | 字符保持原样 | 直接输入 `—`、`…` |
| 公式自动编号 | 不计数 | `\tag{1}` |
| Mermaid | 代码块，不画图 | 图片或 SVG |
| 每篇文章单独的目录深度 | 没有这个字段 | 改 `src/config.ts` 的 `toc.depth` |

```markdown
术语
: 这不会变成定义列表。

| 这也不是行块
```

## 发布时还会遇到的边界

空文件只要文首合法就可以构建，页面上只剩标题和日期。正式构建会丢掉 `draft: true` 的文章，搜索索引里也不会有它们。开发服务器仍会列出草稿，并在标题旁标出「草稿」。

[guide]: /posts/content-format-guide/
[^scope]: 脚注支持返回正文的回链。这里的「注」是 GFM 脚注，不是 Markdown 链接。
