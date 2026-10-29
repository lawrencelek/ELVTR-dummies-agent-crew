# DUMMIES — GDD Edit 92: Prototype 7.11. Narrative A, Certified; tile names; the story's tile art

**28 October 2026 · Lawrence Lek** · Chooses Narrative A from the three-act proposal (D74). Amends `content/story/story.json` (acts, titles, tales, ending) and GDD Edit 91 §3 (world art). Builds: `prototypes/p7/dummies_p7_11.html`. Prototypes 7 to 7.10 stay frozen.

- **Request (user, 28 October):**
  - "I choose Narrative A - Certified."
  - "Update the GDD for this too. Update the tile names, and tile assets (cosmetic only without changing gameplay interaction elements)."
- **Readings flagged:**
  - "Cosmetic only": pixels on sprites already placed, flat marks on the ground, and props that are never solid. Checked: every solid, floor, stair, spawn and cone home is unchanged.
  - Parkland's visitors and Chassis 0 are written, not drawn. Figures in play would read as targets or obstacles.
  - The finale sequence is specified here but not built; the ending screen carries its words (D76).
- **Registry:** `edit92-2026-10-28` (505 entries). 1 ID added.
- **Decision rows:** 520–525. D74, D75 closed. D76 raised.

## 3 Story: Narrative A, Certified (replaces the proposal)

```markdown
- **Logline:** a dummy sits the longest job interview in the world. Passing means being shipped.
- **Tone:** dry corporate comedy. Farsight narrates. You are the product under test.
- **Voice:** polite, procedural, dry. No exclamation marks. Cars are colleagues; briefs are duties; parts are equipment.
- **Act I · Monument · INDUCTION:** off the factory floor; Farsight greets you as new staff.
  - Turn (C3): the gateway thanks a car for driving safely, seconds after it wrote you off. ROLE: DESTRUCTIVE TESTING.
- **Act II · Parkland · OPENING DAY:** the Expo opens when the park passes. Nine tiles, nine days. Visitors are booked.
  - Turn (B2): the board applauds the cars. "The public prefers the product to the test."
- **Act III · Waterfront · CUSTOMS:** the river is a border; ships wait beyond it.
  - The customs log (A3): ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION.
  - The circus (B2): the monument, cast from every chassis you lost. ZERO ACCIDENTS (EXCLUDING TESTS).
- **Delivery (built):** the act line on each district's first card and at the head of every card; the map's act numerals (I, II, III); 27 tales; the ending.
```

## 3.1 The 27 tiles

| # | Tile | Title | Brief | Part | Tale |
|---|---|---|---|---|---|
| 1 | Monument A1 | The welcome wall | Any | — | A conveyor sets you down beside a tower. Its screen shows your face and the word WELCOME. Farsight is pleased to have you. Your first duty is simple: stand in the road until a colleague notices you. |
| 2 | Monument B1 | The podium bridge | Drop | Battery 1 | Your first equipment has arrived: a battery, for the dash. The skybridge was built for shoppers who never came; it now serves as an observation deck for staff. Observe a car from above, then join it. |
| 3 | Monument C1 | The LED drum | Jump | Legs 1 | The drum lights each bend before a car reaches it, so no colleague is ever surprised. Today you will surprise one. Legs 1 is fitted for the purpose. Your enthusiasm will be noted in your file. |
| 4 | Monument C2 | The portal tower | Raised road | — | The high road runs through this tower at the sixth floor. The tenants say the traffic is good company. Today your duty is on the road itself, at height. The view is not part of the job. |
| 5 | Monument B2 | The monument | Struck | — | The plaque reads ZERO ACCIDENTS. New staff ask whether this is a record. It is a target. Stand near it and let a colleague find you. Walking is permitted. Dashing would spoil the data. |
| 6 | Monument A2 | The neon shops | Cone | Hands 1 | The shops under the highway sell nothing. Their signs flash prices at the traffic, which reads every word. Hands 1 is fitted, so you can place a cone. Colleagues are trained to respect cones. Use this. |
| 7 | Monument A3 | The stacked cubes | Combo ×2 | — | Each cube was added as the budget arrived, one quarter at a time, each leaning further than the last. Farsight calls this growth. Today's duty is the same: one hit, then another before the first is forgotten. |
| 8 | Monument B3 | The LED canyon | Jump | — | Two screens face each other across the road and advertise to each other all night. The skybridge was added so that someone would watch. You are now someone. Jump into a car between the screens. |
| 9 | Monument C3 | The LED gateway | Push | Arms 1 | The gateway thanks every car for driving safely. It thanked the last one seconds after that car wrote you off. Your file is updated: ROLE: DESTRUCTIVE TESTING. Arms 1 is fitted. Push off one colleague into the next. |
| 10 | Parkland C1 | The lantern pavilion | Drop | Battery 2 | The paper lantern was the Expo's first exhibit, and it is lit again for the visitors. Battery 2 is fitted: a second charge. Farsight calls it safety equipment. Drop onto a car from the footbridge. |
| 11 | Parkland C2 | The amphitheatre | Van | — | Farsight's board will watch from these terraces on opening day. The seats face the avenue, so every crossing is a performance. A van delivers the catering. Arrange for it to deliver you. |
| 12 | Parkland C3 | The arch and the roundabout | Thrown | — | The arch is the Expo's gate. Visitors will circle the roundabout once before they enter, which gives the cars time to learn them. You go round faster. Be thrown into a car while the last one still throws you. |
| 13 | Parkland B3 | The obelisk court | Police | — | The obelisk marks the surveyors' first stake. A school party will visit it on opening day, escorted by the police fleet. Farsight would like to know how the police fleet handles a dummy first. |
| 14 | Parkland A3 | The belvedere | Jump | Legs 2 | A wedding is booked on the belvedere for opening day. The couple asked for a view of the traffic. Legs 2 is fitted: longer in the air. Land on a car here, so that no guest ever does. |
| 15 | Parkland A2 | The dome by the canal | Raised road | — | The dome is the Expo's showroom. The canal beside it cools the highway's footings; the ducks are registered volunteers. On opening day the visitors will look up at the highway. Be on it. |
| 16 | Parkland A1 | The reservoir terraces | Push | Arms 2 | The gardener keeps the three pools level by hand. She has asked that the cars learn to stop before the water. Arms 2 is fitted: a stronger push. Teach them by hitting one car into the next. |
| 17 | Parkland B1 | The cascade | Cone | Hands 2 | The cascade steps the reservoir's water down beside the highway, pool by pool. It was built to drown out the traffic. Hands 2 is fitted: two cones. Lay them where the visitors will walk, and see who stops. |
| 18 | Parkland B2 | The ring over the pools | Combo ×3 | — | Inspection day. The board watches the ring. When the cars come round clean, the board applauds the cars. Farsight notes that the public prefers the product to the test. Give the board a chain of three. |
| 19 | Waterfront A1 | The west portal | Bus | Battery 3 | The upper town houses the engineers, and the bus carries them to the bridge. Battery 3 is fitted: a faster recharge. Farsight requires the bus fleet's data before anyone crosses the river. |
| 20 | Waterfront B1 | The tunnel portal | Jump | Legs 3 | The tunnel runs north under the hill to the next valley. Cars go in. Data comes back. Legs 3 is fitted: the longest flight. Where your data goes after the tunnel is not within your role. |
| 21 | Waterfront C1 | The east portal | Police | — | The east bridge was built a year after the west, to correct its mistakes. Its portal block faces the other way and pretends not to know its twin. The police here check papers. Yours are being prepared. |
| 22 | Waterfront C2 | The east beach terrace | Drop | — | The terrace was built for tourists, then joggers, then sensors. From its rail you can see the ships in the estuary and the cranes that load them. Drop onto a car below. The ships will wait. |
| 23 | Waterfront C3 | The east customs post | Thrown | — | The pier tower is a customs post. It logs everything that floats on the river: containers, ducks and, so far, one dummy, inbound. Be thrown into a car. Customs is watching. |
| 24 | Waterfront B3 | The stilt houses | Push | Arms 3 | The stilt houses are older than the city, kept as heritage. Behind glass in one of them stands Chassis 0, the prototype before you. A ship is moored beyond. Arms 3 is fitted. Show Chassis 0 how far the model has come. |
| 25 | Waterfront A3 | The west customs post | Raised road | — | The west tower keeps the customs log. Your entry reads ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. You were shipped here to be tested. Honour the declaration on the raised road. |
| 26 | Waterfront A2 | The west beach terrace | Cone | — | The valley began here: a cliff, an avenue, and a beach of sand brought from three provinces. The ceremony is being prepared in the circus. Place a cone. Farsight would like one more clean reading before the speeches. |
| 27 | Waterfront B2 | The circus | Combo ×3 | — | Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). One last chain of three certifies the city. And you. |

- **Renamed (D75):** Monument A1 The LED wall → The welcome wall; A2 The neon arcade → The neon shops; Parkland A2 The canal → The dome by the canal; Waterfront C3, A3 The east, west pier tower → The east, west customs post.
- **Briefs, parts, write-offs, order:** unchanged (Edits 82–91).

## 3.2 Ending and finale

```markdown
- **Ending screen (built):** CERTIFIED. "Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage."
- **Finale (proposed, D76):**
  - The unveiling: the circus's monument, shrouded until B2 clears; the plaque shows the run (chassis spent, points, best combo, time).
  - The drone lifts the dummy over the river to the ship at Waterfront B3; every crate carries its face.
  - Credits over the voyage.
- **What clearing everything gives:** the ending (built); the CERTIFIED save stamp (built, since Edit 81); the unveiling and the plaque; Second Market, the city again with the cars' learning kept (D76).
```

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

## Registry (edit92)

| ID | Default | Unit | Use |
|---|---|---|---|
| `world.storyArt` | 0 (P7: 1) | flag | The story's tile art, cosmetic only |

## Measured

| Check | Result |
|---|---|
| Solids, floors, stairs, spawns, cone homes, with and without the art | identical on all 27 tiles |
| Tiles the art draws on | 9: Monument A1, A2, A3, C3; Parkland C1, B1; Waterfront A3, C3, B3 |
| Longest tale | 217 characters: four lines on the card |
| Tile card, Monument A1 | ACT I · INDUCTION · MONUMENT · TILE A1 · 1 OF 27; The welcome wall; the act line; the tale |
| Story map | I · MONUMENT, II · PARKLAND, III · WATERFRONT |

## Evidence

- `node prototypes/p7/test_p711.js docs` → 96/96. 6.4–6.10 and 7–7.10 byte-identical.
- `node prototypes/p6/test_p610.js` → 47/47 on the shared code.
- `node test_sim.js` → 104/104. `node test_p6.js` → 72/73: Parkland's street-emptiness limit, as on 6.4.
- `node prototypes/jump/test_jump.js` → 28/28. `node prototypes/controls/test_controls.js` → 34/34.

## Open

- **D76:** the finale (unveiling, plaque, drone to the ship, credits) and Second Market.
- **D67, D68, D70** stand.
