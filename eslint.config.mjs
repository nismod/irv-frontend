import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Creates ESLint configuration with optional type-aware rules.
 * @param {Object} options - Configuration options
 * @param {boolean} options.typeAware - Whether to use the standard rules instead of the fast lint rules
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
    ...(typeAware ? tseslint.configs.recommended : tseslint.configs.stylistic),
    prettierConfig,

    // Browser and service worker globals
    {
      files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
      languageOptions: {
        globals: {
          ...globals.serviceworker,
          ...globals.browser,
        },
      },
    },

    // React Hooks rules
    reactHooks.configs.flat['recommended-latest'],

    // Keep library code independent of the application in both lint modes.
    {
      files: ['src/lib/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                regex: '^@/(?!lib(?:/|$))',
                message: 'Code in src/lib cannot import application code.',
              },
              {
                regex: '(^|/)\\.\\.(/|$)',
                message: 'Use @/lib/... for imports between library directories.',
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

        // React Hooks rules
        'react-hooks/exhaustive-deps': ['warn', {}],
      },
    },
  );
}

// Export default config with type-aware rules enabled (for backward compatibility)
export default createEslintConfig({ typeAware: true });
