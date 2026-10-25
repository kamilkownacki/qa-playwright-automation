# QA Playwright Automation

[![Playwright tests](https://github.com/kamilkownacki/qa-playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/kamilkownacki/qa-playwright-automation/actions/workflows/playwright.yml)

This is a small Playwright and TypeScript project built around [Sauce Demo](https://www.saucedemo.com/). It covers login, products, cart behaviour and checkout.

I made it to practice browser automation on scenarios that make sense from a QA point of view. Sauce Demo is simple enough that I can focus on test structure, coverage, debugging and CI instead of building a complicated framework around it.

## What Is Covered

- Valid login, invalid credentials, empty login and logout/access protection.
- Product catalogue and sorting by price and name.
- Adding products, cart count, removal and state when returning to products.
- Checkout required fields, order contents, totals and purchase confirmation.

This is a demo checkout. There are no real payments, deliveries or customer accounts. Public demo credentials are stored in `test-data/users.ts`.

## Test Structure

There are **15 independent tests** in four spec files. Each test gets a fresh browser context. `beforeEach` repeats the required setup instead of depending on the state left by another test.

Four critical flows are tagged with both `@smoke` and `@regression`. The other eleven are `@regression`, so the full regression run contains all 15 tests.

Page Objects hold locators and user actions. Assertions mostly stay in the test files so the expected behaviour is easy to see when reading a scenario.

## Tech Stack

- Node.js 24 and npm
- Playwright Test and Chromium
- TypeScript with strict checking
- ESLint and Prettier
- GitHub Actions

Exact dependency versions are saved in `package.json` and `package-lock.json`.

## Running Locally

Install Node.js 24, then:

```bash
git clone https://github.com/kamilkownacki/qa-playwright-automation.git
cd qa-playwright-automation
npm ci
npx playwright install chromium
npm test
```

On Linux, `npx playwright install --with-deps chromium` can also install the required system libraries. Windows and macOS normally only need the browser install above.

No local application server, `.env` file or private credentials are needed. The tests need access to `www.saucedemo.com`.

Code checks:

```bash
npm run lint
npm run typecheck
npm run format:check
```

`npm run format` applies formatting. Use `npm ci` for a clean install from the lockfile.

## Running Smoke Tests

```bash
npm run test:smoke
```

Runs 4 tests: valid login, product catalogue, adding to cart and completing a purchase.

## Running Regression Tests

```bash
npm run test:regression
```

Runs all 15 tests, including the smoke cases. `npm test` also runs the complete suite.

## Running Tests in UI Mode

```bash
npm run test:ui
npm run test:headed
```

These commands require a graphical desktop. To debug one test:

```bash
npm run test:headed -- tests/cart.spec.ts -g "should add a product to the cart"
```

## Reports

```bash
npm run report
```

The HTML report is generated in `playwright-report/`.

- Screenshots are captured on failure.
- Videos are recorded and kept for failed attempts.
- Traces are recorded on the first retry in CI.

For a local failure investigation with a trace:

```bash
npx playwright test tests/cart.spec.ts --trace on
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Replace `<test-folder>` with the generated test result directory.

## CI

[The workflow](.github/workflows/playwright.yml) runs on every push and pull request. It installs dependencies, installs Chromium, checks linting and TypeScript, checks formatting and runs the full test suite.

CI uses one worker and one retry. A test that only passes on retry should still be treated as flaky and investigated.

The `playwright-results` artifact keeps the HTML report and available failure evidence for 14 days. See [validation notes](docs/VALIDATION.md) for the checks that have actually been run.

## Project Structure

```text
.github/workflows/playwright.yml
pages/
  LoginPage.ts
  ProductsPage.ts
  CartPage.ts
  CheckoutPage.ts
test-data/
  users.ts
  checkout.ts
tests/
  login.spec.ts
  products.spec.ts
  cart.spec.ts
  checkout.spec.ts
docs/
  TEST_PLAN.md
  TEST_CASES.md
  BUG_REPORT_EXAMPLE.md
  INTERVIEW_NOTES.md
  CLOUD_ENVIRONMENT.md
  VALIDATION.md
LEARNING_GUIDE.md
playwright.config.ts
tsconfig.json
eslint.config.mjs
package.json
package-lock.json
```

## Test Documentation

- [Test plan](docs/TEST_PLAN.md): scope, risks and completion criteria.
- [Test cases](docs/TEST_CASES.md): 15 manual scenarios mapped to automation.
- [Example bug report](docs/BUG_REPORT_EXAMPLE.md): a hypothetical example, not a real finding from Sauce Demo.
- [Learning guide in Polish](LEARNING_GUIDE.md): notes I use to understand and revisit the Playwright code.
- [Interview notes](docs/INTERVIEW_NOTES.md): short project specific notes.
- [Validation record](docs/VALIDATION.md): checks, results and limitations.

## What I Practised Here

- Playwright test structure and `beforeEach`
- test isolation
- locators and assertions
- `async` / `await`
- a simple Page Object Model
- smoke and regression tagging
- HTML reports, screenshots, videos and traces
- TypeScript checks and linting
- running tests in GitHub Actions
- looking into flaky failures

## Development Note

I used AI tools for parts of the implementation and documentation. I still reviewed the scenarios, test coverage, structure and behaviour myself. The repository also includes a learning guide so I can go back to the code, explain it and change it when needed.

## Possible Next Steps

- API tests against a suitable demo API
- cross browser runs where they add useful coverage
- visual regression with controlled baselines
- accessibility checks and manual keyboard testing
- reusable fixtures if repeated setup starts getting in the way

## License

MIT. See [LICENSE](LICENSE).
