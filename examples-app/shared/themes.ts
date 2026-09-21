import type { ThemeConfig } from 'storybook-addon-themes';
export const themes = {
  default: 'light',
  list: [
    { name: 'light', class: 'theme-light', color: '#f8fafc' },
    { name: 'dark', class: ['theme-dark', 'dark-mode'], color: '#0f172a' },
    { name: 'ocean', class: 'theme-ocean', color: '#0369a1' },
  ],
} satisfies ThemeConfig;
