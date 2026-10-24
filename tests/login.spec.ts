import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { standardUser, invalidUser } from '../test-data/users';

test.beforeEach(async ({ page }) => {
  await new LoginPage(page).goto();
});

test(
  'should allow a valid user to log in',
  { tag: ['@smoke', '@regression'] },
  async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(standardUser.username, standardUser.password);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(new ProductsPage(page).title).toHaveText('Products');
  },
);

test(
  'should display an error for invalid credentials',
  { tag: '@regression' },
  async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(invalidUser.username, invalidUser.password);

    await expect(login.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(login.loginButton).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  },
);

test(
  'should require a username when login fields are empty',
  { tag: '@regression' },
  async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginButton.click();

    await expect(login.errorMessage).toHaveText(
      'Epic sadface: Username is required',
    );
    await expect(login.loginButton).toBeVisible();
  },
);

test(
  'should log out and prevent access to the product list',
  { tag: '@regression' },
  async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(standardUser.username, standardUser.password);
    await new ProductsPage(page).logout();

    await expect(login.loginButton).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(login.errorMessage).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
  },
);
