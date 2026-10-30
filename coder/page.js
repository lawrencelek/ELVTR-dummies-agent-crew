// The coding agent's page harness: runs "page" probes in the built game (Playwright Chromium, 1300 × 900).
// Usage: node coder/page.js probes.json build.html [shots folder]
//   probes.json: [{ id, expr }]. expr is the body of an async function of G; it returns true/false or { ok, detail }.
// Prints one JSON line per probe: { id, ok, detail, error, ms, errors }. A thrown error is a probe defect.
// Every probe also fails if the page threw an error while it ran.
//
// G, the page API (each probe gets a fresh page):
//   G.open()                    loads the build; resolves on the title screen
//   G.openStory(pr)             seeds save slot 1 with progress pr, then STORY › CONTINUE › DEPLOY; delivers an owed part
//                               and continues the tile card; resolves at phase 'play'
//   G.certifyProgress(o)        the progress H.certify uses: Waterfront B2 in test, 26 tiles cleared, one write-off left
//   G.lastWriteOff(hit)         in the page: the chassis written off by a crafted last hit (default a dash, combo 5)
//   G.eval(fn, arg)             page.evaluate(fn, arg). window.__dummies is the app (screen, sim, story, slot);
//                               window.__dummiesUI the test hooks (hud(), objective(sim), saves(), gift())
//   G.waitFor(fn, ms, arg)      polls fn in the page until it returns truthy; resolves true, or false after ms
//   G.press(key), G.wait(ms)    a key press (Space is A, Shift is B, Escape pauses); a pause
//   G.shot(name)                a screenshot into the run's shots folder
//   G.errors                    page errors so far
//   G.page                      the Playwright page
'use strict';
const fs = require('fs'), path = require('path');

async function main() {
  const [file, build, shots] = process.argv.slice(2);
  const probes = JSON.parse(fs.readFileSync(file, 'utf8'));
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { for (const p of probes) console.log(JSON.stringify({ id: p.id, ok: null, error: 'playwright not installed', ms: 0 })); return; }
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const H = require('./harness.js').makeH;
  let h = null;
  const br = await chromium.launch();
  const url = 'file://' + path.resolve(build);
  for (const p of probes) {
    const t0 = Date.now(), out = { id: p.id, ok: null, detail: null, error: null, ms: 0, errors: [] };
    const ctx = await br.newContext({ viewport: { width: 1300, height: 900 } }), page = await ctx.newPage();
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));
    const G = {
      page, errors,
      async open() { await page.goto(url); await page.waitForTimeout(800); await G.waitFor(() => window.__dummies && window.__dummies.screen === 'title', 15000); },
      async openStory(pr) {
        await page.goto(url); await page.waitForTimeout(300);
        await page.evaluate((o) => { localStorage.clear(); localStorage.setItem('dummies.p7.saveMoved', '1'); localStorage.setItem('dummies.p7.save1', JSON.stringify({ v: 1, name: 'AGENT TEST', saved: Date.now(), progress: o })); }, pr);
        await page.reload(); await page.waitForTimeout(800);
        await G.waitFor(() => window.__dummies && window.__dummies.screen === 'title', 15000);
        await page.keyboard.press('ArrowRight'); await page.keyboard.press('Space');
        await G.waitFor(() => window.__dummies.screen === 'saves', 5000);
        await page.keyboard.press('Space'); // CONTINUE, on the latest slot
        await G.waitFor(() => window.__dummies.screen === 'storymap', 5000);
        await page.keyboard.press('Space'); // DEPLOY
        await G.waitFor(() => window.__dummies.sim && (window.__dummies.sim.phase === 'brief' || window.__dummies.sim.phase === 'play' || window.__dummies.sim.phase === 'gift'), 30000);
        for (let k = 0; k < 6; k++) {
          const ph = await page.evaluate(() => window.__dummies.sim.phase);
          if (ph === 'play' && !(await page.evaluate(() => !!window.__dummies.sim.rescue || !!window.__dummies.sim.pendingBrief))) break;
          if (ph === 'gift') { await page.waitForTimeout(1500); await page.keyboard.press('Space'); }
          else if (ph === 'brief') { await page.waitForTimeout(300); await page.keyboard.press('Space'); }
          await G.waitFor(() => window.__dummies.sim.phase !== 'play' || !window.__dummies.sim.rescue, 20000);
          await page.waitForTimeout(200);
        }
        return G.waitFor(() => window.__dummies.sim && window.__dummies.sim.phase === 'play', 10000);
      },
      certifyProgress(o) { h = h || H(); return h.progress('waterfront', 'B2', Object.assign({ tileWO: h.REG['story.writeOffs.waterfront.B2'] - 1 }, o || {})); },
      lastWriteOff(hit) {
        return page.evaluate((x) => { const s = window.__dummies.sim, b = s.body; b.hits.push(Object.assign({ kind: 'dash', cls: 'sedan', combo: 5, cause: null, assessed: 400, lost: 30, angle: 90, model: 'SED-01' }, x || {})); b.health = 0; s.writeOff(); s.checkTerminal(); return s.phase; }, hit || null);
      },
      eval: (fn, arg) => page.evaluate(fn, arg),
      async waitFor(fn, ms, arg) { for (let i = 0; i < (ms || 10000) / 100; i++) { try { if (await page.evaluate(fn, arg)) return true; } catch (e) { /* page between loads */ } await page.waitForTimeout(100); } return false; },
      press: (k) => page.keyboard.press(k),
      wait: (ms) => page.waitForTimeout(ms),
      async shot(name) { if (shots) { fs.mkdirSync(shots, { recursive: true }); await page.screenshot({ path: path.join(shots, /\.(png|jpe?g)$/i.test(name) ? name : name + '.png') }); } },
    };
    try {
      const fn = new AsyncFunction('G', p.expr);
      const r = await fn(G);
      if (r && typeof r === 'object' && 'ok' in r) { out.ok = !!r.ok; out.detail = r.detail == null ? null : String(r.detail).slice(0, 600); }
      else out.ok = !!r;
    } catch (e) { out.error = (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : String(e)).slice(0, 600); }
    out.errors = errors.slice(0, 5);
    if (errors.length && out.ok) { out.ok = false; out.detail = 'page error: ' + errors[0]; }
    out.ms = Date.now() - t0;
    process.stdout.write(JSON.stringify(out) + '\n');
    await ctx.close();
  }
  await br.close();
}
main().catch((e) => { console.error(e); process.exit(2); });
