# Task
Write the code for requirement R-UNVEIL. Release tag for comments: `Edit 94 (P7.13)`. Output the blocks your system prompt defines.

# The requirement (with its acceptance probes)
```json
{
 "id": "R-UNVEIL",
 "title": "Unveil the monument with the run's plaque when B2 clears",
 "statement": "Clearing Waterfront B2 unveils the circus's monument. The plaque shows the run: chassis spent, points, best combo, time. The ship and the ending screen follow.",
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
 "spec_gap": "The GDD does not say: how long the unveiling lasts or how the player moves on; whether 'chassis spent' means chassis numbered or chassis written off; where the story-wide best combo is kept; the plaque's text and layout; what a reload during the finale resumes.",
 "impact": "reward",
 "depends_on": [
  "R-SHROUD"
 ],
 "touches": [
  {
   "file": "prototypes/p7/story.js",
   "symbol": "StorySim.checkTerminal, StorySim.continueUnveil, StorySim.step, StorySim.writeOff, StorySim.syncProgress",
   "why": "a new phase 'unveil' before the ending, the plaque data, and progress.bestCombo"
  },
  {
   "file": "prototypes/p6/game.js",
   "symbol": "renderScreen, handleMenus, processEvents",
   "why": "draw the unveiling and plaque; A continues"
  },
  {
   "file": "prototypes/p6/world6.js",
   "symbol": "drawMonument",
   "why": "the monument uncovered"
  }
 ],
 "registry_uses": [],
 "registry_new": [],
 "contract": "When the certifying write-off clears Waterfront B2: progress.complete is true; s.emit('unveil', plaque); s.phase === 'unveil'; s.unveil.plaque = { chassis, points, bestCombo, t }, taken from progress (chassis, points, bestCombo, t). progress.bestCombo is the largest combo of any hit in the story, updated by every impact and by writeOff. s.continueUnveil() leaves 'unveil'. StorySim.step holds in 'unveil' as it does in 'gift'.",
 "probes": [
  {
   "id": "p1",
   "kind": "sim",
   "say": "the certifying write-off reaches phase 'unveil', not the ending at once",
   "expr": "const s = await H.certify({});\nawait H.runTo(s, (x) => x.phase === 'unveil' || x.phase === 'ending', 900);\nreturn { ok: s.phase === 'unveil', detail: 'phase ' + s.phase };"
  },
  {
   "id": "p2",
   "kind": "sim",
   "say": "the plaque carries the run's chassis, points, best combo and time",
   "expr": "const s = await H.certify({ points: 123456, chassis: 40, t: 3600, bestCombo: 7 });\nawait H.runTo(s, (x) => x.phase === 'unveil' || x.phase === 'ending', 900);\nconst p = s.unveil?.plaque, pr = s.story;\nconst ok = !!p && p.chassis === pr.chassis && Math.round(p.points) === Math.round(pr.points) && (pr.bestCombo || 0) >= 7 && p.bestCombo === pr.bestCombo && Math.abs((p.t ?? -1e9) - pr.t) < 5;\nreturn { ok, detail: JSON.stringify(p || null) + ' / progress chassis ' + pr.chassis + ' points ' + Math.round(pr.points) + ' combo ' + pr.bestCombo + ' t ' + pr.t };"
  },
  {
   "id": "p3",
   "kind": "sim",
   "say": "one 'unveil' event; the story is already saved complete (the CERTIFIED stamp)",
   "expr": "const s = await H.certify({});\nawait H.runTo(s, (x) => x.phase === 'unveil' || x.phase === 'ending', 900);\nconst n = H.ev(s, 'unveil').length;\nreturn { ok: n === 1 && s.story.complete === true, detail: 'unveil events ' + n + ', complete ' + s.story.complete };"
  },
  {
   "id": "p4",
   "kind": "sim",
   "say": "progress keeps the best combo of the run's hits",
   "expr": "const s = H.story('monument', H.progress('monument', 'A1'));\nawait H.ready(s);\nH.kill(s, { kind: 'dash', cls: 'sedan', combo: 3 });\nconst b = s.story.bestCombo;\nreturn { ok: b === 3, detail: 'bestCombo ' + b };"
  },
  {
   "id": "p5",
   "kind": "page",
   "say": "in the page, the last write-off at the circus reaches the unveiling",
   "expr": "await G.openStory(await G.certifyProgress({}));\nawait G.lastWriteOff();\nconst ok = await G.waitFor(() => window.__dummies?.sim?.phase === 'unveil', 8000);\nawait G.shot('unveil');\nconst ph = await G.eval(() => window.__dummies?.sim?.phase);\nreturn { ok, detail: 'phase ' + ph };"
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

### EDIT93#9 (rank 93)
## 9 Progression (amends Edit 91 §9)
```markdown
- **Rule — introduce, then test:** a part arrives on the tile whose brief first needs it.
  - No brief needs a part not yet issued.
  - Battery 1 → a dash. Legs → a jump. Hands → a cone. Arms → a push. Battery 2, 3 → a combo ×3 (`story.task.comboHard`).
- **Act I · Monument:** Battery 1 B1 · Hands 1 A2 · Legs 1 B3. Three verbs: dash, cone, jump.
- **Act II · Parkland:** Arms 1 C1 · Legs 2 A3 · Hands 2 A2 · Arms 2 A1 · Battery 2 B2. The push, then a level on every verb.
- **Act III · Waterfront:** Legs 3 B1 · Arms 3 B3 · Battery 3 B2. The last part on the last tile.
- **Pace:** 3 · 5 · 3 parts by act. All 11 at tile 27 (7.11: tile 24).
- **Every jump and push tile brings a level.** Cone tiles: Monument A2 and Parkland A2 bring one; Waterfront A2 uses Hands 2.
- **Unchanged:** every part by drone, with the gift screen; no levels; points are the score; A1 on foot (`damage.bodyHealthOnFoot`).
```
| Part | 7.11 | 7.12 | First brief that needs it |
|---|---|---|---|
| Battery 1 | Monument B1 #2 | Monument B1 #2 | B1 dash |
| Hands 1 | Monument A2 #6 | Monument A2 #6 | A2 cone |
| Legs 1 | Monument C1 #3 | Monument B3 #8 | B3 jump |
| Arms 1 | Monument C3 #9 | Parkland C1 #10 | C1 push |
| Legs 2 | Parkland A3 #14 | Parkland A3 #14 | A3 jump |
| Hands 2 | Parkland B1 #17 | Parkland A2 #15 | A2 cone |
| Arms 2 | Parkland A1 #16 | Parkland A1 #16 | A1 push |
| Battery 2 | Parkland C1 #10 | Parkland B2 #18 | B2 combo ×3 |
| Legs 3 | Waterfront B1 #20 | Waterfront B1 #20 | B1 jump |
| Arms 3 | Waterfront B3 #24 | Waterfront B3 #24 | B3 push |
| Battery 3 | Waterfront A1 #19 | Waterfront B2 #27 | B2 combo ×3 |

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
prototypes/p6/game.js (3283 lines)
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
   1800-1863  function drawLive6
   1804-1808  arrow    cues
   1810-1810  arrow    into
   1811-1811  arrow    meItem
   1866-1866  const    GIFT_BOX
   1867-1872  function drawGiftBox
   1873-1873  function rescueLift
   1874-1882  function drawRescue6
   1883-1889  function drawLoading
   1890-1897  function drawField
   1898-1904  function drawField6
   1905-1913  function blitField
   1915-1931  function drawFieldHD
   1934-1934  arrow    kMin
   1935-1944  function liveBark
   1947-1974  function drawBubblesHD
   1950-1950  arrow    toC
   1952-1952  arrow    hit
   1977-1997  function objective
   1998-2046  function drawMessages
   2005-2005  arrow    fit
   2018-2018  arrow    widthOf
   2019-2019  arrow    lineW
   2022-2022  arrow    fits
   2026-2026  arrow    clip
   2027-2040  arrow    drawItem
   2048-2048  function roadLabel
   2049-2069  function drawFrame
   2072-2092  function playKeys
   2093-2106  function drawKeysPanel
   2107-2107  const    WHERE6
   2109-2112  function whereOf
   2113-2113  function fitTextR
   2114-2114  function fitNumR
   2115-2115  function fitText
   2116-2125  function drawScore
   2126-2138  function drawTopBar
   2140-2168  function drawHUD
   2174-2174  const    MAP_Z
   2177-2180  function mapGeom
   2181-2202  function mapRoads
   2183-2183  arrow    off
   2203-2218  function mapCanvas
   2219-2256  function drawDistrict
   2258-2258  const    PART_NAME
   2260-2264  function partLevels
   2269-2281  function dollMods
   2279-2279  arrow    own
   2282-2290  function dollCanvas
   2291-2303  function partEffects
   2307-2307  const    PART_TAG
   2308-2308  function partReds
   2309-2309  function redText
   2310-2338  function drawBodyPanel
   2341-2341  function veil
   2342-2351  function menuList
   2352-2352  function difficultyHealth
   2353-2358  function endItems
   2359-2359  function quotaOf
   2360-2385  function drawTitle
   2388-2388  arrow    plural
   2389-2393  function storyCursor
   2394-2399  function giftText
   2400-2422  function drawModeTitle
   2425-2429  function slotLines
   2430-2474  function drawSaves
   2475-2480  function nameKeyRects
   2481-2502  function drawNameEntry
   2503-2558  function drawStoryMap
   2518-2518  arrow    at
   2559-2577  function drawBrief
   2582-2587  function sprCanvas
   2588-2601  function giftArtOf
   2594-2594  arrow    mk
   2602-2602  function giftReady
   2603-2670  function drawGiftPopup
   2606-2606  arrow    clamp01
   2671-2678  function drawBriefFoot
   2679-2694  function drawMapFences
   2681-2681  arrow    open
   2682-2682  arrow    seen
   2695-2695  arrow    c32
   2696-2696  const    FENCE
   2697-2706  function drawStoryFence
   2700-2700  arrow    at
   2707-2734  function drawReport
   2735-2774  function drawShop
   2777-2777  const    BADGE
   2779-2796  function abilityStats
   2797-2848  function drawAbilityShop
   2849-2849  const    PART_WORD
   2853-2853  const    WS_POS
   2855-2860  function seatOf
   2861-2861  arrow    wsLocked
   2862-2862  arrow    wsCost
   2863-2869  function wsMove
   2870-2933  function drawWorkshop
   2884-2884  arrow    seatAt
   2935-2960  const    CUE_KEY
   2941-2960  function cueCanvas
   2945-2945  arrow    car
   2946-2946  arrow    loc
   2961-2970  function drawCueKey
   2974-2974  arrow    deviceOf
   2975-2980  function optionItems
   2981-2988  function optionDo
   2989-2989  arrow    controlItems
   2990-3005  function controlRows
   2992-2992  arrow    nm
   3006-3020  function drawControls
   3021-3039  function drawPause
   3040-3055  function drawEnding
   3057-3064  function render
   3065-3084  function renderScreen
   3087-3087  const    MOVE_NAME
   3088-3099  function drawComboMeter
   3100-3107  function drawPadSetup
   3110-3152  const    TUNE
   3160-3164  function current
   3165-3169  function setParam
   3170-3215  function buildTune
   3216-3224  function syncTune
   3225-3225  function toggleTune
   3236-3240  function showTrace
   3244-3244  arrow    done
   3250-3250  function appStatus
   3253-3274  function frame

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
#### prototypes/p7/story.js · StorySim.checkTerminal (lines 288–312) · named by the requirement
```
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
```

#### prototypes/p7/story.js · StorySim.step (lines 169–173) · named by the requirement
```
    step(cmd) {
      if (this.phase === 'brief' || this.phase === 'gift') return;
      super.step(cmd);
      if (this.phase === 'play' && this.pendingBrief && !this.rescue) { this.pendingBrief = false; this.phase = 'brief'; } // after a ferry lands
    }
```

#### prototypes/p7/story.js · StorySim.writeOff (lines 276–287) · named by the requirement
```
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
```

#### prototypes/p7/story.js · StorySim.syncProgress (lines 320–324) · named by the requirement
```
    syncProgress() {
      const pr = this.story, r = this.run;
      pr.owned = Object.assign({}, r.owned); pr.credits = r.credits; pr.points = r.points; pr.chassis = r.chassis;
      pr.writeOffs = this.totalWriteOffs(); pr.t = +(this.tOffset + this.t).toFixed(2); pr.milestones = Object.assign({}, this.milestones);
    }
```

#### prototypes/p6/game.js · renderScreen (lines 3065–3084) · named by the requirement
```
  function renderScreen() {
    HITS.length = 0; // Edit 89: this frame's tap targets
    drawFrame();
    if (app.screen === 'title') { if (STORY) drawModeTitle(); else drawTitle(); return; }
    if (app.screen === 'arcade') { drawTitle(); return; } // Edit 81
    if (app.screen === 'storymap') { drawStoryMap(); return; }
    if (app.screen === 'saves') { drawSaves(); return; } // Edit 88
    if (app.screen === 'loading') { drawLoading(); return; }
    const s = app.sim;
    drawField(s);
    drawHUD(s);
    drawComboMeter(s);
    if (app.paused) { if (!app.touchEdit) drawPause(s); } // Edit 87: placing the touch controls shows the game, dimmed, not the menu
    else if (s.phase === 'brief') drawBrief(s); // Edit 81: the tile card
    else if (s.phase === 'gift') drawGiftPopup(s); // Edit 84
    else if (s.phase === 'report') drawReport(s);
    else if (s.phase === 'shop') drawShop(s);
    else if (s.phase === 'ending') drawEnding(s);
    drawPadSetup();
  }
```

#### prototypes/p6/game.js · handleMenus (lines 978–1086) · named by the requirement
```
  function handleMenus() {
    const s = app.sim;
    const live = app.screen === 'game' && !app.paused && s && (s.phase === 'play' || s.phase === 'hitstop' || s.phase === 'writeoff' || s.phase === 'scroll');
    if (live) {
      for (const m of menuQ) if (m === 'pause' && s.phase === 'play') { app.paused = true; app.pauseSel = 0; app.confirmRefuse = false; app.pausePage = null; }
      menuQ.length = 0;
      return;
    }
    if (app.screen === 'loading') { menuQ.length = 0; return; }
    while (menuQ.length) {
      const m = menuQ.shift();
      if (app.screen === 'title' && STORY) { // Edit 81: ARCADE or STORY. Edit 88: STORY opens the save screen
        const items = titleItems();
        if (m === 'up' || m === 'left') app.titleSel = (app.titleSel + items.length - 1) % items.length;
        else if (m === 'down' || m === 'right') app.titleSel = (app.titleSel + 1) % items.length;
        else if (m === 'ok') { if ((items[app.titleSel] || 'ARCADE') === 'ARCADE') { app.mode = 'arcade'; app.screen = 'arcade'; } else toSaves(); }
        continue;
      }
      if (app.screen === 'saves') { if (app.nameEntry) nameMenu(m); else savesMenu(m); if (app.screen !== 'saves') return; continue; } // Edit 88
      if (app.screen === 'storymap') { // Edit 81: the Test City; the cursor reads any tile's tale; A deploys to the tile in test
        const cur = app.mapSel || storyCursor(), pr = app.story;
        if (m === 'back') { toSaves(); continue; } // Edit 88: back to the save screen
        if (m === 'left' || m === 'right') app.mapSel = [(cur[0] + (m === 'right' ? 1 : 8)) % 9, cur[1]];
        else if (m === 'up' || m === 'down') app.mapSel = [cur[0], (cur[1] + (m === 'down' ? 1 : 2)) % 3];
        else if (m === 'ok' && pr && !pr.complete) { startStory(); return; }
        continue;
      }
      if (app.screen === (STORY ? 'arcade' : 'title')) {
        if (m === 'back' && STORY) { app.screen = 'title'; continue; }
        if (m === 'up') app.level = (app.level + LEVEL_LIST.length - 1) % LEVEL_LIST.length;
        else if (m === 'down') app.level = (app.level + 1) % LEVEL_LIST.length;
        else if (m === 'left') app.difficulty = Math.max(0, app.difficulty - 1);
        else if (m === 'right') app.difficulty = Math.min(DIFFICULTIES.length - 1, app.difficulty + 1);
        else if (m === 'ok') { startLevel(app.level); return; }
        continue;
      }
      if (app.paused && app.touchEdit) { if (m === 'pause' || m === 'back' || m === 'ok') touchEditEnd(); continue; } // Edit 87: placing the touch controls
      if (app.paused && app.pausePage) { // Edit 86: a page of the pause menu (Options, Controls); B or ESC returns
        if (m === 'pause' || m === 'back') { app.pausePage = null; continue; }
        if (app.pausePage === 'controls') { // Edit 87: on touch, adjust or reset the layout here
          const CI = controlItems();
          if (m === 'up') app.ctlSel = ((app.ctlSel || 0) + CI.length - 1) % CI.length;
          else if (m === 'down') app.ctlSel = ((app.ctlSel || 0) + 1) % CI.length;
          else if (m === 'ok') { const it = CI[app.ctlSel || 0]; if (it === 'Adjust layout') touchEditStart(); else if (it === 'Reset layout') { app.touchCfg = null; saveTouchCfg(); TOUCH.L = null; toast('Touch controls reset'); } else app.pausePage = null; }
          continue;
        }
        const OI = optionItems();
        if (m === 'up') app.optSel = (app.optSel + OI.length - 1) % OI.length;
        else if (m === 'down') app.optSel = (app.optSel + 1) % OI.length;
        else if (m === 'ok') optionDo(OI[app.optSel]);
        continue;
      }
      if (app.paused) {
        const PI = pauseItems();
        if (m === 'up') { app.pauseSel = (app.pauseSel + PI.length - 1) % PI.length; app.confirmRefuse = false; }
        else if (m === 'down') { app.pauseSel = (app.pauseSel + 1) % PI.length; app.confirmRefuse = false; }
        else if (m === 'pause' || m === 'back') { app.paused = false; }
        else if (m === 'ok') {
          const item = PI[app.pauseSel];
          if (item === 'Resume') app.paused = false;
          else if (item === 'Story map') { toStoryMap(); return; }
          else if (item === 'Restart level') { startLevel(app.level); return; }
          else if (item === 'Refuse testing') {
            if (s.run.writeOffs < 1) toast(copy('toast.refusal-locked', 'Refusal opens after one completed body'));
            else if (!app.confirmRefuse) app.confirmRefuse = true;
            else { s.withdraw(); app.paused = false; }
          } else if (item === 'Show trace') showTrace();
          else if (item === 'Options') { app.pausePage = 'options'; app.optSel = 0; }
          else if (item === 'Controls') { app.pausePage = 'controls'; app.ctlSel = 0; }
          else if (item === 'Quit to title') { if (app.mode === 'story') saveStory(); app.screen = 'title'; app.sim = null; app.paused = false; }
        }
        continue;
      }
      if (!s) continue;
      if (s.phase === 'brief' && m === 'ok') { s.continueBrief(); clearEdges(); return; } // Edit 81: the tile card
      if (s.phase === 'gift') { if (m === 'ok' && giftReady()) { s.continueGift(); fx.gift = null; clearEdges(); Snd.tone(660, 990, 0.1, 'triangle', 0.05); return; } continue; } // Edit 84: the gift screen
      if (s.phase === 'report' && m === 'ok') s.continueReport();
      else if (s.phase === 'shop') {
        const nc = SHOP_GRID.length, colLen = () => SHOP_GRID[app.shopCol].length;
        if (STORY && ABIL4 && (m === 'left' || m === 'right' || m === 'up' || m === 'down')) wsMove(m); // Edit 89: the workshop, around the chassis
        else if (m === 'left' || m === 'right') { app.shopCol = (app.shopCol + (m === 'right' ? 1 : -1) + nc) % nc; if (app.shopRow < SHOP_ROWS && app.shopRow >= colLen()) app.shopRow = colLen() - 1; }
        else if (m === 'up') app.shopRow = app.shopRow === SHOP_ROWS ? colLen() - 1 : Math.max(0, app.shopRow - 1);
        else if (m === 'down') app.shopRow = app.shopRow + 1 >= colLen() ? SHOP_ROWS : app.shopRow + 1;
        else if (m === 'back') { s.leaveShop(); clearEdges(); return; }
        else if (m === 'ok') {
          if (app.shopRow === SHOP_ROWS) { s.leaveShop(); clearEdges(); return; }
          if (ABIL) { const t = SHOP_GRID[app.shopCol][0], n = nextLevel(s, t); if (n) s.buy(n); else s.emit('purchase-denied', { node: t, why: 'max' }); }
          else s.buy(SHOP_GRID[app.shopCol][app.shopRow]);
        }
      } else if (s.phase === 'ending') {
        const items = endItems(s);
        if (m === 'up') app.endSel = (app.endSel + items.length - 1) % items.length;
        else if (m === 'down') app.endSel = (app.endSel + 1) % items.length;
        else if (m === 'ok') {
          const it = items[app.endSel];
          if (it === 'Retry this district') { const rs = app.roads.slice(); startLevel(app.level, app.roadCarry); app.roads = rs; return; }
          if (it === 'Play this district again') { startLevel(app.level); return; } // Edit 81: Arcade, one district a run
          if (it === 'Story map') { toStoryMap(); return; }
          if (it === 'Quit to title') { app.screen = 'title'; app.sim = null; return; }
          if (it === 'Play again from district 1') { startLevel(0); return; }
          if (it === 'Choose a district') { app.screen = STORY ? 'arcade' : 'title'; app.sim = null; return; }
          if (it === 'Replay this level') { startLevel(app.level); return; }
          if (it === 'Choose another level') { app.screen = 'title'; app.sim = null; return; }
          showTrace();
        }
      }
    }
    q.a = q.b = q.bUp = 0;
  }
```

#### prototypes/p6/game.js · processEvents (lines 823–949) · named by the requirement
```
  function processEvents() {
    const s = app.sim;
    if (!s) return;
    if (fx.pendingLearned && fx.cars.has(fx.pendingLearned.car)) { const pl = fx.pendingLearned; fx.pendingLearned = null; present(s, 'learned', pl); }
    const ev = s.events;
    trackCars(s);
    for (let i = app.lastEv; i < ev.length; i++) {
      const e0 = ev[i];
      if (e0.away) continue; // P5.3: traffic on another screen makes no sound or effect here
      if (e0.type === 'lunge') fx.lungeWatch = { contact: false };
      if (/^(impact|knock|touch|touch-spent|contact-ignored)$/.test(e0.type)) noteContact(e0);
      if (e0.type === 'impact') { fx.lastImpact = e0; if (e0.part) fx.lastPart = { part: e0.part, lost: e0.lost, t: app.realT }; }
      if (e0.type === 'purchase') fx.pendingNodes.push(e0.node); // node id, as the fleet database keys it
      if (e0.type === 'chassis' && fx.pendingNodes.length) { fx.upgradeWatch = fx.pendingNodes[fx.pendingNodes.length - 1]; fx.pendingNodes = []; }
      const e = enrich(e0);
      const hj = hitJuice(e, s);
      const juiced = hj.done || juice(e0, s);
      // P3: barks are not drawn. A legible bubble at ui.typeSecondary would cover the 400 × 300 field.
      // Lore tied to state (D23): a car that notices the dummy remarks on a new module or a broken part;
      // a model that learned returns and says so. Lines come from the fleet database.
      const notices = e.car && ((e0.type === 'commit' && e0.cause === 'body') || (e0.type === 'honk' && e0.at === 'body'));
      if (FLEET && notices && fx.upgradeWatch) {
        const node = fx.upgradeWatch; fx.upgradeWatch = null;
        fx.carBarkT.delete(e.car); fx.barkT = -9;
        present(s, 'upgrade-seen', { car: e.car, node });
      } else if (FLEET && notices && fx.partWatch) {
        const part = fx.partWatch; fx.partWatch = null;
        fx.carBarkT.delete(e.car); fx.barkT = -9;
        present(s, 'part-seen', { car: e.car, part });
      }
      if (e0.type === 'learn-standoff') fx.learnWatch.set(e0.model, { from: e0.from, to: e0.to });
      if (e0.type === 'admit' && fx.learnWatch.has(e0.model)) { const lw = fx.learnWatch.get(e0.model); fx.learnWatch.delete(e0.model); fx.pendingLearned = { car: e0.car, from: lw.from, to: lw.to }; }
      if (e0.type === 'impact' && e0.part && s.body.alive) { const lv = partLevels(s)[e0.part]; if (lv >= 3 && !fx.partsSeen.has(e0.part)) { fx.partsSeen.add(e0.part); fx.partWatch = e0.part; } }
      if (e0.type === 'chassis') { fx.partsSeen.clear(); fx.partWatch = null; }
      if (FLEET && e.car) barkLine(e, s);
      switch (e0.type) {
        case 'lunge': {
          if (!hj.sound) Snd.tone(220, 90, 0.12, 'triangle', 0.12);
          if (!juiced) { kick(1.5, 0.1); const b = s.body; puff(b.x, b.y, 7, { type: 'dust', dir: b.facing + Math.PI, spread: 1.4, speed: 60, life: 0.45, size: 4 }); }
          break;
        }
        case 'impact': {
          const k = Math.min(1, e.assessed / 500);
          if (!hj.sound) { Snd.tone(160, 40, 0.28 + 0.2 * k, 'sawtooth', 0.08 + 0.12 * k); Snd.tone(900, 240, 0.07, 'square', 0.05); }
          if (!juiced) {
            kick(3 + 9 * k, 0.25 + 0.2 * k); fx.flinchT0 = app.realT; fx.carPulse.set(e.car, app.realT);
            const b = s.body; puff(b.x, b.y, 8 + Math.round(10 * k), { type: 'spark', speed: 160, life: 0.35, size: 2 });
          }
          break;
        }
        case 'knock': { if (!juiced) { const b = s.body; puff(b.x, b.y, 5, { type: 'dust', speed: 50, life: 0.4, size: 3 }); } break; }
        case 'touch-spent': if (!hj.sound) Snd.tone(260, 240, 0.06, 'sine', 0.06); if (!juiced) kick(1, 0.1); toast(copy('toast.touch-spent', 'Spent car — no reward')); break;
        case 'honk': if (e.at === 'body') horn(); else Snd.tone(880, 880, 0.05, 'sine', 0.03); fx.horn.set(e.car, app.realT); break;
        case 'learn-standoff': Snd.tone(330, 260, 0.12, 'triangle', 0.05); toast(copy('toast.learn-standoff', '{model} now stops {metres} m back', { model: e.model, metres: (e.to / s.P['proto.scale.unitsPerMetre']).toFixed(1) })); break;
        case 'unstick': if (e.how === 'reverse') { Snd.tone(1000, 1000, 0.06, 'square', 0.03); Snd.tone(1000, 1000, 0.06, 'square', 0.03, 0.25); } break;
        case 'drone-dispatch': Snd.tone(150, 210, 0.6, 'sawtooth', 0.025); toast(e.rescue ? copy('toast.rescue-dispatch', 'FARSIGHT drone dispatched: chassis in the river') : copy('toast.drone-dispatch', 'FARSIGHT drone dispatched to clear a cone')); break;
        case 'drone-pickup': Snd.tone(320, 200, 0.08, 'square', 0.05); break;
        case 'drone-drop': Snd.tone(240, 150, 0.1, 'square', 0.05); break;
        case 'chassis': fx.dropT0 = app.realT; fx.lastPart = null; break;
        case 'writeoff': {
          if (!hj.sound) [392, 311, 233, 155].forEach((f, j) => Snd.tone(f, f * 0.98, 0.16, 'square', 0.07, j * 0.11));
          if (!juiced) {
            kick(14, 0.6); fx.flash.t0 = app.realT; fx.flash.dur = 0.18; fx.stampT0 = app.realT;
            const b = s.body; puff(b.x, b.y, 24, { type: 'spark', speed: 220, life: 0.5, size: 2.5 }); puff(b.x, b.y, 10, { type: 'smoke', speed: 30, life: 1.2, size: 8 });
          }
          break;
        }
        case 'denied': Snd.tone(120, 110, 0.05, 'square', 0.05); Snd.tone(120, 110, 0.05, 'square', 0.05, 0.08); if (!(e.action === 'lunge' && fx.slipT === e.t)) toast(STORY && e.why === 'locked' ? 'Not fitted yet' : e.why ? DENY_TEXT[e.action + '.' + e.why] || 'Denied' : copy('denied.' + e.action, DENY_TEXT[e.action] || 'Denied')); break; // Edit 90: a locked verb is not named
        case 'jump': { if (e.clear === false && !fx.hopTold) { fx.hopTold = true; toast('A hop clears nothing. Run, then jump.'); } /* Edit 77 */ Snd.tone(330, e.kind === 'dash' ? 880 : 660, e.kind === 'dash' ? 0.18 : 0.12, 'triangle', 0.08); const b = s.body; puff(b.x, b.y + 6, e.kind === 'dash' ? 10 : 6, { type: 'dust', speed: 55, life: 0.35, size: 3 }); if (e.kind === 'dash' && !fx.longJumpSeen) { fx.longJumpSeen = true; toast('Long jump: B during a dash carries its speed'); } break; } // Edit 75–76
        case 'jump-land': { Snd.tone(160, 90, 0.08, 'square', 0.05); const b = s.body; puff(b.x, b.y + 6, 5, { type: 'dust', speed: 45, life: 0.3, size: 3 }); break; }
        case 'rail-jump': Snd.tone(520, 880, 0.1, 'triangle', 0.06); toast('Over the rail'); break;
        case 'combo': [660, 880, 1100].slice(0, Math.min(3, e.n)).forEach((f, j) => Snd.tone(f, f * 1.2, 0.08, 'triangle', 0.08, j * 0.06)); kick(2 + e.n, 0.18); toast('COMBO ' + e.n + (e.kinds && e.kinds.length > 1 ? ' · ' + e.kinds.map((k) => MOVE_NAME[k] || k).join(' › ') : '') + ' · ×' + e.mult + ' · +' + num(e.bonus)); break;
        case 'combo-end': Snd.tone(523, 784, 0.12, 'triangle', 0.06); toast('COMBO BANKED · ' + e.n + ' hits · ×' + e.mult + ' · ' + num(e.points)); break; // Edit 79
        case 'hitch': Snd.tone(300, 420, 0.08, 'square', 0.05); if (!fx.hitchTold) { fx.hitchTold = true; toast('Hitched. X lets go; A slings you off with a dash.'); } break;
        case 'sling': Snd.tone(420, 900, 0.14, 'triangle', 0.08); kick(3, 0.15); break;
        case 'push': { Snd.tone(360, 820, 0.12, 'triangle', 0.08); kick(3, 0.15); const b = s.body; puff(b.x, b.y, 6, { type: 'spark', speed: 80, life: 0.25, size: 2 }); break; } // Edit 80
        case 'cone-hit': Snd.tone(900, 600, 0.08, 'square', 0.06); toast('CONE HIT' + (e.n > 1 ? ' · COMBO ' + e.n + ' · ×' + e.mult : '') + ' · +' + num(e.points)); break;
        case 'slip': { fx.slipT = e.t; const b = s.body; puff(b.x, b.y + 8, 8, { type: 'spark', role: 'puddleHi', speed: 90, life: 0.3, size: 2 }); toast(copy('toast.slip', 'No dash on water. Step off the puddle.')); break; } // D18
        case 'skid': { const c = carsOf(s).find((q) => q.id === e.car); if (c) puff(c.x, c.y, 10, { type: 'spark', role: 'puddleHi', dir: c.h + Math.PI, spread: 2.2, speed: 120, life: 0.35, size: 2 }); Snd.tone(1800, 900, 0.18, 'sawtooth', 0.02); break; }
        case 'screen': { // D24: first visit names the screen
          Snd.tone(300, 520, 0.12, 'triangle', 0.04);
          if (!fx.seenScreens.has(e.to)) { fx.seenScreens.add(e.to); toast(e.to + ' · ' + (THEME_NAME[e.focal || e.theme] || e.landmark || '') + (e.turns === 'diagonal' ? ' · 45° road' : '')); } // P4: generated screen names were checked against P3's layouts, so P4 shows the screen's theme
          break;
        }
        case 'purchase': [523, 659, 784].forEach((f, j) => Snd.tone(f, f, 0.1, 'triangle', 0.07, j * 0.07)); Snd.tone(150, 60, 0.18, 'square', 0.06, 0.02); fx.fit = { node: e.node, t0: app.realT }; toast(e.unit === 'upgrade' ? NODE(e.node).name + ' fitted' + (e.upgrades ? ' · ' + e.upgrades + ' upgrade' + (e.upgrades === 1 ? '' : 's') + ' left' : '') : copy('toast.purchase', '{node} installed', { node: NODE(e.node).name })); break; // Edit 89: the fit lands on the workshop's chassis
        case 'purchase-denied': Snd.tone(180, 140, 0.12, 'square', 0.04); toast(e.why === 'max' ? 'That part is at its top level' : /^gift/.test(e.why) ? 'A Farsight drone brings that part' : e.why[0].toUpperCase() + e.why.slice(1)); break; // Edit 89
        case 'held': Snd.tone(240, 200, 0.16, 'square', 0.05); toast('Not the brief: chassis held at ' + num(e.health)); break; // Edit 91: a miss of the brief does not write the chassis off
        case 'shop-open': if (STORY && ABIL4) { const k = SHOP_GRID.findIndex((g) => { const n = nextLevel(s, g[0]); return n && s.canBuy(n).ok; }); app.shopCol = Math.max(0, k); app.shopRow = k >= 0 ? 0 : SHOP_ROWS; fx.fit = null; } break; // Edit 89: the workshop opens on a part an upgrade fits
        case 'pickup': Snd.tone(700, 950, 0.05, 'triangle', 0.06); if (ABIL && s.coneCapacity() > 1) toast('Cones ' + (e.n || 1) + ' / ' + s.coneCapacity()); break;
        case 'drop': Snd.tone(500, 380, 0.06, 'triangle', 0.05); break;
        case 'stair': Snd.tone(260, 300, 0.05, 'triangle', 0.03); break;
        case 'level': { // Edit 42, 44: first time up says what the level does
          const f = s.level.floors && s.body.floor != null ? s.level.floors[s.body.floor] : null, kind = f ? f.kind : null, key = 'level' + e.level + (kind === 'deck' ? '' : kind || '');
          if (e.level > 0 && kind !== 'bridge' && !fx.seenScreens.has(key)) {
            fx.seenScreens.add(key);
            if (LEVEL6[kind]) toast(place('levels.' + kind) || LEVEL6[kind]); // P6: walkways, the hill, terraces, the ring
            else toast(kind === 'roof' ? place('levels.roof') || copy('toast.roof', 'Roof: no traffic up here. Step off a ledge to drop on a car below.')
              : e.level === 2 ? place('levels.z2Highway') || copy('toast.highway', 'High highway: fast traffic. A broken parapet is a long drop to the street.')
              : place('levels.z1') || copy('toast.deck', 'Low highway: traffic up here. A broken parapet drops you to the road.'));
          }
          break;
        }
        case 'deck-drop': if (!hj.sound) Snd.tone(700, 200, 0.3, 'triangle', 0.06); break;
        case 'splash': { Snd.noise(900, 200, 0.4, 0.08); puff(e.x, e.y, 12, { type: 'spark', role: 'puddleHi', speed: 90, life: 0.45, size: 2 }); break; } // P6 (D37): into the river
        case 'rescued': Snd.tone(320, 480, 0.12, 'triangle', 0.05); toast(copy('toast.rescued', 'FARSIGHT drone: chassis recovered from the river')); break;
        case 'land': { const b = s.body; if (!hj.sound) Snd.tone(110, 80, 0.12, 'square', 0.06); if (!hj.done) { puff(b.x, b.y + 6, 8, { type: 'dust', speed: 70, life: 0.4, size: 3 }); if (!e.car) kick(2, 0.12); } break; } // generated drop juice replaces the stub
        case 'throw': Snd.tone(620, 180, 0.16, 'triangle', 0.07); break;
        case 'punt': Snd.tone(420, 300, 0.05, 'triangle', 0.04); break;
        case 'story-enter': [392, 523, 659].forEach((f, j) => Snd.tone(f, f, 0.1, 'triangle', 0.05, j * 0.08)); break; // Edit 81
        case 'story-count': Snd.tone(660, 990, 0.12, 'triangle', 0.07); toast('COUNTED · ' + e.tile + ' ' + e.n + ' / ' + e.need); break;
        case 'story-miss': Snd.tone(200, 150, 0.12, 'square', 0.05); toast(e.why === 'task' ? 'NOT COUNTED · the brief wants ' + STORY.taskText(STORY.tileOf(s.levelId, e.tile).task, s.P).label.toLowerCase() : e.why === 'cleared' ? 'NOT COUNTED · ' + e.tile + ' is already cleared' : 'NOT COUNTED · ' + e.tile + ' is not in test'); break;
        case 'story-clear': [523, 659, 784, 1046].forEach((f, j) => Snd.tone(f, f, 0.14, 'triangle', 0.07, j * 0.09)); toast('TILE ' + e.tile + ' CLEARED' + (e.next ? ' · ' + e.next + ' OPEN' : '')); break;
        case 'story-gift': if (!e.node) toast('FARSIGHT GIFT · +' + plural(e.credits, 'CREDIT')); break; // Edit 84: a verb has its own screen
        case 'story-ferry': Snd.tone(150, 210, 0.6, 'sawtooth', 0.025); if (e.gift) giftChime(); toast(e.gift ? 'FARSIGHT DRONE · ' + NODE(e.gift).name.toUpperCase() + ' ON BOARD · THEN ' + e.to : 'FARSIGHT DRONE · CARRYING YOU TO ' + e.to); break; // Edit 83
        case 'story-deliver': case 'arcade-deliver': Snd.tone(150, 210, 0.6, 'sawtooth', 0.025); giftChime(); toast('FARSIGHT DRONE · DELIVERING ' + NODE(e.node).name.toUpperCase()); break; // Edit 84
        case 'gift': fx.gift = { node: e.node, t0: app.realT }; giftFanfare(Math.max(0.1, pv('ui.gift.fallSeconds'))); break; // Edit 84: the gift screen
        case 'delivered': Snd.tone(320, 480, 0.12, 'triangle', 0.05); break;
        case 'story-ferried': Snd.tone(240, 150, 0.1, 'square', 0.05); break;
        case 'story-fence': Snd.tone(140, 120, 0.08, 'square', 0.05); toast(e.cleared ? 'Fence: ' + e.to + ' is not yet surveyed' : 'Fence: clear ' + e.tile + ' first (' + s.story.tileWO + ' / ' + STORY.needOf(s.levelId, e.tile, s.P) + ')'); break;
        case 'ending': if (e.kind === 'Licensed' || e.kind === 'Certified') [523, 659, 784, 1046].forEach((f, j) => Snd.tone(f, f, 0.16, 'triangle', 0.07, 1.1 + j * 0.09)); break;
        default: break;
      }
    }
    if (s.storyMode) for (let i = app.last
/* … excerpt cut … */
```

#### prototypes/p6/world6.js · drawMonument (lines 612–621) · named by the requirement
```
  function drawMonument(Bf, cx, cy) {
    const x0 = Math.round(cx / U), y0 = Math.round(cy / U), Ht = 58;
    for (let t = 0; t < 40; t++) for (let j = -4; j <= 4; j++) Bf.shade(x0 - t * 0.7 + j * 0.7, y0 + t * 0.7 + j * 0.7, 0.75);
    for (const [rx, ry, lift, c] of [[16, 7, 0, N.stoneD], [13, 6, 2, N.stone], [10, 5, 4, N.stoneL]]) PIX.ellipse(x0, y0 - lift, rx, ry, (x, y) => Bf.put(x, y, c));
    for (let h = 4; h < Ht; h++) for (let i = -4; i <= 4; i++) { const u = i / 4.5; Bf.put(x0 + i, y0 - h, h % 10 === 0 ? N.stoneD : u < -0.4 ? N.stoneL : u < 0.4 ? N.stone : N.stoneD); }
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j <= 5) Bf.put(x0 + i, y0 - Ht + 8 + j, i * i + j * j <= 1 ? K.white : N.cyan);
    for (let h = 0; h < 6; h++) for (let i = -5 + Math.floor(h / 2); i <= 5 - Math.floor(h / 2); i++) Bf.put(x0 + i, y0 - Ht - h, h < 2 ? N.stoneD : N.stoneL);
    for (let h = 6; h < 12; h++) Bf.put(x0, y0 - Ht - h, h > 9 ? N.cyan : N.stoneL);
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, lx = Math.round(x0 + Math.cos(a) * 20), ly = Math.round(y0 + Math.sin(a) * 9); for (let h = 0; h < 6; h++) Bf.put(lx, ly - h, K.jerseyTop); Bf.put(lx, ly - 6, K.white); }
  }
```

#### prototypes/p6/sim.js · Sim.spawnBody (lines 1654–1666) · retrieved (73.076)
```
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

#### prototypes/p6/sim.js · Sim.checkTerminal (lines 3295–3310) · retrieved (67.245)
```
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

#### prototypes/p6/game.js · slotLines (lines 2425–2429) · retrieved (65.267)
```
  function slotLines(v) {
    const pr = v.progress, cl = STORY.clearedCount(pr), t = pr.complete ? null : STORY.activeTile(pr, pr.district);
    return [pr.complete ? 'CERTIFIED · ALL ' + STORY.TOTAL + ' TILES' : INFO(pr.district).name.toUpperCase() + ' · ' + t + ' · TILE ' + STORY.tileNumber(pr.district, t) + ' OF ' + STORY.TOTAL + (pr.tileWO ? ' · ' + pr.tileWO + ' OF ' + STORY.needOf(pr.district, t) + ' WRITE-OFFS' : ''),
      cl + ' / ' + STORY.TOTAL + ' TILES · ' + num(pr.points || 0) + ' POINTS · ' + STORY.partsOwned(pr.owned) + ' / ' + STORY.VERBS.length + ' PARTS · CHASSIS ' + String(pr.chassis || 0).padStart(2, '0')]; // Edit 91: parts, not levels
  }
```

#### prototypes/p6/sim.js · Sim.writeOff (lines 3277–3285) · retrieved (59.146)
```
    writeOff() {
      const P = this.P, b = this.body;
      b.alive = false; b.mode = 'dead'; b.vx = b.vy = 0;
      this.run.writeOffs++; this.run.points += P['rewards.writeOff'];
      this.releaseHeldAtDeath();
      this.emit('writeoff', { chassis: b.chassis, writeOffs: this.run.writeOffs });
      this.mile('firstWriteOff');
      this.effects.push({ type: 'wreck', x: b.x, y: b.y, t: this.t, facing: b.facing, layer: b.level });
    }
```