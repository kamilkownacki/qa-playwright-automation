# Interview Notes

Use these as prompts, not a script. Demonstrate the code and describe only the work you understand and have actually checked.

### Why did you choose Playwright?

It provides the browser, test runner, locators, retrying assertions and reports in one tool. That lets me focus on translating manual shopping scenarios into checks rather than building infrastructure.

### What is Page Object Model?

`LoginPage` stores login locators and actions. Tests use `login.login(...)` and then assert what happened. If a login locator changes, I update one class. For a tiny test this adds a little indirection, so I keep the classes small.

### What is the difference between smoke and regression?

The four smoke tests check whether the main shopping journey is usable. Regression includes those four plus eleven checks for sorting, errors and cart state. In this project smoke has both tags.

### Why getByRole instead of XPath?

`getByRole('button', { name: 'Login' })` describes what the user interacts with and tolerates layout changes. A long XPath tied to containers breaks when the layout changes. Where the demo provides `data-test`, I use that explicit test contract.

### What does await do?

It waits for an asynchronous action before continuing. I await filling credentials and clicking Login before checking the products page. Without it, steps could overlap or the test could finish too early.

### What happens when a test fails?

Playwright reports the failed step and saves a screenshot and video for the failed attempt. CI retries once and records a trace on that retry. Locally I can enable `--trace on` to capture the first attempt. I investigate whether the cause is the application, test or environment.

### How are tests executed in CI?

A push or pull request starts the workflow. It installs Node 24, exact npm dependencies, Chromium and system libraries, runs quality checks and the full suite, then uploads the report. Defining this workflow is separate from proving a GitHub run succeeded.

### Why should tests be independent?

Each test should work alone and in any order. Playwright gives each test a fresh browser context. My `beforeEach` logs in and sets up its cart through the UI instead of relying on the previous test.

### What is the difference between an action and an assertion?

`addToCart()` performs an action. `expect(cart.itemNames).toHaveText(...)` checks the result. A click without checking the outcome would miss many bugs.

### When would you not automate a test?

I would first explore a rapidly changing feature manually, and keep subjective game feel or visual usability assessments manual. I automate repeatable checks with clear expected outcomes; I do not automate a scenario merely to increase the count.

### Why not add every browser and more abstractions?

Chromium gives me a clear starting point. I would add browsers to answer a compatibility risk, or fixtures when repeated setup becomes a real maintenance problem. For fifteen tests, four small Page Objects are enough.

### How do you know a failure is a bug?

I read the error, check connectivity and locators, repeat the user steps manually, and compare the result with the expected behaviour. An unavailable demo or blocked browser download is an environment issue, not proof of a product bug.

### How was AI used?

AI assisted with the initial implementation and explanations. I should be able to explain each assertion, change a locator and add a simple test myself. I must not claim manual checks or CI runs that I have not performed; the validation record distinguishes them.

## 5 files you should understand before an interview

1. `tests/login.spec.ts` — a complete test, tags, setup, actions and assertions.
2. `pages/LoginPage.ts` — locators, constructor, `page` and simple reusable actions.
3. `tests/checkout.spec.ts` — business expectations, price checks and negative scenarios.
4. `playwright.config.ts` — test isolation defaults, browser, workers, retry and evidence.
5. `.github/workflows/playwright.yml` — how the repository is installed and checked in CI.

Before presenting: run smoke yourself, inspect an intentionally created local failure and restore it, then add one meaningful scenario without copying a whole spec blindly. Use [LEARNING_GUIDE.md](../LEARNING_GUIDE.md) while practising.
