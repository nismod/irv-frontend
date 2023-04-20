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
  },
};
