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
    'battery.capacity': 2, 'battery.secondsPerCharge': 0.8, 'battery.refillDelaySeconds': 0.3, 'battery.lungeCost': 1,
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
    // Presentation (GDD §4.2.3 legibility budget; Edit 37 §4.1.3 pixel grid). Reference units: 1280 × 720 canvas.
    'ui.playWidth': 800, 'ui.playHeight': 600, 'ui.typeLoadBearing': 24, 'ui.typeSecondary': 16, 'ui.typeTexture': 9,
    'ui.artScale': 3,
    // Edit 40 (20 Oct): Big battery (D26), surfaces (D18), districts (D24), city targets (7.9 clause 6).
    'upgrades.bigCapacity': 3, 'economy.price.battery': 1, 'movement.lowGripStopMultiplier': 2.5,
    'world.terrain.puddle.dummySpeed': 0.9, 'world.terrain.puddle.lunge': 0, 'world.terrain.puddle.grip': 'low', 'world.terrain.puddle.carBraking': 0.5,
    'world.tileSize': 32, 'world.puddleShare': 0.02, 'world.puddleSpotMax': 2, 'world.barrierGapsMin': 3,
    'world.districtColumns': 3, 'world.districtRows': 3, 'world.gateWidth': 48, 'world.flipSeconds': 0.4,
    'world.blockShare': 0.25, 'world.jerseyShare': 0.08, 'world.occludedFractionMax': 0.3,
  };
  // P1-only proposed parameters (brief §P1.9). Not in the registry.
  const PROTO = {
    'proto.swerveLength': 120, 'proto.swerveOuter': 34, 'proto.shoulderWidth': 24,
    'proto.substeps': 4,
    'proto.learningEnabled': 0, 'proto.zonesEverywhere': 0, 'proto.pathsEverywhere': 1, 'proto.stopCue': 1,
    'proto.returnSignalSeconds': 0.5, 'proto.returnClearance': 30, 'proto.carYawRate': 240,
    'proto.difficulty': 1, 'proto.health.fragile': 600, 'proto.health.standard': 800, 'proto.health.reinforced': 1000, // Edit 40.1: base 800; easy 600; difficult 1000
    'proto.quota.straight': 1, 'proto.quota.barrier': 2, 'proto.quota.corner': 3,
    'proto.traffic.straight.interval': 3, 'proto.traffic.barrier.interval': 3, 'proto.traffic.corner.interval': 3.5,
    'proto.traffic.jitter': 0.4, 'proto.art.pillarHeight': 60,
    'proto.damageModel': 1, 'proto.damageExponent': 2, 'proto.dummyMass': 0.056, 'proto.restitution': 0.3, 'proto.dummyStrikeSpeed': 100,
    'proto.contactFriction': 0.3, 'proto.recoilScale': 0.6, 'proto.recoilSeconds': 0.35,
    'proto.standoffDistance': 50, 'proto.learn.standoffEnabled': 1, 'proto.learn.standoffStep': 35, 'proto.learn.standoffMax': 190, 'proto.sensorStraight': 1, 'proto.unstick.reverseSpeed': 30, 'proto.unstick.reverseGap': 140, 'proto.unstick.reverseSeconds': 5, 'proto.honkSeconds': 5,
    'proto.scale.unitsPerMetre': 12.2, 'proto.driver.coveredReaction': 0.18, 'proto.driver.cautionZone': 180,
    'proto.driver.cautionSpeed': 82, 'proto.driver.passClearance': 24, 'proto.driver.passSpeed': 55,
    'proto.driver.patienceSeconds': 8, 'proto.droneSpeed': 240, 'proto.droneLiftSeconds': 0.5,
    'proto.art.shadowScale': 0.3, 'proto.art.crateHeight': 30, 'proto.art.barrierHeight': 14,
    'proto.art.coneHeight': 14, 'proto.art.dummyHeight': 18, 'proto.art.droneHeight': 70,
    'proto.art.extrusion': 0.3, // P3: share of an object's height drawn as screen-up offset (three-quarter view)
    'proto.city': 1, // P3: city blocks and jersey barriers are level statics (Fix A). 0 restores the P2.2 roads.
    'proto.district': 1, 'proto.district.seed': 0, // P3 (D24): 3 × 3 screens per road, Zelda-style. 0 = one static screen. Seed rerolls the generated screens.
    // P3 locational damage: an impact's assessed damage picks the height (legs → torso/arms → head); shares of
    // damage.bodyHealth lost by one part mark it cracked, then broken. Presentation and reports only; health is one pool.
    'proto.parts.torsoFrom': 100, 'proto.parts.headFrom': 250, 'proto.parts.crackedShare': 0.2, 'proto.parts.brokenShare': 0.4,
    // P3 part effects: each part's share of damage.bodyHealth lost cuts one ability, linearly, to a floor.
    // Legs → walk and run speed. Torso → turn rate. Head → view cone width. Arms → throw distance; both arms broken → no cone handling.
    'proto.parts.effects': 1,
    'proto.parts.legSpeedLoss': 1, 'proto.parts.legSpeedFloor': 0.5, 'proto.parts.legDashLoss': 1.5, 'proto.parts.torsoTurnLoss': 1.5, 'proto.parts.torsoTurnFloor': 0.5,
    'proto.parts.headConeLoss': 1.5, 'proto.parts.headConeFloor': 0.5, 'proto.parts.armThrowLoss': 1, 'proto.parts.armThrowFloor': 0.5,
  };

  // P1.2 prototype overrides of registry values (logged in DUMMIES_Prototype_Log.md).
  const OVERRIDES = {
    'props.cone.radius': 7.2, 'run.appearances.road': 100,
    // P1.7 Standard driver, derived from UK Highway Code stopping distances at 12.2 world units per metre.
    // P2.2: reaction 0.67 -> 0.3 s (playtest: cars hit a dummy standing well ahead). Braking unchanged.
    'perception.reactionDelay': 0.3, 'traffic.comfortBraking': 37, 'traffic.hardBraking': 79,
    'traffic.acceleration': 43, 'traffic.timeGap': 2.0, 'perception.forwardLength': 560,
    // P3: 640 × 360 screen, 400 × 300 field. One art pixel = 2 reference units (Edit 37 proposed 3).
    'ui.artScale': 2,
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
    bigBattery: { name: 'Big battery', branch: 'Battery', price: 'economy.price.battery', pre: null,
      desc: 'Three dash charges, not two. Chain a feint into a strike.' },
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
      name: 'L1 Straight', blurb: 'Flyover pillars line the road. Hide from side sensors, then step out.',
      center: () => [[-200, 300], [1000, 300]],
      statics: [
        { x: 136, y: 214, w: 28, h: 28, kind: 'pillar' }, { x: 416, y: 214, w: 28, h: 28, kind: 'pillar' }, { x: 676, y: 214, w: 28, h: 28, kind: 'pillar' },
        { x: 276, y: 358, w: 28, h: 28, kind: 'pillar' }, { x: 546, y: 358, w: 28, h: 28, kind: 'pillar' },
      ],
      cones: [[110, 196], [310, 190], [500, 414], [690, 420]],
      spawns: [{ x: 400, y: 480, f: -90 }, { x: 160, y: 480, f: -90 }, { x: 640, y: 480, f: -90 }, { x: 400, y: 120, f: 90 }],
      // P3 city (proto.city): jersey barriers and blocks are solid. They collide and cast sensor shadows like any static.
      city: [ // city v2 (20 Oct): blocks 27% of the level, jerseys 8% of the road edge
        { x: 148, y: 384, w: 44, h: 8, kind: 'jersey' }, { x: 748, y: 208, w: 44, h: 8, kind: 'jersey' }, { x: 438, y: 384, w: 44, h: 8, kind: 'jersey' },
        { x: 640, y: 48, w: 160, h: 120, kind: 'block', height: 80 }, { x: 128, y: 48, w: 160, h: 120, kind: 'block', height: 100 }, { x: 448, y: 48, w: 152, h: 120, kind: 'block', height: 130 },
        { x: 448, y: 480, w: 144, h: 120, kind: 'block', height: 90 }, { x: 208, y: 480, w: 144, h: 120, kind: 'block', height: 100 }, { x: 688, y: 480, w: 112, h: 120, kind: 'block', height: 120 },
        { x: 0, y: 480, w: 112, h: 120, kind: 'block', height: 120 }, { x: 0, y: 48, w: 88, h: 120, kind: 'block', height: 130 },
      ],
    },
    barrier: {
      name: 'L2 Barrier', blurb: 'Hide behind the barrier. Ambush through the gaps.',
      center: () => [[-200, 300], [1000, 300]],
      statics: [
        { x: 0, y: 388, w: 250, h: 12, kind: 'barrier' }, { x: 290, y: 388, w: 220, h: 12, kind: 'barrier' },
        { x: 550, y: 388, w: 250, h: 12, kind: 'barrier' },
        { x: 186, y: 214, w: 28, h: 28, kind: 'pillar' }, { x: 466, y: 214, w: 28, h: 28, kind: 'pillar' }, { x: 686, y: 214, w: 28, h: 28, kind: 'pillar' },
      ],
      cones: [[90, 202], [260, 198], [540, 202], [150, 428], [700, 428]],
      spawns: [{ x: 400, y: 500, f: -90 }, { x: 140, y: 500, f: -90 }, { x: 660, y: 500, f: -90 }, { x: 300, y: 110, f: 90 }],
      // P3 city (proto.city): jersey barriers and blocks are solid. They collide and cast sensor shadows like any static.
      city: [ // city v2 (20 Oct): blocks 26% of the level, jerseys 8% of the road edge
        { x: 388, y: 208, w: 44, h: 8, kind: 'jersey' }, { x: 8, y: 208, w: 44, h: 8, kind: 'jersey' }, { x: 748, y: 208, w: 44, h: 8, kind: 'jersey' },
        { x: 0, y: 48, w: 160, h: 120, kind: 'block', height: 70 }, { x: 640, y: 48, w: 160, h: 120, kind: 'block', height: 110 }, { x: 424, y: 48, w: 160, h: 120, kind: 'block', height: 120 },
        { x: 192, y: 480, w: 160, h: 120, kind: 'block', height: 80 }, { x: 448, y: 480, w: 160, h: 120, kind: 'block', height: 80 }, { x: 712, y: 480, w: 88, h: 120, kind: 'block', height: 90 },
        { x: 0, y: 480, w: 88, h: 120, kind: 'block', height: 120 }, { x: 200, y: 48, w: 48, h: 120, kind: 'block', height: 70 },
      ],
    },
    corner: {
      name: 'L3 Corner', blurb: 'A right-angle bend. Read curved approaches.',
      center: () => [[-200, 440], [450, 440], ...arcPts(450, 340, 100, Math.PI / 2, 0, 24).slice(1), [550, -200]],
      statics: [{ x: 382, y: 312, w: 36, h: 36, kind: 'pillar' }, { x: 404, y: 232, w: 32, h: 32, kind: 'pillar' },
        { x: 236, y: 336, w: 28, h: 28, kind: 'pillar' }, { x: 626, y: 456, w: 32, h: 32, kind: 'pillar' }],
      cones: [[200, 330], [320, 552], [660, 220], [420, 120]],
      spawns: [{ x: 300, y: 560, f: -90 }, { x: 700, y: 400, f: 180 }, { x: 200, y: 160, f: 0 }, { x: 720, y: 140, f: 180 }],
      // P3 city (proto.city): jersey barriers and blocks are solid. They collide and cast sensor shadows like any static.
      city: [ // city v2 (20 Oct): blocks 25% of the level, jerseys 7% of the road edge
        { x: 634, y: 248, w: 8, h: 44, kind: 'jersey' }, { x: 8, y: 524, w: 44, h: 8, kind: 'jersey' }, { x: 378, y: 524, w: 44, h: 8, kind: 'jersey' },
        { x: 0, y: 216, w: 160, h: 120, kind: 'block', height: 70 }, { x: 0, y: 48, w: 152, h: 120, kind: 'block', height: 120 }, { x: 248, y: 48, w: 136, h: 120, kind: 'block', height: 110 },
        { x: 688, y: 232, w: 112, h: 120, kind: 'block', height: 130 }, { x: 696, y: 480, w: 104, h: 120, kind: 'block', height: 60 }, { x: 200, y: 208, w: 144, h: 88, kind: 'block', height: 130 },
        { x: 504, y: 528, w: 152, h: 72, kind: 'block', height: 80 }, { x: 96, y: 536, w: 152, h: 64, kind: 'block', height: 80 }, { x: 648, y: 48, w: 152, h: 40, kind: 'block', height: 120 },
        { x: 752, y: 392, w: 48, h: 48, kind: 'block', height: 110 },
      ],
    },
  };
  const LEVEL_LIST = ['straight', 'barrier', 'corner'];
  // Body health is a difficulty setting, constant across roads. More health = harder contract.
  const DIFFICULTIES = [{ key: 'fragile', name: 'Fragile' }, { key: 'standard', name: 'Standard' }, { key: 'reinforced', name: 'Reinforced' }];

  function lanesOf(c, P) { const half = P['world.laneWidth'] / 2; return [makePath(offsetPts(c, half)), makePath(offsetPts(c, -half).reverse())]; }
  function buildLevel(id, P) {
    const L = LEVELS[id], c = L.center();
    const lv = {
      id, key: id, name: L.name, blurb: L.blurb, center: c, lanes: lanesOf(c, P),
      statics: L.statics.concat(P['proto.city'] ? L.city || [] : []).map((s, i) => Object.assign({ id: 's' + i }, s)),
      coneHomes: L.cones.slice(), spawns: L.spawns.slice(), canal: true, gates: {}, theme: 'start',
    };
    lv.patches = makePatches(lv, P, prng(5150 + LEVEL_LIST.indexOf(id) * 97 + Math.round(P['proto.district.seed'] || 0) * 131));
    return lv;
  }

  // ---------- geometry helpers for generated screens
  const rectDist = (x, y, r) => hyp(Math.max(r.x - x, 0, x - (r.x + r.w)), Math.max(r.y - y, 0, y - (r.y + r.h)));
  const overlapGap = (a, b, g) => a.x < b.x + b.w + g && a.x + a.w + g > b.x && a.y < b.y + b.h + g && a.y + a.h + g > b.y;
  function prng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  function roadDist(center) { // distance from a point to the road centre line
    const segs = [];
    for (let i = 1; i < center.length; i++) { const a = center[i - 1], b = center[i], dx = b[0] - a[0], dy = b[1] - a[1], len = hyp(dx, dy) || 1; segs.push([a[0], a[1], dx / len, dy / len, len]); }
    return (x, y) => { let best = Infinity; for (const [ax, ay, tx, ty, len] of segs) { const px = x - ax, py = y - ay, t = clamp(px * tx + py * ty, 0, len); best = Math.min(best, hyp(px - tx * t, py - ty * t)); } return best; };
  }

  // ---------- surfaces (D18, 20 Oct; GDD 11.3): one ground per tile, patches painted on top. Puddles on world.puddleShare of tiles.
  // Spots of 1 to world.puddleSpotMax tiles, alternating road and verge, never under a static, a spawn or a cone.
  function makePatches(lv, P, r) {
    const T = P['world.tileSize'], W = P['world.width'], H = P['world.height'], cols = Math.ceil(W / T), rows = Math.ceil(H / T);
    const want = Math.round(P['world.puddleShare'] * cols * rows);
    if (!(want > 0)) return [];
    const top = lv.canal ? 48 : 0, d = roadDist(lv.center), lw = P['world.laneWidth'];
    const ok = (i, j) => {
      const rc = { x: i * T, y: j * T, w: T, h: T };
      if (i < 0 || j < 0 || rc.x + T > W || rc.y + T > H || rc.y < top) return false;
      return lv.statics.every((st) => !overlapGap(rc, st, 4)) && lv.spawns.every((sp) => rectDist(sp.x, sp.y, rc) > 24) &&
        lv.coneHomes.every((cn) => rectDist(cn[0], cn[1], rc) > 12);
    };
    const onRoad = (i, j) => d((i + 0.5) * T, (j + 0.5) * T) < lw - 8;
    const out = [];
    let tiles = 0;
    for (let tries = 0; tries < 2000 && tiles < want; tries++) {
      const i = Math.floor(r() * cols), j = Math.floor(r() * rows), road = out.length % 2 === 0;
      if (!ok(i, j) || (tries < 1500 && onRoad(i, j) !== road)) continue;
      if (out.some((p) => i * T > p.x - 3 * T && i * T < p.x + p.w + 2 * T && j * T > p.y - 3 * T && j * T < p.y + p.h + 2 * T)) continue; // spots stay apart
      let w = 1, h = 1;
      if (Math.min(Math.round(P['world.puddleSpotMax']), want - tiles) >= 2 && r() < 0.6) {
        if (r() < 0.5 && ok(i + 1, j) && onRoad(i + 1, j) === onRoad(i, j)) w = 2; else if (ok(i, j + 1) && onRoad(i, j + 1) === onRoad(i, j)) h = 2;
      }
      out.push({ x: i * T, y: j * T, w: w * T, h: h * T, kind: 'puddle' }); tiles += w * h;
    }
    return out;
  }

  // ---------- district (D24, 20 Oct): a level is world.districtColumns × world.districtRows screens, Zelda-style.
  // One road snakes through every screen; both ends leave the district. Each screen is a full play area (7.1).
  // The start screen (top middle, river to the north) is the handcrafted road. The rest are generated from the seed.
  // Only the screen the dummy stands on runs. Its edges are solid except at gates: the road crossing and pedestrian gates.
  const SIDE = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] }, OPP = { N: 'S', E: 'W', S: 'N', W: 'E' }, SIDES = ['N', 'E', 'S', 'W'];
  const ACROSS = { W: [220, 300, 380], E: [220, 300, 380], N: [280, 400, 520], S: [280, 400, 520] }; // where a road may cross an edge
  const BEND_R = 100, S_SPAN = 300, S_MAX = 160, GRID = 16, THEMES = ['flyover', 'barrier', 'plain', 'flyover', 'barrier'];
  const horiz = (sd) => sd === 'W' || sd === 'E';
  const sideOf = (a, b) => (b[0] > a[0] ? 'E' : b[0] < a[0] ? 'W' : b[1] > a[1] ? 'S' : 'N');
  function edgeCrossings(center, W, H) {
    const out = [];
    for (let i = 1; i < center.length; i++) {
      const [x0, y0] = center[i - 1], [x1, y1] = center[i];
      const at = (side, t) => {
        if (t < 0 || t > 1) return;
        const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
        if (horiz(side) ? y >= 0 && y <= H : x >= 0 && x <= W) out.push({ side, off: Math.round(horiz(side) ? y : x) });
      };
      if (x1 !== x0) { at('W', -x0 / (x1 - x0)); at('E', (W - x0) / (x1 - x0)); }
      if (y1 !== y0) { at('N', -y0 / (y1 - y0)); at('S', (H - y0) / (y1 - y0)); }
    }
    return out;
  }
  const edgePoint = (sd, off, W, H, out) => (sd === 'W' ? [-out, off] : sd === 'E' ? [W + out, off] : sd === 'N' ? [off, -out] : [off, H + out]);
  function roadCenter(a, b, W, H, lead) {
    if (horiz(a.side) === horiz(b.side)) { // opposite edges: straight, or an S-bend between two offsets
      const p0 = edgePoint(a.side, a.off, W, H, lead), p1 = edgePoint(b.side, b.off, W, H, lead);
      if (a.off === b.off) return [p0, p1];
      const hz = horiz(a.side), mid = (hz ? W : H) / 2, fwd = a.side === 'W' || a.side === 'N';
      const s0 = mid + (fwd ? -1 : 1) * S_SPAN / 2, s1 = mid + (fwd ? 1 : -1) * S_SPAN / 2, pts = [p0];
      for (let i = 0; i <= 16; i++) { const t = i / 16, al = s0 + (s1 - s0) * t, lat = a.off + (b.off - a.off) * ease(t); pts.push(hz ? [al, lat] : [lat, al]); }
      pts.push(p1);
      return pts;
    }
    const h = horiz(a.side) ? a : b, v = horiz(a.side) ? b : a; // adjacent edges: a right-angle bend filleted at BEND_R
    const dxh = h.side === 'W' ? -1 : 1, dyv = v.side === 'N' ? -1 : 1, ox = v.off + dxh * BEND_R, oy = h.off + dyv * BEND_R;
    const a1 = Math.atan2(h.off - oy, v.off + dxh * BEND_R - ox), a2 = a1 + wrap(Math.atan2(h.off + dyv * BEND_R - oy, v.off - ox) - a1);
    const pts = [edgePoint(h.side, h.off, W, H, lead), ...arcPts(ox, oy, BEND_R, a1, a2, 24), edgePoint(v.side, v.off, W, H, lead)];
    return h === a ? pts : pts.reverse();
  }
  function hamiltonPaths(C, R) {
    const out = [], n = C * R, seen = new Uint8Array(n), path = [];
    const go = (k) => {
      path.push(k); seen[k] = 1;
      if (path.length === n) out.push(path.slice());
      else {
        const x = k % C, y = (k - x) / C;
        for (const sd of SIDES) { const xx = x + SIDE[sd][0], yy = y + SIDE[sd][1]; if (xx >= 0 && yy >= 0 && xx < C && yy < R && !seen[yy * C + xx]) go(yy * C + xx); }
      }
      path.pop(); seen[k] = 0;
    };
    for (let k = 0; k < n; k++) go(k);
    return out;
  }
  // A strip along one edge, from the edge to a body length inside, between a0 and a1: clear of every static?
  function edgeClear(statics, sd, a0, a1, W, H, R) {
    const D = 56, rc = sd === 'W' ? { x: 0, y: a0, w: D, h: a1 - a0 } : sd === 'E' ? { x: W - D, y: a0, w: D, h: a1 - a0 } :
      sd === 'N' ? { x: a0, y: 0, w: a1 - a0, h: D } : { x: a0, y: H - D, w: a1 - a0, h: D };
    return statics.every((st) => !overlapGap(rc, st, R + 1));
  }
  // The approach to each gate stays open: a rectangle from the edge inward, a little wider than the gate.
  function gateZones(gates, W, H) {
    const out = [], D = 64;
    for (const sd of SIDES) for (const [a, b] of gates[sd] || []) {
      out.push(sd === 'W' ? { x: 0, y: a - 8, w: D, h: b - a + 16 } : sd === 'E' ? { x: W - D, y: a - 8, w: D, h: b - a + 16 } :
        sd === 'N' ? { x: a - 8, y: 0, w: b - a + 16, h: D } : { x: a - 8, y: H - D, w: b - a + 16, h: D });
    }
    return out;
  }
  function planDistrict(levelId, P) {
    const C = Math.round(P['world.districtColumns']), R = Math.round(P['world.districtRows']), W = P['world.width'], H = P['world.height'];
    const seed = 9001 + LEVEL_LIST.indexOf(levelId) * 7919 + Math.round(P['proto.district.seed']) * 104729, r = prng(seed);
    const inside = (x, y) => x >= 0 && y >= 0 && x < C && y < R, xy = (k) => [k % C, Math.floor(k / C)];
    const outsides = (c) => SIDES.filter((sd) => !inside(c[0] + SIDE[sd][0], c[1] + SIDE[sd][1]));
    const fixed = edgeCrossings(LEVELS[levelId].center(), W, H); // the start screen keeps its handcrafted road
    const all = hamiltonPaths(C, R);
    // The start screen sits on the top row, by the river: the middle if its road allows, else a corner.
    // (A path's ends fall on the corners of a 3 × 3 grid, so a road that ends on the start screen starts in a corner.)
    let start = null, paths = [];
    for (const st of [[Math.floor(C / 2), 0], [C - 1, 0], [0, 0]]) {
      const sk = st[0];
      paths = all.filter((p) => {
        const i = p.indexOf(sk), nb = [p[i - 1], p[i + 1]].filter((k) => k != null).map((k) => sideOf(st, xy(k)));
        const outs = fixed.filter((f) => !inside(st[0] + SIDE[f.side][0], st[1] + SIDE[f.side][1]));
        if (nb.length + outs.length !== 2 || !nb.every((sd) => fixed.some((f) => f.side === sd))) return false;
        return [p[0], p[p.length - 1]].every((k) => outsides(xy(k)).length > 0); // both road ends leave the district
      });
      if (paths.length) { start = st; break; }
    }
    if (!start) return null;
    const isStart = (c) => c[0] === start[0] && c[1] === start[1];
    const startStatics = buildLevel(levelId, P).statics, OUTER = P['world.laneWidth'] + P['proto.shoulderWidth'];
    const gw = P['world.gateWidth'], gap = P['world.pedestrianGap'], br = P['body.radius'];
    for (let attempt = 0; attempt < 400; attempt++) {
      const path = pick(r, paths).map(xy), ends = path.map(() => []);
      const fixedOff = (c, sd) => { if (!isStart(c)) return null; const f = fixed.find((q) => q.side === sd); return f ? f.off : null; };
      for (let i = 0; i + 1 < path.length; i++) {
        const a = path[i], b = path[i + 1], sa = sideOf(a, b), sb = OPP[sa];
        let off = fixedOff(a, sa); if (off == null) off = fixedOff(b, sb); if (off == null) off = pick(r, ACROSS[sa]);
        ends[i].push({ side: sa, off }); ends[i + 1].push({ side: sb, off });
      }
      for (const i of [0, path.length - 1]) {
        const c = path[i], fo = isStart(c) ? fixed.find((f) => !inside(c[0] + SIDE[f.side][0], c[1] + SIDE[f.side][1])) : null;
        const sd = fo ? fo.side : pick(r, outsides(c)), e = { side: sd, off: fo ? fo.off : pick(r, ACROSS[sd]), outer: true };
        if (i === 0) ends[i].unshift(e); else ends[i].push(e);
      }
      if (ends.some(([a, b]) => horiz(a.side) === horiz(b.side) && Math.abs(a.off - b.off) > S_MAX)) continue; // S-bends stay gentle
      const cells = Array.from({ length: R }, (_, y) => Array.from({ length: C }, (_, x) => null));
      path.forEach((c, i) => {
        cells[c[1]][c[0]] = { cell: c, order: i, ends: ends[i], start: isStart(c), canal: c[1] === 0, gates: { N: [], E: [], S: [], W: [] },
          theme: isStart(c) ? 'start' : pick(r, THEMES), center: isStart(c) ? LEVELS[levelId].center() : roadCenter(ends[i][0], ends[i][1], W, H, P['world.spawnLeadIn']),
          level: null, cones: null };
      });
      // gates on every shared edge: the road crossing, plus one pedestrian gate (always where no road crosses)
      for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) for (const sd of ['E', 'S']) {
        const nx = x + SIDE[sd][0], ny = y + SIDE[sd][1];
        if (!inside(nx, ny)) continue;
        const A = cells[y][x], B = cells[ny][nx], len = horiz(sd) ? H : W, road = A.ends.find((e) => e.side === sd), spans = [];
        if (road) spans.push([road.off - OUTER, road.off + OUTER]);
        const free = (a) => [[A, sd], [B, OPP[sd]]].every(([q, s]) => !q.start || edgeClear(startStatics, s, a - 4, a + gw + 4, W, H, br)) &&
          spans.every(([s0, s1]) => a + gw + gap <= s0 || a >= s1 + gap) && !(horiz(sd) && (A.canal || B.canal) && a < 56);
        const cand = [];
        for (let a = 48; a + gw <= len - 48; a += 8) if (free(a)) cand.push(a);
        if (cand.length && (!road || r() < 0.5)) { const a = pick(r, cand); spans.push([a, a + gw]); }
        A.gates[sd] = spans.map((s) => s.slice()); B.gates[OPP[sd]] = spans.map((s) => s.slice());
      }
      return { levelId, cols: C, rows: R, seed, start, cur: start.slice(), path, cells, visited: new Set([start[1] * C + start[0]]), lastFlip: null };
    }
    return null;
  }
  // Axis-aligned straight runs of the road inside the screen: theme features and jerseys sit along them.
  function straightRuns(c, W, H) {
    const out = [];
    for (let i = 1; i < c.length; i++) {
      const [x0, y0] = c[i - 1], [x1, y1] = c[i];
      if (y0 === y1) { const a = Math.max(0, Math.min(x0, x1)), b = Math.min(W, Math.max(x0, x1)); if (b - a > 160) out.push({ hz: true, c: y0, a, b }); }
      else if (x0 === x1) { const a = Math.max(0, Math.min(y0, y1)), b = Math.min(H, Math.max(y0, y1)); if (b - a > 160) out.push({ hz: false, c: x0, a, b }); }
    }
    return out;
  }
  // A generated screen: theme features (flyover pillars or a barrier run with gaps), verge spawns and cones,
  // jersey barriers on world.jerseyShare of the road edge, then city blocks to world.blockShare of the screen (7.9 clause 6).
  function generateScreen(D, cell, P, r) {
    const W = P['world.width'], H = P['world.height'], lw = P['world.laneWidth'], OUTER = lw + P['proto.shoulderWidth'];
    const BR = P['body.radius'], ALLEY = P['world.pedestrianGap'], top = cell.canal ? 48 : 0, c = cell.center, d = roadDist(c);
    const keep = gateZones(cell.gates, W, H), path = makePath(c), statics = [];
    const inside = (rc, m) => rc.x >= m && rc.y >= top + m && rc.x + rc.w <= W - m && rc.y + rc.h <= H - m;
    const offRoad = (rc, m) => [[rc.x, rc.y], [rc.x + rc.w, rc.y], [rc.x, rc.y + rc.h], [rc.x + rc.w, rc.y + rc.h], [rc.x + rc.w / 2, rc.y + rc.h / 2]].every(([x, y]) => d(x, y) >= m);
    const clearKeep = (rc, m) => keep.every((k) => !overlapGap(rc, k, m));
    const runs = straightRuns(c, W, H).sort((p, q) => (q.b - q.a) - (p.b - p.a));
    if (cell.theme === 'flyover') for (const run of runs) {
      for (let p = run.a + 100, k = Math.floor(r() * 2); p + 28 <= run.b - 60; p += 240 + Math.round(r() * 3) * 10, k++) {
        const off = k % 2 ? run.c + lw + 2 : run.c - lw - 30;
        const rc = run.hz ? { x: p, y: off, w: 28, h: 28, kind: 'pillar' } : { x: off, y: p, w: 28, h: 28, kind: 'pillar' };
        if (inside(rc, 4) && offRoad(rc, lw) && clearKeep(rc, 8)) statics.push(rc);
      }
    }
    if (cell.theme === 'barrier' && runs.length) { // one side of the longest run: a crash barrier with world.barrierGapsMin gaps
      const run = runs[0], s = r() < 0.5 ? 1 : -1, off = s > 0 ? run.c + OUTER + 8 : run.c - OUTER - 20, a0 = run.a + 48, a1 = run.b - 48;
      const n = Math.round(P['world.barrierGapsMin']), seg = (a1 - a0 - n * ALLEY) / (n + 1);
      for (let k = 0; k <= n; k++) {
        const p = a0 + k * (seg + ALLEY), rc = run.hz ? { x: Math.round(p), y: off, w: Math.round(seg), h: 12, kind: 'barrier' } : { x: off, y: Math.round(p), w: 12, h: Math.round(seg), kind: 'barrier' };
        if (seg > 40 && inside(rc, 4) && offRoad(rc, OUTER) && clearKeep(rc, 8)) statics.push(rc);
      }
    }
    if (cell.theme !== 'plain' && !statics.length) cell.theme = 'plain'; // too little straight road for the feature
    const verge = (dist, okFn) => { // points on both verges at a set distance from the centre line
      const out = [];
      for (let s = 0; s <= path.length; s += 24) {
        const p = pathAt(path, s);
        if (p.x < 0 || p.y < 0 || p.x > W || p.y > H) continue;
        for (const side of [-1, 1]) { const x = p.x + p.nx * side * dist, y = p.y + p.ny * side * dist; if (okFn(x, y)) out.push({ x, y, px: p.x, py: p.y }); }
      }
      return out;
    };
    const spread = (cands, n, from) => { // farthest-point picks, so spawns and cones spread over the screen
      const got = [];
      while (got.length < n && cands.length) {
        let bi = -1, bd = -1;
        for (let k = 0; k < cands.length; k++) { const q = cands[k], m = got.concat(from || []).reduce((mm, g) => Math.min(mm, hyp(g.x - q.x, g.y - q.y)), Infinity); const v = m === Infinity ? r() : m; if (v > bd) { bd = v; bi = k; } }
        got.push(cands.splice(bi, 1)[0]);
      }
      return got;
    };
    const keepDist = (x, y) => keep.reduce((m, k) => Math.min(m, rectDist(x, y, k)), Infinity);
    const spawns = spread(verge(OUTER + 44, (x, y) => x >= 40 && x <= W - 40 && y >= top + 44 && y <= H - 40 && d(x, y) >= OUTER + 40 &&
      statics.every((st) => rectDist(x, y, st) >= 40) && keepDist(x, y) >= 20), 4).map((q) => ({ x: Math.round(q.x), y: Math.round(q.y), f: Math.round(Math.atan2(q.py - q.y, q.px - q.x) / DEG) }));
    const cones = spread(verge(OUTER + 24, (x, y) => x >= 20 && x <= W - 20 && y >= top + 20 && y <= H - 20 && d(x, y) >= OUTER + 16 &&
      statics.every((st) => rectDist(x, y, st) >= 24) && spawns.every((sp) => hyp(sp.x - x, sp.y - y) >= 60)), 3, spawns).map((q) => [Math.round(q.x), Math.round(q.y)]);
    // jersey barriers, just off the pavement on straight runs
    let edgeLen = 0;
    for (let s = 0; s < path.length; s += 4) { const p = pathAt(path, s); if (p.x >= 0 && p.x <= W && p.y >= 0 && p.y <= H) edgeLen += 8; }
    const want = Math.max(1, Math.round(edgeLen * P['world.jerseyShare'] / 44)), jc = [];
    for (const run of runs) for (const side of [-1, 1]) for (let p = run.a + 40; p < run.b - 40; p += 10) {
      const o = run.c + side * (OUTER + 4) - (side < 0 ? 8 : 0);
      const rc = run.hz ? { x: Math.round(p - 22), y: Math.round(o), w: 44, h: 8, kind: 'jersey' } : { x: Math.round(o), y: Math.round(p - 22), w: 8, h: 44, kind: 'jersey' };
      if (!inside(rc, 4) || !offRoad(rc, OUTER + 2) || !clearKeep(rc, 8) || !statics.every((st) => !overlapGap(rc, st, 26))) continue;
      if (!spawns.every((sp) => rectDist(sp.x, sp.y, rc) > 56) || !cones.every((cn) => rectDist(cn[0], cn[1], rc) > 26)) continue;
      jc.push(rc);
    }
    const jerseys = [];
    while (jerseys.length < want && jc.length) {
      let bi = -1, bd = -1;
      for (let k = 0; k < jc.length; k++) { const q = jc[k]; if (jerseys.some((j) => overlapGap(q, j, 60))) continue; const m = jerseys.length ? Math.min(...jerseys.map((j) => hyp(j.x - q.x, j.y - q.y))) : r() * 100; if (m > bd) { bd = m; bi = k; } }
      if (bi < 0) break;
      jerseys.push(jc.splice(bi, 1)[0]);
    }
    statics.push(...jerseys);
    // city blocks: greedy, largest legal footprint first on a GRID-unit lattice; every open spot stays reachable
    const G = 8, GW = W / G, GH = H / G, forb = new Uint8Array(GW * GH);
    const tooNear = (x, y) => d(x, y) < OUTER + 16 + 4 || y < top || statics.some((st) => rectDist(x, y, st) < ALLEY + 4) ||
      keep.some((k) => rectDist(x, y, k) < 4) || spawns.some((sp) => hyp(sp.x - x, sp.y - y) < 52) || cones.some((cn) => hyp(cn[0] - x, cn[1] - y) < 36);
    for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) forb[j * GW + i] = tooNear(i * G + G / 2, j * G + G / 2) ? 1 : 0;
    const mark = (b) => { for (let j = Math.max(0, Math.floor((b.y - ALLEY - G) / G)); j < Math.min(GH, Math.ceil((b.y + b.h + ALLEY + G) / G)); j++) for (let i = Math.max(0, Math.floor((b.x - ALLEY - G) / G)); i < Math.min(GW, Math.ceil((b.x + b.w + ALLEY + G) / G)); i++) if (rectDist(i * G + G / 2, j * G + G / 2, b) < ALLEY + 4) forb[j * GW + i] = 1; };
    const reachable = (list) => { // flood fill from the spawns over open ground: nothing walled off
      const S = 8, gw = W / S, gh = H / S, free = new Uint8Array(gw * gh), seen = new Uint8Array(gw * gh), q = [];
      for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const x = i * S + S / 2, y = j * S + S / 2; free[j * gw + i] = x > BR && x < W - BR && y > BR && y < H - BR && list.every((st) => rectDist(x, y, st) > BR + 0.5) ? 1 : 0; }
      for (const sp of spawns) { const k = Math.floor(sp.y / S) * gw + Math.floor(sp.x / S); if (free[k] && !seen[k]) { seen[k] = 1; q.push(k); } }
      while (q.length) { const k = q.pop(), i = k % gw, j = (k - i) / gw; for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= gw || jj >= gh) continue; const kk = jj * gw + ii; if (free[kk] && !seen[kk]) { seen[kk] = 1; q.push(kk); } } }
      for (let k = 0; k < free.length; k++) if (free[k] && !seen[k]) return false;
      return true;
    };
    const blocks = [], banned = new Set();
    let area = 0;
    for (let iter = 0; iter < 60 && area < P['world.blockShare'] * W * H; iter++) {
      const sat = new Int32Array((GW + 1) * (GH + 1));
      for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) sat[(j + 1) * (GW + 1) + i + 1] = forb[j * GW + i] + sat[j * (GW + 1) + i + 1] + sat[(j + 1) * (GW + 1) + i] - sat[j * (GW + 1) + i];
      const bad = (x, y, w, h) => { const i0 = x / G, j0 = y / G, i1 = (x + w) / G, j1 = (y + h) / G; return sat[j1 * (GW + 1) + i1] - sat[j0 * (GW + 1) + i1] - sat[j1 * (GW + 1) + i0] + sat[j0 * (GW + 1) + i0]; };
      let best = null;
      for (let w = 160; w >= 48; w -= GRID) for (let h = 128; h >= 48; h -= GRID) {
        if (best && w * h + 2400 < best.score) continue;
        for (let y = top; y + h <= H; y += GRID) for (let x = 0; x + w <= W; x += GRID) {
          if (!(x === 0 || x >= ALLEY) || !(x + w === W || W - (x + w) >= ALLEY) || !(y + h === H || H - (y + h) >= ALLEY) || !(y === top || y - top >= ALLEY)) continue;
          if (bad(x, y, w, h) || banned.has(x + ',' + y + ',' + w + ',' + h)) continue;
          const align = blocks.reduce((n, b) => n + (b.y === y || b.y + b.h === y + h ? 1 : 0) + (b.x === x || b.x + b.w === x + w ? 1 : 0), 0) + (x === 0 || x + w === W ? 1 : 0) + (y + h === H || y === top ? 1 : 0);
          const score = w * h + align * 400 + r() * 50;
          if (!best || score > best.score) best = { x, y, w, h, score };
        }
      }
      if (!best) break;
      const blk = { x: best.x, y: best.y, w: best.w, h: best.h, kind: 'block', height: 60 + Math.round(r() * 8) * 10 };
      if (!reachable(statics.concat(blocks, [blk]))) { banned.add(best.x + ',' + best.y + ',' + best.w + ',' + best.h); continue; }
      blocks.push(blk); mark(blk); area += blk.w * blk.h;
    }
    const L = LEVELS[D.levelId];
    return { id: D.levelId, name: L.name, blurb: L.blurb, center: c, lanes: lanesOf(c, P), statics: P['proto.city'] ? statics.concat(blocks) : statics.filter((st) => st.kind !== 'jersey'),
      coneHomes: cones, spawns: spawns.length ? spawns : [{ x: 400, y: 120, f: 90 }] };
  }
  // The level for one screen of a district, built on first entry and kept.
  function cellLevel(D, c, P) {
    const cell = D.cells[c[1]][c[0]];
    if (cell.level) return cell.level;
    const r = prng(D.seed + (c[1] * 31 + c[0]) * 7477);
    const lv = cell.start ? buildLevel(D.levelId, P) : generateScreen(D, cell, P, r);
    lv.statics = lv.statics.map((s, i) => Object.assign({}, s, { id: 's' + i }));
    const solid = SIDES.filter((sd) => { const x = c[0] + SIDE[sd][0], y = c[1] + SIDE[sd][1]; return x < 0 || y < 0 || x >= D.cols || y >= D.rows; });
    Object.assign(lv, { key: D.levelId + '@' + c[0] + ',' + c[1], cell: c.slice(), gates: cell.gates, solid, canal: cell.canal, theme: cell.theme, order: cell.order });
    if (!cell.start) lv.patches = makePatches(lv, P, r);
    cell.level = lv;
    return lv;
  }
  const cellName = (c) => 'ABCDEFGH'[c[0]] + (c[1] + 1); // columns A–C, rows 1–3 from the river
  // Edge stretches that stop the dummy although this side is open: the far side is built up, or it is the district edge.
  // The renderer marks them, so a wall the player cannot see yet still reads (Edit 40.1).
  function edgeSpans(D, c, P) {
    const cell = D.cells[c[1]][c[0]];
    if (cell.edgeSpans) return cell.edgeSpans;
    const W = P['world.width'], H = P['world.height'], r = P['body.radius'], lv = cellLevel(D, c, P), out = {};
    for (const sd of SIDES) {
      const nx = c[0] + SIDE[sd][0], ny = c[1] + SIDE[sd][1], outside = nx < 0 || ny < 0 || nx >= D.cols || ny >= D.rows;
      const nb = outside ? null : cellLevel(D, [nx, ny], P), len = horiz(sd) ? H : W, spans = [];
      let a = null;
      for (let v = 0; v <= len; v += 4) {
        const here = sd === 'E' ? [W - r - 1, v] : sd === 'W' ? [r + 1, v] : sd === 'S' ? [v, H - r - 1] : [v, r + 1];
        const there = sd === 'E' ? [r + 1, v] : sd === 'W' ? [W - r - 1, v] : sd === 'S' ? [v, r + 1] : [v, H - r - 1];
        const open = (q, list) => list.every((st) => !circleRect(q[0], q[1], r, st));
        const stop = open(here, lv.statics) && (outside || !open(there, nb.statics));
        if (stop && a == null) a = v;
        if (!stop && a != null) { spans.push([a, v]); a = null; }
      }
      if (a != null) spans.push([a, len]);
      out[sd] = spans;
    }
    cell.edgeSpans = out;
    return out;
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
    // carry: campaign state from the previous road (owned nodes, credits, points, chassis count, time).
    constructor(levelId, overrides, carry) {
      this.P = Object.assign({}, REG, PROTO, OVERRIDES, overrides || {});
      this.levelId = levelId; this.carry = carry || null;
      this.roadIndex = LEVEL_LIST.indexOf(levelId); this.isFinal = this.roadIndex === LEVEL_LIST.length - 1;
      // D24: a road is a district of screens; the dummy starts on the handcrafted screen (top middle).
      this.district = this.P['proto.district'] ? planDistrict(levelId, this.P) : null;
      this.level = this.district ? cellLevel(this.district, this.district.start, this.P) : buildLevel(levelId, this.P);
      const dif = DIFFICULTIES[clamp(Math.round(this.P['proto.difficulty']), 0, DIFFICULTIES.length - 1)];
      this.difficulty = dif.name;
      this.P['damage.bodyHealth'] = this.P['proto.health.' + dif.key];
      this.reset();
    }

    reset() {
      const P = this.P;
      this.t = 0; this.tick = 0; this.phase = 'play'; this.phaseT = 0; this.pendingPhase = null;
      this.cars = []; this.carSeq = 0; this.slot = 0; this.lastAdmit = -1e9; this.nextAt = 0;
      const pat = ['sedan', 'van', 'sedan', 'sedan', 'van'];
      // Deterministic irregular traffic: golden-ratio lane choice and spacing.
      const g = (i, o) => ((i * 0.6180339887 + o) % 1);
      this.schedule = Array.from({ length: P['run.appearances.road'] }, (_, i) => ({ i, cls: pat[i % 5], lane: g(i, 0.31) < 0.5 ? 0 : 1, mult: 1 + P['proto.traffic.jitter'] * (2 * g(i, 0.77) - 1) }));
      this.cones = this.conesFor(this.level);
      this.drones = []; this.droneSeq = 0;
      this.models = { sedan: { id: 'SEDAN-01', cls: 'sedan', applied: 0, standoffApplied: 0 }, van: { id: 'VAN-02', cls: 'van', applied: 0, standoffApplied: 0 } };
      const cy = this.carry || {};
      // The fleet remembers stop distances across roads.
      for (const k in cy.standoff || {}) if (this.models[k]) this.models[k].standoffApplied = cy.standoff[k];
      this.run = { writeOffs: 0, credits: cy.credits || 0, points: cy.points || 0, owned: Object.assign({}, cy.owned), chassis: cy.chassis || 0,
        ending: null, admitted: 0, exited: 0, purchases: (cy.purchases || []).slice(), priorWriteOffs: cy.writeOffs || 0 };
      this.tOffset = cy.t || 0;
      this.quota = P['proto.quota.' + this.levelId] != null ? P['proto.quota.' + this.levelId] : P['run.quota.road'];
      this.events = []; this.effects = []; this.milestones = Object.assign({}, cy.milestones); this.report = null;
      this.turnHist = [];
      this.spawnBody();
    }

    has(n) { return !!this.run.owned[n]; }
    capacity() { return this.has('bigBattery') ? this.P['upgrades.bigCapacity'] : this.P['battery.capacity']; } // D26: Big battery 3, base 2
    // Each screen keeps its own cones: where you leave one is where you find it.
    conesFor(lv) {
      const cell = this.district && lv.cell ? this.district.cells[lv.cell[1]][lv.cell[0]] : null;
      if (cell && cell.cones) return cell.cones;
      const pre = !lv.cell || lv.theme === 'start' ? 'cone' : 'cone' + cellName(lv.cell) + '-';
      const cones = lv.coneHomes.map((c, i) => ({ id: pre + (i + 1), x: c[0], y: c[1], hx: c[0], hy: c[1], vx: 0, vy: 0, state: 'free', flightT: 0, flightDur: 1 }));
      if (cell) cell.cones = cones;
      return cones;
    }
    // ----- surfaces (D18): the top patch under a point, and its registry multiplier (world.terrain.<id>.<field>; 1 on bare ground)
    surfaceAt(x, y) {
      const ps = this.level.patches || [];
      for (let i = ps.length - 1; i >= 0; i--) { const p = ps[i]; if (x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h) return p.kind; }
      return null;
    }
    terrain(x, y, field) { const k = this.surfaceAt(x, y), v = k ? this.P['world.terrain.' + k + '.' + field] : null; return v == null ? 1 : v; }
    // Low grip: the dummy coasts movement.lowGripStopMultiplier further. Grip (Legs) removes the slide.
    gripK(x, y) { const k = this.surfaceAt(x, y), g = k && this.P['world.terrain.' + k + '.grip']; return (g === 'low' || g === 'very low') && !this.has('grip') ? this.P['movement.lowGripStopMultiplier'] : 1; }
    emit(type, data) { this.events.push(Object.assign({ t: +this.t.toFixed(4), type }, data || {})); }
    mile(key, data) { if (!this.milestones[key]) { this.milestones[key] = Object.assign({ t: +(this.tOffset + this.t).toFixed(3), road: this.roadIndex + 1 }, data || {}); this.emit('milestone', { key }); } }
    totalWriteOffs() { return this.run.priorWriteOffs + this.run.writeOffs; }
    carryOut() {
      const r = this.run;
      return { owned: Object.assign({}, r.owned), credits: r.credits, points: r.points, chassis: r.chassis, purchases: r.purchases.slice(),
        writeOffs: this.totalWriteOffs(), t: this.tOffset + this.t, milestones: Object.assign({}, this.milestones),
        standoff: { sedan: this.models.sedan.standoffApplied, van: this.models.van.standoffApplied } };
    }

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
        charge: this.capacity(), refillDelay: 0, rampT: 0, mode: 'idle', parts: { head: 0, torso: 0, armL: 0, armR: 0, legL: 0, legR: 0 },
        coastVx: 0, coastVy: 0, coastT: 0, counterVx: 0, counterVy: 0, counterT: 0, counterDur: 0,
        lunge: null, recoverT: 0, held: null, gesture: null, alive: true, chassis: this.run.chassis,
        hits: [], denied: 0, points0: this.run.points,
      };
      this.emit('chassis', { chassis: this.run.chassis, x: sp.x, y: sp.y });
    }
    // Dash reach. With part effects on, leg damage alone shortens it (D19, 20 Oct); otherwise total wear does.
    // Either way it never falls below movement.wearFloor, so a worn body still reaches a passing flank (pillar 1).
    reach() {
      const P = this.P, b = this.body;
      return P['movement.lungeDistance'] * (P['proto.parts.effects'] ? this.partEffect('dash')
        : Math.max(P['movement.wearFloor'], Math.min(1, b.health / P['damage.bodyHealth'])));
    }
    deny(action) { this.body.denied = 0.25; this.emit('denied', { action }); }

    startLunge(facing0, k) {
      const P = this.P, b = this.body, T = P['movement.lungeDuration'];
      const R = this.reach() * (k == null ? 1 : k); // terrain lunge multiplier at take-off
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
      else b.charge = Math.min(this.capacity(), b.charge + dt / P['battery.secondsPerCharge']);
      b.denied = Math.max(0, b.denied - dt);
      const facing0 = b.facing;
      const mx = cmd.mx || 0, my = cmd.my || 0, m = hyp(mx, my), has = m > 0.3;
      const ix = has ? mx / m : 0, iy = has ? my / m : 0, inAng = has ? Math.atan2(iy, ix) : 0;
      const rate = (this.has('hips') ? P['upgrades.hipsTurnRate'] : P['movement.turnRate']) * DEG * this.partEffect('turn');
      // leg damage slows every ground speed; so does the surface underfoot (world.terrain.<id>.dummySpeed)
      const carryF = (b.held ? P['upgrades.carrySpeed'] : 1) * this.partEffect('speed') * this.terrain(b.x, b.y, 'dummySpeed');

      if (cmd.aPress) {
        const lk = this.terrain(b.x, b.y, 'lunge');
        if (b.mode !== 'lunge' && b.mode !== 'recover' && b.charge >= P['battery.lungeCost'] - 1e-9 && lk > 0) this.startLunge(facing0, lk);
        else { if (lk <= 0 && b.mode !== 'lunge' && b.mode !== 'recover') this.emit('slip', { surface: this.surfaceAt(b.x, b.y), x: +b.x.toFixed(1), y: +b.y.toFixed(1) }); this.deny('lunge'); }
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
          b.mode = 'counter'; b.counterT = 0; b.counterDur = P['movement.stopSeconds'] * P['movement.counterPressStop'] * this.gripK(b.x, b.y);
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
        if (b.mode === 'move') { b.mode = 'coast'; b.coastT = 0; b.coastVx = b.vx; b.coastVy = b.vy; b.rampT = 0; b.coastDur = P['movement.stopSeconds'] * this.gripK(b.x, b.y); }
        if (b.mode === 'coast') {
          b.coastT += dt;
          const k = Math.max(0, 1 - b.coastT / (b.coastDur || P['movement.stopSeconds'])); // a puddle stretches the slide
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
            const cn = busy || this.armsBroken() ? null : this.nearestCone();
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
      const T = P['props.cone.throwSeconds'], X = P['upgrades.throwDistance'] * this.partEffect('throw');
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
      // Screen edges (D24, Edit 40.1): open wherever the ground is open on both sides, as in Zelda.
      // A building or barrier across the edge stops the dummy; so does the district's outer edge. The flip follows in step().
      const W = P['world.width'], H = P['world.height'];
      let ex = clamp(b.x, r, W - r), ey = clamp(b.y, r, H - r);
      if ((b.x < r && this.edgeOpen('W', b.y)) || (b.x > W - r && this.edgeOpen('E', b.y))) ex = b.x;
      if ((b.y < r && this.edgeOpen('N', b.x)) || (b.y > H - r && this.edgeOpen('S', b.x))) ey = b.y;
      if (ex !== b.x || ey !== b.y) { b.x = ex; b.y = ey; block(); }
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
            carState: this.carCue(c), cause: c.cause, lunging: b.mode === 'lunge', bodySpeed: hyp(b.vx, b.vy), carSpeed: c.v, stopped: c.v < 5 || !!(c.man && c.man.standoff) });
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
      if (this.t + 1e-9 < this.nextAt) return;
      const sl = this.schedule[this.slot], L = P['vehicles.' + sl.cls + '.length'];
      const room = L * P['traffic.entryRoomLengths'] + P['traffic.minimumGap'] + L / 2;
      if (this.cars.some((c) => c.lane === sl.lane && c.s - c.L / 2 < room)) return;
      const m = this.models[sl.cls], step = P['learning.playerHitStep'];
      const path = this.level.lanes[sl.lane];
      const c = {
        id: 'car' + (++this.carSeq), slot: sl.i, cls: sl.cls, model: m.id, lane: sl.lane, path,
        L, W: P['vehicles.' + sl.cls + '.width'], cruise: P['vehicles.' + sl.cls + '.cruiseSpeed'],
        s: L / 2, d: 0, v: P['vehicles.' + sl.cls + '.cruiseSpeed'], slope: 0,
        applied: m.applied, fwdLen: P['perception.forwardLength'] * (1 + step * m.applied), standoff: this.modelStandoff(m), standoffApplied: m.standoffApplied,
        state: 'cruise', senseT: 0, man: null, cause: null, spent: false, inEpisode: false, touched: false,
        clearT: 0, interruptT: 0, det: { fwd: null, side: false }, intent: null, intentFor: null, signal: null, dodge: null,
        x: 0, y: 0, h: 0, vx: 0, vy: 0,
      };
      this.pose(c);
      this.cars.push(c); this.slot++; this.lastAdmit = this.t; this.run.admitted++;
      const nx = this.schedule[this.slot];
      this.nextAt = this.t + this.admissionInterval() * (nx ? nx.mult : 1);
      this.emit('admit', { car: c.id, cls: c.cls, model: c.model, lane: c.lane, fwdLen: +c.fwdLen.toFixed(2) });
    }
    // Learned stopping distance: each hit taken while stopped for the dummy pushes that model's stop line back.
    modelStandoff(m) { const P = this.P; return Math.min(P['proto.learn.standoffMax'], P['proto.standoffDistance'] + P['proto.learn.standoffStep'] * m.standoffApplied); }
    admissionInterval() { const v = this.P['proto.traffic.' + this.levelId + '.interval']; return v != null ? v : this.P['run.admissionInterval']; }
    pose(c, h) {
      const p = pathAt(c.path, c.s);
      c.x = p.x + p.nx * c.d; c.y = p.y + p.ny * c.d;
      c.vx = (p.tx + p.nx * c.slope) * c.v; c.vy = (p.ty + p.ny * c.slope) * c.v;
      const target = Math.atan2(p.ty + p.ny * c.slope, p.tx + p.nx * c.slope);
      c.h = h ? turnTo(c.h, target, this.P['proto.carYawRate'] * DEG * h) : target;
    }
    // P3: which body part took the hit. Side from the contact point against the dummy's facing;
    // height from the hit's size: bumper height hits the legs, harder hits reach the torso and arms, the hardest the head.
    partShare(k) { const b = this.body; return b && b.parts ? b.parts[k] / this.P['damage.bodyHealth'] : 0; }
    // Ability multiplier from part damage, in [floor, 1]. 1 when proto.parts.effects is off.
    partEffect(kind) {
      const P = this.P;
      if (!P['proto.parts.effects']) return 1;
      if (kind === 'dash') return Math.max(P['movement.wearFloor'], 1 - P['proto.parts.legDashLoss'] * (this.partShare('legL') + this.partShare('legR')));
      const t = { speed: ['legSpeed', this.partShare('legL') + this.partShare('legR')], turn: ['torsoTurn', this.partShare('torso')],
        view: ['headCone', this.partShare('head')], throw: ['armThrow', this.partShare('armL') + this.partShare('armR')] }[kind];
      return Math.max(P['proto.parts.' + t[0] + 'Floor'], 1 - P['proto.parts.' + t[0] + 'Loss'] * t[1]);
    }
    armsBroken() { const P = this.P; return !!P['proto.parts.effects'] && this.partShare('armL') >= P['proto.parts.brokenShare'] && this.partShare('armR') >= P['proto.parts.brokenShare']; }
    coneWidth() { return this.P['sensing.coneWidth'] * this.partEffect('view'); }
    partOf(px, py, assessed) {
      const P = this.P, b = this.body, a = Math.atan2(py - b.y, px - b.x) - b.facing, side = Math.sin(a) >= 0 ? 'R' : 'L';
      if (assessed >= P['proto.parts.headFrom']) return 'head';
      if (assessed >= P['proto.parts.torsoFrom']) return Math.abs(Math.sin(a)) >= 0.7 ? 'arm' + side : 'torso';
      return 'leg' + side;
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
        const dx = tg.x - nx, dy = tg.y - ny, d = hyp(dx, dy), lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
        // On the route ahead, and (straight sensor) inside the beam along the car's heading.
        const inFwd = tg.kind === 'cone' && ahead >= -tg.r && ahead <= c.fwdLen && Math.abs(lat) <= c.W / 2 + tg.r &&
          (!P['proto.sensorStraight'] || this.inBeam(c, lx, ly, tg.r));
        const inSide = tg.kind === 'body' && d <= P['perception.sideRadius'] && d > 1e-9 &&
          Math.acos(Math.min(1, Math.abs(ly) / d)) <= P['perception.sideHalfAngle'] * DEG && lx > -c.L;
        if (!inFwd && !inSide) continue;
        if (this.occluded(c, nx, ny, tg.x, tg.y)) continue;
        if (inFwd && (!res.fwd || ahead < res.fwd.lx)) res.fwd = Object.assign({}, tg, { lx: ahead, ly: lat, s: pr.s });
        if (inSide) res.side = true;
      }
      return res;
    }
    // Forward sensor: a rectangle from the nose along the heading. It does not bend with the road.
    inBeam(c, lx, ly, r) { return lx >= -r && lx <= c.fwdLen && Math.abs(ly) <= c.W / 2 + r; }
    // The dummy as a pedestrian hazard. inPath: inside the car's swept width ahead. Otherwise near: within the caution zone.
    // Straight sensor: the driver sees a straight field ahead; the stop needs the dummy in the forward beam.
    assessBody(c) {
      const P = this.P, b = this.body;
      if (!b.alive) return null;
      const pr = pathProject(c.path, b.x, b.y), ahead = pr.s - c.s - c.L / 2;
      if (ahead < -c.L || ahead > c.fwdLen) return null;
      const lat = pr.lat - c.d, gapLat = Math.abs(lat) - c.W / 2 - P['body.radius'];
      if (gapLat > P['proto.driver.cautionZone']) return null;
      const ca = Math.cos(c.h), sa = Math.sin(c.h), nx = c.x + ca * c.L / 2, ny = c.y + sa * c.L / 2, br = P['body.radius'];
      let inPath = gapLat <= 0 && ahead > -br;
      if (P['proto.sensorStraight']) {
        const dx = b.x - nx, dy = b.y - ny, fx = dx * ca + dy * sa, fy = -dx * sa + dy * ca;
        if (fx < -c.L - br || fx > c.fwdLen + br || Math.abs(fy) > c.W / 2 + br + P['proto.driver.cautionZone']) return null;
        if (inPath && !this.inBeam(c, fx, fy, br)) inPath = false;
      }
      if (this.occluded(c, nx, ny, b.x, b.y)) return null;
      return { kind: 'body', id: 'body', inPath, lx: ahead, ly: lat, gapLat, s: pr.s, r: br };
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
          if (lx > 0 && lx < 420 && Math.abs(ly) < (c.W + o.W) / 2 + 6) { gap = lx - (c.L + o.L) / 2; v = o.vx * ca + o.vy * sa; if (Math.cos(o.h - c.h) < -0.5) v = Math.min(0, v); }
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
    carBeside(c, shift) {
      const ca = Math.cos(c.h), sa = Math.sin(c.h);
      return this.cars.some((o) => {
        if (o === c) return false;
        const dx = o.x - c.x, dy = o.y - c.y, lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
        return Math.abs(lx) < (c.L + o.L) / 2 + 10 && Math.abs(ly - shift) < (c.W + o.W) / 2 + 4;
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
    choose(c, tg, opts) {
      const P = this.P, lw = P['world.laneWidth'], r = P['props.cone.radius'];
      const passing = !!(opts && opts.pass);
      // The dummy in the lane: stop short of lunge range and wait. Pass only when asked, slowly, with clearance.
      if (tg.kind === 'body' && !passing) {
        const dist = tg.lx - c.standoff;
        if (c.v < 1) return { type: 'brake', v0: 0, a: P['traffic.comfortBraking'], vTarget: 0, sStop: Math.max(c.s, tg.s - c.L / 2 - c.standoff), standoff: true };
        const need = dist > 1 ? c.v * c.v / (2 * dist) : Infinity;
        if (need <= P['traffic.hardBraking']) {
          const a = need > P['traffic.comfortBraking'] ? P['traffic.hardBraking'] : P['traffic.comfortBraking'];
          return { type: 'brake', v0: c.v, a, vTarget: 0, sStop: tg.s - c.L / 2 - c.standoff, standoff: true };
        }
        // Slight overrun of the line at hard braking still counts as a planned stop (< 2 m).
        const sHard = c.s + c.v * c.v / (2 * P['traffic.hardBraking']);
        if (sHard - (tg.s - c.L / 2 - c.standoff) < 24) return { type: 'brake', v0: c.v, a: P['traffic.hardBraking'], vTarget: 0, sStop: sHard, standoff: true };
        return { type: 'brake', v0: c.v, a: P['traffic.hardBraking'], vTarget: 0, emergency: true };
      }
      const clear = passing ? P['proto.driver.passClearance'] : 4;
      const dMin = -lw, dMax = P['proto.swerveOuter'], need = c.W / 2 + tg.r + clear;
      // A pass from a close stop pulls out steeply at walking pace.
      const len = passing ? clamp(tg.lx * 1.1, 40, P['proto.swerveLength']) : P['proto.swerveLength'];
      const cones = [];
      for (const cn of this.cones) {
        if (cn.state !== 'free') continue;
        const pr = pathProject(c.path, cn.x, cn.y);
        if (pr.s > c.s - c.L && pr.s < c.s + c.L / 2 + len + 160) cones.push(pr);
      }
      const statics = this.level.statics.filter((st) => hyp(st.x + st.w / 2 - c.x, st.y + st.h / 2 - c.y) < len + 260);
      const staticsClear = (d1) => {
        if (!statics.length) return true;
        for (let ds = 0; ds <= len + 60; ds += 12) {
          const s = c.s + ds, d = c.d + (d1 - c.d) * ease(clamp(ds / len, 0, 1)), p = pathAt(c.path, s);
          for (const o of [-c.L / 2, 0, c.L / 2]) {
            const q = pathAt(c.path, s + o), x = q.x + q.nx * d, y = q.y + q.ny * d;
            if (statics.some((st) => circleRect(x, y, c.W / 2 + 2, st))) return false;
          }
          void p;
        }
        return true;
      };
      const tgt = { s: tg.s != null ? tg.s : c.s + c.L / 2 + tg.lx, lat: c.d + tg.ly, rr: tg.r + clear };
      const targetClear = (d1) => [-c.L / 2, 0, c.L / 2].every((o) => {
        const d = c.d + (d1 - c.d) * ease(clamp((tgt.s + o - c.s) / len, 0, 1));
        return Math.abs(tgt.lat - d) >= c.W / 2 + tgt.rr;
      });
      const routeClear = (d1) => targetClear(d1) && staticsClear(d1) && cones.every((pr) => [-c.L / 2, 0, c.L / 2].every((o) => {
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
      if (best) return { type: 'shift', d0: c.d, d1: best.d1, len, v0: c.v, vCap: P['proto.driver.passSpeed'] };
      if (passing) return { type: 'brake', v0: 0, a: P['traffic.comfortBraking'], vTarget: 0, sStop: c.s, standoff: true };
      // Stop just short of the target, braking as late as comfort allows.
      const margin = 12 + tg.r, dist = Math.max(1, tg.lx - margin);
      const a = c.v * c.v / (2 * dist) > P['traffic.comfortBraking'] ? P['traffic.hardBraking'] : P['traffic.comfortBraking'];
      return { type: 'brake', v0: c.v, a, vTarget: 0, sStop: tg.s - c.L / 2 - margin };
    }
    manSpeed(c, man, tau, sAt) {
      const u = Math.max(0, tau - ((man.tv != null ? man.tv : man.t0) - man.t0));
      if (man.type === 'reverse') return -Math.min(this.P['proto.unstick.reverseSpeed'], this.P['traffic.acceleration'] * u);
      if (man.halt) return Math.max(0, man.v0 - this.P['traffic.hardBraking'] * u);
      if (man.type === 'brake' && man.sStop != null) {
        const s = sAt != null ? sAt : c.s, rem = Math.max(0, man.sStop - s);
        return Math.min(Math.max(man.v0, 0), Math.sqrt(2 * man.a * rem));
      }
      if (man.type === 'shift') {
        const top = man.vCap != null ? man.vCap : Math.max(c.cruise, man.v0);
        if (man.v0 > top) return Math.max(top, man.v0 - this.P['traffic.comfortBraking'] * u);
        return Math.min(top, man.v0 + this.P['traffic.acceleration'] * u);
      }
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
    rearBlocked(c) {
      const ca = Math.cos(c.h), sa = Math.sin(c.h), r = this.P['props.cone.radius'];
      const behind = (x, y, len, half) => { const dx = x - c.x, dy = y - c.y, lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca; return lx < 0 && lx > -c.L / 2 - len - 12 && Math.abs(ly) < c.W / 2 + half + 6; };
      if (this.cars.some((o) => o !== c && behind(o.x, o.y, o.L / 2, o.W / 2))) return true;
      if (this.cones.some((cn) => cn.state === 'free' && behind(cn.x, cn.y, r, r))) return true;
      const b = this.body; return !!(b.alive && behind(b.x, b.y, this.P['body.radius'] + 20, this.P['body.radius']));
    }
    reasonToWait(c, det, hz) {
      if ((hz && hz.inPath) || det.fwd || this.blockingCone(c) || this.obstacleAhead(c)) return true;
      const lead = this.leadGap(c);
      return !!(lead && (lead.gap < this.P['traffic.minimumGap'] + 30 || lead.v < 5));
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
        // the dummy as a pedestrian: noticed nearby, then in the path; holding time while it stands still
        const hz = this.assessBody(c), b = this.body;
        c.hz = hz;
        c.nearT = hz ? (c.nearT || 0) + dt : 0;
        c.pathT = hz && hz.inPath ? (c.pathT || 0) + dt : 0;
        const covering = c.nearT - c.pathT >= P['perception.reactionDelay'] - 1e-9;
        const reactPath = covering ? P['proto.driver.coveredReaction'] : P['perception.reactionDelay'];
        if (hz && hz.inPath && c.v < 1) {
          if (c.holdT == null || hyp(b.x - c.holdX, b.y - c.holdY) > 10) { c.holdT = 0; c.holdX = b.x; c.holdY = b.y; }
          c.holdT += dt;
        } else c.holdT = null;
        // blocked: horn at the dummy (a road user posing danger); flash lights at cones and call a FARSIGHT drone
        const blk = c.v < 2 ? (this.blockingCone(c) || (hz && hz.inPath && hz.lx < c.standoff + 40 ? { id: 'body', body: true } : null)) : null;
        c.blockT = blk ? (c.blockT || 0) + dt : 0;
        if (!blk) c.honking = false;
        else if (c.blockT >= P['proto.honkSeconds'] - 1e-9) {
          if (!c.honking) { c.honking = true; c.honkAt = blk.body ? 'body' : 'cone'; this.emit('honk', { car: c.id, at: blk.body ? 'body' : blk.id }); }
          if (!blk.body && !this.drones.some((d) => d.cone === blk.id)) this.dispatchDrone(blk);
        }
        // reversing to unstick: stop at the target, after the time limit, or when something is behind
        if (c.man && c.man.type === 'reverse') {
          const m = c.man, rs = P['proto.unstick.reverseSpeed'];
          if (c.s <= m.sTarget + 0.5 || this.rearBlocked(c) || this.t - m.t0 >= P['proto.unstick.reverseSeconds']) {
            c.man = null; c.v = 0; c.state = 'cruise'; c.stillT = 0; this.emit('release', { car: c.id });
          } else { m.until = this.t + Math.max(P['traffic.commitHorizon'], (c.s - m.sTarget) / rs); continue; }
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
        if (c.man && c.state === 'committed' && c.man.type !== 'reverse') {
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
          } else if (ob === 'car' && this.t - c.interruptT > P['traffic.deadlockTimeout'] && Math.abs(c.d) > P['world.laneWidth'] / 2) {
            // Unstick: the car on the wrong side gives way. It backs up to make room, then returns to its lane.
            const lead = this.leadGap(c), back = Math.max(0, P['proto.unstick.reverseGap'] - (lead ? lead.gap : 0));
            c.man = null; c.dodge = null;
            this.commit(c, { type: 'reverse', sTarget: c.s - back }, 'unstick', null);
            this.emit('unstick', { car: c.id, how: 'reverse' });
          }
          continue;
        }
        // Unstick: stopped with nothing left to wait for. Forget the old plan and drive on.
        c.stillT = c.v < 2 ? (c.stillT || 0) + dt : 0;
        if (c.stillT >= P['traffic.deadlockTimeout'] && (c.man || c.intent || c.dodge || c.signal != null) && !this.reasonToWait(c, det, hz)) {
          c.man = null; c.intent = null; c.intentFor = null; c.dodge = null; c.signal = null; c.stillT = 0;
          c.state = 'cruise'; this.emit('unstick', { car: c.id, how: 'replan' });
        }
        if (c.man) continue;
        const lw = P['world.laneWidth'];
        const inPath = !!(hz && hz.inPath);
        const urgent = Math.abs(c.d) > lw / 2 && this.oncomingAhead(c, 420);
        const passed = !c.dodge || c.s - c.L / 2 > c.dodge.s + P['proto.returnClearance'];
        const canReturn = Math.abs(c.d) > 0.5 && !this.bodyBeside(c, -c.d) && !this.carBeside(c, -c.d) &&
          (urgent || (!det.fwd && !inPath && passed && !this.corridorBlocked(c, -c.d)));
        let holdSpeed = false;
        if (canReturn) {
          c.intentFor = null;
          if (c.signal == null || !c.intent || !c.intent.ret) { c.signal = this.t; c.intent = { type: 'shift', d0: c.d, d1: 0, len: P['proto.swerveLength'], v0: c.v, ret: true }; }
          if (this.t - c.signal >= P['proto.returnSignalSeconds'] - 1e-9) { const plan = c.intent; c.dodge = null; if (c.v < P['proto.driver.passSpeed']) plan.vCap = P['proto.driver.passSpeed']; this.commit(c, plan, urgent ? 'yield' : 'return', null); continue; }
          c.state = 'intention'; holdSpeed = true;
        } else if (inPath) {
          // Pedestrian in the road: stop beyond lunge range and wait. After waiting, pass slowly with 2 m clearance if the way is clear.
          c.signal = null;
          if (c.pathT >= reactPath - 1e-9) {
            if (c.holdT != null && c.holdT >= P['proto.driver.patienceSeconds']) {
              const plan = this.choose(c, hz, { pass: true });
              if (plan.type === 'shift') { c.holdT = 0; this.commit(c, plan, 'pass', hz); continue; }
            }
            this.commit(c, this.choose(c, hz), 'body', hz); continue;
          }
          if (!c.intent || c.intentFor !== 'body') { c.intent = this.choose(c, hz); c.intentFor = 'body'; }
          c.state = 'intention';
        } else if (det.fwd) {
          // Obstruction (cone): pass slowly around it if the way is clear, else stop short of it.
          c.signal = null;
          if (!c.intent || c.intentFor !== det.fwd.id || c.intent.ret) { c.intent = this.choose(c, det.fwd); c.intentFor = det.fwd.id; }
          if (c.senseT >= P['perception.reactionDelay'] - 1e-9) { this.commit(c, c.intent, 'cone', det.fwd); continue; }
          c.state = 'intention';
        } else {
          c.signal = null; c.intent = null; c.intentFor = null;
          c.state = c.state === 'released' && this.t - c.releasedT < 0.25 ? 'released' : 'cruise';
        }
        // speed control: speed limit, caution near a pedestrian, two-second following gap
        let vT = c.cruise, decel = null;
        if (hz && !inPath && c.nearT >= P['perception.reactionDelay'] - 1e-9 && !holdSpeed) {
          const vc = P['proto.driver.cautionSpeed'];
          vT = Math.min(vT, vc);
          if (c.v > vc) decel = clamp((c.v * c.v - vc * vc) / (2 * Math.max(1, hz.lx + c.L)), P['traffic.comfortBraking'], P['traffic.hardBraking']);
          if (c.state === 'cruise' || c.state === 'released') c.state = 'caution';
        }
        const ahead = this.leadGap(c);
        let hard = false;
        if (ahead) {
          const need = P['traffic.minimumGap'] + P['traffic.timeGap'] * c.v;
          if (ahead.gap < need) vT = Math.min(vT, Math.max(0, ahead.v) * clamp(ahead.gap / need, 0, 1));
          if (ahead.gap < P['traffic.minimumGap'] || Math.cos(ahead.car.h - c.h) < -0.5) vT = 0;
          hard = ahead.gap < P['traffic.minimumGap'] + c.v * c.v / (2 * P['traffic.comfortBraking']);
        }
        const kb = this.terrain(c.x, c.y, 'carBraking'); // wet tarmac: braking × world.terrain.puddle.carBraking
        if (c.v < vT) c.v = Math.min(vT, c.v + P['traffic.acceleration'] * dt);
        else c.v = Math.max(vT, c.v - Math.min(hard ? P['traffic.hardBraking'] : decel != null ? decel : P['traffic.comfortBraking'], P['traffic.hardBraking'] * kb) * dt);
      }
    }
    moveCars(h, ts) {
      const P = this.P;
      for (const c of this.cars) {
        if (c.man) {
          let v = this.manSpeed(c, c.man, ts - c.man.t0);
          const kb = this.terrain(c.x, c.y, 'carBraking'); // on a puddle the plan asks for more braking than the tyres give
          if (kb < 1 && c.man.type !== 'reverse' && c.v > 0 && v < c.v - P['traffic.hardBraking'] * kb * h) {
            v = c.v - P['traffic.hardBraking'] * kb * h;
            if (!c.skid) { c.skid = true; this.emit('skid', { car: c.id, surface: this.surfaceAt(c.x, c.y) }); }
          } else if (kb >= 1) c.skid = false;
          c.v = v;
        }
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
        let learnedStandoff = null;
        if (P['proto.learn.standoffEnabled'] && lost > 0 && ct.stopped) {
          const m = this.models[c.cls], before = this.modelStandoff(m);
          if (before < P['proto.learn.standoffMax']) { m.standoffApplied++; learnedStandoff = this.modelStandoff(m); this.emit('learn-standoff', { model: m.id, from: before, to: learnedStandoff }); }
        }
        const part = this.partOf(ct.px, ct.py, assessed);
        b.parts[part] += lost;
        const ev = { car: c.id, model: c.model, cls: c.cls, zone: ct.zone, part, closing: +ct.closing.toFixed(3),
          angle: +ct.ph.angle.toFixed(1), dv: +ct.ph.dvd.toFixed(2), strike: +ct.ph.un.toFixed(2),
          raw: +raw.toFixed(3), assessed: +assessed.toFixed(3), lost: +lost.toFixed(3), health: +b.health.toFixed(3),
          carState: ct.carState, cause: ct.cause, bait, lunging: ct.lunging, learned, stopped: ct.stopped, learnedStandoff };
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
      r.ending = { kind, t: +(this.tOffset + this.t).toFixed(3), road: this.roadIndex + 1, writeOffs: this.totalWriteOffs(), points: Math.round(r.points), purchases: r.purchases.slice() };
      this.emit('ending', { kind });
      this.mile('ending', { kind });
      if (!this.body.alive && kind !== 'Non-compliant') {
        this.phase = 'writeoff'; this.phaseT = this.P['feedback.writeOffSeconds']; this.pendingPhase = 'ending';
      } else this.phase = 'ending';
    }
    checkTerminal() {
      const P = this.P, r = this.run;
      if (r.ending) return;
      const cleared = r.writeOffs >= this.quota;
      if (cleared && this.isFinal) return this.end('Licensed');
      if (!cleared && this.slot >= this.schedule.length && this.cars.every((c) => c.spent)) return this.end('Failed test');
      if (!this.body.alive) {
        r.credits++;
        const b = this.body;
        this.report = { chassis: b.chassis, hits: b.hits.slice(), points: Math.round(r.points - b.points0), credits: r.credits,
          roadCleared: cleared, nextRoad: cleared ? LEVEL_LIST[this.roadIndex + 1] : null };
        if (cleared) { this.emit('road-cleared', { road: this.roadIndex + 1 }); this.mile('road' + (this.roadIndex + 1) + 'Cleared'); }
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
      if (this.phase === 'hitstop' || this.phase === 'writeoff' || this.phase === 'scroll') {
        this.phaseT -= dt;
        if (this.phaseT <= 1e-9) this.phase = this.phase === 'writeoff' ? this.pendingPhase : 'play';
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
      if (this.phase === 'play') this.checkFlip();
      if (this.phase === 'play' && positive && P['feedback.hitStop'] > 0) { this.phase = 'hitstop'; this.phaseT = P['feedback.hitStop']; }
      this.effects = this.effects.filter((e) => this.t - e.t < 1.5);
    }

    // ----- districts (D24): crossing a gate flips to the next screen, Zelda-style
    checkFlip() {
      const D = this.district, b = this.body, P = this.P;
      if (!D || !b.alive) return;
      const W = P['world.width'], H = P['world.height'];
      const sd = b.x > W ? 'E' : b.x < 0 ? 'W' : b.y > H ? 'S' : b.y < 0 ? 'N' : null;
      if (!sd) return;
      const to = [D.cur[0] + SIDE[sd][0], D.cur[1] + SIDE[sd][1]];
      if (to[0] < 0 || to[1] < 0 || to[0] >= D.cols || to[1] >= D.rows) { b.x = clamp(b.x, 0, W); b.y = clamp(b.y, 0, H); return; }
      this.flip(sd, to);
    }
    flip(sd, to) {
      const D = this.district, b = this.body, P = this.P, from = D.cur.slice();
      // settle the screen being left: cones in flight land, cones on a drone go home, the held cone travels
      for (const cn of this.cones) {
        if (cn.state === 'flight') Object.assign(cn, { state: 'free', vx: 0, vy: 0 });
        if (cn.state === 'drone') Object.assign(cn, { state: 'free', x: cn.hx, y: cn.hy });
      }
      const held = b.held;
      if (held) { const old = D.cells[from[1]][from[0]]; old.cones = old.cones.filter((c) => c !== held); }
      // only the active screen runs: its traffic, drones and effects end here
      this.cars = []; this.drones = []; this.effects = [];
      D.cur = to; D.visited.add(to[1] * D.cols + to[0]);
      this.level = cellLevel(D, to, P);
      this.cones = this.conesFor(this.level);
      if (held) this.cones.push(held);
      b.x -= SIDE[sd][0] * P['world.width']; b.y -= SIDE[sd][1] * P['world.height'];
      this.nextAt = this.t + 0.5; // traffic on the new screen arrives from its own road ends
      D.lastFlip = { side: sd, from, to, t: this.t };
      this.phase = 'scroll'; this.phaseT = P['world.flipSeconds'];
      this.emit('screen', { from: cellName(from), to: cellName(to), side: sd, theme: this.level.theme });
      this.mile('firstScreen', { to: cellName(to) });
      if (D.visited.size === D.cols * D.rows) this.mile('districtExplored', { road: this.roadIndex + 1 });
    }
    screenName() { return this.district ? cellName(this.district.cur) : null; }
    // Can the dummy cross this edge at this point? Only inside the district, and only onto open ground on the far side.
    edgeOpen(sd, v) {
      const D = this.district;
      if (!D) return false;
      const nx = D.cur[0] + SIDE[sd][0], ny = D.cur[1] + SIDE[sd][1];
      if (nx < 0 || ny < 0 || nx >= D.cols || ny >= D.rows) return false;
      const P = this.P, r = P['body.radius'], W = P['world.width'], H = P['world.height'], nb = cellLevel(D, [nx, ny], P);
      const lx = sd === 'E' ? r + 1 : sd === 'W' ? W - r - 1 : v, ly = sd === 'S' ? r + 1 : sd === 'N' ? H - r - 1 : v;
      return lx >= r && lx <= W - r && ly >= r && ly <= H - r && nb.statics.every((st) => !circleRect(lx, ly, r, st));
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
      if (this.report && this.report.roadCleared) { this.phase = 'next'; return; }
      this.spawnBody(); this.phase = 'play'; this.report = null;
    }
    withdraw() {
      if (this.totalWriteOffs() < 1 || this.run.ending) return false;
      this.end('Non-compliant');
      return true;
    }
    trace() {
      const D = this.district;
      return { build: 'dummies-p3', level: this.levelId, params: this.P, run: this.run, milestones: this.milestones,
        models: this.models, events: this.events,
        district: D ? { start: cellName(D.start), cur: cellName(D.cur), path: D.path.map(cellName), visited: [...D.visited].map((k) => cellName([k % D.cols, Math.floor(k / D.cols)])) } : null };
    }
  }

  const api = { Sim, REG, PROTO, OVERRIDES, NODES, LEVELS, LEVEL_LIST, DIFFICULTIES, assess, impulseImpact, zoneOf, circleCar, pathAt, pathProject, DEG,
    planDistrict, cellLevel, cellName, edgeSpans, edgeCrossings, roadCenter, makePatches, roadDist, SIDE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DUMMIES = api;
})(typeof window !== 'undefined' ? window : globalThis);
