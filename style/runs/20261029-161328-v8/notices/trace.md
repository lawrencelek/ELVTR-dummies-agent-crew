# notices · V8 notices · Prototype 7.13's interface texts, for Prototype 8

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 108.8 s · $0.5992. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

| Notice | Where | Text | Words |
|---|---|---|---|
| n01 | title screen, under DUMMIES | You are a FARSIGHT crash-test subject. Cars avoid you. Fool them into hitting you. | 14 |
| n02 | Arcade's district screen, under DUMMIES | Welcome, test subject. The fleet will avoid you. Kindly be struck, in the accidents FARSIGHT says cannot happen. | 18 |
| n03 | the title's STORY card | The Test City, tile by tile. Each tile wants its write-offs to Farsight's brief. | 14 |
| n04 | the tile card's header | FARSIGHT BRIEF | 2 |
| n05 | the story map's side panel | FARSIGHT BRIEF · {LABEL} | 4 |
| n06 | the objective strip's label while a drone flies | FARSIGHT DRONE | 2 |
| n07 | a toast | FARSIGHT DRONE · DELIVERING {PART} | 5 |
| n08 | a toast | FARSIGHT DRONE · {PART} ON BOARD · THEN {TILE} | 9 |
| n09 | a toast | FARSIGHT DRONE · CARRYING YOU TO {TILE} | 7 |
| n10 | the gift screen, before the part lands | FARSIGHT DRONE · INCOMING | 4 |
| n11 | a toast | FARSIGHT GIFT · +{N} CREDITS | 5 |
| n12 | the gift screen, the next part | NEXT FROM FARSIGHT | 3 |
| n13 | the workshop, a part not yet issued | A Farsight drone brings this part. | 6 |
| n14 | the workshop's note, a part not yet issued | A Farsight drone brings this part. Keep testing. | 8 |
| n15 | a toast, a part not yet issued | A Farsight drone brings that part | 6 |
| n16 | the Controls list, a verb not yet issued | A Farsight drone brings it | 5 |
| n17 | a toast, the chassis in the river | FARSIGHT drone dispatched: chassis in the river | 7 |
| n18 | a toast, a cone in the way | FARSIGHT drone dispatched. Obstruction will be relocated. | 7 |
| n19 | a toast, the chassis recovered | FARSIGHT drone: chassis recovered from the river | 7 |
| n20 | Arcade's ending, LICENSED | Contract complete. FARSIGHT thanks you for your cooperation. | 8 |
| n21 | Arcade's ending, FAILED TEST | Traffic exhausted. Contract incomplete. Please retry. | 6 |
| n22 | the frame's wordmark, title and menus | FARSIGHT | 1 |
| n23 | Monument A1's LED wall, third line under WELCOME and NEW STAFF (pixel signage) | FARSIGHT | 1 |

### Evaluation 1: 1/10

Lint evidence:

- items[0] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[0] · F6 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- items[1] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[1] · F6 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- items[2] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[3] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[4] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[5] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[6] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[7] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[8] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[9] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[10] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[11] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[12] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[13] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[14] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[15] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[16] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[17] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[18] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[19] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[20] · F6 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- items[21] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[22] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)

```
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
```

## After refinement 1 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n01 | title screen, under DUMMIES | You are a Dummy Corporation trainee. Every write-off brings Certification closer. | 11 |
| n02 | Arcade's district screen, under DUMMIES | Welcome, trainee. Every write-off brings Certification closer. | 7 |
| n03 | the title's STORY card | Shenzhen Smart City, tile by tile. Each tile trains you to its brief. | 13 |
| n04 | the tile card's header | TRAINING BRIEF | 2 |
| n05 | the story map's side panel | TRAINING BRIEF · {LABEL} | 4 |
| n06 | the objective strip's label while a drone flies | CORPORATION DRONE | 2 |
| n07 | a toast | CORPORATION DRONE · DELIVERING {PART} | 5 |
| n08 | a toast | CORPORATION DRONE · {PART} ON BOARD · THEN {TILE} | 9 |
| n09 | a toast | CORPORATION DRONE · CARRYING YOU TO {TILE} | 7 |
| n10 | the gift screen, before the part lands | CORPORATION DRONE · INCOMING | 4 |
| n11 | a toast | CORPORATION GIFT · +{N} CREDITS | 5 |
| n12 | the gift screen, the next part | NEXT FROM THE CORPORATION | 4 |
| n13 | the workshop, a part not yet issued | A Corporation drone brings this part. | 6 |
| n14 | the workshop's note, a part not yet issued | A Corporation drone brings this part. Keep training. | 8 |
| n15 | a toast, a part not yet issued | A Corporation drone brings that part | 6 |
| n16 | the Controls list, a verb not yet issued | A Corporation drone brings it | 5 |
| n17 | a toast, the chassis in the river | Corporation drone dispatched: chassis in the river | 7 |
| n18 | a toast, a cone in the way | Corporation drone dispatched. Obstruction will be relocated. | 7 |
| n19 | a toast, the chassis recovered | Corporation drone: chassis recovered from the river | 7 |
| n20 | Arcade's ending, LICENSED | Training complete. The Corporation thanks you for your service. | 9 |
| n21 | Arcade's ending, FAILED TEST | Traffic exhausted. Training incomplete; report to the bay. | 8 |
| n22 | the frame's wordmark, title and menus | DUMMY CORPORATION | 2 |
| n23 | Monument A1's LED wall, third line under WELCOME and NEW STAFF (pixel signage) | DUMMY CORP | 2 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all 23 notices. Tone, voice and training framing pass T1–T5 and T13 [EDIT95#3.2, EDIT95#3.1, PLAY#PS2]. No banned words, no other city and no other company name appear, and the glossary is used correctly under V1–V4 and V6–V9 [EDIT95#0, FLEET#F3, EDIT95#3.3]. The caps labels, the DUMMY CORP sign and the placeholders match the UI table under F10 [EDIT95#4.2]. Every text keeps within two sentences and 20 words under F6, with no typed figures under F5 [EDIT95#3.2, STORY#S1].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None.
I checked all 23 notices against T1–T5 and T13 for tone, V1, V3, V4, V6 and V9 for vocabulary and lore, F5, F6 and F10 for formatting and length, and R4 and R5 for truth; every text is in Dummy Corporation's deadpan training voice and within its slot's width and the two-sentence, 20-word cap. The drone, gift, brief and wordmark labels and the DUMMY CORP sign match the Prototype 8 replacements exactly, and every placeholder is kept as given [EDIT95#0, EDIT95#3.1, EDIT95#3.2, EDIT95#3.3, EDIT95#4.2, FLEET#F3, PLAY#PS0].
Total: 10.
```
