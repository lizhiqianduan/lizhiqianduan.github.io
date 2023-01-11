const fs = require('fs');
// 已经发布的提交记录
const deployedHash = fs.readFileSync('./Deploy','utf-8').trim().split('\n')

/**
 * @type {import('conventional-changelog-config-spec').Config}
 */
const config = {
  writerOpts: {
    /**
     * 
     * @param {*} commit 
     * @param {*} context 此变量通过`changelog.context.json`进行配置
     * @returns 
     */
    transform: (commit, context) => {
      // angular模式源码的bug，必须存在shortHash才会显示链接
      // node_modules/conventional-changelog-angular/writer-opts.js line:64
      // node_modules/conventional-changelog-angular/templates/commit.hbs line:9
      // 此段注释取消时，并且linkReferences设置为true时，可显示shortHash的点击链接，此处不需要
      // if (typeof commit.hash === 'string') {
      //   commit.shortHash = commit.hash.substring(0, 7)
      // }

      // 过滤已经发布过的提交记录
      if(deployedHash.indexOf(commit.hash)!==-1) return;


      if (commit.type === 'esbuild') {
        commit.type = '✨ Esbuild | 中文文档更新'
        fs.appendFileSync('./Deploy',commit.hash+'\n')
        return commit
      }

      if (commit.type === 'fix') {
        commit.type = '🐛 Bug Fixes | Bug 修复'
        fs.appendFileSync('./Deploy',commit.hash+'\n')
        return commit
      }

      if (commit.type === 'site') {
        commit.type = '⚡ Site update | 网站更新'
        fs.appendFileSync('./Deploy',commit.hash+'\n')
        return commit
      }
      return;
    }
  }
}


module.exports = config