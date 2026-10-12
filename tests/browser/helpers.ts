import { expect, type Page } from '@playwright/test';

export async function openStory(
  page: Page,
  id: string,
  theme: 'light' | 'dark' = 'light',
) {
  await page.goto(
    `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`,
  );
  await expect(page.locator('#storybook-root > [data-theme]')).toHaveAttribute(
    'data-theme',
    theme,
  );
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
  await page.evaluate(() => document.fonts.ready);
}
