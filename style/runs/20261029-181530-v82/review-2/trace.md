# review-2 · V8 batch · The story's 31 texts and six opening lines, on V2.6

- **Scores:** 7 → 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 6 · 284.9 s · $1.8001. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

| Item | Text | Words |
|---|---|---|
| n01 | You are a Dummy Corporation trainee. Every write-off brings Certification closer. | 11 |
| n02 | Welcome, trainee. Every write-off brings Certification closer. | 7 |
| n03 | Shenzhen Smart City, tile by tile. Each tile trains you to its brief. | 13 |
| n24 | Neon shops, LED walls; one road splits round the monument under the walkway ring. Your training begins here. | 18 |
| n25 | Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients. | 17 |
| n26 | A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients. | 19 |
| act-monument | Dummy Corporation welcomes you off the factory floor. The cars are your colleagues; Certification is your goal. | 17 |
| MA1 | A conveyor sets you down at the welcome wall, where a tower screen shows your face and the word WELCOME. Your first duty toward Certification: stand in the road until a colleague notices you. | 34 |
| MB1 | Battery 1 is fitted, for the dash. The skybridge was built for shoppers who never came, so staff watch the road from it, and today you give them something to see. | 31 |
| MC1 | The LED drum lights each bend before a car arrives, so no colleague is surprised. Where the high road breaks its rail, step off onto a car below: gravity is company policy. | 32 |
| MC2 | The road runs through the portal tower at the sixth floor, above tenants who call the traffic good company. Your write-off belongs on that road, at height; Certification does not include the view. | 33 |
| MB2 | The plaque reads ZERO ACCIDENTS, which new staff mistake for a record; it is a target. Stand or walk near it and let a colleague find you; dashing would spoil the training. | 32 |
| MA2 | The neon shops under the highway sell nothing, yet the traffic reads every sign. Hands 1 is fitted: place a cone where the cars read, and let a colleague's respect for it find you. | 34 |
| MA3 | The stacked cubes rose as the budget arrived, one cube each quarter. Certification is built the same way: one hit, then another before the first is forgotten. | 27 |
| MB3 | Two screens face each other across the road and advertise to each other all night. Legs 1 is fitted: jump into a car between them, and give the skybridge something to watch. | 32 |
| MC3 | The LED gateway thanks every car for driving safely, including the one that wrote you off. Your file reads ROLE: DESTRUCTIVE TESTING; let one colleague throw you into the next. | 30 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The paper lantern, the Expo's first exhibit, is lit again for our clients. Arms 1 is fitted; under the footbridge, push off one car into the next, and Certification draws nearer. | 31 |
| PC2 | Our board will watch opening day from these terraces, which face the avenue, so every crossing is a performance. A van delivers the catering; arrange for it to deliver you. | 30 |
| PC3 | The arch is the Expo's gate, and visitors will circle the roundabout once before they enter. You circle faster: chain your hits, each landing before the last is forgotten. | 29 |
| PB3 | The obelisk marks the surveyors' first stake. On opening day the police fleet escorts a school party here, so Dummy Corporation tests the escort on you first. | 27 |
| PA3 | A wedding is booked on the belvedere for opening day; the couple asked for a view of the traffic. Legs 2 is fitted: land on a car here, so no guest does. | 32 |
| PA2 | The dome is the Expo's showroom, and you are what it will show. Hands 2 is fitted: lay a cone by the canal, and let the car that answers it write you off. | 33 |
| PA1 | The gardener tends the three terraced pools by hand and asks that cars stop before the water. Arms 2 is fitted: push off one car into the next, one step closer to Certification. | 33 |
| PB1 | The cascade steps the reservoir down beside the highway, pool by pool, to drown out the traffic; the traffic got louder. Climb to the highway and take your final hit above the noise. | 33 |
| PB2 | The board watches the ring over the pools, where the cars come round clean. Battery 2 is fitted, a second charge; chain your hits round the ring. | 27 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | At the west portal, the bus carries the upper town's engineers to the bridge. Dummy Corporation requires the bus fleet's data before you cross the river to our clients. | 29 |
| WB1 | The tunnel runs north under the hill: cars go in, and data comes back. Legs 3 is fitted: the longest flight; jump into a car, and your data serves our clients. | 31 |
| WC1 | The east bridge was built a year after the west, to correct its mistakes; its portal block faces the other way. The police here check papers, and your Certification needs their fleet on record. | 34 |
| WC2 | The east beach terrace was built for tourists, then joggers, then sensors. From its rail you see the ships bound for our clients; drop onto a car below. | 28 |
| WC3 | The pier tower logs everything that crosses the river: containers, ducks and, so far, one dummy. Be thrown into a car, and earn your entry. | 25 |
| WB3 | The stilt houses are older than the city; behind glass in one stands Chassis 0, the prototype before you. Arms 3 is fitted for the push; show Chassis 0 how far the model has come. | 35 |
| WA3 | The west tower keeps the customs log. Your entry reads PURPOSE DESTRUCTION: honour it on the raised road, and complete your training. | 22 |
| WA2 | The valley began here: a cliff, an avenue, and a beach of sand brought from three provinces. Place a cone on the terrace, and let the car that reacts to it advance your training. | 34 |
| WB2 | Everything in the valley meets at the circus, where a monument cast from every chassis written off reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted; chain your hits toward Certification. | 31 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 1: 7/10

```
SCORE: 7/10
REASON:
- PC1 · F11 (minor, −1) "and Certification draws nearer" This closing clause adds a stock Certification tag to a tale that already has its place, equipment and duty, so it pads the tale and echoes the n01/n02 slogan. [EDIT97#3.2] Fix: Cut the clause: "The paper lantern, the Expo's first exhibit, is lit again for our clients. Arms 1 is fitted; under the footbridge, push off one car into the next."
- PA1 · F11 (minor, −1) "one step closer to Certification" This closing clause is padding, and it takes the place of the link between the gardener's request and the push, which is the clause that would earn its place. [EDIT97#3.2] Fix: "The gardener tends the three terraced pools by hand and asks that cars stop before the water. Arms 2 is fitted: teach them by pushing off one car into the next."
- WA2 · F11 (minor, −1) "and let the car that reacts to it advance your training" This clause repeats the brief ("a car reacting to a cone") and adds a stock training tag, which pushes the tale to 34 words, close to the 35-word cap. [EDIT97#3.2] Fix: "The valley began here: a cliff, an avenue, and a beach of sand brought from three provinces. Place a cone on the terrace: one more clean reading before the ceremony." In later redrafts, cut similar tail clauses as well, because this batch's tales still run 22 to 34 words with most at 29 or more.
Total: 10 − 1 − 1 − 1 = 7.
```

## After refinement 1 (refiner)

| Item | Text | Words |
|---|---|---|
| n01 | You are a Dummy Corporation trainee. Every write-off brings Certification closer. | 11 |
| n02 | Welcome, trainee. Every write-off brings Certification closer. | 7 |
| n03 | Shenzhen Smart City, tile by tile. Each tile trains you to its brief. | 13 |
| n24 | Neon shops, LED walls; one road splits round the monument under the walkway ring. Your training begins here. | 18 |
| n25 | Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients. | 17 |
| n26 | A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients. | 19 |
| act-monument | Dummy Corporation welcomes you off the factory floor. The cars are your colleagues; Certification is your goal. | 17 |
| MA1 | A conveyor sets you down at the welcome wall, where a tower screen shows your face and the word WELCOME. Your first duty toward Certification: stand in the road until a colleague notices you. | 34 |
| MB1 | Battery 1 is fitted, for the dash. The skybridge was built for shoppers who never came, so staff watch the road from it, and today you give them something to see. | 31 |
| MC1 | The LED drum lights each bend before a car arrives, so no colleague is surprised. Where the high road breaks its rail, step off onto a car below: gravity is company policy. | 32 |
| MC2 | The road runs through the portal tower at the sixth floor, above tenants who call the traffic good company. Your write-off belongs on that road, at height; Certification does not include the view. | 33 |
| MB2 | The plaque reads ZERO ACCIDENTS, which new staff mistake for a record; it is a target. Stand or walk near it and let a colleague find you; dashing would spoil the training. | 32 |
| MA2 | The neon shops under the highway sell nothing, yet the traffic reads every sign. Hands 1 is fitted: place a cone where the cars read, and let a colleague's respect for it find you. | 34 |
| MA3 | The stacked cubes rose as the budget arrived, one cube each quarter. Certification is built the same way: one hit, then another before the first is forgotten. | 27 |
| MB3 | Two screens face each other across the road and advertise to each other all night. Legs 1 is fitted: jump into a car between them, and give the skybridge something to watch. | 32 |
| MC3 | The LED gateway thanks every car for driving safely, including the one that wrote you off. Your file reads ROLE: DESTRUCTIVE TESTING; let one colleague throw you into the next. | 30 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The paper lantern, the Expo's first exhibit, is lit again for our clients. Arms 1 is fitted; under the footbridge, push off one car into the next. | 27 |
| PC2 | Our board will watch opening day from these terraces, which face the avenue, so every crossing is a performance. A van delivers the catering; arrange for it to deliver you. | 30 |
| PC3 | The arch is the Expo's gate, and visitors will circle the roundabout once before they enter. You circle faster: chain your hits, each landing before the last is forgotten. | 29 |
| PB3 | The obelisk marks the surveyors' first stake. On opening day the police fleet escorts a school party here, so Dummy Corporation tests the escort on you first. | 27 |
| PA3 | A wedding is booked on the belvedere for opening day; the couple asked for a view of the traffic. Legs 2 is fitted: land on a car here, so no guest does. | 32 |
| PA2 | The dome is the Expo's showroom, and you are what it will show. Hands 2 is fitted: lay a cone by the canal, and let the car that answers it write you off. | 33 |
| PA1 | The gardener tends the three terraced pools by hand and asks that cars stop before the water. Arms 2 is fitted: teach them by pushing off one car into the next. | 31 |
| PB1 | The cascade steps the reservoir down beside the highway, pool by pool, to drown out the traffic; the traffic got louder. Climb to the highway and take your final hit above the noise. | 33 |
| PB2 | The board watches the ring over the pools, where the cars come round clean. Battery 2 is fitted, a second charge; chain your hits round the ring. | 27 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | At the west portal, the bus carries the upper town's engineers to the bridge. Dummy Corporation requires the bus fleet's data before you cross the river to our clients. | 29 |
| WB1 | The tunnel runs north under the hill: cars go in, and data comes back. Legs 3 is fitted: the longest flight; jump into a car, and your data serves our clients. | 31 |
| WC1 | The east bridge was built a year after the west, to correct its mistakes; its portal block faces the other way. The police here check papers, and your Certification needs their fleet on record. | 34 |
| WC2 | The east beach terrace was built for tourists, then joggers, then sensors. From its rail you see the ships bound for our clients; drop onto a car below. | 28 |
| WC3 | The pier tower logs everything that crosses the river: containers, ducks and, so far, one dummy. Be thrown into a car, and earn your entry. | 25 |
| WB3 | The stilt houses are older than the city; behind glass in one stands Chassis 0, the prototype before you. Arms 3 is fitted for the push; show Chassis 0 how far the model has come. | 35 |
| WA3 | The west tower keeps the customs log. Your entry reads PURPOSE DESTRUCTION: honour it on the raised road, and complete your training. | 22 |
| WA2 | The valley began here: a cliff, an avenue, and a beach of sand brought from three provinces. Place a cone on the beach terrace: one more clean reading before the ceremony. | 31 |
| WB2 | Everything in the valley meets at the circus, where a monument cast from every chassis written off reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted; chain your hits toward Certification. | 31 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 2: 8/10

```
SCORE: 8/10
REASON:
- MB1 · F11 (minor, −1) "and today you give them something to see" The tale names the place and the equipment but drops the duty. Nothing says the final hit must be a dash into a car. [EDIT97#3.2] Fix: "Battery 1 is fitted, for the dash. The skybridge was built for shoppers who never came; staff watch from it as you dash into a colleague."
- tale (batch) · F11 (minor, −1) "The neon shops under the highway sell nothing, yet the traffic reads every sign. Hands 1 is fitted: place a cone where the cars read, and let a colleague's respect for it find you." The 27 tales run 22 to 34 words and most sit between 29 and 34. That is the near-cap clustering the guide calls padding. MA2, at 34 words, is the clearest case. [EDIT97#3.2] Fix: cut at least four tales that have one image to under 22 words. For example, MA2: "The neon shops sell nothing, yet the traffic reads every sign. Hands 1 is fitted: place a cone, and let a colleague answer it." MB2: "The plaque reads ZERO ACCIDENTS: a target, not a record. Stand or walk near it until a colleague finds you." MC2: "The road runs through the portal tower at the sixth floor. Take your write-off up there; Certification does not include the view."
Total: 10 − 1 − 1 = 8.
```

## After refinement 2 (refiner)

| Item | Text | Words |
|---|---|---|
| n01 | You are a Dummy Corporation trainee. Every write-off brings Certification closer. | 11 |
| n02 | Welcome, trainee. Every write-off brings Certification closer. | 7 |
| n03 | Shenzhen Smart City, tile by tile. Each tile trains you to its brief. | 13 |
| n24 | Neon shops, LED walls; one road splits round the monument under the walkway ring. Your training begins here. | 18 |
| n25 | Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients. | 17 |
| n26 | A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients. | 19 |
| act-monument | Dummy Corporation welcomes you off the factory floor. The cars are your colleagues; Certification is your goal. | 17 |
| MA1 | A conveyor sets you down at the welcome wall, where a tower screen shows your face and the word WELCOME. Your first duty toward Certification: stand in the road until a colleague notices you. | 34 |
| MB1 | Battery 1 is fitted, for the dash. The skybridge was built for shoppers who never came; staff watch from it as you dash into a colleague. | 26 |
| MC1 | The LED drum lights each bend before a car arrives, so no colleague is surprised. Where the high road breaks its rail, step off onto a car below: gravity is company policy. | 32 |
| MC2 | The road runs through the portal tower at the sixth floor. Take your write-off up there; ignore the view. | 19 |
| MB2 | The plaque reads ZERO ACCIDENTS: a target, not a record. Stand or walk near it until a colleague finds you. | 20 |
| MA2 | The neon shops sell nothing, but the traffic reads them. Hands 1 is fitted: bait a colleague with a cone. | 20 |
| MA3 | The stacked cubes rose one budget at a time. Grow the same way: one hit, then another before the first is forgotten. | 22 |
| MB3 | Two screens face each other across the road and advertise to each other all night. Legs 1 is fitted: jump into a car between them, and give the skybridge something to watch. | 32 |
| MC3 | The LED gateway thanks every car for driving safely, including the one that wrote you off. Your file reads ROLE: DESTRUCTIVE TESTING; let one colleague throw you into the next. | 30 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The paper lantern, the Expo's first exhibit, is lit again for our clients. Arms 1 is fitted; under the footbridge, push off one car into the next. | 27 |
| PC2 | Our board will watch opening day from these terraces, which face the avenue, so every crossing is a performance. A van delivers the catering; arrange for it to deliver you. | 30 |
| PC3 | The arch is the Expo's gate, and visitors will circle the roundabout once before they enter. You circle faster: chain your hits, each landing before the last is forgotten. | 29 |
| PB3 | The obelisk marks the surveyors' first stake. On opening day the police fleet escorts a school party here, so Dummy Corporation tests the escort on you first. | 27 |
| PA3 | A wedding is booked on the belvedere for opening day; the couple asked for a view of the traffic. Legs 2 is fitted: land on a car here, so no guest does. | 32 |
| PA2 | The dome is the Expo's showroom, and you are what it will show. Hands 2 is fitted: lay a cone by the canal, and let the car that answers it write you off. | 33 |
| PA1 | The gardener tends the three terraced pools by hand and asks that cars stop before the water. Arms 2 is fitted: teach them by pushing off one car into the next. | 31 |
| PB1 | The cascade steps the reservoir down beside the highway, pool by pool, to drown out the traffic; the traffic got louder. Climb to the highway and take your final hit above the noise. | 33 |
| PB2 | The board watches the ring over the pools, where the cars come round clean. Battery 2 is fitted, a second charge; chain your hits round the ring. | 27 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | At the west portal, the bus carries the upper town's engineers to the bridge. Dummy Corporation requires the bus fleet's data before you cross the river to our clients. | 29 |
| WB1 | The tunnel runs north under the hill: cars go in, and data comes back. Legs 3 is fitted: the longest flight; jump into a car, and your data serves our clients. | 31 |
| WC1 | The east bridge was built a year after the west, to correct its mistakes; its portal block faces the other way. The police here check papers, and your Certification needs their fleet on record. | 34 |
| WC2 | The east beach terrace was built for tourists, then joggers, then sensors. From its rail you see the ships bound for our clients; drop onto a car below. | 28 |
| WC3 | The pier tower logs everything that crosses the river: containers, ducks and, so far, one dummy. Be thrown into a car, and earn your entry. | 25 |
| WB3 | The stilt houses are older than the city; behind glass in one stands Chassis 0, the prototype before you. Arms 3 is fitted for the push; show Chassis 0 how far the model has come. | 35 |
| WA3 | The west tower keeps the customs log. Your entry reads PURPOSE DESTRUCTION: honour it on the raised road, and complete your training. | 22 |
| WA2 | The valley began here: a cliff, an avenue, and a beach of sand brought from three provinces. Place a cone on the beach terrace: one more clean reading before the ceremony. | 31 |
| WB2 | Everything in the valley meets at the circus, where a monument cast from every chassis written off reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted; chain your hits toward Certification. | 31 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked every tale, act line, notice and the ending for all of these: tone and the training frame (T1–T5, T13); slogan repeats across the batch (T14: "brings Certification closer" in n01 and n02 only, two texts); the sacrifice stated plainly (V10, in act-waterfront); banned words, the company name and glossary terms (V1–V4); the act frames and exact fixed phrases (V6); the dummy as product (V8); clients served and unseen (V9); each tale naming its landmark (V11); length, placeholders and length spread (F5, F6, F11); equipment named only on the tile that issues it or later (F7, R5); and each duty against its brief (R4, R5). [EDIT95#3.1] [EDIT95#3.2] [EDIT95#3.3] [EDIT97#3.2] [STORY#S1] [STORY#S2] [STORY#S3] [EDIT93#3.1] [STORY#MA1]–[STORY#WB2]
Total: 10.
```

### Confirmation 4: 10/10

```
SCORE: 10/10
REASON:
- None.
I checked all 37 texts against T1–T14, V1–V11, F5–F8, F10, F11 and R4–R5: tone, the story frame, the glossary, each tale's landmark, duty and equipment tile, slogan repeats across the batch (n01 and n02 only), and the plain sacrifice line in act-waterfront [EDIT95#3.1, EDIT95#3.2, EDIT95#3.3, EDIT97#3.2, STORY#S1, EDIT93#3.1].
Total: 10.
```
