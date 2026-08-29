# Adversarial first-read review 5 — FAIL

- Reviewed: 2026-08-29 UTC
- Live origin: `https://loop-lab.sociobot.in`
- Reviewed base: `59228d1db77f42b40002dfc7843d003522991eef`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; separate clean clone for claim commands
- Verdict: **FAIL.** Eleven blocking findings and one minor finding remain. All ten findings from review 4 are still present and are blocking again under the required history rule.

## First read before scrolling

The basic first-read gate passes at both sizes. In my own words: Loop Lab lets beginning electronic-music makers isolate and slow a short passage for practice; the first action is **Try it with sample data**.

The exact copy that supplied those answers was:

> “Make a loop you can practise.”
>
> “For new electronic-music makers who want to study one short sound without opening a DAW.”
>
> “Try it with sample data”
>
> “The demo opens a four-bar beat.”

The mobile action was fully visible at y=`655–703`. The required offline, privacy, and price facts were not fully visible; that remains `F-5-7`.

## Findings

### F-5-1 / reopened F-4-1 / F-3-1 / F-2-1 — BLOCKING — Saved loops navigation and Back still lose the destination

**Exact quote/location:** header link **“Saved loops”** (`/#saved`); `src/main.ts` click and `popstate` handlers.

**Evidence:** on the live desktop page, `#saved` was at document y=`1522.98`. Clicking **Saved loops** changed the URL to `/#saved`, but after 500 ms `scrollY` was `0` and focus was `#page-title`. Starting from `/` at `scrollY=1213`, opening Demo, and going Back returned to `scrollY=0` with focus on `#page-title`. A cold `/#saved` load did reach the section in this round, but the named header action and ordinary Back sequence remain broken. The source still intercepts every root-relative link, rerenders, and focuses the h1 without fragment or scroll restoration.

**Why a first-time visitor is lost:** the visible navigation control does not go to the content it names, and Back discards the previous reading position.

**Concrete fix:** do not intercept same-document fragment links. Scroll to and focus `#saved-heading`, and preserve scroll/focus per history entry. Add tests for the header click, cold `/#saved`, and Back from `/demo` after scrolling from plain `/`.

### F-5-2 / reopened F-4-2 / F-3-2 / F-2-2 — BLOCKING — “OFFLINE-READY” remains vague and unregistered

**Exact quote/location:** landing eyebrow, **“LOCAL PRACTICE INSTRUMENT ● OFFLINE-READY.”**

**Why a first-time visitor is misled:** “offline-ready” does not say when offline use begins. The registered, tested condition is “Works offline after the first visit.”

**Concrete fix:** remove **“OFFLINE-READY”**. Keep one exact tested line: **“Works offline after the first visit.”**

### F-5-3 / reopened F-4-3 / F-3-3 / F-2-3 — BLOCKING — “DAW” remains unexplained beginner-facing jargon

**Exact quotes/locations:** landing **“without opening a DAW”**; README **“without learning a DAW first.”**

**Why a first-time visitor is lost:** the stated audience is beginners, but the sentence requires them to know a music-production abbreviation.

**Concrete fix:** use **“without opening music-production software”** and **“without learning music-production software first.”**

### F-5-4 / reopened F-4-4 / F-3-4 / F-2-4 — BLOCKING — The saved object still has several names

**Exact quotes/locations:** **“Saved loops,” “SAVED PRACTICE CARDS,” “Practice card name,” “Save practice card,” “Export cards,” “Import cards,”** and README references to **“practice cards,” “active loop,” “card,”** and **“real loops.”**

**Why a first-time visitor is lost:** the interface does not establish whether a loop, saved loop, and practice card are the same object.

**Concrete fix:** use **saved loop** throughout: **Save loop**, **Saved loops**, **Export loops**, **Import loops**, and **Saved loops appear here.** Reserve “card” for schema documentation only if necessary.

### F-5-5 / reopened F-4-5 / F-3-5 / F-2-5 — BLOCKING — Headings and instructions remain vague or metaphorical

**Exact quotes/locations:** **“Set two points. Hear the middle,” “Mark A and B,” “Slow and notice,” “Pitch stays put,” “03 / THREE MOVES,”** and **“A practice tool, not a studio.”**

**Why a first-time visitor is lost:** these phrases do not name loop boundaries, slowed playback, or the section subject when scanned independently.

**Concrete fix:** use **“Set loop start and end points,” “Set the loop start and end,” “Slow playback without changing pitch,” “Pitch does not change,” “03 / HOW IT WORKS,”** and **“What Loop Lab does not include.”**

### F-5-6 / reopened F-4-6 / F-3-6 / F-2-6 — BLOCKING — README still contains implementation jargon and obsolete checkout history

**Exact quotes/location:** **“Open the local URL shown by Vite,” “SPA fallback,” “Azure Static Web Apps,” “IndexedDB,”** and **“The product is free while its former paid checkout is unavailable.”**

**Why a first-time visitor is lost:** the terms are not explained, and checkout history is not a current instruction. The price also sounds temporary.

**Concrete fix:** write **“Open the address printed by the development server.”** Put operator deployment details in a clearly named deployment subsection. Use **“Loop Lab stores audio, the current loop, and saved loops in your browser.”** Replace the checkout sentence with **“Loop Lab is free.”**

### F-5-7 / reopened F-4-7 / F-3-7 — BLOCKING — Required facts remain below the phone fold

**Exact location:** 390 × 844 landing first screen. **“Offline after the first visit”** starts at y=`833`; the Local and Free facts start below the 844 px viewport.

**Why a first-time visitor is lost:** the required offline, privacy, and price facts are unavailable during the intended 30-second phone decision. The artwork consumes the top 310 px below the header.

**Concrete fix:** put the hero copy and all three facts before the artwork on mobile, or use a shorter crop after the facts. Add a 390 × 844 test asserting all three fact rows are fully inside the viewport.

### F-5-8 / reopened F-4-8 / F-3-8 — BLOCKING — Public claims remain absent from `.factory/claims.json`

**Exact quotes/locations:**

- landing/README: **“Make a loop you can practise”** / **“Loop Lab turns a short audio clip into a repeatable practice loop”**;
- landing/README: **“The demo opens a four-bar beat”** / **“isolated four-bar sample”**;
- artwork caption: **“Original generated artwork · no sound is bundled”**;
- boundaries: **“Loop Lab has no tracks, recording, cloud library, or AI composition”**;
- landing/README: **“Time-stretch sound quality varies by browser and source audio.”**

**Why a first-time visitor is misled:** none has its own registry entry and observable sandbox test. Existing tests do not observe playback wrapping from B to A, assert a four-bar sample, prove the public asset statement, or define a testable sound-quality result.

**Concrete fix:** add `loop-playback` and `demo-four-bars` claims with observable tests. Add an asset/request test if the no-bundled-sound sentence remains. Register narrowly testable scope guarantees; otherwise remove the blanket absence and subjective sound-quality sentences.

### F-5-9 / reopened F-4-9 / F-3-9 — BLOCKING — The required 180 px Apple touch icon remains absent

**Exact location:** `index.html` links `rel="apple-touch-icon"` to `/icon-192.png`; the live image is 192 × 192.

**Why this fails:** the site-structure contract requires a 180 × 180 Apple touch asset.

**Concrete fix:** add a 180 × 180 derivative, link it as the Apple touch icon, and test its decoded dimensions.

### F-5-10 / reopened F-4-10 / F-3-10 — BLOCKING — “Stop” still does not name its result

**Exact quote/location:** practice-desk transport button **“Stop.”**

**Why a first-time visitor is lost:** read alone, it does not say whether it stops loop playback, tempo tapping, or editing. The paired control is explicitly **“Play loop.”**

**Concrete fix:** rename the visible and accessible action **“Stop loop.”**

### F-5-11 — BLOCKING — Leaving Demo does not discard demo edits

**Exact quote/location:** demo action **“Start for real”** and the persistent demo namespace in `src/store.ts`.

**Evidence:** in a fresh live context, I saved a demo card named **“Must be discarded,”** clicked **Start for real**, then reopened Demo. The custom card was still present alongside **“Kick + bass pocket.”** Source only clears demo keys from **Reset demo**; route exit never clears them.

**Why a first-time visitor is misled:** a sandbox visit is expected to be temporary. The attached demo contract requires leaving demo mode to discard demo data or explicitly offer to keep it once. This path does neither.

**Concrete fix:** clear the `demo:` cards and workspace when **Start for real** is activated, then seed a clean demo on the next visit. Alternatively, provide one explicit **Keep this as my data** choice and test both branches. Add a test that edits Demo, leaves, re-enters, and sees only the seeded sample.

### F-5-12 — MINOR — The skip link names the wrong destination

**Exact quote/location:** `index.html`, **“Skip to the practice desk”** linking to `#main`.

**Evidence:** activating it on the live landing changed the URL to `/#main`, scrolled to y=`76`, and focused the hero h1. The practice desk starts much farther down the page.

**Why a first-time keyboard visitor is lost:** the control promises the practice desk but opens the main content at the hero.

**Concrete fix:** either rename it **“Skip to main content”** and retain `#main`, or target a focusable `#desk-heading` if the intended result is the practice desk. Add a keyboard destination assertion.

## Copy audit

Counts are whitespace-delimited; symbols are ignored, and hyphenated terms, paths, filenames, and versions count as one word. Dynamic time/BPM values and visitor-created data are excluded. No item exceeds 22 words and no banned marketing adjective appears. Every flag below has a rewrite in the corresponding finding.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to the practice desk | 5 | F-5-12 |
| LOOP LAB | 2 | — |
| Demo | 1 | — |
| Saved loops | 2 | F-5-1, F-5-4 |
| Privacy | 1 | — |
| LOCAL PRACTICE INSTRUMENT ● OFFLINE-READY | 4 | F-5-2 |
| Make a loop you can practise. | 6 | F-5-8 |
| For new electronic-music makers who want to study one short sound without opening a DAW. | 15 | F-5-3 |
| Try it with sample data | 5 | — |
| Import your audio | 3 | — |
| The demo opens a four-bar beat. | 6 | F-5-8 |
| Your file stays on this device. | 6 | — |
| Offline after the first visit | 5 | F-5-7 placement |
| Local audio never uploads | 4 | F-5-7 placement |
| Free with no account | 4 | F-5-7 placement |
| A pixel-art sampler with a glowing amber loop waveform. | 9 | — |
| Original generated artwork · no sound is bundled | 7 | F-5-8 |
| 01 / PRACTICE DESK | 3 | — |
| Set two points. | 3 | F-5-5 |
| Hear the middle. | 3 | F-5-5 |
| No clip loaded | 3 | — |
| Load a local audio file to begin. | 7 | — |
| Choose audio | 2 | — |
| Loop start | 2 | — |
| Loop end | 2 | — |
| Play loop | 2 | — |
| Stop | 1 | F-5-10 |
| Speed | 1 | — |
| Pitch stays put | 3 | F-5-5 |
| BPM | 1 | — |
| Tap tempo | 2 | — |
| Practice card name | 3 | F-5-4 |
| e.g. Kick and bass pocket | 5 | F-5-4 |
| What will you listen for? | 5 | — |
| e.g. Where does the bass enter? | 6 | — |
| Save practice card | 3 | F-5-4 |
| 02 / SAVED PRACTICE CARDS | 4 | F-5-4 |
| Reopen a loop where you left it. | 7 | F-5-4 |
| Export cards | 2 | F-5-4 |
| Import cards | 2 | F-5-4 |
| Saved practice cards appear here. | 5 | F-5-4 |
| Save one from the practice desk. | 6 | F-5-4 |
| 03 / THREE MOVES | 3 | F-5-5 |
| Build one useful practice loop. | 5 | F-5-8 |
| Load a clip | 3 | — |
| Use a file you have permission to use. | 8 | — |
| Mark A and B | 4 | F-5-5 |
| Make a short part that repeats. | 6 | F-5-8 |
| Slow and notice | 3 | F-5-5 |
| Keep pitch while you listen closely. | 6 | F-5-5 |
| 04 / BOUNDARIES | 2 | — |
| A practice tool, not a studio. | 6 | F-5-5 |
| Loop Lab has no tracks, recording, cloud library, or AI composition. | 11 | F-5-8 |
| Time-stretch sound quality varies by browser and source audio. | 9 | F-5-8 |
| Your audio is decoded and played in this browser. | 9 | — |
| It is never sent to a server. | 7 | — |
| Loop Lab is a local audio practice instrument. | 8 | — |
| Privacy · Terms · Built by Param Factory · v1.1.0 | 7 | — |

### README

| Sentence | Words | Flag |
| --- | ---: | --- |
| Loop Lab turns a short audio clip into a repeatable practice loop. | 12 | F-5-8 |
| It is for beginning electronic-music makers who want to listen closely without learning a DAW first. | 16 | F-5-3 |
| It runs in the browser and needs no account. | 9 | — |
| Audio and practice cards stay in this browser and reopen after refresh. | 12 | F-5-4 |
| Exported JSON includes each card's audio. | 6 | F-5-4 |
| The separate sample workspace at `/demo` never reads or writes real loops. | 12 | F-5-4 |
| Imported audio is not uploaded, and Loop Lab uses no analytics or advertising. | 13 | — |
| Slow playback keeps pitch in place. | 6 | — |
| Browser time-stretch quality can vary by source audio. | 8 | F-5-8 |
| Open the local URL shown by Vite. | 7 | F-5-6 |
| Visit `/demo` for the isolated four-bar sample. | 7 | F-5-8 |
| The static site is written to `dist/`, with `index.html` at its root. | 12 | F-5-6 |
| Deploy that directory to a static host with SPA fallback enabled; `staticwebapp.config.json` is included for Azure Static Web Apps. | 19 | F-5-6 |
| Audio, the active loop, and practice cards live in IndexedDB. | 10 | F-5-4, F-5-6 |
| Use **Export cards** to make a portable JSON backup and **Import cards** to restore it. | 15 | F-5-4 |
| The product is free while its former paid checkout is unavailable. | 11 | F-5-6 |
| See `/privacy` and `/terms`. | 4 | — |
| Audio clips must be at least 0.05 seconds long. | 9 | — |
| Loop Lab rejects shorter clips and incomplete card exports before they are saved or played. | 15 | F-5-4 |
| MIT. | 1 | — |
| See [LICENSE](LICENSE). | 2 | — |

README headings **Run**, **Verify and build**, **Data**, and **License** are clear out of context. Shell commands are not prose sentences.

### Terminology check

| Concept | Terms currently used | Required single term |
| --- | --- | --- |
| Saved practice object | saved loop, loop, practice card, card, active loop | saved loop |
| Demo container | sample workspace, demo workspace, real loops | demo / saved loops |
| Audio input | audio, clip, file, sound | Keep “audio file” for input; use “passage” only for the selected part |

## Demo and sandbox

The one-click entry itself passes. From a fresh 390 px landing, **Try it with sample data** opened `/demo`. Before scrolling, the result showed the persistent banner, **“Night bus · four-bar beat,”** a 12-second duration, waveform, A/B points, enabled controls, and the seeded **“Kick + bass pocket”** item. Reset removed an added demo card and restored the seed.

Isolation also passes: after Reset, IndexedDB contained `demo:sample-card` and an untouched `real:sentinel`; Start for real displayed only the real sentinel. The live request log contained only `https://loop-lab.sociobot.in`, and the demo reloaded with its sample while Chromium was offline.

The demo gate still fails overall because `F-5-11` proves that leaving without Reset retains edited demo data.

## Claims and verification

I cloned the reviewed commit into `/tmp/loop-lab-review5-XghYTF`, ran `npm ci`, and ran every exact command from `.factory/claims.json` separately. All commands exited 0.

| Claim id | Exact registered command | Result |
| --- | --- | --- |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `demo-isolated` | `npm run test:e2e -- --grep @claim:demo-isolated` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| `cards-local` | `npm run test:e2e -- --grep @claim:cards-local` | PASS |
| `audio-private` | `npm run test:e2e -- --grep @claim:audio-private` | PASS |
| `no-tracking` | `npm run test:e2e -- --grep @claim:no-tracking` | PASS |
| `cards-export` | `npm run test:e2e -- --grep @claim:cards-export` | PASS |
| `pitch-speed` | `npm run test:unit -- -t @claim:pitch-speed` | PASS |
| `input-boundaries` | `npm run test:e2e -- --grep @claim:input-boundaries` | PASS |

The full local suite passed: 4 unit tests and 8 browser tests. Typecheck, lint, and production build passed; `dist/` was produced with 8.11 kB gzip JavaScript. The full 8-test browser suite also passed against the deployed origin. The live Playwright axe integration reported no serious or critical issues, and `/opt/fleet/lib/verify-url.sh` passed with one h1, `lang=en`, a main landmark, alt text, and no landing-page console errors.

All registered tests pass, but the claims gate remains incomplete because of the unlisted public statements in `F-5-8`.

## History check

I read `.factory/review-2.md`, `.factory/review-3.md`, `.factory/review-4.md`, and the complete `.factory/handoff.md`. No `.factory/polish-*.md` exists. The reviewed base contains documentation-only review commits after the product commit, so every cited source string and behavior remains.

| Earlier finding | Live and code result in round 5 |
| --- | --- |
| F-2-1 / F-3-1 / F-4-1 Saved loops and Back | **Unfixed; reopened as F-5-1 BLOCKING.** Both ordinary interactions reproduced live. |
| F-2-2 / F-3-2 / F-4-2 “OFFLINE-READY” | **Unfixed; reopened as F-5-2 BLOCKING.** Exact text remains live and in source. |
| F-2-3 / F-3-3 / F-4-3 “DAW” jargon | **Unfixed; reopened as F-5-3 BLOCKING.** Exact text remains live and in README/source. |
| F-2-4 / F-3-4 / F-4-4 saved-item terminology | **Unfixed; reopened as F-5-4 BLOCKING.** All conflicting terms remain. |
| F-2-5 / F-3-5 / F-4-5 vague headings | **Unfixed; reopened as F-5-5 BLOCKING.** Exact phrases remain. |
| F-2-6 / F-3-6 / F-4-6 README jargon/history | **Unfixed; reopened as F-5-6 BLOCKING.** Exact sentences remain. |
| F-3-7 / F-4-7 mobile facts | **Unfixed; reopened as F-5-7 BLOCKING.** Current 390 px measurements reproduce it. |
| F-3-8 / F-4-8 unlisted claims | **Unfixed; reopened as F-5-8 BLOCKING.** Registry and public copy are unchanged. |
| F-3-9 / F-4-9 touch icon | **Unfixed; reopened as F-5-9 BLOCKING.** Live decode remains 192 × 192. |
| F-3-10 / F-4-10 Stop label | **Unfixed; reopened as F-5-10 BLOCKING.** Exact button text remains. |

Previously repaired short-audio rejection, atomic invalid-card rejection, local reopen/export, privacy request capture, BPM clamping, visible errors, delete confirmation, service-worker update notice, security headers, and designed 404 remain fixed in the current tests and source.

## Structure, accessibility, and visual identity

Checks that pass:

- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns the designed Loop Lab 404 with HTTP 404.
- Every checked route has one h1, one main landmark, `lang="en"`, a route-specific title, description, canonical URL, OG/Twitter metadata, favicon, and the 1200 × 630 product social image.
- Every discovered same-origin document/asset link returned 200. `robots.txt` and `sitemap.xml` are present and list the four public routes.
- Header and footer are consistent and include Privacy and Terms. CSP, HSTS, Referrer Policy, and `X-Content-Type-Options` are live.
- Route changes focus the new h1. The exceptions are the lost Saved-loops destination/history state in `F-5-1` and the mislabeled skip destination in `F-5-12`.
- The pixel sampler art, dark cobalt instrument panels, amber cues, waveform controls, and square hardware treatment match `.factory/design.md`. The site is distinct, not a generic SaaS template.

The Apple touch asset exception is `F-5-9`.

## Missed leverage

No additional feature is justified. The brief's local import, A/B loop points, BPM/tap control, slower pitch-preserving playback, saved items, and import/export are present. Cloud sync would conflict with the current local-only promise unless intentionally redesigned. An AI step would be decorative for this practice task, and no provider key or model endpoint is embedded.

## What would make this perfect

Resolve all twelve findings: fix Saved-loops/history routing; discard demo edits on exit; use one saved-item term; replace DAW and vague headings with plain language; put all three facts above the mobile fold; remove or register every claim; supply the 180 px touch icon; rename Stop; correct the skip destination; and rewrite the README around current user and operator tasks. Add the named regression tests, then rerun the entire cold review from a clean context. Only zero findings warrants PASS.
