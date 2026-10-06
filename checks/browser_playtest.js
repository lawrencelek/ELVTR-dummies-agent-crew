// Browser playtest for the DUMMIES vertical slice (needs Playwright; not part of the release gate).
// Usage: node browser_playtest.js <build_dir> <out_dir>
const { chromium } = require('playwright'); const path = require('path');
const [buildDir, outDir] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const url = 'file://' + path.resolve(buildDir, 'index.html').replace(/\\/g, '/'); const log = [];
  for (const level of [0, 1, 2, 3]) {
    const p = await b.newPage({ viewport: { width: 1100, height: 800 } }); const errs = [], reqs = [];
    p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('request', r => { if (!r.url().startsWith('file:')) reqs.push(r.url()); });
    await p.addInitScript((lv) => { let v; Object.defineProperty(window, 'DummiesSim', { configurable: true, get() { return v; },
      set(x) { const c = x.createSim; x.createSim = o => (window.__s = c(lv ? Object.assign({}, o, { level: lv, autostart: true }) : o)); v = x; } }); }, level);
    await p.goto(url); await p.waitForTimeout(400);
    const S = () => p.evaluate(() => ({ mode: __s.mode, level: __s.level, x: __s.dummy.x, y: __s.dummy.y, lunging: __s.dummy.lunging, cars: __s.cars.length, health: __s.dummy.health, t: __s.time }));
    if (level === 0) {       // the real start: attract screen, a key press begins, keys move, Space lunges once
      let s = await S(); log.push('start mode: ' + s.mode); await p.screenshot({ path: path.join(outDir, 'screenshot_attract.png') });
      await p.keyboard.press('Enter'); await p.waitForTimeout(300); s = await S(); log.push('after a key press: ' + s.mode + ', level ' + s.level);
      const a = await S(); await p.keyboard.down('d'); await p.waitForTimeout(1000); await p.keyboard.up('d'); const c = await S();
      log.push('held D for 1 s: moved ' + (c.x - a.x).toFixed(0) + ' px right, ' + (c.y - a.y).toFixed(0) + ' px down');
      await p.waitForTimeout(1200); const c2 = await S(); await p.keyboard.down('w'); await p.keyboard.down('d'); await p.waitForTimeout(1000); await p.keyboard.up('w'); await p.keyboard.up('d'); const e = await S();
      log.push('held W+D for 1 s: moved ' + Math.hypot(e.x - c2.x, e.y - c2.y).toFixed(0) + ' px diagonally (after a pause, so both start from walking speed)');
      await p.waitForTimeout(700); const f = await S(); await p.keyboard.down('w'); await p.keyboard.down(' '); await p.waitForTimeout(1500); await p.keyboard.up(' '); await p.keyboard.up('w'); const g = await S();
      log.push('held W+Space for 1.5 s: moved ' + (f.y - g.y).toFixed(0) + ' px up (one lunge plus walking; chained lunges would be far more)');
    } else {                 // jump straight to a level to see its layout with traffic
      await p.waitForTimeout(level === 1 ? 9000 : 12000); const s = await S(); log.push(`level ${level}: mode ${s.mode}, ${s.cars} cars on screen after ${s.t.toFixed(0)} s`);
      await p.screenshot({ path: path.join(outDir, `screenshot_level${level}.png`) });
    }
    log.push(`  page errors: ${errs.length}${errs.length ? ' ' + errs[0] : ''}; network requests: ${reqs.length}`); await p.close();
  }
  console.log(log.join('\n')); await b.close();
})();
