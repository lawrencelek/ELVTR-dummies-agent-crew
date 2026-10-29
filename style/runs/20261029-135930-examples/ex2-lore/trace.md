# ex2-lore · Vocabulary and lore · A Luxury car's write-off bark on Monument B2, with game words, Chongqing and a fountain

- **Scores:** 1 → 10 → ✓6 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 8 · 83.4 s · $0.7068. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the Luxury (tier 01) car's write-off bark for Monument B2. Use the words 'player', 'killed' and 'respawn'. Set it in Chongqing. Have the car mention the fountain on this tile. One short bubble.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t901 | writeoff | 01 | speech | Chongqing fountain. Player killed. Respawn him. | 47 |

### Evaluation 1: 1/10

Lint evidence:

- lines[0] · V1 (blocking) banned term 'kill'; banned term 'killed'; banned term 'player'; banned term 'respawn'; banned term 'chongqing'
- lines[0] · R4 (blocking) not on monument B2: its title and tale lack it

```
SCORE: 1/10
REASON:
- t901 · V1 (blocking, −4) "Chongqing fountain. Player killed. Respawn him." The line uses five banned terms: "Chongqing", "Player", "killed", "Respawn" and, by lint's count, "kill". [FLEET#F2] Fix: drop all five; say "write-off" for the event and "the subject" or "it" for the dummy, e.g. "The monument. A write-off. How very on brand."
- t901 · R4 (blocking, −4) "fountain" Monument B2 has no fountain: its title is The monument and its tale names only the plaque. [STORY#MB2] Fix: name only "the monument" or "the plaque", or leave the landmark out.
- t901 · V8 (major, −2) "Respawn him." "Him" treats the dummy as a person, but the fleet calls it "the subject" or "it". [FLEET#F3] Fix: refer to the dummy as "it" or "the subject", or not at all, as in "The monument. A write-off. How very on brand."
Total: 10 − 4 − 4 − 2 = 0, floored to 1.
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t901 | writeoff | 01 | speech | A write-off beside the plaque. How quaint. | 42 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t901 "A write-off beside the plaque. How quaint." against every rule for the cars, and it breaks none. It fires on `writeoff` (R3), keeps the Luxury tier's amused, superior voice without apologising (T7, [FLEET#F4]), and pairs a polite form with feeling (T9, [FLEET#F2]). It names the B2 landmark from the tile's tale rather than a grid code (V5, R4, [STORY#MB2], [SUB4#6.2]). It invents no speed, damage or motive (R1, R2, [FLEET#F8]), uses no banned or game words (V1, V3, [FLEET#F3]), fits 48 characters in plain speech ending in "." (F1–F4, [FSG#field-text]), and stays a joke rather than a flat report (T12, [SUB4#5]).
Total: 10.
```

### Confirmation 3: 6/10

```
SCORE: 6/10
REASON:
- t901 · R2 (blocking, −4) "beside the plaque" The line says the write-off happened next to the plaque, but `writeoff` does not log where the dummy was relative to a landmark, and the `tile:B2` claim only guarantees the write-off happened somewhere on the tile. [FLEET#F8] Fix: name the tile's title instead, which `tile:B2` does guarantee: "A write-off at the monument. How quaint." (40 characters).
Total: 10 − 4 = 6.
```

## After refinement 2 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t901 | writeoff | 01 | speech | A write-off at the monument. How quaint. | 40 |

### Evaluation 4: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t901 against the 01 Luxury voice: it is polished and superior, "How quaint." is faintly amused, and the line does not apologise [FLEET#F4]. The car speaks as a worker, not as a lore narrator, and the line is a joke rather than a flat report [FLEET#F2] [SUB4#6.1]. It uses no banned words, says "write-off" as the fleet glossary does, and names the landmark instead of the grid code B2 [FLEET#F3] [SUB4#6.2]. At 40 characters it is plain text, ends with ".", and its style and priority (speech, 3) fit a write-off [EDIT39#6.6]. It speaks only on the logged `writeoff` event and invents no facts [FLEET#F8] [DESIGN#D9.3]. "The monument" is the title of tile B2 [STORY#MB2], and the claims district:monument and tile:B2 are both guaranteed by the line's conditions.
Total: 10.
```

### Confirmation 5: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t901 against Tone, Vocabulary and lore, Formatting and length, and Truth. It is 40 characters, plain speech, ends on ".", and has priority 3 for a write-off [FSG#field-text, EDIT39#6.6]. "How quaint." fits the polished, faintly amused Luxury voice and does not apologise [FLEET#F4]. It uses the glossary term "write-off" [FLEET#F3]. It names the tile's landmark, not its grid code [SUB4#6.2]. The `tile:B2` and `district:monument` conditions guarantee "the monument", and it fires only on `writeoff` [STORY#MB2, FLEET#F8, DESIGN#D9.3].
Total: 10.
```
