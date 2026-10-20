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
    const s = new Sim(lvl), S = 4, W = 800, H = 600, R = s.P['body.radius'], gw = W / S, gh = H / S, free = new Uint8Array(gw * gh), seen = new Uint8Array(gw * gh);
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
      const ca = edgeCrossings(Dd.cells[a[1]][a[0]].center, 800, 600).find((e) => e.side === sd), cb = edgeCrossings(Dd.cells[b[1]][b[0]].center, 800, 600).find((e) => e.side === OPPS[sd]);
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
      const share = lv.statics.filter((q) => q.kind === 'block').reduce((n, q) => n + q.w * q.h, 0) / 480000;
      if (lv.theme !== 'start') assert(share >= 0.2 && share <= s.P['world.occludedFractionMax'], tag + ' blocks ' + share.toFixed(3));
      assert(lv.spawns.length >= 3, tag + ' spawns');
      // flood fill from the spawns on a 4-unit grid
      const S = 4, gw = 200, gh = 150, free = new Uint8Array(gw * gh), seen = new Uint8Array(gw * gh), q = [];
      for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const px = i * S + 2, py = j * S + 2; free[j * gw + i] = px > R && px < 800 - R && py > R && py < 600 - R && lv.statics.every((st) => rdist(px, py, st) > R + 0.5) ? 1 : 0; }
      for (const sp of lv.spawns) { const k = Math.floor(sp.y / S) * gw + Math.floor(sp.x / S); if (free[k]) { seen[k] = 1; q.push(k); } }
      while (q.length) { const k = q.pop(), i = k % gw, j = (k - i) / gw; for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= gw || jj >= gh) continue; const kk = jj * gw + ii; if (free[kk] && !seen[kk]) { seen[kk] = 1; q.push(kk); } } }
      for (const sd of ['N', 'E', 'S', 'W']) { const nx = x + SIDE[sd][0], ny = y + SIDE[sd][1]; if (nx >= 0 && ny >= 0 && nx < 3 && ny < 3) assert((lv.gates[sd] || []).length >= 1, tag + ' no gate ' + sd); }
      for (const sd of ['N', 'E', 'S', 'W']) for (const [a, b] of lv.gates[sd] || []) {
        const m = (a + b) / 2, px = sd === 'W' ? R + 2 : sd === 'E' ? 800 - R - 2 : m, py = sd === 'N' ? R + 2 : sd === 'S' ? 600 - R - 2 : m;
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
      for (const sd of ['N', 'E', 'S', 'W']) for (let v = 16; v < (sd === 'E' || sd === 'W' ? 600 : 800) - R - 2; v += 4) { // the 4-unit lattice the spans are sampled on
        const here = sd === 'E' ? [800 - R - 1, v] : sd === 'W' ? [R + 1, v] : sd === 'S' ? [v, 600 - R - 1] : [v, R + 1];
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
      assert.strictEqual(tiles, Math.round(0.02 * 25 * 19), id + ' ' + cellName([x, y]) + ' tiles ' + tiles);
      for (const p of lv.patches) assert(lv.statics.every((st) => !(p.x < st.x + st.w && p.x + p.w > st.x && p.y < st.y + st.h && p.y + p.h > st.y)), 'puddle under a static');
      assert(lv.patches.some((p) => D.roadDist(lv.center)(p.x + p.w / 2, p.y + p.h / 2) < 56), id + ' ' + cellName([x, y]) + ': none on the road');
    }
  }
});
check('puddle: no dash from water; the slide runs movement.lowGripStopMultiplier longer; cars brake at half', () => {
  const s = empty(); const p = s.level.patches[0]; s.body.x = p.x + p.w / 2; s.body.y = p.y + p.h / 2;
  s.step({ aPress: true });
  assert(s.body.mode !== 'lunge' && s.events.some((e) => e.type === 'slip') && s.events.some((e) => e.type === 'denied'), 'dash denied on water');
  const coast = (wet) => { const t = empty(); t.level.patches = wet ? [{ x: 0, y: 0, w: 800, h: 600, kind: 'puddle' }] : []; t.body.x = 200; t.body.y = 300; t.body.facing = 0; idle(t, 90, { mx: 1, my: 0 }); const x0 = t.body.x; idle(t, 60, {}); return t.body.x - x0; };
  const dry = coast(false), wet = coast(true);
  const sum = (n) => { let k = 0; for (let i = 1; i < n; i++) k += 1 - i / n; return k; }; // tick sums of the linear coast: 0.25 s and 0.625 s
  assert(near(wet / dry, 0.9 * sum(37.5) / sum(15), 0.02), 'slide ratio ' + (wet / dry).toFixed(3)); // 2.5× the time, 0.9× the speed
  const brake = (wet) => {
    const t = new Sim('straight', { 'run.appearances.road': 1 }); t.checkTerminal = () => {}; t.nextAt = 0; t.admit();
    const c = t.cars[0]; c.s = 500; t.pose(c); c.v = 138; t.level.patches = wet ? [{ x: 0, y: 0, w: 800, h: 600, kind: 'puddle' }] : [];
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
check('city: the centre screen holds the landmark; flyovers cross whole rows or columns on pillars', () => {
  const want = { riverside: 'monument', market: 'fountain', interchange: 'roundabout', cbd: 'tower', campus: 'plate' };
  for (const id of D.DISTRICT_LIST) {
    const s = new Sim(id, { 'proto.layout': 1 }), Dd = s.district, c = Dd.cells[1][1];
    assert.strictEqual(c.focal, want[id], id + ' focal');
    for (const dk of Dd.decks) { const cells = Dd.cells.flat().filter((q) => (q.decks || []).length && (dk.hz ? q.cell[1] === dk.line : q.cell[0] === dk.line)); assert.strictEqual(cells.length, 3, id + ' deck spans 3 screens'); }
  }
  const t = new Sim('interchange', { 'proto.layout': 1 }), hs = t.district.decks.map((dk) => dk.height);
  assert(hs.length === 2 && hs[1] > hs[0], 'stacked: the column deck is higher');
});
check('city: the same layout plays the same; the next district follows in order', () => {
  const run = () => { const s = new Sim('market', { 'proto.layout': 2 }); for (let i = 0; i < 1800; i++) s.step({ mx: Math.sin(i / 40), my: Math.cos(i / 60), aPress: i % 89 === 0 }); return JSON.stringify(s.events); };
  assert.strictEqual(run(), run());
  const s = new Sim('riverside', { 'run.appearances.road': 0 }); s.body.health = 1; s.writeOff(); s.checkTerminal();
  assert(s.report && s.report.roadCleared && s.report.nextRoad === 'market', 'Riverside clears to Old Market');
  assert(new Sim('campus').isFinal, 'Campus is the last district');
});
check('flyovers: deck traffic runs both ways on the active screen and never touches the dummy', () => {
  const s = new Sim('interchange', { 'proto.layout': 1, 'run.appearances.road': 0 }); s.checkTerminal = () => {};
  const Dd = s.district, cell = Dd.cells.flat().find((q) => (q.decks || []).length);
  Dd.cur = cell.cell.slice(); s.level = D.cellLevel(Dd, cell.cell, s.P); s.fillDecks();
  assert(s.deckCars.length > 0 && s.deckCars.some((c) => c.dir > 0) && s.deckCars.some((c) => c.dir < 0), 'both directions');
  const dk = s.level.decks[0]; s.body.x = dk.hz ? 400 : dk.off; s.body.y = dk.hz ? dk.off : 300; const h = s.body.health;
  idle(s, 600, {});
  assert.strictEqual(s.body.health, h, 'no hits from the deck'); assert(s.deckCars.length > 0, 'traffic keeps coming');
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
  const Dd = s.district, c = Dd.cells[1][1]; Dd.cur = [1, 1]; s.level = D.cellLevel(Dd, [1, 1], s.P); s.fillDecks();
  const plate = s.level.patches.find((p) => p.kind === 'plate'); assert(plate, 'a plate');
  s.body.x = plate.x + plate.w / 2; s.body.y = plate.y + plate.h / 2;
  assert.strictEqual(s.surfaceAt(s.body.x, s.body.y), 'plate');
  const before = s.run.points, ct = { k: 0, car: { id: 'carX', spent: false, model: 'SEDAN-01', cls: 'sedan' }, closing: 100, ph: { raw: 100, assessed: 100, angle: 0, dvd: 1, un: 1 }, px: s.body.x + 10, py: s.body.y, zone: 'front', carState: 'cruise', cause: null, lunging: false, stopped: false };
  s.account([ct]); assert(near(s.run.points - before, 150), 'points ' + (s.run.points - before));
  void c;
});
for (const id of D.DISTRICT_LIST) {
  check(`smoke ${id}: 5 min scripted play across screens, no NaN`, () => {
    const s = new Sim(id, { 'proto.layout': 1 });
    for (let i = 0; i < 60 * 300; i++) {
      s.step({ mx: Math.sin(i / 37), my: Math.cos(i / 53), aPress: i % 41 === 0 });
      if (s.phase === 'report') s.continueReport();
      if (s.phase === 'shop') s.leaveShop();
      if (s.phase === 'ending' || s.phase === 'next') break;
      for (const c of s.cars.concat(s.deckCars)) assert(Number.isFinite((c.x || 0) + (c.y || 0) + (c.s || 0) + c.v), 'NaN car');
      assert(Number.isFinite(s.body.x + s.body.y), 'NaN body');
    }
  });
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
