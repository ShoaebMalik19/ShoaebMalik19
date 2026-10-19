<img src="./assets/banner.svg" alt="Mohammed Shoaeb Malik — Software Engineer. I build AI systems, full-stack products and on-chain apps." width="100%">

<p align="center">
  <a href="https://shoaebmalik.in"><img src="https://img.shields.io/badge/shoaebmalik.in-0a0d12?style=flat-square&logo=googlechrome&logoColor=5eead4" alt="Portfolio"></a>
  <a href="https://linkedin.com/in/shoaebmalik"><img src="https://img.shields.io/badge/LinkedIn-0a0d12?style=flat-square&logo=linkedin&logoColor=5eead4" alt="LinkedIn"></a>
  <a href="mailto:shoaebmalik19@gmail.com"><img src="https://img.shields.io/badge/shoaebmalik19@gmail.com-0a0d12?style=flat-square&logo=gmail&logoColor=5eead4" alt="Email"></a>
</p>

### About

I'm a software engineer working across **applied AI, full-stack product engineering and Web3**. I care about the unglamorous parts that make software trustworthy: tenant isolation, tests that run against a real database, privacy that stays on the device, and contracts small enough to reason about.

- **Building:** a multi-tenant commerce SaaS on Postgres row-level security with a Shopify order loop
- **Recently:** on-device PII redaction for browser agents, built for an ISRO problem statement at Smart India Hackathon
- **Interested in:** LLM systems and retrieval, applied computer vision, and secure smart-contract design

### Selected work

<table>
<tr>
<td width="50%" valign="top">

**[Supliments](https://github.com/ShoaebMalik19/supliments)**<br>
<sub>Multi-tenant SaaS · TypeScript</sub>

Private-label supplement platform: brands design labels, publish to Shopify, and orders route to manufacturers. Tenant isolation is enforced with **Postgres RLS** and a permanent isolation test suite. Print-ready PDFs are rendered server-side, and a retrying job queue has a dead-letter state.

<sub>`Next.js` `PostgreSQL` `Drizzle` `Supabase` `Shopify API` `Vitest` `GitHub Actions`</sub>

</td>
<td width="50%" valign="top">

**[PII Redaction Engine](https://github.com/ShoaebMalik19/Redaction_model)**<br>
<sub>On-device AI · Smart India Hackathon (ISRO)</sub>

A privacy layer that sits in front of a browser agent's LLM call. It finds faces, passwords, IDs and names in screenshots **entirely client-side**, combining an RF-DETR PII model, SCRFD face detection, OCR and DOM signals.

<sub>`ONNX Runtime Web` `Tesseract.js` `Hugging Face` `Chrome MV3`</sub>

</td>
</tr>
<tr>
<td width="50%" valign="top">

**[SportFo](https://github.com/ShoaebMalik19/sportfo)**<br>
<sub>Team product · Next.js</sub>

A sports identity platform for Indian athletes. I built the **Gemini AI coach** (streaming, voice input, six languages), the multi-step registration wizard, athlete discovery and Stories.

<sub>`Next.js` `Supabase` `Gemini API` `GSAP` `Framer Motion`</sub>

</td>
<td width="50%" valign="top">

**[PayShard Wallet](https://github.com/ShoaebMalik19/PayShard-Wallet)**<br>
<sub>Web3 · PWA</sub>

Send crypto the way you'd share a UPI link. Funds are locked in a **PayLink** contract and claimed with a passkey whose hash is the only thing stored on-chain. Installable as a PWA.

<sub>`Solidity` `Hardhat` `wagmi` `viem` `React` `Shardeum`</sub>

</td>
</tr>
<tr>
<td width="50%" valign="top">

**[Truth Stamp](https://github.com/ShoaebMalik19/Truth_stamp)** · [live ↗](https://truth-stamp.vercel.app)<br>
<sub>Web3 · Content provenance</sub>

An on-chain notary on Flare. It stamps content hashes and classifies new uploads as original or derived by **perceptual-hash Hamming distance**, with FDC attestation and FTSO timestamps.

<sub>`Solidity` `OpenZeppelin` `Flare` `Next.js` `wagmi`</sub>

</td>
<td width="50%" valign="top">

**[Trading RAG](https://github.com/ShoaebMalik19/Trading_RAG)**<br>
<sub>LLM · Retrieval</sub>

A retrieval-augmented assistant for Smart Money Concepts. It answers **only from your own strategy notes** and refuses when the retrieved context isn't enough.

<sub>`LangChain` `ChromaDB` `Gemini` `Python`</sub>

</td>
</tr>
</table>

<sub>More: [prediction market](https://github.com/ShoaebMalik19/Prediction-Market) · [real-time violence detection](https://github.com/ShoaebMalik19/Crime_detector-) · [sentiment analyzer](https://github.com/ShoaebMalik19/feedback-analyzer) · [all repositories →](https://github.com/ShoaebMalik19?tab=repositories)</sub>

### Stack

<p>
  <img src="https://skillicons.dev/icons?i=ts,react,nextjs,nodejs,python,postgres,supabase,solidity,tailwind,pytorch,opencv,githubactions&theme=dark&perline=12" alt="TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Supabase, Solidity, Tailwind, PyTorch, OpenCV, GitHub Actions">
</p>

| | |
|---|---|
| **AI / ML** | LLM apps with LangChain, Gemini and OpenAI (streaming, tool calling) · RAG with ChromaDB · ONNX Runtime Web · Tesseract.js OCR · YOLOv8 · MediaPipe · Hugging Face Transformers |
| **Frontend** | TypeScript · React · Next.js App Router · Tailwind CSS · Radix / shadcn · Framer Motion · GSAP · Vite · PWAs |
| **Backend & data** | Node.js · Express · Django · PostgreSQL with row-level security · Drizzle ORM · Supabase (Auth, Edge Functions) · Zod |
| **Web3** | Solidity · Hardhat · OpenZeppelin · viem · wagmi · ethers.js · Shardeum · Flare (FDC, FTSO) |
| **Commerce** | Shopify apps (OAuth, webhooks, fulfillment) · Liquid theme development |
| **Quality & delivery** | Vitest · Hardhat tests · GitHub Actions CI · Vercel |

### Activity

<p align="center">
  <img src="./profile-3d-contrib/profile-night-rainbow.svg" alt="3D view of my GitHub contributions with language and activity breakdown" width="100%">
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ShoaebMalik19/ShoaebMalik19/output/snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/ShoaebMalik19/ShoaebMalik19/output/snake.svg">
  <img alt="Contribution graph animation" src="https://raw.githubusercontent.com/ShoaebMalik19/ShoaebMalik19/output/snake.svg" width="100%">
</picture>

---

<p align="center">
  <sub>Open to <b>software engineering and AI engineering roles</b> and selected freelance builds. The quickest way to reach me is <a href="mailto:shoaebmalik19@gmail.com">email</a>.<br>
  Side project: <a href="https://shoaebmalik19.github.io/ShoaebMalik19/">Commit Runner</a>, a small canvas game I made for this profile.</sub>
</p>
