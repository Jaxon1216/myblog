---
title: tools
date: 2025-09-01 15:20:10
categories:
  - study
tags:
  - git
  - md
---
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

### 导出为pdf
- 在md文件页面 ```cmd+Shift+P```
# Linux
- pwd 查看当前路径

# 快捷键
- 撤销 ```cmd``` + ```z```
- 左移 ```cmd``` + ```[```