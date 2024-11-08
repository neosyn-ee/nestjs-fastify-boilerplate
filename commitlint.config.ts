import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  parserPreset: './parser-preset',
  plugins: [
    {
      rules: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        'jira-empty': (parsed: { jiraIds: string }) => {
          const test = parsed.jiraIds ? true : false;
          return [test, 'jira id(s) may not be empty'];
        },
      },
    },
  ],
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  // extends: ['@commitlint/config-conventional'],
  /*
   * Resolve and load @commitlint/format from node_modules.
   * Referenced package must be installed
   */
  formatter: '@commitlint/format',
  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  rules: {
    'header-max-length': [2, 'always', 110],
    'jira-empty': [2, 'always'],
  },
  /*
   * Functions that return true if commitlint should ignore the given message.
   */
  ignores: [(commit) => commit === 'wip'],
  /*
   * Whether commitlint uses the default ignore rules.
   */
  defaultIgnores: true,
  /*
   * Custom URL to show upon failure
   */
  helpUrl:
    'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  /*
   * Custom prompt configs
   */
  prompt: {
    messages: {},
    questions: {
      type: {
        description: 'please input type:',
      },
    },
  },
};

module.exports = Configuration;
