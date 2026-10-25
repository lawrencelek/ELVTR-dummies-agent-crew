// A 45° road crossing a W–E road (GDD Edit 55, example only): today's crossroads and four engineered treatments, run on the
// P5 driver. Cars only (junction turns are under vehicles.bus.minRadius). Three arrival rates, three seeds, 180 s each.
// node tools/crossing_report.js → docs/crossing_report.json and .md. Automated evidence, not human playtest.
const fs = require('fs'), path = require('path');
const X = require(path.join(__dirname, '..', 'sim.js')), L = require(path.join(__dirname, '..', 'lab.js'));
const P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), SEEDS = [11, 23, 37], SECS = 180, RATES = [2.5, 1.8, 1.2];
const OPTS = [['Today: crossroads at 45°', 'cross45'], ['A · Realigned to 90°', 'cross45realign'], ['B · Staggered T junctions', 'cross45stagger'], ['C · Roundabout, skew kept', 'cross45ring'], ['D · Flyover (grade separated)', ['cross45flyMajor', 'cross45flyDiag']]];
const qOf = (k) => { const pc = L.PIECES[k], q = {}; for (const pr of pc.params) q[pr] = pc.defaults && pc.defaults[pr] ? P[pc.defaults[pr]] : 96; return q; };
// Conflict points (textbook): a four-leg crossing 32, two offset T junctions 22 (ODOT, Safety of 4-leg vs T), a four-leg
// roundabout 8 (FHWA), a flyover none where the roads cross. Realigning keeps 32, but every crossing meets at 90°.
const POINTS = { cross45: 32, cross45realign: 32, cross45stagger: 22, cross45ring: 8, cross45flyMajor: 0 };
function geometry(k) { const g = L.PIECES[k].build(X, qOf(k), P), lanes = g.lanes || X.lanesOf(g.center, P); return { minR: Math.round(Math.min(...lanes.map((l) => L.minRadius(l.pts).r))) }; }
const rows = [];
for (const [name, k] of OPTS) for (const iv of RATES) for (const seed of SEEDS) {
  const ks = Array.isArray(k) ? k : [k], rs = ks.map((kk) => L.run(X, kk, qOf(kk), { fleet: 'nobus', interval: iv * ks.length, seconds: SECS, seed }));
  rows.push({ name, piece: ks.join('+'), interval: iv, seed, outPerMin: +rs.reduce((a, r) => a + r.exitedPerMin, 0).toFixed(1), jam: rs.some((r) => r.jamAt != null), overlapS: +rs.reduce((a, r) => a + r.overlapS, 0).toFixed(1),
    maxStop: Math.max(...rs.map((r) => r.maxStop)), minorWait: Math.max(0, ...rs.map((r) => r.rankStop[2] || 0)) });
  process.stdout.write('.');
}
const geo = OPTS.map(([name, k]) => { const ks = Array.isArray(k) ? k : [k], gs = ks.map(geometry), minR = Math.min(...gs.map((g) => g.minR)); return { name, points: POINTS[ks[0]], minR: Number.isFinite(minR) ? minR : null }; });
const agg = (rs, f) => { const v = rs.map(f); return Math.min(...v) === Math.max(...v) ? '' + Math.min(...v) : Math.min(...v) + '–' + Math.max(...v); };
const md = ['# A 45° crossroads and four treatments (Edit 55, example only)', '', `A W–E road (major) crossed by a 45° road (minor). P5 driver, cars only, ${SECS} s, seeds ${SEEDS.join(', ')}; ranges are min–max. One car every N s across all entries.`, '',
  '## Geometry', '', '| Option | Conflict points (textbook) | Tightest lane radius on screen |', '|---|---:|---:|', ...geo.map((g) => `| ${g.name} | ${g.points} | ${g.minR == null ? 'straight' : g.minR} |`), '',
  '## Traffic', '', '| Option | One car every (s) | Cars out /min | Jams | Bodies overlap (s) | Longest stop (s) | Longest wait, 45° road (s) |', '|---|---:|---:|---:|---:|---:|---:|'];
for (const [name] of OPTS) for (const iv of RATES) { const rs = rows.filter((r) => r.name === name && r.interval === iv); md.push(`| ${name} | ${iv} | ${agg(rs, (r) => r.outPerMin)} | ${rs.filter((r) => r.jam).length} | ${agg(rs, (r) => r.overlapS)} | ${agg(rs, (r) => r.maxStop)} | ${agg(rs, (r) => r.minorWait)} |`); }
md.push('', '- Conflict points: ODOT, Safety of 4-leg vs T intersections (32 → 22 for two offset T junctions); FHWA (roundabout 8).', '- D runs the two roads apart (each at half the arrivals): nothing meets.', '- Cars out per minute saturate near 22–25 at one junction: the lab holds new cars while the entry is blocked.', '');
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'crossing_report.json'), JSON.stringify({ geo, rows }, null, 1));
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'crossing_report.md'), md.join('\n'));
console.log('\n' + md.join('\n'));
