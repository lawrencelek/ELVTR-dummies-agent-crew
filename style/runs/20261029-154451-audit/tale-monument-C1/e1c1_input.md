SLOT
- Kind: tale, `content/story/story.json` `districts[].tiles.<tile>.tale`. Speaker: Farsight. Shown on the tile card.
- Schema: {"kind": "tale", "district", "tile", "title", "tale"}
- Card: at most 223 characters (style.tale.maxChars); sentences of at most 19 words.
- Tile: Monument C1 · The LED drum (ACT I · INDUCTION; tile 3 of 9). Brief: DROP ONTO A CAR. Coverage gap: falls. The final hit must be a drop onto a car from above. Equipment issued here: none. Chunk: STORY#MC1.

CANON

[EDIT92#3] 3 Story: Narrative A, Certified (replaces the proposal)
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

[STORY#S1] S1 Story rules
## S1 Story rules
- Numbers live in the registry: tasks and gifts name parameter IDs, never values.
- A task tests the hit that writes the chassis off (the fatal hit).
- Tile names are column-row, as in the game: A1 is the top-left tile.
- Each tile's write-offs are story.writeOffs.<district>.<tile> in the registry (Edit 82).
- Edit 93: introduce, then test. A part arrives on the tile whose brief first needs it; no brief needs a part not yet issued. Monument: Battery 1 B1 (dash), Hands 1 A2 (cone), Legs 1 B3 (jump). Parkland: Arms 1 C1 (push), Legs 2 A3 (jump), Hands 2 A2 (cone), Arms 2 A1 (push), Battery 2 B2 (combo). Waterfront: Legs 3 B1 (jump), Arms 3 B3 (push), Battery 3 B2 (combo).
- Edit 92: Narrative A, Certified. Act I Monument (Induction), Act II Parkland (Opening Day), Act III Waterfront (Customs). Farsight narrates: polite, procedural, dry; no exclamation marks. The cars are colleagues; the briefs are duties; the parts are equipment.
- A gift rides in on the drone that carries the dummy into its tile (Edit 84). Arcade sells every part for credits; its chassis ships with Battery 1 (Edit 91).
- Each tile's traffic is story.traffic.<district>.<tile> in the registry, on the tile and its neighbours (Edit 85).

[STORY#S2] S2 Acts
## S2 Acts
| District | Act | Act line (intro) | Order |
|---|---|---|---|
| Monument | ACT I · INDUCTION | Off the factory floor. Farsight greets you as new staff; the cars are your colleagues. | A1 → B1 → C1 → C2 → B2 → A2 → A3 → B3 → C3 |
| Parkland | ACT II · OPENING DAY | The Expo opens to the public when this park passes. Nine tiles, nine days. Visitors are booked. | C1 → C2 → C3 → B3 → A3 → A2 → A1 → B1 → B2 |
| Waterfront | ACT III · CUSTOMS | The river is a border; ships wait beyond it. Your papers are being prepared. | A1 → B1 → C1 → C2 → C3 → B3 → A3 → A2 → B2 |

[STORY#S3] S3 Briefs
## S3 Briefs
A brief is a caps label, then "Coverage gap: …. The final hit must ….". Figures are placeholders bound to registry IDs ({n}).
| Kind | Label | Brief |
|---|---|---|
| any | ANY WRITE-OFF | General coverage. Any write-off in this tile counts. |
| dash | DASH INTO A CAR | Coverage gap: dashes. The final hit must be a dash into a car. |
| drop | DROP ONTO A CAR | Coverage gap: falls. The final hit must be a drop onto a car from above. |
| jump | JUMP INTO A CAR | Coverage gap: jumps. The final hit must be a jump into a car. |
| level | ON A RAISED ROAD | Coverage gap: raised roads. The final hit must land at Z1 or above. |
| cone | CONE-BAITED CAR | Coverage gap: cones. The final hit must come from a car reacting to a cone. |
| push | PUSH OFF A CAR | Coverage gap: ricochets. Push off one car; the final hit must be the next car. |
| bounce | THROWN INTO A CAR | Coverage gap: rebounds. The final hit must come while a hit is still throwing you. |
| struck | STRUCK, NOT DASHING | Coverage gap: pedestrians. The final hit must be a car hitting you while you walk or stand. |
| combo | COMBO ×{n} | Coverage gap: chains. The final hit must be link {n} or later of a combo. |
| cls | A {cls} | Coverage gap: the {clsLong}. The final hit must come from a {cls}. |

[EDIT39#4.1.1] 4.1.1 The register (replaces Edit 37)
## 4.1.1 The register (replaces Edit 37)
```markdown
#### 4.1.1 The register
**A Sinofuturist cyber city inside a friendly corporate terminal.** Two layers, never mixed.
- **The play area is the city at night.** 16-bit pixel art: dark deck plates, LED city blocks, neon spill, jersey barriers, a white fleet.
- **The frame is FARSIGHT's brand.** Dark glass, cyan LED edges, rounded panels. High resolution.
- **The contrast is the tone.** The city glows. The test writes off bodies in it. The brand never comments.
- **Dark ground rules every edge** (4.1.2). No sprite edge is black.
- **Reserved hues hold.** Yellow is the dummy. Red is the warning. Neon is material, never a cue.
- **Options:** day (Edit 37 eco-city) and night (parkland) remain as build palettes. Play never changes.
```

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

[EDIT93#3.1/tales-rewritten~2] Tales rewritten
- **Voice kept:** no exclamation marks; the longest 223 characters. C3 keeps ROLE: DESTRUCTIVE TESTING.

[EDIT92#measured] Measured
## Measured
| Check | Result |
|---|---|
| Solids, floors, stairs, spawns, cone homes, with and without the art | identical on all 27 tiles |
| Tiles the art draws on | 9: Monument A1, A2, A3, C3; Parkland C1, B1; Waterfront A3, C3, B3 |
| Longest tale | 217 characters: four lines on the card |
| Tile card, Monument A1 | ACT I · INDUCTION · MONUMENT · TILE A1 · 1 OF 27; The welcome wall; the act line; the tale |
| Story map | I · MONUMENT, II · PARKLAND, III · WATERFRONT |

[DECISIONS#rows-531-540~2] Rows 531–540
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 531 | Tales rewritten where a brief or part moved: Monument B1, C1, B3, C3; Parkland C1, C3, A2, B1, B2; Waterfront A1, B2. Voice kept: no exclamation marks; C3 keeps ROLE: DESTRUCTIVE TESTING, Waterfront B2 ZERO ACCIDENTS (EXCLUDING TESTS) | proposed (assistant) under row 520 | Each tale names the equipment the tile issues | — | ≤ 223 characters |
| 532 | Registry `edit93-2026-10-29`: no IDs added; the 27 `story.writeOffs.*` and `story.traffic.*` descriptions carry the new briefs (505 entries) | proposed (assistant) | Every statistic has an ID | — | `content/params/tuning.parameters.json` |
| 533 | The finale is the unveiling and the ship: the circus's monument shrouded until Waterfront B2 clears; its unveiling, with the plaque showing the run (chassis spent, points, best combo, time); a Farsight drone lifts the dummy over the river to the container ship at Waterfront B3, every crate carrying its face. The ending screen follows | user-decided: "Unveiling and ship" (29 October) | The reward for clearing is seen, not only read | Credits over the voyage and Second Market wait (D77) | Closes D76; GDD Edit 92 §3.2 |
| 534 | Assignment #5: a goal-oriented coding agent (`coder/`) reads the GDD, scans the code, detects gaps with executable probes, scores them, writes the code for the top one and re-scans after each write. An open D-item blocks a requirement; the loop stops when every requirement is met or blocked | proposed (assistant) | The agent builds only what the GDD specifies and a decision has settled | A blocked requirement waits for Lawrence | `coder/coder.py` |
| 535 | The finale as built (Edit 94, P7.13): the circus's monument shrouded in Story until Waterfront B2 clears (`world.monumentShroud`); the last write-off plays under the cloth; a drone lifts the cloth (`ui.finale.unveilSeconds`) and the plaque reads THE DUMMY MONUMENT · UNVEILED, ZERO ACCIDENTS (EXCLUDING TESTS), chassis spent, points, best combo, time; A or a tap: a drone carries the dummy from B2 over the edge to the container ship at B3, every crate with its face; then CERTIFIED. Arcade has no finale | user-decided (row 533); requirements and code by the coding agent (coder/, run 20261029-105801); reviewed (assistant) | The reward for clearing is seen | Credits and Second Market wait (D77) | `test_p713.js`; closes the finale part of D76 |
| 536 | The agent's writes accepted with manual changes: the write-off plays before the unveiling (the agent cut it); a drone lifts the cloth over 1.2 s, the gift screen's hold (the agent swapped it at once); the plaque in the game's own panel and type, inside the field, with the device's prompt and a tap target (the agent drew its own text below the field, keys only); the voyage reads FARSIGHT DRONE and · DRONE; the shroud's registry entry filed under World | proposed (assistant, manual review) | The agent's probes test state; the screen needed a person | — | Separate commit after the agent's; all 11 requirements' probes still pass |
| 537 | R-BARK-TILE rejected: the agent's write replaced the district's name with the tile code in Story barks ("B2. I did not sign up for this."). It met its one probe, not the voice. Reverted; the requirement set to spec none | proposed (assistant, manual review) | Barks are written lines in each tier's voice, with the lore check | Barks still name the district | Raises D78 |
| 538 | Registry `edit94-2026-10-29`: `world.monumentShroud` (0; P7SIM 1; written by the agent), `ui.finale.unveilSeconds` (1.2 s; added in review). 507 entries | proposed (assistant) | Every statistic has an ID | — | `content/params/tuning.parameters.json` |
| 539 | "Farsight" in title case in every sentence-case string: barks, tales, briefs, act lines, the ending. A label set wholly in capitals keeps its caps (FARSIGHT DRONE). Supersedes the fleet canon's capitals (Edit 39; `check_lore.py`) | user-decided (29 October): "Farsight everywhere" | Edit 92's tales, Edits 93–94 and rows 533, 535 write Farsight | `check_lore.py`, `checks.py` and bark c024 still say FARSIGHT (D79) | `style/STYLE_GUIDE.md` V4 |
| 540 | The fleet canon's banned terms apply to diegetic text only: barks, tales, briefs, act lines, the ending, plaques. Menu chrome is exempt (NEW GAME, Edit 88; LEVEL UP, Edit 89) | user-decided (29 October): "Diegetic text only" | Menus are interface, not voice | `checks.py` still applies the ban to every string shown | `style/STYLE_GUIDE.md` V1 |

[DECISIONS#rows-541-550] Rows 541–550
## Rows 541–550
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 541 | "!" by speaker: Farsight never; cars in a shout-style bark or any Budget (04) bark | user-decided (29 October): "Shouts and Budget only" | 16 of 17 shipped "!" lines fit (12 shouts; 13 Budget) | b111 "It recharges when it hits us?!" (speech, tier-free) is a minor break | `style/STYLE_GUIDE.md` T2, T10 |
| 542 | Lines the style loop accepts stay in `style/runs/` as a demonstration. D78 stays open; the Monument tile barks are its proposal. No change to `fleet.json`, `story.json`, builds or tests | user-decided (29 October): "Runs only" | Merging needs a tile condition in `fleet.json`, `check_lore.py` and `game.js`, and a 7.13 rebuild | D78 not closed | `style/runs/` |

[STORY#MC1] MC1 Monument C1 · The LED drum
### MC1 Monument C1 · The LED drum
- **Tile:** Monument C1, 3 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The LED drum.
- **Brief:** DROP ONTO A CAR. Coverage gap: falls. The final hit must be a drop onto a car from above.
- **Equipment issued here:** none.
- **Tale:** The drum lights each bend before a car reaches it, so no colleague is ever surprised. Today one will be. The high road breaks its rail over the street below. Step off it onto a car. Gravity is company policy.

[EDIT93#3.1/tales-rewritten~1] Tales rewritten
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

[EDIT26#6.2~3] 6.2 Locomotion and traffic
**Checks** (Proposed). The traffic audit requires that:
- no two cars ever touch;
- no car leaves the road or crosses a barrier;
- cars keep right on every two-way road;
- in scripted junction tests, cars go in the right-of-way order above;
- in valid layouts, every admitted car eventually reaches a normal exit once temporary obstructions clear; a wait over 10 s records a diagnostic with its cause;
- occupied crossings and blocked exits permit safe waiting beyond 10 s; no progress rule may override collision safety;
- no car is forcibly despawned to break a jam;
- admission checks use braking distance, terrain, reaction time and the full vehicle footprint; legal spawn space exceeds the static minimum gap;
- traffic arbitration may reduce speed after commitment. If that invalidates a committed route, visibly cancel the commitment and acquire a newly signalled route (Proposed; needs review against the locked-steering rule).
**Parameters — vehicles and traffic**
*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

[DECISIONS#rows-61-70~2] Rows 61–70
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 61 | Branch 2, Torso: Waist (turn faster) unlocks Spine (change direction mid-lunge) and Core strength (a missed lunge becomes a roll, so you recover at once) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | Turning is the dummy's first freedom | Spine breaks the GDD's "no steering mid-lunge" rule and can follow a car's swerve. Proposed: limit the steer. | — |
| 62 | Branch 3, Battery or Heart (name open): Extra cell (a short second lunge straight after the first) unlocks Kinetic chain (a hit worth more than 100 points recharges the battery) and Nitro (recharges twice as fast, but you jitter and can't stand still) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | — | Kinetic chain and Nitro only matter if the base recharge is made slower: today the lunge is ready again 0.25 s after it lands | Recharge 0.55 s from lunge start, lunge 0.3 s (`output/spec.json`) |
| 63 | Branch 4, Arms: swinging your arms makes you run faster; it unlocks Hold on (move onto a car's side, hold on and ride it, then lunge off onto the next car) and a second upgrade not yet chosen | user-confirmed except the second upgrade (9 October; not built); superseded by row 76 (9 October) | — | Hold on needs a rule for "one impact per car" | — |
| 64 | Branch 4, Arms (completes row 63): the core upgrade is Shoulder socket (swing your arms and run faster); the second upgrade is Carry (carry light obstacles and drop them) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | — | Cars must learn about dropped obstacles, or a dropped cone is free bait forever (skill-tree review) | — |
| 65 | Branch 5, Legs: Spring start (full speed from the first step) unlocks Jump (during a lunge, press again to jump over low barriers and obstacles) and Kick (kick objects into a car's path) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | — | Spring start conflicts with row 52 ("starts off running"): if the dummy already runs from the start, Spring start does nothing. Open: keep today's walk-to-run ramp as the limitation, or redefine Spring start. Jump is now the only way over barriers, because no upgrade climbs. | Build: walk 81 px/s ramps to run 162 px/s over 1.0 s (`rampTime` in `output/spec.json`) |
| 66 | Two buttons, like Nintendo A and B | user-confirmed (9 October; not built) | Extra cell (press again for a second lunge) and Jump (press during a lunge) need separate inputs | Replaces GDD section 1's single button; the exhibition setup needs two buttons. Proposed mapping: A = lunge (press again for Extra cell; lunge off a car you are holding on to). B = jump during a lunge, kick when running into a light object, pick up or drop when standing next to one. | GDD Edit 10, section 11.5 |
| 67 | Keep today's one-second walk-to-run build-up; the Spring start upgrade removes it | user-confirmed (9 October) | Gives Spring start a purpose | Replaces row 52's running start; slow turning still stands | Built: `rampTime` 1.0 s in `output/spec.json` |
| 68 | Everyone sees the commit chevron and brake lights; the Sensors upgrade adds the cars' detection zones | user-confirmed (9 October: "Sensors, ok"); what else Sensors shows is open | Keeps pillar 4 for players without the upgrade | Players without Sensors cannot see a car's zone before it notices them | — |
| 69 | Spine: a lunge can change direction by up to 45° | user-confirmed (9 October; not built) | Limits chasing a car's swerve | — | — |
| 70 | A is always the legs (lunge, then lunge and jump); B is always action, the arms | user-confirmed (9 October); the detailed mapping is proposed (GDD Edit 10, section 11.5) | A body logic a player can learn: legs on one button, arms on the other | Jump and Extra cell both use A again. Proposed split by timing: during the lunge is a jump, just after landing is the second lunge. Replaces row 66's proposed mapping. | — |

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "tale",
 "district": "monument",
 "tile": "C1",
 "title": "The LED drum",
 "tale": "The drum lights each bend before a car reaches it, so no colleague is ever surprised. Today one will be. The high road breaks its rail over the street below. Step off it onto a car. Gravity is company policy."
}