// Screenshots of the P2 build (P1.9 sim + generated content), for the Assignment 4 README. Needs Playwright.
// Usage: NODE_PATH=<global node_modules> node content/shots.js <out_dir> [path/to/dummies_p2.html]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = process.argv[2] || 'content/docs';
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.resolve(process.argv[3] || path.join(__dirname, '..', 'prototypes', 'p2', 'dummies_p2.html'));

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1320, height: 800 }, deviceScaleFactor: 1 });
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); }); // fonts need the network
  const shot = async (name) => { await p.locator('#game').screenshot({ path: path.join(out, name) }); console.log('saved', name); };
  await p.goto(url); await p.waitForTimeout(800);
  await p.focus('#game');
  await shot('p2_title.png');
  // L1: walk into the lane so cars stop short, honk and leave tyre marks.
  await p.keyboard.press('Space'); await p.waitForTimeout(500);
  await p.keyboard.down('w'); await p.waitForTimeout(1500); await p.keyboard.up('w');
  await p.waitForTimeout(6500);
  await shot('p2_road_lane.png');
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  await shot('p2_pause_cuekey.png');
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  // Scored impact: place a nearly spent body just ahead of a moving car's nose.
  let placed = false;
  for (let tries = 0; tries < 40 && !placed; tries++) {
    placed = await p.evaluate(() => {
      const s = window.__dummies.sim, c = s.cars.find((x) => x.v > 80 && !x.spent && x.x > 120 && x.x < 560 && x.y > 100 && x.y < 500);
      if (!c) return false;
      const d = c.L / 2 + 22; s.body.x = c.x + Math.cos(c.h) * d; s.body.y = c.y + Math.sin(c.h) * d; s.body.health = 120;
      return true;
    });
    if (!placed) await p.waitForTimeout(250);
  }
  console.log('impact setup', placed);
  await p.waitForTimeout(160); await shot('p2_impact.png');
  await p.waitForTimeout(900);
  // Write-off: repeat with health 1.
  for (let tries = 0, ok = false; tries < 40 && !ok; tries++) {
    ok = await p.evaluate(() => {
      const s = window.__dummies.sim, c = s.cars.find((x) => x.v > 80 && !x.spent && x.x > 120 && x.x < 560 && x.y > 100 && x.y < 500);
      if (!c || !s.body.alive || s.phase !== 'play') return false;
      const d = c.L / 2 + 22; s.body.x = c.x + Math.cos(c.h) * d; s.body.y = c.y + Math.sin(c.h) * d; s.body.health = 1;
      return true;
    });
    if (!ok) await p.waitForTimeout(250);
  }
  await p.waitForTimeout(350); await shot('p2_writeoff.png');
  await p.waitForTimeout(1500); await shot('p2_report.png');
  await p.keyboard.press('Space'); await p.waitForTimeout(500); await shot('p2_shop.png');
  // L3 corner, after some traffic.
  await p.goto(url); await p.waitForTimeout(600); await p.focus('#game');
  await p.keyboard.press('ArrowDown'); await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200);
  await p.keyboard.press('Space'); await p.waitForTimeout(9000);
  await shot('p2_corner.png');
  // L2 barrier.
  await p.goto(url); await p.waitForTimeout(600); await p.focus('#game');
  await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200);
  await p.keyboard.press('Space'); await p.waitForTimeout(8000);
  await shot('p2_barrier.png');
  // Close-up at 2x: roof liveries, dummy markings, tyre marks.
  const z = await b.newPage({ viewport: { width: 1320, height: 800 }, deviceScaleFactor: 2 });
  z.on('pageerror', (e) => errs.push(String(e)));
  await z.goto(url); await z.waitForTimeout(600); await z.focus('#game');
  await z.keyboard.press('Space'); await z.waitForTimeout(400);
  await z.keyboard.down('w'); await z.waitForTimeout(1500); await z.keyboard.up('w'); await z.waitForTimeout(5500);
  const box = await z.locator('#game').boundingBox(), k = box.width / 1280;
  await z.screenshot({ path: path.join(out, 'p2_closeup.png'), clip: { x: box.x + (240 + 300) * k, y: box.y + (60 + 200) * k, width: 420 * k, height: 190 * k } });
  console.log('saved p2_closeup.png');
  console.log('page errors:', errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
