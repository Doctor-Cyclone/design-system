# Specification coverage — 12 October 2026

| Requirement                               | Implementation / evidence                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React 19, strict TS, library architecture | Components/types/styles/stories/tests per component; one public barrel; Vite ESM with external React; strict consumer build                                   |
| At least ten components                   | Eleven: Button, Input, Checkbox, Radio, Switch, Modal, Select, Dropdown, Tooltip, Tabs, Toast                                                                 |
| Semantic tokens and themes                | Color, typography, spacing, radius, shadow, layering, motion; light/dark/system, persisted preference and OS changes                                          |
| Storybook coverage and tokens page        | Default/state/edge stories, Design Tokens showcase, theme toolbar, accessibility addon                                                                        |
| Behavior and keyboard                     | 55 component tests plus ten Chromium interaction scenarios, including focus trap, restoration, nested Escape, disabled options, tooltip and toast timing      |
| Accessibility checks                      | 22 Chromium axe tests in both themes, contrast enabled; representative states, known incomplete results checked explicitly                                    |
| Visual regression                         | Ten inspected and committed PNGs: Button/Input/Modal/Select/focus × light/dark; CI compares without updating                                                  |
| Package distribution                      | Actual tarball installation, ESM exports, strict declarations, extracted CSS and consumer Vite build pass; deep imports blocked                               |
| Changesets and changelog                  | Patch/minor/major workflow configured; accumulated changes applied to 0.2.0 and CHANGELOG.md generated                                                        |
| CI/CD                                     | Ubuntu checks/package consumer plus Windows Chromium checks; reports uploaded; manual archive/optional publish workflow                                       |
| Documentation                             | README overview/motivation/stack/architecture/tokens/a11y/testing/API/installation/usage/versioning/CI/development, API guide, testing and release procedures |
| npm publication                           | Deferred by the agreed scope. No npm publication or publisher credentials/access configured. Install a local tarball until a separately authorized release.   |

The three-day repository milestone is complete after the final checks and pushes. The full specification's npm-publication item remains outstanding. CI does not imply configured branch protection. Pagination and Table occur only in the specification's architecture example and are outside the agreed mandatory component set.

Automated verification is limited to representative component states in Chromium, with visual baselines for Windows. Other browser engines, screen-reader announcements, all edge-state contrast, SSR hydration/first paint and mobile/collision positioning are not claimed as fully audited. API limitations are documented in [COMPONENT_API.md](COMPONENT_API.md).
