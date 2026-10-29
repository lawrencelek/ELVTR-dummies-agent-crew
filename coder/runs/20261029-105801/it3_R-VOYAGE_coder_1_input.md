# Task
Write the code for requirement R-VOYAGE. Release tag for comments: `Edit 94 (P7.13)`. Output the blocks your system prompt defines.

# The requirement (with its acceptance probes)
```json
{
 "id": "R-VOYAGE",
 "title": "Fly the dummy over the river to the ship at Waterfront B3",
 "statement": "After the unveiling, the drone lifts the dummy over the river to the container ship at Waterfront B3. The ending screen follows.",
 "sources": [
  "EDIT92#3.2:1",
  "EDIT92#3.2:0",
  "P7#known-gaps:7",
  "EDIT92#7",
  "EDIT93#open:0",
  "EDIT92#open:0"
 ],
 "gdd_status": "proposed",
 "decision": "D76",
 "spec": "partial",
 "spec_gap": "The GDD does not give the flight's route, its length, where on the ship the dummy is set down, or whether the screen scrolls or cuts from B2 to B3.",
 "impact": "reward",
 "depends_on": [
  "R-UNVEIL"
 ],
 "touches": [
  {
   "file": "prototypes/p7/story.js",
   "symbol": "StorySim.continueUnveil, StorySim.stepRescue, droneTo, StorySim.flip",
   "why": "phase 'voyage': the drone from B2 to the ship in B3, then end('Certified')"
  },
  {
   "file": "prototypes/p6/world6.js",
   "symbol": "containerShip",
   "why": "the ship's position in B3 as the flight's target"
  },
  {
   "file": "prototypes/p6/game.js",
   "symbol": "drawRescue6, drawEnding",
   "why": "draw the flight; the ending screen after it"
  }
 ],
 "registry_uses": [
  "proto.droneSpeed",
  "proto.droneLiftSeconds"
 ],
 "registry_new": [],
 "contract": "s.continueUnveil() starts phase 'voyage' with s.rescue = { voyage: true, drone, ... } and emits 'voyage' { from: 'B2', to: 'B3' }. The drone flies at proto.droneSpeed and lifts over proto.droneLiftSeconds. On arrival at the ship it emits 'voyage-end', s.screenName() is 'B3', and s.end('Certified') sets phase 'ending'.",
 "probes": [
  {
   "id": "p1",
   "kind": "sim",
   "say": "continuing the unveiling starts the voyage with the drone at work",
   "expr": "const s = await H.certify({});\nawait H.runTo(s, (x) => x.phase === 'unveil' || x.phase === 'ending', 900);\ns.continueUnveil?.();\nawait H.runTo(s, (x) => x.phase === 'voyage' || x.phase === 'ending', 120);\nreturn { ok: s.phase === 'voyage' && !!s.rescue?.voyage, detail: 'phase ' + s.phase + ', voyage ' + !!s.rescue?.voyage };"
  },
  {
   "id": "p2",
   "kind": "sim",
   "say": "the voyage ends at the ship in B3, then the Certified ending",
   "expr": "const s = await H.certify({});\nawait H.runTo(s, (x) => { if (x.phase === 'unveil') x.continueUnveil?.(); return x.phase === 'ending'; }, 4800);\nconst v = H.ev(s, 'voyage'), e = H.ev(s, 'voyage-end');\nconst ok = v.length === 1 && v[0].to === 'B3' && e.length === 1 && s.screenName() === 'B3' && s.run.ending?.kind === 'Certified';\nreturn { ok, detail: 'voyage ' + v.length + ', end ' + e.length + ', tile ' + s.screenName() + ', ending ' + (s.run.ending?.kind || null) };"
  },
  {
   "id": "p3",
   "kind": "sim",
   "say": "guard: with the voyage built, an Arcade Waterfront run never enters unveil or voyage",
   "expr": "const built = typeof H.STORY.StorySim.prototype.continueUnveil === 'function';\nconst a = H.arcade('waterfront');\nawait H.step(a, 300);\nconst bad = a.phase === 'unveil' || a.phase === 'voyage' || H.ev(a, 'voyage').length > 0;\nreturn { ok: built && !bad, detail: 'built ' + built + ', arcade phase ' + a.phase };"
  },
  {
   "id": "p4",
   "kind": "page",
   "say": "in the page, A on the unveiling starts the flight to the ship",
   "expr": "await G.openStory(await G.certifyProgress({}));\nawait G.lastWriteOff();\nconst u = await G.waitFor(() => window.__dummies?.sim?.phase === 'unveil', 8000);\nlet ok = false;\nif (u) { await G.wait(1500); await G.press('Space'); ok = await G.waitFor(() => window.__dummies?.sim?.phase === 'voyage', 4000); }\nawait G.wait(1000);\nawait G.shot('voyage');\nreturn { ok, detail: 'unveil ' + u + ', voyage ' + ok };"
  }
 ]
}
```

# GDD text
### P7#known-gaps (rank 93)
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

### EDIT93#open (rank 93)
## Open
- **D76:** the finale and Second Market.
- **D70:** eased. Parkland B1's missing drop gap stands.
- **D67, D68** stand.

### P7#story~2 (rank 93)
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

### EDIT92#3.2 (rank 92)
## 3.2 Ending and finale
```markdown
- **Ending screen (built):** CERTIFIED. "Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage."
- **Finale (proposed, D76):**
  - The unveiling: the circus's monument, shrouded until B2 clears; the plaque shows the run (chassis spent, points, best combo, time).
  - The drone lifts the dummy over the river to the ship at Waterfront B3; every crate carries its face.
  - Credits over the voyage.
- **What clearing everything gives:** the ending (built); the CERTIFIED save stamp (built, since Edit 81); the unveiling and the plaque; Second Market, the city again with the cars' learning kept (D76).
```

### EDIT92#7 (rank 92)
## 7 Tile art (amends Edit 91 §3; `world.storyArt` 1 in P7)
```markdown
- **Rule:** cosmetic only. Pixels on sprites already placed; flat marks on the ground; props never solid.
  - No solid, floor, stair, spawn or cone home changes (checked on all 27 tiles).
- **Monument A1, the welcome wall:** the LED panel shows the dummy's face in the screen's cyan; WELCOME · NEW STAFF · FARSIGHT.
- **Monument A2, the neon shops:** two shopfronts per block, a lit sign over each (OPEN, SALE; 24H, NEW); neon glow on the pavement.
- **Monument A3, the stacked cubes:** each cube lit on its edges; the roof's front edge brightest.
- **Monument C3, the LED gateway:** two pylons with lit strips; a beam 21 art px deep with chevrons; THANK YOU · DRIVE SAFE along it; its shadow across the lanes.
- **Parkland C1, the lantern pavilion:** a white paper lantern, ribbed, on the pavilion's lawn.
- **Parkland B1, the cascade:** water spilling over each pool's lip; a grated runnel across the path to the next pool.
- **Waterfront A3, C3, the customs posts:** CUSTOMS, lit, on each pier tower's plinth.
- **Waterfront B3:** a container ship moored between the stilt houses: the ship of the finale.
- **Waterfront B2:** the DUMMY MONUMENT (Edit 91).
- **Not drawn:** Parkland's visitors, Chassis 0 (figures would read as targets or obstacles).
```

### EDIT92#open (rank 92)
## Open
- **D76:** the finale (unveiling, plaque, drone to the ship, credits) and Second Market.
- **D67, D68, D70** stand.

### EDIT92#3.1~2 (rank 92)
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

# Decision
D76 (closed): The finale and the reward for clearing: the monument shrouded until B2, its unveiling, the plaque with the run's numbers, the drone to the ship at B3, credits over the voyage; Second Market (the city again, the cars' learning kept)
Notes: Raised 28 October (GDD Edit 92 §3.2); **closed 29 October:** the unveiling and the ship (row 533). Credits and Second Market move to D77
| 533 | The finale is the unveiling and the ship: the circus's monument shrouded until Waterfront B2 clears; its unveiling, with the plaque showing the run (chassis spent, points, best combo, time); a Farsight drone lifts the dummy over the river to the container ship at Waterfront B3, every crate carrying its face. The ending screen follows | user-decided: "Unveiling and ship" (29 October) | The reward for clearing is seen, not only read | Credits over the voyage and Second Market wait (D77) | Closes D76; GDD Edit 92 §3.2 |

# Built earlier by this agent (use their interfaces)
- R-SHROUD (Shroud the circus's monument until Waterfront B2 clears): - story.js: adds `'world.monumentShroud': 1` to P7SIM (p4). Adds `StorySim.monumentShrouded()`, which is true while Story's Waterfront B2 is not cleared and false once B2 is in `story.done` (p1, p2). ArcadeSim does not get this method, so Arcade's monument stays uncovered (p4).
- world6.js: `dummyMonument` now also builds a shroud sprite from the statue's own outline: one pixel wider, slate cloth folds, a darker hem and an aqua cord. Nothing solid changes. The 6.10 world still has no monument (p4).
- game.js: `drawLive6` draws the shroud over the statue right after the scene is drawn, while `s.monumentShrouded?.()` is true. Waterfront B2 in test shows it (p5).
- Registry: `world.monumentShroud` is added with default 0 and set to 1 in P7SIM, following the gating convention (the analyst proposed default 1) (p3).
- Assumption: I did not see `dummyStatue`'s code. The shroud assumes the statue sprite stores `w`, `h` and pixel array `d` (as `PIX.doll` does), and that `PIX.blit` places it at the prop's `x, y`. If not, no shroud is built and none is drawn. p1–p4 do not depend on it; p5 checks only that the sim reports the shroud, so check its screenshot (`shroud_b2`).
- Draw order: the shroud is drawn after the scene, so it covers anything standing in front of the island. The dummy's see-through outline still shows over it.
- R-UNVEIL (Unveil the monument with the run's plaque when B2 clears): story.js: when the certifying write-off clears Waterfront B2, `checkTerminal` saves the story as complete, sets `s.unveil = { plaque: { chassis, points, bestCombo, t } }` from progress, emits one 'unveil' event and enters phase 'unveil' instead of ending at once (p1, p2, p3).
story.js: `step` holds in 'unveil' as it does in 'gift'. `continueUnveil()` leaves the unveiling for the Certified ending. `progress.bestCombo` (optional, so old saves load) keeps the largest combo of any hit. Every 'impact' event and every `writeOff` updates it (p4, p2).
game.js: the 'unveil' event plays a chime and saves the slot. `renderScreen` draws the plaque over the field. B2 is now cleared, so R-SHROUD's shroud is no longer drawn and the monument shows. In `handleMenus`, A continues to the ending screen (p5).
world6.js needs no change: the uncovered monument is the existing statue with the shroud gone.
Risk: I could not see `panel`/`txt`/`fmtT`, so the plaque draws on the first page canvas with its own pixel-scaled text and its own time format. Check the `unveil` screenshot.

# Probe APIs (how the probes drive the game)
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

Sim facts (the shapes probes read):
  s.phase                     'brief' · 'play' · 'gift' · 'hitstop' · 'scroll' · 'writeoff' · 'report' · 'shop' · 'next' · 'ending'
  s.run.ending                null, or an object: { kind: 'Certified' | 'Licensed' | 'Failed test' | 'Non-compliant', t, writeOffs, points }
  s.story                     Story's progress object: district, done, tileWO, owned, points, chassis, writeOffs, t, gifts, complete
  s.events                    [{ t, type, ...data }] in order; s.emit(type, data) adds one. H.ev(s, type) filters them
  s.screenName()              the tile on screen ('B2'); s.sc its scene; s.levelId the district; s.storyMode true in Story
  s.body                      { x, y, mode ('idle', 'lunge', 'jump', 'rescue', …), alive, health, hits: [{ kind, cls, combo, … }] }
  s.rescue                    a drone at work, or null: { phase, ferry, gift, tile, drone: { x, y, alt, state } }
  s.report.story              after a Story write-off: { counted, cleared, next, districtDone, storyDone, parts, nextGift }

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
### Outlines of the files it touches
```
prototypes/p6/game.js (3303 lines)
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
    823-950   function processEvents
    953-953   function giftChime
    954-962   function giftFanfare
    964-964   function horn
    965-965   function dashify
    966-966   function toast
    970-970   const    PAUSE_STORY
    971-971   arrow    pauseItems
    972-972   const    END_ITEMS
    976-976   arrow    nextLevel
    977-977   arrow    NODE
    978-978   arrow    nodeDesc
    979-1088  function handleMenus
   1093-1093  const    TY
   1110-1113  function rr
   1114-1116  function txt
   1117-1118  arrow    h
   1117-1117  function rgba
   1118-1118  function roleC
   1119-1133  function panel
   1134-1138  function glassKey
   1139-1139  function fmtT
   1140-1140  function num
   1141-1146  function wrapLines
   1147-1151  function wrapText
   1152-1161  function drawKeys
   1170-1170  arrow    ALL
   1171-1171  arrow    toA
   1172-1172  arrow    EXT
   1174-1212  function levelArt
   1179-1179  arrow    zL
   1180-1187  arrow    roofSpec
   1188-1202  arrow    sprite
   1203-1203  arrow    deckAt
   1204-1204  arrow    blockOf
   1213-1213  function flush
   1214-1214  function carSpr
   1215-1215  function shortId
   1216-1216  function coneLift
   1217-1225  function coneFn
   1226-1226  function rotRect
   1227-1227  function arcPoly
   1228-1228  function mixOnce
   1230-1245  function corridorPts
   1246-1267  function blindSpots
   1248-1257  arrow    add
   1255-1255  arrow    far
   1269-1288  function drawZones
   1275-1275  arrow    open
   1286-1286  arrow    inSensor
   1289-1307  function drawPath
   1309-1321  function drawStopCue
   1322-1326  function drawViewEdges
   1328-1338  function markCar
   1339-1345  function drawMarks
   1347-1347  arrow    carsOf
   1348-1348  arrow    lay
   1349-1349  arrow    zLift
   1350-1350  function bodyFloor
   1351-1351  function onFloor
   1352-1352  function onDeck
   1353-1353  function onGroundDraw
   1354-1354  function stairDeck
   1355-1360  function cueLevel
   1361-1368  function cueDeck
   1369-1375  function bodyLift
   1376-1376  function deckOf
   1377-1377  function carShadow
   1378-1392  function dynShadows
   1380-1380  arrow    off
   1393-1398  function dropK
   1399-1408  function reachEnd
   1410-1430  function drawBodyGround
   1431-1453  function drawBodySprite
   1456-1465  function drawNose
   1460-1460  arrow    add
   1466-1478  function drawCarSprite
   1472-1472  arrow    roof
   1480-1494  function pip
   1495-1504  function drawCarMarks
   1507-1511  function tagRect
   1512-1527  function drawTag
   1528-1534  function drawDrone
   1538-1562  function drawDeck
   1566-1593  function drawLights
   1595-1602  function drawBoom
   1603-1631  function drawSprites
   1614-1614  arrow    L
   1632-1634  function relight
   1635-1638  function ghost
   1639-1677  function drawEffects
   1678-1693  function drawRingsStreaks
   1694-1694  const    ROLE_K
   1695-1695  function roleK
   1696-1696  function lowHealth
   1697-1716  function drawParts
   1717-1717  function mixRect
   1718-1726  function drawStamp
   1727-1764  function drawLive
   1734-1738  arrow    cues
   1768-1779  function composeScroll
   1784-1784  arrow    elevOf
   1785-1794  function where6
   1795-1801  function shadows6
   1802-1865  function drawLive6
   1806-1810  arrow    cues
   1812-1812  arrow    into
   1813-1813  arrow    meItem
   1868-1868  const    GIFT_BOX
   1869-1874  function drawGiftBox
   1875-1875  function rescueLift
   1876-1884  function drawRescue6
   1885-1891  function drawLoading
   1892-1899  function drawField
   1900-1906  function drawField6
   1907-1915  function blitField
   1917-1933  function drawFieldHD
   1936-1936  arrow    kMin
   1937-1946  function liveBark
   1949-1976  function drawBubblesHD
   1952-1952  arrow    toC
   1954-1954  arrow    hit
   1979-1999  function objective
   2000-2048  function drawMessages
   2007-2007  arrow    fit
   2020-2020  arrow    widthOf
   2021-2021  arrow    lineW
   2024-2024  arrow    fits
   2028-2028  arrow    clip
   2029-2042  arrow    drawItem
   2050-2050  function roadLabel
   2051-2071  function drawFrame
   2074-2094  function playKeys
   2095-2108  function drawKeysPanel
   2109-2109  const    WHERE6
   2111-2114  function whereOf
   2115-2115  function fitTextR
   2116-2116  function fitNumR
   2117-2117  function fitText
   2118-2127  function drawScore
   2128-2140  function drawTopBar
   2142-2170  function drawHUD
   2176-2176  const    MAP_Z
   2179-2182  function mapGeom
   2183-2204  function mapRoads
   2185-2185  arrow    off
   2205-2220  function mapCanvas
   2221-2258  function drawDistrict
   2260-2260  const    PART_NAME
   2262-2266  function partLevels
   2271-2283  function dollMods
   2281-2281  arrow    own
   2284-2292  function dollCanvas
   2293-2305  function partEffects
   2309-2309  const    PART_TAG
   2310-2310  function partReds
   2311-2311  function redText
   2312-2340  function drawBodyPanel
   2343-2343  function veil
   2344-2353  function menuList
   2354-2354  function difficultyHealth
   2355-2360  function endItems
   2361-2361  function quotaOf
   2362-2387  function drawTitle
   2390-2390  arrow    plural
   2391-2395  function storyCursor
   2396-2401  function giftText
   2402-2424  function drawModeTitle
   2427-2431  function slotLines
   2432-2476  function drawSaves
   2477-2482  function nameKeyRects
   2483-2504  function drawNameEntry
   2505-2560  function drawStoryMap
   2520-2520  arrow    at
   2561-2579  function drawBrief
   2584-2589  function sprCanvas
   2590-2603  function giftArtOf
   2596-2596  arrow    mk
   2604-2604  function giftReady
   2605-2672  function drawGiftPopup
   2608-2608  arrow    clamp01
   2673-2680  function drawBriefFoot
   2681-2696  function drawMapFences
   2683-2683  arrow    open
   2684-2684  arrow    seen
   2697-2697  arrow    c32
   2698-2698  const    FENCE
   2699-2708  function drawStoryFence
   2702-2702  arrow    at
   2709-2736  function drawReport
   2737-2776  function drawShop
   2779-2779  const    BADGE
   2781-2798  function abilityStats
   2799-2850  function drawAbilityShop
   2851-2851  const    PART_WORD
   2855-2855  const    WS_POS
   2857-2862  function seatOf
   2863-2863  arrow    wsLocked
   2864-2864  arrow    wsCost
   2865-2871  function wsMove
   2872-2935  function drawWorkshop
   2886-2886  arrow    seatAt
   2937-2962  const    CUE_KEY
   2943-2962  function cueCanvas
   2947-2947  arrow    car
   2948-2948  arrow    loc
   2963-2972  function drawCueKey
   2976-2976  arrow    deviceOf
   2977-2982  function optionItems
   2983-2990  function optionDo
   2991-2991  arrow    controlItems
   2992-3007  function controlRows
   2994-2994  arrow    nm
   3008-3022  function drawControls
   3023-3041  function drawPause
   3042-3057  function drawEnding
   3059-3066  function render
   3068-3068  function unveilTime
   3069-3083  function drawUnveil
   3084-3104  function renderScreen
   3107-3107  const    MOVE_NAME
   3108-3119  function drawComboMeter
   3120-3127  function drawPadSetup
   3130-3172  const    TUNE
   3180-3184  function current
   3185-3189  function setParam
   3190-3235  function buildTune
   3236-3244  function syncTune
   3245-3245  function toggleTune
   3256-3260  function showTrace
   3264-3264  arrow    done
   3270-3270  function appStatus
   3273-3294  function frame

prototypes/p6/world6.js (2416 lines)
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
    914-921   function dummyMonument
    924-937   function shroudSprite
    940-940   arrow    ART
    941-941   arrow    onSpr
    942-942   arrow    lumOf
    943-952   function welcomeWall
    953-961   function shopSigns
    962-966   function cubeRim
    963-963   arrow    at
    967-983   function gatewayLayer
    979-979   arrow    vtext
    984-992   function lanternSprite
    993-997   function falls
    998-1000  function runnel
   1001-1006  function customsSign
   1007-1015  function containerShip
   1018-1028  function sceneSim
   1030-1035  function labSim
   1037-1047  function junctionArms
   1049-1073  function vDeck
   1075-1081  function gridLines
   1084-1098  function alignFlights
   1100-1110  function holeOpenings
   1111-1115  function vEscalators
   1113-1113  arrow    at
   1117-1121  function waterBlock
   1123-1132  function cubeStack
   1133-1141  function poolFP
   1142-1146  function ledPanel
   1147-1153  function drum
   1149-1149  arrow    put
   1154-1159  function billboard
   1161-1298  function buildScreen
   1167-1167  const    RBS
   1169-1169  const    ANG
   1182-1182  arrow    lvl
   1222-1222  arrow    rd
   1223-1223  arrow    roadOk
   1265-1265  arrow    blocked
   1266-1266  arrow    underDeck
   1267-1267  arrow    inRects
   1268-1268  arrow    free
   1300-1308  function diagRoads
   1309-1375  function parkTile
   1314-1314  arrow    free
   1315-1315  arrow    okP
   1319-1319  arrow    piece
   1320-1329  const    SP
   1339-1339  arrow    cas
   1365-1365  arrow    tb
   1377-1432  function monumentTile
   1378-1378  arrow    u
   1435-1455  function chongqing
   1456-1492  function monumentCentre
   1458-1458  arrow    sq
   1462-1463  arrow    diag
   1472-1472  arrow    laneD
   1476-1476  arrow    okP
   1497-1497  arrow    inR
   1498-1506  function polyDist
   1507-1515  function mergeRects
   1516-1516  arrow    rectFloor
   1517-1522  function deckFloor
   1523-1529  function ringFloor
   1525-1525  arrow    inArc
   1532-1541  function coneShows
   1542-1595  function gameData
   1574-1574  arrow    offPoly
   1575-1575  arrow    ground
   1576-1576  arrow    pick
   1580-1580  arrow    score
   1600-1600  arrow    horizE
   1601-1601  arrow    edgePt
   1602-1602  arrow    edgeRect
   1603-1603  function groundFree
   1606-1606  const    INW
   1607-1612  function arrives
   1613-1613  arrow    cpZone
   1614-1614  function runsOf
   1615-1695  function edgePass
   1618-1618  arrow    pre
   1622-1631  arrow    plantFlags
   1702-1702  arrow    hashId
   1703-1703  arrow    NOOP
   1704-1708  function quiet
   1709-1756  function linkWorld
   1716-1716  arrow    add
   1726-1726  arrow    outside
   1732-1732  const    SD
   1757-1762  function recOf
   1763-1767  arrow    routeOf
   1768-1773  function ghostOf
   1774-1783  function seamGhosts
   1785-1792  function trafficTick
   1796-1809  function seamGiveWay
   1810-1848  function stepWorld
   1854-1859  function seen
   1860-1860  function groupCars
   1861-1861  arrow    sameRec
   1862-1866  function roomAt
   1867-1871  function queued
   1872-1881  function spawn
   1882-1905  function manage
   1906-1909  function goLive
   1917-1947  function fillDead
   1921-1921  arrow    mark
   1943-1943  arrow    fp
   1948-1981  function fillPockets
   1950-1950  arrow    link
   1951-1951  arrow    stand
   1958-1958  arrow    gAt
   1959-1959  arrow    fAt
   1977-1977  arrow    fp
   1982-2006  function buildWorld
   2008-2013  function viewCars
   2016-2016  arrow    carKey
   2017-2017  arrow    carSpr
   2019-2053  function compose
   2030-2044  arrow    drawLayer
   2055-2060  function layerOf
   2064-2064  arrow    INFO
   2065-2065  arrow    nameOf
   2066-2401  class    Sim6
   2067-2076  method   Sim6.constructor
   2077-2095  method   Sim6.reset
   2096-2096  method   Sim6.enter
   2097-2097  method   Sim6.screenName
   2098-2098  method   Sim6.buildView
   2099-2099  method   Sim6.carsLeft
   2100-2100  method   Sim6.allCars
   2101-2101  method   Sim6.bodyLayer
   2102-2102  method   Sim6.meets
   2103-2103  method   Sim6.bodyDeck
   2104-2104  method   Sim6.floorOf
   2105-2105  method   Sim6.onGround
   2106-2111  method   Sim6.spawnBody
   2112-2116  method   Sim6.pickSpawn
   2118-2152  method   Sim6.step
   2153-2153  method   Sim6.moveBody
   2154-2154  method   Sim6.bodyControl
   2156-2165  method   Sim6.floorStep
   2166-2177  method   Sim6.stairStep
   2180-2202  method   Sim6.floorMove
   2184-2184  arrow    block
   2203-2211  method   Sim6.neighbourFloor
   2214-2228  method   Sim6.startDrop6
   2218-2218  arrow    plan
   2229-2233  method   Sim6.land
   2236-2248  method   Sim6.startRescue
   2249-2259  method   Sim6.landPoints
   2260-2281  method   Sim6.stepRescue
   2267-2267  arrow    next
   2283-2343  method   Sim6.collideBody
   2287-2287  arrow    block
   2288-2288  arrow    push
   2289-2289  arrow    rect
   2344-2349  method   Sim6.edgeOpen
   2350-2350  method   Sim6.moveCones
   2351-2351  method   Sim6.coneSpotValid
   2352-2352  method   Sim6.dropHeld
   2353-2353  method   Sim6.throwHeld
   2355-2370  method   Sim6.checkFlip
   2371-2371  method   Sim6.canCross
   2372-2372  method   Sim6.edgeLift
   2373-2389  method   Sim6.flip
   2390-2393  method   Sim6.checkTerminal
   2394-2394  method   Sim6.drawDrones
   2395-2400  method   Sim6.trace
   2403-2412  function circleRect
```

### prototypes/p7/story.js, in full
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
    'world.storyArt': 1, // Edit 92: the story's tile art (Narrative A, Certified), cosmetic only
    'world.monumentShroud': 1 }; // Edit 94 (P7.13): the circus's monument shrouded in Story until Waterfront B2 clears (D76)
  const CIRCUS = { district: 'waterfront', tile: 'B2' }; // Edit 94 (P7.13): the monument's tile, the story's last
  const BASE = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES, W6.P6SIM, P7SIM);

  // ---------- progress: one plain object, JSON-safe
  function newProgress() {
    return { v: 1, district: DIST[0].id, done: {}, tileWO: 0, owned: {}, credits: 0, points: 0, chassis: 0, writeOffs: 0, t: 0,
      gifts: {}, tilePoints: {}, complete: false, bestCombo: 0 }; // Edit 94 (P7.13): bestCombo, optional (old saves load without it)
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
    continueUnveil() { if (this.phase !== 'unveil') return; if (this.unveil) this.unveil.done = true; this.end('Certified'); } // Edit 94 (P7.13): the plaque read, the ending follows
    // Edit 94 (P7.13): progress.bestCombo, the largest combo of any hit in the story
    noteCombo(c) { const pr = this.story; if (this.storyMode && pr && (c || 0) > (pr.bestCombo || 0)) pr.bestCombo = c; }
    emit(type, data) { const out = super.emit(type, data); if (type === 'impact' && data && data.combo) this.noteCombo(data.combo); return out; }
    step(cmd) {
      if (this.phase === 'brief' || this.phase === 'gift' || this.phase === 'unveil') return; // Edit 94 (P7.13): the unveiling holds the sim
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
      for (const h of b.hits) this.noteCombo(h.combo || 0); // Edit 94 (P7.13): the run's best combo
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
      if (storyDone) { // Edit 94 (P7.13): the circus clears; the monument is unveiled with the run's plaque, then the ending (D76)
        pr.complete = true; this.syncProgress();
        const plaque = { chassis: pr.chassis, points: pr.points, bestCombo: pr.bestCombo || 0, t: pr.t };
        this.unveil = { plaque, done: false }; this.phase = 'unveil';
        this.emit('unveil', plaque); return;
      }
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
    // Edit 94 (P7.13): the DUMMY MONUMENT stays shrouded until the circus, Waterfront B2, clears (D76)
    monumentShrouded() { const P = this.P; return !!(this.storyMode && this.story && P['world.monumentShroud'] && P['world.dummyMonument'] && !doneIn(this.story, CIRCUS.district).includes(CIRCUS.tile)); }
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

### Excerpts
#### prototypes/p7/story.js · StorySim.continueUnveil (lines 169–169) · named by the requirement
```
    continueUnveil() { if (this.phase !== 'unveil') return; if (this.unveil) this.unveil.done = true; this.end('Certified'); } // Edit 94 (P7.13): the plaque read, the ending follows
```

#### prototypes/p7/story.js · StorySim.stepRescue (lines 202–228) · named by the requirement
```
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
```

#### prototypes/p7/story.js · droneTo (lines 105–110) · named by the requirement
```
  function droneTo(sim, hx, hy, opts) {
    const b = sim.body, P = sim.P;
    b.mode = 'rescue'; Object.assign(b, { lunge: null, stair: null, jump: null, z: 0, vx: 0, vy: 0, _spr: null });
    return Object.assign({ t: 0, phase: 'inbound', k: 0, under: 0, up: 0, item: 0, lift: P['proto.droneLiftSeconds'], v: P['proto.droneSpeed'], to: null,
      drone: { x: hx, y: hy, alt: 1, state: 'inbound', rescue: true, hx, hy } }, opts);
  }
```

#### prototypes/p7/story.js · StorySim.flip (lines 242–247) · named by the requirement
```
    flip(sd, to, fl) {
      super.flip(sd, to, fl);
      if (!this.storyMode) return;
      const t = this.screenName();
      if (!this.entered && t === activeTile(this.story, this.levelId)) { this.arrive(t); this.pendingBrief = true; }
    }
```

#### prototypes/p6/world6.js · containerShip (lines 1007–1015) · named by the requirement
```
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

#### prototypes/p6/game.js · drawRescue6 (lines 1876–1884) · named by the requirement
```
  function drawRescue6(s) { // P6.1 (D37): the dummy sinks below the waterline, a drone lifts it out and sets it down on land
    const rs = s.rescue, b = s.body; if (!rs) return;
    const cx = Math.round(b.x / U), wl = Math.round(b.y / U) + 2, t = app.realT, wet = !rs.ferry && !rs.gift && rs.given === undefined && (rs.phase === 'sink' || rs.phase === 'inbound' || rs.phase === 'lift'); // Edit 84: a ferry or a delivery is on land
    if (wet) for (let k = 0; k < 2; k++) { const r = 3 + ((t * 7 + k * 5) % 10); for (const [x, y] of PIX.circle(r)) FB.mix(cx + x, wl + Math.round(y * 0.45), K.white, 0.4 * (1 - r / 13)); } // ripples
    if (rs.under >= 0.999) { if (Math.floor(t * 5) % 2) FB.put(cx + (Math.floor(t * 9) % 3) - 1, wl - 1 - (Math.floor(t * 12) % 4), K.white); return; } // bubbles: under the surface
    const wear = clamp(1 - b.health / maxHP(s), 0, 1), S = PIX.dummy(b.facing, Math.min(5, Math.round(wear * 5)));
    const ay = Math.round(b.y / U) + Math.round(rs.under * 18) - Math.round(rs.up), x0 = cx - S.ox, y0 = ay - S.oy;
    for (let j = 0; j < S.h; j++) { const yy = y0 + j; if (wet && yy > wl) break; for (let i = 0; i < S.w; i++) { const c = S.d[j * S.w + i]; if (c) FB.put(x0 + i, yy, c); } }
  }
```

#### prototypes/p6/game.js · drawEnding (lines 3042–3057) · named by the requirement
```
  function drawEnding(s) {
    veil();
    const e = s.run.ending, x = FX + 22, y = FY + 18, w = FW - 44, h = FH - 36;
    panel(x, y, w, h, { tint: e.kind === 'Licensed' || e.kind === 'Certified' ? 'rgba(232,248,238,0.95)' : 'rgba(236,247,252,0.95)' });
    txt('CONTRACT RESULT', x + 28, y + 44, fLab, FT.accent);
    const title = { Licensed: 'LICENSED', 'Failed test': 'FAILED TEST', 'Non-compliant': 'NON-COMPLIANT', Certified: 'CERTIFIED' }[e.kind] || e.kind; // Edit 81: the story's end
    txt(title, x + 26, y + 104, '900 54px ' + F_BRAND, e.kind === 'Licensed' ? FT.text : e.kind === 'Failed test' ? C.warning : FT.dim);
    wrapText(e.kind === 'Certified' ? (STORY.DATA.ending || 'All ' + STORY.TOTAL + ' tiles of the Test City are tested and certified complete.') : copy('endings.' + e.kind, ''), x + 28, y + 146, w - 56, 28, fTxt, FT.dim, e.kind === 'Certified' ? 3 : 2); // Edit 92: Narrative A's ending
    const imp = s.events.filter((v) => v.type === 'impact');
    const stats = [['TIME', fmtT(e.t)], ['WRITE-OFFS', String(e.writeOffs)], ['POINTS', num(e.points)], ['BEST HIT', imp.length ? num(Math.max(...imp.map((v) => v.assessed))) : '—']];
    const cw = (w - 56) / stats.length;
    const sy = e.kind === 'Certified' ? 30 : 0; // Edit 92: the ending's third line
    stats.forEach(([k, v], i) => { txt(k, x + 28 + i * cw, y + 222 + sy, fLab, FT.dim); txt(v, x + 28 + i * cw, y + 262 + sy, fNum, FT.text); });
    const items = endItems(s);
    menuList(items, app.endSel, x + 28, y + h - 20 - items.length * 54, 460, null, 0, (i) => { app.endSel = i; });
  }
```

#### prototypes/p6/world6.js · Sim6.stepRescue (lines 2260–2281) · retrieved (70.481)
```
    stepRescue(dt) { // sink → the drone flies in → lift → carry → set down → the drone leaves
      const rs = this.rescue, b = this.body;
      for (const d of this.leaving || []) { const dx = d.hx - d.x, dy = d.hy - d.y, l = hyp(dx, dy), st = (rs ? rs.v : this.P['proto.droneSpeed']) * dt; if (l <= st) d.gone = true; else { d.x += dx / l * st; d.y += dy / l * st; } }
      this.leaving = (this.leaving || []).filter((d) => !d.gone);
      if (!rs) return;
      rs.t += dt; rs.k += dt;
      const d = rs.drone, fly = (x, y) => { const dx = x - d.x, dy = y - d.y, l = hyp(dx, dy), st = rs.v * dt; if (l <= st) { d.x = x; d.y = y; return true; } d.x += dx / l * st; d.y += dy / l * st; return false; };
      const next = (ph) => { rs.phase = ph; rs.k = 0; };
      if (rs.phase === 'sink') { rs.under = Math.min(1, rs.k / rs.sink); if (rs.k >= rs.sink) { next('inbound'); d.state = 'inbound'; this.emit('drone-dispatch', { rescue: true }); } }
      else if (rs.phase === 'inbound') { if (fly(b.x, b.y)) { next('lift'); d.state = 'lift'; } }
      else if (rs.phase === 'lift') { const f = Math.min(1, rs.k / rs.lift); rs.under = 1 - f; rs.up = 14 * f; d.alt = 1 - 0.6 * Math.sin(Math.PI * f); if (f >= 1) { next('carry'); d.state = 'carry'; d.alt = 1; } }
      else if (rs.phase === 'carry') { const arrived = fly(rs.to.x, rs.to.y); b.x = d.x; b.y = d.y; b.px = b.x; b.py = b.y; if (arrived) next('drop'); }
      else if (rs.phase === 'drop') {
        const f = Math.min(1, rs.k / rs.lift); rs.up = 14 * (1 - f);
        if (f >= 1) {
          Object.assign(b, { x: rs.to.x, y: rs.to.y, px: rs.to.x, py: rs.to.y, level: rs.to.level, floor: rs.to.floor, mode: 'recover', recoverT: 0, vx: 0, vy: 0 });
          d.state = 'outbound'; (this.leaving = this.leaving || []).push(d);
          this.rescue = null;
          this.emit('rescued', { x: +b.x.toFixed(1), y: +b.y.toFixed(1), level: b.level, seconds: +rs.t.toFixed(2) });
        }
      }
    }
```

#### prototypes/p6/world6.js · Sim6.startRescue (lines 2236–2248) · retrieved (65.495)
```
    startRescue() { // P6.1 (Edit 63): the dummy sinks for proto.rescueSinkSeconds; then a drone flies in from the nearest screen edge
      const b = this.body, P = this.P, G = this.level;
      let best = null;
      for (const sp of this.landPoints()) { const d = hyp(sp.x - b.x, sp.y - b.y); if (!best || d < best.d) best = Object.assign({ d }, sp); }
      if (!best) best = Object.assign({ d: 0 }, G.spawns[0] || { x: W / 2, y: H / 2, level: 0, floor: null });
      const edges = [[b.x, -40], [b.x, H + 40], [-40, b.y], [W + 40, b.y]].sort((p, q) => hyp(p[0] - b.x, p[1] - b.y) - hyp(q[0] - b.x, q[1] - b.y)), ex = edges[0];
      for (const cn of this.carriedCones()) Object.assign(cn, { state: 'pending', px: b.x, py: b.y }); b.held = null; b.carried = []; b.gesture = null; // the cones go home (retryPending)
      b.mode = 'rescue'; b.lunge = null; b.stair = null; b.jump = null; b.z = 0; b.vx = b.vy = 0; b.level = 0; b.floor = null; b._spr = null;
      this.rescue = { t: 0, phase: 'sink', k: 0, x0: b.x, y0: b.y, to: best, under: 0, up: 0, sink: P['proto.rescueSinkSeconds'], lift: P['proto.droneLiftSeconds'], v: P['proto.droneSpeed'],
        drone: { x: ex[0], y: ex[1], alt: 1, state: 'wait', rescue: true, hx: ex[0], hy: ex[1] } };
      this.emit('splash', { x: +b.x.toFixed(1), y: +b.y.toFixed(1) });
      this.mile('firstRescue');
    }
```

#### prototypes/p6/sim.js · Sim.end (lines 3286–3294) · retrieved (52.28)
```
    end(kind) {
      const r = this.run;
      r.ending = { kind, t: +(this.tOffset + this.t).toFixed(3), road: this.roadIndex + 1, writeOffs: this.totalWriteOffs(), points: Math.round(r.points), purchases: r.purchases.slice() };
      this.emit('ending', { kind });
      this.mile('ending', { kind });
      if (!this.body.alive && kind !== 'Non-compliant') {
        this.phase = 'writeoff'; this.phaseT = this.P['feedback.writeOffSeconds']; this.pendingPhase = 'ending';
      } else this.phase = 'ending';
    }
```

#### prototypes/p6/sim.js · Sim.stepDrones (lines 2901–2944) · retrieved (50.445)
```
    stepDrones(dt) {
      const P = this.P, spd = P['proto.droneSpeed'], lift = P['proto.droneLiftSeconds'], CS = P['proto.droneConeSeconds'];
      if (CS > 0 && this.cones.length && this.t - (this._coneChk || -9) >= 0.25) { // Edit 71: a cone left in a lane fetches a drone, whether cars stop or steer round it
        this._coneChk = this.t; const half = P['world.laneWidth'] / 2 + P['props.cone.radius'];
        for (const cn of this.cones) {
          if (cn.state !== 'free' || this.drones.some((d) => d.cone === cn.id)) { cn.roadAt = null; continue; }
          const inLane = (this.level.lanes || []).some((ln) => { const pr = pathProject(ln, cn.x, cn.y); return pr && Math.abs(pr.lat) < half && pr.s > 0 && pr.s < ln.length; });
          if (!inLane) { cn.roadAt = null; continue; }
          if (cn.roadAt == null) cn.roadAt = this.t; else if (this.t - cn.roadAt >= CS) { this.dispatchDrone(cn); cn.roadAt = null; }
        }
      }
      const fly = (d, x, y) => { const dx = x - d.x, dy = y - d.y, l = hyp(dx, dy), st = spd * dt; if (l <= st) { d.x = x; d.y = y; return true; } d.x += dx / l * st; d.y += dy / l * st; return false; };
      for (const d of this.drones) {
        const cn = this.cones.find((c) => c.id === d.cone);
        if (d.state === 'inbound') {
          if (!cn || cn.state !== 'free') { d.state = 'outbound'; continue; }
          if (fly(d, cn.x, cn.y)) { d.state = 'lift'; d.t = 0; }
        } else if (d.state === 'lift') {
          if (cn.state !== 'free') { d.state = 'outbound'; d.alt = 1; continue; }
          d.t += dt; d.alt = 1 - 0.6 * Math.sin(Math.PI * Math.min(1, d.t / lift));
          if (d.t >= lift) {
            d.target = this.droneTarget(cn);
            if (!d.target) { d.state = 'outbound'; d.alt = 1; continue; }
            cn.state = 'drone'; d.state = 'carry'; d.alt = 1;
            this.emit('drone-pickup', { cone: cn.id });
          }
        } else if (d.state === 'carry') {
          cn.x = d.x; cn.y = d.y;
          if (fly(d, d.target.x, d.target.y)) { cn.x = d.x; cn.y = d.y; d.state = 'drop'; d.t = 0; }
        } else if (d.state === 'drop') {
          d.t += dt; d.alt = 1 - 0.6 * Math.sin(Math.PI * Math.min(1, d.t / lift));
          if (d.t >= lift) {
            const tg = d.target; d.target = null;
            if (this.coneSpotValid(tg.x, tg.y, cn)) {
              Object.assign(cn, { x: tg.x, y: tg.y, vx: 0, vy: 0, state: 'free' });
              this.emit('drone-drop', { cone: cn.id, x: tg.x, y: tg.y }); d.state = 'outbound'; d.alt = 1;
            } else { d.target = this.droneTarget(cn); d.state = d.target ? 'carry' : 'drop'; d.t = 0; if (!d.target) d.target = tg; }
          }
        } else if (d.state === 'outbound') {
          if (fly(d, d.hx, d.hy)) d.state = 'gone';
        }
      }
      this.drones = this.drones.filter((d) => d.state !== 'gone');
    }
```

#### prototypes/p6/circus_valley.js · rescue (lines 145–149) · retrieved (46.914)
```
  function rescue(plan, x, y) {
    const land = (px, py) => ground(px, py) !== RIVER && plan.roads.every((r) => distToPoly(openPts(r), px, py) > OUTER) && plan.buildings.every((b) => !inRect(b.rect, px, py, 4));
    for (let r = 4; r < 900; r += 4) for (let a = 0; a < 360; a += 3) { const px = x + r * Math.cos(a * Math.PI / 180), py = y + r * Math.sin(a * Math.PI / 180); if (land(px, py)) return { from: [x, y], to: [px, py], d: r, secs: r / P['proto.droneSpeed'] + P['proto.droneLiftSeconds'], surface: surface(px, py) }; }
    return null;
  }
```

#### prototypes/p6/game.js · drawLive6 (lines 1802–1865) · retrieved (40.472)
```
  function drawLive6(s) {
    const P = s.P, b = s.body, sc = s.sc, cars = carsOf(s);
    for (const c of cars) { c._brk = (c.man && c.man.type === 'brake') || c.state === 'interrupted' || (c._pv != null && c.v < c._pv - 0.4); c._pv = c.v; markCar(c, c._brk); c._lift = 0; c._top = null; c._layer = W6.layerOf(sc, c); }
    const inCone = coneFn(s), lvl = b.mode === 'rescue' ? -1 : cueLevel(s), mine = cars.filter((c) => elevOf(c) === lvl), wh = where6(s);
    const cues = () => {
      if (b.alive || P['proto.zonesEverywhere']) for (const c of mine) drawZones(s, c, P['proto.zonesEverywhere'] ? ALL : inCone);
      if (b.alive || P['proto.pathsEverywhere']) for (const c of mine) drawPath(s, c, P['proto.pathsEverywhere'] ? ALL : inCone);
      if (b.alive) { for (const c of mine) drawStopCue(s, c); drawViewEdges(s); }
    };
    const cueLayer = lvl > 0 ? (wh.at === 'layer' ? wh.layer : (mine.find((c) => c._layer) || {})._layer || null) : null;
    const into = (buf, fn) => { const keep = FB; FB = buf; try { fn(); } finally { FB = keep; } };
    const meItem = () => { const l = wh.rescue ? rescueLift(s) : bodyLift(s); if (l && !wh.rescue) drawBodyGround(s, l); drawBodySprite(s, false, l); };
    const items = [];
    for (const cn of s.cones) if (cn.state === 'free' || cn.state === 'flight') items.push([cn.y + 6, () => PIX.blit(FB, PIX.CONE, cn.x / U, (cn.y - coneLift(cn) * 1.2) / U)]);
    if (wh.at === 'ground') items.push([wh.key, () => drawBodySprite(s, false, 0)]);
    else if (wh.at === 'item') items.push([wh.key, meItem]);
    else if (wh.at === 'rescue') items.push([wh.key, () => drawRescue6(s)]);
    (s.level.checkpoints || []).forEach((cp, i) => { if (!cp.deck && !cp.z) items.push([s.boomPoint(cp).y + 2, () => drawBoom(s, cp, i)]); }); // P6.1: a road leaving the district
    W6.compose(sc, MAIN, DL, {
      cars, layerOf: (c) => c._layer, items,
      car: (c, buf, lift) => { into(buf, () => drawCarSprite(s, c)); if (lift) { c._lift = lift; if (c._top != null) c._top -= lift; } },
      under: () => { drawMarks(); if (lvl === 0) { drawLights(s, mine); cues(); } shadows6(s, cars.filter((c) => !elevOf(c)), false); if (wh.at === 'ground') drawBodyGround(s); }, // P6.1: headlights and cues for the dummy's level only
      bodyOn: wh.at === 'layer' ? wh.layer : null, bodyKey: wh.key,
      body: (buf, lift) => { into(buf, () => { drawBodyGround(s, 0); drawBodySprite(s, false, 0); }); if (b._sy != null) b._sy -= lift; },
      layerUnder: (l, buf, lcars, me) => into(buf, () => {
        (s.level.checkpoints || []).forEach((cp, i) => { if ((cp.deck && l.dk && l.dk.off === cp.off && l.z === cp.z) || (cp.hill && l.hill)) drawBoom(s, cp, i); }); // a highway or hill street leaving the district
        if (l === cueLayer) drawLights(s, lcars.filter((c) => elevOf(c) === lvl)); shadows6(s, lcars, me ? true : 'no'); if (l === cueLayer) cues(); }),
    });
    { const dm = sc.dummyMonument; if (dm && dm.shroud && s.monumentShrouded?.()) PIX.blit(FB, dm.shroud, dm.x, dm.y); } // Edit 94 (P7.13): the circus's monument, shrouded until B2 clears
    drawStoryFence(s); // Edit 81: a tile in test is fenced
    for (const c of cars) { ghost(carSpr(s, c, c._brk), c.x / U, c.y / U - (c._lift || 0)); relight(c); } // x-ray: a checker of each actor's own pixels, so an occluded car or dummy still reads
    if (b.alive && b._spr) ghost(b._spr, b._sx, b._sy);
    if (b.alive && b.held) { const p = s.releasePoint(), n = s.carriedCones().length; for (let i = 0; i < n; i++) PIX.blit(FB, PIX.CONE, p.x / U, p.y / U - 4 - 3 * i - bodyLift(s)); } // Edit 78: a stack
    for (const c of mine) drawCarMarks(s, c);
    if (b.mode !== 'rescue') drawNose(s);
    drawEffects(s); drawRingsStreaks(); drawParts(s);
    for (const d of s.drawDrones()) { // P6.1 (D37): the rescue drone flies in from the edge, then carries the dummy below it
      const rs = s.rescue, mine = d.rescue && rs && rs.drone === d, deliv = mine && (rs.gift || rs.given !== undefined);
      const held = mine && (rs.phase === 'lift' || rs.phase === 'carry' || rs.phase === 'in' || rs.phase === 'drop' || rs.phase === 'give'); // Edit 83: the ferry's 'in'; Edit 84: 'give'
      if (!held) { // Edit 84: a drone with a gift flies high, the module hanging under it, glowing
        if (!deliv) { drawDrone(s, d); continue; }
        drawDrone(s, Object.assign({}, d, { alt: GIFT_ALT / 4 }));
        if (rs.gift) { const x = Math.round(d.x / U), y = Math.round(d.y / U) - GIFT_ALT; PIX.line(x, y + 2, x, y + 6, (px, py) => FB.put(px, py, K.label)); drawGiftBox(x, y + 11); }
        continue;
      }
      if (rs.phase === 'give') { // Edit 84: the drone hovers and lowers the module onto the dummy on a cable (rs.item 0 → 1)
        const x = Math.round(d.x / U), y = Math.round(d.y / U) - GIFT_ALT, k = rs.item, e = k * k * (3 - 2 * k), by = Math.round(b.y / U) - 9, my = Math.round(y + 11 + (by - y - 11) * e);
        PIX.line(x, y + 2, x, my - 5, (px, py) => FB.put(px, py, K.label)); drawGiftBox(x, my);
        drawDrone(s, Object.assign({}, d, { alt: GIFT_ALT / 4 }));
        continue;
      }
      const dip = rs.given !== undefined && rs.phase === 'lift' ? Math.round((GIFT_ALT - 20) * Math.max(0, 1 - rs.k / 0.3)) : 0; // after a gift: down from the hover to the tether
      const up = rs.up + 20 + dip, x = Math.round(d.x / U), y = Math.round(d.y / U) - up; PIX.line(x, y + 2, x, y + 7 + dip, (px, py) => FB.put(px, py, K.label));
      drawDrone(s, Object.assign({}, d, { y: d.y - up * U + d.alt * 4 * U }));
    }
    for (const c of mine) drawTag(s, c);
    drawBarks(s);
    drawEffects(s, true);
    const fa = app.realT - fx.flash.t0;
    if (fa < fx.flash.dur) { const a = 0.55 * (1 - fa / fx.flash.dur) * (RM ? 0.4 : 1); for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) FB.mix(x, y, K.white, a); }
    if (app.showJumpable) for (const q of s.level.statics) if (q.jumpable) { const x0 = Math.round(q.x / U), y0 = Math.round(q.y / U), x1 = Math.round((q.x + q.w) / U) - 1, y1 = Math.round((q.y + q.h) / U) - 1; for (let x = x0; x <= x1; x++) { FB.put(x, y0, K.label); FB.put(x, y1, K.label); } for (let y = y0; y <= y1; y++) { FB.put(x0, y, K.label); FB.put(x1, y, K.label); } } // Edit 75 (tuning): what a jump clears
    drawStamp(s);
    if (b.alive) { const wear = 1 - b.health / maxHP(s), vf = lowHealth('vignetteFrom', 0.7); if (wear > vf) { const pulse = (0.5 + 0.5 * Math.sin(app.realT * 6)) * (wear - vf) / Math.max(0.05, 1 - vf), band = 8; for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) { const d = Math.min(x, y, AW - 1 - x, AH - 1 - y); if (d >= band) { x = AW - 1 - band; continue; } if ((x + y) % 2 === 0 || d < 3) FB.mix(x, y, K.warn, (0.12 + 0.3 * pulse) * (1 - d / band)); } } }
  }
```