import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { standardUser } from '../test-data/users';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(standardUser.username, standardUser.password);
});

test(
  'should add a product to the cart',
  { tag: ['@smoke', '@regression'] },
  async ({ page }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    await products.addToCart('Sauce Labs Backpack');

    await expect(products.cartBadge).toHaveText('1');
    await expect(
      products
        .product('Sauce Labs Backpack')
        .getByRole('button', { name: 'Remove', exact: true }),
    ).toBeVisible();
    await products.openCart();
    await expect(cart.title).toHaveText('Your Cart');
    await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack']);
    await expect(cart.items.getByTestId('inventory-item-price')).toHaveText(
      '$29.99',
    );
  },
);

test(
  'should keep multiple selected products and their count in the cart',
  { tag: '@regression' },
  async ({ page }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    await products.addToCart('Sauce Labs Backpack');
    await expect(products.cartBadge).toHaveText('1');
    await products.addToCart('Sauce Labs Bike Light');
    await expect(products.cartBadge).toHaveText('2');
    await products.openCart();

    await expect(cart.itemNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);
    await expect(cart.cartBadge).toHaveText('2');
  },
);

test(
  'should remove a product and clear the cart badge when empty',
  { tag: '@regression' },
  async ({ page }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    await products.addToCart('Sauce Labs Backpack');
    await products.addToCart('Sauce Labs Bike Light');
    await products.openCart();
    await cart.removeProduct('Sauce Labs Backpack');

    await expect(cart.itemNames).toHaveText(['Sauce Labs Bike Light']);
    await expect(cart.cartBadge).toHaveText('1');
    await cart.removeProduct('Sauce Labs Bike Light');
    await expect(cart.items).toHaveCount(0);
    await expect(cart.cartBadge).toHaveCount(0);
  },
);

test(
  'should preserve the cart when returning to products',
  { tag: '@regression' },
  async ({ page }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    await products.addToCart('Sauce Labs Backpack');
    await products.openCart();
    await cart.continueShopping();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(products.cartBadge).toHaveText('1');
    await expect(
      products
        .product('Sauce Labs Backpack')
        .getByRole('button', { name: 'Remove', exact: true }),
    ).toBeVisible();
    await products.openCart();
    await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack']);
  },
);
