// Fleet mock-up matrix (P4, GDD Edit 49.2): the expanded fleet and buses of three lengths on the road pieces, P4 driver.
// node fleet_run.js [seconds] → docs/fleet_results.json and .md. Automated evidence, not human playtest.
const fs = require('fs'), path = require('path');
const X = require('./sim.js'), L = require('./lab.js');
const SECS = +process.argv[2] || 180;
const PIECES = [['corner', 'R', [64, 96, 128, 160, 224]], ['stepped', 'R', [64]], ['diagonal', 'R', [224]], ['roundabout', 'Rf', [96, 128, 160]], ['roundaboutL', 'Rf', [96, 128, 160]], ['roundabout4', 'Rf', [96, 128, 160]]];
const extra = { diagonal: { lat: 160 } };
const rows = [];
for (const [piece, key, vals] of PIECES) for (const v of vals) for (const busL of [96, 120, 144]) for (const fleet of ['expanded', 'buses']) {
  const q = Object.assign({ [key]: v }, extra[piece] || {});
  rows.push(L.run(X, piece, q, { fleet, interval: fleet === 'buses' ? 4 : 2.5, seconds: SECS, seed: 11, overrides: { 'vehicles.bus.length': busL } }));
}
const ok = (r) => r.jamAt == null && r.overlapS === 0 && (r.overhang.bus || 0) <= 8;
fs.writeFileSync(path.join(__dirname, 'docs', 'fleet_results.json'), JSON.stringify({ seconds: SECS, rows }, null, 1));
const md = ['# Fleet mock-up results (P4, Edit 49.2)', '', `Each run: ${SECS} s, P4 driver, the dummy away. Expanded fleet: one car every 2.5 s, all eight canon classes. Buses: one bus every 4 s.`,
  'Overhang: how far a body corner stands outside its own lane (half a lane each side of its path). A run passes with no jam, no overlap and bus overhang ≤ 8.', '',
  '| Piece | Setting | Lane R (min) | Bus length | Fleet | Cars out /min | Jam at (s) | Bodies overlap (s) | Bus overhang (max) | Other classes (max) | Pass |', '|---|---|---:|---:|---|---:|---:|---:|---:|---:|---|'];
for (const r of rows) {
  const others = Math.max(0, ...Object.entries(r.overhang).filter(([k]) => k !== 'bus').map(([, v]) => v));
  md.push(`| ${L.PIECES[r.piece].name} | ${Object.entries(r.q).map(([k, v]) => k + ' ' + v).join(', ')} | ${r.laneR} | ${r.busL} | ${r.fleet} | ${r.exitedPerMin} | ${r.jamAt ?? '—'} | ${r.overlapS} | ${r.overhang.bus ?? '—'} | ${r.fleet === 'buses' ? '—' : others} | ${ok(r) ? 'yes' : '**no**'} |`);
}
fs.writeFileSync(path.join(__dirname, 'docs', 'fleet_results.md'), md.join('\n') + '\n');
for (const busL of [96, 120, 144]) {
  const by = {};
  for (const r of rows.filter((x) => x.busL === busL)) { const k = r.piece + ' ' + Object.entries(r.q).map(([a, b]) => a + b).join(','); (by[k] = by[k] || []).push(r); }
  console.log('bus ' + busL + ': ' + Object.entries(by).map(([k, rs]) => k + (rs.every(ok) ? ' ok' : ' FAIL(' + Math.max(...rs.map((r) => r.overhang.bus || 0)) + (rs.some((r) => r.overlapS) ? ',overlap' : '') + (rs.some((r) => r.jamAt != null) ? ',jam' : '') + ')')).join('; '));
}
console.log('others max overhang', Math.max(...rows.filter((r) => r.fleet === 'expanded').flatMap((r) => Object.entries(r.overhang).filter(([k]) => k !== 'bus').map(([, v]) => v))));
console.log('wrote docs/fleet_results.md,', rows.length, 'runs');
