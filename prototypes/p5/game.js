/* DUMMIES P3 — renderer, input, menus, audio, tuning. Reads window.DUMMIES (sim.js), window.PIX (pixel.js) and window.DUMMIES_CONTENT (content.js).
   Screen: 640 × 360 art pixels, integer-scaled. Field: 400 × 300 art pixels at (120, 30). HUD and screens: 1280 × 720 reference units. */
(function () {
  'use strict';
  const { Sim, NODES, LEVELS, LEVEL_LIST, DIFFICULTIES, REG, PROTO, OVERRIDES, DEG, pathAt, INFO, DISTRICTS, zHeight } = window.DUMMIES;
  const PIX = window.PIX;

  // Palette roles (Design §4.2 / D10.2, Trial)
  const C = {
    floor: '#EDF1F3', grid: '#D4DDE2', structure: '#B8C4CB', fleet: '#7E8C96', dummy: '#F5C542',
    joints: '#1A1D1F', primary: '#101417', secondary: '#4A5A66', warning: '#E4442E', aqua: '#4FC3E8',
    road: '#DCE3E7', shoulder: '#E5EAED', glass: 'rgba(255,255,255,0.86)', aquaDeep: '#1E8FB8', ink2: '#3C4A54',
  };
  const F_UI = '"B612", "Segoe UI", system-ui, sans-serif';
  const F_MONO = '"B612 Mono", ui-monospace, Menlo, monospace';
  const F_BRAND = '"Nunito", "Segoe UI", system-ui, sans-serif';
  // Reference canvas 1280 × 720 for the frame and HUD; RA reference units per art px. Edit 42 (D27): the 640 × 360 screen
  // holds a 400 × 320 field (25 × 20 tiles, 5:4) at (120, 20). Top and bottom strips are 20 art px.
  const VW = 1280, VH = 720, RA = VW / 640;
  const FX = 120 * RA, FY = 20 * RA, FW = PIX.AW * RA, FH = PIX.AH * RA;
  const TOPY = 31; // top-bar baseline: inside the strip above the field

  const cv = document.getElementById('game');
  const ctx = cv.getContext('2d');
  // Integer scaling: the canvas is always a whole multiple of the 640 × 360 art screen (ui.artScale = 2 reference units per art pixel).
  const SW = 640, SH = 360;
  let scale = 1, kpx = 2;
  function resize() {
    const st = cv.parentElement, dpr = window.devicePixelRatio || 1;
    kpx = Math.max(1, Math.floor(Math.min(st.clientWidth * dpr / SW, st.clientHeight * dpr / SH)));
    if (cv.width !== SW * kpx) { cv.width = SW * kpx; cv.height = SH * kpx; }
    cv.style.width = cv.width / dpr + 'px'; cv.style.height = cv.height / dpr + 'px';
    scale = kpx * SW / VW;
  }
  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(cv.parentElement);
  resize();

  // ---------- app state
  const app = {
    screen: 'title', level: 0, difficulty: 1, sim: null, paused: false, pauseSel: 0, confirmRefuse: false,
    shopCol: 0, shopRow: 0, endSel: 0, tune: {}, lastEv: 0, toast: null, realT: 0, sound: true, tuned: false,
  };
  const FIELD = {};
  const previews = LEVEL_LIST.map((id) => new Sim(id, Object.assign({ 'run.appearances.road': 0 }, FIELD)));
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  // ---------- generated content (content/pipeline.py -> content.js). Missing parts fall back to the P1.9 literals.
  const CT = window.DUMMIES_CONTENT || {};
  const CJ = CT.juice || null, CI = CT.interface || null, CG = CT.graphics || null;
  const CB = CT.barks || null, CH = CT.hits || null, CTM = CT.terminal || null; // P2.1: humour, hit juice, FARSIGHT terminal skin
  const CP = CT.places || null, CD = CT.drops || null; // Submission 4 (P3.3): district and level copy; drop juice
  // Fleet database (content/db/fleet.json, decision 117): model names, tags and the bark bank, separate from other text.
  const FLEET = window.FLEET_DB || null;
  const FMODEL = new Map(); // sim model id → database model
  if (FLEET) for (const m of FLEET.models) for (const sid of m.simIds) FMODEL.set(sid, m);
  const CPARAM = {};
  for (const part of [CJ, CI, CG, CB, CH, CTM, CP, CD]) if (part && part.params) for (const p of part.params) CPARAM[p.id] = p.value;
  const BUILD = 'P5.1';
  function pv(id) {
    if (id == null) return null;
    if (app.tune[id] != null) return app.tune[id];
    if (CPARAM[id] != null) return CPARAM[id];
    if (app.sim && app.sim.P[id] != null) return app.sim.P[id];
    return OVERRIDES[id] != null ? OVERRIDES[id] : REG[id] != null ? REG[id] : PROTO[id] != null ? PROTO[id] : null;
  }
  function jv(v, k) { // a parameter ID, or [minId, maxId] interpolated by k
    if (Array.isArray(v)) { const a = pv(v[0]), b = pv(v[1]); return a == null || b == null ? 0 : a + (b - a) * (k || 0); }
    const x = pv(v); return x == null ? 0 : x;
  }
  function fillIn(str, vars) { return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? vars[k] : m)); }
  function place(path) { const v = path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), CP); return typeof v === 'string' ? v : null; } // generated places.json
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
    lungeWatch: null, lastImpact: null, pendingNodes: [], upgradeWatch: null, barkN: 0, juiceT: new Map(),
    partWatch: null, partsSeen: new Set(), learnWatch: new Map(), pendingLearned: null };
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
    // Edit 41: each run plays one of the three baked layouts per district, at random (tuning: proto.layout fixes one)
    const nL = ((window.DISTRICT_DB || {}).districts || {})[LEVEL_LIST[i]], nLay = nL && nL.length ? nL.length : 1;
    const layout = app.tune['proto.layout'] != null ? app.tune['proto.layout'] : 1 + Math.floor(Math.random() * nLay);
    app.sim = new Sim(LEVEL_LIST[i], Object.assign({ 'proto.difficulty': app.difficulty, 'proto.layout': layout }, app.tune, FIELD), carry);
    app.tuned = Object.keys(app.tune).length > 0;
    app.screen = 'game'; app.paused = false; app.lastEv = 0; app.shopCol = 0; app.shopRow = 0; app.endSel = 0;
    app.confirmRefuse = false; clearEdges();
    fx.marks = []; fx.barks.clear(); fx.barked.clear(); fx.partWatch = null; fx.partsSeen.clear(); fx.learnWatch.clear(); fx.pendingLearned = null;
    fx.rings = []; fx.streaks = []; fx.bubbles.clear(); fx.carBarkT.clear(); fx.cars.clear(); fx.nm.clear(); fx.nmDone.clear();
    fx.lungeWatch = null; fx.lastImpact = null; fx.upgradeWatch = null; if (!carry) fx.pendingNodes = [];
    app.present = [];
    // D24: build every screen of the district now (a short pause at the start, none at the edges)
    const D = app.sim.district;
    if (D) {
      const all = [];
      for (let y = 0; y < D.rows; y++) for (let x = 0; x < D.cols; x++) all.push([x, y, window.DUMMIES.cellLevel(D, [x, y], app.sim.P)]);
      for (const [x, y, lv] of all) { lv.blockedEdges = window.DUMMIES.edgeSpans(D, [x, y], app.sim.P); levelArt({ level: lv, P: app.sim.P }); }
    }
    fx.seenScreens = new Set(D ? [app.sim.screenName()] : []);
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
  const THEME_NAME = { start: 'Start screen', flyover: 'Pillars', barrier: 'Barrier run', plain: 'Open street',
    monument: 'Lantern monument', fountain: 'Fountain square', roundabout: 'Roundabout', tower: 'FARSIGHT Tower', plate: 'Test plates' };
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
  // ---------- P2.1 event layer: car identity, derived cases (near miss, miss, upgrade seen), hit juice, barks.
  const SENIORITY = ['New', 'Practised', 'Experienced', 'Senior'];
  function seniorityOf(c) { return c.applied >= 5 ? 3 : c.applied >= 3 ? 2 : c.applied >= 1 ? 1 : 0; } // the notches drawn beside the tag
  function trackCars(s) {
    for (const c of s.cars) fx.cars.set(c.id, { id: c.id, model: c.model, cls: c.cls, slot: c.slot || 0, seniority: seniorityOf(c), x: c.x, y: c.y, h: c.h, L: c.L, W: c.W });
  }
  function upm() { return (app.sim && app.sim.P['proto.scale.unitsPerMetre']) || 12.2; }
  function whenOk(when, e) {
    for (const [k, v] of Object.entries(when || {})) {
      if (k === 'owns') { if (!(app.sim && app.sim.has(v))) return false; continue; } // the dummy's upgrades (lore tied to state, D23)
      if (k === 'broken') { if (!brokenPart(v)) return false; continue; }              // the dummy's damage
      if (Array.isArray(v)) { if (!v.includes(e[k])) return false; continue; }
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
    if (e.type === 'writeoff' && fx.lastImpact && fx.lastImpact.t === e.t) { const li = fx.lastImpact; Object.assign(out, { car: li.car, zone: li.zone, drop: li.drop, dropZ: li.dropZ, dropFrom: li.dropFrom, deck: li.deck, plate: li.plate }); }
    if (app.sim && app.sim.isCity) out.district = app.sim.levelId; // Edit 44 city barks may test the district
    const info = out.car && fx.cars.get(out.car);
    if (info) {
      const fm = FMODEL.get(info.model);
      Object.assign(out, { model: fm ? fm.id : info.model, cls: info.cls, class: fm ? fm.class : info.cls, tier: fm ? fm.tier : null, seniority: info.seniority });
    }
    const sb = app.sim && app.sim.body;
    if (sb) out.wear = +(1 - sb.health / app.sim.P['damage.bodyHealth']).toFixed(3);
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
    const all = ((CH && CH.layers) || []).concat((CD && CD.layers) || []); // generated drop juice stacks on the hit layers
    if (!all.length) return res;
    const layers = all.filter((L) => L.event === e.type);
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
  function brokenPart(v) {
    const lv = app.sim ? partLevels(app.sim) : {};
    if (v === 'legs') return lv.legL >= 3 && lv.legR >= 3;
    if (v === 'arms') return lv.armL >= 3 && lv.armR >= 3;
    return lv[v] >= 3;
  }
  // Barks from the fleet database: highest priority wins, then the most specific line; seeded pick among equals.
  // Write-offs always speak; hits outrank chatter; chatter waits out the global and per-car cooldowns (proto.barks.*).
  function barkLine(e, s) {
    if (!FLEET || !e.car) return;
    const info = fx.cars.get(e.car);
    if (!info) return;
    const pool = FLEET.barks.filter((ln) => ln.event === e.type && whenOk(ln.when, e));
    if (!pool.length) return;
    const pr = Math.max(...pool.map((ln) => ln.priority || 1)), now = app.realT, dur = pv('proto.barks.seconds') || 2.4;
    // Submission 4: a line that names the situation (a drop, a highway, a plate, the district) outranks a generic line of the same priority
    const SIT = ['drop', 'dropZ', 'dropFrom', 'deck', 'plate', 'district'], sit = (ln) => Object.keys(ln.when || {}).some((k) => SIT.includes(k));
    const pool2 = pool.filter((ln) => (ln.priority || 1) === pr), sitPool = pool2.filter(sit), cand = sitPool.length ? sitPool : pool2;
    const spec = (ln) => Object.keys(ln.when || {}).length, top = [], best = Math.max(...cand.map(spec));
    for (const ln of cand) if (spec(ln) >= Math.min(best, 1)) { top.push(ln); if (spec(ln) >= best && best > 0) top.push(ln); }
    const cur = fx.bubbles.get(e.car), last = fx.carBarkT.get(e.car);
    if (cur && now - cur.t0 < dur && cur.priority > pr) return;
    if (pr < 3) {
      if (last && now - last.t < (pv('proto.barks.carCooldown') || 4) && last.pr >= pr) return;
      if (pr === 1) {
        if (now - fx.barkT < (pv('proto.barks.cooldown') || 0.8)) return;
        let live = 0; for (const bk of fx.bubbles.values()) if (now - bk.t0 < dur) live++;
        if (!cur && live >= (pv('proto.barks.maxOnScreen') || 3)) return;
      }
    }
    const onScreen = new Set([...fx.bubbles.values()].filter((bk) => now - bk.t0 < dur).map((bk) => bk.id));
    const fresh = top.filter((ln) => !onScreen.has(ln.id) && ln.id !== fx.lastLine), use = fresh.length ? fresh : top; // no line twice at once
    const pick = use[(Math.round(e.t * 60) + info.slot * 7 + fx.barkN++) % use.length];
    const text = fillIn(pick.text, e); fx.lastLine = pick.id;
    fx.bubbles.set(e.car, { text, style: pick.style || 'speech', priority: pr, t0: now, car: e.car, id: pick.id });
    fx.barkT = now; fx.carBarkT.set(e.car, { t: now, pr });
    app.present.push({ t: +s.t.toFixed(4), type: 'bark', car: e.car, event: e.type, line: pick.id, text });
  }
  function wrapSmall(text, maxW) {
    const out = []; let cur = '';
    for (const word of String(text).split(/\s+/)) { const t = cur ? cur + ' ' + word : word; if (PIX.smallWidth(t) <= maxW || !cur) cur = t; else { out.push(cur); cur = word; } }
    if (cur) out.push(cur);
    return out;
  }
  // Pixel bubbles above the car's tag (or below the car), never over another car's tag. Styles: speech solid edge,
  // shout double edge, mutter dashed edge and dim ink, thought dotted edge with trailing dots.
  function drawBarks(s) {
    if (!fx.bubbles.size) return;
    const dur = pv('proto.barks.seconds') || 2.4, now = app.realT, placed = [];
    for (const c of s.cars) { // tags and car bodies are cues: bubbles keep off them
      const t = tagRect(c), r = Math.ceil(Math.max(c.L, c.W) / U / 2) + 1;
      placed.push({ x: t.x0 - 1, y: t.y0 - 1, w: t.w + 10, h: t.h + 2, car: c.id }, { x: Math.round(c.x / U) - r, y: Math.round(c.y / U) - r - 4, w: 2 * r, h: 2 * r + 4, car: c.id });
    }
    if (s.body.alive) placed.push({ x: Math.round(s.body.x / U) - 12, y: Math.round(s.body.y / U) - 16, w: 24, h: 26, car: '_body' }); // never over the dummy
    const hits = (r, own) => placed.some((q) => q.car !== own && r.x < q.x + q.w && r.x + r.w > q.x && r.y < q.y + q.h && r.y + r.h > q.y);
    const order = [...fx.bubbles.entries()].sort((a, b2) => b2[1].priority - a[1].priority || b2[1].t0 - a[1].t0);
    for (const [id, bk] of order) {
      const live = s.cars.find((x) => x.id === id), c = live || fx.cars.get(id), age = now - bk.t0;
      if (!c || age > dur) { fx.bubbles.delete(id); continue; }
      const lines = wrapSmall(bk.text, 92), lh = PIX.SMALL_H + 2;
      const w = Math.max(...lines.map((l) => PIX.smallWidth(l))) + 7, h = lines.length * lh + 4, cx = Math.round(c.x / U);
      const t = tagRect(c), x = clamp(cx - (w >> 1), 1, AW - w - 1);
      const up = t.y0 - 5 - h, down = Math.round(c.y / U) + Math.round(Math.max(c.L, c.W) / U / 2) + 5;
      let y = up, below = false;
      if (y < 1 || hits({ x, y, w, h }, id)) { y = Math.min(down, AH - h - 1); below = true; }
      if (y < 1 || hits({ x, y, w, h }, id)) { if (bk.priority < 2) continue; y = clamp(up, 1, AH - h - 1); below = false; }
      placed.push({ x, y, w, h, car: null });
      const st = bk.style, edge = K.barkEdge;
      for (let yy = y + 1; yy < y + h - 1; yy++) for (let xx = x + 1; xx < x + w - 1; xx++) FB.mix(xx, yy, K.barkFill, 0.94);
      const dash = st === 'mutter' ? 2 : st === 'thought' ? 3 : 0;
      let i = 0;
      const ring = (ox, oy, ww, hh, f) => {
        for (let xx = ox + 1; xx < ox + ww - 1; xx++) { f(xx, oy); f(xx, oy + hh - 1); }
        for (let yy = oy + 1; yy < oy + hh - 1; yy++) { f(ox, yy); f(ox + ww - 1, yy); }
      };
      ring(x, y, w, h, (px, py) => { if (!dash || (i++ % dash) === 0) FB.put(px, py, edge); });
      if (st === 'shout') ring(x - 1, y - 1, w + 2, h + 2, (px, py) => { if ((px + py) % 2 === 0) FB.put(px, py, edge); });
      const ax = clamp(cx, x + 3, x + w - 4);
      if (st === 'thought') { const ty = below ? y - 3 : y + h + 2; FB.put(ax, ty, edge); FB.put(ax + (below ? 0 : 1), ty + (below ? -2 : 2), edge); }
      else for (let k = 0; k < 3; k++) { const ty = below ? y - 1 - k : y + h + k; for (let xx = ax - (2 - k); xx <= ax + (2 - k); xx++) FB.put(xx, ty, xx === ax - (2 - k) || xx === ax + (2 - k) || k === 2 ? edge : K.barkFill); }
      lines.forEach((l, k) => PIX.smallText(FB, l, x + ((w - PIX.smallWidth(l)) >> 1), y + 2 + k * lh, K.barkInk)); // one ink: style lives in the edge
    }
  }
  function processEvents() {
    const s = app.sim;
    if (!s) return;
    if (fx.pendingLearned && fx.cars.has(fx.pendingLearned.car)) { const pl = fx.pendingLearned; fx.pendingLearned = null; present(s, 'learned', pl); }
    const ev = s.events;
    trackCars(s);
    for (let i = app.lastEv; i < ev.length; i++) {
      const e0 = ev[i];
      if (e0.type === 'lunge') fx.lungeWatch = { contact: false };
      if (/^(impact|knock|touch|touch-spent|contact-ignored)$/.test(e0.type)) noteContact(e0);
      if (e0.type === 'impact') { fx.lastImpact = e0; if (e0.part) fx.lastPart = { part: e0.part, lost: e0.lost, t: app.realT }; }
      if (e0.type === 'purchase') fx.pendingNodes.push(e0.node); // node id, as the fleet database keys it
      if (e0.type === 'chassis' && fx.pendingNodes.length) { fx.upgradeWatch = fx.pendingNodes[fx.pendingNodes.length - 1]; fx.pendingNodes = []; }
      const e = enrich(e0);
      const hj = hitJuice(e, s);
      const juiced = hj.done || juice(e0, s);
      // P3: barks are not drawn. A legible bubble at ui.typeSecondary would cover the 400 × 300 field.
      // Lore tied to state (D23): a car that notices the dummy remarks on a new module or a broken part;
      // a model that learned returns and says so. Lines come from the fleet database.
      const notices = e.car && ((e0.type === 'commit' && e0.cause === 'body') || (e0.type === 'honk' && e0.at === 'body'));
      if (FLEET && notices && fx.upgradeWatch) {
        const node = fx.upgradeWatch; fx.upgradeWatch = null;
        fx.carBarkT.delete(e.car); fx.barkT = -9;
        present(s, 'upgrade-seen', { car: e.car, node });
      } else if (FLEET && notices && fx.partWatch) {
        const part = fx.partWatch; fx.partWatch = null;
        fx.carBarkT.delete(e.car); fx.barkT = -9;
        present(s, 'part-seen', { car: e.car, part });
      }
      if (e0.type === 'learn-standoff') fx.learnWatch.set(e0.model, { from: e0.from, to: e0.to });
      if (e0.type === 'admit' && fx.learnWatch.has(e0.model)) { const lw = fx.learnWatch.get(e0.model); fx.learnWatch.delete(e0.model); fx.pendingLearned = { car: e0.car, from: lw.from, to: lw.to }; }
      if (e0.type === 'impact' && e0.part && s.body.alive) { const lv = partLevels(s)[e0.part]; if (lv >= 3 && !fx.partsSeen.has(e0.part)) { fx.partsSeen.add(e0.part); fx.partWatch = e0.part; } }
      if (e0.type === 'chassis') { fx.partsSeen.clear(); fx.partWatch = null; }
      if (FLEET && e.car) barkLine(e, s);
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
        case 'chassis': fx.dropT0 = app.realT; fx.lastPart = null; break;
        case 'writeoff': {
          if (!hj.sound) [392, 311, 233, 155].forEach((f, j) => Snd.tone(f, f * 0.98, 0.16, 'square', 0.07, j * 0.11));
          if (!juiced) {
            kick(14, 0.6); fx.flash.t0 = app.realT; fx.flash.dur = 0.18; fx.stampT0 = app.realT;
            const b = s.body; puff(b.x, b.y, 24, { type: 'spark', speed: 220, life: 0.5, size: 2.5 }); puff(b.x, b.y, 10, { type: 'smoke', speed: 30, life: 1.2, size: 8 });
          }
          break;
        }
        case 'denied': Snd.tone(120, 110, 0.05, 'square', 0.05); Snd.tone(120, 110, 0.05, 'square', 0.05, 0.08); if (!(e.action === 'lunge' && fx.slipT === e.t)) toast(copy('denied.' + e.action, DENY_TEXT[e.action] || 'Denied')); break;
        case 'slip': { fx.slipT = e.t; const b = s.body; puff(b.x, b.y + 8, 8, { type: 'spark', role: 'puddleHi', speed: 90, life: 0.3, size: 2 }); toast(copy('toast.slip', 'No dash on water. Step off the puddle.')); break; } // D18
        case 'skid': { const c = s.cars.find((q) => q.id === e.car); if (c) puff(c.x, c.y, 10, { type: 'spark', role: 'puddleHi', dir: c.h + Math.PI, spread: 2.2, speed: 120, life: 0.35, size: 2 }); Snd.tone(1800, 900, 0.18, 'sawtooth', 0.02); break; }
        case 'screen': { // D24: first visit names the screen
          Snd.tone(300, 520, 0.12, 'triangle', 0.04);
          if (!fx.seenScreens.has(e.to)) { fx.seenScreens.add(e.to); toast(e.to + ' · ' + (THEME_NAME[e.focal || e.theme] || '') + (e.turns === 'diagonal' ? ' · 45° road' : '')); } // P4: generated screen names were checked against P3's layouts, so P4 shows the screen's theme
          break;
        }
        case 'purchase': [523, 659, 784].forEach((f, j) => Snd.tone(f, f, 0.1, 'triangle', 0.07, j * 0.07)); toast(copy('toast.purchase', '{node} installed', { node: NODES[e.node].name })); break;
        case 'pickup': Snd.tone(700, 950, 0.05, 'triangle', 0.06); break;
        case 'drop': Snd.tone(500, 380, 0.06, 'triangle', 0.05); break;
        case 'stair': Snd.tone(260, 300, 0.05, 'triangle', 0.03); break;
        case 'level': { // Edit 42, 44: first time up says what the level does
          const f = s.level.floors && s.body.floor != null ? s.level.floors[s.body.floor] : null, kind = f ? f.kind : null, key = 'level' + e.level + (kind === 'deck' ? '' : kind || '');
          if (e.level > 0 && kind !== 'bridge' && !fx.seenScreens.has(key)) {
            fx.seenScreens.add(key);
            toast(kind === 'roof' ? place('levels.roof') || copy('toast.roof', 'Roof: no traffic up here. Step off a ledge to drop on a car below.')
              : e.level === 2 ? place('levels.z2Highway') || copy('toast.highway', 'High highway: fast traffic. A broken parapet is a long drop to the street.')
              : place('levels.z1') || copy('toast.deck', 'Low highway: traffic up here. A broken parapet drops you to the road.'));
          }
          break;
        }
        case 'deck-drop': if (!hj.sound) Snd.tone(700, 200, 0.3, 'triangle', 0.06); break;
        case 'land': { const b = s.body; if (!hj.sound) Snd.tone(110, 80, 0.12, 'square', 0.06); if (!hj.done) { puff(b.x, b.y + 6, 8, { type: 'dust', speed: 70, life: 0.4, size: 3 }); if (!e.car) kick(2, 0.12); } break; } // generated drop juice replaces the stub
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
  function dashify(str) { return String(str).replace(/lunge/gi, (m) => (m[0] === 'L' ? (m === 'LUNGE' ? 'DASH' : 'Dash') : 'dash')); } // display name only
  function toast(msg) { app.toast = { msg: dashify(msg), t: app.realT }; }

  // ---------- menus
  const PAUSE_ITEMS = ['Resume', 'Restart level', 'Refuse testing', 'Show trace', 'Quit to title'];
  const END_ITEMS = ['Play again from district 1', 'Choose a district', 'Show trace'];
  const SHOP_GRID = [['hips', 'spine'], ['carry', 'throw'], ['bigBattery']];
  function handleMenus() {
    const s = app.sim;
    const live = app.screen === 'game' && !app.paused && s && (s.phase === 'play' || s.phase === 'hitstop' || s.phase === 'writeoff' || s.phase === 'scroll');
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
        const nc = SHOP_GRID.length, colLen = () => SHOP_GRID[app.shopCol].length;
        if (m === 'left' || m === 'right') { app.shopCol = (app.shopCol + (m === 'right' ? 1 : -1) + nc) % nc; if (app.shopRow < 2 && app.shopRow >= colLen()) app.shopRow = colLen() - 1; }
        else if (m === 'up') app.shopRow = app.shopRow === 2 ? colLen() - 1 : Math.max(0, app.shopRow - 1);
        else if (m === 'down') app.shopRow = app.shopRow + 1 >= colLen() ? 2 : app.shopRow + 1;
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
          if (it === 'Retry this district') { const rs = app.roads.slice(); startLevel(app.level, app.roadCarry); app.roads = rs; return; }
          if (it === 'Play again from district 1') { startLevel(0); return; }
          if (it === 'Choose a district') { app.screen = 'title'; app.sim = null; return; }
          if (it === 'Replay this level') { startLevel(app.level); return; }
          if (it === 'Choose another level') { app.screen = 'title'; app.sim = null; return; }
          showTrace();
        }
      }
    }
    q.a = q.b = q.bUp = 0;
  }


  // ---------- type budget (GDD §4.2.3). Reference units: the 1280 × 720 canvas. B612 cap height = 0.75 em (measured).
  const CAP = 0.75;
  const TY = { lb: Math.round(pv('ui.typeLoadBearing') / CAP), sec: Math.ceil(pv('ui.typeSecondary') / CAP) };
  const fNum = '700 ' + TY.lb + 'px ' + F_MONO, fBig = '700 ' + TY.lb + 'px ' + F_UI;
  const fLab = '700 ' + TY.sec + 'px ' + F_UI, fTxt = '400 ' + TY.sec + 'px ' + F_UI, fKey = '700 ' + TY.sec + 'px ' + F_MONO;

  // ---------- frame theme: FARSIGHT glass by day; dark glass and LED edges by night (same layout, same type)
  const FT = PIX.NAME !== 'day' ? {
    bg: ['#05070D', '#0A0F1C', '#121B33'], glow: 'rgba(63,208,255,0.22)', glow2: 'rgba(155,107,255,0.18)', panelTop: 'rgba(20,30,56,0.94)', panelBot: 'rgba(8,12,24,0.94)',
    edge: 'rgba(63,208,255,0.85)', gloss: 'rgba(255,255,255,0.12)', text: '#F4F8FA', dim: '#9FB8C8', accent: '#3FD0FF', brand: '#3FD0FF', bezel: '#0B0F1A',
    keyTop: '#1C2A4A', keyBot: '#0E1528', veil: 'rgba(5,8,16,0.62)', track: '#1E2638', sel: '#1840C8', selText: '#FFFFFF', item: 'rgba(255,255,255,0.06)',
    itemEdge: 'rgba(127,168,188,0.5)', off: '#5E7080', banner: 'rgba(10,16,32,0.94)', toast: 'rgba(24,64,200,0.92)', credit: 'rgba(245,197,66,0.16)', neon: true,
  } : {
    bg: ['#EAF6FB', '#D6ECF4', '#C3E1EC'], glow: 'rgba(255,255,255,0.8)', glow2: null, panelTop: 'rgba(255,255,255,0.97)', panelBot: 'rgba(236,247,252,0.95)',
    edge: 'rgba(79,195,232,0.8)', gloss: 'rgba(255,255,255,0.9)', text: C.primary, dim: C.ink2, accent: C.aquaDeep, brand: C.aquaDeep, bezel: '#F7FBFD',
    keyTop: '#FFFFFF', keyBot: '#DCEFF6', veil: 'rgba(232,244,249,0.62)', track: '#E2EAEE', sel: C.aqua, selText: '#06202B', item: 'rgba(255,255,255,0.8)',
    itemEdge: '#C9D5DB', off: '#8C9AA4', banner: 'rgba(255,255,255,0.94)', toast: 'rgba(16,20,23,0.86)', credit: 'rgba(245,197,66,0.3)', neon: false,
  };
  // ---------- drawing helpers (frame layer, reference units)
  function rr(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function txt(s, x, y, font, color, align, base) {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align || 'left'; ctx.textBaseline = base || 'alphabetic'; ctx.fillText(s, x, y);
  }
  function rgba(hex, a) { const h = (i) => parseInt(hex.slice(i, i + 2), 16); return 'rgba(' + h(1) + ',' + h(3) + ',' + h(5) + ',' + Math.max(0, a) + ')'; }
  function roleC(r) { return r === 'glass' ? '#FFFFFF' : r === 'aquaDeep' ? FT.accent : C[r] || null; }
  function panel(x, y, w, h, opts) { // FARSIGHT glass (frame layer only)
    const R = 12;
    ctx.save();
    ctx.shadowColor = 'rgba(16,40,56,0.16)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 5;
    rr(x, y, w, h, R);
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, FT.panelTop); g.addColorStop(1, (opts && opts.tint && !FT.neon && opts.tint) || FT.panelBot);
    ctx.fillStyle = g; ctx.fill(); ctx.restore();
    if (FT.neon) { ctx.save(); ctx.shadowColor = FT.edge; ctx.shadowBlur = 10; }
    rr(x + 0.75, y + 0.75, w - 1.5, h - 1.5, R); ctx.strokeStyle = FT.edge; ctx.lineWidth = 1.5; ctx.stroke();
    if (FT.neon) ctx.restore();
    ctx.save(); rr(x + 2, y + 2, w - 4, Math.min(22, h / 3), R - 2); ctx.clip();
    const hg = ctx.createLinearGradient(0, y, 0, y + 22); hg.addColorStop(0, FT.gloss); hg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hg; ctx.fillRect(x, y, w, 24); ctx.restore();
  }
  function glassKey(x, y, w, h) {
    rr(x, y, w, h, 8);
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, FT.keyTop); g.addColorStop(1, FT.keyBot);
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = FT.edge; ctx.lineWidth = 1.5; ctx.stroke();
  }
  function fmtT(t) { const m = Math.floor(t / 60), s = Math.floor(t % 60); return m + ':' + String(s).padStart(2, '0'); }
  function num(v) { return Math.round(v).toLocaleString('en-GB'); }
  function wrapLines(str, w, font) {
    ctx.font = font; const out = []; let line = '';
    for (const wd of String(str).split(' ')) { const t = line ? line + ' ' + wd : wd; if (ctx.measureText(t).width > w && line) { out.push(line); line = wd; } else line = t; }
    if (line) out.push(line);
    return out;
  }
  function wrapText(str, x, y, w, lh, font, color, max, align) {
    const lines = wrapLines(str, w, font).slice(0, max || 9);
    lines.forEach((l, i) => txt(l, x, y + i * lh, font, color, align));
    return lines.length;
  }
  function drawKeys(items, cx, y) { // key caps and actions at ui.typeSecondary
    ctx.font = fKey; const kw = items.map((it) => ctx.measureText(it[0]).width + 20);
    ctx.font = fLab; const aw = items.map((it) => ctx.measureText(it[1]).width);
    const gap = 10, sep = 30, total = kw.reduce((a, b) => a + b, 0) + aw.reduce((a, b) => a + b, 0) + items.length * gap + (items.length - 1) * sep;
    let x = cx - total / 2;
    items.forEach((it, i) => {
      glassKey(x, y, kw[i], 32); txt(it[0], x + kw[i] / 2, y + 24, fKey, FT.text, 'center'); x += kw[i] + gap;
      txt(it[1], x, y + 24, fLab, FT.dim); x += aw[i] + sep;
    });
  }

  // ---------- pixel field: 400 × 300 art grid, composited at ×2 reference units, so whole device pixels per art pixel
  const U = PIX.U, K = PIX.K, AW = PIX.AW, AH = PIX.AH;
  if (pv('ui.artScale') !== U || pv('ui.playWidth') / U !== AW) console.warn('P3 art grid expects ui.artScale = 2 and a 400 × 320 field');
  const art = document.createElement('canvas'); art.width = AW; art.height = AH;
  const actx = art.getContext('2d'), aimg = actx.createImageData(AW, AH), a32 = new Uint32Array(aimg.data.buffer);
  const MAIN = new PIX.Buf(AW, AH), DL = new PIX.Buf(AW, AH); // DL: the deck layer, drawn on the footprint and lifted on composite
  let FB = MAIN; DL.layer = true;
  const ALL = () => true;
  const toA = (pts) => pts.map((q) => [q[0] / U, q[1] / U]);
  const EXT = (h) => Math.round(h * pv('proto.art.extrusion') / U); // object height drawn as a screen-up offset, art px
  const artCache = new Map();
  function levelArt(s) {
    const id = (s.level.key || s.level.id) + (s.P['proto.city'] ? ':city' : '') + ':' + (s.P['proto.district.seed'] || 0) + ':' + (s.P['world.puddleShare']) + (s.level.blockedEdges ? ':edges' : '');
    if (!artCache.has(id)) {
      const P = s.P, L = s.level, gen = L.cell && L.theme !== 'start';
      const gr = PIX.ground(L, P, gen ? 1000 + L.cell[0] * 37 + L.cell[1] * 101 + LEVEL_LIST.indexOf(L.id) * 7 : 7 + LEVEL_LIST.indexOf(id) * 31), leds = PIX.PAL.bldgLed;
      const zL = (z) => EXT(zHeight(P, z)), fl = L.floors || [], half = P['world.deckWidth'] / 2;
      const roofSpec = (st) => { // Edit 44: a platform's ledges and openings (stair heads, skybridges), art px along each side
        const ri = fl.findIndex((f) => f.kind === 'roof' && f.bx === st.x && f.by === st.y);
        if (ri < 0) return null;
        const f = fl[ri], open = [], rel = (sd, a0, a1) => { const o = sd === 'N' || sd === 'S' ? st.x : st.y; open.push([sd, Math.round((a0 - o) / U), Math.round((a1 - o) / U)]); };
        for (const q of L.stairs || []) if (q.head === ri) { const sd = q.axis === 'x' ? (q.high <= st.x + 1 ? 'W' : 'E') : (q.high <= st.y + 1 ? 'N' : 'S'); if (q.axis === 'x') rel(sd, q.y, q.y + q.h); else rel(sd, q.x, q.x + q.w); }
        for (const g of fl) if (g.kind === 'bridge' && (g.ends || []).includes(ri)) { if (g.axis === 'x') rel(g.x < st.x ? 'W' : 'E', g.y, g.y + g.h); else rel(g.y < st.y ? 'N' : 'S', g.x, g.x + g.w); }
        return { ledges: f.ledges.map((lg) => lg.side), open };
      };
      const sprite = (st, i0) => {
        const w = Math.round(st.w / U), h = Math.round(st.h / U), i = st.art != null ? st.art : i0; // Edit 48: a building across a shared edge draws the same on both screens
        if (st.kind === 'block' && st.platform) return PIX.building(w, h, zL(2), PIX.rng(311 + i * 17), PIX.c32(leds[i % leds.length]), st.storeys, roofSpec(st) || { ledges: [], open: [] }); // Edit 44: roof at Z2
        if (st.kind === 'block') return st.storeys ? PIX.building(w, h, st.storeys * EXT(P['world.storeyHeight']), PIX.rng(311 + i * 17), PIX.c32(leds[i % leds.length]), st.storeys) // Edit 43: by storeys
          : PIX.building(w, h, EXT(st.height), PIX.rng(311 + i * 17), PIX.c32(leds[i % leds.length]));
        if (st.deck) return null; // deck columns are drawn with their deck
        if (st.kind === 'monument') return PIX.monument(w, h, EXT(st.height));
        if (st.kind === 'fountain') return PIX.fountain(w, h, EXT(st.height));
        if (st.kind === 'jersey') return PIX.jersey(w, h, EXT(P['proto.art.barrierHeight']));
        if (st.kind === 'barrier') return PIX.barrier(w, h, EXT(P['proto.art.barrierHeight']));
        if (st.kind === 'wall') return PIX.wall(w, h, EXT(st.height)); // Edit 42: the district's bounds
        if (st.kind === 'booth') return PIX.booth(w, h, EXT(st.height));
        if (st.kind === 'river') return null; // the canal in the ground art is the river
        return PIX.pod(w, h, EXT(P[st.kind === 'crate' ? 'proto.art.crateHeight' : 'proto.art.pillarHeight']), i);
      };
      const deckAt = (st) => (L.decks || []).find((dk) => (dk.hz ? Math.abs(st.y + st.h / 2 - dk.off) : Math.abs(st.x + st.w / 2 - dk.off)) < half);
      const blockOf = (ri) => L.statics.find((q) => q.kind === 'block' && fl[ri] && q.x === fl[ri].bx && q.y === fl[ri].by);
      artCache.set(id, { ground: gr, statics: L.statics.map((st, i) => ({ st, spr: sprite(st, i) })).filter((o) => o.spr), decks: (L.decks || []).map((dk) => Object.assign({ dk }, PIX.deck(dk, P))),
        up: (L.stairs || []).map((st) => ({ st, spr: PIX.stairs(st, zL(st.from), zL(st.to)) })), // Edit 44: every flight, foot to head
        cols: L.statics.filter((st) => st.deck && st.kind === 'pillar').map((st) => { const dk = deckAt(st); return { st, spr: PIX.column(Math.round(st.w / U), Math.round(st.h / U), EXT(dk ? dk.height : P['world.deckHeight'])) }; }),
        bridges: fl.map((f, i) => ({ f, i })).filter((o) => o.f.kind === 'bridge').map(({ f, i }) => ({ f, i, key: Math.max(...(f.ends || []).map((ri) => { const q = blockOf(ri); return q ? q.y + q.h : f.y + f.h; })) + 0.5,
          spr: PIX.skybridge(Math.round(f.w / U), Math.round(f.h / U), zL(2), f.axis === 'x') })) });
    }
    return artCache.get(id);
  }
  function flush() { a32.set(FB.d); actx.putImageData(aimg, 0, 0); }
  function carSpr(s, c, braking) { return PIX.car(c.cls, Math.round(c.L / U), Math.round(c.W / U), EXT(s.P['vehicles.' + c.cls + '.height']), c.h, braking); }
  function shortId(m) { const fm = FMODEL.get(m); if (fm) return fm.tag; const t = String(m).toUpperCase(), a = t.match(/[A-Z]/), d = t.match(/\d+/); return ((a ? a[0] : '') + (d ? d[0] : '')).slice(0, 3); } // GDD 4.2.2: three characters
  function coneLift(cn) { return cn.state === 'flight' ? 10 * Math.sin(Math.PI * clamp(1 - cn.flightT / (cn.flightDur || 1), 0, 1)) : 0; }
  function coneFn(s) { // the dummy's view cone, as an art-pixel predicate
    const P = s.P, b = s.body, R = P['sensing.coneReach'], hw = s.coneWidth() * DEG / 2; // head damage narrows it
    return (x, y) => {
      const dx = (x + 0.5) * U - b.x, dy = (y + 0.5) * U - b.y;
      if (dx * dx + dy * dy > R * R) return false;
      const a = Math.atan2(dy, dx) - b.facing;
      return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= hw;
    };
  }
  function rotRect(x, y, h, L, W) { const ca = Math.cos(h), sa = Math.sin(h); return [[-L / 2, -W / 2], [L / 2, -W / 2], [L / 2, W / 2], [-L / 2, W / 2]].map(([u, v]) => [x + u * ca - v * sa, y + u * sa + v * ca]); }
  function arcPoly(cx, cy, R, a0, a1, n) { const out = [[cx, cy]]; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); } return out; }
  function mixOnce(pts, c, a) { const seen = new Set(); for (const [x, y] of pts) { const k = x + y * 1024; if (!seen.has(k)) { seen.add(k); FB.mix(x, y, c, a); } } }

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
      if (o === c || (o.cls !== 'van' && o.cls !== 'bus') || Math.hypot(o.x - nx, o.y - ny) > reach) continue; // P5: a bus casts a sensor shadow too
      add(rotRect(o.x, o.y, o.h, o.L, o.W));
    }
    return out;
  }
  // Scanners: forward corridor hatched, side sensors outlined; sensor shadows stay clear (the scan cannot reach there).
  function drawZones(s, c, clip) {
    const P = s.P, hot = !!c.det.fwd || !!(c.hz && c.hz.inPath), cor = corridorPts(s, c);
    const R = P['perception.sideRadius'], ha = P['perception.sideHalfAngle'] * DEG;
    const nx = c.x + Math.cos(c.h) * c.L / 2, ny = c.y + Math.sin(c.h) * c.L / 2;
    const sides = [1, -1].map((sg) => toA(arcPoly(nx, ny, R, c.h + sg * Math.PI / 2 - ha, c.h + sg * Math.PI / 2 + ha, 16)));
    const corA = cor ? toA(cor) : null, blinds = blindSpots(s, c).map(toA);
    const open = (x, y) => clip(x, y) && !blinds.some((bp) => PIX.inPoly(bp, x + 0.5, y + 0.5));
    if (corA) {
      const m = hot ? 3 : 4;
      PIX.fillPoly(corA, (x, y) => { if ((x + y) % m === 0 && open(x, y)) FB.put(x, y, K.label); });
      PIX.polyline(corA.concat([corA[0]]), (x, y) => { if (open(x, y)) FB.put(x, y, hot ? K.ink : K.label); });
    }
    for (const sp of sides) {
      if (c.det.side) PIX.fillPoly(sp, (x, y) => { if (x % 3 === 0 && y % 3 === 0 && open(x, y)) FB.put(x, y, K.label); });
      PIX.polyline(sp.concat([sp[0]]), (x, y, i) => { if (i % 4 < 2 && open(x, y)) FB.put(x, y, K.label); });
    }
    if (!blinds.length) return;
    const inSensor = (x, y) => (corA && PIX.inPoly(corA, x + 0.5, y + 0.5)) || sides.some((sp) => PIX.inPoly(sp, x + 0.5, y + 0.5));
    for (const bp of blinds) PIX.polyline(bp.concat([bp[0]]), (x, y, i) => { if (i % 3 === 0 && x >= 0 && y >= 0 && x < AW && y < AH && clip(x, y) && inSensor(x, y)) FB.put(x, y, K.ink); });
  }
  function drawPath(s, c, clip) {
    let pts = null, provisional = false;
    if (c.man && c.state === 'committed') pts = s.predict(c, c.man, s.t, c.man.until);
    else if (c.intent && c.state === 'intention') {
      provisional = true;
      const span = c.intent.type === 'shift' ? c.intent.len / Math.max(c.v, 40) + 0.3 : s.P['traffic.commitHorizon'];
      pts = s.predict(c, Object.assign({ t0: s.t }, c.intent), s.t, s.t + span);
    }
    if (!pts || pts.length < 2) return;
    PIX.polyline(pts.map((p) => [p.x / U, p.y / U]), (x, y, i) => {
      if (!clip(x, y)) return;
      if (provisional ? i % 4 === 0 : i % 5 < 3) FB.put(x, y, provisional ? K.label : K.ink);
    });
    if (!provisional && c.man && c.man.standoff) { // STOP line: warning ink with a dark outline (Edit 37 §4.1.4)
      const q = pathAt(c.path, c.man.sStop + c.L / 2), hw = c.W / 2 + 10;
      const pa = PIX.collectLine((q.x + q.nx * (c.d - hw)) / U, (q.y + q.ny * (c.d - hw)) / U, (q.x + q.nx * (c.d + hw)) / U, (q.y + q.ny * (c.d + hw)) / U);
      PIX.stamp(FB, pa.filter(([x, y]) => clip(x, y)), K.warn, K.cueHalo);
    }
  }
  // P2.2 stop bracket: where the nose stops if the dummy steps in now and the car sees it.
  function drawStopCue(s, c) {
    const P = s.P;
    if (!P['proto.stopCue'] || c.v < 5 || (c.man && (c.man.type === 'reverse' || c.man.standoff))) return;
    const braking = !!(c.man && c.man.type === 'brake');
    const covering = (c.nearT || 0) - (c.pathT || 0) >= P['perception.reactionDelay'] - 1e-9;
    const react = braking ? 0 : Math.max(0, (covering ? P['proto.driver.coveredReaction'] : P['perception.reactionDelay']) - (c.pathT || 0));
    const sN = c.s + c.L / 2 + c.v * react + c.v * c.v / (2 * P['traffic.hardBraking']);
    if (sN > c.path.length) return;
    const q = pathAt(c.path, sN), d = s.plannedD(c, sN), hw = c.W / 2 + 4, k = 6, cx = q.x + q.nx * d, cy = q.y + q.ny * d;
    if (cx < -10 || cx > FW + 10 || cy < -10 || cy > FH + 10) return;
    PIX.polyline([[cx + q.nx * hw - q.tx * k, cy + q.ny * hw - q.ty * k], [cx + q.nx * hw, cy + q.ny * hw], [cx - q.nx * hw, cy - q.ny * hw], [cx - q.nx * hw - q.tx * k, cy - q.ny * hw - q.ty * k]]
      .map((p) => [p[0] / U, p[1] / U]), (x, y) => FB.put(x, y, K.label));
  }
  function drawViewEdges(s) {
    const b = s.body, hw = s.coneWidth() * DEG / 2;
    for (const sg of [-1, 1]) PIX.line(b.x / U, b.y / U, (b.x + Math.cos(b.facing + sg * hw) * 1200) / U, (b.y + Math.sin(b.facing + sg * hw) * 1200) / U,
      (x, y, i) => { if (i > 9 && i % 4 === 0) FB.mix(x, y, K.ink, 0.45); });
  }
  // Generated tyre marks (content/juice.json states.brakeMarks): matte, under every cue.
  function markCar(c, braking) {
    const bm = CJ && CJ.states && CJ.states.brakeMarks;
    if (!bm) return;
    const ca = Math.cos(c.h), sa = Math.sin(c.h), wheels = [-1, 1].map((sd) => { const u = -c.L / 2 + 6, v = sd * (c.W / 2 - 4); return [c.x + u * ca - v * sa, c.y + u * sa + v * ca]; });
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
    const fade = jv(bm.fadeSeconds) || 1, al = jv(bm.alpha);
    fx.marks = fx.marks.filter((m) => app.realT - m.t < fade);
    for (const m of fx.marks) PIX.line(m.a[0] / U, m.a[1] / U, m.b[0] / U, m.b[1] / U, (x, y) => FB.mix(x, y, K.tyre, al * (1 - (app.realT - m.t) / fade)));
  }
  // ----- Edit 44 levels: Z0 ground, Z1 low highway, Z2 high highway, platform roofs and skybridges
  const lay = (c) => (c.layer == null ? 0 : c.layer);
  const zLift = (s, z) => EXT(zHeight(s.P, z || 0)); // art px a level is drawn above its footprint
  function bodyFloor(s) { const b = s.body; return b.floor != null ? (s.level.floors || [])[b.floor] || null : null; }
  function onFloor(s, kind) { const b = s.body, f = bodyFloor(s); return b.alive && !b.stair && b.mode !== 'drop' && b.level > 0 && !!f && (!kind || f.kind === kind); }
  function onDeck(s) { return onFloor(s, 'deck'); }
  function onGroundDraw(s) { const b = s.body; return b.alive && b.level === 0 && !b.stair && b.mode !== 'drop'; }
  function stairDeck(s, st) { const fl = s.level.floors || []; return st.deck != null ? st.deck : st.foot != null && fl[st.foot] ? fl[st.foot].deck : null; } // the deck a flight is drawn with
  function cueLevel(s) { // cues and tags show for cars on the dummy's level; on a stair, the level it is nearer; falling, where it lands
    const b = s.body;
    if (!b.alive) return 0;
    if (b.stair) return s.stairT(b.stair, b.x, b.y) > 0.5 ? b.stair.to : b.stair.from;
    return b.mode === 'drop' && b.drop ? b.drop.toZ : b.level;
  }
  function cueDeck(s) { // the deck whose traffic can meet the dummy, if any
    const b = s.body, fl = s.level.floors || [];
    let f = null;
    if (b.stair) f = s.stairT(b.stair, b.x, b.y) > 0.5 ? fl[b.stair.head] : b.stair.foot != null ? fl[b.stair.foot] : null;
    else if (b.mode === 'drop' && b.drop) f = b.drop.toFloor != null ? fl[b.drop.toFloor] : null;
    else f = bodyFloor(s);
    return f && f.kind === 'deck' ? f.deck : null;
  }
  function bodyLift(s) {
    const b = s.body;
    if (!b.alive) return 0;
    if (b.mode === 'drop' && b.drop) { const f = clamp(b.drop.t / b.drop.T, 0, 1), hi = zLift(s, b.drop.fromZ), lo = zLift(s, b.drop.toZ); return Math.round(lo + (hi - lo) * (1 - f * f)); } // falls
    if (b.stair) { const a = zLift(s, b.stair.from), c = zLift(s, b.stair.to); return Math.round(a + (c - a) * clamp(s.stairT(b.stair, b.x, b.y), 0, 1)); }
    return zLift(s, b.level);
  }
  function deckOf(s, c) { const ln = s.level.deckLanes && s.level.deckLanes[c.lane - 2]; return ln ? ln.deck : -1; }
  function carShadow(s, c) { const P = s.P, k = P['proto.art.shadowScale'], h = P['vehicles.' + c.cls + '.height']; PIX.fillPoly(toA(rotRect(c.x + PIX.SUN.x * h * k, c.y + PIX.SUN.y * h * k, c.h, c.L, c.W)), (x, y) => FB.shade(x, y, 0.72)); }
  function dynShadows(s) { // hard shadows, down-left (multiply); deck actors cast theirs on the deck (drawDeck)
    const P = s.P, k = P['proto.art.shadowScale'], b = s.body, sh = (x, y) => FB.shade(x, y, 0.72);
    const off = (h) => [PIX.SUN.x * h * k, PIX.SUN.y * h * k];
    for (const cn of s.cones) {
      if (cn.state !== 'free' && cn.state !== 'flight') continue;
      const o = off(P['proto.art.coneHeight'] + coneLift(cn)); PIX.disc((cn.x + o[0]) / U, (cn.y + o[1]) / U, Math.round(P['props.cone.radius'] / U), sh);
    }
    for (const c of s.cars) if (lay(c) === 0) carShadow(s, c);
    if (onGroundDraw(s) || (b.alive && b.mode === 'drop' && b.drop && b.drop.toZ === 0)) { const o = off(P['proto.art.dummyHeight']); PIX.ellipse(b.x / U + o[0] / U, b.y / U + 3, 5.5, 2.2, sh); } // falling: the shadow marks the landing
    for (const d of s.drones) {
      const o = off(P['proto.art.droneHeight'] * d.alt), x = (d.x + o[0]) / U, y = (d.y + o[1]) / U, pts = [];
      PIX.line(x - 7, y - 4, x + 7, y + 4, (px, py) => pts.push([px, py])); PIX.line(x - 7, y + 4, x + 7, y - 4, (px, py) => pts.push([px, py]));
      const seen = new Set(); for (const [px, py] of pts) { const kk = px + py * 1024; if (!seen.has(kk)) { seen.add(kk); sh(px, py); } }
    }
  }
  function dropK() { // replacement-chassis drop: 1 at delivery start, 0 on the floor
    const rd = CJ && CJ.states && CJ.states.replacementDrop;
    if (!rd) return 0;
    const dur = jv(rd.seconds) || 0.5, age = app.realT - fx.dropT0;
    return age >= 0 && age < dur ? 1 - age / dur : 0;
  }
  function reachEnd(s) {
    const b = s.body, R = s.reach(), r = s.P['body.radius'], cx = Math.cos(b.facing), cy = Math.sin(b.facing);
    let d = 0;
    for (; d < R; d += 3) {
      const x = b.x + cx * d, y = b.y + cy * d;
      if (s.onGround() && s.level.statics.some((st) => x + r > st.x && x - r < st.x + st.w && y + r > st.y && y - r < st.y + st.h)) { d = Math.max(0, d - 3); break; }
    }
    d = Math.min(d, R);
    return { x: b.x + cx * d, y: b.y + cy * d, short: d < R - 1 };
  }
  // Under the dummy: lunge trace or reach tick, then the charge ring (battery glow, 4.2.2).
  function drawBodyGround(s, lift) {
    const b = s.body, P = s.P, L = lift || 0;
    if (!b.alive) return;
    const cx = Math.round(b.x / U), cy = Math.round(b.y / U) - L;
    if (b.mode === 'lunge' && b.lunge) {
      const pts = []; PIX.line(b.lunge.x0 / U, b.lunge.y0 / U - L, cx, cy, (x, y) => { for (const [i, j] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) pts.push([x + i, y + j]); });
      mixOnce(pts, K.ink, 0.28);
    } else {
      const e = reachEnd(s), nx = -Math.sin(b.facing), ny = Math.cos(b.facing);
      PIX.line((e.x - nx * 6) / U, (e.y - ny * 6) / U - L, (e.x + nx * 6) / U, (e.y + ny * 6) / U - L, (x, y) => FB.put(x, y, K.label));
      if (e.short) for (const p of PIX.circle(2)) FB.put(Math.round(e.x / U) + p[0], Math.round(e.y / U) - L + p[1], K.label);
    }
    const cap = P['battery.capacity'], seg = TAU / cap, gap = 0.28;
    for (const [x, y, a] of PIX.circle(10)) {
      const t = (a + Math.PI / 2) % TAU, i = Math.floor(t / seg), w = t - i * seg;
      if (w < gap / 2 || w > seg - gap / 2) continue;
      const f = clamp(b.charge - i, 0, 1), on = f > 0 && (w - gap / 2) / (seg - gap) <= f;
      if (on) FB.put(cx + x, cy + y, f >= 1 ? K.ink : K.label); else FB.mix(cx + x, cy + y, K.ink, 0.18);
    }
    if (b.denied > 0) for (const p of PIX.circle(12)) FB.put(cx + p[0], cy + p[1], K.warn);
  }
  function drawBodySprite(s, ghostOnly, liftPx) {
    const b = s.body, P = s.P;
    const wear = clamp(1 - b.health / P['damage.bodyHealth'], 0, 1), fl = app.realT - fx.flinchT0;
    let jx = 0, jy = 0;
    if (fl < 0.3) { const k = (1 - fl / 0.3) * 2 * MOTION; jx += Math.round(Math.sin(app.realT * 97) * k); jy += Math.round(Math.cos(app.realT * 83) * k); }
    if (wear > 0.6) jx += Math.round(Math.sin(app.realT * 41) * (wear - 0.6) * 2.5 * MOTION);
    const sb = fx.stumble, sa0 = app.realT - sb.t0;
    if (sa0 < sb.dur && sb.amp) jx += Math.round(Math.sin(sa0 * 22) * sb.amp * 4 * (1 - sa0 / sb.dur) * MOTION);
    if (b.mode === 'knock') jx += Math.round(Math.sin(b.knockT * 38) * 1.5 * MOTION);
    if (b.mode === 'lunge') { jx += Math.round(Math.cos(b.facing)); jy += Math.round(Math.sin(b.facing)); }
    const dk = dropK(), lift = dk ? Math.round(jv(CJ.states.replacementDrop.height) * dk / U / 2) : 0;
    const hop = liftPx || 0; // above the ground: on a deck, a stair, or falling from a deck
    const cx = Math.round(b.x / U) + jx, cy = Math.round(b.y / U) + jy - lift - hop;
    if (dk) PIX.line(cx, cy - 16, cx, -1, (x, y) => FB.mix(x, y, K.ink, 0.5 * dk));
    const S = PIX.dummy(b.facing, Math.min(5, Math.round(wear * 5)));
    b._spr = S; b._sx = cx; b._sy = cy;
    if (ghostOnly) return;
    PIX.blit(FB, S, cx, cy, fl < 0.12 ? K.white : 0);
    if (fl >= 0.12) {
      for (let i = 0; i < Math.floor(wear * 5); i++) { const a = (b.chassis * 2.1 + i * 1.9) % TAU; FB.put(cx + Math.round(Math.cos(a) * 3), cy - 5 + Math.round(Math.sin(a) * 2), K.joint); } // dents
      if (wear > 0.7) { FB.put(cx + 1, cy - 13, K.joint); FB.put(cx, cy - 12, K.joint); FB.put(cx + 1, cy - 11, K.joint); } // cracked head
    }
  }
  // Facing: the single most important mark (4.2.4). Nose vector 1.5 × body width (4.2.2) from the charge ring out,
  // two pixels wide, drawn over everything so the tip clears the sprite in every direction.
  function drawNose(s) {
    const b = s.body;
    if (!b.alive) return;
    const cx = b.x / U, cy = b.y / U - bodyLift(s), ca = Math.cos(b.facing), sa = Math.sin(b.facing), pts = [];
    const add = (x0, y0, x1, y1) => PIX.line(x0, y0, x1, y1, (x, y) => { pts.push([x, y]); pts.push([x + Math.round(-sa), y + Math.round(ca)]); });
    const len = 1.5 * 2 * s.P['body.radius'] / U, tx = cx + ca * len, ty = cy + sa * len;
    add(cx + ca * 11, cy + sa * 11, tx, ty);
    for (const sg of [-1, 1]) add(tx, ty, tx - ca * 5 - sa * sg * 4, ty - sa * 5 + ca * sg * 4);
    for (const [x, y] of pts) FB.put(x, y, K.nose);
  }
  function drawCarSprite(s, c) {
    const S = carSpr(s, c, c._brk), cx = c.x / U, cy = c.y / U;
    const pulse = app.realT - (fx.carPulse.has(c.id) ? fx.carPulse.get(c.id) : -9);
    PIX.blit(FB, S, cx, cy, pulse < 0.12 ? K.white : 0);
    c._top = Math.round(cy) + S.top;
    const hgt = EXT(s.P['vehicles.' + c.cls + '.height']), ca = Math.cos(c.h), sa = Math.sin(c.h);
    const roof = (u, v) => [Math.round(cx + (u * ca - v * sa) / U), Math.round(cy - hgt + (u * sa + v * ca) / U)];
    const sig = s.signalSide(c), blink = c.honking ? Math.floor(app.realT * 5) % 2 === 0 : sig && Math.floor(app.realT * 3) % 2 === 0;
    if (blink) for (const sd of c.honking ? [-1, 1] : [sig]) for (const u of [c.L / 2 - 3, -c.L / 2 + 3]) { const [x, y] = roof(u, sd * (c.W / 2 - 2)); FB.rect(x - 1, y - 1, x, y, K.amber); }
    if (c.v < -1) for (const sd of [-1, 1]) { const [x, y] = roof(-c.L / 2 + 1, sd * (c.W / 2 - 5)); FB.put(x, y, K.white); }
  }
  // Roof marks (4.2.2): state pip and spent slash, drawn after every sprite so nothing occludes them.
  function pip(Bf, cue, cx, cy, loc, f, side) {
    if (cue === 'committed' || cue === 'expiring') {
      PIX.disc(cx, cy, 3, (x, y) => Bf.put(x, y, K.white));
      for (const [x, y, a] of PIX.circle(3)) if ((a + Math.PI / 2) % TAU <= f * TAU + 1e-6) Bf.put(cx + x, cy + y, K.roofInk);
    } else if (cue === 'intention') {
      const pts = side ? [[-6, -side * 2], [0, side * 6], [6, -side * 2]] : [[-3, -6], [4, 0], [-3, 6]];
      PIX.polyline(pts.map(([u, v]) => loc(u, v)), (x, y) => Bf.put(x, y, K.roofLabel));
    } else if (cue === 'caution') {
      PIX.polyline([[cx, cy - 4], [cx + 4, cy + 3], [cx - 4, cy + 3], [cx, cy - 4]], (x, y) => Bf.put(x, y, K.roofLabel));
      Bf.put(cx, cy - 1, K.roofLabel); Bf.put(cx, cy, K.roofLabel); Bf.put(cx, cy + 2, K.roofLabel);
    } else if (cue === 'interrupted') {
      PIX.stamp(Bf, PIX.circle(5).filter((p) => Math.floor(p[2] / (TAU / 12)) % 2 === 0).map((p) => [cx + p[0], cy + p[1]]), K.warn, K.roofInk);
      Bf.put(cx, cy - 2, K.roofInk); Bf.put(cx, cy - 1, K.roofInk); Bf.put(cx, cy, K.roofInk); Bf.put(cx, cy + 2, K.roofInk);
    }
  }
  function drawCarMarks(s, c) {
    const P = s.P, hgt = EXT(P['vehicles.' + c.cls + '.height']), ca = Math.cos(c.h), sa = Math.sin(c.h);
    const lf = c._lift || 0, loc = (u, v) => [c.x / U + (u * ca - v * sa) / U, c.y / U - hgt - lf + (u * sa + v * ca) / U];
    if (c.spent) { const a = loc(-c.L / 2 + 6, c.W / 2 - 3), e = loc(c.L / 2 - 6, -c.W / 2 + 3); PIX.line(a[0], a[1], e[0], e[1], (x, y) => { FB.put(x, y, K.roofInk); FB.put(x, y + 1, K.roofInk); }); }
    const cue = s.carCue(c);
    let f = 1, side = 0;
    if (cue === 'expiring') f = Math.max(0, (c.man.until - s.t) / (P['movement.lungeDuration'] + P['movement.lungeRecovery']));
    if (cue === 'intention') { if (!c.intent) return; side = c.intent.type === 'shift' ? Math.sign(c.intent.d1 - c.intent.d0) : 0; }
    pip(FB, cue, Math.round(c.x / U), Math.round(c.y / U) - hgt - lf, loc, f, side);
  }
  // Model ID tag: three characters in the field label face (6-art-px caps = ui.typeFieldLabel 12 units, Edit 39);
  // seniority as square pips beside it. Half the old 24-unit tag: the laptop sits at arm's length (decision 121).
  function tagRect(c) {
    const id = shortId(c.model), w = PIX.smallWidth(id) + 5, h = PIX.SMALL_H + 4;
    const top = c._top != null ? c._top : Math.round(c.y / U) - 12 - (c._lift || 0);
    return { id, w, h, x0: clamp(Math.round(c.x / U) - (w >> 1), 1, AW - w - 1), y0: clamp(top - 2 - h, 1, AH - h - 1) };
  }
  function drawTag(s, c) {
    const { id, w, h, x0, y0 } = tagRect(c);
    FB.rect(x0 + 1, y0 + 1, x0 + w - 2, y0 + h - 2, c.spent ? K.tagSpentFill : K.tagFill);
    for (let x = x0 + 1; x < x0 + w - 1; x++) { FB.put(x, y0, K.tagBorder); FB.put(x, y0 + h - 1, K.tagBorder); }
    for (let y = y0 + 1; y < y0 + h - 1; y++) { FB.put(x0, y, K.tagBorder); FB.put(x0 + w - 1, y, K.tagBorder); }
    PIX.smallText(FB, id, x0 + 3, y0 + 2, c.spent ? K.tagSpentInk : K.tagInk);
    let rx = x0 + w + 1;
    if (s.P['proto.learningEnabled']) for (let j = 0; j < seniorityOf(c); j++) { FB.rect(rx, y0 + 4, rx + 1, y0 + 5, K.ink); rx += 3; }
    if (c.honking) {
      if (Math.floor(app.realT * 5) % 2 === 0) {
        FB.rect(rx, y0, rx + 4, y0 + h - 1, K.tagBorder); FB.rect(rx + 1, y0 + 1, rx + 3, y0 + h - 2, K.tagFill);
        PIX.smallText(FB, '!', rx + 2, y0 + 2, K.tagInk);
      }
      const last = fx.horn.get(c.id) || 0; if (c.honkAt === 'body' && app.realT - last > 1.4) { horn(); fx.horn.set(c.id, app.realT); }
    }
  }
  function drawDrone(s, d) {
    const x = Math.round(d.x / U), y = Math.round(d.y / U - d.alt * 4);
    if (d.state === 'carry' && s.cones.some((c) => c.id === d.cone)) { PIX.line(x, y, x - 2, y + 9, (px, py) => FB.put(px, py, K.label)); PIX.blit(FB, PIX.CONE, x - 2, y + 13); }
    PIX.blit(FB, PIX.DRONE, x, y);
    FB.put(x, y - 1, Math.floor(app.realT * 4) % 2 ? K.warn : K.podCrown);
    for (const [rx, ry] of [[-7, -4], [7, -4], [-7, 4], [7, 4]]) { const a = app.realT * 40 + rx; FB.put(Math.round(x + rx + Math.cos(a) * 2), Math.round(y + ry + Math.sin(a) * 1.2), K.ink); }
  }
  // A flyover (Edit 43, 44): its columns from the ground up, then the deck layer (deck, boom, lights, shadows, the cues when the
  // dummy is up here, its actors) drawn on the footprint and lifted by its level's height × proto.art.extrusion (Z1 18 art px,
  // Z2 32), then its stairs (from the ground, and link stairs up to platform roofs) and a dummy climbing them.
  function drawDeck(s, d, k, cues, la) {
    const P = s.P, half = P['world.deckWidth'] / 2, b = s.body, still = cues === false, lift = d.ext, top = Math.round((d.dk.off - half) / U);
    for (const c of la.cols) if (Math.abs(c.st.y + c.st.h / 2 - d.dk.off) < half) PIX.blit(FB, c.spr, Math.round(c.st.x / U), Math.round(c.st.y / U));
    DL.d.fill(0); FB = DL;
    PIX.blit(FB, d.S, 0, top);
    (s.level.checkpoints || []).forEach((cp, i) => { if (cp.deck && cp.off === d.dk.off) drawBoom(s, cp, i); }); // the deck's own checkpoint
    const cars = still ? [] : s.cars.filter((c) => lay(c) >= 1 && c.deckIdx === k), mine = !still && onDeck(s) && bodyFloor(s).deck === k;
    if (!still) {
      drawLights(s, cars);
      for (const c of cars) carShadow(s, c);
      if (mine) { const o = P['proto.art.dummyHeight'] * P['proto.art.shadowScale']; PIX.ellipse((b.x + PIX.SUN.x * o) / U, b.y / U + 3, 5.5, 2.2, (x, y) => FB.shade(x, y, 0.72)); }
      if (cues) cues();
      if (mine) drawBodyGround(s);
      const list = cars.map((c) => [c.y + Math.abs(Math.sin(c.h)) * c.L / 2 + Math.abs(Math.cos(c.h)) * c.W / 2, () => drawCarSprite(s, c)]);
      if (mine) list.push([b.y + P['body.radius'], () => drawBodySprite(s)]);
      list.sort((p, q) => p[0] - q[0]); for (const it of list) it[1]();
    }
    FB = MAIN;
    const y0 = Math.max(0, top - PIX.LAMP_H), y1 = Math.min(AH - 1, top + d.S.h - PIX.LAMP_H); // composite the layer, lifted
    for (let y = y0; y <= y1; y++) { const ty = y - lift; if (ty < 0 || ty >= AH) continue; for (let x = 0; x < AW; x++) { const c = DL.d[y * AW + x]; if (c) MAIN.d[ty * AW + x] = c; } }
    for (const c of cars) { c._lift = lift; if (c._top != null) c._top -= lift; }
    if (mine && b._sy != null) b._sy -= lift;
    for (const u of d.up || []) PIX.blit(FB, u.spr, Math.round(u.st.x / U), Math.round(u.st.y / U));
    if (!still && b.alive && b.stair && stairDeck(s, b.stair) === k) { const L = bodyLift(s); drawBodyGround(s, L); drawBodySprite(s, false, L); }
  }
  // Car lights (Edit 43). Headlight beams follow the route ahead for proto.art.beamLength and reach the screen before the car
  // does; the dummy and other cars in a beam cast its shadow. Braking washes the ground behind red (proto.art.brakeLength).
  // Colour math on whole pixels, three bands of falloff, drawn under every cue.
  function drawLights(s, cars) {
    const P = s.P, len = P['proto.art.beamLength'], day = PIX.NAME === 'day' ? 0.45 : 1, aB = P['proto.art.beamAlpha'] * day, aR = P['proto.art.brakeAlpha'] * day, b = s.body, br = P['body.radius'];
    for (const c of cars) {
      const ca = Math.cos(c.h), sa = Math.sin(c.h), nx = c.x + ca * c.L / 2, ny = c.y + sa * c.L / 2;
      const occ = [];
      if (b.alive && s.meets(c)) occ.push([b.x, b.y, br]);
      for (const o of cars) if (o !== c && Math.hypot(o.x - nx, o.y - ny) < len + o.L) occ.push([o.x, o.y, o.W / 2]);
      const left = [], right = [];
      for (let k = 0; k <= 8; k++) {
        const sv = c.s + c.L / 2 + len * k / 8, p = pathAt(c.path, sv), dd = s.plannedD(c, sv), hw = c.W / 2 - 4 + len * 0.2 * k / 8;
        left.push([(p.x + p.nx * (dd - hw)) / U, (p.y + p.ny * (dd - hw)) / U]); right.push([(p.x + p.nx * (dd + hw)) / U, (p.y + p.ny * (dd + hw)) / U]);
      }
      const R = len / U;
      PIX.fillPoly(left.concat(right.reverse()), (x, y) => {
        const dx = x + 0.5 - nx / U, dy = y + 0.5 - ny / U, dist = Math.hypot(dx, dy), t = dist / R;
        if (t > 1) return;
        for (const [ox, oy, orr] of occ) { // shadow: an occluder nearer the lamp on this ray
          const qx = ox / U - nx / U, qy = oy / U - ny / U, along = (qx * dx + qy * dy) / (dist || 1);
          if (along > 0 && along < dist && Math.abs(qx * dy - qy * dx) / (dist || 1) < orr / U) return;
        }
        FB.mix(x, y, K.beam, aB * (t < 0.33 ? 1 : t < 0.66 ? 0.6 : 0.3));
      });
      if (c._brk && c.v > 1) {
        const bl = P['proto.art.brakeLength'], pts = [[-c.L / 2, -c.W / 2 - 2], [-c.L / 2, c.W / 2 + 2], [-c.L / 2 - bl, c.W / 2 + 8], [-c.L / 2 - bl, -c.W / 2 - 8]].map(([u, v]) => [(c.x + u * ca - v * sa) / U, (c.y + u * sa + v * ca) / U]);
        PIX.fillPoly(pts, (x, y) => { const u = ((x + 0.5) * U - c.x) * ca + ((y + 0.5) * U - c.y) * sa, t = clamp((-c.L / 2 - u) / bl, 0, 1); FB.mix(x, y, K.brakeGlow, aR * (t < 0.4 ? 1 : t < 0.75 ? 0.55 : 0.25)); });
      }
    }
  }
  // Checkpoint boom (Edit 42): a striped arm across both lanes from the booth's side. It swings up for a car.
  function drawBoom(s, cp, i) {
    const P = s.P, lw = P['world.laneWidth'], p = s.boomPoint(cp), lift = (s.booms && s.booms[i]) || 0, th = lift * Math.PI / 2 * 0.92;
    const hz = cp.side === 'N' || cp.side === 'S'; // the arm runs along x when the road leaves north or south
    const px = (hz ? p.x + lw : p.x) / U, py = (hz ? p.y : p.y + lw) / U - 3, L = 2 * lw / U * Math.cos(th), up = 2 * lw / U * Math.sin(th) * 0.6;
    const tx = hz ? px - L : px, ty = (hz ? py : py - L) - up;
    FB.rect(Math.round(px) - 1, Math.round(py), Math.round(px), Math.round(py) + 4, K.bldgOutline);
    PIX.line(px, py, tx, ty, (x, y, j) => { const c = Math.floor(j / 3) % 2 ? K.white : K.bldgOutline; FB.put(x, y, c); FB.put(x, y + 1, K.bldgOutline); }); // white and black: red is the warning alone
  }
  function drawSprites(s, la, still, deckCues) { // depth-sorted by the ground line of each object
    const list = [], b = s.body, P = s.P, fl = s.level.floors || [], r = P['body.radius'];
    for (const o of la.statics) list.push([o.st.y + o.st.h, () => PIX.blit(FB, o.spr, Math.round(o.st.x / U), Math.round(o.st.y / U))]);
    (la.decks || []).forEach((d, k) => { d.up = la.up.filter((u) => stairDeck(s, u.st) === k); list.push([d.dk.hz ? d.dk.off + P['world.deckWidth'] / 2 : P['world.height'] + d.dk.height / 1000, () => drawDeck(s, d, k, still ? false : (cueDeck(s) === k ? deckCues : null), la)]); }); // flyovers sort by their south edge
    for (const u of la.up) if (stairDeck(s, u.st) == null) list.push([u.st.y + u.st.h + 0.25, () => PIX.blit(FB, u.spr, Math.round(u.st.x / U), Math.round(u.st.y / U))]); // Edit 44: platform stairs, after their building
    for (const g of la.bridges || []) list.push([g.key, () => PIX.blit(FB, g.spr, Math.round(g.f.x / U), Math.round(g.f.y / U))]);
    (s.level.checkpoints || []).forEach((cp, i) => { if (!cp.deck) list.push([s.boomPoint(cp).y + 2, () => drawBoom(s, cp, i)]); });
    for (const cn of s.cones) if (cn.state === 'free' || cn.state === 'flight') list.push([cn.y + 6, () => PIX.blit(FB, PIX.CONE, cn.x / U, (cn.y - coneLift(cn) * 1.2) / U)]);
    if (!still) {
      for (const c of s.cars) if (lay(c) === 0) list.push([c.y + Math.abs(Math.sin(c.h)) * c.L / 2 + Math.abs(Math.cos(c.h)) * c.W / 2, () => drawCarSprite(s, c)]);
      if (b.alive) { // the dummy, unless its deck draws it: on the ground or falling by its feet; on a roof or skybridge after it; on a platform stair after the flight
        const L = () => bodyLift(s), me = () => { const l = L(); if (l) drawBodyGround(s, l); drawBodySprite(s, false, l); }, f = bodyFloor(s);
        if (b.stair) { if (stairDeck(s, b.stair) == null) list.push([b.stair.y + b.stair.h + 0.26, me]); }
        else if (b.mode === 'drop') { const over = s.level.statics.find((q) => q.kind === 'block' && b.x > q.x - r && b.x < q.x + q.w + r && b.y > q.y - r && b.y < q.y + q.h + r); list.push([Math.max(b.y + r, over ? over.y + over.h + 0.6 : -1), me]); } // still over the roof it left: drawn above it
        else if (b.level === 0) list.push([b.y + r, () => drawBodySprite(s, false, 0)]);
        else if (f && f.kind === 'roof') list.push([f.by + f.bh + 0.6, me]);
        else if (f && f.kind === 'bridge') { const g = (la.bridges || []).find((q) => q.i === b.floor); list.push([(g ? g.key : f.y + f.h) + 0.1, me]); }
      }
    }
    list.sort((a, b2) => a[0] - b2[0]);
    for (const it of list) it[1]();
    if (!still) { // x-ray pass: a checker of each actor's own pixels, so an occluded car or dummy still reads (4.2.4 tier 1)
      for (const c of s.cars) ghost(carSpr(s, c, c._brk), c.x / U, c.y / U - (c._lift || 0));
      if (b.alive && b._spr) ghost(b._spr, b._sx, b._sy);
    }
  }
  function ghost(S, ax, ay) {
    const x0 = Math.round(ax) - S.ox, y0 = Math.round(ay) - S.oy;
    for (let j = 0; j < S.h; j++) for (let i = 0; i < S.w; i++) { const c = S.d[j * S.w + i]; if (c && ((x0 + i + y0 + j) & 1) === 0) FB.put(x0 + i, y0 + j, c); }
  }
  function drawEffects(s, popups) { // popups: second pass, above tags, so the value is never covered
    for (const e of s.effects) {
      if (e._w == null) e._w = app.realT;
      const age = app.realT - e._w, cf = e._cfg || {}, ry = cf.rays, pu = cf.popup;
      const rayDur = ry ? Math.max(0.1, jv(ry.v.seconds, ry.k)) : 0.9, popDur = pu ? Math.max(0.2, jv(pu.v.seconds, pu.k)) : 0.9;
      const ex = e.x / U, ey = e.y / U - zLift(s, e.layer);
      if (e.type === 'burst' && age < Math.max(rayDur, popDur)) {
        const big = Math.min(1, e.v / 500);
        if (!popups && age < rayDur) { // impact burst (4.2.2): radial rays at the contact
          const k = Math.min(1, age / (rayDur * 0.4)), n = ry ? Math.max(4, Math.round(jv(ry.v.count, ry.k))) : 10, len = ry ? jv(ry.v.length, ry.k) : 8 + 18 * big;
          for (let i = 0; i < n; i++) {
            const a = i * TAU / n + (n % 2 ? 0 : 0.1), r0 = (6 + 14 * k) / U, r1 = r0 + len * (i % 2 ? 0.7 : 1) / U;
            PIX.line(ex + Math.cos(a) * r0, ey + Math.sin(a) * r0, ex + Math.cos(a) * r1, ey + Math.sin(a) * r1, (x, y, j) => { if (age < rayDur * 0.5 || j % 2 === 0) FB.put(x, y, K.ink); });
          }
          if (age < 0.09) PIX.disc(ex, ey, Math.round((12 + 14 * big) / U), (x, y) => FB.put(x, y, K.white));
        }
        if (popups && age < popDur) { // value popup at ui.typeLoadBearing, white-outlined
          const sc = age < 0.12 ? 2 : 1, label = '+' + num(e.v), w = PIX.textWidth(label, sc);
          const rise = (pu ? jv(pu.v.rise, pu.k) : 30 * popDur) * Math.min(1, age / popDur);
          const bd = s.body, axp = bd.alive ? bd.x / U : ex, ayp = bd.alive ? bd.y / U - 16 - bodyLift(s) : ey; // beside the dummy's head, away from the car and its tag
          const x = clamp(axp + (cf.nx || 0) * (w / 2 + 8) - w / 2, 2, AW - w - 2), y = clamp(ayp - rise / U - PIX.FONT_H * sc, 2, AH - PIX.FONT_H * sc - 2);
          if (age < popDur * 0.8 || Math.floor(app.realT * 20) % 2) {
            PIX.text(FB, label, x, y, K.popInk, K.popOutline, sc);
            if (e.mult > 1) { const t2 = 'HIGHWAY X' + e.mult, w2 = PIX.smallWidth(t2), x2 = clamp(x + w / 2 - w2 / 2, 2, AW - w2 - 2), y2 = y + PIX.FONT_H * sc + 2; FB.rect(x2 - 1, y2 - 1, x2 + w2, y2 + PIX.SMALL_H, K.popOutline); PIX.smallText(FB, t2, x2, y2, K.popInk); } // P5 (Edit 50): damage.deckMultiplier
          }
        }
      } else if (popups) continue;
      else if (e.type === 'touch' && age < 0.5) {
        for (const p of PIX.circle((6 + age * 20) / U)) if (age < 0.25 || p[2] * 6 % 1 < 0.5) FB.put(Math.round(ex) + p[0], Math.round(ey) + p[1], K.label);
      } else if (e.type === 'wreck' && age < 1.6) {
        for (let i = 0; i < 9; i++) {
          if (age > 1.1 && (i + Math.floor(app.realT * 12)) % 2) continue;
          const a = i * 0.7 + 0.3, d = (6 + age * (40 + i * 6)) / U, x = Math.round(ex + Math.cos(a) * d), y = Math.round(ey + Math.sin(a) * d);
          FB.rect(x - 1, y, x + 1, y + 1, i % 3 === 0 ? K.joint : K.dummy);
        }
      }
    }
  }
  function drawRingsStreaks() { // P2.1 hit juice, matte ink, whole pixels
    const now = app.realT;
    fx.rings = fx.rings.filter((r) => now - r.t0 < r.dur);
    for (const r of fx.rings) {
      const u = (now - r.t0) / r.dur, rad = r.r * (0.25 + 0.75 * (1 - Math.pow(1 - u, 3))) / U, col = roleK(r.role, K.ink);
      for (const p of PIX.circle(rad)) if (u < 0.5 || Math.floor(p[2] * 8) % 2 === 0) FB.put(Math.round(r.x / U) + p[0], Math.round(r.y / U) + p[1], col);
    }
    fx.streaks = fx.streaks.filter((st) => now - st.t0 < st.dur);
    for (const st of fx.streaks) {
      const u = (now - st.t0) / st.dur, cx = Math.cos(st.dir), cy = Math.sin(st.dir), px = -cy, py = cx, col = roleK(st.role, K.label);
      for (const ln of st.lines) {
        const s0 = 10 + ln.lag + u * 26, x0 = st.x + px * ln.off + cx * s0, y0 = st.y + py * ln.off + cy * s0, L = ln.len * (1 - u * 0.5);
        PIX.line(x0 / U, y0 / U, (x0 + cx * L) / U, (y0 + cy * L) / U, (x, y) => FB.put(x, y, col));
      }
    }
  }
  const ROLE_K = { primary: 'ink', secondary: 'label', warning: 'warn', dummy: 'dummy', joints: 'joint', structure: 'structure', fleet: 'fleet', aqua: 'podCrown' };
  function roleK(r, fb) { return (r && K[ROLE_K[r] || r]) || fb; }
  function lowHealth(key, fallback) { const st = CJ && CJ.states && CJ.states.lowHealth; return st && st[key] ? jv(st[key]) : fallback; }
  function drawParts(s) {
    const b = s.body, P = s.P, now = app.realT;
    if (b.alive && s.phase === 'play') {
      const wear = 1 - b.health / P['damage.bodyHealth'];
      if (wear > lowHealth('smokeFrom', 0.45) && now - fx.smokeT > 0.32 - wear * 0.15) { fx.smokeT = now; puff(b.x, b.y - 20, 1, { type: 'smoke', dir: -2.36, spread: 0.6, speed: 18, life: 1.1, size: 4 + 4 * wear }); }
      if (wear > lowHealth('sparkFrom', 0.7) && Math.random() < 0.05) puff(b.x, b.y - 10, 3, { type: 'spark', speed: 110, life: 0.25, size: 1.6 });
    }
    const dt = Math.min(0.05, now - (fx.lastPartT || now)); fx.lastPartT = now;
    fx.parts = fx.parts.filter((p) => now - p.t0 < p.life);
    for (const p of fx.parts) {
      const a = (now - p.t0) / p.life, col = p.role ? roleK(p.role, null) : null;
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.93; p.vy *= 0.93;
      const x = Math.round(p.x / U), y = Math.round(p.y / U), r = Math.max(0, Math.round(p.size * (1 + a * 1.5) / U / 2));
      if (p.type === 'dust') mixRect(x - r, y - r, x + r, y + r, col || K.fleet, 0.4 * (1 - a));
      else if (p.type === 'smoke') mixRect(x - r - 1, y - r - 1, x + r + 1, y + r + 1, col || K.label, 0.35 * (1 - a));
      else if (p.type === 'debris') { if (a < 0.7 || Math.floor(now * 15) % 2) FB.rect(x - 1, y, x + 1, y, col || K.dummy); }
      else if (p.type === 'ring') { for (const q of PIX.circle(p.size * (1 + a * 2) / U)) if (a < 0.5 || q[2] * 5 % 1 < 0.5) FB.put(x + q[0], y + q[1], col || K.label); }
      else PIX.line(x, y, (p.x - p.vx * 0.03) / U, (p.y - p.vy * 0.03) / U, (px, py) => FB.put(px, py, col || (a < 0.5 ? K.dummyL : K.dummy)));
    }
  }
  function mixRect(x0, y0, x1, y1, c, a) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) FB.mix(x, y, c, a); }
  function drawStamp(s) {
    const sa = app.realT - fx.stampT0, dur = (CJ && CJ.writeOff ? jv(CJ.writeOff) : 1.1) + 0.2;
    if (sa >= dur || (dur - sa < 0.25 && Math.floor(app.realT * 20) % 2)) return;
    const sc = sa < 0.15 ? 2 : 1, label = 'WRITTEN OFF', w = PIX.textWidth(label, sc) + 10 * sc, h = (PIX.FONT_H + 10) * sc;
    const wr = s.effects.find((e) => e.type === 'wreck'), cx = wr ? wr.x / U : AW / 2, cy = wr ? wr.y / U - 32 - zLift(s, wr.layer) : AH / 2;
    const x0 = Math.round(clamp(cx - w / 2, 3, AW - w - 3)), y0 = Math.round(clamp(cy - h / 2, 3, AH - h - 3));
    FB.rect(x0 - 1, y0 - 1, x0 + w, y0 + h, K.stampOutline); FB.rect(x0, y0, x0 + w - 1, y0 + h - 1, K.warn); FB.rect(x0 + 2 * sc, y0 + 2 * sc, x0 + w - 1 - 2 * sc, y0 + h - 1 - 2 * sc, K.stampFill);
    PIX.text(FB, label, x0 + 5 * sc, y0 + 5 * sc, K.warn, K.stampOutline, sc);
  }
  function drawLive(s, la) {
    const P = s.P, b = s.body;
    for (const c of s.cars) { c._brk = (c.man && c.man.type === 'brake') || c.state === 'interrupted' || (c._pv != null && c.v < c._pv - 0.4); c._pv = c.v; markCar(c, c._brk); }
    drawMarks();
    for (const c of s.cars) c._lift = 0;
    drawLights(s, s.cars.filter((c) => lay(c) === 0)); // ground traffic; deck traffic lights its own deck (drawDeck)
    const inCone = coneFn(s), lvl = cueLevel(s), dq = cueDeck(s), mine = s.cars.filter((c) => lay(c) === lvl && (lvl === 0 || c.deckIdx === dq)); // Edit 42, 44: cues for cars that can meet the dummy
    const cues = () => {
      if (b.alive || P['proto.zonesEverywhere']) for (const c of mine) drawZones(s, c, P['proto.zonesEverywhere'] ? ALL : inCone);
      if (b.alive || P['proto.pathsEverywhere']) for (const c of mine) drawPath(s, c, P['proto.pathsEverywhere'] ? ALL : inCone);
      if (b.alive) { for (const c of mine) drawStopCue(s, c); drawViewEdges(s); }
    };
    if (lvl === 0) cues(); // on a deck they are drawn on its surface (drawDeck); a roof has no traffic
    dynShadows(s);
    if (onGroundDraw(s)) drawBodyGround(s);
    drawSprites(s, la, false, lvl > 0 ? cues : null);
    if (b.alive && b.held) { const p = s.releasePoint(); PIX.blit(FB, PIX.CONE, p.x / U, p.y / U - 4); }
    for (const c of mine) drawCarMarks(s, c);
    drawNose(s);
    drawEffects(s); drawRingsStreaks(); drawParts(s);
    for (const d of s.drones) drawDrone(s, d);
    for (const c of mine) drawTag(s, c);
    drawBarks(s);
    drawEffects(s, true);
    const fa = app.realT - fx.flash.t0;
    if (fa < fx.flash.dur) { const a = 0.55 * (1 - fa / fx.flash.dur) * (RM ? 0.4 : 1); for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) FB.mix(x, y, K.white, a); }
    drawStamp(s);
    if (b.alive) { // low health: a pulsing warning band on the field edge (colour math, whole pixels)
      const wear = 1 - b.health / P['damage.bodyHealth'], vf = lowHealth('vignetteFrom', 0.7);
      if (wear > vf) {
        const pulse = (0.5 + 0.5 * Math.sin(app.realT * 6)) * (wear - vf) / Math.max(0.05, 1 - vf), band = 8;
        for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) {
          const d = Math.min(x, y, AW - 1 - x, AH - 1 - y); if (d >= band) { x = AW - 1 - band; continue; }
          if ((x + y) % 2 === 0 || d < 3) FB.mix(x, y, K.warn, (0.12 + 0.3 * pulse) * (1 - d / band));
        }
      }
    }
  }
  // D24 screen flip: the old screen slides out as the new one slides in (world.flipSeconds; play is paused).
  const prevFB = new Uint32Array(AW * AH), scrollBuf = new Uint32Array(AW * AH);
  let prevOk = false;
  function composeScroll(s) {
    const sd = s.district.lastFlip.side, f = clamp(1 - s.phaseT / s.P['world.flipSeconds'], 0, 1), k = (1 - Math.cos(Math.PI * f)) / 2;
    const old = prevFB, nw = FB.d, out = scrollBuf;
    if (sd === 'E' || sd === 'W') {
      const o = Math.round(k * AW);
      for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) { const sx = sd === 'E' ? x + o : x - o; out[y * AW + x] = sx >= 0 && sx < AW ? old[y * AW + sx] : nw[y * AW + (sd === 'E' ? sx - AW : sx + AW)]; }
    } else {
      const o = Math.round(k * AH);
      for (let y = 0; y < AH; y++) { const sy = sd === 'S' ? y + o : y - o; for (let x = 0; x < AW; x++) out[y * AW + x] = sy >= 0 && sy < AH ? old[sy * AW + x] : nw[(sd === 'S' ? sy - AH : sy + AH) * AW + x]; }
    }
    nw.set(out);
  }
  function drawField(s, still) {
    const la = levelArt(s), scroll = !still && s.phase === 'scroll' && s.district && s.district.lastFlip;
    FB.copyFrom(la.ground);
    if (still || scroll) { drawSprites(s, la, true); if (scroll && s.body.alive) drawBodySprite(s); } else drawLive(s, la);
    if (scroll && prevOk) composeScroll(s); else if (!still) { prevFB.set(FB.d); prevOk = true; }
    flush();
    const sh = still ? { x: 0, y: 0 } : shakeOffset(), ox = Math.round(sh.x / RA) * RA, oy = Math.round(sh.y / RA) * RA;
    ctx.save(); ctx.beginPath(); ctx.rect(FX, FY, FW, FH); ctx.clip();
    ctx.fillStyle = PIX.PAL.grass; ctx.fillRect(FX, FY, FW, FH);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(art, FX + ox, FY + oy, FW, FH);
    ctx.restore();
    if (!still) drawFieldHD(s);
  }
  // Frame-layer messages over the field: road intro and toasts, at ui.typeSecondary.
  function drawFieldHD(s) {
    const P = s.P;
    if (s.t < 4 && s.phase === 'play') {
      const iv = { road: s.roadIndex + 1, roads: s.list.length, roadName: INFO(s.levelId).name, quota: s.quota, difficulty: s.difficulty, health: P['damage.bodyHealth'] };
      const intro = CI && CI.copy && CI.copy.intro;
      const msg = s.isCity ? 'District ' + iv.road + ' of ' + iv.roads + ': ' + iv.roadName + '. ' + (place('districts.' + s.levelId + '.intro') || INFO(s.levelId).blurb) + ' Write-offs required: ' + iv.quota + '.'
        : (intro ? fillIn(intro[0], iv) : 'Road ' + iv.road + ' of ' + iv.roads + ': ' + iv.roadName + '. Write-offs required: ' + iv.quota + '.') +
        (s.district ? ' ' + s.district.cols * s.district.rows + ' screens: walk off a marked edge to explore.' : '');
      const lines = wrapLines(msg, FW - 88, fLab), h = 22 + lines.length * 30;
      ctx.globalAlpha = Math.min(1, (4 - s.t) / 0.6);
      rr(FX + 20, FY + 16, FW - 40, h, 12); ctx.fillStyle = FT.banner; ctx.fill(); ctx.strokeStyle = FT.edge; ctx.lineWidth = 1.5; ctx.stroke();
      lines.forEach((l, i) => txt(l, FX + FW / 2, FY + 16 + 38 + i * 30, fLab, FT.text, 'center'));
      ctx.globalAlpha = 1;
    }
    if (app.toast && app.realT - app.toast.t < 1.6) {
      ctx.globalAlpha = Math.min(1, 3 * (1.6 - (app.realT - app.toast.t)));
      const lines = wrapLines(app.toast.msg, FW - 88, fLab), h = 22 + lines.length * 30;
      rr(FX + 20, FY + FH - 16 - h, FW - 40, h, 12); ctx.fillStyle = FT.toast; ctx.fill();
      lines.forEach((l, i) => txt(l, FX + FW / 2, FY + FH - 16 - h + 38 + i * 30, fLab, '#FFFFFF', 'center'));
      ctx.globalAlpha = 1;
    }
  }

  // ---------- frame + essentials HUD (V29 D10.3: only facts the player acts on, at registry type size)
  function roadLabel(id) { const d = !!DISTRICTS[id]; return (d ? '' : 'ROAD ') + ((d ? LEVEL_LIST : window.DUMMIES.ROADS).indexOf(id) + 1) + ' · ' + INFO(id).name.replace(/^L\d+\s*/, '').replace('Central Business District', 'CBD').toUpperCase(); }
  function drawFrame() {
    const g = ctx.createLinearGradient(0, 0, 0, VH);
    g.addColorStop(0, FT.bg[0]); g.addColorStop(0.5, FT.bg[1]); g.addColorStop(1, FT.bg[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
    for (const [gx, gy, gr, gc] of [[1140, 20, 300, FT.glow], [120, 700, 320, FT.glow2]]) {
      if (!gc) continue;
      const o = ctx.createRadialGradient(gx, gy, 10, gx, gy, gr); o.addColorStop(0, gc); o.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = o; ctx.fillRect(0, 0, VW, VH);
    }
    if (FT.neon) { ctx.save(); ctx.shadowColor = FT.brand; ctx.shadowBlur = 14; }
    txt('FARSIGHT', 24, TOPY + 1, '900 30px ' + F_BRAND, FT.brand);
    if (FT.neon) ctx.restore();
    const s = app.sim;
    if (app.screen === 'title' || !s) txt('SELECT A DISTRICT', FX + FW / 2, TOPY - 3, fLab, FT.dim, 'center');
    else drawTopBar(s);
    ctx.save(); ctx.shadowColor = 'rgba(16,40,56,0.22)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
    rr(FX - 6, FY - 6, FW + 12, FH + 12, 10); ctx.fillStyle = FT.bezel; ctx.fill(); ctx.restore();
    rr(FX - 6.5, FY - 6.5, FW + 13, FH + 13, 10); ctx.strokeStyle = FT.edge; ctx.lineWidth = 1.5; ctx.stroke();
    if (s && app.screen === 'game' && !app.paused && s.phase === 'play') { // controls only while they apply
      const keys = [['WASD', 'MOVE'], ['SPACE', 'DASH']];
      if (s.has('carry') || s.has('throw')) keys.push(['K', 'CONE']);
      drawKeys(keys, FX + FW / 2, FY + FH + 4);
    }
  }
  // Top bar: where you are and how the shift stands. Cars left is the shift's clock.
  function drawTopBar(s) {
    const r = s.run, left = Math.max(0, s.schedule.length - (r.admitted - s.cars.filter((c) => !c.deck).length)); // deck traffic is off the shift's clock
    const b = s.body, f = bodyFloor(s), where = !b.alive || b.level === 0 && !b.stair ? '' : b.stair ? ' · STAIRS' : b.mode === 'drop' ? ' · FALLING' : ' · Z' + b.level + ' ' + (f && f.kind === 'roof' ? 'ROOF' : f && f.kind === 'bridge' ? 'BRIDGE' : 'HIGHWAY'); // Edit 44
    const items = [[null, roadLabel(s.level.id) + (s.district ? ' · ' + s.screenName() : '') + where], ['WRITE-OFFS', r.writeOffs + ' / ' + s.quota], ['POINTS', num(r.points)], ['CARS LEFT', String(left)]];
    const w = items.map(([k, v]) => { ctx.font = fLab; const kw = k ? ctx.measureText(k).width + 10 : 0; ctx.font = k ? fNum : fLab; return kw + ctx.measureText(v).width; });
    const gap = (1264 - FX - w.reduce((a, b) => a + b, 0)) / (items.length - 1);
    let x = FX;
    items.forEach(([k, v], i) => {
      if (k) { txt(k, x, TOPY - 1, fLab, FT.dim); ctx.font = fLab; x += ctx.measureText(k).width + 10; txt(v, x, TOPY + 1, fNum, FT.text); ctx.font = fNum; x += ctx.measureText(v).width + gap; }
      else { txt(v, x, TOPY - 1, fLab, FT.text); ctx.font = fLab; x += ctx.measureText(v).width + gap; }
    });
  }
  // Left: the body's numbers. Health first and largest; dash beneath.
  function drawHUD(s) {
    const b = s.body, P = s.P, hp = b.alive ? b.health : 0, frac = clamp(hp / P['damage.bodyHealth'], 0, 1);
    const X = 16, W = FX - 32, TX = 30, BW = W - 28; // left column: as wide as the space beside the field
    panel(X, 62, W, 150);
    txt('BODY', TX, 92, fLab, FT.dim); txt(num(hp), TX, 146, '700 48px ' + F_MONO, frac < 0.3 && b.alive ? C.warning : FT.text);
    rr(TX, 164, BW, 26, 6); ctx.fillStyle = FT.track; ctx.fill();
    if (frac > 0) {
      const low = frac < 0.3 && Math.floor(app.realT * 4) % 2 === 0;
      rr(TX, 164, Math.max(12, BW * frac), 26, 6); ctx.fillStyle = low ? C.warning : C.dummy; ctx.fill(); ctx.strokeStyle = C.joints; ctx.lineWidth = 2; ctx.stroke();
    }
    panel(X, 222, W, 86);
    txt('DASH', TX, 252, fLab, FT.dim);
    const cap = s.capacity(), pw = (BW - (cap - 1) * 10) / cap; // Big battery: 3 (D26)
    for (let i = 0; i < cap; i++) {
      const x = TX + i * (pw + 10), f = clamp(b.charge - i, 0, 1);
      rr(x, 266, pw, 28, 6); ctx.fillStyle = FT.track; ctx.fill();
      if (f > 0) { rr(x, 266, Math.max(6, pw * f), 28, 6); ctx.fillStyle = f >= 1 ? FT.text : FT.dim; ctx.fill(); }
    }
    drawDistrict(s);
    drawBodyPanel(s);
  }
  // Left, below the dash: the district map (D24). The road through all nine screens; visited screens lit; the dummy's dot.
  function drawDistrict(s) {
    const D = s.district;
    if (!D) return;
    const X = 16, Y = 318, W = FX - 32, g = 6, cw = Math.min(56, Math.floor((W - 16 - (D.cols - 1) * g) / D.cols)), ch = Math.round(cw * 0.75), gx = X + (W - (D.cols * cw + (D.cols - 1) * g)) / 2, gy = Y + 50;
    panel(X, Y, W, 50 + D.rows * ch + (D.rows - 1) * g + 16);
    txt('DISTRICT', 30, Y + 32, fLab, FT.dim); txt(s.screenName(), X + W - 14, Y + 32, fLab, FT.text, 'right');
    const Wd = s.P['world.width'], Hd = s.P['world.height'];
    for (let iy = 0; iy < D.rows; iy++) for (let ix = 0; ix < D.cols; ix++) {
      const x = gx + ix * (cw + g), y = gy + iy * (ch + g), cur = D.cur[0] === ix && D.cur[1] === iy, seen = D.visited.has(iy * D.cols + ix), cell = D.cells[iy][ix];
      rr(x, y, cw, ch, 5); ctx.fillStyle = cur ? FT.sel : seen ? FT.item : FT.track; ctx.fill();
      ctx.strokeStyle = cur ? FT.accent : FT.itemEdge; ctx.lineWidth = cur ? 2 : 1; ctx.stroke();
      ctx.save(); rr(x, y, cw, ch, 5); ctx.clip();
      if (iy === 0) { ctx.fillStyle = rgba(PIX.PAL.water.length === 7 ? PIX.PAL.water : '#4FC3E8', 0.9); ctx.fillRect(x, y, cw, 4); }
      ctx.beginPath(); cell.center.forEach(([px, py], i) => { const qx = x + px / Wd * cw, qy = y + py / Hd * ch; if (i) ctx.lineTo(qx, qy); else ctx.moveTo(qx, qy); });
      if (cell.ring) cell.ring.forEach(([px, py], i) => { const qx = x + px / Wd * cw, qy = y + py / Hd * ch; if (i) ctx.lineTo(qx, qy); else ctx.moveTo(qx, qy); });
      ctx.strokeStyle = seen ? (cur ? FT.selText : FT.text) : FT.off; ctx.lineWidth = seen ? 5 : 3; ctx.lineJoin = 'round'; ctx.stroke();
      for (const dk of cell.decks || []) { // flyovers: a dashed line; the high highway (Z2) a heavier one
        const hi = (dk.z || 1) === 2;
        ctx.beginPath(); if (dk.hz) { ctx.moveTo(x, y + dk.off / Hd * ch); ctx.lineTo(x + cw, y + dk.off / Hd * ch); } else { ctx.moveTo(x + dk.off / Wd * cw, y); ctx.lineTo(x + dk.off / Wd * cw, y + ch); }
        ctx.strokeStyle = FT.accent; ctx.lineWidth = hi ? 4 : 2; ctx.setLineDash(hi ? [6, 2] : [3, 2]); ctx.stroke(); ctx.setLineDash([]);
      }
      if (cell.focal) { ctx.beginPath(); ctx.arc(x + cw / 2, y + ch / 2, 3, 0, TAU); ctx.fillStyle = FT.accent; ctx.fill(); }
      ctx.restore();
    }
    const b = s.body;
    if (b.alive) { const x = gx + D.cur[0] * (cw + g) + clamp(b.x / Wd, 0, 1) * cw, y = gy + D.cur[1] * (ch + g) + clamp(b.y / Hd, 0, 1) * ch; ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fillStyle = C.dummy; ctx.fill(); ctx.strokeStyle = C.joints; ctx.lineWidth = 2; ctx.stroke(); }
  }
  // Right: the chassis. Each part shows the damage it took (sim: impact.part, body.parts); installed modules glow aqua.
  const PART_NAME = { head: 'HEAD', torso: 'TORSO', armL: 'L ARM', armR: 'R ARM', legL: 'L LEG', legR: 'R LEG' };
  const dollArt = new Map();
  function partLevels(s) {
    const P = s.P, H = P['damage.bodyHealth'], out = {};
    for (const [k, v] of Object.entries(s.body.parts || {})) { const sh = v / H; out[k] = v <= 0 ? 0 : sh >= P['proto.parts.brokenShare'] ? 3 : sh >= P['proto.parts.crackedShare'] ? 2 : 1; }
    return out;
  }
  // Owned nodes; in the shop the selected node is tried on (blinking); the tuning preview shows all 15.
  function dollMods(s) {
    if (app.previewMods) return PIX.MODULES;
    const sel = s.phase === 'shop' && app.shopRow < 2 ? SHOP_GRID[app.shopCol][app.shopRow] || null : null;
    const tryOn = sel && !s.has(sel) && Math.floor(app.realT * 3) % 2 === 0;
    return PIX.MODULES.filter((m) => s.has(m) || (tryOn && m === sel));
  }
  function dollCanvas(levels, flash, mods) {
    const key = JSON.stringify(levels) + flash + mods.join();
    if (dollArt.has(key)) return dollArt.get(key);
    if (dollArt.size > 64) dollArt.clear();
    const S = PIX.doll(levels, flash, mods), cv2 = document.createElement('canvas'); cv2.width = S.w; cv2.height = S.h;
    const c2 = cv2.getContext('2d'), id = c2.createImageData(S.w, S.h); new Uint32Array(id.data.buffer).set(S.d); c2.putImageData(id, 0, 0);
    dollArt.set(key, cv2);
    return cv2;
  }
  function partEffects(s) { // the abilities the damage has cut, as shown on the chassis panel
    const out = [], pc = (v) => Math.round(v * 100) + '%';
    const sp = s.partEffect('speed'), tu = s.partEffect('turn'), vw = s.partEffect('view'), th = s.partEffect('throw');
    const da = s.partEffect('dash');
    if (sp < 0.995) out.push(['SPEED', pc(sp)]);
    if (da < 0.995) out.push(['DASH', pc(da)]);
    if (tu < 0.995) out.push(['TURN', pc(tu)]);
    if (vw < 0.995) out.push(['VIEW', Math.round(s.coneWidth()) + '°']);
    if (s.armsBroken() && (s.has('carry') || s.has('throw'))) out.push(['CONE', 'NO GRIP']);
    else if (th < 0.995 && s.has('throw')) out.push(['THROW', pc(th)]);
    return out;
  }
  // The chassis doll is drawn at ui.artScale like the field: one doll pixel = one art pixel, on the art grid.
  function drawBodyPanel(s) {
    const X = FX + FW + 16, W = VW - X - 16, Y = 62, b = s.body, U = RA, eff = b.alive ? partEffects(s) : []; // U here: reference units per art px
    const DW = PIX.DOLL_W * U, DH = PIX.DOLL_H * U, top = Y + 44, yHit = top + DH + 36;
    panel(X, Y, W, yHit - Y + 66 + (eff.length ? 16 + eff.length * 32 : 0));
    txt('CHASSIS ' + String(b.chassis).padStart(2, '0'), X + 14, Y + 30, fLab, FT.dim);
    const lp = fx.lastPart, flash = lp && app.realT - lp.t < 0.3 && Math.floor(app.realT * 16) % 2 === 0 ? lp.part : '';
    const dx = Math.round((X + W / 2 - DW / 2) / U) * U, dy = Math.round(top / U) * U;
    ctx.imageSmoothingEnabled = false; ctx.globalAlpha = b.alive ? 1 : 0.35;
    ctx.drawImage(dollCanvas(partLevels(s), flash, dollMods(s)), dx, dy, DW, DH);
    ctx.globalAlpha = 1;
    txt('LAST HIT', X + 14, yHit, fTxt, FT.dim);
    txt(lp ? PART_NAME[lp.part] + '  −' + num(lp.lost) : '—', X + 14, yHit + 38, fLab, lp ? FT.text : FT.dim);
    eff.forEach(([k2, v], i) => { const y = yHit + 86 + i * 32; txt(k2, X + 14, y, fTxt, FT.dim); txt(v, X + W - 14, y, fLab, C.warning, 'right'); });
  }

  // ---------- screens (frame layer). Facts at ui.typeLoadBearing, labels and lines at ui.typeSecondary.
  function veil() { ctx.fillStyle = FT.veil; ctx.fillRect(FX, FY, FW, FH); }
  function menuList(items, sel, x, y, w, disabled, rowH) {
    rowH = rowH || 54;
    items.forEach((it, i) => {
      const yy = y + i * rowH, on = i === sel, off = disabled && disabled(i);
      rr(x, yy, w, rowH - 10, 10); ctx.fillStyle = on ? FT.sel : FT.item; ctx.fill();
      ctx.strokeStyle = on ? FT.accent : FT.itemEdge; ctx.lineWidth = 1.5; ctx.stroke();
      txt(it, x + 18, yy + (rowH - 10) / 2 + 8, fLab, off ? FT.off : on ? FT.selText : FT.text);
    });
  }
  function difficultyHealth(i) { const k = 'proto.health.' + DIFFICULTIES[i].key; return app.tune[k] != null ? app.tune[k] : PROTO[k]; }
  function endItems(s) { return s.run.ending && s.run.ending.kind !== 'Licensed' ? ['Retry this district', ...END_ITEMS] : END_ITEMS; }
  function quotaOf(id) { const k = DISTRICTS[id] ? 'world.district.' + id + '.quota' : 'proto.quota.' + id; return app.tune[k] != null ? app.tune[k] : REG[k] != null ? REG[k] : PROTO[k]; }
  function drawTitle() {
    drawField(previews[app.level], true);
    veil();
    const x = FX + 30, y = FY + 22, w = FW - 60, h = FH - 44;
    panel(x, y, w, h);
    const TT = CTM && CTM.title, tv = { roads: LEVEL_LIST.length, q1: quotaOf(LEVEL_LIST[0]), q2: quotaOf(LEVEL_LIST[1]), q3: quotaOf(LEVEL_LIST[2]) };
    txt('DUMMIES', x + 30, y + 76, '900 64px ' + F_BRAND, FT.text);
    wrapText(TT && TT.lines ? fillIn(TT.lines[0], tv) : 'You are a FARSIGHT crash-test subject. Cars avoid you. Fool them into hitting you.', x + 32, y + 116, w - 64, 30, fTxt, FT.dim, 2);
    LEVEL_LIST.forEach((id, i) => { // Edit 41: five districts, in order
      const yy = y + 160 + i * 46, on = i === app.level, q = quotaOf(id);
      rr(x + 28, yy, w - 56, 40, 10); ctx.fillStyle = on ? FT.sel : FT.item; ctx.fill();
      ctx.strokeStyle = on ? FT.accent : FT.itemEdge; ctx.lineWidth = 1.5; ctx.stroke();
      txt((i + 1) + '  ' + INFO(id).name, x + 48, yy + 30, fLab, on ? FT.selText : FT.text);
      txt(q + ' WRITE-OFF' + (q === 1 ? '' : 'S'), x + w - 48, yy + 28, fLab, on ? FT.selText : FT.dim, 'right');
    });
    const dname = DIFFICULTIES[app.difficulty].name.toUpperCase(), dt = '◀  ' + dname + ' · ' + difficultyHealth(app.difficulty) + ' HEALTH  ▶';
    ctx.font = fKey; const dw = ctx.measureText(dt).width + 36;
    rr(x + w / 2 - dw / 2, y + 392, dw, 40, 20); ctx.fillStyle = app.difficulty === 1 ? FT.item : 'rgba(245,197,66,0.35)'; ctx.fill();
    ctx.strokeStyle = FT.accent; ctx.lineWidth = 1.5; ctx.stroke();
    txt(dt, x + w / 2, y + 420, fKey, FT.text, 'center');
    drawKeys([['WASD', 'MOVE'], ['SPACE', 'DASH'], ['ESC', 'PAUSE']], x + w / 2, y + 450);
    txt(TT && TT.start ? TT.start.toUpperCase() : 'PRESS SPACE TO START', x + w / 2, y + h - 22, fLab, FT.accent, 'center');
  }
  function drawReport(s) {
    veil();
    const rp = s.report, x = FX + 40, y = FY + 36, w = FW - 80, h = FH - 72;
    panel(x, y, w, h);
    txt(rp.roadCleared ? roadLabel(s.level.id) + ' CLEARED' : copy('report.eyebrow', 'WRITE-OFF REPORT').toUpperCase(), x + 30, y + 44, fLab, FT.accent);
    const chs = String(rp.chassis).padStart(2, '0');
    txt(copy('report.title', 'Chassis {chassis} written off.', { chassis: chs }), x + 30, y + 92, '900 36px ' + F_BRAND, FT.text);
    txt('Write-off ' + s.run.writeOffs + ' of ' + s.quota + ' · points this body ' + num(rp.points), x + 30, y + 132, fTxt, FT.dim);
    const cols = [['CAR', 0], ['ANGLE', 130], ['POINTS', 290], ['HEALTH LOST', 470]];
    cols.forEach(([c, dx]) => txt(c, x + 30 + dx, y + 190, fLab, FT.dim));
    rp.hits.slice(-3).forEach((hh, j) => {
      const yy = y + 236 + j * 44;
      [shortId(hh.model), hh.angle != null ? Math.round(hh.angle) + '°' : '—', num(hh.assessed), num(hh.lost)].forEach((v, i) => txt(String(v), x + 30 + cols[i][1], yy, fNum, FT.text));
    });
    rr(x + 28, y + h - 116, w - 56, 52, 12); ctx.fillStyle = FT.credit; ctx.fill(); ctx.strokeStyle = C.dummy; ctx.lineWidth = 1.5; ctx.stroke();
    txt(copy('report.credit', 'One body credit granted. Balance: {credits}.', { credits: s.run.credits }), x + 46, y + h - 82, fLab, FT.text);
    txt('SPACE  CONTINUE', x + w - 30, y + h - 26, fLab, FT.accent, 'right');
  }
  function drawShop(s) {
    veil();
    const x = FX + 22, y = FY + 18, w = FW - 44, h = FH - 36;
    panel(x, y, w, h);
    txt(copy('shop.eyebrow', 'MODIFICATION SERVICES').toUpperCase(), x + 28, y + 46, fLab, FT.accent);
    const ct = s.run.credits + ' CREDIT' + (s.run.credits === 1 ? '' : 'S');
    ctx.font = fLab; const cw = ctx.measureText(ct).width + 36;
    rr(x + w - 28 - cw, y + 16, cw, 44, 12); ctx.fillStyle = C.dummy; ctx.fill(); ctx.strokeStyle = C.joints; ctx.lineWidth = 1.5; ctx.stroke();
    txt(ct, x + w - 28 - cw / 2, y + 46, fLab, C.primary, 'center'); // dark on safety yellow in both palettes
    const nc = SHOP_GRID.length, colW = (w - 28 * (nc + 1)) / nc; // Torso, Arms, Battery (D26)
    SHOP_GRID.forEach((col, ci) => {
      const cx = x + 28 + ci * (colW + 28);
      col.forEach((n, ri) => {
        const yy = y + 78 + ri * 150, node = NODES[n], own = s.has(n), chk = s.canBuy(n), on = app.shopCol === ci && app.shopRow === ri;
        rr(cx, yy, colW, 140, 12);
        ctx.fillStyle = own ? 'rgba(79,195,232,0.28)' : on ? FT.keyTop : FT.item; ctx.fill();
        ctx.strokeStyle = on ? FT.accent : FT.itemEdge; ctx.lineWidth = on ? 3 : 1.5; ctx.stroke();
        txt(node.name, cx + 18, yy + 34, '900 26px ' + F_BRAND, FT.text);
        const price = s.P[node.price];
        txt(own ? 'OWNED' : chk.ok ? price + ' CREDIT' + (price === 1 ? '' : 'S') : chk.why.toUpperCase(), cx + 18, yy + 60, fLab, own ? FT.accent : chk.ok ? FT.text : FT.off);
        wrapText(dashify(node.desc.split('. ')[0].replace(/\.?$/, '.')), cx + 18, yy + 86, colW - 36, 24, fTxt, FT.dim, 3);
        if (ri === 0 && col.length > 1) { ctx.strokeStyle = '#9FB0BA'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + 34, yy + 140); ctx.lineTo(cx + 34, yy + 150); ctx.stroke(); }
      });
    });
    if (app.shopRow < 2 && SHOP_GRID[app.shopCol][app.shopRow]) {
      const n = SHOP_GRID[app.shopCol][app.shopRow], chk = s.canBuy(n);
      let msg = '';
      if (s.has(n)) msg = NODES[n].name + ' is installed.';
      else if (!chk.ok) msg = NODES[n].name + ': ' + chk.why + '.';
      else { const left = s.run.credits - chk.price; msg = 'Buying ' + NODES[n].name + ' leaves ' + left + ' credit' + (left === 1 ? '' : 's') + '.'; }
      wrapText(msg, x + 28, y + 400, w - 56, 28, fLab, FT.text, 2);
    }
    const on = app.shopRow === 2;
    rr(x + 28, y + h - 118, w - 56, 52, 12); ctx.fillStyle = on ? FT.sel : FT.item; ctx.fill();
    ctx.strokeStyle = on ? FT.accent : FT.itemEdge; ctx.lineWidth = 1.5; ctx.stroke();
    txt(s.run.credits ? copy('shop.bank', 'Keep {credits} in credit. Deploy next chassis', { credits: s.run.credits }) : copy('shop.deploy', 'Deploy next chassis'), x + w / 2, y + h - 84, fLab, on ? FT.selText : FT.text, 'center');
    txt('ARROWS SELECT · SPACE BUY · K DEPLOY', x + w / 2, y + h - 24, fLab, FT.dim, 'center');
  }
  // Cue key: the field's own pixel marks, shown at field scale, with what each means.
  const CUE_KEY = [
    ['intention', 'Has noticed you'], ['committed', 'Route fixed'], ['expiring', 'Commitment ending'], ['interrupted', 'Braking for safety'],
    ['caution', 'Slowing past you'], ['braking', 'Slowing'], ['stoppoint', 'Where it can stop'], ['spent', 'No more points'],
    ['honk', 'Blocked, warning you'], ['blind', 'Cannot sense you'], ['view', 'What you can see'],
  ];
  const cueArt = new Map();
  function cueCanvas(cue) {
    if (cueArt.has(cue)) return cueArt.get(cue);
    const w = 40, h = 20, B = new PIX.Buf(w, h);
    B.fill(K.road);
    const car = (brk) => { const S = PIX.car('sedan', 28, 14, EXT(22), 0, brk); PIX.blit(B, S, 16, 12); return { cx: 16, cy: 12 - EXT(22) }; };
    const loc = (cx, cy) => (u, v) => [cx + u / U, cy + v / U];
    if (['intention', 'committed', 'expiring', 'interrupted', 'caution'].includes(cue)) { const r = car(false); pip(B, cue, r.cx, r.cy, loc(r.cx, r.cy), cue === 'expiring' ? 0.6 : 1, 0); }
    else if (cue === 'braking') car(true);
    else if (cue === 'stoppoint') { car(false); PIX.polyline([[33, 4], [36, 4], [36, 18], [33, 18]], (x, y) => B.put(x, y, K.label)); }
    else if (cue === 'spent') { const r = car(false); PIX.line(r.cx - 4, r.cy + 3, r.cx + 4, r.cy - 3, (x, y) => { B.put(x, y, K.roofInk); B.put(x, y + 1, K.roofInk); }); }
    else if (cue === 'honk') { B.rect(15, 1, 24, 18, K.tagBorder); B.rect(16, 2, 23, 17, K.tagFill); PIX.text(B, '!', 19, 4, K.tagInk); }
    else if (cue === 'blind') {
      PIX.fillPoly([[2, 3], [38, 3], [38, 17], [2, 17]], (x, y) => { if ((x + y) % 4 === 0 && !(x > 16 && y > 6 && y < 14)) B.put(x, y, K.label); }, w, h);
      PIX.polyline([[16, 7], [38, 7]], (x, y, i) => { if (i % 3 === 0) B.put(x, y, K.ink); }); PIX.polyline([[16, 13], [38, 13]], (x, y, i) => { if (i % 3 === 0) B.put(x, y, K.ink); });
    } else if (cue === 'view') { for (const [x1, y1] of [[38, 1], [38, 19]]) PIX.line(4, 10, x1, y1, (x, y, i) => { if (i % 4 === 0) B.mix(x, y, K.ink, 0.6); }); B.rect(3, 9, 4, 10, K.nose); }
    const cvs = document.createElement('canvas'); cvs.width = w; cvs.height = h;
    const c2 = cvs.getContext('2d'), id = c2.createImageData(w, h); new Uint32Array(id.data.buffer).set(B.d); c2.putImageData(id, 0, 0);
    cueArt.set(cue, cvs);
    return cvs;
  }
  function drawCueKey(x, y, w, h) {
    panel(x, y, w, h);
    txt(copy('cueKeyTitle', 'CUE KEY').toUpperCase(), x + 22, y + 40, fLab, FT.accent);
    const keys = CUE_KEY.filter(([c]) => c !== 'stoppoint' || (app.sim && app.sim.P['proto.stopCue']));
    keys.forEach(([cue, meaning], i) => {
      const yy = y + 58 + i * 44;
      ctx.imageSmoothingEnabled = false; ctx.drawImage(cueCanvas(cue), x + 20, yy, 80, 40);
      txt(meaning, x + 116, yy + 28, fLab, FT.text);
    });
  }
  function drawPause(s) {
    veil();
    const x = FX + 18, y = FY + 18, w = 300, h = FH - 36;
    panel(x, y, w, h);
    txt('PAUSED', x + 22, y + 40, fLab, FT.accent);
    const items = PAUSE_ITEMS.slice();
    if (app.confirmRefuse) items[2] = 'Confirm refusal';
    menuList(items, app.pauseSel, x + 18, y + 62, w - 36, (i) => i === 2 && s.run.writeOffs < 1);
    wrapText(s.run.writeOffs < 1 ? 'Refusal opens after one completed body.' : 'Refusal is a deliberate ending.', x + 22, y + 362, w - 44, 28, fTxt, FT.dim, 4);
    drawCueKey(x + w + 16, y, FW - 36 - w - 16, h);
  }
  function drawEnding(s) {
    veil();
    const e = s.run.ending, x = FX + 22, y = FY + 18, w = FW - 44, h = FH - 36;
    panel(x, y, w, h, { tint: e.kind === 'Licensed' ? 'rgba(232,248,238,0.95)' : 'rgba(236,247,252,0.95)' });
    txt('CONTRACT RESULT', x + 28, y + 44, fLab, FT.accent);
    const title = { Licensed: 'LICENSED', 'Failed test': 'FAILED TEST', 'Non-compliant': 'NON-COMPLIANT' }[e.kind] || e.kind;
    txt(title, x + 26, y + 104, '900 54px ' + F_BRAND, e.kind === 'Licensed' ? FT.text : e.kind === 'Failed test' ? C.warning : FT.dim);
    wrapText(copy('endings.' + e.kind, ''), x + 28, y + 146, w - 56, 28, fTxt, FT.dim, 2);
    const imp = s.events.filter((v) => v.type === 'impact');
    const stats = [['TIME', fmtT(e.t)], ['WRITE-OFFS', String(e.writeOffs)], ['POINTS', num(e.points)], ['BEST HIT', imp.length ? num(Math.max(...imp.map((v) => v.assessed))) : '—']];
    const cw = (w - 56) / stats.length;
    stats.forEach(([k, v], i) => { txt(k, x + 28 + i * cw, y + 222, fLab, FT.dim); txt(v, x + 28 + i * cw, y + 262, fNum, FT.text); });
    const items = endItems(s);
    menuList(items, app.endSel, x + 28, y + h - 20 - items.length * 54, 460);
  }

  function render() {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = false;
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
    ['traffic.deckSpeedScale', 1, 2, 0.05], ['traffic.deckGapScale', 0.5, 3, 0.1], ['damage.deckMultiplier', 1, 3, 0.1], ['vehicles.bus.minRadius', 64, 320, 8], ['damage.walkShare', 0, 1, 0.05],
    ['traffic.share.hatchback', 0, 0.5, 0.01], ['traffic.share.police', 0, 0.3, 0.01], ['traffic.share.bus', 0, 0.4, 0.01], // P5 (Edit 50)
    ['upgrades.spineLimit', 10, 90, 1], ['upgrades.bigCapacity', 2, 6, 1], ['world.puddleShare', 0, 0.1, 0.005], ['proto.district.seed', 0, 20, 1], ['world.flipSeconds', 0, 1, 0.05],
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
    for (const [id, text] of [['proto.damageModel', 'Newtonian impulse damage and recoil (off = V29 formula)'], ['proto.pathsEverywhere', 'Show committed car paths outside the view cone'], ['proto.zonesEverywhere', 'Show car scanners outside the view cone'], ['proto.learningEnabled', 'Cars learn from player hits'], ['proto.stopCue', 'Show each car\'s stop bracket'], ['proto.city', 'City blocks and jersey barriers are solid (next road or restart)'], ['proto.parts.effects', 'Damaged parts cut abilities (legs speed, torso turn, head view, arms throw)'], ['proto.district', '3 × 3 screens per road, Zelda-style (next road or restart)']]) {
      const row = document.createElement('label'); row.className = 'tcheck';
      const inp = document.createElement('input'); inp.type = 'checkbox'; inp.id = 't-' + id.replace(/\./g, '-');
      inp.addEventListener('change', () => setParam(id, inp.checked ? 1 : 0));
      const sp = document.createElement('span'); sp.innerHTML = text + ' <code>' + id + '</code>';
      row.append(inp, sp); grid.append(row);
    }
    { // display only: dress the chassis doll in every module of the tree (not a parameter; the run is untouched)
      const row = document.createElement('label'); row.className = 'tcheck';
      const inp = document.createElement('input'); inp.type = 'checkbox'; inp.id = 't-preview-mods'; inp.checked = !!app.previewMods;
      inp.addEventListener('change', () => { app.previewMods = inp.checked; });
      const sp = document.createElement('span'); sp.textContent = 'Preview all 15 modules on the chassis doll (display only)';
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
    for (const id of ['proto.damageModel', 'proto.pathsEverywhere', 'proto.zonesEverywhere', 'proto.learningEnabled', 'proto.stopCue', 'proto.city', 'proto.parts.effects', 'proto.district']) { const inp = document.getElementById('t-' + id.replace(/\./g, '-')); if (inp) inp.checked = !!current(id); }
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

  const statusEl = document.getElementById('status');
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
    const st = BUILD + ' · ' + SW + ' × ' + SH + ' ×' + kpx + ' · ' + (app.tuned ? 'TUNED RUN · UNRANKED' : 'registry values');
    if (statusEl && statusEl.textContent !== st) statusEl.textContent = st;
    requestAnimationFrame(frame);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {});
  requestAnimationFrame(frame);
  window.__dummies = app;
  window.__dummiesScale = () => ({ kpx, width: cv.width, height: cv.height });
})();
