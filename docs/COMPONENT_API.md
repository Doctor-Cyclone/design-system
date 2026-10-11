# Component API: day 2

All examples import public symbols from `@doctor-cyclone/ui` and include `@doctor-cyclone/ui/styles.css`. Use unique option values, tab values and menu item IDs within each widget.

## Modal

```tsx
const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Open settings</Button>
  <Modal
    open={open}
    onClose={() => setOpen(false)}
    title="Settings"
    description="Update project settings"
  >
    <Input label="Project name" />
    <Button onClick={() => setOpen(false)}>Save</Button>
  </Modal>
</>;
```

`open` is controlled. `title` is the accessible name; optional `description` is associated with the dialog. Escape, the close button and (by default) the backdrop invoke `onClose`. `closeOnOverlay={false}` disables backdrop dismissal. `initialFocusRef` can identify a focus target inside the dialog; otherwise focus moves to the first focusable control. Tab is trapped and background body children become inert. Scroll locking and background state are restored on close; nested dialogs retain parent isolation. The opener regains focus if still mounted. Inner widgets can consume Escape before the dialog handles it. Portal content follows the nearest explicit theme; the document supplies fallback tokens.

## Select

```tsx
<Select
  label="Framework"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue', disabled: true },
    { value: 'svelte', label: 'Svelte' },
  ]}
  value={framework}
  onValueChange={setFramework}
  name="framework"
/>
```

Single selection, editable search, controlled `value`/`onValueChange` or uncontrolled `defaultValue`. Arrow keys open and navigate enabled results; Enter selects, Escape cancels the search, Tab leaves without committing. DOM focus stays on the combobox; `aria-activedescendant` tracks its highlighted option, and keyboard navigation scrolls that option into view. A `name` adds hidden form serialization. `hint`, `error`, `required`, `disabled`, `placeholder` and `emptyMessage` are supported. `required` communicates the requirement to assistive technology; validation of the selected value belongs to the consuming form, because the visible text is a search query rather than the form value.

## Dropdown

```tsx
<Dropdown
  label="Project actions"
  items={[
    { id: 'edit', label: 'Edit', onSelect: editProject },
    {
      id: 'archive',
      label: 'Archive',
      onSelect: archiveProject,
      disabled: true,
    },
    { id: 'delete', label: 'Delete', onSelect: deleteProject, danger: true },
  ]}
/>
```

This is an action menu. ArrowUp/ArrowDown wrap through enabled actions, Home/End jump, and typing a label prefix moves focus. Enter/Space activate the focused native button. Escape restores the trigger, Tab leaves the widget, and outside pointer interaction closes without stealing focus. The trigger is disabled when no actions are available.

## Tooltip

```tsx
<Tooltip content="Save all project changes" delay={400}>
  <Button>Save</Button>
</Tooltip>
```

Supply one focusable child that forwards accessibility and keyboard props to a DOM element. Hover and keyboard focus show the non-interactive text after `delay` milliseconds. The description is appended to existing `aria-describedby`; existing trigger handlers are retained. Escape dismisses the tooltip until focus and hover leave. A short hide grace period allows moving the pointer onto tooltip text. Use an accessible label on the trigger independently of the tooltip. Native disabled buttons do not receive keyboard focus; do not rely on a tooltip to explain a disabled control.

## Tabs

```tsx
<Tabs
  label="Project sections"
  items={[
    { value: 'overview', label: 'Overview', content: <Overview /> },
    { value: 'settings', label: 'Settings', content: <Settings /> },
  ]}
  value={section}
  onValueChange={setSection}
/>
```

Horizontal tabs with automatic activation and roving tabindex. ArrowLeft/ArrowRight wrap through enabled tabs, Home/End jump, and Tab moves into the active panel. Panels remain mounted but inactive panels use `hidden`. Use `defaultValue` for uncontrolled selection. Content should render without network latency; manual activation and vertical orientation are not included in this API.

## Toast

```tsx
<ToastProvider defaultDuration={5000}>
  <Button onClick={() => toast.success('Project saved')}>Save</Button>
</ToastProvider>;

const id = toast.error('Upload failed', { duration: 0 });
toast.info('An update is available');
toast.dismiss(id);
toast.dismiss(); // Dismiss all.
```

Mount one provider per document and call the imperative API from browser events. Global notification state is not suitable for server-request storage. The provider owns dismissal timers while mounted; `duration: 0` persists until manual close. Hover and focus pause timers with the remaining time preserved. Success/info use a persistent polite live region; errors use an assertive region. Messages are plain text, not arbitrary interactive content. Each notification has a labeled close button. Provider unmount clears timers; it does not clear the shared notification store, so the consumer can call `toast.dismiss()` during application teardown if needed.
