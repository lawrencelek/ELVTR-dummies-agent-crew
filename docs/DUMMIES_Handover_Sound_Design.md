# DUMMIES — Handover: sound design and a sound designer agent

**30 October 2026 · Lawrence Lek** · From the Prototype 8.4 / Assignment #6 session ([session](https://claude.ai/code/session_0178chfCAHgSoGZFFKe3UpAm)). Read this first in the new chat.

## 0 Start the new chat

- **Where:** inside the Project "ELVTR Course - GDD". Its docs and instructions come with it.
- **First message:** "Read `claude/DUMMIES_Handover_Sound_Design.md` first. Then build the sound designer agent and add the audio."
- **For code:** use a session with GitHub access. Attach `lawrencelek/ELVTR-dummies-agent-crew` (push).
- **The audio pack is on your computer.** No session has seen it yet. Bring it one of three ways:
  1. **Link the chat to your computer.** Open the chat in the Claude desktop app and add the pack's folder. The chat reads the file names and copies what the build needs. *Recommended.*
  2. **Commit it yourself** to `assets/audio/music/` (the .ogg tracks) and `assets/audio/sfx/` (the .wav files). GitHub refuses files over 100 MB and warns over 50 MB.
  3. **Attach a zip** to the first message, if it fits the upload limit.
- **Also bring the licence.** Attach the pack's licence text or name its download page. Royalty-free packs often still require a credit.
- **Name the music files.** Say which file is Track 1, 2, 3, 4, 5 and 6, unless the file names already say so.
- **If this is a course assignment**, paste its brief into the first message.

## 1 What carries over

| Item | New chat in the project | Where |
|---|---|---|
| Project docs: GDD edits to 99, prototype docs, decisions, registry, style guides, write-ups | Yes, searchable | `claude/…` |
| Project instructions (house style) | Yes | Project settings |
| Code, builds, tests, runs, screenshots | Yes, by cloning | GitHub (all pushed) |
| The audio pack | No. Bring it (§0) | Your computer |
| This conversation | No; past-chat search only, if enabled | — |

- **Project knowledge:** about 1.56 of 2.0 MB used. Do not upload audio to the project; it is for text.

## 2 The game now

- **DUMMIES:** a top-down game. You are a crash-test dummy in training in SHENZHEN SMART CITY.
- **Lore (Edit 95):** the company in the game is Dummy Corporation. It makes custom dummies for high net-worth individuals. Certified dummies are sacrificed in their service.
  - Farsight publishes the game. It is named only on the Credits card.
- **Voice:** deadpan and inspirational. Sinofuturist city; corporate comedy. Style Guide V2.8 (`style/STYLE_GUIDE_V2.md`).
- **Build:** Prototype 8.4, `prototypes/p8/dummies_p8_4.html`. One self-contained HTML file, 1.3 MB. Fonts load from Google Fonts.
- **Flow (Edits 97–98):**
  - Intro screen (`ui.introScreen`): DUMMIES; the dummy steps in front of a car; one line; START.
  - Mode select: STORY, ARCADE, HIGH SCORES, CREDITS.
  - **Story:** save slots → Story splash (`ui.storySplash`; parts fly apart and back) → map → level card (`ui.levelCard`) → drone drop (`world.droneDropIn`) → play. 27 tiles in three acts. Finale: the monument unveiled; a drone to the ship; CERTIFIED; Credits.
  - **Arcade:** district select → level card → drone drop → play. Grades rise with write-offs (`arcade.grades`). Ends Licensed, Failed test or Non-compliant. High scores per district.
- **Current state in one page:** `claude/DUMMIES_GDD_Current_State.md`.

## 3 The request (verbatim)

> Next I want to integrate sound design.
>
> Next - a sound designer agent. I have downloaded royalty-free music tracks and sound effects pack.
>
> Music -
> Track 1 - Splash Screen
> Track 2 - From menu until just before the level starts (whether story or arcade mode)
> Track 3, 4, 5, 6, Alternate between different levels and maps.
>
> SFX - read WAV file names and decide on appropriate places to put the sound triggers.
>
> Make documentation that covers what SFX (wav) and MUSIC (ogg) cues play at which points.

### 3.1 Readings to confirm (ask Lawrence once, at the start)

| # | Question | Proposed reading |
|---|---|---|
| Q1 | "Splash Screen": the intro screen (DUMMIES, START) or the Story splash (NEW GAME, CONTINUE)? | The intro screen. The Story splash comes after the mode select, inside Track 2's span |
| Q2 | Where does Track 2 end: before the level card, or before the drone drop? | Track 2 plays through the level card. The level's track starts with the drone drop |
| Q3 | "Alternate between different levels and maps": how? | Story: tile *n* in story order plays Track 3 + ((*n* − 1) mod 4), so neighbouring tiles differ. Arcade: one track per run, rotating each new run |
| Q4 | Screens the request does not place: pause, gift screen, level report, Failed test, the finale, Credits, high-score entry | Pause ducks the music. The gift screen and level report keep the level track. The finale and Credits play Track 1 again |
| Q5 | After a write-off, inside the same level: restart the track or carry on? | Carry on |
| Q6 | SFX for car barks (each bubble), or physical events only? | Physical events, UI and story beats. A soft blip per bark bubble, if the pack has one |

- Every proposal above is the assistant's. Record each answer as a DECISIONS row, user-decided or proposed.

## 4 Constraints

- **Autoplay.** Browsers block audio until the first user gesture.
  - Track 1 cannot start on page load. It starts on the first key, click or tap (§6.3).
  - Unlock the AudioContext on that gesture.
- **Single-file build.** Inlining audio as base64 adds a third to its size. Options:
  - (a) Audio files beside the HTML (`audio/`), loaded by URL. Works on GitHub Pages and a local server. On `file://`, `fetch` fails, but `<audio src>` still plays.
  - (b) Inline the SFX (small), stream the music by URL. *Proposed;* measure first.
  - (c) Inline everything: one file, very large.
- **Formats.**
  - Music stays OGG, as supplied. Check Safari and iOS support for Ogg on the target devices; transcode a fallback with `ffmpeg` if needed.
  - SFX arrive as WAV. Keep the originals; a compressed copy may ship.
- **Loudness.** Measure every file (`ffmpeg -af ebur128`, or `loudnorm` in measure mode). Record LUFS and peak in the asset manifest. Normalise to one target per bus.
- **Frequency.** Some events fire often: near-misses, braking, headlight flashes, combo links. Give each cue a cooldown and cap the voices.
- **Registry first.** Every audio statistic gets an ID before it is used (house rule). Registry `edit99-2026-10-29`, 525 entries → `edit100`. Proposed family:
  - `audio.enabled` (flag, default 0; the new build sets 1).
  - `audio.music.volume`, `audio.sfx.volume`, `audio.ui.volume`.
  - `audio.music.crossfadeSeconds`, `audio.music.pauseDuck`.
  - `audio.sfx.maxVoices`, `audio.sfx.cooldown.<cue>`.
  - `audio.music.track.<screen>`, `audio.music.levelRotation`.
  - Values are for the new chat to propose and Lawrence to confirm.
- **Options.** Add MUSIC and SOUND volume, and mute, to the pause menu's options (Edit 86). Store them next to the touch layout in the browser (§6.4).
- **Frozen builds.** Prototype 8.4 and every earlier build stay byte-identical. Audio ships in the next build (Prototype 9, or 8.5), behind `audio.enabled` in the shared code.
- **Licence.** Record each file's source, licence and required credit in the asset manifest.
  - If the pack needs a credit, the Credits card gains a line. Style Guide V2's C1 limits the card to the game, its maker and its publisher, so C1 changes first (user-decided).
- **Text.** New labels (MUSIC, SOUND) are interface chrome: out of the style guide's scope (row 540). They name no company.

## 5 The sound designer agent (suggested; the new chat decides)

Same pattern as Assignments 4–6: deterministic evidence, a designer, a reviewer that scores, a fix loop, saved runs.

1. **Inventory** (no model). `audio/inventory.py` lists each file: name, folder, duration, channels, sample rate, LUFS, peak. Output `content/audio/inventory.json`.
2. **Event catalogue** (no model). Every trigger point in §6, with an ID (`sfx.<event>`, `music.<state>`), its frequency class (once, per action, per frame) and its GDD source. Output `content/audio/events.json`.
3. **Designer agent.** Reads the inventory (file names, durations), the catalogue and the GDD's tone. Proposes the cue map:
   - SFX: event → file or variation pool, bus, volume ID, cooldown ID; or a stated silence.
   - Music: the state machine, screen → track, loops and crossfades.
4. **Reviewer agent.** Returns SCORE and REASON, as in Assignment 6. It checks:
   - **Coverage:** every high-priority event has a cue or a stated silence.
   - **Fit:** the name and duration suit the event. A six-second explosion on a footstep fails.
   - **Clashes:** no file serves two events that can fire together.
   - **Spam:** per-frame events have cooldowns.
   - **Loudness and licence:** both recorded.
5. **Refiner** revises from the REASON. Loop until 10/10 or the round cap. No human step inside.
6. **Integrator.** Writes:
   - `content/audio/cues.json`, the machine-readable cue map.
   - The audio code, behind `audio.enabled`.
   - A new build.
7. **Tests, headless.**
   - Stub the AudioContext and log each cue.
   - Walk a scripted tour (like `prototypes/p8/text_audit.js`).
   - Assert: each screen plays its track; each catalogued event fires its cue; nothing plays before the first gesture; every file in `cues.json` exists.
8. **Documentation (the request's deliverable).** GDD Edit 100, "Sound", with two tables:
   - **MUSIC:** track (.ogg) → screens and states, loop, transitions, registry IDs.
   - **SFX:** cue → WAV, trigger point (screen or event), bus, volume ID, cooldown ID.

## 6 Where sound can trigger (code survey, Prototype 8.4)

<!--SURVEY-->

## 7 Repositories

| Repo | Branch | Role |
|---|---|---|
| `lawrencelek/ELVTR-dummies-agent-crew` | `assignment4/content-pipeline` (HEAD `a0e3515`) | Working repo: prototypes, content, registry, decisions, `style/`, `coder/` |
| `lawrencelek/ELVTR-Multiagent-Submission-6` | `main` (`7b0ea2f`) | Assignment #6: Style Guide Agent, V2-first, with the 8.4 build |
| `lawrencelek/ELVTR-Multiagent-Submission-5` | `main` = `gh-pages` | Assignment #5; GitHub Pages hosts 7.13. No hosted 8.x yet |

## 8 Current state

- **Build:** Prototype 8.4 (`prototypes/p8/build.py`; GDD Edit 99).
- **Registry:** `content/params/tuning.parameters.json`, `edit99-2026-10-29`, 525 entries. Style IDs: `style/style.params.json`.
- **Decisions:** `DECISIONS.md`, rows 1–590. Open: D67–D85. Newest:
  - D83: text left on the map's tile panel and the objective strip.
  - D84: the scanner hatch inside the view cone.
  - D85: tales cluster at the 20-word cap.
- **Text:** `content/story/story_v2.json`, `prototypes/p8/lore.js`. Style loop: `style/loop.py --guide v2`.
- **Tools in the workspace:** `ffmpeg` and `ffprobe` were present here. Check with `which`; install if missing.

## 9 Run and test

```
cd prototypes/p8 && python3 build.py                 # rebuild 8.4 (frozen: do not commit a changed 8.4)
cd prototypes/p8 && node test_p84.js docs/p84        # 41/41; Playwright; screenshots to docs/p84
node prototypes/p8/text_audit.js prototypes/p8/dummies_p8_4.html out.json   # every string drawn on a 32-step tour
cd prototypes/p7 && node test_p713.js docs           # 103/103: the shared code still serves 7.13
python3 style/loop.py --guide v2 --piece draft.json  # the style loop, for any new text
```

- **New build:** copy `prototypes/p8/build.py` to the new folder, add the audio, and freeze 8.4 in the test's byte-identical list (as `test_p84.js` froze 8.3).

## 10 Conventions

- **House style:** direct start; no chatter; active voice; sentences under 15 words; bullet fragments.
- **Data:** every statistic names a registry ID. New statistics get an ID first.
- **Registry writes:** `json.dumps(d, indent=1, ensure_ascii=False) + '\n'`.
- **Frozen builds** never change. Shared code changes are gated by flags in `P7SIM` / `window.DUMMIES_SIM`.
- **GDD edits:** one per build. Request quoted, readings flagged, rulings recorded; then sections, Build, Measured, Registry, Open.
- **Commit author:** Claude <noreply@anthropic.com>. **Trailer:**
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: <the new session's URL>
  ```
- **Project docs:** `project_write` takes an absolute `local_path` inside the working directory.

## 11 Read first (project docs)

1. `claude/DUMMIES_GDD_Current_State.md`: the game as it stands, with registry IDs.
2. `claude/DUMMIES_GDD_Edit98_Prototype_8_3_Intro_Level_Card_Drone_Drop.md`: the screens Track 1 and Track 2 cover.
3. `claude/DUMMIES_GDD_Edit97_Prototype_8_2_Tales_High_Scores_Arcade_Loop.md` §7: the Arcade loop and grades.
4. `claude/DUMMIES_GDD_Edit99_Prototype_8_4_Cones_Lights_Cue_Key.md`: the car cues (noticed, braking, spent): candidate SFX.
5. `claude/DUMMIES_GDD_Edit86_Prototype_7_5_Clean_Screen_Pause_Options.md`: the pause menu and options.
6. `claude/DUMMIES_GDD_Edit95_Prototype_8_Lore_Dummy_Corporation.md` and `claude/DUMMIES_Style_Guide_V2.md`: tone; the Credits rule (C1).
7. `claude/DUMMIES_P8_Prototype.md`: the 8.x builds.
8. `claude/DUMMIES_Submission6_Style_Guide_Agent.md` §2: the loop pattern to reuse.
