#!/usr/bin/env node
// Executable checks for the DUMMIES three-level vertical slice.
// Usage: node checks/run_checks.js <build_dir> <spec.json>
// Prints a JSON report to stdout. Exit code 0 even when checks fail
// (the orchestrator reads the report); exit code 2 only on bad usage.
const fs = require("fs");
const path = require("path");

const [buildDir, specPath] = process.argv.slice(2);
if (!buildDir || !specPath) { console.error("usage: run_checks.js <build_dir> <spec.json>"); process.exit(2); }

const results = [];
const reports = {};   // measured figures handed to the QA Reviewer along with the pass/fail results
function check(id, description, fn) {
  try { const detail = fn(); results.push({ id, description, pass: true, detail: detail || "" }); }
  catch (e) { results.push({ id, description, pass: false, detail: String(e && e.stack ? e.stack.split("\n").slice(0, 3).join(" | ") : e).slice(0, 700) }); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1e-9, Math.abs(b));
const f1 = (v) => Number(v).toFixed(1);

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
  const NONE = { dx: 0, dy: 0, lunge: false, confirm: false };
  const inp = (o) => Object.assign({}, NONE, o);
  const DIRS = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  const H = P.hall, R = P.dummy.radius;
  const mk = (o) => Sim.createSim(Object.assign({ seed: 7, level: 1, traffic: true, autostart: true }, o));
  const centre = (s) => { s.dummy.x = H.x + H.w / 2; s.dummy.y = H.y + H.h / 2; };
  const park = (s) => { s.dummy.x = H.x + R + 1; s.dummy.y = H.y + R + 1; s.dummy.vx = 0; s.dummy.vy = 0; };
  const run = (s, input, seconds, dt) => { dt = dt || DT; const n = Math.round(seconds / dt); for (let i = 0; i < n; i++) Sim.step(s, input, dt); };
  const keepAlive = (s) => { s.vehiclesSpawned = 0; };
  const inHall = (c, pad) => c.x > H.x + pad && c.x < H.x + H.w - pad && c.y > H.y + pad && c.y < H.y + H.h - pad;
  // step with the dummy parked in the corner until a car satisfying pred exists
  const waitForCar = (s, pred, maxSeconds) => {
    for (let i = 0; i < (maxSeconds || 60) * 60; i++) {
      const c = (s.cars || []).find(pred); if (c) return c;
      assert(s.mode === "play", "mode left play while waiting for a car: " + s.mode);
      park(s); keepAlive(s); Sim.step(s, NONE, DT);
    }
    throw new Error("no suitable car appeared within " + (maxSeconds || 60) + " s");
  };
  const fresh = (c) => !c.hit && inHall(c, 90) && c.speed > 1;
  const moving = (c) => fresh(c) && c.speed > 40;      // fast enough that a hit still pays after one step of braking
  const I = P.impact;
  const ZONES = { nose: "zoneNose", frontCorner: "zoneFrontCorner", flank: "zoneFlank", rearCorner: "zoneRearCorner", tail: "zoneTail" };
  const formula = (cls, speed, zone, lunging) => Math.min(I.maxPay, Math.round(I.basePoints * I[ZONES[zone]] * (lunging ? I.lungeMultiplier : 1) * (speed * P.classes[cls].mass) / (I.refSpeed * I.refMass)));
  // step through the write-off animation; returns how long mode "writeoff" lasted
  const throughWriteOff = (s, input) => { let t = 0; while (s.mode === "writeoff" && t < 5) { Sim.step(s, input || NONE, DT); t += DT; } return t; };
  const WW = P.world.width, WH = P.world.height;
  const half = (c) => ({ x: (c.dirY === 0 ? c.length : c.width) / 2, y: (c.dirY === 0 ? c.width : c.length) / 2 });
  // first pair of cars whose rectangles overlap inside the canvas, or null
  const carOverlap = (s) => { const cs = s.cars;
    for (let a = 0; a < cs.length; a++) for (let b = a + 1; b < cs.length; b++) { const A = cs[a], B = cs[b];
      if (!(A.x > 0 && A.x < WW && A.y > 0 && A.y < WH && B.x > 0 && B.x < WW && B.y > 0 && B.y < WH)) continue;
      const ha = half(A), hb = half(B), ox = ha.x + hb.x - Math.abs(A.x - B.x), oy = ha.y + hb.y - Math.abs(A.y - B.y);
      if (ox > 1.5 && oy > 1.5) return `t=${f1(s.time)} s: ${A.id}#${A.serial} (${f1(A.x)},${f1(A.y)}) dir(${A.dirX},${A.dirY}) overlaps ${B.id}#${B.serial} (${f1(B.x)},${f1(B.y)}) dir(${B.dirX},${B.dirY}) by ${f1(ox)} x ${f1(oy)} px`; }
    return null; };
  // a car that has crossed a road barrier on levels 1 and 2, or null
  const offRoad = (s) => { const L = P.levels[s.level - 1];
    for (const c of s.cars) { const h = half(c);
      if (L.kind === "road" && Math.abs(c.y - L.road.y) + h.y > L.road.halfWidth + L.road.shoulder + 0.75) return `t=${f1(s.time)} s: ${c.id}#${c.serial} at y=${f1(c.y)} is across the barrier (road y=${L.road.y}, limit ${L.road.halfWidth + L.road.shoulder})`;
      if (L.kind === "cross") { if (c.dirY === 0 && Math.abs(c.y - L.roadH.y) + h.y > L.roadH.halfWidth + L.roadH.shoulder + 0.75) return `t=${f1(s.time)} s: ${c.id}#${c.serial} at y=${f1(c.y)} is across the horizontal road's barrier`;
        if (c.dirX === 0 && Math.abs(c.x - L.roadV.x) + h.x > L.roadV.halfWidth + L.roadV.shoulder + 0.75) return `t=${f1(s.time)} s: ${c.id}#${c.serial} at x=${f1(c.x)} is across the vertical road's barrier`; } }
    return null; };
  // how far the dummy's circle reaches into a car (px), with the car, or null; ignored at the hall edge where it has nowhere to go
  const insideCar = (s) => { const d = s.dummy; if (d.x < H.x + R + 4 || d.x > H.x + H.w - R - 4 || d.y < H.y + R + 4 || d.y > H.y + H.h - R - 4) return null;
    for (const c of s.cars) { const h = half(c), qx = Math.max(-h.x, Math.min(h.x, d.x - c.x)), qy = Math.max(-h.y, Math.min(h.y, d.y - c.y));
      const dist = Math.hypot(d.x - c.x - qx, d.y - c.y - qy); if (R - dist > 1.5) return `t=${f1(s.time)} s: dummy at (${f1(d.x)},${f1(d.y)}) reaches ${f1(R - dist)} px into ${c.id}#${c.serial} at (${f1(c.x)},${f1(c.y)}) dir(${c.dirX},${c.dirY})`; }
    return null; };
  const touch = (s, c, sign) => { const d = c.length / 2 + R * 0.5;
    s.dummy.x = c.x + sign * c.dirX * d; s.dummy.y = c.y + sign * c.dirY * d; s.dummy.vx = 0; s.dummy.vy = 0; };

  check("params_match_spec", "Builder's PARAMS equal the Designer's spec params (Designer output reached the Builder)", () => {
    const flat = (o, pre, out) => { pre = pre || ""; out = out || {}; for (const k of Object.keys(o)) { const v = o[k]; if (v && typeof v === "object") flat(v, pre + k + ".", out); else out[pre + k] = v; } return out; };
    const a = flat(P), b = flat(Sim.PARAMS); const bad = [];
    for (const k of Object.keys(a)) if (a[k] !== b[k]) bad.push(`${k}: spec ${a[k]} vs build ${b[k]}`);
    assert(bad.length === 0, bad.length + " mismatches, e.g. " + bad.slice(0, 6).join("; "));
    return Object.keys(a).length + " parameters identical";
  });

  check("state_shape", "createSim returns the contract state shape, JSON-serialisable, for all three levels", () => {
    for (const level of [1, 2, 3]) {
      const s = mk({ level, traffic: false }); const j = JSON.parse(JSON.stringify(s));
      for (const k of ["params","time","mode","ending","card","level","quota","allocation","vehiclesSpawned","levelWriteOffs","bodiesDestroyed","score","dummy","cars"]) assert(k in j, "state." + k + " missing");
      for (const k of ["x","y","vx","vy","facing","health","lunging","recovering","serviceOn"]) assert(k in j.dummy, "state.dummy." + k + " missing");
      assert(s.mode === "play", "autostart:true should start in play, got " + s.mode);
      assert(s.level === level, "level option ignored"); const L = P.levels[level - 1];
      assert(s.quota === L.quota && s.allocation === L.allocation, `level ${level} quota/allocation do not match spec`);
      assert(s.dummy.health === P.dummy.maxHealth, "dummy should start at maxHealth");
      run(s, NONE, 5); assert(Array.isArray(s.cars) && s.cars.length === 0, "traffic:false must not spawn cars");
    }
  });

  check("attract_then_confirm", "Default start is the attract screen; a confirm press begins play", () => {
    const s = Sim.createSim({ seed: 3 }); assert(s.mode === "attract", "default mode is " + s.mode);
    const x0 = s.dummy.x; run(s, inp({ dx: 1 }), 0.3); assert(s.mode === "attract" && s.dummy.x === x0, "dummy moved or mode changed before confirm");
    Sim.step(s, inp({ confirm: true }), DT); Sim.step(s, NONE, DT); assert(s.mode === "play", "confirm did not start play; mode=" + s.mode);
  });

  const walkDist = (dx, dy, seconds, dt) => { const s = mk({ traffic: false }); centre(s); const x0 = s.dummy.x, y0 = s.dummy.y;
    run(s, inp({ dx, dy }), seconds, dt); return { d: Math.hypot(s.dummy.x - x0, s.dummy.y - y0), mx: s.dummy.x - x0, my: s.dummy.y - y0 }; };

  check("move_speed_equal_8_directions", "Distance covered in 1 s is equal in all eight directions (within 1%) and goes the way the input points", () => {
    const d = DIRS.map(([dx, dy]) => { const r = walkDist(dx, dy, 1.0); assert(r.d > 1, `no movement for input (${dx},${dy})`);
      assert((r.mx * dx + r.my * dy) / (r.d * Math.hypot(dx, dy)) > 0.999, `wrong direction for input (${dx},${dy})`); return r.d; });
    const lo = Math.min(...d), hi = Math.max(...d); assert((hi - lo) / hi <= 0.01, "distances differ: " + d.map(f1).join(", "));
    return "px in 1 s: " + d.map(f1).join(", ");
  });

  check("walk_frame_rate_independent", "Walking covers the same distance at 60 and 120 steps per second (within 2%)", () => {
    const a = walkDist(1, 0, 1.5, 1 / 60).d, b = walkDist(1, 0, 1.5, 1 / 120).d;
    assert(near(a, b, 0.02), `60 Hz ${f1(a)} px vs 120 Hz ${f1(b)} px`); return `60 Hz ${f1(a)} px, 120 Hz ${f1(b)} px`;
  });

  check("run_speed_matches_spec", "After the ramp, speed equals spec runSpeed straight and diagonal (within 3%)", () => {
    const out = [[1,0],[1,1]].map(([dx, dy]) => { const s = mk({ traffic: false }); centre(s);
      for (let t = 0; t < P.dummy.rampTime + 0.3; t += DT) { centre(s); Sim.step(s, inp({ dx, dy }), DT); }
      centre(s); const x0 = s.dummy.x, y0 = s.dummy.y; Sim.step(s, inp({ dx, dy }), DT); return Math.hypot(s.dummy.x - x0, s.dummy.y - y0) / DT; });
    out.forEach(v => assert(near(v, P.dummy.runSpeed, 0.03), `speed ${f1(v)} vs runSpeed ${P.dummy.runSpeed}`)); return "px/s: " + out.map(f1).join(", ");
  });

  // face a direction, release it, then press lunge alone: the lunge must go in the facing direction
  const lunge = (dx, dy, during, dt) => { dt = dt || DT; const s = mk({ traffic: false }); centre(s); Sim.step(s, inp({ dx, dy }), dt); Sim.step(s, NONE, dt); centre(s);
    const x0 = s.dummy.x, y0 = s.dummy.y; Sim.step(s, inp({ lunge: true }), dt);
    assert(s.dummy.lunging === true, `lunge did not start facing (${dx},${dy})`);
    let t = dt, half = null; const dur = P.dummy.lungeDuration;
    while (s.dummy.lunging && t < 5) { Sim.step(s, during || inp({ lunge: true }), dt); t += dt; if (half === null && t >= dur / 2) half = Math.hypot(s.dummy.x - x0, s.dummy.y - y0); }
    assert(!s.dummy.lunging, "lunge never ended");
    return { s, mx: s.dummy.x - x0, my: s.dummy.y - y0, d: Math.hypot(s.dummy.x - x0, s.dummy.y - y0), t, half }; };

  check("lunge_distance_equal_8_directions", "Lunge distance is equal in all eight directions (within 1%), equals spec lungeDistance (within 2%), and follows the facing direction when no direction is held", () => {
    const d = DIRS.map(([dx, dy]) => { const r = lunge(dx, dy); assert((r.mx * dx + r.my * dy) / (r.d * Math.hypot(dx, dy)) > 0.999, `lunge not along facing (${dx},${dy})`); return r.d; });
    const lo = Math.min(...d), hi = Math.max(...d); assert((hi - lo) / hi <= 0.01, "lunge distances differ: " + d.map(f1).join(", "));
    d.forEach(v => assert(near(v, P.dummy.lungeDistance, 0.02), `lunge ${f1(v)} vs spec ${P.dummy.lungeDistance}`)); return "px: " + d.map(f1).join(", ");
  });

  check("lunge_frame_rate_independent", "A lunge covers the same distance at 120 steps per second (within 2%)", () => {
    const r = lunge(1, 0, null, 1 / 120); assert(near(r.d, P.dummy.lungeDistance, 0.02), `120 Hz lunge ${f1(r.d)} vs spec ${P.dummy.lungeDistance}`); return f1(r.d) + " px";
  });

  check("lunge_eases_out", "The lunge is tweened: more than 60% of the distance is covered in the first half of its duration", () => {
    const r = lunge(1, 0); assert(r.half !== null, "lunge ended before half its duration"); const frac = r.half / r.d;
    assert(frac > 0.6, `only ${(frac * 100).toFixed(0)}% covered at half time (constant speed would be 50%)`); return (frac * 100).toFixed(0) + "% at half time";
  });

  check("no_midair_steering", "Direction input during a lunge does not change its path", () => {
    const r = lunge(1, 0, inp({ dy: 1, lunge: true })); assert(Math.abs(r.my) < 0.5, "lunge drifted " + f1(r.my) + " px sideways"); return "drift " + r.my.toFixed(3) + " px";
  });

  check("held_lunge_does_not_chain", "Holding the lunge button and a direction for 3 s starts exactly one lunge", () => {
    const s = mk({ traffic: false }); s.dummy.x = H.x + R + 5; s.dummy.y = H.y + H.h / 2; let starts = 0, prev = false;
    for (let i = 0; i < 180; i++) { Sim.step(s, inp({ dx: 1, lunge: true }), DT); if (s.dummy.lunging && !prev) starts++; prev = s.dummy.lunging; }
    assert(starts === 1, starts + " lunges started while the button was held"); return "1 lunge";
  });

  check("recovery_is_tweened", "After a lunge the dummy is 'recovering' for spec recoveryTime, can move during it, and starts slowly", () => {
    const r = lunge(1, 0, NONE), s = r.s, rt = P.dummy.recoveryTime; assert(rt >= 0.2 && rt <= 0.5, "spec recoveryTime outside 0.2-0.5: " + rt);
    assert(s.dummy.recovering === true, "recovering is not true right after the lunge");
    const x0 = s.dummy.x; let t = 0, early = null;
    while (s.dummy.recovering && t < rt + 1) { Sim.step(s, inp({ dx: 1 }), DT); t += DT; if (early === null && t >= rt * 0.2) early = s.dummy.x - x0; }
    assert(!s.dummy.recovering, "recovery never ended"); assert(t >= rt * 0.8 && t <= rt * 1.2 + 2 * DT, `recovery lasted ${t.toFixed(3)} s vs spec ${rt}`);
    const total = s.dummy.x - x0; assert(total > 0.5, "dummy could not move at all during recovery (hard freeze)");
    assert(early !== null && early < 0.5 * P.dummy.walkSpeed * rt * 0.2, `movement in the first fifth of recovery is not slowed (${f1(early)} px)`);
    return `recovery ${t.toFixed(2)} s, moved ${f1(total)} px during it`;
  });

  check("deterministic_and_seeded", "Same seed and inputs give an identical state after 40 s; a different seed gives different traffic", () => {
    const play = (seed) => { const s = mk({ seed, level: 3 });
      for (let i = 0; i < 2400; i++) { const k = Math.floor(i / 23); Sim.step(s, { dx: (k % 3) - 1, dy: ((k * 7) % 3) - 1, lunge: i % 97 < 3, confirm: i % 211 < 2 }, DT); } return JSON.stringify(s); };
    const a = play(42); assert(a === play(42), "two identical runs diverged");
    const traffic = (seed) => { const s = mk({ seed, level: 3 }); const seen = []; for (let i = 0; i < 900; i++) { park(s); keepAlive(s); Sim.step(s, NONE, DT); } return JSON.stringify(s.cars.map(c => [c.id, Math.round(c.x), Math.round(c.y)])); };
    assert(traffic(1) !== traffic(2), "seeds 1 and 2 produced identical traffic");
  });

  check("level1_road_flows_left_to_right", "Level 1: every car travels left to right inside the road band, at its class speed, and never stalls (dummy out of the way)", () => {
    const s = mk({ level: 1 }), L = P.levels[0]; assert(L.kind === "road" && L.road, "spec level 1 is not a road level");
    const last = {}; let seen = 0; const serials = new Set();
    for (let i = 0; i < 60 * 60; i++) { park(s); keepAlive(s); Sim.step(s, NONE, DT); assert(s.mode === "play", "mode left play: " + s.mode);
      for (const c of s.cars) { serials.add(c.serial);
        assert(c.dirX === 1 && c.dirY === 0, `car ${c.id} travels (${c.dirX},${c.dirY})`);
        assert(Math.abs(c.y - L.road.y) <= L.road.halfWidth, `car ${c.id} at y=${f1(c.y)} is outside the road band`);
        if (i % 60 === 0) { const p = last[c.serial]; if (p !== undefined) assert(c.x - p > 5, `car ${c.id} advanced only ${f1(c.x - p)} px in 1 s`); last[c.serial] = c.x; } } }
    assert(serials.size >= 8, "only " + serials.size + " cars in 60 s"); return serials.size + " cars in 60 s";
  });

  check("car_speed_real_time", "An undisturbed car's reported speed equals its class speed and its real displacement per second, at 60 and 120 steps per second", () => {
    const out = [1 / 60, 1 / 120].map(dt => { const s = mk({ level: 1 }); let c = null;
      for (let i = 0; i < 3600 && !c; i++) { park(s); keepAlive(s); Sim.step(s, NONE, dt); c = s.cars.find(k => inHall(k, 60) && k.x < H.x + H.w * 0.4 && s.cars.length === 1); }
      assert(c, "no lone car found"); const serial = c.serial, x0 = c.x; run(s, NONE, 1.0, dt); const c2 = s.cars.find(k => k.serial === serial); assert(c2, "car vanished within 1 s");
      const v = c2.x - x0, cls = P.classes[c2.cls].speed; assert(near(v, cls, 0.04), `moved ${f1(v)} px in 1 s vs class speed ${cls} (dt=1/${Math.round(1 / dt)})`);
      assert(near(c2.speed, cls, 0.04), `car.speed ${f1(c2.speed)} vs class speed ${cls}`); return f1(v); });
    return "px in 1 s at 60 / 120 Hz: " + out.join(" / ");
  });

  check("level2_cross_no_collisions", "Level 2: traffic uses both one-way roads (left to right, top to bottom), cars never overlap inside the canvas, and traffic keeps flowing for 150 s (no deadlock)", () => {
    const s = mk({ level: 2 }), L = P.levels[1]; assert(L.kind === "cross" && L.roadH && L.roadV, "spec level 2 is not a cross level");
    const seen = new Set(), gone = new Set(); let horiz = 0, vert = 0, worst = null; const W = P.world.width, HH = P.world.height;
    for (let i = 0; i < 150 * 60; i++) { park(s); keepAlive(s); Sim.step(s, NONE, DT); assert(s.mode === "play", "mode left play: " + s.mode);
      const now = new Set(); const cs = s.cars;
      for (const c of cs) { now.add(c.serial); if (!seen.has(c.serial)) { seen.add(c.serial); if (c.dirY === 0) horiz++; else vert++; }
        assert((c.dirX === 1 && c.dirY === 0) || (c.dirX === 0 && c.dirY === 1), `car ${c.id} travels (${c.dirX},${c.dirY}); level 2 roads are one-way, left to right and top to bottom`);
        if (c.dirY === 0) assert(Math.abs(c.y - L.roadH.y) <= L.roadH.halfWidth, `horizontal car ${c.id} off its road (y=${f1(c.y)})`);
        else assert(Math.abs(c.x - L.roadV.x) <= L.roadV.halfWidth, `vertical car ${c.id} off its road (x=${f1(c.x)})`); }
      for (const q of seen) if (!now.has(q)) gone.add(q);
      if (!worst) worst = carOverlap(s); }
    assert(!worst, "cars overlapped: " + worst); assert(horiz >= 5 && vert >= 5, `traffic not on both roads: ${horiz} horizontal, ${vert} vertical`);
    assert(gone.size >= 25, `only ${gone.size} cars got through in 150 s (deadlock or starvation)`); return `${gone.size} cars through, ${horiz} horizontal, ${vert} vertical, no overlap`;
  });

  check("level3_free_for_all", "Level 3: vehicles enter from at least three of the four edges, several classes appear, and cars never overlap inside the canvas", () => {
    const s = mk({ level: 3 }); const dirs = new Set(), classes = new Set(); let worst = null; const W = P.world.width, HH = P.world.height;
    for (let i = 0; i < 120 * 60; i++) { park(s); keepAlive(s); Sim.step(s, NONE, DT); assert(s.mode === "play", "mode left play: " + s.mode); const cs = s.cars;
      for (const c of cs) { dirs.add(c.dirX + "," + c.dirY); classes.add(c.cls); }
      if (!worst) worst = carOverlap(s); }
    assert(dirs.size >= 3, "cars came from only " + dirs.size + " directions"); assert(classes.size >= 4, "only " + classes.size + " classes appeared"); assert(!worst, "cars overlapped: " + worst);
    return dirs.size + " directions, " + classes.size + " classes, no overlap";
  });

  check("detection_commit_and_brake_flags", "A dummy standing in a lane is seen, the car commits to a side (lock) and the lock does not change afterwards", () => {
    const s = mk({ level: 1 }); const c0 = waitForCar(s, c => !c.hit && c.x > H.x - 40 && c.x < H.x + 120, 60); const serial = c0.serial;
    s.dummy.x = Math.min(H.x + H.w - 60, c0.x + 330); s.dummy.y = c0.y; let saw = false, lock = 0, changed = false;
    for (let i = 0; i < 60 * 12; i++) { keepAlive(s); Sim.step(s, NONE, DT); const c = s.cars.find(k => k.serial === serial); if (!c) break;
      if (c.sees) saw = true; if (c.lock !== 0) { if (lock === 0) lock = c.lock; else if (c.lock !== lock && c.cls !== "hatch") changed = true; }
      assert(typeof c.braking === "boolean" && typeof c.sees === "boolean", "sees/braking must be booleans"); if (s.mode !== "play") break; }
    assert(saw, "car never reported sees=true for a dummy standing in its lane"); const cls = P.classes[c0.cls];
    if (cls.swerve) { assert(lock !== 0, "swerving car never committed to a side"); assert(!changed, "lock changed side after commitment"); }
    return `${c0.id}: seen, lock ${lock}`;
  });

  check("front_impact_pays_once", "Front contact reduces health and adds score, once per car", () => {
    const s = mk({ level: 1 }); const c = waitForCar(s, moving, 60); const h0 = s.dummy.health, sc0 = s.score; touch(s, c, +1); run(s, NONE, 0.05);
    const h1 = s.dummy.health, sc1 = s.score; assert(h1 < h0, "no damage from front contact"); assert(sc1 > sc0, "no score from front contact");
    const c2 = s.cars.find(k => k.serial === c.serial); assert(c2 && c2.hit === true, "car.hit not set after impact");
    for (let i = 0; i < 6; i++) { const k = s.cars.find(q => q.serial === c.serial); if (!k) break; touch(s, k, +1); Sim.step(s, NONE, DT); }
    assert(s.dummy.health >= h1 - 1e-6, `health kept dropping on the same car (${h1} -> ${s.dummy.health})`); return `health ${f1(h0)} -> ${f1(h1)}, score +${f1(sc1 - sc0)}`;
  });

  check("tail_contact_pays_its_small_share", "Contact with the tail pays the tail share (5% of base, scaled by the car's speed and mass), and score rises by the same amount", () => {
    const s = mk({ level: 1 }); const c = waitForCar(s, moving, 60); const h0 = s.dummy.health; touch(s, c, -1);
    // measure on the step of the impact itself: a dummy that has been standing still is being repaired, which would hide a small hit a moment later
    for (let i = 0; i < 12 && !(s.lastImpact && s.lastImpact.serial === c.serial); i++) Sim.step(s, NONE, DT);
    const L = s.lastImpact; assert(L && L.serial === c.serial, "tail contact was not logged in state.lastImpact"); assert(L.face === "tail", "zone judged " + L.face);
    const want = formula(L.cls, L.vehicleSpeed, "tail", false); assert(Math.abs(L.damage - want) <= 1, `tail paid ${L.damage}, formula gives ${want}`);
    assert(Math.abs((h0 - s.dummy.health) - L.damage) <= 1.5 && Math.abs(s.score - L.damage) <= 1.5, "health or score did not move by the logged damage"); assert(L.damage > 0, "a moving car's tail paid nothing");
    return `${L.cls} at ${f1(L.vehicleSpeed)} px/s: tail pays ${L.damage}`;
  });

  check("write_off_animation_then_card", "At zero health the write-off is counted at once, the game holds in mode 'writeoff' for the specified time with everything frozen and confirm ignored, then the card appears and a fresh confirm gives a fresh body", () => {
    const dur = P.writeOff && P.writeOff.duration; assert(typeof dur === "number" && dur >= 0.9 && dur <= 1.4, "spec writeOff.duration must be between 0.9 and 1.4 s, got " + dur);
    const s = mk({ level: 1 }); const c = waitForCar(s, moving, 60); s.dummy.health = 0.5; touch(s, c, +1);
    for (let i = 0; i < 30 && s.mode === "play"; i++) Sim.step(s, NONE, DT);
    assert(s.bodiesDestroyed === 1 && s.levelWriteOffs === 1, `write-offs: run ${s.bodiesDestroyed}, level ${s.levelWriteOffs}`);
    assert(s.mode === "writeoff", "after the destroying hit the mode is " + s.mode + ", expected writeoff");
    const W = s.writeOff; assert(W && typeof W.t === "number" && near(W.duration, dur, 0.001) && typeof W.x === "number" && typeof W.y === "number", "state.writeOff is missing or incomplete: " + JSON.stringify(W));
    assert(s.card === null && s.ending === null, "card or ending set before the animation ended");
    const snap = () => JSON.stringify([s.dummy.x, s.dummy.y, s.cars.map(k => [k.serial, k.x, k.y]), s.vehiclesSpawned]); const before = snap(); let t0 = W.t;
    for (let i = 0; i < 12; i++) Sim.step(s, inp({ dx: 1, confirm: i % 4 < 2 }), DT);       // movement and confirm presses during the animation
    assert(s.mode === "writeoff", "the animation was cut short by input; mode=" + s.mode); assert(snap() === before, "something moved or spawned during the write-off animation");
    assert(s.writeOff.t > t0, "state.writeOff.t does not advance");
    const total = 12 * DT + throughWriteOff(s, inp({ confirm: true }));                       // confirm held to the end must not dismiss the card
    assert(Math.abs(total - dur) <= 0.08, `mode writeoff lasted ${total.toFixed(2)} s, specification says ${dur}`);
    assert(s.mode === "card" && s.card && typeof s.card.line === "string" && s.card.line.length > 5, "no report card after the animation; mode=" + s.mode);
    assert(s.writeOff === null, "state.writeOff not cleared after the animation"); assert(s.ending === null, "unexpected ending " + s.ending);
    run(s, inp({ confirm: true }), 0.3); assert(s.mode === "card", "a confirm held since the animation dismissed the card"); run(s, NONE, 0.3); assert(s.mode === "card", "card dismissed without confirm");
    Sim.step(s, inp({ confirm: true }), DT); Sim.step(s, NONE, DT); assert(s.mode === "play", "a fresh confirm did not dismiss the card; mode=" + s.mode);
    assert(s.dummy.health === P.dummy.maxHealth, "fresh body is not at maxHealth"); assert(s.bodiesDestroyed === 1, "write-off counted twice");
    return `animation ${total.toFixed(2)} s, frozen, confirm ignored, then the card`;
  });

  const endLevel = (s) => { for (let i = 0; i < 300 && s.mode === "play"; i++) { s.cars = []; s.vehiclesSpawned = s.allocation; Sim.step(s, NONE, DT); } };

  check("level_progression", "Quota met and allocation spent: level 1 -> 2 -> 3 via a card and confirm", () => {
    const s = mk({ level: 1 });
    for (const next of [2, 3]) { centre(s); Sim.step(s, inp({ lunge: true }), DT); for (let i = 0; i < 90; i++) { s.cars = []; Sim.step(s, NONE, DT); } s.levelWriteOffs = s.quota; park(s); endLevel(s);
      assert(s.mode === "card" && s.ending === null, `after level ${next - 1}: mode ${s.mode}, ending ${s.ending}`);
      Sim.step(s, inp({ confirm: true }), DT); Sim.step(s, NONE, DT);
      assert(s.level === next && s.mode === "play", `expected level ${next} in play, got level ${s.level} mode ${s.mode}`);
      const L = P.levels[next - 1]; assert(s.quota === L.quota && s.allocation === L.allocation && s.levelWriteOffs === 0 && s.vehiclesSpawned <= 1, "level counters not reset for level " + next); }
    return "1 -> 2 -> 3";
  });

  check("ending_decommissioned", "Allocation spent with the quota missed ends the run as 'decommissioned'", () => {
    const s = mk({ level: 1 }); s.levelWriteOffs = 0; endLevel(s); assert(s.ending === "decommissioned" && s.mode === "over", `mode ${s.mode}, ending ${s.ending}`);
    Sim.step(s, inp({ confirm: true }), DT); Sim.step(s, NONE, DT); assert((s.mode === "attract" || s.mode === "play") && s.level === 1 && s.ending === null && s.bodiesDestroyed === 0, `confirm after an ending did not restart the run (mode ${s.mode}, level ${s.level}, ending ${s.ending})`);
  });

  check("ending_licensed", "The write-off that reaches certificationTarget plays the write-off animation and then ends the run as 'licensed'", () => {
    const s = mk({ level: 3 }); const c = waitForCar(s, moving, 60); s.bodiesDestroyed = P.certificationTarget - 1; s.dummy.health = 0.5; touch(s, c, +1);
    for (let i = 0; i < 30 && s.mode === "play"; i++) Sim.step(s, NONE, DT);
    assert(s.mode === "writeoff" && s.ending === null, `after the winning hit: mode ${s.mode}, ending ${s.ending} (expected the write-off animation first)`); throughWriteOff(s);
    assert(s.ending === "licensed" && s.mode === "over", `mode ${s.mode}, ending ${s.ending}, bodies ${s.bodiesDestroyed}`);
    const sum = P.levels.reduce((a, l) => a + l.quota, 0); assert(P.certificationTarget > sum, `certificationTarget ${P.certificationTarget} must exceed quota sum ${sum}`);
  });

  check("levels_always_end_with_dummy_in_traffic", "With a dummy standing on the road (at each road edge, so cars must swerve), every level still runs to its end, cars never overlap, never cross a barrier, and the dummy is never left inside a car", () => {
    const spots = [];
    const L1 = P.levels[0], L2 = P.levels[1];
    spots.push({ level: 1, x: H.x + H.w * 0.55, y: L1.road.y + L1.road.halfWidth - 5 }, { level: 1, x: H.x + H.w * 0.55, y: L1.road.y - L1.road.halfWidth + 5 });
    spots.push({ level: 2, x: H.x + H.w * 0.25, y: L2.roadH.y + L2.roadH.halfWidth - 5 }, { level: 2, x: H.x + H.w * 0.25, y: L2.roadH.y - L2.roadH.halfWidth + 5 });
    spots.push({ level: 2, x: L2.roadV.x + L2.roadV.halfWidth - 5, y: H.y + H.h * 0.2 }, { level: 2, x: L2.roadV.x - L2.roadV.halfWidth + 5, y: H.y + H.h * 0.8 });
    spots.push({ level: 3, x: H.x + H.w * 0.5, y: H.y + H.h * 0.5 });
    const done = [];
    for (const sp of spots) for (const seed of [7, 11]) {
      const s = mk({ level: sp.level, seed }); const L = P.levels[sp.level - 1]; const limit = L.allocation * L.spawnInterval.max + 120; let tick = 0;
      while (s.time < limit && s.mode !== "over" && s.level === sp.level) {
        if (s.mode === "play") { s.dummy.x = sp.x; s.dummy.y = sp.y; Sim.step(s, NONE, DT);
          const bad = carOverlap(s) || offRoad(s) || insideCar(s); if (bad) throw new Error(`level ${sp.level} (seed ${seed}), dummy standing at (${Math.round(sp.x)},${Math.round(sp.y)}): ${bad}`); }
        else { tick++; Sim.step(s, inp({ confirm: tick % 20 < 2 }), DT); } }
      if (!(s.mode === "over" || s.level !== sp.level)) {
        const cars = s.cars.map(c => `${c.id}#${c.serial} at (${Math.round(c.x)},${Math.round(c.y)}) dir(${c.dirX},${c.dirY}) speed ${Math.round(c.speed)} lock ${c.lock}`).join("; ");
        throw new Error(`level ${sp.level} (seed ${seed}) had not ended after ${Math.round(limit)} s with the dummy standing at (${Math.round(sp.x)},${Math.round(sp.y)}): spawned ${s.vehiclesSpawned}/${s.allocation}, ${s.cars.length} cars still in play: ${cars}`); }
      done.push(`L${sp.level}:${Math.round(s.time)}s`); }
    return "all ended: " + done.join(", ");
  });

  check("solid_cars_and_barriers_under_active_play", "With the dummy wandering across the roads and lunging for 90 s per level: cars never overlap each other, never cross a road barrier, and the dummy is never left inside a car", () => {
    const out = [];
    for (const level of [1, 2, 3]) for (const seed of [5, 9]) { const s = mk({ level, seed }); let r = seed * 7919 + level, tick = 0, input = NONE, lunges = 0;
      const rnd = () => { r = (r * 1103515245 + 12345) & 0x7fffffff; return r / 0x7fffffff; };
      for (let i = 0; i < 90 * 60; i++) { keepAlive(s);
        if (s.mode !== "play") { tick++; Sim.step(s, inp({ confirm: tick % 20 < 2 }), DT); if (s.mode === "over") break; continue; }
        if (i % 30 === 0) { const L = P.levels[level - 1], cy = L.kind === "road" ? L.road.y : L.kind === "cross" ? L.roadH.y : H.y + H.h / 2;
          // drift back toward the traffic when far from it, otherwise move at random
          const dy = Math.abs(s.dummy.y - cy) > 140 ? Math.sign(cy - s.dummy.y) : Math.floor(rnd() * 3) - 1, dx = Math.abs(s.dummy.x - (H.x + H.w / 2)) > 300 ? Math.sign(H.x + H.w / 2 - s.dummy.x) : Math.floor(rnd() * 3) - 1;
          input = inp({ dx, dy }); }
        const press = i % 75 < 3; if (press && i % 75 === 0) lunges++;
        Sim.step(s, Object.assign({}, input, { lunge: press }), DT);
        const bad = carOverlap(s) || offRoad(s) || insideCar(s); if (bad) throw new Error(`level ${level} (seed ${seed}), active dummy: ${bad}`); }
      out.push(`L${level}/s${seed}: ${lunges} lunges, ${s.bodiesDestroyed} bodies`); }
    return out.join("; ");
  });

  check("dummy_cannot_walk_through_a_car", "Cars are solid on every side: a dummy placed against a car's side, or walking into it, is pushed out and never ends up inside", () => {
    const s = mk({ level: 1 }); const c = waitForCar(s, fresh, 60); const serial = c.serial;
    s.dummy.x = c.x + (-c.dirY) * (c.width / 2 + R - 6); s.dummy.y = c.y + c.dirX * (c.width / 2 + R - 6);
    for (let i = 0; i < 40; i++) { const k = s.cars.find(q => q.serial === serial); if (!k || s.mode !== "play") break;
      Sim.step(s, inp({ dx: 0, dy: -1 }), DT); const bad = insideCar(s); assert(!bad, bad); }
    return "pushed out and kept out";
  });

  check("modules_exist_and_do_the_work", "sim.js exports a Vehicles module and a Damage module; Vehicles.step alone moves the cars; Vehicles.cruiseSpeed returns the class speed", () => {
    const V = Sim.Vehicles, Dm = Sim.Damage; assert(V && typeof V.step === "function" && typeof V.cruiseSpeed === "function", "Vehicles.step / Vehicles.cruiseSpeed missing");
    assert(Dm && typeof Dm.assess === "function" && typeof Dm.contactFace === "function", "Damage.assess / Damage.contactFace missing");
    for (const k of Object.keys(P.classes)) assert(V.cruiseSpeed(P, k) === P.classes[k].speed, "cruiseSpeed wrong for " + k);
    const s = mk({ level: 1 }); const c = waitForCar(s, fresh, 60); park(s); const x0 = c.x, t0 = s.time, dx0 = s.dummy.x; V.step(s, DT);
    const k = s.cars.find(q => q.serial === c.serial); assert(k && near(k.x - x0, k.speed * DT, 0.1), `Vehicles.step moved the car ${(k ? k.x - x0 : NaN).toFixed(3)} px, expected ${(c.speed * DT).toFixed(3)}`);
    assert(s.time === t0 && s.dummy.x === dx0, "Vehicles.step changed the clock or the dummy");
    return "Vehicles.step moves cars on its own; Damage has both functions";
  });

  check("damage_module_is_logical", "Damage.assess follows Lawrence's table for every class: base 100 x zone share (nose 100%, front corner 60%, flank 30%, rear corner 15%, tail 5%) x 5 when lunging x the car's speed and mass relative to a cruising sedan; lunge direction and speed make no difference", () => {
    const Dm = Sim.Damage; assert(Dm && typeof Dm.assess === "function" && typeof Dm.contactFace === "function", "Damage module missing");
    const fixed = { basePoints: 100, zoneNose: 1, zoneFrontCorner: 0.6, zoneFlank: 0.3, zoneRearCorner: 0.15, zoneTail: 0.05, lungeMultiplier: 5, refSpeed: P.classes.sedan.speed, refMass: P.classes.sedan.mass };
    for (const k of Object.keys(fixed)) assert(I[k] === fixed[k], `spec impact.${k} is ${I[k]}; Lawrence's value is ${fixed[k]}`);
    assert(typeof I.maxPay === "number" && I.maxPay > 0, "spec impact.maxPay missing");
    const masses = Object.keys(P.classes).map(k => P.classes[k].mass); assert(masses.every(m => m > 0), "every class needs a mass"); assert(P.classes.bus.mass === Math.max(...masses), "bus is not the heaviest class");
    const got = (cls, speed, face, vx, vy, lunging, dir) => { dir = dir || [1, 0]; const r = Dm.assess(P, { cls, vehicleSpeed: speed, dirX: dir[0], dirY: dir[1], face, dummyVx: vx, dummyVy: vy, lunging }); assert(r && typeof r.damage === "number", "assess returned no damage"); return r.damage; };
    reports.damage_grid = {};
    for (const cls of Object.keys(P.classes)) { const sp = P.classes[cls].speed, g = reports.damage_grid[cls] = { cruiseSpeed: sp, mass: P.classes[cls].mass, momentumFactor: +((sp * P.classes[cls].mass) / (I.refSpeed * I.refMass)).toFixed(3) }; let prevW = Infinity;
      for (const zone of Object.keys(ZONES)) { const w = got(cls, sp, zone, 0, 0, false), l = got(cls, sp, zone, -900, 0, true); g[zone] = { walking: w, lunging: l };
        assert(Math.abs(w - formula(cls, sp, zone, false)) <= 1, `${cls} ${zone} walking: build ${w} vs formula ${formula(cls, sp, zone, false)}`);
        assert(Math.abs(l - formula(cls, sp, zone, true)) <= 1, `${cls} ${zone} lunging: build ${l} vs formula ${formula(cls, sp, zone, true)}`);
        assert(w < prevW, `${cls}: ${zone} (${w}) does not pay less than the zone before it (${prevW})`); prevW = w; assert(w > 0, `${cls} ${zone} pays nothing`);
        for (const [vx, vy] of [[900, 0], [0, 900], [600, 600], [-600, 600], [-100, 0], [-1600, 0]]) assert(got(cls, sp, zone, vx, vy, true) === l, `${cls} ${zone}: a lunge with velocity (${vx},${vy}) pays ${got(cls, sp, zone, vx, vy, true)}, not ${l}; direction and speed of the lunge must not matter`);
        assert(got(cls, sp, zone, 0, -900, true, [0, 1]) === l, `${cls} ${zone}: result changes with the car's direction of travel`);
        assert(got(cls, sp, zone, 300, 0, false) === w, `${cls} ${zone}: a walking dummy's velocity changes the damage`);
        assert(got(cls, 0, zone, -900, 0, true) === 0, `${cls} ${zone}: a stopped car pays`); assert(got(cls, sp * 0.5, zone, 0, 0, true) < l || l === I.maxPay, `${cls} ${zone}: a slower car does not pay less`); }
      assert(g.nose.lunging >= Math.max(...Object.keys(ZONES).map(z => Math.max(g[z].walking, g[z].lunging))), cls + ": something pays more than a lunging nose hit"); }
    const sd = reports.damage_grid.sedan; assert(sd.nose.walking === 100 && sd.nose.lunging === 500 && sd.frontCorner.walking === 60 && sd.flank.walking === 30 && sd.flank.lunging === 150 && sd.rearCorner.walking === 15 && sd.tail.walking === 5,
      "cruising sedan does not give Lawrence's table exactly: " + JSON.stringify(sd));
    const car = { x: 100, y: 100, dirX: 1, dirY: 0, length: 60, width: 30 }, up = { x: 100, y: 100, dirX: 0, dirY: -1, length: 60, width: 30 };
    const faces = [[car, 140, 100, "nose"], [car, 140, 130, "frontCorner"], [car, 110, 130, "flank"], [car, 80, 70, "flank"], [car, 60, 100, "tail"], [car, 60, 130, "rearCorner"], [car, 60, 70, "rearCorner"],
      [up, 100, 60, "nose"], [up, 125, 100, "flank"], [up, 100, 140, "tail"], [up, 125, 60, "frontCorner"], [up, 75, 140, "rearCorner"]];
    for (const [c, x, y, w] of faces) { const g = Dm.contactFace(c, x, y); assert(g === w, `contactFace: dummy at (${x},${y}) against a car at (100,100) heading (${c.dirX},${c.dirY}) gave "${g}", expected "${w}"`); }
    return `sedan walking/lunging: nose ${sd.nose.walking}/${sd.nose.lunging}, front corner ${sd.frontCorner.walking}/${sd.frontCorner.lunging}, flank ${sd.flank.walking}/${sd.flank.lunging}, rear corner ${sd.rearCorner.walking}/${sd.rearCorner.lunging}, tail ${sd.tail.walking}/${sd.tail.lunging}; bus nose ${reports.damage_grid.bus.nose.walking}/${reports.damage_grid.bus.nose.lunging}`;
  });

  check("damage_in_play_matches_module", "In real play each hit is scored by the Damage module and logged in state.lastImpact: standing at the nose, a head-on lunge, a diagonal lunge into the flank, and the tail", () => {
    const Dm = Sim.Damage, out = [];
    const scenario = (name, place, input, expectFace, expectLunge) => { const s = mk({ level: 1, seed: 7 }); const c = waitForCar(s, moving, 60); const serial = c.serial, h0 = s.dummy.health;
      place(s, c); s.dummy.vx = 0; s.dummy.vy = 0; Sim.step(s, input, DT);
      for (let i = 0; i < 25 && !(s.lastImpact && s.lastImpact.serial === serial); i++) Sim.step(s, NONE, DT);
      const L = s.lastImpact; assert(L && L.serial === serial, name + ": no impact was logged in state.lastImpact");
      for (const k of ["face", "vehicleSpeed", "dirX", "dirY", "dummyVx", "dummyVy", "lunging", "mass", "faceFactor", "lungeFactor", "momentumFactor", "damage", "cls"]) assert(k in L, name + ": lastImpact." + k + " missing");
      assert(L.face === expectFace, `${name}: zone judged "${L.face}", expected "${expectFace}"`);
      const again = Dm.assess(P, L); assert(Math.abs(again.damage - L.damage) <= 1, `${name}: lastImpact.damage ${L.damage} is not what Damage.assess gives (${again.damage})`);
      assert(Math.abs(L.damage - formula(L.cls, L.vehicleSpeed, L.face, L.lunging)) <= 1, `${name}: logged damage ${L.damage} vs formula ${formula(L.cls, L.vehicleSpeed, L.face, L.lunging)}`);
      const drop = h0 - s.dummy.health; assert(s.bodiesDestroyed > 0 || Math.abs(drop - L.damage) <= 1.5, `${name}: health fell by ${f1(drop)} but the logged damage is ${L.damage}`);
      assert(L.vehicleSpeed >= 0 && L.vehicleSpeed <= P.classes[L.cls].speed * 1.02, `${name}: vehicleSpeed ${f1(L.vehicleSpeed)} is not the car's own speed`);
      assert(L.lunging === expectLunge && L.lungeFactor === (expectLunge ? I.lungeMultiplier : 1), `${name}: lunging ${L.lunging}, lungeFactor ${L.lungeFactor}; expected ${expectLunge ? "a lunge (x" + I.lungeMultiplier + ")" : "no lunge (x1)"}`);
      out.push(`${name}: ${L.cls} at ${f1(L.vehicleSpeed)} px/s, ${L.face} x${L.faceFactor}, lunge x${L.lungeFactor} = ${L.damage}`); return { L, s }; };
    const stand = scenario("standing at the nose", (s, c) => touch(s, c, +1), NONE, "nose", false);
    const head = scenario("head-on lunge", (s, c) => { s.dummy.x = c.x + c.dirX * (c.length / 2 + R + 40); s.dummy.y = c.y; }, inp({ dx: -1, lunge: true }), "nose", true);
    const side = scenario("diagonal lunge into the flank", (s, c) => { s.dummy.x = c.x - 14; s.dummy.y = c.y - c.width / 2 - R - 22; }, inp({ dx: 1, dy: 1, lunge: true }), "flank", true);
    const tail = scenario("touching the tail", (s, c) => touch(s, c, -1), NONE, "tail", false);
    const norm = (r) => r.L.damage / Math.max(1e-9, r.L.momentumFactor);   // damage per unit of the car's momentum, so different cars compare
    assert(near(norm(head), I.basePoints * I.lungeMultiplier, 0.03) && near(norm(stand), I.basePoints, 0.03), `per unit of momentum: head-on lunge ${f1(norm(head))}, standing ${f1(norm(stand))}`);
    assert(norm(side) < norm(head), "a lunge into the flank pays as much as a head-on lunge"); assert(side.s.bodiesDestroyed === 0, "a flank lunge destroyed a fresh body");
    return out.join(" | ");
  });

  check("hit_during_any_lunge_step_counts_as_a_lunge", "A hit that lands on any step of a lunge, the final one included, is scored as a lunge (QA's finding on CR-002 build 1): swept over 200 head-on lunges started from slightly different distances", () => {
    let tested = 0, finalStep = 0;
    for (let k = 0; k < 200; k++) { const s = mk({ level: 1, seed: 7 }); const c = waitForCar(s, fresh, 60); const serial = c.serial;
      s.dummy.x = c.x + c.length / 2 + R + 180 + k * 0.25; s.dummy.y = c.y; s.dummy.vx = 0; s.dummy.vy = 0; let input = inp({ dx: -1, lunge: true });
      for (let i = 0; i < 40; i++) { const was = s.dummy.lunging, before = s.lastImpact ? s.lastImpact.time : -1; Sim.step(s, input, DT); input = NONE; const L = s.lastImpact;
        if (L && L.time !== before && L.serial === serial) { if (was) { tested++; if (!s.dummy.lunging) finalStep++;
            assert(L.lunging === true, `start offset ${(180 + k * 0.25).toFixed(2)} px: a hit on a lunge step${s.dummy.lunging ? "" : " (the final one)"} was logged with lunging=false and lungeFactor ${L.lungeFactor}`);
            assert(L.lungeFactor === I.lungeMultiplier, `start offset ${(180 + k * 0.25).toFixed(2)} px: lunge hit has lungeFactor ${L.lungeFactor}, expected ${I.lungeMultiplier}`); }
          break; } } }
    assert(tested >= 20, "only " + tested + " lunge hits were produced by the sweep"); return `${tested} hits during a lunge, ${finalStep} of them on the lunge's final step, all scored as lunges`;
  });

  check("traffic_audit", "Vehicle paths and stop/start, measured over 120 s per level with a wandering dummy: on levels 1 and 2 no car is removed while still inside the hall and no car stays stopped for more than 15 s (level 3 is measured and reported to QA, not enforced)", () => {
    reports.traffic = []; const problems = [];
    for (const level of [1, 2, 3]) { const agg = { level, runs: 0, carsSeen: 0, leftByExiting: 0, removedInsideHall: 0, longestStopSeconds: 0, carsThatStopped: 0 };
      for (const seed of [5, 9, 13]) { const s = mk({ level, seed }); let r = seed * 7919 + level, tick = 0, input = NONE; const last = {}, stop = {}, everStopped = new Set();
        const rnd = () => { r = (r * 1103515245 + 12345) & 0x7fffffff; return r / 0x7fffffff; };
        for (let i = 0; i < 120 * 60; i++) { keepAlive(s);
          if (s.mode !== "play") { tick++; Sim.step(s, inp({ confirm: tick % 20 < 2 }), DT); if (s.mode === "over") break; continue; }
          if (i % 30 === 0) input = inp({ dx: Math.abs(s.dummy.x - (H.x + H.w / 2)) > 300 ? Math.sign(H.x + H.w / 2 - s.dummy.x) : Math.floor(rnd() * 3) - 1, dy: Math.abs(s.dummy.y - (H.y + H.h / 2)) > 160 ? Math.sign(H.y + H.h / 2 - s.dummy.y) : Math.floor(rnd() * 3) - 1 });
          const lvl = s.level; Sim.step(s, Object.assign({}, input, { lunge: i % 75 < 3 }), DT); if (s.level !== lvl || s.mode === "attract") break;
          const now = new Set();
          for (const c of s.cars) { now.add(c.serial); if (!(c.serial in last)) agg.carsSeen++; last[c.serial] = { x: c.x, y: c.y, dirX: c.dirX, dirY: c.dirY, length: c.length, id: c.id };
            const inside = c.x > H.x && c.x < H.x + H.w && c.y > H.y && c.y < H.y + H.h;
            if (c.speed < 1 && inside) { stop[c.serial] = (stop[c.serial] || 0) + DT; if (stop[c.serial] > 1) everStopped.add(c.serial); agg.longestStopSeconds = Math.max(agg.longestStopSeconds, stop[c.serial]); } else stop[c.serial] = 0; }
          for (const q of Object.keys(last)) if (!now.has(Number(q))) { const c = last[q]; delete last[q];
            const tailPos = c.dirX !== 0 ? c.x - c.dirX * c.length / 2 : c.y - c.dirY * c.length / 2;   // rear end, along its travel axis
            const exited = c.dirX === 1 ? tailPos > H.x + H.w - 15 : c.dirX === -1 ? tailPos < H.x + 15 : c.dirY === 1 ? tailPos > H.y + H.h - 15 : tailPos < H.y + 15;
            if (exited) agg.leftByExiting++; else { agg.removedInsideHall++; if (level < 3) problems.push(`level ${level} seed ${seed}: ${c.id}#${q} vanished inside the hall at (${Math.round(c.x)},${Math.round(c.y)}) at t=${f1(s.time)} s`); } } }
        agg.runs++; agg.carsThatStopped += everStopped.size; }
      agg.longestStopSeconds = Math.round(agg.longestStopSeconds * 10) / 10; reports.traffic.push(agg);
      if (level < 3 && agg.longestStopSeconds > 15) problems.push(`level ${level}: a car stayed stopped for ${agg.longestStopSeconds} s`); }
    assert(problems.length === 0, problems.slice(0, 4).join("; "));
    return reports.traffic.map(a => `L${a.level}: ${a.carsSeen} cars, ${a.leftByExiting} exited, ${a.removedInsideHall} removed inside the hall, longest stop ${a.longestStopSeconds} s`).join(" | ");
  });

  check("vehicle_numbers_for_qa", "Vehicle start/stop, lane and barrier figures are measured for the QA audit; every car's speed stays between 0 and its class speed on all levels", () => {
    const K = P.carToCar || {}, VA = reports.vehicle_audit = { perClass: {}, speedChange: {}, laneDeviationNoDummy: {}, barrierClearance: {}, level3StallBreaker: {} };
    for (const k of Object.keys(P.classes)) { const v = P.classes[k].speed; VA.perClass[k] = { cruiseSpeed: v, mass: P.classes[k].mass, expectedRestToCruiseSeconds: K.accel ? +(v / K.accel).toFixed(3) : null,
      expectedCruiseToStopSeconds: K.decel ? +(v / K.decel).toFixed(3) : null, expectedStopDistancePx: K.decel ? +(v * v / (2 * K.decel)).toFixed(1) : null }; }
    const limUp = (K.accel || 0) * DT + 1e-6, limDown = (K.decel || 0) * DT + 1e-6; let maxUp = 0, maxDown = 0, overUp = 0, overDown = 0, steps = 0, bad = null, prevDummySpeed = 0, otherExample = null; const causes = { truncation: 0, cautionRescale: 0, other: 0 };
    const wander = (s, st, i) => { if (i % 30 === 0) st.input = inp({ dx: Math.abs(s.dummy.x - (H.x + H.w / 2)) > 300 ? Math.sign(H.x + H.w / 2 - s.dummy.x) : Math.floor(st.rnd() * 3) - 1, dy: Math.abs(s.dummy.y - (H.y + H.h / 2)) > 160 ? Math.sign(H.y + H.h / 2 - s.dummy.y) : Math.floor(st.rnd() * 3) - 1 }); return Object.assign({}, st.input, { lunge: i % 75 < 3 }); };
    const mkst = (seed) => { let r = seed * 7919 + 3; return { input: NONE, rnd: () => { r = (r * 1103515245 + 12345) & 0x7fffffff; return r / 0x7fffffff; } }; };
    // run one level; returns removals inside the hall and the longest hold of the lowest-serial car
    const runLevel = (level, seed, seconds, active, each) => { const s = mk({ level, seed }), st = mkst(seed), last = {}, prevSpeed = {}; let tick = 0, removed = 0, hold = 0, longest = 0;
      for (let i = 0; i < seconds * 60; i++) { keepAlive(s);
        if (s.mode !== "play") { tick++; Sim.step(s, inp({ confirm: tick % 20 < 2 }), DT); if (s.mode === "over") break; continue; }
        if (active) Sim.step(s, wander(s, st, i), DT); else { park(s); Sim.step(s, NONE, DT); }
        const now = new Set(); let lowest = null;
        for (const c of s.cars) { now.add(c.serial); const cruise = P.classes[c.cls].speed; steps++;
          if (!(c.speed >= -1e-9 && c.speed <= cruise * 1.001) && !bad) bad = `level ${level} seed ${seed}: ${c.id}#${c.serial} speed ${c.speed} outside 0..${cruise}`;
          if (c.serial in prevSpeed) { const dv = c.speed - prevSpeed[c.serial]; if (dv > maxUp) maxUp = dv; if (-dv > maxDown) maxDown = -dv;
            if (dv > limUp || -dv > limDown) { if (dv > limUp) overUp++; else overDown++; const hc = half(c);
              const touching = s.cars.some(o => o !== c && Math.abs(o.x - c.x) <= hc.x + half(o).x + 2 && Math.abs(o.y - c.y) <= hc.y + half(o).y + 2);
              const dsp = Math.hypot(s.dummy.vx, s.dummy.vy); const cautionChanged = Math.abs(dsp - prevDummySpeed) > 0.5;
              if (touching) causes.truncation++; else if (cautionChanged) causes.cautionRescale++; else { causes.other++; if (!otherExample) otherExample = `level ${level} seed ${seed} t=${f1(s.time)}: ${c.id}#${c.serial} speed ${f1(prevSpeed[c.serial])} -> ${f1(c.speed)}, sees ${c.sees}, braking ${c.braking}`; } } }
          prevSpeed[c.serial] = c.speed; last[c.serial] = c; if (each) each(s, c);
          if (c.x > H.x && c.x < H.x + H.w && c.y > H.y && c.y < H.y + H.h && (!lowest || c.serial < lowest.serial)) lowest = c; }
        prevDummySpeed = Math.hypot(s.dummy.vx, s.dummy.vy);
        if (lowest && lowest.speed < 1) { hold += DT; if (hold > longest) longest = hold; } else hold = 0;
        for (const q of Object.keys(last)) if (!now.has(Number(q))) { const c = last[q]; delete last[q]; delete prevSpeed[q];
          const tailPos = c.dirX !== 0 ? c.x - c.dirX * c.length / 2 : c.y - c.dirY * c.length / 2;
          const exited = c.dirX === 1 ? tailPos > H.x + H.w - 15 : c.dirX === -1 ? tailPos < H.x + 15 : c.dirY === 1 ? tailPos > H.y + H.h - 15 : tailPos < H.y + 15; if (!exited) removed++; } }
      return { removed, longest }; };
    // lane deviation with the dummy out of the way, and barrier clearance with it wandering
    for (const level of [1, 2, 3]) { const L = P.levels[level - 1]; let dev = 0; const first = {};
      runLevel(level, 5, 60, false, (s, c) => { let d;
        if (L.kind === "road") d = Math.min(...L.road.laneYs.map(y => Math.abs(c.y - y)));
        else if (L.kind === "cross") d = c.dirY === 0 ? Math.min(...(L.roadH.laneYs || [L.roadH.y]).map(y => Math.abs(c.y - y))) : Math.min(...(L.roadV.laneXs || [L.roadV.x]).map(x => Math.abs(c.x - x)));
        else { const lat = c.dirY === 0 ? c.y : c.x; if (!(c.serial in first)) first[c.serial] = lat; d = Math.abs(lat - first[c.serial]); }
        if (d > dev) dev = d; });
      VA.laneDeviationNoDummy["level" + level] = +dev.toFixed(2);
      if (level < 3) { let clear = Infinity; for (const seed of [5, 9]) runLevel(level, seed, 90, true, (s, c) => { const h = half(c); let m;
          if (L.kind === "road") m = L.road.halfWidth + L.road.shoulder - (Math.abs(c.y - L.road.y) + h.y);
          else m = c.dirY === 0 ? L.roadH.halfWidth + L.roadH.shoulder - (Math.abs(c.y - L.roadH.y) + h.y) : L.roadV.halfWidth + L.roadV.shoulder - (Math.abs(c.x - L.roadV.x) + h.x);
          if (m < clear) clear = m; });
        VA.barrierClearance["level" + level + "MinPxWithWanderingDummy"] = +clear.toFixed(2); } }
    for (const mode of ["idle", "wandering"]) { let firings = 0, runsWith = 0, longest = 0;
      for (let seed = 1; seed <= 30; seed++) { const r = runLevel(3, seed, 60, mode === "wandering"); firings += r.removed; if (r.removed) runsWith++; if (r.longest > longest) longest = r.longest; }
      VA.level3StallBreaker[mode + "Dummy"] = { seeds: 30, secondsPerRun: 60, carsRemovedInsideHall: firings, runsWithARemoval: runsWith, longestHoldOfLowestSerialCarSeconds: +longest.toFixed(1) }; }
    VA.speedChange = { carStepsMeasured: steps, slewLimitUpPxPerStep: +limUp.toFixed(3), slewLimitDownPxPerStep: +limDown.toFixed(3), maxIncreasePerStep: +maxUp.toFixed(3), maxDecreasePerStep: +maxDown.toFixed(3),
      stepsOverUpLimit: overUp, stepsOverDownLimit: overDown, overLimitByCause: causes, otherExample,
      note: "cause is attributed from outside the sim: 'truncation' if the car is touching another car after the step, else 'cautionRescale' if the dummy's speed changed on that step, else 'other'" };
    // measured start and stop, per class, on a clear road (level 3 has every class)
    for (const cls of Object.keys(P.classes)) { const m = VA.perClass[cls]; const s = mk({ level: 3, seed: 3 });
      const c0 = waitForCar(s, k => k.cls === cls && inHall(k, 120), 240); const serial = c0.serial; const only = () => { s.cars = s.cars.filter(k => k.serial === serial); keepAlive(s); park(s); };
      only(); s.cars[0].speed = 0; let t = 0; while (s.cars.length && s.cars[0].speed < m.cruiseSpeed - 0.5 && t < 5) { only(); Sim.step(s, NONE, DT); only(); t += DT; }
      m.measuredRestToCruiseSeconds = s.cars.length ? +t.toFixed(3) : null;
      // a stopped car ahead in the same lane: clone this car with serial 0 and hold it still
      const s2 = mk({ level: 3, seed: 3 }); const b0 = waitForCar(s2, k => k.cls === cls && inHall(k, 200), 240); const bs = b0.serial; const a = JSON.parse(JSON.stringify(b0));
      a.serial = 0; a.speed = 0; a.x = b0.x + b0.dirX * 170; a.y = b0.y + b0.dirY * 170; const ax = a.x, ay = a.y;
      const hold2 = () => { const b = s2.cars.find(k => k.serial === bs); a.x = ax; a.y = ay; a.speed = 0; s2.cars = b ? [a, b] : [a]; keepAlive(s2); park(s2); return b; };
      let b = hold2(), tStop = 0, dist = 0, braking = false, px = b ? b.x : 0, py = b ? b.y : 0, guard = 0;
      while (b && guard++ < 600) { Sim.step(s2, NONE, DT); b = hold2(); if (!b) break; if (!braking && b.speed < m.cruiseSpeed - 0.5) braking = true;
        if (braking) { tStop += DT; dist += Math.hypot(b.x - px, b.y - py); } px = b.x; py = b.y; if (braking && b.speed < 1) break; }
      if (b && braking && b.speed < 1) { m.measuredCruiseToStopSeconds = +tStop.toFixed(3); m.measuredStopDistancePx = +dist.toFixed(1);
        m.gapToStoppedCarAtRestPx = +(Math.abs((a.x - b.x) * b.dirX + (a.y - b.y) * b.dirY) - a.length / 2 - b.length / 2).toFixed(1); }
      else { m.measuredCruiseToStopSeconds = null; m.measuredStopDistancePx = null; m.gapToStoppedCarAtRestPx = null; } }
    VA.startStopNote = "measuredCruiseToStop runs from the first step the following car slows until it is below 1 px/s behind a car held stopped in its lane. It is longer than cruise/decel because the car starts slowing at its look-ahead distance and then closes the remaining gap slowly; decel limits the rate of slowing, not the total time. gapToStoppedCarAtRestPx >= 0 means it stopped without touching.";
    for (const k of Object.keys(VA.perClass)) { const m = VA.perClass[k];
      assert(m.measuredRestToCruiseSeconds !== null && Math.abs(m.measuredRestToCruiseSeconds - m.expectedRestToCruiseSeconds) <= 0.1, `${k}: rest to cruise took ${m.measuredRestToCruiseSeconds} s, expected ${m.expectedRestToCruiseSeconds} s`);
      assert(m.gapToStoppedCarAtRestPx !== null && m.gapToStoppedCarAtRestPx >= -0.5, `${k}: did not stop cleanly behind a stopped car (gap ${m.gapToStoppedCarAtRestPx})`); }
    assert(causes.other === 0, `${causes.other} speed changes over the accel/decel limit had no permitted cause, e.g. ${otherExample}`);
    assert(!bad, bad);
    return `lane deviation ${JSON.stringify(VA.laneDeviationNoDummy)}; barrier clearance ${JSON.stringify(VA.barrierClearance)}; L3 breaker idle ${VA.level3StallBreaker.idleDummy.carsRemovedInsideHall} cars in ${VA.level3StallBreaker.idleDummy.runsWithARemoval}/30 runs, wandering ${VA.level3StallBreaker.wanderingDummy.carsRemovedInsideHall} cars in ${VA.level3StallBreaker.wanderingDummy.runsWithARemoval}/30 runs`;
  });

  check("sim_is_pure", "sim.js uses no Math.random, timers, clock or DOM", () => {
    const src = fs.readFileSync(simPath, "utf8"); const bad = ["Math.random", "setInterval", "setTimeout", "Date.now", "new Date", "performance.now", "document.", "requestAnimationFrame"].filter(t => src.includes(t));
    assert(bad.length === 0, "found: " + bad.join(", "));
  });
}

check("html_static", "index.html has a canvas, loads sim.js, handles the keyboard, uses a fixed timestep and makes no network requests", () => {
  const h = fs.readFileSync(htmlPath, "utf8");
  assert(/<canvas/i.test(h), "no <canvas>"); assert(/<script[^>]+src=["']sim\.js["']/i.test(h), "sim.js not loaded with a script tag");
  assert(/keydown/.test(h) && /keyup/.test(h), "keydown/keyup handlers missing"); assert(/DummiesSim/.test(h), "does not use DummiesSim");
  assert(!/https?:\/\//i.test(h), "contains an http(s) URL"); assert(/requestAnimationFrame/.test(h), "no render loop");
  const scripts = [...h.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  assert(scripts.length >= 1, "no inline script"); scripts.forEach(sc => { new Function(sc); });
  return scripts.length + " inline script(s) parse without syntax errors";
});

const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ total: results.length, passed: results.length - failed.length, failed: failed.length, all_passed: failed.length === 0, results, reports }, null, 2));
