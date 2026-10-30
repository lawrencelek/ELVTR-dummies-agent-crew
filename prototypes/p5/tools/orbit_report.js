// Inner-lane orbit (GDD Edit 52): the four-arm roundabout (Circus, Rc 160) and the Z1 ring (Parkland, Rc 132), orbit off and on.
// Free flow at three arrival rates; then a blocked exit (the dummy stands on the east exit from 20 s to 80 s of 120 s).
// node tools/orbit_report.js → docs/orbit_report.json and .md. Automated evidence, not human playtest.
const fs = require('fs'), path = require('path');
const X = require(path.join(__dirname, '..', 'sim.js')), L = require(path.join(__dirname, '..', 'lab.js'));
const RINGS = [['Circus ring (Rc 160)', {}], ['Parkland Z1 ring (Rc 132)', { 'world.roundaboutRadius': 132 }]];
const SEEDS = [11, 23, 37];
function blocked(over, iv, seed, SECS = 120, t0 = 20, t1 = 80) {
  const s = L.makeSim(X, 'roundabout4', { Rf: 96 }, { fleet: 'nobus', interval: iv, seconds: SECS, seed, overrides: over });
  const ln = s.level.lanes.find((l) => X.pathAt(l, l.length - 1).x > 700), spot = X.pathAt(ln, ln.ring.exitS + 70), st = s.lab.stats;
  const out = { other: 0, east: 0, inner: 0, maxLaps: 0 };
  for (let i = 0; i < SECS * 60; i++) {
    const on = s.t >= t0 && s.t < t1, before = s.cars.slice();
    s.step({}); if (on) { s.body.x = spot.x; s.body.y = spot.y; s.body.alive = true; } else { s.body.x = -900; s.body.y = -900; }
    for (const e of s.events || []) if (e.type === 'ring') { if (e.to === 'inner') out.inner++; else out.maxLaps = Math.max(out.maxLaps, e.laps || 0); }
    for (const c of before) if (!s.cars.includes(c)) { if (X.pathAt(c.path, c.path.length - 1).x > 700) out.east++; else out.other++; }
    s.events = [];
    let ov = false; for (let a = 0; a < s.cars.length && !ov; a++) for (let b = a + 1; b < s.cars.length; b++) if (L.overlap(s.cars[a], s.cars[b])) { ov = true; break; }
    if (ov) st.overlapT += 1 / 60;
    for (const c of s.cars) if (!(on && c.hz && c.hz.inPath) && (c.stopT || 0) > st.maxStop) st.maxStop = c.stopT;
    if (s.t > t1 + 5) { const jam = s.cars.filter((c) => (c.stopT || 0) >= 6 && ['cycle', 'none'].includes(s.jamCause(c, new Set([c])))); if (jam.length && st.jamAt == null) st.jamAt = +s.t.toFixed(1); }
  }
  return Object.assign(out, { overlapS: +st.overlapT.toFixed(1), maxStop: +st.maxStop.toFixed(1), jamAt: st.jamAt });
}
const free = [], block = [];
for (const [ring, base] of RINGS) for (const iv of [2.5, 1.5, 1.2]) for (const orbit of [0, 1]) for (const seed of SEEDS) {
  const r = L.run(X, 'roundabout4', { Rf: 96 }, { fleet: 'nobus', interval: iv, seconds: 180, seed, overrides: Object.assign({ 'traffic.ringOrbit': orbit }, base) });
  free.push({ ring, interval: iv, orbit, seed, outPerMin: r.exitedPerMin, jamAt: r.jamAt, overlapS: r.overlapS, maxStop: r.maxStop });
}
for (const [ring, base] of RINGS) for (const iv of [2.5, 1.5]) for (const orbit of [0, 1]) for (const seed of SEEDS) block.push(Object.assign({ ring, interval: iv, orbit, seed }, blocked(Object.assign({ 'traffic.ringOrbit': orbit }, base), iv, seed)));
const agg = (rows, keys) => { const g = {}; for (const r of rows) { const k = keys.map((q) => r[q]).join('|'); (g[k] = g[k] || []).push(r); } return Object.values(g); };
const md = ['# Inner-lane orbit (Edit 52)', '', 'Four arms, entry fillets 96, cars only (no buses on rings). Three seeds per row; ranges are min–max.', '', '## Free flow (180 s)', '',
  '| Ring | One car every (s) | Orbit | Cars out /min | Jams | Bodies overlap (s) | Longest stop (s) |', '|---|---:|---|---:|---:|---:|---:|'];
const rg = (rs, k) => { const v = rs.map((r) => r[k]); return Math.min(...v) === Math.max(...v) ? '' + Math.min(...v) : Math.min(...v) + '–' + Math.max(...v); };
for (const rs of agg(free, ['ring', 'interval', 'orbit'])) md.push(`| ${rs[0].ring} | ${rs[0].interval} | ${rs[0].orbit ? 'on' : 'off'} | ${rg(rs, 'outPerMin')} | ${rs.filter((r) => r.jamAt != null).length} | ${rg(rs, 'overlapS')} | ${rg(rs, 'maxStop')} |`);
md.push('', '## Blocked exit (the dummy on the east exit, 20–80 s of 120 s)', '', 'Other exits: cars out by the three free arms. Longest stop excludes cars waiting for the dummy itself.', '',
  '| Ring | One car every (s) | Orbit | Out by other arms | Out east | Moves to the inner lane | Most laps | Jams after | Bodies overlap (s) | Longest stop (s) |', '|---|---:|---|---:|---:|---:|---:|---:|---:|---:|');
for (const rs of agg(block, ['ring', 'interval', 'orbit'])) md.push(`| ${rs[0].ring} | ${rs[0].interval} | ${rs[0].orbit ? 'on' : 'off'} | ${rg(rs, 'other')} | ${rg(rs, 'east')} | ${rg(rs, 'inner')} | ${rg(rs, 'maxLaps')} | ${rs.filter((r) => r.jamAt != null).length} | ${rg(rs, 'overlapS')} | ${rg(rs, 'maxStop')} |`);
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'orbit_report.json'), JSON.stringify({ free, block }, null, 1));
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'orbit_report.md'), md.join('\n') + '\n');
console.log(md.join('\n'));
