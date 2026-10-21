# Trace — drops

Status: **accepted** after 3 critic round(s).

## 1. Retrieval

| Query | Top chunks (BM25 score) |
|---|---|
| drop off a ledge or broken parapet fall time world.dropSeconds square root of height land… | `EDIT44#5.2` (43.315), `EDIT44#decisions` (27.434), `DECISIONS#rows-161-170~2` (27.084) |
| landing on a car closing speed damage.dropSpeed hit from above legs take it Z2 136 stoppe… | `EDIT44#8.3` (48.637), `EDIT42#8.3` (43.71), `DECISIONS#rows-161-170~2` (16.899) |
| falling the dummy's shadow marks the landing spot drawn heights drop draws from the lift … | `EDIT44#4.1` (22.563), `EDIT44#4.2` (19.632), `EDIT43#4.1` (17.983) |
| hit feedback hit-stop dummy crumples dents shake grows with damage crunch horn | `EDIT26#5.5` (40.603), `DESIGN#D4.5` (22.118), `JUICE#J2` (19.658) |
| impact burst radial particles at contact two times body width | `EDIT26#4.2~2` (17.663), `JUICE#J3` (12.481), `ENG#8.1` (11.23) |
| scored hit and a physical touch must not use indistinguishable reward feedback | `DESIGN#D4.5` (32.502), `JUICE#J3` (21.321), `ENG#8.4` (11.938) |
| screen shake squash and stretch hit pause top-down arcade juice reference | `JUICE#J2` (36.739), `JUICE#J1` (28.719), `JUICE#J3` (20.728) |
| reduced motion juice scales to 25 percent shake flinch | `JUICE#J4` (31.066), `LOG#P1.2/juice` (30.885), `JUICE#J2` (13.007) |
| reserved hues yellow is the dummy red is the warning neon is material never a cue | `EDIT39#4.1.1` (36.27), `EDIT38#4.1.6` (26.664), `EDIT37#4.1~2` (20.685) |
| Z0 ground Z1 low highway Z2 high highway platform roofs world.highHeight world.deckHeight | `DECISIONS#rows-161-170~2` (59.212), `EDIT44#7.7` (58.743), `LOG#P3.3` (51.961) |

Context given to the generator: 18 chunks.

## 2. Query → retrieved chunk → output (side by side)

| Output item | Cited chunk | Retrieved by query | Chunk excerpt |
|---|---|---|---|
| `layers[0]`: deck-drop — Juice It or Lose It: sound on every action, speed lines — particles dust | `EDIT44#5.2` | drop off a ledge or broken parapet fall time world.dropSeco… | - A link stair: entered from its deck's shoulder. |
| `layers[0]`: deck-drop — Juice It or Lose It: sound on every action, speed lines — particles dust | `EDIT44#4.1` | falling the dummy's shadow marks the landing spot drawn hei… | - A drop draws from the lift it left to the lift it lands on. |
| `layers[1]`: land — {"car": null} — Art of Screenshake: shake scaled to impact, plus dust plumes — sha… | `EDIT44#5.2` | drop off a ledge or broken parapet fall time world.dropSeco… | - **Drop:** off a ledge or through a broken parapet. |
| `layers[1]`: land — {"car": null} — Art of Screenshake: shake scaled to impact, plus dust plumes — sha… | `EDIT44#4.1` | falling the dummy's shadow marks the landing spot drawn hei… | - **Raised levels:** a level and all on it draw lifted by its height × `proto.art.extrusion`. |
| `layers[2]`: impact — {"drop": true} — Art of Screenshake: camera kick and impact effects, downward — … | `EDIT44#8.3` | landing on a car closing speed damage.dropSpeed hit from ab… | - **Landing on a car:** downward speed is `damage.dropSpeed` × √(h / `world.deckHeight`). |
| `layers[2]`: impact — {"drop": true} — Art of Screenshake: camera kick and impact effects, downward — … | `EDIT42#8.3` | landing on a car closing speed damage.dropSpeed hit from ab… | - The dummy is thrown off the car's side (`proto.recoilScale`). |
| `layers[3]`: impact — {"dropZ": 2} — Art of Screenshake: bigger hit, bigger shake, debris — shake prot… | `EDIT44#8.3` | landing on a car closing speed damage.dropSpeed hit from ab… | - From Z2 (about 161): stopped sedan 136, sedan at cruise 236, stopped van 141, van at cruise 219. |
| `layers[3]`: impact — {"dropZ": 2} — Art of Screenshake: bigger hit, bigger shake, debris — shake prot… | `EDIT44#5.2` | drop off a ledge or broken parapet fall time world.dropSeco… | Z0–Z1 64, Z0–Z2 112, Z1–Z2 48. |
| `layers[4]`: writeoff — {"drop": true} — Wreck permanence and heavy shake: a crushed roof — shake prot… | `JUICE#J3` | impact burst radial particles at contact two times body wid… | \| Write-off (`writeoff`) \| Heavy shake, debris, stamp, wreck permanence \| Wreck is visual only (Engineering §8.5). |
| `layers[4]`: writeoff — {"drop": true} — Wreck permanence and heavy shake: a crushed roof — shake prot… | `EDIT44#8.3` | landing on a car closing speed damage.dropSpeed hit from ab… | ## 8.3 Damage (Edit 42 rule changed) |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. The content sounds like DUMMIES. It is plain, physical and quiet, it stays inside the palette roles, and it leaves the hit layers alone. Two data problems need correcting: a wrong unit on the stumble amplitude, and a hard-coded copy of a simulation fall time.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | data/fix | `params[proto.drops.land.stumbleMin].uni…` | BRIEF: Game data: The registry's stumble amplitude, proto.hits.miss.stumbleAmp (0.4 rad… | "unit": "ratio" (on proto.drops.land.stumbleMin 0.15 and proto.drops.land.stumbleMax 0.4) | (removed or moved) |
| C2 | data/fix | `params[proto.drops.step.fallSecondsMax]` | EDIT44#5.2: Fall time is a simulation value: world.dropSeconds × √(h / world.deck… | "id": "proto.drops.step.fallSecondsMax", "value": 0.47, "purpose": "Z2 fall time. Matches world.dropSeconds ×… | (removed or moved) |

Leaf changes this round: 300.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **revise**. The layers sound like DUMMIES. They are matter-of-fact, use no reserved red or aqua, keep every gain under the 0.25 clamp, and leave the base hit layers alone. One truth problem: the Z2 fall juice is timed to the Z1 fall.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | truth/block | `layers[0].sound.seconds` | EDIT44#5.2: Fall time is world.dropSeconds × √(h / world.deckHeight): Z1 is 0.35 … | world.dropSeconds | ["world.dropSeconds", "proto.drops.step.fallSecondsFull"] |
| C2 | truth/block | `layers[0].zoom.seconds` | EDIT44#5.2: The step-off pull-in runs during the fall. A Z2 fall lasts 0.47 s, no… | world.dropSeconds | ["world.dropSeconds", "proto.drops.step.fallSecondsFull"] |

Leaf changes this round: 308.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **pass**. It sounds like DUMMIES: the effects are mechanical and dry, with no cheer, mockery or marketing gloss. I found no canon, truth, rule or data breaks. Every gain is under the 0.25 clamp, no red, aqua or yellow is used, and the ground landing is gated on car null so a hit from above is not juiced twice.

