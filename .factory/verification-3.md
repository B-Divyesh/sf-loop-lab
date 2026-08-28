# Independent verification 3 — FAIL

- Candidate: `3c475a6bfa3b2b1bc8e8c3061e71c7f3bca65045`
- Live URL: `https://loop-lab.sociobot.in`
- Verified: 2026-08-28 UTC
- Work order: `loop-lab-verify-3`
- Result: **FAIL — do not release until the input-validation defects below are repaired.**

The previous report exists as `.factory/verification.md`; this is a new, independent pass against the repaired candidate. The deployment is not stale: SHA-256 matched the local production build for `index.html`, JS, CSS, `sw.js`, `manifest.webmanifest`, and `loop-lab-hero.webp`.

## First-read gate — PASS

A cold live desktop load states what it does: “Make a loop you can practise.” It names the audience: “For new electronic-music makers who want to study one short sound without opening a DAW.” The visible primary action is “Try it with sample data,” and adjacent copy says it opens a four-bar beat. The same action and explanation are visible at 390 px. The one-click demo opens an isolated practice desk with sample audio and a persistent banner.

## Release-blocking defects

### High — accepted short audio crashes playback

A valid, browser-decodable 20 ms WAV was accepted as a local clip. The rendered loop-end range then had `min="0.05"`, `max="0.02"`, and a snapped value of `0.05`, even though the clip is 0.02 seconds long. Pressing **Play loop** produced this uncaught console error and no useful recovery message:

```text
Failed to execute 'start' on 'AudioBufferSourceNode':
The duration provided (-0.002) is less than the minimum bound (0).
```

The product accepts `audio/*` with no documented minimum duration. It must either reject clips shorter than the minimum loop/grain safely, or derive valid ranges and scheduling values. This violates the required boundary and error-recovery behavior for the core import/play job.

### Medium — malformed card exports are imported as broken cards

Importing this syntactically valid but structurally incomplete JSON succeeded instead of showing the existing invalid-import recovery:

```json
{"format":"loop-lab-cards","version":1,"cards":[{"id":"broken","name":"Incomplete","note":"Missing loop fields"}]}
```

The UI announced “Imported 1 practice card” and rendered `NaN:0NaN—NaN:0NaN · NaN BPM · NaN%`. Opening it later produced “This older card has no saved audio,” leaving a malformed record in the user’s library. Validate all required card and clip fields before writing any record, and reject the whole invalid file with the visible recovery message.

## Mandatory claims gate — PASS

`.factory/claims.json` exists. After `npm ci`, every recorded command passed verbatim against the shipped demo entry point:

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

## What passed

- Clean install: `npm ci` completed with 200 audited packages and no vulnerabilities.
- Product suite: `npm test` passed (4 Vitest tests and 7 Chromium product tests); `npm run typecheck`, `npm run lint`, and the exact `npm run build` all passed. The build produced `dist/`.
- Normal real flow on live: imported a generated one-second WAV, clamped `999 BPM` to and saved `300 BPM`, saved a card, reloaded, reopened it, and confirmed playback was enabled. `30` BPM also committed correctly.
- Data ownership: exported a real card with audio, removed the IndexedDB database, imported the export, reopened the card, and confirmed playback was enabled.
- Invalid media: a corrupt WAV displayed the visible recovery copy. A wholly wrong JSON export displayed the visible invalid-import copy.
- Demo: sample card is isolated from real data; saving a second card and Reset demo returns the expected seeded card; Start for real does not expose demo data.
- Privacy: request capture through landing, import, save, export/import, and demo saw only `https://loop-lab.sociobot.in`. No account, sign-in, third-party runtime request, or server-side product endpoint is present; rate-limit and Entra checks are not applicable.
- PWA: live `/demo` was service-worker controlled and reloaded offline after first load. A local production-artifact service-worker update (changed worker response only) activated and displayed “An update is ready. Reload when you finish this loop.”
- Accessibility: `/opt/fleet/lib/verify-url.sh` passed (HTTP 200, title, language, one h1, main, alt text, no console errors on cold load). Playwright axe found zero serious/critical violations at 1440×900 and 390×844; all visible interactive controls measured at least 44×44 px, no horizontal overflow was present, first Tab reached the skip link, and reduced-motion emulation produced a `0s` transition duration.
- Security/deployment: `/`, `/demo`, `/privacy`, and `/terms` return 200; a non-existent route returns styled HTTP 404. CSP, HSTS, `Referrer-Policy`, and `X-Content-Type-Options` are present. Hashed JS/CSS have one-year immutable caching; `sw.js` is no-cache.
- Bundle budgets: JS 20,284 bytes raw / 7.47 KiB gzip; CSS 10,883 bytes raw / 3.10 KiB gzip; hero WebP 123,250 bytes; no downloaded fonts. Live Lighthouse produced performance 99, accessibility 100, best-practices 100, SEO 100; FCP 0.9 s, LCP 1.5 s, TBT 142 ms, CLS 0, transfer 133 KiB. (The headless browser emitted a target-crash message after writing its JSON report.)

## Required repair and re-verification

1. Reject or correctly support clips below the valid loop/grain duration, with a visible recovery message and no console/page error; add a browser claim/regression test.
2. Schema-validate imported cards before persistence (numeric finite start/end/BPM/speed, valid ordering/duration, and complete clip data where applicable); reject invalid files atomically and add a regression test.
3. Re-run every claims command, full quality suite, browser boundary checks, and live deployment hash comparison after redeploy.
