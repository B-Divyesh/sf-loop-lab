# Loop Lab handoff

## Delivered

- A local-first, installable PWA for importing an audio clip, setting A/B loop points, tapping or typing BPM, and replaying a loop at 50%, 75%, or 100% speed.
- The player uses overlapping Web Audio grains at natural playback rate, while changing source position per grain. This slows the loop without the ordinary playback-rate pitch drop. Sound quality can vary by browser and source audio.
- Local IndexedDB practice cards, with a name and listening note. `/demo` has a synthesized four-bar practice beat, its own `demo:` storage namespace, Reset demo, and Start for real.
- Pixel/demoscene visual system, PWA manifest, service worker cache, original generated hero artwork, privacy/terms/404 routes, social metadata, sitemap, headers configuration, and optional $9 Sociobot license flow for unlimited local cards.

## Verification

- `npm test` — passed: 4 tests, including the three claims and the offline shell claim.
- `npm run build` — passed. `dist/index.html` is at the deploy root. Main JS is 6.74 KB gzip and main CSS is 2.89 KB gzip.
- Playwright smoke test at 390×844: demo title and sample card rendered, no console errors, and axe had no serious or critical issues.
- Production-preview offline check: after the service worker gains control, `/demo` reloads with the network disabled and renders `Repeat one small pattern.`
- Lighthouse desktop run recorded LCP 1.2 s and accessibility 100. Its Chrome tab crashed during the full-page screenshot phase, so its performance/CLS score (81/0.323) is not considered a stable measurement. The demo now renders a reserved empty desk before sample synthesis to avoid that async layout shift; re-run Lighthouse in deployment CI.

## Known gaps / next steps

- The checkout and license restoration/verification contract is wired for the factory registration. The current paid tier adds only unlimited local cards.
- Granular browser time stretching is intentionally modest. Long ambient clips and extreme slowdowns may produce audible grain texture.
