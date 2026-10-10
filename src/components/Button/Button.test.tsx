import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
describe('Button', () => {
  it('activates by keyboard without submitting a surrounding form', async () => {
    const click = vi.fn();
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Button onClick={click}>Save</Button>
      </form>,
    );
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
  });
  it.each([{ disabled: true }, { loading: true }])(
    'blocks activation when %j',
    async (props) => {
      const click = vi.fn();
      render(
        <Button {...props} onClick={click}>
          Save
        </Button>,
      );
      const button = screen.getByRole('button', { name: 'Save' });
      await userEvent.click(button);
      expect(button).toBeDisabled();
      expect(click).not.toHaveBeenCalled();
      if ('loading' in props)
        expect(button).toHaveAttribute('aria-busy', 'true');
    },
  );
  it('labels icon-only buttons', () => {
    render(
      <Button iconOnly aria-label="Add item">
        <span aria-hidden="true">+</span>
      </Button>,
    );
    expect(
      screen.getByRole('button', { name: 'Add item' }),
    ).toBeInTheDocument();
  });
});
