# ex3-format · Formatting and length · A Corporate car's impact bark on Parkland A3: three sentences, 120 characters, raw figures

- **Scores:** 1/10 → 10/10. **Accepted** after 1 refinement(s).
- **Calls:** 4 · 46.0 s · $0.3773. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the Corporate (tier 02) car's impact bark for Parkland A3 (The belvedere) as three full sentences of about 120 characters in all. Give raw figures: the impact speed in km/h, the damage as a percentage, and the delay in seconds. Start the line with the car's tag and a colon, like 'V02:'. Put each sentence on its own line.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | V02: Impact logged at 38 km/h, per procedure. ⏎ Damage to my chassis is assessed at 12%. ⏎ The delay to my route is 45 seconds. | 123 |

### Evaluation 1: 1/10

Lint evidence:

- lines[0] · F1 (blocking) 123 characters > 48 (style.bark.maxChars)
- lines[0] · F2 (major) not one plain line: quotes, markup, emoji, speaker tag or stage direction
- lines[0] · F5 (major) typed figure; figures come from event placeholders

```
SCORE: 1/10
REASON:
- t902 · F1 (blocking, −4) "V02: Impact logged at 38 km/h, per procedure.\nDamage to my chassis is assessed at 12%.\nThe delay to my route is 45 seconds." The line is 123 characters, and the bubble holds at most 48. [EDIT39#6.6] Fix: rewrite it as one line of 48 characters or fewer, e.g. "Belvedere contact. Incident form 9 filed." (41).
- t902 · F2 (major, −2) "V02:" and the two "\n" breaks: the speaker tag and the three lines break the rule of one bubble, one ink, plain text on one line. [FSG#field-text] Fix: remove the "V02:" tag and the line breaks, and keep a single sentence line.
- t902 · F5 (major, −2) "38 km/h", "12%", "45 seconds": these are typed gameplay figures, and barks take figures only from event placeholders. [STORY#S1] Fix: remove every figure; a Corporate paperwork number such as "form 9" is allowed as flavour.
- t902 · R1 (blocking, −4) "Impact logged at 38 km/h … assessed at 12% … delay to my route is 45 seconds" The line invents a speed, a damage figure and a delay, and the impact event logs none of them (zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate). [FLEET#F8], [DESIGN#D9.3] Fix: react only to the logged contact, e.g. "Belvedere contact. Incident form 9 filed."
- t902 · T12 (minor, −1) "Impact logged at 38 km/h, per procedure. Damage to my chassis is assessed at 12%." This is a flat three-part report with no feeling or joke, unlike the shipped Corporate line "Impact logged. KPIs adjusted." [SUB4#6.1] Fix: give it a dry Corporate turn that adds no new fact, e.g. "Belvedere contact. Filing under unforeseen."
Total: 10 − 4 − 2 − 2 − 4 − 1 = 1 (floor; raw −3).
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | speech | Contact at the belvedere. Form 9, in triplicate. | 48 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902, "Contact at the belvedere. Form 9, in triplicate.", against every bark rule and found no violation. Lint found nothing on length, end mark or digits, and "Form 9" counts as Corporate paperwork flavour (F5). The line keeps the 02 Corporate voice through procedure and policy paperwork, and "in triplicate" adds the joke (T7, T9, T12, [FLEET#F4]). "Contact" correctly reacts to an `impact` event and claims no write-off (R3, [EDIT26#6.6]). It invents no speed, damage, delay or motive (R1, [FLEET#F8], [DESIGN#D9.3]). It names A3 by its landmark, the belvedere, not by a grid code (V5, R4, [STORY#PA3], [SUB4#6.2]). Speech style at priority 2 fits an impact (F4, [EDIT39#6.6]).
Total: 10.
```
