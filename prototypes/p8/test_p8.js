// Prototype 8 (GDD Edit 95) checks. Run from prototypes/p8: node test_p8.js [screenshot folder]
// Edit 95: the lore refinement. Dummy Corporation narrates; Farsight, the publisher, is named only on the Credits card (the title
// menu, and after the CERTIFIED ending). Every in-game text of the company: at most two sentences and 20 words
// (style.v2.text.maxSentences, style.v2.text.maxWords); no exclamation marks. The text comes from one run of the style loop on
// Style Guide V2 (style/loop.py --v8), placed by make_lore.py. Gameplay is 7.13's: story_v2.json changes text fields only.
// 1. The lore layer: the run, story_v2.json, the notices, the barks, the credits, the registry.
// 2. Frozen: 6.4 to 7.13 byte-identical to their commits; prototypes/p7/build.py refuses to build.
// 3. The page: the build, the Credits card, and a text audit of every string drawn on a tour (text_audit.js).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), { execSync, execFileSync, spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..'), OUT = process.argv[2] || null;
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else fail++; console.log((c ? 'PASS ' : 'FAIL ') + msg); };
const words = (s) => String(s).split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const sentences = (s) => String(s).split(/(?<=[.?!])\s+/).filter((x) => /[A-Za-z]/.test(x)).length;
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const SP = JSON.parse(read('style', 'style.params.json')), sp = (id) => { const e = SP.entries.find((x) => x.id === id); if (!e || typeof e.default !== 'number') throw new Error('no style parameter ' + id); return e.default; };
const MAXS = sp('style.v2.text.maxSentences'), MAXW = sp('style.v2.text.maxWords');

// ---------- 1. the lore layer
const win = {};
vm.runInNewContext(read('prototypes', 'p6', 'content.js'), { window: win });
win.FLEET_DB = JSON.parse(read('content', 'db', 'fleet.json'));
vm.runInNewContext(read('prototypes', 'p8', 'lore.js'), { window: win });
const L = win.DUMMIES_LORE, CR = win.DUMMIES_CREDITS, N = L.notices, F = win.FLEET_DB, CT = win.DUMMIES_CONTENT;
const RUN = path.join(ROOT, 'style', 'runs', L.run), V8 = JSON.parse(fs.readFileSync(path.join(RUN, 'v8_copy.json'), 'utf8'));
const acc = Object.entries(V8.accepted);
ok(L.build === 'P8' && L.edit === 95 && acc.length && acc.every(([, v]) => v) && V8.guide === 'STYLE_GUIDE_V2.md',
  `lore.js comes from style run ${L.run} on Style Guide V2: ${acc.length} pieces, every one accepted at 10/10 and confirmed`);
ok(JSON.stringify(N) === JSON.stringify(V8.notices) && JSON.stringify(CR.lines) === JSON.stringify(V8.credits), 'lore.js carries the run\'s notices and credits unchanged');

const S1 = JSON.parse(read('content', 'story', 'story.json')), S2 = JSON.parse(read('content', 'story', 'story_v2.json'));
const strip = (s) => { s = JSON.parse(JSON.stringify(s)); delete s.meta; delete s.ending; for (const d of s.districts) { delete d.intro; for (const t of Object.values(d.tiles)) delete t.tale; } for (const k of Object.values(s.tasks)) { delete k.label; delete k.brief; } return JSON.stringify(s); };
ok(strip(S1) === strip(S2) && S2.meta.version === 'edit95-2026-10-29', 'story_v2.json equals story.json in every field but the text (orders, tasks, gifts, registry IDs): the game plays as 7.13');
const sameText = S2.districts.every((d) => d.intro === V8.acts[d.id] && Object.entries(d.tiles).every(([t, x]) => x.tale === V8.tales[d.id][t])) && S2.ending === V8.ending
  && Object.entries(V8.briefs).every(([k, b]) => S2.tasks[k].brief === b.brief && S2.tasks[k].label === b.label);
ok(sameText, 'story_v2.json\'s 27 tales, three act lines, ending and ' + Object.keys(V8.briefs).length + ' briefs are the run\'s accepted text');

// the company's texts: the story, the briefs, the notices that are prose
const fall = {}; for (const m of read('prototypes', 'p6', 'game.js').matchAll(/LT\('(n\d\d)', '((?:[^'\\]|\\.)*)'/g)) fall[m[1]] = fall[m[1]] || m[2];
fall.n23 = 'FARSIGHT';
const isCaps = (t) => /[A-Z]/.test(t) && t === t.toUpperCase();
const story = [];
for (const d of S2.districts) { story.push({ id: 'act-' + d.id, text: d.intro }); for (const t of d.order) story.push({ id: d.id + ' ' + t, text: d.tiles[t].tale }); }
story.push({ id: 'ending', text: S2.ending });
const company = story.concat(Object.entries(S2.tasks).map(([k, x]) => ({ id: 'brief ' + k, text: x.brief })), Object.entries(N).filter(([k, t]) => !isCaps(fall[k] || '') && !isCaps(t)).map(([k, t]) => ({ id: k, text: t })));
const over = company.filter((x) => sentences(x.text) > MAXS || words(x.text) > MAXW || /!/.test(x.text) || /farsight/i.test(x.text));
const longest = company.reduce((a, x) => Math.max(a, words(x.text)), 0);
ok(!over.length, `${company.length} company texts (31 story texts, ${Object.keys(S2.tasks).length} briefs, the prose notices): each at most ${MAXS} sentences and ${MAXW} words (style.v2.text.maxSentences, style.v2.text.maxWords), the longest ${longest}; no "!", no Farsight` + (over.length ? ' [over: ' + over.map((x) => x.id).join(', ') + ']' : ''));
const grams = new Map();
const opening = ['n01', 'n02', 'n03', 'n24', 'n25', 'n26'].map((k) => ({ id: k, text: N[k] }));
for (const x of story.concat(opening)) { const w = x.text.toLowerCase().match(/[a-z0-9']+/g) || []; for (const g of new Set(w.slice(0, -3).map((_, i) => w.slice(i, i + 4).join(' ')))) grams.set(g, (grams.get(g) || []).concat(x.id)); }
const cap = sp('style.bark.maxStockEndings'), stock = [...grams].filter(([, ids]) => ids.length > cap);
ok(!stock.length && story.some((x) => /sacrific/i.test(x.text)), `the story's 31 texts and the six opening lines (title, Arcade, district banners) as a batch: no phrase of four words in more than ${cap} (T14, style.bark.maxStockEndings); the purpose stated once (V10): "${(story.find((x) => /sacrific/i.test(x.text)) || {}).text}"` + (stock.length ? ' [' + stock.map(([g, ids]) => g + ': ' + ids.join(', ')).join('; ') + ']' : ''));

const spec = {}; for (const c of ['notices', 'arcade-banners']) for (const it of JSON.parse(fs.readFileSync(path.join(RUN, c, 'r0_piece.json'), 'utf8')).items) spec[it.id] = it;
const ph = (t) => (String(t).match(/\{[A-Z]+\}/g) || []).sort().join();
const bad = Object.entries(N).filter(([k, t]) => !spec[k] || ph(t) !== ph(spec[k].text) || (spec[k].caps && !isCaps(t)) || t.length > spec[k].maxChars || /farsight/i.test(t));
ok(Object.keys(N).length === 26 && !bad.length, `26 notices (n01 to n26): each keeps its placeholders, its capitals and its width; none names Farsight` + (bad.length ? ' [' + bad.map(([k]) => k).join(', ') + ']' : ''));
const swaps = { n04: 'TRAINING BRIEF', n06: 'CORPORATION DRONE', n11: 'CORPORATION GIFT · +{N} CREDITS', n12: 'NEXT FROM THE CORPORATION', n22: 'DUMMY CORPORATION', n23: 'DUMMY CORP' };
ok(Object.entries(swaps).every(([k, v]) => N[k] === v) && /^A Corporation drone brings/.test(N.n13), 'the interface: ' + Object.entries(swaps).map(([k, v]) => `${fall[k]} → ${v}`).join(' · ') + ' · "' + N.n13 + '"');
ok(CT.interface.copy.toast['drone-dispatch'] === N.n18 && CT.interface.copy.toast['rescue-dispatch'] === N.n17 && CT.interface.copy.toast.rescued === N.n19
  && CT.interface.copy.endings.Licensed === N.n20 && CT.interface.copy.endings['Failed test'] === N.n21 && CT.terminal.title.lines[0] === N.n02,
  'lore.js patches the bundled content before the game reads it: three drone toasts, the Licensed and Failed test endings, Arcade\'s title line');
const bk = F.barks.filter((b) => /farsight/i.test(b.text) || sentences(b.text) > MAXS);
ok(!bk.length && F.canon.company === 'Dummy Corporation' && Object.keys(V8.barks).every((id) => F.barks.find((b) => b.id === id).text === V8.barks[id].text),
  `${F.barks.length} barks: ${Object.keys(V8.barks).length} rewritten by the run (${Object.keys(V8.barks).join(' ')}); none names Farsight, none over ${MAXS} sentences; the fleet's company is Dummy Corporation`);
ok(JSON.stringify(CR.lines) === JSON.stringify(['DUMMIES', 'A game by Lawrence Lek', 'Published by Farsight']), 'the Credits card: ' + CR.lines.join(' · ') + ' (the one place Farsight is named)');
const REG = JSON.parse(read('content', 'params', 'tuning.parameters.json'));
ok(REG.entries.length === 507 && REG.registryVersion === 'edit94-2026-10-29', `the registry is unchanged: ${REG.entries.length} entries, ${REG.registryVersion}; the style limits are IDs in style/style.params.json (style.v2.text.maxSentences ${MAXS}, style.v2.text.maxWords ${MAXW})`);

// ---------- 2. frozen
{
  const md5 = (b) => crypto.createHash('md5').update(b).digest('hex');
  const same = (rel) => { try { return md5(execSync('git show HEAD:' + rel, { maxBuffer: 1 << 26, cwd: ROOT })) === md5(fs.readFileSync(path.join(ROOT, rel))); } catch (e) { return false; } };
  const p6 = ['4', '5', '6', '7', '8', '9', '10'].map((v) => 'prototypes/p6/dummies_p6_' + v + '.html');
  const p7 = ['prototypes/p7/dummies_p7.html'].concat(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'].map((v) => 'prototypes/p7/dummies_p7_' + v + '.html'));
  const frozen = p6.concat(p7).filter(same);
  const b = spawnSync('python3', [path.join(ROOT, 'prototypes', 'p7', 'build.py')], { encoding: 'utf8' });
  ok(frozen.length === p6.length + p7.length && b.status !== 0 && /frozen/.test(b.stderr + b.stdout) && same('prototypes/p7/dummies_p7_13.html'),
    `dummies_p6_4.html to dummies_p7_13.html (${frozen.length} pages) are byte-identical to their commits; prototypes/p7/build.py refuses: "${(b.stderr || b.stdout).trim().slice(0, 60)}…"`);
}

// ---------- 3. the page
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('SKIP browser checks: playwright not found'); return done(); }
  const url = 'file://' + path.join(__dirname, 'dummies_p8.html');
  const br = await chromium.launch(), logs = [];
  const ctx = await br.newContext({ viewport: { width: 1300, height: 900 } });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await ctx.addInitScript(() => { window.__drawn = []; const o = CanvasRenderingContext2D.prototype.fillText; CanvasRenderingContext2D.prototype.fillText = function (t, ...a) { window.__drawn.push(String(t)); return o.call(this, t, ...a); }; });
  const pg = await ctx.newPage(); pg.on('pageerror', (e) => logs.push(e.message));
  const key = async (k, n, ms) => { for (let i = 0; i < (n || 1); i++) { await pg.keyboard.press(k); await pg.waitForTimeout(ms || 160); } };
  const wait = async (fn, ms) => { for (let i = 0; i < (ms || 20000) / 100; i++) { if (await pg.evaluate(fn).catch(() => false)) return true; await pg.waitForTimeout(100); } return false; };
  await pg.goto(url); await pg.waitForTimeout(1200);
  const t0 = await pg.evaluate(() => ({ screen: window.__dummies.screen, status: document.getElementById('status').textContent, items: window.__dummiesUI.titleItems(), title: document.title }));
  ok(t0.screen === 'title' && /^P8 /.test(t0.status) && t0.title === 'DUMMIES P8' && t0.items.join() === 'ARCADE,STORY,CREDITS',
    `the title: build ${t0.status.split(' ')[0]}; ${t0.items.join(' · ')}`);
  const n = t0.items.indexOf('CREDITS');
  await key('ArrowRight', n); await key('Space', 1, 400); if (OUT) await pg.screenshot({ path: path.join(OUT, 'p8_credits.png') });
  const c1 = await pg.evaluate(() => window.__dummiesUI.credits()); await key('Space', 1, 300);
  const c2 = await pg.evaluate(() => ({ open: window.__dummiesUI.credits(), screen: window.__dummies.screen }));
  ok(c1 && !c2.open && c2.screen === 'title', 'CREDITS on the title opens the card; A, Space or Back closes it, back on the title');
  await key('ArrowLeft', n); await pg.evaluate(() => { window.__drawn.length = 0; });
  await key('Space', 1, 300); await key('Space');
  await wait(() => window.__dummies.sim && window.__dummies.sim.phase === 'play', 30000); await pg.waitForTimeout(700);
  const ban = await pg.evaluate(() => ({ id: window.__dummies.sim.levelId, drawn: window.__drawn.filter((t) => /^DISTRICT \d OF 3/.test(t)).slice(-1)[0] }));
  if (OUT) await pg.screenshot({ path: path.join(OUT, 'p8_arcade_banner.png') });
  ok(/· \d+ WRITE-OFFS?$/.test(ban.drawn || '') && logs.length === 0, `Arcade's opening banner: a label ("${ban.drawn}"), then ${ban.id}'s line: "${N[{ monument: 'n24', parkland: 'n25', waterfront: 'n26' }[ban.id]]}"`);
  await br.close();

  const tmp = OUT || fs.mkdtempSync(path.join(require('os').tmpdir(), 'p8audit-')), aj = path.join(tmp, 'p8_texts.json');
  execFileSync('node', [path.join(__dirname, 'text_audit.js'), path.join(__dirname, 'dummies_p8.html'), aj].concat(OUT ? [OUT] : []), { stdio: 'pipe', timeout: 600000 });
  const A = JSON.parse(fs.readFileSync(aj, 'utf8'));
  const far = A.texts.filter((t) => /farsight/i.test(t.text)), outside = far.filter((t) => t.where.some((w) => !/\+credits$/.test(w)));
  const reached = ['credits (title)', 'gift screen (ferry)', 'card B1', 'plaque', 'certified', 'credits (ending)'].filter((s) => A.steps.includes(s));
  ok(A.errors.length === 0 && reached.length === 6, `the text audit's tour: ${A.steps.length} steps (title, Arcade and its three endings, pause, Story's saves, map, cards, drone, gift screen, plaque, CERTIFIED, both Credits cards); ${A.count} strings drawn; no page errors`);
  ok(far.length === 1 && !outside.length && far[0].text === 'Published by Farsight' && far[0].where.includes('title+credits') && far[0].where.includes('sim:ending+credits'),
    'Farsight is drawn only on the Credits card: "' + far.map((t) => t.text + '" [' + t.where.join(', ')).join('; ') + '] (from the title, and after the CERTIFIED ending)');
  ok(A.long.length === 0, 'no drawn line runs over two sentences or 20 words');
  ok(A.texts.some((t) => t.text === 'DUMMY CORPORATION') && A.texts.some((t) => t.text === 'TRAINING BRIEF') && A.texts.some((t) => t.text === 'NEXT FROM THE CORPORATION') && A.texts.some((t) => /^TO CLEAR · 1 COUNTED WRITE-OFF$/.test(t.text)),
    'drawn: the wordmark DUMMY CORPORATION, TRAINING BRIEF and its count label (TO CLEAR · 1 COUNTED WRITE-OFF), NEXT FROM THE CORPORATION on the gift screen');
  done();
})();
function done() { console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0); }
