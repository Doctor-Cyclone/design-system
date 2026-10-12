import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { openStory } from './helpers';

const examples = [
  ['Button', 'components-button--variants'],
  ['Input', 'components-input--error'],
  ['Checkbox', 'components-checkbox--indeterminate'],
  ['Radio', 'components-radio--controlled-group'],
  ['Switch', 'components-switch--default'],
  ['Modal', 'components-modal--open'],
  ['Select', 'components-select--default'],
  ['Dropdown', 'components-dropdown--default'],
  ['Tooltip', 'components-tooltip--immediate'],
  ['Tabs', 'components-tabs--default'],
  ['Toast', 'components-toast--multiple'],
] as const;

for (const theme of ['light', 'dark'] as const) {
  for (const [name, id] of examples) {
    test(`${name}: WCAG scan in ${theme}`, async ({ page }, testInfo) => {
      await openStory(page, id, theme);
      const scan = () =>
        new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          // Story canvases have no navigation or page landmarks to bypass.
          .disableRules(['bypass'])
          .analyze();
      if (name === 'Select') {
        // The open popup covers the hint; verify its contrast while unobscured.
        const closed = await scan();
        expect(closed.violations).toEqual([]);
        expect(closed.incomplete).toEqual([]);
        await page.getByRole('combobox').press('ArrowDown');
        await expect(page.getByRole('listbox')).toBeVisible();
      }
      if (name === 'Dropdown') {
        await page
          .getByRole('button', { name: 'Project actions' })
          .press('ArrowDown');
        await expect(page.getByRole('menu')).toBeVisible();
      }
      if (name === 'Tooltip') {
        await page.getByRole('button', { name: 'Save', exact: true }).focus();
        await expect(page.getByRole('tooltip')).toBeVisible();
      }
      if (name === 'Modal')
        await expect(page.getByRole('dialog')).toBeVisible();
      if (name === 'Toast')
        await expect(page.getByText('Saved', { exact: true })).toBeVisible();
      const results = await scan();
      await testInfo.attach('axe-report', {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json',
      });
      expect(results.violations).toEqual([]);
      for (const review of results.incomplete) {
        if (
          review.id === 'aria-valid-attr-value' &&
          (name === 'Select' || name === 'Dropdown')
        ) {
          for (const node of review.nodes) {
            expect(node.all.map((check) => check.data?.messageKey)).toEqual([
              'controlsWithinPopup',
            ]);
          }
          const trigger =
            name === 'Select'
              ? page.getByRole('combobox')
              : page.getByRole('button', { name: 'Project actions' });
          const popup = page.getByRole(name === 'Select' ? 'listbox' : 'menu');
          expect(await trigger.getAttribute('aria-controls')).toBe(
            await popup.getAttribute('id'),
          );
          await expect(popup).toBeVisible();
        } else if (review.id === 'color-contrast' && name === 'Select') {
          // Only the already checked hint underneath the popup needs review.
          for (const node of review.nodes) {
            expect(node.html).toContain('-hint');
            expect(node.any.map((check) => check.data?.messageKey)).toEqual([
              'bgOverlap',
            ]);
          }
        } else {
          throw new Error(
            `Unreviewed axe result: ${review.id}: ${JSON.stringify(review.nodes)}`,
          );
        }
      }
    });
  }
}
