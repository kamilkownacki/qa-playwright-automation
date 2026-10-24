import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { standardUser } from '../test-data/users';
import { checkoutCustomer } from '../test-data/checkout';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  await login.goto();
  await login.login(standardUser.username, standardUser.password);
  await products.addToCart('Sauce Labs Backpack');
  await products.openCart();
  await new CartPage(page).checkout();
});

test(
  'should complete a purchase with correct totals',
  { tag: ['@smoke', '@regression'] },
  async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInformation(
      checkoutCustomer.firstName,
      checkoutCustomer.lastName,
      checkoutCustomer.postalCode,
    );
    await checkout.continue();

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkout.itemNames).toHaveText(['Sauce Labs Backpack']);
    await expect(checkout.subtotal).toHaveText('Item total: $29.99');
    await expect(checkout.tax).toHaveText('Tax: $2.40');
    await expect(checkout.total).toHaveText('Total: $32.39');
    await checkout.finish();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkout.confirmation).toHaveText('Thank you for your order!');
    await expect(checkout.cartBadge).toHaveCount(0);
  },
);

test(
  'should prevent checkout when all customer fields are empty',
  { tag: '@regression' },
  async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.continue();

    await expect(checkout.errorMessage).toHaveText(
      'Error: First Name is required',
    );
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  },
);

test(
  'should require a last name during checkout',
  { tag: '@regression' },
  async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInformation(
      checkoutCustomer.firstName,
      '',
      checkoutCustomer.postalCode,
    );
    await checkout.continue();

    await expect(checkout.errorMessage).toHaveText(
      'Error: Last Name is required',
    );
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  },
);

test(
  'should require a postal code during checkout',
  { tag: '@regression' },
  async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInformation(
      checkoutCustomer.firstName,
      checkoutCustomer.lastName,
      '',
    );
    await checkout.continue();

    await expect(checkout.errorMessage).toHaveText(
      'Error: Postal Code is required',
    );
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  },
);
