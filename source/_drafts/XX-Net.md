# 导入证书

在开始前确保 iOS 设备和电脑在同一个局域网下

## 使用浏览器导入

### 下载证书

首先访问 [http://127.0.0.1:8085/?module=launcher&menu=config](http://127.0.0.1:8085/?module=launcher&menu=config) 将 `允许远程访问控制页` 选项设置为 `ON`。然后使用 Safari 访问 [http://192.168.31.96:8085/module/gae_proxy/control/download_cert](http://127.0.0.1:8085/module/gae_proxy/control/download_cert) 下载证书，注意将 `192.168.31.96` 换成自己电脑的 IP。

### 安装证书

在“设置”>“通用”>“描述文件”中选择 GoAgent XX-Net 点击安装即可

### 信任证书

前往“设置”>“通用”>“关于本机”>“证书信任设置”。在“针对根证书启用完全信任”下，开启对 GoAgent XX-Net 的信任。

## 直接发送证书文件

### 发送证书

可通过 QQ、微信等聊天工具发送 `<XX-Net 根目录>\data\gae_proxy` 下的 `CA.crt` 文件到 iOS 设备，在设备上下载后选择用其他应用打开，选择 `存储到“文件”`，然后选择路径即可。

### 安装证书

使用“文件”找到上一步存放的证书，点击后提示 `已下载描述文件`。回到“设置”首页，点击顶部的“已下载描述文件”，安装即可。

### 信任证书

前往“设置”>“通用”>“关于本机”>“证书信任设置”。在“针对根证书启用完全信任”下，开启对 GoAgent XX-Net 的信任。

# 修改 XX-Net 设置

`<XX-Net 根目录>\data\smart_router` 下的 `config.json`，在最后增加一行

```
"proxy_bind_ip": "0.0.0.0"
```

使其监听所有网卡，别忘了在上一行末尾补上 `,`。

![image.png](https://i.loli.net/2020/02/04/FxiImnVoMTE5Lh7.png)

然后重启 XX-Net。

# 在 iOS 设备上设置代理

## 使用代理软件（推荐）

推荐使用 Shadowrocket 等代理软件。

添加一个 Socket5 节点， `服务器` 填写电脑的 IP， `端口` 填写 `8086`。

<img src="https://i.loli.net/2020/02/04/mr9EV63T4ugRlz1.png" alt="image.png" style="zoom: 33%;" />

保存后连接即可使用。

## 使用系统的代理设置

在“设置”>“无线局域网”中点击已连接网络右侧的信息图标ℹ，修改“代理配置”为 `手动`， `服务器` 填写电脑的 IP， `端口` 填写 `8086`。

<img src="https://i.loli.net/2020/02/06/nO9pfcTqALKwWCS.png" alt="image.png" style="zoom:33%;" />

保存之后即可使用。

# 最后

Enjoy it.


