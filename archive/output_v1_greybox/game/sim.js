(function (root) {
  "use strict";

  var PARAMS = {
    world: { width: 960, height: 540 },
    road: { y: 270, halfWidth: 80 },
    dummy: {
      radius: 10, walkSpeed: 90, runSpeed: 190, accelTime: 0.6,
      lungeDistance: 130, lungeDuration: 0.2, recoveryTime: 0.7,
      maxHealth: 100, startX: 480, startY: 430
    },
    car: {
      length: 80, width: 40, cruiseSpeed: 220, minSpeed: 120,
      detectRange: 300, detectHalfAngleDeg: 35, commitDistance: 150,
      swerveClearance: 30, maxSteerRateDeg: 100, brakeDecel: 120,
      respawnDelay: 1.5
    },
    damage: { base: 20, perSpeed: 0.16, lungeMultiplier: 1.5 },
    reset: { delay: 1.5 }
  };

  var DEG = Math.PI / 180;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function wrapAngle(a) {
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  }

  function createSim(options) {
    options = options || {};
    var traffic = options.traffic === undefined ? true : !!options.traffic;
    var p = JSON.parse(JSON.stringify(PARAMS));
    return {
      params: p,
      seed: options.seed === undefined ? 1 : options.seed,
      rng: (options.seed === undefined ? 1 : options.seed) >>> 0,
      traffic: traffic,
      time: 0,
      score: 0,
      bodiesDestroyed: 0,
      contactActive: false,
      prevLunge: false,
      spawnTimer: 0,
      dummy: {
        x: p.dummy.startX, y: p.dummy.startY,
        facing: { x: 0, y: -1 },
        speed: 0, mode: "idle", health: p.dummy.maxHealth,
        holdTime: 0, lungeTimer: 0, lungeTravelled: 0,
        recoveryTimer: 0, resetTimer: 0
      },
      car: null
    };
  }

  function clampDummyToWorld(s) {
    var p = s.params, d = s.dummy, r = p.dummy.radius;
    d.x = clamp(d.x, r, p.world.width - r);
    d.y = clamp(d.y, r, p.world.height - r);
  }

  function updateDummy(s, input, dt) {
    var p = s.params, d = s.dummy, dp = p.dummy;
    if (d.holdTime === undefined) d.holdTime = 0;

    if (d.mode === "destroyed") {
      d.resetTimer -= dt;
      if (d.resetTimer <= 1e-9) {
        d.x = dp.startX; d.y = dp.startY;
        d.facing = { x: 0, y: -1 };
        d.speed = 0; d.health = dp.maxHealth; d.mode = "idle";
        d.holdTime = 0;
      }
      return;
    }

    if (d.mode === "recovering") {
      d.speed = 0;
      d.recoveryTimer -= dt;
      if (d.recoveryTimer <= 1e-9) {
        d.mode = "idle";
        d.holdTime = 0;
      }
      return;
    }

    if (d.mode === "idle") {
      var rising = !!input.lunge && !s.prevLunge;
      if (rising) {
        d.mode = "lunging";
        d.lungeTimer = 0;
        d.lungeTravelled = 0;
        d.speed = dp.lungeDistance / dp.lungeDuration;
        d.holdTime = 0;
      } else {
        var dx = input.dx || 0, dy = input.dy || 0;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) {
          d.speed = 0;
          d.holdTime = 0;
        } else {
          dx /= len; dy /= len;
          d.holdTime += dt;
          d.speed = dp.walkSpeed + (dp.runSpeed - dp.walkSpeed) * Math.min(1, d.holdTime / dp.accelTime);
          d.x += dx * d.speed * dt;
          d.y += dy * d.speed * dt;
          d.facing = { x: dx, y: dy };
          clampDummyToWorld(s);
        }
        return;
      }
    }

    if (d.mode === "lunging") {
      var v = dp.lungeDistance / dp.lungeDuration;
      var remaining = dp.lungeDistance - d.lungeTravelled;
      var stepLen = Math.min(v * dt, remaining);
      d.x += d.facing.x * stepLen;
      d.y += d.facing.y * stepLen;
      d.lungeTravelled += stepLen;
      d.lungeTimer += dt;
      d.speed = v;
      if (dp.lungeDistance - d.lungeTravelled <= 1e-6 || d.lungeTimer >= dp.lungeDuration + 1e-9) {
        // clip any leftover so total is exact
        var left = dp.lungeDistance - d.lungeTravelled;
        if (left > 0) {
          d.x += d.facing.x * left;
          d.y += d.facing.y * left;
          d.lungeTravelled = dp.lungeDistance;
        }
        clampDummyToWorld(s);
        d.mode = "recovering";
        d.speed = 0;
        d.recoveryTimer = dp.recoveryTime;
      }
    }
  }

  function detects(s, c) {
    var d = s.dummy, cp = s.params.car;
    if (d.mode === "destroyed") return false;
    var dx = d.x - c.x, dy = d.y - c.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > cp.detectRange) return false;
    var ch = Math.cos(c.heading), sh = Math.sin(c.heading);
    var lx = dx * ch + dy * sh;
    var ly = -dx * sh + dy * ch;
    if (lx <= 0) return false;
    return Math.atan2(Math.abs(ly), lx) <= cp.detectHalfAngleDeg * DEG;
  }

  function computeRoute(s, c) {
    var p = s.params, cp = p.car, d = s.dummy;
    var corridor = cp.width / 2 + p.dummy.radius + cp.swerveClearance;
    var targetY = p.road.y;
    if (d.x > c.x - cp.length / 2 && Math.abs(d.y - p.road.y) < corridor) {
      targetY = d.y >= p.road.y ? d.y - corridor : d.y + corridor;
    }
    var lim = p.road.halfWidth - cp.width / 2;
    targetY = clamp(targetY, p.road.y - lim, p.road.y + lim);
    var vx = cp.commitDistance, vy = targetY - c.y;
    var l = Math.sqrt(vx * vx + vy * vy);
    return { route: { x: vx / l, y: vy / l }, targetY: targetY };
  }

  function updateCar(s, dt) {
    var p = s.params, cp = p.car, d = s.dummy;
    var lim = p.road.halfWidth - cp.width / 2;
    var minY = p.road.y - lim, maxY = p.road.y + lim;
    var c = s.car;

    if (!c) {
      if (!s.traffic) return;
      s.spawnTimer += dt;
      if (s.spawnTimer >= cp.respawnDelay - 1e-9) {
        s.car = {
          x: -cp.length, y: p.road.y, heading: 0, speed: cp.cruiseSpeed,
          mode: "cruising", braking: false, route: null
        };
        s.spawnTimer = 0;
      }
      return;
    }

    // pass reset
    if (c.mode === "detected" || c.mode === "committed") {
      if (d.mode === "destroyed" || (c.x - d.x) > cp.length) {
        c.mode = "cruising";
        c.route = null;
        c.lockedRoute = null;
        c.lockedTargetY = null;
      }
    }
    // detection
    if (c.mode === "cruising" && detects(s, c)) {
      c.mode = "detected";
    }
    // route
    if (c.mode === "detected") {
      var r = computeRoute(s, c);
      c.route = r.route;
      c.targetY = r.targetY;
      var ddx = d.x - c.x, ddy = d.y - c.y;
      if (Math.sqrt(ddx * ddx + ddy * ddy) <= cp.commitDistance) {
        c.lockedRoute = { x: r.route.x, y: r.route.y };
        c.lockedTargetY = r.targetY;
        c.mode = "committed";
      }
    }

    // steering
    var targetAngle;
    if (c.mode === "detected") {
      targetAngle = Math.atan2(c.route.y, c.route.x);
    } else if (c.mode === "committed") {
      if (!c.lockedRoute) c.lockedRoute = { x: c.route.x, y: c.route.y };
      if (c.lockedTargetY === undefined || c.lockedTargetY === null) c.lockedTargetY = c.y;
      if (Math.abs(c.y - c.lockedTargetY) <= 1.5) targetAngle = 0;
      else targetAngle = Math.atan2(c.lockedRoute.y, c.lockedRoute.x);
    } else {
      var ty = clamp(p.road.y, minY, maxY);
      targetAngle = Math.atan2(ty - c.y, cp.commitDistance);
    }
    var diff = wrapAngle(targetAngle - c.heading);
    var maxd = cp.maxSteerRateDeg * DEG * dt;
    c.heading += clamp(diff, -maxd, maxd);

    // speed
    var prev = c.speed;
    if (c.mode === "cruising") {
      c.speed = Math.min(cp.cruiseSpeed, c.speed + cp.brakeDecel * dt);
      if (c.speed < prev) c.speed = prev;
    } else if (c.speed > cp.minSpeed) {
      c.speed = Math.max(cp.minSpeed, c.speed - cp.brakeDecel * dt);
    }
    c.braking = c.speed < prev;

    // move
    c.x += Math.cos(c.heading) * c.speed * dt;
    c.y += Math.sin(c.heading) * c.speed * dt;
    c.y = clamp(c.y, minY, maxY);

    if (c.x - cp.length / 2 > p.world.width) {
      s.car = null;
      s.spawnTimer = 0;
    }
  }

  function collide(s) {
    var c = s.car, d = s.dummy, p = s.params;
    if (!c || d.mode === "destroyed") {
      s.contactActive = false;
      return;
    }
    var L = p.car.length, W = p.car.width, r = p.dummy.radius;
    var ch = Math.cos(c.heading), sh = Math.sin(c.heading);
    var dx = d.x - c.x, dy = d.y - c.y;
    var lx = dx * ch + dy * sh;
    var ly = -dx * sh + dy * ch;
    var cx = clamp(lx, -L / 2, L / 2);
    var cy = clamp(ly, -W / 2, W / 2);
    var ex = lx - cx, ey = ly - cy;
    var d2 = ex * ex + ey * ey;
    var overlap = d2 < r * r;
    if (!overlap) {
      s.contactActive = false;
      return;
    }
    if (s.contactActive) return;
    s.contactActive = true;

    var rear = lx < -L / 4;
    var wasLunging = d.mode === "lunging";

    // push out
    var nlx, nly, eps = 0.01;
    if (d2 > 1e-12) {
      var dist = Math.sqrt(d2);
      nlx = cx + ex / dist * (r + eps);
      nly = cy + ey / dist * (r + eps);
    } else {
      var pxr = L / 2 - Math.abs(lx), pyr = W / 2 - Math.abs(ly);
      nlx = lx; nly = ly;
      if (pxr < pyr) nlx = (lx >= 0 ? 1 : -1) * (L / 2 + r + eps);
      else nly = (ly >= 0 ? 1 : -1) * (W / 2 + r + eps);
    }
    d.x = c.x + nlx * ch - nly * sh;
    d.y = c.y + nlx * sh + nly * ch;
    clampDummyToWorld(s);

    if (wasLunging) {
      d.mode = "idle";
      d.speed = 0;
      d.holdTime = 0;
    }

    if (!rear) {
      var dmg = p.damage.base + p.damage.perSpeed * c.speed;
      if (wasLunging) dmg *= p.damage.lungeMultiplier;
      var loss = Math.min(d.health, dmg);
      d.health -= loss;
      s.score += loss;
      if (d.health <= 0) {
        d.health = 0;
        d.mode = "destroyed";
        s.bodiesDestroyed += 1;
        d.speed = 0;
        d.resetTimer = p.reset.delay;
      }
    }
  }

  function step(state, input, dt) {
    input = input || { dx: 0, dy: 0, lunge: false };
    state.time += dt;
    updateDummy(state, input, dt);
    updateCar(state, dt);
    collide(state);
    state.prevLunge = !!input.lunge;
    return state;
  }

  var api = { createSim: createSim, step: step, PARAMS: PARAMS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DummiesSim = api;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
