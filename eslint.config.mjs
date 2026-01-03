import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Creates ESLint configuration with optional type-aware rules.
 * @param {Object} options - Configuration options
 * @param {boolean} options.typeAware - Whether to enable type-aware rules and TypeScript import resolver
 * @returns {Array} ESLint flat config array
 */
export function createEslintConfig({ typeAware = true } = {}) {
  return defineConfig(
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
    // Use type-aware configs when typeAware is true, otherwise use stylistic (non-type-aware) rules
    ...(typeAware
      ? tseslint.configs.recommended
      : tseslint.configs.stylistic),
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
        // Only enable TypeScript import resolver when type-aware mode is enabled
        ...(typeAware && {
          'import/resolver': {
            typescript: {
              // https://github.com/import-js/eslint-plugin-import/issues/1872#issuecomment-789895457
              project: '.',
            },
          },
        }),
      },
      rules: {
        'import/no-unresolved': 'off',
        // Disable import/named when not type-aware (can't resolve TypeScript type-only imports)
        // Also disable import/no-named-as-default warnings (too noisy without type info)
        ...(typeAware
          ? {}
          : {
              'import/named': 'off',
              'import/no-named-as-default': 'off',
            }),
        // Only enable import/no-restricted-paths when type-aware (it needs type information)
        ...(typeAware && {
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
        }),
      },
    },

    // all other rules
    {
      rules: {
        // ESLint rules
        'no-redeclare': 'off',
        eqeqeq: ['warn', 'smart'],
        // Disable no-unused-vars when not type-aware (TypeScript version handles it better)
        // The TypeScript parser will still catch unused vars, but without false positives
        ...(typeAware
          ? {}
          : {
              'no-unused-vars': 'off',
            }),

        // TypeScript rules
        '@typescript-eslint/no-unused-vars': 'off', // TODO: enable rule
        '@typescript-eslint/no-explicit-any': 'off', // TODO: enable rule
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-unsafe-function-type': 'off', // TODO: enable rule
        // Disable stylistic rules that are too strict for pre-commit (style-only, not correctness)
        // Also ensure rules that have disable directives in code are recognized in both configs
        ...(typeAware
          ? {}
          : {
              '@typescript-eslint/consistent-type-definitions': 'off',
              '@typescript-eslint/array-type': 'off',
              '@typescript-eslint/consistent-indexed-object-style': 'off',
              '@typescript-eslint/no-inferrable-types': 'off',
              '@typescript-eslint/consistent-generic-constructors': 'off',
              '@typescript-eslint/no-empty-function': 'off',
            }),

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
}

// Export default config with type-aware rules enabled (for backward compatibility)
export default createEslintConfig({ typeAware: true });
