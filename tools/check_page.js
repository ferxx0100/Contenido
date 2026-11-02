// Carga la página del episodio y reporta errores de consola (p. ej. "cue no encontrado") y escenas.
// Uso: node tools/check_page.js episodios/ep02/video/index.html [fmt]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const [pg, fmt = '16x9'] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: fmt === '9x16' ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 } });
  const errs = []; p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); }); p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto('file://' + path.resolve(pg) + '?fmt=' + fmt); await p.evaluate(async () => { await window.__ready; });
  const info = await p.evaluate(() => S.scenes.map(s => ({ id: s.id, start: +s.start.toFixed(2), end: +s.end.toFixed(2) })));
  await p.evaluate(() => { for (let t = 0; t < TIMING.duration + 3; t += 0.5) window.__seek(t); });
  console.log(JSON.stringify({ errors: errs, scenes: info }, null, 0)); await b.close();
})();
