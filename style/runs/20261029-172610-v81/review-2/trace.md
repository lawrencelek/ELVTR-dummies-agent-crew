# review-2 · V8 batch · The story's 31 texts and six opening lines, on V2.4

- **Scores:** 6 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 129.3 s · $1.1279. Models: generator sonnet, evaluator opus, refiner opus.

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

### Evaluation 1: 6/10

Lint evidence:

- items[25] · F5 (major) a placeholder in a tale: the card draws it as written; the brief carries the number
- items[35] · F5 (major) a placeholder in a tale: the card draws it as written; the brief carries the number

```
SCORE: 6/10
REASON:
- PB2 · F5 (major, −2) "carry a chain to link {n} or later" puts a placeholder in a tale, and the card shows "{n}" exactly as written. [EDIT96#3.2] Fix: replace with "carry the chain your brief asks for", so the line reads "The board watches the ring over the pools; carry the chain your brief asks for, and the Expo opens to clients."
- WB2 · F5 (major, −2) "end a combo on link {n} or later" puts a placeholder in a tale, and the card shows "{n}" exactly as written. [EDIT96#3.2] Fix: replace with "complete the chain your brief sets", so the line reads "Battery 3 is fitted: complete the chain your brief sets, and you are Certified for our clients."
Total: 10 − 2 − 2 = 6.
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
| PB2 | Battery 2 is fitted: a second charge. The board watches the ring over the pools; carry the chain your brief asks for, and the Expo opens to clients. | 28 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | Before you cross the river to our clients, we require the bus fleet's data. At the west portal, the bus carries engineers from the upper town to the bridge; stand in its path. | 33 |
| WB1 | Legs 3 is fitted for the longest flight. At the tunnel portal, cars go in under the hill and data comes back; jump into one, and your data serves our clients. | 31 |
| WC1 | The east bridge was built to correct the west; its portal block faces the other way. The police here check papers, and a police car's final hit moves yours forward. | 30 |
| WC2 | From the rail of the east beach terrace, you can see the ships that carry Certified dummies to clients. Drop onto a car below; the ships will wait. | 28 |
| WC3 | The east pier tower is a customs post; it logs every Certified dummy that crosses the river to our clients. Be thrown into a car while a hit still throws you, and earn your entry. | 35 |
| WB3 | Arms 3 is fitted; push off one car into the next. Behind glass in the stilt houses stands Chassis 0, the prototype before you; show it how far the model has come. | 32 |
| WA3 | At the west customs post, the log lists every dummy bound for clients across the river. Your entry reads PURPOSE DESTRUCTION; honour it on the raised road. | 27 |
| WA2 | The west beach terrace was laid with sand from three provinces, for clients you will one day serve. Place a cone and meet the car that reacts to it; every write-off here serves them. | 34 |
| WB2 | Battery 3 is fitted: complete the chain your brief sets, and you are Certified for our clients. The circus island's monument, cast from every write-off, reads ZERO ACCIDENTS (EXCLUDING TESTS). | 30 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. All 37 texts pass for Dummy Corporation's voice: tone and adjectives (T1–T5, T13), with no slogan in more than two texts (T14) [EDIT95#3.2, PLAY#PS2]; vocabulary, the act frames and fixed phrases (V1–V9) [EDIT95#3.1, EDIT95#3.3, STORY#S2]; the sacrifice stated plainly in act-waterfront (V10) and every tale naming its landmark (V11) [EDIT95#3.1]; length, equipment on its issuing tile and no placeholders (F5–F7, F10) [EDIT96#3.2, STORY#S1, EDIT95#4.2]; and each tale's duty against its brief (R4–R5) [STORY#S3, EDIT93#3.1, STORY#MA1–STORY#WB2].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all 37 texts against T1–T5, T13, T14, V1–V4, V6 and V8–V11, F5–F7, F10, and R4–R5. Every tale names its landmark and matches its brief. Each piece of equipment is named on the tile that issues it. The fixed phrases ZERO ACCIDENTS and ROLE: DESTRUCTIVE TESTING are exact. No four-word phrase appears in more than two texts. The sacrifice is stated once, in act-waterfront. [EDIT95#3.1, EDIT95#3.2, EDIT95#3.3, EDIT96#3.2, STORY#S1, STORY#S3, STORY#MA1–STORY#WB2]
Total: 10.
```
