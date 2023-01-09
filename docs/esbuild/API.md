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
### Alias
*Supported by: Build*
此功能允许您在打包时用一个包替换另一个包。以下示例将包`oldpkg`替换为包`newpkg`：

```cmd
esbuild app.js --bundle --alias:oldpkg=newpkg
```

这些替换首先会发生在`esbuild`所有的路径解析逻辑之前。此功能的一个使用场景是使用浏览器兼容包替换仅Node环境可使用的包，从而替换那些您无法控制的第三方代码，。

请注意，当使用`Alias`替换导入路径时，生成的导入路径将在工作目录中解析，而不是在包含具有导入路径的源文件的目录中解析。如果需要，可以使用`Working directory`功能设置`esbuild`所使用的工作目录。


### Analyze
*Supported by: Build*

*如果您正在寻找交互式可视化，请尝试esbuild的Bundle Size Analyzer。您可以上传esbuild元文件以查看打包大小明细。*

使用`Analyze`功能可以生成一份易于阅读的关于打包内容的报告：

```cmd
$ esbuild --bundle example.jsx --outfile=out.js --minify --analyze
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
```cmd
$ esbuild --bundle example.jsx --outfile=out.js --minify --analyze=verbose
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

### Bundle
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


