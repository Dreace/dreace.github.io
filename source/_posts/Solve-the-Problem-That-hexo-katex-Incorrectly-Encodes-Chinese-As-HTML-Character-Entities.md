---
title: 解决 hexo-katex 错误地将中文编码为 HTML 字符实体
typora-root-url: ../../source/
date: 2020-08-01 20:32:12
tags:
  - JavaScript
  - npm
  - Hexo
categories:
  - Hexo
---

偶然发现博客正文中的中文都被编码成了 [HTML 字符实体](https://zh.wikipedia.org/wiki/%E5%AD%97%E7%AC%A6%E5%AE%9E%E4%BD%93%E5%BC%95%E7%94%A8)，也就是中文「静」被编码为 `&#x9759;`，在 UTF-8 中一个中文字符由三个字符编码，而转成 HTML 字符实体后一个中文字符占 8 个字节，增加了 167%。一篇博客正文占据主要部分，四舍五入，转换后 HTML 文件体积比直接使用 UFT-8 编码大了一倍。

<!-- more -->

## 定位问题

查阅资料得知可能是 cheerio 引起的问题[^1]，在 node_modules 下查找发现 hexo-katex 引入了 cheerio 并设置了要编码实体，

定位到的代码（node_modules/hexo-katex/index.js:16）：

```javascript
var $ = cheerio.load(data.content, { decodeEntities: true })
```

## 解决

既然问题找到了，解决办法也很简单，将 `true` 改为 `false`：

```javascript
var $ = cheerio.load(data.content, { decodeEntities: false })
```

但是，直接修改 node_modules 下的文件可能会丢失更改，或者需要在其他环境使用修改不能同步。由于我的博客是使用 CI/CD 自动编译并部署的，直接修改文件会比较麻烦。

这时就需要 [patch-package](https://github.com/ds300/patch-package) 了，patch-package 可以将更改固定，在每次安装依赖时自动应用更改。

### 安装

首先要安装 patch-package：

```shell
yarn add patch-package postinstall-postinstall
```

如果使用 npm 则是：

```shell
npm i patch-package
```

然后在 package.json 的 `scripts` 字段下新增：

```json
"postinstall": "patch-package",
```

表明在依赖安装后会执行 `patch-package`。

### 固定修改

首先保存已修改的文件，然后执行：

```shell
yarn patch-package <修改了的包名>
```

或者使用 npx：

```shell
npx patch-package <修改了的包名>
```

此时将看到类似：

```text
yarn run v1.22.4
$ patch-package
patch-package 6.2.2
Applying patches...
hexo-katex@0.0.13 ✔
Done in 1.13s.
```

的输出，表明修改已经固定。

在 patches 目录下会有对应的 `.patch` 文件，本文对应的文件如下：

```diff
diff --git a/node_modules/hexo-katex/index.js b/node_modules/hexo-katex/index.js
index cf8daf8..98fb8c6 100644
--- a/node_modules/hexo-katex/index.js
+++ b/node_modules/hexo-katex/index.js
@@ -13,7 +13,7 @@ hexo.extend.filter.register('after_post_render', function(data) {
 
   if (!cheerio) cheerio = require('cheerio')
 
-  var $ = cheerio.load(data.content, { decodeEntities: true })
+  var $ = cheerio.load(data.content, { decodeEntities: false })
 
   if ($('.math').length > 0) {
     linkTag = util.htmlTag('link', {
```

### 应用更改

只要将上述生成的文件提交到版本控制系统，在其他环境安装依赖时直接使用 `yarn install` 或 `npm install` 即可同步修改。

[^1]: [https://github.com/hexojs/hexo/issues/657](https://github.com/hexojs/hexo/issues/657) "網頁能正常顯示中文，但查看HTML源代碼卻出現亂碼"