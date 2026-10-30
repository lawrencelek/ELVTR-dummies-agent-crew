# DUMMIES — GDD Edit 93: Prototype 7.12. Introduce, then test: Story's parts and briefs paced by act

**29 October 2026 · Lawrence Lek** · Amends GDD Edit 91 §9 (the parts' tiles) and Edit 92 §3.1 (briefs, parts, tales). Story only; Arcade unchanged. Builds: `prototypes/p7/dummies_p7_12.html`. Prototypes 7 to 7.11 stay frozen.

- **Request (user, 29 October):**
  - "Since you get DASH with B1, then it should have a write-off with DASH."
  - "Therefore we can pace the upgrades and goals to later. For example, then C1 could be the 'fall onto a car from above' goal."
  - "Re-evaluate the progression again for STORY MODE."
- **Readings flagged:**
  - "A write-off with DASH": a new brief, DASH INTO A CAR. The fatal hit lands while the body is dashing.
  - "Pace … to later": one rule for every part. A part lands on the tile whose brief first needs it. The toolkit spreads over all three acts.
  - "C1 … fall onto a car": taken. C1 drops from the high road's gap (Edit 85). No part needed.
  - Waterfront's briefs stay. Only Battery 3 moves (A1 → B2).
- **Registry:** `edit93-2026-10-29` (505 entries). No IDs added; 2 values changed.
- **Decision rows:** 526–532. D70 eased.

## 9 Progression (amends Edit 91 §9)

```markdown
- **Rule — introduce, then test:** a part arrives on the tile whose brief first needs it.
  - No brief needs a part not yet issued.
  - Battery 1 → a dash. Legs → a jump. Hands → a cone. Arms → a push. Battery 2, 3 → a combo ×3 (`story.task.comboHard`).
- **Act I · Monument:** Battery 1 B1 · Hands 1 A2 · Legs 1 B3. Three verbs: dash, cone, jump.
- **Act II · Parkland:** Arms 1 C1 · Legs 2 A3 · Hands 2 A2 · Arms 2 A1 · Battery 2 B2. The push, then a level on every verb.
- **Act III · Waterfront:** Legs 3 B1 · Arms 3 B3 · Battery 3 B2. The last part on the last tile.
- **Pace:** 3 · 5 · 3 parts by act. All 11 at tile 27 (7.11: tile 24).
- **Every jump and push tile brings a level.** Cone tiles: Monument A2 and Parkland A2 bring one; Waterfront A2 uses Hands 2.
- **Unchanged:** every part by drone, with the gift screen; no levels; points are the score; A1 on foot (`damage.bodyHealthOnFoot`).
```

| Part | 7.11 | 7.12 | First brief that needs it |
|---|---|---|---|
| Battery 1 | Monument B1 #2 | Monument B1 #2 | B1 dash |
| Hands 1 | Monument A2 #6 | Monument A2 #6 | A2 cone |
| Legs 1 | Monument C1 #3 | Monument B3 #8 | B3 jump |
| Arms 1 | Monument C3 #9 | Parkland C1 #10 | C1 push |
| Legs 2 | Parkland A3 #14 | Parkland A3 #14 | A3 jump |
| Hands 2 | Parkland B1 #17 | Parkland A2 #15 | A2 cone |
| Arms 2 | Parkland A1 #16 | Parkland A1 #16 | A1 push |
| Battery 2 | Parkland C1 #10 | Parkland B2 #18 | B2 combo ×3 |
| Legs 3 | Waterfront B1 #20 | Waterfront B1 #20 | B1 jump |
| Arms 3 | Waterfront B3 #24 | Waterfront B3 #24 | B3 push |
| Battery 3 | Waterfront A1 #19 | Waterfront B2 #27 | B2 combo ×3 |

## 3.1 The 27 tiles (amends Edit 92 §3.1)

| # | Tile | Title | Brief 7.11 → 7.12 | Part 7.11 → 7.12 | Write-offs |
|---|---|---|---|---|---|
| 1 | Monument A1 | The welcome wall | Any | — | 1 |
| 2 | Monument B1 | The podium bridge | Drop → **Dash** | Battery 1 | 1 |
| 3 | Monument C1 | The LED drum | Jump → **Drop** | Legs 1 → **—** | 1 |
| 4 | Monument C2 | The portal tower | Raised road | — | 1 |
| 5 | Monument B2 | The monument | Struck | — | 1 |
| 6 | Monument A2 | The neon shops | Cone | Hands 1 | 1 |
| 7 | Monument A3 | The stacked cubes | Combo ×2 | — | 1 |
| 8 | Monument B3 | The LED canyon | Jump | — → **Legs 1** | 1 |
| 9 | Monument C3 | The LED gateway | Push → **Thrown** | Arms 1 → **—** | 2 → **1** |
| 10 | Parkland C1 | The lantern pavilion | Drop → **Push** | Battery 2 → **Arms 1** | 1 |
| 11 | Parkland C2 | The amphitheatre | Van | — | 2 |
| 12 | Parkland C3 | The arch and the roundabout | Thrown → **Combo ×2** | — | 1 |
| 13 | Parkland B3 | The obelisk court | Police | — | 1 |
| 14 | Parkland A3 | The belvedere | Jump | Legs 2 | 1 |
| 15 | Parkland A2 | The dome by the canal | Raised road → **Cone** | — → **Hands 2** | 2 |
| 16 | Parkland A1 | The reservoir terraces | Push | Arms 2 | 1 |
| 17 | Parkland B1 | The cascade | Cone → **Raised road** | Hands 2 → **—** | 1 |
| 18 | Parkland B2 | The ring over the pools | Combo ×3 | — → **Battery 2** | 2 |
| 19 | Waterfront A1 | The west portal | Bus | Battery 3 → **—** | 1 |
| 20 | Waterfront B1 | The tunnel portal | Jump | Legs 3 | 2 |
| 21 | Waterfront C1 | The east portal | Police | — | 1 |
| 22 | Waterfront C2 | The east beach terrace | Drop | — | 2 |
| 23 | Waterfront C3 | The east customs post | Thrown | — | 1 |
| 24 | Waterfront B3 | The stilt houses | Push | Arms 3 | 1 |
| 25 | Waterfront A3 | The west customs post | Raised road | — | 2 |
| 26 | Waterfront A2 | The west beach terrace | Cone | — | 1 |
| 27 | Waterfront B2 | The circus | Combo ×3 | — → **Battery 3** | 2 |

- **Write-offs** (`story.writeOffs.<district>.<tile>`): Monument 9, Parkland 12, Waterfront 13. 34 bodies (7.11: 35).
- **Act I's other briefs** test what the body already does: drop, raised road, struck, combo ×2, thrown.
- **Parkland B1** (D70): its street is empty 67% of the time. A raised road replaces the cone. The highway always carries cars.

### Tales rewritten

| Tile | Tale |
|---|---|
| Monument B1 | Your first equipment has arrived: a battery, for the dash. The skybridge was built for shoppers who never came; staff now use it to watch the road. Today you join the road. Dash into a colleague. Farsight will time you. |
| Monument C1 | The drum lights each bend before a car reaches it, so no colleague is ever surprised. Today one will be. The high road breaks its rail over the street below. Step off it onto a car. Gravity is company policy. |
| Monument B3 | Two screens face each other across the road and advertise to each other all night. The skybridge was added so that someone would watch. You are now someone. Legs 1 is fitted. Jump into a car between the screens. |
| Monument C3 | The gateway thanks every car for driving safely. It thanked the last one seconds after that car wrote you off. Your file is updated: ROLE: DESTRUCTIVE TESTING. Let one colleague throw you into the next. |
| Parkland C1 | The paper lantern was the Expo's first exhibit, and it is lit again for the visitors. Arms 1 is fitted; Farsight calls it safety equipment. Under the footbridge, push off one car into the next. |
| Parkland C3 | The arch is the Expo's gate. Visitors will circle the roundabout once before they enter, which gives the cars time to learn them. You go round faster. Two hits, the second before the first is forgotten. |
| Parkland A2 | The dome is the Expo's showroom. The canal beside it cools the highway's footings; the ducks are registered volunteers. Hands 2 is fitted: two cones. Lay them where the visitors will walk, and see who stops. |
| Parkland B1 | The cascade steps the reservoir's water down beside the highway, pool by pool. It was built to drown out the traffic. The traffic got louder. Go up to the highway and test it where it is loudest. |
| Parkland B2 | Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three. |
| Waterfront A1 | The upper town houses the engineers, and the bus carries them to the bridge. Farsight requires the bus fleet's data before anyone crosses the river. The bus is slow and very large. It will not miss. |
| Waterfront B2 | Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you. |

- **Voice kept:** no exclamation marks; the longest 223 characters. C3 keeps ROLE: DESTRUCTIVE TESTING.

## 3.3 Briefs (amends Edits 81–82)

```markdown
- **DASH INTO A CAR** (new, `dash`): "Coverage gap: dashes. The final hit must be a dash into a car."
  - Met when the fatal hit lands while the body is dashing. A dash jump counts as a jump.
  - Set once: Monument B1, the tile that issues Battery 1.
- **Miss floor:** unchanged (`story.missFloor`). Struck standing in B1 holds at 1.
```

## Registry (edit93)

| ID | 7.11 | 7.12 | Use |
|---|---|---|---|
| `story.writeOffs.monument.C3` | 2 | 1 | C3 now asks for a rebound, on foot of Arms |
| `story.traffic.monument.C3` | 1 | 1.5 | A rebound needs two cars close together |
| `story.writeOffs.*`, `story.traffic.*` | — | — | 27 descriptions each carry the new brief |

## Measured

| Check | Result |
|---|---|
| A1 cleared on foot | the report: 0 / 11 parts; next Battery 1 at Monument B1 |
| The A1 → B1 drone | brings Battery 1; health 500 → 800; B1's card: DASH INTO A CAR |
| Struck standing in B1, 30 health | held at 1; lost 29; no write-off |
| A dash into a parked sedan in B1 | B1 cleared; next Hands 1 at Monument A2 |
| The B1 → C1 drone | no part; C1's card: DROP ONTO A CAR |
| Resumed at Monument C3, 8 cleared | Legs 1 and Hands 1 on the body; no Arms; THROWN INTO A CAR |
| Parkland C1 | the drone brings Arms 1; PUSH OFF A CAR |
| Waterfront B2 | the drone brings Battery 3; certified with 11 parts |
| A reload after B1 | 2 / 27 TILES · 1 / 11 PARTS |
| Every brief where set | possible: its class, raised traffic, a raised floor over traffic, cones |

## Evidence

- `node prototypes/p7/test_p712.js docs` → 94/94. 6.4–6.10 and 7–7.11 byte-identical.
- `node prototypes/p6/test_p610.js` → 47/47 on the shared code.
- `node test_sim.js` → 104/104. `node test_p6.js` → 72/73: Parkland's street-emptiness limit, as on 6.4.
- `node prototypes/jump/test_jump.js` → 28/28. `node prototypes/controls/test_controls.js` → 34/34.

## Open

- **D76:** the finale and Second Market.
- **D70:** eased. Parkland B1's missing drop gap stands.
- **D67, D68** stand.
