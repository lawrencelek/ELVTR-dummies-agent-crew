// DUMMIES jump test (GDD Edit 76): checks. Run from prototypes/jump: node test_jump.js [screenshot folder]
// 1. Headless (jump.js): Link's Awakening rules. Distance follows take-off speed; what each take-off clears, by sum.
// 2. Browser (Playwright, the 2D renderer), on dummies_jump.html:
//    - stepped at 120 Hz with the keys held in code: distances on the ruler; air steering; landing momentum;
//      every barrier and parked car, run at with each kind of jump at the best take-off; moving traffic;
//    - live: the keyboard, a gamepad, touch on a phone held sideways, the upright prompt, a computer without touch.
'use strict';
const fs = require('fs'), path = require('path');
const J = require('./jump.js');
const reg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'content', 'params', 'tuning.parameters.json'), 'utf8'));
const P = Object.fromEntries(reg.entries.filter((e) => !/^retired/.test(e.status || '')).map((e) => [e.id, e.default]));
const OUT = process.argv[2] || null;
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else fail++; console.log((c ? 'PASS ' : 'FAIL ') + msg); };
const R = P['body.radius'], VS = P['vehicles.scale'], JH = P['world.jumpableHeight'], AT = P['upgrades.jumpAirtime'];
const sp = J.speeds(P), KINDS = ['walk', 'run', 'dash'];

// ---------- 1. the rules, headless
const reach = { stand: J.reach(P, 0), walk: J.reach(P, sp.walk), run: J.reach(P, sp.run), dash: J.reach(P, sp.dash) };
ok(reach.stand === 0 && Math.abs(reach.walk - sp.walk * AT) < 1e-9 && Math.abs(reach.dash - 2 * reach.run) < 1e-9,
  `distance = take-off speed × ${AT} s: stand ${reach.stand} · walk ${reach.walk.toFixed(1)} · run ${reach.run.toFixed(1)} · dash jump ${reach.dash.toFixed(1)}`);
const t0 = J.takeoff(P, 900, 0, true), t1 = J.takeoff(P, sp.run, 0, false), t2 = J.takeoff(P, 0, 0, false);
ok(t0.v0 === P['upgrades.jumpMaxSpeed'] && t0.kind === 'dash' && !t0.steer && t1.kind === 'run' && t1.steer && t2.kind === 'stand',
  `take-off: a dash at 900 is capped at upgrades.jumpMaxSpeed ${P['upgrades.jumpMaxSpeed']} and holds its line; a run jump steers; standing goes straight up`);
const top = Math.max(...Array.from({ length: 101 }, (_, i) => J.z(t1, i / 100 * AT)));
ok(Math.abs(top - P['upgrades.jumpHeight']) < 0.01 && J.z(t1, 0) === 0 && J.z(t1, AT) === 0, `the arc: ${top.toFixed(1)} high at the top at any speed; 0 at take-off and landing`);
// the yard's things: [name, height, depth crossed, jumpable]
const car = (c, end) => [c + (end ? ' end-on' : ' broadside'), P['vehicles.' + c + '.height'] * VS, P['vehicles.' + c + (end ? '.length' : '.width')] * VS, true];
const THINGS = [['handrail', JH, 8, true], ['jersey', JH, 16, true], ['planter 32', JH, 32, true], ['planter ' + P['world.jumpableDepth'], JH, P['world.jumpableDepth'], true], ['planter 64', JH, 64, false], ['wall', 40, 16, false],
  car('sedan'), car('van'), car('bus'), car('sedan', 1), car('van', 1), car('bus', 1)];
const TABLE = THINGS.map(([name, h, d, jumpable]) => {
  const row = { name, h, d, jumpable, need: d + 2 * R };
  for (const k of KINDS) { row[k] = jumpable && J.clears(P, sp[k], h, d, R); row[k + 'Slack'] = jumpable ? J.over(P, sp[k], h) - row.need : -Infinity; }
  return row;
});
console.log('  what each take-off clears (✓) at the best take-off point. Body ' + 2 * R + ' wide; needs depth + ' + 2 * R + ' of ground above the top:');
for (const r of TABLE) console.log(`    ${r.name.padEnd(17)} ${r.h.toFixed(1).padStart(5)} high · ${r.d.toFixed(1).padStart(5)} deep · ${KINDS.map((k) => k + ' ' + (r[k] ? '✓' : '✗') + (r.jumpable ? ' (' + (r[k + 'Slack'] >= 0 ? '+' : '') + r[k + 'Slack'].toFixed(1) + ')' : '')).join(' · ')}${r.jumpable ? '' : ' · solid'}`);
const T = Object.fromEntries(TABLE.map((r) => [r.name, r]));
ok(T['handrail'].run && !T['handrail'].walk && T['jersey'].run && T['planter 32'].run && !T['planter 48'].run && T['planter 48'].dash && !T['planter 64'].dash && !T.wall.dash,
  'barriers: a running jump clears a handrail, a jersey, a 32 planter; a 48 planter needs a dash jump; a 64 planter and a wall hold');
ok(T['sedan broadside'].run && !T['sedan broadside'].walk && !T['van broadside'].run && T['van broadside'].dash && !T['bus broadside'].dash && T['sedan end-on'].dash && !T['sedan end-on'].run && !T['bus end-on'].dash,
  'cars: a sedan broadside takes a running jump; a van broadside or a sedan end-on a dash jump; a bus never');
const standUnder = J.above(P, P['vehicles.sedan.height'] * VS), passUnder = P['vehicles.sedan.cruiseSpeed'] * (standUnder[1] - standUnder[0]);
ok(passUnder < P['vehicles.sedan.length'] * VS + 2 * R, `standing jump: a sedan at cruise passes ${passUnder.toFixed(0)} under the dummy while it is above the roof; it needs ${(P['vehicles.sedan.length'] * VS + 2 * R).toFixed(0)}. Jump across a car, not over one in place`);
// Edit 77: run to clear. Standing and walking jumps hop; a running or dash jump clears.
const hop = J.takeoff(P, sp.walk, 0, false), runJ = J.takeoff(P, sp.run, 0, false), P0 = Object.assign({}, P, { 'proto.jump.runToClear': 0 });
ok(P['proto.jump.runToClear'] === 1 && !hop.clear && !J.takeoff(P, 0, 0, false).clear && runJ.clear && J.takeoff(P, 900, 0, true).clear && J.takeoff(P0, sp.walk, 0, false).clear,
  'run to clear (proto.jump.runToClear 1): standing and walking jumps hop and clear nothing; running and dash jumps clear. At 0, a walking jump clears what its arc clears');
// diagonals: a thing crossed off square is longer to cross. Barriers and parked cars, through their middle
const ANG = [0, 30, 45];
const along = (name) => { const q = { handrail: 96, jersey: 96, 'planter 32': 96, 'planter 48': 96 }[name]; if (q) return q; const m = /^(sedan|van|bus) (broadside|end-on)/.exec(name); return m ? P['vehicles.' + m[1] + (m[2] === 'broadside' ? '.length' : '.width')] * VS : 96; };
const DIAG = TABLE.filter((r) => r.jumpable).map((r) => { const row = { name: r.name }; for (const k of ['run', 'dash']) for (const a of ANG) { const need = J.inside(r.d, along(r.name), R, a), have = J.over(P, sp[k], r.h); row[k + a] = have >= need; row[k + a + 'Slack'] = have - need; } return row; });
console.log('  diagonals: what a running and a dash jump clear at 0°, 30°, 45° off square (through the middle):');
for (const r of DIAG) console.log(`    ${r.name.padEnd(17)} run ${ANG.map((a) => a + '° ' + (r['run' + a] ? '✓' : '✗')).join(' ')} · dash ${ANG.map((a) => a + '° ' + (r['dash' + a] ? '✓' : '✗')).join(' ')}`);
const D = Object.fromEntries(DIAG.map((r) => [r.name, r]));
const railMax = Math.acos((8 + 2 * R) / J.over(P, sp.run, JH)) * 180 / Math.PI, sedanMax = Math.acos((P['vehicles.sedan.width'] * VS + 2 * R) / J.over(P, sp.run, P['vehicles.sedan.height'] * VS)) * 180 / Math.PI;
ok(D.handrail.run45 && D['sedan broadside'].run30 && !D['sedan broadside'].run45 && !D['planter 32'].run30 && D['van broadside'].dash45 && D['planter 48'].dash45,
  `diagonals: a running jump clears a handrail to ${railMax.toFixed(0)}° off square, a sedan broadside to ${sedanMax.toFixed(0)}° (at 45° it needs 72 above the roof; a run gives 60), a 32 planter only square on. A dash jump clears a van and a 48 planter at 45°`);
// moving traffic, crossed at an angle (the car runs along the lane at cruise): into the oncoming car it passes under faster
const SED = { L: P['vehicles.sedan.length'] * VS, W: P['vehicles.sedan.width'] * VS, h: P['vehicles.sedan.height'] * VS, v: P['vehicles.sedan.cruiseSpeed'] };
const mvT = (v, deg) => { const a = deg * Math.PI / 180; return { t: J.carTime(v * Math.sin(a), v * Math.cos(a), SED.v, SED.L, SED.W, R), ok: J.carClears(P, v * Math.sin(a), v * Math.cos(a), SED.v, SED.L, SED.W, SED.h, R) }; };
const win = J.above(P, SED.h), wT = win[1] - win[0];
const mvRun0 = mvT(sp.run, 0), mvRunInto = mvT(sp.run, -45), mvRunWith = mvT(sp.run, 45);
console.log(`  a moving sedan (${SED.v} u/s), crossed running: square ${mvRun0.t.toFixed(2)} s over it · 45° into it ${mvRunInto.t.toFixed(2)} s · 45° with it ${mvRunWith.t.toFixed(2)} s; above its roof ${wT.toFixed(2)} s`);
ok(mvRun0.ok && mvRunInto.ok && !mvRunWith.ok && mvRunInto.t < mvRun0.t, 'moving sedan: a running jump clears it square on, and faster diagonally into its path; diagonally with the traffic it is struck');
// Edit 78: Legs levels set the airtime, 0.3 to 0.6 s; the height stays. What each level clears, by sum
const LT = (L) => P['abilities.legs.airtimeBase'] + P['abilities.legs.airtimeStep'] * (L - 1), LV = [1, 2, 3, 4];
const LTAB = THINGS.filter((t) => t[3]).map(([name, h, d]) => { const row = { name }; for (const L of LV) for (const k of ['run', 'dash']) row[k + L] = J.clears(P, sp[k], h, d, R, LT(L)); return row; });
console.log('  by Legs level (airtime ' + LV.map((L) => LT(L).toFixed(1)).join(', ') + ' s): run / dash');
for (const r of LTAB) console.log(`    ${r.name.padEnd(17)} ${LV.map((L) => 'L' + L + ' ' + (r['run' + L] ? '✓' : '✗') + (r['dash' + L] ? '✓' : '✗')).join(' · ')}`);
const LB = Object.fromEntries(LTAB.map((r) => [r.name, r]));
ok(LB.handrail.run1 && !LB.jersey.run1 && LB['sedan broadside'].dash1 && !LB['sedan broadside'].run2 && LB['van broadside'].dash2 && !LB['van broadside'].dash1 && LB['sedan broadside'].run3 && LB['planter 48'].dash2 && !LB['van broadside'].run4 && !LB['bus broadside'].dash4,
  `Legs levels: L1 a running jump clears a handrail, a dash jump a sedan; L2 a dash jump a van and a 48 planter; L3 a running jump a sedan; L4 a running jump still not a van (${(J.over(P, sp.run, P['vehicles.van.height'] * VS, LT(4)) - (P['vehicles.van.width'] * VS + 2 * R)).toFixed(1)}); never a bus`);

// ---------- 2. the page
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('SKIP browser checks: playwright not found'); return done(); }
  const url = 'file://' + path.join(__dirname, 'dummies_jump.html') + '?canvas';
  const br = await chromium.launch(), logs = [];
  const watch = (pg) => pg.on('pageerror', (e) => logs.push(e.message));
  const boot = async (pg) => { await pg.goto(url); await pg.waitForFunction(() => window.JUMP_GAME && window.JUMP_GAME.scene.getScene('yard') && window.JUMP_GAME.scene.getScene('yard').body && window.JUMP_GAME.scene.getScene('hud').L, null, { timeout: 15000 }); await pg.waitForTimeout(300); };
  let pg = await br.newPage({ viewport: { width: 1280, height: 720 } }); watch(pg); await boot(pg);
  const desk = await pg.evaluate(() => ({ touch: window.JUMP_STATE.touchOn, shown: window.JUMP_GAME.scene.getScene('hud').btn.a.visible, title: window.JUMP_GAME.scene.getScene('hud').title.text, view: window.JUMP_STATE.view }));
  ok(!desk.touch && !desk.shown && new RegExp(reg.registryVersion.split('-')[0].toUpperCase()).test(desk.title), `computer (1280 × 720): no touch controls; title "${desk.title}"; the yard ${desk.view.w} × ${desk.view.h}, the panel right`);
  // live keyboard: 3 (ruler), hold D, L
  await pg.keyboard.press('Digit3'); await pg.keyboard.down('KeyD'); await pg.waitForTimeout(1300); await pg.keyboard.press('KeyL'); await pg.waitForTimeout(700); await pg.keyboard.up('KeyD'); await pg.waitForTimeout(300);
  let L = await pg.evaluate(() => window.JUMP_STATE.last);
  ok(L && L.kind === 'run' && Math.abs(L.d - reach.run) < 10, `keys: 3, hold D, L → a running jump on the ruler, ${L ? L.d.toFixed(0) : '—'} covered (rule ${reach.run.toFixed(0)})`);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p76_jump_desktop.png') });

  // stepped: freeze the loop; hold keys in code; 120 Hz
  await pg.evaluate(() => {
    const g = window.JUMP_GAME, y = g.scene.getScene('yard'); g.loop.sleep();
    window.__clock = 0;
    window.__step = (n, keys, press) => { for (let i = 0; i < n; i++) { for (const k of ['W', 'A', 'S', 'D']) y.keys[k].isDown = !!(keys && keys.includes(k)); if (press && i === 0) { if (press.includes('a')) y.keyQ.a++; if (press.includes('b')) y.keyQ.b++; } window.__clock += 1000 / 120; y.update(window.__clock, 1000 / 120); } };
    // run: a flying start, already at running speed (the ramp spent), so a run-up fits between the yard's rows
    window.__place = (x, yy, f, run) => { y.cars = []; y.spawnT = [1e9, 1e9]; y.trail = []; Object.assign(y.body, { x, y: yy, vx: 0, vy: 0, mode: run ? 'move' : 'idle', lunge: null, jump: null, z: 0, landT: 0, rampT: run ? 1e3 : 0, facing: f == null ? -Math.PI / 2 : f, knockT: 0 }); window.JUMP_STATE.last = null; };
    window.__b = () => { const b = y.body; return { x: b.x, y: b.y, vx: b.vx, vy: b.vy, mode: b.mode, z: b.z || 0, jump: !!b.jump }; };
  });
  const S = { place: (x, y, f, run) => pg.evaluate(([x, y, f, run]) => window.__place(x, y, f, run), [x, y, f, !!run]), step: (n, keys, press) => pg.evaluate(([n, k, p]) => window.__step(n, k, p), [n, keys || '', press || '']), b: () => pg.evaluate(() => window.__b()), last: () => pg.evaluate(() => window.JUMP_STATE.last) };
  const Y = await pg.evaluate(() => { const Q = window.JUMP_YARD; return { OBS: Q.OBS.map((q) => Object.assign({}, q)), LANES: Q.LANES, ROAD: Q.ROAD, RULER_Y: Q.RULER_Y, W: Q.W }; });
  const fly = async () => { for (let i = 0; i < 200; i++) { const b = await S.b(); if (!b.jump) break; await S.step(6); } };
  // distances, east along the ruler
  const dist = {};
  await S.place(60, Y.RULER_Y, 0); await S.step(1, '', 'b'); await fly(); dist.stand = (await S.last()).d;
  await S.place(60, Y.RULER_Y, 0); await S.step(1, 'D'); await S.step(1, 'D', 'b'); await S.step(70, 'D'); dist.walk = await S.last();
  await S.place(60, Y.RULER_Y, 0); await S.step(132, 'D'); await S.step(1, 'D', 'b'); await S.step(70, 'D'); dist.run = await S.last();
  await S.place(60, Y.RULER_Y, 0); await S.step(132, 'D'); await S.step(1, 'D', 'a'); await S.step(1, 'D', 'b'); await S.step(70, 'D'); dist.dash = await S.last();
  console.log(`  ruler, stepped: stand ${dist.stand.toFixed(1)} · walk ${dist.walk.kind} ${dist.walk.v0.toFixed(0)} → ${dist.walk.d.toFixed(1)} · run ${dist.run.kind} ${dist.run.v0.toFixed(0)} → ${dist.run.d.toFixed(1)} · dash ${dist.dash.kind} ${dist.dash.v0.toFixed(0)} → ${dist.dash.d.toFixed(1)}; tops ${dist.run.top.toFixed(1)}`);
  ok(dist.stand < 0.5 && dist.walk.kind === 'walk' && Math.abs(dist.walk.d - reach.walk) < 3 && dist.run.kind === 'run' && Math.abs(dist.run.d - reach.run) < 3 && dist.dash.kind === 'dash' && Math.abs(dist.dash.d - reach.dash) < 3 && Math.abs(dist.run.top - P['upgrades.jumpHeight']) < 0.5,
    `ruler: the yard matches the rule within 3: stand ${dist.stand.toFixed(0)}, walk ${dist.walk.d.toFixed(0)}, run ${dist.run.d.toFixed(0)}, dash jump ${dist.dash.d.toFixed(0)}; ${dist.run.top.toFixed(0)} high`);
  // Edit 78: the Legs level, set with ] and [: a running jump on the ruler at each level
  const perL = [];
  for (const L of LV) { await pg.evaluate((L) => window.JUMP_LEGS(L), L); await S.place(60, Y.RULER_Y, 0, true); await S.step(1, 'D'); await S.step(1, 'D', 'b'); await S.step(90, 'D'); perL.push((await S.last()).d); }
  await pg.evaluate(() => window.JUMP_LEGS(3));
  ok(perL.every((d, i) => Math.abs(d - sp.run * LT(i + 1)) < 3), `Legs 1–4 in the yard: a running jump covers ${perL.map((d) => d.toFixed(0)).join(', ')} (rule ${LV.map((L) => (sp.run * LT(L)).toFixed(0)).join(', ')})`);
  // air steering: a run jump east, W held in the air → drifts north; a dash jump with W held → holds its line
  await S.place(60, Y.RULER_Y, 0); await S.step(132, 'D'); await S.step(1, 'D', 'b'); let y0 = (await S.b()).y; await S.step(59, 'W'); const runDrift = y0 - (await S.b()).y;
  await S.place(60, Y.RULER_Y, 0); await S.step(132, 'D'); await S.step(1, 'D', 'a'); await S.step(1, 'D', 'b'); y0 = (await S.b()).y; await S.step(59, 'W'); const dashDrift = y0 - (await S.b()).y;
  ok(runDrift > 10 && runDrift < reach.run && Math.abs(dashDrift) < 0.5, `air steering: a running jump bends ${runDrift.toFixed(0)} toward the stick in its flight; a dash jump holds its line (${dashDrift.toFixed(1)})`);
  // landing keeps momentum; no dash or jump for upgrades.jumpRecovery
  await S.place(60, Y.RULER_Y, 0); await S.step(132, 'D'); await S.step(1, 'D', 'b'); await S.step(60, 'D');
  const land = await S.b(), landSp = Math.hypot(land.vx, land.vy); await S.step(1, 'D', 'b'); const denied = !(await S.b()).jump;
  ok(land.mode === 'move' && Math.abs(landSp - sp.run) < 5 && denied, `landing: keeps the running speed (${landSp.toFixed(0)}); a jump pressed at once is refused for ${P['upgrades.jumpRecovery']} s`);

  // barriers and parked cars: run south at each from the north, with each kind; take off where the flight is centred on it
  const attempt = async (q, kind) => {
    const v = sp[kind], w = J.above(P, q.z), need = q.h + 2 * R, slack = w ? v * (w[1] - w[0]) - need : -99;
    const yTake = q.y - R - v * (w ? w[0] : 0) - Math.max(0, slack) / 2, x = q.x + q.w / 2;
    await S.place(x, yTake - (kind === 'walk' ? 1 : 24), Math.PI / 2, kind !== 'walk');
    let fired = false, lunged = false;
    for (let i = 0; i < 400 && !fired; i++) {
      const b = await S.b();
      if (kind === 'dash') { if (!lunged && b.y >= yTake - 1148 / 120 - 0.5) { await S.step(1, 'S', 'a'); lunged = true; continue; } if (lunged) { await S.step(1, 'S', 'b'); fired = true; break; } }
      else if (b.y >= yTake) { await S.step(1, 'S', 'b'); fired = true; break; }
      await S.step(1, 'S');
    }
    for (let i = 0; i < 80; i++) { await S.step(1, 'S'); if (!(await S.b()).jump) break; }
    const Ls = await S.last(), mine = Ls && Ls.over.find((o) => o.name === q.name);
    const b = await S.b();
    return { kind: Ls && Ls.kind, v0: Ls && Ls.v0, cleared: !!(mine && mine.ok) && b.y > q.y + q.h, slack };
  };
  const tested = [], fixed = Y.OBS;
  for (const q of fixed) for (const kind of KINDS) {
    const r = await attempt(q, kind), row = TABLE.find((t) => t.name === q.name || t.name === q.name.replace(/ end-on| broadside/, '') + (q.name.includes('end-on') ? ' end-on' : ' broadside'));
    tested.push({ name: q.name, kind, cleared: r.cleared, rule: row ? row[kind] : null, slack: r.slack, took: r.kind });
  }
  const firm = tested.filter((t) => Math.abs(t.slack) >= 4), agree = firm.filter((t) => t.cleared === t.rule), edge = tested.filter((t) => Math.abs(t.slack) < 4);
  for (const q of fixed) console.log(`    yard · ${q.name.padEnd(17)} ${KINDS.map((k) => { const t = tested.find((u) => u.name === q.name && u.kind === k); return k + ' ' + (t.cleared ? '✓' : '✗') + (Math.abs(t.slack) < 4 ? '?' : ''); }).join(' · ')}`);
  const odd = tested.filter((t) => t.took !== t.kind); if (odd.length) console.log('    took another kind: ' + odd.map((t) => t.name + ' ' + t.kind + '→' + t.took).join(', '));
  ok(agree.length === firm.length && !odd.length, `yard vs rule: ${agree.length}/${firm.length} firm cases agree (${edge.length} within 4 of the edge: ${edge.map((t) => t.name + ' ' + t.kind + (t.cleared ? ' ✓' : ' ✗')).join(', ') || 'none'})`);

  // moving traffic: run north across the lower lane; a car arrives under the dummy at mid-flight
  const traffic = async (cls, kind) => {
    const v = sp[kind], lane = Y.LANES[1], Wd = P['vehicles.' + cls + '.width'] * VS, h = P['vehicles.' + cls + '.height'] * VS, w = J.above(P, h);
    const need = Wd + 2 * R, slack = w ? v * (w[1] - w[0]) - need : -99, yTake = lane + Wd / 2 + R + v * (w ? w[0] : 0) + Math.max(0, slack) / 2, x = 480;
    await S.place(x, yTake + (kind === 'walk' ? 1 : 24), -Math.PI / 2, kind !== 'walk');
    let fired = false, lunged = false, i = 0;
    for (; i < 400 && !fired; i++) {
      const b = await S.b();
      if (kind === 'dash') { if (!lunged && b.y <= yTake + 1148 / 120 + 0.5) { await S.step(1, 'W', 'a'); lunged = true; continue; } if (lunged) fired = true; }
      else if (b.y <= yTake) fired = true;
      if (fired) { // the car: centred on the dummy's x when the dummy is over the lane
        const tc = (yTake - lane) / v;
        await pg.evaluate(([cls, x, tc]) => { const y = window.JUMP_GAME.scene.getScene('yard'), Q = window.JUMP_YARD, c = Q[cls.toUpperCase()]; y.cars = [Object.assign({}, c, { x: x - c.v * tc, y: Q.LANES[1], dir: 1, hitT: 0 })]; }, [cls, x, tc]);
        await S.step(1, 'W', 'b'); break;
      }
      await S.step(1, 'W');
    }
    const hits0 = await pg.evaluate(() => window.JUMP_STATE.hits);
    for (let k = 0; k < 90; k++) await S.step(1, 'W');
    const Ls = await S.last(), hits = await pg.evaluate(() => window.JUMP_STATE.hits), b = await S.b();
    return { cleared: !Ls.hit && b.y < lane - Wd / 2, hit: hits > hits0 || Ls.hit, slack, kind: Ls.kind };
  };
  const mv = {};
  for (const [cls, kind] of [['sedan', 'walk'], ['sedan', 'run'], ['van', 'run'], ['van', 'dash'], ['bus', 'dash']]) mv[cls + ' ' + kind] = await traffic(cls, kind);
  console.log('    moving traffic, crossed: ' + Object.entries(mv).map(([k, r]) => k + ' ' + (r.cleared ? '✓' : '✗ hit')).join(' · '));
  ok(mv['sedan run'].cleared && mv['sedan walk'].hit && mv['van dash'].cleared && !mv['van run'].cleared && mv['bus dash'].hit,
    'moving traffic: a running jump crosses a passing sedan; a walking jump strikes it. A dash jump crosses a van; a running jump does not. A bus is struck');
  // run to clear, in the yard: a test rail 1 deep, 20 high. A walking jump's arc would clear it; the rule says hop
  await pg.evaluate(() => window.JUMP_YARD.OBS.push({ x: 400, y: 330, w: 96, h: 1, z: 20, name: 'test rail', kind: 'rail', jumpable: true, across: 1 }));
  const rail = { x: 400, y: 330, w: 96, h: 1, z: 20, name: 'test rail' };
  const hopRule = await attempt(rail, 'walk');
  await pg.evaluate(() => { window.JUMP_P['proto.jump.runToClear'] = 0; });
  const hopOff = await attempt(rail, 'walk');
  await pg.evaluate(() => { window.JUMP_P['proto.jump.runToClear'] = 1; window.JUMP_YARD.OBS.pop(); });
  ok(!hopRule.cleared && hopOff.cleared, `run to clear: a walking jump at a rail 1 deep hops and is held (${hopRule.cleared ? '✓' : '✗'}); with the rule off its arc clears it (${hopOff.cleared ? '✓' : '✗'})`);
  // diagonals in the yard: run at each thing 45° off square (south-east), through its middle; take off so the middle is at the top
  const diag = async (q, kind, deg) => {
    const v = sp[kind], a = deg * Math.PI / 180, dx = Math.sin(a), dy = Math.cos(a), w = J.above(P, q.z), tm = w ? (w[0] + w[1]) / 2 : P['upgrades.jumpAirtime'] / 2;
    const cx = q.x + q.w / 2, cy = q.y + q.h / 2, xT = cx - dx * v * tm, yT = cy - dy * v * tm, back = kind === 'walk' ? 1 : 24, keys = deg ? 'SD' : 'S';
    await S.place(xT - dx * back, yT - dy * back, Math.atan2(dy, dx), kind !== 'walk');
    let lunged = false;
    for (let i = 0; i < 200; i++) {
      const b = await S.b(), togo = (xT - b.x) * dx + (yT - b.y) * dy;
      if (kind === 'dash') { if (!lunged && togo <= 1148 / 120 + 0.5) { await S.step(1, keys, 'a'); lunged = true; continue; } if (lunged) { await S.step(1, keys, 'b'); break; } }
      else if (togo <= 0) { await S.step(1, keys, 'b'); break; }
      await S.step(1, keys);
    }
    for (let i = 0; i < 80; i++) { await S.step(1, keys); if (!(await S.b()).jump) break; }
    const Ls = await S.last(), mine = Ls && Ls.over.find((o) => o.name === q.name), b = await S.b();
    return { cleared: !!(mine && mine.ok) && b.y > q.y + q.h, kind: Ls && Ls.kind };
  };
  const DG = [];
  for (const [name, kind] of [['handrail', 'run'], ['jersey', 'dash'], ['planter 32', 'dash'], ['planter 48', 'dash'], ['sedan broadside', 'run'], ['sedan broadside', 'dash'], ['van broadside', 'dash']]) {
    const q = Y.OBS.find((o) => o.name === name), r = await diag(q, kind, 45), rule = D[name][kind + 45], slack = D[name][kind + 45 + 'Slack'];
    DG.push({ name, kind, cleared: r.cleared, rule, slack });
  }
  const dFirm = DG.filter((t) => Math.abs(t.slack) >= 4);
  console.log('    yard at 45°: ' + DG.map((t) => t.name + ' ' + t.kind + ' ' + (t.cleared ? '✓' : '✗') + (Math.abs(t.slack) < 4 ? '?' : '')).join(' · '));
  ok(dFirm.every((t) => t.cleared === t.rule), `yard at 45°: ${dFirm.filter((t) => t.cleared === t.rule).length}/${dFirm.length} firm cases match the sums`);
  // moving traffic at 45°: running into the oncoming sedan clears; running with it is struck
  const mvDiag = async (deg) => { // deg < 0: into the car's path (the car comes from the west, so run west of north)
    const v = sp.run, a = deg * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), lane = Y.LANES[1], w = J.above(P, SED.h), tm = (w[0] + w[1]) / 2, x = 480;
    const xT = x - dx * v * tm, yT = lane - dy * v * tm, keys = deg < 0 ? 'WA' : 'WD';
    await S.place(xT - dx * 24, yT - dy * 24, Math.atan2(dy, dx), true);
    for (let i = 0; i < 200; i++) { const b = await S.b(), togo = (xT - b.x) * dx + (yT - b.y) * dy; if (togo <= 0) break; await S.step(1, keys); }
    const b0 = await S.b(), xc = b0.x + dx * v * tm;
    await pg.evaluate(([xc, tm]) => { const y = window.JUMP_GAME.scene.getScene('yard'), Q = window.JUMP_YARD, c = Q.SEDAN; y.cars = [Object.assign({}, c, { x: xc - c.v * tm, y: Q.LANES[1], dir: 1, hitT: 0 })]; }, [xc, tm]);
    const h0 = await pg.evaluate(() => window.JUMP_STATE.hits);
    await S.step(1, keys, 'b'); for (let k = 0; k < 90; k++) await S.step(1, keys);
    const Ls = await S.last(), h1 = await pg.evaluate(() => window.JUMP_STATE.hits);
    return { cleared: !Ls.hit && h1 === h0, hit: Ls.hit || h1 > h0 };
  };
  const into = await mvDiag(-45), withT = await mvDiag(45);
  ok(into.cleared && withT.hit, `moving sedan at 45°: a running jump into its path clears (${into.cleared ? '✓' : '✗'}); with the traffic it is struck (${withT.hit ? 'hit' : 'clear'})`);
  // a standing jump as a sedan comes: struck
  await S.place(480, Y.LANES[1], -Math.PI / 2);
  await pg.evaluate(() => { const y = window.JUMP_GAME.scene.getScene('yard'), Q = window.JUMP_YARD, c = Q.SEDAN; y.cars = [Object.assign({}, c, { x: 480 - c.L / 2 - 13 - c.v * 0.06, y: Q.LANES[1], dir: 1, hitT: 0 })]; });
  const h0 = await pg.evaluate(() => window.JUMP_STATE.hits); await S.step(1, '', 'b'); await S.step(80);
  const standHit = (await pg.evaluate(() => window.JUMP_STATE.hits)) > h0;
  ok(standHit, 'a standing jump as a sedan arrives: it strikes the dummy, as the sums say');
  // a run-and-jump over a parked sedan, for the picture
  if (OUT) {
    const q = Y.OBS.find((o) => o.name === 'sedan broadside'), v = sp.run, w = J.above(P, q.z), slack = v * (w[1] - w[0]) - (q.h + 2 * R), yTake = q.y + q.h + R + v * w[0] + slack / 2;
    for (const shot of [0, 1]) { // the first fills the readout; the picture is the second, at the top of its flight
      await S.place(q.x + q.w / 2, yTake + 24, -Math.PI / 2, true); for (let i = 0; i < 300; i++) { const b = await S.b(); if (b.y <= yTake) break; await S.step(1, 'W'); }
      await S.step(1, 'W', 'b'); await S.step(shot ? 30 : 70, 'W');
      if (!shot) await pg.evaluate(() => { const L = window.JUMP_STATE.last; window.__keep = L; });
    }
    await pg.evaluate(() => { const S = window.JUMP_STATE; S.last = window.__keep; S.flights = [S.last]; S.jumps = 2; S.hits = 0; });
    await pg.evaluate(() => { window.__clock += 1; window.JUMP_GAME.step(window.__clock, 1); });
    await pg.screenshot({ path: path.join(OUT, 'p76_jump_sedan.png') });
    await pg.evaluate(() => window.JUMP_GAME.loop.wake());
    await pg.keyboard.press('KeyH'); await pg.waitForTimeout(200); await pg.screenshot({ path: path.join(OUT, 'p76_jump_help.png') }); await pg.keyboard.press('KeyH');
  }
  await pg.close();

  // a gamepad (standard): B jumps, A dashes
  pg = await br.newPage({ viewport: { width: 1280, height: 720 } }); watch(pg);
  await pg.addInitScript(() => { const B = () => Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })); window.__pad = { id: 'Xbox Wireless Controller (STANDARD GAMEPAD)', index: 0, connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons: B() }; navigator.getGamepads = () => [window.__pad]; });
  await boot(pg);
  await pg.evaluate(() => { window.__pad.axes[0] = -1; }); await pg.waitForTimeout(1200);
  await pg.evaluate(() => { window.__pad.buttons[1] = { pressed: true, value: 1 }; }); await pg.waitForTimeout(80); await pg.evaluate(() => { window.__pad.buttons[1] = { pressed: false, value: 0 }; }); await pg.waitForTimeout(700);
  L = await pg.evaluate(() => ({ last: window.JUMP_STATE.last, dev: window.JUMP_STATE.device }));
  ok(L.last && L.last.kind === 'run' && L.dev === 'pad', `gamepad: stick left, B → a running jump (${L.last ? L.last.d.toFixed(0) : '—'})`);
  await pg.evaluate(() => { window.__pad.buttons[0] = { pressed: true, value: 1 }; }); await pg.waitForTimeout(40); await pg.evaluate(() => { window.__pad.buttons[0] = { pressed: false, value: 0 }; window.__pad.buttons[1] = { pressed: true, value: 1 }; }); await pg.waitForTimeout(60); await pg.evaluate(() => { window.__pad.buttons[1] = { pressed: false, value: 0 }; }); await pg.waitForTimeout(800);
  L = await pg.evaluate(() => window.JUMP_STATE.last);
  ok(L && L.kind === 'dash', `gamepad: A, then B in the dash → a long jump (${L ? L.d.toFixed(0) : '—'})`);
  await pg.close();

  // touch, a phone held sideways
  const ctx = await br.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  pg = await ctx.newPage(); watch(pg); await boot(pg);
  const cdp = await ctx.newCDPSession(pg);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i })) });
  const G = await pg.evaluate(() => { const h = window.JUMP_GAME.scene.getScene('hud'), d = Math.min(3, Math.max(1, window.devicePixelRatio || 1)), f = (c) => ({ x: c.x / d, y: c.y / d, r: c.r / d }), c = h.chart;
    return { on: window.JUMP_STATE.touchOn, a: f(h.L.a), b: f(h.L.b), home: f(Object.assign({ r: h.L.sr }, h.L.home)), shown: h.btn.a.visible, chart: { x: c.x / d, y: c.y / d, w: c.w / d, h: c.h / d }, view: window.JUMP_STATE.view, d }; });
  const inside = (c) => c.x - c.r >= 0 && c.x + c.r <= 844 && c.y - c.r >= 0 && c.y + c.r <= 390;
  const clearOf = (c, q) => c.y - c.r >= q.y + q.h || c.x + c.r <= q.x || c.x - c.r >= q.x + q.w || c.y + c.r <= q.y;
  ok(G.on && G.shown && inside(G.a) && inside(G.b) && inside(G.home) && clearOf(G.a, G.chart) && clearOf(G.b, G.chart) && Math.hypot(G.a.x - G.b.x, G.a.y - G.b.y) > G.a.r + G.b.r,
    `touch (844 × 390): stick r ${G.home.r.toFixed(0)} bottom left; A r ${G.a.r.toFixed(0)}, B r ${G.b.r.toFixed(0)} bottom right, clear of the side view and each other`);
  await pg.evaluate(() => { const b = window.JUMP_GAME.scene.getScene('yard').body; Object.assign(b, { x: 100, y: 470, vx: 0, vy: 0, mode: 'idle' }); });
  await touch('touchStart', [[G.home.x, G.home.y]]); await touch('touchMove', [[G.home.x + G.home.r, G.home.y]]); await pg.waitForTimeout(1200);
  const j0 = await pg.evaluate(() => window.JUMP_STATE.jumps);
  await touch('touchStart', [[G.home.x + G.home.r, G.home.y], [G.b.x, G.b.y]]); await pg.waitForTimeout(80); await touch('touchEnd', [[G.home.x + G.home.r, G.home.y]]); await pg.waitForTimeout(250);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p76_jump_phone.png') });
  await pg.waitForTimeout(450); await touch('touchEnd', []);
  L = await pg.evaluate(() => ({ last: window.JUMP_STATE.last, jumps: window.JUMP_STATE.jumps, dev: window.JUMP_STATE.device }));
  ok(L.jumps === j0 + 1 && L.last && L.last.kind === 'run' && L.dev === 'touch', `touch: the stick held right, B → a running jump (${L.last ? L.last.d.toFixed(0) : '—'})`);
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(400);
  const up = await pg.evaluate(() => ({ portrait: window.JUMP_STATE.portrait, shown: window.JUMP_GAME.scene.getScene('hud').rotate.visible }));
  ok(up.portrait && up.shown, 'touch, upright: "turn your phone sideways" covers the screen');
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p76_jump_portrait.png') });
  await ctx.close();
  ok(!logs.length, 'browser: no page errors' + (logs.length ? ' — ' + logs.slice(0, 3).join('; ') : ''));
  if (OUT) fs.writeFileSync(path.join(OUT, 'p77_jump_table.json'), JSON.stringify({ reach, table: TABLE, diagonals: DIAG, yard: tested, yard45: DG, ruler: { stand: dist.stand, walk: dist.walk.d, run: dist.run.d, dash: dist.dash.d }, traffic: mv, traffic45: { into, with: withT } }, null, 1));
  await br.close();
  done();
})();
function done() { console.log(`\n${pass} passed, ${fail} failed`); process.exitCode = fail ? 1 : 0; }
