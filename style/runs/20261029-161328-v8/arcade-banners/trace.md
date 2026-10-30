# arcade-banners · V8 notices · Arcade's district banners

- **Scores:** 1 → 10 → ✓6 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 7 · 136.2 s · $0.9187. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

| Notice | Where | Text | Words |
|---|---|---|---|
| n24 | Arcade: Monument's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · MONUMENT · q WRITE-OFFS'. The text describes the district's streets, as the original does | Neon commerce, LED walls. One road snakes under two north–south highways and splits round the monument. | 16 |
| n25 | Arcade: Parkland's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · PARKLAND · q WRITE-OFFS'. The text describes the district's streets, as the original does | Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath. | 21 |
| n26 | Arcade: Waterfront's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · WATERFRONT · q WRITE-OFFS'. The text describes the district's streets, as the original does | A hill walled by towers; a river below. The valley avenue meets the tunnel and the beach road at the circus; the hill's bridges cross the drive and the river. | 30 |

### Evaluation 1: 1/10

Lint evidence:

- items[1] · F5 (major) typed figure; numbers live in the registry
- items[1] · F6 (blocking) 21 words > 20 (style.v2.text.maxWords)
- items[1] · F10 (major) 123 characters > 110: the slot's width
- items[2] · F6 (blocking) 30 words > 20 (style.v2.text.maxWords)
- items[2] · F10 (major) 158 characters > 110: the slot's width

```
SCORE: 1/10
REASON:
- n24 · T1 (major, −2) "Neon commerce, LED walls. One road snakes under two north–south highways and splits round the monument." It is a flat street survey that does nothing to motivate the trainee, and a notice that does not motivate fails the rule. [EDIT95#3.2] Fix: "Neon commerce, LED walls; one road splits round the monument under the highways. Your training starts there."
- n25 · T1 (major, −2) "Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath." It describes the streets without motivating the trainee or pointing to Opening Day. [EDIT95#3.2] Fix: "Water, concrete and planting; a boulevard passes under the Z1 ring. Your write-offs open the Expo."
- n25 · F5 (major, −2) "45°" This is a typed figure, and numbers live in the registry. [STORY#S1] Fix: delete "45°" and write "a boulevard".
- n25 · F6 (blocking, −4) "Calm, water, concrete and planting. Two Z1 highways meet at …" At 21 words it is over the cap of 20. [EDIT95#3.2] Fix: use the n25 replacement above (16 words).
- n25 · F10 (major, −2) "Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath." At 123 characters it is wider than the slot's 110. [EDIT95#4.2] Fix: use the n25 replacement above (98 characters).
- n26 · T1 (major, −2) "A hill walled by towers; a river below. The valley avenue meets the tunnel and the beach road at the circus; the hill's bridges cross the drive and the river." It lists roads, motivates nothing, and leaves out the Customs frame. [EDIT95#3.2] Fix: "A hill walled by towers; bridges cross the drive to the river. Certified dummies ship across it."
- n26 · F6 (blocking, −4) "A hill walled by towers; a river below. The valley avenue me…" At 30 words it is over the cap of 20. [EDIT95#3.2] Fix: use the n26 replacement above (16 words).
- n26 · F10 (major, −2) "A hill walled by towers; a river below. The valley avenue meets the tunnel and the beach road at the circus; the hill's bridges cross the drive and the river." At 158 characters it is wider than the slot's 110. [EDIT95#4.2] Fix: use the n26 replacement above (96 characters).
Total: 10 − 2 − 2 − 2 − 4 − 2 − 2 − 4 − 2 = 1.
```

## After refinement 1 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n24 | Arcade: Monument's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · MONUMENT · q WRITE-OFFS'. The text describes the district's streets, as the original does | Neon commerce, LED walls; one road splits round the monument under the highways. Your training begins here. | 17 |
| n25 | Arcade: Parkland's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · PARKLAND · q WRITE-OFFS'. The text describes the district's streets, as the original does | Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients. | 17 |
| n26 | Arcade: Waterfront's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · WATERFRONT · q WRITE-OFFS'. The text describes the district's streets, as the original does | A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients. | 19 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked n24, n25 and n26 against the tone rules T1–T5, T13 and T14, the vocabulary rules V1–V10 and the format rules F5, F6 and F10. Each text has 2 sentences and 17, 17 or 19 words, and stays within 110 characters. The street descriptions match the canon for Monument's split road [DECISIONS#rows-231-240~2] row 238 and Parkland's ring road [DECISIONS#rows-231-240~2] row 236. The Opening Day and Customs frames match [EDIT95#3.3], and the deadpan, motivating register follows [EDIT95#3.2] and [PLAY#PS2]. Lint found nothing.
Total: 10.
```

### Confirmation 3: 6/10

```
SCORE: 6/10
REASON:
- n24 · R4 (blocking, −4) "one road splits round the monument under the highways" The canon puts the split road under the raised walkway ring, not under highways, so the banner names a structure the monument's streets do not have there. [DECISIONS#rows-231-240~2] (rows 238, 239) Fix: "Neon commerce, LED walls; one road splits round the monument under the walkway ring. Your training begins here."
Total: 10 − 4 = 6.
```

## After refinement 2 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n24 | Arcade: Monument's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · MONUMENT · q WRITE-OFFS'. The text describes the district's streets, as the original does | Neon shops, LED walls; one road splits round the monument under the walkway ring. Your training begins here. | 18 |
| n25 | Arcade: Parkland's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · PARKLAND · q WRITE-OFFS'. The text describes the district's streets, as the original does | Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients. | 17 |
| n26 | Arcade: Waterfront's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · WATERFRONT · q WRITE-OFFS'. The text describes the district's streets, as the original does | A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients. | 19 |

### Evaluation 4: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked: n24, n25 and n26 have no violations. I checked tone, the company voice and "you", adjectives and repeated slogans, the glossary and banned words, the story frame for each district, length and sentence count, and street truth against the city layout. [EDIT95#3.2] [EDIT95#3.1] [EDIT95#3.3] [STORY#S2] [DECISIONS#rows-231-240~2] [DECISIONS#rows-321-330~2] [FLEET#F2]
Total: 10.
```

### Confirmation 5: 10/10

```
SCORE: 10/10
REASON:
- None. All three banners pass. Lint found nothing: each has 2 sentences, 17 to 19 words, fits its 110-character slot, and uses no banned word, Farsight, "!" or digit. The street details match the canon: Monument's neon shops, its road splitting round the monument and its walkway ring [DECISIONS#rows-231-240~2] (rows 238–239); Parkland's road under the raised ring, with water and concrete [DECISIONS#rows-231-240~2] (rows 236, 240); and Waterfront's hill, edge towers and river bridges [DECISIONS#rows-321-330~2] (rows 321, 322, 329). Each closing sentence fits its act: INDUCTION for Monument, OPENING DAY for Parkland, and CUSTOMS for Waterfront, where Certified dummies ship across the river to clients [EDIT95#3.3]. The tone is flat and motivating, with no cheer, pity or wink, and the clients are served without being seen or named [EDIT95#3.1, EDIT95#3.2, PLAY#PS2].
Total: 10.
```
