# Storybook Addon Themes

A theme switcher for **Storybook 10**. Apply CSS classes to your preview, choose themes in the toolbar, and share the selection through Storybook globals. The preview implementation is framework independent; React is only used in Storybook's manager.

For Storybook 6, use `storybook-addon-themes@6`. Version 10 is an ESM package and requires Node **20.19+ or 22.12+** (use a supported LTS release).

## Install

```sh
npm install --save-dev storybook-addon-themes
```

Register the addon in `.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite'; // your framework

export default {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['storybook-addon-themes'],
} satisfies StorybookConfig;
```

Configure `.storybook/preview.ts`:

```ts
import type { Preview } from '@storybook/react-vite';
import type { ThemeConfig } from 'storybook-addon-themes';
import '../src/themes.css';

export default {
  parameters: {
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: 'theme-light', color: '#f8fafc' },
        { name: 'dark', class: ['theme-dark', 'dark-mode'], color: '#0f172a' },
      ],
    } satisfies ThemeConfig,
  },
} satisfies Preview;
```

```css
.theme-light {
  --surface: #f8fafc;
  --text: #0f172a;
}
.theme-dark {
  --surface: #0f172a;
  --text: #f8fafc;
}
.card {
  background: var(--surface);
  color: var(--text);
}
```

No manual decorator registration is needed. The addon does not ship theme CSS; it switches your classes.

## Parameters

Set `parameters.themes` globally, on a component, or on a story. Storybook merges object parameters, so a story can override a single option.

| Option      | Default  | Meaning                                                                                      |
| ----------- | -------- | -------------------------------------------------------------------------------------------- |
| `list`      | `[]`     | Themes with unique `name`, optional `class: string \| string[]`, and optional `color` swatch |
| `default`   | none     | Initial theme name, used when there is no valid global selection                             |
| `clearable` | `true`   | Offer “Clear theme”; when false, fall back to the default or first theme                     |
| `disable`   | `false`  | Hide the tool and remove this story's applied classes                                        |
| `target`    | `'body'` | CSS selector for the first matching element; `'root'` means `<html>`                         |
| `onChange`  | none     | Preview callback `(theme: Theme \| undefined) => void \| (() => void)`                       |

Use nonempty, unique theme names; `none` is reserved for clearing. Names used in Storybook URLs should use letters, numbers, spaces, underscores, and hyphens. Class strings are split on whitespace and deduplicated. The legacy array form and per-theme `default: true` are still accepted; prefer the object form.

A custom target may mount after the story renders and may be replaced during updates. The addon follows those changes and cleans up when the story unmounts. Unrelated and preexisting classes are preserved.

```ts
export const DarkByDefault = {
  parameters: { themes: { default: 'dark' } },
};
export const WithoutThemes = {
  parameters: { themes: { disable: true } },
};
export const OnTheCard = {
  parameters: { themes: { target: '.card' } },
};
```

## Globals, fixed stories, and custom providers

The selected name lives in `globals.theme`. A valid global selection takes precedence over `parameters.themes.default`. An unknown name falls back to the story's default. Explicit `none` clears the theme unless `clearable` is false.

```ts
// preview.ts: optional initial selection that takes precedence over defaults
export default { initialGlobals: { theme: 'dark' } };

// A story-level global locks the toolbar for reproducible screenshots.
export const AlwaysDark = { globals: { theme: 'dark' } };
```

Storybook carries globals between stories and encodes them in the URL, for example `?path=/story/button--primary&globals=theme:dark`. Standalone `iframe.html` previews also work without the manager.

Use a regular framework decorator for context providers. The exported resolver keeps its selection consistent with the toolbar:

```tsx
import { getConfig, getSelectedTheme } from 'storybook-addon-themes';

const withProvider = (Story, context) => {
  const theme = getSelectedTheme(
    getConfig(context.parameters.themes),
    context.globals.theme,
  );
  return (
    <MyThemeProvider theme={theme?.name}>
      <Story />
    </MyThemeProvider>
  );
};
```

`onChange` now runs **inside the preview**, including the initial render. It receives `undefined` when cleared and may return cleanup logic. Use it for effects such as switching a stylesheet. Story changes can remount the effect; it is not an analytics event for toolbar clicks.

## Docs and scope

Classes are applied in both Canvas and Docs previews. The toolbar appears in Canvas. A shared body/root target affects the entire preview document: inline Docs stories cannot display conflicting themes independently on that target. Use iframe-rendered Docs stories for independent themes. Custom selectors select only the first matching element and do not pierce shadow roots; Web Components should inherit CSS custom properties from their host.

Do not enable another addon that also owns `globals.theme` (such as `@storybook/addon-themes`) alongside this one.

## Framework examples and local development

[`examples-app`](https://github.com/tonai/storybook-addon-themes/blob/10.x/examples-app/README.md) contains working npm workspaces for React, Vue 3, Svelte 5, HTML, Preact, Web Components (Lit), and Angular. Every app consumes the built package through its public preset and exports, with the same browser regression suite. React Native and renderers removed from Storybook 10 are not supported.

```sh
nvm use
npm install --global npm@11.19.1
npm ci
npm run dev                         # build watcher + React Storybook on :6006
```

To work with another framework, use two terminals:

```sh
npm run build -- --watch
npm run storybook -w examples-app/vue3
```

No global symlink or publish step is required. Manager/preset changes may require restarting Storybook; preview edits are picked up by the development server.

## Validation

```sh
npm run check                       # lint, TypeScript, unit coverage, package build
npx playwright install chromium     # once per machine
npm run test:e2e                     # build every app, then run Chromium tests
npm run test:e2e:built               # rerun against existing builds
npm run test:e2e:built -- --project=vue3
npm run format:check
```

Vitest enforces 90% coverage for statements, branches, functions, and lines in configuration, DOM lifecycle, and preview code. Playwright exercises the manager and preview together in every framework: switching and clearing, CSS appearance, navigation cleanup, URL globals, fixed stories, custom targets, callbacks, and standalone previews. CI runs both suites and retains browser failure artifacts.

## Migrating from 6.x

- Upgrade Storybook and its framework package to 10, then install version 10 of this addon.
- Keep `parameters.themes` and your CSS. The main options and legacy array configuration are supported.
- Remove `storybook-addon-themes/register` and framework-specific imports (`/react`, `/vue`, `/svelte`, `/html`). Register only `storybook-addon-themes` in `main.ts`; its preset adds the preview decorator automatically.
- Replace the old `Decorator` parameter with a regular framework decorator that reads `context.globals.theme`, as shown above. This removes framework-specific component and slot contracts.
- Move `onChange` browser effects to preview configuration. It no longer executes in the manager, and runs on initial mount as well as changes.
- Migrate `storiesOf`/`addDecorator` to CSF and preview configuration. Vue means Vue 3; Svelte means Svelte 5.
- Storybook 11 prereleases are not included in the peer range or compatibility promise.

## Package maintenance

The build follows the [official Addon Kit](https://github.com/storybookjs/addon-kit) and [Storybook 10 migration guide](https://storybook.js.org/docs/addons/addon-migration-guide): TypeScript, tsup, ESM exports, a lightweight preset, separate manager and preview bundles, and Storybook-provided manager dependencies externalized. See [PUBLISHING.md](https://github.com/tonai/storybook-addon-themes/blob/10.x/PUBLISHING.md) for release checks.

MIT licensed.
