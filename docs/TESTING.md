# Verification

## Local commands

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm exec playwright install chromium
pnpm test:browser
pnpm package:check
```

`check` runs formatting, lint, strict TypeScript, 55 component tests and both builds. Build Storybook before running browser tests. The browser runner starts and stops its own static preview on port 6006; stop a development Storybook using that port first. `package:check` expects a current library build.

## Browser coverage

42 Chromium tests cover 22 WCAG A/AA scans (one representative state for every component in each palette), ten keyboard/interaction scenarios and ten screenshot comparisons. Dialog and popup content is included. Color contrast is enabled in the browser, unlike the jsdom composition test. Reports attach complete axe output, including results requiring review. This is regression coverage, not a complete accessibility certification or screen-reader audit.

Known axe review cases are checked explicitly: `aria-controls` targets for open Select/Dropdown popups exist and are visible; Select's hint is scanned before the list overlaps it. Unexpected incomplete results fail. The page-level `bypass` rule is disabled only for standalone Storybook canvases, which have no site navigation. Decorative icons are SVG rather than Unicode text. Screen reader announcements and non-text graphical contrast still need human review.

Interaction tests cover native control keyboard behavior, controlled Input, modal focus trap/restoration/inert background, nested dialogs, nested Select Escape, searchable selection, disabled choices, menu activation/outside dismissal, tab navigation, tooltip keyboard dismissal, toast timing/live regions and persistent/system themes.

## Visual comparisons

Committed baselines cover Button variants, Input error, open Modal, open Select and keyboard focus, in both light and dark themes. Baselines were inspected on Windows with Playwright 1.64.0 Chromium at 960 × 720, reduced motion and a fresh browser context. CI uses `windows-2025`; OS-specific snapshot directories prevent comparing Linux and Windows font rendering. Do not accept a new operating-system baseline without inspecting it.

```sh
pnpm test:visual
# Only after an intentional appearance change, on Windows:
pnpm test:visual:update
pnpm exec playwright show-report
```

Review every changed PNG in `tests/browser/screenshots/win32/chromium/visual.spec.ts/` before committing. CI never updates baselines. A 0.5% pixel tolerance permits minor font rasterization differences; it does not replace visual inspection. Reports and failure traces are uploaded for 14 days.

## Package consumer

`package:check` packs the actual distribution, installs that tarball into an isolated consumer under ignored `.package-check/`, compiles strict JSX types and produces a Vite application bundle containing exported CSS/tokens. It checks public ESM runtime exports, blocked internal imports and external React imports in the library bundle. Consumer dependencies come from the registry/cache; this command requires network access on a clean machine. It does not publish anything to npm.

Reference: [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots), [browser accessibility testing](https://playwright.dev/docs/accessibility-testing).
