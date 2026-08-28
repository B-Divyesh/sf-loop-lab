import "./style.css";
import { LoopPlayer } from "./audio";
import {
  clearCards,
  clearWorkspace,
  listCards,
  loadWorkspace,
  makeId,
  removeCard,
  saveCard,
  saveWorkspace,
} from "./store";
import type { ClipState, LoopCard, StoredClip } from "./types";

const player = new LoopPlayer();
let clip: ClipState | null = null;
let cards: LoopCard[] = [];
let taps: number[] = [];
const demo = () => location.pathname === "/demo" || location.search.includes("demo=1");
const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;
const fmt = (value: number) => `${Math.floor(value / 60)}:${(value % 60).toFixed(1).padStart(4, "0")}`;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function appShell(body: string) {
  return `<header class="site-head"><a class="wordmark" href="/" aria-label="Loop Lab home"><span aria-hidden="true">▣</span> LOOP LAB</a><nav aria-label="Primary"><a href="/demo">Demo</a><a href="/#saved">Saved loops</a><a href="/privacy">Privacy</a></nav></header>${body}<footer><p>Loop Lab is a local audio practice instrument.</p><p><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · Built by Param Factory · v1.1.0</p></footer><div class="status-message" role="status" aria-live="polite" hidden></div>`;
}

function setMetadata(title: string, description: string, path: string) {
  document.title = title;
  const canonical = new URL(path, "https://loop-lab.sociobot.in").href;
  $("link[rel='canonical']").setAttribute("href", canonical);
  $("meta[name='description']").setAttribute("content", description);
  $("meta[property='og:title']").setAttribute("content", title);
  $("meta[property='og:description']").setAttribute("content", description);
  $("meta[name='twitter:title']").setAttribute("content", title);
  $("meta[name='twitter:description']").setAttribute("content", description);
}

function renderLanding() {
  setMetadata("Loop Lab — Practice short audio loops", "Make a repeatable practice loop from a short audio clip.", "/");
  $("#app").innerHTML = appShell(
    `<main id="main"><section class="hero" aria-labelledby="page-title"><div class="hero-copy"><p class="eyebrow">LOCAL PRACTICE INSTRUMENT <span>●</span> OFFLINE-READY</p><h1 id="page-title" tabindex="-1">Make a loop you can practise.</h1><p class="lede">For new electronic-music makers who want to study one short sound without opening a DAW.</p><div class="hero-actions"><a class="button primary" href="/demo">Try it with sample data</a><label class="file-button">Import your audio<input id="hero-file" type="file" accept="audio/*" /></label></div><p class="action-note">The demo opens a four-bar beat. Your file stays on this device.</p><ul class="facts"><li><b>Offline</b> after the first visit</li><li><b>Local</b> audio never uploads</li><li><b>Free</b> with no account</li></ul></div><figure class="hero-art"><img src="/loop-lab-hero.webp" width="1536" height="1024" alt="A pixel-art sampler with a glowing amber loop waveform." fetchpriority="high" decoding="async" /><figcaption>Original generated artwork · no sound is bundled</figcaption></figure></section><section class="desk-section" aria-labelledby="desk-heading"><div class="section-label">01 / PRACTICE DESK</div><h2 id="desk-heading">Set two points. Hear the middle.</h2><div id="desk"></div></section><section id="saved" class="saved-section" aria-labelledby="saved-heading"><div class="saved-heading-row"><div><div class="section-label">02 / SAVED PRACTICE CARDS</div><h2 id="saved-heading">Reopen a loop where you left it.</h2></div><div class="data-actions"><button class="button secondary" id="export-cards">Export cards</button><label class="file-button small">Import cards<input id="import-cards" type="file" accept="application/json,.json" /></label></div></div><div id="cards"></div></section><section class="how" aria-labelledby="how-heading"><div><div class="section-label">03 / THREE MOVES</div><h2 id="how-heading">Build one useful practice loop.</h2></div><ol><li><b>Load a clip</b><span>Use a file you have permission to use.</span></li><li><b>Mark A and B</b><span>Make a short part that repeats.</span></li><li><b>Slow and notice</b><span>Keep pitch while you listen closely.</span></li></ol></section><section class="limits" aria-labelledby="limits-heading"><div><div class="section-label">04 / BOUNDARIES</div><h2 id="limits-heading">A practice tool, not a studio.</h2></div><div><p>Loop Lab has no tracks, recording, cloud library, or AI composition.</p><p>Time-stretch sound quality varies by browser and source audio.</p><p>Your audio is decoded and played in this browser. It is never sent to a server.</p></div></section></main>`,
  );
  $("#hero-file").addEventListener("change", fileChange);
  $("#export-cards").addEventListener("click", exportCards);
  $("#import-cards").addEventListener("change", importCards);
  renderDesk();
  renderCards();
  void restoreRealWorkspace();
}

async function restoreRealWorkspace() {
  cards = await listCards();
  const workspace = await loadWorkspace();
  if (workspace) {
    try {
      await loadStoredClip(workspace.clip);
      player.start = workspace.start;
      player.end = workspace.end;
      player.position = workspace.start;
      player.speed = workspace.speed;
      renderDesk(workspace.bpm);
    } catch {
      announce("The saved audio could not be reopened. Import the audio again.", true);
    }
  }
  renderCards();
}

function renderDemo() {
  setMetadata("Demo — Loop Lab", "Try Loop Lab with a separate four-bar sample workspace.", "/demo");
  $("#app").innerHTML = appShell(
    `<main id="main"><div class="demo-banner" role="status"><span><b>Demo</b> — sample data, nothing is saved to your real loops.</span><button id="reset-demo">Reset demo</button><a href="/">Start for real</a></div><section class="demo-heading"><p class="eyebrow">DEMO / FOUR-BAR PRACTICE BEAT</p><h1 id="page-title" tabindex="-1">Repeat one small pattern.</h1><p>Try the cue points, speed, and note. This sample exists only in the demo workspace.</p></section><section class="desk-section demo-desk"><div id="desk"></div></section><section id="saved" class="saved-section" aria-labelledby="saved-heading"><div class="section-label">SAVED PRACTICE CARDS</div><h2 id="saved-heading">Come back to a loop with a reason.</h2><div id="cards"></div></section></main>`,
  );
  $("#reset-demo").addEventListener("click", async () => {
    player.stop();
    await clearCards();
    await clearWorkspace();
    await seedDemo();
    announce("Demo reset. The four-bar sample is ready.");
  });
  renderDesk();
  void seedDemo();
}

async function seedDemo() {
  const duration = await player.loadSample();
  clip = { name: "Night bus · four-bar beat", duration, source: "sample" };
  cards = await listCards();
  if (!cards.length) {
    const card: LoopCard = { id: "sample-card", name: "Kick + bass pocket", note: "Listen for where the bass waits after each kick.", start: 1, end: 3, bpm: 120, speed: 0.75, createdAt: Date.now(), clip };
    await saveCard(card);
    cards = [card];
  }
  renderDesk();
  renderCards();
}

async function fileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) await loadRealFile(file);
}

async function loadRealFile(file: File) {
  try {
    const duration = await player.loadFile(file);
    clip = { name: file.name.replace(/\.[^/.]+$/, ""), duration, source: "file", audio: file };
    await persistWorkspace(120);
    renderDesk();
    $("#desk").scrollIntoView({ behavior: "smooth", block: "start" });
    announce(`${file.name} loaded. Set A and B, then press play.`);
  } catch {
    announce("The browser could not read that audio file. Try WAV, MP3, or M4A.", true);
  }
}

async function loadStoredClip(stored: StoredClip) {
  if (stored.source === "sample") await player.loadSample();
  else {
    if (!stored.audio) throw new Error("missing audio");
    await player.loadBlob(stored.audio);
  }
  clip = stored;
}

async function persistWorkspace(bpm: number) {
  if (!clip || demo()) return;
  await saveWorkspace({ clip, start: player.start, end: player.end, speed: player.speed, bpm: clamp(bpm, 30, 300) });
}

function renderDesk(initialBpm = 120) {
  const root = $("#desk");
  const has = Boolean(clip);
  const max = clip?.duration ?? 8;
  const start = has ? player.start : 0;
  const end = has ? player.end : 4;
  const bpm = clamp(initialBpm, 30, 300);
  root.innerHTML = `<div class="desk ${has ? "ready" : "empty"}"><div class="clip-strip"><div><span class="status-dot" aria-hidden="true"></span><b>${has ? escapeHtml(clip!.name) : "No clip loaded"}</b><small>${has ? `${fmt(clip!.duration)} total · ${clip!.source === "sample" ? "sample audio" : "local file"}` : "Load a local audio file to begin."}</small></div><label class="file-button small">${has ? "Replace audio" : "Choose audio"}<input id="desk-file" type="file" accept="audio/*" /></label></div><div class="wave-wrap" aria-label="Loop range from ${fmt(start)} to ${fmt(end)}"><div class="wave" aria-hidden="true">${Array.from({ length: 42 }, (_, index) => `<i class="bar-${(index * 7 + 3) % 9}"></i>`).join("")}</div><div class="range-label a">A ${fmt(start)}</div><div class="range-label b">B ${fmt(end)}</div></div><div class="ranges"><label>Loop start <output id="start-out">${fmt(start)}</output><input id="start" type="range" min="0" max="${max}" step="0.05" value="${start}" ${has ? "" : "disabled"} /></label><label>Loop end <output id="end-out">${fmt(end)}</output><input id="end" type="range" min="0.05" max="${max}" step="0.05" value="${end}" ${has ? "" : "disabled"} /></label></div><div class="controls"><button class="transport" id="play" ${has ? "" : "disabled"} aria-label="Play loop">▶ <span>Play loop</span></button><button class="transport pale" id="stop" ${has ? "" : "disabled"}>■ <span>Stop</span></button><label class="speed">Speed <select id="speed" ${has ? "" : "disabled"}><option value="0.5" ${player.speed === 0.5 ? "selected" : ""}>50%</option><option value="0.75" ${player.speed === 0.75 ? "selected" : ""}>75%</option><option value="1" ${player.speed === 1 ? "selected" : ""}>100%</option></select><small>Pitch stays put</small></label><div class="bpm"><label for="bpm">BPM</label><output id="bpm-output">${bpm}</output><button id="tap" type="button" ${has ? "" : "disabled"}>Tap tempo</button><input id="bpm" type="number" min="30" max="300" value="${bpm}" ${has ? "" : "disabled"} /></div></div><form class="card-form" id="card-form"><div><label for="card-name">Practice card name</label><input id="card-name" required maxlength="42" placeholder="e.g. Kick and bass pocket" ${has ? "" : "disabled"} /></div><div><label for="card-note">What will you listen for?</label><input id="card-note" required maxlength="140" placeholder="e.g. Where does the bass enter?" ${has ? "" : "disabled"} /></div><button class="button primary" ${has ? "" : "disabled"}>Save practice card</button></form></div>`;
  $("#desk-file").addEventListener("change", fileChange);
  if (!has) return;
  const startEl = $("#start") as HTMLInputElement;
  const endEl = $("#end") as HTMLInputElement;
  const speedEl = $("#speed") as HTMLSelectElement;
  const bpmEl = $("#bpm") as HTMLInputElement;
  const normalizedBpm = () => clamp(Number(bpmEl.value) || 120, 30, 300);
  const commitBpm = () => {
    const value = normalizedBpm();
    bpmEl.value = String(value);
    $("#bpm-output").textContent = String(value);
    void persistWorkspace(value);
  };
  const updateRange = () => {
    player.start = clamp(Number(startEl.value), 0, player.end - 0.05);
    player.end = clamp(Number(endEl.value), player.start + 0.05, max);
    startEl.value = String(player.start);
    endEl.value = String(player.end);
    $("#start-out").textContent = fmt(player.start);
    $("#end-out").textContent = fmt(player.end);
    $(".wave-wrap").setAttribute("aria-label", `Loop range from ${fmt(player.start)} to ${fmt(player.end)}`);
    void persistWorkspace(normalizedBpm());
  };
  startEl.addEventListener("input", updateRange);
  endEl.addEventListener("input", updateRange);
  speedEl.addEventListener("change", () => { player.speed = Number(speedEl.value); void persistWorkspace(normalizedBpm()); });
  bpmEl.addEventListener("input", () => { $("#bpm-output").textContent = String(normalizedBpm()); });
  bpmEl.addEventListener("change", commitBpm);
  bpmEl.addEventListener("blur", commitBpm);
  $("#play").addEventListener("click", async () => {
    if (await player.play()) {
      $("#play").innerHTML = "Ⅱ <span>Pause loop</span>";
      $("#play").setAttribute("aria-label", "Pause loop");
      $("#play").addEventListener("click", () => { player.pause(); renderDesk(normalizedBpm()); }, { once: true });
    }
  });
  $("#stop").addEventListener("click", () => { player.stop(); renderDesk(normalizedBpm()); });
  $("#tap").addEventListener("click", () => {
    const now = performance.now();
    taps = [...taps.filter((tap) => now - tap < 3500), now];
    if (taps.length > 1) {
      const intervals = taps.slice(1).map((tap, index) => tap - taps[index]);
      const nextBpm = clamp(Math.round(60000 / (intervals.reduce((sum, value) => sum + value, 0) / intervals.length)), 30, 300);
      bpmEl.value = String(nextBpm);
      commitBpm();
    }
  });
  $("#card-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = ($("#card-name") as HTMLInputElement).value.trim();
    const note = ($("#card-note") as HTMLInputElement).value.trim();
    if (!name || !note || !clip) return;
    const card: LoopCard = { id: makeId(), name, note, start: player.start, end: player.end, bpm: normalizedBpm(), speed: Number(speedEl.value), createdAt: Date.now(), clip };
    await saveCard(card);
    await persistWorkspace(card.bpm);
    cards = await listCards();
    renderCards();
    announce(`Saved ${name}.`);
    location.hash = "saved";
  });
}

function renderCards() {
  const root = document.querySelector<HTMLElement>("#cards");
  if (!root) return;
  root.innerHTML = cards.length
    ? `<ul class="cards">${cards.map((card) => `<li><button class="card-open" data-open="${card.id}"><b>${escapeHtml(card.name)}</b><span>${fmt(card.start)}—${fmt(card.end)} · ${clamp(card.bpm, 30, 300)} BPM · ${Math.round(card.speed * 100)}%</span><em>${escapeHtml(card.note)}</em></button><button class="delete" data-delete="${card.id}" aria-label="Delete ${escapeHtml(card.name)}">×</button></li>`).join("")}</ul>`
    : `<p class="empty-copy">Saved practice cards appear here. Save one from the practice desk.</p>`;
  root.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((button) => button.addEventListener("click", () => {
    const card = cards.find((item) => item.id === button.dataset.open);
    if (card) void applyCard(card);
  }));
  root.querySelectorAll<HTMLButtonElement>("[data-delete]").forEach((button) => button.addEventListener("click", async () => {
    const card = cards.find((item) => item.id === button.dataset.delete);
    if (!card || !confirm(`Delete “${card.name}”? This cannot be undone.`)) return;
    await removeCard(card.id);
    cards = await listCards();
    renderCards();
    announce(`Deleted ${card.name}.`);
  }));
}

async function applyCard(card: LoopCard) {
  try {
    if (card.clip) await loadStoredClip(card.clip);
    else if (demo()) await loadStoredClip({ name: "Night bus · four-bar beat", duration: 12, source: "sample" });
    else throw new Error("legacy card");
    player.start = card.start;
    player.end = card.end;
    player.position = card.start;
    player.speed = card.speed;
    await persistWorkspace(card.bpm);
    renderDesk(card.bpm);
    announce(`${card.name} loaded into the practice desk.`);
    $("#desk").scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {
    announce("This older card has no saved audio. Import its audio again.", true);
  }
}

type PortableCard = Omit<LoopCard, "clip"> & { clip?: Omit<StoredClip, "audio"> & { audioBase64?: string; audioType?: string } };

async function exportCards() {
  const portable: PortableCard[] = await Promise.all(cards.map(async ({ clip: cardClip, ...card }) => ({
    ...card,
    clip: cardClip ? {
      name: cardClip.name,
      duration: cardClip.duration,
      source: cardClip.source,
      audioBase64: cardClip.audio ? arrayBufferToBase64(await cardClip.audio.arrayBuffer()) : undefined,
      audioType: cardClip.audio?.type,
    } : undefined,
  })));
  const blob = new Blob([JSON.stringify({ format: "loop-lab-cards", version: 1, cards: portable }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "loop-lab-cards.json";
  link.click();
  URL.revokeObjectURL(link.href);
  announce(`Exported ${cards.length} practice ${cards.length === 1 ? "card" : "cards"}.`);
}

async function importCards(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text()) as { format?: string; cards?: PortableCard[] };
    if (parsed.format !== "loop-lab-cards" || !Array.isArray(parsed.cards)) throw new Error("format");
    for (const portable of parsed.cards) {
      if (!portable.id || !portable.name || !portable.note) throw new Error("card");
      const storedClip = portable.clip ? {
        name: portable.clip.name,
        duration: portable.clip.duration,
        source: portable.clip.source,
        audio: portable.clip.audioBase64 ? new Blob([base64ToArrayBuffer(portable.clip.audioBase64)], { type: portable.clip.audioType || "audio/wav" }) : undefined,
      } : undefined;
      await saveCard({ ...portable, clip: storedClip });
    }
    cards = await listCards();
    renderCards();
    announce(`Imported ${parsed.cards.length} practice ${parsed.cards.length === 1 ? "card" : "cards"}.`);
  } catch {
    announce("That file is not a Loop Lab card export. Choose a Loop Lab JSON file.", true);
  } finally {
    input.value = "";
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  return btoa(binary);
}

function base64ToArrayBuffer(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
}

function announce(message: string, error = false) {
  const element = document.querySelector<HTMLElement>(".status-message");
  if (!element) return;
  element.textContent = message;
  element.hidden = false;
  element.classList.toggle("error", error);
}

function escapeHtml(value: string) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function simplePage(kind: "privacy" | "terms" | "404") {
  const page = kind === "privacy"
    ? { title: "Privacy — Loop Lab", h1: "Your audio stays on this device.", description: "How Loop Lab stores audio and practice cards in your browser.", text: "Loop Lab stores audio and practice cards in your browser. Imported audio is decoded only here and is not uploaded. We do not use analytics or advertising. Export your cards before clearing browser site data." }
    : kind === "terms"
      ? { title: "Terms — Loop Lab", h1: "Use audio you have permission to use.", description: "Terms for using the local Loop Lab practice tool.", text: "Loop Lab is a free local practice tool. You are responsible for having permission to use imported audio. Time-stretch sound quality depends on your browser and source audio." }
      : { title: "Page not found — Loop Lab", h1: "That loop does not exist.", description: "This address is not part of Loop Lab.", text: "The page address is not part of Loop Lab. Return to the practice desk to make or replay a loop." };
  setMetadata(page.title, page.description, kind === "404" ? location.pathname : `/${kind}`);
  $("#app").innerHTML = appShell(`<main id="main" class="legal"><p class="eyebrow">LOOP LAB / ${kind.toUpperCase()}</p><h1 id="page-title" tabindex="-1">${page.h1}</h1><p>${page.text}</p><a class="button primary" href="/">Open the practice desk</a></main>`);
}

function route(focusHeading = true) {
  player.stop();
  clip = null;
  cards = [];
  const path = location.pathname;
  if (path === "/demo" || location.search.includes("demo=1")) renderDemo();
  else if (path === "/privacy") simplePage("privacy");
  else if (path === "/terms") simplePage("terms");
  else if (path !== "/") simplePage("404");
  else renderLanding();
  if (focusHeading) setTimeout(() => document.querySelector<HTMLElement>("#page-title")?.focus(), 0);
}

document.addEventListener("click", (event) => {
  const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="/"]');
  if (anchor && !anchor.hasAttribute("download")) {
    event.preventDefault();
    history.pushState({}, "", anchor.href);
    route(true);
  }
});
window.addEventListener("popstate", () => route(true));
window.addEventListener("looplab:update", () => announce("An update is ready. Reload when you finish this loop."));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) window.dispatchEvent(new Event("looplab:update"));
        });
      });
    });
  });
}

route(false);
