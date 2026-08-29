# Adversarial first-read review 6 — PASS

- Reviewed: 2026-08-29 UTC
- Live origin: `https://loop-lab.sociobot.in`
- Reviewed commit: `d5d6562f737efa5a2afe5009651a839eda4cd01b`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; separate clean clone for claim commands
- Verdict: **PASS.** No blocking or minor findings remain, and no public product claim is untested.

## First read before scrolling

On both viewports, the first screen answers all three questions. In my own words: Loop Lab turns a short audio file into a repeatable practice loop; it is for beginning electronic-music makers who do not want to learn music-production software first; click **Try it with sample data** first.

The exact copy that supplied those answers was:

> “Create a repeatable audio practice loop.”
>
> “For beginning electronic-music makers who want to study a short passage without music-production software.”
>
> “Try it with sample data”
>
> “Loads a four-bar beat.”

At 390 × 844, the headline begins at y=`140`, the primary action at y=`345`, its explanation at y=`465`, and all three offline/privacy/price facts end by y=`568`. The desktop screen also contains all of them before the fold. A fresh normal browser context produced no console or page errors.

## Findings

None.

## Copy audit

Counts are whitespace-delimited; standalone symbols are ignored, while hyphenated terms, paths, filenames, and versions count as one word. The landing table includes sentences, headings, labels, actions, placeholders, navigation, footer copy, and image alternative text so short interface fragments are not hidden from the audit. Dynamic filenames, visitor-entered text, time values, and BPM values are data rather than authored copy.

No item exceeds 22 words. No banned marketing adjective, unexplained jargon, inconsistent product term, vague or metaphorical heading, or non-result-naming action remains.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| LOOP LAB | 2 | — |
| Demo | 1 | — |
| Saved loops | 2 | — |
| Privacy | 1 | — |
| LOCAL AUDIO PRACTICE | 3 | — |
| Create a repeatable audio practice loop. | 6 | — |
| For beginning electronic-music makers who want to study a short passage without music-production software. | 14 | — |
| Try it with sample data | 5 | — |
| Import your audio | 3 | — |
| Loads a four-bar beat. | 4 | — |
| Works offline after the first visit. | 6 | — |
| Imported audio is not uploaded. | 5 | — |
| Free with no account. | 4 | — |
| A pixel-art sampler with a glowing amber loop waveform. | 9 | — |
| 01 / PRACTICE DESK | 3 | — |
| Set loop start and end points. | 6 | — |
| No audio loaded | 3 | — |
| Load a local audio file to begin. | 7 | — |
| Choose audio | 2 | — |
| Replace audio | 2 | — |
| Loop start | 2 | — |
| Loop end | 2 | — |
| Play loop | 2 | — |
| Pause loop | 2 | — |
| Stop loop | 2 | — |
| Speed | 1 | — |
| Pitch does not change | 4 | — |
| BPM | 1 | — |
| Tap tempo | 2 | — |
| Saved loop name | 3 | — |
| e.g. Kick and bass pocket | 5 | — |
| What will you listen for? | 5 | — |
| e.g. Where does the bass enter? | 6 | — |
| Save loop | 2 | — |
| 02 / SAVED LOOPS | 3 | — |
| Reopen a saved loop. | 4 | — |
| Export loops | 2 | — |
| Import loops | 2 | — |
| Saved loops appear here. | 4 | — |
| Save one from the practice desk. | 6 | — |
| 03 / HOW IT WORKS | 4 | — |
| Make one useful practice loop. | 5 | — |
| Load an audio file | 4 | — |
| Use a file you have permission to use. | 8 | — |
| Set the loop start and end | 6 | — |
| Select the passage to repeat. | 5 | — |
| Slow playback without changing pitch | 5 | — |
| Listen closely at a pace that helps. | 7 | — |
| 04 / PRIVACY AND LIMITS | 4 | — |
| Your audio stays in your browser. | 6 | — |
| Saved loops reopen in this browser after refresh. | 8 | — |
| Export saved loops before clearing browser data. | 7 | — |
| Loop Lab is a local audio practice instrument. | 8 | — |
| Terms | 1 | — |
| Built by Param Factory | 4 | — |
| v1.2.0 | 1 | — |

### README

| Sentence | Words | Flag |
| --- | ---: | --- |
| Loop Lab creates a repeatable practice loop from a short audio file. | 12 | — |
| It is for beginning electronic-music makers who want to study a short passage without learning music-production software first. | 18 | — |
| It runs in your browser and needs no account. | 9 | — |
| Saved loops reopen in this browser after refresh. | 8 | — |
| Imported audio is not uploaded. | 5 | — |
| Loop Lab uses no analytics or advertising. | 7 | — |
| Slow playback keeps pitch in place. | 6 | — |
| Open `/?demo=1` for a four-bar sample beat. | 7 | — |
| The banner marks the separate demo workspace. | 7 | — |
| Reset demo restores its sample. | 5 | — |
| Start for real discards demo changes. | 6 | — |
| Open the address printed by the development server. | 8 | — |
| The production site is written to `dist/`, with `index.html` at its root. | 12 | — |
| Deploy `dist/` to a static host that serves `index.html` for app routes. | 12 | — |
| The included `staticwebapp.config.json` configures Azure Static Web Apps. | 8 | — |
| Loop Lab stores audio, the current loop, and saved loops in your browser. | 13 | — |
| Use **Export loops** for a portable JSON backup and **Import loops** to restore it. | 14 | — |
| Loop Lab is free. | 4 | — |
| See `/privacy` and `/terms`. | 4 | — |
| Audio files must be at least 0.05 seconds long. | 9 | — |
| Loop Lab rejects shorter audio and incomplete saved-loop exports before saving or playback. | 13 | — |
| MIT. | 1 | — |
| See [LICENSE](LICENSE). | 2 | — |

README headings **Try the sample**, **Run**, **Test and build**, **Deployment**, **Data and price**, and **License** name their sections. Commands are excluded because they are not prose sentences.

### Terminology

| Concept | Visitor-facing term |
| --- | --- |
| Saved practice object | saved loop |
| Visitor input | audio file |
| Selected repeated part | passage / loop |
| Trial workspace | demo |
| Portable backup | saved-loop export |

## Demo and sandbox

**PASS.** In a fresh 390 px context, **Try it with sample data** opened `/?demo=1` in one click. The first post-click screen already showed the persistent **“Demo — sample data, nothing is saved to your real data”** banner, the named **“Night bus · four-bar beat”** sample, its `0:08.0` duration, waveform, A/B positions, and enabled controls. The seeded **“Kick + bass pocket”** saved loop was present below the controls.

After saving **“Demo edit”**, Reset removed it and restored the one seeded saved loop; the visible completion message was **“Demo reset. The four-bar sample is ready.”** A `real:sentinel` saved before entry remained available after **Start for real**, while all `demo:` records were gone. Re-entering Demo produced only its seed. The complete flow made requests only to `https://loop-lab.sociobot.in`, and the live offline-reload test reopened the sample after Chromium was taken offline.

## Claims

Every exact command in `.factory/claims.json` passed separately after `npm ci` in clean clone `/tmp/loop-lab-review6.pLi9m0`.

| Claim id | Exact command | Result |
| --- | --- | --- |
| `loop-playback` | `npm run test:unit -- -t @claim:loop-playback` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `demo-isolated` | `npm run test:e2e -- --grep @claim:demo-isolated` | PASS |
| `demo-four-bars` | `npm run test:e2e -- --grep @claim:demo-four-bars` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| `cards-local` | `npm run test:e2e -- --grep @claim:cards-local` | PASS |
| `audio-private` | `npm run test:e2e -- --grep @claim:audio-private` | PASS |
| `no-tracking` | `npm run test:e2e -- --grep @claim:no-tracking` | PASS |
| `loops-export` | `npm run test:e2e -- --grep @claim:loops-export` | PASS |
| `pitch-speed` | `npm run test:unit -- -t @claim:pitch-speed` | PASS |
| `input-boundaries` | `npm run test:e2e -- --grep @claim:input-boundaries` | PASS |

The landing and README claim cross-check found no unlisted product promise:

| Public statement | Registry coverage |
| --- | --- |
| Creates a repeatable practice loop | `loop-playback` |
| Loads an eight-second, 120 BPM four-bar sample | `demo-four-bars` |
| Works offline after the first visit | `offline-reload` |
| Demo and real data remain separate; leaving discards demo changes | `demo-isolated` |
| Free practice tool needs no account | `no-account` |
| Saved loops reopen after refresh | `cards-local` |
| Imported audio is not uploaded / stays in the browser | `audio-private` |
| No analytics or advertising | `no-tracking` |
| Exports and imports saved loops with audio | `loops-export` |
| Slow playback does not change pitch | `pitch-speed` |
| Rejects clips below 0.05 seconds and incomplete exports | `input-boundaries` |

README build/deployment statements are operator instructions rather than product promises; `npm run build` independently produced `dist/` as documented.

## History and regression check

I read every `.factory/review-*.md`, `.factory/polish-*.md`, and the existing handoff. Each earlier finding was checked in the live site and current code.

| Earlier finding | Round 6 confirmation |
| --- | --- |
| F-2-1 / F-3-1 / F-4-1 / F-5-1: Saved-loops navigation and Back | **Fixed.** Live test reaches and focuses `#saved-heading`; cold deep link and Back restore scroll/focus. |
| F-2-2 / F-3-2 / F-4-2 / F-5-2: vague “OFFLINE-READY” | **Fixed.** Removed; the exact tested offline condition appears in the facts. |
| F-2-3 / F-3-3 / F-4-3 / F-5-3: unexplained “DAW” | **Fixed.** Landing and README use “music-production software.” |
| F-2-4 / F-3-4 / F-4-4 / F-5-4: inconsistent saved-item names | **Fixed.** Visitor-facing copy consistently uses “saved loop.” |
| F-2-5 / F-3-5 / F-4-5 / F-5-5: vague headings/instructions | **Fixed.** Headings now name loop boundaries, how it works, slowed playback, and privacy/limits. |
| F-2-6 / F-3-6 / F-4-6 / F-5-6: README jargon/history | **Fixed.** Reader instructions are plain; current operator details sit under Deployment; obsolete checkout history is gone. |
| F-3-7 / F-4-7 / F-5-7: phone-fold facts | **Fixed.** All three fact rows are fully visible by y=`568` at 390 × 844. |
| F-3-8 / F-4-8 / F-5-8: unlisted claims | **Fixed.** Unsupported copy was removed; loop and sample claims were added; all 11 registry commands pass. |
| F-3-9 / F-4-9 / F-5-9: Apple touch icon size | **Fixed.** The linked live PNG decodes at 180 × 180. |
| F-3-10 / F-4-10 / F-5-10: ambiguous Stop label | **Fixed.** Visible and accessible text is “Stop loop.” |
| F-5-11: demo edits survived exit | **Fixed.** Exit clears only the `demo:` namespace; live sentinel testing confirms real data remains untouched. |
| F-5-12: skip link named the wrong destination | **Fixed.** “Skip to main content” focuses `#main`; the browser regression passes. |

Earlier non-review repairs also remain intact: short-audio rejection, atomic malformed-import rejection, local audio reopen/export, BPM clamping, visible recovery, delete confirmation, service-worker update status, security headers, and the designed HTTP 404 all pass current tests or direct live checks.

## Structure, accessibility, and visual identity

**PASS.** `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200. A random unknown route returns the designed Loop Lab page with HTTP 404. Each route has one h1, one main landmark, `lang="en"`, the required title pattern, a route-specific description and canonical, Open Graph/Twitter metadata, favicon, consistent header/footer, and Privacy/Terms links. The product social image is 1200 × 630; the Apple icon is 180 × 180.

The discovered product links all resolve. `robots.txt`, `sitemap.xml`, the manifest, service worker, favicon, icons, hero image, and social image return 200. Live response headers include CSP with `frame-ancestors 'none'`, HSTS, Referrer Policy, and `X-Content-Type-Options`.

The full live Playwright suite reports no serious or critical axe issue at desktop or 390 px, no undersized interactive target, no horizontal overflow, and no normal-route console error. Keyboard skip, route focus, reduced motion, deep links, and Back behavior pass. The pixel sampler artwork, amber waveform cues, cobalt grid, square hardware controls, and dark practice-desk layout match `.factory/design.md` and do not resemble a generic SaaS template.

## Quality evidence

- `npm test`: PASS — 7 unit/static tests and 10 Chromium tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS — `dist/` produced; initial JavaScript is 23.99 kB raw / 8.58 kB gzip.
- `PLAYWRIGHT_BASE_URL=https://loop-lab.sociobot.in npm run test:e2e`: PASS — all 10 live browser tests.
- `/opt/fleet/lib/verify-url.sh https://loop-lab.sociobot.in /tmp/loop-lab-review6-verify`: PASS — title, language, h1, main, image alternatives, labels, and console checks.

## Missed leverage

No finding. The brief's local import, A/B loop points, BPM/tap control, pitch-preserving slower playback, local saved loops, and portable import/export are present. Cloud sync would contradict the current local-only privacy promise unless the product were intentionally redesigned. An AI step does not remove a meaningful task in this focused practice workflow and would be decorative; there is no provider key or AI endpoint in the product.

## What would make this perfect

Nothing remains to change from this review. Preserve the current clean-context claim suite, phone-fold assertion, request logging, demo-exit isolation test, and route/history regression whenever the product changes.
