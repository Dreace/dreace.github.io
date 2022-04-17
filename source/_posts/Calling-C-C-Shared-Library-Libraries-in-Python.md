---
title: 在 Python 中调用 C/C++ 共享库
typora-root-url: ../../source/
date: 2022-04-17 19:36:34
tags:
  - Python
  - C/C++
categories:
  - Python
---

由于 Python 自身的特性（脚本语言、动态类型等）在性能和效率方面不是很理想，如果想在 Python 获得更高的运行性能可以通过调用 C/C++ 编写的共享库实现。

<!--more-->

## 前言

使用 C/C++ 编写的程序可以编译为共享库（Shared Library，Linux 中后缀为 `.so`）供其他程序在运行时加载并使用，Python 的标准库 `ctypes` 实现了加载、函数寻址、函数调用等方法可以方便地使用共享库[^1]。

## 生成共享库

假设有如下 C++ 代码实现了 64 位整型的加法和乘法、截取子字符串，以及一个名叫 `Point` 的结构体有 `x` 和 `y` 两个 32 位整型成员、两个 `Point*` 类型相加的函数。演示代码所以 `Substr` 函数实现偷懒了。

```cpp
#include <cstdint>
#include <string>

extern "C" {
    typedef struct Point {
        int32_t x;
        int32_t y;
    } Point;

    Point PointAdd(Point* a, Point* b) {
        Point result;
        result.x = a -> x + b -> x;
        result.y = a -> y + b -> y;
        return result;
    }

    int64_t Add(int64_t a, int64_t b) {
        return a + b;
    }

    int64_t Mul(int64_t a, int64_t b) {
        return a * b;
    }

    const char* Substr(char* str, int64_t start, int64_t length) {
        return std::string(str).substr(start, length).c_str();
    }
}
```

假设源码文件名为 `functions.cpp`，使用 `g++` 编译上述代码生成共享库：

```shell
g++ -fPIC -shared -lstdc++ -o libfunctions.so functions.cpp
```

参数含义：

- `-fPIC`：生成地址无关代码，生成共享库时通常配合使用该参数，如果设置了该参数，宏`__pic__` 和 `__PIC__` 会被定义且值为 `2`
-  `-shared`：生成共享库，通常需要同时设置 `-fPIC`
- `-lstdc++`：链接 C++ 标准库
- `-o`：指定输出文件，这里为 `libfunctions.so`

`extern "C"` 告诉编译器在编译时 `{}` 中的函数名字需要与 C 兼容，详见 [What is the effect of extern "C" in C++? - Stack Overflow](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)。

## Python 中使用共享库

Python 中导入 `ctypes` 指定共享库（`.so` 文件）加载后声明函数的参数列表和返回值类型（基础类型可声明返回值类型）即可调用共享库中的函数。

### 简单函数

以调用 `Add` 函数为例：

```python
import ctypes

functions = ctypes.CDLL("./libfunctions.so")

functions.Add.argtypes = [ctypes.c_int64, ctypes.c_int64]
print(functions.Add(1, 2))
```

其中 `argtypes` 声明了 `Add` 函数的参数列表：两个 `int64` 参数，执行 Python 文件就可以得到结果 `3`。

调用 `Mul` 函数也是类似的：

```python
functions.Mul.argtypes = [ctypes.c_int64, ctypes.c_int64]
print(functions.Mul(233, 2))
```

可以得到结果 `466`。

### 非基础类型参数

`Substr` 的第一个参数是字符指针（`char*`）因此第一个参数应该使用 `c_char_p`，同时返回值也是字符指针而不是基础类型因此需要声明返回值类型：

```python
functions.Substr.argtypes = [ctypes.c_char_p, ctypes.c_int64, ctypes.c_int64]
functions.Substr.restype = ctypes.c_char_p

print(functions.Substr(ctypes.c_char_p("Hello World".encode()), 2, 5).decode())
```

构造 `c_char_p` 时可以使用 `bytes` 或者 `int`（指针），这里直接将字符串编码传入，执行得到结果 `llo W`。

### 使用结构体

在 Python 中定义结构体后可以将结构体作为参数传递给共享库中的函数：

```python
class Point(ctypes.Structure):
    _fields_ = [("x", ctypes.c_int32), ("y", ctypes.c_int32)]
```

定义 `Point` 结构体，有两个名为 `x` 和 `y`，类型是 `int32` 的参数，然后声明 `PointAdd` 函数：

```python
PointAdd = functions.PointAdd
PointAdd.argtypes = [ctypes.POINTER(Point), ctypes.POINTER(Point)]
PointAdd.restype = Point
```

构造两个 `Point` 结构体调用 `PointAdd` 函数：

```python
p_a = Point(1, 2)
p_b = Point(3, 4)

p_result = PointAdd(p_a, p_b)

print(p_result.x, p_result.y)
```

执行得到结果 `4 6`。

## 使用 CMake

假设目录结构如下 ：

```plain
.
├── CMakeLists.txt
├── include
│   └── point.h
└── src
    └── functions.cpp
```

`include` 存放项目头文件，`src` 存放源文件，`point.h` 中是 `Point` 结构体定义：

```cpp
#include <cstdint>

extern "C" {
    typedef struct Point {
        int32_t x;
        int32_t y;
    } Point;
}
```

`functions.cpp` 除移动到 `point.h` 中内的容外不变，最小化 `CMakeLists.txt` 文件：

```cmake
cmake_minimum_required(VERSION 2.8.9)
project (Functions)
set(CMAKE_CXX_STANDARD 11)

include_directories(./include)
aux_source_directory(./src DIR_SRCS)

add_library(Functions SHARED ${DIR_SRCS})
```

编译后修改 Python 中的 `functions = ctypes.CDLL("./libfunctions.so")` 路径为新的 `.so` 路径即可使用。

[^1]: [https://docs.python.org/zh-cn/3/library/ctypes.html](https://docs.python.org/zh-cn/3/library/ctypes.html) "ctypes --- Python 的外部函数库 — Python 3.10.4 文档"
