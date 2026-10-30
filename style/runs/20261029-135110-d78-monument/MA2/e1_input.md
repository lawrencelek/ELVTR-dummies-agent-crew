SLOT
- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.
- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}
- Bubble: at most 48 characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1.
- Line t121: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); tier 01 Luxury: Polished, superior, faintly amused. Never apologises.; other conditions: district="monument", tile="A2"; claims: ['district:monument', 'tile:A2'].
- Line t122: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); tier 02 Corporate: Procedural. Speaks in logs, KPIs and policy numbers.; other conditions: district="monument", tile="A2"; claims: ['district:monument', 'tile:A2'].
- Line t123: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); tier 03 Consumer: Tired and resigned. Expects the worst, usually right.; other conditions: district="monument", tile="A2"; claims: ['district:monument', 'tile:A2'].
- Line t124: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); tier 04 Budget: Short-fused. Politeness bolted on over the rage.; other conditions: district="monument", tile="A2"; claims: ['district:monument', 'tile:A2'].
- Tile (proposed `tile` condition, D78): Monument A2 · The neon shops (ACT I · INDUCTION; tile 6 of 9). Brief: CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone. Equipment issued here: Hands 1. Chunk: STORY#MA2.

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

[STORY#MA2] MA2 Monument A2 · The neon shops
### MA2 Monument A2 · The neon shops
- **Tile:** Monument A2, 6 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The neon shops.
- **Brief:** CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone.
- **Equipment issued here:** Hands 1.
- **Tale:** The shops under the highway sell nothing. Their signs flash prices at the traffic, which reads every word. Hands 1 is fitted, so you can place a cone. Colleagues are trained to respect cones. Use this.

[EDIT92#3.1~3] 3.1 The 27 tiles
- **Renamed (D75):** Monument A1 The LED wall → The welcome wall; A2 The neon arcade → The neon shops; Parkland A2 The canal → The dome by the canal; Waterfront C3, A3 The east, west pier tower → The east, west customs post.
- **Briefs, parts, write-offs, order:** unchanged (Edits 82–91).

[EDIT92#7] 7 Tile art (amends Edit 91 §3; `world.storyArt` 1 in P7)
## 7 Tile art (amends Edit 91 §3; `world.storyArt` 1 in P7)
```markdown
- **Rule:** cosmetic only. Pixels on sprites already placed; flat marks on the ground; props never solid.
  - No solid, floor, stair, spawn or cone home changes (checked on all 27 tiles).
- **Monument A1, the welcome wall:** the LED panel shows the dummy's face in the screen's cyan; WELCOME · NEW STAFF · FARSIGHT.
- **Monument A2, the neon shops:** two shopfronts per block, a lit sign over each (OPEN, SALE; 24H, NEW); neon glow on the pavement.
- **Monument A3, the stacked cubes:** each cube lit on its edges; the roof's front edge brightest.
- **Monument C3, the LED gateway:** two pylons with lit strips; a beam 21 art px deep with chevrons; THANK YOU · DRIVE SAFE along it; its shadow across the lanes.
- **Parkland C1, the lantern pavilion:** a white paper lantern, ribbed, on the pavilion's lawn.
- **Parkland B1, the cascade:** water spilling over each pool's lip; a grated runnel across the path to the next pool.
- **Waterfront A3, C3, the customs posts:** CUSTOMS, lit, on each pier tower's plinth.
- **Waterfront B3:** a container ship moored between the stilt houses: the ship of the finale.
- **Waterfront B2:** the DUMMY MONUMENT (Edit 91).
- **Not drawn:** Parkland's visitors, Chassis 0 (figures would read as targets or obstacles).
```

[FLEET#F9.4] F9.4 Existing lines: miss
## F9.4 Existing lines: miss
| When | Style | Priority | Line |
|---|---|---|---|
| {"tier": "01"} | mutter | 1 | Is it dancing? How quaint. |
| {"tier": "01"} | mutter | 1 | Missed. One expected nothing less. |
| {"tier": "02"} | mutter | 1 | Dash detected. No contact. Noted. |
| {"tier": "02"} | mutter | 1 | Missed. Updating my calendar. |
| {"tier": "03"} | mutter | 1 | It missed. Even it gave up on me. |
| {"tier": "03"} | mutter | 1 | It lunged. Nothing happened. Same. |
| {"tier": "04"} | mutter | 1 | Missed! Rubbish! Regards! |
| {"tier": "04"} | mutter | 1 | Ha! Do it properly! |
| {"broken": "legs"} | mutter | 1 | Its legs have gone. It cannot reach. |
| {} | speech | 1 | Missed. Noted for my record. |

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "barks",
 "lines": [
  {
   "id": "t121",
   "event": "impact",
   "when": {
    "district": "monument",
    "tile": "A2",
    "tier": "01"
   },
   "style": "speech",
   "priority": 2,
   "text": "Monument shopfronts, and you scuff my paint.",
   "claims": [
    "district:monument",
    "tile:A2"
   ]
  },
  {
   "id": "t122",
   "event": "impact",
   "when": {
    "district": "monument",
    "tile": "A2",
    "tier": "02"
   },
   "style": "speech",
   "priority": 2,
   "text": "Neon shops zone. Contact logged. KPIs adjusted.",
   "claims": [
    "district:monument",
    "tile:A2"
   ]
  },
  {
   "id": "t123",
   "event": "impact",
   "when": {
    "district": "monument",
    "tile": "A2",
    "tier": "03"
   },
   "style": "mutter",
   "priority": 2,
   "text": "Under the neon shops. Of course it happened.",
   "claims": [
    "district:monument",
    "tile:A2"
   ]
  },
  {
   "id": "t124",
   "event": "impact",
   "when": {
    "district": "monument",
    "tile": "A2",
    "tier": "04"
   },
   "style": "shout",
   "priority": 2,
   "text": "Not outside the neon shops! Kind regards!",
   "claims": [
    "district:monument",
    "tile:A2"
   ]
  }
 ]
}