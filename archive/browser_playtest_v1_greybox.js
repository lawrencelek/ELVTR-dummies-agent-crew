const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({});
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.addInitScript(() => { let v; Object.defineProperty(window, 'DummiesSim', { configurable: true, get(){ return v; },
    set(x){ const c = x.createSim; x.createSim = o => (window.__s = c(o)); v = x; } }); });
  await p.goto('file://' + require('path').resolve(__dirname, '../output/game/index.html').replace(/\\/g, '/') + '');
  const S = () => p.evaluate(() => ({ d: window.__s.dummy, c: window.__s.car, score: window.__s.score, bodies: window.__s.bodiesDestroyed }));
  const log = [];
  // 1. walk up to just below the car's lane and face up
  await p.keyboard.down('ArrowUp'); await p.waitForTimeout(700); await p.keyboard.up('ArrowUp');
  let s = await S(); log.push('after walking up: dummy y=' + s.d.y.toFixed(0) + ' (started 430)');
  let hits = 0, lunges = 0, shot = false;
  for (let i = 0; i < 1200 && hits < 4; i++) {
    await p.waitForTimeout(16); s = await S();
    if (s.d.mode === 'idle' && Math.abs(s.d.y - 350) > 6) { const k = s.d.y > 350 ? 'ArrowUp' : 'ArrowDown'; await p.keyboard.down(k); await p.waitForTimeout(40); await p.keyboard.up(k); if (k==='ArrowDown'){ await p.keyboard.down('ArrowUp'); await p.waitForTimeout(20); await p.keyboard.up('ArrowUp'); } continue; }
    if (s.c && s.c.mode === 'committed' && s.d.mode === 'idle') {
      const gap = s.d.x - s.c.x; // lunge when the car nose is about 0.12 s away from the dummy's column
      if (gap > 40 && gap < 40 + s.c.speed * 0.16) {
        if (!shot) { await p.screenshot({ path: require('path').resolve(__dirname, '../docs') + '/screenshot.png' }); shot = true; }
        const h0 = s.d.health; await p.keyboard.down('Space'); await p.waitForTimeout(100); await p.keyboard.up('Space'); lunges++;
        await p.waitForTimeout(400); s = await S();
        if (s.d.health < h0 || s.d.mode === 'destroyed') { hits++; log.push(`lunge ${lunges}: HIT health ${h0} -> ${s.d.health}, score ${s.score}, bodies ${s.bodies}`); if (hits===1) await p.screenshot({ path: require('path').resolve(__dirname, '../docs') + '/screenshot_hit.png' }); }
        else log.push(`lunge ${lunges}: miss, mode ${s.d.mode}`);
        await p.waitForTimeout(2500);
      }
    }
  }
  s = await S(); log.push(`end: health ${s.d.health}, score ${s.score}, bodies destroyed ${s.bodies}, page errors ${errs.length}`);
  console.log(log.join('\n')); await b.close();
})();
