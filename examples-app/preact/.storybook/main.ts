import type { StorybookConfig } from '@storybook/preact-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['storybook-addon-themes', '@storybook/addon-docs'],
  framework: '@storybook/preact-vite',
  core: { disableTelemetry: true },
};
export default config;
