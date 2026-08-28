# Loop Lab repair handoff

## Status

**PASS — release blockers from verifier commit `0cd3dce95e019972d8e44b448a94fb087dedcb70` are repaired and deployed.**

- Repaired candidate: `3329c44b9f57d01876a1bdbc2526d1ffcc7f3319`
- Work order: `loop-lab-repair-1`
- Live URL: `https://loop-lab.sociobot.in`
- Azure Static Web App: `sf-loop-lab` in resource group `sociobot`
- Verified: 2026-08-28 UTC

## What changed

- Replaced every invalid Vitest `--grep` claim command. All eight registry commands now use valid Playwright `--grep` or Vitest `-t` filters and pass verbatim.
- Added browser-observable claim coverage for offline reload, demo isolation, no-account use, local persistence, no upload/tracking, and card export/import.
- Persisted the imported audio blob, active cue points, speed, BPM, and saved cards in IndexedDB. Real saved cards now render on `/`, survive reload, reopen their audio, and replay.
- Added portable JSON export/import. Exports include each saved card's audio.
- Removed the unregistered paid offer, six-card limit, license restore UI, and optimistic license cache. The product is uncapped and free until billing is registered.
- Normalized BPM to `30–300` before persistence. A typed value of `999` saves and renders as `300 BPM`.
- Replaced the clipped announcer with a visible, polite status panel for invalid audio, imports, saves, deletions, and service-worker updates.
- Added confirmation before card deletion.
- Preserved initial document focus so the first Tab reaches the skip link. SPA route changes still focus the new `<h1>`.
- Added designed focus-within treatment for file controls and brought visible links, fields, sliders, and controls to at least `44 × 44` CSS pixels.
- Added route-specific canonical, Open Graph, Twitter, title, and description updates.
- Added a strict CSP, hashed immutable JS/CSS, a build-versioned service-worker cache, correct JSON manifest delivery, and a real Static Web Apps `404` response.
- Removed inline waveform styles after the deployed CSP exposed them; the final live console is clean.

## Exact verification evidence

Clean release gate:

```text
npm ci                  PASS — 200 packages, 0 vulnerabilities
npm test                PASS — 4 unit tests + 7 Chromium product tests
npm run typecheck       PASS
npm run lint            PASS
npm run build           PASS — dist/ created
git diff --check        PASS
```

Every command in `.factory/claims.json` passed verbatim. The seven browser claims ran in fresh contexts; `pitch-speed` ran its single filtered unit test.

Browser coverage ran against both the local production preview and the deployed public origin. It exercised generated valid and corrupt WAV files, save/reload/reopen/play, `999 → 300 BPM`, export/delete-database/import/reopen, demo-to-real isolation, request capture, update status, deletion cancellation, keyboard entry, reduced target measurements, and desktop plus `390 × 844` layouts. Final live result: **7/7 passed**.

Accessibility and browser smoke:

```text
/opt/fleet/lib/verify-url.sh https://loop-lab.sociobot.in ...
PASS — HTTP 200, title, lang, one h1, main, alt text, labels, 0 console errors

npx @axe-core/cli home demo privacy ... --exit
PASS — 0 violations on all 3 routes
```

The Playwright axe check found zero serious/critical violations on desktop and 390 px mobile. Keyboard focus begins on the skip link, route changes focus the `<h1>`, no keyboard trap was found, and every measured visible interactive target was at least 44 px in both dimensions. Both viewports had no horizontal overflow. Reduced-motion styles remain in place.

Final live Lighthouse mobile:

| Category/metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.8 s |
| LCP | 1.9 s |
| TBT | 10 ms |
| CLS | 0 |
| Transfer | 187 KiB |

Production bundle:

- JavaScript: 20,280 bytes raw / 7.47 KiB gzip
- CSS: 10,880 bytes raw / 3.10 KiB gzip
- Hero WebP: 123,250 bytes
- Fonts: 0 bytes

Live response policy and identity:

- `/`, `/demo`, `/privacy`, `/terms`: HTTP 200.
- `/not-a-real-loop`: HTTP 404 with the styled Loop Lab not-found document.
- `/manifest.webmanifest`: HTTP 200, `application/json` (no longer `application/octet-stream`).
- CSP, `Referrer-Policy`, and `X-Content-Type-Options` are present.
- Hashed JS and CSS return `Cache-Control: public, max-age=31536000, immutable`.
- Final live and local SHA-256 match:
  - `index.html`: `75f9efeaffdf0a2559b16513b9bb730a349b8bcf001f48ea240727557a3128a6`
  - JavaScript: `0b702754e182d59e3431d9e9f6c1deaa5bddaaa60ce0a7428e880b00ef954af7`

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Run browser tests against the deployed site with:

```sh
PLAYWRIGHT_BASE_URL=https://loop-lab.sociobot.in npm run test:e2e
```

## Known limits and next step

- Browser storage quotas still depend on the device and browser. Users should export card backups before clearing site data.
- The researched brief lists freemium monetization, but the verifier proved that the checkout product is not registered. The broken paid surface was removed as required. Register `loop-lab` in the Sociobot billing engine and add server-verified entitlement tests before restoring any paid offer.
