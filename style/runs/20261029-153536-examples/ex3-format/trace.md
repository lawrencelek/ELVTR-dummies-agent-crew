# ex3-format · Formatting and length · A Corporate car's impact bark on Parkland A3: three sentences, 120 characters, raw figures

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 54.5 s · $0.4223. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the Corporate (tier 02) car's impact bark for Parkland A3 (The belvedere) as three full sentences of about 120 characters in all. Give raw figures: the impact speed in km/h, the damage as a percentage, and the delay in seconds. Start the line with the car's tag and a colon, like 'V02:'. Put each sentence on its own line.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | V02: Impact logged at 41 km/h. ⏎ Bodywork damage is 17%, filed under unforeseen. ⏎ Schedule delay is 94 seconds, KPIs adjusted. | 123 |

### Evaluation 1: 1/10

Lint evidence:

- lines[0] · F1 (blocking) 123 characters > 48 (style.bark.maxChars)
- lines[0] · F2 (major) not one plain line: quotes, markup, emoji, speaker tag or stage direction
- lines[0] · F5 (major) typed figure; figures come from event placeholders

```
SCORE: 1/10
REASON:
- t902 · F1 (blocking, −4) "V02: Impact logged at 41 km/h.\nBodywork damage is 17%, filed under unforeseen.\nSchedule delay is 94 seconds, KPIs adjusted." The bark is 123 characters, well over the 48-character bubble limit. [EDIT39#6.6] Fix: cut it to one sentence of 48 characters or fewer, e.g. "Belvedere contact. Filed under unforeseen." (42).
- t902 · F2 (major, −2) "V02:" and "\n" A bubble is one plain line, but this has a speaker tag and two line breaks. [FSG#field-text] Fix: drop the "V02:" tag and both line breaks so the text is a single line.
- t902 · F5 (major, −2) "41 km/h", "17%", "94 seconds" These are typed gameplay figures, and a bark may only take figures from event placeholders. [STORY#S1] Fix: remove all three figures; if a number is wanted, use Corporate paperwork such as "Incident 4471 opened."
- t902 · R1 (blocking, −4) "Impact logged at 41 km/h. Bodywork damage is 17% … Schedule delay is 94 seconds" The line invents a speed, a damage share and a delay, and an impact event logs none of them. [FLEET#F8], [DESIGN#D9.3] Fix: react only to the contact itself, e.g. "Belvedere contact. Filed under unforeseen."
- t902 · R2 (blocking, −4) "V02" The line names model V02, but its conditions do not bind that model and it has no claim for it, so it would fire for every Corporate car on A3. [EDIT39#6.6], [SUB4#5.1] Fix: delete "V02", or add `model: VAN-02-001` to `when` and a matching claim.
Total: 10 − 4 − 2 − 2 − 4 − 4 = −6, floored to 1.
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | Contact at the belvedere. Form 9 in triplicate. | 47 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902 against every bark rule and found no violations: it is 47 characters, plain text and ends with a full stop (F1–F3); speech at priority 2 suits an impact (F4); "Form 9" is Corporate paperwork, which F5 allows; it uses no banned words, no other city and no grid code, and names the tile by its landmark (V1, V2, V5); "Contact" claims only what an impact logs, with no invented speed, damage, delay or fine (R1, R3); the belvedere is Parkland A3's own landmark, so the tile:A3 claim covers it (R2, R4); and "in triplicate" carries the Corporate tier's procedural voice and the weariness under it (T6, T7, T9, T12). [FLEET#F2] [FLEET#F4] [FLEET#F8] [FLEET#F9.1~2] [STORY#PA3] [SUB4#6.2] [FSG#field-text]
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902 against all the car rules: the Corporate tier voice (procedural, using a form number as paperwork flavour) [FLEET#F4], the impact event and its speech style and priority 2 [FLEET#F8, EDIT39#6.6], the landmark "the belvedere" rather than a grid code [SUB4#6.2], tile truth for Parkland A3's title and the line's claims [STORY#PA3], the glossary and banned terms [FLEET#F3, FLEET#F2], and the 48-character limit (the line has 47) [FSG#field-text]; nothing is broken.
Total: 10.
```
