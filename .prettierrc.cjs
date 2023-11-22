module.exports = {
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/lib/(.*)$',
    '',
    '^@/(.*)$',
    '',
    '^\\.',
  ],
};
