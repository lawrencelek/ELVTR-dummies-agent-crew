// Prototype 6.5 (GDD Edit 75) checks. Run from prototypes/p6: node test_p65.js [screenshot folder]
// 1. Headless (sim.js + world6.js): DIRECT turning; B jump over cars, handrails and jumpable pieces; X grab, Y throw;
//    combo scoring; Ricochet; the jumpable tag; 6.4 frozen.
// 2. Browser (Playwright, dummies_p6_5.html): keys, an emulated USB joypad (phantom in slot 0, hat d-pad, button setup),
//    touch on a phone held sideways (analog stick, the A/B/X/Y diamond), the upright-phone prompt, no page errors.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execSync } = require('child_process');
const W6 = require('./world6.js');
const X = require('./sim.js');
const OUT = process.argv[2] || null;
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else fail++; console.log((c ? 'PASS ' : 'FAIL ') + msg); };
const DEG = 180 / Math.PI;

function setup(id) { // a district with its traffic cleared; fake parked cars join the view
  const s = new W6.Sim6(id || 'monument', {}, null, { warm: 0 });
  for (const sm of s.W6.sims) { sm.cars.length = 0; sm.slot = sm.schedule.length; sm.deckNext = { 0: 1e9, 1: 1e9, 2: 1e9, 3: 1e9 }; }
  s.fakes = []; const orig = s.buildView.bind(s);
  s.buildView = function () { orig(); for (const f of this.fakes) if (!f.scr || f.scr === this.screenName()) this.cars.push(f); this.view = this.cars; };
  s.buildView();
  return s;
}
const place = (s, x, y, scn, lv, fl) => {
  if (scn) s.enter(s.W6.at('ABC'.indexOf(scn[0]), +scn[1] - 1));
  Object.assign(s.body, { x, y, px: x, py: y, level: lv || 0, floor: fl == null ? null : fl, stair: null, drop: null, mode: 'idle', vx: 0, vy: 0, lunge: null, jump: null, z: 0, charge: 3, alive: true, facing: 0, combo: null });
  s.buildView(); s.events.length = 0;
};
const car = (s, cls, x, y, h, v) => ({ id: 'test-' + cls + '-' + s.fakes.length, model: 'TEST', cls, x, y, h, L: s.P['vehicles.' + cls + '.length'], W: s.P['vehicles.' + cls + '.width'], v: v || 0, vx: Math.cos(h) * (v || 0), vy: Math.sin(h) * (v || 0), elev: 0, spent: false, inEpisode: false, touched: false, state: 'cruise' });
const run = (s, n, cmd) => { for (let i = 0; i < n; i++) { s.step(typeof cmd === 'function' ? cmd(i) : cmd || {}); while (s.phase === 'hitstop' || s.phase === 'scroll') s.step({}); } };
const ev = (s, t) => s.events.filter((e) => e.type === t);
const RX = 40, RY = 196; // Monument B2: a clear run 260 long at this row

// ---------- 1. headless
{ // DIRECT
  const s = setup(); const P = s.P;
  ok(P['proto.turnModel'] === 2 && P['proto.input.fourButtons'] === 1 && P['proto.combo'] === 1, 'P6.5 runs DIRECT turning (proto.turnModel 2), four buttons and combos; the shared sim keeps 6.4\'s rules (' + X.PROTO['proto.turnModel'] + ', ' + X.PROTO['proto.input.fourButtons'] + ', ' + X.PROTO['proto.combo'] + ')');
  place(s, RX, RY); s.body.facing = 0; s.step({ mx: 0, my: -1, aPress: true });
  const L = s.body.lunge;
  ok(L && Math.abs(L.dir * DEG + 90) < 0.5, `DIRECT: facing east, push north and dash: the dash goes north (${L ? (L.dir * DEG).toFixed(0) : '—'}°)`);
  place(s, RX, RY); run(s, 60, { mx: 0.5, my: 0 }); const half = s.body.x - RX;
  place(s, RX, RY); run(s, 60, { mx: 1, my: 0 }); const full = s.body.x - RX;
  ok(half > 20 && full > half * 1.7, `DIRECT: speed scales with tilt: half ${half.toFixed(0)}, full ${full.toFixed(0)} in 1 s`);
  place(s, RX + 100, RY); run(s, 40, { mx: 1, my: 0 }); const x0 = s.body.x; run(s, 15, { mx: -1, my: 0 });
  ok(s.body.x < x0 - 5 && s.body.mode === 'move', `DIRECT: a reversal moves back at once, no counter-press stop (${(x0 - s.body.x).toFixed(0)} back in 0.25 s)`);
}
{ // B jump
  const s = setup();
  place(s, RX, RY); s.step({ mx: 1, my: 0, bPress: true });
  const d = ev(s, 'denied')[0];
  ok(s.body.mode !== 'jump' && d && d.action === 'jump' && d.why === 'locked', 'B without the Jump module: denied, "locked"');
  s.run.owned.jump = true;
  const res = {};
  for (const cls of ['sedan', 'van', 'bus']) {
    s.fakes.length = 0; const c = car(s, cls, RX + 80, RY, Math.PI / 2); s.fakes.push(c);
    place(s, RX, RY); run(s, 6, { mx: 1, my: 0 }); s.step({ mx: 1, my: 0, bPress: true });
    let top = 0; run(s, 50, (i) => { top = Math.max(top, s.body.z); return { mx: 1, my: 0 }; });
    res[cls] = { hit: ev(s, 'impact').length, x: s.body.x, top };
  }
  const P = s.P;
  ok(!res.sedan.hit && !res.van.hit && res.sedan.x > RX + 120 && res.van.x > RX + 120 && res.bus.hit === 1,
    `B jumps ${P['upgrades.jumpDistance']} in ${P['upgrades.jumpAirtime']} s, ${res.sedan.top.toFixed(0)} high: over a sedan (${P['vehicles.sedan.height']}) and a van (${P['vehicles.van.height']}); a bus (${P['vehicles.bus.height']}) stops it`);
  s.fakes.length = 0; s.fakes.push(car(s, 'sedan', RX + 80, RY, Math.PI / 2));
  place(s, RX, RY); run(s, 90, { mx: 1, my: 0 });
  ok(ev(s, 'impact').length === 1, 'without a jump the dummy walks into the sedan');
  s.fakes.length = 0; place(s, RX, RY); s.body.charge = 0.5; s.step({ mx: 1, my: 0, bPress: true });
  ok(s.body.mode !== 'jump' && ev(s, 'denied').length === 1, `a jump costs battery.jumpCost (${P['battery.jumpCost']}): refused at half a charge`);
}
{ // the jumpable tag: pieces at Z0; railed floors above
  const counts = {};
  for (const id of W6.LEVEL_LIST) { const w = W6.buildWorld(id, { budget: 0 }); counts[id] = w.scs.reduce((a, sc) => a + sc.game.statics.filter((q) => q.jumpable).length, 0); }
  const s = setup(); s.run.owned.jump = true;
  const sc = s.W6.at(1, 1), jq = sc.game.statics.filter((q) => q.jumpable), edge = sc.game.statics.filter((q) => q.kind === 'planter' || q.kind === 'bound' || q.kind === 'wall');
  const allLow = jq.every((q) => q.ht <= s.P['proto.art.jumpableTop'] && Math.min(q.piece[2], q.piece[3]) <= s.P['world.jumpableDepth']) && edge.every((q) => !q.jumpable);
  ok(counts.parkland + counts.monument + counts.waterfront > 40 && allLow, `jumpable tag: ${counts.parkland} Parkland, ${counts.waterfront} Waterfront, ${counts.monument} Monument runs at Z0: planters drawn ≤ ${s.P['proto.art.jumpableTop']} art px, ≤ ${s.P['world.jumpableDepth']} deep; edge planters, holds and walls never`);
  // jump across a jumpable piece: one with clear ground both sides along x, nothing else solid in the way
  let crossed = null;
  for (const id of ['monument', 'parkland', 'waterfront']) {
    const sj = id === 'monument' ? s : setup(id); sj.run.owned.jump = true;
    for (const sc2 of sj.W6.scs) {
      const G = sc2.game, seen = new Set(), scn = sc2.name;
      for (const q of G.statics.filter((q2) => q2.jumpable)) {
        const [px, py, pw, ph] = q.piece, key = q.piece.join(); if (seen.has(key) || pw > 48 || ph < 12) continue; seen.add(key);
        const y = py + ph / 2, xa = px - 30, xb = px + pw + 40; let clear = W6.groundFree(sc2, xa, y, 14) && W6.groundFree(sc2, xb, y, 14) && xa > 20 && xb < 780;
        for (let x = xa; clear && x <= xb; x += 4) for (const oy of [-12, 0, 12]) if (G.statics.some((o) => !o.jumpable && W6.inR(o, x, y + oy, 0)) || G.polys0.some((pl) => globalThis.PIX.inPoly(pl, x, y + oy))) clear = false;
        if (!clear) continue;
        place(sj, xa, y, scn); run(sj, 40, { mx: 1, my: 0 }); const walked = sj.body.x;
        place(sj, xa, y, scn); sj.step({ mx: 1, my: 0, bPress: true }); run(sj, 40, { mx: 1, my: 0 });
        if (walked < px && sj.body.x > px + pw && sj.screenName() === scn) { crossed = { id, scn, walked, after: sj.body.x, pw, ph }; break; }
      }
      if (crossed) break;
    }
    if (crossed) break;
  }
  ok(!!crossed, crossed ? `${crossed.id} ${crossed.scn}: a planter ${crossed.pw} × ${crossed.ph} blocks a walk (x ${crossed.walked.toFixed(0)}); a jump clears it (x ${crossed.after.toFixed(0)})` : 'no jumpable piece found to cross');
}
{ // over a walkway's handrail: drop to the street; walking holds
  const s = setup('parkland'); s.run.owned.jump = true;
  const sc = s.W6.at(2, 0), fi = sc.game.floors.findIndex((f) => f.kind === 'walk');
  let x = null; for (let q = 100; q < 700 && x == null; q += 10) if (sc.game.floors[fi].has(q, 320) && !sc.walk.gapAt(q, 360) && !sc.walk.gapAt(q, 280)) x = q;
  place(s, x, 320, 'C1', 1, fi); run(s, 60, { mx: 0, my: 1 }); const held = s.body.level === 1;
  place(s, x, 320, 'C1', 1, fi); s.step({ mx: 0, my: 1, bPress: true }); run(s, 80, {});
  ok(held && s.body.level === 0 && ev(s, 'rail-jump').length === 1 && ev(s, 'deck-drop').length === 1, `Parkland C1 walkway: walking holds at the handrail; B jumps it and drops to the street (y ${s.body.y.toFixed(0)}, Z${s.body.level})`);
  const f = sc.game.floors.find((q) => q.kind === 'deck' || q.kind === 'ring');
  ok(sc.game.floors.filter((q) => q.rail).every((q) => q.kind === 'walk' || q.kind === 'deck' || q.kind === 'ring') && (!f || f.rail), 'railed floors (jumpable): walkways, highway decks and lifted rings');
}
{ // X grab and place; Y throw
  const s = setup(); const cn = s.cones[0];
  place(s, cn.x - 22, cn.y); s.step({ xPress: true });
  const locked = ev(s, 'denied')[0];
  s.run.owned.carry = true; place(s, cn.x - 22, cn.y); s.step({ xPress: true }); const got = s.body.held === cn;
  s.step({}); s.step({ xPress: true }); const placed = !s.body.held && cn.state === 'free';
  s.step({ xPress: true }); s.step({ yPress: true }); const noThrow = ev(s, 'denied').find((e) => e.action === 'throw');
  s.run.owned.throw = true; s.step({ mx: 1, my: 0 }); s.step({ yPress: true }); run(s, 20, {});
  ok(locked && locked.why === 'locked' && got && placed && noThrow && noThrow.why === 'locked' && ev(s, 'throw').length === 1,
    'X picks up a cone (Carry), X again places it; Y throws it (Throw); without the module each is denied, "locked"');
  place(s, RX, RY); s.step({ yPress: true });
  ok(ev(s, 'denied').some((e) => e.action === 'throw' && e.why === 'empty'), 'Y with no cone held: denied, "grab a cone first"');
}
{ // combo
  const out = {};
  for (const win of ['in', 'out']) {
    const s = setup(); if (win === 'out') s.P['scoring.comboWindow'] = 0.3;
    s.fakes.push(car(s, 'sedan', RX + 70, RY, Math.PI / 2), car(s, 'sedan', RX + 70, RY + 60, Math.PI / 2));
    place(s, RX, RY); s.step({ mx: 1, my: 0, aPress: true }); run(s, 24, {}); run(s, 40, { mx: 0, my: 1 }); s.step({ mx: 1, my: 0, aPress: true }); run(s, 20, {});
    out[win] = { im: ev(s, 'impact'), cb: ev(s, 'combo'), pts: s.run.points };
  }
  const a = out.in.im, b = out.out.im, P = setup().P;
  ok(a.length === 2 && a[1].combo === 2 && a[1].mult === 1 + P['scoring.comboStep'] && out.in.cb.length === 1 && b.length === 2 && b[1].combo === 1,
    `combo: a second hit ${(a[1] ? a[1].t - a[0].t : 0).toFixed(2)} s after the first, inside scoring.comboWindow (${P['scoring.comboWindow']} s), scores ×${a[1] && a[1].mult} (+${out.in.cb[0] ? out.in.cb[0].bonus : 0}); outside it, ×1`);
  ok(P['scoring.comboMax'] === 1 + 4 * P['scoring.comboStep'], `combo: each link adds scoring.comboStep (${P['scoring.comboStep']}), to scoring.comboMax (×${P['scoring.comboMax']}) at five hits`);
}
{ // Ricochet: twice the bounce
  const res = {};
  for (const rico of [false, true]) {
    const s = setup(); if (rico) { s.run.owned.jump = true; s.run.owned.ricochet = true; }
    const c = car(s, 'sedan', 300, 130, Math.PI / 2, 120); s.fakes.push(c);
    place(s, 240, RY); let dist = 0, prev = null;
    for (let i = 0; i < 90; i++) { c.y += c.vy / 60; s.step(i === 20 ? { mx: 1, my: 0, aPress: true } : {}); while (s.phase === 'hitstop') s.step({}); if (s.body.mode === 'knock') { if (prev) dist += Math.hypot(s.body.x - prev[0], s.body.y - prev[1]); prev = [s.body.x, s.body.y]; } }
    res[rico] = { dist, sp: (ev(s, 'knock')[0] || {}).speed || 0 };
  }
  ok(res.true.sp > 0 && Math.abs(res.true.sp / res.false.sp - 2) < 0.01 && res.true.dist > res.false.dist * 1.8,
    `Ricochet: a dash into a moving car's flank bounces ${res.false.dist.toFixed(1)} units; with Ricochet ${res.true.dist.toFixed(1)} (×${(res.true.sp / res.false.sp).toFixed(2)} speed, upgrades.ricochetScale)`);
  const s = setup(); const N = X.NODES, ok4 = s.canBuy('spine');
  ok(N.jump.branch === 'Legs' && N.ricochet.pre === 'jump' && s.canBuy('ricochet').why === 'needs Jump' && ok4.why !== 'needs Hips',
    'shop: Legs holds Jump (tier 1) and Ricochet (needs Jump); Spine no longer needs Hips (Hips leaves the P6.5 shop)');
}
{ // 6.4 stays frozen
  const md5 = (b) => crypto.createHash('md5').update(b).digest('hex');
  let head = null; try { head = execSync('git show HEAD:prototypes/p6/dummies_p6_4.html', { maxBuffer: 1 << 26 }); } catch (e) { head = null; }
  ok(!head || md5(head) === md5(fs.readFileSync(path.join(__dirname, 'dummies_p6_4.html'))), 'dummies_p6_4.html is byte-identical to the committed 6.4');
}

// ---------- 2. the page
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('SKIP browser checks: playwright not found'); return done(); }
  const url = 'file://' + path.join(__dirname, 'dummies_p6_5.html');
  const br = await chromium.launch(), logs = [];
  const watch = (pg) => pg.on('pageerror', (e) => logs.push(e.message));
  const boot = async (pg) => {
    await pg.goto(url);
    await pg.waitForFunction(() => window.__dummies && window.__dummies.screen === 'title', null, { timeout: 30000 });
    await pg.evaluate(() => { window.__dummies.level = 2; }); // Monument
    await pg.keyboard.press('Space');
    await pg.waitForFunction(() => window.__dummies.sim && window.__dummies.screen === 'game' && window.__dummies.sim.phase === 'play', null, { timeout: 60000 });
    await pg.waitForTimeout(300);
  };
  const st = (pg) => pg.evaluate(() => { const s = window.__dummies.sim, b = s.body; return { x: b.x, y: b.y, mode: b.mode, z: b.z, facing: b.facing, ev: s.events.slice(-40).map((e) => e.type + (e.why ? ':' + e.why : '')), dev: window.__dummies.device, setup: window.__dummiesInput.pad.st.setup, info: window.__dummiesInput.pad.info && { id: window.__dummiesInput.pad.info.id, mon: window.__dummiesInput.pad.info.monitor } }; });
  const put = (pg, x, y) => pg.evaluate(([x, y]) => { const s = window.__dummies.sim, b = s.body; s.enter(s.W6.at(1, 1)); Object.assign(b, { x, y, px: x, py: y, level: 0, floor: null, stair: null, drop: null, mode: 'idle', vx: 0, vy: 0, lunge: null, jump: null, z: 0, charge: 3, facing: 0 }); s.buildView(); for (const sm of s.W6.sims) { sm.cars.length = 0; sm.slot = sm.schedule.length; } s.buildView(); }, [x, y]);

  // keys
  let pg = await br.newPage({ viewport: { width: 1280, height: 860 } }); watch(pg); await boot(pg);
  await put(pg, RX, RY);
  await pg.keyboard.press('KeyL'); await pg.waitForTimeout(100); let q = await st(pg);
  const lockedKey = q.ev.includes('denied:locked');
  await pg.evaluate(() => { window.__dummies.sim.run.owned.jump = true; });
  await put(pg, RX, RY); await pg.keyboard.down('KeyD'); await pg.keyboard.press('KeyL'); await pg.waitForTimeout(140); q = await st(pg);
  const air = q.mode === 'jump' && q.z > 10;
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p75_jump.png') });
  await pg.waitForTimeout(500); await pg.keyboard.up('KeyD'); q = await st(pg);
  ok(lockedKey && air && q.ev.includes('jump-land'), `keys: L (B) is locked until Jump is installed; then L jumps (in the air ${air ? 'yes' : 'no'}), lands`);
  await put(pg, RX, RY); await pg.keyboard.down('KeyW'); await pg.keyboard.press('Space'); await pg.waitForTimeout(60); await pg.keyboard.up('KeyW'); q = await st(pg);
  ok(q.ev.includes('lunge') && Math.abs(q.facing * DEG + 90) < 1, `keys: W and SPACE (A) dash north at once (${(q.facing * DEG).toFixed(0)}°)`);
  await pg.evaluate(() => { const s = window.__dummies.sim; s.run.owned.carry = true; s.run.owned.throw = true; s.run.owned.ricochet = true; });
  await pg.waitForTimeout(300);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p75_desktop.png') });
  await pg.evaluate(() => { window.__dummies.sim.phase = 'shop'; window.__dummies.shopCol = 1; window.__dummies.shopRow = 1; window.__dummies.sim.run.credits = 2; delete window.__dummies.sim.run.owned.ricochet; });
  await pg.waitForTimeout(250);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p75_shop.png') });
  await pg.close();

  // a USB joypad: a phantom in slot 0; no standard mapping; the d-pad on a hat axis; buttons set up by the player
  pg = await br.newPage({ viewport: { width: 1280, height: 860 } }); watch(pg);
  await pg.addInitScript(() => {
    const B = (n) => Array.from({ length: n }, () => ({ pressed: false, value: 0 }));
    window.__joy = { id: 'USB Joystick (Vendor: 0079 Product: 0006)', index: 1, connected: true, mapping: '', axes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3.2857], buttons: B(12), timestamp: 0 };
    const phantom = { id: 'Virtual HID (phantom)', index: 0, connected: true, mapping: '', axes: [-1, -1], buttons: B(2), timestamp: 0 };
    navigator.getGamepads = () => [phantom, window.__joy];
    window.__jb = (i, on) => { window.__joy.buttons[i] = { pressed: on, value: on ? 1 : 0 }; };
    try { localStorage.clear(); } catch (e) { /* file page */ }
  });
  await boot(pg); await put(pg, RX, RY);
  await pg.evaluate(() => { window.__joy.axes[9] = -3 / 7; }); await pg.waitForTimeout(500); q = await st(pg); // hat: right
  await pg.evaluate(() => { window.__joy.axes[9] = 3.2857; });
  ok(q.dev === 'pad' && q.x > RX + 30 && q.info && /USB Joystick/.test(q.info.id), `joypad (phantom in slot 0, hat d-pad): the hat moves the dummy right (${(q.x - RX).toFixed(0)} in 0.5 s)`);
  const tap = async (i) => { await pg.evaluate((i) => window.__jb(i, true), i); await pg.waitForTimeout(70); await pg.evaluate((i) => window.__jb(i, false), i); await pg.waitForTimeout(70); };
  await pg.keyboard.press('KeyG'); await pg.waitForTimeout(80);
  const s0 = (await st(pg)).setup;
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p75_padsetup.png') });
  await tap(3); await tap(2); await tap(1); await tap(0);
  const s1 = (await st(pg)).setup;
  await pg.evaluate(() => { window.__dummies.sim.run.owned.jump = true; });
  await put(pg, RX, RY); await tap(3); q = await st(pg); const dashed = q.ev.includes('lunge');
  await pg.waitForTimeout(700); await put(pg, RX, RY); await tap(2); q = await st(pg);
  ok(s0 === 'a' && s1 === null && dashed && q.ev.includes('jump'), 'joypad: G opens setup; buttons 3, 2, 1, 0 become DASH, JUMP, GRAB, THROW; 3 dashes, 2 jumps');
  await pg.close();

  // touch, a phone held sideways
  const ctx = await br.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  pg = await ctx.newPage(); watch(pg);
  await pg.goto(url); await pg.waitForFunction(() => window.__dummies && window.__dummies.screen === 'title', null, { timeout: 30000 });
  const cdp = await ctx.newCDPSession(pg);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i })) });
  const L0 = await pg.evaluate(() => { const T = window.__dummiesInput; const L = T.touchLayout(); return { on: T.TOUCH.on, body: document.body.className, a: L.face.find((f) => f.id === 'a') }; });
  await pg.evaluate(() => { window.__dummies.level = 2; });
  await touch('touchStart', [[L0.a.x, L0.a.y]]); await pg.waitForTimeout(60); await touch('touchEnd', []);
  await pg.waitForFunction(() => window.__dummies.sim && window.__dummies.screen === 'game' && window.__dummies.sim.phase === 'play', null, { timeout: 60000 });
  await pg.waitForTimeout(400);
  const L = await pg.evaluate(() => { const T = window.__dummiesInput, L = T.touchLayout(), R = document.getElementById('game').getBoundingClientRect(), k = R.width / 1280; return { L, field: { x0: R.left + 240 * k, x1: R.left + 1040 * k, y0: R.top + 40 * k, y1: R.top + 680 * k }, R: { l: R.left, t: R.top, w: R.width, h: R.height } }; });
  const F = L.field, clearOf = (c, r) => c.x + r <= F.x0 + 1 || c.x - r >= F.x1 - 1;
  ok(L0.on && /touch/.test(L0.body) && clearOf(L.L.home, L.L.sr) && L.L.face.every((f) => clearOf(f, f.r)) && L.L.face.find((f) => f.id === 'y').y < L.L.face.find((f) => f.id === 'a').y && L.L.face.find((f) => f.id === 'x').x < L.L.face.find((f) => f.id === 'b').x,
    `touch (844 × 390): the canvas ${L.R.w.toFixed(0)} × ${L.R.h.toFixed(0)}; stick (r ${L.L.sr.toFixed(0)}) left of the field, below the district map; Y X B A diamond (r ${L.L.face[0].r.toFixed(0)}) right of it, below the chassis; none over the field`);
  await put(pg, RX, RY + 100);
  const home = [L.L.home.x, L.L.home.y], at = (deg, k) => [home[0] + Math.cos(deg / DEG) * L.L.sr * k, home[1] + Math.sin(deg / DEG) * L.L.sr * k];
  await touch('touchStart', [home]); await touch('touchMove', [at(-25, 1)]); await pg.waitForTimeout(150);
  const t0 = await st(pg); await pg.waitForTimeout(400); const t1 = await st(pg);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p75_phone.png') });
  const ang = Math.atan2(t1.y - t0.y, t1.x - t0.x) * DEG;
  const lunges0 = t1.ev.filter((e) => e === 'lunge').length;
  const aBtn = L.L.face.find((f) => f.id === 'a');
  await touch('touchStart', [at(-25, 1), [aBtn.x, aBtn.y]]); await pg.waitForTimeout(80); await touch('touchEnd', [at(-25, 1)]); await pg.waitForTimeout(60);
  const t2 = await st(pg); await touch('touchEnd', []);
  ok(t1.dev === 'touch' && Math.abs(ang + 25) < 4 && t2.ev.filter((e) => e === 'lunge').length > lunges0 && Math.abs(t2.facing * DEG + 25) < 4,
    `touch: the stick pushed at −25° walks at ${ang.toFixed(0)}° (analog, not 8 directions); A while the thumb holds it dashes that way (${(t2.facing * DEG).toFixed(0)}°)`);
  const bBtn = L.L.face.find((f) => f.id === 'b');
  await pg.waitForTimeout(700); await touch('touchStart', [[bBtn.x, bBtn.y]]); await pg.waitForTimeout(60); await touch('touchEnd', []); await pg.waitForTimeout(60);
  const t3 = await st(pg);
  ok(t3.ev.includes('denied:locked'), 'touch: B (JUMP) shows LOCKED until Jump is installed; a tap is denied');
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(400);
  const p0 = await st(pg); await touch('touchStart', [[60, 700]]); await touch('touchMove', [[120, 700]]); await pg.waitForTimeout(300); await touch('touchEnd', []); const p1 = await st(pg);
  const rot = await pg.evaluate(() => { const r = document.getElementById('rotate'); return r && !r.hidden; });
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p75_portrait.png') });
  ok(rot && Math.hypot(p1.x - p0.x, p1.y - p0.y) < 0.5, 'touch, upright: "turn your phone sideways" covers the screen; the dummy does not move');
  await ctx.close();
  ok(!logs.length, 'browser: no page errors' + (logs.length ? ' — ' + logs.slice(0, 3).join('; ') : ''));
  await br.close();
  done();
})();
function done() { console.log(`\n${pass} passed, ${fail} failed`); process.exitCode = fail ? 1 : 0; }
