import type { StorybookConfig } from '@storybook/html-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['storybook-addon-themes', '@storybook/addon-docs'],
  framework: '@storybook/html-vite',
  core: { disableTelemetry: true },
};
export default config;
