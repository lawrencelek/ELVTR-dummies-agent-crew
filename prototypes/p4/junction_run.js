// Junction matrix (P4, GDD Edit 49.3): 45° junction ideas against a 90° T and a 90° three-arm roundabout, P4 driver.
// node junction_run.js [seconds] → docs/junction_results.json and .md. Automated evidence, not human playtest.
const fs = require('fs'), path = require('path');
const X = require('./sim.js'), L = require('./lab.js');
const SECS = +process.argv[2] || 180;
const PIECES = [['tee', 'R', [64, 96]], ['y45', 'R', [64, 96]], ['y45fork', 'R', [64, 96]], ['tee45', 'R', [64, 96]], ['roundabout45', 'Rf', [64, 96]], ['roundabout3', 'Rf', [96]]];
const extra = { tee45: { run: 192 } };
const MIXES = [['expanded', 2.5, 0], ['expanded', 1.5, 0], ['p3', 2.5, 0.4]];
const rows = [];
for (const [piece, key, vals] of PIECES) for (const v of vals) for (const [fleet, interval, vanShare] of MIXES) for (const seed of [11, 23]) {
  const q = Object.assign({ [key]: v }, extra[piece] || {});
  const r = L.run(X, piece, q, { fleet, interval, vanShare, seconds: SECS, seed, overrides: {} });
  rows.push(Object.assign(r, { seed, minor: +(r.rankStop[2] || 0).toFixed(1), major: +(r.rankStop[0] || 0).toFixed(1) }));
}
const ok = (r) => r.jamAt == null && r.overlapS === 0;
fs.writeFileSync(path.join(__dirname, 'docs', 'junction_results.json'), JSON.stringify({ seconds: SECS, rows }, null, 1));
const md = ['# Junction results (P4, Edit 49.3)', '', `Each run: ${SECS} s, P4 driver, the dummy away. Mixes: expanded fleet (all eight classes, bus 96) one car every 2.5 s or 1.5 s; P3 fleet (40% vans) every 2.5 s. Two seeds.`,
  'Minor wait: the longest a car stood on the minor road (or a ring entry). Pass: no jam, no bodies overlapping.', '',
  '| Piece | Setting | Lane R (min) | Mix | Seed | Cars out /min | Longest wait, minor (s) | Longest wait, major (s) | Jam at (s) | Bodies overlap (s) | Bus outside lane (max) | Pass |', '|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---|'];
for (const r of rows) md.push(`| ${L.PIECES[r.piece].name} | ${Object.entries(r.q).map(([k, v]) => k + ' ' + v).join(', ')} | ${r.laneR} | ${r.fleet} ${r.interval} s | ${r.seed} | ${r.exitedPerMin} | ${r.minor} | ${r.major} | ${r.jamAt ?? '—'} | ${r.overlapS} | ${r.overhang.bus ?? '—'} | ${ok(r) ? 'yes' : '**no**'} |`);
fs.writeFileSync(path.join(__dirname, 'docs', 'junction_results.md'), md.join('\n') + '\n');
const by = {};
for (const r of rows) { const k = r.piece + ' ' + Object.entries(r.q).map(([a, b]) => a + b).join(','); (by[k] = by[k] || []).push(r); }
for (const [k, rs] of Object.entries(by)) {
  const f = (sel) => rs.filter(sel), rate = (a) => Math.min(...a.map((r) => r.exitedPerMin)) + '–' + Math.max(...a.map((r) => r.exitedPerMin));
  console.log(k.padEnd(22), rs.every(ok) ? 'ok  ' : 'FAIL', 'out/min 2.5s', rate(f((r) => r.fleet === 'expanded' && r.interval === 2.5)), '1.5s', rate(f((r) => r.interval === 1.5)),
    'minor max', Math.max(...rs.map((r) => r.minor)), 'major max', Math.max(...rs.map((r) => r.major)), 'bus', Math.max(...rs.map((r) => r.overhang.bus || 0)), 'laneR', rs[0].laneR,
    rs.some((r) => r.jamAt != null) ? 'JAM ' + rs.filter((r) => r.jamAt != null).map((r) => r.fleet + r.interval + '@' + r.jamAt).join(',') : '', rs.some((r) => r.overlapS) ? 'OVL ' + Math.max(...rs.map((r) => r.overlapS)) : '');
}
console.log('wrote docs/junction_results.md,', rows.length, 'runs');
