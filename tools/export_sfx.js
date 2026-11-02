// Exporta la lista de efectos de sonido que declaran las escenas (S.SFX) a JSON.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [page_path, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve(page_path) + '?fmt=16x9');
  await p.evaluate(async () => { await window.__ready; });
  const sfx = await p.evaluate(() => ({ events: S.SFX.slice().sort((a, b) => a.t - b.t), end: S.END, chapters: S.CHAPTERS }));
  require('fs').writeFileSync(out, JSON.stringify(sfx, null, 1));
  console.log('events', sfx.events.length, 'end', sfx.end);
  await b.close();
})();
