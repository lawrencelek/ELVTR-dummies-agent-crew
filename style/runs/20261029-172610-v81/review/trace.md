# review · V8 batch · The story's 31 texts and six opening lines, on V2.3

- **Scores:** 7 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 174.9 s · $1.0865. Models: generator sonnet, evaluator opus, refiner opus.

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
| MA1 | A conveyor sets you down at the welcome wall, where a screen shows your face and the word WELCOME. Your first duty toward Certification: stand in the road until a colleague notices you. | 33 |
| MB1 | Battery 1 is fitted, for the dash. Shoppers never came to the podium bridge; staff now watch from it as you dash into a colleague, toward Certification. | 27 |
| MC1 | The LED drum lights each bend so no colleague is surprised. Where the high road breaks its rail over the street, step off onto a car below: gravity is company policy. | 31 |
| MC2 | The raised road passes through the portal tower, above its tenants. Your write-off belongs on that road, at height; Certification does not include the view. | 25 |
| MB2 | The monument's plaque reads ZERO ACCIDENTS, a target rather than a record. Stand or walk beside it and let a colleague find you; dashing would spoil the data. | 28 |
| MA2 | The neon shops under the highway sell nothing, yet the traffic reads every sign. Hands 1 is fitted: place a cone, and let a colleague who reads it write you off. | 31 |
| MA3 | Each stacked cube was added as the budget arrived, one on the last; we call this growth. Your duty grows the same way: one hit, then another before the first is forgotten. | 32 |
| MB3 | Legs 1 is fitted. In the LED canyon, two screens advertise across the road all night; jump into a car between them, for our clients. | 25 |
| MC3 | The LED gateway thanks every car for driving safely, even the one that wrote you off. Your file reads ROLE: DESTRUCTIVE TESTING; let one colleague throw you into the next. | 30 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The paper lantern, the Expo's first exhibit, is lit again for our clients. Arms 1 is fitted: under the footbridge, push off one car into the next, and the Expo opens safer. | 32 |
| PC2 | Our board will watch from these terraces on opening day, and every crossing of the avenue is a performance. A van delivers the catering; arrange for it to deliver you. | 30 |
| PC3 | The arch is the Expo's gate; visitors will circle the roundabout once before they enter. Go round faster, and make the final hit link {n} or later of a chain. | 30 |
| PB3 | The obelisk marks the surveyors' first stake; on opening day the police fleet escorts a school party here. Your final hit must come from a police car: the escort is tested on you first. | 34 |
| PA3 | A wedding is booked on the belvedere for opening day, facing the traffic. Legs 2 is fitted: jump into a car here, so that no guest ever does. | 28 |
| PA2 | The dome by the canal is the Expo's showroom, readied for our clients. Hands 2 is fitted: lay a cone, and let the car that answers it write you off. | 30 |
| PA1 | At the reservoir terraces, the gardener tends three pools by hand; she asks that cars stop before the water. Arms 2 is fitted; teach them by pushing off one car into the next. | 33 |
| PB1 | The cascade steps the reservoir's water down beside the highway, pool by pool, to drown out the traffic. Go up to the highway and take your write-off where the traffic is loudest. | 32 |
| PB2 | Battery 2 is fitted: a second charge. The board watches the ring over the pools; carry a chain to link {n} or later, and the Expo opens to clients. | 29 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | Before you cross the river to our clients, we require the bus fleet's data. At the west portal, the bus carries engineers from the upper town to the bridge; let it write you off. | 34 |
| WB1 | Legs 3 is fitted for the longest flight. At the tunnel portal, cars go in under the hill and data comes back; jump into one, and your data serves our clients. | 31 |
| WC1 | The east bridge was built to correct the west; its portal block faces the other way. The police here check papers, and a police car's final hit moves yours forward. | 30 |
| WC2 | From the rail of the east beach terrace, you can see the ships that carry Certified dummies to clients. Drop onto a car below; the ships will wait. | 28 |
| WC3 | The east pier tower is a customs post; it logs every Certified dummy that crosses the river to our clients. Be thrown into a car while a hit still throws you, and earn your entry. | 35 |
| WB3 | Arms 3 is fitted; push off one car into the next. Behind glass in the stilt houses stands Chassis 0, the prototype before you; show it how far the model has come. | 32 |
| WA3 | At the west customs post, the log lists every dummy bound for clients across the river. Your entry reads PURPOSE DESTRUCTION; honour it on the raised road. | 27 |
| WA2 | The west beach terrace was laid with sand from three provinces, for clients you will one day serve. Place a cone and meet the car that reacts to it; every write-off here serves them. | 34 |
| WB2 | Battery 3 is fitted: end a combo on link {n} or later, and you are Certified for our clients. The circus island's monument, cast from every write-off, reads ZERO ACCIDENTS (EXCLUDING TESTS). | 32 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 1: 7/10

Lint evidence:

- batch:it write you off · T14 (minor) 'it write you off' in 3 texts (MA2, PA2, WA1) > 2 (style.bark.maxStockEndings)
- batch:car into the next · T14 (minor) 'car into the next' in 3 texts (PC1, PA1, WB3) > 2 (style.bark.maxStockEndings)
- batch:link n or later · T14 (minor) 'link n or later' in 3 texts (PC3, PB2, WB2) > 2 (style.bark.maxStockEndings)

```
SCORE: 7/10
REASON:
- WA1 · T14 (minor, −1) "let it write you off" The phrase "it write you off" appears in three texts (MA2, PA2, WA1), and the limit is two. [SUB4#6.1] Fix: change WA1's closing clause to "…from the upper town to the bridge; stand in its path."
- PA1 · T14 (minor, −1) "teach them by pushing off one car into the next" The phrase "car into the next" appears in three texts (PC1, PA1, WB3), and the limit is two. [SUB4#6.1] Fix: change PA1's second sentence to "Arms 2 is fitted; teach them with a ricochet: push off one car, and meet the second."
- PC3 · T14 (minor, −1) "make the final hit link {n} or later of a chain" The phrase "link {n} or later" appears in three texts (PC3, PB2, WB2), and the limit is two. [SUB4#6.1] Fix: change PC3's second sentence to "Go round faster, and chain your hits before the first is forgotten."
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
| MA1 | A conveyor sets you down at the welcome wall, where a screen shows your face and the word WELCOME. Your first duty toward Certification: stand in the road until a colleague notices you. | 33 |
| MB1 | Battery 1 is fitted, for the dash. Shoppers never came to the podium bridge; staff now watch from it as you dash into a colleague, toward Certification. | 27 |
| MC1 | The LED drum lights each bend so no colleague is surprised. Where the high road breaks its rail over the street, step off onto a car below: gravity is company policy. | 31 |
| MC2 | The raised road passes through the portal tower, above its tenants. Your write-off belongs on that road, at height; Certification does not include the view. | 25 |
| MB2 | The monument's plaque reads ZERO ACCIDENTS, a target rather than a record. Stand or walk beside it and let a colleague find you; dashing would spoil the data. | 28 |
| MA2 | The neon shops under the highway sell nothing, yet the traffic reads every sign. Hands 1 is fitted: place a cone, and let a colleague who reads it write you off. | 31 |
| MA3 | Each stacked cube was added as the budget arrived, one on the last; we call this growth. Your duty grows the same way: one hit, then another before the first is forgotten. | 32 |
| MB3 | Legs 1 is fitted. In the LED canyon, two screens advertise across the road all night; jump into a car between them, for our clients. | 25 |
| MC3 | The LED gateway thanks every car for driving safely, even the one that wrote you off. Your file reads ROLE: DESTRUCTIVE TESTING; let one colleague throw you into the next. | 30 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The paper lantern, the Expo's first exhibit, is lit again for our clients. Arms 1 is fitted: under the footbridge, push off one car into the next, and the Expo opens safer. | 32 |
| PC2 | Our board will watch from these terraces on opening day, and every crossing of the avenue is a performance. A van delivers the catering; arrange for it to deliver you. | 30 |
| PC3 | The arch is the Expo's gate; visitors will circle the roundabout once before they enter. Go round faster, and chain your hits before the first is forgotten. | 27 |
| PB3 | The obelisk marks the surveyors' first stake; on opening day the police fleet escorts a school party here. Your final hit must come from a police car: the escort is tested on you first. | 34 |
| PA3 | A wedding is booked on the belvedere for opening day, facing the traffic. Legs 2 is fitted: jump into a car here, so that no guest ever does. | 28 |
| PA2 | The dome by the canal is the Expo's showroom, readied for our clients. Hands 2 is fitted: lay a cone, and let the car that answers it write you off. | 30 |
| PA1 | At the reservoir terraces, the gardener tends three pools by hand; she asks that cars stop before the water. Arms 2 is fitted; teach them with a ricochet, one car to the next. | 33 |
| PB1 | The cascade steps the reservoir's water down beside the highway, pool by pool, to drown out the traffic. Go up to the highway and take your write-off where the traffic is loudest. | 32 |
| PB2 | Battery 2 is fitted: a second charge. The board watches the ring over the pools; carry a chain to link {n} or later, and the Expo opens to clients. | 29 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | Before you cross the river to our clients, we require the bus fleet's data. At the west portal, the bus carries engineers from the upper town to the bridge; stand in its path. | 33 |
| WB1 | Legs 3 is fitted for the longest flight. At the tunnel portal, cars go in under the hill and data comes back; jump into one, and your data serves our clients. | 31 |
| WC1 | The east bridge was built to correct the west; its portal block faces the other way. The police here check papers, and a police car's final hit moves yours forward. | 30 |
| WC2 | From the rail of the east beach terrace, you can see the ships that carry Certified dummies to clients. Drop onto a car below; the ships will wait. | 28 |
| WC3 | The east pier tower is a customs post; it logs every Certified dummy that crosses the river to our clients. Be thrown into a car while a hit still throws you, and earn your entry. | 35 |
| WB3 | Arms 3 is fitted; push off one car into the next. Behind glass in the stilt houses stands Chassis 0, the prototype before you; show it how far the model has come. | 32 |
| WA3 | At the west customs post, the log lists every dummy bound for clients across the river. Your entry reads PURPOSE DESTRUCTION; honour it on the raised road. | 27 |
| WA2 | The west beach terrace was laid with sand from three provinces, for clients you will one day serve. Place a cone and meet the car that reacts to it; every write-off here serves them. | 34 |
| WB2 | Battery 3 is fitted: end a combo on link {n} or later, and you are Certified for our clients. The circus island's monument, cast from every write-off, reads ZERO ACCIDENTS (EXCLUDING TESTS). | 32 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None.
I checked all 37 texts against T1–T14 (tone, slogan repeats), V1–V11 (the story frame, the glossary, place-naming in every tale, the sacrifice stated in act-waterfront), F5–F8 and F10 (length, sentence count, equipment ranks) and R4–R5 (tile and brief truth), using the SLOT and [EDIT95#3.1], [EDIT95#3.2], [EDIT95#3.3], [EDIT96#3.2], [STORY#S1], [STORY#S3] and the tile chunks [STORY#MA1]–[STORY#WB2].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all 37 texts for tone, temperament, frame and glossary (T1, T3–T5, T13; V3, V6, V8, V9), the place in every tale, and equipment and brief truth (V11, F7, R4, R5 against [STORY#S1] and [EDIT93#3.1]). Across the batch I checked T14 and V10; act-waterfront states the sacrifice plainly per [EDIT95#3.1]. Lint found no length, slogan or other issues ([EDIT96#3.2], [EDIT95#3.2], [EDIT95#4.2]).
Total: 10.
```
