# Trace — hits

Status: **accepted** after 3 critic round(s).

## 1. Retrieval

| Query | Top chunks (BM25 score) |
|---|---|
| hit feedback hit-stop dummy crumples dents shake grows with damage crunch horn | `EDIT26#5.5` (36.723), `DESIGN#D4.5` (19.208), `JUICE#J2` (17.453) |
| miss stumble arms flailing clatter lunge squash stretch speed lines whoosh | `EDIT26#5.5` (31.423), `EDIT26#5.1` (18.12), `JUICE#J3` (11.385) |
| impact burst positive qualifying hit contact position radial motion | `DESIGN#D10.3~1` (23.209), `EDIT26#4.2~2` (17.614), `ENG#8.2~1` (13.849) |
| scored hit touch on spent car must not use indistinguishable reward feedback | `DESIGN#D4.5` (30.483), `JUICE#J3` (23.857), `ENG#8.1` (10.339) |
| body visibly announces lunge positive impact miss recovery empty charge write-off | `DESIGN#D4.5` (30.244), `JUICE#J3` (14.592), `EDIT26#10.1` (14.422) |
| juice reference top-down arcade driving screen shake hit pause permanence impact | `JUICE#J1` (39.655), `JUICE#J2` (34.079), `LOG#P1.1-observations` (20.508) |
| cars glide dummy flops sprite with mass against a flat diagram weight squash stretch | `EDIT26#4.1~1` (37.623), `DESIGN#D10.1` (20.404), `EDIT26#5.2~4` (11.824) |
| write-off shake particles body turns red disappears destruction presentation | `EDIT26#5.5` (22.278), `EDIT26#5.1` (21.203), `DESIGN#D4.5` (19.547) |
| P1.2 juice camera shake player shake lunge impact write-off stamp | `LOG#P1.2/juice` (39.708), `JUICE#J2` (30.0), `JUICE#J3` (28.649) |
| near miss distinct cues input denial positive impact sound visual equivalent | `DESIGN#D9.4` (42.159), `EDIT26#3.3` (26.032), `JUICE#J2` (15.573) |
| gloss bloom translucency stay in frame matte play area dummy only saturated actor reserve… | `DESIGN#D10.1` (37.08), `EDIT26#4.1~2` (31.202), `JUICE#J4` (24.255) |

Context given to the generator: 18 chunks.

## 2. Query → retrieved chunk → output (side by side)

| Output item | Cited chunk | Retrieved by query | Chunk excerpt |
|---|---|---|---|
| `layers[0]`: impact — Art of Screenshake: shake scaled by damage, contact flash, sparks, crunch — shak… | `EDIT26#5.5` | hit feedback hit-stop dummy crumples dents shake grows with… | \| Hit \| A 0.06 s hit-stop; the dummy crumples and dents; a shake that grows with the damage \| A crunch and a horn \| |
| `layers[0]`: impact — Art of Screenshake: shake scaled by damage, contact flash, sparks, crunch — shak… | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | \| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) \| Hit pause. |
| `layers[1]`: impact — {"zone": "front"} — Art of Screenshake camera kick; Juice It or Lose It squash, … | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | \| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) \| Hit pause. |
| `layers[1]`: impact — {"zone": "front"} — Art of Screenshake camera kick; Juice It or Lose It squash, … | `ENG#8.2~1` | impact burst positive qualifying hit contact position radia… | Base impact remains 100. |
| `layers[2]`: impact — {"bait": true} — Impact effects: denser burst and a horn when the bait lands | `EDIT26#5.5` | hit feedback hit-stop dummy crumples dents shake grows with… | \| Hit \| A 0.06 s hit-stop; the dummy crumples and dents; a shake that grows with the damage \| A crunch and a horn \| |
| `layers[2]`: impact — {"bait": true} — Impact effects: denser burst and a horn when the bait lands | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | ## J2 Reference talks — general juice |
| `layers[3]`: impact — {"lunging": true} — Art of Screenshake knockback and impact effects: the lunge's… | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | \| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) \| Hit pause. |
| `layers[3]`: impact — {"lunging": true} — Art of Screenshake knockback and impact effects: the lunge's… | `ENG#8.2~1` | impact burst positive qualifying hit contact position radia… | Early fresh lunge at 1,148 toward a Sedan approaching at 138 gives raw approximately 931.884, capped at 800: one impact can now complete a fresh body. |
| `layers[4]`: impact — {"stopped": true} — art of rally dust plumes: a dull thump and dust when the dum… | `JUICE#J1` | juice reference top-down arcade driving screen shake hit pa… | Dust plumes and tyre tracks show the car's motion. |
| `layers[4]`: impact — {"stopped": true} — art of rally dust plumes: a dull thump and dust when the dum… | `DESIGN#D9.4` | near miss distinct cues input denial positive impact sound … | The dummy creaks, clanks, squashes and recovers with physical weight. |
| `layers[5]`: impact — {"assessed": {"min": "proto.hits.big.assessedMin", "max": "damage.bodyHealth"}} … | `EDIT26#5.5` | hit feedback hit-stop dummy crumples dents shake grows with… | \| Hit \| A 0.06 s hit-stop; the dummy crumples and dents; a shake that grows with the damage \| A crunch and a horn \| |
| `layers[5]`: impact — {"assessed": {"min": "proto.hits.big.assessedMin", "max": "damage.bodyHealth"}} … | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | \| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) \| Hit pause. |
| `layers[6]`: knock — Small dust puff; no reward feedback — particles dust | `JUICE#J3` | scored hit touch on spent car must not use indistinguishabl… | \| Knock without damage (`knock`) \| Small dust puff \| No reward feedback. |
| `layers[7]`: writeoff — Super Sprint hard-crash destruction; heavy shake, debris, field flash — shake … | `JUICE#J1` | juice reference top-down arcade driving screen shake hit pa… | \| Super Sprint (Atari Games, 1986) \| Each circuit fits one screen. |
| `layers[7]`: writeoff — Super Sprint hard-crash destruction; heavy shake, debris, field flash — shake … | `JUICE#J3` | scored hit touch on spent car must not use indistinguishabl… | \| Scored impact (`impact`) \| Hit pause, shake scaled by assessed impact, sparks, contact flash \| Cues outrank particles and shake (D4.5). |
| `layers[8]`: touch-spent — Dull bump, no burst; no flash, sparks or number — shake proto.hits.touchSpe… | `JUICE#J3` | scored hit touch on spent car must not use indistinguishabl… | \| Touch on a spent car (`touch-spent`) \| Dull bump, no burst \| Must not look like a scored hit (D4.5). |
| `layers[8]`: touch-spent — Dull bump, no burst; no flash, sparks or number — shake proto.hits.touchSpe… | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Touching a spent car \| Small kick and a dull thud. |
| `layers[9]`: near-miss — Speed lines along the car's travel and a pass-by whoosh; no reward cue | `DESIGN#D4.5` | scored hit touch on spent car must not use indistinguishabl… | A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. |
| `layers[9]`: near-miss — Speed lines along the car's travel and a pass-by whoosh; no reward cue | `DESIGN#D9.4` | near miss distinct cues input denial positive impact sound … | Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. |
| `layers[10]`: miss — Stumble with arms flailing and a clatter; the body announces the miss — particles … | `EDIT26#5.5` | hit feedback hit-stop dummy crumples dents shake grows with… | \| Miss \| A stumble, with arms flailing \| A clatter \| |
| `layers[10]`: miss — Stumble with arms flailing and a clatter; the body announces the miss — particles … | `DESIGN#D4.5` | scored hit touch on spent car must not use indistinguishabl… | The body visibly announces a lunge, a positive impact, a miss, recovery, empty charge and write-off. |
| `layers[11]`: lunge — Speed lines, dust kicked backwards, small camera kick; shorter when worn — shake … | `JUICE#J3` | scored hit touch on spent car must not use indistinguishabl… | \| Lunge (`lunge`) \| Squash, stretch, dust kicked backwards \| Announce the lunge (D4.5). |
| `layers[11]`: lunge — Speed lines, dust kicked backwards, small camera kick; shorter when worn — shake … | `EDIT26#5.5` | hit feedback hit-stop dummy crumples dents shake grows with… | \| Lunge \| Squash, then stretch, with speed lines \| A whoosh \| |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. The layers sound like DUMMIES: dry, physical and presentation-only. The hit-stop is referenced from the registry, reserved red is avoided, and sound gains stay under the 0.25 clamp. The burst sizes stay within the cap, spent touches are kept distinct from scored hits, and the miss and near miss are announced. The one defect is a unit mislabel on the stumble parameter.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | data/fix | `params[id=proto.hits.miss.stumbleAmp].u…` | EDIT26#5.5: The miss shows a stumble of the dummy sprite, and the parameter's own… | ratio | (removed or moved) |

Leaf changes this round: 1.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy and parameters sound like DUMMIES: dry, physical and tied to the crash lab. Two things need changing. The write-off layer puts the smoke on the car instead of the dummy's body, and the scored hit on a stopped car sounds almost the same as the touch on a spent car.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | lore/fix | `layers[8].particles[1].at` | EDIT26#5.1: A write-off destroys the dummy's body: it shakes, throws particles, t… | car | (removed or moved) |
| C2 | rule/fix | `params[proto.hits.stopped.thumpFrom/thu…` | DESIGN#D4.5: A scored hit and a touch on a spent car must not use indistinguishabl… | {"proto.hits.stopped.thumpFrom":420,"proto.hits.stopped.thumpTo":110,"proto.hits.stopped.thumpSeconds":0.16,"… | (removed or moved) |

Leaf changes this round: 5.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **pass**. It sounds like DUMMIES: dry and physical, with no cheer, slang or marketing gloss in the reference notes. I found no canon breaks. Reserved red and frame aqua are never used, effect inks are all structure, fleet, grid, joints or dummy, burst sizes stay within 2 × body width, sound gains stay under 0.25, and feedback.hitStop is referenced rather than redeclared.

