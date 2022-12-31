---
title: 为阿里云 ECS 添加 IPv6 支持
tags:
  - IPv6
  - 教程
  - 网络
  - 配置
typora-root-url: ../../source/
url: 389.html
id: 389
categories:
  - 网络
date: 2019-04-16 18:37:16
---

\[title\]写在前面\[/title\] 国外主机已经普遍支持 IPv6，甚至 [Vultr](https://www.vultr.com/?ref=7190287) 之前还推出过 IPv6 Only 主机，而国内厂商迟迟不跟进部署。目前阿里云只开放部分地区 IPv6 申请，想使用只有申请。无奈之下只能用折中方案： IPv6 隧道（Tunnel），下面将介绍如何为阿里云 ECS 添加 IPv6 隧道，使其能通过 IPv6 网络访问。 测试服务器 IPv6 支持情况：[https://ipv6-test.com/validate.php](https://ipv6-test.com/validate.php) 测试本地网络 IPv6 支持情况：[https://test-ipv6.com/](https://test-ipv6.com/) 配置 IPv6 隧道前： ![](https://img.dreace.top/%E4%B8%BA%E9%98%BF%E9%87%8C%E4%BA%91%20ECS%20%E6%B7%BB%E5%8A%A0%20IPv6%20%E6%94%AF%E6%8C%81/%E5%9B%BE%201.png)

图 1

\[title\]准备\[/title\]

*   ECS 必须有公网 IP

\[title\]注册 Tunnel Broker\[/title\] 在 [https://tunnelbroker.net/register.php](https://tunnelbroker.net/register.php) 注册一个账号。 \[title\]创建 IPv6 隧道\[/title\] 点击左侧 **Create Regular Tunnel** 开始创建一个 IPv6 隧道。 ![](https://img.dreace.top/%E4%B8%BA%E9%98%BF%E9%87%8C%E4%BA%91%20ECS%20%E6%B7%BB%E5%8A%A0%20IPv6%20%E6%94%AF%E6%8C%81/%E5%9B%BE%202.png)

图 2

在 **IPv4 Endpoint (Your side) **处填写 ECS 的 IP。 ![](https://img.dreace.top/%E4%B8%BA%E9%98%BF%E9%87%8C%E4%BA%91%20ECS%20%E6%B7%BB%E5%8A%A0%20IPv6%20%E6%94%AF%E6%8C%81/%E5%9B%BE%203.png)

图 3

在 **Available Tunnel Servers** 处选择一个隧道服务器，可以在先测试一下 ping 值选择最快的那个。我这里选择的是日本服务器。 ![](https://img.dreace.top/%E4%B8%BA%E9%98%BF%E9%87%8C%E4%BA%91%20ECS%20%E6%B7%BB%E5%8A%A0%20IPv6%20%E6%94%AF%E6%8C%81/%E5%9B%BE%204.png)

图 4

点击最后的 **Create Tunnel** 按钮创建隧道。等待一会，创建完成后跳转到 Tunnel Details 页面，看到如下信息： ![](https://img.dreace.top/%E4%B8%BA%E9%98%BF%E9%87%8C%E4%BA%91%20ECS%20%E6%B7%BB%E5%8A%A0%20IPv6%20%E6%94%AF%E6%8C%81/%E5%9B%BE%205.png)

图 5

至此 IPv6 隧道已经创建完成。 \[title\]服务器设置\[/title\] 首先编辑`/etc/sysctl.conf`文件：
```
sudo vim /etc/sysctl.conf
```
将这三行改为 0 ，然后保存：
```
net.ipv6.conf.all.disable_ipv6 = 0
net.ipv6.conf.default.disable_ipv6 = 0
net.ipv6.conf.lo.disable_ipv6 = 0
```
使更改生效：
```
sysctl -p
```
查看更改是否生效：
```bash
sudo sysctl -a | grep disable_ipv6
```
看到这样的结果就是生效了： ![](https://img.dreace.top/%E4%B8%BA%E9%98%BF%E9%87%8C%E4%BA%91%20ECS%20%E6%B7%BB%E5%8A%A0%20IPv6%20%E6%94%AF%E6%8C%81/%E5%9B%BE%206.png)

图 6

回到 Tunnel Broker 选择 **Tunnel Details** 下的 **Example Configurations **标签，并在下拉选择框中选择 Linux-route2。然后将红框中的地址改为服务器的本地地址，若使用外网地址会配置失败。 ![](https://img.dreace.top/%E4%B8%BA%E9%98%BF%E9%87%8C%E4%BA%91%20ECS%20%E6%B7%BB%E5%8A%A0%20IPv6%20%E6%94%AF%E6%8C%81/%E5%9B%BE%207.png)

图 7

可以直接在网页上修改然后复制出来：
```bash
modprobe ipv6
ip tunnel add he-ipv6 mode sit remote 74.82.46.6 local 172.19.42.187 ttl 255
ip link set he-ipv6 up
ip addr add 2001:470:23:ed8::2/64 dev he-ipv6
ip route add ::/0 dev he-ipv6
ip -f inet6 addr
```
粘贴到服务器终端中执行，若执行完成后没有报错则是配置成功。 \[title\]验证 IPv6 隧道可用\[/title\] 首先编辑`/etc/resolv.conf`添加 IPv6 DNS：
```bash
sudo vim /etc/resolv.conf
```
添加一行 nameserver 2001:4860:4860::8888 。 在本机执行：
```bash
ping6 ipv6.google.com
```
如果能通则 IPv6 隧道可用 ![](https://img.dreace.top/%E4%B8%BA%E9%98%BF%E9%87%8C%E4%BA%91%20ECS%20%E6%B7%BB%E5%8A%A0%20IPv6%20%E6%94%AF%E6%8C%81/%E5%9B%BE%208.png)

图 8

\[title\]添加解析\[/title\] 如果希望网站能在 IPv6 中用，需要为域名添加 AAAA 解析： ![](https://img.dreace.top/%E4%B8%BA%E9%98%BF%E9%87%8C%E4%BA%91%20ECS%20%E6%B7%BB%E5%8A%A0%20IPv6%20%E6%94%AF%E6%8C%81/%E5%9B%BE%209.png)

图 9

等待解析生效后，网站就能通过 IPv6 访问。 在最开始提到的 [https://ipv6-test.com/validate.php](https://ipv6-test.com/validate.php) 再次检测： ![](https://img.dreace.top/%E4%B8%BA%E9%98%BF%E9%87%8C%E4%BA%91%20ECS%20%E6%B7%BB%E5%8A%A0%20IPv6%20%E6%94%AF%E6%8C%81/%E5%9B%BE%2010.png) 已经可以通过 IPv6 访问了，在此之前可能还需要配置服务器监听 IPv6 流量，方法同 IPv4 就不展开讲了。 至此，IPv6 隧道已经配置完成。