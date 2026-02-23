---
title: Todolist
date: 2025-10-26 22:30:30
categories:
  - study
tags:
  - plan
---
## 学习清单
- [x] git
- [ ]调用栈，段，STL
- [] web移动端
- 复习之前的文章，
- [x] PR
- [x] docker，什么是amrm64架构？amd64镜像？ARM64 是低功耗、适配手机 / 树莓派 / 苹果 M 系列的 “CPU 语言”，AMD64 是高性能、适配普通台式机 / 笔记本 / 常规服务器的 “CPU 语言”
- [ ] 算法竞赛经典（第二版）4/10；give-up
- [x] css
- [] 数据结构6/10
- jquery,javascript-es5,web-component,
- js-es6,vue,react,计网，操作系统，计组看个速成视频

## 简历项目
### 小兔仙

### 高性能博客？
```
好的，我已经深入阅读了项目的核心代码。下面给你一个实际、诚恳的分析。

---

## 学习时间评估

**你的起点：** 会 Vue，意味着你已经理解了组件化、响应式数据、路由、状态管理等核心前端概念。这些概念在 React 中都有对应物，所以你不是从零开始。

| 阶段 | 预计时间 | 说明 |
|------|---------|------|
| React 基础语法 + Hooks | 5-7 天 | JSX、useState、useEffect、useRef 等 |
| 读懂这个项目 | 3-5 天 | 对照 Vue 概念理解 React 写法 |
| 能改动和扩展 | 3-5 天 | 加功能、删功能、改样式 |
| 能在面试中自信讲述 | 2-3 天 | 整理亮点、准备话术 |

**总计：大约 2-3 周**（每天投入 4-6 小时的情况下）

---

## 学习顺序和重点

### 第一阶段：React 基础（5-7 天）

**核心目标：** 建立 Vue → React 的概念映射

| Vue 概念 | React 对应 | 这个项目中的例子 |
|----------|-----------|----------------|
| `data()` | `useState` / `useSetState` | `sign-in.tsx` 中的 `useSetState` |
| `computed` | `useMemo` | 项目中用得不多，但要了解 |
| `watch` | `useEffect` / `useUpdateEffect` | `topics.tsx` 中的 `useUpdateEffect` |
| `mounted` | `useMount` | `topics.tsx` 中的 `useMount` |
| `v-if / v-for` | 三元表达式 / `.map()` | `topics.tsx` 中的条件渲染和列表渲染 |
| `Vuex` | Redux Toolkit | `store/` 目录 |
| `Vue Router` | react-router | `frontend.tsx` 中的路由配置 |
| `<slot>` | `props.children` | 各组件中 |

**学习资源建议：** React 官方文档的 "Quick Start" 和 "Learn React" 部分就够了，不需要看课。

### 第二阶段：读懂项目（3-5 天）

**按这个顺序读代码：**

1. **入口流程** — `main.tsx` → `pages/app.tsx` → `pages/frontend.tsx`，理解 Provider + Router 的套路
2. **一个完整的页面** — 重点读 `topics.tsx`（首页），它涵盖了：
   - 路由参数获取（`useParams`）
   - Redux 状态读取（`useSelector`）
   - 异步数据请求（`dispatch` + `getTopics`）
   - 条件渲染、列表渲染
   - ahooks 的使用（`useMount`, `useScroll`, `useDebounceEffect`）
3. **状态管理** — 读 `store/frontend/topics.ts`，理解 `createSlice` 的模式（对标 Vuex 的 module）
4. **API 层** — 读 `api/index.ts`，Axios 拦截器 + 统一错误处理
5. **鉴权逻辑** — 读 `frontend-authorized.tsx`，理解路由守卫（对标 Vue Router 的 `beforeEach`）
6. **后台部分** — 有了前面的基础，后台代码是同一套模式，快速过一遍即可

**重点理解的 3 个核心模式：**

- **Redux Toolkit 的 slice 模式：** `createSlice` → `reducer` + `actions`，异步请求在外部函数里调 API 再 dispatch action
- **Hooks 驱动的组件：** 所有逻辑都在函数组件里通过 hooks 组织，没有 class 组件
- **ahooks 库：** `useMount`、`useSetState`、`useUpdateEffect` 等，是对原生 hooks 的增强封装

### 第三阶段：动手改造（3-5 天）

边改边学，这是最快的方式。详见下面的改造建议。

### 第四阶段：面试准备（2-3 天）

面试时你需要能讲清楚：
- 项目整体架构（技术选型和为什么）
- 你做了哪些改造（体现独立思考）
- 遇到了什么问题、怎么解决的（体现实战能力）

---

## 二改建议：加什么 / 删什么

### 建议删掉或精简的部分

| 功能 | 理由 |
|------|------|
| **PWA 相关**（`reload-prompt.tsx`, `vite.config.pwa.ts`） | 博客场景 PWA 意义不大，且增加理解成本 |
| **react-router-redux** | 已经过时的库，路由状态放 Redux 里没必要，可以直接删掉 store 中的 `routing` |
| **toastr** | 既然用了 Ant Design，消息提示直接用 `message` 组件更统一 |
| **jQuery（editor.md）** | index.html 里引入了 jQuery 做 Markdown 编辑器，这在 React 项目里很违和，可以换成纯 React 的 Markdown 编辑器 |
| **store2** | 用于记录滚动位置，逻辑不复杂，可以直接用 `localStorage` 原生 API |

### 建议添加的特色功能（面试加分项）

| 功能 | 面试价值 | 难度 |
|------|---------|------|
| **暗色模式切换** | 展示 CSS 变量 + 状态管理能力，面试官爱问 | 低 |
| **文章目录（TOC）** | 解析文章 HTML 生成侧边目录，展示 DOM 操作能力 | 中 |
| **骨架屏（Skeleton）** | 替换现在的"加载中"文字，Ant Design 自带组件，展示 UX 意识 | 低 |
| **无限滚动替换"加载更多"按钮** | 用 `IntersectionObserver`，面试高频考点 | 中 |
| **文章搜索防抖优化** | 展示性能优化意识，项目已有 ahooks 的 `useDebounce` | 低 |
| **响应式移动端适配** | 当前项目移动端体验一般，展示 CSS 媒体查询能力 | 中 |
| **用 React.lazy + Suspense 做路由懒加载** | 当前所有页面是同步导入的，改成懒加载是很好的优化点 | 低 |

### 我最推荐的改造组合（性价比最高）

1. **路由懒加载** — 改动小，面试必问的性能优化点
2. **暗色模式** — 视觉效果明显，能讲的技术点多
3. **骨架屏** — 提升用户体验，Ant Design 直接用
4. **删掉 PWA 和 jQuery** — 让项目更干净，面试时说"我精简了不合理的技术选型"也是加分项

---

## 一句话总结

这个项目代码质量不错，结构清晰，模式统一，非常适合从 Vue 转 React 的人学习。你不需要学任何新"概念"，只需要学 React 的"写法"。**2-3 周全力投入，完全可以达到面试可讲的程度。**

现在情况很清楚了，给你讲明白。

---

## 这个项目的架构是什么样的

这个项目是**纯前端 SPA**，它本身**不包含任何后端代码和数据库**。整个架构是这样的：

```
┌─────────────────────┐        ┌─────────────────────┐        ┌──────────┐
│  你看到的这个项目      │  /api  │  独立的后端 API 项目   │        │ MongoDB  │
│  mmf-blog-vite-react │ ────→ │  mmf-blog-api-koa2-v2│ ────→ │ 数据库    │
│  (React SPA)         │        │  或 mmf-blog-api-v2  │        │          │
└─────────────────────┘        └─────────────────────┘        └──────────┘
       前端（你手上的）              后端（另一个仓库）            数据存储
```

**关键信息：**

- **后端是另一个独立项目**，有两个版本可选：
  - Koa2 版：`mmf-blog-api-koa2-v2`
  - Express 版：`mmf-blog-api-v2`
- **数据库是 MongoDB**（从 docker-compose.yml 可以看到 `mongo:4.0` 镜像）
- 前端所有数据请求都走 `/api` 前缀，开发时通过 Vite proxy 转发到 `https://api.mmxiaowu.com`（作者的线上 API），生产环境通过 Nginx 反向代理转发

**所以你现在开发时其实是在白嫖作者的线上 API**，不需要自己搭后端就能跑起来。

---

## Vercel Serverless 能搞定吗？

**前端部署：完全没问题。** Vercel 天生就是干这个的，React SPA 部署到 Vercel 非常简单。

**后端 API：有三条路可以走，难度递增：**

### 方案一：继续用作者的 API（最省事）

在 Vercel 上配置 `vercel.json`，把 `/api` 请求 rewrite 到 `https://api.mmxiaowu.com`：

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.mmxiaowu.com/api/:path*" }
  ]
}
```

**优点：** 零成本，5 分钟搞定
**缺点：** 依赖作者的服务器，随时可能挂；后台管理功能你没有管理员权限

### 方案二：用 Vercel Serverless + 云数据库（推荐，面试加分）

把后端 API 用 Vercel Serverless Functions 重写，数据库用免费的 **MongoDB Atlas**（免费额度 512MB，博客完全够用）。

```
Vercel
├── 前端 SPA（静态文件）
└── /api 路由 → Serverless Functions（Node.js）→ MongoDB Atlas（云数据库）
```

**优点：** 全栈项目，面试含金量翻倍；全部免费
**缺点：** 需要自己写后端 API，工作量大概 3-5 天（但 API 逻辑不复杂，就是 CRUD）

**具体做法：**
1. 在项目根目录创建 `api/` 文件夹，Vercel 会自动识别为 Serverless Functions
2. 注册 MongoDB Atlas 免费版，拿到连接字符串
3. 用 `mongoose` 连接数据库，写增删改查接口

### 方案三：后端单独部署（传统方案）

把作者的 Koa2/Express 后端项目 clone 下来，部署到：
- **Railway / Render**（免费额度）
- **自己的服务器**

前端还是放 Vercel，配置 rewrite 指向你的后端地址。

**优点：** 不用重写后端
**缺点：** 需要额外维护一个后端服务 + 一个 MongoDB 实例

---

## 我的建议

如果你的目标是**面试**，我强烈推荐**方案二**。原因：

1. "我用 Vercel Serverless Functions 重写了后端 API" 这句话在面试里非常有说服力
2. MongoDB Atlas 免费，Vercel Serverless 免费，总成本为零
3. 你可以大幅**精简 API**——博客不需要那么多功能，只保留文章列表、文章详情、分类这几个核心接口就够了，登录注册和后台管理可以先砍掉
4. 面试时你能讲的技术点变多了：Serverless 架构、云数据库、API 设计、全栈部署

**精简后的最小可行 API 只需要 4-5 个接口：**

| 接口 | 功能 |
|------|------|
| `GET /api/frontend/article/list` | 文章列表（分页、分类、搜索） |
| `GET /api/frontend/article/item` | 文章详情 |
| `GET /api/frontend/trending` | 热门文章 |
| `GET /api/frontend/category/list` | 分类列表 |

这 4 个接口用 Vercel Serverless + Mongoose 写，一天就能搞定。
```

## ideas项目
1. todomvc
- 先从0用vue？实现，可以对比不同框架
- 都过一遍之后，选一种进行深入：
  - 路线进度表
  - 倒数日
  - 配置ai问答窗口，
  - Google登陆，
  - Supabase
- 鱼骨图

- 参考番茄todo倒计时
- echarts可视化
2. 开源博客模版
- 更丰富，参考mengjian.site有：在线简历，项目经验，联系方式主栏目，https://www.mengjian.site/
- 色调保留
- 添加详细readme
- 添加GitHub贡献功能等
- 足迹地图

3. 笔记模版
- 题目笔记类
- 技术类
- 分享类

4. 包装地图项目


## 插件练习
1. 








## 重要事件
- [11月10号交工院，13-17交信工，18-24考核，28-2公示](https://jwc.cugb.edu.cn/c/2025-11-03/838362.shtml)
- 成绩单，审批表，个人自述，；；审批表登记表发邮件。
- 11月7-11日，纸质（审批表2，成绩单1，个人自述，奖项复印件；电子（审批表，信息登记表，命名格式发邮箱）[转专业材料](https://sai.cugb.edu.cn/c/2024-11-05/812704.shtml)
- 11月8日数学竞赛。

- [11月19日转专业面试](https://jwc.cugb.edu.cn/c/2024-10-29/812158.shtml)
- [11月23日六级](http://cet-bm.neea.edu.cn)
