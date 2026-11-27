/** Conventional Commits. Tipos alineados con los prefijos de rama. */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'revert', 'sec'],
    ],
    'header-max-length': [2, 'always', 100],
  },
}
