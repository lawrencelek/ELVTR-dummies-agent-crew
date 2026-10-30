// P5.1 points evidence (GDD Edit 50.1): two play styles on every layout's start screen, before and after damage.walkShare.
// Walker: walks or runs into the nearest car, never dashes. Dasher: the bake's bot (closes in, dashes when facing).
// node tools/points_report.js [seconds] → docs/points_report.json and .md. Automated evidence, not human playtest.
const fs = require('fs'), path = require('path');
const sim = require(path.join(__dirname, '..', 'sim.js'));
const SECS = +process.argv[2] || 150;
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
function play(id, k, policy, overrides) {
  const s = new sim.Sim(id, Object.assign({ 'proto.layout': k }, overrides)), D = s.district;
  D.cur = D.start.slice(); s.level = sim.cellLevel(D, D.start, s.P); s.reset();
  s.checkFlip = () => {}; s.enterStair = () => false;
  const W = s.P['world.width'], H = s.P['world.height'], L = s.level.lanes[0];
  const homeOf = () => { const b = s.body; let best = null; for (let q = 0; q <= L.length; q += 16) { const p = sim.pathAt(L, q); for (const sd of [-1, 1]) { const x = p.x + p.nx * sd * 90, y = p.y + p.ny * sd * 90; if (x < 30 || y < 60 || x > W - 30 || y > H - 30 || s.level.statics.some((st) => x > st.x - 15 && x < st.x + st.w + 15 && y > st.y - 15 && y < st.y + st.h + 15)) continue; const d = Math.hypot(x - b.x, y - b.y); if (!best || d < best.d) best = { x, y, d }; } } return best || { x: b.x, y: b.y }; };
  let home = homeOf(), first = null; const hits = [];
  for (let i = 0; i < SECS * 60; i++) {
    if (s.phase === 'report') s.continueReport();
    if (s.phase === 'shop') { s.leaveShop(); home = homeOf(); }
    if (s.phase === 'ending' || s.phase === 'next') break;
    const b = s.body; let cmd = {};
    if (b.alive) {
      let best = null;
      for (const c of s.cars) { if (c.spent) continue; const tx = c.x + c.vx * 0.12, ty = c.y + c.vy * 0.12, d = Math.hypot(tx - b.x, ty - b.y); if (d < 150 && (!best || d < best.d)) best = { tx, ty, d }; }
      if (!best) { const dx = home.x - b.x, dy = home.y - b.y, d = Math.hypot(dx, dy); cmd = d > 6 ? { mx: dx / d, my: dy / d } : {}; }
      else {
        const ang = Math.atan2(best.ty - b.y, best.tx - b.x), off = Math.abs(wrap(ang - b.facing));
        cmd = policy === 'walker' ? { mx: Math.cos(ang), my: Math.sin(ang) } : { mx: Math.cos(ang) * 0.35, my: Math.sin(ang) * 0.35, aPress: off < 12 * Math.PI / 180 && b.mode !== 'lunge' && b.mode !== 'recover' };
      }
    }
    s.step(cmd);
    for (const e of s.events) if (e.type === 'impact' && e.assessed > 0) hits.push({ v: e.assessed, dash: !!e.lunging });
    s.events = [];
    if (first == null && s.run.writeOffs > 0) first = +s.t.toFixed(1);
  }
  return { id, k, policy, writeOffs: s.run.writeOffs, first, hits: hits.length, meanHit: hits.length ? +(hits.reduce((a, h) => a + h.v, 0) / hits.length).toFixed(0) : 0, maxHit: hits.length ? +Math.max(...hits.map((h) => h.v)).toFixed(0) : 0, dashHits: hits.filter((h) => h.dash).length };
}
const rows = [];
for (const [label, over] of [['P5.0 (walkShare 1)', { 'damage.walkShare': 1 }], ['P5.1 (walkShare 0.25)', {}]]) for (const policy of ['walker', 'dasher'])
  for (const id of sim.DISTRICT_LIST) for (const k of [1, 2, 3]) rows.push(Object.assign({ label }, play(id, k, policy, over)));
const sum = (sel) => { const r = rows.filter(sel), h = r.reduce((a, x) => a + x.hits, 0); return { layouts: r.length, writeOffs: r.reduce((a, x) => a + x.writeOffs, 0), withWO: r.filter((x) => x.writeOffs).length, meanHit: h ? +(r.reduce((a, x) => a + x.meanHit * x.hits, 0) / h).toFixed(0) : 0, hits: h, firstMedian: (() => { const f = r.map((x) => x.first).filter((x) => x != null).sort((a, b) => a - b); return f.length ? f[Math.floor(f.length / 2)] : null; })() }; };
const table = [];
for (const label of ['P5.0 (walkShare 1)', 'P5.1 (walkShare 0.25)']) for (const policy of ['walker', 'dasher']) table.push(Object.assign({ label, policy }, sum((x) => x.label === label && x.policy === policy)));
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'points_report.json'), JSON.stringify({ seconds: SECS, table, rows }, null, 1));
const md = ['# Points report (P5.1, Edit 50.1)', '', `Each run: one layout's start screen, ${SECS} s, Standard health. Walker: walks or runs into the nearest car, never dashes. Dasher: closes in at a third of run speed and dashes when facing the car (the bake's bot).`, '',
  '| Points model | Style | Layouts with a write-off | Write-offs | Hits | Mean points per hit | Median first write-off (s) |', '|---|---|---:|---:|---:|---:|---:|'];
for (const t of table) md.push(`| ${t.label} | ${t.policy} | ${t.withWO} of ${t.layouts} | ${t.writeOffs} | ${t.hits} | ${t.meanHit} | ${t.firstMedian ?? '—'} |`);
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'points_report.md'), md.join('\n') + '\n');
for (const t of table) console.log(JSON.stringify(t));
