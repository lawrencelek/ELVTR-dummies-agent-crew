// Highway width mock-up (P5, GDD Edit 50.2). The game's own deck, lamp, column and ground art at three deck widths over the
// same ground road, with live P5 traffic. 176: P5.1. 160: P5.2, as wide as the ground road and its pavements. 128: no
// pavement on the highway (lanes and parapets only). A dummy on each for scale.
(function () {
  'use strict';
  const X = window.DUMMIES, PIX = window.PIX, P0 = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), U = PIX.U, AW = PIX.AW, AH = PIX.AH, Z = 2;
  const W = P0['world.width'], H = P0['world.height'], LW = P0['world.laneWidth'], SH = P0['proto.shoulderWidth'], OUTER = LW + SH, PW = P0['world.parapetWidth'];
  const EXT = (h) => Math.round(h * P0['proto.art.extrusion'] / U);
  const $ = (id) => document.getElementById(id);
  const VARIANTS = [
    { w: 176, title: 'P5.1: 176, wider than the road below', verdict: 'bad', note: 'Lanes 112, hard shoulders 24, parapets 8. The ground road with its pavements is 160.' },
    { w: 160, title: 'P5.2: 160, as wide as the road and its pavements', verdict: 'good', note: 'Lanes 112, a 16 walkway each side, parapets 8. Matches the ground road (lanes 112 + pavements 24).' },
    { w: 128, title: 'No walkway: 128, lanes and parapets only', verdict: 'warn', note: 'The dummy on a highway always stands in a lane. Stairs land straight onto the lane.' },
  ];
  const panels = VARIANTS.map((v, i) => {
    const P = Object.assign({}, P0, { 'world.deckWidth': v.w }), half = v.w / 2, C = P['world.deckColumn'];
    const center = [[400, -200], [400, H + 200]], lanes = X.lanesOf(center, P);
    const dk = { hz: true, off: 352, z: 1, height: P['world.deckHeight'], gaps: [], openings: [] };
    const s = new X.Sim('straight', { 'world.deckWidth': v.w, 'run.appearances.road': 2000 });
    s.level = Object.assign({}, s.level, { center, ring: null, lanes, statics: [], coneHomes: [], spawns: [{ x: -900, y: -900, f: 0 }], patches: [], floors: [], stairs: [], checkpoints: [], theme: 'plain', decks: [dk], deckLanes: X.deckLanesOf([dk], P) });
    s.cones = []; s.cars = []; s.drones = []; s.checkTerminal = () => {}; s.checkFlip = () => {};
    s.schedule = s.schedule.map((sl, j) => Object.assign({}, sl, { cls: X.fleetClass(P, 0.3, (j * 0.6180339887 + 0.53) % 1) }));
    Object.assign(s.body, { x: -900, y: -900 }); s.fillDeckCars();
    for (let k = 0; k < 15 * 60; k++) { s.step({}); s.body.x = -900; s.body.y = -900; }
    const B = PIX.ground({ center, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: [dk], floors: [], canal: false, solid: [] }, P, 11);
    const { S, ext } = PIX.deck(dk, P), cols = [];
    for (let p = P['world.deckPillarSpacing'] / 2; p < W; p += P['world.deckPillarSpacing']) for (const e of [dk.off - half + 4, dk.off + half - 4 - C]) {
      if (Math.abs(p - 400) < OUTER + C + 4) continue;
      cols.push({ x: p - C / 2, y: e, spr: PIX.column(Math.round(C / U), Math.round(C / U), ext) });
    }
    const cv = document.createElement('canvas'); cv.width = AW * Z; cv.height = AH * Z;
    const wrap = document.createElement('div'), cap = document.createElement('div'); wrap.append(cv, cap); $('panels').appendChild(wrap);
    const tag = { good: '<span class="good">P5.2</span>', warn: '<span class="warn">Option</span>', bad: '<span class="bad">Was</span>' }[v.verdict];
    cap.innerHTML = `<h3>${v.title}</h3><p class="cap">${tag} · ${v.note}</p><p class="cap" id="st${i}"></p>`;
    const dumX = 250, dumY = v.w > 128 ? dk.off - half + PW + (half - LW - PW) / 2 + 4 : dk.off - LW + 10; // on the walkway, or the lane edge
    return { v, P, s, B, S, ext, dk, half, cols, cv, dumX, dumY, FB: new PIX.Buf(AW, AH), DL: new PIX.Buf(AW, AH), off: Object.assign(document.createElement('canvas'), { width: AW, height: AH }) };
  });
  const car = (p, c) => PIX.car(c.cls, Math.round(c.L / U), Math.round(c.W / U), EXT(p.P['vehicles.' + c.cls + '.height']), c.h, false);
  function draw(p, i) {
    const { FB, DL, s, dk, half, ext } = p;
    FB.d.set(p.B.d);
    for (const c of s.cars.filter((c) => !c.deck).sort((a, b) => a.y - b.y)) PIX.blit(FB, car(p, c), c.x / U, c.y / U);
    PIX.blit(FB, PIX.dummy(Math.PI / 2, 0), (400 + OUTER - 10) / U, 560 / U); // a dummy on the ground pavement
    for (const c of p.cols) PIX.blit(FB, c.spr, Math.round(c.x / U), Math.round(c.y / U));
    DL.d.fill(0); PIX.blit(DL, p.S, 0, Math.round((dk.off - half) / U));
    for (const c of s.cars.filter((c) => c.deck).sort((a, b) => a.y - b.y)) PIX.blit(DL, car(p, c), c.x / U, c.y / U);
    PIX.blit(DL, PIX.dummy(Math.PI / 2, 0), p.dumX / U, p.dumY / U);
    for (let y = 0; y < AH; y++) { const ty = y - ext; if (ty < 0) continue; for (let x = 0; x < AW; x++) { const c = DL.d[y * AW + x]; if (c) FB.d[ty * AW + x] = c; } }
    const og = p.off.getContext('2d'), img = og.createImageData(AW, AH); new Uint32Array(img.data.buffer).set(FB.d); og.putImageData(img, 0, 0);
    const g = p.cv.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(p.off, 0, 0, AW * Z, AH * Z);
    g.strokeStyle = 'rgba(73,211,255,0.10)'; g.lineWidth = 1;
    for (let x = 0; x <= AW; x += 16) { g.beginPath(); g.moveTo(x * Z + 0.5, 0); g.lineTo(x * Z + 0.5, AH * Z); g.stroke(); }
    for (let y = 0; y <= AH; y += 16) { g.beginPath(); g.moveTo(0, y * Z + 0.5); g.lineTo(AW * Z, y * Z + 0.5); g.stroke(); }
    // width rulers: the ground road with its pavements, and the deck
    g.fillStyle = 'rgba(255,255,255,0.85)'; g.font = '13px system-ui';
    const rx = (400 - OUTER) / U * Z, rw = 2 * OUTER / U * Z; g.fillRect(rx, AH * Z - 10, rw, 2); g.fillText(2 * OUTER + ' road + pavements', rx + rw + 6, AH * Z - 6);
    const ry = (dk.off - half) / U * Z - ext * Z, rh = p.v.w / U * Z; g.fillRect(10, ry, 2, rh); g.fillText(p.v.w + ' highway', 16, ry + 14);
    const deck = s.cars.filter((c) => c.deck);
    $('st' + i).textContent = `Live: highway cars ${deck.length} · lamps every ${p.P['world.deckLampSpacing']} (${(W / p.P['world.deckLampSpacing']).toFixed(1)} a side per screen) · round columns every ${p.P['world.deckPillarSpacing']}`;
  }
  let last = performance.now(), playing = true;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (playing) for (const p of panels) for (let k = 0; k < Math.round(dt * 60); k++) { p.s.step({}); p.s.body.x = -900; p.s.body.y = -900; }
    panels.forEach(draw); requestAnimationFrame(frame);
  }
  $('play').onclick = () => { playing = !playing; $('play').textContent = playing ? 'Pause' : 'Play'; };
  requestAnimationFrame(frame);
})();
