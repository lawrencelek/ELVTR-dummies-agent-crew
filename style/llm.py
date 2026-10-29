"""One agent call = one fresh headless Claude Code session: its own system prompt, no tools, no shared memory.

Same pattern as Assignments 3–5 (crew.py, content/pipeline.py, coder/llm.py). Needs `claude` on the PATH, signed in.
No API key here. Every input and output is saved in the case folder. STYLE_REPLAY=<run folder> reuses that run's
saved outputs by case and label (no model calls), so a run can be re-checked exactly.
"""
import json
import os
import shutil
import subprocess
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CLAUDE = shutil.which("claude") or "claude"
TIMEOUT_S = 900
MODELS = {"generator": os.environ.get("STYLE_GEN_MODEL", "sonnet"),
          "evaluator": os.environ.get("STYLE_EVAL_MODEL", "opus"),
          "refiner": os.environ.get("STYLE_REFINE_MODEL", "opus")}


def system_prompt(role):
    """The role's prompt; the evaluator and refiner also get the whole style guide, so the guide has one source."""
    text = (ROOT / "agents" / f"{role}.md").read_text(encoding="utf-8")
    if role in ("evaluator", "refiner"):
        text += "\n\n---\n\n" + (ROOT / "STYLE_GUIDE.md").read_text(encoding="utf-8")
    return text


def call(case, role, message, label):
    case.save(f"{label}_input.md", message)
    replay = os.environ.get("STYLE_REPLAY")
    if replay:
        p = Path(replay) / case.name / f"{label}_output_raw.txt"
        if p.exists():
            text = p.read_text(encoding="utf-8")
            case.save(f"{label}_output_raw.txt", text)
            case.calls.append({"label": label, "role": role, "replayed": True})
            return text
    cmd = [CLAUDE, "-p", "--system-prompt", system_prompt(role), "--tools", "", "--output-format", "json",
           "--no-session-persistence", "--model", MODELS[role]]
    t0 = time.time()
    for attempt in (1, 2):
        proc = subprocess.run(cmd, input=message, capture_output=True, text=True, encoding="utf-8", timeout=TIMEOUT_S, cwd=str(case.dir))
        if proc.returncode == 0:
            break
        if attempt == 2:
            raise RuntimeError(f"{role} call failed (exit {proc.returncode}): {(proc.stderr or proc.stdout)[-800:]}")
        time.sleep(5)
    env = json.loads(proc.stdout)
    if env.get("is_error"):
        raise RuntimeError(f"{role} returned an error: {str(env.get('result'))[:800]}")
    text = env.get("result") or ""
    usage = env.get("usage") or {}
    case.calls.append({"label": label, "role": role, "seconds": round(time.time() - t0, 1), "output_tokens": usage.get("output_tokens"),
                       "models": sorted((env.get("modelUsage") or {}).keys()), "cost_usd": env.get("total_cost_usd")})
    case.save(f"{label}_output_raw.txt", text)
    return text


def parse_json(text):
    """The first JSON object in a reply (fences tolerated)."""
    t = text.strip()
    if t.startswith("```"):
        t = t.split("\n", 1)[1] if "\n" in t else t
        t = t.rsplit("```", 1)[0]
    a, b = t.find("{"), t.rfind("}")
    if a < 0 or b < 0:
        raise ValueError("no JSON object in the reply")
    return json.loads(t[a:b + 1])
