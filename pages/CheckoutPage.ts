import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly errorMessage: Locator;
  readonly itemNames: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly confirmation: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.getByPlaceholder('First Name', { exact: true });
    this.lastNameInput = page.getByPlaceholder('Last Name', { exact: true });
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code', {
      exact: true,
    });
    this.errorMessage = page.getByTestId('error');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.confirmation = page.getByTestId('complete-header');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async fillInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.page
      .getByRole('button', { name: 'Continue', exact: true })
      .click();
  }

  async finish() {
    await this.page
      .getByRole('button', { name: 'Finish', exact: true })
      .click();
  }
}
