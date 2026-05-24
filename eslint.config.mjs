import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import configPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'no-unused-vars': 'warn',
    },
  },
  configPrettier,
];
