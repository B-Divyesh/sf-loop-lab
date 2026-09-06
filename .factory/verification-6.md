# Create and save short audio practice loops — verification 6

- Verified: 2026-09-06 UTC
- Live URL: `https://loop-lab.sociobot.in`
- Implementation candidate: `01d8af68565c013e516d3d2376f89cb815c0a5e1`
- Documentation checkout: `d03a6f2822dc5e79773f12aee0182c3a5ca3141f`
- Verdict: **PASS — 0 findings and 0 untested public claims.**

The live `index.html`, JavaScript, CSS, service worker, manifest, Apple icon, and hero image match the fresh implementation build by SHA-256. The later documentation commit changes only `.factory/handoff.md`, so a new product image is not required.

## First screen before scrolling

Fresh 1440 × 900 desktop and 390 × 844 phone contexts gave the same clear first read:

- Job: create a repeatable audio practice loop.
- Audience: beginning electronic-music makers studying a short passage without learning music-production software.
- First action: **Try it with sample data**.
- Immediate result: **Loads a four-bar beat.**

All three facts—offline after the first visit, no audio upload, and free with no account—were visible before scrolling. The final phone fact ended at y=`573.4` in an 844 px viewport. Neither context produced a console or page error. Screenshots are `/work/.evidence/verification-6-phone-first-screen.png` and `/work/.evidence/verification-6-desktop-first-screen.png`.

## One-click sample and real-data safety

One click opened `/?demo=1`. The persistent banner says **“Demo — sample data, nothing is saved to your real data.”** The first populated view contained the eight-second **Night bus · four-bar beat**, ready A/B and playback controls, and the realistic **Kick + bass pocket** saved loop at 120 BPM.

The Reset flow was exercised locally and live. A real WAV-backed saved loop was created first. Demo then received another saved loop and a changed start point. **Reset demo** removed the added Demo loop, restored start `1`, restored the single seeded loop, and announced **“Demo reset. The four-bar sample is ready.”** The real saved loop was absent in Demo and present again after **Start for real**. Demo screenshots are `/work/.evidence/verification-6-phone-demo.png` and `/work/.evidence/verification-6-desktop-demo.png`.

## Declared claims

The documentation checkout was cloned into a new directory and `npm ci` completed with 200 packages audited and no vulnerabilities. Every command in `.factory/claims.json` was then run separately and exited 0.

| Claim | Exact command | Result |
| --- | --- | --- |
| `loop-playback` | `npm run test:unit -- -t @claim:loop-playback` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `demo-isolated` | `npm run test:e2e -- --grep @claim:demo-isolated` | PASS |
| `demo-four-bars` | `npm run test:e2e -- --grep @claim:demo-four-bars` | PASS |
| `demo-reset` | `npm run test:e2e -- --grep @claim:demo-reset` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| `cards-local` | `npm run test:e2e -- --grep @claim:cards-local` | PASS |
| `audio-private` | `npm run test:e2e -- --grep @claim:audio-private` | PASS |
| `no-tracking` | `npm run test:e2e -- --grep @claim:no-tracking` | PASS |
| `loops-export` | `npm run test:e2e -- --grep @claim:loops-export` | PASS |
| `pitch-speed` | `npm run test:unit -- -t @claim:pitch-speed` | PASS |
| `input-boundaries` | `npm run test:e2e -- --grep @claim:input-boundaries` | PASS |

The result summary is `/work/.evidence/verification-6-claims.json`. The registry-completeness unit test also passes and finds exactly one tagged test for every claim. Landing, Demo, legal-page, and README copy was cross-checked against the registry. No unlisted promise remains. **“Slow-playback sound quality can vary by browser”** is a limitation, not a quality promise.

## Normal, invalid, boundary, and recovery paths

- A generated WAV imports, plays, saves with audio, survives refresh, reopens, exports, and imports into a cleared database.
- `999` BPM is clamped to `300` before persistence.
- A valid 20 ms WAV is rejected before playback with the documented 0.05-second minimum and no page error.
- Corrupt audio shows a visible recovery message, and a later valid file works.
- A mixed valid/incomplete saved-loop export is rejected atomically; neither item is written.
- Delete cancellation preserves the loop. The update event produces a visible status.
- Saved-loop header navigation, a cold `/#saved` deep link, and Back restore the expected scroll and focus.

## Accessibility, keyboard, mobile, and motion

- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, useful title, `lang=en`, one h1, a main landmark, image alternatives, labels, and no cold-load browser error. Output is in `/work/.evidence/verification-6-verify-url`.
- Full Axe scans of `/`, Demo, Privacy, and Terms at 1440 × 900 and 390 × 844 found **zero violations of any severity**.
- The skip link is first in the Tab order and moves focus to `main`. Saved-loop and route changes restore focus. Visible controls meet the 44 px check.
- Range controls respond to arrow keys; playback responds to keyboard activation. No keyboard trap was found.
- The phone layout has no horizontal page overflow. A 200% text-size check kept controls inside the viewport.
- Reduced motion sets waveform transitions to `0s`. There is no autoplay, flashing, or uncontrolled looping animation.

## Privacy, offline behavior, routes, and deployment

- Request capture through landing, Demo, real import/save, and legal pages stayed on `https://loop-lab.sociobot.in`. There is no analytics, advertising, upload, account, paid endpoint, or third-party runtime request.
- The service-worker-controlled Demo reloads offline. A fresh uncached offline navigation returns the designed **Offline — Loop Lab** page. `registration.update()` completed against the active worker; the visible update status path passes.
- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles, one h1, a main landmark, canonical metadata, and the shared header/footer. All links discovered on valid pages resolve.
- `/not-a-real-loop` deliberately returns HTTP 404 with the designed title, h1, main landmark, and return action. This expected 404 is not a defect.
- Live headers include CSP with `frame-ancestors 'none'`, HSTS, strict-origin referrer policy, and `nosniff`. Hashed assets are immutable; `sw.js` is `no-cache`.
- The manifest has a versioned start URL, standalone display, matching theme colors, and 192/512 maskable icons. The social image is 1200 × 630 and the Apple icon is 180 × 180.

This is a static, local-first PWA with IndexedDB state. Backend tenant isolation, server restart persistence, health endpoints, and 429/`Retry-After` checks do not apply.

## Quality gates and performance

| Check | Result |
| --- | --- |
| `npm test` | PASS — 7 unit/static and 11 Chromium tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/index.html` produced |
| Live browser suite | PASS — all 11 tests |
| Clean tree after tests | PASS |

The production JavaScript is 24,044 bytes raw / 8.61 KiB gzip. CSS is 11,174 bytes raw / 3.20 KiB gzip. The hero WebP is 123,250 bytes.

Fresh live mobile Lighthouse scored Performance **100**, Accessibility **100**, Best Practices **100**, and SEO **100**. FCP was 0.78 s, LCP 1.51 s, TBT 21 ms, CLS 0, and total transfer 138 KB. The complete report is `/work/.evidence/verification-6-lighthouse.json`.

## Earlier finding disposition

| Earlier finding | Current proof |
| --- | --- |
| Verification 1: claim commands failed and offline coverage was not a browser test | Fixed. All 12 exact commands pass; offline reload uses a fresh browser context and real offline mode. |
| Verification 1: real saved loops could not reopen; export/import was absent | Fixed. Local and live tests save audio, refresh, reopen, play, export, clear storage, import, and reopen. |
| Verification 1: dead paid checkout and forgeable license | Fixed by removal. No paid offer, checkout, license storage, verification request, or entitlement code is shipped. |
| Verification 1: privacy and other public claims were unregistered | Fixed. Current promises are registered and each has one tagged test. |
| Verification 1: invalid BPM, hidden errors, missing update status, and immediate deletion | Fixed. Clamp, visible recovery/update status, and delete cancellation pass live. |
| Verification 1: invisible focus, small targets, missing CSP/cache policy, metadata gaps, and HTTP 200 unknown routes | Fixed. Current focus, 44 px checks, headers, caching, route metadata, and designed HTTP 404 pass. |
| Verification 3: short valid audio crashed playback | Fixed. The 20 ms WAV is rejected before scheduling with a visible message and no page error. |
| Verification 3: incomplete exports created broken loops | Fixed. Schema validation rejects the full malformed import atomically. |
| Reviews 2–5: Saved loops and Back lost their destination | Fixed. Header, cold fragment, and Back focus/scroll tests pass live. |
| Reviews 2–5: `OFFLINE-READY`, `DAW`, mixed saved-item names, vague headings, and README jargon/history | Fixed. Current copy uses the exact offline condition, music-production software, one saved-loop term, and direct headings. |
| Reviews 3–5: phone facts below fold, unlisted playback/sample claims, wrong Apple icon size, and ambiguous Stop label | Fixed. Facts end above y=574; claims pass; icon is 180 × 180; control says **Stop loop**. |
| Review 5: Demo edits survived exit and skip link named the wrong destination | Fixed. Demo-only records are cleared, real data remains, and **Skip to main content** focuses `main`. |
| Review 7: browser-dependent slow-playback quality was not disclosed | Fixed. The limitation is visible in the landing limits section and README. |
| Review 7: Reset had no registered observable claim test | Fixed. `demo-reset` proves restored sample state, removal of Demo edits, visible completion, and preservation of real data locally and live. |

## Scope and remaining work

The brief’s local import, A/B loop points, BPM and tap controls, slower pitch-preserving playback, local saved loops, and portable import/export are present. An AI feature would not remove a step in this focused practice job. Cloud sync would conflict with the current local-only promise unless the product were intentionally redesigned.

The optional one-time upgrade is unregistered and is not advertised. The complete free core has no remaining QA finding.

## Final counts

- Findings: **0**
- Untested public claims: **0**
- Verdict: **PASS**
