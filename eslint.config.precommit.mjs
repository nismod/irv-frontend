import { createEslintConfig } from './eslint.config.mjs';

// Create config without type-aware rules for fast pre-commit linting
const config = createEslintConfig({ typeAware: false });

// Disable reporting of unused disable directives in fast lint
// (we don't need to catch these in pre-commit, full lint will handle it)
config.push({
  linterOptions: {
    reportUnusedDisableDirectives: 'off',
  },
});

// Runtime validation to ensure type-aware features are disabled
function validatePrecommitConfig(configArray) {
  const errors = [];
  const typeAwareRulePatterns = [
    /^@typescript-eslint\/no-unsafe-/,
    /^@typescript-eslint\/restrict-/,
    /^@typescript-eslint\/require-/,
    /^@typescript-eslint\/await-/,
    /^@typescript-eslint\/no-floating-promises/,
    /^@typescript-eslint\/no-misused-promises/,
  ];

  // Check for parserOptions.project (indicates type-aware mode)
  for (const configItem of configArray) {
    if (configItem?.languageOptions?.parserOptions?.project) {
      errors.push(
        `Found parserOptions.project in config. Type-aware mode should be disabled for pre-commit.`,
      );
    }

    // Check for TypeScript import resolver (requires type information)
    if (
      configItem?.settings?.['import/resolver']?.typescript?.project
    ) {
      errors.push(
        `Found TypeScript import resolver with project setting. This requires type information and should be disabled for pre-commit.`,
      );
    }

    // Check for type-aware rules
    if (configItem?.rules) {
      for (const [ruleName, ruleValue] of Object.entries(configItem.rules)) {
        if (
          typeAwareRulePatterns.some((pattern) => pattern.test(ruleName)) &&
          ruleValue !== 'off'
        ) {
          errors.push(
            `Found type-aware rule "${ruleName}" that is not disabled. Type-aware rules should be off for pre-commit.`,
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Pre-commit ESLint config validation failed:\n\n${errors.join('\n')}\n\n` +
        `This usually means the shared config function (createEslintConfig) needs to be updated.\n` +
        `Please ensure type-aware features are properly gated by the typeAware option.`,
    );
  }
}

// Validate the config
validatePrecommitConfig(config);

export default config;

