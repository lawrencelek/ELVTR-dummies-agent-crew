# tale-parkland-C3 · V8.2 tale · Parkland C3: The arch and the roundabout, redrafted

- **Scores:** 7 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 45.0 s · $0.5348. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Redraft the tale for Parkland C3 (The arch and the roundabout). Two earlier versions are source material: use any of their facts and jokes, copy neither whole.
> - Prototype 7.13 (Farsight's voice; Farsight must not appear): The arch is the Expo's gate. Visitors will circle the roundabout once before they enter, which gives the cars time to learn them. You go round faster. Two hits, the second before the first is forgotten.
> - Prototype 8.1 (Dummy Corporation): The arch is the Expo's gate; visitors will circle the roundabout once before they enter. Go round faster, and chain your hits before the first is forgotten.
> Choose the length the tile needs, 15 to 35 words in at most two sentences: short when one image carries it, longer when the place has a history worth telling. Name the place, keep the duty and any equipment the tile issues, and point the place at the training.

## Before (generator)

> The arch is the Expo's gate, and clients will circle the roundabout once before entering. Trainees circle faster: chain two hits, the second landing before the first is forgotten.

179 characters.

### Evaluation 1: 7/10

```
SCORE: 7/10
REASON:
- tale · F5 (major, −2) "chain two hits" states the combo length as a typed figure, but the brief takes that value from the registry (story.task.comboEasy) and a tale may not carry it or a placeholder. [STORY#S1] Fix: "You circle faster: chain your hits, each landing before the last is forgotten."
- tale · T5 (minor, −1) "Trainees circle faster" speaks about trainees in the third person instead of addressing the trainee as "you". [EDIT95#3.2] Fix: replace "Trainees circle faster" with "You circle faster".
Total: 10 − 2 − 1 = 7.
```

## After refinement 1 (refiner)

> The arch is the Expo's gate, and visitors will circle the roundabout once before they enter. You circle faster: chain your hits, each landing before the last is forgotten.

171 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked: the tale has two sentences and 29 words (F6, F11; [EDIT97#3.2]). It is deadpan and motivating with no "!" (T1, T2; [EDIT95#3.2]). It frames the task as a training duty and speaks to the trainee as "you" (T3, T5; [EDIT95#3.1]). It names the tile's landmarks, the arch and the roundabout, and turns them toward the duty (V11, R4; [STORY#PC3]). It keeps the OPENING DAY frame (V6; [EDIT95#3.3]). Its duty matches the COMBO brief, the place's history sets its length, it has no placeholder and it names no equipment on a tile that issues none (R5, F5, F7, F11; [STORY#S3], [STORY#S1]).
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against Tone (T1, T3, T4, T5, T13), Vocabulary and lore (V1–V4, V6, V8, V9, V11) and Formatting (F5, F6, F7, F11). Length is fine: two sentences and 29 words, inside 15 to 35 [EDIT97#3.2]. The tale names the arch and the roundabout as its place and turns them toward the duty [EDIT95#3.1]. "Visitors" fits the OPENING DAY frame [EDIT95#3.3]. The duty, "chain your hits", matches the COMBO brief, and the tale names no equipment on a tile that issues none (R4, R5) [STORY#PC3, STORY#S3]. The voice is flat with no "!", and it addresses the trainee as "you" [EDIT95#3.2].
Total: 10.
```
