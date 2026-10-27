// Prototype 6.9 (GDD Edits 75–79) checks. Run from prototypes/p6: node test_p69.js [screenshot folder]
// Edit 79: three tracks of three levels (Battery, Legs, Arms); hold X to throw; the hitch and sling; combo variety, the clock held
// in the air, a thrown cone into a car linking the chain.
// Edit 77: the ability tracks (Battery, Legs, Arms, Throw by level), their wear shields, the battery's recharge; run to clear.
// Edit 78: four levels with linear steps (airtime, cones, throw range, recharge); the Newtonian bounce off a car.
// 1. Headless (sim.js + world6.js + ../jump/jump.js): DIRECT turning; the Link's Awakening jump (distance from take-off speed,
//    the dash jump, steering, landing momentum) over cars, handrails and jumpable pieces; X grab, Y throw; combos; Ricochet;
//    the stair-head freeze fixed; 6.4–6.8 frozen.
// 2. Browser (Playwright, dummies_p6_9.html): the ability shop; fit to screen; keys; an emulated USB joypad (phantom in slot 0, hat d-pad,
//    setup); touch on a phone held sideways (analog stick, the A/B/X/Y diamond, in the game canvas); no touch controls on a
//    desktop; the upright-phone prompt; no page errors.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execSync } = require('child_process');
const W6 = require('./world6.js');
const X = require('./sim.js');
const OUT = process.argv[2] || null;
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else fail++; console.log((c ? 'PASS ' : 'FAIL ') + msg); };
const DEG = 180 / Math.PI;

function setup(id, ov) { // a district with its traffic cleared; fake parked cars join the view. ov: registry overrides
  const s = new W6.Sim6(id || 'monument', ov || {}, null, { warm: 0 });
  for (const sm of s.W6.sims) { sm.cars.length = 0; sm.slot = sm.schedule.length; sm.deckNext = { 0: 1e9, 1: 1e9, 2: 1e9, 3: 1e9 }; }
  s.fakes = []; const orig = s.buildView.bind(s);
  s.buildView = function () { orig(); for (const f of this.fakes) if (!f.scr || f.scr === this.screenName()) this.cars.push(f); this.view = this.cars; };
  s.buildView();
  return s;
}
const place = (s, x, y, scn, lv, fl) => {
  if (scn) s.enter(s.W6.at('ABC'.indexOf(scn[0]), +scn[1] - 1));
  Object.assign(s.body, { x, y, px: x, py: y, level: lv || 0, floor: fl == null ? null : fl, stair: null, drop: null, mode: 'idle', vx: 0, vy: 0, lunge: null, jump: null, z: 0, landT: 0, charge: 3, alive: true, facing: 0, combo: null });
  s.buildView(); s.events.length = 0;
};
const car = (s, cls, x, y, h, v) => ({ id: 'test-' + cls + '-' + (CID++), model: 'TEST', cls, x, y, h, L: s.P['vehicles.' + cls + '.length'], W: s.P['vehicles.' + cls + '.width'], v: v || 0, vx: Math.cos(h) * (v || 0), vy: Math.sin(h) * (v || 0), elev: 0, spent: false, inEpisode: false, touched: false, state: 'cruise' });
const run = (s, n, cmd) => { for (let i = 0; i < n; i++) { s.step(typeof cmd === 'function' ? cmd(i) : cmd || {}); while (s.phase === 'hitstop' || s.phase === 'scroll') s.step({}); } };
const ev = (s, t) => s.events.filter((e) => e.type === t);
let CID = 0; // unique ids for fake cars
const lvl = (s, t, L) => { for (let k = 1; k <= 4; k++) { if (k <= L) s.run.owned[t + k] = true; else delete s.run.owned[t + k]; } }; // Edit 78: a track at level L
const RX = 40, RY = 196; // Monument B2: a clear run 260 long at this row

// ---------- 1. headless
{ // DIRECT
  const s = setup(); const P = s.P;
  ok(P['proto.turnModel'] === 2 && P['proto.input.fourButtons'] === 1 && P['proto.combo'] === 1 && P['proto.abilities'] === 2 && P['proto.jump.runToClear'] === 1 && P['proto.bounce.newton'] === 1, 'P6.9 runs DIRECT turning, four buttons, combos, ability tracks, run-to-clear and the Newtonian bounce (2, 1, 1, 2, 1, 1); the shared sim keeps 6.4\'s rules (' + ['proto.turnModel', 'proto.input.fourButtons', 'proto.combo', 'proto.abilities', 'proto.jump.runToClear', 'proto.bounce.newton'].map((k) => X.PROTO[k]).join(', ') + ')');
  place(s, RX, RY); s.body.facing = 0; s.step({ mx: 0, my: -1, aPress: true });
  const L = s.body.lunge;
  ok(L && Math.abs(L.dir * DEG + 90) < 0.5, `DIRECT: facing east, push north and dash: the dash goes north (${L ? (L.dir * DEG).toFixed(0) : '—'}°)`);
  place(s, RX, RY); run(s, 60, { mx: 0.5, my: 0 }); const half = s.body.x - RX;
  place(s, RX, RY); run(s, 60, { mx: 1, my: 0 }); const full = s.body.x - RX;
  ok(half > 20 && full > half * 1.7, `DIRECT: speed scales with tilt: half ${half.toFixed(0)}, full ${full.toFixed(0)} in 1 s`);
  place(s, RX + 100, RY); run(s, 40, { mx: 1, my: 0 }); const x0 = s.body.x; run(s, 15, { mx: -1, my: 0 });
  ok(s.body.x < x0 - 5 && s.body.mode === 'move', `DIRECT: a reversal moves back at once, no counter-press stop (${(x0 - s.body.x).toFixed(0)} back in 0.25 s)`);
}
{ // B jump, after Link's Awakening: the take-off speed decides the distance
  const s = setup(), P = s.P, J = X.JUMP, walk = P['movement.walkSpeed'], runV = P['movement.runSpeed'], cap = P['upgrades.jumpMaxSpeed'], T = P['upgrades.jumpAirtime'];
  place(s, RX, RY); s.step({ mx: 1, my: 0, bPress: true });
  const d = ev(s, 'denied')[0];
  ok(s.body.mode !== 'jump' && d && d.action === 'jump' && d.why === 'locked', 'B without Legs 1: denied, "locked"');
  lvl(s, 'legs', 3); // Legs 3: 0.5 s in the air, the airtime the rule below is read at
  const go = (speed, dash, extra) => { // from a set ground speed (or a dash), jump east; return the flight
    place(s, RX, RY + 60);
    if (dash) { s.step({ mx: 1, my: 0, aPress: true }); s.step({ mx: 1, my: 0, bPress: true }); }
    else { Object.assign(s.body, { mode: speed ? 'move' : 'idle', vx: speed, vy: 0, rampT: P['movement.rampSeconds'] * Math.max(0, (speed - walk) / (runV - walk)) }); s.step({ mx: speed ? 1 : 0, my: 0, bPress: true }); }
    const je = ev(s, 'jump')[0]; let top = 0;
    for (let i = 0; i < 40 && s.body.mode === 'jump'; i++) { s.step(extra ? extra(i) : (speed || dash ? { mx: 1, my: 0 } : {})); top = Math.max(top, s.body.z); }
    const le = ev(s, 'jump-land')[0];
    return { kind: je && je.kind, v0: je && je.speed, d: le ? le.d : null, top, landSpeed: Math.hypot(s.body.vx, s.body.vy), mode: s.body.mode };
  };
  const st = go(0), wk = go(walk), rn = go(runV), ds = go(0, true);
  ok(st.kind === 'stand' && st.d < 1 && wk.kind === 'walk' && Math.abs(wk.d - walk * T) < 3 && rn.kind === 'run' && Math.abs(rn.d - runV * T) < 3 && ds.kind === 'dash' && Math.abs(ds.d - cap * T) < 4 && Math.abs(st.top - P['upgrades.jumpHeight']) < 1,
    `jump distance = take-off speed × ${T} s: standing ${st.d.toFixed(0)}, walking ${wk.d.toFixed(0)}, running ${rn.d.toFixed(0)}, dash jump ${ds.d.toFixed(0)} (capped at ${cap}); ${st.top.toFixed(0)} high every time`);
  ok(rn.mode === 'move' && Math.abs(rn.landSpeed - runV) < 2, `landing keeps the momentum: a running jump lands running (${rn.landSpeed.toFixed(0)}); no dash or jump for upgrades.jumpRecovery (${P['upgrades.jumpRecovery']} s)`);
  const steer = go(0, false, () => ({ mx: 0, my: -1 })), lock = go(0, true, () => ({ mx: 0, my: -1 }));
  place(s, RX, RY + 60); s.step({ mx: 1, my: 0, aPress: true }); s.step({ mx: 1, my: 0, bPress: true }); const y0 = s.body.y; let dashDrift = 0; for (let i = 0; i < 40 && s.body.mode === 'jump'; i++) { s.step({ mx: 0, my: -1 }); if (s.body.mode === 'jump') dashDrift = Math.abs(s.body.y - y0); }
  ok(steer.d > 10 && dashDrift < 0.5, `in the air a normal jump steers (a standing jump pushed north travels ${steer.d.toFixed(0)}); a dash jump holds its line (${dashDrift.toFixed(1)} drift)`);
  // clearing cars crosswise (broadside): geometry from jump.js, then played
  const r = P['body.radius'], fit = (v, cls) => { const w = J.above(P, P['vehicles.' + cls + '.height']); if (!w) return null; const half = P['vehicles.' + cls + '.width'] / 2, lo = r + v * w[0] + half, hi = v * w[1] - r - half; return lo <= hi ? (lo + hi) / 2 : null; };
  const play = (cls, v, dash) => {
    s.fakes.length = 0; place(s, RX, RY);
    let x0 = RX;
    if (dash) { const probe = setup(); lvl(probe, 'legs', 3); place(probe, RX, RY); probe.step({ mx: 1, my: 0, aPress: true }); probe.step({ mx: 1, my: 0, bPress: true }); x0 = ev(probe, 'jump')[0].x; }
    const gap = fit(dash ? cap : v, cls) || (dash ? 70 : 40); s.fakes.push(car(s, cls, x0 + gap, RY, Math.PI / 2));
    if (dash) { s.step({ mx: 1, my: 0, aPress: true }); s.step({ mx: 1, my: 0, bPress: true }); }
    else { Object.assign(s.body, { mode: 'move', vx: v, vy: 0, rampT: P['movement.rampSeconds'] * Math.max(0, (v - walk) / (runV - walk)) }); s.step({ mx: 1, my: 0, bPress: true }); }
    run(s, 40, { mx: 1, my: 0 });
    return ev(s, 'impact').length === 0 && s.body.x > x0 + gap;
  };
  const tab = { sedanWalk: play('sedan', walk), sedanRun: play('sedan', runV), vanRun: play('van', runV), vanDash: play('van', 0, true), busDash: play('bus', 0, true) };
  ok(!tab.sedanWalk && tab.sedanRun && !tab.vanRun && tab.vanDash && !tab.busDash,
    `over a car broadside: sedan (${P['vehicles.sedan.height']}) — walking jump hits, running jump clears; van (${P['vehicles.van.height']}) — running jump hits, dash jump clears; bus (${P['vehicles.bus.height']}) — never`);
  s.fakes.length = 0; s.fakes.push(car(s, 'sedan', RX + 80, RY, Math.PI / 2));
  place(s, RX, RY); run(s, 90, { mx: 1, my: 0 });
  ok(ev(s, 'impact').length === 1, 'without a jump the dummy walks into the sedan');
  s.fakes.length = 0; place(s, RX, RY); s.body.charge = 0.5; s.step({ mx: 1, my: 0, bPress: true });
  ok(s.body.mode !== 'jump' && ev(s, 'denied').length === 1, `a jump costs battery.jumpCost (${P['battery.jumpCost']}): refused at half a charge`);
}
{ // Edit 76: the stair-head freeze. Up a flight onto a narrow walkway and on to the far rail: the dummy stops at the rail, on the walkway
  const res = [];
  for (const [id, cell, si] of [['monument', [1, 1], 0], ['parkland', [0, 0], 0], ['parkland', [2, 0], 0]]) {
    const s = setup(id), sc = s.W6.at(cell[0], cell[1]), st = sc.game.stairs[si], dir = Math.sign(st.high - st.low);
    const lat = st.axis === 'y' ? st.x + st.w / 2 : st.y + st.h / 2, x0 = st.axis === 'y' ? lat : st.low + dir * 6, y0 = st.axis === 'y' ? st.low + dir * 6 : lat;
    place(s, x0, y0, sc.name, st.from); s.body.stair = st;
    const tr = []; for (let i = 0; i < 240; i++) { s.step(st.axis === 'y' ? { mx: 0, my: dir } : { mx: dir, my: 0 }); while (s.phase === 'hitstop' || s.phase === 'scroll') s.step({}); tr.push(!!s.body.stair); }
    res.push(`${id} ${sc.name}: ${s.body.stair ? 'ON THE STAIR' : 'Z' + s.body.level + ' ' + ((s.floorOf() || {}).kind || 'ground')}`);
    res.ok = (res.ok !== false) && !s.body.stair && tr.slice(-60).every((q) => !q);
  }
  ok(res.ok, `stair heads: pushing on past the top of a flight onto a narrow walkway stops at the rail, off the stair (${res.join('; ')})`);
}
{ // the jumpable tag: pieces at Z0; railed floors above
  const counts = {};
  for (const id of W6.LEVEL_LIST) { const w = W6.buildWorld(id, { budget: 0 }); counts[id] = w.scs.reduce((a, sc) => a + sc.game.statics.filter((q) => q.jumpable).length, 0); }
  const s = setup(); lvl(s, 'legs', 3);
  const sc = s.W6.at(1, 1), jq = sc.game.statics.filter((q) => q.jumpable), edge = sc.game.statics.filter((q) => q.kind === 'planter' || q.kind === 'bound' || q.kind === 'wall');
  const allLow = jq.every((q) => q.ht <= s.P['proto.art.jumpableTop'] && Math.min(q.piece[2], q.piece[3]) <= s.P['world.jumpableDepth']) && edge.every((q) => !q.jumpable);
  ok(counts.parkland + counts.monument + counts.waterfront > 40 && allLow, `jumpable tag: ${counts.parkland} Parkland, ${counts.waterfront} Waterfront, ${counts.monument} Monument runs at Z0: planters drawn ≤ ${s.P['proto.art.jumpableTop']} art px, ≤ ${s.P['world.jumpableDepth']} deep; edge planters, holds and walls never`);
  // jump across a jumpable piece: one with clear ground both sides along x, nothing else solid in the way
  let crossed = null;
  for (const id of ['monument', 'parkland', 'waterfront']) {
    const sj = id === 'monument' ? s : setup(id); lvl(sj, 'legs', 3);
    for (const sc2 of sj.W6.scs) {
      const G = sc2.game, seen = new Set(), scn = sc2.name;
      for (const q of G.statics.filter((q2) => q2.jumpable)) {
        const [px, py, pw, ph] = q.piece, key = q.piece.join(); if (seen.has(key) || pw > 48 || ph < 12) continue; seen.add(key);
        const y = py + ph / 2, xa = px - 30, xb = px + pw + 40; let clear = W6.groundFree(sc2, xa, y, 14) && W6.groundFree(sc2, xb, y, 14) && xa > 20 && xb < 780;
        for (let x = xa; clear && x <= xb; x += 4) for (const oy of [-12, 0, 12]) if (G.statics.some((o) => !o.jumpable && W6.inR(o, x, y + oy, 0)) || G.polys0.some((pl) => globalThis.PIX.inPoly(pl, x, y + oy))) clear = false;
        if (!clear) continue;
        place(sj, xa, y, scn); run(sj, 40, { mx: 1, my: 0 }); const walked = sj.body.x;
        place(sj, xa, y, scn); Object.assign(sj.body, { mode: 'move', vx: sj.P['movement.runSpeed'], vy: 0, rampT: sj.P['movement.rampSeconds'] }); sj.step({ mx: 1, my: 0, bPress: true }); run(sj, 40, { mx: 1, my: 0 }); // a running jump
        if (walked < px && sj.body.x > px + pw && sj.screenName() === scn) { crossed = { id, scn, walked, after: sj.body.x, pw, ph }; break; }
      }
      if (crossed) break;
    }
    if (crossed) break;
  }
  ok(!!crossed, crossed ? `${crossed.id} ${crossed.scn}: a planter ${crossed.pw} × ${crossed.ph} blocks a walk (x ${crossed.walked.toFixed(0)}); a running jump clears it (x ${crossed.after.toFixed(0)})` : 'no jumpable piece found to cross');
}
{ // over a walkway's handrail: drop to the street; walking holds
  const s = setup('parkland'); lvl(s, 'legs', 3);
  const sc = s.W6.at(2, 0), fi = sc.game.floors.findIndex((f) => f.kind === 'walk');
  let x = null; for (let q = 100; q < 700 && x == null; q += 10) if (sc.game.floors[fi].has(q, 320) && !sc.walk.gapAt(q, 360) && !sc.walk.gapAt(q, 280)) x = q;
  place(s, x, 320, 'C1', 1, fi); run(s, 60, { mx: 0, my: 1 }); const held = s.body.level === 1;
  place(s, x, 320, 'C1', 1, fi); Object.assign(s.body, { mode: 'move', vx: 0, vy: s.P['movement.walkSpeed'] }); s.step({ mx: 0, my: 1, bPress: true }); const hopEv = ev(s, 'jump')[0]; run(s, 80, { mx: 0, my: 1 });
  const hopHeld = s.body.level === 1 && !ev(s, 'rail-jump').length && hopEv && hopEv.clear === false && hopEv.kind === 'walk';
  place(s, x, 300, 'C1', 1, fi); Object.assign(s.body, { mode: 'move', vx: 0, vy: s.P['movement.runSpeed'], rampT: s.P['movement.rampSeconds'] }); s.step({ mx: 0, my: 1, bPress: true }); run(s, 80, { mx: 0, my: 1 });
  ok(held && hopHeld && s.body.level === 0 && ev(s, 'rail-jump').length === 1 && ev(s, 'deck-drop').length === 1, `Parkland C1 walkway: walking holds at the handrail; a walking jump hops and holds too (run to clear); a running jump clears it and drops to the street (y ${s.body.y.toFixed(0)}, Z${s.body.level})`);
  const f = sc.game.floors.find((q) => q.kind === 'deck' || q.kind === 'ring');
  ok(sc.game.floors.filter((q) => q.rail).every((q) => q.kind === 'walk' || q.kind === 'deck' || q.kind === 'ring') && (!f || f.rail), 'railed floors (jumpable): walkways, highway decks and lifted rings');
}
{ // Edit 79: X does Arms. Tap: pick up, put down (Arms 1). Hold: throw (Arms 2, after input.throwHoldSeconds). Y has no job
  const s = setup(), P = s.P, cn = s.cones[0], hold = P['input.throwHoldSeconds'];
  place(s, cn.x - 22, cn.y); s.step({ xPress: true });
  const locked = ev(s, 'denied')[0];
  lvl(s, 'arms', 1); place(s, cn.x - 22, cn.y); s.step({ xPress: true, xHeld: true }); s.step({}); const got = s.body.held === cn;
  s.step({ xPress: true, xHeld: true }); s.step({ xHeld: false }); const placed = !s.body.held && cn.state === 'free';
  place(s, cn.x - 22, cn.y); s.step({ xPress: true, xHeld: true }); s.step({});
  for (let i = 0; i < 40; i++) s.step(i === 0 ? { xPress: true, xHeld: true } : { xHeld: true }); s.step({ xHeld: false });
  const arms1Hold = ev(s, 'throw').length === 0 && !s.body.held; // Arms 1: a long hold still just puts it down
  lvl(s, 'arms', 2); place(s, cn.x - 22, cn.y); s.step({ xPress: true, xHeld: true }); s.step({}); s.step({ mx: 1, my: 0 });
  let tThrow = null; for (let i = 0; i < 60 && tThrow == null; i++) { s.step(i === 0 ? { xPress: true, xHeld: true } : { xHeld: true }); if (ev(s, 'throw').length) tThrow = (i + 1) / 60; }
  s.step({ xHeld: false });
  const sy = setup(); lvl(sy, 'arms', 2); const cy = sy.cones[0]; place(sy, cy.x - 22, cy.y); sy.step({ xPress: true }); sy.step({}); sy.step({ yPress: true }); sy.step({});
  ok(locked && locked.why === 'locked' && got && placed && arms1Hold && tThrow != null && Math.abs(tThrow - hold) < 0.04 && !ev(sy, 'throw').length && sy.body.held === cy,
    `X: a tap picks up a cone (Arms 1) and puts it down; at Arms 1 a hold still puts it down; at Arms 2 holding X throws after ${tThrow != null ? tThrow.toFixed(2) : '—'} s (input.throwHoldSeconds ${hold}). Y does nothing`);
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
  ok(P['scoring.comboMax'] === 5 && P['scoring.comboVariety'] === 0.5, `combo: each link adds scoring.comboStep (${P['scoring.comboStep']}); each new kind of move scoring.comboVariety (${P['scoring.comboVariety']}); to scoring.comboMax (×${P['scoring.comboMax']})`);
}
{ // Edit 77: Ricochet retires. Owning the old node changes nothing; the shop does not sell it
  const res = {};
  for (const rico of [false, true]) {
    const s = setup(); if (rico) { s.run.owned.legs1 = true; s.run.owned.ricochet = true; }
    const c = car(s, 'sedan', 300, 130, Math.PI / 2, 120); s.fakes.push(c);
    place(s, 240, RY); let dist = 0, prev = null;
    for (let i = 0; i < 90; i++) { c.y += c.vy / 60; s.step(i === 20 ? { mx: 1, my: 0, aPress: true } : {}); while (s.phase === 'hitstop') s.step({}); if (s.body.mode === 'knock') { if (prev) dist += Math.hypot(s.body.x - prev[0], s.body.y - prev[1]); prev = [s.body.x, s.body.y]; } }
    res[rico] = { dist, sp: (ev(s, 'knock')[0] || {}).speed || 0 };
  }
  const s0 = setup();
  ok(res.true.sp > 0 && Math.abs(res.true.sp / res.false.sp - 1) < 0.01 && ['ricochet', 'spine', 'hips', 'bigBattery', 'jump'].every((n) => s0.canBuy(n).why === 'not sold'),
    `Ricochet, Spine, Hips and Big battery retire: a bounce off a moving flank stays ${res.false.dist.toFixed(1)} units (×${(res.true.sp / res.false.sp).toFixed(2)}); the old nodes are not sold`);
}
{ // Edit 77: the shop sells four ability tracks by level, one per button
  const s = setup(), P = s.P, T = X.TRACKS, N = X.NODES7;
  ok(Object.keys(s.tracks()).join() === 'battery,legs,arms' && Object.values(s.tracks()).map((t) => t.button).join('') === 'ABX' && Object.keys(s.nodes()).length === 9 && P['abilities.maxLevel'] === 3,
    'three tracks, one per button: Battery (A), Legs (B), Arms (X); three levels each (abilities.maxLevel). Throw is Arms 2');
  s.phase = 'shop'; s.run.credits = 10;
  const c1 = s.canBuy('legs2'), c2 = s.canBuy('arms2'), b1 = s.buy('legs1'), b2 = s.buy('legs2'), c3 = s.canBuy('legs3');
  ok(c1.why === 'needs Legs 1' && c2.why === 'needs Arms 1' && s.canBuy('throw1').why === 'not sold' && b1.price === P['economy.price.ability.level1'] && b2.price === P['economy.price.ability.level2'] && c3.ok && c3.price === P['economy.price.ability.level3'] && s.tier('legs') === 2 && s.has('jump') && s.run.credits === 7,
    `levels in order: Legs 2 needs Legs 1; Arms 2 (the throw) needs Arms 1. Prices ${P['economy.price.ability.level1']}, ${P['economy.price.ability.level2']}, ${P['economy.price.ability.level3']} (economy.price.ability.level1–3). Legs 1 is the jump`);
  const b3 = s.buy('legs3'), more = s.canBuy('legs4');
  ok(b3.ok && s.tier('legs') === 3 && more.why === 'not sold' && s.run.credits === 4, `Legs 3 (${P['economy.price.ability.level3']} credits) tops the track; there is no level 4. A track costs ${[1, 2, 3].reduce((a, L) => a + P['economy.price.ability.level' + L], 0)}`);
}
{ // Edit 77: each level shields its ability from wear (abilities.wearCut per level)
  const s = setup(), P = s.P, H = P['damage.bodyHealth'], cut = P['abilities.wearCut'];
  const at = (t, L, f) => { lvl(s, t, L); return f(); };
  Object.assign(s.body.parts, { legL: 0.2 * H, legR: 0.2 * H, torso: 0.3 * H, armL: 0.3 * H, armR: 0.3 * H });
  const dash = [0, 1, 2, 3].map((L) => at('legs', L, () => s.partEffect('dash'))), speed = [0, 3].map((L) => at('legs', L, () => s.partEffect('speed')));
  const want = (L) => Math.max(P['movement.wearFloor'], 1 - P['proto.parts.legDashLoss'] * 0.4 * (1 - cut * L));
  ok(dash.every((v, L) => Math.abs(v - want(L)) < 1e-9) && speed[1] > speed[0],
    `Legs shield the legs: 40% leg damage leaves the dash ${dash.map((v) => Math.round(v * 100) + '%').join(' → ')} at levels 0–3 (abilities.wearCut ${cut}: level 3 stops ${Math.round(cut * 300)}%); the run ${Math.round(speed[0] * 100)}% → ${Math.round(speed[1] * 100)}%`);
  const spc = [0, 1, 2, 3].map((L) => at('battery', L, () => { const save = s.body.parts.torso; s.body.parts.torso = 0; const v = s.secondsPerCharge(); s.body.parts.torso = save; return v; }));
  const rc = [0, 3].map((L) => at('battery', L, () => s.partEffect('recharge')));
  ok(spc.every((v, L) => Math.abs(v - (L ? P['abilities.battery.level' + L + 'Seconds'] : P['battery.secondsPerCharge'])) < 1e-9) && spc.map((v) => v.toFixed(1)).join() === '1.0,0.8,0.7,0.6' && Math.abs(rc[0] - (1 - P['proto.parts.torsoRechargeLoss'] * 0.3)) < 1e-9 && rc[1] > rc[0],
    `Battery: a charge every ${spc.map((v) => v.toFixed(1)).join(' → ')} s at levels 0–3 (battery.secondsPerCharge, then abilities.battery.level1–3Seconds); 30% torso damage slows the recharge to ${Math.round(rc[0] * 100)}% unshielded, ${Math.round(rc[1] * 100)}% at level 3`);
  // the recharge in play: drain, then time the refill
  const refill = (L, torso) => { const t = setup(); for (let k = 1; k <= L; k++) t.run.owned['battery' + k] = true; place(t, RX, RY); t.body.parts.torso = torso * H; t.body.charge = 0; let n = 0; while (t.body.charge < 1 - 1e-9 && n < 600) { t.step({}); n++; } return n / 60; };
  const r0 = refill(0, 0), r4 = refill(3, 0), rd = refill(0, 0.3), rd4 = refill(3, 0.3);
  ok(r4 < r0 * 0.65 && rd > r0 * 1.5 && rd4 < rd, `in play, one charge refills in ${r0.toFixed(2)} s; Battery 3 ${r4.toFixed(2)} s; with 30% torso damage ${rd.toFixed(2)} s, Battery 3 ${rd4.toFixed(2)} s`);
  const grip = [1, 2, 3].map((L) => at('arms', L, () => { s.body.parts.armL = s.body.parts.armR = 0.45 * H; return s.armsBroken(); }));
  const thr = [2, 3].map((L) => at('arms', L, () => { s.body.parts.armL = s.body.parts.armR = 0.3 * H; return s.partEffect('throw'); }));
  ok(at('arms', 0, () => { s.body.parts.armL = s.body.parts.armR = 0.45 * H; return s.armsBroken(); }) && !grip[0] && !grip[2] && thr[1] > thr[0],
    `Arms hold the grip: arms 45% damaged lose it unshielded, keep it from Arms 1. Arms shields the throw too: 60% arm damage leaves ${Math.round(thr[0] * 100)}% at Arms 2, ${Math.round(thr[1] * 100)}% at Arms 3`);
}
{ // Edit 78: Legs lengthen the airtime, 0.3 to 0.6 s; the height stays. A running jump covers more, and clears more
  const s = setup(), P = s.P, J = X.JUMP, runV = P['movement.runSpeed'], walk = P['movement.walkSpeed'];
  const flight = (L) => { lvl(s, 'legs', L); place(s, RX, RY + 60); Object.assign(s.body, { mode: 'move', vx: runV, vy: 0, rampT: P['movement.rampSeconds'] }); s.step({ mx: 1, my: 0, bPress: true }); const je = ev(s, 'jump')[0]; let t = 0, top = 0; while (s.body.mode === 'jump' && t < 2) { s.step({ mx: 1, my: 0 }); t += 1 / 60; top = Math.max(top, s.body.z); } const le = ev(s, 'jump-land')[0]; return { T: s.jumpAirtime(), d: le ? le.d : 0, top, kind: je && je.kind }; };
  const F = [1, 2, 3].map(flight);
  ok(F.every((f, i) => Math.abs(f.T - (P['abilities.legs.airtimeBase'] + P['abilities.legs.airtimeStep'] * i)) < 1e-9 && Math.abs(f.d - runV * f.T) < 4 && Math.abs(f.top - P['upgrades.jumpHeight']) < 1.5),
    `Legs 1–3: ${F.map((f) => f.T.toFixed(1)).join(', ')} s in the air (abilities.legs.airtimeBase + airtimeStep per level); a running jump covers ${F.map((f) => f.d.toFixed(0)).join(', ')}; ${F[0].top.toFixed(0)} high at every level`);
  const r = P['body.radius'], sed = (L, v) => J.clears(P, v, P['vehicles.sedan.height'], P['vehicles.sedan.width'], r, F[L - 1].T), rail = (L, v) => J.clears(P, v, P['world.jumpableHeight'], 8, r, F[L - 1].T), van = (L, v) => J.clears(P, v, P['vehicles.van.height'], P['vehicles.van.width'], r, F[L - 1].T);
  const cap = P['upgrades.jumpMaxSpeed'];
  ok(rail(1, runV) && !sed(1, runV) && !sed(2, runV) && sed(3, runV) && sed(1, cap) && !van(1, cap) && van(2, cap),
    `what a level buys: Legs 1 — a running jump clears a handrail; a dash jump a sedan. Legs 2 — a dash jump a van. Legs 3 — a running jump a sedan. A bus: never (${P['vehicles.bus.height']} under the ${P['upgrades.jumpHeight']} top)`);
}
{ // Edit 79: Arms 3 hitches a passing car. X beside it grabs; the body rides its side; X lets go at its speed; A slings off with a dash
  const s = setup(), P = s.P; lvl(s, 'arms', 3);
  const B = car(s, 'sedan', 40, RY, 0, 120); s.fakes.push(B); place(s, 40, RY + B.W / 2 + P['body.radius'] + 6);
  const drive = (n, cmd) => { for (let i = 0; i < n; i++) { B.x += B.vx / 60; s.step(typeof cmd === 'function' ? cmd(i) : i === 0 ? cmd || {} : {}); while (s.phase === 'hitstop') s.step({}); } };
  drive(1, { xPress: true, xHeld: true }); const hitched = s.body.mode === 'hitch', y0 = s.body.y, dx0 = s.body.x - B.x;
  drive(30); const rode = s.body.mode === 'hitch' && Math.abs(s.body.x - B.x - dx0) < 0.5 && Math.abs(s.body.y - y0) < 0.5 && s.bodyLayer() === null;
  drive(1, { xPress: true }); const letGo = s.body.mode === 'knock' && Math.abs(Math.hypot(s.body.vx, s.body.vy) - 120 * P['abilities.arms.slingScale']) < 3;
  const s2 = setup(); lvl(s2, 'arms', 3); const B2 = car(s2, 'sedan', 40, RY, 0, 120); s2.fakes.push(B2); place(s2, 40, RY + B2.W / 2 + P['body.radius'] + 6);
  for (let i = 0; i < 40; i++) { B2.x += B2.vx / 60; s2.step(i === 0 ? { xPress: true, xHeld: true } : i === 30 ? { aPress: true, mx: 0, my: 1 } : {}); }
  const sl = ev(s2, 'sling')[0];
  const s3 = setup(); lvl(s3, 'arms', 3); const B3 = car(s3, 'sedan', 40, RY, 0, 120); s3.fakes.push(B3); place(s3, 40, RY + B3.W / 2 + P['body.radius'] + 6);
  let t = 0; for (let i = 0; i < 200 && (i === 0 || s3.body.mode === 'hitch'); i++) { B3.x += B3.vx / 60; s3.step(i === 0 ? { xPress: true, xHeld: true } : {}); if (i) t += 1 / 60; }
  const s4 = setup(); lvl(s4, 'arms', 2); const B4 = car(s4, 'sedan', 40, RY, 0, 120); s4.fakes.push(B4); place(s4, 40, RY + B4.W / 2 + P['body.radius'] + 6); s4.step({ xPress: true, xHeld: true });
  ok(hitched && rode && letGo && sl && sl.dash && Math.abs(sl.speed - Math.hypot(120, P['abilities.arms.slingDash'])) < 3 && Math.abs(t - P['abilities.arms.hitchSeconds']) < 0.05 && s4.body.mode !== 'hitch',
    `Arms 3 hitch: X beside a moving sedan grabs it and rides its side (traffic ignores a hitched body); X lets go at ${(120 * P['abilities.arms.slingScale']).toFixed(0)} u/s; A slings off at ${sl ? sl.speed.toFixed(0) : '—'} u/s (car + abilities.arms.slingDash ${P['abilities.arms.slingDash']}); the ride ends after ${t.toFixed(2)} s (abilities.arms.hitchSeconds). Arms 2 cannot hitch`);
}
{ // Edit 79: combos. A dash hit, a hitch ride, a sling into a parked car: two links, two kinds. The ride holds the clock
  const chain = (ov) => {
    const s = setup('monument', ov); lvl(s, 'arms', 3);
    const A = car(s, 'sedan', 100, RY - 60, 0, 0), B = car(s, 'sedan', 40, RY, 0, 120), C = car(s, 'sedan', 300, 169, Math.PI / 2, 0); s.fakes.push(A, B, C);
    place(s, 100, RY + 29);
    for (let i = 0; i < 320; i++) { B.x += B.vx / 60; s.step(i === 1 ? { aPress: true, mx: 0, my: -1 } : i === 30 ? { xPress: true, xHeld: true } : {}); while (s.phase === 'hitstop') s.step({}); }
    return { im: ev(s, 'impact'), cb: ev(s, 'combo'), end: ev(s, 'combo-end') };
  };
  const on = chain({}), off = chain({ 'scoring.comboAirPause': 0 });
  const P = setup().P, want = 1 + P['scoring.comboStep'] + P['scoring.comboVariety'];
  ok(on.im.length === 2 && on.im[0].kind === 'dash' && on.im[1].kind === 'sling' && on.cb.length === 1 && Math.abs(on.cb[0].mult - want) < 1e-9 && on.cb[0].kinds.join() === 'dash,sling' && on.end.length === 1 && off.im.length === 2 && off.im[1].combo === 1,
    `combo: dash into a car, hitch a passing one for ${P['abilities.arms.hitchSeconds']} s, sling into a third: COMBO 2, DASH › SLING, ×${on.cb[0] ? on.cb[0].mult : '—'} (scoring.comboStep + scoring.comboVariety); it banks (combo-end). With the clock running in the air (scoring.comboAirPause 0), the ride breaks the chain`);
  const s = setup(); const k = (kind) => s.comboLink(kind, 10).mult;
  const same = [k('dash'), k('dash'), k('dash')], s2 = setup(); const k2 = (kind) => s2.comboLink(kind, 10).mult; const mixed = [k2('dash'), k2('bounce'), k2('jump'), k2('sling'), k2('drop')];
  ok(same.join() === '1,1.5,2' && mixed.join() === '1,2,3,4,5', `variety pays: three dashes ×${same.join(', ×')}; dash › bounce › jump › sling › drop ×${mixed.join(', ×')} (to scoring.comboMax ${P['scoring.comboMax']})`);
}
{ // Edit 79: a thrown cone into a moving car links the combo (scoring.coneLink), once a car, for scoring.coneHitPoints × the multiplier
  const s = setup(), P = s.P; lvl(s, 'arms', 2); const cn = s.cones[0];
  const B = car(s, 'sedan', RX + 150, RY, Math.PI / 2, 60); s.fakes.push(B);
  place(s, RX, RY); cn.state = 'held'; s.body.carried = [cn]; s.body.held = cn; s.body.facing = 0;
  for (let i = 0; i < 30; i++) s.step(i < 20 ? { xPress: i === 0, xHeld: true } : {});
  const hit = ev(s, 'cone-hit')[0];
  ok(hit && hit.n === 1 && hit.points === P['scoring.coneHitPoints'] && s.body.combo && s.body.combo.kinds.join() === 'cone' && B.coned,
    `cone link: a thrown cone hits a moving sedan: +${hit ? hit.points : '—'} (scoring.coneHitPoints) and a link (CONE) the next hit chains from`);
}
{ // Edit 78: the bounce off a car is Newtonian (proto.bounce.newton): the full post-impact velocity, then a slide on the ground
  const trial = (ov, mk) => { const s = setup('monument', ov), c = mk(s); s.fakes.push(c); let dist = 0, prev = null, kt = 0;
    for (let i = 0; i < 300; i++) { if (ev(s, 'knock').length) { c.vx = c.vy = 0; c.v = 0; } c.x += c.vx / 60; c.y += c.vy / 60; s.step(i === c.press ? { mx: c.dx, my: c.dy, aPress: true } : i > c.press && i < c.press + 3 ? { mx: c.dx, my: c.dy } : {}); while (s.phase === 'hitstop') s.step({});
      if (s.body.mode === 'knock') { kt += 1 / 60; if (prev) dist += Math.hypot(s.body.x - prev[0], s.body.y - prev[1]); prev = [s.body.x, s.body.y]; } }
    const k = ev(s, 'knock')[0], im = ev(s, 'impact')[0]; return { v: k ? k.speed : 0, d: dist, t: kt, dmg: im ? im.assessed : 0 }; };
  const flank = (ov) => trial(ov, (s) => { place(s, 240, RY); const c = car(s, 'sedan', 300, 130, Math.PI / 2, 120); Object.assign(c, { press: 20, dx: 1, dy: 0 }); return c; });
  const head = (ov) => trial(ov, (s) => { place(s, 330, RY); const c = car(s, 'sedan', 120, RY, 0, 138); Object.assign(c, { press: 20, dx: -1, dy: 0 }); return c; });
  const f0 = flank({ 'proto.bounce.newton': 0, 'proto.recoilScale': 0.6 }), f1 = flank({}), h0 = head({ 'proto.bounce.newton': 0, 'proto.recoilScale': 0.6 }), h1 = head({});
  ok(f1.v > f0.v * 1.5 && h1.d > h0.d * 3 && Math.abs(h1.dmg - h0.dmg) < 1e-6 && h1.t < 1.2,
    `Newtonian bounce: a dash into a moving sedan's flank bounces ${f1.v.toFixed(0)} u/s, ${f1.d.toFixed(0)} units (was ${f0.v.toFixed(0)}, ${f0.d.toFixed(0)}); head-on into an oncoming sedan ${h1.v.toFixed(0)} u/s, thrown ${h1.d.toFixed(0)} (was ${h0.d.toFixed(0)}). Damage unchanged (${h1.dmg.toFixed(0)}); control back after ${h1.t.toFixed(2)} s`);
  const hiE = head({ 'proto.restitution': 0.6 }), slick = head({ 'physics.slideFriction': 0.5 }), grip = head({ 'physics.slideFriction': 2 });
  ok(hiE.v > h1.v && slick.d > h1.d * 1.4 && grip.d < h1.d * 0.7, `tuned in the settings: restitution 0.6 throws at ${hiE.v.toFixed(0)} u/s; slide friction 0.5 slides ${slick.d.toFixed(0)}, 2 slides ${grip.d.toFixed(0)} (1: ${h1.d.toFixed(0)})`);
}
{ // 6.4–6.8 stay frozen
  const md5 = (b) => crypto.createHash('md5').update(b).digest('hex'), same = (f) => { let head = null; try { head = execSync('git show HEAD:prototypes/p6/' + f, { maxBuffer: 1 << 26 }); } catch (e) { head = null; } return !head || md5(head) === md5(fs.readFileSync(path.join(__dirname, f))); };
  ok(['dummies_p6_4.html', 'dummies_p6_5.html', 'dummies_p6_6.html', 'dummies_p6_7.html', 'dummies_p6_8.html'].every(same), 'dummies_p6_4.html to dummies_p6_8.html are byte-identical to their commits');
}

// ---------- 2. the page
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('SKIP browser checks: playwright not found'); return done(); }
  const url = 'file://' + path.join(__dirname, 'dummies_p6_9.html');
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
  let pg = await br.newPage({ viewport: { width: 1300, height: 900 } }); watch(pg); await boot(pg);
  await put(pg, RX, RY);
  await pg.keyboard.press('KeyL'); await pg.waitForTimeout(100); let q = await st(pg);
  const lockedKey = q.ev.includes('denied:locked');
  await pg.evaluate(() => { window.__dummies.sim.run.owned.legs1 = true; });
  await put(pg, RX, RY); await pg.keyboard.down('KeyD'); await pg.keyboard.press('KeyL'); await pg.waitForTimeout(140); q = await st(pg);
  const air = q.mode === 'jump' && q.z > 10;
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p79_jump.png') });
  await pg.waitForTimeout(500); await pg.keyboard.up('KeyD'); q = await st(pg);
  ok(lockedKey && air && q.ev.includes('jump-land'), `keys: L (B) is locked until Jump is installed; then L jumps (in the air ${air ? 'yes' : 'no'}), lands`);
  await put(pg, RX, RY); await pg.keyboard.down('KeyW'); await pg.keyboard.press('Space'); await pg.waitForTimeout(60); await pg.keyboard.up('KeyW'); q = await st(pg);
  ok(q.ev.includes('lunge') && Math.abs(q.facing * DEG + 90) < 1, `keys: W and SPACE (A) dash north at once (${(q.facing * DEG).toFixed(0)}°)`);
  await pg.evaluate(() => { const s = window.__dummies.sim; s.run.owned.arms1 = true; s.run.owned.arms2 = true; s.run.owned.battery1 = true; s.body.combo = { n: 3, t: s.t, mult: 3, clock: 0.4, kinds: ['dash', 'bounce', 'sling'], pts: 420, ended: false }; });
  await pg.waitForTimeout(300);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p79_desktop.png') });
  const fitD = await pg.evaluate(() => { const k = window.__dummiesScale(), st = document.getElementById('stage'); return { k, sw: st.clientWidth * devicePixelRatio, sh: st.clientHeight * devicePixelRatio, touch: window.__dummiesInput.TOUCH.on }; });
  ok(!fitD.touch && Math.abs(Math.max(1280 * fitD.k.scale + 2 * fitD.k.ox - fitD.sw, 720 * fitD.k.scale + 2 * fitD.k.oy - fitD.sh)) < 2 && (Math.abs(1280 * fitD.k.scale - fitD.sw) < 2 || Math.abs(720 * fitD.k.scale - fitD.sh) < 2),
    `desktop (1300 × 900): the screen fills the stage at ×${(fitD.k.scale * 2).toFixed(2)} (not a whole number); no touch controls`);
  await pg.evaluate(() => { const s = window.__dummies.sim; s.phase = 'shop'; window.__dummies.shopCol = 1; window.__dummies.shopRow = 0; s.run.credits = 3; s.run.owned.arms2 = true; s.body.combo = null; });
  await pg.waitForTimeout(250);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p79_shop.png') });
  await pg.keyboard.press('Space'); await pg.waitForTimeout(120);
  const shop1 = await pg.evaluate(() => ({ lv: window.__dummies.sim.tier('legs'), cr: window.__dummies.sim.run.credits }));
  await pg.keyboard.press('ArrowDown'); await pg.waitForTimeout(60);
  const shopRow = await pg.evaluate(() => window.__dummies.shopRow);
  await pg.keyboard.press('Space'); await pg.waitForTimeout(200);
  const left = await pg.evaluate(() => window.__dummies.sim.phase);
  ok(shop1.lv === 2 && shop1.cr === 1 && shopRow === 1 && left !== 'shop', `ability shop: one card per track; on Legs, SPACE buys the next level (level ${shop1.lv}, ${shop1.cr} credit left); down reaches DEPLOY (row ${shopRow}); SPACE deploys`);
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
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p79_padsetup.png') });
  await tap(3); await tap(2); await tap(1); await tap(0);
  const s1 = (await st(pg)).setup;
  await pg.evaluate(() => { window.__dummies.sim.run.owned.legs1 = true; });
  await put(pg, RX, RY); await tap(3); q = await st(pg); const dashed = q.ev.includes('lunge');
  await pg.waitForTimeout(700); await put(pg, RX, RY); await tap(2); q = await st(pg);
  ok(s0 === 'a' && s1 === null && dashed && q.ev.includes('jump'), 'joypad: G opens setup; buttons 3, 2, 1 become DASH, JUMP, GRAB; 3 dashes, 2 jumps');
  await pg.close();

  // touch, a phone held sideways
  const ctx = await br.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  pg = await ctx.newPage(); watch(pg);
  await pg.goto(url); await pg.waitForFunction(() => window.__dummies && window.__dummies.screen === 'title', null, { timeout: 30000 });
  const cdp = await ctx.newCDPSession(pg);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i })) });
  const L0 = await pg.evaluate(() => { const T = window.__dummiesInput; const L = T.touchLayoutCss(); return { on: T.TOUCH.on, media: matchMedia('(hover: none) and (pointer: coarse)').matches, body: document.body.className, a: L.face.find((f) => f.id === 'a') }; });
  await pg.evaluate(() => { window.__dummies.level = 2; });
  await touch('touchStart', [[L0.a.x, L0.a.y]]); await pg.waitForTimeout(60); await touch('touchEnd', []);
  await pg.waitForFunction(() => window.__dummies.sim && window.__dummies.screen === 'game' && window.__dummies.sim.phase === 'play', null, { timeout: 60000 });
  await pg.waitForTimeout(400);
  const L = await pg.evaluate(() => { const T = window.__dummiesInput, L = T.touchLayoutCss(), R = document.getElementById('game').getBoundingClientRect(), k = window.__dummiesScale(); return { L, field: L.field, R: { w: R.width, h: R.height }, screen: { w: 1280 * k.scale / devicePixelRatio, h: 720 * k.scale / devicePixelRatio } }; });
  const F = L.field, clearOf = (c, r) => c.x + r <= F.x0 + 1 || c.x - r >= F.x1 - 1;
  ok(L0.on && L0.media && /touch/.test(L0.body) && Math.abs(L.screen.h - 390) < 1 && clearOf(L.L.home, L.L.sr) && L.L.face.every((f) => clearOf(f, f.r)) && !L.L.face.find((f) => f.id === 'y') && L.L.face.length === 3 && L.L.face.find((f) => f.id === 'x').x < L.L.face.find((f) => f.id === 'b').x,
    `touch (844 × 390): on, as a phone ((hover: none) and (pointer: coarse)); the screen fills the height, ${L.screen.w.toFixed(0)} × ${L.screen.h.toFixed(0)}; stick (r ${L.L.sr.toFixed(0)}) left of the field, below the district map; Y X B A (r ${L.L.face[0].r.toFixed(0)}) right of it, below the chassis; none over the field`);
  await put(pg, RX, RY + 100);
  const home = [L.L.home.x, L.L.home.y], at = (deg, k) => [home[0] + Math.cos(deg / DEG) * L.L.sr * k, home[1] + Math.sin(deg / DEG) * L.L.sr * k];
  await touch('touchStart', [home]); await touch('touchMove', [at(-25, 1)]); await pg.waitForTimeout(150);
  const t0 = await st(pg); await pg.waitForTimeout(400); const t1 = await st(pg);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p79_phone.png') });
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
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p79_portrait.png') });
  ok(rot && Math.hypot(p1.x - p0.x, p1.y - p0.y) < 0.5, 'touch, upright: "turn your phone sideways" covers the screen; the dummy does not move');
  await ctx.close();
  ok(!logs.length, 'browser: no page errors' + (logs.length ? ' — ' + logs.slice(0, 3).join('; ') : ''));
  await br.close();
  done();
})();
function done() { console.log(`\n${pass} passed, ${fail} failed`); process.exitCode = fail ? 1 : 0; }
