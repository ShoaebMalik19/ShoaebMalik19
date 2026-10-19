// Generates assets/banner.svg: a synthwave grid with a real rotating 3D wireframe
// (projected per-frame and animated with SMIL so it works inside GitHub's <img> sandbox).
import { writeFileSync, mkdirSync } from "node:fs";

const W = 1200, H = 420;
const FRAMES = 48;
const DUR = 12; // seconds per full rotation

// --- icosahedron geometry -------------------------------------------------
const t = (1 + Math.sqrt(5)) / 2;
const V = [
  [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
  [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
  [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
];
const edges = [];
for (let i = 0; i < V.length; i++)
  for (let j = i + 1; j < V.length; j++) {
    const d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
    if (Math.abs(d - 2) < 1e-6) edges.push([i, j]);
  }

function project(p, a, b, cx, cy, s) {
  let [x, y, z] = p;
  // rotate Y then X
  [x, z] = [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)];
  [y, z] = [y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
  const f = 6 / (6 + z);
  return [cx + x * s * f, cy + y * s * f, z];
}

function shapeFrames(cx, cy, s, tilt) {
  const paths = [], dots = [];
  for (let k = 0; k <= FRAMES; k++) {
    const a = (k / FRAMES) * Math.PI * 2;
    const P = V.map((p) => project(p, a, tilt + Math.sin(a) * 0.25, cx, cy, s));
    paths.push(edges.map(([i, j]) => `M${P[i][0].toFixed(1)} ${P[i][1].toFixed(1)}L${P[j][0].toFixed(1)} ${P[j][1].toFixed(1)}`).join(""));
    dots.push(P);
  }
  return { paths, dots };
}

const ico = shapeFrames(1000, 175, 62, 0.45);
const ico2 = shapeFrames(150, 120, 26, -0.3);

// --- synthwave floor --------------------------------------------------------
const horizon = 285;
let vlines = "";
for (let i = -24; i <= 24; i++) {
  const xb = W / 2 + i * 70;
  vlines += `<line x1="${W / 2 + i * 6}" y1="${horizon}" x2="${xb}" y2="${H}"/>`;
}
let hlines = "";
for (let i = 0; i < 10; i++) {
  // exponential spacing for depth, animated as a whole group
  const y = horizon + Math.pow(i / 9, 2.1) * (H - horizon);
  hlines += `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}"/>`;
}

// --- stars ------------------------------------------------------------------
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
let stars = "";
for (let i = 0; i < 70; i++) {
  const x = rnd() * W, y = rnd() * (horizon - 20), r = rnd() * 1.4 + 0.3, d = (rnd() * 3 + 2).toFixed(1);
  stars += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff"><animate attributeName="opacity" values="0.15;1;0.15" dur="${d}s" repeatCount="indefinite" begin="${(rnd() * 3).toFixed(1)}s"/></circle>`;
}

const vertexDots = ico.dots[0].map((_, vi) => {
  const xs = ico.dots.map((P) => P[vi][0].toFixed(1)).join(";");
  const ys = ico.dots.map((P) => P[vi][1].toFixed(1)).join(";");
  return `<circle r="3.2" fill="#00ffa3" filter="url(#glow)"><animate attributeName="cx" values="${xs}" dur="${DUR}s" repeatCount="indefinite"/><animate attributeName="cy" values="${ys}" dur="${DUR}s" repeatCount="indefinite"/></circle>`;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Shoaeb Malik — AI, Full-Stack and Web3 developer">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#05040d"/><stop offset=".55" stop-color="#140a2e"/><stop offset=".68" stop-color="#3a0f4f"/><stop offset=".69" stop-color="#07050f"/><stop offset="1" stop-color="#07050f"/>
  </linearGradient>
  <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffd23f"/><stop offset=".5" stop-color="#ff2e88"/><stop offset="1" stop-color="#7c5cff"/>
  </linearGradient>
  <linearGradient id="name" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#00ffa3"/><stop offset=".5" stop-color="#7cf3ff"/><stop offset="1" stop-color="#b48cff"/>
    <animateTransform attributeName="gradientTransform" type="translate" values="-1 0;1 0;-1 0" dur="8s" repeatCount="indefinite"/>
  </linearGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07050f" stop-opacity="1"/><stop offset=".35" stop-color="#07050f" stop-opacity="0"/></linearGradient>
  <clipPath id="sunclip"><circle cx="600" cy="${horizon}" r="120"/></clipPath>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="bigglow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" opacity=".35"/></pattern>
  <style>
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace}
    .grid line{stroke:#ff2e88;stroke-width:1.3;opacity:.55}
    .glitch{animation:glitch 4s steps(1) infinite}
    .g2{animation:glitch2 4s steps(1) infinite}
    @keyframes glitch{0%,92%,100%{transform:translate(0,0)}93%{transform:translate(-6px,2px)}95%{transform:translate(5px,-2px)}97%{transform:translate(-3px,0)}}
    @keyframes glitch2{0%,92%,100%{opacity:0}93%,97%{opacity:.8}}
    .blink{animation:blink 1s steps(1) infinite}
    @keyframes blink{50%{opacity:0}}
    .floor{animation:floor 1.6s linear infinite}
    @keyframes floor{from{transform:translateY(0)}to{transform:translateY(14px)}}
    .pulse{animation:pulse 3s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:.85}50%{opacity:1}}
  </style>
</defs>

<rect width="${W}" height="${H}" fill="url(#sky)"/>
${stars}

<!-- retro sun -->
<g clip-path="url(#sunclip)" class="pulse">
  <rect x="480" y="${horizon - 120}" width="240" height="120" fill="url(#sun)"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="480" y="${horizon - 52 + i * 9}" width="240" height="${2 + i * 1.3}" fill="#140a2e"/>`).join("")}
</g>

<!-- floor -->
<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="#07050f"/>
<g class="grid">${vlines}</g>
<g class="grid"><g class="floor">${hlines}</g></g>
<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#fade)"/>
<line x1="0" y1="${horizon}" x2="${W}" y2="${horizon}" stroke="#ff2e88" stroke-width="2" filter="url(#glow)"/>

<!-- rotating 3D icosahedrons -->
<path fill="none" stroke="#7cf3ff" stroke-width="1.6" stroke-linejoin="round" filter="url(#glow)" opacity=".9"><animate attributeName="d" values="${ico.paths.join(";")}" dur="${DUR}s" repeatCount="indefinite"/></path>
${vertexDots}
<path fill="none" stroke="#b48cff" stroke-width="1.2" opacity=".7"><animate attributeName="d" values="${ico2.paths.join(";")}" dur="${DUR * 0.7}s" repeatCount="indefinite"/></path>

<!-- name -->
<g class="mono" text-anchor="middle">
  <text x="600" y="92" font-size="15" fill="#7cf3ff" letter-spacing="6" opacity=".85">&gt; HELLO_WORLD.EXE — BENGALURU, IN</text>
  <g class="glitch">
    <text x="603" y="168" font-size="74" font-weight="800" fill="#ff2e88" class="g2" letter-spacing="4">SHOAEB MALIK</text>
    <text x="597" y="164" font-size="74" font-weight="800" fill="#00ffa3" class="g2" letter-spacing="4">SHOAEB MALIK</text>
    <text x="600" y="166" font-size="74" font-weight="800" fill="url(#name)" filter="url(#bigglow)" letter-spacing="4">SHOAEB MALIK</text>
  </g>
  <text x="600" y="208" font-size="19" fill="#e9e4ff" letter-spacing="2">AI ENGINEER · FULL-STACK DEV · WEB3 BUILDER<tspan fill="#00ffa3" class="blink"> ▌</tspan></text>
</g>

<rect width="${W}" height="${H}" fill="url(#scan)" pointer-events="none"/>
</svg>
`;

mkdirSync(new URL("../assets/", import.meta.url), { recursive: true });
writeFileSync(new URL("../assets/banner.svg", import.meta.url), svg);
console.log("banner.svg", (svg.length / 1024).toFixed(1), "KB");
