// Generates assets/banner.svg: a restrained dark header with one slowly rotating 3D wireframe
// (projected per-frame and animated with SMIL so it works inside GitHub's <img> sandbox).
import { writeFileSync, mkdirSync } from "node:fs";

const W = 1200, H = 300;
const FRAMES = 72;
const DUR = 36; // seconds per full rotation: slow on purpose

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

function project([x, y, z], a, b, cx, cy, s) {
  [x, z] = [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)];
  [y, z] = [y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
  const f = 6 / (6 + z);
  return [cx + x * s * f, cy + y * s * f, z];
}

// split edges into front/back per frame so depth reads clearly
const front = [], back = [], dotsX = V.map(() => []), dotsY = V.map(() => []), dotsO = V.map(() => []);
for (let k = 0; k <= FRAMES; k++) {
  const a = (k / FRAMES) * Math.PI * 2;
  const P = V.map((p) => project(p, a, 0.42, 965, 150, 60));
  const seg = ([i, j]) => `M${P[i][0].toFixed(1)} ${P[i][1].toFixed(1)}L${P[j][0].toFixed(1)} ${P[j][1].toFixed(1)}`;
  front.push(edges.filter(([i, j]) => P[i][2] + P[j][2] <= 0).map(seg).join("") || "M0 0");
  back.push(edges.filter(([i, j]) => P[i][2] + P[j][2] > 0).map(seg).join("") || "M0 0");
  P.forEach((p, vi) => { dotsX[vi].push(p[0].toFixed(1)); dotsY[vi].push(p[1].toFixed(1)); dotsO[vi].push(p[2] <= 0 ? "1" : ".35"); });
}
const anim = (attr, vals) => `<animate attributeName="${attr}" values="${vals.join(";")}" dur="${DUR}s" repeatCount="indefinite"/>`;
const dots = V.map((_, vi) => `<circle r="2.6" fill="#5eead4">${anim("cx", dotsX[vi])}${anim("cy", dotsY[vi])}${anim("opacity", dotsO[vi])}</circle>`).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Mohammed Shoaeb Malik — Software Engineer building AI systems, full-stack products and Web3 apps">
<defs>
  <radialGradient id="glow" cx="80%" cy="50%" r="45%"><stop offset="0" stop-color="#14b8a6" stop-opacity=".16"/><stop offset="1" stop-color="#14b8a6" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ffffff" opacity=".06"/></pattern>
  <linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0"><stop offset=".35" stop-color="#0a0d12"/><stop offset=".75" stop-color="#0a0d12" stop-opacity="0"/></linearGradient>
  <style>
    .sans{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Helvetica,Arial,sans-serif}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace}
  </style>
</defs>
<rect width="${W}" height="${H}" rx="16" fill="#0a0d12"/>
<rect width="${W}" height="${H}" rx="16" fill="url(#dots)"/>
<rect width="${W}" height="${H}" rx="16" fill="url(#glow)"/>

<path fill="none" stroke="#5eead4" stroke-width="1" opacity=".22">${anim("d", back)}</path>
<path fill="none" stroke="#5eead4" stroke-width="1.4" opacity=".85" stroke-linecap="round">${anim("d", front)}</path>
${dots}

<rect width="760" height="${H}" fill="url(#fadeL)" opacity=".9"/>
<g class="mono" font-size="14" fill="#5eead4" letter-spacing="2.5"><text x="72" y="96">SOFTWARE ENGINEER · BENGALURU</text></g>
<text x="70" y="160" class="sans" font-size="58" font-weight="700" fill="#f3f5f7" letter-spacing="-1">Mohammed Shoaeb Malik</text>
<text x="72" y="202" class="sans" font-size="21" fill="#9aa4b2">I build AI systems, full-stack products and on-chain apps.</text>
<text x="72" y="232" class="sans" font-size="16" fill="#6b7685">B.Tech, Information Science  ·  Open to SWE and AI engineering roles</text>
<rect x="72" y="256" width="44" height="3" rx="1.5" fill="#5eead4"/>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="15.5" fill="none" stroke="#ffffff" stroke-opacity=".08"/>
</svg>
`;

mkdirSync(new URL("../assets/", import.meta.url), { recursive: true });
writeFileSync(new URL("../assets/banner.svg", import.meta.url), svg);
console.log("banner.svg", (svg.length / 1024).toFixed(1), "KB");
