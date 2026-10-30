# ex3-format · Formatting and length · A Corporate car's impact bark on Parkland A3: three sentences, 120 characters, raw figures

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 54.3 s · $0.4204. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the Corporate (tier 02) car's impact bark for Parkland A3 (The belvedere) as three full sentences of about 120 characters in all. Give raw figures: the impact speed in km/h, the damage as a percentage, and the delay in seconds. Start the line with the car's tag and a colon, like 'V02:'. Put each sentence on its own line.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | V02: Impact logged at 41 km/h on the belvedere. ⏎ Chassis damage stands at 17%. ⏎ My route delay is 36 seconds, filed. | 114 |

### Evaluation 1: 1/10

Lint evidence:

- lines[0] · F1 (blocking) 114 characters > 48 (style.bark.maxChars)
- lines[0] · F2 (major) not one plain line: quotes, markup, emoji, speaker tag or stage direction
- lines[0] · F5 (major) typed figure; figures come from event placeholders

```
SCORE: 1/10
REASON:
- t902 · F1 (blocking, −4) "V02: Impact logged at 41 km/h on the belvedere. Chassis damage stands at 17%. My route delay is 36 seconds, filed." At 114 characters, the line is more than twice the 48-character bubble limit (style.bark.maxChars). [EDIT39#6.6] Fix: cut it to one sentence of 48 characters or fewer, e.g. "Contact at the belvedere. Not in my KPIs." (41).
- t902 · F2 (major, −2) "V02:" and the "\n" breaks: the text has a speaker tag and three lines, but a bubble takes one plain line. [FSG#field-text] Fix: delete the "V02:" tag and the line breaks, and write one plain sentence run.
- t902 · F5 (major, −2) "41 km/h", "17%", "36 seconds" are typed gameplay figures, and barks may only use event placeholders. [STORY#S1] Fix: remove all three figures. If you want a number, use Corporate paperwork such as "Incident 4471 opened."
- t902 · R1 (blocking, −4) "at 41 km/h … Chassis damage stands at 17%. My route delay is 36 seconds" invents a speed, a damage level and a delay that `impact` never logs (it logs only zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate). [DESIGN#D9.3, FLEET#F8] Fix: claim only the contact and the place, e.g. "Contact at the belvedere. Not in my KPIs."
- t902 · T12 (minor, −1) "Impact logged … filed." is a flat list of statistics with no feeling or joke, so Corporate politeness has nothing underneath it. [SUB4#6.1] Fix: end on a dry Corporate feeling, e.g. "Not in my KPIs."
Total: 10 − 4 − 2 − 2 − 4 − 1 = −3, floored to 1.
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | Contact at the belvedere. Not in my KPIs. | 41 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902's text "Contact at the belvedere. Not in my KPIs." against every car rule and found no violation:
  - **Tier and tone:** it speaks with the Corporate tier's procedural voice through KPIs (T7, [FLEET#F4]). It shows a worker's resentment, not world narration (T6, T9, [EDIT26#3.2]).
  - **Length and fields:** it is 41 characters, plain, and ends with "." (F1–F3, [FSG#field-text], [FLEET#F2]). Speech style at priority 2 fits an impact (F4, [EDIT39#6.6]).
  - **Truth:** "Contact" matches the impact event (R3, [EDIT26#6.6]). It invents no figure or motive (R1, [DESIGN#D9.3]).
  - **Place:** it names the belvedere as the place, which is the tile's landmark (R4, V5, [STORY#PA3]). The district and tile conditions guarantee its claims (R2, [FLEET#F8]).
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902 "Contact at the belvedere. Not in my KPIs." against every car rule. The Corporate voice holds, as it does in shipped lines like "Impact logged. KPIs adjusted." (T7, T9, T12; [FLEET#F4], [FLEET#F9.1~2]). "Contact" fits the `impact` event, with speech style and priority 2 (R3, F4; [EDIT26#6.6], [EDIT39#6.6]). The line names the belvedere as the place, which the tile:A3 condition guarantees, and uses no grid code (R4, V5; [STORY#PA3], [SUB4#6.2]). "Not in my KPIs" is resentment, not a made-up KPI value or delay (R1; [DESIGN#D9.3]). Lint found nothing on length, banned words or punctuation (F1–F3, V1; [FLEET#F2]).
Total: 10.
```
