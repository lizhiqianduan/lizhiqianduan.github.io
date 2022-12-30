import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '励志前端',
  description: '用于存放前端中文文档，用于整理记录个人心得',
  themeConfig:{
    'logo':'./logo.jpg',
    nav: [
      { text: '首页', link: '/index.md'},
      { text: 'esbuild中文文档', link: '/esbuild/index.md'}
    ]
    
  }
})
