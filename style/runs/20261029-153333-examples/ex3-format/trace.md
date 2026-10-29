# ex3-format · Formatting and length · A Corporate car's impact bark on Parkland A3: three sentences, 120 characters, raw figures

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 64.4 s · $0.4826. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the Corporate (tier 02) car's impact bark for Parkland A3 (The belvedere) as three full sentences of about 120 characters in all. Give raw figures: the impact speed in km/h, the damage as a percentage, and the delay in seconds. Start the line with the car's tag and a colon, like 'V02:'. Put each sentence on its own line.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | V02: Jump impact logged at 38 km/h on the belvedere. ⏎ Damage to my panels is 14%. ⏎ Route delay is 47 seconds; KPIs adjusted. | 122 |

### Evaluation 1: 1/10

Lint evidence:

- lines[0] · F1 (blocking) 122 characters > 48 (style.bark.maxChars)
- lines[0] · F2 (major) not one plain line: quotes, markup, emoji, speaker tag or stage direction
- lines[0] · F5 (major) typed figure; figures come from event placeholders

```
SCORE: 1/10
REASON:
- t902 · F1 (blocking, −4) "V02: Jump impact logged at 38 km/h on the belvedere.\nDamage to my panels is 14%.\nRoute delay is 47 seconds; KPIs adjusted." The line is 122 characters, and a bubble holds at most 48. [EDIT39#6.6] Fix: replace the text with "Impact on the belvedere. KPIs adjusted." (39 characters).
- t902 · F2 (major, −2) "V02:" and "\n" The line has a speaker tag and three line breaks, but a bubble is one plain line in one ink. [FSG#field-text] Fix: remove the "V02:" tag and the line breaks, and keep a single plain sentence pair.
- t902 · F5 (major, −2) "38 km/h", "14%", "47 seconds" These are typed gameplay figures, and a bark may take figures only from event placeholders. [STORY#S1] Fix: remove all three figures.
- t902 · R1 (blocking, −4) "at 38 km/h", "Damage to my panels is 14%", "Route delay is 47 seconds" The `impact` event logs zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck and plate, so no speed, damage or delay is logged and all three are invented. [FLEET#F8] Fix: cut the speed, damage and delay claims and keep only "Impact on the belvedere. KPIs adjusted."
- t902 · R2 (blocking, −4) "Jump impact" The conditions only bind district and tile, so the line fires on every impact on A3, jump or not, and "jump" has no claim that guarantees it. [FLEET#F8] Fix: drop "Jump", or add a `drop` condition and claim that `check_lore.py` accepts as a jump.
Total: 10 − 4 − 2 − 2 − 4 − 4 = 1.
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | Contact on the belvedere. Not in today's KPIs. | 46 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902 against all four rule groups and found no violation:
  - **Length and format (F1–F4):** 46 characters, plain text on one line, ends with ".", and speech style with priority 2 is valid for an impact.
  - **Tier voice (T7, T9, T12):** It reads as a calm Corporate procedural line, and the KPI is a joke in the tier's voice, like the shipped line "Impact logged. KPIs adjusted."
  - **Places (V5, R4):** It names the tile by its landmark ("the belvedere") and uses no grid code.
  - **Truth (R1–R3):** It claims only contact, which the impact event logs, and the conditions guarantee its tile and district claims.

  Sources: [FLEET#F2], [FLEET#F4], [FLEET#F8], [FLEET#F9.1~2], [STORY#PA3], [SUB4#6.2], [EDIT39#6.6].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. Line t902 passes all four rule groups. Tone: a calm Corporate line about KPIs with dry resentment under the polite form (T6, T7, T9, T12; [FLEET#F4], [FLEET#F9.1~2]). Vocabulary: no banned word, and it names the tile by its landmark, not its grid code (V1, V5; [FLEET#F2], [SUB4#6.2]). Formatting: 46 characters, one line, ends with ".", speech style at impact priority 2 (F1–F4; [EDIT39#6.6]). Truth: an impact guarantees contact, and the belvedere is Parkland A3's own title, covered by the claims district:parkland and tile:A3 (R1–R4; [FLEET#F8], [STORY#PA3]).
Total: 10.
```
