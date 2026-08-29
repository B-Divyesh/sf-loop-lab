# Loop Lab polish 5 handoff

## Status

**PASS — repair deployed and rechecked live.**

- Work order: `loop-lab-polish-5`
- Released candidate repaired: `cdac0887956519be14a648f8724a69e7979b6896`
- Base reviewed: `3faa65242a860cdcf56f873dff39b97b3f58d39a`
- Repair commit: `6ec9e9935505e6f194e72dfc2e0d27cc421df7d0`
- Deployment: Azure Static Web App `sf-loop-lab`, deployment `e20e01d0-f64d-4d82-ae04-1cd4dd17ac4e`
- Live URL: `https://loop-lab.sociobot.in`
- Detailed finding-by-finding evidence: `.factory/polish-5.md`

## What changed

- Repaired saved-loop fragment links, cold deep links, Back-button scroll/focus restoration, route titles, live route announcements, a focusable main skip target, and the designed HTTP 404 flow.
- Made `/?demo=1` the direct sample entry. Its banner, Reset demo, and Start for real controls now operate on a separate `demo:` namespace. Leaving Demo discards every demo record before returning to real data.
- Rewrote the first screen, headers, labels, README, privacy/terms, and mobile layout in plain words. “Saved loop” is the one visitor-facing name. The three decision facts appear above the 390×844 fold.
- Removed unprovable public copy and registered every retained product promise in `.factory/claims.json`. Added observable loop-wrap and four-bar demo claims plus a registry-to-test completeness check.
- Added and linked a 180×180 Apple touch icon, corrected the sample to an eight-second four-bar beat at 120 BPM, renamed Stop to Stop loop, and precached the new assets.

## Exact verification evidence

```text
Clean clone: /tmp/loop-lab-polish-5.FUUm7M
npm ci                                                   PASS
all 11 exact claims.json commands, run individually     PASS
npm test                                                 PASS — 7 Vitest tests, 10 Chromium browser tests
npm run typecheck                                        PASS
npm run lint                                             PASS
npm run build                                            PASS — dist/ produced
git diff --check                                         PASS
PLAYWRIGHT_BASE_URL=https://loop-lab.sociobot.in \
  npm run test:e2e                                       PASS — 10 Chromium browser tests
verify-url.sh live                                      PASS — title/lang/h1/main/alt/labels/console
```

The live release was opened cold at `/`, `/?demo=1`, and `/#saved`. The direct saved URL focused `#saved-heading` at `scrollY=1582`; the live mobile first screen shows all three facts; and the live 180 px Apple icon decoded correctly. Screenshots are retained at:

- `/tmp/loop-lab-polish-5-live-mobile.png`
- `/tmp/loop-lab-polish-5-live-demo.png`
- `/tmp/loop-lab-polish-5-live-saved.png`

Live route results: `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, `/apple-touch-icon.png`, `/manifest.webmanifest`, `/robots.txt`, and `/sitemap.xml` return 200. `/not-a-real-loop` returns the styled HTTP 404. Live security headers include CSP with response-header `frame-ancestors 'none'`, HSTS, `Referrer-Policy`, and `X-Content-Type-Options`.

Local Lighthouse report `/tmp/loop-lab-lighthouse.json` measured Performance 92, Accessibility 100, Best Practices 100, SEO 100, FCP 0.9 s, LCP 1.3 s, and CLS 0. The report was written before Lighthouse reported a post-audit tab crash. Playwright axe found no serious or critical issue at desktop or mobile. The standalone axe CLI could not create a Selenium session with the worker’s ChromeDriver; no product browser issue was found by the pinned Playwright axe integration.

## Run and deploy

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
/opt/fleet/lib/deploy-static.sh loop-lab dist
```

## Known gaps

None. Browser storage quotas remain device-dependent; use Export loops before clearing site data.
