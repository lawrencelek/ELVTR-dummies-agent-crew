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
  check(`lunge reach at health ${hp} = ${want}`, () => {
    const s = empty(); s.body.health = hp; s.body.facing = 0;
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
check('battery: three lunges then denied; one refill after delay + period', () => {
  const s = empty(); s.body.facing = 0; s.body.x = 100; s.body.y = 300;
  for (let i = 0; i < 3; i++) { s.step({ aPress: true }); idle(s, 40); s.body.x = 100; }
  // 3 lunges spent with partial refills; force empty to test the rule cleanly
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
    s.body.x = 300; s.body.y = 480; s.body.facing = 0; s.body.vx = v; s.body.vy = 0;
    const p = s.releasePoint(); s.throwHeld();
    s.body.vx = 0; s.body.alive = false; // isolate the cone flight
    idle(s, 20);
    assert.strictEqual(cn.state, 'free');
    assert(near(cn.x - p.x, want, 0.05), `v=${v} got ${cn.x - p.x}`);
  }
});
check('throw gesture: hold to threshold drops close instead', () => {
  const s = empty(); s.run.owned = { carry: true, throw: true };
  const cn = s.cones[0]; cn.state = 'held'; s.body.held = cn; s.body.x = 300; s.body.y = 480; s.body.facing = 0;
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
check('difficulty: constant health across roads; Standard 300 default, Fragile 200, Reinforced 600', () => {
  for (const lvl of D.LEVEL_LIST) { const s = new Sim(lvl); assert.strictEqual(s.body.health, 300); assert(near(s.reach(), 164)); }
  assert.strictEqual(new Sim('corner', { 'proto.difficulty': 0 }).body.health, 200);
  assert.strictEqual(new Sim('straight', { 'proto.difficulty': 2 }).body.health, 600);
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
  for (const lvl of D.LEVEL_LIST) {
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
for (const lvl of D.LEVEL_LIST) {
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
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
