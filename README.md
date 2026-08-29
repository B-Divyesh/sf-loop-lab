# Loop Lab

Loop Lab creates a repeatable practice loop from a short audio file. It is for beginning electronic-music makers who want to study a short passage without learning music-production software first.

It runs in your browser and needs no account. Saved loops reopen in this browser after refresh. Imported audio is not uploaded. Loop Lab uses no analytics or advertising. Slow playback keeps pitch in place.

## Try the sample

Open `/?demo=1` for a four-bar sample beat. The banner marks the separate demo workspace. Reset demo restores its sample. Start for real discards demo changes.

## Run

```sh
npm ci
npm run dev
```

Open the address printed by the development server.

## Test and build

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

The production site is written to `dist/`, with `index.html` at its root.

## Deployment

Deploy `dist/` to a static host that serves `index.html` for app routes. The included `staticwebapp.config.json` configures Azure Static Web Apps.

## Data and price

Loop Lab stores audio, the current loop, and saved loops in your browser. Use **Export loops** for a portable JSON backup and **Import loops** to restore it. Loop Lab is free. See `/privacy` and `/terms`.

Audio files must be at least 0.05 seconds long. Loop Lab rejects shorter audio and incomplete saved-loop exports before saving or playback.

## License

MIT. See [LICENSE](LICENSE).
