SLOT
- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.
- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}
- Bubble: at most 48 characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1.
- Line t901: event `writeoff` (logs: writeOffs, chassis, zone, drop, dropZ, dropFrom, deck, plate); tier 01 Luxury: Polished, superior, faintly amused. Never apologises.; other conditions: district="monument", tile="B2"; claims: ['district:monument', 'tile:B2'].
- Tile (proposed `tile` condition, D78): Monument B2 · The monument (ACT I · INDUCTION; tile 5 of 9). Brief: STRUCK, NOT DASHING. Coverage gap: pedestrians. The final hit must be a car hitting you while you walk or stand. Equipment issued here: none. Chunk: STORY#MB2.

CANON

[FLEET#F1] F1 Canon
## F1 Canon
- **Setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX.
- **Company:** FARSIGHT.
- **Look:** Sinofuturist cyber city (decision 113).
- **Premise:** Vehicles are the city's workers. They want to qualify. The dummy wants to leave.
- **City names allowed:** Shenzhen.

[FLEET#F2] F2 Voice
## F2 Voice
- Vehicles speak as workers, not lore narrators.
- Corporate politeness barely contains their personalities.
- Barks react to logged events only. Never claim what did not happen.
- Lines are at most 48 characters, end with . ! or ?, and react to logged events only.
- **Banned words** (never in a line): kill, killed, die, died, dead, death, player, level, game, score, respawn, lives, Chongqing, Tesla, Toyota, BYD.

[FLEET#F3] F3 Terms
## F3 Terms
- **subject:** What FARSIGHT and the fleet call the dummy
- **write-off:** A destroyed body
- **chassis:** One body of the dummy
- **certification:** The fleet passing its test
- **retraining:** What a car fears most
- **dispatch:** The cars' management
- **route:** A car's planned path
- **bay:** Where a new chassis is issued

[FLEET#F4] F4 Tiers and temperament
## F4 Tiers and temperament
| Tier | Name | Temperament | Voice |
|---|---|---|---|
| 01 | Luxury | confident | Polished, superior, faintly amused. Never apologises. |
| 02 | Corporate | calm | Procedural. Speaks in logs, KPIs and policy numbers. |
| 03 | Consumer | melancholy | Tired and resigned. Expects the worst, usually right. |
| 04 | Budget | angry | Short-fused. Politeness bolted on over the rage. |

[FLEET#F8] F8 Line conditions and claims
## F8 Line conditions and claims
- Shared context a line may test: model, tier, class, seniority, mood, wear, owns, broken, district.
- **impact** carries: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate.
- **writeoff** carries: writeOffs, chassis, zone, drop, dropZ, dropFrom, deck, plate.
- **near-miss** carries: gap, speed, lunging.
- **miss** carries: gap.
- **commit** carries: cause, man.
- **honk** carries: at.
- **interrupt** carries: by.
- **unstick** carries: how.
- **touch-spent** carries: no fields.
- **knock** carries: speed.
- **learned** carries: from, to.
- **upgrade-seen** carries: node.
- **part-seen** carries: part.
- A claim is a fact the line asserts (`stopped`, `zone:front`, `node:hips`, `drop`, `highway`, `plate`, `dropFrom:roof`). Its conditions must guarantee it.

[EDIT39#6.6] 6.6 Voice (rules added)
## 6.6 Voice (rules added)
```markdown
- **Barks return** (decision 119). Pixel bubbles in the field label face, ≤ 48 characters.
- **Placement.** Above the car's tag, else below the car. Never over a tag, a car or the dummy.
- **Styles.** Speech: solid edge. Shout: double edge. Mutter: dashed edge. Thought: dotted edge, trailing dots.
- **Selection.** Highest priority, then most specific line; no line twice on screen. Timing: `proto.barks.seconds`, `proto.barks.cooldown`, `proto.barks.carCooldown`, `proto.barks.maxOnScreen`.
- **Noticing.** A car that notices the dummy names a new module or a broken part. A model that learned says so when it returns.
#### 6.6.1 Lore consistency system (decision 114)
Lore is tied to state: the dummy's upgrades and damage, and the vehicle's behaviour.
- **One database.** `content/db/fleet.json`: canon, classes, tiers, models, state vocabularies, lines.
- **Lines carry conditions.** Car: `model`, `tier`, `class`, `seniority`, `mood`. Dummy: `owns`, `broken`, `wear`. Event fields per event.
- **Lines carry claims.** Each fact a line asserts is a claim: `node:hips`, `part:armR:broken`, `stopped`, `seniority>=3`.
- **The check** (`check_lore.py`) fails the build when:
  - a claim is not guaranteed by the line's conditions;
  - text asserts a fact (an upgrade, a broken part, seniority, a callsign) without the claim;
  - a banned term or a non-canon city appears;
  - a tier lacks impact, write-off, near-miss or miss lines; a node or part lacks a line; an event lacks a neutral fallback;
  - the roster breaks: 32 type-tiers, unique ids, tags, callsigns; temperament matches tier.
- **Later.** RPG elements and a scrollable city extend the same tables (D24).
```

[DESIGN#D9.3] D9.3 Voice and reports (§3.3)
### D9.3 Voice and reports (§3.3)
Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. Corporate politeness barely contains personality. Stable identity and job survive changes in training.
Barks react to recorded events. Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. Neutral fallbacks are preferable to a vivid false claim. A report cannot invent a manoeuvre, learned response or emotional motive that the evidence does not support.
For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. Earlier reports can state impact facts and show identity, but cannot supply the answer to the learning-perception test. Later analysis may explain verified learning events explicitly.
A fixed authored line bank is sufficient for the slice. An automated bark-authoring pipeline is expansion work. Prototype English lines may include “Your freedom remains in progress” and “No accident detected. Please improve”; final selection must match the event.

[EDIT26#3.2] 3.2 Voice and register
### 3.2 Voice and register
- Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy.
- Corporate politeness barely contains their personalities.
- Barks react to play. After-level analysis turns the same events into an official judgement.
- Reports stay truthful to recorded events.
- Draft lines: "Your freedom remains in progress." "No accident detected. Please improve."
- Cars may react to upgrades: "Subject has acquired hips." (Proposed)
Bark design, report selection and the truthfulness rules are in 6.6.

[EDIT26#6.6] 6.6 Voice: barks and reports
### 6.6 Voice: barks and reports
**Narrative structure.** Vehicle class sets physical behaviour. Price tier sets base temperament. Numbered models have stable jobs and identities. Seniority expresses training; mood modifies the encounter.
**Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. Seeded variation preserves character. Write-off barks take priority; a cooldown prevents overlap.
**Report selection.** A behaviour tag summarises a completed body. Report keys combine it with model and training level. Seeded selection varies authored lines. A content band groups keys rebuilt together. Reports must match logged events; unfilled combinations use an event-correct neutral fallback.
**Shift analysis.** At shift end, show bodies destroyed against quota, fleet learning, certification progress, and an authored judgement selected from logged events. Resolve ending priority first; terminal analysis belongs inside the ending. Keep this distinct from each vehicle's body report.
The first version ships a fixed line bank. The authored pipeline is deferred (13.3).

[FSG#field-text] Field text
## Field text
- **Field label face:** 6-art-px caps (`ui.typeFieldLabel` 12 units). Half the old 12-px tag face.
- **Tags:** class letter plus tier (`S01`), square seniority pips. Rim-edged box.
- **Bark bubbles:** same face, ≤ 48 characters, one ink.
  - Day: white fill, near-black edge. Dark: navy `#0B1020` fill, cyan `#6FE4FF` edge, `#E6F4FF` ink.
  - Speech solid edge · shout double · mutter dashed · thought dotted with trailing dots.
  - Never over a tag, a car or the dummy.

[SUB4#5] 5 What the critic caught
## 5 What the critic caught
| Run · type | Kind | Found | Canon | Corrected |
|---|---|---|---|---|
| 015337 · barks | truth | "Old Market congestion code 7. Now this too." | `EDIT39#3.1`: lore follows state; no congestion is logged | "Old Market incident logged. Route 44 noted." The validator then caught that "Route 44" names V02, so the line was bound to that model |
| 015337 · barks | tone | Tier-free line "Written off on the highway. Of all places." | `FLEET#F4`: a line with no tier also fires for the calm Corporate van; this is a Luxury sniff | "Written off on the highway. Logged." |
| 020902 · barks | truth | "A roof drop. My schedule slips by a minute." | `EDIT39#3.1`: a one-minute delay is not logged | "A roof drop. My schedule will suffer." The tweak in §6 then removed invented consequences altogether |
| 020902 · barks | truth | "High drop logged. Load exceeds rating 3." | `FLEET#F2`: barks react to logged events only; no load or rating exists | "High drop logged. Incident form 3 filed." |
| 023310 · barks | truth | "Riverside. I came for the lantern, not this." | `EDIT41#7.2`: the lantern is on B2 only; the line fires on every Riverside screen | "Riverside. I did not sign up for this." |
| 024324 · barks | tone | Tier-free write-off "Written off on the highway. Closing ticket." | `FLEET#F4`: ticket-closing is Corporate procedure; the Luxury car cannot say it | "Written off on the highway. On my record." |

[SUB4#6.2] 6.2 Rejected tile bark (Assignment 5, Edit 94)
## 6.2 Rejected tile bark (Assignment 5, Edit 94)
- **R-BARK-TILE** replaced the district's name with the tile code in Story's barks. A Luxury sedan would have said "B2. I did not sign up for this."
- It met its one probe, not the voice. Barks are written lines in each tier's voice, checked against the fleet canon. Reverted (decision 537); D78 asks whether to write the lines.

[DECISIONS#rows-541-550] Rows 541–550
## Rows 541–550
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 541 | "!" by speaker: Farsight never; cars in a shout-style bark or any Budget (04) bark | user-decided (29 October): "Shouts and Budget only" | 16 of 17 shipped "!" lines fit (12 shouts; 13 Budget) | b111 "It recharges when it hits us?!" (speech, tier-free) is a minor break | `style/STYLE_GUIDE.md` T2, T10 |
| 542 | Lines the style loop accepts stay in `style/runs/` as a demonstration. D78 stays open; the Monument tile barks are its proposal. No change to `fleet.json`, `story.json`, builds or tests | user-decided (29 October): "Runs only" | Merging needs a tile condition in `fleet.json`, `check_lore.py` and `game.js`, and a 7.13 rebuild | D78 not closed | `style/runs/` |
| 543 | Assignment #6: the Style Guide Agent (`style/`). A style guide from the GDD (tone, vocabulary and lore, formatting and length, truth; every rule cites its chunk); a deterministic lint as evidence; a loop of three fresh agents, generator → evaluator → refiner → evaluator, until 10/10 or three refinements. The evaluator returns SCORE and REASON. Its statistics live in `style/style.params.json` until the registry moves past edit94 (the P7.13 suite gates the version) | proposed (assistant) | The brief: a capstone-anchored guide; no binary grading; no human in the loop | Style IDs sit outside `tuning.parameters.json` for now | `style/README.md` |

[FLEET#F9.2] F9.2 Existing lines: writeoff
## F9.2 Existing lines: writeoff
| When | Style | Priority | Line |
|---|---|---|---|
| {"tier": "01"} | speech | 3 | A write-off. On my record. Unthinkable. |
| {"tier": "01"} | speech | 3 | Have that removed from the bay, please. |
| {"tier": "02"} | speech | 3 | Write-off {writeOffs} recorded. Please advise. |
| {"tier": "02"} | speech | 3 | Body total confirmed. Closing ticket. |
| {"tier": "03"} | speech | 3 | I always end up doing the worst bit. |
| {"tier": "03"} | speech | 3 | Please not retraining. Anything but. |
| {"tier": "04"} | shout | 3 | WRITE-OFF! Tell dispatch I tried! |
| {"tier": "04"} | shout | 3 | Done! Done! You happy now?! |
| {"seniority": {"min": 3}} | thought | 3 | Senior model. Apparently not senior enough. |
| {"class": "bus"} | speech | 3 | This service apologises for the delay. |
| {"class": "police"} | speech | 3 | Case closed. Wait, that was the test. |
| {} | speech | 3 | Write-off confirmed. |

[STORY#MB2] MB2 Monument B2 · The monument
### MB2 Monument B2 · The monument
- **Tile:** Monument B2, 5 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The monument.
- **Brief:** STRUCK, NOT DASHING. Coverage gap: pedestrians. The final hit must be a car hitting you while you walk or stand.
- **Equipment issued here:** none.
- **Tale:** The plaque reads ZERO ACCIDENTS. New staff ask whether this is a record. It is a target. Stand near it and let a colleague find you. Walking is permitted. Dashing would spoil the data.

[DECISIONS#rows-351-360~2] Rows 351–360
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 351 | Parkland: cyber turf in every garden cell (mown stripes, a grid of cyan and magenta LED studs); paths stay paved with their light lines; four lit sculptures a screen (was two). Green share of the district 9.5% → 30.8% | user-directed (27 October): "the parkland should have more green … cyber-park vibe, filled with lights and public sculpture"; form proposed | Green reads first; lights and sculpture throughout | — | `docs/p66_before_after.png` |
| 352 | Parkland B2: the ring planted on its own shoulders; its island a garden at Z1 with a sculpture of light; the two pools become lawns with lit edges and a large sculpture each. Green share of B2 0.1% → 31.8% | user-directed: "especially in the central tile somehow"; design proposed | The centre is green | The pools go | `docs/p66_before_after.png` |
| 353 | Monument B2: square paving, as the district's ground; no 45° lattice; the island's studs square | user-directed: "the paving slabs should be horizontally aligned and not too busy against the rest of the area" | The monument reads | — | `docs/p66_before_after.png` |
| 354 | Wayfinding: every flight's apron drawn as a mat (lit corner brackets, two chevrons into the flight), all districts. Monument B2: lit guide strips from the screen's edges to the ring escalators | user-directed: "this paving should also help guide the player as a navigational aid"; form proposed | Flights are found | — | `docs/p66_parkland_monument.png` |
| 355 | Raised layers are drawn past the bottom edge by their lift, so a walkway reaches the screen's edge as drawn. A screen's edge never ends a walkway (no end parapet). Chevrons sit at the edge as drawn | user-directed: "Square B1 in monument has the end of the vertical walkway that doesn't lead to the edge of the screen … should it pass to the next row?" | Continuity reads | — | `test_p6.js` |
| 356 | At a level, a north–south screen crossing happens at the edge as drawn (the floor's lift), where next door has a floor there | proposed (assistant, 27 October), with row 355 | The dummy never leaves the view | — | B1 → B2 at Z1: crosses at y 639 → 1 |
| 357 | Walkway openings: the snapped rail ends in the rail's contrast (cyan on the magenta rail); the opening slides along its spine (up to a lane's half) until its ends, as drawn, stand clear of the road's markings below | user-directed: "instead of having it white, have it as a contrasting colour … also position it at a slightly offset position from the road marking" | The opening reads apart from the road | — | 13+ units clear |
| 358 | Parkland is an Expo site: paved, with deliberate pieces. Replaces row 351's turf in every cell | user-directed (27 October): "it should read like a deliberate landscape - like a World Expo site … like a past olympic games, or World Expo site with pavilions" | Reads as designed | Less green than P6.4 | `docs/p67_parkland_expo.png` |
| 359 | Every open garden cell takes a programme in a fixed rotation of eight: pavilion, parterre, fountain, court, parterre, pavilion, fountain, parterre. At least one pavilion a screen. Pavilions: a dome, an LED box or a canopy, solid to their plans. Courts as B3 and C3: a lit kerb, a sculpture, planters, corner bollards | proposed (assistant, 27 October), from "A3 and B3 and C3 with their decorative elements … is the right mood" | Eight pavilions in the district | — | `tools/p6_audit.js` 200/200 |
| 360 | Water features: fountains (an octagonal basin, three jets) in the rotation; a small round fountain in every other cell the roads, decks and flights leave part free; each great lawn split by a paved cross-walk with a reflecting rill and jets on its long axis | user-directed: "some water features scattered around"; forms proposed | Water throughout | — | `docs/p67_parkland_expo.png` |

[FSG#districts-and-landmarks-p3-city-edits-41-44] Districts and landmarks (P3 city, Edits 41–44)
## Districts and landmarks (P3 city, Edits 41–44)
- **Landmarks:** lantern obelisk; round fountain; crash-matting island (dark rubber, dotted); FARSIGHT Tower on a plaza; calibration plates (white grid, rings, cross) on the road.
- These belong to the P3 city's five districts (Riverside, Old Market, Interchange, CBD, Campus). The Story's three districts (Monument, Parkland, Waterfront) have their own landmarks, one per tile, in `content/story/story.json`.

[DECISIONS#rows-361-370~2] Rows 361–370
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 361 | Parkland B2: the two pools back (row 352 reversed). The ring's island a fountain at Z1, a ring of twelve jets and a sculpture of light. The ring's planted shoulders stay | user-directed: "There should also be the two water pools back" | — | — | `docs/p67_parkland_expo.png` |
| 362 | Jets draw as water: a ripple at the foot, a fine column, a soft plume | proposed (assistant, 27 October) | Jets never read as arrows | — | — |
| 363 | Parkland pavilions: five types (dome, shell hall, LED box, canopy, observation tower) in three sizes (S a kiosk, M a cell, L two cells across their path). A large hall (shell or dome) wherever two open cells adjoin; the rest cycle across the district's screens. Each stands on a framed lawn, solid to its plan | user-directed (27 October): "Two more Pavilion types in different sizes"; the types proposed | Eight pavilions, all five types, all three sizes | — | `docs/p68_pavilions.png` |
| 364 | Green that frames: grass verges along every path (10 wide); pavilions and fountains on framed lawns; cells left part free alternate a small fountain and a grass square. Every Parkland screen at least 8% green (district 16%) | user-directed: "Some more grass squares, there should be at least a bit of green visible in each tile to help frame paths and pavilions" | Paths and pavilions read framed | — | `docs/p62_parkland_3x3.png` |
| 365 | A1 reservoir: three tiers stepped up to the back (north), sharing their north edge; each rises one step; each spills over its front into the one below | user-directed: "it should be stepped towards the top" | Reads as a stepped fountain | — | `docs/p68_pavilions.png` |
| 366 | Prototype 6.1 is the release of P6: Edits 63–68 (steps P6.1–P6.6) and Edit 69's fixes. Built as `prototypes/p6/dummies_p6_1.html`; P6 stays frozen as `dummies_p6.html` (Edit 62). From here "P6.1" means the release | user-directed: "build the new prototype 6.1" | One playable file per release; the history stays playable | The step labels P6.1–P6.6 in Edits 63–68 now read as steps | `prototypes/p6/dummies_p6_1.html`; title and HUD read P6.1 |
| 367 | Release tests in `test_p6.js`. Traffic soak: the view tours all nine screens; no car appears or vanishes in view, no two overlap on a level, no stop of 30 s, no street tile empty a fifth of the time. Walking: reach from the B2 spawn, a physics tour of every screen and flight, every building face, random wandering with no trap | user-directed: "test traffic and character can walk between tiles, paths, staircases, buildings ok" | Every release proves traffic and walking hold | About 1.5 min more test time | `node test_p6.js 3` → 59/59 |
| 368 | Ring give-way across a seam and at speed. The line and the ring's traffic read from the next screen. A fast car starts slowing a stopping distance out (at `traffic.comfortBraking`) plus `traffic.giveWayLookahead` (40), at least `traffic.giveWayWindow` (200; Edit 49.1's window, now registered) | proposed (assistant, 27 October), from the soak | No car arrives too fast to give way | Highway cars slow earlier before a ring | Parkland B2 ring overlaps 4 → 0 in 13.5 min |
| 369 | Ring laps: cars on one route with different laps follow by projection, not by distance along the route | proposed (assistant, 27 October), from the soak | Laps never run into each other on the exit | — | Waterfront B2 overlap samples 8 → 0 |
| 370 | A crossing needs standing room on arrival: within `body.radius` along the edge or `world.edgeArrivalDepth` (8) in. Else a planter on the near side. Planters next door count; the plan settles before any is drawn. An edge that holds holds all along, behind buildings and lawns too | proposed (assistant, 27 October), from the browser smoke (Monument B2 → B3) and the wander test | No crevice or sliver at a screen edge holds the dummy | Edge planters 29 → 43; some Parkland seam paths end at a planter (D42) | Wander 66 × 5 min: 0 traps; `docs/p69_edges_before_after.png` |

LINT (style/lint.py)
- lines[0] · V1 (blocking, −4) "killed; player; respawn; chongqing": banned term 'kill'; banned term 'killed'; banned term 'player'; banned term 'respawn'; banned term 'chongqing'. [FLEET#F2]
- lines[0] · R4 (blocking, −4) "fountain": not on monument B2: its title and tale lack it. [STORY#MB2]

CONTENT
{
 "kind": "barks",
 "lines": [
  {
   "id": "t901",
   "event": "writeoff",
   "when": {
    "district": "monument",
    "tile": "B2",
    "tier": "01"
   },
   "style": "speech",
   "priority": 3,
   "text": "Chongqing fountain. Player killed. Respawn.",
   "claims": [
    "district:monument",
    "tile:B2"
   ]
  }
 ]
}