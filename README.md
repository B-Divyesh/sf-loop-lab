# Loop Lab

Loop Lab turns a short audio clip into a repeatable practice loop. It is for beginning electronic-music makers who want to listen closely without learning a DAW first.

It runs in the browser and needs no account. Audio and practice cards stay in this browser and reopen after refresh. Exported JSON includes each card's audio. The separate sample workspace at `/demo` never reads or writes real loops. Imported audio is not uploaded, and Loop Lab uses no analytics or advertising. Slow playback keeps pitch in place. Browser time-stretch quality can vary by source audio.

## Run

```sh
npm ci
npm run dev
```

Open the local URL shown by Vite. Visit `/demo` for the isolated four-bar sample.

## Verify and build

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

The static site is written to `dist/`, with `index.html` at its root. Deploy that directory to a static host with SPA fallback enabled; `staticwebapp.config.json` is included for Azure Static Web Apps.

## Data

Audio, the active loop, and practice cards live in IndexedDB. Use **Export cards** to make a portable JSON backup and **Import cards** to restore it. The product is free while its former paid checkout is unavailable. See `/privacy` and `/terms`.

## License

MIT. See [LICENSE](LICENSE).
