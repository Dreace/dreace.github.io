---
title: >-
  "解决“由于系统缓冲区空间不足或队列已满，不能执行套接字上的操作”"
cover: /images/Solve-An-operation-on-a-socket-could-not-be-performed-because-the-system-lacked-sufficient-buffer-space-or-because-a-queue-was-full/image-20200221193501904.png
typora-root-url: ../../source/
date: 2020-02-21 19:05:53
tags:
  - Windows
  - 注册表
categories:
  - Windows
---

## 写在前面

最近写了个小工具，需要往 MySQL 中快速写入数据（5000 条数据左右）。刚开始很正常，跑了几分钟后报了一个错误 `由于系统缓冲区空间不足或队列已满，不能执行套接字上的操作`，这个问题以前也遇到过，只是通过简单的重启解决。虽然这次也通过重启把系统恢复正常了，可数据还没写到数据库里呢，于是花了点事件把这个问题彻底解决。

<!-- more -->

## 问题分析

从报错的字面意思就能看出来系统的 Socket 资源耗尽无法建立新的链接。经查询得知 Windows 10 中默认允许用户使用的端口数是 1500，并且端口关闭后需要经过 60 秒才能重新被使用[^1]。查看数据库已写入的数据在 1600 条左右，和 1500 这个限制比较接近，由此问题被大致定位。

## 解决问题

既然已经知道问题的根本原因，解决方法也呼之欲出：修改限制。在“注册表编辑器中”找到 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters`。，修改 `MaxUserPort` 的值为 `65534`（十进制）或 `fffe`（十六进制）。同时也可以修改端口关闭后可重新使用的等待时间，在相同位置新建一个 `DWORD` 类型名称为 `TcpTimedWaitDelay` 的项目，其值表示等待多少秒后端口可以被重新使用。

完成之后重启。

再次运行问题，已经解决。

[^1]: [https://support.microsoft.com/en-us/help/196271/when-you-try-to-connect-from-tcp-ports-greater-than-5000-you-receive-t](https://support.microsoft.com/en-us/help/196271/when-you-try-to-connect-from-tcp-ports-greater-than-5000-you-receive-t) "When you try to connect from TCP ports greater than 5000 you receive the error 'WSAENOBUFS (10055)'"

