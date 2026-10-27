// DUMMIES controls prototype (GDD Edits 73–74): checks. Run from prototypes/controls: node test_controls.js [screenshot folder]
// 1. Headless (core.js, pads.js): how each turn model answers a turn; the touch stick's precision; pads of every kind.
// 2. Browser (Playwright, the 2D renderer): keyboard, mouse aim, emulated gamepads (standard behind a phantom; a USB joypad
//    with a hat d-pad and set-up buttons), the analog touch stick and A/B on a phone held sideways, the upright-phone block.
'use strict';
const fs = require('fs'), path = require('path');
const C = require('./core.js'), PADS = require('./pads.js');
const reg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'content', 'params', 'tuning.parameters.json'), 'utf8'));
const P = Object.fromEntries(reg.entries.filter((e) => !/^retired/.test(e.status || '')).map((e) => [e.id, e.default]));
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
// the touch stick: analog, like a gamepad stick. Any angle; speed by deflection.
const TS = (deg, k) => C.stick(Math.cos(deg * C.DEG) * k, Math.sin(deg * C.DEG) * k, P['proto.input.touchDeadzone'], P['proto.input.touchOuter']);
let worst = 0; for (let d = 0; d < 360; d += 1) { const v = TS(d, 0.95); worst = Math.max(worst, Math.abs(C.wrap(Math.atan2(v.y, v.x) - d * C.DEG)) / C.DEG); }
const tsDead = TS(30, P['proto.input.touchDeadzone'] * 0.8), tsHalf = TS(0, (P['proto.input.touchDeadzone'] + P['proto.input.touchOuter']) / 2), tsFull = TS(0, 0.9);
ok(worst < 0.01 && tsDead.m === 0 && Math.abs(tsHalf.m - 0.5) < 0.01 && tsFull.m === 1, `touch stick: 360 test angles keep their direction (worst ${worst.toFixed(3)}°); dead centre → 0; halfway → ${tsHalf.m.toFixed(2)}; past ${P['proto.input.touchOuter']} → 1`);
// pads.js, on emulated pads
const cfg = { dead: P['proto.input.deadzone'], outer: P['proto.input.stickOuter'], aimDead: P['proto.input.aimDeadzone'], holdSetup: P['proto.input.padSetupHoldSeconds'], stick: C.stick };
const B = (n) => Array.from({ length: n }, () => ({ pressed: false, value: 0 }));
const phantom = { id: 'Virtual HID (phantom)', index: 0, connected: true, mapping: '', axes: [-1, -1], buttons: B(2) };
const joy = { id: 'USB Joystick (Vendor: 0079 Product: 0006)', index: 1, connected: true, mapping: '', axes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3.2857], buttons: B(12) };
let ps = PADS.create(); let o = PADS.read(ps, [phantom, joy], cfg, 0.016);
ok(o.count === 2 && o.id === joy.id && !o.move, `pads: a phantom in slot 0 (resting at −1) does not take over; the joypad with more buttons is read`);
joy.axes[9] = PADS.HAT[2]; o = PADS.read(ps, [phantom, joy], cfg, 0.016); const right = o.move;
joy.axes[9] = PADS.HAT[7]; o = PADS.read(ps, [phantom, joy], cfg, 0.016); const ul = o.move; joy.axes[9] = 3.2857;
ok(right && right.x === 1 && Math.abs(right.y) < 1e-6 && ul && ul.x < -0.7 && ul.y < -0.7 && /axes .*h\+/.test(o.monitor), `pads: a hat d-pad on axis 9 moves right, then up-left; the monitor marks the hat (h)`);
PADS.startSetup(ps); joy.buttons[2] = { pressed: true, value: 1 }; o = PADS.read(ps, [phantom, joy], cfg, 0.016); joy.buttons[2] = { pressed: false, value: 0 }; PADS.read(ps, [phantom, joy], cfg, 0.016);
joy.buttons[3] = { pressed: true, value: 1 }; o = PADS.read(ps, [phantom, joy], cfg, 0.016); joy.buttons[3] = { pressed: false, value: 0 }; PADS.read(ps, [phantom, joy], cfg, 0.016);
joy.buttons[2] = { pressed: true, value: 1 }; const l2 = PADS.read(ps, [phantom, joy], cfg, 0.016); joy.buttons[2] = { pressed: false, value: 0 };
ok(o.setup === null && l2.lunge && !l2.grab, 'pads: setup takes the next button for LUNGE (2), then GRAB (3); button 2 then lunges');
PADS.read(ps, [phantom, joy], cfg, 0.016); joy.buttons[9] = { pressed: true, value: 1 }; let tapStart = PADS.read(ps, [phantom, joy], cfg, 0.1).start; joy.buttons[9] = { pressed: false, value: 0 }; const rel = PADS.read(ps, [phantom, joy], cfg, 0.016);
ok(!tapStart && rel.start && !rel.setup, 'pads: a short press of START toggles help on release, and does not open setup');

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
  if (OUT) { await pg.screenshot({ path: path.join(OUT, 'p74_desktop.png') }); await pg.keyboard.press('KeyH'); await pg.waitForTimeout(100); await pg.screenshot({ path: path.join(OUT, 'p74_help.png') }); await pg.keyboard.press('KeyH'); }
  await pg.close();

  // gamepad, emulated (standard mapping)
  pg = await br.newPage({ viewport: { width: 1280, height: 720 } }); watch(pg);
  await pg.addInitScript(() => {
    const btn = () => Array.from({ length: 17 }, () => ({ pressed: false, value: 0 }));
    window.__pad = { id: 'Test Pad (STANDARD GAMEPAD)', index: 1, connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons: btn(), timestamp: 0 };
    const phantom = { id: 'Virtual HID (phantom)', index: 0, connected: true, mapping: '', axes: [-1, -1], buttons: [{ pressed: false, value: 0 }], timestamp: 0 };
    navigator.getGamepads = () => [phantom, window.__pad];
    window.__btn = (i, on) => { window.__pad.buttons[i] = { pressed: on, value: on ? 1 : 0 }; };
  });
  await boot(pg); await put(pg, 300, 330, 0); a = await st(pg);
  await pg.evaluate(() => { window.__pad.axes[0] = 0.55; }); await pg.waitForTimeout(600); b = await st(pg);
  await pg.evaluate(() => { window.__pad.axes[0] = 1; }); await pg.waitForTimeout(600); const c2 = await st(pg);
  await pg.evaluate(() => { window.__pad.axes[0] = 0; }); await pg.waitForTimeout(300);
  ok(b.dev === 'gamepad' && b.x - a.x > 10 && (c2.x - b.x) > (b.x - a.x) * 1.4, `gamepad (standard, behind a phantom in slot 0): half tilt walks (${(b.x - a.x).toFixed(0)} in 0.6 s); full tilt runs (${(c2.x - b.x).toFixed(0)})`);
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
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p74_gamepad.png') });
  await pg.close();

  // gamepad, emulated: a USB joypad, no standard mapping, d-pad on a hat axis, buttons set up by the player
  pg = await br.newPage({ viewport: { width: 1280, height: 720 } }); watch(pg);
  await pg.addInitScript(() => {
    window.__joy = { id: 'USB Joystick (Vendor: 0079 Product: 0006)', index: 0, connected: true, mapping: '', axes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3.2857], buttons: Array.from({ length: 12 }, () => ({ pressed: false, value: 0 })), timestamp: 0 };
    navigator.getGamepads = () => [window.__joy];
    window.__jb = (i, on) => { window.__joy.buttons[i] = { pressed: on, value: on ? 1 : 0 }; };
    try { localStorage.clear(); } catch (e) { /* file page */ }
  });
  await boot(pg); await put(pg, 300, 330, 0); a = await st(pg);
  await pg.evaluate(() => { window.__joy.axes[9] = -3 / 7; }); await pg.waitForTimeout(500); b = await st(pg); // hat: right (the HAT table's third step)
  await pg.evaluate(() => { window.__joy.axes[9] = 3.2857; });
  ok(b.dev === 'gamepad' && b.x - a.x > 40 && Math.abs(b.y - a.y) < 1, `joypad (no mapping): the hat d-pad moves the dummy right (${(b.x - a.x).toFixed(0)} in 0.5 s)`);
  await pg.waitForTimeout(200);
  await pg.keyboard.press('KeyP'); await pg.waitForTimeout(80);
  q = await pg.evaluate(() => ({ setup: window.CTRL_STATE.pad.setup, prompt: window.CTRL_GAME.scene.getScene('hud').prompt.visible }));
  const tap = async (i) => { await pg.evaluate((i) => window.__jb(i, true), i); await pg.waitForTimeout(60); await pg.evaluate((i) => window.__jb(i, false), i); await pg.waitForTimeout(60); };
  await tap(2); const mid = await pg.evaluate(() => window.CTRL_STATE.pad.setup); await tap(3);
  const done2 = await pg.evaluate(() => window.CTRL_STATE.pad.setup);
  if (OUT) { await pg.keyboard.press('KeyP'); await pg.waitForTimeout(150); await pg.screenshot({ path: path.join(OUT, 'p74_padsetup.png') }); await pg.keyboard.press('Escape'); await pg.waitForTimeout(80); }
  ok(q.setup === 'lunge' && q.prompt && mid === 'grab' && done2 === null, 'joypad: P opens PAD SETUP; button 2 becomes LUNGE, button 3 GRAB');
  await put(pg, 300, 330, 0); const l0 = (await st(pg)).lunges; await tap(2); q = await st(pg);
  ok(q.lunges === l0 + 1, 'joypad: the set-up button 2 lunges');
  await pg.waitForTimeout(800); await put(pg, 150, 350, 0); await tap(3); q = await st(pg);
  ok(q.held, 'joypad: the set-up button 3 grabs');
  await pg.evaluate(() => window.__jb(9, true)); await pg.waitForTimeout(P['proto.input.padSetupHoldSeconds'] * 1000 + 250); await pg.evaluate(() => window.__jb(9, false)); await pg.waitForTimeout(60);
  const mon = await pg.evaluate(() => ({ help: window.CTRL_STATE.help, setup: window.CTRL_STATE.pad.setup, mon: window.CTRL_STATE.pad.monitor, shown: window.CTRL_GAME.scene.getScene('hud').mon.visible }));
  ok(mon.setup === 'lunge' && !mon.help && mon.shown && /no mapping · buttons .* axes .*h\+3\.29/.test(mon.mon), `joypad: holding START ${P['proto.input.padSetupHoldSeconds']} s opens setup; the monitor line reads "${mon.mon.slice(0, 60)}…"`);
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(60);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p74_joypad.png') });
  await pg.close();

  // touch, on a phone held sideways: multi-touch through the DevTools protocol. Analog stick, left column; B and A, right.
  const ctx = await br.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  pg = await ctx.newPage(); watch(pg); await boot(pg);
  const cdp = await ctx.newCDPSession(pg);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i })) });
  await touch('touchStart', [[422, 200]]); await touch('touchEnd', []); await pg.waitForTimeout(200); // first touch: touch layout
  const geo = () => pg.evaluate(() => { const h = window.CTRL_GAME.scene.getScene('hud'), d = window.CTRL_DPR, f = (c) => c && ({ x: c.x / d, y: c.y / d, r: c.r != null ? c.r / d : undefined }), v = window.CTRL_STATE.view;
    return { a: f(h.L.a), b: f(h.L.b), R: h.L.stickR / d, home: f(h.stick.home), base: f(h.stick.base), cols: { L0: h.cols.L0 / d, L1: h.cols.L1 / d, R0: h.cols.R0 / d, R1: h.cols.R1 / d }, view: { x: v.x / d, w: v.w / d }, portrait: window.CTRL_STATE.portrait }; });
  let G = await geo();
  ok(!G.portrait && G.home.x + G.R <= G.cols.L1 + 0.5 && G.a.x - G.a.r >= G.cols.R0 - 0.5 && G.b.x - G.b.r >= G.cols.R0 - 0.5 && G.b.x < G.a.x && G.b.y < G.a.y && Math.abs(G.view.x - G.cols.L1) < 1 && Math.abs(G.view.x + G.view.w - G.cols.R0) < 1,
    `touch layout (844 × 390): stick in the left column (0–${G.cols.L1.toFixed(0)}); B above-left of A in the right (${G.cols.R0.toFixed(0)}–844); the yard between, ${G.view.w.toFixed(0)} px wide`);
  const run = async (deg, k, ms) => { // thumb lands at the stick's home, then pushes `k` of the radius at `deg`
    const h = [G.home.x, G.home.y], to = [G.home.x + Math.cos(deg * Math.PI / 180) * G.R * k, G.home.y + Math.sin(deg * Math.PI / 180) * G.R * k];
    await put(pg, 300, 330, 0); await touch('touchStart', [h]); await touch('touchMove', [to]); await pg.waitForTimeout(80);
    const s0 = await st(pg); await pg.waitForTimeout(ms); const s1 = await st(pg); await touch('touchEnd', []); await pg.waitForTimeout(150);
    return { d: Math.hypot(s1.x - s0.x, s1.y - s0.y), ang: Math.atan2(s1.y - s0.y, s1.x - s0.x) * 180 / Math.PI, dev: s1.dev };
  };
  const half = await run(0, (P['proto.input.touchDeadzone'] + P['proto.input.touchOuter']) / 2, 500), fullR = await run(0, 1, 500);
  ok(half.dev === 'touch' && half.d > 10 && fullR.d > half.d * 1.4, `touch stick: half deflection walks (${half.d.toFixed(0)} in 0.5 s); full deflection runs (${fullR.d.toFixed(0)})`);
  const r20 = await run(20, 1, 400), r65 = await run(-65, 1, 400), r160 = await run(160, 1, 400);
  ok(Math.abs(r20.ang - 20) < 3 && Math.abs(r65.ang + 65) < 3 && Math.abs(r160.ang - 160) < 3, `touch stick: analog angles, not 8 directions: pushed at 20°, −65°, 160° → moves at ${r20.ang.toFixed(0)}°, ${r65.ang.toFixed(0)}°, ${r160.ang.toFixed(0)}°`);
  const land = [G.cols.L0 + G.R * 1.1, G.home.y - G.R * 0.9];
  await touch('touchStart', [land]); await pg.waitForTimeout(60); G = await geo();
  const floated = Math.hypot(G.base.x - land[0], G.base.y - land[1]) < 2;
  await touch('touchMove', [[land[0] + G.R * 2, land[1]]]); await pg.waitForTimeout(60); const G2 = await geo(); await touch('touchEnd', []); await pg.waitForTimeout(100); const G3 = await geo();
  ok(floated && Math.abs(G2.base.x - (land[0] + G.R)) < 2 && Math.hypot(G3.base.x - G3.home.x, G3.base.y - G3.home.y) < 1, 'touch stick: floats to where the thumb lands; a thumb past the rim drags it along; it goes home on release');
  const hold = [G.home.x + G.R * 0.9, G.home.y];
  await put(pg, 300, 330, 0); await touch('touchStart', [[G.home.x, G.home.y]]); await touch('touchMove', [hold]); await pg.waitForTimeout(150);
  const l1 = (await st(pg)).lunges;
  await touch('touchStart', [hold, [G.a.x, G.a.y]]); await pg.waitForTimeout(80); await touch('touchEnd', [hold]); await pg.waitForTimeout(80);
  q = await st(pg); ok(q.lunges === l1 + 1 && q.err < 1, `touch: A (LUNGE) while the thumb holds the stick lunges where it points (${q.err.toFixed(0)}° off)`);
  await touch('touchEnd', []); await pg.waitForTimeout(900);
  await put(pg, 150, 350, 0); await touch('touchStart', [[G.b.x, G.b.y]]); await pg.waitForTimeout(80); await touch('touchEnd', []); await pg.waitForTimeout(80);
  q = await st(pg); ok(q.held, 'touch: B (GRAB) picks up the cone beside the dummy');
  await put(pg, 340, 380, 0); await touch('touchStart', [[G.home.x, G.home.y]]); await touch('touchMove', [[G.home.x + G.R * 0.8, G.home.y - G.R * 0.35]]); await pg.waitForTimeout(450);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p74_phone.png') });
  await touch('touchEnd', []);
  // the same phone held upright: landscape only
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(400);
  await put(pg, 300, 330, 0); a = await st(pg);
  await touch('touchStart', [[60, 700]]); await pg.waitForTimeout(400); await touch('touchEnd', []); b = await st(pg);
  const up = await pg.evaluate(() => ({ portrait: window.CTRL_STATE.portrait, shown: window.CTRL_GAME.scene.getScene('hud').rotate.visible }));
  ok(up.portrait && up.shown && Math.hypot(b.x - a.x, b.y - a.y) < 0.5, 'touch, upright: "turn your phone sideways" covers the screen; the dummy does not move');
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p74_portrait.png') });
  await ctx.close();
  ok(!logs.length, 'browser: no page errors' + (logs.length ? ' — ' + logs.slice(0, 3).join('; ') : ''));
  await br.close();
  done();
})();
function done() {
  if (OUT) fs.writeFileSync(path.join(OUT, 'p74_turns.json'), JSON.stringify(rows.map((r) => ({ model: r.name, e45: r.e45, e90a: r.e90a, e90: r.e90, e90b: r.e90b, e180: r.e180, page90: r.page, d90: r.s90.dist, d180: r.s180.dist, settle180: r.s180.settle })), null, 1));
  console.log(`\n${pass} passed, ${fail} failed`); process.exitCode = fail ? 1 : 0;
}
