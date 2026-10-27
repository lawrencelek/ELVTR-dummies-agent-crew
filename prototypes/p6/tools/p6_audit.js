// P6.3 (Edit 65): playtest audits for every screen of the three districts.
// 1. Stairs: on screen as drawn (the head's lift included); a clear apron at the foot; the apron joined to the screen's
//    open ground; walked up from the apron to the head floor and back down, by the game's own physics.
// 2. Buildings: every drawn plan is solid at its level; every captured rect lies under a drawn plan (no invisible walls).
// 3. Walkway ends: every end lands on a floor at Z1 (a roof, a deck, the hill, a terrace) or runs on into the next screen.
// Run from prototypes/p6: node tools/p6_audit.js [district]   (exits 1 on any failure)
'use strict';
const W6 = require('../world6.js'), X = require('../sim.js'), PIX = globalThis.PIX;
const P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), W = P['world.width'], H = P['world.height'], R = P['body.radius'], U = W / PIX.AW, PW = P['world.parapetWidth'];
const APRON = P['world.stairApron'], SWD = P['world.stairWidth']; // the clear apron beyond a stair's foot: the body's width and a step either side
const inR = (r, x, y, m) => x >= r.x - m && x <= r.x + r.w + m && y >= r.y - m && y <= r.y + r.h + m;

function walk(s, x, y, secs, stop) {
  for (let k = 0; k < secs * 60; k++) {
    if (stop && stop(s)) return true;
    const b = s.body, dx = x - b.x, dy = y - b.y, l = Math.hypot(dx, dy);
    if (!stop && l < 4) return true;
    s.step({ mx: dx / (l || 1), my: dy / (l || 1) });
    while (s.phase === 'scroll' || s.phase === 'hitstop') s.step({});
  }
  return !!(stop && stop(s));
}
function place(s, sc, x, y, lv, fl) {
  s.enter(sc);
  Object.assign(s.body, { x, y, px: x, py: y, level: lv || 0, floor: fl == null ? null : fl, stair: null, drop: null, mode: 'idle', vx: 0, vy: 0, lunge: null, alive: true });
  s.buildView(); s.phase = 'play';
}
const empty = (s) => { for (const sm of s.W6.sims) { sm.cars.length = 0; sm.slot = sm.schedule.length; sm.deckNext = { 0: 1e9, 1: 1e9, 2: 1e9, 3: 1e9 }; } s.W6.budget = 0; s.buildView(); };

// where the dummy can stand at Z0 (its centre): clear of solids, the hill, water, stairs and ground booms by the body's radius
function standable(sc, x, y, own) {
  const g = sc.game;
  if (x < R || y < R || x > W - R || y > H - R) return false;
  if (g.statics.some((q) => inR(q, x, y, R - 1))) return false;
  if (g.stairs.some((q) => q !== own && inR(q, x, y, R - 1))) return false;
  if (g.polys0.some((p) => PIX.inPoly(p, x, y))) return false;
  if (g.water.some((p) => PIX.inPoly(p, x, y))) return false;
  if ((g.checkpoints || []).some((cp) => !cp.deck && !cp.z && inR(W6.cpZone(cp), x, y, R - 1))) return false;
  return true;
}
function components(sc, step) {
  const nx = Math.floor(W / step), ny = Math.floor(H / step), id = new Int32Array(nx * ny).fill(-1), ok = new Uint8Array(nx * ny), size = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) ok[j * nx + i] = standable(sc, (i + 0.5) * step, (j + 0.5) * step) ? 1 : 0;
  let n = 0;
  for (let k = 0; k < ok.length; k++) {
    if (!ok[k] || id[k] >= 0) continue;
    const q = [k]; id[k] = n; let c = 0, edge = false;
    while (q.length) {
      const v = q.pop(), i = v % nx, j = (v - i) / nx; c++;
      if (i === 0 || j === 0 || i === nx - 1 || j === ny - 1) edge = true;
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + a, jj = j + b; if (ii < 0 || jj < 0 || ii >= nx || jj >= ny) continue; const w = jj * nx + ii; if (ok[w] && id[w] < 0) { id[w] = n; q.push(w); } }
    }
    size.push({ c, edge }); n++;
  }
  const main = size.reduce((a, s, i) => (a < 0 || s.c > size[a].c ? i : a), -1);
  const at = (x, y) => { let best = -1, bd = 1e9; for (let j = Math.max(0, Math.floor(y / step) - 2); j <= Math.min(ny - 1, Math.floor(y / step) + 2); j++) for (let i = Math.max(0, Math.floor(x / step) - 2); i <= Math.min(nx - 1, Math.floor(x / step) + 2); i++) { const k = j * nx + i; if (id[k] < 0) continue; const d = Math.hypot((i + 0.5) * step - x, (j + 0.5) * step - y); if (d < bd) { bd = d; best = id[k]; } } return bd <= step * 1.5 ? best : -1; };
  return { size, main, at, total: size.reduce((a, s) => a + s.c, 0) };
}
function stairGeom(st) {
  const dir = Math.sign(st.high - st.low), ay = st.axis === 'y', lat = ay ? st.x + st.w / 2 : st.y + st.h / 2;
  const pt = (a, l) => (ay ? { x: l, y: a } : { x: a, y: l });
  return { dir, lat, foot: pt(st.low, lat), apron: pt(st.low - dir * (R + 8), lat), apronFar: pt(st.low - dir * APRON, lat), head: pt(st.high + dir * (PW + R + 10), lat), pt };
}
function stairLift(sc, st) { const p = sc.props.find((q) => q.stair && q.stair.x === st.x && q.stair.y === st.y && q.stair.w === st.w && q.stair.h === st.h); return p ? p.spr.oy * U : (st.to === 2 ? 64 : 36); }

function auditStairs(s, sc, comp, out) {
  const g = sc.game;
  g.stairs.forEach((st, i) => {
    const tag = `${sc.D.id} ${sc.name} stair ${i} (${st.axis} ${Math.round(st.x)},${Math.round(st.y)} ${st.w}×${st.h} Z${st.to})`, G = stairGeom(st), lift = stairLift(sc, st);
    const top = st.y - lift, fails = [];
    if (st.x < 8 || st.x + st.w > W - 8 || top < 8 || st.y + st.h > H - 8) fails.push(`off screen as drawn (x ${Math.round(st.x)}–${Math.round(st.x + st.w)}, y ${Math.round(top)}–${Math.round(st.y + st.h)})`);
    const A = G.apronFar; if (A.x < R + 8 || A.x > W - R - 8 || A.y < R + 8 || A.y > H - R - 8) fails.push(`apron off screen (${Math.round(A.x)},${Math.round(A.y)})`);
    const apronClear = [R + 2, APRON / 2 + 1, APRON - R + 1].every((d) => [-1, 0, 1].every((k) => { const p = G.pt(st.low - G.dir * d, G.lat + k * (Math.min(st.axis === 'y' ? st.w : st.h, 2 * R) / 2 - R)); return standable(sc, p.x, p.y, st); }));
    if (!apronClear) fails.push(`apron blocked within ${APRON} of the foot`);
    const c = comp.at(G.apron.x, G.apron.y);
    if (c < 0) fails.push('apron not on open ground');
    else if (c !== comp.main && !comp.size[c].edge && comp.size[c].c < 0.15 * comp.total) fails.push(`apron in a pocket (${comp.size[c].c} cells, main ${comp.size[comp.main].c})`);
    // drawn clear of every building, bar the one whose roof it climbs to (a flight drawn over a tower reads as on its roof)
    const sr = { x: st.x, y: top, w: st.w, h: st.y + st.h - top }, hf = g.floors[st.head];
    for (const p of sc.props.concat(...sc.layers.map((l) => l.props || []))) {
      if (!p.spr || p.stair || p.draw || (!p.bldg && !p.tower && !(p.spr.oy > 20))) continue;
      const S = p.spr, br = { x: (p.x - (S.ox || 0)) * U, y: (p.y - (S.oy || 0)) * U, w: S.w * U, h: S.h * U };
      const ix = Math.min(sr.x + sr.w, br.x + br.w) - Math.max(sr.x, br.x), iy = Math.min(sr.y + sr.h, br.y + br.h) - Math.max(sr.y, br.y);
      if (ix <= 6 || iy <= 6) continue; // a sliver: the flight's slope clears it
      const F = planOf(p), climbs = hf && hf.has(F.x + F.w / 2, F.y + F.h / 2) && (p.podium || p.bldg === 'roof plaza' || p.bldg === 'terrace' || p.bldg === 'landing' || p.bldg === 'pier');
      if (!climbs && !p.tower) fails.push(`drawn over ${p.bldg || 'a building'} at ${Math.round(br.x)},${Math.round(br.y)} (${Math.round(ix)}×${Math.round(iy)})`);
      if (p.tower && !climbs && !(hf && hf.kind === 'roof')) fails.push(`drawn over a tower at ${Math.round(br.x)},${Math.round(br.y)}`);
    }
    // up: from the apron to the head floor
    place(s, sc, G.apron.x, G.apron.y, 0);
    walk(s, G.head.x, G.head.y, 6, (q) => q.screenName() !== sc.name || (q.body.level === st.to && !q.body.stair));
    const up = s.screenName() === sc.name && s.body.level === st.to && s.body.floor === st.head;
    if (!up) fails.push(`cannot walk up (ends ${s.screenName()} ${Math.round(s.body.x)},${Math.round(s.body.y)} Z${s.body.level}${s.body.stair ? ' on the stair' : ''})`);
    // down: from the head floor back to the apron
    place(s, sc, G.head.x, G.head.y, st.to, st.head);
    walk(s, G.apron.x, G.apron.y, 6, (q) => q.screenName() !== sc.name || (q.body.level === 0 && !q.body.stair && Math.hypot(q.body.x - G.apron.x, q.body.y - G.apron.y) < 10));
    const down = s.screenName() === sc.name && s.body.level === 0 && Math.hypot(s.body.x - G.apron.x, s.body.y - G.apron.y) < 16;
    if (!down) fails.push(`cannot walk down (ends ${s.screenName()} ${Math.round(s.body.x)},${Math.round(s.body.y)} Z${s.body.level}${s.body.mode === 'drop' ? ' dropping' : ''})`);
    out.push({ kind: 'stair', tag, ok: !fails.length, fails });
  });
}

// a sprite's ground plan (world units): below its lift
function planOf(p) { if (p.plan) return { x: p.plan[0], y: p.plan[1], w: p.plan[2], h: p.plan[3] }; const S = p.spr; return { x: (p.x - (S.ox || 0)) * U, y: p.y * U, w: S.w * U, h: (S.h - (S.oy || 0)) * U }; }
function auditBuildings(sc, out) {
  const g = sc.game, plans = [];
  const solid0 = (x, y) => g.statics.some((q) => inR(q, x, y, 0)) || g.polys0.some((p) => PIX.inPoly(p, x, y)) || g.water.some((p) => PIX.inPoly(p, x, y));
  for (const p of sc.props) {
    if (!p.spr || p.stair || p.draw || p.tower || !p.bldg) continue;
    const F = planOf(p); plans.push(F);
    let n = 0, hit = 0;
    for (let y = F.y + 4; y < F.y + F.h - 3; y += 4) for (let x = F.x + 4; x < F.x + F.w - 3; x += 4) { if (x < 0 || y < 0 || x > W || y > H) continue; n++; if (solid0(x, y)) hit++; }
    const share = n ? hit / n : 1;
    out.push({ kind: 'plan', tag: `${sc.D.id} ${sc.name} ${p.bldg} at ${Math.round(F.x)},${Math.round(F.y)} ${Math.round(F.w)}×${Math.round(F.h)}`, ok: share >= 0.98, fails: share >= 0.98 ? [] : [`plan ${Math.round(share * 100)}% solid at Z0`] });
  }
  for (const l of sc.layers) for (const p of l.props || []) { // the hill's buildings stand at Z1: their plans are Z1 solids
    if (!p.spr) continue; const F = planOf(p); let n = 0, hit = 0;
    for (let y = F.y + 4; y < F.y + F.h - 3; y += 4) for (let x = F.x + 4; x < F.x + F.w - 3; x += 4) { if (x < 0 || y < 0 || x > W || y > H) continue; n++; if (g.solidsZ.some((q) => q.z === 1 && inR(q, x, y, 0)) || !g.floors.some((f) => f.kind === 'hill' && f.has(x, y)) || (p.portal && x >= p.portal[0] && x <= p.portal[1])) hit++; } // a portal's opening is the street under it
    const share = n ? hit / n : 1;
    out.push({ kind: 'plan', tag: `${sc.D.id} ${sc.name} hill building at ${Math.round(F.x)},${Math.round(F.y)} ${Math.round(F.w)}×${Math.round(F.h)}`, ok: share >= 0.98, fails: share >= 0.98 ? [] : [`plan ${Math.round(share * 100)}% solid at Z1`] });
  }
  for (const q of g.statics) { // a captured block lies under a drawn plan, or is a planter, wall, booth, pilotis, column, portal pillar, mass
    if (q.kind !== 'block') continue;
    let n = 0, hit = 0;
    for (let y = q.y + 2; y < q.y + q.h - 1; y += 4) for (let x = q.x + 2; x < q.x + q.w - 1; x += 4) { n++; if (plans.some((F) => inR(F, x, y, 2))) hit++; }
    const share = n ? hit / n : 1;
    if (share < 0.98) out.push({ kind: 'plan', tag: `${sc.D.id} ${sc.name} solid ${Math.round(q.x)},${Math.round(q.y)} ${Math.round(q.w)}×${Math.round(q.h)}`, ok: false, fails: [`${Math.round((1 - share) * 100)}% outside any drawn plan (invisible wall)`] });
  }
}
// walkway ends: each end joins another walkway, a stair (in line at its head, or square beside its end), or lands across its
// full width on a floor at Z1 (roof, deck, hill, terrace, ring), the slab stopping at that floor's edge; or it runs on off the screen
function auditWalkways(sc, out) {
  const g = sc.game, wl = sc.walk; if (!wl) return;
  const fi = g.floors.findIndex((f) => f.kind === 'walk'), hw = P['world.walkwayWidth'] / 2, inRect = (r, x, y) => x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3];
  const masked = (x, y) => (wl.roofs || []).concat(wl.joins || []).some((r) => inRect(r, x, y)) || (wl.under ? wl.under(x, y) : false);
  for (const p of wl.polys) {
    if (!p.spine) continue;
    const sp = p.spine, closed = sp.length > 2 && sp[0][0] === sp[sp.length - 1][0] && sp[0][1] === sp[sp.length - 1][1]; if (closed) continue;
    for (const [e, prev] of [[sp[0], sp[1]], [sp[sp.length - 1], sp[sp.length - 2]]]) {
      const l = Math.hypot(e[0] - prev[0], e[1] - prev[1]) || 1, ux = (e[0] - prev[0]) / l, uy = (e[1] - prev[1]) / l;
      let a = 0; while (a < 240 && PIX.inPoly(p, e[0] + ux * a, e[1] + uy * a)) a += 1;
      const ex = e[0] + ux * a, ey = e[1] + uy * a, tag = `${sc.D.id} ${sc.name} walkway end at ${Math.round(ex)},${Math.round(ey)}`, at = (d, k) => [ex + ux * d - uy * k, ey + uy * d + ux * k];
      if (ex < 2 || ey < 2 || ex > W - 2 || ey > H - 2) continue; // runs on into the next screen (the edge audit marks it)
      if (wl.polys.some((q) => q !== p && (PIX.inPoly(q, ...at(3, 0)) || PIX.inPoly(q, ...at(-3, 0))))) continue; // joins another walkway
      const st = g.stairs.find((q) => { const G = stairGeom(q), hx = q.axis === 'y' ? G.lat : q.high, hy = q.axis === 'y' ? q.high : G.lat; return Math.abs((hx - ex) * ux + (hy - ey) * uy) < hw + SWD && Math.abs(-(hx - ex) * uy + (hy - ey) * ux) < hw + SWD / 2 + 2; });
      if (st) {
        const inLine = st.axis === 'x' ? Math.abs(ux) > 0.9 : Math.abs(uy) > 0.9, G = stairGeom(st), hx = st.axis === 'y' ? G.lat : st.high, hy = st.axis === 'y' ? st.high : G.lat;
        const off = inLine ? (hx - ex) * ux + (hy - ey) * uy : Math.max(...[[st.x, st.y], [st.x + st.w, st.y + st.h]].map(([qx, qy]) => (qx - ex) * ux + (qy - ey) * uy));
        out.push({ kind: 'walk', tag: tag + ' (stair)', ok: Math.abs(off) <= 4, fails: Math.abs(off) <= 4 ? [] : [`not square with the stair at its end (${Math.round(off)} off)`] }); continue;
      }
      const fs = g.floors.filter((f, i) => i !== fi && f.z === 1);
      const lands = [-1, 0, 1].every((k) => fs.some((f) => f.has(...at(6, k * (hw - 3)))));
      let over = 0; for (let d = 2; d <= 40; d += 2) { if ([-1, 0, 1].some((k) => { const [qx, qy] = at(-d, k * (hw - 3)); return PIX.inPoly(p, qx, qy) && !masked(qx, qy) && fs.some((f) => f.kind !== 'deck' && f.has(qx, qy)); })) over = d; else break; } // drawn slab over the floor it joins, from the end inward
      const fails = []; if (!lands) fails.push(fs.some((f) => f.has(...at(6, 0))) ? 'lands on a floor across part of its width only' : 'ends in the air'); if (over > 6) fails.push(`its slab runs ${over} onto the floor it joins (not a clean joint)`);
      out.push({ kind: 'walk', tag, ok: !fails.length, fails });
    }
  }
}
function auditDistrict(id) {
  const s = new W6.Sim6(id, {}, null, { warm: 0 }); empty(s);
  const out = [];
  for (const sc of s.W6.scs) {
    const comp = components(sc, 8);
    auditStairs(s, sc, comp, out); auditBuildings(sc, out); auditWalkways(sc, out);
  }
  return out;
}
module.exports = { auditDistrict, standable, components, stairGeom, APRON };
if (require.main === module) {
  const ids = process.argv[2] ? [process.argv[2]] : W6.LEVEL_LIST;
  let bad = 0, n = 0;
  for (const id of ids) for (const r of auditDistrict(id)) { n++; if (!r.ok) { bad++; console.log('FAIL', r.tag, '—', r.fails.join('; ')); } }
  console.log(`${n - bad}/${n} pass`);
  process.exit(bad ? 1 : 0);
}
