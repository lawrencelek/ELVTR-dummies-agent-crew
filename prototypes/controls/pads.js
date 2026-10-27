// DUMMIES controls prototype (GDD Edit 74): gamepads, read robustly. No Phaser; the tests run it on emulated pads.
// - Every connected pad is read; the one used last drives the dummy (a phantom device in slot 0 no longer hides the real pad).
// - Standard mapping: left stick or d-pad (12–15) moves, right stick aims, A/RT lunge, B/LB grab, SELECT, START.
// - Other mappings: axes 0/1 move; the d-pad from a hat axis (a value outside ±1 at rest, eight steps inside it) or from
//   axes 6/7; buttons 0 and 1 lunge and grab until the player sets them up.
// - Setup: press the button for LUNGE, then for GRAB. Saved per pad name in this browser.
// - A monitor line names the pad, its mapping, the buttons held and the axes, so a pad that misbehaves can be read.
(function (root) {
  'use strict';
  const HAT = [-1, -5 / 7, -3 / 7, -1 / 7, 1 / 7, 3 / 7, 5 / 7, 1]; // up, up-right, right, down-right, down, down-left, left, up-left
  const store = {
    get(k) { try { return JSON.parse(root.localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set(k, v) { try { root.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private window: keep it for this visit */ } },
  };
  function create() { return { info: new Map(), active: null, prev: {}, setup: null, setupId: null, startHeld: 0, maps: new Map() }; }
  const pressed = (b) => !!(b && (b.pressed || b.value > 0.5));
  function mapFor(st, pad) {
    if (st.maps.has(pad.id)) return st.maps.get(pad.id);
    const saved = store.get('dummies.pad.' + pad.id);
    const m = saved || (pad.mapping === 'standard' ? { lunge: [0, 7], grab: [1, 4], sel: 8, start: 9, std: true } : { lunge: [0], grab: [1], sel: 8, start: 9, std: false });
    st.maps.set(pad.id, m); return m;
  }
  function hatDir(v) { // a hat axis's value → direction, or null at rest
    if (Math.abs(v) > 1.05) return null;
    let k = 0, best = 9; for (let i = 0; i < 8; i++) { const d = Math.abs(v - HAT[i]); if (d < best) { best = d; k = i; } }
    if (best > 0.08) return null;
    const a = (-90 + k * 45) * Math.PI / 180; return { x: Math.round(Math.cos(a) * 1e6) / 1e6, y: Math.round(Math.sin(a) * 1e6) / 1e6 };
  }
  // pads: navigator.getGamepads() (any array-like). cfg: { dead, outer, aimDead, holdSetup, stick }. dt in s.
  // Returns { move, aim, lunge, grab, sel, start, id, mapping, monitor, setup, count }.
  function read(st, pads, cfg, dt) {
    const list = []; for (let i = 0; i < (pads ? pads.length : 0); i++) { const p = pads[i]; if (p && p.connected !== false) list.push(p); }
    const out = { move: null, aim: null, lunge: false, grab: false, sel: false, start: false, id: null, mapping: null, monitor: null, setup: st.setup, count: list.length };
    if (!list.length) { st.active = null; return out; }
    for (const p of list) { // learn each pad's hat axis (it rests outside ±1) and find the pads in use
      let inf = st.info.get(p.id + '#' + p.index); if (!inf) { inf = { hat: -1, rest: p.axes.map((v) => v) }; st.info.set(p.id + '#' + p.index, inf); }
      p.axes.forEach((v, i) => { if (Math.abs(v) > 1.05) inf.hat = i; });
      const busy = p.buttons.some(pressed) || p.axes.some((v, i) => i !== inf.hat && Math.abs(v) > 0.5 && Math.abs(v - (inf.rest[i] || 0)) > 0.4) || (inf.hat >= 0 && hatDir(p.axes[inf.hat]));
      if (busy) st.active = p.id + '#' + p.index;
    }
    let pad = list.find((p) => p.id + '#' + p.index === st.active) || list.find((p) => p.mapping === 'standard') || list.slice().sort((a, b) => b.buttons.length - a.buttons.length)[0]; // last used; else standard; else the most buttons
    const key = pad.id + '#' + pad.index, inf = st.info.get(key), m = mapFor(st, pad), bt = (i) => pressed(pad.buttons[i]);
    out.id = pad.id; out.mapping = pad.mapping || 'none'; out.map = { lunge: m.lunge.slice(), grab: m.grab.slice(), std: !!m.std };
    const held = []; pad.buttons.forEach((b, i) => { if (pressed(b)) held.push(i); });
    const prev = st.prev[key] || []; const fresh = held.filter((i) => !prev.includes(i)); st.prev[key] = held;
    // setup: the next fresh button is LUNGE, then GRAB
    if (st.setup) {
      if (fresh.length) {
        const i = fresh[0];
        if (st.setup === 'lunge') { m.lunge = [i]; st.setup = 'grab'; }
        else if (st.setup === 'grab' && !m.lunge.includes(i)) { m.grab = [i]; m.std = false; st.setup = null; store.set('dummies.pad.' + pad.id, m); }
      }
      out.setup = st.setup;
      out.monitor = monitor(pad, held, inf); return out;
    }
    // hold START to set up the buttons; a short press (released before the hold) toggles help
    const startFree = m.start != null && !m.lunge.includes(m.start) && !m.grab.includes(m.start);
    if (startFree && bt(m.start)) { if (st.startHeld >= 0) st.startHeld += dt; }
    else { if (st.startHeld > 0 && st.startHeld < cfg.holdSetup) out.start = true; st.startHeld = 0; }
    if (st.startHeld >= cfg.holdSetup) { st.startHeld = -1; st.setup = 'lunge'; out.setup = st.setup; out.monitor = monitor(pad, held, inf); return out; } // -1: spent until released
    // move: d-pad buttons (standard), hat or axes 6/7 (other mappings), else the left stick
    let dx = 0, dy = 0;
    if (pad.mapping === 'standard') { dx = (bt(15) ? 1 : 0) - (bt(14) ? 1 : 0); dy = (bt(13) ? 1 : 0) - (bt(12) ? 1 : 0); }
    else if (inf.hat >= 0 && hatDir(pad.axes[inf.hat])) { const h = hatDir(pad.axes[inf.hat]); dx = h.x; dy = h.y; }
    else if (pad.axes.length >= 8 && (Math.abs(pad.axes[6]) > 0.5 || Math.abs(pad.axes[7]) > 0.5) && inf.hat !== 6 && inf.hat !== 7) { dx = Math.round(pad.axes[6]); dy = Math.round(pad.axes[7]); }
    if (dx || dy) { const l = Math.hypot(dx, dy); out.move = { x: dx / l, y: dy / l, m: 1 }; }
    else {
      const ax = inf.hat === 0 ? 0 : pad.axes[0] || 0, ay = inf.hat === 1 ? 0 : pad.axes[1] || 0;
      const s = cfg.stick(ax, ay, cfg.dead, cfg.outer); if (s.m > 0) out.move = s;
    }
    if (pad.mapping === 'standard') { const rx = pad.axes[2] || 0, ry = pad.axes[3] || 0, r = Math.hypot(rx, ry); if (r > cfg.aimDead) out.aim = { x: rx / r, y: ry / r }; }
    out.lunge = fresh.some((i) => m.lunge.includes(i)); out.grab = fresh.some((i) => m.grab.includes(i));
    out.sel = m.sel != null && fresh.includes(m.sel);
    out.monitor = monitor(pad, held, inf); return out;
  }
  function monitor(pad, held, inf) {
    const ax = pad.axes.slice(0, 10).map((v, i) => (i === inf.hat ? 'h' : '') + (v >= 0 ? '+' : '') + v.toFixed(2)).join(' ');
    return `#${pad.index} ${pad.id.slice(0, 34)} · ${pad.mapping || 'no'} mapping · buttons ${held.length ? held.join(' ') : '—'} · axes ${ax}`;
  }
  function startSetup(st) { st.setup = 'lunge'; }
  function resetMap(st, id) { st.maps.delete(id); store.set('dummies.pad.' + id, null); }
  const api = { create, read, startSetup, resetMap, hatDir, HAT };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.PADS = api;
})(typeof window !== 'undefined' ? window : globalThis);
