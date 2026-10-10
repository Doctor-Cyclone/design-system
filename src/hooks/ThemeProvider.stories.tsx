import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider, useTheme, type Theme } from './ThemeProvider';
import { Button } from '../components/Button';
function ThemeControls() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <section
      data-theme={resolvedTheme}
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text-primary)',
        padding: 'var(--space-4)',
      }}
    >
      <h2>Theme preference</h2>
      <p>
        Selected: {theme}; resolved: {resolvedTheme}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        {(['light', 'dark', 'system'] as Theme[]).map((option) => (
          <Button
            key={option}
            variant={option === theme ? 'primary' : 'secondary'}
            onClick={() => setTheme(option)}
            aria-pressed={option === theme}
          >
            {option}
          </Button>
        ))}
      </div>
    </section>
  );
}
const Demo = () => (
  <ThemeProvider>
    <ThemeControls />
  </ThemeProvider>
);
export default {
  title: 'Design Tokens/Theme switching',
  component: Demo,
} satisfies Meta<typeof Demo>;
export const Default: StoryObj<typeof Demo> = {};
