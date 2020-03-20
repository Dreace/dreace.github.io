---
title: MySQL 多关键词匹配
typora-root-url: ../../source/
date: 2020-03-20 16:47:09
tags:  
  - MySQL
  - 数据库
  - SQL
  - 正则表达式
categories:
  - MySQL
---

## 写在前面

在 MySQL 中像搜索引擎一样查找多个关键词只使用 `LIKE` 实现比较困难，如果硬写也可以拼接很长的 SQL 实现，但有点太暴力了。因此需要一个简洁的方法来实现这个需求，这就是这篇文章要探讨的问题。

<!--more-->

## 分析

使用搜索引擎可以搜索使用空格分割的多个关键词，例如 `Python MySQL 回滚` 能够搜索到同时包含这个三个关键词的结果，并且是顺序无关的。要是用 `LIKE` 来进行模糊匹配就要拼接一个又臭又长的 SQL，这个可能并不是我们想要的，除了 `LIKE` 还有什么好的办法呢。正则表达式！用正则表达式可以很容易实现这个需求。

既然有了办法开始写代码，首先考虑如何根据搜索输入 `Python MySQL 回滚` 匹配下面的字符串：

```Python
Python 中回滚 MySQL 操作。
```

这个字符串中关键词输入顺序和输入的关键词顺序不同，但是顺序对结果不会产生影响。为了同时匹配多个关键词可以先拆分为多个独立的关键词分开匹配，若前一个成功则继续匹配知道所有关键词都成功匹配。

我们可以使用正则中的零宽先行断言（`(?=exp)`）[^1]，它可以匹配以 `exp` 为后缀的字符串，之后的匹配将从 `exp` 前一个位置继续。

如果写成 `(?=.*exp)`，它将从后向前匹配以 `exp` 为后缀的字符串，若匹配式中包含多个零宽先行断言每一次匹配都从最后开始。

这样关键问题已解决，对于 `Python MySQL 回滚` 完整的表达式为：

```python
(?=.*Python)(?=.*MySQL)(?=.*回滚)
```

上面这个正则表达式可以判断一个字符串是否包含这三个关键词，若要提取成功匹配的字符串可以写成：

```python
(?=.*Python)(?=.*MySQL)(?=.*回滚)^.*$
```

## 代码实现

下面写一个用正则在 MySQL 中进行多关键词查找的实例。

假设有一张表，结构如下：

```
CREATE TABLE `课程-2020-1`  (
  `教学班编号` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `学院` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `课程名` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `教师` varchar(25) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `周次` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `星期` int(11) NOT NULL,
  `开始节次` int(11) NULL DEFAULT NULL,
  `时长节次` int(11) NULL DEFAULT NULL,
  `教学楼` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `教室` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  PRIMARY KEY (`教学班编号`, `课程名`, `星期`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;
```

我们希望能够同时匹配 `学院`、 `课程名`、`教师`三个字段中的值，例如输入 `工程 数据`，能够同时查找出「大数据学院」的「物联网工程技术基础」 和「信息与通信工程学院」的「大数据与云计算」课程，对应的 SQL 如下：

```
SELECT * FROM `课程-2020-1` WHERE CONCAT_WS('', `学院`, `课程名`, `教师`) REGEXP '(?=.*工程)(?=.*数据)'
```

其中 ``CONCAT_WS('', `学院`, `课程名`, `教师`)`` 将每行中 `学院`、 `课程名`、`教师` 字段的值连接形成一个字符串，第一个参数作为剩余参数间的分隔符[^2]，`CONCAT_WS` 的作用类似 Python 和 JavaScript 中的 `join`。这里不使用 `CONCAT` 是因为 `教师` 字段可能为空值，进而导致 `CONCAT` 的返回结果也为空， 而 `CONCAT_WS` 会忽略空值。

搜索结果为：

![关键词"工程 数据"的搜索结果](/images/MySQL-Multiple-Keyword-Matching/image-20200320183837050.png)

完美实现！下面是输入关键词字符串生成对应 SQL 的 Python 代码：

```
keywords_map = "".join(map(lambda k: "(?=.*%s)" % k, keywords.split(" ")))
sql = "SELECT * FROM `课程-2020-1` WHERE CONCAT_WS('', `学院`, `课程名`, `教师`) REGEXP '%s^.*$'" % keywords_map
```



[^1]: [https://www.cnblogs.com/symbol441/articles/957950.html](https://www.cnblogs.com/symbol441/articles/957950.html) "正则表达式的分组"
[^2]: [https://www.cnblogs.com/locoy/archive/2006/10/28/542751.html](https://www.cnblogs.com/locoy/archive/2006/10/28/542751.html) "CONCAT_WS的用法"