import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['*.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    rules: {
      'react/jsx-uses-vars': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['server/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
