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

在 Mac 上同时打开几个浏览器窗口，或者用 VS Code 处理多个项目时，Command-Tab 只能先切到应用，接着还要找到具体的窗口。

我开发了一个按窗口切换的小工具 [TabFlow](https://apps.dreace.top/zh/tabflow/)，同一个应用的多个窗口会分别列出来，可以直接选中目标。

TabFlow 可以免费下载和使用，源码在 [GitHub](https://github.com/Dreace/TabFlow) 上公开，采用 [GPL-3.0 许可证](https://github.com/Dreace/TabFlow/blob/main/LICENSE)，也支持自行修改和构建。

<!-- more -->

![TabFlow 窗口切换器，可通过缩略图、窗口标题和应用名称选择窗口](/images/TabFlow/01-switcher.jpg)

## 按窗口切换

默认快捷键是 `⌥ Tab`（Option-Tab）。按住 Option，再按 Tab 打开切换器，继续按 Tab 选择窗口，松开 Option 就会切过去。Shift-Tab 返回上一项，Esc 取消。快捷键可以自定义。

比如开着两个 VS Code 项目窗口，可以根据标题或缩略图直接选择。TabFlow 也支持多显示器、macOS 桌面空间，以及恢复最小化窗口。窗口较多时，可以用搜索筛选目标。

它切换的是 macOS 窗口，浏览器标签页不会单独列出，也不负责窗口平铺或调整大小。

## 选择适合自己的布局

TabFlow 有自动、横向、网格和列表布局。喜欢预览内容可以打开缩略图，习惯看文字可以使用列表。

![TabFlow 列表布局，按行展示窗口标题和应用名称](/images/TabFlow/02-list.jpg)

卡片大小、标题和应用名称的显示，以及切换器位置，都可以调整。窗口范围、排序和分组也支持自定义。

![TabFlow 外观设置，可以调整布局、卡片大小和显示内容](/images/TabFlow/03-settings.jpg)

## 安装与权限

TabFlow 支持 macOS 14.0 及以上版本，兼容 Intel 和 Apple Silicon Mac。从 [GitHub Releases](https://github.com/Dreace/TabFlow/releases/latest) 下载 DMG，把 TabFlow 拖入“应用程序”，首次启动时按照提示授予权限。

| 权限 | 是否必需 | 用途 |
| --- | --- | --- |
| 辅助功能 | 必需 | 读取窗口信息并切换窗口 |
| 输入监控 | 必需 | 响应全局快捷键 |
| 屏幕录制 | 可选 | 显示窗口缩略图 |

没有屏幕录制权限时，仍然可以通过应用图标和窗口标题进行切换。TabFlow 平时常驻菜单栏，也可以设置为登录时启动。

## 数据留在本机

窗口信息和缩略图都在本机处理。可选的使用统计会记录完成切换的应用和本地时间，用来查看切换次数、常用应用和活动趋势，支持导出 CSV 或清除记录，数据不会上传。

## 下载与源码

- [免费下载 TabFlow](https://github.com/Dreace/TabFlow/releases/latest)
- [查看源码与构建说明](https://github.com/Dreace/TabFlow)
- [产品介绍](https://apps.dreace.top/zh/tabflow/)
- [应用主页](https://apps.dreace.top/)
- [提交问题或建议](https://github.com/Dreace/TabFlow/issues)
