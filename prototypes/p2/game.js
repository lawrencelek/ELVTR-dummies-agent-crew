/* DUMMIES P2 — renderer, input, menus, audio, tuning. Reads window.DUMMIES (sim.js) and window.DUMMIES_CONTENT (content.js). */
(function () {
  'use strict';
  const { Sim, NODES, LEVELS, LEVEL_LIST, DIFFICULTIES, REG, PROTO, DEG, pathAt } = window.DUMMIES;

  // Palette roles (Design §4.2 / D10.2, Trial)
  const C = {
    floor: '#EDF1F3', grid: '#D4DDE2', structure: '#B8C4CB', fleet: '#7E8C96', dummy: '#F5C542',
    joints: '#1A1D1F', primary: '#101417', secondary: '#4A5A66', warning: '#E4442E', aqua: '#4FC3E8',
    road: '#DCE3E7', shoulder: '#E5EAED', glass: 'rgba(255,255,255,0.86)', aquaDeep: '#1E8FB8', ink2: '#3C4A54',
  };
  const F_UI = '"B612", "Segoe UI", system-ui, sans-serif';
  const F_MONO = '"B612 Mono", ui-monospace, Menlo, monospace';
  const F_BRAND = '"Nunito", "Segoe UI", system-ui, sans-serif';
  const VW = 1280, VH = 720, FX = 240, FY = 60, FW = 800, FH = 600;

  const cv = document.getElementById('game');
  const ctx = cv.getContext('2d');
  let scale = 1;
  function resize() {
    const w = cv.clientWidth || VW, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr); cv.height = Math.round(w * 9 / 16 * dpr); scale = cv.width / VW;
  }
  window.addEventListener('resize', resize); resize();

  // ---------- app state
  const app = {
    screen: 'title', level: 0, difficulty: 1, sim: null, paused: false, pauseSel: 0, confirmRefuse: false,
    shopCol: 0, shopRow: 0, endSel: 0, tune: {}, lastEv: 0, toast: null, realT: 0, sound: true, tuned: false,
  };
  const previews = LEVEL_LIST.map((id) => new Sim(id, { 'run.appearances.road': 0 }));
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  // ---------- generated content (content/pipeline.py -> content.js). Missing parts fall back to the P1.9 literals.
  const CT = window.DUMMIES_CONTENT || {};
  const CJ = CT.juice || null, CI = CT.interface || null, CG = CT.graphics || null;
  const CB = CT.barks || null, CH = CT.hits || null, CTM = CT.terminal || null; // P2.1: humour, hit juice, FARSIGHT terminal skin
  const CPARAM = {};
  for (const part of [CJ, CI, CG, CB, CH, CTM]) if (part && part.params) for (const p of part.params) CPARAM[p.id] = p.value;
  const BUILD = CB || CH || CTM ? 'P2.1' : 'P2.0';
  function pv(id) {
    if (id == null) return null;
    if (app.tune[id] != null) return app.tune[id];
    if (CPARAM[id] != null) return CPARAM[id];
    if (app.sim && app.sim.P[id] != null) return app.sim.P[id];
    return REG[id] != null ? REG[id] : PROTO[id] != null ? PROTO[id] : null;
  }
  function jv(v, k) { // a parameter ID, or [minId, maxId] interpolated by k
    if (Array.isArray(v)) { const a = pv(v[0]), b = pv(v[1]); return a == null || b == null ? 0 : a + (b - a) * (k || 0); }
    const x = pv(v); return x == null ? 0 : x;
  }
  function fillIn(str, vars) { return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? vars[k] : m)); }
  function copy(path, fallback, vars) {
    const v = path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), CI && CI.copy);
    return fillIn(typeof v === 'string' ? v : fallback, vars);
  }
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const MOTION = RM ? (CJ && CJ.reducedMotion ? jv(CJ.reducedMotion) : 0.25) : 1;
  // Juice: camera shake, body flinch, field flash, write-off stamp, particles, car hit pulse, horn timers.
  const fx = { shake: { amp: 0, t0: -9, dur: 0.3 }, flinchT0: -9, flash: { t0: -9, dur: 0.18 }, stampT0: -9, parts: [], carPulse: new Map(), horn: new Map(), smokeT: 0,
    marks: [], dropT0: -9, barks: new Map(), barkT: -9, barked: new Set(),
    // P2.1
    zoom: { amt: 0, t0: -9, dur: 0.2, x: 0, y: 0 }, crumple: { amt: 0, t0: -9, dur: 0.3, ang: 0 }, stumble: { amp: 0, t0: -9, dur: 0.5 },
    rings: [], streaks: [], bubbles: new Map(), carBarkT: new Map(), cars: new Map(), nm: new Map(), nmDone: new Set(),
    lungeWatch: null, lastImpact: null, pendingNodes: [], upgradeWatch: null, barkN: 0, juiceT: new Map() };
  function kick(amp, dur) { const cur = fx.shake.amp * Math.max(0, 1 - (app.realT - fx.shake.t0) / fx.shake.dur); if (amp >= cur) fx.shake = { amp, t0: app.realT, dur }; }
  function shakeOffset() {
    const a = app.realT - fx.shake.t0;
    if (a >= fx.shake.dur) return { x: 0, y: 0 };
    const k = fx.shake.amp * Math.pow(1 - a / fx.shake.dur, 2) * MOTION;
    return { x: Math.sin(app.realT * 91) * k, y: Math.cos(app.realT * 77) * k };
  }
  function puff(x, y, n, opt) {
    for (let i = 0; i < n; i++) {
      const a = (opt.dir != null ? opt.dir + (Math.random() - 0.5) * (opt.spread || 1.2) : Math.random() * TAU), sp = (opt.speed || 40) * (0.5 + Math.random());
      fx.parts.push({ type: opt.type, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, t0: app.realT, life: (opt.life || 0.5) * (0.7 + Math.random() * 0.6), size: opt.size || 3, role: opt.role, spin: Math.random() * TAU });
    }
  }
  function mix(c1, c2, k) {
    const h = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const a = h(c1), b = h(c2);
    return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',') + ')';
  }

  // Campaign: L1 → L2 → L3. Owned nodes, credits, points and time carry between roads.
  function startLevel(i, carry) {
    if (!carry) app.roads = [];
    app.level = i; app.roadCarry = carry || null;
    app.sim = new Sim(LEVEL_LIST[i], Object.assign({ 'proto.difficulty': app.difficulty }, app.tune), carry);
    app.tuned = Object.keys(app.tune).length > 0;
    app.screen = 'game'; app.paused = false; app.lastEv = 0; app.shopCol = 0; app.shopRow = 0; app.endSel = 0;
    app.confirmRefuse = false; clearEdges();
    fx.marks = []; fx.barks.clear(); fx.barked.clear();
    fx.rings = []; fx.streaks = []; fx.bubbles.clear(); fx.carBarkT.clear(); fx.cars.clear(); fx.nm.clear(); fx.nmDone.clear();
    fx.lungeWatch = null; fx.lastImpact = null; fx.upgradeWatch = null; if (!carry) fx.pendingNodes = [];
    app.present = [];
  }

  // ---------- input
  const held = new Set();
  const q = { a: 0, b: 0, bUp: 0 };
  const menuQ = [];
  const MAP = {
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right', Space: 'a', KeyJ: 'a', Enter: 'ok', KeyK: 'b', ShiftLeft: 'b',
    ShiftRight: 'b', Escape: 'pause', KeyP: 'pause', KeyT: 'tune',
  };
  function clearEdges() { q.a = q.b = q.bUp = 0; menuQ.length = 0; }
  function inUI(e) { return e.target && e.target.closest && e.target.closest('#tune, #trace, button'); }
  window.addEventListener('keydown', (e) => {
    const k = MAP[e.code];
    if (!k || inUI(e)) return;
    e.preventDefault();
    Snd.init();
    if (k === 'tune') { if (!e.repeat) toggleTune(); return; }
    held.add(k);
    if (e.repeat) return;
    if (k === 'a') { q.a++; menuQ.push('ok'); }
    else if (k === 'b') { q.b++; menuQ.push('back'); }
    else menuQ.push(k);
  });
  window.addEventListener('keyup', (e) => {
    const k = MAP[e.code];
    if (!k) return;
    held.delete(k);
    if (k === 'b') q.bUp++;
  });
  window.addEventListener('blur', () => { held.clear(); if (app.screen === 'game' && app.sim && !app.sim.run.ending) app.paused = true; });
  cv.addEventListener('pointerdown', () => { cv.focus(); Snd.init(); });

  const pad = { prev: {}, mx: 0, my: 0, bHeld: false };
  function pollPad() {
    pad.mx = pad.my = 0; pad.bHeld = false;
    if (pad.blocked) return;
    let gp = null;
    try { gp = navigator.getGamepads ? Array.from(navigator.getGamepads()).find((g) => g && g.connected) : null; }
    catch (e) { pad.blocked = true; return; } // embedded previews can forbid the gamepad feature; keyboard still works
    if (!gp) return;
    const bt = (i) => !!(gp.buttons[i] && gp.buttons[i].pressed);
    const ax = Math.abs(gp.axes[0] || 0) > 0.25 ? gp.axes[0] : 0, ay = Math.abs(gp.axes[1] || 0) > 0.25 ? gp.axes[1] : 0;
    pad.mx = ax + (bt(15) ? 1 : 0) - (bt(14) ? 1 : 0); pad.my = ay + (bt(13) ? 1 : 0) - (bt(12) ? 1 : 0);
    pad.bHeld = bt(1);
    const now = { a: bt(0), b: bt(1), start: bt(9), up: pad.my < -0.6, down: pad.my > 0.6, left: pad.mx < -0.6, right: pad.mx > 0.6 };
    const edge = (k) => now[k] && !pad.prev[k];
    if (edge('a')) { q.a++; menuQ.push('ok'); Snd.init(); }
    if (edge('b')) { q.b++; menuQ.push('back'); }
    if (!now.b && pad.prev.b) q.bUp++;
    if (edge('start')) menuQ.push('pause');
    for (const d of ['up', 'down', 'left', 'right']) if (edge(d)) menuQ.push(d);
    pad.prev = now;
  }
  function moveVec() {
    let mx = (held.has('right') ? 1 : 0) - (held.has('left') ? 1 : 0) + pad.mx;
    let my = (held.has('down') ? 1 : 0) - (held.has('up') ? 1 : 0) + pad.my;
    const m = Math.hypot(mx, my);
    if (m > 1) { mx /= m; my /= m; }
    return { mx, my };
  }
  function buildCmd() {
    const v = moveVec();
    const cmd = { mx: v.mx, my: v.my, aPress: q.a > 0, bPress: q.b > 0, bRelease: q.bUp > 0, bHeld: held.has('b') || pad.bHeld };
    q.a = q.b = q.bUp = 0;
    return cmd;
  }

  // ---------- audio
  const Snd = {
    ctx: null,
    init() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.ctx = null; } } if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
    tone(f0, f1, dur, type, gain, delay) {
      if (!this.ctx || !app.sound) return;
      const c = this.ctx, t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
      o.type = type || 'square'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
      g.gain.setValueAtTime(gain || 0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
    },
    noise(f0, f1, dur, gain) { // band-passed noise sweep: crunch, whoosh, clatter
      if (!this.ctx || !app.sound) return;
      const c = this.ctx, t = c.currentTime, n = Math.max(1, Math.floor(c.sampleRate * dur));
      if (!this.buf || this.buf.length < n) { this.buf = c.createBuffer(1, Math.max(n, c.sampleRate), c.sampleRate); const d = this.buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
      const src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
      src.buffer = this.buf; bp.type = 'bandpass'; bp.Q.value = 1.2;
      bp.frequency.setValueAtTime(Math.max(20, f0), t); bp.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
      g.gain.setValueAtTime(gain || 0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(bp); bp.connect(g); g.connect(c.destination); src.start(t); src.stop(t + dur + 0.03);
    },
  };
  const DENY_TEXT = { lunge: 'No lunge — charge empty or recovering', pickup: 'No cone within reach', drop: 'No room to place the cone', throw: 'No room to release the cone' };
  // Generated juice (content/juice.json): one entry per sim event, every value a parameter ID. Returns false if absent.
  function juice(e, s) {
    const spec = CJ && CJ.events ? CJ.events.find((x) => x.event === e.type) : null;
    if (!spec) return false;
    let k = 1;
    if (spec.scale && spec.scale.by) k = clamp((+e[spec.scale.by] || 0) / (pv(spec.scale.full) || 1), 0, 1);
    if (spec.shake) kick(jv(spec.shake.amp, k), Math.max(0.02, jv(spec.shake.seconds, k)));
    if (spec.flash) fx.flash = { t0: app.realT, dur: jv(spec.flash, k) };
    if (spec.flinch) fx.flinchT0 = app.realT;
    if (spec.carPulse && e.car) fx.carPulse.set(e.car, app.realT);
    if (spec.stamp) fx.stampT0 = app.realT;
    const b = s.body;
    for (const pt of spec.particles || []) {
      const n = Math.round(jv(pt.count, k));
      if (n <= 0) continue;
      const dir = pt.dir === 'backward' ? b.facing + Math.PI : pt.dir === 'facing' ? b.facing : null;
      puff(e.x != null && e.type === 'chassis' ? e.x : b.x, e.y != null && e.type === 'chassis' ? e.y : b.y, n,
        { type: pt.type, dir, spread: 1.4, speed: jv(pt.speed, k), life: jv(pt.life, k), size: jv(pt.size, k), role: pt.role });
    }
    return true;
  }
  // Generated barks (content/interface.json): a worker line beside the car that a logged event names.
  function bark(e, s) {
    if (!CI || !CI.barks || !e.car || fx.barked.has(e.car)) return;
    if (app.realT - fx.barkT < (pv('proto.ui.barkCooldown') || 2.5)) return;
    const car = s.cars.find((c) => c.id === e.car);
    if (!car) return;
    const vars = Object.assign({ model: car.model, cls: car.cls === 'van' ? 'Van' : 'Sedan' }, e);
    const pool = CI.barks.filter((bk) => bk.event === e.type && Object.entries(bk.when || {}).every(([key, val]) => vars[key] === val));
    if (!pool.length) return;
    const pick = pool[(s.events.length + car.slot) % pool.length];
    const text = fillIn(pick.text, Object.fromEntries(Object.entries(vars).map(([k2, v]) => [k2, typeof v === 'number' ? Math.round(v) : v])));
    fx.barks.set(e.car, { text, t0: app.realT }); fx.barked.add(e.car); fx.barkT = app.realT;
  }
  // ---------- P2.1 event layer: car identity, derived cases (near miss, miss, upgrade seen), hit juice, barks.
  const SENIORITY = ['New', 'Practised', 'Experienced', 'Senior'];
  function seniorityOf(c) { return c.applied >= 5 ? 3 : c.applied >= 3 ? 2 : c.applied >= 1 ? 1 : 0; } // the notches drawn beside the tag
  function trackCars(s) {
    for (const c of s.cars) fx.cars.set(c.id, { id: c.id, model: c.model, cls: c.cls, slot: c.slot || 0, seniority: seniorityOf(c), x: c.x, y: c.y, h: c.h, L: c.L, W: c.W });
  }
  function upm() { return (app.sim && app.sim.P['proto.scale.unitsPerMetre']) || 12.2; }
  function whenOk(when, e) {
    for (const [k, v] of Object.entries(when || {})) {
      if (v && typeof v === 'object') { // bounds are numbers or parameter IDs
        const n = +e[k], lo = v.min == null ? -Infinity : typeof v.min === 'string' ? pv(v.min) : v.min, hi = v.max == null ? Infinity : typeof v.max === 'string' ? pv(v.max) : v.max;
        if (e[k] == null || !(n >= lo && n <= hi)) return false;
      }
      else if (e[k] !== v) return false;
    }
    return true;
  }
  // Every event that names a car gets the car's model, class and seniority; a write-off gets the car of the impact that caused it.
  function enrich(e) {
    const out = Object.assign({}, e);
    if (e.type === 'writeoff' && fx.lastImpact && fx.lastImpact.t === e.t) Object.assign(out, { car: fx.lastImpact.car, zone: fx.lastImpact.zone });
    const info = out.car && fx.cars.get(out.car);
    if (info) Object.assign(out, { model: info.model, cls: info.cls, seniority: info.seniority });
    if (e.type === 'honk') out.at = e.at === 'body' ? 'body' : 'cone';
    return out;
  }
  // Derived cases are computed from sim state and logged under 'presentation' in the exported trace.
  function present(s, type, data) {
    const e = Object.assign({ t: +s.t.toFixed(4), type }, data);
    app.present.push(e);
    const x = enrich(e);
    hitJuice(x, s);
    barkLine(x, s);
  }
  function carGap(b, c, R) { // body edge to car edge, world units
    const ca = Math.cos(c.h), sa = Math.sin(c.h), dx = b.x - c.x, dy = b.y - c.y;
    const lx = dx * ca + dy * sa, ly = -dx * sa + dy * ca;
    return Math.hypot(Math.max(Math.abs(lx) - c.L / 2, 0), Math.max(Math.abs(ly) - c.W / 2, 0)) - R;
  }
  function deriveCases(s) {
    trackCars(s);
    const b = s.body, P = s.P;
    if (s.phase !== 'play' || !b.alive) { fx.lungeWatch = null; return; }
    const gapMax = pv('proto.barks.nearMissGap') || 26, vMin = pv('proto.barks.nearMissSpeed') || 60, R = P['body.radius'];
    for (const c of s.cars) {
      if (fx.nmDone.has(c.id)) continue;
      const g = carGap(b, c, R), st = fx.nm.get(c.id);
      if (g < gapMax && Math.abs(c.v) >= vMin) {
        if (!st) fx.nm.set(c.id, { min: g, v: Math.abs(c.v), lunging: b.mode === 'lunge', contact: false });
        else if (g < st.min) { st.min = g; st.v = Math.abs(c.v); st.lunging = st.lunging || b.mode === 'lunge'; }
      } else if (st && g > gapMax * 1.6) {
        fx.nm.delete(c.id); fx.nmDone.add(c.id);
        if (!st.contact) present(s, 'near-miss', { car: c.id, gap: +(Math.max(0, st.min) / upm()).toFixed(1), speed: Math.round(st.v), lunging: st.lunging });
      }
    }
    for (const id of fx.nm.keys()) if (!s.cars.some((c) => c.id === id)) fx.nm.delete(id);
    const lw = fx.lungeWatch;
    if (lw && b.mode !== 'lunge') {
      fx.lungeWatch = null;
      if (!lw.contact) {
        let best = null, bd = pv('proto.barks.missRadius') || 120;
        for (const c of s.cars) { const g = carGap(b, c, R); if (g < bd) { bd = g; best = c; } }
        present(s, 'miss', best ? { car: best.id, gap: +(Math.max(0, bd) / upm()).toFixed(1) } : { car: null, gap: null });
      }
    }
  }
  function noteContact(e) {
    if (!e.car) return;
    if (fx.lungeWatch) fx.lungeWatch.contact = true;
    const st = fx.nm.get(e.car); if (st) st.contact = true;
    fx.nmDone.add(e.car);
  }

  // Generated hit juice (content/hits.json): base and accent layers per event; presentation only.
  function contactOf(e, s) {
    const b = s.body, car = e.car && (s.cars.find((c) => c.id === e.car) || fx.cars.get(e.car));
    let x = b.x, y = b.y;
    const eff = (type) => { for (let i = s.effects.length - 1; i >= 0; i--) if (s.effects[i].type === type && Math.abs(s.effects[i].t - e.t) < 1e-3) return s.effects[i]; return null; };
    const be = e.type === 'impact' ? eff('burst') : e.type === 'writeoff' ? eff('wreck') : null;
    let nx = Math.cos(b.facing), ny = Math.sin(b.facing);
    if (car) { const dx = b.x - car.x, dy = b.y - car.y, l = Math.hypot(dx, dy) || 1; nx = dx / l; ny = dy / l; }
    if (be) { x = be.x; y = be.y; } else if (car && e.type !== 'miss') { x = b.x - nx * s.P['body.radius']; y = b.y - ny * s.P['body.radius']; }
    return { x, y, nx, ny, car, eff: be };
  }
  function hitJuice(e, s) {
    const res = { done: false, sound: false };
    if (!CH || !CH.layers) return res;
    const layers = CH.layers.filter((L) => L.event === e.type);
    if (!layers.length) return res;
    res.done = true;
    const now = app.realT, rk = e.type + ':' + (e.car || '');
    if (/^(touch-spent|knock)$/.test(e.type) && now - (fx.juiceT.get(rk) || -9) < 0.25) { res.sound = true; return res; } // the sim logs every contact frame; juice the first
    fx.juiceT.set(rk, now);
    const ct = contactOf(e, s), b = s.body, set = {};
    for (const L of layers) {
      if (!whenOk(L.when, e)) continue;
      const k = L.scale && L.scale.by ? clamp((+e[L.scale.by] || 0) / (pv(L.scale.full) || 1), 0, 1) : 1;
      for (const blk of ['shake', 'zoom', 'crumple', 'stumble', 'rays', 'popup']) if (L[blk]) set[blk] = { v: L[blk], k };
      if (L.flash != null) set.flash = { v: L.flash, k };
      if (L.ring) fx.rings.push({ x: ct.x, y: ct.y, r: jv(L.ring.radius, k), w: jv(L.ring.width, k) || 2, t0: now, dur: Math.max(0.05, jv(L.ring.seconds, k)), role: L.ring.role });
      if (L.streaks) {
        const along = e.type === 'near-miss' && ct.car ? ct.car.h : b.facing + Math.PI, n = Math.round(jv(L.streaks.count, k)), len = jv(L.streaks.length, k), lines = [];
        const ox = e.type === 'near-miss' ? -ct.nx * s.P['body.radius'] * 1.4 : 0, oy = e.type === 'near-miss' ? -ct.ny * s.P['body.radius'] * 1.4 : 0;
        for (let i = 0; i < n; i++) lines.push({ off: (Math.random() - 0.5) * 30, lag: Math.random() * 12, len: len * (0.6 + Math.random() * 0.4) });
        fx.streaks.push({ x: b.x + ox, y: b.y + oy, dir: along, lines, t0: now, dur: Math.max(0.05, jv(L.streaks.seconds, k)), role: L.streaks.role });
      }
      for (const pt of L.particles || []) {
        const n = Math.round(jv(pt.count, k));
        if (n <= 0) continue;
        const at = pt.at === 'contact' ? ct : pt.at === 'car' && ct.car ? ct.car : b;
        const dir = pt.dir === 'backward' ? b.facing + Math.PI : pt.dir === 'facing' ? b.facing : pt.dir === 'away' ? Math.atan2(ct.ny, ct.nx) : null;
        puff(at.x, at.y, n, { type: pt.type, dir, spread: 1.2, speed: jv(pt.speed, k), life: jv(pt.life, k), size: jv(pt.size, k), role: pt.role });
      }
      if (L.sound) {
        const sd = L.sound, f0 = jv(sd.from, k), f1 = jv(sd.to, k), dur = Math.max(0.02, jv(sd.seconds, k)), g = Math.min(0.25, jv(sd.gain, k));
        if (sd.type === 'noise') Snd.noise(f0, f1, dur, g); else Snd.tone(f0, f1, dur, sd.wave || 'triangle', g);
        res.sound = true;
      }
    }
    if (set.shake) kick(jv(set.shake.v.amp, set.shake.k), Math.max(0.02, jv(set.shake.v.seconds, set.shake.k)));
    if (set.zoom) fx.zoom = { amt: jv(set.zoom.v.amount, set.zoom.k), t0: now, dur: Math.max(0.05, jv(set.zoom.v.seconds, set.zoom.k)), x: ct.x, y: ct.y };
    if (set.flash) fx.flash = { t0: now, dur: jv(set.flash.v, set.flash.k) };
    if (set.crumple) { fx.crumple = { amt: jv(set.crumple.v.amount, set.crumple.k), t0: now, dur: Math.max(0.05, jv(set.crumple.v.seconds, set.crumple.k)), ang: Math.atan2(ct.ny, ct.nx) }; fx.flinchT0 = now; }
    if (set.stumble) fx.stumble = { amp: jv(set.stumble.v.amp, set.stumble.k), t0: now, dur: Math.max(0.05, jv(set.stumble.v.seconds, set.stumble.k)) };
    if (ct.eff && (set.rays || set.popup)) ct.eff._cfg = { rays: set.rays, popup: set.popup, nx: ct.nx, ny: ct.ny };
    if (e.type === 'impact' && e.car) fx.carPulse.set(e.car, now);
    if (e.type === 'writeoff') fx.stampT0 = now;
    return res;
  }
  function zoomApply() {
    const z = fx.zoom, a = app.realT - z.t0;
    if (a >= z.dur || !z.amt) return;
    const k = 1 + z.amt * Math.pow(1 - a / z.dur, 2) * MOTION;
    ctx.translate(z.x, z.y); ctx.scale(k, k); ctx.translate(-z.x, -z.y);
  }

  // Generated barks (content/barks.json): highest priority, then most specific line wins; seeded pick among equals.
  function barkLine(e, s) {
    if (!CB || !CB.lines || !e.car) return;
    const info = fx.cars.get(e.car);
    if (!info) return;
    const pool = CB.lines.filter((ln) => ln.event === e.type && whenOk(ln.when, e));
    if (!pool.length) return;
    const pr = Math.max(...pool.map((ln) => ln.priority || 1)), now = app.realT, dur = pv('proto.barks.seconds') || 2.2;
    const top = [];   // seeded variation: every matching line of the top priority; specific lines count twice
    for (const ln of pool) if ((ln.priority || 1) === pr) { top.push(ln); if (Object.keys(ln.when || {}).length) top.push(ln); }
    const cur = fx.bubbles.get(e.car), last = fx.carBarkT.get(e.car);
    if (cur && now - cur.t0 < dur && cur.priority > pr) return;
    if (pr < 3) { // write-offs always speak; hits outrank chatter; chatter waits out both cooldowns
      if (last && now - last.t < (pv('proto.barks.carCooldown') || 4) && last.pr >= pr) return;
      if (pr === 1) {
        if (now - fx.barkT < (pv('proto.barks.cooldown') || 0.8)) return;
        let live = 0; for (const bk of fx.bubbles.values()) if (now - bk.t0 < dur) live++;
        if (!cur && live >= (pv('proto.barks.maxOnScreen') || 3)) return;
      }
    }
    const pick = top[(Math.round(e.t * 60) + info.slot * 7 + fx.barkN++) % top.length];
    const vars = Object.assign({}, e, { chassis: e.chassis != null ? String(e.chassis).padStart(2, '0') : null });
    for (const k of ['lost', 'assessed', 'angle', 'closing', 'speed', 'health']) if (typeof vars[k] === 'number') vars[k] = Math.round(vars[k]);
    const text = fillIn(pick.text, vars);
    fx.bubbles.set(e.car, { text, style: pick.style || 'speech', priority: pr, t0: now, car: e.car });
    fx.barkT = now; fx.carBarkT.set(e.car, { t: now, pr });
    app.present.push({ t: +s.t.toFixed(4), type: 'bark', car: e.car, event: e.type, style: pick.style, text });
  }

  function processEvents() {
    const s = app.sim;
    if (!s) return;
    const ev = s.events;
    trackCars(s);
    for (let i = app.lastEv; i < ev.length; i++) {
      const e0 = ev[i];
      if (e0.type === 'lunge') fx.lungeWatch = { contact: false };
      if (/^(impact|knock|touch|touch-spent|contact-ignored)$/.test(e0.type)) noteContact(e0);
      if (e0.type === 'impact') fx.lastImpact = e0;
      if (e0.type === 'purchase') fx.pendingNodes.push(NODES[e0.node].name);
      if (e0.type === 'chassis' && fx.pendingNodes.length) { fx.upgradeWatch = fx.pendingNodes[fx.pendingNodes.length - 1]; fx.pendingNodes = []; }
      const e = enrich(e0);
      const hj = hitJuice(e, s);
      const juiced = hj.done || juice(e0, s);
      if (CB) barkLine(e, s); else bark(e0, s);
      if (CB && fx.upgradeWatch && e.car && ((e0.type === 'commit' && e0.cause === 'body') || (e0.type === 'honk' && e0.at === 'body'))) {
        const node = fx.upgradeWatch; fx.upgradeWatch = null;
        fx.carBarkT.delete(e.car); fx.barkT = -9;
        present(s, 'upgrade-seen', { car: e.car, node });
      }
      switch (e0.type) {
        case 'lunge': {
          if (!hj.sound) Snd.tone(220, 90, 0.12, 'triangle', 0.12);
          if (!juiced) { kick(1.5, 0.1); const b = s.body; puff(b.x, b.y, 7, { type: 'dust', dir: b.facing + Math.PI, spread: 1.4, speed: 60, life: 0.45, size: 4 }); }
          break;
        }
        case 'impact': {
          const k = Math.min(1, e.assessed / 500);
          if (!hj.sound) { Snd.tone(160, 40, 0.28 + 0.2 * k, 'sawtooth', 0.08 + 0.12 * k); Snd.tone(900, 240, 0.07, 'square', 0.05); }
          if (!juiced) {
            kick(3 + 9 * k, 0.25 + 0.2 * k); fx.flinchT0 = app.realT; fx.carPulse.set(e.car, app.realT);
            const b = s.body; puff(b.x, b.y, 8 + Math.round(10 * k), { type: 'spark', speed: 160, life: 0.35, size: 2 });
          }
          break;
        }
        case 'knock': { if (!juiced) { const b = s.body; puff(b.x, b.y, 5, { type: 'dust', speed: 50, life: 0.4, size: 3 }); } break; }
        case 'touch-spent': if (!hj.sound) Snd.tone(260, 240, 0.06, 'sine', 0.06); if (!juiced) kick(1, 0.1); toast(copy('toast.touch-spent', 'Spent car — no reward')); break;
        case 'honk': if (e.at === 'body') horn(); else Snd.tone(880, 880, 0.05, 'sine', 0.03); fx.horn.set(e.car, app.realT); break;
        case 'learn-standoff': Snd.tone(330, 260, 0.12, 'triangle', 0.05); toast(copy('toast.learn-standoff', '{model} now stops {metres} m back', { model: e.model, metres: (e.to / s.P['proto.scale.unitsPerMetre']).toFixed(1) })); break;
        case 'unstick': if (e.how === 'reverse') { Snd.tone(1000, 1000, 0.06, 'square', 0.03); Snd.tone(1000, 1000, 0.06, 'square', 0.03, 0.25); } break;
        case 'drone-dispatch': Snd.tone(150, 210, 0.6, 'sawtooth', 0.025); toast(copy('toast.drone-dispatch', 'FARSIGHT drone dispatched to clear a cone')); break;
        case 'drone-pickup': Snd.tone(320, 200, 0.08, 'square', 0.05); break;
        case 'drone-drop': Snd.tone(240, 150, 0.1, 'square', 0.05); break;
        case 'chassis': fx.dropT0 = app.realT; break;
        case 'writeoff': {
          if (!hj.sound) [392, 311, 233, 155].forEach((f, j) => Snd.tone(f, f * 0.98, 0.16, 'square', 0.07, j * 0.11));
          if (!juiced) {
            kick(14, 0.6); fx.flash.t0 = app.realT; fx.flash.dur = 0.18; fx.stampT0 = app.realT;
            const b = s.body; puff(b.x, b.y, 24, { type: 'spark', speed: 220, life: 0.5, size: 2.5 }); puff(b.x, b.y, 10, { type: 'smoke', speed: 30, life: 1.2, size: 8 });
          }
          break;
        }
        case 'denied': Snd.tone(120, 110, 0.05, 'square', 0.05); Snd.tone(120, 110, 0.05, 'square', 0.05, 0.08); toast(copy('denied.' + e.action, DENY_TEXT[e.action] || 'Denied')); break;
        case 'purchase': [523, 659, 784].forEach((f, j) => Snd.tone(f, f, 0.1, 'triangle', 0.07, j * 0.07)); toast(copy('toast.purchase', '{node} installed', { node: NODES[e.node].name })); break;
        case 'pickup': Snd.tone(700, 950, 0.05, 'triangle', 0.06); break;
        case 'drop': Snd.tone(500, 380, 0.06, 'triangle', 0.05); break;
        case 'throw': Snd.tone(620, 180, 0.16, 'triangle', 0.07); break;
        case 'punt': Snd.tone(420, 300, 0.05, 'triangle', 0.04); break;
        case 'ending': if (e.kind === 'Licensed') [523, 659, 784, 1046].forEach((f, j) => Snd.tone(f, f, 0.16, 'triangle', 0.07, 1.1 + j * 0.09)); break;
        default: break;
      }
    }
    app.lastEv = ev.length;
    deriveCases(s);
  }
  function horn() { Snd.tone(440, 430, 0.16, 'square', 0.05); Snd.tone(349, 340, 0.22, 'square', 0.05, 0.18); }
  function toast(msg) { app.toast = { msg, t: app.realT }; }

  // ---------- menus
  const PAUSE_ITEMS = ['Resume', 'Restart level', 'Refuse testing', 'Show trace', 'Quit to title'];
  const END_ITEMS = ['Play again from road 1', 'Choose a road', 'Show trace'];
  const SHOP_GRID = [['hips', 'spine'], ['carry', 'throw']];
  function handleMenus() {
    const s = app.sim;
    const live = app.screen === 'game' && !app.paused && s && (s.phase === 'play' || s.phase === 'hitstop' || s.phase === 'writeoff');
    if (live) {
      for (const m of menuQ) if (m === 'pause' && s.phase === 'play') { app.paused = true; app.pauseSel = 0; app.confirmRefuse = false; }
      menuQ.length = 0;
      return;
    }
    while (menuQ.length) {
      const m = menuQ.shift();
      if (app.screen === 'title') {
        if (m === 'up') app.level = (app.level + LEVEL_LIST.length - 1) % LEVEL_LIST.length;
        else if (m === 'down') app.level = (app.level + 1) % LEVEL_LIST.length;
        else if (m === 'left') app.difficulty = Math.max(0, app.difficulty - 1);
        else if (m === 'right') app.difficulty = Math.min(DIFFICULTIES.length - 1, app.difficulty + 1);
        else if (m === 'ok') { startLevel(app.level); return; }
        continue;
      }
      if (app.paused) {
        if (m === 'up') { app.pauseSel = (app.pauseSel + PAUSE_ITEMS.length - 1) % PAUSE_ITEMS.length; app.confirmRefuse = false; }
        else if (m === 'down') { app.pauseSel = (app.pauseSel + 1) % PAUSE_ITEMS.length; app.confirmRefuse = false; }
        else if (m === 'pause' || m === 'back') { app.paused = false; }
        else if (m === 'ok') {
          const item = PAUSE_ITEMS[app.pauseSel];
          if (item === 'Resume') app.paused = false;
          else if (item === 'Restart level') { startLevel(app.level); return; }
          else if (item === 'Refuse testing') {
            if (s.run.writeOffs < 1) toast(copy('toast.refusal-locked', 'Refusal opens after one completed body'));
            else if (!app.confirmRefuse) app.confirmRefuse = true;
            else { s.withdraw(); app.paused = false; }
          } else if (item === 'Show trace') showTrace();
          else if (item === 'Quit to title') { app.screen = 'title'; app.sim = null; app.paused = false; }
        }
        continue;
      }
      if (!s) continue;
      if (s.phase === 'report' && m === 'ok') s.continueReport();
      else if (s.phase === 'shop') {
        if (m === 'left' || m === 'right') { app.shopCol = 1 - app.shopCol; if (app.shopRow > 1) app.shopRow = 1; }
        else if (m === 'up') app.shopRow = Math.max(0, app.shopRow - 1);
        else if (m === 'down') app.shopRow = Math.min(2, app.shopRow + 1);
        else if (m === 'back') { s.leaveShop(); clearEdges(); return; }
        else if (m === 'ok') {
          if (app.shopRow === 2) { s.leaveShop(); clearEdges(); return; }
          s.buy(SHOP_GRID[app.shopCol][app.shopRow]);
        }
      } else if (s.phase === 'ending') {
        const items = endItems(s);
        if (m === 'up') app.endSel = (app.endSel + items.length - 1) % items.length;
        else if (m === 'down') app.endSel = (app.endSel + 1) % items.length;
        else if (m === 'ok') {
          const it = items[app.endSel];
          if (it === 'Retry this road') { const rs = app.roads.slice(); startLevel(app.level, app.roadCarry); app.roads = rs; return; }
          if (it === 'Play again from road 1') { startLevel(0); return; }
          if (it === 'Choose a road') { app.screen = 'title'; app.sim = null; return; }
          if (it === 'Replay this level') { startLevel(app.level); return; }
          if (it === 'Choose another level') { app.screen = 'title'; app.sim = null; return; }
          showTrace();
        }
      }
    }
    q.a = q.b = q.bUp = 0;
  }

  // ---------- drawing helpers
  function rr(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function txt(s, x, y, font, color, align, base) {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align || 'left'; ctx.textBaseline = base || 'alphabetic'; ctx.fillText(s, x, y);
  }
  function label(s, x, y, color) { // uppercase eyebrow with tracking
    ctx.font = '700 10px ' + F_UI; ctx.fillStyle = color || C.secondary; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    let cx = x; for (const ch of s) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + 1.4; }
  }
  function roleC(r) { return r === 'glass' ? '#FFFFFF' : r === 'aquaDeep' ? C.aquaDeep : C[r] || null; }
  function panel(x, y, w, h, opts) { // P2.1: skinned by content/terminal.json panels
    const pn = CTM && CTM.panels, R = pn ? clamp(pv(pn.radius) || 14, 2, 30) : 14, gl = pn ? clamp(pv(pn.gloss) || 28, 0, 60) : 28, sb = pn ? pv(pn.shadow) || 18 : 18;
    const bc = pn && roleC(pn.border) ? rgba(roleC(pn.border), pv(pn.borderAlpha) != null ? pv(pn.borderAlpha) : 0.75) : 'rgba(79,195,232,0.75)';
    ctx.save();
    ctx.shadowColor = 'rgba(16,40,56,0.18)'; ctx.shadowBlur = sb; ctx.shadowOffsetY = Math.round(sb / 3);
    rr(x, y, w, h, R);
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, 'rgba(255,255,255,0.97)'); g.addColorStop(1, (opts && opts.tint) || 'rgba(236,247,252,0.95)');
    ctx.fillStyle = g; ctx.fill(); ctx.restore();
    rr(x + 0.5, y + 0.5, w - 1, h - 1, R); ctx.strokeStyle = bc; ctx.lineWidth = 1.5; ctx.stroke();
    if (pn) { rr(x + 2, y + 2, w - 4, h - 4, Math.max(1, R - 1.5)); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1; ctx.stroke(); } // bevel
    // glass highlight
    if (gl > 0) {
      ctx.save(); rr(x + 2, y + 2, w - 4, Math.min(gl, h / 3), Math.max(1, R - 2)); ctx.clip();
      const hg = ctx.createLinearGradient(0, y, 0, y + gl); hg.addColorStop(0, 'rgba(255,255,255,0.9)'); hg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hg; ctx.fillRect(x, y, w, gl + 2); ctx.restore();
    }
  }
  function glassPill(x, y, w, h) {
    rr(x, y, w, h, h / 2);
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(255,255,255,0.92)'); g.addColorStop(1, 'rgba(214,236,244,0.85)');
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(79,195,232,0.8)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.save(); rr(x + 1, y + 1, w - 2, h / 2, h / 2 - 1); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(x, y, w, h / 2); ctx.restore();
  }
  function fmtT(t) { const m = Math.floor(t / 60), s = Math.floor(t % 60); return m + ':' + String(s).padStart(2, '0'); }
  function num(v) { return Math.round(v).toLocaleString('en-GB'); }
  let hatch = null;
  function hatchPattern(alpha) {
    const c = document.createElement('canvas'); c.width = c.height = 8;
    const x = c.getContext('2d'); x.strokeStyle = 'rgba(74,90,102,' + alpha + ')'; x.lineWidth = 1.2;
    x.beginPath(); x.moveTo(0, 8); x.lineTo(8, 0); x.moveTo(-2, 2); x.lineTo(2, -2); x.moveTo(6, 10); x.lineTo(10, 6); x.stroke();
    return ctx.createPattern(c, 'repeat');
  }

  // ---------- frame + HUD
  function drawFrame() {
    const bd = CTM && CTM.backdrop;
    if (bd && bd.stops && bd.stops.length > 1) { // P2.1 FARSIGHT backdrop: gradient and soft glows, frame only
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, VW, VH);
      const g = ctx.createLinearGradient(0, 0, 0, VH);
      for (const st of bd.stops) g.addColorStop(clamp(st.at, 0, 1), rgba(roleC(st.role) || C.aqua, st.alpha != null ? st.alpha : 1));
      ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
      for (const gl of bd.glows || []) {
        const col = roleC(gl.role) || '#FFFFFF', o = ctx.createRadialGradient(gl.x, gl.y, 0, gl.x, gl.y, gl.r);
        o.addColorStop(0, rgba(col, gl.alpha != null ? gl.alpha : 0.6)); o.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = o; ctx.fillRect(gl.x - gl.r, gl.y - gl.r, gl.r * 2, gl.r * 2);
      }
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, VH);
      g.addColorStop(0, '#EAF6FB'); g.addColorStop(0.5, '#D6ECF4'); g.addColorStop(1, '#C3E1EC');
      ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
      const o = ctx.createRadialGradient(1120, 40, 10, 1120, 40, 260);
      o.addColorStop(0, 'rgba(255,255,255,0.8)'); o.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = o; ctx.fillRect(0, 0, VW, VH);
    }
    txt('FARSIGHT', 24, 40, '900 26px ' + F_BRAND, C.aquaDeep);
    ctx.font = '900 26px ' + F_BRAND; const bw = ctx.measureText('FARSIGHT').width;
    const fr = CI && CI.copy && CI.copy.frame;
    const district = fr ? fr.district + (fr.districtZh ? '  ·  ' + fr.districtZh : '') : 'CRASH LAB  ·  SHENZHEN SMART CITY  ·  NEW ECONOMIC ZONE  ·  深圳智慧城市测试区';
    const hd = CTM && CTM.header;
    if (hd) { // product lockup, tagline, district identifier, static badges
      const lx = 24 + bw + 16, prod = hd.product + (hd.productZh ? '  ' + hd.productZh : '');
      ctx.fillStyle = rgba(C.aquaDeep, 0.45); ctx.fillRect(lx - 9, 14, 1.5, 34);
      txt(prod, lx, 28, '800 15px ' + F_BRAND, C.aquaDeep);
      ctx.font = '800 15px ' + F_BRAND; const pw = ctx.measureText(prod).width;
      if (hd.tagline) txt(hd.tagline, lx + pw + 12, 27, 'italic 400 11px ' + F_UI, C.ink2);
      txt(district, lx, 45, '700 10px ' + F_UI, C.ink2);
      let bx = VW - 24;
      for (const bg of (hd.badges || []).slice(0, 3).reverse()) {
        ctx.font = '700 9px ' + F_UI; const w = ctx.measureText(bg).width + 22; bx -= w;
        glassPill(bx, 17, w, 20); ctx.fillStyle = C.aqua; ctx.beginPath(); ctx.arc(bx + 9, 27, 2.5, 0, TAU); ctx.fill();
        txt(bg, bx + w / 2 + 4, 30.5, '700 9px ' + F_UI, C.aquaDeep, 'center'); bx -= 8;
      }
    } else txt(district, 24 + bw + 16, 38, '700 11px ' + F_UI, C.ink2);
    const buildLabel = BUILD + (CT.juice || CT.interface || CT.graphics ? ' · GENERATED CONTENT' : ' · NO CONTENT LOADED');
    if (hd) txt(buildLabel, VW - 24, 50, '700 8px ' + F_UI, rgba(C.secondary, 0.75), 'right');
    else txt(buildLabel, VW - 24, 38, '700 11px ' + F_UI, C.ink2, 'right');
    // field bezel
    ctx.save(); ctx.shadowColor = 'rgba(16,40,56,0.25)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
    rr(FX - 6, FY - 6, FW + 12, FH + 12, 12); ctx.fillStyle = '#F7FBFD'; ctx.fill(); ctx.restore();
    rr(FX - 6.5, FY - 6.5, FW + 13, FH + 13, 12); ctx.strokeStyle = 'rgba(79,195,232,0.9)'; ctx.lineWidth = 1.5; ctx.stroke();
    const prompt = app.screen === 'title' ? '↑↓ road   ·   ◀▶ difficulty   ·   A / Space start   ·   T tuning'
      : 'MOVE  WASD / ◀▲▼▶      A  LUNGE  Space / J      B  CONE  K / Shift      PAUSE  Esc      TUNING  T';
    if (CTM) drawTerminalTexture();
    txt(prompt, VW / 2, CTM ? VH - 8 : VH - 18, '700 11px ' + F_UI, C.ink2, 'center');
  }
  // P2.1 tier-4 texture (content/terminal.json): range marks on the bezel, diagnostic runs, FARSIGHT signage. Never reacts to play.
  function drawTerminalTexture() {
    const tx = CTM.texture || {}, step = Math.max(10, pv(tx.rangeMarks) || 40);
    ctx.strokeStyle = rgba(C.aquaDeep, 0.5); ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 0, i = 0; x <= FW + 0.5; x += step, i++) { const L = i % 5 === 0 ? 5 : 3; ctx.moveTo(FX + x + 0.5, FY + FH + 8); ctx.lineTo(FX + x + 0.5, FY + FH + 8 + L); }
    for (let y = 0, i = 0; y <= FH + 0.5; y += step, i++) { const L = i % 5 === 0 ? 4 : 2; ctx.moveTo(FX - 8, FY + y + 0.5); ctx.lineTo(FX - 8 - L, FY + y + 0.5); ctx.moveTo(FX + FW + 8, FY + y + 0.5); ctx.lineTo(FX + FW + 8 + L, FY + y + 0.5); }
    ctx.stroke();
    const ids = (tx.diagnostics || []).filter((id) => current(id) != null);
    if (ids.length) {
      const rows = 4, off = Math.floor(app.realT / 2.5);
      for (const [side, X] of [[0, 14], [1, VW - 226]]) for (let r = 0; r < rows; r++) {
        const id = ids[(off + r * 2 + side) % ids.length], v = current(id);
        txt(id + '  ' + (Math.abs(v) >= 100 || v % 1 === 0 ? Math.round(v) : (+v).toFixed(2)), X, FY + FH + 18 + r * 12, '400 8px ' + F_MONO, rgba(C.secondary, 0.5));
      }
    }
    const sg = CTM.signage, lines = (sg && sg.lines) || [];
    if (lines.length) {
      const per = Math.max(2, pv(sg.seconds) || 6), idx = Math.max(0, Math.floor(app.realT / per)) % lines.length, u = (app.realT % per) / per;
      const ln = lines[idx], text = typeof ln === 'string' ? ln : ln.text + (ln.zh ? '   ' + ln.zh : '');
      glassPill(FX + 40, FY + FH + 16, FW - 80, 22);
      txt('NOTICE  通告', FX + 54, FY + FH + 31, '800 8px ' + F_UI, C.aquaDeep);
      ctx.globalAlpha = Math.max(0, Math.min(1, u * per / 0.4, (1 - u) * per / 0.4));
      txt(text, FX + FW / 2 + 24, FY + FH + 31.5, '700 11px ' + F_UI, C.ink2, 'center');
      ctx.globalAlpha = 1;
    }
  }

  // Generated HUD (content/interface.json hud): D10.5 modules in two columns; each row is a fact with a fixed widget.
  function factWidget(f, label, x, y, w, s) {
    const b = s.body, P = s.P, r = s.run, R = x + w;
    switch (f) {
      case 'subject.chassis': txt(label, x, y + 14, '700 11px ' + F_UI, C.secondary); txt(String(b.chassis).padStart(2, '0'), R, y + 14, '700 12px ' + F_MONO, C.primary, 'right'); return 24;
      case 'body.difficulty': txt(label, x, y + 13, '700 11px ' + F_UI, C.secondary); txt(s.difficulty + ' · ' + num(P['damage.bodyHealth']), R, y + 13, '700 11px ' + F_MONO, C.ink2, 'right'); return 22;
      case 'body.health': {
        const hp = b.alive ? b.health : 0, frac = hp / P['damage.bodyHealth'];
        rr(x, y + 2, w, 12, 6); ctx.fillStyle = '#E2EAEE'; ctx.fill();
        if (frac > 0) {
          const low = frac < 0.3 && Math.floor(app.realT * 4) % 2 === 0;
          rr(x, y + 2, Math.max(12, w * frac), 12, 6); ctx.fillStyle = low ? C.warning : C.dummy; ctx.fill(); ctx.strokeStyle = C.joints; ctx.lineWidth = 1; ctx.stroke();
        }
        txt(num(hp) + ' / ' + num(P['damage.bodyHealth']), x, y + 34, '700 13px ' + F_MONO, C.primary);
        txt(label, R, y + 34, '400 11px ' + F_UI, C.secondary, 'right'); return 50;
      }
      case 'body.reach': txt(label, x, y + 13, '700 11px ' + F_UI, C.secondary); txt(String(Math.round(s.reach())), R, y + 13, '700 12px ' + F_MONO, C.primary, 'right'); return 22;
      case 'body.charge': {
        const cap = P['battery.capacity'];
        for (let i = 0; i < cap; i++) {
          const cw = (w - (cap - 1) * 6) / cap, xx = x + i * (cw + 6), fr = Math.max(0, Math.min(1, b.charge - i));
          rr(xx, y + 2, cw, 16, 4); ctx.fillStyle = '#E2EAEE'; ctx.fill();
          if (fr > 0) { rr(xx, y + 2, cw * fr, 16, 4); ctx.fillStyle = fr >= 1 ? C.primary : C.secondary; ctx.fill(); }
        }
        txt(label, x, y + 34, '400 11px ' + F_UI, C.secondary); return 44;
      }
      case 'contract.writeOffs': {
        for (let i = 0; i < s.quota; i++) {
          const xx = x + i * 38; rr(xx, y + 2, 32, 32, 6);
          ctx.fillStyle = i < r.writeOffs ? C.dummy : '#E2EAEE'; ctx.fill(); ctx.strokeStyle = i < r.writeOffs ? C.joints : '#C9D5DB'; ctx.lineWidth = 1; ctx.stroke();
          if (i < r.writeOffs) { ctx.strokeStyle = C.joints; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xx + 8, y + 26); ctx.lineTo(xx + 24, y + 10); ctx.stroke(); }
        }
        txt(label + ' ' + r.writeOffs + ' / ' + s.quota, x, y + 54, '700 12px ' + F_UI, C.primary);
        txt('Σ ' + s.totalWriteOffs(), R, y + 54, '700 12px ' + F_MONO, C.secondary, 'right'); return 70;
      }
      case 'contract.road': txt(label, x, y + 13, '700 11px ' + F_UI, C.secondary); txt((s.roadIndex + 1) + ' / ' + LEVEL_LIST.length + ' · ' + LEVELS[s.levelId].name, R, y + 13, '700 11px ' + F_MONO, C.primary, 'right'); return 22;
      case 'build.nodes': {
        txt(label, x, y + 8, '700 10px ' + F_UI, C.secondary);
        [['Torso', 'hips', 'spine'], ['Arms', 'carry', 'throw']].forEach((cl, ci) => {
          const yy = y + 12 + ci * 58;
          txt(cl[0].toUpperCase(), x, yy + 10, '700 10px ' + F_UI, C.secondary);
          [cl[1], cl[2]].forEach((n, k) => {
            const xx = x + k * 100, own = s.has(n);
            rr(xx, yy + 16, 84, 28, 8); ctx.fillStyle = own ? C.aqua : 'rgba(255,255,255,0.7)'; ctx.fill();
            ctx.strokeStyle = own ? C.aquaDeep : '#C9D5DB'; ctx.lineWidth = 1.2; ctx.stroke();
            txt(NODES[n].name, xx + 42, yy + 34, '700 12px ' + F_UI, own ? '#06202B' : C.secondary, 'center');
            if (k === 0) { ctx.strokeStyle = '#9FB0BA'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xx + 86, yy + 30); ctx.lineTo(xx + 98, yy + 30); ctx.stroke(); }
          });
        });
        return 128;
      }
      case 'record.points': txt(num(r.points), x, y + 30, '700 28px ' + F_MONO, C.primary); txt(label, x, y + 48, '400 11px ' + F_UI, C.secondary); return 58;
      case 'record.credits':
        rr(x, y + 2, 82, 40, 10); ctx.fillStyle = r.credits ? C.dummy : '#E2EAEE'; ctx.fill();
        txt(String(r.credits), x + 41, y + 30, '700 22px ' + F_MONO, C.primary, 'center');
        txt(label, x + 94, y + 27, '400 11px ' + F_UI, C.secondary); return 52;
      case 'fleet.models':
        txt(label, R, y + 11, '400 11px ' + F_UI, C.secondary, 'right');
        ['sedan', 'van'].forEach((k, i) => {
          const m = s.models[k], yy = y + 30 + i * 22, so = s.modelStandoff(m), wary = so > P['proto.standoffDistance'] + 1e-6;
          txt(m.id, x, yy, '700 12px ' + F_MONO, C.primary);
          txt((so / P['proto.scale.unitsPerMetre']).toFixed(1) + ' m', R, yy, '700 12px ' + F_MONO, wary ? C.warning : C.ink2, 'right');
        });
        return 60;
      case 'fleet.note': txt(label, x, y + 13, '400 11px ' + F_UI, C.secondary); return 22;
      case 'shift.admitted': txt(r.admitted + ' / ' + s.schedule.length, x, y + 18, '700 16px ' + F_MONO, C.primary); txt(label, x + 82, y + 18, '400 11px ' + F_UI, C.secondary); return 26;
      case 'shift.onRoad': txt(s.cars.length + ' ' + label, x, y + 14, '400 12px ' + F_UI, C.ink2); return 20;
      case 'shift.next': {
        const t = s.slot < s.schedule.length ? label + ' ' + (s.schedule[s.slot].cls === 'van' ? 'Van' : 'Sedan') + ' · ' + Math.max(0, s.nextAt - s.t).toFixed(1) + ' s' : '—';
        txt(t, x, y + 14, '400 12px ' + F_UI, C.ink2); return 20;
      }
      case 'clock.active': txt(fmtT(s.tOffset + s.t), x, y + 26, '700 22px ' + F_MONO, C.primary); txt(label, x + 76, y + 26, '400 11px ' + F_UI, C.secondary); return 40;
      default: return 0;
    }
  }
  function drawHUDContent(s) {
    for (const [side, X] of [['left', 12], ['right', VW - 228]]) {
      panel(X, FY, 216, FH);
      let y = FY + 14;
      for (const m of CI.hud[side] || []) {
        const pn = CTM && CTM.panels, icon = CTM && CTM.icons && CTM.icons[m.module];
        if (pn && pn.band) { // FARSIGHT header band: aqua gloss, white title (frame layer)
          rr(X + 8, y - 1, 200, 20, 7);
          const bg = ctx.createLinearGradient(0, y - 1, 0, y + 19); bg.addColorStop(0, rgba(roleC(pn.bandRole) || C.aqua, 0.95)); bg.addColorStop(1, rgba(C.aquaDeep, 0.95));
          ctx.fillStyle = bg; ctx.fill();
          ctx.save(); rr(X + 9, y, 198, 9, 6); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(X + 8, y - 1, 200, 10); ctx.restore();
        }
        const tx = icon ? X + 36 : X + 14;
        if (icon) { ctx.save(); ctx.translate(X + 22, y + 9); drawShapes(icon, 1); ctx.restore(); } // icons are drawn for the band (glass on aqua)
        label(String(m.title || m.module).toUpperCase(), tx, y + 12, pn && pn.band ? '#FFFFFF' : null);
        if (m.zh) txt(m.zh, X + 200, y + 12, '700 10px ' + F_UI, pn && pn.band ? '#FFFFFF' : C.secondary, 'right');
        y += 24;
        for (const row of m.rows || []) y += factWidget(row.fact, row.label || '', X + 14, y, 188, s);
        y += 14;
      }
    }
    if (app.tuned) { rr(26, FY + FH - 40, 188, 24, 6); ctx.fillStyle = 'rgba(228,68,46,0.12)'; ctx.fill(); txt('TUNED RUN · UNRANKED', 120, FY + FH - 24, '700 10px ' + F_UI, C.warning, 'center'); }
  }
  function drawHUD(s) {
    if (CI && CI.hud) { drawHUDContent(s); return; }
    const b = s.body, P = s.P, r = s.run;
    // left column
    panel(12, FY, 216, FH);
    let y = FY + 26;
    label('SUBJECT', 26, y); txt('CHASSIS ' + String(b.chassis).padStart(2, '0'), 214, y, '700 12px ' + F_MONO, C.primary, 'right');
    y += 26; label('BODY · ' + s.difficulty.toUpperCase(), 26, y);
    const hp = b.alive ? b.health : 0, frac = hp / P['damage.bodyHealth'];
    rr(26, y + 8, 188, 12, 6); ctx.fillStyle = '#E2EAEE'; ctx.fill();
    if (frac > 0) {
      const low = frac < 0.3 && Math.floor(app.realT * 4) % 2 === 0;
      rr(26, y + 8, Math.max(12, 188 * frac), 12, 6); ctx.fillStyle = low ? C.warning : C.dummy; ctx.fill(); ctx.strokeStyle = C.joints; ctx.lineWidth = 1; ctx.stroke();
    }
    txt(num(hp) + ' / ' + num(P['damage.bodyHealth']), 26, y + 38, '700 13px ' + F_MONO, C.primary);
    txt('REACH ' + Math.round(s.reach()), 214, y + 38, '700 11px ' + F_MONO, C.secondary, 'right');
    y += 66; label('CHARGE', 26, y);
    const cap = P['battery.capacity'];
    for (let i = 0; i < cap; i++) {
      const cw = (188 - (cap - 1) * 6) / cap, x = 26 + i * (cw + 6), f = Math.max(0, Math.min(1, b.charge - i));
      rr(x, y + 8, cw, 16, 4); ctx.fillStyle = '#E2EAEE'; ctx.fill();
      if (f > 0) { rr(x, y + 8, cw * f, 16, 4); ctx.fillStyle = f >= 1 ? C.primary : C.secondary; ctx.fill(); }
    }
    y += 50; label('ROAD ' + (s.roadIndex + 1) + ' OF ' + LEVEL_LIST.length, 26, y);
    const quota = s.quota;
    for (let i = 0; i < quota; i++) {
      const x = 26 + i * 38; rr(x, y + 8, 32, 32, 6);
      ctx.fillStyle = i < r.writeOffs ? C.dummy : '#E2EAEE'; ctx.fill(); ctx.strokeStyle = i < r.writeOffs ? C.joints : '#C9D5DB'; ctx.lineWidth = 1; ctx.stroke();
      if (i < r.writeOffs) { ctx.strokeStyle = C.joints; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x + 8, y + 32); ctx.lineTo(x + 24, y + 16); ctx.stroke(); }
    }
    txt('Write-offs ' + r.writeOffs + ' / ' + quota + '  ·  total ' + s.totalWriteOffs(), 26, y + 60, '700 12px ' + F_UI, C.primary);
    y += 86; label('BUILD', 26, y);
    const cols = [['Torso', 'hips', 'spine'], ['Arms', 'carry', 'throw']];
    cols.forEach((cl, ci) => {
      const yy = y + 12 + ci * 58;
      txt(cl[0].toUpperCase(), 26, yy + 10, '700 10px ' + F_UI, C.secondary);
      [cl[1], cl[2]].forEach((n, k) => {
        const x = 26 + k * 100, own = s.has(n);
        rr(x, yy + 16, 84, 28, 8); ctx.fillStyle = own ? C.aqua : 'rgba(255,255,255,0.7)'; ctx.fill();
        ctx.strokeStyle = own ? C.aquaDeep : '#C9D5DB'; ctx.lineWidth = 1.2; ctx.stroke();
        txt(NODES[n].name, x + 42, yy + 34, '700 12px ' + F_UI, own ? '#06202B' : C.secondary, 'center');
        if (k === 0) { ctx.strokeStyle = '#9FB0BA'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 86, yy + 30); ctx.lineTo(x + 98, yy + 30); ctx.stroke(); }
      });
    });
    if (app.tuned) { rr(26, FY + FH - 40, 188, 24, 6); ctx.fillStyle = 'rgba(228,68,46,0.12)'; ctx.fill(); txt('TUNED RUN · UNRANKED', 120, FY + FH - 24, '700 10px ' + F_UI, C.warning, 'center'); }

    // right column
    const X = VW - 228; panel(X, FY, 216, FH);
    y = FY + 26; label('RECORD', X + 14, y);
    txt(num(r.points), X + 14, y + 36, '700 28px ' + F_MONO, C.primary);
    txt('points', X + 14, y + 54, '400 11px ' + F_UI, C.secondary);
    rr(X + 120, y + 12, 82, 44, 10); ctx.fillStyle = r.credits ? C.dummy : '#E2EAEE'; ctx.fill();
    txt(String(r.credits), X + 161, y + 40, '700 22px ' + F_MONO, C.primary, 'center');
    txt('credits', X + 161, y + 70, '400 11px ' + F_UI, C.secondary, 'center');
    y += 100; label('FLEET', X + 14, y);
    ['sedan', 'van'].forEach((k, i) => {
      const m = s.models[k], yy = y + 22 + i * 26;
      txt(m.id, X + 14, yy, '700 12px ' + F_MONO, C.primary);
      const so = s.modelStandoff(m), wary = so > P['proto.standoffDistance'] + 1e-6;
      txt('stops ' + (so / P['proto.scale.unitsPerMetre']).toFixed(1) + ' m', X + 104, yy, '700 12px ' + F_MONO, wary ? C.warning : C.ink2);
    });
    txt('Stop line learns from hits', X + 14, y + 78, '400 11px ' + F_UI, C.secondary);
    y += 104; label('SHIFT', X + 14, y);
    const onRoad = s.cars.length;
    txt(r.admitted + ' / ' + s.schedule.length, X + 14, y + 26, '700 16px ' + F_MONO, C.primary);
    txt('admitted', X + 96, y + 26, '400 11px ' + F_UI, C.secondary);
    txt(onRoad + ' on the road', X + 14, y + 46, '400 12px ' + F_UI, C.ink2);
    if (s.slot < s.schedule.length) {
      const due = s.nextAt;
      txt('next ' + s.schedule[s.slot].cls + ' in ' + Math.max(0, due - s.t).toFixed(1) + ' s', X + 14, y + 64, '400 12px ' + F_UI, C.ink2);
    } else txt('schedule complete', X + 14, y + 64, '400 12px ' + F_UI, C.ink2);
    y += 92; label('CLOCK', X + 14, y);
    txt(fmtT(s.tOffset + s.t), X + 14, y + 30, '700 22px ' + F_MONO, C.primary);
    txt('active time', X + 90, y + 30, '400 11px ' + F_UI, C.secondary);
    y += 52; label('VIEW', X + 14, y);
    txt(P['proto.zonesEverywhere'] ? 'Scanners everywhere' : 'Scanners in view cone', X + 14, y + 22, '400 12px ' + F_UI, C.ink2);
    txt(P['proto.pathsEverywhere'] ? 'Car paths always shown' : 'Car paths in view cone', X + 14, y + 40, '400 12px ' + F_UI, C.ink2);
    txt('Drivers: Highway Code', X + 14, y + 58, '400 12px ' + F_UI, C.ink2);
    txt(P['proto.sensorStraight'] ? 'Sensors: straight ahead' : 'Sensors: follow the road', X + 14, y + 76, '400 12px ' + F_UI, C.ink2);
  }

  // ---------- field
  function drawField(s, still) {
    const P = s.P, L = s.level;
    ctx.save();
    rr(FX, FY, FW, FH, 6); ctx.clip();
    ctx.translate(FX, FY);
    if (!still) { const sh = shakeOffset(); ctx.translate(sh.x, sh.y); zoomApply(); }
    ctx.fillStyle = C.floor; ctx.fillRect(-24, -24, FW + 48, FH + 48);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 0; x <= FW; x += 40) { ctx.moveTo(x + 0.5, -24); ctx.lineTo(x + 0.5, FH + 24); }
    for (let y = 0; y <= FH; y += 40) { ctx.moveTo(-24, y + 0.5); ctx.lineTo(FW + 24, y + 0.5); }
    ctx.stroke();
    ctx.strokeStyle = '#B9C7CF'; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let x = 200; x < FW; x += 200) for (let y = 200; y < FH; y += 200) { ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 6); }
    ctx.stroke();
    // road
    const road = (w, col, dash) => {
      ctx.beginPath(); L.center.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.lineJoin = 'round'; ctx.lineCap = 'butt'; ctx.lineWidth = w; ctx.strokeStyle = col; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
    };
    const lw = P['world.laneWidth'], sh = P['proto.shoulderWidth'];
    road(2 * lw + 2 * sh + 2, C.grid); road(2 * lw + 2 * sh - 2, C.shoulder);
    road(2 * lw + 3, C.structure); road(2 * lw - 1, C.road);
    road(2, 'rgba(74,90,102,0.55)', [16, 14]);
    if (CG && CG.environment) drawShapes(CG.environment[s.levelId || L.id]);
    drawShadows(s);
    // statics, lit from the top right
    for (const st of L.statics) {
      if (st.kind === 'pillar') {
        ctx.fillStyle = '#AEBBC3'; ctx.fillRect(st.x, st.y, st.w, st.h);
        const pg = ctx.createLinearGradient(st.x + st.w, st.y, st.x, st.y + st.h); pg.addColorStop(0, '#E4EAEE'); pg.addColorStop(1, '#B4C0C8');
        ctx.fillStyle = pg; ctx.fillRect(st.x + 3, st.y + 3, st.w - 6, st.h - 6);
        ctx.strokeStyle = '#7E8C96'; ctx.lineWidth = 1; ctx.strokeRect(st.x + 0.5, st.y + 0.5, st.w - 1, st.h - 1);
        ctx.fillStyle = 'rgba(16,20,23,0.45)'; ctx.font = '700 8px ' + F_MONO; ctx.textAlign = 'center'; ctx.fillText('P' + st.id.slice(1), st.x + st.w / 2, st.y + st.h / 2 + 3);
        continue;
      }
      ctx.fillStyle = st.kind === 'barrier' ? C.structure : '#C8D2D8'; ctx.fillRect(st.x, st.y, st.w, st.h);
      ctx.strokeStyle = '#8E9CA6'; ctx.lineWidth = 1; ctx.strokeRect(st.x + 0.5, st.y + 0.5, st.w - 1, st.h - 1);
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(st.x + 1, st.y + 1.5); ctx.lineTo(st.x + st.w - 1.5, st.y + 1.5); ctx.lineTo(st.x + st.w - 1.5, st.y + st.h - 1); ctx.stroke();
      if (st.kind === 'crate') { ctx.beginPath(); ctx.moveTo(st.x + 4, st.y + 4); ctx.lineTo(st.x + st.w - 4, st.y + st.h - 4); ctx.moveTo(st.x + st.w - 4, st.y + 4); ctx.lineTo(st.x + 4, st.y + st.h - 4); ctx.strokeStyle = '#9AA8B1'; ctx.stroke(); }
      else { ctx.save(); ctx.beginPath(); ctx.rect(st.x, st.y, st.w, st.h); ctx.clip(); ctx.strokeStyle = 'rgba(16,20,23,0.35)'; ctx.lineWidth = 3; for (let x = st.x - 20; x < st.x + st.w + 20; x += 14) { ctx.beginPath(); ctx.moveTo(x, st.y + st.h); ctx.lineTo(x + st.h, st.y); ctx.stroke(); } ctx.restore(); }
    }
    if (!still) drawLive(s);
    else for (const cn of s.cones) drawCone(cn, cn.x, cn.y, P, 0);
    ctx.restore();
  }
  const SUN = { x: -Math.SQRT1_2, y: Math.SQRT1_2 }; // light from 1:30, shadows fall to 7:30
  function coneLift(cn) { return cn.state === 'flight' ? 10 * Math.sin(Math.PI * clamp(1 - cn.flightT / (cn.flightDur || 1), 0, 1)) : 0; }
  function drawShadows(s) {
    const P = s.P, k = P['proto.art.shadowScale'], b = s.body;
    const off = (h) => ({ x: SUN.x * h * k, y: SUN.y * h * k });
    ctx.fillStyle = 'rgba(16,40,56,0.17)';
    for (const st of s.level.statics) {
      const o = off(P[st.kind === 'crate' ? 'proto.art.crateHeight' : st.kind === 'pillar' ? 'proto.art.pillarHeight' : 'proto.art.barrierHeight']);
      ctx.beginPath(); ctx.moveTo(st.x + st.w, st.y); ctx.lineTo(st.x + st.w, st.y + st.h); ctx.lineTo(st.x + st.w + o.x, st.y + st.h + o.y);
      ctx.lineTo(st.x + o.x, st.y + st.h + o.y); ctx.lineTo(st.x + o.x, st.y + o.y); ctx.lineTo(st.x, st.y); ctx.closePath(); ctx.fill();
    }
    const cr = P['props.cone.radius'];
    for (const cn of s.cones) {
      if (cn.state !== 'free' && cn.state !== 'flight') continue;
      const o = off(P['proto.art.coneHeight'] + coneLift(cn)); ctx.beginPath(); ctx.arc(cn.x + o.x, cn.y + o.y, cr * 1.05, 0, TAU); ctx.fill();
    }
    for (const c of s.cars) {
      const o = off(P['vehicles.' + c.cls + '.height']);
      ctx.save(); ctx.translate(c.x + o.x, c.y + o.y); ctx.rotate(c.h); rr(-c.L / 2, -c.W / 2, c.L, c.W, 7); ctx.fill(); ctx.restore();
    }
    const dk = dropK(), dh = dk && CJ ? jv(CJ.states.replacementDrop.height) * dk : 0;
    if (b.alive) { const o = off(P['proto.art.dummyHeight'] + (b.mode === 'lunge' ? 8 : 0) + dh); ctx.beginPath(); ctx.arc(b.x + o.x, b.y + o.y, 13, 0, TAU); ctx.fill(); }
    ctx.fillStyle = 'rgba(16,40,56,0.12)';
    for (const d of s.drones) {
      const o = off(P['proto.art.droneHeight'] * d.alt);
      ctx.save(); ctx.translate(d.x + o.x, d.y + o.y); ctx.rotate(Math.PI / 4); ctx.fillRect(-16, -2.5, 32, 5); ctx.fillRect(-2.5, -16, 5, 32); ctx.restore();
      if (d.state === 'carry') { const oc = off(P['proto.art.droneHeight'] * d.alt - 12); ctx.beginPath(); ctx.arc(d.x + oc.x, d.y + oc.y, cr, 0, TAU); ctx.fill(); }
    }
  }
  function drawDrone(s, d) {
    const P = s.P, sc = 0.85 + 0.25 * d.alt;
    if (d.state === 'carry') {
      const cn = s.cones.find((c) => c.id === d.cone);
      if (cn) { ctx.strokeStyle = 'rgba(16,20,23,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 4, d.y + 18); ctx.stroke(); drawCone(cn, d.x - 4, d.y + 20, P, 6); }
    }
    ctx.save(); ctx.translate(d.x, d.y); ctx.scale(sc, sc);
    ctx.strokeStyle = '#3C4A54'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-12, -12); ctx.lineTo(12, 12); ctx.moveTo(12, -12); ctx.lineTo(-12, 12); ctx.stroke(); ctx.lineCap = 'butt';
    for (const [rx, ry] of [[-12, -12], [12, -12], [12, 12], [-12, 12]]) {
      ctx.beginPath(); ctx.arc(rx, ry, 8, 0, TAU); ctx.fillStyle = 'rgba(79,195,232,0.16)'; ctx.fill(); ctx.strokeStyle = 'rgba(30,143,184,0.55)'; ctx.lineWidth = 1; ctx.stroke();
      const a = app.realT * 40 + rx; ctx.strokeStyle = 'rgba(16,20,23,0.45)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(rx - Math.cos(a) * 7, ry - Math.sin(a) * 7); ctx.lineTo(rx + Math.cos(a) * 7, ry + Math.sin(a) * 7); ctx.stroke();
    }
    rr(-8, -6, 16, 12, 4); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = '#3C4A54'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = C.aqua; ctx.fillRect(-8, -1.5, 16, 3);
    ctx.fillStyle = Math.floor(app.realT * 4) % 2 ? C.warning : C.aqua; ctx.beginPath(); ctx.arc(0, -3.5, 1.6, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function wedge(b, P) {
    const hw = P['sensing.coneWidth'] * DEG / 2, R = P['sensing.coneReach'];
    ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.arc(b.x, b.y, R, b.facing - hw, b.facing + hw); ctx.closePath();
  }
  function carLocal(c, fn) { ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.h); fn(); ctx.restore(); }

  function corridorPts(s, c) {
    const P = s.P, hw = c.W / 2 + P['body.radius'];
    if (P['proto.sensorStraight']) {
      const ca = Math.cos(c.h), sa = Math.sin(c.h);
      return [[c.L / 2, -hw], [c.L / 2 + c.fwdLen, -hw], [c.L / 2 + c.fwdLen, hw], [c.L / 2, hw]].map(([u, v]) => [c.x + u * ca - v * sa, c.y + u * sa + v * ca]);
    }
    const s0 = c.s + c.L / 2, s1 = Math.min(c.path.length, s0 + c.fwdLen);
    if (s1 <= s0) return null;
    const left = [], right = [];
    for (let sv = s0; ; sv += 10) {
      const sx = Math.min(sv, s1), p = pathAt(c.path, sx);
      left.push([p.x + p.nx * (c.d - hw), p.y + p.ny * (c.d - hw)]); right.push([p.x + p.nx * (c.d + hw), p.y + p.ny * (c.d + hw)]);
      if (sx >= s1) break;
    }
    return left.concat(right.reverse());
  }
  function sensorPath(s, c, poly) {
    const P = s.P, R = P['perception.sideRadius'], ha = P['perception.sideHalfAngle'] * DEG;
    const nx = c.x + Math.cos(c.h) * c.L / 2, ny = c.y + Math.sin(c.h) * c.L / 2;
    ctx.beginPath();
    if (poly) { poly.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); }
    for (const sgn of [1, -1]) { ctx.moveTo(nx, ny); ctx.arc(nx, ny, R, c.h + sgn * Math.PI / 2 - ha, c.h + sgn * Math.PI / 2 + ha); ctx.closePath(); }
  }
  function blindSpots(s, c) {
    const nx = c.x + Math.cos(c.h) * c.L / 2, ny = c.y + Math.sin(c.h) * c.L / 2, out = [], reach = c.fwdLen + 160;
    const add = (pts) => {
      let lo = null, hi = null;
      for (const p of pts) {
        let a = Math.atan2(p[1] - ny, p[0] - nx) - c.h; while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU;
        if (Math.abs(a) > Math.PI * 0.92) return;
        if (!lo || a < lo.a) lo = { a, p }; if (!hi || a > hi.a) hi = { a, p };
      }
      const far = (p) => { const dx = p[0] - nx, dy = p[1] - ny, l = Math.hypot(dx, dy) || 1; return [nx + dx / l * 700, ny + dy / l * 700]; };
      out.push([lo.p, hi.p, far(hi.p), far(lo.p)]);
    };
    for (const st of s.level.statics) {
      if (Math.hypot(st.x + st.w / 2 - nx, st.y + st.h / 2 - ny) > reach) continue;
      add([[st.x, st.y], [st.x + st.w, st.y], [st.x + st.w, st.y + st.h], [st.x, st.y + st.h]]);
    }
    for (const o of s.cars) {
      if (o === c || o.cls !== 'van' || Math.hypot(o.x - nx, o.y - ny) > reach) continue;
      const ca = Math.cos(o.h), sa = Math.sin(o.h), hx = o.L / 2, hy = o.W / 2;
      add([[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]].map(([u, v]) => [o.x + u * ca - v * sa, o.y + u * sa + v * ca]));
    }
    return out;
  }
  function drawZones(s, c) {
    const P = s.P, hot = !!c.det.fwd || !!(c.hz && c.hz.inPath), poly = corridorPts(s, c);
    if (poly) {
      ctx.beginPath(); poly.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
      ctx.fillStyle = hatch || (hatch = hatchPattern(0.32)); ctx.globalAlpha = hot ? 1 : 0.7; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = hot ? C.primary : 'rgba(74,90,102,0.7)'; ctx.lineWidth = hot ? 1.6 : 1; ctx.stroke();
    }
    carLocal(c, () => {
      const R = P['perception.sideRadius'], ha = P['perception.sideHalfAngle'] * DEG;
      for (const sgn of [1, -1]) {
        ctx.beginPath(); ctx.moveTo(c.L / 2, 0); ctx.arc(c.L / 2, 0, R, sgn * Math.PI / 2 - ha, sgn * Math.PI / 2 + ha); ctx.closePath();
        ctx.fillStyle = c.det.side ? 'rgba(74,90,102,0.16)' : 'rgba(74,90,102,0.06)'; ctx.fill();
        ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(74,90,102,0.55)'; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
      }
    });
    const spots = blindSpots(s, c);
    if (!spots.length) return;
    ctx.save(); sensorPath(s, c, poly); ctx.clip();
    for (const sp of spots) {
      ctx.beginPath(); sp.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
      ctx.fillStyle = 'rgba(237,241,243,0.92)'; ctx.fill();
      ctx.fillStyle = 'rgba(79,195,232,0.14)'; ctx.fill();
      ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(30,143,184,0.85)'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]);
      const mx = (sp[0][0] + sp[1][0]) / 2, my = (sp[0][1] + sp[1][1]) / 2, fx2 = (sp[2][0] + sp[3][0]) / 2, fy2 = (sp[2][1] + sp[3][1]) / 2;
      const lx = mx + (fx2 - mx) * 0.06, ly = my + (fy2 - my) * 0.06;
      txt('BLIND', lx, ly + 3, '700 9px ' + F_MONO, C.aquaDeep, 'center');
    }
    ctx.restore();
  }
  function drawPath(s, c) {
    let pts = null, provisional = false;
    if (c.man && (c.state === 'committed')) pts = s.predict(c, c.man, s.t, c.man.until);
    else if (c.intent && c.state === 'intention') {
      provisional = true;
      const span = c.intent.type === 'shift' ? c.intent.len / Math.max(c.v, 40) + 0.3 : s.P['traffic.commitHorizon'];
      pts = s.predict(c, Object.assign({ t0: s.t }, c.intent), s.t, s.t + span);
    }
    if (!pts || pts.length < 2) return;
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.setLineDash(provisional ? [3, 7] : [10, 6]); ctx.lineWidth = provisional ? 1.5 : 2.5;
    ctx.strokeStyle = provisional ? C.secondary : C.primary; ctx.stroke(); ctx.setLineDash([]);
    if (!provisional && c.man && c.man.standoff) {
      const q = pathAt(c.path, c.man.sStop + c.L / 2), hw = c.W / 2 + 10;
      ctx.strokeStyle = C.warning; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(q.x + q.nx * (c.d - hw), q.y + q.ny * (c.d - hw)); ctx.lineTo(q.x + q.nx * (c.d + hw), q.y + q.ny * (c.d + hw)); ctx.stroke();
      txt('STOP', q.x + q.nx * (c.d + hw + 14), q.y + q.ny * (c.d + hw + 14) + 3, '700 9px ' + F_MONO, C.warning, 'center');
    }
    const e = pts[pts.length - 1], ex = e.x, ey = e.y;
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(e.h); rr(-c.L / 2, -c.W / 2, c.L, c.W, 6);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = provisional ? 'rgba(74,90,102,0.6)' : C.primary; ctx.lineWidth = 1.4; ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  }
  function drawCar(s, c) {
    const braking = (c.man && c.man.type === 'brake') || c.state === 'interrupted' || (c._pv != null && c.v < c._pv - 0.4);
    c._pv = c.v;
    markCar(c, braking);
    const pulse = app.realT - (fx.carPulse.get(c.id) != null ? fx.carPulse.get(c.id) : -9);
    // roof highlight from the top-right sun, expressed in car-local axes
    const lx = Math.cos(-c.h) * 1 - Math.sin(-c.h) * -1, ly = Math.sin(-c.h) * 1 + Math.cos(-c.h) * -1;
    carLocal(c, () => {
      if (pulse < 0.25) { const k = 1 + 0.1 * (1 - pulse / 0.25); ctx.scale(k, k); }
      if (c.honking && Math.floor(app.realT * 5) % 2 === 0) {
        ctx.fillStyle = 'rgba(255,236,170,0.55)';
        for (const sy of [-1, 1]) { ctx.beginPath(); ctx.moveTo(c.L / 2, sy * (c.W / 2 - 4)); ctx.lineTo(c.L / 2 + 46, sy * (c.W / 2 + 10)); ctx.lineTo(c.L / 2 + 46, sy * (c.W / 2 - 14)); ctx.closePath(); ctx.fill(); }
      }
      rr(-c.L / 2, -c.W / 2, c.L, c.W, 7); ctx.fillStyle = c.cls === 'van' ? '#71808A' : C.fleet; ctx.fill();
      ctx.strokeStyle = '#4E5B64'; ctx.lineWidth = 1.2; ctx.stroke();
      const lg = ctx.createLinearGradient(lx * 16, ly * 16, -lx * 16, -ly * 16);
      lg.addColorStop(0, 'rgba(255,255,255,0.34)'); lg.addColorStop(0.55, 'rgba(255,255,255,0)'); lg.addColorStop(1, 'rgba(16,20,23,0.14)');
      rr(-c.L / 2 + 2, -c.W / 2 + 2, c.L - 4, c.W - 4, 6); ctx.fillStyle = lg; ctx.fill();
      if (CG && CG.vehicles && CG.vehicles[c.cls]) drawShapes(CG.vehicles[c.cls].roof, 1, c.h);
      if (pulse < 0.12) { rr(-c.L / 2, -c.W / 2, c.L, c.W, 7); ctx.fillStyle = 'rgba(255,255,255,' + (0.7 * (1 - pulse / 0.12)) + ')'; ctx.fill(); }
      ctx.fillStyle = '#56636C'; rr(c.L / 2 - 18, -c.W / 2 + 4, 9, c.W - 8, 3); ctx.fill(); // windscreen
      if (c.cls === 'van') { ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(-c.L / 2 + 6, -c.W / 2 + 5, c.L - 30, c.W - 10); }
      ctx.fillStyle = '#F2F5F7'; ctx.fillRect(c.L / 2 - 3, -c.W / 2 + 3, 3, 5); ctx.fillRect(c.L / 2 - 3, c.W / 2 - 8, 3, 5);
      ctx.fillStyle = braking ? C.warning : '#8A3A30'; ctx.fillRect(-c.L / 2, -c.W / 2 + 3, 3, 6); ctx.fillRect(-c.L / 2, c.W / 2 - 9, 3, 6);
      if (c.v < -1) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-c.L / 2 - 1, -c.W / 2 + 9, 3, 4); ctx.fillRect(-c.L / 2 - 1, c.W / 2 - 13, 3, 4);
        ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.beginPath(); ctx.moveTo(-c.L / 2, -c.W / 2 + 4); ctx.lineTo(-c.L / 2 - 30, -c.W / 2 - 4); ctx.lineTo(-c.L / 2 - 30, c.W / 2 + 4); ctx.lineTo(-c.L / 2, c.W / 2 - 4); ctx.closePath(); ctx.fill(); }
      if (braking && c.v > 5) { ctx.strokeStyle = 'rgba(16,20,23,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-c.L / 2 - 4, -c.W / 2 + 6); ctx.lineTo(-c.L / 2 - 18, -c.W / 2 + 6); ctx.moveTo(-c.L / 2 - 4, c.W / 2 - 6); ctx.lineTo(-c.L / 2 - 18, c.W / 2 - 6); ctx.stroke(); }
      const sig = s.signalSide(c);
      if (c.honking ? Math.floor(app.realT * 5) % 2 === 0 : sig && Math.floor(app.realT * 3) % 2 === 0) {
        ctx.fillStyle = '#F2A33A';
        for (const sd of c.honking ? [-1, 1] : [sig]) { ctx.fillRect(c.L / 2 - 6, sd * c.W / 2 - 2.5, 6, 5); ctx.fillRect(-c.L / 2, sd * c.W / 2 - 2.5, 6, 5); }
      }
      if (c.spent) { ctx.strokeStyle = C.primary; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-c.L / 2 + 6, c.W / 2 - 3); ctx.lineTo(c.L / 2 - 6, -c.W / 2 + 3); ctx.stroke(); }
      // state pip
      const cue = s.carCue(c);
      ctx.lineWidth = 2.5;
      if (cue === 'intention' && c.intent) {
        const side = c.intent.type === 'shift' ? Math.sign(c.intent.d1 - c.intent.d0) : 0;
        ctx.strokeStyle = C.secondary; ctx.beginPath();
        if (side) { ctx.moveTo(-6, -side * 2); ctx.lineTo(0, side * 6); ctx.lineTo(6, -side * 2); }
        else { ctx.moveTo(-3, -6); ctx.lineTo(4, 0); ctx.lineTo(-3, 6); }
        ctx.stroke();
      } else if (cue === 'committed' || cue === 'expiring') {
        ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = C.primary; ctx.beginPath();
        if (cue === 'committed') ctx.arc(0, 0, 7, 0, Math.PI * 2);
        else { const P = s.P, win = P['movement.lungeDuration'] + P['movement.lungeRecovery'], f = Math.max(0, (c.man.until - s.t) / win); ctx.arc(0, 0, 7, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f); }
        ctx.stroke();
      } else if (cue === 'caution') {
        ctx.strokeStyle = C.secondary; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(6.5, 5); ctx.lineTo(-6.5, 5); ctx.closePath(); ctx.stroke();
        ctx.fillStyle = C.secondary; ctx.fillRect(-1, -2.5, 2, 4); ctx.fillRect(-1, 2.5, 2, 1.5);
      } else if (cue === 'interrupted') {
        ctx.strokeStyle = C.warning; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = C.warning; ctx.fillRect(-1.5, -5, 3, 6); ctx.fillRect(-1.5, 3, 3, 2.5);
      }
    });
    // tag (screen-aligned)
    const tag = c.model + (c.spent ? ' · SPENT' : '');
    ctx.font = '700 10px ' + F_MONO; const tw = ctx.measureText(tag).width;
    const ty = c.y - Math.max(c.L, c.W) / 2 - 12;
    rr(c.x - tw / 2 - 5, ty - 10, tw + 10, 15, 4); ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fill();
    ctx.strokeStyle = c.spent ? C.primary : 'rgba(74,90,102,0.5)'; ctx.lineWidth = 1; ctx.stroke();
    txt(tag, c.x, ty + 1, '700 10px ' + F_MONO, C.primary, 'center');
    if (c.honking) {
      const bob = Math.sin(app.realT * 14) * 1.5 * MOTION, bx = c.x + tw / 2 + 12, by = ty - 14 + bob;
      rr(bx, by - 10, 46, 17, 8); ctx.fillStyle = Math.floor(app.realT * 5) % 2 ? '#FFFFFF' : '#FFF1C9'; ctx.fill(); ctx.strokeStyle = C.primary; ctx.lineWidth = 1.2; ctx.stroke();
      txt(c.honkAt === 'body' ? 'HONK!' : 'FLASH', bx + 23, by + 2, '700 10px ' + F_MONO, C.primary, 'center');
      const last = fx.horn.get(c.id) || 0; if (c.honkAt === 'body' && app.realT - last > 1.4) { horn(); fx.horn.set(c.id, app.realT); }
    }
    if (s.P['proto.learningEnabled']) {
      const n = seniorityOf(c);
      for (let j = 0; j < 3; j++) { ctx.fillStyle = j < n ? C.primary : '#C9D5DB'; ctx.fillRect(c.x + tw / 2 + 8 + j * 5, ty - 8, 3, 10); }
    }
  }
  function drawCone(cn, x, y, P, lift) {
    const r = P['props.cone.radius'], seed = parseInt(cn.id.replace(/\D/g, ''), 10) || 0;
    ctx.save(); ctx.translate(x, y - (lift || 0) * 0.4); const sc = 1 + (lift || 0) * 0.015; ctx.scale(sc, sc);
    ctx.save(); ctx.rotate(seed * 0.7);
    rr(-r * 1.1, -r * 1.1, r * 2.2, r * 2.2, 2.5); ctx.fillStyle = '#B9342A'; ctx.fill(); ctx.strokeStyle = C.primary; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
    const g = ctx.createRadialGradient(r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
    g.addColorStop(0, '#FF8A5C'); g.addColorStop(0.6, C.warning); g.addColorStop(1, '#B5301F');
    ctx.beginPath(); ctx.arc(0, 0, r * 0.92, 0, TAU); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = C.primary; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * 0.56, 0, TAU); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * 0.22, 0, TAU); ctx.fillStyle = '#FFB08F'; ctx.fill(); ctx.strokeStyle = 'rgba(16,20,23,0.5)'; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.restore();
  }
  function reachEnd(s) {
    const b = s.body, R = s.reach(), r = s.P['body.radius'];
    const cx = Math.cos(b.facing), cy = Math.sin(b.facing);
    let d = 0;
    for (; d < R; d += 3) {
      const x = b.x + cx * d, y = b.y + cy * d;
      if (s.level.statics.some((st) => x + r > st.x && x - r < st.x + st.w && y + r > st.y && y - r < st.y + st.h)) { d = Math.max(0, d - 3); break; }
    }
    d = Math.min(d, R);
    return { x: b.x + cx * d, y: b.y + cy * d, short: d < R - 1 };
  }
  function drawBody(s) {
    const b = s.body, P = s.P;
    if (!b.alive) return;
    if (b.mode === 'lunge' && b.lunge) {
      ctx.strokeStyle = 'rgba(16,20,23,0.28)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(b.lunge.x0, b.lunge.y0); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.lineCap = 'butt';
    } else {
      const e = reachEnd(s), nx = -Math.sin(b.facing), ny = Math.cos(b.facing);
      ctx.strokeStyle = 'rgba(16,20,23,0.55)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(e.x - nx * 6, e.y - ny * 6); ctx.lineTo(e.x + nx * 6, e.y + ny * 6); ctx.stroke();
      if (e.short) { ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI * 2); ctx.stroke(); }
    }
    ctx.save(); ctx.translate(b.x, b.y);
    const dk = dropK();
    if (dk) { // replacement chassis lowered on a cable, then set down (presentation only)
      const h = jv(CJ.states.replacementDrop.height) * dk;
      ctx.strokeStyle = 'rgba(16,20,23,' + (0.5 * dk) + ')'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, -h * 0.5); ctx.lineTo(0, -b.y - 30); ctx.stroke();
      ctx.translate(0, -h * 0.5); ctx.scale(1 + h / 160, 1 + h / 160);
    }
    // charge ring (screen-aligned)
    const cap = P['battery.capacity'], seg = (Math.PI * 2) / cap, gap = 0.28;
    for (let i = 0; i < cap; i++) {
      const a0 = -Math.PI / 2 + i * seg + gap / 2, a1 = a0 + seg - gap, f = Math.max(0, Math.min(1, b.charge - i));
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(16,20,23,0.12)'; ctx.beginPath(); ctx.arc(0, 0, 20, a0, a1); ctx.stroke();
      if (f > 0) { ctx.strokeStyle = f >= 1 ? C.primary : C.secondary; ctx.beginPath(); ctx.arc(0, 0, 20, a0, a0 + (a1 - a0) * f); ctx.stroke(); }
    }
    if (b.denied > 0) { ctx.strokeStyle = C.warning; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.stroke(); }
    const wear = clamp(1 - b.health / P['damage.bodyHealth'], 0, 1), fl = app.realT - fx.flinchT0;
    let jx = 0, jy = 0;
    if (fl < 0.3) { const k = (1 - fl / 0.3) * 4 * MOTION; jx += Math.sin(app.realT * 97) * k; jy += Math.cos(app.realT * 83) * k; }
    if (wear > 0.6) { const k = (wear - 0.6) * 2.5 * MOTION; jx += Math.sin(app.realT * 41) * k; jy += Math.cos(app.realT * 37) * k; }
    ctx.translate(jx, jy);
    const cr = fx.crumple, ca = app.realT - cr.t0;
    if (ca < cr.dur && cr.amt) { // squash along the hit normal, overshoot, settle (presentation only)
      const u = ca / cr.dur, q = cr.amt * Math.cos(u * Math.PI * 2.5) * Math.pow(1 - u, 2) * MOTION;
      ctx.rotate(cr.ang); ctx.scale(1 - q, 1 + q * 0.6); ctx.rotate(-cr.ang);
    }
    const sb = fx.stumble, sa0 = app.realT - sb.t0, stumbling = sa0 < sb.dur && sb.amp;
    const wob = stumbling ? Math.sin(sa0 * 22) * sb.amp * (1 - sa0 / sb.dur) * MOTION : 0;
    ctx.rotate(b.facing + wob + (wear > 0.4 ? Math.sin(app.realT * 6) * 0.06 * wear * MOTION : 0));
    let sx = 1, sy = 1;
    if (b.mode === 'lunge') { sx = 1.16; sy = 0.88; } else if (b.mode === 'recover') { sx = 0.9; sy = 1.08; }
    else if (b.mode === 'knock') { sx = 0.86; sy = 1.12; ctx.rotate(Math.sin(b.knockT * 38) * 0.35 * MOTION); }
    ctx.scale(sx, sy);
    // dented outline: dents appear and deepen as health is lost (fixed per chassis)
    const dents = [];
    for (let i = 0; i < 5; i++) { const on = wear - i * 0.16; if (on > 0) dents.push({ a: (b.chassis * 1.7 + i * 2.39) % TAU, d: Math.min(4.5, on * 15) }); }
    const shape = () => {
      ctx.beginPath();
      for (let j = 0; j <= 48; j++) {
        const a = j / 48 * TAU; let r = 13;
        for (const dn of dents) { const cc = Math.cos(a - dn.a); if (cc > 0) r -= dn.d * Math.pow(cc, 12); }
        j ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
    };
    const skin = mix(C.dummy, '#9C9070', wear * 0.75);
    shape(); ctx.fillStyle = skin; ctx.fill();
    ctx.save(); shape(); ctx.clip();
    const lg = ctx.createLinearGradient(9, -9, -9, 9); lg.addColorStop(0, 'rgba(255,255,255,0.35)'); lg.addColorStop(1, 'rgba(16,20,23,0.12)');
    ctx.fillStyle = lg; ctx.fillRect(-14, -14, 28, 28);
    if (CG && CG.dummy) drawShapes(CG.dummy.markings, 1 - wear * 0.6);
    for (let i = 0; i < Math.floor(wear * 5); i++) { const a = (b.chassis * 2.1 + i * 1.9) % TAU; ctx.fillStyle = 'rgba(26,29,31,0.3)'; ctx.beginPath(); ctx.arc(Math.cos(a) * 8, Math.sin(a) * 8, 2.5 + (i % 2), 0, TAU); ctx.fill(); }
    ctx.restore();
    shape(); ctx.strokeStyle = C.joints; ctx.lineWidth = 1.4; ctx.stroke();
    // shoulder bar bends; the right joint is lost past half health
    ctx.save(); ctx.rotate(wear > 0.35 ? (wear - 0.35) * 0.7 : 0);
    ctx.fillStyle = mix('#E3B23C', '#8E8264', wear * 0.7); rr(-3.5, -14, 7, wear > 0.55 ? 22 : 28, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.joints; ctx.beginPath(); ctx.arc(0, -14, 3.2, 0, TAU); ctx.fill();
    if (wear > 0.55) { ctx.strokeStyle = C.warning; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-1, 8); ctx.lineTo(-3, 12); ctx.moveTo(1, 8); ctx.lineTo(3, 11.5); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(0, 14, 3.2, 0, TAU); ctx.fill(); }
    ctx.restore();
    if (b.held) { ctx.strokeStyle = C.joints; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(12, -6); if (wear <= 0.55) { ctx.moveTo(0, 14); ctx.lineTo(12, 6); } ctx.stroke(); }
    else if (stumbling) { // a miss: arms flail out from the shoulder joints
      const f = 1 - sa0 / sb.dur; ctx.strokeStyle = C.joints; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath();
      for (const sd of wear > 0.55 ? [-1] : [-1, 1]) {
        const a1 = sd * (1.9 + Math.sin(sa0 * 31 + sd) * 0.9 * f), a2 = a1 + sd * Math.sin(sa0 * 43) * 0.8 * f;
        const ex = Math.cos(a1) * 8, ey = sd * 14 + Math.sin(a1) * 8 * sd;
        ctx.moveTo(0, sd * 14); ctx.lineTo(ex, ey); ctx.lineTo(ex + Math.cos(a2) * 6, ey + Math.sin(a2) * 6 * sd);
      }
      ctx.stroke(); ctx.lineCap = 'butt';
    }
    // head knocked off-centre, cracked when nearly spent
    const hx = wear * 2.2, hy = -wear * 1.4;
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(hx, hy, 6.5, 0, TAU); ctx.fill(); ctx.strokeStyle = C.joints; ctx.lineWidth = 1.4; ctx.stroke();
    if (wear > 0.7) { ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx - 3, hy - 4); ctx.lineTo(hx, hy - 1); ctx.lineTo(hx - 1, hy + 2); ctx.lineTo(hx + 2, hy + 5); ctx.stroke(); }
    // facing stays crisp at every wear level
    ctx.strokeStyle = C.joints; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(6.5, 0); ctx.lineTo(24, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, 0); ctx.lineTo(19, -4); ctx.moveTo(24, 0); ctx.lineTo(19, 4); ctx.stroke();
    if (fl < 0.12) { shape(); ctx.fillStyle = 'rgba(255,255,255,' + (0.85 * (1 - fl / 0.12)) + ')'; ctx.fill(); }
    ctx.restore();
    if (b.held) { const p = s.releasePoint(); drawCone(b.held, p.x, p.y, P, 4); }
  }
  function drawEffects(s) {
    for (const e of s.effects) {
      if (e._w == null) e._w = app.realT;
      const age = app.realT - e._w;
      const cf = e._cfg || {}, ry = cf.rays, pu = cf.popup;
      const rayDur = ry ? Math.max(0.1, jv(ry.v.seconds, ry.k)) : 0.9, popDur = pu ? Math.max(0.2, jv(pu.v.seconds, pu.k)) : 0.9;
      if (e.type === 'burst' && age < Math.max(rayDur, popDur)) {
        const big = Math.min(1, e.v / 500);
        if (age < rayDur) { // impact burst cue: radial lines at the contact (D10.3)
          const k = Math.min(1, age / (rayDur * 0.4)), n = ry ? Math.max(4, Math.round(jv(ry.v.count, ry.k))) : 10, len = ry ? jv(ry.v.length, ry.k) : 8 + 18 * big;
          ctx.strokeStyle = 'rgba(16,20,23,' + (1 - age / rayDur) + ')'; ctx.lineWidth = 2 + 2 * big;
          for (let i = 0; i < n; i++) { const a = i * TAU / n + (n % 2 ? 0 : 0.1), r0 = 6 + 14 * k, r1 = r0 + len * (i % 2 ? 0.7 : 1); ctx.beginPath(); ctx.moveTo(e.x + Math.cos(a) * r0, e.y + Math.sin(a) * r0); ctx.lineTo(e.x + Math.cos(a) * r1, e.y + Math.sin(a) * r1); ctx.stroke(); }
          if (age < 0.09) { ctx.fillStyle = 'rgba(255,255,255,' + (1 - age / 0.09) + ')'; ctx.beginPath(); ctx.arc(e.x, e.y, 12 + 14 * big, 0, TAU); ctx.fill(); }
        }
        if (age < popDur) {
          ctx.globalAlpha = Math.max(0, Math.min(1, 3 * (1 - age / popDur)));
          const pk = pu ? jv(pu.v.pop, pu.k) : 1.5, size = pu ? jv(pu.v.size, pu.k) : 13 + 5 * big, rise = pu ? jv(pu.v.rise, pu.k) : 30 * popDur;
          const pop = age < 0.12 ? pk - (pk - 1) * (age / 0.12) : 1;
          const ox = pu ? (cf.nx || 0) * 34 : 0; // P2.1: the value rises on the dummy's side, clear of the car's tag
          ctx.save(); ctx.translate(e.x + ox, e.y - 24 - rise * Math.min(1, age / popDur)); ctx.scale(pop, pop);
          const ang = e.angle != null ? (e.angle < 20 ? 'head-on' : e.angle < 50 ? 'angled' : 'glancing') + ' ' + Math.round(e.angle) + '°' : e.zone;
          const label = '+' + num(e.v) + '  ' + ang;
          if (pu) { ctx.font = '700 ' + size + 'px ' + F_MONO; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.textAlign = 'center'; ctx.strokeText(label, 0, 0); }
          txt(label, 0, 0, '700 ' + size + 'px ' + F_MONO, C.primary, 'center');
          ctx.restore(); ctx.globalAlpha = 1;
        }
      } else if (e.type === 'touch' && age < 0.5) {
        ctx.strokeStyle = 'rgba(74,90,102,' + (0.6 * (1 - age / 0.5)) + ')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(e.x, e.y, 6 + age * 20, 0, Math.PI * 2); ctx.stroke();
      } else if (e.type === 'wreck' && age < 1.6) {
        for (let i = 0; i < 9; i++) {
          const a = i * 0.7 + 0.3, d = 6 + age * (40 + i * 6), x = e.x + Math.cos(a) * d, y = e.y + Math.sin(a) * d;
          ctx.save(); ctx.translate(x, y); ctx.rotate(a + age * (2 + i)); ctx.fillStyle = i % 3 === 0 ? C.joints : C.dummy;
          ctx.globalAlpha = Math.max(0, 1 - age / 1.6); ctx.fillRect(-5, -3, 10, 6); ctx.restore();
        }
        ctx.globalAlpha = 1;
      }
    }
  }
  function drawRingsStreaks() { // P2.1 hit juice: contact rings and speed lines (matte ink, field only)
    const now = app.realT;
    fx.rings = fx.rings.filter((r) => now - r.t0 < r.dur);
    for (const r of fx.rings) {
      const u = (now - r.t0) / r.dur, rad = r.r * (0.25 + 0.75 * (1 - Math.pow(1 - u, 3)));
      ctx.strokeStyle = rgba(C[r.role] || C.primary, 0.8 * (1 - u)); ctx.lineWidth = Math.max(0.5, r.w * (1 - u * 0.6));
      ctx.beginPath(); ctx.arc(r.x, r.y, rad, 0, TAU); ctx.stroke();
    }
    fx.streaks = fx.streaks.filter((st) => now - st.t0 < st.dur);
    ctx.lineCap = 'round';
    for (const st of fx.streaks) {
      const u = (now - st.t0) / st.dur, cx = Math.cos(st.dir), cy = Math.sin(st.dir), px = -cy, py = cx;
      ctx.strokeStyle = rgba(C[st.role] || C.secondary, 0.65 * (1 - u)); ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (const ln of st.lines) {
        const s0 = 10 + ln.lag + u * 26, x0 = st.x + px * ln.off + cx * s0, y0 = st.y + py * ln.off + cy * s0;
        ctx.moveTo(x0, y0); ctx.lineTo(x0 + cx * ln.len * (1 - u * 0.5), y0 + cy * ln.len * (1 - u * 0.5));
      }
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
  }
  function rgba(hex, a) { const h = (i) => parseInt(hex.slice(i, i + 2), 16); return 'rgba(' + h(1) + ',' + h(3) + ',' + h(5) + ',' + Math.max(0, a) + ')'; }
  function lowHealth(key, fallback) { const st = CJ && CJ.states && CJ.states.lowHealth; return st && st[key] ? jv(st[key]) : fallback; }
  function drawParts(s) {
    const b = s.body, P = s.P, now = app.realT;
    if (b.alive && s.phase === 'play') {
      const wear = 1 - b.health / P['damage.bodyHealth'];
      if (wear > lowHealth('smokeFrom', 0.45) && now - fx.smokeT > 0.32 - wear * 0.15) { fx.smokeT = now; puff(b.x, b.y, 1, { type: 'smoke', dir: -2.36, spread: 0.6, speed: 18, life: 1.1, size: 4 + 4 * wear }); }
      if (wear > lowHealth('sparkFrom', 0.7) && Math.random() < 0.05) puff(b.x, b.y, 3, { type: 'spark', speed: 110, life: 0.25, size: 1.6 });
    }
    const dt = Math.min(0.05, now - (fx.lastPartT || now)); fx.lastPartT = now;
    fx.parts = fx.parts.filter((p) => now - p.t0 < p.life);
    for (const p of fx.parts) {
      const a = (now - p.t0) / p.life, col = p.role && C[p.role];
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.93; p.vy *= 0.93;
      if (p.type === 'dust') { ctx.fillStyle = col ? rgba(col, 0.35 * (1 - a)) : 'rgba(122,138,150,' + (0.35 * (1 - a)) + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 + a * 1.5), 0, TAU); ctx.fill(); }
      else if (p.type === 'smoke') { ctx.fillStyle = col ? rgba(col, 0.28 * (1 - a)) : 'rgba(70,78,84,' + (0.28 * (1 - a)) + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 + a * 2), 0, TAU); ctx.fill(); }
      else if (p.type === 'debris') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.spin + a * 9); ctx.fillStyle = rgba(col || C.dummy, 1 - a);
        ctx.fillRect(-p.size, -p.size * 0.6, p.size * 2, p.size * 1.2); ctx.restore();
      } else if (p.type === 'ring') { ctx.strokeStyle = rgba(col || C.secondary, 0.7 * (1 - a)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p.x - p.vx * (now - p.t0), p.y - p.vy * (now - p.t0), p.size * (1 + a * 2), 0, TAU); ctx.stroke(); }
      else { ctx.strokeStyle = col ? rgba(col, 1 - a) : a < 0.5 ? 'rgba(255,240,180,' + (1 - a) + ')' : 'rgba(245,197,66,' + (1 - a) + ')'; ctx.lineWidth = p.size; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); ctx.stroke(); }
    }
  }
  // Generated tyre marks (content/juice.json states.brakeMarks): matte, persistent, under every cue.
  function markCar(c, braking) {
    const bm = CJ && CJ.states && CJ.states.brakeMarks;
    if (!bm) return;
    const ca = Math.cos(c.h), sa = Math.sin(c.h), wheels = [-1, 1].map((sd) => {
      const u = -c.L / 2 + 6, v = sd * (c.W / 2 - 4); return [c.x + u * ca - v * sa, c.y + u * sa + v * ca];
    });
    if (braking && c.v > jv(bm.minSpeed) && c._mk && Math.hypot(wheels[0][0] - c._mk[0][0], wheels[0][1] - c._mk[0][1]) > 1.5) {
      for (let i = 0; i < 2; i++) fx.marks.push({ a: c._mk[i], b: wheels[i], t: app.realT });
      const mx = Math.max(2, Math.round(jv(bm.max)));
      if (fx.marks.length > mx) fx.marks.splice(0, fx.marks.length - mx);
    }
    c._mk = wheels;
  }
  function drawMarks() {
    const bm = CJ && CJ.states && CJ.states.brakeMarks;
    if (!bm || !fx.marks.length) return;
    const fade = jv(bm.fadeSeconds) || 1, al = jv(bm.alpha), col = C[bm.role] || C.primary;
    ctx.lineWidth = jv(bm.width) || 2; ctx.lineCap = 'round';
    fx.marks = fx.marks.filter((m) => app.realT - m.t < fade);
    for (const m of fx.marks) { ctx.strokeStyle = rgba(col, al * (1 - (app.realT - m.t) / fade)); ctx.beginPath(); ctx.moveTo(m.a[0], m.a[1]); ctx.lineTo(m.b[0], m.b[1]); ctx.stroke(); }
    ctx.lineCap = 'butt';
  }
  function dropK() { // replacement-chassis drop: 1 at delivery start, 0 on the floor
    const rd = CJ && CJ.states && CJ.states.replacementDrop;
    if (!rd) return 0;
    const dur = jv(rd.seconds) || 0.5, age = app.realT - fx.dropT0;
    return age >= 0 && age < dur ? 1 - age / dur : 0;
  }
  function drawBarks(s) {
    if (!fx.barks.size) return;
    const dur = pv('proto.ui.barkSeconds') || 1.8;
    for (const [id, bk] of fx.barks) {
      const c = s.cars.find((x) => x.id === id), age = app.realT - bk.t0;
      if (!c || age > dur) { fx.barks.delete(id); continue; }
      ctx.globalAlpha = Math.min(1, 4 * (dur - age), 6 * age);
      ctx.font = '700 10px ' + F_MONO; const w = ctx.measureText(bk.text).width + 14;
      const x = clamp(c.x - w / 2, 4, FW - w - 4), y = clamp(c.y + Math.max(c.L, c.W) / 2 + 10, 8, FH - 22);
      rr(x, y, w, 17, 5); ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.fill(); ctx.strokeStyle = C.secondary; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(clamp(c.x, x + 8, x + w - 8) - 4, y); ctx.lineTo(clamp(c.x, x + 8, x + w - 8), y - 5); ctx.lineTo(clamp(c.x, x + 8, x + w - 8) + 4, y); ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.fill();
      txt(bk.text, x + 7, y + 12, '700 10px ' + F_MONO, C.primary);
      ctx.globalAlpha = 1;
    }
  }
  // P2.1 bark bubbles (content/barks.json): above the model tag, tail to the car; four styles.
  function wrapLines(str, maxW) {
    const out = []; let line = '';
    for (const wd of String(str).split(' ')) { const tt = line ? line + ' ' + wd : wd; if (ctx.measureText(tt).width > maxW && line) { out.push(line); line = wd; } else line = tt; }
    if (line) out.push(line);
    return out.slice(0, 2);
  }
  function bubblePath(style, x, y, w, h) {
    if (style === 'shout') { // jagged burst
      const cx = x + w / 2, cy = y + h / 2, n = Math.max(14, Math.round((w + h) / 9));
      ctx.beginPath();
      for (let i = 0; i < n * 2; i++) {
        const a = (i / (n * 2)) * TAU, out = i % 2 === 0, rx = w / 2 + (out ? 9 : 2), ry = h / 2 + (out ? 7 : 1.5);
        const px = cx + Math.cos(a) * rx, py = cy + Math.sin(a) * ry;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath();
    } else if (style === 'thought') { // cloud: scalloped edge
      ctx.beginPath();
      const bumps = Math.max(5, Math.round(w / 22)), r = Math.min(h / 2 + 2, 11);
      rr(x, y, w, h, h / 2);
      for (let i = 0; i <= bumps; i++) { const bx = x + 6 + (w - 12) * i / bumps; ctx.moveTo(bx + r * 0.7, y); ctx.arc(bx, y, r * 0.7, 0, TAU); ctx.moveTo(bx + r * 0.7, y + h); ctx.arc(bx, y + h, r * 0.7, 0, TAU); }
    } else rr(x, y, w, h, style === 'mutter' ? 6 : 9);
  }
  function drawBubbles(s) {
    if (!fx.bubbles.size) return;
    const dur = pv('proto.barks.seconds') || 2.2, size = Math.max(9, pv('proto.barks.textSize') || 11), now = app.realT, placed = [];
    const order = [...fx.bubbles.entries()].sort((a, b2) => b2[1].priority - a[1].priority || b2[1].t0 - a[1].t0);
    const hits = (r, own) => placed.some((q) => q.car !== own && r.x < q.x + q.w + 4 && r.x + r.w + 4 > q.x && r.y < q.y + q.h + 4 && r.y + r.h + 4 > q.y);
    ctx.font = '700 10px ' + F_MONO;
    for (const c of s.cars) { // model tags are cues: bubbles keep clear of other cars' tags
      const tw = ctx.measureText(c.model + (c.spent ? ' · SPENT' : '')).width + 10, ty = c.y - Math.max(c.L, c.W) / 2 - 12;
      placed.push({ x: c.x - tw / 2, y: ty - 10, w: tw + 18, h: 15, car: c.id });
    }
    for (const [id, bk] of order) {
      const live = s.cars.find((x) => x.id === id), c = live || fx.cars.get(id), age = now - bk.t0;
      if (!c || age > dur) { fx.bubbles.delete(id); continue; }
      const st = bk.style, fs = st === 'mutter' ? size - 1 : size, lh = fs + 3;
      ctx.font = (st === 'shout' ? '800 ' : st === 'mutter' ? '400 ' : '700 ') + fs + 'px ' + F_UI;
      const lines = wrapLines(bk.text, 176), tw = Math.max(...lines.map((l) => ctx.measureText(l).width));
      const pad = st === 'shout' ? 12 : 8, w = tw + pad * 2, h = lines.length * lh + 8;
      const tagTop = c.y - Math.max(c.L, c.W) / 2 - 22, extra = st === 'shout' ? 8 : st === 'thought' ? 14 : 8;
      const x = clamp(c.x - w / 2, 6, FW - w - 6), ax = clamp(c.x, x + 10, x + w - 10);
      const up = tagTop - extra - h, down = c.y + Math.max(c.L, c.W) / 2 + extra + 6;
      const sx = st === 'shout' ? 10 : st === 'thought' ? 4 : 0, sy = st === 'shout' ? 8 : st === 'thought' ? 6 : 0; // spikes and scallops
      const box = (yy) => ({ x: x - sx, y: yy - sy, w: w + 2 * sx, h: h + 2 * sy });
      let y = up, below = false;
      if (y < 6 || hits(box(y), id)) { y = Math.min(down, FH - h - 6); below = true; }
      for (let lift = 0; hits(box(y), id) && lift < 3; lift++) { y = up - (lift + 1) * (h + 2 * sy + 6); below = false; }
      if (y < 6 || hits(box(y), id)) { if (bk.priority < 2) continue; y = clamp(up, 6, FH - h - 6); below = false; }
      placed.push(Object.assign(box(y), { car: null }));
      ctx.save();
      ctx.globalAlpha = Math.min(1, 5 * (dur - age), 14 * age) * (st === 'mutter' ? 0.9 : 1);
      if (st === 'shout') { const k = age < 0.14 ? 1.3 - 0.3 * (age / 0.14) : 1, jx = age < 0.3 ? Math.sin(age * 90) * 1.5 * MOTION : 0; ctx.translate(x + w / 2 + jx, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2)); }
      const ink = st === 'shout' ? C.primary : C.secondary, lw = st === 'shout' ? 1.8 : 1.2, white = 'rgba(255,255,255,0.97)';
      ctx.strokeStyle = ink; ctx.fillStyle = white;
      if (st === 'mutter') ctx.setLineDash([3, 3]);
      bubblePath(st, x, y, w, h); ctx.lineWidth = lw * 2; ctx.stroke(); ctx.fill(); // stroke, then fill: inner arcs vanish, outer edge stays
      ctx.lineWidth = lw;
      if (st === 'thought') {
        for (const [f, r] of [[0.35, 3.2], [0.7, 2]]) { const ty = below ? y - (y - (c.y + Math.max(c.L, c.W) / 2)) * f : y + h + (tagTop - y - h) * f; ctx.beginPath(); ctx.arc(ax + (c.x - ax) * f, ty, r, 0, TAU); ctx.fill(); ctx.stroke(); }
      } else {
        const by = below ? y + 2 : y + h - 2, tip = below ? y - 7 : y + h + 7, tx = clamp(c.x, ax - 8, ax + 8);
        ctx.beginPath(); ctx.moveTo(ax - 5, by); ctx.lineTo(tx, tip); ctx.lineTo(ax + 5, by); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(ax - 5, below ? y : y + h); ctx.lineTo(tx, tip); ctx.lineTo(ax + 5, below ? y : y + h); ctx.stroke();
      }
      ctx.setLineDash([]);
      lines.forEach((l, i) => txt(l, x + w / 2, y + 4 + fs + i * lh - 2, ctx.font, st === 'mutter' ? C.secondary : C.primary, 'center'));
      ctx.restore();
    }
  }
  // Generated vector art (content/graphics.json): palette roles only, in the caller's local units.
  const FONT = { mono: F_MONO, ui: F_UI, brand: F_BRAND };
  function drawShapes(list, alpha, heading) { // heading: keep text upright on rotated cars
    if (!list) return;
    for (const sh of list) {
      ctx.save(); ctx.globalAlpha = (sh.alpha != null ? sh.alpha : 1) * (alpha != null ? alpha : 1);
      const fill = sh.fill && C[sh.fill], stroke = sh.stroke && C[sh.stroke], lw = sh.lineWidth || 1;
      const x = sh.x || 0, y = sh.y || 0;
      if (sh.shape === 'rect' || sh.shape === 'stripes') {
        ctx.translate(x + sh.w / 2, y + sh.h / 2); if (sh.rotate) ctx.rotate(sh.rotate * DEG);
        if (sh.shape === 'rect') {
          if (fill) { ctx.fillStyle = fill; ctx.fillRect(-sh.w / 2, -sh.h / 2, sh.w, sh.h); }
          if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.strokeRect(-sh.w / 2, -sh.h / 2, sh.w, sh.h); }
        } else {
          ctx.beginPath(); ctx.rect(-sh.w / 2, -sh.h / 2, sh.w, sh.h); ctx.clip();
          if (fill) { ctx.fillStyle = fill; ctx.fillRect(-sh.w / 2, -sh.h / 2, sh.w, sh.h); }
          ctx.rotate((sh.angle != null ? sh.angle : 45) * DEG); ctx.strokeStyle = stroke || C.primary; ctx.lineWidth = lw;
          const R = Math.hypot(sh.w, sh.h), g = Math.max(2, sh.gap || 6);
          ctx.beginPath(); for (let d = -R; d <= R; d += g) { ctx.moveTo(d, -R); ctx.lineTo(d, R); } ctx.stroke();
        }
      } else if (sh.shape === 'circle' || sh.shape === 'ring') {
        ctx.beginPath(); ctx.arc(x, y, sh.r, 0, TAU);
        if (fill && sh.shape === 'circle') { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke || sh.shape === 'ring') { ctx.strokeStyle = stroke || C.primary; ctx.lineWidth = lw; ctx.stroke(); }
      } else if (sh.shape === 'quadrant') {
        for (let q = 0; q < 4; q++) { ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, sh.r, q * Math.PI / 2, (q + 1) * Math.PI / 2); ctx.closePath(); ctx.fillStyle = C[q % 2 ? sh.b : sh.a] || (q % 2 ? C.dummy : C.joints); ctx.fill(); }
        ctx.beginPath(); ctx.arc(x, y, sh.r, 0, TAU); ctx.strokeStyle = stroke || C.joints; ctx.lineWidth = lw * 0.8; ctx.stroke();
      } else if (sh.shape === 'line' && sh.points && sh.points.length > 1) {
        ctx.beginPath(); sh.points.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.setLineDash(sh.dash || []); ctx.strokeStyle = stroke || C.primary; ctx.lineWidth = lw; ctx.stroke(); ctx.setLineDash([]);
      } else if (sh.shape === 'text' && sh.text) {
        ctx.translate(x, y); if (sh.rotate) ctx.rotate(sh.rotate * DEG);
        if (heading != null && Math.cos(heading + (sh.rotate || 0) * DEG) < -0.05) { ctx.rotate(Math.PI); ctx.translate(0, -(sh.size || 10) * 0.7); }
        txt(sh.text, 0, 0, '700 ' + (sh.size || 10) + 'px ' + (FONT[sh.font] || F_UI), fill || C.secondary, sh.align || 'left');
      }
      ctx.restore();
    }
  }
  function drawLive(s) {
    const P = s.P, b = s.body;
    drawMarks();
    // prediction zones and paths: inside the view cone unless toggled
    ctx.save();
    if (!P['proto.zonesEverywhere'] && b.alive) { wedge(b, P); ctx.clip(); }
    if (b.alive || P['proto.zonesEverywhere']) for (const c of s.cars) { drawZones(s, c); if (!P['proto.pathsEverywhere']) drawPath(s, c); }
    ctx.restore();
    if (P['proto.pathsEverywhere']) for (const c of s.cars) drawPath(s, c);
    if (b.alive) {
      wedge(b, P); ctx.fillStyle = 'rgba(16,20,23,0.025)'; ctx.fill();
      const hw = P['sensing.coneWidth'] * DEG / 2;
      ctx.strokeStyle = 'rgba(16,20,23,0.22)'; ctx.setLineDash([2, 6]); ctx.lineWidth = 1.2;
      for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + Math.cos(b.facing + sg * hw) * 1200, b.y + Math.sin(b.facing + sg * hw) * 1200); ctx.stroke(); }
      ctx.setLineDash([]);
    }
    for (const cn of s.cones) if (cn.state === 'free' || cn.state === 'flight') drawCone(cn, cn.x, cn.y, P, coneLift(cn));
    for (const c of s.cars) drawCar(s, c);
    drawBody(s);
    drawEffects(s);
    drawRingsStreaks();
    drawParts(s);
    for (const d of s.drones) drawDrone(s, d);
    if (CB) drawBubbles(s); else drawBarks(s);
    // write-off flash and stamp
    const fa = app.realT - fx.flash.t0;
    if (fa < fx.flash.dur) { ctx.fillStyle = 'rgba(255,255,255,' + (0.55 * (1 - fa / fx.flash.dur) * (RM ? 0.4 : 1)) + ')'; ctx.fillRect(-24, -24, FW + 48, FH + 48); }
    const sa = app.realT - fx.stampT0, stampDur = (CJ && CJ.writeOff ? jv(CJ.writeOff) : 1.1) + 0.2;
    if (sa < stampDur) {
      const wr = s.effects.find((e) => e.type === 'wreck'), x = wr ? clamp(wr.x, 150, FW - 150) : FW / 2, y = wr ? clamp(wr.y, 80, FH - 80) : FH / 2;
      const k = sa < 0.15 ? 1.6 - 0.6 * (sa / 0.15) : 1;
      ctx.save(); ctx.translate(x, y - 46); ctx.rotate(-0.12); ctx.scale(k, k); ctx.globalAlpha = Math.min(1, (stampDur - sa) * 3);
      rr(-108, -22, 216, 44, 6); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill(); ctx.strokeStyle = C.warning; ctx.lineWidth = 3; ctx.stroke();
      txt('WRITTEN OFF', 0, 9, '900 26px ' + F_BRAND, C.warning, 'center');
      ctx.restore(); ctx.globalAlpha = 1;
    }
    // low health: pulsing warning vignette
    if (b.alive) {
      const wear = 1 - b.health / P['damage.bodyHealth'];
      const vf = lowHealth('vignetteFrom', 0.7);
      if (wear > vf) {
        const pulse = (0.5 + 0.5 * Math.sin(app.realT * 6)) * (wear - vf) / Math.max(0.05, 1 - vf);
        const vg = ctx.createRadialGradient(FW / 2, FH / 2, FH * 0.35, FW / 2, FH / 2, FW * 0.62);
        vg.addColorStop(0, 'rgba(228,68,46,0)'); vg.addColorStop(1, 'rgba(228,68,46,' + (0.08 + 0.16 * pulse) + ')');
        ctx.fillStyle = vg; ctx.fillRect(-24, -24, FW + 48, FH + 48);
      }
    }
    if (s.t < 4 && s.phase === 'play') {
      const a = Math.min(1, (4 - s.t) / 0.6);
      ctx.globalAlpha = a; rr(FW / 2 - 230, 18, 460, 46, 10); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill();
      ctx.strokeStyle = C.aqua; ctx.lineWidth = 1.5; ctx.stroke();
      const iv = { road: s.roadIndex + 1, roads: LEVEL_LIST.length, roadName: LEVELS[s.levelId].name, quota: s.quota, difficulty: s.difficulty, health: P['damage.bodyHealth'] };
      const intro = CI && CI.copy && CI.copy.intro;
      txt(intro ? fillIn(intro[0], iv) : 'ROAD ' + (s.roadIndex + 1) + ' OF ' + LEVEL_LIST.length + ' · ' + LEVELS[s.levelId].name + ' · ' + s.quota + ' write-off' + (s.quota === 1 ? '' : 's') + ' to clear', FW / 2, 38, '700 13px ' + F_UI, C.primary, 'center');
      txt(intro && intro[1] ? fillIn(intro[1], iv) : s.difficulty + ' · ' + P['damage.bodyHealth'] + ' health. Cars dodge you: get hit head-on for the big payoff.', FW / 2, 55, '400 12px ' + F_UI, C.ink2, 'center');
      ctx.globalAlpha = 1;
    }
    if (app.toast && app.realT - app.toast.t < 1.4) {
      ctx.globalAlpha = Math.min(1, 3 * (1.4 - (app.realT - app.toast.t)));
      ctx.font = '700 12px ' + F_UI; const w = ctx.measureText(app.toast.msg).width + 28;
      rr(FW / 2 - w / 2, FH - 44, w, 28, 8); ctx.fillStyle = 'rgba(16,20,23,0.82)'; ctx.fill();
      txt(app.toast.msg, FW / 2, FH - 25, '700 12px ' + F_UI, '#FFFFFF', 'center'); ctx.globalAlpha = 1;
    }
  }

  // ---------- overlays
  function veil() { ctx.fillStyle = 'rgba(232,244,249,0.55)'; ctx.fillRect(FX, FY, FW, FH); }
  function menuList(items, sel, x, y, w, disabled) {
    items.forEach((it, i) => {
      const yy = y + i * 40, on = i === sel, off = disabled && disabled(i);
      rr(x, yy, w, 32, 8); ctx.fillStyle = on ? C.aqua : 'rgba(255,255,255,0.75)'; ctx.fill();
      ctx.strokeStyle = on ? C.aquaDeep : '#C9D5DB'; ctx.lineWidth = 1.2; ctx.stroke();
      txt(it, x + 16, yy + 21, '700 13px ' + F_UI, off ? '#9AA8B1' : on ? '#06202B' : C.primary);
    });
  }
  function difficultyHealth(i) { const k = 'proto.health.' + DIFFICULTIES[i].key; return app.tune[k] != null ? app.tune[k] : PROTO[k]; }
  function endItems(s) {
    return s.run.ending && s.run.ending.kind !== 'Licensed' ? ['Retry this road', ...END_ITEMS] : END_ITEMS;
  }
  function drawTitle() {
    const pv = previews[app.level];
    drawField(pv, true);
    veil();
    const x = FX + 60, y = FY + 40, w = FW - 120;
    panel(x, y, w, FH - 80);
    const TT = CTM && CTM.title, quotaOf = (id) => (app.tune['proto.quota.' + id] != null ? app.tune['proto.quota.' + id] : PROTO['proto.quota.' + id]);
    const tv = { roads: LEVEL_LIST.length, q1: quotaOf(LEVEL_LIST[0]), q2: quotaOf(LEVEL_LIST[1]), q3: quotaOf(LEVEL_LIST[2]) };
    const fit = (str, X, Y, maxW, size, weight, col) => { let sz = size; ctx.font = weight + ' ' + sz + 'px ' + F_UI; while (ctx.measureText(str).width > maxW && sz > 10) { sz -= 0.5; ctx.font = weight + ' ' + sz + 'px ' + F_UI; } txt(str, X, Y, ctx.font, col); };
    if (TT && TT.eyebrow) label(TT.eyebrow.toUpperCase(), x + 36, y + 22, C.aquaDeep);
    txt('DUMMIES', x + 32, y + 78, '900 64px ' + F_BRAND, C.primary);
    txt(BUILD + ' · Generated content', x + 36, y + 106, '700 14px ' + F_UI, C.aquaDeep);
    fit(TT && TT.lines ? fillIn(TT.lines[0], tv) : 'You are a FARSIGHT crash-test subject. Cars avoid you. Fool them into hitting you.', x + 36, y + 136, w - 72, 13, '400', C.ink2);
    fit(TT && TT.lines ? fillIn(TT.lines[1], tv) : 'Three roads: 1, then 2, then 3 write-offs. Every lost body before the last buys one upgrade.', x + 36, y + 156, w - 72, 13, '400', C.ink2);
    const dname = DIFFICULTIES[app.difficulty].name, dtxt = '◀  ' + dname.toUpperCase() + ' · ' + difficultyHealth(app.difficulty) + ' health  ▶';
    ctx.font = '700 12px ' + F_MONO; const dw = ctx.measureText(dtxt).width + 24;
    rr(x + w - 36 - dw, y + 180, dw, 24, 12); ctx.fillStyle = app.difficulty === 1 ? 'rgba(255,255,255,0.8)' : 'rgba(245,197,66,0.3)'; ctx.fill();
    ctx.strokeStyle = C.aquaDeep; ctx.lineWidth = 1.2; ctx.stroke();
    txt(dtxt, x + w - 36 - dw / 2, y + 196, '700 12px ' + F_MONO, C.primary, 'center');
    const dnote = TT && TT.difficulty && TT.difficulty[dname] ? fillIn(TT.difficulty[dname], { health: difficultyHealth(app.difficulty) }) : ['Easy: you break quickly', 'Default', 'Hard: you take a beating'][app.difficulty];
    txt(dnote, x + w - 36 - dw - 10, y + 196, '400 11px ' + F_UI, C.ink2, 'right');
    label('CHOOSE A ROAD', x + 36, y + 196);
    LEVEL_LIST.forEach((id, i) => {
      const yy = y + 208 + i * 58, on = i === app.level;
      rr(x + 32, yy, w - 64, 48, 10); ctx.fillStyle = on ? C.aqua : 'rgba(255,255,255,0.7)'; ctx.fill();
      ctx.strokeStyle = on ? C.aquaDeep : '#C9D5DB'; ctx.lineWidth = 1.2; ctx.stroke();
      txt(LEVELS[id].name, x + 52, yy + 21, '700 15px ' + F_UI, on ? '#06202B' : C.primary);
      txt(LEVELS[id].blurb, x + 52, yy + 39, '400 12px ' + F_UI, on ? '#0B3443' : C.ink2);
      const q = (app.tune['proto.quota.' + id] != null ? app.tune['proto.quota.' + id] : PROTO['proto.quota.' + id]);
      txt(q + ' write-off' + (q === 1 ? '' : 's'), x + w - 52, yy + 21, '700 12px ' + F_MONO, on ? '#06202B' : C.secondary, 'right');
    });
    const ky = y + 400;
    label('CONTROLS', x + 36, ky);
    const rows = [['Move / face', 'WASD · arrows · stick'], ['A  Lunge along facing', 'Space · J · pad A'], ['B  Cone (after Carry)', 'K · Shift · pad B'], ['Pause', 'Esc · Start']];
    rows.forEach((r, i) => { const cx = x + 36 + (i % 2) * 330, cy = ky + 22 + Math.floor(i / 2) * 20; txt(r[0], cx, cy, '700 12px ' + F_UI, C.primary); txt(r[1], cx + 150, cy, '400 12px ' + F_MONO, C.ink2); });
    txt(TT && TT.start ? TT.start : 'Press A or Space to start', x + w / 2, y + FH - 104, '700 14px ' + F_UI, C.aquaDeep, 'center');
  }
  function drawReport(s) {
    veil();
    const rp = s.report, x = FX + 110, y = FY + 70, w = FW - 220, h = 420;
    panel(x, y, w, h);
    label(rp.roadCleared ? 'ROAD ' + (s.roadIndex + 1) + ' CLEARED' : copy('report.eyebrow', 'TEST REPORT').toUpperCase(), x + 28, y + 30);
    const chs = String(rp.chassis).padStart(2, '0');
    txt(rp.roadCleared ? LEVELS[s.levelId].name + ' cleared' : copy('report.title', 'Chassis {chassis} written off', { chassis: chs }), x + 28, y + 64, '800 26px ' + F_BRAND, C.primary);
    const nq = rp.nextRoad ? s.P['proto.quota.' + rp.nextRoad] : 0;
    txt(rp.roadCleared ? copy('report.cleared', 'Next: {nextRoad} — {nextQuota} write-off(s) to clear. Points this body: {points}', { roadName: LEVELS[s.levelId].name, nextRoad: LEVELS[rp.nextRoad].name, nextQuota: nq, points: num(rp.points) })
      : copy('report.line', 'Write-off {n} of {quota} on this road. Points this body: {points}', { n: s.run.writeOffs, quota: s.quota, points: num(rp.points) }), x + 28, y + 88, '400 13px ' + F_UI, C.ink2);
    label('IMPACTS', x + 28, y + 122);
    const cols = ['Car', 'Angle', 'Strike u/s', 'Dummy Δv', 'Assessed', 'Lost', 'Car state'];
    const cx = [0, 86, 150, 222, 294, 366, 420];
    cols.forEach((c, i) => txt(c, x + 28 + cx[i], y + 142, '700 10px ' + F_UI, C.secondary));
    rp.hits.slice(-6).forEach((hh, j) => {
      const yy = y + 164 + j * 22;
      [hh.model, hh.angle != null ? Math.round(hh.angle) + '°' : '—', num(hh.strike != null ? hh.strike : hh.closing), hh.dv != null ? num(hh.dv) : '—', num(hh.assessed), num(hh.lost), hh.bait ? hh.carState + ' ✓ bait' : hh.carState]
        .forEach((v, i) => txt(String(v), x + 28 + cx[i], yy, (i >= 1 && i <= 5 ? '700 12px ' : '400 12px ') + (i >= 1 && i <= 5 ? F_MONO : F_UI), C.primary));
    });
    rr(x + 28, y + h - 92, w - 56, 44, 10); ctx.fillStyle = 'rgba(245,197,66,0.25)'; ctx.fill(); ctx.strokeStyle = C.dummy; ctx.stroke();
    txt(copy('report.credit', 'Body credit +1   ·   balance {credits}', { credits: s.run.credits }), x + 44, y + h - 64, '700 14px ' + F_UI, C.primary);
    txt(copy('report.continue', 'A  continue to modifications'), x + w - 28, y + h - 18, '700 12px ' + F_UI, C.aquaDeep, 'right');
  }
  function drawShop(s) {
    veil();
    const x = FX + 40, y = FY + 30, w = FW - 80, h = FH - 60;
    panel(x, y, w, h);
    label(copy('shop.eyebrow', 'FARSIGHT APPROVED MODIFICATIONS').toUpperCase(), x + 28, y + 30);
    txt(copy('shop.title', 'Install on the next chassis'), x + 28, y + 60, '800 22px ' + F_BRAND, C.primary);
    rr(x + w - 160, y + 20, 132, 44, 10); ctx.fillStyle = C.dummy; ctx.fill(); ctx.strokeStyle = C.joints; ctx.lineWidth = 1; ctx.stroke();
    txt(s.run.credits + ' credit' + (s.run.credits === 1 ? '' : 's'), x + w - 94, y + 48, '700 15px ' + F_MONO, C.primary, 'center');
    const colW = (w - 84) / 2;
    ['Torso — facing and aim', 'Arms — objects and contact'].forEach((t, ci) => {
      const cx = x + 28 + ci * (colW + 28);
      label(t.toUpperCase(), cx, y + 96);
      SHOP_GRID[ci].forEach((n, ri) => {
        const yy = y + 108 + ri * 104, node = NODES[n], own = s.has(n), chk = s.canBuy(n), on = app.shopCol === ci && app.shopRow === ri;
        rr(cx, yy, colW, 88, 12);
        ctx.fillStyle = own ? 'rgba(79,195,232,0.28)' : on ? '#FFFFFF' : 'rgba(255,255,255,0.6)'; ctx.fill();
        ctx.strokeStyle = on ? C.aquaDeep : '#C9D5DB'; ctx.lineWidth = on ? 2.5 : 1.2; ctx.stroke();
        txt(node.name, cx + 16, yy + 28, '800 18px ' + F_BRAND, C.primary);
        txt(own ? 'OWNED' : chk.ok ? 'BUY · ' + s.P[node.price] : chk.why.toUpperCase(), cx + colW - 16, yy + 27, '700 11px ' + F_UI, own ? C.aquaDeep : chk.ok ? C.primary : '#8C9AA4', 'right');
        wrapText(copy('shop.nodes.' + n, node.desc), cx + 16, yy + 50, colW - 32, 16, '400 12px ' + F_UI, C.ink2);
        if (ri === 0) { ctx.strokeStyle = '#9FB0BA'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + 30, yy + 90); ctx.lineTo(cx + 30, yy + 102); ctx.stroke(); }
      });
    });
    // consequence line
    const yy = y + 330;
    if (app.shopRow < 2) {
      const n = SHOP_GRID[app.shopCol][app.shopRow], chk = s.canBuy(n);
      let msg = '';
      if (s.has(n)) msg = NODES[n].name + ' is installed.';
      else if (!chk.ok) msg = NODES[n].name + ': ' + chk.why + '.';
      else {
        const left = s.run.credits - chk.price;
        const postponed = Object.keys(NODES).filter((k) => k !== n && !s.has(k) && s.canBuy(k).ok && s.P[NODES[k].price] > left);
        msg = 'Buying ' + NODES[n].name + ' leaves ' + left + ' credit' + (left === 1 ? '' : 's') + '.' + (postponed.length ? ' Postpones ' + postponed.map((k) => NODES[k].name).join(' and ') + ' until another body.' : '');
      }
      wrapText(msg, x + 28, yy + 18, w - 56, 18, '700 13px ' + F_UI, C.primary);
    }
    const on = app.shopRow === 2;
    rr(x + 28, y + h - 76, w - 56, 44, 10); ctx.fillStyle = on ? C.aqua : 'rgba(255,255,255,0.7)'; ctx.fill();
    ctx.strokeStyle = on ? C.aquaDeep : '#C9D5DB'; ctx.lineWidth = 1.2; ctx.stroke();
    txt(s.run.credits ? copy('shop.bank', 'Bank {credits} credit(s) and deploy the next chassis', { credits: s.run.credits }) : copy('shop.deploy', 'Deploy the next chassis'), x + w / 2, y + h - 48, '700 14px ' + F_UI, on ? '#06202B' : C.primary, 'center');
    txt('◀▶▲▼ select   ·   A buy   ·   B deploy', x + w / 2, y + h - 12, '400 11px ' + F_UI, C.secondary, 'center');
  }
  function wrapText(str, x, y, w, lh, font, color) {
    ctx.font = font; const words = str.split(' '); let line = '', yy = y;
    for (const wd of words) { const t = line ? line + ' ' + wd : wd; if (ctx.measureText(t).width > w && line) { txt(line, x, yy, font, color); line = wd; yy += lh; } else line = t; }
    if (line) txt(line, x, yy, font, color);
  }
  // Cue key glyphs: the same marks the field draws (state pip, caution, brake, spent, honk, blind, view).
  function cueGlyph(cue, x, y) {
    ctx.save(); ctx.translate(x, y); ctx.lineWidth = 2.5;
    const car = (spent) => { rr(-16, -7, 32, 14, 4); ctx.fillStyle = C.fleet; ctx.fill(); if (spent) { ctx.strokeStyle = C.primary; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-11, 5); ctx.lineTo(11, -5); ctx.stroke(); } };
    if (cue === 'intention') { ctx.strokeStyle = C.secondary; ctx.beginPath(); ctx.moveTo(-3, -6); ctx.lineTo(4, 0); ctx.lineTo(-3, 6); ctx.stroke(); }
    else if (cue === 'committed' || cue === 'expiring') {
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill(); ctx.strokeStyle = C.primary; ctx.beginPath();
      if (cue === 'committed') ctx.arc(0, 0, 7, 0, TAU); else ctx.arc(0, 0, 7, -Math.PI / 2, -Math.PI / 2 + TAU * (0.35 + 0.3 * Math.abs(Math.sin(app.realT * 1.5))));
      ctx.stroke();
    } else if (cue === 'interrupted') {
      ctx.strokeStyle = C.warning; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.warning; ctx.fillRect(-1.5, -5, 3, 6); ctx.fillRect(-1.5, 3, 3, 2.5);
    } else if (cue === 'caution') {
      ctx.strokeStyle = C.secondary; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(6.5, 5); ctx.lineTo(-6.5, 5); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = C.secondary; ctx.fillRect(-1, -2.5, 2, 4); ctx.fillRect(-1, 2.5, 2, 1.5);
    } else if (cue === 'braking') { car(false); ctx.fillStyle = C.warning; ctx.fillRect(-16, -5, 3, 4); ctx.fillRect(-16, 1, 3, 4); }
    else if (cue === 'spent') car(true);
    else if (cue === 'honk') { rr(-20, -8, 40, 16, 8); ctx.fillStyle = '#FFF1C9'; ctx.fill(); ctx.strokeStyle = C.primary; ctx.lineWidth = 1.2; ctx.stroke(); txt('HONK', 0, 4, '700 9px ' + F_MONO, C.primary, 'center'); }
    else if (cue === 'blind') { ctx.beginPath(); ctx.moveTo(-14, -4); ctx.lineTo(14, -9); ctx.lineTo(14, 9); ctx.lineTo(-14, 4); ctx.closePath(); ctx.fillStyle = 'rgba(79,195,232,0.14)'; ctx.fill(); ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(30,143,184,0.85)'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]); }
    else if (cue === 'view') { ctx.strokeStyle = 'rgba(16,20,23,0.4)'; ctx.setLineDash([2, 4]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(14, -10); ctx.moveTo(-12, 0); ctx.lineTo(14, 10); ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
  }
  function drawCueKey(x, y, w) {
    const keys = CI.cueKey;
    panel(x, y, w, 44 + keys.length * 50);
    label(copy('cueKeyTitle', 'CUE KEY'), x + 20, y + 28);
    keys.forEach((k, i) => {
      const yy = y + 54 + i * 50;
      cueGlyph(k.cue, x + 40, yy + 4);
      txt(k.label || k.cue, x + 72, yy, '700 12px ' + F_UI, C.primary);
      wrapText(k.meaning || '', x + 72, yy + 16, w - 92, 14, '400 11px ' + F_UI, C.ink2);
    });
  }
  function drawPause(s) {
    veil();
    const ck = CI && CI.cueKey && CI.cueKey.length;
    if (ck) drawCueKey(FX + 420, FY + 12, 360);
    const x = ck ? FX + 40 : FX + 220, y = FY + 120, w = 360;
    panel(x, y, w, 300);
    label('TEST PAUSED', x + 24, y + 30);
    const items = PAUSE_ITEMS.slice();
    if (app.confirmRefuse) items[2] = 'Confirm: refuse and end the test';
    menuList(items, app.pauseSel, x + 24, y + 48, w - 48, (i) => i === 2 && s.run.writeOffs < 1);
    txt(s.run.writeOffs < 1 ? 'Refusal opens after one completed body.' : 'Refusal is a deliberate ending.', x + 24, y + 282, '400 11px ' + F_UI, C.secondary);
  }
  const MILE = {
    firstHit: 'First hit', firstBaitHit: 'First bait hit', firstConeAssistHit: 'First cone-assisted bait hit',
    firstWriteOff: 'First write-off', firstPurchase: 'First purchase', 'use:hips': 'Used Hips', 'use:spine': 'Used Spine',
    'use:carry': 'Used Carry', 'use:throw': 'Used Throw', ending: 'Ending',
  };
  function drawEnding(s) {
    veil();
    const e = s.run.ending, x = FX + 40, y = FY + 30, w = FW - 80, h = FH - 60;
    panel(x, y, w, h, { tint: e.kind === 'Licensed' ? 'rgba(232,248,238,0.95)' : 'rgba(236,247,252,0.95)' });
    label('TEST CONTRACT RESULT', x + 28, y + 30);
    const title = { Licensed: 'LICENSED', 'Failed test': 'FAILED TEST', 'Non-compliant': 'NON-COMPLIANT' }[e.kind] || e.kind;
    txt(title, x + 28, y + 76, '900 40px ' + F_BRAND, e.kind === 'Licensed' ? C.primary : e.kind === 'Failed test' ? C.warning : C.secondary);
    const sub = copy('endings.' + e.kind, { Licensed: 'Contract complete. Your current testing contract is released.', 'Failed test': 'Useful traffic ran out before the contract was complete.', 'Non-compliant': 'You refused further testing. FARSIGHT has recorded your position.' }[e.kind] || '');
    txt(sub, x + 30, y + 100, '400 13px ' + F_UI, C.ink2);
    const imp = s.events.filter((v) => v.type === 'impact');
    const stats = [['Active time', fmtT(e.t)], ['Write-offs', String(e.writeOffs)], ['Roads cleared', (e.kind === 'Licensed' ? LEVEL_LIST.length : e.road - 1) + ' / ' + LEVEL_LIST.length], ['Points', num(e.points)],
      ['Impacts', String(imp.length)], ['Bait hits', String(imp.filter((v) => v.bait).length)], ['Best impact', imp.length ? num(Math.max(...imp.map((v) => v.assessed))) : '—'],
      ['Build order', e.purchases.length ? e.purchases.map((n) => NODES[n].name).join(' → ') : 'none'], ['Credits banked', String(s.run.credits)]];
    stats.forEach((st, i) => {
      const cx = x + 28 + (i % 2) * 210, cy = y + 134 + Math.floor(i / 2) * 44;
      txt(st[0], cx, cy, '700 10px ' + F_UI, C.secondary); txt(st[1], cx, cy + 20, '700 15px ' + F_MONO, C.primary);
    });
    const mx = x + 470;
    label('TIMELINE', mx, y + 134);
    Object.entries(s.milestones).sort((a, b) => a[1].t - b[1].t).slice(0, 12).forEach(([k, v], i) => {
      const yy = y + 156 + i * 21;
      txt(fmtT(v.t), mx, yy, '700 12px ' + F_MONO, C.primary);
      txt((MILE[k] || k) + (v.node ? ' · ' + NODES[v.node].name : '') + (v.kind ? ' · ' + v.kind : ''), mx + 50, yy, '400 12px ' + F_UI, C.ink2);
    });
    const items = endItems(s);
    menuList(items, app.endSel, x + 28, y + h - 30 - items.length * 40, 420);
  }

  function render() {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawFrame();
    if (app.screen === 'title') { drawTitle(); return; }
    const s = app.sim;
    drawField(s);
    drawHUD(s);
    if (app.paused) drawPause(s);
    else if (s.phase === 'report') drawReport(s);
    else if (s.phase === 'shop') drawShop(s);
    else if (s.phase === 'ending') drawEnding(s);
  }

  // ---------- tuning panel
  const TUNE = [
    ['movement.walkSpeed', 30, 200, 1], ['movement.runSpeed', 60, 320, 1], ['movement.rampSeconds', 0, 3, 0.05],
    ['movement.turnRate', 45, 720, 5], ['upgrades.hipsTurnRate', 90, 1080, 5], ['movement.lungeDistance', 60, 320, 2],
    ['movement.lungeDuration', 0.1, 0.8, 0.01], ['movement.lungeRecovery', 0, 1, 0.01], ['movement.wearFloor', 0.2, 1, 0.01],
    ['battery.capacity', 1, 6, 1], ['battery.secondsPerCharge', 0.2, 3, 0.05],
    ['proto.quota.straight', 1, 5, 1], ['proto.quota.barrier', 1, 5, 1], ['proto.quota.corner', 1, 5, 1],
    ['proto.traffic.straight.interval', 1, 12, 0.5], ['proto.traffic.barrier.interval', 1, 12, 0.5], ['proto.traffic.corner.interval', 1, 12, 0.5], ['proto.traffic.jitter', 0, 0.9, 0.05],
    ['proto.health.fragile', 50, 2400, 25], ['proto.health.standard', 50, 2400, 25], ['proto.health.reinforced', 50, 2400, 25],
    ['damage.referenceSpeed', 40, 400, 2], ['run.admissionInterval', 2, 20, 0.5], ['traffic.commitHorizon', 0.3, 2, 0.05],
    ['perception.forwardLength', 100, 600, 10], ['perception.reactionDelay', 0, 1.5, 0.01], ['proto.standoffDistance', 20, 400, 5],
    ['proto.learn.standoffStep', 0, 100, 5], ['proto.learn.standoffMax', 20, 400, 5], ['traffic.deadlockTimeout', 0.5, 10, 0.5],
    ['proto.sensorStraight', 0, 1, 1], ['proto.unstick.reverseSpeed', 5, 80, 1], ['proto.unstick.reverseGap', 40, 300, 5], ['proto.unstick.reverseSeconds', 1, 10, 0.5],
    ['proto.driver.coveredReaction', 0, 1.5, 0.01], ['proto.driver.cautionZone', 0, 400, 5], ['proto.driver.cautionSpeed', 20, 200, 2],
    ['proto.driver.passClearance', 0, 80, 2], ['proto.driver.passSpeed', 10, 160, 2], ['proto.driver.patienceSeconds', 0, 30, 0.5],
    ['traffic.comfortBraking', 10, 200, 1], ['traffic.hardBraking', 20, 300, 1], ['traffic.acceleration', 10, 200, 1], ['traffic.timeGap', 0.5, 4, 0.1], ['proto.swerveLength', 40, 300, 5], ['proto.returnSignalSeconds', 0, 2, 0.05],
    ['vehicles.sedan.cruiseSpeed', 60, 260, 2], ['vehicles.van.cruiseSpeed', 60, 260, 2], ['upgrades.throwDistance', 40, 300, 5],
    ['upgrades.spineLimit', 10, 90, 1],
    ['proto.damageExponent', 1, 3, 0.1], ['proto.dummyStrikeSpeed', 0, 400, 5], ['proto.dummyMass', 0.01, 1, 0.005],
    ['proto.restitution', 0, 1, 0.05], ['proto.contactFriction', 0, 1, 0.05], ['proto.recoilScale', 0, 2, 0.05], ['proto.recoilSeconds', 0, 1, 0.05],
  ];
  for (const id of Object.keys(CPARAM)) { const v = CPARAM[id]; TUNE.push([id, 0, Math.max(1, Math.ceil(v * 3)), v >= 10 ? 1 : 0.01]); } // generated presentation IDs
  const tuneEl = document.getElementById('tune'), grid = document.getElementById('tune-grid');
  function current(id) {
    if (app.tune[id] != null) return app.tune[id];
    if (app.sim && app.sim.P[id] != null) return app.sim.P[id];
    return CPARAM[id] != null ? CPARAM[id] : REG[id] != null ? REG[id] : PROTO[id];
  }
  function setParam(id, v) {
    app.tune[id] = v;
    if (app.sim) { app.sim.P[id] = v; app.tuned = true; if (id === 'proto.health.' + DIFFICULTIES[Math.round(app.sim.P['proto.difficulty'])].key) app.sim.P['damage.bodyHealth'] = v; }
    syncTune();
  }
  function buildTune() {
    grid.innerHTML = '';
    for (const [id, mn, mx, st] of TUNE) {
      const row = document.createElement('label'); row.className = 'trow';
      const inp = document.createElement('input'); inp.type = 'range'; inp.min = mn; inp.max = mx; inp.step = st; inp.id = 't-' + id.replace(/\./g, '-');
      const out = document.createElement('output'); const nm = document.createElement('span'); nm.className = 'pid'; nm.textContent = id;
      inp.addEventListener('input', () => setParam(id, parseFloat(inp.value)));
      row.append(nm, out, inp); grid.append(row);
    }
    for (const [id, text] of [['proto.damageModel', 'Newtonian impulse damage and recoil (off = V29 formula)'], ['proto.pathsEverywhere', 'Show committed car paths outside the view cone'], ['proto.zonesEverywhere', 'Show car scanners outside the view cone'], ['proto.learningEnabled', 'Cars learn from player hits']]) {
      const row = document.createElement('label'); row.className = 'tcheck';
      const inp = document.createElement('input'); inp.type = 'checkbox'; inp.id = 't-' + id.replace(/\./g, '-');
      inp.addEventListener('change', () => setParam(id, inp.checked ? 1 : 0));
      const sp = document.createElement('span'); sp.innerHTML = text + ' <code>' + id + '</code>';
      row.append(inp, sp); grid.append(row);
    }
    syncTune();
  }
  function syncTune() {
    for (const [id] of TUNE) {
      const inp = document.getElementById('t-' + id.replace(/\./g, '-')); if (!inp) continue;
      const v = current(id); if (document.activeElement !== inp) inp.value = v;
      inp.nextSibling; inp.parentNode.querySelector('output').textContent = (+v).toFixed(v % 1 ? 2 : 0) + (REG[id] != null && v !== REG[id] ? '  (registry ' + REG[id] + ')' : '');
    }
    for (const id of ['proto.damageModel', 'proto.pathsEverywhere', 'proto.zonesEverywhere', 'proto.learningEnabled']) { const inp = document.getElementById('t-' + id.replace(/\./g, '-')); if (inp) inp.checked = !!current(id); }
  }
  function toggleTune() { tuneEl.open = !tuneEl.open; if (tuneEl.open) { syncTune(); tuneEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } }
  document.getElementById('btn-tune').addEventListener('click', toggleTune);
  document.getElementById('t-credit').addEventListener('click', () => { if (app.sim) { app.sim.run.credits++; app.tuned = true; app.sim.emit('debug-credit', {}); toast('Debug credit granted'); } });
  document.getElementById('t-reset').addEventListener('click', () => { app.tune = {}; if (app.sim) { for (const k of Object.keys(REG)) app.sim.P[k] = REG[k]; for (const k of Object.keys(PROTO)) app.sim.P[k] = PROTO[k]; } syncTune(); });
  const sndBtn = document.getElementById('btn-sound');
  sndBtn.addEventListener('click', () => { app.sound = !app.sound; sndBtn.textContent = app.sound ? 'Sound on' : 'Sound off'; sndBtn.setAttribute('aria-pressed', String(app.sound)); Snd.init(); });
  buildTune();

  // ---------- trace modal
  const traceEl = document.getElementById('trace'), traceTxt = document.getElementById('trace-text');
  function showTrace() {
    if (!app.sim) return;
    traceTxt.value = JSON.stringify(Object.assign({}, app.sim.trace(), { presentation: app.present || [] }), null, 1);
    traceEl.hidden = false; traceTxt.focus(); traceTxt.select();
  }
  document.getElementById('trace-close').addEventListener('click', () => { traceEl.hidden = true; cv.focus(); });
  document.getElementById('trace-copy').addEventListener('click', () => {
    const btn = document.getElementById('trace-copy');
    const done = (ok) => { btn.textContent = ok ? 'Copied' : 'Select and copy manually'; setTimeout(() => { btn.textContent = 'Copy trace'; }, 1600); };
    try { navigator.clipboard.writeText(traceTxt.value).then(() => done(true), () => { traceTxt.select(); done(false); }); }
    catch (e) { traceTxt.select(); done(false); }
  });

  // ---------- loop
  let last = performance.now(), acc = 0;
  function frame(now) {
    const dt = clamp((now - last) / 1000, 0, 0.1); last = now; app.realT += dt; // rAF can stamp the first frame before load time
    pollPad();
    handleMenus();
    const s = app.sim;
    if (app.screen === 'game' && s && !app.paused && traceEl.hidden) {
      acc += dt;
      while (acc >= 1 / 60) { s.step(s.phase === 'play' ? buildCmd() : {}); acc -= 1 / 60; }
      if (s.phase === 'next') { const rs = (app.roads || []).concat([s.trace()]); startLevel(app.level + 1, s.carryOut()); app.roads = rs; }
    } else acc = 0;
    processEvents();
    render();
    requestAnimationFrame(frame);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {});
  requestAnimationFrame(frame);
  window.__dummies = app;
})();
