---
title: Python 从 Zero 到 Hero
date: 2019-11-01 17:12:15
tags:  
  - Python
  - 编程
  - 入门
---



#### 0x00 写在前面

本文旨在快速介绍 Python 的特性帮助读者能够在短时间内了解如何使用 Python， 因此不会有很复杂的内容或者原理性剖析。本文会涉及 Python 基本的语法、操作和简单的面向对象内容，可能会与 C++，Java 中相应内容对比。不过也不用担心，只需要有一些 C 语言编程基础就可以开始阅读本文。**后文给出的所有代码需要在 Python 3 下才能运行。**

<!--more-->

本文只能介绍 Python 基础及一些常用操作，其他进阶内容需要读者自己取探索或查询相关资料。

当然，在开始阅读之前得先安装 Python 环境，可以看这里 :warning:**这里插入一个链接🔗。:warning:**

#### 0x01 输入与输出

Python 中输入与输出非常简单，第一个例子是经典的 `Hello, world`。

```python
print("Hello, world")
```

在 IDE 或 Shell 中运行这段代码你将看到：

```html
Hello, world
```

接下来是输入，将你的输入原样输出。Python 3 默认使用 UTF-8 编码，因此可以在代码中直接使用中文。

```python
print(input("输入:"))
```

```
输入：你好
你好	
```

#### 0x02 变量与数据类型

Python 中使用变量时不需要手动指定类型，由系统（解释器）自动推导类型。

```python
a = 1
b = 2.0
c = True
d = "345"
```

上边的代码分别定义了一个整型（int）,浮点型（float），布尔型（bool）,字符串（str）变量并使用 `print()` 将其输出。

```txt
1
2.0
True
345
```

Python 提供了与其他编程语言相似的运算符操作：

```python
print(1 + 2)
print(2 - 3)
print(2 * 5)
print(2 / 3)  # 结果为浮点数
print(10 // 3)  # 结果为整数，小数点后截断
print(10 % 3)

a = 2 / 7
print(a)

print()

b = float(input())
print(b / 2)
```

Python 3 中 `input` 得到的结果是字符串，因此需要先转化为数字（这里是转换成浮点数）再计算。

```txt
3
-1
10
0.6666666666666666
3
1
0.2857142857142857

5
2.5
```

#### 0x03 注释

注释是编码中非常重要的部分，Python 使用 `#` 开始单行注释，使用 `'''` 或 `"""` 包裹多行注释。

```python
# 这是单行注释

print("Hello, world")

'''
这是多行
注释
！
'''
```

#### 0x04 常用数据结构

##### 列表（List）

列表是 Python 中最常用的数据结构，与数组类似列表的下标从 0 开始，且列表中元素的个数是可变的，下面的代码演示了列表的一些常用操作。

```python
the_list = ["I", "love", "Python", 233, ["list"]]
print(the_list[2])  # 取小标为 2 的元素
the_list[2] = "Python!"
print(the_list[2])
print("-----")

print(the_list[1:3])  # 截取下标 1 到下标为 3 的元素（不包含下标 3）
print("-----")

print(the_list[2:])  # 截取下标 2 以后的所有元素
print("-----")

for i in the_list:
    print(i)
print("-----")

del the_list[3] # 删除下标为 3 的元素
for i in the_list:
    print(i)
print("-----")

print(len(the_list))
```

列表中元素可以是任意类型，甚至列表中国元素类型可以不相同，上例中的 `the_list` 包含了字符串、数字和另一个列表。Python 中使用方括号 `[]` 配合下标的形式访问访问和修改元素。第 7 行代码展示了对列表的切片操作， `[a:b]` 表示截取下标从 `a` 到 `b` 的所有元素，若省略一个参数则表示到列表开头或末尾的最大范围，例如 `[:5]` 表示截取下标从 0 到 4 的所有元素，这个操作称之为**切片（Slice）**。需要注意的是这个范围是 $\left[a,b\right)$ 即不包含下标为 `b` 的元素 。**切片可以使用负值下标，表示从最右侧开始计数，最右侧第一个下标为 -1。**

第 13、 14 行展示了 Python 的 `for` 循环，这和 C/C++ 中的 `for` 不太一样，在这里使用 `for` 直接对列表进行迭代，依次取出其中的每个值，而不需要使用下标遍历访问。这样的操作同样适用于字符串。

再之后使用 `del` 删除了列表中下标为 3 的元素，并再次迭代输出。

你应该已经注意到了在 `for` 循环之内的 `print` 前面有四个空格，这是 Python 最有特色的地方**「强制缩进」**，Python 要求不同层次的语句块之间必须有缩进。仔细观察可以发现 `for` 语句所在行最后一个字符都是冒号（`:`），表示之后有缩进的语句包含在 `for` 语句内部，直到出现与之同级缩进的语句。

`len` 可以获取列表的长度，这里已经删除了一个元素所以长度为 4。

```txt
Python
Python!
-----
['love', 'Python!']
-----
['Python!', 233, ['list']]
-----
I
love
Python!
233
['list']
-----
I
love
Python!
['list']
-----
4
```

##### 元组（Tuple）

元组与数组相似，可以使用下标访问、切片操作、迭代元素。但是，元组**不可修改**。如尝试修改元组将抛出 `TypeError: 'tuple' object does not support item assignment` 错误。

```python
the_tuple = ("I", "love", "Python", 233, ["list"])
print(the_tuple[2])  # 取小标为 2 的元素
print("-----")

print(the_tuple[1:3])  # 截取下标 1 到下标为 3 的元素（不包含下标 3）
print("-----")

print(the_tuple[2:])  # 截取下标 2 以后的所有元素
print("-----")

for i in the_tuple:
    print(i)
print("-----")

print(len(the_tuple))
```

因为元组不可修改的特性，它常被用来作函数的返回值，以防返回值被意外修改。

```
Python
-----
('love', 'Python')
-----
('Python', 233, ['list'])
-----
I
love
Python
233
['list']
-----
5
```

##### 字典（Dict）

字典是一种键（key）值（value）对的映射，可以通过键确定唯一的值。

```python
the_dict = {"Alice": 18, "Bob": 19, "Tom": 21}
print(the_dict["Alice"])
the_dict["Alice"] = 20
print(the_dict["Alice"])
print("-----")

for k in the_dict:
    print(k, the_dict[k])
print("-----")
print("Peter" in the_dict.keys())
the_dict["Peter"] = 30
print("Peter" in the_dict.keys())
print(the_dict["Peter"])
```

可以直接使用键名来访问字典或修改字典，通过 `for` 像列表和元组一样迭代字典，不过迭代的是字典中的键。如果访问了不存在的键将抛出 `KeyError` 错误，因此在访问之前可以先使用 `key in the_dict.keys()` 来判断键 `key` 是否在字典 `the_dict` 的键集合中，若存在则为真（`True`）否则为假（`False`）。如果在键名还不存在时对这个键赋值，键名将会被自动创建。 

```
18
20
-----
Alice 20
Bob 19
Tom 21
-----
False
True
30
```

##### 集合（Set）

集合是一个元素无序且唯一的序列。

```python
the_set = {"apple", "orange", "apple", "pear", "orange", "banana"}
print(the_set)
for i in the_set:
    print(i)
print(len(the_set))
print("-----")

the_set.add("pear")
print(len(the_set))
print("-----")

the_set.add("grape")
for i in the_set:
    print(i)
print("-----")

the_set.remove("apple")
for i in the_set:
    print(i)
print("-----")

print("apple" in the_set)
```

可以使用 `{}` 或 `set()` 创建集合，但要创建空集合只能使用 `set()`，因为 `{}` 创建的是空字典。通过 `add()` 或 `remove()` 向集合中添加、删除元素，如果添加重复元素将被合并。前面已经提到过可以使用 `in` 判断一个值是否在集合中。

```
{'orange', 'banana', 'pear', 'apple'}
orange
banana
pear
apple
4
-----
4
-----
orange
grape
banana
pear
apple
-----
orange
grape
banana
pear
-----
False
```

#### 0x05 函数

定义并调用一个参数的函数：

```python
def fun(a):
    return a * 10


print(fun(10))
```

这个函数接受一个参数并将参数值乘以 10 返回。

```html
100
```

定义有多个参数并参数有默认值的函数：

```python
def fun(a, b=2):
    return a ** b


print(fun(5))
print(fun(5, 3))
```

这个函数中第二个参数 `b` 是可选的，若不提供则默认为 `2`，函数内外用到的 `**` 是 Python 中幂运算即 ${a^{b}}$。若调用时只提供一个参数则计算 ${\displaystyle a^{2}}$。

```
25
125
```

#### 0x06 流程控制

##### if 语句

```python
foo = 5
bar = 6
if foo == bar:
    print("foo equals bar")
elif foo > bar:
    print("foo is greater than bar")
else:
    print("foo less than bar")
```

若 `if` 后面的条件为真则执行其中的语句块，否则进行 `elif` 判断，若为真则执行其中语句，如果还是为假将执行 `else` 中语句。

```
foo less than bar
```

##### for 语句

前面已经简单介绍过 Python 中的 `for` 语句，和其他语言一样是一种循环语句。例如可是使用 `for in foo` 来遍历 `foo` 中的元素， `foo` 可以是列表、元组、字典、集合，甚至字符串。

```python
foo = "I love Python"
for i in foo:
    print(i)
```

```
I
 
l
o
v
e
 
P
y
t
h
o
n
```

若需要指定循环次数或者要通过下标遍历一个序列则要使用 `range()`。

```python
for i in range(5, 9):
    print(i)
print("-----")

for i in range(5):
    print(i)
print("-----")

for i in range(0, 10, 3):
    print(i)
```

当有有两个参数 `a`，`b` 则从 `a` 迭代到 `b`（不包含 `b`），这跟切片的限制是一样的。

只有一个参数时从 0 开始迭代。

若提供三个参数，第三个参数 `c` 表示步长即相邻两个元素的差值。

```
5
6
7
8
-----
0
1
2
3
4
-----
0
3
6
9
```

##### while 语句

当需要循环在某个条件为真时一直运行，直到这个条件不再满足则退出，便需要 `while` 循环了。

```python
res = 1
limit = 1
while limit <= 50:
    res *= limit
    limit += 1
print(res)
```

`limit` 初始值为 1，每轮循环会增加 1，`while` 内部的语句会一直循环执行，直到 `limit <= 50` 的条件不再满足即 `limit` 大于 50 时终止。`res *= limit` 是 `res = res + limit` 的简写形式，下一行的 `+=` 同理。你可能已经注意到了这段程序计算的是 $50!$ 的值，其结果远远大于 64 位有符号整数所能表示的最大值 ${2^{23}-1}$，但是在 Python 中可以直接计算，因为 Python 原生支持大数运算。

```
30414093201713378043612608166064768844377641568960512000000000000
```

##### 循环内部的控制

在 `for` 循环和 `while` 循环内部可以使用 `break` 来跳出循环，使用 `continue` 跳过本次循环但不终止循环。

```python
foo = 0
while foo < 10:
    if foo >= 5:
        break
    print(foo)
    foo += 1
print("-----")

bar = 0
while bar < 5:
    bar += 1
    if bar == 2:
        continue
    print(bar)
```

第一个循环中当 `foo >= 5` 时跳出循环，后面的值不会被打印。第二个循环当 `bar == 2` 时跳过本次循环，只有 2 不会被打印。

```
0
1
2
3
4
-----
1
3
4
5
```

#### 0x06 文件操作

文件操作在日常中出现频率非常高， Python 提供了非常方便的文件操作。

##### 写文件

首先打开一个文件并像其中写入一些数据。

```python
foo = open("foo.txt", "w")
foo.write("This is foo.txt")
foo.close()
```

运行这段代码后可以看到在脚本相同路径下出现了 `foo.txt` 文件，其中的内容是 `This is foo.txt`。

Python 中使用 `open()` 函数打开文件，第一个参数是文件路径，默认是相对路径，也就是说打开的是与脚本相同目录下的那个文件。第二个参数是打开文件的模式，这里的 `w` 表示要写文件，如果是 `r` 表示要读文件。还有其他的文件模式请读者自行了解，本文不再做介绍。

使用 `write()` 函数像文件中写入数据，使用完文件后一定要调用 `close()` 函数关闭文件。

##### 读文件

```python
with open("foo.txt","r") as file:
    foo = file.read()
    print(foo)
```

与写文件类似，但这里使用了 `with` 语句来保证无论什么情况下文件都会被关闭。通常文件操作都是使用 `with` 语句来进行的，这样不会忘记关闭文件，并且发生异常时文件也会被自动关闭。

```
This is foo.txt
```

执行上面的代码后文件内容会被打印出来。

#### 0x07 模块

Python 中可以可以使用 `import` 导入系统模块或其他外部模块。

```python
import sys
for i in sys.argv:
    print(i)
```

导入系统的 `sys` 模块并输出执行脚本时的参数，假设将上面的代码保存为 `foo.py`，并通过命令行执行

```bash
python foo.py bar1 bar2
```

可以看到打印出了脚本名及后面的两个参数。

```
foo.py
bar1
bar2
```

`import` 除了可以导入系统模块外，还能导入自定义模块。首先创建 `foo.py` 文件编写

```python
def func(a, b):
    return a ** b
```

在相同目录下创建 `bar.py` 编写

```python
import foo

if __name__ == '__main__':
    print(foo.func(10, 3))
```

`bar.py` 导入了 `foo.py` 的所有内容并调用了函数 `func()` 函数。`bar.py` 与之前的内容有所不同，多了一个  `__name__ == '__main__'`，作用是判断当前文件是否直接使用运行而不是被其他模块调用。`__name__` 是 Python 的内部变量，若值为 `__main__` 则是被直接运行，相当于其他语言中 `mian()` 作为程序入口的作用。

`import foo` 会导入 `foo.py` 中所有的函数、变量等，如要导入部分内容可以使用 `from foo import func` 只导入 `func()` 函数，若要导入多个内容需使用逗号（`,`）分隔。

#### 0x08 面向对象

在 Python 中进行面向对象编程也非常简单。如果你还不熟悉面向对象内容，先看这里🔗。

```python
class Person:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return "Hello, I'am %s" % self.name
```

首先建立一个名为 `Person` 的类，有两个方法。`__init__` 方法相当于其他语言中的构造函数，实例化对象时由系统调用。 Python 中使用 `self` 来访问内部成员，类似其他语言中的 `this` 指针，实例化之后指向对象本身。这个例子中 `__init__` 方法有两个参数，第一个是 `self`，这个参数不能手动指定，调用时由系统添加，第二个是 `name`，这个参数是需要在实例化时传入。构造函数被调用时将传入的 `name` 赋值给内部成员 `name`，这样在内部其他地方也能使用 `name` 的值。

`Person` 类还有一个方法 `greet`，实例化之后调用这个方法会返回一个包含名字的字符串。这里用到了字符串格式化，原本的字符串中的 `%s` 会被替换成 `self.name` 的值。可以使用多个值进行字符串格式化，例如 `"%s + %s = %s" % (1, 2, 1 + 2)` 得到的字符串时 `1 + 2 = 3`。

```python
if __name__ == '__main__':
    alice = Person("Alice")
    print(alice.greet())
```

实例化一个对象并调用 `greet()` 方法。

```txt
Hello, I'am Alice
```

面向对象中少不了类的继承。

```python
class Student(Person):
    def __init__(self, name, grade):
        super().__init__(name)
        self._grade = grade

    def get_grade(self):
        return self._grade
```

`class Student(Person)` 表明 `Student` 类继承自 `Person`，在 `__init__` 中新增了一个 `grade` 参数，并将它的值配给了内部变量 `_grade`。以下划线开头的变量和方法是内部方法，无法被外部访问 ，因此增加了 `get_grade` 方法来获取 `_grade` 的值。

千万别忘了在 `__init__` 中调用父类的构造方法。

```python
if __name__ == '__main__':
    bob = Student("Bob", 90)
    print(bob.greet())
    print(bob.get_grade())
```

和之前的使用方法相同，直接调用即可。

```txt
Hello, I'am Bob
90
```

#### 0x09 写在最后

这篇文章就到这里结束了。

如果你花了三十分钟读完本文，相信你已经对 Python 已经有了基本的了解，接下来可以去查阅官方文档了解更深入的内容，或者学习一些 Python 实际应用。