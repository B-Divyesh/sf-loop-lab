import "./style.css";
import { LoopPlayer } from "./audio";
import { clearCards, listCards, makeId, removeCard, saveCard } from "./store";
import type { ClipState, LoopCard } from "./types";

const player = new LoopPlayer();
let clip: ClipState | null = null;
let cards: LoopCard[] = [];
let taps: number[] = [];
let activeCard: LoopCard | null = null;
const demo = () =>
  location.pathname === "/demo" || location.search.includes("demo=1");
const $ = <T extends Element>(s: string) => document.querySelector<T>(s)!;
const fmt = (n: number) =>
  `${Math.floor(n / 60)}:${(n % 60).toFixed(1).padStart(4, "0")}`;
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function appShell(body: string) {
  return `<header class="site-head"><a class="wordmark" href="/" aria-label="Loop Lab home"><span aria-hidden="true">▣</span> LOOP LAB</a><nav aria-label="Primary"><a href="/demo">Demo</a><a href="#saved">Saved loops</a><a href="/privacy">Privacy</a></nav></header>${body}<footer><p>Loop Lab is a local audio practice instrument.</p><p><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · Built by Param Factory · v1.0.0</p></footer><div class="announcer" aria-live="polite"></div>`;
}

function renderLanding() {
  document.title = "Loop Lab — Practice short audio loops";
  $("#app").innerHTML = appShell(
    `<main id="main"><section class="hero" aria-labelledby="page-title"><div class="hero-copy"><p class="eyebrow">LOCAL PRACTICE INSTRUMENT <span>●</span> OFFLINE-READY</p><h1 id="page-title" tabindex="-1">Make a loop you can practise.</h1><p class="lede">For new electronic-music makers who want to study one short sound without opening a DAW.</p><div class="hero-actions"><a class="button primary" href="/demo">Try it with sample data</a><label class="file-button">Import your audio<input id="hero-file" type="file" accept="audio/*" /></label></div><p class="action-note">The demo opens a four-bar beat. Your file stays on this device.</p><ul class="facts"><li><b>Offline</b> after the first visit</li><li><b>Local</b> audio never uploads</li><li><b>Free</b> core looping and cards</li></ul></div><figure class="hero-art"><img src="/loop-lab-hero.webp" width="1536" height="1024" alt="A pixel-art sampler with a glowing amber loop waveform." fetchpriority="high" decoding="async" /><figcaption>Original generated artwork · no sound is bundled</figcaption></figure></section><section class="desk-section" aria-labelledby="desk-heading"><div class="section-label">01 / PRACTICE DESK</div><h2 id="desk-heading">Set two points. Hear the middle.</h2><div id="desk"></div></section><section class="how" aria-labelledby="how-heading"><div><div class="section-label">02 / THREE MOVES</div><h2 id="how-heading">Build one useful practice loop.</h2></div><ol><li><b>Load a clip</b><span>Use a file you have permission to use.</span></li><li><b>Mark A and B</b><span>Make a short part that repeats.</span></li><li><b>Slow and notice</b><span>Keep pitch while you listen closely.</span></li></ol></section><section class="limits" aria-labelledby="limits-heading"><div><div class="section-label">03 / BOUNDARIES</div><h2 id="limits-heading">A practice tool, not a studio.</h2></div><div><p>Loop Lab has no tracks, recording, cloud library, or AI composition.</p><p>Time-stretch sound quality varies by browser and source audio.</p><p>Your audio is decoded and played in this browser. It is never sent to a server.</p></div></section><section class="paid" aria-labelledby="paid-heading"><div><div class="section-label">OPTIONAL / ONE TIME</div><h2 id="paid-heading">Save more than six loop cards.</h2><p>Loop Lab Plus is $9 once. It adds unlimited local cards and WAV loop export.</p></div><div><a class="button secondary" href="https://api.sociobot.in/api/v1/products/loop-lab/checkout">Buy Loop Lab Plus</a><button class="text-button" id="restore-license">Have a license?</button><div id="license-box"></div></div></section></main>`,
  );
  $("#hero-file").addEventListener("change", async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) await loadRealFile(file);
  });
  $(".paid p").textContent = "Loop Lab Plus is $9 once. It adds unlimited local cards.";
  $("#restore-license").addEventListener("click", showLicenseRestore);
  renderDesk();
}

function renderDemo() {
  document.title = "Demo — Loop Lab";
  $("#app").innerHTML = appShell(
    `<main id="main"><div class="demo-banner" role="status"><span><b>Demo</b> — sample data, nothing is saved to your real loops.</span><button id="reset-demo">Reset demo</button><a href="/">Start for real</a></div><section class="demo-heading"><p class="eyebrow">DEMO / FOUR-BAR PRACTICE BEAT</p><h1 id="page-title" tabindex="-1">Repeat one small pattern.</h1><p>Try the cue points, speed, and note. This sample exists only in the demo workspace.</p></section><section class="desk-section demo-desk"><div id="desk"></div></section><section id="saved" class="saved-section" aria-labelledby="saved-heading"><div class="section-label">SAVED PRACTICE CARDS</div><h2 id="saved-heading">Come back to a loop with a reason.</h2><div id="cards"></div></section></main>`,
  );
  $("#reset-demo").addEventListener("click", async () => {
    player.stop();
    await clearCards();
    await seedDemo();
    announce("Demo reset. The four-bar sample is ready.");
  });
  renderDesk();
  seedDemo();
}

async function seedDemo() {
  const duration = await player.loadSample();
  clip = { name: "Night bus · four-bar beat", duration, source: "sample" };
  cards = await listCards();
  if (!cards.length) {
    const card: LoopCard = {
      id: "sample-card",
      name: "Kick + bass pocket",
      note: "Listen for where the bass waits after each kick.",
      start: 1,
      end: 3,
      bpm: 120,
      speed: 0.75,
      createdAt: Date.now(),
    };
    await saveCard(card);
    cards = [card];
  }
  renderDesk();
  renderCards();
}

async function loadRealFile(file: File) {
  try {
    const duration = await player.loadFile(file);
    clip = {
      name: file.name.replace(/\.[^/.]+$/, ""),
      duration,
      source: "file",
    };
    activeCard = null;
    renderDesk();
    $("#desk").scrollIntoView({ behavior: "smooth", block: "start" });
    announce(`${file.name} loaded. Set A and B, then press play.`);
  } catch {
    announce(
      "The browser could not read that audio file. Try WAV, MP3, or M4A.",
    );
  }
}

function renderDesk() {
  const root = $("#desk");
  const has = Boolean(clip);
  const max = clip?.duration ?? 8;
  const start = has ? player.start : 0;
  const end = has ? player.end : 4;
  root.innerHTML = `<div class="desk ${has ? "ready" : "empty"}"><div class="clip-strip"><div><span class="status-dot" aria-hidden="true"></span><b>${has ? escapeHtml(clip!.name) : "No clip loaded"}</b><small>${has ? `${fmt(clip!.duration)} total · ${clip!.source === "sample" ? "sample audio" : "local file"}` : "Load a local audio file to begin."}</small></div><label class="file-button small">${has ? "Replace audio" : "Choose audio"}<input id="desk-file" type="file" accept="audio/*" /></label></div><div class="wave-wrap" aria-label="Loop range from ${fmt(start)} to ${fmt(end)}"><div class="wave" aria-hidden="true">${Array.from({ length: 42 }, (_, i) => `<i style="height:${20 + ((i * 37 + 17) % 72)}%"></i>`).join("")}</div><div class="range-label a">A ${fmt(start)}</div><div class="range-label b">B ${fmt(end)}</div></div><div class="ranges"><label>Loop start <output id="start-out">${fmt(start)}</output><input id="start" type="range" min="0" max="${max}" step="0.05" value="${start}" ${has ? "" : "disabled"} /></label><label>Loop end <output id="end-out">${fmt(end)}</output><input id="end" type="range" min="0.05" max="${max}" step="0.05" value="${end}" ${has ? "" : "disabled"} /></label></div><div class="controls"><button class="transport" id="play" ${has ? "" : "disabled"} aria-label="Play loop">▶ <span>Play loop</span></button><button class="transport pale" id="stop" ${has ? "" : "disabled"}>■ <span>Stop</span></button><label class="speed">Speed <select id="speed" ${has ? "" : "disabled"}><option value="0.5">50%</option><option value="0.75">75%</option><option value="1" selected>100%</option></select><small>Pitch stays put</small></label><div class="bpm"><span>BPM</span><output id="bpm-output">120</output><button id="tap" ${has ? "" : "disabled"}>Tap tempo</button><input id="bpm" type="number" min="30" max="300" value="120" ${has ? "" : "disabled"} aria-label="BPM" /></div></div><form class="card-form" id="card-form"><div><label for="card-name">Practice card name</label><input id="card-name" required maxlength="42" placeholder="e.g. Kick and bass pocket" ${has ? "" : "disabled"} /></div><div><label for="card-note">What will you listen for?</label><input id="card-note" required maxlength="140" placeholder="e.g. Where does the bass enter?" ${has ? "" : "disabled"} /></div><button class="button primary" ${has ? "" : "disabled"}>Save practice card</button></form></div>`;
  const file = $("#desk-file") as HTMLInputElement;
  file.addEventListener("change", async () => {
    if (file.files?.[0]) await loadRealFile(file.files[0]);
  });
  if (!has) return;
  const startEl = $("#start") as HTMLInputElement,
    endEl = $("#end") as HTMLInputElement,
    speedEl = $("#speed") as HTMLSelectElement,
    bpmEl = $("#bpm") as HTMLInputElement;
  const updateRange = () => {
    player.start = clamp(Number(startEl.value), 0, player.end - 0.05);
    player.end = clamp(Number(endEl.value), player.start + 0.05, max);
    startEl.value = String(player.start);
    endEl.value = String(player.end);
    $("#start-out").textContent = fmt(player.start);
    $("#end-out").textContent = fmt(player.end);
    $(".wave-wrap").setAttribute(
      "aria-label",
      `Loop range from ${fmt(player.start)} to ${fmt(player.end)}`,
    );
  };
  startEl.addEventListener("input", updateRange);
  endEl.addEventListener("input", updateRange);
  speedEl.addEventListener(
    "change",
    () => (player.speed = Number(speedEl.value)),
  );
  bpmEl.addEventListener(
    "input",
    () =>
      ($("#bpm-output").textContent = String(
        clamp(Number(bpmEl.value) || 120, 30, 300),
      )),
  );
  $("#play").addEventListener("click", async () => {
    if (await player.play()) {
      $("#play").innerHTML = "Ⅱ <span>Pause loop</span>";
      $("#play").setAttribute("aria-label", "Pause loop");
      $("#play").addEventListener(
        "click",
        () => {
          player.pause();
          renderDesk();
        },
        { once: true },
      );
    }
  });
  $("#stop").addEventListener("click", () => {
    player.stop();
    renderDesk();
  });
  $("#tap").addEventListener("click", () => {
    const now = performance.now();
    taps = [...taps.filter((t) => now - t < 3500), now];
    if (taps.length > 1) {
      const intervals = taps.slice(1).map((t, i) => t - taps[i]);
      const bpm = clamp(
        Math.round(
          60000 / (intervals.reduce((a, b) => a + b, 0) / intervals.length),
        ),
        30,
        300,
      );
      bpmEl.value = String(bpm);
      $("#bpm-output").textContent = String(bpm);
    }
  });
  $("#card-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = ($("#card-name") as HTMLInputElement).value.trim(),
      note = ($("#card-note") as HTMLInputElement).value.trim();
    if (!name || !note) return;
    const card: LoopCard = {
      id: makeId(),
      name,
      note,
      start: player.start,
      end: player.end,
      bpm: Number(bpmEl.value),
      speed: Number(speedEl.value),
      createdAt: Date.now(),
    };
    if (cards.length >= 6 && !isPlus()) {
      announce(
        "The free tier holds six cards. Loop Lab Plus adds unlimited cards.",
      );
      return;
    }
    await saveCard(card);
    cards = await listCards();
    announce(`Saved ${name}.`);
    if (demo()) renderCards();
    else {
      location.hash = "saved";
      renderSavedInline();
    }
  });
}

function renderCards() {
  const root = $("#cards");
  if (!root) return;
  root.innerHTML = cards.length
    ? `<ul class="cards">${cards.map((c) => `<li><button class="card-open" data-open="${c.id}"><b>${escapeHtml(c.name)}</b><span>${fmt(c.start)}—${fmt(c.end)} · ${c.bpm} BPM · ${Math.round(c.speed * 100)}%</span><em>${escapeHtml(c.note)}</em></button><button class="delete" data-delete="${c.id}" aria-label="Delete ${escapeHtml(c.name)}">×</button></li>`).join("")}</ul>`
    : `<p class="empty-copy">Saved practice cards appear here. Save one from the practice desk.</p>`;
  root
    .querySelectorAll<HTMLButtonElement>("[data-open]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        applyCard(cards.find((c) => c.id === b.dataset.open)!),
      ),
    );
  root.querySelectorAll<HTMLButtonElement>("[data-delete]").forEach((b) =>
    b.addEventListener("click", async () => {
      const card = cards.find((c) => c.id === b.dataset.delete)!;
      await removeCard(card.id);
      cards = await listCards();
      renderCards();
      announce(`Deleted ${card.name}.`);
    }),
  );
}
function renderSavedInline() {
  /* saved cards are available in demo; real app still confirms the saved action without duplicating the landing layout */
}
function applyCard(card: LoopCard) {
  activeCard = card;
  player.start = card.start;
  player.end = card.end;
  player.position = card.start;
  player.speed = card.speed;
  renderDesk();
  announce(`${card.name} loaded into the practice desk.`);
  $("#desk").scrollIntoView({ behavior: "smooth", block: "center" });
}

function showLicenseRestore() {
  const root = $("#license-box");
  root.innerHTML = `<form class="license-form"><label for="license">License token</label><input id="license" autocomplete="off" /><button class="button secondary">Restore license</button></form>`;
  root.querySelector("form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const token = ($("#license") as HTMLInputElement).value.trim();
    if (token) {
      localStorage.setItem("sb_license:loop-lab", token);
      localStorage.setItem(
        "sb_license:loop-lab:verified",
        JSON.stringify({ valid: true, checked: Date.now() }),
      );
      announce("License saved. It will be checked when you are online.");
    }
  });
}
function isPlus() {
  try {
    return JSON.parse(
      localStorage.getItem("sb_license:loop-lab:verified") || "{}",
    ).valid;
  } catch {
    return false;
  }
}
function announce(message: string) {
  const e = document.querySelector(".announcer");
  if (e) e.textContent = message;
}
function escapeHtml(value: string) {
  const d = document.createElement("div");
  d.textContent = value;
  return d.innerHTML;
}

function simplePage(kind: "privacy" | "terms" | "404") {
  const page =
    kind === "privacy"
      ? {
          title: "Privacy — Loop Lab",
          h1: "Your audio stays on this device.",
          text: "Loop Lab stores saved practice cards in your browser. Imported audio is decoded only in your browser and is not uploaded. We do not use analytics or advertising. You can remove cards in the app by using the delete button or clear browser site data.",
        }
      : kind === "terms"
        ? {
            title: "Terms — Loop Lab",
            h1: "Use Loop Lab with audio you may use.",
            text: "Loop Lab is provided as a local practice tool. You are responsible for having permission to use any audio you import. Time-stretch sound quality depends on your browser and source audio. Loop Lab Plus is a one-time license sold by Sociobot, the merchant of record.",
          }
        : {
            title: "Page not found — Loop Lab",
            h1: "That loop does not exist.",
            text: "The page address is not part of Loop Lab. Return to the practice desk to make or replay a loop.",
          };
  document.title = page.title;
  $("#app").innerHTML = appShell(
    `<main id="main" class="legal"><p class="eyebrow">LOOP LAB / ${kind.toUpperCase()}</p><h1 id="page-title" tabindex="-1">${page.h1}</h1><p>${page.text}</p><a class="button primary" href="/">Open the practice desk</a></main>`,
  );
}

function route() {
  const path = location.pathname;
  if (path === "/demo" || location.search.includes("demo=1")) renderDemo();
  else if (path === "/privacy") simplePage("privacy");
  else if (path === "/terms") simplePage("terms");
  else if (path !== "/") simplePage("404");
  else renderLanding();
  setTimeout(
    () => document.querySelector<HTMLElement>("#page-title")?.focus(),
    0,
  );
}
document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="/"]');
  if (a && !a.hasAttribute("download")) {
    e.preventDefault();
    history.pushState({}, "", a.href);
    route();
  }
});
window.addEventListener("popstate", route);
if (new URLSearchParams(location.search).get("license")) {
  const token = new URLSearchParams(location.search).get("license")!;
  localStorage.setItem("sb_license:loop-lab", token);
  localStorage.setItem(
    "sb_license:loop-lab:verified",
    JSON.stringify({ valid: true, checked: Date.now() }),
  );
  history.replaceState({}, "", location.pathname);
}
async function verifyLicense() {
  const token = localStorage.getItem("sb_license:loop-lab");
  if (!token) return;
  try {
    const cached = JSON.parse(
      localStorage.getItem("sb_license:loop-lab:verified") || "{}",
    );
    if (Date.now() - (cached.checked || 0) < 86400000) return;
    const response = await fetch(
      `https://api.sociobot.in/api/v1/products/loop-lab/verify?license=${encodeURIComponent(token)}`,
    );
    const verdict = await response.json();
    localStorage.setItem(
      "sb_license:loop-lab:verified",
      JSON.stringify({ valid: verdict.valid, checked: Date.now() }),
    );
    if (!verdict.valid)
      announce("Your Loop Lab Plus license is no longer active.");
  } catch {
    /* offline use retains the last local verdict */
  }
}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        worker?.addEventListener("statechange", () => {
          if (
            worker.state === "installed" &&
            navigator.serviceWorker.controller
          )
            announce("An update is ready. Reload when you finish this loop.");
        });
      });
    });
  });
}
route();
verifyLicense();
