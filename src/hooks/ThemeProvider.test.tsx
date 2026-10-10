import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';
let notify: ((event: MediaQueryListEvent) => void) | undefined;
beforeEach(() => {
  localStorage.clear();
  notify = undefined;
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addEventListener: (_: string, listener: typeof notify) => {
        notify = listener;
      },
      removeEventListener: vi.fn(),
    })),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
});
function Controls() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <>
      <output aria-label="Resolved theme">{resolvedTheme}</output>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </>
  );
}
it('persists the user preference across remounts', async () => {
  const first = render(
    <ThemeProvider>
      <Controls />
    </ThemeProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Dark' }));
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(localStorage.getItem('doctor-cyclone-ui-theme')).toBe('dark');
  first.unmount();
  render(
    <ThemeProvider>
      <Controls />
    </ThemeProvider>,
  );
  expect(screen.getByLabelText('Resolved theme')).toHaveTextContent('dark');
});
it('follows OS changes only when system preference is selected', async () => {
  render(
    <ThemeProvider>
      <Controls />
    </ThemeProvider>,
  );
  act(() => notify?.({ matches: true } as MediaQueryListEvent));
  expect(screen.getByLabelText('Resolved theme')).toHaveTextContent('dark');
  await userEvent.click(screen.getByRole('button', { name: 'Dark' }));
  act(() => notify?.({ matches: false } as MediaQueryListEvent));
  expect(screen.getByLabelText('Resolved theme')).toHaveTextContent('dark');
  await userEvent.click(screen.getByRole('button', { name: 'System' }));
  expect(screen.getByLabelText('Resolved theme')).toHaveTextContent('light');
});
it('ignores corrupt storage and still works when persistence is blocked', async () => {
  localStorage.setItem('doctor-cyclone-ui-theme', 'invalid');
  const blocked = vi
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new Error('Storage blocked');
    });
  render(
    <ThemeProvider>
      <Controls />
    </ThemeProvider>,
  );
  expect(screen.getByLabelText('Resolved theme')).toHaveTextContent('light');
  await userEvent.click(screen.getByRole('button', { name: 'Dark' }));
  expect(screen.getByLabelText('Resolved theme')).toHaveTextContent('dark');
  blocked.mockRestore();
});
it('synchronizes preference changes from another tab', () => {
  render(
    <ThemeProvider>
      <Controls />
    </ThemeProvider>,
  );
  act(() =>
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'doctor-cyclone-ui-theme',
        newValue: 'dark',
      }),
    ),
  );
  expect(screen.getByLabelText('Resolved theme')).toHaveTextContent('dark');
});
