---
title: 微星主板 boot 灯常亮
typora-root-url: ../../source/
date: 2021-07-03 15:19:00
tags:
  - 电脑
  - 装机
  - 启动
categories:
  - 装机
---

周五，本应该是一个美好的时间，但如果按下电脑开机键屏幕却没有点亮将会感受到整个世界的恶意。

<!--more-->

## 背景

周五下班回家后开电脑发现屏幕一直没有反应，拔插 DP 线也没有效果，并且发现主板的 boot 灯一直亮着，说明在启动中但是没有成功。开关几次电源还是没有效果后开始慌了。

## 尝试解决

### 拔插显卡

显卡是刚买的 RX 6900 XT，在默默祈祷中拆下面板把显卡取下来再插回去，但是通电后依然没有效果，显示器依旧提示没有信号输入。

### 更换显卡

查阅资料后没有获得有效信息，但想起来之前用的亮机卡（750 Ti）还在，就换上了试试。

换上 750 Ti 显示器有信号了，提示内存超频失败（内存是芝奇皇家戟 8Gx4，自动超频到 3600），这下问题找到了，进入 BIOS 禁用 XMP，然后重启，成功进入系统。

此后多次尝试重启系统均成功，然后将显卡换回 RX 6900 XT 也成功启动。

## 总结

原因未知，但是旧显卡留着还是有用的。

