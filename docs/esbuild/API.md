# API
可以通过以下三种方式之一访问API：命令行、`JavaScript`和`Go`。这三种语言的概念和参数在很大程度上是相同的，因此它们将在这里一起呈现，而不是为每种语言提供单独的文档。



`esbuild`的API中有两个主要的`API`调用：`transform`和`build`。你应该使用哪一种很重要，您应该了解清楚，因为它们的工作方式不同。



如果您正在使用`JavaScript`，请务必查看下面的`JS特定内容`信息部分。您还可以找到`esbuild`的`TypeScript`类型定义作为参考。如果您正在使用Go，请务必查看自动生成的Go文档。



如果您使用的是命令行API，了解这些标志的形式可能会有所帮助：`--foo`、`--foo=bar`或`--foo:bar`。形式`--foo`用于启用布尔标志（如`--minify`），形式`--foo=bar`用于具有单个值且仅指定一次的标志（如`--platform=`），而形式`--foo:bar`用于具有多个值且可以多次重新指定的标志（例如`--external:`）。

## Transform API

todo...