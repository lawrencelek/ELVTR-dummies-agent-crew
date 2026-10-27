// DUMMIES jump (GDD Edit 76), after Link's Awakening's Roc's Feather: the jump keeps the speed you jump with.
// Shared by Prototype 6.6 (sim.js) and the jump test yard (prototypes/jump). No DOM; the tests run it headless.
// - Height and time in the air are fixed: upgrades.jumpHeight at the top, upgrades.jumpAirtime from take-off to landing.
// - Ground covered = take-off speed × airtime. Standing: straight up. Walking, running: that speed. During a dash: the dash's
//   speed, a long jump. Every take-off speed is capped at upgrades.jumpMaxSpeed.
// - A normal jump steers in the air: its velocity turns toward the input, at the take-off speed (at least walking pace), by at
//   most upgrades.jumpAirAccel per second. No input: the momentum holds. A dash jump is committed: no steering.
(function (root) {
  'use strict';
  const hyp = Math.hypot;
  function takeoff(P, vx, vy, dash) {
    let sp = hyp(vx, vy); const cap = P['upgrades.jumpMaxSpeed'];
    if (sp > cap) { vx *= cap / sp; vy *= cap / sp; sp = cap; }
    const walk = P['movement.walkSpeed'], kind = dash ? 'dash' : sp < 1 ? 'stand' : sp <= walk * 1.05 ? 'walk' : 'run';
    return { t: 0, T: P['upgrades.jumpAirtime'], H: P['upgrades.jumpHeight'], vx, vy, v0: sp, steer: !dash, kind };
  }
  function z(J, t) { const T = J.T; t = t == null ? J.t : t; return t <= 0 || t >= T ? 0 : 4 * J.H * t * (T - t) / (T * T); }
  function air(P, J, mx, my, dt) { // steer a normal jump toward the input
    if (!J.steer) return;
    const m = hyp(mx || 0, my || 0); if (m < 0.05) return;
    const sp = Math.max(J.v0, P['movement.walkSpeed']) * Math.min(1, m), tx = mx / m * sp, ty = my / m * sp;
    const dx = tx - J.vx, dy = ty - J.vy, d = hyp(dx, dy), a = P['upgrades.jumpAirAccel'] * dt;
    if (d <= a) { J.vx = tx; J.vy = ty; } else { J.vx += dx / d * a; J.vy += dy / d * a; }
  }
  function slide(J, nx, ny) { const vn = J.vx * nx + J.vy * ny; if (vn < 0) { J.vx -= vn * nx; J.vy -= vn * ny; } } // along a wall it meets
  // The part of the flight above height h: [t0, t1], or null if the top is lower
  function above(P, h) { const H = P['upgrades.jumpHeight'], T = P['upgrades.jumpAirtime']; if (h >= H) return null; const r = Math.sqrt(1 - Math.max(0, h) / H); return [T * (1 - r) / 2, T * (1 + r) / 2]; }
  // Ground covered at speed v, in all and while above h. A thing d deep clears if the body (2r) and d fit inside that stretch.
  function reach(P, v) { return v * P['upgrades.jumpAirtime']; }
  function over(P, v, h) { const w = above(P, h); return w ? v * (w[1] - w[0]) : 0; }
  function clears(P, v, h, d, r) { return over(P, v, h) >= d + 2 * r; }
  function speeds(P) { // the four take-offs: standing, walking, running, a dash jump at the cap
    return { stand: 0, walk: P['movement.walkSpeed'], run: P['movement.runSpeed'], dash: P['upgrades.jumpMaxSpeed'] };
  }
  const api = { takeoff, z, air, slide, above, reach, over, clears, speeds };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.JUMP = api;
})(typeof window !== 'undefined' ? window : globalThis);
