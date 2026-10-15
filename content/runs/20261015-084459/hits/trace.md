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
| `layers[0]`: impact — Hit pause plus shake scaled to damage, contact flash, sparks — shake ['proto.hit… | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | \| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) \| Hit pause. |
| `layers[0]`: impact — Hit pause plus shake scaled to damage, contact flash, sparks — shake ['proto.hit… | `JUICE#J3` | scored hit touch on spent car must not use indistinguishabl… | \| Scored impact (`impact`) \| Hit pause, shake scaled by assessed impact, sparks, contact flash \| Cues outrank particles and shake (D4.5). |
| `layers[1]`: impact — {"zone": "front"} — Heavier shake and a second, wider shock ring on a front cont… | `ENG#8.2~1` | impact burst positive qualifying hit contact position radia… | On a front contact, a stationary dummy versus a Sedan moving toward it at 138 assesses 100. |
| `layers[1]`: impact — {"zone": "front"} — Heavier shake and a second, wider shock ring on a front cont… | `EDIT26#5.5` | hit feedback hit-stop dummy crumples dents shake grows with… | \| Hit \| A 0.06 s hit-stop; the dummy crumples and dents; a shake that grows with the damage \| A crunch and a horn \| |
| `layers[2]`: impact — {"bait": true} — Exaggerated score popup with a rising tick, sound on every acti… | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | Sound on every action. |
| `layers[2]`: impact — {"bait": true} — Exaggerated score popup with a rising tick, sound on every acti… | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Impact \| Camera shake scales with assessed impact. |
| `layers[3]`: impact — {"lunging": true} — Camera punch-in and body slam when the dummy drives into the… | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | \| The dummy squashes on lunge and recovery (P1.2). |
| `layers[3]`: impact — {"lunging": true} — Camera punch-in and body slam when the dummy drives into the… | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Impact \| Camera shake scales with assessed impact. |
| `layers[4]`: impact — {"stopped": true} — Squash and stretch on a heavy dull thud, smoke off the stopp… | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | ## J2 Reference talks — general juice |
| `layers[4]`: impact — {"stopped": true} — Squash and stretch on a heavy dull thud, smoke off the stopp… | `DESIGN#D10.1` | gloss bloom translucency stay in frame matte play area dumm… | The dummy has material weight: dents, lean, squash, stretch and a recoverable stagger. |
| `layers[5]`: impact — {"assessed": {"min": 400, "max": 800}} — Longer shake, big ring and debris on bi… | `ENG#8.2~1` | impact burst positive qualifying hit contact position radia… | assessedImpact = min(rawImpact, damage.bodyHealth) |
| `layers[5]`: impact — {"assessed": {"min": 400, "max": 800}} — Longer shake, big ring and debris on bi… | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | \| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) \| Hit pause. |
| `layers[6]`: knock — Small dust puff, knockback with no reward — particles dust | `JUICE#J3` | scored hit touch on spent car must not use indistinguishabl… | \| Knock without damage (`knock`) \| Small dust puff \| No reward feedback. |
| `layers[6]`: knock — Small dust puff, knockback with no reward — particles dust | `JUICE#J2` | juice reference top-down arcade driving screen shake hit pa… | Knockback is P1.3 recoil. |
| `layers[7]`: touch-spent — Dull bump with no burst, flash or number — shake proto.hits.touchSpent.shak… | `JUICE#J3` | scored hit touch on spent car must not use indistinguishabl… | \| Touch on a spent car (`touch-spent`) \| Dull bump, no burst \| Must not look like a scored hit (D4.5). |
| `layers[7]`: touch-spent — Dull bump with no burst, flash or number — shake proto.hits.touchSpent.shak… | `DESIGN#D4.5` | scored hit touch on spent car must not use indistinguishabl… | A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. |
| `layers[8]`: writeoff — Heavy shake, debris and wreck permanence over the write-off animation — shake … | `JUICE#J3` | scored hit touch on spent car must not use indistinguishabl… | \| Write-off (`writeoff`) \| Heavy shake, debris, stamp, wreck permanence \| Wreck is visual only (Engineering §8.5). |
| `layers[8]`: writeoff — Heavy shake, debris and wreck permanence over the write-off animation — shake … | `JUICE#J1` | juice reference top-down arcade driving screen shake hit pa… | Take wreck permanence only. |
| `layers[9]`: writeoff — Low boom under the crash so the write-off sounds heaviest | `EDIT26#5.5` | hit feedback hit-stop dummy crumples dents shake grows with… | \| Write-off \| Shake, particles, the body turns red and disappears (Built) \| A crash \| |
| `layers[9]`: writeoff — Low boom under the crash so the write-off sounds heaviest | `DESIGN#D9.4` | near miss distinct cues input denial positive impact sound … | Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. |
| `layers[10]`: lunge — Speed lines, dust kicked backwards, small camera kick — shake proto.hits.lunge.sh… | `JUICE#J3` | scored hit touch on spent car must not use indistinguishabl… | \| Lunge (`lunge`) \| Squash, stretch, dust kicked backwards \| Announce the lunge (D4.5). |
| `layers[10]`: lunge — Speed lines, dust kicked backwards, small camera kick — shake proto.hits.lunge.sh… | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Lunge \| Dust puff behind the body. |
| `layers[11]`: near-miss — Pass-by whoosh and speed lines along the car's travel; art of rally dust — pa… | `DESIGN#D4.5` | scored hit touch on spent car must not use indistinguishabl… | The body visibly announces a lunge, a positive impact, a miss, recovery, empty charge and write-off. |
| `layers[11]`: near-miss — Pass-by whoosh and speed lines along the car's travel; art of rally dust — pa… | `DESIGN#D9.4` | near miss distinct cues input denial positive impact sound … | Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. |
| `layers[12]`: near-miss — {"gap": {"min": 0, "max": 0.5}} — Tighter pass earns longer streaks, a tiny s… | `DESIGN#D4.5` | scored hit touch on spent car must not use indistinguishabl… | There is no active fog-of-war experiment that hides traffic. |
| `layers[12]`: near-miss — {"gap": {"min": 0, "max": 0.5}} — Tighter pass earns longer streaks, a tiny s… | `DESIGN#D9.4` | near miss distinct cues input denial positive impact sound … | Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. |
| `layers[13]`: miss — Stumble with arms flailing and a clatter; Juice It or Lose It body weight — partic… | `EDIT26#5.5` | hit feedback hit-stop dummy crumples dents shake grows with… | \| Miss \| A stumble, with arms flailing \| A clatter \| |
| `layers[13]`: miss — Stumble with arms flailing and a clatter; Juice It or Lose It body weight — partic… | `EDIT26#5.1` | miss stumble arms flailing clatter lunge squash stretch spe… | A round body 26 units across. |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy is dry, instrumental and matches DUMMIES' voice: no barks, no cheer, and the hit-stop is not redeclared. The problems are data and presentation rules. Two thresholds have no parameter ID, several shock rings and rays exceed the burst size cap, the rings use reserved cue roles, one sound is nearly identical to the spent-car thud, and the head-on layer describes zone damage that P1 no longer uses.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | data/fix | `layers[5].when.assessed.min` | ENG#8.2~1: Every value needs a registry parameter ID. 400 is a bare threshold wi… | 400 | proto.hits.impact.big.assessedMin |
| C2 | data/fix | `layers[14].when.gap.max` | ENG#8.2~1: Every value needs a registry parameter ID. The tight-pass gap of 0.5 … | 0.5 | (removed or moved) |
| C3 | rule/fix | `params[proto.hits.impact.headOn.ringRad…` | EDIT26#4.2~2: The impact burst cue is capped at 2 × body width (52 units). The regi… | 56 | (removed or moved) |
| C4 | rule/fix | `params[proto.hits.impact.headOn.raysLen…` | EDIT26#4.2~2: The impact burst cue is capped at 2 × body width (52 units). The head… | 64 | (removed or moved) |
| C5 | rule/fix | `params[proto.hits.impact.big.ringRadius…` | EDIT26#4.2~2: The impact burst (ring and rays) is capped at 2 × body width (52 unit… | 70 | (removed or moved) |
| C6 | lore/fix | `layers[1].reference` | LOG#P1.3/rules: In the P1 damage model the zone factors are unused and angle replaces… | Heavier shake and double shock ring on the full-damage zone; crunch and horn | Heavier shake and a second, wider shock ring on a front contact; crunch and horn |
| C7 | rule/fix | `layers[0].ring.role` | EDIT26#4.2~2: Cue treatments are reserved. A decorative ring in cue.primary or cue.… | primary | structure |
| C8 | rule/fix | `layers[4].sound.from` | DESIGN#D4.5: A scored hit and a physical touch on a spent car must not use indisti… | proto.hits.impact.stopped.thudFrom | proto.hits.impact.stopped.thudFrom |
| C9 | data/fix | `params[proto.hits.miss.stumbleAmp].unit` | EDIT26#5.5: The stumble amplitude is an angle (the purpose says radians). Its uni… | ratio | (removed or moved) |

Leaf changes this round: 493.

### Round 1

- Validator: 2 issue(s).
- Critic verdict: **revise**. The layers sound like DUMMIES: dry, physical and presentation-only, with the sim left untouched and hit-stop left on the registry. The remaining drift is in particle and streak roles. Sparks and the miss streaks are drawn in the reserved tier-1 and tier-2 cue colours, so they can pass for cues.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | data/block | `layers[5].when.assessed` | pipeline:consumer: Range conditions use {min, max} on a numeric field. | {"min": "proto.hits.impact.big.assessedMin"} | {"min": 400, "max": 800} |
| V2 | data/block | `layers[12].when.gap` | pipeline:consumer: Range conditions use {min, max} on a numeric field. | {"max": "proto.hits.nearMiss.tightGap"} | {"min": 0, "max": 0.5} |
| C1 | rule/fix | `layers[0].particles[0].role` | EDIT26#4.2~2: The cue.primary treatment is reserved for tier-1 cues, and decoration… | primary | structure |
| C2 | rule/fix | `layers[8].particles[2].role` | EDIT26#4.2~2: Write-off sparks are decoration and must not be drawn in the reserved… | primary | structure |
| C3 | rule/fix | `layers[14].streaks.role` | DESIGN#D10.3~1: Straight speed lines in the cue.secondary colour behind the dummy imi… | secondary | (removed or moved) |

Leaf changes this round: 7.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy and parameters sound like DUMMIES: dry, physical, with no cheer or slang, and the spent touch stays distinct from a scored hit. One presentation rule is broken: the lunge speed lines use the reserved tier-2 cue colour.

Open issues (no repair round left):

- C1 [rule/fix] `layers[10].streaks.role`: secondary — The secondary cue colour is reserved for tier-2 cues. Decorative speed lines must not borrow it, or they read as the lunge-streak cue.

