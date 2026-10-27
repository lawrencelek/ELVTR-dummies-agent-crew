// Prototype 6.1 (GDD Edit 69): the traffic soak. Each district runs with the screen in view moving through all nine
// screens in turn (the player touring), and the game's own managed traffic. Per screen in view: cars seen (mean, fewest),
// cars that appear or vanish inside the view (never allowed), cars overlapping on one level (never allowed). Per district:
// headway spread at lane mid-points, the longest stop, samples of cars stopped over 10 s, cars culled out of view.
// Run from prototypes/p6: node tools/p6_traffic.js [seconds per screen, default 40] [district]   (exits 1 on any failure)
'use strict';
const W6 = require('../world6.js'), X = require('../sim.js');
const P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), W = P['world.width'], H = P['world.height'];
const LIMITS = { popIn: 0, overlap: 0, longestStop: 30, emptyShare: 0.2 };

function soak(id, secs) {
  const w = W6.buildWorld(id), away = { alive: true, x: -9999, y: -9999, vx: 0, vy: 0, level: 9, floor: null, stair: null, mode: 'idle', parts: null, facing: 0 };
  const per = [], pass = new Map(), last = new Map(); let maxStop = 0, who = '', stopped = 0, overlaps = [], popIns = [];
  for (const sc of w.scs) {
    const act = sc, seen = new Map(); let n = 0, empty = 0, fewest = 1e9, sum = 0;
    for (let k = 0; k < secs * 60; k++) {
      W6.stepWorld(w, away, act);
      const cars = W6.viewCars(w, act), now = new Map();
      for (const c of cars) if (!c.ghost) now.set(c.id, c);
      if (k > 60) { // a car appearing or vanishing inside the view, away from its edges
        for (const [cid, c] of now) if (!seen.has(cid) && c.x > 40 && c.x < W - 40 && c.y > 40 && c.y < H - 40 && !(act.hillLayer && act.hillLayer.inBand(c.x, c.y))) popIns.push(`${act.name} ${cid} appeared at ${Math.round(c.x)},${Math.round(c.y)}`);
        for (const [cid, c] of seen) if (!now.has(cid) && !c.spent && c.x > 40 && c.x < W - 40 && c.y > 40 && c.y < H - 40 && !(act.hillLayer && act.hillLayer.inBand(c.x, c.y))) { const alive = w.sims.some((s) => s.cars.some((q) => q.id === cid)); if (!alive) popIns.push(`${act.name} ${cid} vanished at ${Math.round(c.x)},${Math.round(c.y)}`); }
      }
      seen.clear(); for (const [cid, c] of now) seen.set(cid, { x: c.x, y: c.y, spent: c.spent });
      if (k % 60 === 0) {
        const z0 = cars.filter((c) => !(c.elev || 0)).length; n++; sum += z0; fewest = Math.min(fewest, z0); if (!z0) empty++;
        for (const s of w.sims) {
          for (const c of s.cars) { if ((c.stopT || 0) > maxStop) { maxStop = c.stopT; who = c.id + ' in ' + s.sc.name; } if ((c.stopT || 0) > 10) stopped++; }
          for (let i = 0; i < s.cars.length; i++) for (let j = i + 1; j < s.cars.length; j++) { const a = s.cars[i], b = s.cars[j]; if ((a.elev || 0) === (b.elev || 0) && Math.hypot(a.x - b.x, a.y - b.y) < 0.45 * Math.min(a.L || 56, b.L || 56)) overlaps.push(`${s.sc.name} ${a.id}/${b.id} at ${Math.round(a.x)},${Math.round(a.y)}`); }
        }
      }
      for (const r of w.recs) { if (r.elev !== 0 || r.deck != null || !r.ends.in || !r.ends.out || r.s.lab) continue; const mid = (r.ends.in.s + r.ends.out.s) / 2; for (const c of r.s.cars) { if (c.path !== r.path) continue; const prev = last.get(c.id); if (prev != null && prev < mid && c.s >= mid) { const a = pass.get(r) || []; a.push(w.t); pass.set(r, a); } last.set(c.id, c.s); } }
    }
    const hasRoad = sc.flow && sc.flow.get('street0') && sc.flow.get('street0').target >= 1;
    per.push({ name: sc.name, mean: sum / n, fewest, empty: empty / n, road: !!hasRoad });
  }
  const hw = []; for (const ts of pass.values()) for (let i = 1; i < ts.length; i++) hw.push(ts[i] - ts[i - 1]);
  const m = hw.reduce((a, b) => a + b, 0) / (hw.length || 1), cv = Math.sqrt(hw.reduce((a, b) => a + (b - m) ** 2, 0) / (hw.length || 1)) / (m || 1);
  return { id, per, cv, n: hw.length, maxStop, who, stopped, overlaps, popIns, culled: w.culled, minutes: 9 * secs / 60 };
}
module.exports = { soak, LIMITS };
if (require.main === module) {
  const secs = +(process.argv[2] || 40); let bad = 0;
  for (const id of process.argv[3] ? [process.argv[3]] : W6.LEVEL_LIST) {
    const r = soak(id, secs), road = r.per.filter((q) => q.road), worstEmpty = Math.max(...road.map((q) => q.empty));
    console.log(`${id}: ${r.minutes} min touring all nine screens; in view ${r.per.map((q) => q.name + ' ' + q.mean.toFixed(1) + (q.road ? ' (≥' + q.fewest + ', empty ' + Math.round(q.empty * 100) + '%)' : '')).join(' · ')}`);
    console.log(`   headway CV ${Math.round(r.cv * 100)}% (n ${r.n}); longest stop ${r.maxStop.toFixed(1)} s (${r.who}); samples stopped > 10 s ${r.stopped}; culled out of view ${r.culled}; appeared/vanished in view ${r.popIns.length}; overlaps ${r.overlaps.length}`);
    if (r.popIns.length) console.log('   ' + r.popIns.slice(0, 6).join('; '));
    if (r.overlaps.length) console.log('   ' + r.overlaps.slice(0, 6).join('; '));
    bad += (r.popIns.length > LIMITS.popIn) + (r.overlaps.length > LIMITS.overlap) + (r.maxStop >= LIMITS.longestStop) + (worstEmpty >= LIMITS.emptyShare);
  }
  process.exit(bad ? 1 : 0);
}
