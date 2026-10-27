// Prototype 6.1 (GDD Edit 69): the walking test. For each district:
// 1. Reach: a graph of every screen's open ground (its walkable components) and every raised floor, joined by screen
//    crossings (ground and level), flights and floors that meet. Everything worth reaching must join the start (B2).
// 2. Tour: the dummy walks, by the game's own physics, from the start through every screen at ground level and back,
//    path-finding round pavilions, pools, planters and buildings, to every flight's apron on the way. On the Waterfront it
//    also climbs the cliff and walks the hilltop at Z1 across A1, B1 and C1.
// 3. Buildings: the dummy walks into every face of every building plan it can reach; it stops at the face.
// 4. Traps: the dummy wanders at random, three runs of 5 min; it never ends up somewhere it cannot leave.
// Run from prototypes/p6: node tools/p6_walk.js [district]   (exits 1 on any failure)
'use strict';
const W6 = require('../world6.js'), X = require('../sim.js'), A = require('./p6_audit.js'), PIX = globalThis.PIX;
const P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), W = P['world.width'], H = P['world.height'], R = P['body.radius'];
const SIDE = X.SIDE, OPP = { N: 'S', S: 'N', E: 'W', W: 'E' }, STEP = 8, hyp = Math.hypot;
const inR = (r, x, y, m) => x >= r.x - m && x <= r.x + r.w + m && y >= r.y - m && y <= r.y + r.h + m;
const edgePt = (sd, v, d) => (sd === 'N' ? [v, d] : sd === 'S' ? [v, H - d] : sd === 'W' ? [d, v] : [W - d, v]);
const horiz = (sd) => sd === 'N' || sd === 'S';

function place(s, sc, x, y, lv, fl) {
  s.enter(sc);
  Object.assign(s.body, { x, y, px: x, py: y, level: lv || 0, floor: fl == null ? null : fl, stair: null, drop: null, mode: 'idle', vx: 0, vy: 0, lunge: null, alive: true });
  s.buildView(); s.phase = 'play';
}
const calm = (s) => { for (const sm of s.W6.sims) if (sm.cars.length) sm.cars.length = 0; };
const empty = (s) => { for (const sm of s.W6.sims) { sm.cars.length = 0; sm.slot = sm.schedule.length; sm.deckNext = { 0: 1e9, 1: 1e9, 2: 1e9, 3: 1e9 }; } s.W6.budget = 0; s.buildView(); };

// where the dummy can stand at a level: z 0, the open ground; z > 0, inside a floor at that level by the body, clear of solids there
function standZ(sc, z, x, y) {
  if (!z) return A.standable(sc, x, y);
  const g = sc.game;
  if (x < 2 || y < 2 || x > W - 2 || y > H - 2) return false;
  const on = (px, py) => g.floors.some((f) => f.z === z && f.has(px, py));
  if (![[0, 0], [R - 3, 0], [3 - R, 0], [0, R - 3], [0, 3 - R]].every(([a, b]) => on(x + a, y + b))) return false;
  if (g.solidsZ.some((q) => q.z === z && inR(q, x, y, R - 1))) return false;
  if ((g.checkpoints || []).some((cp) => (cp.z || 0) === z && inR(W6.cpZone(cp), x, y, R - 1))) return false;
  return true;
}
function grid(sc, z) {
  const key = '_grid' + z; if (sc[key]) return sc[key];
  const nx = W / STEP, ny = H / STEP, ok = new Uint8Array(nx * ny);
  const top = z && sc.row > 0 ? (z === 2 ? P['world.highHeight'] : P['world.deckHeight']) * P['proto.art.extrusion'] + 4 : 0; // at a level, the band under the top edge crosses north as drawn
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) ok[j * nx + i] = (j + 0.5) * STEP > top && standZ(sc, z, (i + 0.5) * STEP, (j + 0.5) * STEP) ? 1 : 0;
  return (sc[key] = { nx, ny, ok, z });
}
function nearest(G, x, y) {
  const i0 = Math.floor(x / STEP), j0 = Math.floor(y / STEP);
  for (let r = 0; r < 8; r++) for (let j = j0 - r; j <= j0 + r; j++) for (let i = i0 - r; i <= i0 + r; i++) {
    if (Math.max(Math.abs(i - i0), Math.abs(j - j0)) !== r || i < 0 || j < 0 || i >= G.nx || j >= G.ny) continue;
    if (G.ok[j * G.nx + i]) return j * G.nx + i;
  }
  return -1;
}
function astar(G, x0, y0, x1, y1) { // 8-connected, no corner cutting; returns waypoints in world units
  const s = nearest(G, x0, y0), t = nearest(G, x1, y1); if (s < 0 || t < 0) return null;
  const n = G.nx * G.ny, gS = new Float64Array(n).fill(Infinity), from = new Int32Array(n).fill(-1), done = new Uint8Array(n), heap = [];
  const hx = (k) => { const i = k % G.nx, j = (k - i) / G.nx, ti = t % G.nx, tj = (t - ti) / G.nx; return Math.hypot(i - ti, j - tj); };
  const push = (k, f) => { heap.push([f, k]); let c = heap.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (heap[p][0] <= heap[c][0]) break; [heap[p], heap[c]] = [heap[c], heap[p]]; c = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let c = 0; for (;;) { const l = 2 * c + 1, r = l + 1; let m = c; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === c) break; [heap[m], heap[c]] = [heap[c], heap[m]]; c = m; } } return top; };
  gS[s] = 0; push(s, hx(s));
  while (heap.length) {
    const [, k] = pop(); if (done[k]) continue; done[k] = 1; if (k === t) break;
    const i = k % G.nx, j = (k - i) / G.nx;
    for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) {
      if (!a && !b) continue; const ii = i + a, jj = j + b; if (ii < 0 || jj < 0 || ii >= G.nx || jj >= G.ny) continue;
      const q = jj * G.nx + ii; if (!G.ok[q] || (a && b && (!G.ok[j * G.nx + ii] || !G.ok[jj * G.nx + i]))) continue;
      const c = gS[k] + (a && b ? Math.SQRT2 : 1); if (c < gS[q]) { gS[q] = c; from[q] = k; push(q, c + hx(q)); }
    }
  }
  if (!done[t]) return null;
  const out = []; for (let k = t; k >= 0; k = from[k]) { const i = k % G.nx; out.push({ x: (i + 0.5) * STEP, y: ((k - i) / G.nx + 0.5) * STEP }); }
  out.reverse(); out.push({ x: x1, y: y1 }); return out;
}
function follow(s, pts, z) { // the dummy follows waypoints by the game's physics; fails if it is stuck, drops, falls in or leaves
  const name = s.screenName(); let k = 0, best = Infinity, still = 0;
  const left = (b) => { let d = hyp(pts[k].x - b.x, pts[k].y - b.y); for (let i = k + 1; i < pts.length; i++) d += hyp(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); return d; };
  for (let t = 0; t < 60 * 60; t++) {
    const b = s.body;
    while (k < pts.length - 1 && hyp(pts[k].x - b.x, pts[k].y - b.y) < 14) k++;
    const tg = pts[Math.min(k + 2, pts.length - 1)], dx = tg.x - b.x, dy = tg.y - b.y, l = hyp(dx, dy);
    if (k >= pts.length - 1 && l < 8) return { ok: true };
    calm(s); s.step({ mx: dx / (l || 1), my: dy / (l || 1) });
    while (s.phase === 'scroll' || s.phase === 'hitstop') s.step({});
    if (s.screenName() !== name) return { ok: false, why: 'left ' + name + ' for ' + s.screenName() };
    if (b.mode === 'rescue' || b.mode === 'drop' || b.stair || b.level !== z) return { ok: false, why: 'fell or climbed (' + b.mode + ', Z' + b.level + ') at ' + Math.round(b.x) + ',' + Math.round(b.y) };
    const d = left(b); if (d < best - 1) { best = d; still = 0; } else if (++still > 240) return { ok: false, why: 'stuck at ' + Math.round(b.x) + ',' + Math.round(b.y) };
  }
  return { ok: false, why: 'timed out' };
}
function crossingOf(w, sc, sd, z) { // the middle of the widest run where both sides of the shared edge stand open at the level
  const nb = w.at(sc.col + SIDE[sd][0], sc.row + SIDE[sd][1]); if (!nb) return null;
  const len = horiz(sd) ? W : H, d = R + 8, lw = z ? (z === 2 ? P['world.highHeight'] : P['world.deckHeight']) * P['proto.art.extrusion'] : 0;
  let best = null, run = null;
  for (let v = 24; v <= len - 24; v += 4) {
    const dh = R + 10 + (sd === 'N' ? lw : 0), dt = R + 10 + (OPP[sd] === 'N' ? lw : 0), [x, y] = edgePt(sd, v, dh), [qx, qy] = edgePt(OPP[sd], v, dt), ok = standZ(sc, z, x, y) && standZ(nb, z, qx, qy) && standZ(sc, z, ...edgePt(sd, v, d)) && (!z || nb.game.floors.some((f) => f.z === z && f.has(...edgePt(OPP[sd], v, 2))));
    if (ok) { if (!run) run = { a: v, b: v }; else run.b = v; } else if (run) { if (!best || run.b - run.a > best.b - best.a) best = run; run = null; }
  }
  if (run && (!best || run.b - run.a > best.b - best.a)) best = run;
  return best && best.b - best.a >= 8 ? { nb, v: (best.a + best.b) / 2, width: best.b - best.a + 4, lw } : null;
}
function cross(s, sd, v, z, lw) { // from inside, straight out across the edge, until the screen changes
  const from = s.screenName(), [tx, ty] = edgePt(sd, v, -(60 + lw));
  for (let t = 0; t < 60 * 6; t++) {
    const b = s.body, dx = tx - b.x, dy = ty - b.y, l = hyp(dx, dy);
    calm(s); s.step({ mx: dx / (l || 1), my: dy / (l || 1) });
    while (s.phase === 'scroll' || s.phase === 'hitstop') s.step({});
    if (s.screenName() !== from) { for (let k = 0; k < 20; k++) { s.step({ mx: SIDE[sd][0], my: SIDE[sd][1] }); while (s.phase === 'scroll') s.step({}); } return s.body.level === z && !s.body.drop; }
    if (b.level !== z || b.drop) return false;
  }
  return false;
}
// ---------- 1. reach: the district's walkable graph
function reach(w) {
  const nodes = new Map(), adj = new Map(), key = (sc, k) => sc.name + ':' + k;
  const link = (a, b) => { if (!a || !b || a === b) return; (adj.get(a) || adj.set(a, new Set()).get(a)).add(b); (adj.get(b) || adj.set(b, new Set()).get(b)).add(a); };
  const comp = new Map();
  for (const sc of w.scs) { const c = A.components(sc, STEP, R - 2); comp.set(sc, c); c.size.forEach((q, i) => nodes.set(key(sc, 'g' + i), { sc, kind: 'ground', cells: q.c })); sc.game.floors.forEach((f, i) => { if (!f.z) return; let area = 0; for (let y = 4; y < H && area < 3; y += 8) for (let x = 4; x < W && area < 3; x += 8) if (f.has(x, y)) area++; if (area >= 3) nodes.set(key(sc, 'f' + i), { sc, kind: f.kind, z: f.z }); }); } // a floor with no area on this screen is not a node
  const gAt = (sc, x, y) => { const i = comp.get(sc).at(x, y); return i >= 0 ? key(sc, 'g' + i) : null; };
  const fAt = (sc, z, x, y) => { const i = sc.game.floors.findIndex((f) => f.z === z && f.has(x, y)); return i >= 0 ? key(sc, 'f' + i) : null; };
  for (const sc of w.scs) {
    const g = sc.game;
    for (const sd of ['N', 'E', 'S', 'W']) {
      const nb = w.at(sc.col + SIDE[sd][0], sc.row + SIDE[sd][1]); if (!nb) continue;
      for (let v = 8; v < (horiz(sd) ? W : H) - 8; v += 8) {
        const [x, y] = edgePt(sd, v, R + 6), [qx, qy] = edgePt(OPP[sd], v, R + 6);
        if (A.standable(sc, x, y, null, R - 2) && A.standable(nb, qx, qy, null, R - 2)) link(gAt(sc, x, y), gAt(nb, qx, qy));
        const [ax, ay] = edgePt(sd, v, R + 1), [bx, by] = edgePt(OPP[sd], v, R + 1); if (W6.groundFree(sc, ax, ay) && W6.arrives(nb, bx, by, OPP[sd])) link(gAt(sc, ax, ay), gAt(nb, bx, by)); // as the dummy crosses: the push-out slides it in
        for (const z of [1, 2]) { const [ex, ey] = edgePt(sd, v, 3), [fx, fy] = edgePt(OPP[sd], v, 3); link(fAt(sc, z, ex, ey), fAt(nb, z, fx, fy)); }
      }
    }
    g.stairs.forEach((st) => { const G = A.stairGeom(st); link(gAt(sc, G.apron.x, G.apron.y), key(sc, 'f' + st.head)); });
    for (let y = 2; y < H; y += 4) for (let x = 2; x < W; x += 4) g.floors.forEach((f, i) => { if (!f.z || !f.has(x, y)) return; g.floors.forEach((h, j) => { if (j !== i && h.z === f.z && [[0, 0], [4, 0], [-4, 0], [0, 4], [0, -4]].some(([a, b]) => h.has(x + a, y + b))) link(key(sc, 'f' + i), key(sc, 'f' + j)); }); }); // floors that meet or touch at a level
  }
  const s0 = w.at(1, 1), sp = s0.game.spawns[0], start = sp.level ? fAt(s0, sp.level, sp.x, sp.y) : gAt(s0, sp.x, sp.y), seen = new Set([start]), q = [start];
  while (q.length) { const a = q.pop(); for (const b of adj.get(a) || []) if (!seen.has(b)) { seen.add(b); q.push(b); } }
  const lost = [...nodes.entries()].filter(([k, n]) => !seen.has(k) && (n.kind !== 'ground' || n.cells >= 24)).map(([k, n]) => { if (n.kind === 'ground') { const c = comp.get(n.sc), i = +k.split(':g')[1]; n.box = c.box ? c.box(i) : null; } return [k, n]; });
  const total = [...nodes.entries()].filter(([, n]) => n.kind !== 'ground' || n.cells >= 24).length;
  return { total, reached: total - lost.length, lost: lost.map(([k, n]) => k + ' (' + n.kind + (n.cells ? ' ' + n.cells + ' cells' + (n.box ? ' in ' + n.box.join(',') : '') : '') + ')') };
}
// ---------- 2. the tour
function tour(id) {
  const s = new W6.Sim6(id, {}, null, { warm: 0 }); empty(s);
  const w = s.W6, log = { crossings: 0, crossFail: [], aprons: 0, apronFail: [], walked: 0, screens: new Set() };
  const s0 = w.at(1, 1), sp = s0.game.spawns.find((q) => !q.level) || s0.game.spawns[0];
  place(s, s0, sp.x, sp.y, 0);
  const go = (x, y, z) => { const b = s.body, pts = astar(grid(s.sc, z || 0), b.x, b.y, x, y); if (!pts) return { ok: false, why: 'no path to ' + Math.round(x) + ',' + Math.round(y) }; const r = follow(s, pts, z || 0); if (r.ok) log.walked += pts.length * STEP; return r; };
  const visited = new Set();
  const visit = (sc, z) => {
    visited.add(sc.name + z); log.screens.add(sc.name + (z ? '@Z' + z : ''));
    if (!z) for (const st of sc.game.stairs) { const G = A.stairGeom(st), r = go(G.apron.x, G.apron.y, 0); if (r.ok) log.aprons++; else log.apronFail.push(sc.name + ' flight at ' + Math.round(G.apron.x) + ',' + Math.round(G.apron.y) + ': ' + r.why); }
    for (const sd of ['N', 'E', 'S', 'W']) {
      const c = crossingOf(w, sc, sd, z); if (!c || visited.has(c.nb.name + z)) continue;
      const [ix, iy] = edgePt(sd, c.v, R + 10 + (sd === 'N' ? c.lw : 0)), r = go(ix, iy, z);
      if (!r.ok) { if (!/^no path/.test(r.why)) log.crossFail.push(`${sc.name}→${c.nb.name}${z ? ' Z' + z : ''}: ${r.why}`); continue; }
      if (!cross(s, sd, c.v, z, c.lw)) { log.crossFail.push(`${sc.name}→${c.nb.name}${z ? ' Z' + z : ''}: the crossing held`); place(s, sc, ix, iy, z, z ? sc.game.floors.findIndex((f) => f.z === z && f.has(ix, iy)) : null); continue; }
      log.crossings++;
      visit(c.nb, z);
      const [bx, by] = edgePt(OPP[sd], c.v, R + 10 + (OPP[sd] === 'N' ? c.lw : 0)), back = go(bx, by, z);
      if (!back.ok || !cross(s, OPP[sd], c.v, z, c.lw)) { log.crossFail.push(`${c.nb.name}→${sc.name}${z ? ' Z' + z : ''} (back): ${back.ok ? 'the crossing held' : back.why}`); place(s, sc, ix, iy, z, z ? sc.game.floors.findIndex((f) => f.z === z && f.has(ix, iy)) : null); continue; }
      log.crossings++;
    }
  };
  visit(s0, 0);
  if (id === 'waterfront') { // up the A2 cliff escalator onto the hill, then the hilltop at Z1: A1, B1, C1
    const a2 = w.at(0, 1), st = a2.game.stairs.find((q) => a2.game.floors[q.head].kind === 'hill');
    place(s, a2, A.stairGeom(st).apron.x, A.stairGeom(st).apron.y, 0);
    const G = A.stairGeom(st); let k = 0; while (k++ < 600 && !(s.body.level === 1 && !s.body.stair)) { const dx = G.head.x - s.body.x, dy = G.head.y - s.body.y, l = hyp(dx, dy); s.step({ mx: dx / l, my: dy / l }); }
    if (s.body.level === 1) { log.screens.add('A2@Z1'); const c = crossingOf(w, a2, 'N', 1); if (c) { const [ix, iy] = edgePt('N', c.v, R + 10 + c.lw), r = go(ix, iy, 1); if (r.ok && cross(s, 'N', c.v, 1, c.lw)) { log.crossings++; visit(w.at(0, 0), 1); } else log.crossFail.push('A2→A1 Z1: ' + (r.ok ? 'the crossing held' : r.why)); } else log.crossFail.push('A2→A1 Z1: no crossing'); }
    else log.crossFail.push('A2: the cliff escalator did not reach the hill');
  }
  return log;
}
// ---------- 3. buildings: walk into every face of every plan; stop at it
function bump(id) {
  const s = new W6.Sim6(id, {}, null, { warm: 0 }); empty(s);
  let n = 0; const fail = [];
  for (const sc of s.W6.scs) {
    const plans = sc.props.filter((p) => p.bldg && p.plan).map((p) => ({ name: p.bldg, x: p.plan[0], y: p.plan[1], w: p.plan[2], h: p.plan[3] }))
      .concat(sc.props.filter((p) => p.bldg && !p.plan && p.spr && !p.tower).map((p) => { const S = p.spr, U = W / PIX.AW; return { name: p.bldg, x: (p.x - (S.ox || 0)) * U, y: p.y * U, w: S.w * U, h: (S.h - (S.oy || 0)) * U }; }));
    for (const q of plans) for (const [sd, ox, oy] of [['S', 0, 1], ['N', 0, -1], ['W', -1, 0], ['E', 1, 0]]) {
      const fx = ox ? (ox > 0 ? q.x + q.w : q.x) : q.x + q.w / 2, fy = oy ? (oy > 0 ? q.y + q.h : q.y) : q.y + q.h / 2, px = fx + ox * (R + 12), py = fy + oy * (R + 12);
      if (!A.standable(sc, px, py)) continue;
      place(s, sc, px, py, 0); n++;
      for (let t = 0; t < 72; t++) { s.step({ mx: -ox, my: -oy }); while (s.phase === 'scroll' || s.phase === 'hitstop') s.step({}); }
      const b = s.body, pen = ox ? (ox > 0 ? q.x + q.w + R - b.x : b.x - (q.x - R)) : (oy > 0 ? q.y + q.h + R - b.y : b.y - (q.y - R));
      if (pen > 3 || s.screenName() !== sc.name) fail.push(`${sc.name} ${q.name} ${sd} face: ${pen.toFixed(0)} into the plan`);
    }
  }
  return { n, fail };
}
// ---------- 4. traps: the dummy wanders at random by the game's physics, cars cleared. A new heading of eight every 0.5 s,
// held on one time in two. A spot it stays in (under 6 units in 4 s, four or more headings tried) is checked: a trap if
// none of eight headings, held 1 s from there, gets it 12 away.
function wander(id, secs, seed) {
  const s = new W6.Sim6(id, {}, null, { warm: 0 }); empty(s);
  let r = (seed || 7) >>> 0; const rnd = () => ((r = (Math.imul(r, 1664525) + 1013904223) >>> 0) / 4294967296);
  const traps = [], screens = new Set(), levels = new Set(), hist = [], heads = [];
  const sp = s.W6.at(1, 1).game.spawns.find((q) => !q.level) || s.W6.at(1, 1).game.spawns[0];
  place(s, s.W6.at(1, 1), sp.x, sp.y, sp.level || 0);
  let h = 0, falls = 0;
  for (let k = 0; k < secs * 60; k++) {
    calm(s);
    if (k % 30 === 0) { if (rnd() < 0.5) h = Math.floor(rnd() * 8); heads.push(h); if (heads.length > 8) heads.shift(); }
    const b = s.body, busy = b.mode === 'rescue' || b.mode === 'drop' || !b.alive;
    s.step(busy ? {} : { mx: Math.cos(h * Math.PI / 4), my: Math.sin(h * Math.PI / 4) });
    while (s.phase === 'scroll' || s.phase === 'hitstop') s.step({});
    if (s.phase !== 'play') { s.phase = 'play'; }
    if (b.mode === 'drop') falls++;
    const sc = s.sc || s.W6.at(1, 1), gx = sc.col * W + s.body.x, gy = sc.row * H + s.body.y;
    screens.add(s.screenName() + (s.body.level ? '@Z' + s.body.level : '')); levels.add(s.body.level);
    hist.push([gx, gy, s.body.mode, s.body.stair]); if (hist.length > 241) hist.shift();
    if (k % 60 === 0 && hist.length > 240) {
      const [ox, oy] = hist[0], still = hist.every(([x, y, m, st]) => hyp(x - ox, y - oy) < 6 && m !== 'rescue' && m !== 'drop' && !st);
      if (still && new Set(heads).size >= 4) { // suspect: from here, each of eight headings for 1 s; a trap if none gets 12 away
        const sc0 = s.sc, b0 = Object.assign({}, s.body), free = [];
        for (let d = 0; d < 8; d++) {
          place(s, sc0, b0.x, b0.y, b0.level, b0.floor); calm(s);
          for (let t = 0; t < 60; t++) { s.step({ mx: Math.cos(d * Math.PI / 4), my: Math.sin(d * Math.PI / 4) }); while (s.phase === 'scroll' || s.phase === 'hitstop') s.step({}); }
          if (s.sc !== sc0 || hyp(s.body.x - b0.x, s.body.y - b0.y) > 12 || s.body.level !== b0.level) free.push(d);
        }
        if (!free.length) traps.push(`${sc0.name} ${Math.round(b0.x)},${Math.round(b0.y)} Z${b0.level}`);
        place(s, s.W6.at(1, 1), sp.x, sp.y, sp.level || 0); hist.length = 0;
      }
    }
  }
  return { traps, screens, levels: [...levels].sort(), falls };
}
module.exports = { reach, tour, bump, wander };
if (require.main === module) {
  let bad = 0;
  for (const id of process.argv[2] ? [process.argv[2]] : W6.LEVEL_LIST) {
    const w = W6.buildWorld(id, { warm: 0 }), r = reach(w), t = tour(id), b = bump(id), wd = [1, 2, 3].map((sd) => wander(id, 300, sd));
    console.log(`${id}: reach ${r.reached}/${r.total}${r.lost.length ? ' — not reached: ' + r.lost.join('; ') : ''}`);
    console.log(`${id}: tour ${[...t.screens].join(' ')} | ${t.crossings} crossings, ${t.aprons} aprons, ${Math.round(t.walked)} units walked${t.crossFail.length ? ' — crossings failed: ' + t.crossFail.join('; ') : ''}${t.apronFail.length ? ' — aprons failed: ' + t.apronFail.join('; ') : ''}`);
    console.log(`${id}: buildings ${b.n - b.fail.length}/${b.n} faces hold${b.fail.length ? ' — ' + b.fail.join('; ') : ''}`);
    const traps = [].concat(...wd.map((q) => q.traps)), seen = new Set([].concat(...wd.map((q) => [...q.screens])));
    console.log(`${id}: wander 3 × 5 min at random: ${seen.size} screen-levels visited, ${traps.length} traps${traps.length ? ' — ' + traps.join('; ') : ''}`);
    bad += r.lost.length + t.crossFail.length + t.apronFail.length + b.fail.length + traps.length;
  }
  process.exit(bad ? 1 : 0);
}
