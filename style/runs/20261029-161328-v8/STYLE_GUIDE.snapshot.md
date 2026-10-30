# DUMMIES — Style Guide V2 (Dummy Corporation)

**29 October 2026 · Lawrence Lek** · The lore refinement of GDD Edit 95, for Prototype 8. A separate guide: `STYLE_GUIDE.md` (V1, Assignment 6) stays as it was, for Prototype 7.13.

- **Game:** DUMMIES. A crash-test dummy in SHENZHEN SMART CITY trains in the traffic. The self-driving cars are the city's workers.
- **The company in the game:** Dummy Corporation. It manufactures custom dummies for high net-worth individuals.
- **The publisher:** Farsight. Extra-diegetic. Named only in the Credits.
- **The dummy's purpose:** do its job, complete its training, join the Certified dummies, and be sacrificed in service to high net-worth individuals.
- **Story (Narrative A, Certified, kept):** Act I Monument, INDUCTION · Act II Parkland, OPENING DAY · Act III Waterfront, CUSTOMS. 27 tiles. Ending: CERTIFIED.
- **Tone reference:** *Play Station* (Lawrence Lek, 2017): slogans, programme names, perks, fine print (`PLAY#PS1`–`PLAY#PS5`).
- **Precedence:** newest wins. EDIT95 > EDIT94 > EDIT93 > EDIT92 > STORY > FLEET > EDIT39 > DESIGN (V29) > EDIT26. EDIT95 replaces every source that names Farsight inside the game. A user-decided DECISIONS row beats any doc.
- **Sources** are chunk IDs from `style/kb/manifest_v2.json`. **Statistics** are IDs in `style/style.params.json`.

## 0 What it governs

| Speaker | Content | Slot in Prototype 8 |
|---|---|---|
| Dummy Corporation | Tales: the tile card | `content/story/story_v2.json` `districts[].tiles.<tile>.tale` |
| Dummy Corporation | Briefs: label and duty | `story_v2.json` `tasks` |
| Dummy Corporation | Act lines | `story_v2.json` `districts[].intro` |
| Dummy Corporation | The ending | `story_v2.json` `ending` |
| Dummy Corporation | Notices: title lines, drone and gift labels, part notes, toasts, signage | `prototypes/p8/lore.js` |
| The cars | Barks: one bubble per event | `content/db/fleet.json` `barks[]`; Prototype 8's overrides in `lore.js` |
| The Credits | Who made and published the game. Extra-diegetic | `lore.js` `credits` |

- **Out of scope:** menu chrome and controls help (NEW GAME, PRESS SPACE TO START). They are interface, not voice (decision 540). They still name no company.

## 0.1 Cast and factions

| Who | What they are | In text | Rules | Source |
|---|---|---|---|---|
| The dummy | A trainee and the product. It wants to be Certified | "you". Cars: "the subject", "it", "the dummy" | V3, V8, T5 | `EDIT95#3.1`, `FLEET#F3` |
| Dummy Corporation | Makes custom dummies for high net-worth individuals. Narrates | "Dummy Corporation", "the Corporation", "we". Caps: DUMMY CORPORATION | T1–T5, V4 | `EDIT95#3.1`, `EDIT95#3.2` |
| Clients | High net-worth individuals. Never named, never seen. Served | "clients", "our clients", "high net-worth individuals" | V9 | `EDIT95#3.1` |
| Certified dummies | Those who passed. They serve, and are sacrificed for, clients | "Certified" (capital C) | V3, T4 | `EDIT95#3.1`, `EDIT95#3.3` |
| The fleet | The city's self-driving cars, its workers; the trainee's colleagues | Barks in tier voice | T6–T12 | `FLEET#F1`, `FLEET#F2` |
| Four price tiers | 01 Luxury · 02 Corporate · 03 Consumer · 04 Budget | Each keeps its voice | T7, T8, T10 | `FLEET#F4` |
| Eight classes, 32 named models | Comet couriers to Commons buses; callsigns Aurum to Rust Bucket | A class speaks from its job; a callsign pins a line | V7 | `FLEET#F5`, `FLEET#F7~2` |
| Act II and III people | The board, visitors, a school party, the gardener; customs, the police, Chassis 0 | Narration only | V6, R4 | `STORY#PC2`, `STORY#PA1`, `STORY#WB3` |
| Farsight | The publisher | Credits only | V1, C1 | `EDIT95#0` |

## 1 Scoring

- **Start at 10.** Each violated rule deducts its severity, once per rule per line.
- **Severity:** blocking −4 (`style.score.deduct.blocking`) · major −2 (`style.score.deduct.major`) · minor −1 (`style.score.deduct.minor`). **Floor:** 1 (`style.score.floor`).
- **Acceptance:** 10/10 (`style.loop.targetScore`), confirmed by a fresh evaluator (`style.loop.confirmations`). At most three refinements (`style.loop.maxRounds`).
- **Lint** (`style/lint.py`, mode v2) measures: length, sentences, Farsight, the company's name, "!", intensifiers, digits, grid codes, landmarks. Its findings are facts.
- **Output, strictly:**

```
SCORE: <X>/10
REASON:
- <line id> · <rule id> (<severity>, −<n>) "<quoted text>" <why, one sentence>. [<chunk id>] Fix: <replacement or instruction>.
Total: 10 − <n> − <n> = <X>.
```

- Nothing follows the `Total:` line. A clean piece: `- None.`, one sentence naming what was checked, `Total: 10.`

## 2 Tone

| ID | Speaker | Rule | Source | Test | Severity |
|---|---|---|---|---|---|
| T1 | Dummy Corporation | Deadpan and inspirational. A corporate notice that motivates the trainee, delivered flat. | `EDIT95#3.2`, `PLAY#PS2` | Judge: cheer, hype, irony that winks, or sarcasm fail. So does a notice that does not motivate | major |
| T2 | Dummy Corporation | No exclamation marks. | `EDIT95#3.2`, `PLAY#PS0` | Lint `bang` | major |
| T3 | Dummy Corporation | Training framing. The job is training. A write-off is progress. Parts are equipment. Cars are colleagues. The goal is Certification and service to clients. | `EDIT95#3.1`, `EDIT95#3.3` | Judge: a game, a contest, enemies, a power-up fail | major |
| T4 | Dummy Corporation | Inspire, never console. Harm is service and progress. Sacrifice is stated plainly, as an honour. No pity, no gore, no wink. | `EDIT95#3.1`, `EDIT39#4.1.1` | Judge | major |
| T5 | Dummy Corporation | Address the trainee as "you". The company speaks as "Dummy Corporation", "the Corporation" or "we". | `EDIT95#3.2`, `PLAY#PS2` | Judge | minor |
| T6 | Cars | Workers, not lore narrators: deadlines, rank, record, fear of retraining, resentment, pride. | `EDIT26#3.2`, `DESIGN#D9.3`, `FLEET#F2` | Judge | major |
| T7 | Cars | Tier voice holds. 01 Luxury: polished, superior, never apologises. 02 Corporate: logs, KPIs, policy numbers. 03 Consumer: tired, resigned. 04 Budget: short-fused, politeness bolted on. | `FLEET#F4` | Judge against `when.tier` | major |
| T8 | Cars | A tier-free line fires for all four tiers. It carries no single tier's signature. | `SUB4#5`, `FLEET#F4` | Judge | major |
| T9 | Cars | Politeness barely contains the personality. | `EDIT26#3.2`, `FLEET#F2` | Judge | minor |
| T10 | Cars | "!" only in a shout-style bark or a Budget (04) bark. | `DECISIONS#rows-541-550` (row 541) | Lint `bang` | major |
| T11 | Cars | A batch does not lean on stock endings: at most two lines share a stock word or a closing tag (`style.bark.maxStockEndings`). | `SUB4#6.1` | Lint `stock` | minor |
| T12 | Cars | A line is a feeling or a joke, not a flat report. | `SUB4#6.1` | Judge | minor |
| T13 | Dummy Corporation | Few adjectives. At most one per sentence. No intensifiers (very, truly, really, incredibly, extremely, amazing). | `EDIT95#3.2` | Lint `adjectives` (intensifiers); judge the count | minor |

## 3 Vocabulary and lore

| ID | Speaker | Rule | Source | Test | Severity |
|---|---|---|---|---|---|
| V1 | Both | Banned in every in-game text: Farsight (any case), kill, killed, die, died, dead, death, player, level, game, score, respawn, lives, Chongqing, Tesla, Toyota, BYD. Plurals and -ed forms count. The Credits may name Farsight. | `EDIT95#0`, `EDIT95#3.1`, `FLEET#F2`; row 540 | Lint `banned` | blocking |
| V2 | Both | One city: Shenzhen Smart City. No other real city. No real car brand. | `FLEET#F1`, `EDIT39#3.1` | Lint `city`, `brand` | blocking |
| V3 | Both | The glossary. Training: the dummy's job. Certified: a dummy that passed. Clients: high net-worth individuals. Write-off: a destroyed body. Chassis: one body. Bay: where a chassis is issued. Dispatch, route, retraining: the cars' words. Never a game's words (lives, respawn, level). | `EDIT95#3.1`, `FLEET#F3` | Judge | major |
| V4 | Dummy Corporation | The company is Dummy Corporation. Caps labels: DUMMY CORPORATION, CORPORATION DRONE. A sign too narrow may read DUMMY CORP. No other company name. | `EDIT95#3.1`, `EDIT95#4.2` | Lint `company` | major |
| V5 | Cars | Cars name places, never grid codes. | `EDIT94#who-built-what-assignment-5`; row 537 | Lint `gridcode` | major |
| V6 | Dummy Corporation | The story frame holds. INDUCTION: the trainee arrives. OPENING DAY: the Expo opens to clients. CUSTOMS: Certified dummies ship to clients. Fixed phrases stay exact: ZERO ACCIDENTS, ROLE: DESTRUCTIVE TESTING, CERTIFIED. | `EDIT95#3.3`, `STORY#S2` | Judge | major |
| V7 | Cars | The roster from `fleet.json`. A callsign or job detail pins the line to its model. | `FLEET#F5`, `FLEET#F7~2` | Judge | major |
| V8 | Both | The dummy is a crash-test body: a trainee and a product, not a person or a competitor. | `EDIT95#3.1`, `FLEET#F3` | Judge | major |
| V9 | Dummy Corporation | Clients are high net-worth individuals. They are served, never seen, never named, never mocked. | `EDIT95#3.1` | Judge | major |

## 4 Formatting and length

| ID | Speaker | Rule | Source | Test | Severity |
|---|---|---|---|---|---|
| F1 | Cars | At most 48 characters (`style.bark.maxChars`): three lines of the field face. | `EDIT39#6.6`, `FSG#field-text` | Lint `length` | blocking |
| F2 | Cars | One bubble, one ink: plain text on one line. | `FSG#field-text` | Lint `plain` | major |
| F3 | Cars | Ends with ".", "!" or "?". | `FLEET#F2` | Lint `end` | major |
| F4 | Cars | Fields fit the event: style, priority (write-off 3, hit 2, chatter 1). | `EDIT39#6.6`, `EDIT26#6.6` | Lint `fields` | major |
| F5 | Both | No typed gameplay figures. Numbers live in the registry. Placeholders and paperwork numbers only, as in V1. | `STORY#S1`, `FSG#canon-rules` | Lint `digits` | major |
| F6 | Dummy Corporation | Every in-game text: at most two sentences (`style.v2.text.maxSentences`) and at most 20 words (`style.v2.text.maxWords`). Aim for 15 (`style.v2.text.targetWords`). Tales, briefs, act lines, the ending, notices. | `EDIT95#3.2` | Lint `length` | blocking |
| F7 | Dummy Corporation | A tale on a tile that issues equipment names it, by rank or in words ("Legs 1 is fitted."). | `DECISIONS#rows-531-540~2` (row 531), `STORY#MB3` | Judge | major |
| F8 | Dummy Corporation | A brief: a caps label of at most 19 characters (`style.brief.labelMaxChars`), then the duty: what the training covers and what the final hit must be. | `STORY#S3`, `EDIT95#3.2` | Lint `brief` | major |
| F9 | Cars | At most two sentences (`style.v2.text.maxSentences`). | `EDIT95#3.2` | Lint `sentences` | blocking |
| F10 | Dummy Corporation | A notice keeps its slot's form: a caps label stays caps; a placeholder ({PART}, {TILE}, {N}) stays as given. | `EDIT95#4.2` | Lint `placeholders`; judge | major |

## 5 Truth

| ID | Speaker | Rule | Source | Test | Severity |
|---|---|---|---|---|---|
| R1 | Cars | React to logged events only. Invent no speed, damage, delay, fine or motive. | `DESIGN#D9.3`, `FLEET#F8` | Judge | blocking |
| R2 | Cars | Every fact a line asserts has a claim its conditions guarantee. | `EDIT39#6.6`, `FLEET#F8` | Judge | blocking |
| R3 | Cars | Event-correct. A write-off line only on `writeoff`. | `EDIT26#6.6` | Judge | blocking |
| R4 | Both | Tile truth. A tile's text names only what the tile has. A car's tile line names the landmark as the place, never a spot relative to it. | `STORY#MA1` … `STORY#WB2`; `FLEET#F8` | Lint `landmark`; judge | blocking |
| R5 | Dummy Corporation | A tale's duty matches its brief, and it names equipment only on the tile that issues it, or later. | `STORY#S1`, `EDIT93#3.1` | Judge | blocking |

## 6 Credits

| ID | Speaker | Rule | Source | Test | Severity |
|---|---|---|---|---|---|
| C1 | Credits | Extra-diegetic. Name the game, its maker and its publisher, Farsight. No lore, no slogans. At most two sentences a line. | `EDIT95#0`, `EDIT95#3.3` | Lint `length`; judge | major |

## 7 In voice, out of voice

| Speaker | In voice | Out of voice | Rule |
|---|---|---|---|
| Dummy Corporation | "Every write-off brings Certification closer. Stand in the road." | "Farsight welcomes you to the Test City!" | V1, T2 |
| Dummy Corporation | "Our clients cannot afford accidents. You can." | "Poor dummy. It hurts, but you are so brave." | T4, T13 |
| Dummy Corporation | "Legs 1 is fitted. Jump into a car between the screens." | A 40-word tale about the screens' history | F6 |
| Dummy Corporation | "Success is measured against the possible, not the probable." (`PLAY#PS2`, the register) | "It's work! It's play!" (`PLAY#PS4`, not adopted) | T1, T2 |
| Cars | "Bumper damage on a Luxury trim. Typical." | "Done! Done! You happy now?!" (three sentences) | F9 |
| Credits | "DUMMIES · A game by Lawrence Lek · Published by Farsight" | "Farsight: aligning AI with your interests." in a tale | C1, V1 |
