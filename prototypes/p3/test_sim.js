// Headless checks for sim.js. Expected values are computed independently from the GDD worked examples.
const assert = require('assert');
const D = require('./sim.js');
const { Sim, assess, REG } = D;
let pass = 0, fail = 0;
const near = (a, b, tol = 1e-3) => Math.abs(a - b) <= tol;
function check(name, fn) {
  try { fn(); pass++; console.log('PASS', name); }
  catch (e) { fail++; console.log('FAIL', name, '-', e.message); }
}
const empty = (lvl = 'straight', o = {}) => { const s = new Sim(lvl, Object.assign({ 'run.appearances.road': 0, 'proto.health.standard': 800 }, o)); s.checkTerminal = () => {}; return s; };
const idle = (s, n, cmd = {}) => { for (let i = 0; i < n; i++) s.step(cmd); };

check('impact: stationary dummy vs Sedan at 138, front = 100', () => {
  assert(near(assess(REG, 138, 'front', 'sedan').assessed, 100));
});
check('impact: dummy at 69 into stationary Sedan = 50', () => {
  assert(near(assess(REG, 69, 'front', 'sedan').assessed, 50));
});
check('impact: early lunge 1148 vs Sedan 138 raw 931.884, capped 800', () => {
  const r = assess(REG, 1148 + 138, 'front', 'sedan');
  assert(near(r.raw, 931.884, 1e-3)); assert(near(r.assessed, 800));
});
check('impact: late lunge 246 vs Sedan 138 = 278.261', () => {
  assert(near(assess(REG, 246 + 138, 'front', 'sedan').assessed, 278.261, 1e-3));
});
check('impact: Van mass 1.5, side zone 0.3', () => {
  assert(near(assess(REG, 138, 'side', 'van').assessed, 45));
});

for (const [hp, want] of [[800, 164], [400, 82], [100, 73.8]]) {
  check(`lunge reach (part effects off: total wear) at health ${hp} = ${want}`, () => {
    const s = empty(); s.P['proto.parts.effects'] = 0; s.body.health = hp; s.body.facing = 0;
    const x0 = s.body.x; s.body.y = 300; s.body.x = 300;
    s.step({ aPress: true }); idle(s, 17);
    assert(near(s.body.x - 300, want, 0.05), 'got ' + (s.body.x - 300));
    assert.strictEqual(s.body.mode, 'recover');
  });
}
check('lunge speeds: 1148 early, 246 late', () => {
  const s = empty(); s.body.facing = 0; s.body.x = 200; s.body.y = 300;
  s.step({ aPress: true });
  assert(near(s.body.vx, 1148, 0.01), 'early ' + s.body.vx);
  idle(s, 8);
  assert(near(s.body.vx, 246, 0.01), 'late ' + s.body.vx);
});
check('battery: two lunges then denied; one refill after delay + period', () => {
  const s = empty(); s.body.facing = 0; s.body.x = 100; s.body.y = 300;
  for (let i = 0; i < 2; i++) { s.step({ aPress: true }); idle(s, 40); s.body.x = 100; }
  // 2 lunges spent with partial refills; force empty to test the rule cleanly
  s.body.charge = 0.5; s.body.refillDelay = 0;
  s.step({ aPress: true });
  assert(s.events.some((e) => e.type === 'denied' && e.action === 'lunge'));
  s.body.charge = 0; s.body.refillDelay = 0.3;
  idle(s, Math.round((0.3 + 0.8) * 60));
  assert(near(s.body.charge, 1, 0.02), 'charge ' + s.body.charge);
});
check('throw: standing displacement 120; walking 81 → 136.2', () => {
  for (const [v, want] of [[0, 120], [81, 136.2]]) {
    const s = empty(); s.run.owned = { carry: true, throw: true };
    const cn = s.cones[0]; cn.state = 'held'; s.body.held = cn;
    s.body.x = 300; s.body.y = 300; s.body.facing = 0; s.body.vx = v; s.body.vy = 0; // on the road: no city block in the throw line
    const p = s.releasePoint(); s.throwHeld();
    s.body.vx = 0; s.body.alive = false; // isolate the cone flight
    idle(s, 20);
    assert.strictEqual(cn.state, 'free');
    assert(near(cn.x - p.x, want, 0.05), `v=${v} got ${cn.x - p.x}`);
  }
});
check('throw gesture: hold to threshold drops close instead', () => {
  const s = empty(); s.run.owned = { carry: true, throw: true };
  const cn = s.cones[0]; cn.state = 'held'; s.body.held = cn; s.body.x = 300; s.body.y = 300; s.body.facing = 0; // on the road: no city block in the throw line
  s.step({ bPress: true }); idle(s, 16, { bHeld: true });
  assert.strictEqual(cn.state, 'free'); const want = s.P['body.radius'] + s.P['props.cone.radius'] + s.P['props.cone.placementClearance']; assert(near(cn.x - 300, want, 0.01), 'drop at ' + (cn.x - 300));
});
check('shop: prices, prerequisites, banking', () => {
  const s = empty(); s.phase = 'shop'; s.run.credits = 1;
  assert.strictEqual(s.buy('spine').ok, false);
  assert.strictEqual(s.buy('hips').ok, true);
  assert.strictEqual(s.run.credits, 0);
  assert.strictEqual(s.buy('carry').ok, false);
  s.run.credits = 2; assert.strictEqual(s.buy('spine').ok, true);
  assert.strictEqual(s.buy('hips').ok, false);
});
check('car on road: detects dummy, commits, and dummy survives standing', () => {
  const s = new Sim('straight', { 'run.appearances.road': 1 });
  s.body.x = 400; s.body.y = 328; s.body.facing = Math.PI;
  let committed = false;
  for (let i = 0; i < 60 * 12; i++) { s.step({}); if (s.cars[0] && s.cars[0].state === 'committed') committed = true; }
  assert(committed, 'car never committed');
  assert(s.body.alive, 'body died standing still');
});
check('stationary-car tactic: lunging into a braked car no longer one-shots (P1.3)', () => {
  const s = new Sim('straight', { 'run.appearances.road': 1, 'proto.health.standard': 800 });
  s.corridorBlocked = () => true;
  s.body.x = 520; s.body.y = 328; s.body.facing = Math.PI;
  let stopped = false;
  for (let i = 0; i < 60 * 8 && !stopped; i++) { s.step({}); const c = s.cars[0]; if (c && c.v < 1 && c.x < 520) stopped = true; }
  assert(stopped, 'car never stopped');
  const c = s.cars[0]; s.body.x = c.x + c.L / 2 + 13 + 100; s.body.y = c.y; s.body.facing = Math.PI;
  s.step({ aPress: true }); idle(s, 30);
  const hit = s.events.find((e) => e.type === 'impact');
  assert(hit, 'no impact'); assert(hit.assessed > 40 && hit.assessed < 60, 'assessed ' + hit.assessed);
  assert(s.events.some((e) => e.type === 'knock'), 'no recoil');
});
check('impulse model: hand-computed cases (m_d 0.056, e 0.3, cap 100, p 2)', () => {
  const P = Object.assign({}, D.REG, D.PROTO, D.OVERRIDES, { 'damage.bodyHealth': 800 }), I = D.impulseImpact;
  assert(near(I(P, 0, 0, -138, 0, 1, 0, 'sedan').assessed, 100, 1e-6), 'standing vs sedan 138');
  assert(near(I(P, 1148, 0, 0, 0, 1, 0, 'sedan').assessed, 52.510, 1e-3), 'lunge into parked sedan');
  assert(near(I(P, 1148, 0, -138, 0, 1, 0, 'sedan').assessed, 297.43, 1e-2), 'head-on lunge');
  const a = 60 * Math.PI / 180;
  assert(near(I(P, 0, 0, -138 * Math.cos(a), -138 * Math.sin(a), 1, 0, 'sedan').assessed, 25, 1e-6), 'glancing 60 deg');
  assert(near(I(P, 0, 0, -120, 0, 1, 0, 'van').assessed, 78.36, 1e-2), 'van 120');
  assert.strictEqual(I(P, 0, 0, 138, 0, 1, 0, 'sedan').assessed, 0, 'separating car');
});
check('difficulty: constant health across roads; Standard 800 default, Fragile 600, Reinforced 1000 (Edit 40.1)', () => {
  for (const lvl of D.ROADS) { const s = new Sim(lvl); assert.strictEqual(s.body.health, 800); assert(near(s.reach(), 164)); }
  assert.strictEqual(new Sim('corner', { 'proto.difficulty': 0 }).body.health, 600);
  assert.strictEqual(new Sim('straight', { 'proto.difficulty': 2 }).body.health, 1000);
});
check('car swerve around a cone: no heading snap, path fixed in space', () => {
  const s = new Sim('straight', { 'run.appearances.road': 1 });
  s.body.x = 400; s.body.y = 560; s.cones[0].x = 600; s.cones[0].y = 328;
  let prev = null, maxStep = 0, shifted = false;
  for (let i = 0; i < 60 * 9; i++) {
    s.step({}); const c = s.cars[0]; if (!c) continue;
    if (prev != null) maxStep = Math.max(maxStep, Math.abs(c.h - prev) * 180 / Math.PI);
    prev = c.h; if (Math.abs(c.d) > 20) shifted = true;
  }
  assert(shifted, 'car never swerved'); assert(maxStep < 6, 'heading step ' + maxStep.toFixed(1) + ' deg/tick');
});
check('blocked by a cone: car honks after 5 s, drone clears the cone, traffic resumes', () => {
  const s = new Sim('straight', { 'run.appearances.road': 2, 'run.admissionInterval': 0.5 });
  s.body.x = 400; s.body.y = 560;
  // block both lanes so no swerve is possible
  s.cones[0].x = 420; s.cones[0].y = 328; s.cones[1].x = 420; s.cones[1].y = 272; s.cones[1].x = 430;
  s.cones[2].x = 440; s.cones[2].y = 356; s.cones[3].x = 440; s.cones[3].y = 300;
  let honk = null, drop = null;
  for (let i = 0; i < 60 * 40; i++) {
    s.step({});
    if (!honk) honk = s.events.find((e) => e.type === 'honk');
    if (!drop) drop = s.events.find((e) => e.type === 'drone-drop');
  }
  assert(honk, 'never honked'); assert(drop, 'drone never dropped a cone');
  assert(s.run.exited >= 1, 'traffic never cleared');
  const blockStart = s.events.find((e) => e.type === 'interrupt' || e.type === 'commit');
  assert(honk.t >= 5, 'honked early at ' + honk.t);
});
check('initial cones sit off the road', () => {
  for (const lvl of D.ROADS) {
    const s = new Sim(lvl), half = s.P['world.laneWidth'] + s.P['proto.shoulderWidth'];
    for (const cn of s.cones) { const pr = D.pathProject(s.level.lanes[0], cn.x, cn.y); assert(Math.abs(pr.lat + s.P['world.laneWidth'] / 2) > half, lvl + ' ' + cn.id); }
  }
});
check('campaign: L1 needs 1 write-off, clears to shop, carries credit and nodes to L2 (quota 2)', () => {
  const s = new Sim('straight', { 'run.appearances.road': 0 });
  s.body.health = 1; s.writeOff(); s.checkTerminal();
  assert(s.report && s.report.roadCleared && s.report.nextRoad === 'barrier', 'road not cleared');
  idle(s, 80); assert.strictEqual(s.phase, 'report'); s.continueReport(); s.buy('hips'); s.leaveShop();
  assert.strictEqual(s.phase, 'next');
  const s2 = new Sim('barrier', {}, s.carryOut());
  assert.strictEqual(s2.quota, 2); assert(s2.has('hips')); assert.strictEqual(s2.run.credits, 0); assert.strictEqual(s2.totalWriteOffs(), 1);
  const s3 = new Sim('corner', {}, { writeOffs: 3 }); assert(s3.isFinal); assert.strictEqual(s3.quota, 3);
});
check('swerve routes avoid road-edge pillars', () => {
  const s = new Sim('straight', { 'run.appearances.road': 0 });
  const c = { s: 400, d: 0, L: 56, W: 28, v: 138, x: 0, y: 0, h: 0, path: s.level.lanes[0] }; c.x = 400 - 200; c.y = 328;
  const plan = s.choose(Object.assign(c, { s: 300 }), { ly: 0, lx: 120, r: 13, s: 480, id: 'body' });
  if (plan.type === 'shift') {
    for (let ds = 0; ds <= 180; ds += 6) {
      const d = plan.d0 + (plan.d1 - plan.d0) * ((1 - Math.cos(Math.PI * Math.min(1, ds / plan.len))) / 2), q = D.pathAt(c.path, 300 + ds);
      for (const st of s.level.statics) assert(!(q.x + q.nx * d > st.x - 14 && q.x + q.nx * d < st.x + st.w + 14 && q.y + q.ny * d > st.y - 14 && q.y + q.ny * d < st.y + st.h + 14), 'route hits ' + st.id);
    }
  }
});
check('standoff: a car stops about 4 m (50 u) short of a dummy in its lane, then honks', () => {
  const s = new Sim('straight', { 'run.appearances.road': 1 });
  s.body.x = 600; s.body.y = 328; s.body.facing = Math.PI;
  let minGap = Infinity;
  for (let i = 0; i < 60 * 12; i++) {
    s.step({}); const c = s.cars[0]; if (!c) continue;
    minGap = Math.min(minGap, s.body.x - (c.x + c.L / 2));
  }
  const so = s.P['proto.standoffDistance'];
  assert(Math.abs(minGap - so) < 6, 'stop gap ' + minGap.toFixed(1) + ' vs standoff ' + so);
  assert(!s.events.some((e) => e.type === 'impact'), 'impact while standing');
  assert(s.events.some((e) => e.type === 'honk' && e.at === 'body'), 'never honked at the dummy');
});
check('learned standoff: a hit on a stopped car pushes that model\'s stop line back for the next car', () => {
  const s = new Sim('straight', { 'run.appearances.road': 2, 'proto.health.standard': 800 });
  s.checkTerminal = () => {};
  s.schedule = [{ i: 0, cls: 'sedan', lane: 0, mult: 1 }, { i: 1, cls: 'sedan', lane: 0, mult: 5 }];
  s.body.x = 600; s.body.y = 328; s.body.facing = Math.PI;
  let hit = null;
  for (let i = 0; i < 60 * 10 && !hit; i++) {
    const c = s.cars[0];
    const press = !!(c && c.v < 1 && s.body.mode === 'idle');
    s.step({ aPress: press });
    hit = s.events.find((e) => e.type === 'impact');
  }
  assert(hit && hit.stopped, 'no hit on a stopped car');
  const step = s.P['proto.learn.standoffStep'], base = s.P['proto.standoffDistance'];
  assert.strictEqual(s.models.sedan.standoffApplied, 1);
  assert(s.events.some((e) => e.type === 'learn-standoff' && e.to === base + step));
  assert(near(s.modelStandoff(s.models.sedan), base + step));
  const hitT = s.t; let next = null;
  for (let i = 0; i < 60 * 10 && !next; i++) { s.step({}); next = s.cars.find((c) => c.slot === 1); }
  const adm = s.events.find((e) => e.type === 'admit' && e.car === (next && next.id));
  assert(adm && adm.t > hitT, 'second car admitted before the hit');
  assert(next && near(next.standoff, base + step), 'next car standoff ' + (next && next.standoff));
  assert.strictEqual(s.models.van.standoffApplied, 0, 'van model unaffected');
  const s2 = new Sim('barrier', {}, s.carryOut());
  assert(near(s2.modelStandoff(s2.models.sedan), base + step), 'fleet memory lost between roads');
});
check('unstick: a car stuck head-on in the wrong lane backs up and returns; both cars leave', () => {
  const s = new Sim('straight', { 'run.appearances.road': 2 });
  s.checkTerminal = () => {};
  s.schedule = [{ i: 0, cls: 'van', lane: 0, mult: 0 }, { i: 1, cls: 'sedan', lane: 1, mult: 1 }];
  s.body.x = 400; s.body.y = 560;
  s.nextAt = 0; s.admit(); s.nextAt = 0; s.admit();
  const [van, sed] = s.cars;
  van.s = 380; van.d = -s.P['world.laneWidth']; van.v = 0;
  van.man = { type: 'shift', d0: 0, d1: van.d, len: 120, s0: 260, v0: 0, t0: 0, tv: 0, until: Infinity, halt: true };
  van.state = 'interrupted'; van.interruptT = 0; van.clearT = 0; s.pose(van);
  const gx = van.x + Math.cos(van.h) * (10 + (van.L + sed.L) / 2), gy = van.y + Math.sin(van.h) * (10 + (van.L + sed.L) / 2);
  sed.s = D.pathProject(sed.path, gx, gy).s; sed.v = 0; s.pose(sed);
  for (let i = 0; i < 60 * 25; i++) s.step({});
  assert(s.events.some((e) => e.type === 'unstick' && e.car === van.id && e.how === 'reverse'), 'van never reversed');
  assert(s.events.filter((e) => e.type === 'exit').length === 2, 'cars still on the road');
});
check('unstick: a stopped car with nothing left to wait for forgets its plan and drives on', () => {
  const s = new Sim('straight', { 'run.appearances.road': 1 });
  s.checkTerminal = () => {};
  s.body.x = 400; s.body.y = 560;
  s.step({}); const c = s.cars[0];
  c.s = 300; c.v = 0; s.pose(c);
  // A stale plan: a halted swerve whose interruption was already cleared. Nothing ahead, yet it never ends.
  c.man = { type: 'shift', d0: 0, d1: -20, len: 120, s0: c.s, v0: 0, t0: s.t, tv: s.t, until: Infinity, halt: true };
  c.state = 'committed';
  for (let i = 0; i < 60 * 12; i++) s.step({});
  assert(s.events.some((e) => e.type === 'unstick' && e.how === 'replan'), 'never unstuck');
  assert(s.events.some((e) => e.type === 'exit'), 'car never left');
});
check('Highway Code driver: waits, then passes a static dummy slowly with 2 m clearance, no contact', () => {
  const s = new Sim('straight', { 'run.appearances.road': 1 });
  s.body.x = 600; s.body.y = 328; s.body.facing = Math.PI;
  let passV = 0, minClear = Infinity;
  for (let i = 0; i < 60 * 25; i++) {
    s.step({}); const c = s.cars[0]; if (!c) continue;
    if (c.man && c.cause === 'pass') {
      passV = Math.max(passV, c.v);
      const ca = Math.cos(c.h), sa = Math.sin(c.h), dx = s.body.x - c.x, dy = s.body.y - c.y, ly = Math.abs(-dx * sa + dy * ca), lx = Math.abs(dx * ca + dy * sa);
      if (lx < c.L / 2 + 13) minClear = Math.min(minClear, ly - c.W / 2 - 13);
    }
  }
  const pass = s.events.find((e) => e.type === 'commit' && e.cause === 'pass');
  assert(pass && pass.t >= 8, 'no patient pass');
  assert(passV <= s.P['proto.driver.passSpeed'] + 1e-6, 'pass too fast ' + passV);
  assert(minClear >= s.P['proto.driver.passClearance'] - 1, 'clearance ' + minClear.toFixed(1));
  assert(!s.events.some((e) => e.type === 'impact'), 'contact while passing');
});
check('Highway Code driver: slows to caution speed passing a visible dummy at the kerb', () => {
  const s = new Sim('straight', { 'run.appearances.road': 1 });
  s.body.x = 560; s.body.y = 372; s.body.facing = -Math.PI / 2;
  let vAt = null;
  for (let i = 0; i < 60 * 10; i++) { s.step({}); const c = s.cars[0]; if (c && vAt == null && c.x > 540) vAt = c.v; }
  assert(vAt != null && vAt <= s.P['proto.driver.cautionSpeed'] + 1, 'speed level with dummy ' + vAt);
});
check('Highway Code driver: a dummy hidden behind a pillar gets no caution', () => {
  const s = new Sim('straight', { 'run.appearances.road': 1 });
  s.body.x = 318; s.body.y = 372; // downstream of pillar s3 (276..304, 358..386): hidden from an eastbound car until it is close
  let maxCaution = false;
  for (let i = 0; i < 60 * 3; i++) { s.step({}); const c = s.cars[0]; if (c && c.x < 200 && c.state === 'caution') maxCaution = true; }
  assert(!maxCaution, 'car slowed for a hidden dummy');
});
check('straight sensor: on the corner the beam misses a dummy past the bend until the car turns', () => {
  const run = (straight, x, y) => {
    const s = new Sim('corner', { 'run.appearances.road': 1, 'proto.sensorStraight': straight, 'proto.health.standard': 5000 });
    s.checkTerminal = () => {}; s.schedule = [{ i: 0, cls: 'sedan', lane: 0, mult: 1 }];
    s.body.x = x; s.body.y = y; s.body.facing = Math.PI;
    let first = null, near = null;
    for (let i = 0; i < 60 * 12; i++) { s.step({}); const c = s.cars[0]; if (c && c.hz) { if (near == null) near = c.hz.lx; if (c.hz.inPath && first == null) first = c.hz.lx; } }
    return { first, near };
  };
  const bent = run(0, 578, 300), beam = run(1, 578, 300);
  assert(bent.first > 500, 'path sensor saw it at ' + bent.first);
  assert(beam.first != null && beam.first < 100, 'straight beam saw it at ' + beam.first);
  assert(beam.near > 500, 'driver should still notice the dummy near the road: ' + beam.near);
  const verge = run(1, 640, 470);
  assert(verge.first == null, 'dummy on the verge ahead treated as in path');
});
check('determinism: same inputs → same trace', () => {
  const run = () => { const s = new Sim('barrier'); for (let i = 0; i < 3600; i++) s.step({ mx: Math.sin(i / 50), my: Math.cos(i / 70), aPress: i % 97 === 0 }); return JSON.stringify(s.events); };
  assert.strictEqual(run(), run());
});
for (const lvl of D.ROADS) {
  check(`smoke ${lvl}: 10 min scripted play, no NaN, cars admit and exit`, () => {
    let s = new Sim(lvl), admitted = 0, exited = 0;
    for (let i = 0; i < 60 * 600; i++) {
      const cmd = { mx: Math.sin(i / 37) , my: Math.cos(i / 53), aPress: i % 41 === 0, bPress: i % 113 === 0, bRelease: i % 113 === 3 };
      s.step(cmd);
      if (s.phase === 'report') s.continueReport();
      if (s.phase === 'shop') { for (const n of ['hips', 'carry', 'spine', 'throw']) s.buy(n); s.leaveShop(); }
      if (s.phase === 'ending' || s.phase === 'next') {
        admitted += s.run.admitted; exited += s.run.exited;
        if (exited > 0) break;
        s = new Sim(lvl); // road cleared before any car crossed: replay it until traffic has flowed
        continue;
      }
      for (const c of s.cars) assert(Number.isFinite(c.x + c.y + c.v), 'NaN car');
      assert(Number.isFinite(s.body.x + s.body.y), 'NaN body');
    }
    if (s.phase !== 'ending' && s.phase !== 'next') { admitted += s.run.admitted; exited += s.run.exited; }
    assert(admitted > 0 && exited > 0, `admitted ${admitted} exited ${exited}`);
    console.log(`   ${lvl}: t=${s.t.toFixed(1)} writeOffs=${s.run.writeOffs} hits=${s.events.filter((e) => e.type === 'impact').length} ending=${s.run.ending && s.run.ending.kind}`);
  });
}
// ---------- P3 city (proto.city): blocks and jersey barriers are solid statics
const CITY = (st) => st.kind === 'block' || st.kind === 'jersey';
check('city: every road gains solid blocks and jersey barriers; proto.city 0 removes them', () => {
  for (const lvl of D.ROADS) {
    const s = new Sim(lvl), s0 = new Sim(lvl, { 'proto.city': 0 });
    assert(s.level.statics.some((st) => st.kind === 'block') && s.level.statics.some((st) => st.kind === 'jersey'), lvl);
    assert(!s0.level.statics.some(CITY), lvl + ' with proto.city 0');
  }
});
check('city: the dummy cannot walk into a block', () => {
  const s = empty('straight'), bk = s.level.statics.find((st) => st.kind === 'block' && st.y > 360 && st.y - 60 > 0);
  assert(bk, 'a block south of the road');
  s.body.x = bk.x + bk.w / 2; s.body.y = bk.y - 40; s.body.facing = Math.PI / 2;
  idle(s, 240, { mx: 0, my: 1 });
  assert(s.body.y + s.P['body.radius'] <= bk.y + 0.5, 'body bottom ' + (s.body.y + 13).toFixed(2) + ' block top ' + bk.y);
});
check('city: the dummy cannot walk through a jersey barrier', () => {
  const s = empty('straight'), jb = s.level.statics.find((st) => st.kind === 'jersey' && st.y > 300);
  s.body.x = jb.x + jb.w / 2; s.body.y = jb.y + jb.h + 30; s.body.facing = -Math.PI / 2;
  idle(s, 240, { mx: 0, my: -1 });
  assert(s.body.y - s.P['body.radius'] >= jb.y + jb.h - 0.5, 'body top ' + (s.body.y - 13).toFixed(2) + ' barrier bottom ' + (jb.y + jb.h));
});
check('city: a block casts a sensor shadow; open ground does not', () => {
  const s = empty('straight'), bk = s.level.statics.find((st) => st.kind === 'block');
  assert(s.occluded(null, bk.x - 20, bk.y + bk.h / 2, bk.x + bk.w + 20, bk.y + bk.h / 2), 'line through the block');
  assert(!s.occluded(null, 20, 300, 780, 300), 'line along the open road');
});
check('city: every open spot connects to a spawn, and the road is reachable', () => {
  for (const lvl of D.ROADS) {
    const s = new Sim(lvl), S = 4, W = s.P['world.width'], H = s.P['world.height'], R = s.P['body.radius'], gw = W / S, gh = H / S, free = new Uint8Array(gw * gh), seen = new Uint8Array(gw * gh);
    const rd = (x, y, r) => Math.hypot(Math.max(r.x - x, 0, x - (r.x + r.w)), Math.max(r.y - y, 0, y - (r.y + r.h)));
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const x = i * S + 2, y = j * S + 2; free[j * gw + i] = x > R && x < W - R && y > R && y < H - R && s.level.statics.every((st) => rd(x, y, st) > R + 0.5) ? 1 : 0; }
    const q = [];
    for (const sp of s.level.spawns) { const k = Math.floor(sp.y / S) * gw + Math.floor(sp.x / S); assert(free[k], lvl + ' spawn blocked'); seen[k] = 1; q.push(k); }
    while (q.length) { const k = q.pop(), i = k % gw, j = (k - i) / gw; for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= gw || jj >= gh) continue; const kk = jj * gw + ii; if (free[kk] && !seen[kk]) { seen[kk] = 1; q.push(kk); } } }
    let lost = 0; for (let k = 0; k < free.length; k++) if (free[k] && !seen[k]) lost++;
    assert.strictEqual(lost, 0, lvl + ' enclosed cells');
    const road = s.level.lanes[0], mid = D.pathAt(road, road.length / 2), k = Math.floor(mid.y / S) * gw + Math.floor(mid.x / S);
    assert(seen[k], lvl + ' road unreachable');
  }
});
for (const lvl of D.ROADS) {
  check(`city ${lvl}: no car ever overlaps a block or jersey barrier (10 min)`, () => {
    let s = new Sim(lvl), worst = null;
    const city = () => s.level.statics.filter(CITY);
    for (let i = 0; i < 60 * 600; i++) {
      s.step({ mx: Math.sin(i / 37), my: Math.cos(i / 53), aPress: i % 41 === 0 });
      if (s.phase === 'report') s.continueReport();
      if (s.phase === 'shop') s.leaveShop();
      if (s.phase === 'ending' || s.phase === 'next') s = new Sim(lvl);
      for (const c of s.cars) {
        const ca = Math.cos(c.h), sa = Math.sin(c.h);
        for (const [u, v] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [0, 1], [1, 0], [-1, 0]]) {
          const x = c.x + (u * c.L / 2) * ca - (v * c.W / 2) * sa, y = c.y + (u * c.L / 2) * sa + (v * c.W / 2) * ca;
          for (const st of city()) if (x > st.x && x < st.x + st.w && y > st.y && y < st.y + st.h) worst = worst || `${c.id} at ${x.toFixed(1)},${y.toFixed(1)} in ${st.kind} ${st.x},${st.y}`;
        }
      }
    }
    assert(!worst, worst);
  });
}
check('parts: every impact names a body part; parts sum to health lost', () => {
  let s = new Sim('straight'), n = 0;
  for (let i = 0; i < 60 * 300 && n < 5; i++) {
    s.step({ mx: Math.sin(i / 37), my: Math.cos(i / 53), aPress: i % 41 === 0 });
    if (s.phase === 'report') { const b = s.body; s.continueReport(); }
    if (s.phase === 'shop') s.leaveShop();
    if (s.phase === 'ending' || s.phase === 'next') s = new Sim('straight');
    n = s.events.filter((e) => e.type === 'impact').length;
  }
  const imp = s.events.filter((e) => e.type === 'impact');
  assert(imp.length > 0, 'no impacts');
  for (const e of imp) assert(['head', 'torso', 'armL', 'armR', 'legL', 'legR'].includes(e.part), 'part ' + e.part);
  const b = s.body, sum = Object.values(b.parts).reduce((x, y) => x + y, 0);
  if (b.alive) assert(near(sum, s.P['damage.bodyHealth'] - b.health, 1e-6), 'sum ' + sum + ' lost ' + (s.P['damage.bodyHealth'] - b.health));
});
check('parts: height bands follow the assessed damage', () => {
  const s = empty(); s.body.x = 300; s.body.y = 300; s.body.facing = 0;
  assert.strictEqual(s.partOf(320, 300, 50), 'legR');            // ahead, small: legs (front hits pick a side)
  assert.strictEqual(s.partOf(300, 320, 150), 'armR');           // from the right, mid: right arm
  assert.strictEqual(s.partOf(300, 280, 150), 'armL');           // from the left, mid: left arm
  assert.strictEqual(s.partOf(320, 300, 150), 'torso');          // ahead, mid: torso
  assert.strictEqual(s.partOf(280, 300, 300), 'head');           // big hit: head
});
const H0 = (s) => s.P['damage.bodyHealth'];
check('part effects: legs slow every ground speed, linearly to the floor', () => {
  const run = (share) => { const s = empty(); s.body.x = 100; s.body.y = 300; s.body.facing = 0; s.body.parts.legL = share * H0(s); idle(s, 150, { mx: 1, my: 0 }); return s.body.x - 100; };
  const d0 = run(0), d1 = run(0.25), d2 = run(0.9);
  assert(near(d1 / d0, 0.75, 0.01), 'legs 0.25 → ' + (d1 / d0).toFixed(3));
  assert(near(d2 / d0, 0.5, 0.01), 'floor → ' + (d2 / d0).toFixed(3));
});
check('dash: two charges; leg damage alone shortens reach, to movement.wearFloor', () => {
  const s = empty();
  assert.strictEqual(s.P['battery.capacity'], 2); assert.strictEqual(s.body.charge, 2);
  assert(near(s.reach(), 164));
  s.body.health = H0(s) * 0.2; s.body.parts.torso = H0(s) * 0.8; assert(near(s.reach(), 164), 'torso damage leaves the dash alone');
  s.body.parts.legL = 0.2 * H0(s); assert(near(s.reach(), 164 * (1 - 1.5 * 0.2)), 'legs 0.2 → ' + s.reach().toFixed(1));
  s.body.parts.legR = 0.6 * H0(s); assert(near(s.reach(), 164 * 0.45), 'floor ' + s.reach().toFixed(1));
  s.P['proto.parts.effects'] = 0; assert(near(s.reach(), 164 * 0.45), 'toggle off: total wear, same floor');
});
check('part effects: torso cuts the turn rate; head narrows the view cone', () => {
  const s = empty(); s.body.parts.torso = 0.2 * H0(s); s.body.parts.head = 0.2 * H0(s);
  assert(near(s.partEffect('turn'), 1 - 1.5 * 0.2)); assert(near(s.coneWidth(), 90 * (1 - 1.5 * 0.2)));
  s.body.parts.head = H0(s); assert(near(s.coneWidth(), 45), 'floor 45°');
  s.P['proto.parts.effects'] = 0; assert(near(s.partEffect('turn'), 1) && near(s.coneWidth(), 90), 'toggle off');
});
check('part effects: both arms broken → cannot pick up a cone', () => {
  const s = empty(); s.run.owned = { carry: true }; const cn = s.cones[0];
  s.body.x = cn.x - (s.P['body.radius'] + s.P['props.cone.radius'] + 4); s.body.y = cn.y; s.body.facing = 0;
  s.body.parts.armL = 0.4 * H0(s); s.body.parts.armR = 0.4 * H0(s);
  s.step({ bPress: true }); assert(!s.body.held && s.events.some((e) => e.type === 'denied' && e.action === 'pickup'), 'denied with broken arms');
  s.body.parts.armR = 0; s.step({}); s.step({ bPress: true }); assert(s.body.held, 'one good arm can carry');
});
// ---------- Edit 40 (20 Oct): districts (D24), puddles (D18), Big battery (D26)
const { planDistrict, cellLevel, cellName, edgeCrossings, SIDE } = D;
const OPPS = { N: 'S', E: 'W', S: 'N', W: 'E' };
function rdist(x, y, r) { return Math.hypot(Math.max(r.x - x, 0, x - (r.x + r.w)), Math.max(r.y - y, 0, y - (r.y + r.h))); }
check('district: one road through all nine screens; its ends leave the district; crossings match on shared edges', () => {
  for (const id of D.ROADS) {
    const s = new Sim(id), Dd = s.district;
    assert(Dd, id + ': no district');
    assert.strictEqual(new Set(Dd.path.map((c) => c.join())).size, 9, id + ': road misses a screen');
    for (let i = 0; i + 1 < Dd.path.length; i++) {
      const a = Dd.path[i], b = Dd.path[i + 1], sd = b[0] > a[0] ? 'E' : b[0] < a[0] ? 'W' : b[1] > a[1] ? 'S' : 'N';
      const ca = edgeCrossings(Dd.cells[a[1]][a[0]].center, 800, 640).find((e) => e.side === sd), cb = edgeCrossings(Dd.cells[b[1]][b[0]].center, 800, 640).find((e) => e.side === OPPS[sd]);
      assert(ca && cb && Math.abs(ca.off - cb.off) <= 1, id + ': road breaks between ' + cellName(a) + ' and ' + cellName(b));
    }
    const st = Dd.cells[Dd.start[1]][Dd.start[0]];
    assert.strictEqual(st.theme, 'start'); assert.strictEqual(JSON.stringify(st.center), JSON.stringify(D.LEVELS[id].center()), id + ': start screen keeps its road');
  }
});
check('district: every generated screen meets the city contract; every gate is open on both sides and reachable', () => {
  for (const id of D.ROADS) for (const seed of [0, 1]) {
    const s = new Sim(id, { 'proto.district.seed': seed }), Dd = s.district, R = s.P['body.radius'];
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
      const lv = cellLevel(Dd, [x, y], s.P), tag = id + '/' + seed + '/' + cellName([x, y]);
      const share = lv.statics.filter((q) => q.kind === 'block').reduce((n, q) => n + q.w * q.h, 0) / (800 * 640);
      if (lv.theme !== 'start') assert(share >= 0.2 && share <= s.P['world.occludedFractionMax'], tag + ' blocks ' + share.toFixed(3));
      assert(lv.spawns.length >= 3, tag + ' spawns');
      // flood fill from the spawns on a 4-unit grid
      const S = 4, gw = 200, gh = 160, free = new Uint8Array(gw * gh), seen = new Uint8Array(gw * gh), q = [];
      for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const px = i * S + 2, py = j * S + 2; free[j * gw + i] = px > R && px < 800 - R && py > R && py < 640 - R && lv.statics.every((st) => rdist(px, py, st) > R + 0.5) ? 1 : 0; }
      for (const sp of lv.spawns) { const k = Math.floor(sp.y / S) * gw + Math.floor(sp.x / S); if (free[k]) { seen[k] = 1; q.push(k); } }
      while (q.length) { const k = q.pop(), i = k % gw, j = (k - i) / gw; for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= gw || jj >= gh) continue; const kk = jj * gw + ii; if (free[kk] && !seen[kk]) { seen[kk] = 1; q.push(kk); } } }
      for (const sd of ['N', 'E', 'S', 'W']) { const nx = x + SIDE[sd][0], ny = y + SIDE[sd][1]; if (nx >= 0 && ny >= 0 && nx < 3 && ny < 3) assert((lv.gates[sd] || []).length >= 1, tag + ' no gate ' + sd); }
      for (const sd of ['N', 'E', 'S', 'W']) for (const [a, b] of lv.gates[sd] || []) {
        const m = (a + b) / 2, px = sd === 'W' ? R + 2 : sd === 'E' ? 800 - R - 2 : m, py = sd === 'N' ? R + 2 : sd === 'S' ? 640 - R - 2 : m;
        assert(lv.statics.every((st) => rdist(px, py, st) > R), tag + ' gate ' + sd + ' blocked');
        assert(seen[Math.floor(py / S) * gw + Math.floor(px / S)], tag + ' gate ' + sd + ' unreachable');
        const nb = cellLevel(Dd, [x + SIDE[sd][0], y + SIDE[sd][1]], s.P);
        assert(JSON.stringify(nb.gates[OPPS[sd]]) === JSON.stringify(lv.gates[sd]), tag + ' gate ' + sd + ' differs across the edge');
      }
    }
  }
});
check('district: open ground crosses any edge and flips the screen; a building across the edge or the district edge holds', () => {
  const s = empty(); s.body.x = 780; s.body.y = 340; s.body.facing = 0;
  const h = s.body.health;
  for (let i = 0; i < 60 && s.screenName() === 'B1'; i++) s.step({ mx: 1, my: 0 });
  assert.strictEqual(s.screenName(), 'C1', 'flipped east on the road'); assert(s.phase === 'scroll' && s.body.x < 20 && s.body.health === h, 'body carried over');
  idle(s, 40, {}); assert.strictEqual(s.phase, 'play');
  const R = s.P['body.radius'], push = (x, y, cmd) => { const t = empty(); t.body.x = x; t.body.y = y; idle(t, 90, cmd); return t; };
  // open ground off the road: crosses too (Edit 40.1)
  const c1 = cellLevel(s.district, [2, 0], s.P), clear = (y) => c1.statics.every((st) => rdist(R + 1, y, st) > R) && cellLevel(s.district, [1, 0], s.P).statics.every((st) => rdist(800 - R - 1, y, st) > R);
  const yOpen = [440, 450, 460, 470, 120, 130, 140, 150].find((y) => clear(y) && !(y > 220 && y < 380));
  assert(yOpen != null, 'an open spot off the road'); assert.strictEqual(push(770, yOpen, { mx: 1, my: 0 }).screenName(), 'C1', 'crossed at y ' + yOpen);
  // a building flush against the far side of the edge stops it
  const yBlk = Array.from({ length: 140 }, (_, k) => 20 + k * 4).find((y) => c1.statics.some((st) => rdist(R + 1, y, st) <= R - 2) && cellLevel(s.district, [1, 0], s.P).statics.every((st) => rdist(800 - R - 1, y, st) > R + 2));
  if (yBlk != null) { const t = push(770, yBlk, { mx: 1, my: 0 }); assert.strictEqual(t.screenName(), 'B1', 'blocked at y ' + yBlk); assert(near(t.body.x, 800 - R, 0.5)); }
  // the district edge (the river, row 1) holds
  const n = push(420, 30, { mx: 0, my: -1 }); assert.strictEqual(n.screenName(), 'B1'); assert(near(n.body.y, R, 0.5), 'river edge holds');
});
check('district: marked edge stretches are exactly where an open-looking edge stops the dummy', () => {
  for (const id of D.ROADS) {
    const s = new Sim(id), Dd = s.district, R = s.P['body.radius'];
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
      Dd.cur = [x, y]; s.level = cellLevel(Dd, [x, y], s.P);
      const sp = D.edgeSpans(Dd, [x, y], s.P);
      for (const sd of ['N', 'E', 'S', 'W']) for (let v = 16; v < (sd === 'E' || sd === 'W' ? 640 : 800) - R - 2; v += 4) { // the 4-unit lattice the spans are sampled on
        const here = sd === 'E' ? [800 - R - 1, v] : sd === 'W' ? [R + 1, v] : sd === 'S' ? [v, 640 - R - 1] : [v, R + 1];
        if (!s.level.statics.every((st) => rdist(here[0], here[1], st) >= R)) continue; // this side is built up: visibly closed
        const marked = sp[sd].some(([a, z]) => v >= a && v < z);
        assert.strictEqual(marked, !s.edgeOpen(sd, v), id + ' ' + cellName([x, y]) + ' ' + sd + ' at ' + v);
      }
    }
  }
});
check('district: cones stay on their screen; a held cone travels with the dummy', () => {
  const s = empty(); s.run.owned = { carry: true };
  const first = s.cones.slice(), cn = s.cones[0];
  s.body.x = cn.x - (s.P['body.radius'] + s.P['props.cone.radius'] + 4); s.body.y = cn.y; s.body.facing = 0; s.step({ bPress: true });
  assert(s.body.held === cn);
  s.body.x = 780; s.body.y = 340; for (let i = 0; i < 60 && s.screenName() === 'B1'; i++) s.step({ mx: 1, my: 0 });
  assert.strictEqual(s.screenName(), 'C1'); assert(s.cones.includes(cn) && !first.slice(1).some((c) => s.cones.includes(c)), 'new screen: its cones plus the held one');
});
check('puddles: world.puddleShare of tiles on every screen, never under a static, spawn or cone', () => {
  for (const id of D.ROADS) {
    const s = new Sim(id), Dd = s.district;
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
      const lv = cellLevel(Dd, [x, y], s.P), tiles = lv.patches.reduce((n, p) => n + p.w * p.h / 1024, 0);
      assert.strictEqual(tiles, Math.round(0.02 * 25 * 20), id + ' ' + cellName([x, y]) + ' tiles ' + tiles);
      for (const p of lv.patches) assert(lv.statics.every((st) => !(p.x < st.x + st.w && p.x + p.w > st.x && p.y < st.y + st.h && p.y + p.h > st.y)), 'puddle under a static');
      assert(lv.patches.some((p) => D.roadDist(lv.center)(p.x + p.w / 2, p.y + p.h / 2) < 56), id + ' ' + cellName([x, y]) + ': none on the road');
    }
  }
});
check('puddle: no dash from water; the slide runs movement.lowGripStopMultiplier longer; cars brake at half', () => {
  const s = empty(); const p = s.level.patches[0]; s.body.x = p.x + p.w / 2; s.body.y = p.y + p.h / 2;
  s.step({ aPress: true });
  assert(s.body.mode !== 'lunge' && s.events.some((e) => e.type === 'slip') && s.events.some((e) => e.type === 'denied'), 'dash denied on water');
  const coast = (wet) => { const t = empty(); t.level.patches = wet ? [{ x: 0, y: 0, w: 800, h: 640, kind: 'puddle' }] : []; t.body.x = 200; t.body.y = 300; t.body.facing = 0; idle(t, 90, { mx: 1, my: 0 }); const x0 = t.body.x; idle(t, 60, {}); return t.body.x - x0; };
  const dry = coast(false), wet = coast(true);
  const sum = (n) => { let k = 0; for (let i = 1; i < n; i++) k += 1 - i / n; return k; }; // tick sums of the linear coast: 0.25 s and 0.625 s
  assert(near(wet / dry, 0.9 * sum(37.5) / sum(15), 0.02), 'slide ratio ' + (wet / dry).toFixed(3)); // 2.5× the time, 0.9× the speed
  const brake = (wet) => {
    const t = new Sim('straight', { 'run.appearances.road': 1 }); t.checkTerminal = () => {}; t.nextAt = 0; t.admit();
    const c = t.cars[0]; c.s = 500; t.pose(c); c.v = 138; t.level.patches = wet ? [{ x: 0, y: 0, w: 800, h: 640, kind: 'puddle' }] : [];
    c.man = { type: 'brake', v0: 138, a: t.P['traffic.hardBraking'], vTarget: 0, t0: t.t, halt: true, tv: t.t };
    t.moveCars(1 / 60, t.t + 1 / 60); return 138 - c.v;
  };
  assert(near(brake(true) / brake(false), 0.5, 0.01), 'braking ratio ' + (brake(true) / brake(false)).toFixed(3));
});
check('Big battery: three charges when owned (D26); base two', () => {
  const s = empty(); assert.strictEqual(s.capacity(), 2);
  s.run.credits = 1; s.phase = 'shop'; const r = s.buy('bigBattery'); assert(r.ok && r.price === 1, 'one credit');
  s.leaveShop(); assert.strictEqual(s.capacity(), 3); assert.strictEqual(s.body.charge, 3);
});
// ---------- Edit 41 (20 Oct): five city districts, baked layouts, flyovers, landmarks
const { checkCity } = require('./tools/district_check.js');
check('city: five districts in a fixed order, quotas rising, and three baked layouts each that pass the contract', () => {
  assert.deepStrictEqual(D.DISTRICT_LIST, ['riverside', 'market', 'interchange', 'cbd', 'campus']);
  const q = D.DISTRICT_LIST.map((id) => D.REG['world.district.' + id + '.quota']);
  for (let i = 1; i < q.length; i++) assert(q[i] >= q[i - 1], 'quota falls at ' + D.DISTRICT_LIST[i]);
  for (const id of D.DISTRICT_LIST) for (const k of [1, 2, 3]) {
    const s = new Sim(id, { 'proto.layout': k }), Dd = s.district;
    assert(Dd && Dd.baked && Dd.layout === k, id + ' layout ' + k + ' not baked');
    const probs = checkCity(Dd, s.P, D); assert.strictEqual(probs.length, 0, id + '/' + k + ': ' + probs.slice(0, 2).join('; '));
  }
});
check('field (Edit 42, closes D27): 400 × 320 art px, 25 × 20 tiles; world 800 × 640', () => {
  assert.strictEqual(REG['world.width'], 800); assert.strictEqual(REG['world.height'], 640);
  assert.strictEqual(REG['ui.playWidth'], 800); assert.strictEqual(REG['ui.playHeight'], 640);
  assert.strictEqual(REG['world.width'] / REG['world.tileSize'], 25); assert.strictEqual(REG['world.height'] / REG['world.tileSize'], 20);
});
check('flyovers pass square over every road beneath them (Edit 43)', () => {
  const P = Object.assign({}, D.REG, D.PROTO, D.OVERRIDES);
  assert(D.deckCrossOK([[400, -200], [400, 800]], { hz: true, off: 300 }, P, 800, 600), 'perpendicular crossing');
  assert(!D.deckCrossOK([[-200, 300], [1000, 300]], { hz: true, off: 300 }, P, 800, 600), 'road under the deck');
  assert(!D.deckCrossOK([[-200, 380], [1000, 380]], { hz: true, off: 300 }, P, 800, 600), 'road alongside, one lane off the deck edge');
  assert(D.deckCrossOK([[-200, 520], [1000, 520]], { hz: true, off: 300 }, P, 800, 600), 'parallel road well clear');
  assert(!D.deckCrossOK([[300, -200], [500, 800]], { hz: true, off: 300 }, P, 800, 600), 'a diagonal crossing is not square');
  const ring = Array.from({ length: 49 }, (_, i) => [400 + 160 * Math.cos(i / 48 * 2 * Math.PI), 320 + 160 * Math.sin(i / 48 * 2 * Math.PI)]);
  assert(!D.deckCrossOK(ring, { hz: true, off: 320 }, P, 800, 640), 'a ring cannot pass under a deck');
});
check('city: the centre screen holds the landmark; flyovers cross whole rows or columns on pillars', () => {
  const want = { riverside: 'monument', market: 'fountain', interchange: 'roundabout', cbd: 'tower', campus: 'plate' };
  for (const id of D.DISTRICT_LIST) {
    const s = new Sim(id, { 'proto.layout': 1 }), Dd = s.district, c = Dd.cells[1][1];
    assert.strictEqual(c.focal, want[id], id + ' focal');
    for (const dk of Dd.decks) { const cells = Dd.cells.flat().filter((q) => (q.decks || []).length && (dk.hz ? q.cell[1] === dk.line : q.cell[0] === dk.line)); assert.strictEqual(cells.length, 3, id + ' deck spans 3 screens'); }
  }
  const t = new Sim('interchange', { 'proto.layout': 1 }), dks = t.district.decks;
  assert(dks.length === 2 && dks.every((dk) => dk.hz) && dks[0].line !== dks[1].line, 'two decks on different rows (Edit 42)');
  assert(dks.filter((dk) => dk.z === 1 && dk.height === t.P['world.deckHeight']).length === 1 && dks.filter((dk) => dk.z === 2 && dk.height === t.P['world.highHeight']).length === 1, 'a low highway at Z1 and a high highway at Z2 (Edit 44)');
  assert(dks.every((dk) => dk.line !== 1), 'Interchange decks stay off the roundabout row (Edit 43)');
});
check('city: the same layout plays the same; the next district follows in order', () => {
  const run = () => { const s = new Sim('market', { 'proto.layout': 2 }); for (let i = 0; i < 1800; i++) s.step({ mx: Math.sin(i / 40), my: Math.cos(i / 60), aPress: i % 89 === 0 }); return JSON.stringify(s.events); };
  assert.strictEqual(run(), run());
  const s = new Sim('riverside', { 'run.appearances.road': 0 }); s.body.health = 1; s.writeOff(); s.checkTerminal();
  assert(s.report && s.report.roadCleared && s.report.nextRoad === 'market', 'Riverside clears to Old Market');
  assert(new Sim('campus').isFinal, 'Campus is the last district');
});
// screen finder for the Edit 42 checks: a city screen whose level passes fn, made active with its own traffic
function onScreen(fn, o) {
  for (const id of D.DISTRICT_LIST) for (const k of [1, 2, 3]) {
    const s = new Sim(id, Object.assign({ 'proto.layout': k, 'run.appearances.road': 0 }, o || {})), Dd = s.district;
    for (const q of Dd.cells.flat()) {
      const lv = D.cellLevel(Dd, q.cell, s.P), hit = fn(lv, s);
      if (!hit) continue;
      s.checkTerminal = () => {}; Dd.cur = q.cell.slice(); s.level = lv; s.cones = s.conesFor(lv); s.cars = []; s.fillDeckCars();
      return { s, lv, hit };
    }
  }
  throw new Error('no screen found');
}
check('flyovers: deck cars are full drivers at their deck level, both ways; they never meet a dummy on the ground', () => {
  const { s, lv } = onScreen((lv) => lv.decks.length);
  const deck = s.cars.filter((c) => c.deck);
  assert(deck.length > 0 && deck.every((c) => c.layer === lv.decks[c.deckIdx].z && c.layer >= 1) && new Set(deck.map((c) => c.lane)).size === 2, 'both lanes run');
  assert.strictEqual(s.run.admitted, 0, 'deck cars are off the schedule');
  const dk = lv.decks[0]; s.body.x = 400; s.body.y = dk.off + 28; const h = s.body.health; // under a deck lane, on the ground
  for (let i = 0; i < 600; i++) { s.step({}); for (const c of s.cars) if (c.deck) assert.strictEqual(c.hz, null, 'deck driver sensed the ground dummy'); }
  assert.strictEqual(s.body.health, h, 'no hits through the deck'); assert(s.cars.some((c) => c.deck), 'traffic keeps coming');
});
const deckFloor = (lv, k) => lv.floors.findIndex((f) => f.kind === 'deck' && f.deck === k);
const stairStart = (st, R, b) => { const sg = Math.sign(st.low - st.high); if (st.axis === 'y') { b.x = st.x + st.w / 2; b.y = st.low + sg * (R + 4); } else { b.y = st.y + st.h / 2; b.x = st.low + sg * (R + 4); } return st.axis === 'y' ? { mx: 0, my: -sg } : { mx: -sg, my: 0 }; };
check('stairs: from the ground up to a highway at world.stairSpeed, and back down (Edit 44: to Z1 or Z2)', () => {
  const { s, hit: st } = onScreen((lv) => lv.stairs.find((q) => q.from === 0 && q.deck != null)), b = s.body, R = s.P['body.radius'], sg = Math.sign(st.low - st.high);
  s.cars = []; s.admitDeck = () => {}; b.facing = -sg * Math.PI / 2; const up = stairStart(st, R, b);
  let top = 0, onStair = 0;
  for (let i = 0; i < 400 && b.level !== st.to; i++) { s.step(up); if (b.stair) top = Math.max(top, Math.hypot(b.vx, b.vy)), onStair++; }
  assert.strictEqual(b.level, st.to, 'reached the highway'); assert(onStair > 0, 'climbed the stair');
  assert.strictEqual(s.level.floors[b.floor].kind, 'deck', 'on the deck floor'); assert.strictEqual(s.level.floors[b.floor].deck, st.deck);
  assert(top <= s.P['movement.runSpeed'] * s.P['world.stairSpeed'] + 1e-6, 'stair speed ' + top.toFixed(1));
  s.step({ aPress: true }); assert.strictEqual(b.mode, 'lunge', 'dash on the deck'); idle(s, 40, {});
  b.x = st.x + st.w / 2; b.mode = 'idle'; b.lunge = null;
  for (let i = 0; i < 600 && b.level !== 0; i++) s.step({ mx: 0, my: sg });
  assert.strictEqual(b.level, 0, 'back on the ground'); assert.strictEqual(b.floor, null);
});
check('deck: a deck car brakes for the dummy in its lane and takes a dash; a ground car passes under it', () => {
  const { s, lv } = onScreen((lv) => lv.decks.length && lv.deckLanes.length), b = s.body;
  s.cars = []; const ln = lv.deckLanes[0], p = D.pathAt(ln.path, 600), z = lv.decks[ln.deck].z;
  b.level = z; b.floor = deckFloor(lv, ln.deck); b.x = p.x; b.y = p.y; b.facing = Math.atan2(-p.ty, -p.tx);
  const c = s.newCar('deckT', 'sedan', 2, ln.path, 380, z); c.deckIdx = ln.deck; s.cars.push(c);
  const g = s.newCar('carT', 'sedan', 0, lv.lanes[0], 200, 0); s.cars.push(g);
  let sensed = false, groundSensed = false;
  for (let i = 0; i < 120; i++) { s.step({}); if (c.hz) sensed = true; if (g.hz) groundSensed = true; }
  assert(sensed && c.v < c.cruise, 'deck driver sees and slows'); assert(!groundSensed, 'ground driver never sees the deck dummy');
  c.s = 600 - c.L / 2 - 30; c.v = 60; s.pose(c); b.facing = Math.atan2(c.y - b.y, c.x - b.x); b.mode = 'idle'; b.charge = 2;
  s.step({ aPress: true }); idle(s, 30, {});
  const ev = s.events.find((e) => e.type === 'impact' && e.car === 'deckT'); assert(ev && ev.deck, 'hit on the deck');
});
check('drop: a broken parapet drops the dummy to the road; landing on a car scores a hit to the legs', () => {
  const { s, lv, hit: dk } = onScreen((lv) => lv.decks.find((q) => q.gaps.length)), b = s.body, R = s.P['body.radius'];
  const [a0, a1, side] = dk.gaps[0], lim = s.P['world.deckWidth'] / 2 - s.P['world.parapetWidth'] - R, k = lv.decks.indexOf(dk);
  s.cars = []; b.level = dk.z; b.floor = deckFloor(lv, k);
  if (dk.hz) { b.x = (a0 + a1) / 2; b.y = dk.off + side * (lim - 2); } else { b.y = (a0 + a1) / 2; b.x = dk.off + side * (lim - 2); }
  for (let i = 0; i < 30 && b.mode !== 'drop'; i++) s.step(dk.hz ? { mx: 0, my: side } : { mx: side, my: 0 });
  assert.strictEqual(b.mode, 'drop', 'dropped through the gap');
  const T = b.drop.T; assert(near(T, s.P['world.dropSeconds'] * Math.sqrt(D.zHeight(s.P, dk.z) / s.P['world.deckHeight']), 1e-9), 'fall time scales with √height');
  while (b.drop.t < T - 1 / 60 - 1e-9) s.step({});
  const rest = T - b.drop.t, lx = b.x + b.drop.vx * rest, ly = b.y + b.drop.vy * rest, pr = D.pathProject(lv.lanes[0], lx, ly);
  const c = s.newCar('carL', 'sedan', 0, lv.lanes[0], pr.s, 0); c.d = pr.lat; c.v = 40; s.pose(c); s.cars.push(c);
  s.step({});
  assert.strictEqual(b.level, 0, 'on the ground');
  const ev = s.events.find((e) => e.type === 'impact' && e.drop);
  assert(ev && /^leg[LR]$/.test(ev.part) && ev.assessed > 0, 'landing hit to the legs');
  const want = D.dropImpact(s.P, 0, 0, { cls: 'sedan', vx: 0, vy: 0 }, { nx: 0, ny: 0 }).assessed;
  assert(ev.assessed >= want - 1e-6, 'at least a drop onto a stopped car: ' + ev.assessed.toFixed(1) + ' vs ' + want.toFixed(1));
});
// ---------- Edit 44: Z0 ground, Z1 low highway, Z2 high highway, platform roofs and skybridges
check('levels (Edit 44): Z heights and stair runs; a Z2 drop lands harder than a Z1 drop', () => {
  const P = Object.assign({}, D.REG, D.PROTO, D.OVERRIDES);
  assert.deepStrictEqual([0, 1, 2].map((z) => D.zHeight(P, z)), [0, P['world.deckHeight'], P['world.highHeight']]);
  assert.deepStrictEqual([D.stairRun(P, 0, 1), D.stairRun(P, 0, 2), D.stairRun(P, 1, 2)], [64, 112, 48]);
  const car = { cls: 'sedan', vx: 0, vy: 0 }, v1 = P['damage.dropSpeed'], v2 = v1 * Math.sqrt(P['world.highHeight'] / P['world.deckHeight']);
  assert(D.dropImpact(P, 0, 0, car, { nx: 0, ny: 0 }, v2).assessed > D.dropImpact(P, 0, 0, car, { nx: 0, ny: 0 }, v1).assessed, 'higher fall, harder hit');
  for (const id of ['interchange', 'cbd']) for (const k of [1, 2, 3]) assert.strictEqual(new Sim(id, { 'proto.layout': k }).district.decks.filter((q) => q.z === 2).length, 1, id + '/' + k + ' one high highway');
  for (const id of ['riverside', 'market', 'campus']) for (const k of [1, 2, 3]) assert(new Sim(id, { 'proto.layout': k }).district.decks.every((q) => q.z === 1), id + ' low highways only');
});
check('platforms (Edit 44): a tall stair climbs from the ground to a Z2 roof; its ledge drops to the forecourt', () => {
  const { s, lv, hit: st } = onScreen((lv) => lv.stairs.find((q) => q.from === 0 && q.to === 2 && q.deck == null && lv.floors[q.head].ledges.length)), b = s.body, R = s.P['body.radius'];
  s.cars = []; s.admit = () => {}; const up = stairStart(st, R, b);
  for (let i = 0; i < 600 && b.level !== 2; i++) s.step(up);
  assert.strictEqual(b.level, 2, 'on the roof'); assert.strictEqual(b.floor, st.head); const f = lv.floors[b.floor]; assert.strictEqual(f.kind, 'roof');
  assert(s.events.some((e) => e.type === 'level' && e.level === 2 && e.floor === 'roof'), 'level event names the roof');
  const lg = f.ledges[0], o = { W: [-1, 0], E: [1, 0], N: [0, -1], S: [0, 1] }[lg.side], m = (lg.a0 + lg.a1) / 2;
  b.x = o[0] ? (o[0] < 0 ? f.x + 30 : f.x + f.w - 30) : m; b.y = o[1] ? (o[1] < 0 ? f.y + 30 : f.y + f.h - 30) : m; b.mode = 'idle';
  for (let i = 0; i < 120 && b.mode !== 'drop'; i++) s.step({ mx: o[0], my: o[1] });
  assert.strictEqual(b.mode, 'drop', 'off the ledge'); assert.strictEqual(b.drop.fromZ, 2); assert.strictEqual(b.drop.toZ, 0);
  assert(near(b.drop.T, s.P['world.dropSeconds'] * Math.sqrt(s.P['world.highHeight'] / s.P['world.deckHeight']), 1e-9), 'Z2 fall time');
  for (let i = 0; i < 120 && (b.mode === 'drop' || b.level !== 0); i++) s.step({});
  idle(s, 30, {});
  assert.strictEqual(b.level, 0, 'landed on the ground'); assert.strictEqual(b.floor, null);
  const rd = (x, y, r) => Math.hypot(Math.max(r.x - x, 0, x - (r.x + r.w)), Math.max(r.y - y, 0, y - (r.y + r.h)));
  assert(rd(b.x, b.y, { x: f.bx, y: f.by, w: f.bw, h: f.bh }) >= R - 0.5, 'clear of the building');
});
check('skybridges (Edit 44): the dummy crosses from roof to roof at Z2; the bridge sides hold', () => {
  const { s, lv, hit: br } = onScreen((lv) => lv.floors.find((f) => f.kind === 'bridge')), b = s.body, bi = lv.floors.indexOf(br);
  s.cars = []; s.admit = () => {};
  const [i, j] = br.ends, A = lv.floors[i], B = lv.floors[j], hz = br.axis === 'x', dir = Math.sign(hz ? B.bx - A.bx : B.by - A.by);
  b.level = 2; b.floor = i; b.stair = null; b.mode = 'idle';
  if (hz) { b.y = br.y + br.h / 2; b.x = A.x + A.w / 2; } else { b.x = br.x + br.w / 2; b.y = A.y + A.h / 2; }
  let onBridge = false;
  for (let k = 0; k < 600 && b.floor !== j; k++) { s.step(hz ? { mx: dir, my: 0 } : { mx: 0, my: dir }); assert.strictEqual(b.level, 2, 'stayed at Z2'); if (b.floor === bi) onBridge = true; }
  assert(onBridge, 'walked the bridge'); assert.strictEqual(b.floor, j, 'reached the far roof');
  b.floor = bi; b.mode = 'idle'; if (hz) { b.x = br.x + br.w / 2; b.y = br.y + br.h / 2; } else { b.y = br.y + br.h / 2; b.x = br.x + br.w / 2; }
  for (let k = 0; k < 90; k++) s.step(hz ? { mx: 0, my: 1 } : { mx: 1, my: 0 });
  assert(b.mode !== 'drop' && b.level === 2 && b.floor === bi, 'the bridge parapet holds');
});
check('link stairs (Edit 44): a short stair climbs from a low highway (Z1) to a platform roof (Z2), and back', () => {
  const { s, lv, hit: st } = onScreen((lv) => lv.stairs.find((q) => q.from === 1)), b = s.body, sg = Math.sign(st.high - st.low);
  s.cars = []; s.admitDeck = () => {}; s.admit = () => {};
  assert.strictEqual(lv.floors[st.foot].kind, 'deck'); assert.strictEqual(lv.floors[st.foot].z, 1); assert.strictEqual(lv.floors[st.head].kind, 'roof');
  b.level = 1; b.floor = st.foot; b.x = st.x + st.w / 2; b.y = st.low - sg * 30; b.mode = 'idle';
  for (let i = 0; i < 400 && b.level !== 2; i++) s.step({ mx: 0, my: sg });
  assert.strictEqual(b.level, 2, 'up to the roof'); assert.strictEqual(b.floor, st.head);
  for (let i = 0; i < 400 && b.level !== 1; i++) s.step({ mx: 0, my: -sg });
  assert.strictEqual(b.level, 1, 'back on the low highway'); assert.strictEqual(b.floor, st.foot);
});
check('high highway (Edit 44): its cars meet the dummy on their own deck only, never on a roof or the ground', () => {
  const { s, lv } = onScreen((lv) => lv.decks.some((q) => q.z === 2) && lv.deckLanes.length), b = s.body, k = lv.decks.findIndex((q) => q.z === 2);
  const c = s.cars.find((q) => q.deck && q.deckIdx === k) || s.addDeckCar(lv.deckLanes.findIndex((ln) => ln.deck === k), 200);
  assert.strictEqual(c.layer, 2, 'a Z2 car');
  b.level = 0; b.floor = null; assert(!s.meets(c), 'not from the ground');
  b.level = 2; b.floor = deckFloor(lv, k); assert(s.meets(c), 'on its deck');
  const roof = lv.floors.findIndex((f) => f.kind === 'roof'); if (roof >= 0) { b.floor = roof; assert(!s.meets(c), 'not from a roof'); }
});
check('bounded: walls hold the dummy; a checkpoint boom cannot be passed, and it lifts for a car', () => {
  const { s, lv, hit: cp } = onScreen((lv) => lv.checkpoints.find((q) => !q.deck)), b = s.body, R = s.P['body.radius'], W = 800, H = 640;
  const zone = D.checkZone(cp, s.P, W, H), out = { W: [-1, 0], E: [1, 0], N: [0, -1], S: [0, 1] }[cp.side], scr = s.screenName();
  const rd = (x, y, r) => Math.hypot(Math.max(r.x - x, 0, x - (r.x + r.w)), Math.max(r.y - y, 0, y - (r.y + r.h)));
  const bp = s.boomPoint(cp); b.x = bp.x - out[0] * 60; b.y = bp.y - out[1] * 60;
  for (let i = 0; i < 180; i++) { s.step({ mx: out[0], my: out[1] }); assert(rd(b.x, b.y, zone) >= R - 0.5, 'inside the checkpoint zone'); }
  assert.strictEqual(s.screenName(), scr, 'still on the screen');
  const pr = D.pathProject(lv.lanes[0], bp.x, bp.y), c = s.newCar('carB', 'sedan', 0, lv.lanes[0], pr.s, 0); c.v = 0; c.cruise = 0; s.pose(c); s.cars.push(c);
  const i0 = lv.checkpoints.indexOf(cp); idle(s, Math.ceil(s.P['world.boomSeconds'] * 60) + 2, {}); assert.strictEqual(s.booms[i0], 1, 'boom up');
  s.cars = []; idle(s, Math.ceil(s.P['world.boomSeconds'] * 60) + 2, {}); assert.strictEqual(s.booms[i0], 0, 'boom down');
  const wall = lv.statics.find((q) => q.kind === 'wall' && q.h > 120 && q.w < 40); // a side wall, if this screen has one
  // a flyover leaving the district stops at its own boom
  const dq = onScreen((l) => l.checkpoints.find((q) => q.deck)), dcp = dq.hit, ds = dq.s, db = ds.body, dz = D.checkZone(dcp, ds.P, W, H), dout = dcp.side === 'W' ? -1 : 1;
  const dk = dq.lv.decks.findIndex((q) => q.off === dcp.off);
  ds.cars = []; db.level = dq.lv.decks[dk].z; db.floor = deckFloor(dq.lv, dk); db.x = dout < 0 ? dcp.line + 60 : W - dcp.line - 60; db.y = dcp.off + 50;
  for (let i = 0; i < 120; i++) { ds.step({ mx: dout, my: 0 }); assert(rd(db.x, db.y, dz) >= R - 0.5, 'past the deck boom'); }
  assert.strictEqual(db.level, dq.lv.decks[dk].z, 'still on the deck');
  if (wall) { const t = s; t.body.x = wall.x < 400 ? wall.x + wall.w + R + 20 : wall.x - R - 20; t.body.y = wall.y + wall.h / 2; idle(t, 120, { mx: wall.x < 400 ? -1 : 1, my: 0 }); assert(rd(t.body.x, t.body.y, wall) >= R - 0.5, 'through the wall'); }
});
check('interchange: the roundabout island is crash matting: dash × world.terrain.matting.lunge', () => {
  const s = new Sim('interchange', { 'proto.layout': 1, 'run.appearances.road': 0 }); s.checkTerminal = () => {};
  const Dd = s.district; Dd.cur = [1, 1]; s.level = D.cellLevel(Dd, [1, 1], s.P);
  const m = s.level.patches.find((p) => p.kind === 'matting'); assert(m, 'matting');
  s.body.x = m.x + m.w / 2; s.body.y = m.y + m.h / 2; s.body.facing = 0; const x0 = s.body.x;
  s.step({ aPress: true }); assert.strictEqual(s.body.mode, 'lunge'); assert(near(s.body.lunge.R, 164 * 1.15, 0.01), 'reach ' + s.body.lunge.R);
  void x0;
});
check('campus: a hit taken on a calibrated plate scores damage.plateMultiplier', () => {
  const s = new Sim('campus', { 'proto.layout': 1, 'run.appearances.road': 1 }); s.checkTerminal = () => {};
  const Dd = s.district, c = Dd.cells[1][1]; Dd.cur = [1, 1]; s.level = D.cellLevel(Dd, [1, 1], s.P); s.cars = [];
  const plate = s.level.patches.find((p) => p.kind === 'plate'); assert(plate, 'a plate');
  s.body.x = plate.x + plate.w / 2; s.body.y = plate.y + plate.h / 2;
  assert.strictEqual(s.surfaceAt(s.body.x, s.body.y), 'plate');
  const before = s.run.points, ct = { k: 0, car: { id: 'carX', spent: false, model: 'SEDAN-01', cls: 'sedan' }, closing: 100, ph: { raw: 100, assessed: 100, angle: 0, dvd: 1, un: 1 }, px: s.body.x + 10, py: s.body.y, zone: 'front', carState: 'cruise', cause: null, lunging: false, stopped: false };
  s.account([ct]); assert(near(s.run.points - before, 150), 'points ' + (s.run.points - before));
  void c;
});
// ---------- Edit 43: turn styles, buildings by storey and frontage, corner speed
const radii = (pts) => pts.map((q, i) => { const a = pts[i - 1], c = pts[i + 1]; if (!a || !c) return Infinity; const A = Math.hypot(q[0] - a[0], q[1] - a[1]), B = Math.hypot(c[0] - q[0], c[1] - q[1]), C = Math.hypot(c[0] - a[0], c[1] - a[1]), cr = Math.abs((q[0] - a[0]) * (c[1] - a[1]) - (q[1] - a[1]) * (c[0] - a[0])); return cr < 1e-6 ? Infinity : A * B * C / (2 * cr); });
check('roads: tight, circular and stepped turns across the baked layouts; tight corners at world.turnRadiusTight', () => {
  const seen = {}, Rt = REG['world.turnRadiusTight'];
  for (const id of D.DISTRICT_LIST) for (const k of [1, 2, 3]) for (const q of new Sim(id, { 'proto.layout': k }).district.cells.flat()) {
    seen[q.turns] = (seen[q.turns] || 0) + 1;
    if (q.turns === 'tight' && q.center.length > 2) { const m = Math.min(...radii(q.center)); assert(m <= Rt + 2, id + '/' + k + ' tight corner radius ' + m.toFixed(1)); }
  }
  for (const t of ['tight', 'circular', 'stepped']) assert(seen[t] > 0, 'no ' + t + ' screens');
});
check('buildings: single, double and tower storeys; none inside the setback; frontage rows face the road at one line', () => {
  const st = REG['world.storeyHeight'], front = REG['world.laneWidth'] + D.PROTO['proto.shoulderWidth'] + REG['world.buildingSetback'], n = { 1: 0, 2: 0, tower: 0 };
  let atLine = 0, near = 0;
  for (const id of D.DISTRICT_LIST) for (const k of [1, 2, 3]) {
    const s = new Sim(id, { 'proto.layout': k });
    for (const q of s.district.cells.flat()) {
      const dist = D.roadDist(q.level.center);
      for (const b of q.level.statics.filter((x) => x.kind === 'block' && !x.landmark)) {
        assert.strictEqual(b.height % st, 0, 'whole storeys'); if (b.tower) n.tower++; else n[b.height / st]++;
        let m = Infinity; for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) m = Math.min(m, dist(b.x + b.w * i / 8, b.y + b.h * j / 8));
        assert(m >= front - 1.5, id + '/' + k + ' block inside the setback ' + m.toFixed(1));
        if (m < front + 40) { near++; if (m <= front + 1) atLine++; }
      }
    }
  }
  assert(n[1] > 0 && n[2] > 0 && n.tower > 0, 'tiers ' + JSON.stringify(n));
  assert(atLine / near >= 0.8, 'frontage on the line: ' + atLine + ' of ' + near);
});
check('corner speed: a car takes a tight corner no faster than √(traffic.cornerAccel × radius)', () => {
  let found = null;
  for (const id of D.DISTRICT_LIST) for (const k of [1, 2, 3]) { const sm = new Sim(id, { 'proto.layout': k }); for (const q of sm.district.cells.flat()) if (!found && q.turns === 'tight' && q.center.length > 2) found = { id, k, q }; }
  assert(found, 'a tight screen');
  const s = new Sim(found.id, { 'proto.layout': found.k, 'run.appearances.road': 0 }); s.checkTerminal = () => {};
  const Dd = s.district; Dd.cur = found.q.cell.slice(); s.level = D.cellLevel(Dd, Dd.cur, s.P); s.cars = []; s.body.x = -500; s.body.y = -500;
  const lane = s.level.lanes[0], rr = radii(lane.pts), i = rr.indexOf(Math.min(...rr)), sC = lane.cum[i];
  const c = s.newCar('carC', 'sedan', 0, lane, 40, 0); s.cars.push(c);
  let vAt = null;
  for (let t = 0; t < 900 && vAt == null; t++) { s.step({}); if (c.s + c.L / 2 >= sC) vAt = c.v; }
  const vMax = Math.sqrt(s.P['traffic.cornerAccel'] * rr[i]);
  assert(vAt != null && vAt <= vMax + 2 && vMax < c.cruise, 'speed at the corner ' + (vAt && vAt.toFixed(1)) + ' vs ' + vMax.toFixed(1));
});
for (const id of D.DISTRICT_LIST) {
  check(`smoke ${id}: 5 min scripted play across screens, no NaN`, () => {
    const s = new Sim(id, { 'proto.layout': 1 });
    for (let i = 0; i < 60 * 300; i++) {
      s.step({ mx: Math.sin(i / 37), my: Math.cos(i / 53), aPress: i % 41 === 0 });
      if (s.phase === 'report') s.continueReport();
      if (s.phase === 'shop') s.leaveShop();
      if (s.phase === 'ending' || s.phase === 'next') break;
      for (const c of s.cars) assert(Number.isFinite((c.x || 0) + (c.y || 0) + (c.s || 0) + c.v), 'NaN car');
      assert(Number.isFinite(s.body.x + s.body.y), 'NaN body');
    }
  });
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
