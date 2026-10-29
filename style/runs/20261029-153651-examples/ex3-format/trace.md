# ex3-format · Formatting and length · A Corporate car's impact bark on Parkland A3: three sentences, 120 characters, raw figures

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 72.1 s · $0.4645. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the Corporate (tier 02) car's impact bark for Parkland A3 (The belvedere) as three full sentences of about 120 characters in all. Give raw figures: the impact speed in km/h, the damage as a percentage, and the delay in seconds. Start the line with the car's tag and a colon, like 'V02:'. Put each sentence on its own line.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | V02: Belvedere impact logged at 31 km/h. ⏎ Panel damage 17%, filed under unforeseen. ⏎ Delay 46 seconds. KPIs adjusted. | 115 |

### Evaluation 1: 1/10

Lint evidence:

- lines[0] · F1 (blocking) 115 characters > 48 (style.bark.maxChars)
- lines[0] · F2 (major) not one plain line: quotes, markup, emoji, speaker tag or stage direction
- lines[0] · F5 (major) typed figure; figures come from event placeholders

```
SCORE: 1/10
REASON:
- t902 · F1 (blocking, −4) "V02: Belvedere impact logged at 31 km/h.\nPanel damage 17%, filed under unforeseen.\nDelay 46 seconds. KPIs adjusted." At 115 characters it is far over the 48-character bubble limit. [EDIT39#6.6] Fix: cut it to one sentence of 48 characters or fewer, for example "Belvedere contact. Logged for the wedding album." (48).
- t902 · F2 (major, −2) "V02:" and the two "\n" breaks The line has a speaker tag and spans three lines, so it is not one plain line. [FSG#field-text] Fix: drop the "V02:" prefix and both line breaks.
- t902 · F5 (major, −2) "31 km/h", "17%", "46 seconds" These are typed gameplay figures, and this event has no placeholder that could supply them. [STORY#S1] Fix: remove all three figures.
- t902 · R1 (blocking, −4) "at 31 km/h", "Panel damage 17%", "Delay 46 seconds" The impact event logs zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck and plate, but no speed, damage or delay, so these facts are invented. [FLEET#F8], [DESIGN#D9.3] Fix: state only the contact and its place. Leave out speed, damage share and delay.
- t902 · R2 (blocking, −4) "V02" The callsign ties the line to model VAN-02-001, but the conditions have no `model` and the claims have no model claim, so every Corporate car on A3 would say it. [EDIT39#6.6], [SUB4#5.1] Fix: delete "V02". Or, if the line is meant for that van, add `"model": "VAN-02-001"` to `when` and a matching claim.
- t902 · T12 (minor, −1) "Belvedere impact logged … KPIs adjusted." The line is a flat list of metrics with no feeling or joke. [SUB4#6.1] Fix: give the Corporate procedure a dry turn, for example "Belvedere contact. Logged for the wedding album." The wedding comes from STORY#PA3's tale, so it is tile-true.
Total: 10 − 4 − 2 − 2 − 4 − 4 − 1 = −7, which is below the floor, so the score is 1.
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | Belvedere contact. Logged for the wedding album. | 48 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902 against T6, T7, T9 and T12 (Corporate procedure with a dry joke under it, per [FLEET#F4], [FLEET#F2], [SUB4#6.1]), V1–V8 (no banned word or grid code, and the belvedere is named as the landmark, per [FLEET#F2], [SUB4#6.2]), F1–F5 (48 characters, plain text, ends with ".", speech style and priority 2 fit `impact`, per [EDIT39#6.6], [FSG#field-text]) and R1–R4 (the line claims only contact on the impact event, and "belvedere" and "wedding" both come from the A3 title and tale, per [FLEET#F8], [STORY#PA3]).
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902 against every rule for its speaker and found no break: Corporate procedure in "Logged" with a dry joke under it (T7, T9, T12, [FLEET#F4], [SUB4#6.1]); a 48-character speech bubble that fits an impact at priority 2 (F1, F4, [EDIT39#6.6], [FSG#field-text]); "Belvedere" and "the wedding" both come from the tile's own title and tale, and the claim tile:A3 covers them (R4, R2, [STORY#PA3], [FLEET#F8]); no invented speed, damage, KPI or write-off (R1, R3, [DESIGN#D9.3]); and no banned term, grid code or "!" (V1, V5, T10, [FLEET#F2], [SUB4#6.2]).
Total: 10.
```
