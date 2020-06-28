module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    quotes: ['error', 'single'],
    'func-names': 'off',
    'comma-dangle': 'off',
    'arrow-parens': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'no-use-before-define': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'linebreak-style': ['error', 'windows'],
  },
};
