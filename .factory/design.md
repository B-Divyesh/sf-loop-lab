# Loop Lab visual system

## Thesis

**Pixel/demoscene practice bench.** Loop Lab should feel like a compact piece of music hardware discovered at midnight, not a production suite. The scene gives a beginner permission to touch controls: visible cue points, chunky transport controls, and a waveform that reads like a playable object.

## Tokens

| Role | Token | Colour |
| --- | --- | --- |
| Night field | `--ink` | `#07111f` |
| Raised panel | `--panel` | `#102541` |
| Paper/display | `--paper` | `#eef7e9` |
| Quiet ink | `--muted` | `#b9cad2` |
| Cobalt trace | `--blue` | `#5c7cfa` |
| Cue amber | `--amber` | `#ffc857` |
| Ready mint | `--mint` | `#79e0bf` |
| Warning coral | `--coral` | `#ff8c7a` |

Type is a compact system monospace stack for instruments and numbers, paired with the self-hosted local `Arial`/system sans stack for reading. The lack of a downloaded font keeps the instrument immediate offline. Spacing uses an 8px base. Borders are 2px cobalt or paper, with square corners and small inset shadows; controls have a 44px minimum target.

The dark, deliberate treatment is the primary and only theme: a dim studio surface prevents visual glare while working with audio. Text uses paper or mint on ink and is contrast-safe.

## Interaction and motion

Cue changes flash an amber edge once; playhead motion follows audio time. This is the only continuous movement and it stops with audio. With `prefers-reduced-motion`, the playhead updates without transition and decorative scan lines remain still. The illustration does not animate.

## Asset plan and provenance

`assets/src/loop-lab-hero.png` is an original factory-generated illustration. It shows a compact sampler, amber waveform and cobalt grid, with no text or brands. Generated 2026-08-28 with Azure AI Foundry deployment `factory-image`, prompt in `assets/src/loop-lab-hero.png.json`; reviewed for unwanted text, logos and artifacts. Its production WebP (`public/loop-lab-hero.webp`, 121 KB) and social crop (`public/og-loop-lab.webp`) are compressed derivatives. Product SVG icons are hand-authored.
