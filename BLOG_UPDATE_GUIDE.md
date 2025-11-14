# 📝 博客文章时间管理指南

## 问题说明

**痛点**：每次更新文章时，front matter 里的 `date` 不会自动更新。

**原因**：
- `date`: 文章创建时间（固定，不会自动更新）
- `updated`: 文章更新时间（会自动使用文件修改时间）

## ✅ 解决方案（已配置）

### 1. 配置说明

**`_config.yml` 已配置：**
```yaml
updated_option: 'mtime'  # 使用文件修改时间作为更新时间
```

**`scaffolds/post.md` 已更新：**
```yaml
---
title: {{ title }}
date: {{ date }}
updated: {{ date }}  # 新增
categories:
tags:
---
```

### 2. 所有文章已添加 `updated` 字段

✅ 所有现有文章已自动添加 `updated` 字段，使用文件的实际修改时间：

- tools.md: `updated: 2025-11-12 17:31:25`
- summary.md: `updated: 2025-11-11 15:46:33`
- blog-stuff.md: `updated: 2025-11-04 23:10:42`
- 等等...

## 🎯 使用方法

### 创建新文章
```bash
hexo new "文章标题"
```
自动生成的文章会包含 `date` 和 `updated` 两个字段。

### 更新文章
只需编辑文章内容并保存，`updated` 字段会**自动使用文件修改时间**！

**工作原理：**
1. 你编辑并保存文章
2. 文件系统更新文件的 `mtime`（修改时间）
3. Hexo 生成时读取 `mtime` 作为 `updated` 时间
4. 无需手动修改 front matter！

### 查看效果
```bash
hexo clean
hexo generate
hexo server
```

访问 `http://localhost:4000` 查看文章时间显示。

## 📊 字段说明

### `date` - 创建时间
- **用途**：记录文章首次发布时间
- **更新方式**：手动修改（如需要）
- **显示位置**：文章头部、归档页面

### `updated` - 更新时间  
- **用途**：记录文章最后修改时间
- **更新方式**：自动（文件修改时间）
- **显示位置**：文章头部（通常显示为"更新于"）

## 🔧 高级用法

### 场景 1：我只改了错别字，不想更新 updated 时间

**方法 1：** 在 front matter 中手动固定时间
```yaml
---
title: 文章标题
date: 2025-10-01 15:20:10
updated: 2025-10-01 15:20:10  # 手动指定，不会自动更新
---
```

**方法 2：** 使用 Git 恢复文件时间
```bash
# 提交后，Git 不会改变文件时间
git add source/_posts/article.md
git commit -m "fix typo"
```

### 场景 2：我想显示更新时间而不是创建时间

主题通常会同时显示 `date` 和 `updated`。如果想优先显示更新时间，可以在主题配置中调整。

### 场景 3：批量重置所有文章的 updated 时间

可以使用以下命令按文件修改时间重新生成：
```bash
# 触碰所有文章文件，更新其 mtime
find source/_posts -name "*.md" -exec touch {} \;
```

## 📝 最佳实践

### ✅ 推荐做法

1. **创建文章时：** 使用 `hexo new` 命令
2. **更新文章时：** 直接编辑保存，无需手动改时间
3. **小改动（错别字）：** 如果不想更新时间，在 front matter 中手动固定 `updated`
4. **大改动（内容重写）：** 让 Hexo 自动更新 `updated`，或手动指定新时间

### ❌ 不推荐做法

1. ~~每次手动修改 `date` 字段~~ → 用 `updated` 字段
2. ~~不使用 `updated` 字段~~ → 读者无法知道文章是否有更新
3. ~~频繁修改文章但不更新时间~~ → 影响读者体验

## 🎨 主题显示

Pure 主题会自动显示文章的创建和更新时间：

```
发布于: 2025-10-01
更新于: 2025-11-12  ← 自动显示 updated 时间
```

如果 `date` 和 `updated` 相同，通常只显示发布时间。

## 📚 参考资料

- [Hexo 官方文档 - Front Matter](https://hexo.io/docs/front-matter.html)
- [Hexo 配置 - updated_option](https://hexo.io/docs/configuration.html#Writing)

## 🆘 常见问题

### Q: 为什么我的文章没有显示更新时间？

**A:** 检查：
1. front matter 中是否有 `updated` 字段
2. `_config.yml` 中 `updated_option` 是否设置为 `'mtime'`
3. 主题是否支持显示更新时间

### Q: 我想手动指定更新时间怎么办？

**A:** 直接在 front matter 中编辑：
```yaml
updated: 2025-11-15 10:30:00
```

### Q: 我不想使用自动更新时间

**A:** 将 `_config.yml` 中的 `updated_option` 改为：
```yaml
updated_option: 'date'  # 使用 date 字段的值
# 或
updated_option: 'empty'  # 不设置 updated
```

---

**最后更新：** 2025-11-14
**作者：** AI Assistant

