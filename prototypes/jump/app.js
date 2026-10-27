// DUMMIES jump test (GDD Edit 76): a small Phaser yard for the jump. Link's Awakening rules (jump.js): the distance follows the
// speed you jump with; a jump during a dash is a long jump. Moving traffic, parked cars broadside and end-on, barriers from a
// handrail to a wall, a ruler. A side view charts every jump against the heights it must clear.
// Move DIRECT (../controls/core.js, model 2). A dash; B jump. Keys, gamepads (../controls/pads.js), touch on phones and tablets.
(function () {
  'use strict';
  const P = window.JUMP_P, C = window.CTRL, J = window.JUMP, PADS = window.PADS, W = 960, H = 540, DEG = Math.PI / 180;
  const DPR = Math.min(3, Math.max(1, window.devicePixelRatio || 1));
  const COL = { ground: 0x111820, grid: 0x17212b, road: 0x1a2129, lane: 0xc9d4db, kerb: 0x34404b, dummy: 0xf5c542, dummyEdge: 0x3a2c08, car: 0xe6ecf0,
    carEdge: 0x7fe3ff, hit: 0xff4fd8, ok: 0x57e389, rail: 0x9aa7b2, planter: 0x2a4a32, hedge: 0x3f7a4a, wall: 0x4a5160, jersey: 0xb8c4cb, accent: 0x7fe3ff,
    ui: 0x0b1016, uiEdge: 0x2c3a47, text: '#dfe7ec', dim: '#8796a3', acc: '#7fe3ff', warn: '#ff4fd8', good: '#57e389' };
  const FONT = "'Silkscreen', 'Courier New', monospace", FONT2 = "'IBM Plex Mono', 'Courier New', monospace";
  const VS = P['vehicles.scale'], R = P['body.radius'], LW = P['world.laneWidth'], JH = P['world.jumpableHeight'];
  const veh = (cls) => ({ cls, L: P['vehicles.' + cls + '.length'] * VS, Wd: P['vehicles.' + cls + '.width'] * VS, h: P['vehicles.' + cls + '.height'] * VS, v: P['vehicles.' + cls + '.cruiseSpeed'] });
  const SEDAN = veh('sedan'), VAN = veh('van'), BUS = veh('bus');
  // ---------- the yard
  const ROAD = { y0: 28, y1: 28 + 2 * LW }, LANES = [ROAD.y0 + LW / 2, ROAD.y0 + 1.5 * LW]; // upper lane west, lower east
  const PARK_Y = 262, BAR_Y = 400, RULER_Y = 488;
  const OBS = []; // fixed things: parked cars and barriers. { x, y, w, h (box), z (height), name, jumpable, kind }
  const park = (v, x, side) => { const end = side === 'end', w = end ? v.Wd : v.L, d = end ? v.L : v.Wd; OBS.push({ x: x - w / 2, y: PARK_Y - d / 2, w, h: d, z: v.h, name: v.cls + (end ? ' end-on' : ' broadside'), kind: 'car', cls: v.cls, jumpable: true, across: d }); };
  park(SEDAN, 110, 'broad'); park(VAN, 230, 'broad'); park(BUS, 360, 'broad'); park(SEDAN, 530, 'end'); park(VAN, 650, 'end'); park(BUS, 790, 'end');
  const bar = (x, d, name, kind, jumpable, z) => OBS.push({ x, y: BAR_Y - d / 2, w: 96, h: d, z, name, kind, jumpable, across: d });
  bar(40, 8, 'handrail', 'rail', true, JH); bar(176, 16, 'jersey', 'jersey', true, JH); bar(312, 32, 'planter 32', 'planter', true, JH);
  bar(448, P['world.jumpableDepth'], 'planter ' + P['world.jumpableDepth'], 'planter', true, JH); bar(584, 64, 'planter 64', 'planter', false, JH); bar(720, 16, 'wall', 'wall', false, 40);
  const SPAWNS = [[880, PARK_Y + 90, 'parked'], [40, BAR_Y + 60, 'barriers'], [40, RULER_Y, 'ruler'], [480, ROAD.y1 + 26, 'traffic']];
  const S = { device: 'keyboard', touchOn: false, help: false, last: null, flights: [], hits: 0, jumps: 0, pad: null, view: null, msg: '' };
  window.JUMP_STATE = S; window.JUMP_YARD = { OBS, SEDAN, VAN, BUS, LANES, ROAD, PARK_Y, BAR_Y, RULER_Y, SPAWNS, W, H };
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const rectHit = (cx, cy, r, q) => { const nx = C.clamp(cx, q.x, q.x + q.w), ny = C.clamp(cy, q.y, q.y + q.h), dx = cx - nx, dy = cy - ny, d = Math.hypot(dx, dy); if (d >= r) return null; if (d > 1e-6) return { nx: dx / d, ny: dy / d, pen: r - d }; const l = cx - q.x, rt = q.x + q.w - cx, t = cy - q.y, b = q.y + q.h - cy, m = Math.min(l, rt, t, b); return m === l ? { nx: -1, ny: 0, pen: l + r } : m === rt ? { nx: 1, ny: 0, pen: rt + r } : m === t ? { nx: 0, ny: -1, pen: t + r } : { nx: 0, ny: 1, pen: b + r }; };

  class Yard extends Phaser.Scene {
    constructor() { super('yard'); }
    create() {
      this.body = C.newBody(SPAWNS[0][0], SPAWNS[0][1], -Math.PI / 2); this.body.z = 0; this.body.jump = null; this.body.landT = 0;
      this.cars = []; this.spawnT = [0.3, 1.4]; this.pads = PADS.create(); this.keyQ = { a: 0, b: 0 }; this.trail = [];
      this.drawStatic(); this.g = this.add.graphics();
      this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
      this.input.keyboard.addCapture('SPACE,UP,DOWN,LEFT,RIGHT,SHIFT');
      this.input.keyboard.on('keydown', (e) => {
        if (e.repeat) return;
        const k = e.code;
        if (k === 'Space' || k === 'KeyK') this.keyQ.a++;
        else if (k === 'KeyL' || k === 'ShiftLeft' || k === 'ShiftRight') this.keyQ.b++;
        else if (/^Digit[1-4]$/.test(k)) this.reset(+k.slice(5) - 1);
        else if (k === 'KeyH') S.help = !S.help;
        else if (k === 'KeyR') { S.flights = []; S.last = null; S.hits = 0; S.jumps = 0; }
        else if (k === 'KeyG') S.padCmd = this.pads.setup ? 'cancel' : 'setup';
        else if (k === 'Escape') { S.help = false; if (this.pads.setup) S.padCmd = 'cancel'; }
        else return;
        if (S.device !== 'pad') S.device = 'keyboard';
      });
      this.popText = this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '13px', color: '#ff4fd8', resolution: 2 * DPR }).setOrigin(0.5).setAlpha(0).setDepth(5);
      this.scale.on('resize', () => this.fit()); this.fit();
      this.scene.launch('hud');
    }
    reset(i) { const sp = SPAWNS[i] || SPAWNS[0], b = this.body; Object.assign(b, { x: sp[0], y: sp[1], vx: 0, vy: 0, mode: 'idle', lunge: null, jump: null, z: 0, landT: 0, facing: -Math.PI / 2 }); this.trail = []; }
    fit() {
      const v = S.view || { x: 0, y: 0, w: this.scale.width, h: this.scale.height }, cam = this.cameras.main;
      if (cam.x !== v.x || cam.y !== v.y || cam.width !== v.w || cam.height !== v.h) cam.setViewport(v.x, v.y, v.w, v.h);
      const z = Math.min(v.w / W, v.h / H); if (Math.abs(cam.zoom - z) > 1e-4) cam.setZoom(z); cam.centerOn(W / 2, H / 2);
    }
    drawStatic() {
      const g = this.add.graphics(), lab = (x, y, s, c) => this.add.text(x, y, s, { fontFamily: FONT, fontSize: '10px', color: c || '#8796a3', resolution: 2 * DPR });
      g.fillStyle(COL.ground).fillRect(0, 0, W, H);
      g.lineStyle(1, COL.grid, 1); for (let x = 0; x <= W; x += 32) g.lineBetween(x, 0, x, H); for (let y = 0; y <= H; y += 32) g.lineBetween(0, y, W, y);
      g.fillStyle(COL.road).fillRect(0, ROAD.y0, W, ROAD.y1 - ROAD.y0); g.fillStyle(COL.kerb).fillRect(0, ROAD.y0 - 3, W, 3).fillRect(0, ROAD.y1, W, 3);
      g.fillStyle(COL.lane); for (let x = 8; x < W; x += 48) g.fillRect(x, ROAD.y0 + LW - 1, 24, 2);
      lab(8, ROAD.y1 + 6, 'MOVING TRAFFIC · NO ONE BRAKES · JUMP A PASSING CAR (SEDAN, VAN, BUS)');
      lab(8, PARK_Y - 56, 'PARKED · BROADSIDE: JUMP ITS WIDTH · END-ON: JUMP ITS LENGTH');
      for (const q of OBS) {
        if (q.kind === 'car') { g.fillStyle(0x000000, 0.35).fillRect(q.x + 3, q.y + 4, q.w, q.h); g.fillStyle(COL.car).fillRoundedRect(q.x, q.y, q.w, q.h, 4); g.lineStyle(1, COL.carEdge, 0.9).strokeRoundedRect(q.x, q.y, q.w, q.h, 4); }
        else if (q.kind === 'rail') { g.fillStyle(COL.rail).fillRect(q.x, q.y, q.w, q.h); for (let x = q.x; x <= q.x + q.w; x += 12) g.fillStyle(0x5f6878).fillRect(x, q.y - 1, 2, q.h + 2); }
        else if (q.kind === 'jersey') { g.fillStyle(COL.jersey).fillRect(q.x, q.y, q.w, q.h); g.fillStyle(0xff4fd8, 0.6).fillRect(q.x, q.y + q.h / 2 - 1, q.w, 2); }
        else if (q.kind === 'planter') { g.fillStyle(0x4a5160).fillRoundedRect(q.x, q.y, q.w, q.h, 3); g.fillStyle(COL.hedge).fillRect(q.x + 3, q.y + 3, q.w - 6, q.h - 6); }
        else { g.fillStyle(COL.wall).fillRect(q.x, q.y, q.w, q.h); g.lineStyle(1, 0x7d8799, 1).strokeRect(q.x, q.y, q.w, q.h); }
        const ok = q.jumpable ? '' : ' · SOLID';
        lab(q.x, q.y - 14, (q.kind === 'car' ? q.cls.toUpperCase() + ' ' + q.z.toFixed(1) + ' HIGH' : q.name.toUpperCase() + ok), q.jumpable ? '#8796a3' : '#ff4fd8');
      }
      lab(8, BAR_Y - 52, 'BARRIERS · TAGGED JUMPABLE AT ' + JH + ' HIGH, UP TO ' + P['world.jumpableDepth'] + ' DEEP');
      // the ruler
      g.lineStyle(1, COL.kerb, 1).lineBetween(16, RULER_Y + 22, W - 16, RULER_Y + 22);
      for (let x = 16, i = 0; x <= W - 16; x += 16, i++) { g.lineStyle(1, i % 4 ? COL.kerb : 0x8796a3, 1).lineBetween(x, RULER_Y + 22, x, RULER_Y + (i % 4 ? 16 : 12)); if (i % 4 === 0) lab(x - 4, RULER_Y + 26, String(i * 16)); }
      lab(8, RULER_Y - 30, 'RULER · RUN ALONG IT AND JUMP: STAND 0 · WALK ' + J.reach(P, J.speeds(P).walk).toFixed(0) + ' · RUN ' + J.reach(P, J.speeds(P).run).toFixed(0) + ' · DASH JUMP ' + J.reach(P, J.speeds(P).dash).toFixed(0));
    }
    // ---------- input: keys (8 directions), pads (analog), touch (analog)
    gather(dt) {
      const k = this.keys; let mx = 0, my = 0, m = 0, a = this.keyQ.a, b = this.keyQ.b; this.keyQ.a = this.keyQ.b = 0;
      const kx = (k.D.isDown || k.RIGHT.isDown ? 1 : 0) - (k.A.isDown || k.LEFT.isDown ? 1 : 0), ky = (k.S.isDown || k.DOWN.isDown ? 1 : 0) - (k.W.isDown || k.UP.isDown ? 1 : 0);
      if (kx || ky) { const l = Math.hypot(kx, ky); mx = kx / l; my = ky / l; m = 1; S.device = 'keyboard'; }
      if (S.padCmd === 'setup') PADS.startSetup(this.pads, PADCFG); else if (S.padCmd === 'cancel') this.pads.setup = null; S.padCmd = null;
      let list = null; try { list = navigator.getGamepads ? navigator.getGamepads() : null; S.padBlocked = false; } catch (e) { S.padBlocked = true; }
      const gp = PADS.read(this.pads, list, PADCFG, dt); S.pad = gp;
      if (gp.id && !gp.setup) {
        if (gp.move) { mx = gp.move.x; my = gp.move.y; m = gp.move.m; S.device = 'pad'; }
        if (gp.a) { a++; S.device = 'pad'; } if (gp.b) { b++; S.device = 'pad'; } if (gp.start) S.help = !S.help;
      }
      const tm = S.touch && S.touch.move; if (tm && tm.m > 0) { mx = tm.x; my = tm.y; m = tm.m; S.device = 'touch'; }
      if (S.touch) { a += S.touch.aQ; b += S.touch.bQ; if (S.touch.aQ || S.touch.bQ) S.device = 'touch'; S.touch.aQ = S.touch.bQ = 0; }
      if (S.portrait) return { mx: 0, my: 0, m: 0, aim: null, lunge: false, jump: false };
      return { mx, my, m, aim: null, lunge: a > 0, jump: b > 0 };
    }
    // ---------- the dummy: DIRECT on foot (core.js); the jump by jump.js
    startJump() {
      const b = this.body, dash = b.mode === 'lunge' && b.lunge; let vx = b.vx, vy = b.vy;
      if (dash) { const L = b.lunge, sp = L.t < L.tf - 1e-9 ? L.R * L.df / L.tf : L.R * (1 - L.df) / (L.T - L.tf); vx = Math.cos(L.dir) * sp; vy = Math.sin(L.dir) * sp; }
      const Jt = J.takeoff(P, vx, vy, !!dash);
      Object.assign(Jt, { x0: b.x, y0: b.y, samples: [[0, 0]], passed: new Map() });
      b.jump = Jt; b.mode = 'jump'; b.lunge = null; b.z = 0; if (Jt.v0 > 1) b.facing = Math.atan2(Jt.vy, Jt.vx);
      S.jumps++; this.pop(b.x, b.y - 26, (Jt.kind === 'dash' ? 'LONG JUMP ' : Jt.kind.toUpperCase() + (Jt.clear ? ' JUMP ' : ' HOP ')) + Jt.v0.toFixed(0), Jt.clear ? '#7fe3ff' : '#8796a3');
    }
    land(hit) {
      const b = this.body, Jt = b.jump, sp = Math.hypot(Jt.vx, Jt.vy), walk = P['movement.walkSpeed'], run = P['movement.runSpeed'];
      const d = Math.hypot(b.x - Jt.x0, b.y - Jt.y0), top = Math.max(...Jt.samples.map((q) => q[1]));
      for (const q of OBS) if (rectHit(b.x, b.y, R, q)) { const k = 'o' + OBS.indexOf(q), p = Jt.passed.get(k); if (p) p.ok = false; else Jt.passed.set(k, { name: q.name, ok: false }); } // landed on it: short
      const over = [...Jt.passed.values()];
      S.last = { kind: Jt.kind, clear: Jt.clear, v0: Jt.v0, d, top, T: Jt.T, over, hit: !!hit, x0: Jt.x0, y0: Jt.y0, x1: b.x, y1: b.y, samples: Jt.samples };
      S.flights.push(S.last); if (S.flights.length > 6) S.flights.shift();
      b.jump = null; b.z = 0; b.landT = P['upgrades.jumpRecovery']; b.vx = Jt.vx; b.vy = Jt.vy;
      if (sp > 1) { b.mode = 'move'; b.rampT = P['movement.rampSeconds'] * C.clamp((sp - walk) / Math.max(1, run - walk), 0, 1); } else { b.mode = 'idle'; b.vx = b.vy = 0; }
    }
    update(time, delta) {
      const dt = Math.min(0.05, delta / 1000), b = this.body, it = this.gather(dt);
      if (b.landT > 0) b.landT = Math.max(0, b.landT - dt);
      if (b.mode === 'jump') {
        const Jt = b.jump; J.air(P, Jt, it.m > 0 ? it.mx : 0, it.m > 0 ? it.my : 0, dt);
        b.x += Jt.vx * dt; b.y += Jt.vy * dt; Jt.t = Math.min(Jt.T, Jt.t + dt); b.z = J.z(Jt);
        if (Math.hypot(Jt.vx, Jt.vy) > 1) b.facing = Math.atan2(Jt.vy, Jt.vx);
        Jt.samples.push([Math.hypot(b.x - Jt.x0, b.y - Jt.y0), b.z]);
        if (Jt.t >= Jt.T - 1e-9) this.land();
      } else if (it.jump && !(b.landT > 0) && b.mode !== 'knock') this.startJump();
      else C.step(b, Object.assign({}, it, { lunge: it.lunge && !(b.landT > 0) }), dt, P, 2);
      this.stepCars(dt); this.collide();
      this.trail.push({ x: b.x, y: b.y, z: b.z || 0, t: time }); while (this.trail.length && time - this.trail[0].t > 3000) this.trail.shift();
      this.fit(); this.draw(time);
    }
    stepCars(dt) {
      for (let ln = 0; ln < 2; ln++) {
        this.spawnT[ln] -= dt;
        if (this.spawnT[ln] <= 0) { const u = rnd(), v = u < 0.5 ? SEDAN : u < 0.8 ? VAN : BUS, dir = ln === 0 ? -1 : 1; this.cars.push(Object.assign({}, v, { x: dir > 0 ? -v.L : W + v.L, y: LANES[ln], dir, hitT: 0 })); this.spawnT[ln] = 1.6 + rnd() * 2.0; }
      }
      for (const c of this.cars) { c.x += c.v * c.dir * dt; c.hitT = Math.max(0, c.hitT - dt); }
      this.cars = this.cars.filter((c) => c.x > -140 && c.x < W + 140);
    }
    collide() { // solid unless the dummy is above a jumpable thing's top. In a jump the flight slides along what it meets
      const b = this.body, z = b.z || 0, Jt = b.jump, zc = Jt && Jt.clear ? z : 0; // Edit 77: a hop (stand, walk) clears nothing
      const push = (res) => { b.x += res.nx * res.pen; b.y += res.ny * res.pen; const vn = b.vx * res.nx + b.vy * res.ny; if (vn < 0) { b.vx -= vn * res.nx; b.vy -= vn * res.ny; } if (Jt) J.slide(Jt, res.nx, res.ny); };
      const note = (key, name, over) => { if (!Jt) return; const p = Jt.passed.get(key); if (!p) Jt.passed.set(key, { name, ok: over }); else if (!over) p.ok = false; };
      for (const q of OBS) {
        const res = rectHit(b.x, b.y, R, q); if (!res) continue;
        const over = q.jumpable && zc >= q.z; note('o' + OBS.indexOf(q), q.name, over);
        if (!over) push(res);
      }
      for (const c of this.cars) {
        const q = { x: c.x - c.L / 2, y: c.y - c.Wd / 2, w: c.L, h: c.Wd }, res = rectHit(b.x, b.y, R, q); if (!res) continue;
        const over = zc >= c.h; note('c' + c.cls + c.y, 'moving ' + c.cls, over);
        if (over) continue;
        if ((b.mode === 'lunge' || b.mode === 'jump') && c.hitT === 0) { S.hits++; c.hitT = 0.6; this.pop(b.x, b.y - 22, c.cls.toUpperCase() + ' HIT', '#ff4fd8'); this.cameras.main.shake(80, 0.004); }
        if (b.mode === 'jump') this.land(true); // struck below the roof: the flight ends here
        b.mode = 'knock'; b.knockT = 0; b.knockVx = res.nx * 160 + c.v * c.dir * 0.6; b.knockVy = res.ny * 160; b.lunge = null;
        b.x += res.nx * res.pen; b.y += res.ny * res.pen;
      }
      b.x = C.clamp(b.x, R, W - R); b.y = C.clamp(b.y, R, H - R);
    }
    pop(x, y, s, color) { this.popT = this.time.now; this.popText.setText(s).setColor(color).setPosition(x, y).setAlpha(1); }
    draw(time) {
      const g = this.g, b = this.body, z = b.z || 0, lift = z * 0.55; g.clear();
      for (const c of this.cars) {
        g.fillStyle(0x000000, 0.35).fillRect(c.x - c.L / 2 + 3, c.y - c.Wd / 2 + 4, c.L, c.Wd);
        g.fillStyle(c.hitT > 0 && Math.floor(time / 60) % 2 ? COL.hit : COL.car).fillRoundedRect(c.x - c.L / 2, c.y - c.Wd / 2, c.L, c.Wd, 4);
        g.lineStyle(1, COL.carEdge, 0.9).strokeRoundedRect(c.x - c.L / 2, c.y - c.Wd / 2, c.L, c.Wd, 4);
        g.fillStyle(0x0e3a4f).fillRect(c.x + c.dir * (c.L / 2 - 12) - 3, c.y - c.Wd / 2 + 3, 6, c.Wd - 6);
      }
      if (S.last) { const L = S.last; g.lineStyle(2, COL.accent, 0.9).lineBetween(L.x0, RULER_Y + 22, L.x0, RULER_Y + 4).lineBetween(L.x1, RULER_Y + 22, L.x1, RULER_Y + 4); }
      for (let i = 1; i < this.trail.length; i++) { const a = this.trail[i - 1], q = this.trail[i]; g.lineStyle(2, q.z > 0 ? COL.accent : 0x3c5566, q.z > 0 ? 0.7 : 0.35).lineBetween(a.x, a.y - a.z * 0.55, q.x, q.y - q.z * 0.55); }
      // the dummy: shadow on the ground; the body lifted by its height
      g.fillStyle(0x000000, 0.4 - Math.min(0.25, z / 200)).fillEllipse(b.x + 2, b.y + 5, (R * 2.2) * (1 - z / 180), (R * 1.2) * (1 - z / 180));
      const by = b.y - lift;
      if (b.mode === 'lunge') g.lineStyle(3, COL.dummy, 0.35).lineBetween(b.x - Math.cos(b.facing) * 30, by - Math.sin(b.facing) * 30, b.x, by);
      g.fillStyle(COL.dummy).fillCircle(b.x, by, R); g.lineStyle(2, COL.dummyEdge, 1).strokeCircle(b.x, by, R);
      const fx = Math.cos(b.facing), fy = Math.sin(b.facing), px = -fy, py = fx;
      g.fillStyle(COL.dummyEdge).fillTriangle(b.x + fx * (R + 7), by + fy * (R + 7), b.x + fx * 4 + px * 6, by + fy * 4 + py * 6, b.x + fx * 4 - px * 6, by + fy * 4 - py * 6);
      if (z > 0) { g.lineStyle(1, COL.accent, 0.8).lineBetween(b.x, b.y + 3, b.x, by + R); }
      const age = this.time.now - (this.popT || -9e9); this.popText.setAlpha(age < 1000 ? 1 - age / 1000 : 0).setY(this.popText.y - (age < 1000 ? 0.15 : 0));
    }
  }
  const PADCFG = { actions: ['a', 'b'], std: { a: [0, 7], b: [1] }, other: { a: [0], b: [1] }, store: 'jump', dead: P['proto.input.deadzone'], outer: P['proto.input.stickOuter'], aimDead: 2, holdSetup: P['proto.input.padSetupHoldSeconds'], stick: C.stick };

  // ---------- the HUD (screen space): the readout, the side view, help; touch controls on phones and tablets
  class Hud extends Phaser.Scene {
    constructor() { super('hud'); }
    create() {
      this.g = this.add.graphics(); this.sized = [];
      const st = (size, color, fam) => ({ fontFamily: fam || FONT, fontSize: Math.round(size * DPR) + 'px', color: color || COL.text, _base: size });
      const T = (s, style, depth) => { const t = this.add.text(0, 0, s, style).setDepth(depth || 1); this.sized.push([t, style._base]); return t; };
      this.title = T('DUMMIES · JUMP TEST · ' + (window.JUMP_BUILD || '').toUpperCase(), st(12, COL.acc));
      this.info = T('', st(11, COL.text, FONT2)).setLineSpacing(3);
      this.chartT = T('SIDE VIEW · HEIGHT OVER DISTANCE FROM TAKE-OFF', st(10, COL.dim));
      this.labels = Array.from({ length: 12 }, () => T('', st(9, COL.dim, FONT2)).setOrigin(0, 0.5));
      this.helpBox = T('', st(11, COL.text, FONT2), 20).setLineSpacing(4).setOrigin(0.5).setBackgroundColor('#0b1016f0');
      this.prompt = T('', st(14, COL.acc), 21).setOrigin(0.5).setAlign('center').setBackgroundColor('#0b1016f0');
      this.rotate = T('TURN YOUR PHONE SIDEWAYS\n\nTHE JUMP TEST PLAYS IN LANDSCAPE', st(13, COL.acc), 31).setOrigin(0.5).setAlign('center');
      this.btn = { a: T('A', st(18, COL.text, FONT2), 3).setOrigin(0.5), aw: T('DASH', st(8, '#f5c542'), 3).setOrigin(0.5), b: T('B', st(18, COL.text, FONT2), 3).setOrigin(0.5), bw: T('JUMP', st(8, COL.dim), 3).setOrigin(0.5) };
      try { S.touchOn = /(^#|[#&])touch\b/.test(location.hash) || matchMedia('(hover: none) and (pointer: coarse)').matches; } catch (e) { S.touchOn = false; }
      S.touch = { move: { x: 0, y: 0, m: 0 }, aQ: 0, bQ: 0, down: {} }; this.pt = new Map(); this.base = null; this.knob = null;
      this.input.on('pointerdown', (p) => this.down(p)); this.input.on('pointermove', (p) => this.moveP(p));
      this.input.on('pointerup', (p) => this.up(p)); this.input.on('pointerupoutside', (p) => this.up(p));
      this.scale.on('resize', () => this.layout()); this.layout();
    }
    layout() { // wide: the yard left, a panel column right; tall: the yard on top, the panels below
      const w = this.scale.width, h = this.scale.height, u = DPR * Math.max(0.75, Math.min(1.1, Math.min(w / DPR / 1100, h / DPR / 620))); this.u = u;
      for (const [t, base] of this.sized) t.setFontSize(Math.round(base * u) + 'px');
      S.portrait = S.touchOn && h > w;
      const wide = w / h > 1.25, pw = wide ? Math.max(280 * u, w * 0.3) : w, ph = wide ? h : Math.max(240 * u, h * 0.42);
      S.view = wide ? { x: 0, y: 0, w: Math.round(w - pw), h } : { x: 0, y: 0, w, h: Math.round(h - ph) };
      this.P = wide ? { x: w - pw, y: 0, w: pw, h } : { x: 0, y: h - ph, w, h: ph };
      const pad = 12 * u, X0 = this.P.x + pad, chW = this.P.w - 2 * pad;
      // touch sizes in CSS px from the registry, shrunk on short screens: the stick bottom left, A and B bottom right
      const tk = DPR * Math.min(1, h / DPR / 480), m = P['ui.touch.margin'] * DPR, br = P['ui.touch.faceRadius'] * 1.2 * tk, sr = P['ui.touch.stickRadius'] * tk;
      this.L = { a: { x: w - m - br, y: h - m - br, r: br }, b: { x: w - m - br * 2.25, y: h - m - br * 2.55, r: br * 0.86 }, home: { x: m + sr, y: h - m - sr }, sr };
      this.title.setPosition(X0, this.P.y + pad); this.info.setPosition(X0, this.P.y + pad + 20 * u).setWordWrapWidth(wide ? chW : chW * 0.46, true);
      let chH = Math.min(150 * u, this.P.h * 0.36), chY = wide ? this.P.y + this.P.h * 0.5 : this.P.y + pad + 14 * u;
      if (S.touchOn && wide) { chH = Math.min(chH, 96 * u); chY = Math.min(chY, this.L.b.y - this.L.b.r - 12 * DPR - chH); } // above B
      this.chart = { x: X0, y: chY, w: wide ? chW : chW * 0.5, h: chH };
      if (!wide) { this.title.setPosition(this.P.x + pad + chW * 0.54, this.P.y + pad); this.info.setPosition(this.P.x + pad + chW * 0.54, this.P.y + pad + 20 * u); }
      this.chartT.setPosition(this.chart.x, this.chart.y - 14 * u);
      this.helpBox.setPosition(w / 2, h / 2).setPadding(16 * u, 12 * u, 16 * u, 12 * u); this.prompt.setPosition(w / 2, h / 2).setPadding(20 * u, 14 * u, 20 * u, 14 * u); this.rotate.setPosition(w / 2, h / 2);
      this.key = w + 'x' + h;
    }
    down(p) {
      if (!S.touchOn || !p.wasTouch || S.portrait) return;
      const L = this.L, near = (c, k) => Math.hypot(p.x - c.x, p.y - c.y) <= c.r * k;
      if (near(L.a, 1.3)) { this.pt.set(p.id, 'a'); S.touch.aQ++; S.touch.down.a = true; return; }
      if (near(L.b, 1.3)) { this.pt.set(p.id, 'b'); S.touch.bQ++; S.touch.down.b = true; return; }
      if (p.x < this.scale.width * 0.45) { this.pt.set(p.id, 'stick'); this.base = { x: p.x, y: p.y }; this.stickAt(p); }
    }
    moveP(p) { if (this.pt.get(p.id) === 'stick') this.stickAt(p); }
    up(p) { const k = this.pt.get(p.id); this.pt.delete(p.id); if (k === 'stick') { this.base = null; this.knob = null; S.touch.move = { x: 0, y: 0, m: 0 }; } else if (k) S.touch.down[k] = false; }
    stickAt(p) { const R2 = this.L.sr, b = this.base; let dx = p.x - b.x, dy = p.y - b.y; const l = Math.hypot(dx, dy); if (l > R2) { b.x += dx / l * (l - R2); b.y += dy / l * (l - R2); dx = p.x - b.x; dy = p.y - b.y; } this.knob = { x: p.x, y: p.y }; S.touch.move = C.stick(dx / R2, dy / R2, P['proto.input.touchDeadzone'], P['proto.input.touchOuter']); }
    update() {
      const w = this.scale.width, h = this.scale.height; if (this.key !== w + 'x' + h) this.layout();
      const g = this.g, u = this.u, Pn = this.P; g.clear();
      g.fillStyle(0x0d131a, 1).fillRect(Pn.x, Pn.y, Pn.w, Pn.h); g.lineStyle(DPR, COL.uiEdge, 1).lineBetween(Pn.x, Pn.y, Pn.x, Pn.y + Pn.h);
      const L = S.last, sp = J.speeds(P), pd = S.pad;
      const dev = { keyboard: 'KEYS: WASD move · SPACE/K dash (A) · L/SHIFT jump (B)', pad: 'GAMEPAD' + (pd && pd.id ? ' · ' + pd.id.slice(0, 22) : '') + ': stick · A dash · B jump', touch: 'TOUCH: stick · A dash · B jump' }[S.device];
      const over = L ? L.over.map((o) => o.name + (o.ok ? ' ✓' : ' ✗')).join(' · ') || '—' : '—';
      this.info.setText([dev, S.touchOn ? null : '1 parked · 2 barriers · 3 ruler · 4 traffic · H help · R clear', '',
        L ? (L.kind === 'dash' ? 'LONG (DASH) JUMP' : L.kind.toUpperCase() + (L.clear ? ' JUMP' : ' HOP · CLEARS NOTHING')) + ' · ' + L.v0.toFixed(0) + ' u/s' : 'LAST JUMP —',
        L ? 'ground covered ' + L.d.toFixed(0) + ' · top ' + L.top.toFixed(0) + ' · ' + L.T + ' s' : '',
        'over: ' + over, '',
        'take-off → distance (× ' + P['upgrades.jumpAirtime'] + ' s):',
        'stand 0 · walk ' + J.reach(P, sp.walk).toFixed(0) + ' · run ' + J.reach(P, sp.run).toFixed(0) + ' · dash ' + J.reach(P, sp.dash).toFixed(0),
        'jumps ' + S.jumps + ' · cars hit ' + S.hits].filter((l) => l != null).join('\n'));
      // the side view: the arcs of a walk, run and dash jump; the last flights; the heights to clear
      const c = this.chart, X1 = Math.max(180, J.reach(P, sp.dash) + 10), Y1 = Math.max(50, P['upgrades.jumpHeight'] + 6), mx = (d) => c.x + d / X1 * c.w, my = (zz) => c.y + c.h - zz / Y1 * c.h;
      g.fillStyle(0x0b1016, 1).fillRect(c.x, c.y, c.w, c.h); g.lineStyle(DPR, COL.uiEdge, 1).strokeRect(c.x, c.y, c.w, c.h);
      const lines = [[JH, 'HANDRAIL · PLANTER ' + JH, COL.rail], [SEDAN.h, 'SEDAN ' + SEDAN.h.toFixed(1), COL.car], [VAN.h, 'VAN ' + VAN.h.toFixed(1), COL.car], [BUS.h, 'BUS ' + BUS.h.toFixed(1), COL.hit]];
      lines.sort((p1, p2) => p1[0] - p2[0]);
      let li = 0, lastY = 1e9;
      for (const [zz, lab, colr] of lines) { const y = my(zz); g.lineStyle(DPR, colr, 0.45).lineBetween(c.x, y, c.x + c.w, y); const t = this.labels[li++]; let ty = y - 7 * u; if (Math.abs(ty - lastY) < 11 * u) ty = lastY - 11 * u; lastY = ty; t.setText(lab).setPosition(c.x + 4 * u, ty).setVisible(true); }
      for (let d = 0; d <= X1; d += 32) { const x = mx(d); g.lineStyle(DPR, COL.grid, 1).lineBetween(x, c.y + c.h, x, c.y + c.h - 4 * u); }
      const arc = (v, colr, a, wid) => { g.lineStyle(wid * DPR, colr, a); g.beginPath(); for (let i = 0; i <= 40; i++) { const t = i / 40 * P['upgrades.jumpAirtime'], x = mx(v * t), y = my(J.z({ T: P['upgrades.jumpAirtime'], H: P['upgrades.jumpHeight'] }, t)); if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.strokePath(); };
      arc(sp.walk, 0x8796a3, 0.5, 1); arc(sp.run, 0x8796a3, 0.7, 1); arc(sp.dash, 0xf5c542, 0.6, 1);
      const tl = this.labels; tl[li++].setText('WALK').setPosition(mx(J.reach(P, sp.walk)) - 26 * u, c.y + c.h - 8 * u).setVisible(true); tl[li++].setText('RUN').setPosition(mx(J.reach(P, sp.run)) - 22 * u, c.y + c.h - 8 * u).setVisible(true); tl[li++].setText('DASH').setPosition(mx(J.reach(P, sp.dash)) - 28 * u, c.y + c.h - 8 * u).setVisible(true);
      S.flights.forEach((f, i) => { const last = i === S.flights.length - 1; g.lineStyle((last ? 3 : 1.5) * DPR, COL.accent, last ? 1 : 0.35); g.beginPath(); f.samples.forEach((q, k) => { if (k) g.lineTo(mx(q[0]), my(q[1])); else g.moveTo(mx(q[0]), my(q[1])); }); g.strokePath(); });
      for (; li < this.labels.length; li++) this.labels[li].setVisible(false);
      // touch controls, phones and tablets only: the stick (floats to the thumb) and A, B, in the yard's night glass
      const show = S.touchOn && !S.portrait; for (const t of Object.values(this.btn)) t.setVisible(show);
      if (show) {
        const Lc = this.L, R2 = Lc.sr, b = this.base || Lc.home, tm = S.touch.move;
        g.fillStyle(0x0b1016, 0.75).fillCircle(b.x, b.y, R2); g.lineStyle(2 * DPR, COL.accent, 0.8).strokeCircle(b.x, b.y, R2);
        for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; g.lineStyle(DPR * (i % 2 ? 1 : 2), 0x8796a3, 0.8).lineBetween(b.x + Math.cos(a) * R2 * 0.82, b.y + Math.sin(a) * R2 * 0.82, b.x + Math.cos(a) * R2 * 0.94, b.y + Math.sin(a) * R2 * 0.94); }
        const kn = this.knob || b; let kx = kn.x - b.x, ky = kn.y - b.y; const kl = Math.hypot(kx, ky); if (kl > R2 * 0.62) { kx *= R2 * 0.62 / kl; ky *= R2 * 0.62 / kl; }
        g.fillStyle(tm.m > 0 ? 0x1840c8 : 0x1c2a4a, 1).fillCircle(b.x + kx, b.y + ky, R2 * 0.4); g.lineStyle(1.5 * DPR, COL.accent, 1).strokeCircle(b.x + kx, b.y + ky, R2 * 0.4);
        for (const [k2, colr] of [['a', COL.dummy], ['b', COL.accent]]) { const q = Lc[k2], dn = S.touch.down[k2]; g.fillStyle(dn ? 0x1840c8 : 0x1c2a4a, 0.95).fillCircle(q.x, q.y, q.r); g.lineStyle((k2 === 'a' ? 3 : 1.75) * DPR, colr, 1).strokeCircle(q.x, q.y, q.r - DPR); this.btn[k2].setPosition(q.x, q.y - q.r * 0.12); this.btn[k2 + 'w'].setPosition(q.x, q.y + q.r * 0.5); }
      }
      this.rotate.setVisible(!!S.portrait);
      if (S.portrait) g.fillStyle(0x0b1016, 1).fillRect(0, 0, w, h);
      this.prompt.setVisible(!!(pd && pd.setup)); if (pd && pd.setup) this.prompt.setText('GAMEPAD SETUP\nPress the button for ' + (pd.setup === 'a' ? 'DASH (A)' : 'JUMP (B)') + '\nG or ESC cancels');
      this.helpBox.setVisible(S.help).setText(['THE JUMP, AFTER LINK\'S AWAKENING', '', 'The jump keeps the speed you jump with:', '  standing: straight up · walking ' + sp.walk + ' · running ' + sp.run, '  during a dash (B in a dash): a long jump at ' + sp.dash + ' (the cap)', 'Always ' + P['upgrades.jumpHeight'] + ' high at the top, ' + P['upgrades.jumpAirtime'] + ' s in the air.', 'A normal jump steers in the air; a dash jump holds its line.', 'Landing keeps the speed. Clear a car or a barrier only above its top.', 'Run to clear: a standing or walking jump is a hop and clears nothing.', 'Diagonal: the way across is longer. A rail at 45° takes 1.41 × its depth + body.', 'Into oncoming traffic, a car passes under faster; with the traffic, slower.', '', 'Keys: WASD · SPACE/K dash · L/SHIFT jump · G pad setup · 1–4 places · R clear · H help'].join('\n'));
    }
  }

  function start() {
    const host = document.getElementById('game'), size = () => [Math.max(1, host.clientWidth), Math.max(1, host.clientHeight)], [w0, h0] = size();
    window.JUMP_GAME = new Phaser.Game({
      type: /[?&]canvas\b/.test(location.search) ? Phaser.CANVAS : Phaser.AUTO, parent: 'game', backgroundColor: '#0b1016',
      scale: { mode: Phaser.Scale.NONE, width: w0 * DPR, height: h0 * DPR, zoom: 1 / DPR },
      input: { activePointers: 4, keyboard: true, mouse: true, touch: true, gamepad: false },
      render: { antialias: true, roundPixels: true }, scene: [Yard, Hud],
    });
    const fitHost = () => { const [w, h] = size(); const g = window.JUMP_GAME; if (!g || !g.isBooted || !g.canvas) return; if (g.scale.width !== w * DPR || g.scale.height !== h * DPR) { g.scale.resize(w * DPR, h * DPR); g.scale.setZoom(1 / DPR); } };
    window.addEventListener('resize', fitHost); if (window.ResizeObserver) new ResizeObserver(fitHost).observe(host);
  }
  const ready = document.fonts && document.fonts.load ? Promise.race([Promise.all([document.fonts.load("12px 'Silkscreen'"), document.fonts.load("12px 'IBM Plex Mono'")]), new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
  ready.then(start, start);
})();
