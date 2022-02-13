---
title: '博客迁移日志其二 使用 Github Actions 自动部署 Hexo'
typora-root-url: ../../source/
date: 2020-01-10 13:59:18
cover: /images/Blog-Transfer-Record-2-Automate-Hexo-Deployment-with-GitHub-Actions/image-20200110161901448.png
tags:
  - Hexo
  - Github Actions
categories:
  - 建设日志
---

上一篇博客{% post_link Blog-Transfer-Record-1-From-WordPress-to-Hexo%}中已经完成将 WordPress 中的数据迁移到 Hexo，但是每次修改内容后都要手动生成静态网页然后同步到服务器，这些步骤还是很繁琐的。因此需要一个自动化的流程来帮助部署博客，[GitHub Actions](https://github.com/features/actions) 可以很好的满足这个需求。

<!-- more -->

## 配置目标服务器

在开始前需要在部署 Hexo 的服务器新建一个空的 Git 仓库，以及设置通过私钥登录。以下使用的命令以 CentOS 为例，其他 Linux 版本同理。

### 0x01 安装 Git[^1]

直接安装：

```bash
sudo yum install git
```

### 0x02 创建新用户

为了控制权限，可新建立一个名为 git 的用户：

```bash
sudo adduser git
```

### 0x03 生成 SSH 密钥[^2]

SSH 密钥用于部署时免密登录。使用 `ssh-keygen` 生成密钥，注意将 `your_email@example.com` 替换成自己的邮箱。

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

询问存放位置：

```
Enter file in which to save the key (/root/.ssh/id_rsa): 
```

直接回车使用默认设置即可（`/root/.ssh/id_rsa`）。

提示输入密码：

```
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
```

输入一个密码并重复，直接回车表示密码留空。

### 0x04 复制 SSH 密钥

将 `~/.ssh/id_rsa.pub` 中的内容添加到 `/home/git/.ssh/authorized_keys` 中，若该文件不存在可以手动创建。

### 0x05 创建裸仓库

在 `/var/repo` 新建名为 `blog.git` 的仓库：

```bash
sudo mkdir /var/repo
cd /var/repo
sudo git init --bare blog.git
```

裸仓库没有工作区，只是为了共享。

### 0x06 创建存放静态网页目录

创建目录：

```bash
cd /var/
sudo mkdir www
cd www
sudo mkdir html
cd html
sudo mkdir hexo
```

以后生成的文件将存放在 `/var/www/html/hexo` 下。

更改权限：

```bash
cd /var/
sudo chmod -R 777 www
cd www
sudo chmod -R 777 html
cd html
sudo chmod -R 777 hexo
```

### 0x07 配置 Git 钩子

进入 `/var/repo/blog.git/hooks`，创建编辑 `post-receive` 文件：

```bash
cd /var/repo/blog.git/hooks
sudo vim post-receive
```

在 `post-receive` 写入：

```bash
git --work-tree=/var/www/html/hexo --git-dir=/var/repo/blog.git checkout -f
```

表示每次 `push` 是文件将存放在 `/var/www/html/hexo` 下。

保存后赋予  `post-receive` 可执行权限：

```bash
chmod +x post-receive
```

### 0x08 更改仓库目录所有者

将 `blog.git` 目录的所有者更改为 git 用户：

```bash
sudo chown -R git:git blog.git
```

### 0x09 禁止 git 用户登录 shell

编辑 `/etc/passwd`，找到

```
git:x:1001:1001:git,,,:/home/git:/bin/bash
```

修改为：

```
git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell
```

这样 git 用户可以通过 SSH 使用 git，但不能使用 shell。

## 配置 GitHub Actions

### 0x01 添加私钥到 GitHub 仓库

如果存放 Hexo 源文件的仓库是公开的，为了不暴露私钥需要将之前生成的私钥保存到 `Secrets` 当中，需要时通过环境变量访问。

![添加 Secrets](/images/Blog-Transfer-Record-2-Automate-Hexo-Deployment-with-GitHub-Actions/image-20200110155500166.png)

`Name` 填写为 `id_rsa`， `Value` 中填写之前生成的 `id_rsa` 文件中的内容，形如：

```
-----BEGIN RSA PRIVATE KEY-----
MIIJKQIBAAKCAgEAq0XtV523Wcgs/2DqFAxqicbHb4x0tvwt/mNe7pKBCLzkL551
DyCHEYVoOVUbO3Fu80h5M7Ku4+ojWSZpCXwqabObTn1tTNUrubWi2OIfkqnzGn+T
...
6FEmudj4Bb1+GZPu7muNWYamydlCK8D7cAu6I/iRyC0ya5j9wDZpYXYr2fRzd4Hf
rsTNxNy45COZWr7IBbrb0+WBXlXwTrSx+XioRxEyukk1U79aIk3uvSP6C/4F
-----END RSA PRIVATE KEY-----
```

### 0x02 添加 GitHub Actions

首先创建一个新的配置文件：

![新建配置文件](/images/Blog-Transfer-Record-2-Automate-Hexo-Deployment-with-GitHub-Actions/image-20200110155919909.png)

写入[^3]：

```yaml
name: Node CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [10.x]

    steps:
      - uses: actions/checkout@v1
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: Configuration environment
        env:
          ID_RSA: ${{secrets.id_rsa}}
        run: |
          mkdir -p ~/.ssh/
          echo "$ID_RSA" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan <your_host> >> ~/.ssh/known_hosts
          git config --global user.name '<your_user_name>'
          git config --global user.email '<your_email>'
      - name: Install dependencies
        run: |
          npm i -g hexo-cli
          npm i
      - name: Deploy hexo
        run: |
          hexo g -d
```

注意将 `<your_host>`、`<your_user_name>`、`<your_email>` 替换成自己的域名、用户名和邮箱。

## 配置 Hexo

修改 Hexo 根目录下的 `_config.yml` 文件，添加：

```yaml
deploy:
  type: git
  repo: git@<your_host>:/var/repo/blog.git
  branch: master
```

将 `<your_host>` 替换成自己的域名。

最后别忘了安装 [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git) 插件[^4]。

```bash
npm install hexo-deployer-git --save
```

## 配置 Nginx

在 `/etc/nginx/conf.d` 下新增配置 `blog.conf`。

```nginx
server {
    listen 443 ssl;
    server_name <your_host>;
    index index.html;  
    location / {
        root "/var/www/html/hexo";
    }
}
server {
    listen 80;
    server_name <your_host>;
    rewrite ^(.*) https://$host$1 permanent;
}
```

将 `<your_host>` 替换成自己的域名。

如果没有配置 SSL，`blog.conf` 应该写入：

```nginx
server {
    listen 80;
    server_name <your_host>;
    index index.html;  
    location / {
        root "/var/www/html/hexo";
    }
}
```

## 测试

将本地文件推送至远程仓库，可以在 Actions 选项下看到触发了一次 GitHub Actions。

![Actions 执行成功](/images/Blog-Transfer-Record-2-Automate-Hexo-Deployment-with-GitHub-Actions/image-20200110161901448.png)

## 最后

然后重启 Nginx 即可通过 `<your_host>` 访问博客。

[^1]: [https://calton007.github.io/2018/05/08/n-deploy-vps/](https://calton007.github.io/2018/05/08/n-deploy-vps/) "使用 Git Hook 自动部署 Hexo 到个人 VPS"
[^2]: [https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) "Generating a new SSH key and adding it to the ssh-agent"

[^3]: [https://suikastar.com/posts/24967/](https://suikastar.com/posts/24967/) "使用 GitHub Actions 自动化部署 Hexo"
[^4]: [https://hexo.io/zh-cn/docs/one-command-deployment.html](https://hexo.io/zh-cn/docs/one-command-deployment.html) "部署"