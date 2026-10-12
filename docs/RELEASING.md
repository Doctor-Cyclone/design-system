# Versioning and release

Version 0.2.0 is prepared locally with Changesets and a generated changelog. It is not an npm release. Ordinary GitHub pushes run checks; they do not publish packages or start future development.

## Prepare a version

1. Make a feature/fix branch and add `pnpm changeset`: patch for a compatible fix, minor for a compatible API addition, major for a breaking change.
2. Open a pull request containing the code and changeset. Both CI jobs must pass. Configure GitHub branch protection separately if merge blocking is required.
3. After merging, run `pnpm version-packages` for the accumulated changes. Review package metadata and changelog, run full checks, and commit the version preparation.

The runtime `libraryVersion` is injected from `package.json` in library, Storybook and Vitest builds. Package verification asserts that it matches the installed package version. Changesets itself does not build or publish during version preparation.

## Inspect an archive

```sh
pnpm check
pnpm test:browser
pnpm package:check
pnpm pack --pack-destination .package-check
```

Install the generated tarball into a React 19 application and import `@doctor-cyclone/ui/styles.css`. The package includes the ESM bundle, declarations, CSS, README, license and changelog. Source, Storybook, tests and development dependencies are excluded from the archive.

Alternatively, manually run **Release package (manual)** from GitHub Actions on `main` with **publish = false**. It reuses both CI jobs, requires applied changesets, builds the library and uploads a `packed-ui` artifact. No registry write occurs in that mode.

## Publish separately

Publication has not been performed, and registry access has not been configured. Before authorizing a first release, verify ownership of the npm scope/name and complete the npm account's publishing setup. A first publication may require an interactive maintainer action before trusted-publisher package settings are available.

For later OIDC releases, configure npm trusted publishing for GitHub owner `Doctor-Cyclone`, repository `design-system`, workflow filename `release.yml` and environment `npm`, allowing direct publishing. Add required reviewers to the GitHub `npm` environment if desired. These settings are prerequisites, not changes made by this project. npm's current requirements are Node ≥22.14 and npm CLI ≥11.5.1; the workflow uses Node 24.

After separate authorization and setup, manually run the release workflow on `main` with **publish = true**. The publish job waits for both quality checks and packing, downloads the same tarball artifact, and uses `npm publish --provenance --access public` through OIDC. It does not use a saved npm token. A failed quality or packing job prevents publication. Inspect the registry result before creating a release tag; this workflow does not create Git tags or GitHub releases.

References: [Changesets versioning](https://changesets.dev/guide/versioning-and-publishing), [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).
