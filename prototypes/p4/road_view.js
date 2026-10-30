// Road mock-up page (P4, GDD Edit 49.3): Turn Lab pieces drawn by the game's renderer. 90° corners by radius; 45° junction ideas
// with their routes, give-way lines and a traffic snapshot; results from junction_run.js (window.JUNCTION_RESULTS).
(function () {
  'use strict';
  const X = window.DUMMIES, PIX = window.PIX, L = window.TURNLAB, P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), U = PIX.U, Z = 2;
  const LW = P['world.laneWidth'], lw2 = LW / 2, EXT = (h) => Math.round(h * P['proto.art.extrusion'] / U);
  const $ = (id) => document.getElementById(id);
  const opts = { fleet: 'expanded', interval: 2.5, seconds: 60, seed: 11, overrides: {} };
  function groundOf(s) {
    const geo = s.lab.geo, lv = { center: geo.center, ring: geo.ring ? geo.ring.concat([geo.ring[0]]) : null, statics: [], spawns: [], coneHomes: [], patches: [], decks: [], floors: [], canal: false, solid: [],
      giveWays: (geo.stops || []).map((p) => ({ x: p.x, y: p.y, tx: p.tx, ty: p.ty })) };
    if (geo.arms) Object.assign(lv, { arms: geo.arms, surfaces: geo.roads });
    return PIX.ground(lv, s.P, 7);
  }
  function sprite(B, cls, x, y, h, L0) {
    const Lc = L0 || P['vehicles.' + cls + '.length'], S = PIX.car(cls, Math.round(Lc / U), Math.round(P['vehicles.' + cls + '.width'] / U), EXT(P['vehicles.' + cls + '.height']), h, false);
    PIX.blit(B, S, x / U, y / U);
  }
  function toCanvas(B, cv, crop) { // crop in art px: [x0, y0, w, h]
    const [x0, y0, w, h] = crop || [0, 0, B.w, B.h], off = document.createElement('canvas'); off.width = B.w; off.height = B.h;
    const og = off.getContext('2d'), img = og.createImageData(B.w, B.h); new Uint32Array(img.data.buffer).set(B.d); og.putImageData(img, 0, 0);
    cv.width = w * Z; cv.height = h * Z;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(off, x0, y0, w, h, 0, 0, w * Z, h * Z);
    g.strokeStyle = 'rgba(73,211,255,0.12)'; g.lineWidth = 1;
    for (let x = (16 - (x0 % 16)) % 16; x <= w; x += 16) { g.beginPath(); g.moveTo(x * Z + 0.5, 0); g.lineTo(x * Z + 0.5, h * Z); g.stroke(); }
    for (let y = (16 - (y0 % 16)) % 16; y <= h; y += 16) { g.beginPath(); g.moveTo(0, y * Z + 0.5); g.lineTo(w * Z, y * Z + 0.5); g.stroke(); }
    return g;
  }
  const headingAt = (ln, s) => { const p = X.pathAt(ln, s); return Math.atan2(p.ty, p.tx); };
  function midBend(ln) { // the point of a lane's bend halfway round, by heading
    const h0 = headingAt(ln, 0), h1 = headingAt(ln, ln.length); let d = h1 - h0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const want = h0 + d / 2; let best = 0, bd = 9;
    for (let s = 0; s < ln.length; s += 2) { let e = headingAt(ln, s) - want; e = Math.abs(Math.atan2(Math.sin(e), Math.cos(e))); if (e < bd) { bd = e; best = s; } }
    return best;
  }
  function outOfLane(ln, x, y, h, Lc, Wc) {
    const ca = Math.cos(h), sa = Math.sin(h);
    return Math.max(...[[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([a, b]) => Math.abs(X.pathProject(ln, x + ca * a * Lc / 2 - sa * b * Wc / 2, y + sa * a * Lc / 2 + ca * b * Wc / 2).lat) - lw2));
  }

  // ---------- 90° corners
  const RADII = [32, 64, 96, 128, 160, 224], CROP = [40, 112, 208, 208]; // art px: world x 80–496, y 224–640
  let fp = 'bus';
  function corners() {
    const box = $('corners'); box.innerHTML = '';
    for (const R of RADII) {
      const s = L.makeSim(X, 'corner', { R }, opts), B = groundOf(s), [inner, outer] = s.level.lanes;
      const veh = fp === 'van' ? 'van' : 'bus', Lc = P['vehicles.' + veh + '.length'], Wc = P['vehicles.' + veh + '.width'];
      const si = midBend(inner), so = midBend(outer), pi = X.pathAt(inner, si), po = X.pathAt(outer, so);
      let worst = 0; const ghosts = [];
      for (let k = si - 160; k <= si + 160; k += 16) {
        if (k < 0 || k > inner.length) continue;
        const p = X.pathAt(inner, k), h = Math.atan2(p.ty, p.tx), o = outOfLane(inner, p.x, p.y, h, Lc, Wc);
        worst = Math.max(worst, o); ghosts.push({ p, h, o });
      }
      sprite(B, 'sedan', po.x, po.y, Math.atan2(po.ty, po.tx));
      if (fp !== 'none') sprite(B, veh, pi.x, pi.y, Math.atan2(pi.ty, pi.tx));
      const wrap = document.createElement('div'), cv = document.createElement('canvas'); wrap.appendChild(cv); box.appendChild(wrap);
      const g = toCanvas(B, cv, CROP), w2c = (x, y) => [(x / U - CROP[0]) * Z, (y / U - CROP[1]) * Z];
      if (fp !== 'none') for (const { p, h, o } of ghosts) {
        const ca = Math.cos(h), sa = Math.sin(h);
        g.beginPath(); [[1, 1], [1, -1], [-1, -1], [-1, 1]].forEach(([a, b], i) => { const [x, y] = w2c(p.x + ca * a * Lc / 2 - sa * b * Wc / 2, p.y + sa * a * Lc / 2 + ca * b * Wc / 2); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath();
        g.lineWidth = 1.5; g.strokeStyle = o > 8 ? 'rgba(255,90,106,0.9)' : o > 0.5 ? 'rgba(255,179,71,0.85)' : 'rgba(159,216,255,0.45)'; g.stroke();
      }
      const rIn = R - lw2, kerb = Math.max(0, R - LW), v = Math.sqrt(P['traffic.cornerAccel'] * rIn);
      const cls = worst > 8 ? 'bad' : worst > 0.5 ? 'warn' : 'good', tag = R === 64 ? ' · P4 least bend' : R === 32 ? ' · P3 fallback' : R === P['world.junctionTurnRadius'] ? ' · junction turns' : R === 224 ? ' · wide (45° bends)' : '';
      const cap = document.createElement('p'); cap.className = 'cap';
      cap.innerHTML = `<b>Centre radius ${R}${tag}</b><br>Inner lane ${rIn} · inner kerb ${kerb ? kerb + ' (' + (kerb / 32).toFixed(1) + ' tiles)' : 'square'} · outer kerb ${R + LW} (${((R + LW) / 32).toFixed(1)} tiles)<br>Corner speed, inner lane ${v.toFixed(0)} (sedan cruise ${P['vehicles.sedan.cruiseSpeed']})` +
        (fp !== 'none' ? `<br>${veh === 'bus' ? 'Bus 96' : 'Van'} most outside its lane: <span class="${cls}">${Math.max(0, worst).toFixed(1)}</span>` : '');
      wrap.appendChild(cap);
    }
  }
  for (const [id, v] of [['fpBus', 'bus'], ['fpVan', 'van'], ['fpNone', 'none']]) $(id).onclick = () => { fp = v; for (const k of ['fpBus', 'fpVan', 'fpNone']) $(k).classList.toggle('on', k === id); corners(); };

  // ---------- 45° junction ideas
  const JUNCTIONS = [
    ['tee', { R: P['world.junctionTurnRadius'] }, 'The reference. Six routes; the minor road crosses or joins at 90°.'],
    ['y45', { R: P['world.junctionTurnRadius'] }, 'The 45° road meets the major road as it is. Two turns are 135° hairpins.'],
    ['y45fork', { R: P['world.junctionTurnRadius'] }, 'As the Y, with the hairpins banned: the 45° road only runs east, and only eastern traffic enters it.'],
    ['tee45', { R: P['world.junctionTurnRadius'], run: P['world.junctionApproach'] }, 'The 45° road bends square (radius ' + P['world.turnRadiusWide'] + ') ' + P['world.junctionApproach'] + ' before the junction, then meets it as a T.'],
    ['roundabout45', { Rf: P['world.roundaboutEntryRadius'] }, 'The 45° road is the third arm of a roundabout. Its fillet beside the W arm shrinks to fit the 45° gap.'],
    ['roundabout3', { Rf: P['world.roundaboutEntryRadius'] }, 'The 90° three-arm roundabout (Edit 49.1), for comparison.'],
  ];
  let showRoutes = true, showTraffic = true;
  const RES = (window.JUNCTION_RESULTS || {}).rows || [];
  function summary(piece, q) {
    const rs = RES.filter((r) => r.piece === piece && Object.entries(q).every(([k, v]) => r.q[k] === v));
    if (!rs.length) return null;
    const a = rs.filter((r) => r.fleet === 'expanded' && r.interval === 2.5), b = rs.filter((r) => r.interval === 1.5), mx = (x, f) => Math.max(...x.map(f)), mn = (x, f) => Math.min(...x.map(f));
    return { pass: rs.every((r) => r.jamAt == null && r.overlapS === 0), n: rs.length, outA: mn(a, (r) => r.exitedPerMin) + '–' + mx(a, (r) => r.exitedPerMin), outB: mn(b, (r) => r.exitedPerMin) + '–' + mx(b, (r) => r.exitedPerMin),
      waitA: mx(a, (r) => r.minor), waitAll: mx(rs, (r) => r.minor), bus: mx(rs, (r) => r.overhang.bus || 0), laneR: rs[0].laneR };
  }
  function junctions() {
    const box = $('junctions'); box.innerHTML = '';
    for (const [piece, q, blurb] of JUNCTIONS) {
      const s = L.makeSim(X, piece, q, opts), B = groundOf(s);
      if (showTraffic) { for (let i = 0; i < 40 * 60; i++) L.tick(s); for (const c of s.cars.slice().sort((a, b) => a.y - b.y)) sprite(B, c.cls, c.x, c.y, c.h); }
      const wrap = document.createElement('div'), cv = document.createElement('canvas'); wrap.appendChild(cv); box.appendChild(wrap);
      const g = toCanvas(B, cv);
      if (showRoutes) s.level.lanes.forEach((ln) => {
        const col = ln.giveWay ? '#ffe08a' : ['#49d3ff', '#ffb347', '#ff7ad9'][ln.junction ? ln.junction.rank : 0];
        const J = s.lab.geo.junction, pts = ln.pts.filter(([x, y]) => x > -4 && y > -4 && x < 804 && y < 644 && (!J || Math.hypot(x - J[0], y - J[1]) < 300)); // junctions: the routes where they differ
        if (pts.length < 2) return;
        g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x / U * Z, y / U * Z) : g.moveTo(x / U * Z, y / U * Z))); g.lineWidth = 2; g.strokeStyle = col; g.globalAlpha = 0.75; g.setLineDash([8, 6]); g.stroke(); g.setLineDash([]);
        const cum = []; let acc = 0; pts.forEach((p, i) => { if (i) acc += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]); cum.push(acc); });
        const k = cum.findIndex((c) => c >= acc * 0.82), [x1, y1] = pts[Math.max(1, k)], [x0, y0] = pts[Math.max(0, k - 1)], h = Math.atan2(y1 - y0, x1 - x0);
        g.save(); g.translate(x1 / U * Z, y1 / U * Z); g.rotate(h); g.beginPath(); g.moveTo(8, 0); g.lineTo(-6, -6); g.lineTo(-6, 6); g.closePath(); g.fillStyle = col; g.fill(); g.restore(); g.globalAlpha = 1;
      });
      const sm = summary(piece, q), turns = s.level.lanes[0].junction ? s.level.lanes.map((ln) => ln.junction.route).join(', ') : (s.lab.geo && L.PIECES[piece] && s.level.lanes.length) + ' routes, every pair of arms';
      const cap = document.createElement('div');
      cap.innerHTML = `<h3>${L.PIECES[piece].name}</h3><p class="cap">${blurb}<br>Routes: ${turns}.</p>` + (sm ? `<p class="cap">${sm.pass ? '<span class="good">No jam, no bodies overlapping</span>' : '<span class="bad">Fails</span>'} in ${sm.n} runs · tightest lane ${sm.laneR} · cars out per minute ${sm.outA} (one every 2.5 s), ${sm.outB} (every 1.5 s) · longest minor-road wait ${sm.waitA} s at 2.5 s, ${sm.waitAll} s at most · bus 96 most outside its lane <span class="${sm.bus > 8 ? 'bad' : sm.bus > 4 ? 'warn' : 'good'}">${sm.bus}</span></p>` : '');
      wrap.appendChild(cap);
    }
  }
  $('tRoutes').onclick = () => { showRoutes = !showRoutes; $('tRoutes').classList.toggle('on', showRoutes); junctions(); };
  $('tTraffic').onclick = () => { showTraffic = !showTraffic; $('tTraffic').classList.toggle('on', showTraffic); junctions(); };

  // ---------- results table
  (function results() {
    const keys = [...new Set(RES.map((r) => r.piece + '|' + JSON.stringify(r.q)))];
    $('results').innerHTML = '<tr><th class="l">Piece</th><th class="l">Setting</th><th>Tightest lane</th><th>Runs</th><th>Out/min, 2.5 s</th><th>Out/min, 1.5 s</th><th>Minor wait, 2.5 s (max)</th><th>Minor wait, all (max)</th><th>Major wait (max)</th><th>Bus outside lane</th><th class="l">Result</th></tr>' +
      keys.map((k) => {
        const [piece, qs] = k.split('|'), q = JSON.parse(qs), sm = summary(piece, q), rs = RES.filter((r) => r.piece === piece && JSON.stringify(r.q) === qs);
        return `<tr><td class="l">${L.PIECES[piece].name}</td><td class="l">${Object.entries(q).map(([a, b]) => a + ' ' + b).join(', ')}</td><td>${sm.laneR}</td><td>${sm.n}</td><td>${sm.outA}</td><td>${sm.outB}</td><td class="${sm.waitA > 20 ? 'warn' : ''}">${sm.waitA}</td><td class="${sm.waitAll > 20 ? 'warn' : ''}">${sm.waitAll}</td><td>${Math.max(...rs.map((r) => r.major))}</td><td class="${sm.bus > 8 ? 'bad' : sm.bus > 4 ? 'warn' : 'good'}">${sm.bus}</td><td class="l ${sm.pass ? 'good' : 'bad'}">${sm.pass ? 'no jam, no overlap' : 'fails'}</td></tr>`;
      }).join('');
  })();
  corners(); junctions();
})();
