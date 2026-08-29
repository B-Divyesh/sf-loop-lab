# Demo sandbox

Open `/?demo=1` (or `/demo`) to enter the sample workspace. It synthesizes an eight-second, four-bar beat at 120 BPM in the browser and is available after the app shell is cached.

The banner states **Demo — sample data, nothing is saved to your real data**. Reset demo removes only IndexedDB records prefixed `demo:` and reseeds one sample saved loop. Start for real discards the demo namespace before changing to the normal namespace (`real:`). Demo mode never reads or writes real saved loops or the real active workspace.
