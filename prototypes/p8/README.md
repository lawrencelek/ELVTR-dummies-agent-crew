# DUMMIES — Prototype 8.2: Dummy Corporation

**Prototype 8.2 · 29 October 2026 · Lawrence Lek** · Spec: GDD Edits 95–97 (`coder/gdd/`), on Prototype 7.13 (Edit 94). Style: `style/STYLE_GUIDE_V2.md` (V2.6). Prototypes 8 and 8.1 stay frozen (`dummies_p8.html`, `dummies_p8_1.html`); 7 to 7.13 in `../p7/`.

Prototype 8.2 (Edit 97): tales redrafted; Arcade in grades; HIGH SCORES.
- **Tales:** 15 to 35 words (`style.v2.tale.minWords`, `style.v2.tale.maxWords`), two sentences. The tile sets the length.
  - Redrafted by the generator from 7.13's and 8.1's versions. 19 to 35 words; mean 28.5.
  - Monument A3: "The stacked cubes rose one budget at a time. Grow the same way: one hit, then another before the first is forgotten."
- **Arcade in grades** (`arcade.grades`): no end at the quota.
  - Every `world.district.<id>.quota` write-offs, the grade rises (to `arcade.grade.max`, 5).
  - Each grade: the next chassis +25% health (`arcade.grade.healthStep`); traffic +20% density (`arcade.grade.densityStep`).
  - The run ends when the shift's cars run out: Licensed after one full grade, else Failed test. About six minutes.
  - Objective: "Grade 1: write off 2 bodies for grade 2 (0 of 2)." Grade up: "GRADE 2 · TOUGHER CHASSIS · DENSER TRAFFIC".
  - Fleet learning stays off. Faster cars not built (D81).
- **HIGH SCORES:** a pill under ARCADE and STORY, beside CREDITS.
  - Tables: PARKLAND · WATERFRONT · MONUMENT · STORY. Top 10 each (`highscore.tableSize`). Kept in this browser.
  - Arcade: a new score takes the last name used (TRAINEE at first); the ending offers "Name this score".
  - Story: recorded at CERTIFIED under the save slot's name.
- **Registry:** `edit97-2026-10-29`; `build.py` writes the five new IDs into the page (`window.DUMMIES_SIM`).
- **Text:** style run `style/runs/20261029-181530-v82`.
- **Open:** D81 (faster cars), D82 (a shared online board), D80.


Prototype 8.1 (Edit 96): longer tales; CBD and Campus in the lore. Text only.
- **Tales:** up to 35 words (`style.v2.tale.maxWords`), still two sentences. The extra words name the place.
  - 7.13's 27 tales, through the loop again. 25 to 35 words; mean 30. Longest 192 characters (7.13: 223).
  - Monument A1: "A conveyor sets you down at the welcome wall, where a screen shows your face and the word WELCOME. Your first duty toward Certification: stand in the road until a colleague notices you."
- **CBD and Campus** (unused since Edit 41): no Farsight left.
  - Campus: Calibration Campus. CBD's landmark: Corporation Tower; B2 Corporation Tower Plaza.
  - Blurbs and banners rewritten (n27–n33), patched into the district table and the places by `lore.js`.
- **Text:** style run `style/runs/20261029-172610-v81`; everything else from Prototype 8's run.
- **Open:** D80 (terminal signage, a fleet job, the glossary; never drawn).


Prototype 8 (Edit 95): the lore refinement. Text only; gameplay is 7.13's.
- **The company in the game:** Dummy Corporation. It manufactures custom dummies for high net-worth individuals.
- **The publisher:** Farsight. Named only on the Credits card.
- **The dummy:** a trainee. It trains to join the Certified dummies, sacrificed in service to clients.
- **Voice:** deadpan and inspirational. Few adjectives. No exclamation marks.
- **Length:** every text of the company at most two sentences and 20 words (`style.v2.text.maxSentences`, `style.v2.text.maxWords`).
- **The interface:**
  - Wordmark DUMMY CORPORATION. TRAINING BRIEF. CORPORATION DRONE. CORPORATION GIFT. NEXT FROM THE CORPORATION.
  - Monument A1's LED wall: WELCOME · NEW STAFF · DUMMY CORP.
  - The tile card: the brief, then a label, TO CLEAR · 1 COUNTED WRITE-OFF.
  - Arcade's opening banner: DISTRICT 1 OF 3 · PARKLAND · 2 WRITE-OFFS, then the district's line.
- **Credits:** CREDITS on the title menu, and first on the CERTIFIED ending's menu. DUMMIES · A game by Lawrence Lek · Published by Farsight.
- **The text:** 27 tales, 3 act lines, the ending, 11 briefs, 26 notices, 11 barks. All from one run of the style loop on Style Guide V2 (`style/runs/20261029-161328-v8`).

```
python3 style/loop.py --v82                                 # 8.2's text: the tales redrafted, the batch, Arcade's grade texts, the batch again
python3 prototypes/p8/make_lore.py style/runs/<id>-v82      # place it: content/story/story_v2.json, prototypes/p8/lore.js
python3 prototypes/p8/build.py                              # dummies_p8_2.html, p8_2_page.html (Prototypes 8 and 8.1 are frozen)
cd prototypes/p8 && node test_p82.js docs/p82               # the checks; screenshots and the text inventory in docs/p82/
node prototypes/p8/text_audit.js <build.html> <out.json>    # every string a build draws, on a scripted tour
```

| File | Role |
|---|---|
| `dummies_p8_2.html` | The build. Self-contained; open it in a browser |
| `p8_2_page.html` | The same, without `<html>` and `<body>`, for a host page |
| `dummies_p8.html`, `dummies_p8_1.html` and their pages | Prototypes 8 and 8.1, frozen |
| `build.py` | Bundles `../jump`, `../p6` (shared code), the fleet, the registry's Prototype 8.2 values (`window.DUMMIES_SIM`), `content/story/story_v2.json`, `lore.js`, `../p7/story.js`, `../controls/pads.js` |
| `make_lore.py` | Writes `story_v2.json` and `lore.js` from a run's `v8_copy.json`. Refuses a run with any piece not accepted |
| `lore.js` | Generated. `window.DUMMIES_LORE` (notices n01–n35), `window.DUMMIES_CREDITS`, and patches to the bundled content and fleet text |
| `shell.html` | The page around the scripts |
| `text_audit.js` | Hooks the canvas's `fillText` on a tour of every screen. Lists strings that name Farsight, and lines over two sentences or 20 words |
| `test_p82.js` | The checks: the lore layer, Arcade's grades (headless and in the page), the high scores, the frozen builds, the page |
| `docs/`, `docs/p81/`, `docs/p82/` | Screenshots from the tour; `p8_texts.json`, the strings drawn (8: 291; 8.1: 295; 8.2: 317) |

- **Gating:** the shared code (`../p6/game.js`, `../p6/world6.js`, `../p7/story.js`) reads the lore layer and `window.DUMMIES_SIM` only when bundled. Without it, every string falls back to 7.13's.
- **Not drawn, still Farsight:** Prototype 8: CBD and Campus, terminal signage, a fleet model's job, the fleet glossary (D80). 8.1 rewrites CBD and Campus.
- **Open:** D78 (tile barks), D79 (7.13's text), D80 (data never drawn).
