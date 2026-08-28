# Independent verification — FAIL

- Candidate: `3329c44b9f57d01876a1bdbc2526d1ffcc7f3319`
- Live URL: `https://loop-lab.sociobot.in`
- Verified: 2026-08-28 UTC
- Work order: `loop-lab-verify-1`
- Result: **FAIL — do not release**

The live site is byte-for-byte consistent with the candidate's built shell and core assets. This is not a stale-deployment result. The candidate fails the mandatory claims gate, cannot reopen real saved loops, exposes a broken paid checkout, and trusts an unverified pasted license.

## First-read gate

**PASS.** On a cold 1440×900 load, the first screen says:

- What it does: “Make a loop you can practise.”
- Who it is for: “For new electronic-music makers who want to study one short sound without opening a DAW.”
- What to click: “Try it with sample data.”
- What happens next: “The demo opens a four-bar beat.”

The sample action is one click away and visible without scrolling. At 390×844, the headline, audience sentence, and sample action are also all visible in the initial viewport. The live sample opened without an account or setup.

## Release-blocking findings

### Critical — every exact claim command fails

`.factory/claims.json` exists and lists four commands. On the untouched clone before installation, all four stopped with `vitest: not found`. After the required clean `npm ci`, all four still failed with exit 1 because Vitest 3.2.7 rejects `--grep`:

```text
CACError: Unknown option `--grep`
```

Affected commands:

```text
npm test -- --grep @claim:offline-reload
npm test -- --grep @claim:demo-isolated
npm test -- --grep @claim:cards-local
npm test -- --grep @claim:pitch-speed
```

Using Vitest's valid `-t` option made each named test pass, but that does not satisfy the acceptance contract requiring every recorded command to pass. The offline claim test is also only a source-string check for precache entries; it does not perform the fresh-browser offline reload described by its own sandbox.

### Critical — real saved loops cannot be found or replayed

A valid generated WAV loaded and played. Saving “One second tone” wrote a `real:<uuid>` record to IndexedDB. The normal workspace then had no `#cards` or `.saved-section`, the saved name was absent, and the “Saved loops” header link pointed to a missing `#saved` target. After reload, the desk said “No clip loaded” and the saved card was still not visible.

The implementation confirms this result: `renderSavedInline()` is empty, real audio is never persisted, and only `/demo` renders `renderCards()`. A returning user therefore cannot reopen or replay a saved real loop. This fails the researched job-to-be-done and makes the success measure—creating and replaying saved loops—unachievable.

### Critical — paid flow is broken and entitlements are forgeable

- `GET https://api.sociobot.in/api/v1/products/loop-lab/checkout` returned HTTP 404 with `{"error":"enabled factory product","status":404}`. The visible “Buy Loop Lab Plus” action is dead.
- Pasting `invalid-license-token` immediately wrote `{"valid":true,"checked":...}` to `sb_license:loop-lab:verified`.
- `verifyLicense()` then treats that new local verdict as fresh for 24 hours and skips the server. Any string therefore enables the unlimited-card check for one day.

The paid tier must not be advertised until checkout registration works and a pasted/returned token is verified before a positive verdict is cached.

### High — relied-on claims are absent from the claim registry

The landing page, privacy page, and README claim that imported audio never uploads, files stay on the device, and there is no analytics or advertising. The paid section claims a $9 one-time price and unlimited local cards. None has a corresponding entry and tagged test in `.factory/claims.json`. This violates the mandatory “every claim is a test” contract even though independent request capture during landing and demo use observed only the product origin.

## Additional defects

### High

- **Invalid BPM is stored.** Entering `999` makes the visible output show the clamped limit `300`, but saving records and displays `999 BPM`. The raw field value is stored, and the BPM input is outside the submitted form's validation boundary.
- **Important errors are invisible.** A corrupt `broken.wav` produces the useful message “The browser could not read that audio file. Try WAV, MP3, or M4A,” but it is written only into the permanently clipped `.announcer`. Sighted users see no error or recovery state. Card-limit and license-status messages use the same hidden-only channel.
- **Local-first ownership is incomplete.** There is no practice-card export/import. Audio and active loop state disappear on refresh. This fails the attached PWA persistence and data-ownership contract.

### Medium

- **Keyboard focus is not consistently visible.** Both file inputs receive focus with `opacity: 0`; their 3px outline is therefore invisible. Initial route rendering also focuses the `<h1>`, so the next Tab starts at the hero action and skips the header and skip link until focus wraps.
- **Touch targets are too small.** At 390 px, measured examples include 20 px-high header links, 15 px-high footer links, 41 px-high replace-audio input, 16 px-high range controls, a 25 px-high speed select, and a 28 px-high BPM input.
- **No visible update toast.** A controlled service-worker byte update triggered “An update is ready. Reload when you finish this loop,” but only in the clipped screen-reader announcer, not an on-screen toast.
- **Destructive card deletion has no confirmation or undo.** A single × removes the record immediately.
- **Live response policy differs from the repository config.** No `Content-Security-Policy` header was returned. All tested assets, including `/assets/app.js`, `/assets/app.css`, and the hero image, returned `Cache-Control: public, must-revalidate, max-age=30`, not immutable long-lived caching.
- **Unknown routes return HTTP 200.** `/not-a-real-loop` renders the styled not-found view but its network status is 200 because no 404 response override exists.

### Low

- `/demo`, `/privacy`, `/terms`, and the not-found view all retain the home-page canonical URL.
- The Twitter metadata supplies only `twitter:card`; route-specific title, description, and image tags are absent.
- The manifest is served as `application/octet-stream`, although Chromium parsed it and reported no installability errors.

## Claims matrix

| Claim | Exact recorded command | Result | Independent evidence |
| --- | --- | --- | --- |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | **FAIL**, unsupported option | Live and local controlled `/demo` reloads did work offline after first load. The recorded unit test does not exercise this behavior. |
| `demo-isolated` | `npm test -- --grep @claim:demo-isolated` | **FAIL**, unsupported option | Demo keys were `demo:*`; switching to real found no `real:*` keys. Demo requests remained same-origin. |
| `cards-local` | `npm test -- --grep @claim:cards-local` | **FAIL**, unsupported option | A real card persisted under `real:<uuid>`, but the product provided no way to see or replay it. |
| `pitch-speed` | `npm test -- --grep @claim:pitch-speed` | **FAIL**, unsupported option | The alternate filtered unit test passed; live 50% playback entered the playing state. No perceptual pitch measurement was made. |

## End-to-end evidence

### Live demo

- Loaded the synthesized “Night bus · four-bar beat” and seeded “Kick + bass pocket” card.
- Changed A/B, selected 50%, started and stopped playback, and saved a second card.
- Card count changed from one to two; Reset demo returned it to one.
- Captured requests throughout the flow: the only origin was `https://loop-lab.sociobot.in`.
- After the service worker controlled the page, network-off reload rendered “Repeat one small pattern.”
- A controlled local production-build service-worker update emitted the expected update message. The build was regenerated afterward to restore `dist/` exactly.

### Real workspace

- Valid case: imported a one-second WAV, played/stopped it, set 30 BPM, and saved a card.
- Boundary case: the 30 BPM minimum saved; an out-of-range 999 value also saved, which is a defect.
- Invalid case: corrupt WAV was rejected and the recovery copy was added to the live region, but was not visible.
- Persistence: the card record remained in IndexedDB, while the audio, active loop, and all saved-card UI disappeared on reload.

## Local quality gates

| Check | Result |
| --- | --- |
| Initial tracked worktree | Clean at requested commit |
| `npm ci` | PASS; 98 packages, 0 vulnerabilities |
| `npm test` | PASS; 3 files, 4 tests |
| `npx tsc -b --pretty false` | PASS |
| Lint | Not available; no lint script/configured command |
| `npm run build` | PASS; `dist/` produced |
| `/opt/fleet/lib/verify-url.sh <url> <dir>` | PASS; title/lang/main/alt/console checks clean |

## Accessibility and responsive checks

- Playwright axe on live desktop, live 390 px mobile, and demo: zero serious or critical violations.
- Lighthouse accessibility: 100.
- Semantic smoke checks: `lang="en"`, one `<h1>`, one `<main>`, route titles, image alt text, and no console/page errors all passed.
- 1440 px and 390 px both had zero horizontal layout overflow at normal scale.
- Reduced-motion emulation matched and transition rules are limited to `prefers-reduced-motion: no-preference`.
- Native form labels and required validation exist. There were no dialogs to test.
- Manual keyboard traversal exposed the focus-order and invisible-file-focus defects above; no keyboard trap was found.

## Performance and bundle budgets

Lighthouse mobile against the live URL:

- Performance 93, accessibility 100, best practices 100, SEO 100
- FCP 0.9 s, LCP 1.6 s, speed index 0.9 s
- TBT 310 ms, CLS 0
- Total transfer 132 KiB

Production assets:

- JS: 17,697 bytes raw / 6,781 bytes gzip
- CSS: 9,810 bytes raw / 2,907 bytes gzip
- Hero WebP: 123,250 bytes
- No downloaded font files

The stated JS, CSS, font, hero, LCP, and CLS budgets pass. INP was not produced by the lab run.

## Deployment, headers, and API

SHA-256 hashes for live and local candidate build matched for `index.html`, `assets/app.js`, `assets/app.css`, `sw.js`, `manifest.webmanifest`, and `loop-lab-hero.webp`. This confirms the live product under test corresponds to the candidate artifact.

The site returned HTTPS 200 for `/`, `/demo`, `/privacy`, and `/terms`. HSTS, `Referrer-Policy`, and `X-Content-Type-Options` were present. CSP was absent. Landing and demo flows emitted no third-party runtime requests.

Rate limiting was tested on the product's Sociobot verification endpoint with a 60-request concurrent burst. Results: 30 HTTP 200 and 30 HTTP 429; every 429 included `Retry-After: 4`. Observed threshold: **30 accepted requests per window**. An Origin-bearing verification request returned the expected CORS allow-origin for the product.

Sign-in, backend persistence/concurrency, and library/CLI packaging are not applicable to this static PWA.

## Required repair order

1. Make every `.factory/claims.json` command valid and make the offline/privacy tests exercise observable browser behavior.
2. Build a real saved-loop library that persists enough audio/source state to reopen and replay cards after refresh.
3. Remove the paid offer until checkout is registered; never cache a positive license verdict before server validation.
4. Register and test all privacy and paid claims.
5. Reject or normalize invalid BPM, show visible errors and update notices, repair keyboard focus/touch targets, and add data export/import.
6. Apply production CSP/cache/404 policy and repeat the full verification against the redeployed candidate.
