import type { StorybookConfig } from '@storybook/svelte-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['storybook-addon-themes', '@storybook/addon-docs'],
  framework: '@storybook/svelte-vite',
  core: { disableTelemetry: true },
};
export default config;
