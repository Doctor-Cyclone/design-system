# Design System

## 1. Цель проекта

Разработать production-oriented библиотеку UI-компонентов для React-приложений.

Проект должен демонстрировать:

- проектирование API переиспользуемых компонентов;
- accessibility;
- работу с design tokens;
- light/dark theme;
- Storybook;
- unit/component testing;
- визуальное тестирование компонентов;
- публикацию библиотеки как npm package;
- версионирование библиотеки;
- CI/CD для проверки и сборки пакета.

Проект не должен зависеть от backend.

---

## 2. Основной стек

Обязательно:

- React 19
- TypeScript strict
- Vite
- Storybook
- CSS Modules
- Vitest
- React Testing Library
- axe / storybook-addon-a11y
- pnpm
- Changesets
- ESLint
- Prettier
- GitHub Actions

Дополнительно:

- Playwright для Storybook interaction/e2e tests
- tsup для сборки npm package
- Chromatic либо локальный visual regression workflow

Не использовать готовые UI-библиотеки вроде MUI или Ant Design.

Допустимо использовать низкоуровневые primitives вроде Radix только для особо сложных accessibility-сценариев, но основные компоненты желательно реализовать самостоятельно.

---

## 3. Архитектура

Репозиторий должен быть организован как библиотека, а не обычное приложение.

Пример:

```text
src/
  components/
    Button/
    Input/
    Select/
    Checkbox/
    Radio/
    Switch/
    Modal/
    Dropdown/
    Tooltip/
    Tabs/
    Toast/
    Pagination/
    Table/
  hooks/
  tokens/
  styles/
  utils/
  index.ts
```

У каждого компонента:

```text
Button/
  Button.tsx
  Button.types.ts
  Button.module.css
  Button.stories.tsx
  Button.test.tsx
  index.ts
```

Запрещены deep imports из внутренних файлов библиотеки.

Публичный API должен экспортироваться через `index.ts`.

---

## 4. Design Tokens

Создать систему design tokens.

Минимальные группы:

- colors;
- typography;
- spacing;
- border radius;
- shadows;
- z-index;
- transitions.

Не использовать конкретные цвета непосредственно внутри компонентов.

Плохо:

```css
color: #ffffff;
```

Хорошо:

```css
color: var(--color-text-primary);
```

Нужно реализовать:

- light theme;
- dark theme;
- переключение темы;
- сохранение выбора пользователя;
- поддержку `prefers-color-scheme`.

---

## 5. Компоненты

### Button

Поддержать:

- primary;
- secondary;
- danger;
- ghost;
- loading;
- disabled;
- icon-only;
- размеры `sm / md / lg`.

Accessibility:

- корректный `button`;
- `aria-label` для icon-only;
- focus-visible;
- disabled state.

### Input

Поддержать:

- label;
- placeholder;
- hint;
- error;
- disabled;
- required;
- prefix/suffix;
- controlled API.

Нужно корректно связать:

```text
label
input
description
error
```

через `id`, `aria-describedby`, `aria-invalid`.

### Checkbox / Radio / Switch

Поддержать:

- keyboard navigation;
- focus states;
- disabled;
- controlled/uncontrolled API.

### Modal / Dialog

Поддержать:

- focus trap;
- закрытие через Escape;
- закрытие по overlay;
- возврат focus на элемент, открывший modal;
- блокировку scroll;
- правильные `role` и `aria-*`.

### Select

Поддержать:

- открытие с клавиатуры;
- выбор клавишами;
- Escape;
- Enter;
- поиск;
- disabled options;
- правильное управление focus.

### Dropdown Menu

Поддержать:

- keyboard navigation;
- ArrowUp / ArrowDown;
- Enter;
- Escape;
- click outside;
- focus management.

### Tooltip

Поддержать:

- hover;
- keyboard focus;
- delay;
- `aria-describedby`.

### Tabs

Поддержать:

- keyboard navigation;
- ArrowLeft / ArrowRight;
- Home / End;
- `role="tablist"`;
- `role="tab"`;
- `role="tabpanel"`.

### Toast

Реализовать:

```ts
toast.success(...)
toast.error(...)
toast.info(...)
```

Поддержать:

- несколько уведомлений;
- auto close;
- manual close;
- `aria-live`.

---

## 6. Storybook

Для каждого компонента должны быть stories.

Минимум:

- Default;
- все variants;
- disabled;
- loading;
- error;
- edge cases.

Например для Button:

```text
Default
Variants
Sizes
Loading
Disabled
IconButton
LongText
```

В Storybook должна быть отдельная страница:

```text
Design Tokens
```

с отображением:

- colors;
- spacing;
- typography;
- shadows;
- radius.

---

## 7. Accessibility

Проект должен соответствовать базовым требованиям WCAG.

Обязательно проверить:

- keyboard-only navigation;
- focus visibility;
- semantic HTML;
- `aria-*`;
- contrast;
- screen reader labels;
- focus management в overlay-компонентах.

Storybook должен автоматически запускать accessibility checks.

---

## 8. Тестирование

Использовать:

```text
Vitest
React Testing Library
user-event
```

Тестировать поведение, а не внутреннюю реализацию.

Пример Button:

```text
рендерится
вызывает onClick
не вызывает onClick при disabled
показывает loading
доступен с клавиатуры
```

Modal:

```text
открывается
закрывается Escape
возвращает focus
не позволяет взаимодействовать с background
```

Select:

```text
открывается keyboard
позволяет выбрать option
закрывается Escape
```

---

## 9. Visual Regression

Добавить visual regression хотя бы для:

- Button;
- Input;
- Modal;
- Select;
- dark theme.

Допускается Chromatic либо Playwright screenshots.

---

## 10. Сборка библиотеки

Библиотека должна собираться отдельно.

Результат:

```text
dist/
  index.js
  index.d.ts
```

Поддержать:

- ESM;
- tree shaking;
- TypeScript declarations.

React не должен попадать внутрь bundle.

Он должен быть `peerDependency`.

---

## 11. Версионирование

Использовать Changesets.

Пример workflow:

```text
feature branch
→ PR
→ changeset
→ merge
→ version package
→ changelog
→ npm publish
```

Поддержать:

- patch;
- minor;
- major.

---

## 12. CI

GitHub Actions должен выполнять:

```text
install
↓
lint
↓
typecheck
↓
unit tests
↓
build
↓
storybook build
```

PR нельзя считать успешным при падении одного из этапов.

---

## 13. README

README должен быть полноценной частью проекта.

Структура:

```text
Overview
Motivation
Tech Stack
Architecture
Design Tokens
Accessibility
Testing
Package API
Installation
Usage
Versioning
CI/CD
Development
```

Добавить примеры:

```tsx
import { Button, Modal } from '@username/ui';
```

---

## 14. Definition of Done

Проект считается завершённым, когда:

- минимум 10 UI-компонентов;
- все компоненты имеют Storybook stories;
- основные интерактивные компоненты доступны с клавиатуры;
- есть light/dark theme;
- design tokens используются во всех компонентах;
- unit/component tests проходят;
- accessibility checks проходят;
- библиотека собирается как package;
- настроены Changesets;
- настроен CI;
- README описывает архитектурные решения.

---
