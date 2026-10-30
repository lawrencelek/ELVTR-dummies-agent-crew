// Edit 61: the Circus valley in the game's projection, to check the designs and the tunnel in the game's own 2D view.
// One rule for everything: a point at height z draws at (x, y − z × proto.art.extrusion). Horizontal surfaces draw at their
// lift, as plan shapes; only south-facing vertical faces show (front elevations); east and west faces are edge-on. No
// vanishing point: a lane that enters the tunnel keeps its width and its centre line. Painter's order: north to south, then
// low to high. Shadows: decision 309 (option 2), one mask per level, drawn at that level's lift. Cyber palette (pixel.js).
(function (root) {
  const V = root.CIRCUS_VALLEY || require('./circus_valley.js'), G = V.geo, P = G.P, hyp = Math.hypot;
  const EX = G.EXTW, Z1H = G.Z1H, S = G.STOREY, LW = G.LW, OUTER = G.OUTER, HALF = G.HALF, WALK = G.WALK, WCOL = G.WCOL, SWD = G.SWD, COL = G.COL, SPAN = G.SPAN;
  const PW = P['world.parapetWidth'], DW = G.DW, DH = G.DH, W = G.W, H = G.H, RS = G.RS, RZ = G.RIVER * Z1H, HB = 0.7 * Z1H; // HB: the tunnel's clear height (drawing)
  const K = { ground: '#262B36', ground2: '#2C3243', hill: '#2E3546', hill2: '#384056', road: '#1E222C', shoulder: '#2B3140', lane: '#C9E9FF',
    water: '#08101E', water2: '#13234A', water3: '#0C1830', sand: '#4B4946', sand2: '#5C5A57', sand3: '#3E3C3A',
    conM: '#4A5160', conD: '#363C49', conL: '#7D8799', conX: '#22262F', conT: '#3B4250', conT2: '#444B5A',
    deck: '#3B4459', deck2: '#323A4D', joint: '#262C3B', column: '#4A5470', columnD: '#262D40',
    stone: '#C9D3DA', stoneD: '#8C98A6', stoneL: '#EEF2F4', lawn: '#1F3A27', lawn2: '#2A4A32', lime: '#7CC24A',
    cyan: '#3FD0FF', blue: '#2F6BFF', violet: '#9B6BFF', mag: '#FF5FD2', white: '#E6F4FF', dark: '#05080C',
    fleetTop: '#DDE6EE', fleetRoof: '#F4F8FB', fleetSide: '#8C9AA8', fleetSide2: '#5E6B78', glass: '#0E3A4F', timber: '#2A3245', timberL: '#3A4458' };
  const LED = [K.cyan, K.blue, K.violet, K.mag, K.white]; // never yellow, never red (Edit 37)
  const Y = (y, z) => y - EX * z;
  const n1 = (v) => (Math.round(v * 10) / 10).toString();
  const dd = (pts) => 'M' + pts.map((p) => n1(p[0]) + ' ' + n1(p[1])).join('L');
  const poly = (pts, fill, ex) => `<path d="${dd(pts)}Z" fill="${fill}"${ex ? ' ' + ex : ''}/>`;
  const rect = (x0, y0, x1, y1, fill, ex) => (x1 - x0 < 0.05 || y1 - y0 < 0.05 ? '' : `<rect x="${n1(x0)}" y="${n1(y0)}" width="${n1(x1 - x0)}" height="${n1(y1 - y0)}" fill="${fill}"${ex ? ' ' + ex : ''}/>`);
  const line = (pts, stroke, w, ex) => `<path d="${dd(pts)}" fill="none" stroke="${stroke}" stroke-width="${w}"${ex ? ' ' + ex : ''}/>`;
  const lift = (pts, z) => pts.map(([x, y]) => [x, Y(y, z)]);
  const hsh = (a, b) => { let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return (h ^ (h >>> 16)) >>> 0; };

  // ---------- roads at a level: shoulders, lanes, lane edges, a dashed centre; an LED edge on Z1 streets
  function road(pts, z, led) {
    const p = lift(pts, z), j = 'stroke-linejoin="round"';
    return (led ? line(p, K.cyan, 2 * OUTER + 8, j) : '') + line(p, K.shoulder, 2 * OUTER, j) + line(p, K.lane, 2 * LW + 4, j + ' stroke-opacity="0.55"') + line(p, K.road, 2 * LW - 2, j) + line(p, K.lane, 3, 'stroke-dasharray="20 20" stroke-opacity="0.8"');
  }
  // ---------- one volume: its south face (front elevation), then its roof at its lift; detail by kind
  function vol(v, seed) {
    const s = [], yt = Y(v.y1, v.z1), yb = Y(v.y1, v.z0), yr = Y(v.y0, v.z1), w = v.x1 - v.x0, k = v.kind;
    const slots = (fill, z0, z1, lit) => { for (let z = z0, f = 0; z + S <= z1 + 0.5; z += S, f++) { s.push(rect(v.x0 + 3, Y(v.y1, z + S - 1), v.x1 - 3, Y(v.y1, z + S - 4), K.conL)); s.push(rect(v.x0 + 4, Y(v.y1, z + 24), v.x1 - 4, Y(v.y1, z + 10), fill)); for (let x = v.x0 + 6, c = 0; x < v.x1 - 12; x += 14, c++) { const q = hsh(c + seed, f * 7 + v.y0) % lit; if (q < 2) s.push(rect(x, Y(v.y1, z + 23), x + 8, Y(v.y1, z + 11), q ? K.white : LED[hsh(seed, c) % LED.length], 'fill-opacity="0.85"')); } } };
    if (k === 'podium' || k === 'tower' || k === 'mass' || k === 'pier' || k === 'plinth' || k === 'plinthS' || k === 'leg' || k === 'beam' || k === 'obelisk' || k === 'bollard') {
      s.push(rect(v.x0, yt, v.x1, yb, k === 'plinth' ? K.conD : K.conM));
      if (k === 'podium') { s.push(rect(v.x0, Y(v.y1, v.z0 + S), v.x1, yb, K.conX)); for (let x = v.x0 + 8; x < v.x1 - 4; x += 28) s.push(rect(x, Y(v.y1, v.z0 + S), x + 6, yb, K.conM)); if (v.shop) s.push(rect(v.x0 + 4, Y(v.y1, v.z0 + S - 4), v.x1 - 4, Y(v.y1, v.z0 + S - 9), LED[seed % LED.length])); slots(K.conX, v.z0 + S, v.z1, 7); }
      if (k === 'tower' || k === 'mass') { if (v.fins) for (let x = v.x0 + 6; x < v.x1 - 2; x += 12) s.push(rect(x, yt, x + 2, yb, K.conD)); slots(K.conX, v.z0, v.z1, 6); if (v.banner) for (let z = v.z0 + S, i = 0; z < v.z1 - 8; z += 12, i++) s.push(rect(v.x0 + 10, Y(v.y1, z + 12), v.x0 + 16, Y(v.y1, z), i % 2 ? K.white : LED[(seed + 3) % LED.length])); if (v.over) s.push(rect(v.x0, yb - 2, v.x1, yb, K.dark)); }
      if (k === 'pier') for (let x = v.x0 + 4; x < v.x1; x += 8) s.push(rect(x, yt, x + 1, yb, K.conD));
      if (k === 'plinth') { for (let z = v.z0 + 12; z < v.z1; z += 12) s.push(rect(v.x0, Y(v.y1, z), v.x1, Y(v.y1, z) + 1, K.conX)); s.push(rect(v.x0, Y(v.y1, v.z0 + 14), v.x1, yb, K.conX, 'fill-opacity="0.8"')); slots(K.conX, v.z0 + S, v.z1, 5); }
      if (k === 'obelisk') s.push(rect(v.x0 + w / 2 - 1, yt + 2, v.x0 + w / 2 + 1, yb - 2, K.cyan));
      if (k === 'beam') s.push(rect(v.x0 + 10, yt + 1, v.x1 - 10, yb - 1, K.mag));
      if (k === 'bollard') s.push(`<circle cx="${n1((v.x0 + v.x1) / 2)}" cy="${n1(yt)}" r="6" fill="${K.cyan}" fill-opacity="0.25"/>` + rect(v.x0, yt, v.x1, yt + 2, K.cyan));
      // the roof
      s.push(rect(v.x0, yr, v.x1, yt, k === 'tower' || k === 'mass' ? K.conT2 : K.conT));
      if (w > 60) { for (let x = v.x0 + 32; x < v.x1 - 8; x += 32) s.push(rect(x, yr, x + 1, yt, K.conD, 'fill-opacity="0.5"')); s.push(rect(v.x0, yr, v.x1, yt, 'none', `stroke="${K.conL}" stroke-width="1.5"`)); }
      if ((k === 'tower' || k === 'mass') && v.crown) s.push(rect(v.x0, yt - 1, v.x1, yt + 2, LED[(seed + 1) % LED.length]));
      if (k === 'tower' && w > 60) for (const [fx, fy, fw, fh] of [[0.18, 0.2, 0.22, 0.25], [0.55, 0.35, 0.18, 0.3]]) { const ux = v.x0 + w * fx, uy = v.y0 + (v.y1 - v.y0) * fy, uw = w * fw, uh = (v.y1 - v.y0) * fh; s.push(rect(ux, Y(uy, v.z1 + 12), ux + uw, Y(uy + uh, v.z1 + 12), K.conT) + rect(ux, Y(uy + uh, v.z1 + 12), ux + uw, Y(uy + uh, v.z1), K.conD)); }
      if (k === 'podium' && w > 160) for (let x = v.x0 + 30; x < v.x1 - 60; x += 140) { const uy = v.y0 + 20; s.push(rect(x, Y(uy, v.z1), x + 22, Y(uy + 8, v.z1), K.cyan, 'fill-opacity="0.35"')); }
      if (v.mast) { const mx = v.x0 + 14, my = v.y0 + 14; s.push(line([[mx, Y(my, v.z1)], [mx, Y(my, v.z1 + 90)]], K.conL, 2) + `<circle cx="${n1(mx)}" cy="${n1(Y(my, v.z1 + 92))}" r="2.5" fill="${LED[seed % LED.length]}"/>`); }
      if (k === 'obelisk') s.push(`<circle cx="${n1((v.x0 + v.x1) / 2)}" cy="${n1(yr)}" r="2" fill="${K.white}"/>`);
    } else if (k === 'deck') {
      if (v.cols) { const xs = w > 110 ? [v.x0 + 10, (v.x0 + v.x1) / 2, v.x1 - 10] : [v.x0 + 10, v.x1 - 10]; for (const x of xs) s.push(rect(x - WCOL / 2, Y(v.y1 - 10, v.z0), x + WCOL / 2, Y(v.y1 - 10, 0), K.column) + rect(x + WCOL / 2 - 4, Y(v.y1 - 10, v.z0), x + WCOL / 2, Y(v.y1 - 10, 0), K.columnD)); }
      s.push(rect(v.x0, yt, v.x1, yb, K.deck2), rect(v.x0, yr, v.x1, yt, K.ground2));
      for (let x = v.x0 + 16; x < v.x1; x += 16) s.push(rect(x, yr, x + 1, yt, K.hill2)); for (let y = v.y0 + 16; y < v.y1; y += 16) s.push(rect(v.x0, Y(y, v.z1), v.x1, Y(y, v.z1) + 1, K.hill2));
      s.push(rect(v.x0, yr, v.x1, yt, 'none', `stroke="${K.conL}" stroke-width="3"`)); if (v.led) s.push(rect(v.x0 + 2, yt - 3, v.x1 - 2, yt - 1, K.cyan));
    } else if (k === 'canopy') {
      for (const x of [v.x0 + 4, v.x1 - 4]) s.push(rect(x - 2, Y(v.y1 - 4, v.z0), x + 2, Y(v.y1 - 4, v.on), K.stoneD));
      s.push(rect(v.x0, yt, v.x1, yb, K.stoneD), rect(v.x0, yr, v.x1, yt, '#B9C2C8')); for (let x = v.x0 + 10; x < v.x1; x += 10) s.push(rect(x, yr, x + 1, yt, K.stoneD, 'fill-opacity="0.6"')); s.push(rect(v.x0, yt - 1, v.x1, yt + 1, K.mag));
    } else if (k === 'planter') {
      s.push(rect(v.x0, yt, v.x1, yb, K.conM), rect(v.x0, yr, v.x1, yt, K.conL), rect(v.x0 + 3, yr + 3, v.x1 - 3, yt - 2, K.lawn));
      for (let i = 0; i < 6; i++) { const px = v.x0 + 5 + (hsh(seed, i) % Math.max(1, Math.floor(w - 10))), py = yr + 4 + (hsh(i, seed) % Math.max(1, Math.floor(yt - yr - 8))); s.push(rect(px, py, px + 3, py + 2, i % 3 ? K.lawn2 : K.lime, i % 3 ? '' : 'fill-opacity="0.6"')); }
      s.push(rect(v.x0, yt, v.x1, yt + 1.5, LED[seed % LED.length]));
    } else if (k === 'stilts') {
      const xs = []; for (let x = v.x0; x <= v.x1 + 0.1; x += (v.x1 - v.x0) / 5) xs.push(x);
      for (let i = 1; i < xs.length; i++) s.push(line([[xs[i - 1], Y(v.y1, v.z0 + 14)], [xs[i], Y(v.y1, v.z1 - 4)]], K.conL, 1.5), line([[xs[i - 1], Y(v.y1, v.z1 - 4)], [xs[i], Y(v.y1, v.z0 + 14)]], K.conL, 1.5));
      for (const x of xs) s.push(rect(x - 2.5, yt, x + 2.5, yb, K.columnD));
    } else if (k === 'house') {
      s.push(rect(v.x0, yt, v.x1, yb, K.timber));
      for (let z = v.z0, f = 0; z < v.z1 - 1; z += S, f++) { const zt = Math.min(v.z1, z + S); s.push(rect(v.x0 - 3, Y(v.y1 + 3, z + 3), v.x1 + 3, Y(v.y1 + 3, z), K.conL)); s.push(rect(v.x0 + 4, Y(v.y1, zt - 6), v.x1 - 4, Y(v.y1, z + 8), K.glass)); for (let x = v.x0 + 6, c = 0; x < v.x1 - 10; x += 12, c++) { const q = hsh(seed + c, f) % 4; if (q < 2) s.push(rect(x, Y(v.y1, zt - 7), x + 8, Y(v.y1, z + 9), q ? K.white : K.cyan, 'fill-opacity="0.7"')); } for (let x = v.x0 + 2; x < v.x1; x += 6) s.push(rect(x, Y(v.y1 + 3, z + 14), x + 1, Y(v.y1 + 3, z + 3), K.conL, 'fill-opacity="0.8"')); }
      s.push(rect(v.x0, yr, v.x1, yt, K.ground2), rect(v.x0, yr, v.x1, yt, 'none', `stroke="${K.conL}" stroke-width="3"`), rect(v.x0 + 2, yt - 3, v.x1 - 2, yt - 1, K.cyan));
    }
    return s.join('');
  }
  // ---------- stairs and escalators: a sloped band from its head (zh) to its foot (Z0); a south-facing side shows its stringer
  function stair(head, foot, zh, esc) {
    const dx = foot[0] - head[0], dy = foot[1] - head[1], l = hyp(dx, dy), px = -dy / l, py = dx / l, w = SWD / 2, s = [];
    const A = [head[0] + px * w, head[1] + py * w], Bq = [head[0] - px * w, head[1] - py * w], Cq = [foot[0] - px * w, foot[1] - py * w], D = [foot[0] + px * w, foot[1] + py * w];
    for (const [sg, Hh, F] of [[1, A, D], [-1, Bq, Cq]]) if (py * sg > 0.3) s.push(poly([[Hh[0], Y(Hh[1], zh)], [F[0], Y(F[1], 0)], [Hh[0], Y(Hh[1], 0)]], K.conD) + line([[Hh[0], Y(Hh[1], zh)], [F[0], Y(F[1], 0)]], esc ? K.cyan : K.conL, 1.5));
    s.push(poly([[A[0], Y(A[1], zh)], [Bq[0], Y(Bq[1], zh)], [Cq[0], Y(Cq[1], 0)], [D[0], Y(D[1], 0)]], esc ? '#9AA6B2' : K.stoneD));
    for (let t = 4; t < l; t += esc ? 6 : 8) { const f = t / l, z = zh * (1 - f), m = [head[0] + dx * f, head[1] + dy * f]; s.push(line([[m[0] + px * w, Y(m[1] + py * w, z)], [m[0] - px * w, Y(m[1] - py * w, z)]], esc ? '#5E6B78' : K.conD, 1.2)); }
    if (esc) for (const [a, b] of [[A, D], [Bq, Cq]]) s.push(line([[a[0], Y(a[1], zh + 10)], [b[0], Y(b[1], 10)]], K.cyan, 2));
    return s.join('');
  }
  // ---------- slabs on columns at Z1: walkways and bridge decks. Columns first (most hide under the slab, as they should)
  function slab(pts, width, th, kind, plan) {
    const s = [], z = Z1H, hw = width / 2;
    if (plan) for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], l = hyp(bx - ax, by - ay), tx = (bx - ax) / l, ty = (by - ay) / l;
      for (let t = kind === 'deck' ? SPAN / 4 : 48; t < l; t += kind === 'deck' ? SPAN / 2 : 96) { const x = ax + tx * t, y = ay + ty * t, g = G.ground(x, y); if (g >= 1 || plan.roads.some((r) => G.distToPoly(G.openPts(r), x, y) < OUTER + COL) || plan.buildings.some((b) => G.inRect(b.rect, x, y, 8))) continue;
        const cw = kind === 'deck' ? COL : WCOL, gz = g < 0 ? RZ : 0; for (const sd of kind === 'deck' ? [-1, 1] : [0]) { const cx = x - ty * sd * (hw - 14), cy = y + tx * sd * (hw - 14); s.push(rect(cx - cw / 2, Y(cy, z - th), cx + cw / 2, Y(cy, gz), K.column) + rect(cx + cw / 2 - 5, Y(cy, z - th), cx + cw / 2, Y(cy, gz), K.columnD)); } } }
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], l = hyp(bx - ax, by - ay), nx = -(by - ay) / l, ny = (bx - ax) / l;
      const c = (x, y, sd, zz) => [x + nx * hw * sd, Y(y + ny * hw * sd, zz)];
      for (const sd of [1, -1]) if (ny * sd > 0.3) s.push(poly([c(ax, ay, sd, z), c(bx, by, sd, z), c(bx, by, sd, z - th), c(ax, ay, sd, z - th)], kind === 'deck' ? K.deck2 : K.conD)); // the south edge face
      const top = [c(ax, ay, 1, z), c(bx, by, 1, z), c(bx, by, -1, z), c(ax, ay, -1, z)];
      if (kind === 'deck') { const q = lift([[ax, ay], [bx, by]], z); s.push(poly(top, K.deck), line(q, K.road, 2 * LW - 2), line(q, K.lane, 3, 'stroke-dasharray="20 20" stroke-opacity="0.8"'));
        for (const sd of [1, -1]) { const e0 = c(ax, ay, sd, z), e1 = c(bx, by, sd, z), i0 = [ax + nx * (hw - PW) * sd, Y(ay + ny * (hw - PW) * sd, z)], i1 = [bx + nx * (hw - PW) * sd, Y(by + ny * (hw - PW) * sd, z)]; s.push(poly([e0, e1, i1, i0], K.conL), line([i0, i1], K.cyan, 2)); }
        for (const sd of [1, -1]) s.push(line([[ax + nx * LW * sd, Y(ay + ny * LW * sd, z)], [bx + nx * LW * sd, Y(by + ny * LW * sd, z)]], K.lane, 2, 'stroke-opacity="0.55"')); }
      else { s.push(poly(top, K.stoneD)); for (const sd of [1, -1]) s.push(line([c(ax, ay, sd, z), c(bx, by, sd, z)], K.stone, 4)); s.push(line(lift([[ax, ay], [bx, by]], z), K.mag, 2, 'stroke-dasharray="6 10"')); }
    }
    return s.join('');
  }
  // ---------- the tunnel portal (Edit 61): a concrete frame proud of the cove head wall, flush with the hilltop. Through the
  // opening the lane runs on at the same width, its centre line unbroken, into the dark. Lamps and an LED line on the lintel.
  function portal(mouth, id) {
    const [tx, ty] = mouth, pw = 16, dep = 8, x0 = tx - OUTER - pw, x1 = tx + OUTER + pw, yf = ty + dep, s = [], yo = Y(yf, HB);
    s.push(rect(tx - OUTER, yo, tx + OUTER, yf, K.shoulder), rect(tx - LW - 2, yo, tx + LW + 2, yf, K.lane, 'fill-opacity="0.55"'), rect(tx - LW + 1, yo, tx + LW - 1, yf, K.road));
    for (let y = yf - 20; y > yo - 20; y -= 40) s.push(rect(tx - 1.5, Math.max(yo, y), tx + 1.5, Math.min(yf, y + 20), K.lane, 'fill-opacity="0.8"'));
    s.push(rect(tx - OUTER, yo, tx + OUTER, yf, `url(#${id}-dark)`));
    s.push(rect(x0, Y(ty - 4, Z1H), x1, Y(yf, Z1H), K.conL), rect(x0, Y(yf, Z1H) - 1, x1, Y(yf, Z1H) + 1, K.stoneL)); // the coping, flush with the hilltop
    s.push(`<path d="M${n1(x0)} ${n1(Y(yf, Z1H))}H${n1(x1)}V${n1(yf)}H${n1(x0)}Z M${n1(tx - OUTER)} ${n1(yo)}H${n1(tx + OUTER)}V${n1(yf)}H${n1(tx - OUTER)}Z" fill="${K.conM}" fill-rule="evenodd"/>`); // front elevation with the opening
    for (let x = x0 + 4; x < x1; x += 8) if (x < tx - OUTER || x > tx + OUTER) s.push(rect(x, Y(yf, Z1H), x + 1, yf, K.conD)); else s.push(rect(x, Y(yf, Z1H), x + 1, yo, K.conD));
    s.push(rect(tx - OUTER, yo - 2, tx + OUTER, yo, K.cyan), rect(x0, yf - 2, x1, yf, K.conX)); // LED line on the lintel; the frame's foot
    for (const lx of [x0 + pw / 2, x1 - pw / 2]) s.push(`<circle cx="${n1(lx)}" cy="${n1(Y(yf, 70))}" r="9" fill="${K.cyan}" fill-opacity="0.25"/>` + rect(lx - 3, Y(yf, 74), lx + 3, Y(yf, 64), K.white));
    return s.join('');
  }
  function car(cx, yFront, len, wid, ht, clip, dark) { // a sedan heading north into the tunnel; its rear (south) face shows
    const x0 = cx - wid / 2, x1 = cx + wid / 2, yr = yFront + len, s = [];
    s.push(rect(x0, Y(yr, ht * 0.6), x1, yr, K.fleetSide2), rect(x0, Y(yFront, ht * 0.6), x1, Y(yr, ht * 0.6), K.fleetSide));
    s.push(rect(x0 + 3, Y(yr - 12, ht), x1 - 3, Y(yr - 12, ht * 0.6), K.glass), rect(x0 + 3, Y(yFront + 14, ht), x1 - 3, Y(yr - 12, ht), K.fleetRoof), rect(x0 + 4, Y(yFront + 14, ht), x1 - 4, Y(yFront + 8, ht * 0.6), K.glass));
    if (dark) s.push(rect(x0, dark[0], x1, dark[1], `url(#${dark[2]})`)); // inside the mouth it is in the dark too
    return `<g clip-path="url(#${clip})">${s.join('')}</g>`;
  }

  // ---------- the whole district, in painter's order
  function svgGameView(plan, res, id) {
    id = id || 'gv'; const s = [], sh = G.shadows(plan, res), objs = [], O = (key, z, svg) => objs.push({ key, z, svg });
    s.push(`<svg viewBox="0 0 ${DW} ${DH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Circus valley in the game's projection"><defs>`);
    s.push(`<clipPath id="${id}-clip"><rect x="0" y="0" width="${DW}" height="${DH}"/></clipPath>`);
    s.push(`<clipPath id="${id}-c-hill"><path d="${dd(G.NORTH_POLY)}Z"/></clipPath><clipPath id="${id}-c-land"><path d="${dd(G.LAND_POLY)}Z"/></clipPath><clipPath id="${id}-c-river"><path d="${dd(G.RIVER_POLY)}Z"/></clipPath>`);
    s.push(` <clipPath id="${id}-c-car"><rect x="0" y="${n1(Y(plan.mouth[1] + 8, HB))}" width="${DW}" height="${DH}"/></clipPath>`);
    s.push(`<pattern id="${id}-pv" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="${K.ground}"/><path d="M0 0H32M0 0V32" stroke="${K.ground2}" stroke-width="1.5"/></pattern>`);
    s.push(`<pattern id="${id}-ph" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="${K.hill}"/><path d="M0 0H32M0 0V32" stroke="${K.hill2}" stroke-width="1.5"/></pattern>`);
    s.push(`<pattern id="${id}-ps" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="${K.sand}"/><rect x="3" y="5" width="2" height="2" fill="${K.sand2}"/><rect x="15" y="17" width="2" height="2" fill="${K.sand3}"/><rect x="18" y="4" width="2" height="1" fill="${K.sand2}"/></pattern>`);
    s.push(`<pattern id="${id}-pw" width="96" height="40" patternUnits="userSpaceOnUse"><rect width="96" height="40" fill="${K.water}"/><path d="M6 12h22M52 30h30M40 4h10" stroke="${K.water2}" stroke-width="3"/><path d="M70 14h6" stroke="${K.cyan}" stroke-opacity="0.4" stroke-width="2"/></pattern>`);
    s.push(`<linearGradient id="${id}-dark" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#05080C" stop-opacity="0.35"/><stop offset="1" stop-color="#05080C" stop-opacity="0.97"/></linearGradient>`);
    s.push(`</defs><g clip-path="url(#${id}-clip)" id="${id}-world">`);
    // 1. the river (below Z0), the seawall's front, the land at Z0 with the beach and the Z0 roads
    s.push(poly(lift(G.RIVER_POLY, RZ), `url(#${id}-pw)`));
    s.push(`<g clip-path="url(#${id}-c-river)" transform="translate(0 ${n1(-EX * RZ)})" opacity="0.4">` + sh.river.map((q) => (q.line ? line(q.line, '#000', q.width) : poly(q, '#000'))).join('') + '</g>');
    s.push(poly(G.SHORE.map(([x, y]) => [x, y]).concat(G.SHORE.slice().reverse().map(([x, y]) => [x, Y(y, RZ)])), K.conD));
    for (let i = 0; i < G.SHORE.length; i += 3) s.push(line([[G.SHORE[i][0], G.SHORE[i][1]], [G.SHORE[i][0], Y(G.SHORE[i][1], RZ)]], K.conX, 1));
    s.push(line(G.SHORE, K.conL, 3));
    s.push(poly(G.LAND_POLY, `url(#${id}-pv)`));
    s.push(poly([[-200, G.BEACH], [2600, G.BEACH]].concat(G.SHORE.slice().reverse()), `url(#${id}-ps)`));
    for (const r of plan.roads.filter((q) => q.z === 0)) s.push(road(G.openPts(r), 0));
    s.push(`<circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS}" fill="none" stroke="${K.shoulder}" stroke-width="${2 * OUTER}"/><circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS}" fill="none" stroke="${K.lane}" stroke-opacity="0.55" stroke-width="${2 * LW + 4}"/><circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS}" fill="none" stroke="${K.road}" stroke-width="${2 * LW - 2}"/><circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS - LW - 2}" fill="${K.conT}" stroke="${K.conL}" stroke-width="3"/><circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS - LW - 22}" fill="${K.lawn}"/>`);
    s.push(`<g clip-path="url(#${id}-c-land)" opacity="0.4">` + sh.land.map((q) => (q.line ? line(q.line, '#000', q.width) : poly(q, '#000'))).join('') + '</g>');
    // 2. the hill: its top at Z1 with its streets and shadows, then its south faces (cliffs) down to Z0
    s.push(poly(lift(G.NORTH_POLY, Z1H), `url(#${id}-ph)`));
    for (const r of plan.roads.filter((q) => q.z === 1)) { const on = G.dense(r.pts, 8).filter(([x, y]) => G.ground(x, y) >= 1); if (on.length > 1) s.push(road([on[0], on[on.length - 1]], Z1H, true)); }
    s.push(`<g clip-path="url(#${id}-c-hill)" transform="translate(0 ${n1(-EX * Z1H)})" opacity="0.4">` + sh.hill.map((q) => (q.line ? line(q.line, '#000', q.width) : poly(q, '#000'))).join('') + '</g>');
    for (let i = 1; i < G.NORTH.length; i++) { const [ax, ay] = G.NORTH[i - 1], [bx, by] = G.NORTH[i]; if (ax === bx) continue;
      s.push(poly([[ax, ay], [bx, by], [bx, Y(by, Z1H)], [ax, Y(ay, Z1H)]], K.conD));
      for (let x = Math.ceil(Math.min(ax, bx) / 12) * 12; x <= Math.max(ax, bx); x += 12) { const y = ay + (by - ay) * (x - ax) / (bx - ax); s.push(line([[x, y], [x, Y(y, Z1H)]], K.conX, x % 48 === 0 ? 1.5 : 0.8)); }
      for (const zz of [40, 80]) s.push(line([[ax, Y(ay, zz)], [bx, Y(by, zz)]], K.conX, 1));
      s.push(line([[ax, Y(ay, Z1H)], [bx, Y(by, Z1H)]], K.conL, 4), line([[ax, ay], [bx, by]], K.conX, 2)); }
    for (let i = 1; i < G.NORTH.length; i++) { const [ax, ay] = G.NORTH[i - 1], [bx, by] = G.NORTH[i]; if (ax === bx) s.push(line([[ax, Y(ay, Z1H)], [bx, Y(by, Z1H)]], K.conL, 4)); }
    // 3. everything that stands up, north to south
    plan.buildings.forEach((b, i) => O(b.rect[1] + b.rect[3], b.base * Z1H, G.volumes(b).map((v) => vol(v, i * 13 + 5)).join('') + (b.type === 'portal' ? rect(b.gap[0], Y(b.rect[1] + b.rect[3], Z1H + S), b.gap[1], Y(b.rect[1] + b.rect[3], Z1H), K.dark, 'fill-opacity="0.55"') : '')));
    plan.props.forEach((q, i) => O(G.propRect(q)[1] + G.propRect(q)[3], 0, G.propVolumes(q).map((v) => vol(v, i * 7 + 2)).join('')));
    for (const b of plan.buildings.filter((q) => q.stair)) O(Math.max(b.stair.head[1], b.stair.foot[1]) + SWD / 2, 0, stair(b.stair.head, b.stair.foot, b.top));
    for (const st of plan.coveStairs) O(st.head[1] + SWD / 2, 0, stair(st.head, st.foot, Z1H));
    for (const e of res.esc) O(Math.max(e.head[1], e.foot[1]) + SWD / 2, 0, stair(e.head, e.foot, Z1H, true));
    for (const w of plan.walkways) O(Math.max(...w.pts.map((p) => p[1])) + (w.pts[0][1] === w.pts[1][1] ? WALK / 2 : 0), Z1H, slab(w.pts, WALK, 8, 'walk', plan));
    for (const b of res.bridges) for (const run of b.runs) O(run[run.length - 1][1], Z1H, slab([run[0], run[run.length - 1]], 2 * HALF, 16, 'deck', plan));
    O(plan.mouth[1] + 8, 0, portal(plan.mouth, id));
    { const yf = plan.mouth[1] + 8, yFront = plan.mouth[1] - 30; O(yFront + P['vehicles.sedan.length'], 0, car(plan.mouth[0] + LW / 2, yFront, P['vehicles.sedan.length'], P['vehicles.sedan.width'], P['vehicles.sedan.height'], id + '-c-car', [Y(yf, HB), yf - 4, id + '-dark'])); }
    { const [cx, cy] = plan.ring; O(cy + 30, 0, vol({ x0: cx - 50, y0: cy - 22, x1: cx + 50, y1: cy + 30, z0: 0, z1: 10, kind: 'plinth' }, 4) + vol({ x0: cx - 34, y0: cy - 2, x1: cx + 34, y1: cy + 10, z0: 10, z1: 110, kind: 'obelisk' }, 9)); }
    objs.sort((a, b) => a.key - b.key || a.z - b.z);
    for (const o of objs) s.push(o.svg);
    s.push('</g>');
    for (let i = 1; i < 3; i++) s.push(`<line x1="${i * W}" y1="0" x2="${i * W}" y2="${DH}" stroke="${K.white}" stroke-opacity="0.18" stroke-width="2"/><line x1="0" y1="${i * H}" x2="${DW}" y2="${i * H}" stroke="${K.white}" stroke-opacity="0.18" stroke-width="2"/>`);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s.push(`<text x="${c * W + 12}" y="${r * H + 30}" font-size="22" font-weight="700" fill="${K.white}" fill-opacity="0.75" stroke="#05080C" stroke-width="4" paint-order="stroke" font-family="system-ui">${'ABC'[c]}${r + 1}</text>`);
    s.push('</svg>');
    return s.join('');
  }
  // a crop of the world drawn by svgGameView (same document): reuse its group by reference
  const svgCrop = (id, box, label) => `<svg viewBox="${box.join(' ')}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="${label}"><use href="#${id}-world" xlink:href="#${id}-world"/></svg>`;

  const api = { svgGameView, svgCrop, K, Y };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CIRCUS_VALLEY_VIEW = api;
})(typeof window !== 'undefined' ? window : globalThis);
