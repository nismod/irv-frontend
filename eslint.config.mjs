import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '.local/*',
      'build/*',
      // top-level JS files
      '*.js',
      '*.mjs',
      '*.cjs',
    ],
  },

  // recommended configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  // React plugins
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    extends: [react.configs.flat.recommended],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],

  // import plugin
  importPlugin.flatConfigs.recommended,
  {
    settings: {
      'import/resolver': {
        typescript: {
          // https://github.com/import-js/eslint-plugin-import/issues/1872#issuecomment-789895457
          project: '.',
        },
      },
    },
    rules: {
      'import/no-unresolved': 'off',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/lib/',
              from: './src/',
              except: ['./lib/'],
              message: 'Code in @/lib cannot import code from other folders!',
            },
          ],
        },
      ],
    },
  },

  // all other rules
  {
    rules: {
      // ESLint rules
      'no-redeclare': 'off',
      eqeqeq: ['warn', 'smart'],

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'off', // TODO: enable rule
      '@typescript-eslint/no-explicit-any': 'off', // TODO: enable rule
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off', // TODO: enable rule

      // React rules
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off', // TODO: enable rule

      // React Hooks rules
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
        },
      ],
    },
  },
);
