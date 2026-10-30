"""One agent call = one fresh headless Claude Code session: its own system prompt, no tools, no shared memory.

Same pattern as Assignments 3 and 4 (crew.py, content/pipeline.py). Needs `claude` on the PATH, signed in. No API key here.
Every input and output is saved in the run folder. CODER_REPLAY=<run folder> reuses that run's saved outputs by label
(no model calls), so a run can be re-checked exactly.
"""
import json
import os
import shutil
import subprocess
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CLAUDE = shutil.which("claude") or "claude"
TIMEOUT_S = 2400


def call(run, role, prompt_file, message, label, model=None):
    system = (ROOT / "agents" / prompt_file).read_text(encoding="utf-8")
    run.save(f"{label}_input.md", message)
    replay = os.environ.get("CODER_REPLAY")
    if replay:
        p = Path(replay) / f"{label}_output_raw.txt"
        if p.exists():
            text = p.read_text(encoding="utf-8")
            run.save(f"{label}_output_raw.txt", text)
            run.log(f"{role}: replayed {label} from {replay} ({len(text):,} chars)")
            run.calls.append({"label": label, "role": role, "replayed": True})
            return text
    cmd = [CLAUDE, "-p", "--system-prompt", system, "--tools", "", "--output-format", "json"]
    if model:
        cmd += ["--model", model]
    run.log(f"{role}: calling {model or 'default model'} ({len(message):,} chars in)")
    t0 = time.time()
    proc = subprocess.run(cmd, input=message, capture_output=True, text=True, encoding="utf-8", timeout=TIMEOUT_S, cwd=str(run.dir))
    if proc.returncode != 0:
        raise RuntimeError(f"{role} call failed (exit {proc.returncode}): {(proc.stderr or proc.stdout)[-800:]}")
    env = json.loads(proc.stdout)
    if env.get("is_error"):
        raise RuntimeError(f"{role} returned an error: {str(env.get('result'))[:800]}")
    text = env.get("result") or ""
    usage = env.get("usage") or {}
    run.calls.append({"label": label, "role": role, "seconds": round(time.time() - t0, 1), "output_tokens": usage.get("output_tokens"),
                      "models": sorted((env.get("modelUsage") or {}).keys()), "cost_usd": env.get("total_cost_usd")})
    run.save(f"{label}_output_raw.txt", text)
    run.log(f"{role}: done in {run.calls[-1]['seconds']} s ({len(text):,} chars out)")
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
