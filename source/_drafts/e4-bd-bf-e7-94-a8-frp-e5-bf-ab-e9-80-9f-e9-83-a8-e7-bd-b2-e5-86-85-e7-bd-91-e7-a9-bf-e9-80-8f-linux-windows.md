---
title: 使用 frp 快速部署内网穿透 (Linux + Windows)
tags:
  - 代理
  - 内网穿透
  - 校园网
  - 网络
typora-root-url: ../../source/
url: 316.html
id: 316
categories:
  - 网络
date: 2018-09-26 20:07:37
---

不久前写了个小项目：在服务器上抓取教务系统成绩，本来运行平稳没什么大问题直到不久前学校关闭教务系统的外网权限，所有的非校园网数据无法链接教务系统，一直没有找到解决办法只能等待学校恢复权限。 今天偶然想起可以做内网穿透把在校园网内的一台电脑作为代理服务器让外网服务器连进来不就好了吗。想到办法说干就干，登陆花生壳发现内网穿透服务收费有点犹豫，最后放弃收费方案（吐槽一下，刚登陆就有花生壳客服给我打电话😒） 之后我发现一个开源项目可以快速的部署内网穿透，当然就是下面要介绍的 frp 。 \[title\]什么是 frp?\[/title\] frp 是一个可用于内网穿透的高性能的反向代理应用，支持 tcp, udp, http, https 协议。 ![](https://dreace.top/wp-content/uploads/2019/04/d3255351ly1fvn67rghurj20qo0k00tw.jpg)

frp 内网穿透图解

\[title\]下载\[/title\] Linux：[frp\_0.21.0\_linux_386.tar.gz](https://github.com/fatedier/frp/releases/download/v0.21.0/frp_0.21.0_linux_386.tar.gz) Windows：[frp\_0.21.0\_windows_amd64.zip](https://github.com/fatedier/frp/releases/download/v0.21.0/frp_0.21.0_windows_amd64.zip) 其他平台请到这里下载 [https://github.com/fatedier/frp/releases](https://github.com/fatedier/frp/releases) 中文文档 [https://github.com/fatedier/frp/blob/master/README_zh.md](https://github.com/fatedier/frp/blob/master/README_zh.md) \[title\]配置 \[/title\] 代理服务使用的是 CCProxy ，具体配置方法不再赘述，这里仅介绍内网穿透配置方法 在这里我们假设 外网服务器 IP ： `101.25.25.25` 外网服务器暴露给内网服务器的端口：`1800` 本机 IP ：`192.168.1.10` 本机代理服务端口： `1700` 本机暴露给外网的端口（外部数据交换）：`1900`

### 配置服务端（Linux）

将上面的压缩包解压服务器 编辑 `frps.ini`

\[common\]
bind_port = 1800 #服务端与客户端通信端口
dashboard_port = 182 #控制面板端口
dashboard_user = admin #控制面板用户名
dashboard_pwd = admin #控制面板密码

执行

./frps -c frps.ini

运行服务端（可能需要提升 `frps` 权限） 执行成功后会看到如下信息 ![](https://dreace.top/wp-content/uploads/2019/04/d3255351ly1fvm7mm9msaj20mx0ehgmd.jpg) 访问  `101.25.25.25:182` 即可以看到控制面板，包含流量统计信息 ![](https://dreace.top/wp-content/uploads/2019/04/d3255351ly1fvmu7x45bkj21ho0pmq58.jpg)

### 配置客户端（Windows）

编辑 `frpc.ini`

\[common\]

server_addr =  101.25.25.25 #外网服务器 IP
server_port = 1800 #外网服务器端口

\[proxy\]
type = tcp #协议
local_port = 1700 #本地数据交换端口
remote_port = 1900 #远程数据交换端口

打开 cmd 在 frp\_0.21.0\_windows_amd64 目录下执行 `frpc -c frpc.ini` 运行后服务器会开放 `remote_port` 设置的端口，并将数据转发至本机 `local_port` 设置的端口 这里的 `1700` 端口就是本地代理服务的端口 执行成功后会看到以下信息 ![](https://dreace.top/wp-content/uploads/2019/04/d3255351ly1fvmuunbo7nj20n50crn6q.jpg) 此时可以看到服务器输出客户端连接的信息 ![](https://dreace.top/wp-content/uploads/2019/04/d3255351ly1fvmuzq23yqj20mx0ehmxn.jpg) \[title\]写在最后\[/title\] 至此服务端与客服端已经配置完成 仅需将代理设置成 `101.25.25.25:1900` 即可连接到本机的代理服务，可以在外网访问校内网。 如果想在外网连接本机的远程桌面，只需要在 `frpc.ini` 中添加一下配置（要求本机已经开启远程桌面服务）

\[RDP\]
type = tcp
local_port = 3389  #本机远程桌面端口
remote_port = 6000  #本机提供外网远程桌面链接的端口

或者使用使用 Web 服务

\[Web\]
type = http
local_port = 8800 #本机 Web 服务端口
custom_domains = xxx.com #提供外网访问的域名

再次执行  `frpc -c frpc.ini` 即可生效

