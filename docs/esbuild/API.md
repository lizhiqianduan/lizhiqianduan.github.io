---
title: API | esbuild 中文文档
---

# API
可以通过以下三种方式之一访问API：命令行、`JavaScript`和`Go`。这三种语言的概念和参数在很大程度上是相同的，因此它们将在这里一起呈现，而不是为每种语言提供单独的文档。



`esbuild`的API中有两个主要的`API`调用：`transform`和`build`。你应该使用哪一种很重要，您应该了解清楚，因为它们的工作方式不同。



如果您正在使用`JavaScript`，请务必查看下面的`JS特定内容`信息部分。您还可以找到`esbuild`的`TypeScript`类型定义作为参考。如果您正在使用Go，请务必查看自动生成的Go文档。



如果您使用的是命令行API，了解这些标志的形式可能会有所帮助：`--foo`、`--foo=bar`或`--foo:bar`。形式`--foo`用于启用布尔标志（如`--minify`），形式`--foo=bar`用于具有单个值且仅指定一次的标志（如`--platform=`），而形式`--foo:bar`用于具有多个值且可以多次重新指定的标志（例如`--external:`）。

## Transform API
`Transform API`能在不访问文件系统的情况下对单个字符串进行操作。这使得它非常适合在没有文件系统（如浏览器）或作为其他工具链的一部分。下面是一个简单的变换：


```shell
echo 'let x: number = 1' | esbuild --loader=ts
# let x = 1;
```

如果没有提供输入文件并且`--bundle`标志不存在，命令行接口将使用此API。在这种情况下，输入字符串来自stdin，输出字符串则到达stdout。转换API可以支持以下选项：

**简单选项:**
- Define
- Format
- Loader
- Minify
- Platform
- Sourcemap
- Target

**高级选项:**
- Banner
- Charset
- Color
- Drop
- Footer
- Global name
- Ignore annotations
- JSX
- JSX dev
- JSX factory
- JSX fragment
- JSX import source
- JSX side effects
- Keep names
- Legal comments
- Log level
- Log limit
- Log override
- Mangle props
- Pure
- Source root
- Sourcefile
- Sources content
- Supported
- Tree shaking
- Tsconfig raw

## Build API
`Build API`对文件系统中的一个或多个文件进行操作。这允许文件相互引用并打包在一起。下面是简单构建的样子：



```shell
echo 'let x: number = 1' > in.ts
esbuild in.ts --outfile=out.js
cat out.js
# let x = 1;
```

如果提供了输入文件或存在`--bundle`标志，则命令行接口将使用此API。请注意，默认情况下`esbuild`不会打包。必须显式传递`--bundle`标志才能启用打包。如果未提供输入文件，则从stdin读取单个输入文件。`Build API`可以支持以下选项：

**简单选项:**
- Alias
- Analyze
- Bundle
- Define
- Entry points
- External
- Format
- Inject
- Loader
- Minify
- Outdir
- Outfile
- Packages
- Platform
- Serve
- Sourcemap
- Splitting
- Target
- Watch
- Write

**高级选项:**
- Allow overwrite
- Asset names
- Banner
- Charset
- Chunk names
- Color
- Conditions
- Drop
- Entry names
- Footer
- Global name
- Ignore annotations
- Incremental
- JSX
- JSX dev
- JSX factory
- JSX fragment
- JSX import source
- JSX side effects
- Keep names
- Legal comments
- Log level
- Log limit
- Log override
- Main fields
- Mangle props
- Metafile
- Node paths
- Out extension
- Outbase
- Preserve symlinks
- Public path
- Pure
- Resolve extensions
- Source root
- Sourcefile
- Sources content
- Stdin
- Supported
- Tree shaking
- Tsconfig
- Working directory

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