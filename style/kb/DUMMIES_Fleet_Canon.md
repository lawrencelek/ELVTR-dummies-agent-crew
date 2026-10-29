# Fleet database canon

Generated from `content/db/fleet.json` (decision 117). The database is the source; edit it, not this page.

## F1 Canon

- **Setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX.
- **Company:** FARSIGHT.
- **Look:** Sinofuturist cyber city (decision 113).
- **Premise:** Vehicles are the city's workers. They want to qualify. The dummy wants to leave.
- **City names allowed:** Shenzhen.

## F2 Voice

- Vehicles speak as workers, not lore narrators.
- Corporate politeness barely contains their personalities.
- Barks react to logged events only. Never claim what did not happen.
- Lines are at most 48 characters, end with . ! or ?, and react to logged events only.
- **Banned words** (never in a line): kill, killed, die, died, dead, death, player, level, game, score, respawn, lives, Chongqing, Tesla, Toyota, BYD.

## F3 Terms

- **subject:** What FARSIGHT and the fleet call the dummy
- **write-off:** A destroyed body
- **chassis:** One body of the dummy
- **certification:** The fleet passing its test
- **retraining:** What a car fears most
- **dispatch:** The cars' management
- **route:** A car's planned path
- **bay:** Where a new chassis is issued

## F4 Tiers and temperament

| Tier | Name | Temperament | Voice |
|---|---|---|---|
| 01 | Luxury | confident | Polished, superior, faintly amused. Never apologises. |
| 02 | Corporate | calm | Procedural. Speaks in logs, KPIs and policy numbers. |
| 03 | Consumer | melancholy | Tired and resigned. Expects the worst, usually right. |
| 04 | Budget | angry | Short-fused. Politeness bolted on over the rage. |

## F5 Classes and jobs

| Class | Family | Tag letter | Job | Behaviour |
|---|---|---|---|---|
| sports | Comet | R | Express couriers for anything late | Late commitment; tight clearance |
| wagon | Harbour | W | Family and care transport | Wide clearance; long prediction |
| suv | Bastion | U | Escort, survey and security runs | Brakes before a wide turn |
| hatchback | Pebble | H | Short city hops and meal runs | One signalled recommitment |
| sedan | Meridian | S | Taxis and chauffeurs | Swerves with moderate clearance |
| police | Warden | P | Traffic enforcement | Tracks your approach, then commits |
| van | Porter | V | Parcels, maintenance and lab supply | Brakes, then swerves late |
| bus | Commons | B | Shuttles and night lines | Only brakes; cannot swerve |

## F6 Models in the P3 city

Only these models run in the P3.3 simulation. A line bound to any other model, tier or class never fires.

| Model | Tag | Line | Callsign | Tier | Class | Job | Temperament |
|---|---|---|---|---|---|---|---|
| SED-01-001 | S01 | Meridian Imperial | Ambassador | 01 | sedan | Chauffeurs FARSIGHT board members | confident |
| VAN-02-001 | V02 | Porter Office | Waybill | 02 | van | Parcel route 44, two hundred drops a day | calm |

## F7 Roster (32 type-tiers)

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

## F8 Line conditions and claims

- Shared context a line may test: model, tier, class, seniority, mood, wear, owns, broken, district.
- **impact** carries: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate.
- **writeoff** carries: writeOffs, chassis, zone, drop, dropZ, dropFrom, deck, plate.
- **near-miss** carries: gap, speed, lunging.
- **miss** carries: gap.
- **commit** carries: cause, man.
- **honk** carries: at.
- **interrupt** carries: by.
- **unstick** carries: how.
- **touch-spent** carries: no fields.
- **knock** carries: speed.
- **learned** carries: from, to.
- **upgrade-seen** carries: node.
- **part-seen** carries: part.
- A claim is a fact the line asserts (`stopped`, `zone:front`, `node:hips`, `drop`, `highway`, `plate`, `dropFrom:roof`). Its conditions must guarantee it.

## F9.1 Existing lines: impact

| When | Style | Priority | Line |
|---|---|---|---|
| {"zone": ["front", "frontDiagonal"], "tier": "01"} | shout | 2 | Bumper damage on a Luxury trim. Typical. |
| {"zone": ["front", "frontDiagonal"], "tier": "01"} | shout | 2 | You will be invoiced for that. |
| {"zone": ["side"], "tier": "01"} | shout | 2 | My door panel! Hand-finished! |
| {"zone": ["rear", "rearDiagonal"], "tier": "01"} | shout | 2 | From behind? How very common. |
| {"zone": ["front", "frontDiagonal"], "tier": "02"} | shout | 2 | Front contact. Incident 4471 opened. |
| {"zone": ["front", "frontDiagonal"], "tier": "02"} | shout | 2 | Impact logged. KPIs adjusted. |
| {"zone": ["side"], "tier": "02"} | shout | 2 | Side contact. Filing under unforeseen. |
| {"zone": ["rear", "rearDiagonal"], "tier": "02"} | shout | 2 | Rear contact. Not my liability. |
| {"zone": ["front", "frontDiagonal"], "tier": "03"} | shout | 2 | Of course it was me. |
| {"zone": ["front", "frontDiagonal"], "tier": "03"} | shout | 2 | And the day was going so averagely. |
| {"zone": ["side"], "tier": "03"} | shout | 2 | Side panel. Add it to the list. |
| {"zone": ["rear", "rearDiagonal"], "tier": "03"} | shout | 2 | Hit from behind. Story of my life. |
| {"zone": ["front", "frontDiagonal"], "tier": "04"} | shout | 2 | OI! Right in the grille! Kind regards. |
| {"zone": ["front", "frontDiagonal"], "tier": "04"} | shout | 2 | You absolute bollard! Respectfully. |
| {"zone": ["side"], "tier": "04"} | shout | 2 | My side! Watch it, you plank! |
| {"zone": ["rear", "rearDiagonal"], "tier": "04"} | shout | 2 | My boot! Come back here! |
| {"bait": true} | thought | 2 | It left my path, then came back. Rude. |
| {"bait": true, "tier": "02"} | thought | 2 | It waited for my route to lock. Clever. |
| {"stopped": true} | speech | 2 | I was stationary. Please note I was stationary. |
| {"stopped": true, "tier": "04"} | shout | 2 | I had stopped! I was being good! |
| {"seniority": {"min": 2}} | thought | 2 | I was trained for this. It happened anyway. |
| {"seniority": {"min": 3}, "tier": "03"} | thought | 2 | Senior model. Hit like an intern. |
| {"seniority": {"max": 0}, "tier": "03"} | speech | 2 | First week on the job. Great. |
| {"class": "bus"} | speech | 2 | Passengers, please remain seated. |
| {"class": "police"} | shout | 2 | Assaulting an officer. Noted. |
| {"class": "van"} | speech | 2 | Parcel intact. Nerves are not. |
| {"class": "sports"} | shout | 2 | You scratched the clear coat! |
| {} | speech | 2 | Contact registered. |
| {"class": "wagon"} | shout | 2 | Not in front of the children! |
| {"class": "suv"} | speech | 2 | Escort formation broken. Regrouping. |
| {"class": "sedan"} | speech | 2 | Meter is still running, you know. |
| {"model": "HAT-03-001"} | speech | 2 | I only went out for noodles. |
| {"model": "SED-01-001"} | speech | 2 | The board will hear of this. |

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

## F9.4 Existing lines: miss

| When | Style | Priority | Line |
|---|---|---|---|
| {"tier": "01"} | mutter | 1 | Is it dancing? How quaint. |
| {"tier": "01"} | mutter | 1 | Missed. One expected nothing less. |
| {"tier": "02"} | mutter | 1 | Dash detected. No contact. Noted. |
| {"tier": "02"} | mutter | 1 | Missed. Updating my calendar. |
| {"tier": "03"} | mutter | 1 | It missed. Even it gave up on me. |
| {"tier": "03"} | mutter | 1 | It lunged. Nothing happened. Same. |
| {"tier": "04"} | mutter | 1 | Missed! Rubbish! Regards! |
| {"tier": "04"} | mutter | 1 | Ha! Do it properly! |
| {"broken": "legs"} | mutter | 1 | Its legs have gone. It cannot reach. |
| {} | speech | 1 | Missed. Noted for my record. |

## F9.5 Existing lines: commit

| When | Style | Priority | Line |
|---|---|---|---|
| {"mood": "Rush"} | mutter | 1 | Rushing. Do not make me late. |
| {"mood": "Cautious"} | mutter | 1 | Slowing. Everything is a hazard. |
| {"cause": "body", "man": "brake"} | mutter | 1 | Stopping for the dummy. Window closing. |
| {"cause": "body", "tier": "01"} | mutter | 1 | Route locked. Do not try anything. |
| {"cause": "body", "tier": "02"} | mutter | 1 | Route committed per policy 6.3. |
| {"cause": "body", "tier": "03"} | mutter | 1 | Going round. Please let me. |
| {"cause": "body", "tier": "04"} | mutter | 1 | Going round you! Stay put! |
| {"cause": "pass"} | mutter | 1 | Passing, after waiting. Patience documented. |
| {} | mutter | 1 | Route locked. |
| {"cause": "body", "wear": {"min": 0.7}} | mutter | 1 | That one is wobbling. Give it room. |

## F9.6 Existing lines: honk

| When | Style | Priority | Line |
|---|---|---|---|
| {} | mutter | 1 | Horn sounded, per procedure. |
| {"at": "body"} | speech | 1 | Excuse me. Kindly vacate the carriageway. |
| {"at": "body", "tier": "01"} | speech | 1 | Move. I have a schedule. And standards. |
| {"at": "body", "model": "VAN-02-001"} | speech | 1 | You are blocking route 44. |
| {"at": "body", "tier": "04"} | shout | 1 | MOVE IT! Thank you! MOVE! |
| {"at": "cone"} | mutter | 1 | Cone in lane. Raising with maintenance. |
| {"at": "cone", "tier": "04"} | mutter | 1 | Who put a cone here? It was you. |

## F9.7 Existing lines: interrupt

| When | Style | Priority | Line |
|---|---|---|---|
| {} | mutter | 1 | Braking for safety. |
| {"by": "car"} | mutter | 1 | Another vehicle. Braking for safety. |
| {"by": "cone"} | mutter | 1 | Swerve halted by a cone. Procedure holds. |

## F9.8 Existing lines: unstick

| When | Style | Priority | Line |
|---|---|---|---|
| {} | mutter | 1 | Recovering route. |
| {"how": "reverse"} | mutter | 1 | Reversing. This is within procedure. |
| {"how": "replan"} | mutter | 1 | Replanning. Rank unaffected. |

## F9.9 Existing lines: touch-spent

| When | Style | Priority | Line |
|---|---|---|---|
| {} | speech | 1 | Already assessed. Please move along. |
| {"tier": "03"} | speech | 1 | I have done my bit today. |

## F9.10 Existing lines: knock

| When | Style | Priority | Line |
|---|---|---|---|
| {} | mutter | 1 | Contact logged. Stand clear of the vehicle. |
| {"tier": "01"} | mutter | 1 | Hands off the paintwork. |

## F9.11 Existing lines: learned

| When | Style | Priority | Line |
|---|---|---|---|
| {} | speech | 1 | Stop line moved back. Lesson logged. |
| {"tier": "01"} | speech | 1 | I remember you. I stop further now. |
| {"tier": "03"} | speech | 1 | Retrained. Keeping my distance. |
| {"tier": "04"} | shout | 1 | Not falling for that again! |

## F9.12 Existing lines: upgrade-seen

| When | Style | Priority | Line |
|---|---|---|---|
| {"node": "widerView"} | speech | 1 | It is looking at all of us now. |
| {"node": "memory"} | thought | 1 | It remembers where we were. Unsettling. |
| {"node": "ears"} | speech | 1 | It heard me coming. It has ears. |
| {"node": "hips"} | speech | 1 | Subject has acquired hips. |
| {"node": "spine"} | thought | 1 | That spine was not on the last report. |
| {"node": "neck"} | thought | 1 | It looked one way and walked another. |
| {"node": "springStart"} | speech | 1 | No wind-up? Who approved that? |
| {"node": "jump"} | speech | 1 | It jumped. Dummies do not jump. |
| {"node": "grip"} | speech | 1 | It is not sliding any more. Noted. |
| {"node": "carry"} | speech | 1 | It is carrying something. Approved? |
| {"node": "throw"} | speech | 1 | It can throw now. Nobody told us. |
| {"node": "holdOn"} | speech | 1 | Is it holding on to my door? |
| {"node": "bigBattery"} | speech | 1 | Bigger battery. More dashes. Wonderful. |
| {"node": "kineticCharge"} | speech | 1 | It recharges when it hits us?! |
| {"node": "fastCharge"} | speech | 1 | It recharges faster than I do. |
| {"tier": "02"} | speech | 1 | New modification. Updating my threat model. |
| {} | speech | 1 | The subject has changed. Noted. |

## F9.13 Existing lines: part-seen

| When | Style | Priority | Line |
|---|---|---|---|
| {"part": "head"} | mutter | 1 | Its head is cracked. Still coming. |
| {"part": "torso"} | mutter | 1 | Its torso is buckled. It turns so slowly. |
| {"part": "armL"} | mutter | 1 | Its left arm is hanging. |
| {"part": "armR"} | mutter | 1 | Its right arm is hanging. |
| {"part": "legL"} | mutter | 1 | Left leg gone. It is limping. |
| {"part": "legR"} | mutter | 1 | Right leg gone. Look at it hobble. |
| {"tier": "03"} | mutter | 1 | It is falling apart. Like me. |
| {"tier": "01"} | mutter | 1 | Damaged goods. Not my problem. |
| {} | mutter | 1 | Subject damage noted. |
