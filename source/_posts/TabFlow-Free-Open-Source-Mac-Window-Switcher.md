---
title: TabFlow：免费开源的 Mac 窗口切换工具
date: 2026-10-07 00:00:00
cover: /images/TabFlow/01-switcher.jpg
description: TabFlow 是免费、开源的 macOS 窗口切换工具，支持同一应用的多个窗口、窗口缩略图、多显示器和桌面空间。介绍使用方式、安装步骤和权限设置。
typora-root-url: ../../source/
tags:
  - macOS
  - 开源
  - TabFlow
categories:
  - 软件
---

在 Mac 上同时开着几个浏览器窗口，或用 VS Code 处理多个项目，按 Command-Tab 切到应用后，还得再找一次窗口。

用 [TabFlow](https://apps.dreace.top/zh/tabflow/) 可以直接按窗口切换。同一应用的多个窗口分开列出，看着标题或缩略图就能选。

免费下载、使用，也可以到 [GitHub](https://github.com/Dreace/TabFlow) 查看源码，按 [GPL-3.0 许可证](https://github.com/Dreace/TabFlow/blob/main/LICENSE) 自行修改和构建。

获取方式：[从 GitHub Releases 免费下载 TabFlow 安装包](https://github.com/Dreace/TabFlow/releases/latest)。

<!-- more -->

![TabFlow 窗口切换器，可通过缩略图、窗口标题和应用名称选择窗口](/images/TabFlow/01-switcher.jpg)

## 按窗口切换

默认使用 `⌥ Tab`（Option-Tab）：按住 Option，再按 Tab 打开切换器。继续按 Tab 选择窗口，松开 Option 切过去；按 Shift-Tab 返回上一项，按 Esc 取消。也可以在设置里更换快捷键。

比如同时开着两个 VS Code 项目，直接按项目标题或预览内容选择，不用先切到 VS Code 再找窗口。也能在多显示器和 macOS 桌面空间之间切换，或恢复最小化的窗口。开得太多时，输入关键词搜索。

仅用于切换 macOS 窗口，不单独列出浏览器标签页，也不提供窗口平铺和大小调整。

## 布局与外观

可以选择自动、横向、网格或列表布局。想看窗口内容就打开缩略图，只看标题和应用名称就用列表。

![TabFlow 列表布局，按行展示窗口标题和应用名称](/images/TabFlow/02-list.jpg)

在设置里调整卡片大小、切换器位置，选择是否显示标题和应用名称，也能设置窗口范围、排序和分组。

![TabFlow 外观设置，可以调整布局、卡片大小和显示内容](/images/TabFlow/03-settings.jpg)

## 安装与权限

需要 macOS 14.0 及以上版本，可在 Intel 和 Apple Silicon Mac 上使用。从 [GitHub Releases](https://github.com/Dreace/TabFlow/releases/latest) 下载 DMG，把 TabFlow 拖入“应用程序”，首次打开时按提示授予权限。

| 权限 | 是否必需 | 用途 |
| --- | --- | --- |
| 辅助功能 | 必需 | 读取窗口信息并切换窗口 |
| 输入监控 | 必需 | 响应全局快捷键 |
| 屏幕录制 | 可选 | 显示窗口缩略图 |

不授予屏幕录制权限也能使用，通过应用图标和窗口标题选择即可。平时从菜单栏打开设置，也可以开启登录时启动。

## 数据留在本机

在本机处理窗口信息和缩略图，不上传数据。按需开启使用统计后，会记录切换到的应用和本地时间，可以查看切换次数、常用应用和活动趋势，也能导出 CSV 或清除记录。

## 下载与源码

- [免费下载 TabFlow](https://github.com/Dreace/TabFlow/releases/latest)
- [查看源码与构建说明](https://github.com/Dreace/TabFlow)
- [产品介绍](https://apps.dreace.top/zh/tabflow/)
- [应用主页](https://apps.dreace.top/)
- [提交问题或建议](https://github.com/Dreace/TabFlow/issues)
