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