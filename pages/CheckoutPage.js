export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueBtn = page.locator('[data-test="continue"]');
    this.finishBtn = page.locator('[data-test="finish"]');
    this.errorMsg = page.locator('[data-test="error"]');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
  }

  async fillDetailsAndContinue(first, last, zip) {
    if (first) await this.firstName.fill(first);
    if (last) await this.lastName.fill(last);
    if (zip) await this.postalCode.fill(zip);
    await this.continueBtn.click();
  }

  async finishOrder() {
    await this.finishBtn.click();
  }
}