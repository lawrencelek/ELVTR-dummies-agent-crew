<!-- Snapshot: style/STYLE_GUIDE.md as the runs 20261029-135017-examples, 20261029-135021-calibration, 20261029-135110-d78-monument (stage 1) and 20261029-135237-audit read it (guide v1). v2 rewrote F7 and widened T11. -->
# DUMMIES — Style Guide

**29 October 2026 · Lawrence Lek** · Assignment 6, Style Guide Agent. Every rule comes from the GDD, the game's data or a ruling in the decision log. Nothing here is new canon.

- **Game:** DUMMIES. A crash-test dummy in SHENZHEN SMART CITY, run by Farsight. The self-driving cars are its workers. They train not to hit you. You try to get written off.
- **Story (Narrative A, Certified):** Act I Monument, INDUCTION · Act II Parkland, OPENING DAY · Act III Waterfront, CUSTOMS. 27 tiles. Ending: CERTIFIED.
- **Precedence:** newest wins. EDIT94 > EDIT93 > EDIT92 > STORY > FLEET > EDIT39 > DESIGN (V29) > EDIT26. A user-decided DECISIONS row beats any doc.
- **Sources** are chunk IDs from `style/kb/manifest.json` (built by `style/style_kb.py`). The evaluator cites them.
- **Statistics** are IDs in `style/style.params.json` (decision 543).

## 0 What it governs

| Speaker | Content | Slot | Consumer |
|---|---|---|---|
| The cars | Barks: one bubble per event | `content/db/fleet.json` `barks[]` | `game.js` `barkLine()` |
| Farsight | Tales: the tile card | `content/story/story.json` `districts[].tiles.<tile>.tale` | `story.js` tile card |
| Farsight | Briefs: label and duty | `story.json` `tasks` | tile card, objective strip |
| Farsight | Act lines | `story.json` `districts[].intro` | each district's first card |
| Farsight | The ending | `story.json` `ending` | CERTIFIED screen |

- **Out of scope:** menu chrome (NEW GAME, LEVEL UP), HUD labels, toasts, part help text. They are interface, not voice (decision 540).

## 1 Scoring

- **Start at 10.** Each violated rule deducts its severity, once per rule per line.
- **Severity:** blocking −4 (`style.score.deduct.blocking`) · major −2 (`style.score.deduct.major`) · minor −1 (`style.score.deduct.minor`).
- **Floor:** 1 (`style.score.floor`). **10/10** means no rule is broken.
- **Lint** (`style/lint.py`) measures what is computable: length, banned terms, "!", casing, digits, grid codes, landmarks. Its findings are facts. The evaluator deducts each one unless this guide exempts it.
- **Judgement** covers the rest: tone, tier temperament, story frame, truth.
- **Output, strictly:**

```
SCORE: <X>/10
REASON:
- <line id> · <rule id> (<severity>, −<n>) "<quoted text>" <why, one sentence>. [<chunk id>] Fix: <replacement or instruction>.
Total: 10 − <n> − <n> = <X>.
```

- A clean piece: `- None.` then one sentence naming what was checked, with chunk IDs. `Total: 10.`

## 2 Tone

| ID | Speaker | Rule | Source | Test | Severity |
|---|---|---|---|---|---|
| T1 | Farsight | Dry corporate comedy. Polite, procedural, dry. The procedure is the joke. | `EDIT92#3`, `STORY#S1` | Judge: does it read as a staff notice about a crash test? Hype, cheer, sympathy, menace or slang fail | major |
| T2 | Farsight | No exclamation marks. | `EDIT92#3`, `EDIT93#3.1/tales-rewritten~2` | Lint `bang` | major |
| T3 | Farsight | Employment framing. Cars are colleagues. Briefs are duties. Parts are equipment. The dummy is staff, and the product under test. | `EDIT92#3`, `STORY#S2` | Judge: cars as enemies or targets; a duty as a challenge, mission or quest; equipment as a power-up or reward fail | major |
| T4 | Farsight | The brand never comments on the harm. Write-offs are routine, recorded, paid. Understatement carries the comedy. | `EDIT39#4.1.1`, `DESIGN#D9.1` | Judge: gore, pity, triumph, or a wink at an audience fail | major |
| T5 | Farsight | Address the dummy as "you". Name Farsight in the third person ("Farsight will time you"). | `STORY#MA1`, `STORY#MB1` | Judge | minor |
| T6 | Cars | Workers, not lore narrators: deadlines, rank, record, fear of retraining, resentment, pride. | `EDIT26#3.2`, `DESIGN#D9.3`, `FLEET#F2` | Judge: a line that explains the world or narrates the plot fails | major |
| T7 | Cars | Tier voice holds. 01 Luxury: polished, superior, faintly amused, never apologises. 02 Corporate: procedural; logs, KPIs, policy numbers. 03 Consumer: tired, resigned, expects the worst. 04 Budget: short-fused; politeness bolted on over the rage. | `FLEET#F4` | Judge against `when.tier`: a Luxury car apologising, a Corporate car ranting, a calm Budget car fail | major |
| T8 | Cars | A tier-free line fires for all four tiers. It carries no single tier's signature. | `SUB4#5`, `FLEET#F4` | Judge: no `when.tier`, yet ticket-closing, sniffing or rage | major |
| T9 | Cars | Politeness barely contains the personality: a polite form, and the feeling under it. | `EDIT26#3.2`, `FLEET#F2` | Judge: rage with no polite form, or politeness with no feeling | minor |
| T10 | Cars | "!" only in a shout-style bark or a Budget (04) bark. | `DECISIONS#rows-541-550` (row 541); `FLEET#F9.1~2` | Lint `bang` | major |
| T11 | Cars | At most two lines in a batch end on a stock word: Noted, Logged, Recorded, Filed (`style.bark.maxStockEndings`). | `SUB4#6.1` | Lint `stock` | minor |
| T12 | Cars | Truth must not drain the joke. A line is a feeling or a joke, not a flat report. | `SUB4#6.1` | Judge: "Riverside. Low-rise streets. Hit logged." fails | minor |

## 3 Vocabulary and lore

| ID | Speaker | Rule | Source | Test | Severity |
|---|---|---|---|---|---|
| V1 | Both | Banned in diegetic text: kill, killed, die, died, dead, death, player, level, game, score, respawn, lives, Chongqing, Tesla, Toyota, BYD. Plurals and -ed forms count. | `FLEET#F2`; `DECISIONS#rows-531-540~2` (row 540) | Lint `banned` | blocking |
| V2 | Both | One city: Shenzhen Smart City. No other real city. No real car brand. | `FLEET#F1`, `EDIT39#3.1` | Lint `city`, `brand`; judge for others | blocking |
| V3 | Both | The fleet glossary. Subject: the dummy, to the fleet. Write-off: a destroyed body. Chassis: one body. Certification: the fleet passing. Retraining: a car's fear. Dispatch: management. Route: a car's path. Bay: where a chassis is issued. Never the game words they replace (life, death, respawn, boss, level). | `FLEET#F3` | Judge | major |
| V4 | Both | Write "Farsight" in every sentence-case string. A label set wholly in capitals keeps its caps (FARSIGHT DRONE). | `DECISIONS#rows-531-540~2` (row 539); `EDIT92#3`, `EDIT94#3.2` | Lint `farsight` | minor |
| V5 | Cars | Cars name places, never grid codes. A tile is its landmark (the plaque, the drum) or its district (Monument, Parkland, Waterfront). | `EDIT94#who-built-what-assignment-5`; decision 537; `SUB4#6.2` | Lint `gridcode`: "B2. I did not sign up for this." fails | major |
| V6 | Farsight | The story frame holds. Act I Monument, INDUCTION: new staff, colleagues. Act II Parkland, OPENING DAY: the Expo, the board, visitors. Act III Waterfront, CUSTOMS: the river border, papers, the ship. Fixed phrases stay exact: ZERO ACCIDENTS, ROLE: DESTRUCTIVE TESTING, CERTIFIED. | `EDIT92#3`, `STORY#S2` | Judge: the wrong act's frame, or a fixed phrase altered | major |
| V7 | Cars | The roster: classes, jobs and callsigns from `fleet.json`. A callsign or job detail pins the line to that model. | `FLEET#F5`, `FLEET#F7~1`, `EDIT39#6.6` | Judge; `check_lore.py` mentions | major |
| V8 | Both | The dummy is a crash-test body. Never a person, hero, contestant or champion. The fleet says "the subject" or "it"; Farsight says "you", "staff", "the model". | `FLEET#F3`, `EDIT92#3`, `DESIGN#D9.1` | Judge | major |

## 4 Formatting and length

| ID | Speaker | Rule | Source | Test | Severity |
|---|---|---|---|---|---|
| F1 | Cars | At most 48 characters (`style.bark.maxChars`): three lines of the field face. | `EDIT39#6.6`, `FSG#field-text` | Lint `length` | blocking |
| F2 | Cars | One bubble, one ink. Plain text on one line. No markdown, quotation marks, emoji, speaker tag or stage direction. | `FSG#field-text` | Lint `plain` | major |
| F3 | Cars | Ends with ".", "!" or "?". | `FLEET#F2` | Lint `end` | major |
| F4 | Cars | Fields fit the event. Style: speech, shout, mutter or thought, as delivered. Priority: write-off 3, hit 2, chatter 1. | `EDIT39#6.6`, `EDIT26#6.6` | Lint `fields`; judge the style | major |
| F5 | Both | No typed gameplay figures. Numbers live in the registry: IDs, never values. Barks take figures only from event placeholders (`{writeOffs}`). Corporate paperwork numbers (policy 6.3, form 9, incident 4471) are flavour, not statistics. Narration keeps digits to tile codes, part ranks (Legs 2), Z levels and Chassis 0. | `STORY#S1`, `FSG#canon-rules`, `DESIGN#D9.3` | Lint `digits` | major |
| F6 | Farsight | A tale fits the card: at most 223 characters (`style.tale.maxChars`), one paragraph, sentences of at most 19 words (`style.tale.maxSentenceWords`). | `EDIT92#measured`, `EDIT93#3.1/tales-rewritten~2` | Lint `length`, `sentence` | blocking (characters); major (sentences) |
| F7 | Farsight | A tale's shape: the place, a dry fact about it, the equipment if issued here ("Legs 1 is fitted."), the duty in the imperative. | `STORY#MB3`, `STORY#PA3`, `EDIT93#3.1` | Judge | minor |
| F8 | Farsight | A brief: a caps label of at most 19 characters (`style.brief.labelMaxChars`), then "Coverage gap: <behaviour>. The final hit must <condition>." | `STORY#S3` | Lint `brief` | major |
| F9 | Farsight | An act line: at most three sentences (`style.act.maxSentences`). | `STORY#S2` | Lint `sentences` | major |

## 5 Truth

| ID | Speaker | Rule | Source | Test | Severity |
|---|---|---|---|---|---|
| R1 | Cars | React to logged events only. Invent no speed, damage, delay, fine, KPI or motive. | `DESIGN#D9.3`, `EDIT39#6.6`, `FLEET#F2`, `SUB4#5` | Judge against the event's fields (`FLEET#F8`) | blocking |
| R2 | Cars | Every fact a line asserts has a claim its conditions guarantee. | `EDIT39#6.6`, `FLEET#F8` | Judge; `check_lore.py` | blocking |
| R3 | Cars | Event-correct. A write-off line fires only on `writeoff`. A hit line never says "written off". A miss never claims contact. | `EDIT26#6.6`, `DESIGN#D9.3` | Judge | blocking |
| R4 | Both | Tile truth. A line bound to a tile names only what that tile has: its title, its tale, its district. | `STORY#MA1` … `STORY#WB2` (one chunk per tile); `SUB4#5` (the lantern on B2 only) | Lint `landmark`; judge | blocking |
| R5 | Farsight | A tale's duty matches its brief. It names equipment only on the tile that issues it, or later (introduce, then test). | `STORY#S1`, `EDIT93#3.1` | Judge against the tile's brief and equipment | blocking |

- **Guidance, not scored:** a neutral fallback beats a vivid false claim (`DESIGN#D9.3`). When a fix is unsure, say less.

## 6 Calibration

- **Shipped, clean:** a shipped line or tale with no lint finding scores at least 9 (`style.calibration.shippedMin`).
- **Shipped, flagged:** a shipped string with a lint finding loses that rule's deduction, and REASON names the rule.
- **Seeded:** a shipped string with one planted violation scores at most 10 minus that rule's deduction, and REASON names the rule.
- Run: `python3 style/loop.py --calibrate`. Results: `style/runs/<id>/calibration/`.
- **Shipped text the lint flags** (D79): bark b111 "?!" (T10); bark c024 "FARSIGHT" (V4); Parkland A1's tale "level" (V1).

## 7 Rulings (Lawrence, 29 October 2026)

| Conflict | Ruling | Row |
|---|---|---|
| FARSIGHT or Farsight | "Farsight" everywhere. Supersedes the fleet canon's capitals. `check_lore.py` and bark c024 still say FARSIGHT (D79) | 539 |
| Banned words in menus | The ban covers diegetic text only. Menu chrome is exempt | 540 |
| "!" by speaker | Farsight never. Cars: shout-style barks, or any Budget bark | 541 |
| Accepted lines | Stay in `style/runs/`. D78 stays open, with the lines as its proposal | 542 |

## 8 In voice, out of voice

| Speaker | In voice (shipped) | Out of voice (precedent) | Rule |
|---|---|---|---|
| Farsight | "The plaque reads ZERO ACCIDENTS. New staff ask whether this is a record. It is a target." (`STORY#MB2`) | "Welcome to the show, contestant! Let's crash some cars!" | T1, T2, T3, V8 |
| Farsight | "Arms 1 is fitted; Farsight calls it safety equipment." (`STORY#PC1`) | "You unlocked a new power-up!" | T3, T2 |
| 01 Luxury | "Bumper damage on a Luxury trim. Typical." (`FLEET#F9.1~2`) | "So sorry, my fault entirely." | T7 |
| 02 Corporate | "Front contact. Incident 4471 opened." | "ARGH! Get off my bonnet!" | T7, T10 |
| 03 Consumer | "Hit from behind. Story of my life." | "Splendid! What a thrill!" | T7, T10 |
| 04 Budget | "OI! Right in the grille! Kind regards." | "Contact registered. Have a pleasant day." | T7, T9 |
| Tier-free | "Write-off confirmed." | "Written off on the highway. Closing ticket." (`SUB4#5`) | T8 |
| Tile bark | — (D78 open) | "B2. I did not sign up for this." (decision 537) | V5 |
| Truth | "Riverside. I did not sign up for this." | "Riverside. I came for the lantern, not this." (`SUB4#5`) | R4 |
