# Task
Write the code for requirement R-CRATE-FACES. Release tag for comments: `Edit 94 (P7.13)`. Output the blocks your system prompt defines.

# The requirement (with its acceptance probes)
```json
{
 "id": "R-CRATE-FACES",
 "title": "Put the dummy's face on every crate of the ship",
 "statement": "Every crate on the container ship at Waterfront B3 carries the dummy's face.",
 "sources": [
  "EDIT92#3.2:1",
  "EDIT92#7"
 ],
 "gdd_status": "proposed",
 "decision": "D76",
 "spec": "partial",
 "spec_gap": "The GDD does not say whether the faces show from the start or only in the finale, or which face art is used (the welcome wall's face is the nearest match). Under the tile-art rule the faces are cosmetic only.",
 "impact": "content",
 "depends_on": [],
 "touches": [
  {
   "file": "prototypes/p6/world6.js",
   "symbol": "containerShip",
   "why": "draw the face on each crate; expose the ship on the scene"
  }
 ],
 "registry_uses": [
  "world.storyArt"
 ],
 "registry_new": [],
 "contract": "H.scene(s, 'B3').containerShip = { x, y, crates, face: true } in Story's Waterfront under world.storyArt. Cosmetic only: no solid, floor, stair, spawn or cone home changes. The 6.10 world has no containerShip.",
 "probes": [
  {
   "id": "p1",
   "kind": "sim",
   "say": "Story's Waterfront B3 ship marks its crates with the face",
   "expr": "const s = H.story('waterfront', H.progress('waterfront', 'B3'));\nconst sh = H.scene(s, 'B3')?.containerShip;\nreturn { ok: !!sh && sh.face === true && (sh.crates || 0) > 0, detail: JSON.stringify(sh || null) };"
  },
  {
   "id": "p2",
   "kind": "sim",
   "say": "guard: with the ship exposed, 6.10's Waterfront has no ship",
   "expr": "const s = H.story('waterfront', H.progress('waterfront', 'B3'));\nconst has = !!H.scene(s, 'B3')?.containerShip;\nconst s6 = H.sim6('waterfront');\nconst six = !!H.scene(s6, 'B3')?.containerShip;\nreturn { ok: has && !six, detail: 'story ' + has + ', 6.10 ' + six };"
  }
 ]
}
```

# GDD text
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
- R-VOYAGE (Fly the dummy over the river to the ship at Waterfront B3): - story.js: `continueUnveil()` now starts the voyage instead of ending at once. `startVoyage()` puts the dummy back on its feet with full health, so the voyage cannot end as a write-off. It sets `s.rescue = droneTo(…, { voyage: true, … })`, sets phase 'voyage' and emits 'voyage' { from: 'B2', to: 'B3' } (p1, p4).
- The drone uses `droneTo`, so it flies at `proto.droneSpeed` and lifts over `proto.droneLiftSeconds`. On each frame, `step` treats 'voyage' as 'play' for that frame, as the proven ferry flight does, then sets 'voyage' back. `stepRescue` hands a voyage to `stepVoyage`.
- `stepVoyage` steps through inbound, lift, carry over the south edge (`flip` to B3), in to the ship, then drop. On landing it emits one 'voyage-end' and calls `end('Certified')`. The dummy is alive, so the phase goes straight to 'ending' (p2).
- ArcadeSim has no unveil, so it is unchanged (p3). game.js `drawRescue6` no longer draws water ripples under the voyage.
- Risk: I could not see where `containerShip` is placed. The drone flies to `this.sc.ship` if the scene has it, or else to the centre of B3. world6.js is unchanged. Check the `voyage` screenshot.
- R-BARK-TILE (Barks name the tile, not the district): game.js: a new `barkPlace(sim)` returns the place word for barks. In Story it is the tile's code on screen (B2). In Arcade it is still the district's name.
game.js `barkLine`: in Story, the district's name in the chosen line is replaced with the tile's code, in the same case. This covers a `{…}` placeholder and words written into the line. Arcade's text is unchanged.
`window.__dummiesUI.barkPlace` is set when game.js loads. `objective` and `drawFieldHD` set it again on each frame, so it survives if the test hooks are set up later. p1: Waterfront B2 in Story gives 'B2'.
Risk: I could not see `enrich`, `fillIn` or the bark texts. Any district word in a bark line is swapped after `fillIn`, whether a placeholder or written in the line. A line that names the district another way (by its id, say) is not caught.

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
  const VOYAGE = { district: 'waterfront', tile: 'B3' }; // Edit 94 (P7.13): the stilt houses, where the container ship is moored
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
    continueUnveil() { if (this.phase !== 'unveil') return; if (this.unveil) this.unveil.done = true; this.startVoyage(); } // Edit 94 (P7.13): the plaque read, the voyage, then the ending
    // Edit 94 (P7.13): the voyage. A Farsight drone lifts the dummy over the river to the container ship at Waterfront B3 (D76)
    startVoyage() {
      const b = this.body, from = this.screenName(), [c, r] = this.district.cur, [tc, tr] = cellOf(VOYAGE.tile);
      const side = tc > c ? 'E' : tc < c ? 'W' : tr > r ? 'S' : 'N';
      Object.assign(b, { alive: true, health: this.maxHealth(), level: 0, floor: null, held: null, carried: [], gesture: null });
      this.rescue = droneTo(this, b.x, -40, { voyage: true, side, cell: [tc, tr], tile: VOYAGE.tile });
      this.phase = 'voyage';
      this.emit('voyage', { from, to: VOYAGE.tile, side });
    }
    shipPoint() { const P = this.P, sp = this.sc && this.sc.ship; return sp ? { x: sp.x, y: sp.y } : { x: P['world.width'] / 2, y: P['world.height'] / 2 }; } // Edit 94 (P7.13): the ship, or the tile's middle
    stepVoyage(dt) { // Edit 94 (P7.13): inbound → lift → carry over the edge → in to the ship → set down → the ending
      const rs = this.rescue; this.rescue = null; W6.Sim6.prototype.stepRescue.call(this, dt); this.rescue = rs; // the drones already leaving fly on
      rs.t += dt; rs.k += dt;
      const b = this.body, P = this.P, W = P['world.width'], H = P['world.height'], d = rs.drone;
      const fly = (x, y) => { const dx = x - d.x, dy = y - d.y, l = Math.hypot(dx, dy), st = rs.v * dt; if (l <= st) { d.x = x; d.y = y; return true; } d.x += dx / l * st; d.y += dy / l * st; return false; };
      const next = (ph) => { rs.phase = ph; rs.k = 0; d.state = ph; };
      const hold = () => { b.x = d.x; b.y = d.y; b.px = b.x; b.py = b.y; };
      if (rs.phase === 'inbound') { if (fly(b.x, b.y)) next('lift'); }
      else if (rs.phase === 'lift') { const f = Math.min(1, rs.k / rs.lift); rs.up = 14 * f; d.alt = 1 - 0.6 * Math.sin(Math.PI * f); if (f >= 1) { next('carry'); d.alt = 1; } }
      else if (rs.phase === 'carry') { // over the river, to the edge and across it
        const [sx, sy] = SIDES[rs.side], tx = sx ? (sx > 0 ? W + 2 : -2) : Math.max(40, Math.min(W - 40, b.x)), ty = sy ? (sy > 0 ? H + 2 : -2) : Math.max(40, Math.min(H - 40, b.y));
        fly(tx, ty); hold();
        if ((sx > 0 && d.x > W) || (sx < 0 && d.x < 0) || (sy > 0 && d.y > H) || (sy < 0 && d.y < 0)) {
          d.x -= sx * W; d.y -= sy * H; d.hx -= sx * W; d.hy -= sy * H;
          this.flip(rs.side, rs.cell, null); // the screen moves on to the ship's tile
          rs.to = this.shipPoint(); next('in');
        }
      } else if (rs.phase === 'in') { const arrived = fly(rs.to.x, rs.to.y); hold(); if (arrived) next('drop'); }
      else if (rs.phase === 'drop') {
        const f = Math.min(1, rs.k / rs.lift); rs.up = 14 * (1 - f);
        if (f >= 1) {
          Object.assign(b, { x: rs.to.x, y: rs.to.y, px: rs.to.x, py: rs.to.y, mode: 'idle', vx: 0, vy: 0 });
          d.hx = d.x; d.hy = -40; d.state = 'outbound'; (this.leaving = this.leaving || []).push(d);
          this.rescue = null;
          this.emit('voyage-end', { tile: this.screenName(), seconds: +rs.t.toFixed(2) });
          this.end('Certified');
        }
      }
    }
    // Edit 94 (P7.13): progress.bestCombo, the largest combo of any hit in the story
    noteCombo(c) { const pr = this.story; if (this.storyMode && pr && (c || 0) > (pr.bestCombo || 0)) pr.bestCombo = c; }
    emit(type, data) { const out = super.emit(type, data); if (type === 'impact' && data && data.combo) this.noteCombo(data.combo); return out; }
    step(cmd) {
      if (this.phase === 'brief' || this.phase === 'gift' || this.phase === 'unveil') return; // Edit 94 (P7.13): the unveiling holds the sim
      const voy = !!(this.rescue && this.rescue.voyage); // Edit 94 (P7.13): the voyage runs as the ferry does, the world live, no input
      if (voy && this.phase === 'voyage') this.phase = 'play';
      super.step(voy ? {} : cmd);
      if (voy && this.phase === 'play' && this.rescue && this.rescue.voyage) this.phase = 'voyage';
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
      if (rs && rs.voyage) return this.stepVoyage(dt); // Edit 94 (P7.13): the flight to the ship
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

#### prototypes/p6/game.js · FACE (lines 357–357) · retrieved (33.273)
```
  const FACE = [['y', 0, -1, 'Y', ABIL4 ? 'PUSH' : 'THROW'], ['x', -1, 0, 'X', ABIL3 ? 'GRAB' : 'GRAB'], ['b', 1, 0, 'B', 'JUMP'], ['a', 0, 1, 'A', 'DASH']].filter((f) => !(ABIL3 && f[0] === 'y')); // Edit 79: no Y in 6.9
```

#### prototypes/p6/world6.js · WATER (lines 709–709) · retrieved (32.156)
```
  const WATER = { id: 'waterfront', name: 'Waterfront', quota: P['world.district.waterfront.quota'], storeys: [4, 10], start: ['B2', 'center'],
```

#### prototypes/p6/world6.js · Sim6.constructor (lines 2067–2076) · retrieved (30.876)
```
    constructor(id, overrides, carry, opts) {
      super('straight', Object.assign({}, P6SIM, overrides || {}, { 'run.appearances.road': 0 }), carry); // Edit 75: P6's values in the player sim too
      opts = opts || {}; this.opts = opts; // Edit 81 (P7): opts.startTile (the story starts a district on its first tile); opts.single (Arcade: one district is a whole run)
      this.p6 = true; this.levelId = id; this.list = LEVEL_LIST; this.roadIndex = LEVEL_LIST.indexOf(id); this.isFinal = !!opts.single || this.roadIndex === LEVEL_LIST.length - 1; this.isCity = true;
      const bud = overrides && overrides['run.appearances.road'] != null ? overrides['run.appearances.road'] : P['run.appearances.road'];
      this.P['run.appearances.road'] = bud;
      const acc = this.P['world.deckDropGaps'] || this.P['world.deckFlightsMin'] || this.P['props.cone.minVisible'] || this.P['world.dummyMonument'] || this.P['world.storyArt'] ? { dropGaps: this.P['world.deckDropGaps'], flightsMin: this.P['world.deckFlightsMin'], coneVisible: this.P['props.cone.minVisible'], monument: this.P['world.dummyMonument'], storyArt: this.P['world.storyArt'] } : null; // Edit 85 (P7.4). Edit 91: the circus's monument. Edit 92: the story's tile art
      this.W6 = opts.world || buildWorld(id, { budget: bud, warm: opts.warm, access: acc, density: opts.density });
      this.reset();
    }
```

#### prototypes/p6/game.js · touchLayout (lines 385–403) · retrieved (27.442)
```
  function touchLayout() {
    const dpr = window.devicePixelRatio || 1, css = dpr / scale, Wc = cv.width / scale, Hc = cv.height / scale, gx = ox / scale, gy = oy / scale, m = pv('ui.touch.margin') * css;
    const ly = app.layoutY || { left: 530, right: 450 };
    const zl = { x0: 0, x1: gx + FX, y0: gy + ly.left + 10, y1: Hc }, zr = { x0: gx + FX + FW, x1: Wc, y0: gy + ly.right + 10, y1: Hc };
    const sr0 = Math.max(36, Math.min(pv('ui.touch.stickRadius') * css * 1.15, (zl.x1 - zl.x0) / 2 - m / 2, (zl.y1 - zl.y0) / 2 - m / 2));
    let sr = sr0, home = { x: clamp(gx + FX / 2, zl.x0 + m + sr, zl.x1 - sr - 6), y: zl.y1 - m - sr };
    const gap = 6, fr0 = Math.max(22, Math.min(pv('ui.touch.faceRadius') * css * 1.15, (zr.x1 - zr.x0 - m - 2 * gap) / 4.83, (zr.y1 - zr.y0 - m - 2 * gap) / 4.83));
    let fr = fr0, sp = (2 * fr + gap) / Math.SQRT2; // round glass keys on a diamond: neighbours never touch
    let c = { x: clamp(gx + FX + FW + (VW - FX - FW) / 2, zr.x0 + sp + fr + 6, zr.x1 - m - sp - fr), y: zr.y1 - m - sp - fr };
    let sz = { x0: 0, x1: zl.x1 + sr * 0.5, y0: zl.y0 - sr * 0.5, y1: Hc }; // where a thumb takes the stick
    const cfg = app.touchCfg || {}, kOf = (q) => clamp((q && q.k) || 1, pv('ui.touch.scaleMin'), pv('ui.touch.scaleMax'));
    if (cfg.stick) { sr = sr0 * kOf(cfg.stick); home = { x: clamp(cfg.stick.fx * Wc, sr + 4, Wc - sr - 4), y: clamp(cfg.stick.fy * Hc, sr + 4, Hc - sr - 4) }; sz = { x0: Math.max(0, home.x - 1.7 * sr), x1: Math.min(Wc, home.x + 1.7 * sr), y0: Math.max(0, home.y - 1.7 * sr), y1: Math.min(Hc, home.y + 1.7 * sr) }; }
    if (cfg.face) { fr = fr0 * kOf(cfg.face); sp = (2 * fr + gap) / Math.SQRT2; const e = sp + fr + 4; c = { x: clamp(cfg.face.fx * Wc, e, Wc - e), y: clamp(cfg.face.fy * Hc, e, Hc - e) }; }
    const face = FACE.map(([id, dx, dy, l, w]) => ({ id, x: c.x + dx * sp, y: c.y + dy * sp, r: fr, l, w }));
    const side = gx >= 136, chip = STORY ? { pause: { x: gx + 16, y: gy + 4, w: 76, h: 26 }, full: { x: gx + 98, y: gy + 4, w: 64, h: 26 } } // Edit 87: small, top left, inside the frame
      : side ? { pause: { x: gx - 128, y: gy + 10, w: 120, h: 46 }, full: { x: gx - 128, y: gy + 66, w: 120, h: 46 } }
      : { pause: { x: gx + 12, y: gy + 2, w: 132, h: 40 }, full: null }; // no margin: over the brand; full screen from the upright prompt
    return { zl, zr, sz, sr, sr0, fr, fr0, sp, c, home, face, chip, css, Wc, Hc, gx, gy };
  }
```

#### prototypes/p6/pixel.js · deck (lines 858–897) · retrieved (26.235)
```
  function deck(dk, P) {
    const ext = Math.round(dk.height * P['proto.art.extrusion'] / U), wpx = Math.round(P['world.deckWidth'] / U), face = 4; // thin girder: the columns show below it
    const along = dk.hz ? AW : AH, lane = Math.round(P['world.laneWidth'] / U), pw = Math.max(2, Math.round(P['world.parapetWidth'] / U)), mid = Math.round(wpx / 2);
    const S = dk.hz ? spr(along, LAMP_H + wpx + face, 0, LAMP_H) : spr(wpx, along, 0, 0);
    const put = (a, b, c) => (dk.hz ? sput(S, a, b + LAMP_H, c) : sput(S, b, a, c)); // a along the deck, b across (0 = north / west)
    const high = (dk.z || 1) === 2, leds = KX('bldgLed'), led = leds ? leds[high ? 2 : 1] || leds[0] : K.lane, glow = c32(mixHex(PAL.deck2, PAL.head || PAL.white, 0.38)); // Edit 44: the high highway's LED line differs
    const gaps = (dk.gaps || []).map(([a0, a1, sd]) => [Math.round(a0 / U), Math.round(a1 / U), sd]);
    const opens = (dk.openings || []).map(([a0, a1, sd]) => [Math.round(a0 / U), Math.round(a1 / U), sd]); // Edit 44: a link stair's head, no parapet
    const inOpen = (a, sd) => opens.some(([g0, g1, s2]) => s2 === sd && a >= g0 && a < g1);
    const inGap = (a, sd) => gaps.some(([g0, g1, s2]) => s2 === sd && a >= g0 && a < g1);
    const nearGap = (a, sd) => gaps.some(([g0, g1, s2]) => s2 === sd && a >= g0 - 12 && a < g1 + 12);
    for (let a = 0; a < along; a++) for (let b = 0; b < wpx + (dk.hz ? face : 0); b++) {
      let c;
      const sd = b < mid ? -1 : 1, pb = sd < 0 ? b : wpx - 1 - b; // depth into the parapet from the outer edge
      if (b >= wpx) c = b === wpx + face - 1 ? K.bldgOutline : b === wpx ? K.jerseyTop : (a % 8 < 2 ? K.columnD : K.column); // girder face: lit lip, ribs
      else if (pb < pw + 1 && inGap(a, sd)) c = pb === 0 ? ((a % 3) ? (dk.gapLit ? K.podCrown : K.deckJoint) : K.bldgDark) : K.deck2; // broken parapet: the deck edge shows (Edit 85: lit cyan, a drop to read)
      else if (pb < pw + 1 && inOpen(a, sd)) c = pb === 0 ? K.deckJoint : K.deck; // opening: the deck runs onto the stair
      else if (high && pb === pw + 1) c = (a % 6 < 3) ? led : K.deck2; // high highway: a second LED line inside the parapet
      else if (pb === 0) c = K.jerseyO;
      else if (pb === 1) c = (a % 6 < 3) ? led : K.jerseyTop; // parapet LED line
      else if (pb < pw + 1) c = K.jersey;
      else if (Math.abs(b - mid) === lane) c = K.lane; // solid edge lines: the hard shoulders lie outside them
      else if (b === mid && a % 24 < 14) c = K.lane; // long highway dashes
      else if (a % 32 === 0) c = K.deckJoint; // expansion joints across the deck
      else c = Math.abs(b - mid) > lane ? K.deck2 : K.deck; // pale concrete: the highway is never the asphalt below
      put(a, b, c);
      if (pb < pw + 1 && pb > 0 && !inGap(a, sd) && (inGap(a - 1, sd) || inGap(a + 1, sd) || (dk.gapLit && (inGap(a - 2, sd) || inGap(a + 2, sd))))) put(a, b, K.white); // snapped ends (never warning red: canon); Edit 85: two px
    }
    const sp = Math.round(P['world.deckLampSpacing'] / U);
    // P5.2 (Edit 50.2): lamps in pairs, one on each parapet every world.deckLampSpacing; a pale pole, a bright head, a light pool
    if (dk.hz) for (const sd of [-1, 1]) for (let a = Math.round(sp / 2); a < along; a += sp) {
      if (inGap(a, sd) || inOpen(a, sd)) continue;
      const b0 = sd < 0 ? 1 : wpx - 2;
      if (nearGap(a, sd)) { for (let k = 0; k < 5; k++) put(a + k, b0 - k * sd, k === 4 ? K.bldgDark : K.bldgOutline); continue; } // broken: the pole lies across the shoulder, unlit
      for (let k = 1; k <= 4; k++) for (let j = -2; j <= 2; j++) if (Math.abs(j) + (k > 3 ? 1 : 0) <= 2) put(a + j, b0 - sd * (pw + k), glow); // light pool on the shoulder
      for (let k = 1; k < LAMP_H; k++) { sput(S, a, b0 + LAMP_H - k, K.jerseyTop); sput(S, a + 1, b0 + LAMP_H - k, K.bldgOutline); } // the pole rises screen-up from the parapet
      for (let j = -1; j <= 2; j++) { sput(S, a + j, b0 + 1, j === 0 || j === 1 ? K.white : K.head); sput(S, a + j, b0, K.bldgOutline); }
    }
    return { S, ext };
  }
```

#### prototypes/p6/game.js · touchLayoutCss (lines 404–407) · retrieved (24.562)
```
  function touchLayoutCss() { // for the tests: the layout in CSS pixels of the page
    const L = touchLayout(), r = cv.getBoundingClientRect(), k = scale / (window.devicePixelRatio || 1), p = (q) => ({ x: r.left + q.x * k, y: r.top + q.y * k });
    return { sr: L.sr * k, home: p(L.home), face: L.face.map((f) => Object.assign(p(f), { id: f.id, r: f.r * k })), field: { x0: r.left + (ox / scale + FX) * k, x1: r.left + (ox / scale + FX + FW) * k }, chip: L.chip };
  }
```

#### prototypes/p6/world6.js · dummyStatue (lines 890–913) · retrieved (24.393)
```
  function dummyStatue() {
    const D = PIX.dummy(Math.PI / 2, 0), k = 3, cY = PIX.c32(PIX.PAL.dummy), cy = PIX.c32(PIX.PAL.dummyD), cW = PIX.c32(PIX.PAL.dummyL);
    const at = (i, j) => (i < 0 || j < 0 || i >= D.w || j >= D.h ? 0 : D.d[j * D.w + i]), edge = (i, j) => !at(i - 1, j) || !at(i + 1, j) || !at(i, j - 1) || !at(i, j + 1);
    const tone = (c, i, j) => (c === cW ? N.stoneL : c === cY ? N.stone : c === cy ? N.stoneD : edge(i, j) ? N.stoneD : K.joint); // the silhouette in stone; the joints black
    const W = 52, sh = D.h * k, H = sh + 44, cx = 26, by = H - 2;
    const S = { w: W, h: H, d: new Uint32Array(W * H), ox: cx, oy: by - 9 };
    const put = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) S.d[y * W + x] = c; };
    const box = (x0, x1, y0, y1, b, h, top, front, led) => { // a footprint x0..x1 × y0..y1, its base b and height h: top face, front face, a lit coping
      for (let y = y0 - b - h; y <= y1 - b - h; y++) for (let x = x0; x <= x1; x++) put(x, y, x === x0 || x === x1 || y === y0 - b - h ? CON.l : top);
      for (let y = y1 - b - h + 1; y <= y1 - b; y++) for (let x = x0; x <= x1; x++) put(x, y, y === y1 - b - h + 1 && led ? led : x === x0 || x === x1 ? CON.d : front);
    };
    box(cx - 22, cx + 22, by - 17, by, 0, 3, CON.m, CON.d, N.cyan); // the steps
    box(cx - 16, cx + 16, by - 14, by - 3, 3, 3, CON.l, CON.m, null);
    box(cx - 8, cx + 8, by - 12, by - 6, 6, 14, N.stone, N.stoneD, null); // the pedestal
    for (let x = cx - 5; x <= cx + 5; x++) { put(x, by - 15, K.bldgOutline); put(x, by - 14, x % 2 ? N.cyan : K.white); put(x, by - 13, K.bldgOutline); } // the plaque, lit
    const fx = cx - Math.floor(D.w * k / 2), fy = by - 6 - 14 - 9 - sh + 3; // feet on the pedestal's top face
    for (let j = 0; j < D.h; j++) for (let i = 0; i < D.w; i++) { const c = D.d[j * D.w + i]; if (!c) continue; const t = tone(c, i, j); for (let b = 0; b < k; b++) for (let a = 0; a < k; a++) put(fx + i * k + a, fy + j * k + b, t); }
    const mx = fx + 6 * k + 1, my = fy + 10 * k + 1; // the quartered calibration mark on the chest
    for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (x * x + y * y <= 10) put(mx + x, my + y, (x < 0) === (y < 0) ? K.joint : N.stoneL);
    const out = new Uint32Array(S.d); // a one-pixel outline round the figure
    for (let y = fy - 1; y <= fy + sh; y++) for (let x = fx - 1; x <= fx + D.w * k; x++) { const i = y * W + x; if (y < 0 || x < 0 || x >= W || y >= H || S.d[i]) continue; if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => { const xx = x + a, yy = y + b; return xx >= 0 && yy >= 0 && xx < W && yy < H && S.d[yy * W + xx] && xx >= fx && xx < fx + D.w * k && yy >= fy && yy < fy + sh; })) out[i] = K.bldgOutline; }
    S.d = out;
    return S;
  }
```

#### prototypes/p6/world6.js · gameData (lines 1542–1595) · retrieved (24.231)
```
  function gameData(sc) {
    const floors = [];
    for (const l of sc.layers) {
      const f = l.dk ? deckFloor(l) : l.ring ? ringFloor(l) : l.walk ? { kind: 'walk', z: 1, layer: l, drop: false, dropAt: (x, y) => l.gapAt(x, y), has: (x, y) => l.polys.some((p) => PIX.inPoly(p, x, y)) } : null; // P6.2: a walkway drops only through its one opening per road
      if (f) floors.push(f);
    }
    for (const q of sc.floorsX) floors.push(q.poly ? { kind: q.kind, z: q.z, layer: q.layer, drop: q.drop, poly: q.poly, has: (x, y) => PIX.inPoly(q.poly, x, y) } : Object.assign(rectFloor(q.kind, q.z, q.x, q.y, q.w, q.h), { key: q.key, drop: q.drop }));
    for (const rf of sc.roofs) floors.push(Object.assign(rectFloor('roof', rf.z, rf.rect[0], rf.rect[1], rf.rect[2], rf.rect[3]), { key: rf.z === 2 ? rf.rect[1] + rf.rect[3] + 0.6 : 1e6 - 0.5 }));
    floors.forEach((f, i) => { f.i = i; if (f.kind === 'walk' || f.kind === 'deck' || f.kind === 'ring') f.rail = true; }); // Edit 75: railed floors (handrails, parapets): jumpable
    const statics = mergeRects(sc.solids);
    // Edit 75: the jumpable tag (terrain table, column jumpable). At Z0 a mass drawn no taller than proto.art.jumpableTop art
    // px (a planter and its hedge, a bed, reeds) is a low barrier: jumpable, counted at world.jumpableHeight. Edge pieces
    // (planter, bound, wall, booth), buildings, columns, stairs and sculptures never are. Above Z0 the rails of walkways,
    // highway decks and lifted rings are handrails: jumpable, at world.jumpableHeight.
    // A piece counts whole (its touching runs together): no deeper than world.jumpableDepth across, so a jump clears it.
    const low = statics.filter((q) => q.kind === 'mass' && q.ht != null && q.ht <= P['proto.art.jumpableTop']);
    const up = low.map((_, i) => i), find = (i) => (up[i] === i ? i : (up[i] = find(up[i])));
    for (let i = 0; i < low.length; i++) for (let j = i + 1; j < low.length; j++) { const a = low[i], c = low[j]; if (a.x <= c.x + c.w + 0.5 && c.x <= a.x + a.w + 0.5 && a.y <= c.y + c.h + 0.5 && c.y <= a.y + a.h + 0.5) up[find(i)] = find(j); }
    const box = new Map(); low.forEach((q, i) => { const k = find(i), bx = box.get(k) || { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 }; bx.x0 = Math.min(bx.x0, q.x); bx.y0 = Math.min(bx.y0, q.y); bx.x1 = Math.max(bx.x1, q.x + q.w); bx.y1 = Math.max(bx.y1, q.y + q.h); box.set(k, bx); });
    low.forEach((q, i) => { const bx = box.get(find(i)); if (Math.min(bx.x1 - bx.x0, bx.y1 - bx.y0) <= P['world.jumpableDepth'] + 1e-9) { q.jumpable = true; q.zTop = P['world.jumpableHeight']; q.piece = [bx.x0, bx.y0, bx.x1 - bx.x0, bx.y1 - bx.y0]; } });
    for (const l of sc.layers) for (const c of l.cols || []) statics.push({ x: c.x, y: c.y, w: 2 * (c.cx - c.x), h: 2 * (c.cy - c.y), kind: 'column' });
    if (sc.monument) statics.push({ x: sc.monument.cx - 40, y: sc.monument.cy - 18, w: 80, h: 36, kind: 'monument' });
    const stairs = [], propOf = new Map(sc.props.filter((p) => p.stair).map((p) => [p.stair, p]));
    for (const st of sc.stairs) {
      const z = st.z || 1, dir = Math.sign(st.high - st.low), lat = st.axis === 'y' ? st.x + st.w / 2 : st.y + st.h / 2;
      let head = -1;
      for (const k of [4, 8, 16, 24, 32, 40]) { const a = st.high + dir * k, x = st.axis === 'y' ? lat : a, y = st.axis === 'y' ? a : lat; head = floors.findIndex((f) => f.z === z && f.has(x, y)); if (head >= 0) break; }
      const pr = propOf.get(st), key = pr ? (pr.key != null ? pr.key : pr.over ? 1e6 + 1 : pr.by) : st.y + st.h;
      if (head < 0) { statics.push({ x: st.x, y: st.y, w: st.w, h: st.h, kind: 'stair' }); continue; } // a flight with nowhere to land is scenery
      stairs.push({ x: st.x, y: st.y, w: st.w, h: st.h, axis: st.axis, low: st.low, high: st.high, from: 0, to: z, foot: null, head, key });
    }
    // where a dummy can stand at Z0: off the lanes and shoulders, clear of solids, the hill, the water, stairs and decks
    const offPoly = (x, y, m) => sc.polys0.every((p) => !PIX.inPoly(p, x, y) && polyDist(p, x, y).d > m);
    const ground = (x, y, m) => sc.roadOk(x, y, OUTER + m) && !statics.some((s) => inR(s, x, y, R0 + 6)) && offPoly(x, y, R0 + 6) && !sc.waterPolys.some((p) => PIX.inPoly(p, x, y) || polyDist(p, x, y).d < R0 + 12) && !stairs.some((s) => inR(s, x, y, R0 + 10));
    const pick = (cands, score, n, gap) => { const out = []; for (const c of cands.sort((a, b) => score(a) - score(b))) { if (out.length >= n) break; if (out.every((o) => hyp(o.x - c.x, o.y - c.y) >= gap)) out.push(c); } return out; };
    const cands = [];
    for (let y = 48; y <= H - 32; y += 16) for (let x = 32; x <= W - 32; x += 16) if (ground(x, y, 12) && !sc.layers.some((l) => l.inBand && l.inBand(x, y)) && !(sc.islands || []).some((q) => hyp(x - q.x, y - q.y) < q.r)) cands.push({ x, y, f: 90, level: 0, floor: null });
    const st0 = sc.D.start, edge = st0 && st0[0] === sc.name ? st0[1] : null;
    const score = (c) => (edge === 'top' ? c.y + Math.abs(c.x - W / 2) * 0.2 : edge === 'west' ? c.x + Math.abs(c.y - H / 2) * 0.2 : edge === 'center' ? hyp(c.x - W / 2, c.y - 0.65 * H) : hyp(c.x - W / 2, c.y - H / 2)); // the centre start: below the intro banner
    let spawns = pick(cands, score, 3, 120);
    if (!spawns.length) { // a hilltop screen: stand on the hill, off its streets and clear of its buildings
      const hf = floors.find((f) => f.kind === 'hill');
      if (hf) for (let y = 48; y <= H - 32; y += 16) for (let x = 32; x <= W - 32; x += 16)
        if ([[0, 0], [24, 0], [-24, 0], [0, 24], [0, -24]].every(([a, b]) => hf.has(x + a, y + b)) && (!sc.hillOk || sc.hillOk(x, y, OUTER + 12)) && !sc.solidsZ.some((s) => inR(s, x, y, R0 + 6))) spawns.push({ x, y, f: 90, level: 1, floor: hf.i });
      spawns = pick(spawns, score, 3, 120);
    }
    // cone homes: on the pavement beside a ground road
    const shows = ACCESS && ACCESS.coneVisible ? (c) => coneShows(sc, c.x, c.y) >= ACCESS.coneVisible : () => true; // Edit 85: never under a highway, a walkway or behind a building
    const homes = sc.sims.some((s) => s.elev0 === 0 && s.level.lanes.length) ? pick(cands.filter((c) => !sc.roadOk(c.x, c.y, OUTER + 40) && shows(c)), (c) => hyp(c.x - W / 2, c.y - H / 2), 2, 240) : [];
    const runs = (sc.runs || []).concat(sc.hillRuns || []), longest = runs.reduce((a, r) => (!a || X.makePath(r.pts).length > X.makePath(a.pts).length ? r : a), null);
    return { id: sc.D.id, name: sc.name, cell: [sc.col, sc.row], statics, floors, stairs, solidsZ: sc.solidsZ.slice(), polys0: sc.polys0, water: sc.waterPolys, spawns, coneHomes: homes.map((c) => [c.x, c.y]),
      patches: [], checkpoints: sc.checkpoints || [], decks: [], deckLanes: [], lanes: [], center: longest ? longest.pts : [], ring: sc.ringDeck ? sc.ringDeck.ring.geoms[0].pts : null,
      deckLines: sc.layers.filter((l) => l.dk).map((l) => ({ hz: l.dk.hz, off: l.dk.off, z: l.dk.z })), theme: 'p6', landmark: sc.D.tiles[sc.name][1] };
  }
```

#### prototypes/p6/game.js · FACE_NODE (lines 358–358) · retrieved (23.789)
```
  const FACE_NODE = { a: null, b: 'jump', x: 'carry', y: ABIL4 ? 'push' : 'throw' };
```

#### prototypes/p6/world6.js · lvl (lines 1182–1182) · retrieved (23.501)
```
    const lvl = (c, extra) => Object.assign({ center: c, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: groundDecks.map((d) => ({ hz: true, off: d.off, z: d.z, height: d.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] })), floors: [], canal: false, solid: [] }, extra || {});
```

#### prototypes/p6/world6.js · stiltSprite (lines 747–760) · retrieved (23.185)
```
  function stiltSprite(w, h, led) {
    const base = RIV, top = Z1 + 8, S = { w: w + 2, h: h + top + base + 2, ox: 0, oy: top, d: new Uint32Array((w + 2) * (h + top + base + 2)) };
    const put = (x, y, c) => { const Y0 = y + top; if (x >= 0 && Y0 >= 0 && x < S.w && Y0 < S.h) S.d[Y0 * S.w + x] = c; };
    const z12 = EXT(12), floorZ = (k) => z12 + k * EXT(P['world.storeyHeight']); // house floors from Z0 + 12
    for (let x = 2; x < w - 2; x += Math.max(4, Math.round((w - 4) / 5))) for (let y = h - 1 + base; y > h - 1 - z12; y--) { put(x, y, K.columnD); put(x + 1, y, K.column); } // stilts from the water
    for (let x = 2; x + 6 < w - 2; x += 6) for (let t = 0; t < 6; t++) { put(x + t, h - 1 + base - t, CON.l); put(x + 6 - t, h - 1 + base - t, CON.l); } // bracing
    const roofY = h - Z1; // the roof (terrace) at Z1
    for (let y = h - 1 - z12; y >= roofY; y--) for (let x = 1; x < w - 1; x++) { const k = h - 1 - z12 - y, f = k % EXT(P['world.storeyHeight']); put(x, y, f === 0 ? CON.l : f < 3 && (x * 7 + y) % 9 < 5 ? (x % 4 ? N.cyan : K.white) : c32('#2A3245')); } // the front face: balconies and lit windows
    for (let y = 0; y < h - 10; y++) for (let x = 0; x < w; x++) put(x, y - Z1, x === 0 || x === w - 1 || y === 0 ? CON.l : (x % 6 === 0 || y % 6 === 0) ? N.pave2 : N.pave); // roof terrace
    for (let x = 0; x < w; x++) put(x, h - 10 - Z1, led);
    const cx0 = Math.round(w * 0.45); for (const cx of [cx0, w - 3]) for (let z = 0; z < 6; z++) put(cx, h - 16 - Z1 - z, CON.l);
    for (let y = 3; y < h - 16; y++) for (let x = cx0; x < w - 2; x++) put(x, y - Z1 - 7, y === h - 17 ? N.magenta : (x - cx0) % 5 === 0 ? N.stoneD : c32('#B9C2C8')); // the canopy
    return S;
  }
```

#### prototypes/p6/circus_valley.js · check (lines 152–205) · retrieved (23.03)
```
  function check(plan) {
    const rows = [], add = (rule, ok, detail) => rows.push({ rule, ok, detail });
    const nodes = plan.tees.concat([plan.ring]), inside = (p) => p[0] > 0 && p[1] > 0 && p[0] < DW && p[1] < DH;
    for (const r of plan.roads) for (const e of [r.pts[0], r.pts[r.pts.length - 1]]) add('Every road goes somewhere (no dead ends)', !inside(e) || nodes.some((n) => hyp(n[0] - e[0], n[1] - e[1]) < 2), r.id + (inside(e) ? ' ends at ' + TILE(e[0], e[1]) : ' leaves the district'));
    add('No ramps: every road keeps one level (D35)', plan.roads.every((r) => r.z === 0 || r.z === 1), 'valley and hill roads meet beyond the district; people climb by stairs and escalators');
    add('The circus is a real junction', nodes.length === 4, 'avenue W, E; tunnel N; beach road S');
    for (const r of plan.roads) { const bad = dense(r.pts, 8).filter(([x, y]) => inside([x, y]) && r.z - ground(x, y) < -0.25 && !underground(r, x, y)); add('No road below the ground it crosses, except in a tunnel', bad.length === 0, r.id); }
    for (const r of plan.roads.filter((q) => q.tunnel != null)) { const x0 = r.pts[0][0];
      add('A tunnel runs at Z0 under the hill only; its mouth is in a cliff', dense(r.pts, 8).filter(([x, y]) => underground(r, x, y) && inside([x, y])).every(([x, y]) => ground(x, y) >= 1) && ground(x0, r.tunnel - 4) === 1 && ground(x0, r.tunnel + 4) === 0, r.id + ': mouth at ' + TILE(x0, r.tunnel + 4) + ' (' + x0 + ', ' + r.tunnel + ')');
      add('Nothing marks the tunnel above ground (Edit 61)', plan.buildings.every((b) => !b.spans || !plan.roads.some((q) => q.id === b.spans && q.z === 1 && q.pts.every((p) => p[1] === q.pts[0][1]) && Math.abs(b.rect[0] + b.rect[2] / 2 - x0) < b.rect[2] / 2)), 'the ridge road runs over it unbroken'); }
    // bridges and walkways over streets: 90° or 45°; each crossing is a drop onto cars
    const drops = [], over = (id, pts, z) => { for (const q of plan.roads) { if (q.z >= z) continue; for (let i = 1; i < pts.length; i++) for (let j = 1; j < q.pts.length; j++) { const k = segX(pts[i - 1], pts[i], q.pts[j - 1], q.pts[j]); if (!k || underground(q, k.x, k.y) || drops.some((d) => hyp(d.x - k.x, d.y - k.y) < 8)) continue; const a = ang(k.r, k.s); drops.push({ tile: TILE(k.x, k.y), x: k.x, y: k.y, over: q.id, by: id, ang: a }); add('Bridges and walkways cross streets at 90° or 45°', Math.abs(a - 90) < 1 || Math.abs(a - 45) < 1, id + ' over ' + q.id + ' in ' + TILE(k.x, k.y) + ': ' + Math.round(a) + '°'); } } };
    const bridges = plan.roads.map((r) => ({ r, runs: raised(r) })).filter((b) => b.runs.length);
    for (const b of bridges) for (const run of b.runs) over(b.r.id, run, b.r.z);
    for (const w of plan.walkways) over(w.id, w.pts, 1);
    add('Columns only where the ground is lower (valley, beach, river)', bridges.every((b) => b.runs.every((run) => run.every(([x, y]) => ground(x, y) < 0.5))), bridges.map((b) => b.r.id + ' on columns for ' + b.runs.map((run) => Math.round(hyp(run[run.length - 1][0] - run[0][0], run[run.length - 1][1] - run[0][1]))).join(', ')).join('; '));
    const river = [], rescues = [];
    for (const b of bridges) for (const run of b.runs) { const w = run.filter(([x, y]) => ground(x, y) === RIVER && y < DH); if (w.length) { const k = { tile: TILE(w[0][0], w[0][1]), x: w[Math.floor(w.length / 2)][0], y: Math.min(DH - 60, w[Math.floor(w.length / 2)][1]), bridge: b.r.id }; river.push(k); rescues.push(Object.assign({ tile: k.tile, bridge: b.r.id }, rescue(plan, k.x, k.y))); } }
    for (const q of rescues) add('River rescue: a drone sets the dummy on the nearest land, never a lane or a deck (D37)', !!q.to && q.surface !== 'river', q.bridge + ' (' + q.tile + '): ' + Math.round(q.d) + ' to the seawall promenade (' + q.to.map(Math.round).join(', ') + '), ' + q.secs.toFixed(1) + ' s');
    add('Bridges run straight south over the river; no road joins them south of the hill', bridges.every((b) => b.r.pts.length === 2 && b.r.pts[0][0] === b.r.pts[1][0] && b.r.pts[1][1] > DH) && plan.tees.every((t) => !bridges.some((b) => Math.abs(b.r.pts[0][0] - t[0]) < 1 && t[1] > 760)), bridges.map((b) => b.r.id).join(', '));
    const gp = dense(DRIVE, 16).filter(([x]) => x > 0 && x < DW).map(([x, y]) => distToPoly(SHORE, x, y));
    add('The seawall runs parallel to the coastal drive', Math.max(...gp) - Math.min(...gp) < 6, 'kerb to wall ' + (SEAWALL - OUTER) + ' (world.walkwayWidth) all along (±' + ((Math.max(...gp) - Math.min(...gp)) / 2).toFixed(1) + ')');
    // junctions and the ring
    const zq = (1 - ZONE) / 2, inZone = ([x, y]) => x % W >= W * zq && x % W <= W * (1 - zq) && y % H >= H * zq && y % H <= H * (1 - zq);
    for (const t of plan.tees) add('T junction in the central ' + Math.round(ZONE * 100) + '%, on level ground', inZone(t) && [[-60, 0], [60, 0], [0, -60], [0, 60]].every(([dx, dy]) => Math.abs(ground(t[0] + dx, t[1] + dy) - ground(t[0], t[1])) < 0.01), TILE(t[0], t[1]) + ' (' + t[0] % W + ', ' + t[1] % H + ')');
    const [cx, cy] = plan.ring, R = RS + OUTER;
    add('Circus inside its tile, centred, on level ground', cx % W - R >= 0 && cx % W + R <= W && cy % H - R >= 0 && cy % H + R <= H && inZone(plan.ring) && dense([[cx - R, cy], [cx + R, cy], [cx, cy - R], [cx, cy + R]], 16).every(([x, y]) => ground(x, y) === 0), 'B2, radius ' + RS);
    add('No bridge or walkway over the circus', bridges.every((b) => b.runs.every((run) => distToPoly(run, cx, cy) > R + HALF)) && plan.walkways.every((w) => distToPoly(w.pts, cx, cy) > R + WALK), '');
    for (const r of plan.roads) for (const [a, b] of [[[W, -1e4], [W, 1e4]], [[2 * W, -1e4], [2 * W, 1e4]], [[-1e4, H], [1e4, H]], [[-1e4, 2 * H], [1e4, 2 * H]]]) for (let i = 1; i < r.pts.length; i++) { const k = segX(r.pts[i - 1], r.pts[i], a, b); if (!k) continue; const vert = a[0] === b[0], along = vert ? k.y : k.x, span = vert ? H : W, off = ((along % span) + span) % span; add('Road crosses a seam ≥ 160 from a tile corner', Math.min(off, span - off) >= 159, r.id + ' at (' + Math.round(k.x) + ', ' + Math.round(k.y) + ')'); }
    // buildings and park pieces
    const footprints = plan.buildings.map((b) => ({ b, rect: b.rect })).concat(plan.props.map((q) => ({ q, rect: propRect(q) })));
    for (const f of footprints) {
      const b = f.b, edge = dense(rectPoly(f.rect).concat([rectPoly(f.rect)[0]]), 16), base = b ? b.base : 0;
      const roads = plan.roads.filter((r) => !(b && r.id === b.spans) && !(base >= 1 && r.tunnel != null));
      const clearOf = roads.every((r) => edge.every(([x, y]) => distToPoly(openPts(r), x, y) > OUTER - 1) && !dense(openPts(r), 16).some(([x, y]) => inRect(f.rect, x, y)));
      const level = edge.every(([x, y]) => Math.abs(ground(x, y) - base) < 0.01);
      const spans = !b || !b.spans || plan.roads.some((r) => r.id === b.spans && dense(r.pts, 8).some(([x, y]) => inRect(b.rect, x, y)));
      add(b ? 'Buildings stand on their own level, clear of lanes (a portal spans one)' : 'Beach park pieces stand on the sand or the valley floor, clear of lanes', clearOf && level && spans, (b ? TYPES[b.type].label + ' in ' + tile(b) : f.q.kind + ' in ' + TILE(f.q.at[0], f.q.at[1])));
    }
    add('No connector buildings: walkways start on the hill, a deck or a landing (Edit 61)', plan.buildings.every((b) => b.type !== 'cliff' && b.type !== 'pavilion'), 'terraces and landings are decks on pilotis');
    const edgeW = plan.buildings.filter((b) => b.type === 'edge'), tw = edgeW.flatMap((b) => b.towers || []).map((t) => t[4] * STOREY);
    add('The top edge is impassable: a continuous wall of buildings', edgeW.some((b) => b.rect[0] <= 0 && b.rect[0] + b.rect[2] >= DW && b.rect[1] <= 0), 'podiums ' + Math.min(...edgeW[0].segs) + '–' + Math.max(...edgeW[0].segs) + ' storeys; towers ' + Math.min(...tw) + '–' + Math.max(...tw) + ' above the hill');
    add('Edge towers within world.towerHeightMin–Max', tw.every((h) => h >= P['world.towerHeightMin'] && h <= P['world.towerHeightMax']), Math.min(...tw) + '–' + Math.max(...tw) + ' in ' + P['world.towerHeightMin'] + '–' + P['world.towerHeightMax']);
    const atZ1 = (x, y) => ground(x, y) === 1 || plan.buildings.some((b) => inRect(b.rect, x, y, 2) && topZ(b) >= Z1H) || bridges.some((bb) => bb.runs.some((run) => distToPoly(run, x, y) <= HALF + 2));
    for (const w of plan.walkways) add('Walkways run at Z1 from the hill, a deck, a landing or a roof', [w.pts[0], w.pts[w.pts.length - 1]].every(([x, y]) => atZ1(x, y)), w.id + ': ' + w.from + ' → ' + w.to);
    const stairs = plan.buildings.filter((b) => b.stair).map((b) => Object.assign({ tile: TILE(b.stair.foot[0], b.stair.foot[1]), b }, b.stair));
    for (const st of stairs.concat(plan.coveStairs)) { const fr = stairRect(st);
      add('Stairs: foot on Z0 clear of lanes, buildings and park pieces', ground(st.foot[0], st.foot[1]) === 0 && plan.roads.every((r) => distToPoly(openPts(r), st.foot[0], st.foot[1]) > OUTER + SWD / 2 - 1) && footprints.every((f) => f.b === st.b || !inRect(f.rect, st.foot[0], st.foot[1], SWD / 2)), (st.b ? TYPES[st.b.type].label : 'cove ' + st.side + ' wall') + ' in ' + TILE(st.foot[0], st.foot[1]) + ', run ' + RUN1 + ' (' + fr[2] + ' × ' + fr[3] + ')'); }
    // the dummy: two ways up on every screen with walkable Z0 ground beside Z1
    const esc = escalators(plan, bridges), linked = (b) => plan.walkways.some((w) => [w.pts[0], w.pts[w.pts.length - 1]].some(([x, y]) => inRect(b.rect, x, y, 2)) && [w.pts[0], w.pts[w.pts.length - 1]].some(([x, y]) => ground(x, y) === 1));
    for (const t of ['B1', 'A2', 'B2', 'C2', 'A3', 'C3']) { const e = esc.filter((q) => q.tile === t).length, s = plan.coveStairs.filter((q) => TILE(q.foot[0], q.foot[1]) === t).length, tr = stairs.filter((q) => q.tile === t && linked(q.b)).length;
      add('Two ways up to the hill on every screen below Z1 (escalators, stairs, a terrace and walkway)', e + s + tr >= 2, t + ': ' + [e ? e + ' escalators' : '', s ? s + ' stairs' : '', tr ? tr + ' terrace stair and walkway' : ''].filter(Boolean).join(', ')); }
    return { rows, drops, river, rescues, esc, bridges, stairs };
  }
```

#### prototypes/p6/pixel.js · ground (lines 989–1076) · retrieved (22.705)
```
  function ground(level, P, seed) {
    const B = new Buf(AW, AH), r = rng(seed || 7);
    B.fill(K.grass);
    const city = PAL.scenery === 'city';
    if (city) { // deck plates with seams, grates and drains
      for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) if (x % 16 === 0 || y % 16 === 0) B.put(x, y, K.grass2);
      for (let i = 0; i < Math.round(90 * AW * AH / 120000); i++) { const x = Math.floor(r() * AW / 16) * 16 + 4, y = Math.floor(r() * Math.ceil(AH / 16)) * 16 + 4, w = 3 + Math.floor(r() * 6); for (let k = 0; k < w; k += 2) { B.put(x + k, y, K.grass3); B.put(x + k, y + 1, K.grass3); } }
    } else {
      for (let i = 0; i < 2000; i++) { const x = Math.floor(r() * AW), y = Math.floor(r() * AH); B.put(x, y, K.grass2); B.put(x + 1, y - 1, K.grass2); }
      for (let i = 0; i < 650; i++) B.put(Math.floor(r() * AW), Math.floor(r() * AH), K.grass3);
    }
    const canal = level.canal !== false, cb = canal ? Math.round(34 / U) : -3; // canal along the top edge: the river screens only (D24)
    if (canal) {
      B.rect(0, 0, AW - 1, cb, K.water);
      for (const y of [3, 7, 11, 15]) for (let x = Math.floor(r() * 8); x < AW; x += 31) for (let i = 0; i < 8; i++) B.put(x + i, y + (i > 3 ? 1 : 0), K.water2);
      B.rect(0, cb + 1, AW - 1, cb + 1, K.kerb); B.rect(0, cb + 2, AW - 1, cb + 2, K.kerb2);
    }
    const refl = KX('reflect');
    if (!canal) { /* no river on inland screens */ } else if (refl) { // night river: the towers' light falls on the water as broken vertical columns
      for (let i = 0, x = 6; x < AW; x += 17 + Math.floor(r() * 12), i++) {
        const c = refl[i % refl.length];
        for (let y = 1; y < cb; y += 2) if (r() < 0.75) { const j = Math.round((r() - 0.5) * 3), w = 2 + Math.floor(r() * 4); for (let k = 0; k < w; k++) B.put(x + j + k, y, c); }
      }
    } else for (const [bx, by, br] of [[40, 8, 2], [170, 5, 3], [300, 10, 2], [372, 4, 1]]) { for (const p of circle(br)) B.put(bx + p[0], by + p[1], K.bubble); B.put(bx - 1, by - 1, K.bubble); }
    // road and pavement from the distance to the centre line
    const geo0 = pathGeom(level.center), geoR = level.ring ? pathGeom(level.ring) : null, lw = P['world.laneWidth'], outer = lw + P['proto.shoulderWidth'];
    const geo = geoR ? { length: geo0.length, at: geo0.at, near: (x, y) => { const a = geo0.near(x, y), b2 = geoR.near(x, y); return b2.d < a.d ? b2 : a; } } : geo0; // the roundabout ring is road too
    const near = new Float32Array(AW * AH);
    const field = level.arms ? roadField([].concat(level.arms.map((pts) => ({ pts, dash: true })), level.ring ? [{ pts: level.ring, dash: true }] : [], (level.surfaces || []).map((pts) => ({ pts, dash: false }))), outer + 40) : null; // P4 (Edit 49.3): junctions
    for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) {
      const wx = (x + 0.5) * U, wy = (y + 0.5) * U, k = y * AW + x, n = field ? { d: field.D[k], sd: field.dash[k] ? field.SD[k] : -1, s: field.S[k] } : geo.near(wx, wy);
      near[y * AW + x] = n.d;
      if (n.d >= outer) continue;
      if (n.d < lw) {
        let c = K.road;
        if ((Math.imul(x * 73856093 ^ y * 19349663, 2654435761) >>> 0) % 100 < 7) c = K.road2;
        if (n.d >= lw - U) c = K.kerb; else if (n.d >= lw - 2 * U) c = K.kerb2;
        if (n.sd >= 0 && n.sd < U && ((n.s % 36) + 36) % 36 < 20) c = K.lane; // lane dashes
        B.put(x, y, c);
      } else if (K.edgeLight && n.d >= outer - U && ((n.s % 16) + 16) % 16 < U) B.put(x, y, K.edgeLight); // riverside light string
      else B.put(x, y, n.d >= outer - U || ((n.s % 12) + 12) % 12 < U ? K.pave2 : K.pave);
    }
    const clearOf = (wx, wy, m) => level.statics.every((st) => wx < st.x - m || wx > st.x + st.w + m || wy < st.y - m || wy > st.y + st.h + m)
      && level.spawns.every((sp) => Math.hypot(sp.x - wx, sp.y - wy) > m + 20) && (level.coneHomes || []).every((cn) => Math.hypot(cn[0] - wx, cn[1] - wy) > m);
    const roadD = (wx, wy) => { const x = Math.floor(wx / U), y = Math.floor(wy / U); return x < 0 || y < 0 || x >= AW || y >= AH ? 999 : near[y * AW + x]; };
    // flowers, never yellow
    for (let i = 0; i < PAL.flowers; i++) {
      const x = Math.floor(r() * AW), y = cb + 4 + Math.floor(r() * (AH - cb - 4));
      if (near[y * AW + x] < outer + 12) continue;
      const c = r() < 0.6 ? K.flower : K.flower2; B.put(x, y, c); B.put(x + 1, y + 1, c);
    }
    if (PAL.spill) { // neon spill on the ground in front of each block
      const leds = KX('bldgLed');
      level.statics.forEach((st, i) => {
        if (st.kind !== 'block') return;
        const x = Math.round(st.x / U), y = Math.round((st.y + st.h) / U), w = Math.round(st.w / U), led = leds[i % leds.length];
        for (let k = 0; k < 4; k++) for (let xx = x; xx < x + w; xx++) B.mix(xx, y + k, led, [0.28, 0.18, 0.1, 0.05][k]);
      });
    }
    // hedges just outside the pavement, in runs of three, kept clear of pods, spawns and cones
    if (!city) for (let s = 40; s < geo.length; s += 150) for (const side of [-1, 1]) {
      if (r() < 0.25) continue;
      for (let k = 0; k < 3; k++) {
        const q = geo.at(s + k * 22); if (!q) continue;
        const wx = q.x + q.nx * side * (outer + 12), wy = q.y + q.ny * side * (outer + 12);
        if (wx < 8 || wy < 46 || wx > AW * U - 8 || wy > AH * U - 8 || roadD(wx, wy) < outer + 6 || !clearOf(wx, wy, 14)) continue;
        hedge(B, Math.round(wx / U), Math.round(wy / U));
      }
    }
    // trees on open lawn
    const trees = [];
    for (let t = 0; t < (city ? 0 : 400) && trees.length < 12; t++) {
      const wx = 30 + r() * (AW * U - 60), wy = 70 + r() * (AH * U - 100);
      if (roadD(wx, wy) < outer + 34 || roadD(wx, wy + 24) < outer + 20 || !clearOf(wx, wy, 34) || trees.some((q) => Math.hypot(q[0] - wx, q[1] - wy) < 90)) continue;
      trees.push([wx, wy]);
    }
    trees.sort((a, b) => a[1] - b[1]).forEach(([wx, wy]) => tree(B, Math.round(wx / U), Math.round(wy / U)));
    for (const p of level.patches || []) if (p.kind === 'puddle') puddle(B, p, r); else patchArt(B, p, r);
    for (const dk of level.decks || []) { // flyover shadows: the deck band swept down-left by its height
      const band = dk.hz ? { x: 0, y: dk.off - P['world.deckWidth'] / 2, w: AW * U, h: P['world.deckWidth'] } : { x: dk.off - P['world.deckWidth'] / 2, y: 0, w: P['world.deckWidth'], h: AH * U };
      rectShadow(B, band, dk.height, P);
    }
    for (const st of level.statics) if (st.kind !== 'river' && !st.deck && (!PAL.spill || st.kind !== 'block' || st.storeys)) rectShadow(B, st, st.height || P[st.kind === 'barrier' || st.kind === 'jersey' ? 'proto.art.barrierHeight' : st.kind === 'crate' ? 'proto.art.crateHeight' : 'proto.art.pillarHeight'], P);
    for (const f of level.floors || []) if (f.kind === 'bridge') rectShadow(B, f, P['world.highHeight'], P); // skybridges cast theirs across the alley
    for (const g of level.giveWays || []) giveWayMark(B, g, P); // Edit 56: MUTCD yield line across the approach lane
    edgeMarks(B, level);
    return B;
  }
```

#### prototypes/p6/world6.js · buildScreen (lines 1161–1298) · retrieved (22.628)
```
  function buildScreen(D, col, row) {
    const name = TILE(col, row), ox = col * W, oy = row * H, rng = PIX.rng(1000 + col * 37 + row * 101 + D.id.length * 7), plan = D.tiles[name];
    const sc = { D, name, col, row, ox, oy, props: [], layers: [], tops: [], note: plan[0] + '. Landmark: ' + plan[1] + '.', stairs: [], reserve: [], solids: [], solidsZ: [], roofs: [], floorsX: [], waterPolys: [], polys0: [], cones: [], drones: [] };
    CAP = sc.solids; // P6: every mass drawn from here is a solid of this screen
    PARKGRID = D.id === 'parkland' ? gridLines(sc) : null; // 6.2 (Edit 70)
    for (const rb of [D.roundabout, D.ring]) if (rb && rb.arms.length < P['world.roundaboutMinArms']) console.warn('a roundabout with too few arms', D.id); // Edit 52
    const RBS = (D.roundabouts || []).concat(D.roundabout ? [D.roundabout] : []), rbHere = RBS.find((q) => q.tile === name); // Edit 56: street roundabouts
    if (D.kit !== 'example') { // Edit 56 (user, 26 October): every four-way takes a roundabout, its arms 90° apart, inside its tile; a flyover only where the plan names it
      const ANG = { W: 180, N: 270, E: 0, S: 90, NW: 225, NE: 315, SE: 45, SW: 135 }, zq = (1 - P['world.junctionZone']) / 2, rS = P['world.roundaboutRadiusStreet'] + OUTER;
      for (const rb of RBS.concat(D.ring ? [D.ring] : [])) if (rb.tile === name) {
        const a = rb.arms.map((k) => ANG[k]).sort((p, q) => p - q); if (a.some((v, i) => ((a[(i + 1) % a.length] - v + 360) % 360 || 360) < 90)) console.warn('a roundabout with arms under 90° apart', D.id, name);
        const c = rb.at || [W / 2, H / 2]; if (rb !== D.ring && (c[0] - rS < 0 || c[0] + rS > W || c[1] - rS < 0 || c[1] + rS > H)) console.warn('a roundabout crossing its tile edge', D.id, name);
        if (c[0] < W * zq || c[0] > W * (1 - zq) || c[1] < H * zq || c[1] > H * (1 - zq)) console.warn('a roundabout outside the central zone', D.id, name);
      }
      if (D.flyover && !D.flyoverNamed) console.warn('a 45° flyover the plan does not name', D.id);
    }
    const runs = [];
    for (const r of D.roads) { const run = clipRun(shift(r.pts, -ox, -oy), -200, -200, W + 200, H + 200); if (run) runs.push({ id: r.id, pts: run }); }
    const decks = D.decks.filter((d) => !d.rows || d.rows.includes(row)).map((d) => ({ hz: d.hz, z: d.z, off: d.hz ? d.at - oy : d.at - ox, from: d.from != null ? d.from - (d.hz ? ox : oy) : null, noEsc: d.noEsc, escY: d.escY && d.escY[name], esc1: d.esc1 && d.esc1[name], gaps: (d.gaps || []).map(([a, b]) => [a - (d.hz ? ox : oy), b - (d.hz ? ox : oy)]) })).filter((d) => d.off > -HALF && d.off < (d.hz ? H : W) + HALF);
    const hDecks = decks.filter((d) => d.hz), vDecks = decks.filter((d) => !d.hz);
    const groundDecks = D.ring && D.ring.tile === name ? [] : hDecks;
    const lvl = (c, extra) => Object.assign({ center: c, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: groundDecks.map((d) => ({ hz: true, off: d.off, z: d.z, height: d.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] })), floors: [], canal: false, solid: [] }, extra || {});
    const J = (D.junctions || []).find((j) => j.tile === name);
    let ground, roadD, sims = [], center = runs.length ? runs[0].pts : [[-900, -900], [-850, -900]], lanes = null, busOK = runs.every((r) => X.minBend(r.pts, W, H) >= RB), patches = [];
    if (D.id === 'circus' && name === 'C1') patches = [[480, 520], [512, 552], [448, 584], [544, 496], [480, 608]].map(([x, y]) => ({ x, y, w: 32, h: 32, kind: 'puddle' })); // a flooded corner
    // ground roads and their traffic
    if (rbHere) { // a ground roundabout: every route, give way at entry, the inner lane for the third exit (Edit 52, 54). Edit 56: street radius, any centre, bent arms
      const ov = D.kit === 'example' ? {} : { 'world.roundaboutRadius': P['world.roundaboutRadiusStreet'] }, geo = L.multiRoundabout(X, Object.assign({}, P, ov), rbHere.arms, R96, rbHere.at, rbHere.bends), s = labSim(geo, 'nobus', ov);
      sims.push(s); sc.lab = s; const ca = rbHere.at || [W / 2, H / 2]; sc.islands = [{ x: ca[0], y: ca[1], r: P['world.roundaboutRadiusStreet'] + OUTER + 24 }]; // P6.1: no spawn on a roundabout's island
      ground = PIX.ground(lvl(geo.center, { ring: geo.ring.concat([geo.ring[0]]), arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops, decks: [] }), P, 23);
      const rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })).concat([{ pts: geo.ring.concat([geo.ring[0]]), dash: false }]), OUTER + 80);
      roadD = (k) => rf.D[k];
    } else if (D.geo) { // Edit 55 (example): a lab geometry built whole (realigned, staggered)
      const geo = D.geo(), s = labSim(geo, 'nobus', {});
      sims.push(s); sc.lab = s;
      ground = PIX.ground(lvl(geo.center, { arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops }), P, 29);
      const rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })), OUTER + 80);
      roadD = (k) => rf.D[k];
    } else if (J) { // a junction at 90° or 45°: the minor road gives way (Edit 49.3)
      const { arms, major } = junctionArms(runs, J.at, J.major), geo = L.junction(X, P, arms, major, P['world.junctionTurnRadius']), s = labSim(geo, 'nobus', {});
      const dirs = Object.values(arms).map((A) => Math.atan2(A[1][1] - A[0][1], A[1][0] - A[0][0]) * 180 / Math.PI); // Edit 55.1: four arms meet square
      if (dirs.length >= 3 && dirs.some((a) => dirs.some((b) => { const d = Math.abs(((a - b) % 90 + 90) % 90); return Math.min(d, 90 - d) > 2; }))) console.warn('a junction arm off 90° (realign: option A)', D.id, name); // Edit 55.2: three-way joins too
      if (dirs.length >= 4 && D.kit !== 'example') console.warn('a four-way junction without a roundabout', D.id, name); // Edit 56
      const zq = (1 - P['world.junctionZone']) / 2; if (J.at[0] < W * zq || J.at[0] > W * (1 - zq) || J.at[1] < H * zq || J.at[1] > H * (1 - zq)) console.warn('a junction outside the central zone', D.id, name); // Edit 55.2
      sims.push(s); sc.lab = s;
      ground = PIX.ground(lvl(geo.center, { arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops, patches }), P, 29 + col * 7 + row * 13);
      const rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })), OUTER + 80);
      roadD = (k) => rf.D[k];
    } else if (D.split && D.split.tile === name) {
      const sp = splitRoad(320); center = [[-200, 320], [W + 200, 320]]; lanes = [X.makePath(sp.E), X.makePath(sp.Wl)]; busOK = false; sc.split = sp;
      ground = PIX.ground(lvl([[-900, -900], [-850, -900]]), P, 41);
      tiles(ground, () => true, false);
      const m = paintSplit(ground, sp.E, sp.Wl); roadD = (k) => LW - m[k];
    } else {
      ground = PIX.ground(lvl(center, { arms: runs.length > 1 ? runs.map((r) => r.pts) : undefined, surfaces: runs.length > 1 ? [] : undefined, patches }), P, 31 + col * 7 + row * 13);
      if (runs.length > 1) lanes = [].concat(...runs.map((r) => X.lanesOf(r.pts, P)));
      if (!runs.length) lanes = []; // P6: a screen with no ground road (the Waterfront's hilltop)
      const rf = PIX.roadField(runs.map((r) => ({ pts: r.pts, dash: false })), OUTER + 80);
      roadD = (k) => rf.D[k];
    }
    const B = ground; sc.B = B;
    const rd = (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH ? roadD(k) : 1e9; };
    const roadOk = (wx, wy, m) => rd(wx, wy) > (m || OUTER + 4);
    sc.roadC = (wx, wy) => rd(wx, wy); // P6.2: distance to the nearest Z0 road centre line (walkway openings)
    // highways, each with its two escalators
    let ringSim = null;
    if (D.ring && D.ring.tile === name) { // the Z1 ring (Parkland): a four-arm roundabout lifted onto the deck
      const cy = hDecks.length ? hDecks[0].off : H / 2, cx = vDecks.length ? vDecks[0].off : W / 2; // Edit 55.2: centred where the highways cross
      const ov = { 'world.roundaboutRadius': P['world.deckRingRadius'], 'traffic.ringFill': P['world.deckRingFill'] }, Pr = Object.assign({}, P, ov), geo = L.multiRoundabout(X, Pr, D.ring.arms, R96, [cx, cy]); // Edit 53.1: entry metered (Edit 54: the inner lane for the third exit only, as every ring)
      ringSim = labSim(geo, 'nobus', ov); sc.ringSim = ringSim;
      const Rc = P['world.deckRingRadius'];
      sc.stairs = escalators(cy, 1, HALF); if (D.id === 'parkland') alignFlights(sc, sc.stairs, roadOk); // 6.2 (Edit 70): flights on the garden's paths
      const rr = { geoms: [{ pts: geo.ring.concat([geo.ring[0]]), dash: true }].concat(geo.arms.map((pts) => ({ pts, dash: true })), geo.roads.map((pts) => ({ pts }))), inner: D.id === 'parkland' ? holeOpenings(sc, cx, cy, Rc - HALF) : [] }; // 6.2: the hole's parapet open over the road beneath
      const ringDeck = ringLayer(rr, 1, cx, cy, Rc, (x, y) => !roadOk(x, y, OUTER + C + 4) || sc.stairs.some((st) => x > st.x - C && x < st.x + st.w + C && Math.abs(y - st.y - st.h / 2) < st.h / 2 + HALF), sc.stairs.map((st) => [st.x + 2, st.x + st.w - 2, st.side]), D.id === 'parkland' ? turfC : null); // P6.4: Parkland's ring planted on its shoulders
      ringDeck.front = 1e5; ringDeck.extend = true; ringDeck.cars = () => ringSim.cars.concat((sc.seam || []).filter((g) => g.deck)); // P5.3: and highway cars arriving from next door
      sc.layers.push(ringDeck); sc.ringDeck = ringDeck;
      // 6.2 (Edit 70): no island. The ring's hole stands open over the boulevard; the dummy steps off its inner edge onto the traffic below
    } else {
      for (const d of hDecks) {
        const st = escalators(d.off, d.z, HALF); if (D.id === 'parkland') alignFlights(sc, st, roadOk); sc.stairs.push(...st);
        const gp = ACCESS && ACCESS.dropGaps && !(d.gaps && d.gaps.length) ? deckDropGaps(d.off, true, st.map((q) => ({ a0: q.x, a1: q.x + q.w, side: q.side })), rd) : []; // Edit 85
        sc.layers.push(straightDeck(d.off, d.z, roadOk, st, gp));
      }
      const cq = D.chongqing && D.chongqing.tile === name ? D.chongqing : null; // Edit 54: the west escalator lands on the roof plaza instead
      const links = ((D.deckLinks || {})[name] || []).concat(cq ? [{ y: cq.link[0], h: cq.link[1] - cq.link[0], side: -1 }] : []); // Edit 55.2: walkway and roof links
      for (const d of vDecks) {
        const st = d.noEsc ? (ACCESS && ACCESS.flightsMin && d.esc1 ? [deckFlight(d.off, d.z, d.esc1[0], d.esc1[1])] : []) : vEscalators(d.off, d.z, d.escY).filter((q, i) => !cq || i === 1); if (D.id === 'parkland') alignFlights(sc, st, roadOk); sc.stairs.push(...st); // Chongqing: the north flight lands on the roof plaza instead; Edit 85: a bridge's one flight
        let gaps = d.gaps.filter(([a, b]) => b > 0 && a < H).map(([a, b]) => [-1, 1].map((side) => ({ y: a, h: b - a, side, gap: true }))).flat(); // P6: broken parapets (drops)
        if (!gaps.length && ACCESS && ACCESS.dropGaps) gaps = deckDropGaps(d.off, false, st.concat(links).map((q) => ({ a0: q.y, a1: q.y + q.h, side: q.side })), rd).map((g) => ({ y: g.a0, h: g.a1 - g.a0, side: g.side, gap: true })); // Edit 85
        const wl = D.id === 'waterfront' ? WSTAIRS.filter((q) => q.axis === 'x' && Math.abs(Math.abs(q.high - ox - d.off) - HALF) < 2).map((q) => ({ y: q.y - oy, h: q.h, side: q.high - ox < d.off ? -1 : 1 }))
          .concat(VP.walkways.filter((w) => w.pts[0][1] === w.pts[1][1]).flatMap((w) => w.pts.filter((q) => Math.abs(Math.abs(q[0] - ox - d.off) - HALF) < 2).map((q) => ({ y: q[1] - oy - P['world.walkwayWidth'] / 2, h: P['world.walkwayWidth'], side: q[0] - ox < d.off ? -1 : 1 })))) : []; // P6: the bridge escalators open the parapet; P6.3: so does a walkway's join
        const l = vDeck(d.off, d.z, roadOk, st, links.concat(gaps, wl)); l.from = d.from; sc.layers.push(l);
        if (d.from != null && d.from > 0) { l.L.d.fill(0, 0, Math.min(AH, Math.round(d.from / U)) * AW); l.cols = l.cols.filter((c) => c.cy > d.from + C); } // P6: on the hill the bridge is a street (drawn with the hill)
      }
    }
    let flySim = null;
    if (D.flyover) { // Edit 55 (example): the 45° road on a Z1 deck over the W–E road; its own traffic, which never meets the road below
      flySim = sceneSim(D.flyover, [], [], X.lanesOf(D.flyover, P), false); flySim.raised = true;
      const fl = ringLayer({ geoms: [{ pts: D.flyover, dash: true }] }, 1, 400, 320, 0, (x, y) => !roadOk(x, y, OUTER + C + 4), []);
      fl.front = 1e5; fl.cars = () => flySim.cars; sc.layers.push(fl);
    }
    if (D.id === 'waterfront') waterPre(sc, B, name, roadOk, runs); // P6: the valley's terrain, layers and stairs before the stairs are drawn
    for (const st of sc.stairs) { sc.props.push(stairProp(st, st.z === 2 ? Z2 : Z1)); const fx = st.axis === 'x' ? (st.side < 0 ? st.x : st.x + st.w) : st.x + SWD / 2, fy = st.axis === 'x' ? st.y + st.h / 2 : (st.side > 0 ? st.y + st.h : st.y); if (rd(fx, fy) < LW) console.warn('escalator foot in a lane', D.id, name); }
    let bk = null, bkOf = null, bkN = -1; // P6.3: every flight and its apron, as the kit adds flights
    const blocked = () => { if (bkOf !== sc.stairs || bkN !== sc.stairs.length) { bkOf = sc.stairs; bkN = sc.stairs.length; bk = sc.stairs.map((st) => [st.x - 24, st.y - 24, st.w + 48, st.h + 48]).concat(sc.stairs.map((st) => { const a = apronOf(st); return [a.x - 8, a.y - 8, a.w + 16, a.h + 16]; }), sc.stairs.map(foreOf)); } return bk; }; // 6.2 (Edit 70): and a forecourt beyond the apron
    const underDeck = (wx, wy) => sc.layers.some((l) => l.inBand(wx, wy));
    const inRects = (rs, wx, wy, m) => rs.some((r) => wx > r[0] - m && wx < r[0] + r[2] + m && wy > r[1] - m && wy < r[1] + r[3] + m);
    const free = (wx, wy, m) => roadOk(wx, wy, OUTER + (m || 24)) && !underDeck(wx, wy) && !inRects(blocked(), wx, wy, 0) && !inRects(sc.reserve, wx, wy, 0);
    // ---- the district's kit
    if (D.kit === 'example') { gardenPave(B, (wx, wy) => roadOk(wx, wy, OUTER), null); }
    else if (D.id === 'parkland') parkTile(sc, B, name, roadOk, free, rng, runs);
    else if (D.id === 'waterfront') waterTile(sc, B, name, roadOk, free, rng, runs);
 
/* … excerpt cut … */
```

#### prototypes/p6/game.js · drawTouchEdit (lines 469–479) · retrieved (22.443)
```
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

#### prototypes/p6/game.js · wsLocked (lines 2880–2880) · retrieved (22.396)
```
  const wsLocked = () => false; // Edit 91: Arcade sells every part; Story has no workshop (its parts come by drone)
```

#### prototypes/p6/sim.js · Sim.flip (lines 3372–3398) · retrieved (22.107)
```
    flip(sd, to) {
      const D = this.district, b = this.body, P = this.P, from = D.cur.slice();
      // settle the screen being left: cones in flight land, cones on a drone go home, the held cone travels
      for (const cn of this.cones) {
        if (cn.state === 'flight') Object.assign(cn, { state: 'free', vx: 0, vy: 0 });
        if (cn.state === 'drone') Object.assign(cn, { state: 'free', x: cn.hx, y: cn.hy });
      }
      const held = this.carriedCones().slice(), net = this.netOn(); // Edit 78: every cone carried travels
      if (net) this.saveCell(this.cellOf(from)); // P5.3: the screen left keeps running
      if (held.length) { const old = D.cells[from[1]][from[0]]; old.cones = old.cones.filter((c) => !held.includes(c)); }
      if (net) this.effects = [];
      else { this.cars = []; this.drones = []; this.effects = []; this.booms = {}; } // only the active screen runs: its traffic, drones and effects end here
      const dk0 = this.bodyDeck() != null ? this.level.decks[this.bodyDeck()] : null;
      D.cur = to; D.visited.add(to[1] * D.cols + to[0]);
      if (net) this.loadCell(this.cellOf(to)); else this.level = cellLevel(D, to, P);
      this.cones = this.conesFor(this.level);
      for (const h of held) this.cones.push(h);
      b.x -= SIDE[sd][0] * P['world.width']; b.y -= SIDE[sd][1] * P['world.height'];
      if (dk0) { const k = this.level.decks.findIndex((q) => q.hz === dk0.hz && q.off === dk0.off && (q.z || 1) === (dk0.z || 1)); b.floor = k >= 0 ? (this.level.floors || []).findIndex((f) => f.kind === 'deck' && f.deck === k) : -1; if (b.floor < 0) { b.level = 0; b.floor = null; } } // the level carries over
      if (net) this.netView(); // the traffic is already here
      else { this.fillDeckCars(); this.nextAt = this.t + 0.5; } // traffic on the new screen arrives from its own road ends
      D.lastFlip = { side: sd, from, to, t: this.t };
      this.phase = 'scroll'; this.phaseT = P['world.flipSeconds'];
      this.emit('screen', { from: cellName(from), to: cellName(to), side: sd, theme: this.level.theme, focal: this.level.focal || null, level: b.level, turns: D.cells[to[1]][to[0]].turns || null });
      this.mile('firstScreen', { to: cellName(to) });
      if (D.visited.size === D.cols * D.rows) this.mile('districtExplored', { road: this.roadIndex + 1 });
    }
```

#### prototypes/p6/world6.js · face (lines 353–362) · retrieved (21.985)
```
    const face = (v, x, z, sl) => {
      const base = sl < 0 ? CON.d : sl > 0 ? CON.l : CON.m, f = z - v.b, fl = Math.floor(f / STY), r = f % STY;
      if (z === 0) return CON.x;
      if (v.kind === 'podium' && f < STY) return x % 6 === 0 ? base : f === STY - 1 ? led : CON.x; // pilotis, a lit shop line
      if (v.banner && x >= v.x0 + 3 && x <= v.x0 + 4 && f >= STY && z < v.t - 2) return fl % 2 ? led : mixK(led, K.white, 0.45); // an LED banner
      if (r === STY - 1) return sl > 0 ? CON.l : mixK(base, CON.l, 0.5); // slab edge
      if (v.fins && x % 3 === 0) return base;
      if (r === 1 || r === 2) { const q = hsh(x + v.seed, fl * 7 + v.y0) % 17; return q === 0 ? mixK(CON.x, led, 0.7) : q === 1 ? mixK(CON.x, K.white, 0.3) : CON.x; } // deep window slots
      return x % 4 === 0 ? darker(base) : base;
    };
```

#### prototypes/p6/world6.js · box (lines 897–900) · retrieved (21.729)
```
    const box = (x0, x1, y0, y1, b, h, top, front, led) => { // a footprint x0..x1 × y0..y1, its base b and height h: top face, front face, a lit coping
      for (let y = y0 - b - h; y <= y1 - b - h; y++) for (let x = x0; x <= x1; x++) put(x, y, x === x0 || x === x1 || y === y0 - b - h ? CON.l : top);
      for (let y = y1 - b - h + 1; y <= y1 - b; y++) for (let x = x0; x <= x1; x++) put(x, y, y === y1 - b - h + 1 && led ? led : x === x0 || x === x1 ? CON.d : front);
    };
```

#### prototypes/p6/pixel.js · skybridge (lines 794–806) · retrieved (21.401)
```
  function skybridge(wpx, hpx, lift, alongX) {
    const face = alongX ? 3 : 0, S = spr(wpx, hpx + face, 0, lift), led = KX('bldgLed') ? KX('bldgLed')[2] || KX('bldgLed')[0] : K.lane;
    for (let j = 0; j < hpx + face; j++) for (let i = 0; i < wpx; i++) {
      const a = alongX ? i : j, b = alongX ? j : i, wide = alongX ? hpx : wpx;
      let c;
      if (b >= wide) c = b === wide + face - 1 ? K.bldgOutline : b === wide ? K.jerseyTop : K.column; // girder face
      else if (b === 0 || b === wide - 1) c = K.bldgOutline;
      else if (b === 1 || b === wide - 2) c = a % 4 === 1 ? led : K.jerseyTop; // rails
      else c = a % 8 === 0 ? K.deckJoint : K.deck;
      sput(S, i, j, c);
    }
    return S;
  }
```