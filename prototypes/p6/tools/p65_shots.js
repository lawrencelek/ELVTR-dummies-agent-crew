// Prototype 6.5 (Edit 75): showcase shots. A jump over a parked car; a combo; the phone with every button installed.
// Run from prototypes/p6: node tools/p65_shots.js [outdir, default docs]
'use strict';
const path = require('path');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'docs';
const url = 'file://' + path.join(__dirname, '..', 'dummies_p6_5.html');
(async () => {
  const br = await chromium.launch();
  const start = async (pg, level) => {
    await pg.goto(url); await pg.waitForFunction(() => window.__dummies && window.__dummies.screen === 'title', null, { timeout: 30000 });
    await pg.evaluate((l) => { window.__dummies.level = l; }, level);
    await pg.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' })));
    await pg.waitForFunction(() => window.__dummies.sim && window.__dummies.sim.phase === 'play', null, { timeout: 60000 });
    pg.on('pageerror', (e) => console.log('page error:', e.message));
    await pg.waitForFunction(() => { const s = window.__dummies.sim, all = []; for (const sm of s.W6.sims) for (const c of sm.cars) if (!(c.elev || 0)) all.push(c.cls); return all.includes('sedan') && all.includes('van'); }, null, { timeout: 60000 });
    await pg.evaluate(() => { // quiet traffic, every module installed; parked copies of real cars join the view
      const s = window.__dummies.sim, tpl = {}; for (const sm of s.W6.sims) for (const c of sm.cars) if (!(c.elev || 0) && !tpl[c.cls]) tpl[c.cls] = c;
      for (const sm of s.W6.sims) { sm.cars.length = 0; sm.slot = sm.schedule.length; }
      for (const n of ['jump', 'ricochet', 'carry', 'throw', 'spine']) s.run.owned[n] = true;
      s.fakes = []; const orig = s.buildView.bind(s); s.buildView = function () { orig(); for (const f of this.fakes) this.cars.push(f); this.view = this.cars; };
      window.__car = (cls, x, y, h) => { s.fakes.push(Object.assign({}, tpl[cls], { id: 'shot-' + s.fakes.length, x, y, h, v: 0, vx: 0, vy: 0, spent: false, inEpisode: false, touched: false, state: 'cruise', man: null, intent: null })); s.buildView(); };
      window.__put = (x, y) => { const b = s.body; s.enter(s.W6.at(1, 1)); Object.assign(b, { x, y, px: x, py: y, level: 0, floor: null, mode: 'idle', vx: 0, vy: 0, lunge: null, jump: null, z: 0, charge: 3, facing: 0 }); s.buildView(); };
    });
    await pg.waitForTimeout(4500);
  };
  // the jump: over a parked van, mid-air
  let pg = await br.newPage({ viewport: { width: 1300, height: 860 } });
  const canvas = async () => pg.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
  await start(pg, 2);
  await pg.evaluate(() => { window.__car('van', 140, 196, Math.PI / 2); window.__put(60, 196); });
  await pg.keyboard.down('KeyD'); await pg.waitForTimeout(120); await pg.keyboard.press('KeyL'); await pg.waitForTimeout(250);
  await pg.screenshot({ path: path.join(OUT, 'p75_jump.png'), clip: await canvas() }); await pg.keyboard.up('KeyD');
  // a combo: two parked sedans, two dashes
  await pg.waitForTimeout(800);
  await pg.evaluate(() => { const s = window.__dummies.sim; s.fakes.length = 0; window.__car('sedan', 110, 196, Math.PI / 2); window.__car('sedan', 110, 256, Math.PI / 2); window.__put(40, 196); });
  await pg.keyboard.down('KeyD'); await pg.keyboard.press('Space'); await pg.keyboard.up('KeyD'); await pg.waitForTimeout(450);
  await pg.keyboard.down('KeyS'); await pg.waitForTimeout(650); await pg.keyboard.up('KeyS');
  await pg.keyboard.down('KeyD'); await pg.keyboard.press('Space'); await pg.keyboard.up('KeyD'); await pg.waitForTimeout(260);
  await pg.screenshot({ path: path.join(OUT, 'p75_combo.png'), clip: await canvas() });
  console.log('combo shot: points', await pg.evaluate(() => Math.round(window.__dummies.sim.run.points)), 'milestone', await pg.evaluate(() => JSON.stringify(window.__dummies.sim.milestones.firstCombo || null)));
  await pg.close();
  // the phone, every button installed, thumb on the stick
  const ctx = await br.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  pg = await ctx.newPage(); await start(pg, 0);
  const cdp = await ctx.newCDPSession(pg);
  const L = await pg.evaluate(() => window.__dummiesInput.touchLayout());
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: L.home.x, y: L.home.y, id: 0 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: L.home.x + L.sr * 0.7, y: L.home.y - L.sr * 0.45, id: 0 }] });
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: path.join(OUT, 'p75_phone.png') });
  await br.close();
})();
