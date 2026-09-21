import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/angular';
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  addons: ['storybook-addon-themes', '@storybook/addon-docs'],
  framework: {
    name: dirname(
      fileURLToPath(import.meta.resolve('@storybook/angular/package.json')),
    ),
    options: {},
  },
  core: { disableTelemetry: true },
};
export default config;
