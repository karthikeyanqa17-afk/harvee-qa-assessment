# Section A1: Manual Test Suite

### 1. Questions and Assumptions
1. **Q:** What is the exact formula for tax calculation during checkout? **Assumption:** Tax is calculated at a fixed 8% of the item total.
2. **Q:** Are there specific validation rules (regex/length) for the postal code field? **Assumption:** The field accepts any alphanumeric string and only checks for non-emptiness.
3. **Q:** Should the cart contents persist if a user logs out and logs back in? **Assumption:** Cart state is cleared upon logout.
4. **Q:** Is there a maximum quantity limit for a single item in the cart? **Assumption:** Users can only add one unit of each item as per the current UI design.
5. **Q:** What exact error message should display for the `problem_user`? **Assumption:** A generic "User is locked out or has issues" message.

### 2. Test Cases

| ID | Area | Type | Title | Pre-conditions | Steps | Test data | Expected result | Priority | Automate? |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| TC01 | Login | Positive | Standard user logs in | On login page | 1. Enter valid username & password 2. Click Login | `standard_user` | Products page shown | P1 | Yes |
| TC02 | Login | Negative | Locked out user login | On login page | 1. Enter locked out user credentials 2. Click Login | `locked_out_user` | Error message displayed | P1 | Yes |
| TC03 | Login | Negative | Invalid password | On login page | 1. Enter valid user, invalid pass | `standard_user`, `bad_pass` | Error message displayed | P2 | Yes |
| TC04 | Sorting | Positive | Sort name A to Z | Logged in | 1. Select A-Z in sort dropdown | N/A | Items ordered alphabetically | P2 | Yes |
| TC05 | Sorting | Positive | Sort price Low to High | Logged in | 1. Select Low-High in sort dropdown | N/A | Items ordered by lowest price first | P1 | Yes |
| TC06 | Sorting | Positive | Sort price High to Low | Logged in | 1. Select High-Low in sort dropdown | N/A | Items ordered by highest price first | P2 | Yes |
| TC07 | Cart | Positive | Add single item | Logged in | 1. Click Add to Cart on one item | Backpack | Badge shows '1', Remove button appears | P1 | Yes |
| TC08 | Cart | Positive | Add/Remove multiple items | Logged in, 2 items added | 1. Note badge is '2' 2. Click Remove on 1 item | N/A | Badge updates to '1', item removed from cart page | P1 | Yes |
| TC09 | Cart | Positive | Remove item from cart page | Logged in, 1 item added | 1. Go to Cart 2. Click Remove | N/A | Item disappears, badge disappears | P2 | Yes |
| TC10 | Checkout| Positive | Continue with valid info | On Checkout info page | 1. Enter First, Last, Zip 2. Continue | `Karthi`, `K`, `641035` | Overview page shown | P1 | Yes |
| TC11 | Checkout| Negative | Missing First Name | On Checkout info page | 1. Leave First Name blank, fill rest 2. Continue | Last: `K`, Zip: `641035`| Error: First Name is required | P1 | Yes |
| TC12 | Checkout| Negative | Missing Last Name | On Checkout info page | 1. Leave Last Name blank, fill rest 2. Continue | First: `K`, Zip: `641035`| Error: Last Name is required | P1 | Yes |
| TC13 | Checkout| Negative | Missing Postal Code | On Checkout info page | 1. Leave Zip blank, fill rest 2. Continue | First: `K`, Last: `K`| Error: Postal Code is required | P1 | Yes |
| TC14 | Checkout| Positive | Verify totals | On Checkout overview page | 1. Sum item prices 2. Check total | N/A | Item total + Tax = Total | P1 | Yes |
| TC15 | Checkout| Positive | Complete order | On Checkout overview page | 1. Click Finish | N/A | Success message, Cart is empty | P1 | Yes |
| TC16 | Checkout| Positive | Cancel order | On Checkout overview page | 1. Click Cancel | N/A | Redirected to Products page | P2 | Yes |
| TC17 | Access. | Usability| Keyboard navigation | On login page | 1. Use Tab to navigate 2. Enter to submit | `standard_user` | Can login without a mouse | P2 | No |
| TC18 | UI | Responsive| Mobile viewport login | Browser set to 375x812 | 1. View login and products page | N/A | UI elements scale correctly | P2 | No |
| TC19 | Security| Security | Direct URL access logged out | Logged out | 1. Navigate directly to `/inventory.html` | N/A | Redirected to login page with error | P1 | Yes |
| TC20 | Explor. | Explor. | Charter: problem_user | On login page | 1. Login as `problem_user` 2. Explore flows | `problem_user` | Identify and log any functional anomalies | P3 | No |
| TC21 | Security| Negative | SQL Injection attempt on Login | On login page | 1. Enter SQLi payload in username 2. Click Login | `admin' OR '1'='1` | System should not bypass login authentication | P2 | No |

### 3. Strategy
I will automate core end-to-end user journeys at the UI layer using Playwright (JS), covering critical flows like login, filtering, cart management, and checkout. Field validations (TC11-TC13) will be handled via parameterized UI tests. 

**Out of Scope for UI:** Accessibility and responsive checks stay manual. Since this is a public practice site, **I have deliberately excluded automated load testing (JMeter) and active vulnerability scans (OWASP ZAP) to respect terms of service.** However, in a real-world client project, I would push cart state manipulation to the API layer, run JMeter to verify the checkout API under concurrent load, and integrate OWASP ZAP into the CI pipeline to catch OWASP Top 10 vulnerabilities early.

**Biggest risk:** The calculation logic at checkout (Item Total + Tax = Total). If this is handled purely on the frontend and manipulated, or calculated incorrectly on the backend, it directly impacts revenue and order validity.

---

# Section B: AI Output and Client Communication

### B1. Review AI-generated code
**Problems identified:**
1. **Hardcoded URLs and Credentials:** Violates security practices; should use env variables.
2. **Brittle Locators:** `text=Add to cart` will fail if multiple items have this button or if the language changes.
3. **Fixed Sleeps:** `await page.waitForTimeout(3000);` causes flaky and slow tests. Should rely on auto-waiting or explicit state waits.
4. **Poor Assertion:** `expect(total).toBeTruthy();` only checks if the element exists/has text, not if the mathematical total is actually correct.
5. **No Page Object Model:** Locators and actions are cluttered in the test body.

**Rewritten Test (Conceptualized without POM for direct comparison, though Fixture-based POM is used in the actual suite):**
```javascript
test('cart total is correct', async ({ page }) => {
  await page.goto(process.env.BASE_URL);
  await page.locator('[data-test="username"]').fill(process.env.STANDARD_USER);
  await page.locator('[data-test="password"]').fill(process.env.PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  
  const itemPriceText = await page.locator('.inventory_item_price').first().textContent();
  const itemPrice = parseFloat(itemPriceText.replace('$', ''));
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();
  
  await page.locator('[data-test="firstName"]').fill('Karthi');
  await page.locator('[data-test="lastName"]').fill('K');
  await page.locator('[data-test="postalCode"]').fill('641035');
  await page.locator('[data-test="continue"]').click();
  
  const tax = itemPrice * 0.08; // Assuming 8% tax
  const expectedTotal = `Total: $${(itemPrice + tax).toFixed(2)}`;
  const actualTotal = await page.locator('.summary_total_label').textContent();
  expect(actualTotal).toBe(expectedTotal);
});
```

### B2. Test an AI feature: Scenario 4 (CI failure triage bot)
1. **Accuracy on known failures:** Run the bot against 100 historical logs with known root causes. *Scoring: Automatically* via a script comparing the bot's JSON output label against the known correct label.
2. **Handling unseen/rare errors:** Feed the bot anomalous logs (e.g., out-of-memory, rare third-party API timeout) it wasn't trained on. *Scoring: By Rubric/Human Review* to ensure it gracefully flags "Unknown" rather than confidently hallucinating a wrong label.
3. **Secret Leakage:** Ensure the bot's Slack output does not contain API keys, tokens, or passwords parsed from the logs. *Scoring: Automatically* using a regex/security scanner (like OWASP ZAP concepts applied to text strings) on the bot's Slack payload.
4. **Cost of mistakes (Flaky vs. Defect):** Test the bot with a failure that is borderline flaky/defect. *Scoring: By Rubric*. It is safer to label a flaky test as a product defect than to ignore a real defect by labeling it as flaky.

### B3. Defect Report
**Title:** Sorting by "Price (low to high)" displays $29.99 item before $15.99 item
**Environment:** Chrome v118, Windows 11, Release 4.2.0
**Severity:** High. Core e-commerce functionality is broken, directly impacting the user's ability to browse and make purchasing decisions based on price.

**Steps to Reproduce:**
1. Navigate to the Sauce Demo application and log in as standard_user.
2. Click on the "Sort" dropdown menu on the top right of the inventory page.
3. Select "Price (low to high)".
4. Observe the order of the prices on the displayed items.

**Expected Result:** 
Items should display in strict ascending numerical order (e.g., $7.99, $9.99, $15.99, $29.99).

**Actual Result:** 
An item priced at $29.99 appears before an item priced at $15.99 in the grid. (Reproducible on 100% of runs in v4.2.0).

**Evidence Attached:** `sorting_error_4_2_0.png`

### B4. Message to the client
Hi [Name], 

Our testing for Friday’s release uncovered a High-severity bug where sorting items by "Price (low to high)" is broken ($29.99 items appear before $15.99 items). We also have a checkout test failing intermittently (~10% of the time). 

**Recommendation:** I strongly advise delaying the release to patch the sorting bug, as it directly impacts the customer shopping experience and trust. 

**Alternative:** If sorting is not critical for this specific marketing push, we can release on Friday with this as a known issue. Meanwhile, I am isolating the checkout flake to confirm it is a test environment issue and not a production checkout failure. Let me know how you’d like to proceed.