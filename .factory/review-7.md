# Create and save short audio practice loops — review 7

- Reviewed: 2026-09-06 UTC
- Live URL: `https://loop-lab.sociobot.in`
- Implementation candidate: `6ec9e9935505e6f194e72dfc2e0d27cc421df7d0`
- Documentation checkout: `45d4f0a196e04cc74fb5924fe741c831906f935f`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; separate clean clone for all claim commands
- Verdict: **FAIL — 2 findings, including 1 untested public claim.**

The live shell, JavaScript, CSS, service worker, manifest, Apple icon, and hero image have the same SHA-256 hashes as a fresh build from the documentation checkout. Commits after the implementation candidate changed tests and reports, not the shipped product. This is not a stale-deployment result.

## Findings

### F-7-1 — MEDIUM — The required playback-quality limitation is missing

**Requirement:** the researched brief says to disclose that time-stretch quality varies by browser.

**Evidence:** the live landing page, Demo, Privacy, Terms, and current README do not contain that disclosure. The limits section says only that audio is not uploaded, saved loops reopen after refresh, and loops should be exported before browser data is cleared. The previous repair record says the sound-quality sentence was deliberately removed as subjective copy.

**Impact:** a beginning maker is told that slow playback keeps pitch in place but is not told that the sound can differ between browsers. That is useful expectation-setting for a browser audio tool and an explicit acceptance constraint.

**Required change:** add a short limitation such as **“Slow-playback sound quality can vary by browser.”** Put it in the landing limits section and README. Treat it as a limitation, not a quality promise.

### F-7-2 — HIGH — The public Reset promise has no registered observable test

**Public claim:** README says **“Reset demo restores its sample.”** `.factory/demo.md` describes the same result.

**Evidence:** `.factory/claims.json` has no Reset claim. No tagged claim test clicks **Reset demo** and asserts that an added sample loop is removed and the seeded loop returns. `demo-isolated` tests leaving Demo; `demo-four-bars` tests only the initial seed. The full suite therefore passes while this public promise remains outside the claim gate.

**Runtime disposition:** the current live behavior works. I added **Reset timing**, clicked **Reset demo**, waited for the completion status, and observed **“Demo reset. The four-bar sample is ready.”** The added loop was gone and **Kick + bass pocket** was restored. That manual result does not satisfy the contract that every public claim has a registered repeatable test.

**Required change:** register a `demo-reset` claim and add one tagged browser test that changes Demo, resets it, and asserts the seed and completion message. Keep the existing exit-isolation test separate.

## First screen before scrolling

In plain words, the job is to turn a short audio file into a repeatable practice loop. It is for beginning electronic-music makers who want to study a passage without learning music-production software first. The first action is **Try it with sample data**, which says it loads a four-bar beat.

Both fresh viewports showed the job, audience, action, result, and three facts before scrolling. At 390 × 844, the fact rows ended at y=`523.4`, `548.4`, and `573.4`. There was no horizontal overflow.

## Demo and real-data isolation

The one-click sample opened `/?demo=1` with the persistent **“Demo — sample data, nothing is saved to your real data”** banner, **Reset demo**, **Start for real**, the eight-second **Night bus · four-bar beat**, ready controls, and the seeded **Kick + bass pocket** saved loop.

I placed `real:sentinel` in the real namespace before entering Demo. Reset removed an added demo loop and retained both `demo:sample-card` and `real:sentinel`. After adding another demo loop and choosing **Start for real**, the database contained only `real:sentinel`. Re-entering Demo restored only its seed. All captured requests used `https://loop-lab.sociobot.in`.

## Declared claims

I cloned commit `45d4f0a` to `/tmp/loop-lab-review7.8YD6XE`, ran `npm ci`, and then ran every command from `.factory/claims.json` separately. All 11 declared commands passed.

| Claim | Result |
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

The registry-to-tag completeness test also passes. Finding F-7-2 is a public-claim inventory gap, so it is not detected by that test.

## Normal, invalid, boundary, and recovery checks

- Normal: a generated WAV imports, saves with its audio, survives reload, reopens, plays, exports, and imports again.
- Boundary: `999` BPM is clamped to `300`; a 20 ms WAV is rejected before playback with the documented 0.05-second minimum.
- Invalid: corrupt audio gets a visible recovery message. A mixed valid/incomplete saved-loop file is rejected atomically and imports no partial record.
- Recovery: delete requires confirmation; cancel keeps the loop. The update event produces a visible status. Saved-loop fragment, cold deep-link, and Back scroll/focus restoration pass.

The live ten-test browser suite passed these paths again with `PLAYWRIGHT_BASE_URL=https://loop-lab.sociobot.in npm run test:e2e`.

## Accessibility, keyboard, and responsive checks

- `verify-url.sh` passed with `lang=en`, a useful title, one h1, a main landmark, alt text, labels, and no cold-load console error.
- Playwright axe found no serious or critical violations on live desktop and phone layouts.
- The skip link is first in the Tab order and moves focus to `main`. Focus uses a visible 3 px mint outline.
- ArrowRight moved loop start from `1` to `1.05`. Enter changed **Play loop** to **Pause loop**; Space returned it to **Play loop**.
- Visible controls meet the 44 px target check. The 390 px layout has no horizontal overflow. A 720 CSS px / 2× device-scale check retained content and controls without overflow.
- Reduced motion changes waveform transition duration to `0s`.

## Offline, privacy, routes, and links

- After one Demo visit, a service-worker-controlled reload works offline. An uncached offline navigation shows the designed **Offline — Loop Lab** fallback. `registration.update()` completes against the active `/sw.js`.
- Requests through landing, Demo, real import/save, and the legal routes stayed same-origin. There are no analytics, ads, sign-in, product API, or third-party runtime requests.
- `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, the manifest, robots, sitemap, and icons return 200.
- An unknown route deliberately returns HTTP 404 with the product-styled title, one h1, and a link back. The expected 404 console resource entry is not a defect.
- Route titles, canonicals, heading order, history behavior, sitemap routes, and all rendered internal links are correct.
- CSP, HSTS, `Referrer-Policy`, and `X-Content-Type-Options` are present. `frame-ancestors` is sent in the response CSP header.

This is a static local-first PWA. Tenant isolation, server restart persistence, health endpoints, and 429/`Retry-After` checks are not applicable. No product backend or paid endpoint is present.

## Build and performance

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 200 packages audited, 0 vulnerabilities |
| `npm test` | PASS; 7 unit/static and 10 Chromium tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS; `dist/index.html` produced |
| `git diff --check` in clean clone | PASS |

The fresh build contains 23,989 bytes of initial JavaScript, 11,174 bytes of CSS, and a 123,250-byte hero image. Live Lighthouse wrote its report before a post-audit browser-tab crash: Performance 96, Accessibility 100, Best Practices 100, SEO 100, FCP 0.8 s, LCP 1.5 s, CLS 0, TBT 220 ms, total transfer 188 KiB.

## Earlier finding dispositions

| Earlier finding | Current evidence |
| --- | --- |
| Verification 1: every claim command failed | Fixed: all 11 current exact commands pass separately after clean install. |
| Verification 1: real saved loops could not reopen | Fixed: live save, reload, reopen, playback, export, and import tests pass. |
| Verification 1: broken paid checkout and forgeable licenses | Fixed by removal: no paid offer, license storage, verification request, or entitlement code remains. |
| Verification 1: privacy and other public claims were absent | Fixed for those named claims: privacy, tracking, playback, sample, persistence, export, and boundaries are registered. F-7-2 is a new inventory gap. |
| Verification 1: invalid BPM, hidden errors, missing update notice | Fixed: clamp and visible recovery/update status tests pass live. |
| Verification 1: keyboard focus, touch targets, destructive delete | Fixed: focus, 44 px controls, range keyboard input, and delete confirmation pass. |
| Verification 1: missing export/import and workspace persistence | Fixed: current live and local tests reopen and round-trip saved audio. |
| Verification 1: CSP, cache policy, metadata, and HTTP 404 | Fixed: current headers, immutable assets, route metadata, and designed HTTP 404 pass. |
| Verification 3: short valid audio crashed playback | Fixed: 20 ms WAV is rejected with visible recovery and no page error. |
| Verification 3: incomplete imports created broken loops | Fixed: schema validation rejects the whole malformed import. |
| Reviews 2–5: saved-loop link and Back lost the destination | Fixed: header link, cold `/#saved`, and Back restore focus and scroll live. |
| Reviews 2–5: vague copy, DAW jargon, mixed names, headings, README wording | Fixed: current copy uses plain terms and one saved-loop name. |
| Reviews 3–5: first-screen facts below phone fold | Fixed: all three end above y=`574` at 390 × 844. |
| Reviews 3–5: claim inventory, Apple icon, Stop label | Fixed for the cited items: playback/sample claims exist, the icon is 180 px, and the action says **Stop loop**. |
| Review 5: leaving Demo retained edits | Fixed: exit removes only `demo:` records; the real sentinel remains. |
| Review 5: skip link named the wrong destination | Fixed: it says **Skip to main content** and focuses `main`. |

## Counts

- Finding count: **2**
- Untested public claim count: **1**
- Verdict: **FAIL**
