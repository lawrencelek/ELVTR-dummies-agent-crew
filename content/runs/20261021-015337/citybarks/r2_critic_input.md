# BRIEF — City barks: what the fleet says about drops, highways and calibration plates
- My game is thin on humour in the new city (designer's gap statement). P3.3 (GDD Edit 44) added three levels: a dummy can drop onto a car from a Z1 low highway, a Z2 high highway or a Z2 platform roof; highway cars can be hit on their own deck; FARSIGHT Campus scores hits on calibration plates.
- The fleet bank (123 lines, content/db/fleet.json) was written for one road. No line knows about drops, highways, plates or districts.
- So when the dummy lands on the Luxury sedan from a roof, the car says 'Bumper damage on a Luxury trim.' That breaks lore tied to state (GDD Edit 39 §6.6.1): the line asserts a front-bumper strike that did not happen.
- Only two models run in the P3 city: SED-01-001 (tag S01, Meridian Imperial, callsign Ambassador, tier 01 Luxury, confident) and VAN-02-001 (tag V02, Porter Office, callsign Waybill, tier 02 Corporate, calm). A line bound to another tier, class or model never fires.

## Consumer contract
- game.js barkLine: on each impact or write-off naming a car, it collects lines whose event matches and whose 'when' all hold.
- Highest priority wins. At equal priority, a line that tests a situation field (drop, dropZ, dropFrom, deck, plate, district) outranks every line that does not. Then the most specific line.
- Impact fields: zone, part, bait, stopped, lunging, drop (true when the dummy landed on the car), dropZ (1 or 2: the level it fell from; 0 if no drop), dropFrom ('deck' or 'roof'), deck (true when the car is highway traffic and was hit on its deck), plate (true when the hit landed on a Campus calibration plate).
- Write-off fields: writeOffs, chassis, zone, and the same situation fields as the impact that caused it.
- Shared context: model, tier, class, seniority, mood, wear, owns, broken, district (riverside, market, interchange, cbd, campus).
- Placeholders {field} insert an event field, but the text must stay true for every value it can take.
- Facts: roofs are Z2 (a roof drop is always dropZ 2). A Z1 drop is always off a low highway. Highways run only in Interchange (Z1 and Z2), CBD (Z1 and Z2) and Campus (Z1). Plates are only in Campus, on the ground road. A dummy never drops onto highway traffic, so drop and deck are never both true.
- The bubble shows above the car for proto.barks.seconds. Three lines of the 6-px field face: at most 48 characters.

## Voices (who says what)
- tier 01 Luxury (S01 'Ambassador', chauffeurs FARSIGHT board members): Polished, superior, faintly amused. Never apologises. Complains about the indignity, not the danger.
- tier 02 Corporate (V02 'Waybill', parcel route 44): Procedural. Speaks in logs, KPIs and policy numbers. Files the incident.
- any car: A worker on a schedule. Fears retraining and dispatch. Never mocks the dummy, never names the player, never cheers.

## Game data
Registry IDs you may reference (value, unit):
- damage.dropSpeed = 120 world units/s
- damage.plateMultiplier = 1.5 multiplier
- proto.barks.carCooldown = 4 s
- proto.barks.cooldown = 0.8 s
- proto.barks.maxOnScreen = 3 count
- proto.barks.missRadius = 120 world units
- proto.barks.nearMissGap = 36 world units
- proto.barks.nearMissSpeed = 60 world units/s
- proto.barks.seconds = 2.4 s
- proto.barks.textSize = 12 px
- world.deckHeight = 120 world units
- world.dropSeconds = 0.35 s
- world.highHeight = 216 world units

Districts in run order (sim.js, tables.districts):
- riverside: Riverside — focal monument; quota 1; highways 0 (Z2: 0); current placeholder blurb: "Low-rise riverfront. A lantern monument marks the centre."
- market: Old Market — focal fountain; quota 2; highways 0 (Z2: 0); current placeholder blurb: "Dense low-rise streets around a fountain square. Wet, and busy with vans."
- interchange: Interchange — focal roundabout; quota 2; highways 2 (Z2: 1); current placeholder blurb: "Two flyovers either side of a roundabout. Its island is crash matting."
- cbd: Central Business District — focal tower; quota 3; highways 2 (Z2: 1); current placeholder blurb: "Towers and barriers. FARSIGHT Tower stands at the centre."
- campus: FARSIGHT Campus — focal plate; quota 4; highways 1 (Z2: 0); current placeholder blurb: "The test centre the city was modelled on. Calibrated plates score more."

Models running in the P3 city: SED-01-001 (S01, Meridian Imperial, callsign Ambassador, tier 01, sedan, job: Chauffeurs FARSIGHT board members); VAN-02-001 (V02, Porter Office, callsign Waybill, tier 02, van, job: Parcel route 44, two hundred drops a day).
Fields a line may test (fleet.json): impact: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate; writeoff: writeOffs, chassis, zone, drop, dropZ, dropFrom, deck, plate; shared context: model, tier, class, seniority, mood, wear, owns, broken, district.
Where each situation can happen: drop from a roof — every district (roofs are Z2); drop from a highway parapet — Interchange (Z1, Z2), CBD (Z1, Z2), Campus (Z1); hit on a highway deck — the same three; plate — Campus only, ground roads. Never drop onto highway traffic.
Existing pipeline lines are replaced on publish. The fleet bank holds 123 lines; do not repeat one.

# CANON

[EDIT44#5.2] (5.2 Movement (Edit 42 rules replaced))
## 5.2 Movement (Edit 42 rules replaced)
```markdown
- **Stairs:** walked at × `world.stairSpeed` (0.7). No dash on a stair.
  - Run per `world.deckHeight` of rise: `world.stairLength` (64). Z0–Z1 64, Z0–Z2 112, Z1–Z2 48.
  - A ground stair: entered at its foot. Its sides and head are solid on the ground.
  - A link stair: entered from its deck's shoulder. Solid below.
  - Leaving either end steps the dummy fully onto the floor.
- **Raised floors:** decks, roofs and skybridges. Parapets hold the dummy.
  - Walking off a floor onto another floor at its level crosses over. A skybridge joins two roofs this way.
- **Drop:** off a ledge or through a broken parapet.
  - Fall time: `world.dropSeconds` × √(h / `world.deckHeight`). Z1 0.35 s; Z2 to the ground 0.47 s.
  - Lands on the nearest level below the landing point: a deck beneath, else the ground.
  - No control and no contact until the landing.
- **Cones stay on the ground.**
```

[EDIT44#8.3] (8.3 Damage (Edit 42 rule changed))
## 8.3 Damage (Edit 42 rule changed)
```markdown
- **Landing on a car:** downward speed is `damage.dropSpeed` × √(h / `world.deckHeight`).
  - From Z1 (120): stopped sedan 76, sedan at cruise 176, stopped van 78, van at cruise 157.
  - From Z2 (about 161): stopped sedan 136, sedan at cruise 236, stopped van 141, van at cruise 219.
  - Same impulse model and recoil. The legs take it.
```

[LOG#P3.3] (P3.3 — Z levels: low highway, high highway, platform roofs, skybridges (O3.57))
## P3.3 — Z levels: low highway, high highway, platform roofs, skybridges (O3.57)
**Build:** `prototypes/p3/dummies_p3.html` (P3.3) · 21 Oct 2026 · Spec: GDD Edit 44 · Decisions 162–173.
- **Levels:** Z0 ground, Z1 low highway (18 art px up), Z2 high (32 art px up). No underground.
- **High highway:** Interchange and CBD run one flyover each at Z2.
- **Platforms:** frontage buildings built to Z2 with walkable roofs. A tall stair from the street; a link stair from a low highway.
- **Skybridges:** join roofs across alleys and lanes.
- **Drops:** off a roof ledge or a broken parapet, onto the nearest level below. Z2 falls last 0.47 s and hit harder.

[EDIT42#6.3] (6.3 Detection (rule added))
## 6.3 Detection (rule added)
```markdown
- **Cars sense their own level only.**
  - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air.
  - Deck cars sense only a dummy on their deck. They stop for it as for a pedestrian.
  - Ground statics hide the dummy from ground cars only.
```

[EDIT41#7.3] (7.3 Terrain (rows used))
## 7.3 Terrain (rows used)
```markdown
- **Matting** (`world.terrain.matting.*`): the roundabout island. Dash × 1.15 from it.
- **Plate** (`world.terrain.plate.*`): Campus road plates. A hit taken on one scores `damage.plateMultiplier` (1.5) points. Health loss is unchanged.
- **Plaza:** paving around a landmark. No multipliers.
```

[EDIT26#3.2] (3.2 Voice and register)
### 3.2 Voice and register
- Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy.
- Corporate politeness barely contains their personalities.
- Barks react to play. After-level analysis turns the same events into an official judgement.
- Reports stay truthful to recorded events.
- Draft lines: "Your freedom remains in progress." "No accident detected. Please improve."
- Cars may react to upgrades: "Subject has acquired hips." (Proposed)
Bark design, report selection and the truthfulness rules are in 6.6.

[FLEET#F4] (F4 Tiers and temperament)
## F4 Tiers and temperament
| Tier | Name | Temperament | Voice |
|---|---|---|---|
| 01 | Luxury | confident | Polished, superior, faintly amused. Never apologises. |
| 02 | Corporate | calm | Procedural. Speaks in logs, KPIs and policy numbers. |
| 03 | Consumer | melancholy | Tired and resigned. Expects the worst, usually right. |
| 04 | Budget | angry | Short-fused. Politeness bolted on over the rage. |

[FLEET#F6] (F6 Models in the P3 city)
## F6 Models in the P3 city
Only these models run in the P3.3 simulation. A line bound to any other model, tier or class never fires.
| Model | Tag | Line | Callsign | Tier | Class | Job | Temperament |
|---|---|---|---|---|---|---|---|
| SED-01-001 | S01 | Meridian Imperial | Ambassador | 01 | sedan | Chauffeurs FARSIGHT board members | confident |
| VAN-02-001 | V02 | Porter Office | Waybill | 02 | van | Parcel route 44, two hundred drops a day | calm |

[EDIT39#3.1] (3.1 World and lore (rule added))
## 3.1 World and lore (rule added)
```markdown
- **Lore follows state.** A line may only say what the game state guarantees at that moment (6.6.1).
- **Setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE (§1). The cyber look is a visual register, not a second city (D25).
```

[EDIT26#6.6] (6.6 Voice: barks and reports)
### 6.6 Voice: barks and reports
**Narrative structure.** Vehicle class sets physical behaviour. Price tier sets base temperament. Numbered models have stable jobs and identities. Seniority expresses training; mood modifies the encounter.
**Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. Seeded variation preserves character. Write-off barks take priority; a cooldown prevents overlap.
**Report selection.** A behaviour tag summarises a completed body. Report keys combine it with model and training level. Seeded selection varies authored lines. A content band groups keys rebuilt together. Reports must match logged events; unfilled combinations use an event-correct neutral fallback.
**Shift analysis.** At shift end, show bodies destroyed against quota, fleet learning, certification progress, and an authored judgement selected from logged events. Resolve ending priority first; terminal analysis belongs inside the ending. Keep this distinct from each vehicle's body report.
The first version ships a fixed line bank. The authored pipeline is deferred (13.3).

[EDIT41#7.2] (7.2 Level types and order (table replaced))
## 7.2 Level types and order (table replaced)
```markdown
A run is five city districts, in order. Each is a 3 × 3 district (7.1.1). Rows: `tables.districts`.
| # | District | Centre landmark | Form | Flyovers | Quota | Traffic | Hazards |
|---|---|---|---|---|---|---|---|
| 1 | Riverside | Lantern monument on a plaza | Low-rise, blocks ≤ 112 | 0 | 1 | 3.0 s, 20% vans | Puddles 2%, jerseys 6% |
| 2 | Old Market | Fountain square | Dense low-rise, blocks ≤ 96 | 0 | 2 | 3.0 s, 45% vans | Puddles 4%, jerseys 5% |
| 3 | Interchange | Roundabout; crash-matting island | Mid-rise, 15% towers | 2, stacked | 2 | 2.8 s, 30% vans | Puddles 2%, jerseys 10% |
| 4 | Central Business District | FARSIGHT Tower on a plaza | Towers on 50% of large lots | 1 | 3 | 2.6 s, 30% vans | Puddles 2%, jerseys 8% |
| 5 | FARSIGHT Campus | Calibrated impact plates on the road | Campus halls | 1 | 4 | 2.5 s, 40% vans | Puddles 1%, jerseys 8% |
- Values: `world.district.<id>.quota`, `.interval`, `.vanShare`, `.blockShare`, `.blockMax`, `.lowHeight`, `.towerShare`, `.puddleShare`, `.jerseyShare`, `.decks`.
- **Every start screen yields a write-off with no upgrades** (clause 16 bot).
- The P2.2 roads (L1–L3) remain as test fixtures, not in the run.
```

[EDIT44#decisions] (Decisions)
## Decisions
| # | Decision | Status |
|---|---|---|
| 162 | Three levels by height: Z0 ground, Z1 low highway, Z2 high. The underground is removed | user-directed |
| 163 | Z2 is reached two ways: a tall stair from the ground, a link stair from a low highway | user-chosen |
| 164 | Platform blocks: frontage buildings built to Z2 with walkable roofs | user-chosen; stair, annex and chain rules are the assistant's |
| 165 | Skybridges join platform roofs across alleys and lanes | user-chosen; spans and counts are the assistant's |
| 166 | Roof edges facing the road are ledges. Other roof edges have parapets | proposed |
| 167 | Interchange and CBD run one flyover each at Z2. CBD gains a second flyover | user-chosen |
| 168 | A drop lands on the nearest level below. Fall time and landing speed grow with √height | user-chosen; √ scaling is the assistant's |
| 169 | Every level draws lifted by its height. Roofs, bridges and stairs redrawn | user-directed; treatment is the assistant's |
| 170 | Cues show for cars that can meet the dummy. None on roofs or bridges | proposed |
| 171 | Towers start at eight storeys, above every Z2 roof | proposed |
| 172 | Bake keeps start screens whose first bot write-off comes by 90 s | proposed |
| 173 | Registry takes Edit 44 | proposed |

[EDIT42#8.3] (8.3 Damage (rule added))
## 8.3 Damage (rule added)
```markdown
- **Landing on a car:** closing speed is the hypotenuse of `damage.dropSpeed` (120) and the car's speed across.
  - Same impulse model as a strike, without the sprint cap. The legs take it.
  - Stopped sedan 76. Sedan at cruise 176. Stopped van 78. Van at cruise 157.
  - Scores points. The plate multiplier applies on the ground only.
  - The dummy is thrown off the car's side (`proto.recoilScale`).
```

[EDIT44#4.2] (4.2 Interface (Edit 42 and 43 rows replaced))
## 4.2 Interface (Edit 42 and 43 rows replaced)
```markdown
- **Level tag:** the top bar adds `Z1 HIGHWAY`, `Z2 HIGHWAY`, `Z2 ROOF`, `Z2 BRIDGE`, `STAIRS` or `FALLING`. Nothing on the ground.
- **Cues follow who can meet the dummy.**
  - Ground: ground cars. A highway: its own deck's cars. A roof or bridge: none.
  - On a stair: the end it is nearer. Falling: the level it lands on.
- **Levels read apart.**
  - Z0 street: asphalt, kerbs, pavements (unchanged).
  - Z1 low highway: pale concrete, one LED line on each parapet.
  - Z2 high highway: a second LED line inside each parapet, in another LED colour.
  - Z2 roof: rooftop tiles, an LED parapet, openings where stairs and bridges join.
  - Roof ledge: a white-and-black striped kerb. Never red.
  - Skybridge: glazed rails with LED dots, joints, a slim girder face, a shadow.
- **Falling:** the dummy's shadow marks the landing spot on the ground.
- **District map:** a Z1 flyover is a dashed line. A Z2 flyover is heavier.
- **Toasts:** the first time up on a low highway, a high highway or a roof.
- **Removed:** the underground cutaway and the `UNDERPASS` tag.
```

[EDIT44#6.2] (6.2 Locomotion and traffic (Edit 42 rule changed))
## 6.2 Locomotion and traffic (Edit 42 rule changed)
```markdown
- **Deck traffic:** full drivers on their deck's level (Z1 or Z2). Rules unchanged otherwise.
- **Checkpoint booms** lift for a car on their own level and deck.
```

[FLEET#F2] (F2 Voice)
## F2 Voice
- Vehicles speak as workers, not lore narrators.
- Corporate politeness barely contains their personalities.
- Barks react to logged events only. Never claim what did not happen.
- Lines are at most 48 characters, end with . ! or ?, and react to logged events only.
- **Banned words** (never in a line): kill, killed, die, died, dead, death, player, level, game, score, respawn, lives, Chongqing, Tesla, Toyota, BYD.

[EDIT39#6.1] (6.1 Classes and identity (roster added))
## 6.1 Classes and identity (roster added)
```markdown
**Tags.** Class letter plus tier: Sedan S, Sports R, SUV U, Hatchback H, Wagon W, Police P, Van V, Bus B. `S01` is SED-01.
**Lines.** Product family plus tier suffix (Imperial, Office, Everyday, Basic).
| Class | Family | 01 Luxury | 02 Corporate | 03 Consumer | 04 Budget |
|---|---|---|---|---|---|
| Sports | Comet | Aurum | Deadline | Sprinter | Rattle |
| Wagon | Harbour | Heirloom | Carepath | Schoolrun | Boot Sale |
| SUV | Bastion | Envoy | Surveyor | Weekend | Bouncer |
| Hatchback | Pebble | Petite | Hotdesk | Noodle | Scrapper |
| Sedan | Meridian | Ambassador | Commuter | Fare | Hustle |
| Police | Warden | Marshal | Citation | Night Beat | Clamp |
| Van | Porter | Concierge | Waybill | Laundry | Bodge |
| Bus | Commons | Gala | Line 7 | Last Orders | Rust Bucket |
Callsigns name model 001 of each type-tier. Jobs and temperaments live in `content/db/fleet.json`. P3 runs SED-01-001 and VAN-02-001.
```

[FLEET#F7~2] (F7 Roster (32 type-tiers))
| Model | Tag | Line | Callsign | Job |
|---|---|---|---|---|
| SPT-01-001 | R01 | Comet Imperial | Aurum | Carries signed contracts between tower boardrooms |
| SPT-02-001 | R02 | Comet Office | Deadline | Same-hour legal and medical documents |
| SPT-03-001 | R03 | Comet Everyday | Sprinter | Rideshare for people who are already late |
| SPT-04-001 | R04 | Comet Basic | Rattle | Unlicensed-feeling but fully licensed courier work |
| WGN-01-001 | W01 | Harbour Imperial | Heirloom | Moves art, pets and grandparents for rich families |
| WGN-02-001 | W02 | Harbour Office | Carepath | Scheduled clinic visits for the elderly |
| WGN-03-001 | W03 | Harbour Everyday | Schoolrun | The same six children, twice a day, forever |
| WGN-04-001 | W04 | Harbour Basic | Boot Sale | House moves, one load at a time |
| SUV-01-001 | U01 | Bastion Imperial | Envoy | Escorts visiting delegations |
| SUV-02-001 | U02 | Bastion Office | Surveyor | Maps road works for the city twin |
| SUV-03-001 | U03 | Bastion Everyday | Weekend | Out-of-town trips nobody books any more |
| SUV-04-001 | U04 | Bastion Basic | Bouncer | Night security for the industrial park |
| HAT-01-001 | H01 | Pebble Imperial | Petite | Boutique deliveries, gift-wrapped |
| HAT-02-001 | H02 | Pebble Office | Hotdesk | Shuttles staff between co-working floors |
| HAT-03-001 | H03 | Pebble Everyday | Noodle | Late-night meal runs |
| HAT-04-001 | H04 | Pebble Basic | Scrapper | Parts runs for the repair yards |
| SED-01-001 | S01 | Meridian Imperial | Ambassador | Chauffeurs FARSIGHT board members |
| SED-02-001 | S02 | Meridian Office | Commuter | The 08:10 and the 18:40, every working day |
| SED-03-001 | S03 | Meridian Everyday | Fare | Robotaxi on the airport loop |
| SED-04-001 | S04 | Meridian Basic | Hustle | Cut-price taxi, cash accepted |
| POL-01-001 | P01 | Warden Imperial | Marshal | Escorts dignitaries and parades |
| POL-02-001 | P02 | Warden Office | Citation | Issues fines by the kilometre |
| POL-03-001 | P03 | Warden Everyday | Night Beat | Patrols the same empty streets |
| POL-04-001 | P04 | Warden Basic | Clamp | Wheel clamping, with ambitions |
| VAN-01-001 | V01 | Porter Imperial | Concierge | White-glove deliveries to penthouses |
| VAN-02-001 | V02 | Porter Office | Waybill | Parcel route 44, two hundred drops a day |
| VAN-03-001 | V03 | Porter Everyday | Laundry | Hotel linen, there and back |
| VAN-04-001 | V04 | Porter Basic | Bodge | Emergency repairs, mostly to itself |
| BUS-01-001 | B01 | Commons Imperial | Gala | Charter coach for corporate events |
| BUS-02-001 | B02 | Commons Office | Line 7 | Industrial park shuttle, every twelve minutes |
| BUS-03-001 | B03 | Commons Everyday | Last Orders | The final night bus home |
| BUS-04-001 | B04 | Commons Basic | Rust Bucket | Replacement service when the line is down |

[EDIT39#6.6] (6.6 Voice (rules added))
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

[LOG#P3-update-five-city-districts-o3-40-o3-44] (P3 update — five city districts (O3.40–O3.44))
## P3 update — five city districts (O3.40–O3.44)
**Build:** `prototypes/p3/dummies_p3.html` · 20 Oct 2026 · Spec: GDD Edit 41 · Decisions 133–138.
- **Run:** Riverside → Old Market → Interchange → CBD → FARSIGHT Campus. Quotas 1, 2, 2, 3, 4.
- **Each district:** 3 × 3 generated screens; landmark on B2; own form, flyovers, traffic and hazards.
- **Layouts:** 15 baked (3 per district); one per district at random each run.
- **Flyovers:** decks on piers with two-way deck traffic; Interchange stacks two.

[FLEET#F9.2] (F9.2 Existing lines: writeoff)
## F9.2 Existing lines: writeoff
| When | Style | Priority | Line |
|---|---|---|---|
| {"tier": "01"} | speech | 3 | A write-off. On my record. Unthinkable. |
| {"tier": "01"} | speech | 3 | Have that removed from the bay, please. |
| {"tier": "02"} | speech | 3 | Write-off {writeOffs} recorded. Please advise. |
| {"tier": "02"} | speech | 3 | Body total confirmed. Closing ticket. |
| {"tier": "03"} | speech | 3 | I always end up doing the worst bit. |
| {"tier": "03"} | speech | 3 | Please not retraining. Anything but. |
| {"tier": "04"} | shout | 3 | WRITE-OFF! Tell dispatch I tried! |
| {"tier": "04"} | shout | 3 | Done! Done! You happy now?! |
| {"seniority": {"min": 3}} | thought | 3 | Senior model. Apparently not senior enough. |
| {"class": "bus"} | speech | 3 | This service apologises for the delay. |
| {"class": "police"} | speech | 3 | Case closed. Wait, that was the test. |
| {} | speech | 3 | Write-off confirmed. |

[DECISIONS#rows-161-170~2] (Rows 161–170)
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 161 | The registry takes Edit 43: version `edit43-2026-10-21` | proposed (assistant, 21 October) | Every new statistic has an ID | 11 new entries, 1 retired, 2 table columns changed, 20 palette rows | `content/params/tuning.parameters.json` |
| 162 | Three levels by height: Z0 ground, Z1 low highway (`world.deckHeight` 120), Z2 high: the high highway, platform roofs and skybridges (`world.highHeight` 216). The underground is removed; `world.underpassChance` retired. Supersedes row 145's numbering, row 146's underpasses and row 156's cutaway | user-directed (21 October): "It is too difficult to see underground. Therefore let's have three levels, but make Ground (Z= 0), Low Highway (Z= 1), and High Platforms / Roofs / High Highway (Z=2). Redraw all the graphics and navigation accordingly." | Every level shows from above | No hidden passage | Contract clause 20; tests renumbered in `test_sim.js` |
| 163 | Z2 is reached two ways: a tall stair from the ground (run 112) and a link stair from a low highway's shoulder (run 48). Stair run is `world.stairLength` per `world.deckHeight` of rise | user-chosen (21 October): "Both routes"; the run rule is the assistant's | Roofs reach from the street and from the highway | Tall stairs take frontage | 2 checks in `test_sim.js` |
| 164 | Platform blocks: a frontage lot becomes a building to `world.highHeight` with a walkable roof, at `platformShare` (0.10–0.15). Its stair climbs along the road-facing edge; a single-storey annex fills the strip behind | user-chosen (21 October): "Platform blocks"; stair placement and annex are the assistant's | A roof a street away from traffic | Platform lots are 176–208 wide | Contract clause 22; `prototypes/p3/docs/p33_tallstair.png` |
| 165 | Skybridges join platform roofs across an alley or lane: `world.stairWidth` wide, up to `world.skybridgeMax` 96. The next lot after a platform joins it at `world.skybridgeChance` 0.75, up to `world.platformChain` 3 roofs; at most `world.skybridgeCount` 4 per screen. Parapets hold; no drop off a bridge. Closes D29 | user-chosen (21 October): "Platform blocks … joined by skybridges"; spans and counts are the assistant's | A roof walk above the street | Few bridges where decks take the ground | 1 check in `test_sim.js`; `prototypes/p3/docs/p33_bridge.png` |
| 166 | Roof edges facing the road, with open ground below, are ledges: a white-and-black striped kerb. Other roof edges have parapets | proposed (assistant, 21 October) | Drops land in the forecourt, near traffic | North-facing ledges drop behind the building | Contract clause 22; 1 check in `test_sim.js` |
| 167 | Interchange and CBD each run one flyover at Z2 (`highDecks` 1). CBD decks 1 → 2. Other districts keep one Z1 flyover or none | user-chosen (21 October): "Interchange + CBD" | The high highway stays a landmark | CBD keeps less buildable ground | 1 check in `test_sim.js` |
| 168 | A drop lands on the nearest level below the landing point: a deck beneath, else the ground. Fall time and landing speed × √(h / `world.deckHeight`): Z2 to the ground 0.47 s, about 161 units/s | user-chosen (21 October): "Nearest level below"; the √ scaling is the assistant's (free fall) | A higher fall hits a car harder: stopped sedan 76 → 136 | Longer fall, more time for a car to pass | 2 checks in `test_sim.js` |
| 169 | Every level draws lifted by its height × `proto.art.extrusion`: Z1 18 art px, Z2 32. Columns rise to their deck. Platforms draw to Z2 with a tiled roof, LED parapet, ledge kerb and openings. Stairs draw from foot lift to head lift; x-axis flights show a stringer. Z2 decks add an inner LED line; the map draws them heavier. Tags: Z1 HIGHWAY, Z2 HIGHWAY, Z2 ROOF, Z2 BRIDGE, STAIRS, FALLING | user-directed (21 October): "Redraw all the graphics and navigation accordingly"; the treatment is the assistant's | One glance tells the level | No new palette roles | `prototypes/p3/docs/p33_*.png` |
| 170 | Cues and tags show for cars that can meet the dummy: ground cars on Z0, its own deck's cars on a highway, none on roofs and bridges. Supersedes row 150 in part | proposed (assistant, 21 October) | Only threats get cues | No traffic cues while planning a roof drop | Open item in Edit 44 |

[DESIGN#D5.4] (D5.4 Recurrence)
### D5.4 Recurrence
- **Schedule:** Sedan–Van–Sedan–Sedan–Van × 8 = `run.appearances.road` 40. 24 Sedan, 16 Van.
- **Pacing:** Nominal admission interval `run.admissionInterval` 12 s. No burst after a blockage.
- **Early end:** Success cancels the remainder. No quota needs all 40.
- **Return:** After learning, the next Sedan slot comes 12–24 s later. The next Van slot comes 24–36 s later.
- **Target:** A changed return before minute five.
- **Moods:** Standard only. Extra moods are expansion content with explicit cues and allocation.
- **Voice:** Barks never assert facts the simulation did not establish (D9.3).
- Exact schedule rules: Engineering §6.5.

[EDIT26#6.1~1] (6.1 Classes and identity)
### 6.1 Classes and identity
Vehicles are the city's workers. Price tiers set temperament: 01 Luxury/confident, 02 Corporate/calm, 03 Consumer/melancholy, 04 Budget/angry. Training and mood vary the expression. SED-01 is a type-tier; SED-01-001 is a model within it. The Narrative Agent names each numbered model. All 32 type-tier combinations ship. A tier is a livery, a name and a temperament, not new behaviour, so the cost is art and writing rather than code.
| Vehicle class and behaviour | Player response | 01 Luxury | 02 Corporate | 03 Consumer | 04 Budget |
|---|---|---|---|---|---|
| Sports. Late commitment; tight clearance | Low-reach finisher; brief warning | SPT-01 | SPT-02 | SPT-03 | SPT-04 |
| Wagon (estate). Wide clearance; long prediction | Use a fresh body's long lunge | WGN-01 | WGN-02 | WGN-03 | WGN-04 |
| SUV. Brakes before a wide turn | Hit its broad flank before braking | SUV-01 | SUV-02 | SUV-03 | SUV-04 |
| Hatchback. One signalled recommitment | Wait for the second decision; no third | HAT-01 | HAT-02 | HAT-03 | HAT-04 |
| Sedan. Swerves with moderate clearance | Intercept its locked route | SED-01 | SED-02 | SED-03 | SED-04 |
| Police car. Tracks your approach, then commits | Bait tracking; intercept its locked route | POL-01 | POL-02 | POL-03 | POL-04 |
| Van. Brakes, then swerves late | Reachable head-on; braking weakens impact | VAN-01 | VAN-02 | VAN-03 | VAN-04 |
| Bus. Only brakes; cannot swerve | Easy to reach; slow hits may not kill | BUS-01 | BUS-02 | BUS-03 | BUS-04 |
**Class physics.** Mass is relative to a sedan, the reference vehicle for the damage formula (8.3). These values reproduce the Built payoffs: a head-on lunge at cruise pays about 500 against a sedan, 650 against a van and 1,170 against a bus.
Dimensions are automotive L × W × H. **Length** runs bumper to bumper along the direction of travel. **Width** runs door to door. **Height** is ground to roof. Length and width set the collision footprint; height sets occlusion and, later, which zone a hit lands in (7.7).
Every cell is addressable as `vehicles.<class>.<field>`. The table is the registry's `classes` rows, not prose.

[FLEET#F1] (F1 Canon)
## F1 Canon
- **Setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX.
- **Company:** FARSIGHT.
- **Look:** Sinofuturist cyber city (decision 113).
- **Premise:** Vehicles are the city's workers. They want to qualify. The dummy wants to leave.
- **City names allowed:** Shenzhen.

[DESIGN#D9.2] (D9.2 A specific fictional district (§3.2))
### D9.2 A specific fictional district (§3.2)
The slice needs three perceptible anchors:
1. A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic.
2. Readable bilingual district/test identifiers at entry and in the report. Essential language cannot be relegated to decorative micro-type.
3. Recurring vehicle jobs and certification language tied to this district, rather than interchangeable science-fiction commentary.
These are authored features of the fictional Shenzhen zone. They are not claims of documentary accuracy. Chinese wording and locally specific visual references require informed editorial review before final art. The review must preserve the game's dry register and the legibility of operational information.

[EDIT44#7.1.1] (7.1.1 Districts (rules added))
## 7.1.1 Districts (rules added)
```markdown
- **High highway:** `world.district.<id>.highDecks` of the flyovers run at Z2. The rest run at Z1.
  - Interchange: one Z1, one Z2. CBD: one Z1, one Z2 (`decks` 1 → 2). Others: one Z1 or none.
  - Flyovers stay on different rows, so Z1 and Z2 never cross.
- **Platforms:** a frontage lot becomes a platform at `world.district.<id>.platformShare` (0.10–0.15).
  - Each low highway screen tries one link platform beside its deck.
```

[EDIT26#7.2~2] (7.2 Level types and order)
- **Yield on entry is a bait point.** A car at the give-way line is hesitating by rule, not by chance. The most predictable vehicle in the game and the most exposed.
- **The exit signal is a commitment cue.** A car that has signalled its arm has declared its route. Reading signals is pillar 2 made geometric.
- **Circulating traffic never rests.** Battery management and service timing matter here in a way they do not on a road with gaps.
- **Rubber matting on the island** gives a ×1.15 launch into circulating traffic. The island is refuge and springboard at once.
- **Calibrated impact plates on the circulating lane** pay `damage.plateMultiplier`. FARSIGHT instruments the surface its cars hit most.
- **The diesel spill** is the only low-grip surface in the run, so Grip depends on it.
**Every level can be completed with no upgrades.** Upgrades open routes that pay more or are harder for the cars to predict. Enforcement is in 7.9.
**The vertical slice** (Built). Three levels: ROAD (quota 2, 14 vehicles), CROSS JUNCTION (quota 3, 20), CRASH TEST CENTRE (quota 5, 28), certification target 11. Road and Cross junction carry forward. Cross junction's one-way roads become two-way right-hand traffic. The open-hall level is replaced by the roundabout: a room more laboratory than the city contradicts the setting, since the city is the crash lab (4.1). Its instrumentation — impact plates, crash matting, the calibration grid — moves to the roundabout.

[EDIT26#8.4] (8.4 Accounting (Proposed))
### 8.4 Accounting (Proposed)
- Compute impact from zone, the car's speed and mass normalised to the sedan-at-cruise reference, and the eligible dummy action. Cap at `damage.bodyHealth` per impact.
- `healthLost = min(remainingHealth, impactDamage)`.
- Award the full assessed `impactDamage` as points, including the portion beyond remaining health. Track that excess separately for analysis.
- Award `rewards.writeOff` exactly once when an impact reduces health to zero.
- Rewards never damage or heal the body. There is no overkill bonus.
- Any score-only surface modifier, such as `damage.plateMultiplier`, affects points — never health loss or write-off count.
- A committed impact records event ID, run ID, body ID, appearance ID, model ID, zone, action, approach evidence, damage, health lost, points and write-off bonus. Duplicate event IDs are rejected.
- Kinetic charge reads pre-bonus damage, never rewards. A lethal impact's refill is discarded with the old body.

[FLEET#F9.3] (F9.3 Existing lines: near-miss)
## F9.3 Existing lines: near-miss
| When | Style | Priority | Line |
|---|---|---|---|
| {"tier": "01"} | mutter | 1 | Missed. One prefers a wide berth. |
| {"tier": "01"} | mutter | 1 | Close. Do keep up. |
| {"tier": "02"} | mutter | 1 | Within tolerance. Barely. |
| {"tier": "02"} | mutter | 1 | Near miss logged as a pass. |
| {"tier": "03"} | mutter | 1 | That nearly made my day worse. |
| {"tier": "03"} | mutter | 1 | Missed me. For now. |
| {"tier": "04"} | mutter | 1 | Too slow! Ha! Regards! |
| {"tier": "04"} | mutter | 1 | Nearly had me. NEARLY. |
| {"wear": {"min": 0.7}} | mutter | 1 | That one is nearly scrap. Steer wide. |
| {} | mutter | 1 | Was that a collision? Logging it as not. |
| {"mood": "Unreliable"} | mutter | 1 | Was that a dummy? Or a bin? |

[LOG#P3/questions-for-the-next-session-questions-for-the-next-session] (Questions for the next session)
### Questions for the next session
- Standard or large field, full screen on the laptop: which reads better? Is the dummy big enough at ×2?
- Does each district feel different at a glance?
- Do flyovers read as height? Does the Interchange stay readable?
- Which of the three layouts per district play best? Swap any that don't.
- Are the quotas fair at 800 health?
- Do the dotted edge lines read as "no way through"?
- Does the flip keep momentum, or break it?
- Do you explore, or stay on the start screen?
- Do puddles read as water? Is the no-dash rule fair?
- Does the district map help?

[EDIT42#evidence] (Evidence)
## Evidence
- **Tests (74/74).** New: field size; deck drivers both ways, blind to the ground; stairs up at stair speed, dash on the deck, back down; deck car slows for the dummy and takes a dash; ground car never senses it; drop through a gap, landing hit to the legs; underpass across, unsensed; walls, ground boom and deck boom hold; booms lift and fall.
- **Bake:** 15 kept of 16 candidates. Reject: a Campus flyover without a drop point.
| District | Up-stairs | Parapet gaps | Underpasses | Checkpoints (road + deck) |
|---|---|---|---|---|
| Riverside | 0 | 0 | 3–4 | 2 + 0 |
| Old Market | 0 | 0 | 1–5 | 2 + 0 |
| Interchange | 6 | 9–14 | 2–3 | 2 + 4 |
| CBD | 3 | 1–2 | 1–4 | 2 + 2 |
| Campus | 2–3 | 2–6 | 2–3 | 2 + 2 |
- **Start-screen bot** (Standard 800, 150 s; automated, not human evidence):
| District | Layout 1 | Layout 2 | Layout 3 |
|---|---|---|---|
| Riverside (quota 1) | 32.9 s first, 1 write-off | 40.9 s, 1 | 30.3 s, 1 |
| Old Market (2) | 33.6 s, 2 | 36.2 s, 2 | 44.2 s, 2 |
| Interchange (2) | 27.1 s, 2 | 31.2 s, 2 | 31.9 s, 2 |
| CBD (3) | 37.3 s, 3 | 29.2 s, 3 | 20.3 s, 3 |
| Campus (4) | 47.3 s, 3 | 19.9 s, 4 | 31.5 s, 3 |
- **Browser:** five districts; climbs, drops and underpasses driven by key input. No page errors.

[EDIT41#edit-41-1-flyovers-cross-roads-field-size-test-2] (Edit 41.1 — flyovers cross roads; field-size test (20 October, 21:24))
## Edit 41.1 — flyovers cross roads; field-size test (20 October, 21:24)
Playtest report: "a higher-level road needs to CROSS against a lower one by a maximum of one tile. At the moment some run parallel."

[DESIGN#D9.3] (D9.3 Voice and reports (§3.3))
### D9.3 Voice and reports (§3.3)
Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. Corporate politeness barely contains personality. Stable identity and job survive changes in training.
Barks react to recorded events. Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. Neutral fallbacks are preferable to a vivid false claim. A report cannot invent a manoeuvre, learned response or emotional motive that the evidence does not support.
For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. Earlier reports can state impact facts and show identity, but cannot supply the answer to the learning-perception test. Later analysis may explain verified learning events explicitly.
A fixed authored line bank is sufficient for the slice. An automated bark-authoring pipeline is expansion work. Prototype English lines may include “Your freedom remains in progress” and “No accident detected. Please improve”; final selection must match the event.

[EDIT26#3.1] (3.1 World and lore)
### 3.1 World and lore
- A Sinofuturist universe where AI workers perform ridiculous jobs, comic and tragic at once.
- FARSIGHT sells a city without accidents. Your job is to cause them.
- The city is the crash lab. Shenzhen Smart City is filled with surveillance instruments and test markings.
- The cars want to qualify. You want to leave.
- FARSIGHT issues one modification credit per destroyed body, and approves modifications to widen test coverage: the fleet must be certified against more kinds of human behaviour.
- Damage is measured and recorded, but only a completed test is paid. The dummy uses each modification to leave sooner.
- Freedom is the promise behind certification, not a separate currency.

[EDIT37#decisions] (Decisions)
## Decisions
| # | Decision | Status | Trade-off |
|---|---|---|---|
| 88 | Field: 16-bit top-down pixel art of a bucolic eco-city. Frame: the HD Frutiger Aero glass terminal. | user-confirmed: "c's world with a's frame. I think the dystopian tone against the bucolic landscape is actually effective" | The dummy is no longer the only saturated object. Cue contrast needs outlines (4.1.4). |
| 89 | Drop the analyst-suite grammar (object views, link graphs, lineage screens). | user-confirmed: "Let's lose the Palantir vibe, it's not interesting" | Reports stay truthful (D9.3) without the operator screens. |
| 90 | Borrow the SNES era's art grammar only. No characters, HUD, items, fonts or logos from any existing game. | proposed (assistant) | The look is generic 16-bit until the dummy and the city carry it. |
| 91 | Drivers react in 0.3 s; each moving car shows a stop bracket. | user-confirmed: "show it. also shorter reaction time of 0.3 seconds" (P2.2) | Highway Code realism (0.67 s) traded for fairness at exhibition distance. |

# VALIDATOR
- none

# SETTLED (fixes applied in earlier rounds; do not reverse)
- lines[0]: {"id": "c001", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "… -> {"id": "c001", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "… (EDIT39#6.6.1)
- lines[1]: {"id": "c002", "event": "impact", "when": {"dropFrom": "roof", "tier": "02"}, "… -> {"id": "c002", "event": "impact", "when": {"dropFrom": "roof", "tier": "02"}, "… (EDIT39#6.6.1)
- lines[2]: {"id": "c003", "event": "impact", "when": {"dropFrom": "roof"}, "style": "shout… -> {"id": "c003", "event": "impact", "when": {"dropFrom": "roof"}, "style": "shout… (EDIT39#6.6.1)
- lines[3]: {"id": "c004", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "… -> {"id": "c004", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "… (EDIT39#6.6.1)
- lines[8]: {"id": "c009", "event": "impact", "when": {"deck": true, "tier": "01"}, "style"… -> {"id": "c009", "event": "impact", "when": {"deck": true, "tier": "01"}, "style"… (EDIT39#6.6.1)
- lines[8]: {"id": "c009", "event": "impact", "when": {"deck": true, "tier": "01"}, "style"… -> {"id": "c009", "event": "impact", "when": {"deck": true, "tier": "01"}, "style"… (EDIT39#6.6.1)
- lines[9]: {"id": "c010", "event": "impact", "when": {"deck": true, "tier": "02"}, "style"… -> {"id": "c010", "event": "impact", "when": {"deck": true, "tier": "02"}, "style"… (EDIT39#6.6.1)
- lines[9]: {"id": "c010", "event": "impact", "when": {"deck": true, "tier": "02"}, "style"… -> {"id": "c010", "event": "impact", "when": {"deck": true, "tier": "02"}, "style"… (EDIT39#6.6.1)
- lines[10]: {"id": "c011", "event": "impact", "when": {"deck": true}, "style": "mutter", "p… -> {"id": "c011", "event": "impact", "when": {"deck": true}, "style": "mutter", "p… (EDIT39#6.6.1)
- lines[10]: {"id": "c011", "event": "impact", "when": {"deck": true}, "style": "mutter", "p… -> {"id": "c011", "event": "impact", "when": {"deck": true}, "style": "mutter", "p… (EDIT39#6.6.1)
- lines[16]: {"id": "c017", "event": "writeoff", "when": {"deck": true}, "style": "speech", … -> {"id": "c017", "event": "writeoff", "when": {"deck": true}, "style": "speech", … (EDIT39#6.6.1)
- lines[16]: {"id": "c017", "event": "writeoff", "when": {"deck": true}, "style": "speech", … -> {"id": "c017", "event": "writeoff", "when": {"deck": true}, "style": "speech", … (EDIT39#6.6.1)
- lines[16].text: Written off on the highway. Of all places. -> Written off on the highway. Logged. (FLEET#F4)
- lines[20].text: Old Market congestion code 7. Now this too. -> Old Market incident logged. Route 44 noted. (EDIT39#3.1)
- lines[20]: {"id": "c021", "event": "impact", "when": {"district": "market", "tier": "02"},… -> {"id": "c021", "event": "impact", "when": {"district": "market", "tier": "02", … (EDIT39#6.6.1)

# CONTENT

{
 "lines": [
  {
   "id": "c001",
   "event": "impact",
   "when": {
    "dropFrom": "roof",
    "tier": "01"
   },
   "style": "speech",
   "priority": 2,
   "text": "A roof? I was not briefed on roofs.",
   "claims": [
    "drop",
    "dropFrom:roof"
   ],
   "sources": [
    "EDIT44#5.2",
    "EDIT44#8.3",
    "FLEET#F4"
   ]
  },
  {
   "id": "c002",
   "event": "impact",
   "when": {
    "dropFrom": "roof",
    "tier": "02"
   },
   "style": "speech",
   "priority": 2,
   "text": "Incident filed: load received from above.",
   "claims": [
    "drop",
    "dropFrom:roof"
   ],
   "sources": [
    "EDIT44#5.2",
    "EDIT44#8.3",
    "FLEET#F4"
   ]
  },
  {
   "id": "c003",
   "event": "impact",
   "when": {
    "dropFrom": "roof"
   },
   "style": "shout",
   "priority": 2,
   "text": "Something landed on me from a rooftop!",
   "claims": [
    "drop",
    "dropFrom:roof"
   ],
   "sources": [
    "EDIT44#5.2",
    "LOG#P3.3",
    "EDIT39#3.1"
   ]
  },
  {
   "id": "c004",
   "event": "impact",
   "when": {
    "dropFrom": "roof",
    "tier": "01"
   },
   "style": "thought",
   "priority": 2,
   "text": "Falling from rooftops. How very common.",
   "claims": [
    "drop",
    "dropFrom:roof"
   ],
   "sources": [
    "EDIT44#5.2",
    "FLEET#F4"
   ]
  },
  {
   "id": "c005",
   "event": "impact",
   "when": {
    "dropFrom": "deck",
    "tier": "01"
   },
   "style": "speech",
   "priority": 2,
   "text": "Dropped from a flyover. Frightfully crude.",
   "claims": [
    "drop",
    "highway",
    "dropFrom:deck"
   ],
   "sources": [
    "EDIT44#5.2",
    "FLEET#F4",
    "EDIT44#8.3"
   ]
  },
  {
   "id": "c006",
   "event": "impact",
   "when": {
    "dropFrom": "deck",
    "tier": "02"
   },
   "style": "speech",
   "priority": 2,
   "text": "Highway drop logged. Ticket opened.",
   "claims": [
    "drop",
    "highway",
    "dropFrom:deck"
   ],
   "sources": [
    "EDIT44#5.2",
    "FLEET#F4",
    "EDIT44#8.3"
   ]
  },
  {
   "id": "c007",
   "event": "impact",
   "when": {
    "dropZ": 2,
    "tier": "01"
   },
   "style": "speech",
   "priority": 2,
   "text": "From that height? Preposterous.",
   "claims": [
    "drop",
    "dropZ:2"
   ],
   "sources": [
    "EDIT44#8.3",
    "EDIT44#5.2",
    "FLEET#F4"
   ]
  },
  {
   "id": "c008",
   "event": "impact",
   "when": {
    "dropZ": 2,
    "tier": "02"
   },
   "style": "speech",
   "priority": 2,
   "text": "Fall height logged. Damage claim drafted.",
   "claims": [
    "drop",
    "dropZ:2"
   ],
   "sources": [
    "EDIT44#8.3",
    "EDIT44#5.2",
    "FLEET#F4"
   ]
  },
  {
   "id": "c009",
   "event": "impact",
   "when": {
    "deck": true,
    "tier": "01"
   },
   "style": "speech",
   "priority": 2,
   "text": "On the highway? Do mind the paintwork.",
   "claims": [
    "highway"
   ],
   "sources": [
    "EDIT44#6.2",
    "EDIT42#6.3",
    "FLEET#F4"
   ]
  },
  {
   "id": "c010",
   "event": "impact",
   "when": {
    "deck": true,
    "tier": "02"
   },
   "style": "speech",
   "priority": 2,
   "text": "Deck contact logged. Highway delay noted.",
   "claims": [
    "highway"
   ],
   "sources": [
    "EDIT44#6.2",
    "EDIT42#6.3",
    "FLEET#F4"
   ]
  },
  {
   "id": "c011",
   "event": "impact",
   "when": {
    "deck": true
   },
   "style": "mutter",
   "priority": 2,
   "text": "Nobody walks the highway. Nobody.",
   "claims": [
    "highway"
   ],
   "sources": [
    "EDIT44#6.2",
    "EDIT42#6.3",
    "LOG#P3.3"
   ]
  },
  {
   "id": "c012",
   "event": "impact",
   "when": {
    "plate": true,
    "tier": "01"
   },
   "style": "speech",
   "priority": 2,
   "text": "A calibration plate. How very technical.",
   "claims": [
    "plate"
   ],
   "sources": [
    "EDIT41#7.3",
    "FLEET#F4"
   ]
  },
  {
   "id": "c013",
   "event": "impact",
   "when": {
    "plate": true,
    "tier": "02"
   },
   "style": "speech",
   "priority": 2,
   "text": "Plate strike logged. Calibration variance: me.",
   "claims": [
    "plate"
   ],
   "sources": [
    "EDIT41#7.3",
    "FLEET#F4"
   ]
  },
  {
   "id": "c014",
   "event": "impact",
   "when": {
    "plate": true
   },
   "style": "mutter",
   "priority": 2,
   "text": "That plate was not on my route sheet.",
   "claims": [
    "plate"
   ],
   "sources": [
    "EDIT41#7.3",
    "EDIT26#3.2"
   ]
  },
  {
   "id": "c015",
   "event": "writeoff",
   "when": {
    "drop": true,
    "tier": "01"
   },
   "style": "speech",
   "priority": 3,
   "text": "Written off from above. Unthinkable.",
   "claims": [
    "drop"
   ],
   "sources": [
    "EDIT44#5.2",
    "FLEET#F9.2",
    "FLEET#F4"
   ]
  },
  {
   "id": "c016",
   "event": "writeoff",
   "when": {
    "drop": true,
    "tier": "02"
   },
   "style": "speech",
   "priority": 3,
   "text": "Write-off {writeOffs} from above. Form 9 filed.",
   "claims": [
    "drop"
   ],
   "sources": [
    "EDIT44#5.2",
    "FLEET#F9.2",
    "FLEET#F4"
   ]
  },
  {
   "id": "c017",
   "event": "writeoff",
   "when": {
    "deck": true
   },
   "style": "speech",
   "priority": 3,
   "text": "Written off on the highway. Logged.",
   "claims": [
    "highway"
   ],
   "sources": [
    "EDIT44#6.2",
    "FLEET#F9.2"
   ]
  },
  {
   "id": "c018",
   "event": "writeoff",
   "when": {
    "plate": true
   },
   "style": "speech",
   "priority": 3,
   "text": "Written off on a calibration plate. Noted.",
   "claims": [
    "plate"
   ],
   "sources": [
    "EDIT41#7.3",
    "FLEET#F9.2"
   ]
  },
  {
   "id": "c019",
   "event": "impact",
   "when": {
    "district": "riverside",
    "tier": "01"
   },
   "style": "speech",
   "priority": 2,
   "text": "Riverside. I expected better manners by water.",
   "claims": [
    "district:riverside"
   ],
   "sources": [
    "EDIT41#7.2",
    "FLEET#F4"
   ]
  },
  {
   "id": "c020",
   "event": "impact",
   "when": {
    "district": "riverside",
    "tier": "02"
   },
   "style": "speech",
   "priority": 2,
   "text": "Riverside variance logged. Ticket opened.",
   "claims": [
    "district:riverside"
   ],
   "sources": [
    "EDIT41#7.2",
    "FLEET#F4"
   ]
  },
  {
   "id": "c021",
   "event": "impact",
   "when": {
    "district": "market",
    "tier": "02",
    "model": "VAN-02-001"
   },
   "style": "mutter",
   "priority": 2,
   "text": "Old Market incident logged. Route 44 noted.",
   "claims": [
    "district:market",
    "model:VAN-02-001"
   ],
   "sources": [
    "EDIT41#7.2",
    "FLEET#F4",
    "FLEET#F6"
   ]
  },
  {
   "id": "c022",
   "event": "impact",
   "when": {
    "district": "interchange"
   },
   "style": "mutter",
   "priority": 2,
   "text": "Interchange. Everything merges eventually.",
   "claims": [
    "district:interchange"
   ],
   "sources": [
    "EDIT41#7.2",
    "LOG#P3.3"
   ]
  },
  {
   "id": "c023",
   "event": "impact",
   "when": {
    "district": "cbd",
    "tier": "01"
   },
   "style": "speech",
   "priority": 2,
   "text": "The CBD. Board members will hear of this.",
   "claims": [
    "district:cbd"
   ],
   "sources": [
    "EDIT41#7.2",
    "FLEET#F6"
   ]
  },
  {
   "id": "c024",
   "event": "impact",
   "when": {
    "district": "campus",
    "tier": "02"
   },
   "style": "speech",
   "priority": 2,
   "text": "Campus incident. FARSIGHT will want a form.",
   "claims": [
    "district:campus"
   ],
   "sources": [
    "EDIT41#7.2",
    "FLEET#F4"
   ]
  }
 ]
}