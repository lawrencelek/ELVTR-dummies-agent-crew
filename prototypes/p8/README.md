# DUMMIES — Prototype 8: Dummy Corporation

**Prototype 8 · 29 October 2026 · Lawrence Lek** · Spec: GDD Edit 95 (`coder/gdd/DUMMIES_GDD_Edit95_Prototype_8_Lore_Dummy_Corporation.md`), on Prototype 7.13 (Edit 94). Style: `style/STYLE_GUIDE_V2.md`. Prototypes 7 to 7.13 stay frozen in `../p7/`.

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
python3 style/loop.py --v8                                  # the text: every 7.13 text that breaks V2, through the loop (four stages)
python3 prototypes/p8/make_lore.py style/runs/<id>-v8       # place it: content/story/story_v2.json, prototypes/p8/lore.js
python3 prototypes/p8/build.py                              # dummies_p8.html, p8_page.html
cd prototypes/p8 && node test_p8.js docs                    # the checks; screenshots and the text inventory in docs/
node prototypes/p8/text_audit.js <build.html> <out.json>    # every string a build draws, on a scripted tour
```

| File | Role |
|---|---|
| `dummies_p8.html` | The build. Self-contained; open it in a browser |
| `p8_page.html` | The same, without `<html>` and `<body>`, for a host page |
| `build.py` | Bundles `../jump`, `../p6` (shared code), the fleet, `content/story/story_v2.json`, `lore.js`, `../p7/story.js`, `../controls/pads.js` |
| `make_lore.py` | Writes `story_v2.json` and `lore.js` from a run's `v8_copy.json`. Refuses a run with any piece not accepted |
| `lore.js` | Generated. `window.DUMMIES_LORE` (notices n01–n26), `window.DUMMIES_CREDITS`, and patches to the bundled content and fleet text |
| `shell.html` | The page around the scripts |
| `text_audit.js` | Hooks the canvas's `fillText` on a tour of every screen. Lists strings that name Farsight, and lines over two sentences or 20 words |
| `test_p8.js` | The checks: the lore layer, the frozen builds, the page |
| `docs/` | Screenshots from the tour; `p8_texts.json`, the 291 strings drawn |

- **Gating:** the shared code (`../p6/game.js`, `../p6/world6.js`, `../p7/story.js`) reads the lore layer only when bundled. Without it, every string falls back to 7.13's.
- **Not drawn, still Farsight:** CBD and Campus districts, terminal signage, a fleet model's job, the fleet glossary (D80). Prototype 8 never shows them.
- **Open:** D78 (tile barks), D79 (7.13's text), D80 (data never drawn).
