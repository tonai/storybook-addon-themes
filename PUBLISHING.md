# Publishing

Use Node 22 LTS and npm. Release from `10.x` for Storybook 10.

1. Run `npm ci`, `npm run check`, and `npm run format:check`.
2. Run `npx playwright install chromium` and `npm run test:e2e`.
3. Update `CHANGELOG.md` and the root package version, then refresh the lockfile with `npm install --package-lock-only`.
4. Inspect `npm pack --dry-run`. Only the ESM addon bundles, type declarations, preset entry point, README, and license should ship. Examples and development dependencies must not ship.
5. Install the tarball from `npm pack` into an external Storybook 10 project and verify its toolbar and preview.
6. After review, publish with `npm publish --access public`. Publishing is deliberately not automatic in pull request CI.

`prepack` builds the addon from source. Storybook is a peer dependency. React and icons are development dependencies because Storybook provides them in the manager; the preview has no React runtime dependency.
