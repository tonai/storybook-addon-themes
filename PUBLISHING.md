# Releases with Changesets

The publishable addon lives in `packages/storybook-addon-themes`. The root is a private npm workspace; all seven example apps are private and excluded from Changesets. This layout lets Changesets discover the addon without ever publishing an example.

## One-time setup

1. In GitHub **Settings → Actions → General**, enable **Allow GitHub Actions to create and approve pull requests**. The workflow grants its own scoped permissions; the repository-wide default can remain read-only.
2. Create a GitHub environment named **`npm`** and restrict deployment branches to **`10.x`**. Add required reviewers if you want approval before a release run. The environment protects the job that both opens release PRs and publishes.
3. In the npm settings for **`storybook-addon-themes`**, add a **GitHub Actions trusted publisher** with:
   - Organization/user: `tonai`
   - Repository: `storybook-addon-themes`
   - Workflow filename: `release.yml`
   - Environment: `npm`
4. Push the workflow to `10.x` once ready to enable releases. No npm token is needed. npm 11 uses GitHub OIDC and the workflow requests provenance.

The existing npm package must be administered by an account that can configure its trusted publisher. Configure these settings directly in GitHub and npm.

The workflow follows [Changesets Action v2](https://github.com/changesets/action) with Changesets CLI v3 and [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

## Everyday workflow

1. Implement a change, then run `npm run changeset`.
2. Select `storybook-addon-themes`, select a bump, and write a user-facing release note:
   - **patch**: compatible fixes.
   - **minor**: compatible functionality.
   - **major**: breaking changes. Coordinate a new release branch if changing Storybook compatibility.
3. Include the generated `.changeset/*.md` file in your PR.
4. Merge the feature PR into `10.x`. The Release workflow runs the full reusable CI workflow: lint, types, unit coverage, formatting, all example builds, browser tests, and a package-content check.
5. Changesets opens or updates **chore: release Storybook 10 addon**, combining pending notes. The version PR updates the addon version, its changelog, and the root lockfile.
6. Review and merge that PR. After the same validation passes on the merged commit, Changesets publishes to npm, pushes the package version tag, and creates a GitHub release from the changelog.

The default npm dist-tag is **`latest`**. Only `10.x` in the upstream repository can release. Release runs are serialized and never canceled mid-publication. Ordinary PR workflows have read-only permissions and cannot publish.

Documentation/tooling changes do not need a changeset. An optional `npm run changeset -- --empty` records that no release is needed.

## Release PR checks and branch protection

GitHub suppresses most workflow triggers from PRs created with the default `GITHUB_TOKEN`. If required PR checks prevent merging the generated version PR, configure the optional **`RELEASE_GITHUB_TOKEN`** secret with a fine-grained token (or arrange a GitHub App token) that has repository contents and pull-request write access. The action uses this token to create/update the PR, allowing normal PR CI to run. Never put an npm token in this secret.

With the default token, a maintainer can instead run the **CI** workflow manually on the release PR branch, or push a reviewed change to that branch to trigger PR CI. Manual dispatch requires the workflow to exist on GitHub's default branch. Regardless of PR checks, publication always depends on fresh CI on the merged `10.x` commit.

## Commands and recovery

```sh
npm run changeset                    # add a release note
npm run changeset:status             # inspect the pending version plan
npm run version-packages             # locally preview version/changelog/lock changes
npm pack --dry-run -w storybook-addon-themes
```

`version-packages` modifies files and consumes pending changesets, but does not commit or publish. Usually leave it to the release PR automation. Changesets' `commit` setting is false.

`npm run release` builds and publishes unpublished versions; it is intended for the trusted GitHub workflow. Do not run it merely to check a release. For a local package smoke test use `npm pack -w storybook-addon-themes` and install that tarball into an external Storybook project.

If publication fails, correct the credentials/configuration or failing check and rerun the Release workflow on `10.x`. Changesets compares versions with npm, skips already-published versions, and can recover a publish that completed before its Git tag was created. If the remote tag exists but the GitHub release is missing, create that release from the existing tag and the package changelog; do not republish the npm version. Never change the contents of an already-published version; use a new patch changeset for corrections.

The addon has its own changelog at [`packages/storybook-addon-themes/CHANGELOG.md`](packages/storybook-addon-themes/CHANGELOG.md). Package README and license files live beside its manifest and are included in the tarball. Example apps, tests, and development dependencies are not published.
