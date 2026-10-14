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
    'proto.swerveSeconds': 0.6, 'proto.swerveOuter': 30, 'proto.shoulderWidth': 24,
    'proto.sideSlowFraction': 0.6, 'proto.substeps': 4,
    'proto.learningEnabled': 0, 'proto.zonesEverywhere': 0,
  };

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
  function arcPts(cx, cy, r, a0, a1, n) {
    const out = [];
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return out;
  }

  // ---------- levels (world units; 800 × 600 field)
  const LEVELS = {
    straight: {
      name: 'L1 Straight', blurb: 'Open two-way road. Learn to bait and lunge.',
      center: () => [[-200, 300], [1000, 300]],
      statics: [{ x: 160, y: 120, w: 44, h: 32, kind: 'crate' }, { x: 580, y: 450, w: 44, h: 32, kind: 'crate' }],
      cones: [[120, 232], [300, 368], [520, 232], [690, 368]],
      spawns: [{ x: 400, y: 480, f: -90 }, { x: 160, y: 480, f: -90 }, { x: 640, y: 480, f: -90 }, { x: 400, y: 120, f: 90 }],
    },
    barrier: {
      name: 'L2 Barrier', blurb: 'Hide behind the barrier. Ambush through the gaps.',
      center: () => [[-200, 300], [1000, 300]],
      statics: [
        { x: 0, y: 388, w: 250, h: 12, kind: 'barrier' }, { x: 290, y: 388, w: 220, h: 12, kind: 'barrier' },
        { x: 550, y: 388, w: 250, h: 12, kind: 'barrier' },
        { x: 120, y: 150, w: 44, h: 32, kind: 'crate' }, { x: 420, y: 140, w: 44, h: 32, kind: 'crate' },
        { x: 660, y: 160, w: 44, h: 32, kind: 'crate' },
      ],
      cones: [[90, 232], [270, 368], [400, 232], [530, 368], [720, 232]],
      spawns: [{ x: 400, y: 500, f: -90 }, { x: 140, y: 500, f: -90 }, { x: 660, y: 500, f: -90 }, { x: 300, y: 110, f: 90 }],
    },
    corner: {
      name: 'L3 Corner', blurb: 'A right-angle bend. Read curved approaches.',
      center: () => [[-200, 440], [450, 440], ...arcPts(450, 340, 100, Math.PI / 2, 0, 24).slice(1), [550, -200]],
      statics: [{ x: 290, y: 270, w: 44, h: 32, kind: 'crate' }, { x: 360, y: 180, w: 44, h: 32, kind: 'crate' },
        { x: 680, y: 500, w: 44, h: 32, kind: 'crate' }],
      cones: [[200, 372], [320, 508], [618, 200], [482, 120]],
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
  function assess(P, closing, zone, cls) {
    const raw = P['damage.baseImpact'] * P['damage.zone.' + zone] * P['vehicles.' + cls + '.mass'] *
      closing / P['damage.referenceSpeed'];
    return { raw, assessed: Math.min(raw, P['damage.bodyHealth']) };
  }

  // ---------- simulation
  class Sim {
    constructor(levelId, overrides) {
      this.P = Object.assign({}, REG, PROTO, overrides || {});
      this.levelId = levelId;
      this.level = buildLevel(levelId, this.P);
      this.reset();
    }

    reset() {
      const P = this.P;
      this.t = 0; this.tick = 0; this.phase = 'play'; this.phaseT = 0; this.pendingPhase = null;
      this.cars = []; this.carSeq = 0; this.slot = 0; this.lastAdmit = -1e9;
      const pat = ['sedan', 'van', 'sedan', 'sedan', 'van'];
      this.schedule = Array.from({ length: P['run.appearances.road'] }, (_, i) => ({ i, cls: pat[i % 5], lane: i % 2 }));
      this.cones = this.level.coneHomes.map((c, i) => ({ id: 'cone' + (i + 1), x: c[0], y: c[1], vx: 0, vy: 0, state: 'free', flightT: 0 }));
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
      return P['movement.lungeDistance'] * Math.max(P['movement.wearFloor'], b.health / P['damage.bodyHealth']);
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
      return !this.cones.some((c) => c !== ignore && c.state !== 'held' && c.state !== 'pending' && hyp(c.x - x, c.y - y) < 2 * r);
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
      Object.assign(cn, { x: p.x, y: p.y, vx, vy, state: 'flight', flightT: T, kind: 'throw', fx: p.x, fy: p.y });
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
        if (!c.inEpisode) {
          c.inEpisode = true;
          contacts.push({ k, car: c, closing: Math.max(0, rel), px: res.cx, py: res.cy, zone: zoneOf(res.qx, res.qy, c),
            carState: this.carCue(c), cause: c.cause, lunging: b.mode === 'lunge', bodySpeed: hyp(b.vx, b.vy), carSpeed: c.v });
        }
        b.x += res.nx * res.pen; b.y += res.ny * res.pen;
        if (rel > 0) { b.vx -= rel * nx; b.vy -= rel * ny; }
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
          Object.assign(cn, { state: 'flight', vx: b.vx / sp * v, vy: b.vy / sp * v, flightT: P['props.cone.puntSeconds'], kind: 'punt' });
          this.emit('punt', { cone: cn.id });
        }
        cn.x = b.x + ux * rr; cn.y = b.y + uy * rr;
      }
    }

    moveCones(h) {
      const P = this.P, r = P['props.cone.radius'];
      for (const cn of this.cones) {
        if (cn.state === 'held' || cn.state === 'pending') continue;
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
          if (res) { cn.x += res.nx * (res.pen + 0.5); cn.y += res.ny * (res.pen + 0.5); if (!cn.struck) this.emit('cone-struck', { cone: cn.id, car: c.id }); cn.struck = true; }
        }
      }
    }

    // ----- fleet
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
        s: L / 2, d: 0, v: P['vehicles.' + sl.cls + '.cruiseSpeed'], dd: 0,
        applied: m.applied, fwdLen: P['perception.forwardLength'] * (1 + step * m.applied),
        state: 'cruise', senseT: 0, man: null, cause: null, spent: false, inEpisode: false, touched: false,
        clearT: 0, interruptT: 0, det: { fwd: null, side: false }, intent: null, x: 0, y: 0, h: 0, vx: 0, vy: 0,
      };
      this.pose(c, 0);
      this.cars.push(c); this.slot++; this.lastAdmit = this.t; this.run.admitted++;
      this.emit('admit', { car: c.id, cls: c.cls, model: c.model, lane: c.lane, fwdLen: +c.fwdLen.toFixed(2) });
    }
    pose(c, dd) {
      const p = pathAt(c.path, c.s);
      c.x = p.x + p.nx * c.d; c.y = p.y + p.ny * c.d;
      c.vx = p.tx * c.v + p.nx * dd; c.vy = p.ty * c.v + p.ny * dd; c.dd = dd;
      c.h = hyp(c.vx, c.vy) > 1 ? Math.atan2(c.vy, c.vx) : Math.atan2(p.ty, p.tx);
      c.tx = p.tx; c.ty = p.ty;
    }
    occluded(self, x0, y0, x1, y1) {
      if (this.level.statics.some((s) => segRect(x0, y0, x1, y1, s))) return true;
      return this.cars.some((c) => c !== self && c.cls === 'van' && segCar(x0, y0, x1, y1, c));
    }
    perceive(c) {
      const P = this.P, b = this.body, res = { fwd: null, side: false };
      const ca = Math.cos(c.h), sa = Math.sin(c.h), nx = c.x + ca * c.L / 2, ny = c.y + sa * c.L / 2;
      const halfW = (c.W + 2 * P['body.radius']) / 2;
      const targets = [];
      if (b.alive) targets.push({ kind: 'body', id: 'body', x: b.x, y: b.y, r: P['body.radius'] });
      for (const cn of this.cones) if (cn.state === 'free' || cn.state === 'flight') targets.push({ kind: 'cone', id: cn.id, x: cn.x, y: cn.y, r: P['props.cone.radius'] });
      for (const tg of targets) {
        const dx = tg.x - nx, dy = tg.y - ny, lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
        const inFwd = lx >= -tg.r && lx <= c.fwdLen && Math.abs(ly) <= halfW;
        const d = hyp(dx, dy);
        const inSide = tg.kind === 'body' && d <= P['perception.sideRadius'] && d > 1e-9 &&
          Math.acos(Math.min(1, Math.abs(ly) / d)) <= P['perception.sideHalfAngle'] * DEG && lx > -c.L;
        if (!inFwd && !inSide) continue;
        if (this.occluded(c, nx, ny, tg.x, tg.y)) continue;
        if (inFwd && (!res.fwd || lx < res.fwd.lx)) res.fwd = Object.assign({}, tg, { lx, ly });
        if (inSide) res.side = true;
      }
      return res;
    }
    leadGap(c) {
      let best = null;
      for (const o of this.cars) {
        if (o === c) continue;
        const ca = Math.cos(c.h), sa = Math.sin(c.h), dx = o.x - c.x, dy = o.y - c.y;
        const lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
        if (lx <= 0 || lx > 420 || Math.abs(ly) > (c.W + o.W) / 2 + 6) continue;
        const gap = lx - c.L / 2 - o.L / 2;
        if (!best || gap < best.gap) best = { gap, v: o.vx * ca + o.vy * sa, car: o };
      }
      return best;
    }
    corridorBlocked(c, dShift) {
      const ca = Math.cos(c.h), sa = Math.sin(c.h);
      return this.cars.some((o) => {
        if (o === c) return false;
        const dx = o.x - c.x, dy = o.y - c.y, lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
        return lx > -c.L && lx < 280 && Math.abs(ly - dShift) < (c.W + o.W) / 2 + 6;
      });
    }
    bodyBeside(c, shift) {
      const b = this.body;
      if (!b.alive) return false;
      const ca = Math.cos(c.h), sa = Math.sin(c.h), dx = b.x - c.x, dy = b.y - c.y;
      const lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
      return lx > -c.L / 2 - 40 && lx < c.L / 2 + 60 && Math.abs(ly - shift) < c.W / 2 + this.P['body.radius'] + 8;
    }
    choose(c, tg) {
      const P = this.P, lw = P['world.laneWidth'];
      const dMin = -lw, dMax = P['proto.swerveOuter'];
      const need = c.W / 2 + tg.r + 4, away = tg.ly >= 0 ? -1 : 1;
      for (const dir of [away, -away]) {
        const d1 = clamp(c.d + dir * lw, dMin, dMax), shift = d1 - c.d;
        if (Math.abs(shift) < 8 || Math.abs(tg.ly - shift) < need) continue;
        if (this.corridorBlocked(c, shift)) continue;
        return { type: 'shift', d0: c.d, d1, dur: P['proto.swerveSeconds'], v0: c.v };
      }
      const dist = Math.max(1, tg.lx - 6);
      const a = c.v * c.v / (2 * dist) > P['traffic.comfortBraking'] ? P['traffic.hardBraking'] : P['traffic.comfortBraking'];
      return { type: 'brake', v0: c.v, a, vTarget: 0 };
    }
    commit(c, man, cause) {
      const P = this.P;
      man.t0 = this.t;
      man.until = this.t + Math.max(man.dur || 0, P['traffic.commitHorizon']);
      c.man = man; c.state = 'committed'; c.cause = cause; c.intent = null;
      this.emit('commit', { car: c.id, man: man.type, cause, d1: man.d1 != null ? +man.d1.toFixed(2) : null });
    }
    obstacleAhead(c) {
      const P = this.P, ca = Math.cos(c.h), sa = Math.sin(c.h);
      const stop = c.v * c.v / (2 * P['traffic.comfortBraking']) + P['traffic.minimumGap'] + 4;
      const ahead = this.leadGap(c);
      if (ahead && ahead.gap < stop + Math.max(0, -ahead.v) * 0.3) return 'car';
      const r = P['props.cone.radius'];
      for (const cn of this.cones) {
        if (cn.state !== 'free') continue;
        const dx = cn.x - c.x, dy = cn.y - c.y, lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
        if (lx > c.L / 2 && lx < c.L / 2 + stop + r && Math.abs(ly) < c.W / 2 + r + 1) return 'cone';
      }
      return null;
    }
    carAI(dt) {
      const P = this.P;
      for (const c of this.cars) {
        const det = this.perceive(c);
        c.det = det;
        c.senseT = det.fwd ? c.senseT + dt : 0;
        if (c.man && c.state !== 'interrupted' && this.t >= c.man.until - 1e-9) {
          if (c.man.type === 'shift') c.d = c.man.d1;
          c.man = null; c.state = 'released'; c.releasedT = this.t;
          this.emit('release', { car: c.id });
        }
        // safety interruption inside a commitment
        if (c.man && c.state === 'committed') {
          const ob = this.obstacleAhead(c);
          if (ob) {
            c.state = 'interrupted'; c.interruptT = this.t; c.clearT = 0;
            c.man = { type: 'brake', v0: c.v, a: P['traffic.hardBraking'], vTarget: 0, t0: this.t, until: Infinity, interrupted: true };
            this.emit('interrupt', { car: c.id, by: ob });
          }
        }
        if (c.state === 'interrupted') {
          const ob = this.obstacleAhead(c);
          c.clearT = ob ? 0 : c.clearT + dt;
          const stuck = this.t - c.interruptT > P['traffic.deadlockTimeout'];
          if (c.clearT > 0.3 || (stuck && Math.abs(c.d) > P['world.laneWidth'] / 2)) {
            c.man = null; c.state = 'cruise'; this.emit('resume', { car: c.id, stuck });
            if (stuck) this.commit(c, { type: 'shift', d0: c.d, d1: 0, dur: P['proto.swerveSeconds'], v0: c.v }, 'recovery');
          }
          continue;
        }
        if (c.man) continue;
        // plan
        if (det.fwd && c.senseT >= P['perception.reactionDelay'] - 1e-9) {
          this.commit(c, this.choose(c, det.fwd), det.fwd.kind === 'body' ? 'body' : 'cone');
          continue;
        }
        c.intent = det.fwd ? this.choose(c, det.fwd) : null;
        if (det.fwd) c.state = 'intention';
        else if (c.state === 'released' && this.t - c.releasedT < 0.25) { /* show released briefly */ }
        else c.state = 'cruise';
        if (!det.fwd && Math.abs(c.d) > 0.5 && this.t - (c.releasedT || 0) > 0.4 && !this.corridorBlocked(c, -c.d) && !this.bodyBeside(c, -c.d)) {
          this.commit(c, { type: 'shift', d0: c.d, d1: 0, dur: P['proto.swerveSeconds'], v0: c.v }, 'return');
          continue;
        }
        // speed control
        let vT = c.cruise;
        if (det.side) vT = Math.min(vT, c.cruise * P['proto.sideSlowFraction']);
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
    manSpeed(c, man, tau) {
      if (man.type === 'shift') return Math.min(Math.max(c.cruise, man.v0), man.v0 + this.P['traffic.acceleration'] * tau);
      return Math.max(man.vTarget, man.v0 - man.a * tau);
    }
    moveCars(h, ts) {
      for (const c of this.cars) {
        let dd = 0;
        if (c.man) {
          const m = c.man, tau = Math.max(0, ts - m.t0);
          c.v = this.manSpeed(c, m, tau);
          if (m.type === 'shift') {
            const dNew = m.d0 + (m.d1 - m.d0) * clamp(tau / m.dur, 0, 1);
            dd = (dNew - c.d) / h; c.d = dNew;
          }
        }
        c.s += c.v * h;
        this.pose(c, dd);
      }
    }
    // Predicted path for a manoeuvre (render helper).
    predict(c, man, from, until) {
      const pts = [], m = man;
      if (!m) return pts;
      let s = c.s, t = from;
      const end = Math.min(until, from + 2.5), step = 0.05, t0 = m.t0 != null ? m.t0 : from;
      while (t <= end + 1e-9) {
        const tau = t - t0, v = this.manSpeed(c, m, Math.max(0, tau));
        const d = m.type === 'shift' ? m.d0 + (m.d1 - m.d0) * clamp(tau / m.dur, 0, 1) : c.d;
        const p = pathAt(c.path, s);
        pts.push({ x: p.x + p.nx * d, y: p.y + p.ny * d, h: Math.atan2(p.ty, p.tx) });
        s += v * step; t += step;
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
        const { raw, assessed } = assess(P, ct.closing, ct.zone, c.cls);
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
          raw: +raw.toFixed(3), assessed: +assessed.toFixed(3), lost: +lost.toFixed(3), health: +b.health.toFixed(3),
          carState: ct.carState, cause: ct.cause, bait, lunging: ct.lunging, learned };
        this.emit('impact', ev); b.hits.push(ev);
        this.effects.push({ type: 'burst', x: ct.px, y: ct.py, v: assessed, t: this.t, zone: ct.zone });
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

  const api = { Sim, REG, PROTO, NODES, LEVELS, LEVEL_LIST, assess, zoneOf, circleCar, pathAt, DEG };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DUMMIES = api;
})(typeof window !== 'undefined' ? window : globalThis);
