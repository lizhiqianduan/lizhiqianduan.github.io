# 开始
## 安装esbuild

首先，在本地下载并安装esbuild命令。可以使用npm（在安装NodeJs时会自动安装）安装预构建的本地可执行文件：

```
npm install --save-exact esbuild
```

这条命令执行后，应该就已经在本地`node_modules`文件夹中安装了esbuild。您可以运行esbuild可执行文件来验证一切是否正常工作：


```
./node_modules/.bin/esbuild --version
```
建议安装esbuild的方法是使用npm安装本机可执行文件。但如果你不想这样做，还有一些其他的安装方法。


## 您的第一个`bundle`

这是一个关于esbuild功能以及如何快速使用它的真实示例。首先，安装react和react dom包：

```cmd
npm install react react-dom
```
然后创建一个名为`app.jsx`的文件，其中包含以下代码：

```jsx
import * as React from 'react'
import * as Server from 'react-dom/server'

let Greet = () => <h1>Hello, world!</h1>
console.log(Server.renderToString(<Greet />))
```

最后，告诉esbuild如何打包这个文件：

```cmd
./node_modules/.bin/esbuild app.jsx --bundle --outfile=out.js
```

执行这个构建命令后，应该会创建一个名为out.js的文件，其中包含您的代码和打包在一起的React库。代码是完全独立的，不再依赖于node_modules目录。如果您使用`node out.js`运行代码，应该会看到如下内容：

```txt
<h1 data-reactroot="">Hello, world!</h1>
```

请注意，esbuild还将JSX语法转换为JavaScript，除了`.JSX`扩展名之外没有任何其他配置。虽然可以对esbuild进行配置，但这里尝试使用默认值，这样才能让更多的通用情况自动运行。如果您想在`.js`文件中使用`JSX语法`，可以使用`--loader:.js=JSX`标志告诉`esbuild`允许这样做。您可以在`API文档`中阅读有关可用配置选项的更多信息。



## 构建脚本

您的build命令将重复运行，因此您可能想要将它自动化。一种自然的方法是将构建脚本添加到`package.json`文件中，如下所示：


```json
{
  "scripts": {
    "build": "esbuild app.jsx --bundle --outfile=out.js"
  }
}
```

请注意，这里直接使用了esbuild命令，而没有使用相对路径。这是因为`scripts`部分中的所有内容都是使用路径中已经存在的`esbuild`命令运行的（只要您安装了esbuild包）。



构建脚本可以这样调用：
```cmd
npm run build
```

但是，如果您需要将更多的选项传递给esbuild，那么使用命令行界面可能会变得非常困难。对于更复杂的使用场景，您可能希望使用`esbuild`的`JavaScript API`在`JavaScript`中编写构建脚本。可能像下面这样：

```js
require('esbuild').build({
  entryPoints: ['app.jsx'],
  bundle: true,
  outfile: 'out.js',
}).catch(() => process.exit(1))
```

`build函数`在子进程中运行esbuild可执行文件，当build执行完成后，返回一个promise。上面的代码不会打印出捕获到的异常，因为默认情况下，异常中的任何错误消息也会打印到控制台（如果您愿意，可以更改日志级别来关闭它）。


虽然也有一个非异步的`buildSync API`，但异步API对于构建脚本更好，因为插件只能与异步API一起工作。您可以在API文档中阅读有关构建API的配置选项的更多信息。