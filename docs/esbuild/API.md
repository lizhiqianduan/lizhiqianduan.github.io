---
title: API | esbuild 中文文档
---

# API
可以通过以下三种方式访问API：命令行、`JavaScript`和`Go`。这三种语言的概念和参数在很大程度上是相同的，因此它们将在这里一起呈现，而不是为每种语言提供单独的文档。


**CLI**：如果您使用的是命令行API，了解这些标志的形式可能会有所帮助：`--foo`、`--foo=bar`或`--foo:bar`。形式`--foo`用于启用布尔标志（如`--minify`），形式`--foo=bar`用于具有单个值且仅指定一次的标志（如`--platform=`），而形式`--foo:bar`用于具有多个值且可以多次重新指定的标志（例如`--external:`）。

**JavaScript**：如果您正在使用`JavaScript`，请务必查看下面的`JS API特殊细节`信息部分。您还可以找到`esbuild`的`TypeScript`类型定义作为参考。如果您正在使用Go，请务必查看自动生成的Go文档。

**Go**：如果您正在使用Go，您可能会发现为esbuild自动生成的Go文档作为参考很有用。这两个公共Go软件包都有单独的文档：`pkg/api`和`pkg/cli`。


# 概述 Overview
`esbuild`的API中有两个主要的`API`调用：`transform`和`build`。你应该使用哪一种很重要，您应该了解清楚，因为它们的工作方式不同。


## Build
这是esbuild的主要接口。通常会传递一个或多个入口点文件和各种选项进行处理，然后esbuild将结果写回文件系统。下面是一个简单的示例，它支持与输出目录绑定：


```
esbuild app.ts--bundle--outdir=dist
```

构建API的高级使用涉及设置长时间运行的构建上下文。此上下文在JS和Go中是一个显式对象，但在CLI中是隐式的。使用给定上下文完成的所有构建都共享相同的构建选项，并且后续构建是增量完成的（即，它们重用以前构建的一些工作以提高性能）。这对开发很有用，因为esbuild可以在您工作时在后台为您重建应用程序。

有三种不同形式的增量构建API：

- `监视模式（Watch mode）`告诉`esbuild`监视文件系统，并在您编辑和保存可能使生成无效的文件时自动为您重新生成。以下是一个示例：

```shell
esbuild app.ts --bundle --outdir=dist --watch
[watch] build finished, watching for changes...
```

- `服务模式（Serve mode）`会启动一个本地开发服务器，该服务器提供最新构建的结果。传入的请求会自动启动新的构建，因此当您在浏览器中重新加载页面时，您的web应用程序始终是最新的。以下是一个示例：


```shell
esbuild app.ts --bundle --outdir=dist --serve

 > Local:   http://127.0.0.1:8000/
 > Network: http://192.168.0.1:8000/

127.0.0.1:61302 - "GET /" 200 [1ms]
```

- `重构建模式（rebuild mode）`允许你可以手动调用构建。这在将esbuild与其他工具集成时非常有用（例如，使用自定义文件观察程序或开发服务器，而不是esbuild的内置服务器）。以下是一个示例：

```js
let ctx = await esbuild.context({
  entryPoints: ['app.ts'],
  bundle: true,
  outdir: 'dist',
})

for (let i = 0; i < 5; i++) {
  let result = await ctx.rebuild()
}
```

这三个增量构建API可以组合在一起。要启用实时重新加载（在编辑和保存文件时自动重新加载页面），您需要在同一上下文中启用监视和服务。

处理完上下文对象后，可以在上下文上调用`dispose（）`以等待现有构建完成，停止监视和/或服务模式，并释放资源。



## Transform
`Transform API`能在不访问文件系统的情况下对单个字符串进行操作。这使得它非常适合在没有文件系统（如浏览器）或作为其他工具链的一部分。下面是一个简单的变换：


```shell
echo 'let x: number = 1' | esbuild --loader=ts
# let x = 1;
```

对于某些场景来说，使用字符串而不是文件作为输入更符合人们感官。文件系统隔离有一定的优点（例如，在浏览器中工作，不受附近`package.json`文件的影响），也有一定的缺点（例如，不能与bundling或插件一起使用）。如果您的场景不适合`Transform API`，那么您应该使用更通用的`Build API`。

## JS API的特殊细节（JS-specific details）

适用于`esbuild`的`JS API`有异步和同步两种风格。推荐使用异步API，因为它适用于所有环境，而且速度更快、功能更强大。同步API只在`Nodejs`中工作，并且只能做某些事情，但有时在特定的情况下是必要的。详细说明：

**异步API（Async API）**

异步API使用promise作为返回结果。请注意，由于使用了`import`和顶级`await`关键字，您可能不得不在`node`中使用`.mjs`文件扩展名：

```js
import * as esbuild from 'esbuild'

let result1 = await esbuild.transform(code, options)
let result2 = await esbuild.build(options)
```

优点：

- 您可以使用带有异步API的插件

- 当前线程未被阻止，因此您可以在此期间执行其他工作

- 您可以同时运行多个`esbuild API`，然后将这些调用分布在所有可用的`CPU`中，以获得最大性能

缺点：

- 使用`promise`可能会导致代码更加混乱，尤其是在`CommonJS`中，顶级`await`不可用

- 在必须同步的情况下不起作用，例如在`require.extensions`中


**同步API（Sync API）**

同步API的调用是直接在行内就返回结果了：

```js
let esbuild = require('esbuild')

let result1 = esbuild.transformSync(code, options)
let result2 = esbuild.buildSync(options)
```


优点：

- 避免`promise`可能会有更干净的代码，尤其是在顶级`await`不可用的情况下

- 在必须同步的情况下工作，例如在`require.extensions`中

缺点：

- 您不能将插件与同步API一起使用，因为插件是异步的

- 它会阻塞当前线程，因此在此期间无法执行其他工作

- 使用同步API会阻止esbuild并行调用


## 在浏览器中使用（In the browser）

`esbuild API`也可以使用`Web Worker`中的`WebAssembly`在浏览器中运行。要利用这一点，您需要安装`esbuild-wasm`包，而不是`esbuild`包：

```
npm install esbuild-wasm
```

浏览器`API`类似于`Node`的`API`，只是您需要首先调用`initialize()`，并且需要传递`WebAssembly`二进制文件的`URL`。`API`的同步版本也不可用。假设你使用的是`bundler`，它看起来是这样的：

```js
import * as esbuild from 'esbuild-wasm'

await esbuild.initialize({
  wasmURL: './node_modules/esbuild-wasm/esbuild.wasm',
})

let result1 = await esbuild.transform(code, options)
let result2 = esbuild.build(options)
```

如果您已经从`worker`运行此代码，并且不希望`initialize`创建另一个工作线程，则可以将`worker:false`传递给它。然后它将在与调用`initialize`的线程相同的线程中创建`WebAssembly`模块。

您还可以在`HTML`文件中的`script`标签中使用`esbuild`的`API`，而无需通过加载带有`＜script＞`标记的`lib/browser.min.js`文件来使用打包工具。在这种情况下，`API`创建了一个名为`esbuild`的全局变量，该全局变量保存了`API`对象：

```js
<script src="./node_modules/esbuild-wasm/lib/browser.min.js"></script>
<script>
  esbuild.initialize({
    wasmURL: './node_modules/esbuild-wasm/esbuild.wasm',
  }).then(() => {
    ...
  })
</script>
```

如果要将此API与`ECMAScript`模块一起使用，则你应该导入`esm/browser.min.js`文件：

```js
<script type="module">
  import * as esbuild from './node_modules/esbuild-wasm/esm/browser.min.js'

  await esbuild.initialize({
    wasmURL: './node_modules/esbuild-wasm/esbuild.wasm',
  })

  // ...
</script>
```

## 简单选项
### 别名 Alias
*Supported by: Build*

此功能允许您在打包时用一个包替换另一个包。以下示例将包`oldpkg`替换为包`newpkg`：

```cmd
esbuild app.js --bundle --alias:oldpkg=newpkg
```

这些替换首先会发生在`esbuild`所有的路径解析逻辑之前。此功能的一个使用场景是使用浏览器兼容包替换仅Node环境可使用的包，从而替换那些您无法控制的第三方代码，。

请注意，当使用`Alias`替换导入路径时，生成的导入路径将在工作目录中解析，而不是在包含具有导入路径的源文件的目录中解析。如果需要，可以使用`Working directory`功能设置`esbuild`所使用的工作目录。


### 报告 Analyze
*Supported by: Build*

*如果您正在寻找交互式可视化，请尝试esbuild的Bundle Size Analyzer。您可以上传esbuild元文件以查看打包大小明细。*

使用`Analyze`功能可以生成一份易于阅读的关于打包内容的报告：

```shell
esbuild --bundle example.jsx --outfile=out.js --minify --analyze
out.js                                                                    27.6kb  100.0%
   ├ node_modules/react-dom/cjs/react-dom-server.browser.production.min.js  19.2kb   69.8%
   ├ node_modules/react/cjs/react.production.min.js                          5.9kb   21.4%
   ├ node_modules/object-assign/index.js                                     962b     3.4%
   ├ example.jsx                                                             137b     0.5%
   ├ node_modules/react-dom/server.browser.js                                 50b     0.2%
   └ node_modules/react/index.js                                              50b     0.2%

...
```

该信息显示了每个`输出文件`打包的`输入文件`，以及它们最终占用的`输出文件`的百分比。如果您需要更多信息，可以启用`verbose`模式。这会显示从入口点到每个输入文件的导入路径，告诉您为什么给定的输入文件包含在打包文件中：
```shell
esbuild --bundle example.jsx --outfile=out.js --minify --analyze=verbose
out.js ─────────────────────────────────────────────────────────────────── 27.6kb ─ 100.0%
   ├ node_modules/react-dom/cjs/react-dom-server.browser.production.min.js ─ 19.2kb ── 69.8%
   │  └ node_modules/react-dom/server.browser.js
   │     └ example.jsx
   ├ node_modules/react/cjs/react.production.min.js ───────────────────────── 5.9kb ── 21.4%
   │  └ node_modules/react/index.js
   │     └ example.jsx
   ├ node_modules/object-assign/index.js ──────────────────────────────────── 962b ──── 3.4%
   │  └ node_modules/react-dom/cjs/react-dom-server.browser.production.min.js
   │     └ node_modules/react-dom/server.browser.js
   │        └ example.jsx
   ├ example.jsx ──────────────────────────────────────────────────────────── 137b ──── 0.5%
   ├ node_modules/react-dom/server.browser.js ──────────────────────────────── 50b ──── 0.2%
   │  └ example.jsx
   └ node_modules/react/index.js ───────────────────────────────────────────── 50b ──── 0.2%
      └ example.jsx

...
```
上述分析只包含`metafile`文件中可以找到的信息的可视化。如果此分析不完全符合您的需求，欢迎您使用`metafile`中的信息构建自己的可视化。



请注意，此格式化的分析结果适用于人类，而非机器。特定的格式可能会随着时间的推移而改变，这可能会破坏任何试图解析它的工具。您不应该编写工具来解析此数据。您应该使用`JSON`元数据文件中的信息。此可视化中的所有内容都源自`metafile`中的`JSON`元数据，这样您就不会因为不解析`esbuild`的格式化分析结果而丢失任何信息。

### 打包 Bundle
*Supported by: Build*

打包文件意味着将任何导入的依赖项内联到文件本身中。此过程是递归的，因此依赖项的依赖项（等等）也将被内联。默认情况下，`esbuild`不会打包输入文件。打包必须显式启用，如下所示：

```cmd
esbuild in.js --bundle
```
请参阅入门指南，了解正式代码打包的示例。



请注意，打包不同于文件拼接。传递给`esbuild`多个需要打包的输入文件将生成多个单独的打包文件，而不是将输入文件拼接在一起。要使用`esbuild`将一组文件拼接在一起，请将它们全部导入到一个入口文件中，并将这个入口文件传递给`esuild`打包。



#### 不可解析的导入 Non-analyzable imports

使用`esbuild`打包仅适用于静态定义的导入（即，当导入路径是字符串文本时）。在运行时定义的导入（即依赖于运行时`run-time`代码求值的导入）不会被打包，因为打包是编译时`compile-time`操作。例如：


```js
// 可解析的导入 (将被esbuild打包)
import 'pkg';
import('pkg');
require('pkg');

// 不可解析的导入 (不会被esbuild打包)
import(`pkg/${foo}`);
require(`pkg/${foo}`);
['pkg'].map(require);
```

解决此问题的方法是将包含此问题代码的包标记为外部包`external`，以便它不包含在打包文件中。然后，您需要确保在运行时，打包后的代码可以访问到这个外部包的副本。


一些打包工具（如Webpack）试图通过在打包过程中包含所有可能访问到的文件，然后在运行时模拟文件系统来支持这一点。但是，运行时文件系统仿真超出了范围，不会在esbuild中实现。如果您确实需要打包时实现这一点，则可能需要使用另一个打包器而不是`esbuild`。


### 预定义 Define
*Supported by: Transform | Build*


此功能提供了一种用常量表达式替换全局标识符的方法。这可以是一种在构建之间更改某些代码的行为而不更改代码本身的方法：

```shell
echo 'hooks = DEBUG && require("hooks")' | esbuild --define:DEBUG=true
# 结果=> hooks = require("hooks");
echo 'hooks = DEBUG && require("hooks")' | esbuild --define:DEBUG=false
# 结果=> hooks = false;
```

替换的表达式必须是`JSON`对象（`null、boolean、number、string、array或object`）或单个标识符。数组和对象以外的表达式替换是被内联替换的，这意味着它们可以参与常量折叠`constant folding`。数组和对象替换则是存储在变量中，然后使用标识符引用，而不是内联替换，这避免了替换值的重复副本，但意味着值不参与常量折叠。



如果要用字符串文字替换某个内容，请记住传递给esbuild的替换值本身必须包含引号。省略引号表示替换值是标识符：



```shell
echo 'id, str' | esbuild --define:id=text --define:str=\"text\"
# 结果=> text, "text";
```

如果您使用的是CLI，请记住，不同的shell对于如何转义双引号字符有不同的规则（当替换值为字符串时，这是必要的）。使用`\“`反斜杠转义，因为它在`bash`和`Windows`命令提示符中都有效。其他在`bash`中有效的双引号转义方法（如用单引号包围它们）在`Windows`上不起作用，因为`Windows`命令提示符不会删除单引号。这在从`package.json`文件中的`npm脚本`使用`CLI`时很重要，大家都希望该脚本在所有平台上都能使用:


```json
{
  "scripts": {
    "build": "esbuild --define:process.env.NODE_ENV=\\\"production\\\" app.js"
  }
}
```

如果您仍然遇到不同`shell`的跨平台引号转义问题，您可能希望改用`JavaScriptAPI`。这样的话，您就可以使用常规JavaScript语法来消除跨平台的差异。

### 入口点 Entry points

*Supported by: Build*


入口是一个文件数组，每个文件都用作打包算法的输入。它们被称为“入口点”，是因为每一个入口都被当做`初始脚本`来执行，然后加载它所包含的所有其他代码。您可以使用`import`语句将它们导入到您的入口点（或导入另一个文件，然后导入到您的入口），而不是在页面中加载带有`＜script＞`标记的许多库。



简单的应用程序只需要一个入口点，但如果存在多个逻辑上独立的代码组（如主线程和工作线程），或者应用程序具有独立的模块（如登录页、编辑器页和设置页），则额外的入口点可能很有用。单独的入口点有助于引入关注点分离，并有助于减少浏览器需要下载的不必要代码量。如果应用程序支持的话，启用代码拆分`code splitting`可以在浏览到第二页时进一步减小下载大小，第二页的入口点与已经访问的第一页共享一些已经下载的代码。



指定入口点的简单方法是只传递文件路径数组：


```cmd
esbuild home.ts settings.ts --bundle --outdir=out
```
这将生成两个输出文件`out/home.js`和`out/settings.js`，对应于两个入口点`home.ts`和`settings.ts`。



为了进一步控制如何从相应的入口点，打包后其对应的输出文件路径，您应该查看以下选项：

- `Entry names`
- `Out extension`
- `Outbase`
- `Outdir`
- `Outfile`

此外，还可以使用其他入口点语法为每个入口点指定完全自定义的打包输出路径：


```cmd
esbuild out1=home.ts out2=settings.ts --bundle --outdir=out
```
这将生成两个输出文件`out/out1.js`和`out/out2.js`，对应于两个入口点`home.ts`和`settings.ts`。

### 外部包 External

*Supported by: Build*



可以将文件或包标记为外部，以将其从构建任务中排除。导入不会被打包，而是被保留（对`iife`和`cjs`格式使用`require`，对`esm`格式使用`import`），并将在运行时被执行。



这个配置有几个用途。首先，它可以用于从打包文件中删除不必要的代码，这些代码是您知道的，永远不会执行的代码。例如，一个`package`可能包含仅能在`nodejs`中运行的代码，但您的目标环境是浏览器。它还可以用于在运行时从无法打包的包中导入`nodejs`代码。例如，`fsevents`包含`esbuild`不支持的本机扩展。将某物标记为外部包的示例如下：


```shell
echo 'require("fsevents")' > app.js
esbuild app.js --bundle --external:fsevents --platform=node
```
```js
// 输出=> app.js
require("fsevents");
```
您还可以在外部路径中使用`*`通配符，将匹配该模式的所有文件标记为外部文件。例如，可以使用`*.png`删除所有`.png`文件，或使用`/images/*`删除以`/images/`开头的所有路径：


```shell
esbuild app.js --bundle "--external:*.png" "--external:/images/*"
```

外部路径在路径解析之前和之后都会应用，这使您可以根据源代码中的导入路径和绝对文件系统路径进行匹配。如果外部路径在下面两种情况下都匹配，则该路径被视为外部路径。具体行为如下：



- 在路径解析开始之前，将对所有外部路径`external`和导入路径进行检查比对。此外，如果外部路径看起来像包路径（即不以`/`或`./`或`../`开头），则会检查导入路径，查看它们是否将该包路径作为路径前缀。



这意味着`--external:@foo/bar`与`--external:@foo/bar/*`表示一个意思，它与导入路径`@foo/bar/baz`能匹配上。因此，`external`也将`@foo/bar`包内的所有路径标记为外部路径。



- 在路径解析结束后，将针对所有看起来不像包路径的外部路径（即以`/`或`./`或`../`开头的路径）与解析后的绝对路径进行检查比对。但在检查之前，外部路径将与当前工作目录拼接，然后进行标准化，最终生成绝对路径（即使它包含`*`通配符）。



这意味着您可以使用`--external:./dir/*`将目录`dir`中的所有内容标记为`external`。注意，前缀`./`很重要。如果不做么写，使用`--external:dir/*`将被视为包路径，在路径解析结束后不会再进行检查比对。


### 输出格式 Format

*Supported by: Transform | Build*



这将设置生成的JavaScript文件的输出格式。目前有三个可能的值可以配置：`iife`、`cjs`和`esm`。当未指定输出格式时，如果启用了打包（按下面这几种方式），esbuild将为您选择输出格式，如果禁用了打包，则`esbuild`不执行任何格式转换。


#### iife

`iife`格式表示“立即执行的函数表达式”，旨在在浏览器中运行。将代码包装在函数表达式中可以确保代码中的任何变量不会意外地与全局范围中的变量冲突。如果入口文件需要在浏览器中暴露全局变量，则可以使用`全局名称global name`来配置该全局变量的名称。当未指定输出格式、启用打包并且`platform`设置为`browser`（默认情况下为浏览器）时，`iife`格式将自动启用。指定`iife`格式如下所示：



```cmd
$ echo 'alert("test")' | esbuild --format=iife
(() => {
  alert("test");
})();

```

#### CommonJS

`cjs`格式代表`CommonJS`，旨在在Node中运行。它假定环境包含`exports`、`require`和`module`。`ECMAScript`模块语法中具有导出的入口点将被转换为一个模块，每个导出名称的`exports`上都有一个`getter`函数。当未指定输出格式、启用打包并将`platform`设置为`node`时，`cjs`格式将自动启用。指定`cjs`格式如下所示：


```cmd
$ echo 'export default "test"' | esbuild --format=cjs
...
var stdin_exports = {};
__export(stdin_exports, {
  default: () => stdin_default
});
module.exports = __toCommonJS(stdin_exports);
var stdin_default = "test";
```

#### ESM

`esm`格式代表`ECMAScript模块`。它假定环境支持导入和导出语法。以`CommonJS`模块语法导出的入口文件将转换为`module.exports`且只有一个`default`值的导出。当未指定输出格式、启用打包且`platform`设置为`neutral`时，将自动启用`esm`格式。指定`esm`格式如下所示：


```cmd
$ echo 'module.exports = "test"' | esbuild --format=esm
...
var require_stdin = __commonJS({
  "<stdin>"(exports, module) {
    module.exports = "test";
  }
});
export default require_stdin();
```

esm格式既可以在浏览器中使用，也可以在`node`中使用，但必须将其作为模块显式加载。如果从另一个模块导入，则会自动将其视为模块加载。否则：



- 在浏览器中，可以使用`<script src="file.js" type="module"></script>`来加载`esm`模块。



- 在node中，您可以使用`node --experimental-modules file.mjs`来加载`esm`模块。请注意，除非您在`package.json`文件中配置了`"type"："module"`，否则`node`需要`.mjs`扩展名才能加载`esm`模块。可以使用`esbuild`中的`输出扩展名out extension`来自定义`esbuild`生成文件的扩展名。您可以在[此处](https://nodejs.org/api/esm.html)阅读有关在`node`中使用`ECMAScript`模块的更多信息。

### 注入 Inject
*Supported by: Build*

此选项允许您自动将全局变量替换为另一个文件的导入。这可能是一个有用的工具，它可以使您无法控制的代码适配新的环境。例如，假设您有一个名为`process-shim.js`的文件，该文件导出一个变量`process`：

```js
// process-shim.js
export let process = {
  cwd: () => ''
}
```
```js
// entry.js
console.log(process.cwd())
```

这是为了替换`node`的`process.cwd()`函数的用法，以防止调用它的包在浏览器中运行时崩溃。您可以使用注入功能将全局标识符`process`的所有调用的地方替换为对该文件的导入：


```cmd
esbuild entry.js --bundle --inject:./process-shim.js --outfile=out.js
```

结果如下：

```js
// out.js
let process = {cwd: () => ""};
console.log(process.cwd());
```

#### 将inject与define一起使用

您还可以将此功能与`define`功能相结合，以便对导入内容进行更为针对性的选择。例如：


```js
// process-shim.js
export function dummy_process_cwd() {
  return ''
}
```

```js
// entry.js
console.log(process.cwd())
```

您可以使用`define`特性将`process.cwd`映射到`dummy_process_cwd`，然后使用`inject`特性从`process-shim.js`注入`dummy_proc_cwd`：


```cmd
esbuild entry.js --bundle --define:process.cwd=dummy_process_cwd --inject:./process-shim.js --outfile=out.js
```

这将产生以下输出：

```js
// out.js
function dummy_process_cwd() {
  return "";
}
console.log(dummy_process_cwd());
```

#### 自动导入JSX

您可以使用注入功能自动为`JSX`表达式提供实现。例如，您可以自动导入`react`包以提供`react.createElement`等函数。有关详细信息，请参阅[JSX文档](https://esbuild.github.io/content-types/#auto-import-for-jsx)。



#### 没有导入的注入文件

您也可以对没有导出的文件使用此功能。在这种情况下，注入的文件只能在其他文件导入之前出现，就像每个输入文件都包含`import "./file.js"`一样。由于ECMAScript模块的工作方式，这种注入仍然是“卫生的”，因为不同文件中同名的符号会被重命名，这样它们就不会相互冲突。

>译者注：此模块的文档，原文可能有错。
>标题为`without imports`，下面解释为`without exports`，根据使用来看，应该是`without exports`  :point_right:[去看原文](https://esbuild.github.io/api/#injecting-files-without-imports)



#### 有条件地注入文件

如果希望仅在`export`实际被使用时才有条件地导入文件，则应将注入的文件标记为没有副作用，方法是将其放入包中，并在该包的`package.json`文件中添加`“sideEffects”：false`。此设置是`Webpack`中的一个规定，`esbuild`中适用于任何导入的文件，而不仅仅是与`inject`一起使用的文件。


### 加载器 Loader
*Supported by: Transform | Build*

此选项可更改给定输入文件的解析方式。例如，`js loader`将文件解释为`JavaScript`，`css loader`将该文件解释为`css`。有关所有内置加载器的完整列表，请参阅[内容类型](./Content-Types.md)页面。



为给定的文件类型配置加载器后，允许您使用`import`语句或`require`加载该文件类型。例如，将`.png`文件扩展名配置为使用`data URL`加载器意味着导入`.png`文件将为您提供包含该图像内容的数据URL：


```js
import url from './example.png'
let image = new Image
image.src = url
document.body.appendChild(image)

import svg from './example.svg'
let doc = new DOMParser().parseFromString(svg, 'application/xml')
let node = document.importNode(doc.documentElement, true)
document.body.appendChild(node)
```

以上代码可以使用构建API进行打包，如下所示：

```cmd
esbuild app.js --bundle --loader:.png=dataurl --loader:.svg=text
```

如果使用来自`stdin`的输入的`构建API`，则该选项的指定方式不同，因为`stdin`没有文件扩展名。使用`构建API`配置一个`stdin`加载器的示例如下：


```cmd
echo 'import pkg = require("./pkg")' | esbuild --loader=ts --bundle
```

转换API`transform`只需要一个加载器，因为它不涉及与文件系统的交互，因此不处理文件扩展名。为`转换API`配置加载器（在本例中为ts加载器）如下所示：


```cmd
$ echo 'let x: number = 1' | esbuild --loader=ts
let x = 1;
```

### 代码压缩 Minify
*Supported by: Transform | Build*

启用后，生成的代码将被压缩，而不是漂亮的打印。压缩后的代码功能通常是与非精简代码一样的，但更小，这意味着它下载速度更快，但更难调试。通常，您在生产中需要压缩代码，而不是在开发中。



在`esbuild`中启用压缩示例如下：



```
$ echo 'fn = obj => { return obj.x }' | esbuild --minify
fn=n=>n.x;
```

这个选项结合起来做了三件不同的事情：删除空格，重写语法以使其更紧凑，并重命名局部变量以使其更短。通常，您希望执行所有这些压缩操作，但如果需要，也可以单独启用这些选项：

```cmd
$ echo 'fn = obj => { return obj.x }' | esbuild --minify-whitespace
fn=obj=>{return obj.x};

$ echo 'fn = obj => { return obj.x }' | esbuild --minify-identifiers
fn = (n) => {
  return n.x;
};

$ echo 'fn = obj => { return obj.x }' | esbuild --minify-syntax
fn = (obj) => obj.x;
```

这些相同的概念也适用于`CSS`，而不仅限于`JavaScript`：



```cmd
$ echo 'div { color: yellow }' | esbuild --loader=css --minify
div{color:#ff0}
```


`esbuild`中的`JavaScript`压缩算法通常生成的输出非常接近行业标准`JavaScript`压缩工具的输出大小。[这里](https://github.com/privatenumber/minification-benchmarks/tree/cd3e5acb8d38da5f86426d44ac95974812559683#readme)有一个不同压缩工具之间输出大小的示例比较。虽然`esbuild`在所有情况下都不是最佳的`JavaScript`压缩工具（也不是试图做到这一点），但它努力在大多数代码专业压缩工具百分之几之内的大小，当然也比其他工具快得多。



#### 注意事项

使用`esbuild`作为压缩工具时，以下是要记住的一些事项：



- 当启用缩小时，您可能还应该设置目标选项`target`。默认情况下，`esbuild`利用现代`JavaScript`特性使代码更小。例如，`a === undefined || a === null ? 1 : a`可以缩小为`a ?? 1`。如果不希望`esbuild`在缩小时利用现代`JavaScript`功能，则应使用较旧的语言目标`target`，例如`--target=es6`。



- 字符转义序列`\n`将替换为`JavaScript`模板文本中的换行符。如果`target`支持字符串文字，则字符串文字也将转换为模板文字，因为这样做将获得较小的输出。这不是一个bug。压缩意味着您需要更小的输出，转义序列需要两个字节，而换行符只需要一个字节。



- 默认情况下，`esbuild`不会缩小顶级声明的名称。这是因为`esbuild`不知道您将如何处理这些输出。您可能正在将压缩后的代码注入到其他代码的中间，在这种情况下，压缩顶级声明的名称是不安全的。设置输出格式`format`（或启用打包，如果尚未设置输出格式，启用打包后会为您自动选择）会告诉`esbuild`输出将在其自身范围内运行，这意味着可以安全地压缩顶级声明的名称。


- 对于所有JavaScript代码的可以100%的说，代码压缩是不安全的。这对于`esbuild`以及其他流行的`JavaScript`压缩插件（如`terser`）都是如此。特别是，`esbuild`的设计不会保留函数调用`.toString()`后的值。这样做的原因是，所有函数中的所有代码都必须逐字保留，那么压缩几乎不会有任何作用，而且实际上是无用的。然而，这意味着依赖`.toString()`返回值的`JavaScript`代码在压缩时可能会中断。例如，由于`AngularJS`使用了`.toString()`读取函数的参数名，所以当代码被压缩时，`AngularJS`框架中的某些模式会中断。解决方法是改用显式注释`explicit annotations`。



- 默认情况下，`esbuild`不会在函数和类对象上保留`.name`的值。这是因为大多数代码不依赖此属性，使用较短的名称是一个重要的大小优化。但是，有些代码确实依赖`.name`属性进行注册和绑定。如果需要依赖此选项，则应启用保留名称选项`keep names`。



- 使用某些`JavaScript`功能可以禁用`esbuild`的许多优化，包括代码压缩。具体来说，使用直接`eval`或`with语句`可以防止`esbuild`将标识符重命名为较小的名称，因为这些特性会让标识符打包到运行时而不是编译时。这虽然总是无意发生的，因为人们没察觉到直接调用`evel`计算了什么，以及为什么它不好。

如果您正在考虑编写这样的代码：
```js
// Direct eval (will disable minification for the whole file)
let result = eval(something)
```
您可能应该改为下面这样编写代码，以便可以压缩代码：
```js
// Indirect eval (has no effect on the surrounding code)
let result = (0, eval)(something)
```
[这里](https://esbuild.github.io/content-types/#direct-eval)有更多关于直接求值的结果和可用替代方案的信息。

- esbuild中的压缩算法尚未进行高级优化。特别是，以下对于JavaScript的代码优化是可能的，但esbuild还尚未完成（不是详细的列表）：

- Dead-code elimination within function bodies
- Function inlining
- Cross-statement constant propagation
- Object shape modeling
- Allocation sinking
- Method devirtualization
- Symbolic execution
- JSX expression hoisting
- TypeScript enum detection and inlining

如果您的代码使用的模式需要某些形式的代码优化才能打包，或者如果您正在为您的用例搜索最佳的JavaScript压缩算法，则应考虑使用其他工具。一些实现了这些高级代码优化的工具示例包括`Terser`和`Google Closure Compiler`。

### 输出目录 Outdir
*Supported by: Build*

此选项设置生成文件的输出目录。例如，下面命令将生成一个名为out的目录：


```cmd
esbuild app.js --bundle --outdir=out
```

如果输出目录不存在，将创建该目录，如果它已经包含了一些文件，则不会清空该目录。任何生成的文件都将自动覆盖同名的现有文件。如果希望输出目录仅包含当前运行的`esbuild`输出的文件，则应在运行`esbuild`之前自行清空输出目录。



如果您的构建在不同的目录中包含多个入口点，则目录结构将从所有输入入口点路径中最低的公共祖先目录`lowest common ancestor`开始复制到输出目录中。例如，如果有两个入口点`src/home/index.ts`和`src/about/index.ts`，则输出目录将包含`home/index.js`和`about/index.js`。如果要自定义此行为，应更改配置`outbase directory`。

### 输出文件 Outfile
*Supported by: Build*

此选项设置构建后的输出文件名。这仅适用于只有一个入口点的情况。如果有多个入口点，则必须使用`outdir`选项来指定输出目录。使用`outfile`如下所示：


```cmd
esbuild app.js --bundle --outfile=out.js
```

### 依赖包 Packages
*Supported by: Build*

使用此设置可以从打包文件中排除包的所有依赖项。这在打包`node`时非常有用，因为许多`npm`包使用了`node`特定的功能，但`esbuild`在打包时是不支持（例如`__dirname`、`import.meta.url`、`fs.readFileSync`和`*.node`本机二进制模块）。使用这个配置看起来像这样：



```cmd
esbuild app.js --bundle --packages=external
```

启用此选项会自动将所有看起来像`npm`包的导入路径（即不以`.`或`..`路径开头且不是绝对路径）标记为外部路径。它与手动将每个依赖项传递到`external`选项具有相同的效果，但更简洁。如果要自定义哪些依赖项是外部的，哪些不是外部的，那么应该使用`external`进行设置。



请注意，此设置仅在启用打包时有效。还请注意，将导入路径标记为外部路径发生在导入路径被所有配置的别名`aliases`重写之后，因此使用此设置时，别名功能`aliases`仍然有效。


### 平台 Platform
*Supported by: Transform | Build*

默认情况下，esbuild的bundler被配置为生成用于浏览器的代码。如果打包代码打算在`node`中运行，则应将平台设置为`node`：


```
esbuild app.js --bundle --platform=node
```

当平台设置为浏览器`broswer`（默认值）时：



- 启用打包时，默认输出格式设置为`iife`，它将生成的`JavaScript`代码包裹在一个立即执行的函数表达式中，以防止变量泄漏到全局范围中。



- 如果一个包在其`package.json`文件中为`browser`字段指定了映射，`esbuild`将使用该映射以浏览器友好的版本替换特定的文件或模块。例如，一个包可能使用`path-browserify`替换`path`。



- `main`字段可设置为`browser`、`module`、`main`，有一些额外的特殊行为：如果包提供了`module`和`main`入口点，但不是`browser`入口点，则如果使用`require()`导入包，则使用`main`而不是`module`。这种方式提高了导出函数与`CommonJS`模块（通过将函数分配给`module.exports`）的兼容性。如果要禁用此额外的特殊行为，可以将`main`字段显式设置为`browser、module、main`。


todo...
