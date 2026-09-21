import js from '@eslint/js';
import ts from 'typescript-eslint';
export default ts.config(
  {
    ignores: [
      'dist/**',
      '**/.angular/**',
      '**/storybook-static/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        document: 'readonly',
        MutationObserver: 'readonly',
        process: 'readonly',
      },
    },
  },
);
