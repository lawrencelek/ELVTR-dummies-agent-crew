#!/usr/bin/env python3
"""DUMMIES agent crew - raw orchestration (no framework).

Three role-specific agents, each a separate headless Claude Code call with its
own system prompt and no shared conversation:

  Rules Designer -> Game Builder -> executable checks -> QA / Repair Reviewer
                         ^                                      |
                         +------ repair requests (max 2) -------+

Usage:  python crew.py            (needs: Python 3.9+, Node 18+, Claude Code signed in)
        python crew.py --from-run runs/<timestamp>   (reuse that run's specification and first build)
        python crew.py --change changes/CR-xxx.md     (revise the released build in output/ for one change request)
Output: runs/<timestamp>/ (every intermediate artifact) and output/game/ (released build)
"""
import datetime
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MAX_REPAIRS = 2
CALL_TIMEOUT_S = 1500
MODEL = os.environ.get("CREW_MODEL")  # optional; default is whatever Claude Code is set to
CLAUDE = shutil.which("claude") or "claude"


class Run:
    def __init__(self):
        self.dir = ROOT / "runs" / datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        self.dir.mkdir(parents=True)
        self.log_lines = []
        self.calls = []

    def log(self, msg):
        line = f"[{datetime.datetime.now().strftime('%H:%M:%S')}] {msg}"
        print(line, flush=True)
        self.log_lines.append(line)
        (self.dir / "run_log.txt").write_text("\n".join(self.log_lines) + "\n", encoding="utf-8")

    def save(self, name, text):
        path = self.dir / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path


def call_agent(run, role, prompt_file, user_message, label):
    """One agent = one fresh headless Claude Code session with a role system prompt and no tools."""
    system_prompt = (ROOT / "agents" / prompt_file).read_text(encoding="utf-8")
    cmd = [CLAUDE, "-p", "--system-prompt", system_prompt, "--tools", "", "--output-format", "json"]
    if MODEL:
        cmd += ["--model", MODEL]
    run.save(f"{label}_input.md", user_message)
    run.log(f"{role}: calling ({len(user_message):,} chars in)")
    proc = subprocess.run(cmd, input=user_message, capture_output=True, text=True,
                          encoding="utf-8", timeout=CALL_TIMEOUT_S, cwd=str(run.dir))
    if proc.returncode != 0:
        raise RuntimeError(f"{role} call failed (exit {proc.returncode}): {proc.stderr[-800:] or proc.stdout[-800:]}")
    envelope = json.loads(proc.stdout)
    if envelope.get("is_error"):
        raise RuntimeError(f"{role} returned an error: {str(envelope.get('result'))[:800]}")
    text = envelope.get("result") or ""
    usage = envelope.get("usage") or {}
    run.calls.append({"label": label, "role": role, "seconds": round(envelope.get("duration_ms", 0) / 1000, 1),
                      "output_tokens": usage.get("output_tokens"), "models": sorted((envelope.get("modelUsage") or {}).keys())})
    run.save(f"{label}_output_raw.txt", text)
    run.log(f"{role}: done in {run.calls[-1]['seconds']} s ({len(text):,} chars out)")
    return text


def parse_json(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
    start, end = text.find("{"), text.rfind("}")
    if start < 0 or end < 0:
        raise ValueError("no JSON object in agent output")
    return json.loads(text[start:end + 1])


def parse_files(text):
    files = {m.group(1).strip(): m.group(2).strip("\n") + "\n"
             for m in re.finditer(r"=== FILE: (.+?) ===\n(.*?)\n=== END FILE ===", text, re.S)}
    notes = text.split("=== NOTES ===", 1)[1].strip() if "=== NOTES ===" in text else ""
    missing = [f for f in ("sim.js", "index.html") if f not in files]
    if missing:
        raise ValueError(f"Builder output is missing {missing}")
    return {k: files[k] for k in ("sim.js", "index.html")}, notes


def run_checks(run, build_dir, spec_path, label):
    proc = subprocess.run(["node", str(ROOT / "checks" / "run_checks.js"), str(build_dir), str(spec_path)],
                          capture_output=True, text=True, encoding="utf-8", timeout=180)
    try:
        report = json.loads(proc.stdout)
    except json.JSONDecodeError:
        report = {"total": 1, "passed": 0, "failed": 1, "all_passed": False, "results": [
            {"id": "harness", "description": "check harness ran", "pass": False,
             "detail": (proc.stderr or proc.stdout)[-800:]}]}
    run.save(f"{label}_checks.json", json.dumps(report, indent=2))
    run.log(f"Checks: {report['passed']}/{report['total']} passed"
            + ("" if report["all_passed"] else " | failing: " + ", ".join(r["id"] for r in report["results"] if not r["pass"])))
    return report


def main():
    run = Run()
    run.log(f"DUMMIES crew run -> {run.dir.relative_to(ROOT)}")
    brief = (ROOT / "SLICE_BRIEF.md").read_text(encoding="utf-8")
    contract = brief[brief.index("## Fixed technical contract"):]
    baseline = (ROOT / "baseline" / "dummies-testpad.html").read_text(encoding="utf-8")
    baseline_config = baseline[baseline.index("1. CONFIG"):baseline.index("2. REPORT BANK")]
    reuse = Path(sys.argv[sys.argv.index("--from-run") + 1]) if "--from-run" in sys.argv else None
    # Change mode: revise the released build instead of porting the baseline again.
    change = Path(sys.argv[sys.argv.index("--change") + 1]).read_text(encoding="utf-8") if "--change" in sys.argv else None
    prev_files = {n: (ROOT / "output" / "game" / n).read_text(encoding="utf-8") for n in ("sim.js", "index.html")} if change else None
    released_spec = (ROOT / "output" / "spec.json").read_text(encoding="utf-8") if change else None
    if change and "--spec-base" in sys.argv:      # revise from an unreleased specification of an earlier run
        sb = Path(sys.argv[sys.argv.index("--spec-base") + 1]); released_spec = sb.read_text(encoding="utf-8")
        run.log(f"Change mode: the Designer revises the specification from {sb.parent.name} (not released) instead of output/spec.json")
    if change and "--base-build" in sys.argv:     # start the Builder from an unreleased build of an earlier run
        bb = Path(sys.argv[sys.argv.index("--base-build") + 1]); prev_files = {n: (bb / n).read_text(encoding="utf-8") for n in ("sim.js", "index.html")}
        run.log(f"Change mode: the Builder starts from {bb.parent.name}/{bb.name} (not released) instead of output/game")
    if change:
        run.log("Change mode: revising the released build in output/ for " + Path(sys.argv[sys.argv.index("--change") + 1]).name)

    # --- Agent 1: Rules Designer -------------------------------------------------
    if reuse and (reuse / "01_spec.json").exists():
        spec_text = (reuse / "01_spec.json").read_text(encoding="utf-8")
        run.log(f"Rules Designer: NOT called; specification reused from {reuse.name}")
    elif change:
        spec_text = call_agent(run, "Rules Designer", "rules_designer.md",
                               "CHANGE REQUEST. Revise the current specification below so that it implements the change request and the updated brief. "
                               "Return the complete specification in the same JSON shape. Keep every value, rule and acceptance criterion that the change "
                               "does not touch exactly as it is; rewrite or remove the ones it replaces; add numbered rules under changed_rules and new "
                               "acceptance criteria for everything new, and list the change under differences.\n\n# CHANGE REQUEST\n" + change
                               + "\n\n# UPDATED BRIEF\n" + brief + "\n\n# CURRENT SPECIFICATION\n" + released_spec, "01_designer")
    else:
        spec_text = call_agent(run, "Rules Designer", "rules_designer.md",
                               "Vertical slice brief follows, then the CONFIG section of the baseline Testpad. "
                               "Produce the specification JSON.\n\n" + brief
                               + "\n\n# BASELINE TESTPAD, SECTION 1. CONFIG (per-frame units)\n" + baseline_config, "01_designer")
    spec = parse_json(spec_text)
    spec_json = json.dumps(spec, indent=2)
    spec_path = run.save("01_spec.json", spec_json)
    run.log(f"Specification: {len(spec.get('acceptance_criteria', []))} acceptance criteria, "
            f"{len(spec.get('simplifications_vs_gdd', []))} labelled simplifications")

    # --- Agent 2: Game Builder, then checks, then Agent 3: QA, with bounded repair ---
    files, qa, checks, released = None, None, None, False
    for attempt in range(1, MAX_REPAIRS + 2):
        tag = f"{attempt + 1:02d}_build_v{attempt}"
        if attempt == 1 and change:
            builder_msg = ("CHANGE PASS. Your current files are below. Update them to the revised specification and the change request. "
                           "Change only what the change needs, keep everything else working, and return both complete files.\n\n"
                           "# CHANGE REQUEST\n" + change + "\n\n# REVISED SPECIFICATION (from the Rules Designer)\n" + spec_json
                           + "\n\n# CONTRACT\n" + contract
                           + "".join(f"\n\n# YOUR CURRENT {n}\n{c}" for n, c in prev_files.items()))
        elif attempt == 1:
            builder_msg = ("Port the baseline Testpad to the contract and implement this specification.\n\n"
                           "# SPECIFICATION (from the Rules Designer)\n" + spec_json
                           + "\n\n# CONTRACT\n" + contract
                           + "\n\n# BASELINE TESTPAD (complete source)\n" + baseline)
        else:
            failing = [r for r in checks["results"] if not r["pass"]]
            builder_msg = ("REPAIR PASS. Fix every item below and return both complete files.\n\n"
                           "# FAILING AUTOMATED CHECKS\n" + json.dumps(failing, indent=2)
                           + "\n\n# QA REPAIR REQUESTS\n" + json.dumps(qa.get("repair_requests", []), indent=2)
                           + "\n\n# QA DEFECTS\n" + json.dumps(qa.get("defects", []), indent=2)
                           + "\n\n# SPECIFICATION\n" + spec_json + "\n\n# CONTRACT\n" + contract
                           + "".join(f"\n\n# YOUR PREVIOUS {n}\n{c}" for n, c in files.items())
                           + "\n\n# BASELINE TESTPAD (reference)\n" + baseline)
        prior = reuse / "02_build_v1" if reuse else None
        if attempt == 1 and prior and (prior / "sim.js").exists():
            files = {n: (prior / n).read_text(encoding="utf-8") for n in ("sim.js", "index.html")}
            notes = (reuse / "02_build_v1_notes.txt").read_text(encoding="utf-8").strip()
            run.log(f"Game Builder: NOT called for build 1; files reused from {reuse.name}")
        else:
            files, notes = parse_files(call_agent(run, "Game Builder", "game_builder.md", builder_msg, tag))
        build_dir = run.dir / tag
        build_dir.mkdir(exist_ok=True)
        for name, content in files.items():
            (build_dir / name).write_text(content, encoding="utf-8")
        run.save(f"{tag}_notes.txt", notes + "\n")

        checks = run_checks(run, build_dir, spec_path, tag)

        qa_msg = ("Review this build.\n\n"
                  + ("# CHANGE REQUEST THIS BUILD MUST IMPLEMENT (where it differs from the Testpad, the change request wins)\n" + change + "\n\n" if change else "")
                  + "# SPECIFICATION (from the Rules Designer)\n" + spec_json
                  + "\n\n# AUTOMATED CHECK RESULTS (executed by the orchestrator, not by the Builder)\n" + json.dumps(checks, indent=2)
                  + "\n\n# BUILDER NOTES\n" + notes
                  + "".join(f"\n\n# FILE {n}\n{c}" for n, c in files.items())
                  + "\n\n# BASELINE TESTPAD (reference for unchanged behaviour; not under review)\n" + baseline)
        qa = parse_json(call_agent(run, "QA / Repair Reviewer", "qa_reviewer.md", qa_msg, f"{tag}_qa"))
        run.save(f"{tag}_qa.json", json.dumps(qa, indent=2))
        run.log(f"QA verdict: {qa.get('verdict')} | {len(qa.get('repair_requests', []))} repair request(s) | {qa.get('summary', '')}")

        # Release gate: executable checks AND the independent reviewer must both agree.
        if checks["all_passed"] and qa.get("verdict") == "release":
            released = True
            break
        if attempt <= MAX_REPAIRS:
            run.log(f"Not released -> repair cycle {attempt} of {MAX_REPAIRS}")

    # --- Release or report failure ------------------------------------------------
    summary = {"released": released, "build_attempts": attempt, "repair_cycles_used": attempt - 1,
               "checks_passed": checks["passed"], "checks_total": checks["total"],
               "qa_verdict": qa.get("verdict"), "agent_calls": run.calls}
    run.save("summary.json", json.dumps(summary, indent=2))
    if released:
        out = ROOT / "output"
        (out / "game").mkdir(parents=True, exist_ok=True)
        for name, content in files.items():
            (out / "game" / name).write_text(content, encoding="utf-8")
        (out / "spec.json").write_text(spec_json, encoding="utf-8")
        (out / "qa_report.json").write_text(json.dumps(qa, indent=2), encoding="utf-8")
        (out / "checks.json").write_text(json.dumps(checks, indent=2), encoding="utf-8")
        (out / "run_summary.json").write_text(json.dumps({**summary, "run": run.dir.name}, indent=2), encoding="utf-8")
        run.log(f"RELEASED after {attempt} build(s). Open output/game/index.html in a browser.")
        return 0
    run.log(f"NOT RELEASED after {attempt} build(s): checks {checks['passed']}/{checks['total']}, QA verdict {qa.get('verdict')}. "
            f"Nothing was copied to output/.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
