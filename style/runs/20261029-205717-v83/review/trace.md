# review · V8 batch · The story and the opening lines, on V2.7; the user's lines locked

- **Scores:** 6 → 8 → 9 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 3 refinement(s).
- **Calls:** 8 · 372.3 s · $2.4963. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

| Item | Text | Words |
|---|---|---|
| n36 | You are a crash-test dummy. Cars avoid you: get hit anyway, combos count more, and upgrades follow. | 17 |
| n02 | Welcome, trainee. Every write-off brings Certification closer. | 7 |
| n03 | Get your Dummy Certification in Shenzhen Smart City and learn about the Corporation. | 13 |
| n34 | Get hit in fun, creative, and destructive ways before the vehicles run out. | 13 |
| n24 | Neon shops, LED walls; one road splits round the monument under the walkway ring. Your training begins here. | 18 |
| n25 | Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients. | 17 |
| n26 | A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients. | 19 |
| n37 | Write off bodies; every {Q} write-offs, the grade rises. Earn points until the vehicles run out. | 16 |
| act-monument | Dummy Corporation welcomes you off the factory floor. The cars are your colleagues; Certification is your goal. | 17 |
| MA1 | Fresh off the factory floor, you're ready to do some damage to yourself. Make your engineers proud. | 17 |
| MB1 | Battery 1 is fitted. The skybridge was built for shoppers who never came; staff watch you dash into a colleague. | 20 |
| MC1 | The LED drum lights each bend for colleagues. Step off the high road onto a car: gravity is company policy. | 20 |
| MC2 | The road runs through the portal tower at the sixth floor. Take your write-off up there; ignore the view. | 19 |
| MB2 | The plaque reads ZERO ACCIDENTS: a target, not a record. Stand or walk near it until a colleague finds you. | 20 |
| MA2 | The neon shops sell nothing, but the traffic reads them. Hands 1 is fitted: bait a colleague with a cone. | 20 |
| MA3 | The stacked cubes rose one budget at a time. Build the same way: one hit, then another, quickly. | 18 |
| MB3 | Two screens advertise to each other all night. Legs 1 is fitted: jump into a car between them. | 18 |
| MC3 | The gateway thanked the car that wrote you off for driving safely. Let one colleague throw you into the next. | 20 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The lantern, the Expo's first exhibit, is lit for clients. With Arms 1, push off one car into the next. | 20 |
| PC2 | Our board watches opening day from these terraces. A van delivers the catering; arrange for it to deliver you. | 19 |
| PC3 | The arch is the Expo's gate; visitors circle the roundabout once. You go faster: chain hits before each is forgotten. | 20 |
| PB3 | The obelisk marks the surveyors' first stake. Police escort a school party here on opening day; test them first. | 19 |
| PA3 | A wedding faces the traffic from the belvedere. Legs 2 is fitted: jump into a car, so no guest does. | 20 |
| PA2 | The dome is the Expo's showroom; you are the exhibit. Hands 2 is fitted: bait a car with a cone. | 20 |
| PA1 | The gardener's pools need cars that stop. Teach them with Arms 2: push off one car into the next. | 19 |
| PB1 | The cascade was built to drown out the traffic. The traffic got louder; take your hit up on the highway. | 20 |
| PB2 | The board watches the ring over the pools, where cars come round clean. Battery 2 is fitted: chain your hits. | 20 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | The bus carries engineers through the west portal to the bridge. Take its hit; Certified dummies cross to our clients. | 20 |
| WB1 | Cars go into the tunnel under the hill, and data comes back. Legs 3 is fitted: jump into one. | 19 |
| WC1 | The east portal faces away from its twin. Police here check papers; your Certification needs their fleet on record. | 19 |
| WC2 | The east beach terrace served tourists, then sensors. Drop from its rail onto a car; ships wait for the Certified. | 20 |
| WC3 | The pier tower logs all that floats: containers, ducks, one dummy. Be thrown into a car to earn your entry. | 20 |
| WB3 | The stilt houses keep Chassis 0 behind glass. Arms 3 is fitted; push off a car and show it progress. | 20 |
| WA3 | The west tower keeps the customs log. Your entry reads PURPOSE DESTRUCTION: honour it on the raised road. | 18 |
| WA2 | Sand from three provinces lies under the west beach terrace. Place a cone; one more clean reading before the ceremony. | 20 |
| WB2 | The circus monument, cast from your written-off chassis, reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted; chain your hits. | 20 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 1: 6/10

Lint evidence:

- batch:is fitted jump into · T14 (minor) 'is fitted jump into' in 3 texts (MB3, PA3, WB1) > 2 (style.bark.maxStockEndings)

```
SCORE: 6/10
REASON:
- n36 · T3 (major, −2) "combos count more, and upgrades follow" This presents the training as a game with points and power-ups, but the Corporation's parts are equipment and its goal is Certification. [EDIT95#3.1] Fix: "You are a Dummy Corporation trainee. Cars avoid you: get hit anyway, chain your hits, and earn equipment."
- WA1 · F11 (minor, −1) "Certified dummies cross to our clients" This clause repeats the Act III line ("Certified dummies ship across the river… to our clients") and pads the tale instead of adding a detail of the west portal. [EDIT97#3.2] Fix: "The bus carries engineers through the west portal to the bridge. It never misses; take its hit."
- WB1 · T14 (minor, −1) "is fitted: jump into" The four-word phrase "is fitted jump into" appears in three texts (MB3, PA3, WB1), and the limit is two. [SUB4#6.1] Fix: "Cars go into the tunnel under the hill, and data comes back. Legs 3 is fitted: leap into one."
Total: 10 − 2 − 1 − 1 = 6.
```

## After refinement 1 (refiner)

| Item | Text | Words |
|---|---|---|
| n36 | You are a Dummy Corporation trainee. Cars avoid you: get hit anyway, chain your hits, and earn equipment. | 18 |
| n02 | Welcome, trainee. Every write-off brings Certification closer. | 7 |
| n03 | Get your Dummy Certification in Shenzhen Smart City and learn about the Corporation. | 13 |
| n34 | Get hit in fun, creative, and destructive ways before the vehicles run out. | 13 |
| n24 | Neon shops, LED walls; one road splits round the monument under the walkway ring. Your training begins here. | 18 |
| n25 | Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients. | 17 |
| n26 | A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients. | 19 |
| n37 | Write off bodies; every {Q} write-offs, the grade rises. Earn points until the vehicles run out. | 16 |
| act-monument | Dummy Corporation welcomes you off the factory floor. The cars are your colleagues; Certification is your goal. | 17 |
| MA1 | Fresh off the factory floor, you're ready to do some damage to yourself. Make your engineers proud. | 17 |
| MB1 | Battery 1 is fitted. The skybridge was built for shoppers who never came; staff watch you dash into a colleague. | 20 |
| MC1 | The LED drum lights each bend for colleagues. Step off the high road onto a car: gravity is company policy. | 20 |
| MC2 | The road runs through the portal tower at the sixth floor. Take your write-off up there; ignore the view. | 19 |
| MB2 | The plaque reads ZERO ACCIDENTS: a target, not a record. Stand or walk near it until a colleague finds you. | 20 |
| MA2 | The neon shops sell nothing, but the traffic reads them. Hands 1 is fitted: bait a colleague with a cone. | 20 |
| MA3 | The stacked cubes rose one budget at a time. Build the same way: one hit, then another, quickly. | 18 |
| MB3 | Two screens advertise to each other all night. Legs 1 is fitted: jump into a car between them. | 18 |
| MC3 | The gateway thanked the car that wrote you off for driving safely. Let one colleague throw you into the next. | 20 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The lantern, the Expo's first exhibit, is lit for clients. With Arms 1, push off one car into the next. | 20 |
| PC2 | Our board watches opening day from these terraces. A van delivers the catering; arrange for it to deliver you. | 19 |
| PC3 | The arch is the Expo's gate; visitors circle the roundabout once. You go faster: chain hits before each is forgotten. | 20 |
| PB3 | The obelisk marks the surveyors' first stake. Police escort a school party here on opening day; test them first. | 19 |
| PA3 | A wedding faces the traffic from the belvedere. Legs 2 is fitted: jump into a car, so no guest does. | 20 |
| PA2 | The dome is the Expo's showroom; you are the exhibit. Hands 2 is fitted: bait a car with a cone. | 20 |
| PA1 | The gardener's pools need cars that stop. Teach them with Arms 2: push off one car into the next. | 19 |
| PB1 | The cascade was built to drown out the traffic. The traffic got louder; take your hit up on the highway. | 20 |
| PB2 | The board watches the ring over the pools, where cars come round clean. Battery 2 is fitted: chain your hits. | 20 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | The bus carries engineers through the west portal to the bridge. It never misses; take its hit. | 17 |
| WB1 | Cars go into the tunnel under the hill, and data comes back. Legs 3 is fitted: leap into one. | 19 |
| WC1 | The east portal faces away from its twin. Police here check papers; your Certification needs their fleet on record. | 19 |
| WC2 | The east beach terrace served tourists, then sensors. Drop from its rail onto a car; ships wait for the Certified. | 20 |
| WC3 | The pier tower logs all that floats: containers, ducks, one dummy. Be thrown into a car to earn your entry. | 20 |
| WB3 | The stilt houses keep Chassis 0 behind glass. Arms 3 is fitted; push off a car and show it progress. | 20 |
| WA3 | The west tower keeps the customs log. Your entry reads PURPOSE DESTRUCTION: honour it on the raised road. | 18 |
| WA2 | Sand from three provinces lies under the west beach terrace. Place a cone; one more clean reading before the ceremony. | 20 |
| WB2 | The circus monument, cast from your written-off chassis, reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted; chain your hits. | 20 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 2: 8/10

```
SCORE: 8/10
REASON:
- n37 · V3 (major, −2) "Earn points until the vehicles run out." "Points" is a game's word, and the glossary frames the work as training and write-offs, not scoring. [EDIT95#3.1] Fix: "Write off bodies; every {Q} write-offs, the grade rises. Keep training until the vehicles run out."
Total: 10 − 2 = 8.
```

## After refinement 2 (refiner)

| Item | Text | Words |
|---|---|---|
| n36 | You are a Dummy Corporation trainee. Cars avoid you: get hit anyway, chain your hits, and earn equipment. | 18 |
| n02 | Welcome, trainee. Every write-off brings Certification closer. | 7 |
| n03 | Get your Dummy Certification in Shenzhen Smart City and learn about the Corporation. | 13 |
| n34 | Get hit in fun, creative, and destructive ways before the vehicles run out. | 13 |
| n24 | Neon shops, LED walls; one road splits round the monument under the walkway ring. Your training begins here. | 18 |
| n25 | Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients. | 17 |
| n26 | A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients. | 19 |
| n37 | Write off bodies; every {Q} write-offs, the grade rises. Keep training until the vehicles run out. | 16 |
| act-monument | Dummy Corporation welcomes you off the factory floor. The cars are your colleagues; Certification is your goal. | 17 |
| MA1 | Fresh off the factory floor, you're ready to do some damage to yourself. Make your engineers proud. | 17 |
| MB1 | Battery 1 is fitted. The skybridge was built for shoppers who never came; staff watch you dash into a colleague. | 20 |
| MC1 | The LED drum lights each bend for colleagues. Step off the high road onto a car: gravity is company policy. | 20 |
| MC2 | The road runs through the portal tower at the sixth floor. Take your write-off up there; ignore the view. | 19 |
| MB2 | The plaque reads ZERO ACCIDENTS: a target, not a record. Stand or walk near it until a colleague finds you. | 20 |
| MA2 | The neon shops sell nothing, but the traffic reads them. Hands 1 is fitted: bait a colleague with a cone. | 20 |
| MA3 | The stacked cubes rose one budget at a time. Build the same way: one hit, then another, quickly. | 18 |
| MB3 | Two screens advertise to each other all night. Legs 1 is fitted: jump into a car between them. | 18 |
| MC3 | The gateway thanked the car that wrote you off for driving safely. Let one colleague throw you into the next. | 20 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The lantern, the Expo's first exhibit, is lit for clients. With Arms 1, push off one car into the next. | 20 |
| PC2 | Our board watches opening day from these terraces. A van delivers the catering; arrange for it to deliver you. | 19 |
| PC3 | The arch is the Expo's gate; visitors circle the roundabout once. You go faster: chain hits before each is forgotten. | 20 |
| PB3 | The obelisk marks the surveyors' first stake. Police escort a school party here on opening day; test them first. | 19 |
| PA3 | A wedding faces the traffic from the belvedere. Legs 2 is fitted: jump into a car, so no guest does. | 20 |
| PA2 | The dome is the Expo's showroom; you are the exhibit. Hands 2 is fitted: bait a car with a cone. | 20 |
| PA1 | The gardener's pools need cars that stop. Teach them with Arms 2: push off one car into the next. | 19 |
| PB1 | The cascade was built to drown out the traffic. The traffic got louder; take your hit up on the highway. | 20 |
| PB2 | The board watches the ring over the pools, where cars come round clean. Battery 2 is fitted: chain your hits. | 20 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | The bus carries engineers through the west portal to the bridge. It never misses; take its hit. | 17 |
| WB1 | Cars go into the tunnel under the hill, and data comes back. Legs 3 is fitted: leap into one. | 19 |
| WC1 | The east portal faces away from its twin. Police here check papers; your Certification needs their fleet on record. | 19 |
| WC2 | The east beach terrace served tourists, then sensors. Drop from its rail onto a car; ships wait for the Certified. | 20 |
| WC3 | The pier tower logs all that floats: containers, ducks, one dummy. Be thrown into a car to earn your entry. | 20 |
| WB3 | The stilt houses keep Chassis 0 behind glass. Arms 3 is fitted; push off a car and show it progress. | 20 |
| WA3 | The west tower keeps the customs log. Your entry reads PURPOSE DESTRUCTION: honour it on the raised road. | 18 |
| WA2 | Sand from three provinces lies under the west beach terrace. Place a cone; one more clean reading before the ceremony. | 20 |
| WB2 | The circus monument, cast from your written-off chassis, reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted; chain your hits. | 20 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 3: 9/10

```
SCORE: 9/10
REASON:
- tale · F11 (minor, −1) "The board watches the ring over the pools, where cars come round clean. Battery 2 is fitted: chain your hits." Tale lengths barely vary: 16 of 26 tales sit at exactly 20 words and the rest run 17 to 19, so most sit at the cap and are padded. [EDIT97#3.2] Fix: Make the one-image tiles shorter. PB2: "The board watches the ring over the pools. Battery 2 is fitted: chain your hits." (15). MC1: "The LED drum lights each bend. Step off the high road onto a car: gravity is company policy." (18). MB2: "The plaque reads ZERO ACCIDENTS: a target, not a record. Stand near it until a colleague finds you." (18).
Total: 10 − 1 = 9.
```

## After refinement 3 (refiner)

| Item | Text | Words |
|---|---|---|
| n36 | You are a Dummy Corporation trainee. Cars avoid you: get hit anyway, chain your hits, and earn equipment. | 18 |
| n02 | Welcome, trainee. Every write-off brings Certification closer. | 7 |
| n03 | Get your Dummy Certification in Shenzhen Smart City and learn about the Corporation. | 13 |
| n34 | Get hit in fun, creative, and destructive ways before the vehicles run out. | 13 |
| n24 | Neon shops, LED walls; one road splits round the monument under the walkway ring. Your training begins here. | 18 |
| n25 | Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients. | 17 |
| n26 | A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients. | 19 |
| n37 | Write off bodies; every {Q} write-offs, the grade rises. Keep training until the vehicles run out. | 16 |
| act-monument | Dummy Corporation welcomes you off the factory floor. The cars are your colleagues; Certification is your goal. | 17 |
| MA1 | Fresh off the factory floor, you're ready to do some damage to yourself. Make your engineers proud. | 17 |
| MB1 | Battery 1 is fitted. The skybridge was built for shoppers who never came; staff watch you dash into a colleague. | 20 |
| MC1 | The LED drum lights each bend. Step off the high road onto a car: gravity is company policy. | 18 |
| MC2 | The road runs through the portal tower at the sixth floor. Take your write-off up there; ignore the view. | 19 |
| MB2 | The plaque reads ZERO ACCIDENTS: a target, not a record. Stand near it until a colleague finds you. | 18 |
| MA2 | The neon shops sell nothing, but the traffic reads them. Hands 1 is fitted: bait a colleague with a cone. | 20 |
| MA3 | The stacked cubes rose one budget at a time. Build the same way: one hit, then another, quickly. | 18 |
| MB3 | Two screens advertise to each other all night. Legs 1 is fitted: jump into a car between them. | 18 |
| MC3 | The gateway thanked the car that wrote you off for driving safely. Let one colleague throw you into the next. | 20 |
| act-parkland | The Expo opens to clients when this park passes. Your training keeps them safe. | 14 |
| PC1 | The lantern, the Expo's first exhibit, is lit for clients. With Arms 1, push off one car into the next. | 20 |
| PC2 | Our board watches opening day from these terraces. A van delivers the catering; arrange for it to deliver you. | 19 |
| PC3 | The arch is the Expo's gate; visitors circle the roundabout once. You go faster: chain hits before each is forgotten. | 20 |
| PB3 | The obelisk marks the surveyors' first stake. Police escort a school party here on opening day; test them first. | 19 |
| PA3 | A wedding faces the traffic from the belvedere. Legs 2 is fitted: jump into a car, so no guest does. | 20 |
| PA2 | The dome is the Expo's showroom; you are the exhibit. Hands 2 is fitted: bait a car with a cone. | 20 |
| PA1 | The gardener's pools need cars that stop. Teach them with Arms 2: push off one car into the next. | 19 |
| PB1 | The cascade was built to drown out the traffic. The traffic got louder; take your hit up on the highway. | 20 |
| PB2 | The board watches the ring over the pools. Battery 2 is fitted: chain your hits. | 15 |
| act-waterfront | Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared. | 19 |
| WA1 | The bus carries engineers through the west portal to the bridge. It never misses; take its hit. | 17 |
| WB1 | Cars go into the tunnel under the hill, and data comes back. Legs 3 is fitted: leap into one. | 19 |
| WC1 | The east portal faces away from its twin. Police here check papers; your Certification needs their fleet on record. | 19 |
| WC2 | The east beach terrace served tourists, then sensors. Drop from its rail onto a car; ships wait for the Certified. | 20 |
| WC3 | The pier tower logs all that floats: containers, ducks, one dummy. Be thrown into a car to earn your entry. | 20 |
| WB3 | The stilt houses keep Chassis 0 behind glass. Arms 3 is fitted; push off a car and show it progress. | 20 |
| WA3 | The west tower keeps the customs log. Your entry reads PURPOSE DESTRUCTION: honour it on the raised road. | 18 |
| WA2 | Sand from three provinces lies under the west beach terrace. Place a cone; one more clean reading before the ceremony. | 20 |
| WB2 | The circus monument, cast from your written-off chassis, reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted; chain your hits. | 20 |
| ending | Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship. | 19 |

### Evaluation 4: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all 39 texts against the rules for Dummy Corporation's voice. Tone and voice (T1–T5, T13) were checked against [EDIT95#3.2] and [PLAY#PS2]. Batch slogan repeats (T14) were checked against [PLAY#PS5]: none of the near-repeats ("push off one car into the next", "Certified dummies ship across", "off the factory floor", "jump into a car") appears in more than two texts, and "chain your hits" is only three words. The sacrifice (V10) is stated plainly in act-waterfront, as [EDIT95#3.1] requires. The story frame (V6) holds for INDUCTION, OPENING DAY and CUSTOMS, and ZERO ACCIDENTS is quoted exactly [EDIT95#3.3]. Every tale names its place, or a detail of it from the canon (V11). Every tile that issues equipment names it (F7) [STORY#S1]. Each tale's duty matches its brief, and no equipment appears before its tile (R5) [EDIT93#3.1]. Lengths, sentence counts and placeholders (F5, F6, F10) were checked against [EDIT98#3.2], and every notice fits its character limit. Farsight and the banned words appear nowhere (V1) [EDIT95#0]. The locked items n03, n34 and MA1 were not scored; they counted only for T14.
Total: 10.
```

### Confirmation 5: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all 39 items against the Dummy Corporation rules. That covered tone and the absence of "!" (T1–T5, T13), the training frame and the act frames ([EDIT95#3.1], [EDIT95#3.3]) and the glossary and company name ([EDIT95#4.2], [FLEET#F3]). I also checked tale length of 15 to 20 words in at most two sentences ([EDIT98#3.2]). Each tale names its landmark and turns it to the duty, and each duty and part matches its brief and issuing tile ([STORY#S1], [EDIT93#3.1]). Act-waterfront states the sacrifice plainly, which satisfies V10. No four-word phrase appears in more than two texts, so T14 holds.
Total: 10.
```
