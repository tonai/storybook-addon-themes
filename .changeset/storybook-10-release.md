---
'storybook-addon-themes': major
---

Rewrite the theme switcher for Storybook 10 with a framework-independent preview decorator, automatic addon registration, and an ESM package.

- Keep `parameters.themes`, including theme lists, defaults, multiple CSS classes, color swatches, clearing, disabling, and custom targets.
- Store the selection in Storybook globals for shareable URLs, persistent selection between stories, and fixed per-story themes.
- Apply themes in Canvas, Docs, and standalone previews, with cleanup when stories or targets change and preservation of existing CSS classes.
- Add example apps and browser regression tests for React, Vue 3, Svelte 5, HTML, Preact, Web Components, and Angular.

### Migration from version 6

- Upgrade to Storybook 10 and register `storybook-addon-themes` in your Storybook `addons` configuration.
- Remove `/register` and framework-specific imports (`/react`, `/vue`, `/svelte`, `/html`); the addon registers its preview decorator automatically.
- Replace the `Decorator` parameter with a regular framework decorator that reads `context.globals.theme`.
- Move `onChange` effects into preview configuration. The callback now runs in the preview on initial render and theme changes, and may return a cleanup function.
- Use Node 20.19+ or 22.12+ and ESM-compatible tooling. Storybook 6 and Storybook 11 prereleases are outside this release's compatibility range.

See the [migration guide](https://github.com/tonai/storybook-addon-themes/blob/10.x/packages/storybook-addon-themes/README.md#migrating-from-6x) for examples.
