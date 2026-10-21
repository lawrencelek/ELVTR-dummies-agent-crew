// Turn Lab viewer (P4). Draws one road piece and its traffic; live metrics; a sweep over the piece's radii.
(function () {
  'use strict';
  const X = window.DUMMIES, L = window.TURNLAB, cv = document.getElementById('cv'), g = cv.getContext('2d');
  const RANGES = { R: ['Bend radius (centre line)', 24, 224, 8, 64], lat: ['Offset between crossings', 48, 320, 4, 84], cut: ['Corner cut (45°)', 64, 224, 16, 160], Rf: ['Entry fillet radius (0 = P3 shape)', 0, 160, 16, 96] };
  const giveWayPieces = { roundabout3: 1, roundabout4: 1 };
  const SWEEP = { R: [32, 40, 48, 64, 96, 128, 224], Rf: [0, 32, 48, 64, 96, 128], lat: null, cut: null };
  const state = { piece: 'roundabout', q: {}, driver: 1, hold: 1, speed: 4, playing: true, sim: null };
  const $ = (id) => document.getElementById(id);
  for (const [k, p] of Object.entries(L.PIECES)) { const o = document.createElement('option'); o.value = k; o.textContent = p.name; $('piece').appendChild(o); }
  $('piece').value = state.piece;
  function sliders() {
    const box = $('sliders'); box.innerHTML = '';
    for (const k of L.PIECES[state.piece].params) {
      const [lab, lo, hi, st, def] = RANGES[k];
      if (state.q[k] == null) state.q[k] = def;
      const l = document.createElement('label'); l.innerHTML = lab + ' <span class="val" id="v_' + k + '"></span>';
      const i = document.createElement('input'); Object.assign(i, { type: 'range', min: lo, max: hi, step: st, value: state.q[k] });
      i.oninput = () => { state.q[k] = +i.value; reset(); };
      box.append(l, i);
    }
  }
  function opts() { return { fleet: $('fleet').value, vanShare: +$('van').value, interval: +$('int').value, seconds: 120, seed: 11, overrides: Object.assign({ 'vehicles.bus.length': +$('busL').value }, Object.assign({ 'traffic.gridlockSeconds': state.hold ? 6 : 0 }, state.driver ? {} : { 'traffic.followRoad': 0, 'traffic.jamReverse': 0, 'traffic.giveWayGap': 0 }) ) }; }
  function reset() {
    const q = {}; for (const k of L.PIECES[state.piece].params) q[k] = state.q[k];
    state.sim = L.makeSim(X, state.piece, q, opts());
    const geo = state.sim.lab.geo;
    state.minLane = geo.lanes.map((p) => L.minRadius(p));
    state.minCentre = L.minRadius(geo.center);
    labels();
  }
  function labels() {
    for (const k of L.PIECES[state.piece].params) { const e = $('v_' + k); if (e) e.textContent = state.q[k] === 0 && k === 'Rf' ? 'P3 shape' : state.q[k]; }
    $('vanV').textContent = Math.round($('van').value * 100) + '%'; $('intV').textContent = $('int').value + ' s';
    $('drv').textContent = 'Driver: ' + (state.driver ? 'P4' : 'P3'); $('drv').classList.toggle('on', !!state.driver);
    $('hold').textContent = 'Spawn hold: ' + (state.hold ? 'on' : 'off'); $('hold').classList.toggle('on', !!state.hold);
    $('speed').textContent = 'Speed ' + state.speed + '×'; $('play').textContent = state.playing ? 'Pause' : 'Play';
  }
  $('piece').onchange = () => { state.piece = $('piece').value; sliders(); reset(); $('matrix').innerHTML = ''; };
  $('van').oninput = reset; $('int').oninput = reset; $('fleet').onchange = reset; $('busL').onchange = reset;
  $('drv').onclick = () => { state.driver = 1 - state.driver; reset(); };
  $('hold').onclick = () => { state.hold = 1 - state.hold; reset(); };
  $('play').onclick = () => { state.playing = !state.playing; labels(); };
  $('speed').onclick = () => { state.speed = state.speed === 1 ? 4 : state.speed === 4 ? 16 : 1; labels(); };
  $('reset').onclick = reset;

  // ---------- drawing
  const LW = 56, SH = 24;
  function strokePath(pts, w, col, dash) {
    g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.lineWidth = w; g.strokeStyle = col; g.lineJoin = 'round'; g.lineCap = 'butt'; g.setLineDash(dash || []); g.stroke(); g.setLineDash([]);
  }
  function draw() {
    const s = state.sim, geo = s.lab.geo;
    g.fillStyle = '#10141c'; g.fillRect(0, 0, 800, 640);
    g.strokeStyle = '#18202e'; g.lineWidth = 1;
    for (let x = 0; x <= 800; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 640); g.stroke(); }
    for (let y = 0; y <= 640; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(800, y); g.stroke(); }
    const roads = geo.roads.concat(geo.ring ? [geo.ring.concat([geo.ring[0]])] : []);
    for (const r of roads) strokePath(r, 2 * (LW + SH), '#3a4152');
    for (const r of roads) strokePath(r, 2 * LW, '#262b36');
    for (const r of roads) strokePath(r, 2, '#e8e2c8', [10, 12]);
    geo.lanes.forEach((p) => strokePath(p, 1, 'rgba(73,211,255,0.25)'));
    for (const p of geo.stops || []) { g.save(); g.translate(p.x, p.y); g.rotate(Math.atan2(p.ty, p.tx)); g.fillStyle = '#f4f4f4'; for (let k = -22; k < 22; k += 8) g.fillRect(-2, k, 3, 4); g.restore(); } // give-way lines
    state.minLane.forEach((m) => { if (!m.at) return; g.beginPath(); g.arc(m.at[0], m.at[1], 10, 0, 2 * Math.PI); g.lineWidth = 2; g.strokeStyle = m.r < 30 ? '#ff5a6a' : '#57e389'; g.stroke(); });
    const jam = new Set(s.cars.filter((c) => (c.stopT || 0) >= 6 && ['cycle', 'none'].includes(s.jamCause(c, new Set([c])))));
    const ov = new Set();
    for (let i = 0; i < s.cars.length; i++) for (let j = i + 1; j < s.cars.length; j++) if (L.overlap(s.cars[i], s.cars[j])) { ov.add(s.cars[i]); ov.add(s.cars[j]); }
    for (const c of s.cars) {
      g.save(); g.translate(c.x, c.y); g.rotate(c.h);
      g.fillStyle = jam.has(c) ? '#ff5a6a' : (c.stopT || 0) > 1 ? '#ffb347' : c.cls === 'bus' ? '#ffe08a' : c.cls === 'van' || c.cls === 'suv' ? '#f2f5f8' : c.cls === 'police' ? '#7f9cff' : '#9fd8ff';
      g.fillRect(-c.L / 2, -c.W / 2, c.L, c.W);
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(c.L / 2 - 12, -c.W / 2 + 3, 6, c.W - 6); // windscreen: which way it faces
      if (ov.has(c)) { g.strokeStyle = '#ff4fd8'; g.lineWidth = 3; g.strokeRect(-c.L / 2, -c.W / 2, c.L, c.W); }
      g.restore();
    }
    const st = s.lab.stats, lr = Math.min(...state.minLane.map((m) => m.r));
    const rows = [['Time', st.t.toFixed(0) + ' s'], ['Cars on screen', s.cars.length], ['Cars out per minute', st.t > 5 ? (st.exited / st.t * 60).toFixed(1) : '—'],
      ['Longest stop', st.maxStop.toFixed(1) + ' s', st.maxStop >= 6 ? 'warn' : ''], ['Jam', st.jamAt == null ? 'none' : 'at ' + st.jamAt + ' s', st.jamAt == null ? 'good' : 'bad'],
      ['Bodies overlapping', st.overlapT.toFixed(1) + ' s', st.overlapT > 0 ? 'bad' : 'good'], ['Spawns held', st.held.toFixed(1) + ' s', st.held > 0 ? 'warn' : ''],
      ['Tightest bend, centre', state.minCentre.r.toFixed(0)], ['Tightest bend, lane', lr.toFixed(0), lr < 30 ? 'bad' : ''], ['Corner speed there', Math.sqrt(s.P['traffic.cornerAccel'] * lr).toFixed(0) + ' (cruise 138)']];
    $('stats').innerHTML = rows.map(([a, b, cl]) => `<tr><td>${a}</td><td class="${cl || ''}">${b}</td></tr>`).join('');
  }
  function frame() {
    if (state.playing) for (let i = 0; i < state.speed; i++) L.tick(state.sim);
    draw(); requestAnimationFrame(frame);
  }
  // ---------- sweep: the piece over its radius range, both drivers, run headless in slices so the page stays live
  $('sweep').onclick = () => {
    const key = L.PIECES[state.piece].params.find((k) => SWEEP[k]), vals = SWEEP[key], jobs = [];
    for (const v of vals) for (const d of [0, 1]) jobs.push({ v, d });
    const res = []; $('matrix').textContent = 'Running…';
    const step = () => {
      const j = jobs.shift();
      if (!j) {
        const by = {}; for (const r of res) (by[r.v] = by[r.v] || {})[r.d] = r;
        $('matrix').innerHTML = `<table><tr><th>${key}</th><th>lane R</th><th>P3 driver</th><th>P4 driver</th></tr>` + Object.entries(by).map(([v, r]) => {
          const cell = (x) => (x.jamAt == null && x.overlapS === 0 ? `<span class="good">flows ${x.exitedPerMin}/min</span>` : `<span class="bad">${x.jamAt != null ? 'jam ' + x.jamAt + ' s' : 'overlap ' + x.overlapS + ' s'}</span>`);
          return `<tr><td>${v === '0' && key === 'Rf' ? 'P3' : v}</td><td>${r[1].laneR}</td><td>${cell(r[0])}</td><td>${cell(r[1])}</td></tr>`;
        }).join('') + '</table>';
        return;
      }
      const q = Object.assign({}, state.q, { [key]: j.v }), o = opts(); Object.assign(o.overrides, j.d ? { 'traffic.followRoad': 1, 'traffic.jamReverse': 1, 'traffic.giveWayGap': 2.5 } : { 'traffic.followRoad': 0, 'traffic.jamReverse': 0, 'traffic.giveWayGap': 0 });
      const r = L.run(X, state.piece, q, o); res.push(Object.assign(r, { v: j.v, d: j.d }));
      $('matrix').textContent = 'Running… ' + res.length + ' / ' + (res.length + jobs.length);
      setTimeout(step, 0);
    };
    setTimeout(step, 0);
  };
  sliders(); reset(); requestAnimationFrame(frame);
})();
