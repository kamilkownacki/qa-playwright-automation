# Przewodnik po projekcie

Ten projekt łączy znane Ci myślenie manualnego QA z kodem: przygotuj stan, wykonaj akcję, sprawdź wynik. Nie musisz znać całego JavaScriptu, żeby prześledzić pierwszy test. Zacznij od `tests/login.spec.ts` i `pages/LoginPage.ts`.

## 1. Jak działa pojedynczy test

Poniżej prosty przykład samodzielnego testu na tej samej aplikacji. To przykład do przeczytania, a nie dodatkowy plik w zestawie 15 testów:

```ts
import { test, expect } from '@playwright/test';

test('should show the products page after login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  const username = page.getByPlaceholder('Username', { exact: true });
  const password = page.getByPlaceholder('Password', { exact: true });
  await username.fill('standard_user');
  await password.fill('secret_sauce');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});
```

Co oznaczają kolejne linie:

1. `import` udostępnia funkcję `test` oraz asercje `expect` z Playwrighta.
2. `test()` rejestruje scenariusz pod czytelną nazwą. Funkcja po nazwie zawiera jego kroki.
3. `async` oznacza, że funkcja może wykonywać operacje asynchroniczne i używać `await`.
4. `{ page }` pobiera gotową stronę przeglądarki od Playwrighta. Nie musisz sam tworzyć przeglądarki. Każdy test dostaje stronę w nowym, odizolowanym kontekście.
5. `await page.goto(...)` otwiera stronę i czeka na zakończenie nawigacji.
6. `const username = ...` tworzy locator pola nazwy użytkownika. Locator opisuje, jak znaleźć element; samo utworzenie go nie wpisuje danych.
7. Kolejny locator wskazuje pole hasła.
8. `await username.fill(...)` zastępuje zawartość pola podaną wartością.
9. Drugie `fill()` wpisuje hasło.
10. `getByRole(...)` szuka przycisku o nazwie Login, a `click()` go klika. `await` zachowuje kolejność działań.
11. `expect(...).toBeVisible()` sprawdza, czy napis Products jest widoczny. To punkt, w którym potwierdzamy wynik, a nie tylko wykonujemy akcje.

W rzeczywistym projekcie te same locatory i kroki logowania są w `LoginPage`. `beforeEach` w `login.spec.ts` otwiera stronę przed każdym testem, a test używa `login.login(...)`. Asercje sprawdzają URL oraz tytuł przez `toHaveText()`.

`beforeEach` nie oznacza „zaloguj raz dla wszystkich”. Uruchamia się ponownie dla każdego testu w pliku. Dzięki temu błąd jednego scenariusza nie pozostawia koszyka dla następnego.

**Ćwiczenie:** otwórz pierwszy test i wskaż: przygotowanie, akcję oraz dwie asercje. Następnie wyjaśnij, dlaczego sam brak błędu po kliknięciu Login nie wystarcza.

## 2. Co to jest locator

Locator to przepis na znalezienie elementu. Playwright ponownie wyszukuje element przy akcji/asercji, więc nie przechowujesz starego elementu DOM.

| Podejście            | Przykład                                                 | Kiedy pomaga                                                                     |
| -------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `getByRole()`        | `page.getByRole('button', { name: 'Login' })`            | Gdy element ma rolę i nazwę dostępną dla użytkownika.                            |
| `getByLabel()`       | `page.getByLabel('Email')`                               | Gdy formularz ma poprawnie powiązaną etykietę.                                   |
| `getByPlaceholder()` | `page.getByPlaceholder('Username')`                      | W formularzach Sauce Demo, które udostępniają te placeholdery.                   |
| `getByText()`        | `page.getByText('Sauce Labs Backpack', { exact: true })` | Gdy interesuje nas konkretny tekst.                                              |
| `getByTestId()`      | `page.getByTestId('shopping-cart-badge')`                | Gdy aplikacja ma dedykowany atrybut testowy.                                     |
| CSS                  | `page.locator('.inventory_item')`                        | Gdy brak lepszego identyfikatora; klasa może zmienić się przy zmianie stylu.     |
| XPath                | `page.locator('xpath=//div[2]/button')`                  | Potrafi opisać strukturę, ale taki przykład łatwo psuje się przy zmianie układu. |

W `playwright.config.ts` ustawiamy `testIdAttribute: 'data-test'`, bo aplikacja używa `data-test`, a nie domyślnego `data-testid`. Dzięki temu `getByTestId('error')` znajduje element z `data-test="error"`.

Nie każda metoda jest automatycznie stabilna. Tekst może się zmienić, a kilka przycisków może mieć tę samą nazwę. W `ProductsPage.product(name)` najpierw wybieramy kartę konkretnego produktu, a dopiero w niej przycisk Add to cart. Nie używamy `first()` do ukrywania niejednoznacznego locatora.

`exact: true` zapobiega dopasowaniu fragmentu nazwy, gdy potrzebujemy dokładnego tekstu. Locator oparty na roli wspiera sprawdzanie interfejsu dostępnego użytkownikowi, ale nie zastępuje pełnego audytu dostępności.

## 3. async / await

Przeglądarka wykonuje operacje w czasie: otwiera stronę, wpisuje tekst, obsługuje kliknięcie. Te operacje zwracają obietnice zakończenia, czyli Promise.

```ts
await login.usernameInput.fill('standard_user');
await login.passwordInput.fill('secret_sauce');
await login.loginButton.click();
```

Czytaj: wpisz nazwę i poczekaj, wpisz hasło i poczekaj, kliknij i poczekaj. Bez `await` test może zacząć następny krok przed końcem poprzedniego albo zakończyć się przed operacją.

```ts
async login(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}
```

Wywołanie tej metody również wymaga `await login.login(...)`. Samo dodanie `async` do metody nie powoduje, że wywołujący automatycznie na nią czeka.

Nie dodawaj `waitForTimeout(3000)`, żeby „ustabilizować” test. Playwright czeka przy klikaniu m.in. na widoczność i możliwość interakcji, a asercje webowe ponawiają sprawdzenie. Jeżeli potrzebujesz konkretnego stanu, wyraź go przez asercję, np. `await expect(cart.cartBadge).toHaveText('1')`.

## 4. Assertions

Akcja zmienia stan. Asercja ocenia wynik:

```ts
await products.addToCart('Sauce Labs Backpack'); // akcja
await expect(products.cartBadge).toHaveText('1'); // asercja
```

`click()` może się udać nawet wtedy, gdy aplikacja nie doda produktu. Dlatego sprawdzamy również jego nazwę i cenę w koszyku.

W projekcie znajdziesz:

- `toHaveURL()` — czy użytkownik trafił na właściwy ekran.
- `toBeVisible()` — czy element jest widoczny.
- `toHaveText()` — czy komunikat, kwota lub lista tekstów odpowiada oczekiwaniu.
- `toHaveCount()` — ile elementów pasuje do locatora, np. zero produktów po usunięciu.

`await expect(locator).toHaveText(...)` ponawia sprawdzenie do limitu czasu. Jednorazowe pobranie tekstu i porównanie go nie ma tego samego automatycznego oczekiwania. W listach oczekiwane wartości są zapisane niezależnie od wyniku strony, żeby test nie porównywał wyniku z nim samym.

Nie zmieniaj oczekiwania tylko dlatego, że test jest czerwony. Najpierw ustal, czy zmieniło się wymaganie/dane demo, czy pojawił się błąd.

## 5. Page Object Model

Page Object to mała klasa opisująca fragment aplikacji. `LoginPage` wie, jak znaleźć pola i wykonać logowanie. Nie decyduje, czy konkretne logowanie ma się udać — to opisuje test.

- `constructor` przyjmuje `page` i przygotowuje locatory.
- `private readonly page` przechowuje stronę do użytku wewnątrz klasy.
- `readonly usernameInput: Locator` mówi TypeScriptowi, jakiego typu jest pole. `readonly` zapobiega podmianie tego pola w kodzie; nie blokuje wpisywania tekstu na stronie.
- Metody takie jak `login()` i `openCart()` opisują proste akcje użytkownika.

Zaleta: zmieniony locator naprawiasz w jednym miejscu. Minus: czytając test, czasem trzeba zajrzeć do drugiego pliku, żeby zobaczyć szczegóły. Dlatego nie tworzymy klasy bazowej, fabryk i kilku warstw helperów.

Własne fixture do logowania mogłoby kiedyś zmniejszyć powtarzalność. Na tym etapie jawny `beforeEach` ułatwia naukę i debugowanie.

## 6. Smoke vs Regression

Smoke odpowiada na pytanie: czy najważniejsza ścieżka sklepu w ogóle działa? Tutaj to 4 scenariusze: logowanie, lista produktów, dodanie produktu i zakup.

Regression sprawdza także ryzyko zepsucia istniejących zachowań: błędne dane, sortowanie, usuwanie, powrót do produktów i wymagane pola checkoutu.

```ts
test(
  'should allow a valid user to log in',
  {
    tag: ['@smoke', '@regression'],
  },
  async ({ page }) => {
    // Kroki testu.
  },
);
```

To fragment ilustrujący tagi; pełny test jest w `login.spec.ts`. Smoke ma oba tagi, dlatego `npm run test:regression` wybiera wszystkie 15 testów. Nie sumuj 4 + 15 jako 19 różnych scenariuszy.

Sprawdzenie wyboru bez uruchamiania przeglądarki:

```bash
npm run test:smoke -- --list
npm run test:regression -- --list
```

Lista testów potwierdza selekcję, ale nie dowodzi, że aplikacja działa.

## 7. GitHub Actions

Po pushu lub otwarciu/aktualizacji pull requestu GitHub odczytuje `.github/workflows/playwright.yml`:

1. Tworzy maszynę Ubuntu i pobiera repozytorium.
2. Ustawia Node.js 24 na podstawie `.nvmrc`.
3. `npm ci` instaluje wersje z lockfile. Nie trzeba commitować `node_modules`.
4. Instaluje Chromium i biblioteki systemowe.
5. Uruchamia ESLint, sprawdzanie TypeScript i Prettier.
6. Uruchamia wszystkie testy z jednym workerem i maksymalnie jednym retry.
7. Zapisuje raport i dostępne dowody błędów jako artifact na 14 dni, o ile run nie został anulowany.

Zielony workflow oznacza, że uruchomione kroki zakończyły się powodzeniem — nie że aplikacja nie ma żadnych błędów. Test zaliczony dopiero po retry jest flaky i wymaga uwagi. Czerwony workflow może oznaczać błąd testu/aplikacji, ale też problem instalacji lub sieci. Sprawdź pierwszy nieudany krok i log.

Sam plik YAML nie dowodzi, że workflow wykonał się na GitHub. Faktyczne wyniki i ograniczenia są zapisane w `docs/VALIDATION.md`.

## 8. Debugowanie failure

1. **Przeczytaj błąd.** Który test i krok zawiódł? Czy to brak przeglądarki, błąd nawigacji, timeout locatora czy niezgodna wartość?
2. **Otwórz raport** przez `npm run report`. Zobacz expected/actual, screenshot i dostępne video.
3. **Uruchom jeden test**, np. `npx playwright test tests/cart.spec.ts -g "should add a product to the cart"`.
4. **Użyj headed lub UI mode** na komputerze z pulpitem: `npm run test:headed -- tests/cart.spec.ts` albo `npm run test:ui`. W chmurze bez pulpitu pracuj headless i analizuj pliki raportu.
5. **Sprawdź locator.** Czy element istnieje? Czy jego nazwa się zmieniła? Czy dopasowanie jest jednoznaczne?
6. **Sprawdź assertion.** Czy oczekiwanie nadal odzwierciedla wymaganie? Nie usuwaj asercji tylko po to, żeby uzyskać zielony wynik.
7. **Zapisz trace**, np. `npx playwright test tests/cart.spec.ts --trace on`. Otwórz rzeczywistą ścieżkę pliku `trace.zip` przez `npx playwright show-trace <ścieżka>`.
8. **Odtwórz kroki manualnie.** Porównaj wynik, zapisz warunki i powtarzalność. Problem środowiska opisz osobno od defektu aplikacji.
9. **Popraw przyczynę i ponów test**, a potem odpowiedni zestaw. Nie maskuj błędu dodatkowym retry lub stałym sleepem.

Screenshot pokazuje pojedynczy moment, video przebieg, a trace pozwala przejrzeć akcje, DOM i żądania. Lokalnie domyślnie nie ma retry ani trace — ustaw `--trace on` przed odtworzeniem problemu.

## Jak samodzielnie dodać test

Najpierw opisz cel manualny i oczekiwany wynik. Dobry kolejny scenariusz to odrzucenie logowania z nazwą użytkownika i pustym hasłem. Dodaj test w `login.spec.ts`, użyj istniejącego `LoginPage`, sprawdź konkretny błąd i brak przejścia do produktów. Nadaj tag `@regression`, uzupełnij test cases i zaktualizuj liczby w dokumentacji.

Przed rozmową uruchom go samodzielnie, pokaż, co powoduje failure, i wyjaśnij, czemu nie zależy od innego testu. Przykładowe odpowiedzi oraz pięć plików do zrozumienia znajdziesz w `docs/INTERVIEW_NOTES.md`.
