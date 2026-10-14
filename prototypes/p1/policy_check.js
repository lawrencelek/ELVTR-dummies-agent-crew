// Scripted policies on L1 Straight: does reading the car beat standing and blind lunging? (automated, not human evidence)
const { Sim, DEG } = require('./sim.js');
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
function run(policy, secs = 300) {
  const s = new Sim('straight');
  for (let i = 0; i < secs * 60; i++) {
    if (s.phase === 'report') s.continueReport();
    if (s.phase === 'shop') { s.leaveShop(); }
    if (s.phase === 'ending' || s.phase === 'next') break;
    s.step(policy(s, i));
  }
  const imp = s.events.filter((e) => e.type === 'impact');
  return { writeOffs: s.run.writeOffs, impacts: imp.length, bait: imp.filter((e) => e.bait).length,
    firstHit: s.milestones.firstHit ? s.milestones.firstHit.t : null, ending: s.phase === 'next' ? 'road cleared' : s.run.ending && s.run.ending.kind, t: +s.t.toFixed(1) };
}
const home = (s) => ({ x: 400, y: 372 });
function goTo(s, tx, ty) { const b = s.body, dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy); return d > 6 ? { mx: dx / d, my: dy / d } : {}; }
const policies = {
  'stand in lane': (s) => goTo(s, 400, 328),
  'blind lunge every 1 s': (s, i) => Object.assign(goTo(s, 400, 372), { aPress: i % 60 === 0 && Math.abs(s.body.x - 400) < 8 }),
  'read & lunge': (s) => {
    const b = s.body; if (!b.alive) return {};
    let best = null;
    for (const c of s.cars) {
      if (c.spent) continue;
      const tx = c.x + c.vx * 0.12, ty = c.y + c.vy * 0.12, d = Math.hypot(tx - b.x, ty - b.y);
      if (d < 150 && (!best || d < best.d)) best = { c, tx, ty, d };
    }
    if (!best) return goTo(s, 400, 372);
    const ang = Math.atan2(best.ty - b.y, best.tx - b.x), off = Math.abs(wrap(ang - b.facing));
    return { mx: Math.cos(ang) * 0.35, my: Math.sin(ang) * 0.35, aPress: off < 12 * DEG && b.mode !== 'lunge' && b.mode !== 'recover' };
  },
};
for (const [name, pol] of Object.entries(policies)) console.log(name.padEnd(24), JSON.stringify(run(pol)));
