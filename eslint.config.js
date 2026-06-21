// @ts-check

import prettier from 'eslint-config-prettier';
import etc from 'eslint-plugin-etc';
import eslintPluginImport from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['coverage/**'] },
  prettier,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.git/**',
      'src/routeTree.gen.ts',
    ],
    files: ['**/*.{js,jsx,ts,tsx}'],
    settings: {
      react: {
        version: '19.2.0',
      },
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: eslintPluginImport,
      jsxA11y,
      react,
      'react-hooks': reactHooks,
      etc,
      unicorn,
      sonarjs,
    },
    rules: {
      'global-require': 'off',
      'no-plusplus': 'off',
      'no-nested-ternary': 'error',
      'no-restricted-globals': 'off',
      'no-restricted-syntax': 'off',
      curly: [2, 'all'],
      complexity: ['error', { max: 12 }],
      'max-depth': ['error', { max: 3 }],
      'max-nested-callbacks': ['error', { max: 2 }],
      'max-params': ['error', { max: 3 }],
      'max-statements': ['error', { max: 12 }],
      'arrow-body-style': ['error', 'as-needed'],
      'object-property-newline': [
        'error',
        { allowAllPropertiesOnSameLine: false },
      ],
      'no-warning-comments': [
        'error',
        {
          terms: ['fixme'],
          location: 'anywhere',
        },
      ],
      'no-promise-executor-return': 'off',
      'no-param-reassign': 'off',
      'etc/prefer-interface': [
        'error',
        {
          allowIntersection: true,
          allowLocal: true,
        },
      ],

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@ticmas-ui/*',
              group: 'external',
              position: 'after',
            },
            {
              pattern:
                '@{components,components/**,config,core/**,features/**,pages/**,settings,settings/**,styles/**,test-utils,types,types/**,utils,utils/**}',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['next', 'react'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-cycle': 'off',
      'import/extensions': [
        'error',
        'never',
        {
          svg: 'always',
          webp: 'always',
          json: 'always',
          gen: 'always',
        },
      ],
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
      'react/destructuring-assignment': 'error',
      'react/hook-use-state': 'error',
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      'react/prefer-es6-class': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react/display-name': 'off',
      'react/self-closing-comp': ['error'],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-props-no-spreading': 'off',

      'testing-library/render-result-naming-convention': 'off',

      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'ban-ts-ignore': 'off',
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: false,
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      'class-methods-use-this': 'off',

      'unicorn/no-unsafe-regex': 'off',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },

  {
    files: ['vite.config.ts'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/extensions': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  {
    files: ['**/core/interfaces/**/*.ts'],
    rules: {
      'no-unused-vars': 'off',
    },
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: null,
      },
    },
    rules: {
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-interface': 'off',
    },
  },

  {
    files: ['**/*.spec.ts', '**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'max-nested-callbacks': 'off',
      'max-statements': 'off',
    },
  }
);
