# districts · V8.1 notices · The unused CBD and Campus districts

- **Scores:** 1 → 10 → ✓9 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 7 · 122.1 s · $0.803. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

| Notice | Where | Text | Words |
|---|---|---|---|
| n27 | Campus: the district's name (sim.js DISTRICTS.campus.name), title case; set in capitals on labels ('2 · NAME'). Campus Quay, Lab Street and Calibration Road are its screens | FARSIGHT Campus | 2 |
| n28 | CBD: the district's blurb (sim.js DISTRICTS.cbd.blurb), on the district picker. Its form: towers and barriers; a tower on the centre screen | Towers and barriers. FARSIGHT Tower stands at the centre. | 9 |
| n29 | Campus: the district's blurb (sim.js DISTRICTS.campus.blurb), on the district picker. Its form: the test centre the city was modelled on; impact plates on the road score more | The test centre the city was modelled on. Calibrated plates score more. | 12 |
| n30 | CBD: the district's opening banner (content.js places.districts.cbd.intro). Two flyovers cross it, one low and one high; a tower at the centre; towers shade the street | Two flyovers cross the district, one low and one high. FARSIGHT Tower stands at the centre, and towers shade the street. | 21 |
| n31 | Campus: the district's opening banner (content.js places.districts.campus.intro). Impact plates mark the road at the centre; a hit on a plate pays more | Impact plates mark the road at the centre. A hit taken on a plate pays more. | 16 |
| n32 | CBD B2: the centre screen's name (content.js places.districts.cbd.screens.B2), on the map and the screen toast. Its neighbours: Exchange Avenue, Ledger Avenue, Central Quay, Trade Street | FARSIGHT Tower Plaza | 3 |
| n33 | the CBD's centre landmark, its theme name (game.js THEME_NAME.tower), in the screen toast 'B2 · NAME'. The other themes: Lantern monument, Fountain square, Roundabout, Test plates | FARSIGHT Tower | 2 |

### Evaluation 1: 1/10

Lint evidence:

- items[0] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[1] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[2] · V1 (blocking) banned term 'score'
- items[3] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[3] · F6 (blocking) 21 words > 20 (style.v2.text.maxWords)
- items[5] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- items[6] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)

```
SCORE: 1/10
REASON:
- n27 · V1 (blocking, −4) "FARSIGHT Campus" names Farsight inside the game, but Farsight may appear only in the Credits. [EDIT95#0] Fix: "Calibration Campus".
- n28 · V1 (blocking, −4) "FARSIGHT Tower stands at the centre." names Farsight inside the game, but Farsight may appear only in the Credits. [EDIT95#3.1] Fix: "Towers and barriers. Corporation Tower stands over your training."
- n28 · T1 (major, −2) "Towers and barriers. FARSIGHT Tower stands at the centre." is a flat map description that does not motivate the trainee. [EDIT95#3.2] Fix: turn the second sentence toward the training, as in the V1 fix above.
- n29 · V1 (blocking, −4) "Calibrated plates score more." uses the banned word "score". [FLEET#F2] Fix: "The test centre the city was modelled on. Hits on its impact plates count for more."
- n29 · T1 (major, −2) "The test centre the city was modelled on. Calibrated plates score more." describes the district without motivating the trainee. [EDIT95#3.2] Fix: frame the plates as training value, as in the V1 fix above.
- n30 · V1 (blocking, −4) "FARSIGHT Tower stands at the centre" names Farsight inside the game, but Farsight may appear only in the Credits. [EDIT95#3.1] Fix: "Two flyovers cross it, one low and one high. Corporation Tower stands at the centre; towers shade your training."
- n30 · F6 (blocking, −4) "Two flyovers cross the district, one low and one high. FARSIGHT Tower stands at the centre, and towers shade the street." runs to 21 words, over the 20-word cap for notices. [EDIT96#3.2] Fix: use the 19-word replacement above.
- n30 · T1 (major, −2) "towers shade the street." ends the banner on a flat report that does not motivate the trainee. [EDIT95#3.2] Fix: end on the trainee's duty, as in the replacement above.
- n31 · T1 (major, −2) "A hit taken on a plate pays more." is flat reward copy that does not motivate the trainee toward the training. [EDIT95#3.2] Fix: "Impact plates mark the road at the centre. A write-off on a plate counts for more."
- n32 · V1 (blocking, −4) "FARSIGHT Tower Plaza" names Farsight inside the game, but Farsight may appear only in the Credits. [EDIT95#3.1] Fix: "Corporation Tower Plaza".
- n33 · V1 (blocking, −4) "FARSIGHT Tower" names Farsight inside the game, but Farsight may appear only in the Credits. [EDIT95#3.1] Fix: "Corporation Tower".
Total: 10 − 4 − 4 − 2 − 4 − 2 − 4 − 4 − 2 − 2 − 4 − 4 = 1.
```

## After refinement 1 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n27 | Campus: the district's name (sim.js DISTRICTS.campus.name), title case; set in capitals on labels ('2 · NAME'). Campus Quay, Lab Street and Calibration Road are its screens | Calibration Campus | 2 |
| n28 | CBD: the district's blurb (sim.js DISTRICTS.cbd.blurb), on the district picker. Its form: towers and barriers; a tower on the centre screen | Towers and barriers. Corporation Tower stands over your training. | 9 |
| n29 | Campus: the district's blurb (sim.js DISTRICTS.campus.blurb), on the district picker. Its form: the test centre the city was modelled on; impact plates on the road score more | The test centre the city was modelled on. Hits on its impact plates count for more. | 16 |
| n30 | CBD: the district's opening banner (content.js places.districts.cbd.intro). Two flyovers cross it, one low and one high; a tower at the centre; towers shade the street | Two flyovers cross it, one low and one high. Corporation Tower stands at the centre; towers shade your training. | 19 |
| n31 | Campus: the district's opening banner (content.js places.districts.campus.intro). Impact plates mark the road at the centre; a hit on a plate pays more | Impact plates mark the road at the centre. A write-off on a plate counts for more. | 16 |
| n32 | CBD B2: the centre screen's name (content.js places.districts.cbd.screens.B2), on the map and the screen toast. Its neighbours: Exchange Avenue, Ledger Avenue, Central Quay, Trade Street | Corporation Tower Plaza | 3 |
| n33 | the CBD's centre landmark, its theme name (game.js THEME_NAME.tower), in the screen toast 'B2 · NAME'. The other themes: Lantern monument, Fountain square, Roundabout, Test plates | Corporation Tower | 2 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all seven notices against T1–T5, T13 and T14 for tone and voice (`EDIT95#3.2`, `PLAY#PS2`), V1–V4 and V8–V9 for words and lore (`EDIT95#0`, `EDIT95#3.1`, `EDIT95#4.2`), F5, F6 and F10 for length, digits and slot form (`EDIT96#3.2`, `EDIT95#4.2`), and R4 against the slot's facts (two flyovers, towers, a centre tower, impact plates that count for more) (`EDIT96#3.4`). "Corporation Tower" is allowed as the Corporation's name for the old FARSIGHT Tower (`FSG#districts-and-landmarks-p3-city-edits-41-44`), and every text fits its maxChars.
Total: 10.
```

### Confirmation 3: 9/10

```
SCORE: 9/10
REASON:
- n30 · T13 (minor, −1) "Two flyovers cross it, one low and one high." This sentence has two adjectives ("low", "high"), and the rule allows at most one per sentence. [EDIT95#3.2] Fix: "Two flyovers cross it, one above the other."
Total: 10 − 1 = 9.
```

## After refinement 2 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n27 | Campus: the district's name (sim.js DISTRICTS.campus.name), title case; set in capitals on labels ('2 · NAME'). Campus Quay, Lab Street and Calibration Road are its screens | Calibration Campus | 2 |
| n28 | CBD: the district's blurb (sim.js DISTRICTS.cbd.blurb), on the district picker. Its form: towers and barriers; a tower on the centre screen | Towers and barriers. Corporation Tower stands over your training. | 9 |
| n29 | Campus: the district's blurb (sim.js DISTRICTS.campus.blurb), on the district picker. Its form: the test centre the city was modelled on; impact plates on the road score more | The test centre the city was modelled on. Hits on its impact plates count for more. | 16 |
| n30 | CBD: the district's opening banner (content.js places.districts.cbd.intro). Two flyovers cross it, one low and one high; a tower at the centre; towers shade the street | Two flyovers cross it, one above the other. Corporation Tower stands at the centre; towers shade your training. | 18 |
| n31 | Campus: the district's opening banner (content.js places.districts.campus.intro). Impact plates mark the road at the centre; a hit on a plate pays more | Impact plates mark the road at the centre. A write-off on a plate counts for more. | 16 |
| n32 | CBD B2: the centre screen's name (content.js places.districts.cbd.screens.B2), on the map and the screen toast. Its neighbours: Exchange Avenue, Ledger Avenue, Central Quay, Trade Street | Corporation Tower Plaza | 3 |
| n33 | the CBD's centre landmark, its theme name (game.js THEME_NAME.tower), in the screen toast 'B2 · NAME'. The other themes: Lantern monument, Fountain square, Roundabout, Test plates | Corporation Tower | 2 |

### Evaluation 4: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all seven notices against T1–T5, T13 and T14 (deadpan with no "!", "you" as address, no intensifiers, no repeated slogan of four or more words), V1, V3, V4, V8 and V9 ("Corporation Tower" follows the Farsight → Corporation renaming in [EDIT95#4.2] and names no company; "score" is avoided in n29 and n31), F5, F6 and F10 (two sentences or fewer, 20 words or fewer, each within its maxChars, no caps or placeholders to keep), and R4 against each slot's facts (two flyovers, one above the other, and towers in the CBD; impact plates that count for more on Campus) [EDIT96#3.4] [EDIT95#3.2] [FSG#districts-and-landmarks-p3-city-edits-41-44].
Total: 10.
```

### Confirmation 5: 10/10

```
SCORE: 10/10
REASON:
- None. I checked n27–n33 against these rules and found no violations:
  - **Tone T1–T5, T13, T14:** the texts are flat and motivating, use "your training", have no "!", no intensifiers, no repeated slogan, and adjectives stay within limit. [EDIT95#3.2] [PLAY#PS0]
  - **Banned words V1:** "count for more" replaces the slot's "score more", and "Corporation Tower" replaces the old FARSIGHT Tower. [EDIT95#0] [FSG#districts-and-landmarks-p3-city-edits-41-44]
  - **Company name V4:** "Corporation" follows the CORPORATION DRONE pattern. [EDIT95#4.2]
  - **Training framing T3:** a write-off is framed as progress.
  - **Length and form F5, F6, F10:** every text is two sentences or fewer, 18 words or fewer, within maxChars, with no digits and the title case kept.
  - **Truth R4:** the two flyovers, one above the other, the tower at the centre and on B2, the plates that count more, and the test centre the city was modelled on all match the slot and the facts kept. [EDIT96#3.4]
Total: 10.
```
