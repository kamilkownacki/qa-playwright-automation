import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = this.items.getByTestId('inventory-item-name');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async removeProduct(name: string) {
    await this.items
      .filter({ has: this.page.getByText(name, { exact: true }) })
      .getByRole('button', { name: 'Remove', exact: true })
      .click();
  }

  async continueShopping() {
    await this.page
      .getByRole('button', { name: 'Continue Shopping', exact: true })
      .click();
  }

  async checkout() {
    await this.page
      .getByRole('button', { name: 'Checkout', exact: true })
      .click();
  }
}
