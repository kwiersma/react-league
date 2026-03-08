import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importX, { createNodeResolver } from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier/recommended';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';
import vitest from '@vitest/eslint-plugin';

export default [
  // Global ignores
  { ignores: ['node_modules/', 'public/mockServiceWorker.js', 'generators/', 'dist/'] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript + React files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import-x/resolver-next': [createTypeScriptImportResolver(), createNodeResolver()],
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'import-x': importX,
      'jsx-a11y': jsxA11y,
      'testing-library': testingLibrary,
      'jest-dom': jestDom,
      vitest,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
      ...importX.configs.recommended.rules,
      ...importX.configs.typescript.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      ...testingLibrary.configs['flat/react'].rules,
      ...jestDom.configs['flat/recommended'].rules,
      ...vitest.configs.recommended.rules,

      // Custom overrides
      'import-x/no-cycle': 'error',
      'linebreak-style': ['error', 'unix'],
      'react/prop-types': 'off',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-named-as-default': 'off',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },
  },

  // Prettier must be last
  prettier,
];
