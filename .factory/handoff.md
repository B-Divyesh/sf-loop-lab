# Loop Lab review 7 handoff

## Status

**FAIL — 2 findings, including 1 untested public claim.** The full independent report is in `.factory/review-7.md`.

No product code was modified. This work order adds the review report and updates this handoff only.

## Candidate and live deployment

- Implementation reviewed: `6ec9e9935505e6f194e72dfc2e0d27cc421df7d0`
- Documentation base reviewed: `45d4f0a196e04cc74fb5924fe741c831906f935f`
- Live URL: `https://loop-lab.sociobot.in`
- Fresh-build shell, JS, CSS, service worker, manifest, Apple icon, and hero hashes match live.

## Findings to repair

1. Add the brief-required plain disclosure that slow-playback sound quality can vary by browser.
2. Register and test the README promise **“Reset demo restores its sample.”** The test must change Demo, click Reset, and assert removal plus reseeding.

The live Reset flow itself works, and real data remained unchanged in a sentinel test. The failure is the missing disclosure and the untested public claim.

## Verification completed

- All 11 existing claim commands passed separately after `npm ci` in a clean clone.
- `npm test`, typecheck, lint, build, and `git diff --check` passed.
- The full local and live browser suites passed: 7 unit/static tests and 10 browser tests.
- Fresh phone and desktop first reads, one-click Demo, Reset, Demo exit, real-data sentinel, normal import/save/reopen, invalid and boundary inputs, keyboard, focus, reduced motion, offline reload/fallback, privacy requests, links, route titles, legal pages, and designed HTTP 404 were checked.
- `verify-url.sh` and Playwright axe passed. Lighthouse recorded 96 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; LCP 1.5 s and CLS 0.

## Re-run

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
PLAYWRIGHT_BASE_URL=https://loop-lab.sociobot.in npm run test:e2e
mkdir -p /tmp/loop-lab-review7-verify
/opt/fleet/lib/verify-url.sh https://loop-lab.sociobot.in /tmp/loop-lab-review7-verify
```

After repair, run every command in `.factory/claims.json` separately and repeat the public-copy inventory before changing the verdict.
