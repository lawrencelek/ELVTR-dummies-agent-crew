#!/usr/bin/env bash
# Copy the Style Guide Agent, the inputs it reads and the current build (Prototype 8.4) into the submission repository, at the same paths.
#   bash style/publish_submission.sh ../elvtr-multiagent-submission-6
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
DST="$(cd "$1" && pwd)"
files=(
  DECISIONS.md
  content/rag.py content/kb_build.py
  content/db/fleet.json content/db/check_lore.py content/db/README.md
  content/story/story.json
  content/kb/DUMMIES_GDD_Edit26.md content/kb/DUMMIES_V29_Design.md content/kb/p3/DUMMIES_GDD_Edit39_Canon_Lore_City.md
  coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md
  coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md
  coder/gdd/DUMMIES_GDD_Edit94_Prototype_7_13_Finale_Coding_Agent.md
  coder/gdd/DUMMIES_GDD_Edit95_Prototype_8_Lore_Dummy_Corporation.md
  coder/gdd/DUMMIES_GDD_Edit96_Prototype_8_1_Tales_CBD_Campus.md
  coder/gdd/DUMMIES_GDD_Edit97_Prototype_8_2_Tales_High_Scores_Arcade_Loop.md
  coder/gdd/DUMMIES_GDD_Edit98_Prototype_8_3_Intro_Level_Card_Drone_Drop.md
  coder/gdd/DUMMIES_GDD_Edit99_Prototype_8_4_Cones_Lights_Cue_Key.md
  coder/gdd/DUMMIES_GDD_Current_State_Edit99.md
  content/story/story_v2.json content/params/tuning.parameters.json
  prototypes/p8/dummies_p8_4.html prototypes/p8/README.md prototypes/p8/lore.js prototypes/p8/make_lore.py prototypes/p8/text_audit.js
  prototypes/p8/docs/p84/p84_intro.png prototypes/p8/docs/p84/p84_card_a1.png prototypes/p8/docs/p84/p84_ending.png
  prototypes/p8/docs/p84/p84_arcade_card.png prototypes/p8/docs/p84/p84_cue_key.png prototypes/p8/docs/p84/p8_credits.png
  prototypes/p8/docs/p84/audit_title.png prototypes/p8/docs/p84/p8_texts.json
)
for f in "${files[@]}"; do mkdir -p "$DST/$(dirname "$f")"; cp "$SRC/$f" "$DST/$f"; done
rm -rf "$DST/style" && cp -r "$SRC/style" "$DST/style"
find "$DST/style" \( -name '__pycache__' -o -name '.fleet.*' -o -name '*.tmp' \) -prune -exec rm -rf {} +
echo "copied ${#files[@]} files and style/ to $DST"
