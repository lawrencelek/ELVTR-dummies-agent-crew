# DUMMIES — Submission 4 precedents: off-brand lines and their fixes

Snapshot of `claude/DUMMIES_Submission4_Content_Pipeline.md` §5–6 (Assignment 4, 21 October 2026), taken 29 October 2026 for the Style Guide Agent. The project doc is the source. Runs are in `content/runs/`.

## 5 What the critic caught

| Run · type | Kind | Found | Canon | Corrected |
|---|---|---|---|---|
| 015337 · barks | truth | "Old Market congestion code 7. Now this too." | `EDIT39#3.1`: lore follows state; no congestion is logged | "Old Market incident logged. Route 44 noted." The validator then caught that "Route 44" names V02, so the line was bound to that model |
| 015337 · barks | tone | Tier-free line "Written off on the highway. Of all places." | `FLEET#F4`: a line with no tier also fires for the calm Corporate van; this is a Luxury sniff | "Written off on the highway. Logged." |
| 020902 · barks | truth | "A roof drop. My schedule slips by a minute." | `EDIT39#3.1`: a one-minute delay is not logged | "A roof drop. My schedule will suffer." The tweak in §6 then removed invented consequences altogether |
| 020902 · barks | truth | "High drop logged. Load exceeds rating 3." | `FLEET#F2`: barks react to logged events only; no load or rating exists | "High drop logged. Incident form 3 filed." |
| 023310 · barks | truth | "Riverside. I came for the lantern, not this." | `EDIT41#7.2`: the lantern is on B2 only; the line fires on every Riverside screen | "Riverside. I did not sign up for this." |
| 024324 · barks | tone | Tier-free write-off "Written off on the highway. Closing ticket." | `FLEET#F4`: ticket-closing is Corporate procedure; the Luxury car cannot say it | "Written off on the highway. On my record." |

## 5.1 What the validators caught

| Run · type | Found | Rule | Corrected |
|---|---|---|---|
| 015337 · places | Campus intro "Calibrated plates score more." | `FLEET#F2`: "score" is a banned word | "…pay more." |
| 015337 · places | Roof toast "fall to the level below" | `FLEET#F2`: "level" is a banned word | "fall to the deck or road below" |
| 022042 · barks | "Old Market, route 44. Incident filed." on any Corporate car | `check_lore.py`: names V02 without that claim | Bound to `model: VAN-02-001` |

## 6 Voice judgment

- The game's voice is dry corporate comedy: workers who fear retraining, and polite forms that barely contain the personality.
- **Barks.** The final lines keep tier temperament. Luxury is indignant ("Struck on the highway. How undignified."). Corporate files paperwork ("Policy 12 excludes loads from parapets."). Every line is true at the moment it fires.
- **Weakest output.** The district lines in the bark bank are thinner than the situation lines. "Business district. Of all places." is generic.

## 6.1 Tweaks that changed game fit

| Tweak | Why | Before | After |
|---|---|---|---|
| Prompt (barks): tier-free lines must suit both cars; then "talk about the car's own job"; then "never add a consequence the sim does not log" | A shouting tier-free line and an aphorism | Seven invented consequences ("I am now late", "KPI missed"); the run was not accepted | True but flat; 15 of 33 lines ended "Noted.", "Logged." or "Recorded." |
| Prompt + check (barks): in-voice and out-of-voice examples; at most two stock endings | Truth had drained the humour | "Riverside. Low-rise streets. Hit logged." | "A roof? I was not briefed on roofs." · "Nobody walks the highway. Nobody." |

## 6.2 Rejected tile bark (Assignment 5, Edit 94)

- **R-BARK-TILE** replaced the district's name with the tile code in Story's barks. A Luxury sedan would have said "B2. I did not sign up for this."
- It met its one probe, not the voice. Barks are written lines in each tier's voice, checked against the fleet canon. Reverted (decision 537); D78 asks whether to write the lines.
