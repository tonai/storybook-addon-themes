# Storybook Addon Themes

A theme switcher for **Storybook 10**, with examples and browser tests for React, Vue 3, Svelte 5, HTML, Preact, Web Components, and Angular.

See the [addon documentation](packages/storybook-addon-themes/README.md) for installation, theme parameters, custom providers, and migration from version 6.

## Development

Use Node 22 LTS and npm 11.

```sh
npm install --global npm@11.19.1
npm ci
npm run dev
```

The publishable addon lives in `packages/storybook-addon-themes`. The private root workspace owns shared build/test tooling. [`examples-app`](examples-app/README.md) contains the seven framework integrations, consuming the addon through npm workspace links.

```sh
npm run check
npm run format:check
npx playwright install chromium
npm run test:e2e
```

To use another framework, run `npm run build -- --watch` and `npm run storybook -w examples-app/vue3` in separate terminals.

## Releases

Run `npm run changeset` when making a user-facing change and include the generated release note in your PR. On `10.x`, CI validates the changes, Changesets opens a version PR, and merging that PR publishes to npm and creates a GitHub release.

See [PUBLISHING.md](PUBLISHING.md) for the one-time trusted-publisher setup, release workflow, and recovery instructions. The example apps are never published.

MIT licensed.
