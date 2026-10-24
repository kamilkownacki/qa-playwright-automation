# Test Plan

## Objective

Check the main shopping journeys in Sauce Demo and demonstrate how manual QA scenarios can become readable automated checks. Prioritise the ability to log in, find products, manage a cart and finish a demo purchase.

## Scope

- Standard-user login, invalid/empty credentials and logout access protection.
- Six-product catalogue, low-to-high price sorting and Z-to-A name sorting.
- Single/multiple cart items, badge changes, removal and navigation state.
- Required checkout fields, selected product, demo totals and completion.

Fifteen scenarios are described in [TEST_CASES.md](TEST_CASES.md). Assertions verify observable outcomes rather than only executing clicks.

## Out of Scope

Real payments, delivery, backend/database verification, load/security testing, mobile devices, full accessibility, visual comparisons and browser compatibility beyond desktop Chromium. Other demo users with deliberately broken behaviour are not part of the standard-user suite.

## Test Types

- **Smoke:** 4 critical journeys: login, catalogue, add to cart and purchase.
- **Regression:** all 15 tests, including those 4 smoke checks. The additional checks cover validation, sorting, logout and cart state.

## Test Environment

Target: `https://www.saucedemo.com/`, a shared external testing demo. Runtime: Node.js 24, npm and the Chromium revision installed by the pinned Playwright package. CI: GitHub Actions on `ubuntu-latest`; locally: a Playwright-supported OS.

Use the published `standard_user` / `secret_sauce` demo login and fictional customer information. Every test uses a fresh browser context; there is no shared authenticated session and no dependence on test order.

## Risks

- Demo availability, proxy restrictions or certificate problems can prevent navigation.
- The external site is not version-pinned: product prices, labels or attributes may change.
- Hardcoded expected prices deliberately detect changes; review a mismatch before updating them.
- Retry can conceal intermittent problems if a recovered attempt is ignored. Review flaky results.
- Fifteen examples cannot establish complete application quality.

Keep parallelism low: two local workers, one in CI. Do not work around failures with arbitrary sleeps, disabled assertions or unrestricted retries.

## Entry Criteria

- Dependencies installed from the lockfile; matching Chromium and required OS libraries available.
- Demo reachable over HTTPS with a trusted certificate.
- Public standard-user login available.
- Tests discovered (15 regression, 4 smoke), with no `.only` or skipped cases.

## Exit Criteria

- All 15 tests pass against the live demo; separate smoke and regression commands select the expected tests.
- Lint, TypeScript and formatting checks pass.
- Failures are investigated and evidence retained; blocked/unrun checks remain explicit.
- CI workflow is reviewed; an actual green GitHub run is recorded separately when available.
- The learner can explain the tests and manually review the main journeys before presenting the portfolio.

## Known Limitations

One browser, one user and one external environment. UI confirmation does not prove a backend transaction or a real payment. Checkout tests cover empty required fields, not every invalid input format. The example bug report is hypothetical. Current execution evidence and any environment blockers belong in [VALIDATION.md](VALIDATION.md).
