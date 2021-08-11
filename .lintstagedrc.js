module.exports = {
  '**/*.{json,md,yml}': ['prettier -c .prettierrc --write'],
  '**/*.{ts,tsx,js,jsx}': [
    'prettier -c .prettierrc --write',
    'eslint -c .eslintrc.js --rule \'"no-console":"error"\' "**/*.{js,jsx,ts,tsx}"'
  ],
  '.editorconfig': ['prettier -c .prettierrc --write']
};
