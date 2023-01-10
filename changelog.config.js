
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
      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      if (commit.type === 'esbuild') {
        commit.type = '✨ Esbuild | 中文文档更新'
        commit.title = '111'
        return commit
      }

      if (commit.type === 'fix') {
        commit.type = '🐛 Bug Fixes | Bug 修复'
        return commit
      }

      if (commit.type === 'site') {
        commit.type = '⚡ Site update | 网站更新'
        return commit
      }
      return;
    }
  }
}


module.exports = config