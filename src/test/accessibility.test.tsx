import { render } from '@testing-library/react';
import axe from 'axe-core';
import { expect, it } from 'vitest';
import { Button, Checkbox, Input, Radio, Switch } from '../index';
it('has no axe violations in the base control composition (contrast needs a real browser)', async () => {
  const { container } = render(
    <main>
      <h1>Account preferences</h1>
      <Button>Save</Button>
      <Button iconOnly aria-label="Add">
        <span aria-hidden="true">+</span>
      </Button>
      <Input label="Email" hint="Use a work address" error="Invalid email" />
      <Checkbox label="Accept terms" />
      <fieldset>
        <legend>Billing</legend>
        <Radio label="Monthly" name="billing" value="monthly" />
        <Radio label="Yearly" name="billing" value="yearly" />
      </fieldset>
      <Switch label="Notifications" />
    </main>,
  );
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  expect(results.violations).toEqual([]);
});
