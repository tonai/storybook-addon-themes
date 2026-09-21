# Release notes

Run `npm run changeset` for a user-facing change. Select `storybook-addon-themes`, choose a patch/minor/major bump, and describe the change for users. Commit the generated Markdown file with the implementation.

Only the addon is released. The workspace root and framework examples are private; examples are also explicitly ignored in configuration.

Tooling-only or documentation-only changes need no version bump. Use `npm run changeset -- --empty` if you want to record an intentional no-release change.

Do not run versioning or publishing when preparing ordinary feature PRs. The release workflow maintains a version PR on `10.x`; merging it publishes the new version after CI passes. See [PUBLISHING.md](../PUBLISHING.md) for setup, preparing the initial release, and recovery.
