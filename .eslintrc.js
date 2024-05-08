module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-v-html': 0,
    'no-console': 0,
    'no-unused-vars': 1,
    'semi': [2, 'always'],
    'prefer-const': 0,
    'handle-callback-err': 0,
    'vue/html-closing-bracket-newline': 0
  }
};
