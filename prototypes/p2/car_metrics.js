// Car predictability metrics (automated). Same scripted dummy on every build.
const { Sim, LEVEL_LIST } = require('./sim.js');
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
function policy(s, i) {
  const b = s.body; if (!b.alive) return {};
  const tx = 400 + 300 * Math.sin(i / 400), ty = 300 + 90 * Math.sin(i / 170);
  const dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy);
  return d > 8 ? { mx: dx / d, my: dy / d, aPress: i % 150 === 0 } : { aPress: i % 150 === 0 };
}
for (const lvl of LEVEL_LIST) {
  const s = new Sim(lvl, { 'run.admissionInterval': 6, ['proto.traffic.' + lvl + '.interval']: 6, ['proto.quota.' + lvl]: 99, 'proto.health.standard': 800 });
  const prevH = new Map(); let snaps = 0, maxYaw = 0;
  for (let i = 0; i < 300 * 60; i++) {
    if (s.phase === 'report') s.continueReport();
    if (s.phase === 'shop') s.leaveShop();
    if (s.phase === 'ending') break;
    s.step(policy(s, i));
    for (const c of s.cars) {
      if (prevH.has(c.id) && c.v > 20) {
        const yaw = Math.abs(wrap(c.h - prevH.get(c.id))) * 60 * 180 / Math.PI;
        if (lvl !== 'corner') { maxYaw = Math.max(maxYaw, yaw); if (yaw > 360) snaps++; }
      }
      prevH.set(c.id, c.h);
    }
  }
  const commits = s.events.filter((e) => e.type === 'commit');
  const perCar = {};
  for (const e of commits) if (e.man === 'shift') perCar[e.car] = (perCar[e.car] || 0) + 1;
  const cars = s.run.admitted, shifts = commits.filter((e) => e.man === 'shift').length;
  const byCause = {}; for (const e of commits) { const k = e.man + ':' + e.cause; byCause[k] = (byCause[k] || 0) + 1; }
  console.log(lvl.padEnd(9), JSON.stringify({ cars, shiftsPerCar: +(shifts / Math.max(1, cars)).toFixed(2),
    carsWith3PlusShifts: Object.values(perCar).filter((n) => n >= 3).length, interrupts: s.events.filter((e) => e.type === 'interrupt').length,
    headingSnapsOver360degS: lvl === 'corner' ? 'n/a' : snaps, maxYawDegS: lvl === 'corner' ? 'n/a' : Math.round(maxYaw), byCause }));
}
