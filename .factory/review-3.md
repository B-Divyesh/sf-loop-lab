# Adversarial first-read review 3 — FAIL

- Reviewed: 2026-08-29 UTC
- Live origin: `https://loop-lab.sociobot.in`
- Requested base: `4b3d0c092a9d3cb9b0f72ee2ebaac24883b335cd`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; clean requested checkout
- Verdict: **FAIL.** Six findings from review 2 remain unchanged. Under this round's history rule, each is reopened as blocking. Four additional minor findings remain. This is not PASS-adjacent.

## First read before scrolling

This gate passes at both sizes.

On the 390 × 844 first screen, before scrolling, I understood the product as: make a repeatable practice loop from one short sound; it is for new electronic-music makers; click **Try it with sample data** first. The action was fully visible at y=`655–703`, and its explanation was visible at y=`775–817`.

The exact copy that supplied those answers was:

> “Make a loop you can practise.”
>
> “For new electronic-music makers who want to study one short sound without opening a DAW.”
>
> “Try it with sample data”
>
> “The demo opens a four-bar beat.”

The same answers and action were visible without scrolling at 1440 × 900. The unexplained term “DAW” remains a copy finding below, but it did not prevent identifying the audience and first action.

## Findings

### F-3-1 / reopened F-2-1 — BLOCKING — Saved-loops navigation and Back still do not reach or restore the saved section

**Exact location:** desktop header link **“Saved loops”** (`/#saved`); the catch-all internal-link handler and `popstate` handler in `src/main.ts`.

**Evidence:** on the live desktop page, `#saved` was at document y=`1523`. Clicking **Saved loops** changed the URL to `/#saved`, but after 300 ms `scrollY` remained `0` and focus was `#page-title`. In a separate clean sequence, I scrolled to the saved section (`scrollY=1213`), opened Demo, and used Back. The landing page returned at `scrollY=0`, still focused on `#page-title`, after 1 second. A cold address-bar load of `/#saved` did scroll near the section, so the defect is specifically the SPA click and history handling.

**Why this fails:** the named navigation control produces no visible destination, and Back discards the visitor's place. This is broken routing, so it remains blocking independently of the history rule.

**Concrete fix:** do not intercept same-document fragment links. Let `/#saved` use native fragment navigation, or scroll and focus `#saved-heading` explicitly. Store and restore scroll and focused-element state per history entry. Add browser tests for header click, cold `/#saved`, and Back from `/demo` after starting at the saved section.

### F-3-2 / reopened F-2-2 — BLOCKING — “OFFLINE-READY” is still vague and not the registered claim

**Exact quote/location:** landing eyebrow, **“LOCAL PRACTICE INSTRUMENT ● OFFLINE-READY”**.

**Why this fails:** “offline-ready” does not say when offline use begins. The registered and tested promise is **“Works offline after the first visit.”** This unresolved review-2 finding is blocking under the history rule.

**Concrete fix:** remove **“OFFLINE-READY”**. The exact tested fact already appears below as **“Offline after the first visit.”**

### F-3-3 / reopened F-2-3 — BLOCKING — “DAW” is still unexplained beginner-facing jargon

**Exact quotes/locations:** landing, **“without opening a DAW”**; README, **“without learning a DAW first.”**

**Why this fails:** the product explicitly addresses beginners but requires them to decode a music-production abbreviation. This unresolved review-2 finding is blocking under the history rule.

**Concrete fix:** use **“without opening music-production software”** on the landing page and **“without learning music-production software first”** in the README.

### F-3-4 / reopened F-2-4 — BLOCKING — One saved item still has several names

**Exact quotes/locations:** header **“Saved loops”**; section label **“SAVED PRACTICE CARDS”**; heading **“Reopen a loop where you left it.”**; buttons **“Save practice card,” “Export cards,”** and **“Import cards”**; README references to **“practice cards,” “active loop,” “card,”** and **“real loops.”**

**Why this fails:** a visitor cannot tell whether a loop and a practice card are the same saved object. The broken Saved loops link makes the mismatch more visible. This unresolved review-2 finding is blocking under the history rule.

**Concrete fix:** use **“saved loop”** throughout the UI and README: **Save loop**, **Saved loops**, **Export loops**, **Import loops**, and **Saved loops appear here.** Use “card” only inside a versioned file-schema document if technically necessary.

### F-3-5 / reopened F-2-5 — BLOCKING — Scan headings and instructional copy remain vague or metaphorical

**Exact quotes/locations:** practice-desk heading **“Set two points. Hear the middle.”**; instruction **“Mark A and B”**; step heading **“Slow and notice”**; helper **“Pitch stays put”**. The related labels **“03 / THREE MOVES”** and **“A practice tool, not a studio.”** also do not name their sections precisely.

**Why this fails:** a headings list does not reveal that the points are loop boundaries or that playback is being slowed. “Hear the middle,” “notice,” and “stays put” require interpretation instead of naming the result. This unresolved review-2 finding is blocking under the history rule.

**Concrete fix:** use **“Set loop start and end points,” “Set the loop start and end,” “Slow playback without changing pitch,” “Pitch does not change,” “03 / HOW IT WORKS,”** and **“What Loop Lab does not include.”**

### F-3-6 / reopened F-2-6 — BLOCKING — README still exposes implementation jargon and obsolete checkout history

**Exact quotes/location:** README: **“Open the local URL shown by Vite.”**; **“SPA fallback”**; **“Azure Static Web Apps”**; **“IndexedDB”**; **“The product is free while its former paid checkout is unavailable.”**

**Why this fails:** these terms are not explained, and the former checkout is product history rather than a usable instruction. The price sentence also makes the present offer sound temporary. This unresolved review-2 finding is blocking under the history rule.

**Concrete fix:** use **“Open the address printed by the development server.”**; **“Deploy `dist/` to a host that serves `index.html` for app routes. The included configuration file supports Azure Static Web Apps.”**; **“Loop Lab stores audio, the current loop, and saved loops in your browser.”**; and **“Loop Lab is free.”**

### F-3-7 — MINOR — The three required first-screen facts are below the phone fold

**Exact location:** 390 × 844 landing first screen. **“Offline after the first visit”** begins at y=`833` and ends at `854`; the Local and Free facts start at y=`858` and `883`. None is fully visible before scrolling.

**Why this fails:** the first-read job, audience, and action are visible, but the mandatory privacy/offline/price facts are not. The full-width artwork consumes the first 310 px below the header on mobile.

**Concrete fix:** place the copy before the artwork at mobile width, or use a shorter mobile crop after the facts. Add a 390 × 844 assertion that all three fact rows are fully within the viewport.

### F-3-8 — MINOR — Three public claim-like statements have no claims registry entry

**Exact quotes/locations:** landing headline and README opening, **“Make a loop you can practise”** / **“Loop Lab turns a short audio clip into a repeatable practice loop”**; artwork caption, **“Original generated artwork · no sound is bundled”**; boundaries section, **“Loop Lab has no tracks, recording, cloud library, or AI composition.”**

**Why this fails:** `.factory/claims.json` has no entry that proves playback actually repeats between A and B, no entry for the absence of a bundled sound asset, and no entry for the stated scope exclusions. The existing `cards-local` browser test verifies that Play becomes Pause; it does not observe a loop wrapping. The provenance file supports the artwork statement but is not a claim test.

**Concrete fix:** add a `loop-playback` claim whose test observes playback cross the B point and restart at A at least twice. Remove **“no sound is bundled”** from public copy or add a claim that verifies the sample is synthesized locally with no audio asset request. Register and test the scope exclusions, or replace the blanket absence sentence with narrower registered behavior.

### F-3-9 — MINOR — The Apple touch icon is 192 px rather than the required 180 px

**Exact location:** `index.html` links `rel="apple-touch-icon"` to `/icon-192.png`; the live PNG IHDR is 192 × 192.

**Why this fails:** the site-structure contract calls for a 180 px Apple touch icon. Browsers can resize the current asset, but the required metadata asset is not present.

**Concrete fix:** add an original 180 × 180 derivative and point `apple-touch-icon` to it. Add a metadata test that loads the linked image and asserts 180 × 180.

### F-3-10 — MINOR — The Stop control does not name its result

**Exact quote/location:** practice-desk transport button, **“Stop.”**

**Why this fails:** the other transport action says **“Play loop,”** while this action omits its object. Read alone, “Stop” does not say whether it stops playback, tapping, or editing.

**Concrete fix:** rename it **“Stop loop.”** Add the same phrase to its accessible name if the visible label changes independently.

## Copy audit

Counts are whitespace-delimited; hyphenated terms, paths, filenames, and versions count as one word. Symbols are ignored. No item exceeds 22 words, and no banned marketing word appears. Flags cover jargon, inconsistent terms, vague or metaphorical headings, unlisted claims, and action wording.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| LOOP LAB | 2 | — |
| Demo | 1 | — |
| Saved loops | 2 | F-3-1, F-3-4 |
| Privacy | 1 | — |
| LOCAL PRACTICE INSTRUMENT ● OFFLINE-READY | 4 | F-3-2 |
| Make a loop you can practise. | 6 | F-3-8 |
| For new electronic-music makers who want to study one short sound without opening a DAW. | 15 | F-3-3 |
| Try it with sample data | 5 | — |
| Import your audio | 3 | — |
| The demo opens a four-bar beat. | 6 | — |
| Your file stays on this device. | 6 | — |
| Offline after the first visit. | 5 | F-3-7 placement only |
| Local audio never uploads. | 4 | F-3-7 placement only |
| Free with no account. | 4 | F-3-7 placement only |
| A pixel-art sampler with a glowing amber loop waveform. | 9 | — |
| Original generated artwork · no sound is bundled | 7 | F-3-8 |
| 01 / PRACTICE DESK | 3 | — |
| Set two points. | 3 | F-3-5 |
| Hear the middle. | 3 | F-3-5 |
| No clip loaded | 3 | — |
| Load a local audio file to begin. | 7 | — |
| Choose audio | 2 | — |
| Loop start | 2 | — |
| Loop end | 2 | — |
| Play loop | 2 | — |
| Stop | 1 | F-3-10 |
| Speed | 1 | — |
| Pitch stays put | 3 | F-3-5 |
| BPM | 1 | — |
| Tap tempo | 2 | — |
| Practice card name | 3 | F-3-4 |
| e.g. Kick and bass pocket | 5 | F-3-4 |
| What will you listen for? | 5 | — |
| e.g. Where does the bass enter? | 6 | — |
| Save practice card | 3 | F-3-4 |
| 02 / SAVED PRACTICE CARDS | 4 | F-3-4 |
| Reopen a loop where you left it. | 7 | F-3-4 |
| Export cards | 2 | F-3-4 |
| Import cards | 2 | F-3-4 |
| Saved practice cards appear here. | 5 | F-3-4 |
| Save one from the practice desk. | 6 | F-3-4 |
| 03 / THREE MOVES | 3 | F-3-5 |
| Build one useful practice loop. | 5 | — |
| Load a clip | 3 | — |
| Use a file you have permission to use. | 8 | — |
| Mark A and B | 4 | F-3-5 |
| Make a short part that repeats. | 6 | — |
| Slow and notice | 3 | F-3-5 |
| Keep pitch while you listen closely. | 6 | — |
| 04 / BOUNDARIES | 2 | — |
| A practice tool, not a studio. | 6 | F-3-5 |
| Loop Lab has no tracks, recording, cloud library, or AI composition. | 11 | F-3-8 |
| Time-stretch sound quality varies by browser and source audio. | 9 | — |
| Your audio is decoded and played in this browser. | 9 | — |
| It is never sent to a server. | 7 | — |
| Loop Lab is a local audio practice instrument. | 8 | — |
| Privacy · Terms · Built by Param Factory · v1.1.0 | 7 | — |

The table covers the cold landing state, its empty practice desk, headings, actions, labels, alt text, and footer. Generated filenames, time values, BPM values, and user-created card content are data rather than authored sentences.

### README

| Sentence | Words | Flag |
| --- | ---: | --- |
| Loop Lab turns a short audio clip into a repeatable practice loop. | 12 | F-3-8 |
| It is for beginning electronic-music makers who want to listen closely without learning a DAW first. | 16 | F-3-3 |
| It runs in the browser and needs no account. | 9 | — |
| Audio and practice cards stay in this browser and reopen after refresh. | 12 | F-3-4 |
| Exported JSON includes each card's audio. | 6 | F-3-4 |
| The separate sample workspace at `/demo` never reads or writes real loops. | 12 | F-3-4 |
| Imported audio is not uploaded, and Loop Lab uses no analytics or advertising. | 13 | — |
| Slow playback keeps pitch in place. | 6 | — |
| Browser time-stretch quality can vary by source audio. | 8 | — |
| Open the local URL shown by Vite. | 7 | F-3-6 |
| Visit `/demo` for the isolated four-bar sample. | 7 | — |
| The static site is written to `dist/`, with `index.html` at its root. | 12 | F-3-6 |
| Deploy that directory to a static host with SPA fallback enabled; `staticwebapp.config.json` is included for Azure Static Web Apps. | 19 | F-3-6 |
| Audio, the active loop, and practice cards live in IndexedDB. | 10 | F-3-4, F-3-6 |
| Use **Export cards** to make a portable JSON backup and **Import cards** to restore it. | 15 | F-3-4 |
| The product is free while its former paid checkout is unavailable. | 11 | F-3-6 |
| See `/privacy` and `/terms`. | 4 | — |
| Audio clips must be at least 0.05 seconds long. | 9 | — |
| Loop Lab rejects shorter clips and incomplete card exports before they are saved or played. | 15 | F-3-4 |
| MIT. | 1 | — |
| See [LICENSE](LICENSE). | 2 | — |

The README headings **Run**, **Verify and build**, **Data**, and **License** make sense out of context. Shell commands are not prose sentences and are excluded from word counts.

## Demo and sandbox

**PASS.** From a fresh 390 px landing context, **Try it with sample data** opened `/demo` in one click. Without scrolling, the resulting screen displayed the persistent banner, **“Night bus · four-bar beat,”** its 12-second duration, waveform, and A/B cue labels. This is realistic product state, not an empty setup screen.

The banner said exactly **“Demo — sample data, nothing is saved to your real loops.”** The initial database contained only `demo:sample-card`. Saving another demo loop created only a `demo:<uuid>` key. After waiting for the visible **“Demo reset”** status, Reset removed the added loop and restored only `demo:sample-card`. A separate sentinel test confirmed that Reset preserved an existing `real:sentinel` record and that the real workspace rendered it after leaving Demo.

The full demo request log contained only `https://loop-lab.sociobot.in`. No provider key, model endpoint, analytics endpoint, or third-party runtime URL exists in source.

## Claims

All nine commands recorded in `.factory/claims.json` passed verbatim after `npm ci` in the clean requested checkout.

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

The deployed-origin subset for offline reload, demo isolation, audio privacy, and no tracking also passed. The Playwright request log during the live import/save test and independent demo exercise contained only the product origin. The unlisted public claims are reported in F-3-8; therefore the claims gate as a whole is not complete despite every listed command passing.

## History and regression check

I read `.factory/review-2.md`, the full `.factory/handoff.md`, and every `.factory/verification*.md`. No `polish-*` file exists. The current commit adds review-2 documentation only; no product source commit follows that report.

| Earlier item | Live and code confirmation |
| --- | --- |
| `F-2-1` Saved loops and Back routing | **Unfixed; reopened as F-3-1 / F-2-1 BLOCKING.** Reproduced live. The global `a[href^="/"]` interceptor still catches `/#saved`, and `popstate` still calls `route(true)`. |
| `F-2-2` vague “OFFLINE-READY” | **Unfixed; reopened as F-3-2 / F-2-2 BLOCKING.** Exact string remains live and in `src/main.ts`. |
| `F-2-3` unexplained “DAW” | **Unfixed; reopened as F-3-3 / F-2-3 BLOCKING.** Exact strings remain live and in README/source. |
| `F-2-4` saved-loop/card terminology | **Unfixed; reopened as F-3-4 / F-2-4 BLOCKING.** All conflicting terms remain live and in README/source. |
| `F-2-5` vague headings | **Unfixed; reopened as F-3-5 / F-2-5 BLOCKING.** Exact headings remain live and in source. |
| `F-2-6` README jargon and checkout history | **Unfixed; reopened as F-3-6 / F-2-6 BLOCKING.** Exact sentences remain in README. |
| Handoff: short decoded audio must be rejected safely | **Fixed.** `@claim:input-boundaries` passes; code throws `LoopDurationError`; no page error occurs. |
| Handoff: incomplete card files must be rejected atomically | **Fixed.** The parser validates the complete schema before one IndexedDB transaction; the boundary claim passes. |
| Earlier verification: claim commands failed | **Fixed.** All nine current commands pass verbatim. |
| Earlier verification: real loops could not reopen/export | **Fixed.** `cards-local` and `cards-export` pass. |
| Earlier verification: broken paid checkout and forgeable license | **Fixed by removal.** No checkout, license input, entitlement code, or provider endpoint remains. |
| Earlier verification: privacy claims unlisted | **Fixed for audio upload and tracking.** `audio-private` and `no-tracking` are registered and pass; separate unlisted statements remain in F-3-8. |
| Earlier verification: BPM, visible recovery, focus, touch targets, update notice, deletion confirmation | **Fixed.** Full browser suite and live 390 px accessibility test pass. |
| Earlier verification: CSP, caching, canonical metadata, and real HTTP 404 | **Fixed.** Live headers and route checks confirm the repairs. |

## Structure, accessibility, and visual identity

The route and metadata checks pass except F-3-1 and F-3-9:

- `/`, `/demo`, `/privacy`, and `/terms` return 200. A random path returns a designed Loop Lab 404 with HTTP 404 and a route-specific canonical.
- Every checked route has one h1, one main landmark, a route-specific title under 60 characters, description, canonical, Open Graph/Twitter title and description, and the 1200 × 630 product artwork. SVG favicon and touch icon are present; the touch-icon size mismatch is F-3-9.
- The header/footer remain present on every route. Privacy and Terms are linked. All discovered same-origin links returned 200 at the document level; the behavioral fragment failure is F-3-1.
- `robots.txt` and `sitemap.xml` are live and list all four public routes. CSP, HSTS, Referrer Policy, and nosniff headers are live.
- `/opt/fleet/lib/verify-url.sh` passed with zero console/page errors on the landing route. The deployed Playwright axe/touch/overflow/reduced-motion check passed at 1440 × 900 and 390 × 844.
- The dark pixel-sampler artwork, square cobalt instrument panels, amber cues, monospace labels, and hardware-like desk match `.factory/design.md`. The site is visually distinct and is not a generic SaaS template.

## Build and quality evidence

- `npm ci`: PASS; 200 packages audited, no vulnerabilities.
- `npm test`: PASS; 4 unit tests and 8 Chromium tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/` produced, JS 22.12 kB raw / 8.11 kB gzip.
- Live claim subset: PASS for offline reload, demo isolation/no account, and audio privacy/no tracking.
- `git diff --check`: PASS before report authoring.

## Missed leverage

No missing leverage finding. The brief calls for local audio import, A/B looping, tempo/speed control, saved practice items, and data portability; all exist. Export/import is present, and cloud sync would conflict with the current local-only privacy model unless explicitly designed. An AI feature would be decorative for this job, so omitting it is correct. No AI provider key or model endpoint is embedded.

## What would make this perfect

Repair the `/#saved` click and Back restoration first. Then complete the previously requested copy pass: use one saved-item term, expand DAW, replace vague headings and metaphors, remove “OFFLINE-READY,” and make the README describe the current product in reader-facing language. Move the three facts above the phone fold, register or remove the remaining public claims, supply the 180 px touch icon, and rename Stop to Stop loop. Add regression tests for fragment navigation, history restoration, the mobile first-screen facts, actual A/B wraparound, and touch-icon dimensions. A new review should then rerun this entire checklist from a clean state; only zero findings warrants PASS.
