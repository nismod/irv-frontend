export default {
  // Run fast ESLint (no type-aware rules) on staged TypeScript files only
  '*.+(ts|tsx)': 'npm run lint:fast -- --fix',
  // Format staged files
  '*.+(ts|tsx|json|css|md|html)': 'prettier --write',
};
