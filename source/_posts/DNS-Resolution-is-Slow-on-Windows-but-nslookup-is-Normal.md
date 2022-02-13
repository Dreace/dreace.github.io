---
title: 'Windows 上 DNS 解析慢，但 nslookup 正常'
typora-root-url: ../../source/
date: 2020-04-15 17:54:12
tags:
  - DNS
  - Windows
categories:
  - Windows
---

今天一大早开始在电脑上所有的网站打开变得极慢，通过 SSH 连接服务器也非常慢，但 IP 直连速度又是正常的。初步猜测是 DNS 问题。

<!--more-->

## 定位问题

随后用 ping 测试发现需要好几秒钟才能解析出 IP，而用 nslookup 测试解析速度又是正常的。这下子基本知道问题了，又是系统 DNS 服务的锅，为什么是**又**呢？因为之前系统 DNS 服务把一些域名解析到了教育网，导致一些网站 CSS 加载失败，加了 hosts 之后才勉强正常。前一次的问题影响不是很大，可这次就不一样了，所有的网站打开都要等几秒钟，这可忍不了。

这里说一下为什么通过 ping 和 nslookup 就能断定系统 DNS 服务有问题呢，因为 ping 在解析域名时用的时系统 DNS 服务，而 nslookup 是直接通过 [Winsock](https://zh.wikipedia.org/wiki/Winsock) 建立连接查询的[^1]。

用 [Wireshark](https://www.wireshark.org/) 抓包发现使用 ping 时 DNS 查询报文也是很快响应了的，但是 ping 客户端似乎没有收到。到这里就陷入死胡同了，我对 Windows 内部的细节不了解，不能再往下定位问题。

## 解决问题

由于上午事情比较多就暂时把这个问题放下了。

到了下午突然想起会不会又是 [VMware](https://www.vmware.com/) 虚拟网卡的问题，这里又是一个**又**😫，因为之前遇到过虚拟网卡导致移动热点 IP 冲突问题。尝试禁用以 `VMware Virtual Ethernet Adapter ` 开头的网卡，再次测试，ping 和打开网页都已正常。

## 后记

这次虽然解决了问题，但是具体原因还不清楚，日后搞清楚问题再更新这篇文章

[^1]: [https://superuser.com/questions/495759/why-is-ping-unable-to-resolve-a-name-when-nslookup-works-fine](https://superuser.com/questions/495759/why-is-ping-unable-to-resolve-a-name-when-nslookup-works-fine) "Why is 'ping' unable to resolve a name when 'nslookup' works fine?"