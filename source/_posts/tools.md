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

```bash
git remote -v
```

- 基础

  - `git commit`(创建并指向新的子节点) 与 parent 节点
  - `git branch`
  - `git checkout`(换*)，简洁版本（`git checkout -b <your-branch-name>`）
  - `git merge`(差不多把对面分支连到自己身上，)
  - `git rebase` 对面(把自己搞个副本作为对面子级)

- 进阶：

  - 分离 head：head, 直接 checkout 目前分支所指的记录，head 就指过去了
  - 相对引用：`checkout 目标^`（把目标移动到目标的父级, 或者 `～1`），感觉有点单向链表，结构体指针的味道，分支是命名指针，head 是指向指针的指针，commit 链就是单向链表
  - `git branch -f` (force) `main HEAD~3`：main 强制指向 (head 的父级上 3 个单位)，（不需要换过去分支，便捷）
  - `git reset HEAD~1`，回到父级，但是子级还在但是未加入暂存区，对于远程无效
  - `git revert HEAD` (当前*)，一个新的提交，引入了更改，状态与上上级相同，远程有效

- 最后一个 git pull，让 gpt 来：

  - `git fetch`：只更新远程指针，不动你本地分支。从远处拿过来，
  - `git pull`：fetch + merge（最常用）
  - `git pull --rebase`：fetch + rebase（让你的提交排在远程节点后面）
  - `git push`：把你本地的节点推到远程（相当于反向传递链表）。


### 正确删除文件
- `git rm -r name` // remove, recursive 递归, 定位到根目录，name 直接从下一级开始。
### Git 分支配置与远程仓库 URL 不匹配
- 当看到推送目标与预期不符时，检查 git config branch.<分支名>.remote 配置
- 确保分支的远程仓库配置与 git remote -v 显示的 URL 一致
- 使用 git config --list | grep branch 可以快速查看所有分支配置


# md
### 插入链接
- 作者：`[jx's blog]` + `(https://jiangxu.net/ "个人博客")`

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
- 在 md 文件页面 `cmd+Shift+P`

### 写目录
- `- [显示在目录中的文字](#实际标题的锚点格式)`
- 锚点格式为：去掉标题中所有标点（含数字后的点），空格换为连字符`-`，保留中文和数字，不区分大小写。

# Linux
- `pwd` 查看当前路径
- `rm -d name/directory` 删除空目录
- `rm -r` // recursive 递归，删除非空目录
- `rm -f` // force
- `rm -rf` // -r 和 -f 一起
# Hexo
- `hexo new "postname"`,
# 快捷键
- 撤销 `cmd` + `z`
- 左移 `cmd` + `[`
- 在 html 内输入 `.name` 之后，光标在标签中间，可以按 `cmd` + `return` 换到下一行行首
# 流程图

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
