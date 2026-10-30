# review · V8 batch · The story's 31 texts and six opening lines, on V2.5

- **Scores:** 4 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 212.8 s · $1.1802. Models: generator sonnet, evaluator opus, refiner opus.

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
| PA3 | A wedding is booked on the belvedere for opening day; the couple asked for a view of the traffic. Legs 2 is fitted: jump into a car here, so no guest does. | 32 |
| PA2 | The dome is the Expo's showroom, and you are what it will show. Hands 2 is fitted: lay a cone by the canal, and let the car that answers it write you off. | 33 |
| PA1 | The gardener tends the three terraced pools by hand and asks that cars stop before the water. Arms 2 is fitted: push off one car into the next, one step closer to Certification. | 33 |
| PB1 | The cascade steps the reservoir down beside the highway, pool by pool, to drown out the traffic; the traffic got louder. Climb to the highway and take your final hit above the noise. | 33 |
| PB2 | The board watches the ring over the pools, where the cars come round clean. Battery 2 is fitted, a second charge; chain your hits round the ring. | 27 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | At the west portal, the bus carries the upper town's engineers to the bridge. Dummy Corporation requires the bus fleet's data before you cross the river to our clients. | 29 |
| WB1 | The tunnel runs north under the hill: cars go in, and data comes back. Legs 3 is fitted for the longest flight; jump into a car, and your data serves our clients. | 32 |
| WC1 | The east bridge was built a year after the west, to correct its mistakes; its portal block faces the other way. The police here check papers, and your Certification needs their fleet on record. | 34 |
| WC2 | The east beach terrace was built for tourists, then joggers, then sensors. From its rail you watch the cranes load Certified dummies onto ships bound for our clients. | 28 |
| WC3 | The pier tower logs everything that crosses the river: containers, ducks and Certified dummies bound for our clients. Be thrown into a car, and earn your entry. | 27 |
| WB3 | The stilt houses are older than the city; behind glass in one stands Chassis 0, the prototype before you. Arms 3 is fitted for the push; show Chassis 0 how far the model has come. | 35 |
| WA3 | The west tower keeps the customs log of every dummy bound for clients across the river. Your entry reads PURPOSE DESTRUCTION: honour it on the raised road, and complete your training. | 31 |
| WA2 | The valley began here: a cliff, an avenue, and a beach of sand brought from three provinces. Place a cone on the terrace, and let the car that reacts to it advance your training. | 34 |
| WB2 | Everything in the valley meets at the circus, where a monument cast from every chassis written off reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted; chain your hits toward Certification. | 31 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 1: 4/10

Lint evidence:

- batch:is fitted for the · T14 (minor) 'is fitted for the' in 3 texts (MB1, WB1, WB3) > 2 (style.bark.maxStockEndings)
- batch:jump into a car · T14 (minor) 'jump into a car' in 3 texts (MB3, PA3, WB1) > 2 (style.bark.maxStockEndings)

```
SCORE: 4/10
REASON:
- WB1 · T14 (minor, −1) "is fitted for the" The phrase appears in three texts (MB1, WB1, WB3), which is over the limit of two (style.bark.maxStockEndings). [SUB4#6.1] Fix: "The tunnel runs north under the hill: cars go in, and data comes back. Legs 3 is fitted: the longest flight; jump into a car, and your data serves our clients."
- PA3 · T14 (minor, −1) "jump into a car" The phrase appears in three texts (MB3, PA3, WB1), which is over the limit of two (style.bark.maxStockEndings). [SUB4#6.1] Fix: "A wedding is booked on the belvedere for opening day; the couple asked for a view of the traffic. Legs 2 is fitted: land on a car here, so no guest does."
- WC2 · V11 (major, −2) "From its rail you watch the cranes load Certified dummies onto ships bound for our clients." The tale points the terrace at the shipment, not at the duty or the training, and never gives the drop onto a car from above that the brief requires. [EDIT95#3.1] Fix: "The east beach terrace was built for tourists, then joggers, then sensors. From its rail you see the ships bound for our clients; drop onto a car below."
- WC3 · F11 (minor, −1) "containers, ducks and Certified dummies bound for our clients" This clause repeats the act line ("Certified dummies ship across the river… to our clients") and adds nothing about the tile. [EDIT97#3.2] Fix: "The pier tower logs everything that crosses the river: containers, ducks and, so far, one dummy. Be thrown into a car, and earn your entry."
- WA3 · F11 (minor, −1) "of every dummy bound for clients across the river" This clause repeats Act III's act line and adds nothing about the customs post. [EDIT97#3.2] Fix: "The west tower keeps the customs log. Your entry reads PURPOSE DESTRUCTION: honour it on the raised road, and complete your training."
Total: 10 − 1 − 1 − 2 − 1 − 1 = 4.
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

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked every line against T1–T5, T13–T14, V1–V11, F5–F8, F10–F11 and R4–R5: the act lines and ending keep the frame [EDIT95#3.3, STORY#S2]; act-waterfront states the sacrifice plainly [EDIT95#3.1]; every tale names its landmark or a canon detail of it, matches its brief and names equipment only on the tile that issues it [STORY#S1, EDIT93#3.1]; ZERO ACCIDENTS and ROLE: DESTRUCTIVE TESTING appear exactly as written; no phrase of four or more words appears in more than two texts [PLAY#PS5]; and none of the 37 texts names Farsight or another company [EDIT95#0, EDIT95#4.2].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None.

I found no violations in any of the 36 texts:

- **Tone (T1–T5, T13, T14):** every text is deadpan, flat and motivating, and has no "!". Adjectives stay within limits. The company speaks as Dummy Corporation, "the Corporation" or "we". No phrase of four or more words appears in more than two texts. [EDIT95#3.2] [PLAY#PS2]
- **Vocabulary and lore (V1–V11):** no banned words. The glossary is followed. The three acts keep their story frames. ZERO ACCIDENTS and ROLE: DESTRUCTIVE TESTING are spelled exactly. Every tale names its landmark or a canon detail of it. [EDIT95#3.1] [EDIT95#3.3] [STORY#S2]
- **The sacrifice (V10):** the Waterfront act line states it plainly. [EDIT95#3.1]
- **Length and format (F5–F7, F10, F11):** each tale runs 15 to 35 words in at most two sentences. Every other text stays under 20 words. No tale has a placeholder. Each tile that issues equipment names it. [EDIT97#3.2] [EDIT95#4.2] [STORY#MB3]
- **Tile truth and duties (R4, R5):** each tale's place matches its tile chunk (STORY#MA1–STORY#WB2), and its duty matches its brief. No tale names a part before the tile that issues it. [STORY#S1] [STORY#S3] [EDIT93#3.1]

Total: 10.
```
