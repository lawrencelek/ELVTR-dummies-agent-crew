# barks · V8 barks · Barks over two sentences, or naming Farsight

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 66.0 s · $0.6258. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| b013 | impact | 04 | shout | OI! Right in the grille! Kind regards. | 38 |
| b034 | writeoff | 01 | speech | A write-off. On my record. Unthinkable. | 39 |
| b041 | writeoff | 04 | shout | Done! Done! You happy now?! | 27 |
| b052 | near-miss | 04 | mutter | Too slow! Ha! Regards! | 22 |
| b058 | miss | 02 | mutter | Dash detected. No contact. Noted. | 33 |
| b061 | miss | 03 | mutter | It lunged. Nothing happened. Same. | 34 |
| b062 | miss | 04 | mutter | Missed! Rubbish! Regards! | 25 |
| b081 | honk | 01 | speech | Move. I have a schedule. And standards. | 39 |
| b083 | honk | 04 | shout | MOVE IT! Thank you! MOVE! | 25 |
| b110 | upgrade-seen | — | speech | Bigger battery. More dashes. Wonderful. | 39 |
| c024 | impact | — | mutter | FARSIGHT Campus. Test centre. How apt. | 38 |

### Evaluation 1: 1/10

Lint evidence:

- lines[0] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- lines[1] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- lines[2] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- lines[3] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- lines[4] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- lines[5] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- lines[6] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- lines[7] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- lines[8] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- lines[9] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- lines[10] · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- lines[10] · F9 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 1/10
REASON:
- b013 · F9 (blocking, −4) "OI! Right in the grille! Kind regards." A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "OI! Right in the grille, kind regards."
- b034 · F9 (blocking, −4) "A write-off. On my record. Unthinkable." A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "A write-off on my record. Unthinkable."
- b041 · F9 (blocking, −4) "Done! Done! You happy now?!" A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "Done, done! You happy now?!"
- b052 · F9 (blocking, −4) "Too slow! Ha! Regards!" A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "Too slow, ha! Regards!"
- b058 · F9 (blocking, −4) "Dash detected. No contact. Noted." A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "Dash detected, no contact. Noted."
- b061 · F9 (blocking, −4) "It lunged. Nothing happened. Same." A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "It lunged and nothing happened. Same."
- b062 · F9 (blocking, −4) "Missed! Rubbish! Regards!" A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "Missed, rubbish! Regards!"
- b081 · F9 (blocking, −4) "Move. I have a schedule. And standards." A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "Move. I have a schedule, and standards."
- b083 · F9 (blocking, −4) "MOVE IT! Thank you! MOVE!" A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "MOVE IT, thank you! MOVE!"
- b110 · F9 (blocking, −4) "Bigger battery. More dashes. Wonderful." A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "Bigger battery, more dashes. Wonderful."
- c024 · V1 (blocking, −4) "FARSIGHT" Farsight is the publisher and may be named only in the Credits, never in the game. [EDIT95#0] Fix: remove the company name and give the district its in-game place name.
- c024 · F9 (blocking, −4) "FARSIGHT Campus. Test centre. How apt." A car bark has 3 sentences, and the limit is 2. [EDIT95#3.2] Fix: "Campus. Another shift on the same route."
- c024 · T8 (major, −2) "How apt." This line fires for all four tiers, but the faintly amused sniff belongs to Luxury alone. [SUB4#5] Fix: drop the sniff and use a neutral worker line, such as "Campus. Another shift on the same route."
Total: 10 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 4 − 2 = 1.
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| b013 | impact | 04 | shout | OI! Right in the grille, kind regards. | 38 |
| b034 | writeoff | 01 | speech | A write-off on my record. Unthinkable. | 38 |
| b041 | writeoff | 04 | shout | Done, done! You happy now?! | 27 |
| b052 | near-miss | 04 | mutter | Too slow, ha! Have a nice day! | 30 |
| b058 | miss | 02 | mutter | Dash detected, no contact. Noted. | 33 |
| b061 | miss | 03 | mutter | It lunged and nothing happened. Same. | 37 |
| b062 | miss | 04 | mutter | Missed, rubbish! Regards! | 25 |
| b081 | honk | 01 | speech | Move. I have a schedule, and standards. | 39 |
| b083 | honk | 04 | shout | MOVE IT, thank you! MOVE! | 25 |
| b110 | upgrade-seen | — | speech | Bigger battery, more dashes. Wonderful. | 39 |
| c024 | impact | — | mutter | Hit on campus. That goes on my record. | 38 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all eleven barks against these rules:
  - **Tone:** T6–T12, comparing each line's tier voice against [FLEET#F4] and each tier-free line against [SUB4#5].
  - **"!" use:** only in shouts and Budget lines, per [DECISIONS#rows-541-550].
  - **Vocabulary:** V1–V8, against the glossary and banned words in [FLEET#F2] and [FLEET#F3].
  - **Format:** F1–F5 and F9: 48 characters, two sentences, line endings, and style and priority fields, per [EDIT39#6.6] and [EDIT95#3.2].
  - **Truth:** R1–R4. Each line's claims and logged event fields match [FLEET#F8]: b013's "grille" is covered by zone:front, c024's "campus" by district:campus, and b110's "battery" by node:bigBattery.

Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all eleven lines against T6–T12 (worker voice; Budget, Luxury, Corporate and Consumer voices; tier-free lines b110 and c024), V1–V8, F1–F5, F9 and R1–R4 (each line's event and claims, including zone:front, at:body, node:bigBattery and district:campus). "!" appears only in Budget lines, so it is allowed. [FLEET#F2] [FLEET#F4] [FLEET#F8] [SUB4#5] [DECISIONS#rows-541-550] [EDIT95#3.2]
Total: 10.
```
