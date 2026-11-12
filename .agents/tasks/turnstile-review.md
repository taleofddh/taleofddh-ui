# Turnstile review: Enquiry form and Stay Connected form

Scope: `components/enquiry.js` and `components/stay-connected.js` (uncommitted work in progress), plus only what they depend on (`common/constants.js`, env key names, the API calls they make). Read-only review; nothing was changed.

## Summary

Turnstile is not working as protection yet. Both forms render the widget and keep the token in state, but the token does nothing:

1. The token is never sent to the backend. Neither request body includes it. **Blocker, both forms.**
2. Submit is not gated on the token. `validateForm()` ignores `turnstileToken`, so users can submit before the challenge finishes, or after it errors or expires. **Blocker, both forms.**
3. There's no server-side siteverify call anywhere in this repo. Both forms post through Amplify to API Gateway (`/request` for createRequest, `/core` for updateSubscription). That backend lives outside this repo, so I couldn't check whether it verifies anything. Even if it did, it would receive no token today. **Blocker, outside this repo.**
4. There's no ref and no `reset()`. After a failed submit, the single-use token stays in state and the widget isn't refreshed, so a retry would send a token that's already been used. **Should-fix.**
5. The secret key is not exposed. There's no `TURNSTILE_SECRET` or similar key in the repo or in any env file. Only `NEXT_PUBLIC_TURNSTILE_SITE_KEY` exists, and the site key is meant to be public.
6. The two widgets don't interfere. No page renders both forms: `Enquiry` is only on `pages/contact-us.js` and `StayConnected` is only on `pages/about-us.js`. If they ever did share a page, each component has its own state and its own widget, so there would be no shared-state bug.

Rendering is otherwise fine. The library is SSR-safe with the Pages Router, the site key comes from a `NEXT_PUBLIC_` env var, and the default theme and size are acceptable.

## Findings: Enquiry form (`components/enquiry.js`)

| # | Severity | Location | Issue | Suggested fix |
|---|---|---|---|---|
| E1 | blocker | `submitEnquiry`, `request` object ~L33-40 and `post` body ~L45-55 | `turnstileToken` is not included in the request, so the backend can't verify it. | Add `turnstileToken` to `request` (e.g. `turnstileToken: turnstileToken`), or send it as a header, whichever the backend contract expects. |
| E2 | blocker | `validateForm` ~L72-80; button `disabled={!validateForm()}` ~L143-147 | The button enables without a token. | Add `&& turnstileToken !== ''` to `validateForm()`. Also guard at the top of `submitEnquiry`: `if (!turnstileToken) return;`. Pressing Enter in a field submits the form even when the button is disabled. |
| E3 | should-fix | `catch` block ~L61-64 | On failure the used token stays in state and the widget isn't reset, so a retry sends a stale token. | `const turnstileRef = useRef(null);`, pass `ref={turnstileRef}` to `<Turnstile>`, and in `catch` (or `finally` when not successful) call `turnstileRef.current?.reset(); setTurnstileToken('');`. |
| E4 | should-fix (existing bug, now matters) | `submitEnquiry` ~L29 | `setIsLoading(true)` is never called. The button never disables while a request is in flight, so double-clicking sends the same single-use token twice. The second call fails verification. | Call `setIsLoading(true)` before `post(...)`, matching `stay-connected.js`. |
| E5 | nit | L58 `setTurnstileToken('')` on success | Harmless but has no effect. On success `requestId` is set, the form unmounts, and the widget is removed with it. | Keep or drop. Reset is only needed on the failure path (E3). |
| E6 | nit | Turnstile ~L137-140 | `onError` silently clears the token. The user gets no message and only sees a disabled button. `onTimeout` isn't handled. | Add a small `aria-live="polite"` message such as "Verification failed, please retry", and handle `onTimeout` the same way. Optionally pass `options={{ size: 'flexible' }}` for narrow screens. I didn't check the layout. |
| E7 | nit | L31, L42 `console.log` | Logs name, email, phone and message (PII) to the browser console. Not Turnstile-specific. | Remove before release. |

## Findings: Stay Connected form (`components/stay-connected.js`)

| # | Severity | Location | Issue | Suggested fix |
|---|---|---|---|---|
| S1 | blocker | `submitSubscription`, `post` body ~L157-160 (`{ email, subscribed: true }`) | The token isn't sent. | Add `turnstileToken` to the body. |
| S2 | blocker | `validateForm` ~L179-192; button ~L110-114 | The button and the `if (validateForm())` gate ignore the token. | Add `&& turnstileToken !== ''` to the return expression of `validateForm()`. That also covers the existing guard inside `submitSubscription`. |
| S3 | should-fix | `catch` ~L171-174 | Same as E3: no reset or token clear on failure. | Add `useRef`, pass `ref` to `<Turnstile>`, and call `turnstileRef.current?.reset(); setTurnstileToken('');` in `catch`. |
| S4 | nit | L168 `setTurnstileToken('')` on success | No effect. `newSubscription` is set and the form unmounts. | Keep or drop. |
| S5 | nit | Turnstile ~L103-106 | Same as E6: no user feedback on error or timeout. | Same as E6. |

Note: the button has no `type` and also has `onClick={submitSubscription}`. Inside the form it defaults to `submit`, but `preventDefault()` on the click event stops the native submit, so it submits once. Fine as is.

## Shared / cross-cutting

| # | Severity | Location | Issue | Suggested fix |
|---|---|---|---|---|
| X1 | blocker (outside repo) | Backend behind `createRequest` (`/request`, `common/constants.js` ~L129-131) and `updateSubscription` (`/core`) | No siteverify in this repo: no `pages/api`, nothing in `middleware.js`. Verification has to happen in the API Gateway/Lambda backend, which I couldn't see. | In the backend, POST `secret` + `response` (the token) + optional `remoteip` to `https://challenges.cloudflare.com/turnstile/v0/siteverify`. Reject when `success !== true`. Optionally check `hostname`/`action`. Keep the secret in backend config or Secrets Manager, never in a `NEXT_PUBLIC_` var. |
| X2 | should-fix | `common/constants.js` L11 `TURNSTILE_SITE_KEY` | If the env var is missing at build time, `siteKey` is `undefined`, the widget fails (110xxx), and with E2/S2 fixed the forms can't be submitted. | Fail visibly in dev (e.g. a `console.error` when it's unset). Make sure the Amplify Console sets `NEXT_PUBLIC_TURNSTILE_SITE_KEY` for each branch. |
| X3 | info | Interference | Each form has its own `useState` token and its own `<Turnstile>` instance. The library loads the Cloudflare script once and renders separate widgets. Today the forms never share a page. | None needed. If both are ever placed on one page, keep separate refs. Don't lift the token into shared context. |

## Evidence: what I checked

- **Widget usage.** `git diff` and a repo-wide grep for `turnstile|siteverify` (excluding node_modules/.next). The only usage is the two components, `common/constants.js` L11 and `package.json`. The lock file resolves `@marsidev/react-turnstile` to 1.6.3, with peer React 17/18/19, so React 18 is compatible.
- **Library API.** Checked against `node_modules/@marsidev/react-turnstile/dist/index.d.ts` and the README:
  - `siteKey`, `onSuccess`, `onExpire` and `onError` are correct prop names.
  - The ref exposes `reset()`, `getResponse()` and `isExpired()`.
  - `options.refreshExpired` defaults to `"auto"`, so after expiry the widget re-runs and `onSuccess` fires again with a new token. Clearing the token in `onExpire` is correct.
  - The README's own example calls `ref.reset()` after submission.
- **SSR.** The library advertises SSR support and injects the script on the client. The pages use the Pages Router. `reactStrictMode: true` (`next.config.js` L5) only causes a dev double mount, which the library handles. No CSP exists in `next.config.js` or `middleware.js`, so nothing blocks `challenges.cloudflare.com`.
- **Pages.** `pages/contact-us.js` L44 renders `<Enquiry>`; `pages/about-us.js` L46 renders `<StayConnected />`. No other usages.
- **Env key names only, no values echoed.**
  - `.env.development.local` and `.env.production.local` each define `NEXT_PUBLIC_TURNSTILE_SITE_KEY` with a 24-character `0x...`-format value, which looks like a real site key.
  - `.env.local` defined it at the start of this review (with Cloudflare's public always-pass test key) but no longer contains it. It looks like it was edited during the review.
  - No secret-key variable exists in any env file. All three files are gitignored.
- **Build env plumbing.** `amplify.yml` doesn't write env files, so on Amplify the `NEXT_PUBLIC_` vars must come from Amplify Console environment variables at build time. `next.config.js` `env` doesn't reference Turnstile, which is fine because `NEXT_PUBLIC_` vars are inlined automatically.

## What I couldn't verify

- Whether the backend Lambdas for `/request` and `/core` (updateSubscription) call siteverify, and where the secret key is stored. That code isn't in this repo.
- Whether the Amplify Console has `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set for the deployed branches.
- Whether the `0x...` site keys in the dev/prod env files are registered in Cloudflare for the right hostnames.
- Runtime behaviour in a browser: rendering, layout on mobile, the error and expiry flows. I didn't run `npm run build` or the dev server because this was a read-only review. There are no unit tests for these components.

## Recommended order of fixes

1. Backend: add siteverify to both endpoints (X1) and agree on the field name for the token.
2. Front end, both forms:
   - send the token (E1, S1)
   - gate submit on it (E2, S2)
   - add a ref and reset/clear on failure (E3, S3)
   - call `setIsLoading(true)` in the Enquiry form (E4)
3. Nits: error/timeout messaging, `size: 'flexible'`, remove the PII `console.log`s, and a missing-site-key guard (X2).

Deploy the backend check and the front-end change together, or make the backend accept requests with no token during the rollout. Otherwise, rejecting missing tokens before the front end sends them will break both forms.
