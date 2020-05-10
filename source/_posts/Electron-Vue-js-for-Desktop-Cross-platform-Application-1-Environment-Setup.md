---
title: 'Electron + Vue.js 打造桌面端跨平台应用#1 环境搭建'
typora-root-url: ../../source/
date: 2020-01-20 22:03:48
cover: /images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200121135306530.png
tags:
  - Vue.js
  - Electron
  - 跨平台
  - 桌面端
categories:
  - Vue.js
---

最近突然有个想法打算做一个桌面应用，打算跨平台，技术选型在 Qt 和 Electron 之间定，经过一晚上的深思熟虑（并没有）最终决定采用 Electron + Vue.js 方案。谁让咱是个末流程序猿👨‍💻，UI / UX 不会做，图也不会画，只能用用别人造好的轮子。Web 这边 UI 组件问题不用担心，起码做出来的东西外观看起来还可以，希望如此。

下面将使用最新的 Electron 和 Vue CLI 搭建一个 demo 出来。

<!-- more -->

## 环境搭建[^1]

### 0x01 环境配置

Node.js 是必须的，如果还没有安装请看[这里](https://nodejs.org/zh-cn/)。

由于众所周知的原因，在国内下载一些东西会很慢，所以需要使用国内的镜像来加速之后的安装过程。

设置 NPM 的环境变量：

```bash
npm config set registry http://registry.npm.taobao.org/
npm config set electron_mirror https://cdn.npm.taobao.org/dist/electron/
```

### 0x02 安装工具

执行：

```bash
npm install @vue/cli -g
```

### 0x03 创建初始项目

切换到存放项目的目录，这里假设新建的项目名为 `electron-vue-demo`

创建项目：

```bash
vue create electron-vue-demo
```

接下来设置项目的基础配置。

#### 选择预设

![选择预设](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200120225427901.png)

这里我选择手动设置（Manually select features）。

#### 选择工具

![选择工具](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200120225453779.png)

根据项目的需要选择工具（`空格` 选择），然后 `回车` 确认。

#### 选择路由模式

![选择路由模式](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200120225857040.png)

选择 history 还是 hash 样式的路由，history 链接格式比较好看，但是需要服务器支持，由于这是 Electron 项目只能选择 hash 样式（`n`）。反正用户看不到具体的链接，难看点也能接受。

#### 选择 ESLint 配置

![选择 ESLint 配置](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200120225624117.png)

这里选择标准配置（ESLint + Standard config）。

#### 选择何时进行格式检查

![选择何时进行格式检查](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200120225701244.png)

这里选择仅在保存时检查（Lint on save）。

#### 选择单元测试方案

![选择单元测试方案](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200120225724202.png)

如果之前未选择单元测试则不会出现这个选项。

这里选择 Mocha + Chai。

#### 选择在何处存放配置信息

![选择在何处存放配置信息](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200120231432550.png)

这里选择放在 `package.json` 文件中。

#### 选择是否保存配置

![选择是否保存配置](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200120225816311.png)

如果选择 `y` 先前的配置会保存为预设备以后的项目使用，这里选择 `n`。

#### 等待安装

等待所有依赖安装完成，时间取决于网络情况。

### 0x04 安装 electron-builder

electron-builder 是一个功能强大的 Electron 打包工具。

使用 Vue CLI 添加：

```bash
vue add electron-builder
```

可能会出现更改未提交的提示，跳过即可。

![更改未提交](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200121110345907.png)

#### 选择 Electron 版本

![选择 Electron 版本](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200121111053872.png)

目前 Electron 最新版本是 7.x，但是这里没有 7.0.0 选择，先选择 6.0.0 安装完成后再手动升级。

#### 是否添加测试

![是否添加测试](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200121111846090.png)

根据项目需要添加测试，这里选择 `y`。

#### 启用 Devtools

在 Electron 6.0.0 及更新版中，若开启了 Windows 10 黑暗模式 Devtools 会出现问题，如果没有开启黑暗模式，或者是非 Windows 平台则没有影响。

目前为止（2020年1月21日）相关问题  [Electron 6.0.0 does not launch in Windows 10 Dark Mode](https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378) 还没有解决。

在 `background.js` 找到如下代码：

```javascript
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
})
```

取消注释：

```javascript
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})
```

这样就能正常使用 Devtools。

#### 修改 Electron 版本

修改 `package.json` 中：

```json
"electron": "^6.0.0",
```

为

```json
"electron": "^7.0.0",
```

然后执行 `npm install` 安装最新的 Electron。

## 安装完成

### 0x01 运行开发版

执行：

```bash
npm run electron:serve
```

即可运行开发版本的应用， Devtools 可以正常使用。

![运行成功](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200121135306530.png)

### 0x02 构建生产版

在项目根目录新建 `vue.config.js` 文件，并写入[^2]：

```javascript
module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'electron-vue-demo',
        appId: 'com.dreace.electron-vue-demo',
        directories: {
          output: 'dist_electron'
        },
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: 'public/icon.ico',
          uninstallerIcon: 'public/icon.ico',
          installerHeaderIcon: 'public/icon.ico',
          createDesktopShortcut: true,
          createStartMenuShortcut: true
        },
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        mac: {
          icon: 'public/icon.icns'
        },
        win: {
          icon: 'public/icon.ico',
          target: [
            {
              target: 'nsis'
            }
          ]
        },
        linux: {
          icon: 'public/icon.icons'
        }
      }
    }
  }
}
```

并将图标放置在 `./public` 路径下。

![图标位置](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200121140443054.png)

这里配置在 Windows 环境下将构建 NSIS 安装包，并允许用户自定义安目录，更多的配置选项可查看 [electron-builder 文档](https://www.electron.build/)。

然后执行：

```bash
npm run electron:build
```

**若首次运行出现 winCodeSign 下载失败，可尝试将安全软件关闭后重试**

执行完成后在 `./dist_electron` 路径下可找到构建的安装包，双击即可执行安装。

![构建的安装包](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200121141255491.png)

![安装后的桌面图标](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200121141916527.png)

![运行生产构建版本](/images/Electron-Vue-js-for-Desktop-Cross-platform-Application-1-Environment-Setup/image-20200121142011185.png)

## 写在后面

到此为止，一个最基础的 Electron + Vue.js 跨平台应用搭建完成，接下来就是具体的逻辑编写，希望这个项目不会流产。

更多内容可查看 [Electron 文档](https://electronjs.org/) 与 [Vue.js 教程](https://cn.vuejs.org/v2/guide/)。

[^1]: [https://youyou-tech.com/2019/12/17/Electron7%2BVueCli4%E5%BC%80%E5%8F%91%E8%B7%A8/](https://youyou-tech.com/2019/12/17/Electron7%2BVueCli4%E5%BC%80%E5%8F%91%E8%B7%A8/) "Electron7+VueCli4开发跨平台桌面应用"
[^2]: [https://juejin.im/post/5bc53aade51d453df0447927](https://juejin.im/post/5bc53aade51d453df0447927) "electron-builder打包见解"