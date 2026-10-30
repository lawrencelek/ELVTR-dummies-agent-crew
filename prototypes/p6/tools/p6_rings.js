// Edit 71: roundabout entries. The managed world runs with the view touring all nine screens; at every roundabout's entry
// lines (a lane with giveWay) each car's wait is timed (stopped or yielding before the line), and every entry counted.
// Signals: the share of entering cars that signal as they approach; how many entering cars cross the line on a leaving car's
// signal (in the last 0.5 s before the line, the check passed only because a circulating car signalled its exit; without
// signals it would have held).
// Run from prototypes/p6: node tools/p6_rings.js [seconds per screen, default 40] [district] [key=value overrides…]
'use strict';
const W6 = require('../world6.js');
function rings(id, secs, ov) {
  const w = W6.buildWorld(id), waits = [], long = [], seen = new Map(), goers = new Set(); let entries = 0, signalled = 0;
  if (ov) for (const s of w.sims) s.P = Object.assign({}, s.P, ov);
  for (const s of w.sims) { // a car goes on a signal when the check passes only because it read one: without signals it would hold
    const gh = s.giveWayHold.bind(s);
    s.giveWayHold = (c) => { const r = gh(c); if (!r && c._gwSkip) { const D = s.P['traffic.signalDistance']; s.P['traffic.signalDistance'] = 0; const r0 = gh(c); s.P['traffic.signalDistance'] = D; c._gwSkip = true; if (r0) c._sigGoT = s.t; } return r; };
  }
  for (const sc of w.scs) for (let k = 0; k < secs * 60; k++) {
    W6.stepWorld(w, null, sc);
    for (const s of w.sims) for (const c of s.cars) {
      const g = c.path && c.path.giveWay; if (!g || c.ghost) continue;
      const nose = c.s + c.L / 2, q = seen.get(c.id) || { wait: 0, done: false, sig: false };
      if (!q.done && nose < g.s + 2 && nose > g.s - 120) { if (c.v < 8 || c.yielding) q.wait += 1 / 60; if (s.signalSide(c)) q.sig = true; }
      if (!q.done && nose >= g.s + 2) { q.done = true; entries++; waits.push(q.wait); long.push([q.wait, c.id, sc.name || '', +s.t.toFixed(1)]); if (q.sig) signalled++; if (c._sigGoT != null && s.t - c._sigGoT < 0.5) goers.add(c.id); }
      seen.set(c.id, q);
    }
  }
  waits.sort((a, b) => a - b);
  const mean = waits.reduce((a, b) => a + b, 0) / (waits.length || 1), p90 = waits[Math.floor(waits.length * 0.9)] || 0;
  long.sort((a, b) => b[0] - a[0]);
  return { id, entries, mean, p90, max: waits[waits.length - 1] || 0, signalled, exitGo: goers.size, longest: long.slice(0, 3) };
}
module.exports = { rings };
if (require.main === module) {
  const secs = +(process.argv[2] || 40), ov = {};
  for (const a of process.argv.slice(4)) { const [k, v] = a.split('='); ov[k] = +v; }
  for (const id of process.argv[3] && process.argv[3] !== 'all' ? [process.argv[3]] : W6.LEVEL_LIST) {
    const r = rings(id, secs, Object.keys(ov).length ? ov : null);
    console.log(`${id}: ${r.entries} roundabout entries; wait at the line mean ${r.mean.toFixed(2)} s, 90% ${r.p90.toFixed(2)} s, longest ${r.max.toFixed(1)} s; ${r.signalled} signalled on approach; ${r.exitGo} cars went on a leaving car's signal${r.longest.length && r.longest[0][0] > 0 ? '; longest: ' + r.longest.map((q) => q[0].toFixed(1) + ' s ' + q[1] + ' (view ' + q[2] + ', t ' + q[3] + ')').join(', ') : ''}`);
  }
}
