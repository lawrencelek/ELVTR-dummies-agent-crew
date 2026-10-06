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

  check("level2_cross_no_collisions", "Level 2: traffic uses both roads, cars never overlap inside the canvas, and traffic keeps flowing for 150 s (no deadlock)", () => {
    const s = mk({ level: 2 }), L = P.levels[1]; assert(L.kind === "cross" && L.roadH && L.roadV, "spec level 2 is not a cross level");
    const seen = new Set(), gone = new Set(); let horiz = 0, vert = 0, worst = null; const W = P.world.width, HH = P.world.height;
    for (let i = 0; i < 150 * 60; i++) { park(s); keepAlive(s); Sim.step(s, NONE, DT); assert(s.mode === "play", "mode left play: " + s.mode);
      const now = new Set(); const cs = s.cars;
      for (const c of cs) { now.add(c.serial); if (!seen.has(c.serial)) { seen.add(c.serial); if (c.dirY === 0) horiz++; else vert++; }
        if (c.dirY === 0) assert(Math.abs(c.y - L.roadH.y) <= L.roadH.halfWidth, `horizontal car ${c.id} off its road (y=${f1(c.y)})`);
        else assert(Math.abs(c.x - L.roadV.x) <= L.roadV.halfWidth, `vertical car ${c.id} off its road (x=${f1(c.x)})`); }
      for (const q of seen) if (!now.has(q)) gone.add(q);
      for (let a = 0; a < cs.length; a++) for (let b = a + 1; b < cs.length; b++) { const A = cs[a], B = cs[b];
        if (!(A.x > 0 && A.x < W && A.y > 0 && A.y < HH && B.x > 0 && B.x < W && B.y > 0 && B.y < HH)) continue;
        const ax = (A.dirY === 0 ? A.length : A.width) / 2, ay = (A.dirY === 0 ? A.width : A.length) / 2, bx = (B.dirY === 0 ? B.length : B.width) / 2, by = (B.dirY === 0 ? B.width : B.length) / 2;
        const ox = ax + bx - Math.abs(A.x - B.x), oy = ay + by - Math.abs(A.y - B.y);
        if (ox > 1.5 && oy > 1.5 && !worst) worst = `t=${f1(s.time)} s: ${A.id} (${f1(A.x)},${f1(A.y)}) dir(${A.dirX},${A.dirY}) overlaps ${B.id} (${f1(B.x)},${f1(B.y)}) dir(${B.dirX},${B.dirY}) by ${f1(ox)} x ${f1(oy)} px`; } }
    assert(!worst, "cars overlapped: " + worst); assert(horiz >= 5 && vert >= 5, `traffic not on both roads: ${horiz} horizontal, ${vert} vertical`);
    assert(gone.size >= 25, `only ${gone.size} cars got through in 150 s (deadlock or starvation)`); return `${gone.size} cars through, ${horiz} horizontal, ${vert} vertical, no overlap`;
  });

  check("level3_free_for_all", "Level 3: vehicles enter from at least three of the four edges and several classes appear (car overlap is reported but only enforced on level 2)", () => {
    const s = mk({ level: 3 }); const dirs = new Set(), classes = new Set(); let worst = null; const W = P.world.width, HH = P.world.height;
    for (let i = 0; i < 120 * 60; i++) { park(s); keepAlive(s); Sim.step(s, NONE, DT); assert(s.mode === "play", "mode left play: " + s.mode); const cs = s.cars;
      for (const c of cs) { dirs.add(c.dirX + "," + c.dirY); classes.add(c.cls); }
      for (let a = 0; a < cs.length; a++) for (let b = a + 1; b < cs.length; b++) { const A = cs[a], B = cs[b];
        if (!(A.x > 0 && A.x < W && A.y > 0 && A.y < HH && B.x > 0 && B.x < W && B.y > 0 && B.y < HH)) continue;
        const ax = (A.dirY === 0 ? A.length : A.width) / 2, ay = (A.dirY === 0 ? A.width : A.length) / 2, bx = (B.dirY === 0 ? B.length : B.width) / 2, by = (B.dirY === 0 ? B.width : B.length) / 2;
        const ox = ax + bx - Math.abs(A.x - B.x), oy = ay + by - Math.abs(A.y - B.y);
        if (ox > 1.5 && oy > 1.5 && !worst) worst = `t=${f1(s.time)} s: ${A.id} overlaps ${B.id} by ${f1(ox)} x ${f1(oy)} px`; } }
    assert(dirs.size >= 3, "cars came from only " + dirs.size + " directions"); assert(classes.size >= 4, "only " + classes.size + " classes appeared");
    return dirs.size + " directions, " + classes.size + " classes; " + (worst ? "first overlap (reported, not required on this level): " + worst : "no overlap");
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
    const s = mk({ level: 1 }); const c = waitForCar(s, fresh, 60); const h0 = s.dummy.health, sc0 = s.score; touch(s, c, +1); run(s, NONE, 0.05);
    const h1 = s.dummy.health, sc1 = s.score; assert(h1 < h0, "no damage from front contact"); assert(sc1 > sc0, "no score from front contact");
    const c2 = s.cars.find(k => k.serial === c.serial); assert(c2 && c2.hit === true, "car.hit not set after impact");
    for (let i = 0; i < 6; i++) { const k = s.cars.find(q => q.serial === c.serial); if (!k) break; touch(s, k, +1); Sim.step(s, NONE, DT); }
    assert(s.dummy.health >= h1 - 1e-6, `health kept dropping on the same car (${h1} -> ${s.dummy.health})`); return `health ${f1(h0)} -> ${f1(h1)}, score +${f1(sc1 - sc0)}`;
  });

  check("rear_contact_pays_nothing", "Rear contact changes neither health nor score", () => {
    const s = mk({ level: 1 }); const c = waitForCar(s, fresh, 60); touch(s, c, -1); run(s, NONE, 0.2);
    assert(s.dummy.health === P.dummy.maxHealth, "rear contact damaged the dummy"); assert(s.score === 0, "rear contact scored");
  });

  check("write_off_card_and_fresh_body", "At zero health: one write-off counted, a card appears, confirm gives a fresh body", () => {
    const s = mk({ level: 1 }); const c = waitForCar(s, fresh, 60); s.dummy.health = 0.5; touch(s, c, +1);
    for (let i = 0; i < 30 && s.mode === "play"; i++) Sim.step(s, NONE, DT);
    assert(s.bodiesDestroyed === 1 && s.levelWriteOffs === 1, `write-offs: run ${s.bodiesDestroyed}, level ${s.levelWriteOffs}`);
    assert(s.mode === "card" && s.card && typeof s.card.line === "string" && s.card.line.length > 5, "no report card after write-off; mode=" + s.mode);
    assert(s.ending === null, "unexpected ending " + s.ending); run(s, NONE, 0.5); assert(s.mode === "card", "card dismissed without confirm");
    Sim.step(s, inp({ confirm: true }), DT); Sim.step(s, NONE, DT); assert(s.mode === "play", "confirm did not dismiss the card; mode=" + s.mode);
    assert(s.dummy.health === P.dummy.maxHealth, "fresh body is not at maxHealth"); assert(s.bodiesDestroyed === 1, "write-off counted twice");
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

  check("ending_licensed", "The write-off that reaches certificationTarget ends the run as 'licensed' at once", () => {
    const s = mk({ level: 3 }); const c = waitForCar(s, fresh, 60); s.bodiesDestroyed = P.certificationTarget - 1; s.dummy.health = 0.5; touch(s, c, +1);
    for (let i = 0; i < 30 && s.mode === "play"; i++) Sim.step(s, NONE, DT);
    assert(s.ending === "licensed" && s.mode === "over", `mode ${s.mode}, ending ${s.ending}, bodies ${s.bodiesDestroyed}`);
    const sum = P.levels.reduce((a, l) => a + l.quota, 0); assert(P.certificationTarget > sum, `certificationTarget ${P.certificationTarget} must exceed quota sum ${sum}`);
  });

  check("levels_always_end_with_dummy_in_traffic", "With a dummy standing on the road (at each road edge, so cars swerve across the road), every level still runs to its end: no stuck or deadlocked traffic", () => {
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
        if (s.mode === "play") { s.dummy.x = sp.x; s.dummy.y = sp.y; Sim.step(s, NONE, DT); }
        else { tick++; Sim.step(s, inp({ confirm: tick % 20 < 2 }), DT); } }
      if (!(s.mode === "over" || s.level !== sp.level)) {
        const cars = s.cars.map(c => `${c.id}#${c.serial} at (${Math.round(c.x)},${Math.round(c.y)}) dir(${c.dirX},${c.dirY}) speed ${Math.round(c.speed)} lock ${c.lock}`).join("; ");
        throw new Error(`level ${sp.level} (seed ${seed}) had not ended after ${Math.round(limit)} s with the dummy standing at (${Math.round(sp.x)},${Math.round(sp.y)}): spawned ${s.vehiclesSpawned}/${s.allocation}, ${s.cars.length} cars still in play: ${cars}`); }
      done.push(`L${sp.level}:${Math.round(s.time)}s`); }
    return "all ended: " + done.join(", ");
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
console.log(JSON.stringify({ total: results.length, passed: results.length - failed.length, failed: failed.length, all_passed: failed.length === 0, results }, null, 2));
