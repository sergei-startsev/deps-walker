module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2017
  },
  rules: {
    'no-undef': 'error',
    'no-extra-semi': 'error',
    'no-template-curly-in-string': 'error',
    'no-caller': 'error',
    yoda: 'error',
    eqeqeq: 'error',
    'brace-style': 'error',
    'no-extra-bind': 'error',
    'no-process-exit': 'error',
    'no-unused-vars': ['error', { args: 'none' }],
    'no-unsafe-negation': 'error',
    indent: 'off',
    'valid-jsdoc': [
      'error',
      {
        prefer: {
          return: 'returns'
        },
        preferType: {
          '*': 'any'
        },
        requireReturnType: true
      }
    ]
  }
};
