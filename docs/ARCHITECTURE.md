# Architecture decisions

## Package boundary

The project is a library, with Storybook as its development surface. Vite builds ESM; TypeScript emits declarations separately. React, React DOM and the JSX runtime are external. Consumers import public symbols from the package root and styles from the explicitly exported CSS entry. `sideEffects` retains CSS while allowing unused JavaScript exports to be removed by a consumer bundler.

CSS Modules isolate component class names; semantic CSS variables remain available for theming. Styles are opt-in through `@doctor-cyclone/ui/styles.css` because Vite extracts library CSS. No application-wide reset is imposed on consumers.

## Accessibility choices

Form controls use native elements rather than reconstructing keyboard behavior. Radio grouping belongs to the consumer's semantic form structure. Button defaults to `type="button"` to avoid unexpected form submission. Loading preserves the accessible button name, exposes `aria-busy` and disables activation. CSS focus indicators follow keyboard focus; Input uses focus-within so adornments share a single field boundary.

Checkbox sets the native indeterminate property and exposes mixed state; indeterminate is separate from the checked value. Switch retains an actual checkbox input with the switch role and stable label, including controlled and uncontrolled form semantics.

## Theme ownership

ThemeProvider owns the document's `data-theme` attribute while mounted and restores the previous value on cleanup. Mount one provider per document. Preference and resolved palette are separate values: system preference responds to media-query changes, while a chosen palette stays fixed. Local storage is optional; exceptions do not break rendering. Future work should verify SSR hydration and first-paint behavior before promising server-rendering support.

## Verification boundaries

Day 1 tests validate observable behavior and run axe against a composed form. jsdom cannot verify rendered contrast or real-browser layout. Storybook's addon supports interactive accessibility inspection; its build does not itself run the planned browser test suite. Day 3 adds browser accessibility and visual regression checks. Visual baselines must be inspected before accepting them.

## Future overlays

Day 2 should add tested focus management, background inertness and scroll locking for Modal, plus an explicit combobox/listbox contract for searchable Select. Shared overlay utilities may be introduced after the first implementations identify actual common behavior. Avoid adopting a large UI library.
