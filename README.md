# Design System

A React 19 component library being developed on 10–12 October 2026. Day 1 includes five form controls, semantic tokens and persistent themes. Day 2 now adds Modal and searchable Select. Overlay components and browser regression checks are scheduled for the next two days. The package is not published to npm yet.

## Overview

Reusable, accessible UI components with semantic design tokens, light/dark themes and a single public entry point.

## Motivation

Build a documented component API with verified keyboard behavior rather than a backend-dependent application.

## Tech Stack

React 19, strict TypeScript, Vite library mode, CSS Modules, Storybook, Vitest, React Testing Library, axe, pnpm, Changesets, ESLint, Prettier and GitHub Actions.

## Architecture

`src/components/<Component>/` will contain implementation, types, CSS Module, stories, behavior tests and a local barrel. Consumers import only from the package root; package exports prevent internal deep imports. React is a peer dependency and stays outside the ESM bundle.

## Design Tokens

Semantic CSS variables cover color, typography, spacing, radius, shadows, z-index, motion and control sizes. Components use variables rather than embedded colors. `ThemeProvider` supports `light`, `dark` and `system`, persists the preference in local storage, listens for OS changes and synchronizes browser tabs. Storage failures leave theme selection usable in memory. Mount one provider per document. Tokens also follow `prefers-color-scheme` without JavaScript when no explicit document theme is set.

The Storybook toolbar switches palettes, and the Design Tokens page displays colors, spacing, typography, shadows and radii. Reduced-motion preferences remove transitions and the loading spinner's animation.

## Accessibility

Button and form inputs use native HTML controls. Labels and descriptions are associated through stable IDs; error inputs expose `aria-invalid`. Icon-only buttons require an `aria-label` in the TypeScript API. Related radios should use the same `name` inside a fieldset with a legend; native arrow-key navigation is retained. All controls have visible keyboard focus states.

Storybook includes the accessibility addon with violations configured as errors. The component composition has an automated axe check in jsdom; color contrast is excluded there because jsdom has no layout engine. Full browser accessibility checks, contrast verification and overlay focus testing remain scheduled for days 2–3. Passing a build alone does not establish WCAG compliance.

## Testing

`pnpm test` currently runs 35 behavior and accessibility tests in jsdom: keyboard activation, disabled/loading behavior, controlled inputs, description associations, radio navigation, indeterminate state, theme persistence, OS changes, cross-tab synchronization and blocked storage. Browser and visual regression checks arrive on day 3.

## Package API

Current root exports: `Button`, `Input`, `Checkbox`, `Radio`, `Switch`, `ThemeProvider`, `useTheme`, `libraryVersion`, `Modal`, `Select` and component prop types. Dropdown, Tooltip, Tabs and Toast arrive in the second day-2 milestone.

Inputs use the familiar React native API: `value`/`onChange` or `defaultValue`; toggle controls use `checked`/`onChange` or `defaultChecked`. Input labels are required; `hint`, `error`, `prefix` and `suffix` are optional. Button supports four variants, three sizes, loading, disabled and labeled icon-only usage. Checkbox additionally supports `indeterminate`.

## Installation

The package is not published to npm yet. Clone this repository and run `pnpm install`. The intended npm name is `@doctor-cyclone/ui`; its availability has not been verified.

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

Changesets records patch/minor/major changes. npm publication is a separate action from completing this repository.

## CI/CD

GitHub Actions installs from the lockfile and checks formatting, lint, types, tests, library build and Storybook build on pushes and pull requests. A failed step fails the job. Browser checks and a release workflow arrive on day 3. Branch protection and npm credentials are not configured in this milestone.

## Development

Node 24 and pnpm 11.25.0. Run `pnpm dev` for Storybook, `pnpm build` for `dist/index.js`, `dist/index.d.ts` and styles, and `pnpm check` for all current checks.

See [the three-day plan](docs/DEVELOPMENT_PLAN.md) and [the source specification](docs/SPEC.md).
