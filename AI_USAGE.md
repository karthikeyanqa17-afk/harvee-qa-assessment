# AI Usage Documentation

I utilized an AI coding assistant as a productivity tool to save time on formatting and syntax lookups. The core test strategy, POM architecture, fixture integration, and manual test cases are my own work.

### 1. Markdown Table Formatting
* **What I asked for:** "Convert this raw list of manual test cases into a clean Markdown table format."
* **What I changed:** I wrote the actual test cases, preconditions, and expected results myself. I only used the AI to generate the Markdown syntax quickly.

### 2. Price Sorting Logic (TC05)
* **What I asked for:** "Playwright JS snippet to loop through a list of elements and assert they are sorted numerically from low to high."
* **What I changed:** The AI provided a basic for-loop that compared raw text. I manually added the data parsing logic (`parseFloat(priceText.replace('$', ''))`) to ensure the mathematical assertion worked correctly, accounting for the dollar sign in the UI.