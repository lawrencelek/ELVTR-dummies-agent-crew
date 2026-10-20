# Fleet database

`fleet.json` holds the fleet's identities and voice, separate from every other text file (decision 117).
The P3 build bundles it as `window.FLEET_DB`. Regenerate nothing by hand from other sources; edit this file.

| Table | Holds |
|---|---|
| `canon` | Setting, company, look, voice rules, glossary, banned terms, allowed city names |
| `classes` | 8 vehicle classes: code, registry class, product family, tag letter, job, behaviour (GDD 6.1) |
| `tiers` | 4 price tiers: name, line suffix, temperament, voice (GDD 6.1) |
| `seniority`, `moods`, `parts`, `nodes` | The state vocabularies lines may test (GDD 6.4, 6.5; Edit 38 §5.7; V29 D3.2) |
| `context`, `events` | Which fields a line may test: shared context, then per event |
| `models` | 32 numbered models, one per type-tier: `SED-01-001`, tag `S01`, line, callsign, job, temperament, sim ids |
| `barks` | 123 lines: event, conditions, style, priority, text, claims |

## How a line is chosen

- Event matches, every condition holds, highest priority wins, then the most specific line.
- Conditions test the car (`model`, `tier`, `class`, `seniority`, `mood`) and the dummy (`owns` a node, `broken` part, `wear`).
- Write-offs take priority 3; hits 2; chatter 1, behind cooldowns (`proto.barks.*`).

## Lore consistency (`check_lore.py`, D23)

Lore is tied to state: a line may only say what the game state guarantees at that moment.

```
python3 content/db/check_lore.py
```

- **Roster:** 32 type-tiers once each; ids, tags, callsigns unique; temperament matches the tier.
- **Claims:** every claim a line makes (`node:hips`, `part:armR:broken`, `stopped`, `seniority>=3`…) is guaranteed by its conditions.
- **Mentions:** words that assert a fact (an upgrade, a broken part, seniority, a callsign) need the matching claim.
- **Canon:** no banned terms; only canon city names; FARSIGHT in capitals; ≤ 48 characters; placeholders exist on the event.
- **Coverage:** every tier speaks on impact, write-off, near miss and miss; every node and part has a line; every event has a neutral fallback.

Exit 1 on any error.
