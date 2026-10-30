# DUMMIES — GDD Edit 94: Prototype 7.13. The finale: the unveiling and the ship, built by the coding agent

**29 October 2026 · Lawrence Lek** · Closes D76 (row 533). Amends GDD Edit 92 §3.2. Story only; Arcade unchanged. Builds: `prototypes/p7/dummies_p7_13.html`. Prototypes 7 to 7.12 stay frozen.

- **Request (user, 29 October):** Assignment #5, a goal-oriented coding agent. D76: "Unveiling and ship".
- **Readings flagged:**
  - "Unveiling and ship": the shroud, the unveiling with the plaque, the drone to the ship, every crate's face. Credits and Second Market move to D77.
  - The agent builds only what the GDD specifies and a decision has settled. An open D-item blocks a requirement.
  - The agent wrote the code. A manual review changed what the probes could not see (row 536) and rejected one write (row 537).
- **Registry:** `edit94-2026-10-29` (507 entries). 2 IDs added.
- **Decision rows:** 533–538. D76 closed; D77, D78 raised.

## 3.2 Ending and finale (amends Edit 92 §3.2)

```markdown
- **Shroud:** the circus's monument is shrouded in Story until Waterfront B2 clears (`world.monumentShroud`).
  - A cloth on the statue's own outline. Cosmetic. Arcade's monument stands uncovered.
- **The last write-off:** plays under the cloth (`feedback.writeOffSeconds`). The save is stamped CERTIFIED.
- **The unveiling:** the world holds. A Farsight drone lifts the cloth away (`ui.finale.unveilSeconds`).
- **The plaque:** THE DUMMY MONUMENT · UNVEILED. ZERO ACCIDENTS (EXCLUDING TESTS).
  - Chassis spent, points, best combo, time. From the save: `chassis`, `points`, `bestCombo`, `t`.
  - Best combo: the largest combo of any hit in the story. Older saves load without it.
  - A, or a tap, once the cloth is off: ON TO THE SHIP.
- **The voyage:** a drone lifts the dummy from B2 over the south edge into B3. It sets it down on the container ship.
  - Every crate on the ship carries the dummy's face (`world.storyArt`).
  - Top strip: FARSIGHT DRONE · Carrying the certified model to the ship at B3.
- **Then the ending screen** (built): CERTIFIED, on B3.
- **Reduced motion:** no lift. The plaque shows at once.
- **Open (D77):** credits over the voyage; Second Market.
```

## Who built what (Assignment #5)

| Requirement (the analyst agent) | Coding agent (run 20261029-105801) | Manual review |
|---|---|---|
| R-SHROUD: shrouded until B2 clears | `StorySim.monumentShrouded()`, the cloth sprite, `world.monumentShroud` | Registry entry filed under World |
| R-UNVEIL: the unveiling and the plaque | phase `unveil`, the plaque from the save, `bestCombo`, A continues | The write-off first; the drone lifts the cloth; the plaque in the game's panel, in the field; the device's prompt; a tap |
| R-VOYAGE: the drone to the ship at B3 | phase `voyage`; B2 → B3; then `end('Certified')` | FARSIGHT DRONE on the top strip; · DRONE on the map |
| R-CRATE-FACES: every crate's face | faces on the 24 crates; the ship on the scene (`sc.ship`), which the voyage lands on | — |
| R-BARK-TILE: barks name the tile | the district's name swapped for the tile code | Rejected and reverted (row 537, D78) |

## Registry (edit94)

| ID | Default | Unit | Use |
|---|---|---|---|
| `world.monumentShroud` | 0 (P7: 1) | flag | The circus's monument shrouded in Story until Waterfront B2 clears |
| `ui.finale.unveilSeconds` | 1.2 | s | The drone lifts the cloth; then the plaque; A goes on. The gift screen's hold (`ui.gift.holdSeconds`) |

## Measured

| Check | Result |
|---|---|
| Waterfront A1 and B2 in test | shrouded; Arcade uncovered; 6.10 no monument |
| The B2 clear | `writeoff` → `unveil`; the save complete; one `unveil` event |
| The plaque, saved 33 chassis, 412,350 points, ×4, 5,420 s | chassis 34, points 414,850, ×5 (the last hit), time from the save |
| The unveiling | holds the world; SPACE before the lift ends does nothing |
| The voyage | inbound › lift › carry › in › drop; set down on the ship at (400, 574) in 6.3 s |
| The ship | 24 crates, each with the face |
| Phone | a tap on the plaque goes on to the ship |

## Open

- **D77:** credits over the voyage; Second Market.
- **D78:** barks that name the tile.
- **D70, D67, D68** stand.

## Evidence

- `node prototypes/p7/test_p713.js docs` → 103/103. 6.4–6.10 and 7–7.12 byte-identical.
- The agent's run: `coder/runs/20261029-105801/trace.md`. Five writes, each accepted on its first try; stop: every unmet requirement blocked.
