---
title: 内容与格式全览：一篇可照着写的教程
published: 2026-10-23
description: 从第一段文字到代码、公式与音视频，逐项查看 Arkiri 当前支持的内容效果，复制对应写法，完成一篇自己的文章。
tags: [写作, Markdown, 教程, Arkiri]
category: Guides
draft: false
lang: zh_CN
---

这是一份可以边看边写的内容手册。下面的文字、表格、提示块、代码和媒体都是实际渲染的样例；紧随其后的代码展示对应写法。先找到需要的内容类型，再复制到自己的 `.md` 文章中。

## 先找到你要写的内容

| 内容类型 | 格式与写法 |
| :--- | :--- |
| [新建文章](#新建一篇文章) | Markdown 文件、YAML 文章信息 |
| [文字排版](#文字与标题) | 标题、段落、强调、行内代码 |
| [列表任务](#列表与任务) | 有序、无序、嵌套、复选框 |
| [引用](#引用与分隔线)、[表格](#表格与对齐) | 引用层级、分隔线、列对齐 |
| [链接脚注](#链接与脚注) | 站内链接、文内跳转、文末注释 |
| [提示块](#五种提示块) | 五种提示语义、自定义标题 |
| [折叠剧透](#折叠与剧透) | 点击展开、悬停揭示、行内 HTML |
| [数学公式](#数学公式) | 行内公式、独立公式、矩阵 |
| [代码样例](#代码高亮与窗口) | 高亮、窗口、[标记与折叠](#代码标记行号与折叠) |
| [图片图注](#图片与图注) | 本地图片、远程图片、大图查看 |
| [音频视频](#音频与视频) | 原生播放器、字幕轨道 |
| [外部嵌入](#外部视频与网页嵌入) | YouTube、Bilibili、iframe |
| [仓库卡片](#github-仓库卡片) | GitHub 仓库信息 |

本文对应本项目当前启用的 Markdown、GFM、数学公式、指令组件和代码插件。音视频与折叠等使用原生 HTML。Markdown 文件中的 HTML 可以直接渲染；React、Svelte 组件和 MDX 导入没有在当前文章管线中启用。

## 新建一篇文章

在项目根目录执行下面的命令。它会生成 `src/content/posts/my-article/index.md`，图片可以放在同一文件夹。

```bash title="新建并预览"
pnpm new-post my-article/index.md
pnpm dev
```

打开终端显示的本地地址，进入 `/posts/my-article/`。保存文章后，开发预览会自动更新。

### 填好文章信息

文件最上方的两条 `---` 之间是 YAML front matter。以下是一份可直接使用的起点：

```yaml title="src/content/posts/my-article/index.md"
---
title: 我的第一篇文章
published: 2026-10-23
description: 用一句话说明读者能从文章中得到什么。
image: ''
tags: [写作, 示例]
category: Guides
draft: false
lang: zh_CN
---

从这里开始写正文。
```

| 字段 | 用途 | 必填 |
| :--- | :--- | :---: |
| `title` | 文章标题，也会成为页面的一级标题 | 是 |
| `published` | 发布日期，写作 `YYYY-MM-DD` | 是 |
| `updated` | 更新日期，需要时添加 | 否 |
| `description` | 列表摘要与文章开头的说明 | 否 |
| `image` | 封面图片路径，留空则不显示 | 否 |
| `tags` | 标签数组，例如 `[Markdown, 教程]` | 否 |
| `category` | 一个分类名称 | 否 |
| `draft` | `true` 为草稿，默认 `false` | 否 |
| `lang` | 正文语言，例如 `zh_CN`、`en`、`ja` | 否 |

`lang` 声明正文语言，不会自动翻译文章。`prevTitle`、`prevSlug`、`nextTitle`、`nextSlug` 由站点维护，无需填写。

:::note[草稿在预览与发布时的区别]
`pnpm dev` 会显示草稿，方便检查内容；`pnpm build` 会排除 `draft: true` 的文章。发布前改成 `false`，再运行 `pnpm build` 检查最终页面。
:::

封面 `image` 支持相对文章的路径（`./cover.png`）、`public` 中的路径（`/images/cover.png`）和 `https://` 图片地址。

## 文字与标题

正文用空行分段。中文、English、数字 2026 和 `inline code` 可以自然混排。**粗体标记重点**，*斜体表达强调*，***粗斜体组合使用***，~~删除线表示旧内容~~。

需要明确换行时，在行末加反斜线。\
这一行仍在同一个段落中。

```markdown
正文第一段，包含 **粗体**、*斜体*、***粗斜体*** 和 ~~删除线~~。

第二段，包含 `inline code`。

需要明确换行时，在行末加反斜线。\
这一行仍在同一个段落中。
```

### 三级标题：拆分一个主题

页面顶部的文章标题已经是一级标题，正文从 `##` 开始。当前目录显示二级、三级标题；四至六级标题仍能正常渲染。

#### 四级标题：补充细节

把一个小问题放在这里说明。

##### 五级标题：细节中的说明

较深层级适合长篇资料。

###### 六级标题：最深层级

通常使用二级和三级标题就足够。

```markdown
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

### 原样显示语法符号

用反斜线转义：\*星号\*、\[方括号\]、\# 井号。行内代码需要包含反引号时，用双反引号包裹：``代码里的 ` 符号``。

```markdown
\*星号\*、\[方括号\]、\# 井号
``代码里的 ` 符号``
```

## 列表与任务

无序列表适合并列内容，也可以嵌套：

- 先准备文章主题。
- 再整理素材。
  - 图片放在文章旁边。
  - 为图片写清楚替代文字。

有序列表适合执行顺序：

1. 新建文章文件。
2. 填写标题与发布日期。
3. 本地预览，检查后发布。

任务列表可以展示进展；这里的复选框是文章内容，不会保存读者的勾选操作。

- [x] 准备正文
- [x] 加入实际样例
- [ ] 补充自己的素材

```markdown
- 主题
- 素材
  - 图片
  - 替代文字

1. 新建文件。
2. 填写文章信息。
3. 预览。

- [x] 已完成
- [ ] 待完成
```

## 引用与分隔线

> 一段引用可以同时包含**重点**、`代码`和[站内链接](/blog/)。
>
> > 第二层引用，用来补充上下文。
>
> 回到第一层，继续说明。

```markdown
> 一段引用可以同时包含**重点**、`代码`和[站内链接](/blog/)。
>
> > 第二层引用，用来补充上下文。
>
> 回到第一层，继续说明。
```

三条短横线单独成行，前后留空行，就是分隔线：

---

分隔线适合表示话题转换。

```markdown
上一段。

---

下一段。
```

## 表格与对齐

管道表格适合比较少量信息。分隔行中，`:---` 左对齐、`:---:` 居中、`---:` 右对齐。

| 内容 | 状态 | 数量 |
| :--- | :---: | ---: |
| **文字排版** | 已支持 | 6 |
| `代码增强` | 已支持 | 12 |
| [媒体样例](#音频与视频) | 可播放 | 2 |

```markdown
| 内容 | 状态 | 数量 |
| :--- | :---: | ---: |
| **文字排版** | 已支持 | 6 |
| `代码增强` | 已支持 | 12 |
| [媒体样例](#音频与视频) | 可播放 | 2 |
```

单元格里支持行内格式；需要显示竖线时写成 `\|`。单元格换行可以使用 `<br>`。多段正文、复杂合并单元格请改用 HTML 表格。

## 链接与脚注

站内链接：[浏览文章](/blog/)。文内链接：[回到内容索引](#先找到你要写的内容)。引用式链接：[查看归档][archive]。自动链接：<https://example.com>。

脚注把补充解释放到文末，例如这里的写作说明[^writing]。可以再次引用同一个脚注[^writing]，读完后点击回链返回正文。

```markdown
[浏览文章](/blog/)
[回到内容索引](#先找到你要写的内容)
[查看归档][archive]
<https://example.com>

一句话后面加上脚注[^writing]。

[archive]: /archive/
[^writing]: 补充说明写在这里。
```

## 五种提示块

提示块有五种语义。它们沿用站点统一的视觉样式，通过标题区分用途。

:::note[补充说明 · note]
用来补充读者可能需要的背景。例如，文章日期使用 `YYYY-MM-DD`。
:::

:::tip[写作技巧 · tip]
先写一个可运行的小例子，再解释它为什么有效。
:::

:::important[关键步骤 · important]
每个提示块必须用单独一行 `:::` 结束。
:::

:::warning[操作前检查 · warning]
替换文件前，确认自己正在编辑正确的路径。
:::

:::caution[不可恢复的后果 · caution]
删除本地素材后，引用它的文章图片也会失效。
:::

```markdown
:::note[补充说明]
背景信息。
:::

:::tip[写作技巧]
一个实用建议。
:::

:::important[关键步骤]
不能漏掉的操作。
:::

:::warning[操作前检查]
需要先确认的风险。
:::

:::caution[不可恢复的后果]
说明可能造成的损失。
:::
```

去掉 `[自定义标题]` 后会使用默认类型名称。提示块内部支持段落、列表、链接与代码。

### 也支持 GitHub 提示语法

> [!TIP]
> 从 GitHub README 复制过来的提示语法，也会转换成本站的提示块。

```markdown
> [!TIP]
> 从 GitHub README 复制过来的提示语法，也会转换成本站的提示块。
```

将 `TIP` 换成 `NOTE`、`IMPORTANT`、`WARNING` 或 `CAUTION`，即可切换其他四种类型。

## 折叠与剧透

### 点击展开补充内容

<details>
<summary>展开查看：折叠区域里可以放什么？</summary>

这里可以放普通段落、**强调**、[链接](/blog/)和列表。

- 把较长的说明放在这里。
- 主线内容保持简短。

</details>

```markdown
<details>
<summary>展开查看：折叠区域里可以放什么？</summary>

这里可以放普通段落、**强调**、[链接](/blog/)和列表。

- 把较长的说明放在这里。
- 主线内容保持简短。

</details>
```

`<summary>` 后和 `</details>` 前留空行，让里面的 Markdown 正常解析。标题可以用鼠标点击，也可以按 Tab 聚焦后用 Enter 或空格展开。

### 悬停揭示剧透

这段文字藏着答案：:spoiler[文章就是由这些**小片段**组成的]。将指针移到遮罩上查看；触屏阅读长篇补充内容时，优先使用上面的折叠区域。

```markdown
这段文字藏着答案：:spoiler[文章就是由这些**小片段**组成的]。
```

### 少量行内 HTML

快捷键 <kbd>Ctrl</kbd> + <kbd>S</kbd>，化学式 H<sub>2</sub>O，平方 x<sup>2</sup>，以及 <abbr title="HyperText Markup Language">HTML</abbr> 缩写都可以直接写入正文。

```html
<kbd>Ctrl</kbd> + <kbd>S</kbd>
H<sub>2</sub>O，x<sup>2</sup>
<abbr title="HyperText Markup Language">HTML</abbr>
```

## 数学公式

行内公式放在一对 `$` 之间：圆的面积为 $A = \pi r^2$。独立公式用两对 `$$` 包裹：

$$
\frac{1}{n}\sum_{i=1}^{n} x_i = \bar{x}
$$

多行推导、矩阵和分段函数也可以组合：

$$
\begin{aligned}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{aligned}
\qquad
A = \begin{bmatrix}1 & 2 \\ 3 & 4\end{bmatrix}
$$

$$
|x| = \begin{cases} x, & x \geq 0 \\ -x, & x < 0 \end{cases}
$$

```latex
圆的面积为 $A = \pi r^2$。

$$
\frac{1}{n}\sum_{i=1}^{n} x_i = \bar{x}
$$

$$
\begin{aligned}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{aligned}
\qquad
A = \begin{bmatrix}1 & 2 \\ 3 & 4\end{bmatrix}
$$

$$
|x| = \begin{cases} x, & x \geq 0 \\ -x, & x < 0 \end{cases}
$$
```

公式由 KaTeX 渲染，支持其数学命令集合。较宽的独立公式可以在块内横向滚动。

## 代码高亮与窗口

### 语言标记、文件名与复制

在三个反引号后写语言名称。语言决定语法高亮，`title` 决定窗口标题。代码块右上角的按钮可以复制代码。

```ts title="article.ts"
type Article = { title: string; published: boolean };

function publish(article: Article): string {
  // 中文注释也使用站点的中文字体。
  return article.published ? article.title : "草稿";
}

console.log(publish({ title: "开始写作", published: true }));
```

````markdown
```ts title="article.ts"
type Article = { title: string; published: boolean };

function publish(article: Article): string {
  // 中文注释也使用站点的中文字体。
  return article.published ? article.title : "草稿";
}

console.log(publish({ title: "开始写作", published: true }));
```
````

常见语言如 `js`、`ts`、`html`、`css`、`json`、`yaml`、`python`、`bash`、`sql` 都可以使用。纯文本写 `text`；代码示例是展示内容，不会在页面自动执行。

### 终端与普通窗口

```bash title="本地预览"
pnpm dev
```

```shellsession title="终端会话"
$ pnpm build
✓ Build complete
```

```sh frame="none"
echo "不显示窗口标题栏"
```

```sh frame="code" title="commands.sh"
echo "将 shell 代码显示为文件窗口"
```

````markdown
```bash title="本地预览"
pnpm dev
```

```shellsession title="终端会话"
$ pnpm build
✓ Build complete
```

```sh frame="none"
echo "不显示窗口标题栏"
```

```sh frame="code" title="commands.sh"
echo "将 shell 代码显示为文件窗口"
```
````

`frame="terminal"` 可以强制使用终端窗口。HTML 等语言也支持用第一行文件名注释识别窗口标题，例如 `<!-- index.html -->`。

### ANSI 终端颜色

下面的颜色来自代码中的真实 ANSI 转义字符。

```ansi title="构建输出"
[32m✓ Ready[0m  [33mPreview[0m  [1mArkiri[0m
```

将包含真实 ANSI 转义字符的终端输出放进 `ansi` 代码块即可。字面的 `\u001b` 或 `\x1b` 不会自动变成控制字符。

## 代码标记、行号与折叠

### 标记行、增删行与标签

```ts title="settings.ts" showLineNumbers {1} del={2} ins={3-4} {"保留这个值":5}
const site = "Arkiri";
const mode = "draft";
const mode = "published";
const visible = true;
const language = "zh_CN";
```

````markdown
```ts title="settings.ts" showLineNumbers {1} del={2} ins={3-4} {"保留这个值":5}
const site = "Arkiri";
const mode = "draft";
const mode = "published";
const visible = true;
const language = "zh_CN";
```
````

`{1,3-5}` 标记第一行和第三至五行，`ins={...}` 标记新增，`del={...}` 标记删除。`{"说明":行号}` 可以给行标记加上标签。

### 标记词语与正则匹配

```js title="inline-markers.js" "title" ins="published" del="draft" /202[0-9]/
const title = "内容与格式全览";
const previous = "draft";
const current = "published";
const year = 2026;
```

````markdown
```js "title" ins="published" del="draft" /202[0-9]/
const title = "内容与格式全览";
const previous = "draft";
const current = "published";
const year = 2026;
```
````

### Diff 差异格式

```diff lang="js" title="发布前后的修改"
-const draft = true;
+const draft = false;
 const title = "内容与格式全览";
```

````markdown
```diff lang="js" title="发布前后的修改"
-const draft = true;
+const draft = false;
 const title = "内容与格式全览";
```
````

单独使用 `diff` 也可以；加上 `lang="js"` 可在增删标记之上保留 JavaScript 高亮。

### 行号与起始行

```js title="从第 20 行开始" showLineNumbers startLineNumber=20
const title = "开始写作";
console.log(title);
```

```js title="隐藏行号" showLineNumbers=false
console.log("这一块不显示行号");
```

````markdown
```js showLineNumbers startLineNumber=20
const title = "开始写作";
console.log(title);
```

```js showLineNumbers=false
console.log("这一块不显示行号");
```
````

### 长行换行与缩进

本站默认启用自动换行。下面第一块会换行并保留缩进，第二块可以横向滚动。

```js title="自动换行" wrap preserveIndent
function description() {
  return "一段较长的中文和 English 内容用于观察代码换行：保存文章后回到浏览器，确认每一种内容都保持在阅读区域内，并且不会撑宽整个页面。";
}
```

```text title="横向滚动" wrap=false
article-title / published-at / updated-at / description / image / category / tags / language / draft / previous-article / next-article
```

````markdown
```js wrap preserveIndent
function description() {
  return "这一行很长时，会换行并保留原来的缩进。";
}
```

```text wrap=false
这块保持一行，超出时横向滚动。
```
````

需要让续行从最左侧开始时，使用 `wrap preserveIndent=false`。

### 折叠次要代码

点击下面代码块里的折叠提示，可以展开被隐藏的准备工作与收尾步骤。

```js title="publish.js" showLineNumbers collapse={1-3,8-9}
const title = "内容与格式全览";
const tags = ["Markdown", "教程"];
const published = true;

// 先把读者需要理解的核心操作放在这里。
console.log({ title, tags, published });

// 收尾步骤可以按需展开。
console.log("文章已准备好");
```

````markdown
```js title="publish.js" showLineNumbers collapse={1-3,8-9}
const title = "内容与格式全览";
const tags = ["Markdown", "教程"];
const published = true;

// 先把读者需要理解的核心操作放在这里。
console.log({ title, tags, published });

// 收尾步骤可以按需展开。
console.log("文章已准备好");
```
````

## 图片与图注

图片使用 Markdown 图片语法。这里展示项目已有的本地图像；点击图片可打开大图，再按 Escape 关闭。

![蓝紫色天空与远处风景，作为文章宽幅图片示例](../../../assets/images/demo-banner.png)

*图：项目自带的横幅图像，保持原始比例显示。*

```markdown
![描述画面内容的替代文字](../../../assets/images/demo-banner.png)

*图：图片下方的一段说明。*
```

上面的相对路径适用于本文所在文件夹。自己的文章通常把图片放在旁边，写成 `![替代文字](./cover.png)`。也可引用 `public` 中的 `/images/cover.png`，或远程 `https://` 图片。

PNG、JPEG、WebP、GIF、AVIF、SVG 可作为图片资源，具体显示能力取决于浏览器；GIF 和动画 WebP 可用于动图。需要明确尺寸、图注结构时，可使用 HTML：

<figure>
  <img src="/favicon/favicon-light-128.png" alt="Arkiri 浅色站点图标" width="96" height="96" loading="lazy">
  <figcaption>原生 figure 与 figcaption：一张有说明的图片。</figcaption>
</figure>

```html
<figure>
  <img src="/favicon/favicon-light-128.png"
       alt="Arkiri 浅色站点图标" width="96" height="96" loading="lazy">
  <figcaption>原生 figure 与 figcaption：一张有说明的图片。</figcaption>
</figure>
```

## 音频与视频

Markdown 没有独立的音视频简写，直接使用 HTML 的 `<audio>` 和 `<video>`。这里的两个短样例随站点本地提供，不需要外部播放器。

### 音频：三声提示音

<audio controls preload="metadata" aria-label="三声合成提示音示例" style="width:100%">
  <source src="/media/content-guide/three-notes.wav" type="audio/wav">
  你的浏览器无法播放此音频，请使用下方下载链接。
</audio>

这是约三秒的合成提示音，没有人声。[下载音频样例](/media/content-guide/three-notes.wav)。

```html
<audio controls preload="metadata" aria-label="三声合成提示音示例"
       style="width:100%">
  <source src="/media/content-guide/three-notes.wav" type="audio/wav">
  你的浏览器无法播放此音频，请使用下方下载链接。
</audio>
```

### 视频：阅读进度演示

<video controls playsinline preload="metadata" width="960" height="540" poster="/media/content-guide/reading-progress.svg" aria-label="四秒阅读进度动画示例" style="width:100%;height:auto">
  <source src="/media/content-guide/reading-progress.mp4" type="video/mp4">
  <track kind="captions" src="/media/content-guide/reading-progress.zh.vtt" srclang="zh" label="中文" default>
  你的浏览器无法播放此视频，请使用下方下载链接。
</video>

一段四秒的无声动画，展示进度从开始到完成。播放器附有中文字幕轨道。[下载视频样例](/media/content-guide/reading-progress.mp4)。

```html
<video controls playsinline preload="metadata" width="960" height="540"
       poster="/media/content-guide/reading-progress.svg"
       aria-label="四秒阅读进度动画示例" style="width:100%;height:auto">
  <source src="/media/content-guide/reading-progress.mp4" type="video/mp4">
  <track kind="captions" src="/media/content-guide/reading-progress.zh.vtt"
         srclang="zh" label="中文" default>
  你的浏览器无法播放此视频，请使用下方下载链接。
</video>
```

| 媒体 | 常用格式 | 写法 |
| :--- | :--- | :--- |
| 音频 | MP3、WAV、Ogg、M4A | `<audio>` 内添加 `<source>` |
| 视频 | MP4、WebM、Ogg | `<video>` 内添加 `<source>` |
| 字幕 | WebVTT（`.vtt`） | `<video>` 内添加 `<track>` |

文件扩展名不代表所有浏览器都能播放，视频还取决于编码。本文视频采用 H.264 MP4。需要多个候选格式时，按顺序放多个 `<source>`，浏览器会选择它支持的类型。媒体文件放在 `public/media/`，正文路径从 `/media/` 开始。

## 外部视频与网页嵌入

使用平台提供的嵌入地址，放进 `iframe`；普通视频分享地址不一定能作为嵌入地址。下面按需展开加载，阅读文章时不会一次打开全部第三方播放器。

<details>
<summary>展开 YouTube 视频样例</summary>

<iframe src="https://www.youtube.com/embed/5gIf0_xpFPI" title="YouTube 视频嵌入示例" width="960" height="540" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="width:100%;height:auto;aspect-ratio:16/9;border:0"></iframe>

如果播放器不可用，可[在 YouTube 打开视频](https://www.youtube.com/watch?v=5gIf0_xpFPI)。

</details>

```html
<iframe src="https://www.youtube.com/embed/5gIf0_xpFPI"
        title="YouTube 视频嵌入示例" width="960" height="540"
        loading="lazy" allow="picture-in-picture; fullscreen"
        allowfullscreen
        style="width:100%;height:auto;aspect-ratio:16/9;border:0"></iframe>
```

<details>
<summary>展开 Bilibili 视频样例</summary>

<iframe src="https://player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&amp;p=1&amp;autoplay=0" title="Bilibili 视频嵌入示例" width="960" height="540" loading="lazy" allow="fullscreen" allowfullscreen style="width:100%;height:auto;aspect-ratio:16/9;border:0"></iframe>

如果播放器不可用，可[在 Bilibili 打开视频](https://www.bilibili.com/video/BV1fK4y1s7Qf/)。

</details>

```html
<iframe src="https://player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&amp;p=1&amp;autoplay=0"
        title="Bilibili 视频嵌入示例" width="960" height="540"
        loading="lazy" allow="fullscreen" allowfullscreen
        style="width:100%;height:auto;aspect-ratio:16/9;border:0"></iframe>
```

其他允许嵌入的网站也可使用 `iframe`。目标网站的安全策略、登录状态、地区与网络会影响显示；不允许嵌入的页面，请改成普通链接。

## GitHub 仓库卡片

用一条指令生成仓库卡片，参数为 `拥有者/仓库名`。页面打开后会通过 GitHub API 获取描述、星标、分支、许可和主要语言。

::github{repo="withastro/astro"}

```markdown
::github{repo="withastro/astro"}
```

仓库卡片依赖外部网络和 GitHub API 配额。若数据没有加载，可以直接[在 GitHub 查看 Astro 仓库](https://github.com/withastro/astro)。这里只需两条冒号 `::`，无需结束行。

## 从样例到自己的文章

先复制文章信息，再挑选需要的正文片段。保存后在本地预览检查图片、目录、代码复制和媒体播放；最后运行 `pnpm build`，确认文章进入正式构建与搜索索引。

当前没有启用 Mermaid 图表、MDX 组件、定义列表、Pandoc 表格或远程内容导入。不要把这些语法直接当作现成功能；简单图示可用 SVG 图片，复杂表格可用 HTML。

需要更集中的样例时，可以继续看[基础排版](/posts/markdown-basics/)、[扩展组件](/posts/markdown-extended/)和[代码功能](/posts/expressive-code/)。

[archive]: /archive/
[^writing]: 本文以仓库中的内容 schema、Markdown 管线和已启用插件为依据；普通 HTML 元素由浏览器渲染，媒体解码与第三方嵌入仍取决于浏览器及目标服务。
