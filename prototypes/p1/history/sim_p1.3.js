/* DUMMIES P1 — Finding the Fun. Deterministic simulation core. No DOM, no randomness. */
(function (root) {
  'use strict';

  // Registry values (Engineering §13.5). Trial.
  const REG = {
    'movement.walkSpeed': 81, 'movement.runSpeed': 162, 'movement.rampSeconds': 1,
    'movement.turnRate': 180, 'movement.turningSpeedFraction': 0.6, 'movement.alignThreshold': 30,
    'movement.stopSeconds': 0.25, 'movement.counterPressAngle': 135, 'movement.counterPressStop': 0.4,
    'movement.lungeDistance': 164, 'movement.lungeDuration': 0.3, 'movement.lungeRecovery': 0.35,
    'movement.wearFloor': 0.45, 'movement.lungeFastTimeFraction': 1 / 3, 'movement.lungeFastDistanceFraction': 0.7,
    'battery.capacity': 3, 'battery.secondsPerCharge': 0.8, 'battery.refillDelaySeconds': 0.3, 'battery.lungeCost': 1,
    'sensing.coneWidth': 90, 'sensing.coneReach': 900,
    'upgrades.hipsTurnRate': 360, 'upgrades.spineLimit': 45, 'upgrades.spineRate': 540,
    'upgrades.carrySpeed': 0.85, 'upgrades.throwDistance': 120,
    'feedback.hitStop': 0.06, 'feedback.writeOffSeconds': 1.1,
    'damage.baseImpact': 100, 'damage.zone.front': 1, 'damage.zone.frontDiagonal': 0.6, 'damage.zone.side': 0.3,
    'damage.zone.rearDiagonal': 0.15, 'damage.zone.rear': 0.05, 'damage.bodyHealth': 800, 'damage.referenceSpeed': 138,
    'rewards.writeOff': 2500,
    'perception.reactionDelay': 0.15, 'perception.sideRadius': 100, 'perception.forwardLength': 320,
    'perception.sideHalfAngle': 80,
    'traffic.timeGap': 1.2, 'traffic.minimumGap': 8, 'traffic.acceleration': 360, 'traffic.comfortBraking': 400,
    'traffic.hardBraking': 600, 'traffic.commitHorizon': 0.75, 'traffic.deadlockTimeout': 3,
    'traffic.entryRoomLengths': 1.0,
    'vehicles.sedan.mass': 1.0, 'vehicles.sedan.length': 56, 'vehicles.sedan.width': 28, 'vehicles.sedan.cruiseSpeed': 138,
    'vehicles.sedan.height': 22, 'vehicles.van.height': 34,
    'vehicles.van.mass': 1.5, 'vehicles.van.length': 68, 'vehicles.van.width': 32, 'vehicles.van.cruiseSpeed': 120,
    'world.laneWidth': 56, 'world.pedestrianGap': 40, 'world.spawnLeadIn': 200, 'world.width': 800, 'world.height': 600,
    'body.radius': 13, 'simulation.tickRate': 60,
    'run.quota.road': 5, 'run.appearances.road': 40, 'run.admissionInterval': 12,
    'economy.price.torso.hips': 1, 'economy.price.arms.carry': 1,
    'economy.price.torso.spine': 2, 'economy.price.arms.throw': 2,
    'props.cone.radius': 6, 'props.cone.pickupEdgeRange': 12, 'props.cone.placementClearance': 0.1,
    'props.cone.throwSeconds': 0.2, 'props.cone.puntDistance': 24, 'props.cone.puntSeconds': 0.2,
    'learning.playerHitStep': 0.08, 'learning.playerHitCap': 0.4, 'input.dropHoldSeconds': 0.25,
  };
  // P1-only proposed parameters (brief §P1.9). Not in the registry.
  const PROTO = {
    'proto.swerveLength': 120, 'proto.swerveOuter': 34, 'proto.shoulderWidth': 24,
    'proto.sideSlowFraction': 0.6, 'proto.substeps': 4,
    'proto.learningEnabled': 0, 'proto.zonesEverywhere': 0, 'proto.pathsEverywhere': 1,
    'proto.returnSignalSeconds': 0.5, 'proto.returnClearance': 30, 'proto.carYawRate': 240,
    'proto.chassis.straight.bodyHealth': 300, 'proto.chassis.barrier.bodyHealth': 500,
    'proto.chassis.corner.bodyHealth': 800,
    'proto.damageModel': 1, 'proto.damageExponent': 2, 'proto.dummyMass': 0.056, 'proto.restitution': 0.3, 'proto.dummyStrikeSpeed': 100,
    'proto.contactFriction': 0.3, 'proto.recoilScale': 0.6, 'proto.recoilSeconds': 0.35,
    'proto.honkSeconds': 5, 'proto.droneSpeed': 240, 'proto.droneLiftSeconds': 0.5,
    'proto.art.shadowScale': 0.3, 'proto.art.crateHeight': 30, 'proto.art.barrierHeight': 14,
    'proto.art.coneHeight': 14, 'proto.art.dummyHeight': 18, 'proto.art.droneHeight': 70,
  };

  // P1.2 prototype overrides of registry values (logged in DUMMIES_Prototype_Log.md).
  const OVERRIDES = { 'props.cone.radius': 7.2 };

  const NODES = {
    hips: { name: 'Hips', branch: 'Torso', price: 'economy.price.torso.hips', pre: null,
      desc: 'Turn twice as fast. Face a new target before it passes.' },
    spine: { name: 'Spine', branch: 'Torso', price: 'economy.price.torso.spine', pre: 'hips',
      desc: 'Steer during a lunge, within a limited angle.' },
    carry: { name: 'Carry', branch: 'Arms', price: 'economy.price.arms.carry', pre: null,
      desc: 'B picks up a cone. B again places it. Lay traps in a car’s path.' },
    throw: { name: 'Throw', branch: 'Arms', price: 'economy.price.arms.throw', pre: 'carry',
      desc: 'Tap B to throw a held cone. Hold B to drop it close.' },
  };

  // ---------- math
  const TAU = Math.PI * 2, DEG = Math.PI / 180;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hyp = Math.hypot;
  const wrap = (a) => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };
  const turnTo = (from, to, step) => { const d = wrap(to - from); return Math.abs(d) <= step ? to : from + Math.sign(d) * step; };

  // ---------- paths
  function makePath(pts) {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + hyp(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, cum, length: cum[cum.length - 1] };
  }
  function pathAt(path, s) {
    const { pts, cum } = path;
    s = clamp(s, 0, path.length);
    let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= s) lo = m; else hi = m; }
    const seg = cum[hi] - cum[lo] || 1, f = (s - cum[lo]) / seg;
    const tx = (pts[hi][0] - pts[lo][0]) / seg, ty = (pts[hi][1] - pts[lo][1]) / seg;
    return { x: pts[lo][0] + tx * seg * f, y: pts[lo][1] + ty * seg * f, tx, ty, nx: -ty, ny: tx };
  }
  function offsetPts(pts, off) {
    return pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], l = hyp(dx, dy) || 1;
      return [p[0] + (-dy / l) * off, p[1] + (dx / l) * off];
    });
  }
  const ease = (f) => (1 - Math.cos(Math.PI * f)) / 2;
  const easeD = (f) => Math.PI / 2 * Math.sin(Math.PI * f);
  // Nearest point on a path: arc length s and signed lateral offset (+ = right of travel).
  function pathProject(path, x, y) {
    const { pts, cum } = path;
    let best = null;
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i][0], ay = pts[i][1], dx = pts[i + 1][0] - ax, dy = pts[i + 1][1] - ay, l2 = dx * dx + dy * dy || 1;
      const f = clamp(((x - ax) * dx + (y - ay) * dy) / l2, 0, 1), px = ax + dx * f, py = ay + dy * f;
      const d2 = (x - px) * (x - px) + (y - py) * (y - py);
      if (!best || d2 < best.d2) { const l = Math.sqrt(l2); best = { d2, s: cum[i] + f * l, lat: (x - px) * (-dy / l) + (y - py) * (dx / l) }; }
    }
    return best;
  }
  function arcPts(cx, cy, r, a0, a1, n) {
    const out = [];
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return out;
  }

  // ---------- levels (world units; 800 × 600 field)
  const LEVELS = {
    straight: {
      name: 'L1 Straight', grade: 'Mk I', blurb: 'Open two-way road. A flimsy chassis: you break easily.',
      center: () => [[-200, 300], [1000, 300]],
      statics: [{ x: 160, y: 120, w: 44, h: 32, kind: 'crate' }, { x: 580, y: 450, w: 44, h: 32, kind: 'crate' }],
      cones: [[110, 196], [310, 190], [500, 414], [690, 420]],
      spawns: [{ x: 400, y: 480, f: -90 }, { x: 160, y: 480, f: -90 }, { x: 640, y: 480, f: -90 }, { x: 400, y: 120, f: 90 }],
    },
    barrier: {
      name: 'L2 Barrier', grade: 'Mk II', blurb: 'Hide behind the barrier. Ambush through the gaps.',
      center: () => [[-200, 300], [1000, 300]],
      statics: [
        { x: 0, y: 388, w: 250, h: 12, kind: 'barrier' }, { x: 290, y: 388, w: 220, h: 12, kind: 'barrier' },
        { x: 550, y: 388, w: 250, h: 12, kind: 'barrier' },
        { x: 120, y: 150, w: 44, h: 32, kind: 'crate' }, { x: 420, y: 140, w: 44, h: 32, kind: 'crate' },
        { x: 660, y: 160, w: 44, h: 32, kind: 'crate' },
      ],
      cones: [[90, 202], [260, 198], [540, 202], [150, 428], [700, 428]],
      spawns: [{ x: 400, y: 500, f: -90 }, { x: 140, y: 500, f: -90 }, { x: 660, y: 500, f: -90 }, { x: 300, y: 110, f: 90 }],
    },
    corner: {
      name: 'L3 Corner', grade: 'Mk III', blurb: 'A right-angle bend on a sturdier chassis.',
      center: () => [[-200, 440], [450, 440], ...arcPts(450, 340, 100, Math.PI / 2, 0, 24).slice(1), [550, -200]],
      statics: [{ x: 290, y: 270, w: 44, h: 32, kind: 'crate' }, { x: 360, y: 180, w: 44, h: 32, kind: 'crate' },
        { x: 680, y: 500, w: 44, h: 32, kind: 'crate' }],
      cones: [[200, 330], [320, 552], [660, 220], [420, 120]],
      spawns: [{ x: 300, y: 560, f: -90 }, { x: 700, y: 400, f: 180 }, { x: 200, y: 160, f: 0 }, { x: 720, y: 140, f: 180 }],
    },
  };
  const LEVEL_LIST = ['straight', 'barrier', 'corner'];

  function buildLevel(id, P) {
    const L = LEVELS[id], half = P['world.laneWidth'] / 2, c = L.center();
    return {
      id, name: L.name, blurb: L.blurb, center: c,
      lanes: [makePath(offsetPts(c, half)), makePath(offsetPts(c, -half).reverse())],
      statics: L.statics.map((s, i) => Object.assign({ id: 's' + i }, s)),
      coneHomes: L.cones.slice(), spawns: L.spawns.slice(),
    };
  }

  // ---------- geometry tests
  function circleRect(px, py, r, s) {
    const qx = clamp(px, s.x, s.x + s.w), qy = clamp(py, s.y, s.y + s.h);
    const dx = px - qx, dy = py - qy, d = hyp(dx, dy);
    if (d >= r) return null;
    if (d > 1e-9) return { nx: dx / d, ny: dy / d, pen: r - d };
    const l = px - s.x, rt = s.x + s.w - px, t = py - s.y, b = s.y + s.h - py, m = Math.min(l, rt, t, b);
    if (m === l) return { nx: -1, ny: 0, pen: l + r };
    if (m === rt) return { nx: 1, ny: 0, pen: rt + r };
    if (m === t) return { nx: 0, ny: -1, pen: t + r };
    return { nx: 0, ny: 1, pen: b + r };
  }
  // Normal points from the car toward the circle (push-out direction).
  function circleCar(px, py, r, c) {
    const ca = Math.cos(c.h), sa = Math.sin(c.h), dx = px - c.x, dy = py - c.y;
    const lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca, hx = c.L / 2, hy = c.W / 2;
    let qx = clamp(lx, -hx, hx), qy = clamp(ly, -hy, hy), nlx, nly, pen;
    const ex = lx - qx, ey = ly - qy, d = hyp(ex, ey);
    if (d >= r) return null;
    if (d > 1e-9) { nlx = ex / d; nly = ey / d; pen = r - d; }
    else {
      const px_ = hx - Math.abs(lx), py_ = hy - Math.abs(ly);
      if (px_ < py_) { nlx = Math.sign(lx) || 1; nly = 0; pen = px_ + r; qx = nlx * hx; }
      else { nlx = 0; nly = Math.sign(ly) || 1; pen = py_ + r; qy = nly * hy; }
    }
    return { nx: nlx * ca - nly * sa, ny: nlx * sa + nly * ca, pen,
      cx: c.x + qx * ca - qy * sa, cy: c.y + qx * sa + qy * ca, qx, qy };
  }
  function segRect(x0, y0, x1, y1, s) {
    let t0 = 0, t1 = 1; const dx = x1 - x0, dy = y1 - y0;
    const tests = [[-dx, x0 - s.x], [dx, s.x + s.w - x0], [-dy, y0 - s.y], [dy, s.y + s.h - y0]];
    for (const [p, q] of tests) {
      if (Math.abs(p) < 1e-12) { if (q < 0) return false; continue; }
      const r = q / p;
      if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
    return true;
  }
  function segCar(x0, y0, x1, y1, c) {
    const ca = Math.cos(c.h), sa = Math.sin(c.h);
    const loc = (x, y) => [(x - c.x) * ca + (y - c.y) * sa, -(x - c.x) * sa + (y - c.y) * ca];
    const [a0, b0] = loc(x0, y0), [a1, b1] = loc(x1, y1);
    return segRect(a0, b0, a1, b1, { x: -c.L / 2, y: -c.W / 2, w: c.L, h: c.W });
  }
  // Zone from normalised car-local contact position (Engineering §8.2).
  function zoneOf(qx, qy, c) {
    const ux = qx / (c.L / 2), uy = qy / (c.W / 2);
    if (Math.abs(ux) < 1e-9 && Math.abs(uy) < 1e-9) return 'side';
    const a = Math.atan2(Math.abs(uy), ux) / DEG;
    if (a <= 30) return 'front'; if (a <= 60) return 'frontDiagonal'; if (a <= 120) return 'side';
    if (a <= 150) return 'rearDiagonal'; return 'rear';
  }
  // P1.3 impulse model. n points from dummy into car. Velocities in world units/s.
  // Newtonian two-body impact: J = (1+e)·μ·u, μ = m_d·m_c/(m_d+m_c). Damage ∝ (dummy Δv)^p; p = 2 tracks dissipated energy.
  // The dummy's own approach speed is capped at a sprint (the one non-Newtonian rule).
  function impulseImpact(P, bvx, bvy, cvx, cvy, nx, ny, cls) {
    const md = P['proto.dummyMass'], mc = P['vehicles.' + cls + '.mass'], ms = P['vehicles.sedan.mass'], e = P['proto.restitution'];
    const vdn = bvx * nx + bvy * ny, vcn = cvx * nx + cvy * ny;
    const strike = Math.min(Math.max(vdn, 0), P['proto.dummyStrikeSpeed']) + Math.min(vdn, 0);
    const un = Math.max(0, strike - vcn);
    const mu = md * mc / (md + mc), J = (1 + e) * mu * un, dvd = J / md;
    const rx = bvx - cvx, ry = bvy - cvy, rn = rx * nx + ry * ny, rl = hyp(rx, ry);
    const angle = rl > 1e-9 && rn > 0 ? Math.acos(clamp(rn / rl, -1, 1)) / DEG : 90;
    const tx = rx - rn * nx, ty = ry - rn * ny, tl = hyp(tx, ty);
    const dvt = tl > 1e-9 ? Math.min(P['proto.contactFriction'] * J, mu * tl) / md : 0;
    const ref = (1 + e) * (ms / (md + ms)) * P['damage.referenceSpeed'];
    const raw = P['damage.baseImpact'] * Math.pow(dvd / ref, P['proto.damageExponent']);
    // Recoil: physical post-impact velocity, scaled down, but always clear of an approaching car.
    const sc = P['proto.recoilScale'];
    let kn = (strike - dvd) * sc;
    if (vcn < 0) kn = Math.min(kn, vcn - 5);
    const tdx = tl > 1e-9 ? -tx / tl : 0, tdy = tl > 1e-9 ? -ty / tl : 0;
    const vdtx = bvx - vdn * nx, vdty = bvy - vdn * ny;
    const kx = nx * kn + (vdtx + tdx * dvt) * sc, ky = ny * kn + (vdty + tdy * dvt) * sc;
    return { raw, assessed: Math.min(raw, P['damage.bodyHealth']), un, dvd, dvt, angle, knock: { x: kx, y: ky } };
  }
  function assess(P, closing, zone, cls) {
    const raw = P['damage.baseImpact'] * P['damage.zone.' + zone] * P['vehicles.' + cls + '.mass'] *
      closing / P['damage.referenceSpeed'];
    return { raw, assessed: Math.min(raw, P['damage.bodyHealth']) };
  }

  // ---------- simulation
  class Sim {
    constructor(levelId, overrides) {
      this.P = Object.assign({}, REG, PROTO, OVERRIDES, overrides || {});
      this.levelId = levelId;
      this.level = buildLevel(levelId, this.P);
      this.grade = LEVELS[levelId].grade;
      const ch = this.P['proto.chassis.' + levelId + '.bodyHealth'];
      if (ch != null) this.P['damage.bodyHealth'] = ch;
      this.reset();
    }

    reset() {
      const P = this.P;
      this.t = 0; this.tick = 0; this.phase = 'play'; this.phaseT = 0; this.pendingPhase = null;
      this.cars = []; this.carSeq = 0; this.slot = 0; this.lastAdmit = -1e9;
      const pat = ['sedan', 'van', 'sedan', 'sedan', 'van'];
      this.schedule = Array.from({ length: P['run.appearances.road'] }, (_, i) => ({ i, cls: pat[i % 5], lane: i % 2 }));
      this.cones = this.level.coneHomes.map((c, i) => ({ id: 'cone' + (i + 1), x: c[0], y: c[1], hx: c[0], hy: c[1], vx: 0, vy: 0, state: 'free', flightT: 0, flightDur: 1 }));
      this.drones = []; this.droneSeq = 0;
      this.models = { sedan: { id: 'SEDAN-01', cls: 'sedan', applied: 0 }, van: { id: 'VAN-02', cls: 'van', applied: 0 } };
      this.run = { writeOffs: 0, credits: 0, points: 0, owned: {}, chassis: 0, ending: null, admitted: 0, exited: 0, purchases: [] };
      this.events = []; this.effects = []; this.milestones = {}; this.report = null;
      this.turnHist = [];
      this.spawnBody();
    }

    has(n) { return !!this.run.owned[n]; }
    emit(type, data) { this.events.push(Object.assign({ t: +this.t.toFixed(4), type }, data || {})); }
    mile(key, data) { if (!this.milestones[key]) { this.milestones[key] = Object.assign({ t: +this.t.toFixed(3) }, data || {}); this.emit('milestone', { key }); } }

    // ----- body
    pickSpawn() {
      for (const sp of this.level.spawns) if (this.cars.every((c) => hyp(c.x - sp.x, c.y - sp.y) > 80)) return sp;
      return this.level.spawns[0];
    }
    spawnBody() {
      const P = this.P, sp = this.pickSpawn();
      this.run.chassis++;
      this.body = {
        x: sp.x, y: sp.y, vx: 0, vy: 0, facing: sp.f * DEG, health: P['damage.bodyHealth'],
        charge: P['battery.capacity'], refillDelay: 0, rampT: 0, mode: 'idle',
        coastVx: 0, coastVy: 0, coastT: 0, counterVx: 0, counterVy: 0, counterT: 0, counterDur: 0,
        lunge: null, recoverT: 0, held: null, gesture: null, alive: true, chassis: this.run.chassis,
        hits: [], denied: 0, points0: this.run.points,
      };
      this.emit('chassis', { chassis: this.run.chassis, x: sp.x, y: sp.y });
    }
    reach() {
      const P = this.P, b = this.body;
      return P['movement.lungeDistance'] * Math.max(P['movement.wearFloor'], Math.min(1, b.health / P['damage.bodyHealth']));
    }
    deny(action) { this.body.denied = 0.25; this.emit('denied', { action }); }

    startLunge(facing0) {
      const P = this.P, b = this.body, T = P['movement.lungeDuration'];
      const R = this.reach();
      b.charge -= P['battery.lungeCost']; b.refillDelay = P['battery.refillDelaySeconds'];
      b.lunge = { dir0: facing0, dir: facing0, R, T, tf: T * P['movement.lungeFastTimeFraction'],
        df: P['movement.lungeFastDistanceFraction'], t: 0, blocked: false, x0: b.x, y0: b.y };
      b.mode = 'lunge'; b.facing = facing0; b.rampT = 0;
      this.emit('lunge', { R: +R.toFixed(2), charge: +b.charge.toFixed(3) });
    }

    bodyControl(cmd, dt) {
      const P = this.P, b = this.body;
      if (!b.alive) return;
      if (b.refillDelay > 0) { b.refillDelay -= dt; if (b.refillDelay < 1e-9) b.refillDelay = 0; }
      else b.charge = Math.min(P['battery.capacity'], b.charge + dt / P['battery.secondsPerCharge']);
      b.denied = Math.max(0, b.denied - dt);
      const facing0 = b.facing;
      const mx = cmd.mx || 0, my = cmd.my || 0, m = hyp(mx, my), has = m > 0.3;
      const ix = has ? mx / m : 0, iy = has ? my / m : 0, inAng = has ? Math.atan2(iy, ix) : 0;
      const rate = (this.has('hips') ? P['upgrades.hipsTurnRate'] : P['movement.turnRate']) * DEG;
      const carryF = b.held ? P['upgrades.carrySpeed'] : 1;

      if (cmd.aPress) {
        if (b.mode !== 'lunge' && b.mode !== 'recover' && b.charge >= P['battery.lungeCost'] - 1e-9) this.startLunge(facing0);
        else this.deny('lunge');
        if (cmd.bRelease) b.gesture = null; // suppressed gesture cannot fire later
      } else this.handleB(cmd, dt);

      if (b.mode === 'lunge') {
        if (this.has('spine') && has) {
          const L = b.lunge, lim = P['upgrades.spineLimit'] * DEG;
          let nd = turnTo(L.dir, inAng, P['upgrades.spineRate'] * DEG * dt);
          const off = wrap(nd - L.dir0);
          if (Math.abs(off) > lim) nd = L.dir0 + Math.sign(off) * lim;
          L.dir = nd; b.facing = nd;
        }
        return;
      }
      if (b.mode === 'recover') {
        b.recoverT += dt;
        if (has) b.facing = turnTo(b.facing, inAng, rate * dt);
        const f = clamp(b.recoverT / P['movement.lungeRecovery'], 0, 1);
        b.vx = has ? ix * P['movement.walkSpeed'] * f * carryF : 0;
        b.vy = has ? iy * P['movement.walkSpeed'] * f * carryF : 0;
        if (b.recoverT >= P['movement.lungeRecovery'] - 1e-9) { b.mode = has ? 'move' : 'idle'; b.rampT = 0; }
        return;
      }
      if (b.mode === 'knock') {
        b.knockT += dt;
        const k = Math.max(0, 1 - b.knockT / P['proto.recoilSeconds']);
        b.vx = b.knockVx * k; b.vy = b.knockVy * k;
        if (k === 0) { b.mode = 'idle'; b.rampT = 0; }
        return;
      }
      if (b.mode === 'counter') {
        b.counterT += dt;
        if (has) b.facing = turnTo(b.facing, inAng, rate * dt);
        const k = Math.max(0, 1 - b.counterT / b.counterDur);
        b.vx = b.counterVx * k; b.vy = b.counterVy * k;
        if (b.counterT >= b.counterDur - 1e-9) { b.mode = has ? 'move' : 'idle'; b.rampT = 0; b.vx = 0; b.vy = 0; }
        return;
      }
      const sp = hyp(b.vx, b.vy);
      if (has) {
        if (sp > 1 && Math.abs(wrap(inAng - Math.atan2(b.vy, b.vx))) > P['movement.counterPressAngle'] * DEG) {
          b.mode = 'counter'; b.counterT = 0; b.counterDur = P['movement.stopSeconds'] * P['movement.counterPressStop'];
          b.counterVx = b.vx; b.counterVy = b.vy; b.rampT = 0;
          b.facing = turnTo(b.facing, inAng, rate * dt);
          return;
        }
        b.facing = turnTo(b.facing, inAng, rate * dt);
        if (b.mode !== 'move') { b.mode = 'move'; b.rampT = 0; }
        b.rampT += dt;
        let spd = P['movement.walkSpeed'] + (P['movement.runSpeed'] - P['movement.walkSpeed']) *
          clamp(b.rampT / P['movement.rampSeconds'], 0, 1);
        if (Math.abs(wrap(inAng - b.facing)) > P['movement.alignThreshold'] * DEG) spd *= P['movement.turningSpeedFraction'];
        spd *= carryF;
        b.vx = ix * spd; b.vy = iy * spd;
      } else {
        if (b.mode === 'move') { b.mode = 'coast'; b.coastT = 0; b.coastVx = b.vx; b.coastVy = b.vy; b.rampT = 0; }
        if (b.mode === 'coast') {
          b.coastT += dt;
          const k = Math.max(0, 1 - b.coastT / P['movement.stopSeconds']);
          b.vx = b.coastVx * k; b.vy = b.coastVy * k;
          if (k === 0) b.mode = 'idle';
        } else { b.vx = 0; b.vy = 0; }
      }
    }

    handleB(cmd, dt) {
      const P = this.P, b = this.body, busy = b.mode === 'lunge' || b.mode === 'recover';
      if (cmd.bPress) {
        if (!b.held) {
          if (this.has('carry')) {
            const cn = busy ? null : this.nearestCone();
            if (cn) { cn.state = 'held'; b.held = cn; this.emit('pickup', { cone: cn.id }); this.mile('use:carry'); }
            else this.deny('pickup');
          }
        } else if (!this.has('throw')) this.dropHeld();
        else b.gesture = { t: 0 };
      }
      if (b.gesture) {
        b.gesture.t += dt;
        if (cmd.bRelease) { const g = b.gesture; b.gesture = null; if (g.t < P['input.dropHoldSeconds']) this.throwHeld(); }
        else if (b.gesture.t >= P['input.dropHoldSeconds']) { b.gesture = null; this.dropHeld(); }
      }
    }
    nearestCone() {
      const P = this.P, b = this.body, rr = P['body.radius'] + P['props.cone.radius'];
      let best = null, bd = Infinity;
      for (const cn of this.cones) {
        if (cn.state !== 'free') continue;
        const edge = hyp(cn.x - b.x, cn.y - b.y) - rr;
        if (edge <= P['props.cone.pickupEdgeRange'] && (edge < bd - 1e-9)) { best = cn; bd = edge; }
      }
      return best;
    }
    coneSpotValid(x, y, ignore) {
      const P = this.P, r = P['props.cone.radius'];
      if (x < r || y < r || x > P['world.width'] - r || y > P['world.height'] - r) return false;
      if (this.level.statics.some((s) => circleRect(x, y, r, s))) return false;
      if (this.cars.some((c) => circleCar(x, y, r, c))) return false;
      if (this.drones.some((d) => d.target && d.cone !== (ignore && ignore.id) && hyp(d.target.x - x, d.target.y - y) < 2 * r)) return false;
      return !this.cones.some((c) => c !== ignore && (c.state === 'free' || c.state === 'flight') && hyp(c.x - x, c.y - y) < 2 * r);
    }
    releasePoint() {
      const P = this.P, b = this.body, d = P['body.radius'] + P['props.cone.radius'] + P['props.cone.placementClearance'];
      return { x: b.x + Math.cos(b.facing) * d, y: b.y + Math.sin(b.facing) * d };
    }
    dropHeld() {
      const b = this.body, cn = b.held, p = this.releasePoint();
      if (!this.coneSpotValid(p.x, p.y, cn)) return this.deny('drop');
      Object.assign(cn, { x: p.x, y: p.y, vx: 0, vy: 0, state: 'free' }); b.held = null;
      this.emit('drop', { cone: cn.id, x: +p.x.toFixed(2), y: +p.y.toFixed(2) });
    }
    throwHeld() {
      const P = this.P, b = this.body, cn = b.held, p = this.releasePoint();
      if (!this.coneSpotValid(p.x, p.y, cn)) return this.deny('throw');
      const T = P['props.cone.throwSeconds'], X = P['upgrades.throwDistance'];
      const vx = b.vx + Math.cos(b.facing) * X / T, vy = b.vy + Math.sin(b.facing) * X / T;
      Object.assign(cn, { x: p.x, y: p.y, vx, vy, state: 'flight', flightT: T, flightDur: T, kind: 'throw', fx: p.x, fy: p.y });
      b.held = null;
      this.emit('throw', { cone: cn.id, vx: +vx.toFixed(2), vy: +vy.toFixed(2) });
      this.mile('use:throw');
    }
    releaseHeldAtDeath() {
      const b = this.body, cn = b.held;
      if (!cn) return;
      b.held = null; b.gesture = null;
      if (this.coneSpotValid(b.x, b.y, cn)) Object.assign(cn, { x: b.x, y: b.y, vx: 0, vy: 0, state: 'free' });
      else { cn.state = 'pending'; cn.px = b.x; cn.py = b.y; }
      this.emit('cone-release', { cone: cn.id, state: cn.state });
    }
    retryPending() {
      for (const cn of this.cones) {
        if (cn.state !== 'pending') continue;
        const homes = this.level.coneHomes.map((h) => ({ x: h[0], y: h[1] }))
          .sort((a, b) => hyp(a.x - cn.px, a.y - cn.py) - hyp(b.x - cn.px, b.y - cn.py));
        for (const h of [{ x: cn.px, y: cn.py }, ...homes]) {
          if (this.coneSpotValid(h.x, h.y, cn)) { Object.assign(cn, { x: h.x, y: h.y, state: 'free', recovered: true }); break; }
        }
      }
    }

    moveBody(h) {
      const b = this.body;
      if (!b.alive) return;
      if (b.mode === 'lunge') {
        const L = b.lunge;
        const spd = L.t < L.tf - 1e-9 ? L.R * L.df / L.tf : L.R * (1 - L.df) / (L.T - L.tf);
        if (L.blocked) { b.vx = 0; b.vy = 0; } else { b.vx = Math.cos(L.dir) * spd; b.vy = Math.sin(L.dir) * spd; }
        b.x += b.vx * h; b.y += b.vy * h;
        L.t += h;
        if (Math.abs(wrap(L.dir - L.dir0)) > 10 * DEG) this.mile('use:spine');
        if (L.t >= L.T - 1e-9) { b.mode = 'recover'; b.recoverT = 0; b.lunge = null; b.vx = 0; b.vy = 0; }
        return;
      }
      b.x += b.vx * h; b.y += b.vy * h;
    }

    collideBody(contacts, k) {
      const P = this.P, b = this.body, r = P['body.radius'];
      if (!b.alive) return;
      const block = () => { if (b.mode === 'lunge') b.lunge.blocked = true; };
      for (const s of this.level.statics) {
        const res = circleRect(b.x, b.y, r, s);
        if (!res) continue;
        b.x += res.nx * res.pen; b.y += res.ny * res.pen;
        const vn = b.vx * res.nx + b.vy * res.ny;
        if (vn < 0) { b.vx -= vn * res.nx; b.vy -= vn * res.ny; }
        block();
      }
      const W = P['world.width'], H = P['world.height'];
      if (b.x < r || b.x > W - r || b.y < r || b.y > H - r) { b.x = clamp(b.x, r, W - r); b.y = clamp(b.y, r, H - r); block(); }
      for (const c of this.cars) {
        const res = circleCar(b.x, b.y, r, c);
        if (!res) continue;
        c.touched = true;
        const nx = -res.nx, ny = -res.ny; // from body into car
        const rel = (b.vx - c.vx) * nx + (b.vy - c.vy) * ny;
        let knock = null;
        if (!c.inEpisode) {
          c.inEpisode = true;
          const ph = impulseImpact(P, b.vx, b.vy, c.vx, c.vy, nx, ny, c.cls);
          contacts.push({ k, car: c, closing: Math.max(0, rel), ph, px: res.cx, py: res.cy, zone: zoneOf(res.qx, res.qy, c),
            carState: this.carCue(c), cause: c.cause, lunging: b.mode === 'lunge', bodySpeed: hyp(b.vx, b.vy), carSpeed: c.v });
          if (P['proto.damageModel'] && ph.un > 1e-6) knock = ph.knock;
        }
        b.x += res.nx * res.pen; b.y += res.ny * res.pen;
        if (knock) {
          b.mode = 'knock'; b.lunge = null; b.knockT = 0; b.knockVx = knock.x; b.knockVy = knock.y; b.vx = knock.x; b.vy = knock.y;
          this.emit('knock', { car: c.id, speed: +hyp(knock.x, knock.y).toFixed(2) });
        } else if (rel > 0) { b.vx -= rel * nx; b.vy -= rel * ny; }
        block();
      }
      const rr = r + P['props.cone.radius'];
      for (const cn of this.cones) {
        if (cn.state !== 'free') continue;
        const dx = cn.x - b.x, dy = cn.y - b.y, d = hyp(dx, dy);
        if (d >= rr || d < 1e-9) continue;
        const ux = dx / d, uy = dy / d, sp = hyp(b.vx, b.vy);
        if (b.vx * ux + b.vy * uy > 1 && sp > 5) {
          const v = P['props.cone.puntDistance'] / P['props.cone.puntSeconds'];
          Object.assign(cn, { state: 'flight', vx: b.vx / sp * v, vy: b.vy / sp * v, flightT: P['props.cone.puntSeconds'], flightDur: P['props.cone.puntSeconds'], kind: 'punt' });
          this.emit('punt', { cone: cn.id });
        }
        cn.x = b.x + ux * rr; cn.y = b.y + uy * rr;
      }
    }

    moveCones(h) {
      const P = this.P, r = P['props.cone.radius'];
      for (const cn of this.cones) {
        if (cn.state !== 'free' && cn.state !== 'flight') continue;
        if (cn.state === 'flight') {
          const ox = cn.x, oy = cn.y;
          cn.x += cn.vx * h; cn.y += cn.vy * h; cn.flightT -= h;
          const hit = cn.x < r || cn.y < r || cn.x > P['world.width'] - r || cn.y > P['world.height'] - r ||
            this.level.statics.some((s) => circleRect(cn.x, cn.y, r, s)) || this.cars.some((c) => circleCar(cn.x, cn.y, r, c));
          if (hit) { cn.x = ox; cn.y = oy; cn.state = 'free'; cn.vx = cn.vy = 0; this.emit('cone-stop', { cone: cn.id }); }
          else if (cn.flightT <= 1e-9) { cn.state = 'free'; cn.vx = cn.vy = 0; this.emit('cone-rest', { cone: cn.id, x: +cn.x.toFixed(2), y: +cn.y.toFixed(2) }); }
          continue;
        }
        for (const c of this.cars) {
          const res = circleCar(cn.x, cn.y, r, c);
          if (!res) continue;
          // Cars shove cones sideways, never ahead of themselves.
          const ca = Math.cos(c.h), sa = Math.sin(c.h), dx = cn.x - c.x, dy = cn.y - c.y;
          const lx = clamp(dx * ca + dy * sa, -c.L / 2, c.L / 2), side = (-dx * sa + dy * ca) >= 0 ? 1 : -1, ly = side * (c.W / 2 + r + 1);
          cn.x = c.x + lx * ca - ly * sa; cn.y = c.y + lx * sa + ly * ca;
          this.emit('cone-struck', { cone: cn.id, car: c.id });
        }
      }
    }

    // ----- fleet (P1.1: path-following sensors, distance-based eased swerves, signalled returns)
    admit() {
      const P = this.P;
      if (this.slot >= this.schedule.length) return;
      const due = Math.max(P['run.admissionInterval'] * this.slot, this.lastAdmit + P['run.admissionInterval']);
      if (this.t + 1e-9 < due) return;
      const sl = this.schedule[this.slot], L = P['vehicles.' + sl.cls + '.length'];
      const room = L * P['traffic.entryRoomLengths'] + P['traffic.minimumGap'] + L / 2;
      if (this.cars.some((c) => c.lane === sl.lane && c.s - c.L / 2 < room)) return;
      const m = this.models[sl.cls], step = P['learning.playerHitStep'];
      const path = this.level.lanes[sl.lane];
      const c = {
        id: 'car' + (++this.carSeq), slot: sl.i, cls: sl.cls, model: m.id, lane: sl.lane, path,
        L, W: P['vehicles.' + sl.cls + '.width'], cruise: P['vehicles.' + sl.cls + '.cruiseSpeed'],
        s: L / 2, d: 0, v: P['vehicles.' + sl.cls + '.cruiseSpeed'], slope: 0,
        applied: m.applied, fwdLen: P['perception.forwardLength'] * (1 + step * m.applied),
        state: 'cruise', senseT: 0, man: null, cause: null, spent: false, inEpisode: false, touched: false,
        clearT: 0, interruptT: 0, det: { fwd: null, side: false }, intent: null, intentFor: null, signal: null, dodge: null,
        x: 0, y: 0, h: 0, vx: 0, vy: 0,
      };
      this.pose(c);
      this.cars.push(c); this.slot++; this.lastAdmit = this.t; this.run.admitted++;
      this.emit('admit', { car: c.id, cls: c.cls, model: c.model, lane: c.lane, fwdLen: +c.fwdLen.toFixed(2) });
    }
    pose(c, h) {
      const p = pathAt(c.path, c.s);
      c.x = p.x + p.nx * c.d; c.y = p.y + p.ny * c.d;
      c.vx = (p.tx + p.nx * c.slope) * c.v; c.vy = (p.ty + p.ny * c.slope) * c.v;
      const target = Math.atan2(p.ty + p.ny * c.slope, p.tx + p.nx * c.slope);
      c.h = h ? turnTo(c.h, target, this.P['proto.carYawRate'] * DEG * h) : target;
    }
    occluded(self, x0, y0, x1, y1) {
      if (this.level.statics.some((s) => segRect(x0, y0, x1, y1, s))) return true;
      return this.cars.some((c) => c !== self && c.cls === 'van' && segCar(x0, y0, x1, y1, c));
    }
    // Lateral offset the car will hold at path coordinate s under its current plan.
    plannedD(c, s) {
      const m = c.man;
      if (!m || m.type !== 'shift') return c.d;
      return m.d0 + (m.d1 - m.d0) * ease(clamp((s - m.s0) / m.len, 0, 1));
    }
    perceive(c) {
      const P = this.P, b = this.body, res = { fwd: null, side: false };
      const ca = Math.cos(c.h), sa = Math.sin(c.h), nx = c.x + ca * c.L / 2, ny = c.y + sa * c.L / 2;
      const targets = [];
      if (b.alive) targets.push({ kind: 'body', id: 'body', x: b.x, y: b.y, r: P['body.radius'] });
      for (const cn of this.cones) if (cn.state === 'free' || cn.state === 'flight') targets.push({ kind: 'cone', id: cn.id, x: cn.x, y: cn.y, r: P['props.cone.radius'] });
      for (const tg of targets) {
        const pr = pathProject(c.path, tg.x, tg.y), ahead = pr.s - c.s - c.L / 2, lat = pr.lat - c.d;
        const inFwd = ahead >= -tg.r && ahead <= c.fwdLen && Math.abs(lat) <= c.W / 2 + tg.r;
        const dx = tg.x - nx, dy = tg.y - ny, d = hyp(dx, dy), lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
        const inSide = tg.kind === 'body' && d <= P['perception.sideRadius'] && d > 1e-9 &&
          Math.acos(Math.min(1, Math.abs(ly) / d)) <= P['perception.sideHalfAngle'] * DEG && lx > -c.L;
        if (!inFwd && !inSide) continue;
        if (this.occluded(c, nx, ny, tg.x, tg.y)) continue;
        if (inFwd && (!res.fwd || ahead < res.fwd.lx)) res.fwd = Object.assign({}, tg, { lx: ahead, ly: lat, s: pr.s });
        if (inSide) res.side = true;
      }
      return res;
    }
    leadGap(c) {
      let best = null;
      const ca = Math.cos(c.h), sa = Math.sin(c.h);
      for (const o of this.cars) {
        if (o === c) continue;
        let gap = null, v = 0;
        if (o.lane === c.lane) {
          if (o.s > c.s && Math.abs(o.d - c.d) < (c.W + o.W) / 2 + 6) { gap = o.s - c.s - (c.L + o.L) / 2; v = o.v; }
        } else {
          const dx = o.x - c.x, dy = o.y - c.y, lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
          if (lx > 0 && lx < 420 && Math.abs(ly) < (c.W + o.W) / 2 + 6) { gap = lx - (c.L + o.L) / 2; v = o.vx * ca + o.vy * sa; }
        }
        if (gap != null && gap < 420 && (!best || gap < best.gap)) best = { gap, v, car: o };
      }
      return best;
    }
    // Another car in the target lateral corridor. Oncoming traffic blocks it from much further away.
    corridorBlocked(c, dShift, crosses) {
      const ca = Math.cos(c.h), sa = Math.sin(c.h);
      return this.cars.some((o) => {
        if (o === c) return false;
        const dx = o.x - c.x, dy = o.y - c.y, lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
        const oncoming = Math.cos(o.h - c.h) < -0.5;
        return lx > -c.L && lx < (oncoming && crosses ? 900 : 280) && Math.abs(ly - dShift) < (c.W + o.W) / 2 + 6;
      });
    }
    oncomingAhead(c, range) {
      const ca = Math.cos(c.h), sa = Math.sin(c.h);
      return this.cars.some((o) => {
        if (o === c || Math.cos(o.h - c.h) > -0.5) return false;
        const dx = o.x - c.x, dy = o.y - c.y, lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
        return lx > 0 && lx < range && Math.abs(ly) < (c.W + o.W) / 2 + 6;
      });
    }
    bodyBeside(c, shift) {
      const b = this.body;
      if (!b.alive) return false;
      const ca = Math.cos(c.h), sa = Math.sin(c.h), dx = b.x - c.x, dy = b.y - c.y;
      const lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
      return lx > -c.L / 2 - 40 && lx < c.L / 2 + 60 && Math.abs(ly - shift) < c.W / 2 + this.P['body.radius'] + 8;
    }
    // Smallest lateral move that clears the target and every free cone on the new route.
    // Prefer staying in lane; cross the centre line only into an empty lane.
    choose(c, tg) {
      const P = this.P, lw = P['world.laneWidth'], r = P['props.cone.radius'];
      const dMin = -lw, dMax = P['proto.swerveOuter'], need = c.W / 2 + tg.r + 4, len = P['proto.swerveLength'];
      const cones = [];
      for (const cn of this.cones) {
        if (cn.state !== 'free') continue;
        const pr = pathProject(c.path, cn.x, cn.y);
        if (pr.s > c.s - c.L && pr.s < c.s + c.L / 2 + len + 160) cones.push(pr);
      }
      const routeClear = (d1) => cones.every((pr) => [-c.L / 2, 0, c.L / 2].every((o) => {
        const d = c.d + (d1 - c.d) * ease(clamp((pr.s + o - c.s) / len, 0, 1));
        return Math.abs(pr.lat - d) >= c.W / 2 + r + 2;
      }));
      const cands = new Set([Math.min(c.d, c.d + tg.ly - need), Math.max(c.d, c.d + tg.ly + need), dMin, dMax]);
      for (let d = Math.ceil(dMin / 4) * 4; d <= dMax; d += 4) cands.add(d);
      let best = null;
      for (const d1 of cands) {
        const shift = d1 - c.d;
        if (Math.abs(shift) < 1 || d1 < dMin - 1e-9 || d1 > dMax + 1e-9) continue;
        if (Math.abs(tg.ly - shift) < need || !routeClear(d1)) continue;
        const crosses = d1 < -(lw / 2 - c.W / 2);
        if (this.corridorBlocked(c, shift, crosses)) continue;
        const cost = Math.abs(shift) + (crosses ? lw : 0);
        if (!best || cost < best.cost - 1e-9) best = { d1, cost };
      }
      if (best) return { type: 'shift', d0: c.d, d1: best.d1, len, v0: c.v };
      // Stop just short of the target, braking as late as comfort allows.
      const margin = 12 + tg.r, dist = Math.max(1, tg.lx - margin);
      const a = c.v * c.v / (2 * dist) > P['traffic.comfortBraking'] ? P['traffic.hardBraking'] : P['traffic.comfortBraking'];
      return { type: 'brake', v0: c.v, a, vTarget: 0, sStop: tg.s - c.L / 2 - margin };
    }
    manSpeed(c, man, tau, sAt) {
      const u = Math.max(0, tau - ((man.tv != null ? man.tv : man.t0) - man.t0));
      if (man.halt) return Math.max(0, man.v0 - this.P['traffic.hardBraking'] * u);
      if (man.type === 'brake' && man.sStop != null) {
        const s = sAt != null ? sAt : c.s, rem = Math.max(0, man.sStop - s);
        return Math.min(Math.max(man.v0, 0), Math.sqrt(2 * man.a * rem));
      }
      if (man.type === 'shift') return Math.min(Math.max(c.cruise, man.v0), man.v0 + this.P['traffic.acceleration'] * u);
      return Math.max(man.vTarget, man.v0 - man.a * u);
    }
    // Seconds left on a commitment: at least the horizon, and long enough to finish the swerve.
    remaining(c, m) {
      const hz = m.t0 + this.P['traffic.commitHorizon'] - this.t;
      if (m.type !== 'shift') return Math.max(0, hz);
      let s = c.s, t = 0;
      const end = m.s0 + m.len;
      while (s < end && t < 8) { s += this.manSpeed(c, m, this.t - m.t0 + t) * 0.02; t += 0.02; }
      return Math.max(hz, t);
    }
    commit(c, man, cause, tg) {
      const m = Object.assign({}, man);
      m.t0 = this.t; m.tv = this.t; m.halt = false;
      if (m.type === 'shift') { m.s0 = c.s; m.d0 = c.d; m.v0 = c.v; }
      else m.v0 = c.v;
      m.until = this.t + this.remaining(c, m);
      c.man = m; c.state = 'committed'; c.cause = cause; c.intent = null; c.intentFor = null; c.signal = null;
      if (tg) c.dodge = { s: tg.s, id: tg.id };
      this.emit('commit', { car: c.id, man: m.type, cause, d1: m.d1 != null ? +m.d1.toFixed(2) : null });
    }
    obstacleAhead(c) {
      const P = this.P, r = P['props.cone.radius'];
      const stop = c.v * c.v / (2 * P['traffic.comfortBraking']) + P['traffic.minimumGap'] + 4;
      const ahead = this.leadGap(c);
      if (ahead && ahead.gap < stop + Math.max(0, -ahead.v) * 0.3) return 'car';
      for (const cn of this.cones) {
        if (cn.state !== 'free') continue;
        const pr = pathProject(c.path, cn.x, cn.y), ds = pr.s - c.s - c.L / 2;
        if (ds > 0 && ds < stop + r && Math.abs(pr.lat - this.plannedD(c, pr.s)) < c.W / 2 + r + 1) return 'cone';
      }
      return null;
    }
    blockingCone(c) {
      const r = this.P['props.cone.radius'];
      let best = null;
      for (const cn of this.cones) {
        if (cn.state !== 'free') continue;
        const pr = pathProject(c.path, cn.x, cn.y), ds = pr.s - c.s - c.L / 2;
        if (ds > -r && ds < 70 && Math.abs(pr.lat - this.plannedD(c, pr.s)) < c.W / 2 + r + 2 && (!best || ds < best.ds)) best = { cn, ds };
      }
      return best && best.cn;
    }
    // ----- maintenance drones
    dispatchDrone(cn) {
      const P = this.P, hx = P['world.width'] + 80, hy = -80;
      this.drones.push({ id: 'drone' + (++this.droneSeq), cone: cn.id, x: hx, y: hy, hx, hy, alt: 1, state: 'inbound', t: 0, target: null });
      this.emit('drone-dispatch', { cone: cn.id });
    }
    droneTarget(cn) {
      const homes = [{ x: cn.hx, y: cn.hy }, ...this.level.coneHomes.map((h) => ({ x: h[0], y: h[1] }))
        .sort((a, b) => hyp(a.x - cn.hx, a.y - cn.hy) - hyp(b.x - cn.hx, b.y - cn.hy))];
      return homes.find((h) => this.coneSpotValid(h.x, h.y, cn)) || null;
    }
    stepDrones(dt) {
      const P = this.P, spd = P['proto.droneSpeed'], lift = P['proto.droneLiftSeconds'];
      const fly = (d, x, y) => { const dx = x - d.x, dy = y - d.y, l = hyp(dx, dy), st = spd * dt; if (l <= st) { d.x = x; d.y = y; return true; } d.x += dx / l * st; d.y += dy / l * st; return false; };
      for (const d of this.drones) {
        const cn = this.cones.find((c) => c.id === d.cone);
        if (d.state === 'inbound') {
          if (!cn || cn.state !== 'free') { d.state = 'outbound'; continue; }
          if (fly(d, cn.x, cn.y)) { d.state = 'lift'; d.t = 0; }
        } else if (d.state === 'lift') {
          if (cn.state !== 'free') { d.state = 'outbound'; d.alt = 1; continue; }
          d.t += dt; d.alt = 1 - 0.6 * Math.sin(Math.PI * Math.min(1, d.t / lift));
          if (d.t >= lift) {
            d.target = this.droneTarget(cn);
            if (!d.target) { d.state = 'outbound'; d.alt = 1; continue; }
            cn.state = 'drone'; d.state = 'carry'; d.alt = 1;
            this.emit('drone-pickup', { cone: cn.id });
          }
        } else if (d.state === 'carry') {
          cn.x = d.x; cn.y = d.y;
          if (fly(d, d.target.x, d.target.y)) { cn.x = d.x; cn.y = d.y; d.state = 'drop'; d.t = 0; }
        } else if (d.state === 'drop') {
          d.t += dt; d.alt = 1 - 0.6 * Math.sin(Math.PI * Math.min(1, d.t / lift));
          if (d.t >= lift) {
            const tg = d.target; d.target = null;
            if (this.coneSpotValid(tg.x, tg.y, cn)) {
              Object.assign(cn, { x: tg.x, y: tg.y, vx: 0, vy: 0, state: 'free' });
              this.emit('drone-drop', { cone: cn.id, x: tg.x, y: tg.y }); d.state = 'outbound'; d.alt = 1;
            } else { d.target = this.droneTarget(cn); d.state = d.target ? 'carry' : 'drop'; d.t = 0; if (!d.target) d.target = tg; }
          }
        } else if (d.state === 'outbound') {
          if (fly(d, d.hx, d.hy)) d.state = 'gone';
        }
      }
      this.drones = this.drones.filter((d) => d.state !== 'gone');
    }
    carAI(dt) {
      const P = this.P;
      for (const c of this.cars) {
        const det = this.perceive(c);
        c.det = det;
        c.senseT = det.fwd ? c.senseT + dt : 0;
        // blocked by a cone: honk, then call a FARSIGHT drone
        const blk = c.v < 2 ? this.blockingCone(c) : null;
        c.blockT = blk ? (c.blockT || 0) + dt : 0;
        if (!blk) c.honking = false;
        else if (c.blockT >= P['proto.honkSeconds'] - 1e-9) {
          if (!c.honking) { c.honking = true; this.emit('honk', { car: c.id, cone: blk.id }); }
          if (!this.drones.some((d) => d.cone === blk.id)) this.dispatchDrone(blk);
        }
        // finish or extend the current commitment
        if (c.man && c.state !== 'interrupted') {
          const m = c.man, swerveDone = m.type !== 'shift' || c.s >= m.s0 + m.len - 1e-6;
          if (swerveDone && this.t >= m.t0 + P['traffic.commitHorizon'] - 1e-9) {
            if (m.type === 'shift') { c.d = m.d1; c.slope = 0; }
            c.man = null; c.state = 'released'; c.releasedT = this.t;
            this.emit('release', { car: c.id });
          } else m.until = this.t + this.remaining(c, m);
        }
        // safety interruption inside a commitment
        if (c.man && c.state === 'committed') {
          const ob = this.obstacleAhead(c);
          if (ob) {
            c.state = 'interrupted'; c.interruptT = this.t; c.clearT = 0;
            Object.assign(c.man, { halt: true, v0: c.v, tv: this.t, until: Infinity });
            this.emit('interrupt', { car: c.id, by: ob });
          }
        }
        if (c.state === 'interrupted') {
          const ob = this.obstacleAhead(c);
          c.clearT = ob ? 0 : c.clearT + dt;
          if (c.clearT > 0.3) {
            Object.assign(c.man, { halt: false, v0: c.v, tv: this.t });
            if (c.man.type === 'brake') { c.man = null; c.state = 'cruise'; }
            else { c.state = 'committed'; c.man.until = this.t + this.remaining(c, c.man); }
            this.emit('resume', { car: c.id });
          } else if (ob === 'cone' && c.v < 1 && this.t - c.interruptT > 1 && det.fwd) {
            const plan = this.choose(c, det.fwd);
            if (plan.type === 'shift') { c.man = null; this.commit(c, plan, 'cone', det.fwd); }
          }
          continue;
        }
        if (c.man) continue;
        let holdSpeed = false;
        const lw = P['world.laneWidth'];
        const urgent = Math.abs(c.d) > lw / 2 && this.oncomingAhead(c, 420);
        const passed = !c.dodge || c.s - c.L / 2 > c.dodge.s + P['proto.returnClearance'];
        const canReturn = Math.abs(c.d) > 0.5 && !this.bodyBeside(c, -c.d) &&
          (urgent || (!det.fwd && passed && !this.corridorBlocked(c, -c.d)));
        if (canReturn) {
          c.intentFor = null;
          if (c.signal == null || !c.intent || !c.intent.ret) { c.signal = this.t; c.intent = { type: 'shift', d0: c.d, d1: 0, len: P['proto.swerveLength'], v0: c.v, ret: true }; }
          if (this.t - c.signal >= P['proto.returnSignalSeconds'] - 1e-9) { const plan = c.intent; c.dodge = null; this.commit(c, plan, urgent ? 'yield' : 'return', null); continue; }
          c.state = 'intention'; holdSpeed = true;
        } else if (det.fwd) {
          c.signal = null;
          if (!c.intent || c.intentFor !== det.fwd.id || c.intent.ret) { c.intent = this.choose(c, det.fwd); c.intentFor = det.fwd.id; }
          if (c.senseT >= P['perception.reactionDelay'] - 1e-9) { this.commit(c, c.intent, det.fwd.kind === 'body' ? 'body' : 'cone', det.fwd); continue; }
          c.state = 'intention';
        } else {
          c.signal = null; c.intent = null; c.intentFor = null;
          c.state = c.state === 'released' && this.t - c.releasedT < 0.25 ? 'released' : 'cruise';
        }
        // speed control
        let vT = c.cruise;
        if (det.side && !holdSpeed) vT = Math.min(vT, c.cruise * P['proto.sideSlowFraction']);
        const ahead = this.leadGap(c);
        if (ahead) {
          const need = P['traffic.minimumGap'] + P['traffic.timeGap'] * c.v;
          if (ahead.gap < need) vT = Math.min(vT, Math.max(0, ahead.v) * clamp(ahead.gap / need, 0, 1));
          if (ahead.gap < P['traffic.minimumGap']) vT = 0;
        }
        if (c.v < vT) c.v = Math.min(vT, c.v + P['traffic.acceleration'] * dt);
        else {
          const hard = ahead && ahead.gap < P['traffic.minimumGap'] + c.v * c.v / (2 * P['traffic.comfortBraking']);
          c.v = Math.max(vT, c.v - (hard ? P['traffic.hardBraking'] : P['traffic.comfortBraking']) * dt);
        }
      }
    }
    moveCars(h, ts) {
      for (const c of this.cars) {
        if (c.man) c.v = this.manSpeed(c, c.man, ts - c.man.t0);
        c.s += c.v * h;
        c.slope = 0;
        if (c.man && c.man.type === 'shift') {
          const m = c.man, f = clamp((c.s - m.s0) / m.len, 0, 1);
          c.d = m.d0 + (m.d1 - m.d0) * ease(f);
          c.slope = f > 0 && f < 1 ? (m.d1 - m.d0) * easeD(f) / m.len : 0;
        }
        this.pose(c, h);
      }
    }
    // Predicted path for a manoeuvre (render helper). Swerves are fixed in space.
    predict(c, man, from, until) {
      const pts = [], m = man;
      if (!m) return pts;
      const t0 = m.t0 != null ? m.t0 : from, s0 = m.s0 != null ? m.s0 : c.s, d0 = m.d0 != null ? m.d0 : c.d;
      let s = c.s, t = from;
      const end = Math.min(until, from + 3);
      while (t <= end + 1e-9) {
        const d = m.type === 'shift' ? d0 + (m.d1 - d0) * ease(clamp((s - s0) / m.len, 0, 1)) : c.d;
        const p = pathAt(c.path, s);
        pts.push({ x: p.x + p.nx * d, y: p.y + p.ny * d, h: Math.atan2(p.ty, p.tx) });
        s += this.manSpeed(c, m, t - t0, s) * 0.05; t += 0.05;
      }
      return pts;
    }
    carCue(c) {
      if (c.state === 'committed' && c.man) {
        const P = this.P, rem = c.man.until - this.t;
        return rem < P['movement.lungeDuration'] + P['movement.lungeRecovery'] ? 'expiring' : 'committed';
      }
      return c.state;
    }
    signalSide(c) {
      const m = c.state === 'intention' ? c.intent : c.man;
      if (!m || m.type !== 'shift') return 0;
      if (c.man === m && c.s >= m.s0 + m.len) return 0;
      return Math.sign(m.d1 - (m.d0 != null ? m.d0 : c.d));
    }
    exitCars() {
      this.cars = this.cars.filter((c) => {
        if (c.s - c.L / 2 <= c.path.length) return true;
        this.run.exited++; this.emit('exit', { car: c.id, spent: c.spent });
        return false;
      });
    }

    // ----- accounting
    account(contacts) {
      const P = this.P;
      contacts.sort((a, b) => a.k - b.k || (a.car.id < b.car.id ? -1 : a.car.id > b.car.id ? 1 : 0));
      let positive = false;
      for (const ct of contacts) {
        const b = this.body, c = ct.car;
        if (!b.alive) { this.emit('contact-ignored', { car: c.id }); continue; }
        if (c.spent) { this.emit('touch-spent', { car: c.id }); this.effects.push({ type: 'touch', x: ct.px, y: ct.py, t: this.t }); continue; }
        const { raw, assessed } = P['proto.damageModel'] ? ct.ph : assess(P, ct.closing, ct.zone, c.cls);
        if (raw <= 1e-9) { this.emit('touch', { car: c.id, closing: 0 }); continue; }
        const lost = Math.min(b.health, assessed);
        b.health = Math.max(0, b.health - lost);
        c.spent = true;
        this.run.points += assessed;
        const bait = ct.carState === 'committed' || ct.carState === 'expiring' || ct.carState === 'interrupted';
        let learned = null;
        if (P['proto.learningEnabled'] && lost > 0) {
          const m = this.models[c.cls], cap = Math.round(P['learning.playerHitCap'] / P['learning.playerHitStep']);
          if (m.applied < cap) { m.applied++; learned = m.applied; }
        }
        const ev = { car: c.id, model: c.model, cls: c.cls, zone: ct.zone, closing: +ct.closing.toFixed(3),
          angle: +ct.ph.angle.toFixed(1), dv: +ct.ph.dvd.toFixed(2), strike: +ct.ph.un.toFixed(2),
          raw: +raw.toFixed(3), assessed: +assessed.toFixed(3), lost: +lost.toFixed(3), health: +b.health.toFixed(3),
          carState: ct.carState, cause: ct.cause, bait, lunging: ct.lunging, learned };
        this.emit('impact', ev); b.hits.push(ev);
        this.effects.push({ type: 'burst', x: ct.px, y: ct.py, v: assessed, t: this.t, zone: ct.zone, angle: ct.ph.angle });
        this.mile('firstHit');
        if (bait) this.mile('firstBaitHit');
        if (ct.cause === 'cone' && bait) this.mile('firstConeAssistHit');
        positive = true;
        if (b.health <= 0) this.writeOff();
      }
      return positive;
    }
    writeOff() {
      const P = this.P, b = this.body;
      b.alive = false; b.mode = 'dead'; b.vx = b.vy = 0;
      this.run.writeOffs++; this.run.points += P['rewards.writeOff'];
      this.releaseHeldAtDeath();
      this.emit('writeoff', { chassis: b.chassis, writeOffs: this.run.writeOffs });
      this.mile('firstWriteOff');
      this.effects.push({ type: 'wreck', x: b.x, y: b.y, t: this.t, facing: b.facing });
    }
    end(kind) {
      const r = this.run;
      r.ending = { kind, t: +this.t.toFixed(3), writeOffs: r.writeOffs, points: Math.round(r.points), purchases: r.purchases.slice() };
      this.emit('ending', { kind });
      this.mile('ending', { kind });
      if (!this.body.alive && kind !== 'Non-compliant') {
        this.phase = 'writeoff'; this.phaseT = this.P['feedback.writeOffSeconds']; this.pendingPhase = 'ending';
      } else this.phase = 'ending';
    }
    checkTerminal() {
      const P = this.P, r = this.run;
      if (r.ending) return;
      if (r.writeOffs >= P['run.quota.road']) return this.end('Licensed');
      if (this.slot >= this.schedule.length && this.cars.every((c) => c.spent)) return this.end('Failed test');
      if (!this.body.alive) {
        r.credits++;
        const b = this.body;
        this.report = { chassis: b.chassis, hits: b.hits.slice(), points: Math.round(r.points - b.points0), credits: r.credits };
        this.emit('credit', { credits: r.credits });
        this.phase = 'writeoff'; this.phaseT = P['feedback.writeOffSeconds']; this.pendingPhase = 'report';
      }
    }

    trackUse() {
      const b = this.body;
      if (!b.alive || !this.has('hips')) return;
      this.turnHist.push(b.facing);
      if (this.turnHist.length > 16) this.turnHist.shift();
      let sum = 0;
      for (let i = 1; i < this.turnHist.length; i++) sum += Math.abs(wrap(this.turnHist[i] - this.turnHist[i - 1]));
      if (this.turnHist.length >= 16 && sum > 50 * DEG) this.mile('use:hips');
    }

    // ----- public step
    step(cmd) {
      const P = this.P, dt = 1 / P['simulation.tickRate'];
      cmd = cmd || {};
      if (this.phase === 'hitstop' || this.phase === 'writeoff') {
        this.phaseT -= dt;
        if (this.phaseT <= 1e-9) this.phase = this.phase === 'hitstop' ? 'play' : this.pendingPhase;
        return;
      }
      if (this.phase !== 'play') return;
      this.tick++; this.t += dt;
      this.admit();
      this.carAI(dt);
      for (const c of this.cars) c.touched = false;
      this.bodyControl(cmd, dt);
      const N = Math.max(1, Math.round(P['proto.substeps'])), h = dt / N, contacts = [];
      for (let k = 0; k < N; k++) {
        const ts = this.t - dt + (k + 1) * h;
        this.moveCars(h, ts);
        this.moveBody(h);
        this.collideBody(contacts, k);
        this.moveCones(h);
      }
      for (const c of this.cars) if (!c.touched) c.inEpisode = false;
      const positive = this.account(contacts);
      this.retryPending();
      this.stepDrones(dt);
      this.exitCars();
      this.trackUse();
      this.checkTerminal();
      if (this.phase === 'play' && positive && P['feedback.hitStop'] > 0) { this.phase = 'hitstop'; this.phaseT = P['feedback.hitStop']; }
      this.effects = this.effects.filter((e) => this.t - e.t < 1.5);
    }

    // ----- menus
    continueReport() { if (this.phase === 'report') { this.phase = 'shop'; this.emit('shop-open', { credits: this.run.credits }); } }
    canBuy(n) {
      const node = NODES[n], r = this.run;
      if (!node || r.owned[n]) return { ok: false, why: 'owned' };
      if (node.pre && !r.owned[node.pre]) return { ok: false, why: 'needs ' + NODES[node.pre].name };
      const price = this.P[node.price];
      if (r.credits < price) return { ok: false, why: 'short by ' + (price - r.credits) };
      return { ok: true, price };
    }
    buy(n) {
      if (this.phase !== 'shop') return { ok: false, why: 'shop closed' };
      const chk = this.canBuy(n);
      if (!chk.ok) { this.emit('purchase-denied', { node: n, why: chk.why }); return chk; }
      this.run.credits -= chk.price; this.run.owned[n] = true; this.run.purchases.push(n);
      this.emit('purchase', { node: n, price: chk.price, credits: this.run.credits });
      this.mile('firstPurchase', { node: n });
      return chk;
    }
    leaveShop() {
      if (this.phase !== 'shop') return;
      this.spawnBody(); this.phase = 'play'; this.report = null;
    }
    withdraw() {
      if (this.run.writeOffs < 1 || this.run.ending) return false;
      this.end('Non-compliant');
      return true;
    }
    trace() {
      return { build: 'dummies-p1', level: this.levelId, params: this.P, run: this.run, milestones: this.milestones,
        models: this.models, events: this.events };
    }
  }

  const api = { Sim, REG, PROTO, OVERRIDES, NODES, LEVELS, LEVEL_LIST, assess, impulseImpact, zoneOf, circleCar, pathAt, pathProject, DEG };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DUMMIES = api;
})(typeof window !== 'undefined' ? window : globalThis);
