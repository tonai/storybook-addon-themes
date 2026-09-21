import type { StorybookConfig } from '@storybook/web-components-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['storybook-addon-themes', '@storybook/addon-docs'],
  framework: '@storybook/web-components-vite',
  core: { disableTelemetry: true },
};
export default config;
