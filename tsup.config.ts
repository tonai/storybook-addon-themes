import { defineConfig } from 'tsup';
const shared = {
  format: 'esm' as const,
  splitting: true,
  sourcemap: true,
  clean: false,
  external: ['storybook', 'react', 'react-dom', '@storybook/icons'],
};
export default defineConfig([
  {
    ...shared,
    entry: ['src/index.ts', 'src/preview.ts'],
    platform: 'browser',
    target: 'es2022',
    dts: true,
  },
  {
    ...shared,
    entry: ['src/manager.tsx'],
    platform: 'browser',
    target: 'es2022',
  },
  {
    ...shared,
    entry: ['src/preset.ts'],
    platform: 'node',
    target: 'node20.19',
  },
]);
