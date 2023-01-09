import{_ as e,c as o,o as d,d as c}from"./app.6547ddac.js";const m=JSON.parse('{"title":"API","description":"","frontmatter":{},"headers":[{"level":2,"title":"Transform API","slug":"transform-api","link":"#transform-api","children":[]}],"relativePath":"esbuild/API.md","lastUpdated":1673071854000}'),a={name:"esbuild/API.md"},r=c('<h1 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-hidden="true">#</a></h1><p>可以通过以下三种方式之一访问API：命令行、<code>JavaScript</code>和<code>Go</code>。这三种语言的概念和参数在很大程度上是相同的，因此它们将在这里一起呈现，而不是为每种语言提供单独的文档。</p><p><code>esbuild</code>的API中有两个主要的<code>API</code>调用：<code>transform</code>和<code>build</code>。你应该使用哪一种很重要，您应该了解清楚，因为它们的工作方式不同。</p><p>如果您正在使用<code>JavaScript</code>，请务必查看下面的<code>JS特定内容</code>信息部分。您还可以找到<code>esbuild</code>的<code>TypeScript</code>类型定义作为参考。如果您正在使用Go，请务必查看自动生成的Go文档。</p><p>如果您使用的是命令行API，了解这些标志的形式可能会有所帮助：<code>--foo</code>、<code>--foo=bar</code>或<code>--foo:bar</code>。形式<code>--foo</code>用于启用布尔标志（如<code>--minify</code>），形式<code>--foo=bar</code>用于具有单个值且仅指定一次的标志（如<code>--platform=</code>），而形式<code>--foo:bar</code>用于具有多个值且可以多次重新指定的标志（例如<code>--external:</code>）。</p><h2 id="transform-api" tabindex="-1">Transform API <a class="header-anchor" href="#transform-api" aria-hidden="true">#</a></h2><p>todo...</p>',7),t=[r];function i(s,n,p,_,f,l){return d(),o("div",null,t)}const A=e(a,[["render",i]]);export{m as __pageData,A as default};