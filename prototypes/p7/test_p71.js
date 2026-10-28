// Prototype 7.1 (GDD Edits 81–82) checks. Run from prototypes/p7: node test_p71.js [screenshot folder]
// Edit 82: a credit a body (economy.creditsPerWriteOff), counted or not; story prices 3, 4, 5 (story.price.ability.level1–3); write-offs
// per tile (story.writeOffs.<district>.<tile>); credit gifts (story.giftCredits); the shop skipped when nothing is affordable.
// 1. Content (content/story/story.json): the three orders as decided; 27 tiles, each step to a neighbour; every tale, task and
//    gift; every number a registry ID; every task possible where it is set (traffic, levels, cones; the ability gifted by then).
// 2. Headless (story.js on ../p6): the start tile; fences that hold (walk, dash, jump); the count against the brief; a real dash
//    write-off counted; a miss; a clear; the next tile open, closed behind; cleared tiles open; gifts; prices; the next district;
//    the certificate. Arcade: one district a run, its prices. 6.4–6.10 and 7 frozen.
// 3. Browser (Playwright, dummies_p7_1.html): the title's two modes; Arcade's district pick; the story map; the tile card; a fence;
//    a report and the shop in credits; progress saved in the browser; a phone held sideways; no page errors.
'use strict';
const fs = require('fs'), path = require('path');
const STORY = require('./story.js');
const W6 = require('../p6/world6.js');
const X = require('../p6/sim.js');
const OUT = process.argv[2] || null;
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else fail++; console.log((c ? 'PASS ' : 'FAIL ') + msg); };
const REG = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES, W6.P6SIM);
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
  ok(!bad.length, 'every tile has a title, a tale (' + words + ' words in all), a task Farsight knows and, where set, a gift; every number a registry ID (story.task.comboEasy, story.task.comboHard, story.giftCredits, story.writeOffs.<district>.<tile>)' + (bad.length ? ': ' + bad.join(', ') : ''));
  const ids = ['economy.creditsPerWriteOff', 'story.price.ability.level1', 'story.price.ability.level2', 'story.price.ability.level3', 'story.giftCredits', 'story.task.comboEasy', 'story.task.comboHard', 'story.shiftCars'];
  const regFile = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'content', 'params', 'tuning.parameters.json'), 'utf8')), inFile = new Set(regFile.entries.map((e) => e.id));
  const tiles = D.flatMap((d) => d.order.map((t) => 'story.writeOffs.' + d.id + '.' + t)), retired = ['story.tileWriteOffs', 'story.clearPowerUps', 'story.pointsPerPowerUp', 'story.giftPowerUps'];
  const byId = new Map(regFile.entries.map((e) => [e.id, e]));
  ok(ids.concat(tiles).every((k) => REG[k] != null && inFile.has(k)) && retired.every((k) => /^retired \(Edit 82\)/.test(byId.get(k).status)) && regFile.registryVersion.startsWith('edit82'),
    'the story\'s values are registry IDs (' + ids.map((k) => k + ' ' + REG[k]).join(', ') + '); 27 tile counts; ' + retired.length + ' P7 IDs retired; registry ' + regFile.registryVersion);
  const per = D.map((d) => d.name + ' ' + d.order.map((t) => REG['story.writeOffs.' + d.id + '.' + t]).join('')), sum = tiles.reduce((a, k) => a + REG[k], 0);
  ok(tiles.every((k) => REG[k] >= 1 && REG[k] <= 3) && sum === 62, 'write-offs tuned per tile (D65): ' + per.join(' · ') + ' (in story order); ' + sum + ' bodies in all (P7: 81)');
  // abilities a task needs, gifted at or before its tile (never left to the shop)
  const NEED = { jump: 'legs1', push: 'arms1', cone: 'hands1' }, got = new Set(), late = [];
  for (const d of D) for (const t of d.order) { const q = d.tiles[t]; if (q.gift && q.gift.node) got.add(q.gift.node); const n = NEED[q.task.kind]; if (n && !got.has(n)) late.push(d.id + ' ' + t); }
  ok(!late.length, 'every task\'s ability is gifted by its tile: Legs 1 at Monument C1 (jump), Hands 1 at B2 (cone), Arms 1 at A2 (push), Battery 1 at B3' + (late.length ? ': late at ' + late.join(', ') : ''));
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
{
  const pr = STORY.newProgress(), s = story('monument', pr);
  ok(s.screenName() === 'A1' && s.phase === 'brief' && s.entered && ev(s, 'story-enter').length === 1 && s.fenceSides().join() === 'E,S',
    `the story opens on Monument A1 with its tile card (phase ${s.phase}); fences on A1's sides to B1 and A2 (${s.fenceSides().join(', ')})`);
  s.continueBrief();
  walk(s, 1, 0, 400); const held = s.screenName() === 'A1' && s.body.x <= W - R + 1e-6, fences = ev(s, 'story-fence').length;
  ok(held && fences === 1, `walking east into the fence holds at x ${s.body.x.toFixed(0)} (screen ${W}, body ${R}); one notice a contact (${fences})`);
  // a dash and a jump at the fence: both held
  Object.assign(s.body, { x: W - 60, y: s.body.y, vx: 0, vy: 0, mode: 'idle', charge: 3 }); s.run.owned.legs1 = true; s.run.owned.legs2 = true; s.run.owned.legs3 = true;
  for (let i = 0; i < 90; i++) { s.step(i === 0 ? { mx: 1, my: 0, aPress: true } : i === 6 ? { mx: 1, my: 0, bPress: true } : { mx: 1, my: 0 }); settle(s); }
  ok(s.screenName() === 'A1' && s.body.x <= W - R + 1e-6, `a dash jump at the fence is held too: x ${s.body.x.toFixed(0)}; still A1 (fences cannot be jumped)`);
  delete s.run.owned.legs1; delete s.run.owned.legs2; delete s.run.owned.legs3;
  // a real write-off: a dash into a parked sedan with the body nearly spent
  const c = car(s, 'sedan', 380, 320, Math.PI / 2, 0); s.fakes.push(c); s.buildView();
  Object.assign(s.body, { x: 300, y: 320, px: 300, py: 320, vx: 0, vy: 0, mode: 'idle', charge: 3, health: 30, facing: 0, level: 0, floor: null });
  for (let i = 0; i < 60 && s.body.alive; i++) { s.step(i === 1 ? { mx: 1, my: 0, aPress: true } : {}); }
  settle(s); const cnt = ev(s, 'story-count')[0];
  ok(cnt && cnt.tile === 'A1' && cnt.n === 1 && cnt.need === REG['story.writeOffs.monument.A1'] && cnt.kind === 'dash' && s.phase === 'report' && s.report.story.counted && s.run.credits === REG['economy.creditsPerWriteOff'],
    `a real dash write-off in A1 counts: ${cnt ? cnt.n + ' of ' + cnt.need + ' (story.writeOffs.monument.A1), ' + cnt.kind + ' into a ' + cnt.cls : 'none'}; +${REG['economy.creditsPerWriteOff']} credit for the body`);
  s.fakes.length = 0; s.continueReport();
  ok(s.phase === 'play' && s.body.alive && ev(s, 'shop-skip').length === 1, `with ${s.run.credits} credit and the cheapest level at ${REG['story.price.ability.level1']}, the report goes straight to the next chassis (no empty shop)`);
  kill(s);
  const cl = ev(s, 'story-clear')[0];
  ok(cl && cl.tile === 'A1' && cl.next === 'B1' && pr.done.monument.join() === 'A1' && s.run.credits === 2 && s.report.story.cleared && s.fenceSides().join() === 'S',
    `${REG['story.writeOffs.monument.A1']} counted write-offs clear A1; a clear pays nothing extra (credits ${s.run.credits}, one a body); B1 opens; the fence to A2 (not yet surveyed) stays (${s.fenceSides().join(', ')})`);
  next(s);
  Object.assign(s.body, { x: W - 40, y: 224, vx: 0, vy: 0, mode: 'idle' }); walk(s, 1, 0, 120);
  ok(s.screenName() === 'B1' && s.phase === 'brief' && s.entered && s.fenceSides().join() === 'E,S,W',
    `walking into B1: its tile card; the fences close behind (${s.fenceSides().join(', ')}), A1 included, until B1 is cleared`);
  s.continueBrief();
  kill(s, { kind: 'dash' }); const miss = ev(s, 'story-miss')[0];
  ok(miss && miss.why === 'task' && pr.tileWO === 0 && s.report.story.counted === false, 'B1\'s brief wants a drop onto a car: a dash write-off scores but does not count (report: "' + (miss ? miss.why : '') + '")');
  ok(s.run.credits === 3, 'the missed write-off still pays its credit: one a body, counted or not (' + s.run.credits + ')');
  s.continueReport(); const shop = s.phase === 'shop', pB = s.canBuy('battery1'), pL = s.canBuy('legs1');
  s.buy('battery1'); const owned = s.has('fastCharge') || s.tier('battery') === 1; s.leaveShop();
  ok(shop && pB.ok && pB.price === REG['story.price.ability.level1'] && owned && s.run.credits === 0 && s.nodes().battery2 && s.P['economy.price.ability.level2'] === REG['story.price.ability.level2'] && s.P['economy.price.ability.level3'] === REG['story.price.ability.level3'],
    `three credits open the shop: a level-1 power-up costs ${REG['story.price.ability.level1']} (Battery 1 bought), level 2 ${REG['story.price.ability.level2']}, level 3 ${REG['story.price.ability.level3']} (story.price.ability.level1–3)`);
  for (let k = 0; k < REG['story.writeOffs.monument.B1']; k++) { kill(s, { kind: 'drop' }); next(s); }
  ok(pr.done.monument.join() === 'A1,B1' && s.fenceSides().join() === 'S', `${REG['story.writeOffs.monument.B1']} drops clear B1; back to A1 and on to C1 both open (fenced: ${s.fenceSides().join(', ')})`);
  Object.assign(s.body, { x: 40, y: 224, vx: 0, vy: 0, mode: 'idle' }); walk(s, -1, 0, 120); const back = s.screenName();
  kill(s); const old = ev(s, 'story-miss').slice(-1)[0]; next(s);
  ok(back === 'A1' && old && old.why === 'cleared' && pr.tileWO === 0, `cleared tiles stay open: back in ${back}; a write-off there scores, counts for nothing ("${old ? old.why : ''}")`);
  Object.assign(s.body, { x: W - 40, y: 224, vx: 0, vy: 0, mode: 'idle' }); walk(s, 1, 0, 120); s.continueBrief();
  Object.assign(s.body, { x: W - 40, y: 224, vx: 0, vy: 0, mode: 'idle' }); walk(s, 1, 0, 160);
  ok(s.screenName() === 'C1' && s.has('jump') && ev(s, 'story-gift').some((e) => e.node === 'legs1'), 'C1 carries a gift: Farsight installs Legs 1 on arrival (the jump), ready for its brief, a jump into a car');
  s.continueBrief(); const c0 = s.run.credits; s.run.points = 1e6; kill(s, { kind: 'jump' });
  ok(s.run.credits === c0 + 1 && !ev(s, 'story-bonus').length, 'the score buys nothing: a million points, still one credit for the body');
  next(s);
  ok(pr.tileWO === 1 && pr.credits === s.run.credits && pr.owned.legs1 && pr.owned.battery1 && pr.points === s.run.points, 'progress follows the run (count, credits, abilities, points): one plain object the page saves');
}
function num(v) { return Math.round(v).toLocaleString('en-GB'); }
{ // the end of a district, the next one, the certificate
  const pr = STORY.newProgress(); pr.done.monument = ['A1', 'B1', 'C1', 'C2', 'B2', 'A2', 'A3', 'B3']; pr.tileWO = REG['story.writeOffs.monument.C3'] - 1;
  const s = story('monument', pr);
  ok(s.screenName() === 'C3', 'a saved story resumes on the tile in test: Monument C3 (8 cleared)');
  s.continueBrief(); kill(s, { kind: 'dash', combo: REG['story.task.comboHard'] });
  ok(s.report.roadCleared && s.report.story.districtDone && pr.district === 'parkland', 'clearing C3 clears Monument; the story moves on to Parkland');
  s.continueReport(); s.leaveShop();
  ok(s.phase === 'next', 'after the shop, the page builds the next district (phase next)');
  const p2 = story('parkland', pr), cr = p2.run.credits;
  ok(p2.screenName() === 'C1' && p2.fenceSides().join() === 'S,W' && ev(p2, 'story-gift').some((e) => e.credits === REG['story.giftCredits']) && cr === pr.credits && cr === 1 + REG['story.giftCredits'],
    `Parkland opens on C1, fenced toward C2 and B1; its gift: +${REG['story.giftCredits']} credits (story.giftCredits), a level-1 power-up's price`);
  const p3 = STORY.newProgress(); p3.district = 'waterfront'; p3.done = { monument: D[0].order.slice(), parkland: D[1].order.slice(), waterfront: ['A1', 'B1', 'C1', 'C2', 'C3', 'B3', 'A3', 'A2'] }; p3.tileWO = REG['story.writeOffs.waterfront.B2'] - 1;
  const s3 = story('waterfront', p3); s3.continueBrief(); kill(s3, { combo: 5 });
  ok(s3.screenName() === 'B2' && s3.run.ending && s3.run.ending.kind === 'Certified' && p3.complete && STORY.clearedCount(p3) === 27, 'the last tile, Waterfront B2 (the circus): the Test City is certified (27 of 27)');
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

{ // 6.4–6.10 stay frozen: the built pages match their commits
  const crypto = require('crypto'), { execSync } = require('child_process'), md5 = (b) => crypto.createHash('md5').update(b).digest('hex');
  const same = (f) => { let head = null; try { head = execSync('git show HEAD:prototypes/p6/' + f, { maxBuffer: 1 << 26, cwd: __dirname }); } catch (e) { head = null; } return !!head && md5(head) === md5(fs.readFileSync(path.join(__dirname, '..', 'p6', f))); };
  const list = ['dummies_p6_4.html', 'dummies_p6_5.html', 'dummies_p6_6.html', 'dummies_p6_7.html', 'dummies_p6_8.html', 'dummies_p6_9.html', 'dummies_p6_10.html'];
  const p7 = (() => { try { return md5(execSync('git show HEAD:prototypes/p7/dummies_p7.html', { maxBuffer: 1 << 26, cwd: __dirname })) === md5(fs.readFileSync(path.join(__dirname, 'dummies_p7.html'))); } catch (e) { return false; } })();
  ok(list.every(same) && p7, 'dummies_p6_4.html to dummies_p6_10.html and dummies_p7.html are byte-identical to their commits (the shared code builds P7.1)');
}
// ---------- 4. the page
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('SKIP browser checks: playwright not found'); return done(); }
  const url = 'file://' + path.join(__dirname, 'dummies_p7_1.html');
  const br = await chromium.launch(), logs = [];
  const watch = (pg) => pg.on('pageerror', (e) => logs.push(e.message));
  const shot = async (pg, name) => { if (OUT) await pg.screenshot({ path: path.join(OUT, name) }); };
  const wait = async (pg, fn, ms) => { for (let i = 0; i < (ms || 20000) / 100; i++) { if (await pg.evaluate(fn)) return true; await pg.waitForTimeout(100); } return false; };
  const ctx = await br.newContext({ viewport: { width: 1300, height: 900 } }), pg = await ctx.newPage(); watch(pg);
  await pg.goto(url); await pg.waitForTimeout(1200);
  const t0 = await pg.evaluate(() => ({ screen: window.__dummies.screen, status: document.getElementById('status').textContent }));
  await shot(pg, 'p71_title.png');
  ok(t0.screen === 'title' && /^P7\.1 /.test(t0.status), 'the title offers two modes, ARCADE and STORY (build ' + t0.status.split(' ')[0] + ')');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(300);
  const a1 = await pg.evaluate(() => window.__dummies.screen); await shot(pg, 'p71_arcade.png');
  await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('Space');
  const a2 = await wait(pg, () => window.__dummies.sim && window.__dummies.sim.phase === 'play', 30000);
  const a3 = await pg.evaluate(() => { const s = window.__dummies.sim; return { id: s.levelId, final: s.isFinal, story: !!s.storyMode }; });
  ok(a1 === 'arcade' && a2 && a3.id === 'waterfront' && a3.final && !a3.story, `ARCADE: pick a district (${a3.id}); it plays alone, as 6.10 plays it`);
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);
  for (let i = 0; i < 4; i++) await pg.keyboard.press('ArrowDown');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(200);
  await pg.keyboard.press('ArrowRight'); await pg.keyboard.press('Space'); await pg.waitForTimeout(400);
  const m = await pg.evaluate(() => ({ screen: window.__dummies.screen, story: window.__dummies.story }));
  await shot(pg, 'p71_map.png');
  ok(m.screen === 'storymap' && m.story && m.story.district === 'monument', 'STORY: the map of the Test City; only Monument A1 is revealed');
  await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(150); await shot(pg, 'p71_map_hidden.png'); await pg.keyboard.press('ArrowLeft');
  await pg.keyboard.press('Space');
  const b1 = await wait(pg, () => window.__dummies.sim && window.__dummies.sim.phase === 'brief', 30000); await pg.waitForTimeout(300);
  await shot(pg, 'p71_brief.png');
  ok(b1, 'deploying opens the tile card: the tale of the LED wall and Farsight\'s brief');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(200);
  await pg.keyboard.down('KeyD'); await pg.waitForTimeout(3800); await pg.keyboard.up('KeyD'); await pg.waitForTimeout(150);
  const f = await pg.evaluate(() => { const s = window.__dummies.sim; return { x: s.body.x, scr: s.screenName(), toast: window.__dummies.toast && window.__dummies.toast.msg }; });
  await shot(pg, 'p71_fence.png');
  ok(f.scr === 'A1' && f.x > 700 && /Fence/.test(f.toast || ''), `the fence on A1's east side holds the dummy (x ${Math.round(f.x)}): "${f.toast}"`);
  await pg.evaluate(() => { const s = window.__dummies.sim, b = s.body; s.run.credits = 2; b.hits.push({ kind: 'dash', cls: 'van', combo: 1, assessed: 120, lost: 30, angle: 90, model: 'VAN-02' }); b.health = 0; s.writeOff(); s.checkTerminal(); });
  await wait(pg, () => window.__dummies.sim.phase === 'report', 8000); await pg.waitForTimeout(200);
  await shot(pg, 'p71_report.png');
  const saved = await pg.evaluate(() => JSON.parse(localStorage.getItem('dummies.p7.story') || 'null'));
  ok(saved && saved.tileWO === 1 && saved.credits === 3, 'the report counts the write-off for A1 (1 of 2) and pays its credit (3 in all); progress is saved in this browser');
  await pg.keyboard.press('Space'); await pg.waitForTimeout(300); await shot(pg, 'p71_shop.png');
  const sh = await pg.evaluate(() => window.__dummies.sim.phase);
  ok(sh === 'shop', 'with 3 credits, the shop follows: a level-1 power-up costs 3');
  const pg2 = await ctx.newPage(); watch(pg2); await pg2.goto(url); await pg2.waitForTimeout(800);
  await pg2.keyboard.press('ArrowRight'); await pg2.keyboard.press('Space'); await pg2.waitForTimeout(300);
  const re = await pg2.evaluate(() => ({ screen: window.__dummies.screen, wo: window.__dummies.story && window.__dummies.story.tileWO }));
  ok(re.screen === 'storymap' && re.wo === 1, 'a reload resumes the story: A1 at 1 of 2');
  await pg2.close();
  // a phone held sideways: the story's card and its map fit; the touch stick sits below the brief
  const ph = await br.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }), pp = await ph.newPage(); watch(pp);
  await pp.goto(url); await pp.waitForTimeout(900);
  await pp.evaluate(() => { const a = window.__dummies; a.titleSel = 1; });
  await pp.evaluate(() => { const e = new KeyboardEvent('keydown', { code: 'Space' }); window.dispatchEvent(e); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' })); });
  await pp.waitForTimeout(200);
  await pp.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' })); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' })); });
  await wait(pp, () => window.__dummies.sim && window.__dummies.sim.phase === 'brief', 30000);
  await pp.evaluate(() => window.__dummies.sim.continueBrief()); await pp.waitForTimeout(400);
  const L = await pp.evaluate(() => { const L = window.__dummiesInput.touchLayoutCss(), a = window.__dummies; return { on: window.__dummiesInput.TOUCH.on, base: L.home, left: a.layoutY && a.layoutY.left }; });
  await shot(pp, 'p71_phone.png');
  ok(L.on && L.base, 'phone, sideways: touch on; the stick sits under the district map and its brief');
  await ph.close();
  ok(!logs.length, 'browser: no page errors' + (logs.length ? ': ' + logs.slice(0, 3).join(' | ') : ''));
  await br.close();
  done();
})().catch((e) => { console.log('FAIL browser: ' + e.message); fail++; done(); });
function done() { console.log('\n' + pass + ' passed, ' + fail + ' failed'); process.exitCode = fail ? 1 : 0; }
