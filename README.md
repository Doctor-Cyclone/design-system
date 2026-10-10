# Design System

A React 19 component library being developed on 10–12 October 2026. Current milestone: repository foundation. This is not yet the completed specification or an npm release.

## Overview

Reusable, accessible UI components with semantic design tokens, light/dark themes and a single public entry point.

## Motivation

Build a documented component API with verified keyboard behavior rather than a backend-dependent application.

## Tech Stack

React 19, strict TypeScript, Vite library mode, CSS Modules, Storybook, Vitest, React Testing Library, axe, pnpm, Changesets, ESLint, Prettier and GitHub Actions.

## Architecture

`src/components/<Component>/` will contain implementation, types, CSS Module, stories, behavior tests and a local barrel. Consumers import only from the package root; package exports prevent internal deep imports. React is a peer dependency and stays outside the ESM bundle.

## Design Tokens

Semantic color, typography, spacing, radius, shadow, z-index and motion tokens arrive in day 1's second push.

## Accessibility

Native controls where appropriate. Storybook includes the accessibility addon; automated browser checks and overlay focus verification are scheduled for days 2–3. Passing a build alone does not establish accessibility compliance.

## Testing

`pnpm test` runs component tests in jsdom. Browser and visual regression checks arrive on day 3.

## Package API

The foundation currently exports `libraryVersion`. Components arrive incrementally; do not rely on future exports until their milestone lands.

## Installation

The package is not published to npm yet. Clone this repository and run `pnpm install`. The intended npm name is `@doctor-cyclone/ui`; its availability has not been verified.

## Usage

Future consumer usage after the component milestone:

```tsx
import { Button } from '@doctor-cyclone/ui';
import '@doctor-cyclone/ui/styles.css';
```

## Versioning

Changesets records patch/minor/major changes. npm publication is a separate action from completing this repository.

## CI/CD

GitHub Actions installs from the lockfile and checks formatting, lint, types, tests, library build and Storybook build. Branch protection and npm credentials are not configured in this milestone.

## Development

Node 24 and pnpm 11.25.0. Run `pnpm dev` for Storybook, `pnpm build` for `dist/index.js`, `dist/index.d.ts` and styles, and `pnpm check` for all current checks.

See [the three-day plan](docs/DEVELOPMENT_PLAN.md) and [the source specification](docs/SPEC.md).
