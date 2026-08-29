# Adversarial first-read review 4 — FAIL

- Reviewed: 2026-08-29 UTC
- Live origin: `https://loop-lab.sociobot.in`
- Reviewed commit: `a94ad9a5a8d8379475761c99445b5730baf2779a`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; a separate clean local clone for claim commands
- Verdict: **FAIL.** All ten unresolved findings in review 3 remain present. Per the review history rule, every one is blocking again. There are no failing registered claim tests, but the site cannot pass while its named navigation is broken and its public copy remains inconsistent and partly unregistered.

## First read before scrolling

This gate passes at both sizes. On first view I understood: this makes a repeatable practice loop from a short audio clip; it is for beginning electronic-music makers; click **Try it with sample data** first. The action opened the demo in one click.

The exact first-screen text was:

> “Make a loop you can practise.”
>
> “For new electronic-music makers who want to study one short sound without opening a DAW.”
>
> “Try it with sample data”
>
> “The demo opens a four-bar beat.”

At 390 × 844, the action was fully visible at y=655–703. The unexplained “DAW” is still a blocking copy finding below, but it did not prevent identifying the audience or first action.

## Findings

### F-4-1 / reopened F-3-1 / F-2-1 — BLOCKING — Saved loops navigation and Back do not restore the destination

**Location:** header **“Saved loops”** (`/#saved`), and the click and `popstate` handlers in `src/main.ts` lines 383–391.

**Evidence:** On the live desktop page, `#saved` is at document y=1522.98. Clicking **Saved loops** changed the URL to `/#saved`, but after 500 ms `scrollY` was 0 and focus was `#page-title`. A cold live address-bar load of `/#saved` also left `scrollY` at 0. Separately, after scrolling to y=1213, opening Demo, and using Back, the landing page returned at y=0 with focus on `#page-title`. The source intercepts every root-relative link, calls `history.pushState`, rerenders, and then focuses the h1; it has no fragment or saved-scroll handling.

**Why a visitor is lost:** the named Saved loops navigation produces no visible result, and Back discards the visitor’s place.

**Concrete fix:** do not intercept same-document fragment links. Let native fragment navigation run, or scroll to and focus `#saved-heading` explicitly. Save scroll/focus state in each history entry and restore it on `popstate`. Add browser coverage for a header click, cold `/#saved`, and Back from `/demo` after visiting the saved section.

### F-4-2 / reopened F-3-2 / F-2-2 — BLOCKING — “OFFLINE-READY” is vague and does not use the registered claim

**Location:** landing eyebrow: **“LOCAL PRACTICE INSTRUMENT ● OFFLINE-READY”**.

**Why a visitor is misled:** it does not say whether offline use works immediately or only after caching. The registered, tested wording is “Works offline after the first visit.”

**Concrete fix:** remove **“OFFLINE-READY”**. The landing fact can state the exact tested condition: **“Works offline after the first visit.”**

### F-4-3 / reopened F-3-3 / F-2-3 — BLOCKING — “DAW” is unexplained beginner-facing jargon

**Locations:** landing **“without opening a DAW”**; README **“without learning a DAW first.”**

**Why a visitor is lost:** the stated audience is beginners, but the page requires them to know an unexplained music-production abbreviation.

**Concrete fix:** use **“without opening music-production software”** on the landing page and **“without learning music-production software first”** in the README.

### F-4-4 / reopened F-3-4 / F-2-4 — BLOCKING — One saved object has several names

**Locations:** **“Saved loops,” “SAVED PRACTICE CARDS,” “Reopen a loop where you left it,” “Save practice card,” “Export cards,”** and **“Import cards.”** README also alternates among “practice cards,” “active loop,” “card,” and “real loops.”

**Why a visitor is lost:** it is unclear whether a loop, practice card, and saved loop are the same saved item.

**Concrete fix:** use **saved loop** throughout the visitor-facing UI and README: **Save loop**, **Saved loops**, **Export loops**, **Import loops**, and **Saved loops appear here.** Reserve “card” for a versioned file-schema document only if needed.

### F-4-5 / reopened F-3-5 / F-2-5 — BLOCKING — Headings and instructions remain vague or metaphorical

**Locations:** **“Set two points. Hear the middle.”**, **“Mark A and B”**, **“Slow and notice”**, **“Pitch stays put”**, **“03 / THREE MOVES”**, and **“A practice tool, not a studio.”**

**Why a visitor is lost:** these do not identify loop boundaries, slowed playback, or what the section contains when scanned as headings.

**Concrete fix:** use **“Set loop start and end points,” “Set the loop start and end,” “Slow playback without changing pitch,” “Pitch does not change,” “03 / HOW IT WORKS,”** and **“What Loop Lab does not include.”**

### F-4-6 / reopened F-3-6 / F-2-6 — BLOCKING — README contains implementation jargon and obsolete checkout history

**Locations:** **“Open the local URL shown by Vite,” “SPA fallback,” “Azure Static Web Apps,” “IndexedDB,”** and **“The product is free while its former paid checkout is unavailable.”**

**Why a visitor is lost:** Vite, SPA fallback, Azure Static Web Apps, and IndexedDB are not user instructions. The former-checkout sentence is irrelevant history and makes the current price sound temporary.

**Concrete fix:** write **“Open the address printed by the development server.”** Write deployment detail for operators separately. Replace the storage sentence with **“Loop Lab stores audio, the current loop, and saved loops in your browser.”** Replace the price sentence with **“Loop Lab is free.”**

### F-4-7 / reopened F-3-7 — BLOCKING — Required privacy, offline, and price facts are below the phone fold

**Location:** 390 × 844 landing first screen.

**Evidence:** the three fact rows occupy y=832.91–853.91, y=857.91–878.91, and y=882.91–903.91. None is wholly visible before scrolling. The 390 px screenshot confirms that the large artwork appears before the eyebrow and consumes the upper half of the first screen.

**Why a visitor is lost:** the action is visible, but the mandatory first-screen facts are not available during the fast phone decision the page is intended to support.

**Concrete fix:** put copy and all three facts before the artwork at mobile width, or use a much shorter mobile art crop. Add a 390 × 844 regression assertion that every fact row is inside the viewport.

### F-4-8 / reopened F-3-8 — BLOCKING — Public claims remain absent from `.factory/claims.json`

**Locations:** landing/README **“Make a loop you can practise”** / **“Loop Lab turns a short audio clip into a repeatable practice loop”**; landing **“The demo opens a four-bar beat”**; artwork caption **“Original generated artwork · no sound is bundled”**; boundaries **“Loop Lab has no tracks, recording, cloud library, or AI composition”**; landing/README **“Time-stretch sound quality varies by browser and source audio.”**

**Why a visitor is misled:** none has its own listed claim with an observable sandbox test. The existing `pitch-speed` unit test covers pitch preservation, not a loop wrapping from B to A. The existing demo test proves entry and isolation but does not assert a four-bar sample. Provenance documentation is not a claim test, and the absence/sound-quality statements are not testable through the current registry.

**Concrete fix:** add a `loop-playback` claim that observes two B-to-A wraps; add a demo-sample claim that observes the seeded four-bar state; add an asset/request test for the no-bundled-sound statement if it remains. Either register observable scope guarantees or replace/remove the blanket scope sentence. Remove the subjective time-stretch-quality statement unless a useful, observable test can support it.

### F-4-9 / reopened F-3-9 — BLOCKING — The required 180 px Apple touch icon is absent

**Location:** `index.html` links `rel="apple-touch-icon"` to `/icon-192.png`; the live asset is 192 × 192.

**Why this fails:** the site-structure contract requires a 180 px Apple touch icon. Browser resampling does not supply the required asset.

**Concrete fix:** add an original 180 × 180 derivative, point the `apple-touch-icon` link at it, and test the linked PNG dimensions.

### F-4-10 / reopened F-3-10 — BLOCKING — “Stop” does not name the result

**Location:** practice-desk transport button **“Stop.”**

**Why a visitor is lost:** read alone, it does not say whether it stops playback, tempo tapping, or editing. The adjacent action says **“Play loop.”**

**Concrete fix:** rename it **“Stop loop”** and keep that visible phrase in its accessible name.

## Copy audit

Counts are whitespace-delimited; hyphenated terms, paths, filenames, and versions count as one word. The audit includes all authored landing text, headings, labels, button text, and alt text. Values entered by a visitor and changing time/BPM values are data, not static sentences. No item exceeds 22 words. Flags point to the finding that requires a rewrite or change.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| LOOP LAB | 2 | — |
| Demo | 1 | — |
| Saved loops | 2 | F-4-1, F-4-4 |
| Privacy | 1 | — |
| LOCAL PRACTICE INSTRUMENT ● OFFLINE-READY | 4 | F-4-2 |
| Make a loop you can practise. | 6 | F-4-8 |
| For new electronic-music makers who want to study one short sound without opening a DAW. | 15 | F-4-3 |
| Try it with sample data | 5 | — |
| Import your audio | 3 | — |
| The demo opens a four-bar beat. | 6 | F-4-8 |
| Your file stays on this device. | 6 | — |
| Offline after the first visit | 5 | F-4-7 placement |
| Local audio never uploads | 4 | F-4-7 placement |
| Free with no account | 4 | F-4-7 placement |
| A pixel-art sampler with a glowing amber loop waveform. | 9 | — |
| Original generated artwork · no sound is bundled | 7 | F-4-8 |
| 01 / PRACTICE DESK | 3 | — |
| Set two points. | 3 | F-4-5 |
| Hear the middle. | 3 | F-4-5 |
| No clip loaded | 3 | — |
| Load a local audio file to begin. | 7 | — |
| Choose audio | 2 | — |
| Loop start | 2 | — |
| Loop end | 2 | — |
| Play loop | 2 | — |
| Stop | 1 | F-4-10 |
| Speed | 1 | — |
| Pitch stays put | 3 | F-4-5 |
| BPM | 1 | — |
| Tap tempo | 2 | — |
| Practice card name | 3 | F-4-4 |
| e.g. Kick and bass pocket | 5 | F-4-4 |
| What will you listen for? | 5 | — |
| e.g. Where does the bass enter? | 6 | — |
| Save practice card | 3 | F-4-4 |
| 02 / SAVED PRACTICE CARDS | 4 | F-4-4 |
| Reopen a loop where you left it. | 7 | F-4-4 |
| Export cards | 2 | F-4-4 |
| Import cards | 2 | F-4-4 |
| Saved practice cards appear here. | 5 | F-4-4 |
| Save one from the practice desk. | 6 | F-4-4 |
| 03 / THREE MOVES | 3 | F-4-5 |
| Build one useful practice loop. | 5 | — |
| Load a clip | 3 | — |
| Use a file you have permission to use. | 8 | — |
| Mark A and B | 4 | F-4-5 |
| Make a short part that repeats. | 6 | — |
| Slow and notice | 3 | F-4-5 |
| Keep pitch while you listen closely. | 6 | F-4-5 |
| 04 / BOUNDARIES | 2 | — |
| A practice tool, not a studio. | 6 | F-4-5 |
| Loop Lab has no tracks, recording, cloud library, or AI composition. | 11 | F-4-8 |
| Time-stretch sound quality varies by browser and source audio. | 9 | F-4-8 |
| Your audio is decoded and played in this browser. | 9 | — |
| It is never sent to a server. | 7 | — |
| Loop Lab is a local audio practice instrument. | 8 | — |
| Privacy · Terms · Built by Param Factory · v1.1.0 | 7 | — |

### README

| Sentence | Words | Flag |
| --- | ---: | --- |
| Loop Lab turns a short audio clip into a repeatable practice loop. | 12 | F-4-8 |
| It is for beginning electronic-music makers who want to listen closely without learning a DAW first. | 16 | F-4-3 |
| It runs in the browser and needs no account. | 9 | — |
| Audio and practice cards stay in this browser and reopen after refresh. | 12 | F-4-4 |
| Exported JSON includes each card's audio. | 6 | F-4-4 |
| The separate sample workspace at `/demo` never reads or writes real loops. | 12 | F-4-4 |
| Imported audio is not uploaded, and Loop Lab uses no analytics or advertising. | 13 | — |
| Slow playback keeps pitch in place. | 6 | — |
| Browser time-stretch quality can vary by source audio. | 8 | F-4-8 |
| Open the local URL shown by Vite. | 7 | F-4-6 |
| Visit `/demo` for the isolated four-bar sample. | 7 | F-4-8 |
| The static site is written to `dist/`, with `index.html` at its root. | 12 | F-4-6 |
| Deploy that directory to a static host with SPA fallback enabled; `staticwebapp.config.json` is included for Azure Static Web Apps. | 19 | F-4-6 |
| Audio, the active loop, and practice cards live in IndexedDB. | 10 | F-4-4, F-4-6 |
| Use **Export cards** to make a portable JSON backup and **Import cards** to restore it. | 15 | F-4-4 |
| The product is free while its former paid checkout is unavailable. | 11 | F-4-6 |
| See `/privacy` and `/terms`. | 4 | — |
| Audio clips must be at least 0.05 seconds long. | 9 | — |
| Loop Lab rejects shorter clips and incomplete card exports before they are saved or played. | 15 | F-4-4 |
| MIT. | 1 | — |
| See [LICENSE](LICENSE). | 2 | — |

The README headings **Run**, **Verify and build**, **Data**, and **License** are clear out of context. Shell commands are excluded because they are not prose sentences.

## Demo and sandbox

**PASS.** In a fresh 390 px context, **Try it with sample data** opened `/demo` in one click. Before scrolling, the page showed the persistent banner, **“Night bus · four-bar beat,”** duration, waveform, cue labels, editable controls, and the seeded **“Kick + bass pocket”** saved item. This is an already-used product state rather than an empty setup screen.

The banner says exactly **“Demo — sample data, nothing is saved to your real loops.”** Independent IndexedDB inspection found that a real sentinel was retained while a saved demo card used a `demo:` key. Reset removed the added demo key and left `demo:sample-card` plus the untouched `real:sentinel` key. Demo source and storage code filter all reads and writes by the `demo:` or `real:` namespace. The live demo request log contained only `https://loop-lab.sociobot.in`; no provider key, analytics endpoint, or third-party runtime request was observed.

## Claims and quality checks

**Registered claims: PASS.** I made a separate clean clone at the requested commit, ran `npm ci`, then ran every exact command in `.factory/claims.json`. The combined command sequence exited 0.

| Claim id | Exact command | Result |
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

The claim tests use a fresh browser context for offline reload, demo/real separation, local persistence, request capture, card export/import, and boundary recovery. The privacy request test records imports and saves and asserts same-origin requests only. The unlisted live-copy promises in F-4-8 mean the claims gate is not complete despite all listed tests passing.

Additional local checks: `npm test` passed (4 unit and 8 browser tests); `npm run typecheck`, `npm run lint`, and `npm run build` passed; `dist/` was produced. The build reports 22.12 kB raw / 8.11 kB gzip JavaScript and 10.88 kB raw / 3.10 kB gzip CSS.

## History and regression check

I read `.factory/review-2.md`, `.factory/review-3.md`, every `.factory/verification*.md`, and the full `.factory/handoff.md`. No `polish-*.md` file exists. The checked-out source still contains the strings and handlers cited below.

| Earlier finding | Live and code confirmation |
| --- | --- |
| F-2-1 / F-3-1 Saved loops and Back routing | **Unfixed; reopened as F-4-1 BLOCKING.** |
| F-2-2 / F-3-2 vague “OFFLINE-READY” | **Unfixed; reopened as F-4-2 BLOCKING.** |
| F-2-3 / F-3-3 unexplained “DAW” | **Unfixed; reopened as F-4-3 BLOCKING.** |
| F-2-4 / F-3-4 inconsistent saved-item names | **Unfixed; reopened as F-4-4 BLOCKING.** |
| F-2-5 / F-3-5 vague headings | **Unfixed; reopened as F-4-5 BLOCKING.** |
| F-2-6 / F-3-6 README jargon and checkout history | **Unfixed; reopened as F-4-6 BLOCKING.** |
| F-3-7 phone-fold facts | **Unfixed; reopened as F-4-7 BLOCKING.** |
| F-3-8 unlisted public claims | **Unfixed; reopened as F-4-8 BLOCKING.** |
| F-3-9 180 px touch icon | **Unfixed; reopened as F-4-9 BLOCKING.** |
| F-3-10 ambiguous Stop control | **Unfixed; reopened as F-4-10 BLOCKING.** |
| Earlier short-audio and malformed-card repair | **Fixed.** `input-boundaries` passes and code validates before playback/persistence. |
| Earlier local reopen/export and failed claim commands | **Fixed.** `cards-local`, `cards-export`, and every listed claim command pass. |
| Earlier checkout/entitlement defect | **Fixed by removal.** No checkout, license input, entitlement path, or payment-provider endpoint is present. |
| Earlier privacy/tracking, focus, target-size, CSP/cache, 404 defects | **Fixed.** Same-origin request tests, the browser accessibility suite, live headers, and the designed HTTP 404 confirm the repairs. |

## Structure, accessibility, and visual identity

Other than F-4-1 and F-4-9, these checks pass:

- `/`, `/demo`, `/privacy`, and `/terms` returned 200; a non-existent path returned the designed HTTP 404.
- Each route had one h1, one main landmark, `lang="en"`, a route-specific title, description, canonical, Open Graph/Twitter metadata, favicon, and product-owned social art. `robots.txt`, `sitemap.xml`, manifest, favicon, icon, and OG art returned 200. The Apple touch icon is the exception in F-4-9.
- The header/footer are consistent and include Privacy and Terms. All discovered same-origin links returned 200; the fragment control still fails behaviorally as F-4-1.
- Live CSP, HSTS, Referrer Policy, and `X-Content-Type-Options` headers were present. Cold-load console output had no errors.
- The existing Playwright axe integration passed serious/critical checks at desktop and 390 px. It also passed touch-target, overflow, metadata, and console checks. The pixel sampler artwork, cobalt square panels, amber cues, and compact hardware treatment match `.factory/design.md` and are distinct from a generic SaaS template.

## Missed leverage

No additional leverage finding. The brief’s import, A/B loop, tempo/speed control, local saved items, and export/import are implemented. Cloud sync would conflict with the local-only promise unless deliberately designed. An AI feature would be decorative for this audio-practice job, and no provider key or model endpoint is embedded.

## What would make this perfect

Repair fragment navigation and history restoration first. Then use one saved-item term, expand DAW, replace vague headings, remove “OFFLINE-READY,” and rewrite README instructions in reader language. Put the three facts above the mobile fold. Register or remove every remaining public claim, supply the 180 px touch icon, and rename Stop to Stop loop. Add regression tests for fragment navigation, Back restoration, mobile fact placement, A/B wraparound, demo sample state, and Apple-touch dimensions. A new clean review must find zero findings before this can be PASS.
