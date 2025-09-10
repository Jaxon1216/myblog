---
title: confusion
date: 2025-08-28 15:20:10
categories:
  - study
tags:
  - C++
  - 
---

## `return`、`break`、`return 0` 一看就懂

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
