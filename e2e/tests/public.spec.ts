import { expect, test } from '@playwright/test';

const WELCOME_URL = /\/welcome/;

test.describe('public pages', () => {
  test('P1 home redirects an anonymous visitor to /welcome', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveURL(WELCOME_URL);
    await expect(
      page.getByRole('heading', { name: 'Creator Credentials', level: 1 }),
    ).toBeVisible();
  });

  test('P1 /welcome renders the creator hub card with log-in and sign-up links', async ({
    page,
  }) => {
    await page.goto('/welcome');
    await expect(
      page.getByRole('heading', { name: 'Creator Hub', level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log in' })).toHaveAttribute(
      'href',
      '/auth/login/creator',
    );
    await expect(page.getByRole('link', { name: 'Sign up' })).toHaveAttribute(
      'href',
      '/auth/signup/creator',
    );
  });

  for (const protectedPath of ['/issuer', '/creator', '/admin']) {
    test(`P1 ${protectedPath} redirects an anonymous visitor to /welcome`, async ({
      page,
    }) => {
      await page.goto(protectedPath);
      await expect(page).toHaveURL(WELCOME_URL);
    });
  }

  test('P2 the creator sign-in page renders the Clerk form', async ({
    page,
  }) => {
    await page.goto('/auth/login/creator');
    await expect(
      page.getByRole('heading', { name: 'Creator Hub', level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
  });
});
