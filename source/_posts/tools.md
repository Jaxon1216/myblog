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

### Git 分支配置与远程仓库 URL 不匹配
- 当看到推送目标与预期不符时，检查 git config branch.<分支名>.remote 配置
- 确保分支的远程仓库配置与 git remote -v 显示的 URL 一致
- 使用 git config --list | grep branch 可以快速查看所有分支配置