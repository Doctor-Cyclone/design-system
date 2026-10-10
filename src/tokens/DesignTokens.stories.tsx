import type { Meta, StoryObj } from '@storybook/react-vite';
const colors = [
  'bg',
  'surface',
  'surface-hover',
  'text-primary',
  'text-secondary',
  'border',
  'accent',
  'on-accent',
  'danger',
  'focus',
] as const;
function DesignTokens() {
  return (
    <article>
      <h1>Design Tokens</h1>
      <p>Use the toolbar to inspect the light and dark palettes.</p>
      <h2>Colors</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        {colors.map((color) => (
          <div key={color}>
            <div
              style={{
                width: '80px',
                height: '60px',
                background: `var(--color-${color})`,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <code>{color}</code>
          </div>
        ))}
      </div>
      <h2>Spacing</h2>
      {[1, 2, 3, 4, 6, 8].map((space) => (
        <div
          key={space}
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'center',
            marginBlock: 'var(--space-2)',
          }}
        >
          <code>space-{space}</code>
          <div
            style={{
              height: 'var(--space-3)',
              width: `var(--space-${space})`,
              background: 'var(--color-accent)',
            }}
          />
        </div>
      ))}
      <h2>Typography</h2>
      {['sm', 'md', 'lg', 'title'].map((size) => (
        <p key={size} style={{ fontSize: `var(--font-size-${size})` }}>
          {size}: The quick brown fox
        </p>
      ))}
      <h2>Radius and shadows</h2>
      <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
        {['sm', 'md', 'lg', 'pill'].map((radius) => (
          <div
            key={radius}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: 'var(--space-6)',
              borderRadius: `var(--radius-${radius})`,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {radius}
          </div>
        ))}
        <div
          style={{
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-lg)',
            background: 'var(--color-surface)',
          }}
        >
          shadow-lg
        </div>
      </div>
      <h2>Layering and motion</h2>
      <p>
        Dropdown 100 · Modal 200 · Tooltip 300 · Toast 400. Transitions: 150 ms
        / 240 ms; reduced motion disables transitions.
      </p>
    </article>
  );
}
export default {
  title: 'Design Tokens/Overview',
  component: DesignTokens,
} satisfies Meta<typeof DesignTokens>;
export const Light: StoryObj<typeof DesignTokens> = {};
export const Dark: StoryObj<typeof DesignTokens> = {
  globals: { theme: 'dark' },
};
