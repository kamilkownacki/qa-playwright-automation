# QA Playwright Automation

[![Playwright tests](https://github.com/kamilkownacki/qa-playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/kamilkownacki/qa-playwright-automation/actions/workflows/playwright.yml)

Playwright + TypeScript UI automation portfolio testing [Sauce Demo](https://www.saucedemo.com/), a public demo shop designed for testing practice. It covers login, products, cart behaviour and checkout with a focus on practical QA coverage, test isolation, maintainable Page Objects and CI.

Built as a hands-on bridge from more than four years of manual QA experience, mainly in games, into browser test automation.

## About This Project

The project is intentionally scoped as a realistic QA automation portfolio rather than an oversized custom framework. It demonstrates test design, smoke/regression organisation, reusable page actions, clear assertions, failure evidence and continuous integration while keeping the structure easy to explain and maintain.

## What Is Covered

- Valid login, invalid credentials, empty login and logout/access protection.
- Product catalogue and sorting by price and name.
- Adding products, cart count, removal and state when returning to products.
- Checkout required fields, order contents, totals and purchase confirmation.

This is a demo checkout: no real payments, deliveries or customer accounts are involved. Public demo credentials are in `test-data/users.ts`; they are intentionally public, not personal secrets.

## Test Structure

There are **15 independent tests** in four spec files. Each gets a fresh browser context from Playwright. `beforeEach` repeats the necessary UI setup instead of relying on another test's state.

Four critical journeys have both `@smoke` and `@regression` tags. The other eleven have `@regression`. This makes smoke a subset of regression: regression runs all 15, not just the remaining eleven.

Page Objects contain locators and user actions. Assertions mostly stay in tests so the expected behaviour is visible. There are no base classes, custom fixtures or generic helper layers.

## Tech Stack

- Node.js 24 (see `.nvmrc`) and npm.
- Playwright Test and Chromium.
- TypeScript with strict checking.
- ESLint and Prettier.
- GitHub Actions for continuous integration.

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

On a supported Linux machine, use `npx playwright install --with-deps chromium` to install required OS libraries as well (this can require administrator access). Windows and macOS normally only need the browser install above.

No local application server, `.env` file or private credentials are needed. Tests need Internet access to `www.saucedemo.com`. Browser installation needs the Playwright download CDN. A corporate/cloud proxy may need explicit configuration; see [the cloud notes](docs/CLOUD_ENVIRONMENT.md).

Code checks:

```bash
npm run lint
npm run typecheck
npm run format:check
```

`npm run format` applies formatting. Use `npm ci` for reproducible installation; `npm install` is used when intentionally updating dependencies.

## Running Smoke Tests

```bash
npm run test:smoke
```

Runs 4 tests: valid login, product catalogue, adding to cart and completing a purchase.

## Running Regression Tests

```bash
npm run test:regression
```

Runs all 15 tests, including smoke. `npm test` also runs the complete suite.

## Running Tests in UI Mode

```bash
npm run test:ui
npm run test:headed
```

These commands require a graphical desktop. Headless `npm test` is the default in CI and cloud shells. To debug one test:

```bash
npm run test:headed -- tests/cart.spec.ts -g "should add a product to the cart"
```

## Reports

```bash
npm run report
```

The HTML report is generated in `playwright-report/`. The viewer is a local tool; in a cloud task, inspect/download the generated files rather than expecting a public preview.

- Screenshots: captured on failure.
- Videos: recorded, then kept only for failed attempts.
- Traces: recorded on the first retry. CI has one retry; local runs have none by default.

For a local failure investigation with a trace from the first attempt:

```bash
npx playwright test tests/cart.spec.ts --trace on
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Replace `<test-folder>` with the actual generated directory. Reports and failure evidence are ignored by Git. Each run replaces the default report, so keep a copy if comparing runs.

## CI/CD

[The workflow](.github/workflows/playwright.yml) runs on every push and pull request. It checks out the code, installs Node 24, runs `npm ci`, installs Chromium with system libraries, checks lint/types/formatting, and runs the complete suite.

CI uses one worker and one retry. A test that passes only on retry is flaky and still needs investigation. The `playwright-results` artifact keeps the HTML report and available failure evidence for 14 days, including on test failure. A failure before test execution may have no report to upload.

This workflow performs CI only; it does not deploy an application. See [validation notes](docs/VALIDATION.md) for what has actually been verified, rather than assuming the existence of a workflow proves a successful GitHub run.

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

There is no `utils/` directory yet because no shared utility is needed.

## Test Documentation

- [Test plan](docs/TEST_PLAN.md): scope, risks and completion criteria.
- [Test cases](docs/TEST_CASES.md): 15 manual scenarios mapped to automation.
- [Example bug report](docs/BUG_REPORT_EXAMPLE.md): explicitly hypothetical, not a claimed finding.
- [Learning guide in Polish](LEARNING_GUIDE.md): practical explanations for a Playwright beginner.
- [Interview notes](docs/INTERVIEW_NOTES.md): short project-specific answers.
- [Validation record](docs/VALIDATION.md): checks, results and limitations.

## Skills Practised

The project is intentionally small enough that each part can be understood, explained and changed rather than hidden behind framework complexity. It covers:

- Playwright test structure, `beforeEach` and test isolation.
- Accessible locators and the demo's `data-test` attributes.
- Assertions that retry until the expected UI state appears.
- `async`/`await` and sequential user actions.
- A small Page Object Model with visible assertions.
- Smoke versus regression and overlapping tags.
- HTML reports, screenshots, videos and traces.
- Strict TypeScript, linting and reproducible npm installation.
- CI with GitHub Actions and investigation of flaky failures.

## Development Note

AI tools assisted with implementation and documentation. Test scenarios, QA coverage, validation and project structure were reviewed manually, and the repository includes a learning guide to support understanding and independent changes. AI assistance is disclosed because being able to explain and maintain the tests matters more than claiming every line was written unaided.

## Future Improvements

Add these only when there is a clear learning goal or coverage gap:

- API tests against an appropriate API demo.
- Cross-browser execution for real compatibility questions.
- Visual regression with controlled baselines.
- Accessibility checks and manual keyboard testing.
- Multiple environments when a second test target exists.
- Reusable fixtures if repeated setup becomes hard to maintain.

The current scope stays deliberately focused on understandable, maintainable browser automation.

## License

MIT. See [LICENSE](LICENSE).
