// P5 evidence (GDD Edit 50): bus roads, highway traffic and highway points on the baked layouts, the dummy away.
// node tools/p5_report.js [seconds] → docs/p5_report.json and .md. Automated evidence, not human playtest.
const fs = require('fs'), path = require('path');
const D = require(path.join(__dirname, '..', 'sim.js'));
const SECS = +process.argv[2] || 120;
const rows = [], screens = [];
// a screen made active with its own traffic, the dummy away (as test_sim's onScreen)
function onCell(id, k, cell, over) {
  const s = new D.Sim(id, Object.assign({ 'proto.layout': k }, over || {})), Dd = s.district, lv = D.cellLevel(Dd, cell, s.P);
  s.checkTerminal = () => {}; Dd.cur = cell.slice(); s.level = lv; s.cones = s.conesFor(lv); s.cars = []; s.fillDeckCars();
  Object.assign(s.body, { x: -900, y: -900, alive: false });
  return s;
}
for (const id of D.DISTRICT_LIST) for (const k of [1, 2, 3]) {
  const s0 = new D.Sim(id, { 'proto.layout': k });
  for (const q of s0.district.cells.flat()) {
    s0.level = D.cellLevel(s0.district, q.cell, s0.P);
    screens.push({ id, k, cell: D.cellName(q.cell), bus: s0.busRoad(), bend: +Math.min(9999, D.minBend(s0.level.center, 800, 640)).toFixed(0), decks: (s0.level.decks || []).length, turns: q.turns || null });
  }
}
// traffic on the deck screens of layout 1: P5 against P4's highway settings
const deckCells = [];
for (const id of D.DISTRICT_LIST) { const s0 = new D.Sim(id, { 'proto.layout': 1 }); for (const q of s0.district.cells.flat()) if ((D.cellLevel(s0.district, q.cell, s0.P).decks || []).length) deckCells.push([id, q.cell]); }
for (const [label, over] of [['P5', {}], ['P4 highway settings (scales 1)', { 'traffic.deckSpeedScale': 1, 'traffic.deckGapScale': 1 }]]) {
  let n = 0, onScreen = 0, vSum = 0, vN = 0, cls = {}, groundBus = 0, ground = 0;
  for (const [id, cell] of deckCells) {
    const s = onCell(id, 1, cell, over), seen = new Set();
    for (let i = 0; i < SECS * 60; i++) {
      s.step({});
      let on = 0;
      for (const c of s.cars) {
        if (c.deck) { on++; if (!seen.has(c.id)) { seen.add(c.id); cls[c.cls] = (cls[c.cls] || 0) + 1; } if (i % 30 === 0) { vSum += c.v; vN++; } }
        else if (!seen.has(c.id)) { seen.add(c.id); ground++; if (c.cls === 'bus') groundBus++; }
      }
      if (i % 30 === 0) { onScreen += on / (s.level.deckLanes.length || 1); n++; }
    }
  }
  rows.push({ label, deckScreens: deckCells.length, carsPerLaneOnScreen: +(onScreen / n).toFixed(2), meanDeckSpeed: +(vSum / vN).toFixed(0), deckClasses: cls, groundCars: ground, groundBuses: groundBus });
}
// points for one hit: a sedan at the same closing, ground against deck
const P = Object.assign({}, D.REG, D.PROTO, D.OVERRIDES);
const out = { seconds: SECS, screens, busScreens: screens.filter((x) => x.bus).length, total: screens.length, traffic: rows, deckMultiplier: P['damage.deckMultiplier'], deckSpeedScale: P['traffic.deckSpeedScale'], deckGapScale: P['traffic.deckGapScale'] };
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'p5_report.json'), JSON.stringify(out, null, 1));
const md = ['# P5 report (Edit 50)', '', `Baked layouts: ${out.total} screens. A bus may run the ground road on ${out.busScreens} (every bend ≥ vehicles.bus.minRadius ${P['vehicles.bus.minRadius']}, measured with 10% tolerance; no ring).`, '',
  '| District | Layout | Screens a bus may run | Screens with highways |', '|---|---:|---:|---:|'];
for (const id of D.DISTRICT_LIST) for (const k of [1, 2, 3]) { const x = screens.filter((q) => q.id === id && q.k === k); md.push(`| ${id} | ${k} | ${x.filter((q) => q.bus).length} of ${x.length} | ${x.filter((q) => q.decks).length} |`); }
md.push('', `Highway traffic on the ${deckCells.length} highway screens of layout 1, ${SECS} s each, the dummy away:`, '', '| Settings | Deck cars per lane on screen | Mean deck speed | Deck classes | Ground cars | Ground buses |', '|---|---:|---:|---|---:|---:|');
for (const r of rows) md.push(`| ${r.label} | ${r.carsPerLaneOnScreen} | ${r.meanDeckSpeed} | ${Object.entries(r.deckClasses).map(([a, b]) => a + ' ' + b).join(', ')} | ${r.groundCars} | ${r.groundBuses} |`);
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'p5_report.md'), md.join('\n') + '\n');
console.log('bus screens', out.busScreens, 'of', out.total); for (const r of rows) console.log(JSON.stringify(r));
