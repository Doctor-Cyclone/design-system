import { expect, test } from '@playwright/test';
import { openStory } from './helpers';

for (const theme of ['light', 'dark'] as const) {
  for (const [name, id] of [
    ['button', 'components-button--variants'],
    ['input', 'components-input--error'],
    ['modal', 'components-modal--open'],
    ['select', 'components-select--default'],
  ] as const) {
    test(`${name} ${theme}`, async ({ page }) => {
      await openStory(page, id, theme);
      if (name === 'modal')
        await expect(page.getByRole('dialog')).toBeVisible();
      if (name === 'select') {
        await page.getByRole('combobox').press('ArrowDown');
        await expect(page.getByRole('listbox')).toBeVisible();
      }
      await expect(page).toHaveScreenshot(`${name}-${theme}.png`);
    });
  }
  test(`keyboard focus ${theme}`, async ({ page }) => {
    await openStory(page, 'components-button--default', theme);
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Save changes' }),
    ).toBeFocused();
    await expect(page).toHaveScreenshot(`focus-${theme}.png`);
  });
}
