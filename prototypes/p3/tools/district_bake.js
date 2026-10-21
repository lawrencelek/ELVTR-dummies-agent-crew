// Bake playtestable layouts per city district (GDD Edits 41–44). node tools/district_bake.js [candidates] [--keep k]
// Each candidate is generated from a seed, checked against the district contract, and kept if its road differs from those kept.
const path = require('path'), fs = require('fs');
const sim = require(path.join(__dirname, '..', 'sim.js'));
const { checkCity, startBot } = require('./district_check.js');
const BOT_SECS = 150, BOT_FIRST = 90; // the start screen must yield a write-off to the bot within BOT_SECS at Standard health, the first by BOT_FIRST (Edit 44)
const args = process.argv.slice(2), ki = args.indexOf('--keep');
const N = +(args.find((a) => /^\d+$/.test(a)) || 40), KEEP = ki >= 0 ? +args[ki + 1] : 3;
const P = Object.assign({}, sim.REG, sim.PROTO, sim.OVERRIDES);
const out = { version: 'edit44-2026-10-21', size: [P['world.width'], P['world.height']], note: 'Layouts per district. Regenerate with tools/district_bake.js; playtest before replacing.', districts: {} };
for (const id of sim.DISTRICT_LIST) {
  const kept = [], sigs = new Set(), report = [];
  for (let k = 0; k < N && kept.length < KEEP; k++) {
    const seed = 50021 + sim.DISTRICT_LIST.indexOf(id) * 7919 + k * 104729;
    const D = sim.planCity(id, P, seed);
    if (!D) { report.push(seed + ' no plan'); continue; }
    const sig = D.path.map((c) => c.join('')).join('-') + '|' + D.cells[1][1].center.length;
    if (sigs.has(sig)) { report.push(seed + ' duplicate road'); continue; }
    const probs = checkCity(D, P, sim);
    if (probs.length) { report.push(seed + ' ' + probs.slice(0, 3).join('; ')); continue; }
    const bot = startBot(sim, D, {}, BOT_SECS);
    if (!bot.writeOffs) { report.push(seed + ' start screen: bot 0 write-offs in ' + BOT_SECS + ' s (' + bot.impacts + ' hits)'); continue; }
    if (bot.firstWriteOff > BOT_FIRST) { report.push(seed + ' start screen: slow, first write-off at ' + bot.firstWriteOff + ' s'); continue; }
    sigs.add(sig); const L = sim.bakeCity(D, P); L.bot = bot; kept.push(L);
    report.push(seed + ' kept as layout ' + kept.length + ' (bot: first write-off ' + bot.firstWriteOff + ' s, ' + bot.writeOffs + ' in ' + BOT_SECS + ' s)');
  }
  out.districts[id] = kept;
  console.log(id + ': ' + kept.length + ' kept\n  ' + report.join('\n  '));
}
const file = path.join(__dirname, '..', '..', '..', 'content', 'districts', 'districts.json');
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(out));
console.log('wrote', path.relative(process.cwd(), file), (fs.statSync(file).size / 1024).toFixed(0) + ' KB');
