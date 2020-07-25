---
title: 使用 TypeScript 编写命令行工具并发布到 npm
typora-root-url: ../../source/
date: 2020-07-25 10:01:41
tags:
  - npm
  - TypeScript
categories:
  - TypeScript
---

最近在研究优化在国内访问静态博客的时间，其中有一个方案是将生成的文件存储在对象存储，然后再通过 CDN 回源对象存储。确定方案后使用 [七牛云](https://www.qiniu.com/) 做一个加速实验，由于要将生成的文件上传，又要将这个过程尽可能自动化，而七牛云只提供 SDK，要上传只能将密钥硬编码在代码中，这是很危险的。

因此有了编写一个命令行工具的想法，由于最近在学习 TypeScript，就决定用它来写。

<!-- more -->

## 准备环境

在开始编写逻辑代码前需要准备一下开发环境。

首先初始化项目[^1]：

```shell
yarn init -y
```

本文将使用 yarn 作为包管理工具。

安装 TypeScript 支持：

```shell
yarn add global typescript ts-node-dev
```

`ts-node-dev` 可以直接启动 `.ts` 文件，如果使用 `tsc && node "path/to/file.js"` 自行编译并启动则不需要这个依赖。

这两个依赖需要全局安装，因为他们分别提供 `tsc` 和 `ts-node-dev` 命令。

安装 Node.js 类型声明文件：

```shell
yarn add --dev @types/node
```

以上是必备的开发依赖，除此还可以使用 ESLint 和 Prettier 来检查语法和规范格式。

以下配置内容均为可选，可以单独使用或组合使用。

### 使用 ESLint[^2]

ESLint 可以静态分析代码，能够尽早发现编码中的错误。

首先安装需要的依赖：

```shell
yarn add --dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

在根目录下创建 `.eslintrc.js` 文件并写入：

```javascript
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended'],
    plugins: ['@typescript-eslint'],
    env: {
        node: true,
    }
}
```

更多的配置可以查看 [Configuring ESLint](https://eslint.org/docs/user-guide/configuring)。

### 使用 Prettier

Prettier 可以通过配置文件来格式化代码，非常适合团队内规范代码。

首先安装 Prettier：

```shell
yarn add --dev prettier
```

在根目录下创建 `prettier.config.js` 文件，并写入[^3]：

```javascript
module.exports = {
  // 一行最多 100 字符
  printWidth: 100,
  // 使用 4 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾不需要逗号
  trailingComma: 'all',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 lf
  endOfLine: 'lf',
};
```

更多配置可查看 [What is Prettier?](https://prettier.io/docs/en/index.html)。

### 在 WebStorm 中启用 ESLint 和 Prettier

#### 启用 ESLint

找到 File | Settings | Languages & Frameworks | JavaScript | Code Quality Tools | ESLint 配置项，选择 Automatic ESLint configuration。

WebStorm 会自动查找 ESLint 路径并执行检查。

#### 启用 Prettier

找到 File | Settings | Languages & Frameworks | JavaScript | Prettier 配置项，选择 Prettier 路径，可以勾选 Run on save for files，在保存时自动执行检查。

#### 使用 EditorConfig

EditorConfig 可以通过配置文件来指定不同 IDE 或编辑器的代码格式化行为，在编码期间就能根据团队规范格式化代码。

WebStorm 已经内置实现 EditorConfig 支持，在根目录创建 `.editorconfig` 文件，并写入：

```ini
# http://editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.ts]
ij_typescript_spaces_within_imports = true

[Makefile]
indent_style = tab
```

以上配置效果和 Prettier 相同，更多配置可查看 [EditorConfig](https://editorconfig.org/#overview)。

### 配置 TypeScript

在根目录下创建 `tsconfig.json` 文件，并写入：

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

`outDir` 指定 `tsc` 命令编译结果输出路径。

## 编写代码

### 使用 Commander.js

要编写的是命令行工具，自然要解析命令行参数，出于不重复造轮子的目的选择 [Commander.js](https://github.com/tj/commander.js) 来解析命令行参数。

安装 Commander.js：

```shell
yarn add commander
```

Commander.js 使用很简单，一个例子：

```typescript
import { program } from 'commander';

program
  .version('1.0.3')
  .name('upload-to-qiniu')
  .requiredOption('-a, --access-key [ak]', 'access key')
  .requiredOption('-s, --secret-key [sk]', 'secret key')
  .option('-d, --upload-dir <dir>', '要上传的目录', './')
  .requiredOption('-b, --bucket [bucket]', '对象存储空间名')
  .option('-e, --exclude-prefix <prefixs...>', '忽略的文件名前缀，可以设置多个')
  .parse();
```

`import { program } from 'commander';` 导入全局对象，`version` 指定版本号，`name` 指定 `-h` 帮助信息的名称。

`option` 定义选项，一共三个参数：

- 第一个参数指定选项名称，指定选项的短名称和长名称，使用逗号、空格或 `|` 分割，必选
- 第二个参数为选项描述，可选
- 第三个参数为默认值，可选

`option` 定义的选项是非必选的，如需要定义必选选项可以使用 `requiredOption`，如果使用命令行时没有指定必选选项会有报错。

有两种最常用的选项，一类是 boolean 型选项，选项无需配置参数，另一类选项则可以设置参数（使用尖括号声明）。如果在命令行中不指定具体的选项及参数，则会被定义为 `undefined`。

代码中将长名称转化成小驼峰来获取用户指定的参数值，例如：

```typescript
const mac = new qiniu.auth.digest.Mac(program.accessKey, program.secretKey);
```

`program.accessKey` 获取的是 `-a` 参数指定的值。

定义好选项后可以使用 `-h` 查看帮助信息：

```text
> upload-to-qiniu -h
Usage: upload-to-qiniu [options]

Options:
  -V, --version                      output the version number
  -a, --access-key [ak]              access key
  -s, --secret-key [sk]              secret key
  -d, --upload-dir <dir>             要上传的目录 (default: "./")
  -b, --bucket [bucket]              对象存储空间名
  -e, --exclude-prefix <prefixs...>  忽略的文件名前缀，可以设置多个
  -h, --help                         display help for command
```

### 编写逻辑代码

做了这么多准备终于可以正式开始编写代码了，在根目录创建 `src`  目录，然后在其中编写代码即可。

每个项目具体细节有很大差异，这里就不写具体细节了，不过有一点要注意，入口文件首行一定要加上 `#!/usr/bin/env node` 来指定解释器，否则会使用系统解释器，在 Windows 下不能正常使用。

本文涉及的具体代码可以在 [Dreace/upload-to-qiniu](https://github.com/Dreace/upload-to-qiniu) 找到。

## 发布 npm 包

### 填写包信息

```json
{
  "name": "upload-to-qiniu",
  "version": "1.0.4",
  "license": "GPL-3.0",
  "main": "dist/upload.js",
  "bin": {
    "upload-to-qiniu": "dist/upload.js"
  },
  "scripts": {
    "lint": "eslint src --fix --ext .ts"
  },
  "files": [
    "dist/**/*.js"
  ],
  "dependencies": {
    "commander": "^6.0.0",
    "qiniu": "^7.3.2"
  },
  "devDependencies": {
    "@types/node": "^14.0.24",
    "@typescript-eslint/eslint-plugin": "^3.7.0",
    "@typescript-eslint/parser": "^3.7.0",
    "eslint": "^7.5.0",
    "eslint-plugin-prettier": "^3.1.4",
    "prettier": "^2.0.5"
  }
}
```

`name` 指定包名，在 npm 中全局唯一，`version` 指定当前版本，`license` 指定许可证。

`bin` 指定命令行和要执行的 `.js` 脚本对应关系，一个包可以提供多个命令行工具。

`files` 指定打包时要包含的文件，除此 `README.md` 和 `LICENSE` 也会被打包。

### 本地测试

编写完代码后需要安装为全局包进行测试。

```shell
npm i -g .
```

将当前目录下的文件安装为全局包，安装后可以通过 `bin` 中指定的名称来使用。

### 发布

首先 [注册一个 npm 账号](https://www.npmjs.com/signup)。然后使用 `npm login` 登录到 npm。

登录后使用 `npm publish` 发布包，输出信息大致如下：

```text
> npm publish
npm notice
npm notice package: upload-to-qiniu@1.0.5
npm notice === Tarball Contents ===
npm notice 35.8kB LICENSE
npm notice 6.0kB  dist/upload.js
npm notice 6.6kB  dist/utils.js
npm notice 931B   package.json
npm notice 1.0kB  README.md
npm notice === Tarball Details ===
npm notice name:          upload-to-qiniu
npm notice version:       1.0.5
npm notice package size:  16.4 kB
npm notice unpacked size: 50.4 kB
npm notice shasum:        73b867074f514761f6c6c9a442c38e83bc18aa9a
npm notice integrity:     sha512-qHdhXhV/JjzMv[...]x6wD4OY1ysFnQ==
npm notice total files:   5
npm notice
+ upload-to-qiniu@1.0.5
```

发布成功后可以在 [https://www.npmjs.com/](https://www.npmjs.com/) 看到包信息。

[^1]: [https://juejin.im/post/5ecdd5185188254329780b0f](https://juejin.im/post/5ecdd5185188254329780b0f) "用 Node.js 写个命令行翻译工具, 发布到 npm"
[^2]: [https://github.com/forthealllight/blog/issues/45](https://github.com/forthealllight/blog/issues/45) "在Typescript项目中，如何优雅的使用ESLint和Prettier"
[^3]: [https://ts.xcatliu.com/engineering/lint.html](https://ts.xcatliu.com/engineering/lint.html) "代码检查 · TypeScript 入门教程"