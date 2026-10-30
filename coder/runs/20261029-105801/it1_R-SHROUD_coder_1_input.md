# Task
Write the code for requirement R-SHROUD. Release tag for comments: `Edit 94 (P7.13)`. Output the blocks your system prompt defines.

# The requirement (with its acceptance probes)
```json
{
 "id": "R-SHROUD",
 "title": "Shroud the circus's monument until Waterfront B2 clears",
 "statement": "The circus's monument is shrouded until B2 clears. It no longer stands uncovered from the start of the story.",
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
 "spec_gap": "The GDD does not say what the shroud looks like, what Arcade's Waterfront shows, or whether the shroud is solid or only a cover over the monument's existing footprint.",
 "impact": "reward",
 "depends_on": [],
 "touches": [
  {
   "file": "prototypes/p7/story.js",
   "symbol": "P7SIM, StorySim.monumentShrouded",
   "why": "the flag, and the shroud's state read from Story's progress"
  },
  {
   "file": "prototypes/p6/world6.js",
   "symbol": "dummyMonument, drawMonument",
   "why": "draw the shroud over the monument in Waterfront B2"
  },
  {
   "file": "prototypes/p6/game.js",
   "symbol": "drawLive6",
   "why": "draw the shroud while the sim reports it shrouded"
  },
  {
   "file": "content/params/tuning.parameters.json",
   "symbol": "world.monumentShroud",
   "why": "register the flag"
  }
 ],
 "registry_uses": [
  "world.dummyMonument"
 ],
 "registry_new": [
  {
   "id": "world.monumentShroud",
   "default": 1,
   "unit": "flag",
   "type": "number",
   "description": "P7: the DUMMY MONUMENT in Waterfront B2 is shrouded in Story until Waterfront B2 clears (Edit 92 §3.2, D76)"
  }
 ],
 "contract": "StorySim.monumentShrouded() returns true while Waterfront B2 is not cleared and false once it is. The flag 'world.monumentShroud' is in P7SIM. ArcadeSim.monumentShrouded() is absent or returns false. The 6.10 world has no monument.",
 "probes": [
  {
   "id": "p1",
   "kind": "sim",
   "say": "with Waterfront A1 in test, the monument is shrouded",
   "expr": "const s = H.story('waterfront', H.progress('waterfront', 'A1'));\nconst v = !!s.monumentShrouded?.();\nreturn { ok: v, detail: 'shrouded ' + v };"
  },
  {
   "id": "p2",
   "kind": "sim",
   "say": "shrouded with B2 in test; unshrouded once the certifying write-off clears B2",
   "expr": "const a = H.story('waterfront', H.progress('waterfront', 'B2'));\nconst before = !!a.monumentShrouded?.();\nconst s = await H.certify({});\nawait H.settle(s);\nconst has = typeof s.monumentShrouded === 'function';\nconst after = has ? !!s.monumentShrouded() : null;\nreturn { ok: before && has && after === false, detail: 'before ' + before + ', after ' + after };"
  },
  {
   "id": "p3",
   "kind": "registry",
   "say": "the shroud flag is registered",
   "reg": "world.monumentShroud"
  },
  {
   "id": "p4",
   "kind": "sim",
   "say": "guard: with the flag in P7SIM, Arcade's monument is unshrouded and 6.10 has none",
   "expr": "const flag = 'world.monumentShroud' in H.STORY.P7SIM;\nconst a = H.arcade('waterfront');\nconst s6 = H.sim6('waterfront');\nconst arc = !!a.monumentShrouded?.();\nconst m6 = !!H.scene(s6, 'B2')?.dummyMonument;\nreturn { ok: flag && !arc && !m6, detail: 'flag ' + flag + ', arcade shrouded ' + arc + ', 6.10 monument ' + m6 };"
  },
  {
   "id": "p5",
   "kind": "page",
   "say": "in the page, Waterfront B2 in test shows the shrouded monument",
   "expr": "await G.openStory(await G.certifyProgress({}));\nconst v = await G.eval(() => { const s = window.__dummies?.sim; return { tile: s?.screenName?.(), shrouded: !!s?.monumentShrouded?.() }; });\nawait G.shot('shroud_b2');\nreturn { ok: v.tile === 'B2' && v.shrouded, detail: JSON.stringify(v) };"
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

### P7#evidence~2 (rank 93)
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

### EDIT93#3.1 (rank 93)
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

# Decision
D76 (closed): The finale and the reward for clearing: the monument shrouded until B2, its unveiling, the plaque with the run's numbers, the drone to the ship at B3, credits over the voyage; Second Market (the city again, the cars' learning kept)
Notes: Raised 28 October (GDD Edit 92 §3.2); **closed 29 October:** the unveiling and the ship (row 533). Credits and Second Market move to D77
| 533 | The finale is the unveiling and the ship: the circus's monument shrouded until Waterfront B2 clears; its unveiling, with the plaque showing the run (chassis spent, points, best combo, time); a Farsight drone lifts the dummy over the river to the container ship at Waterfront B3, every crate carrying its face. The ending screen follows | user-decided: "Unveiling and ship" (29 October) | The reward for clearing is seen, not only read | Credits over the voyage and Second Market wait (D77) | Closes D76; GDD Edit 92 §3.2 |

# Built earlier by this agent (use their interfaces)
Nothing yet.

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

### Excerpts
#### prototypes/p7/story.js · P7SIM (lines 36–36) · named by the requirement
```
  const P7SIM = { 'proto.recoilScale': 0.7, 'proto.bounce.maxThrow': 40, // Edit 83: the ricochet the dummy survives; Arcade and Story
```

#### prototypes/p6/world6.js · dummyMonument (lines 914–920) · named by the requirement
```
  function dummyMonument(sc, B, at) {
    const [cx, cy] = at, x0 = cx / U, y0 = cy / U, R = 25;
    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) { const d = Math.hypot(x, y); if (d > R) continue; B.put(x0 + x, y0 + y, d > R - 1.5 ? ((Math.round(Math.atan2(y, x) * 12) % 2) ? N.cyan : CON.l) : (x % 6 === 0 || y % 6 === 0) ? CON.m : ISL); } // paving and an LED ring
    for (let t = 0; t < 40; t++) for (let j = -9; j <= 9; j++) B.shade(x0 - 4 - t * 0.7 + j * 0.7, y0 + t * 0.7 + j * 0.7, 0.7); // the long shadow, down-left
    captureRect(cx - 44, cy - 18, 88, 36, 'sculpture');
    sc.props.push({ spr: dummyStatue(), x: x0, y: y0, by: cy + 18, bldg: 'dummy monument' }); sc.dummyMonument = { cx, cy };
  }
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

#### prototypes/p6/game.js · drawLive6 (lines 1800–1862) · named by the requirement
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

#### prototypes/p6/world6.js · WATER (lines 709–709) · retrieved (61.439)
```
  const WATER = { id: 'waterfront', name: 'Waterfront', quota: P['world.district.waterfront.quota'], storeys: [4, 10], start: ['B2', 'center'],
```

#### prototypes/p6/world6.js · Sim6.constructor (lines 2050–2059) · retrieved (46.84)
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

#### prototypes/p6/world6.js · customsSign (lines 984–989) · retrieved (37.828)
```
  function customsSign(S, plinth) { // Waterfront A3, C3: the pier towers are customs posts: CUSTOMS on the plinth, lit
    const B2 = onSpr(S), t = 'CUSTOMS', tw = PIX.smallWidth(t), y = S.h - plinth + 3, x = Math.round(S.w / 2 - tw / 2);
    for (let yy = y - 2; yy < y + 8; yy++) for (let xx = x - 3; xx < x + tw + 3; xx++) B2.put(xx, yy, yy === y - 2 || yy === y + 7 ? N.cyan : c32('#0A0F1E'));
    PIX.smallText(B2, t, x, y, K.white);
    return S;
  }
```

#### prototypes/p6/world6.js · welcomeWall (lines 926–935) · retrieved (32.855)
```
  function welcomeWall(S, H0) { // Monument A1: the LED wall greets the new chassis: its face in the screen's cyan, WELCOME, NEW STAFF
    const top = S.h - Math.round(H0 * 0.85), bot = S.h - 4, x0 = 3, x1 = S.w - 5, B2 = onSpr(S), DK = [c32('#0B1530'), c32('#0F1D3E')];
    for (let y = top + 1; y < bot - 1; y++) for (let x = x0 + 1; x < x1; x++) B2.put(x, y, DK[y % 2]);
    const D = PIX.doll({}, '', []), cx0 = 14, cy0 = 4, cw = 36, ch = Math.min(31, bot - top - 4), fx = x0 + 8, fy = top + Math.max(2, Math.round((bot - top - ch) / 2));
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) { const c = D.d[(cy0 + j) * D.w + cx0 + i]; if (!c) continue; const l = lumOf(c);
      B2.put(fx + i, fy + j, (fy + j) % 2 && l > 0.3 ? mixK(N.cyan, K.white, 0.25) : l > 0.78 ? K.white : l > 0.55 ? mixK(N.cyan, K.white, 0.45) : l > 0.3 ? N.cyan : mixK(N.cyan, DK[0], 0.7)); }
    const tx = fx + cw + 8, ty = top + Math.round((bot - top) / 2) - 9;
    PIX.smallText(B2, 'WELCOME', tx, ty, K.white); PIX.smallText(B2, 'NEW STAFF', tx, ty + 9, N.magenta); PIX.smallText(B2, 'FARSIGHT', tx, ty + 18, N.cyan);
    return S;
  }
```

#### prototypes/p6/world6.js · shopSigns (lines 936–944) · retrieved (32.415)
```
  function shopSigns(S, H0, k) { // Monument A2: the neon shops: two shopfronts, a lit sign over each, the windows below
    const top = S.h - Math.round(H0 * 0.85), bot = S.h - 4, x0 = 3, x1 = S.w - 5, B2 = onSpr(S), n = 2, w = (x1 - x0 - 2) / n, words = [['OPEN', 'SALE'], ['24H', 'NEW']][k % 2], cols = [N.magenta, N.cyan, LEDS[2 % LEDS.length]];
    for (let q = 0; q < n; q++) {
      const a = Math.round(x0 + 1 + q * w), b = Math.round(x0 + 1 + (q + 1) * w) - 2, col = cols[(q + k) % 3], sh = Math.min(8, bot - top - 4);
      for (let y = top + 1; y < bot - 1; y++) for (let x = a; x <= b; x++) B2.put(x, y, y < top + 1 + sh ? (y === top + 1 || y === top + sh || x === a || x === b ? col : c32('#0A0F1E')) : (x === a || x === b) ? K.bldgOutline : (y + x) % 5 === 0 ? K.white : mixK(col, c32('#0A0F1E'), 0.55));
      const t = words[q], tw = PIX.smallWidth(t); PIX.smallText(B2, t, Math.round((a + b) / 2 - tw / 2) + 1, top + 2 + Math.max(0, Math.floor((sh - 6) / 2)), K.white);
    }
    return S;
  }
```

#### prototypes/p6/world6.js · Sim6.canCross (lines 2354–2354) · retrieved (30.169)
```
    canCross() { return true; } // Edit 81: the story fences a tile until it is cleared (p7/story.js)
```

#### prototypes/p6/sim.js · Sim.ringStep (lines 2593–2626) · retrieved (27.902)
```
    ringStep(c) {
      const P = this.P, rg = c.path.ring;
      if (!rg || !(P['traffic.ringOrbit'] > 0) || lay(c) !== 0) return false;
      const g = c.path.giveWay, Lc = P['traffic.ringLaneChange'];
      if (c.orbit && c.orbit.lane === 'out' && Math.abs(c.d) < 0.5) { c.orbit = null; c.ringOutT = this.t; }
      const shift = (d1, vR) => this.commit(c, { type: 'shift', d1, len: Lc, vCap: Math.min(c.cruise, Math.sqrt(P['traffic.cornerAccel'] * vR)) }, 'ring', null);
      if (c.orbit && c.orbit.lane === 'in' && c.s >= rg.exitS - 2) { // past the change point on the inner lane (never planned): move out when the lane is clear
        if (this.ringLaneClear(c, false)) { c.orbit.lane = 'out'; c.orbit.wait = null; shift(0, rg.Rout); return true; }
        c.orbit.wait = 0; return false;
      }
      if (c.s <= g.sj + c.L / 2 || c.s >= rg.exitS) return false;
      const q = pathAt(c.path, c.s), inward = (rg.cx - q.x) * q.nx + (rg.cy - q.y) * q.ny > 0 ? 1 : -1, dIn = inward * P['world.laneWidth'];
      const lap = 2 * Math.PI * rg.Rout, rem0 = rg.exitS - c.s;
      if (!c.orbit) { // move in for a blocked exit, or to pass a stopped or crawling car, any time before the change point
        const spare = rem0 - Lc - 20, ie = P['traffic.ringInnerExit'], far = !(ie > 0) || (rg.exitNo || 0) >= ie, blocked = this.ringExitBlocked(c);
        if (!far && !blocked) return false; // Edit 54: only a car leaving at traffic.ringInnerExit or later (the third exit, 270°) uses the inner lane; a blocked exit means a full lap more, so that car may too
        const plan = far && ie > 0 && !c.ringInnerDone; // ...and it moves in once it has joined
        if (spare < 0 || this.t - (c.ringOutT || -9) < 3 || !(plan || blocked || (far && spare > Lc && this.ringCrawl(c))) || !this.ringLaneClear(c, true)) return false;
        if (plan) c.ringInnerDone = true;
        c.orbit = { lane: 'in', laps: 0 }; shift(dIn, rg.Rin); this.emit('ring', { car: c.id, to: 'inner', planned: plan }); return true;
      }
      if (c.orbit.lane === 'out' && Math.abs(c.d) > 0.5) { // a move out was cut short: finish it, or go back in
        if (this.ringLaneClear(c, false)) shift(0, rg.Rout); else { c.orbit.lane = 'in'; shift(dIn, rg.Rin); } return true;
      }
      if (c.orbit.lane !== 'in') return false;
      if (Math.abs(c.d - dIn) > 0.5) { shift(dIn, rg.Rin); return true; } // a move in was cut short: finish it
      const rem = rg.exitS - c.s, last = false; // Edit 53.1: every lap can repeat
      if (rem < Lc + 0.5 * lap && rem > (last ? 0 : Lc + 8) && (last || !this.ringExitBlocked(c)) && this.ringLaneClear(c, false)) {
        c.orbit.lane = 'out'; c.orbit.wait = false; shift(0, rg.Rout); this.emit('ring', { car: c.id, to: 'outer', laps: c.orbit.laps }); return true;
      }
      if (rem <= Lc + 10) { this.ringLap(c); c.orbit.laps++; }
      c.orbit.wait = null; // Edit 53.1: no last lap; the car orbits until its exit and the outer lane are clear (a waiting car could lock the ring)
      return false;
    }
```

#### prototypes/p6/world6.js · roomAt (lines 1845–1849) · retrieved (25.579)
```
  function roomAt(Wd, g, r, s0, ahead, behind) { // clear ahead along the inlet's lanes, and no car coming up behind across the seam
    for (const c of groupCars(g)) if (c.s + c.L / 2 > s0 - 40 && c.s - c.L / 2 < s0 + ahead) return false;
    for (const q0 of g.recs) for (const q of q0.prev) for (const c of q.s.cars) { if (!sameRec(recOf(q.s, c), q)) continue; if (q.ends.out.s - c.s < behind + c.L) return false; } // Edit 71: a lap variant counts as its route
    return true;
  }
```

#### prototypes/p6/sim.js · Sim.netFill (lines 3562–3616) · retrieved (25.188)
```
    netFill() { // the start: every lane already running, the shift's first cars spread along the road at the steady headway
      const P = this.P, net = this.net, b = this.body, iv = this.admissionInterval(), g = (i, o) => ((i * 0.6180339887 + o) % 1);
      const chain = (src) => {
        const segs = []; let q = src.q, ln = src.lane, s0 = 0, at = 0;
        for (let k = 0; k < 64 && ln; k++) {
          const s1 = ln.next ? ln.ends.out.s : ln.path.length;
          segs.push({ q, ln, s0, s1, at }); at += s1 - s0;
          if (!ln.next) break;
          s0 = ln.next.lane.ends.in.s; q = ln.next.q; ln = ln.next.lane;
        }
        return { segs, length: at };
      };
      const where = (ch, x) => { const z = ch.segs.find((sg) => x >= sg.at && x < sg.at + sg.s1 - sg.s0); return z ? { q: z.q, ln: z.ln, s: z.s0 + x - z.at } : null; };
      const clear = (q, ln, s, layer) => { if (q !== this.netCur || !b || !b.alive) return true; const p = pathAt(ln.path, s); return !(this.bodyLayer() === layer && hyp(p.x - b.x, p.y - b.y) < P['vehicles.van.length'] * 2); };
      // ground: two lanes share the shift's admission clock, so each lane runs at twice traffic interval
      // the spacing is phased so a car stands on each lane of the start screen from the first frame
      const hw = 2 * iv * P['vehicles.sedan.cruiseSpeed'], spots = net.ground.map((src, li) => {
        const ch = chain(src), out = [], st = ch.segs.find((sg) => sg.q === this.netCur), lo = 0.4 * hw, hi = ch.length - P['vehicles.bus.length'];
        const x0 = st ? st.at + (st.s1 - st.s0) * (0.35 + 0.3 * g(li, 0.5)) : lo, xs = [];
        for (let x = x0, j = 0; x >= lo; j++, x -= hw * (0.8 + 0.4 * g(j, 0.37 + 0.21 * li))) xs.push(x);
        for (let x = x0, j = 0; ; j++) { x += hw * (0.8 + 0.4 * g(j, 0.71 + 0.21 * li)); if (x >= hi) break; xs.push(x); }
        for (const x of xs.filter((v) => v < hi).sort((a, b2) => a - b2)) { // a spot beside the dummy slides along the lane until clear
          const w = [0, -80, 80, -160, 160, -240, 240].map((d) => where(ch, x + d)).find((q) => q && clear(q.q, q.ln, q.s, 0));
          if (w && !out.some((o) => o.q === w.q && Math.abs(o.s - w.s) < 0.5 * hw)) out.push(w);
        }
        return out.reverse(); // farthest first: the shift's first car has come furthest
      });
      while (this.slot < this.schedule.length && spots.some((l) => l.length)) {
        const sl = this.schedule[this.slot];
        let k = net.ground.findIndex((src) => src.lane.i === sl.lane);
        if (k < 0 || !spots[k].length) k = spots.findIndex((l) => l.length);
        const w = spots[k].shift(); sl.lane = net.ground[k].lane.i;
        if (sl.cls === 'bus' && !net.busOK) sl.cls = 'sedan';
        this.inCell(w.q, () => {
          const c = this.newCar('car' + (++this.carSeq), sl.cls, w.ln.i, w.ln.path, w.s, 0);
          c.slot = sl.i; c.v = Math.min(c.v, this.cornerSpeed(c)); this.pose(c);
          this.cars.push(c); this.emit('admit', { car: c.id, cls: c.cls, model: c.model, lane: c.lane, fwdLen: +c.fwdLen.toFixed(2), prefill: true });
        });
        this.slot++; this.run.admitted++;
      }
      const nx = this.schedule[this.slot];
      this.nextAt = this.t + 0.5 * iv * (nx ? nx.mult : 1);
      // highways: fillDeckCars along each deck from the district edge
      const gap = P['world.deckInterval'] * P['traffic.deckGapScale'] * P['vehicles.sedan.cruiseSpeed'] * P['traffic.deckSpeedScale'];
      net.decks.forEach((src, li) => {
        const ch = chain(src);
        for (let x = ch.length - P['vehicles.van.length'] - gap * (0.3 + 0.4 * g(li, 0.1)); x > P['vehicles.van.length']; x -= gap) {
          const w = where(ch, x);
          if (!w || !clear(w.q, w.ln, w.s, src.lane.layer)) continue;
          this.inCell(w.q, () => { const c = this.addDeckCar(w.ln.i - 2, w.s); c.v = Math.min(c.v, this.cornerSpeed(c)); this.pose(c); });
        }
        src.q.tr.deckNext[src.lane.i - 2] = this.t + P['world.deckInterval'] * P['traffic.deckGapScale'] * (0.4 + 0.5 * g(li, 0.3));
      });
      this.deckNext = this.netCur.tr.deckNext;
    }
```

#### prototypes/p6/game.js · startLevelNow (lines 154–179) · retrieved (25.179)
```
  function startLevelNow(i, carry) {
    if (!carry) app.roads = [];
    app.level = i; app.roadCarry = carry || null;
    // Edit 41: each run plays one of the three baked layouts per district, at random (tuning: proto.layout fixes one)
    const nL = ((window.DISTRICT_DB || {}).districts || {})[LEVEL_LIST[i]], nLay = nL && nL.length ? nL.length : 1;
    const layout = app.tune['proto.layout'] != null ? app.tune['proto.layout'] : 1 + Math.floor(Math.random() * nLay);
    app.sim = W6 && app.mode === 'story' && STORY ? new STORY.StorySim(LEVEL_LIST[i], Object.assign({ 'proto.difficulty': app.difficulty }, app.tune, FIELD), app.story) // Edit 81: the district's tile in test
      : W6 && STORY ? new STORY.ArcadeSim(LEVEL_LIST[i], Object.assign({ 'proto.difficulty': app.difficulty }, app.tune, FIELD), carry) // Edit 81: Arcade plays one district a run; Edit 84: its verbs come by drone
      : W6 ? new W6.Sim6(LEVEL_LIST[i], Object.assign({ 'proto.difficulty': app.difficulty }, app.tune, FIELD), carry)
      : new Sim(LEVEL_LIST[i], Object.assign({ 'proto.difficulty': app.difficulty, 'proto.layout': layout }, app.tune, FIELD), carry);
    app.tuned = Object.keys(app.tune).length > 0;
    app.screen = 'game'; app.paused = false; app.lastEv = 0; app.shopCol = 0; app.shopRow = 0; app.endSel = 0;
    app.confirmRefuse = false; clearEdges();
    fx.marks = []; fx.fit = null; fx.barks.clear(); fx.barked.clear(); fx.partWatch = null; fx.partsSeen.clear(); fx.learnWatch.clear(); fx.pendingLearned = null;
    fx.rings = []; fx.streaks = []; fx.bubbles.clear(); fx.carBarkT.clear(); fx.cars.clear(); fx.nm.clear(); fx.nmDone.clear();
    fx.lungeWatch = null; fx.lastImpact = null; fx.upgradeWatch = null; if (!carry) fx.pendingNodes = [];
    app.present = [];
    // D24: build every screen of the district now (a short pause at the start, none at the edges)
    const D = app.sim.district;
    if (D && !W6) {
      const all = [];
      for (let y = 0; y < D.rows; y++) for (let x = 0; x < D.cols; x++) all.push([x, y, window.DUMMIES.cellLevel(D, [x, y], app.sim.P)]);
      for (const [x, y, lv] of all) { lv.blockedEdges = window.DUMMIES.edgeSpans(D, [x, y], app.sim.P); levelArt({ level: lv, P: app.sim.P }); }
    }
    fx.seenScreens = new Set(D ? [app.sim.screenName()] : []);
  }
```

#### prototypes/p6/pixel.js · monument (lines 826–840) · retrieved (24.65)
```
  function monument(wpx, hpx, H) {
    const S = spr(wpx, hpx + H, 0, H), P = (x, y, c) => sput(S, x, y + H, c), o = K.bldgOutline, led = KX('bldgLed') ? KX('bldgLed')[0] : K.modGlow;
    for (let y = hpx - 6; y < hpx; y++) for (let x = 0; x < wpx; x++) P(x, y, x === 0 || x === wpx - 1 || y === hpx - 1 ? o : K.bldgFace); // plinth
    for (let y = 0; y < hpx - 6; y++) for (let x = 2; x < wpx - 2; x++) P(x, y, K.bldgRoof); // footprint top
    const sw = Math.max(6, Math.round(wpx * 0.4)), sx = Math.round((wpx - sw) / 2);
    for (let y = -H; y < hpx - 6; y++) for (let x = sx; x < sx + sw; x++) {
      const t = (y + H) / (H + hpx), inset = y < -H + 6 ? Math.round((-H + 6 - y) / 2) : 0;
      if (x < sx + inset || x >= sx + sw - inset) continue;
      P(x, y, x === sx + inset || x === sx + sw - 1 - inset ? o : x === sx + sw - 2 ? K.bldgEdge : K.bldgFace);
      if (x === sx + Math.floor(sw / 2) && y > -H + 8 && (y % 4 !== 0)) P(x, y, led);
      void t;
    }
    for (let y = -H - 4; y < -H + 2; y++) for (let x = sx - 1; x < sx + sw + 1; x++) P(x, y, (x + y) % 2 ? led : K.white); // lantern
    return edgeRim(S, o, K.bldgRim, K.bldgRimD);
  }
```