---
title: confusion
date: 2025-08-28 15:20:10
categories:
  - study
tags:
  - C++
  - 
---
# 常识性
### index.md无内容但侧边栏显示仓库
- index.md只有前置信息无实际内容，侧边栏仓库信息配置在主题配置文件的`projects`和`repository`部分，非Markdown文件内容决定。

#### Hexo中repository/index.md与主题配置的关系
在Hexo博客系统中，`source/repository/index.md`文件与侧边栏显示的GitHub仓库列表之间存在一种特殊的关系：

1. **index.md文件的作用**：
   - 这个文件主要是创建一个名为"Repositories"的页面路由（/repository/）
   - 它包含前置信息（Front Matter）定义了页面标题、布局等基本属性
   - 文件本身可以不包含任何内容，因为实际显示的仓库信息是从主题配置中获取的

2. **主题配置中的仓库设置**：
   - 在`themes/pure/_config.yml`文件中，仓库信息通过两个部分配置：
     ```yaml
     repository:
       platform: github # 托管平台（github | gitee）
       username: Jaxon1216 # 用户名
     ```
     和
     ```yaml
     projects:
       cofess/hexo-theme-pure: https://github.com/cofess/hexo-theme-pure
     ```
   - `repository`部分定义了平台和用户名
   - `projects`部分直接列出了要显示的特定仓库

3. **工作原理**：
   - 当访问`/repository/`页面时，Hexo使用`layout: repository`指定的布局模板
   - 该模板会读取主题配置文件中的`repository`和`projects`部分
   - 即使`index.md`文件中没有内容，模板也会根据配置信息渲染出仓库列表

这就是为什么即使`source/repository/index.md`文件中没有任何内容，侧边栏仍然能够显示GitHub仓库的原因。修改仓库显示需要编辑主题配置文件，而不是修改index.md文件。


# 知识性
### `return`、`break`、`return 0` 一看就懂

### 一句话结论

- 在 `void` 函数里用 `return;` 直接结束函数。
- `break;` 只退出当前循环/`switch`，函数还会继续往下执行。
- `return 0;` 是“有返回值的函数”返回整数 0。

### 最小示例

```cpp
void LinkedList::ascinsert(eleType value) {
    if (size == 0) {
        insert(0, value);
        return;                 // 提前结束整个函数
    }
    ListNode* curr = head;
    for (int i = 0; i < size; ++i) {
        if (value <= curr->data) {
            insert(i, value);
            return;             // 找到位置后直接结束函数
        }
        curr = curr->next;
    }
    insert(size, value);
}
```

### 如果把第二个 `return` 换成 `break` 会怎样？

```cpp
void LinkedList::ascinsert(eleType value){
    if (size == 0) { insert(0, value); return; }
    ListNode* curr = head;
    for (int i = 0; i < size; ++i){
        if (value <= curr->data){
            insert(i, value);
            break;              // 只跳出 for 循环
        }
        curr = curr->next;
    }
    insert(size, value);        // 仍会执行 → 造成重复插入
}
```

- 核心原因：`break` 只离开循环，函数没有结束；而 `return` 结束整个函数。

### `return;` 和 `return 0;`

- `return 0;`：用于有返回值的函数，返回整数 0。
- `return;`：用于 `void` 函数，只退出函数，不返回值。

```cpp
int main() { return 0; }
int add(int a, int b) { return a + b; }
void ascinsert(eleType v) { /* ... */ return; }
```

### 速查表

| 语句        | 适用场景           | 作用                    |
| ----------- | ------------------ | ----------------------- |
| `break;`    | 循环或 `switch` 内 | 跳出当前循环/`switch`   |
| `return;`   | `void` 函数        | 立即结束整个函数        |
| `return 0;` | 返回 `int` 的函数  | 结束函数并返回 `0`      |
