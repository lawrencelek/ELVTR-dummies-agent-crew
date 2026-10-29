// Prototype 7.13 (GDD Edits 81–94) checks. Run from prototypes/p7: node test_p713.js [screenshot folder]
// Edit 94: the finale (D76), built by the coding agent (coder/) and reviewed by hand. The circus's monument is shrouded in Story until
// Waterfront B2 clears (world.monumentShroud); the last write-off plays, a drone lifts the cloth (ui.finale.unveilSeconds) and the plaque shows
// the run (chassis, points, best combo, time); A, or a tap, sends a drone that carries the dummy to the container ship at B3, every crate
// with its face; then the Certified ending. Arcade has no finale.
// Edit 93: introduce, then test. Each part arrives on the tile whose brief first needs it: Battery 1 at Monument B1 (DASH INTO A CAR),
// Hands 1 A2, Legs 1 B3; Arms 1 Parkland C1, Legs 2 A3, Hands 2 A2, Arms 2 A1, Battery 2 B2 (combo); Legs 3 Waterfront B1, Arms 3 B3,
// Battery 3 B2 (combo). No brief needs a part not yet issued. Monument C1 is the drop; C3 the rebound (1 write-off); 34 bodies.
// Edit 92: Narrative A, Certified: act lines, 27 titles and tales in Farsight's voice, the ending. The story's tile art (world.storyArt):
// cosmetic only (every solid, floor, stair, spawn and cone home unchanged), confined to its nine tiles.
// Edit 91: Story: every part by drone on a fixed tile (eleven: Battery 1, the dash, at Monument B1 ... Arms 3 at Waterfront B3); no
// levels, no workshop; points are the score. The dummy starts on foot (proto.batteryModel 1: no dash before Battery 1;
// damage.bodyHealthOnFoot). In the tile in test a fatal hit that misses the brief holds the chassis at story.missFloor. Arcade: every
// part for credits; its chassis ships with Battery 1; no drone gifts. HUD: POINTS small, top right (Arcade: and CARS LEFT); the
// chassis on the top edge; damage reddens each part, its number beside it; no effect rows. The circus's DUMMY MONUMENT.
// Edit 90: a jump out of a dash is paid by the dash (battery.dashJumpCost); X taps a cone down when none is in reach
// (abilities.hands.tapDrop); a touch button names its verb only once fitted, OK and BACK in menus; Controls hides locked verbs.
// Edit 89: every menu answers a tap (and a click); a phone with a stylus turns touch on at the first touch. Story has no credits:
// points raise the dummy's level (story.level.*); each level an upgrade; the workshop, around the chassis, fits it. Locked parts
// stay dark until their drone. Arcade keeps credits, in the same workshop.
// Edit 88: STORY opens the save screen: NEW GAME and three slots (story.saveSlots). Each slot keeps a name (story.saveNameMax
// characters), a time stamp and the story's progress; CONTINUE, RENAME, ERASE (twice); NEW GAME takes the first empty slot, else
// overwrites one (twice). The name entry: a keyboard types; a grid for the stick, the pad and taps; a phone's own keyboard. 7.6's
// one story moves into slot 1.
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
// 3. Browser (Playwright, dummies_p7_9.html): title; Arcade and its first verb; the story map; the card; a fence; a report, the
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
  const ids = ['economy.creditsPerWriteOff', 'world.storyArt', 'proto.batteryModel', 'abilities.battery.dashCharges', 'damage.bodyHealthOnFoot', 'story.missFloor', 'world.dummyMonument', 'story.task.comboEasy', 'story.task.comboHard', 'story.shiftCars', 'proto.recoilScale', 'proto.bounce.maxThrow', 'story.ferryDepth', 'ui.gift.fallSeconds', 'ui.gift.holdSeconds', 'world.deckDropGaps', 'world.deckFlightsMin', 'props.cone.minVisible', 'ui.touch.scaleMin', 'ui.touch.scaleMax', 'ui.touch.scaleStep', 'story.saveSlots', 'story.saveNameMax', 'battery.dashJumpCost', 'abilities.hands.tapDrop'];
  const regFile = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'content', 'params', 'tuning.parameters.json'), 'utf8')), inFile = new Set(regFile.entries.map((e) => e.id));
  const tiles = D.flatMap((d) => d.order.map((t) => 'story.writeOffs.' + d.id + '.' + t)), trafficIds = D.flatMap((d) => d.order.map((t) => 'story.traffic.' + d.id + '.' + t)), retired = ['story.tileWriteOffs', 'story.clearPowerUps', 'story.pointsPerPowerUp', 'story.giftPowerUps', 'story.giftCredits'];
  const byId = new Map(regFile.entries.map((e) => [e.id, e]));
  ok(ids.concat(tiles, trafficIds).every((k) => REG[k] != null && inFile.has(k)) && retired.every((k) => /^retired \(Edit 8[23]\)/.test(byId.get(k).status)) && [1, 2, 3].every((L) => /^retired \(Edit 89\)/.test(byId.get('story.price.ability.level' + L).status)) && ['story.level.firstPoints', 'story.level.stepPoints', 'story.level.max', 'story.level.upgrades', 'arcade.giftEvery'].every((k) => /^retired \(Edit 91\)/.test(byId.get(k).status)) && byId.get('proto.recoilScale').default === REG['proto.recoilScale'] && byId.get('proto.bounce.maxThrow').default === REG['proto.bounce.maxThrow'] && /^edit(9[4-9]|\d{3})-/.test(regFile.registryVersion), // Edit 97: edit94 or later (Prototype 8.2 adds IDs; 7.13's stay)
    'the story\'s values are registry IDs (' + ids.map((k) => k + ' ' + REG[k]).join(', ') + '); 27 tile counts; 27 tile traffic scales; ' + retired.length + ' P7 IDs retired; story.price.ability.level1–3 retired (Edit 89: no credits in Story); story.level.* and arcade.giftEvery retired (Edit 91); registry ' + regFile.registryVersion);
  const per = D.map((d) => d.name + ' ' + d.order.map((t) => REG['story.writeOffs.' + d.id + '.' + t]).join('')), sum = tiles.reduce((a, k) => a + REG[k], 0);
  ok(tiles.every((k) => REG[k] >= 1 && REG[k] <= 2) && sum === 34 && REG['story.writeOffs.monument.C3'] === 1 && REG['story.traffic.monument.C3'] === 1.5, 'write-offs per tile: ' + per.join(' · ') + ' (in story order); ' + sum + ' bodies (Edit 93: Monument C3, the rebound, 1 at story.traffic 1.5; 7.1: 62)');
  // Edit 91: the Zelda-like schedule. Every part of the four tracks arrives by drone, once, on a fixed tile; a track's levels in order
  const sched = []; for (const d of D) for (const t of d.order) { const g = d.tiles[t].gift; if (g && g.node) sched.push(g.node + '@' + d.name + ' ' + t + ' #' + STORY.tileNumber(d.id, t)); }
  const all = Object.keys(X.NODES10), seen = new Set(), order = []; for (const q of sched) { const n = q.split('@')[0]; order.push(!seen.has(n) && (!X.NODES10[n].pre || seen.has(X.NODES10[n].pre))); seen.add(n); }
  const wantS = 'battery1@Monument B1 #2,hands1@Monument A2 #6,legs1@Monument B3 #8,arms1@Parkland C1 #10,legs2@Parkland A3 #14,hands2@Parkland A2 #15,arms2@Parkland A1 #16,battery2@Parkland B2 #18,legs3@Waterfront B1 #20,arms3@Waterfront B3 #24,battery3@Waterfront B2 #27';
  ok(sched.join() === wantS && sched.length === all.length && all.every((n) => seen.has(n)) && order.every(Boolean) && STORY.VERBS.length === 11,
    'Introduce, then test (Edit 93): all ' + sched.length + ' parts by drone, each once, a track in order, on fixed tiles: ' + sched.join(', ').replace(/@/g, ' at '));
  // abilities a task needs, gifted at or before its tile (never left to the shop)
  const NEED = { dash: 'battery1', jump: 'legs1', push: 'arms1', cone: 'hands1' }, got = new Set(), late = [], first = {};
  for (const d of D) for (const t of d.order) { const q = d.tiles[t]; if (q.gift && q.gift.node) got.add(q.gift.node); const n = NEED[q.task.kind]; if (n && !got.has(n)) late.push(d.id + ' ' + t); if (n && !first[n]) first[n] = d.name + ' ' + t; }
  const intro = ['battery1', 'hands1', 'legs1', 'arms1'].map((n) => n + ' ' + first[n] + ' = ' + STORY.VERB_AT[n]);
  ok(!late.length && ['battery1', 'hands1', 'legs1', 'arms1'].every((n) => first[n] === STORY.VERB_AT[n]), 'no brief needs a part not yet issued; each verb\'s first brief is the tile its drone brings it to: ' + intro.join(', ') + (late.length ? ': late at ' + late.join(', ') : ''));
  // each level beyond 1 lands on a tile whose brief uses it (Legs: jump; Arms: push; Hands: cone); Battery 1 after A1, the tile on foot
  const mon = D[0].order.map((t) => t + ' ' + D[0].tiles[t].task.kind).join(', '), use = { legs: 'jump', arms: 'push', hands: 'cone', battery: 'combo' }, off = [];
  for (const d of D) for (const t of d.order) { const g = d.tiles[t].gift, n = g && g.node, tr = n && X.NODES10[n].track; if (use[tr] && d.tiles[t].task.kind !== (n === 'battery1' ? 'dash' : use[tr])) off.push(n + ' ' + d.id + ' ' + t); }
  ok(!off.length && mon === 'A1 any, B1 dash, C1 drop, C2 level, B2 struck, A2 cone, A3 combo, B3 jump, C3 bounce' && D[0].tiles.A1.task.kind === 'any' && STORY.taskText({ kind: 'dash' }).label === 'DASH INTO A CAR',
    'every part arrives on a tile that asks for it: Battery 1 a dash; Legs a jump; Hands a cone; Arms a push; Battery 2 and 3 a combo. A1 (any write-off) is played on foot. Monument: ' + mon + (off.length ? ': off ' + off.join(', ') : ''));
}
{ // Edit 92: Narrative A, Certified
  const titles = D.map((d) => d.order.map((t) => d.tiles[t].title).join('|')).join(' / ');
  const want = 'The welcome wall|The podium bridge|The LED drum|The portal tower|The monument|The neon shops|The stacked cubes|The LED canyon|The LED gateway / The lantern pavilion|The amphitheatre|The arch and the roundabout|The obelisk court|The belvedere|The dome by the canal|The reservoir terraces|The cascade|The ring over the pools / The west portal|The tunnel portal|The east portal|The east beach terrace|The east customs post|The stilt houses|The west customs post|The west beach terrace|The circus';
  const tales = D.flatMap((d) => d.order.map((t) => d.tiles[t].tale)), long = Math.max(...tales.map((q) => q.length)), DT = STORY.DATA;
  ok(titles === want && D.map((d) => d.act).join() === 'ACT I · INDUCTION,ACT II · OPENING DAY,ACT III · CUSTOMS' && tales.every((q) => !/!/.test(q) && q.split(' ').length >= 25) && long <= 230 && /^Narrative A, Certified/.test(DT.meta.status) && /^Your model has passed\. It will now be manufactured\./.test(DT.ending) && /ZERO ACCIDENTS \(EXCLUDING TESTS\)/.test(D[2].tiles.B2.tale) && /WELCOME/.test(D[0].tiles.A1.tale) && /DESTRUCTIVE TESTING/.test(D[0].tiles.C3.tale),
    `Narrative A, Certified: acts ${D.map((d) => d.act).join(', ')}; 27 tales in Farsight's voice (no exclamation marks; the longest ${long} characters, five lines on the card); renamed: The welcome wall, The neon shops, The dome by the canal, The east and west customs posts; the ending: "${DT.ending.slice(0, 52)}…"`);
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
{ // Edit 91: Story starts on foot (no dash, one charge, damage.bodyHealthOnFoot); Arcade ships with Battery 1 (the dash, one charge)
  const a = new STORY.ArcadeSim('parkland', {}, null, { warm: 0 }), pr0 = STORY.newProgress(), st = new STORY.StorySim('monument', {}, pr0, { warm: 0 });
  const legsEtc = (s) => ['legs', 'hands', 'arms'].every((t) => s.tier(t) === 0) && !s.has('jump') && !s.has('carry') && !s.has('push');
  const n0 = st.events.length; st.continueBrief(); st.step({ aPress: true }); const den = st.events.slice(n0).find((e) => e.type === 'denied');
  ok(legsEtc(a) && legsEtc(st) && a.tier('battery') === 1 && a.dashFitted() && st.tier('battery') === 0 && !st.dashFitted() && den && den.action === 'lunge' && den.why === 'locked' && a.capacity() === REG['abilities.battery.dashCharges'] && st.capacity() === REG['abilities.battery.dashCharges'] && st.body.health === REG['damage.bodyHealthOnFoot'] && st.maxHealth() === REG['damage.bodyHealthOnFoot'] && a.body.health === REG['damage.bodyHealth'] && a.secondsPerCharge() === REG['battery.secondsPerCharge'] && a.P['proto.recoilScale'] === 0.7 && REG['proto.batteryModel'] === 1,
    `Story starts on foot: no dash (A denied: "${den && den.why}"), ${st.capacity()} charge, ${st.body.health} health (damage.bodyHealthOnFoot; damage.bodyHealth ${REG['damage.bodyHealth']}). Arcade ships with Battery 1: the dash, ${a.capacity()} charge (abilities.battery.dashCharges), ${a.secondsPerCharge()} s; no other part`);
  const b2 = new STORY.ArcadeSim('parkland', {}, { owned: { battery1: true, battery2: true } }, { warm: 0 }), b3 = new STORY.ArcadeSim('parkland', {}, { owned: { battery1: true, battery2: true, battery3: true } }, { warm: 0 });
  ok(b2.capacity() === REG['battery.capacity'] && b2.secondsPerCharge() === REG['battery.secondsPerCharge'] && b3.capacity() === REG['battery.capacity'] && b3.secondsPerCharge() === REG['abilities.battery.level3Seconds'] && /dash/i.test(b2.nodes().battery1.desc) && /second charge/i.test(b2.nodes().battery2.desc),
    `Battery 2 the second charge (${b2.capacity()}, battery.capacity); Battery 3 the faster recharge (${b3.secondsPerCharge()} s, abilities.battery.level3Seconds). "${b2.nodes().battery1.desc}"`);
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
  Object.assign(s.body, { x: W - 60, y: s.body.y, vx: 0, vy: 0, mode: 'idle', charge: 3 }); for (const n of ['battery1', 'legs1', 'legs2', 'legs3']) s.run.owned[n] = true;
  for (let i = 0; i < 90; i++) { s.step(i === 0 ? { mx: 1, my: 0, aPress: true } : i === 6 ? { mx: 1, my: 0, bPress: true } : { mx: 1, my: 0 }); settle(s); }
  ok(s.screenName() === 'A1' && s.body.x <= W - R + 1e-6, `a dash jump at the fence is held too: x ${s.body.x.toFixed(0)}; still A1 (fences cannot be jumped)`);
  for (const n of ['battery1', 'legs1', 'legs2', 'legs3']) delete s.run.owned[n];
  // a real write-off on foot: a sedan drives into the standing body
  const c = car(s, 'sedan', 150, 320, 0, 140); s.fakes.push(c); s.buildView();
  Object.assign(s.body, { x: 300, y: 320, px: 300, py: 320, vx: 0, vy: 0, mode: 'idle', charge: 1, health: 30, facing: 0, level: 0, floor: null });
  for (let i = 0; i < 120 && s.body.alive; i++) { c.x += c.vx / 60; s.step({}); }
  settle(s); s.fakes.length = 0; const cnt = ev(s, 'story-count')[0], cl = ev(s, 'story-clear')[0], rs0 = s.report && s.report.story;
  ok(cnt && cnt.n === 1 && cnt.need === REG['story.writeOffs.monument.A1'] && cnt.kind === 'struck' && cl && cl.next === 'B1' && rs0.cleared && s.run.credits === 0 && rs0.parts === 0 && rs0.nextGift && rs0.nextGift.node === 'battery1' && rs0.nextGift.tile === 'B1' && typeof rs0.level !== 'object' && rs0.levelBefore === undefined,
    `on foot, struck by a sedan: the write-off clears A1 (${cnt ? cnt.n + ' of ' + cnt.need : '—'}); no credits, no level; the report: ${rs0.parts} parts, next ${rs0.nextGift.node} at ${rs0.nextGift.district} ${rs0.nextGift.tile}`);
  s.continueReport(); const skip = ev(s, 'shop-skip').length === 1, fy = ev(s, 'story-ferry')[0], rs = s.rescue, h0 = s.body.health;
  ok(skip && fy && fy.from === 'A1' && fy.to === 'B1' && fy.side === 'E' && fy.gift === 'battery1' && rs && rs.ferry && s.body.mode === 'rescue' && s.phase !== 'shop', 'no shop in Story: a Farsight drone comes for the new chassis, carrying Battery 1, to take it east from A1 to B1');
  const seen = []; runTo(s, (q) => { const p = q.rescue && q.rescue.phase; if (p && seen[seen.length - 1] !== p) seen.push(p); return q.phase === 'gift'; });
  const gv = ev(s, 'gift')[0];
  ok(gv && gv.node === 'battery1' && seen.join('>') === 'inbound>give>lift' && s.dashFitted() && h0 === REG['damage.bodyHealthOnFoot'] && s.body.health === REG['damage.bodyHealth'] && s.capacity() === REG['abilities.battery.dashCharges'],
    `the drone lowers Battery 1 onto the chassis (${seen.join(' › ')}): the dash; health ${h0} → ${s.body.health} (the difference added)`);
  const k0 = s.rescue.k; for (let i = 0; i < 120; i++) s.step({});
  ok(s.phase === 'gift' && s.rescue.k === k0, 'the gift screen holds the world: 2 s later, still phase gift, the drone waiting');
  s.continueGift();
  let scr = []; for (let i = 0; i < 2400 && s.phase !== 'brief'; i++) { s.step({}); if (scr[scr.length - 1] !== s.screenName()) scr.push(s.screenName()); }
  const fd = ev(s, 'story-ferried')[0], dep = s.body.x;
  ok(s.phase === 'brief' && s.screenName() === 'B1' && scr.join() === 'A1,B1' && fd && dep >= R + 24 && dep <= REG['story.ferryDepth'] && offRoad(s) && s.body.level === 0 && s.body.mode === 'idle' && s.task().kind === 'dash',
    `the drone carries it over the edge into B1 and sets it down off the road, ${dep.toFixed(0)} in from the west edge it crossed (≤ story.ferryDepth ${REG['story.ferryDepth']}), in ${fd ? fd.seconds : '—'} s; B1's card asks for the part just fitted: DASH INTO A CAR`);
  ok(s.fenceSides().join() === 'E,S', `in B1, the fences hold toward C1 and B2 (${s.fenceSides().join(', ')}); the edge back to cleared A1 stays open`);
  s.continueBrief();
  { // B1 wants a dash. A fatal hit standing still misses the brief: the chassis holds at story.missFloor and plays on
    const c2 = car(s, 'sedan', 150, 320, 0, 140); s.fakes.push(c2); s.buildView();
    Object.assign(s.body, { x: 300, y: 320, px: 300, py: 320, vx: 0, vy: 0, mode: 'idle', charge: 1, health: 30, facing: 0, level: 0, floor: null });
    const n0 = s.events.length; for (let i = 0; i < 120 && !s.events.slice(n0).some((q) => q.type === 'impact'); i++) { c2.x += c2.vx / 60; s.step({}); } for (let i = 0; i < 30; i++) { s.step({}); settle(s); }
    const e = s.events.slice(n0), hd = e.find((q) => q.type === 'held'), im = e.find((q) => q.type === 'impact'); s.fakes.length = 0; s.buildView();
    ok(hd && im && im.held && im.kind === 'struck' && im.lost === 29 && s.body.alive && s.body.health === REG['story.missFloor'] && !e.some((q) => q.type === 'writeoff') && s.phase === 'play' && pr.tileWO === 0,
      `struck standing in B1 (it wants a dash): the fatal hit holds the chassis at ${s.body.health} (story.missFloor), losing ${im ? im.lost : '—'} of 30; no write-off; play goes on`);
  }
  kill(s, { kind: 'struck' }); const miss = ev(s, 'story-miss')[0];
  ok(miss && miss.why === 'task' && pr.tileWO === 0 && s.run.credits === 0, 'a write-off forced off the brief still scores and counts for nothing');
  next(s);
  Object.assign(s.body, { x: 40, y: 224, vx: 0, vy: 0, mode: 'idle' }); walk(s, -1, 0, 120); const back = s.screenName();
  kill(s); const old = ev(s, 'story-miss').slice(-1)[0];
  ok(back === 'A1' && old && old.why === 'cleared' && !s.hitFloor({ kind: 'struck', cls: 'sedan', combo: 1, level: 0 }), `cleared tiles stay open: back in ${back} from B1 in test; a write-off there scores, counts for nothing; no floor there`);
  s.continueReport(); const shop = s.phase, pB = s.canBuy('battery2'), pL = s.canBuy('legs1'); s.buy('legs1');
  ok(shop === 'play' && !pB.ok && pB.why === 'gift at Parkland B2' && !pL.ok && pL.why === 'gift at Monument B3' && !s.has('jump') && s.run.credits === 0 && !s.rescue && s.screenName() === 'A1' && !ev(s, 'level-up').length,
    `no level, no workshop: the report goes straight to the next chassis; nothing for sale ("${pB.why}", "${pL.why}")`);
  Object.assign(s.body, { x: W - 40, y: 224, vx: 0, vy: 0, mode: 'idle' }); walk(s, 1, 0, 120);
  { // a real dash write-off in B1: the part just fitted meets its first brief
    const c3 = car(s, 'sedan', 380, 320, Math.PI / 2, 0); s.fakes.push(c3); s.buildView();
    Object.assign(s.body, { x: 300, y: 320, px: 300, py: 320, vx: 0, vy: 0, mode: 'idle', charge: 1, health: 30, facing: 0, level: 0, floor: null });
    for (let i = 0; i < 60 && s.body.alive; i++) { s.step(i === 1 ? { mx: 1, my: 0, aPress: true } : {}); } settle(s); s.fakes.length = 0; s.buildView();
  }
  const cb1 = ev(s, 'story-count').slice(-1)[0];
  ok(s.screenName() === 'B1' && cb1 && cb1.kind === 'dash' && pr.done.monument.join() === 'A1,B1' && s.report.story.cleared && s.report.story.parts === 1 && s.report.story.nextGift.node === 'hands1' && s.report.story.nextGift.tile === 'A2',
    `walked back into B1, a dash into a parked sedan writes the chassis off and clears B1; 1 part fitted; next, Hands 1 at Monument A2`);
  s.continueReport(); const fy2 = ev(s, 'story-ferry').slice(-1)[0], seen2 = [];
  runTo(s, (q) => { const p = q.rescue && q.rescue.phase; if (p && seen2[seen2.length - 1] !== p) seen2.push(p); return q.phase === 'brief'; });
  ok(fy2 && fy2.to === 'C1' && !fy2.gift && !seen2.includes('give') && s.screenName() === 'C1' && s.phase === 'brief' && offRoad(s) && !s.rescue && s.task().kind === 'drop' && !s.has('jump'),
    'B1 to C1: the drone carries the chassis with no part (' + seen2.join(' › ') + '); C1\'s card: DROP ONTO A CAR, from the high road\'s gap');
  const own0 = JSON.stringify(s.run.owned); s.continueBrief(); s.run.points = 1e6; kill(s, { kind: 'drop' });
  ok(JSON.stringify(s.run.owned) === own0 && !ev(s, 'level-up').length && s.report.story.parts === 1 && s.run.credits === 0,
    `points are the score: a million points fit nothing (${Object.keys(s.run.owned).join(', ')}); parts come only by drone`);
  ok(pr.done.monument.join() === 'A1,B1,C1' && pr.owned.battery1 && !pr.owned.legs1 && pr.points === s.run.points && !pr.credits, 'progress follows the run (tiles, parts, points): one plain object the page saves');
  const old7 = Object.assign(STORY.newProgress(), { done: { monument: ['A1', 'B1', 'C1', 'C2', 'B2'] }, owned: { legs1: true, battery2: true }, gifts: { 'monument:C1': true } }), s7 = story('monument', old7);
  ok(s7.has('jump') && s7.dashFitted() && s7.tier('battery') === 2 && old7.owned.battery1 && s7.screenName() === 'A2' && s7.rescue && s7.rescue.gift === 'hands1',
    'a 7.9 save catches up: cleared B1\'s Battery 1 is on the body; what it owned stays (Legs 1, Battery 2); A2\'s Hands 1 still comes by drone');
}
function num(v) { return Math.round(v).toLocaleString('en-GB'); }
{ // the end of a district, the next one, the certificate
  const pr = STORY.newProgress(); pr.done.monument = ['A1', 'B1', 'C1', 'C2', 'B2', 'A2', 'A3', 'B3']; pr.tileWO = REG['story.writeOffs.monument.C3'] - 1; pr.credits = 0;
  const s = story('monument', pr);
  ok(s.screenName() === 'C3' && !s.rescue && s.phase === 'brief' && s.has('jump') && s.has('carry') && !s.has('push') && s.task().kind === 'bounce',
    'a saved story resumes on the tile in test, Monument C3 (8 cleared): Legs 1 and Hands 1 on the body from their tiles; no part owed; C3\'s card, THROWN INTO A CAR');
  s.continueBrief(); kill(s, { kind: 'bounce' });
  ok(s.report.roadCleared && s.report.story.districtDone && pr.district === 'parkland', 'clearing C3 clears Monument; the story moves on to Parkland');
  s.continueReport(); s.leaveShop();
  ok(s.phase === 'next' && !s.rescue, 'after the report, the page builds the next district (phase next); no ferry between districts');
  const p2 = story('parkland', pr), cr = p2.run.credits;
  const g2 = p2.rescue && p2.rescue.gift; runTo(p2, (q) => q.phase === 'gift'); p2.continueGift(); runTo(p2, (q) => q.phase === 'brief');
  ok(p2.screenName() === 'C1' && p2.fenceSides().join() === 'S,W' && g2 === 'arms1' && p2.has('push') && p2.task().kind === 'push' && p2.capacity() === REG['abilities.battery.dashCharges'] && cr === 0 && p2.run.points === pr.points,
    'Parkland opens on C1, fenced toward C2 and B1; a drone brings Arms 1, and C1 asks for it: PUSH OFF A CAR; the points carry over');
  const p3 = STORY.newProgress(); p3.district = 'waterfront'; p3.done = { monument: D[0].order.slice(), parkland: D[1].order.slice(), waterfront: ['A1', 'B1', 'C1', 'C2', 'C3', 'B3', 'A3', 'A2'] }; p3.tileWO = REG['story.writeOffs.waterfront.B2'] - 1;
  const s3 = story('waterfront', p3), mon = s3.W6.at(1, 1).dummyMonument, prop = s3.W6.at(1, 1).props.find((q) => q.bldg === 'dummy monument'), g3 = s3.rescue && s3.rescue.gift;
  runTo(s3, (q) => q.phase === 'gift'); s3.continueGift(); runTo(s3, (q) => q.phase === 'brief'); s3.continueBrief(); kill(s3, { combo: 5 });
  const fin = s3.phase; s3.continueUnveil(); runTo(s3, (q) => q.phase === 'ending', 4800); // Edit 94: the unveiling, then the voyage, then the ending
  ok(fin === 'unveil' && s3.screenName() === 'B3' && s3.run.ending && s3.run.ending.kind === 'Certified' && p3.complete && STORY.clearedCount(p3) === 27 && STORY.partsOwned(p3.owned) === 11 && g3 === 'battery3', 'the last tile, Waterfront B2 (the circus): its drone brings Battery 3; the Test City is certified (27 of 27) after the unveiling and the voyage to B3; all 11 parts on the body');
  const six = new W6.Sim6('waterfront', {}, null, { warm: 0 }).W6.at(1, 1);
  ok(mon && mon.cx === 400 && mon.cy === 320 && prop && prop.spr.h > 80 && !six.dummyMonument, `the DUMMY MONUMENT stands on the circus's island (world.dummyMonument): at ${mon ? mon.cx + ', ' + mon.cy : '—'}, ${prop ? prop.spr.w + ' × ' + prop.spr.h : '—'} art px; 6.x worlds have none`);
}
{ // Edit 94: the finale (D76, row 533), built by the coding agent (coder/, run 20261029-105801), reviewed by hand
  const regFile = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'content', 'params', 'tuning.parameters.json'), 'utf8')), byId = new Map(regFile.entries.map((e) => [e.id, e]));
  ok(STORY.P7SIM['world.monumentShroud'] === 1 && byId.get('world.monumentShroud').default === 0 && REG['ui.finale.unveilSeconds'] === byId.get('ui.finale.unveilSeconds').default && REG['ui.finale.unveilSeconds'] === REG['ui.gift.holdSeconds'],
    `the finale's IDs: world.monumentShroud (registry 0, P7SIM 1); ui.finale.unveilSeconds ${REG['ui.finale.unveilSeconds']} s, the gift screen's hold`);
  const at = (t) => story('waterfront', Object.assign(STORY.newProgress(), { district: 'waterfront', done: { monument: D[0].order.slice(), parkland: D[1].order.slice(), waterfront: D[2].order.slice(0, D[2].order.indexOf(t)) } }));
  const a1 = at('A1'), b2 = at('B2'), ar = new STORY.ArcadeSim('waterfront', {}, null, { warm: 0 }), sx = new W6.Sim6('waterfront', {}, null, { warm: 0 });
  ok(a1.monumentShrouded() && b2.monumentShrouded() && !(ar.monumentShrouded && ar.monumentShrouded()) && !sx.W6.at(1, 1).dummyMonument && b2.W6.at(1, 1).dummyMonument.shroud && b2.W6.at(1, 1).dummyMonument.shroud.h === b2.W6.at(1, 1).props.find((q) => q.bldg === 'dummy monument').spr.h,
    'the monument is shrouded in Story from Waterfront A1 until B2 clears (the cloth on the statue\'s own outline); Arcade\'s stands uncovered; 6.10 has none');
  const pr = Object.assign(STORY.newProgress(), { district: 'waterfront', done: { monument: D[0].order.slice(), parkland: D[1].order.slice(), waterfront: D[2].order.slice(0, 8) }, tileWO: REG['story.writeOffs.waterfront.B2'] - 1, points: 412350, chassis: 33, t: 5420, bestCombo: 4 });
  const s = story('waterfront', pr); runTo(s, (q) => q.phase === 'gift'); s.continueGift(); runTo(s, (q) => q.phase === 'brief'); s.continueBrief();
  const b = s.body; b.hits.push({ kind: 'dash', cls: 'sedan', combo: 5, cause: null }); b.health = 0; s.writeOff(); s.checkTerminal();
  const wo = s.phase + '>' + s.pendingPhase, saved = pr.complete; settle(s);
  const pl = s.unveil && s.unveil.plaque, ue = ev(s, 'unveil');
  ok(wo === 'writeoff>unveil' && saved && s.phase === 'unveil' && ue.length === 1 && pl && pl.chassis === pr.chassis && pl.points === pr.points && pl.bestCombo === 5 && pr.bestCombo === 5 && pl.t === pr.t && !s.monumentShrouded(),
    `the B2 clear: the write-off plays (${wo}), the story is saved complete (the CERTIFIED stamp), then phase unveil; the plaque: chassis ${pl && pl.chassis}, points ${pl && pl.points}, best combo ×${pl && pl.bestCombo} (the last hit beat the saved ×4), time ${pl && pl.t} s`);
  const t0 = s.t; for (let i = 0; i < 120; i++) s.step({});
  ok(s.phase === 'unveil' && s.t === t0, 'the unveiling holds the world, as the gift screen does, until A');
  s.continueUnveil(); const v0 = s.phase, rv = s.rescue && s.rescue.voyage, ve = ev(s, 'voyage')[0];
  const seen = []; runTo(s, (q) => { const ph = q.rescue && q.rescue.phase; if (ph && seen[seen.length - 1] !== ph) seen.push(ph); return q.phase === 'ending'; }, 4800);
  const end = ev(s, 'voyage-end')[0], ship = s.W6.at(1, 2).containerShip;
  ok(v0 === 'voyage' && rv && ve && ve.from === 'B2' && ve.to === 'B3' && seen.join('>') === 'inbound>lift>carry>in>drop' && end && end.tile === 'B3' && s.screenName() === 'B3' && Math.abs(s.body.x - ship.x) < 1 && Math.abs(s.body.y - ship.y) < 1 && s.run.ending.kind === 'Certified',
    `A on the plaque: a Farsight drone lifts the dummy from B2 (${seen.join(' › ')}), carries it over the edge to Waterfront B3 and sets it down on the container ship (${Math.round(s.body.x)}, ${Math.round(s.body.y)}) in ${end ? end.seconds : '—'} s; then the Certified ending`);
  ok(ship && ship.face && ship.crates === 24 && !sx.W6.at(1, 2).containerShip, `every crate on the ship carries the dummy's face (${ship && ship.crates} crates, world.storyArt); 6.10's river has no ship`);
  const a = new STORY.ArcadeSim('waterfront', {}, null, { warm: 0 }); for (let i = 0; i < 300; i++) a.step({});
  ok(!ev(a, 'unveil').length && !ev(a, 'voyage').length && a.phase !== 'unveil' && a.phase !== 'voyage', 'Arcade has no finale: no unveiling, no voyage');
}
{ // Edit 91: Arcade sells every part for credits; no drone brings anything
  const a = new STORY.ArcadeSim('monument', {}, null, { warm: 0 }), bought = [];
  for (let k = 0; k < 2; k++) {
    a.body.hits.push({ kind: 'dash' }); a.body.health = 0; a.writeOff(); a.checkTerminal(); settle(a); a.continueReport();
    const n = ['legs1', 'hands1'][k], chk = a.canBuy(n); if (chk.ok) { a.buy(n); bought.push(n + ' ' + chk.price); } a.leaveShop();
  }
  ok(bought.join() === 'legs1 ' + REG['economy.price.ability.level1'] + ',hands1 ' + REG['economy.price.ability.level1'] && a.has('jump') && a.has('carry') && !a.rescue && !ev(a, 'arcade-deliver').length && !ev(a, 'gift').length,
    `Arcade: a credit a body buys the verbs in the workshop (${bought.join(', ')} credit); no drone, no gift screen`);
}
{ // Edit 90: a dash's jump is free (battery.dashJumpCost 0); X taps a cone down when none is in reach (abilities.hands.tapDrop 1)
  const dj = (sim) => { if (sim.continueBrief) sim.continueBrief(); sim.run.owned.legs1 = true; sim.run.owned.battery1 = true; Object.assign(sim.body, { x: 300, y: 200, vx: 0, vy: 0, mode: 'idle', charge: 1, level: 0, floor: null, landT: 0 }); const n0 = sim.events.length;
    for (let i = 0; i < 40; i++) sim.step(i === 0 ? { mx: 1, my: 0, aPress: true } : i === 8 ? { mx: 1, my: 0, bPress: true } : { mx: 1, my: 0 });
    const e = sim.events.slice(n0); return { jump: e.some((q) => q.type === 'jump' && q.kind === 'dash'), denied: (e.find((q) => q.type === 'denied' && q.action === 'jump') || {}).why || null }; };
  const sj = dj(new STORY.StorySim('monument', {}, STORY.newProgress(), { warm: 0 })), aj = dj(new STORY.ArcadeSim('monument', {}, null, { warm: 0 })), oj = dj(new W6.Sim6('monument', {}, null, { warm: 0, single: true }));
  ok(sj.jump && aj.jump && !oj.jump && oj.denied === 'charge' && REG['battery.dashJumpCost'] === 0,
    `one charge left: dash, then B: a dash jump in Story and Arcade (battery.dashJumpCost ${REG['battery.dashJumpCost']}); 6.10's rules deny it ("${oj.denied}")`);
  const cone = (sim) => { if (sim.continueBrief) sim.continueBrief(); sim.run.owned.hands1 = true; const b = sim.body, c = (sim.cones || []).find((q) => q.state === 'free');
    if (!c) return { skip: true }; Object.assign(b, { x: c.x + 10, y: c.y, vx: 0, vy: 0, mode: 'idle', level: c.level || 0, floor: c.floor != null ? c.floor : null });
    sim.step({ xPress: true, xHeld: true }); sim.step({}); const held = !!b.held;
    Object.assign(b, { x: c.x + 160, y: c.y, vx: 0, vy: 0, mode: 'idle' }); sim.step({ xPress: true, xHeld: true }); sim.step({}); const after = !!b.held;
    return { held, after }; };
  const sc = cone(new STORY.StorySim('monument', {}, Object.assign(STORY.newProgress(), { done: { monument: ['A1', 'B1', 'C1', 'C2', 'B2'] }, owned: { legs1: true, hands1: true }, gifts: { 'monument:C1': true, 'monument:A2': true } }), { warm: 0 })), oc = cone(new W6.Sim6('monument', {}, null, { warm: 0, single: true }));
  ok(sc.skip || (sc.held && !sc.after && oc.held && oc.after && REG['abilities.hands.tapDrop'] === 1),
    `Hands 1: a tap picks a cone up; away from cones, a tap puts it down (abilities.hands.tapDrop ${REG['abilities.hands.tapDrop']}) ${JSON.stringify(sc)}; 6.10 keeps the hold (a tap leaves it held: ${JSON.stringify(oc)})`);
}
{ // Arcade: one district a run
  const s = new W6.Sim6('parkland', {}, null, { warm: 0, single: true });
  for (let k = 0; k < s.quota; k++) { s.body.hits.push({ kind: 'dash' }); s.body.health = 0; s.writeOff(); s.checkTerminal(); settle(s); if (s.phase === 'report') { s.continueReport(); s.leaveShop(); } }
  ok(s.isFinal && s.run.ending && s.run.ending.kind === 'Licensed', `Arcade plays one district a run: Parkland's ${s.quota} write-offs end it, Licensed (no carry to the next district)`);
  const a = new W6.Sim6('parkland', {}, null, { warm: 0, single: true }); a.body.hits.push({ kind: 'dash' }); a.body.health = 0; a.writeOff(); a.checkTerminal(); settle(a); a.continueReport();
  ok(a.run.credits === REG['economy.creditsPerWriteOff'] && a.phase === 'shop' && a.canBuy('legs1').price === REG['economy.price.ability.level1'], `Arcade keeps its prices: ${REG['economy.price.ability.level1']}, ${REG['economy.price.ability.level2']}, ${REG['economy.price.ability.level3']} (economy.price.ability.*), a credit a body (economy.creditsPerWriteOff)`);
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
  ok(list.every(same) && p7 && ['dummies_p7_1.html', 'dummies_p7_2.html', 'dummies_p7_3.html', 'dummies_p7_4.html', 'dummies_p7_5.html', 'dummies_p7_6.html', 'dummies_p7_7.html', 'dummies_p7_8.html', 'dummies_p7_9.html', 'dummies_p7_10.html', 'dummies_p7_11.html', 'dummies_p7_12.html'].every(p7f), 'dummies_p6_4.html to dummies_p6_10.html and dummies_p7.html to dummies_p7_12.html are byte-identical to their commits (the shared code builds P7.13)');
}
{ // Edit 92: the story's tile art is cosmetic only, and only on its nine tiles
  const sig = (sc) => { const g = sc.game; return JSON.stringify({ st: g.statics.map((q) => [q.x, q.y, q.w, q.h, q.kind, q.jumpable || 0]), fl: g.floors.map((f) => [f.kind, f.z, f.x, f.y, f.w, f.h]), stairs: g.stairs.map((q) => [q.x, q.y, q.w, q.h, q.z]), sz: g.solidsZ, sp: g.spawns.map((q) => [q.x, q.y, q.level]), cones: g.coneHomes }); };
  const PIX = globalThis.PIX, pic = (sc) => { const FB = new PIX.Buf(PIX.AW, PIX.AH), DL = new PIX.Buf(PIX.AW, PIX.AH); W6.compose(sc, FB, DL, { cars: [] }); return Buffer.from(FB.d.buffer).toString('base64'); };
  const geo = [], drawn = [];
  for (const d of D) { const acc = { dropGaps: 1, flightsMin: 1, coneVisible: 0.9, monument: 1 }, a = W6.buildWorld(d.id, { access: acc }), b = W6.buildWorld(d.id, { access: Object.assign({ storyArt: 1 }, acc) });
    a.scs.forEach((sc, i) => { const t = STORY.nameOf(sc.col, sc.row); if (sig(sc) !== sig(b.scs[i])) geo.push(d.id + ' ' + t); if (pic(sc) !== pic(b.scs[i])) drawn.push(d.name + ' ' + t); }); }
  const wantArt = 'Parkland C1,Parkland B1,Waterfront B3,Waterfront A3,Waterfront C3,Monument A1,Monument A2,Monument A3,Monument C3';
  ok(!geo.length && drawn.slice().sort().join() === wantArt.split(',').sort().join() && REG['world.storyArt'] === 1,
    'the story\'s tile art (world.storyArt) changes no solid, floor, stair, spawn or cone home anywhere' + (geo.length ? ' [changed: ' + geo.join(', ') + ']' : '') + '; it draws on nine tiles only: ' + drawn.join(', '));
}
// ---------- 4. the page
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('SKIP browser checks: playwright not found'); return done(); }
  const url = 'file://' + path.join(__dirname, 'dummies_p7_13.html');
  const br = await chromium.launch(), logs = [];
  const watch = (pg) => pg.on('pageerror', (e) => logs.push(e.message));
  const shot = async (pg, name) => { if (OUT) await pg.screenshot({ path: path.join(OUT, name) }); };
  const wait = async (pg, fn, ms) => { for (let i = 0; i < (ms || 20000) / 100; i++) { if (await pg.evaluate(fn)) return true; await pg.waitForTimeout(100); } return false; };
  const ctx = await br.newContext({ viewport: { width: 1300, height: 900 } }), pg = await ctx.newPage(); watch(pg);
  await pg.goto(url); await pg.waitForTimeout(1200);
  const t0 = await pg.evaluate(() => ({ screen: window.__dummies.screen, status: document.getElementById('status').textContent }));
  await shot(pg, 'p713_title.png');
  ok(t0.screen === 'title' && /^P7\.13 /.test(t0.status), 'the title offers two modes, ARCADE and STORY (build ' + t0.status.split(' ')[0] + ')');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(300);
  const a1 = await pg.evaluate(() => window.__dummies.screen); await shot(pg, 'p713_arcade.png');
  await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('Space');
  const a2 = await wait(pg, () => window.__dummies.sim && window.__dummies.sim.phase === 'play', 30000);
  const a3 = await pg.evaluate(() => { const s = window.__dummies.sim; return { id: s.levelId, final: s.isFinal, story: !!s.storyMode }; });
  ok(a1 === 'arcade' && a2 && a3.id === 'waterfront' && a3.final && !a3.story, `ARCADE: pick a district (${a3.id}); it plays alone, as 6.10 plays it`);
  const ah = await pg.evaluate(() => window.__dummiesUI.hud());
  ok(ah.score.rows === 'POINTS CARS LEFT' && ah.score.y + ah.score.h <= ah.body.y && ah.chassis.y === ah.body.y && ah.score.x + ah.score.w === 1264, `Arcade: ${ah.score.rows}, small, top right above the boxes (CARS LEFT kept: the shift's clock); the chassis on the top edge`);
  const ao = await pg.evaluate(() => window.__dummiesUI.objective(window.__dummies.sim));
  await pg.evaluate(() => { const s = window.__dummies.sim, b = s.body; b.hits.push({ kind: 'dash', cls: 'van', combo: 1, assessed: 120, lost: 30, angle: 90, model: 'VAN-02' }); b.health = 0; s.writeOff(); s.checkTerminal(); });
  await wait(pg, () => window.__dummies.sim.phase === 'report', 8000); await pg.keyboard.press('Space'); await pg.waitForTimeout(300);
  const aw = await pg.evaluate(() => ({ phase: window.__dummies.sim.phase, w: window.__dummiesUI.hud().workshop })); await shot(pg, 'p713_arcade_workshop.png');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(200); await pg.keyboard.press('ShiftLeft'); await pg.waitForTimeout(400);
  const ag = await pg.evaluate(() => { const s = window.__dummies.sim; return { phase: s.phase, legs: s.has('jump'), dash: s.dashFitted(), credits: s.run.credits, rescue: !!s.rescue, ob: window.__dummiesUI.objective(s) }; });
  ok(/^Write off 3 bodies \(0 of 3\)\.$/.test(ao ? ao[1] : '') && aw.phase === 'shop' && aw.w.sel === 'legs' && aw.w.pill === '1 CREDIT' && ag.phase === 'play' && ag.legs && ag.dash && ag.credits === 0 && !ag.rescue,
    `Arcade: "${ao ? ao[1] : ''}"; after a write-off the workshop opens on Legs (one credit buys Legs 1; Battery 1 shipped fitted); A fits it, DONE deploys; no drone`);
  { // Edit 85: Waterfront A2's bridge: the new flight up from the beach; the gaps over the avenue
    await pg.evaluate(() => { const s = window.__dummies.sim; s.enter(s.W6.at(0, 1)); Object.assign(s.body, { x: -500, y: -500 }); }); await pg.waitForTimeout(500); await shot(pg, 'p713_bridge_flight.png');
    const fl = await pg.evaluate(() => { const g = window.__dummies.sim.W6.at(0, 1).game, f = g.floors.find((q) => q.kind === 'deck'); return { flights: g.stairs.filter((q) => q.head === f.i).length, gaps: (f.layer.gapSpans || []).length }; });
    ok(fl.flights === 1 && fl.gaps >= 2, `in the page, Waterfront A2's bridge has a flight up from the beach (${fl.flights}) and ${fl.gaps} drop gaps`);
    await pg.evaluate(() => { const s = window.__dummies.sim; s.enter(s.W6.at(1, 1)); s.buildView(); }); await pg.waitForTimeout(500); await shot(pg, 'p713_monument.png');
    for (const [c, r, f] of [[1, 2, 'p713_ship.png'], [0, 2, 'p713_customs.png']]) { await pg.evaluate(([c2, r2]) => { const s = window.__dummies.sim; s.enter(s.W6.at(c2, r2)); s.buildView(); }, [c, r]); await pg.waitForTimeout(400); await shot(pg, f); } // Edit 92
    await pg.evaluate(() => { const s = window.__dummies.sim; s.enter(s.W6.at(1, 1)); s.buildView(); });
    const mn = await pg.evaluate(() => { const sc = window.__dummies.sim.W6.at(1, 1); return { m: sc.dummyMonument, solid: sc.game.statics.some((q) => q.kind === 'sculpture' && q.x <= 360 && q.x + q.w >= 440) }; });
    ok(mn.m && mn.m.cx === 400 && mn.m.cy === 320 && mn.solid, 'Edit 91: the DUMMY MONUMENT on the circus\'s island, Waterfront B2: the dummy in stone, three times life, on a pedestal; solid to the body');
  }
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);
  for (let i = 0; i < 6; i++) await pg.keyboard.press('ArrowDown'); // Edit 86: Quit to title, past Options and Controls
  await pg.keyboard.press('Space'); await pg.waitForTimeout(200);
  await pg.keyboard.press('ArrowRight'); await pg.keyboard.press('Space'); await pg.waitForTimeout(300);
  const sv0 = await pg.evaluate(() => ({ screen: window.__dummies.screen, sel: window.__dummies.saveSel, saves: window.__dummiesUI.saves() }));
  await shot(pg, 'p713_saves_empty.png');
  ok(sv0.screen === 'saves' && sv0.sel === 0 && sv0.saves.length === 3 && sv0.saves.every((v) => !v), 'Edit 88: STORY opens the save screen: NEW GAME and three empty slots (story.saveSlots)');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(150);
  const ne0 = await pg.evaluate(() => window.__dummies.nameEntry);
  await shot(pg, 'p713_name_new.png');
  await pg.keyboard.type('Crash-Tester 7000'); await pg.waitForTimeout(100);
  const ne1 = await pg.evaluate(() => window.__dummies.nameEntry.text); await shot(pg, 'p713_name_typed.png');
  await pg.keyboard.press('Enter'); await pg.waitForTimeout(400);
  const m = await pg.evaluate(() => ({ screen: window.__dummies.screen, story: window.__dummies.story, slot: window.__dummies.slot, s1: JSON.parse(localStorage.getItem('dummies.p7.save1') || 'null') }));
  ok(ne0 && ne0.slot === 1 && ne0.text === 'TEST DUMMY 1' && ne0.fresh && ne1 === 'CRASH-TESTER' && m.slot === 1 && m.s1 && m.s1.name === 'CRASH-TESTER' && Math.abs(m.s1.saved - Date.now()) < 60000,
    `NEW GAME takes slot 1 and asks its name ("${ne0 && ne0.text}" offered); typing replaces it, upper case, ${ne1.length} of story.saveNameMax (12) characters: "${ne1}"; OK saves the slot with a time stamp`);
  await shot(pg, 'p713_map.png');
  ok(m.screen === 'storymap' && m.story && m.story.district === 'monument', 'STORY: the map of the Test City, headed with the slot\'s name; only Monument A1 is revealed');
  await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(150); await shot(pg, 'p713_map_hidden.png'); await pg.keyboard.press('ArrowLeft');
  await pg.keyboard.press('Space');
  const b1 = await wait(pg, () => window.__dummies.sim && window.__dummies.sim.phase === 'brief', 30000); await pg.waitForTimeout(300);
  await shot(pg, 'p713_brief.png');
  ok(b1, 'deploying opens the tile card: the tale of the LED wall and Farsight\'s brief');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(200);
  await shot(pg, 'p713_a1_gap.png'); // Edit 85: Monument A1's highway, its parapet open over the road (lit)
  { // Edit 86: a clean screen; options and controls in the pause menu
    const ui = await pg.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(); return { bar: document.querySelector('.bar').hidden, mon: document.getElementById('padmon').hidden, h: r.height, vh: window.innerHeight, left: window.__dummies.layoutY.left }; });
    ok(ui.bar && ui.mon && ui.h >= ui.vh - 2 && ui.left === 430, `no row under the screen; the stage fills the window (${Math.round(ui.h)} of ${ui.vh} px); BODY on the field's top edge, so the map rises: the touch zone starts at ${ui.left} (P7.5: 458)`);
    const H = await pg.evaluate(() => window.__dummiesUI.hud()), top = H.field.y, same = (a, b) => Math.abs(a - b) < 0.5;
    ok(same(H.body.y, top) && same(H.chassis.y, top) && H.score.rows === 'POINTS' && H.score.y + H.score.h <= top && H.score.x >= H.chassis.x && H.objective.y >= 0 && H.objective.y + H.objective.h <= top && H.objective.x + H.objective.w < H.score.x && H.map.title === 'MONUMENT · A1',
      `Edit 91, one top edge (y ${top}): BODY, the field and the chassis; ${H.score.rows} small in the top-right corner, on the strip with the objective ("${H.objective.text}"); the map titled "${H.map.title}"`);
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(150); await shot(pg, 'p713_pause.png');
    const pi = await pg.evaluate(() => window.__dummies.paused);
    await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('Space'); await pg.waitForTimeout(150);
    const op = await pg.evaluate(() => ({ page: window.__dummies.pausePage, items: window.__dummiesUI.optionItems(), sound: window.__dummies.sound }));
    await shot(pg, 'p713_options.png');
    await pg.keyboard.press('Space'); await pg.waitForTimeout(100); const snd = await pg.evaluate(() => window.__dummies.sound); await pg.keyboard.press('Space'); await pg.waitForTimeout(100);
    ok(pi && op.page === 'options' && op.items.join('|').replace(/: (on|off)/g, '') === 'Sound|Palette: cyber → day|Full screen|Tuning panel|Gamepad setup|Back' && snd === !op.sound, 'ESC pauses; Options: ' + op.items.join(' · ') + '; Sound toggles from the menu');
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(100); await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('Space'); await pg.waitForTimeout(150);
    const ck = await pg.evaluate(() => ({ page: window.__dummies.pausePage, dev: window.__dummiesUI.deviceOf(), rows: window.__dummiesUI.controlRows().rows.map((r) => r[1]).join(' ') }));
    await shot(pg, 'p713_controls_keys.png');
    await pg.evaluate(() => { window.__dummies.device = 'pad'; }); await pg.waitForTimeout(120);
    const cp = await pg.evaluate(() => ({ dev: window.__dummiesUI.deviceOf(), rows: window.__dummiesUI.controlRows().rows.map((r) => r[1]).join(' ') }));
    await shot(pg, 'p713_controls_pad.png');
    await pg.evaluate(() => { window.__dummies.device = 'keys'; });
    ok(ck.page === 'controls' && ck.dev === 'keys' && /^WASD \/ arrows Space \/ K L \/ Shift J \/ E I \/ Q Esc \/ P T G$/.test(ck.rows) && cp.dev === 'pad' && /^Stick \/ d-pad A B X Y Start Hold Start$/.test(cp.rows), `Controls shows the device in hand: keyboard (${ck.rows}); gamepad (${cp.rows})`);
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(80); await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);
  }
  const den = await pg.evaluate(() => { const s = window.__dummies.sim; return [s.W6.densityOf(s.W6.at(0, 0)), s.W6.densityOf(s.W6.at(1, 0)), s.W6.densityOf(s.W6.at(2, 2))]; });
  ok(den[0] === 1.5 && den[1] === 1.5 && den[2] === 1, `in the page, Story runs Monument A1 and its neighbours at story.traffic.monument.A1 (${den[0]}), C3 at ${den[2]}`);
  await pg.keyboard.down('KeyD'); await pg.waitForTimeout(3800); await pg.keyboard.up('KeyD'); await pg.waitForTimeout(150);
  const f = await pg.evaluate(() => { const s = window.__dummies.sim; return { x: s.body.x, scr: s.screenName(), toast: window.__dummies.toast && window.__dummies.toast.msg }; });
  await shot(pg, 'p713_fence.png');
  ok(f.scr === 'A1' && f.x > 700 && /Fence/.test(f.toast || ''), `the fence on A1's east side holds the dummy (x ${Math.round(f.x)}): "${f.toast}"`);
  const ob = await pg.evaluate(() => window.__dummiesUI.objective(window.__dummies.sim));
  ok(ob && /^OBJECTIVE · A1/.test(ob[0]) && /Write off a body \(0 of 1\)/.test(ob[1]), 'the top strip carries the objective: "' + (ob ? ob.join(' · ') : '') + '"');
  // Edit 91: on foot (no DASH); damage reddens each part, its number beside it; POINTS small in the corner, however long
  await pg.evaluate(() => { const s = window.__dummies.sim, b = s.body; Object.assign(b.parts, { head: 60, torso: 140, armL: 40, armR: 210, legL: 95, legR: 20 }); b.health = 35; s.run.points = 12345; }); await pg.waitForTimeout(400);
  const rd = await pg.evaluate(() => ({ H: window.__dummiesUI.hud(), max: window.__dummies.sim.maxHealth(), dash: window.__dummies.sim.dashFitted(), names: window.__dummiesUI.controlRows().rows.map((r) => r[0]).join(' | ') }));
  await shot(pg, 'p713_chassis_red.png');
  ok(rd.H.chassis.tags === 'head 60, torso 140, armR 210, armL 40, legR 20, legL 95' && rd.H.score.points === 12345 && rd.H.chassis.h < 320 && !rd.dash && rd.max === 500 && /^MOVE \| \?\?\? \| /.test(rd.names),
    `in A1 on foot: ${rd.max} health; DASH not fitted (Controls: ${rd.names.split(' | ').slice(0, 3).join(' · ')} …); the chassis reddens by part, numbers beside them (${rd.H.chassis.tags}); no rows beneath (${rd.H.chassis.h} tall); POINTS ${rd.H.score.points.toLocaleString('en-GB')}`);
  await pg.evaluate(() => { const s = window.__dummies.sim, b = s.body; b.hits.push({ kind: 'dash', cls: 'van', combo: 1, assessed: 120, lost: 30, angle: 90, model: 'VAN-02' }); b.health = 0; s.writeOff(); s.checkTerminal(); });
  await wait(pg, () => window.__dummies.sim.phase === 'report', 8000); await pg.waitForTimeout(200);
  await shot(pg, 'p713_report.png');
  const saved = await pg.evaluate(() => { const v = JSON.parse(localStorage.getItem('dummies.p7.save1') || 'null'); return v && v.progress; });
  ok(saved && saved.done.monument && saved.done.monument[0] === 'A1' && !saved.credits && saved.points >= 12345 + 2500, `the write-off clears A1 (1 of 1); slot 1 saves ${saved && saved.points} points, no credits`);
  await pg.keyboard.press('Space'); await pg.waitForTimeout(300);
  const nw = await pg.evaluate(() => ({ phase: window.__dummies.sim.phase, skip: window.__dummies.sim.events.some((e) => e.type === 'shop-skip') }));
  // Edit 84, 93: the drone that ferries the chassis to B1 brings Battery 1, in view; the gift screen; A waits for the hold
  await wait(pg, () => { const s = window.__dummies.sim, rs = s.rescue; return rs && rs.gift && rs.phase === 'inbound' && Math.abs(rs.drone.x - s.body.x) < 150; }, 10000); await shot(pg, 'p713_drone_item.png');
  const dob = await pg.evaluate(() => window.__dummiesUI.objective(window.__dummies.sim));
  await wait(pg, () => { const rs = window.__dummies.sim.rescue; return rs && rs.phase === 'give' && rs.item > 0.5; }, 10000); await shot(pg, 'p713_give.png');
  await wait(pg, () => window.__dummies.sim.phase === 'gift', 8000);
  const pre = await pg.evaluate(() => window.__dummiesUI.gift().age); await pg.keyboard.press('Space'); await pg.waitForTimeout(60);
  const early = await pg.evaluate(() => ({ phase: window.__dummies.sim.phase, ready: window.__dummiesUI.giftReady(), age: window.__dummiesUI.gift() && window.__dummiesUI.gift().age }));
  for (const [a, f] of [[0.2, 'p713_gift_drone.png'], [0.5, 'p713_gift_fall.png'], [0.78, 'p713_gift_land.png']]) { await pg.evaluate((q) => window.__dummiesUI.pinGift(q), a); await pg.waitForTimeout(60); await shot(pg, f); } // the screen at fixed moments
  await pg.evaluate(() => window.__dummiesUI.pinGift(null));
  await wait(pg, () => window.__dummiesUI.giftReady(), 4000); await pg.waitForTimeout(500); await shot(pg, 'p713_gift_battery.png');
  const gb = await pg.evaluate(() => { const s = window.__dummies.sim; return { node: window.__dummiesUI.gift() && window.__dummiesUI.gift().node, dash: s.dashFitted(), health: s.body.health, max: s.maxHealth() }; });
  ok(nw.phase !== 'shop' && nw.skip && /DRONE/.test(dob ? dob[0] : '') && /Bringing Battery 1, then on to B1/.test(dob ? dob[1] : '') && early.phase === 'gift' && !early.ready && gb.node === 'battery1' && gb.dash && gb.health === gb.max && gb.max === 800,
    `no workshop in Story: the drone flies in with Battery 1 under it ("${dob ? dob.join(' · ') : ''}"), lowers it onto the chassis; the gift screen; A at ${pre.toFixed(2)} s is ignored (ui.gift.holdSeconds); the dash fitted, ${gb.health} health` + (early.phase !== 'gift' || early.ready ? ' [' + JSON.stringify(early) + ']' : ''));
  await pg.keyboard.press('Space'); await wait(pg, () => { const s = window.__dummies.sim; return s.rescue && s.rescue.phase === 'carry' && s.body.x > 520; }, 15000); await pg.waitForTimeout(100);
  await shot(pg, 'p713_ferry.png');
  const fo = await pg.evaluate(() => window.__dummiesUI.objective(window.__dummies.sim));
  const fb = await wait(pg, () => window.__dummies.sim.phase === 'brief', 20000); await pg.waitForTimeout(200); await shot(pg, 'p713_brief_b1.png');
  const fp = await pg.evaluate(() => { const s = window.__dummies.sim; return { scr: s.screenName(), x: s.body.x, fences: s.fenceSides().join(), task: s.task().kind }; });
  ok(fb && fp.scr === 'B1' && fp.x < 200 && fp.fences === 'E,S' && fp.task === 'dash' && /DRONE/.test(fo ? fo[0] : ''), `the drone carries the chassis on to B1 ("${fo ? fo.join(' · ') : ''}") and sets it down by the west edge (x ${Math.round(fp.x)}); B1's card: DASH INTO A CAR`);
  await pg.keyboard.press('Space'); await pg.waitForTimeout(400); await shot(pg, 'p713_b1.png');
  // Edit 93: B1 cleared by a dash; the drone carries the chassis to C1 with no part; C1's card asks for a drop
  await pg.evaluate(() => { const s = window.__dummies.sim, b = s.body; b.hits.push({ kind: 'dash', cls: 'sedan', combo: 1, assessed: 120, lost: 30, angle: 90, model: 'SED-01' }); b.health = 0; s.writeOff(); s.checkTerminal(); });
  await wait(pg, () => window.__dummies.sim.phase === 'report', 8000); await pg.waitForTimeout(150); await shot(pg, 'p713_report_b1.png'); await pg.keyboard.press('Space'); await pg.waitForTimeout(250);
  const cb = await wait(pg, () => window.__dummies.sim.phase === 'brief', 20000);
  const c1 = await pg.evaluate(() => { const s = window.__dummies.sim; return { scr: s.screenName(), legs: s.has('jump'), gift: window.__dummiesUI.gift(), gave: s.events.filter((e) => e.type === 'gift').length, task: s.task().kind }; });
  await pg.waitForTimeout(200); await shot(pg, 'p713_brief_c1.png');
  ok(cb && c1.scr === 'C1' && !c1.legs && c1.gave === 1 && c1.task === 'drop', 'B1 cleared by a dash; the drone carries the chassis to C1 with no part; C1\'s card: DROP ONTO A CAR');
  const pg2 = await ctx.newPage(); watch(pg2); await pg2.goto(url); await pg2.waitForTimeout(800);
  await pg2.keyboard.press('ArrowRight'); await pg2.keyboard.press('Space'); await pg2.waitForTimeout(300);
  const rs0 = await pg2.evaluate(() => ({ screen: window.__dummies.screen, sel: window.__dummies.saveSel, acts: window.__dummiesUI.slotActs(1), s: window.__dummiesUI.saves()[0] }));
  await shot(pg2, 'p713_saves_one.png');
  await pg2.keyboard.press('Space'); await pg2.waitForTimeout(300);
  const re = await pg2.evaluate(() => ({ screen: window.__dummies.screen, wo: window.__dummies.story && window.__dummies.story.tileWO, done: window.__dummies.story && (window.__dummies.story.done.monument || []).join() }));
  await shot(pg2, 'p713_map_progress.png');
  ok(rs0.screen === 'saves' && rs0.sel === 1 && rs0.acts.join() === 'CONTINUE,RENAME,ERASE' && /^\d\d [A-Z]{3} \d{4} · \d\d:\d\d$/.test(rs0.s.stamp) && /^MONUMENT · C1 · TILE 3 OF 27/.test(rs0.s.lines[0]) && /^2 \/ 27 TILES · [\d,]+ POINTS · 1 \/ 11 PARTS · CHASSIS \d\d$/.test(rs0.s.lines[1]),
    `a reload: the save screen offers the latest slot first: "${rs0.s.name}", ${rs0.s.stamp}; "${rs0.s.lines[0]}"; "${rs0.s.lines[1]}"; CONTINUE · RENAME · ERASE`);
  ok(re.screen === 'storymap' && re.wo === 0 && re.done === 'A1,B1', 'CONTINUE resumes the story: A1 and B1 cleared, C1 in test');
  await pg2.close();
  { // Edit 94: the finale in the page. A save at Waterfront B2, one write-off from certified: the cloth, the write-off, the lift, the plaque, the voyage, the ending
    const pr = Object.assign(STORY.newProgress(), { district: 'waterfront', done: { monument: D[0].order.slice(), parkland: D[1].order.slice(), waterfront: D[2].order.slice(0, 8) }, tileWO: REG['story.writeOffs.waterfront.B2'] - 1, points: 412350, chassis: 33, t: 5420, bestCombo: 4, owned: {} });
    const seed = async (p) => { await p.evaluate((o) => { localStorage.clear(); localStorage.setItem('dummies.p7.saveMoved', '1'); localStorage.setItem('dummies.p7.save1', JSON.stringify({ v: 1, name: 'CERTIFY', saved: Date.now(), progress: o })); }, pr); await p.reload(); await p.waitForTimeout(900);
      await p.keyboard.press('ArrowRight'); await p.keyboard.press('Space'); await p.waitForTimeout(250); await p.keyboard.press('Space'); await p.waitForTimeout(250); await p.keyboard.press('Space');
      await wait(p, () => window.__dummies.sim && window.__dummies.sim.phase === 'gift', 30000); await p.waitForTimeout(1500); await p.keyboard.press('Space');
      await wait(p, () => window.__dummies.sim.phase === 'brief', 20000); await p.waitForTimeout(200); await p.keyboard.press('Space'); await wait(p, () => window.__dummies.sim.phase === 'play', 5000); };
    const last = (p) => p.evaluate(() => { const s = window.__dummies.sim, b = s.body; Object.assign(b, { x: 540, y: 470 }); b.hits.push({ kind: 'dash', cls: 'sedan', combo: 5, cause: null, assessed: 410, lost: 30, angle: 90, model: 'SED-01' }); b.health = 0; s.writeOff(); s.checkTerminal(); });
    const pf = await ctx.newPage(); watch(pf); await pf.goto(url); await pf.waitForTimeout(600); await seed(pf);
    const sh = await pf.evaluate(() => ({ tile: window.__dummies.sim.screenName(), shrouded: window.__dummies.sim.monumentShrouded() })); await shot(pf, 'p713_shroud.png');
    await last(pf); await pf.waitForTimeout(450); await shot(pf, 'p713_finale_writeoff.png');
    const u0 = await wait(pf, () => window.__dummies.sim.phase === 'unveil', 8000); await pf.waitForTimeout(400); await shot(pf, 'p713_unveil_lift.png');
    await pf.keyboard.press('Space'); await pf.waitForTimeout(100); const early = await pf.evaluate(() => window.__dummies.sim.phase);
    await pf.waitForTimeout(1400); await shot(pf, 'p713_unveil.png');
    const saved = await pf.evaluate(() => JSON.parse(localStorage.getItem('dummies.p7.save1')).progress.complete);
    await pf.keyboard.press('Space'); const v = await wait(pf, () => window.__dummies.sim.phase === 'voyage', 3000); await pf.waitForTimeout(1600);
    const vo = await pf.evaluate(() => ({ ob: window.__dummiesUI.objective(window.__dummies.sim) })); await shot(pf, 'p713_voyage.png');
    await wait(pf, () => window.__dummies.sim.screenName() === 'B3' && window.__dummies.sim.rescue && window.__dummies.sim.rescue.phase === 'drop', 20000); await shot(pf, 'p713_ship.png');
    const e = await wait(pf, () => window.__dummies.sim.phase === 'ending', 10000); await pf.waitForTimeout(600); await shot(pf, 'p713_certified.png');
    const fin = await pf.evaluate(() => ({ kind: window.__dummies.sim.run.ending && window.__dummies.sim.run.ending.kind, tile: window.__dummies.sim.screenName() }));
    ok(sh.tile === 'B2' && sh.shrouded && u0 && early === 'unveil' && saved && v && vo.ob[0] === 'FARSIGHT DRONE' && /ship at B3/.test(vo.ob[1]) && e && fin.kind === 'Certified' && fin.tile === 'B3',
      `Edit 94, page: B2 in test, the monument shrouded; the last write-off plays, then the cloth lifts (SPACE too early does nothing); the plaque; the save is CERTIFIED; SPACE: "${vo.ob.join(' · ')}"; set down on the ship in B3; CERTIFIED`);
    await pf.close();
    const pc = await br.newContext({ viewport: { width: 892, height: 412 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3.5 }), pt = await pc.newPage(); watch(pt); await pt.goto(url); await pt.waitForTimeout(600); await seed(pt);
    await pt.evaluate(() => window.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', clientX: 5, clientY: 5, bubbles: true }))); await pt.waitForTimeout(150);
    await last(pt); await wait(pt, () => window.__dummies.sim.phase === 'unveil', 8000); await pt.waitForTimeout(1600);
    const at = await pt.evaluate(() => { const h = window.__dummiesUI.hits().find((q) => q.tag === 'unveil'), L = window.__dummiesInput.touchLayout(), r = document.getElementById('game').getBoundingClientRect(), k = r.width / L.Wc; return h && { x: r.left + (h.x + h.w / 2 + L.gx) * k, y: r.top + (h.y + h.h / 2 + L.gy) * k }; });
    await shot(pt, 'p713_phone_unveil.png');
    for (const t of ['pointerdown', 'pointerup']) await pt.evaluate(([ty, x, y]) => document.getElementById('game').dispatchEvent(new PointerEvent(ty, { pointerType: 'touch', clientX: x, clientY: y, pointerId: 77, bubbles: true, cancelable: true })), [t, at.x, at.y]);
    const tv = await wait(pt, () => window.__dummies.sim.phase === 'voyage', 3000);
    ok(!!at && tv, 'Edit 94, phone: a tap on the plaque goes on to the ship');
    await pc.close();
  }
  // phones held sideways. Edit 87: the HUD in the 16:9 centre; the stick and the diamond default under the side panels; a wide phone's
  // margins are free; Pause › Controls › Adjust layout moves and sizes both, saved in this browser
  const story = async (p) => { await p.evaluate(() => { window.__dummies.titleSel = 1; }); // STORY; the save screen (NEW GAME, its name kept, or CONTINUE); the map; deploy
    for (let i = 0; i < 4; i++) { if (await p.evaluate(() => !!window.__dummies.sim)) break; await p.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' })); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' })); }); await p.waitForTimeout(250); }
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
    const [c, p] = await phone(640, 360, 3), L = await lay(p); await shot(p, 'p713_phone169.png');
    const H = await p.evaluate(() => window.__dummiesUI.hud());
    ok(L.gx < 1 && L.home.x > 16 && L.home.x < 240 && L.c.x > 1040 && L.c.x < 1280 && L.chip.pause.y + L.chip.pause.h <= H.field.y && L.chip.full.x + L.chip.full.w <= 240, `16:9 phone: the stick under the map (x ${Math.round(L.home.x)}), the diamond under the chassis (x ${Math.round(L.c.x)}); ❚❚ PAUSE and ⤢ FULL small, top left, above BODY (${L.chip.pause.w}×${L.chip.pause.h})`);
    await c.close();
  }
  const [ph, pp] = await phone(892, 412, 3.5); // a Samsung Galaxy S25 Ultra, 19.5:9
  const L = await lay(pp), H = await pp.evaluate(() => window.__dummiesUI.hud()); await shot(pp, 'p713_s25.png');
  const in169 = (x) => x >= L.gx - 0.5 && x <= L.gx + 1280.5;
  ok(L.gx > 100 && in169(L.chip.pause.x) && in169(L.chip.full.x + L.chip.full.w) && L.home.x > L.gx && L.home.x < L.gx + 240 && L.c.x > L.gx + 1040 && L.c.x < L.gx + 1280 && H.score.x + H.score.w <= 1280,
    `19.5:9 (S25 Ultra, 892×412 CSS): the 16:9 frame centred, ${Math.round(L.gx)} units of margin a side; every panel, the chips, the stick and the diamond inside it by default`);
  const fwPlay = await pp.evaluate(() => window.__dummiesInput.faceWords());
  await tap(pp, L.pauseCss, 3); const pz = await pp.evaluate(() => window.__dummies.paused);
  const fwMenu = await pp.evaluate(() => window.__dummiesInput.faceWords()), names = await pp.evaluate(() => window.__dummiesUI.controlRows().rows.map((r) => r[0]).join(' | '));
  ok(!fwPlay.a && !fwPlay.b && !fwPlay.x && !fwPlay.y && fwMenu.a === 'OK' && fwMenu.b === 'BACK' && !fwMenu.x && !fwMenu.y && /^MOVE \| \?\?\? \| \?\?\? \| \?\?\? \| \?\?\? \| PAUSE/.test(names),
    `Edit 91: in play at A1, on foot, A, B, X, Y are blank (nothing fitted, not even the dash); paused, A ${fwMenu.a}, B ${fwMenu.b}; Pause › Controls names no verb before its part: ${names}`);
  await pp.evaluate(() => { const a = window.__dummies; a.pausePage = 'controls'; a.ctlSel = 0; }); await pp.waitForTimeout(100);
  const tc = await pp.evaluate(() => ({ dev: window.__dummiesUI.deviceOf(), rows: window.__dummiesUI.controlRows().rows.map((r) => r[1]).join(' '), items: window.__dummiesUI.controlItems().join('|'), opts: window.__dummiesUI.optionItems().join('|') }));
  await shot(pp, 'p713_phone_controls.png');
  await pp.keyboard.press('Space'); await pp.waitForTimeout(150); const ed0 = await pp.evaluate(() => !!window.__dummies.touchEdit);
  ok(pz && tc.dev === 'touch' && /^Stick, left A B X Y ❚❚ ⤢$/.test(tc.rows) && tc.items === 'Adjust layout|Reset layout|Back' && !/Tuning|Gamepad/.test(tc.opts) && ed0,
    `the small ❚❚ chip pauses; on a phone, Controls shows touch (${tc.rows}) and offers ${tc.items.split('|').join(' · ')}; Adjust layout opens the editor`);
  await drag(pp, L.homeCss, { x: L.left + 50 * L.toCss + 4, y: L.homeCss.y }, 5); // the stick into the left margin
  await drag(pp, L.cCss, { x: L.left + (L.Wc - 70) * L.toCss, y: L.cCss.y - 20 }, 6); // the diamond into the right margin
  await shot(pp, 'p713_s25_edit.png');
  const L1 = await lay(pp); await tap(pp, L1.plusCss, 7); await tap(pp, L1.plusCss, 7); const L2 = await lay(pp);
  await shot(pp, 'p713_s25_edit_size.png');
  for (let i = 0; i < 10; i++) await pp.evaluate(() => window.__dummiesInput.touchEditSize(1)); const kMax = await pp.evaluate(() => window.__dummies.touchCfg.face.k);
  for (let i = 0; i < 20; i++) await pp.evaluate(() => window.__dummiesInput.touchEditSize(-1)); const kMin = await pp.evaluate(() => window.__dummies.touchCfg.face.k);
  for (let i = 0; i < 6; i++) await pp.evaluate(() => window.__dummiesInput.touchEditSize(1));
  const L3 = await lay(pp); await tap(pp, L3.doneCss, 8);
  const st = await pp.evaluate(() => ({ edit: !!window.__dummies.touchEdit, cfg: JSON.parse(localStorage.getItem('dummies.p7.touch') || 'null') }));
  ok(L1.home.x < L1.gx && L1.c.x > L.c.x + 50 && L1.c.x >= L1.Wc - (2 * L1.fr + 6) / Math.SQRT2 - L1.fr - 5 && L1.c.x + L1.fr > L1.gx + 1280 && Math.abs(L2.fr / L2.fr0 - 1.2) < 0.01 && Math.abs(L2.sr - L1.sr) < 0.01 && kMax === 1.6 && kMin === 0.6 && !st.edit && st.cfg && st.cfg.stick && st.cfg.face && st.cfg.face.k === 1.2,
    `Adjust layout: the stick dragged into the left margin (x ${Math.round(L1.home.x)} < ${Math.round(L1.gx)}), the diamond into the right, held at the canvas edge (x ${Math.round(L.c.x)} → ${Math.round(L1.c.x)}, radius ${Math.round(L1.fr)}); + SIZE twice: the buttons ×${(L2.fr / L2.fr0).toFixed(2)}, the stick unchanged; size held to ${kMin}–${kMax} (ui.touch.scaleMin–scaleMax); DONE saves (${JSON.stringify(st.cfg)})`);
  await pp.evaluate(() => { const a = window.__dummies; a.paused = false; a.pausePage = null; }); await pp.waitForTimeout(150); await shot(pp, 'p713_s25_custom.png');
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
  { // Edit 88: three slots, each its own story; NEW GAME, the grid, a typed name, OVERWRITE, RENAME, ERASE, a cancel; 7.6's story into slot 1
    const c = await br.newContext({ viewport: { width: 1300, height: 900 } }), p = await c.newPage(); watch(p);
    await p.goto(url); await p.waitForTimeout(300);
    const old = { v: 1, district: 'monument', done: { monument: ['A1', 'B1', 'C1'] }, tileWO: 0, owned: { legs1: true }, credits: 1, points: 2450, chassis: 4, writeOffs: 4, t: 0, gifts: {}, tilePoints: {}, complete: false };
    await p.evaluate((o) => { localStorage.clear(); localStorage.setItem('dummies.p7.story', JSON.stringify(o)); }, old);
    await p.reload(); await p.waitForTimeout(800);
    const A = () => p.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' })); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' })); }); // A, as a pad presses it
    const key = async (k, n) => { for (let i = 0; i < (n || 1); i++) await p.keyboard.press(k); await p.waitForTimeout(60); };
    const st = () => p.evaluate(() => ({ screen: window.__dummies.screen, sel: window.__dummies.saveSel, mode: window.__dummies.saveMode, conf: window.__dummies.saveConfirm, ne: window.__dummies.nameEntry, slot: window.__dummies.slot, story: window.__dummies.story, saves: window.__dummiesUI.saves() }));
    await key('ArrowRight'); await A(); await p.waitForTimeout(150);
    const s0 = await st(), legacy = await p.evaluate(() => localStorage.getItem('dummies.p7.story') != null);
    ok(s0.screen === 'saves' && s0.sel === 1 && s0.saves[0] && s0.saves[0].name === 'TEST DUMMY 1' && s0.saves[0].progress.points === 2450 && /^MONUMENT · C2 · TILE 4 OF 27/.test(s0.saves[0].lines[0]) && !s0.saves[1] && legacy,
      `7.6's one story moves into slot 1 ("${s0.saves[0] && s0.saves[0].lines[0]}", ${s0.saves[0] && s0.saves[0].lines[1]}); the old save stays for 7.1–7.6`);
    // NEW GAME by the grid (the stick or a pad): up three rows to K, A; left to J, A; down to OK, A
    await key('ArrowUp'); await A(); await p.waitForTimeout(100);
    await key('ArrowUp', 3); await A(); await key('ArrowLeft'); await A(); await shot(p, 'p713_name_grid.png'); await key('ArrowDown', 3); await A(); await p.waitForTimeout(300);
    const s1 = await st();
    ok(s1.screen === 'storymap' && s1.slot === 2 && s1.saves[1] && s1.saves[1].name === 'KJ' && s1.story.points === 0 && STORY.clearedCount(s1.story) === 0,
      'NEW GAME takes the first empty slot (2); the grid types K, J; OK starts the story there: "KJ", 0 tiles, 0 points');
    await key('Shift'); await key('ArrowUp', 2); await A(); await p.waitForTimeout(100);
    await p.keyboard.type('third'); await key('Enter'); await p.waitForTimeout(300); await key('Shift');
    const s2 = await st(); await shot(p, 'p713_saves_full.png');
    await key('ArrowUp', 3); await A(); await p.waitForTimeout(100); const s3 = await st();
    await key('ArrowDown'); await A(); await p.waitForTimeout(100); const s4 = await st(); await shot(p, 'p713_overwrite.png');
    await A(); await p.waitForTimeout(100); const s5 = await st(); await key('Enter'); await p.waitForTimeout(300); const s6 = await st();
    ok(s2.saves.every(Boolean) && s3.mode === 'overwrite' && s3.sel === 1 && s4.sel === 2 && s4.conf === 'OVERWRITE2' && s4.saves[1].name === 'KJ' && s5.ne && s5.ne.slot === 2 && s5.ne.text === 'TEST DUMMY 2' && s6.slot === 2 && s6.saves[1].name === 'TEST DUMMY 2' && s6.saves[0].progress.points === 2450 && s6.saves[2].name === 'THIRD',
      'all three in use: NEW GAME asks which slot to overwrite; A once asks again ("OVERWRITE? A AGAIN"), A twice names it; slot 2 starts afresh; slots 1 and 3 untouched');
    await key('Shift'); await key('ArrowDown'); const t0 = (await st()).saves[2].saved; await key('ArrowRight'); await A(); await p.waitForTimeout(100);
    const s7 = await st(); await p.keyboard.type('renamed one!'); await shot(p, 'p713_rename.png'); await key('Enter'); await p.waitForTimeout(150); const s8 = await st();
    ok(s7.ne && s7.ne.kind === 'rename' && s7.ne.text === 'THIRD' && s8.saves[2].name === 'RENAMED ONE' && s8.saves[2].saved === t0 && s8.screen === 'saves',
      `RENAME: "${s7.ne && s7.ne.text}" → "${s8.saves[2].name}" (the ! dropped); the time stamp stays`);
    await key('ArrowRight'); await A(); await p.waitForTimeout(100); const s9 = await st(); await shot(p, 'p713_erase.png'); await A(); await p.waitForTimeout(100); const s10 = await st();
    await key('ArrowUp', 3); await A(); await p.waitForTimeout(100); const s11 = await st(); await key('Escape'); await p.waitForTimeout(100); const s12 = await st();
    ok(s9.conf === 'ERASE3' && s9.saves[2] && !s10.saves[2] && s11.ne && s11.ne.slot === 3 && !s12.ne && s12.screen === 'saves' && !s12.saves[2],
      'ERASE asks twice, then empties slot 3; NEW GAME offers slot 3 again; ESC cancels the name and creates nothing');
    await key('ArrowDown'); await A(); await p.waitForTimeout(300); const s13 = await st();
    ok(s13.screen === 'storymap' && s13.slot === 1 && s13.story.points === 2450 && STORY.doneIn(s13.story, 'monument').join() === 'A1,B1,C1', 'each slot keeps its own story: CONTINUE on slot 1 opens Monument C2, 3 tiles cleared, 2,450 points');
    await c.close();
  }
  { // Edit 88, touch: tap NEW GAME, tap keys, tap the name for the phone's own keyboard, tap OK; tap a slot's RENAME
    const c = await br.newContext({ viewport: { width: 892, height: 412 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3.5 }), p = await c.newPage(); watch(p);
    await p.goto(url); await p.waitForTimeout(800); await p.evaluate(() => { window.__dummies.titleSel = 1; window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' })); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' })); }); await p.waitForTimeout(200);
    const hit = (tag) => p.evaluate((tg) => { const h = window.__dummiesUI.hits().find((q) => q.tag === tg), L = window.__dummiesInput.touchLayout(), r = document.getElementById('game').getBoundingClientRect(), k = r.width / L.Wc;
      return h && { x: r.left + (h.x + h.w / 2 + L.gx) * k, y: r.top + (h.y + h.h / 2 + L.gy) * k }; }, tag);
    const tapHit = async (tag, id) => { const at = await hit(tag); if (at) await tap(p, at, id); return !!at; };
    const t1 = await tapHit('save:new', 21);
    for (const ch of 'DUM') await tapHit('key:' + ch, 22);
    const typed = await p.evaluate(() => window.__dummies.nameEntry && window.__dummies.nameEntry.text);
    await tapHit('name', 23); const foc = await p.evaluate(() => document.activeElement && document.activeElement.id);
    await shot(p, 'p713_phone_name.png');
    await p.keyboard.type('my!'); await p.waitForTimeout(100); const viaIn = await p.evaluate(() => window.__dummies.nameEntry && window.__dummies.nameEntry.text);
    await tapHit('key:OK', 24); await p.waitForTimeout(300);
    const tp = await p.evaluate(() => ({ screen: window.__dummies.screen, s: window.__dummiesUI.saves()[0], foc: document.activeElement && document.activeElement.id }));
    ok(t1 && typed === 'DUM' && foc === 'name-input' && viaIn === 'DUMMY' && tp.screen === 'storymap' && tp.s && tp.s.name === 'DUMMY' && tp.foc !== 'name-input',
      `touch: tap NEW GAME; tap D, U, M ("${typed}"); tap the name: the phone's keyboard (${foc}) adds "MY" ("${viaIn}"); tap OK: slot 1 "${tp.s && tp.s.name}"; the hidden field lets go`);
    await p.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft' })); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft' })); }); await p.waitForTimeout(200);
    await shot(p, 'p713_phone_saves.png');
    const t2 = await tapHit('act:1:RENAME', 25); const rn = await p.evaluate(() => window.__dummies.nameEntry);
    ok(t2 && rn && rn.kind === 'rename' && rn.slot === 1 && rn.text === 'DUMMY', 'touch: tap a slot\'s RENAME: the name entry opens on "' + (rn && rn.text) + '"');
    await c.close();
  }
  { // Edit 89: a phone with a stylus (a fine, hovering pointer) turns touch on at the first touch; then every menu answers a tap
    const c = await br.newContext({ viewport: { width: 892, height: 412 }, deviceScaleFactor: 3.5 }), p = await c.newPage(); watch(p);
    await p.goto(url); await p.waitForTimeout(800);
    const t0 = await p.evaluate(() => window.__dummiesInput.TOUCH.on);
    await p.evaluate(() => window.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', clientX: 5, clientY: 5, bubbles: true }))); await p.waitForTimeout(200);
    const t1 = await p.evaluate(() => window.__dummiesInput.TOUCH.on);
    const hitAt = (tag) => p.evaluate((tg) => { const h = window.__dummiesUI.hits().find((q) => q.tag === tg), L = window.__dummiesInput.touchLayout(), r = document.getElementById('game').getBoundingClientRect(), k = r.width / L.Wc; return h && { x: r.left + (h.x + h.w / 2 + L.gx) * k, y: r.top + (h.y + h.h / 2 + L.gy) * k }; }, tag);
    let pid = 40; const tapTag = async (tag) => { const at = await hitAt(tag); if (!at) return false; await tap(p, at, pid++); await p.waitForTimeout(180); return true; };
    const tapFace = async (id) => { const L = await p.evaluate(() => window.__dummiesInput.touchLayoutCss()), f = L.face.find((q) => q.id === id); await tap(p, f, pid++); await p.waitForTimeout(180); };
    const st = () => p.evaluate(() => { const a = window.__dummies, s = a.sim; return { screen: a.screen, phase: s && s.phase, paused: a.paused, page: a.pausePage, level: a.level, dif: a.difficulty, mapSel: a.mapSel && a.mapSel.join(), ne: !!a.nameEntry, owned: s ? Object.keys(s.run.owned).join() : '' }; });
    const log = [], step = async (what, fn, check) => { const okTap = await fn(); const v = await st(); const good = okTap && check(v); log.push(what + (good ? '' : ' ✗ ' + JSON.stringify(v))); return good; };
    const d0 = (await st()).dif;
    let all = true;
    all = (await step('ARCADE', () => tapTag('title:ARCADE'), (v) => v.screen === 'arcade')) && all;
    all = (await step('a district', () => tapTag('district:waterfront'), (v) => v.level === 1)) && all;
    all = (await step('▶', () => tapTag('difficulty:+'), (v) => v.dif === d0 + 1)) && all;
    await shot(p, 'p713_touch_arcade.png');
    all = (await step('B', async () => { await tapFace('b'); return true; }, (v) => v.screen === 'title')) && all;
    all = (await step('STORY', () => tapTag('title:STORY'), (v) => v.screen === 'saves')) && all;
    all = (await step('NEW GAME', () => tapTag('save:new'), (v) => v.ne)) && all;
    all = (await step('OK', () => tapTag('key:OK'), (v) => v.screen === 'storymap')) && all;
    all = (await step('a tile', () => tapTag('tile:monument:B1'), (v) => v.mapSel === '1,0')) && all;
    await shot(p, 'p713_touch_map.png');
    all = (await step('DEPLOY', () => tapTag('deploy'), (v) => v.screen === 'loading' || v.screen === 'game')) && all;
    await wait(p, () => window.__dummies.sim && window.__dummies.sim.phase === 'brief', 30000); await p.waitForTimeout(200);
    all = (await step('the card', () => tapTag('brief'), (v) => v.phase === 'play')) && all;
    all = (await step('❚❚', async () => { const L = await p.evaluate(() => { const I = window.__dummiesInput, L = I.touchLayout(), r = document.getElementById('game').getBoundingClientRect(), k = r.width / L.Wc, c = L.chip.pause; return { x: r.left + (c.x + c.w / 2) * k, y: r.top + (c.y + c.h / 2) * k }; }); await tap(p, L, pid++); await p.waitForTimeout(180); return true; }, (v) => v.paused)) && all;
    all = (await step('Options', () => tapTag('menu:Options'), (v) => v.page === 'options')) && all;
    await shot(p, 'p713_touch_options.png');
    all = (await step('Back', () => tapTag('menu:Back'), (v) => v.paused && !v.page)) && all;
    all = (await step('Resume', () => tapTag('menu:Resume'), (v) => !v.paused && v.phase === 'play')) && all;
    await p.evaluate(() => { const s = window.__dummies.sim, b = s.body; s.run.points = 6600; s.step({}); b.hits.push({ kind: 'dash', cls: 'van', combo: 1, assessed: 120, lost: 30, angle: 90, model: 'VAN-02' }); b.health = 0; s.writeOff(); s.checkTerminal(); });
    await wait(p, () => window.__dummies.sim.phase === 'report', 8000); await p.waitForTimeout(200);
    all = (await step('the report', () => tapTag('report'), (v) => v.phase !== 'report' && v.phase !== 'shop')) && all;
    await wait(p, () => window.__dummies.sim.phase === 'gift' && window.__dummiesUI.giftReady(), 15000);
    await shot(p, 'p713_touch_gift.png');
    all = (await step('the gift', () => tapTag('gift'), (v) => v.phase !== 'gift' && v.owned === 'battery1')) && all;
    ok(!t0 && t1 && all, `Edit 89, 91: a stylus phone (fine, hovering pointer) starts without touch controls; the first touch turns them on. Then by taps alone: ${log.join(' › ')}`);
    await c.close();
  }
  ok(!logs.length, 'browser: no page errors' + (logs.length ? ': ' + logs.slice(0, 3).join(' | ') : ''));
  await br.close();
  done();
})().catch((e) => { console.log('FAIL browser: ' + e.message); fail++; done(); process.exit(1); }); // an open browser would hold the process
function done() { console.log('\n' + pass + ' passed, ' + fail + ' failed'); process.exitCode = fail ? 1 : 0; }
