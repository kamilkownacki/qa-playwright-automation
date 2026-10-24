import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { standardUser } from '../test-data/users';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(standardUser.username, standardUser.password);
});

test(
  'should display the product catalogue after login',
  { tag: ['@smoke', '@regression'] },
  async ({ page }) => {
    const products = new ProductsPage(page);

    await expect(products.title).toHaveText('Products');
    await expect(products.items).toHaveCount(6);
    await expect(products.productNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ]);
    await expect(
      products.items.getByRole('button', { name: 'Add to cart', exact: true }),
    ).toHaveCount(6);
  },
);

test(
  'should sort products by price from low to high',
  { tag: '@regression' },
  async ({ page }) => {
    const products = new ProductsPage(page);
    await products.sortBy('lohi');

    // The known demo prices provide an independent expected order.
    await expect(products.productPrices).toHaveText([
      '$7.99',
      '$9.99',
      '$15.99',
      '$15.99',
      '$29.99',
      '$49.99',
    ]);
  },
);

test(
  'should sort products by name from Z to A',
  { tag: '@regression' },
  async ({ page }) => {
    const products = new ProductsPage(page);
    await products.sortBy('za');

    await expect(products.productNames).toHaveText([
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Onesie',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Bike Light',
      'Sauce Labs Backpack',
    ]);
  },
);
