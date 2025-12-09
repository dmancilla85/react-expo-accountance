// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    root: true,
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-native/all',
      'plugin:prettier/recommended',
      'expo',
    ],
    plugins: ['@typescript-eslint', 'react', 'react-native', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 2020,
      sourceType: 'module',
      project: './tsconfig.json',
    },
    env: {
      'react-native/react-native': true,
      es6: true,
      node: true,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
]);
