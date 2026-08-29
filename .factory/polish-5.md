# Polish 5 — zero-finding repair record

- Work order: `loop-lab-polish-5`
- Repair commit: `6ec9e9935505e6f194e72dfc2e0d27cc421df7d0`
- Deployed build: Azure Static Web App deployment `e20e01d0-f64d-4d82-ae04-1cd4dd17ac4e`
- Live URL: `https://loop-lab.sociobot.in`
- Checked: 2026-08-29 UTC

## Finding map

| Finding IDs | Change made | Evidence |
| --- | --- | --- |
| F-2-1, F-3-1, F-4-1, F-5-1 | Added explicit fragment focusing for `#saved`, saved per-history scroll/focus state, instant anchor movement, and a sticky instrument rail so navigation does not erase the current reading position. | Browser: `saved-loop fragment navigation, cold deep links, and Back restore scroll and focus`; cold live check `/#saved` → `scrollY: 1582`, focus `saved-heading`; screenshot `/tmp/loop-lab-polish-5-live-saved.png`; live suite PASS. |
| F-2-2, F-3-2, F-4-2, F-5-2 | Removed `OFFLINE-READY`; the first-screen fact now says exactly “Works offline after the first visit.” | Browser: `@claim:offline-reload works offline after the first demo visit`; screenshot `/tmp/loop-lab-polish-5-live-mobile.png`; live `/?demo=1` offline-reload PASS. |
| F-2-3, F-3-3, F-4-3, F-5-3 | Replaced DAW wording with “music-production software” in the landing page and README. | Copy audit `.factory/copy-audit.md`; live mobile screenshot `/tmp/loop-lab-polish-5-live-mobile.png`; live root title/console check PASS. |
| F-2-4, F-3-4, F-4-4, F-5-4 | Standardized visitor-facing saved items as “saved loops”: labels, buttons, empty state, banner documentation, privacy copy, and README now agree. | Browser: `@claim:cards-local` and `@claim:loops-export`; screenshots `/tmp/loop-lab-polish-5-live-saved.png` and `/tmp/loop-lab-polish-5-live-demo.png`; live suite PASS. |
| F-2-5, F-3-5, F-4-5, F-5-5 | Rewrote scan headings and helpers: loop start/end, how it works, slow playback without changing pitch, and privacy/limits now name their subjects. | Copy audit; browser: desktop/mobile accessibility test; live mobile screenshot `/tmp/loop-lab-polish-5-live-mobile.png`. |
| F-2-6, F-3-6, F-4-6, F-5-6 | Rewrote README in reader language; deployment detail is under a named operator section; removed checkout history and implementation jargon from user guidance. | README review; copy audit terminology table; `npm test`, typecheck, lint, build PASS. |
| F-3-7, F-4-7, F-5-7 | Put copy and all three facts before the art on phones, reduced mobile hero padding, and added a 390×844 bounds assertion. | Browser: `desktop and 390px mobile pass accessibility, metadata, mobile facts, and touch checks`; screenshot `/tmp/loop-lab-polish-5-live-mobile.png`; all three facts visible cold. |
| F-3-8, F-4-8, F-5-8 | Removed subjective/unprovable artwork, scope, and sound-quality copy. Added registered `loop-playback` and `demo-four-bars` claims; strengthened demo isolation claim; added a test that every registry claim has exactly one tagged test. | Every exact command in `.factory/claims.json` passed from clean clone `/tmp/loop-lab-polish-5.FUUm7M`; `tests/pwa.test.ts` claim-registry test PASS; live browser suite PASS. |
| F-3-9, F-4-9, F-5-9 | Generated original `public/apple-touch-icon.png` as a 180×180 derivative; linked it with `sizes="180x180"`; precached it. | Unit: `links an original 180 px Apple touch icon`; live decode: `PNG 180x180`; live URL `https://loop-lab.sociobot.in/apple-touch-icon.png` → 200. |
| F-3-10, F-4-10, F-5-10 | Renamed the visible and accessible transport action to “Stop loop”; retained its 44 px target at phone width. | Browser desktop/mobile accessibility and touch check PASS; screenshot `/tmp/loop-lab-polish-5-live-demo.png`; live suite PASS. |
| F-5-11 | Added an explicit `clearDemoData()` transaction that deletes only `demo:` card/workspace records. Reset and every exit from Demo use it; fresh demo then reseeds only its sample. | Browser: `@claim:demo-isolated @claim:no-account keeps sample data separate and discards it on exit`; screenshot `/tmp/loop-lab-polish-5-live-demo.png`; live suite PASS. |
| F-5-12 | Renamed the skip link to “Skip to main content,” made each main landmark focusable, and added a keyboard destination assertion. | Browser: `visible errors, update status, deletion confirmation, and skip-link destination work`; live suite PASS. |

## Cumulative verification

- Clean clone: `npm ci`, then all 11 exact claim commands from `.factory/claims.json` passed individually. The final clean-clone Playwright record is `/tmp/loop-lab-polish-5.FUUm7M/test-results/.last-run.json` (`status: passed`).
- Local: `npm test` (7 unit + 10 browser), `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check` passed. Build output is `dist/`; initial JS is 23.99 kB raw / 8.58 KiB gzip and CSS is 11.17 kB raw / 3.20 KiB gzip.
- Live: `PLAYWRIGHT_BASE_URL=https://loop-lab.sociobot.in npm run test:e2e` passed all 10 browser tests. `/opt/fleet/lib/verify-url.sh https://loop-lab.sociobot.in /tmp/loop-lab-verify-live` passed with no console/page errors, one h1, `lang=en`, a main landmark, and alt text.
- Live route check: `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, `/apple-touch-icon.png`, `/manifest.webmanifest`, `/robots.txt`, and `/sitemap.xml` return 200; `/not-a-real-loop` returns the designed HTTP 404.
- Privacy/offline: the live claim tests capture same-origin-only requests and reload the controlled demo offline. No account or third-party runtime request is present.
- Accessibility: Playwright axe reports no serious or critical issues at 1440×900 and 390×844. The standalone axe CLI could not create a Selenium session with this worker’s ChromeDriver; the pinned Playwright axe integration is the equivalent passing audit.
- Local Lighthouse report `/tmp/loop-lab-lighthouse.json`: Performance 92, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.3 s, CLS 0. The runner wrote the report before reporting a post-audit tab crash.
