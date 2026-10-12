# Design System

A React 19 component library developed on 10–12 October 2026. Version 0.2.0 includes eleven components, semantic design tokens, persistent light/dark themes, Storybook and browser regression checks. The package is ready for local tarball installation; it has not been published to npm.

## Overview

Reusable, accessible UI components with semantic design tokens, light/dark themes and a single public entry point.

## Motivation

Build a documented component API with verified keyboard behavior rather than a backend-dependent application.

## Tech Stack

React 19, strict TypeScript, Vite library mode, CSS Modules, Storybook, Vitest, React Testing Library, axe, Playwright, pnpm, Changesets, ESLint, Prettier and GitHub Actions.

## Architecture

`src/components/<Component>/` contains implementation, types, CSS Module, stories, behavior tests and a local barrel. Consumers import only from the package root; package exports prevent internal deep imports. React is a peer dependency and stays outside the ESM bundle.

## Design Tokens

Semantic CSS variables cover color, typography, spacing, radius, shadows, z-index, motion and control sizes. Components use variables rather than embedded colors. `ThemeProvider` supports `light`, `dark` and `system`, persists the preference in local storage, listens for OS changes and synchronizes browser tabs. Storage failures leave theme selection usable in memory. Mount one provider per document. Tokens also follow `prefers-color-scheme` without JavaScript when no explicit document theme is set.

The Storybook toolbar switches palettes, and the Design Tokens page displays colors, spacing, typography, shadows and radii. Reduced-motion preferences remove transitions and the loading spinner's animation.

## Accessibility

Button and form inputs use native HTML controls. Labels and descriptions are associated through stable IDs; error inputs expose `aria-invalid`. Icon-only buttons require an `aria-label` in the TypeScript API. Related radios should use the same `name` inside a fieldset with a legend; native arrow-key navigation is retained. All controls have visible keyboard focus states.

Storybook includes the accessibility addon with violations configured as errors. The component composition has an automated axe check in jsdom; color contrast is excluded there because jsdom has no layout engine. Browser tests scan all eleven components in both themes, including open dialogs/popups, with WCAG A/AA rules and color contrast enabled. Known axe results requiring review have explicit DOM/closed-state checks; unexpected review results fail. Modal focus containment, nested Escape handling and background isolation are tested in Chromium. Automated checks cover representative states and do not replace a screen-reader or full WCAG audit.

## Testing

`pnpm test` runs 55 behavior and accessibility tests in jsdom: keyboard activation, disabled/loading behavior, controlled inputs, description associations, radio navigation, indeterminate state, theme persistence, OS changes, cross-tab synchronization and blocked storage, modal focus restoration, Select search/selection, menu navigation, tab activation, tooltip delay/dismissal and paused toast lifetimes.

`pnpm test:browser` runs 42 Chromium checks: 22 accessibility scans, ten interaction tests and ten screenshot comparisons. Inspected Windows baselines cover Button, Input, Modal, Select and keyboard focus in both themes. `pnpm package:check` installs the actual packed tarball into a separate consumer, checks strict types/public ESM exports/CSS and builds a Vite app. See [testing instructions and verification limits](docs/TESTING.md).

## Package API

Current root exports: `Button`, `Input`, `Checkbox`, `Radio`, `Switch`, `ThemeProvider`, `useTheme`, `libraryVersion`, `Modal`, `Select`, `Dropdown`, `Tooltip`, `Tabs`, `ToastProvider`, `toast` and component prop types. See [Component API](docs/COMPONENT_API.md) for overlay and notification examples.

Inputs use the familiar React native API: `value`/`onChange` or `defaultValue`; toggle controls use `checked`/`onChange` or `defaultChecked`. Input labels are required; `hint`, `error`, `prefix` and `suffix` are optional. Button supports four variants, three sizes, loading, disabled and labeled icon-only usage. Checkbox additionally supports `indeterminate`.

## Installation

The package is not published to npm yet. To develop it:

```sh
git clone https://github.com/Doctor-Cyclone/design-system.git
cd design-system
pnpm install --frozen-lockfile
pnpm dev
```

Storybook opens at `http://localhost:6006`. To install the current library into your own React 19 application, create a local tarball:

```sh
# In the library repository:
pnpm build
pnpm pack --pack-destination .package-check
# In your application, use the absolute path to the generated .tgz:
pnpm add /path/to/doctor-cyclone-ui-0.2.0.tgz
```

On Windows, quote the absolute file path if it contains spaces. Import the CSS explicitly, as shown below. The intended npm name is `@doctor-cyclone/ui`; npm scope ownership and name availability require verification before first publication.

## Usage

The following API is implemented. Until npm publication, use a locally packed tarball or workspace dependency:

```tsx
import { useState } from 'react';
import {
  Button,
  Input,
  Switch,
  ThemeProvider,
  useTheme,
} from '@doctor-cyclone/ui';
import '@doctor-cyclone/ui/styles.css';

function Preferences() {
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        hint="Use your work address."
        required
      />
      <Switch
        label="Notifications"
        checked={notifications}
        onChange={(event) => setNotifications(event.target.checked)}
      />
      <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle theme
      </Button>
      <Button type="submit">Save</Button>
    </form>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <Preferences />
    </ThemeProvider>
  );
}
```

## Versioning

Changesets records patch/minor/major changes. Run `pnpm changeset` with a consumer-facing change, then `pnpm version-packages` when preparing a release. This applies accumulated changes and generates [CHANGELOG.md](CHANGELOG.md). The exported `libraryVersion` is injected from package metadata during builds, so it follows Changesets. Current prepared version: 0.2.0.

## CI/CD

GitHub Actions checks formatting, lint, types, unit tests, both builds and the package consumer on Ubuntu. A separate Windows job runs Chromium accessibility, interactions and screenshot comparisons; reports/traces are uploaded. Both jobs run for pushes and pull requests and fail on errors.

The manual Release package workflow reuses those checks and produces a tarball artifact. Publication defaults to off. Its optional publish job requires a separately configured npm trusted publisher and explicit manual selection; no npm credentials or publisher access were configured here. See [release procedure](docs/RELEASING.md). Branch protection remains a separate repository setting.

## Development

Node 24 and pnpm 11.25.0. Run `pnpm dev` for Storybook, `pnpm build` for `dist/index.js`, `dist/index.d.ts` and styles, and `pnpm check` for formatting, lint, types, component tests and both builds. For full verification also run `pnpm exec playwright install chromium`, `pnpm test:browser` and `pnpm package:check`. Browser tests manage their own preview server; stop a development Storybook on port 6006 before running them.

See [architecture decisions](docs/ARCHITECTURE.md), [the three-day plan](docs/DEVELOPMENT_PLAN.md), [specification coverage](docs/SPEC_COVERAGE.md) and [the source specification](docs/SPEC.md).
