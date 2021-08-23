module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['@shuyun-ep-team/eslint-config/base', '@shuyun-ep-team/eslint-config/prettier'],
  parser: 'babel-eslint',
  plugins: ['react', 'jsx-a11y'],
  parserOptions: {
    target:
      'es5' /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
    module:
      'ESNext' /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      legacyDecorators: true,
    },
  },
  rules: {
    'no-unused-vars': 2,
    '@typescript-eslint/no-unused-vars': ['off'],
    'import/extensions': 0,
  },
};
