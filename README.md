# Loop Lab

Loop Lab turns a short audio clip into a repeatable practice loop. It is for beginning electronic-music makers who want to listen closely without learning a DAW first.

It runs in the browser, stores practice cards locally, and offers a separate sample workspace at `/demo`. Import audio you have permission to use. Audio files stay on your device. Browser time-stretch quality can vary by source audio.

## Run

```sh
npm install
npm run dev
```

Open the local URL shown by Vite. Visit `/demo` for the isolated four-bar sample.

## Verify and build

```sh
npm test
npm run build
```

The static site is written to `dist/`, with `index.html` at its root. Deploy that directory to a static host with SPA fallback enabled; `staticwebapp.config.json` is included for Azure Static Web Apps.

## Data and purchase

Practice cards live in IndexedDB in this browser. The free app includes local cards and core looping. Loop Lab Plus is an optional $9 one-time license for unlimited local cards and WAV loop export. See `/privacy` and `/terms`.

## License

MIT. See [LICENSE](LICENSE).
