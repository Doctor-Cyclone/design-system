import { expect, test } from '@playwright/test';
import { openStory } from './helpers';

test('native controls respond to keyboard and controlled values', async ({
  page,
}) => {
  await openStory(page, 'components-input--controlled');
  await page.getByRole('textbox').fill('hello');
  await expect(page.getByText('Characters: 5')).toBeVisible();
  await openStory(page, 'components-checkbox--default');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(page.getByRole('checkbox')).toBeChecked();
  await openStory(page, 'components-switch--default');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(page.getByRole('switch')).toBeChecked();
  await openStory(page, 'components-radio--controlled-group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'yearly' })).toBeChecked();
});

test('modal traps focus, isolates background and restores opener', async ({
  page,
}) => {
  await openStory(page, 'components-modal--default');
  const opener = page.getByRole('button', { name: 'Open dialog' });
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'Project name' }),
  ).toBeFocused();
  await expect(page.locator('#storybook-root')).toHaveAttribute('inert', '');
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await page.keyboard.press('Shift+Tab');
  await expect(
    dialog.getByRole('button', { name: 'Close dialog' }),
  ).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    dialog.getByRole('button', { name: 'Save and close' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    dialog.getByRole('button', { name: 'Close dialog' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page.locator('#storybook-root')).not.toHaveAttribute(
    'inert',
    '',
  );
});

test('inner Select consumes Escape before Modal closes', async ({ page }) => {
  await openStory(page, 'components-modal--select-inside');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.getByRole('combobox').press('ArrowDown');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).not.toBeVisible();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('nested dialogs close top layer and restore parent focus', async ({
  page,
}) => {
  await openStory(page, 'components-modal--nested');
  await page.getByRole('button', { name: 'Open parent' }).click();
  await page.getByRole('button', { name: 'Open confirmation' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Confirm changes' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Open confirmation' }),
  ).toBeFocused();
  await expect(
    page.getByRole('dialog', { name: 'Parent dialog' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open parent' })).toBeFocused();
});

test('Select skips disabled choices, searches and restores selection', async ({
  page,
}) => {
  await openStory(page, 'components-select--default');
  const input = page.getByRole('combobox');
  await input.press('ArrowDown');
  await input.press('ArrowDown');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(input).toHaveValue('Svelte');
  await input.fill('rea');
  await expect(page.getByRole('option')).toHaveCount(1);
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(input).toHaveValue('React');
  await input.fill('no matches');
  await expect(page.getByRole('listbox')).toHaveText('No matching options');
  await input.press('Escape');
  await expect(input).toHaveValue('React');
  await expect(input).toBeFocused();
});

test('menu skips disabled actions, activates and closes on outside click', async ({
  page,
}) => {
  await openStory(page, 'components-dropdown--action-feedback');
  const trigger = page.getByRole('button', { name: 'Choose action' });
  await trigger.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: 'Delete project' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText(
    'Last action: Delete project',
  );
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('status').click();
  await expect(page.getByRole('menu')).not.toBeVisible();
});

test('Tabs roves focus and activates panels, skipping disabled tabs', async ({
  page,
}) => {
  await openStory(page, 'components-tabs--default');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Settings' })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toHaveText(
    'Change project settings.',
  );
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Members' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Members' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('Tooltip opens with keyboard, labels trigger and dismisses with Escape', async ({
  page,
}) => {
  await openStory(page, 'components-tooltip--default');
  await page.keyboard.press('Tab');
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Save', exact: true }),
  ).toHaveAttribute(
    'aria-describedby',
    (await tooltip.getAttribute('id')) as string,
  );
  await page.keyboard.press('Escape');
  await expect(tooltip).not.toBeVisible();
});

test('Toast exposes live regions, pauses on focus and dismisses', async ({
  page,
}) => {
  await openStory(page, 'components-toast--fast-auto-close');
  await page.getByRole('button', { name: 'Success', exact: true }).click();
  const close = page.getByRole('button', {
    name: 'Dismiss notification: Project saved successfully',
    exact: true,
  });
  await close.focus();
  await expect(page.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  // A real deadline is the behavior under test; keep focus longer than auto-close.
  await page.waitForTimeout(1200);
  await expect(close).toBeVisible();
  await close.press('Enter');
  await expect(close).not.toBeVisible();
  await page.getByRole('button', { name: 'Error', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(
    'Could not save the project',
  );
  await expect(
    page.getByText('Could not save the project', { exact: true }),
  ).not.toBeVisible({ timeout: 3000 });
});

test('theme preference persists and system palette tracks OS changes', async ({
  page,
}) => {
  await openStory(page, 'design-tokens-theme-switching--default');
  await page.getByRole('button', { name: 'dark', exact: true }).click();
  await page.reload();
  await expect(page.getByText('Selected: dark; resolved: dark')).toBeVisible();
  await page.getByRole('button', { name: 'system', exact: true }).click();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(
    page.getByText('Selected: system; resolved: dark'),
  ).toBeVisible();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(
    page.getByText('Selected: system; resolved: light'),
  ).toBeVisible();
});
