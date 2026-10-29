# Task
Write the code for requirement R-BARK-TILE. Release tag for comments: `Edit 94 (P7.13)`. Output the blocks your system prompt defines.

# The requirement (with its acceptance probes)
```json
{
 "id": "R-BARK-TILE",
 "title": "Barks name the tile, not the district",
 "statement": "Barks name the tile. Today they still name the district.",
 "sources": [
  "P7#known-gaps:5"
 ],
 "gdd_status": "gap",
 "decision": null,
 "spec": "partial",
 "spec_gap": "The GDD does not say whether barks use the tile's code (B2) or its title (The circus), or which bark lines change.",
 "impact": "feedback",
 "depends_on": [],
 "touches": [
  {
   "file": "prototypes/p6/game.js",
   "symbol": "barkLine",
   "why": "the place a bark names"
  }
 ],
 "registry_uses": [],
 "registry_new": [],
 "contract": "window.__dummiesUI.barkPlace(sim) returns the place word barkLine uses: the tile's code or title in Story, not the district's name.",
 "probes": [
  {
   "id": "p1",
   "kind": "page",
   "say": "in Waterfront B2, barks name the tile",
   "expr": "await G.openStory(await G.certifyProgress({}));\nconst w = await G.eval(() => { const f = window.__dummiesUI?.barkPlace; return f ? String(f(window.__dummies.sim)) : null; });\nconst ok = !!w && (/\\bB2\\b/.test(w) || /circus/i.test(w)) && !/^waterfront$/i.test(w.trim());\nreturn { ok, detail: 'place ' + w };"
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

### P7#title (rank 93)
## Title
| | Keys | Gamepad | Touch |
|---|---|---|---|
| Choose a mode | arrows | stick or d-pad | stick |
| Select | SPACE | A | A |
| Back | SHIFT | B | B |
- **ARCADE** → the district list and difficulty. A cleared district ends the run: Licensed.
- **STORY** → the save screen (Edit 88). Its card names the latest save.

### P7#save-games-edit-88 (rank 93)
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

# Decision
None.

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
#### prototypes/p6/game.js · barkLine (lines 744–773) · named by the requirement
```
  function barkLine(e, s) {
    if (!FLEET || !e.car) return;
    const info = fx.cars.get(e.car);
    if (!info) return;
    const pool = FLEET.barks.filter((ln) => ln.event === e.type && whenOk(ln.when, e));
    if (!pool.length) return;
    const pr = Math.max(...pool.map((ln) => ln.priority || 1)), now = app.realT, dur = pv('proto.barks.seconds') || 2.4;
    // Submission 4: a line that names the situation (a drop, a highway, a plate, the district) outranks a generic line of the same priority
    const SIT = ['drop', 'dropZ', 'dropFrom', 'deck', 'plate', 'district'], sit = (ln) => Object.keys(ln.when || {}).some((k) => SIT.includes(k));
    const pool2 = pool.filter((ln) => (ln.priority || 1) === pr), sitPool = pool2.filter(sit), cand = sitPool.length ? sitPool : pool2;
    const spec = (ln) => Object.keys(ln.when || {}).length, top = [], best = Math.max(...cand.map(spec));
    for (const ln of cand) if (spec(ln) >= Math.min(best, 1)) { top.push(ln); if (spec(ln) >= best && best > 0) top.push(ln); }
    const cur = fx.bubbles.get(e.car), last = fx.carBarkT.get(e.car);
    if (cur && now - cur.t0 < dur && cur.priority > pr) return;
    if (pr < 3) {
      if (last && now - last.t < (pv('proto.barks.carCooldown') || 4) && last.pr >= pr) return;
      if (pr === 1) {
        if (now - fx.barkT < (pv('proto.barks.cooldown') || 0.8)) return;
        let live = 0; for (const bk of fx.bubbles.values()) if (now - bk.t0 < dur) live++;
        if (!cur && live >= (pv('proto.barks.maxOnScreen') || 3)) return;
      }
    }
    const onScreen = new Set([...fx.bubbles.values()].filter((bk) => now - bk.t0 < dur).map((bk) => bk.id));
    const fresh = top.filter((ln) => !onScreen.has(ln.id) && ln.id !== fx.lastLine), use = fresh.length ? fresh : top; // no line twice at once
    const pick = use[(Math.round(e.t * 60) + info.slot * 7 + fx.barkN++) % use.length];
    const text = fillIn(pick.text, e); fx.lastLine = pick.id;
    fx.bubbles.set(e.car, { text, style: pick.style || 'speech', priority: pr, t0: now, car: e.car, id: pick.id });
    fx.barkT = now; fx.carBarkT.set(e.car, { t: now, pr });
    app.present.push({ t: +s.t.toFixed(4), type: 'bark', car: e.car, event: e.type, line: pick.id, text });
  }
```

#### prototypes/p6/game.js · slotLines (lines 2427–2431) · retrieved (44.548)
```
  function slotLines(v) {
    const pr = v.progress, cl = STORY.clearedCount(pr), t = pr.complete ? null : STORY.activeTile(pr, pr.district);
    return [pr.complete ? 'CERTIFIED · ALL ' + STORY.TOTAL + ' TILES' : INFO(pr.district).name.toUpperCase() + ' · ' + t + ' · TILE ' + STORY.tileNumber(pr.district, t) + ' OF ' + STORY.TOTAL + (pr.tileWO ? ' · ' + pr.tileWO + ' OF ' + STORY.needOf(pr.district, t) + ' WRITE-OFFS' : ''),
      cl + ' / ' + STORY.TOTAL + ' TILES · ' + num(pr.points || 0) + ' POINTS · ' + STORY.partsOwned(pr.owned) + ' / ' + STORY.VERBS.length + ' PARTS · CHASSIS ' + String(pr.chassis || 0).padStart(2, '0')]; // Edit 91: parts, not levels
  }
```

#### prototypes/p6/game.js · roadLabel (lines 2050–2050) · retrieved (38.25)
```
  function roadLabel(id) { if (W6) return (LEVEL_LIST.indexOf(id) + 1) + ' · ' + INFO(id).name.toUpperCase(); const d = !!DISTRICTS[id]; return (d ? '' : 'ROAD ') + ((d ? LEVEL_LIST : window.DUMMIES.ROADS).indexOf(id) + 1) + ' · ' + INFO(id).name.replace(/^L\d+\s*/, '').replace('Central Business District', 'CBD').toUpperCase(); }
```

#### prototypes/p6/game.js · drawModeTitle (lines 2402–2424) · retrieved (37.943)
```
  function drawModeTitle() {
    drawField(preview(Math.max(0, LEVEL_LIST.indexOf('monument'))), true);
    veil();
    const x = FX + 30, y = FY + 22, w = FW - 60, h = FH - 44;
    panel(x, y, w, h);
    txt('DUMMIES', x + 30, y + 76, '900 64px ' + F_BRAND, FT.text);
    wrapText('You are a FARSIGHT crash-test subject. Cars avoid you. Fool them into hitting you.', x + 32, y + 116, w - 64, 30, fTxt, FT.dim, 2);
    const items = titleItems(), S = allSlots(), last = S.filter(Boolean).sort((a, b) => b.saved - a.saved)[0], pr = last && last.progress; // Edit 88: the latest save
    const sub = !last ? slotCount() + ' save slots · a new game begins in Monument A1' : last.name + ' · ' + (pr.complete ? 'certified' : INFO(pr.district).name + ' ' + STORY.activeTile(pr, pr.district) + ' · ' + STORY.clearedCount(pr) + ' of ' + STORY.TOTAL);
    const cards = [['ARCADE', 'Pick one district and write off its quota. The score is the run.', 'Parkland · Waterfront · Monument'],
      ['STORY', 'The Test City, tile by tile. Each tile wants its write-offs to Farsight\'s brief.', sub]];
    const cw = (w - 56 - 20) / 2, top = y + 162, chh = 206;
    cards.forEach(([name, line, foot], i) => {
      const cx = x + 28 + i * (cw + 20), on = (app.titleSel % items.length) === i;
      hitbox(cx, top, cw, chh, 'title:' + name, () => { app.titleSel = i; menuQ.push('ok'); }); // Edit 89
      rr(cx, top, cw, chh, 14); ctx.fillStyle = on ? FT.sel : FT.item; ctx.fill(); ctx.strokeStyle = on ? FT.accent : FT.itemEdge; ctx.lineWidth = on ? 3 : 1.5; ctx.stroke();
      txt(name, cx + 22, top + 50, '900 34px ' + F_BRAND, on ? FT.selText : FT.text);
      wrapText(line, cx + 22, top + 88, cw - 44, 27, '400 19px ' + F_UI, on ? FT.selText : FT.text, 3);
      fitText(foot, cx + 22, top + chh - 22, cw - 44, 17, 12, on ? FT.selText : FT.dim); // Edit 89: shrink to fit, never cut
    });
    const pd = TOUCH.on || app.device === 'pad';
    txt(TOUCH.on ? 'TAP A MODE' : pd ? 'STICK CHOOSE · A SELECT' : 'ARROWS CHOOSE · SPACE SELECT', x + w / 2, y + h - 22, fLab, FT.accent, 'center');
  }
```

#### prototypes/p6/game.js · drawFieldHD (lines 1917–1933) · retrieved (35.837)
```
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

#### prototypes/p6/game.js · drawReport (lines 2709–2736) · retrieved (34.413)
```
  function drawReport(s) {
    veil();
    const rp = s.report, x = FX + 40, y = FY + 36, w = FW - 80, h = FH - 72;
    panel(x, y, w, h); hitbox(x, y, w, h, 'report', () => menuQ.push('ok')); // Edit 89: a tap continues
    const sr = rp.story; // Edit 81: the story's count and the brief. Edit 82: a credit a body
    txt(sr ? (sr.districtDone ? INFO(s.levelId).name.toUpperCase() + ' CLEARED · NEXT ' + INFO(rp.nextRoad).name.toUpperCase() : sr.cleared ? 'TILE ' + sr.tile + ' CLEARED' : 'WRITE-OFF REPORT · ' + sr.tile)
      : rp.roadCleared ? roadLabel(s.level.id) + ' CLEARED' : copy('report.eyebrow', 'WRITE-OFF REPORT').toUpperCase(), x + 30, y + 44, fLab, FT.accent);
    const chs = String(rp.chassis).padStart(2, '0');
    txt(copy('report.title', 'Chassis {chassis} written off.', { chassis: chs }), x + 30, y + 92, '900 36px ' + F_BRAND, FT.text);
    if (sr) {
      const task = STORY.tileOf(s.levelId, sr.tile), lab = task ? STORY.taskText(task.task, s.P).label : '';
      txt((sr.counted ? 'Counted for ' + sr.tile + ': ' + sr.n + ' of ' + sr.need : sr.why === 'task' ? 'Not counted: the brief wants ' + lab.toLowerCase() : sr.why === 'cleared' ? 'Not counted: ' + sr.tile + ' is already cleared' : 'Not counted: ' + sr.tile + ' is not in test') + ' · points this body ' + num(rp.points), x + 30, y + 132, fTxt, sr.counted ? FT.text : C.warning);
    } else txt('Write-off ' + s.run.writeOffs + ' of ' + s.quota + ' · points this body ' + num(rp.points), x + 30, y + 132, fTxt, FT.dim);
    const cols = [['CAR', 0], ['ANGLE', 130], ['POINTS', 290], ['HEALTH LOST', 470]];
    cols.forEach(([c, dx]) => txt(c, x + 30 + dx, y + 190, fLab, FT.dim));
    rp.hits.slice(-3).forEach((hh, j) => {
      const yy = y + 236 + j * 44;
      [shortId(hh.model), hh.angle != null ? Math.round(hh.angle) + '°' : '—', num(hh.assessed), num(hh.lost)].forEach((v, i) => txt(String(v), x + 30 + cols[i][1], yy, fNum, FT.text));
    });
    rr(x + 28, y + h - 116, w - 56, 52, 12); ctx.fillStyle = FT.credit; ctx.fill(); ctx.strokeStyle = C.dummy; ctx.lineWidth = 1.5; ctx.stroke();
    if (sr && sr.parts != null) { // Edit 91: the parts fitted, and the next one's tile. No shop in Story
      const ng = sr.nextGift, line = sr.parts + ' / ' + STORY.VERBS.length + ' PARTS FITTED' + (ng ? ' · NEXT: ' + NODE(ng.node).name.toUpperCase() + ' AT ' + INFO(ng.district).name.toUpperCase() + ' ' + ng.tile : ' · EVERY PART FITTED');
      fitText(line, x + 46, y + h - 82, w - 92, TY.sec, 13, FT.text);
    } else if (sr) { const c = sr.cheapest;
      txt('+' + plural(sr.gained, 'credit').toLowerCase() + ' for the body. Balance: ' + s.run.credits + '.' + (c ? (s.run.credits >= c.price ? ' ' + NODE(c.node).name + ' is yours for ' + c.price + '.' : ' ' + NODE(c.node).name + ' at ' + c.price + '.') : ' Every track is full.'), x + 46, y + h - 82, fLab, FT.text); }
    else txt(copy('report.credit', 'One body credit granted. Balance: {credits}.', { credits: s.run.credits }), x + 46, y + h - 82, fLab, FT.text);
    txt(TOUCH.on ? 'TAP TO CONTINUE' : app.device === 'pad' ? 'A  CONTINUE' : 'SPACE  CONTINUE', x + w - 30, y + h - 26, fLab, FT.accent, 'right');
  }
```

#### prototypes/p6/game.js · drawStoryMap (lines 2505–2560) · retrieved (33.168)
```
  function drawStoryMap() {
    const pr = app.story; if (!pr) { app.screen = 'title'; return; }
    drawField(preview(Math.max(0, LEVEL_LIST.indexOf(pr.district))), true);
    veil();
    const x = FX + 16, y = FY + 14, w = FW - 32, h = FH - 28, needT = (id, t) => pv('story.writeOffs.' + id + '.' + t); // Edit 82: a count per tile
    panel(x, y, w, h);
    const sv = app.slot && allSlots()[app.slot - 1], stat = STORY.clearedCount(pr) + ' / ' + STORY.TOTAL + ' TILES · ' + num(pr.points) + ' POINTS · ' + STORY.partsOwned(pr.owned) + ' / ' + STORY.VERBS.length + ' PARTS'; // Edit 91
    ctx.font = '700 18px ' + F_UI; const sw = ctx.measureText(stat).width;
    txt(stat, x + w - 24, y + 40, '700 18px ' + F_UI, FT.text, 'right');
    fitText(sv ? 'SLOT ' + app.slot + ' · ' + sv.name : 'THE TEST CITY', x + 24, y + 40, w - 48 - sw - 24, TY.sec, 14, FT.accent); // Edit 88: the slot in play
    const sel = app.mapSel || storyCursor(), gap = 24, gw = (w - 48 - 2 * gap) / 3, g = 6, cw = (gw - 2 * g) / 3, ch = Math.round(cw * 0.8), top = y + 86;
    STORY.DIST.forEach((d, di) => {
      const gx = x + 24 + di * (gw + gap), here = !pr.complete && pr.district === d.id, dn = STORY.doneIn(pr, d.id);
      fitText((d.act ? d.act.split(' · ')[0].replace('ACT ', '') + ' · ' : '') + d.name.toUpperCase(), gx, top - 12, gw - 48, TY.sec, 13, here ? FT.accent : dn.length ? FT.text : FT.dim); // Edit 92: the act's numeral
      txt(dn.length + '/' + d.order.length, gx + gw, top - 12, fLab, FT.dim, 'right');
      const at = (t) => { const [c, r] = STORY.cellOf(t); return [gx + c * (cw + g), top + r * (ch + g)]; };
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        const t = 'ABC'[c] + (r + 1), st = STORY.tileState(pr, d.id, t), [cx, cy] = at(t), on = sel[0] === di * 3 + c && sel[1] === r, pulse = st === 'active' && Math.floor(app.realT * 2) % 2 === 0;
        hitbox(cx, cy, cw, ch, 'tile:' + d.id + ':' + t, () => { if (on && st === 'active') menuQ.push('ok'); else app.mapSel = [di * 3 + c, r]; }); // Edit 89: tap to read; the tile in test, tapped again, deploys
        rr(cx, cy, cw, ch, 6); ctx.fillStyle = st === 'cleared' ? 'rgba(79,195,232,0.30)' : st === 'active' ? FT.keyTop : 'rgba(40,46,56,0.55)'; ctx.fill(); // Edit 83: uncleared greyed out
        ctx.strokeStyle = on ? FT.accent : FT.itemEdge; ctx.lineWidth = on ? 3 : 1; ctx.stroke();
        if (st === 'active') { rr(cx - 2, cy - 2, cw + 4, ch + 4, 8); ctx.strokeStyle = C.dummy; ctx.lineWidth = pulse ? 4 : 3; ctx.stroke(); } // the live tile, ringed in yellow
        txt(t, cx + 8, cy + 22, '700 17px ' + F_UI, st === 'hidden' ? FT.off : FT.text);
        if (st !== 'hidden') txt(st === 'cleared' ? '✓' : pr.tileWO + '/' + needT(d.id, t), cx + cw - 8, cy + ch - 9, '700 15px ' + F_UI, st === 'cleared' ? FT.accent : C.dummy, 'right');
      }
      // the route between revealed tiles, a dot in the gap where one leads to the next
      for (let i = 1; i < d.order.length; i++) {
        const a = d.order[i - 1], b = d.order[i];
        if (STORY.tileState(pr, d.id, a) === 'hidden' || STORY.tileState(pr, d.id, b) === 'hidden') continue;
        const [ax, ay] = at(a), [bx, by] = at(b);
        const mx = ax === bx ? ax + cw / 2 : Math.max(ax, bx) - g / 2, my = ay === by ? ay + ch / 2 : Math.max(ay, by) - g / 2;
        ctx.beginPath(); ctx.arc(mx, my, 4, 0, TAU); ctx.fillStyle = FT.accent; ctx.fill();
      }
    });
    // the tile under the cursor: its tale and brief, once revealed
    const d = STORY.DIST[Math.floor(sel[0] / 3)], t = 'ABC'[sel[0] % 3] + (sel[1] + 1), st = STORY.tileState(pr, d.id, t), tile = d.tiles[t];
    const iy = top + 3 * ch + 2 * g + 22, ih = y + h - 82 - iy, ix = x + 24, iw = w - 48;
    rr(ix, iy, iw, ih, 12); ctx.fillStyle = FT.item; ctx.fill(); ctx.strokeStyle = FT.itemEdge; ctx.lineWidth = 1; ctx.stroke();
    const pts = pr.tilePoints[d.id + ':' + t];
    txt(d.name.toUpperCase() + ' · ' + t + ' · TILE ' + STORY.tileNumber(d.id, t) + ' OF ' + STORY.TOTAL + (st === 'cleared' ? ' · CLEARED' + (pts != null ? ' · ' + num(pts) + ' POINTS' : '') : st === 'active' ? ' · IN TEST · ' + pr.tileWO + ' OF ' + needT(d.id, t) : st === 'hidden' ? '' : ''), ix + 18, iy + 30, '700 16px ' + F_UI, FT.accent);
    if (st === 'hidden') {
      txt('Not yet surveyed', ix + 18, iy + 70, '900 26px ' + F_BRAND, FT.dim);
      wrapText('Clear the tiles before it. The map opens one tile at a time.', ix + 18, iy + 104, iw - 36, 26, '400 19px ' + F_UI, FT.dim, 2);
    } else {
      txt(tile.title, ix + 18, iy + 68, '900 26px ' + F_BRAND, FT.text);
      const n = wrapText(tile.tale, ix + 18, iy + 100, iw - 36, 24, '400 18px ' + F_UI, FT.text, 4);
      const tx = STORY.taskText(tile.task, null), gt = giftText(tile.gift);
      wrapText('FARSIGHT BRIEF · ' + tx.label + (gt ? ' · GIFT: ' + gt.split(':')[0] : ''), ix + 18, iy + 100 + n * 24 + 12, iw - 36, 24, '700 17px ' + F_UI, FT.accent, 2);
    }
    const on = !pr.complete, bt = pr.complete ? 'THE TEST CITY IS CERTIFIED' : 'DEPLOY · ' + INFO(pr.district).name.toUpperCase() + ' ' + STORY.activeTile(pr, pr.district);
    rr(x + 24, y + h - 72, w - 48, 44, 12); ctx.fillStyle = on ? FT.sel : FT.item; ctx.fill(); ctx.strokeStyle = FT.accent; ctx.lineWidth = 1.5; ctx.stroke();
    if (on) hitbox(x + 24, y + h - 72, w - 48, 44, 'deploy', () => menuQ.push('ok')); // Edit 89
    txt(bt, x + w / 2, y + h - 42, fLab, on ? FT.selText : FT.text, 'center');
    const pd = TOUCH.on || app.device === 'pad';
    txt(TOUCH.on ? 'TAP A TILE TO READ IT · TAP DEPLOY · B BACK' : pd ? 'STICK READ A TILE · A DEPLOY · B BACK' : 'ARROWS READ A TILE · SPACE DEPLOY · SHIFT BACK', x + w / 2, y + h - 8, '700 15px ' + F_UI, FT.dim, 'center');
  }
```

#### prototypes/p6/world6.js · INFO (lines 2064–2064) · retrieved (32.738)
```
  const INFO = (id) => { const D = DISTRICTS.find((d) => d.id === id); return D ? { name: D.name, blurb: D.mood } : null; };
```

#### prototypes/p6/sim.js · DISTRICTS (lines 1011–1012) · retrieved (32.597)
```
  const DISTRICTS = {
    riverside: { name: 'Riverside', blurb: 'Low-rise riverfront. A lantern monument marks the centre.', focal: 'monument', themes: ['plain', 'flyover', 'barrier'] },
```

#### prototypes/p6/world6.js · buildScreen (lines 1161–1298) · retrieved (32.585)
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

#### prototypes/p6/game.js · objective (lines 1979–1999) · retrieved (32.387)
```
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

#### prototypes/p6/game.js · startLevel (lines 150–153) · retrieved (31.431)
```
  function startLevel(i, carry) { // P6: the district takes a moment to build; the loading panel shows first
    if (W6) { app.screen = 'loading'; app.loading = { i, carry: carry || null, frames: 0, name: INFO(LEVEL_LIST[i]).name }; app.sim = null; app.paused = false; clearEdges(); return; }
    startLevelNow(i, carry);
  }
```

#### prototypes/p6/world6.js · buildWorld (lines 1982–2006) · retrieved (30.274)
```
  function buildWorld(id, opts) {
    PAVN = 0; PAVB = 0;
    opts = opts || {};
    ACCESS = opts.access || null; // Edit 85
    const D = DISTRICTS.find((d) => d.id === id);
    if (!D) throw new Error('no P6 district ' + id);
    const scs = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) scs.push(buildScreen(D, c, r));
    edgePass({ scs, at: (c, r) => (c >= 0 && c < 3 && r >= 0 && r < 3 ? scs[r * 3 + c] : null) }); // P6.1: barriers and booms where an edge cannot be crossed
    fillPockets({ scs, at: (c, r) => (c >= 0 && c < 3 && r >= 0 && r < 3 ? scs[r * 3 + c] : null) }); // Prototype 6.1: no ground the dummy cannot reach
    fillDead({ scs }); // 6.2 (Edit 70): no gap that looks walkable and is not
    const Wd = { id, D, scs, at: (c, r) => (c >= 0 && c < 3 && r >= 0 && r < 3 ? scs[r * 3 + c] : null), t: 0, live: false, budget: opts.budget != null ? opts.budget : P['run.appearances.road'], admitted: 0, exited: 0, crossings: 0, events: [], tick: 0, spawnSeq: 0, culled: 0 }; // admitted (P6.1): shift cars that have appeared on the screen in view
    linkWorld(Wd);
    if (opts.density) Wd.densityOf = opts.density; // Edit 85 (P7.4): Story's traffic, tile by tile (story.traffic.<district>.<tile>)
    for (const sc of scs) { // cones live on their screen; ground drivers and the dummy share them
      sc.cones.length = 0;
      sc.game.coneHomes.forEach(([x, y], i) => sc.cones.push({ id: 'cone' + sc.name + '-' + (i + 1), x, y, hx: x, hy: y, vx: 0, vy: 0, state: 'free', flightT: 0, flightDur: 1 }));
      for (const s of sc.sims) if (s.elev0 === 0) { s.cones = sc.cones; s.level.coneHomes = sc.game.coneHomes; }
    }
    const warm = opts.warm != null ? opts.warm : P['traffic.warmSeconds'];
    for (let k = 0; k < Math.round(warm * P['simulation.tickRate']); k++) stepWorld(Wd, null, null);
    for (const s of Wd.sims) for (const c of s.cars) { c.elev = s.elev0 + (c.layer || 0); c.sim = s; }
    goLive(Wd);
    return Wd;
  }
```

#### prototypes/p6/game.js · startLevelNow (lines 154–179) · retrieved (29.841)
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

#### prototypes/p6/world6.js · SP (lines 1320–1329) · retrieved (29.387)
```
    const SP = { // the tile's set piece, in garden cells (c0, r0, c1, r1)
      A1: ['reservoir', 0, 2, 1, 4], C1: ['lantern pavilion', 3, 1, 3, 1], A2: ['canal', 0, 3, 1, 3], C2: ['amphitheatre', 3, 0, 4, 1],
      A3: ['belvedere', 3, 0, 4, 1], B3: ['sculpture court', 0, 1, 1, 2], C3: ['sculpture court', 3, 1, 4, 2] }[name];
    const sp = SP ? piece(...SP) : null, pools = [];
    if (name === 'B2') pools.push(piece('pool', 3, 0, 4, 1), piece('pool', 0, 3, 1, 4)); // the two reflecting pools, by the ring
    if (name === 'B1') for (let r = 1; r <= 4; r++) pools.push(piece('cascade pool', 1, r, 1, r)); // the cascade: one pool a cell, stepping down south beside the highway
    if (name === 'B1') R.push([0, 280, 800, 80]); // under the walkway
    if (name === 'C1') R.push([0, 280, 520, 80]);
    if (name === 'A1') R.push([600, 280, 240, 80]);
    if (name === 'A3') sc.stairs.push({ x: 624, y: 200, w: SWD, h: X.stairRun(P, 0, 1), axis: 'y', low: 200 + X.stairRun(P, 0, 1), high: 200, side: 0, z: 1 }); // P6.3: the belvedere's stair, before the beds (its axis on the x 640 path)
```

#### prototypes/p6/world6.js · RBS (lines 1167–1167) · retrieved (29.375)
```
    const RBS = (D.roundabouts || []).concat(D.roundabout ? [D.roundabout] : []), rbHere = RBS.find((q) => q.tile === name); // Edit 56: street roundabouts
```

#### prototypes/p6/game.js · drawBriefFoot (lines 2673–2680) · retrieved (28.092)
```
  function drawBriefFoot(s, X, y, W) { // under the district map: the brief and the tile's count
    const pr = s.story, t = STORY.activeTile(pr, s.levelId), tile = t ? STORY.districtOf(s.levelId).tiles[t] : null, need = t ? STORY.needOf(s.levelId, t, s.P) : 0;
    if (!tile) return;
    const tx = STORY.taskText(tile.task, s.P), here = s.screenName() === t;
    txt('BRIEF · ' + t, 30, y + 18, '700 15px ' + F_UI, here ? FT.accent : FT.dim);
    for (let i = 0; i < need; i++) { ctx.beginPath(); ctx.arc(X + W - 20 - (need - 1 - i) * 16, y + 13, 5, 0, TAU); ctx.fillStyle = i < pr.tileWO ? C.dummy : FT.track; ctx.fill(); ctx.strokeStyle = FT.itemEdge; ctx.lineWidth = 1; ctx.stroke(); }
    wrapText(tx.label, 30, y + 44, W - 28, 20, '700 17px ' + F_UI, FT.text, 1);
  }
```

#### prototypes/p6/world6.js · WATER (lines 709–709) · retrieved (28.038)
```
  const WATER = { id: 'waterfront', name: 'Waterfront', quota: P['world.district.waterfront.quota'], storeys: [4, 10], start: ['B2', 'center'],
```

#### prototypes/p6/world6.js · DISTRICTS (lines 649–667) · retrieved (27.408)
```
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

#### prototypes/p6/game.js · drawBrief (lines 2561–2579) · retrieved (27.404)
```
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

#### prototypes/p6/sim.js · Sim.constructor (lines 1551–1563) · retrieved (27.362)
```
    constructor(levelId, overrides, carry) {
      this.P = Object.assign({}, REG, PROTO, OVERRIDES, overrides || {});
      this.levelId = levelId; this.carry = carry || null;
      this.isCity = !!DISTRICTS[levelId]; this.list = this.isCity ? DISTRICT_LIST : ROADS; // Edit 41: five city districts; the P2.2 roads stay as fixtures
      this.roadIndex = this.list.indexOf(levelId); this.isFinal = this.roadIndex === this.list.length - 1;
      // D24: a road is a district of screens; the dummy starts on the handcrafted screen (top middle).
      this.district = this.isCity ? cityDistrict(levelId, this.P) : this.P['proto.district'] ? planDistrict(levelId, this.P) : null;
      this.level = this.district ? cellLevel(this.district, this.district.start, this.P) : buildLevel(levelId, this.P);
      const dif = DIFFICULTIES[clamp(Math.round(this.P['proto.difficulty']), 0, DIFFICULTIES.length - 1)];
      this.difficulty = dif.name;
      this.P['damage.bodyHealth'] = this.P['proto.health.' + dif.key];
      this.reset();
    }
```