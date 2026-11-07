// Renders the first page of each PDF in public/pdf/ to public/pdf/previews/<name>.webp,
// and records each preview's size in src/data/pdf-previews.json.
//
// Phones (Android Chrome in particular) do not show PDFs inside an iframe, so
// the resume and certificate pages show this preview image and link to the PDF.
// Run it again whenever a PDF changes:
//
//   node scripts/pdf-previews.mjs
//
// No dependencies of its own: it drives the local Chrome over the DevTools
// protocol (Node 22 has a global WebSocket) and crops with sharp, which Next
// already installs. Set CHROME=/path/to/chrome if Chrome is elsewhere.
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const PDF_DIR = join(ROOT, "public", "pdf");
const OUT_DIR = join(PDF_DIR, "previews");
// Sizes of the previews, read by the resume and certificate pages.
const INDEX = join(ROOT, "src", "data", "pdf-previews.json");
const index = {};

const CANDIDATES = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const CHROME = CANDIDATES.find((p) => existsSync(p));
if (!CHROME) {
  console.error("Chrome not found. Set CHROME=/path/to/chrome.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "pdfprev-"))}`,
  "--no-first-run",
  "--hide-scrollbars",
  "about:blank",
]);

let ws;
for (let i = 0; i < 50 && !ws; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const page = list.find((t) => t.type === "page");
    if (page) {
      const socket = new WebSocket(page.webSocketDebuggerUrl);
      await new Promise((r, j) => {
        socket.addEventListener("open", r);
        socket.addEventListener("error", j);
      });
      ws = socket;
      break;
    }
  } catch {}
  await sleep(200);
}
if (!ws) {
  chrome.kill();
  throw new Error("Could not connect to Chrome.");
}
let id = 0;
const pending = new Map();
ws.addEventListener("message", (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

mkdirSync(OUT_DIR, { recursive: true });
await send("Page.enable");

for (const file of readdirSync(PDF_DIR).filter((f) => f.endsWith(".pdf"))) {
  const name = file.replace(/\.pdf$/, "");
  // A first look at the page shape decides the viewport: portrait or landscape.
  for (const [w, h] of [[1240, 1754], [1600, 1132]]) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 2, mobile: false });
    await send("Page.navigate", { url: `${pathToFileURL(join(PDF_DIR, file)).href}#toolbar=0&navpanes=0&view=Fit` });
    await sleep(4500);
    const shot = await send("Page.captureScreenshot", { format: "png" });
    const png = Buffer.from(shot.result.data, "base64");
    // Crop away the viewer's dark surround, keep the page.
    const page = await sharp(png).trim({ background: "#282828", threshold: 24 }).toBuffer({ resolveWithObject: true });
    const portrait = page.info.height > page.info.width;
    if (portrait === h > w) {
      const out = join(OUT_DIR, `${name}.webp`);
      const meta = await sharp(page.data).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 88 }).toFile(out);
      index[`/pdf/${file}`] = { src: `/pdf/previews/${name}.webp`, width: meta.width, height: meta.height };
      console.log(`${file} -> previews/${name}.webp ${meta.width}x${meta.height}`);
      break;
    }
  }
}

writeFileSync(INDEX, `${JSON.stringify(index, null, 2)}\n`);
console.log(`wrote ${INDEX}`);

ws.close();
chrome.kill();
process.exit(0);
