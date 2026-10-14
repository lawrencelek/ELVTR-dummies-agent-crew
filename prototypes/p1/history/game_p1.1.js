/* DUMMIES P1 — renderer, input, menus, audio, tuning. Reads window.DUMMIES (sim.js). */
(function () {
  'use strict';
  const { Sim, NODES, LEVELS, LEVEL_LIST, REG, PROTO, DEG, pathAt } = window.DUMMIES;

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
    screen: 'title', level: 0, sim: null, paused: false, pauseSel: 0, confirmRefuse: false,
    shopCol: 0, shopRow: 0, endSel: 0, tune: {}, lastEv: 0, toast: null, realT: 0, sound: true, tuned: false,
  };
  const previews = LEVEL_LIST.map((id) => new Sim(id, { 'run.appearances.road': 0 }));

  function startLevel(i) {
    app.level = i; app.sim = new Sim(LEVEL_LIST[i], Object.assign({}, app.tune));
    app.tuned = Object.keys(app.tune).length > 0;
    app.screen = 'game'; app.paused = false; app.lastEv = 0; app.shopCol = 0; app.shopRow = 0; app.endSel = 0;
    app.confirmRefuse = false; clearEdges();
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
    const gp = navigator.getGamepads ? Array.from(navigator.getGamepads()).find((g) => g && g.connected) : null;
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
  };
  const DENY_TEXT = { lunge: 'No lunge — charge empty or recovering', pickup: 'No cone within reach', drop: 'No room to place the cone', throw: 'No room to release the cone' };
  function processEvents() {
    const s = app.sim;
    if (!s) return;
    const ev = s.events;
    for (let i = app.lastEv; i < ev.length; i++) {
      const e = ev[i];
      switch (e.type) {
        case 'lunge': Snd.tone(220, 90, 0.12, 'triangle', 0.12); break;
        case 'impact': {
          const k = Math.min(1, e.assessed / 500);
          Snd.tone(160, 40, 0.28 + 0.2 * k, 'sawtooth', 0.08 + 0.12 * k); Snd.tone(900, 240, 0.07, 'square', 0.05);
          break;
        }
        case 'touch-spent': Snd.tone(260, 240, 0.06, 'sine', 0.06); toast('Spent car — no reward'); break;
        case 'writeoff': [392, 311, 233, 155].forEach((f, j) => Snd.tone(f, f * 0.98, 0.16, 'square', 0.07, j * 0.11)); break;
        case 'denied': Snd.tone(120, 110, 0.05, 'square', 0.05); Snd.tone(120, 110, 0.05, 'square', 0.05, 0.08); toast(DENY_TEXT[e.action] || 'Denied'); break;
        case 'purchase': [523, 659, 784].forEach((f, j) => Snd.tone(f, f, 0.1, 'triangle', 0.07, j * 0.07)); toast(NODES[e.node].name + ' installed'); break;
        case 'pickup': Snd.tone(700, 950, 0.05, 'triangle', 0.06); break;
        case 'drop': Snd.tone(500, 380, 0.06, 'triangle', 0.05); break;
        case 'throw': Snd.tone(620, 180, 0.16, 'triangle', 0.07); break;
        case 'punt': Snd.tone(420, 300, 0.05, 'triangle', 0.04); break;
        case 'ending': if (e.kind === 'Licensed') [523, 659, 784, 1046].forEach((f, j) => Snd.tone(f, f, 0.16, 'triangle', 0.07, 1.1 + j * 0.09)); break;
        default: break;
      }
    }
    app.lastEv = ev.length;
  }
  function toast(msg) { app.toast = { msg, t: app.realT }; }

  // ---------- menus
  const PAUSE_ITEMS = ['Resume', 'Restart level', 'Refuse testing', 'Show trace', 'Quit to title'];
  const END_ITEMS = ['Replay this level', 'Choose another level', 'Show trace'];
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
            if (s.run.writeOffs < 1) toast('Refusal opens after one completed body');
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
          if (it.startsWith('Next road')) { startLevel(app.level + 1); return; }
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
  function label(s, x, y) { // uppercase eyebrow with tracking
    ctx.font = '700 10px ' + F_UI; ctx.fillStyle = C.secondary; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    let cx = x; for (const ch of s) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + 1.4; }
  }
  function panel(x, y, w, h, opts) {
    ctx.save();
    ctx.shadowColor = 'rgba(16,40,56,0.18)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    rr(x, y, w, h, 14);
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, 'rgba(255,255,255,0.97)'); g.addColorStop(1, (opts && opts.tint) || 'rgba(236,247,252,0.95)');
    ctx.fillStyle = g; ctx.fill(); ctx.restore();
    rr(x + 0.5, y + 0.5, w - 1, h - 1, 14); ctx.strokeStyle = 'rgba(79,195,232,0.75)'; ctx.lineWidth = 1.5; ctx.stroke();
    // glass highlight
    ctx.save(); rr(x + 2, y + 2, w - 4, Math.min(28, h / 3), 12); ctx.clip();
    const hg = ctx.createLinearGradient(0, y, 0, y + 28); hg.addColorStop(0, 'rgba(255,255,255,0.9)'); hg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hg; ctx.fillRect(x, y, w, 30); ctx.restore();
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
    const g = ctx.createLinearGradient(0, 0, 0, VH);
    g.addColorStop(0, '#EAF6FB'); g.addColorStop(0.5, '#D6ECF4'); g.addColorStop(1, '#C3E1EC');
    ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
    // soft orbs
    const o = ctx.createRadialGradient(1120, 40, 10, 1120, 40, 260);
    o.addColorStop(0, 'rgba(255,255,255,0.8)'); o.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = o; ctx.fillRect(0, 0, VW, VH);
    txt('FARSIGHT', 24, 40, '900 26px ' + F_BRAND, C.aquaDeep);
    ctx.font = '900 26px ' + F_BRAND; const bw = ctx.measureText('FARSIGHT').width;
    txt('CRASH LAB  ·  SHENZHEN SMART CITY  ·  NEW ECONOMIC ZONE  ·  深圳智慧城市测试区', 24 + bw + 16, 38, '700 11px ' + F_UI, C.ink2);
    txt('P1.1 · FINDING THE FUN', VW - 24, 38, '700 11px ' + F_UI, C.ink2, 'right');
    // field bezel
    ctx.save(); ctx.shadowColor = 'rgba(16,40,56,0.25)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
    rr(FX - 6, FY - 6, FW + 12, FH + 12, 12); ctx.fillStyle = '#F7FBFD'; ctx.fill(); ctx.restore();
    rr(FX - 6.5, FY - 6.5, FW + 13, FH + 13, 12); ctx.strokeStyle = 'rgba(79,195,232,0.9)'; ctx.lineWidth = 1.5; ctx.stroke();
    const prompt = app.screen === 'title' ? '↑↓ choose level   ·   A / Space start   ·   T tuning'
      : 'MOVE  WASD / ◀▲▼▶      A  LUNGE  Space / J      B  CONE  K / Shift      PAUSE  Esc      TUNING  T';
    txt(prompt, VW / 2, VH - 18, '700 11px ' + F_UI, C.ink2, 'center');
  }

  function drawHUD(s) {
    const b = s.body, P = s.P, r = s.run;
    // left column
    panel(12, FY, 216, FH);
    let y = FY + 26;
    label('SUBJECT', 26, y); txt('CHASSIS ' + String(b.chassis).padStart(2, '0'), 214, y, '700 12px ' + F_MONO, C.primary, 'right');
    y += 26; label('BODY · ' + s.grade.toUpperCase() + ' CHASSIS', 26, y);
    const hp = b.alive ? b.health : 0, frac = hp / P['damage.bodyHealth'];
    rr(26, y + 8, 188, 12, 6); ctx.fillStyle = '#E2EAEE'; ctx.fill();
    if (frac > 0) { rr(26, y + 8, Math.max(12, 188 * frac), 12, 6); ctx.fillStyle = C.dummy; ctx.fill(); ctx.strokeStyle = C.joints; ctx.lineWidth = 1; ctx.stroke(); }
    txt(num(hp) + ' / ' + num(P['damage.bodyHealth']), 26, y + 38, '700 13px ' + F_MONO, C.primary);
    txt('REACH ' + Math.round(s.reach()), 214, y + 38, '700 11px ' + F_MONO, C.secondary, 'right');
    y += 66; label('CHARGE', 26, y);
    const cap = P['battery.capacity'];
    for (let i = 0; i < cap; i++) {
      const cw = (188 - (cap - 1) * 6) / cap, x = 26 + i * (cw + 6), f = Math.max(0, Math.min(1, b.charge - i));
      rr(x, y + 8, cw, 16, 4); ctx.fillStyle = '#E2EAEE'; ctx.fill();
      if (f > 0) { rr(x, y + 8, cw * f, 16, 4); ctx.fillStyle = f >= 1 ? C.primary : C.secondary; ctx.fill(); }
    }
    y += 50; label('CONTRACT', 26, y);
    const quota = P['run.quota.road'];
    for (let i = 0; i < quota; i++) {
      const x = 26 + i * 38; rr(x, y + 8, 32, 32, 6);
      ctx.fillStyle = i < r.writeOffs ? C.dummy : '#E2EAEE'; ctx.fill(); ctx.strokeStyle = i < r.writeOffs ? C.joints : '#C9D5DB'; ctx.lineWidth = 1; ctx.stroke();
      if (i < r.writeOffs) { ctx.strokeStyle = C.joints; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x + 8, y + 32); ctx.lineTo(x + 24, y + 16); ctx.stroke(); }
    }
    txt('Write-offs ' + r.writeOffs + ' / ' + quota, 26, y + 60, '700 12px ' + F_UI, C.primary);
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
      const n = m.applied >= 5 ? 3 : m.applied >= 3 ? 2 : m.applied >= 1 ? 1 : 0;
      for (let j = 0; j < 3; j++) { ctx.fillStyle = j < n ? C.primary : '#D4DDE2'; ctx.fillRect(X + 150 + j * 12, yy - 10, 8, 12); }
    });
    txt(P['proto.learningEnabled'] ? 'Learning on' : 'Learning off (P2)', X + 14, y + 78, '400 11px ' + F_UI, C.secondary);
    y += 104; label('SHIFT', X + 14, y);
    const onRoad = s.cars.length;
    txt(r.admitted + ' / ' + s.schedule.length, X + 14, y + 26, '700 16px ' + F_MONO, C.primary);
    txt('admitted', X + 96, y + 26, '400 11px ' + F_UI, C.secondary);
    txt(onRoad + ' on the road', X + 14, y + 46, '400 12px ' + F_UI, C.ink2);
    if (s.slot < s.schedule.length) {
      const due = Math.max(P['run.admissionInterval'] * s.slot, s.lastAdmit + P['run.admissionInterval']);
      txt('next ' + s.schedule[s.slot].cls + ' in ' + Math.max(0, due - s.t).toFixed(1) + ' s', X + 14, y + 64, '400 12px ' + F_UI, C.ink2);
    } else txt('schedule complete', X + 14, y + 64, '400 12px ' + F_UI, C.ink2);
    y += 92; label('CLOCK', X + 14, y);
    txt(fmtT(s.t), X + 14, y + 30, '700 22px ' + F_MONO, C.primary);
    txt('active time', X + 90, y + 30, '400 11px ' + F_UI, C.secondary);
    y += 52; label('VIEW', X + 14, y);
    txt(P['proto.zonesEverywhere'] ? 'Scanners everywhere' : 'Scanners in view cone', X + 14, y + 22, '400 12px ' + F_UI, C.ink2);
    txt(P['proto.pathsEverywhere'] ? 'Car paths always shown' : 'Car paths in view cone', X + 14, y + 40, '400 12px ' + F_UI, C.ink2);
  }

  // ---------- field
  function drawField(s, still) {
    const P = s.P, L = s.level;
    ctx.save();
    rr(FX, FY, FW, FH, 6); ctx.clip();
    ctx.translate(FX, FY);
    ctx.fillStyle = C.floor; ctx.fillRect(0, 0, FW, FH);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 40; x < FW; x += 40) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, FH); }
    for (let y = 40; y < FH; y += 40) { ctx.moveTo(0, y + 0.5); ctx.lineTo(FW, y + 0.5); }
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
    // statics
    for (const st of L.statics) {
      ctx.fillStyle = st.kind === 'barrier' ? C.structure : '#C8D2D8'; ctx.fillRect(st.x, st.y, st.w, st.h);
      ctx.strokeStyle = '#8E9CA6'; ctx.lineWidth = 1; ctx.strokeRect(st.x + 0.5, st.y + 0.5, st.w - 1, st.h - 1);
      if (st.kind === 'crate') { ctx.beginPath(); ctx.moveTo(st.x + 4, st.y + 4); ctx.lineTo(st.x + st.w - 4, st.y + st.h - 4); ctx.moveTo(st.x + st.w - 4, st.y + 4); ctx.lineTo(st.x + 4, st.y + st.h - 4); ctx.strokeStyle = '#9AA8B1'; ctx.stroke(); }
      else { ctx.save(); ctx.beginPath(); ctx.rect(st.x, st.y, st.w, st.h); ctx.clip(); ctx.strokeStyle = 'rgba(16,20,23,0.35)'; ctx.lineWidth = 3; for (let x = st.x - 20; x < st.x + st.w + 20; x += 14) { ctx.beginPath(); ctx.moveTo(x, st.y + st.h); ctx.lineTo(x + st.h, st.y); ctx.stroke(); } ctx.restore(); }
    }
    if (!still) drawLive(s);
    ctx.restore();
  }

  function wedge(b, P) {
    const hw = P['sensing.coneWidth'] * DEG / 2, R = P['sensing.coneReach'];
    ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.arc(b.x, b.y, R, b.facing - hw, b.facing + hw); ctx.closePath();
  }
  function carLocal(c, fn) { ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.h); fn(); ctx.restore(); }

  function drawZones(s, c) {
    const P = s.P, hw = c.W / 2 + P['body.radius'], hot = !!c.det.fwd;
    const s0 = c.s + c.L / 2, s1 = Math.min(c.path.length, s0 + c.fwdLen);
    if (s1 > s0) {
      const left = [], right = [];
      for (let sv = s0; ; sv += 10) {
        const sx = Math.min(sv, s1), p = pathAt(c.path, sx);
        left.push([p.x + p.nx * (c.d - hw), p.y + p.ny * (c.d - hw)]); right.push([p.x + p.nx * (c.d + hw), p.y + p.ny * (c.d + hw)]);
        if (sx >= s1) break;
      }
      ctx.beginPath(); left.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
      for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
      ctx.closePath();
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
    const e = pts[pts.length - 1], ex = e.x, ey = e.y;
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(e.h); rr(-c.L / 2, -c.W / 2, c.L, c.W, 6);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = provisional ? 'rgba(74,90,102,0.6)' : C.primary; ctx.lineWidth = 1.4; ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  }
  function drawCar(s, c) {
    const braking = (c.man && c.man.type === 'brake') || c.state === 'interrupted' || (c._pv != null && c.v < c._pv - 0.4);
    c._pv = c.v;
    carLocal(c, () => {
      ctx.fillStyle = 'rgba(16,40,56,0.16)'; rr(-c.L / 2 + 3, -c.W / 2 + 4, c.L, c.W, 7); ctx.fill();
      rr(-c.L / 2, -c.W / 2, c.L, c.W, 7); ctx.fillStyle = c.cls === 'van' ? '#71808A' : C.fleet; ctx.fill();
      ctx.strokeStyle = '#4E5B64'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = '#56636C'; rr(c.L / 2 - 18, -c.W / 2 + 4, 9, c.W - 8, 3); ctx.fill(); // windscreen
      if (c.cls === 'van') { ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(-c.L / 2 + 6, -c.W / 2 + 5, c.L - 30, c.W - 10); }
      ctx.fillStyle = '#F2F5F7'; ctx.fillRect(c.L / 2 - 3, -c.W / 2 + 3, 3, 5); ctx.fillRect(c.L / 2 - 3, c.W / 2 - 8, 3, 5);
      ctx.fillStyle = braking ? C.warning : '#8A3A30'; ctx.fillRect(-c.L / 2, -c.W / 2 + 3, 3, 6); ctx.fillRect(-c.L / 2, c.W / 2 - 9, 3, 6);
      if (braking && c.v > 5) { ctx.strokeStyle = 'rgba(16,20,23,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-c.L / 2 - 4, -c.W / 2 + 6); ctx.lineTo(-c.L / 2 - 18, -c.W / 2 + 6); ctx.moveTo(-c.L / 2 - 4, c.W / 2 - 6); ctx.lineTo(-c.L / 2 - 18, c.W / 2 - 6); ctx.stroke(); }
      const sig = s.signalSide(c);
      if (sig && Math.floor(app.realT * 3) % 2 === 0) {
        ctx.fillStyle = '#F2A33A'; ctx.fillRect(c.L / 2 - 6, sig * c.W / 2 - 2.5, 6, 5); ctx.fillRect(-c.L / 2, sig * c.W / 2 - 2.5, 6, 5);
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
    if (s.P['proto.learningEnabled']) {
      const n = c.applied >= 5 ? 3 : c.applied >= 3 ? 2 : c.applied >= 1 ? 1 : 0;
      for (let j = 0; j < 3; j++) { ctx.fillStyle = j < n ? C.primary : '#C9D5DB'; ctx.fillRect(c.x + tw / 2 + 8 + j * 5, ty - 8, 3, 10); }
    }
  }
  function drawCone(cn, x, y) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = 'rgba(16,40,56,0.18)'; ctx.beginPath(); ctx.arc(1.5, 2, 6.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.warning; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, 3.4, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.primary; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.restore(); void cn;
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
    // charge ring (screen-aligned)
    const cap = P['battery.capacity'], seg = (Math.PI * 2) / cap, gap = 0.28;
    for (let i = 0; i < cap; i++) {
      const a0 = -Math.PI / 2 + i * seg + gap / 2, a1 = a0 + seg - gap, f = Math.max(0, Math.min(1, b.charge - i));
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(16,20,23,0.12)'; ctx.beginPath(); ctx.arc(0, 0, 20, a0, a1); ctx.stroke();
      if (f > 0) { ctx.strokeStyle = f >= 1 ? C.primary : C.secondary; ctx.beginPath(); ctx.arc(0, 0, 20, a0, a0 + (a1 - a0) * f); ctx.stroke(); }
    }
    if (b.denied > 0) { ctx.strokeStyle = C.warning; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.stroke(); }
    ctx.rotate(b.facing);
    let sx = 1, sy = 1;
    if (b.mode === 'lunge') { sx = 1.16; sy = 0.88; } else if (b.mode === 'recover') { sx = 0.9; sy = 1.08; }
    ctx.scale(sx, sy);
    ctx.fillStyle = 'rgba(16,40,56,0.2)'; ctx.beginPath(); ctx.arc(2, 3, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.dummy; ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.joints; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = '#E3B23C'; rr(-3.5, -14, 7, 28, 3); ctx.fill(); ctx.stroke(); // shoulder bar
    ctx.fillStyle = C.joints; for (const yy of [-14, 14]) { ctx.beginPath(); ctx.arc(0, yy, 3.2, 0, Math.PI * 2); ctx.fill(); }
    if (b.held) { ctx.strokeStyle = C.joints; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(12, -6); ctx.moveTo(0, 14); ctx.lineTo(12, 6); ctx.stroke(); }
    ctx.fillStyle = C.dummy; ctx.beginPath(); ctx.arc(0, 0, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.lineWidth = 1.4; ctx.stroke();
    ctx.strokeStyle = C.joints; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(6.5, 0); ctx.lineTo(24, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, 0); ctx.lineTo(19, -4); ctx.moveTo(24, 0); ctx.lineTo(19, 4); ctx.stroke();
    const wear = 1 - b.health / P['damage.bodyHealth'], cracks = Math.floor(wear * 6);
    ctx.strokeStyle = 'rgba(26,29,31,0.7)'; ctx.lineWidth = 1.2;
    for (let i = 0; i < cracks; i++) { const a = 0.9 + i * 1.07; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 13, Math.sin(a) * 13); ctx.lineTo(Math.cos(a + 0.25) * 7.5, Math.sin(a + 0.25) * 7.5); ctx.stroke(); }
    ctx.restore();
    if (b.held) { const p = s.releasePoint(); drawCone(b.held, p.x, p.y); }
  }
  function drawEffects(s) {
    for (const e of s.effects) {
      if (e._w == null) e._w = app.realT;
      const age = app.realT - e._w;
      if (e.type === 'burst' && age < 0.9) {
        const k = Math.min(1, age / 0.35), big = Math.min(1, e.v / 500);
        ctx.strokeStyle = 'rgba(16,20,23,' + (1 - k) + ')'; ctx.lineWidth = 2 + 2 * big;
        for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, r0 = 6 + 14 * k, r1 = r0 + 8 + 18 * big; ctx.beginPath(); ctx.moveTo(e.x + Math.cos(a) * r0, e.y + Math.sin(a) * r0); ctx.lineTo(e.x + Math.cos(a) * r1, e.y + Math.sin(a) * r1); ctx.stroke(); }
        ctx.globalAlpha = Math.max(0, 1 - age / 0.9);
        txt('+' + num(e.v) + ' ' + e.zone.replace('Diagonal', ' diag.'), e.x, e.y - 24 - age * 30, '700 ' + (13 + 5 * big) + 'px ' + F_MONO, C.primary, 'center');
        ctx.globalAlpha = 1;
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
  function drawLive(s) {
    const P = s.P, b = s.body;
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
    for (const cn of s.cones) if (cn.state === 'free' || cn.state === 'flight') drawCone(cn, cn.x, cn.y);
    for (const c of s.cars) drawCar(s, c);
    drawBody(s);
    drawEffects(s);
    if (s.t < 4 && s.phase === 'play') {
      const a = Math.min(1, (4 - s.t) / 0.6);
      ctx.globalAlpha = a; rr(FW / 2 - 230, 18, 460, 46, 10); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill();
      ctx.strokeStyle = C.aqua; ctx.lineWidth = 1.5; ctx.stroke();
      txt('CONTRACT · complete ' + P['run.quota.road'] + ' write-offs · ' + s.schedule.length + ' cars scheduled', FW / 2, 38, '700 13px ' + F_UI, C.primary, 'center');
      txt(s.grade + ' chassis · ' + P['damage.bodyHealth'] + ' health. Cars dodge you: read their path, then lunge into it.', FW / 2, 55, '400 12px ' + F_UI, C.ink2, 'center');
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
  function chassisHealth(id) { const k = 'proto.chassis.' + id + '.bodyHealth'; return app.tune[k] != null ? app.tune[k] : PROTO[k]; }
  function endItems(s) {
    const nxt = LEVEL_LIST[app.level + 1];
    return s.run.ending && s.run.ending.kind === 'Licensed' && nxt ? ['Next road: ' + LEVELS[nxt].name + ' · ' + LEVELS[nxt].grade + ' chassis', ...END_ITEMS] : END_ITEMS;
  }
  function drawTitle() {
    const pv = previews[app.level];
    drawField(pv, true);
    veil();
    const x = FX + 60, y = FY + 40, w = FW - 120;
    panel(x, y, w, FH - 80);
    txt('DUMMIES', x + 32, y + 78, '900 64px ' + F_BRAND, C.primary);
    txt('P1 · Finding the fun', x + 36, y + 106, '700 14px ' + F_UI, C.aquaDeep);
    txt('You are a FARSIGHT crash-test subject. Cars avoid you. Fool them into hitting you.', x + 36, y + 136, '400 13px ' + F_UI, C.ink2);
    txt('Five write-offs complete the contract. Each lost body before that buys one upgrade.', x + 36, y + 156, '400 13px ' + F_UI, C.ink2);
    label('CHOOSE A ROAD', x + 36, y + 196);
    LEVEL_LIST.forEach((id, i) => {
      const yy = y + 208 + i * 58, on = i === app.level;
      rr(x + 32, yy, w - 64, 48, 10); ctx.fillStyle = on ? C.aqua : 'rgba(255,255,255,0.7)'; ctx.fill();
      ctx.strokeStyle = on ? C.aquaDeep : '#C9D5DB'; ctx.lineWidth = 1.2; ctx.stroke();
      txt(LEVELS[id].name, x + 52, yy + 21, '700 15px ' + F_UI, on ? '#06202B' : C.primary);
      txt(LEVELS[id].blurb, x + 52, yy + 39, '400 12px ' + F_UI, on ? '#0B3443' : C.ink2);
      txt(LEVELS[id].grade + ' chassis · ' + chassisHealth(id) + ' health', x + w - 52, yy + 21, '700 12px ' + F_MONO, on ? '#06202B' : C.secondary, 'right');
    });
    const ky = y + 400;
    label('CONTROLS', x + 36, ky);
    const rows = [['Move / face', 'WASD · arrows · stick'], ['A  Lunge along facing', 'Space · J · pad A'], ['B  Cone (after Carry)', 'K · Shift · pad B'], ['Pause', 'Esc · Start']];
    rows.forEach((r, i) => { const cx = x + 36 + (i % 2) * 330, cy = ky + 22 + Math.floor(i / 2) * 20; txt(r[0], cx, cy, '700 12px ' + F_UI, C.primary); txt(r[1], cx + 150, cy, '400 12px ' + F_MONO, C.ink2); });
    txt('Press A or Space to start', x + w / 2, y + FH - 104, '700 14px ' + F_UI, C.aquaDeep, 'center');
  }
  function drawReport(s) {
    veil();
    const rp = s.report, x = FX + 110, y = FY + 70, w = FW - 220, h = 420;
    panel(x, y, w, h);
    label('TEST REPORT', x + 28, y + 30);
    txt('Chassis ' + String(rp.chassis).padStart(2, '0') + ' written off', x + 28, y + 64, '800 26px ' + F_BRAND, C.primary);
    txt('Test ' + s.run.writeOffs + ' of ' + s.P['run.quota.road'] + ' complete. Points this body: ' + num(rp.points), x + 28, y + 88, '400 13px ' + F_UI, C.ink2);
    label('IMPACTS', x + 28, y + 122);
    const cols = ['Car', 'Zone', 'Closing u/s', 'Assessed', 'Health lost', 'Car state'];
    const cx = [0, 96, 196, 286, 366, 446];
    cols.forEach((c, i) => txt(c, x + 28 + cx[i], y + 142, '700 10px ' + F_UI, C.secondary));
    rp.hits.slice(-6).forEach((hh, j) => {
      const yy = y + 164 + j * 22;
      [hh.model, hh.zone.replace('Diagonal', ' diag.'), num(hh.closing), num(hh.assessed), num(hh.lost), hh.bait ? hh.carState + ' ✓ bait' : hh.carState]
        .forEach((v, i) => txt(String(v), x + 28 + cx[i], yy, (i >= 2 && i <= 4 ? '700 12px ' : '400 12px ') + (i >= 2 && i <= 4 ? F_MONO : F_UI), C.primary));
    });
    rr(x + 28, y + h - 92, w - 56, 44, 10); ctx.fillStyle = 'rgba(245,197,66,0.25)'; ctx.fill(); ctx.strokeStyle = C.dummy; ctx.stroke();
    txt('Body credit +1   ·   balance ' + s.run.credits, x + 44, y + h - 64, '700 14px ' + F_UI, C.primary);
    txt('A  continue to modifications', x + w - 28, y + h - 18, '700 12px ' + F_UI, C.aquaDeep, 'right');
  }
  function drawShop(s) {
    veil();
    const x = FX + 40, y = FY + 30, w = FW - 80, h = FH - 60;
    panel(x, y, w, h);
    label('FARSIGHT APPROVED MODIFICATIONS', x + 28, y + 30);
    txt('Install on the next chassis', x + 28, y + 60, '800 22px ' + F_BRAND, C.primary);
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
        wrapText(node.desc, cx + 16, yy + 50, colW - 32, 16, '400 12px ' + F_UI, C.ink2);
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
    txt(s.run.credits ? 'Bank ' + s.run.credits + ' credit' + (s.run.credits === 1 ? '' : 's') + ' and deploy the next chassis' : 'Deploy the next chassis', x + w / 2, y + h - 48, '700 14px ' + F_UI, on ? '#06202B' : C.primary, 'center');
    txt('◀▶▲▼ select   ·   A buy   ·   B deploy', x + w / 2, y + h - 12, '400 11px ' + F_UI, C.secondary, 'center');
  }
  function wrapText(str, x, y, w, lh, font, color) {
    ctx.font = font; const words = str.split(' '); let line = '', yy = y;
    for (const wd of words) { const t = line ? line + ' ' + wd : wd; if (ctx.measureText(t).width > w && line) { txt(line, x, yy, font, color); line = wd; yy += lh; } else line = t; }
    if (line) txt(line, x, yy, font, color);
  }
  function drawPause(s) {
    veil();
    const x = FX + 220, y = FY + 120, w = 360;
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
    const sub = { Licensed: 'Contract complete. Your current testing contract is released.', 'Failed test': 'Useful traffic ran out before the contract was complete.', 'Non-compliant': 'You refused further testing. FARSIGHT has recorded your position.' }[e.kind];
    txt(sub, x + 30, y + 100, '400 13px ' + F_UI, C.ink2);
    const imp = s.events.filter((v) => v.type === 'impact');
    const stats = [['Active time', fmtT(e.t)], ['Write-offs', e.writeOffs + ' / ' + s.P['run.quota.road']], ['Points', num(e.points)],
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
    ['proto.chassis.straight.bodyHealth', 50, 2400, 25], ['proto.chassis.barrier.bodyHealth', 50, 2400, 25], ['proto.chassis.corner.bodyHealth', 50, 2400, 25],
    ['damage.referenceSpeed', 40, 400, 2], ['run.admissionInterval', 2, 20, 0.5], ['traffic.commitHorizon', 0.3, 2, 0.05],
    ['perception.forwardLength', 100, 600, 10], ['perception.reactionDelay', 0, 0.6, 0.01], ['proto.swerveLength', 40, 300, 5], ['proto.returnSignalSeconds', 0, 2, 0.05],
    ['vehicles.sedan.cruiseSpeed', 60, 260, 2], ['vehicles.van.cruiseSpeed', 60, 260, 2], ['upgrades.throwDistance', 40, 300, 5],
    ['upgrades.spineLimit', 10, 90, 1],
  ];
  const tuneEl = document.getElementById('tune'), grid = document.getElementById('tune-grid');
  function current(id) { return app.sim ? app.sim.P[id] : (app.tune[id] != null ? app.tune[id] : (REG[id] != null ? REG[id] : PROTO[id])); }
  function setParam(id, v) {
    app.tune[id] = v;
    if (app.sim) { app.sim.P[id] = v; app.tuned = true; if (id === 'proto.chassis.' + app.sim.levelId + '.bodyHealth') app.sim.P['damage.bodyHealth'] = v; }
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
    for (const [id, text] of [['proto.pathsEverywhere', 'Show committed car paths outside the view cone'], ['proto.zonesEverywhere', 'Show car scanners outside the view cone'], ['proto.learningEnabled', 'Cars learn from player hits']]) {
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
    for (const id of ['proto.pathsEverywhere', 'proto.zonesEverywhere', 'proto.learningEnabled']) { const inp = document.getElementById('t-' + id.replace(/\./g, '-')); if (inp) inp.checked = !!current(id); }
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
    traceTxt.value = JSON.stringify(app.sim.trace(), null, 1);
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
    const dt = Math.min(0.1, (now - last) / 1000); last = now; app.realT += dt;
    pollPad();
    handleMenus();
    const s = app.sim;
    if (app.screen === 'game' && s && !app.paused && traceEl.hidden) {
      acc += dt;
      while (acc >= 1 / 60) { s.step(s.phase === 'play' ? buildCmd() : {}); acc -= 1 / 60; }
    } else acc = 0;
    processEvents();
    render();
    requestAnimationFrame(frame);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {});
  requestAnimationFrame(frame);
  window.__dummies = app;
})();
