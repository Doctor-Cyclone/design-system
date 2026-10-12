import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const theme of ['light', 'dark']) {
  test(`gallery is accessible in ${theme} theme`, async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('combobox', { name: 'Тема', exact: true })
      .selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('main section.gallery-card')).toHaveCount(12);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.reload();
    await expect(
      page.getByRole('combobox', { name: 'Тема', exact: true }),
    ).toHaveValue(theme);
  });
}

test('gallery composes searchable controls, tabs, dialogs and notifications', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Контролируемый ввод').fill('Cyclone');
  await expect(page.getByText('Символов: 7', { exact: true })).toBeVisible();
  const select = page.getByRole('combobox', {
    name: 'Выбранное значение',
    exact: true,
  });
  await select.click();
  await page.getByRole('option', { name: 'Vue', exact: true }).click();
  await expect(select).toHaveValue('Vue');
  await page.getByRole('tab', { name: 'Настройки', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Настройки проекта');
  await page
    .getByRole('button', { name: 'Вложенный диалог', exact: true })
    .click();
  await page.getByRole('button', { name: 'Открыть подтверждение' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Подтверждение', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('dialog', { name: 'Создать проект', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Вложенный диалог', exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'Закрыть все', exact: true }).click();
  await page.getByRole('button', { name: 'Success', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Изменения сохранены' }),
  ).toBeVisible();
});

test('mobile navigation and overlays fit a 320px screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Select', exact: true }).click();
  await expect(page).toHaveURL(/#Select$/);
  await page.getByRole('combobox', { name: 'Framework', exact: true }).click();
  await expect(
    page.getByRole('option', { name: 'React', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await page
    .getByRole('button', { name: 'Открыть диалог', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
