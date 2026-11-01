export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.sortDropdown = page.locator('.product_sort_container');
    this.prices = page.locator('.inventory_item_price');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.pageTitle = page.locator('.title');
  }

  async sortBy(value) {
    await this.sortDropdown.selectOption(value);
  }

  async addItemToCart(itemTestId) {
    await this.page.locator(`[data-test="add-to-cart-${itemTestId}"]`).click();
  }

  async removeItemFromCart(itemTestId) {
    await this.page.locator(`[data-test="remove-${itemTestId}"]`).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}