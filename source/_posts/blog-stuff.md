---
title: blog stuff
date: 2025-10-02 19:45:06
tags:
---
## 目录
- [x] [linkformat](#linkformat)
- [Google analysis](#配置Google-analysis)
- [html](#html)
---
## linkformat
### 把文章链接改成 postname，无日期（已实操，已注释）

我希望把文章地址从带日期的结构改为仅使用文章名。例如当前这篇示例是带日期的：`https://www.jiangxu.net/2025/08/14/study-materials/`（参考链接见文末）。目标是变为：`https://www.jiangxu.net/study-materials/`。

- 关键词：Hexo `permalink`、`:title`、`slug`、`front-matter` 覆盖、`pretty_urls`

> 更改之前
<img src="/img/linkformatbf.png" alt="before" width="400">

> 更改之后
<img src="/img/linkformataf.png" alt="after" width="400">
### 具体的技术问题

1) 这是什么，为什么要改？
- 在 Hexo 里，`permalink` 决定每篇文章最终生成的访问路径。默认常见的是 `:year/:month/:day/:title/`，更偏向博客时间线；改成 `:title/` 可以获得更短、更“永久”的链接，便于记忆与分享。

2) 名词解释（够用就这些）
- [x] permalink：固定链接模板，支持占位符（如 `:title`）。
- [x] title vs slug：`title` 是文章标题，`slug` 是 URL 里使用的“短名称”。中文标题会直接出现在 URL 中（或被转义）。为保证简洁稳定，建议在 front-matter 里显式写 `slug`（英文/拼音）。
> 下面的对比表
- [x] front-matter 覆盖：单篇文章的 `permalink` 字段可以覆盖全局策略。
> 全站用一种规则，但某一篇你想要特别的 URL，就在这篇的 front-matter 里写 permalink，它会直接生效
- [x] pretty_urls：去除 `index.html`/`.html` 的外观选项，不改变目录式链接本质。
> 文件式链接显式带 .html 后缀；目录式链接不带后缀、更简洁
3) 工作原理（Hexo 渲染 → 最终 URL）
- Hexo 根据 `_config.yml` 的 `permalink` 模板，为每篇文章计算目标路径；例如 `:title/` 会在 `public/study-materials/index.html` 生成文件，访问时即 `https://域名/study-materials/`。
- 主题里常用 `post.permalink`/`page.permalink` 读取该最终地址，变化后会自动跟随，无需改主题模板。

4) 如何修改（不改主题，只动 Hexo 主配置）

- 打开站点根目录的 `_config.yml`，把 `permalink` 改为仅使用文章名：

```yaml
# URL
url: https://jiangxu.net/
permalink: :title/
pretty_urls:
  trailing_index: false   # 去掉末尾的 index.html（目录式链接更干净）
  trailing_html: true     # 保持目录式，不使用 .html 直出
```
- 补充：`trailing_index` / `trailing_html` 对照表

| 模板（permalink） | 配置 | 结果示例 |
| --- | --- | --- |
| `:title/` | `trailing_index: true` | `/foo/` |
| `:title/` | `trailing_index: false` | `/foo/`（无变化） |
| `:title/index.html` | `trailing_index: true` | `/foo/index.html` |
| `:title/index.html` | `trailing_index: false` | `/foo/` |
| `:title.html` | `trailing_html: true` | `/foo.html` |
| `:title.html` | `trailing_html: false` | `/foo` |

> 注：`:title.html` 仅受 `trailing_html` 影响，与 `trailing_index` 无关。

- 对中文标题或想自定义 URL 的文章，在 front-matter 里增加 `slug`：

```md
---
title: 学习资料
slug: study-materials
date: 2025-08-14 00:00:00
---
```
- 只想个别文章自定义完整路径（覆盖全局模板），可在该文 front-matter 指定 `permalink`：

- slug 与 URL 情况对照表

| 情况 | 源文件名 | front-matter | 全局 permalink | 最终 URL |
| --- | --- | --- | --- | --- |
| 标题=文件名，不写 slug | 学习资料.md | title: 学习资料 | :title/ | /学习资料/ |
| 标题≠文件名，不写 slug | hello-world.md | title: 学习资料 | :title/ | /hello-world/ |
| 写了 slug → 强制用 slug | hello-world.md | title: 学习资料, slug: study-materials | :title/ | /study-materials/ |
| 文件名含空格/符号，不写 slug | My Post!!!.md | title: 随笔 | :title/ | /my-post/ |
| 只改标题，不改文件名，不写 slug | hello-world.md | title: 学习资料（更新版） | :title/ | /hello-world/ |
| 改了文件名，不写 slug | greeting.md（改名后） | title: 学习资料 | :title/ | /greeting/ |

- 只想个别文章自定义完整路径（覆盖全局模板），可在该文 front-matter 指定 `permalink`：

```md
---
title: 特殊文章
permalink: my-special-post/
---
```

- 生成与本地验证：

```bash
hexo clean && hexo generate && hexo server
# 打开 http://localhost:4000 验证地址是否变为 /postname/
```


- 站内链接：你的 `_config.yml` 里 `relative_link: true`（相对链接）已开启，通常无需大规模替换；若手写了绝对旧链接，建议批量替换。
- 搜索引擎：更新/提交 `sitemap` 有助于加速索引更新（如使用 `hexo-generator-sitemap` 插件）。

6) 常见问题与排查
- 重名冲突：`permalink: :title/` 下，两个同名标题会竞争同一路径。给其中一个加 `slug` 解决。
- 中文/符号 URL：建议写 `slug`，避免 URL 编码或不稳定字符。
- 分类在路径里？若你想保留分类，可用 `:categories/:title/` 模板。
- 本地没生效：确认已 `hexo clean`，并非浏览器缓存；命令行无错误后再测试。

7) 打个比方（更好理解）
- 旧格式像“带日期的报纸档案柜”（年/月/日/标题）；新格式像“书名直达的书签”。加上 301 就像前台小哥告诉老访客“移到新书架啦，这边请”。

> 示例当前地址（旧格式）：[`https://www.jiangxu.net/2025/08/14/study-materials/`](https://www.jiangxu.net/2025/08/14/study-materials/)
---

## 配置Google analysis
### 我的稿子（GA4 接入与埋点，面试口吻）

我在 Hexo 静态博客里完成了 GA4 埋点闭环：用 `gtag.js` 与 `dataLayer` 绑定 `Measurement ID`，整页跳转开启自动 `page_view`，PJAX/SPA 关闭 `send_page_view` 改为路由变化时手动上报，确保 `page_path/page_location/page_title` 与会话归因准确。我为关键交互落了自定义事件（`click_outbound` 出站点击、`copy_code` 代码复制），通过 Realtime 与 DebugView 验证链路；在合规上启用 Consent Mode 默认策略，并在 CSP 中放行 `googletagmanager.com` 与 `google-analytics.com`。同时准备了大陆访问的加载失败容错与替代统计作为对照，避免数据断点。

- 关键词：GA4 Property、Measurement ID、`gtag.js`、`dataLayer`、`page_view`、自定义事件、PJAX/SPA、Consent Mode、CSP、Realtime/DebugView、`/g/collect`、Client ID（`_ga`）。

### 具体的技术问题（从 0 到能解释原理）

1) 这是什么，为什么要用它？
- GA4 是网站“访问统计与行为分析”的系统。它记录“有人来过哪一页、做了什么动作”。有了它，能回答“哪篇文章更受欢迎、用户从哪里来、点了哪些按钮”。

2) 名词解释（最常见的就这些）
- []GA4 Property：你的数据容器，所有事件最终汇总到这里。
- []Measurement ID：形如 `G-XXXXXXXXXX`，告诉 GA4 “发到哪个容器”。
- []gtag.js：Google 的前端 SDK，负责把事件打包并发送。
- []dataLayer：浏览器里的“事件队列”，`gtag()` 把配置与事件都 push 进去。
- []page_view：页面浏览事件；SPA/PJAX 不会自动刷新页面，需要手动上报。
- []Event：通用事件（名字 + 参数），比如 `click_outbound`、`copy_code`。
- []Client ID（_ga）：匿名访客 ID（存在一方 Cookie），用于区分不同用户。
- []DebugView/Realtime：调试与实时数据查看界面。
- []Consent Mode：在未授权广告/个性化时，限制数据存储与上报行为。
- []PJAX/SPA：不整页刷新，地址变了但页面没重载。

3) 工作原理（浏览器 → GA4）
- 首次加载：页面拉取 `gtag.js` → 初始化 `dataLayer` → `gtag('config', MeasurementID, ...)`。
- 事件上报：`gtag('event', 'page_view' | 'your_event', params)` → 发送到 `https://www.google-analytics.com/g/collect?...`。
- 汇总与展示：GA4 后台按会话与事件模型汇总，Realtime/DebugView 可即时查看。
- SPA 场景：路由变化时手动发 `page_view`，否则数据会偏低。

4) 如何接入（整页跳转站点）
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { send_page_view: true });
</script>
```

5) 如何接入（PJAX/SPA）
```html
<script>
  gtag('config', 'G-XXXXXXXXXX', { send_page_view: false });
  function sendPageView() {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname + location.search + location.hash
    });
  }
  document.addEventListener('pjax:complete', sendPageView);
  window.addEventListener('hashchange', sendPageView);
  sendPageView();
</script>
```

6) 常用自定义事件（可直接用）
```html
<!-- 出站链接点击 -->
<script>
  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const isExternal = a.host && a.host !== location.host;
    if (isExternal) {
      gtag('event', 'click_outbound', {
        event_category: 'engagement',
        event_label: a.href
      });
    }
  });
</script>

<!-- 代码复制 -->
<script>
  document.addEventListener('copy', function () {
    gtag('event', 'copy_code', {
      content_type: 'code',
      page_path: location.pathname
    });
  });
</script>
```

7) 调试与合规（建议 Preview/生产分开）
```html
<!-- 调试：Preview/本地可开，生产关闭 -->
<script> gtag('config', 'G-XXXXXXXXXX', { debug_mode: true }); </script>

<!-- 合规：Consent Mode 缺省策略与 CSP 提醒 -->
<script>
  gtag('consent', 'default', {
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    ad_storage: 'denied',
    analytics_storage: 'granted'
  });
  // CSP 需放行 https://www.googletagmanager.com 与 https://www.google-analytics.com
</script>
```

8) 常见问题与排查
- 无数据：检查 Measurement ID、控制台错误、广告拦截、CSP、网络失败。
- 双倍上报：避免主题配置与手动注入同时启用。
- SPA 数据偏低：未手动补发 `page_view`。

9) 数据流转图（GA4 上报链路）
```mermaid
graph LR
  A[Browser] --> G[gtag.js + dataLayer]
  G -- "config: Measurement ID" --> C[GA Collect endpoint /g/collect]
  G -- "page_view and events" --> C
  C --> P[GA4 Property]
  P --> R[Realtime & DebugView]
```

10) 打个比方（更好理解）
- 把 GA4 想成快递系统：`gtag.js` 是前台小哥，`dataLayer` 是待寄包裹清单，`gtag('config')` 就是告诉快递“寄到哪个仓库（Measurement ID）”。当你触发 `page_view` 或自定义事件，就像把包裹交给快递（`/g/collect`），最终入库到你的 GA4 Property；`Realtime/DebugView` 就是仓库的即时签收台。
- 再打一个：整页跳转像“走出这家店再进另一家”；PJAX/SPA 像“在同一家店换区域”。前者每次进店系统自然记一笔（自动 `page_view`），后者要你自己按一次计数器（手动上报）。

---
## HTML


### 引用于Google analysis部分
下面这段是你文件里正在用的 GA4 初始化脚本。先贴代码，再逐行讲。

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { send_page_view: true });
</script>
```

逐行解释：

- `<script async src="..."></script>`：告诉浏览器去下载并执行一个外部的 JavaScript 文件。
  - `src`：脚本的网络地址，这里是 Google 的 `gtag.js`。
  - `id=G-XXXXXXXXXX`：把你的 GA4 Measurement ID 传给脚本（上线前要替换成你自己的）。
  - `async`：异步加载，不会卡住页面渲染，脚本加载完就执行。

- `<script> ... </script>`：内联脚本，标签之间的内容是要在本页直接执行的 JavaScript。

- `window.dataLayer = window.dataLayer || [];`
  - `window`：浏览器的全局“储物柜”，挂在它上面的变量全站都能访问。
  - `dataLayer`：GA 常用的“事件队列”（数组），其他代码会往里放事件。
  - `|| []`：如果 `window.dataLayer` 已存在就用它，否则用一个新的空数组。

- `function gtag(){ dataLayer.push(arguments); }`
  - `function gtag(){ ... }`：定义一个名为 `gtag` 的函数（可重复调用的“小程序”）。
  - `dataLayer.push(...)`：把内容追加到事件队列的末尾。
  - `arguments`：函数内置的“实参列表”，代表你 `gtag(...)` 传入的所有参数。
  - 合起来：以后每次 `gtag(...)`，等于把一条“事件/配置”丢进队列，等 GA 读取上报。

- `gtag('js', new Date());`
  - 调用 `gtag` 并传两个参数：`'js'` 和当前时间 `new Date()`。
  - 含义：告知 GA “脚本初始化于某个时间点”。

- `gtag('config', 'G-XXXXXXXXXX', { send_page_view: true });`
  - 第1个参数 `'config'`：声明“这是配置”。
  - 第2个参数 `'G-XXXXXXXXXX'`：你的 Measurement ID（要替换成真实值）。
  - 第3个参数 `{ send_page_view: true }`：配置对象；`true` 表示自动发送一次页面浏览（`page_view`）。
  - 适用：整页跳转的站点用它最方便；如果是 PJAX/SPA，请改为 `false`，并在路由变化时手动上报。

常用语法小抄：

- 分号 `;`：一条语句的结束。
- 字符串 `'...'`/`"..."`：一段文本。
- 数组 `[]`：有序列表，`.push(x)` 追加一个元素。
- 对象 `{ key: value }`：键值集合（类似“字典”）。
- 函数 `function name(){}`：定义；`name(...)`：调用。
- 逻辑或 `a || b`：取第一个“真”的值（`a`不存在/为假时，用`b`）。

—— 实操提示：把两处 `G-XXXXXXXXXX` 都换成你的 Measurement ID，只保留一份 GA 代码（不要“主题自带 + 手动注入”同时存在）。

### 拓展：如果你的主题是 PJAX/SPA（无整页刷新）

SPA/PJAX 路由变化不会触发自动 `page_view`。做法：关闭自动上报，自己在路由变化时补发。

```html
<script>
  // 1) 关闭自动 page_view
  gtag('config', 'G-XXXXXXXXXX', { send_page_view: false });

  // 2) 定义一个“手动上报”的函数
  function sendPageView() {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname + location.search + location.hash
    });
  }

  // 3) 在你的主题里找到“路由切换完成”的时机去调用它
  document.addEventListener('pjax:complete', sendPageView); // 示例事件名
  window.addEventListener('hashchange', sendPageView);      // 如使用哈希路由

  // 4) 首次进入也补发一次
  sendPageView();
</script>
```

为什么要这么做？

- 整页跳转：浏览器会重新加载页面，自动 `page_view` 足够。
- PJAX/SPA：页面没有被“刷新”，需要你自己按“计数器”（手动上报），否则 GA 以为你没换页，数据会偏低。

### 比喻理解（帮你建立直觉）

- 快递系统：`gtag.js` 是前台小哥，`dataLayer` 是待寄的“单子”，`gtag('config', MeasurementID)` 告诉小哥“寄到哪个仓库”。你触发 `page_view` 或自定义事件，就像把包裹交给小哥（请求发到 `/g/collect`），最后入库到你的 GA4 Property；`Realtime/DebugView` 就是仓库的即时签收台。
- 逛商场：整页跳转像“出这家店再进另一家”，系统自然记一笔；PJAX/SPA 像“在同一家店换区域”，这时需要你手动按一下记步器（手动上报）。

