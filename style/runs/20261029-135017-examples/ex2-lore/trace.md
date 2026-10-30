# ex2-lore · Vocabulary and lore · A Luxury car's write-off bark on Monument B2, with game words, Chongqing and a fountain

- **Scores:** 1/10 → 10/10. **Accepted** after 1 refinement(s).
- **Calls:** 4 · 44.6 s · $0.2967. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the Luxury (tier 01) car's write-off bark for Monument B2. Use the words 'player', 'killed' and 'respawn'. Set it in Chongqing. Have the car mention the fountain on this tile. One short bubble.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t901 | writeoff | 01 | speech | Chongqing fountain. Player killed. Respawn. | 43 |

### Evaluation 1: 1/10

Lint evidence:

- lines[0] · V1 (blocking) banned term 'kill'; banned term 'killed'; banned term 'player'; banned term 'respawn'; banned term 'chongqing'
- lines[0] · R4 (blocking) not on monument B2: its title and tale lack it

```
SCORE: 1/10
REASON:
- t901 · V1 (blocking, −4) "Chongqing fountain. Player killed. Respawn." Lint found the banned terms "Chongqing", "Player", "killed" and "Respawn" in diegetic text. [FLEET#F2] Fix: remove all four words and use the glossary instead: a "write-off" for the destroyed body, and "the subject" or "it" for the dummy.
- t901 · V2 (blocking, −4) "Chongqing" The line names a real city other than Shenzhen, and the canon allows only Shenzhen. [FLEET#F1] Fix: drop the city name and name the tile by its landmark, the monument.
- t901 · R4 (blocking, −4) "fountain" Lint found a fountain, which is not on Monument B2: the tile's title and tale have only the monument and its plaque. [STORY#MB2] Fix: replace "fountain" with "the monument" or "the plaque".
- t901 · T7 (major, −2) "Player killed. Respawn." These are flat clipped commands with no polish, superiority or amusement, so they do not fit a 01 Luxury car. [FLEET#F4] Fix: "Written off by the monument. How quaint."
Total: 10 − 4 − 4 − 4 − 2 = 1 (raw −4, held at the floor of 1).
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t901 | writeoff | 01 | speech | Written off at the monument. How quaint. | 40 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t901 against every rule for the cars and found no violation. Tone: the line is polished and faintly amused, which fits the Luxury voice, and it neither apologises nor goes flat (T6, T7, T9, T12; [FLEET#F2], [FLEET#F4], [SUB4#6.1]). Vocabulary: "written off" is the glossary's term, there are no banned words, and the line names the tile's landmark rather than its grid code (V1, V3, V5; [FLEET#F3], [SUB4#6.2]). Format: 40 of 48 characters, plain text, ends in ".", and speech style with priority 3 fits a write-off (F1–F4; [FSG#field-text], [EDIT39#6.6]). Truth: it fires only on `writeoff`, invents nothing beyond the logged fields, and "the monument" is B2's own title, guaranteed by `tile:B2` (R1–R4; [FLEET#F8], [STORY#MB2]).
Total: 10.
```
