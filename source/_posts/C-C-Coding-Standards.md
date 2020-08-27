---
title: C/C++ 编码规范
typora-root-url: ../../source/
date: 2020-08-27 20:25:24
tags:
  - C/C++
  - 编码规范
categories:
  - C/C++
---

规范的编码能增强代码的可读性，提升 debug 效率。良好的代码规范还能提升团队间的协作效率，起码别人不用费心去研究表达式的含义。

<!-- more -->

## 一个例子

### 反面教材

```c++
for (int i = n; i >= 0; i--) {
int d = pos - stop[i].f;
while (tank - d < 0)
{if (que.empty()) {
puts("-1");
return 0;
}
tank += que.top();
que.pop();ans++;}
tank -= d;pos = stop[i].f;
que.push(stop[i].s);
}
```

完全看不清这段代码在干什么，作用域尤其不清楚，如果看到上千行这样的代码会直接崩溃。

### 正面例子

那么格式化后，是这样的：

```c++
for (int i = n; i >= 0; --i) {
    int d = pos - stop[i].f;
    while (tank - d < 0) {
        if (que.empty()) {
            puts("-1");
            return 0;
        }
        tank += que.top();
        que.pop();
        ++ans;
    }
    tank -= d;
    pos = stop[i].f;
    que.push(stop[i].s);
}
```

代码含义一下子就明了了 。

## 编码原则

*   增加代码可读性
*   避免混淆
*   保持代码风格一致

### 关于注释

尽量使用单行注释 `// ...` 而不是多行注释 `/* ... */`，因为在大多数时候可以使用 IDE 快捷键 `Ctrl + /` 可以添加或取消单行注释，并且 `//` 后要添加空格，不同行的注释需要对齐，为函数和控制语句添加注释时，可以将注释放在上一行，例如：

```c++
for (int i = n; i >= 0; --i) {
    int d = pos - stop[i].f;
    // 一个操作
    while (tank - d < 0) {
        // que 为空
        if (que.empty()) {
            puts("-1"); // 输出
            return 0;   // 返回
        }
        tank += que.top();  // 取栈顶元素
        que.pop();          // 弹出栈顶
        ++ans;              // 更新答案
    }
    tank -= d;
    pos = stop[i].f;
    que.push(stop[i].s);
}
```

### 关于空行

头文件、宏定义与主要实现部分使用空行分开，如：

```c++
#include <iostream>
#include <vector>

bool cmp(int a, int b){
    //Do something here
}
```

同一个函数不同功能代码间使用空行分开。

### 关于空格

在赋值运算符、逻辑运算符、位运算符、算术运算符前后添加空格，例如 `name = "Alice"` 不能写成 `name="Alice"`。

在引用操作符 `.`、`->`、`[]` 前后不能添加空格。

添加空格的目的是让独立的 token 分开，加快阅读代码的速度。

### 关于缩进

按照代码逻辑水平缩进，缩进时使用 Tab 或四个 Space 或两个 Space 作为一个缩进单位，全局保持一致即可。 左大括号 `{` 使用 Java 风格，即放在上一行末，在前一个字符和 `{` 之间添加一个空格，也可选择左大括号放在新行，全局保持一致即可。

平行逻辑代码列对齐，子逻辑与上层逻辑有一个单位的缩进，例如：

```c++
for (int i = 0; i < n; ++i) {
    scanf("%s", field[i]);
}
for (int i = 0; i < n; ++j) {
    for (int j = 0; j < m; ++j) {
        if (field[i][j] == 'W') {
            dfs(i, j);
            ++count;
        }
    }
}
```

### 关于控制语句

无论控制语句有几行都要用使用 `{`、`}` 括起来，例如：

```c++
for (int i = 0; i < n; ++i) {
    ++x;
}
if (!s.empty()) {
    res = 1;
}
```

不能写成：

```c++
for (int i = 0; i < n; ++i)
    ++x;
if (!s.empty())
    res = 1;
```

### 一行只写一个语句

```c++
while (x != s) {
    ++x;
}
```

不能写成：

```c++
while (x != s) { ++x; }
```

或：

```c++
while (x != s) ++x;
```

### 命名

**不要使用拼音**，尤其是拼音缩写，会给其他阅读代码的人带来困扰。

在命名时尽量使变量名表达出它的含义，不要过度使用缩写。在 `for` 循环控制中可以使用 `i`、`j`、`k` 等简短的变量，以减少键入的时间。

变量使用下划线分割，如 `list_name` 、 `lake_field`，当然也可以选择小驼峰命名风格 `listName` 、 `lakeField`，或者其他自己喜欢的风格。

常量、宏定义使用全大写，如 `const int MAX = 100;` `#define MAXN 100005`。

函数名使用小驼峰命名，如 `string getStudentNumber(...)`、`int maxOfTree(...)`。

**强烈建议**类名使用大驼峰命名，如 `class Solution{...};`。

### 不建议的操作

编码时**不建议**使用第一眼看不出含义的特性，即使该特性是合法的。

不要这样写：

```c++
a = b = 5;
c += d++;
```

而是写成这样：

```c++
a = 5;
b = 5;
++d;
c += d;
```

不要这样写：

```c++
if (m -= d) {
    // Do something here
}
```

而是写成这样：

```c++
m -= d;
if (m != 0) {
    // Do something here
}
```