---
title: tools
date: 2025-10-01 15:20:10
categories:
  - study
tags:
  - git
  - md
---
## 目录

- [git](#git)
  - [修改远程仓库地址](#修改远程仓库地址)
  - [正确删除文件](#正确删除文件)
  - [Git 分支配置与远程仓库URL不匹配](#git-分支配置与远程仓库-url-不匹配)
- [md](#md)
  - [插入链接](#插入链接)
  - [插入图片](#插入图片)
  - [导出为pdf](#导出为pdf)
  - [写目录](#写目录)
- [Linux](#linux)
- [hexo](#Hexo)
- [快捷键](#快捷键)
- [流程图](#流程图)

# git 
### 修改远程仓库地址
- 查看远程仓库指向
git remote -v

### 正确删除文件
- git rm -r name //remove, recursive递归, 定位到根目录，name直接从下一级开始。
### Git 分支配置与远程仓库 URL 不匹配
- 当看到推送目标与预期不符时，检查 git config branch.<分支名>.remote 配置
- 确保分支的远程仓库配置与 git remote -v 显示的 URL 一致
- 使用 git config --list | grep branch 可以快速查看所有分支配置


# md
### 插入链接
- 作者：``[jx's blog]``+``(https://jiangxu.net/ "个人博客")``

### 插入图片
- 将图片放到 `source/img/`（发布后路径为 `/img/`）
- 桌面图片复制到项目：
```bash
cp ~/Desktop/screenshot.png /Users/jiangxu/Documents/code/myblog/source/img/
```
> 也可以在访达直接拖拽吧
- 在 Markdown 中引用：
```markdown
![截图说明](/img/screenshot.png)
```
- 需要控制大小（可选）：
```html
<img src="/img/screenshot.png" alt="截图说明" width="600">
```
- 文件名尽量用英文与连字符，避免空格。

### 导出为pdf
- 在md文件页面 ```cmd+Shift+P```

### 写目录
- ```- [显示在目录中的文字](#实际标题的锚点格式)```
- 锚点格式为：去掉标题中所有标点（含数字后的点），空格换为连字符`-`，保留中文和数字，不区分大小写。

# Linux
- pwd 查看当前路径
- rm -d name/directory 删除空目录
- rm -r //recursive递归，删除非空目录
- rm -f //force
- rm -rf //-r和-f一起
# Hexo
- hexo new "postname",
# 快捷键
- 撤销 ```cmd``` + ```z```
- 左移 ```cmd``` + ```[```

# 流程图

### 常用图形与语义（draw.io / diagrams.net）
| 形状 | 英文 | 含义/用法 |
| --- | --- | --- |
| 椭圆 | Terminator | 开始 / 结束 |
| 矩形 | Process | 处理步骤 / 任务 |
| 菱形 | Decision | 条件判断；分支线上标注“是/否”或“Y/N” |
| 平行四边形 | Input/Output | 输入 / 输出 |
| 双竖边矩形 | Predefined Process / Subprocess | 子流程；可链接到另一页/文档 |
| 圆角菱形 | Preparation | 准备 / 初始化 |
| 连接符（小圆） | On-page/Off-page Connector | 同页/跨页连接 |
| 波浪底矩形 | Document | 文档 / 结果文件 |
| 圆柱体 | Database / Storage | 数据库 / 持久化存储 |
| 延时 | Delay | 等待 / 延时 |
| 注释 | Annotation / Note | 补充说明；用虚线连到被注释对象 |

### 连线与布局
| 主题 | 建议/操作 |
| --- | --- |
| 连线类型 | 使用正交连线（Orthogonal）保持直角转折、减少视觉噪音 |
| 连接点与拐点 | 悬停形状边缘蓝点连线；双击连线加拐点；拖动黄色手柄统一连线间距 |
| 线条标注 | 选中连线直接输入文字；在判断分支线上标注“是/否” |
| 对齐与分布 | Arrange → Align/Distribute；Tidy up 一键整理网格化布局 |
| 网格与吸附 | View → Grid、Snap to Grid 打开更易对齐 |
| 分组与图层 | Cmd+G 分组、Cmd+Shift+G 取消；右键锁定；View → Layers 分离背景/说明/主流程 |
| 样式统一 | 右侧 Format 面板统一线条粗细（如 1.5–2px）、箭头、字体、颜色 |

### 导出与协作
| 项目 | 建议 |
| --- | --- |
| 保存 | 使用 .drawio 或 .drawio.png（含可编辑元数据）便于后续编辑 |
| 导出 | File → Export as → PNG / SVG / PDF |
| 背景 | 勾选 Transparent Background（透明背景） |
| 使用场景 | SVG：网页；PNG：博客；PDF：打印 |
| 版本/备份 | 本地或云端（Git、Google Drive、OneDrive），必要时使用版本历史 |

### 小技巧（draw.io）
| 动作 | 快捷/用法 |
| --- | --- |
| 快速连线 | 拖动形状四角蓝箭头，自动连线并生成新节点 |
| 复制/对齐 | Option(Alt) 拖拽复制；Cmd+D 复制；按住 Shift 拖动保持水平/垂直 |
| 多页图 | 底部 Pages 管理，将子流程放到独立页面并从子流程符号跳转 |
| 页面设置 | File → Page Setup 调整页面、边距，或开启自适应内容 |
| 搜索图形 | 左侧 Shapes 搜索“flowchart/uml”，或 + More Shapes 启用更多库 |
| 文案规范 | 步骤用动宾短语；判断为可判定条件；分支出口清晰不交叉 |
