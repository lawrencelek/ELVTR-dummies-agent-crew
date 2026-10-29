// The coding agent's probe harness: runs "sim" probes headless in Node against the game's own modules.
// Usage: node coder/harness.js probes.json [--check]
//   probes.json: [{ id, expr }]. expr is the body of an async function of H; it returns true/false or { ok, detail }.
//   --check: compile each expr only.
// Prints one JSON line per probe: { id, ok, detail, error, ms }. A thrown error is a probe defect, never a pass or a fail.
//
// H, the harness API (this block is what the analyst and the coder are shown):
//   H.STORY, H.W6, H.X          the game modules: prototypes/p7/story.js, prototypes/p6/world6.js, prototypes/p6/sim.js
//   H.REG                       every default the Story runs with (sim.js REG, PROTO, OVERRIDES, world6 P6SIM, story P7SIM)
//   H.reg(id)                   the registry entry for id from content/params/tuning.parameters.json, or null
//   H.progress(d, t, o)         a saved story with every tile before district d's tile t cleared; t in test.
//                               o.tileWO: write-offs already counted on t. Any other key of o is copied onto the progress
//   H.story(d, pr)              a StorySim for district d and progress pr; its traffic removed (only H.car cars appear)
//   H.arcade(d)                 an ArcadeSim (Arcade, one district). H.sim6(d): a 6.10 Sim6 (the frozen rules)
//   H.car(s, cls, x, y, h, v)   a test car (class cls, heading h radians, speed v) that joins s's view
//   H.settle(s)                 steps s through hitstop, scroll and writeoff phases
//   H.ready(s)                  brings s to phase 'play': delivers an owed part (the gift screen continued), continues the card
//   H.kill(s, hit)              writes the chassis off by a crafted last hit (default { kind: 'dash', cls: 'sedan', combo: 1 }),
//                               then checkTerminal and settle. Returns s
//   H.next(s)                   the report, then the next chassis (continueReport, leaveShop)
//   H.step(s, n, cmd)           n frames of input cmd (default {}), settling after each
//   H.runTo(s, pred, n)         steps s until pred(s) or n frames (default 2400); returns pred(s)
//   H.ev(s, type)               s's events of that type
//   H.scene(s, tile)            the scene of tile ('B2') in s's district: props, dummyMonument, game (floors, statics)
//   H.certify(o)                Waterfront B2 in test with the other 26 tiles cleared and one write-off left; its part
//                               delivered, its card continued, then the last write-off (combo 5). Returns the sim at once.
//                               o: as H.progress (e.g. { points: 123456, chassis: 40, t: 3600 })
//   H.src(path)                 a repository file's text (path from the repository root)
//
// Sim facts (the shapes probes read):
//   s.phase                     'brief' · 'play' · 'gift' · 'hitstop' · 'scroll' · 'writeoff' · 'report' · 'shop' · 'next' · 'ending'
//   s.run.ending                null, or an object: { kind: 'Certified' | 'Licensed' | 'Failed test' | 'Non-compliant', t, writeOffs, points }
//   s.story                     Story's progress object: district, done, tileWO, owned, points, chassis, writeOffs, t, gifts, complete
//   s.events                    [{ t, type, ...data }] in order; s.emit(type, data) adds one. H.ev(s, type) filters them
//   s.screenName()              the tile on screen ('B2'); s.sc its scene; s.levelId the district; s.storyMode true in Story
//   s.body                      { x, y, mode ('idle', 'lunge', 'jump', 'rescue', …), alive, health, hits: [{ kind, cls, combo, … }] }
//   s.rescue                    a drone at work, or null: { phase, ferry, gift, tile, drone: { x, y, alt, state } }
//   s.report.story              after a Story write-off: { counted, cleared, next, districtDone, storyDone, parts, nextGift }
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const req = (p) => require(path.join(ROOT, p));

function makeH() {
  const STORY = req('prototypes/p7/story.js'), W6 = req('prototypes/p6/world6.js'), X = req('prototypes/p6/sim.js');
  const REG = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES, W6.P6SIM, STORY.P7SIM);
  const regFile = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/params/tuning.parameters.json'), 'utf8'));
  const byId = new Map(regFile.entries.map((e) => [e.id, e]));
  let CID = 0;
  const H = {
    STORY, W6, X, REG,
    reg: (id) => byId.get(id) || null,
    progress(d, t, o) {
      const pr = STORY.newProgress(); pr.done = {};
      for (const D of STORY.DIST) {
        if (D.id === d) { const i = D.order.indexOf(t); if (i < 0) throw new Error('no tile ' + d + ' ' + t); pr.done[D.id] = D.order.slice(0, i); break; }
        pr.done[D.id] = D.order.slice();
      }
      pr.district = d;
      const opt = Object.assign({}, o || {}); pr.tileWO = opt.tileWO || 0; delete opt.tileWO;
      return Object.assign(pr, opt);
    },
    story(d, pr) {
      const s = new STORY.StorySim(d, {}, pr, { warm: 0 });
      for (const sm of s.W6.sims) { sm.cars.length = 0; sm.slot = sm.schedule.length; sm.deckNext = { 0: 1e9, 1: 1e9, 2: 1e9, 3: 1e9 }; }
      s.fakes = []; const orig = s.buildView.bind(s);
      s.buildView = function () { orig(); for (const f of this.fakes) if (!f.scr || f.scr === this.screenName()) this.cars.push(f); this.view = this.cars; };
      s.buildView();
      return s;
    },
    arcade: (d) => new STORY.ArcadeSim(d, {}, null, { warm: 0 }),
    sim6: (d) => new W6.Sim6(d, {}, null, { warm: 0, single: true }),
    car(s, cls, x, y, h, v) {
      const c = { id: 'test-' + cls + '-' + (CID++), model: 'TEST', cls, x, y, h: h || 0, L: s.P['vehicles.' + cls + '.length'], W: s.P['vehicles.' + cls + '.width'], v: v || 0, vx: Math.cos(h || 0) * (v || 0), vy: Math.sin(h || 0) * (v || 0), elev: 0, spent: false, inEpisode: false, touched: false, state: 'cruise' };
      (s.fakes = s.fakes || []).push(c); if (s.buildView) s.buildView(); return c;
    },
    settle(s) { for (let i = 0; i < 600 && (s.phase === 'hitstop' || s.phase === 'scroll' || s.phase === 'writeoff'); i++) s.step({}); return s; },
    ready(s) {
      for (let k = 0; k < 4 && s.phase !== 'play'; k++) {
        H.runTo(s, (q) => q.phase === 'gift' || q.phase === 'brief', 3000);
        if (s.phase === 'gift') s.continueGift();
        else if (s.phase === 'brief') s.continueBrief();
      }
      return s;
    },
    kill(s, hit) { const b = s.body; b.hits.push(Object.assign({ kind: 'dash', cls: 'sedan', combo: 1, cause: null }, hit || {})); b.health = 0; s.writeOff(); s.checkTerminal(); H.settle(s); return s; },
    next(s) { s.continueReport(); s.leaveShop(); return s; },
    step(s, n, cmd) { for (let i = 0; i < (n || 1); i++) { s.step(cmd || {}); H.settle(s); } return s; },
    runTo(s, pred, n) { for (let i = 0; i < (n || 2400) && !pred(s); i++) s.step({}); return !!pred(s); },
    ev: (s, type) => s.events.filter((e) => e.type === type),
    scene(s, tile) { const [c, r] = STORY.cellOf(tile); return s.W6.at(c, r); },
    certify(o) {
      const pr = H.progress('waterfront', 'B2', Object.assign({ tileWO: REG['story.writeOffs.waterfront.B2'] - 1 }, o || {}));
      const s = H.story('waterfront', pr); H.ready(s); H.kill(s, { combo: 5 }); return s;
    },
    src: (p) => fs.readFileSync(path.join(ROOT, p), 'utf8'),
  };
  return H;
}

async function main() {
  const file = process.argv[2], check = process.argv.includes('--check');
  const probes = JSON.parse(fs.readFileSync(file, 'utf8'));
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  let H = null;
  for (const p of probes) {
    const t0 = Date.now(), out = { id: p.id, ok: null, detail: null, error: null, ms: 0 };
    try {
      const fn = new AsyncFunction('H', p.expr);
      if (!check) {
        H = H || makeH();
        const r = await fn(H);
        if (r && typeof r === 'object' && 'ok' in r) { out.ok = !!r.ok; out.detail = r.detail == null ? null : String(r.detail).slice(0, 600); }
        else out.ok = !!r;
      } else out.ok = true;
    } catch (e) { out.error = (e && e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : String(e)).slice(0, 600); }
    out.ms = Date.now() - t0;
    process.stdout.write(JSON.stringify(out) + '\n');
  }
}
if (require.main === module) main().catch((e) => { console.error(e); process.exit(2); });
module.exports = { makeH };
