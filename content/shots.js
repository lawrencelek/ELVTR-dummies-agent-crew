// Screenshots of the P2.1 build (P1.9 sim + generated content), for the Assignment 4 README. Needs Playwright 1.45+.
// Usage: NODE_PATH=<global node_modules> node content/shots.js <out_dir> [path/to/dummies_p2.html]
// The page runs on Playwright's fake clock, so each frame is captured at a known time after its event.
// Positions are staged by moving the dummy in the sim between frames; the sim's rules are unchanged.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = process.argv[2] || 'content/docs';
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.resolve(process.argv[3] || path.join(__dirname, '..', 'prototypes', 'p2', 'dummies_p2.html'));

(async () => {
  const b = await chromium.launch();
  const errs = [];
  const open = async (dpr) => {
    const p = await b.newPage({ viewport: { width: 1320, height: 800 }, deviceScaleFactor: dpr || 1 });
    p.on('pageerror', (e) => errs.push(String(e.stack || e)));
    p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); }); // fonts need the network
    await p.clock.install({ time: new Date('2026-10-15T09:00:00Z') });
    await p.goto(url);
    await p.clock.pauseAt(new Date('2026-10-15T09:00:05Z'));   // time now moves only with runFor: screenshots freeze the frame
    await p.clock.runFor(700); await p.focus('#game');
    return p;
  };
  const adv = (p, ms) => p.clock.runFor(ms);
  const key = async (p, k, ms) => { await p.keyboard.press(k); await adv(p, ms || 50); };
  const hold = async (p, k, ms) => { await p.keyboard.down(k); await adv(p, ms); await p.keyboard.up(k); };
  const shot = async (p, name) => { await p.locator('#game').screenshot({ path: path.join(out, name) }); console.log('saved', name); };
  const until = async (p, fn, arg, maxMs = 12000, step = 16) => { for (let t = 0; t < maxMs; t += step) { if (await p.evaluate(fn, arg)) return true; await adv(p, step); } return false; };
  const evCount = (p) => p.evaluate(() => window.__dummies.sim.events.length);
  const newEvent = ([n, ty]) => window.__dummies.sim.events.slice(n).some((e) => e.type === ty);
  const presented = (ty) => window.__dummies.present.some((e) => e.type === ty);
  // Put the dummy just in front of a moving car: a scored front hit within a frame or two.
  const ahead = ({ health }) => {
    const s = window.__dummies.sim, c = s.cars.find((x) => x.v > 70 && !x.spent && x.x > 160 && x.x < 640 && x.y > 140 && x.y < 470);
    if (!c || !s.body.alive || s.phase !== 'play') return false;
    const d = c.L / 2 + 12; s.body.x = c.x + Math.cos(c.h) * d; s.body.y = c.y + Math.sin(c.h) * d; s.body.facing = c.h + Math.PI; s.body.health = health;
    return true;
  };
  // Put the dummy beside a moving car's path: a near miss as it passes.
  const beside = () => {
    const s = window.__dummies.sim, c = s.cars.find((x) => x.v > 90 && !x.spent && x.x > 200 && x.x < 600 && x.y > 150 && x.y < 450);
    if (!c || !s.body.alive) return false;
    const d = c.L / 2 + 40, lat = c.W / 2 + 13 + 12; s.body.x = c.x + Math.cos(c.h) * d - Math.sin(c.h) * lat; s.body.y = c.y + Math.sin(c.h) * d + Math.cos(c.h) * lat;
    return true;
  };
  // Stand in a lane well ahead of a moving car, so it avoids the body.
  const inLane = () => {
    const s = window.__dummies.sim, c = s.cars.find((x) => x.v > 60 && x.x > 60 && x.x < 520 && x.y > 100 && x.y < 500);
    if (!c || !s.body.alive || s.phase !== 'play') return false;
    const d = c.L / 2 + 170; s.body.x = c.x + Math.cos(c.h) * d; s.body.y = c.y + Math.sin(c.h) * d; s.body.facing = c.h + Math.PI;
    return true;
  };

  // 1. Title, road, pause (L1)
  let p = await open();
  await shot(p, 'p2_title.png');
  await key(p, 'Space', 500);
  await hold(p, 'w', 1500); await adv(p, 6000);
  await shot(p, 'p2_road_lane.png');
  await key(p, 'Escape', 400); await shot(p, 'p2_pause_cuekey.png'); await key(p, 'Escape', 300);
  // 2. Near miss
  console.log('near miss staged', await until(p, beside, null, 12000, 200));
  console.log('near miss', await until(p, presented, 'near-miss', 4000));
  await adv(p, 120); await shot(p, 'p2_nearmiss.png');
  await adv(p, 1800);
  // 3. Miss: lunge into open floor near the traffic
  await p.evaluate(() => { const s = window.__dummies.sim, b = s.body, c = s.cars[0]; b.x = c ? Math.min(680, Math.max(120, c.x)) : 400; b.y = 520; b.facing = -Math.PI / 2; b.charge = 3; });
  await p.keyboard.press('Space');
  console.log('miss', await until(p, presented, 'miss', 3000));
  await adv(p, 120); await shot(p, 'p2_miss.png');
  await adv(p, 2000);
  // 4. Scored front hit: frames during the juice
  let n = await evCount(p);
  console.log('impact staged', await until(p, ahead, { health: 280 }, 12000, 200));
  console.log('impact', await until(p, newEvent, [n, 'impact'], 3000));
  await adv(p, 50); await shot(p, 'p2_impact.png');
  await adv(p, 180); await shot(p, 'p2_impact_late.png');
  await adv(p, 2000);
  // 5. Write-off, report, shop; buy Hips; next road; first car to react to the new body
  n = await evCount(p);
  console.log('write-off staged', await until(p, ahead, { health: 1 }, 12000, 200));
  console.log('write-off', await until(p, newEvent, [n, 'writeoff'], 3000));
  await adv(p, 200); await shot(p, 'p2_writeoff.png');
  await adv(p, 1600); await shot(p, 'p2_report.png');
  await key(p, 'Space', 500);
  await p.evaluate(() => window.__dummies.sim.buy('hips')); await adv(p, 300);
  await shot(p, 'p2_shop.png');
  await key(p, 'k', 800);   // B: deploy -> next road (L2)
  console.log('lane staged', await until(p, inLane, null, 12000, 200));
  console.log('upgrade seen', await until(p, presented, 'upgrade-seen', 8000));
  await adv(p, 200); await shot(p, 'p2_upgrade.png');
  console.log('presentation log:', await p.evaluate(() => window.__dummies.present.map((e) => e.type === 'bark' ? 'bark(' + e.event + ')' : e.type).join(' ')));
  await p.close();
  // 6. L3 corner and L2 barrier after some traffic
  p = await open();
  await key(p, 'ArrowDown'); await key(p, 'ArrowDown', 200); await key(p, 'Space', 9000); await shot(p, 'p2_corner.png');
  await p.close();
  p = await open();
  await key(p, 'ArrowDown', 200); await key(p, 'Space', 8000); await shot(p, 'p2_barrier.png');
  await p.close();
  // 7. Close-up at 2x: a front hit with its bubble, burst, ring and popup
  const z = await open(2);
  await key(z, 'Space', 3000);
  n = await evCount(z);
  await until(z, ahead, { health: 280 }, 12000, 200);
  await until(z, newEvent, [n, 'impact'], 3000); await adv(z, 60);
  const box = await z.locator('#game').boundingBox(), k = box.width / 1280;
  const at = await z.evaluate(() => { const s = window.__dummies.sim; return { x: s.body.x, y: s.body.y }; });
  const cx = Math.max(240, Math.min(240 + 800 - 420, 240 + at.x - 210)), cy = Math.max(60, Math.min(60 + 600 - 230, 60 + at.y - 150));
  await z.screenshot({ path: path.join(out, 'p2_closeup.png'), clip: { x: box.x + cx * k, y: box.y + cy * k, width: 420 * k, height: 230 * k } });
  console.log('saved p2_closeup.png');
  console.log('page errors:', errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
