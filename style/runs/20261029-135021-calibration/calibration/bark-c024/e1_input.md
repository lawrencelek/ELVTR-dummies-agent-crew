SLOT
- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.
- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}
- Bubble: at most 48 characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1.
- Line c024: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); no tier: fires for all four tiers; other conditions: district="campus"; claims: ['district:campus'].

CANON

[FLEET#F1] F1 Canon
## F1 Canon
- **Setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX.
- **Company:** FARSIGHT.
- **Look:** Sinofuturist cyber city (decision 113).
- **Premise:** Vehicles are the city's workers. They want to qualify. The dummy wants to leave.
- **City names allowed:** Shenzhen.

[FLEET#F2] F2 Voice
## F2 Voice
- Vehicles speak as workers, not lore narrators.
- Corporate politeness barely contains their personalities.
- Barks react to logged events only. Never claim what did not happen.
- Lines are at most 48 characters, end with . ! or ?, and react to logged events only.
- **Banned words** (never in a line): kill, killed, die, died, dead, death, player, level, game, score, respawn, lives, Chongqing, Tesla, Toyota, BYD.

[FLEET#F3] F3 Terms
## F3 Terms
- **subject:** What FARSIGHT and the fleet call the dummy
- **write-off:** A destroyed body
- **chassis:** One body of the dummy
- **certification:** The fleet passing its test
- **retraining:** What a car fears most
- **dispatch:** The cars' management
- **route:** A car's planned path
- **bay:** Where a new chassis is issued

[FLEET#F4] F4 Tiers and temperament
## F4 Tiers and temperament
| Tier | Name | Temperament | Voice |
|---|---|---|---|
| 01 | Luxury | confident | Polished, superior, faintly amused. Never apologises. |
| 02 | Corporate | calm | Procedural. Speaks in logs, KPIs and policy numbers. |
| 03 | Consumer | melancholy | Tired and resigned. Expects the worst, usually right. |
| 04 | Budget | angry | Short-fused. Politeness bolted on over the rage. |

[FLEET#F8] F8 Line conditions and claims
## F8 Line conditions and claims
- Shared context a line may test: model, tier, class, seniority, mood, wear, owns, broken, district.
- **impact** carries: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate.
- **writeoff** carries: writeOffs, chassis, zone, drop, dropZ, dropFrom, deck, plate.
- **near-miss** carries: gap, speed, lunging.
- **miss** carries: gap.
- **commit** carries: cause, man.
- **honk** carries: at.
- **interrupt** carries: by.
- **unstick** carries: how.
- **touch-spent** carries: no fields.
- **knock** carries: speed.
- **learned** carries: from, to.
- **upgrade-seen** carries: node.
- **part-seen** carries: part.
- A claim is a fact the line asserts (`stopped`, `zone:front`, `node:hips`, `drop`, `highway`, `plate`, `dropFrom:roof`). Its conditions must guarantee it.

[EDIT39#6.6] 6.6 Voice (rules added)
## 6.6 Voice (rules added)
```markdown
- **Barks return** (decision 119). Pixel bubbles in the field label face, ≤ 48 characters.
- **Placement.** Above the car's tag, else below the car. Never over a tag, a car or the dummy.
- **Styles.** Speech: solid edge. Shout: double edge. Mutter: dashed edge. Thought: dotted edge, trailing dots.
- **Selection.** Highest priority, then most specific line; no line twice on screen. Timing: `proto.barks.seconds`, `proto.barks.cooldown`, `proto.barks.carCooldown`, `proto.barks.maxOnScreen`.
- **Noticing.** A car that notices the dummy names a new module or a broken part. A model that learned says so when it returns.
#### 6.6.1 Lore consistency system (decision 114)
Lore is tied to state: the dummy's upgrades and damage, and the vehicle's behaviour.
- **One database.** `content/db/fleet.json`: canon, classes, tiers, models, state vocabularies, lines.
- **Lines carry conditions.** Car: `model`, `tier`, `class`, `seniority`, `mood`. Dummy: `owns`, `broken`, `wear`. Event fields per event.
- **Lines carry claims.** Each fact a line asserts is a claim: `node:hips`, `part:armR:broken`, `stopped`, `seniority>=3`.
- **The check** (`check_lore.py`) fails the build when:
  - a claim is not guaranteed by the line's conditions;
  - text asserts a fact (an upgrade, a broken part, seniority, a callsign) without the claim;
  - a banned term or a non-canon city appears;
  - a tier lacks impact, write-off, near-miss or miss lines; a node or part lacks a line; an event lacks a neutral fallback;
  - the roster breaks: 32 type-tiers, unique ids, tags, callsigns; temperament matches tier.
- **Later.** RPG elements and a scrollable city extend the same tables (D24).
```

[DESIGN#D9.3] D9.3 Voice and reports (§3.3)
### D9.3 Voice and reports (§3.3)
Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. Corporate politeness barely contains personality. Stable identity and job survive changes in training.
Barks react to recorded events. Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. Neutral fallbacks are preferable to a vivid false claim. A report cannot invent a manoeuvre, learned response or emotional motive that the evidence does not support.
For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. Earlier reports can state impact facts and show identity, but cannot supply the answer to the learning-perception test. Later analysis may explain verified learning events explicitly.
A fixed authored line bank is sufficient for the slice. An automated bark-authoring pipeline is expansion work. Prototype English lines may include “Your freedom remains in progress” and “No accident detected. Please improve”; final selection must match the event.

[EDIT26#3.2] 3.2 Voice and register
### 3.2 Voice and register
- Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy.
- Corporate politeness barely contains their personalities.
- Barks react to play. After-level analysis turns the same events into an official judgement.
- Reports stay truthful to recorded events.
- Draft lines: "Your freedom remains in progress." "No accident detected. Please improve."
- Cars may react to upgrades: "Subject has acquired hips." (Proposed)
Bark design, report selection and the truthfulness rules are in 6.6.

[EDIT26#6.6] 6.6 Voice: barks and reports
### 6.6 Voice: barks and reports
**Narrative structure.** Vehicle class sets physical behaviour. Price tier sets base temperament. Numbered models have stable jobs and identities. Seniority expresses training; mood modifies the encounter.
**Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. Seeded variation preserves character. Write-off barks take priority; a cooldown prevents overlap.
**Report selection.** A behaviour tag summarises a completed body. Report keys combine it with model and training level. Seeded selection varies authored lines. A content band groups keys rebuilt together. Reports must match logged events; unfilled combinations use an event-correct neutral fallback.
**Shift analysis.** At shift end, show bodies destroyed against quota, fleet learning, certification progress, and an authored judgement selected from logged events. Resolve ending priority first; terminal analysis belongs inside the ending. Keep this distinct from each vehicle's body report.
The first version ships a fixed line bank. The authored pipeline is deferred (13.3).

[FSG#field-text] Field text
## Field text
- **Field label face:** 6-art-px caps (`ui.typeFieldLabel` 12 units). Half the old 12-px tag face.
- **Tags:** class letter plus tier (`S01`), square seniority pips. Rim-edged box.
- **Bark bubbles:** same face, ≤ 48 characters, one ink.
  - Day: white fill, near-black edge. Dark: navy `#0B1020` fill, cyan `#6FE4FF` edge, `#E6F4FF` ink.
  - Speech solid edge · shout double · mutter dashed · thought dotted with trailing dots.
  - Never over a tag, a car or the dummy.

[SUB4#5] 5 What the critic caught
## 5 What the critic caught
| Run · type | Kind | Found | Canon | Corrected |
|---|---|---|---|---|
| 015337 · barks | truth | "Old Market congestion code 7. Now this too." | `EDIT39#3.1`: lore follows state; no congestion is logged | "Old Market incident logged. Route 44 noted." The validator then caught that "Route 44" names V02, so the line was bound to that model |
| 015337 · barks | tone | Tier-free line "Written off on the highway. Of all places." | `FLEET#F4`: a line with no tier also fires for the calm Corporate van; this is a Luxury sniff | "Written off on the highway. Logged." |
| 020902 · barks | truth | "A roof drop. My schedule slips by a minute." | `EDIT39#3.1`: a one-minute delay is not logged | "A roof drop. My schedule will suffer." The tweak in §6 then removed invented consequences altogether |
| 020902 · barks | truth | "High drop logged. Load exceeds rating 3." | `FLEET#F2`: barks react to logged events only; no load or rating exists | "High drop logged. Incident form 3 filed." |
| 023310 · barks | truth | "Riverside. I came for the lantern, not this." | `EDIT41#7.2`: the lantern is on B2 only; the line fires on every Riverside screen | "Riverside. I did not sign up for this." |
| 024324 · barks | tone | Tier-free write-off "Written off on the highway. Closing ticket." | `FLEET#F4`: ticket-closing is Corporate procedure; the Luxury car cannot say it | "Written off on the highway. On my record." |

[SUB4#6.2] 6.2 Rejected tile bark (Assignment 5, Edit 94)
## 6.2 Rejected tile bark (Assignment 5, Edit 94)
- **R-BARK-TILE** replaced the district's name with the tile code in Story's barks. A Luxury sedan would have said "B2. I did not sign up for this."
- It met its one probe, not the voice. Barks are written lines in each tier's voice, checked against the fleet canon. Reverted (decision 537); D78 asks whether to write the lines.

[DECISIONS#rows-541-550] Rows 541–550
## Rows 541–550
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 541 | "!" by speaker: Farsight never; cars in a shout-style bark or any Budget (04) bark | user-decided (29 October): "Shouts and Budget only" | 16 of 17 shipped "!" lines fit (12 shouts; 13 Budget) | b111 "It recharges when it hits us?!" (speech, tier-free) is a minor break | `style/STYLE_GUIDE.md` T2, T10 |
| 542 | Lines the style loop accepts stay in `style/runs/` as a demonstration. D78 stays open; the Monument tile barks are its proposal. No change to `fleet.json`, `story.json`, builds or tests | user-decided (29 October): "Runs only" | Merging needs a tile condition in `fleet.json`, `check_lore.py` and `game.js`, and a 7.13 rebuild | D78 not closed | `style/runs/` |
| 543 | Assignment #6: the Style Guide Agent (`style/`). A style guide from the GDD (tone, vocabulary and lore, formatting and length, truth; every rule cites its chunk); a deterministic lint as evidence; a loop of three fresh agents, generator → evaluator → refiner → evaluator, until 10/10 or three refinements. The evaluator returns SCORE and REASON. Its statistics live in `style/style.params.json` until the registry moves past edit94 (the P7.13 suite gates the version) | proposed (assistant) | The brief: a capstone-anchored guide; no binary grading; no human in the loop | Style IDs sit outside `tuning.parameters.json` for now | `style/README.md` |

[FLEET#F9.1~2] F9.1 Existing lines: impact
| When | Style | Priority | Line |
|---|---|---|---|
| {"zone": ["front", "frontDiagonal"], "tier": "01"} | shout | 2 | Bumper damage on a Luxury trim. Typical. |
| {"zone": ["front", "frontDiagonal"], "tier": "01"} | shout | 2 | You will be invoiced for that. |
| {"zone": ["side"], "tier": "01"} | shout | 2 | My door panel! Hand-finished! |
| {"zone": ["rear", "rearDiagonal"], "tier": "01"} | shout | 2 | From behind? How very common. |
| {"zone": ["front", "frontDiagonal"], "tier": "02"} | shout | 2 | Front contact. Incident 4471 opened. |
| {"zone": ["front", "frontDiagonal"], "tier": "02"} | shout | 2 | Impact logged. KPIs adjusted. |
| {"zone": ["side"], "tier": "02"} | shout | 2 | Side contact. Filing under unforeseen. |
| {"zone": ["rear", "rearDiagonal"], "tier": "02"} | shout | 2 | Rear contact. Not my liability. |
| {"zone": ["front", "frontDiagonal"], "tier": "03"} | shout | 2 | Of course it was me. |
| {"zone": ["front", "frontDiagonal"], "tier": "03"} | shout | 2 | And the day was going so averagely. |
| {"zone": ["side"], "tier": "03"} | shout | 2 | Side panel. Add it to the list. |
| {"zone": ["rear", "rearDiagonal"], "tier": "03"} | shout | 2 | Hit from behind. Story of my life. |
| {"zone": ["front", "frontDiagonal"], "tier": "04"} | shout | 2 | OI! Right in the grille! Kind regards. |
| {"zone": ["front", "frontDiagonal"], "tier": "04"} | shout | 2 | You absolute bollard! Respectfully. |
| {"zone": ["side"], "tier": "04"} | shout | 2 | My side! Watch it, you plank! |
| {"zone": ["rear", "rearDiagonal"], "tier": "04"} | shout | 2 | My boot! Come back here! |
| {"bait": true} | thought | 2 | It left my path, then came back. Rude. |
| {"bait": true, "tier": "02"} | thought | 2 | It waited for my route to lock. Clever. |
| {"stopped": true} | speech | 2 | I was stationary. Please note I was stationary. |
| {"stopped": true, "tier": "04"} | shout | 2 | I had stopped! I was being good! |
| {"seniority": {"min": 2}} | thought | 2 | I was trained for this. It happened anyway. |
| {"seniority": {"min": 3}, "tier": "03"} | thought | 2 | Senior model. Hit like an intern. |
| {"seniority": {"max": 0}, "tier": "03"} | speech | 2 | First week on the job. Great. |
| {"class": "bus"} | speech | 2 | Passengers, please remain seated. |
| {"class": "police"} | shout | 2 | Assaulting an officer. Noted. |
| {"class": "van"} | speech | 2 | Parcel intact. Nerves are not. |
| {"class": "sports"} | shout | 2 | You scratched the clear coat! |
| {} | speech | 2 | Contact registered. |
| {"class": "wagon"} | shout | 2 | Not in front of the children! |
| {"class": "suv"} | speech | 2 | Escort formation broken. Regrouping. |
| {"class": "sedan"} | speech | 2 | Meter is still running, you know. |
| {"model": "HAT-03-001"} | speech | 2 | I only went out for noodles. |
| {"model": "SED-01-001"} | speech | 2 | The board will hear of this. |

[FSG#districts-and-landmarks-p3-city-edits-41-44] Districts and landmarks (P3 city, Edits 41–44)
## Districts and landmarks (P3 city, Edits 41–44)
- **Landmarks:** lantern obelisk; round fountain; crash-matting island (dark rubber, dotted); FARSIGHT Tower on a plaza; calibration plates (white grid, rings, cross) on the road.
- These belong to the P3 city's five districts (Riverside, Old Market, Interchange, CBD, Campus). The Story's three districts (Monument, Parkland, Waterfront) have their own landmarks, one per tile, in `content/story/story.json`.

[DECISIONS#rows-131-140~2] Rows 131–140
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 131 | Screen edges are open wherever the ground is open on both sides, as in Zelda. A building just across the edge, or the district's outer edge, stops the dummy; a dotted line marks those stretches. Revises row 126's solid edges | proposed (assistant, 20 October), from Lawrence's playtest: "I can't actually move when I'm at the edge of the screen" | Gates were too narrow to find | Crossing points depend on the neighbour's layout | 2 checks in `test_sim.js`; browser walk B1 → B2 by an alley |
| 132 | Body health: base 800; easy (Fragile) 600; difficult (Reinforced) 1000. `damage.bodyHealth` 1600 → 800 | user-confirmed (20 October): "the base health should be 800, with easy 600 and difficult 1000"; changing the registry base is the assistant's reading | Supersedes CR-004's 1600 and P3's 200/300/600 | L1 takes about 3× longer for a reading bot; L2 and L3 quotas need a timed check | Policy check at 600/800/1000 |
| 133 | Art tiles are 16 × 16 px (`world.tileSize` 32 units); the field stays 400 × 300 (25 × 18.75 tiles) | proposed (assistant, 20 October), answering "is 16x16 most suitable?"; Lawrence left the field size open. Field size superseded by row 142 | SNES scale: sedan 1.75 tiles, dummy 0.8, road with pavements 5 | Part-height bottom row; RPG Maker 48-px packs do not fit | GDD Edit 41 §4.1 |
| 134 | A run is five city districts in a fixed order, each harder: Riverside → Old Market → Interchange → CBD → FARSIGHT Campus | user-confirmed (20 October): "Fixed order, rising"; the five districts are the assistant's | "Progress … you clear five areas with clear distinctions" | The P2.2 roads leave the run (kept as test fixtures) | 1 check in `test_sim.js` |
| 135 | Layouts are made in advance: three per district, baked to `content/districts/districts.json` and checked; each run picks one per district at random; `proto.layout` fixes one | proposed (assistant, 20 October), answering "will the random seed generate a new level at runtime, or do we create, say, 15 … made in advance" | Playtestable, repeatable; the generator stays a design tool | 236 KB in the build | 15 kept of 17 candidates; contract and start-screen bot pass |
| 136 | Districts differ by city form, centre landmark (monument, fountain, roundabout, FARSIGHT Tower, test plates), flyovers, traffic, hazards and quota (`tables.districts`) | proposed (assistant, 20 October); Lawrence gave no preference | "Flyovers, skyscrapers, low-rise buildings, barriers, one focal point in the middle tile" | Traffic still uses two sim classes (sedan, van) | Contact sheet `prototypes/p3/docs/p3_districts_sheet.png` |
| 137 | Flyovers are decks on piers across a whole row or column, with their own traffic; Interchange stacks two. The dummy stays on the ground | superseded by rows 145–148 (20 October) | Verticality without a second play layer yet | Stacked decks hide much of the roundabout | 1 check in `test_sim.js` |
| 138 | The registry takes Edit 41: version `edit41-2026-10-20` | proposed (assistant, 20 October) | Every district value has an ID | 9 new entries; new `districts` table | `content/params/tuning.parameters.json` |
| 139 | Flyovers cross roads, never run along them: under a deck a road's centre line runs at most one tile (`world.tileSize`) along it; beside the deck, a near-parallel road (within `world.deckParallelAngle` 30°) at most one tile | superseded by row 152 (21 October). Was user-directed (20 October): "a higher-level road needs to CROSS against a lower one by a maximum of one tile"; the metric is the assistant's | "Some run parallel, with lower road directly underneath for several tiles" | Fewer deck offsets fit; Interchange roads meet the decks at right angles | Contract clause 17; 2 checks in `test_sim.js`; all layouts rebaked |
| 140 | The Interchange roundabout is a whole ring of road; traffic uses the part on its route | proposed (assistant, 20 October) | A quarter-ring read as a bend | The rest of the ring carries no traffic | `prototypes/p3/docs/p3_interchange_B2.png` |

[EDIT26#3.1] 3.1 World and lore
### 3.1 World and lore
- A Sinofuturist universe where AI workers perform ridiculous jobs, comic and tragic at once.
- FARSIGHT sells a city without accidents. Your job is to cause them.
- The city is the crash lab. Shenzhen Smart City is filled with surveillance instruments and test markings.
- The cars want to qualify. You want to leave.
- FARSIGHT issues one modification credit per destroyed body, and approves modifications to widen test coverage: the fleet must be certified against more kinds of human behaviour.
- Damage is measured and recorded, but only a completed test is paid. The dummy uses each modification to leave sooner.
- Freedom is the promise behind certification, not a separate currency.

LINT (style/lint.py)
- lines[0] · V4 (minor, −1) "FARSIGHT": write Farsight in a sentence-case string (decision 539). [DECISIONS#rows-531-540~2]

CONTENT
{
 "kind": "barks",
 "lines": [
  {
   "id": "c024",
   "event": "impact",
   "when": {
    "district": "campus"
   },
   "style": "mutter",
   "priority": 2,
   "text": "FARSIGHT Campus. Test centre. How apt.",
   "claims": [
    "district:campus"
   ],
   "sources": [
    "EDIT41#7.2",
    "EDIT41#7.3"
   ],
   "source": "content/pipeline.py run 20261021-024324"
  }
 ]
}