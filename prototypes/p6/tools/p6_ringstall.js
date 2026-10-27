// Edit 72: why cars stall at and on roundabouts, and how their turn signals behave.
// The managed world runs with the view touring all nine screens (as tools/p6_rings.js). For every car on a ring route:
//   - stopped time (speed under 5) by phase (approach, ring, exit arm) and cause, sampled every 0.25 s;
//   - stalls: a stop of 5 s or more, by phase and cause at its start; a ring stall also names the head of its queue;
//   - ring jams: time during which two or more cars on one ring are all stopped;
//   - signals: every change of the signal a player sees (signalSide) from 140 before the line to 60 past the exit point.
// Overrides: key=value applies to the registry before the world builds and to every sim after it.
//   Shorthands: scale=k (vehicles.scale: every vehicle class's length, width, height × k; P6 default 0.9), speed=k (cruise speeds × k),
//   interval=k (every district's car interval × k: fewer cars for k > 1).
// Run from prototypes/p6: node tools/p6_ringstall.js [seconds per screen, default 40] [district|all] [watch=B2] [block=x,y] [seed=n] [key=value …]
// With watch, the run lasts nine screens' worth (9 × seconds) on the one screen.
'use strict';
const X = require('../sim.js');
const CLS = ['sedan', 'van', 'hatchback', 'police', 'bus'];
function expand(ov) {
  const o = {}, B = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES);
  for (const [k, v] of Object.entries(ov)) {
    if (k === 'scale') o['vehicles.scale'] = v; // P6 scales every class (world6.js)
    else if (k === 'speed') for (const c of CLS) o['vehicles.' + c + '.cruiseSpeed'] = B['vehicles.' + c + '.cruiseSpeed'] * v;
    else if (k === 'interval') for (const d of ['parkland', 'waterfront', 'monument']) o['world.district.' + d + '.interval'] = B['world.district.' + d + '.interval'] * v;
    else o[k] = v;
  }
  return o;
}
function stall(W6, id, secs, ov, watch, block, seed) {
  // seed: an independent sample. The tour starts seed screens on, after seed × 4 s unmeasured.
  // block: [x, y] on the watched screen. Each minute the dummy stands there 15 s, then goes back to its spawn; the time the
  // ring takes to recover (no ring car stopped over 1 s) is timed.
  // watch: a screen name. The dummy stands at that screen's first spawn, the view stays there, and only its rings count
  // (what a player sees standing by a ring). Else the view tours all nine screens.
  const w = W6.buildWorld(id, watch ? { budget: 4000 } : undefined);
  if (ov) for (const s of w.sims) s.P = Object.assign({}, s.P, ov);
  let s6 = null, wsc = null;
  if (watch) {
    s6 = new W6.Sim6(id, Object.assign({ 'run.appearances.road': 4000 }, ov || {}), null, { world: w }); wsc = w.at('ABC'.indexOf(watch[0]), +watch[1] - 1);
    s6.enter(wsc); const sp = wsc.game.spawns[0]; Object.assign(s6.body, { x: sp[0], y: sp[1], px: sp[0], py: sp[1], level: 0, floor: null, stair: null, mode: 'idle', vx: 0, vy: 0 }); s6.buildView(); s6.phase = 'play';
  }
  const place = (x, y) => { Object.assign(s6.body, { x, y, px: x, py: y, level: 0, floor: null, stair: null, mode: 'idle', vx: 0, vy: 0, alive: true }); };
  let rel = null;
  const R = { recover: [], id, entries: 0, waits: [], transit: [], stopped: {}, stalls: {}, heads: {}, jam: 0, sig: { cars: 0, extra: 0, patterns: {} }, worst: [] };
  const add = (m, k, v) => { m[k] = (m[k] || 0) + v; };
  const seen = new Map();
  let frames = 0;
  if (seed) for (let k = 0; k < seed * 240; k++) { W6.stepWorld(w, null, w.scs[seed % 9]); w.events.length = 0; for (const q of w.sims) q.events.length = 0; }
  const order = seed ? w.scs.slice(seed % 9).concat(w.scs.slice(0, seed % 9)) : w.scs;
  for (const sc of watch ? [wsc] : order) for (let k = 0; k < (watch ? 9 : 1) * secs * 60; k++) {
    if (block) { const ct = k % 3600; if (ct === 0) { if (rel != null) R.recover.push(99); rel = null; place(block[0], block[1]); } else if (ct === 900) { const sp = wsc.game.spawns[0]; place(sp[0], sp[1]); rel = w.t; } }
    if (watch) { s6.step({}); while (s6.phase === 'scroll' || s6.phase === 'hitstop') s6.step({}); s6.events.length = 0; s6.effects.length = 0; } else W6.stepWorld(w, null, sc);
    w.events.length = 0; for (const q of w.sims) q.events.length = 0;
    frames++;
    const sample = k % 15 === 0;
    const rings = new Map();
    for (const s of watch ? wsc.sims : w.sims) for (const c of s.cars) {
      const g = c.path && c.path.giveWay, rg = c.path && c.path.ring; if (!g || !rg || c.ghost) continue;
      const nose = c.s + c.L / 2, key = c.id;
      let q = seen.get(key); if (!q) { q = { wait: 0, done: false, out: false, joinT: null, stop: 0, stopCause: null, sig: [], last: null, ideal: null }; seen.set(key, q); }
      const phase = nose < g.s + 2 ? 'approach' : c.s <= rg.exitS + 2 ? 'ring' : c.s <= rg.exitS + 120 ? 'exit' : null;
      // signals as drawn
      if (phase && (phase !== 'approach' || g.s - nose < 140)) { const sd = s.signalSide(c); if (sd !== q.last) { q.sig.push(sd); q.last = sd; } }
      if (phase === 'ring' && rg.cx != null) { const kk = s.elev0 + ':' + rg.cx + ',' + rg.cy; const e = rings.get(kk) || { n: 0, stopped: 0 }; e.n++; if (c.v < 5) e.stopped++; rings.set(kk, e); }
      if (!q.done && phase === 'approach' && nose > g.s - 120 && (c.v < 8 || c.yielding)) q.wait += 1 / 60;
      if (!q.done && phase !== 'approach' && phase) { q.done = true; q.joinT = w.t; R.entries++; R.waits.push(q.wait); }
      if (q.done && !q.out && (phase === 'exit' || !phase)) { q.out = true; if (q.joinT != null) R.transit.push(w.t - q.joinT); finishSig(R, q, s, c); }
      if (!phase) continue;
      const cause = c.v < 5 ? why(s, c, phase) : null;
      if (sample && cause) add(R.stopped, phase + ': ' + cause, 0.25);
      if (c.v < 5) { if (q.stop === 0) q.stopCause = phase + ': ' + cause; q.stop += 1 / 60; }
      else if (q.stop > 0) { endStop(R, q, c, s); q.stop = 0; }
      if (c.v < 5 && q.stop >= 5 && !q.headDone && phase === 'ring') { q.headDone = true; add(R.heads, head(s, c), 1); }
      if (c.v >= 5) q.headDone = false;
    }
    for (const e of rings.values()) if (e.n >= 2 && e.stopped === e.n) R.jam += 1 / 60;
    if (rel != null && w.t - rel > 0.5) { let stuck = false; for (const q2 of wsc.sims) for (const c of q2.cars) { const g = c.path && c.path.giveWay, rg = c.path && c.path.ring; if (g && rg && !c.ghost && c.s + c.L / 2 >= g.s - 60 && c.s <= rg.exitS + 60 && (seen.get(c.id) || {}).stop > 1) stuck = true; } if (!stuck) { R.recover.push(+(w.t - rel).toFixed(1)); rel = null; } }
  }
  R.minutes = frames / 3600;
  return R;
}
function endStop(R, q, c, s) {
  if (q.stop < 5) return;
  const b = q.stop >= 10 ? '≥10 s' : '5–10 s';
  R.stalls[q.stopCause] = R.stalls[q.stopCause] || { '5–10 s': 0, '≥10 s': 0 }; R.stalls[q.stopCause][b]++;
  R.worst.push([+q.stop.toFixed(1), c.id, q.stopCause]); R.worst.sort((a, b2) => b2[0] - a[0]); R.worst.length = Math.min(R.worst.length, 5);
}
function why(s, c, phase) {
  const rg = c.path.ring, a = s.leadGap(c);
  if (c.hz && c.hz.inPath) return 'the dummy';
  if (phase === 'approach') {
    const h = s.giveWayHold(c);
    if (h) { const y = c._gwWhy; return 'give way (' + (Array.isArray(y) ? y[0] : y || '?') + ')'; }
    if (a && a.gap < 30) return 'queue';
    return 'other';
  }
  if (phase === 'ring') {
    if (c.orbit && c.orbit.lane === 'in' && c.orbit.wait != null) return 'inner lane, waiting to move out';
    if (a && a.gap < 40) { const o = a.car, org = o && o.path.ring; return o && org && o.s > org.exitS ? 'queue behind a car leaving' : 'queue behind a ring car'; }
    if (s.ringExitBlocked(c)) return 'exit blocked';
    if (c.man) return 'manoeuvre (' + c.man.type + ')';
    return 'other';
  }
  if (a && a.gap < 40) return 'queue';
  return 'other';
}
function head(s, c) { // the car at the head of c's queue, and why it stands
  let x = c, n = 0;
  for (; n < 30; n++) { const a = s.leadGap(x); if (!a || !a.car || a.gap > 40 || a.car.v > 5) break; x = a.car; }
  const rg = x.path && x.path.ring, g = x.path && x.path.giveWay;
  const where = !rg ? 'off the ring' : x.s + x.L / 2 < g.s + 2 ? 'at a give-way line' : x.s <= rg.exitS + 2 ? 'on the ring' : 'on an exit arm';
  return where + ', ' + (x === c ? 'itself' : 'queue of ' + (n + 1)) + ': ' + (rg ? why(s, x, x.s + x.L / 2 < g.s + 2 ? 'approach' : x.s <= rg.exitS + 2 ? 'ring' : 'exit') : 'other');
}
const IDEAL = (side) => (side === 1 ? [0, 1, 0] : side === -1 ? [0, -1, 1, 0] : [0, 1, 0]);
function finishSig(R, q, s, c) {
  const seq = [0].concat(q.sig).filter((v, i, a) => i === 0 || v !== a[i - 1]), side = c.path.sig ? c.path.sig.side : 0;
  const ideal = IDEAL(side), extra = Math.max(0, seq.length - ideal.length);
  R.sig.cars++; if (extra) R.sig.extra++;
  const k = (side === 1 ? 'first exit (right)' : side === -1 ? 'left or U-turn' : 'straight on') + ': ' + seq.map((v) => (v === 1 ? 'R' : v === -1 ? 'L' : '·')).join(' ');
  R.sig.patterns[k] = (R.sig.patterns[k] || 0) + 1;
}
function report(R) {
  const w = R.waits.slice().sort((a, b) => a - b), mean = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
  const lines = [`${R.id}: ${R.minutes.toFixed(1)} min; ${R.entries} entries (${(R.entries / R.minutes).toFixed(1)}/min); line wait mean ${mean(w).toFixed(2)} s, 90% ${(w[Math.floor(w.length * 0.9)] || 0).toFixed(2)} s; ring transit mean ${mean(R.transit).toFixed(1)} s; ring jam ${R.jam.toFixed(1)} s`];
  const st = Object.entries(R.stopped).sort((a, b) => b[1] - a[1]), tot = st.reduce((x, y) => x + y[1], 0);
  lines.push(`  stopped car-seconds a minute ${(tot / R.minutes).toFixed(1)}: ` + st.slice(0, 8).map(([k, v]) => `${k} ${(v / R.minutes).toFixed(1)}`).join(' · '));
  const sl = Object.entries(R.stalls).map(([k, v]) => [k, v['5–10 s'], v['≥10 s']]).sort((a, b) => b[1] + b[2] - a[1] - a[2]);
  lines.push(`  stalls ≥5 s: ${sl.reduce((x, y) => x + y[1] + y[2], 0)} (≥10 s: ${sl.reduce((x, y) => x + y[2], 0)}) · ` + sl.slice(0, 6).map(([k, a, b]) => `${k} ${a}+${b}`).join(' · '));
  const hd = Object.entries(R.heads).sort((a, b) => b[1] - a[1]);
  if (hd.length) lines.push('  ring stalls, head of the queue: ' + hd.slice(0, 5).map(([k, v]) => `${k} ×${v}`).join(' · '));
  lines.push(`  longest: ` + R.worst.map((q) => `${q[0]} s ${q[1]} (${q[2]})`).join(', '));
  const pt = Object.entries(R.sig.patterns).sort((a, b) => b[1] - a[1]);
  lines.push(`  signals: ${R.sig.cars} cars through; ${R.sig.extra} changed more than the ideal (${(100 * R.sig.extra / (R.sig.cars || 1)).toFixed(0)}%) · ` + pt.slice(0, 7).map(([k, v]) => `${k} ×${v}`).join(' · '));
  if (R.recover.length) lines.push('  after the dummy leaves, the ring recovers in: ' + R.recover.map((v) => (v === 99 ? '>45' : v) + ' s').join(', '));
  return lines.join('\n');
}
module.exports = { stall, report, expand };
if (require.main === module) {
  const secs = +(process.argv[2] || 40), raw = {}; let watch = null, block = null, seed = 0;
  for (const a of process.argv.slice(4)) { const [k, v] = a.split('='); if (k === 'watch') watch = v; else if (k === 'seed') seed = +v; else if (k === 'block') block = v.split(',').map(Number); else raw[k] = +v; }
  const ov = expand(raw); Object.assign(X.OVERRIDES, ov);
  const W6 = require('../world6.js');
  for (const id of process.argv[3] && process.argv[3] !== 'all' ? [process.argv[3]] : ['parkland', 'waterfront']) console.log(report(stall(W6, id, secs, Object.keys(ov).length ? ov : null, watch, block, seed)) + (watch ? '\n  (the dummy stands at ' + watch + "'s spawn; the view stays there)" : ''));
}
