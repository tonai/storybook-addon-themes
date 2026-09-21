import type { StorybookConfig } from '@storybook/vue3-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['storybook-addon-themes', '@storybook/addon-docs'],
  framework: '@storybook/vue3-vite',
  core: { disableTelemetry: true },
};
export default config;
