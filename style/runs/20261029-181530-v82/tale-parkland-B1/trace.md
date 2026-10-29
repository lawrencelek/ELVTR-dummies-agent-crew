# tale-parkland-B1 · V8.2 tale · Parkland B1: The cascade, redrafted

- **Scores:** 2 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 59.0 s · $0.5375. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Redraft the tale for Parkland B1 (The cascade). Two earlier versions are source material: use any of their facts and jokes, copy neither whole.
> - Prototype 7.13 (Farsight's voice; Farsight must not appear): The cascade steps the reservoir's water down beside the highway, pool by pool. It was built to drown out the traffic. The traffic got louder. Go up to the highway and test it where it is loudest.
> - Prototype 8.1 (Dummy Corporation): The cascade steps the reservoir's water down beside the highway, pool by pool, to drown out the traffic. Go up to the highway and take your write-off where the traffic is loudest.
> Choose the length the tile needs, 15 to 35 words in at most two sentences: short when one image carries it, longer when the place has a history worth telling. Name the place, keep the duty and any equipment the tile issues, and point the place at the training.

## Before (generator)

> The cascade steps the reservoir down beside the highway, pool by pool, to drown out the traffic. The traffic won. Climb to the highway and finish your training where it is loudest.

180 characters.

### Evaluation 1: 2/10

Lint evidence:

- tale · F6 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 2/10
REASON:
- tale · F6 (blocking, −4) "The cascade steps the reservoir down beside the highway, pool by pool, to drown out the traffic. The traffic won. Climb to the highway and finish your training where it is loudest." Lint counts 3 sentences, and a tale may have at most 2 (style.v2.text.maxSentences). [EDIT97#3.2] Fix: merge the first two sentences: "The cascade steps the reservoir down beside the highway, pool by pool, to drown out the traffic, and the traffic won."
- tale · R5 (blocking, −4) "finish your training where it is loudest" The tale's duty does not match the brief, which asks for a final hit at Z1 or above, and it wrongly says training ends here on tile 8 of 9 in Act II, before CUSTOMS and CERTIFIED. [STORY#PB1] Fix: "Climb to the highway and take your final hit where it is loudest."
Total: 10 − 4 − 4 = 2.
```

## After refinement 1 (refiner)

> The cascade steps the reservoir down beside the highway, pool by pool, to drown out the traffic; the traffic got louder. Climb to the highway and take your final hit above the noise.

182 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1–T5, T13 and T14 for tone [EDIT95#3.2, PLAY#PS2]; V1–V4, V6, V8, V9 and V11 for vocabulary and lore, since it names the cascade and turns it toward the duty [EDIT95#3.1, EDIT95#3.3]; F5–F7 and F11 for form, at 33 words and two sentences with no placeholder or equipment [EDIT97#3.2]; and R4–R5 for truth, since "Climb to the highway… final hit" matches ON A RAISED ROAD and nothing is issued on this tile [STORY#PB1, STORY#S3].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1 and T3–T5 and T13 (deadpan, about the job, no consoling, one adjective per sentence) [EDIT95#3.2, EDIT95#3.1]; V1, V3, V4, V8, V9 and V11 (no banned words, the glossary, the cascade named and turned toward the duty) [EDIT95#3.1, STORY#PB1]; F5, F6, F7 and F11 (no placeholder, 2 sentences and 33 words, no equipment issued here, no padding) [EDIT97#3.2, STORY#S1]; and R4 and R5 (the cascade beside the highway, a final hit on the raised road matches ON A RAISED ROAD at Z1 or above) [STORY#PB1, STORY#S3].
Total: 10.
```
