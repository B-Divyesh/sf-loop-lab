# Independent verification 5 — Loop Lab

## Verdict

**PASS** — candidate `4bca452d4ed377cfb0d052dc8831789b5136527f` is release-ready at [https://loop-lab.sociobot.in](https://loop-lab.sociobot.in). Verification was performed from a clean dependency install on 2026-08-29. No product source files were changed.

## First-read test (cold live page)

The first screen says: **“Create a repeatable audio practice loop.”** It says this is for **beginning electronic-music makers** studying a short passage without music-production software. Its primary action is **“Try it with sample data”**; one click loads the four-bar sample. The three facts visible on the first 390×844 screen are offline-after-first-visit, audio is not uploaded, and free/no account. This satisfies the plain-words and one-click-demo acceptance checks.

## Mandatory claim registry

`.factory/claims.json` exists and contains 11 entries. After `npm ci`, every exact registry command was run against the product's demo-capable test entry point and passed:

| Claim id | Result |
| --- | --- |
| `loop-playback` | PASS |
| `offline-reload` | PASS |
| `demo-isolated` | PASS |
| `demo-four-bars` | PASS |
| `no-account` | PASS |
| `cards-local` | PASS |
| `audio-private` | PASS |
| `no-tracking` | PASS |
| `loops-export` | PASS |
| `pitch-speed` | PASS |
| `input-boundaries` | PASS |

The registry completeness test also passed: every claim has exactly one tagged test. The passing tests cover a scheduler loop wrap, pitch-preserving grains, service-worker offline reload, demo namespace discard/reset, four-bar sample, local persistence after refresh, same-origin request logs, export/import including audio, and atomic rejection of malformed input.

## Clean-local verification

| Check | Evidence | Result |
| --- | --- | --- |
| Install | `npm ci`; 200 packages audited, 0 vulnerabilities | PASS |
| Unit/static suite | `npm run test:unit`: 7 tests in 3 files | PASS |
| Browser suite | All 10 Playwright tests observed, including claim tests and non-claim keyboard/error, deep-link/Back, desktop/mobile/a11y checks | PASS |
| Type check | `npm run typecheck` | PASS |
| Lint | `npm run lint` | PASS |
| Production artifact | `npm run build` generated `dist/` | PASS |
| Source integrity | `git diff --check` | PASS |

The fresh build has 23.99 KB JS (8.58 KB gzip) and 11.17 KB CSS (3.20 KB gzip), below the 200 KB JS and 50 KB CSS budgets. The hero WebP is 123,250 bytes.

## End-to-end product checks

- **Normal real-data path, live:** imported a generated 1-second WAV, set BPM to `999` and observed the stored card clamp to `300 BPM`, saved it, reloaded, and reopened it successfully.
- **Boundary/recovery, live:** a generated 20 ms WAV was rejected before playback or saving with: “This clip is too short to loop. Choose audio at least 0.05 seconds long.” Local claim coverage also rejects unreadable audio and an export containing an incomplete second loop without partially importing the valid first loop.
- **Demo isolation:** `/?demo=1` showed the persistent “Demo — sample data, nothing is saved to your real data” banner, Reset demo, Start for real, and an 8-second 120-BPM four-bar sample. Claim coverage proves demo changes are discarded on exit and never appear in real storage.
- **PWA:** the live worker is active (`loop-lab-ad854716ef7e`), cache-versioned, `registration.update()` completed, and `sw.js` is `no-cache` with `skipWaiting`/`clientsClaim`. After the first live demo visit, setting the browser offline and reloading retained “Try a four-bar practice beat.”
- **Desktop/mobile/keyboard:** checked desktop and 390×844. At mobile size all three first-screen facts fit in the viewport. Keyboard Tab reached the skip link, navigation, demo controls, file input, range controls, playback, select, BPM and card fields; each inspected focus ring was a visible `3px` mint outline. ArrowRight advanced the loop-start range from `1` to `1.05`. The reduced-motion test reports `0s` waveform transition duration.
- **Accessibility:** Playwright axe found no serious or critical violations on live desktop or 390 px mobile. The live page has a title, `lang=en`, one h1, main landmark, labels, alt text, a working skip link, and no mobile overflow.
- **Errors:** no console or page errors through the normal landing → demo → offline reload, normal local WAV import/save/reload, invalid-short-WAV recovery, and playback toggle flows.

## Privacy, deployment, and HTTP evidence

- In a fresh live browser context, every request throughout landing, sample demo, real local-WAV import, save, and reload had the single origin `https://loop-lab.sociobot.in`. There were no analytics, advertising, upload, sign-in, or third-party requests.
- This static PWA exposes no product server-side API or billing/unlock endpoint. Rate-limit/429 testing and Microsoft Entra tenant testing are therefore not applicable.
- `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, manifest, service worker, robots, sitemap, and Apple touch icon return 200. A nonexistent route returns a styled HTTP 404.
- Response headers include CSP with `frame-ancestors 'none'`, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`. `sw.js` is `Cache-Control: no-cache`; hashed assets are immutable by static-host policy.
- Fresh local `dist/` SHA-256 hashes exactly matched live `index.html`, main JS, CSS, `sw.js`, manifest, Apple touch icon, and hero image. This establishes that the deployment is candidate `4bca452d4ed377cfb0d052dc8831789b5136527f`, rather than only matching its visible copy.

## Performance

Live Lighthouse (Chrome for Testing 145) produced:

| Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 100 | 100 | 100 | 0.8 s | 1.5 s | 0 | 80 ms |

The JSON report is retained at `/tmp/loop-lab-verification-lighthouse.json` in this verification environment.

## Defects by severity

No release-blocking, high, medium, or low-severity product defects found.
