# Arkiri

一个用 Astro 构建的个人博客：三栏贴边留白的阅读版式、纸墨与单一强调色的工业界面、中英双语可切换。

## 技术栈

- **Astro**：静态站点生成，内容集合、RSS、sitemap、Pagefind 搜索。
- **[fuwari](https://github.com/saicaca/fuwari)**：上游博客模板（MIT）。内容结构、i18n、搜索、RSS 等基础能力来自它。
- **[endfield-ui skill](https://github.com/hhikr/endfield-ui-skill)**：界面的视觉与交互规范。本站的纸面、墨色、单一酸黄强调色、切角、编号记录行、短促机械动效，都是照这个 skill 重做的；样式以 `src/styles/endfield.css`（套件）＋ `src/styles/endfield-project.css`（项目覆盖层）组织。

## 字体

- **界面西文**：自托管的 [Saira](https://fonts.google.com/specimen/Saira) 可变字体（`public/fonts/saira/`，OFL），按 `unicode-range` 分片，只在需要时下载。
- **正文（中英文）**：HarmonyOS Sans SC Regular + Bold，来自 Huawei Device Co., Ltd.，按 `unicode-range` 切成 woff2 分片放在 `public/fonts/harmonyos-sc/`。授权文件见同目录 `LICENSE.txt`；页脚注明 `Typeface: HarmonyOS Sans (Huawei)`。字体本身未做字形修改，只做了网页分发所需的分片与格式转换。
- 中文界面小标与标题按设计回落到系统黑体（PingFang SC 等），不额外下载中文字体。

## 功能

- 三栏布局：左栏贴视口边缘，正文列固定 712px 居中，右侧页边放目录与小组件；≥1200 时启用，以下退回顶栏 + 单栏。
- 主题两态：默认浅色，单按钮切换，无「跟随系统」，刷新保持。
- 中英切换：界面文案在构建时双语渲染，切换只改 `<html data-ui-lang>`，不重新加载、不复制路由；文章正文不翻译。
- 目录吸顶：文章页右栏只保留目录，随滚动停留；首页/归档/关于仍是三块面板。
- 换页动效：单页跳转只播一次快门动画（出站阶段无动画）。
- 搜索：Pagefind 全文检索；RSS 与 sitemap 由 Astro 生成。
- 根字号固定 20px，版式不随浏览器默认字号漂移（浏览器缩放仍有效）。

## 开发

```bash
pnpm install
pnpm dev       # 本地开发
pnpm build     # 构建到 dist/（含 Pagefind 索引）
pnpm preview   # 预览构建产物
```

部署域名在 `astro.config.mjs` 的 `site` 里改。

## 项目结构

```
src/
  components/        界面组件（ef/ 为套件风格组件，widget/ 为侧栏组件）
  content/           文章、关于页等 Markdown 内容
  layouts/           Layout.astro（全局外壳）与 MainGridLayout.astro（三栏栅格）
  pages/             路由：首页分页、文章、归档、关于、RSS、sitemap
  styles/            endfield.css（套件）、endfield-project.css（项目覆盖）、
                     fonts.css / fonts-harmonyos.css、markdown 与过渡样式
public/
  fonts/             Saira 与 HarmonyOS Sans 的分片字体
  contours/          背景等高线 SVG
```

## 致谢与许可

- 模板：[fuwari](https://github.com/saicaca/fuwari)（MIT），其版权与许可声明保留在仓库的 `LICENSE` 中。
- 界面规范：[endfield-ui skill](https://github.com/hhikr/endfield-ui-skill)。
- 字体：Saira（OFL）、HarmonyOS Sans（Huawei Device Co., Ltd.，见 `public/fonts/harmonyos-sc/LICENSE.txt`）。
- 本站内容与代码：见仓库 `LICENSE`。
