# Loop Lab verification handoff

## Status

**PASS — independent verification 4 accepted candidate `cdac0887956519be14a648f8724a69e7979b6896` at `https://loop-lab.sociobot.in`.**

- Verified: 2026-08-28 UTC
- Verification report: `.factory/verification-4.md`
- No product code was changed by the verifier.
- Release-blocking defects: none.

The verifier ran every command in `.factory/claims.json` from a clean checkout (all nine PASS), then `npm test`, typecheck, lint, production build, and the complete Playwright suite against the live URL (all PASS). Local built shell, JS, CSS, service worker, manifest, and hero hashes exactly match the deployed files. First-read, one-click demo, normal save/reopen/export/import, invalid-input recovery, privacy/network, offline reload, service-worker update notice, desktop/mobile, keyboard, reduced-motion, axe, headers, cache policy, and performance checks all passed. See the verification report for exact commands, hashes, and measurements.

## Builder repair record

- Work order: `loop-lab-repair-2`
- Base/report commit: `fc97d902969ae413a7291c149ed7c07561046762`
- Repaired product commit: `c1857e3`
- Live URL: `https://loop-lab.sociobot.in`
- Deployment: Azure Static Web App `sf-loop-lab`, deployment `de956d14-6dcc-4f98-bc0e-7d5d707b4576`
- Verified: 2026-08-28 UTC

## What changed

- Decoded clips shorter than `0.05` seconds are rejected before they enter the practice desk. The visible status message explains the limit and gives the next step.
- The granular scheduler now has a defensive loop-boundary guard, so invalid state cannot send a negative duration to `AudioBufferSourceNode.start()`.
- Card imports now require the complete version-1 schema: non-empty identity/text fields, finite numeric loop/BPM/speed/timestamps, valid loop ordering and minimum duration, and complete clip data (including file audio).
- The full import is parsed and validated before persistence, then written in one IndexedDB transaction. An invalid second card cannot leave an earlier card imported.
- Added `@claim:input-boundaries` browser regression coverage using the verifier's decodable 20 ms WAV boundary and an export containing a valid card followed by an incomplete card.

## Verification evidence

Clean install and quality gates:

```text
npm ci                 PASS — 200 packages audited, 0 vulnerabilities
npm run typecheck      PASS
npm run lint           PASS
npm test               PASS — 4 Vitest tests, 8 Chromium product tests
npm run build          PASS — dist/ created
git diff --check       PASS
```

All nine commands recorded in `.factory/claims.json` were run verbatim and passed. This includes `npm run test:e2e -- --grep @claim:input-boundaries`, which proves a browser-decodable 20 ms WAV is rejected with no page error and that a mixed valid/incomplete JSON file imports no cards.

Browser and accessibility verification ran against the local production preview and the deployed origin. The 8-test live suite passed, including the normal save/reload/reopen/export-import flow, privacy request capture, service-worker offline reload, update notice, keyboard focus, desktop, and 390×844 mobile checks. The Playwright axe integration found zero serious or critical issues on desktop and mobile. `/opt/fleet/lib/verify-url.sh` passed locally and live: title, language, one h1, main landmark, image alt text, labels, and zero console/page errors. (The standalone axe CLI could not start because its bundled ChromeDriver supports Chrome 152 while this worker provides Playwright Chromium 145; the equivalent Playwright axe audit passed.)

Local production Lighthouse (mobile) generated:

| Category/metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.9 s |
| LCP | 2.1 s |
| TBT | 30 ms |
| CLS | 0 |
| Transfer | 188 KiB |

The Lighthouse process emitted a post-report browser target-crash message, but the complete JSON report was written with the values above; product console/browser tests remain clean.

Live response and identity checks:

- `/`, `/demo`, `/privacy`, `/terms`, `/manifest.webmanifest`, and `/sw.js` return 200; `/not-a-real-loop` returns 404.
- Live CSP, HSTS, `Referrer-Policy`, and `X-Content-Type-Options` are present. Hashed JS is `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- Deployed hashes equal local `dist/`:
  - `index.html`: `3af73f8db905c6ffb8d86c5c5c11058de633b01d9528fc4f29b649bf06b248fa`
  - `assets/index-BMqtsPPr.js`: `34617e1aafdcd41f010053ae18f46d7c1a32b03b33003b806b8629bc1185f3e1`
  - `sw.js`: `c51b4d9246f5e978104471180b1d9e6eb8e7c5df0910486b0213628cb6201f61`

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

To run the browser suite against the deployed product:

```sh
PLAYWRIGHT_BASE_URL=https://loop-lab.sociobot.in npm run test:e2e
```

## Known limits

- Browser storage quotas still vary by device. Export card backups before clearing browser site data.
- Loop Lab remains free until its separate billing product is registered; no paid surface is shown.

---

## Review 2 handoff

- Work order: `loop-lab-review-2`
- Reviewed: 2026-08-28 UTC
- Result: **FAIL** — see `.factory/review-2.md`.
- This reviewer changed no product code. The only changes are this handoff entry and the committed review report.

Verification performed from a clean `npm ci` install: every exact command in `.factory/claims.json` passed, and `PLAYWRIGHT_BASE_URL=https://loop-lab.sociobot.in npm run test:e2e` passed all eight live browser tests. Fresh 390 px and desktop live checks confirmed the one-click isolated demo, Reset demo, local-only demo keys, service-worker offline claim coverage, metadata, routes, and prior repair fixes.

Remaining blocking work: repair `/#saved` navigation and Back-button scroll restoration. The desktop header’s **Saved loops** link currently leaves the visitor at the top of the page while the URL changes to `/#saved`. Minor plain-language/terminology fixes are itemized in the review.
