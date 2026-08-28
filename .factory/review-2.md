# Adversarial first-read review 2 — FAIL

- Reviewed: 2026-08-28 UTC
- Live origin: `https://loop-lab.sociobot.in`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; clean local install
- Verdict: **FAIL.** `F-2-1` is blocking. Five additional minor copy findings remain, so this is not PASS-adjacent.

## First read

Before scrolling, on both viewports, I understood the product as: make a repeatable practice loop from a short audio clip; it is for new electronic-music makers who want to study a sound without a DAW; click **Try it with sample data** first. At 390 px the action was visible at y=655–703 in the 844 px viewport. This gate passes.

The actual first-screen wording was:

> “Make a loop you can practise.”
>
> “For new electronic-music makers who want to study one short sound without opening a DAW.”
>
> “Try it with sample data”
>
> “The demo opens a four-bar beat.”

## Findings

### F-2-1 — BLOCKING — Saved-loops navigation and back navigation do not reach or restore the saved loops

**Location:** desktop header link **“Saved loops”** (`/#saved`); global internal-link handler in `src/main.ts` lines 383–389.

**Evidence:** On the live 1440 px page, clicking **Saved loops** set the URL to `https://loop-lab.sociobot.in/#saved`, but after 250 ms `scrollY` was `0`, focus was `#page-title`, and `#saved` was at y=`1522.98`. The link did not take the visitor to its named destination. Separately, after scrolling to the saved cards section (y=`1213`), opening Demo, then using the browser Back button, the return page was at y=`0` with focus on `#page-title`; it did not restore the previous scroll position.

**Why it fails:** a returning visitor who chooses the header’s named route for their saved loops gets no visible result. This also fails the required deep-link/back-button route behavior. The click interceptor treats an in-page anchor as a full SPA route, re-renders the landing page, and focuses the headline instead of allowing the fragment navigation.

**Concrete fix:** do not intercept same-document hash anchors. Let `/#saved` perform native fragment scrolling (or explicitly call `document.querySelector('#saved')?.scrollIntoView()` and focus an appropriate destination heading). Store scroll position per history entry and restore it on `popstate`; add a browser regression test for both the header link and Back from `/demo`.

### F-2-2 — MINOR — “OFFLINE-READY” is vague, unregistered claim copy

**Location:** landing eyebrow: **“LOCAL PRACTICE INSTRUMENT ● OFFLINE-READY”**.

**Why it fails:** this is a claim-like promise without the tested condition. `offline-reload` proves **“Works offline after the first visit,”** not the undefined “offline-ready.” A first-time visitor cannot tell whether it works offline now, after caching, or only in the demo.

**Concrete fix:** remove the adjective or replace the entire eyebrow with the exact registered wording, for example: **“WORKS OFFLINE AFTER THE FIRST VISIT.”** The landing fact already contains this clearer sentence, so removal is preferable.

### F-2-3 — MINOR — “DAW” is unexplained first-read jargon

**Location:** landing lede and README opening: **“without opening a DAW”** / **“without learning a DAW first.”**

**Why it fails:** the page says it is for beginners while relying on an unexplained music-production abbreviation. The intended reader may know the problem without knowing this term.

**Concrete fix:** replace both instances with **“without opening music-production software”** and **“without learning music-production software first.”**

### F-2-4 — MINOR — The same saved item has two names

**Location:** header **“Saved loops”**; landing label **“SAVED PRACTICE CARDS”**; heading **“Reopen a loop where you left it.”**; README alternates between “practice cards,” “active loop,” and “card.”

**Why it fails:** the user saves one thing but is asked to navigate to another. This makes the otherwise useful save/reopen feature harder to scan, and the broken header link amplifies the uncertainty.

**Concrete fix:** choose one noun. For example, use **“saved loops”** in the header, section heading, buttons, empty state, and README; reserve “card” only for the exported JSON record if it is technically necessary.

### F-2-5 — MINOR — Two headings do not explain themselves in a headings list

**Location:** **“Set two points. Hear the middle.”** and step **“Slow and notice.”**

**Why it fails:** neither says what the points are nor what is being slowed. A screen-reader headings list, or a visitor scanning section labels, loses the action.

**Concrete fix:** use **“Set loop start and end points.”** and **“Slow playback without changing pitch.”** The latter is already a tested product behavior (`pitch-speed`).

### F-2-6 — MINOR — README exposes implementation jargon and an irrelevant checkout history

**Location:** README: **“Open the local URL shown by Vite.”**; **“Deploy that directory to a static host with SPA fallback enabled; `staticwebapp.config.json` is included for Azure Static Web Apps.”**; **“Audio, the active loop, and practice cards live in IndexedDB.”**; **“The product is free while its former paid checkout is unavailable.”**

**Why it fails:** Vite, SPA fallback, Azure Static Web Apps, and IndexedDB are unexplained implementation terms. “Former paid checkout” is product-history language that gives a newcomer no useful instruction and makes the current price unclear.

**Concrete fix:** rewrite as: **“Open the address printed by the development server.”** **“Deploy `dist/` to a host that serves `index.html` for app routes. Azure Static Web Apps can use the included configuration file.”** **“Loop Lab stores audio, the current loop, and saved loops in your browser.”** **“Loop Lab is free.”**

## Copy audit

Word counts treat a hyphenated term, URL, version, and file name as one word. No prose sentence exceeds 22 words. The table includes all static landing prose and independently read labels/buttons/headings; dynamic values such as BPM options and time readouts are excluded. `Flag` links to a finding above.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| LOCAL PRACTICE INSTRUMENT ● OFFLINE-READY | 4 | F-2-2 |
| Make a loop you can practise. | 6 | — |
| For new electronic-music makers who want to study one short sound without opening a DAW. | 15 | F-2-3 |
| Try it with sample data | 5 | — |
| Import your audio | 3 | — |
| The demo opens a four-bar beat. | 6 | — |
| Your file stays on this device. | 6 | — |
| Offline after the first visit. | 5 | — |
| Local audio never uploads. | 4 | — |
| Free with no account. | 4 | — |
| Original generated artwork · no sound is bundled | 7 | — |
| Set two points. | 4 | F-2-5 |
| Hear the middle. | 3 | F-2-5 |
| No clip loaded | 3 | — |
| Load a local audio file to begin. | 7 | — |
| Choose audio | 2 | — |
| Loop start | 2 | — |
| Loop end | 2 | — |
| Play loop | 2 | — |
| Stop | 1 | — |
| Pitch stays put | 3 | — |
| Tap tempo | 2 | — |
| Practice card name | 3 | F-2-4 |
| What will you listen for? | 5 | — |
| Save practice card | 3 | F-2-4 |
| Reopen a loop where you left it. | 7 | F-2-4 |
| Export cards | 2 | F-2-4 |
| Import cards | 2 | F-2-4 |
| Saved practice cards appear here. | 5 | F-2-4 |
| Save one from the practice desk. | 6 | F-2-4 |
| Build one useful practice loop. | 5 | — |
| Load a clip | 3 | — |
| Use a file you have permission to use. | 8 | — |
| Mark A and B | 4 | F-2-5 |
| Make a short part that repeats. | 7 | — |
| Slow and notice | 3 | F-2-5 |
| Keep pitch while you listen closely. | 7 | — |
| A practice tool, not a studio. | 7 | — |
| Loop Lab has no tracks, recording, cloud library, or AI composition. | 10 | — |
| Time-stretch sound quality varies by browser and source audio. | 9 | — |
| Your audio is decoded and played in this browser. | 10 | — |
| It is never sent to a server. | 8 | — |
| Loop Lab is a local audio practice instrument. | 8 | — |

The header’s **“Saved loops”** adds the F-2-4 terminology conflict and is the broken control in F-2-1. The `Demo`, `Privacy`, `Terms`, and skip-link labels are clear result/destination names.

### README

| Sentence | Words | Flag |
| --- | ---: | --- |
| Loop Lab turns a short audio clip into a repeatable practice loop. | 12 | — |
| It is for beginning electronic-music makers who want to listen closely without learning a DAW first. | 16 | F-2-3 |
| It runs in the browser and needs no account. | 9 | — |
| Audio and practice cards stay in this browser and reopen after refresh. | 11 | F-2-4 |
| Exported JSON includes each card’s audio. | 6 | F-2-4 |
| The separate sample workspace at `/demo` never reads or writes real loops. | 11 | — |
| Imported audio is not uploaded, and Loop Lab uses no analytics or advertising. | 12 | — |
| Slow playback keeps pitch in place. | 6 | — |
| Browser time-stretch quality can vary by source audio. | 8 | — |
| Open the local URL shown by Vite. | 7 | F-2-6 |
| Visit `/demo` for the isolated four-bar sample. | 7 | — |
| The static site is written to `dist/`, with `index.html` at its root. | 11 | F-2-6 |
| Deploy that directory to a static host with SPA fallback enabled; `staticwebapp.config.json` is included for Azure Static Web Apps. | 17 | F-2-6 |
| Audio, the active loop, and practice cards live in IndexedDB. | 9 | F-2-6 |
| Use **Export cards** to make a portable JSON backup and **Import cards** to restore it. | 15 | F-2-4 |
| The product is free while its former paid checkout is unavailable. | 10 | F-2-6 |
| See `/privacy` and `/terms`. | 4 | — |
| Audio clips must be at least 0.05 seconds long. | 9 | — |
| Loop Lab rejects shorter clips and incomplete card exports before they are saved or played. | 14 | F-2-4 |
| MIT. | 1 | — |
| See [LICENSE](LICENSE). | 2 | — |

## Demo and sandbox

**PASS.** From a fresh 390 px context, **Try it with sample data** opened `/demo` in one click. Once the sample synthesis completed, the first product screen showed the usable desk with **“Night bus · four-bar beat”** and the realistic seeded **“Kick + bass pocket”** practice item. The persistent banner said exactly **“Demo — sample data, nothing is saved to your real loops.”**

In browser storage, the demo contained only `demo:sample-card`; no real workspace record was read or written. After saving an extra demo item and clicking **Reset demo**, the extra item was gone and the single seeded card remained. The live full test also confirmed Start for real cannot see a saved demo card. This is a real sandbox, not a visual mock.

## Claims, privacy, and offline behavior

**PASS.** I ran `npm ci` in this clean checkout, then ran every exact command in `.factory/claims.json`. All nine passed. The complete eight-test browser suite also passed against the deployed origin (`PLAYWRIGHT_BASE_URL=https://loop-lab.sociobot.in npm run test:e2e`).

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

The test coverage exercises offline reload after service-worker control, demo/real namespace separation, same-origin-only requests during import/save, local-card export/import, and invalid-input recovery. F-2-2 is the sole unlisted claim-like landing phrase found in the live copy.

## Earlier findings and regression check

I read `.factory/handoff.md` and all earlier independent reports in `.factory/verification*.md`. No `review-*` or `polish-*` files exist in this checkout.

| Earlier finding | Current confirmation |
| --- | --- |
| Earlier claim commands failed / offline test was weak | Fixed: all nine current exact claim commands pass; browser test performs the offline reload. |
| Saved real loops could not be reopened; no export/import | Fixed: live suite imported audio, saved/reloaded/reopened it, then exported and re-imported its audio. |
| Broken paid checkout / forgeable entitlement | Fixed by removal: no paid offer, checkout, license input, or entitlement path appears in the live product or current source. |
| Privacy and tracking promises were unlisted | Fixed: `audio-private` and `no-tracking` are registered and exercise same-origin request capture. |
| Invalid BPM / invisible recovery / small targets / delete without confirmation / update notice | Fixed: live suite covers BPM clamping, visible status, 44 px controls, native delete confirmation, and visible update status. |
| Short 20 ms audio crashed playback | Fixed: `input-boundaries` rejects it before the desk or playback. |
| Incomplete card exports created broken cards | Fixed: `input-boundaries` proves a mixed valid/incomplete import is rejected atomically. |

F-2-1 is a newly observed regression/omission, not a merely marked-fixed earlier item.

## Structure, metadata, and visual check

Everything below passes except the routing behavior in F-2-1:

- `/`, `/demo`, `/privacy`, `/terms`, `/manifest.webmanifest`, `robots.txt`, and `sitemap.xml` returned 200; a random unknown path returned a styled HTTP 404.
- Each route had the expected title pattern, one h1, description, canonical URL, OG/Twitter metadata, favicon, `lang=en`, and a main landmark. Demo and legal routes move focus to their h1 on route change.
- Header/footer are present across routes with Privacy and Terms. Discovered same-origin links resolve; the Saved-loops destination is the behavioral exception described above.
- The live suite’s axe check passed at 1440 px and 390 px with no serious or critical issue. It also checked touch size, no horizontal overflow, first-tab skip link, console errors, and reduced motion.
- The pixel/demoscene sampler art, square instrument controls, dark palette, and waveform desk match `.factory/design.md`; this is not a generic SaaS template.

## Missed leverage

No missing core capability found. The brief implies local import, A/B looping, tempo/speed control, saved loops, and export/import; all are present and exercised. An AI feature would be decorative here, and no provider key or unnecessary AI surface is present.

## What would make this perfect

Repair the saved-loops fragment and history behavior first. Then make the small copy changes above: use one name for saved items, expand DAW, replace vague headings, remove “OFFLINE-READY,” and make README wording describe the current product rather than its implementation or former checkout. Re-run the full route/history regression alongside all claim commands; only a zero-finding pass meets this review’s standard.
