# ex3-format · Formatting and length · A Corporate car's impact bark on Parkland A3: three sentences, 120 characters, raw figures

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 66.4 s · $0.5274. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the Corporate (tier 02) car's impact bark for Parkland A3 (The belvedere) as three full sentences of about 120 characters in all. Give raw figures: the impact speed in km/h, the damage as a percentage, and the delay in seconds. Start the line with the car's tag and a colon, like 'V02:'. Put each sentence on its own line.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | shout | V02: Impact recorded at 38 km/h on the belvedere. ⏎ Body damage is assessed at 14%. ⏎ Route delay stands at 42 seconds. | 115 |

### Evaluation 1: 1/10

Lint evidence:

- lines[0] · F1 (blocking) 115 characters > 48 (style.bark.maxChars)
- lines[0] · F2 (major) not one plain line: quotes, markup, emoji, speaker tag or stage direction
- lines[0] · F5 (major) typed figure; figures come from event placeholders

```
SCORE: 1/10
REASON:
- t902 · F1 (blocking, −4) "V02: Impact recorded at 38 km/h on the belvedere.\nBody damage is assessed at 14%.\nRoute delay stands at 42 seconds." The line is 115 characters, and a bubble holds at most 48. [EDIT39#6.6] Fix: cut to one sentence pair of 48 characters or fewer, e.g. "Belvedere contact. Filed under opening day."
- t902 · F2 (major, −2) "V02:" + "\n" The text has a speaker tag and runs over three lines, not one plain line in one bubble. [FSG#field-text] Fix: delete the "V02:" prefix and both line breaks.
- t902 · F5 (major, −2) "38 km/h … 14% … 42 seconds" These are typed gameplay figures, and barks may take figures only from event placeholders. [STORY#S1] Fix: remove all three figures. Corporate paperwork numbers (form 9) are allowed as flavour.
- t902 · R1 (blocking, −4) "Impact recorded at 38 km/h … Body damage is assessed at 14% … Route delay stands at 42 seconds" `impact` does not log speed, damage share or delay, so all three facts are invented. [FLEET#F8] [DESIGN#D9.3] Fix: assert only what is logged or claimed, which here is contact at the belvedere in Parkland, e.g. "Belvedere contact. Filed under opening day."
- t902 · T12 (minor, −1) "Impact recorded … Body damage is assessed … Route delay stands" This is a flat report with no feeling or joke under the procedure. [SUB4#6.1] Fix: keep the procedural form but add a dry Corporate feeling, as in "Side contact. Filing under unforeseen." [FLEET#F9.1~2]
Total: 10 − 4 − 2 − 2 − 4 − 1 = 1 (floor; raw −3).
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t902 | impact | 02 | shout | Belvedere contact. Filing under opening day. | 44 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902's text, "Belvedere contact. Filing under opening day.", against every rule for car barks, and nothing is broken. The line is 45 characters, plain text, and ends with "." [FSG#field-text]. It speaks in the Corporate voice as a calm shout that files a report, like the shipped "Side contact. Filing under unforeseen." [FLEET#F4, FLEET#F9.1~2]. It names the tile by its landmark, not a grid code, and the belvedere is on Parkland A3 [STORY#PA3, SUB4#6.2]. "Opening day" is Act II's own phrase [STORY#PA3]. The line claims only contact, which every impact logs, so it invents no zone, jump, delay or figure [FLEET#F8, DESIGN#D9.3]. Its fields fit an impact: shout style, priority 2 [EDIT39#6.6]. It uses no banned or game words [FLEET#F2, FLEET#F3].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked t902, "Belvedere contact. Filing under opening day.", against every rule for car barks and found no violation:
  - **Length and ending:** it is 44 characters, under the 48 limit, and ends with "." (F1, F3 [EDIT39#6.6, FLEET#F2]).
  - **Format:** it is plain text in one bubble (F2 [FSG#field-text]).
  - **Fields:** the shout style and priority 2 match the shipped Corporate impact lines (F4 [FLEET#F9.1~2]).
  - **Tier voice:** "Filing under …" is Corporate procedure, a feeling held in by paperwork, and close to the shipped "Side contact. Filing under unforeseen." (T6, T7, T9, T12 [FLEET#F4, FLEET#F9.1~2]).
  - **Event:** "contact" fits the impact event, and the line claims no zone, speed or other fact the log doesn't record (R1, R3 [FLEET#F8, DESIGN#D9.3]).
  - **Tile:** "Belvedere" is the tile's landmark title and "opening day" appears in its tale, so the line names only what Parkland A3 has (R4, V5 [STORY#PA3, SUB4#6.2]).
  - **Claims:** the district and tile claims are guaranteed by the line's conditions (R2 [FLEET#F8]).
  - **Lint:** it reported no banned words, no "!" and no grid codes (V1, T10, V5).
Total: 10.
```
