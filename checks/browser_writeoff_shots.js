// Captures the write-off animation in a real browser. Usage: node writeoff_shots.js <build_dir> <out_dir>
const { chromium } = require('playwright'); const path = require('path');
const [buildDir, outDir] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const p = await b.newPage({ viewport: { width: 1100, height: 800 } }); const errs = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => { let v; Object.defineProperty(window, 'DummiesSim', { configurable: true, get() { return v; },
    set(x) { const c = x.createSim; x.createSim = o => (window.__s = c(Object.assign({}, o, { level: 1, autostart: true }))); v = x; } }); });
  await p.goto('file://' + path.resolve(buildDir, 'index.html').replace(/\\/g, '/')); await p.waitForTimeout(300);
  // wait for a car well inside the hall, then put a nearly-dead dummy on its nose
  let placed = false;
  for (let i = 0; i < 400 && !placed; i++) { await p.waitForTimeout(50);
    placed = await p.evaluate(() => { const s = window.__s, c = s.cars.find(k => !k.hit && k.x > 250 && k.x < 500 && k.speed > 60); if (!c || s.mode !== 'play') return false;
      s.dummy.health = 1; s.dummy.x = c.x + c.dirX * (c.length / 2 + 6); s.dummy.y = c.y; return true; }); }
  const log = ['dummy placed on a car nose: ' + placed]; let t0 = Date.now(), seen = false;
  for (let i = 0; i < 40 && !seen; i++) { seen = await p.evaluate(() => window.__s.mode === 'writeoff'); if (!seen) await p.waitForTimeout(15); }
  log.push('mode writeoff reached: ' + seen); t0 = Date.now();
  for (const [name, at] of [['a', 120], ['b', 380], ['c', 700]]) { const wait = at - (Date.now() - t0); if (wait > 0) await p.waitForTimeout(wait);
    const st = await p.evaluate(() => ({ mode: __s.mode, w: __s.writeOff && { t: +__s.writeOff.t.toFixed(2), d: __s.writeOff.duration } }));
    await p.screenshot({ path: path.join(outDir, 'writeoff_' + name + '.png') }); log.push(`shot ${name} at ${Date.now() - t0} ms: mode ${st.mode}, writeOff ${JSON.stringify(st.w)}`); }
  await p.waitForTimeout(1200); const end = await p.evaluate(() => ({ mode: __s.mode, card: __s.card && __s.card.title, bodies: __s.bodiesDestroyed }));
  await p.screenshot({ path: path.join(outDir, 'writeoff_card.png') }); log.push('after the animation: ' + JSON.stringify(end));
  await p.keyboard.press('Enter'); await p.waitForTimeout(300); log.push('after a key press: mode ' + await p.evaluate(() => __s.mode + ', health ' + __s.dummy.health));
  log.push('page errors: ' + errs.length + (errs.length ? ' ' + errs[0] : '')); console.log(log.join('\n')); await b.close();
})();
