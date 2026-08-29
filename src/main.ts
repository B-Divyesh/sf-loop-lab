import "./style.css";
import { LoopDurationError, LoopPlayer, MIN_LOOP_DURATION } from "./audio";
import {
  clearDemoData,
  listCards,
  loadWorkspace,
  makeId,
  removeCard,
  saveCard,
  saveCards,
  saveWorkspace,
} from "./store";
import type { ClipState, LoopCard, StoredClip } from "./types";

const player = new LoopPlayer();
let clip: ClipState | null = null;
let cards: LoopCard[] = [];
let taps: number[] = [];
const demo = () => location.pathname === "/demo" || new URLSearchParams(location.search).get("demo") === "1";
let renderedDemo = demo();
let routeVersion = 0;
let lastLandmarkFocusId: string | undefined;
const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;
const fmt = (value: number) => `${Math.floor(value / 60)}:${(value % 60).toFixed(1).padStart(4, "0")}`;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function appShell(body: string) {
  return `<header class="site-head"><a class="wordmark" href="/" aria-label="Loop Lab home"><span aria-hidden="true">▣</span> LOOP LAB</a><nav aria-label="Primary"><a href="/?demo=1">Demo</a><a href="/#saved">Saved loops</a><a href="/privacy">Privacy</a></nav></header>${body}<footer><p>Loop Lab is a local audio practice instrument.</p><p><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · Built by Param Factory · v1.2.0</p></footer><div class="status-message" role="status" aria-live="polite" hidden></div>`;
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

function renderLanding(version: number) {
  setMetadata("Loop Lab — Practice short audio loops", "Create a repeatable practice loop from a short audio clip.", "/");
  $("#app").innerHTML = appShell(
    `<main id="main" tabindex="-1"><section class="hero" aria-labelledby="page-title"><div class="hero-copy"><p class="eyebrow">LOCAL AUDIO PRACTICE</p><h1 id="page-title" tabindex="-1">Create a repeatable audio practice loop.</h1><p class="lede">For beginning electronic-music makers who want to study a short passage without music-production software.</p><div class="hero-actions"><a class="button primary" href="/?demo=1">Try it with sample data</a><label class="file-button">Import your audio<input id="hero-file" type="file" accept="audio/*" /></label></div><p class="action-note">Loads a four-bar beat.</p><ul class="facts"><li>Works offline after the first visit.</li><li>Imported audio is not uploaded.</li><li>Free with no account.</li></ul></div><figure class="hero-art"><img src="/loop-lab-hero.webp" width="1536" height="1024" alt="A pixel-art sampler with a glowing amber loop waveform." fetchpriority="high" decoding="async" /></figure></section><section class="desk-section" aria-labelledby="desk-heading"><div class="section-label">01 / PRACTICE DESK</div><h2 id="desk-heading">Set loop start and end points.</h2><div id="desk"></div></section><section id="saved" class="saved-section" aria-labelledby="saved-heading"><div class="saved-heading-row"><div><div class="section-label">02 / SAVED LOOPS</div><h2 id="saved-heading" tabindex="-1">Reopen a saved loop.</h2></div><div class="data-actions"><button class="button secondary" id="export-cards">Export loops</button><label class="file-button small">Import loops<input id="import-cards" type="file" accept="application/json,.json" /></label></div></div><div id="cards"></div></section><section class="how" aria-labelledby="how-heading"><div><div class="section-label">03 / HOW IT WORKS</div><h2 id="how-heading">Make one useful practice loop.</h2></div><ol><li><b>Load an audio file</b><span>Use a file you have permission to use.</span></li><li><b>Set the loop start and end</b><span>Select the passage to repeat.</span></li><li><b>Slow playback without changing pitch</b><span>Listen closely at a pace that helps.</span></li></ol></section><section class="limits" aria-labelledby="limits-heading"><div><div class="section-label">04 / PRIVACY AND LIMITS</div><h2 id="limits-heading">Your audio stays in your browser.</h2></div><div><p>Imported audio is not uploaded.</p><p>Saved loops reopen in this browser after refresh.</p><p>Export saved loops before clearing browser data.</p></div></section></main>`,
  );
  $("#hero-file").addEventListener("change", fileChange);
  $("#export-cards").addEventListener("click", exportCards);
  $("#import-cards").addEventListener("change", importCards);
  renderDesk();
  renderCards();
  void restoreRealWorkspace(version);
}

async function restoreRealWorkspace(version: number) {
  const restoredCards = await listCards();
  const workspace = await loadWorkspace();
  if (version !== routeVersion || demo()) return;
  cards = restoredCards;
  if (workspace) {
    try {
      await loadStoredClip(workspace.clip);
      if (version !== routeVersion || demo()) return;
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

function renderDemo(version: number) {
  setMetadata("Demo — Loop Lab", "Try a separate four-bar sample before importing your own audio.", "/demo");
  $("#app").innerHTML = appShell(
    `<main id="main" tabindex="-1"><div class="demo-banner" role="status"><span><b>Demo</b> — sample data, nothing is saved to your real data.</span><button id="reset-demo">Reset demo</button><a href="/">Start for real</a></div><section class="demo-heading"><p class="eyebrow">DEMO / FOUR-BAR PRACTICE BEAT</p><h1 id="page-title" tabindex="-1">Try a four-bar practice beat.</h1><p>Set loop points, change speed, and save a note. Leaving Demo discards these changes.</p></section><section class="desk-section demo-desk"><div id="desk"></div></section><section id="saved" class="saved-section" aria-labelledby="saved-heading"><div class="section-label">SAVED LOOPS</div><h2 id="saved-heading" tabindex="-1">Sample saved loops.</h2><div id="cards"></div></section></main>`,
  );
  $("#reset-demo").addEventListener("click", async () => {
    player.stop();
    await clearDemoData();
    clip = null;
    cards = [];
    await seedDemo(version);
    announce("Demo reset. The four-bar sample is ready.");
  });
  renderDesk();
  void seedDemo(version);
}

async function seedDemo(version: number) {
  const duration = await player.loadSample();
  if (version !== routeVersion || !demo()) return;
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
    announce(`${file.name} loaded. Set the loop start and end, then play the loop.`);
  } catch (error) {
    if (error instanceof LoopDurationError) {
      announce(`This clip is too short to loop. Choose audio at least ${MIN_LOOP_DURATION.toFixed(2)} seconds long.`, true);
      return;
    }
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
  root.innerHTML = `<div class="desk ${has ? "ready" : "empty"}"><div class="clip-strip"><div><span class="status-dot" aria-hidden="true"></span><b>${has ? escapeHtml(clip!.name) : "No audio loaded"}</b><small>${has ? `${fmt(clip!.duration)} total · ${clip!.source === "sample" ? "sample audio" : "local audio"}` : "Load a local audio file to begin."}</small></div><label class="file-button small">${has ? "Replace audio" : "Choose audio"}<input id="desk-file" type="file" accept="audio/*" /></label></div><div class="wave-wrap" aria-label="Loop range from ${fmt(start)} to ${fmt(end)}"><div class="wave" aria-hidden="true">${Array.from({ length: 42 }, (_, index) => `<i class="bar-${(index * 7 + 3) % 9}"></i>`).join("")}</div><div class="range-label a">A ${fmt(start)}</div><div class="range-label b">B ${fmt(end)}</div></div><div class="ranges"><label>Loop start <output id="start-out">${fmt(start)}</output><input id="start" type="range" min="0" max="${max}" step="0.05" value="${start}" ${has ? "" : "disabled"} /></label><label>Loop end <output id="end-out">${fmt(end)}</output><input id="end" type="range" min="0.05" max="${max}" step="0.05" value="${end}" ${has ? "" : "disabled"} /></label></div><div class="controls"><button class="transport" id="play" ${has ? "" : "disabled"} aria-label="Play loop">▶ <span>Play loop</span></button><button class="transport pale" id="stop" ${has ? "" : "disabled"} aria-label="Stop loop">■ <span>Stop loop</span></button><label class="speed">Speed <select id="speed" ${has ? "" : "disabled"}><option value="0.5" ${player.speed === 0.5 ? "selected" : ""}>50%</option><option value="0.75" ${player.speed === 0.75 ? "selected" : ""}>75%</option><option value="1" ${player.speed === 1 ? "selected" : ""}>100%</option></select><small>Pitch does not change</small></label><div class="bpm"><label for="bpm">BPM</label><output id="bpm-output">${bpm}</output><button id="tap" type="button" ${has ? "" : "disabled"}>Tap tempo</button><input id="bpm" type="number" min="30" max="300" value="${bpm}" ${has ? "" : "disabled"} /></div></div><form class="card-form" id="card-form"><div><label for="card-name">Saved loop name</label><input id="card-name" required maxlength="42" placeholder="e.g. Kick and bass pocket" ${has ? "" : "disabled"} /></div><div><label for="card-note">What will you listen for?</label><input id="card-note" required maxlength="140" placeholder="e.g. Where does the bass enter?" ${has ? "" : "disabled"} /></div><button class="button primary" ${has ? "" : "disabled"}>Save loop</button></form></div>`;
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
    revealHash("#saved");
  });
}

function renderCards() {
  const root = document.querySelector<HTMLElement>("#cards");
  if (!root) return;
  root.innerHTML = cards.length
    ? `<ul class="cards">${cards.map((card) => `<li><button class="card-open" data-open="${card.id}"><b>${escapeHtml(card.name)}</b><span>${fmt(card.start)}—${fmt(card.end)} · ${clamp(card.bpm, 30, 300)} BPM · ${Math.round(card.speed * 100)}%</span><em>${escapeHtml(card.note)}</em></button><button class="delete" data-delete="${card.id}" aria-label="Delete ${escapeHtml(card.name)}">×</button></li>`).join("")}</ul>`
    : `<p class="empty-copy">Saved loops appear here. Save one from the practice desk.</p>`;
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
    else if (demo()) await loadStoredClip({ name: "Night bus · four-bar beat", duration: 8, source: "sample" });
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

type PortableClip = Omit<StoredClip, "audio"> & { audioBase64?: string; audioType?: string };
type PortableCard = Omit<LoopCard, "clip"> & { clip?: PortableClip };

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
  link.download = "loop-lab-saved-loops.json";
  link.click();
  URL.revokeObjectURL(link.href);
  announce(`Exported ${cards.length} saved ${cards.length === 1 ? "loop" : "loops"}.`);
}

async function importCards(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const imported = parsePortableCards(JSON.parse(await file.text()));
    await saveCards(imported);
    cards = await listCards();
    renderCards();
    announce(`Imported ${imported.length} saved ${imported.length === 1 ? "loop" : "loops"}.`);
  } catch {
    announce("That file is not a Loop Lab saved-loop export. Choose a Loop Lab JSON file.", true);
  } finally {
    input.value = "";
  }
}

function parsePortableCards(value: unknown): LoopCard[] {
  if (!isRecord(value) || value.format !== "loop-lab-cards" || value.version !== 1 || !Array.isArray(value.cards)) throw new Error("format");
  const ids = new Set<string>();
  return value.cards.map((item) => {
    if (!isRecord(item)) throw new Error("card");
    const id = requiredText(item.id);
    if (ids.has(id)) throw new Error("duplicate card");
    ids.add(id);
    const name = requiredText(item.name);
    const note = requiredText(item.note);
    const start = finite(item.start);
    const end = finite(item.end);
    const bpm = finite(item.bpm);
    const speed = finite(item.speed);
    const createdAt = finite(item.createdAt);
    const clip = parsePortableClip(item.clip);
    if (start < 0 || end <= start || end > clip.duration || end - start < MIN_LOOP_DURATION || bpm < 30 || bpm > 300 || ![.5, .75, 1].includes(speed) || createdAt <= 0) throw new Error("card values");
    return { id, name, note, start, end, bpm, speed, createdAt, clip };
  });
}

function parsePortableClip(value: unknown): StoredClip {
  if (!isRecord(value)) throw new Error("clip");
  const name = requiredText(value.name);
  const duration = finite(value.duration);
  if (duration < MIN_LOOP_DURATION || (value.source !== "sample" && value.source !== "file")) throw new Error("clip values");
  if (value.source === "sample") return { name, duration, source: "sample" };
  if (typeof value.audioBase64 !== "string" || !value.audioBase64.trim()) throw new Error("missing audio");
  if (value.audioType !== undefined && typeof value.audioType !== "string") throw new Error("audio type");
  const audio = base64ToArrayBuffer(value.audioBase64);
  if (!audio.byteLength) throw new Error("empty audio");
  return { name, duration, source: "file", audio: new Blob([audio], { type: typeof value.audioType === "string" ? value.audioType : "application/octet-stream" }) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown) {
  if (typeof value !== "string" || !value.trim()) throw new Error("text");
  return value.trim();
}

function finite(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("number");
  return value;
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

function announceRoute() {
  const announcer = document.querySelector<HTMLElement>("#route-announcer");
  if (announcer) announcer.textContent = `Opened ${document.title}.`;
}

function escapeHtml(value: string) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function simplePage(kind: "privacy" | "terms" | "404") {
  const page = kind === "privacy"
    ? { title: "Privacy — Loop Lab", h1: "Your audio stays in your browser.", description: "How Loop Lab stores audio and saved loops in your browser.", text: "Loop Lab stores audio and saved loops in your browser. Imported audio is not uploaded. Loop Lab uses no analytics or advertising. Export saved loops before clearing browser site data." }
    : kind === "terms"
      ? { title: "Terms — Loop Lab", h1: "Use audio you have permission to use.", description: "Terms for using the free Loop Lab practice tool.", text: "Loop Lab is free and needs no account. You are responsible for having permission to use imported audio." }
      : { title: "Page not found — Loop Lab", h1: "That page is not in Loop Lab.", description: "This address is not part of Loop Lab.", text: "The page address is not part of Loop Lab. Return to the practice desk to create or reopen a saved loop." };
  setMetadata(page.title, page.description, kind === "404" ? location.pathname : `/${kind}`);
  $("#app").innerHTML = appShell(`<main id="main" class="legal" tabindex="-1"><p class="eyebrow">LOOP LAB / ${kind.toUpperCase()}</p><h1 id="page-title" tabindex="-1">${page.h1}</h1><p>${page.text}</p><a class="button primary" href="/">Open the practice desk</a></main>`);
}

type ViewState = { scrollX: number; scrollY: number; focusId?: string };
type HistoryState = { loopLabView?: ViewState };

function isDemoUrl(url: URL) {
  return url.pathname === "/demo" || url.searchParams.get("demo") === "1";
}

function saveViewState() {
  const active = document.activeElement;
  const view: ViewState = {
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    focusId: active instanceof HTMLElement && active.id ? active.id : lastLandmarkFocusId,
  };
  history.replaceState({ ...(history.state ?? {}), loopLabView: view } satisfies HistoryState, "", location.href);
}

function focusHash(hash = location.hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const destination = document.getElementById(id === "saved" ? "saved-heading" : id);
  if (!destination) return;
  destination.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
  if (destination instanceof HTMLElement) destination.focus({ preventScroll: true });
}

function revealHash(hash: string) {
  saveViewState();
  history.pushState({ loopLabView: { scrollX: 0, scrollY: 0 } } satisfies HistoryState, "", hash);
  focusHash(hash);
}

function restoreViewState(state: HistoryState | null, focusFallback = false) {
  requestAnimationFrame(() => {
    if (location.hash) {
      focusHash();
      return;
    }
    const view = state?.loopLabView;
    window.scrollTo({ left: view?.scrollX ?? 0, top: view?.scrollY ?? 0, behavior: "instant" as ScrollBehavior });
    const focusTarget = view?.focusId ? document.getElementById(view.focusId) : focusFallback ? document.getElementById("page-title") : null;
    if (focusTarget instanceof HTMLElement) focusTarget.focus({ preventScroll: true });
  });
}

function route(focusHeading = true) {
  const version = ++routeVersion;
  player.stop();
  clip = null;
  cards = [];
  const path = location.pathname;
  if (demo()) renderDemo(version);
  else if (path === "/privacy") simplePage("privacy");
  else if (path === "/terms") simplePage("terms");
  else if (path !== "/") simplePage("404");
  else renderLanding(version);
  renderedDemo = demo();
  if (focusHeading) setTimeout(() => {
    document.querySelector<HTMLElement>("#page-title")?.focus();
    announceRoute();
  }, 0);
}

document.addEventListener("click", (event) => {
  const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  revealHash(anchor.hash);
});

document.addEventListener("focusin", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.id) lastLandmarkFocusId = target.id;
});

document.addEventListener("click", async (event) => {
  const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="/"]');
  if (!anchor || anchor.hasAttribute("download") || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const next = new URL(anchor.href);
  const sameDocument = next.pathname === location.pathname && next.search === location.search;
  event.preventDefault();

  if (sameDocument && next.hash) {
    revealHash(next.hash);
    return;
  }

  if (renderedDemo && !isDemoUrl(next)) await clearDemoData();
  saveViewState();
  history.pushState({ loopLabView: { scrollX: 0, scrollY: 0 } } satisfies HistoryState, "", `${next.pathname}${next.search}${next.hash}`);
  route(!next.hash);
  if (next.hash) setTimeout(() => focusHash(next.hash), 0);
});
window.addEventListener("popstate", async (event) => {
  const leavingDemo = renderedDemo && !demo();
  if (leavingDemo) await clearDemoData();
  route(false);
  restoreViewState(event.state as HistoryState | null, true);
  setTimeout(announceRoute, 0);
});
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

history.scrollRestoration = "manual";
route(false);
restoreViewState(history.state as HistoryState | null);
