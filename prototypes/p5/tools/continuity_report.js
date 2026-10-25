// District-wide traffic (GDD Edit 53, P5.3): every baked layout of the five game districts.
// Start: cars on each start-screen lane at frame 1. Run: 120 s with the dummy away; every car tracked in district
// coordinates (no jump, no loss, no double, no overlap, exits only at the district edge). Queue: the dummy stands just
// inside a start-screen edge for 45 s; cars queue on the screen before it. Then one car followed across an edge.
// node tools/continuity_report.js → docs/continuity_report.json and .md. Automated evidence, not human playtest.
const fs = require('fs'), path = require('path');
const X = require(path.join(__dirname, '..', 'sim.js'));
const W = 800, H = 640, SECS = 120;
const sat = (a, b) => {
  const ax = [Math.cos(a.h), Math.sin(a.h)], ay = [-ax[1], ax[0]], bx = [Math.cos(b.h), Math.sin(b.h)], by = [-bx[1], bx[0]], d = [b.x - a.x, b.y - a.y];
  for (const n of [ax, ay, bx, by]) {
    const pa = Math.abs(n[0] * ax[0] + n[1] * ax[1]) * a.L / 2 + Math.abs(n[0] * ay[0] + n[1] * ay[1]) * a.W / 2, pb = Math.abs(n[0] * bx[0] + n[1] * bx[1]) * b.L / 2 + Math.abs(n[0] * by[0] + n[1] * by[1]) * b.W / 2;
    if (Math.abs(n[0] * d[0] + n[1] * d[1]) > pa + pb - 0.5) return false;
  }
  return true;
};
const all = (s) => [].concat(...s.net.cells.map((q) => (q === s.netCur ? s.cars : q.tr.cars).map((c) => ({ c, q, x: q.cell[0] * W + c.x, y: q.cell[1] * H + c.y, h: c.h, L: c.L, W: c.W, layer: c.layer || 0 }))));
const rows = [];
for (const id of X.DISTRICT_LIST) for (const k of [1, 2, 3]) {
  const s = new X.Sim(id, { 'proto.layout': k, 'world.terrain.puddle.carBraking': 1 }); s.checkTerminal = () => {};
  const startCars = s.cars.filter((c) => !c.deck && c.x > 0 && c.x < W && c.y > 0 && c.y < H).length, prefill = s.slot;
  const last = new Map(); let maxJump = 0, overlaps = 0, badExit = 0, crossings = 0, t0 = Date.now();
  for (let i = 0; i < SECS * 60; i++) {
    const lanes = new Map(all(s).map((e) => [e.c.id, e.q.tr.lanes[e.c.lane]]));
    const n0 = s.events.length;
    s.step({}); s.body.x = -400; s.body.y = -400;
    for (const e of s.events.slice(n0)) { if (e.type === 'cross') crossings++; if (e.type === 'exit' && lanes.get(e.car).next) badExit++; }
    const cs = all(s);
    for (const e of cs) { const p = last.get(e.c.id); if (p) maxJump = Math.max(maxJump, Math.hypot(e.x - p[0], e.y - p[1]) - e.c.v / 60); last.set(e.c.id, [e.x, e.y]); }
    if (i % 6 === 0) for (let a = 0; a < cs.length; a++) for (let b = a + 1; b < cs.length; b++) if (cs[a].layer === cs[b].layer && cs[a].q !== cs[b].q && Math.hypot(cs[a].x - cs[b].x, cs[a].y - cs[b].y) < 110 && sat(cs[a], cs[b])) overlaps++;
  }
  const live = s.allCars().filter((c) => !c.deck).length, ms = (Date.now() - t0) / (SECS * 60);
  // queue: the dummy just inside the start screen's lane-0 entry edge
  const qs = new X.Sim(id, { 'proto.layout': k, 'proto.driver.patienceSeconds': 999, 'world.terrain.puddle.carBraking': 1 }); qs.checkTerminal = () => {};
  const ln = qs.netCur.tr.lanes[0], spot = X.pathAt(ln.path, ln.ends.in.s + 60); let queued = 0, qOverlap = 0, hits = 0;
  if (ln.prev) for (let i = 0; i < 45 * 60; i++) {
    Object.assign(qs.body, { x: spot.x, y: spot.y, vx: 0, vy: 0, health: 1e9 }); qs.step({});
    queued = Math.max(queued, ln.prev.q.tr.cars.filter((c) => c.lane === ln.prev.lane.i && c.v < 2).length);
    if (i % 6 === 0) { const cs = all(qs); for (let a = 0; a < cs.length; a++) for (let b = a + 1; b < cs.length; b++) if (cs[a].layer === cs[b].layer && cs[a].q !== cs[b].q && Math.hypot(cs[a].x - cs[b].x, cs[a].y - cs[b].y) < 110 && sat(cs[a], cs[b])) qOverlap++; }
  }
  hits = qs.events.filter((e) => e.type === 'impact').length;
  rows.push({ district: id, layout: k, startCars, prefill, crossings, maxJump: +maxJump.toFixed(2), seamOverlaps: overlaps, exitsInside: badExit, conserved: s.run.admitted === s.run.exited + live, admitted: s.run.admitted, exited: s.run.exited, live, queued, queueOverlaps: qOverlap, queueHits: hits, msPerTick: +ms.toFixed(3) });
  process.stdout.write('.');
}
// one car followed across an edge, tick by tick
const f = new X.Sim('interchange', { 'proto.layout': 1 }); f.checkTerminal = () => {}; f.body.x = -400; f.body.y = -400;
const q0 = f.netCur, car = f.cars.find((c) => !c.deck && q0.tr.lanes[c.lane].next && c.s < q0.tr.lanes[c.lane].ends.out.s - 150), follow = [];
for (let i = 0; i < 60 * 12; i++) {
  f.step({}); f.body.x = -400; f.body.y = -400;
  const q = f.net.cells.find((z) => (z === f.netCur ? f.cars : z.tr.cars).includes(car));
  follow.push({ t: +f.t.toFixed(3), screen: X.cellName(q.cell), id: car.id, model: car.model, lane: car.lane, s: +car.s.toFixed(1), v: +car.v.toFixed(2), gx: +(q.cell[0] * W + car.x).toFixed(1), gy: +(q.cell[1] * H + car.y).toFixed(1) });
  if (follow.length > 2 && follow[follow.length - 1].screen !== follow[0].screen && follow.filter((r) => r.screen !== follow[0].screen).length >= 30) break;
}
const ci = follow.findIndex((r) => r.screen !== follow[0].screen), around = follow.slice(Math.max(0, ci - 3), ci + 3);
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'continuity_report.json'), JSON.stringify({ rows, follow: around }, null, 1));
const md = ['# District-wide traffic: evidence (GDD Edit 53)', '', `Generated by \`node tools/continuity_report.js\`. Five game districts × three baked layouts. ${SECS} s each, the dummy away; puddle skids off (they are a hazard by design).`, '',
  '| District | Layout | Start-screen ground cars | Cars running at start | Seam crossings | Worst jump beyond v·dt | Seam overlaps | Exits inside | Admitted = exited + on road | Queued on the screen before | Queue overlaps | ms per tick, checks included |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.district} | ${r.layout} | ${r.startCars} | ${r.prefill} | ${r.crossings} | ${r.maxJump} | ${r.seamOverlaps} | ${r.exitsInside} | ${r.conserved ? 'yes' : 'NO'} (${r.admitted} = ${r.exited} + ${r.live}) | ${r.queued} | ${r.queueOverlaps} | ${r.msPerTick} |`), '',
  '## One car across an edge (Interchange 1)', '', '| t | Screen | Car | Model | Lane | s | Speed | District x | District y |', '|---|---|---|---|---|---|---|---|---|',
  ...around.map((r) => `| ${r.t} | ${r.screen} | ${r.id} | ${r.model} | ${r.lane} | ${r.s} | ${r.v} | ${r.gx} | ${r.gy} |`), '',
  '- *s* jumps at the edge: the next screen\'s lane is measured from its own lead-in. Position and speed run on.', ''];
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'continuity_report.md'), md.join('\n'));
console.log('\n' + md.slice(4, 4 + rows.length + 2).join('\n'));
