# Turnstile re-check: Enquiry and Stay Connected forms

Read-only re-check of the uncommitted edits in `components/enquiry.js`, `components/stay-connected.js` and `common/constants.js`, measured against `.agents/tasks/turnstile-review.md`. I didn't change any code.

## Summary

The two blockers are fixed in both forms. Each form now sends the token and requires it before submitting.

- (a) Both request bodies include the token under the same field name, `turnstileToken`. Enquiry: `enquiry.js:40`. Stay Connected: `stay-connected.js:164`. The variable is spelled correctly everywhere. A grep for `turnbstile` finds nothing in `components/`, `common/` or `pages/`.
- (b) Both `validateForm()` functions now require `turnstileToken.length > 0` (`enquiry.js:81`, `stay-connected.js:194`). Stay Connected also guards inside the handler, because `submitSubscription` calls `if (validateForm())` at L150. Enquiry's `submitEnquiry` still has no guard of its own. The disabled submit button blocks Enter-key submission in practice (see E2), but the handler isn't defended.
- (c) Neither form has a ref or calls `reset()`. The token is cleared only on success, where it makes no difference. After a failed submit, the used token stays in state, the button stays enabled, and a retry sends a token that has already been used. **Not fixed.**
- (d) Enquiry still never calls `setIsLoading(true)`. **Not fixed.**
- (e) No new bugs, typos or stale closures. The only new lint finding is a stray `;;` at `stay-connected.js:194`.
- Backend siteverify (X1) is outside this repo and is still open and unverified. Until the `/createRequest` and `/updateSubscription` Lambdas verify the token, it gives no protection.

## Status table

| ID | Prior severity | Status | Evidence |
|---|---|---|---|
| E1 token sent | blocker | **Fixed** | `enquiry.js:40` adds `turnstileToken: turnstileToken` to `request`, which is sent as `body: request` at L54. |
| E2 submit gated | blocker | **Partially fixed** | `validateForm()` L81 requires a token, and the button gets `disabled={!validateForm()}` at L150. There's no guard at the top of `submitEnquiry` (L29-31). Mitigating factor: `LoaderButton` renders a real `<button type="submit" disabled>` (`loader-button.js:37-38`), and browsers don't do implicit (Enter-key) submission when the default button is disabled. The `TextArea` takes Enter as a newline. So the remaining gap is defence in depth, not an open path. |
| E3 reset/clear on failure | should-fix | **Not fixed** | The `catch` at L62-65 only calls `onError` and `setIsLoading(false)`. There's no `useRef` import (L1) and no `ref` on `<Turnstile>` (L139-142). |
| E4 `setIsLoading(true)` | should-fix | **Not fixed** | `submitEnquiry` L29-56 never sets loading to true. A double-click sends two requests with the same single-use token. |
| E5 success-path clear | nit | Unchanged (added) | L59 `setTurnstileToken('')`. Harmless, because the form unmounts when `requestId` is set. |
| E6 error/timeout feedback | nit | **Not fixed** | L139-142 has no `onTimeout` handler and shows no message to the user. |
| E7 PII `console.log` | nit | **Not fixed** | L31 and L43 still log name, email, phone and message. L43 now also logs the token. |
| S1 token sent | blocker | **Fixed** | `stay-connected.js:161-165` body is `{ email, subscribed: true, turnstileToken }`. |
| S2 submit gated | blocker | **Fixed** | `validateForm()` L192-194 requires a token. The button is disabled at L112, and the handler guards with `if (validateForm())` at L150. |
| S3 reset/clear on failure | should-fix | **Not fixed** | The `catch` at L171-174 has no reset or clear. There's no `useRef` (L1) and no `ref` on `<Turnstile>` (L103-106). |
| S4 success-path clear | nit | Unchanged | L169. Harmless, because the form unmounts. |
| S5 error/timeout feedback | nit | **Not fixed** | L103-106, same as E6. |
| X2 missing site-key guard | should-fix | **Not fixed** | `constants.js:11` exports the env value with no check. You've confirmed the variable is set in the Amplify Console, so this now matters only for local or dev builds. |
| X1 backend siteverify | blocker (outside repo) | **Open, can't verify** | No backend code in this repo. |

## Lint and build checks

- `npx eslint components/enquiry.js components/stay-connected.js` from the repo root fails with exit 2. ESLint 9.39.4 is installed, and the repo has no `eslint.config.*` or `.eslintrc*`. `npm run lint` is `next lint`, which would start interactive setup, so I didn't run it. This is a project setup gap, not something these edits caused.
- As a substitute, I ran ESLint with a throwaway flat config in `/tmp` (deleted afterwards). It used the repo's `eslint-plugin-react` and `eslint-plugin-react-hooks` with the rules `no-unused-vars`, `no-undef`, `no-extra-semi`, `react/jsx-uses-vars`, `react/jsx-uses-react` and `react-hooks/*`. Result: **0 errors, 4 warnings**.
  - `enquiry.js:14` `source` unused, `:15` `router` unused, `:16` `index` unused. All three were there before these edits.
  - `stay-connected.js:194` unnecessary semicolon (`;;`). This one is **new**.
- The new imports `Turnstile` and `TURNSTILE_SITE_KEY` are used in both files. There are no unused new imports and no undefined identifiers.
- Stale closures: none. `submitEnquiry`, `submitSubscription` and `validateForm` are recreated on every render and read `turnstileToken` from the current state. The `onSuccess`, `onExpire` and `onError` callbacks only call the setter.
- The Stay Connected widget sits in the always-rendered `formcontainer` (L86-108), outside the `isAdditionalEnqueries` branch, so it renders in both modes.
- I didn't run the dev server or `next build`, and I didn't test in a browser.

## Remaining issues and fixes

### Should-fix

1. **E3/S3: reset the widget and clear the token on failure, in both forms.** Without this, a failed submit leaves a used token in state. The button stays enabled and the retry gets rejected (`timeout-or-duplicate`) once the backend verifies. The user also has no way to get a new token other than reloading the page.
   ```js
   import React, { useRef, useState } from 'react';
   const turnstileRef = useRef(null);
   // <Turnstile ref={turnstileRef} siteKey={TURNSTILE_SITE_KEY} ... />
   } catch (error) {
       onError(error);
       turnstileRef.current?.reset();
       setTurnstileToken('');
       setIsLoading(false);
   }
   ```
2. **E4: Enquiry loading state.** Call `setIsLoading(true)` before the `post(...)` in `submitEnquiry`. `LoaderButton` already disables itself while `isLoading` is true, so this stops double submits that reuse the token.
3. **E2 (remaining part): guard the Enquiry handler.** Put this at the top of `submitEnquiry`, after `preventDefault()`:
   ```js
   if (!validateForm() || isLoading) return;
   ```
   This matches the Stay Connected pattern. It's cheap and protects against `requestSubmit()` or later markup changes.
4. **X1 (outside repo):** add siteverify to both backend Lambdas and read the `turnstileToken` field from the body. Both forms use that same field name, so one shared helper works for both. Roll out the backend and front end together, or have the backend accept a missing token during the transition.

### Nits

5. **New:** `stay-connected.js:194`. Change `turnstileToken.length > 0;;` to a single `;`.
6. **E7:** remove `console.log(request)` at `enquiry.js:43`. It now prints the Turnstile token along with PII. Also remove L31.
7. **E6/S5:** add `onTimeout={() => setTurnstileToken('')}` and a short `aria-live="polite"` message when the challenge fails.
8. **X2:** log a `console.error` in development when `TURNSTILE_SITE_KEY` is unset.
9. **Tooling:** add an `eslint.config.mjs` that extends `next/core-web-vitals` through `FlatCompat`, so `npx eslint` and `next lint` work.
