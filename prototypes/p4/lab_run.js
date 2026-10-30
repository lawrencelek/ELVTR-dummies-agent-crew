// Turn Lab matrix (P4, GDD Edit 49): every road piece over a range of radii, three vehicle mixes, the P3 and the P4 driver.
// node lab_run.js [seconds] → docs/turn_lab_results.json and .md. Automated evidence, not human playtest.
const fs = require('fs'), path = require('path');
const X = require('./sim.js'), L = require('./lab.js');
const SECS = +process.argv[2] || 180, INTERVAL = 2.5;
const MIXES = [['sedans', 0], ['mixed 40% vans', 0.4], ['vans', 1]];
const SWEEPS = [
  ['corner', 'R', [24, 32, 40, 48, 56, 64, 96, 128]],
  ['zjog', 'R', [64]], // P3's zigzag: the offset decides the bend
  ['diagonal', 'R', [64, 96, 128, 224]],
  ['chamfer', 'R', [64, 96, 128, 224]],
  ['stepped', 'R', [32, 48, 64]],
  ['roundabout', 'Rf', [0, 32, 48, 64, 96, 128]],
  ['roundaboutL', 'Rf', [0, 32, 48, 64, 96, 128]],
  ['roundabout3', 'Rf', [64, 96]], // Edit 49.1: every route through three arms, one way round, give way at entry
  ['roundabout4', 'Rf', [64, 96]],
];
const INTERVALS = { roundabout3: [2.5, 1.5], roundabout4: [2.5, 1.5] }; // multi-arm: also dense traffic
// P3 driver = P3.4: straight strip, no jam reverse, no give-way. P4 = all Edit 49 rules.
const MODE = (drv) => (drv ? {} : { 'traffic.followRoad': 0, 'traffic.jamReverse': 0, 'traffic.giveWayGap': 0 });
const extra = { zjog: [{ lat: 48 }, { lat: 84 }, { lat: 128 }, { lat: 168 }], diagonal: [{ lat: 84 }, { lat: 160 }, { lat: 240 }], chamfer: [{ cut: 96 }, { cut: 160 }] };
const rows = [];
for (const [piece, key, vals] of SWEEPS) for (const v of vals) for (const ex of extra[piece] || [{}]) for (const iv of INTERVALS[piece] || [INTERVAL]) for (const [mix, vs] of MIXES) for (const drv of [0, 1]) {
  const q = Object.assign({ [key]: v }, ex);
  rows.push(Object.assign(L.run(X, piece, q, { vanShare: vs, interval: iv, seconds: SECS, seed: 11, overrides: Object.assign({ 'traffic.gridlockSeconds': 6 }, MODE(drv)) }), { mix }));
}
const ok = (r) => r.jamAt == null && r.overlapS === 0;
const out = path.join(__dirname, 'docs');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'turn_lab_results.json'), JSON.stringify({ seconds: SECS, interval: INTERVAL, rows }, null, 1));
const fmtQ = (q) => Object.entries(q).map(([k, v]) => k + ' ' + v).join(', ');
const md = ['# Turn Lab results (P4, Edits 49 and 49.1)', '', `Each run: ${SECS} s of traffic, one car every ${INTERVAL} s (±20%; multi-arm roundabouts also every 1.5 s), the dummy away. Spawn hold on (\`traffic.gridlockSeconds\` 6).`,
  'Driver P3: straight strip, no jam reverse, no give-way. Driver P4: every Edit 49 and 49.1 rule.',
  'A run passes with no jam (a car stopped ≥ 6 s waiting on nothing or on a cycle of cars) and no time with car bodies overlapping.', '',
  '| Piece | Setting | Centre R | Lane R (min) | Every (s) | Mix | Driver | Cars out /min | Longest stop (s) | Jam at (s) | Bodies overlap (s) | Spawns held (s) | Pass |',
  '|---|---|---:|---:|---:|---|---|---:|---:|---:|---:|---:|---|'];
for (const r of rows) md.push(`| ${L.PIECES[r.piece].name} | ${fmtQ(r.q)} | ${r.centreR} | ${r.laneR} | ${r.interval} | ${r.mix} | ${r.driver} | ${r.exitedPerMin} | ${r.maxStop} | ${r.jamAt ?? '—'} | ${r.overlapS} | ${r.heldS} | ${ok(r) ? 'yes' : '**no**'} |`);
fs.writeFileSync(path.join(out, 'turn_lab_results.md'), md.join('\n') + '\n');
// summary: per piece and driver, the smallest setting that passes for every mix
const sum = {};
for (const r of rows) { const k = r.piece + ' ' + r.driver + ' every ' + r.interval + ' ' + fmtQ(Object.fromEntries(Object.entries(r.q).filter(([kk]) => kk !== 'R' && kk !== 'Rf'))); (sum[k] = sum[k] || []).push(r); }
for (const [k, rs] of Object.entries(sum)) {
  const byV = {}; for (const r of rs) { const v = r.q.R ?? r.q.Rf; (byV[v] = byV[v] || []).push(r); }
  const pass = Object.entries(byV).filter(([, g]) => g.every(ok)).map(([v, g]) => `${v} (lane ${Math.min(...g.map((r) => r.laneR))})`);
  console.log(k.padEnd(34), 'passes at', pass.join(', ') || 'none');
}
console.log('wrote docs/turn_lab_results.md,', rows.length, 'runs');
