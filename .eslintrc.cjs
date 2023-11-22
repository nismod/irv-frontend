module.exports = {
  extends: [
    'react-app',
    'eslint:recommended',
    'eslint-config-prettier',
    'plugin:storybook/recommended',
  ],
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    eqeqeq: ['warn', 'smart'],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
      },
    ],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/lib/',
            from: './src/',
            except: ['./lib/'],
            message: 'Code in @/lib  cannot import code from other folders!',
          },
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        // https://github.com/import-js/eslint-plugin-import/issues/1872#issuecomment-789895457
        project: '.',
      },
    },
  },
};
