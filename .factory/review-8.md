# Create and save short audio practice loops — review 8

- Reviewed: 2026-09-06 UTC
- Live URL: `https://loop-lab.sociobot.in`
- Implementation candidate: `01d8af68565c013e516d3d2376f89cb815c0a5e1`
- Documentation checkout: `a9904f152b41e4c6a6eda7cbd15aec0b02fe0673`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; separate clean checkout for every claim command
- Verdict: **PASS — 0 findings and 0 untested public claims.**

The documentation checkout differs from the implementation only in `.factory/handoff.md` and `.factory/verification-6.md`. A fresh build matched the live `index.html`, JavaScript, CSS, service worker, manifest, Apple icon, and hero image by SHA-256. The live product is the stated implementation candidate.

## First screen before scrolling

Both fresh browsers gave the same clear first read:

- Job: create a repeatable audio practice loop.
- Audience: beginning electronic-music makers studying a short passage without learning music-production software.
- First action: **Try it with sample data**.
- Immediate result: **Loads a four-bar beat.**

The offline, upload, and price facts were visible before scrolling. On the 390 × 844 phone, the primary action ended at y=`393.4` and the last fact ended at y=`573.4`. The page had one h1, a main landmark, and no console or page error. Screenshots are `/work/.evidence/review-8-phone-first-screen.png` and `/work/.evidence/review-8-desktop-first-screen.png`.

## Sample and real-data safety

One click opened `/?demo=1`. The persistent banner said **“Demo — sample data, nothing is saved to your real data.”** The populated view contained the eight-second **Night bus · four-bar beat**, ready loop controls, and **Kick + bass pocket** at 120 BPM with a specific listening note.

The Reset path was exercised against live and in the registered clean-checkout test. It removed a Demo-only saved loop, restored start `1`, restored the single sample loop, and announced **“Demo reset. The four-bar sample is ready.”** A real WAV-backed saved loop remained absent from Demo and returned after **Start for real**. Accepting the sample-delete confirmation removed the sample; Reset restored it. Demo screenshots are `/work/.evidence/review-8-phone-demo.png` and `/work/.evidence/review-8-desktop-demo.png`.

## Declared claims

After `npm ci` in clean checkout `/tmp/loop-lab-review8.ffeooM`, every command in `.factory/claims.json` was run separately and exactly as written. All exited 0.

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

The registry-completeness test found exactly one tagged test for every claim. Landing, Demo, Privacy, Terms, README, and interface copy were cross-checked. Each relied-on statement maps to the registry. The browser-quality sentence is a limitation, not a quality promise. There are **0 untested public claims**.

## Normal, invalid, boundary, and recovery paths

- A generated WAV imports, plays, saves with audio, survives refresh, reopens, exports, and imports after database removal.
- The loop start range responds to ArrowRight, moving from `1` to `1.05`. Enter starts playback, and the action changes to **Pause loop**. Tap tempo changes the displayed BPM. An entered `999` BPM is clamped to `300` before persistence.
- A corrupt audio file shows a visible recovery message. A later valid file works.
- A valid 20 ms WAV is rejected before playback with the documented 0.05-second minimum and no page error.
- A mixed valid and incomplete saved-loop export is rejected atomically. No partial loop is stored.
- Delete cancellation preserves a loop. Delete acceptance removes it. Demo Reset restores the sample.
- Saved-loop header navigation, a cold `/#saved` link, and browser Back restore the expected scroll and focus.

## Accessibility, keyboard, mobile, and motion

- `/opt/fleet/lib/verify-url.sh` passed. Evidence is `/work/.evidence/review-8-verify-url/`.
- Fresh Axe scans of landing, Demo, Privacy, Terms, and the designed 404 at both viewports found zero violations of any severity.
- The skip link is the first Tab stop and moves focus to `main`. Its focus indicator is a 3 px mint outline. Twenty-four consecutive Tab presses traversed the controls and wrapped without a trap.
- Native range, button, select, number, text, and file controls have usable names and keyboard behavior. Visible controls meet the 44 px target check.
- At 390 px, 200% text sizing produced no page or main-landmark horizontal overflow.
- Reduced motion produced a `0s` waveform transition. There is no autoplay or flashing content.

## Privacy, PWA, routes, and deployment

- Captured requests through landing, Demo, real import/save, and legal routes remained same-origin. There is no analytics, advertising, account, paid endpoint, third-party font, or AI request.
- Audio and saved loops use browser storage. No product server holds a user account or personal record, so backend privacy-request handling does not apply. The Privacy page explains browser storage and clearing-site-data risk.
- A service-worker-controlled Demo reloads offline. An uncached navigation under the controlled origin returns the designed **Offline — Loop Lab** page. `registration.update()` completed against the active worker, and the visible update-notice path passes.
- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific browser titles, one h1, one main landmark, canonical metadata, and the shared header/footer. Rendered destination links resolve.
- `/not-a-real-loop` deliberately returns HTTP 404 with the designed title, h1, main landmark, and return action. Its expected browser 404 resource message is not a defect.
- CSP includes `frame-ancestors 'none'`; HSTS, strict-origin referrer policy, and `nosniff` are present. Hashed assets are immutable and `sw.js` is `no-cache`.
- The manifest has a versioned start URL, standalone display, matching colors, and 192/512 maskable icons. The Apple icon is 180 × 180, and the social image is 1200 × 630.

This is a static local-first PWA. Backend tenant isolation, restart persistence, health, and 429/`Retry-After` checks do not apply.

## Quality gates and performance

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 200 packages audited, 0 vulnerabilities |
| `npm test` | PASS — 7 unit/static and 11 Chromium tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/index.html` produced |
| Live browser suite | PASS — all 11 tests |
| Clean checkout after tests | PASS |

The production JavaScript is 24,044 bytes raw / 8.61 KiB gzip. CSS is 11,174 bytes raw / 3.20 KiB gzip. The hero WebP is 123,250 bytes.

Fresh live Lighthouse scored Performance **99**, Accessibility **100**, Best Practices **100**, and SEO **100**. FCP was 0.79 s, LCP 1.88 s, TBT 112 ms, CLS 0, and total transfer 192,897 bytes. The runner emitted a post-audit tab-crash message after writing the complete report; the product page and all browser suites remained error-free. Evidence is `/work/.evidence/review-8-lighthouse.json`.

## Earlier finding disposition

| Earlier finding | Current disposition and proof |
| --- | --- |
| Verification 1: claim commands failed; offline test was only source inspection | Fixed. All 12 exact commands pass after a clean install; offline reload uses a real fresh browser context. |
| Verification 1: real saved loops could not reopen or replay | Fixed. Live and local tests save audio, refresh, reopen, play, export, clear storage, import, and reopen. |
| Verification 1: dead paid checkout and forgeable license | Fixed by removal. No paid offer, checkout, license storage, entitlement logic, or product API request ships. |
| Verification 1: privacy, tracking, and paid claims were absent from the registry | Fixed. Current public promises are registered and tested; removed paid claims do not appear. |
| Verification 1: invalid BPM was stored | Fixed. `999` is visibly and persistently clamped to `300`. |
| Verification 1: important errors and update state were invisible | Fixed. Corrupt media, invalid import, and update messages use a visible status region. |
| Verification 1: no export/import or active-workspace persistence | Fixed. Audio-backed export/import and refresh recovery pass. |
| Verification 1: file focus was invisible and initial focus skipped navigation | Fixed. The first Tab reaches the skip link; file focus uses the visible 3 px focus treatment. |
| Verification 1: touch targets were below 44 px | Fixed. The live phone assertion finds no undersized visible control. |
| Verification 1: deletion had no confirmation | Fixed. The native confirmation supports cancel and accept; both paths were exercised. |
| Verification 1: CSP/cache policy differed from source | Fixed. Live CSP, immutable asset caching, and no-cache service worker headers pass. |
| Verification 1: unknown routes returned HTTP 200 | Fixed. The styled unknown route returns deliberate HTTP 404. |
| Verification 1: route canonicals and Twitter metadata were wrong or incomplete | Fixed. Browser route checks show route-specific canonicals and social titles. |
| Verification 1: manifest used an opaque MIME type | Fixed. Live returns JSON, Chromium loads the manifest, and the manifest data and icons pass. |
| Verification 3: accepted 20 ms audio crashed playback | Fixed. It is rejected before scheduling with visible recovery and no error. |
| Verification 3: incomplete exports created broken loops | Fixed. Full schema validation rejects the malformed file atomically. |
| F-2-1 through F-5-1: Saved loops and Back lost their destination | Fixed. Header, cold fragment, and Back scroll/focus checks pass live. |
| F-2-2 through F-5-2: vague `OFFLINE-READY` copy | Fixed. It is removed; the exact tested condition is shown. |
| F-2-3 through F-5-3: unexplained `DAW` jargon | Fixed. Landing and README use “music-production software.” |
| F-2-4 through F-5-4: inconsistent saved-item names | Fixed. Visitor copy consistently uses “saved loop.” |
| F-2-5 through F-5-5: vague or metaphorical headings | Fixed. Current headings name loop points, playback, saved loops, and privacy. |
| F-2-6 through F-5-6: README jargon and obsolete checkout history | Fixed. README separates reader and deployment instructions and states the current free product. |
| F-3-7 through F-5-7: required facts below the phone fold | Fixed. All three facts end at y=`573.4` in the 844 px viewport. |
| F-3-8 through F-5-8: public claims missing from the registry | Fixed. The registry and one-tag-per-claim test pass; unsupported copy is absent. |
| F-3-9 through F-5-9: wrong Apple icon size | Fixed. The linked live PNG is 180 × 180. |
| F-3-10 through F-5-10: ambiguous **Stop** action | Fixed. Visible and accessible text says **Stop loop**. |
| F-5-11: leaving Demo retained edits | Fixed. Demo exit clears only `demo:` records; a real saved loop remains. |
| F-5-12: skip link named the wrong destination | Fixed. **Skip to main content** focuses `main`. |
| F-7-1: playback-quality limitation missing | Fixed. Landing and README say quality can vary by browser. |
| F-7-2: Reset promise had no observable claim test | Fixed. `demo-reset` proves restored sample state, visible completion, removal of Demo changes, and preservation of real data. |

Later pass reports introduced no findings. Every earlier blocking, high, medium, low, and minor item remains resolved.

## Scope and final counts

The brief's import, A/B looping, BPM entry and tapping, slower pitch-preserving playback, local saved loops, and portable import/export are present. An AI step would add no useful action to this focused local practice task. Cloud sync would conflict with the current local-only promise unless the product were deliberately redesigned.

- Findings: **0**
- Untested public claims: **0**
- Verdict: **PASS**
