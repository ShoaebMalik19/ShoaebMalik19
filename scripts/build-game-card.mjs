// Generates assets/game-card.svg: a compact "attract mode" preview of Commit Runner.
// Pure CSS animation (works inside GitHub's <img> sandbox). The ship's lane changes are
// choreographed against the object timings so it always dodges bugs and catches commits.
import { writeFileSync } from "node:fs";

const W = 520, H = 160, SX = 210; // scene starts at SX
const VP = { x: SX + 155, y: 46 };  // vanishing point
const LANE_X = { L: SX + 75, C: SX + 155, R: SX + 235 }; // lane centres at the player line
const PY = 132; // player line
const CYCLE = 4.8;

// object travel: horizon → player line in 2.4s, then off the bottom
const objs = [
  { kind: "bug", lane: "L", arrive: 2.0 },
  { kind: "commit", lane: "C", arrive: 3.2 },
  { kind: "bug", lane: "R", arrive: 4.4 },
  { kind: "commit", lane: "L", arrive: 0.8 },
];

let css = "", body = "";
objs.forEach((o, i) => {
  const delay = (o.arrive - 2.4).toFixed(2);
  const x1 = LANE_X[o.lane], dx = x1 - VP.x;
  const k = `o${i}`;
  const hit = o.kind === "commit";
  css += `@keyframes ${k}{0%{transform:translate(${VP.x}px,${VP.y}px) scale(.08);opacity:0}6%{opacity:1}` +
    `50%{transform:translate(${x1}px,${PY - 6}px) scale(1);opacity:1}` +
    (hit
      ? `52%{transform:translate(${x1}px,${PY - 6}px) scale(1.5);opacity:0}100%{opacity:0;transform:translate(${x1}px,${PY - 6}px) scale(1.5)}}`
      : `58%{transform:translate(${x1 + dx * .15}px,${H + 14}px) scale(1.15);opacity:1}59%,100%{opacity:0;transform:translate(${x1}px,${H + 20}px) scale(1.15)}}`) +
    `.${k}{animation:${k} ${CYCLE}s cubic-bezier(.55,0,.9,.6) ${delay}s infinite}`;
  body += hit
    ? `<g class="${k}"><circle r="7" fill="#0a0d12" stroke="#5eead4" stroke-width="2.4"/><circle r="2.6" fill="#5eead4"/></g>`
    : `<g class="${k}"><path d="M-4 -7 L-7 -11 M4 -7 L7 -11" stroke="#f472b6" stroke-width="1.6" stroke-linecap="round"/>` +
      `<ellipse rx="7" ry="8" fill="#f472b6"/><path d="M-7 -1 H7 M-7 3 H7" stroke="#0a0d12" stroke-width="1.2"/></g>`;
});

// ship lane schedule (seconds within the cycle): L → C (dodge bug L @2.0, catch C @3.2) → L (dodge R @4.4, catch L @0.8)
const pct = (s) => ((s / CYCLE) * 100).toFixed(1) + "%";
const sx = (l) => `translateX(${LANE_X[l] - LANE_X.C}px)`;
css += `@keyframes ship{0%,${pct(1.25)}{transform:${sx("L")}}${pct(1.6)},${pct(3.6)}{transform:${sx("C")}}${pct(3.95)},100%{transform:${sx("L")}}}` +
  `@keyframes tilt{0%,${pct(1.25)},${pct(1.6)},${pct(3.6)},${pct(3.95)},100%{transform:rotate(0)}${pct(1.42)}{transform:rotate(14deg)}${pct(3.78)}{transform:rotate(-14deg)}}`;

// catch flashes at the player line when a commit is collected
[[3.2, "C"], [0.8, "L"]].forEach(([t, l], i) => {
  css += `@keyframes f${i}{0%,${pct(t - 0.02)},${pct(t + 0.35)},100%{opacity:0;transform:scale(.6)}${pct(t)}{opacity:.9;transform:scale(1)}}` +
    `.f${i}{transform-box:fill-box;transform-origin:center;animation:f${i} ${CYCLE}s linear infinite}`;
  body += `<circle class="f${i}" cx="${LANE_X[l]}" cy="${PY - 6}" r="16" fill="none" stroke="#5eead4" stroke-width="1.5"/>`;
});

// floor: fanned verticals + horizontals that scroll toward the viewer
let fan = "";
for (let i = -6; i <= 6; i++) fan += `<line x1="${VP.x + i * 6}" y1="${VP.y}" x2="${VP.x + i * 80}" y2="${H}"/>`;
let rows = "";
for (let i = 0; i < 8; i++) {
  const y = VP.y + Math.pow(i / 7, 2) * (H - VP.y);
  rows += `<line x1="${SX}" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}"/>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Commit Runner: a small browser game. Dodge bugs, collect commits. Click to play.">
<defs>
  <clipPath id="scene"><rect x="${SX}" y="0" width="${W - SX}" height="${H}" rx="0"/></clipPath>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0d12"/><stop offset="1" stop-color="#1a1030"/></linearGradient>
  <radialGradient id="sun" cx="50%" cy="100%" r="60%"><stop offset="0" stop-color="#f472b6" stop-opacity=".8"/><stop offset="1" stop-color="#f472b6" stop-opacity="0"/></radialGradient>
  <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0d12"/><stop offset=".3" stop-color="#0a0d12" stop-opacity="0"/></linearGradient>
  <style>
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace}
    .sans{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Helvetica,Arial,sans-serif}
    .fan line{stroke:#5eead4;stroke-opacity:.22;stroke-width:1}
    .rows line{stroke:#f472b6;stroke-opacity:.35;stroke-width:1}
    .rows{animation:rows .9s linear infinite}
    @keyframes rows{from{transform:translateY(0)}to{transform:translateY(9px)}}
    .ship{animation:ship ${CYCLE}s ease-in-out infinite}
    .tilt{transform-box:fill-box;transform-origin:center;animation:tilt ${CYCLE}s ease-in-out infinite}
    .flame{transform-box:fill-box;transform-origin:top;animation:flame .18s ease-in-out infinite alternate}
    @keyframes flame{from{transform:scaleY(.6)}to{transform:scaleY(1.2)}}
    .pulse{animation:pulse 2.4s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:.75}50%{opacity:1}}
    ${css}
  </style>
</defs>
<rect width="${W}" height="${H}" rx="12" fill="#0a0d12"/>
<g clip-path="url(#scene)">
  <rect x="${SX}" width="${W - SX}" height="${H}" fill="url(#sky)"/>
  <ellipse cx="${VP.x}" cy="${VP.y}" rx="70" ry="30" fill="url(#sun)"/>
  <rect x="${SX}" y="${VP.y}" width="${W - SX}" height="${H - VP.y}" fill="#0a0d12"/>
  <g class="fan">${fan}</g>
  <g class="rows">${rows}</g>
  <rect x="${SX}" y="${VP.y}" width="${W - SX}" height="${H - VP.y}" fill="url(#fog)"/>
  <line x1="${SX}" y1="${VP.y}" x2="${W}" y2="${VP.y}" stroke="#f472b6" stroke-opacity=".7"/>
  ${body}
  <g class="ship" transform="translate(0 0)"><g transform="translate(${LANE_X.C} ${PY})"><g class="tilt">
    <rect class="flame" x="-3.5" y="5" width="7" height="8" rx="3" fill="#f472b6"/>
    <path d="M0 -12 L13 7 L0 3 L-13 7 Z" fill="#5eead4"/>
  </g></g></g>
</g>
<line x1="${SX}" y1="14" x2="${SX}" y2="${H - 14}" stroke="#ffffff" stroke-opacity=".08"/>

<text x="24" y="44" class="mono" font-size="11" fill="#5eead4" letter-spacing="2">SIDE QUEST</text>
<text x="24" y="72" class="sans" font-size="22" font-weight="700" fill="#f3f5f7">Commit Runner</text>
<text x="24" y="94" class="sans" font-size="13" fill="#9aa4b2">Dodge the bugs. Ship the commits.</text>
<g class="pulse">
  <rect x="24" y="110" width="118" height="28" rx="14" fill="#5eead4"/>
  <text x="83" y="128.5" text-anchor="middle" class="sans" font-size="12.5" font-weight="700" fill="#0a0d12">▶  Play in browser</text>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="11.5" fill="none" stroke="#ffffff" stroke-opacity=".1"/>
</svg>
`;
writeFileSync(new URL("../assets/game-card.svg", import.meta.url), svg);
console.log("game-card.svg", (svg.length / 1024).toFixed(1), "KB");
