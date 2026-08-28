# Loop Lab verification handoff

## Status: **FAIL — do not release**

Independent verification of candidate `3c475a6bfa3b2b1bc8e8c3061e71c7f3bca65045` at `https://loop-lab.sociobot.in` completed on 2026-08-28 UTC. The deployment exactly matches the candidate artifact, and all mandatory claim commands, clean quality gates, normal flows, offline reload, PWA update behavior, privacy capture, accessibility checks, and bundle budgets passed.

Release is blocked by two input-validation defects:

- **High:** a valid 20 ms WAV is accepted, creates impossible loop range bounds, then throws an uncaught `AudioBufferSourceNode.start()` negative-duration exception when played.
- **Medium:** a JSON card export with the expected format marker but missing required fields is saved and rendered with `NaN` loop/BPM/speed values instead of being rejected.

The full evidence, exact commands, claim matrix, live artifact hashes, and repair steps are in `.factory/verification-3.md`.

## How to verify after repair

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Then run every command in `.factory/claims.json`, test a sub-50 ms decodable WAV and structurally incomplete JSON import in a fresh browser, and repeat the live deployment hash comparison and offline PWA reload.
