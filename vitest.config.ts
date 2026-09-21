import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'packages/storybook-addon-themes/src/config.ts',
        'packages/storybook-addon-themes/src/dom.ts',
        'packages/storybook-addon-themes/src/preview.ts',
      ],
      thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
    },
  },
});
