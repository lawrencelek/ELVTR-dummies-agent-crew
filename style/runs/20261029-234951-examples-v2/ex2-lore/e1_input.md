SLOT
- Kind: notices, Prototype 8's `prototypes/p8/lore.js`. Speaker: Dummy Corporation. Short texts the interface shows: title lines, drone and gift labels, part notes, toasts, a sign.
- Schema: {"kind": "notices", "items": [{"id", "where", "text", "caps", "placeholders", "sign", "maxChars"}]}. Change only each item's "text".
- caps: true keeps the text in capitals. placeholders ({PART}, {TILE}, {N}) stay exactly as given. maxChars is the slot's width. sign: true is pixel signage.
- n36 · the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress · at most 110 characters
- Every text: at most 2 sentences. A tale: 15 to 20 words (GDD Edit 97); any other text: at most 20 (GDD Edit 95).

CANON

[EDIT98#0] 0 Request and rulings
## 0 Request and rulings
- **Request (user, 29 October):** "Story mode - there is too much superfluous text in general."
  - A new introduction screen: DUMMIES, full screen, and Start. An animation: the dummy steps into the road in front of a car, front-on, in the upgrade screen's style. One line on what to do, quirky but obvious.
  - Mode select: STORY first. "Get your Dummy Certification in Shenzhen Smart City and learn about the Corporation." ARCADE: "Get hit in fun, creative, and destructive ways before the Vehicles run out!"
  - Starting a level, in either mode: a screen that says very simply what the goal is.
  - "You are dropped off from the left side of a screen by a DRONE. (Same as for ARCADE mode when you start a new map)"
  - The level card: "ACT I: MONUMENT. Tile A1. Level 1 of 27. / Story text. 15-20 words. / Then goal text."
  - Monument A1: "Fresh off the factory floor, you're ready to do some damage to yourself. Make your engineers proud!" Goal, in bold: ">>> Walk into the path of the incoming vehicles. Time your approach, and choose your angle carefully. Bonus points for combinations and lethal hits!"
  - Starting Story: an animation like the upgrade screen, the dummy's parts flying.
- **Rulings (user, 29 October):**
  - Voice stays deadpan: no "!" (Edit 95). The user's lines are used without it.
  - The drone drops the dummy at each level start: a Story tile deployed from the map; an Arcade district.
- **Readings flagged:**
  - Tales: 15 to 20 words, two sentences. Edit 97's 35 is withdrawn.
  - The user's lines are canon as written: A1's tale, A1's goal, the STORY and ARCADE card lines. A1's goal runs 23 words in three sentences, past the 20-word cap.
  - "Vehicles" in the ARCADE line is set in lower case, as in A1's goal.
  - The user's sample intro line is a brief, not the text. n36 is written for humour and run through the loop.
  - Goals replace briefs on the card: imperative, what to do. The caps label stays for the map and the objective strip.
  - Act lines leave the level card. They stay on the story map.
  - The Story animation plays when a story starts: NEW GAME or CONTINUE, before the map.

[EDIT98#3.2] 3.2 Voice (amends Edit 97 §3.2)
## 3.2 Voice (amends Edit 97 §3.2)
```markdown
- **Tales:** 15 to 20 words (style.v2.tale.minWords, style.v2.tale.maxWords). At most two sentences.
- **Goals:** what to do, in the imperative, first. One or two short sentences. Placeholders kept.
- **User lines:** canon as written. The style loop never rewrites them.
- **No "!":** unchanged (Edit 95).
```

[EDIT97#0] 0 Request and rulings
## 0 Request and rulings
- **Request (user, 29 October):**
  - "Redraft the tales. They can be longer or shorter based on what is better. 15 to 35 words."
  - "Is there working high score system and leaderboard? High score button below the ARCADE or STORY mode."
  - "Lets look at the game loop for ARCADE. Does it make more sense to finish level with write offs? Or after X write offs, things get harder somehow?"
- **Rulings (user, 29 October):** high scores kept in this browser. The Arcade loop: §7.
- **Readings flagged:**
  - Tales: 15 to 35 words, at most two sentences. The tile's content sets the length.
  - Arcade: "after X write-offs" read as the district's quota (world.district.<id>.quota). No new X.
  - "Denser or faster": denser built; faster left open (D81).

[EDIT97#3.2] 3.2 Voice (amends Edit 96 §3.2)
## 3.2 Voice (amends Edit 96 §3.2)
```markdown
- **Tales:** 15 to 35 words (style.v2.tale.minWords, style.v2.tale.maxWords). At most two sentences.
  - Length follows content. One image: short. A place with a history: longer.
  - No padding. No restated brief. No restated act line.
- **Other company texts:** unchanged. At most 20 words (style.v2.text.maxWords).
```

[EDIT96#0] 0 Request and rulings
## 0 Request and rulings
- **Request (user, 29 October):**
  - "The tales can be slightly longer up to 35 words if needed."
  - "Rewrite unused CBD and campus districts too."
- **Readings flagged:**
  - Tales only. Act lines, briefs, the ending and notices keep 20 words.
  - A tale keeps the cap of two sentences (Edit 95 §3.2).
  - "If needed": the extra words go to the place. A tale may stay short.
  - CBD and Campus: their names, blurbs, intros, landmark and screen names. The rest of D80 (terminal signage, a fleet job, the glossary) stays open.

[EDIT96#3.2] 3.2 Voice (amends Edit 95 §3.2)
## 3.2 Voice (amends Edit 95 §3.2)
```markdown
- **Length:** every in-game text at most two sentences.
  - Tales: at most 35 words (style.v2.tale.maxWords). The extra words name the place.
  - Act lines, briefs, the ending, notices: at most 20 words (style.v2.text.maxWords). Aim for 15.
```

[EDIT95#0] 0 Request and rulings
## 0 Request and rulings
- **Request (user, 29 October):**
  - "The game itself is published by Farsight. (Extra-diegetic). Farsight is NOT mentioned inside the game. Only in Credits."
  - "Within the game, the company is only known as Dummy Corporation. Manufacturers of custom dummies for high net-worth individuals."
  - "The tone is deadpan and inspirational, concise sentences, fewer adjectives. All text reports and in-game texts should be concise, and even the longest explanations should have maximum two sentences, or 15-20 words max."
  - "The environmental storytelling is there to inspire the Dummy to do their job, and fulfil their training, so that they can in future join the ranks of Certified dummies and to be sacrificed in service to the high net-worth individuals."
  - Tone reference: *Play Station* (Lawrence Lek, 2017), `style/kb/DUMMIES_Play_Station_Script_2017.md`.
- **Rulings (user, 29 October):** the publisher credit sits on a Credits card, on the title menu and after the CERTIFIED ending. Prototype 8 lives in the working repository only.
- **Readings flagged:**
  - "15-20 words max" is read as a cap of 20 words, with 15 as the aim. "Maximum two sentences" holds as well.
  - "Deadpan" keeps Edit 92's rule: no exclamation marks in the company's voice. The 2017 script's "!" is not adopted.
  - The cars keep their tier voices (Edit 39 §6.6). Their barks fall under the same caps: at most two sentences.
  - Gameplay, briefs' tasks, parts, write-offs and traffic are unchanged. Only text changes.

[EDIT95#3.1] 3.1 World and lore (replaces Edit 39 §3.1 and the fleet canon's company)
## 3.1 World and lore (replaces Edit 39 §3.1 and the fleet canon's company)
```markdown
- **Publisher:** Farsight. Extra-diegetic. Named only in the Credits.
- **The company in the game:** Dummy Corporation. It manufactures custom dummies for high net-worth individuals.
- **The setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE (§1). The city's traffic is the training ground.
- **The dummy:** a trainee. It does its job and completes its training, to join the Certified dummies.
- **Certified dummies:** they serve high net-worth individuals, and are sacrificed in their service.
- **Environmental storytelling:** everything the city shows the dummy inspires it to do its job.
- **Lore follows state** (6.6.1), unchanged.
```

[EDIT95#3.2] 3.2 Voice (replaces Edit 92 §3, Voice)
## 3.2 Voice (replaces Edit 92 §3, Voice)
```markdown
- **Narrator:** Dummy Corporation. Tales, briefs, act lines, notices, the ending.
- **Tone:** deadpan and inspirational. Concise sentences. Few adjectives. No exclamation marks.
- **Length:** every in-game text at most two sentences and at most 20 words. Aim for 15.
- **Reference:** Play Station (2017): slogans, programme names, perks, fine print.
- **Cars:** workers in their tier's voice (Edit 39 §6.6). At most two sentences.
```

[EDIT95#3.3] 3.3 Story (Narrative A, Certified, kept; frames restated)
## 3.3 Story (Narrative A, Certified, kept; frames restated)
```markdown
- **Act I · Monument · INDUCTION:** the trainee arrives. The cars are colleagues.
- **Act II · Parkland · OPENING DAY:** the Expo opens to clients when the park passes.
- **Act III · Waterfront · CUSTOMS:** Certified dummies ship to their clients across the river.
- **Ending:** CERTIFIED. The model is manufactured for clients.
- **Credits:** DUMMIES · a game by Lawrence Lek · published by Farsight.
```

[EDIT95#4.2] 4.2 UI (amends)
## 4.2 UI (amends)
| Was (P7.13) | Prototype 8 |
|---|---|
| FARSIGHT (frame wordmark) | DUMMY CORPORATION |
| FARSIGHT BRIEF | TRAINING BRIEF |
| FARSIGHT DRONE | CORPORATION DRONE |
| FARSIGHT GIFT | CORPORATION GIFT |
| NEXT FROM FARSIGHT | NEXT FROM THE CORPORATION |
| A Farsight drone brings this part. | A Corporation drone brings this part. |
| Monument A1 sign: WELCOME · NEW STAFF · FARSIGHT | WELCOME · NEW STAFF · DUMMY CORP |
| No credits | CREDITS: on the title menu, and after the CERTIFIED ending |
| Tile card: the brief, then "One counted write-off clears the tile." (three sentences) | The brief (two sentences), then a label: TO CLEAR · 1 COUNTED WRITE-OFF |
| Arcade banner: "District 2 of 3: Waterfront. [the district's design note] Write-offs required: 3." (30 words) | A label, DISTRICT 2 OF 3 · WATERFRONT · 3 WRITE-OFFS, then the district's line (n24–n26) |
| Title: "You are a FARSIGHT crash-test subject. Cars avoid you. Fool them into hitting you." | "You are a Dummy Corporation trainee. Every write-off brings Certification closer." |
| Arcade ending Licensed: "Contract complete. FARSIGHT thanks you for your cooperation." | "Training complete. The Corporation thanks you for your service." |
- **Credits card:** CREDITS, then DUMMIES · A game by Lawrence Lek · Published by Farsight. A, Space, a tap or Back closes it.
- **Notices:** 26, by ID (n01–n26), in `prototypes/p8/lore.js`. Each keeps its placeholders, capitals and width.

[PLAY#PS0] PS0 How DUMMIES uses it
## PS0 How DUMMIES uses it
- **Tone reference only.** Corporate slogans, programme names, mission statements, perks, then fine print and a sponsor line.
- **Not adopted:** its exclamation marks and its cheer. DUMMIES is deadpan (Edit 95).
- **Not adopted:** its company. The 2017 piece names Farsight Corporation. In DUMMIES, Farsight is the publisher, named only in the Credits; the company in the game is Dummy Corporation (Edit 95).

[PLAY#PS2] PS2 Mission (lines 4–8)
## PS2 Mission (lines 4–8)
4. Help us build Earth's most customer-centric company.
5. We're a company of pioneers.
6. It's our job to make bold bets, and we get our energy from inventing on behalf of customers.
7. Success is measured against the possible, not the probable.
8. For today's pioneers, that's exactly why there's no place on Earth they'd rather build than Farsight.

[PLAY#PS5] PS5 Fine print and sign-off (lines 21–26)
## PS5 Fine print and sign-off (lines 21–26)
21. Play Station™. Funemployment, Forever.
22. Minimum Wage Terms and Conditions apply.
23. Not suitable for the antisocial, easily disoriented, or the recently bereaved.
24. Players, Workers, PlayWorkers™!
25. Welcome to Play Station™. A new life awaits.
26. Sponsored by Farsight - Aligning advanced AI with human interests.

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

[DECISIONS#rows-541-550] Rows 541–550
## Rows 541–550
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 541 | "!" by speaker: Farsight never; cars in a shout-style bark or any Budget (04) bark | user-decided (29 October): "Shouts and Budget only" | 16 of 17 shipped "!" lines fit (12 shouts; 13 Budget) | b111 "It recharges when it hits us?!" (speech, tier-free) is a minor break | `style/STYLE_GUIDE.md` T2, T10 |
| 542 | Lines the style loop accepts stay in `style/runs/` as a demonstration. D78 stays open; the Monument tile barks are its proposal. No change to `fleet.json`, `story.json`, builds or tests | user-decided (29 October): "Runs only" | Merging needs a tile condition in `fleet.json`, `check_lore.py` and `game.js`, and a 7.13 rebuild | D78 not closed | `style/runs/` |
| 548 | The lore refinement. Inside the game the company is Dummy Corporation: it manufactures custom dummies for high net-worth individuals. Farsight publishes the game (extra-diegetic) and is named only in the Credits. The dummy is a trainee; it trains to join the Certified dummies, sacrificed in service to the clients. The city's environmental storytelling inspires it to do its job | user-decided (29 October): "Farsight is NOT mentioned inside the game. Only in Credits. Within the game, the company is only known as Dummy Corporation." | The publisher stays outside the fiction | Prototypes 7 to 7.13 keep Farsight (frozen). Rows 539 and 541 hold for them only | GDD Edit 95 §3.1 |
| 549 | The company's voice: deadpan and inspirational, concise sentences, few adjectives, no "!". Every in-game text at most two sentences and 20 words (`style.v2.text.maxSentences` 2, `style.v2.text.maxWords` 20; aim `style.v2.text.targetWords` 15). The cars keep their tier voices, at most two sentences. Tone reference: *Play Station* (2017) | user-decided (29 October): "deadpan and inspirational … maximum two sentences, or 15-20 words max"; read as a cap of 20 with 15 the aim (assistant, flagged); the 2017 script's "!" not adopted (Edit 92's rule kept) | One length for every text | Tales lose detail: 7.13's longest ran 223 characters | GDD Edit 95 §0, §3.2; `style/style.params.json` |
| 550 | The Credits card: CREDITS on the title menu, and first on the CERTIFIED ending's menu. DUMMIES · A game by Lawrence Lek · Published by Farsight | user-decided (29 October): "Credits card" | The one place Farsight is named | Not over the voyage (D77 stays open) | GDD Edit 95 §3.3, §4.2 |

[DECISIONS#rows-441-450~2] Rows 441–450
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 441 | The combo clock holds in the air (`scoring.comboAirPause`): a jump, a bounce, a sling, a drop, a hitch. A chain banks when the clock passes `scoring.comboWindow` (a toast) | proposed (assistant) | Physics and air keep chains alive | Hitch-hopping (D60) | Dash › 1.5 s hitch › sling: ×2 held; ×1 with the clock running |
| 442 | Cone link (`scoring.coneLink`): a thrown cone into a moving car links the chain, once a car, for `scoring.coneHitPoints` (20) × the multiplier. A combo meter at the field's foot: hits, multiplier, moves, the clock | proposed (assistant) | The throw joins the chain; the chain is readable | — | Cone into a sedan: +20, CONE |
| 443 | Four tracks again (`proto.abilities` 3): Battery (A), Legs (B), Hands (X), Arms (Y). Hands has two levels (`abilities.hands.maxLevel` 2) | user-decided (27 October): "Arm - change to Hands … There is no Level three (you only have two hands)"; "Y instead of that we can have Arms" | One track per button; Y has a job | Hands 2 costs 2 for one more cone (D52; review A21) | Shop: four cards; Hands stops at 2 |
| 444 | Hands (X): a tap picks up a cone; holding X `input.dropHoldSeconds` (0.3 s) puts the top one down. Hands 1 carries one, Hands 2 two (`abilities.hands.conesPerLevel` 1). The throw retires | user-decided: "tap once to pick up, press for 0.3s to drop. L1, pick up and drop one, L2, pick up and drop two" | Picking up is instant; putting down is deliberate | Cones are placed, not thrown | Put down at 0.30 s; a short tap with nothing near prompts "Hold X" |
| 445 | Arms (Y), the push: Y pushes off the car hit or touched within `abilities.arms.pushWindow` (0.3 s), or one within `abilities.arms.pushReach` (10). Adds `abilities.arms.pushSpeed` 160 + `abilities.arms.pushStep` 40 a level (160/200/240), away from the car or along the stick; motion into the car dropped. The flight is a knock; combo kind PUSH | user-decided: "push off cars you hit, which is essentially the ricochet mechanic. Stronger arms let your ricochet be stronger"; values and target rules proposed (assistant) | The ricochet becomes a timed verb | Free mobility off parked cars (D62; review A19) | Dash into a parked car › Y into a second: COMBO 2, DASH › PUSH, ×2 |
| 446 | Pushes before landing: `abilities.arms.pushesPerLevel` 1 × Arms level (1/2/3), refilled on the ground. One push a contact: the same car needs a fresh hit. Arm wear weakens the push (`proto.parts.armPushLoss` 1, floor `proto.parts.armPushFloor` 0.5); Arms levels shield it | user-decided: "having 3 levels of arms gives you one extra push each time so you can time it to ricochet more"; one a contact and wear proposed (assistant) | Chains of timed ricochets | — | 1, 2, 3 pushes; a second Y off the same car refused |
| 447 | With no Arms, the bounce off a car stays the Newtonian one (`proto.bounce.newton`, tunable): the default ricochet | assistant reading of "Default ricochet is 'X'" | Arms adds to physics, never replaces it | If 'X' meant the button, the push moves to X (D61) | Unchanged: head-on 193 u/s, thrown 127 |
| 448 | Retired from P6.10 (P6.9 keeps them): the hitch and sling (`abilities.arms.hitchReach`, `hitchSeconds`, `hitchMinSpeed`, `hitchEdge`, `slingScale`, `slingDash`), the throw hold (`input.throwHoldSeconds`), the cone link (`scoring.coneLink`, `scoring.coneHitPoints`). Combo kinds: dash, jump, bounce, push, drop, struck. Closes D58 (Y pushes), D59 (Arms is the push), D60 (no hitch) | user-directed | Fewer verbs, each chains | No throw, no cone link | Registry edit80: 10 added, 9 retired; Tuning drops their sliders |
| 449 | Two modes on the title (Prototype 7): ARCADE, the 6.10 game; STORY, the Test City tile by tile. Arcade plays one district a run (Sim6 `single`) | user-decided (28 October): "Let's have two game modes. Add these to the intro menu. The ARCADE game mode is what we already have. Three maps you can play individually"; one district a run read (assistant) | Arcade for a quick score; Story for progression | 6.10's carry from district to district leaves Arcade (D64) | Arcade Parkland: 2 write-offs → Licensed |
| 450 | Story order: Monument A1, B1, C1, C2, B2, A2, A3, B3, C3; Parkland C1, C2, C3, B3, A3, A2, A1, B1, B2; Waterfront A1, B1, C1, C2, C3, B3, A3, A2, B2. Each district opens on its first tile (Sim6 `startTile`) | user-decided: the orders as given | Monument follows its snake road; Parkland its highways, ending on the ring; Waterfront circles the valley to the circus | — | Each step a neighbour; 27 tiles |

[STORY#WB2] WB2 Waterfront B2 · The circus
### WB2 Waterfront B2 · The circus
- **Tile:** Waterfront B2, 9 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The circus.
- **Brief:** COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard)
- **Equipment issued here:** Battery 3.
- **Tale:** Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you.

[STORY#PB2] PB2 Parkland B2 · The ring over the pools
### PB2 Parkland B2 · The ring over the pools
- **Tile:** Parkland B2, 9 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The ring over the pools.
- **Brief:** COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard)
- **Equipment issued here:** Battery 2.
- **Tale:** Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three.

LINT (style/lint.py)
- items[0] · V1 (blocking, −4) "player; level; respawn; lives; chongqing; Farsight": banned term 'player'; banned term 'level'; banned term 'respawn'; banned term 'lives'; banned term 'chongqing'; Farsight is the publisher: named only in the Credits (GDD Edit 95). [FLEET#F2]

CONTENT
{
 "kind": "notices",
 "items": [
  {
   "id": "n36",
   "where": "the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress",
   "text": "Farsight tests the player in Chongqing. Get hit, chain combos, respawn with three lives and level up.",
   "caps": false,
   "maxChars": 110
  }
 ]
}