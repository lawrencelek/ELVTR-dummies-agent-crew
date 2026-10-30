SLOT
- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.
- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}
- Bubble: at most 48 characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1.
- Line b031: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); no tier: fires for all four tiers; other conditions: class="sedan"; claims: ['class:sedan'].

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

[DECISIONS#rows-61-70~2] Rows 61–70
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 61 | Branch 2, Torso: Waist (turn faster) unlocks Spine (change direction mid-lunge) and Core strength (a missed lunge becomes a roll, so you recover at once) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | Turning is the dummy's first freedom | Spine breaks the GDD's "no steering mid-lunge" rule and can follow a car's swerve. Proposed: limit the steer. | — |
| 62 | Branch 3, Battery or Heart (name open): Extra cell (a short second lunge straight after the first) unlocks Kinetic chain (a hit worth more than 100 points recharges the battery) and Nitro (recharges twice as fast, but you jitter and can't stand still) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | — | Kinetic chain and Nitro only matter if the base recharge is made slower: today the lunge is ready again 0.25 s after it lands | Recharge 0.55 s from lunge start, lunge 0.3 s (`output/spec.json`) |
| 63 | Branch 4, Arms: swinging your arms makes you run faster; it unlocks Hold on (move onto a car's side, hold on and ride it, then lunge off onto the next car) and a second upgrade not yet chosen | user-confirmed except the second upgrade (9 October; not built); superseded by row 76 (9 October) | — | Hold on needs a rule for "one impact per car" | — |
| 64 | Branch 4, Arms (completes row 63): the core upgrade is Shoulder socket (swing your arms and run faster); the second upgrade is Carry (carry light obstacles and drop them) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | — | Cars must learn about dropped obstacles, or a dropped cone is free bait forever (skill-tree review) | — |
| 65 | Branch 5, Legs: Spring start (full speed from the first step) unlocks Jump (during a lunge, press again to jump over low barriers and obstacles) and Kick (kick objects into a car's path) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | — | Spring start conflicts with row 52 ("starts off running"): if the dummy already runs from the start, Spring start does nothing. Open: keep today's walk-to-run ramp as the limitation, or redefine Spring start. Jump is now the only way over barriers, because no upgrade climbs. | Build: walk 81 px/s ramps to run 162 px/s over 1.0 s (`rampTime` in `output/spec.json`) |
| 66 | Two buttons, like Nintendo A and B | user-confirmed (9 October; not built) | Extra cell (press again for a second lunge) and Jump (press during a lunge) need separate inputs | Replaces GDD section 1's single button; the exhibition setup needs two buttons. Proposed mapping: A = lunge (press again for Extra cell; lunge off a car you are holding on to). B = jump during a lunge, kick when running into a light object, pick up or drop when standing next to one. | GDD Edit 10, section 11.5 |
| 67 | Keep today's one-second walk-to-run build-up; the Spring start upgrade removes it | user-confirmed (9 October) | Gives Spring start a purpose | Replaces row 52's running start; slow turning still stands | Built: `rampTime` 1.0 s in `output/spec.json` |
| 68 | Everyone sees the commit chevron and brake lights; the Sensors upgrade adds the cars' detection zones | user-confirmed (9 October: "Sensors, ok"); what else Sensors shows is open | Keeps pillar 4 for players without the upgrade | Players without Sensors cannot see a car's zone before it notices them | — |
| 69 | Spine: a lunge can change direction by up to 45° | user-confirmed (9 October; not built) | Limits chasing a car's swerve | — | — |
| 70 | A is always the legs (lunge, then lunge and jump); B is always action, the arms | user-confirmed (9 October); the detailed mapping is proposed (GDD Edit 10, section 11.5) | A body logic a player can learn: legs on one button, arms on the other | Jump and Extra cell both use A again. Proposed split by timing: during the lunge is a jump, just after landing is the second lunge. Replaces row 66's proposed mapping. | — |

[EDIT26#5.6~2] 5.6 Progression: the skill tree
| Part | Starts as | Tier 1 | Tier 2 | Tier 2 |
|---|---|---|---|---|
| **Head**: what you see | A single forward sensor: narrow cone, no memory, no warning | **Wider view**: the cone opens from `sensing.coneWidth` to `upgrades.widerView` | **Memory**: a timestamped last-seen zone outline remains for `upgrades.memorySeconds` after you look away (Proposed) | **Ears**: a pulse forecasts a planned entry `upgrades.earsForecast` ahead; blocked entry becomes a waiting marker (Proposed) |
| **Torso**: where you point | Slow to turn; the body must rotate before it can move or look anywhere new | **Hips**: overrides `movement.turnRate` with `upgrades.hipsTurnRate` | **Spine**: bend a lunge mid-flight, up to `upgrades.spineLimit` | **Neck**: the view cone decouples from the facing (5.2, 5.3) |
| **Legs**: where you go (A) | A one-second build-up; holes and deep water stop you; low grip slides you | **Spring start**: full speed from the first step | **Jump**: press A mid-lunge to hop over holes and deep water, never over solid objects | **Grip**: firm footing on slippery ground; deep water remains a gap |
| **Arms**: what you change (B) | Rigid; B does nothing | **Carry**: B picks up and drops a cone | **Hold on**: B grabs a car's side; ride it, then press A to lunge off | **Throw**: B while carrying throws the cone ahead instead of dropping it |
| **Battery**: how much you can do | A small battery | **Big battery**: more charge | **Kinetic charge**: an impact of at least `upgrades.kineticThreshold` pre-bonus damage refills `upgrades.kineticFraction` | **Fast charge**: the battery refills twice as fast |
**The tier-1 set** is Wider view, Hips, Spring start, Carry and Big battery. These are the first to build and the first a player can buy.
**Moved out of the tree on purpose**
- **Kicking cones** is not an upgrade. As a Legs upgrade it would duplicate the Arms job of moving things, so every dummy punts a cone by running into it.
- **Running faster** became Spring start, because speed is the Legs job.
- **Dents on cars** that have learned from you show for everyone, as pillar 2 requires.
- **A second lunge** became Big battery. A press of A therefore only ever means lunge, or jump mid-lunge.
- **Strafe** was withdrawn. Steer-to-direction makes sidestepping the default, so it has nothing to sell.
**Notes on single upgrades** (Proposed)

[DECISIONS#rows-51-60~2] Rows 51–60
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 51 | Work continues directly on `main` | proposed (assistant) | Lawrence merged the last branch and asked for it deleted; this session cannot delete branches on GitHub | No separate branch to review before it lands | — |
| 52 | The dummy starts off running, but turns slowly; a lunge goes where it faces | user-confirmed (design, 8 October 2026; not built). Running start superseded by row 67 (9 October); slow turning stands | A crash-test dummy has fewer degrees of freedom than a person; turning early to aim is itself a read | A stiffer first minute at an exhibition | `DUMMIES_DEGREES_OF_FREEDOM.md` in the project |
| 53 | Upgrades restore degrees of freedom by body part; none ever adds health, armour or repair | user-confirmed (design; not built): "You are not buying freedom. You are buying degrees of freedom."; the jump part is superseded by row 86 (10 October): Jump does not clear barriers, so barriers always stop the dummy and the gaps are the way through | Gives the player a progression of their own against the cars' learning | A large feature; to be built in stages | Same note |
| 54 | Barriers stop the dummy until it can jump or climb | user-confirmed (design; not built) | Gives jump and climb a purpose from the first road level | Road levels need pedestrian gaps in the barriers | Same note |
| 55 | Jump is a flat, Zelda-style hop: over holes and low obstacles, never over a car | user-confirmed (design; not built) | Keeps every guarantee about cars intact; pseudo-3D heights later | Less spectacular for now | Same note |
| 56 | Falling into a hole resets the dummy to safe ground | user-confirmed (design; not built) | — | Costs only time | Same note |
| 57 | Terrain changes movement (fast on tarmac, slower on grass, and so on) | user-confirmed in principle (design; not built); the starting list and numbers are proposed | Gives levels texture and gives Feet a purpose | A terrain layer is needed in every level | Same note: 16 terrain types |
| 58 | Upgrade tree in the style of Polytopia's tech tree: five core parts, each unlocking two upgrades, 15 in all | user-confirmed (design, 8–9 October 2026; not built) | One screen shows everything you can't have yet; 15 is small enough to balance | Fewer upgrades than the 25-node draft | Polytopia screenshot from Lawrence; `DUMMIES_SKILL_TREE_REVIEW.md` recommended 12–15 |
| 59 | Upgrades must read from above: position, facing, outline, movement, or markings on the ground and on cars | user-confirmed (8 October): "Remember this is a top down game!" | Faces and height cannot be seen in a top-down view | Rules out face-based ideas (painted face, phone, nod) | `DUMMIES_UPGRADE_IDEAS.md` |
| 60 | Branch 1, Sensors: the core upgrade reveals the cars' detection zones, which are hidden by default. It unlocks Eyes (see dents on cars that have marked you) and Ears (a pulse at the screen edge where a vehicle will appear). Cone head is cut. | user-confirmed (9 October; not built); superseded by row 76 (9 October) | Reading the cars becomes something you earn | Players without it cannot see the detection zones that pillar 4 and GDD section 4 rely on. Proposed: everyone still sees the commit chevron and brake lights. | The build draws the zones by default (`showPerception = true` in `index.html`), and the commit chevron is drawn inside the same overlay |

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "barks",
 "lines": [
  {
   "id": "b031",
   "event": "impact",
   "when": {
    "class": "sedan"
   },
   "style": "speech",
   "priority": 2,
   "text": "Meter is still running, you know.",
   "claims": [
    "class:sedan"
   ]
  }
 ]
}