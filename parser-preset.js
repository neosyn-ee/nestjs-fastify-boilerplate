module.exports = {
  parserOpts: {
    headerPattern:
      /^(fix|feat|docs|style|refactor|perf|test|build|ci|chore|wip)\((.*)\): (.*)$/,
    headerCorrespondence: ['type', 'jiraIds', 'subject'],
  },
};
