#!/usr/bin/env bash
# Copy the Style Guide Agent and the inputs it reads into the submission repository, at the same paths.
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
)
for f in "${files[@]}"; do mkdir -p "$DST/$(dirname "$f")"; cp "$SRC/$f" "$DST/$f"; done
rm -rf "$DST/style" && cp -r "$SRC/style" "$DST/style"
find "$DST/style" \( -name '__pycache__' -o -name '.fleet.*' -o -name '*.tmp' \) -prune -exec rm -rf {} +
echo "copied ${#files[@]} files and style/ to $DST"
