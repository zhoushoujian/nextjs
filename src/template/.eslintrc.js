module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['@shuyun-ep-team/eslint-config'],
  globals: {
    axios: 'readonly',
    logger: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  rules: {
    'no-console': 'off',
    'no-restricted-imports': 'off',
    'import/extensions': 'off',
    'class-methods-use-this': 'off',
  },
};
