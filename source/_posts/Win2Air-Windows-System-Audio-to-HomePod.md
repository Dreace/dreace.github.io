---
title: Win2Air：把 Windows 系统声音投送到 HomePod
date: 2026-10-25 00:00:00
cover: /images/Win2Air/playback.png
description: Win2Air 是免费、开源的 Windows AirPlay 音频工具，可以将系统声音投送到 HomePod、Mac 等兼容设备。介绍连接 HomePod、选择声音来源和安装步骤。
typora-root-url: ../../source/
tags:
  - Windows
  - AirPlay
  - HomePod
  - Win2Air
categories:
  - 软件
---

用免费、开源的 [Win2Air](https://apps.microsoft.com/detail/9NW4QNG96D6T) 连接 HomePod，就能把 Windows 正在播放的声音传过去。听歌、看视频，继续用原来的播放器或浏览器就行。

除了 HomePod，也能连接开启了 AirPlay 接收功能的 Mac，以及其他兼容 AirPlay 的音频设备。

获取方式：[从 Microsoft Store 安装 Win2Air](https://apps.microsoft.com/detail/9NW4QNG96D6T)。

<!-- more -->

![Win2Air 播放页面，展示接收设备、连接状态和音量控制](/images/Win2Air/playback.png)

## 连接 HomePod

先把电脑和接收设备连到同一局域网，打开“播放”页面，等待自动发现设备。选中 HomePod，点击“连接”，即可开始投送系统声音。遇到验证码提示，照着接收端显示的内容输入即可。

连接后可以调整接收端音量、静音或断开连接。自动发现不到时，点击“添加设备”，手动填写地址。

目前一次只能连接一台接收设备，仅投送声音。看视频时，画面仍留在电脑上。

## 关闭窗口后也能操作

连接后可以关闭主窗口，在后台继续播放。从系统托盘打开快捷面板，就能调音量、静音、断开或切换设备，也能重新打开主窗口。

## 选择声音来源

默认采集系统当前的音频输出，也可以在设置里指定其他输出设备。选好后，继续用原来的应用播放声音即可。

只想让接收端发声，可以开启投送期间关闭本机播放的选项。断开后自动恢复本机播放。

可切换简体中文和英文，选择浅色、深色主题，或跟随系统外观。

![Win2Air 设置页面，可调整音频采集、串流和接收设备管理选项](/images/Win2Air/settings.png)

## 查看投送状态

遇到声音卡顿，可以到“统计”页面查看码率、延迟和网络状态，观察连接变化。

![Win2Air 统计页面，展示音频投送的状态和变化趋势](/images/Win2Air/statistics.png)

## 安装与连接

需要 x64 架构的 Windows 10 22H2（内部版本 19045）及以上版本，或 Windows 11。

1. 从 [Microsoft Store](https://apps.microsoft.com/detail/9NW4QNG96D6T) 安装 Win2Air。
2. 将电脑与 HomePod 或其他 AirPlay 音频接收设备连接到同一局域网。如果使用 Mac 接收声音，需要先开启 Mac 的 AirPlay 接收功能。
3. 打开 Win2Air，在“播放”页面选择接收设备，点击“连接”。
4. 如果接收端要求验证码，输入验证码完成连接，然后在电脑上播放声音。

## 下载

- [从 Microsoft Store 安装 Win2Air](https://apps.microsoft.com/detail/9NW4QNG96D6T)
- [查看源码与 GPL-3.0-or-later 许可证](https://github.com/Dreace/Win2Air)
- [Win2Air 产品介绍](https://apps.dreace.top/zh/win2air/)
