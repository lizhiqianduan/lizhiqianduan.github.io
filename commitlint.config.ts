import { UserConfig } from '@commitlint/types/lib';

const Configuration: UserConfig = {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  extends: ['@commitlint/config-conventional'],
  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  rules: {
    'type-case': [2, 'always', ['lower-case', 'upper-case']],
    'type-enum': [2, 'always', ['fix', 'site', 'esbuild']]
  }
};

module.exports = Configuration;