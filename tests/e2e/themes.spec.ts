import { expect, test, type Page } from '@playwright/test';
const story = 'themes-playground--';
async function open(page: Page, name = 'default', globals = '') {
  await page.goto(
    `/?path=/story/${story}${name}${globals ? `&globals=theme:${globals}` : ''}`,
  );
  await expect(
    page
      .frameLocator('#storybook-preview-iframe')
      .getByRole('heading', { name: 'Theme playground' }),
  ).toBeVisible();
}
async function select(page: Page, name: string) {
  await page.getByRole('button', { name: 'Change theme', exact: true }).click();
  await page.getByRole('button', { name, exact: true }).click();
}
const body = (page: Page) =>
  page.frameLocator('#storybook-preview-iframe').locator('body');

test('switches multiple classes, clears, and preserves unrelated classes', async ({
  page,
}) => {
  await open(page);
  await expect(body(page)).toHaveClass(/theme-light/);
  await body(page).evaluate((element) =>
    element.classList.add('application-class'),
  );
  await select(page, 'dark');
  await expect(body(page)).toHaveClass(/theme-dark/);
  await expect(body(page)).toHaveClass(/dark-mode/);
  await expect(body(page)).not.toHaveClass(/theme-light/);
  await expect(
    page.frameLocator('#storybook-preview-iframe').locator('.sample-card'),
  ).toHaveCSS('background-color', 'rgb(15, 23, 42)');
  await select(page, 'Clear theme');
  await expect(body(page)).not.toHaveClass(/theme-dark|dark-mode|theme-light/);
  await expect(body(page)).toHaveClass(/application-class/);
});
test('restores URL globals and keeps selection when navigating', async ({
  page,
}) => {
  await open(page, 'default', 'dark');
  await expect(body(page)).toHaveClass(/theme-dark/);
  // Storybook 10.0 uses buttons; later 10.x releases use links.
  await page
    .locator('[data-item-id="themes-playground--dark-default"]')
    .click();
  await expect(body(page)).toHaveClass(/theme-dark/);
  await page.reload();
  await expect(body(page)).toHaveClass(/theme-dark/);
});
test('cleans up when navigating to a disabled story', async ({ page }) => {
  await open(page);
  await select(page, 'dark');
  await page.locator('[data-item-id="themes-playground--disabled"]').click();
  await expect(body(page)).not.toHaveClass(/theme-light|theme-dark|dark-mode/);
  await expect(
    page.getByRole('button', { name: 'Change theme', exact: true }),
  ).toHaveCount(0);
});
test('respects defaults, non-clearable configuration, and fixed story globals', async ({
  page,
}) => {
  await open(page, 'dark-default');
  await expect(body(page)).toHaveClass(/theme-dark/);
  await open(page, 'non-clearable', 'none');
  await expect(body(page)).toHaveClass(/theme-light/);
  await page.getByRole('button', { name: 'Change theme', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Clear theme', exact: true }),
  ).toHaveCount(0);
  await open(page, 'fixed-theme', 'light');
  await expect(body(page)).toHaveClass(/theme-dark/);
  await expect(
    page.getByRole('button', { name: 'Theme is fixed by this story' }),
  ).toBeDisabled();
});
test('applies classes to root and custom targets', async ({ page }) => {
  await open(page, 'root-target');
  await expect(
    page.frameLocator('#storybook-preview-iframe').locator('html'),
  ).toHaveClass(/theme-light/);
  await expect(body(page)).not.toHaveClass(/theme-light/);
  await open(page, 'custom-target');
  await select(page, 'dark');
  await expect(
    page.frameLocator('#storybook-preview-iframe').locator('.sample-card'),
  ).toHaveClass(/theme-dark/);
  await expect(body(page)).not.toHaveClass(/theme-dark/);
});
test('falls back for a stale global and invokes callbacks in the preview', async ({
  page,
}) => {
  await open(page, 'different-list', 'dark');
  await expect(body(page)).toHaveClass(/theme-ocean/);
  await open(page, 'callback');
  await select(page, 'dark');
  await expect(body(page)).toHaveAttribute('data-selected-theme', 'dark');
  await select(page, 'Clear theme');
  await expect(body(page)).toHaveAttribute('data-selected-theme', 'none');
});
test('renders standalone previews without the manager', async ({ page }) => {
  await page.goto(
    `/iframe.html?id=${story}default&viewMode=story&globals=theme:dark`,
  );
  await expect(
    page.getByRole('heading', { name: 'Theme playground' }),
  ).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/theme-dark/);
});

test('renders isolated themed stories in Docs', async ({ page }) => {
  await page.goto('/?path=/docs/themes-playground--docs');
  const docs = page.frameLocator('#storybook-preview-iframe');
  await expect(
    docs.getByRole('heading', { name: 'Playground', exact: true }),
  ).toBeVisible();
  const example = docs.frameLocator('iframe').first();
  await expect(
    example.getByRole('heading', { name: 'Theme playground' }),
  ).toBeVisible();
  await expect(example.locator('body')).toHaveClass(/theme-light/);
});
