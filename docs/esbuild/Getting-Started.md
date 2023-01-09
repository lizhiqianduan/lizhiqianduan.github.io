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

## 多平台同步

您不能在一个操作系统上安装`esbuild`，在不重新安装的情况下将`node_modules`目录复制到其他操作系统，然后在该其他操作系统上运行`esbuild`。这是行不通的，因为`esbuild`是用原生代码编写的，需要安装特定平台的二进制可执行文件。通常情况下，这没什么问题，因为您通常会将`package.json`文件纳入版本控制，而不是`node_modules`目录，然后每个人在克隆存储库后都会在本地计算机上运行`npm install`。



然而，人们有时会遇到这种情况，在`Windows`或`macOS`上安装esbuild，并将`node_modules`目录复制到运行`Linux`的`Docker`映像中，或者在`Windows`和`WSL`环境之间复制`node_module`目录。这么操作要想正确运行就取决于您的包管理器了：



`npm/pnpm`：如果使用npm或pnpm进行安装，则可以在复制文件时尝试不复制`node_modules`目录，并在复制后在目标平台上运行`npm-ci`或`npm-install`。或者您可以考虑改用`Yarn`，它内置支持在多个平台上同时安装软件包。



`Yarn`：如果您使用Yarn进行安装，可以尝试使用`supportedArchitectures`功能在`.yarnrc.yml`文件中列出当前平台和其他平台。请记住，这就意味着`esbuild`的多个副本将出现在文件系统中。



您可能还会遇到另一种情况，如果您在带有`ARM`处理器的`macOS`计算机上，使用npm的ARM版本安装esbuild，然后尝试使用`Rosetta`内部运行的`x86-64`版本的`node`运行`esbuild`。在这种情况下，一个简单的解决方案是使用ARM版本的node运行代码，可以在此处下载：https://nodejs.org/en/download/.



另一种选择是使用`esbuild-wasm`打包，这在所有平台上都是一样的。但它的性能成本很高，有时会比`esbuild`打包慢10倍，因此您可能也不想这样做。


## 使用Yarn `Plug'n'Play`(PnP)

esbuild原生支持Yarn的`Plug'n'Play`包安装策略。要使用它，请确保您运行esbuild的当前工作目录包含Yarn生成的包清单JavaScript文件（`.pnp.cjs`或`.pnp.js`）。如果检测到`Yarn Plug'n'Play`包清单，esbuild将自动导入`Yarn`缓存中`.zip`文件内的包，并且将在捆绑期间自动动态提取这些文件。



因为`esbuild`是在`Go`中编写的，所以对`Yarn Plug'n'Play`的支持已经在`Go`中完全重新实现，而不是依赖`Yarn`的`JavaScript API`。这使得`Yarn Plug'n'Play`包解决方案能够与`esbuild`的并行打包很好地集成，以实现最高速度。注意，Yarn的命令行界面为每个命令增加了许多不可避免的性能开销。为了获得最大的esbuild性能，您可能需要考虑在不使用`Yarn`的`CLI`的情况下运行`esbuild`（即不使用`Yarn esbuild`）。这会让`esbuild`运行速度提高10倍。

## 其他安装方式

建议安装`esbuild`的方法是使用`npm`安装本机可执行文件。但也可以通过以下方式安装esbuild：

### 下载构建后的可执行文件

如果您有Unix系统，可以使用以下命令下载当前平台的esbuild二进制可执行文件（它将被下载到当前工作目录）：

```cmd
curl -fsSL https://esbuild.github.io/dl/v0.16.13 | sh
```
您还可以使用最新版本而不是版本号来下载esbuild的最新版本：


```cmd
curl -fsSL https://esbuild.github.io/dl/latest | sh
```

如果您不想从互联网上执行`shell`脚本以下载`esbuild`，您也可以自己从`npm`手动下载包（这就是上述shell脚本所做的全部工作）。虽然预编译的本地可执行文件是使用`npm`托管的，但实际上不需要安装npm来下载它们。npm包的`registry`是一个普通的`HTTP`服务器，包是普通的`gzip tar`文件。



以下是直接下载二进制可执行文件的示例：
```cmd
curl -O https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.16.13.tgz
tar xzf ./darwin-x64-0.16.13.tgz
./package/bin/esbuild
Usage:
  esbuild [options] [entry points]

...
```


`@esbuild/darwin-x64`包中的原生可执行文件适用于`macOS`操作系统和64位`Intel`体系结构的操作系统。截至本文撰写之时，这是esbuild支持的平台的本地可执行包的完整列表：

Package name|	OS|	Architecture|	Download
-------- | ----- | -------| -------
@esbuild/android-arm	|android|	arm| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/android-arm64	|android|	arm64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/android-x64	|android|	x64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/darwin-arm64	|darwin|	arm64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/darwin-x64	|darwin|	x64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/freebsd-arm64	|freebsd|	arm64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/freebsd-x64	|freebsd|	x64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/linux-arm	|linux|	arm| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/linux-arm64	|linux|	arm64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/linux-ia32	|linux|	ia32| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/linux-loong64	|linux|	loong642| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/linux-mips64el	|linux|	mips64el2| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/linux-ppc64	|linux|	ppc64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/linux-riscv64	|linux|	riscv642| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/linux-s390x	|linux|	s390x| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/linux-x64	|linux|	x64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/netbsd-x64	|netbsd1|	x64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/openbsd-x64	|openbsd|	x64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/sunos-x64	|sunos|	x64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/win32-arm64	|win32|	arm64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/win32-ia32	|win32|	ia32| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	
@esbuild/win32-x64	|win32|	x64| [:arrow_down:](https://esbuild.github.io/getting-started/#download-a-build)	

**为什么不建议这样做**：这种方法只适用于可以运行shell脚本的Unix系统，因为它需要Windows上的WSL。另外一个缺点是，您不能将插件与本机版本的esbuild一起使用。


如果您选择编写自己的代码来直接从npm下载esbuild，那么您将依赖`esbuild`的本地可执行安装程序的内部实现细节。这些细节可能会在某个时候发生变化，在某种情况下，这种方法将不再适用于新的esbuild版本。虽然这只是一个小缺点，但该方法对于现有的`esbuild`版本仍然可以永远使用（发布到`npm`的包是不可变的）。


### 安装WASM版本

除了`esbuild`npm包之外，还有一个`esbuild-wasm`包，其功能类似，但使用`WebAssembly`实现而不是原生代码。安装它也将安装一个名为`esbuild`的可执行文件：

```cmd
npm install --save-exact esbuild-wasm
```

**为什么不建议这样做**：`WebAssembly`版本比原生版本慢得多。在许多情况下，它慢了一个数量级（即10倍）。这是出于各种原因，包括：
- a）node在每次运行时都会从头开始重新编译`WebAssembly`代码
- b）Go的`WebAssembly`编译方法是单线程的
- c）node有`WebAssembly`bug，进程退出可能会延迟几秒
`WebAssembly`版本还排除了一些功能，例如本地文件服务器。只有在没有其他选择的情况下，例如当您希望在不受支持的平台上使用`esbuild`时，才应该像这样使用`WebAssembly`包。WebAssembly包主要用于浏览器。



### 使用`Deno`代替`node`

如果您希望将`esbuild`与`Deno JavaScript`环境一起使用，`esbulid`也对其提供了基础支持。程序包位于[https://deno.land/x/esbuild](https://deno.land/x/esbuild)，并使用了原生esbuild可执行文件。可执行文件将在运行时从`npm`下载并缓存，因此您的计算机需要网络能访问`registry.npmjs.org`才能使用此包。使用软件包如下所示：

```js
import * as esbuild from 'https://deno.land/x/esbuild@v0.16.13/mod.js'
const ts = 'let test: boolean = true'
const result = await esbuild.transform(ts, { loader: 'ts' })
console.log('result:', result)
esbuild.stop()
```


它与`esbuild`的npm包基本上具有相同的API，但有一个额外之处：完成后需要调用`stop()`，因为与node不同，Deno没有提供必要的API来允许`Deno`在`esbuild`内部子进程仍在运行时退出。



如果您希望使用`esbuild`的`WebAssembly`版本来代替`esbuild`与`Deno`的原生版本，可以通过导入`wasm.js`代替`mod.js`来实现，如下所示：


```js
import * as esbuild from 'https://deno.land/x/esbuild@v0.16.13/wasm.js'
const ts = 'let test: boolean = true'
const result = await esbuild.transform(ts, { loader: 'ts' })
console.log('result:', result)
esbuild.stop()
```

使用`WebAssembly`代替原生意味着您不需要指定`Deno`的`--allow`运行权限，而`WebAssembly`是文件系统不可用的情况下（如使用`Deno Deploy`）的唯一选择。但是，请记住，`esbuild`的`WebAssembly`版本比原生版本慢得多。关于WebAssembly的另一件事是，`Deno`目前有一个`bug`，在所有加载的`WebAssembly`模块完全优化之前，进程终止会被不必要地延迟，这可能需要几秒钟。如果您正在编写一个使用`esbuild`的`WebAssembly`实现的临时脚本，以便您的代码在合理的时间内退出，那么您可能需要在代码完成后手动调用`Deno.exit(0)`。



**不建议这样做的原因**：`Deno`比`node`更新，使用较少，支持的平台也比`node`少，因此建议将node作为运行esbuild的主要方式。Deno使用了互联网作为包系统，而不是现有的JavaScript包生态系统，esbuild是围绕npm风格的包管理而设计和优化的。您可以将esbuild与Deno一起使用，但如果您想打包`HTTP URL`，则需要一个插件。


### 从源码构建

要从源生成`esbuild`，请执行以下操作：


1. 安装Go编译器：

https://go.dev/dl/



2. 下载esbuild的源代码：

```cmd
git clone --depth 1 --branch v0.16.13 https://github.com/evanw/esbuild.git
cd esbuild
```

3. 构建esbuild可执行文件（在Windows上为esbuild.exe）：

```cmd
go build ./cmd/esbuild
```

如果要为其他平台构建，只需在build命令前面加上平台信息即可。例如，可以使用以下命令构建32位Linux版本：

```cmd
GOOS=linux GOARCH=386 go build ./cmd/esbuild
```


**不建议这样做的原因**：原生版本只能通过命令行界面使用，对于复杂的用例来说，这是很耗费时间的，并且不支持插件。您需要编写JavaScript或Go代码，并使用esbuild的API来使用插件。
