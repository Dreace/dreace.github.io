---
title: Windows 下将“使用 VS Code 打开”注册到右键菜单
cover: /images/Set-VS-Code-As-The-Default-Editor/image-20191118171606890.png
typora-root-url: ../../source/
date: 2019-11-18 16:49:18
tags:
  - Windows
  - VS Code
---

## 写在前面

在 Windows 下安装 [VS Code]( https://code.visualstudio.com/ ) 时会询问是否注册为受支持类型编辑器，这样右击文件就可以使用 VS Code 编辑文件。如果安装时没有选择可以通过修改注册表达到这种效果。

<!-- more -->

## 正文

首先新建一个 `code.txt` 文件然后修改后缀为 `.reg`，键入如下内容。

```shell
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\*\shell\VSCode]
@="使用 VS Code 打开"
"Icon"="C:\\Users\\Dreace\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"

[HKEY_CLASSES_ROOT\*\shell\VSCode\command]
@="\"C:\\Users\\Dreace\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe\" \"%1\""

Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\shell\VSCode]
@="使用 VS Code 打开"
"Icon"="C:\\Users\\Dreace\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"

[HKEY_CLASSES_ROOT\Directory\shell\VSCode\command]
@="\"C:\\Users\\Dreace\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe\" \"%V\""

Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\VSCode]
@="使用 VS Code 打开"
"Icon"="C:\\Users\\Dreace\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"

[HKEY_CLASSES_ROOT\Directory\Background\shell\VSCode\command]
@="\"C:\\Users\\Dreace\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe\" \"%V\""
```

注意将里面的路径设置为自己的 VS Code 安装路径，**路径分割要使用 `\\` 或者 `/`**。

保存之后双击执行可以为**所有的**文件、目录、目录背景右击菜单添加 `使用 VS Code 打开` 选项。

![添加之后右击文件](/images/Set-VS-Code-As-The-Default-Editor/image-20191118171606890.png)

文件分为三段，内容基本相同，这里拿第一段作为例子介绍一下。

`[HKEY_CLASSES_ROOT\*\shell\VSCode]` 表示的是文件右击菜单中的名称及图标，可以自行修改。

`[HKEY_CLASSES_ROOT\*\shell\VSCode\command]` 表示的是要打开的程序及参数。