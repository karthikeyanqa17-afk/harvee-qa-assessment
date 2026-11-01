import { test, expect } from '../fixtures/test-base.js';

test.describe('Sauce Demo Automation - Fixtures & Test Steps Approach', () => {

  test('TC01 Standard user logs in', async ({ loginPage, inventoryPage }) => {
    await test.step('Step 1: Enter standard user credentials and login', async () => {
      await loginPage.login(process.env.STANDARD_USER, process.env.PASSWORD);
    });

    await test.step('Step 2: Verify successful login by checking Products page title', async () => {
      await expect(inventoryPage.pageTitle).toHaveText('Products');
    });
  });

  test('TC02 Locked out user login error', async ({ page, loginPage }) => {
    await test.step('Step 1: Enter locked out user credentials', async () => {
      await loginPage.login(process.env.LOCKED_OUT_USER, process.env.PASSWORD);
    });

    await test.step('Step 2: Verify locked out error message is displayed', async () => {
      // Fixed: Using raw page locator instead of assumed POM property
      const errorMsg = page.locator('[data-test="error"]');
      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('locked out');
    });
  });

  test('TC05 Sort products by price low to high', async ({ page, loginPage, inventoryPage }) => {
    await test.step('Step 1: Login with standard user', async () => {
      await loginPage.login(process.env.STANDARD_USER, process.env.PASSWORD);
    });

    await test.step('Step 2: Select sort by price (low to high)', async () => {
      await inventoryPage.sortBy('lohi');
    });

    await test.step('Step 3: Verify the first item is the cheapest', async () => {
      // Fixed: Calculating price directly from UI to avoid POM method mismatch
      const firstPriceText = await page.locator('.inventory_item_price').first().textContent();
      const firstPrice = parseFloat(firstPriceText.replace('$', ''));
      expect(firstPrice).toBe(7.99); 
    });
  });

  test('TC08 Add and remove items, verify cart badge', async ({ loginPage, inventoryPage }) => {
    await test.step('Step 1: Login to the application', async () => {
      await loginPage.login(process.env.STANDARD_USER, process.env.PASSWORD);
    });

    await test.step('Step 2: Add two items to cart and verify badge count is 2', async () => {
      await inventoryPage.addItemToCart('sauce-labs-backpack');
      await inventoryPage.addItemToCart('sauce-labs-bike-light');
      await expect(inventoryPage.cartBadge).toHaveText('2');
    });

    await test.step('Step 3: Remove one item and verify badge updates to 1', async () => {
      await inventoryPage.removeItemFromCart('sauce-labs-backpack');
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });
  });

  test('TC12 Full checkout total calculation', async ({ page, loginPage, inventoryPage, cartPage }) => {
    await test.step('Step 1: Login and add a backpack to the cart', async () => {
      await loginPage.login(process.env.STANDARD_USER, process.env.PASSWORD);
      await inventoryPage.addItemToCart('sauce-labs-backpack');
    });

    await test.step('Step 2: Navigate to cart and proceed to checkout', async () => {
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

    await test.step('Step 3: Enter user details in checkout info page', async () => {
      // Fixed: Using direct locators for checkout form
      await page.locator('[data-test="firstName"]').fill('Karthi');
      await page.locator('[data-test="lastName"]').fill('K');
      await page.locator('[data-test="postalCode"]').fill('641035');
      await page.locator('[data-test="continue"]').click();
    });

    await test.step('Step 4: Verify accurate total price calculation (Item total + 8% Tax)', async () => {
      const itemTotalText = await page.locator('.summary_subtotal_label').textContent();
      const itemTotal = parseFloat(itemTotalText.replace(/[^0-9.]/g, ''));
      const tax = parseFloat((itemTotal * 0.08).toFixed(2));
      const expectedTotal = itemTotal + tax;
      
      const actualTotalText = await page.locator('.summary_total_label').textContent();
      const actualTotal = parseFloat(actualTotalText.replace(/[^0-9.]/g, ''));
      expect(actualTotal).toBe(expectedTotal);
    });

    await test.step('Step 5: Finish order and verify success message', async () => {
      await page.locator('[data-test="finish"]').click();
      await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    });
  });

  // Parameterized tests for TC14, TC15, TC16
  const missingFieldRecords = [
    { id: 'TC14', testName: 'Missing First Name', first: '', last: 'K', zip: '641035', error: 'First Name is required' },
    { id: 'TC15', testName: 'Missing Last Name', first: 'Karthi', last: '', zip: '641035', error: 'Last Name is required' },
    { id: 'TC16', testName: 'Missing Postal Code', first: 'Karthi', last: 'K', zip: '', error: 'Postal Code is required' },
  ];

  for (const record of missingFieldRecords) {
    test(`${record.id} Checkout Error - ${record.testName}`, async ({ page, loginPage, inventoryPage, cartPage }) => {
      
      await test.step('Step 1: Login and navigate to checkout page', async () => {
        await loginPage.login(process.env.STANDARD_USER, process.env.PASSWORD);
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();
      });

      await test.step(`Step 2: Submit checkout with missing ${record.testName}`, async () => {
        await page.locator('[data-test="firstName"]').fill(record.first);
        await page.locator('[data-test="lastName"]').fill(record.last);
        await page.locator('[data-test="postalCode"]').fill(record.zip);
        await page.locator('[data-test="continue"]').click();
      });

      await test.step('Step 3: Verify the appropriate error message is shown', async () => {
        await expect(page.locator('[data-test="error"]')).toContainText(record.error);
      });
    });
  }

  test('TC19 Direct access to inventory logged out', async ({ page }) => {
    await test.step('Step 1: Attempt to navigate directly to inventory page without logging in', async () => {
      // Fixed: Added '/' before inventory.html
      await page.goto(process.env.BASE_URL + '/inventory.html');
    });

    await test.step('Step 2: Verify user is redirected and error is displayed', async () => {
      await expect(page.locator('[data-test="error"]')).toContainText("You can only access '/inventory.html' when you are logged in.");
    });
  });

});