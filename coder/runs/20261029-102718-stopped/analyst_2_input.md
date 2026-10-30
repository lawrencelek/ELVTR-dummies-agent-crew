# Your requirements had these problems. Return the whole corrected JSON object.

- R-SHIP-FLIGHT: registry_uses proto.droneSpeed is not in the registry (new IDs go in registry_new)
- R-SHIP-FLIGHT: registry_uses proto.droneLiftSeconds is not in the registry (new IDs go in registry_new)
- R-SECOND-MARKET: registry_uses learning.playerHitCap is not in the registry (new IDs go in registry_new)
- R-SECOND-MARKET: registry_uses learning.playerHitStep is not in the registry (new IDs go in registry_new)

# Probe results on today's code
{}

# Your previous JSON
{
 "requirements": [
  {
   "id": "R-SHROUD",
   "title": "Shroud the circus's monument until Waterfront B2 clears",
   "statement": "In Story, the circus's monument is shrouded until B2 clears. A certified story shows it unveiled.",
   "sources": [
    "EDIT92#3.2:1",
    "EDIT92#3.2:2",
    "P7#known-gaps:7",
    "EDIT93#open:0",
    "EDIT92#open:0"
   ],
   "gdd_status": "proposed",
   "decision": "D76",
   "spec": "partial",
   "spec_gap": "The GDD does not say what the shroud looks like. It also does not say whether Arcade's Waterfront monument is shrouded; the finale is Story's, so Arcade is guarded as unchanged.",
   "impact": "reward",
   "depends_on": [],
   "touches": [
    {
     "file": "prototypes/p6/world6.js",
     "symbol": "dummyMonument / dummyStatue",
     "why": "carry a shrouded state on the scene's monument and draw the shroud over the statue"
    },
    {
     "file": "prototypes/p7/story.js",
     "symbol": "StorySim.reset / StorySim.checkTerminal",
     "why": "set shrouded from !progress.complete; lift it when the story is certified"
    },
    {
     "file": "prototypes/p6/game.js",
     "symbol": "drawLive6 / drawField6",
     "why": "draw the shrouded monument in Waterfront B2"
    }
   ],
   "registry_uses": [
    "world.dummyMonument"
   ],
   "registry_new": [],
   "contract": "Story only. H.scene(s,'B2').dummyMonument.shrouded === !progress.complete in a Waterfront StorySim, from the district's first tile on. The flag goes false when B2 clears and stays false for a certified save. Arcade's B2 monument is never shrouded. A 6.10 Sim6 has no dummyMonument.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "Waterfront's monument is shrouded at A1 and with B2 in test",
     "expr": "const a = H.story('waterfront', H.progress('waterfront', 'A1')); const b = H.story('waterfront', H.progress('waterfront', 'B2')); const ma = H.scene(a, 'B2')?.dummyMonument, mb = H.scene(b, 'B2')?.dummyMonument; return { ok: !!ma && !!mb && ma.shrouded === true && mb.shrouded === true, detail: `A1 ${ma?.shrouded} · B2 ${mb?.shrouded}` };"
    },
    {
     "id": "p2",
     "kind": "sim",
     "say": "after certifying, the monument is unveiled",
     "expr": "const s = H.certify(); for (let i = 0; i < 6000 && s.phase !== 'ending'; i++) { s.continueUnveil?.(); H.step(s, 1); } const m = H.scene(s, 'B2')?.dummyMonument; return { ok: s.story?.complete === true && !!m && m.shrouded === false, detail: `complete ${s.story?.complete} · shrouded ${m?.shrouded} · phase ${s.phase}` };"
    },
    {
     "id": "p3",
     "kind": "sim",
     "say": "a reloaded certified save stays unveiled; Arcade's monument is not shrouded; 6.10 has none",
     "expr": "const s = H.certify(); for (let i = 0; i < 6000 && s.phase !== 'ending'; i++) { s.continueUnveil?.(); H.step(s, 1); } const re = H.story('waterfront', JSON.parse(JSON.stringify(s.story))); const mr = H.scene(re, 'B2')?.dummyMonument; const ar = H.arcade('waterfront'); const ma = H.scene(ar, 'B2')?.dummyMonument; const w6 = H.sim6('waterfront'); const m6 = H.scene(w6, 'B2')?.dummyMonument; return { ok: !!mr && mr.shrouded === false && !!ma && ma.shrouded !== true && !m6, detail: `reload ${mr?.shrouded} · arcade ${ma ? ma.shrouded : 'none'} · 6.10 ${m6 ? 'monument' : 'none'}` };"
    },
    {
     "id": "p4",
     "kind": "page",
     "say": "in the page, B2 in test shows the monument shrouded (screenshot)",
     "expr": "await G.openStory(await G.certifyProgress()); const r = await G.eval(() => { const s = window.__dummies?.sim; return { tile: s?.screenName?.() ?? null, shrouded: s?.sc?.dummyMonument?.shrouded ?? null }; }); await G.shot('shroud_b2'); return { ok: r.tile === 'B2' && r.shrouded === true, detail: `tile ${r.tile} · shrouded ${r.shrouded}` };"
    }
   ]
  },
  {
   "id": "R-UNVEIL",
   "title": "Unveil the monument with the run's plaque after the last clear",
   "statement": "Clearing Waterfront B2 unveils the monument. The plaque shows the run: chassis spent, points, best combo, time.",
   "sources": [
    "EDIT92#3.2:1",
    "EDIT92#3.2:2",
    "P7#known-gaps:7",
    "EDIT93#open:0",
    "EDIT92#open:0"
   ],
   "gdd_status": "proposed",
   "decision": "D76",
   "spec": "partial",
   "spec_gap": "The GDD gives no length for the unveiling and does not say how it ends. The contract follows the gift screen's pattern (continueUnveil on A); a timed end would need a new registry ID. The plaque's wording and layout are not given.",
   "impact": "reward",
   "depends_on": [
    "R-SHROUD"
   ],
   "touches": [
    {
     "file": "prototypes/p7/story.js",
     "symbol": "StorySim.checkTerminal",
     "why": "on storyDone, enter phase 'unveil' with the plaque instead of ending at once"
    },
    {
     "file": "prototypes/p7/story.js",
     "symbol": "StorySim.step / continueUnveil / syncProgress / newProgress",
     "why": "hold the sim in 'unveil'; track the best combo on the progress"
    },
    {
     "file": "prototypes/p6/game.js",
     "symbol": "renderScreen / handleMenus / processEvents",
     "why": "draw the unveiling and plaque; A continues"
    }
   ],
   "registry_uses": [],
   "registry_new": [],
   "contract": "New sim phase 'unveil', entered after the write-off that certifies the city and before 'ending'. On entry: emit('unveil', { chassis, points, bestCombo, t }), with the same object on s.plaque. chassis = progress.chassis, points = progress.points, t = progress.t, bestCombo = the run's highest combo. progress.bestCombo is kept across saves (newProgress: 0). s.continueUnveil() leaves 'unveil' and does nothing in any other phase. Arcade never enters 'unveil'.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "certifying passes through 'unveil' with one unveil event, then reaches the Certified ending",
     "expr": "const s = H.certify(); let saw = false; for (let i = 0; i < 6000 && s.phase !== 'ending'; i++) { if (s.phase === 'unveil') saw = true; s.continueUnveil?.(); H.step(s, 1); } const u = H.ev(s, 'unveil'); return { ok: saw && u.length === 1 && s.run?.ending === 'Certified', detail: `unveil phase ${saw} · events ${u.length} · ending ${s.run?.ending}` };"
    },
    {
     "id": "p2",
     "kind": "sim",
     "say": "the plaque carries the run's chassis, points, best combo and time",
     "expr": "const s = H.certify({ points: 123456, chassis: 40, t: 3600, bestCombo: 7 }); for (let i = 0; i < 600 && !H.ev(s, 'unveil').length && s.phase !== 'ending'; i++) H.step(s, 1); const e = H.ev(s, 'unveil')[0], pl = s.plaque || e; const pr = s.story || {}; const ok = !!e && !!pl && pl.chassis === pr.chassis && pl.chassis >= 40 && Math.round(pl.points) === Math.round(pr.points) && pl.points >= 123456 && pl.bestCombo === 7 && pl.t >= 3600; return { ok, detail: `chassis ${pl?.chassis}/${pr.chassis} · points ${Math.round(pl?.points)} · combo ${pl?.bestCombo} · t ${pl?.t}` };"
    },
    {
     "id": "p3",
     "kind": "sim",
     "say": "the best combo is tracked on the progress: a fresh game has 0, and certify's combo 5 beats a saved 2",
     "expr": "const fresh = H.STORY.newProgress().bestCombo; const s = H.certify({ bestCombo: 2 }); for (let i = 0; i < 600 && !H.ev(s, 'unveil').length && s.phase !== 'ending'; i++) H.step(s, 1); const pl = s.plaque || H.ev(s, 'unveil')[0]; return { ok: fresh === 0 && pl?.bestCombo === 5 && s.story?.bestCombo === 5, detail: `fresh ${fresh} · plaque ${pl?.bestCombo} · progress ${s.story?.bestCombo}` };"
    },
    {
     "id": "p4",
     "kind": "sim",
     "say": "Story unveils; Arcade's Licensed end does not (Arcade frozen)",
     "expr": "const s = H.certify(); let saw = false; for (let i = 0; i < 6000 && s.phase !== 'ending'; i++) { if (s.phase === 'unveil') saw = true; s.continueUnveil?.(); H.step(s, 1); } const a = H.arcade('parkland'); H.ready(a); H.kill(a); H.next(a); H.kill(a); const arcOk = a.run?.ending === 'Licensed' && H.ev(a, 'unveil').length === 0 && a.phase !== 'unveil'; return { ok: saw && arcOk, detail: `story unveil ${saw} · arcade ${a.run?.ending} · arcade unveils ${H.ev(a, 'unveil').length}` };"
    },
    {
     "id": "p5",
     "kind": "page",
     "say": "in the page, the last write-off reaches the unveiling with its plaque (screenshot)",
     "expr": "await G.openStory(await G.certifyProgress()); await G.lastWriteOff(); const ok = await G.waitFor(() => window.__dummies?.sim?.phase === 'unveil', 12000); const pl = await G.eval(() => { const p = window.__dummies?.sim?.plaque; return p ? ['chassis', 'points', 'bestCombo', 't'].every((k) => p[k] != null) : false; }); await G.shot('unveil_plaque'); return { ok: ok && pl, detail: `unveil ${ok} · plaque ${pl}` };"
    }
   ]
  },
  {
   "id": "R-SHIP-FLIGHT",
   "title": "Fly the dummy over the river to the ship at Waterfront B3",
   "statement": "After the unveiling, a Farsight drone lifts the dummy over the river to the container ship at Waterfront B3. The ending screen follows.",
   "sources": [
    "EDIT92#3.2:1",
    "P7#known-gaps:7",
    "EDIT93#open:0",
    "EDIT92#open:0"
   ],
   "gdd_status": "proposed",
   "decision": "D76",
   "spec": "partial",
   "spec_gap": "The GDD does not say where on the ship the dummy is set down or what path the flight takes; the contract only asks for a point inside the ship's rectangle. It also does not say whether the dummy can be controlled during the flight.",
   "impact": "reward",
   "depends_on": [
    "R-UNVEIL"
   ],
   "touches": [
    {
     "file": "prototypes/p7/story.js",
     "symbol": "droneTo / stepRescue / startFerry",
     "why": "add a ship flight (rescue.ship) from B2 across the south edge to the ship in B3, then end('Certified')"
    },
    {
     "file": "prototypes/p6/world6.js",
     "symbol": "containerShip / waterTile",
     "why": "expose the ship's rectangle on B3's scene"
    },
    {
     "file": "prototypes/p6/game.js",
     "symbol": "drawDrone / renderScreen",
     "why": "draw the flight; then the ending screen"
    }
   ],
   "registry_uses": [
    "proto.droneSpeed",
    "proto.droneLiftSeconds"
   ],
   "registry_new": [],
   "contract": "After 'unveil': new sim phase 'ship', with s.rescue.ship === true and the body in mode 'rescue'. emit('story-ship', { from: 'B2', to: 'B3' }) when the drone lifts. On arrival: emit('story-shipped', { tile: 'B3', x, y }), with (x, y) inside H.scene(s,'B3').ship { x, y, w, h }. Then end('Certified'): phase 'ending', run.ending 'Certified'. Order: unveil ≤ story-ship ≤ story-shipped.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "unveil, then the drone lifts, reaches B3, and the Certified ending follows",
     "expr": "const s = H.certify(); for (let i = 0; i < 6000 && s.phase !== 'ending'; i++) { s.continueUnveil?.(); H.step(s, 1); } const u = H.ev(s, 'unveil')[0], a = H.ev(s, 'story-ship')[0], b = H.ev(s, 'story-shipped')[0]; const ok = !!u && !!a && !!b && u.t <= a.t && a.t <= b.t && b.tile === 'B3' && s.screenName() === 'B3' && s.phase === 'ending' && s.run?.ending === 'Certified'; return { ok, detail: `unveil ${u?.t} · ship ${a?.t} · shipped ${b?.t} ${b?.tile} · screen ${s.screenName()} · ${s.phase}` };"
    },
    {
     "id": "p2",
     "kind": "sim",
     "say": "the dummy is set down on the ship's rectangle in B3",
     "expr": "const s = H.certify(); for (let i = 0; i < 6000 && s.phase !== 'ending'; i++) { s.continueUnveil?.(); H.step(s, 1); } const b = H.ev(s, 'story-shipped')[0], sh = H.scene(s, 'B3')?.ship; const ok = !!b && !!sh && b.x >= sh.x && b.x <= sh.x + sh.w && b.y >= sh.y && b.y <= sh.y + sh.h; return { ok, detail: b && sh ? `at ${b.x},${b.y} · ship ${sh.x},${sh.y} ${sh.w}×${sh.h}` : `shipped ${!!b} · ship ${!!sh}` };"
    },
    {
     "id": "p3",
     "kind": "sim",
     "say": "the flight runs in phase 'ship' with the drone carrying the body",
     "expr": "const s = H.certify(); let saw = false; for (let i = 0; i < 6000 && s.phase !== 'ending'; i++) { if (s.phase === 'ship' && s.rescue?.ship === true && s.body?.mode === 'rescue') saw = true; s.continueUnveil?.(); H.step(s, 1); } return { ok: saw, detail: `ship phase carried ${saw} · end ${s.phase}` };"
    },
    {
     "id": "p4",
     "kind": "page",
     "say": "in the page, the drone flight to the ship is shown and the ending follows (screenshot)",
     "expr": "await G.openStory(await G.certifyProgress()); await G.lastWriteOff(); let ph = null, sawShip = false; for (let i = 0; i < 50; i++) { ph = await G.eval(() => window.__dummies?.sim?.phase ?? null); if (ph === 'ship' && !sawShip) { sawShip = true; await G.shot('ship_flight'); } if (ph === 'ending') break; if (ph === 'unveil') await G.press('Space'); await G.wait(400); } return { ok: sawShip && ph === 'ending', detail: `ship ${sawShip} · last ${ph}` };"
    }
   ]
  },
  {
   "id": "R-SHIP-CRATES",
   "title": "Put the dummy's face on every crate on the ship",
   "statement": "Every crate on the container ship at Waterfront B3 carries the dummy's face.",
   "sources": [
    "EDIT92#3.2:1"
   ],
   "gdd_status": "proposed",
   "decision": "D76",
   "spec": "partial",
   "spec_gap": "The GDD does not say what the face looks like (the welcome wall's face is a candidate). It does not say whether the faces show before the finale or on Arcade's ship. Cosmetic only, as world.storyArt.",
   "impact": "content",
   "depends_on": [
    "R-SHIP-FLIGHT"
   ],
   "touches": [
    {
     "file": "prototypes/p6/world6.js",
     "symbol": "containerShip",
     "why": "draw the face on each crate; list the crates on the scene's ship"
    }
   ],
   "registry_uses": [
    "world.storyArt"
   ],
   "registry_new": [],
   "contract": "H.scene(s,'B3').ship.crates: an array of crates, each with face === true, in a Waterfront StorySim. Art only: no solid, floor or spawn changes.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "the ship's crates exist and every one carries the face",
     "expr": "const s = H.story('waterfront', H.progress('waterfront', 'B2')); const c = H.scene(s, 'B3')?.ship?.crates; return { ok: Array.isArray(c) && c.length > 0 && c.every((k) => k?.face === true), detail: `crates ${Array.isArray(c) ? c.length : 'none'} · faced ${Array.isArray(c) ? c.filter((k) => k?.face).length : 0}` };"
    },
    {
     "id": "p2",
     "kind": "page",
     "say": "the ship in B3 during the flight shows faced crates (screenshot)",
     "expr": "await G.openStory(await G.certifyProgress()); await G.lastWriteOff(); let r = null; for (let i = 0; i < 50; i++) { r = await G.eval(() => { const s = window.__dummies?.sim; return { ph: s?.phase ?? null, tile: s?.screenName?.() ?? null, faced: !!s?.sc?.ship?.crates?.length && s.sc.ship.crates.every((k) => k?.face === true) }; }); if (r.ph === 'ship' && r.tile === 'B3') { await G.shot('ship_crates'); break; } if (r.ph === 'ending') break; if (r.ph === 'unveil') await G.press('Space'); await G.wait(400); } return { ok: r?.ph === 'ship' && r?.tile === 'B3' && r?.faced, detail: JSON.stringify(r) };"
    }
   ]
  },
  {
   "id": "R-ENDING-SCREEN",
   "title": "Keep the CERTIFIED ending screen as the story's last screen",
   "statement": "The ending screen reads CERTIFIED and Farsight's ending text. It closes the story after clearing Waterfront B2.",
   "sources": [
    "EDIT92#3.2:0",
    "EDIT92#3.2:2"
   ],
   "gdd_status": "built",
   "decision": null,
   "spec": "full",
   "spec_gap": "",
   "impact": "reward",
   "depends_on": [],
   "touches": [
    {
     "file": "prototypes/p6/game.js",
     "symbol": "drawEnding",
     "why": "the ending screen; unchanged, now reached after the ship flight"
    },
    {
     "file": "content/story/story.json",
     "symbol": "ending",
     "why": "the ending text"
    }
   ],
   "registry_uses": [],
   "registry_new": [],
   "contract": "STORY.DATA.ending is the GDD's text. Certifying ends in phase 'ending' with run.ending 'Certified' (after any 'unveil' and 'ship' phases).",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "the content's ending is the GDD's text",
     "expr": "const want = 'Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage.'; return { ok: H.STORY.DATA?.ending === want, detail: String(H.STORY.DATA?.ending).slice(0, 60) };"
    },
    {
     "id": "p2",
     "kind": "sim",
     "say": "certifying ends Certified in phase 'ending'",
     "expr": "const s = H.certify(); for (let i = 0; i < 6000 && s.phase !== 'ending'; i++) { s.continueUnveil?.(); H.step(s, 1); } return { ok: s.phase === 'ending' && s.run?.ending === 'Certified', detail: `${s.phase} · ${s.run?.ending}` };"
    },
    {
     "id": "p3",
     "kind": "page",
     "say": "in the page, the last write-off reaches the ending screen (screenshot)",
     "expr": "await G.openStory(await G.certifyProgress()); await G.lastWriteOff(); let ph = null; for (let i = 0; i < 50; i++) { ph = await G.eval(() => window.__dummies?.sim?.phase ?? null); if (ph === 'ending') break; if (ph === 'unveil') await G.press('Space'); await G.wait(400); } await G.shot('ending_certified'); const end = await G.eval(() => window.__dummies?.sim?.run?.ending ?? null); return { ok: ph === 'ending' && end === 'Certified', detail: `phase ${ph} · ending ${end}` };"
    }
   ]
  },
  {
   "id": "R-CERTIFIED-STAMP",
   "title": "Stamp a cleared story's save CERTIFIED",
   "statement": "Clearing everything marks the save CERTIFIED: the slot card reads CERTIFIED · ALL 27 TILES.",
   "sources": [
    "EDIT92#3.2:2"
   ],
   "gdd_status": "built",
   "decision": null,
   "spec": "full",
   "spec_gap": "",
   "impact": "reward",
   "depends_on": [],
   "touches": [
    {
     "file": "prototypes/p7/story.js",
     "symbol": "StorySim.checkTerminal",
     "why": "sets progress.complete"
    },
    {
     "file": "prototypes/p6/game.js",
     "symbol": "slotLines",
     "why": "the slot card's CERTIFIED line"
    }
   ],
   "registry_uses": [],
   "registry_new": [],
   "contract": "progress.complete === true after certifying; slotLines prints 'CERTIFIED · ALL ' + STORY.TOTAL + ' TILES'.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "the certifying write-off sets progress.complete",
     "expr": "const s = H.certify(); return { ok: s.story?.complete === true && H.STORY.TOTAL === 27, detail: `complete ${s.story?.complete} · total ${H.STORY.TOTAL}` };"
    },
    {
     "id": "p2",
     "kind": "code",
     "say": "the slot card prints the CERTIFIED stamp",
     "file": "prototypes/p6/game.js",
     "pattern": "'CERTIFIED · ALL ' \\+ STORY\\.TOTAL"
    }
   ]
  },
  {
   "id": "R-NARRATIVE-DELIVERY",
   "title": "Deliver Narrative A: act lines, act numerals and 27 tales",
   "statement": "The act line opens each district's first card and heads every card. The map shows the act numerals I, II, III. All 27 tiles carry tales.",
   "sources": [
    "EDIT92#3:6"
   ],
   "gdd_status": "built",
   "decision": null,
   "spec": "full",
   "spec_gap": "",
   "impact": "content",
   "depends_on": [],
   "touches": [
    {
     "file": "content/story/story.json",
     "symbol": "districts[].act / tiles[].tale",
     "why": "the acts and the tales"
    },
    {
     "file": "prototypes/p6/game.js",
     "symbol": "drawBrief / drawStoryMap",
     "why": "the act line on the card; the map's numerals"
    }
   ],
   "registry_uses": [],
   "registry_new": [],
   "contract": "STORY.DIST[i].act holds ACT I · INDUCTION, ACT II · OPENING DAY and ACT III · CUSTOMS in order. All 27 tiles have tales with no exclamation marks. drawBrief heads the card with d.act.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "the three districts carry their acts in order",
     "expr": "const a = H.STORY.DIST.map((d) => d.act || ''); const ok = /ACT I\\b/.test(a[0]) && /INDUCTION/.test(a[0]) && /ACT II\\b/.test(a[1]) && /OPENING DAY/.test(a[1]) && /ACT III\\b/.test(a[2]) && /CUSTOMS/.test(a[2]); return { ok, detail: a.join(' | ') };"
    },
    {
     "id": "p2",
     "kind": "sim",
     "say": "27 tales, none empty, no exclamation marks",
     "expr": "const tales = H.STORY.DIST.flatMap((d) => d.order.map((t) => d.tiles[t]?.tale || '')); return { ok: tales.length === 27 && tales.every((x) => x.length > 0 && !x.includes('!')), detail: `tales ${tales.length} · longest ${Math.max(...tales.map((x) => x.length))}` };"
    },
    {
     "id": "p3",
     "kind": "code",
     "say": "the tile card is headed with the act line",
     "file": "prototypes/p6/game.js",
     "pattern": "d\\.act \\? d\\.act \\+ ' · '"
    }
   ]
  },
  {
   "id": "R-FINALE-CREDITS",
   "title": "Roll the credits over the voyage",
   "statement": "Credits run over the voyage.",
   "sources": [
    "EDIT92#3.2:1",
    "EDIT92#open:0"
   ],
   "gdd_status": "proposed",
   "decision": "D77",
   "spec": "none",
   "spec_gap": "The GDD gives no credits text, order, speed or length. It does not say whether they run over the drone flight or over a separate voyage scene.",
   "impact": "content",
   "depends_on": [
    "R-SHIP-FLIGHT"
   ],
   "touches": [
    {
     "file": "content/story/story.json",
     "symbol": "endCredits",
     "why": "the credits' lines"
    },
    {
     "file": "prototypes/p6/game.js",
     "symbol": "renderScreen (new drawEndCredits)",
     "why": "draw the credits over the flight to the ship"
    }
   ],
   "registry_uses": [],
   "registry_new": [],
   "contract": "story.json gains endCredits, a non-empty array of lines; it is not economy credits. game.js drawEndCredits draws them while sim.phase is 'ship'.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "the content carries the credits' lines",
     "expr": "const c = H.STORY.DATA?.endCredits; return { ok: Array.isArray(c) && c.length > 0 && c.every((l) => typeof l === 'string' && l.length > 0), detail: `lines ${Array.isArray(c) ? c.length : 'none'}` };"
    },
    {
     "id": "p2",
     "kind": "code",
     "say": "the page draws the credits",
     "file": "prototypes/p6/game.js",
     "pattern": "function drawEndCredits\\("
    }
   ]
  },
  {
   "id": "R-SECOND-MARKET",
   "title": "Offer Second Market: the city again, the cars' learning kept",
   "statement": "Clearing everything gives Second Market: the city again, with the cars' learning kept.",
   "sources": [
    "EDIT92#3.2:2",
    "EDIT93#open:0",
    "EDIT92#open:0"
   ],
   "gdd_status": "proposed",
   "decision": "D77",
   "spec": "partial",
   "spec_gap": "The GDD does not say how Second Market is started (a menu item, the save slot), whether it keeps parts, points or chassis, which slot it uses, or whether it ends differently.",
   "impact": "reward",
   "depends_on": [
    "R-CERTIFIED-STAMP"
   ],
   "touches": [
    {
     "file": "prototypes/p7/story.js",
     "symbol": "newProgress / syncProgress / StorySim.constructor",
     "why": "save the cars' models on progress.learning; load them into a new run"
    },
    {
     "file": "prototypes/p7/story.js",
     "symbol": "api (new secondMarket)",
     "why": "build Second Market's progress from a certified one"
    },
    {
     "file": "prototypes/p6/game.js",
     "symbol": "savesMenu / endItems",
     "why": "offer Second Market for a certified save"
    }
   ],
   "registry_uses": [
    "learning.playerHitCap",
    "learning.playerHitStep"
   ],
   "registry_new": [],
   "contract": "progress.learning[cls] = { applied, standoffApplied }, synced from sim.models and loaded into sim.models by StorySim. STORY.secondMarket(pr) returns a new progress with market 2, no tiles cleared, complete false and pr.learning kept. A new game's models start untrained.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "a saved learning is loaded into the cars' models and kept on the progress",
     "expr": "const s = H.certify({ learning: { sedan: { applied: 3, standoffApplied: 1 } } }); return { ok: (s.models?.sedan?.applied ?? 0) >= 3 && (s.story?.learning?.sedan?.applied ?? 0) >= 3, detail: `model ${s.models?.sedan?.applied} · saved ${s.story?.learning?.sedan?.applied}` };"
    },
    {
     "id": "p2",
     "kind": "sim",
     "say": "Second Market restarts the city with the learning kept; a new game starts untrained",
     "expr": "const s = H.certify({ learning: { sedan: { applied: 3, standoffApplied: 1 } } }); const pr2 = H.STORY.secondMarket?.(JSON.parse(JSON.stringify(s.story))); if (!pr2) return { ok: false, detail: 'no secondMarket' }; const t = H.story('monument', pr2); const f = H.story('monument', H.STORY.newProgress()); const ok = pr2.market === 2 && H.STORY.clearedCount(pr2) === 0 && !pr2.complete && (t.models?.sedan?.applied ?? 0) >= 3 && (f.models?.sedan?.applied ?? -1) === 0; return { ok, detail: `market ${pr2.market} · cleared ${H.STORY.clearedCount(pr2)} · kept ${t.models?.sedan?.applied} · fresh ${f.models?.sedan?.applied}` };"
    }
   ]
  },
  {
   "id": "R-TILE-GRADE",
   "title": "Grade a tile on its clear",
   "statement": "Points are a score only; nothing yet ranks or grades a tile. Edit 90's grade is open.",
   "sources": [
    "P7#known-gaps:1"
   ],
   "gdd_status": "gap",
   "decision": null,
   "spec": "none",
   "spec_gap": "The GDD names a tile grade (Edit 90) but gives no scale, thresholds, inputs or display. Its D-item is not in the candidates.",
   "impact": "feedback",
   "depends_on": [],
   "touches": [
    {
     "file": "prototypes/p7/story.js",
     "symbol": "StorySim.checkTerminal",
     "why": "grade the cleared tile (pr.tilePoints is already kept)"
    },
    {
     "file": "prototypes/p6/game.js",
     "symbol": "drawReport",
     "why": "show the grade"
    }
   ],
   "registry_uses": [],
   "registry_new": [],
   "contract": "On a clear, report.story.grade is set and progress.tileGrades['<district>:<tile>'] keeps it.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "clearing Monument A1 grades the tile on the report and the progress",
     "expr": "const s = H.story('monument', H.progress('monument', 'A1')); H.ready(s); H.kill(s); const g = s.report?.story?.grade, k = s.story?.tileGrades?.['monument:A1']; return { ok: s.report?.story?.cleared === true && g != null && g !== '' && k === g, detail: `cleared ${s.report?.story?.cleared} · grade ${g} · saved ${k}` };"
    },
    {
     "id": "p2",
     "kind": "sim",
     "say": "a write-off that clears nothing carries no grade",
     "expr": "const s = H.story('parkland', H.progress('parkland', 'C2')); H.ready(s); H.kill(s); const s2 = H.story('monument', H.progress('monument', 'A1')); H.ready(s2); H.kill(s2); return { ok: s.report?.story?.cleared === false && s.report?.story?.grade == null && s2.report?.story?.grade != null, detail: `C2 cleared ${s.report?.story?.cleared} grade ${s.report?.story?.grade} · A1 grade ${s2.report?.story?.grade}` };"
    }
   ]
  },
  {
   "id": "R-BARK-TILE",
   "title": "Name the tile in Story's barks",
   "statement": "Barks still name the district, not the tile.",
   "sources": [
    "P7#known-gaps:5"
   ],
   "gdd_status": "gap",
   "decision": null,
   "spec": "none",
   "spec_gap": "The GDD gives no bark lines that name a tile. It does not say whether the tile is named by its title or its grid name, or which barks change.",
   "impact": "content",
   "depends_on": [],
   "touches": [
    {
     "file": "prototypes/p6/game.js",
     "symbol": "barkLine",
     "why": "in Story, fill the tile's title in place of the district's name"
    }
   ],
   "registry_uses": [],
   "registry_new": [],
   "contract": "In Story (s.storyMode), barkLine reads the tile from STORY.tileOf(s.levelId, s.screenName()). Outside Story it keeps the district's name.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "barkLine reads the tile in play",
     "expr": "const src = H.src('prototypes/p6/game.js'); const i = src.indexOf('function barkLine'), j = src.indexOf('function wrapSmall'); const body = i < 0 ? '' : src.slice(i, j > i ? j : i + 4000); return { ok: /STORY\\.tileOf\\(/.test(body) && /screenName\\(\\)/.test(body), detail: `barkLine ${body.length} chars` };"
    },
    {
     "id": "p2",
     "kind": "sim",
     "say": "the tile name is used in Story only",
     "expr": "const src = H.src('prototypes/p6/game.js'); const i = src.indexOf('function barkLine'), j = src.indexOf('function wrapSmall'); const body = i < 0 ? '' : src.slice(i, j > i ? j : i + 4000); return { ok: /storyMode/.test(body) && /STORY\\.tileOf\\(/.test(body), detail: `storyMode ${/storyMode/.test(body)}` };"
    }
   ]
  },
  {
   "id": "R-CHASSIS0",
   "title": "Show Chassis 0 behind glass in Waterfront B3's stilt houses",
   "statement": "Chassis 0, the prototype before you, stands behind glass in one of the stilt houses. Today it lives in the tale, not on screen.",
   "sources": [
    "P7#known-gaps:8"
   ],
   "gdd_status": "gap",
   "decision": null,
   "spec": "partial",
   "spec_gap": "The tale places it behind glass in a stilt house. The GDD gives no look, size or position. Cosmetic: it must change no solid, as the Edit 92 art rule requires.",
   "impact": "content",
   "depends_on": [],
   "touches": [
    {
     "file": "prototypes/p6/world6.js",
     "symbol": "stiltSprite / waterTile",
     "why": "draw Chassis 0 behind glass; record its spot on B3's scene"
    }
   ],
   "registry_uses": [
    "world.storyArt"
   ],
   "registry_new": [],
   "contract": "H.scene(s,'B3').chassis0 = { x, y } in a Waterfront StorySim, drawn under world.storyArt.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "Waterfront B3's scene places Chassis 0",
     "expr": "const s = H.story('waterfront', H.progress('waterfront', 'B3')); const c = H.scene(s, 'B3')?.chassis0; return { ok: !!c && Number.isFinite(c.x) && Number.isFinite(c.y), detail: c ? `${c.x},${c.y}` : 'none' };"
    },
    {
     "id": "p2",
     "kind": "code",
     "say": "the world draws Chassis 0",
     "file": "prototypes/p6/world6.js",
     "pattern": "chassis0\\s*[:=]"
    }
   ]
  },
  {
   "id": "R-PARK-VISITORS",
   "title": "Show Parkland's visitors on screen",
   "statement": "Parkland's visitors live in the tales, not on screen.",
   "sources": [
    "P7#known-gaps:8"
   ],
   "gdd_status": "gap",
   "decision": null,
   "spec": "none",
   "spec_gap": "The tales mention a school party, a wedding and the board, but the GDD gives no count, look, place or behaviour for visitors. It does not say whether they are art only or interact with cars.",
   "impact": "content",
   "depends_on": [],
   "touches": [
    {
     "file": "prototypes/p6/world6.js",
     "symbol": "parkTile",
     "why": "place visitors on Parkland's scenes"
    }
   ],
   "registry_uses": [
    "world.storyArt"
   ],
   "registry_new": [],
   "contract": "Parkland scenes carry a visitors array (H.scene(s,t).visitors). At least one Parkland tile has a visitor.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "some Parkland tile carries visitors",
     "expr": "const s = H.story('parkland', H.progress('parkland', 'C1')); const n = ['A1','A2','A3','B1','B2','B3','C1','C2','C3'].reduce((a, t) => a + ((H.scene(s, t)?.visitors || []).length), 0); return { ok: n > 0, detail: `visitors ${n}` };"
    },
    {
     "id": "p2",
     "kind": "code",
     "say": "the world builds visitors",
     "file": "prototypes/p6/world6.js",
     "pattern": "\\bvisitors\\s*[:=]"
    }
   ]
  },
  {
   "id": "R-PARK-B1-DROPGAP",
   "title": "Give Parkland B1 a Z0 road under its highway and a drop gap",
   "statement": "Parkland B1's highway crosses no road, so it has no drop gap. Its street is empty 67% of the time. D70's option: a row-1 street A1 → B1 → C1 under the highway.",
   "sources": [
    "P7#known-gaps:9",
    "EDIT93#open:1"
   ],
   "gdd_status": "gap",
   "decision": "D70",
   "spec": "partial",
   "spec_gap": "D70 lists the row-1 street as one option among three; the street's route, lanes and junctions are not given. The gap itself follows Edit 85's rule (world.deckDropGaps: one world.tileSize module on the road's centre line).",
   "impact": "core",
   "depends_on": [],
   "touches": [
    {
     "file": "prototypes/p6/world6.js",
     "symbol": "DISTRICTS (parkland roads) / deckDropGaps / buildScreen",
     "why": "add the row-1 street under the B1 highway, behind a flag; open the gap over it"
    },
    {
     "file": "prototypes/p7/story.js",
     "symbol": "P7SIM",
     "why": "turn the flag on for both P7 modes; 6.10 keeps Parkland as it is"
    }
   ],
   "registry_uses": [
    "world.deckDropGaps",
    "world.tileSize",
    "story.traffic.parkland.B1"
   ],
   "registry_new": [
    {
     "id": "world.parkland.b1Street",
     "default": 0,
     "unit": "flag",
     "type": "number",
     "description": "Parkland: a row-1 Z0 street A1 → B1 → C1 under the B1 highway (D70). 0 in 6.10; 1 in P7SIM."
    }
   ],
   "contract": "P7SIM['world.parkland.b1Street'] === 1. H.scene(s,t).game.dropGaps lists a tile's drop gaps; Parkland B1 has at least one in P7, as A2 already does. A 6.10 Sim6's Parkland B1 has none.",
   "probes": [
    {
     "id": "p1",
     "kind": "sim",
     "say": "Story's Parkland B1 has a drop gap, as A2 does",
     "expr": "const s = H.story('parkland', H.progress('parkland', 'B1')); const g1 = H.scene(s, 'B1')?.game?.dropGaps, g2 = H.scene(s, 'A2')?.game?.dropGaps; return { ok: Array.isArray(g1) && g1.length > 0 && Array.isArray(g2) && g2.length > 0, detail: `B1 ${Array.isArray(g1) ? g1.length : 'none'} · A2 ${Array.isArray(g2) ? g2.length : 'none'}` };"
    },
    {
     "id": "p2",
     "kind": "sim",
     "say": "the street is P7's flag; 6.10's Parkland B1 is unchanged (no gap)",
     "expr": "const w = H.sim6('parkland'); const g = H.scene(w, 'B1')?.game?.dropGaps; return { ok: H.STORY.P7SIM?.['world.parkland.b1Street'] === 1 && !(Array.isArray(g) && g.length), detail: `flag ${H.STORY.P7SIM?.['world.parkland.b1Street']} · 6.10 B1 gaps ${Array.isArray(g) ? g.length : 'none'}` };"
    },
    {
     "id": "p3",
     "kind": "registry",
     "say": "the flag is registered",
     "reg": "world.parkland.b1Street"
    },
    {
     "id": "p4",
     "kind": "reads",
     "say": "the world reads the flag",
     "reg": "world.parkland.b1Street"
    }
   ]
  }
 ],
 "excluded": [
  {
   "cid": "EDIT93#open:2",
   "why": "Status note: D67 and D68 stand open. It states no behaviour to build."
  },
  {
   "cid": "EDIT92#open:1",
   "why": "Status note: D67, D68 and D70 stand. D70's gap is covered by R-PARK-B1-DROPGAP."
  },
  {
   "cid": "P7#known-gaps:0",
   "why": "Status note: tales, briefs and tile counts are proposals (D65 closed with per-tile counts)."
  },
  {
   "cid": "P7#known-gaps:2",
   "why": "A consequence of the miss floor that the GDD accepts. No change is specified."
  },
  {
   "cid": "P7#known-gaps:3",
   "why": "An accepted limit of save games (three local slots; old saves' handling). No feature is specified."
  },
  {
   "cid": "P7#known-gaps:4",
   "why": "An accepted limit: the time stamp is the browser's local time, as specified in Edit 88."
  },
  {
   "cid": "P7#known-gaps:6",
   "why": "A measurement of Arcade's economy (Parkland 2 write-offs, 2 credits). No change is specified."
  },
  {
   "cid": "P7#known-gaps:10",
   "why": "A consequence of Edit 93's part order that the GDD accepts (Battery 3 serves one tile)."
  },
  {
   "cid": "P7#known-gaps:11",
   "why": "A soak measurement (27 culls out of view in 54 min) the player never sees. An accepted limit."
  },
  {
   "cid": "P7#known-gaps:12",
   "why": "An accepted limit of the touch layout (one layout a browser, fractions kept, the player's choice of overlap)."
  },
  {
   "cid": "P7#known-gaps:13",
   "why": "An accepted limit: the diamond moves and sizes as one. The GDD specifies no separate placement."
  }
 ]
}

# The original brief follows

# Task
Write the requirements for these GDD candidates, with acceptance probes, as your system prompt says. Output one JSON object.

# Candidates
- `EDIT93#open:0` [open, rank 93] **D76:** the finale and Second Market.
- `EDIT93#open:1` [open, rank 93] **D70:** eased. Parkland B1's missing drop gap stands.
- `EDIT93#open:2` [open, rank 93] **D67, D68** stand.
- `P7#known-gaps:0` [gap, rank 93] Tales and briefs are proposals (status Proposed in `story.json`). The tile counts are proposals too (D65).
- `P7#known-gaps:1` [gap, rank 93] Points are a score only; nothing yet ranks or grades a tile (Edit 90's grade is open).
- `P7#known-gaps:2` [gap, rank 93] At 1 health after a miss, any hit to the brief ends the chassis; the floor makes a tile in test a long life.
- `P7#known-gaps:3` [gap, rank 93] Three slots, in this browser only: no cloud save, no export. A 7.7 save's credits are ignored; a 7.8–7.9 save keeps the upgrades it bought.
- `P7#known-gaps:4` [gap, rank 93] A slot's time stamp is the browser's local time.
- `P7#known-gaps:5` [gap, rank 93] Barks still name the district, not the tile.
- `P7#known-gaps:6` [gap, rank 93] Short Arcade districts buy few parts: Parkland's 2 write-offs, 2 credits.
- `P7#known-gaps:7` [gap, rank 93] The finale is words on the ending screen: no unveiling, no flight to the ship yet (D76). The monument stands from the start.
- `P7#known-gaps:8` [gap, rank 93] Parkland's visitors and Chassis 0 live in the tales, not on screen.
- `P7#known-gaps:9` [gap, rank 93] Parkland B1: no road under its highway, a street empty 67% of the time (D70). Its brief is now a raised road (Edit 93).
- `P7#known-gaps:10` [gap, rank 93] Battery 3 fits on the last tile: the faster recharge serves one tile, the circus.
- `P7#known-gaps:11` [gap, rank 93] Tile scales raise culls out of view: 27 in 54 min of soak (9 at 1). The player never sees them.
- `P7#known-gaps:12` [gap, rank 93] Touch layout: one saved layout a browser, as fractions of the screen; a phone turned between screen shapes keeps the fractions. A placed control can cover a panel (the player's choice).
- `P7#known-gaps:13` [gap, rank 93] The diamond moves and sizes as one; its four buttons do not separate.
- `EDIT92#3:6` [built, rank 92] **Delivery (built):** the act line on each district's first card and at the head of every card; the map's act numerals (I, II, III); 27 tales; the ending.
- `EDIT92#3.2:0` [built, rank 92] **Ending screen (built):** CERTIFIED. "Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage."
- `EDIT92#3.2:1` [proposed, rank 92] **Finale (proposed, D76):**
  - The unveiling: the circus's monument, shrouded until B2 clears; the plaque shows the run (chassis spent, points, best combo, time).
  - The drone lifts the dummy over the river to the ship at Waterfront B3; every crate carries its face.
  - Credits over the voyage.
- `EDIT92#3.2:2` [built, rank 92] **What clearing everything gives:** the ending (built); the CERTIFIED save stamp (built, since Edit 81); the unveiling and the plaque; Second Market, the city again with the cars' learning kept (D76).
- `EDIT92#open:0` [open, rank 92] **D76:** the finale (unveiling, plaque, drone to the ship, credits) and Second Market.
- `EDIT92#open:1` [open, rank 92] **D67, D68, D70** stand.

# Decisions
- D65 (CLOSED): Story length: 27 tiles × 3 = 81 bodies · options: Keep; `story.tileWriteOffs` 2; 3 only on each district's last tile · notes: **Closed 28 October:** a count per tile, 62 in all (row 463)
- D67 (OPEN): Story length: 35 bodies certify the city once the tracks pace it · options: Keep; raise story prices; pay credits for counted bodies only · notes: Raised 28 October (row 466)
- D68 (OPEN): Pushes (Arms) are not capped by `proto.bounce.maxThrow` · options: Keep (the deliberate ricochet); cap them too · notes: Raised 28 October (row 467)
- D70 (OPEN): Parkland B1: no Z0 road under its highway (no drop gap possible); its street, a corner of the boulevard, is empty 67% of the time even at `story.traffic.parkland.B1` 2; its brief needs a cone-baited car · options: A row-1 street A1 → B1 → C1 under the highway; move the cone brief to a busier tile; keep · notes: Raised 28 October (rows 477–478); **eased 29 October:** B1's brief is a raised road, so no cone is needed (row 529). The missing drop gap stands
- D76 (CLOSED): The finale and the reward for clearing: the monument shrouded until B2, its unveiling, the plaque with the run's numbers, the drone to the ship at B3, credits over the voyage; Second Market (the city again, the cars' learning kept) · options: Build all; the unveiling and the ship only; keep the ending screen · notes: Raised 28 October (GDD Edit 92 §3.2); **closed 29 October:** the unveiling and the ship (row 533). Credits and Second Market move to D77
- D77 (OPEN): The rest of the finale: credits over the voyage; Second Market (New Game+: the city again, the cars' learning kept) · options: Build both; credits only; neither · notes: Raised 29 October (row 533)

Rows cited by the notes:
| 463 | Write-offs per tile: `story.writeOffs.<district>.<tile>`, 27 IDs, 1–3 each (Monument 17, Parkland 22, Waterfront 23; 62 in all). Retires `story.tileWriteOffs`. Closes D65 | user-decided: "let's tune the write-offs per level tile"; values proposed (assistant) | 1 for a rare brief, 2 to learn a verb, 3 later | — | A1 cleared at 2 |
| 466 | Story tile counts retuned so the upgrade tracks fill only at the end of Waterfront: 35 bodies (Monument 10, Parkland 12, Waterfront 13). Bought as soon as affordable, the last level lands on Waterfront B2's first body | user-decided: "Upgrade tracks fill up only at the end of Waterfront"; counts proposed (assistant), given prices 3, 4, 5 and a credit a body | The economy paces the story | A shorter story (7.1: 62 bodies) (D67) | Fill at body 34 of 35 |
| 467 | The ricochet: the knock keeps `proto.recoilScale` 0.7 of its Newtonian velocity (the rest is damage) and slides at most `proto.bounce.maxThrow` 40. Arcade and Story (P7SIM). Pushes stay uncapped | user-directed: "the dummy gets hurt which means it doesn't get all the momentum … a sensible adjustment"; values proposed (assistant) | A hit throws about a lane, not a screen | Pushes uncapped (D68) | Head-on 98 u/s, 26 units (was 193, 127) |
| 477 | A neighbour with a roundabout runs at the district rate under a tile scale (Parkland B2, C3; Waterfront B2). Out of view, a car stopped `traffic.offscreenCullSeconds` is removed (Edit 63) | proposed (assistant), answering "what if cars get trapped in the roundabout from tiles that can't be seen?" | No ring fills out of sight; no jam survives there | Parkland B1 gains little: its cars come through B2 (D70) | 27 tiles × 2 min: longest stop in view 11 s; 27 culls in 54 min (9 unscaled) |
| 529 | Parkland B1 drops its cone brief for a raised road. Its street stays empty 67% of the time | proposed (assistant) under row 528 | A cone needs a car on the street; the highway always has one | — | Eases D70 |
| 533 | The finale is the unveiling and the ship: the circus's monument shrouded until Waterfront B2 clears; its unveiling, with the plaque showing the run (chassis spent, points, best combo, time); a Farsight drone lifts the dummy over the river to the container ship at Waterfront B3, every crate carrying its face. The ending screen follows | user-decided: "Unveiling and ship" (29 October) | The reward for clearing is seen, not only read | Credits over the voyage and Second Market wait (D77) | Closes D76; GDD Edit 92 §3.2 |

# GDD chunks
### EDIT93#open (rank 93, coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md)
## Open
- **D76:** the finale and Second Market.
- **D70:** eased. Parkland B1's missing drop gap stands.
- **D67, D68** stand.

### EDIT92#3.2 (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
## 3.2 Ending and finale
```markdown
- **Ending screen (built):** CERTIFIED. "Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage."
- **Finale (proposed, D76):**
  - The unveiling: the circus's monument, shrouded until B2 clears; the plaque shows the run (chassis spent, points, best combo, time).
  - The drone lifts the dummy over the river to the ship at Waterfront B3; every crate carries its face.
  - Credits over the voyage.
- **What clearing everything gives:** the ending (built); the CERTIFIED save stamp (built, since Edit 81); the unveiling and the plaque; Second Market, the city again with the cars' learning kept (D76).
```

### EDIT92#open (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
## Open
- **D76:** the finale (unveiling, plaque, drone to the ship, credits) and Second Market.
- **D67, D68, D70** stand.

### P7#highways-and-cones-edit-85-both-modes (rank 93, prototypes/p7/README.md)
## Highways and cones (Edit 85, both modes)
- **Every highway has a flight** (`world.deckFlightsMin` 1). Waterfront's bridges: one each, from the beach (A2 west, C2 east).
- **Every highway breaks its parapet over each Z0 road beneath** (`world.deckDropGaps`): one `world.tileSize` module on the road's centre line, south or east (the other side where a flight stands). Drawn lit: white snapped ends, a cyan edge. Walk off it and drop onto the road.
  - Parkland B1's highway crosses no road: no gap (D70).
- **Cones:** on the pavement beside a road, never on it; never under a highway, ring or walkway, never behind a building (`props.cone.minVisible` 0.9).

### EDIT93#3.1 (rank 93, coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md)
## 3.1 The 27 tiles (amends Edit 92 §3.1)
| # | Tile | Title | Brief 7.11 → 7.12 | Part 7.11 → 7.12 | Write-offs |
|---|---|---|---|---|---|
| 1 | Monument A1 | The welcome wall | Any | — | 1 |
| 2 | Monument B1 | The podium bridge | Drop → **Dash** | Battery 1 | 1 |
| 3 | Monument C1 | The LED drum | Jump → **Drop** | Legs 1 → **—** | 1 |
| 4 | Monument C2 | The portal tower | Raised road | — | 1 |
| 5 | Monument B2 | The monument | Struck | — | 1 |
| 6 | Monument A2 | The neon shops | Cone | Hands 1 | 1 |
| 7 | Monument A3 | The stacked cubes | Combo ×2 | — | 1 |
| 8 | Monument B3 | The LED canyon | Jump | — → **Legs 1** | 1 |
| 9 | Monument C3 | The LED gateway | Push → **Thrown** | Arms 1 → **—** | 2 → **1** |
| 10 | Parkland C1 | The lantern pavilion | Drop → **Push** | Battery 2 → **Arms 1** | 1 |
| 11 | Parkland C2 | The amphitheatre | Van | — | 2 |
| 12 | Parkland C3 | The arch and the roundabout | Thrown → **Combo ×2** | — | 1 |
| 13 | Parkland B3 | The obelisk court | Police | — | 1 |
| 14 | Parkland A3 | The belvedere | Jump | Legs 2 | 1 |
| 15 | Parkland A2 | The dome by the canal | Raised road → **Cone** | — → **Hands 2** | 2 |
| 16 | Parkland A1 | The reservoir terraces | Push | Arms 2 | 1 |
| 17 | Parkland B1 | The cascade | Cone → **Raised road** | Hands 2 → **—** | 1 |
| 18 | Parkland B2 | The ring over the pools | Combo ×3 | — → **Battery 2** | 2 |
| 19 | Waterfront A1 | The west portal | Bus | Battery 3 → **—** | 1 |
| 20 | Waterfront B1 | The tunnel portal | Jump | Legs 3 | 2 |
| 21 | Waterfront C1 | The east portal | Police | — | 1 |
| 22 | Waterfront C2 | The east beach terrace | Drop | — | 2 |
| 23 | Waterfront C3 | The east customs post | Thrown | — | 1 |
| 24 | Waterfront B3 | The stilt houses | Push | Arms 3 | 1 |
| 25 | Waterfront A3 | The west customs post | Raised road | — | 2 |
| 26 | Waterfront A2 | The west beach terrace | Cone | — | 1 |
| 27 | Waterfront B2 | The circus | Combo ×3 | — → **Battery 3** | 2 |
- **Write-offs** (`story.writeOffs.<district>.<tile>`): Monument 9, Parkland 12, Waterfront 13. 34 bodies (7.11: 35).
- **Act I's other briefs** test what the body already does: drop, raised road, struck, combo ×2, thrown.
- **Parkland B1** (D70): its street is empty 67% of the time. A raised road replaces the cone. The highway always carries cars.

### P7#known-gaps (rank 93, prototypes/p7/README.md)
## Known gaps
- Tales and briefs are proposals (status Proposed in `story.json`). The tile counts are proposals too (D65).
- Points are a score only; nothing yet ranks or grades a tile (Edit 90's grade is open).
- At 1 health after a miss, any hit to the brief ends the chassis; the floor makes a tile in test a long life.
- Three slots, in this browser only: no cloud save, no export. A 7.7 save's credits are ignored; a 7.8–7.9 save keeps the upgrades it bought.
- A slot's time stamp is the browser's local time.
- Barks still name the district, not the tile.
- Short Arcade districts buy few parts: Parkland's 2 write-offs, 2 credits.
- The finale is words on the ending screen: no unveiling, no flight to the ship yet (D76). The monument stands from the start.
- Parkland's visitors and Chassis 0 live in the tales, not on screen.
- Parkland B1: no road under its highway, a street empty 67% of the time (D70). Its brief is now a raised road (Edit 93).
- Battery 3 fits on the last tile: the faster recharge serves one tile, the circus.
- Tile scales raise culls out of view: 27 in 54 min of soak (9 at 1). The player never sees them.
- Touch layout: one saved layout a browser, as fractions of the screen; a phone turned between screen shapes keeps the fractions. A placed control can cover a panel (the player's choice).
- The diamond moves and sizes as one; its four buttons do not separate.

### EDIT92#3 (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
## 3 Story: Narrative A, Certified (replaces the proposal)
```markdown
- **Logline:** a dummy sits the longest job interview in the world. Passing means being shipped.
- **Tone:** dry corporate comedy. Farsight narrates. You are the product under test.
- **Voice:** polite, procedural, dry. No exclamation marks. Cars are colleagues; briefs are duties; parts are equipment.
- **Act I · Monument · INDUCTION:** off the factory floor; Farsight greets you as new staff.
  - Turn (C3): the gateway thanks a car for driving safely, seconds after it wrote you off. ROLE: DESTRUCTIVE TESTING.
- **Act II · Parkland · OPENING DAY:** the Expo opens when the park passes. Nine tiles, nine days. Visitors are booked.
  - Turn (B2): the board applauds the cars. "The public prefers the product to the test."
- **Act III · Waterfront · CUSTOMS:** the river is a border; ships wait beyond it.
  - The customs log (A3): ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION.
  - The circus (B2): the monument, cast from every chassis you lost. ZERO ACCIDENTS (EXCLUDING TESTS).
- **Delivery (built):** the act line on each district's first card and at the head of every card; the map's act numerals (I, II, III); 27 tales; the ending.
```

### P7#files (rank 93, prototypes/p7/README.md)
## Files
- **`dummies_p7_12.html`:** the game. Open in a browser; no server.
- **Live (GitHub Pages):** https://lawrencelek.github.io/ELVTR-Multiagent-Submission-5/ (game), `/jump/`, `/controls/`, `/p7-11/` (Prototype 7.11), `/p7-10/` (Prototype 7.10), `/p7-9/` (Prototype 7.9), `/p7-8/` (Prototype 7.8), `/p7-7/` (Prototype 7.7), `/p7-6/` (Prototype 7.6), `/p7-5/` (Prototype 7.5), `/p7-4/` (Prototype 7.4), `/p7-3/` (Prototype 7.3), `/p7-2/` (Prototype 7.2), `/p7-1/` (Prototype 7.1), `/p7/` (Prototype 7), `/p6-10/` (Prototype 6.10).
- **`p7_12_page.html`:** the same page for Claude's hosted preview (touch and keys; no gamepads).
- **`dummies_p7_11.html`:** Prototype 7.11 (Edit 92). Frozen.
- **`dummies_p7_10.html`:** Prototype 7.10 (Edit 91). Frozen.
- **`dummies_p7_9.html`:** Prototype 7.9 (Edit 90). Frozen.
- **`dummies_p7_8.html`:** Prototype 7.8 (Edit 89). Frozen.
- **`dummies_p7_7.html`:** Prototype 7.7 (Edit 88). Frozen.
- **`dummies_p7_6.html`:** Prototype 7.6 (Edit 87). Frozen.
- **`dummies_p7_5.html`:** Prototype 7.5 (Edit 86). Frozen.
- **`dummies_p7_4.html`:** Prototype 7.4 (Edit 85). Frozen.
- **`dummies_p7_3.html`:** Prototype 7.3 (Edit 84). Frozen.
- **`dummies_p7_2.html`:** Prototype 7.2 (Edit 83). Frozen.
- **`dummies_p7_1.html`:** Prototype 7.1 (Edit 82). Frozen.
- **`dummies_p7.html`:** Prototype 7 (Edit 81). Frozen.
- **`story.js`:** Story mode. `StorySim` extends the P6 player sim (`../p6/world6.js`): start tile, fences, the brief and its miss floor, clears, the drone ferry, the eleven parts by drone (Edit 91), each on the tile that first tests it (Edit 93). `ArcadeSim`: one district a run, Battery 1 fitted, parts for credits. `P7SIM`, the P7.2 physics for both modes. Runs headless in Node.
- **`../../content/story/story.json`:** the story's content (Narrative A, Edit 92): the acts, the order of tiles, 27 titles and tales, Farsight's briefs and gifts (paced by Edit 93), the ending. Numbers are registry IDs.
- **`../../content/story/narratives_proposal.md`:** the three proposals and the tile audit (Edit 91); A chosen.
- **`../p6/game.js`, `../p6/world6.js`, `../p6/sim.js`:** the shared game code: the title, the story map, the tile card, fences, the gift screen, the story's HUD.
- **`build.py`:** `python3 build.py` → both pages. `../p6/build.py` refuses: 6.10 is frozen.
- **`test_p712.js`:** `node test_p712.js [screenshot folder]` → the checks; screenshots into the folder.

### P7#story~2 (rank 93, prototypes/p7/README.md)
- **Order** (user-decided). Tile names are column-row: A1 is top left.
  - Monument: A1, B1, C1, C2, B2, A2, A3, B3, C3. The snake road.
  - Parkland: C1, C2, C3, B3, A3, A2, A1, B1, B2. With the highways, ending on the ring.
  - Waterfront: A1, B1, C1, C2, C3, B3, A3, A2, B2. Round the valley, ending at the circus.
- **A tile:** `story.writeOffs.<district>.<tile>` counted write-offs clear it (table below).
  - A write-off counts when its last hit meets the brief. Otherwise it scores and counts for nothing.
- **Open tiles:** the cleared ones and the tile in test. Edges between open tiles are open.
- **Fences:** every edge toward a tile not yet open. They hold walking, dashes, jumps and throws.
  - Drawn as a yellow glow along the screen's edge, as in Zelda. Nothing stands across a road.
  - Cleared tiles stay open. Walk back through them; write-offs there score only.
- **The ferry:** after a clear, a Farsight drone flies in for the new chassis. It carries it over the edge into the next tile.
  - It sets it down off the road, within `story.ferryDepth` (160) of the edge it crossed, nearest the crossing.
  - Then the next tile's card. A1 to B1: about 5 s. Not between districts.
- **Parts** (Edit 91): all eleven by drone, each on a fixed tile (the table's last column). Nothing is sold; there are no levels.
  - Introduce, then test (Edit 93): each part lands on the tile whose brief first needs it. Act I issues 3, Act II 5, Act III 3.
  - The ferry drone into a part's tile carries the module under it. It hovers, lowers it on a cable, and the gift screen opens.
  - A continues; the drone lifts the dummy and carries it across. A1 to B1 with Battery 1: about 5 s in all.
  - A save resumed with a part owed: a drone delivers it, leaves, then the tile card. A 7.9 save gets its cleared tiles' parts.
  - The report goes straight to the next chassis: PARTS n / 11, and the next part with its tile.
- **On foot** (Edit 91): A1 is played without the dash (Battery 0), at `damage.bodyHealthOnFoot` (500). Battery 1 arrives with the drone to B1, whose brief is the dash (Edit 93).
- **A miss holds at 1** (Edit 91): in the tile in test, a hit that would write the chassis off but misses the brief leaves `story.missFloor` (1). The hit scores; play goes on. Only a hit to the brief writes it off.
- **Points** are the score. No credits in Story. Arcade keeps `economy.creditsPerWriteOff` and `economy.price.ability.level1`–`level3` (1, 2, 3).
- **No clock:** a district's traffic runs `story.shiftCars` (5,000) cars. No Failed test.
- **Traffic per tile** (Edit 85): `story.traffic.<district>.<tile>` × the district's density, on the tile in test and its four neighbours; the rest of the district at 1.
  - A neighbour with a roundabout stays at 1 (Parkland B2, C3; Waterfront B2).
  - Cars still enter the view only across its edges. Out of view, a car stopped `traffic.offscreenCullSeconds` (12 s) is removed.
  - Scales above 1: Monument A1 1.5, B1 1.75, C3 1.5 (Edit 93); Parkland C1 1.75, C2 1.75, B3 1.25, A3 2, A2 1.5, B1 2, B2 1.25; Waterfront B1 1.5, C2 1.5, A2 1.5.
- **The map:** uncleared tiles greyed out; the live tile ringed in yellow; cleared tiles at full strength. The cursor reads any revealed tile's tale.
- **Saved** into the slot in play after every count, clear, gift and purchase. A reload: STORY, CONTINUE resumes the tile in test.
- **The acts** (Edit 92): Monument ACT I · INDUCTION, Parkland ACT II · OPENING DAY, Waterfront ACT III · CUSTOMS. The act line opens each district's first card.
- **The end:** clearing Waterfront B2, the circus, certifies the Test City. The DUMMY MONUMENT stands on its island (Edit 91). The ending (Edit 92): the model passes, to be manufactured; a drone carries it to a ship for a market far away.

### P7#evidence~2 (rank 93, prototypes/p7/README.md)
- `node test_p712.js docs` → 94/94.
  - Edit 93, content: all 11 parts by drone, each once, a track in order: Battery 1 Monument B1 #2, Hands 1 A2 #6, Legs 1 B3 #8, Arms 1 Parkland C1 #10, Legs 2 A3 #14, Hands 2 A2 #15, Arms 2 A1 #16, Battery 2 B2 #18, Legs 3 Waterfront B1 #20, Arms 3 B3 #24, Battery 3 B2 #27. No brief needs a part not yet issued; each verb's first brief is its drone's tile. 34 bodies.
  - Edit 93, headless: struck in B1 (it wants a dash) holds at 1, losing 29 of 30; a dash into a parked sedan clears B1; the drone to C1 brings nothing; C1 asks for a drop. Monument C3 resumes with Legs 1 and Hands 1, no push: THROWN INTO A CAR. Parkland C1 brings Arms 1 and asks for a push. Waterfront B2 brings Battery 3 and certifies with all 11.
  - Edit 93, page: the drone to B1 brings Battery 1 (the gift screen, A held); B1's card: DASH INTO A CAR; a dash clears B1; C1's card: DROP ONTO A CAR, no part; a reload: 1 / 11 PARTS.
- Prototype 7.11's checks, carried over:
  - Edit 92: Narrative A in the content (three acts, 27 titles and tales with no exclamation marks, the longest 217 characters, the ending); the story's tile art changes no solid, floor, stair, spawn or cone home on any tile, and draws on nine: Monument A1, A2, A3, C3; Parkland C1, B1; Waterfront A3, C3, B3. In the page: the title (P7.11); the ship and a customs post in Arcade's Waterfront.
- Prototype 7.10's checks, carried over:
  - Edit 91, content: registry `edit91` (5 IDs added; `story.level.*`, `arcade.giftEvery` retired).
  - Edit 91, headless: Story starts on foot (A denied, 1 charge, 500 health); Arcade ships with Battery 1. Battery 2 two charges; Battery 3 0.6 s. Struck on foot clears A1; the report: 0 / 11 parts, next Battery 1 at B1; no shop; the drone brings Battery 1 (500 → 800). Nothing for sale in Story; a million points fit nothing. A 7.9 save receives its cleared tiles' parts. The DUMMY MONUMENT stands in Waterfront B2 (none in 6.x worlds). Arcade: a credit buys Legs 1, then Hands 1; no drone.
  - Edit 91, page: POINTS small, top right; BODY, the field and the chassis on one top edge; in A1 on foot: Controls MOVE · ??? · ???; the chassis reddened by part, six numbers, 306 tall; the report straight to the Battery 1 drone; the monument in Waterfront B2, solid; Arcade's workshop opens on Legs (1 credit). On the S25 the buttons read nothing in A1; the touch flow taps the report and the gift.
  - Edit 90: one charge left, dash then B: a dash jump in Story and Arcade, denied under 6.10's rules; Hands 1: a tap picks up, a tap away from cones puts down (6.10 keeps the hold).
  - Touch (Edit 89): a stylus phone turns touch on at the first touch; then by taps alone: ARCADE, a district, ▶, B, STORY, NEW GAME, OK, a tile, DEPLOY, the card, ❚❚, Options, Back, Resume, the report, the gift.
  - Save games (Edit 88): STORY opens the save screen, three empty slots; NEW GAME names slot 1; a reload offers the latest slot first ("2 / 27 TILES · … · 2 / 11 PARTS"); CONTINUE resumes. 7.6's story moves into slot 1. The grid types a name; OVERWRITE, RENAME, ERASE ask twice; ESC cancels. Touch: NEW GAME, keys, the phone's keyboard, OK; RENAME.
  - Earlier checks kept: orders, neighbours, tales, briefs possible where set; the ricochet; fences; the ferry; the gift phase; resume with a part owed; Monument → Parkland; Edit 85's 15 highways, drop gaps and cone homes; tile density; 6.4–6.10 and 7–7.11 byte-identical.
  - Phones: 16:9 (640 × 360) and the S25 Ultra (892 × 412): everything inside the 16:9 frame by default; the ❚❚ chip pauses; Adjust layout drags the stick and the diamond into the margins (the diamond, larger now that the chassis panel ends higher, stops at the canvas edge); + SIZE ×1.20; DONE saves; a reload keeps it; Reset restores it. No page errors.
- `../p6/test_p610.js` → 47/47 (6.10's rules on the shared code). `../p6/test_sim.js` → 104/104. `../p6/test_p6.js` → 72/73 (Parkland's street-emptiness limit, as on 6.4).
- `../jump/test_jump.js` → 28/28. `../controls/test_controls.js` → 34/34.

### EDIT93#3.3 (rank 93, coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md)
## 3.3 Briefs (amends Edits 81–82)
```markdown
- **DASH INTO A CAR** (new, `dash`): "Coverage gap: dashes. The final hit must be a dash into a car."
  - Met when the fatal hit lands while the body is dashing. A dash jump counts as a jump.
  - Set once: Monument B1, the tile that issues Battery 1.
- **Miss floor:** unchanged (`story.missFloor`). Struck standing in B1 holds at 1.
```

### P7#save-games-edit-88 (rank 93, prototypes/p7/README.md)
## Save games (Edit 88)
| | Keys | Gamepad | Touch |
|---|---|---|---|
| Choose a row | arrows | stick or d-pad | stick, or tap |
| Choose an action | left, right | stick or d-pad | tap |
| Select | SPACE | A | A, or tap |
| Back | SHIFT or ESC | B | B |
- **Rows:** NEW GAME; slots 1–3 (`story.saveSlots`). The cursor starts on the latest save.
- **A slot card:** number, name, time stamp (DD MON YYYY · HH:MM, local); IN PLAY on the slot in play.
  - "MONUMENT · C2 · TILE 4 OF 27". "3 / 27 TILES · 2,450 POINTS · 3 / 11 PARTS · CHASSIS 04".
- **CONTINUE:** the story map of that slot. **RENAME:** the name entry; the time stamp stays. **ERASE:** A twice.
- **NEW GAME:** the first empty slot, then its name. None empty: choose a slot; OVERWRITE asks twice.
- **Name entry:** `story.saveNameMax` (12) characters, upper case: A–Z, 0–9, space, - . '. The default (TEST DUMMY n) is selected: typing replaces it.
  - Keys: type it; Enter OK; Backspace deletes; Esc cancels. Pad and stick: the grid; A types; B deletes (empty: cancels); START OK.
  - Touch: tap the grid's keys; tap the name for the phone's own keyboard.
- **Stored** in this browser: `dummies.p7.save1`–`3`. 7.6's `dummies.p7.story` moves into slot 1 once and stays for 7.1–7.6.

### ENG#9.4 (rank 29, content/kb/DUMMIES_V29_Engineering_Spec.md)
### 9.4 Records and eligibility
A score category identifies profile/version, effective gameplay configuration, applicable build compatibility, ending class and continuation status. Licensed completions, explicit Non-compliant withdrawals and failed tests are separate categories; an incomplete farming run must not displace a completed run. Within a comparable category, sort points descending, then active simulation time ascending. Retain total interaction time separately for experience analysis.
Fresh uninterrupted approved runs are ranked separately from continued runs. Practice and debug runs are unranked. Applying a tuning change or debug grant permanently invalidates that run's ranked eligibility, even if the value is reverted. Developer controls stay out of the visitor flow. Accessibility settings that do not change gameplay can remain in the same category; settings that change timing or physics require an explicit category rule.
Store configuration identity with each record. A changed profile archives or separates earlier scores; it does not relabel them as comparable. This is local score integrity, not a claim of cheat-proof security. Initials entry is optional and must not obstruct replay or the visitor reset.

### P7#hud-story~2 (rank 93, prototypes/p7/README.md)
- **One top edge** (Edit 87, 91): BODY, the field's bezel and the chassis start level. POINTS small in the top-right corner, on the strip with the objective. No CARS LEFT (no clock).
- **Left column** (Edit 86–87): BODY (as tall as DASH: the number on its label's row, the bar beneath), DASH, the district map. No FARSIGHT wordmark in play.
- **Right column** (Edit 91): the chassis, each part reddened by its damage, its number beside it (head and torso on the part, arms and legs in the margins); LAST HIT on one row. No rows of effects. Desktop: the key panel at the foot; DASH there once Battery 1 is fitted.
- **DASH box:** NOT FITTED until Battery 1. **Toast** on a miss of the brief: "Not the brief: chassis held at 1".
- **District map:** titled [MAP] · [TILE] and the level off the ground. Uncleared tiles greyed out; the live tile ringed in yellow; cleared tiles at full strength.
- **Top strip** (Edit 87): the objective, e.g. "OBJECTIVE · C1 · Write off a body. Last hit: drop onto a car (0 of 1)." A toast takes it while it lives. With a drone: "Bringing Battery 1, then on to B1." Arcade: the quota and the next verb.
- **Touch** (Edit 87): ❚❚ PAUSE and ⤢ FULL small, top left. The stick under the map; the Y X B A diamond under the chassis.
  - Pause › Controls › Adjust layout: drag either anywhere, the side margins of a wide phone included; − SIZE / + SIZE (0.6–1.6×); RESET; DONE. Saved in this browser.
- **Speech bubbles:** car barks sit on the cars again, legible in the frame layer. Speech solid, shout doubled, mutter dashed, thought dotted.
- **Tile card** on arrival: the tile's number of 27, its title, its tale, the brief and its count, the verb it brought. A begins.
- **Report:** counted or not, and why; PARTS n / 11 and the next part's tile (Edit 91). Then the next chassis.
- **Workshop** (Edit 89): Arcade only since Edit 91. The next chassis, large; Battery, Legs, Hands, Arms around it, wired to their seats. Pips, now, next, cost. FIT, DONE.
- **Pause** (ESC, START, ❚❚): Resume · Story map · Options · Controls · Show trace · Quit to title. The tile's count is kept; the body in play is lost.
  - Options: Sound · Palette (reloads; the story saves first) · Full screen · Tuning panel · Gamepad setup · Back.
  - Controls: the device in hand. Keyboard: WASD/arrows, Space/K, L/Shift, J/E, I/Q, Esc/P, T, G. Gamepad: stick, A, B, X, Y, Start, hold Start. Touch: stick, A, B, X, Y, ❚❚, ⤢; Adjust layout · Reset layout · Back. A verb not yet fitted reads ??? (Edit 90), the dash included (Edit 91).
- **Touch buttons** (Edit 90): menus: A OK, B BACK. Play: the verb once fitted (A DASH, B JUMP, X GRAB or DROP, Y PUSH); unfitted: the letter alone, dimmed.
- **Tuning (T):** `proto.recoilScale`, `proto.bounce.maxThrow`, `story.ferryDepth`, `economy.creditsPerWriteOff`, `story.missFloor`, `damage.bodyHealthOnFoot`, `abilities.battery.dashCharges`, `ui.gift.fallSeconds`, `ui.gift.holdSeconds`, `story.task.comboEasy`, `story.task.comboHard`, the 27 `story.writeOffs.<district>.<tile>`, the 27 `story.traffic.<district>.<tile>`. From the next deploy.

### P7#arcade (rank 93, prototypes/p7/README.md)
## Arcade
- **One district a run.** Its quota of write-offs: Licensed. Traffic: one density per district (`world.district.<id>.interval`).
- **Parts for credits** (Edit 91): a credit a body (`economy.creditsPerWriteOff`); level 1 of any part 1 credit, level 2 2, level 3 3. Nothing comes by drone.
  - The chassis ships with Battery 1 (the dash). The workshop opens after the report, on the first part the credits buy.
- **Top strip:** the quota, e.g. "Write off 3 bodies (0 of 3)."

### EDIT93#3.1/tales-rewritten~1 (rank 93, coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md)
### Tales rewritten
| Tile | Tale |
|---|---|
| Monument B1 | Your first equipment has arrived: a battery, for the dash. The skybridge was built for shoppers who never came; staff now use it to watch the road. Today you join the road. Dash into a colleague. Farsight will time you. |
| Monument C1 | The drum lights each bend before a car reaches it, so no colleague is ever surprised. Today one will be. The high road breaks its rail over the street below. Step off it onto a car. Gravity is company policy. |
| Monument B3 | Two screens face each other across the road and advertise to each other all night. The skybridge was added so that someone would watch. You are now someone. Legs 1 is fitted. Jump into a car between the screens. |
| Monument C3 | The gateway thanks every car for driving safely. It thanked the last one seconds after that car wrote you off. Your file is updated: ROLE: DESTRUCTIVE TESTING. Let one colleague throw you into the next. |
| Parkland C1 | The paper lantern was the Expo's first exhibit, and it is lit again for the visitors. Arms 1 is fitted; Farsight calls it safety equipment. Under the footbridge, push off one car into the next. |
| Parkland C3 | The arch is the Expo's gate. Visitors will circle the roundabout once before they enter, which gives the cars time to learn them. You go round faster. Two hits, the second before the first is forgotten. |
| Parkland A2 | The dome is the Expo's showroom. The canal beside it cools the highway's footings; the ducks are registered volunteers. Hands 2 is fitted: two cones. Lay them where the visitors will walk, and see who stops. |
| Parkland B1 | The cascade steps the reservoir's water down beside the highway, pool by pool. It was built to drown out the traffic. The traffic got louder. Go up to the highway and test it where it is loudest. |
| Parkland B2 | Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three. |
| Waterfront A1 | The upper town houses the engineers, and the bus carries them to the bridge. Farsight requires the bus fleet's data before anyone crosses the river. The bus is slow and very large. It will not miss. |
| Waterfront B2 | Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you. |

### EDIT92#3.1~2 (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
| # | Tile | Title | Brief | Part | Tale |
|---|---|---|---|---|---|
| 1 | Monument A1 | The welcome wall | Any | — | A conveyor sets you down beside a tower. Its screen shows your face and the word WELCOME. Farsight is pleased to have you. Your first duty is simple: stand in the road until a colleague notices you. |
| 2 | Monument B1 | The podium bridge | Drop | Battery 1 | Your first equipment has arrived: a battery, for the dash. The skybridge was built for shoppers who never came; it now serves as an observation deck for staff. Observe a car from above, then join it. |
| 3 | Monument C1 | The LED drum | Jump | Legs 1 | The drum lights each bend before a car reaches it, so no colleague is ever surprised. Today you will surprise one. Legs 1 is fitted for the purpose. Your enthusiasm will be noted in your file. |
| 4 | Monument C2 | The portal tower | Raised road | — | The high road runs through this tower at the sixth floor. The tenants say the traffic is good company. Today your duty is on the road itself, at height. The view is not part of the job. |
| 5 | Monument B2 | The monument | Struck | — | The plaque reads ZERO ACCIDENTS. New staff ask whether this is a record. It is a target. Stand near it and let a colleague find you. Walking is permitted. Dashing would spoil the data. |
| 6 | Monument A2 | The neon shops | Cone | Hands 1 | The shops under the highway sell nothing. Their signs flash prices at the traffic, which reads every word. Hands 1 is fitted, so you can place a cone. Colleagues are trained to respect cones. Use this. |
| 7 | Monument A3 | The stacked cubes | Combo ×2 | — | Each cube was added as the budget arrived, one quarter at a time, each leaning further than the last. Farsight calls this growth. Today's duty is the same: one hit, then another before the first is forgotten. |
| 8 | Monument B3 | The LED canyon | Jump | — | Two screens face each other across the road and advertise to each other all night. The skybridge was added so that someone would watch. You are now someone. Jump into a car between the screens. |
| 9 | Monument C3 | The LED gateway | Push | Arms 1 | The gateway thanks every car for driving safely. It thanked the last one seconds after that car wrote you off. Your file is updated: ROLE: DESTRUCTIVE TESTING. Arms 1 is fitted. Push off one colleague into the next. |
| 10 | Parkland C1 | The lantern pavilion | Drop | Battery 2 | The paper lantern was the Expo's first exhibit, and it is lit again for the visitors. Battery 2 is fitted: a second charge. Farsight calls it safety equipment. Drop onto a car from the footbridge. |
| 11 | Parkland C2 | The amphitheatre | Van | — | Farsight's board will watch from these terraces on opening day. The seats face the avenue, so every crossing is a performance. A van delivers the catering. Arrange for it to deliver you. |
| 12 | Parkland C3 | The arch and the roundabout | Thrown | — | The arch is the Expo's gate. Visitors will circle the roundabout once before they enter, which gives the cars time to learn them. You go round faster. Be thrown into a car while the last one still throws you. |
| 13 | Parkland B3 | The obelisk court | Police | — | The obelisk marks the surveyors' first stake. A school party will visit it on opening day, escorted by the police fleet. Farsight would like to know how the police fleet handles a dummy first. |
| 14 | Parkland A3 | The belvedere | Jump | Legs 2 | A wedding is booked on the belvedere for opening day. The couple asked for a view of the traffic. Legs 2 is fitted: longer in the air. Land on a car here, so that no guest ever does. |
| 15 | Parkland A2 | The dome by the canal | Raised road | — | The dome is the Expo's showroom. The canal beside it cools the highway's footings; the ducks are registered volunteers. On opening day the visitors will look up at the highway. Be on it. |
| 16 | Parkland A1 | The reservoir terraces | Push | Arms 2 | The gardener keeps the three pools level by hand. She has asked that the cars learn to stop before the water. Arms 2 is fitted: a stronger push. Teach them by hitting one car into the next. |
| 17 | Parkland B1 | The cascade | Cone | Hands 2 | The cascade steps the reservoir's water down beside the highway, pool by pool. It was built to drown out the traffic. Hands 2 is fitted: two cones. Lay them where the visitors will walk, and see who stops. |
| 18 | Parkland B2 | The ring over the pools | Combo ×3 | — | Inspection day. The board watches the ring. When the cars come round clean, the board applauds the cars. Farsight notes that the public prefers the product to the test. Give the board a chain of three. |
| 19 | Waterfront A1 | The west portal | Bus | Battery 3 | The upper town houses the engineers, and the bus carries them to the bridge. Battery 3 is fitted: a faster recharge. Farsight requires the bus fleet's data before anyone crosses the river. |
| 20 | Waterfront B1 | The tunnel portal | Jump | Legs 3 | The tunnel runs north under the hill to the next valley. Cars go in. Data comes back. Legs 3 is fitted: the longest flight. Where your data goes after the tunnel is not within your role. |
| 21 | Waterfront C1 | The east portal | Police | — | The east bridge was built a year after the west, to correct its mistakes. Its portal block faces the other way and pretends not to know its twin. The police here check papers. Yours are being prepared. |
| 22 | Waterfront C2 | The east beach terrace | Drop | — | The terrace was built for tourists, then joggers, then sensors. From its rail you can see the ships in the estuary and the cranes that load them. Drop onto a car below. The ships will wait. |
| 23 | Waterfront C3 | The east customs post | Thrown | — | The pier tower is a customs post. It logs everything that floats on the river: containers, ducks and, so far, one dummy, inbound. Be thrown into a car. Customs is watching. |
| 24 | Waterfront B3 | The stilt houses | Push | Arms 3 | The stilt houses are older than the city, kept as heritage. Behind glass in one of them stands Chassis 0, the prototype before you. A ship is moored beyond. Arms 3 is fitted. Show Chassis 0 how far the model has come. |
| 25 | Waterfront A3 | The west customs post | Raised road | — | The west tower keeps the customs log. Your entry reads ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. You were shipped here to be tested. Honour the declaration on the raised road. |
| 26 | Waterfront A2 | The west beach terrace | Cone | — | The valley began here: a cliff, an avenue, and a beach of sand brought from three provinces. The ceremony is being prepared in the circus. Place a cone. Farsight would like one more clean reading before the speeches. |
| 27 | Waterfront B2 | The circus | Combo ×3 | — | Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). One last chain of three certifies the city. And you. |

### P7#story/the-27-tiles~2 (rank 93, prototypes/p7/README.md)
| # | District | Tile | Title | Brief: the last hit | Write-offs | Part by drone |
|---|---|---|---|---|---|---|
| 1 | Monument | A1 | The welcome wall | ANY WRITE-OFF | 1 | — |
| 2 | Monument | B1 | The podium bridge | DASH INTO A CAR | 1 | Battery 1 (the dash) |
| 3 | Monument | C1 | The LED drum | DROP ONTO A CAR | 1 | — |
| 4 | Monument | C2 | The portal tower | ON A RAISED ROAD | 1 | — |
| 5 | Monument | B2 | The monument | STRUCK, NOT DASHING | 1 | — |
| 6 | Monument | A2 | The neon shops | CONE-BAITED CAR | 1 | Hands 1 (cones) |
| 7 | Monument | A3 | The stacked cubes | COMBO ×2 | 1 | — |
| 8 | Monument | B3 | The LED canyon | JUMP INTO A CAR | 1 | Legs 1 (jump) |
| 9 | Monument | C3 | The LED gateway | THROWN INTO A CAR | 1 | — |
| 10 | Parkland | C1 | The lantern pavilion | PUSH OFF A CAR | 1 | Arms 1 (push) |
| 11 | Parkland | C2 | The amphitheatre | A VAN | 2 | — |
| 12 | Parkland | C3 | The arch and the roundabout | COMBO ×2 | 1 | — |
| 13 | Parkland | B3 | The obelisk court | A POLICE CAR | 1 | — |
| 14 | Parkland | A3 | The belvedere | JUMP INTO A CAR | 1 | Legs 2 |
| 15 | Parkland | A2 | The dome by the canal | CONE-BAITED CAR | 2 | Hands 2 |
| 16 | Parkland | A1 | The reservoir terraces | PUSH OFF A CAR | 1 | Arms 2 |
| 17 | Parkland | B1 | The cascade | ON A RAISED ROAD | 1 | — |
| 18 | Parkland | B2 | The ring over the pools | COMBO ×3 | 2 | Battery 2 (a second charge) |
| 19 | Waterfront | A1 | The west portal | A BUS | 1 | — |
| 20 | Waterfront | B1 | The tunnel portal | JUMP INTO A CAR | 2 | Legs 3 |
| 21 | Waterfront | C1 | The east portal | A POLICE CAR | 1 | — |
| 22 | Waterfront | C2 | The east beach terrace | DROP ONTO A CAR | 2 | — |
| 23 | Waterfront | C3 | The east customs post | THROWN INTO A CAR | 1 | — |
| 24 | Waterfront | B3 | The stilt houses | PUSH OFF A CAR | 1 | Arms 3 |
| 25 | Waterfront | A3 | The west customs post | ON A RAISED ROAD | 2 | — |
| 26 | Waterfront | A2 | The west beach terrace | CONE-BAITED CAR | 1 | — |
| 27 | Waterfront | B2 | The circus | COMBO ×3 | 2 | Battery 3 (a faster recharge) |
- **Write-offs** (Edit 83, 93): Monument 9, Parkland 12, Waterfront 13: 34 bodies (7.11: 35; 7.1: 62).
- **Every brief is possible where it is set.** Checked from 90 s of traffic per district: the class runs there; raised traffic for "on a raised road"; a raised floor over traffic for a drop; cones for a cone brief.
- **Introduce, then test** (Edit 93): each part on the tile whose brief first needs it. Battery 1 on the dash tile; each Legs level on a jump tile, each Arms level on a push tile, each Hands level on a cone tile; Battery 2 and 3 on the combo ×3 tiles. No brief needs a part not yet issued.

### P7#hud-story~3 (rank 93, prototypes/p7/README.md)
![P7.12: B1's card: DASH INTO A CAR, the part just fitted](docs/p712_brief_b1.png)
![P7.12: the drone to B1 brings Battery 1](docs/p712_gift_battery.png)
![P7.12: C1's card: DROP ONTO A CAR, from the high road's gap](docs/p712_brief_c1.png)
![P7.11: the welcome wall greets the new chassis](docs/p711_a1_gap.png)
![P7.11: the tile card: ACT I · INDUCTION](docs/p711_brief.png)
![P7.11: Waterfront B3: the ship that takes the certified model to market](docs/p711_ship.png)
![P7.11: Waterfront A3: the west customs post](docs/p711_customs.png)
![P7.10: Monument A1 on foot: POINTS top right; the chassis reddened by part, its numbers beside it](docs/p710_chassis_red.png)
![P7.10: the drone to B1 brings Battery 1, the dash](docs/p710_gift_battery.png)
![P7.10: the DUMMY MONUMENT on the circus's island](docs/p710_monument.png)
![P7.10: Arcade's workshop: every part for credits; Battery 1 shipped fitted](docs/p710_arcade_workshop.png)
![P7.8: LEVEL UP across the field; the stats box reads POINTS and LEVEL](docs/p78_levelup.png)
![P7.8: the workshop: the chassis, its parts around it; Battery fits](docs/p78_workshop.png)
![P7.8: Battery 1 fitted](docs/p78_workshop_fit.png)
![P7.8: phone: the workshop by taps](docs/p78_touch_workshop.png)
![P7.8: phone: the story map by taps](docs/p78_touch_map.png)
![P7.7: the save screen, all three slots in use](docs/p77_saves_full.png)
![P7.7: NEW GAME: the name, typed](docs/p77_name_typed.png)
![P7.7: OVERWRITE asks twice](docs/p77_overwrite.png)
![P7.7: phone: the name entry by taps](docs/p77_phone_name.png)
![P7.7: the story map, headed with the slot](docs/p77_map.png)
![P7.6: one top edge: BODY, the field, POINTS · CREDITS; the objective on the top strip](docs/p76_a1_gap.png)
![P7.6: S25 Ultra (19.5:9): the 16:9 frame centred, the controls in it by default](docs/p76_s25.png)
![P7.6: Adjust layout: the stick and the diamond dragged into the margins](docs/p76_s25_edit.png)
![P7.6: the buttons at 120%](docs/p76_s25_edit_size.png)
![P7.6: in play with the player's layout](docs/p76_s25_custom.png)
![P7.6: a 16:9 phone: the small chips top left](docs/p76_phone169.png)
![P7.5: a clean screen: BODY as tall as DASH, no row under the stage](docs/p75_a1_gap.png)
![P7.5: Pause › Options](docs/p75_options.png)
![P7.5: Pause › Controls, keyboard](docs/p75_controls_keys.png)
![P7.5: Pause › Controls, gamepad](docs/p75_controls_pad.png)
![P7.5: phone, Pause › Controls](docs/p75_phone_controls.png)
![P7.4: Monument A1: the highway's parapet open over the road, lit](docs/p74_a1_gap.png)

### EDIT92#measured (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
## Measured
| Check | Result |
|---|---|
| Solids, floors, stairs, spawns, cone homes, with and without the art | identical on all 27 tiles |
| Tiles the art draws on | 9: Monument A1, A2, A3, C3; Parkland C1, B1; Waterfront A3, C3, B3 |
| Longest tale | 217 characters: four lines on the card |
| Tile card, Monument A1 | ACT I · INDUCTION · MONUMENT · TILE A1 · 1 OF 27; The welcome wall; the act line; the tale |
| Story map | I · MONUMENT, II · PARKLAND, III · WATERFRONT |

# Probe APIs
```
The coding agent's probe harness: runs "sim" probes headless in Node against the game's own modules.
Usage: node coder/harness.js probes.json [--check]
  probes.json: [{ id, expr }]. expr is the body of an async function of H; it returns true/false or { ok, detail }.
  --check: compile each expr only.
Prints one JSON line per probe: { id, ok, detail, error, ms }. A thrown error is a probe defect, never a pass or a fail.

H, the harness API (this block is what the analyst and the coder are shown):
  H.STORY, H.W6, H.X          the game modules: prototypes/p7/story.js, prototypes/p6/world6.js, prototypes/p6/sim.js
  H.REG                       every default the Story runs with (sim.js REG, PROTO, OVERRIDES, world6 P6SIM, story P7SIM)
  H.reg(id)                   the registry entry for id from content/params/tuning.parameters.json, or null
  H.progress(d, t, o)         a saved story with every tile before district d's tile t cleared; t in test.
                              o.tileWO: write-offs already counted on t. Any other key of o is copied onto the progress
  H.story(d, pr)              a StorySim for district d and progress pr; its traffic removed (only H.car cars appear)
  H.arcade(d)                 an ArcadeSim (Arcade, one district). H.sim6(d): a 6.10 Sim6 (the frozen rules)
  H.car(s, cls, x, y, h, v)   a test car (class cls, heading h radians, speed v) that joins s's view
  H.settle(s)                 steps s through hitstop, scroll and writeoff phases
  H.ready(s)                  brings s to phase 'play': delivers an owed part (the gift screen continued), continues the card
  H.kill(s, hit)              writes the chassis off by a crafted last hit (default { kind: 'dash', cls: 'sedan', combo: 1 }),
                              then checkTerminal and settle. Returns s
  H.next(s)                   the report, then the next chassis (continueReport, leaveShop)
  H.step(s, n, cmd)           n frames of input cmd (default {}), settling after each
  H.runTo(s, pred, n)         steps s until pred(s) or n frames (default 2400); returns pred(s)
  H.ev(s, type)               s's events of that type
  H.scene(s, tile)            the scene of tile ('B2') in s's district: props, dummyMonument, game (floors, statics)
  H.certify(o)                Waterfront B2 in test with the other 26 tiles cleared and one write-off left; its part
                              delivered, its card continued, then the last write-off (combo 5). Returns the sim at once.
                              o: as H.progress (e.g. { points: 123456, chassis: 40, t: 3600 })
  H.src(path)                 a repository file's text (path from the repository root)

The coding agent's page harness: runs "page" probes in the built game (Playwright Chromium, 1300 × 900).
Usage: node coder/page.js probes.json build.html [shots folder]
  probes.json: [{ id, expr }]. expr is the body of an async function of G; it returns true/false or { ok, detail }.
Prints one JSON line per probe: { id, ok, detail, error, ms, errors }. A thrown error is a probe defect.
Every probe also fails if the page threw an error while it ran.

G, the page API (each probe gets a fresh page):
  G.open()                    loads the build; resolves on the title screen
  G.openStory(pr)             seeds save slot 1 with progress pr, then STORY › CONTINUE › DEPLOY; delivers an owed part
                              and continues the tile card; resolves at phase 'play'
  G.certifyProgress(o)        the progress H.certify uses: Waterfront B2 in test, 26 tiles cleared, one write-off left
  G.lastWriteOff(hit)         in the page: the chassis written off by a crafted last hit (default a dash, combo 5)
  G.eval(fn, arg)             page.evaluate(fn, arg). window.__dummies is the app (screen, sim, story, slot);
                              window.__dummiesUI the test hooks (hud(), objective(sim), saves(), gift())
  G.waitFor(fn, ms, arg)      polls fn in the page until it returns truthy; resolves true, or false after ms
  G.press(key), G.wait(ms)    a key press (Space is A, Shift is B, Escape pauses); a pause
  G.shot(name)                a screenshot into the run's shots folder
  G.errors                    page errors so far
  G.page                      the Playwright page
```

# The code
## Files
- `prototypes/p7/story.js`: 339 lines
- `prototypes/p6/game.js`: 3282 lines
- `prototypes/p6/world6.js`: 2399 lines
- `prototypes/p6/sim.js`: 3669 lines
- `prototypes/p6/pixel.js`: 1149 lines
- `prototypes/p6/lab.js`: 354 lines
- `prototypes/p6/circus_valley.js`: 372 lines
- `prototypes/p6/content.js`: 3 lines
- `prototypes/jump/jump.js`: 53 lines
- `prototypes/controls/pads.js`: 98 lines
- `prototypes/p7/build.py`: 31 lines
- `prototypes/p7/shell.html`: 121 lines
- `content/story/story.json`: 115 lines
- `content/params/tuning.parameters.json`: 12433 lines

## Registry
505 IDs (edit93-2026-10-29); 429 read by the game's sources.

## P7SIM flags (story.js): the P7-only values both modes run
{"proto.recoilScale": 0.7, "proto.bounce.maxThrow": 40.0, "world.deckDropGaps": 1.0, "world.deckFlightsMin": 1.0, "props.cone.minVisible": 0.9, "battery.dashJumpCost": 0.0, "abilities.hands.tapDrop": 1.0, "proto.batteryModel": 1.0, "world.dummyMonument": 1.0, "world.storyArt": 1.0}

## Sim phases the code compares against
away, brief, carry, drop, ending, gift, give, hitstop, in, inbound, lift, next, play, report, scroll, shop, sink, writeoff

## Events the code emits
admit, chassis, combo, combo-end, commit, cone-hit, cone-release, cone-rest, cone-stop, cone-struck, contact-ignored, credit, debug-credit, debug-module, deck-drop, delivered, denied, drone-dispatch, drone-drop, drone-pickup, drop, ending, exit, gift, gridlock, gridlock-clear, held, hitch, honk, impact, interrupt, jump, jump-land, knock, land, learn-standoff, level, lunge, milestone, pickup, punt, purchase, purchase-denied, push, rail-jump, release, rescued, resume, ring, road-cleared, screen, shop-open, shop-skip, skid, sling, slip, splash, stair, story-clear, story-deliver, story-enter, story-fence, story-ferried, story-ferry, story-gift, throw, touch, touch-spent, unstick, writeoff

## content/story/story.json
Top-level keys: meta, ending, tasks, classes, districts; a district: id, name, act, intro, order, tiles; a tile: title, task, gift, tale
ending: 'Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage.'

## Outlines (line ranges, kind, name)
prototypes/p6/game.js (3282 lines)
      9-9     arrow    INFO
     34-34    const    TOUCH
     35-42    function resize
     57-57    const    HITS
     58-58    function hitbox
     59-59    function uiTap
     65-65    arrow    okProgress
     66-66    arrow    slotCount
     67-67    arrow    nameMax
     68-68    arrow    defaultName
     69-69    function readSlot
     71-71    function writeSlot
     72-72    function eraseSlot
     73-73    function allSlots
     74-74    function saveStory
     75-75    function loadSlot
     77-79    function moveOldStory
     80-80    const    MON
     81-81    function stamp
     82-82    const    FIELD
     84-88    function preview
     90-90    arrow    clamp
    100-100   const    CPARAM
    103-109   function pv
    110-113   function jv
    114-114   function fillIn
    115-115   function place
    116-119   function copy
    130-130   function kick
    131-136   function shakeOffset
    137-142   function puff
    143-147   function mix
    144-144   arrow    h
    150-153   function startLevel
    154-179   function startLevelNow
    181-181   function startStory
    182-182   function toStoryMap
    183-183   function titleItems
    186-189   function toSaves
    190-190   arrow    slotActs
    192-192   const    NAME_ROWS
    193-193   arrow    nameKeyOf
    199-199   arrow    cleanName
    202-202   function nameStart
    203-203   function nameCancel
    204-204   function nameFocus
    206-206   function nameType
    207-207   function nameDel
    208-213   function nameDone
    214-214   function nameOk
    215-223   function nameMenu
    224-241   function savesMenu
    275-275   function clearEdges
    276-276   function inUI
    306-306   arrow    radial
    312-312   const    PAD_NAME
    313-338   function pollPad
    339-345   function moveVec
    346-351   function buildCmd
    357-357   const    FACE
    358-358   const    FACE_NODE
    359-365   function touchDevice
    362-362   arrow    mm
    366-374   function touchOn
    375-378   function fullscreen
    376-376   arrow    lock
    384-384   function saveTouchCfg
    385-403   function touchLayout
    404-407   function touchLayoutCss
    408-408   arrow    inChip
    409-435   function touchEvent
    437-440   function editBar
    441-460   function touchEditEvent
    443-443   arrow    put
    461-466   function touchEditSize
    467-467   function touchEditStart
    468-468   function touchEditEnd
    469-479   function drawTouchEdit
    471-471   arrow    ring
    480-487   function stickAt
    488-492   function touchDirs
    495-503   function faceWord
    504-542   function drawTouch
    510-510   arrow    glow
    511-511   arrow    disc
    568-568   const    THEME_NAME
    570-570   const    LEVEL6
    572-572   arrow    maxHP
    573-573   const    DENY_TEXT
    577-596   function juice
    598-598   const    SENIORITY
    599-599   function seniorityOf
    600-602   function trackCars
    603-603   function upm
    604-616   function whenOk
    618-631   function enrich
    633-639   function present
    640-644   function carGap
    645-671   function deriveCases
    672-677   function noteContact
    680-689   function contactOf
    683-683   arrow    eff
    690-735   function hitJuice
    736-741   function brokenPart
    744-773   function barkLine
    752-752   const    SIT
    754-754   arrow    spec
    775-780   function wrapSmall
    783-822   function drawBarks
    794-794   arrow    hits
    811-814   arrow    ring
    823-949   function processEvents
    952-952   function giftChime
    953-961   function giftFanfare
    963-963   function horn
    964-964   function dashify
    965-965   function toast
    969-969   const    PAUSE_STORY
    970-970   arrow    pauseItems
    971-971   const    END_ITEMS
    975-975   arrow    nextLevel
    976-976   arrow    NODE
    977-977   arrow    nodeDesc
    978-1086  function handleMenus
   1091-1091  const    TY
   1108-1111  function rr
   1112-1114  function txt
   1115-1116  arrow    h
   1115-1115  function rgba
   1116-1116  function roleC
   1117-1131  function panel
   1132-1136  function glassKey
   1137-1137  function fmtT
   1138-1138  function num
   1139-1144  function wrapLines
   1145-1149  function wrapText
   1150-1159  function drawKeys
   1168-1168  arrow    ALL
   1169-1169  arrow    toA
   1170-1170  arrow    EXT
   1172-1210  function levelArt
   1177-1177  arrow    zL
   1178-1185  arrow    roofSpec
   1186-1200  arrow    sprite
   1201-1201  arrow    deckAt
   1202-1202  arrow    blockOf
   1211-1211  function flush
   1212-1212  function carSpr
   1213-1213  function shortId
   1214-1214  function coneLift
   1215-1223  function coneFn
   1224-1224  function rotRect
   1225-1225  function arcPoly
   1226-1226  function mixOnce
   1228-1243  function corridorPts
   1244-1265  function blindSpots
   1246-1255  arrow    add
   1253-1253  arrow    far
   1267-1286  function drawZones
   1273-1273  arrow    open
   1284-1284  arrow    inSensor
   1287-1305  function drawPath
   1307-1319  function drawStopCue
   1320-1324  function drawViewEdges
   1326-1336  function markCar
   1337-1343  function drawMarks
   1345-1345  arrow    carsOf
   1346-1346  arrow    lay
   1347-1347  arrow    zLift
   1348-1348  function bodyFloor
   1349-1349  function onFloor
   1350-1350  function onDeck
   1351-1351  function onGroundDraw
   1352-1352  function stairDeck
   1353-1358  function cueLevel
   1359-1366  function cueDeck
   1367-1373  function bodyLift
   1374-1374  function deckOf
   1375-1375  function carShadow
   1376-1390  function dynShadows
   1378-1378  arrow    off
   1391-1396  function dropK
   1397-1406  function reachEnd
   1408-1428  function drawBodyGround
   1429-1451  function drawBodySprite
   1454-1463  function drawNose
   1458-1458  arrow    add
   1464-1476  function drawCarSprite
   1470-1470  arrow    roof
   1478-1492  function pip
   1493-1502  function drawCarMarks
   1505-1509  function tagRect
   1510-1525  function drawTag
   1526-1532  function drawDrone
   1536-1560  function drawDeck
   1564-1591  function drawLights
   1593-1600  function drawBoom
   1601-1629  function drawSprites
   1612-1612  arrow    L
   1630-1632  function relight
   1633-1636  function ghost
   1637-1675  function drawEffects
   1676-1691  function drawRingsStreaks
   1692-1692  const    ROLE_K
   1693-1693  function roleK
   1694-1694  function lowHealth
   1695-1714  function drawParts
   1715-1715  function mixRect
   1716-1724  function drawStamp
   1725-1762  function drawLive
   1732-1736  arrow    cues
   1766-1777  function composeScroll
   1782-1782  arrow    elevOf
   1783-1792  function where6
   1793-1799  function shadows6
   1800-1862  function drawLive6
   1804-1808  arrow    cues
   1810-1810  arrow    into
   1811-1811  arrow    meItem
   1865-1865  const    GIFT_BOX
   1866-1871  function drawGiftBox
   1872-1872  function rescueLift
   1873-1881  function drawRescue6
   1882-1888  function drawLoading
   1889-1896  function drawField
   1897-1903  function drawField6
   1904-1912  function blitField
   1914-1930  function drawFieldHD
   1933-1933  arrow    kMin
   1934-1943  function liveBark
   1946-1973  function drawBubblesHD
   1949-1949  arrow    toC
   1951-1951  arrow    hit
   1976-1996  function objective
   1997-2045  function drawMessages
   2004-2004  arrow    fit
   2017-2017  arrow    widthOf
   2018-2018  arrow    lineW
   2021-2021  arrow    fits
   2025-2025  arrow    clip
   2026-2039  arrow    drawItem
   2047-2047  function roadLabel
   2048-2068  function drawFrame
   2071-2091  function playKeys
   2092-2105  function drawKeysPanel
   2106-2106  const    WHERE6
   2108-2111  function whereOf
   2112-2112  function fitTextR
   2113-2113  function fitNumR
   2114-2114  function fitText
   2115-2124  function drawScore
   2125-2137  function drawTopBar
   2139-2167  function drawHUD
   2173-2173  const    MAP_Z
   2176-2179  function mapGeom
   2180-2201  function mapRoads
   2182-2182  arrow    off
   2202-2217  function mapCanvas
   2218-2255  function drawDistrict
   2257-2257  const    PART_NAME
   2259-2263  function partLevels
   2268-2280  function dollMods
   2278-2278  arrow    own
   2281-2289  function dollCanvas
   2290-2302  function partEffects
   2306-2306  const    PART_TAG
   2307-2307  function partReds
   2308-2308  function redText
   2309-2337  function drawBodyPanel
   2340-2340  function veil
   2341-2350  function menuList
   2351-2351  function difficultyHealth
   2352-2357  function endItems
   2358-2358  function quotaOf
   2359-2384  function drawTitle
   2387-2387  arrow    plural
   2388-2392  function storyCursor
   2393-2398  function giftText
   2399-2421  function drawModeTitle
   2424-2428  function slotLines
   2429-2473  function drawSaves
   2474-2479  function nameKeyRects
   2480-2501  function drawNameEntry
   2502-2557  function drawStoryMap
   2517-2517  arrow    at
   2558-2576  function drawBrief
   2581-2586  function sprCanvas
   2587-2600  function giftArtOf
   2593-2593  arrow    mk
   2601-2601  function giftReady
   2602-2669  function drawGiftPopup
   2605-2605  arrow    clamp01
   2670-2677  function drawBriefFoot
   2678-2693  function drawMapFences
   2680-2680  arrow    open
   2681-2681  arrow    seen
   2694-2694  arrow    c32
   2695-2695  const    FENCE
   2696-2705  function drawStoryFence
   2699-2699  arrow    at
   2706-2733  function drawReport
   2734-2773  function drawShop
   2776-2776  const    BADGE
   2778-2795  function abilityStats
   2796-2847  function drawAbilityShop
   2848-2848  const    PART_WORD
   2852-2852  const    WS_POS
   2854-2859  function seatOf
   2860-2860  arrow    wsLocked
   2861-2861  arrow    wsCost
   2862-2868  function wsMove
   2869-2932  function drawWorkshop
   2883-2883  arrow    seatAt
   2934-2959  const    CUE_KEY
   2940-2959  function cueCanvas
   2944-2944  arrow    car
   2945-2945  arrow    loc
   2960-2969  function drawCueKey
   2973-2973  arrow    deviceOf
   2974-2979  function optionItems
   2980-2987  function optionDo
   2988-2988  arrow    controlItems
   2989-3004  function controlRows
   2991-2991  arrow    nm
   3005-3019  function drawControls
   3020-3038  function drawPause
   3039-3054  function drawEnding
   3056-3063  function render
   3064-3083  function renderScreen
   3086-3086  const    MOVE_NAME
   3087-3098  function drawComboMeter
   3099-3106  function drawPadSetup
   3109-3151  const    TUNE
   3159-3163  function current
   3164-3168  function setParam
   3169-3214  function buildTune
   3215-3223  function syncTune
   3224-3224  function toggleTune
   3235-3239  function showTrace
   3243-3243  arrow    done
   3249-3249  function appStatus
   3252-3273  function frame

prototypes/p6/world6.js (2399 lines)
     19-19    const    P6SIM
     29-29    arrow    EXT
     32-32    const    CON
     37-37    arrow    apronOf
     42-54    function capture
     55-55    arrow    captureRect
     57-57    function each
     58-58    function walk
     59-74    function clipRun
     72-72    arrow    onScreen
     75-75    arrow    shift
     76-76    arrow    chamf
     77-77    function lawn
     78-81    function pathLine
     82-84    function tiles
     85-94    function pool
     96-96    const    HG
     98-98    arrow    hsh
     99-99    arrow    hedgeC
    100-100   arrow    lawnC
    101-101   const    TURF
    102-102   arrow    turfC
    103-103   arrow    mossC
    104-133   function mass
    134-134   function block
    137-137   arrow    paveC
    138-138   arrow    slabC
    139-139   arrow    diagC
    144-144   arrow    onPath
    146-146   arrow    pathMX
    147-147   arrow    pathMY
    148-162   function gardenPave
    158-158   arrow    on1
    163-171   function drawBed
    177-177   const    MED
    178-178   const    GREAT
    179-182   function smallPlanter
    186-186   const    PROG
    187-187   const    PAV
    188-192   function jet
    193-203   function shellSprite
    195-195   arrow    put
    204-212   function towerSprite
    206-206   arrow    put
    213-219   function domeSprite
    215-215   arrow    put
    220-223   function lawnPanel
    224-228   function parterre
    229-233   function fountainCell
    234-240   function plazaCell
    241-245   function fountainSmall
    246-262   function pavilion
    263-265   function cellRect
    266-325   function gardenPlan
    268-268   arrow    okR
    283-283   arrow    gapW
    292-292   arrow    touch
    326-329   function gardenSculptures
    333-404   function brutal
    336-336   arrow    put
    337-337   arrow    half
    351-351   arrow    inV
    352-352   arrow    darker
    353-362   arrow    face
    363-379   arrow    drawVol
    380-384   arrow    shadeRoof
    405-416   function brutalShadow
    407-407   arrow    fp
    417-421   function monolith
    422-426   function planter
    429-438   function sculpture
    431-431   arrow    R
    439-439   function bollard
    442-449   function sculptureCourt
    450-450   const    SCULPT
    452-456   function escalators
    457-457   arrow    stairProp
    459-462   function ringRoutes
    463-502   function ringLayer
    467-467   arrow    inArc
    503-513   function straightDeck
    517-529   function deckDropGaps
    519-519   arrow    opened
    520-520   arrow    crossings
    531-534   function deckFlight
    536-541   function apronMat
    548-572   function walkGaps
    554-554   arrow    clear
    576-610   function walkwayLayer
    580-580   arrow    gapAt
    586-586   arrow    out
    587-587   arrow    edgeOf
    612-621   function drawMonument
    623-628   function splitRoad
    629-642   function paintSplit
    647-647   arrow    fil
    648-648   arrow    loop2
    649-667   const    DISTRICTS
    685-685   arrow    TILE
    691-700   function polyMask
    702-706   const    HILL_SOLID
    707-707   arrow    WROAD
    708-708   const    BRIDGE_GAPS
    709-709   const    WATER
    719-722   function flight
    723-731   const    WSTAIRS
    732-732   arrow    lvl0
    733-733   const    SAND
    735-745   function terraceSprite
    737-737   arrow    put
    747-760   function stiltSprite
    749-749   arrow    put
    762-773   function portalSprite
    764-764   arrow    put
    775-848   function waterPre
    818-818   arrow    box
    850-887   function waterTile
    890-913   function dummyStatue
    892-892   arrow    at
    893-893   arrow    tone
    896-896   arrow    put
    897-900   arrow    box
    914-920   function dummyMonument
    923-923   arrow    ART
    924-924   arrow    onSpr
    925-925   arrow    lumOf
    926-935   function welcomeWall
    936-944   function shopSigns
    945-949   function cubeRim
    946-946   arrow    at
    950-966   function gatewayLayer
    962-962   arrow    vtext
    967-975   function lanternSprite
    976-980   function falls
    981-983   function runnel
    984-989   function customsSign
    990-998   function containerShip
   1001-1011  function sceneSim
   1013-1018  function labSim
   1020-1030  function junctionArms
   1032-1056  function vDeck
   1058-1064  function gridLines
   1067-1081  function alignFlights
   1083-1093  function holeOpenings
   1094-1098  function vEscalators
   1096-1096  arrow    at
   1100-1104  function waterBlock
   1106-1115  function cubeStack
   1116-1124  function poolFP
   1125-1129  function ledPanel
   1130-1136  function drum
   1132-1132  arrow    put
   1137-1142  function billboard
   1144-1281  function buildScreen
   1150-1150  const    RBS
   1152-1152  const    ANG
   1165-1165  arrow    lvl
   1205-1205  arrow    rd
   1206-1206  arrow    roadOk
   1248-1248  arrow    blocked
   1249-1249  arrow    underDeck
   1250-1250  arrow    inRects
   1251-1251  arrow    free
   1283-1291  function diagRoads
   1292-1358  function parkTile
   1297-1297  arrow    free
   1298-1298  arrow    okP
   1302-1302  arrow    piece
   1303-1312  const    SP
   1322-1322  arrow    cas
   1348-1348  arrow    tb
   1360-1415  function monumentTile
   1361-1361  arrow    u
   1418-1438  function chongqing
   1439-1475  function monumentCentre
   1441-1441  arrow    sq
   1445-1446  arrow    diag
   1455-1455  arrow    laneD
   1459-1459  arrow    okP
   1480-1480  arrow    inR
   1481-1489  function polyDist
   1490-1498  function mergeRects
   1499-1499  arrow    rectFloor
   1500-1505  function deckFloor
   1506-1512  function ringFloor
   1508-1508  arrow    inArc
   1515-1524  function coneShows
   1525-1578  function gameData
   1557-1557  arrow    offPoly
   1558-1558  arrow    ground
   1559-1559  arrow    pick
   1563-1563  arrow    score
   1583-1583  arrow    horizE
   1584-1584  arrow    edgePt
   1585-1585  arrow    edgeRect
   1586-1586  function groundFree
   1589-1589  const    INW
   1590-1595  function arrives
   1596-1596  arrow    cpZone
   1597-1597  function runsOf
   1598-1678  function edgePass
   1601-1601  arrow    pre
   1605-1614  arrow    plantFlags
   1685-1685  arrow    hashId
   1686-1686  arrow    NOOP
   1687-1691  function quiet
   1692-1739  function linkWorld
   1699-1699  arrow    add
   1709-1709  arrow    outside
   1715-1715  const    SD
   1740-1745  function recOf
   1746-1750  arrow    routeOf
   1751-1756  function ghostOf
   1757-1766  function seamGhosts
   1768-1775  function trafficTick
   1779-1792  function seamGiveWay
   1793-1831  function stepWorld
   1837-1842  function seen
   1843-1843  function groupCars
   1844-1844  arrow    sameRec
   1845-1849  function roomAt
   1850-1854  function queued
   1855-1864  function spawn
   1865-1888  function manage
   1889-1892  function goLive
   1900-1930  function fillDead
   1904-1904  arrow    mark
   1926-1926  arrow    fp
   1931-1964  function fillPockets
   1933-1933  arrow    link
   1934-1934  arrow    stand
   1941-1941  arrow    gAt
   1942-1942  arrow    fAt
   1960-1960  arrow    fp
   1965-1989  function buildWorld
   1991-1996  function viewCars
   1999-1999  arrow    carKey
   2000-2000  arrow    carSpr
   2002-2036  function compose
   2013-2027  arrow    drawLayer
   2038-2043  function layerOf
   2047-2047  arrow    INFO
   2048-2048  arrow    nameOf
   2049-2384  class    Sim6
   2050-2059  method   Sim6.constructor
   2060-2078  method   Sim6.reset
   2079-2079  method   Sim6.enter
   2080-2080  method   Sim6.screenName
   2081-2081  method   Sim6.buildView
   2082-2082  method   Sim6.carsLeft
   2083-2083  method   Sim6.allCars
   2084-2084  method   Sim6.bodyLayer
   2085-2085  method   Sim6.meets
   2086-2086  method   Sim6.bodyDeck
   2087-2087  method   Sim6.floorOf
   2088-2088  method   Sim6.onGround
   2089-2094  method   Sim6.spawnBody
   2095-2099  method   Sim6.pickSpawn
   2101-2135  method   Sim6.step
   2136-2136  method   Sim6.moveBody
   2137-2137  method   Sim6.bodyControl
   2139-2148  method   Sim6.floorStep
   2149-2160  method   Sim6.stairStep
   2163-2185  method   Sim6.floorMove
   2167-2167  arrow    block
   2186-2194  method   Sim6.neighbourFloor
   2197-2211  method   Sim6.startDrop6
   2201-2201  arrow    plan
   2212-2216  method   Sim6.land
   2219-2231  method   Sim6.startRescue
   2232-2242  method   Sim6.landPoints
   2243-2264  method   Sim6.stepRescue
   2250-2250  arrow    next
   2266-2326  method   Sim6.collideBody
   2270-2270  arrow    block
   2271-2271  arrow    push
   2272-2272  arrow    rect
   2327-2332  method   Sim6.edgeOpen
   2333-2333  method   Sim6.moveCones
   2334-2334  method   Sim6.coneSpotValid
   2335-2335  method   Sim6.dropHeld
   2336-2336  method   Sim6.throwHeld
   2338-2353  method   Sim6.checkFlip
   2354-2354  method   Sim6.canCross
   2355-2355  method   Sim6.edgeLift
   2356-2372  method   Sim6.flip
   2373-2376  method   Sim6.checkTerminal
   2377-2377  method   Sim6.drawDrones
   2378-2383  method   Sim6.trace
   2386-2395  function circleRect

## prototypes/p7/story.js (Story mode), in full
```js
/* DUMMIES P7.3 (GDD Edits 81–84): Story mode, and Arcade's verbs. The Test City, tile by tile: Monument, then Parkland, then Waterfront.
   - A district opens on its first tile (content/story/story.json, `order`). The dummy spawns there.
   - A tile wants story.writeOffs.<district>.<tile> write-offs that meet Farsight's brief: a test on the hit that writes the
     chassis off (Edit 82: a count per tile; only the last hit counts, D66).
   - Edit 83: fences hold every edge toward a tile not yet open; they cannot be jumped. Open tiles: the cleared ones and the
     tile in test. Cleared tiles stay open: walk back through them. Write-offs there score, but count for nothing.
   - Edit 82: every body written off pays economy.creditsPerWriteOff, counted or not. Levels cost story.price.ability.level1–3
     (3, 4, 5): a level-1 power-up is three bodies.
   - Some tiles carry a gift: a verb (an ability's level 1), installed on arrival. Verbs are issued, never sold (Edit 84).
   - Edit 83: a clear calls a Farsight drone. It lifts the dummy, carries it across the edge into the next tile, and sets it
     down off the road near where it crossed (story.ferryDepth). Then the next tile's card.
   - Edit 84: gifts ride in on the drone. The drone that ferries the dummy into a gift tile carries the module in view, lowers
     it onto the dummy (proto.droneLiftSeconds), and the sim pauses in phase 'gift' for the gift screen (continueGift). Then it
     carries the dummy across. Monument: Legs 1 at C1, Hands 1 at A2, Arms 1 at C3.
   - Edit 84: ArcadeSim. One district a run. Edit 91: every part for credits; the chassis ships with Battery 1 (arcade.giftEvery
     retired).
   - Edit 83: P7SIM, the P7.2 values for both modes: the knock keeps proto.recoilScale of the Newtonian velocity and slides at
     most proto.bounce.maxThrow.
   - Edit 89: Story has no credits. Edit 91 (P7.10): no levels either. Every part comes by drone on a fixed tile (story.json
     gifts, eleven in all): Battery 1 (the dash) at Monument B1 ... Arms 3 at Waterfront B3. Points are the score. The dummy starts
     on foot (proto.batteryModel 1: no dash before Battery 1; damage.bodyHealthOnFoot). In the tile in test, a hit that would
     write the chassis off but misses the brief holds it at story.missFloor (hitFloor). Arcade: every part for credits; its
     chassis ships with Battery 1; no drone gifts.
   - The map reveals cleared tiles and the one in test. Progress is one plain object (`progress`), saved by the page.
   Headless in Node: require('./story.js'). In the page: window.STORY. */
(function (root) {
  'use strict';
  const NODE = typeof module !== 'undefined' && module.exports;
  const X = NODE ? require('../p6/sim.js') : root.DUMMIES;
  const W6 = NODE ? require('../p6/world6.js') : root.WORLD6;
  const DATA = NODE ? JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'content', 'story', 'story.json'), 'utf8')) : root.DUMMIES_STORY;
  const SIDES = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
  const nameOf = (c, r) => 'ABC'[c] + (r + 1);
  const cellOf = (t) => ['ABC'.indexOf(t[0]), +t[1] - 1];
  const DIST = DATA.districts, TOTAL = DIST.reduce((a, d) => a + d.order.length, 0);
  const P7SIM = { 'proto.recoilScale': 0.7, 'proto.bounce.maxThrow': 40, // Edit 83: the ricochet the dummy survives; Arcade and Story
    'world.deckDropGaps': 1, 'world.deckFlightsMin': 1, 'props.cone.minVisible': 0.9, // Edit 85: every highway a flight and a drop gap; cones in view
    'battery.dashJumpCost': 0, 'abilities.hands.tapDrop': 1, // Edit 90: a dash's jump is free; X taps a cone down when none is in reach
    'proto.batteryModel': 1, 'world.dummyMonument': 1, // Edit 91: Battery 1 the dash, 2 a second charge, 3 a faster recharge; the circus's monument
    'world.storyArt': 1 }; // Edit 92: the story's tile art (Narrative A, Certified), cosmetic only
  const BASE = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES, W6.P6SIM, P7SIM);

  // ---------- progress: one plain object, JSON-safe
  function newProgress() {
    return { v: 1, district: DIST[0].id, done: {}, tileWO: 0, owned: {}, credits: 0, points: 0, chassis: 0, writeOffs: 0, t: 0,
      gifts: {}, tilePoints: {}, complete: false };
  }
  const districtOf = (id) => DIST.find((d) => d.id === id) || null;
  const doneIn = (pr, id) => (pr.done && pr.done[id]) || [];
  function activeTile(pr, id) { const d = districtOf(id), dn = doneIn(pr, id); return d ? d.order.find((t) => !dn.includes(t)) || null : null; }
  function clearedCount(pr) { return DIST.reduce((a, d) => a + doneIn(pr, d.id).length, 0); }
  function tileNumber(id, t) { let n = 0; for (const d of DIST) { if (d.id === id) return n + d.order.indexOf(t) + 1; n += d.order.length; } return 0; } // 1–27
  function nextDistrict(id) { const i = DIST.findIndex((d) => d.id === id); return i >= 0 && i + 1 < DIST.length ? DIST[i + 1].id : null; }
  // 'cleared' · 'active' (the tile in test, or open to enter) · 'hidden'
  function tileState(pr, id, t) {
    if (doneIn(pr, id).includes(t)) return 'cleared';
    if (!pr.complete && pr.district === id && activeTile(pr, id) === t) return 'active';
    return 'hidden';
  }
  const tileOf = (id, t) => { const d = districtOf(id); return d ? d.tiles[t] : null; };
  const needOf = (id, t, P) => (P || BASE)['story.writeOffs.' + id + '.' + t]; // Edit 82: write-offs that clear this tile
  // Edit 85: Story's traffic, tile by tile. The tile in test and its four neighbours (its cars come from them) run at
  // story.traffic.<district>.<tile> times the district's density; the rest of the district at 1. A neighbour with a roundabout
  // (a street ring, Parkland's deck ring) stays at 1: a ring at capacity out of sight would only fill and be culled. Cars still
  // enter the view only across its edges, from out of sight
  const trafficOf = (id, t, P) => (P || BASE)['story.traffic.' + id + '.' + t] || 1;
  const hasRing = (sc) => !!(sc.islands || sc.ringSim);
  function storyDensity(pr, id, P) {
    return (sc) => { const t = !pr.complete && pr.district === id ? activeTile(pr, id) : null; if (!t) return 1; const [c, r] = cellOf(t), dd = Math.abs(sc.col - c) + Math.abs(sc.row - r); return dd === 0 || (dd === 1 && !hasRing(sc)) ? trafficOf(id, t, P) : 1; };
  }

  // ---------- the brief: text and test
  function taskText(task, P) {
    P = P || BASE;
    const T = DATA.tasks[task.kind] || DATA.tasks.any, cl = DATA.classes[task.cls] || [String(task.cls || '').toUpperCase(), String(task.cls || '') + ' fleet'];
    const n = task.param ? P[task.param] : null;
    const fill = (s) => String(s).replace('{n}', n).replace('{cls}', task.kind === 'cls' ? cl[0] : '').replace('{clsLong}', cl[1]);
    return { label: fill(T.label), brief: fill(T.brief).replace('a ' + cl[0], (/^[AEIOU]/.test(cl[0]) ? 'an ' : 'a ') + cl[0].toLowerCase()) };
  }
  // hit: the impact event that wrote the chassis off. level: the body's level at that moment.
  function meets(task, hit, level, P) {
    P = P || BASE;
    if (!task || task.kind === 'any') return true;
    if (!hit) return false;
    switch (task.kind) {
      case 'drop': case 'jump': case 'push': case 'bounce': case 'struck': case 'dash': return hit.kind === task.kind;
      case 'level': return (level || 0) >= 1;
      case 'cone': return hit.cause === 'cone';
      case 'combo': return (hit.combo || 1) >= P[task.param];
      case 'cls': return hit.cls === task.cls;
      default: return false;
    }
  }

  // ---------- Edit 84: the parts Farsight issues, in the story's order, and the drone that brings them. Edit 91: all eleven
  const VERBS = (() => { const out = []; for (const d of DIST) for (const t of d.order) { const g = d.tiles[t].gift; if (g && g.node && !out.includes(g.node)) out.push(g.node); } return out; })();
  const VERB_AT = {}; for (const d of DIST) for (const t of d.order) { const g = d.tiles[t].gift; if (g && g.node && !VERB_AT[g.node]) VERB_AT[g.node] = d.name + ' ' + t; } // Edit 91: 'Monument C1'
  // Edit 91: the gifts of tiles already cleared (a save from before Edit 91 catches up), and the next gift on the schedule
  function giftsCleared(pr) { const out = []; for (const d of DIST) for (const t of doneIn(pr, d.id)) { const g = d.tiles[t].gift; if (g && g.node) out.push(g.node); } return out; }
  function nextGift(pr) { for (const d of DIST) for (const t of d.order) { const g = d.tiles[t].gift; if (g && g.node && !(pr.owned && pr.owned[g.node])) return { node: g.node, district: d.id, tile: t, n: tileNumber(d.id, t) }; } return null; }
  const partsOwned = (owned) => VERBS.filter((n) => owned && owned[n]).length;
  // a drone flies in from (hx, hy) to the body; with a gift it lowers the module, installs it and pauses the sim for the gift screen
  function droneTo(sim, hx, hy, opts) {
    const b = sim.body, P = sim.P;
    b.mode = 'rescue'; Object.assign(b, { lunge: null, stair: null, jump: null, z: 0, vx: 0, vy: 0, _spr: null });
    return Object.assign({ t: 0, phase: 'inbound', k: 0, under: 0, up: 0, item: 0, lift: P['proto.droneLiftSeconds'], v: P['proto.droneSpeed'], to: null,
      drone: { x: hx, y: hy, alt: 1, state: 'inbound', rescue: true, hx, hy } }, opts);
  }
  // inbound → give (the module lowers onto the dummy; then phase 'gift') → the ferry's lift, or away
  function stepDelivery(sim, dt) {
    const rs = sim.rescue, b = sim.body, d = rs.drone;
    rs.t += dt; rs.k += dt;
    const fly = (x, y) => { const dx = x - d.x, dy = y - d.y, l = Math.hypot(dx, dy), st = rs.v * dt; if (l <= st) { d.x = x; d.y = y; return true; } d.x += dx / l * st; d.y += dy / l * st; return false; };
    const next = (ph) => { rs.phase = ph; rs.k = 0; d.state = ph; };
    if (rs.phase === 'inbound') { if (fly(b.x, b.y)) next(rs.gift ? 'give' : rs.ferry ? 'lift' : 'away'); return true; }
    if (rs.phase === 'give') {
      rs.item = Math.min(1, rs.k / rs.lift);
      if (rs.item >= 1) { sim.installGift(rs.gift); rs.given = rs.gift; rs.gift = null; next(rs.ferry ? 'lift' : 'away'); sim.phase = 'gift'; } // the gift screen
      return true;
    }
    if (rs.phase === 'away') { // a delivery only: the drone leaves, the dummy is free
      Object.assign(b, { mode: 'idle', vx: 0, vy: 0 }); d.state = 'outbound'; d.alt = 9; (sim.leaving = sim.leaving || []).push(d); sim.rescue = null; // alt 9: the gift drone's hover
      sim.emit('delivered', { node: rs.given || null }); return true;
    }
    return false;
  }

  // ---------- the story's player sim: a Sim6 that starts on the district's tile in test, fences it, and counts the brief
  class StorySim extends W6.Sim6 {
    // progress: newProgress() or a saved one, its district = this district. opts: Sim6's (world, warm)
    constructor(id, overrides, progress, opts) {
      const pr = progress, ov = Object.assign({}, P7SIM, overrides || {}), P0 = Object.assign({}, BASE, ov);
      for (const n of giftsCleared(pr)) pr.owned[n] = true; // Edit 91: a cleared tile's part is on the body
      ov['run.appearances.road'] = P0['story.shiftCars']; // the story has no shift clock: a district's traffic runs for story.shiftCars cars
      for (const L of [1, 2, 3]) ov['economy.price.ability.level' + L] = P0['story.price.ability.level' + L]; // Edit 82: the story's prices, 3, 4, 5
      const carry = { owned: Object.assign({}, pr.owned), credits: pr.credits, points: pr.points, chassis: pr.chassis, writeOffs: pr.writeOffs, t: pr.t, purchases: [], milestones: pr.milestones || {} };
      super(id, ov, carry, Object.assign({}, opts || {}, { startTile: activeTile(pr, id) || districtOf(id).order[0], story: pr, density: storyDensity(pr, id, P0) }));
    }
    reset() {
      super.reset();
      if (!this.W6 || !this.opts || !this.opts.story) return; // the base constructor's first reset, before the world exists
      this.story = this.opts.story; this.storyMode = true;
      this.fenceHit = null; this.storyLast = null;
      const t = this.screenName();
      this.entered = t === activeTile(this.story, this.levelId);
      if (this.entered) this.arrive(t);
      if (this.rescue) { this.pendingBrief = true; this.phase = 'play'; } // a gift still owed: the drone brings it first (Edit 84)
      else this.phase = 'brief'; // the tile card: its tale and Farsight's brief (continueBrief)
    }
    giftOf(t) { const tile = tileOf(this.levelId, t), g = tile && tile.gift; return g && g.node && !this.story.gifts[this.levelId + ':' + t] ? g.node : null; }
    arrive(t) { // the dummy is in the tile in test. A verb not yet delivered comes by drone (Edit 84)
      const pr = this.story, P = this.P, key = this.levelId + ':' + t, tile = tileOf(this.levelId, t), g = tile && tile.gift;
      this.entered = true; this.tilePts0 = this.run.points; this.tileT0 = this.t;
      if (g && g.credits && !pr.gifts[key]) { pr.gifts[key] = true; this.run.credits += P[g.credits]; this.emit('story-gift', { tile: t, credits: P[g.credits] }); }
      const owed = this.giftOf(t);
      if (owed && !this.rescue) { const b = this.body; this.rescue = droneTo(this, b.x, -40, { gift: owed, tile: t }); this.emit('story-deliver', { tile: t, node: owed }); }
      this.syncProgress();
      this.emit('story-enter', { tile: t, n: tileNumber(this.levelId, t), task: tile ? tile.task : null });
    }
    installGift(node) { // Edit 84: the module is on the body. Edit 91: a heavier chassis with the dash keeps its damage
      const t = (this.rescue && this.rescue.tile) || this.screenName(), m0 = this.maxHealth(), b = this.body;
      this.run.owned[node] = true; if (b && b.alive) b.health = Math.min(this.maxHealth(), b.health + this.maxHealth() - m0); this.story.gifts[this.levelId + ':' + t] = true; this.syncProgress();
      this.emit('gift', { node, tile: t }); this.emit('story-gift', { tile: t, node });
    }
    continueBrief() { if (this.phase === 'brief') this.phase = 'play'; }
    continueGift() { if (this.phase === 'gift') this.phase = 'play'; } // Edit 84: after the gift screen
    step(cmd) {
      if (this.phase === 'brief' || this.phase === 'gift') return;
      super.step(cmd);
      if (this.phase === 'play' && this.pendingBrief && !this.rescue) { this.pendingBrief = false; this.phase = 'brief'; } // after a ferry lands
    }
    // ----- Edit 83: the ferry. After a clear, a drone carries the new chassis from the cleared tile into the next one
    leaveShop() {
      const st = this.report && this.report.story;
      super.leaveShop();
      if (this.storyMode && st && st.cleared && st.next && !st.districtDone && this.phase === 'play') this.startFerry(st.tile, st.next);
    }
    startFerry(from, to) {
      const b = this.body, P = this.P, W = P['world.width'], H = P['world.height'], [fc, fr] = cellOf(from), [tc, tr] = cellOf(to);
      const side = tc > fc ? 'E' : tc < fc ? 'W' : tr > fr ? 'S' : 'N', [sx, sy] = SIDES[side];
      const hx = sx ? (sx > 0 ? W + 40 : -40) : b.x, hy = sy ? (sy > 0 ? H + 40 : -40) : b.y; // the drone comes in from the next tile's side
      const gift = this.giftOf(to); // Edit 84: the drone brings the next tile's verb with it
      this.rescue = droneTo(this, hx, hy, { ferry: true, side, cell: [tc, tr], tile: to, gift });
      Object.assign(b, { level: 0, floor: null });
      this.emit('story-ferry', { from, to, side, gift });
    }
    arrivalPoint(side) { // off the road (landPoints: free ground or the hilltop), within story.ferryDepth of the entry edge, nearest the crossing
      const P = this.P, b = this.body, W = P['world.width'], H = P['world.height'], dep = P['story.ferryDepth'], r = P['body.radius'];
      const depth = (q) => (side === 'E' ? q.x : side === 'W' ? W - q.x : side === 'S' ? q.y : H - q.y); // in from the edge it entered by
      const ex = side === 'E' ? 0 : side === 'W' ? W : b.x, ey = side === 'S' ? 0 : side === 'N' ? H : b.y;
      const pts = this.landPoints().filter((q) => depth(q) >= r + 24); // clear of the edge by a body and more
      const near = pts.filter((q) => depth(q) <= dep), pool = near.length ? near : pts;
      let best = null; for (const q of pool) { const d = Math.hypot(q.x - ex, q.y - ey); if (!best || d < best.d) best = Object.assign({ d }, q); }
      return best || Object.assign({ d: 0 }, this.level.spawns[0]);
    }
    stepRescue(dt) {
      const rs = this.rescue;
      if (!rs || !(rs.ferry || rs.gift || rs.given !== undefined)) return super.stepRescue(dt);
      if (stepDelivery(this, dt) || !this.rescue) return;
      const b = this.body, P = this.P, W = P['world.width'], H = P['world.height'], d = rs.drone;
      const fly = (x, y) => { const dx = x - d.x, dy = y - d.y, l = Math.hypot(dx, dy), st = rs.v * dt; if (l <= st) { d.x = x; d.y = y; return true; } d.x += dx / l * st; d.y += dy / l * st; return false; };
      const next = (ph) => { rs.phase = ph; rs.k = 0; d.state = ph; };
      if (rs.phase === 'lift') { const f = Math.min(1, rs.k / rs.lift); rs.up = 14 * f; d.alt = 1 - 0.6 * Math.sin(Math.PI * f); if (f >= 1) { next('carry'); d.alt = 1; } }
      else if (rs.phase === 'carry') { // to the edge and over it
        const [sx, sy] = SIDES[rs.side], tx = sx ? (sx > 0 ? W + 2 : -2) : Math.max(40, Math.min(W - 40, b.x)), ty = sy ? (sy > 0 ? H + 2 : -2) : Math.max(40, Math.min(H - 40, b.y));
        fly(tx, ty); b.x = d.x; b.y = d.y; b.px = b.x; b.py = b.y;
        if ((sx > 0 && d.x > W) || (sx < 0 && d.x < 0) || (sy > 0 && d.y > H) || (sy < 0 && d.y < 0)) {
          d.x -= sx * W; d.y -= sy * H; d.hx -= sx * W; d.hy -= sy * H;
          this.flip(rs.side, rs.cell, null); // the screen scrolls; the next tile's fences close behind (arrive)
          rs.to = this.arrivalPoint(rs.side); next('in');
        }
      } else if (rs.phase === 'in') { const arrived = fly(rs.to.x, rs.to.y); b.x = d.x; b.y = d.y; b.px = b.x; b.py = b.y; if (arrived) next('drop'); }
      else if (rs.phase === 'drop') {
        const f = Math.min(1, rs.k / rs.lift); rs.up = 14 * (1 - f);
        if (f >= 1) {
          Object.assign(b, { x: rs.to.x, y: rs.to.y, px: rs.to.x, py: rs.to.y, level: rs.to.level || 0, floor: rs.to.floor != null ? rs.to.floor : null, mode: 'idle', vx: 0, vy: 0 });
          const [sx, sy] = SIDES[rs.side]; d.hx = sx ? (sx > 0 ? W + 40 : -40) : d.x; d.hy = sy ? (sy > 0 ? H + 40 : -40) : d.y; d.state = 'outbound'; (this.leaving = this.leaving || []).push(d); // on, the way it was going
          this.rescue = null;
          this.emit('story-ferried', { tile: this.screenName(), x: +b.x.toFixed(1), y: +b.y.toFixed(1), seconds: +rs.t.toFixed(2) });
        }
      }
    }
    // Edit 83: the open tiles are the cleared ones and the tile in test. An edge between two open tiles is open; every other edge
    // of an open tile is fenced. Cleared tiles stay reachable from the tile in test (P7–7.1 closed it behind the dummy)
    canCross(to) {
      if (!this.storyMode) return true;
      const pr = this.story, dn = doneIn(pr, this.levelId), act = activeTile(pr, this.levelId), open = (t) => dn.includes(t) || t === act;
      return open(this.screenName()) && open(nameOf(to[0], to[1]));
    }
    fenceSides() { // the current screen's sides that a fence holds
      if (!this.storyMode) return [];
      const [c, r] = this.district.cur, out = [];
      for (const sd of ['N', 'E', 'S', 'W']) { const to = [c + SIDES[sd][0], r + SIDES[sd][1]]; if (this.W6.at(to[0], to[1]) && !this.canCross(to)) out.push(sd); }
      return out;
    }
    flip(sd, to, fl) {
      super.flip(sd, to, fl);
      if (!this.storyMode) return;
      const t = this.screenName();
      if (!this.entered && t === activeTile(this.story, this.levelId)) { this.arrive(t); this.pendingBrief = true; }
    }
    moveBody(h) { super.moveBody(h); if (this.storyMode) this.fenceClamp(); }
    fenceClamp() { // a fence holds at the screen's edge as drawn; it cannot be jumped, dashed, pushed or thrown through
      const b = this.body;
      if (!b || !b.alive || b.mode === 'rescue' || b.stair) return;
      const sides = this.fenceSides(); if (!sides.length) { this.fenceHit = null; return; }
      const P = this.P, W = P['world.width'], H = P['world.height'], r = P['body.radius'], lw = this.edgeLift();
      const stop = (ax) => {
        b['v' + ax] = 0; if (b.mode === 'knock') b['knockV' + ax] = 0;
        if (b.jump) b.jump['v' + ax] = 0; if (b.drop) b.drop['v' + ax] = 0;
        if (b.mode === 'lunge' && b.lunge) b.lunge.blocked = true;
      };
      let hit = null; const e = 0.5; // touching counts: the notice fires once a contact, not every substep
      for (const sd of sides) {
        if (sd === 'E' && b.x >= W - r - e) { if (b.x > W - r) { b.x = W - r; stop('x'); } hit = sd; }
        else if (sd === 'W' && b.x <= r + e) { if (b.x < r) { b.x = r; stop('x'); } hit = sd; }
        else if (sd === 'N' && b.y <= lw + r + e) { if (b.y < lw + r) { b.y = lw + r; stop('y'); } hit = sd; }
        else if (sd === 'S' && b.y >= H + lw - r - e) { if (b.y > H + lw - r) { b.y = H + lw - r; stop('y'); } hit = sd; }
      }
      if (hit && hit !== this.fenceHit) {
        const [c, rr] = this.district.cur, to = nameOf(c + SIDES[hit][0], rr + SIDES[hit][1]);
        this.emit('story-fence', { side: hit, to, tile: this.screenName(), entered: this.entered, cleared: doneIn(this.story, this.levelId).includes(this.screenName()) });
      }
      this.fenceHit = hit;
    }
    spawnBody() { super.spawnBody(); if (this.body) this.body.born = this.t; }
    // Edit 91: in the tile in test, a hit that would write the chassis off but misses the brief leaves story.missFloor
    hitFloor(h) {
      if (!this.storyMode || !this.entered || !this.story) return 0;
      const t = this.screenName(); if (t !== activeTile(this.story, this.levelId)) return 0;
      const tile = tileOf(this.levelId, t);
      return !tile || meets(tile.task, h, h.level, this.P) ? 0 : this.P['story.missFloor'] || 0;
    }
    writeOff() {
      const b = this.body, hit = b.hits[b.hits.length - 1] || null, level = b.level || 0;
      super.writeOff();
      if (!this.storyMode) return;
      const pr = this.story, P = this.P, t = this.screenName(), act = activeTile(pr, this.levelId), tile = tileOf(this.levelId, t);
      const res = { tile: t, active: act, counted: false, why: null, n: pr.tileWO, need: needOf(this.levelId, act || t, P), kind: hit ? hit.kind : null, cls: hit ? hit.cls : null, combo: hit ? hit.combo : 0, level };
      if (t !== act || !this.entered) res.why = doneIn(pr, this.levelId).includes(t) ? 'cleared' : 'elsewhere';
      else if (!meets(tile.task, hit, level, P)) res.why = 'task';
      else { pr.tileWO++; res.counted = true; res.n = pr.tileWO; }
      this.storyLast = res;
      this.emit(res.counted ? 'story-count' : 'story-miss', res);
    }
    checkTerminal() {
      if (!this.storyMode) return super.checkTerminal();
      this.slot = this.W6.admitted;
      const r = this.run, P = this.P, b = this.body;
      if (r.ending || b.alive || b.reported) return; // the story has no Failed test: its shift runs story.shiftCars cars
      b.reported = true;
      const pr = this.story, id = this.levelId, res = this.storyLast || { counted: false };
      let cleared = false, districtDone = false, storyDone = false, next = null;
      if (res.counted && pr.tileWO >= res.need) {
        cleared = true;
        pr.done[id] = doneIn(pr, id).concat([res.tile]); pr.tileWO = 0;
        pr.tilePoints[id + ':' + res.tile] = Math.round(r.points - (this.tilePts0 || 0));
        this.entered = false;
        next = activeTile(pr, id);
        districtDone = !next; storyDone = districtDone && !nextDistrict(id);
        if (districtDone && !storyDone) pr.district = nextDistrict(id);
        this.emit('story-clear', { tile: res.tile, next, district: id, districtDone, storyDone, points: pr.tilePoints[id + ':' + res.tile] });
      }
      this.syncProgress();
      this.report = { chassis: b.chassis, hits: b.hits.slice(), points: Math.round(r.points - b.points0), credits: r.credits,
        roadCleared: districtDone && !storyDone, nextRoad: districtDone ? pr.district : null,
        story: Object.assign({}, res, { cleared, next, districtDone, storyDone, parts: partsOwned(r.owned), nextGift: nextGift(pr) }) }; // Edit 91: parts, not levels
      if (storyDone) { pr.complete = true; this.syncProgress(); return this.end('Certified'); }
      this.phase = 'writeoff'; this.phaseT = P['feedback.writeOffSeconds']; this.pendingPhase = 'report';
    }
    // ----- Edit 91: Story has no shop. Every part arrives by drone; the report goes straight to the next chassis
    canBuy(n) { return this.storyMode ? { ok: false, why: VERB_AT[n] ? 'gift at ' + VERB_AT[n] : 'not issued' } : super.canBuy(n); }
    buy(n) { if (!this.storyMode) return super.buy(n); const chk = this.canBuy(n); this.emit('purchase-denied', { node: n, why: chk.why }); return chk; }
    continueReport() {
      if (this.storyMode && this.phase === 'report' && !(this.report && this.report.roadCleared)) { this.phase = 'shop'; this.leaveShop(); this.emit('shop-skip', {}); return; }
      super.continueReport();
    }
    syncProgress() {
      const pr = this.story, r = this.run;
      pr.owned = Object.assign({}, r.owned); pr.credits = r.credits; pr.points = r.points; pr.chassis = r.chassis;
      pr.writeOffs = this.totalWriteOffs(); pr.t = +(this.tOffset + this.t).toFixed(2); pr.milestones = Object.assign({}, this.milestones);
    }
    task() { const tile = tileOf(this.levelId, activeTile(this.story, this.levelId) || ''); return tile ? tile.task : null; }
    trace() { const tr = super.trace(); tr.story = JSON.parse(JSON.stringify(this.story)); return tr; }
  }

  // ---------- Edit 84: Arcade. One district a run (Sim6 single); P7SIM's ricochet. Edit 91: every part for credits, no drone
  // gifts; the chassis ships with Battery 1 (the dash)
  class ArcadeSim extends W6.Sim6 {
    constructor(id, overrides, carry, opts) {
      const cy = Object.assign({}, carry || {}); cy.owned = Object.assign({ battery1: true }, cy.owned);
      super(id, Object.assign({}, P7SIM, overrides || {}), cy, Object.assign({ single: true }, opts || {}));
    }
  }

  const api = { P7SIM, VERBS, giftsCleared, nextGift, partsOwned, VERB_AT, ArcadeSim, trafficOf, storyDensity, hasRing, DATA, DIST, TOTAL, newProgress, districtOf, doneIn, activeTile, clearedCount, tileNumber, nextDistrict, tileState, tileOf, needOf, taskText, meets, nameOf, cellOf, StorySim };
  if (NODE) module.exports = api; else root.STORY = api;
})(typeof window !== 'undefined' ? window : globalThis);

```

# Code the candidates retrieve
### prototypes/p6/sim.js · DISTRICT_LIST (lines 1010–1010) · for EDIT93#open:0
```js
  const DISTRICT_LIST = ['riverside', 'market', 'interchange', 'cbd', 'campus'];
```

### prototypes/p6/lab.js · run (lines 339–349) · for EDIT93#open:0
```js
  function run(X, piece, q, opts) {
    const s = makeSim(X, piece, q, opts), n = Math.round(opts.seconds * s.P['simulation.tickRate']);
    for (let i = 0; i < n; i++) tick(s);
    const geo = s.lab.geo, lanesR = geo.lanes.map((p) => minRadius(p).r), st = s.lab.stats;
    return { piece, q, driver: opts.overrides && opts.overrides['traffic.followRoad'] === 0 ? 'P3' : 'P4', hold: !(opts.overrides && opts.overrides['traffic.gridlockSeconds'] === 0), fleet: opts.fleet || 'p3', busL: s.P['vehicles.bus.length'],
      overhang: Object.fromEntries(Object.entries(st.over).map(([k, v]) => [k, +v.toFixed(1)])), overhangS: +st.overT.toFixed(1),
      vanShare: opts.vanShare, interval: opts.interval, seconds: opts.seconds,
      centreR: +minRadius(geo.center).r.toFixed(1), laneR: +Math.min(...lanesR).toFixed(1), cornerV: +Math.sqrt(s.P['traffic.cornerAccel'] * Math.min(...lanesR)).toFixed(0),
      exitedPerMin: +(st.exited / opts.seconds * 60).toFixed(1), maxStop: +st.maxStop.toFixed(1), jamAt: st.jamAt, jamCars: st.jamCars, overlapS: +st.overlapT.toFixed(1),
      heldS: +st.held.toFixed(1), peak: st.peak, routes: st.routes, rankStop: Object.fromEntries(Object.entries(st.rankStop).map(([k, v]) => [k, +v.toFixed(1)])) };
  }
```

### prototypes/p6/game.js · dropK (lines 1391–1396) · for EDIT93#open:0
```js
  function dropK() { // replacement-chassis drop: 1 at delivery start, 0 on the floor
    const rd = CJ && CJ.states && CJ.states.replacementDrop;
    if (!rd) return 0;
    const dur = jv(rd.seconds) || 0.5, age = app.realT - fx.dropT0;
    return age >= 0 && age < dur ? 1 - age / dur : 0;
  }
```

### prototypes/p6/sim.js · easeD (lines 313–313) · for EDIT93#open:1
```js
  const easeD = (f) => Math.PI / 2 * Math.sin(Math.PI * f);
```

### prototypes/p6/world6.js · DISTRICTS (lines 649–667) · for EDIT93#open:1
```js
  const DISTRICTS = [
    { id: 'parkland', name: 'Parkland', quota: P['world.district.parkland.quota'], storeys: [2, 5], start: ['B2', 'center'], // P6.1: every district starts in its centre tile
      mood: 'Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath.',
      roads: [{ id: 'boulevard', pts: [[40, -200], [2360, 2120]] }, { id: 'loop', pts: fil([[527, 287], [400, 414], [400, 1736], [1636, 1736], [1806, 1566], [2206, 1166], [1760, 720], [1760, -200]], [0, RB, RB, 96, RB, RB, RB, 0]) }], // Edit 56: joins the boulevard at 90° in A1; meets it at a roundabout in C3
      junctions: [{ tile: 'A1', at: [527, 287], major: 'boulevard' }],
      roundabouts: [{ tile: 'C3', at: [206, 286], arms: ['NW', 'NE', 'SE', 'SW'], bends: { SW: { dir: [-1, 0], at: 240.3, Rb: 96 } } }], // Edit 56: the four-way takes a street roundabout; the street's SW arm turns west outside it
      ring: { tile: 'B2', z: 1, arms: ['W', 'N', 'E', 'S'] },
      decks: [{ hz: true, at: 996, z: 1 }, { hz: false, at: 1200, z: 1 }], park: true, // Edit 55.2: row 2 at 996 so the lifted B2 ring draws at the screen's centre
      deckLinks: { B1: [{ y: 304, h: 32, side: -1 }, { y: 304, h: 32, side: 1 }] }, // Edit 55.2: the Z1 walkway joins the B1 highway at both parapets (P6: at the walkway's footprint; the deck lifts as every floor)
      tiles: {
        A1: ['Start, top edge. The 45° boulevard; the avenue curves to join it at 90° and gives way. The Z1 walkway from B1 lands by escalator', 'Reservoir terraces: three stepped pools', 'both'],
        B1: ['The Z1 highway runs north–south; escalators west (north end) and east (south end). A Z1 walkway crosses the garden and joins the highway at both parapets. The boulevard cuts the corner', 'Cascade: water steps beside the highway', 'both'],
        C1: ['The avenue under a Z1 footbridge that runs west to the B1 highway; escalator at its east end; drop onto cars', 'Lantern pavilion', 'both'],
        A2: ['The avenue passes under the Z1 highway at 90°; escalators north (west end) and south (east end)', 'Canal along the highway', 'both'],
        B2: ['Four-arm Z1 roundabout (W, N, E, S). Give way to the ring; the inner lane is the orbit lane. The boulevard passes beneath, through the hole', 'Reflecting pools under the ring', 'both'],
        C2: ['The avenue comes up from the C3 roundabout at 45°, turns 90° and passes under the Z1 highway at 45°', 'Amphitheatre terraces', 'both'],
        A3: ['A wide R160 bend (buses may use it)', 'Belvedere: four tiers and a stair up to a lawn, the monolith orchard on top', 'both'],
        B3: ['The garden street passes under the Z1 highway at 90°; escalators', 'Sculpture court: a large obelisk, two rings, a row of lit bollards', 'both'],
        C3: ['Street roundabout where the street meets the boulevard: four arms at 90°, the street turning west outside it', 'Sculpture court at grade: a large arch, two medium pieces, a row of lit bollards', 'scenery'] } },
```

### prototypes/p6/world6.js · falls (lines 976–980) · for EDIT93#open:1
```js
  function falls(B, x0, x1, yTop, yFoot) { // Parkland B1: water spilling over a pool's front lip, down its face
    const a = Math.round(x0 + (x1 - x0) * 0.3), b = Math.round(x0 + (x1 - x0) * 0.7);
    for (let y = Math.round(yTop); y <= Math.round(yFoot); y++) for (let x = a; x <= b; x++) B.put(x, y, (x + y * 2) % 5 === 0 ? K.white : x % 2 ? N.water2 : mixK(N.cyan, K.white, 0.3));
    for (let x = a - 1; x <= b + 1; x++) B.put(x, Math.round(yFoot) + 1, (x % 2) ? K.white : mixK(N.cyan, K.white, 0.5)); // foam at the foot
  }
```

### prototypes/p6/world6.js · stand (lines 1934–1934) · for EDIT93#open:2
```js
    const stand = (sc, x, y) => { const g = sc.game; return x >= R0 && y >= R0 && x <= W - R0 && y <= H - R0 && !g.statics.some((q) => inR(q, x, y, R0 - 2)) && !g.stairs.some((q) => inR(q, x, y, R0 - 2)) && g.polys0.every((p) => !PIX.inPoly(p, x, y)) && g.water.every((p) => !PIX.inPoly(p, x, y)) && !(g.checkpoints || []).some((cp) => !cp.deck && !cp.z && inR(cpZone(cp), x, y, R0 - 1)); };
```

### prototypes/jump/jump.js · speeds (lines 47–49) · for EDIT93#open:2
```js
  function speeds(P) { // the four take-offs: standing, walking, running, a dash jump at the cap
    return { stand: 0, walk: P['movement.walkSpeed'], run: P['movement.runSpeed'], dash: P['upgrades.jumpMaxSpeed'] };
  }
```

### prototypes/p6/world6.js · groundFree (lines 1586–1586) · for EDIT93#open:2
```js
  function groundFree(sc, x, y, m) { const g = sc.game; m = m == null ? R0 - 2 : m; return !g.statics.some((q) => inR(q, x, y, m)) && g.polys0.every((q) => !PIX.inPoly(q, x, y)) && !g.stairs.some((q) => inR(q, x, y, m)); } // m: the margin (where the dummy can stand: R0 − 2; where it can arrive across an edge: 0, the push-out slides it along)
```

### prototypes/p6/game.js · drawBriefFoot (lines 2670–2677) · for P7#known-gaps:0
```js
  function drawBriefFoot(s, X, y, W) { // under the district map: the brief and the tile's count
    const pr = s.story, t = STORY.activeTile(pr, s.levelId), tile = t ? STORY.districtOf(s.levelId).tiles[t] : null, need = t ? STORY.needOf(s.levelId, t, s.P) : 0;
    if (!tile) return;
    const tx = STORY.taskText(tile.task, s.P), here = s.screenName() === t;
    txt('BRIEF · ' + t, 30, y + 18, '700 15px ' + F_UI, here ? FT.accent : FT.dim);
    for (let i = 0; i < need; i++) { ctx.beginPath(); ctx.arc(X + W - 20 - (need - 1 - i) * 16, y + 13, 5, 0, TAU); ctx.fillStyle = i < pr.tileWO ? C.dummy : FT.track; ctx.fill(); ctx.strokeStyle = FT.itemEdge; ctx.lineWidth = 1; ctx.stroke(); }
    wrapText(tx.label, 30, y + 44, W - 28, 20, '700 17px ' + F_UI, FT.text, 1);
  }
```

### prototypes/p6/game.js · drawBrief (lines 2558–2576) · for P7#known-gaps:0
```js
  function drawBrief(s) { // the tile card: where you are, how it came to be, what Farsight wants
    veil();
    const pr = s.story, t = s.screenName(), d = STORY.districtOf(s.levelId), tile = d.tiles[t], P = s.P, tx = STORY.taskText(tile.task, P), need = STORY.needOf(d.id, t, P);
    const x = FX + 36, y = FY + 26, w = FW - 72, h = FH - 52;
    panel(x, y, w, h); hitbox(x, y, w, h, 'brief', () => menuQ.push('ok')); // Edit 89: a tap begins
    fitText((d.act ? d.act + ' · ' : '') + d.name.toUpperCase() + ' · TILE ' + t + ' · ' + STORY.tileNumber(d.id, t) + ' OF ' + STORY.TOTAL, x + 30, y + 44, w - 60, TY.sec, 13, FT.accent); // Edit 92: the act
    txt(tile.title, x + 30, y + 96, '900 40px ' + F_BRAND, FT.text);
    let yy = y + 138;
    if (d.order[0] === t && !STORY.doneIn(pr, d.id).length) { yy += 28 * wrapText(d.intro, x + 32, yy, w - 64, 28, '700 19px ' + F_UI, FT.dim, 2) + 8; }
    yy += 30 * wrapText(tile.tale, x + 32, yy, w - 64, 30, fTxt, FT.text, 5) + 12;
    ctx.strokeStyle = FT.itemEdge; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 30, yy); ctx.lineTo(x + w - 30, yy); ctx.stroke();
    yy += 38;
    txt('FARSIGHT BRIEF', x + 30, yy, fLab, FT.accent); txt(tx.label, x + w - 30, yy, fLab, FT.text, 'right');
    yy += 32; yy += 28 * wrapText(tx.brief + ' ' + (need === 1 ? 'One counted write-off clears the tile.' : need + ' counted write-offs clear the tile' + (pr.tileWO ? ' (' + pr.tileWO + ' so far).' : '.')), x + 32, yy, w - 64, 28, '400 19px ' + F_UI, FT.text, 3);
    const gt = tile.gift && pr.gifts[d.id + ':' + t] ? giftText(tile.gift) : null;
    if (gt) { yy += 12; rr(x + 28, yy, w - 56, 48, 12); ctx.fillStyle = FT.credit; ctx.fill(); ctx.strokeStyle = C.dummy; ctx.lineWidth = 1.5; ctx.stroke(); wrapText('GIFT · ' + gt, x + 46, yy + 31, w - 92, 24, '700 18px ' + F_UI, FT.text, 1); }
    txt(TOUCH.on ? 'TAP TO BEGIN THE TEST' : app.device === 'pad' ? 'A  BEGIN THE TEST' : 'SPACE  BEGIN THE TEST', x + w - 30, y + h - 24, fLab, FT.accent, 'right');
    txt('Fenced until cleared. Cleared tiles stay open.', x + 30, y + h - 24, '400 17px ' + F_UI, FT.dim);
  }
```

### prototypes/p6/game.js · nm (lines 2991–2991) · for P7#known-gaps:1
```js
    const nm = (n, w) => (STORY && !s.has(n) ? '???' : w); // Edit 90: a verb not yet fitted is not named
```

### prototypes/p6/sim.js · Sim.account (lines 3224–3276) · for P7#known-gaps:2
```js
    account(contacts) {
      const P = this.P;
      contacts.sort((a, b) => a.k - b.k || (a.car.id < b.car.id ? -1 : a.car.id > b.car.id ? 1 : 0));
      let positive = false;
      for (const ct of contacts) {
        const b = this.body, c = ct.car;
        if (!b.alive) { this.emit('contact-ignored', { car: c.id }); continue; }
        if (c.spent) { this.emit('touch-spent', { car: c.id }); this.effects.push({ type: 'touch', x: ct.px, y: ct.py, t: this.t }); continue; }
        const { raw, assessed } = P['proto.damageModel'] ? ct.ph : assess(P, ct.closing, ct.zone, c.cls);
        if (raw <= 1e-9) { this.emit('touch', { car: c.id, closing: 0 }); continue; }
        c.spent = true;
        const plate = b.level === 0 && this.surfaceAt(b.x, b.y) === 'plate' ? P['damage.plateMultiplier'] : 1; // a calibrated plate scores more (7.3)
        const hw = c.deck ? P['damage.deckMultiplier'] : 1; // P5 (Edit 50): a highway hit scores more
        // Edit 75: a hit within scoring.comboWindow of the last chains a combo; each link adds scoring.comboStep, to scoring.comboMax.
        // Edit 79: each new kind of move in the chain adds scoring.comboVariety; the clock stops in the air (comboClock)
        const kind = ct.drop ? 'drop' : ct.kind || (ct.jump ? 'jump' : ct.lunging ? 'dash' : 'struck');
        const cl = this.comboLink(kind, assessed * plate * hw), combo = cl.n, mult = cl.mult;
        let lost = Math.min(b.health, assessed); // Edit 91: a hit that would write the chassis off can be held at a floor (Story: a miss of the brief)
        const floor = lost >= b.health - 1e-9 && this.hitFloor ? this.hitFloor({ kind, cause: ct.cause, cls: c.cls, combo, level: b.level }) : 0;
        const held = floor > 0 && b.health - lost < floor;
        if (held) lost = Math.max(0, b.health - floor);
        b.health = Math.max(0, b.health - lost);
        this.run.points += assessed * plate * hw * mult;
        if (combo > 1) { this.emit('combo', { n: combo, mult, kinds: cl.kinds.slice(), bonus: Math.round(assessed * plate * hw * (mult - 1)), car: c.id }); this.mile('firstCombo', { n: combo }); }
        const bait = ct.carState === 'committed' || ct.carState === 'expiring' || ct.carState === 'interrupted';
        let learned = null;
        if (P['proto.learningEnabled'] && lost > 0) {
          const m = this.models[c.cls], cap = Math.round(P['learning.playerHitCap'] / P['learning.playerHitStep']);
          if (m.applied < cap) { m.applied++; learned = m.applied; }
        }
        let learnedStandoff = null;
        if (P['proto.learn.standoffEnabled'] && lost > 0 && ct.stopped) {
          const m = this.models[c.cls], before = this.modelStandoff(m);
          if (before < P['proto.learn.standoffMax']) { m.standoffApplied++; learnedStandoff = this.modelStandoff(m); this.emit('learn-standoff', { model: m.id, from: before, to: learnedStandoff }); }
        }
        const part = this.partOf(ct.px, ct.py, assessed, ct.drop); // a landing takes the legs (Edit 42)
        b.parts[part] += lost;
        const ev = { car: c.id, model: c.model, cls: c.cls, zone: ct.zone, part, closing: +ct.closing.toFixed(3),
          angle: +ct.ph.angle.toFixed(1), dv: +ct.ph.dvd.toFixed(2), strike: +ct.ph.un.toFixed(2),
          raw: +raw.toFixed(3), assessed: +assessed.toFixed(3), lost: +lost.toFixed(3), health: +b.health.toFixed(3),
          carState: ct.carState, cause: ct.cause, bait, lunging: ct.lunging, learned, stopped: ct.stopped, learnedStandoff, plate: plate > 1, highway: hw > 1, drop: !!ct.drop, deck: !!c.deck, dropZ: ct.drop ? ct.dropZ : 0, dropFrom: ct.drop ? ct.dropFrom : null,
          combo, mult, kind, jump: !!ct.jump, ricochet: !!ct.ricochet, held };
        this.emit('impact', ev); b.hits.push(ev);
        if (held) this.emit('held', { health: b.health, kind, car: c.id });
        this.effects.push({ type: 'burst', x: ct.px, y: ct.py, v: assessed * plate * hw * mult, mult: hw, combo, cmult: mult, t: this.t, zone: ct.zone, angle: ct.ph.angle, layer: lay(c) });
        this.mile('firstHit');
        if (bait) this.mile('firstBaitHit');
        if (ct.cause === 'cone' && bait) this.mile('firstConeAssistHit');
        positive = true;
        if (b.health <= 0) this.writeOff();
      }
      return positive;
    }
```

### prototypes/p6/game.js · toSaves (lines 186–189) · for P7#known-gaps:3
```js
  function toSaves() {
    app.mode = 'story'; app.screen = 'saves'; app.sim = null; app.paused = false; app.saveMode = null; app.saveConfirm = null; app.slotAct = 0; app.nameEntry = null; clearEdges();
    const S = allSlots(); let best = 0, t = -1; S.forEach((v, i) => { if (v && v.saved > t) { t = v.saved; best = i + 1; } }); app.saveSel = app.slot && S[app.slot - 1] ? app.slot : best;
  }
```

### prototypes/p6/game.js · panel (lines 1117–1131) · for P7#known-gaps:3
```js
  function panel(x, y, w, h, opts) { // FARSIGHT glass (frame layer only)
    const R = 12;
    ctx.save();
    ctx.shadowColor = 'rgba(16,40,56,0.16)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 5;
    rr(x, y, w, h, R);
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, FT.panelTop); g.addColorStop(1, (opts && opts.tint && !FT.neon && opts.tint) || FT.panelBot);
    ctx.fillStyle = g; ctx.fill(); ctx.restore();
    if (FT.neon) { ctx.save(); ctx.shadowColor = FT.edge; ctx.shadowBlur = 10; }
    rr(x + 0.75, y + 0.75, w - 1.5, h - 1.5, R); ctx.strokeStyle = FT.edge; ctx.lineWidth = 1.5; ctx.stroke();
    if (FT.neon) ctx.restore();
    ctx.save(); rr(x + 2, y + 2, w - 4, Math.min(22, h / 3), R - 2); ctx.clip();
    const hg = ctx.createLinearGradient(0, y, 0, y + 22); hg.addColorStop(0, FT.gloss); hg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hg; ctx.fillRect(x, y, w, 24); ctx.restore();
  }
```

### prototypes/p6/game.js · moveOldStory (lines 77–79) · for P7#known-gaps:3
```js
  function moveOldStory() { // the one story of 7.1–7.6, into slot 1, once
    moved = true; try { if (!localStorage.getItem(MOVED_KEY)) { const old = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (okProgress(old) && !readSlot(1)) writeSlot(1, { v: 1, name: defaultName(1), saved: Date.now(), progress: old, moved: true }); localStorage.setItem(MOVED_KEY, '1'); } } catch (e) { /* storage off */ }
  }
```

### prototypes/p6/game.js · stamp (lines 81–81) · for P7#known-gaps:4
```js
  function stamp(ms) { const d = new Date(ms), p2 = (x) => String(x).padStart(2, '0'); return p2(d.getDate()) + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear() + ' · ' + p2(d.getHours()) + ':' + p2(d.getMinutes()); } // the browser's local time
```

### prototypes/p6/game.js · nameDone (lines 208–213) · for P7#known-gaps:4
```js
  function nameDone() {
    const ne = app.nameEntry; if (!ne) return; const name = cleanName(ne.text).trim() || defaultName(ne.slot); app.nameEntry = null; nameInput.blur();
    if (ne.kind === 'rename') { const cur = readSlot(ne.slot); if (cur) { cur.name = name; writeSlot(ne.slot, cur); } toast('Renamed: ' + name); return; } // a rename keeps the time stamp
    app.slot = ne.slot; app.story = STORY.newProgress(); app.mode = 'story';
    writeSlot(ne.slot, { v: 1, name, saved: Date.now(), progress: app.story }); toStoryMap();
  }
```

### prototypes/p6/pixel.js · stamp (lines 179–182) · for P7#known-gaps:4
```js
  function stamp(B, pts, c, oc) {
    if (oc != null) for (const [x, y] of pts) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) B.put(x + i, y + j, oc);
    for (const [x, y] of pts) B.put(x, y, c);
  }
```

### prototypes/p6/game.js · drawField6 (lines 1897–1903) · for P7#known-gaps:5
```js
  function drawField6(s, still) {
    const scroll = !still && s.phase === 'scroll' && s.district && s.district.lastFlip;
    FB = MAIN;
    if (still) W6.compose(s.sc, MAIN, DL, {}); else drawLive6(s);
    if (scroll && prevOk) composeScroll(s); else if (!still) { prevFB.set(FB.d); prevOk = true; }
    blitField(s, still);
  }
```

### prototypes/p6/game.js · drawField (lines 1889–1896) · for P7#known-gaps:5
```js
  function drawField(s, still) {
    if (s.p6 || s.preview6) return drawField6(s, still);
    const la = levelArt(s), scroll = !still && s.phase === 'scroll' && s.district && s.district.lastFlip;
    FB.copyFrom(la.ground);
    if (still || scroll) { drawSprites(s, la, true); if (scroll && s.body.alive) drawBodySprite(s); } else drawLive(s, la);
    if (scroll && prevOk) composeScroll(s); else if (!still) { prevFB.set(FB.d); prevOk = true; }
    blitField(s, still);
  }
```

### prototypes/p6/game.js · slotLines (lines 2424–2428) · for P7#known-gaps:5
```js
  function slotLines(v) {
    const pr = v.progress, cl = STORY.clearedCount(pr), t = pr.complete ? null : STORY.activeTile(pr, pr.district);
    return [pr.complete ? 'CERTIFIED · ALL ' + STORY.TOTAL + ' TILES' : INFO(pr.district).name.toUpperCase() + ' · ' + t + ' · TILE ' + STORY.tileNumber(pr.district, t) + ' OF ' + STORY.TOTAL + (pr.tileWO ? ' · ' + pr.tileWO + ' OF ' + STORY.needOf(pr.district, t) + ' WRITE-OFFS' : ''),
      cl + ' / ' + STORY.TOTAL + ' TILES · ' + num(pr.points || 0) + ' POINTS · ' + STORY.partsOwned(pr.owned) + ' / ' + STORY.VERBS.length + ' PARTS · CHASSIS ' + String(pr.chassis || 0).padStart(2, '0')]; // Edit 91: parts, not levels
  }
```

### prototypes/p6/game.js · drawFieldHD (lines 1914–1930) · for P7#known-gaps:6
```js
  function drawFieldHD(s) {
    const P = s.P;
    drawBubblesHD(s); // Edit 83: barks are speech bubbles on the cars again
    const since = s.t - (s.tStart || 0);
    if (since < 4 && s.phase === 'play' && !s.storyMode) { // Edit 81: the story's tile card replaces the banner
      const iv = { road: s.roadIndex + 1, roads: s.list.length, roadName: INFO(s.levelId).name, quota: s.quota, difficulty: s.difficulty, health: P['damage.bodyHealth'] };
      const intro = CI && CI.copy && CI.copy.intro;
      const msg = s.isCity ? 'District ' + iv.road + ' of ' + iv.roads + ': ' + iv.roadName + '. ' + (place('districts.' + s.levelId + '.intro') || INFO(s.levelId).blurb) + ' Write-offs required: ' + iv.quota + '.'
        : (intro ? fillIn(intro[0], iv) : 'Road ' + iv.road + ' of ' + iv.roads + ': ' + iv.roadName + '. Write-offs required: ' + iv.quota + '.') +
        (s.district ? ' ' + s.district.cols * s.district.rows + ' screens: walk off a marked edge to explore.' : '');
      const lines = wrapLines(msg, FW - 88, fLab), h = 22 + lines.length * 30;
      ctx.globalAlpha = Math.min(1, (4 - since) / 0.6);
      rr(FX + 20, FY + 16, FW - 40, h, 12); ctx.fillStyle = FT.banner; ctx.fill(); ctx.strokeStyle = FT.edge; ctx.lineWidth = 1.5; ctx.stroke();
      lines.forEach((l, i) => txt(l, FX + FW / 2, FY + 16 + 38 + i * 30, fLab, FT.text, 'center'));
      ctx.globalAlpha = 1;
    }
  }
```

### prototypes/p6/game.js · DENY_TEXT (lines 573–573) · for P7#known-gaps:7
```js
  const DENY_TEXT = { lunge: 'No lunge — charge empty or recovering', pickup: 'No cone within reach', drop: 'No room to place the cone', throw: 'No room to release the cone',
```

### prototypes/p6/game.js · faceWord (lines 495–503) · for P7#known-gaps:7
```js
  function faceWord(f, s) {
    const inPlay = app.screen === 'game' && s && !app.paused && !app.touchEdit && ['play', 'hitstop', 'writeoff', 'scroll'].includes(s.phase);
    const node = FACE_NODE[f.id], unlocked = f.id === 'a' && STORY ? !(s && s.dashFitted) || s.dashFitted() : !node || !!(s && s.has(node)); // Edit 91: A names DASH once Battery 1 is fitted
    if (!STORY) return { word: unlocked ? f.w : 'LOCKED', live: unlocked };
    if (!inPlay) return { word: { a: 'OK', b: 'BACK' }[f.id] || '', live: f.id === 'a' || f.id === 'b' };
    if (!unlocked) return { word: '', live: false };
    if (f.id === 'x') { const b = s.body, room = s.carriedCones().length < s.coneCapacity(), near = b && room && s.nearestCone ? s.nearestCone() : null; return { word: b && b.held && !near ? 'DROP' : 'GRAB', live: true }; }
    return { word: f.w, live: true };
  }
```

### prototypes/p6/game.js · PART_WORD (lines 2848–2848) · for P7#known-gaps:7
```js
  const PART_WORD = { battery: 'Torso', legs: 'Leg', arms: 'Grip', throw: 'Throw' };
```

### prototypes/p6/world6.js · goLive (lines 1889–1892) · for P7#known-gaps:8
```js
  function goLive(Wd) { // the shift starts: it counts Z0 cars as they appear on the screen in view (P6.1)
    Wd.live = true; Wd.admitted = 0; Wd.events.length = 0;
    for (const s of Wd.sims) for (const c of s.cars) if (!(c.elev || 0) && c.deck !== true) c.shift = true;
  }
```

### prototypes/p6/game.js · liveBark (lines 1934–1943) · for P7#known-gaps:8
```js
  function liveBark(s) {
    const dur = pv('proto.barks.seconds') || 2.4, now = app.realT;
    let best = null;
    for (const [id, bk] of fx.bubbles) {
      const age = now - bk.t0; if (age > dur) continue;
      const live = carsOf(s).find((c) => c.id === id), info = live || fx.cars.get(id); if (!info) continue;
      if (!best || bk.priority > best.bk.priority || (bk.priority === best.bk.priority && bk.t0 > best.bk.t0)) best = { bk, tag: shortId(info.model), spent: !!(live && live.spent), a: Math.min(1, 3 * (dur - age)) };
    }
    return best;
  }
```

### prototypes/p6/circus_valley.js · raised (lines 108–108) · for P7#known-gaps:9
```js
  function raised(road) { const runs = []; let cur = null; for (const p of dense(road.pts, 4)) { const up = road.z - ground(p[0], p[1]) > 0.25; if (up) { if (!cur) runs.push(cur = []); cur.push(p); } else cur = null; } return runs.filter((r) => r.length > 1); }
```

### prototypes/p6/game.js · frame (lines 3252–3273) · for P7#known-gaps:9
```js
  function frame(now) {
    const dt = clamp((now - last) / 1000, 0, 0.1); last = now; app.realT += dt; // rAF can stamp the first frame before load time
    pollPad(dt);
    handleMenus();
    if (app.screen === 'loading' && app.loading && app.loading.frames++ >= 2) { const ld = app.loading; app.loading = null; const rs = (app.roads || []).slice(); startLevelNow(ld.i, ld.carry); if (ld.carry) app.roads = rs; }
    const s = app.sim;
    if (app.screen === 'game' && s && !app.paused && traceEl.hidden) {
      acc += dt;
      while (acc >= 1 / 60) { s.step(s.phase === 'play' ? buildCmd() : {}); acc -= 1 / 60; }
      if (s.phase === 'next' && app.mode === 'story') { saveStory(); startLevel(LEVEL_LIST.indexOf(app.story.district)); } // Edit 81: the next district of the story
      else if (s.phase === 'next') { const rs = (app.roads || []).concat([s.trace()]); startLevel(app.level + 1, s.carryOut()); app.roads = rs; }
      if (app.screen === 'loading') { acc = 0; }
    } else acc = 0;
    processEvents();
    render();
    const pi = pad.info, padTxt = pad.blocked ? 'gamepads blocked on this page: open the downloaded file' : pi && pi.id ? 'pad: ' + pi.id.slice(0, 40) + (pi.mapping === 'standard' ? '' : ' (no standard mapping: hold START or G to set up)') : 'pad: none seen — press any button on it';
    const st = BUILD + ' · ' + SW + ' × ' + SH + ' ×' + kpx.toFixed(2) + ' · ' + (app.tuned ? 'TUNED RUN · UNRANKED' : 'registry values') + ' · ' + padTxt; app.statusLine = st;
    if (statusEl && statusEl.textContent !== st) statusEl.textContent = st;
    const mon = document.getElementById('padmon'), mt = pi && pi.monitor ? pi.monitor : '';
    if (mon && mon.textContent !== mt) mon.textContent = mt;
    requestAnimationFrame(frame);
  }
```

### prototypes/p6/sim.js · TRACKS (lines 210–212) · for P7#known-gaps:10
```js
  const TRACKS = {
    battery: { name: 'Battery', button: 'A', verb: 'DASH', part: 'torso',
      desc: ['Dash recharges faster. Torso damage slows it less.', 'Faster again. Torso damage slows it less.', 'Faster again. Torso damage slows it less.', 'Fastest recharge. Torso damage slows it least.'] },
```

### prototypes/p6/sim.js · Sim.secondsPerCharge (lines 1598–1604) · for P7#known-gaps:10
```js
    secondsPerCharge() { // Edit 77: Battery levels speed the recharge; torso damage slows it
      const P = this.P; if (!P['proto.abilities']) return P['battery.secondsPerCharge'];
      const L = this.tier('battery');
      if (P['proto.batteryModel'] === 1) return (L >= 3 ? P['abilities.battery.level3Seconds'] : P['battery.secondsPerCharge']) / this.partEffect('recharge'); // Edit 91: Battery 3 the faster recharge
      if (P['proto.abilities'] >= 2) return (L ? P['abilities.battery.level' + L + 'Seconds'] : P['battery.secondsPerCharge']) / this.partEffect('recharge'); // Edit 79: a value per level
      return Math.max(0.05, P['battery.secondsPerCharge'] - P['abilities.battery.rechargeCut'] * L) / this.partEffect('recharge'); // Edit 78: linear
    }
```

### prototypes/p6/sim.js · TRACKS9 (lines 223–225) · for P7#known-gaps:10
```js
  const TRACKS9 = {
    battery: { name: 'Battery', button: 'A', verb: 'DASH', part: 'torso',
      desc: ['Dash charges faster. Torso damage slows them less.', 'Faster again. Torso damage slows them less.', 'Fastest charge. Torso damage slows them least.'] },
```

### prototypes/p6/world6.js · manage (lines 1865–1888) · for P7#known-gaps:11
```js
  function manage(Wd, act) {
    const exhausted = Wd.live && Wd.admitted >= Wd.budget, cull = P['traffic.offscreenCullSeconds'], Lb = P['vehicles.bus.length'], cruise = P['vehicles.sedan.cruiseSpeed'];
    for (const sc of Wd.scs) for (const F of sc.flow.values()) {
      let n = 0; for (const s of sc.sims) for (const c of s.cars) { const r = recOf(s, c); if (r && r.cls === F.cls) n++; }
      F.n = n;
      const kd = Wd.densityOf ? Wd.densityOf(sc) : 1, S = F.S / kd, target = F.target * kd; // Edit 85: Story scales a tile's density (1: the district's)
      if (n >= target + 1 || (exhausted && F.cls === 'street0')) continue; // a cap; the shift's streets stop filling once it is spent
      const cands = F.list.filter((g) => sc !== act || g.boundary);
      const hw = S / (cruise * (F.cls.startsWith('street') ? 1 : P['traffic.deckSpeedScale'])); // the target headway at an inlet
      for (let k = 0; k < cands.length; k++) { // an inlet from beyond the district meters at the headway; any other fills only a missing car (1.5 headways)
        const g = cands[(F.rr + k) % cands.length], r = g.recs[(Wd.spawnSeq + k) % g.recs.length], jit = 0.85 + 0.3 * ((Wd.spawnSeq * 0.6180339887) % 1);
        if (Wd.t - (g.lastIn != null ? g.lastIn : -1e9) < hw * (g.boundary ? jit : 1.5)) continue;
        const s0 = g.boundary ? Lb / 2 + 2 : r.ends.in.s + 2, ahead = Math.max(Lb * (1 + P['traffic.entryRoomLengths']) + P['traffic.minimumGap'], S * 0.5);
        if (sc === act && seen(act, sc, X.pathAt(r.path, s0), 40)) continue; // the screen in view: only from beyond the district edge, out of sight
        if (!roomAt(Wd, g, r, s0, ahead, S * 0.5) || queued(g)) continue;
        spawn(Wd, r, s0); g.lastIn = Wd.t; if (++n >= target + 1) break;
      }
      F.rr = (F.rr + 1) % Math.max(1, cands.length);
    }
    for (const s of Wd.sims) { // off-screen: no jam survives out of sight; a finished shift's unseen cars go
      if (!s.cars.length) continue;
      s.cars = s.cars.filter((c) => { if (seen(act, s.sc, c)) return true; if ((c.stopT || 0) > cull) { Wd.culled++; return false; } if (exhausted && c.shift) return false; return true; });
    }
  }
```

### prototypes/p6/game.js · render (lines 3056–3063) · for P7#known-gaps:11
```js
  function render() {
    if (!app.nameEntry && document.activeElement === nameInput) nameInput.blur(); // Edit 88: the hidden name field never keeps the keys
    ctx.setTransform(scale, 0, 0, scale, ox, oy);
    ctx.imageSmoothingEnabled = false;
    { const g = ctx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, FT.bg[0]); g.addColorStop(0.5, FT.bg[1]); g.addColorStop(1, FT.bg[2]); ctx.fillStyle = g; ctx.fillRect(-ox / scale - 1, -oy / scale - 1, cv.width / scale + 2, cv.height / scale + 2); } // Edit 76: the margins
    renderScreen();
    if (TOUCH.on) { ctx.setTransform(scale, 0, 0, scale, 0, 0); drawTouch(); }
  }
```

### prototypes/p6/game.js · partEffects (lines 2290–2302) · for P7#known-gaps:11
```js
  function partEffects(s) { // the abilities the damage has cut, as shown on the chassis panel
    const out = [], pc = (v) => Math.round(v * 100) + '%';
    const sp = s.partEffect('speed'), tu = s.partEffect('turn'), vw = s.partEffect('view'), th = s.partEffect('throw');
    const da = s.partEffect('dash'), rc = ABIL ? s.partEffect('recharge') : 1;
    if (sp < 0.995) out.push(['SPEED', pc(sp)]);
    if (da < 0.995) out.push(['DASH', pc(da)]);
    if (rc < 0.995) out.push(['RECHARGE', pc(rc)]); // Edit 77: torso damage slows the battery
    if (tu < 0.995 && !ABIL) out.push(['TURN', pc(tu)]);
    if (vw < 0.995) out.push(['VIEW', Math.round(s.coneWidth()) + '°']);
    if (s.armsBroken() && (s.has('carry') || s.has('throw'))) out.push(['CONE', 'NO GRIP']);
    else if (th < 0.995 && s.has('throw')) out.push(['THROW', pc(th)]);
    return out;
  }
```

### prototypes/p6/game.js · controlItems (lines 2988–2988) · for P7#known-gaps:12
```js
  const controlItems = () => (TOUCH.on ? ['Adjust layout', 'Reset layout', 'Back'] : ['Back']); // Edit 87
```

### prototypes/p6/game.js · controlRows (lines 2989–3004) · for P7#known-gaps:12
```js
  function controlRows(s) { // the device in hand: keys, a gamepad, or touch; a locked verb names what unlocks it
    const d = deviceOf(), lock = (n, label) => (s.has(n) ? '' : STORY ? 'A Farsight drone brings it' : 'Locked: ' + label + ', by drone'), K3 = { keys: 0, pad: 1, touch: 2 }[d];
    const nm = (n, w) => (STORY && !s.has(n) ? '???' : w); // Edit 90: a verb not yet fitted is not named
    const rows = [
      ['MOVE', ['WASD / arrows', 'Stick / d-pad', 'Stick, left'][K3], ''],
      [STORY && s.dashFitted && !s.dashFitted() ? '???' : 'DASH', ['Space / K', 'A', 'A'][K3], STORY && s.dashFitted && !s.dashFitted() ? 'A Farsight drone brings it' : '', STORY ? 'Out of a dash, the jump is free' : ''], // Edit 91: Battery 1 is the dash
      [nm('jump', 'JUMP'), ['L / Shift', 'B', 'B'][K3], lock('jump', 'Legs 1')],
      [nm('carry', 'GRAB'), ['J / E', 'X', 'X'][K3], lock('carry', 'Hands 1'), s.P['abilities.hands.tapDrop'] ? 'Tap: pick up a cone. Tap with none in reach: put one down' : 'Hold to put a cone down'],
      [nm('push', 'PUSH OFF A CAR'), ['I / Q', 'Y', 'Y'][K3], lock('push', 'Arms 1')],
      ['PAUSE', ['Esc / P', 'Start', '❚❚'][K3], ''],
    ];
    if (d === 'keys') rows.push(['TUNING', 'T', ''], ['GAMEPAD SETUP', 'G', '']);
    if (d === 'pad') rows.push(['GAMEPAD SETUP', 'Hold Start', '']);
    if (d === 'touch') rows.push(['FULL SCREEN', '⤢', '', app.touchCfg ? 'Your layout: Adjust layout to change' : 'Adjust layout: move and size the stick and buttons']);
    return { d, rows };
  }
```

### prototypes/p6/game.js · touchOn (lines 366–374) · for P7#known-gaps:12
```js
  function touchOn() {
    if (TOUCH.on) return;
    TOUCH.on = true; document.body.classList.add('touch');
    const rot = document.createElement('div'); rot.id = 'rotate'; rot.hidden = true;
    rot.innerHTML = '<div><b>Turn your phone sideways</b><br>DUMMIES plays in landscape.<br><small>Tap for full screen, where the phone allows.</small></div>';
    document.body.appendChild(rot); TOUCH.rot = rot; rot.addEventListener('pointerdown', fullscreen);
    for (const t of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) cv.addEventListener(t, touchEvent, { passive: false });
    resize();
  }
```

### prototypes/p6/game.js · pollPad (lines 313–338) · for P7#known-gaps:13
```js
  function pollPad(dt) {
    pad.mx = pad.my = 0; pad.bHeld = false; pad.xHeld = false;
    if (!pad.st) return;
    let list = null;
    try { list = navigator.getGamepads ? navigator.getGamepads() : null; pad.blocked = false; }
    catch (e) { pad.blocked = true; } // a hosting page can forbid the gamepad feature; keys and touch still work
    if (app.padCmd === 'setup') { window.PADS.startSetup(pad.st, PADCFG); toast('Pad setup: press the button for ' + PAD_NAME[PADCFG.actions[0]]); }
    else if (app.padCmd === 'cancel') pad.st.setup = null;
    app.padCmd = null;
    const was = pad.st.setup, o = window.PADS.read(pad.st, list, PADCFG, dt || 1 / 60); pad.info = o;
    if (o.setup && o.setup !== was) toast('Pad setup: press the button for ' + PAD_NAME[o.setup]);
    if (was && !o.setup) toast('Pad buttons saved for this browser');
    if (!o.id || o.setup) { pad.dirs = {}; pad.prevB = false; return; }
    if (o.move) { pad.mx = o.move.x; pad.my = o.move.y; app.device = 'pad'; }
    pad.bHeld = !!o.held.b; pad.xHeld = !!o.held.x;
    if (o.a) { q.a++; menuQ.push('ok'); Snd.init(); app.device = 'pad'; }
    if (o.b) { q.b++; menuQ.push('back'); app.device = 'pad'; }
    if (!pad.bHeld && pad.prevB) q.bUp++;
    pad.prevB = pad.bHeld;
    if (FOUR && o.x) { q.x++; app.device = 'pad'; }
    if (FOUR && o.y) { q.y++; app.device = 'pad'; }
    if (o.start) menuQ.push('pause'); // a short press; holding START opens setup
    const now = { up: pad.my < -0.6, down: pad.my > 0.6, left: pad.mx < -0.6, right: pad.mx > 0.6 };
    for (const d of ['up', 'down', 'left', 'right']) if (now[d] && !pad.dirs[d]) menuQ.push(d);
    pad.dirs = now;
  }
```

### prototypes/p6/game.js · drawTouchEdit (lines 469–479) · for P7#known-gaps:13
```js
  function drawTouchEdit(L) { // over the paused game: a veil, the two controls ringed, the toolbar
    const ed = app.touchEdit; if (!ed) return;
    const ring = (x, y, r, on) => { ctx.save(); ctx.setLineDash([8, 6]); ctx.lineWidth = on ? 4 : 2; ctx.strokeStyle = on ? C.dummy : FT.edge; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore(); };
    ring(L.home.x, L.home.y, L.sr + 10, ed.sel === 'stick'); ring(L.c.x, L.c.y, L.sp + L.fr + 10, ed.sel === 'face');
    const bar = editBar(L), cfg = app.touchCfg || {}, k = (cfg[ed.sel] && cfg[ed.sel].k) || 1;
    panel(bar.x, bar.y, bar.w, bar.h);
    txt('TOUCH LAYOUT', bar.x + 20, bar.y + 34, fLab, FT.accent);
    txt('Drag the stick or the buttons anywhere. Tap one to size it.', bar.x + 20, bar.y + 62, '400 17px ' + F_UI, FT.text);
    txt((ed.sel === 'stick' ? 'MOVE STICK' : 'Y X B A BUTTONS') + ' · ' + Math.round(k * 100) + '%', bar.x + bar.w - 20, bar.y + 34, '700 16px ' + F_UI, C.dummy, 'right');
    for (const [key, label] of [['minus', '−  SIZE'], ['plus', '+  SIZE'], ['reset', 'RESET'], ['done', 'DONE']]) { const c = bar[key]; glassKey(c.x, c.y, c.w, c.h); txt(label, c.x + c.w / 2, c.y + c.h / 2 + 6, '700 16px ' + F_UI, key === 'done' ? C.dummy : FT.text, 'center'); }
  }
```

### prototypes/p6/game.js · playKeys (lines 2071–2091) · for P7#known-gaps:13
```js
  function playKeys(s) {
    if (!s || app.screen !== 'game' || app.paused || s.phase !== 'play' || TOUCH.on) return null; // touch: the diamond is the legend
    if (!FOUR) { const keys = [['WASD', 'MOVE'], ['SPACE', 'DASH']]; if (s.has('carry') || s.has('throw')) keys.push(['K', 'CONE']); return keys; }
    const pd = app.device === 'pad', keys = [[pd ? 'STICK' : 'WASD', 'MOVE']].concat(s.dashFitted && !s.dashFitted() ? [] : [[pd ? 'A' : 'SPACE', 'DASH']]); // Edit 75: A, B, X, Y as installed. Edit 91: DASH once Battery 1 is fitted
    if (s.has('jump')) keys.push([pd ? 'B' : 'L', 'JUMP']);
    if (ABIL4) { // Edit 80: X grabs, a hold puts down; Y pushes off a car
      const b = s.body, n = s.carriedCones().length, room = n < s.coneCapacity();
      if (s.has('carry')) keys.push([pd ? 'X' : 'J', b.held ? (room ? 'GRAB · HOLD: DOWN' : 'HOLD: PUT DOWN') : 'GRAB']);
      if (s.has('push')) keys.push([pd ? 'Y' : 'I', 'PUSH ×' + (b.pushes || 0)]);
      return keys;
    }
    if (ABIL3) { // Edit 79: X does it all; a hitched body lets go with X, slings with A
      const b = s.body;
      if (b.mode === 'hitch') { keys[1] = [pd ? 'A' : 'SPACE', 'SLING']; keys.push([pd ? 'X' : 'J', 'LET GO']); }
      else if (s.has('carry')) keys.push([pd ? 'X' : 'J', b.held ? (s.has('throw') ? 'DROP · HOLD THROW' : 'DROP') : s.has('hitch') ? 'GRAB · HITCH' : 'GRAB']);
      return keys;
    }
    if (s.has('carry')) keys.push([pd ? 'X' : 'J', s.body.held && s.carriedCones().length >= s.coneCapacity() ? 'PLACE' : s.body.held ? 'GRAB/PLACE' : 'GRAB']);
    if (s.has('throw')) keys.push([pd ? 'Y' : 'I', 'THROW']);
    return keys;
  }
```

### prototypes/p6/sim.js · Sim.netBegin (lines 3515–3524) · for EDIT92#3:6
```js
    netBegin(dt) {
      const D = this.district, act = this.cellOf(D.cur);
      if (this.netCur !== act) this.netCur = act; // a screen made active by hand: its traffic is this.cars
      this.saveCell(act);
      this.netBodies();
      this.netAdmit();
      for (const q of this.net.cells) q.tr.ghosts = this.netGhosts(q);
      for (const q of this.net.cells) if (q !== act) this.inCell(q, () => { const own = this.cars; this.cars = own.concat(q.tr.ghosts); this.carAI(dt); this.cars = own; });
      this.cars = act.tr.cars.concat(act.tr.ghosts);
    }
```

### prototypes/p6/game.js · objective (lines 1976–1996) · for EDIT92#3:6
```js
  function objective(s) {
    if (!s) return null;
    if (s.storyMode) {
      const pr = s.story, id = s.levelId, act = STORY.activeTile(pr, id), here = s.screenName();
      const rs = s.rescue, gn = rs && (rs.gift || rs.given);
      if (rs && gn && !rs.ferry) return ['FARSIGHT DRONE', 'Delivering ' + NODE(gn).name + '.']; // Edit 84
      if (rs && rs.gift) return ['FARSIGHT DRONE', 'Bringing ' + NODE(rs.gift).name + ', then on to ' + rs.tile + '.'];
      if (rs && rs.ferry) return ['FARSIGHT DRONE', 'Carrying the chassis to ' + rs.tile + '.'];
      if (!act) return ['STORY', INFO(id).name + ' is cleared.'];
      const task = STORY.tileOf(id, act).task, need = STORY.needOf(id, act, s.P), lab = STORY.taskText(task, s.P).label.toLowerCase(), cnt = ' (' + pr.tileWO + ' of ' + need + ')';
      const what = (need === 1 ? 'Write off a body' : 'Write off ' + need + ' bodies') + (task.kind === 'any' ? '' : '. Last hit: ' + lab);
      if (here === act) return ['OBJECTIVE · ' + act, what + cnt + '.'];
      return ['OBJECTIVE · ' + act, 'Back to ' + act + ': ' + what.charAt(0).toLowerCase() + what.slice(1) + cnt + '.'];
    }
    if (s.isCity && s.quota) {
      const rs = s.rescue; if (rs && (rs.gift || rs.given)) return ['FARSIGHT DRONE', 'Delivering ' + NODE(rs.gift || rs.given).name + '.']; // Edit 84
      let line = 'Write off ' + s.quota + ' bodies (' + s.run.writeOffs + ' of ' + s.quota + ').';
      return ['OBJECTIVE · ' + INFO(s.levelId).name.toUpperCase(), line];
    }
    return null;
  }
```

### prototypes/p6/world6.js · containerShip (lines 990–998) · for EDIT92#3.2:0
```js
  function containerShip(B, x0, y0) { // Waterfront B3: the ship that will take the certified model to market, moored on the river
    const L = 120, Wd = 22, put = (x, y, c) => B.put(x0 + x, y0 + y, c);
    for (let t = 0; t < 30; t++) for (let x = 6; x < L; x++) B.shade(x0 + x - t * 0.7, y0 + Wd + t * 0.7, 0.9); // its shadow on the water
    for (let y = 0; y < Wd; y++) for (let x = 0; x < L; x++) { const bow = x > L - 14 ? (x - (L - 14)) * 0.8 : 0; if (Math.abs(y - Wd / 2) > Wd / 2 - bow) continue; put(x, y, Math.abs(y - Wd / 2) > Wd / 2 - bow - 1.5 ? K.white : c32('#2A3346')); }
    const cols = [N.cyan, N.magenta, c32('#5F6E86'), c32('#C9D3DA'), LEDS[2 % LEDS.length]];
    for (let r = 0; r < 3; r++) for (let q = 0; q < 8; q++) { const bx = 24 + q * 10, by = 3 + r * 6; for (let y = 0; y < 5; y++) for (let x = 0; x < 9; x++) put(bx + x, by + y - 2, y === 0 || x === 0 ? K.bldgOutline : cols[(q * 3 + r * 2 + q * r) % cols.length]); }
    for (let y = 2; y < Wd - 2; y++) for (let x = 6; x < 18; x++) put(x, y - 6, y === 2 || x === 6 || x === 17 ? K.bldgOutline : y % 3 === 0 ? N.cyan : K.white); // the bridge
    for (let x = -10; x < 0; x++) for (const yy of [Wd / 2 - 3, Wd / 2 + 3]) if ((x + 20) % 3) put(x, Math.round(yy + x * 0.2), mixK(N.cyan, K.white, 0.5)); // the wake
  }
```

### prototypes/p6/sim.js · Sim.emit (lines 1639–1639) · for EDIT92#3.2:0
```js
    emit(type, data) { const e = Object.assign({ t: +this.t.toFixed(4), type }, data || {}); if (this.awayCell) e.away = this.awayCell; this.events.push(e); } // P5.3: an event on another screen carries its name
```

### prototypes/p6/sim.js · Sim.spawnBody (lines 1654–1666) · for EDIT92#3.2:1
```js
    spawnBody() {
      const P = this.P, sp = this.pickSpawn();
      this.run.chassis++;
      this.body = {
        x: sp.x, y: sp.y, vx: 0, vy: 0, facing: sp.f * DEG, health: this.maxHealth(),
        charge: this.capacity(), refillDelay: 0, rampT: 0, mode: 'idle', parts: { head: 0, torso: 0, armL: 0, armR: 0, legL: 0, legR: 0 },
        coastVx: 0, coastVy: 0, coastT: 0, counterVx: 0, counterVy: 0, counterT: 0, counterDur: 0,
        lunge: null, recoverT: 0, held: null, carried: [], gesture: null, alive: true, chassis: this.run.chassis, // Edit 78: carried, every cone held (held: the top)
        level: 0, floor: null, stair: null, drop: null, // Edit 44: level 0 ground, 1 low highway, 2 high (highway, roofs, skybridges)
        hits: [], denied: 0, points0: this.run.points, z: 0, jump: null, combo: null, landT: 0, // Edit 75: jump height; the combo in progress. Edit 76: landing time left
      };
      this.emit('chassis', { chassis: this.run.chassis, x: sp.x, y: sp.y });
    }
```

### prototypes/p6/sim.js · Sim.checkTerminal (lines 3295–3310) · for EDIT92#3.2:1
```js
    checkTerminal() {
      const P = this.P, r = this.run;
      if (r.ending) return;
      const cleared = r.writeOffs >= this.quota;
      if (cleared && this.isFinal) return this.end('Licensed');
      if (!cleared && this.slot >= this.schedule.length && this.allCars().every((c) => c.spent || c.deck)) return this.end('Failed test'); // P5.3: every car in the district
      if (!this.body.alive) {
        r.credits += P['economy.creditsPerWriteOff']; // Edit 82: a credit a body (registered; 1 as before)
        const b = this.body;
        this.report = { chassis: b.chassis, hits: b.hits.slice(), points: Math.round(r.points - b.points0), credits: r.credits,
          roadCleared: cleared, nextRoad: cleared ? this.list[this.roadIndex + 1] : null };
        if (cleared) { this.emit('road-cleared', { road: this.roadIndex + 1 }); this.mile('road' + (this.roadIndex + 1) + 'Cleared'); }
        this.emit('credit', { credits: r.credits });
        this.phase = 'writeoff'; this.phaseT = P['feedback.writeOffSeconds']; this.pendingPhase = 'report';
      }
    }
```