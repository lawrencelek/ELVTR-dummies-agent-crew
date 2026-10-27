// Prototype 6.7 (GDD Edits 75–77) checks. Run from prototypes/p6: node test_p67.js [screenshot folder]
// Edit 77: the ability tracks (Battery, Legs, Arms, Throw by level), their wear shields, the battery's recharge; run to clear.
// 1. Headless (sim.js + world6.js + ../jump/jump.js): DIRECT turning; the Link's Awakening jump (distance from take-off speed,
//    the dash jump, steering, landing momentum) over cars, handrails and jumpable pieces; X grab, Y throw; combos; Ricochet;
//    the stair-head freeze fixed; 6.4, 6.5 and 6.6 frozen.
// 2. Browser (Playwright, dummies_p6_7.html): the ability shop; fit to screen; keys; an emulated USB joypad (phantom in slot 0, hat d-pad,
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
  Object.assign(s.body, { x, y, px: x, py: y, level: lv || 0, floor: fl == null ? null : fl, stair: null, drop: null, mode: 'idle', vx: 0, vy: 0, lunge: null, jump: null, z: 0, landT: 0, charge: 3, alive: true, facing: 0, combo: null });
  s.buildView(); s.events.length = 0;
};
const car = (s, cls, x, y, h, v) => ({ id: 'test-' + cls + '-' + s.fakes.length, model: 'TEST', cls, x, y, h, L: s.P['vehicles.' + cls + '.length'], W: s.P['vehicles.' + cls + '.width'], v: v || 0, vx: Math.cos(h) * (v || 0), vy: Math.sin(h) * (v || 0), elev: 0, spent: false, inEpisode: false, touched: false, state: 'cruise' });
const run = (s, n, cmd) => { for (let i = 0; i < n; i++) { s.step(typeof cmd === 'function' ? cmd(i) : cmd || {}); while (s.phase === 'hitstop' || s.phase === 'scroll') s.step({}); } };
const ev = (s, t) => s.events.filter((e) => e.type === t);
const RX = 40, RY = 196; // Monument B2: a clear run 260 long at this row

// ---------- 1. headless
{ // DIRECT
  const s = setup(); const P = s.P;
  ok(P['proto.turnModel'] === 2 && P['proto.input.fourButtons'] === 1 && P['proto.combo'] === 1 && P['proto.abilities'] === 1 && P['proto.jump.runToClear'] === 1, 'P6.7 runs DIRECT turning, four buttons, combos, ability tracks and run-to-clear (2, 1, 1, 1, 1); the shared sim keeps 6.4\'s rules (' + ['proto.turnModel', 'proto.input.fourButtons', 'proto.combo', 'proto.abilities', 'proto.jump.runToClear'].map((k) => X.PROTO[k]).join(', ') + ')');
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
  s.run.owned.legs1 = true;
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
    if (dash) { const probe = setup(); probe.run.owned.legs1 = true; place(probe, RX, RY); probe.step({ mx: 1, my: 0, aPress: true }); probe.step({ mx: 1, my: 0, bPress: true }); x0 = ev(probe, 'jump')[0].x; }
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
  const s = setup(); s.run.owned.legs1 = true;
  const sc = s.W6.at(1, 1), jq = sc.game.statics.filter((q) => q.jumpable), edge = sc.game.statics.filter((q) => q.kind === 'planter' || q.kind === 'bound' || q.kind === 'wall');
  const allLow = jq.every((q) => q.ht <= s.P['proto.art.jumpableTop'] && Math.min(q.piece[2], q.piece[3]) <= s.P['world.jumpableDepth']) && edge.every((q) => !q.jumpable);
  ok(counts.parkland + counts.monument + counts.waterfront > 40 && allLow, `jumpable tag: ${counts.parkland} Parkland, ${counts.waterfront} Waterfront, ${counts.monument} Monument runs at Z0: planters drawn ≤ ${s.P['proto.art.jumpableTop']} art px, ≤ ${s.P['world.jumpableDepth']} deep; edge planters, holds and walls never`);
  // jump across a jumpable piece: one with clear ground both sides along x, nothing else solid in the way
  let crossed = null;
  for (const id of ['monument', 'parkland', 'waterfront']) {
    const sj = id === 'monument' ? s : setup(id); sj.run.owned.legs1 = true;
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
  const s = setup('parkland'); s.run.owned.legs1 = true;
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
{ // X grab and place; Y throw
  const s = setup(); const cn = s.cones[0];
  place(s, cn.x - 22, cn.y); s.step({ xPress: true });
  const locked = ev(s, 'denied')[0];
  s.run.owned.arms1 = true; place(s, cn.x - 22, cn.y); s.step({ xPress: true }); const got = s.body.held === cn;
  s.step({}); s.step({ xPress: true }); const placed = !s.body.held && cn.state === 'free';
  s.step({ xPress: true }); s.step({ yPress: true }); const noThrow = ev(s, 'denied').find((e) => e.action === 'throw');
  s.run.owned.throw1 = true; s.step({ mx: 1, my: 0 }); s.step({ yPress: true }); run(s, 20, {});
  ok(locked && locked.why === 'locked' && got && placed && noThrow && noThrow.why === 'locked' && ev(s, 'throw').length === 1,
    'X picks up a cone (Arms 1), X again places it; Y throws it (Throw 1); without the level each is denied, "locked"');
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
  ok(Object.keys(T).join() === 'battery,legs,arms,throw' && Object.values(T).map((t) => t.button).join('') === 'ABXY' && Object.keys(N).length === 12 && P['abilities.maxLevel'] === 3,
    'four tracks, one per button: Battery (A), Legs (B), Arms (X), Throw (Y); three levels each (abilities.maxLevel)');
  s.phase = 'shop'; s.run.credits = 6;
  const c1 = s.canBuy('legs2'), c2 = s.canBuy('throw1'), b1 = s.buy('legs1'), b2 = s.buy('legs2'), c3 = s.canBuy('legs3');
  ok(c1.why === 'needs Legs 1' && c2.why === 'needs Arms 1' && b1.price === P['economy.price.ability.level1'] && b2.price === P['economy.price.ability.level2'] && c3.ok && c3.price === P['economy.price.ability.level3'] && s.tier('legs') === 2 && s.has('jump') && s.run.credits === 3,
    `levels in order: Legs 2 needs Legs 1; Throw needs Arms 1. Prices ${P['economy.price.ability.level1']}, ${P['economy.price.ability.level2']}, ${P['economy.price.ability.level3']} (economy.price.ability.level1–3). Legs 1 is the jump`);
  const b3 = s.buy('legs3'), more = s.canBuy('legs4');
  ok(b3.ok && s.tier('legs') === 3 && more.why === 'not sold' && s.run.credits === 0, 'Legs 3 tops the track; there is no level 4');
}
{ // Edit 77: each level shields its ability from wear (abilities.wearCut per level)
  const s = setup(), P = s.P, H = P['damage.bodyHealth'], cut = P['abilities.wearCut'];
  const at = (t, L, f) => { for (let k = 1; k <= 3; k++) { if (k <= L) s.run.owned[t + k] = true; else delete s.run.owned[t + k]; } return f(); };
  Object.assign(s.body.parts, { legL: 0.2 * H, legR: 0.2 * H, torso: 0.3 * H, armL: 0.3 * H, armR: 0.3 * H });
  const dash = [0, 1, 2, 3].map((L) => at('legs', L, () => s.partEffect('dash'))), speed = [0, 3].map((L) => at('legs', L, () => s.partEffect('speed')));
  const want = (L) => Math.max(P['movement.wearFloor'], 1 - P['proto.parts.legDashLoss'] * 0.4 * (1 - cut * L));
  ok(dash.every((v, L) => Math.abs(v - want(L)) < 1e-9) && speed[1] > speed[0],
    `Legs shield the legs: 40% leg damage leaves the dash ${dash.map((v) => Math.round(v * 100) + '%').join(' → ')} at levels 0–3; the run ${Math.round(speed[0] * 100)}% → ${Math.round(speed[1] * 100)}%`);
  const spc = [0, 1, 2, 3].map((L) => at('battery', L, () => { const save = s.body.parts.torso; s.body.parts.torso = 0; const v = s.secondsPerCharge(); s.body.parts.torso = save; return v; }));
  const rc = [0, 3].map((L) => at('battery', L, () => s.partEffect('recharge')));
  ok(spc.every((v, L) => Math.abs(v - P['battery.secondsPerCharge'] * Math.pow(P['abilities.battery.rechargeStep'], L)) < 1e-9) && Math.abs(rc[0] - (1 - P['proto.parts.torsoRechargeLoss'] * 0.3)) < 1e-9 && rc[1] > rc[0],
    `Battery: a charge every ${spc.map((v) => v.toFixed(2)).join(' → ')} s at levels 0–3; 30% torso damage slows the recharge to ${Math.round(rc[0] * 100)}% unshielded, ${Math.round(rc[1] * 100)}% at level 3`);
  // the recharge in play: drain, then time the refill
  const refill = (L, torso) => { const t = setup(); for (let k = 1; k <= L; k++) t.run.owned['battery' + k] = true; place(t, RX, RY); t.body.parts.torso = torso * H; t.body.charge = 0; let n = 0; while (t.body.charge < 1 - 1e-9 && n < 600) { t.step({}); n++; } return n / 60; };
  const r0 = refill(0, 0), r3 = refill(3, 0), rd = refill(0, 0.3), rd3 = refill(3, 0.3);
  ok(r3 < r0 * 0.6 && rd > r0 * 1.5 && rd3 < rd, `in play, one charge refills in ${r0.toFixed(2)} s; Battery 3 ${r3.toFixed(2)} s; with 30% torso damage ${rd.toFixed(2)} s, Battery 3 ${rd3.toFixed(2)} s`);
  const grip = [1, 2, 3].map((L) => at('arms', L, () => { s.body.parts.armL = s.body.parts.armR = 0.5 * H; return s.armsBroken(); }));
  const thr = [1, 3].map((L) => at('throw', L, () => { s.body.parts.armL = s.body.parts.armR = 0.3 * H; return s.partEffect('throw'); }));
  ok(at('arms', 0, () => { s.body.parts.armL = s.body.parts.armR = 0.5 * H; return s.armsBroken(); }) && !grip[0] && !grip[2] && thr[1] > thr[0],
    `Arms hold the grip: arms 50% damaged lose it unshielded, keep it from Arms 1. Throw shields the throw: 60% arm damage leaves ${Math.round(thr[0] * 100)}% at Throw 1, ${Math.round(thr[1] * 100)}% at Throw 3`);
}
{ // 6.4, 6.5 and 6.6 stay frozen
  const md5 = (b) => crypto.createHash('md5').update(b).digest('hex'), same = (f) => { let head = null; try { head = execSync('git show HEAD:prototypes/p6/' + f, { maxBuffer: 1 << 26 }); } catch (e) { head = null; } return !head || md5(head) === md5(fs.readFileSync(path.join(__dirname, f))); };
  ok(same('dummies_p6_4.html') && same('dummies_p6_5.html') && same('dummies_p6_6.html'), 'dummies_p6_4.html, dummies_p6_5.html and dummies_p6_6.html are byte-identical to their commits');
}

// ---------- 2. the page
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('SKIP browser checks: playwright not found'); return done(); }
  const url = 'file://' + path.join(__dirname, 'dummies_p6_7.html');
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
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p77_jump.png') });
  await pg.waitForTimeout(500); await pg.keyboard.up('KeyD'); q = await st(pg);
  ok(lockedKey && air && q.ev.includes('jump-land'), `keys: L (B) is locked until Jump is installed; then L jumps (in the air ${air ? 'yes' : 'no'}), lands`);
  await put(pg, RX, RY); await pg.keyboard.down('KeyW'); await pg.keyboard.press('Space'); await pg.waitForTimeout(60); await pg.keyboard.up('KeyW'); q = await st(pg);
  ok(q.ev.includes('lunge') && Math.abs(q.facing * DEG + 90) < 1, `keys: W and SPACE (A) dash north at once (${(q.facing * DEG).toFixed(0)}°)`);
  await pg.evaluate(() => { const s = window.__dummies.sim; s.run.owned.arms1 = true; s.run.owned.throw1 = true; s.run.owned.battery1 = true; });
  await pg.waitForTimeout(300);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p77_desktop.png') });
  const fitD = await pg.evaluate(() => { const k = window.__dummiesScale(), st = document.getElementById('stage'); return { k, sw: st.clientWidth * devicePixelRatio, sh: st.clientHeight * devicePixelRatio, touch: window.__dummiesInput.TOUCH.on }; });
  ok(!fitD.touch && Math.abs(Math.max(1280 * fitD.k.scale + 2 * fitD.k.ox - fitD.sw, 720 * fitD.k.scale + 2 * fitD.k.oy - fitD.sh)) < 2 && (Math.abs(1280 * fitD.k.scale - fitD.sw) < 2 || Math.abs(720 * fitD.k.scale - fitD.sh) < 2),
    `desktop (1300 × 900): the screen fills the stage at ×${(fitD.k.scale * 2).toFixed(2)} (not a whole number); no touch controls`);
  await pg.evaluate(() => { window.__dummies.sim.phase = 'shop'; window.__dummies.shopCol = 1; window.__dummies.shopRow = 1; window.__dummies.sim.run.credits = 3; });
  await pg.waitForTimeout(250);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p77_shop.png') });
  await pg.keyboard.press('Space'); await pg.waitForTimeout(120);
  const shop1 = await pg.evaluate(() => ({ lv: window.__dummies.sim.tier('legs'), cr: window.__dummies.sim.run.credits }));
  for (let i = 0; i < 3; i++) { await pg.keyboard.press('ArrowDown'); await pg.waitForTimeout(60); }
  const shopRow = await pg.evaluate(() => window.__dummies.shopRow);
  await pg.keyboard.press('Space'); await pg.waitForTimeout(200);
  const left = await pg.evaluate(() => window.__dummies.sim.phase);
  ok(shop1.lv === 2 && shop1.cr === 1 && shopRow === 3 && left !== 'shop', `ability shop: Legs 2 selected, SPACE buys it (level ${shop1.lv}, ${shop1.cr} credit left); down past Level 3 reaches DEPLOY (row ${shopRow}); SPACE deploys`);
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
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p77_padsetup.png') });
  await tap(3); await tap(2); await tap(1); await tap(0);
  const s1 = (await st(pg)).setup;
  await pg.evaluate(() => { window.__dummies.sim.run.owned.legs1 = true; });
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
  const L0 = await pg.evaluate(() => { const T = window.__dummiesInput; const L = T.touchLayoutCss(); return { on: T.TOUCH.on, media: matchMedia('(hover: none) and (pointer: coarse)').matches, body: document.body.className, a: L.face.find((f) => f.id === 'a') }; });
  await pg.evaluate(() => { window.__dummies.level = 2; });
  await touch('touchStart', [[L0.a.x, L0.a.y]]); await pg.waitForTimeout(60); await touch('touchEnd', []);
  await pg.waitForFunction(() => window.__dummies.sim && window.__dummies.screen === 'game' && window.__dummies.sim.phase === 'play', null, { timeout: 60000 });
  await pg.waitForTimeout(400);
  const L = await pg.evaluate(() => { const T = window.__dummiesInput, L = T.touchLayoutCss(), R = document.getElementById('game').getBoundingClientRect(), k = window.__dummiesScale(); return { L, field: L.field, R: { w: R.width, h: R.height }, screen: { w: 1280 * k.scale / devicePixelRatio, h: 720 * k.scale / devicePixelRatio } }; });
  const F = L.field, clearOf = (c, r) => c.x + r <= F.x0 + 1 || c.x - r >= F.x1 - 1;
  ok(L0.on && L0.media && /touch/.test(L0.body) && Math.abs(L.screen.h - 390) < 1 && clearOf(L.L.home, L.L.sr) && L.L.face.every((f) => clearOf(f, f.r)) && L.L.face.find((f) => f.id === 'y').y < L.L.face.find((f) => f.id === 'a').y && L.L.face.find((f) => f.id === 'x').x < L.L.face.find((f) => f.id === 'b').x,
    `touch (844 × 390): on, as a phone ((hover: none) and (pointer: coarse)); the screen fills the height, ${L.screen.w.toFixed(0)} × ${L.screen.h.toFixed(0)}; stick (r ${L.L.sr.toFixed(0)}) left of the field, below the district map; Y X B A (r ${L.L.face[0].r.toFixed(0)}) right of it, below the chassis; none over the field`);
  await put(pg, RX, RY + 100);
  const home = [L.L.home.x, L.L.home.y], at = (deg, k) => [home[0] + Math.cos(deg / DEG) * L.L.sr * k, home[1] + Math.sin(deg / DEG) * L.L.sr * k];
  await touch('touchStart', [home]); await touch('touchMove', [at(-25, 1)]); await pg.waitForTimeout(150);
  const t0 = await st(pg); await pg.waitForTimeout(400); const t1 = await st(pg);
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p77_phone.png') });
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
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p77_portrait.png') });
  ok(rot && Math.hypot(p1.x - p0.x, p1.y - p0.y) < 0.5, 'touch, upright: "turn your phone sideways" covers the screen; the dummy does not move');
  await ctx.close();
  ok(!logs.length, 'browser: no page errors' + (logs.length ? ' — ' + logs.slice(0, 3).join('; ') : ''));
  await br.close();
  done();
})();
function done() { console.log(`\n${pass} passed, ${fail} failed`); process.exitCode = fail ? 1 : 0; }
