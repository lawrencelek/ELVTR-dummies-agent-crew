// P6 (Edit 62): each district's nine screens in game art with live traffic, as raw RGBA for tools/p6_shots.py.
// Run from prototypes/p6: node tools/p6_shots.js <outdir>
'use strict';
const fs = require('fs'), path = require('path');
const W6 = require('../world6.js'), PIX = globalThis.PIX, AW = PIX.AW, AH = PIX.AH;
const out = process.argv[2] || 'docs';
fs.mkdirSync(out, { recursive: true });
for (const id of W6.LEVEL_LIST) {
  const w = W6.buildWorld(id);
  for (let k = 0; k < 60 * 8; k++) W6.stepWorld(w, null, null);
  const FB = new PIX.Buf(AW, AH), DL = new PIX.Buf(AW, AH), grid = Buffer.alloc(3 * AW * 3 * AH * 4);
  for (const sc of w.scs) {
    const cars = W6.viewCars(w, sc);
    W6.compose(sc, FB, DL, { cars, layerOf: (c) => W6.layerOf(sc, c) });
    for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) {
      const c = FB.d[y * AW + x], o = (((sc.row * AH + y) * 3 * AW) + sc.col * AW + x) * 4;
      grid[o] = c & 255; grid[o + 1] = (c >>> 8) & 255; grid[o + 2] = (c >>> 16) & 255; grid[o + 3] = 255;
    }
  }
  fs.writeFileSync(path.join(out, id + '.rgba'), grid);
  console.log(id, 3 * AW, 3 * AH);
}
