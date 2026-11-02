// SISTEMA · Dirección A — render de style frames
// Uso:  node render.js            (todos)
//       node render.js 3 7        (solo esos ids)
//       node render.js --debug 3  (con cajas de tinta)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const DIR = __dirname;
const OUT = path.join(DIR, 'png');
const REV = path.join(DIR, 'review');
const FRAMES = [
  { id: 1, name: 'f01_cold_open', w: 1920, h: 1080 },
  { id: 2, name: 'f02_title', w: 1920, h: 1080 },
  { id: 3, name: 'f03_stat_deloitte', w: 1920, h: 1080 },
  { id: 4, name: 'f04_razon', w: 1920, h: 1080 },
  { id: 5, name: 'f05_estado_de_cuenta', w: 1920, h: 1080 },
  { id: 6, name: 'f06_stat_bbva', w: 1920, h: 1080 },
  { id: 7, name: 'f07_tagline', w: 1920, h: 1080 },
  { id: 8, name: 'f08_paso', w: 1920, h: 1080 },
  { id: 9, name: 'f09_clip_vertical', w: 1080, h: 1920 },
  { id: 10, name: 'f10_thumbnail', w: 1280, h: 720 },
  { id: 11, name: 'f11_cover', w: 3000, h: 3000 },
  { id: 12, name: 'f09_clip_vertical_guias', w: 1080, h: 1920 },
  { id: 13, name: 'f10b_thumbnail_15_40', w: 1280, h: 720 },
  { id: 20, name: 'f20_thumbnail_ep02', w: 1280, h: 720 },
];

(async () => {
  const args = process.argv.slice(2);
  const dbg = args.includes('--debug');
  const ids = args.filter(a => /^\d+$/.test(a)).map(Number);
  const list = ids.length ? FRAMES.filter(f => ids.includes(f.id)) : FRAMES;
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(REV, { recursive: true });

  const browser = await chromium.launch();
  const url = 'file://' + path.join(DIR, 'frames.html');

  for (const f of list) {
    const page = await browser.newPage({ viewport: { width: f.w, height: f.h }, deviceScaleFactor: 1 });
    page.on('console', m => { if (m.type() === 'error') console.log(`[${f.name}]`, m.text()); });
    page.on('pageerror', e => console.log(`[${f.name}] pageerror`, e.message));
    await page.goto(`${url}?frame=${f.id}${dbg ? '&debug=1' : ''}`);
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
    const file = path.join(dbg ? REV : OUT, `${f.name}${dbg ? '_debug' : ''}.png`);
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: f.w, height: f.h } });
    console.log('ok', path.relative(DIR, file));
    await page.close();
  }

  if (!ids.length && !dbg) {
    // Hoja de contactos (coherencia entre frames)
    const page = await browser.newPage({ viewport: { width: 2000, height: 1200 } });
    await page.goto(url);
    await page.waitForFunction(() => window.__ready === true);
    await page.screenshot({ path: path.join(REV, 'contact_sheet.png'), fullPage: true });
    await page.close();
  }

  if (!ids.length || ids.includes(11)) {
    // Prueba de legibilidad de la portada a 60 / 120 px (y ampliada x4 para verla)
    const cover = 'file://' + path.join(OUT, 'f11_cover.png');
    const page = await browser.newPage({ viewport: { width: 760, height: 300 } });
    const testHtml = path.join(REV, '_cover_test.html');
    fs.writeFileSync(testHtml, `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#1b1916;display:flex;gap:24px;padding:20px;align-items:flex-start;color:#ccc;font:12px monospace">
      <div><img src="${cover}" style="width:60px;height:60px;display:block"><p>60px</p></div>
      <div><img src="${cover}" style="width:120px;height:120px;display:block"><p>120px</p></div>
      <div><canvas id="c" width="240" height="240" style="image-rendering:pixelated;width:240px;height:240px"></canvas><p>60px ampliado x4</p></div>
      <script>const i=new Image();i.onload=()=>{const s=document.createElement('canvas');s.width=s.height=60;const x=s.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(i,0,0,60,60);const c=document.getElementById('c').getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(s,0,0,240,240);window.done=1};i.src='${cover}';<\/script></body>`);
    await page.goto('file://' + testHtml);
    await page.waitForFunction(() => window.done === 1);
    await page.screenshot({ path: path.join(REV, 'cover_60px_test.png') });
    await page.close();
  }
  await browser.close();
})();
