---
title: 解决 Clion 无法识别 WSL Ubuntu 20.04 LTS
typora-root-url: ../../source/
date: 2020-05-10 21:23:16
tags:
  - Clion
  - Ubuntu
  - WSL
categories:
  - Linux
---

**注：本文提到的 WSL 均为 WSL 1。**

最近在学网络编程，需要在 Linux 下编译 C 源码，可我日常使用 Windows，在虚拟机里操作又不是很方便。于是 Clion + WSL 成了几乎完美的解决方案，在 Windows 下编码，Linux 环境下编译运行。

但是由于一个意外需要卸载已安装的 WSL（Ubuntu 18.04 LTS），凑巧巨硬最近发布了 Ubuntu 20.04 LTS 的 WSL，于是尝试了一下。尴尬的是最新版本的 Clion 还不能识别 20.04，但问题不大。

<!--more-->

## 修改配置文件

原本 Clion 应能识别已安装的 WSL，但 20.04 的设置还未添加，故不能识别。解决办法很简答，手动添加即可。打开 `C:\Users\<用户名>\AppData\Roaming\JetBrains\CLion<版本号>\options\wsl.distributions.xml`，在 `set` 下添加[^1]：

```xml
<descriptor>
    <id>UBUNTU2004</id>
    <microsoft-id>Ubuntu-20.04</microsoft-id>
    <executable-path>ubuntu2004.exe</executable-path>
    <presentable-name>Ubuntu 20.04</presentable-name>
</descriptor>
```

保存，重启 Clion 即可。

## 再解决一个问题

在升级 20.04 的包时遇到 `sleep: cannot read realtime clock: Invalid argument` 错误，应该是一个 WSL 的 bug，据说已经在 Windows 2004 修复，但是 2004 要还没正式发布。目前的解决办法是降级导致问题的 `libc6` 包[^2]：

```bash
wget "https://launchpad.net/~rafaeldtinoco/+archive/ubuntu/lp1871129/+build/19152555/+files/libc6_2.31-0ubuntu8+lp1871129~1_amd64.deb"
sudo dpkg -i libc6_2.31-0ubuntu8+lp1871129~1_amd64.deb
```

在升级前将其版本冻结：

```bash
apt-mark hold libc6
```

这样该问题可以解决。但是降级会导致 gcc、cmake 等一大票编译工具**无法**正常安装。

## 最后

还是回到了 Ubuntu 18.04 LTS。

[^1]: [https://intellij-support.jetbrains.com/hc/en-us/community/posts/360004135320-CLion-not-picking-up-WSL](https://intellij-support.jetbrains.com/hc/en-us/community/posts/360004135320-CLion-not-picking-up-WSL) "CLion not picking up WSL – IDEs Support (IntelliJ Platform) | JetBrains"
[^2]: [https://github.com/microsoft/WSL/issues/4898](https://github.com/microsoft/WSL/issues/4898) "[WSL1] [glibc] sleep: cannot read realtime clock: Invalid argument"