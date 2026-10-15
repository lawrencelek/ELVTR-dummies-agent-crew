# DUMMIES — P2 Prototype: Generated Content

**P2.1 · 15 October 2026 · Lawrence Lek**

P1.9's simulation with a presentation layer generated from the GDD. Gameplay is unchanged. P2.1 fills three gaps: humour (vehicle barks in speech bubbles), juice (layered hit feedback) and graphics (a FARSIGHT smart-city interface skin). Content comes from `content/*.json`, written by the [content pipeline](../../content/README.md). P1 stays frozen at P1.9.

![P2.1: a front hit with a shout bubble, burst and value popup](../../content/docs/p2_impact.png)

## Play

Open `dummies_p2.html` in a browser. No install, no server.

| Control | Keys |
|---|---|
| Move | WASD or arrows |
| Lunge | Space or J |
| Cone (Carry/Throw) | K or Shift |
| Pause and cue key | Esc |
| Tuning panel | T. Generated `proto.*` IDs appear as sliders. |

- **Campaign:** L1 Straight → L2 Barrier → L3 Corner. 1, 2, then 3 write-offs. Same as P1.9.
- **Difficulty:** Fragile 200, Standard 300, Reinforced 600. Same as P1.9.

## What P2.1 adds

| Gap | Source | In play |
|---|---|---|
| Humour | `content/barks.json` | 31 worker lines for 11 events. Speech, thought, shout and mutter bubbles above the car. Write-offs outrank hits; hits outrank chatter. Cars react to a miss, a near miss and a newly bought node ("Subject has acquired hips."). |
| Juice | `content/hits.json` | 12 layers. Each hit stacks a base response with accents for front, bait, lunging, stopped and big hits: crunch, crumple, zoom punch, contact ring, burst rays, value popup. A miss stumbles with flailing arms. A near miss whooshes. |
| Graphics | `content/terminal.json` | FARSIGHT · SMART CITY 智慧城市 lockup, static badges, aqua header bands and module icons, glass panel skin, registry micro-type, bezel range marks, rotating bilingual signage, FARSIGHT title copy. |

P2.0 layers stay underneath: `juice.json` (other events, tyre marks, chassis drop), `interface.json` (D10.5 HUD, cue key, copy deck), `graphics.json` (liveries, dummy markings, district dressing).

- **Unchanged:** `sim.js` is byte-identical to P1.9, including the 0.06 s hit-stop. `node test_sim.js` → 34/34.
- **Derived cases:** near miss, miss and upgrade seen are computed by the renderer from sim state. They and every bark are logged in the exported trace under `presentation`.
- **Fallback:** Each layer falls back to P2.0, and without `content.js` to P1.9.
- **Chinese text:** All marked review pending (D9.2).

## Files

| File | Role |
|---|---|
| `dummies_p2.html` | Playable build. Single file. |
| `sim.js` | P1.9 simulation, unchanged. |
| `game.js` | P1.9 renderer plus the content layer: juice, HUD, copy, barks and bubbles, hit layers, derived cases, terminal skin, vector art. |
| `content/*.json`, `content.js` | Generated content and its bundle. Do not hand-edit. |
| `shell.html`, `build.py` | `python3 build.py` bundles `sim.js` + `content.js` + `game.js`. |
| `test_sim.js`, `policy_check.js`, `car_metrics.js` | P1.9 tests and bots, run against the same sim. |

## Regenerate

```
python content/pipeline.py --no-publish                          # barks, hits, terminal
python content/pipeline.py --publish-run <run id> --type hits    # publish a reviewed run
python content/pipeline.py --check                               # re-validate all six types; rebuild
```

## Prototype-only parameters

| ID group | Count | Spec |
|---|---:|---|
| `proto.barks.*` | 8 | `content/out/DUMMIES_GDD_Edit34_Barks.md` |
| `proto.hits.*` | 152 | `content/out/DUMMIES_GDD_Edit35_Hits.md` |
| `proto.term.*` | 6 | `content/out/DUMMIES_GDD_Edit36_Terminal.md` |
| `proto.juice.*` | 68 | `content/out/DUMMIES_GDD_Edit31_Juice.md` |
| `proto.ui.barkSeconds`, `proto.ui.barkCooldown` | 2 | `content/out/DUMMIES_GDD_Edit32_Interface.md` (P2.0 barks; superseded) |

None promoted to the registry.

## Questions for the P2.1 session

- Does anyone read a bubble at play speed? Which style gets read: shout, thought or mutter?
- Do the barks land as comic and tragic, or as noise?
- Do hits feel different from each other? Does a bait hit feel like the reward?
- Is a miss readable without the bubble?
- Does the frame read as a smart-city vendor's terminal? Is the signage read at all?

## Known issues

- No player has seen P2.1.
- Base hit shake (1.5 → 7) is below P2.0's (3 → 12). Hits read busier, not harder.
- Shout lines are generic exclamations; the humour is in thought and mutter lines.
- Sound is synthesised placeholder noise.
- Graphics (P2.0): one open fix-level item. A corner kerb line is declared shoulder but sits on the verge.
