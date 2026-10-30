# Story canon

Generated from `content/story/story.json` (edit93-2026-10-29). The JSON is the source; edit it, not this page.

## S1 Story rules

- Numbers live in the registry: tasks and gifts name parameter IDs, never values.
- A task tests the hit that writes the chassis off (the fatal hit).
- Tile names are column-row, as in the game: A1 is the top-left tile.
- Each tile's write-offs are story.writeOffs.<district>.<tile> in the registry (Edit 82).
- Edit 93: introduce, then test. A part arrives on the tile whose brief first needs it; no brief needs a part not yet issued. Monument: Battery 1 B1 (dash), Hands 1 A2 (cone), Legs 1 B3 (jump). Parkland: Arms 1 C1 (push), Legs 2 A3 (jump), Hands 2 A2 (cone), Arms 2 A1 (push), Battery 2 B2 (combo). Waterfront: Legs 3 B1 (jump), Arms 3 B3 (push), Battery 3 B2 (combo).
- Edit 92: Narrative A, Certified. Act I Monument (Induction), Act II Parkland (Opening Day), Act III Waterfront (Customs). Farsight narrates: polite, procedural, dry; no exclamation marks. The cars are colleagues; the briefs are duties; the parts are equipment.
- A gift rides in on the drone that carries the dummy into its tile (Edit 84). Arcade sells every part for credits; its chassis ships with Battery 1 (Edit 91).
- Each tile's traffic is story.traffic.<district>.<tile> in the registry, on the tile and its neighbours (Edit 85).

## S2 Acts

| District | Act | Act line (intro) | Order |
|---|---|---|---|
| Monument | ACT I · INDUCTION | Off the factory floor. Farsight greets you as new staff; the cars are your colleagues. | A1 → B1 → C1 → C2 → B2 → A2 → A3 → B3 → C3 |
| Parkland | ACT II · OPENING DAY | The Expo opens to the public when this park passes. Nine tiles, nine days. Visitors are booked. | C1 → C2 → C3 → B3 → A3 → A2 → A1 → B1 → B2 |
| Waterfront | ACT III · CUSTOMS | The river is a border; ships wait beyond it. Your papers are being prepared. | A1 → B1 → C1 → C2 → C3 → B3 → A3 → A2 → B2 |

## S3 Briefs

A brief is a caps label, then "Coverage gap: …. The final hit must ….". Figures are placeholders bound to registry IDs ({n}).

| Kind | Label | Brief |
|---|---|---|
| any | ANY WRITE-OFF | General coverage. Any write-off in this tile counts. |
| dash | DASH INTO A CAR | Coverage gap: dashes. The final hit must be a dash into a car. |
| drop | DROP ONTO A CAR | Coverage gap: falls. The final hit must be a drop onto a car from above. |
| jump | JUMP INTO A CAR | Coverage gap: jumps. The final hit must be a jump into a car. |
| level | ON A RAISED ROAD | Coverage gap: raised roads. The final hit must land at Z1 or above. |
| cone | CONE-BAITED CAR | Coverage gap: cones. The final hit must come from a car reacting to a cone. |
| push | PUSH OFF A CAR | Coverage gap: ricochets. Push off one car; the final hit must be the next car. |
| bounce | THROWN INTO A CAR | Coverage gap: rebounds. The final hit must come while a hit is still throwing you. |
| struck | STRUCK, NOT DASHING | Coverage gap: pedestrians. The final hit must be a car hitting you while you walk or stand. |
| combo | COMBO ×{n} | Coverage gap: chains. The final hit must be link {n} or later of a combo. |
| cls | A {cls} | Coverage gap: the {clsLong}. The final hit must come from a {cls}. |

## S5 Ending

- CERTIFIED: Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage.

## S4M Monument tiles (ACT I · INDUCTION)

### MA1 Monument A1 · The welcome wall

- **Tile:** Monument A1, 1 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The welcome wall.
- **Brief:** ANY WRITE-OFF. General coverage. Any write-off in this tile counts.
- **Equipment issued here:** none.
- **Tale:** A conveyor sets you down beside a tower. Its screen shows your face and the word WELCOME. Farsight is pleased to have you. Your first duty is simple: stand in the road until a colleague notices you.

### MB1 Monument B1 · The podium bridge

- **Tile:** Monument B1, 2 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The podium bridge.
- **Brief:** DASH INTO A CAR. Coverage gap: dashes. The final hit must be a dash into a car.
- **Equipment issued here:** Battery 1.
- **Tale:** Your first equipment has arrived: a battery, for the dash. The skybridge was built for shoppers who never came; staff now use it to watch the road. Today you join the road. Dash into a colleague. Farsight will time you.

### MC1 Monument C1 · The LED drum

- **Tile:** Monument C1, 3 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The LED drum.
- **Brief:** DROP ONTO A CAR. Coverage gap: falls. The final hit must be a drop onto a car from above.
- **Equipment issued here:** none.
- **Tale:** The drum lights each bend before a car reaches it, so no colleague is ever surprised. Today one will be. The high road breaks its rail over the street below. Step off it onto a car. Gravity is company policy.

### MC2 Monument C2 · The portal tower

- **Tile:** Monument C2, 4 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The portal tower.
- **Brief:** ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above.
- **Equipment issued here:** none.
- **Tale:** The high road runs through this tower at the sixth floor. The tenants say the traffic is good company. Today your duty is on the road itself, at height. The view is not part of the job.

### MB2 Monument B2 · The monument

- **Tile:** Monument B2, 5 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The monument.
- **Brief:** STRUCK, NOT DASHING. Coverage gap: pedestrians. The final hit must be a car hitting you while you walk or stand.
- **Equipment issued here:** none.
- **Tale:** The plaque reads ZERO ACCIDENTS. New staff ask whether this is a record. It is a target. Stand near it and let a colleague find you. Walking is permitted. Dashing would spoil the data.

### MA2 Monument A2 · The neon shops

- **Tile:** Monument A2, 6 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The neon shops.
- **Brief:** CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone.
- **Equipment issued here:** Hands 1.
- **Tale:** The shops under the highway sell nothing. Their signs flash prices at the traffic, which reads every word. Hands 1 is fitted, so you can place a cone. Colleagues are trained to respect cones. Use this.

### MA3 Monument A3 · The stacked cubes

- **Tile:** Monument A3, 7 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The stacked cubes.
- **Brief:** COMBO ×{n} ({n} = story.task.comboEasy). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboEasy)
- **Equipment issued here:** none.
- **Tale:** Each cube was added as the budget arrived, one quarter at a time, each leaning further than the last. Farsight calls this growth. Today's duty is the same: one hit, then another before the first is forgotten.

### MB3 Monument B3 · The LED canyon

- **Tile:** Monument B3, 8 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The LED canyon.
- **Brief:** JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car.
- **Equipment issued here:** Legs 1.
- **Tale:** Two screens face each other across the road and advertise to each other all night. The skybridge was added so that someone would watch. You are now someone. Legs 1 is fitted. Jump into a car between the screens.

### MC3 Monument C3 · The LED gateway

- **Tile:** Monument C3, 9 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The LED gateway.
- **Brief:** THROWN INTO A CAR. Coverage gap: rebounds. The final hit must come while a hit is still throwing you.
- **Equipment issued here:** none.
- **Tale:** The gateway thanks every car for driving safely. It thanked the last one seconds after that car wrote you off. Your file is updated: ROLE: DESTRUCTIVE TESTING. Let one colleague throw you into the next.


## S4P Parkland tiles (ACT II · OPENING DAY)

### PC1 Parkland C1 · The lantern pavilion

- **Tile:** Parkland C1, 1 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The lantern pavilion.
- **Brief:** PUSH OFF A CAR. Coverage gap: ricochets. Push off one car; the final hit must be the next car.
- **Equipment issued here:** Arms 1.
- **Tale:** The paper lantern was the Expo's first exhibit, and it is lit again for the visitors. Arms 1 is fitted; Farsight calls it safety equipment. Under the footbridge, push off one car into the next.

### PC2 Parkland C2 · The amphitheatre

- **Tile:** Parkland C2, 2 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The amphitheatre.
- **Brief:** A VAN. Coverage gap: the van fleet. The final hit must come from a van.
- **Equipment issued here:** none.
- **Tale:** Farsight's board will watch from these terraces on opening day. The seats face the avenue, so every crossing is a performance. A van delivers the catering. Arrange for it to deliver you.

### PC3 Parkland C3 · The arch and the roundabout

- **Tile:** Parkland C3, 3 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The arch and the roundabout.
- **Brief:** COMBO ×{n} ({n} = story.task.comboEasy). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboEasy)
- **Equipment issued here:** none.
- **Tale:** The arch is the Expo's gate. Visitors will circle the roundabout once before they enter, which gives the cars time to learn them. You go round faster. Two hits, the second before the first is forgotten.

### PB3 Parkland B3 · The obelisk court

- **Tile:** Parkland B3, 4 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The obelisk court.
- **Brief:** A POLICE CAR. Coverage gap: the police fleet. The final hit must come from a police car.
- **Equipment issued here:** none.
- **Tale:** The obelisk marks the surveyors' first stake. A school party will visit it on opening day, escorted by the police fleet. Farsight would like to know how the police fleet handles a dummy first.

### PA3 Parkland A3 · The belvedere

- **Tile:** Parkland A3, 5 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The belvedere.
- **Brief:** JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car.
- **Equipment issued here:** Legs 2.
- **Tale:** A wedding is booked on the belvedere for opening day. The couple asked for a view of the traffic. Legs 2 is fitted: longer in the air. Land on a car here, so that no guest ever does.

### PA2 Parkland A2 · The dome by the canal

- **Tile:** Parkland A2, 6 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The dome by the canal.
- **Brief:** CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone.
- **Equipment issued here:** Hands 2.
- **Tale:** The dome is the Expo's showroom. The canal beside it cools the highway's footings; the ducks are registered volunteers. Hands 2 is fitted: two cones. Lay them where the visitors will walk, and see who stops.

### PA1 Parkland A1 · The reservoir terraces

- **Tile:** Parkland A1, 7 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The reservoir terraces.
- **Brief:** PUSH OFF A CAR. Coverage gap: ricochets. Push off one car; the final hit must be the next car.
- **Equipment issued here:** Arms 2.
- **Tale:** The gardener keeps the three pools level by hand. She has asked that the cars learn to stop before the water. Arms 2 is fitted: a stronger push. Teach them by hitting one car into the next.

### PB1 Parkland B1 · The cascade

- **Tile:** Parkland B1, 8 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The cascade.
- **Brief:** ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above.
- **Equipment issued here:** none.
- **Tale:** The cascade steps the reservoir's water down beside the highway, pool by pool. It was built to drown out the traffic. The traffic got louder. Go up to the highway and test it where it is loudest.

### PB2 Parkland B2 · The ring over the pools

- **Tile:** Parkland B2, 9 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The ring over the pools.
- **Brief:** COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard)
- **Equipment issued here:** Battery 2.
- **Tale:** Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three.


## S4W Waterfront tiles (ACT III · CUSTOMS)

### WA1 Waterfront A1 · The west portal

- **Tile:** Waterfront A1, 1 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The west portal.
- **Brief:** A BUS. Coverage gap: the bus fleet. The final hit must come from a bus.
- **Equipment issued here:** none.
- **Tale:** The upper town houses the engineers, and the bus carries them to the bridge. Farsight requires the bus fleet's data before anyone crosses the river. The bus is slow and very large. It will not miss.

### WB1 Waterfront B1 · The tunnel portal

- **Tile:** Waterfront B1, 2 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The tunnel portal.
- **Brief:** JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car.
- **Equipment issued here:** Legs 3.
- **Tale:** The tunnel runs north under the hill to the next valley. Cars go in. Data comes back. Legs 3 is fitted: the longest flight. Where your data goes after the tunnel is not within your role.

### WC1 Waterfront C1 · The east portal

- **Tile:** Waterfront C1, 3 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The east portal.
- **Brief:** A POLICE CAR. Coverage gap: the police fleet. The final hit must come from a police car.
- **Equipment issued here:** none.
- **Tale:** The east bridge was built a year after the west, to correct its mistakes. Its portal block faces the other way and pretends not to know its twin. The police here check papers. Yours are being prepared.

### WC2 Waterfront C2 · The east beach terrace

- **Tile:** Waterfront C2, 4 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The east beach terrace.
- **Brief:** DROP ONTO A CAR. Coverage gap: falls. The final hit must be a drop onto a car from above.
- **Equipment issued here:** none.
- **Tale:** The terrace was built for tourists, then joggers, then sensors. From its rail you can see the ships in the estuary and the cranes that load them. Drop onto a car below. The ships will wait.

### WC3 Waterfront C3 · The east customs post

- **Tile:** Waterfront C3, 5 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The east customs post.
- **Brief:** THROWN INTO A CAR. Coverage gap: rebounds. The final hit must come while a hit is still throwing you.
- **Equipment issued here:** none.
- **Tale:** The pier tower is a customs post. It logs everything that floats on the river: containers, ducks and, so far, one dummy, inbound. Be thrown into a car. Customs is watching.

### WB3 Waterfront B3 · The stilt houses

- **Tile:** Waterfront B3, 6 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The stilt houses.
- **Brief:** PUSH OFF A CAR. Coverage gap: ricochets. Push off one car; the final hit must be the next car.
- **Equipment issued here:** Arms 3.
- **Tale:** The stilt houses are older than the city, kept as heritage. Behind glass in one of them stands Chassis 0, the prototype before you. A ship is moored beyond. Arms 3 is fitted. Show Chassis 0 how far the model has come.

### WA3 Waterfront A3 · The west customs post

- **Tile:** Waterfront A3, 7 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The west customs post.
- **Brief:** ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above.
- **Equipment issued here:** none.
- **Tale:** The west tower keeps the customs log. Your entry reads ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. You were shipped here to be tested. Honour the declaration on the raised road.

### WA2 Waterfront A2 · The west beach terrace

- **Tile:** Waterfront A2, 8 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The west beach terrace.
- **Brief:** CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone.
- **Equipment issued here:** none.
- **Tale:** The valley began here: a cliff, an avenue, and a beach of sand brought from three provinces. The ceremony is being prepared in the circus. Place a cone. Farsight would like one more clean reading before the speeches.

### WB2 Waterfront B2 · The circus

- **Tile:** Waterfront B2, 9 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The circus.
- **Brief:** COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard)
- **Equipment issued here:** Battery 3.
- **Tale:** Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you.

