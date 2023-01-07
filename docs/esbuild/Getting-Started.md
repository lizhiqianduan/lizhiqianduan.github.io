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


## 浏览器环境打包

默认情况下，`bundler`为浏览器输出代码，因此启动时不需要额外的配置。对于开发版本，您可能希望使用`--sourcemap`启用源码映射，而对于生产版本，可能希望使用`--minify`启用代码压缩。您可能还希望为您支持的浏览器配置`target`环境，以便将最新的`JavaScript语法`转换为旧的`JavaScript`语法。所有这些加起来后，可能看起来像这样：


```cmd
esbuild app.jsx --bundle --minify --sourcemap --target=chrome58,firefox57,safari11,edge16
```
某些npm包可能不是设计为在浏览器中运行的。有时，您可以使用esbuild的配置选项来解决某些问题，无论如何都能成功地打包。在简单的情况下，可以用define特性替换未定义的全局变量，在更复杂的情况下可以用inject特性替换。


## Node环境打包

虽然在使用node的时候打包不是必需的，但有时在node中运行代码之前使用`esbuild`处理代码仍然是有好处的。打包可以自动剥离`TypeScript`类型，将`ECMAScript`模块语法转换为`CommonJS`，并将较新的JavaScript语法转换为特定版本节点的较旧语法。在发布软件包之前打包也是有好处的，这样下载量就更小，在从文件系统读取源代码的时间也更少。



如果需要打包为在`node`中运行的代码，则应通过将`--platform=node`传递给`esbuild`来配置平台设置。这个参数同时也会将一些不同的设置更改为对`node`环境较友好的默认值。例如，所有内置于节点（如`fs`）的包都会自动标记为外部包，因此`esbuild`不会试图去将它们打包。此设置还禁用`package.json`中`browser`字段的解释。



如果您的代码使用了在您的node版本中不起作用的较新的JavaScript语法，则需要配置node的目标版本：


```cmd
esbuild app.js --bundle --platform=node --target=node10.4
```

您可能还不想将依赖项`dependencies`与`esbuild`打包在一起。还有很多`node`独有的特性是`esbuild`打包时不支持的，例如`__dirname`、`import.meta.url`、`fs.readFileSync`和`*.node`原生二进制模块。通过将`packages`设置为`external`，可以从打包文件中排除所有依赖项：

```cmd
esbuild app.jsx --bundle --platform=node --packages=external
```
这样做的话，在运行时文件系统上必须存在这些依赖项，因为它们不包含在打包文件中。