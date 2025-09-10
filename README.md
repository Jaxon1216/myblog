# Blog Source Code

这是我的个人博客的源代码仓库，使用 Hexo 静态博客框架构建。

## 项目结构

```
blog/
├── _config.yml          # Hexo 主配置文件
├── source/              # 博客内容源文件
│   ├── _posts/         # 博客文章
│   └── img/            # 图片资源
├── themes/              # 主题文件
│   └── hexo-theme-aircloud/
└── package.json         # 项目依赖
```

## 双仓库部署方案

本项目采用双仓库部署方案：

1. **源码仓库** (`blog-source`): 存储 Hexo 项目源代码
2. **部署仓库** (`Jaxon1216.github.io`): 存储生成的静态文件，用于 GitHub Pages 部署

## 开发流程

### 本地开发
```bash
# 安装依赖
npm install

# 本地预览
hexo server

# 生成静态文件
hexo generate
```

### 部署到 GitHub Pages
```bash
# 部署（会自动推送到 Jaxon1216.github.io 仓库）
hexo deploy
```

## 配置说明

- 部署配置在 `_config.yml` 的 `deploy` 部分
- 主题使用 `hexo-theme-aircloud`
- 文章存储在 `source/_posts/` 目录

## 注意事项

- 不要手动修改 `public/` 目录，它由 `hexo generate` 自动生成
- 主题文件已包含在源码仓库中，便于自定义修改
- 部署时会自动推送到 GitHub Pages 仓库 