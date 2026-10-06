#!/usr/bin/env node
// A simple automated player for the DUMMIES vertical slice. Informational:
// it is not part of the release gate. It shows whether a level's quota can
// be reached by the plainest ambush: stand one lunge away from a lane, out of
// the cars' sight, and lunge so that it lands just in front of a car's nose.
// It never baits and never lunges head-on, so it earns less than a good player.
// Usage: node checks/bot_playthrough.js <build_dir> [seed]
const path = require("path");
const [buildDir, seedArg] = process.argv.slice(2);
if (!buildDir) { console.error("usage: bot_playthrough.js <build_dir> [seed]"); process.exit(2); }
const Sim = require(path.resolve(buildDir, "sim.js"));
const P = Sim.PARAMS, DT = 1 / 60, D = P.dummy, H = P.hall;
const seed = Number(seedArg || 1);

const s = Sim.createSim({ seed: seed });
const log = [], perLevel = {};
let lunges = 0, confirmTick = 0, lastMode = null, lastLevel = 0, lastBodies = 0, lastScore = 0;

function home(level, reachPx) {
  const L = P.levels[level - 1], off = reachPx * 0.96;           // one lunge from the lane centre
  if (L.kind === "road") return { x: H.x + H.w * 0.5, y: L.road.laneYs[0] - off };
  if (L.kind === "cross") return { x: H.x + H.w * 0.22, y: L.roadH.laneYs[0] - off };
  return { x: H.x + H.w * 0.5, y: H.y + H.h * 0.5 };
}
// time for an eased lunge (1 - (1 - t)^3) to cover dist px
function reachTime(dist, reach) { const f = Math.min(0.999, dist / (D.lungeDistance * reach)); return D.lungeDuration * (1 - Math.cbrt(1 - f)); }

for (let i = 0; i < 60 * 60 * 25 && !(s.mode === "over" && s.ending); i++) {
  if (s.mode !== lastMode) { if (s.mode === "card" && s.card) log.push(`t=${s.time.toFixed(0)}s L${s.level} card: ${s.card.title} | ${s.card.line}`); lastMode = s.mode; }
  if (s.level !== lastLevel) { lastLevel = s.level; perLevel[s.level] = { lunges: 0, hits: 0, start: s.time, faces: {} }; }
  const st = perLevel[s.level];
  if (s.score > lastScore && s.bodiesDestroyed === lastBodies) st.hits++;
  if (s.bodiesDestroyed > lastBodies) { st.hits++; lastBodies = s.bodiesDestroyed; }
  if (s.lastImpact && s.lastImpact.time !== st.lastT) { st.lastT = s.lastImpact.time; st.faces[s.lastImpact.face] = (st.faces[s.lastImpact.face] || 0) + 1; }
  lastScore = s.score; st.bodies = s.levelWriteOffs; st.spawned = s.vehiclesSpawned; st.quota = s.quota; st.allocation = s.allocation; st.end = s.time;

  const input = { dx: 0, dy: 0, lunge: false, confirm: false };
  if (s.mode !== "play") { confirmTick++; input.confirm = confirmTick % 20 < 2; Sim.step(s, input, DT); continue; }

  const d = s.dummy, reach = 1 - (1 - D.wearFloor) * (1 - d.health / D.maxHealth);
  let fire = null; const reachPx = D.lungeDistance * reach;
  for (const c of s.cars) {
    if (c.hit || c.speed < 1) continue;
    const rx = d.x - c.x, ry = d.y - c.y, along = rx * c.dirX + ry * c.dirY, lat = rx * (-c.dirY) + ry * c.dirX;
    if (Math.abs(lat) < reachPx * 0.88 || Math.abs(lat) > reachPx * 1.03) continue;      // the lunge must end on this car's line
    const ahead = along - c.speed * D.lungeDuration - c.length / 2 - D.radius;             // gap to the nose when the lunge lands
    if (ahead > 1 && ahead < 14) fire = { dx: -Math.sign(lat) * (-c.dirY), dy: -Math.sign(lat) * c.dirX };
  }
  if (fire && !d.lunging && !d.recovering) { input.dx = Math.round(fire.dx); input.dy = Math.round(fire.dy); input.lunge = true; lunges++; st.lunges++; }
  else if (!d.lunging) { const h = home(s.level, reachPx); if (Math.abs(h.x - d.x) > 4) input.dx = Math.sign(h.x - d.x); if (Math.abs(h.y - d.y) > 4) input.dy = Math.sign(h.y - d.y); }
  Sim.step(s, input, DT);
  if (input.lunge) Sim.step(s, { dx: 0, dy: 0, lunge: false, confirm: false }, DT);
}

const out = { seed, ending: s.ending, finalLevel: s.level, bodiesDestroyed: s.bodiesDestroyed, certificationTarget: P.certificationTarget, score: Math.round(s.score),
  simulatedSeconds: Math.round(s.time), levels: perLevel, cards: log.slice(0, 40) };
console.log(JSON.stringify(out, null, 2));
