---
title: '[Android]提取微信聊天记录'
tags:
  - Android
  - 微信
  - 破解
typora-root-url: ../../source/
url: 186.html
id: 186
categories:
  - 破解
date: 2017-07-01 18:18:09
---

\[title\]写在前面\[/title\] 本文需要使用的工具

*   SQLCipher 2.1.1 \[ypbtn\]https://pan.baidu.com/s/1qY2TxXq\[/ypbtn\] \[bdbtn\]http://obvs908b0.bkt.clouddn.com/sqlcipher.exe\[/bdbtn\]
*   已经获取root权限的Android手机

\[title\]准备工作\[/title\]

1.  在手机上打开 ES文件浏览器 或者 re浏览器
2.  进入 /data/data 目录
3.  将里面的 com.tencnet.mm 文件夹复制到SD卡上(有Android目录那里)
4.  连接电脑，使用xx手机助手将文件夹复制到电脑的任意目录

\[title\]获取必要信息\[/title\]

1.  在手机拨号界面输入 *#06#
2.  记录出现的 IMEI ，如果有多个 IMEI 则记录第一个
3.  回到刚才提取的文件夹 打开 com.tencent.mm/shared\_prefs 下的 system\_config_prefs.xml 文件
4.  记录 default_uin 的值(可能为负值)

![](http://obvs908b0.bkt.clouddn.com/2017-07-01_170423.png)

（图1）

\[title\]获取数据库密匙\[/title\]

1.  打开网址 [MD5 加密(传送门)](http://tool.oschina.net/encrypt?type=2)
2.  输入刚才记录的 IMEI 和 default_uin 的值，不需要用任何符号连接，点击 MD5 按钮

![](http://obvs908b0.bkt.clouddn.com/2017-07-01_171504.png)

(图2)

得到的值的前七位就是数据库的密匙：ebb0254 ![](http://obvs908b0.bkt.clouddn.com/enmicromsg-03.png)

（图3，此图来自网络，[参考1](http://articles.forensicfocus.com/2014/10/01/decrypt-wechat-enmicromsgdb-database/)）

\[title\]提取数据库\[/title\] 继续到提取的文件夹下的MicroMsg文件夹，你会看到一个或多个32位长的文件夹，哪一个才是我们要找的？ 打开刚才的网址 [MD5 加密(传送门)](http://tool.oschina.net/encrypt?type=2) 计算mm+default_uin的 MD5 值，对应的即为我们要找的文件夹![](http://obvs908b0.bkt.clouddn.com/2017-07-01_173129.png)

(图4)

![](http://obvs908b0.bkt.clouddn.com/2017-07-01_173207.png)

(图5)

\[title\]得到聊天记录\[/title\] 打开文件夹，然后打开最开始下载的SQLCipher 将 EnMicroMsg.db 拖到SQLCipher的窗口上，输入密码 转到 Browse Data 选项卡，在 Table 下拉菜单中找到 message ，点击即可看到微信的聊天记录，包括好友、系统、公众号 ![](http://obvs908b0.bkt.clouddn.com/2017-07-01_173835.png)

(图6)

\[title\]写在最后\[/title\] 关于 message 几个表头的含义

*   isSend:0表示接收的消息，1表示发送的消息
*   createTime:发送/接收时间(Unix时间戳) 可以在这个[网址(传送门)](https://tool.chinaz.com/Tools/unixtime.aspx)转化为普通时间

![](http://obvs908b0.bkt.clouddn.com/2017-07-01_175916.png)

(图7)

*   taker:可能是聊天对象的微信账号，若不是可以在名为 rcontact 的表中查找

Tips

*   ~SEMI_XML~的含义暂不明确
*   无法查看到已撤回消息
*   可以将记录导出为 CSV 文件在 Excel 中查看
*   之后可能会出 iOS 的提取教程

\[title\]参考\[/title\]

> 1.  [How To Decrypt WeChat EnMicroMsg.db Database?](https://articles.forensicfocus.com/2014/10/01/decrypt-wechat-enmicromsgdb-database/)
> 2.  [如何破解微信加密数据库EnMicroMsg.db读取聊天消息](https://hack70.com/2017/04/25/041%E5%A6%82%E4%BD%95%E7%A0%B4%E8%A7%A3%E5%BE%AE%E4%BF%A1%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E5%BA%93EnMicroMsg.db%E8%AF%BB%E5%8F%96%E8%81%8A%E5%A4%A9%E6%B6%88%E6%81%AF/)
> 3.  [Android逆向之旅—静态方式破解微信获取聊天记录和通讯录信息](https://hack70.com/2017/04/25/041%E5%A6%82%E4%BD%95%E7%A0%B4%E8%A7%A3%E5%BE%AE%E4%BF%A1%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E5%BA%93EnMicroMsg.db%E8%AF%BB%E5%8F%96%E8%81%8A%E5%A4%A9%E6%B6%88%E6%81%AF/)