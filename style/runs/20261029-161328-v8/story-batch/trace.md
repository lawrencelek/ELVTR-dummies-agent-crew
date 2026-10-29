# story-batch · V8 batch · The story's 31 texts as one batch

- **Scores:** 5 → 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 6 · 242.1 s · $1.7012. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

| Item | Text | Words |
|---|---|---|
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
| PC2 | Opening day: our board watches from these terraces. A van delivers the catering; let it deliver you. | 17 |
| PC3 | The arch is the Expo's gate. Clients enter when the park passes; chain each hit to the last. | 18 |
| PB3 | On opening day, police escort a school party to the obelisk. Take a police car's hit first. | 17 |
| PA3 | A wedding is booked on the belvedere. Legs 2 is fitted: jump into a car, so no guest does. | 19 |
| PA2 | The dome awaits clients. Hands 2 is fitted: lay a cone, and let the car that reacts write you off. | 20 |
| PA1 | Arms 2 is fitted. Push off one car into the next; that write-off brings Certification closer. | 16 |
| PB1 | The cascade steps down beside the highway. Climb to the raised road; a write-off there serves our clients. | 18 |
| PB2 | Battery 2 is fitted. The board watches the ring; end a long chain on a car for our clients. | 19 |
| act-waterfront | Ships wait across the river to carry Certified dummies to our clients. Your papers are being prepared. | 17 |
| WA1 | We need the bus fleet's data before Certified dummies ship across the river. Meet the bus; it will not miss. | 20 |
| WB1 | Legs 3 is fitted: the longest flight. Jump into a car at the portal; every write-off brings Certification closer. | 19 |
| WC1 | The police check papers at the east portal. Take your final hit from a police car; your papers follow. | 19 |
| WC2 | Beyond the rail, ships wait to carry Certified dummies to clients. Drop onto a car below. | 16 |
| WC3 | The customs post logs every dummy shipped to our clients. Be thrown into a car, and earn your entry. | 19 |
| WB3 | Show Chassis 0 how far the model has come. Arms 3 is fitted: push off one car into the next. | 20 |
| WA3 | Your customs entry reads DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. Honour the declaration on the raised road. | 18 |
| WA2 | Place a cone. The car that reacts to it writes you off, and brings Certification closer. | 16 |
| WB2 | The monument is cast from every write-off. Battery 3 is fitted: finish the chain and ship Certified. | 17 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 1: 5/10

Lint evidence:

- batch:write off brings certification · T14 (minor) 'write off brings certification' in 4 texts (MB1, MB3, PA1, WB1) > 2 (style.bark.maxStockEndings)
- batch:jump into a car · T14 (minor) 'jump into a car' in 3 texts (MB3, PA3, WB1) > 2 (style.bark.maxStockEndings)
- batch:one car into the · T14 (minor) 'one car into the' in 3 texts (PC1, PA1, WB3) > 2 (style.bark.maxStockEndings)

```
SCORE: 5/10
REASON:
- batch · T14 (minor, −1) "write off brings certification" The slogan appears in four texts (MB1, MB3, PA1, WB1), and the cap is two. The longer form "brings Certification closer" also appears in WA2, which makes five. [SUB4#6.1] Fix: keep the slogan in MB1 and MB3 only. Set PA1 to "Arms 2 is fitted: a stronger push. Push off one car; let the next one write you off." Set WB1 to "Legs 3 is fitted: the longest flight. Jump at a car in the tunnel portal; your data goes north." Set WA2 to "Place a cone where the ceremony traffic turns. The car that reacts to it writes you off."
- batch · T14 (minor, −1) "jump into a car" The phrase appears in three texts (MB3, PA3, WB1), and the cap is two. [SUB4#6.1] Fix: use the WB1 rewrite above ("Jump at a car in the tunnel portal"), which leaves the phrase in MB3 and PA3 only.
- batch · T14 (minor, −1) "one car into the" The phrase appears in three texts (PC1, PA1, WB3), and the cap is two. [SUB4#6.1] Fix: use the PA1 rewrite above ("Push off one car; let the next one write you off."), which leaves the phrase in PC1 and WB3 only.
- act-waterfront · V10 (major, −2) "Ships wait across the river to carry Certified dummies to our clients." No text in the batch states plainly that Certified dummies are sacrificed in service to clients. Here they are only shipped, in the ending they are only manufactured, and WA3's "PURPOSE DESTRUCTION" is about testing. [EDIT95#3.1] Fix: replace act-waterfront with "Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared."
Total: 10 − 1 − 1 − 1 − 2 = 5.
```

## After refinement 1 (refiner)

| Item | Text | Words |
|---|---|---|
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
| PC2 | Opening day: our board watches from these terraces. A van delivers the catering; let it deliver you. | 17 |
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

### Evaluation 2: 8/10

```
SCORE: 8/10
REASON:
- PC2 · V6 (major, −2) "Opening day: our board watches from these terraces." The present tense says it is already opening day on tile 2 of 9, but the act frame opens the Expo only when the park passes. [EDIT95#3.3] Fix: "On opening day, our board will watch from these terraces. A van delivers the catering; let it deliver you."
Total: 10 − 2 = 8.
```

## After refinement 2 (refiner)

| Item | Text | Words |
|---|---|---|
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

### Evaluation 3: 10/10

```
SCORE: 10/10
REASON:
- None. All 31 texts pass every rule: tone T1–T5, T13 and T14 [EDIT95#3.2, PLAY#PS2, SUB4#6.1]; glossary and story frame V1–V10, including the plain sacrifice statement in act-waterfront and the exact phrases ZERO ACCIDENTS and ROLE: DESTRUCTIVE TESTING [EDIT95#3.1, EDIT95#3.3, STORY#S2]; caps F5–F7 [EDIT95#3.2, STORY#S1]; and R4–R5, where each duty matches its brief and each part appears on the tile that issues it [STORY#S3, STORY#S1, EDIT93#3.1, STORY#MA1–STORY#WB2]. Lint found nothing.
Total: 10.
```

### Confirmation 4: 10/10

```
SCORE: 10/10
REASON:
- None. I checked every text for tone, vocabulary, length and truth (T1–T5, T13, V1–V10, F5–F7, R4–R5), and the batch for T14 and V10: each tale matches its tile's brief and equipment ([STORY#S1], [STORY#S3], [STORY#MA1]–[STORY#WB2]), the act frames hold ([EDIT95#3.3]), no slogan of four or more words appears in more than two texts, and act-waterfront states the sacrifice plainly ([EDIT95#3.1]).
Total: 10.
```
