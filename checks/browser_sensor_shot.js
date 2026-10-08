// Screenshot of a car sensing a dummy beside its lane. Usage: node sensor_shot.js <build_dir> <out_png>
const { chromium } = require('playwright'); const path = require('path');
const [buildDir, out] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const p = await b.newPage({ viewport: { width: 1100, height: 800 } }); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.addInitScript(() => { let v; Object.defineProperty(window, 'DummiesSim', { configurable: true, get() { return v; },
    set(x) { const c = x.createSim; x.createSim = o => (window.__s = c(Object.assign({}, o, { level: 1, autostart: true }))); v = x; } }); });
  await p.goto('file://' + path.resolve(buildDir, 'index.html').replace(/\\/g, '/')); await p.waitForTimeout(300);
  let st = null;
  for (let i = 0; i < 600 && !st; i++) { await p.waitForTimeout(30);
    st = await p.evaluate(() => { const s = window.__s, c = s.cars.find(k => k.x > 150 && k.x < 520); if (!c || s.mode !== 'play') return null;
      s.dummy.x = c.x + c.length / 2 + 45; s.dummy.y = c.y + 62; return c.wary && c.aware ? { id: c.id, wary: c.wary, aware: c.aware, sees: c.sees, speed: Math.round(c.speed) } : null; }); }
  await p.screenshot({ path: out }); console.log(JSON.stringify(st), 'errors', errs.length); await b.close();
})();
