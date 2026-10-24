# Validation Record

Initial validation: **23 October 2026 (Europe/Warsaw)**, against the live `https://www.saucedemo.com/` site, not mocked responses or a local copy.

## Execution results

| Check                             | Result                                                                   |
| --------------------------------- | ------------------------------------------------------------------------ |
| `npm install`                     | Passed; exact dependency versions and lockfile created.                  |
| `npm ci`                          | Passed; repeated successfully using the saved cloud installation script. |
| `npx playwright install chromium` | Passed after resolving download-domain access.                           |
| `npm test`                        | **15 passed**, 0 failed, 0 skipped, 0 flaky; 8.6 seconds.                |
| `npm run test:smoke`              | **4 passed**, 0 failed, 0 skipped, 0 flaky; 2.8 seconds.                 |
| `npm run test:regression`         | **15 passed**, 0 failed, 0 skipped, 0 flaky; 8.2 seconds.                |
| `npm run lint`                    | Passed.                                                                  |
| `npm run typecheck`               | Passed with strict TypeScript checking.                                  |
| `npm run format:check`            | Passed.                                                                  |
| Workflow static validation        | Passed with actionlint 1.7.12 (official release checksum verified).      |
| Documentation links               | Local Markdown links checked; no broken links.                           |

Runtime: Debian 13, Node.js 24.19.0, npm 11.9.0, Playwright 1.64.1 and its installed Chromium 156.0.8078.4. Two workers, no local retries. All three suites completed; counts were confirmed from each run's separate Playwright JSON results. Extra reporters/output directories were used to preserve evidence across runs; these do not change the test selection or assertions.

Each run produced an ignored HTML report; the default report shows the most recent run. Generated reports, browser downloads and validation JSON files are not committed. Smoke and regression overlap by design: this is 15 distinct scenarios, not 34 different tests. A further 4/4 smoke run passed after repeating the saved installation script.

## Issues resolved during implementation

- The cloud initially blocked the demo and GitHub API. Their required domains were added to the environment draft; connectivity was then confirmed.
- Browser download redirected from `cdn.playwright.dev` to `storage.googleapis.com`. After adding the redirect destination and waiting for runtime access to update, Chromium, headless shell and FFmpeg installed successfully.
- Chromium needed the cloud's provided proxy CA in its NSS trust store. HTTPS verification remained enabled throughout; no `ignoreHTTPSErrors` or TLS-verification bypass was used. Playwright uses `HTTPS_PROXY` when provided.
- The current demo exposes Logout as a button role. The Page Object uses that current accessible role rather than assuming it is a link.

No application defect was confirmed by these scenarios. The bug report document remains explicitly hypothetical.

## GitHub Actions and publication

The workflow passed static validation and an actual GitHub-hosted run: [Playwright tests — run 40025797958](https://github.com/kamilkownacki/qa-playwright-automation/actions/runs/40025797958), for the initial implementation commit `807834e`. The run completed successfully on 23 October 2026. Installation, code-quality checks, tests and report upload all succeeded on the Ubuntu runner. The API also confirmed the non-expired `playwright-results` artifact (206,415 bytes).

The workflow uses the current Node 24-native v7 releases of the official checkout, setup-node and upload-artifact actions. Their release metadata and `action.yml` runtimes were checked against the official GitHub repositories.

This is separate evidence from the local execution table above. The cloud network policy prevented downloading the detailed GitHub log, so the GitHub result is based on its completed job/step status and artifact metadata. The exact counts in the table above were verified from the local Playwright JSON results.

The selected existing GitHub repository was private. Changing its visibility through the available integration returned HTTP 403 (`Resource not accessible by integration`), despite repository metadata reporting that the user has admin access. The integration's permission scope is a separate constraint. The owner needs to change visibility in GitHub repository settings; no public publication is claimed until verified. Inspecting Actions administration settings was also denied by that integration, which does not by itself establish whether workflows are enabled.

## Remaining limits

Headed/UI mode was not exercised in this cloud shell; it requires a graphical display. Only Chromium and the standard demo user are covered. The public external app can change independently of this repository. The owner should manually review the core journeys, practise adding a test and read the learning guide before presenting the project. Saving cloud configuration does not publish an environment snapshot or prove restoration in a new task.
