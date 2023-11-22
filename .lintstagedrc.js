export default {
  '*.+(ts|tsx)': ['npm run lint -- --fix', () => 'npm run test:type-check'],
  '*.+(ts|tsx|json|css|md|html)': 'npm run format',
};
