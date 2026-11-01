# Harvee Technologies QA Automation Assessment - Sauce Demo

This repository contains the automation suite and manual test documentation for the Sauce Demo checkout use case. The framework uses Playwright with JavaScript (ESM modules), a robust Fixture-based Page Object Model (POM), and Allure Reporting.

## Setup Instructions
1. Ensure Node.js (v24+) is installed.
2. Clone the repository and navigate to the project directory.
3. Install dependencies:
   ```bash
   npm install
   npx playwright install
   ```
4. Environment variables are set in the `.env` file (BASE_URL, STANDARD_USER, LOCKED_OUT_USER, PASSWORD).

## Configuration Highlights
- **Architecture:** Full POM integrated with custom Playwright Fixtures (`test-base.js`).
- **Slow Motion:** Enabled (`slowMo: 300ms`) for clear visual tracking of UI executions.
- **Retries:** Configured to `1` to validate test stability.
- **Screenshots:** Automatically captured on every test failure.

## Run Commands
- **Run all tests:** `npm run test` (or `npx playwright test --headed`)
- **Generate & Open Allure Report:** `npm run report:allure`
- **View Default HTML Report:** `npx playwright show-report`

## Manual to Automation Traceability

| Manual ID | Automated Test Name | Status |
| :--- | :--- | :--- |
| TC01 | TC01 Standard user logs in | Automated |
| TC02 | TC02 Locked out user login error | Automated |
| TC05 | TC05 Sort products by price low to high | Automated |
| TC08 | TC08 Add and remove items, verify cart badge | Automated |
| TC12 | TC12 Full checkout total calculation and empty cart | Automated |
| TC14-16 | TC14-TC16 Checkout missing field errors | Automated (Parameterized) |
| TC19 | TC19 Direct access to inventory logged out | Automated |
| TC17 | Accessibility - Keyboard Navigation | Manual Only |
| TC18 | Responsive - Mobile Viewport | Manual Only |
| TC20 | Exploratory - problem_user | Manual Only |
| TC21 | Security - SQL Injection attempt on Login | Manual Only |

## Scaling to 200 Tests
To scale this suite to 200+ tests, the current Fixture-based POM handles setup seamlessly. Test data would be externalized into JSON/CSV files, and authentication would be optimized using Playwright's state management (saving storage state) to bypass the login UI for subsequent tests. Integrating the suite into a CI/CD pipeline (like GitHub Actions or Jenkins) with parallel execution and sharding would ensure execution time remains under 10 minutes.