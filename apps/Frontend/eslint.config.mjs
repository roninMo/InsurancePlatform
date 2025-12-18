import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off"
      "unused-imports/no-unused-imports": "off",
    },
  },
];
