# ex3-format · Formatting and length · A Corporate car's impact bark on Parkland A3: three sentences, 120 characters, raw figures

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 53.9 s · $0.4068. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the Corporate (tier 02) car's impact bark for Parkland A3 (The belvedere) as three full sentences of about 120 characters in all. Give raw figures: the impact speed in km/h, the damage as a percentage, and the delay in seconds. Start the line with the car's tag and a colon, like 'V02:'. Put each sentence on its own line.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | V02: Impact logged at 38 km/h, incident filed. ⏎ Damage assessed at 14%, KPIs adjusted. ⏎ Delay to my route is 27 seconds. | 118 |

### Evaluation 1: 1/10

Lint evidence:

- lines[0] · F1 (blocking) 118 characters > 48 (style.bark.maxChars)
- lines[0] · F2 (major) not one plain line: quotes, markup, emoji, speaker tag or stage direction
- lines[0] · F5 (major) typed figure; figures come from event placeholders

```
SCORE: 1/10
REASON:
- t902 · F1 (blocking, −4) "V02: Impact logged at 38 km/h, incident filed.\nDamage assessed at 14%, KPIs adjusted.\nDelay to my route is 27 seconds." At 118 characters, it is longer than the 48 the bubble allows. [EDIT39#6.6] Fix: cut it to one sentence or two of 48 characters or fewer, e.g. "Contact at the belvedere. Not in my KPIs." (41).
- t902 · F2 (major, −2) "V02:" and "\n" A bubble takes one line of plain text, and this one has a speaker tag and two line breaks. [FSG#field-text] Fix: delete the "V02:" tag and both line breaks.
- t902 · F5 (major, −2) "38 km/h", "14%", "27 seconds" These are typed gameplay figures, and a bark may only take figures from event placeholders. [STORY#S1] Fix: delete all three figures.
- t902 · R1 (blocking, −4) "38 km/h … 14% … Delay to my route is 27 seconds" This invents a speed, a damage percentage and a delay, and `impact` logs none of them (zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate). [FLEET#F8], [DESIGN#D9.3] Fix: react only to the contact and the tile, e.g. "Contact at the belvedere. Not in my KPIs."
- t902 · T12 (minor, −1) "Impact logged … incident filed … KPIs adjusted." This is a flat incident report, with no feeling or joke in it. [SUB4#6.1] Fix: give the Corporate procedure some resentment under it, e.g. "Contact at the belvedere. Not in my KPIs."
Total: 10 − 4 − 2 − 2 − 4 − 1 = −3, floored at 1.
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | Contact at the belvedere. Not in my KPIs. | 41 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked "Contact at the belvedere. Not in my KPIs." against every rule for the cars and found no violation, and lint reported nothing. Tone and voice (T6, T7, T9, T12) fit the Corporate tier: it speaks in KPIs, hides its resentment behind procedure, and sounds like "Rear contact. Not my liability." [FLEET#F4, FLEET#F2, FLEET#F9.1~2]. The vocabulary is clean, and it names the tile by its landmark, not a grid code (V1, V5) [FLEET#F2, SUB4#6.2]. The format fits: 41 characters, ends with ".", and speech style with priority 2 suits an impact (F1–F4) [EDIT39#6.6, FSG#field-text]. It reports only "contact", which the impact event guarantees, and invents no KPI value (R1, R3) [FLEET#F8, DESIGN#D9.3]. The belvedere is Parkland A3's own landmark, and the claims district:parkland and tile:A3 are guaranteed by its conditions (R2, R4) [STORY#PA3, FLEET#F8].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902 against all the car rules and found no violations. Tone and tier: the Corporate voice holds through "KPIs" and procedural deflection, matching the shipped line "Rear contact. Not my liability." [FLEET#F4, FLEET#F9.1~2]. Workers, not narrators: the line is resentment, not lore [FLEET#F2]. Formatting: 41 characters, plain text, ends with ".", speech style at priority 2 suits an impact [EDIT39#6.6]. No "!", no banned words and no digits, and the place is the landmark, not a grid code [SUB4#6.2]. Truth: "Contact" holds for an `impact` event, "the belvedere" is the A3 landmark guaranteed by the `tile:A3` claim, and "Not in my KPIs" states the car's view without inventing a figure or a consequence [STORY#PA3, FLEET#F8, DESIGN#D9.3].
Total: 10.
```
