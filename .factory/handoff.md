# Loop Lab verification handoff

## Status

**FAIL — do not release candidate `3329c44b9f57d01876a1bdbc2526d1ffcc7f3319`.**

Independent QA tested the clean candidate and `https://loop-lab.sociobot.in` on 2026-08-28 UTC. Live core-asset hashes match the candidate build, so this is not a stale-deployment result. Full evidence is in `.factory/verification.md`.

## Release blockers

- Every exact command in `.factory/claims.json` fails after `npm ci`: Vitest rejects the recorded `--grep` option.
- Real cards are written to IndexedDB but never rendered outside demo. Audio and the active loop disappear on refresh, so saved loops cannot be reopened or replayed.
- The visible checkout endpoint returns HTTP 404.
- Any pasted license is cached locally as valid for 24 hours without server verification.
- Privacy and paid statements on the site/README are not registered and tested claims.

## Other material defects

- `999 BPM` is displayed as 300 while editing but saved as 999.
- Invalid-audio, card-limit, license, and update messages are only present in a visually clipped live region.
- File inputs have invisible keyboard focus; several mobile controls are below 44 px.
- No card export/import exists, card deletion has no undo, live CSP/immutable caching are absent, and unknown routes return HTTP 200.

## Passing evidence

- First-read and one-click demo gates pass on desktop and 390 px mobile.
- `npm ci`, full `npm test` (4/4), `npx tsc -b --pretty false`, and `npm run build` pass. No lint command exists.
- Live demo play/save/reset works; demo storage is namespaced; request capture was same-origin only.
- Live and local production demo reload offline after service-worker control. A controlled service-worker update triggered the update announcement.
- Axe found no serious/critical issues; the factory URL verifier passed with no console errors.
- Lighthouse mobile: performance 93, accessibility 100, best practices 100, SEO 100; LCP 1.6 s; CLS 0; 132 KiB transfer.
- Sociobot verify endpoint rate limiting passed: in a 60-request burst, 30 returned 200 and 30 returned 429 with `Retry-After: 4`.

## Reproduce

```sh
npm ci
npm test
npx tsc -b --pretty false
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

The mandatory claim commands and precise browser/network evidence are listed in `.factory/verification.md`. Repair in the order listed there, redeploy, and run a fresh independent verification.
