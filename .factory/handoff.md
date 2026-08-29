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

---

# Loop Lab review 3 handoff

## Status

**FAIL — adversarial first-read review 3 found six blocking reopened findings and four minor findings.**

- Work order: `loop-lab-review-3`
- Reviewed: 2026-08-29 UTC
- Base: `4b3d0c092a9d3cb9b0f72ee2ebaac24883b335cd`
- Live URL: `https://loop-lab.sociobot.in`
- Full report: `.factory/review-3.md`
- Product code changed: no

## What was done

- Audited the live landing page cold at 390 × 844 and 1440 × 900.
- Exercised the one-click demo, realistic seeded state, Reset demo, Start for real, demo/real IndexedDB isolation, and request log.
- Ran every exact command in `.factory/claims.json` from the clean requested checkout.
- Checked live offline/privacy behavior, routes, titles, metadata, links, 404 behavior, route focus/history, accessibility, responsive layout, security headers, and visual identity.
- Read `.factory/review-2.md`, all verification reports, and the previous handoff; verified each earlier item against live behavior and source.
- Audited every landing/README sentence and interface label with word counts.

## Verification

```text
npm ci                                      PASS
all 9 exact claims.json commands            PASS
npm test                                    PASS — 4 unit, 8 browser
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS — dist/ produced
live offline/isolation/privacy claim subset PASS — 3 browser tests
verify-url.sh live                          PASS
live Playwright axe/mobile structure test   PASS
```

The live demo made only same-origin requests. Demo writes used `demo:` keys, Reset restored only the sample, and an existing `real:` sentinel survived demo use and remained visible in the real workspace.

## Work left

The previous review's Saved loops fragment and Back-button defect remains. Five previous copy findings also remain unchanged, so this round reopens all six as blocking per the work order. New minor findings cover phone-fold placement of the three facts, unlisted public claims, a 192 px rather than 180 px Apple touch icon, and the ambiguous **Stop** button label.

See `.factory/review-3.md` for exact evidence and concrete fixes. No deployment, infrastructure, DNS, billing, or product source was modified.

---

# Loop Lab review 4 handoff

## Status

**FAIL — adversarial first-read review 4 found ten unresolved blocking findings.**

- Work order: `loop-lab-review-4`
- Reviewed: 2026-08-29 UTC
- Base: `a94ad9a5a8d8379475761c99445b5730baf2779a`
- Live URL: `https://loop-lab.sociobot.in`
- Full report: `.factory/review-4.md`
- Product code changed: no

## What was done

- Audited the deployed landing cold at 390 × 844 and 1440 × 900, including its first screen and one-click demo.
- Confirmed the seeded demo state, persistent banner, Reset, demo/real IndexedDB namespace isolation, and same-origin request behavior.
- Made a separate clean clone at the requested commit, ran `npm ci`, then ran all nine exact commands in `.factory/claims.json`; all passed.
- Ran `npm test`, typecheck, lint, and production build in the working checkout; all passed and `dist/` was produced.
- Checked routes, metadata, links, 404, headers, mobile placement, visual identity, and previous-review repairs.
- Read all prior review, verification, and handoff reports; no `polish-*.md` report exists.

## Work left

The same ten issues from review 3 remain: broken Saved loops fragment/Back behavior; vague offline copy; DAW jargon; conflicting saved-item terms; vague headings; README implementation jargon/history; hidden mobile facts; unlisted claims; missing 180 px Apple touch icon; and ambiguous Stop label. Per the review instructions these are all blocking. See `.factory/review-4.md` for exact quotes, live evidence, and concrete repairs.

No product code, deployment configuration, infrastructure, DNS, billing, or external state was changed. The only committed files should be this handoff update and the review report.

---

# Loop Lab review 5 handoff

## Status

**FAIL — adversarial first-read review 5 found eleven blocking findings and one minor finding.**

- Work order: `loop-lab-review-5`
- Reviewed: 2026-08-29 UTC
- Base: `59228d1db77f42b40002dfc7843d003522991eef`
- Live URL: `https://loop-lab.sociobot.in`
- Full report: `.factory/review-5.md`
- Product code changed: no

## What was done

- Audited the deployed landing cold at 390 × 844 and 1440 × 900.
- Exercised the one-click demo, seeded state, Reset, Start for real, demo/real IndexedDB separation, exit/re-entry behavior, offline reload, and request log.
- Ran all nine exact `.factory/claims.json` commands from a separate clean clone; all passed.
- Ran the complete local tests, typecheck, lint, build, the full live browser suite, Playwright axe checks, and `verify-url.sh`; all passed and `dist/` was produced.
- Crawled live routes and assets; checked titles, metadata, 404, header/footer, security headers, history/focus, icon dimensions, mobile placement, and visual identity.
- Read every earlier review and the full handoff; no `polish-*.md` file exists.

## Work left

All ten findings from review 4 remain and are blocking again: Saved-loops/history routing, vague offline copy, DAW jargon, inconsistent saved-item terms, vague headings, README jargon/history, below-fold mobile facts, unlisted claims, the 192 px Apple touch icon, and the ambiguous Stop label.

Two new findings were confirmed. Demo edits survive **Start for real** and reappear on the next demo visit, contrary to the demo discard requirement; this is blocking. The skip link says **“Skip to the practice desk”** but targets the hero/main start; this is minor.

No product, deployment, infrastructure, DNS, billing, or external state was modified. Only this handoff entry and `.factory/review-5.md` were added for the review.
