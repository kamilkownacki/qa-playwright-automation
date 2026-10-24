import { type Locator, type Page } from '@playwright/test';

export class ProductsPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortSelect: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.productNames = this.items.getByTestId('inventory-item-name');
    this.productPrices = this.items.getByTestId('inventory-item-price');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  product(name: string) {
    return this.items.filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  async addToCart(name: string) {
    await this.product(name)
      .getByRole('button', { name: 'Add to cart', exact: true })
      .click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async sortBy(option: string) {
    await this.sortSelect.selectOption(option);
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page
      .getByRole('button', { name: 'Logout', exact: true })
      .click();
  }
}
