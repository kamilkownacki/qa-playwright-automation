# Test Cases

Target: Sauce Demo, desktop Chromium. Unless stated otherwise, use the public standard user. Each automated test starts in a fresh browser context. **Smoke cases also belong to regression.** Automation status means implemented; execution results are recorded separately in [VALIDATION.md](VALIDATION.md).

## TC-LOGIN-001

**Title:** Valid user login — **Smoke + Regression**

**Preconditions:** User is on the login page and logged out.

**Steps:**

1. Enter `standard_user` and `secret_sauce`.
2. Click Login.

**Expected Result:** URL ends with `/inventory.html` and the Products title is displayed.

**Automation Status:** Automated — `login.spec.ts`: `should allow a valid user to log in`.

## TC-LOGIN-002

**Title:** Invalid credentials — **Regression**

**Preconditions:** User is on the login page.

**Steps:**

1. Enter an unknown username and incorrect password.
2. Click Login.

**Expected Result:** Credentials mismatch message appears; login page and Login button remain available.

**Automation Status:** Automated — `login.spec.ts`: `should display an error for invalid credentials`.

## TC-LOGIN-003

**Title:** Empty login — **Regression**

**Preconditions:** Login page with empty fields.

**Steps:**

1. Click Login without entering credentials.

**Expected Result:** Username-required message is displayed; user remains on the login form.

**Automation Status:** Automated — `login.spec.ts`: `should require a username when login fields are empty`.

## TC-LOGIN-004

**Title:** Logout blocks protected navigation — **Regression**

**Preconditions:** Standard user is logged in.

**Steps:**

1. Open the menu and select Logout.
2. Confirm the login page is shown.
3. Navigate directly to `/inventory.html`.

**Expected Result:** Login form is shown after logout. Direct navigation redirects to login with the message that inventory requires authentication.

**Automation Status:** Automated — `login.spec.ts`: `should log out and prevent access to the product list`.

## TC-PRODUCT-001

**Title:** Product catalogue loads — **Smoke + Regression**

**Preconditions:** Standard user has just logged in.

**Steps:**

1. Inspect the Products page.

**Expected Result:** Products title, six expected product names in default alphabetical order, and six Add to cart buttons are present.

**Automation Status:** Automated — `products.spec.ts`: `should display the product catalogue after login`.

## TC-PRODUCT-002

**Title:** Sort by ascending price — **Regression**

**Preconditions:** Products page is open.

**Steps:**

1. Select Price (low to high).

**Expected Result:** Prices are $7.99, $9.99, $15.99, $15.99, $29.99, $49.99 in that order.

**Automation Status:** Automated — `products.spec.ts`: `should sort products by price from low to high`.

## TC-PRODUCT-003

**Title:** Sort by descending name — **Regression**

**Preconditions:** Products page is open.

**Steps:**

1. Select Name (Z to A).

**Expected Result:** Names are in reverse alphabetical order: Test.allTheThings() T-Shirt (Red), Sauce Labs Onesie, Sauce Labs Fleece Jacket, Sauce Labs Bolt T-Shirt, Sauce Labs Bike Light, Sauce Labs Backpack.

**Automation Status:** Automated — `products.spec.ts`: `should sort products by name from Z to A`.

## TC-CART-001

**Title:** Add one product — **Smoke + Regression**

**Preconditions:** Products page, empty cart.

**Steps:**

1. Add Sauce Labs Backpack.
2. Open the cart.

**Expected Result:** Badge shows 1; product action becomes Remove; cart contains only the backpack priced $29.99.

**Automation Status:** Automated — `cart.spec.ts`: `should add a product to the cart`.

## TC-CART-002

**Title:** Add multiple products and update count — **Regression**

**Preconditions:** Products page, empty cart.

**Steps:**

1. Add Sauce Labs Backpack, then Sauce Labs Bike Light.
2. Open the cart.

**Expected Result:** Badge changes from 1 to 2; cart contains exactly both selected items and badge remains 2.

**Automation Status:** Automated — `cart.spec.ts`: `should keep multiple selected products and their count in the cart`.

## TC-CART-003

**Title:** Remove products and empty the cart — **Regression**

**Preconditions:** Cart contains a backpack and bike light.

**Steps:**

1. Remove the backpack.
2. Remove the bike light.

**Expected Result:** After the first removal only the light remains and badge is 1. After the second removal there are no cart items and the badge disappears.

**Automation Status:** Automated — `cart.spec.ts`: `should remove a product and clear the cart badge when empty`.

## TC-CART-004

**Title:** Preserve cart when continuing shopping — **Regression**

**Preconditions:** Cart contains a backpack.

**Steps:**

1. Click Continue Shopping.
2. Inspect the backpack action and cart count.
3. Open the cart again.

**Expected Result:** Products page is shown; badge remains 1 and backpack action is Remove. Cart still contains only the backpack.

**Automation Status:** Automated — `cart.spec.ts`: `should preserve the cart when returning to products`.

## TC-CHECKOUT-001

**Title:** Complete a purchase with correct totals — **Smoke + Regression**

**Preconditions:** Checkout information page; cart contains a $29.99 backpack.

**Steps:**

1. Enter Alex, Tester and 00-001.
2. Click Continue.
3. Review product and totals, then click Finish.

**Expected Result:** Overview contains the backpack, item total $29.99, tax $2.40 and total $32.39. Completion page says “Thank you for your order!” and the cart badge disappears.

**Automation Status:** Automated — `checkout.spec.ts`: `should complete a purchase with correct totals`.

## TC-CHECKOUT-002

**Title:** Reject empty customer information — **Regression**

**Preconditions:** Checkout information page with a backpack in the cart.

**Steps:**

1. Leave all customer fields empty.
2. Click Continue.

**Expected Result:** First-name-required error; user stays on checkout step one.

**Automation Status:** Automated — `checkout.spec.ts`: `should prevent checkout when all customer fields are empty`.

## TC-CHECKOUT-003

**Title:** Require last name — **Regression**

**Preconditions:** Checkout information page with a backpack in the cart.

**Steps:**

1. Fill first name and postal code; leave last name empty.
2. Click Continue.

**Expected Result:** Last-name-required error; user stays on checkout step one.

**Automation Status:** Automated — `checkout.spec.ts`: `should require a last name during checkout`.

## TC-CHECKOUT-004

**Title:** Require postal code — **Regression**

**Preconditions:** Checkout information page with a backpack in the cart.

**Steps:**

1. Fill first and last names; leave postal code empty.
2. Click Continue.

**Expected Result:** Postal-code-required error; user stays on checkout step one.

**Automation Status:** Automated — `checkout.spec.ts`: `should require a postal code during checkout`.
