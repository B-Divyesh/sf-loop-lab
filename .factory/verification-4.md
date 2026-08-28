# Independent verification 4 — PASS

- Candidate commit: `cdac0887956519be14a648f8724a69e7979b6896`
- Live URL: `https://loop-lab.sociobot.in`
- Verified: 2026-08-28 UTC
- Work order: `loop-lab-verify-4`
- Result: **PASS — the candidate meets the researched brief and release gates.**

This is a fresh verification after the earlier failure report (`.factory/verification-3.md`). No product source was changed during this verification.

## First-read gate — PASS

A cold live desktop load says: **“Make a loop you can practise.”** It explicitly names the audience: **“For new electronic-music makers who want to study one short sound without opening a DAW.”** The first primary action is **“Try it with sample data”**, with adjacent plain copy saying it opens a four-bar beat. The same one-click route opens `/demo`, a usable practice desk with a generated sample, an isolated saved card, and the persistent **“Demo — sample data, nothing is saved to your real loops.”** banner. The 390 px presentation retains the same answer and primary action.

## Mandatory claims gate — PASS

`.factory/claims.json` is present and contains nine claims. From this clean checkout, after `npm ci`, every recorded command passed verbatim against the product’s demo/browser entry point.

| Claim | Exact command | Result |
| --- | --- | --- |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `demo-isolated` | `npm run test:e2e -- --grep @claim:demo-isolated` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| `cards-local` | `npm run test:e2e -- --grep @claim:cards-local` | PASS |
| `audio-private` | `npm run test:e2e -- --grep @claim:audio-private` | PASS |
| `no-tracking` | `npm run test:e2e -- --grep @claim:no-tracking` | PASS |
| `cards-export` | `npm run test:e2e -- --grep @claim:cards-export` | PASS |
| `pitch-speed` | `npm run test:unit -- -t @claim:pitch-speed` | PASS |
| `input-boundaries` | `npm run test:e2e -- --grep @claim:input-boundaries` | PASS |

The browser claims cover an offline demo reload, demo/real IndexedDB isolation, local persistence, no third-party requests, portable card export/import, and atomic boundary recovery. The unit claim verifies the granular player keeps each grain at its natural playback rate while its source position advances at the requested speed.

## Clean-build and live evidence — PASS

- `npm ci`: PASS; 200 packages audited, no vulnerabilities reported.
- `npm test`: PASS; 4 Vitest tests and 8 Chromium product tests. The resulting Playwright status was `passed` with no failed tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; produced `dist/`.
- `PLAYWRIGHT_BASE_URL=https://loop-lab.sociobot.in npm run test:e2e`: PASS; all 8 tests passed on the deployed origin.

The local production build and live deployment are byte-identical for the application shell and mutable PWA assets:

| File | SHA-256 |
| --- | --- |
| `index.html` | `3af73f8db905c6ffb8d86c5c5c11058de633b01d9528fc4f29b649bf06b248fa` |
| `assets/index-BMqtsPPr.js` | `34617e1aafdcd41f010053ae18f46d7c1a32b03b33003b806b8629bc1185f3e1` |
| `assets/index-C2yZV5Nf.css` | `c632827ee33433ba6f1346523622b6d816debfdf03df7609742aeaf0585a80e4` |
| `sw.js` | `c51b4d9246f5e978104471180b1d9e6eb8e7c5df0910486b0213628cb6201f61` |
| `manifest.webmanifest` | `198fdfd9d807a34724a0e664f5658db20385dcb8fde4a635af3d76d245877bf0` |
| `loop-lab-hero.webp` | `8efb785d4f9b1c15825b7a8f191a86223231802103126d6e28883b3014fb8ebe` |

## Product and boundary exercise — PASS

- Normal job: a generated 1-second WAV imported, looped, saved, survived refresh, reopened with playback enabled, exported with audio, and imported into a cleared local database. This ran both locally and against live in the product suite.
- Controls: A/B range arrows changed the start from `1` to `1.05`; lower BPM `30` persisted; `301` clamped to `300`; two approximately 500 ms tempo taps produced `114` BPM. Keyboard Enter started playback and Space paused it.
- Recovery: a corrupt WAV shows the actionable read-error message and a subsequent valid import works. A decodable 20 ms WAV is rejected before it reaches the desk. A mixed valid/incomplete card export is rejected atomically; neither card is persisted and no page error occurs.
- The explicit browser disclosure that time-stretch quality varies by browser/source is present. The sample is synthesized in-browser; no copyrighted sample audio is bundled.

## Privacy, PWA, accessibility, and browser policy — PASS

- Request capture across landing, import, save, and demo activity saw only `https://loop-lab.sociobot.in`; the generated bundle contains no third-party runtime endpoint. The app has no account/sign-in flow and no server-side product API, so Entra and API rate-limit checks are not applicable.
- The live demo became service-worker controlled and reloaded offline after the first visit. A separate in-memory local static-server probe changed only the served worker response, called `registration.update()`, and observed: **“An update is ready. Reload when you finish this loop.”**
- `/opt/fleet/lib/verify-url.sh https://loop-lab.sociobot.in /tmp/loop-verify-url` passed: HTTP 200, title, `lang=en`, one h1, main landmark, zero images missing alt, zero unlabeled buttons, and zero console/page errors.
- The repository’s Playwright axe integration found zero serious or critical findings at 1440×900 and 390×844, locally and on live. At 390 px, no horizontal overflow or undersized visible controls were found. Keyboard focus begins at the skip link and proceeds through all demo controls; focus has a visible solid outline. With `prefers-reduced-motion`, waveform and range transition durations are `0s`.
- `/`, `/demo`, `/privacy`, `/terms`, `/manifest.webmanifest`, and `/sw.js` return 200; a non-existent route returns styled HTTP 404. All discovered same-origin links returned 200. Live headers include CSP limited to self/blob/data where needed, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`. Hashed JS has `public, max-age=31536000, immutable`; the worker is `no-cache`.

## Performance — PASS

The exact build reports initial JS `22,122` bytes raw / `8.11 KiB` gzip, CSS `10,883` bytes raw / `3.10 KiB` gzip, and the hero WebP `123,250` bytes. All are within the static/PWA budgets. Fresh mobile Lighthouse evidence on live: Performance **91**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.9 s**, LCP **1.9 s**, CLS **0**, transfer **188 KiB**. Lighthouse wrote the complete JSON report and then emitted a headless-browser target-crash message while exiting; independent Playwright console/error checks remained clean.

## Defects

None found. There are no release-blocking, high, medium, or low defects from this verification.

