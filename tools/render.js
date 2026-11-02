#!/usr/bin/env node
/*
 * Renderizador determinista HTML -> MP4.
 * La página debe exponer:  window.__ready (Promise), window.__seek(t) (pinta el estado en el segundo t)
 * Uso:
 *   node tools/render.js --page episodios/ep01/video/index.html --query "fmt=16x9" \
 *        --w 1920 --h 1080 --fps 30 --start 0 --end 346.7 --workers 3 \
 *        --audio audio.wav --out out/ep01_16x9.mp4 [--crf 18] [--still 12.5 --png frame.png]
 */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function args() {
  const a = process.argv.slice(2), o = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith('--')) { const k = a[i].slice(2); const v = (a[i + 1] && !a[i + 1].startsWith('--')) ? a[++i] : true; o[k] = v; }
  }
  return o;
}
const A = args();
const W = +(A.w || 1920), H = +(A.h || 1080), FPS = +(A.fps || 30);
const page_url = 'file://' + path.resolve(A.page) + (A.query ? ('?' + A.query) : '');
const LAUNCH = { args: ['--disable-frame-rate-limit', '--disable-gpu-vsync', '--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'] };

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
  page.on('pageerror', e => console.error('[pageerror]', e.message));
  await page.goto(page_url);
  await page.evaluate(async () => { await document.fonts.ready; if (window.__ready) await window.__ready; });
  const cdp = await page.context().newCDPSession(page);
  return { page, cdp };
}
async function grab(page, cdp, t, fmt) {
  await page.evaluate(tt => window.__seek(tt), t);
  const r = await cdp.send('Page.captureScreenshot', fmt === 'png'
    ? { format: 'png', optimizeForSpeed: true, captureBeyondViewport: false }
    : { format: 'jpeg', quality: 95, optimizeForSpeed: true, captureBeyondViewport: false });
  return Buffer.from(r.data, 'base64');
}

async function stills() {
  // --still "1.5,10,22" --png prefix  -> prefix_001.5.png ...
  const browser = await chromium.launch(LAUNCH);
  const { page, cdp } = await openPage(browser);
  const times = String(A.still).split(',').map(Number);
  for (const t of times) {
    const buf = await grab(page, cdp, t, 'png');
    const f = `${A.png}_${t.toFixed(2).padStart(7, '0')}.png`;
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, buf);
    console.log('still', f);
  }
  await browser.close();
}

async function renderChunk(k, f0, f1, outFile, fmt) {
  const browser = await chromium.launch(LAUNCH);
  const { page, cdp } = await openPage(browser);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS),
    '-c:v', fmt === 'png' ? 'png' : 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', A.preset || 'medium', '-crf', String(A.crf || 18), '-pix_fmt', 'yuv420p',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-r', String(FPS), '-g', String(FPS * 2), '-bf', '2', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    const buf = await grab(page, cdp, f / FPS, fmt);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 300 === 0) console.log(`[w${k}] frame ${f - f0}/${f1 - f0}  ${((Date.now() - t0) / Math.max(1, f - f0)).toFixed(1)} ms/f`);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
  await browser.close();
}

async function main() {
  if (A.still) return stills();
  const start = +(A.start || 0), end = +A.end;
  const F0 = Math.round(start * FPS), F1 = Math.round(end * FPS);
  const workers = +(A.workers || 3), fmt = A.fmt || 'png';
  const tmp = A.out + '.parts'; fs.mkdirSync(tmp, { recursive: true });
  const per = Math.ceil((F1 - F0) / workers), jobs = [];
  const t0 = Date.now();
  for (let k = 0; k < workers; k++) {
    const a = F0 + k * per, b = Math.min(F1, a + per);
    if (a >= b) continue;
    jobs.push(renderChunk(k, a, b, path.join(tmp, `part_${k}.mp4`), fmt).then(() => path.join(tmp, `part_${k}.mp4`)));
  }
  const parts = await Promise.all(jobs);
  fs.writeFileSync(path.join(tmp, 'list.txt'), parts.map(p => `file '${path.resolve(p)}'`).join('\n'));
  const cat = ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt')];
  if (A.audio) cat.push('-ss', String(start), '-t', String(end - start), '-i', A.audio);
  cat.push('-map', '0:v:0');
  if (A.audio) cat.push('-map', '1:a:0', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000');
  cat.push('-c:v', 'copy', '-movflags', '+faststart', '-shortest', A.out);
  await new Promise((res, rej) => spawn('ffmpeg', cat, { stdio: 'inherit' }).on('close', c => c === 0 ? res() : rej(new Error('concat ' + c))));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`OK ${A.out}  ${(F1 - F0)} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
main().catch(e => { console.error(e); process.exit(1); });
