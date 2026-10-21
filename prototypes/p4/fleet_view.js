// Fleet mock-up page (P4, GDD Edit 49.2). Pixel sprites from pixel.js, sizes from sim.js REG, results from fleet_run.js.
(function () {
  'use strict';
  const X = window.DUMMIES, PIX = window.PIX, P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), U = PIX.U, Z = 4;
  const UPM = P['proto.scale.unitsPerMetre'], LW = P['world.laneWidth'], lw2 = LW / 2, EXT = (h) => Math.round(h * P['proto.art.extrusion'] / U);
  const canon = Object.fromEntries(((window.FLEET_DB || {}).classes || []).map((c) => [c.class, c]));
  const VEH = ['hatchback', 'sports', 'sedan', 'police', 'wagon', 'suv', 'van', 'bus'].map((cls) => ({ cls, L: P['vehicles.' + cls + '.length'], W: P['vehicles.' + cls + '.width'], h: P['vehicles.' + cls + '.height'], v: P['vehicles.' + cls + '.cruiseSpeed'], label: cls }))
    .concat([120, 144].map((L) => ({ cls: 'bus', L, W: P['vehicles.bus.width'], h: P['vehicles.bus.height'], v: P['vehicles.bus.cruiseSpeed'], label: 'bus ' + L, variant: true })));
  const inLane = (L, W) => Math.max(0, ((L / 2) ** 2 / (lw2 - W / 2) - lw2 - W / 2) / 2); // inner-lane radius at which the outer corners just touch the lane edge
  const m = (u) => (u / UPM).toFixed(1);
  // ---------- sprite to canvas
  function sprCanvas(S) {
    const c = document.createElement('canvas'); c.width = S.w; c.height = S.h;
    const g = c.getContext('2d'), id = g.createImageData(S.w, S.h); new Uint32Array(id.data.buffer).set(S.d); g.putImageData(id, 0, 0);
    return c;
  }
  // ---------- line-up: each vehicle heading east on a two-lane strip, tiles behind
  (function lineup() {
    const cv = document.getElementById('lineup'), gap = 10, sprites = VEH.map((v) => ({ v, S: PIX.car(v.cls, Math.round(v.L / U), Math.round(v.W / U), EXT(v.h), 0, false) }));
    const laneA = LW / U, wArt = sprites.reduce((n, o) => n + o.S.w + gap, gap) + 8, hArt = Math.round(2 * laneA + 70);
    cv.width = wArt * Z; cv.height = hArt * Z;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.scale(Z, Z);
    g.fillStyle = '#10141c'; g.fillRect(0, 0, wArt, hArt);
    const top = 34, roadH = 2 * laneA;
    g.fillStyle = '#262b36'; g.fillRect(0, top, wArt, roadH);
    g.fillStyle = '#3a4152'; g.fillRect(0, top - 4, wArt, 4); g.fillRect(0, top + roadH, wArt, 4);
    for (let x = 0; x < wArt; x += 8) { g.fillStyle = '#e8e2c8'; g.fillRect(x, top + laneA - 0.5, 4, 1); }
    g.strokeStyle = 'rgba(73,211,255,0.18)'; g.lineWidth = 1 / Z;
    for (let x = 0; x <= wArt; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, hArt); g.stroke(); }
    for (let y = 0; y <= hArt; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(wArt, y); g.stroke(); }
    let x = gap;
    for (const { v, S } of sprites) {
      const cy = top + laneA + laneA / 2; // the east-bound lane
      g.drawImage(sprCanvas(S), x, Math.round(cy - S.oy));
      g.fillStyle = '#e6f4ff'; g.font = '6px system-ui, sans-serif';
      const c = canon[v.cls], tag = c ? c.tagLetter : '?';
      g.fillText(v.label, x, 9); g.fillStyle = '#8ea3bf'; g.fillText(m(v.L) + ' m · ' + (v.L / U / 16).toFixed(1) + ' t', x, 17);
      g.fillStyle = '#49d3ff'; g.fillText(tag + (c ? ' ' + c.family : ''), x, 25);
      x += S.w + gap;
    }
  })();
  // ---------- sizes
  (function sizes() {
    const rows = VEH.map((v) => {
      const c = canon[v.cls] || {}, r = inLane(v.L, v.W);
      const ok = r <= 36 + 1e-9 ? 'good' : r <= 68 ? 'warn' : 'bad';
      return `<tr><td class="l">${v.label}</td><td class="l">${c.tagLetter || ''} · ${c.family || ''}</td><td>${v.L} × ${v.W}</td><td>${m(v.L)} × ${m(v.W)}</td><td>${v.L / U} × ${v.W / U}</td><td>${(v.L / U / 16).toFixed(2)}</td><td>${EXT(v.h)}</td><td>${v.v}</td><td class="${ok}">${r.toFixed(0)}</td><td class="${ok}">${(r + lw2).toFixed(0)}</td><td class="l">${v.variant ? 'mock-up length' : 'V29 registry'}</td></tr>`;
    });
    document.getElementById('sizes').innerHTML = '<tr><th class="l">Vehicle</th><th class="l">Canon</th><th>World units</th><th>Metres</th><th>Art px</th><th>Tiles long</th><th>Lift px</th><th>Cruise</th><th>In lane: lane R</th><th>Road centre R</th><th class="l">Source</th></tr>' + rows.join('');
  })();
  // ---------- swept path through a 90° bend, both lanes
  const sel = document.getElementById('veh'), rad = document.getElementById('rad');
  VEH.forEach((v, i) => { const o = document.createElement('option'); o.value = i; o.textContent = v.label; sel.appendChild(o); });
  sel.value = String(VEH.length - 1);
  function sweep() {
    const v = VEH[+sel.value], R = +rad.value, cv = document.getElementById('sweep'), g = cv.getContext('2d'), k = 0.8;
    const center = X.filletAny([[-200, 200], [420, 200], [420, 840]], R, 0), lanes = X.lanesOf(center, P);
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#10141c'; g.fillRect(0, 0, cv.width, cv.height); g.setTransform(k, 0, 0, k, 0, 0);
    const stroke = (pts, w, col, dash) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.lineWidth = w; g.strokeStyle = col; g.setLineDash(dash || []); g.stroke(); g.setLineDash([]); };
    stroke(center, 2 * (LW + 24), '#3a4152'); stroke(center, 2 * LW, '#262b36'); stroke(center, 2, '#e8e2c8', [10, 12]);
    let worst = [0, 0];
    lanes.forEach((ln, li) => {
      for (let s = 0; s < ln.length; s += 12) {
        const p = X.pathAt(ln, s); if (p.x < -60 || p.y > 700) continue;
        const h = Math.atan2(p.ty, p.tx), ca = Math.cos(h), sa = Math.sin(h);
        const cs = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([a, b]) => [p.x + ca * a * v.L / 2 - sa * b * v.W / 2, p.y + sa * a * v.L / 2 + ca * b * v.W / 2]);
        const out = cs.map(([x, y]) => Math.abs(X.pathProject(ln, x, y).lat) - lw2), o = Math.max(...out);
        worst[li] = Math.max(worst[li], o);
        g.beginPath(); cs.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
        g.lineWidth = 1; g.strokeStyle = o > 8 ? 'rgba(255,90,106,0.9)' : o > 0.5 ? 'rgba(255,179,71,0.8)' : 'rgba(159,216,255,0.45)'; g.stroke();
      }
    });
    const rIn = R - lw2, need = inLane(v.L, v.W);
    document.getElementById('sweepInfo').innerHTML = `<table>
      <tr><th class="l">${v.label}</th><th></th></tr>
      <tr><td class="l">Length × width</td><td>${v.L} × ${v.W} (${m(v.L)} × ${m(v.W)} m)</td></tr>
      <tr><td class="l">Bend, road centre</td><td>${R} (inner lane ${rIn}, outer ${R + lw2})</td></tr>
      <tr><td class="l">Most outside its lane, inner lane</td><td class="${worst[0] > 8 ? 'bad' : worst[0] > 0.5 ? 'warn' : 'good'}">${Math.max(0, worst[0]).toFixed(1)}</td></tr>
      <tr><td class="l">Most outside its lane, outer lane</td><td class="${worst[1] > 8 ? 'bad' : worst[1] > 0.5 ? 'warn' : 'good'}">${Math.max(0, worst[1]).toFixed(1)}</td></tr>
      <tr><td class="l">Stays in lane from inner radius</td><td>${need.toFixed(0)} (road centre ${(need + lw2).toFixed(0)})</td></tr>
      <tr><td class="l">Corner speed, inner lane</td><td>${Math.sqrt(P['traffic.cornerAccel'] * rIn).toFixed(0)} (cruise ${v.v})</td></tr></table>`;
  }
  sel.onchange = sweep; rad.onchange = sweep; sweep();
  // ---------- lab results
  (function lab() {
    const R = (window.FLEET_RESULTS || {}).rows || [];
    const ok = (r) => r.jamAt == null && r.overlapS === 0 && (r.overhang.bus || 0) <= 8;
    const keys = [...new Set(R.map((r) => r.piece + '|' + JSON.stringify(r.q)))];
    const body = keys.map((k) => {
      const [piece, q] = k.split('|'), rs = R.filter((r) => r.piece === piece && JSON.stringify(r.q) === q), qq = JSON.parse(q);
      const cell = (L) => { const g = rs.filter((r) => r.busL === L); if (!g.length) return '<td>—</td>'; const pass = g.every(ok), o = Math.max(...g.map((r) => r.overhang.bus || 0)); return `<td class="${pass ? 'good' : 'bad'}">${pass ? 'flows' : g.some((r) => r.jamAt != null) ? 'jams' : g.some((r) => r.overlapS) ? 'collides' : 'overhangs'} · ${o.toFixed(0)}</td>`; };
      const others = Math.max(0, ...rs.filter((r) => r.fleet === 'expanded').flatMap((r) => Object.entries(r.overhang).filter(([c]) => c !== 'bus').map(([, v]) => v)));
      return `<tr><td class="l">${piece}</td><td class="l">${Object.entries(qq).map(([a, b]) => a + ' ' + b).join(', ')}</td><td>${rs[0].laneR}</td>${cell(96)}${cell(120)}${cell(144)}<td class="${others > 1 ? 'warn' : 'good'}">${others.toFixed(1)}</td></tr>`;
    });
    document.getElementById('lab').innerHTML = '<tr><th class="l">Piece</th><th class="l">Setting</th><th>Lane R (min)</th><th>Bus 96 (7.9 m)</th><th>Bus 120 (9.8 m)</th><th>Bus 144 (11.8 m)</th><th>Seven car classes, most outside lane</th></tr>' + body.join('');
  })();
})();
