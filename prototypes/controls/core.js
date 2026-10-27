// DUMMIES controls prototype (GDD Edit 73): the dummy's movement core, shared by the Phaser page and the headless tests.
// No Phaser here. Every number comes from P, the registry values the build injects (content/params/tuning.parameters.json).
//
// Turn models (proto.turnModel):
//   1 LAG    — Prototype 6.4. The body moves where the input points at once; its facing follows at movement.turnRate.
//              While facing is off the input by more than movement.alignThreshold, speed drops to
//              movement.turningSpeedFraction. A reversal past movement.counterPressAngle stops it briefly. The lunge goes
//              where the body faces, so a lunge just after a turn goes the old way.
//   2 DIRECT — facing follows the input (or the aim) at movement.directTurnRate, no speed penalty, no reversal stop.
//              The lunge goes where the player points at the press: the aim, else the move input, else the facing.
//   3 PIVOT  — past movement.pivotAngle the dummy plants and pivots at movement.pivotRate, then sets off; smaller changes
//              turn on the move at the same rate. The lunge goes where the body faces.
// Aim (right stick, or the mouse): in every model, facing follows the aim instead of the move input.
(function (root) {
  'use strict';
  const DEG = Math.PI / 180, TAU = Math.PI * 2;
  const hyp = Math.hypot, clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const wrap = (a) => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };
  const turnTo = (a, t, max) => { const d = wrap(t - a); return Math.abs(d) <= max ? t : wrap(a + Math.sign(d) * max); };
  const MODELS = {
    1: { key: 'lag', name: 'LAG', label: '6.4 · facing lags', note: 'Moves at once; facing catches up at the turn rate. Lunge goes where it faces.' },
    2: { key: 'direct', name: 'DIRECT', label: 'Direct', note: 'Faces where you point. Lunge goes where you point at the press.' },
    3: { key: 'pivot', name: 'PIVOT', label: 'Plant & pivot', note: 'A sharp turn plants and pivots fast, then goes. Lunge goes where it faces.' },
  };

  // Analog stick: a radial dead zone, then a rescale so the stick's usable travel spans 0..1.
  function stick(x, y, dz, outer) {
    const m = hyp(x, y);
    if (m < dz) return { x: 0, y: 0, m: 0 };
    const k = clamp((m - dz) / Math.max(1e-6, outer - dz), 0, 1);
    return { x: (x / m) * k, y: (y / m) * k, m: k };
  }
  // Touch d-pad: the finger's offset from the pad's centre, snapped to `dirs` directions; full magnitude.
  function dpad(dx, dy, dead, dirs) {
    const m = hyp(dx, dy);
    if (m < dead) return { x: 0, y: 0, m: 0, sector: -1 };
    const step = TAU / dirs, sector = ((Math.round(Math.atan2(dy, dx) / step) % dirs) + dirs) % dirs, a = sector * step;
    return { x: Math.cos(a), y: Math.sin(a), m: 1, sector };
  }

  function newBody(x, y, facing) {
    return { x, y, vx: 0, vy: 0, facing: facing || 0, mode: 'idle', rampT: 0, coastT: 0, coastVx: 0, coastVy: 0, counterT: 0, counterVx: 0, counterVy: 0,
      lunge: null, recoverT: 0, held: null, planted: false, knockT: 0, knockVx: 0, knockVy: 0, lastLunge: null };
  }

  // One step. it: { mx, my, m (0..1 move magnitude), ax, ay (unit aim) or aim null, lunge (pressed this step), grab (pressed) }.
  // Returns events: [{ type: 'lunge', dir, inputDir, err } | { type: 'grab' } ...]; the caller handles cones.
  function step(b, it, dt, P, model) {
    const ev = [];
    const m = it.m || 0, has = m > 0, ix = has ? it.mx / (hyp(it.mx, it.my) || 1) : 0, iy = has ? it.my / (hyp(it.mx, it.my) || 1) : 0;
    const inAng = has ? Math.atan2(iy, ix) : null, aimAng = it.aim ? Math.atan2(it.aim.y, it.aim.x) : null;
    const target = aimAng != null ? aimAng : inAng;
    const carry = b.held ? P['upgrades.carrySpeed'] : 1;
    const rate = (model === 1 ? P['movement.turnRate'] : model === 2 ? P['movement.directTurnRate'] : P['movement.pivotRate']) * DEG;

    if (it.grab) ev.push({ type: 'grab' });
    if (it.lunge && b.mode !== 'lunge' && b.mode !== 'recover' && b.mode !== 'knock') {
      const dir = model === 2 ? (aimAng != null ? aimAng : inAng != null ? inAng : b.facing) : b.facing;
      const want = aimAng != null ? aimAng : inAng != null ? inAng : b.facing;
      const T = P['movement.lungeDuration'], R = P['movement.lungeDistance'];
      b.lunge = { dir, R, T, tf: T * P['movement.lungeFastTimeFraction'], df: P['movement.lungeFastDistanceFraction'], t: 0, x0: b.x, y0: b.y };
      b.mode = 'lunge'; b.facing = dir; b.rampT = 0; b.planted = false;
      b.lastLunge = { dir, want, err: Math.abs(wrap(dir - want)) / DEG };
      ev.push({ type: 'lunge', dir, want, err: b.lastLunge.err });
    }

    if (b.mode === 'lunge') {
      const L = b.lunge, spd = L.t < L.tf - 1e-9 ? (L.R * L.df) / L.tf : (L.R * (1 - L.df)) / (L.T - L.tf);
      b.vx = Math.cos(L.dir) * spd; b.vy = Math.sin(L.dir) * spd; L.t += dt;
      if (L.t >= L.T - 1e-9) { b.mode = 'recover'; b.recoverT = 0; b.lunge = null; }
    } else if (b.mode === 'recover') {
      b.recoverT += dt;
      if (target != null) b.facing = turnTo(b.facing, target, rate * dt);
      const f = clamp(b.recoverT / P['movement.lungeRecovery'], 0, 1);
      b.vx = has ? ix * P['movement.walkSpeed'] * f * carry * m : 0; b.vy = has ? iy * P['movement.walkSpeed'] * f * carry * m : 0;
      if (b.recoverT >= P['movement.lungeRecovery'] - 1e-9) { b.mode = has ? 'move' : 'idle'; b.rampT = 0; }
    } else if (b.mode === 'knock') {
      b.knockT += dt; const k = Math.max(0, 1 - b.knockT / 0.3);
      b.vx = b.knockVx * k; b.vy = b.knockVy * k;
      if (k === 0) { b.mode = 'idle'; b.rampT = 0; }
    } else if (b.mode === 'counter') {
      b.counterT += dt;
      if (target != null) b.facing = turnTo(b.facing, target, rate * dt);
      const dur = P['movement.stopSeconds'] * P['movement.counterPressStop'], k = Math.max(0, 1 - b.counterT / dur);
      b.vx = b.counterVx * k; b.vy = b.counterVy * k;
      if (b.counterT >= dur - 1e-9) { b.mode = has ? 'move' : 'idle'; b.rampT = 0; b.vx = 0; b.vy = 0; }
    } else if (has) {
      const sp = hyp(b.vx, b.vy);
      if (model === 1 && sp > 1 && Math.abs(wrap(inAng - Math.atan2(b.vy, b.vx))) > P['movement.counterPressAngle'] * DEG) {
        b.mode = 'counter'; b.counterT = 0; b.counterVx = b.vx; b.counterVy = b.vy; b.rampT = 0;
        b.facing = turnTo(b.facing, target, rate * dt);
      } else {
        if (b.mode !== 'move') { b.mode = 'move'; b.rampT = 0; }
        const off = Math.abs(wrap(target - b.facing));
        if (model === 3) { // plant on a sharp turn; set off once within the align threshold
          if (off > P['movement.pivotAngle'] * DEG) b.planted = true;
          if (b.planted && off <= P['movement.alignThreshold'] * DEG) { b.planted = false; b.rampT = 0; }
        }
        b.facing = turnTo(b.facing, target, rate * dt);
        if (model === 3 && b.planted) { b.vx = 0; b.vy = 0; }
        else {
          b.rampT += dt;
          let spd = P['movement.walkSpeed'] + (P['movement.runSpeed'] - P['movement.walkSpeed']) * clamp(b.rampT / P['movement.rampSeconds'], 0, 1);
          if (model === 1 && Math.abs(wrap(target - b.facing)) > P['movement.alignThreshold'] * DEG) spd *= P['movement.turningSpeedFraction'];
          spd *= carry * m;
          b.vx = ix * spd; b.vy = iy * spd;
        }
      }
    } else {
      if (aimAng != null) b.facing = turnTo(b.facing, aimAng, rate * dt);
      b.planted = false;
      if (b.mode === 'move') { b.mode = 'coast'; b.coastT = 0; b.coastVx = b.vx; b.coastVy = b.vy; b.rampT = 0; }
      if (b.mode === 'coast') {
        b.coastT += dt; const k = Math.max(0, 1 - b.coastT / P['movement.stopSeconds']);
        b.vx = b.coastVx * k; b.vy = b.coastVy * k; if (k === 0) b.mode = 'idle';
      } else { b.vx = 0; b.vy = 0; }
    }
    b.x += b.vx * dt; b.y += b.vy * dt;
    return ev;
  }

  // Headless measures for the GDD: how each model answers a turn.
  // turnTest: run along +x for `run` s at full input, turn the input by `deg`, press lunge `delay` s later.
  // Returns the lunge's error from the input (°), the distance covered in the 0.5 s after the turn, and the time until the
  // body moves along the new input at walk speed or more.
  function turnTest(P, model, deg, delay, run) {
    const b = newBody(0, 0, 0), dt = 1 / 120, a = deg * DEG; let t = 0, lungeErr = null, x0 = 0, y0 = 0, dist = null, settle = null;
    for (; t < run; t += dt) step(b, { mx: 1, my: 0, m: 1 }, dt, P, model);
    x0 = b.x; y0 = b.y;
    for (let u = 0; u < 1.5; u += dt) {
      const ev = step(b, { mx: Math.cos(a), my: Math.sin(a), m: 1, lunge: lungeErr == null && u >= delay - 1e-9 && delay >= 0 }, dt, P, model);
      for (const e of ev) if (e.type === 'lunge') lungeErr = e.err;
      if (dist == null && u >= 0.5 - 1e-9) dist = hyp(b.x - x0, b.y - y0);
      const along = b.vx * Math.cos(a) + b.vy * Math.sin(a);
      if (settle == null && b.mode !== 'lunge' && b.mode !== 'recover' && along >= P['movement.walkSpeed'] - 1e-6) settle = u;
    }
    return { lungeErr, dist, settle };
  }

  const api = { DEG, MODELS, stick, dpad, newBody, step, turnTest, wrap, turnTo, clamp };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CTRL = api;
})(typeof window !== 'undefined' ? window : globalThis);
