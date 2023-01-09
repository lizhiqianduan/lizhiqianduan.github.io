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