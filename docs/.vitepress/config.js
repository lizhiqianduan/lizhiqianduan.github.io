import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '前端文档库 | 励志前端',
  description: '用于存放前端中文文档，用于整理记录个人心得',
  lastUpdated: true,
  themeConfig:{
    'logo':'/logo.jpg',
    nav: [
      { text: '首页', link: '/index.md'},
      { text: 'esbuild中文文档', link: '/esbuild/index.md'}
    ],

    outline: 'deep',
    outlineTitle:'目录导航',

    sidebar: {
      '/esbuild/':[
        {text: 'esbuild 中文文档',items:[
          {text: '开始',link: '/esbuild/Getting-Started.md'},
          {text: 'API',link: '/esbuild/API.md'},
          {text: '支持的Content类型',link: '/404.md'},
          {text: '插件',link: '/404.md'},
          {text: 'FAQ',link: '/404.md'},
          {text: 'bundle包大小分析',link: '/404.md'},
        ]},
      ]
    }
  }
})
