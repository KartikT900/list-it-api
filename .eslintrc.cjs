module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  plugins: ['@typescript-eslint'],
  settings: {
    'import/resolver': {
      node: {
        extension: ['.js', '.ts', '.tsx', '.json']
      }
    }
  },
  root: true,
  rules: {
    'no-console': [2, { allow: ['warn', 'error'] }]
  }
};
