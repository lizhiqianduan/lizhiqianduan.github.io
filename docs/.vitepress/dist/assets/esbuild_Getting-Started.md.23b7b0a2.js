import{_ as s,c as e,o as a,d as l}from"./app.807c2347.js";const C=JSON.parse(`{"title":"开始 | esbuild 中文文档","description":"","frontmatter":{"title":"开始 | esbuild 中文文档"},"headers":[{"level":2,"title":"安装esbuild","slug":"安装esbuild","link":"#安装esbuild","children":[]},{"level":2,"title":"您的第一个bundle","slug":"您的第一个bundle","link":"#您的第一个bundle","children":[]},{"level":2,"title":"构建脚本","slug":"构建脚本","link":"#构建脚本","children":[]},{"level":2,"title":"浏览器环境打包","slug":"浏览器环境打包","link":"#浏览器环境打包","children":[]},{"level":2,"title":"Node环境打包","slug":"node环境打包","link":"#node环境打包","children":[]},{"level":2,"title":"多平台同步","slug":"多平台同步","link":"#多平台同步","children":[]},{"level":2,"title":"使用Yarn Plug'n'Play(PnP)","slug":"使用yarn-plug-n-play-pnp","link":"#使用yarn-plug-n-play-pnp","children":[]},{"level":2,"title":"其他安装方式","slug":"其他安装方式","link":"#其他安装方式","children":[{"level":3,"title":"下载构建后的可执行文件","slug":"下载构建后的可执行文件","link":"#下载构建后的可执行文件","children":[]},{"level":3,"title":"安装WASM版本","slug":"安装wasm版本","link":"#安装wasm版本","children":[]},{"level":3,"title":"使用Deno代替node","slug":"使用deno代替node","link":"#使用deno代替node","children":[]},{"level":3,"title":"从源码构建","slug":"从源码构建","link":"#从源码构建","children":[]}]}],"relativePath":"esbuild/Getting-Started.md","lastUpdated":1673255058000}`),n={name:"esbuild/Getting-Started.md"},o=l(`<h1 id="开始" tabindex="-1">开始 <a class="header-anchor" href="#开始" aria-hidden="true">#</a></h1><h2 id="安装esbuild" tabindex="-1">安装esbuild <a class="header-anchor" href="#安装esbuild" aria-hidden="true">#</a></h2><p>首先，在本地下载并安装esbuild命令。可以使用npm（在安装NodeJs时会自动安装）安装预构建的本地可执行文件：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">npm install --save-exact esbuild</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>这条命令执行后，应该就已经在本地<code>node_modules</code>文件夹中安装了esbuild。您可以运行esbuild可执行文件来验证一切是否正常工作：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">./node_modules/.bin/esbuild --version</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>建议安装esbuild的方法是使用npm安装本机可执行文件。但如果你不想这样做，还有一些其他的安装方法。</p><h2 id="您的第一个bundle" tabindex="-1">您的第一个<code>bundle</code> <a class="header-anchor" href="#您的第一个bundle" aria-hidden="true">#</a></h2><p>这是一个关于esbuild功能以及如何快速使用它的真实示例。首先，安装react和react dom包：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">npm install react react</span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;">dom</span></span>
<span class="line"></span></code></pre></div><p>然后创建一个名为<code>app.jsx</code>的文件，其中包含以下代码：</p><div class="language-jsx"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> React </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">react</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> Server </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">react-dom/server</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> Greet </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">h1</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">Hello, world!</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">h1</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(Server</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">renderToString</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Greet</span><span style="color:#89DDFF;"> /&gt;</span><span style="color:#A6ACCD;">))</span></span>
<span class="line"></span></code></pre></div><p>最后，告诉esbuild如何打包这个文件：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">./node_modules/.bin/esbuild app.jsx </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">bundle </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">outfile</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">out.js</span></span>
<span class="line"></span></code></pre></div><p>执行这个构建命令后，应该会创建一个名为out.js的文件，其中包含您的代码和打包在一起的React库。代码是完全独立的，不再依赖于node_modules目录。如果您使用<code>node out.js</code>运行代码，应该会看到如下内容：</p><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">&lt;h1 data-reactroot=&quot;&quot;&gt;Hello, world!&lt;/h1&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>请注意，esbuild还将JSX语法转换为JavaScript，除了<code>.JSX</code>扩展名之外没有任何其他配置。虽然可以对esbuild进行配置，但这里尝试使用默认值，这样才能让更多的通用情况自动运行。如果您想在<code>.js</code>文件中使用<code>JSX语法</code>，可以使用<code>--loader:.js=JSX</code>标志告诉<code>esbuild</code>允许这样做。您可以在<code>API文档</code>中阅读有关可用配置选项的更多信息。</p><h2 id="构建脚本" tabindex="-1">构建脚本 <a class="header-anchor" href="#构建脚本" aria-hidden="true">#</a></h2><p>您的build命令将重复运行，因此您可能想要将它自动化。一种自然的方法是将构建脚本添加到<code>package.json</code>文件中，如下所示：</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">scripts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">build</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">esbuild app.jsx --bundle --outfile=out.js</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>请注意，这里直接使用了esbuild命令，而没有使用相对路径。这是因为<code>scripts</code>部分中的所有内容都是使用路径中已经存在的<code>esbuild</code>命令运行的（只要您安装了esbuild包）。</p><p>构建脚本可以这样调用：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div><p>但是，如果您需要将更多的选项传递给esbuild，那么使用命令行界面可能会变得非常困难。对于更复杂的使用场景，您可能希望使用<code>esbuild</code>的<code>JavaScript API</code>在<code>JavaScript</code>中编写构建脚本。可能像下面这样：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#82AAFF;">require</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">esbuild</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">build</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">entryPoints</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">app.jsx</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">bundle</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">outfile</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">out.js</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">catch</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> process</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">exit</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">))</span></span>
<span class="line"></span></code></pre></div><p><code>build函数</code>在子进程中运行esbuild可执行文件，当build执行完成后，返回一个promise。上面的代码不会打印出捕获到的异常，因为默认情况下，异常中的任何错误消息也会打印到控制台（如果您愿意，可以更改日志级别来关闭它）。</p><p>虽然也有一个非异步的<code>buildSync API</code>，但异步API对于构建脚本更好，因为插件只能与异步API一起工作。您可以在API文档中阅读有关构建API的配置选项的更多信息。</p><h2 id="浏览器环境打包" tabindex="-1">浏览器环境打包 <a class="header-anchor" href="#浏览器环境打包" aria-hidden="true">#</a></h2><p>默认情况下，<code>bundler</code>为浏览器输出代码，因此启动时不需要额外的配置。对于开发版本，您可能希望使用<code>--sourcemap</code>启用源码映射，而对于生产版本，可能希望使用<code>--minify</code>启用代码压缩。您可能还希望为您支持的浏览器配置<code>target</code>环境，以便将最新的<code>JavaScript语法</code>转换为旧的<code>JavaScript</code>语法。所有这些加起来后，可能看起来像这样：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">esbuild app.jsx </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">bundle </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">minify </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">sourcemap </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">chrome58,firefox57,safari11,edge16</span></span>
<span class="line"></span></code></pre></div><p>某些npm包可能不是设计为在浏览器中运行的。有时，您可以使用esbuild的配置选项来解决某些问题，无论如何都能成功地打包。在简单的情况下，可以用define特性替换未定义的全局变量，在更复杂的情况下可以用inject特性替换。</p><h2 id="node环境打包" tabindex="-1">Node环境打包 <a class="header-anchor" href="#node环境打包" aria-hidden="true">#</a></h2><p>虽然在使用node的时候打包不是必需的，但有时在node中运行代码之前使用<code>esbuild</code>处理代码仍然是有好处的。打包可以自动剥离<code>TypeScript</code>类型，将<code>ECMAScript</code>模块语法转换为<code>CommonJS</code>，并将较新的JavaScript语法转换为特定版本节点的较旧语法。在发布软件包之前打包也是有好处的，这样下载量就更小，在从文件系统读取源代码的时间也更少。</p><p>如果需要打包为在<code>node</code>中运行的代码，则应通过将<code>--platform=node</code>传递给<code>esbuild</code>来配置平台设置。这个参数同时也会将一些不同的设置更改为对<code>node</code>环境较友好的默认值。例如，所有内置于节点（如<code>fs</code>）的包都会自动标记为外部包，因此<code>esbuild</code>不会试图去将它们打包。此设置还禁用<code>package.json</code>中<code>browser</code>字段的解释。</p><p>如果您的代码使用了在您的node版本中不起作用的较新的JavaScript语法，则需要配置node的目标版本：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">esbuild app.js </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">bundle </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">platform</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">node </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">node10</span><span style="color:#F78C6C;">.4</span></span>
<span class="line"></span></code></pre></div><p>您可能还不想将依赖项<code>dependencies</code>与<code>esbuild</code>打包在一起。还有很多<code>node</code>独有的特性是<code>esbuild</code>打包时不支持的，例如<code>__dirname</code>、<code>i<wbr>mport.meta.url</code>、<code>fs.readFileSync</code>和<code>*.node</code>原生二进制模块。通过将<code>packages</code>设置为<code>external</code>，可以从打包文件中排除所有依赖项：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">esbuild app.jsx </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">bundle </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">platform</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">node </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">packages</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">external</span></span>
<span class="line"></span></code></pre></div><p>这样做的话，在运行时文件系统上必须存在这些依赖项，因为它们不包含在打包文件中。</p><h2 id="多平台同步" tabindex="-1">多平台同步 <a class="header-anchor" href="#多平台同步" aria-hidden="true">#</a></h2><p>您不能在一个操作系统上安装<code>esbuild</code>，在不重新安装的情况下将<code>node_modules</code>目录复制到其他操作系统，然后在该其他操作系统上运行<code>esbuild</code>。这是行不通的，因为<code>esbuild</code>是用原生代码编写的，需要安装特定平台的二进制可执行文件。通常情况下，这没什么问题，因为您通常会将<code>package.json</code>文件纳入版本控制，而不是<code>node_modules</code>目录，然后每个人在克隆存储库后都会在本地计算机上运行<code>npm install</code>。</p><p>然而，人们有时会遇到这种情况，在<code>Windows</code>或<code>macOS</code>上安装esbuild，并将<code>node_modules</code>目录复制到运行<code>Linux</code>的<code>Docker</code>映像中，或者在<code>Windows</code>和<code>WSL</code>环境之间复制<code>node_module</code>目录。这么操作要想正确运行就取决于您的包管理器了：</p><p><code>npm/pnpm</code>：如果使用npm或pnpm进行安装，则可以在复制文件时尝试不复制<code>node_modules</code>目录，并在复制后在目标平台上运行<code>npm-ci</code>或<code>npm-install</code>。或者您可以考虑改用<code>Yarn</code>，它内置支持在多个平台上同时安装软件包。</p><p><code>Yarn</code>：如果您使用Yarn进行安装，可以尝试使用<code>supportedArchitectures</code>功能在<code>.yarnrc.yml</code>文件中列出当前平台和其他平台。请记住，这就意味着<code>esbuild</code>的多个副本将出现在文件系统中。</p><p>您可能还会遇到另一种情况，如果您在带有<code>ARM</code>处理器的<code>macOS</code>计算机上，使用npm的ARM版本安装esbuild，然后尝试使用<code>Rosetta</code>内部运行的<code>x86-64</code>版本的<code>node</code>运行<code>esbuild</code>。在这种情况下，一个简单的解决方案是使用ARM版本的node运行代码，可以在此处下载：<a href="https://nodejs.org/en/download/" target="_blank" rel="noreferrer">https://nodejs.org/en/download/</a>.</p><p>另一种选择是使用<code>esbuild-wasm</code>打包，这在所有平台上都是一样的。但它的性能成本很高，有时会比<code>esbuild</code>打包慢10倍，因此您可能也不想这样做。</p><h2 id="使用yarn-plug-n-play-pnp" tabindex="-1">使用Yarn <code>Plug&#39;n&#39;Play</code>(PnP) <a class="header-anchor" href="#使用yarn-plug-n-play-pnp" aria-hidden="true">#</a></h2><p>esbuild原生支持Yarn的<code>Plug&#39;n&#39;Play</code>包安装策略。要使用它，请确保您运行esbuild的当前工作目录包含Yarn生成的包清单JavaScript文件（<code>.pnp.cjs</code>或<code>.pnp.js</code>）。如果检测到<code>Yarn Plug&#39;n&#39;Play</code>包清单，esbuild将自动导入<code>Yarn</code>缓存中<code>.zip</code>文件内的包，并且将在捆绑期间自动动态提取这些文件。</p><p>因为<code>esbuild</code>是在<code>Go</code>中编写的，所以对<code>Yarn Plug&#39;n&#39;Play</code>的支持已经在<code>Go</code>中完全重新实现，而不是依赖<code>Yarn</code>的<code>JavaScript API</code>。这使得<code>Yarn Plug&#39;n&#39;Play</code>包解决方案能够与<code>esbuild</code>的并行打包很好地集成，以实现最高速度。注意，Yarn的命令行界面为每个命令增加了许多不可避免的性能开销。为了获得最大的esbuild性能，您可能需要考虑在不使用<code>Yarn</code>的<code>CLI</code>的情况下运行<code>esbuild</code>（即不使用<code>Yarn esbuild</code>）。这会让<code>esbuild</code>运行速度提高10倍。</p><h2 id="其他安装方式" tabindex="-1">其他安装方式 <a class="header-anchor" href="#其他安装方式" aria-hidden="true">#</a></h2><p>建议安装<code>esbuild</code>的方法是使用<code>npm</code>安装本机可执行文件。但也可以通过以下方式安装esbuild：</p><h3 id="下载构建后的可执行文件" tabindex="-1">下载构建后的可执行文件 <a class="header-anchor" href="#下载构建后的可执行文件" aria-hidden="true">#</a></h3><p>如果您有Unix系统，可以使用以下命令下载当前平台的esbuild二进制可执行文件（它将被下载到当前工作目录）：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">curl </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;">fsSL https://esbuild.github.io/dl/v0</span><span style="color:#F78C6C;">.16.13</span><span style="color:#A6ACCD;"> | sh</span></span>
<span class="line"></span></code></pre></div><p>您还可以使用最新版本而不是版本号来下载esbuild的最新版本：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">curl </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;">fsSL https://esbuild.github.io/dl/latest | sh</span></span>
<span class="line"></span></code></pre></div><p>如果您不想从互联网上执行<code>shell</code>脚本以下载<code>esbuild</code>，您也可以自己从<code>npm</code>手动下载包（这就是上述shell脚本所做的全部工作）。虽然预编译的本地可执行文件是使用<code>npm</code>托管的，但实际上不需要安装npm来下载它们。npm包的<code>registry</code>是一个普通的<code>HTTP</code>服务器，包是普通的<code>gzip tar</code>文件。</p><p>以下是直接下载二进制可执行文件的示例：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">curl </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;">O https://registry.npmjs.org/@esbuild/darwin</span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;">x64/</span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;">/darwin</span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;">x64</span><span style="color:#F78C6C;">-0.16.13</span><span style="color:#A6ACCD;">.tgz</span></span>
<span class="line"><span style="color:#A6ACCD;">tar xzf ./darwin</span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;">x64</span><span style="color:#F78C6C;">-0.16.13</span><span style="color:#A6ACCD;">.tgz</span></span>
<span class="line"><span style="color:#A6ACCD;">./package/bin/esbuild</span></span>
<span class="line"><span style="color:#A6ACCD;">Usage:</span></span>
<span class="line"><span style="color:#A6ACCD;">  esbuild [options] [entry points]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">...</span></span>
<span class="line"></span></code></pre></div><p><code>@esbuild/darwin-x64</code>包中的原生可执行文件适用于<code>macOS</code>操作系统和64位<code>Intel</code>体系结构的操作系统。截至本文撰写之时，这是esbuild支持的平台的本地可执行包的完整列表：</p><table><thead><tr><th>Package name</th><th>OS</th><th>Architecture</th><th>Download</th></tr></thead><tbody><tr><td>@esbuild/android-arm</td><td>android</td><td>arm</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/android-arm64</td><td>android</td><td>arm64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/android-x64</td><td>android</td><td>x64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/darwin-arm64</td><td>darwin</td><td>arm64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/darwin-x64</td><td>darwin</td><td>x64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/freebsd-arm64</td><td>freebsd</td><td>arm64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/freebsd-x64</td><td>freebsd</td><td>x64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/linux-arm</td><td>linux</td><td>arm</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/linux-arm64</td><td>linux</td><td>arm64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/linux-ia32</td><td>linux</td><td>ia32</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/linux-loong64</td><td>linux</td><td>loong642</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/linux-mips64el</td><td>linux</td><td>mips64el2</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/linux-ppc64</td><td>linux</td><td>ppc64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/linux-riscv64</td><td>linux</td><td>riscv642</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/linux-s390x</td><td>linux</td><td>s390x</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/linux-x64</td><td>linux</td><td>x64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/netbsd-x64</td><td>netbsd1</td><td>x64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/openbsd-x64</td><td>openbsd</td><td>x64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/sunos-x64</td><td>sunos</td><td>x64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/win32-arm64</td><td>win32</td><td>arm64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/win32-ia32</td><td>win32</td><td>ia32</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr><tr><td>@esbuild/win32-x64</td><td>win32</td><td>x64</td><td><a href="https://esbuild.github.io/getting-started/#download-a-build" target="_blank" rel="noreferrer">⬇️</a></td></tr></tbody></table><p><strong>为什么不建议这样做</strong>：这种方法只适用于可以运行shell脚本的Unix系统，因为它需要Windows上的WSL。另外一个缺点是，您不能将插件与本机版本的esbuild一起使用。</p><p>如果您选择编写自己的代码来直接从npm下载esbuild，那么您将依赖<code>esbuild</code>的本地可执行安装程序的内部实现细节。这些细节可能会在某个时候发生变化，在某种情况下，这种方法将不再适用于新的esbuild版本。虽然这只是一个小缺点，但该方法对于现有的<code>esbuild</code>版本仍然可以永远使用（发布到<code>npm</code>的包是不可变的）。</p><h3 id="安装wasm版本" tabindex="-1">安装WASM版本 <a class="header-anchor" href="#安装wasm版本" aria-hidden="true">#</a></h3><p>除了<code>esbuild</code>npm包之外，还有一个<code>esbuild-wasm</code>包，其功能类似，但使用<code>WebAssembly</code>实现而不是原生代码。安装它也将安装一个名为<code>esbuild</code>的可执行文件：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">npm install </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">save</span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;">exact esbuild</span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;">wasm</span></span>
<span class="line"></span></code></pre></div><p><strong>为什么不建议这样做</strong>：<code>WebAssembly</code>版本比原生版本慢得多。在许多情况下，它慢了一个数量级（即10倍）。这是出于各种原因，包括：</p><ul><li>a）node在每次运行时都会从头开始重新编译<code>WebAssembly</code>代码</li><li>b）Go的<code>WebAssembly</code>编译方法是单线程的</li><li>c）node有<code>WebAssembly</code>bug，进程退出可能会延迟几秒 <code>WebAssembly</code>版本还排除了一些功能，例如本地文件服务器。只有在没有其他选择的情况下，例如当您希望在不受支持的平台上使用<code>esbuild</code>时，才应该像这样使用<code>WebAssembly</code>包。WebAssembly包主要用于浏览器。</li></ul><h3 id="使用deno代替node" tabindex="-1">使用<code>Deno</code>代替<code>node</code> <a class="header-anchor" href="#使用deno代替node" aria-hidden="true">#</a></h3><p>如果您希望将<code>esbuild</code>与<code>Deno JavaScript</code>环境一起使用，<code>esbulid</code>也对其提供了基础支持。程序包位于<a href="https://deno.land/x/esbuild" target="_blank" rel="noreferrer">https://deno.land/x/esbuild</a>，并使用了原生esbuild可执行文件。可执行文件将在运行时从<code>npm</code>下载并缓存，因此您的计算机需要网络能访问<code>registry.npmjs.org</code>才能使用此包。使用软件包如下所示：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> esbuild </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">https://deno.land/x/esbuild@v0.16.13/mod.js</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> ts </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">let test: boolean = true</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> result </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#A6ACCD;"> esbuild</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">transform</span><span style="color:#A6ACCD;">(ts</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">loader</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">ts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">result:</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> result)</span></span>
<span class="line"><span style="color:#A6ACCD;">esbuild</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">stop</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"></span></code></pre></div><p>它与<code>esbuild</code>的npm包基本上具有相同的API，但有一个额外之处：完成后需要调用<code>stop()</code>，因为与node不同，Deno没有提供必要的API来允许<code>Deno</code>在<code>esbuild</code>内部子进程仍在运行时退出。</p><p>如果您希望使用<code>esbuild</code>的<code>WebAssembly</code>版本来代替<code>esbuild</code>与<code>Deno</code>的原生版本，可以通过导入<code>wasm.js</code>代替<code>mod.js</code>来实现，如下所示：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> esbuild </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">https://deno.land/x/esbuild@v0.16.13/wasm.js</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> ts </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">let test: boolean = true</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> result </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#A6ACCD;"> esbuild</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">transform</span><span style="color:#A6ACCD;">(ts</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">loader</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">ts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">result:</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> result)</span></span>
<span class="line"><span style="color:#A6ACCD;">esbuild</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">stop</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"></span></code></pre></div><p>使用<code>WebAssembly</code>代替原生意味着您不需要指定<code>Deno</code>的<code>--allow</code>运行权限，而<code>WebAssembly</code>是文件系统不可用的情况下（如使用<code>Deno Deploy</code>）的唯一选择。但是，请记住，<code>esbuild</code>的<code>WebAssembly</code>版本比原生版本慢得多。关于WebAssembly的另一件事是，<code>Deno</code>目前有一个<code>bug</code>，在所有加载的<code>WebAssembly</code>模块完全优化之前，进程终止会被不必要地延迟，这可能需要几秒钟。如果您正在编写一个使用<code>esbuild</code>的<code>WebAssembly</code>实现的临时脚本，以便您的代码在合理的时间内退出，那么您可能需要在代码完成后手动调用<code>Deno.exit(0)</code>。</p><p><strong>不建议这样做的原因</strong>：<code>Deno</code>比<code>node</code>更新，使用较少，支持的平台也比<code>node</code>少，因此建议将node作为运行esbuild的主要方式。Deno使用了互联网作为包系统，而不是现有的JavaScript包生态系统，esbuild是围绕npm风格的包管理而设计和优化的。您可以将esbuild与Deno一起使用，但如果您想打包<code>HTTP URL</code>，则需要一个插件。</p><h3 id="从源码构建" tabindex="-1">从源码构建 <a class="header-anchor" href="#从源码构建" aria-hidden="true">#</a></h3><p>要从源生成<code>esbuild</code>，请执行以下操作：</p><ol><li>安装Go编译器：</li></ol><p><a href="https://go.dev/dl/" target="_blank" rel="noreferrer">https://go.dev/dl/</a></p><ol start="2"><li>下载esbuild的源代码：</li></ol><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">git clone </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">depth </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">--</span><span style="color:#A6ACCD;">branch v0</span><span style="color:#F78C6C;">.16.13</span><span style="color:#A6ACCD;"> https://github.com/evanw/esbuild.git</span></span>
<span class="line"><span style="color:#A6ACCD;">cd esbuild</span></span>
<span class="line"></span></code></pre></div><ol start="3"><li>构建esbuild可执行文件（在Windows上为esbuild.exe）：</li></ol><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">go build ./cmd/esbuild</span></span>
<span class="line"></span></code></pre></div><p>如果要为其他平台构建，只需在build命令前面加上平台信息即可。例如，可以使用以下命令构建32位Linux版本：</p><div class="language-cmd"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">GOOS</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">linux GOARCH</span><span style="color:#89DDFF;">=</span><span style="color:#F78C6C;">386</span><span style="color:#A6ACCD;"> go build ./cmd/esbuild</span></span>
<span class="line"></span></code></pre></div><p><strong>不建议这样做的原因</strong>：原生版本只能通过命令行界面使用，对于复杂的用例来说，这是很耗费时间的，并且不支持插件。您需要编写JavaScript或Go代码，并使用esbuild的API来使用插件。</p>`,87),t=[o];function p(d,c,r,i,D,y){return a(),e("div",null,t)}const b=s(n,[["render",p]]);export{C as __pageData,b as default};
