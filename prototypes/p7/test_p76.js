// Prototype 7.6 (GDD Edits 81–87) checks. Run from prototypes/p7: node test_p76.js [screenshot folder]
// Edit 87: one top edge. BODY, the field and a POINTS/CREDITS box (BODY's size) start on the field's bezel; the chassis under it; the
// objective on the top strip; the map titled [MAP] · [TILE]; the touch chips small, top left. Touch: Pause › Controls › Adjust
// layout moves and sizes the stick and the Y X B A diamond anywhere (ui.touch.scaleMin–scaleMax), saved in this browser.
// Edit 86: a clean screen. No row under the stage: options (sound, palette, full screen, tuning, pad setup) and the controls of
// the device in hand live in the pause menu; BODY as tall as DASH, the map raised; no FARSIGHT wordmark in play.
// Edit 85: Story's traffic per tile (story.traffic.<district>.<tile> on the tile in test and its neighbours; Arcade per district);
// every highway a flight (world.deckFlightsMin) and a parapet gap that drops onto a Z0 road (world.deckDropGaps); cones never on
// a road and never out of view (props.cone.minVisible). 6.x worlds unchanged.
// Edit 84 (option B): verbs are issued, levels are bought. Monument issues Legs 1 at C1, Hands 1 at A2, Arms 1 at C3 (a verb every
// three tiles); the drone that carries the dummy in brings it, in view, and the gift screen shows it landing on the chassis. Arcade
// issues the same verbs, one per arcade.giftEvery write-offs. Verbs are not sold.
// Edit 83: defaults (two dashes, standard recharge and recoil, no ability); the story's tracks fill only at Waterfront's end (35 bodies,
// gifts only Legs 1, Hands 1, Arms 1); the ricochet capped (proto.recoilScale 0.7, proto.bounce.maxThrow 40); the drone ferry to the next
// tile, off the road near the crossing; fences only toward tiles not yet open; the objective on the bottom line; bubbles on the cars.
// 1. Content: the orders; neighbours; tales, tasks, gifts; registry IDs; abilities gifted in time; every brief possible where set.
// 2. Headless: defaults; the ricochet; the fence; a real write-off; clears; the ferry; cleared tiles open; gifts; prices; the fill;
//    the next district; the certificate. Arcade: one district a run. 6.4–6.10 and 7–7.5 frozen.
// 3. Browser (Playwright, dummies_p7_6.html): title; Arcade and its first verb; the story map; the card; a fence; a report, the
//    shop, the ferry; the gift: the drone with the module, the gift screen, the hold; the objective line; progress saved; a phone.
'use strict';
const fs = require('fs'), path = require('path');
const STORY = require('./story.js');
const W6 = require('../p6/world6.js');
const X = require('../p6/sim.js');
const OUT = process.argv[2] || null;
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else fail++; console.log((c ? 'PASS ' : 'FAIL ') + msg); };
const REG = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES, W6.P6SIM, STORY.P7SIM);
const ev = (s, t) => s.events.filter((e) => e.type === t);
const adj = (a, b) => { const [c1, r1] = STORY.cellOf(a), [c2, r2] = STORY.cellOf(b); return Math.abs(c1 - c2) + Math.abs(r1 - r2) === 1; };

// ---------- 1. content
const D = STORY.DIST;
{
  const want = { monument: 'A1 B1 C1 C2 B2 A2 A3 B3 C3', parkland: 'C1 C2 C3 B3 A3 A2 A1 B1 B2', waterfront: 'A1 B1 C1 C2 C3 B3 A3 A2 B2' };
  ok(D.map((d) => d.id).join() === 'monument,parkland,waterfront' && D.every((d) => d.order.join(' ') === want[d.id]) && STORY.TOTAL === 27,
    'the story runs Monument (' + want.monument + '), Parkland (' + want.parkland + '), Waterfront (' + want.waterfront + '): 27 tiles, as decided');
  ok(D.every((d) => d.order.every((t, i) => i === 0 || adj(d.order[i - 1], t)) && new Set(d.order).size === 9),
    'each district visits its nine tiles once, each step to a neighbour (no jump across the map)');
  const kinds = new Set(Object.keys(STORY.DATA.tasks)), nodes = X.NODES10;
  const bad = []; for (const d of D) for (const t of d.order) { const q = d.tiles[t]; if (!q || !q.title || !q.tale || q.tale.split(' ').length < 12 || !q.task || !kinds.has(q.task.kind)) bad.push(d.id + ' ' + t); if (q && q.task.param && REG[q.task.param] == null) bad.push(t + ' ' + q.task.param); if (q && q.gift && q.gift.node && !nodes[q.gift.node]) bad.push(t + ' ' + q.gift.node); if (q && q.gift && q.gift.credits && REG[q.gift.credits] == null) bad.push(t + ' ' + q.gift.credits); if (REG['story.writeOffs.' + d.id + '.' + t] == null) bad.push(t + ' writeOffs'); }
  const words = D.reduce((a, d) => a + d.order.reduce((b, t) => b + d.tiles[t].tale.split(' ').length, 0), 0);
  ok(!bad.length, 'every tile has a title, a tale (' + words + ' words in all), a task Farsight knows and, where set, a gift; every number a registry ID (story.task.comboEasy, story.task.comboHard, story.writeOffs.<district>.<tile>)' + (bad.length ? ': ' + bad.join(', ') : ''));
  const ids = ['economy.creditsPerWriteOff', 'story.price.ability.level1', 'story.price.ability.level2', 'story.price.ability.level3', 'story.task.comboEasy', 'story.task.comboHard', 'story.shiftCars', 'proto.recoilScale', 'proto.bounce.maxThrow', 'story.ferryDepth', 'arcade.giftEvery', 'ui.gift.fallSeconds', 'ui.gift.holdSeconds', 'world.deckDropGaps', 'world.deckFlightsMin', 'props.cone.minVisible', 'ui.touch.scaleMin', 'ui.touch.scaleMax', 'ui.touch.scaleStep'];
  const regFile = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'content', 'params', 'tuning.parameters.json'), 'utf8')), inFile = new Set(regFile.entries.map((e) => e.id));
  const tiles = D.flatMap((d) => d.order.map((t) => 'story.writeOffs.' + d.id + '.' + t)), trafficIds = D.flatMap((d) => d.order.map((t) => 'story.traffic.' + d.id + '.' + t)), retired = ['story.tileWriteOffs', 'story.clearPowerUps', 'story.pointsPerPowerUp', 'story.giftPowerUps', 'story.giftCredits'];
  const byId = new Map(regFile.entries.map((e) => [e.id, e]));
  ok(ids.concat(tiles, trafficIds).every((k) => REG[k] != null && inFile.has(k)) && retired.every((k) => /^retired \(Edit 8[23]\)/.test(byId.get(k).status)) && byId.get('proto.recoilScale').default === REG['proto.recoilScale'] && byId.get('proto.bounce.maxThrow').default === REG['proto.bounce.maxThrow'] && regFile.registryVersion.startsWith('edit87'),
    'the story\'s values are registry IDs (' + ids.map((k) => k + ' ' + REG[k]).join(', ') + '); 27 tile counts; 27 tile traffic scales; ' + retired.length + ' P7 IDs retired; registry ' + regFile.registryVersion);
  const per = D.map((d) => d.name + ' ' + d.order.map((t) => REG['story.writeOffs.' + d.id + '.' + t]).join('')), sum = tiles.reduce((a, k) => a + REG[k], 0);
  ok(tiles.every((k) => REG[k] >= 1 && REG[k] <= 2) && sum === 35, 'write-offs per tile, retuned so the tracks fill at the end: ' + per.join(' · ') + ' (in story order); ' + sum + ' bodies (7.1: 62)');
  // the fill: one credit a body, every body counted, the cheapest level bought as soon as it is affordable
  const gifted = new Set(); for (const d of D) for (const t of d.order) { const g = d.tiles[t].gift; if (g && g.node) gifted.add(g.node); }
  const N = X.NODES10, levels = Object.keys(N).filter((n) => !gifted.has(n)).map((n) => ({ n, track: N[n].track, level: N[n].level, price: REG['story.price.ability.level' + N[n].level] }));
  const owned = new Set(gifted); let credits = 0, body = 0, fillAt = null, spent = 0; const total = levels.reduce((a, q) => a + q.price, 0);
  const where = [];
  for (const d of D) for (const t of d.order) for (let k = 0; k < REG['story.writeOffs.' + d.id + '.' + t]; k++) {
    body++; credits += REG['economy.creditsPerWriteOff']; const last = d.id === 'waterfront' && t === 'B2' && k === REG['story.writeOffs.waterfront.B2'] - 1;
    if (last) break; // the last body certifies the city: no shop after it
    for (;;) { const can = levels.filter((q) => !owned.has(q.n) && (q.level === 1 || owned.has(q.track + (q.level - 1)))).sort((a, b) => a.price - b.price)[0]; if (!can || credits < can.price) break; credits -= can.price; spent += can.price; owned.add(can.n); where.push(d.name + ' ' + t); }
    if (spent === total && !fillAt) fillAt = d.name + ' ' + t + ' (body ' + body + ' of ' + 35 + ')';
  }
  ok(gifted.size === 3 && [...gifted].sort().join() === 'arms1,hands1,legs1' && total === 34 && fillAt === 'Waterfront B2 (body 34 of 35)',
    'the upgrade tracks fill only at the end: gifts are just the verbs the briefs need (Legs 1, Hands 1, Arms 1); the rest costs ' + total + ' credits at 3, 4, 5; bought as soon as affordable, the last level lands at ' + fillAt + '. Monument ends with ' + where.filter((w) => /^Monument/.test(w)).length + ' levels bought, Parkland with ' + where.filter((w) => /^(Monument|Parkland)/.test(w)).length);
  // abilities a task needs, gifted at or before its tile (never left to the shop)
  const NEED = { jump: 'legs1', push: 'arms1', cone: 'hands1' }, got = new Set(), late = [];
  for (const d of D) for (const t of d.order) { const q = d.tiles[t]; if (q.gift && q.gift.node) got.add(q.gift.node); const n = NEED[q.task.kind]; if (n && !got.has(n)) late.push(d.id + ' ' + t); }
  ok(!late.length, 'every task\'s ability is gifted by its tile: Legs 1 at Monument C1 (jump), Hands 1 at A2 (cone), Arms 1 at C3 (push); no other gift' + (late.length ? ': late at ' + late.join(', ') : ''));
  // Edit 84: a verb every three tiles, Monument only; the briefs reordered so each verb is used where it arrives
  const at = []; for (const d of D) for (const t of d.order) { const g = d.tiles[t].gift; if (g && g.node) at.push(g.node + '@' + d.id + ' ' + t + ' #' + STORY.tileNumber(d.id, t)); }
  const mon = D[0].order.map((t) => t + ' ' + D[0].tiles[t].task.kind).join(', ');
  ok(at.join() === 'legs1@monument C1 #3,hands1@monument A2 #6,arms1@monument C3 #9' && STORY.VERBS.join() === 'legs1,hands1,arms1' && mon === 'A1 any, B1 drop, C1 jump, C2 level, B2 struck, A2 cone, A3 combo, B3 jump, C3 push',
    'option B: Farsight issues a verb every three tiles: ' + at.join(', ') + '. Monument\'s briefs follow: ' + mon);
}
// what each tile offers: traffic by class and level over 90 s, floors, cones
const SURVEY = {};
for (const d of D) {
  const s = new W6.Sim6(d.id, { 'run.appearances.road': 4000 }, null, {}), Wd = s.W6, seen = {};
  s.body.alive = false; s.body.x = -1e5;
  for (let i = 0; i < 60 * 90; i++) {
    W6.stepWorld(Wd, s.body, s.sc); if (i % 30) continue;
    for (const sm of Wd.sims) for (const c of sm.cars) { if (c.ghost || !sm.sc) continue; const k = STORY.nameOf(sm.sc.col, sm.sc.row); (seen[k] = seen[k] || new Set()).add(c.cls + '@' + (c.elev || 0)); }
  }
  for (const sc of Wd.scs) { const k = STORY.nameOf(sc.col, sc.row); SURVEY[d.id + ':' + k] = { cars: seen[k] || new Set(), floors: sc.game.floors.map((f) => f.kind + (f.z || 0)), cones: sc.game.coneHomes.length }; }
}
{
  const why = [];
  for (const d of D) for (const t of d.order) {
    const q = d.tiles[t].task, sv = SURVEY[d.id + ':' + t], cars = [...sv.cars], z0 = cars.some((c) => c.endsWith('@0')), up = cars.some((c) => !c.endsWith('@0'));
    let okk = true;
    if (q.kind === 'cls') okk = cars.some((c) => c.startsWith(q.cls + '@'));
    else if (q.kind === 'level') okk = up;
    else if (q.kind === 'drop') okk = z0 && sv.floors.some((f) => /^(walk|deck|ring|hill|terrace|roof)[12]$/.test(f));
    else if (q.kind === 'cone') okk = sv.cones > 0 && cars.length > 0;
    else okk = cars.length > 0;
    if (!okk) why.push(d.id + ' ' + t + ' (' + q.kind + (q.cls ? ' ' + q.cls : '') + ')');
  }
  ok(!why.length, 'every task is possible where it is set: its class in that tile\'s traffic (buses on Waterfront A1\'s ridge road), raised traffic for "on a raised road", a raised floor over traffic for a drop, cones for a cone task' + (why.length ? ': not at ' + why.join(', ') : ''));
}
// ---------- 2. the brief's test
{
  const P = REG, T = (k, o) => Object.assign({ kind: k }, o || {});
  const h = (o) => Object.assign({ kind: 'dash', cls: 'sedan', combo: 1, cause: null }, o);
  const cases = [
    [T('any'), h({}), 0, true], [T('drop'), h({ kind: 'drop' }), 0, true], [T('drop'), h({}), 0, false],
    [T('jump'), h({ kind: 'jump' }), 0, true], [T('push'), h({ kind: 'push' }), 0, true], [T('push'), h({ kind: 'bounce' }), 0, false],
    [T('level'), h({}), 1, true], [T('level'), h({}), 0, false], [T('cone'), h({ cause: 'cone' }), 0, true], [T('cone'), h({ cause: 'body' }), 0, false],
    [T('combo', { param: 'story.task.comboEasy' }), h({ combo: 2 }), 0, true], [T('combo', { param: 'story.task.comboHard' }), h({ combo: 2 }), 0, false],
    [T('cls', { cls: 'van' }), h({ cls: 'van' }), 0, true], [T('cls', { cls: 'police' }), h({ cls: 'van' }), 0, false], [T('struck'), h({ kind: 'struck' }), 0, true]];
  const wrong = cases.filter(([t, hit, lv, want]) => STORY.meets(t, hit, lv, P) !== want);
  ok(!wrong.length, 'the brief tests the hit that writes the chassis off: kind (drop, jump, push, bounce, struck), level ≥ 1, a cone-baited car, combo ≥ ' + P['story.task.comboEasy'] + ' or ' + P['story.task.comboHard'] + ', a class. ' + cases.length + ' cases' + (wrong.length ? ': wrong ' + wrong.map((c) => c[0].kind).join(',') : ''));
  const l = STORY.taskText({ kind: 'cls', cls: 'police' }), c = STORY.taskText({ kind: 'combo', param: 'story.task.comboHard' });
  ok(l.label === 'A POLICE CAR' && /from a police car\.$/.test(l.brief) && c.label === 'COMBO ×' + P['story.task.comboHard'], 'brief text: "' + l.label + '" — ' + l.brief + ' "' + c.label + '"');
}
// ---------- 3. the story's player sim
function story(id, pr, opts) { // a district of the story with its traffic cleared; fake cars join the view
  const s = new STORY.StorySim(id, {}, pr, Object.assign({ warm: 0 }, opts || {}));
  for (const sm of s.W6.sims) { sm.cars.length = 0; sm.slot = sm.schedule.length; sm.deckNext = { 0: 1e9, 1: 1e9, 2: 1e9, 3: 1e9 }; }
  s.fakes = []; const orig = s.buildView.bind(s);
  s.buildView = function () { orig(); for (const f of this.fakes) if (!f.scr || f.scr === this.screenName()) this.cars.push(f); this.view = this.cars; };
  s.buildView();
  return s;
}
let CID = 0;
const car = (s, cls, x, y, h, v) => ({ id: 'test-' + cls + '-' + (CID++), model: 'TEST', cls, x, y, h, L: s.P['vehicles.' + cls + '.length'], W: s.P['vehicles.' + cls + '.width'], v: v || 0, vx: Math.cos(h) * (v || 0), vy: Math.sin(h) * (v || 0), elev: 0, spent: false, inEpisode: false, touched: false, state: 'cruise' });
const settle = (s) => { for (let i = 0; i < 600 && (s.phase === 'hitstop' || s.phase === 'scroll' || s.phase === 'writeoff'); i++) s.step({}); };
const walk = (s, mx, my, n) => { for (let i = 0; i < n; i++) { s.step({ mx, my }); settle(s); if (s.phase !== 'play') break; } };
// a write-off by a crafted fatal hit (the matcher has its own checks above); then the report, the shop, the next chassis
const kill = (s, hit) => { const b = s.body; b.hits.push(Object.assign({ kind: 'dash', cls: 'sedan', combo: 1, cause: null }, hit || {})); b.health = 0; s.writeOff(); s.checkTerminal(); settle(s); };
const next = (s) => { s.continueReport(); s.leaveShop(); };
const W = REG['world.width'], H = REG['world.height'], R = REG['body.radius'];
{ // defaults: two dashes, standard recharge, standard recoil, no ability (Arcade and Story)
  const a = new STORY.ArcadeSim('parkland', {}, null, { warm: 0 }), pr0 = STORY.newProgress(), st = new STORY.StorySim('monument', {}, pr0, { warm: 0 });
  const none = (s) => Object.keys(s.tracks()).every((t) => s.tier(t) === 0) && !s.has('jump') && !s.has('carry') && !s.has('push');
  ok(none(a) && none(st) && a.capacity() === 2 && st.capacity() === 2 && a.secondsPerCharge() === REG['battery.secondsPerCharge'] && st.secondsPerCharge() === REG['battery.secondsPerCharge'] && a.P['proto.recoilScale'] === 0.7 && st.P['proto.recoilScale'] === 0.7,
    `by default: two dashes (battery.capacity ${a.capacity()}), standard recharge (${a.secondsPerCharge()} s), standard recoil (proto.recoilScale ${a.P['proto.recoilScale']}, throw ≤ ${a.P['proto.bounce.maxThrow']}), no other ability; Arcade and Story alike`);
}
{ // the ricochet: the dummy takes damage, so it keeps less of the momentum. A knock slides at most proto.bounce.maxThrow
  const sim = (ov) => { const s = new W6.Sim6('monument', Object.assign({}, ov), null, { warm: 0 }); for (const sm of s.W6.sims) { sm.cars.length = 0; sm.slot = sm.schedule.length; sm.deckNext = { 0: 1e9, 1: 1e9, 2: 1e9, 3: 1e9 }; } s.fakes = []; const o = s.buildView.bind(s); s.buildView = function () { o(); for (const f of this.fakes) this.cars.push(f); this.view = this.cars; }; return s; };
  const RY = 196, trial = (ov, mk) => { const s = sim(ov), c = mk(s); s.fakes.push(c); s.buildView(); let dist = 0, prev = null;
    for (let i = 0; i < 300; i++) { if (ev(s, 'knock').length) { c.vx = c.vy = 0; c.v = 0; } c.x += c.vx / 60; c.y += c.vy / 60; s.step(i === c.press ? { mx: c.dx, my: c.dy, aPress: true } : i > c.press && i < c.press + 3 ? { mx: c.dx, my: c.dy } : {}); while (s.phase === 'hitstop') s.step({});
      if (s.body.mode === 'knock') { if (prev) dist += Math.hypot(s.body.x - prev[0], s.body.y - prev[1]); prev = [s.body.x, s.body.y]; } }
    const k = ev(s, 'knock')[0]; return { v: k ? k.speed : 0, d: dist }; };
  const at = (s, x) => Object.assign(s.body, { x, y: RY, px: x, py: RY, level: 0, floor: null, stair: null, mode: 'idle', vx: 0, vy: 0, lunge: null, jump: null, z: 0, charge: 3, alive: true, facing: 0, combo: null, health: 5000 });
  const head = (ov) => trial(ov, (s) => { at(s, 330); return Object.assign(car(s, 'sedan', 120, RY, 0, 138), { press: 20, dx: -1, dy: 0 }); });
  const flank = (ov) => trial(ov, (s) => { at(s, 240); return Object.assign(car(s, 'sedan', 300, 130, Math.PI / 2, 120), { press: 20, dx: 1, dy: 0 }); });
  const old = head({}), now = head(STORY.P7SIM), fo = flank({}), fn = flank(STORY.P7SIM), vmax = Math.sqrt(2 * REG['physics.slideFriction'] * REG['physics.gravity'] * REG['proto.scale.unitsPerMetre'] * REG['proto.bounce.maxThrow']);
  ok(now.v <= vmax + 0.5 && now.d <= REG['proto.bounce.maxThrow'] && old.d > 100 && fn.v < fo.v && fn.d < fo.d + 1e-9,
    `the ricochet tamed: head-on into a sedan throws ${now.v.toFixed(0)} u/s, slides ${now.d.toFixed(0)} (6.10: ${old.v.toFixed(0)} u/s, ${old.d.toFixed(0)}); into a moving flank ${fn.v.toFixed(0)} u/s, ${fn.d.toFixed(0)} (was ${fo.v.toFixed(0)}, ${fo.d.toFixed(0)}). proto.recoilScale ${REG['proto.recoilScale']}; proto.bounce.maxThrow ${REG['proto.bounce.maxThrow']}`);
}
const runTo = (s, done, n) => { for (let i = 0; i < (n || 2400) && !done(s); i++) s.step({}); return done(s); };
const offRoad = (s) => s.sc.roadOk(s.body.x, s.body.y, REG['world.laneWidth'] + REG['proto.shoulderWidth']);
{
  const pr = STORY.newProgress(), s = story('monument', pr);
  ok(s.screenName() === 'A1' && s.phase === 'brief' && s.entered && ev(s, 'story-enter').length === 1 && s.fenceSides().join() === 'E,S',
    `the story opens on Monument A1 with its tile card (phase ${s.phase}); fences toward B1 and A2, not yet open (${s.fenceSides().join(', ')})`);
  s.continueBrief();
  walk(s, 1, 0, 400); const held = s.screenName() === 'A1' && s.body.x <= W - R + 1e-6, fences = ev(s, 'story-fence').length;
  ok(held && fences === 1, `walking east into the fence holds at x ${s.body.x.toFixed(0)} (screen ${W}, body ${R}); one notice a contact (${fences})`);
  Object.assign(s.body, { x: W - 60, y: s.body.y, vx: 0, vy: 0, mode: 'idle', charge: 3 }); s.run.owned.legs1 = true; s.run.owned.legs2 = true; s.run.owned.legs3 = true;
  for (let i = 0; i < 90; i++) { s.step(i === 0 ? { mx: 1, my: 0, aPress: true } : i === 6 ? { mx: 1, my: 0, bPress: true } : { mx: 1, my: 0 }); settle(s); }
  ok(s.screenName() === 'A1' && s.body.x <= W - R + 1e-6, `a dash jump at the fence is held too: x ${s.body.x.toFixed(0)}; still A1 (fences cannot be jumped)`);
  delete s.run.owned.legs1; delete s.run.owned.legs2; delete s.run.owned.legs3;
  // a real write-off: a dash into a parked sedan with the body nearly spent
  const c = car(s, 'sedan', 380, 320, Math.PI / 2, 0); s.fakes.push(c); s.buildView();
  Object.assign(s.body, { x: 300, y: 320, px: 300, py: 320, vx: 0, vy: 0, mode: 'idle', charge: 3, health: 30, facing: 0, level: 0, floor: null });
  for (let i = 0; i < 60 && s.body.alive; i++) { s.step(i === 1 ? { mx: 1, my: 0, aPress: true } : {}); }
  settle(s); s.fakes.length = 0; const cnt = ev(s, 'story-count')[0], cl = ev(s, 'story-clear')[0];
  ok(cnt && cnt.n === 1 && cnt.need === REG['story.writeOffs.monument.A1'] && cnt.kind === 'dash' && cl && cl.next === 'B1' && s.report.story.cleared && s.run.credits === 1,
    `a real dash write-off clears A1 (${cnt ? cnt.n + ' of ' + cnt.need : '—'}, story.writeOffs.monument.A1); +1 credit; B1 next`);
  s.continueReport(); const skip = ev(s, 'shop-skip').length === 1, fy = ev(s, 'story-ferry')[0], rs = s.rescue;
  ok(skip && fy && fy.from === 'A1' && fy.to === 'B1' && fy.side === 'E' && rs && rs.ferry && s.body.mode === 'rescue', 'nothing affordable, no shop: a Farsight drone comes for the new chassis, to carry it east from A1 to B1');
  let t0 = s.t, scr = []; for (let i = 0; i < 2400 && s.phase !== 'brief'; i++) { s.step({}); if (scr[scr.length - 1] !== s.screenName()) scr.push(s.screenName()); }
  const fd = ev(s, 'story-ferried')[0], dep = s.body.x;
  ok(s.phase === 'brief' && s.screenName() === 'B1' && scr.join() === 'A1,B1' && fd && dep >= R + 24 && dep <= REG['story.ferryDepth'] && offRoad(s) && s.body.level === 0 && s.body.mode === 'idle',
    `the drone carries it over the edge into B1 and sets it down off the road, ${dep.toFixed(0)} in from the west edge it crossed (≤ story.ferryDepth ${REG['story.ferryDepth']}), in ${fd ? fd.seconds : '—'} s; then B1's card`);
  ok(s.fenceSides().join() === 'E,S', `in B1, the fences hold toward C1 and B2 (${s.fenceSides().join(', ')}); the edge back to cleared A1 stays open`);
  s.continueBrief();
  kill(s, { kind: 'dash' }); const miss = ev(s, 'story-miss')[0];
  ok(miss && miss.why === 'task' && pr.tileWO === 0 && s.run.credits === 2, 'B1 wants a drop onto a car: a dash write-off scores, pays its credit (2), counts for nothing');
  next(s);
  Object.assign(s.body, { x: 40, y: 224, vx: 0, vy: 0, mode: 'idle' }); walk(s, -1, 0, 120); const back = s.screenName();
  kill(s); const old = ev(s, 'story-miss').slice(-1)[0];
  ok(back === 'A1' && old && old.why === 'cleared' && s.run.credits === 3, `cleared tiles stay open: back in ${back} from B1 in test; a write-off there scores and pays (3), counts for nothing`);
  s.continueReport(); const shop = s.phase === 'shop', pB = s.canBuy('battery1'); s.buy('battery1'); s.leaveShop();
  ok(shop && pB.ok && pB.price === REG['story.price.ability.level1'] && s.tier('battery') === 1 && s.run.credits === 0 && !s.rescue && s.screenName() === 'A1',
    `three credits open the shop: a level-1 power-up costs ${REG['story.price.ability.level1']} (Battery 1 bought); level 2 ${REG['story.price.ability.level2']}, level 3 ${REG['story.price.ability.level3']}. No clear, no ferry: the chassis stays in A1`);
  Object.assign(s.body, { x: W - 40, y: 224, vx: 0, vy: 0, mode: 'idle' }); walk(s, 1, 0, 120);
  kill(s, { kind: 'drop' });
  const sold = s.canBuy('legs1');
  ok(pr.done.monument.join() === 'A1,B1' && s.report.story.cleared && !sold.ok && sold.why === 'gift at C1', 'walked back into B1, a drop clears it. The shop does not sell Legs 1: "' + sold.why + '" (verbs are issued)');
  s.continueReport(); const fy2 = ev(s, 'story-ferry').slice(-1)[0], seen = [];
  runTo(s, (q) => { const p = q.rescue && q.rescue.phase; if (p && seen[seen.length - 1] !== p) seen.push(p); return q.phase === 'gift'; });
  const gv = ev(s, 'gift')[0];
  ok(fy2 && fy2.gift === 'legs1' && seen.join('>') === 'inbound>give>lift' && s.phase === 'gift' && gv && gv.node === 'legs1' && s.has('jump') && s.screenName() === 'B1' && s.rescue.phase === 'lift',
    'the ferry drone brings Legs 1 in view (' + seen.join(' › ') + '), lowers it onto the chassis and installs it; the sim holds in phase gift, the gift screen, before the flight');
  const k0 = s.rescue.k; for (let i = 0; i < 120; i++) s.step({});
  ok(s.phase === 'gift' && s.rescue.k === k0, 'the gift screen holds the world: 2 s later, still phase gift, the drone waiting');
  s.continueGift(); runTo(s, (q) => q.phase === 'brief');
  ok(s.screenName() === 'C1' && s.has('jump') && ev(s, 'story-gift').some((e) => e.node === 'legs1') && offRoad(s) && !s.rescue, 'A continues: the drone carries the chassis, Legs 1 fitted, to C1 and sets it down off the road; C1\'s card, a jump into a car');
  s.continueBrief(); const c0 = s.run.credits; s.run.points = 1e6; kill(s, { kind: 'jump' });
  ok(s.run.credits === c0 + 1, 'the score buys nothing: a million points, still one credit for the body');
  ok(pr.done.monument.join() === 'A1,B1,C1' && pr.credits === s.run.credits && pr.owned.legs1 && pr.owned.battery1 && pr.points === s.run.points, 'progress follows the run (tiles, credits, abilities, points): one plain object the page saves');
}
function num(v) { return Math.round(v).toLocaleString('en-GB'); }
{ // the end of a district, the next one, the certificate
  const pr = STORY.newProgress(); pr.done.monument = ['A1', 'B1', 'C1', 'C2', 'B2', 'A2', 'A3', 'B3']; pr.tileWO = REG['story.writeOffs.monument.C3'] - 1; pr.credits = 0;
  const s = story('monument', pr);
  const owe = s.rescue && s.rescue.gift; runTo(s, (q) => q.phase === 'gift'); const gs = s.phase; s.continueGift(); runTo(s, (q) => q.phase === 'brief');
  ok(s.screenName() === 'C3' && owe === 'arms1' && gs === 'gift' && s.phase === 'brief' && s.has('push') && ev(s, 'delivered').length === 1 && s.body.mode === 'idle',
    'a saved story resumes on the tile in test, Monument C3 (8 cleared). Arms 1 is still owed: a drone delivers it (gift screen), leaves, then C3\'s card');
  s.continueBrief(); kill(s, { kind: 'push' });
  ok(s.report.roadCleared && s.report.story.districtDone && pr.district === 'parkland', 'clearing C3 clears Monument; the story moves on to Parkland');
  s.continueReport(); s.leaveShop();
  ok(s.phase === 'next' && !s.rescue, 'after the report, the page builds the next district (phase next); no ferry between districts');
  const p2 = story('parkland', pr), cr = p2.run.credits;
  ok(p2.screenName() === 'C1' && p2.fenceSides().join() === 'S,W' && !ev(p2, 'story-gift').length && cr === pr.credits && cr === 1,
    'Parkland opens on C1, fenced toward C2 and B1; no gift (credits ' + cr + ')');
  const p3 = STORY.newProgress(); p3.district = 'waterfront'; p3.done = { monument: D[0].order.slice(), parkland: D[1].order.slice(), waterfront: ['A1', 'B1', 'C1', 'C2', 'C3', 'B3', 'A3', 'A2'] }; p3.tileWO = REG['story.writeOffs.waterfront.B2'] - 1;
  const s3 = story('waterfront', p3); s3.continueBrief(); kill(s3, { combo: 5 });
  ok(s3.screenName() === 'B2' && s3.run.ending && s3.run.ending.kind === 'Certified' && p3.complete && STORY.clearedCount(p3) === 27, 'the last tile, Waterfront B2 (the circus): the Test City is certified (27 of 27)');
}
{ // Edit 84: Arcade issues the verbs too, one per arcade.giftEvery write-offs, by drone to the new chassis
  const a = new STORY.ArcadeSim('monument', {}, null, { warm: 0 }), got = [];
  for (let k = 0; k < a.quota - 1; k++) {
    a.body.hits.push({ kind: 'dash' }); a.body.health = 0; a.writeOff(); a.checkTerminal(); settle(a); a.continueReport();
    const sold = a.canBuy(STORY.VERBS[k] || 'legs1'); a.leaveShop(); const rs = a.rescue, dl = ev(a, 'arcade-deliver')[k];
    runTo(a, (q) => q.phase === 'gift'); const gp = a.phase; a.continueGift(); runTo(a, (q) => !q.rescue);
    got.push((dl && dl.node) + (sold.ok ? ' sold' : '') + (gp === 'gift' ? '' : ' no screen') + (a.body.mode === 'idle' ? '' : ' held'));
  }
  ok(got.join() === 'legs1,hands1,arms1' && a.has('jump') && a.has('carry') && a.has('push') && a.run.credits === 3 && REG['arcade.giftEvery'] === 1,
    `Arcade: a drone brings the next verb to each new chassis, in the story's order (arcade.giftEvery ${REG['arcade.giftEvery']}): ${got.join(', ')}; each with the gift screen; none sold; the credits stay for levels (${a.run.credits})`);
  const ob = new STORY.ArcadeSim('monument', { 'arcade.giftEvery': 2 }, null, { warm: 0 }); ob.body.hits.push({ kind: 'dash' }); ob.body.health = 0; ob.writeOff(); ob.checkTerminal(); settle(ob); ob.continueReport(); ob.leaveShop();
  ok(!ob.rescue && ob.nextVerb() === 'legs1', 'with arcade.giftEvery 2, the first write-off brings nothing; Legs 1 waits for the second');
}
{ // Arcade: one district a run
  const s = new W6.Sim6('parkland', {}, null, { warm: 0, single: true });
  for (let k = 0; k < s.quota; k++) { s.body.hits.push({ kind: 'dash' }); s.body.health = 0; s.writeOff(); s.checkTerminal(); settle(s); if (s.phase === 'report') { s.continueReport(); s.leaveShop(); } }
  ok(s.isFinal && s.run.ending && s.run.ending.kind === 'Licensed', `Arcade plays one district a run: Parkland's ${s.quota} write-offs end it, Licensed (no carry to the next district)`);
  const a = new W6.Sim6('parkland', {}, null, { warm: 0, single: true }); a.body.hits.push({ kind: 'dash' }); a.body.health = 0; a.writeOff(); a.checkTerminal(); settle(a); a.continueReport();
  ok(a.run.credits === REG['economy.creditsPerWriteOff'] && a.phase === 'shop' && a.canBuy('battery1').price === REG['economy.price.ability.level1'], `Arcade keeps its prices: ${REG['economy.price.ability.level1']}, ${REG['economy.price.ability.level2']}, ${REG['economy.price.ability.level3']} (economy.price.ability.*), a credit a body (economy.creditsPerWriteOff)`);
  const t = new W6.Sim6('parkland', {}, null, { warm: 0 });
  ok(!t.isFinal && t.screenName() === 'B2' && t.canCross([0, 0]), 'without the option, the P6 sim keeps 6.10\'s rules: Parkland is not final; it starts in B2; no fences');
}

// ---------- Edit 85: level rules (P7SIM, both modes) and Story's traffic per tile
const OUTER = REG['world.laneWidth'] + REG['proto.shoulderWidth'], HALF = REG['world.deckWidth'] / 2;
const NO_ROAD = { 'parkland:B1': 'no Z0 road passes under it (D70)' }; // a highway with nothing to drop onto
{
  const flights = [], gaps = [], drops = [], cones = [], hid = [], miss = [];
  for (const d of D) {
    const a = new STORY.ArcadeSim(d.id, {}, null, { warm: 0 });
    for (const t of d.order) {
      const [c, r] = STORY.cellOf(t), sc = a.W6.at(c, r), g = sc.game;
      for (const f of g.floors.filter((q) => q.kind === 'deck' || q.kind === 'ring')) {
        const l = f.layer, nF = g.stairs.filter((q) => q.head === f.i).length, spans = l.gapSpans || [], inner = (l.ring && l.ring.inner) || [];
        flights.push(nF); if (nF < REG['world.deckFlightsMin']) miss.push(d.id + ' ' + t + ' flights');
        if (!spans.length && !inner.length) { if (!NO_ROAD[d.id + ':' + t]) miss.push(d.id + ' ' + t + ' gap'); continue; }
        gaps.push(spans.length + inner.length);
        for (const sp of spans) { // walk off the deck through its gap: the drop lands at Z0 on the road (or, on Waterfront's bridges, the river)
          const hz = l.dk.hz, m = (sp.a0 + sp.a1) / 2, off = l.dk.off, x = hz ? m : off + sp.side * (HALF - 40), y = hz ? off + sp.side * (HALF - 40) : m;
          if (!f.has(x, y)) continue;
          a.enter(sc); Object.assign(a.body, { x, y, px: x, py: y, level: f.z, floor: f.i, mode: 'idle', vx: 0, vy: 0, lunge: null, jump: null, z: 0, stair: null, alive: true, health: 800 });
          let dropped = false, land = null;
          for (let k = 0; k < 240; k++) { a.step(hz ? { mx: 0, my: sp.side } : { mx: sp.side, my: 0 }); while (a.phase === 'hitstop' || a.phase === 'scroll') a.step({}); if (a.body.mode === 'drop') dropped = true; if (dropped && a.body.mode !== 'drop') { land = a.body; break; } }
          const onRoad = land && land.level === 0 && sc.roadC(land.x, land.y) < REG['world.laneWidth'], wet = land && land.mode === 'rescue';
          drops.push(onRoad ? 'road' : wet ? 'river' : 'miss'); if (!onRoad && !wet) miss.push(d.id + ' ' + t + ' drop ' + (land ? Math.round(sc.roadC(land.x, land.y)) : 'held'));
        }
      }
      for (const [x, y] of g.coneHomes) { const rc = sc.roadC(x, y), v = W6.coneShows(sc, x, y); cones.push(rc - OUTER); if (rc < OUTER + 12) miss.push(d.id + ' ' + t + ' cone on road'); if (v < REG['props.cone.minVisible']) hid.push(d.id + ' ' + t + ' ' + Math.round(v * 100) + '%'); }
    }
  }
  ok(!miss.length && flights.length === 15, `every highway (${flights.length}) has a flight (world.deckFlightsMin ${REG['world.deckFlightsMin']}; Waterfront's bridges now one each, from the beach) and a parapet gap (world.deckDropGaps) over each Z0 road beneath: ${gaps.reduce((x, y) => x + y, 0)} gaps; walked off, ${drops.filter((q) => q === 'road').length} drops land on a road, ${drops.filter((q) => q === 'river').length} in the river (the bridges' plan). Exception: Parkland B1, ${NO_ROAD['parkland:B1']}` + (miss.length ? ': ' + miss.join(', ') : ''));
  ok(!hid.length && Math.min(...cones) >= 12, `cones: ${cones.length} homes, none on a road (the nearest ${Math.round(Math.min(...cones))} beyond the shoulder) and none out of view (props.cone.minVisible ${REG['props.cone.minVisible']}: not under a highway, a walkway or behind a building)` + (hid.length ? ': hidden ' + hid.join(', ') : ''));
  const six = new W6.Sim6('monument', {}, null, { warm: 0 }), g6 = six.W6.at(0, 0).game, f6 = g6.floors.find((q) => q.kind === 'deck');
  ok(!(f6.layer.gapSpans || []).length && !six.W6.densityOf, '6.x worlds keep their rules: Monument A1\'s highway has no gap without P7SIM; no tile density');
}
{ // Story's traffic per tile: the tile in test and its neighbours at story.traffic.<district>.<tile> (a ring neighbour at 1); the rest at 1; Arcade per district
  const pr = STORY.newProgress(); pr.done.monument = STORY.DIST[0].order.slice(); pr.district = 'parkland'; pr.done.parkland = ['C1', 'C2', 'C3', 'B3', 'A3', 'A2', 'A1'];
  const den = STORY.storyDensity(pr, 'parkland', REG), W0 = W6.buildWorld('parkland', { warm: 0 }), at = (c, r) => W0.at(c, r), k = REG['story.traffic.parkland.B1'];
  ok(den(at(1, 0)) === k && den(at(0, 0)) === k && den(at(2, 0)) === k && den(at(1, 1)) === 1 && den(at(0, 1)) === 1 && den(at(2, 2)) === 1, `Parkland B1 in test: B1, A1 and C1 at story.traffic.parkland.B1 (${k}); B2 (its ring) and the rest at 1`);
  const arc = new STORY.ArcadeSim('parkland', {}, null, { warm: 0 });
  ok(!arc.W6.densityOf, 'Arcade keeps one density per district (world.district.<id>.interval)');
  const p1 = STORY.newProgress(); p1.done.monument = STORY.DIST[0].order.slice(); p1.district = 'parkland'; // Parkland C1 in test
  const run = (density) => { const w = W6.buildWorld('parkland', { access: { dropGaps: 1, flightsMin: 1, coneVisible: 0.9 }, density }), act = w.at(2, 0), body = { alive: true, x: 400, y: 320, vx: 0, vy: 0, level: 9, floor: null, stair: null, mode: 'idle', parts: null, facing: 0 }, seen = new Set();
    for (let i = 0; i < 20 * 60; i++) W6.stepWorld(w, body, act);
    let n = 0, stop = 0; for (let i = 0; i < 90 * 60; i++) { W6.stepWorld(w, body, act); if (i % 60) continue; for (const s of act.sims) for (const c of s.cars) if (!c.ghost && !c.deck) { n++; seen.add(c.id); stop = Math.max(stop, c.stopT || 0); } }
    return { perMin: seen.size * 60 / 90, mean: n / 90, stop }; };
  const one = run(() => 1), kc = REG['story.traffic.parkland.C1'], up = run(STORY.storyDensity(p1, 'parkland', REG));
  ok(up.perMin > one.perMin * 1.3 && up.stop < 30, `Parkland C1 in test, 90 s: street cars ${one.perMin.toFixed(0)} → ${up.perMin.toFixed(0)} a minute, ${one.mean.toFixed(1)} → ${up.mean.toFixed(1)} in view, at story.traffic.parkland.C1 ${kc}; longest stop in view ${up.stop.toFixed(1)} s`);
}
{ // 6.4–6.10 stay frozen: the built pages match their commits
  const crypto = require('crypto'), { execSync } = require('child_process'), md5 = (b) => crypto.createHash('md5').update(b).digest('hex');
  const same = (f) => { let head = null; try { head = execSync('git show HEAD:prototypes/p6/' + f, { maxBuffer: 1 << 26, cwd: __dirname }); } catch (e) { head = null; } return !!head && md5(head) === md5(fs.readFileSync(path.join(__dirname, '..', 'p6', f))); };
  const list = ['dummies_p6_4.html', 'dummies_p6_5.html', 'dummies_p6_6.html', 'dummies_p6_7.html', 'dummies_p6_8.html', 'dummies_p6_9.html', 'dummies_p6_10.html'];
  const p7 = (() => { try { return md5(execSync('git show HEAD:prototypes/p7/dummies_p7.html', { maxBuffer: 1 << 26, cwd: __dirname })) === md5(fs.readFileSync(path.join(__dirname, 'dummies_p7.html'))); } catch (e) { return false; } })();
  const p7f = (f) => { try { return md5(execSync('git show HEAD:prototypes/p7/' + f, { maxBuffer: 1 << 26, cwd: __dirname })) === md5(fs.readFileSync(path.join(__dirname, f))); } catch (e) { return false; } };
  ok(list.every(same) && p7 && ['dummies_p7_1.html', 'dummies_p7_2.html', 'dummies_p7_3.html', 'dummies_p7_4.html', 'dummies_p7_5.html'].every(p7f), 'dummies_p6_4.html to dummies_p6_10.html and dummies_p7.html to dummies_p7_5.html are byte-identical to their commits (the shared code builds P7.6)');
}
// ---------- 4. the page
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('SKIP browser checks: playwright not found'); return done(); }
  const url = 'file://' + path.join(__dirname, 'dummies_p7_6.html');
  const br = await chromium.launch(), logs = [];
  const watch = (pg) => pg.on('pageerror', (e) => logs.push(e.message));
  const shot = async (pg, name) => { if (OUT) await pg.screenshot({ path: path.join(OUT, name) }); };
  const wait = async (pg, fn, ms) => { for (let i = 0; i < (ms || 20000) / 100; i++) { if (await pg.evaluate(fn)) return true; await pg.waitForTimeout(100); } return false; };
  const ctx = await br.newContext({ viewport: { width: 1300, height: 900 } }), pg = await ctx.newPage(); watch(pg);
  await pg.goto(url); await pg.waitForTimeout(1200);
  const t0 = await pg.evaluate(() => ({ screen: window.__dummies.screen, status: document.getElementById('status').textContent }));
  await shot(pg, 'p76_title.png');
  ok(t0.screen === 'title' && /^P7\.6 /.test(t0.status), 'the title offers two modes, ARCADE and STORY (build ' + t0.status.split(' ')[0] + ')');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(300);
  const a1 = await pg.evaluate(() => window.__dummies.screen); await shot(pg, 'p76_arcade.png');
  await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('Space');
  const a2 = await wait(pg, () => window.__dummies.sim && window.__dummies.sim.phase === 'play', 30000);
  const a3 = await pg.evaluate(() => { const s = window.__dummies.sim; return { id: s.levelId, final: s.isFinal, story: !!s.storyMode }; });
  ok(a1 === 'arcade' && a2 && a3.id === 'waterfront' && a3.final && !a3.story, `ARCADE: pick a district (${a3.id}); it plays alone, as 6.10 plays it`);
  const ah = await pg.evaluate(() => window.__dummiesUI.hud());
  ok(ah.stats.rows === 'POINTS CARS LEFT' && ah.stats.y === ah.body.y, `Arcade's box: ${ah.stats.rows} (CARS LEFT kept: the shift's clock)`);
  const ao = await pg.evaluate(() => window.__dummiesUI.objective(window.__dummies.sim));
  await pg.evaluate(() => { const s = window.__dummies.sim, b = s.body; b.hits.push({ kind: 'dash', cls: 'van', combo: 1, assessed: 120, lost: 30, angle: 90, model: 'VAN-02' }); b.health = 0; s.writeOff(); s.checkTerminal(); });
  await wait(pg, () => window.__dummies.sim.phase === 'report', 8000); await pg.keyboard.press('Space'); await pg.waitForTimeout(250); await pg.keyboard.press('ShiftLeft');
  await wait(pg, () => { const s = window.__dummies.sim; return s.rescue && s.rescue.gift && Math.abs(s.rescue.drone.y - s.body.y) < 140; }, 8000); await shot(pg, 'p76_arcade_drone.png');
  await wait(pg, () => window.__dummies.sim.phase === 'gift', 8000); await pg.waitForTimeout(1300); await shot(pg, 'p76_arcade_gift.png');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(400);
  const ag = await pg.evaluate(() => { const s = window.__dummies.sim; return { phase: s.phase, legs: s.has('jump'), ob: window.__dummiesUI.objective(s) }; });
  ok(/Legs 1 comes with the next write-off/.test(ao ? ao[1] : '') && ag.phase === 'play' && ag.legs && /Hands 1 comes with the next write-off/.test(ag.ob ? ag.ob[1] : ''),
    `Arcade: "${ao ? ao[1] : ''}"; after the write-off a drone brings Legs 1 with the gift screen; then "${ag.ob ? ag.ob[1] : ''}"`);
  { // Edit 85: Waterfront A2's bridge: the new flight up from the beach; the gaps over the avenue
    await pg.evaluate(() => { const s = window.__dummies.sim; s.enter(s.W6.at(0, 1)); Object.assign(s.body, { x: -500, y: -500 }); }); await pg.waitForTimeout(500); await shot(pg, 'p76_bridge_flight.png');
    const fl = await pg.evaluate(() => { const g = window.__dummies.sim.W6.at(0, 1).game, f = g.floors.find((q) => q.kind === 'deck'); return { flights: g.stairs.filter((q) => q.head === f.i).length, gaps: (f.layer.gapSpans || []).length }; });
    ok(fl.flights === 1 && fl.gaps >= 2, `in the page, Waterfront A2's bridge has a flight up from the beach (${fl.flights}) and ${fl.gaps} drop gaps`);
  }
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);
  for (let i = 0; i < 6; i++) await pg.keyboard.press('ArrowDown'); // Edit 86: Quit to title, past Options and Controls
  await pg.keyboard.press('Space'); await pg.waitForTimeout(200);
  await pg.keyboard.press('ArrowRight'); await pg.keyboard.press('Space'); await pg.waitForTimeout(400);
  const m = await pg.evaluate(() => ({ screen: window.__dummies.screen, story: window.__dummies.story }));
  await shot(pg, 'p76_map.png');
  ok(m.screen === 'storymap' && m.story && m.story.district === 'monument', 'STORY: the map of the Test City; only Monument A1 is revealed');
  await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(150); await shot(pg, 'p76_map_hidden.png'); await pg.keyboard.press('ArrowLeft');
  await pg.keyboard.press('Space');
  const b1 = await wait(pg, () => window.__dummies.sim && window.__dummies.sim.phase === 'brief', 30000); await pg.waitForTimeout(300);
  await shot(pg, 'p76_brief.png');
  ok(b1, 'deploying opens the tile card: the tale of the LED wall and Farsight\'s brief');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(200);
  await shot(pg, 'p76_a1_gap.png'); // Edit 85: Monument A1's highway, its parapet open over the road (lit)
  { // Edit 86: a clean screen; options and controls in the pause menu
    const ui = await pg.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(); return { bar: document.querySelector('.bar').hidden, mon: document.getElementById('padmon').hidden, h: r.height, vh: window.innerHeight, left: window.__dummies.layoutY.left }; });
    ok(ui.bar && ui.mon && ui.h >= ui.vh - 2 && ui.left === 430, `no row under the screen; the stage fills the window (${Math.round(ui.h)} of ${ui.vh} px); BODY on the field's top edge, so the map rises: the touch zone starts at ${ui.left} (P7.5: 458)`);
    const H = await pg.evaluate(() => window.__dummiesUI.hud()), top = H.field.y, same = (a, b) => Math.abs(a - b) < 0.5;
    ok(same(H.body.y, top) && same(H.stats.y, top) && same(H.stats.w, H.body.w) && same(H.stats.h, H.body.h) && H.stats.rows === 'POINTS CREDITS' && H.chassis.y > H.stats.y + H.stats.h && H.objective.y >= 0 && H.objective.y + H.objective.h <= top && H.map.title === 'MONUMENT · A1',
      `Edit 87, one top edge (y ${top}): BODY ${H.body.w}×${H.body.h}, the field, ${H.stats.rows} ${H.stats.w}×${H.stats.h}; the chassis beneath (y ${H.chassis.y}); the objective on the top strip ("${H.objective.text}"); the map titled "${H.map.title}"`);
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(150); await shot(pg, 'p76_pause.png');
    const pi = await pg.evaluate(() => window.__dummies.paused);
    await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('Space'); await pg.waitForTimeout(150);
    const op = await pg.evaluate(() => ({ page: window.__dummies.pausePage, items: window.__dummiesUI.optionItems(), sound: window.__dummies.sound }));
    await shot(pg, 'p76_options.png');
    await pg.keyboard.press('Space'); await pg.waitForTimeout(100); const snd = await pg.evaluate(() => window.__dummies.sound); await pg.keyboard.press('Space'); await pg.waitForTimeout(100);
    ok(pi && op.page === 'options' && op.items.join('|').replace(/: (on|off)/g, '') === 'Sound|Palette: cyber → day|Full screen|Tuning panel|Gamepad setup|Back' && snd === !op.sound, 'ESC pauses; Options: ' + op.items.join(' · ') + '; Sound toggles from the menu');
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(100); await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('Space'); await pg.waitForTimeout(150);
    const ck = await pg.evaluate(() => ({ page: window.__dummies.pausePage, dev: window.__dummiesUI.deviceOf(), rows: window.__dummiesUI.controlRows().rows.map((r) => r[1]).join(' ') }));
    await shot(pg, 'p76_controls_keys.png');
    await pg.evaluate(() => { window.__dummies.device = 'pad'; }); await pg.waitForTimeout(120);
    const cp = await pg.evaluate(() => ({ dev: window.__dummiesUI.deviceOf(), rows: window.__dummiesUI.controlRows().rows.map((r) => r[1]).join(' ') }));
    await shot(pg, 'p76_controls_pad.png');
    await pg.evaluate(() => { window.__dummies.device = 'keys'; });
    ok(ck.page === 'controls' && ck.dev === 'keys' && /^WASD \/ arrows Space \/ K L \/ Shift J \/ E I \/ Q Esc \/ P T G$/.test(ck.rows) && cp.dev === 'pad' && /^Stick \/ d-pad A B X Y Start Hold Start$/.test(cp.rows), `Controls shows the device in hand: keyboard (${ck.rows}); gamepad (${cp.rows})`);
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(80); await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);
  }
  const den = await pg.evaluate(() => { const s = window.__dummies.sim; return [s.W6.densityOf(s.W6.at(0, 0)), s.W6.densityOf(s.W6.at(1, 0)), s.W6.densityOf(s.W6.at(2, 2))]; });
  ok(den[0] === 1.5 && den[1] === 1.5 && den[2] === 1, `in the page, Story runs Monument A1 and its neighbours at story.traffic.monument.A1 (${den[0]}), C3 at ${den[2]}`);
  await pg.keyboard.down('KeyD'); await pg.waitForTimeout(3800); await pg.keyboard.up('KeyD'); await pg.waitForTimeout(150);
  const f = await pg.evaluate(() => { const s = window.__dummies.sim; return { x: s.body.x, scr: s.screenName(), toast: window.__dummies.toast && window.__dummies.toast.msg }; });
  await shot(pg, 'p76_fence.png');
  ok(f.scr === 'A1' && f.x > 700 && /Fence/.test(f.toast || ''), `the fence on A1's east side holds the dummy (x ${Math.round(f.x)}): "${f.toast}"`);
  const ob = await pg.evaluate(() => window.__dummiesUI.objective(window.__dummies.sim));
  ok(ob && /^OBJECTIVE · A1/.test(ob[0]) && /Write off a body \(0 of 1\)/.test(ob[1]), 'the top strip carries the objective: "' + (ob ? ob.join(' · ') : '') + '"');
  await pg.evaluate(() => { const s = window.__dummies.sim, b = s.body; s.run.credits = 2; b.hits.push({ kind: 'dash', cls: 'van', combo: 1, assessed: 120, lost: 30, angle: 90, model: 'VAN-02' }); b.health = 0; s.writeOff(); s.checkTerminal(); });
  await wait(pg, () => window.__dummies.sim.phase === 'report', 8000); await pg.waitForTimeout(200);
  await shot(pg, 'p76_report.png');
  const saved = await pg.evaluate(() => JSON.parse(localStorage.getItem('dummies.p7.story') || 'null'));
  ok(saved && saved.done.monument && saved.done.monument[0] === 'A1' && saved.credits === 3, 'the write-off clears A1 (1 of 1) and pays its credit (3 in all); progress is saved in this browser');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(300); await shot(pg, 'p76_shop.png');
  const sh = await pg.evaluate(() => window.__dummies.sim.phase);
  ok(sh === 'shop', 'with 3 credits, the shop follows: a level-1 power-up costs 3');
  await pg.keyboard.press('ShiftLeft'); await wait(pg, () => { const s = window.__dummies.sim; return s.rescue && s.rescue.phase === 'carry' && s.body.x > 520; }, 15000); await pg.waitForTimeout(100);
  await shot(pg, 'p76_ferry.png');
  const fo = await pg.evaluate(() => window.__dummiesUI.objective(window.__dummies.sim));
  const fb = await wait(pg, () => window.__dummies.sim.phase === 'brief', 20000); await pg.waitForTimeout(200); await shot(pg, 'p76_brief_b1.png');
  const fp = await pg.evaluate(() => { const s = window.__dummies.sim; return { scr: s.screenName(), x: s.body.x, fences: s.fenceSides().join() }; });
  ok(fb && fp.scr === 'B1' && fp.x < 200 && fp.fences === 'E,S' && /DRONE/.test(fo ? fo[0] : ''), `deploying, a drone carries the chassis to B1 ("${fo ? fo.join(' · ') : ''}") and sets it down by the west edge (x ${Math.round(fp.x)}); B1's card`);
  await pg.keyboard.press('Space'); await pg.waitForTimeout(400); await shot(pg, 'p76_b1.png');
  // Edit 84: clear B1; the drone that ferries the chassis to C1 brings Legs 1, in view; the gift screen; A waits for the hold
  await pg.evaluate(() => { const s = window.__dummies.sim, b = s.body; b.hits.push({ kind: 'drop', cls: 'sedan', combo: 1, assessed: 120, lost: 30, angle: 90, model: 'SED-01' }); b.health = 0; s.writeOff(); s.checkTerminal(); });
  await wait(pg, () => window.__dummies.sim.phase === 'report', 8000); await pg.waitForTimeout(150); await pg.keyboard.press('Space'); await pg.waitForTimeout(250);
  if (await pg.evaluate(() => window.__dummies.sim.phase === 'shop')) await pg.keyboard.press('ShiftLeft');
  await wait(pg, () => { const s = window.__dummies.sim, rs = s.rescue; return rs && rs.gift && rs.phase === 'inbound' && Math.abs(rs.drone.x - s.body.x) < 150; }, 10000); await shot(pg, 'p76_drone_item.png');
  const dob = await pg.evaluate(() => window.__dummiesUI.objective(window.__dummies.sim));
  await wait(pg, () => { const rs = window.__dummies.sim.rescue; return rs && rs.phase === 'give' && rs.item > 0.5; }, 10000); await shot(pg, 'p76_give.png');
  await wait(pg, () => window.__dummies.sim.phase === 'gift', 8000);
  const pre = await pg.evaluate(() => window.__dummiesUI.gift().age); await pg.keyboard.press('Space'); await pg.waitForTimeout(60);
  const early = await pg.evaluate(() => ({ phase: window.__dummies.sim.phase, ready: window.__dummiesUI.giftReady(), age: window.__dummiesUI.gift() && window.__dummiesUI.gift().age }));
  for (const [a, f] of [[0.2, 'p76_gift_drone.png'], [0.5, 'p76_gift_fall.png'], [0.78, 'p76_gift_land.png']]) { await pg.evaluate((q) => window.__dummiesUI.pinGift(q), a); await pg.waitForTimeout(60); await shot(pg, f); } // the screen at fixed moments
  await pg.evaluate(() => window.__dummiesUI.pinGift(null));
  await wait(pg, () => window.__dummiesUI.giftReady(), 4000); await pg.waitForTimeout(500); await shot(pg, 'p76_gift.png');
  ok(/DRONE/.test(dob ? dob[0] : '') && /Bringing Legs 1, then on to C1/.test(dob ? dob[1] : '') && early.phase === 'gift' && !early.ready,
    `B1 cleared: the ferry drone flies in with Legs 1 under it ("${dob ? dob.join(' · ') : ''}"), lowers it onto the chassis; the gift screen; A at ${pre.toFixed(2)} s is ignored (ui.gift.holdSeconds)` + (early.phase !== 'gift' || early.ready ? ' [' + JSON.stringify(early) + ']' : ''));
  await pg.keyboard.press('Space');
  const cb = await wait(pg, () => window.__dummies.sim.phase === 'brief', 20000);
  const c1 = await pg.evaluate(() => { const s = window.__dummies.sim; return { scr: s.screenName(), legs: s.has('jump'), gift: window.__dummiesUI.gift() }; });
  await pg.waitForTimeout(200); await shot(pg, 'p76_brief_c1.png');
  ok(cb && c1.scr === 'C1' && c1.legs && !c1.gift, 'A continues: the drone carries the chassis, Legs 1 fitted, into C1; C1\'s card (a jump into a car)');
  const pg2 = await ctx.newPage(); watch(pg2); await pg2.goto(url); await pg2.waitForTimeout(800);
  await pg2.keyboard.press('ArrowRight'); await pg2.keyboard.press('Space'); await pg2.waitForTimeout(300);
  const re = await pg2.evaluate(() => ({ screen: window.__dummies.screen, wo: window.__dummies.story && window.__dummies.story.tileWO, done: window.__dummies.story && (window.__dummies.story.done.monument || []).join() }));
  await shot(pg2, 'p76_map_progress.png');
  ok(re.screen === 'storymap' && re.wo === 0 && re.done === 'A1,B1', 'a reload resumes the story: A1 and B1 cleared, C1 in test');
  await pg2.close();
  // phones held sideways. Edit 87: the HUD in the 16:9 centre; the stick and the diamond default under the side panels; a wide phone's
  // margins are free; Pause › Controls › Adjust layout moves and sizes both, saved in this browser
  const story = async (p) => { await p.evaluate(() => { window.__dummies.titleSel = 1; });
    for (let i = 0; i < 2; i++) { await p.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' })); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' })); }); await p.waitForTimeout(200); }
    await wait(p, () => window.__dummies.sim && window.__dummies.sim.phase === 'brief', 30000); await p.evaluate(() => window.__dummies.sim.continueBrief()); await p.waitForTimeout(400); };
  const phone = async (w, h, dpr) => { const c = await br.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: dpr }), p = await c.newPage(); watch(p);
    await p.goto(url); await p.waitForTimeout(900); await story(p); return [c, p]; };
  const lay = (p) => p.evaluate(() => { const I = window.__dummiesInput, L = I.touchLayout(), r = document.getElementById('game').getBoundingClientRect(), k = r.width / L.Wc; // CSS px a touch unit
    const css = (q) => ({ x: r.left + q.x * k, y: r.top + q.y * k }), bar = I.editBar(L);
    return { gx: L.gx, Wc: L.Wc, sr: L.sr, sr0: L.sr0, fr: L.fr, fr0: L.fr0, home: L.home, c: L.c, chip: L.chip, homeCss: css(L.home), cCss: css(L.c), pauseCss: css({ x: L.chip.pause.x + L.chip.pause.w / 2, y: L.chip.pause.y + L.chip.pause.h / 2 }),
      plusCss: css({ x: bar.plus.x + bar.plus.w / 2, y: bar.plus.y + bar.plus.h / 2 }), doneCss: css({ x: bar.done.x + bar.done.w / 2, y: bar.done.y + bar.done.h / 2 }), toCss: k, left: r.left, top: r.top }; });
  const ptr = (p, type, x, y, id) => p.evaluate(([t, x, y, id]) => { document.getElementById('game').dispatchEvent(new PointerEvent(t, { pointerType: 'touch', clientX: x, clientY: y, pointerId: id, bubbles: true, cancelable: true })); }, [type, x, y, id]);
  const drag = async (p, a, b, id) => { await ptr(p, 'pointerdown', a.x, a.y, id); for (let i = 1; i <= 6; i++) await ptr(p, 'pointermove', a.x + (b.x - a.x) * i / 6, a.y + (b.y - a.y) * i / 6, id); await ptr(p, 'pointerup', b.x, b.y, id); await p.waitForTimeout(60); };
  const tap = async (p, a, id) => { await ptr(p, 'pointerdown', a.x, a.y, id); await ptr(p, 'pointerup', a.x, a.y, id); await p.waitForTimeout(80); };
  { // a 16:9 phone: no side margins
    const [c, p] = await phone(640, 360, 3), L = await lay(p); await shot(p, 'p76_phone169.png');
    const H = await p.evaluate(() => window.__dummiesUI.hud());
    ok(L.gx < 1 && L.home.x > 16 && L.home.x < 240 && L.c.x > 1040 && L.c.x < 1280 && L.chip.pause.y + L.chip.pause.h <= H.field.y && L.chip.full.x + L.chip.full.w <= 240, `16:9 phone: the stick under the map (x ${Math.round(L.home.x)}), the diamond under the chassis (x ${Math.round(L.c.x)}); ❚❚ PAUSE and ⤢ FULL small, top left, above BODY (${L.chip.pause.w}×${L.chip.pause.h})`);
    await c.close();
  }
  const [ph, pp] = await phone(892, 412, 3.5); // a Samsung Galaxy S25 Ultra, 19.5:9
  const L = await lay(pp), H = await pp.evaluate(() => window.__dummiesUI.hud()); await shot(pp, 'p76_s25.png');
  const in169 = (x) => x >= L.gx - 0.5 && x <= L.gx + 1280.5;
  ok(L.gx > 100 && in169(L.chip.pause.x) && in169(L.chip.full.x + L.chip.full.w) && L.home.x > L.gx && L.home.x < L.gx + 240 && L.c.x > L.gx + 1040 && L.c.x < L.gx + 1280 && H.stats.x + H.stats.w <= 1280,
    `19.5:9 (S25 Ultra, 892×412 CSS): the 16:9 frame centred, ${Math.round(L.gx)} units of margin a side; every panel, the chips, the stick and the diamond inside it by default`);
  await tap(pp, L.pauseCss, 3); const pz = await pp.evaluate(() => window.__dummies.paused);
  await pp.evaluate(() => { const a = window.__dummies; a.pausePage = 'controls'; a.ctlSel = 0; }); await pp.waitForTimeout(100);
  const tc = await pp.evaluate(() => ({ dev: window.__dummiesUI.deviceOf(), rows: window.__dummiesUI.controlRows().rows.map((r) => r[1]).join(' '), items: window.__dummiesUI.controlItems().join('|'), opts: window.__dummiesUI.optionItems().join('|') }));
  await shot(pp, 'p76_phone_controls.png');
  await pp.keyboard.press('Space'); await pp.waitForTimeout(150); const ed0 = await pp.evaluate(() => !!window.__dummies.touchEdit);
  ok(pz && tc.dev === 'touch' && /^Stick, left A B X Y ❚❚ ⤢$/.test(tc.rows) && tc.items === 'Adjust layout|Reset layout|Back' && !/Tuning|Gamepad/.test(tc.opts) && ed0,
    `the small ❚❚ chip pauses; on a phone, Controls shows touch (${tc.rows}) and offers ${tc.items.split('|').join(' · ')}; Adjust layout opens the editor`);
  await drag(pp, L.homeCss, { x: L.left + 50 * L.toCss + 4, y: L.homeCss.y }, 5); // the stick into the left margin
  await drag(pp, L.cCss, { x: L.left + (L.Wc - 70) * L.toCss, y: L.cCss.y - 20 }, 6); // the diamond into the right margin
  await shot(pp, 'p76_s25_edit.png');
  const L1 = await lay(pp); await tap(pp, L1.plusCss, 7); await tap(pp, L1.plusCss, 7); const L2 = await lay(pp);
  await shot(pp, 'p76_s25_edit_size.png');
  for (let i = 0; i < 10; i++) await pp.evaluate(() => window.__dummiesInput.touchEditSize(1)); const kMax = await pp.evaluate(() => window.__dummies.touchCfg.face.k);
  for (let i = 0; i < 20; i++) await pp.evaluate(() => window.__dummiesInput.touchEditSize(-1)); const kMin = await pp.evaluate(() => window.__dummies.touchCfg.face.k);
  for (let i = 0; i < 6; i++) await pp.evaluate(() => window.__dummiesInput.touchEditSize(1));
  const L3 = await lay(pp); await tap(pp, L3.doneCss, 8);
  const st = await pp.evaluate(() => ({ edit: !!window.__dummies.touchEdit, cfg: JSON.parse(localStorage.getItem('dummies.p7.touch') || 'null') }));
  ok(L1.home.x < L1.gx && L1.c.x > L1.gx + 1280 && Math.abs(L2.fr / L2.fr0 - 1.2) < 0.01 && Math.abs(L2.sr - L1.sr) < 0.01 && kMax === 1.6 && kMin === 0.6 && !st.edit && st.cfg && st.cfg.stick && st.cfg.face && st.cfg.face.k === 1.2,
    `Adjust layout: the stick dragged into the left margin (x ${Math.round(L1.home.x)} < ${Math.round(L1.gx)}), the diamond into the right (x ${Math.round(L1.c.x)}); + SIZE twice: the buttons ×${(L2.fr / L2.fr0).toFixed(2)}, the stick unchanged; size held to ${kMin}–${kMax} (ui.touch.scaleMin–scaleMax); DONE saves (${JSON.stringify(st.cfg)})`);
  await pp.evaluate(() => { const a = window.__dummies; a.paused = false; a.pausePage = null; }); await pp.waitForTimeout(150); await shot(pp, 'p76_s25_custom.png');
  const L4 = await lay(pp), y0 = await pp.evaluate(() => window.__dummies.sim.body.y);
  await ptr(pp, 'pointerdown', L4.homeCss.x, L4.homeCss.y, 9); for (let i = 1; i <= 8; i++) { await ptr(pp, 'pointermove', L4.homeCss.x, L4.homeCss.y - 5 * i, 9); await pp.waitForTimeout(50); }
  await pp.waitForTimeout(400); const y1 = await pp.evaluate(() => window.__dummies.sim.body.y); await ptr(pp, 'pointerup', L4.homeCss.x, L4.homeCss.y - 40, 9);
  ok(y1 < y0 - 20, `in play, a thumb on the moved stick (in the margin) walks the dummy north (${Math.round(y0)} → ${Math.round(y1)})`);
  await pp.reload(); await pp.waitForTimeout(900); await story(pp); const L5 = await lay(pp);
  await pp.evaluate(() => { const a = window.__dummies; a.paused = true; a.pausePage = 'controls'; a.ctlSel = 1; }); await pp.keyboard.press('Space'); await pp.waitForTimeout(150);
  const L6 = await lay(pp), rs = await pp.evaluate(() => ({ cfg: window.__dummies.touchCfg, ls: localStorage.getItem('dummies.p7.touch') }));
  ok(Math.abs(L5.home.x - L4.home.x) < 0.5 && Math.abs(L5.fr - L4.fr) < 0.01 && rs.cfg === null && rs.ls === null && Math.abs(L6.home.x - L.home.x) < 0.5 && Math.abs(L6.c.x - L.c.x) < 0.5,
    'a reload keeps the layout; Reset layout restores the defaults and clears the save' + (rs.cfg !== null || Math.abs(L5.home.x - L4.home.x) >= 0.5 ? ' ' + JSON.stringify({ h5: L5.home, h4: L4.home, cfg: rs.cfg, h6: L6.home, h: L.home }) : ''));
  await ph.close();
  ok(!logs.length, 'browser: no page errors' + (logs.length ? ': ' + logs.slice(0, 3).join(' | ') : ''));
  await br.close();
  done();
})().catch((e) => { console.log('FAIL browser: ' + e.message); fail++; done(); process.exit(1); }); // an open browser would hold the process
function done() { console.log('\n' + pass + ' passed, ' + fail + ' failed'); process.exitCode = fail ? 1 : 0; }
