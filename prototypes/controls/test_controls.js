// DUMMIES controls prototype (GDD Edit 73): checks. Run from prototypes/controls: node test_controls.js [screenshot folder]
// 1. Headless (core.js): how each turn model answers a turn, from the registry values.
// 2. Browser (Playwright, the 2D renderer): keyboard, mouse aim, an emulated gamepad, multi-touch on a phone viewport.
'use strict';
const fs = require('fs'), path = require('path');
const C = require('./core.js');
const reg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'content', 'params', 'tuning.parameters.json'), 'utf8'));
const P = Object.fromEntries(reg.entries.map((e) => [e.id, e.default]));
const OUT = process.argv[2] || null;
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else fail++; console.log((c ? 'PASS ' : 'FAIL ') + msg); };

// ---------- 1. turn models, headless
const rows = [];
for (const m of [1, 2, 3]) {
  const e = (deg, d) => C.turnTest(P, m, deg, d, 1.5).lungeErr;
  const r = { m, name: C.MODELS[m].name, e45: e(45, 0.1), e90a: e(90, 0), e90: e(90, 0.1), e90b: e(90, 0.25), e180: e(180, 0.1), s90: C.turnTest(P, m, 90, -1, 1.5), s180: C.turnTest(P, m, 180, -1, 1.5) };
  rows.push(r);
  console.log(`  ${r.name.padEnd(6)} lunge off input after a turn: 45° at 0.1 s ${r.e45.toFixed(0)}° · 90° at once ${r.e90a.toFixed(0)}°, at 0.1 s ${r.e90.toFixed(0)}°, at 0.25 s ${r.e90b.toFixed(0)}° · 180° at 0.1 s ${r.e180.toFixed(0)}° | ground covered 0.5 s after a 90° turn ${r.s90.dist.toFixed(0)}, after a 180° ${r.s180.dist.toFixed(0)}; back to walk speed after a 180° ${r.s180.settle.toFixed(2)} s`);
}
const [lag, direct, pivot] = rows;
ok(lag.e90 > 60 && lag.e180 > 120, `LAG (6.4): a lunge 0.1 s after a 90° turn goes ${lag.e90.toFixed(0)}° off where the player points; after a 180° turn ${lag.e180.toFixed(0)}°`);
ok(direct.e45 < 1 && direct.e90 < 1 && direct.e180 < 1, `DIRECT: every lunge goes where the player points (${direct.e90.toFixed(0)}°, ${direct.e180.toFixed(0)}°)`);
ok(pivot.e90b < 1 && pivot.s180.settle > 0.1, `PIVOT: on target 0.25 s after a 90° turn (${pivot.e90b.toFixed(0)}°); a 180° turn plants for ${pivot.s180.settle.toFixed(2)} s`);
ok(direct.s180.dist > lag.s180.dist * 2, `a 180° turn: DIRECT covers ${direct.s180.dist.toFixed(0)} in 0.5 s; LAG ${lag.s180.dist.toFixed(0)} (it stops, then slows while it faces)`);
const dz = C.stick(0.15, 0, P['proto.input.deadzone'], P['proto.input.stickOuter']), half = C.stick(0.55, 0, P['proto.input.deadzone'], P['proto.input.stickOuter']), full = C.stick(0.95, 0.1, P['proto.input.deadzone'], P['proto.input.stickOuter']);
ok(dz.m === 0 && Math.abs(half.m - 0.5) < 0.01 && full.m === 1, `stick: ${P['proto.input.deadzone']} dead zone (0.15 → ${dz.m}); half travel → ${half.m.toFixed(2)}; 0.95 → ${full.m}`);
const dp = C.dpad(30, 31, 18, P['proto.input.dpadDirections']), dc = C.dpad(5, 3, 18, 8);
ok(dp.sector === 1 && dc.m === 0, `d-pad: a thumb down-right snaps to the diagonal (sector ${dp.sector}); inside the dead centre it reads as centred`);

// ---------- 2. the page
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('SKIP browser checks: playwright not found'); return done(); }
  const url = 'file://' + path.join(__dirname, 'dummies_controls.html') + '?canvas';
  const br = await chromium.launch(), logs = [];
  const watch = (pg) => pg.on('pageerror', (e) => logs.push(e.message));
  const st = (pg) => pg.evaluate(() => { const y = window.CTRL_GAME.scene.getScene('yard'), b = y.body, S = window.CTRL_STATE; return { x: b.x, y: b.y, f: b.facing, mode: b.mode, held: !!b.held, dev: S.device, model: S.model, lunges: S.lunges, err: S.lastErr, dir: b.lastLunge && b.lastLunge.dir }; });
  const put = (pg, x, y, f) => pg.evaluate(([x, y, f]) => { const b = window.CTRL_GAME.scene.getScene('yard').body; Object.assign(b, { x, y, vx: 0, vy: 0, facing: f, mode: 'idle', lunge: null }); }, [x, y, f]);
  const boot = async (pg) => { await pg.goto(url); await pg.waitForFunction(() => window.CTRL_GAME && window.CTRL_GAME.scene.getScene('yard') && window.CTRL_GAME.scene.getScene('yard').body, null, { timeout: 15000 }); await pg.waitForTimeout(400); };

  // keyboard
  let pg = await br.newPage({ viewport: { width: 1280, height: 720 } }); watch(pg); await boot(pg);
  await put(pg, 300, 330, 0); let a = await st(pg);
  await pg.keyboard.down('KeyD'); await pg.waitForTimeout(700); await pg.keyboard.up('KeyD'); let b = await st(pg);
  ok(b.x - a.x > 60 && Math.abs(b.y - a.y) < 1 && b.dev === 'keyboard', `keyboard: D moves the dummy right (${(b.x - a.x).toFixed(0)} in 0.7 s)`);
  for (const [m, key] of [[1, 'Digit1'], [2, 'Digit2'], [3, 'Digit3']]) {
    await pg.keyboard.press(key); await put(pg, 300, 330, 0);
    await pg.keyboard.down('KeyD'); await pg.waitForTimeout(500); await pg.keyboard.up('KeyD'); await pg.keyboard.down('KeyS'); await pg.waitForTimeout(100); await pg.keyboard.press('Space'); await pg.waitForTimeout(80); await pg.keyboard.up('KeyS');
    const q = await st(pg); rows[m - 1].page = q.err;
    ok(q.model === m && q.err != null, `keyboard, ${C.MODELS[m].name}: right, then down and SPACE 0.1 s later: the lunge goes ${q.err.toFixed(0)}° off down`);
    await pg.waitForTimeout(800);
  }
  // mouse aim
  await pg.keyboard.press('Digit2'); await put(pg, 300, 330, 0);
  const cam = await pg.evaluate(() => { const c = window.CTRL_GAME.scene.getScene('yard').cameras.main; return { z: c.zoom / window.CTRL_DPR, sx: c.worldView.x, sy: c.worldView.y }; });
  const sx = (wx) => (wx - cam.sx) * cam.z, sy = (wy) => (wy - cam.sy) * cam.z;
  await pg.mouse.move(sx(300), sy(250)); await pg.waitForTimeout(150); await pg.mouse.click(sx(300), sy(250)); await pg.waitForTimeout(100);
  let q = await st(pg);
  ok(q.dev === 'mouse' && q.lunges >= 4 && Math.abs(C.wrap(q.dir - -Math.PI / 2)) < 0.05, `mouse: the pointer above the dummy aims; a left click lunges up (${(q.dir * 57.3).toFixed(0)}°)`);
  await pg.waitForTimeout(800);
  await put(pg, 150, 350, 0); await pg.mouse.click(sx(150), sy(352), { button: 'right' }); await pg.waitForTimeout(100); q = await st(pg);
  ok(q.held, 'mouse: a right click beside a cone grabs it');
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p73_desktop.png') });
  await pg.close();

  // gamepad, emulated (standard mapping)
  pg = await br.newPage({ viewport: { width: 1280, height: 720 } }); watch(pg);
  await pg.addInitScript(() => {
    const btn = () => Array.from({ length: 17 }, () => ({ pressed: false, value: 0 }));
    window.__pad = { id: 'Test Pad (STANDARD GAMEPAD)', index: 0, connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons: btn(), timestamp: 0 };
    navigator.getGamepads = () => [window.__pad];
    window.__btn = (i, on) => { window.__pad.buttons[i] = { pressed: on, value: on ? 1 : 0 }; };
  });
  await boot(pg); await put(pg, 300, 330, 0); a = await st(pg);
  await pg.evaluate(() => { window.__pad.axes[0] = 0.55; }); await pg.waitForTimeout(600); b = await st(pg);
  await pg.evaluate(() => { window.__pad.axes[0] = 1; }); await pg.waitForTimeout(600); const c2 = await st(pg);
  await pg.evaluate(() => { window.__pad.axes[0] = 0; }); await pg.waitForTimeout(300);
  ok(b.dev === 'gamepad' && b.x - a.x > 10 && (c2.x - b.x) > (b.x - a.x) * 1.4, `gamepad: half tilt walks (${(b.x - a.x).toFixed(0)} in 0.6 s); full tilt runs (${(c2.x - b.x).toFixed(0)})`);
  await pg.evaluate(() => { window.__pad.axes[1] = -1; }); await pg.waitForTimeout(100); await pg.evaluate(() => window.__btn(0, true)); await pg.waitForTimeout(60); await pg.evaluate(() => window.__btn(0, false)); await pg.evaluate(() => { window.__pad.axes[1] = 0; });
  q = await st(pg); ok(q.lunges === 1 && q.err < 1, `gamepad: stick up and A lunges up (${q.err.toFixed(0)}° off)`);
  await pg.waitForTimeout(800);
  await pg.evaluate(() => { window.__pad.axes[2] = 1; }); await pg.waitForTimeout(200); q = await st(pg);
  ok(Math.abs(C.wrap(q.f)) < 0.05, `gamepad: the right stick turns the dummy to aim (${(q.f * 57.3).toFixed(0)}°)`);
  await pg.evaluate(() => { window.__pad.axes[2] = 0; });
  await put(pg, 150, 350, 0); await pg.evaluate(() => window.__btn(1, true)); await pg.waitForTimeout(60); await pg.evaluate(() => window.__btn(1, false)); await pg.waitForTimeout(60);
  q = await st(pg); ok(q.held, 'gamepad: B grabs the cone beside the dummy');
  await pg.evaluate(() => window.__btn(8, true)); await pg.waitForTimeout(60); await pg.evaluate(() => window.__btn(8, false)); await pg.waitForTimeout(60);
  q = await st(pg); ok(q.model === 3, `gamepad: SELECT steps the turn model (${q.model})`);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p73_gamepad.png') });
  await pg.close();

  // touch, on a phone held sideways: multi-touch through the DevTools protocol
  const ctx = await br.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  pg = await ctx.newPage(); watch(pg); await boot(pg);
  const cdp = await ctx.newCDPSession(pg);
  const L = await pg.evaluate(() => { const L = window.CTRL_GAME.scene.getScene('hud').L, d = window.CTRL_DPR, f = (c) => ({ x: c.x / d, y: c.y / d, r: c.r / d }); return { pad: f(L.pad), lunge: f(L.lunge), grab: f(L.grab), dpr: d }; }); // CSS px
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i })) });
  await put(pg, 300, 330, 0); a = await st(pg);
  const padR = [L.pad.x + L.pad.r * 0.7, L.pad.y]; // thumb on the right arrow
  await touch('touchStart', [padR]); await pg.waitForTimeout(500); b = await st(pg);
  ok(b.dev === 'touch' && b.x - a.x > 40 && Math.abs(b.y - a.y) < 1, `touch: the d-pad's right arrow moves the dummy right (${(b.x - a.x).toFixed(0)} in 0.5 s)`);
  const padDR = [L.pad.x + L.pad.r * 0.5, L.pad.y + L.pad.r * 0.5];
  await touch('touchMove', [padDR]); await pg.waitForTimeout(300); const c3 = await st(pg);
  ok(c3.y - b.y > 10 && c3.x - b.x > 10, 'touch: sliding the thumb to the down-right diagonal moves diagonally');
  await touch('touchMove', [padR]); await pg.waitForTimeout(100);
  await touch('touchStart', [padR, [L.lunge.x, L.lunge.y]]); await pg.waitForTimeout(80); await touch('touchEnd', [padR]); await pg.waitForTimeout(80);
  q = await st(pg); ok(q.lunges === 1 && q.err < 1, `touch: LUNGE while the thumb holds the d-pad lunges where it points (${q.err.toFixed(0)}° off)`);
  await touch('touchEnd', []); await pg.waitForTimeout(900);
  await put(pg, 150, 350, 0); await touch('touchStart', [[L.grab.x, L.grab.y]]); await pg.waitForTimeout(80); await touch('touchEnd', []); await pg.waitForTimeout(80);
  q = await st(pg); ok(q.held, 'touch: GRAB picks up the cone beside the dummy');
  await put(pg, 340, 360, 0); await touch('touchStart', [padR]); await pg.waitForTimeout(400);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p73_phone.png') });
  await touch('touchEnd', []);
  await ctx.close();
  ok(!logs.length, 'browser: no page errors' + (logs.length ? ' — ' + logs.slice(0, 3).join('; ') : ''));
  await br.close();
  done();
})();
function done() {
  if (OUT) fs.writeFileSync(path.join(OUT, 'p73_turns.json'), JSON.stringify(rows.map((r) => ({ model: r.name, e45: r.e45, e90a: r.e90a, e90: r.e90, e90b: r.e90b, e180: r.e180, page90: r.page, d90: r.s90.dist, d180: r.s180.dist, settle180: r.s180.settle })), null, 1));
  console.log(`\n${pass} passed, ${fail} failed`); process.exitCode = fail ? 1 : 0;
}
