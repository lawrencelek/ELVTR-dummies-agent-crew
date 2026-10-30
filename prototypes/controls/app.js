// DUMMIES controls prototype (GDD Edits 73–74): a small Phaser yard to test touch, gamepad and keyboard/mouse, and three turn
// models (core.js). Traffic to lunge at, cones to grab, a slalom to turn through. P: registry values (build.js).
// Gamepads: pads.js. Touch: landscape only; an analog stick in the left column, B and A in the right; the yard between.
(function () {
  'use strict';
  const P = window.CTRL_P, C = window.CTRL, PADS = window.PADS, DEG = Math.PI / 180, W = 960, H = 540;
  const DPR = Math.min(3, Math.max(1, window.devicePixelRatio || 1)); window.CTRL_DPR = DPR; // the canvas runs at device pixels; CSS sizes × DPR
  const COL = { ground: 0x111820, grid: 0x17212b, road: 0x1a2129, lane: 0xc9d4db, kerb: 0x34404b, dummy: 0xf5c542, dummyEdge: 0x3a2c08,
    cone: 0xff8a2a, coneBand: 0xf2f4f5, car: 0xe6ecf0, carEdge: 0x7fe3ff, tag: 0x1d4fd8, amber: 0xff9a1f, input: 0x7fe3ff,
    hit: 0xff4fd8, post: 0x9aa7b2, line: 0x57e389, ui: 0x0b1016, uiEdge: 0x2c3a47, uiText: '#dfe7ec', uiDim: '#8796a3', uiAcc: '#7fe3ff' };
  const FONT = "'Silkscreen', 'Courier New', monospace", FONT2 = "'IBM Plex Mono', 'Courier New', monospace";
  const S = { // shared between the yard and the HUD
    model: P['proto.turnModel'], device: (navigator.maxTouchPoints || 0) > 0 ? 'touch' : 'keyboard', pad: null, touchOn: (navigator.maxTouchPoints || 0) > 0, help: false,
    lunges: 0, hits: 0, lastErr: null, offNow: 0, lap: null, best: null, uiHit: false, mouse: null,
    touch: { move: { x: 0, y: 0, m: 0 }, lungeQ: 0, grabQ: 0, lungeDown: false, grabDown: false },
    safe: { l: 0, r: 0, t: 0, b: 0 }, view: null, portrait: false, padCmd: null, padBlocked: false, padSeen: 0,
  };
  const PADCFG = { dead: P['proto.input.deadzone'], outer: P['proto.input.stickOuter'], aimDead: P['proto.input.aimDeadzone'], holdSetup: P['proto.input.padSetupHoldSeconds'], stick: C.stick };
  window.CTRL_STATE = S; // for the tests

  // ---------- the yard
  const ROAD = { y0: 44, lanes: 2 }, LW = P['world.laneWidth'];
  const LANE_Y = [ROAD.y0 + LW / 2, ROAD.y0 + LW * 1.5]; // upper lane runs west, lower lane east
  const POSTS = [[470, 345], [550, 445], [630, 345], [710, 445], [790, 345]].map(([x, y]) => ({ x, y, r: 9 }));
  const START_X = 400, FINISH_X = 870, LAP_Y0 = 290, LAP_Y1 = 510;
  const CONE_HOMES = [[110, 310], [170, 360], [110, 420], [230, 300], [230, 450]];
  const VS = P['vehicles.scale'];
  const CLASSES = [
    { cls: 'sedan', L: P['vehicles.sedan.length'] * VS, Wd: P['vehicles.sedan.width'] * VS, v: P['vehicles.sedan.cruiseSpeed'], tag: 'S01' },
    { cls: 'van', L: P['vehicles.van.length'] * VS, Wd: P['vehicles.van.width'] * VS, v: P['vehicles.van.cruiseSpeed'], tag: 'V02' },
  ];
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  class Yard extends Phaser.Scene {
    constructor() { super('yard'); }
    create() {
      this.body = C.newBody(300, 300, 0);
      this.cones = CONE_HOMES.map(([x, y], i) => ({ id: i, x, y, held: false }));
      this.cars = []; this.spawnT = [0.4, 1.6]; this.trail = []; this.pops = []; this.pads = PADS.create(); this.mouseQ = { lunge: 0, grab: 0 };
      // Chrome and Edge list a pad only after a button on it is pressed while the page is open
      this.onPad = (e) => { S.padSeen++; this.pop(this.body.x, this.body.y - 24, e.type === 'gamepadconnected' ? 'GAMEPAD CONNECTED' : 'GAMEPAD GONE', '#7fe3ff'); };
      window.addEventListener('gamepadconnected', this.onPad); window.addEventListener('gamepaddisconnected', this.onPad);
      this.drawStatic();
      this.g = this.add.graphics();
      this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
      this.input.keyboard.addCapture('SPACE,TAB,UP,DOWN,LEFT,RIGHT');
      this.keyQ = { lunge: 0, grab: 0 }; // presses are queued from key events, so a tap shorter than a frame still counts
      this.input.keyboard.on('keydown', (e) => {
        if (e.repeat) return;
        switch (e.code) {
          case 'Space': case 'KeyJ': this.keyQ.lunge++; break;
          case 'KeyE': case 'KeyK': case 'ShiftLeft': case 'ShiftRight': this.keyQ.grab++; break;
          case 'Digit1': S.model = 1; break; case 'Digit2': S.model = 2; break; case 'Digit3': S.model = 3; break;
          case 'Tab': S.model = (S.model % 3) + 1; break; case 'KeyH': S.help = !S.help; break;
          case 'KeyT': S.touchOn = !S.touchOn; break; case 'KeyR': this.resetScores(); break;
          case 'KeyP': S.padCmd = this.pads.setup ? 'cancel' : 'setup'; return;
          case 'Escape': if (this.pads.setup) S.padCmd = 'cancel'; else S.help = false; return;
          default: return;
        }
        if (S.device === 'touch' || S.device === 'gamepad') S.device = 'keyboard';
      });
      this.input.mouse.disableContextMenu();
      this.input.on('pointermove', (p) => { if (!p.wasTouch) { S.mouse = { x: p.worldX, y: p.worldY, t: this.time.now }; } });
      this.input.on('pointerdown', (p) => { if (p.wasTouch) { S.touchOn = true; S.device = 'touch'; return; } S.mouse = { x: p.worldX, y: p.worldY, t: this.time.now }; if (p.rightButtonDown()) this.mouseQ.grab++; else this.mouseQ.lunge++; });
      this.scale.on('resize', () => this.fit()); this.fit();
      this.popText = this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '14px', color: '#ff4fd8', resolution: 2 * DPR }).setOrigin(0.5).setAlpha(0);
      this.scene.launch('hud');
    }
    fit() { // computer: the whole yard on screen, centred. Touch: the yard between the two control columns, following the dummy
      const v = S.touchOn && S.view ? S.view : { x: 0, y: 0, w: this.scale.width, h: this.scale.height }, cam = this.cameras.main;
      if (cam.x !== v.x || cam.y !== v.y || cam.width !== v.w || cam.height !== v.h) cam.setViewport(v.x, v.y, v.w, v.h);
      const w = v.w, h = v.h, fitZ = Math.min(w / W, h / H);
      const z = S.touchOn ? Math.max(fitZ, h / P['ui.touch.viewHeight']) : fitZ; // about ui.touch.viewHeight units tall
      if (Math.abs(cam.zoom - z) > 1e-4) cam.setZoom(z);
      if (z > fitZ + 1e-4) { cam.setBounds(0, 0, W, H); cam.centerOn(this.body ? this.body.x : W / 2, this.body ? this.body.y : H / 2); }
      else { cam.removeBounds(); cam.centerOn(W / 2, H / 2); }
    }
    drawStatic() {
      const g = this.add.graphics();
      g.fillStyle(COL.ground).fillRect(0, 0, W, H);
      g.lineStyle(1, COL.grid, 1); for (let x = 0; x <= W; x += 40) g.lineBetween(x, 0, x, H); for (let y = 0; y <= H; y += 40) g.lineBetween(0, y, W, y);
      g.fillStyle(COL.road).fillRect(0, ROAD.y0, W, LW * 2);
      g.fillStyle(COL.kerb).fillRect(0, ROAD.y0 - 4, W, 4).fillRect(0, ROAD.y0 + LW * 2, W, 4);
      g.fillStyle(COL.lane); for (let x = 8; x < W; x += 48) g.fillRect(x, ROAD.y0 + LW - 1, 24, 2);
      g.lineStyle(2, COL.line, 0.8).lineBetween(START_X, LAP_Y0, START_X, LAP_Y1); g.lineStyle(2, COL.hit, 0.8).lineBetween(FINISH_X, LAP_Y0, FINISH_X, LAP_Y1);
      g.lineStyle(1, COL.kerb, 1).strokeRect(START_X, LAP_Y0, FINISH_X - START_X, LAP_Y1 - LAP_Y0);
      for (const q of POSTS) { g.fillStyle(COL.post).fillCircle(q.x, q.y, q.r); g.fillStyle(COL.ground).fillCircle(q.x, q.y, 3); }
      g.lineStyle(1, COL.kerb, 1).strokeRect(70, 270, 210, 220);
      const lab = (x, y, s) => this.add.text(x, y, s, { fontFamily: FONT, fontSize: '11px', color: '#8796a3', resolution: 2 * DPR });
      lab(8, ROAD.y0 + LW * 2 + 8, 'TRAFFIC · LUNGE INTO A FLANK');
      lab(74, 274, 'CONES · GRAB, CARRY, DROP');
      lab(START_X + 4, LAP_Y0 + 4, 'SLALOM · START');
      lab(FINISH_X - 50, LAP_Y0 + 4, 'FINISH');
    }
    // ---------- input: keyboard, mouse, gamepad, touch, merged into one intent
    gather() {
      const k = this.keys, now = this.time.now;
      let move = { x: 0, y: 0, m: 0 }, aim = null, lunge = 0, grab = 0;
      const kx = (k.D.isDown || k.RIGHT.isDown ? 1 : 0) - (k.A.isDown || k.LEFT.isDown ? 1 : 0), ky = (k.S.isDown || k.DOWN.isDown ? 1 : 0) - (k.W.isDown || k.UP.isDown ? 1 : 0);
      if (kx || ky) { const l = Math.hypot(kx, ky); move = { x: kx / l, y: ky / l, m: 1 }; S.device = S.mouse && now - S.mouse.t < P['proto.input.mouseAimSeconds'] * 1000 ? 'mouse' : 'keyboard'; }
      lunge += this.keyQ.lunge; grab += this.keyQ.grab; this.keyQ.lunge = this.keyQ.grab = 0;
      // mouse: aims while it has moved lately; left click lunges, right click grabs (unless the click was on a HUD button)
      if (S.mouse && now - S.mouse.t < P['proto.input.mouseAimSeconds'] * 1000) {
        const dx = S.mouse.x - this.body.x, dy = S.mouse.y - this.body.y, l = Math.hypot(dx, dy);
        if (l > 6) aim = { x: dx / l, y: dy / l };
        if (S.device === 'keyboard' || S.device === 'mouse') S.device = 'mouse';
      }
      if (!S.uiHit) { lunge += this.mouseQ.lunge; grab += this.mouseQ.grab; }
      this.mouseQ.lunge = this.mouseQ.grab = 0; S.uiHit = false;
      // gamepad (pads.js): every connected pad; the last one used drives. Standard or not; hat d-pads; buttons set up by the player.
      if (S.padCmd === 'setup') PADS.startSetup(this.pads); else if (S.padCmd === 'cancel') this.pads.setup = null; S.padCmd = null;
      let list = null;
      try { list = navigator.getGamepads ? navigator.getGamepads() : null; S.padBlocked = false; } catch (e) { list = null; S.padBlocked = true; } // a hosting page may refuse the feature
      const gp = PADS.read(this.pads, list, PADCFG, this.dtNow || 0.016); S.pad = gp;
      if (gp.setup) S.device = 'gamepad';
      else if (gp.id) {
        if (gp.move) { move = gp.move; S.device = 'gamepad'; }
        if (gp.aim) { aim = gp.aim; S.device = 'gamepad'; }
        if (gp.lunge) { lunge++; S.device = 'gamepad'; } if (gp.grab) { grab++; S.device = 'gamepad'; }
        if (gp.sel) S.model = (S.model % 3) + 1; if (gp.start) S.help = !S.help;
      }
      // touch: the HUD's analog stick (direction at any angle; speed by deflection) and buttons
      const tm = S.touch.move;
      if (tm.m > 0) { move = { x: tm.x, y: tm.y, m: tm.m }; S.device = 'touch'; }
      lunge += S.touch.lungeQ; grab += S.touch.grabQ; if (S.touch.lungeQ || S.touch.grabQ) S.device = 'touch';
      S.touch.lungeQ = S.touch.grabQ = 0;
      if (S.portrait) return { mx: 0, my: 0, m: 0, aim: null, lunge: false, grab: false }; // upright phone: the game waits
      return { mx: move.x, my: move.y, m: move.m, aim, lunge: lunge > 0, grab: grab > 0 };
    }
    resetScores() { S.lunges = 0; S.hits = 0; S.best = null; S.lap = null; S.lastErr = null; }
    update(time, delta) {
      const dt = Math.min(0.05, delta / 1000), b = this.body; this.dtNow = dt; const it = this.gather();
      const ev = C.step(b, it, dt, P, S.model);
      for (const e of ev) {
        if (e.type === 'lunge') { S.lunges++; S.lastErr = e.err; }
        if (e.type === 'grab') this.grab();
      }
      // facing against the player's intent, while moving
      const want = it.aim ? Math.atan2(it.aim.y, it.aim.x) : it.m > 0 ? Math.atan2(it.my, it.mx) : null;
      S.offNow = want == null ? 0 : Math.abs(C.wrap(want - b.facing)) / DEG; S.want = want; S.planted = b.planted;
      this.collide(); this.stepCars(dt); this.stepLap();
      if (b.held) { const r = P['body.radius'] + P['props.cone.radius'] + 2; b.held.x = b.x + Math.cos(b.facing) * r; b.held.y = b.y + Math.sin(b.facing) * r; }
      this.trail.push({ x: b.x, y: b.y, t: time }); while (this.trail.length && time - this.trail[0].t > 4000) this.trail.shift();
      this.fit(); this.draw(time);
    }
    grab() {
      const b = this.body;
      if (b.held) { const r = P['body.radius'] + P['props.cone.radius'] + 4; b.held.x = b.x + Math.cos(b.facing) * r; b.held.y = b.y + Math.sin(b.facing) * r; b.held.held = false; b.held = null; return; }
      let best = null, bd = Infinity;
      for (const cn of this.cones) { if (cn.held) continue; const edge = Math.hypot(cn.x - b.x, cn.y - b.y) - P['body.radius'] - P['props.cone.radius']; if (edge <= P['props.cone.pickupEdgeRange'] && edge < bd) { bd = edge; best = cn; } }
      if (best) { best.held = true; b.held = best; } else this.pop(b.x, b.y - 24, 'NOTHING TO GRAB', '#8796a3');
    }
    collide() {
      const b = this.body, r = P['body.radius'];
      for (const q of POSTS) { const dx = b.x - q.x, dy = b.y - q.y, d = Math.hypot(dx, dy), m = r + q.r; if (d < m && d > 1e-6) { b.x = q.x + (dx / d) * m; b.y = q.y + (dy / d) * m; } }
      b.x = C.clamp(b.x, r, W - r); b.y = C.clamp(b.y, r, H - r);
    }
    stepCars(dt) {
      const b = this.body, r = P['body.radius'];
      for (let ln = 0; ln < 2; ln++) {
        this.spawnT[ln] -= dt;
        if (this.spawnT[ln] <= 0) {
          const k = CLASSES[rnd() < 0.7 ? 0 : 1], dir = ln === 0 ? -1 : 1;
          this.cars.push({ x: dir > 0 ? -k.L : W + k.L, y: LANE_Y[ln], dir, L: k.L, Wd: k.Wd, vmax: k.v, v: k.v, tag: k.tag, cls: k.cls, hitT: 0, stopT: 0 });
          this.spawnT[ln] = 1.8 + rnd() * 2.2;
        }
      }
      for (const c of this.cars) {
        c.hitT = Math.max(0, c.hitT - dt); c.stopT = Math.max(0, c.stopT - dt);
        const ahead = (b.x - c.x) * c.dir, inLane = Math.abs(b.y - c.y) < c.Wd / 2 + r;
        const block = inLane && ahead > 0 && ahead < c.L / 2 + r + 26 + c.v * c.v / (2 * 400) && b.mode !== 'lunge'; // drivers stop for a dummy in the lane
        const back = this.cars.some((o) => o !== c && o.y === c.y && (o.x - c.x) * c.dir > 0 && (o.x - c.x) * c.dir < (o.L + c.L) / 2 + 14);
        const vt = c.stopT > 0 || block || back ? 0 : c.vmax;
        c.v = vt < c.v ? Math.max(vt, c.v - 400 * dt) : Math.min(vt, c.v + 90 * dt);
        c.x += c.v * c.dir * dt;
        // contact: the dummy's circle against the car's box
        const nx = C.clamp(b.x, c.x - c.L / 2, c.x + c.L / 2), ny = C.clamp(b.y, c.y - c.Wd / 2, c.y + c.Wd / 2), dx = b.x - nx, dy = b.y - ny, d = Math.hypot(dx, dy);
        if (d < r) {
          const ux = d > 1e-6 ? dx / d : 0, uy = d > 1e-6 ? dy / d : (b.y < c.y ? -1 : 1);
          if (b.mode === 'lunge' && c.hitT === 0) {
            S.hits++; c.hitT = 0.5; c.stopT = 1.2; this.pop(nx, ny - 16, c.tag + ' HIT', '#ff4fd8'); this.cameras.main.shake(90, 0.004);
          } else if (c.hitT === 0 && b.mode !== 'knock') c.stopT = 0.6;
          b.mode = 'knock'; b.knockT = 0; b.knockVx = ux * 140; b.knockVy = uy * 140; b.lunge = null;
          b.x = nx + ux * (r + 0.5); b.y = ny + uy * (r + 0.5);
        }
      }
      this.cars = this.cars.filter((c) => c.x > -120 && c.x < W + 120);
    }
    stepLap() {
      const b = this.body, inBand = b.y > LAP_Y0 && b.y < LAP_Y1, now = this.time.now / 1000;
      if (inBand && this.prevX != null && this.prevX < START_X && b.x >= START_X) S.lap = { t0: now };
      if (S.lap && S.lap.t0 != null && S.lap.t == null && inBand && this.prevX < FINISH_X && b.x >= FINISH_X) { S.lap.t = now - S.lap.t0; if (S.best == null || S.lap.t < S.best) S.best = S.lap.t; }
      if (S.lap && S.lap.t == null) S.lap.run = now - S.lap.t0;
      this.prevX = b.x;
    }
    pop(x, y, s, color) { this.pops.push({ x, y, s, color, t: this.time.now }); }
    draw(time) {
      const g = this.g, b = this.body, r = P['body.radius']; g.clear();
      for (let i = 1; i < this.trail.length; i++) { const a = this.trail[i - 1], q = this.trail[i], f = 1 - (time - q.t) / 4000; g.lineStyle(2, COL.input, 0.15 + 0.5 * f).lineBetween(a.x, a.y, q.x, q.y); }
      for (const cn of this.cones) { g.fillStyle(0x000000, 0.35).fillEllipse(cn.x + 2, cn.y + 4, 16, 8); g.fillStyle(COL.cone).fillTriangle(cn.x, cn.y - 11, cn.x - 7, cn.y + 4, cn.x + 7, cn.y + 4); g.fillStyle(COL.coneBand).fillRect(cn.x - 4, cn.y - 4, 8, 3); }
      for (const c of this.cars) {
        g.fillStyle(0x000000, 0.35).fillRect(c.x - c.L / 2 + 3, c.y - c.Wd / 2 + 4, c.L, c.Wd);
        g.fillStyle(c.hitT > 0 && Math.floor(time / 60) % 2 ? COL.hit : COL.car).fillRoundedRect(c.x - c.L / 2, c.y - c.Wd / 2, c.L, c.Wd, 4);
        g.lineStyle(1, COL.carEdge, 0.9).strokeRoundedRect(c.x - c.L / 2, c.y - c.Wd / 2, c.L, c.Wd, 4);
        g.fillStyle(0x0e3a4f).fillRect(c.x + c.dir * (c.L / 2 - 14) - 3, c.y - c.Wd / 2 + 3, 6, c.Wd - 6);
        if (c.v < c.vmax - 5) { g.fillStyle(0xff3b3b, 0.9); g.fillRect(c.x - c.dir * (c.L / 2) - 2, c.y - c.Wd / 2 + 2, 3, 4); g.fillRect(c.x - c.dir * (c.L / 2) - 2, c.y + c.Wd / 2 - 6, 3, 4); }
      }
      // the dummy: shadow, body, facing (yellow) and the player's intent (cyan)
      g.fillStyle(0x000000, 0.35).fillEllipse(b.x + 3, b.y + 5, r * 2.2, r * 1.2);
      if (b.mode === 'lunge') { g.lineStyle(3, COL.dummy, 0.35).lineBetween(b.x - Math.cos(b.facing) * 30, b.y - Math.sin(b.facing) * 30, b.x, b.y); }
      if (b.planted) { g.fillStyle(COL.amber, 0.9).fillCircle(b.x - 6, b.y + 8, 2.5).fillCircle(b.x + 6, b.y + 8, 2.5); }
      g.fillStyle(COL.dummy).fillCircle(b.x, b.y, r); g.lineStyle(2, COL.dummyEdge, 1).strokeCircle(b.x, b.y, r);
      const fx = Math.cos(b.facing), fy = Math.sin(b.facing), px = -fy, py = fx;
      g.fillStyle(COL.dummyEdge).fillTriangle(b.x + fx * (r + 7), b.y + fy * (r + 7), b.x + fx * 4 + px * 6, b.y + fy * 4 + py * 6, b.x + fx * 4 - px * 6, b.y + fy * 4 - py * 6);
      g.fillStyle(COL.dummy).fillCircle(b.x + fx * 6 + px * 11, b.y + fy * 6 + py * 11, 4).fillCircle(b.x + fx * 6 - px * 11, b.y + fy * 6 - py * 11, 4); // hands
      if (S.want != null) { const wx = Math.cos(S.want), wy = Math.sin(S.want); g.lineStyle(2, COL.input, 0.95).lineBetween(b.x + wx * (r + 4), b.y + wy * (r + 4), b.x + wx * (r + 20), b.y + wy * (r + 20)); }
      if (b.held) { const cn = b.held; g.fillStyle(COL.cone).fillTriangle(cn.x, cn.y - 11, cn.x - 7, cn.y + 4, cn.x + 7, cn.y + 4); g.fillStyle(COL.coneBand).fillRect(cn.x - 4, cn.y - 4, 8, 3); }
      // pops
      this.pops = this.pops.filter((q) => time - q.t < 900);
      const last = this.pops[this.pops.length - 1];
      if (last) { this.popText.setText(last.s).setColor(last.color).setPosition(last.x, last.y - (time - last.t) * 0.02).setAlpha(1 - (time - last.t) / 900); } else this.popText.setAlpha(0);
    }
  }

  // ---------- the HUD (screen space): legend, turn-model switch, measures, pad status, touch controls.
  // Computer: the whole yard; HUD over its top corners. Touch (landscape only): a column each side, as in the game: the
  // analog stick in the left column, B above A in the right, the yard between them.
  class Hud extends Phaser.Scene {
    constructor() { super('hud'); }
    create() {
      this.g = this.add.graphics(); this.top = this.add.graphics().setDepth(10);
      this.sized = []; const st = (size, color, fam) => ({ fontFamily: fam || FONT, fontSize: Math.round(size * DPR) + 'px', color: color || COL.uiText, _base: size });
      const T = (x, y, s, style, depth) => { const t = this.add.text(x, y, s, style).setDepth(depth || 1); this.sized.push([t, style._base]); return t; };
      this.title = T(0, 0, 'DUMMIES · CONTROL TEST', st(13, COL.uiAcc));
      this.legend = T(0, 0, '', st(11, COL.uiText, FONT2)).setLineSpacing(3);
      this.meas = T(0, 0, '', st(11, COL.uiText, FONT2)).setLineSpacing(3);
      this.note = T(0, 0, '', st(11, COL.uiDim, FONT2)).setOrigin(1, 0).setAlign('right');
      this.mon = T(0, 0, '', st(10, COL.uiDim, FONT2)).setOrigin(0, 1);
      this.chips = [1, 2, 3].map((m) => ({ m, t: T(0, 0, C.MODELS[m].name, st(12, COL.uiText)).setOrigin(0.5), r: null }));
      this.small = { help: { t: T(0, 0, '?', st(13, COL.uiAcc)).setOrigin(0.5), r: null }, pad: { t: T(0, 0, 'PAD SETUP', st(11, COL.uiText)).setOrigin(0.5), r: null }, full: { t: T(0, 0, 'FULL', st(11, COL.uiText)).setOrigin(0.5), r: null } };
      this.btnT = { a: T(0, 0, 'A', st(20, '#0b1016')).setOrigin(0.5), aw: T(0, 0, 'LUNGE', st(9, '#0b1016')).setOrigin(0.5), b: T(0, 0, 'B', st(18, '#0b1016')).setOrigin(0.5), bw: T(0, 0, 'GRAB', st(9, '#0b1016')).setOrigin(0.5) };
      this.helpBox = T(0, 0, '', st(12, COL.uiText, FONT2), 20).setLineSpacing(4).setOrigin(0.5).setAlign('left').setBackgroundColor('#0b1016f0');
      this.prompt = T(0, 0, '', st(15, COL.uiAcc), 21).setOrigin(0.5).setAlign('center').setLineSpacing(8).setBackgroundColor('#0b1016f0');
      this.rotate = T(0, 0, 'TURN YOUR PHONE SIDEWAYS\n\nDUMMIES PLAYS IN LANDSCAPE\n\ntap: full screen, where the phone allows', st(14, COL.uiAcc), 31).setOrigin(0.5).setAlign('center');
      this.pt = new Map(); // pointer id → control
      this.stick = { base: null, home: null, id: null };
      this.input.on('pointerdown', (p) => this.down(p));
      this.input.on('pointermove', (p) => this.moveP(p));
      this.input.on('pointerup', (p) => this.up(p)); this.input.on('pointerupoutside', (p) => this.up(p));
      this.scale.on('resize', () => this.layout()); this.layout();
    }
    readSafe() { // CSS safe-area insets, for controls at the screen's edges
      let el = document.getElementById('safe-probe');
      if (!el) { el = document.createElement('div'); el.id = 'safe-probe'; el.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)'; document.body.appendChild(el); }
      const cs = getComputedStyle(el); S.safe = { t: parseFloat(cs.paddingTop) || 0, r: parseFloat(cs.paddingRight) || 0, b: parseFloat(cs.paddingBottom) || 0, l: parseFloat(cs.paddingLeft) || 0 };
    }
    layout() {
      this.readSafe();
      const w = this.scale.width, h = this.scale.height, cw = w / DPR, ch = h / DPR, touch = S.touchOn;
      S.portrait = touch && h > w;
      const k = touch ? Math.max(0.78, Math.min(1, ch / P['ui.touch.viewHeight'])) : Math.max(0.72, Math.min(1, cw / 900, ch / 560)), u = DPR * k; this.u = u;
      for (const [t, base] of this.sized) t.setFontSize(Math.round(base * u) + 'px');
      const m = P['ui.touch.margin'] * DPR, sf = { l: S.safe.l * DPR, r: S.safe.r * DPR, t: S.safe.t * DPR, b: S.safe.b * DPR };
      const R = P['ui.touch.stickRadius'] * DPR, AR = P['ui.touch.lungeRadius'] * DPR, BR = P['ui.touch.grabRadius'] * DPR;
      const smallChip = (c, x, y, wd) => { c.r = { x, y, w: wd, h: 24 * u }; c.t.setPosition(x + wd / 2, y + 12 * u); };
      if (touch) {
        const colW = Math.max(2 * (R + m), 2 * AR + 2 * m + BR * 0.4), L0 = sf.l, L1 = sf.l + colW, R1 = w - sf.r, R0 = R1 - colW;
        this.cols = { L0, L1, R0, R1 };
        S.view = { x: Math.round(L1), y: 0, w: Math.max(1, Math.round(R0 - L1)), h };
        this.stick.home = { x: L0 + m + R, y: h - sf.b - m - R }; if (!this.stick.id) this.stick.base = Object.assign({}, this.stick.home);
        const A = { x: R1 - m - AR, y: h - sf.b - m - AR, r: AR }, B = { x: A.x - AR * 0.95, y: A.y - AR * 1.8, r: BR };
        B.x = Math.max(B.x, R0 + m * 0.5 + BR);
        this.L = { a: A, b: B, stickR: R };
        const x0 = L0 + 10 * u, y0 = sf.t + 10 * u;
        this.title.setPosition(x0, y0).setText('DUMMIES'); this.legend.setPosition(x0, y0 + 20 * u);
        let y = sf.t + 10 * u; const cwid = colW - 20 * u;
        for (const c of this.chips) { smallChip(c, R0 + 10 * u, y, cwid); y += 28 * u; }
        smallChip(this.small.help, R0 + 10 * u, y, cwid * 0.42); smallChip(this.small.full, R0 + 10 * u + cwid * 0.5, y, cwid * 0.5);
        this.small.pad.r = null;
        this.note.setPosition(R1 - 10 * u, y + 30 * u);
        this.mon.setPosition(x0, h - sf.b - 6 * u);
      } else {
        S.view = null; this.cols = null; this.stick.home = null;
        const x0 = sf.l + 14 * u, y0 = sf.t + 12 * u;
        this.title.setPosition(x0, y0).setText('DUMMIES · CONTROL TEST · ' + (window.CTRL_BUILD || '').toUpperCase()); this.legend.setPosition(x0, y0 + 22 * u);
        let cx = w - sf.r - 14 * u;
        smallChip(this.small.help, cx - 28 * u, y0 + 2 * u, 28 * u); cx -= 34 * u;
        smallChip(this.small.pad, cx - 92 * u, y0 + 2 * u, 92 * u); cx -= 98 * u;
        for (let i = this.chips.length - 1; i >= 0; i--) { const c = this.chips[i], cw2 = 74 * u; smallChip(c, cx - cw2, y0 + 2 * u, cw2); cx -= cw2 + 6 * u; }
        this.small.full.r = null;
        this.note.setPosition(w - sf.r - 14 * u, y0 + 34 * u);
        this.mon.setPosition(sf.l + 14 * u, h - sf.b - 10 * u);
        this.L = null;
      }
      this.btnT.a.setFontSize(Math.round(AR * 0.62) + 'px'); this.btnT.b.setFontSize(Math.round(BR * 0.62) + 'px');
      this.btnT.aw.setFontSize(Math.round(AR * 0.2) + 'px'); this.btnT.bw.setFontSize(Math.round(BR * 0.22) + 'px');
      this.helpBox.setPosition(w / 2, h / 2).setPadding(18 * u, 14 * u, 18 * u, 14 * u); this.prompt.setPosition(w / 2, h / 2).setPadding(24 * u, 18 * u, 24 * u, 18 * u);
      this.rotate.setPosition(w / 2, h / 2);
      this.lastSize = w + 'x' + h + ':' + touch;
    }
    inRect(c, p) { return c && c.r && c.t.visible && p.x >= c.r.x && p.x <= c.r.x + c.r.w && p.y >= c.r.y && p.y <= c.r.y + c.r.h; }
    hit(p) {
      if (S.portrait) return { kind: 'portrait' };
      for (const c of this.chips) if (this.inRect(c, p)) return { kind: 'chip', m: c.m };
      if (this.inRect(this.small.help, p)) return { kind: 'help' };
      if (this.inRect(this.small.pad, p)) return { kind: 'padsetup' };
      if (this.inRect(this.small.full, p)) return { kind: 'full' };
      if (!S.touchOn || !p.wasTouch || !this.L) return null;
      const near = (c, k) => Math.hypot(p.x - c.x, p.y - c.y) <= c.r * k;
      if (near(this.L.a, 1.3)) return { kind: 'a' };
      if (near(this.L.b, 1.3)) return { kind: 'b' };
      if (p.x < this.cols.L1 + this.L.stickR * 0.5 && p.y > this.scale.height * 0.3) return { kind: 'stick' }; // the left column takes the thumb
      return null;
    }
    fullscreen() { // optional: phones and some app views refuse it
      const el = document.documentElement;
      const lock = () => { try { const o = screen.orientation; if (o && o.lock) o.lock('landscape').catch(() => {}); } catch (e) { /* not offered */ } };
      try {
        if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
        if (el.requestFullscreen) el.requestFullscreen({ navigationUI: 'hide' }).then(lock, () => {}); else lock();
      } catch (e) { /* not offered */ }
    }
    down(p) {
      if (p.wasTouch) { if (!S.touchOn) { S.touchOn = true; } S.device = 'touch'; }
      const h = this.hit(p); if (!h) return;
      S.uiHit = true;
      if (h.kind === 'portrait') { this.fullscreen(); return; }
      if (h.kind === 'chip') { S.model = h.m; return; }
      if (h.kind === 'help') { S.help = !S.help; return; }
      if (h.kind === 'padsetup') { S.padCmd = 'setup'; return; }
      if (h.kind === 'full') { this.fullscreen(); return; }
      this.pt.set(p.id, h.kind);
      if (h.kind === 'a') { S.touch.lungeQ++; S.touch.lungeDown = true; }
      if (h.kind === 'b') { S.touch.grabQ++; S.touch.grabDown = true; }
      if (h.kind === 'stick') {
        const R = this.L.stickR, home = this.stick.home;
        // floating: the stick centres under the thumb, inside the left column; or stays home (proto.input.touchFloat 0)
        this.stick.base = P['proto.input.touchFloat'] ? { x: C.clamp(p.x, this.cols.L0 + R * 0.5, this.cols.L1), y: C.clamp(p.y, this.scale.height * 0.3, this.scale.height - R * 0.5) } : { x: home.x, y: home.y };
        this.stick.id = p.id; this.stickAt(p);
      }
    }
    moveP(p) { if (this.pt.get(p.id) === 'stick') this.stickAt(p); }
    up(p) {
      const k = this.pt.get(p.id); this.pt.delete(p.id);
      if (k === 'stick') { S.touch.move = { x: 0, y: 0, m: 0 }; this.stick.id = null; this.stick.knob = null; if (this.stick.home) this.stick.base = Object.assign({}, this.stick.home); }
      if (k === 'a') S.touch.lungeDown = false; if (k === 'b') S.touch.grabDown = false;
    }
    stickAt(p) { // analog: direction at any angle; speed by how far the thumb is from the centre
      const R = this.L.stickR, b = this.stick.base;
      let dx = p.x - b.x, dy = p.y - b.y; const l = Math.hypot(dx, dy);
      if (l > R) { b.x += (dx / l) * (l - R); b.y += (dy / l) * (l - R); dx = p.x - b.x; dy = p.y - b.y; } // the base follows a thumb that runs past the rim
      this.stick.knob = { x: p.x, y: p.y };
      S.touch.move = C.stick(dx / R, dy / R, P['proto.input.touchDeadzone'], P['proto.input.touchOuter']);
    }
    update() {
      const g = this.g, top = this.top, w = this.scale.width, h = this.scale.height, touch = S.touchOn;
      if (this.lastSize !== w + 'x' + h + ':' + touch) this.layout();
      const u = this.u; g.clear(); top.clear();
      const pd = S.pad, padLine = pd && pd.id ? 'GAMEPAD · ' + pd.id.slice(0, 26) + (pd.mapping === 'standard' ? '' : ' · no standard mapping') : null;
      const dev = S.device === 'gamepad' ? (padLine || 'GAMEPAD') : S.device === 'touch' ? 'TOUCH' : S.device === 'mouse' ? 'MOUSE + KEYS' : 'KEYBOARD';
      const LEG = {
        keyboard: 'WASD / arrows move · SPACE lunge · E grab\n1 2 3 or TAB turn model · H help',
        mouse: 'WASD move · mouse aims · L-click lunge · R-click grab\n1 2 3 or TAB turn model · H help',
        gamepad: 'stick / d-pad move · right stick aims · A lunge · B grab\nSELECT turn model · hold START to set up buttons',
        touch: 'stick moves · A lunge · B grab',
      };
      const padHint = touch || S.device === 'gamepad' ? '' : S.padBlocked ? '\nGamepads are blocked on this page: open the downloaded file' : pd && pd.count ? '\nGamepad found: move it or press a button to take over' : '\nGamepad: plug it in, then press any button on it';
      if (pd && pd.map && !pd.map.std) LEG.gamepad = 'd-pad / stick move · button ' + pd.map.lunge.join('/') + ' lunge · button ' + pd.map.grab.join('/') + ' grab\nhold START or press P to set up the buttons';
      if (touch) {
        this.legend.setText('TOUCH · ? help');
        this.meas.setText(['off input ' + S.offNow.toFixed(0) + '°' + (S.planted ? ' ·PLANT' : ''), 'lunge off ' + (S.lastErr == null ? '—' : S.lastErr.toFixed(0) + '°'), 'hits ' + S.hits + ' / ' + S.lunges, 'slalom ' + (S.lap ? (S.lap.t != null ? S.lap.t.toFixed(1) : (S.lap.run || 0).toFixed(1) + '…') : '—') + (S.best != null ? ' · ' + S.best.toFixed(1) : '')].join('\n'));
      } else {
        this.legend.setText(dev + '\n' + LEG[S.device] + padHint);
        const lap = S.lap ? (S.lap.t != null ? S.lap.t.toFixed(2) + ' s' : (S.lap.run || 0).toFixed(1) + ' s …') : '—';
        this.meas.setText([
          'facing off input  ' + S.offNow.toFixed(0).padStart(3) + '°' + (S.planted ? '  PLANTED' : ''),
          'last lunge off    ' + (S.lastErr == null ? '  —' : S.lastErr.toFixed(0).padStart(3) + '°'),
          'hits / lunges     ' + S.hits + ' / ' + S.lunges,
          'slalom            ' + lap + (S.best != null ? '   best ' + S.best.toFixed(2) + ' s' : ''),
        ].join('\n'));
      }
      this.meas.setPosition(this.legend.x, this.legend.y + this.legend.height + 8 * u);
      this.note.setText(touch ? '' : C.MODELS[S.model].label + '\n' + C.MODELS[S.model].note.replace(/\. /g, '.\n'));
      this.mon.setText(pd && pd.monitor ? (pd.count > 1 ? pd.count + ' pads · using ' : 'pad ') + pd.monitor : '').setVisible(!!(pd && pd.monitor) && !touch);
      // columns (touch) or panels (computer)
      if (touch && this.cols) {
        g.fillStyle(0x0d131a, 1).fillRect(0, 0, this.cols.L1, h).fillRect(this.cols.R0, 0, w - this.cols.R0, h);
        g.lineStyle(DPR, COL.uiEdge, 1).lineBetween(this.cols.L1, 0, this.cols.L1, h).lineBetween(this.cols.R0, 0, this.cols.R0, h);
      } else {
        g.fillStyle(COL.ui, 0.72).fillRoundedRect(this.title.x - 8 * u, this.title.y - 6 * u, Math.max(this.legend.width, this.meas.width, this.title.width) + 16 * u, this.meas.y + this.meas.height - this.title.y + 12 * u, 6 * u);
        g.fillStyle(COL.ui, 0.72).fillRoundedRect(this.note.x - this.note.width - 8 * u, this.note.y - 4 * u, this.note.width + 16 * u, this.note.height + 8 * u, 6 * u);
        if (this.mon.visible) g.fillStyle(COL.ui, 0.72).fillRoundedRect(this.mon.x - 6 * u, this.mon.y - this.mon.height - 4 * u, this.mon.width + 12 * u, this.mon.height + 8 * u, 4 * u);
      }
      const chip = (c, on, label) => { if (!c.r) { c.t.setVisible(false); return; } c.t.setVisible(true); if (label) c.t.setText(label); g.fillStyle(on ? 0x7fe3ff : COL.ui, on ? 1 : 0.85).fillRoundedRect(c.r.x, c.r.y, c.r.w, c.r.h, 5 * u); g.lineStyle(DPR, on ? 0x7fe3ff : COL.uiEdge, 1).strokeRoundedRect(c.r.x, c.r.y, c.r.w, c.r.h, 5 * u); c.t.setColor(on ? '#0b1016' : COL.uiText); };
      for (const c of this.chips) chip(c, c.m === S.model);
      chip(this.small.help, S.help); chip(this.small.full, !!document.fullscreenElement);
      if (pd && pd.count && !touch) chip(this.small.pad, !!pd.setup); else this.small.pad.t.setVisible(false);
      // touch controls: the analog stick (base, rim, knob) and the A / B buttons
      const show = touch && this.L && !S.portrait;
      for (const t of Object.values(this.btnT)) t.setVisible(!!show);
      if (show) {
        const R = this.L.stickR, b = this.stick.base, kn = this.stick.knob || b, tm = S.touch.move;
        g.fillStyle(0x1a242e, 0.9).fillCircle(b.x, b.y, R); g.lineStyle(2 * DPR, COL.uiEdge, 1).strokeCircle(b.x, b.y, R);
        g.lineStyle(DPR, COL.uiEdge, 0.8).strokeCircle(b.x, b.y, R * P['proto.input.touchDeadzone']).strokeCircle(b.x, b.y, R * P['proto.input.touchOuter']);
        if (tm.m > 0) { const a = Math.atan2(tm.y, tm.x); g.lineStyle(3 * DPR, 0x7fe3ff, 0.9); g.beginPath(); g.arc(b.x, b.y, R * 1.08, a - 0.35, a + 0.35); g.strokePath(); }
        const kx = b.x + C.clamp(kn.x - b.x, -R, R), ky = b.y + C.clamp(kn.y - b.y, -R, R), kl = Math.hypot(kx - b.x, ky - b.y), kk = kl > R ? R / kl : 1;
        g.fillStyle(tm.m > 0 ? 0x7fe3ff : 0xdfe7ec, tm.m > 0 ? 0.95 : 0.35).fillCircle(b.x + (kx - b.x) * kk, b.y + (ky - b.y) * kk, R * 0.42);
        const btn = (c, col, down) => { g.fillStyle(col, down ? 1 : 0.88).fillCircle(c.x, c.y, c.r * (down ? 0.94 : 1)); g.lineStyle(2 * DPR, 0x0b1016, 0.55).strokeCircle(c.x, c.y, c.r * 0.86); };
        btn(this.L.a, COL.dummy, S.touch.lungeDown); btn(this.L.b, 0x7fe3ff, S.touch.grabDown);
        this.btnT.a.setPosition(this.L.a.x, this.L.a.y - this.L.a.r * 0.12); this.btnT.aw.setPosition(this.L.a.x, this.L.a.y + this.L.a.r * 0.45);
        this.btnT.b.setPosition(this.L.b.x, this.L.b.y - this.L.b.r * 0.12); this.btnT.bw.setPosition(this.L.b.x, this.L.b.y + this.L.b.r * 0.45);
      }
      // portrait: landscape only
      this.rotate.setVisible(!!S.portrait);
      if (S.portrait) {
        top.fillStyle(0x0b1016, 1).fillRect(0, 0, w, h);
        const pw = Math.min(w, h) * 0.18, ph = pw * 1.9, cx = w / 2, cy = h / 2 - this.rotate.height / 2 - ph * 0.8;
        top.lineStyle(3 * DPR, 0x7fe3ff, 1).strokeRoundedRect(cx - pw / 2, cy - ph / 2, pw, ph, pw * 0.15);
        top.lineStyle(2 * DPR, 0x7fe3ff, 0.6); top.beginPath(); top.arc(cx, cy, ph * 0.75, -0.6, 0.2); top.strokePath();
      }
      // pad setup prompt
      this.prompt.setVisible(!!(pd && pd.setup));
      if (pd && pd.setup) this.prompt.setText('PAD SETUP\n' + (pd.setup === 'lunge' ? 'Press the button for LUNGE (A)' : 'Press the button for GRAB (B)') + '\nP or ESC cancels');
      this.helpBox.setVisible(S.help).setText([
        'THREE WAYS TO PLAY THE SAME DUMMY',
        '',
        'Keyboard   WASD / arrows move (8 directions) · SPACE or J lunge · E, K or SHIFT grab',
        'Mouse      move the mouse to aim · left click lunge · right click grab',
        'Gamepad    left stick or d-pad move · right stick aim · A or RT lunge · B or LB grab',
        '           SELECT next turn model · hold START (or press P) to set up the buttons',
        '           Not answering? Press a button on it, then read the line at the bottom left.',
        'Touch      landscape · analog stick in the left column · A lunge, B grab on the right',
        '',
        'Turn models   1 LAG (6.4)   2 DIRECT   3 PIVOT   (TAB cycles)',
        'Yellow wedge: where the dummy faces. Cyan tick: where you point.',
        'T shows the touch layout on a computer · R clears the scores · H closes',
      ].join('\n'));
    }
  }

  function start() {
    const host = document.getElementById('game'), size = () => [Math.max(1, host.clientWidth), Math.max(1, host.clientHeight)], [w0, h0] = size();
    window.CTRL_GAME = new Phaser.Game({
      type: /[?&]canvas\b/.test(location.search) ? Phaser.CANVAS : Phaser.AUTO, parent: 'game', backgroundColor: '#0b1016', // ?canvas: the 2D renderer (headless tests)
      scale: { mode: Phaser.Scale.NONE, width: w0 * DPR, height: h0 * DPR, zoom: 1 / DPR }, // device pixels, shown at CSS size: crisp on phones
      input: { activePointers: 4, keyboard: true, mouse: true, touch: true, gamepad: false },
      render: { antialias: true, roundPixels: true },
      scene: [Yard, Hud],
    });
    const fitHost = () => { const [w, h] = size(); const g = window.CTRL_GAME; if (!g || !g.isBooted || !g.canvas) return; if (g.scale.width !== w * DPR || g.scale.height !== h * DPR) { g.scale.resize(w * DPR, h * DPR); g.scale.setZoom(1 / DPR); } };
    window.addEventListener('resize', fitHost); if (window.ResizeObserver) new ResizeObserver(fitHost).observe(host);
  }
  const ready = document.fonts && document.fonts.load ? Promise.race([Promise.all([document.fonts.load("12px 'Silkscreen'"), document.fonts.load("12px 'IBM Plex Mono'")]), new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
  ready.then(start, start);
})();
