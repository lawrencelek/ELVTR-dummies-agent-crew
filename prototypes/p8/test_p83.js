// Prototype 8.3 (GDD Edits 95–98) checks. Run from prototypes/p8: node test_p83.js [screenshot folder]
// Edit 98: less text. The intro screen (ui.introScreen): DUMMIES, the dummy steps in front of a car, one line (n36), START. The
// mode select, STORY first, with the user's two lines (n03, n34). A level card in both modes (ui.levelCard): Story's ACT, tile and
// level, the tale (15 to 20 words), >>> the goal; Arcade's district, grade, line and goal (n37). After the card a drone drops the
// dummy in from the left (world.droneDropIn). Story's splash on NEW GAME or CONTINUE (ui.storySplash). The user's lines are canon
// (U1). Style run --v83, then --v83-intro. Prototypes 8 to 8.2 frozen.
// Edit 97: the tales redrafted, 15 to 35 words (style.v2.tale.minWords, style.v2.tale.maxWords), the length the tile needs (style run
// --v82). Arcade's grades (arcade.grades, arcade.grade.*): no end at the quota; every quota of write-offs the grade rises, with a
// tougher chassis and denser traffic; the run ends when the shift's cars run out. HIGH SCORES under the two modes: a table per Arcade
// district and one for Story, kept in this browser (highscore.tableSize). Prototypes 8 and 8.1 frozen.
// Edit 96: a tale may run to 35 words (style.v2.tale.maxWords), still two sentences; 7.13's 27 tales, through the loop again on
// Style Guide V2.3 (style/loop.py --v81), then the story as one batch. The unused CBD and Campus districts in the lore (n27-n33):
// the simulation's district table, the content's places, the CBD's landmark name. Prototype 8 (dummies_p8.html) frozen.
// Edit 95: the lore refinement. Dummy Corporation narrates; Farsight, the publisher, is named only on the Credits card (the title
// menu, and after the CERTIFIED ending). Every in-game text of the company: at most two sentences and 20 words
// (style.v2.text.maxSentences, style.v2.text.maxWords); no exclamation marks. The text comes from one run of the style loop on
// Style Guide V2 (style/loop.py --v8), placed by make_lore.py. Gameplay is 7.13's: story_v2.json changes text fields only.
// 1. The lore layer: the run, story_v2.json, the notices, the barks, the credits, the registry. Arcade's grades, headless.
// 2. Frozen: 6.4 to 7.13, 8 and 8.1 byte-identical to their commits; prototypes/p7/build.py refuses to build.
// 3. The page: the build, the high scores, the Credits card, an Arcade shift in grades, and a text audit of every string drawn on a
//    tour (text_audit.js).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), { execSync, execFileSync, spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..'), OUT = process.argv[2] || null;
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else fail++; console.log((c ? 'PASS ' : 'FAIL ') + msg); };
const words = (s) => String(s).split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const sentences = (s) => String(s).split(/(?<=[.?!])\s+/).filter((x) => /[A-Za-z]/.test(x)).length;
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const SP = JSON.parse(read('style', 'style.params.json')), sp = (id) => { const e = SP.entries.find((x) => x.id === id); if (!e || typeof e.default !== 'number') throw new Error('no style parameter ' + id); return e.default; };
const MAXS = sp('style.v2.text.maxSentences'), MAXW = sp('style.v2.text.maxWords'), MAXT = sp('style.v2.tale.maxWords'), MINT = sp('style.v2.tale.minWords');
const RUN8 = '20261029-161328-v8', RUN81 = '20261029-172610-v81', RUN82 = '20261029-181530-v82'; // the runs whose text Prototype 8.3 keeps
// the user's own lines (Edit 98 §0), as typed; placed without "!" (ruling: deadpan), "Vehicles" in lower case as in A1's goal
const ASKED = { 'tale:monument:A1': "Fresh off the factory floor, you're ready to do some damage to yourself. Make your engineers proud!",
  'brief:any': 'Walk into the path of the incoming vehicles. Time your approach, and choose your angle carefully. Bonus points for combinations and lethal hits!',
  n03: 'Get your Dummy Certification in Shenzhen Smart City and learn about the Corporation.',
  n34: 'Get hit in fun, creative, and destructive ways before the Vehicles run out!' };
const placed = (t) => t.replace(/!$/, '.').replace('the Vehicles', 'the vehicles');

// ---------- 1. the lore layer
const win = { DUMMIES: require('../p6/sim.js') };
const SIM0 = JSON.stringify(['cbd', 'campus'].map((k) => win.DUMMIES.DISTRICTS[k]));
vm.runInNewContext(read('prototypes', 'p6', 'content.js'), { window: win });
win.FLEET_DB = JSON.parse(read('content', 'db', 'fleet.json'));
vm.runInNewContext(read('prototypes', 'p8', 'lore.js'), { window: win });
const L = win.DUMMIES_LORE, CR = win.DUMMIES_CREDITS, N = L.notices, F = win.FLEET_DB, CT = win.DUMMIES_CONTENT;
const RUN = path.join(ROOT, 'style', 'runs', L.run), V8 = JSON.parse(fs.readFileSync(path.join(RUN, 'v8_copy.json'), 'utf8'));
const acc = Object.entries(V8.accepted);
const own = acc.filter(([k]) => !k.includes('/'));
ok(L.build === 'P8.3' && L.edit === 98 && /-v83$/.test(L.run) && acc.length && acc.every(([, v]) => v) && V8.guide === 'STYLE_GUIDE_V2.md' && V8.base === RUN82 && V8.accepted['intro-line'],
  `lore.js comes from style run ${L.run} on Style Guide V2.7: ${own.length} pieces of its own (${own.map(([k]) => k).filter((k) => !/^tale-/.test(k)).join(', ')} and ${own.filter(([k]) => /^tale-/.test(k)).length} tales) and ${acc.length - own.length} kept from ${V8.base}, every one accepted at 10/10 and confirmed`);
ok(JSON.stringify(N) === JSON.stringify(V8.notices) && JSON.stringify(CR.lines) === JSON.stringify(V8.credits), 'lore.js carries the run\'s notices and credits unchanged');

const S1 = JSON.parse(read('content', 'story', 'story.json')), S2 = JSON.parse(read('content', 'story', 'story_v2.json'));
const strip = (s) => { s = JSON.parse(JSON.stringify(s)); delete s.meta; delete s.ending; for (const d of s.districts) { delete d.intro; for (const t of Object.values(d.tiles)) delete t.tale; } for (const k of Object.values(s.tasks)) { delete k.label; delete k.brief; } return JSON.stringify(s); };
ok(strip(S1) === strip(S2) && S2.meta.version === 'edit98-2026-10-29', 'story_v2.json equals story.json in every field but the text (orders, tasks, gifts, registry IDs): the game plays as 7.13');
const sameText = S2.districts.every((d) => d.intro === V8.acts[d.id] && Object.entries(d.tiles).every(([t, x]) => x.tale === V8.tales[d.id][t])) && S2.ending === V8.ending
  && Object.entries(V8.briefs).every(([k, b]) => S2.tasks[k].brief === b.brief && S2.tasks[k].label === b.label);
ok(sameText, 'story_v2.json\'s 27 tales, three act lines, ending and ' + Object.keys(V8.briefs).length + ' briefs are the run\'s accepted text');

const U = V8.user || {}, uPlaced = { 'tale:monument:A1': S2.districts.find((d) => d.id === 'monument').tiles.A1.tale, 'brief:any': S2.tasks.any.brief, n03: N.n03, n34: N.n34 };
ok(Object.keys(ASKED).every((k) => U[k] === placed(ASKED[k]) && uPlaced[k] === U[k]),
  `the user's four lines (U1) placed as typed, without "!": A1's tale "${U['tale:monument:A1']}"; A1's goal "${U['brief:any']}"; STORY "${U.n03}"; ARCADE "${U.n34}"`);
const userText = new Set(Object.values(U));
const goals = Object.entries(S2.tasks).filter(([k]) => k !== 'any'), V82 = JSON.parse(fs.readFileSync(path.join(ROOT, 'style', 'runs', RUN82, 'v8_copy.json'), 'utf8'));
const php = (t) => (String(t).match(/\{\w+\}/g) || []).sort().join();
const gbad = goals.filter(([k, x]) => sentences(x.brief) > MAXS || words(x.brief) > MAXW || /coverage gap/i.test(x.brief) || php(x.brief) !== php(V82.briefs[k].brief) || x.label !== V82.briefs[k].label);
ok(!gbad.length && goals.length === 10, `${goals.length} goals replace the briefs (F8): what to do, first; at most ${MAXS} sentences and ${MAXW} words; placeholders and labels kept; no "coverage gap" (8.2: "${V82.briefs.dash.brief}" → "${S2.tasks.dash.brief}")` + (gbad.length ? ' [' + gbad.map(([k]) => k).join(', ') + ']' : ''));

// the company's texts: the story, the briefs, the notices that are prose
const fall = {}; for (const m of read('prototypes', 'p6', 'game.js').matchAll(/LT\('(n\d\d)', '((?:[^'\\]|\\.)*)'/g)) fall[m[1]] = fall[m[1]] || m[2];
fall.n23 = 'FARSIGHT'; for (const it of JSON.parse(fs.readFileSync(path.join(ROOT, 'style', 'runs', RUN81, 'districts', 'r0_piece.json'), 'utf8')).items) fall[it.id] = fall[it.id] || it.text;
const isCaps = (t) => /[A-Z]/.test(t) && t === t.toUpperCase();
const story = [];
for (const d of S2.districts) { story.push({ id: 'act-' + d.id, text: d.intro }); for (const t of d.order) story.push({ id: d.id + ' ' + t, text: d.tiles[t].tale }); }
story.push({ id: 'ending', text: S2.ending });
const company = story.concat(Object.entries(S2.tasks).map(([k, x]) => ({ id: 'brief ' + k, text: x.brief })), Object.entries(N).filter(([k, t]) => !isCaps(fall[k] || '') && !isCaps(t)).map(([k, t]) => ({ id: k, text: t })));
const isTale = (x) => / [A-C][1-3]$/.test(x.id);
const over = company.filter((x) => !userText.has(x.text)).filter((x) => sentences(x.text) > MAXS || words(x.text) > (isTale(x) ? MAXT : MAXW) || (isTale(x) && words(x.text) < MINT) || /!/.test(x.text) || /farsight/i.test(x.text) || (isTale(x) && /\{\w+\}/.test(x.text)));
const c713 = Math.max(...S1.districts.flatMap((d) => Object.values(d.tiles).map((t) => t.tale.length))), c81 = Math.max(...S2.districts.flatMap((d) => Object.values(d.tiles).map((t) => t.tale.length)));
const tw = company.filter(isTale).map((x) => words(x.text)), rest = company.filter((x) => !isTale(x) && !userText.has(x.text)).reduce((a, x) => Math.max(a, words(x.text)), 0);
ok(!over.length && tw.length === 27 && c81 <= c713, `${company.length} company texts (the user's lines aside): each at most ${MAXS} sentences (style.v2.text.maxSentences). 27 tales ${MINT} to ${MAXT} words (style.v2.tale.minWords, style.v2.tale.maxWords): ${Math.min(...tw)} to ${Math.max(...tw)}, mean ${(tw.reduce((a, b) => a + b, 0) / tw.length).toFixed(1)}, ${tw.filter((n) => n > MAXW).length} past ${MAXW}. The longest tale ${c81} characters, inside 7.13's ${c713} (five lines on the card, four on the map); no placeholder in a tale (F5). The rest at most ${MAXW} (style.v2.text.maxWords), the longest ${rest}. No "!", no Farsight` + (over.length ? ' [over: ' + over.map((x) => x.id).join(', ') + ']' : ''));
const grams = new Map();
const opening = ['n36', 'n02', 'n03', 'n34', 'n24', 'n25', 'n26', 'n37'].map((k) => ({ id: k, text: N[k] })); // Edit 98: the review batch
for (const x of story.concat(opening)) { const w = x.text.toLowerCase().match(/[a-z0-9']+/g) || []; for (const g of new Set(w.slice(0, -3).map((_, i) => w.slice(i, i + 4).join(' ')))) grams.set(g, (grams.get(g) || []).concat(x.id)); }
const cap = sp('style.bark.maxStockEndings'), stock = [...grams].filter(([, ids]) => ids.length > cap);
ok(!stock.length && story.some((x) => /sacrific/i.test(x.text)), `the story's 31 texts and eight opening lines (the intro line, the mode cards, the district lines, Arcade's goal) as a batch, the user's lines included: no phrase of four words in more than ${cap} (T14, style.bark.maxStockEndings); the purpose stated once (V10): "${(story.find((x) => /sacrific/i.test(x.text)) || {}).text}"` + (stock.length ? ' [' + stock.map(([g, ids]) => g + ': ' + ids.join(', ')).join('; ') + ']' : ''));

const spec = {}; for (const [r, c] of [[RUN8, 'notices'], [RUN8, 'arcade-banners'], [RUN81, 'districts'], [RUN82, 'arcade-grades'], [L.run, 'notices-83'], [L.run, 'intro-line']]) for (const it of JSON.parse(fs.readFileSync(path.join(ROOT, 'style', 'runs', r, c, 'r0_piece.json'), 'utf8')).items) spec[it.id] = it;
const ph = (t) => (String(t).match(/\{[A-Z]+\}/g) || []).sort().join();
const bad = Object.entries(N).filter(([k, t]) => !spec[k] || ph(t) !== ph(spec[k].text) || (spec[k].caps && !isCaps(t)) || t.length > spec[k].maxChars || /farsight/i.test(t));
ok(Object.keys(N).length === 37 && !bad.length, `37 notices (n01 to n37): each keeps its placeholders, its capitals and its width; none names Farsight` + (bad.length ? ' [' + bad.map(([k]) => k).join(', ') + ']' : ''));
const swaps = { n04: 'TRAINING BRIEF', n06: 'CORPORATION DRONE', n11: 'CORPORATION GIFT · +{N} CREDITS', n12: 'NEXT FROM THE CORPORATION', n22: 'DUMMY CORPORATION', n23: 'DUMMY CORP' };
ok(Object.entries(swaps).every(([k, v]) => N[k] === v) && /^A Corporation drone brings/.test(N.n13), 'the interface: ' + Object.entries(swaps).map(([k, v]) => `${fall[k]} → ${v}`).join(' · ') + ' · "' + N.n13 + '"');
ok(CT.interface.copy.toast['drone-dispatch'] === N.n18 && CT.interface.copy.toast['rescue-dispatch'] === N.n17 && CT.interface.copy.toast.rescued === N.n19
  && CT.interface.copy.endings.Licensed === N.n20 && CT.interface.copy.endings['Failed test'] === N.n21 && CT.terminal.title.lines[0] === N.n02,
  'lore.js patches the bundled content before the game reads it: three drone toasts, the Licensed and Failed test endings, Arcade\'s title line');
const bk = F.barks.filter((b) => /farsight/i.test(b.text) || sentences(b.text) > MAXS);
ok(!bk.length && F.canon.company === 'Dummy Corporation' && Object.keys(V8.barks).every((id) => F.barks.find((b) => b.id === id).text === V8.barks[id].text),
  `${F.barks.length} barks: ${Object.keys(V8.barks).length} rewritten by the run (${Object.keys(V8.barks).join(' ')}); none names Farsight, none over ${MAXS} sentences; the fleet's company is Dummy Corporation`);
const D = win.DUMMIES.DISTRICTS, PL = CT.places.districts;
const distText = JSON.stringify([D.cbd, D.campus, PL.cbd, PL.campus]);
ok(!/farsight/i.test(distText) && D.campus.name === N.n27 && D.cbd.blurb === N.n28 && D.campus.blurb === N.n29 && PL.cbd.intro === N.n30 && PL.campus.intro === N.n31 && PL.cbd.screens.B2 === N.n32
  && /FARSIGHT/.test(SIM0) && read('prototypes', 'p6', 'game.js').includes("tower: LT('n33', 'FARSIGHT Tower')"),
  `the unused districts (Edit 96 §3.4), patched by lore.js: Campus "${N.n27}" — "${N.n29}"; CBD "${N.n28}"; banners "${N.n30}" / "${N.n31}"; CBD B2 "${N.n32}"; its landmark "${N.n33}". No Farsight left in either district`);
ok(JSON.stringify(CR.lines) === JSON.stringify(['DUMMIES', 'A game by Lawrence Lek', 'Published by Farsight']), 'the Credits card: ' + CR.lines.join(' · ') + ' (the one place Farsight is named)');
const REG = JSON.parse(read('content', 'params', 'tuning.parameters.json'));
const NEW = ['arcade.grades', 'arcade.grade.healthStep', 'arcade.grade.densityStep', 'arcade.grade.max', 'highscore.tableSize'], RB = new Map(REG.entries.map((e) => [e.id, e]));
const FLAGS = ['ui.introScreen', 'ui.levelCard', 'world.droneDropIn', 'ui.storySplash'], NEW83 = FLAGS.concat(['ui.intro.loopSeconds', 'ui.splash.cycleSeconds']);
ok(REG.entries.length === 518 && REG.registryVersion === 'edit98-2026-10-29' && NEW.concat(NEW83).every((k) => RB.has(k)) && ['arcade.grades'].concat(FLAGS).every((k) => RB.get(k).default === 0),
  `the registry: ${REG.entries.length} entries, ${REG.registryVersion}; new: ${NEW83.map((k) => k + ' ' + RB.get(k).default).join(', ')} (Prototype 8.3 sets the four flags 1). The style limits are IDs in style/style.params.json`);

// Arcade's grades, headless: Prototype 8.2's values from the registry; a write-off every 20 s until the shift's cars run out
{
  const STORY = require('../p7/story.js'), SIM8 = { 'arcade.grades': 1 }; for (const k of NEW.slice(1, 4)) SIM8[k] = RB.get(k).default;
  const play = (ov) => {
    const s = new STORY.ArcadeSim('parkland', ov, null), rate = s.P['simulation.tickRate'], h0 = s.maxHealth(); let t = 0;
    while (!s.run.ending && t < 20 * 60 * rate) {
      if (s.phase === 'play' && s.body.alive && t > 0 && t % (20 * rate) === 0) { const b = s.body; b.hits.push({ kind: 'dash', cls: 'van', combo: 1, assessed: 120, lost: 30, angle: 90, model: 'VAN-02' }); b.health = 0; s.writeOff(); s.checkTerminal(); }
      if (s.phase === 'report') s.continueReport(); if (s.phase === 'shop') s.leaveShop(); s.step({}); t++;
    }
    return { s, h0, min: t / rate / 60, grades: s.events.filter((e) => e.type === 'grade').map((e) => [e.grade, e.health]) };
  };
  const g = play(SIM8), q = g.s.quota, max = SIM8['arcade.grade.max'], e = g.s.run.ending;
  const okGrades = g.grades.length === max - 1 && g.grades.every(([gr, hp], i) => gr === i + 2 && hp === Math.round(g.h0 * (1 + SIM8['arcade.grade.healthStep'] * (gr - 1))));
  const k = g.s.W6.densityOf ? g.s.W6.densityOf() : 1;
  ok(okGrades && e.kind === 'Licensed' && e.grade === max && e.writeOffs > q && g.s.carsLeft() === 0 && Math.abs(k - (1 + SIM8['arcade.grade.densityStep'] * (max - 1))) < 1e-9,
    `Parkland in grades (quota ${q}): grade ${g.grades.map(([gr, hp]) => gr + ' at ' + hp + ' health').join(', ')}; density ×${k.toFixed(2)} at grade ${max}; the shift ends when its ${g.s.W6.budget} cars run out: ${e.kind}, ${e.writeOffs} write-offs, grade ${e.grade}, ${g.min.toFixed(1)} min`);
  const old = play({});
  ok(old.s.run.ending.kind === 'Licensed' && old.s.run.ending.writeOffs === old.s.quota && !old.grades.length && old.s.grade === undefined,
    `without arcade.grades (Prototype 7's rule): Licensed at the quota, ${old.s.run.ending.writeOffs} write-offs, no grades`);
}

// the level card and the drone drop, headless: the sim holds on the card; the drone flies in from the left edge and sets the dummy down
{
  const STORY = require('../p7/story.js'), ov = { 'ui.levelCard': 1, 'world.droneDropIn': 1 };
  const drop = (s) => {
    const rate = s.P['simulation.tickRate'], t0 = s.tick; for (let i = 0; i < rate; i++) s.step({}); const held = s.phase === 'brief' && s.tick === t0;
    const to = { x: s.body.x, y: s.body.y }; s.continueBrief(); const rs = s.rescue, start = rs && rs.dropIn && s.body.x < 0;
    let n = 0; while (s.rescue && n < 30 * rate) { s.step({}); n++; }
    const ev = s.events.find((e) => e.type === 'dropped-in'), b = s.body;
    return { held, start, ev, landed: !!ev && b.x === to.x && b.y === to.y && b.mode === 'idle' && s.phase === 'play', to };
  };
  const a = drop(new STORY.ArcadeSim('parkland', ov, null, { warm: 0 })), st = drop(new STORY.StorySim('monument', ov, STORY.newProgress(), { warm: 0 }));
  const plain = new STORY.ArcadeSim('parkland', {}, null, { warm: 0 });
  ok(a.held && a.start && a.landed && st.held && st.start && st.landed && plain.phase === 'play' && !plain.rescue,
    `the level card holds the sim (Arcade and Story); then the drone drop (world.droneDropIn): from x −40, set down at the spawn in ${a.ev && a.ev.seconds} s (Arcade, (${a.to.x}, ${a.to.y})) and ${st.ev && st.ev.seconds} s (Story, Monument A1). Without the flags, Arcade starts in play`);
}

// ---------- 2. frozen
{
  const md5 = (b) => crypto.createHash('md5').update(b).digest('hex');
  const same = (rel) => { try { return md5(execSync('git show HEAD:' + rel, { maxBuffer: 1 << 26, cwd: ROOT })) === md5(fs.readFileSync(path.join(ROOT, rel))); } catch (e) { return false; } };
  const p6 = ['4', '5', '6', '7', '8', '9', '10'].map((v) => 'prototypes/p6/dummies_p6_' + v + '.html').concat(['prototypes/p8/dummies_p8.html', 'prototypes/p8/p8_page.html', 'prototypes/p8/dummies_p8_1.html', 'prototypes/p8/p8_1_page.html', 'prototypes/p8/dummies_p8_2.html', 'prototypes/p8/p8_2_page.html']);
  const p7 = ['prototypes/p7/dummies_p7.html'].concat(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'].map((v) => 'prototypes/p7/dummies_p7_' + v + '.html'));
  const frozen = p6.concat(p7).filter(same);
  const b = spawnSync('python3', [path.join(ROOT, 'prototypes', 'p7', 'build.py')], { encoding: 'utf8' });
  ok(frozen.length === p6.length + p7.length && b.status !== 0 && /frozen/.test(b.stderr + b.stdout) && same('prototypes/p7/dummies_p7_13.html'),
    `dummies_p6_4.html to dummies_p7_13.html, Prototypes 8, 8.1 and 8.2 and their pages (${frozen.length} files) are byte-identical to their commits; prototypes/p7/build.py refuses: "${(b.stderr || b.stdout).trim().slice(0, 60)}…"`);
}

// ---------- 3. the page
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('SKIP browser checks: playwright not found'); return done(); }
  const url = 'file://' + path.join(__dirname, 'dummies_p8_3.html');
  const br = await chromium.launch(), logs = [];
  const ctx = await br.newContext({ viewport: { width: 1300, height: 900 } });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await ctx.addInitScript(() => { window.__drawn = []; const o = CanvasRenderingContext2D.prototype.fillText; CanvasRenderingContext2D.prototype.fillText = function (t, ...a) { window.__drawn.push(String(t)); return o.call(this, t, ...a); }; });
  const pg = await ctx.newPage(); pg.on('pageerror', (e) => logs.push(e.message));
  const key = async (k, n, ms) => { for (let i = 0; i < (n === undefined ? 1 : n); i++) { await pg.keyboard.press(k); await pg.waitForTimeout(ms || 160); } };
  const wait = async (fn, ms) => { for (let i = 0; i < (ms || 20000) / 100; i++) { if (await pg.evaluate(fn).catch(() => false)) return true; await pg.waitForTimeout(100); } return false; };
  const shot = async (n) => { if (OUT) await pg.screenshot({ path: path.join(OUT, n) }); };
  const clear = () => pg.evaluate(() => { window.__drawn.length = 0; });
  const drawn = () => pg.evaluate(() => window.__drawn.slice(-160));
  const has = (d, t) => d.join(' ').includes(t); // a wrapped text is drawn line by line
  await pg.goto(url); await pg.waitForTimeout(1500);
  // the intro screen
  const i0 = await pg.evaluate(() => ({ screen: window.__dummies.screen, drawn: window.__drawn.slice(-40) })); await shot('p83_intro.png');
  ok(i0.screen === 'intro' && i0.drawn.includes('DUMMIES') && has(i0.drawn, N.n36) && i0.drawn.some((t) => /START$/.test(t)),
    `the intro screen first (ui.introScreen): DUMMIES; the dummy steps into the road, a car comes on; "${N.n36}"; START`);
  await clear(); await key('Space', 1, 500);
  const t0 = await pg.evaluate(() => ({ screen: window.__dummies.screen, status: document.getElementById('status').textContent, items: window.__dummiesUI.titleItems(), title: document.title, drawn: window.__drawn.slice(-80) }));
  const sim8 = await pg.evaluate(() => window.DUMMIES_SIM);
  ok(t0.screen === 'title' && /^P8\.3 /.test(t0.status) && t0.title === 'DUMMIES P8.3' && t0.items.join() === 'STORY,ARCADE,HIGH SCORES,CREDITS'
    && has(t0.drawn, N.n03) && has(t0.drawn, N.n34) && !has(t0.drawn, N.n01)
    && ['arcade.grades'].concat(FLAGS).every((k) => sim8[k] === 1) && NEW.slice(1).concat(NEW83.slice(4)).every((k) => sim8[k] === RB.get(k).default),
    `START opens the mode select: build ${t0.status.split(' ')[0]}; ${t0.items.join(' · ')}; STORY "${N.n03}"; ARCADE "${N.n34}"; no subtitle line. The page's values are the registry's (${JSON.stringify(sim8)})`);
  const hi = t0.items.indexOf('HIGH SCORES');
  await key('ArrowRight', hi); await key('Space', 1, 400); await shot('p83_scores_empty.png');
  const b0 = await pg.evaluate(() => ({ screen: window.__dummies.screen, tables: window.__dummiesUI.scoreTables(), drawn: window.__drawn.slice(-80) }));
  await key('ShiftLeft', 1, 300); const b1 = await pg.evaluate(() => window.__dummies.screen); await key('ArrowLeft', hi);
  ok(b0.screen === 'scores' && b0.tables.join() === 'arcade:parkland,arcade:waterfront,arcade:monument,story' && b0.drawn.includes('HIGH SCORES') && b0.drawn.includes('SAVED IN THIS BROWSER') && b1 === 'title',
    'HIGH SCORES on the mode select opens the board: PARKLAND · WATERFRONT · MONUMENT · STORY, saved in this browser; Back returns');
  const n = t0.items.indexOf('CREDITS');
  await key('ArrowRight', n); await key('Space', 1, 400); await shot('p8_credits.png');
  const c1 = await pg.evaluate(() => window.__dummiesUI.credits()); await key('Space', 1, 300);
  const c2 = await pg.evaluate(() => ({ open: window.__dummiesUI.credits(), screen: window.__dummies.screen }));
  await key('ShiftLeft', 1, 300); const c3 = await pg.evaluate(() => window.__dummies.screen); await key('Space', 1, 500);
  ok(c1 && !c2.open && c2.screen === 'title' && c3 === 'intro', 'CREDITS opens the card; A, Space or Back closes it. Back on the mode select returns to the intro screen');
  // Arcade: the level card, the drone drop, then a shift in grades
  const sel = await pg.evaluate(() => window.__dummies.titleSel), ai = t0.items.indexOf('ARCADE');
  await key('ArrowRight', (ai - sel + t0.items.length) % t0.items.length); await key('Space', 1, 300); await clear(); await key('Space');
  await wait(() => window.__dummies.sim && window.__dummies.sim.phase === 'brief', 30000); await pg.waitForTimeout(800); await shot('p83_arcade_card.png');
  const ac = await pg.evaluate(() => { const s = window.__dummies.sim; return { id: s.levelId, name: s.district && s.W6 ? null : null, q: s.quota, tick: s.tick, drawn: window.__drawn.slice(-80) }; });
  await pg.waitForTimeout(400); const tick2 = await pg.evaluate(() => window.__dummies.sim.tick);
  const dname = { monument: 'MONUMENT', parkland: 'PARKLAND', waterfront: 'WATERFRONT' }[ac.id], dline = N[{ monument: 'n24', parkland: 'n25', waterfront: 'n26' }[ac.id]], goal = N.n37.replace('{Q}', ac.q);
  ok(ac.drawn.includes('ARCADE: ' + dname) && ac.drawn.includes('Grade 1 of ' + RB.get('arcade.grade.max').default + '.') && has(ac.drawn, dline) && ac.drawn.includes('>>>') && has(ac.drawn, goal)
    && !ac.drawn.some((t) => /^DISTRICT \d OF 3/.test(t)) && tick2 === ac.tick,
    `Arcade's level card (ui.levelCard): ARCADE: ${dname} · Grade 1 of 5. · "${dline}" · >>> "${goal}". The banner is gone; the shift waits on the card`);
  await key('Space', 1, 100); await pg.waitForTimeout(500); await shot('p83_arcade_drop.png');
  const d0 = await pg.evaluate(() => { const s = window.__dummies.sim; return { drop: !!(s.rescue && s.rescue.dropIn), phase: s.phase }; });
  await wait(() => window.__dummies.sim.phase === 'play' && !window.__dummies.sim.rescue, 30000);
  const d1 = await pg.evaluate(() => { const s = window.__dummies.sim; return { ev: s.events.filter((e) => e.type === 'drop-in' || e.type === 'dropped-in'), mode: s.body.mode }; });
  const din = d1.ev.find((e) => e.type === 'dropped-in');
  ok(d0.drop && d0.phase === 'play' && din && d1.mode === 'idle' && logs.length === 0, `after the card, a Corporation drone flies the dummy in from the left and sets it down (world.droneDropIn): ${din && din.seconds} s, at (${din && din.x}, ${din && din.y})`);
  const dd = await pg.evaluate(() => JSON.stringify([window.DUMMIES.DISTRICTS.cbd, window.DUMMIES.DISTRICTS.campus, window.DUMMIES_CONTENT.places.districts.cbd, window.DUMMIES_CONTENT.places.districts.campus, window.FLEET_DB.barks.map((b) => b.text)]));
  ok(!/farsight/i.test(dd) && dd.includes(N.n27), 'in the page: the CBD and Campus districts, their places and every bark name no Farsight');
  // a shift in grades: three write-offs (grade 2 after the quota), then the shift's end; the score, its name, the board
  const o1 = await pg.evaluate(() => { const s = window.__dummies.sim; return { grade: s.grade, hp: s.maxHealth(), obj: window.__dummiesUI.objective(s)[1] }; });
  for (let k = 0; k < 3; k++) {
    await pg.evaluate(() => { const s = window.__dummies.sim, b = s.body; b.hits.push({ kind: 'dash', cls: 'van', combo: 1, assessed: 1200, lost: 30, angle: 90, model: 'VAN-02' }); s.run.points += 1200; b.health = 0; s.writeOff(); s.checkTerminal(); });
    await wait(() => window.__dummies.sim.phase === 'report', 8000); await pg.waitForTimeout(300);
    if (k === 1) await shot('p83_report_grade.png');
    await key('Space', 1, 400); await key('ShiftLeft', 1, 500); await wait(() => window.__dummies.sim.phase === 'play', 8000);
  }
  await pg.waitForTimeout(300);
  const o2 = await pg.evaluate(() => { const s = window.__dummies.sim; return { grade: s.grade, hp: s.maxHealth(), obj: window.__dummiesUI.objective(s)[1], toast: window.__drawn.filter((t) => /^GRADE \d/.test(t)).slice(-1)[0], drops: s.events.filter((e) => e.type === 'drop-in').length }; });
  ok(o1.grade === 1 && o2.grade === 2 && o2.hp === Math.round(o1.hp * (1 + RB.get('arcade.grade.healthStep').default)) && /^Grade 1: write off \d+ bodies for grade 2 \(0 of \d+\)\.$/.test(o1.obj) && /^Grade 2:/.test(o2.obj) && o2.toast === N.n35.replace('{G}', '2') && o2.drops === 1,
    `in play: "${o1.obj}" → after the quota, grade 2: "${o2.toast}"; the next chassis ${o1.hp} → ${o2.hp} health; "${o2.obj}". One drone drop a district, not one a write-off`);
  await pg.evaluate(() => { const s = window.__dummies.sim; s.phase = 'play'; s.end('Licensed'); }); await pg.waitForTimeout(800);
  await shot('p83_ending.png');
  const en = await pg.evaluate(() => ({ last: window.__dummiesUI.hsLast(), sc: window.__dummiesUI.scores(), drawn: window.__drawn.slice(-60) }));
  const row = en.last && (en.sc.tables[en.last.key] || []).find((q) => q.at === en.last.at);
  ok(en.last && en.last.rank === 1 && row && row.name === 'TRAINEE' && row.grade === 2 && row.writeOffs === 3 && en.drawn.includes('HIGH SCORE') && en.drawn.some((t) => /^RANK 1 OF \d+$/.test(t)) && en.drawn.includes('TRAINEE · ' + dname) && en.drawn.includes('Name this score'),
    `the shift's end records the score: ${en.last && en.last.key}, rank ${en.last && en.last.rank}, ${row && row.points} points, grade ${row && row.grade}, as TRAINEE; the ending offers "Name this score"`);
  await key('Space', 1, 400); await pg.keyboard.type('LEK'); await key('Enter', 1, 500); await shot('p83_scores.png');
  const nm = await pg.evaluate(() => ({ screen: window.__dummies.screen, sc: window.__dummiesUI.scores(), drawn: window.__drawn.slice(-80) }));
  await pg.reload(); await pg.waitForTimeout(1200);
  const kept = await pg.evaluate(() => window.__dummiesUI.scores());
  const r1 = (kept.tables[en.last.key] || [])[0];
  ok(nm.screen === 'scores' && nm.drawn.includes('LEK') && r1 && r1.name === 'LEK' && r1.points === row.points,
    `named on the keyboard: LEK, shown on the board, kept after a reload (this browser): ${JSON.stringify(r1)}`);
  // Story: a new game; the splash; the map; the level card; the drone drop. Then CONTINUE, from where the run left off
  await key('Space', 1, 500); await key('Space', 1, 400); await key('Space', 1, 300); await key('Enter', 1, 600);
  const sp = await pg.evaluate(() => ({ screen: window.__dummies.screen, drawn: window.__drawn.slice(-30) })); await pg.waitForTimeout(1200); await shot('p83_splash.png');
  await clear(); await key('Space', 1, 500);
  const mp = await pg.evaluate(() => ({ screen: window.__dummies.screen, drawn: window.__drawn.slice(-160) }));
  const M = S2.districts.find((d) => d.id === 'monument');
  ok(sp.screen === 'splash' && sp.drawn.includes('STORY') && mp.screen === 'storymap' && has(mp.drawn, M.intro) && !has(mp.drawn, M.tiles.A1.tale),
    `NEW GAME plays the Story splash (ui.storySplash): the dummy's parts fly apart and back; STORY. Then the map, the act line in the tile panel: "${M.intro}"`);
  await clear(); await key('Space'); await wait(() => window.__dummies.sim && window.__dummies.sim.phase === 'brief', 30000); await pg.waitForTimeout(800); await shot('p83_card_a1.png');
  const sc = await pg.evaluate(() => window.__drawn.slice(-80));
  ok(sc.includes('ACT I: MONUMENT') && sc.includes('Tile A1. Level 1 of 27.') && has(sc, M.tiles.A1.tale) && sc.includes('>>>') && has(sc, S2.tasks.any.brief)
    && !sc.includes('TRAINING BRIEF') && !sc.some((t) => /Fenced until cleared/.test(t)) && !sc.includes(M.tiles.A1.title),
    `Story's level card: ACT I: MONUMENT · Tile A1. Level 1 of 27. · "${M.tiles.A1.tale}" · >>> "${S2.tasks.any.brief}". No tile title, TRAINING BRIEF or fence line`);
  await key('Space', 1, 100); await pg.waitForTimeout(500); await shot('p83_story_drop.png');
  const s0 = await pg.evaluate(() => { const s = window.__dummies.sim; return !!(s.rescue && s.rescue.dropIn) && s.body.x < 200; });
  await wait(() => window.__dummies.sim.phase === 'play' && !window.__dummies.sim.rescue, 30000);
  const s1 = await pg.evaluate(() => window.__dummies.sim.events.find((e) => e.type === 'dropped-in'));
  await pg.reload(); await pg.waitForTimeout(1200); await key('Space', 1, 500); await key('Space', 1, 400);
  const sv = await pg.evaluate(() => ({ screen: window.__dummies.screen, sel: window.__dummies.saveSel, acts: window.__dummiesUI.slotActs(window.__dummies.saveSel) }));
  await key('Space', 1, 500); const cn = await pg.evaluate(() => window.__dummies.screen); await key('Space', 1, 500);
  const cm = await pg.evaluate(() => ({ screen: window.__dummies.screen, slot: window.__dummies.slot }));
  ok(s0 && s1 && sv.screen === 'saves' && sv.sel === 1 && sv.acts[0] === 'CONTINUE' && cn === 'splash' && cm.screen === 'storymap' && cm.slot === 1 && logs.length === 0,
    `then the drone drop in Story (${s1 && s1.seconds} s). After a reload: STORY, slot 1, CONTINUE plays the splash, then the map, from where the run left off. No page errors`);
  await br.close();

  const tmp = OUT || fs.mkdtempSync(path.join(require('os').tmpdir(), 'p8audit-')), aj = path.join(tmp, 'p8_texts.json');
  execFileSync('node', [path.join(__dirname, 'text_audit.js'), path.join(__dirname, 'dummies_p8_3.html'), aj].concat(OUT ? [OUT] : []), { stdio: 'pipe', timeout: 600000 });
  const A = JSON.parse(fs.readFileSync(aj, 'utf8'));
  const far = A.texts.filter((t) => /farsight/i.test(t.text)), outside = far.filter((t) => t.where.some((w) => !/\+credits$/.test(w)));
  const reached = ['intro', 'credits (title)', 'high scores (title)', 'arcade card', 'story splash', 'card A1', 'drone drop', 'gift screen (ferry)', 'card B1', 'plaque', 'certified', 'credits (ending)'].filter((x) => A.steps.includes(x));
  const st = A.scores && A.scores.tables.story && A.scores.tables.story[0], aw = A.scores && A.scores.tables['arcade:waterfront'];
  ok(st && st.name === 'TEST DUMMY 1' && st.points > 0 && aw && aw.length === 1,
    `the tour's scores: Arcade Waterfront ${aw && aw[0].points} points (one ending of three recorded); Story, CERTIFIED: ${st && st.name}, ${st && st.points} points, chassis ${st && st.chassis}`);
  ok(A.errors.length === 0 && reached.length === 12, `the text audit's tour: ${A.steps.length} steps (the intro, the mode select, Arcade's card, drone and three endings, pause, Story's saves, splash, map, cards, drone, gift screen, plaque, CERTIFIED, both Credits cards); ${A.count} strings drawn; no page errors`);
  ok(far.length === 1 && !outside.length && far[0].text === 'Published by Farsight' && far[0].where.includes('title+credits') && far[0].where.includes('sim:ending+credits'),
    'Farsight is drawn only on the Credits card: "' + far.map((t) => t.text + '" [' + t.where.join(', ')).join('; ') + '] (from the title, and after the CERTIFIED ending)');
  const longs = A.long.filter((l) => ![...userText].some((u) => u.includes(l.text || l)));
  ok(longs.length === 0, `no drawn line runs over two sentences or 20 words (the user's lines aside: ${A.long.length - longs.length})`);
  const T = new Set(A.texts.map((t) => t.text));
  ok(T.has('DUMMY CORPORATION') && T.has('TRAINING BRIEF · ANY WRITE-OFF') && T.has('NEXT FROM THE CORPORATION') && !T.has('TO CLEAR · 1 COUNTED WRITE-OFF') && !T.has('Fenced until cleared. Cleared tiles stay open.'),
    'drawn: the wordmark DUMMY CORPORATION; TRAINING BRIEF · ANY WRITE-OFF on the map; NEXT FROM THE CORPORATION on the gift screen. Gone with the old card: TO CLEAR · 1 COUNTED WRITE-OFF, the fence line');
  done();
})();
function done() { console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0); }
