# Example Bug Report

**Educational example — hypothetical and not reported as a confirmed finding.** This shows how to write a useful QA report. It is not evidence that the current Sauce Demo standard-user flow is broken.

## Title

Cart badge remains at 1 after the last item is removed

## Environment

Hypothetical environment: Sauce Demo, desktop Chromium, standard user. In a real report, record the exact browser/OS versions, date and application build if available.

## Preconditions

User is logged in as `standard_user`. Cart contains only Sauce Labs Backpack.

## Steps to Reproduce

1. Open the cart.
2. Confirm one backpack is listed and the badge displays 1.
3. Click Remove for the backpack.
4. Inspect the cart contents and badge.

## Actual Result

Hypothetical: the item disappears, but the cart badge still displays 1.

## Expected Result

Cart is empty and the badge disappears so the indicator matches the selected items.

## Severity

Minor: misleading UI state; the example does not establish a blocked purchase or lost data.

## Priority

Medium, subject to product triage: visible in a common shopping action but not a critical checkout failure.

## Notes

In a real investigation, retry in a fresh session, record reproducibility and attach a screenshot/trace. Check whether navigating away or refreshing corrects the badge. Do not claim reproduction or attach invented evidence. The implemented `TC-CART-003` checks the expected behaviour and would detect this discrepancy.
