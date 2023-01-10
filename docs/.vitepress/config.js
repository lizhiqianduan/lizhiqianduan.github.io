import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '前端文档库 | 励志前端',
  description: '用于存放前端中文文档，用于整理记录个人心得',
  lastUpdated: true,
  themeConfig:{
    'logo':'/logo.jpg',
    nav: [
      { text: '首页', link: '/index.md'},
      { text: 'esbuild中文文档', link: '/esbuild/index.md',activeMatch:'/esbuild/'},
      { text: '更新日志', link: '/changelog.md'}
    ],

    outline: 'deep',
    outlineTitle:'目录导航',

    editLink: {
      pattern: 'https://github.com/lizhiqianduan/lizhiqianduan.github.io/blob/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    sidebar: {
      '/esbuild/':[
        {text: 'esbuild 中文文档',items:[
          {text: '简介',link: '/esbuild/index.md'},
          {text: '开始',link: '/esbuild/Getting-Started.md'},
          {text: 'API',link: '/esbuild/API.md'},
          {text: '支持的Content类型',link: '/esbuild/Content-Types.md'},
          {text: '插件',link: '/esbuild/Plugins.md'},
          {text: 'FAQ',link: '/404.md'},
          {text: 'bundle包大小分析',link: '/404.md'},
        ]},
      ]
    }
  }
})
