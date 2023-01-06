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

您的build命令将重复运行，因此您需要将其自动化。一种自然的方法是将构建脚本添加到package.json文件中，如下所示：



{

“脚本”：{

“build”：“esbuild app.jsx--bundle--outfile=out.js”

}

}

请注意，这直接使用esbuild命令，而没有相对路径。这是因为脚本部分中的所有内容都是使用路径中已经存在的esbuild命令运行的（只要您安装了包）。



构建脚本可以这样调用：



npm运行构建

但是，如果您需要将许多选项传递给esbuild，那么使用命令行界面可能会变得非常困难。对于更复杂的用途，您可能希望使用esbuild的JavaScript API以JavaScript编写构建脚本。这可能看起来像这样：



require（'esbuild'）.build({

入口点：['app.jsx']，

束：真，

outfile:'out.js'，

}).catch（（）=>process.ext（1））

build函数在子进程中运行esbuild可执行文件，并返回一个promise，该promise在生成完成时解析。上面的代码不会打印出捕获到的异常，因为默认情况下，异常中的任何错误消息也会打印到控制台（尽管如果您愿意，可以更改日志级别以关闭它）。



虽然也有一个非异步的buildSync API，但异步API对于构建脚本更好，因为插件只能与异步API一起工作。您可以在API文档中阅读有关构建API的配置选项的更多信息。