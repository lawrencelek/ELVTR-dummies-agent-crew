# review · V8 batch · The story's 31 texts and six opening lines, on V2.2

- **Scores:** 1 → 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 6 · 216.3 s · $1.7204. Models: generator sonnet, evaluator opus, refiner opus.

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
| MA1 | Dummy Corporation welcomes you to training. Stand in the road until a colleague notices you. | 15 |
| MB1 | Battery 1 is fitted. Dash into a colleague; each write-off brings Certification closer. | 13 |
| MC1 | The drum warns every colleague of each bend. Step off the high road onto a car; gravity is company policy. | 20 |
| MC2 | The raised road runs through this tower. Take the final hit up there, and Certification comes closer. | 17 |
| MB2 | The plaque reads ZERO ACCIDENTS, a target. Walk or stand beside it until a colleague finds you. | 17 |
| MA2 | Hands 1 is fitted. Place a cone; the colleague that reacts writes you off, and you progress. | 17 |
| MA3 | Each cube rests on the one before. Chain your hits the same way; the last link writes you off. | 19 |
| MB3 | Legs 1 is fitted. Jump into a car between the screens; each write-off brings Certification closer. | 16 |
| MC3 | Under the gateway, your file reads ROLE: DESTRUCTIVE TESTING. Let one colleague throw you into the next. | 17 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The lantern is lit for the Expo's clients. Arms 1 is fitted: push off one car into the next. | 19 |
| PC2 | On opening day, our board will watch from these terraces. A van delivers the catering; let it deliver you. | 19 |
| PC3 | The arch is the Expo's gate. Clients enter when the park passes; chain each hit to the last. | 18 |
| PB3 | On opening day, police escort a school party to the obelisk. Take a police car's hit first. | 17 |
| PA3 | A wedding is booked on the belvedere. Legs 2 is fitted: jump into a car, so no guest does. | 19 |
| PA2 | The dome awaits clients. Hands 2 is fitted: lay a cone, and let the car that reacts write you off. | 20 |
| PA1 | Arms 2 is fitted: a stronger push. Push off a car; let the next one write you off. | 18 |
| PB1 | The cascade steps down beside the highway. Climb to the raised road; a write-off there serves our clients. | 18 |
| PB2 | Battery 2 is fitted. The board watches the ring; end a long chain on a car for our clients. | 19 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | We need the bus fleet's data before Certified dummies ship across the river. Meet the bus; it will not miss. | 20 |
| WB1 | Legs 3 is fitted: the longest flight. Jump at a car by the tunnel portal; your data serves our clients. | 20 |
| WC1 | The police check papers at the east portal. Take your final hit from a police car; your papers follow. | 19 |
| WC2 | Beyond the rail, ships wait to carry Certified dummies to clients. Drop onto a car below. | 16 |
| WC3 | The customs post logs every dummy shipped to our clients. Be thrown into a car, and earn your entry. | 19 |
| WB3 | Show Chassis 0 how far the model has come. Arms 3 is fitted: push off one car into the next. | 20 |
| WA3 | Your customs entry reads DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. Honour the declaration on the raised road. | 18 |
| WA2 | The ceremony is being prepared in the circus. Place a cone; the car that reacts writes you off. | 18 |
| WB2 | The monument is cast from every write-off. Battery 3 is fitted: finish the chain and ship Certified. | 17 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 1: 1/10

Lint evidence:

- batch:write off brings certification · T14 (minor) 'write off brings certification' in 4 texts (n01, n02, MB1, MB3) > 2 (style.bark.maxStockEndings)
- batch:certified dummies ship across · T14 (minor) 'certified dummies ship across' in 3 texts (n26, act-waterfront, WA1) > 2 (style.bark.maxStockEndings)

```
SCORE: 1/10
REASON:
- MB1/MB3 · T14 (minor, −1) "each write-off brings Certification closer" Lint finds the slogan "write off brings certification" in four texts (n01, n02, MB1, MB3), and the limit is two. [SUB4#6.1] Fix: keep it in n01 and n02 only. Rewrite MB1 as in the V11 fix below. Rewrite MB3 as "Legs 1 is fitted. The screens advertise to each other; jump into a car between them."
- WA1 · T14 (minor, −1) "before Certified dummies ship across the river" Lint finds the phrase "certified dummies ship across" in three texts (n26, act-waterfront, WA1), and the limit is two. [SUB4#6.1] Fix: "We need the bus fleet's data before anyone crosses the river. Meet the bus; it will not miss."
- MA1 · V11 (major, −2) "Dummy Corporation welcomes you to training. Stand in the road until a colleague notices you." The tale never names its landmark, the welcome wall, or any detail of it. [EDIT95#3.1] Fix: "The welcome wall shows your face and the word WELCOME. Stand in the road until a colleague notices you."
- MB1 · V11 (major, −2) "Battery 1 is fitted. Dash into a colleague; each write-off brings Certification closer." The tale has equipment and a duty but no place, because the podium bridge goes unnamed. [EDIT95#3.1] Fix: "Battery 1 is fitted. Staff watch from the podium bridge; you join the road and dash into a colleague."
- MA2 · V11 (major, −2) "Hands 1 is fitted. Place a cone; the colleague that reacts writes you off, and you progress." The tale has equipment and a duty but no place, because the neon shops go unnamed. [EDIT95#3.1] Fix: "The neon shops flash prices at the traffic. Hands 1 is fitted: place a cone, and let a colleague react."
- PA1 · V11 (major, −2) "Arms 2 is fitted: a stronger push. Push off a car; let the next one write you off." The tale has equipment and a duty but no place, because neither the reservoir terraces nor the gardener appear. [EDIT95#3.1] Fix: "Arms 2 is fitted. Teach the cars to stop before the reservoir: push off one, into the next."
- WA2 · V11 (major, −2) "The ceremony is being prepared in the circus." The only place named is the circus, which belongs to Waterfront B2, so the tile's own landmark, the west beach terrace, is missing. [EDIT95#3.1] Fix: "Sand on the west beach terrace came from three provinces. Place a cone; the car that reacts writes you off."
Total: 10 − 1 − 1 − 2 − 2 − 2 − 2 − 2 = 1 (floor; raw −2).
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
| MA1 | The welcome wall shows your face and the word WELCOME. Stand in the road until a colleague notices you. | 19 |
| MB1 | Battery 1 is fitted. Staff watch from the podium bridge; you join the road and dash into a colleague. | 19 |
| MC1 | The drum warns every colleague of each bend. Step off the high road onto a car; gravity is company policy. | 20 |
| MC2 | The raised road runs through this tower. Take the final hit up there, and Certification comes closer. | 17 |
| MB2 | The plaque reads ZERO ACCIDENTS, a target. Walk or stand beside it until a colleague finds you. | 17 |
| MA2 | The neon shops flash prices at the traffic. Hands 1 is fitted: place a cone, and let a colleague react. | 20 |
| MA3 | Each cube rests on the one before. Chain your hits the same way; the last link writes you off. | 19 |
| MB3 | Legs 1 is fitted. The screens advertise to each other; jump into a car between them. | 16 |
| MC3 | Under the gateway, your file reads ROLE: DESTRUCTIVE TESTING. Let one colleague throw you into the next. | 17 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The lantern is lit for the Expo's clients. Arms 1 is fitted: push off one car into the next. | 19 |
| PC2 | On opening day, our board will watch from these terraces. A van delivers the catering; let it deliver you. | 19 |
| PC3 | The arch is the Expo's gate. Clients enter when the park passes; chain each hit to the last. | 18 |
| PB3 | On opening day, police escort a school party to the obelisk. Take a police car's hit first. | 17 |
| PA3 | A wedding is booked on the belvedere. Legs 2 is fitted: jump into a car, so no guest does. | 19 |
| PA2 | The dome awaits clients. Hands 2 is fitted: lay a cone, and let the car that reacts write you off. | 20 |
| PA1 | Arms 2 is fitted. Teach the cars to stop before the reservoir: push off one, into the next. | 18 |
| PB1 | The cascade steps down beside the highway. Climb to the raised road; a write-off there serves our clients. | 18 |
| PB2 | Battery 2 is fitted. The board watches the ring; end a long chain on a car for our clients. | 19 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | We need the bus fleet's data before anyone crosses the river. Meet the bus; it will not miss. | 18 |
| WB1 | Legs 3 is fitted: the longest flight. Jump at a car by the tunnel portal; your data serves our clients. | 20 |
| WC1 | The police check papers at the east portal. Take your final hit from a police car; your papers follow. | 19 |
| WC2 | Beyond the rail, ships wait to carry Certified dummies to clients. Drop onto a car below. | 16 |
| WC3 | The customs post logs every dummy shipped to our clients. Be thrown into a car, and earn your entry. | 19 |
| WB3 | Show Chassis 0 how far the model has come. Arms 3 is fitted: push off one car into the next. | 20 |
| WA3 | Your customs entry reads DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. Honour the declaration on the raised road. | 18 |
| WA2 | Sand on the west beach terrace came from three provinces. Place a cone; the car that reacts writes you off. | 20 |
| WB2 | The monument is cast from every write-off. Battery 3 is fitted: finish the chain and ship Certified. | 17 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 2: 8/10

```
SCORE: 8/10
REASON:
- WA1 · V11 (major, −2) "We need the bus fleet's data before anyone crosses the river. Meet the bus; it will not miss." This tale doesn't name its place: the west portal, or a canon detail of it such as the upper town, the engineers or the bus to the bridge. "The river" belongs to the whole district, so the tile reads as duty alone. [EDIT95#3.1] Fix: "At the west portal, buses carry engineers to the bridge. We need the bus fleet's data; meet the bus."
Total: 10 − 2 = 8.
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
| MA1 | The welcome wall shows your face and the word WELCOME. Stand in the road until a colleague notices you. | 19 |
| MB1 | Battery 1 is fitted. Staff watch from the podium bridge; you join the road and dash into a colleague. | 19 |
| MC1 | The drum warns every colleague of each bend. Step off the high road onto a car; gravity is company policy. | 20 |
| MC2 | The raised road runs through this tower. Take the final hit up there, and Certification comes closer. | 17 |
| MB2 | The plaque reads ZERO ACCIDENTS, a target. Walk or stand beside it until a colleague finds you. | 17 |
| MA2 | The neon shops flash prices at the traffic. Hands 1 is fitted: place a cone, and let a colleague react. | 20 |
| MA3 | Each cube rests on the one before. Chain your hits the same way; the last link writes you off. | 19 |
| MB3 | Legs 1 is fitted. The screens advertise to each other; jump into a car between them. | 16 |
| MC3 | Under the gateway, your file reads ROLE: DESTRUCTIVE TESTING. Let one colleague throw you into the next. | 17 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The lantern is lit for the Expo's clients. Arms 1 is fitted: push off one car into the next. | 19 |
| PC2 | On opening day, our board will watch from these terraces. A van delivers the catering; let it deliver you. | 19 |
| PC3 | The arch is the Expo's gate. Clients enter when the park passes; chain each hit to the last. | 18 |
| PB3 | On opening day, police escort a school party to the obelisk. Take a police car's hit first. | 17 |
| PA3 | A wedding is booked on the belvedere. Legs 2 is fitted: jump into a car, so no guest does. | 19 |
| PA2 | The dome awaits clients. Hands 2 is fitted: lay a cone, and let the car that reacts write you off. | 20 |
| PA1 | Arms 2 is fitted. Teach the cars to stop before the reservoir: push off one, into the next. | 18 |
| PB1 | The cascade steps down beside the highway. Climb to the raised road; a write-off there serves our clients. | 18 |
| PB2 | Battery 2 is fitted. The board watches the ring; end a long chain on a car for our clients. | 19 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | At the west portal, buses carry engineers to the bridge. We need the bus fleet's data; meet the bus. | 19 |
| WB1 | Legs 3 is fitted: the longest flight. Jump at a car by the tunnel portal; your data serves our clients. | 20 |
| WC1 | The police check papers at the east portal. Take your final hit from a police car; your papers follow. | 19 |
| WC2 | Beyond the rail, ships wait to carry Certified dummies to clients. Drop onto a car below. | 16 |
| WC3 | The customs post logs every dummy shipped to our clients. Be thrown into a car, and earn your entry. | 19 |
| WB3 | Show Chassis 0 how far the model has come. Arms 3 is fitted: push off one car into the next. | 20 |
| WA3 | Your customs entry reads DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. Honour the declaration on the raised road. | 18 |
| WA2 | Sand on the west beach terrace came from three provinces. Place a cone; the car that reacts writes you off. | 20 |
| WB2 | The monument is cast from every write-off. Battery 3 is fitted: finish the chain and ship Certified. | 17 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all 39 texts against tone (T1–T5, T13, T14), vocabulary and lore (V1–V4, V6, V8–V11), formatting (F5–F8, F10) and truth (R4, R5). The batch states the sacrifice plainly in act-waterfront and repeats no slogan in more than two texts. Every tale names its landmark or a canon detail of it, turns that place toward its brief's duty, and fits equipment only on the tile that issues it. [EDIT95#3.1] [EDIT95#3.2] [EDIT95#3.3] [EDIT95#4.2] [STORY#S1] [STORY#S2] [STORY#S3] [STORY#MA1]–[STORY#WB2] [PLAY#PS5]
Total: 10.
```

### Confirmation 4: 10/10

```
SCORE: 10/10
REASON:
- None.

I checked all 37 texts for tone, vocabulary, formatting and truth, and found no violations. Tone: each line is flat and motivating, frames harm as progress, and uses no exclamation marks [EDIT95#3.2]. Vocabulary: only glossary words are used, the company is named correctly, and Farsight, grid codes and game words never appear [EDIT95#0, EDIT95#3.1]. The story frame holds, and ZERO ACCIDENTS and ROLE: DESTRUCTIVE TESTING are exact [EDIT95#3.3]. Every tale names its landmark or a canon detail of it, such as the rail, the customs entry or Chassis 0 [EDIT95#3.1]. Equipment is named only on the tile that issues it, and each tale's duty matches its brief [STORY#S1, STORY#S3]. Lint found no length problems. The batch passes T14: the slogan "brings Certification closer" appears in only two texts, n01 and n02. It passes V10: act-waterfront states the sacrifice plainly.
Total: 10.
```
