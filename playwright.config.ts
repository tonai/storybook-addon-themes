import { defineConfig, devices } from '@playwright/test';
const frameworks = [
  'react',
  'vue3',
  'svelte',
  'html',
  'preact',
  'web-components',
  'angular',
];
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 3,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure' },
  projects: frameworks.map((name, i) => ({
    name,
    use: { baseURL: `http://127.0.0.1:${6106 + i}` },
  })),
  webServer: frameworks.map((name, i) => ({
    command: `http-server examples-app/${name}/storybook-static -a 127.0.0.1 -p ${6106 + i} -c-1 --silent`,
    url: `http://127.0.0.1:${6106 + i}`,
    reuseExistingServer: !process.env.CI,
  })),
});
