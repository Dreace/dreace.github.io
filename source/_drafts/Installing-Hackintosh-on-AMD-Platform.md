---
title: '在 AMD 平台安装黑苹果'
typora-root-url: ../../source/
date: 2021-10-17 13:45:48
tags:
  - 装机
  - 黑苹果
categories:
  - 瞎折腾
---

本文旨在记录在使用 [OpenCore](https://github.com/acidanthera/OpenCorePkg) 和来自 [Apple](https://www.apple.com/) 官方的镜像在 AMD 平台安装黑苹果（Hackintosh）过程与遇到的问题，最终和 Windows 组成双系统。本文主要流程参考自 [Dortania's OpenCore Install Guide](https://dortania.github.io/OpenCore-Install-Guide/)。本文的前期准备操作均在 Windows 10 下进行。

<!-- more -->

## 软硬件清单

### 硬件

|     部件     |                             型号                             |
| :----------: | :----------------------------------------------------------: |
|     CPU      |                      AMD Ryzen 7 5800X                       |
|     GPU      |                    AMD Radeon RX 6900 XT                     |
|     主板     |               微星 MPG B550 GAMING CARBON WIFI               |
|     内存     |         32GB (8GB x 4) 芝奇（G.SKILL）皇家戟 @3600Hz         |
|   以太网卡   |                       Realtek RTL8125B                       |
| Wi-Fi 和蓝牙 | ~~Intel AX200~~（蓝牙无法正常使用）<br />FV-HB1200（BCM94360CD） |
|     音频     |                       Realtek ALC1200                        |
|     硬盘     | macOS：西部数据 WDS500G2B0C<br />Windows：三星 980 PRO 500GB<br />机械硬盘：西部数据 WD10EZEX<br /> |

### 软件

|                             软件                             |     版本     |        说明        |
| :----------------------------------------------------------: | :----------: | :----------------: |
|                            macOS                             | Big Sur 11.6 |        系统        |
| [OpenCore](https://github.com/acidanthera/OpenCorePkg/releases) |    0.7.5     |   黑苹果引导工具   |
|                [Rufus](https://rufus.ie/zh/)                 |     3.17     | USB 启动盘创建工具 |

以上软件均为本文写作时最新版本。

## 制作启动 U 盘

### 获取系统镜像

### 制作启动盘

复制文件

### 添加 OpenCore 基础文件

### 添加必要文件

#### 固件驱动

#### Kexts

内核拓展

#### SSDTs

### 修改配置

#### ACPI

#### BIOS

## 启动安装

## 安装后配置

### 修改 MAC 地址

#### 已有 Apple ID

如果使用登录过白苹果设备（iPhone、iPad、Mac 等）的 Apple ID 登录大概率不需要修改 MAC 即可正常使用。

#### 新注册 Apple ID

**该方式未经验证。**

如果是新注册的 Apple ID 则需要修改 MAC 地址和序列号等来使用 Apple 提供的软件服务（iMessage 等）。

### 启用 HiDPI（可选）

### 可视化编辑配置文件（可选）

### 读写 NTFS 文件（可选）

### 启用鼠标侧键（可选）

## 与 Windows 组成双系统

## 可能遇到的问题

### 选择 OpenCore 启动项后自动重启

### 有线无音频输出

### 蓝牙无法使用

### Apple ID 无法登录

登录 Apple ID 时提示「无法联系服务器」（即使是日常使用登录过其他白苹果设备的 Apple ID），可能是使用的网卡未被 macOS 识别为内置导致，可以通过修改 `config.list` 文件中的设备属性（`DeviceProperties`）解决。

![使用 Hackintool 查看网卡应被正确识别为「内建」](/images/Installing-Hackintosh-on-AMD-Platform/image-20211030172235312.png)

使用 OpenCore Configurator 在左边先选择「DeviceProperties-设备属性设置」，点击下方的「PCI 设备列表」，如果是有线网络选择「Ethernet controller」，无线网络则选择「Network controller」。选中添加的条目点击右下角的加号（+）添加一条键为 `built-in` 值为 `01` 的条目，类型选择「 DATA 类型」。

![添加 PCI 设备](/images/Installing-Hackintosh-on-AMD-Platform/image-20211030174516860.png)

![选择网络](/images/Installing-Hackintosh-on-AMD-Platform/image-20211030174701936.png)

![添加条目](/images/Installing-Hackintosh-on-AMD-Platform/image-20211030175004428.png)

保存后重启即可在「设置」中登录 Apple ID。

### App Store 无法登录


[^1]:[https://hexo.io/zh-cn/docs/migration](https://hexo.io/zh-cn/docs/migration) "迁移 | Hexo" 

