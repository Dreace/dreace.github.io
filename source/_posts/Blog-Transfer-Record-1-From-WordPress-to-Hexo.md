---
title: '博客迁移日志其一 从 WordPress 到 Hexo'
typora-root-url: ../../source/
date: 2019-11-10 11:03:36
tags:
  - 记录
  - 博客
  - 迁移
  - Hexo
categories:
  - 建设日志
---

## 启

用 WordPress 写博客已经很长时间，虽然写的东西不多，从最开始的托管空间开始到迁移至阿里的 ECS 上，这个博客已经存在了四五年了。也从最开始感叹 WordPress 功能强大到现在抱怨种种问题，例如 Markdown 支持不完善、由于主机上传带宽很小后台管理打开很慢等等。越用越感觉 WordPress 似乎不适合我，操作过于繁琐。一句话就是「**不够 Geek**」。

<!-- more -->

## 开始 Hexo

其实最开始搭建博客时也考虑过 Hexo，当初认为 Hexo 过于简陋而使用了 WordPress。现在来看 Hexo 才是最适合我的。

- Markdown 编写文章配合上 Typora 不要太爽
- 静态页面没有后台管理
- 每个细节可高度定制化
- 快速部署到任何地方

安装、使用 Hexo 很简单就不介绍了，可以看一下 {% post_link hello-world %}。主题选择的是 [Nexmoe]( https://github.com/nexmoe/hexo-theme-nexmoe )，有部分修改。

文章在本地编写后 Push 到 [Dreace233/Hexo](https://github.com/Dreace233/Hexo) 仓库，这个仓库配置了 Github Actions 每次 Push 之后会自动生成静态 HTML 文件并推送到 ECS 上。实际上这个博客是自动生成并部署到 ECS 的，详细内容会在之后的文章中说明。整个过程看起来有点复杂，但是呢，整体设置完成后会很方便，可以在任何地方用任何设备写文章，然后上传到 GitHub 即可😃。

## 从 WordPress 导出

登录 WordPress 后台，点击 `工具->导出` 然后下载 XML 文件即可。

安装插件[^1]。

```shell
npm install hexo-migrator-wordpress --save
```

导入  XML 文件。

```shell
hexo migrate wordpress <source>
```

其中 `<source>`  是文件路径。

![导入完成](/images/Blog-Transfer-Record-1-From-WordPress-to-Hexo/image-20191110180243358.png)

导入成功，虽然内容转移过来了但是排版惨不忍睹。比如文章中部分代码代码格式丢失、不忍直视的文件名。

![丢失样式的 Python 代码](/images/Blog-Transfer-Record-1-From-WordPress-to-Hexo/image-20191110182226873.png)

![不忍直视的文件名](/images/Blog-Transfer-Record-1-From-WordPress-to-Hexo/image-20191110182507063.png)

只能先把这些文章移到  `_drafts` 文件夹中以后来慢慢整理。

## 最后

新的博客算是基本搭建好了，其中也没什么坑点，感觉很好。下一篇文章会详细说一下自动化构建流程。

[^1]:[https://hexo.io/zh-cn/docs/migration](https://hexo.io/zh-cn/docs/migration) "迁移 | Hexo" 

