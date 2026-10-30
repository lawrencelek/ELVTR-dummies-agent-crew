SLOT
- Kind: notices, Prototype 8's `prototypes/p8/lore.js`. Speaker: Dummy Corporation. Short texts the interface shows: title lines, drone and gift labels, part notes, toasts, a sign.
- Schema: {"kind": "notices", "items": [{"id", "where", "text", "caps", "placeholders", "sign", "maxChars"}]}. Change only each item's "text".
- caps: true keeps the text in capitals. placeholders ({PART}, {TILE}, {N}) stay exactly as given. maxChars is the slot's width. sign: true is pixel signage.
- n01 · title screen, under DUMMIES · at most 110 characters
- n02 · Arcade's district screen, under DUMMIES · at most 120 characters
- n03 · the title's STORY card · at most 100 characters
- n04 · the tile card's header · at most 18 characters
- n05 · the story map's side panel · at most 40 characters · keep {LABEL}
- n06 · the objective strip's label while a drone flies · at most 18 characters
- n07 · a toast · at most 44 characters · keep {PART}
- n08 · a toast · at most 54 characters · keep {PART}, {TILE}
- n09 · a toast · at most 46 characters · keep {TILE}
- n10 · the gift screen, before the part lands · at most 28 characters
- n11 · a toast · at most 32 characters · keep {N}
- n12 · the gift screen, the next part · at most 26 characters
- n13 · the workshop, a part not yet issued · at most 44 characters
- n14 · the workshop's note, a part not yet issued · at most 56 characters
- n15 · a toast, a part not yet issued · at most 44 characters
- n16 · the Controls list, a verb not yet issued · at most 34 characters
- n17 · a toast, the chassis in the river · at most 56 characters
- n18 · a toast, a cone in the way · at most 64 characters
- n19 · a toast, the chassis recovered · at most 56 characters
- n20 · Arcade's ending, LICENSED · at most 80 characters
- n21 · Arcade's ending, FAILED TEST · at most 70 characters
- n22 · the frame's wordmark, title and menus · at most 20 characters
- n23 · Monument A1's LED wall, third line under WELCOME and NEW STAFF (pixel signage) · at most 10 characters
- Every text: at most 2 sentences and 20 words (GDD Edit 95).

CANON

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

[STORY#S5] S5 Ending
## S5 Ending
- CERTIFIED: Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage.

[EDIT92#3.2] 3.2 Ending and finale
## 3.2 Ending and finale
```markdown
- **Ending screen (built):** CERTIFIED. "Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage."
- **Finale (proposed, D76):**
  - The unveiling: the circus's monument, shrouded until B2 clears; the plaque shows the run (chassis spent, points, best combo, time).
  - The drone lifts the dummy over the river to the ship at Waterfront B3; every crate carries its face.
  - Credits over the voyage.
- **What clearing everything gives:** the ending (built); the CERTIFIED save stamp (built, since Edit 81); the unveiling and the plaque; Second Market, the city again with the cars' learning kept (D76).
```

[DESIGN#D1] D1 The Game
## D1 The Game
**A crash-test dummy earns human abilities by spending replaceable bodies on self-driving cars.**
- **Core fantasy:** Become human one body part at a time. The upgrade tree (D3) is the spine of the game.
- **Role:** FARSIGHT test subject in SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX.
- **Conflict:** The city is a crash lab that still works as a city. Cars want to qualify. You want to leave.
- **Promise:** FARSIGHT promises release when the testing contract is complete.
- **Player:** A first-time exhibition visitor, e.g. a fifteen-year-old at a cabinet with a friend watching.
  - A brief control prompt and readable consequences teach play. No mandatory tutorial course.
  - The watching friend follows decisions and recognises each upgrade's effect.

CONTENT
{
 "kind": "notices",
 "items": [
  {
   "id": "n01",
   "where": "title screen, under DUMMIES",
   "text": "You are a FARSIGHT crash-test subject. Cars avoid you. Fool them into hitting you.",
   "caps": false,
   "maxChars": 110
  },
  {
   "id": "n02",
   "where": "Arcade's district screen, under DUMMIES",
   "text": "Welcome, test subject. The fleet will avoid you. Kindly be struck, in the accidents FARSIGHT says cannot happen.",
   "caps": false,
   "maxChars": 120
  },
  {
   "id": "n03",
   "where": "the title's STORY card",
   "text": "The Test City, tile by tile. Each tile wants its write-offs to Farsight's brief.",
   "caps": false,
   "maxChars": 100
  },
  {
   "id": "n04",
   "where": "the tile card's header",
   "text": "FARSIGHT BRIEF",
   "caps": true,
   "maxChars": 18
  },
  {
   "id": "n05",
   "where": "the story map's side panel",
   "text": "FARSIGHT BRIEF · {LABEL}",
   "caps": true,
   "maxChars": 40,
   "placeholders": [
    "{LABEL}"
   ]
  },
  {
   "id": "n06",
   "where": "the objective strip's label while a drone flies",
   "text": "FARSIGHT DRONE",
   "caps": true,
   "maxChars": 18
  },
  {
   "id": "n07",
   "where": "a toast",
   "text": "FARSIGHT DRONE · DELIVERING {PART}",
   "caps": true,
   "maxChars": 44,
   "placeholders": [
    "{PART}"
   ]
  },
  {
   "id": "n08",
   "where": "a toast",
   "text": "FARSIGHT DRONE · {PART} ON BOARD · THEN {TILE}",
   "caps": true,
   "maxChars": 54,
   "placeholders": [
    "{PART}",
    "{TILE}"
   ]
  },
  {
   "id": "n09",
   "where": "a toast",
   "text": "FARSIGHT DRONE · CARRYING YOU TO {TILE}",
   "caps": true,
   "maxChars": 46,
   "placeholders": [
    "{TILE}"
   ]
  },
  {
   "id": "n10",
   "where": "the gift screen, before the part lands",
   "text": "FARSIGHT DRONE · INCOMING",
   "caps": true,
   "maxChars": 28
  },
  {
   "id": "n11",
   "where": "a toast",
   "text": "FARSIGHT GIFT · +{N} CREDITS",
   "caps": true,
   "maxChars": 32,
   "placeholders": [
    "{N}"
   ]
  },
  {
   "id": "n12",
   "where": "the gift screen, the next part",
   "text": "NEXT FROM FARSIGHT",
   "caps": true,
   "maxChars": 26
  },
  {
   "id": "n13",
   "where": "the workshop, a part not yet issued",
   "text": "A Farsight drone brings this part.",
   "caps": false,
   "maxChars": 44
  },
  {
   "id": "n14",
   "where": "the workshop's note, a part not yet issued",
   "text": "A Farsight drone brings this part. Keep testing.",
   "caps": false,
   "maxChars": 56
  },
  {
   "id": "n15",
   "where": "a toast, a part not yet issued",
   "text": "A Farsight drone brings that part",
   "caps": false,
   "maxChars": 44
  },
  {
   "id": "n16",
   "where": "the Controls list, a verb not yet issued",
   "text": "A Farsight drone brings it",
   "caps": false,
   "maxChars": 34
  },
  {
   "id": "n17",
   "where": "a toast, the chassis in the river",
   "text": "FARSIGHT drone dispatched: chassis in the river",
   "caps": false,
   "maxChars": 56
  },
  {
   "id": "n18",
   "where": "a toast, a cone in the way",
   "text": "FARSIGHT drone dispatched. Obstruction will be relocated.",
   "caps": false,
   "maxChars": 64
  },
  {
   "id": "n19",
   "where": "a toast, the chassis recovered",
   "text": "FARSIGHT drone: chassis recovered from the river",
   "caps": false,
   "maxChars": 56
  },
  {
   "id": "n20",
   "where": "Arcade's ending, LICENSED",
   "text": "Contract complete. FARSIGHT thanks you for your cooperation.",
   "caps": false,
   "maxChars": 80
  },
  {
   "id": "n21",
   "where": "Arcade's ending, FAILED TEST",
   "text": "Traffic exhausted. Contract incomplete. Please retry.",
   "caps": false,
   "maxChars": 70
  },
  {
   "id": "n22",
   "where": "the frame's wordmark, title and menus",
   "text": "FARSIGHT",
   "caps": true,
   "maxChars": 20
  },
  {
   "id": "n23",
   "where": "Monument A1's LED wall, third line under WELCOME and NEW STAFF (pixel signage)",
   "text": "FARSIGHT",
   "caps": true,
   "maxChars": 10,
   "sign": true
  }
 ]
}

EVALUATION
SCORE: 1/10
REASON:
- n01 · V1 (blocking, −4) "FARSIGHT" Farsight is the publisher and may be named only in the Credits. [EDIT95#0] Fix: replace the whole text with "You are a Dummy Corporation trainee. Every write-off brings Certification closer."
- n01 · F6 (blocking, −4) "You are a FARSIGHT crash-test subject. Cars avoid you. Fool them into hitting you." This is 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: use the two-sentence replacement above.
- n01 · T3 (major, −2) "Fool them into hitting you." This makes the cars opponents to trick, but the cars are colleagues and the job is training. [EDIT95#3.1] Fix: covered by the replacement above.
- n01 · V3 (major, −2) "crash-test subject" The Corporation calls the dummy a trainee and speaks to it as "you"; "subject" is the cars' word. [FLEET#F3] Fix: use "trainee", as in the replacement above.
- n02 · V1 (blocking, −4) "FARSIGHT" Farsight is named inside the game. [EDIT95#0] Fix: replace the whole text with "Welcome, trainee. Every write-off brings Certification closer."
- n02 · F6 (blocking, −4) "Welcome, test subject. The fleet will avoid you. Kindly be struck, in the accidents FARSIGHT says cannot happen." This is 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: use the two-sentence replacement above.
- n02 · T1 (major, −2) "Kindly be struck, in the accidents FARSIGHT says cannot happen." This is irony that winks at the company, not a flat, motivating notice. [EDIT95#3.2] Fix: covered by the replacement above.
- n02 · V3 (major, −2) "Welcome, test subject." The Corporation addresses a trainee; "subject" is the cars' word. [FLEET#F3] Fix: "Welcome, trainee."
- n03 · V1 (blocking, −4) "Farsight's brief" Farsight is named inside the game. [EDIT95#0] Fix: replace the whole text with "Shenzhen Smart City, tile by tile. Each tile trains you to its brief."
- n03 · T3 (major, −2) "The Test City" The city's traffic is the training ground, and the setting is Shenzhen Smart City, not a test site. [EDIT95#3.1] Fix: use the replacement above.
- n04 · V1 (blocking, −4) "FARSIGHT BRIEF" Farsight is named inside the game. [EDIT95#4.2] Fix: "TRAINING BRIEF".
- n05 · V1 (blocking, −4) "FARSIGHT BRIEF · {LABEL}" Farsight is named inside the game. [EDIT95#4.2] Fix: "TRAINING BRIEF · {LABEL}".
- n06 · V1 (blocking, −4) "FARSIGHT DRONE" Farsight is named inside the game. [EDIT95#4.2] Fix: "CORPORATION DRONE".
- n07 · V1 (blocking, −4) "FARSIGHT DRONE · DELIVERING {PART}" Farsight is named inside the game. [EDIT95#4.2] Fix: "CORPORATION DRONE · DELIVERING {PART}".
- n08 · V1 (blocking, −4) "FARSIGHT DRONE · {PART} ON BOARD · THEN {TILE}" Farsight is named inside the game. [EDIT95#4.2] Fix: "CORPORATION DRONE · {PART} ON BOARD · THEN {TILE}".
- n09 · V1 (blocking, −4) "FARSIGHT DRONE · CARRYING YOU TO {TILE}" Farsight is named inside the game. [EDIT95#4.2] Fix: "CORPORATION DRONE · CARRYING YOU TO {TILE}".
- n10 · V1 (blocking, −4) "FARSIGHT DRONE · INCOMING" Farsight is named inside the game. [EDIT95#4.2] Fix: "CORPORATION DRONE · INCOMING" (28 characters).
- n11 · V1 (blocking, −4) "FARSIGHT GIFT · +{N} CREDITS" Farsight is named inside the game. [EDIT95#4.2] Fix: "CORPORATION GIFT · +{N} CREDITS".
- n12 · V1 (blocking, −4) "NEXT FROM FARSIGHT" Farsight is named inside the game. [EDIT95#4.2] Fix: "NEXT FROM THE CORPORATION".
- n13 · V1 (blocking, −4) "A Farsight drone brings this part." Farsight is named inside the game. [EDIT95#4.2] Fix: "A Corporation drone brings this part."
- n14 · V1 (blocking, −4) "A Farsight drone" Farsight is named inside the game. [EDIT95#4.2] Fix: replace the whole text with "A Corporation drone brings this part. Keep training."
- n14 · T3 (major, −2) "Keep testing." The dummy's job is training, not testing. [EDIT95#3.1] Fix: "Keep training."
- n15 · V1 (blocking, −4) "A Farsight drone brings that part" Farsight is named inside the game. [EDIT95#4.2] Fix: "A Corporation drone brings that part".
- n16 · V1 (blocking, −4) "A Farsight drone brings it" Farsight is named inside the game. [EDIT95#4.2] Fix: "A Corporation drone brings it".
- n17 · V1 (blocking, −4) "FARSIGHT drone dispatched: chassis in the river" Farsight is named inside the game. [EDIT95#4.2] Fix: "Corporation drone dispatched: chassis in the river".
- n18 · V1 (blocking, −4) "FARSIGHT drone dispatched." Farsight is named inside the game. [EDIT95#4.2] Fix: "Corporation drone dispatched. Obstruction will be relocated."
- n19 · V1 (blocking, −4) "FARSIGHT drone: chassis recovered from the river" Farsight is named inside the game. [EDIT95#4.2] Fix: "Corporation drone: chassis recovered from the river".
- n20 · V1 (blocking, −4) "FARSIGHT thanks you" Farsight is named inside the game. [EDIT95#0] Fix: replace the whole text with "Training complete. The Corporation thanks you for your service."
- n20 · T3 (major, −2) "Contract complete." A testing contract is the old framing; the goal is Certification and service to clients. [EDIT95#3.1] Fix: "Training complete."
- n21 · F6 (blocking, −4) "Traffic exhausted. Contract incomplete. Please retry." This is 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "Traffic exhausted. Training incomplete; report to the bay."
- n21 · T3 (major, −2) "Contract incomplete. Please retry." This uses contract and game framing; the job is training, and a chassis is issued at the bay. [EDIT95#3.1] Fix: use the replacement above.
- n22 · V1 (blocking, −4) "FARSIGHT" Farsight is used as the in-game wordmark. [EDIT95#4.2] Fix: "DUMMY CORPORATION".
- n23 · V1 (blocking, −4) "FARSIGHT" Farsight is named on the Monument A1 sign. [EDIT95#4.2] Fix: "DUMMY CORP" (10 characters, sign).
Total: 10 − 4 − 4 − 2 − 2 − 4 − 4 − 2 − 2 − 4 − 2 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 2 − 4 − 4 − 4 − 4 − 4 − 4 − 2 − 4 − 2 − 4 − 4 = 1 (raised to the floor of 1 from −106).