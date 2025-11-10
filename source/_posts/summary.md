---
title: Reading Notes on Competitive Programming 2
date: 2025-10-17 15:20:10
categories:
  - study
tags:
  - C++
  - algorithm
---

总结知识点，记录答疑解惑，记录实践所得。

---

# 算法竞赛入门经典

## 第一章
这一章是c语言程序设计入门，涉及到编译，算术表达式，整数和浮点数，

#### 必须熟练
- 输入浮点数是`%lf`输出是`%f`
- 数学库跟c++不一样，是`math.h`不是`cmath`
- 定义派：`const pi = acos（-1.0）`
- 输入不要忘记`&`
- 非>与>或
#### 做题得出
- 数字反转题，本来输出25，想要输出025，改格式：`%03d`,0填充，长度3
- 整数类型有限，从`-2^31~2^31-1`,`1e9.32`；
- 浮点有精度界限（double 能精确表示整数直到 `2^53≈9e15`），**15**位
- 浮点运算产生特殊值`（inf、-inf、NaN）`而不会直接崩溃；
- 整数除以 0 是危险的（未定义），常会崩溃，报错，比如`1/0`
- 输入正整数a，输出三角函数要变成`a*pi/180`
- 闰年: 模4为0 或 模400不为0
- a如果是double，那么`a/9`和`a/9.0`是一样的；如果是int，`（double）a/9`和`a/9.0`一样的

## 第二章
这一章涉及循环，计数器，累加器，调试方法，计时函数，读写文件
#### 必须熟练
- aabb：不要忘了数学特性而老想着取模，`a*1100+b*11`
- 判断完全平方数，`int m = floor(sqrt(n)+0.5);`然后`if(m*m==n)return 1;`,0.5是因为浮点数的运算（和函数）有可能存在误差把0.9999999判成0
- `#include<time.h>`,`(double)clock()/CLOCKS_PER_SEC`
- while里面写`scanf("%d%d",&a,&b)==2 && (a!=0 && b!=0)`来读取多组数据
- 输入输出重定向是使用文件最简单的方法
> `freopen("input.txt","r",stdin); freopen(ouput.txt","w",stdout)`
- 要计算只包含加法、减法和乘法的整数表达式除以正整数n的余数,可以在每步计算之后对n取余,结果不变
#### 做题得出
- 找到正常输出，找不到就输出指定内容的，可以用`int found = 0`
- 题目给的范围到达1e6，就要时常注意又没哟乘法运算，因为1e6做乘法就大于了1e9，直接上`long long`
- 输入c，想输出c位小数，则`printf("%.*f",c,n)`


---
# 豆包模拟面试

- 问题：说说 if 语句和 switch 语句的区别？
>if 语句灵活性高，适合各类条件判断（包括范围判断、多条件组合等）；switch 语句适用于简单的等值判断，代码结构更简洁、可读性更强。
- 问题：for 循环和 while 循环在用法上有什么不同？
>for 循环包含初始化、循环条件、递增 / 递减表达式，逻辑集中，适用于已知循环次数的场景（如遍历数组）；while 循环仅包含循环条件，需在循环体内控制变量变化，适用于未知循环次数、满足条件就持续循环的场景。
- 问题：C++ 中引用是什么？它和指针有什么不同？
>引用是变量的别名，与原变量指向同一块内存；它和指针的不同在于，引用初始化后不能再指向其他变量，且无需解引用操作，使用更简洁安全。
- 问题：C++ 中如何进行动态内存分配？使用时需注意什么？
>动态内存分配用 new 和 delete 操作符，new 用于分配内存，delete 用于释放内存；使用时需注意避免内存泄漏，即分配的内存必须用 delete 释放，否则程序长期运行会出问题。
- 问题：C++ 的异常处理机制是什么？如何使用？
>异常处理机制用于处理程序运行时错误，核心关键字是 try、catch、throw；try 块放可能出错的代码，出错时用 throw 抛出异常，catch 块捕获异常并处理。
- 问题：C++ 中类和对象的关系是什么？
>类是对象的模板，定义了对象的属性（成员变量）和行为（成员函数）；对象是类的实例，根据类的模板创建，拥有类定义的具体属性和行为。
- 问题：虚函数在面向对象编程里有什么作用？
>虚函数用于实现动态联编（运行时绑定），即程序运行时才决定调用哪个类的成员函数，能提高代码的可扩展性和可维护性。
- 问题：你了解 C++ 的模板吗？它有什么优点和缺点？
>模板是 C++ 实现泛型编程的重要特性，可让同一套代码处理多种数据类型；优点是减少代码冗余、提升开发效率（如 STL 的 vector、list 等容器是模板类）；缺点是可能导致代码膨胀（编译时为不同数据类型生成单独代码），调试难度较高。
- 问题：C++ 中类的继承有哪几种类型，每种类型的特点又是什么呢？
>C++ 的继承有公有继承、私有继承和保护继承。公有继承呢，基类的公有成员和保护成员在派生类中保持不变，私有成员不可访问。私有继承，基类的公有成员和保护成员在派生类中变成私有成员，私有成员还是不可访问。保护继承呢，基类的公有成员在派生类中变成保护成员，保护成员不变，私有成员同样不可访问。
- 







---
# 知识性
### `return`、`break`、`return 0` 

### 一句话结论

- 在 `void` 函数里用 `return;` 直接结束函数。
- `break;` 只退出当前循环/`switch`，函数还会继续往下执行。
- `return 0;` 是“有返回值的函数”返回整数 0。

#### 最小示例

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

#### 如果把第二个 `return` 换成 `break` 会怎样？

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

####  `return;` 和 `return 0;`

- `return 0;`：用于有返回值的函数，返回整数 0。
- `return;`：用于 `void` 函数，只退出函数，不返回值。

```cpp
int main() { return 0; }
int add(int a, int b) { return a + b; }
void ascinsert(eleType v) { /* ... */ return; }
```

#### 速查表

| 语句        | 适用场景           | 作用                    |
| ----------- | ------------------ | ----------------------- |
| `break;`    | 循环或 `switch` 内 | 跳出当前循环/`switch`   |
| `return;`   | `void` 函数        | 立即结束整个函数        |
| `return 0;` | 返回 `int` 的函数  | 结束函数并返回 `0`      |

### delete

#### delete

```cpp
int* p = new int(5);    // 单个对象
delete p;               // 正确：不需要[]

int* arr = new int[10]; // 数组
delete[] arr;           // 必须加[]

// 错误示范
int* wrong = new int[10];
delete wrong;           // 未使用[] → 内存泄漏/未定义行为
```

- 不需要加`[]`的情况：
  1. 释放**单个对象**时用`delete`
  2. 当指针是`nullptr`时（`delete nullptr`安全但无意义）

- 必须加`[]`的情况：
  - 释放数组时用`delete[]`
  - 与`new[]`严格配对使用

- 核心原则：`new`和`delete`形式必须匹配

---

### c中的打印
```c
if(x >= 10) 
    printf("%c", 'A' + x - 10);
else 
    printf("%d", x);
```

`printf` 是 C 语言中用于格式化输出的标准函数。格式说明符以 `%` 开头，指定如何显示后续参数。

在上面的代码中：
- `%c` 是字符格式说明符，它将整数值转换为对应的 ASCII 字符。`'A' + x - 10` 计算出 A-F 对应的字符。
- `%d` 是十进制整数格式说明符，直接输出数字。

其他常见的格式说明符：
- `%s`: 字符串
- `%f`: 浮点数
- `%x`: 十六进制数（小写 a-f）
- `%X`: 十六进制数（大写 A-F）
- `%p`: 指针地址

C++ 中通常使用 `cout` 进行输出：
```cpp
if(x >= 10) 
    cout << static_cast<char>('A' + x - 10);
else 
    cout << x;
```
C 的 `printf` 需要手动指定格式，而 C++ 的 `cout` 会根据变量类型自动选择格式。


---
### 易混括号

#### `Type name[N]` - 数组声明
```cpp
Queue<int> q[1001];  // 创建1001个队列对象 ❗易错点
vector<int> v[5];    // 创建5个vector对象
```
**特点：** 创建N个独立的Type对象  
**坑点：** 这不是1个大小为N的队列，而是N个独立的队列！
#### `Type name(N)` - 带参构造
```cpp
vector<int> v(100);  // 1个vector，含100个元素
string s(5, 'a');    // 1个string，5个'a'
```
**特点：** 创建1个对象，初始化N个内容
#### `Type name{N}` - 列表初始化
```cpp
vector<int> v{1,2,3}; // 1个vector，元素为1,2,3
int arr[]{1,2,3};     // 3个int的数组
```
**特点：** 使用花括号指定初始值
##### 快速记忆
- `[N]` → 多个对象（N个Type）
- `(N)` → 单个对象，N个内容  
- `{N}` → 初始化值为N


### i++和++i

之前都是似懂非懂，现在来总结一下：
  - 区别能体现：涉及立刻赋值，立刻打印，数组索引，return， 条件判断
  - 一样效果：循环，单独写一行，函数调用`fun（xxx）`；



# 非知识性
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
