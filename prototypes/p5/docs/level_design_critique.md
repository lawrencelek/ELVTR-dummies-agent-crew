# Level design critique: three districts (Edit 51.3 mock-up)

**24 October 2026.** One adversarial critic reviewed the three districts tile by tile. It was asked to find weaknesses only.

## Brief

The user's five criteria:

1. Each tile reveals its own interesting mechanic (straight road, overlapping road, curving road, diagonal, obstacle).
2. Each tile has a point of visual interest that is distinctive between the three maps.
3. Good flow to the centrepiece, and interconnection between adjacent tiles.
4. All roads and highways cross at right angles or 45°.
5. All roundabouts have at least three joining roads. The inner ring lane is used for orbiting.

During the review the user widened the highway rule: highways may run across, down or at 45°.

Line references (`l.`) are to the Edit 51.3 `cityscape_view.js`.

## Parkland

**Plan fix:**
- Give the ring north and south arms: a Z1 highway running north–south down column B.
- A garden street on row 3 joins the three avenues.

| Tile | Mechanic | Verdict | Problem | Fix |
|---|---|---|---|---|
| A1 | 45° jog | ok | Generic LED blocks; the avenue never reaches B2 | Make the tile the start; add a stepped reservoir |
| B1 | Straight avenue | weak | A copy of B3 | The north arm of the ring; a cascade beside the deck |
| C1 | Straight avenue | missing | A dead column | A Z1 footbridge over the avenue, with escalators |
| A2 | Avenue under the Z1 highway | ok | A copy of C2 | Keep; a canal along the deck |
| B2 | Z1 ring, two arms | weak | Only two arms; its routes never share a lane, so nobody gives way | Four arms; the boulevard passes through the centre at 45°; pools in the NE and SW |
| C2 | Avenue under the highway | weak | A mirror of A2 | Cross under the east arm at 45° |
| A3 | Straight avenue | missing | Leaves the district for no reason | An R160 bend into the garden street |
| B3 | Straight avenue | weak | A copy of B1 | The south arm; the garden street passes under it |
| C3 | 45° jog | ok | Leaves at the bottom; links nothing | An R160 bend into the garden street |

## Circus

**Plan fix:**
- An octagon of streets rings B2, replacing the corner hooks.
- Entry by the west arm (A2); exit by the south arm (B3).
- The north and east arms end in T junctions.

| Tile | Mechanic | Verdict | Problem | Fix |
|---|---|---|---|---|
| A1 | 45° hook | weak | Runs from one district edge to another | An octagon corner; a tower cut parallel to the diagonal |
| B1 | Straight north arm | weak | A second district entry | A T junction at the octagon; twin towers |
| C1 | Hook | weak | Links nothing | An octagon corner; a ziggurat |
| A2 | Straight west arm | weak | A copy of C2 | The entry; a crossroads with the octagon; a billboard wall |
| B2 | Four-arm roundabout | ok | Buses on R96 entries | Bar buses; orbit on the inner lane (r132) |
| C2 | Straight east arm | weak | Leads nowhere | A T junction; a cantilevered crown |
| A3 | Hook under the row-3 Z1 | ok | Links nothing | An octagon corner under the deck |
| B3 | Under the row-3 Z1 at 90° | ok | Empty band below the deck | A crossroads, then under the deck to the exit |
| C3 | Hook, Z1 | ok | Links nothing | An octagon corner |

## Monument

**Plan fix:**
- Both highways run north–south: Z1 down column A, Z2 down column C.
- The snake's east–west runs cross them square.
- A skybridge links B1 to the ring.

| Tile | Mechanic | Verdict | Problem | Fix |
|---|---|---|---|---|
| A1 | Z2 deck parallel to the road | weak | Nothing crosses | Entry; under the Z1 deck at 90°; LED-wall tower |
| B1 | Copy of A1 | missing | Empty band | A Z1 skybridge across the road to B2's ring |
| C1 | Bend east to south | weak | The bend straddles the seam at ~80° | Under Z2, then an R96 bend wholly inside the tile; LED drum |
| A2 | Bend west to south | ok | — | Under Z1, then the bend; neon arcade |
| B2 | Split road; Z1 walkway ring | ok | Strongest centre | Keep; add the skybridge |
| C2 | Bend south to west | ok | Enters partway round the C1 fillet | A 45° corner cut; billboard mast |
| A3 | Bend; Z1 parallel | weak | Escalator foot 20 from the lane | A 45° corner cut, then under Z1 |
| B3 | Straight; Z1 parallel | missing | No buildings | A 45° jog; LED canyon |
| C3 | Straight; Z1 parallel | missing | No buildings | Under Z2; LED gateway arch |

## Ten worst problems

1. The Parkland ring had two arms and no shared lane: not a roundabout.
2. Two centres used the same mechanic: one road splitting round an island.
3. Monument's highways crossed no roads.
4. Parkland's avenues never met: no junctions in nine tiles.
5. Circus's corner hooks ran from one district edge to another.
6. Buses on R96 bends: the Parkland ring, the Circus roundabout.
7. Every district started at B1, next to B2. The centre came on the first screen flip.
8. Art kits were reused across districts.
9. Empty bands below every straight deck.
10. Seam faults: a bend crossing the seam at ~80°; buildings too close to seams.
