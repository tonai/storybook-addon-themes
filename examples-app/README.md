# Example apps

Run commands from the repository root after `npm ci` and `npm run build`.

| Workspace                     | Renderer                         | Development port |
| ----------------------------- | -------------------------------- | ---------------- |
| `examples-app/react`          | React 19 + Vite                  | 6006             |
| `examples-app/vue3`           | Vue 3 + Vite                     | 6007             |
| `examples-app/svelte`         | Svelte 5 + Vite                  | 6008             |
| `examples-app/html`           | HTML + Vite                      | 6009             |
| `examples-app/preact`         | Preact + Vite                    | 6010             |
| `examples-app/web-components` | Lit + Vite                       | 6011             |
| `examples-app/angular`        | Angular 21 + Angular CLI/Webpack | 6012             |

Each workspace has its own `.storybook/main.ts`, `.storybook/preview.ts`, and native CSF stories. Theme definitions and CSS live in `shared/`. All apps register `storybook-addon-themes` by package name, so broken package entry points fail locally as they would for users.

```sh
npm run storybook -w examples-app/svelte
npm run build-storybook -w examples-app/svelte
```

For live addon edits, also run `npm run build -- --watch` in another terminal. The app itself does not need rebuilding for story or style changes.

Playground stories demonstrate the default theme, per-story defaults, disabled/non-clearable behavior, root and custom targets, fixed globals, a different theme list, and preview callbacks. The Docs page demonstrates automatic decorator registration in documentation previews. To copy an example into another repository, install this addon and copy the shared theme configuration and CSS alongside your preview file.

`npm run test:e2e` builds all workspaces and starts static servers on ports 6106–6112. `npm run test:e2e:built -- --project=react` reruns the React tests after a build. Failures retain Playwright traces and an HTML report; open it with `npx playwright show-report`.
