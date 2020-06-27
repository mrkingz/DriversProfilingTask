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
    'arrow-parens': 'off',
    'linebreak-style': ['error', 'windows'],
  },
};
