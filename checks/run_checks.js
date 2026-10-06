#!/usr/bin/env node
// Executable checks for the DUMMIES greybox slice.
// Usage: node checks/run_checks.js <build_dir> <spec.json>
// Prints a JSON report to stdout. Exit code 0 even when checks fail
// (the orchestrator reads the report); exit code 2 only on bad usage.
const fs = require("fs");
const path = require("path");

const [buildDir, specPath] = process.argv.slice(2);
if (!buildDir || !specPath) { console.error("usage: run_checks.js <build_dir> <spec.json>"); process.exit(2); }

const results = [];
function check(id, description, fn) {
  try {
    const detail = fn();
    results.push({ id, description, pass: true, detail: detail || "" });
  } catch (e) {
    results.push({ id, description, pass: false, detail: String(e && e.message ? e.message : e).slice(0, 600) });
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1e-9, Math.abs(b));

const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
const P = spec.params;
const simPath = path.resolve(buildDir, "sim.js");
const htmlPath = path.resolve(buildDir, "index.html");
let Sim = null;

check("load_sim", "sim.js loads in Node and exports createSim, step, PARAMS", () => {
  Sim = require(simPath);
  assert(typeof Sim.createSim === "function" && typeof Sim.step === "function", "createSim/step missing");
  assert(Sim.PARAMS && typeof Sim.PARAMS === "object", "PARAMS missing");
});

if (Sim) {
  const DT = 1 / 60;
  const NONE = { dx: 0, dy: 0, lunge: false };
  const DIRS = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  const fresh = (traffic) => Sim.createSim({ seed: 7, traffic });
  const centre = (s) => { s.dummy.x = P.world.width / 2; s.dummy.y = P.world.height / 2; };
  const run = (s, input, seconds) => { const n = Math.round(seconds / DT); for (let i = 0; i < n; i++) Sim.step(s, input, DT); };
  const waitForCar = (s, minX) => {
    for (let i = 0; i < 60 * 60; i++) { if (s.car && s.car.x >= minX && s.car.x < P.world.width * 0.5) return; s.dummy.x = 30; s.dummy.y = 30; Sim.step(s, NONE, DT); }
    throw new Error("no car reached x>=" + minX + " within 60 s of simulated time");
  };
  const park = (s) => { s.dummy.x = 30; s.dummy.y = 30; };
  const front = (s) => { const c = s.car, d = P.car.length / 2 + P.dummy.radius * 0.5;
    s.dummy.x = c.x + Math.cos(c.heading) * d; s.dummy.y = c.y + Math.sin(c.heading) * d; };
  const rear = (s) => { const c = s.car, d = P.car.length / 2 + P.dummy.radius * 0.5;
    s.dummy.x = c.x - Math.cos(c.heading) * d; s.dummy.y = c.y - Math.sin(c.heading) * d; };

  check("params_match_spec", "Builder's PARAMS equal the Designer's spec params (Designer output reached the Builder)", () => {
    const flat = (o, pre = "", out = {}) => { for (const k of Object.keys(o)) { const v = o[k]; if (v && typeof v === "object") flat(v, pre + k + ".", out); else out[pre + k] = v; } return out; };
    const a = flat(P), b = flat(Sim.PARAMS); const bad = [];
    for (const k of Object.keys(a)) if (a[k] !== b[k]) bad.push(`${k}: spec ${a[k]} vs build ${b[k]}`);
    assert(bad.length === 0, bad.slice(0, 8).join("; "));
    return Object.keys(a).length + " parameters identical";
  });

  check("state_shape", "createSim returns the contract state shape and is JSON-serialisable", () => {
    const s = fresh(false); JSON.stringify(s);
    for (const k of ["time", "score", "bodiesDestroyed", "dummy", "params"]) assert(k in s, "state." + k + " missing");
    for (const k of ["x", "y", "facing", "mode", "health"]) assert(k in s.dummy, "state.dummy." + k + " missing");
    assert(s.dummy.mode === "idle", "dummy.mode should start idle, got " + s.dummy.mode);
    assert(s.dummy.health === P.dummy.maxHealth, "dummy should start at maxHealth");
    assert(s.car === null || s.car === undefined, "traffic:false must not spawn a car");
  });

  check("move_speed_equal_8_directions", "Distance covered in 1 s is equal in all eight directions (within 1%) and travels the way the input points", () => {
    const d = DIRS.map(([dx, dy]) => { const s = fresh(false); centre(s); const x0 = s.dummy.x, y0 = s.dummy.y;
      run(s, { dx, dy, lunge: false }, 1.0); const mx = s.dummy.x - x0, my = s.dummy.y - y0, dist = Math.hypot(mx, my);
      assert(dist > 1, `no movement for input (${dx},${dy})`);
      const n = Math.hypot(dx, dy); assert((mx * dx + my * dy) / (dist * n) > 0.999, `wrong direction for input (${dx},${dy})`);
      return dist; });
    const lo = Math.min(...d), hi = Math.max(...d);
    assert((hi - lo) / hi <= 0.01, "distances differ: " + d.map(v => v.toFixed(2)).join(", "));
    return "distances px: " + d.map(v => v.toFixed(2)).join(", ");
  });

  check("run_speed_matches_spec", "After accelerating, speed equals spec runSpeed in cardinal and diagonal directions (within 2%)", () => {
    const out = [[1,0],[1,1]].map(([dx, dy]) => { const s = fresh(false); centre(s);
      run(s, { dx, dy, lunge: false }, P.dummy.accelTime + 0.25); centre(s); const x0 = s.dummy.x, y0 = s.dummy.y;
      Sim.step(s, { dx, dy, lunge: false }, DT); return Math.hypot(s.dummy.x - x0, s.dummy.y - y0) / DT; });
    out.forEach(v => assert(near(v, P.dummy.runSpeed, 0.02), `speed ${v.toFixed(2)} vs runSpeed ${P.dummy.runSpeed}`));
    return "measured px/s: " + out.map(v => v.toFixed(2)).join(", ");
  });

  const lunge = (dx, dy, during) => { const s = fresh(false); centre(s); Sim.step(s, { dx, dy, lunge: false }, DT); centre(s);
    const x0 = s.dummy.x, y0 = s.dummy.y; Sim.step(s, { dx: 0, dy: 0, lunge: true }, DT);
    assert(s.dummy.mode === "lunging", `lunge did not start for facing (${dx},${dy}); mode=${s.dummy.mode}`);
    let t = DT; while (s.dummy.mode === "lunging" && t < 5) { Sim.step(s, during || NONE, DT); t += DT; }
    assert(s.dummy.mode !== "lunging", "lunge never ended");
    return { s, mx: s.dummy.x - x0, my: s.dummy.y - y0, t }; };

  check("lunge_distance_equal_8_directions", "Lunge distance is equal in all eight directions (within 1%) and equals spec lungeDistance (within 2%)", () => {
    const d = DIRS.map(([dx, dy]) => { const r = lunge(dx, dy), dist = Math.hypot(r.mx, r.my), n = Math.hypot(dx, dy);
      assert((r.mx * dx + r.my * dy) / (dist * n) > 0.999, `lunge not along facing (${dx},${dy})`); return dist; });
    const lo = Math.min(...d), hi = Math.max(...d);
    assert((hi - lo) / hi <= 0.01, "lunge distances differ: " + d.map(v => v.toFixed(2)).join(", "));
    d.forEach(v => assert(near(v, P.dummy.lungeDistance, 0.02), `lunge ${v.toFixed(2)} vs spec ${P.dummy.lungeDistance}`));
    return "distances px: " + d.map(v => v.toFixed(2)).join(", ");
  });

  check("no_midair_steering", "Direction input during a lunge does not change its path", () => {
    const r = lunge(1, 0, { dx: 0, dy: 1, lunge: false });
    assert(Math.abs(r.my) < 0.5, "lunge drifted " + r.my.toFixed(2) + " px sideways under steering input");
    return "sideways drift " + r.my.toFixed(3) + " px";
  });

  check("miss_recovery_delay", "A missed lunge is followed by a recovery period with no movement, then control returns", () => {
    const r = lunge(1, 0), s = r.s;
    assert(s.dummy.mode === "recovering", "mode after missed lunge is " + s.dummy.mode);
    const x0 = s.dummy.x, y0 = s.dummy.y; let t = 0;
    while (s.dummy.mode === "recovering" && t < P.dummy.recoveryTime + 1) { Sim.step(s, { dx: 1, dy: 0, lunge: true }, DT); t += DT;
      if (s.dummy.mode === "recovering") assert(Math.hypot(s.dummy.x - x0, s.dummy.y - y0) < 0.01, "dummy moved while recovering"); }
    assert(s.dummy.mode !== "recovering", "recovery never ended");
    assert(t >= P.dummy.recoveryTime * 0.9 && t <= P.dummy.recoveryTime * 1.1 + 2 * DT, `recovery lasted ${t.toFixed(3)} s vs spec ${P.dummy.recoveryTime}`);
    return `recovery ${t.toFixed(3)} s`;
  });

  check("deterministic", "Same seed and same inputs give an identical state after 30 s", () => {
    const play = () => { const s = Sim.createSim({ seed: 42, traffic: true });
      for (let i = 0; i < 1800; i++) { const k = Math.floor(i / 23); Sim.step(s, { dx: (k % 3) - 1, dy: ((k * 7) % 3) - 1, lunge: i % 97 === 0 }, DT); } return JSON.stringify(s); };
    assert(play() === play(), "two identical runs diverged");
  });

  check("traffic_cruises_and_respawns", "An undetected sedan cruises left to right with no route chevron, leaves, and another appears", () => {
    const s = fresh(true); waitForCar(s, 60); const c0 = s.car; const x0 = c0.x;
    assert(c0.mode === "cruising", "undetected car mode is " + c0.mode); assert(!c0.route, "undetected car has a route chevron");
    park(s); run(s, NONE, 0.5); assert(s.car && s.car.x > x0, "car did not move in +x");
    assert(near(s.car.speed, P.car.cruiseSpeed, 0.02), `cruise speed ${s.car.speed} vs spec ${P.car.cruiseSpeed}`);
    let gone = false, back = false;
    for (let i = 0; i < 60 * 60 && !back; i++) { park(s); Sim.step(s, NONE, DT); if (!s.car) gone = true; else if (gone) back = true;
      else if (s.car.x < x0 - 50) { gone = true; back = true; } }
    assert(back, "no second car appeared within 60 s");
  });

  check("detect_commit_brake_and_avoid", "A dummy standing in the lane is detected (chevron appears), the route locks at commitment, brake lights show while slowing, and the sedan swerves past without contact", () => {
    const s = fresh(true); waitForCar(s, 0);
    const sx = Math.min(P.world.width - 60, s.car.x + P.car.detectRange + 150); s.dummy.x = sx; s.dummy.y = P.road.y;
    let sawDetected = false, sawCommitted = false, sawBrake = false, locked = null, brakeMismatch = 0, prevSpeed = s.car.speed, car = s.car;
    for (let i = 0; i < 60 * 30; i++) {
      Sim.step(s, NONE, DT); if (!s.car || s.car.x < car.x - 50) break; car = s.car;
      if (car.mode === "detected") { sawDetected = true; assert(car.route && isFinite(car.route.x) && isFinite(car.route.y), "detected car has no route"); }
      if (car.mode === "committed") { if (!sawCommitted) { sawCommitted = true; locked = { x: car.route.x, y: car.route.y }; s.dummy.y = P.road.y + (locked.y >= 0 ? -1 : 1) * 0; }
        assert(Math.abs(car.route.x - locked.x) < 1e-9 && Math.abs(car.route.y - locked.y) < 1e-9, "route changed after commitment"); }
      if (car.speed < prevSpeed - 1e-9) { if (car.braking) sawBrake = true; else brakeMismatch++; }
      prevSpeed = car.speed;
    }
    assert(sawDetected, "car never entered mode 'detected'"); assert(sawCommitted, "car never entered mode 'committed'");
    assert(sawBrake, "braking flag never true while slowing"); assert(brakeMismatch === 0, brakeMismatch + " steps slowed without braking=true");
    assert(s.dummy.health === P.dummy.maxHealth, "standing dummy was hit: sedan failed to swerve clear (health " + s.dummy.health + ")");
    return "detected, committed, braked, passed clear";
  });

  check("route_locked_against_bait", "After commitment, moving the dummy does not change the locked route (the bait works)", () => {
    const s = fresh(true); waitForCar(s, 0); s.dummy.x = Math.min(P.world.width - 60, s.car.x + P.car.detectRange + 150); s.dummy.y = P.road.y;
    let locked = null; for (let i = 0; i < 60 * 30 && s.car; i++) { Sim.step(s, NONE, DT); if (s.car && s.car.mode === "committed") { locked = { x: s.car.route.x, y: s.car.route.y }; break; } }
    assert(locked, "never committed");
    s.dummy.y = P.road.y + (locked.y > 0 ? 1 : -1) * (P.car.swerveClearance + 40) * (locked.y === 0 ? 1 : 1);
    for (let i = 0; i < 20 && s.car; i++) { Sim.step(s, NONE, DT); if (s.car) assert(s.car.mode === "committed" && Math.abs(s.car.route.x - locked.x) < 1e-9 && Math.abs(s.car.route.y - locked.y) < 1e-9, "route or mode changed after the dummy moved"); }
  });

  check("front_impact_damage_once", "A front impact reduces health and adds score exactly once per contact episode", () => {
    const s = fresh(true); waitForCar(s, 100); front(s); const h0 = s.dummy.health, sc0 = s.score;
    run(s, NONE, 0.1); const h1 = s.dummy.health, sc1 = s.score;
    assert(h1 < h0, "no damage from front impact"); assert(sc1 > sc0, "no score from front impact");
    run(s, NONE, 0.05); if (s.dummy.mode !== "destroyed") assert(s.dummy.health === h1 || s.dummy.health === h1, "ok");
    return `health ${h0} -> ${h1}, score ${sc0} -> ${sc1}`;
  });

  check("single_impact_per_episode", "Staying in contact does not apply damage every frame", () => {
    const s = fresh(true); waitForCar(s, 100); front(s); Sim.step(s, NONE, DT); Sim.step(s, NONE, DT);
    const h1 = s.dummy.health; assert(h1 < P.dummy.maxHealth, "no damage registered in first two steps");
    for (let i = 0; i < 4; i++) { front(s); Sim.step(s, NONE, DT); }
    assert(s.dummy.health === h1, `health kept dropping during one contact episode (${h1} -> ${s.dummy.health})`);
  });

  check("rear_contact_no_damage", "Contact with the rear of the car gives no damage and no score", () => {
    const s = fresh(true); waitForCar(s, 100); rear(s); run(s, NONE, 0.2);
    assert(s.dummy.health === P.dummy.maxHealth, "rear contact damaged the dummy"); assert(s.score === 0, "rear contact scored");
  });

  check("destruction_and_fresh_body", "Repeated front impacts destroy the body once, then a fresh body with full health appears", () => {
    const s = fresh(true); let hits = 0;
    while (s.bodiesDestroyed === 0 && hits < 12) { waitForCar(s, 100); front(s); run(s, NONE, 0.1); hits++; park(s); run(s, NONE, 0.3); }
    assert(s.bodiesDestroyed === 1, `bodiesDestroyed is ${s.bodiesDestroyed} after ${hits} front impacts`);
    let t = 0; while (s.dummy.mode === "destroyed" && t < P.reset.delay + 2) { Sim.step(s, NONE, DT); t += DT; }
    assert(s.dummy.mode === "idle", "dummy did not return to idle after reset delay; mode=" + s.dummy.mode);
    assert(s.dummy.health === P.dummy.maxHealth, "fresh body is not at maxHealth"); assert(s.bodiesDestroyed === 1, "write-off counted more than once");
    return `destroyed after ${hits} cruise-speed front impacts (GDD provisional target: 2)`;
  });

  check("sim_is_pure", "sim.js uses no Math.random, timers, clock or DOM", () => {
    const src = fs.readFileSync(simPath, "utf8"); const bad = ["Math.random", "setInterval", "setTimeout", "Date.now", "new Date", "document.", "requestAnimationFrame"].filter(t => src.includes(t));
    assert(bad.length === 0, "found: " + bad.join(", "));
  });
}

check("html_static", "index.html has a canvas, loads sim.js, handles the keyboard and makes no network requests", () => {
  const h = fs.readFileSync(htmlPath, "utf8");
  assert(/<canvas/i.test(h), "no <canvas>"); assert(/<script[^>]+src=["']sim\.js["']/i.test(h), "sim.js not loaded with a script tag");
  assert(/keydown/.test(h) && /keyup/.test(h), "keydown/keyup handlers missing"); assert(/DummiesSim/.test(h), "does not use DummiesSim");
  assert(!/https?:\/\//i.test(h), "contains an http(s) URL"); assert(/requestAnimationFrame/.test(h), "no render loop");
  const scripts = [...h.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  scripts.forEach(sc => { new Function(sc); });
  return scripts.length + " inline script(s) parse without syntax errors";
});

const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ total: results.length, passed: results.length - failed.length, failed: failed.length, all_passed: failed.length === 0, results }, null, 2));
