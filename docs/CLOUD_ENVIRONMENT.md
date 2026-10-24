# Cloud Environment

The standard local commands are in the README. This document describes the additional requirements of an isolated cloud shell, not extra application architecture.

## Installation

Use the existing checkout at `/workspace/qa-playwright-automation`. Cloud tasks are already isolated: do not create an additional Git worktree unless explicitly requested.

```bash
cd /workspace/qa-playwright-automation
export PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright
npm ci --cache /workspace/.npm-cache
npx playwright install chromium
```

Use the same `PLAYWRIGHT_BROWSERS_PATH` for installation and test execution. This keeps browser downloads in a writable directory outside the repository. A different browser revision is needed if Playwright is upgraded.

On a machine missing system libraries, an administrator must run `npx playwright install-deps chromium`. The GitHub workflow installs them automatically on its Ubuntu runner with `--with-deps`.

## Network requirements

- `registry.npmjs.org`: npm dependencies.
- `cdn.playwright.dev`: browser/FFmpeg download source; downloads may redirect to `storage.googleapis.com` or `playwright.download.prss.microsoft.com` depending on the Playwright release.
- `www.saucedemo.com`: actual UI target.
- `github.com`: Git checkout/push.
- `api.github.com`: checking repository visibility and GitHub Actions execution through the GitHub CLI.

Cloud network policy changes must be saved in environment settings before they affect the running environment. Saving a draft alone does not establish that a destination is reachable. Preserve HTTPS certificate verification; do not set `ignoreHTTPSErrors`, disable TLS checks or copy credentials into scripts.

No private application secrets are required. Existing platform Git authentication may work without a raw token in the shell. A failure of the GitHub API does not prove that Git push is also unavailable.

The Playwright configuration uses `HTTPS_PROXY` when it is set. Chromium has its own certificate trust store: Node/Python trusting the proxy does not automatically prove Chromium trusts it. This cloud provides its public CA through `CODEX_PROXY_CERT`. If the browser reports `ERR_CERT_AUTHORITY_INVALID`, import that platform-provided CA with `certutil` rather than bypassing verification:

```bash
certutil -A -d "sql:$HOME/.pki/nssdb" \
  -n "Codex environment proxy CA" -t "C,," -i "$CODEX_PROXY_CERT"
```

This command assumes the existing NSS database used by this environment. On newer Chromium installations without that database, the default location is `$HOME/.local/share/pki/nssdb`; see [Chromium's certificate management documentation](https://github.com/chromium/chromium/blob/main/docs/linux/cert_management.md). Trust only the CA supplied by the environment administrator. Do not commit certificates or change browser trust on an unrelated personal machine.

## Starting work

There is no local application server to start: the tests target the external demo. In each new shell, set the browser cache variable above and then run:

```bash
npm run lint
npm run typecheck
npm run test:smoke
```

Only a completed live test run validates application behaviour. `--list` validates discovery/tag selection, not the target site. Before presenting the portfolio, run the full suite as well.

Headed/UI mode requires a display and is optional in the cloud. Localhost report viewers are local tools, not public cloud previews. Reports and test evidence are generated files; do not commit them.
