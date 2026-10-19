// Generates assets/terminal.svg: an animated "whoami" terminal that types itself out.
import { writeFileSync } from "node:fs";

const W = 860, LH = 24, CW = 9.6; // CW ~ monospace glyph width at 16px
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// [kind, text] — "cmd" lines type out, "out" lines pop in after their command finishes
const script = [
  ["cmd", "whoami"],
  ["out", [["#e9e4ff", "Mohammed Shoaeb Malik"], ["#8b84a8", "  // B.Tech ISE @ REVA University"]]],
  ["cmd", "cat stack.json | jq '.daily'"],
  ["out", [["#7cf3ff", '["TypeScript", "Next.js", "Python", "Solidity", "Supabase"]']]],
  ["cmd", "cat focus.txt"],
  ["out", [["#00ffa3", "▸ "], ["#e9e4ff", "AI agents · RAG pipelines · computer vision"]]],
  ["out", [["#00ffa3", "▸ "], ["#e9e4ff", "full-stack products that actually ship"]]],
  ["out", [["#00ffa3", "▸ "], ["#e9e4ff", "smart contracts, wallets & on-chain apps"]]],
  ["cmd", "echo $STATUS"],
  ["out", [["#ffd23f", "building in public · open to freelance + internships ✦"]]],
];

const CMD_SPEED = 0.06; // seconds per char
let tCursor = 0.6, y = 70, body = "", css = "", n = 0;

for (const [kind, val] of script) {
  if (kind === "cmd") {
    const w = (val.length + 2) * CW;
    const dur = Math.max(val.length * CMD_SPEED, 0.3);
    css += `.l${n}{animation:show 0s ${tCursor.toFixed(2)}s forwards}.k${n}{animation:type ${dur.toFixed(2)}s steps(${val.length}) ${tCursor.toFixed(2)}s forwards}`;
    body += `<g class="ln l${n}"><text x="28" y="${y}"><tspan fill="#ff2e88">❯</tspan> <tspan fill="#e9e4ff">${esc(val)}</tspan></text>` +
      `<rect class="k${n}" x="${28 + 2 * CW}" y="${y - 18}" width="${w}" height="${LH}" fill="#0b0915" style="--w:${(w - 2 * CW).toFixed(1)}px"/></g>`;
    n++;
    tCursor += dur + 0.35;
  } else {
    css += `.l${n}{animation:show 0s ${tCursor.toFixed(2)}s forwards}`;
    body += `<g class="ln l${n++}"><text x="28" y="${y}">` +
      val.map(([c, s]) => `<tspan fill="${c}">${esc(s)}</tspan>`).join("") + `</text></g>`;
    tCursor += 0.18;
  }
  y += LH + (kind === "out" ? 4 : 0);
}
const H = y + 30;
css += `.l${n}{animation:show 0s ${tCursor.toFixed(2)}s forwards}`;
body += `<g class="ln l${n}"><text x="28" y="${y}"><tspan fill="#ff2e88">❯</tspan> <tspan fill="#00ffa3" class="blink">█</tspan></text></g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H + 10}" width="${W}" height="${H + 10}" role="img" aria-label="Terminal: whoami — Mohammed Shoaeb Malik, AI and full-stack developer">
<defs>
  <linearGradient id="bd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00ffa3"/><stop offset=".5" stop-color="#7c5cff"/><stop offset="1" stop-color="#ff2e88"/></linearGradient>
  <style>
    text{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;font-size:16px}
    .blink{animation:b 1s steps(1) infinite}@keyframes b{50%{opacity:0}}
    .ln{opacity:0}@keyframes show{to{opacity:1}}@keyframes type{to{transform:translateX(var(--w))}}
    ${css}
  </style>
</defs>
<rect x="1.5" y="1.5" width="${W - 3}" height="${H + 7}" rx="14" fill="#0b0915" stroke="url(#bd)" stroke-width="2"/>
<rect x="1.5" y="1.5" width="${W - 3}" height="36" rx="14" fill="#151126"/>
<rect x="1.5" y="24" width="${W - 3}" height="14" fill="#151126"/>
<circle cx="26" cy="20" r="6" fill="#ff5f57"/><circle cx="46" cy="20" r="6" fill="#febc2e"/><circle cx="66" cy="20" r="6" fill="#28c840"/>
<text x="${W / 2}" y="25" text-anchor="middle" fill="#8b84a8" style="font-size:13px">shoaeb@bengaluru: ~/github</text>
${body}
</svg>
`;
writeFileSync(new URL("../assets/terminal.svg", import.meta.url), svg);
console.log("terminal.svg ok, total anim", tCursor.toFixed(1), "s");
