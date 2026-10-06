Review this build.

# SPECIFICATION (from the Rules Designer)
{
  "game": "DUMMIES",
  "slice": "one road, one sedan, one dummy",
  "params": {
    "world": {
      "width": 960,
      "height": 540
    },
    "road": {
      "y": 270,
      "halfWidth": 80
    },
    "dummy": {
      "radius": 10,
      "walkSpeed": 90,
      "runSpeed": 190,
      "accelTime": 0.6,
      "lungeDistance": 130,
      "lungeDuration": 0.2,
      "recoveryTime": 0.7,
      "maxHealth": 100,
      "startX": 480,
      "startY": 430
    },
    "car": {
      "length": 80,
      "width": 40,
      "cruiseSpeed": 220,
      "minSpeed": 120,
      "detectRange": 300,
      "detectHalfAngleDeg": 35,
      "commitDistance": 150,
      "swerveClearance": 30,
      "maxSteerRateDeg": 100,
      "brakeDecel": 120,
      "respawnDelay": 1.5
    },
    "damage": {
      "base": 20,
      "perSpeed": 0.16,
      "lungeMultiplier": 1.5
    },
    "reset": {
      "delay": 1.5
    }
  },
  "colours": {
    "background": "#1c1e21",
    "road": "#3a3d42",
    "roadEdge": "#8a8d92",
    "dummy": "#f2c94c",
    "dummyLunging": "#ffe58a",
    "dummyRecovering": "#9a7d1f",
    "dummyDestroyed": "#6b2a2a",
    "car": "#d9534f",
    "wedge": "#fff7a8",
    "wedgeAlpha": 0.22,
    "chevronUpdating": "#4fc3f7",
    "chevronLocked": "#ff8a00",
    "commitRing": "#ffffff",
    "commitRingAlpha": 0.5,
    "brakeLightsOn": "#ff1744",
    "brakeLightsOff": "#5a1a1a",
    "labelText": "#e6e6e6"
  },
  "dummy_rules": [
    "Coordinates: pixels, origin top-left, +y down. Input dx/dy in {-1,0,1}; dy=-1 is up the screen.",
    "Movement is allowed only in mode 'idle'. Desired direction = (dx,dy) normalised to unit length, so diagonals have the same speed as cardinals. If (dx,dy)=(0,0), speed=0 and dummy.holdTime=0.",
    "While a direction is held in idle: holdTime += dt; speed = walkSpeed + (runSpeed-walkSpeed)*min(1, holdTime/accelTime). Changing direction while keys stay held does not reset holdTime. Releasing all keys resets it. holdTime is stored on state.dummy as an extra field.",
    "Position += unit direction * speed * dt. Clamp to the world rectangle inset by radius. facing is set to the normalised input direction whenever the input is non-zero. Initial facing is (0,-1).",
    "Lunge start: in mode 'idle' on a rising edge of input.lunge (false->true; the previous value is stored in state, e.g. state.prevLunge). Facing is locked at that moment: mode='lunging', lungeTimer=0, speed=lungeDistance/lungeDuration (650 px/s). A lunge ignores dx/dy and lunge input while lunging, so there is no midair steering.",
    "While lunging: position += facing * (lungeDistance/lungeDuration) * dt. After lungeDuration seconds the total travel equals lungeDistance in every direction (to within one step). The last step must be clipped so the total is exactly lungeDistance, ignoring world-edge clamping.",
    "Lunge ending without a car impact (a miss): mode='recovering', speed=0, recoveryTimer=recoveryTime (0.7 s). In recovering, movement and lunge input are ignored and the dummy does not move. At 0 it returns to 'idle' with holdTime=0.",
    "Lunge that causes an impact: the impact is resolved (see collision_rules), the lunge ends at once, and the dummy returns directly to 'idle' with speed 0 and no recovery delay. The recovery delay applies only to misses.",
    "Health starts at maxHealth (100). When health <= 0: health=0, mode='destroyed', bodiesDestroyed += 1, speed=0, resetTimer=reset.delay (1.5 s). A destroyed dummy cannot move or lunge, is not detected by the car and has no collision.",
    "When resetTimer reaches 0 a fresh body appears: x=startX, y=startY, facing=(0,-1), speed=0, health=maxHealth, mode='idle', holdTime=0. Score and bodiesDestroyed persist across resets.",
    "The dummy start position (480,430) is below the road (road band y from 190 to 350), so a new body never spawns inside the lane."
  ],
  "car_rules": [
    "Road lane: the car travels left to right at lane centre y=270. Allowed car centre y range is [road.y - (halfWidth - width/2), road.y + (halfWidth - width/2)] = [210, 330].",
    "Spawn: when state.car is null, traffic is true, and the despawn/start timer has reached respawnDelay (1.5 s), spawn x=-length, y=270, heading=0, speed=cruiseSpeed, mode 'cruising', braking=false, route=null. The first car spawns at time = respawnDelay. With traffic:false no car is ever created. The car despawns (state.car=null) when x - length/2 > world.width, and the respawnDelay timer starts then.",
    "Detection (mode 'cruising' -> 'detected'): the dummy is not destroyed, is within detectRange (300) of the car centre, is ahead of the car centre along its heading, and the angle between the heading and the vector car->dummy is <= detectHalfAngleDeg (35). This is the same wedge that is drawn.",
    "Route computation (while 'detected'; recomputed every step, and the car never looks at anything except the dummy): corridor = width/2 + dummy.radius + swerveClearance = 60. If the dummy is ahead of the car's rear (dummy.x > car.x - length/2) and |dummy.y - 270| < corridor, then targetY = dummy.y - corridor if dummy.y >= 270, otherwise dummy.y + corridor (swerve away from the dummy). Otherwise targetY = 270. Clamp targetY to [210,330]. route = normalise(commitDistance, targetY - car.y), so it is a unit vector (x>0).",
    "Steering: heading rotates toward atan2(route.y, route.x) at no more than maxSteerRateDeg (100 deg/s) per second. Position += (cos h, sin h) * speed * dt. y is clamped to [210,330].",
    "Braking: on entering 'detected' the target speed is minSpeed (120). While speed > minSpeed, speed -= brakeDecel*dt (120 px/s^2), floored at minSpeed, and braking=true. braking=true on every step in which speed actually decreased, and false otherwise. Detected sticky: once detected the car stays detected until it commits, passes the dummy, or the dummy is destroyed. It does not drop back to cruising because the dummy left the wedge or range.",
    "Commitment ('detected' -> 'committed'): when the car-centre to dummy-centre distance <= commitDistance (150) (the commit ring). At that step route is copied, frozen as the locked route, and also stored with the locked targetY in extra fields (e.g. car.lockedTargetY). The route is never recomputed again while committed, so state.car.route is bit-identical on every later step.",
    "Committed steering: the car rotates its heading toward the locked route's angle at maxSteerRateDeg and holds it. Once |car.y - lockedTargetY| <= 1.5 px its steering target becomes heading 0 (straighten), which is treated as the end of the locked plan. The route vector itself still does not change. Speed keeps changing (continues braking to minSpeed). Steering is never re-aimed at the dummy.",
    "Pass reset: if mode is 'detected' or 'committed' and (car.x - dummy.x > length) or the dummy is destroyed, then mode='cruising', route=null. Cruising speeds up at +brakeDecel*dt (braking=false) up to cruiseSpeed. In cruising, heading steers toward lane centre y=270 using the same route law with targetY=270, so a car that has passed the dummy drifts back to the lane.",
    "A car with no dummy in its wedge (for example a dummy standing at the start position) stays 'cruising' at cruiseSpeed, braking=false, route=null. A car that detects a dummy off to the side detects and brakes, shows a straight chevron (targetY=270), and may commit if the dummy is within 150 px.",
    "The car is not affected by the dummy (no mass or knockback), and its speed is unchanged by an impact. Checks may overwrite car.x,y,heading,speed,mode,braking,route, so step must derive everything from state."
  ],
  "collision_rules": [
    "Shape test: the dummy is a circle (radius 10). The car is an oriented rectangle (length 80 along heading, width 40) centred at (x,y). Overlap = circle-vs-OBB intersection. Dummies in mode 'destroyed' never collide.",
    "Contact episode: state.contactActive (stored in state). When overlap is true and contactActive is false, a contact episode begins: set contactActive=true and resolve exactly one impact. While overlap stays true, no further impacts occur. When overlap is false, contactActive=false (re-armed). One impact per dummy-vehicle contact episode.",
    "Rear contact: express the dummy centre in the car frame (local x along heading, 0 at the car centre). If local x < -length/4 (-20), the contact is REAR contact: no damage, no score. It still counts as a contact episode.",
    "Non-rear contact (front or side): damage = (damage.base + damage.perSpeed * car.speed), multiplied by damage.lungeMultiplier if dummy.mode=='lunging' at that moment. Applied loss = min(health, damage); health -= loss; score += loss. Example at cruise 220 non-lunging: 55.2; lunging: 82.8. A single hit never destroys a fresh body (<100), two hits at cruise always do. At minSpeed 120 a lunging hit does 58.8 and two still destroy.",
    "After any contact (including rear) the dummy is pushed out of the rectangle along the contact normal (nearest point on the OBB to the circle centre) so it no longer overlaps and cannot be run over repeatedly. A lunging dummy ends its lunge (mode='idle', speed=0).",
    "Dummy standing still in the lane: the car must swerve and pass with centre-to-centre separation >= width/2 + radius = 30 px. In the worst case, a dummy at (480,270), the car passes at y=210 (separation 60), so no contact occurs.",
    "Health check after damage: if health <= 0, run the destruction rule in dummy_rules."
  ],
  "cue_rules": [
    "Detection wedge: drawn only while the car exists, as a filled circular sector centred on the car centre, along its heading, with radius detectRange and half-angle detectHalfAngleDeg, in colours.wedge at alpha 0.22. It is always visible while the car is cruising, detected or committed, so the player can see where they will be seen.",
    "Route chevron: shown only when car.mode is 'detected' or 'committed' (car.route non-null). It is a '>' chevron drawn at the point car + route*commitDistance, pointing along route. Updating (detected): colours.chevronUpdating, thin 3 px outline, and it visibly moves/rotates each frame as the route is recomputed. Locked (committed): colours.chevronLocked, solid fill, 6 px, and it does not move at all relative to the locked route direction. It disappears when the car goes back to cruising or despawns.",
    "Commit ring: a circle of radius commitDistance (150) centred on the car centre, in colours.commitRing at alpha 0.5, 2 px line. Drawn while the car is cruising or detected (it shows where lock will happen). In committed mode it is hidden or drawn filled at 0.15 alpha (builder's choice, but it must differ from the pre-commit look).",
    "Brake lights: two small rectangles at the rear corners of the car. colours.brakeLightsOn (#ff1744) whenever car.braking is true, otherwise colours.brakeLightsOff. They are driven only by car.braking, which is true exactly on steps where speed decreased due to braking. Every detected encounter shows them lit, because the car brakes from cruiseSpeed to minSpeed over about 0.83 s.",
    "Dummy: filled circle radius 10 in colours.dummy, with a short facing tick line (length 14). Lunging uses colours.dummyLunging, recovering uses colours.dummyRecovering, destroyed is drawn as a small colours.dummyDestroyed X or circle at the position it was destroyed, until the reset.",
    "Plain-text HUD labels: 'Health: N' (rounded) and 'Score: N' (rounded), plus 'Bodies destroyed: N'. One-line control prompt below or above the canvas. No other UI."
  ],
  "controls": {
    "move": "Arrow keys or WASD move in 8 directions; diagonals are normalised; hold to go from a walk to a run. Opposing keys cancel to 0 on that axis.",
    "lunge": "Space: lunge in the facing direction (rising-edge triggered; holding Space does not repeat the lunge).",
    "prompt_text": "Arrows/WASD to move (hold to run) - SPACE to lunge - lure the car, step away, then lunge into its locked path"
  },
  "acceptance_criteria": [
    {
      "id": "AC-01",
      "text": "sim.js loads in Node via require and in a browser as window.DummiesSim. It exports createSim, step and PARAMS, uses no DOM, timers or Math.random, and PARAMS deep-equals the params block of this specification.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-02",
      "text": "createSim({seed:1,traffic:false}) returns a JSON-serialisable state with params, time, score=0, bodiesDestroyed=0, dummy at (startX,startY) with facing a unit vector, mode 'idle', health=maxHealth, and car=null. After 20 s of stepping at dt=1/60 with traffic:false, car is still null.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-03",
      "text": "With traffic:true the first car appears at time respawnDelay with x=-length, y=270, heading 0, speed cruiseSpeed, mode 'cruising', braking=false, route=null. After it leaves (x - length/2 > 960) the next appears respawnDelay seconds later.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-04",
      "text": "Speed is identical in every direction: holding each of the 8 directions for 2 s from the same start (placed in open space) gives the same speed value (<=1e-6) and the same travelled distance (<=1e-6, with no wall clamping). The diagonal speed is not sqrt(2) times faster.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-05",
      "text": "Acceleration: on the first held step the speed is about walkSpeed (within one step of acceleration), after accelTime it equals runSpeed and never exceeds it. Releasing all keys sets speed 0 at once.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-06",
      "text": "Lunge distance is identical in every direction: a lunge in each of the 8 directions from an open-space start (no car) moves the dummy exactly lungeDistance (130 px, within 0.5 px) over lungeDuration (0.2 s), regardless of speed or holdTime.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-07",
      "text": "No midair steering: changing dx/dy during a lunge does not change the lunge displacement. Pressing lunge again mid-lunge has no effect, and the facing at the end equals the facing at the start.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-08",
      "text": "Recovery: after a lunge that misses, dummy.mode is 'recovering' for recoveryTime (0.7 s +/- 1 step). During that time the position does not change under any input and a new lunge cannot be started. It then returns to 'idle'.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-09",
      "text": "Holding lunge (without releasing) does not trigger a second lunge after recovery. Releasing and pressing again does.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-10",
      "text": "Detection: place the dummy inside the wedge (distance<=300, angle<=35 deg) ahead of a cruising car and step once. The car becomes 'detected', route is a non-null unit vector, and braking is true. A dummy outside the range or angle, or one behind the car, leaves the car 'cruising' with route null.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-11",
      "text": "Route updating: while 'detected', moving the dummy in or out of the corridor changes car.route between steps (the swerve side or targetY changes). The route is always a unit vector within 1e-6.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-12",
      "text": "Commitment: the car becomes 'committed' on the step when centre distance to the dummy <= commitDistance (150). From then on car.route stays exactly equal in x and y to its value at the commit step for all later steps, even when the dummy moves, until the car returns to 'cruising'.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-13",
      "text": "Speed after commitment: speed may still decrease to minSpeed while committed. It never falls below minSpeed (120) and never exceeds cruiseSpeed (220) in any mode.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-14",
      "text": "Brake lights: in every encounter in which the car becomes 'detected', braking is true on at least 30 steps (the car goes from cruiseSpeed to minSpeed at 120 px/s^2, about 50 steps). braking is false when the car holds cruiseSpeed or minSpeed with no change, and true if and only if speed decreased in that step.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-15",
      "text": "Steering rate: the change in car.heading between consecutive steps never exceeds maxSteerRateDeg*dt (100 deg/s) plus 1e-6 in rad.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-16",
      "text": "Standing dummy in lane: with the dummy fixed at (480,270) and a car spawned normally, the car passes with no contact episode (no health loss, no score change) and the minimum centre-to-centre separation is >= 30 px. The same holds for dummies fixed at y=240, 270 and 300 at x=480.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-17",
      "text": "Rear contact gives no damage and no score: place the car so that the dummy overlaps its rear (local x < -20) and step. Health and score are unchanged, contactActive becomes true, and the dummy is pushed out of the car.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-18",
      "text": "Front or side contact applies exactly (20 + 0.16*car.speed), times 1.5 if the dummy is lunging. Score increases by the same amount (capped at remaining health). Verified at car.speed 220 non-lunging (55.2) and lunging (82.8).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-19",
      "text": "One impact per contact episode: while the dummy overlaps the car for many consecutive steps, health drops only once. After separation (no overlap for a step) a new overlap applies a new impact.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-20",
      "text": "Balance: two non-lunging front hits with car.speed=cruiseSpeed destroy a fresh body (health 100 -> <=0), and one such hit does not. A single lunging hit at cruise (82.8) does not destroy a fresh body, and two do.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-21",
      "text": "Destruction and reset: when health reaches 0, mode is 'destroyed', bodiesDestroyed increases by 1, and the dummy neither moves nor collides. After reset.delay (1.5 s +/- 1 step) the dummy is at (startX,startY) with health=maxHealth, mode 'idle', facing (0,-1), speed 0. Score is kept.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-22",
      "text": "Bait scenario (scripted): a dummy in the lane triggers detection, then walks perpendicular out of the corridor before commit. The chevron changes to a straight route (targetY=270), the car commits, a lunge back into the lane (about 110 px) then produces a non-rear impact. This must be achievable with the shipped parameters.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-23",
      "text": "Determinism: two sims created with the same seed and fed the same input sequence give identical JSON state at every step. State survives JSON.stringify/parse with no loss, and step reads only from state, so overwriting state.dummy.x/y and car fields between steps works.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-24",
      "text": "The dummy never leaves [radius, width-radius] x [radius, height-radius], and the car's y never leaves [210,330] while it exists.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-25",
      "text": "index.html loads sim.js through a plain <script src='sim.js'>, uses one <canvas>, makes no network requests, works over file://, reads arrows+WASD+Space, and calls DummiesSim.step with a fixed dt of 1/60 (an accumulator is allowed).",
      "verify_by": "code_review"
    },
    {
      "id": "AC-26",
      "text": "Rendering follows the cue_rules: wedge, chevron (different colour and fill for updating and locked), commit ring, and brake lights lit exactly when car.braking is true, all using the specified hex colours. HUD shows plain labels for health and score and the one-line control prompt text.",
      "verify_by": "code_review"
    },
    {
      "id": "AC-27",
      "text": "Excluded systems are absent: no extra vehicle classes, moods, learning, quotas, service, endings, audio, art or decorative assets, and no language-model or network calls. The view is a pure top-down greybox.",
      "verify_by": "code_review"
    },
    {
      "id": "AC-28",
      "text": "Playtest: a first-time player understands the controls without help, can swerve-bait the car and land a lunge hit within a few attempts, and sees brake lights and the chevron lock in each encounter.",
      "verify_by": "playtest"
    }
  ],
  "simplifications_vs_gdd": [
    "SIMPLIFICATION: damage is a greybox formula, base + perSpeed*car speed, times a lunge multiplier. It ignores the impact angle, body part and relative velocity. Score equals health lost.",
    "SIMPLIFICATION: a single sedan with one lane and a straight left-to-right route. There is no fleet, no other vehicle class and no learning, so the car never adapts to the player.",
    "SIMPLIFICATION: the car sees only the dummy. It uses a pure wedge-and-range test with no occlusion, no memory, and a sticky detected state until it passes or commits.",
    "SIMPLIFICATION: the 'locked route' is a single heading target computed at commitment. After the car reaches the locked target y it straightens to heading 0 as part of the same plan, while the chevron stays locked. The car cannot re-aim at the dummy after commitment.",
    "SIMPLIFICATION: the commit ring is a circle around the car centre. The car only commits if the dummy is within commitDistance at some time while it is detected, so a dummy far off the lane may see the chevron but never lock it.",
    "SIMPLIFICATION: the car does not brake to a stop or change its speed in response to an impact. Hits give it no mass or knockback, and the dummy is only pushed out of the car body.",
    "SIMPLIFICATION: the dummy has a single health value and no body parts or injuries. A fresh body spawns at a fixed point after a fixed delay, with no shifts, quotas, certification or endings.",
    "SIMPLIFICATION: recovery delay applies only to lunges that miss. A lunge that hits ends immediately, with the dummy back in idle.",
    "SIMPLIFICATION: car-dummy collision is a circle against an oriented rectangle. Rear contact means the dummy centre is in the rear quarter of the car's length (local x < -length/4).",
    "SIMPLIFICATION: there is no audio, narrative, mood, art, facades or perspective. All visuals are flat greybox shapes with a plain-label HUD."
  ]
}

# AUTOMATED CHECK RESULTS (executed by the orchestrator, not by the Builder)
{
  "total": 18,
  "passed": 18,
  "failed": 0,
  "all_passed": true,
  "results": [
    {
      "id": "load_sim",
      "description": "sim.js loads in Node and exports createSim, step, PARAMS",
      "pass": true,
      "detail": ""
    },
    {
      "id": "params_match_spec",
      "description": "Builder's PARAMS equal the Designer's spec params (Designer output reached the Builder)",
      "pass": true,
      "detail": "29 parameters identical"
    },
    {
      "id": "state_shape",
      "description": "createSim returns the contract state shape and is JSON-serialisable",
      "pass": true,
      "detail": ""
    },
    {
      "id": "move_speed_equal_8_directions",
      "description": "Distance covered in 1 s is equal in all eight directions (within 1%) and travels the way the input points",
      "pass": true,
      "detail": "distances px: 160.83, 160.83, 160.83, 160.83, 160.83, 160.83, 160.83, 160.83"
    },
    {
      "id": "run_speed_matches_spec",
      "description": "After accelerating, speed equals spec runSpeed in cardinal and diagonal directions (within 2%)",
      "pass": true,
      "detail": "measured px/s: 190.00, 190.00"
    },
    {
      "id": "lunge_distance_equal_8_directions",
      "description": "Lunge distance is equal in all eight directions (within 1%) and equals spec lungeDistance (within 2%)",
      "pass": true,
      "detail": "distances px: 130.00, 130.00, 130.00, 130.00, 130.00, 130.00, 130.00, 130.00"
    },
    {
      "id": "no_midair_steering",
      "description": "Direction input during a lunge does not change its path",
      "pass": true,
      "detail": "sideways drift 0.000 px"
    },
    {
      "id": "miss_recovery_delay",
      "description": "A missed lunge is followed by a recovery period with no movement, then control returns",
      "pass": true,
      "detail": "recovery 0.700 s"
    },
    {
      "id": "deterministic",
      "description": "Same seed and same inputs give an identical state after 30 s",
      "pass": true,
      "detail": ""
    },
    {
      "id": "traffic_cruises_and_respawns",
      "description": "An undetected sedan cruises left to right with no route chevron, leaves, and another appears",
      "pass": true,
      "detail": ""
    },
    {
      "id": "detect_commit_brake_and_avoid",
      "description": "A dummy standing in the lane is detected (chevron appears), the route locks at commitment, brake lights show while slowing, and the sedan swerves past without contact",
      "pass": true,
      "detail": "detected, committed, braked, passed clear"
    },
    {
      "id": "route_locked_against_bait",
      "description": "After commitment, moving the dummy does not change the locked route (the bait works)",
      "pass": true,
      "detail": ""
    },
    {
      "id": "front_impact_damage_once",
      "description": "A front impact reduces health and adds score exactly once per contact episode",
      "pass": true,
      "detail": "health 100 -> 45.12, score 0 -> 54.88"
    },
    {
      "id": "single_impact_per_episode",
      "description": "Staying in contact does not apply damage every frame",
      "pass": true,
      "detail": ""
    },
    {
      "id": "rear_contact_no_damage",
      "description": "Contact with the rear of the car gives no damage and no score",
      "pass": true,
      "detail": ""
    },
    {
      "id": "destruction_and_fresh_body",
      "description": "Repeated front impacts destroy the body once, then a fresh body with full health appears",
      "pass": true,
      "detail": "destroyed after 2 cruise-speed front impacts (GDD provisional target: 2)"
    },
    {
      "id": "sim_is_pure",
      "description": "sim.js uses no Math.random, timers, clock or DOM",
      "pass": true,
      "detail": ""
    },
    {
      "id": "html_static",
      "description": "index.html has a canvas, loads sim.js, handles the keyboard and makes no network requests",
      "pass": true,
      "detail": "1 inline script(s) parse without syntax errors"
    }
  ]
}

# BUILDER NOTES
Built sim.js (dummy movement/lunge/recovery, car detection/route/commit/steering/braking, circle-vs-OBB collision with one impact per episode, destruction/reset) and index.html (canvas renderer, fixed 1/60 accumulator, WASD/arrows/Space input). I have not run any of the automated checks or opened the game in a browser. Spec notes: (1) The lunge ignores world clamping per the spec, but I clamp the dummy to world bounds once the lunge ends, so AC-24 holds. This only changes the result when a lunge ends outside the world. (2) The route rule sends a car to targetY = dummy.y - 60 when the dummy is at y >= 270. For a dummy at y=300 that is 240, which passes only 60 px from the dummy centre, so the car stays clear of it. Otherwise the steering and route rules were implemented as written. (3) Extra fields on the car (targetY, lockedRoute, lockedTargetY) and on the state (spawnTimer, prevLunge, contactActive, traffic, seed) are all JSON-serialisable.
=== END NOTES ===

# FILE sim.js
(function (root) {
  "use strict";

  var PARAMS = {
    world: { width: 960, height: 540 },
    road: { y: 270, halfWidth: 80 },
    dummy: {
      radius: 10, walkSpeed: 90, runSpeed: 190, accelTime: 0.6,
      lungeDistance: 130, lungeDuration: 0.2, recoveryTime: 0.7,
      maxHealth: 100, startX: 480, startY: 430
    },
    car: {
      length: 80, width: 40, cruiseSpeed: 220, minSpeed: 120,
      detectRange: 300, detectHalfAngleDeg: 35, commitDistance: 150,
      swerveClearance: 30, maxSteerRateDeg: 100, brakeDecel: 120,
      respawnDelay: 1.5
    },
    damage: { base: 20, perSpeed: 0.16, lungeMultiplier: 1.5 },
    reset: { delay: 1.5 }
  };

  var DEG = Math.PI / 180;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function wrapAngle(a) {
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  }

  function createSim(options) {
    options = options || {};
    var traffic = options.traffic === undefined ? true : !!options.traffic;
    var p = JSON.parse(JSON.stringify(PARAMS));
    return {
      params: p,
      seed: options.seed === undefined ? 1 : options.seed,
      rng: (options.seed === undefined ? 1 : options.seed) >>> 0,
      traffic: traffic,
      time: 0,
      score: 0,
      bodiesDestroyed: 0,
      contactActive: false,
      prevLunge: false,
      spawnTimer: 0,
      dummy: {
        x: p.dummy.startX, y: p.dummy.startY,
        facing: { x: 0, y: -1 },
        speed: 0, mode: "idle", health: p.dummy.maxHealth,
        holdTime: 0, lungeTimer: 0, lungeTravelled: 0,
        recoveryTimer: 0, resetTimer: 0
      },
      car: null
    };
  }

  function clampDummyToWorld(s) {
    var p = s.params, d = s.dummy, r = p.dummy.radius;
    d.x = clamp(d.x, r, p.world.width - r);
    d.y = clamp(d.y, r, p.world.height - r);
  }

  function updateDummy(s, input, dt) {
    var p = s.params, d = s.dummy, dp = p.dummy;
    if (d.holdTime === undefined) d.holdTime = 0;

    if (d.mode === "destroyed") {
      d.resetTimer -= dt;
      if (d.resetTimer <= 1e-9) {
        d.x = dp.startX; d.y = dp.startY;
        d.facing = { x: 0, y: -1 };
        d.speed = 0; d.health = dp.maxHealth; d.mode = "idle";
        d.holdTime = 0;
      }
      return;
    }

    if (d.mode === "recovering") {
      d.speed = 0;
      d.recoveryTimer -= dt;
      if (d.recoveryTimer <= 1e-9) {
        d.mode = "idle";
        d.holdTime = 0;
      }
      return;
    }

    if (d.mode === "idle") {
      var rising = !!input.lunge && !s.prevLunge;
      if (rising) {
        d.mode = "lunging";
        d.lungeTimer = 0;
        d.lungeTravelled = 0;
        d.speed = dp.lungeDistance / dp.lungeDuration;
        d.holdTime = 0;
      } else {
        var dx = input.dx || 0, dy = input.dy || 0;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) {
          d.speed = 0;
          d.holdTime = 0;
        } else {
          dx /= len; dy /= len;
          d.holdTime += dt;
          d.speed = dp.walkSpeed + (dp.runSpeed - dp.walkSpeed) * Math.min(1, d.holdTime / dp.accelTime);
          d.x += dx * d.speed * dt;
          d.y += dy * d.speed * dt;
          d.facing = { x: dx, y: dy };
          clampDummyToWorld(s);
        }
        return;
      }
    }

    if (d.mode === "lunging") {
      var v = dp.lungeDistance / dp.lungeDuration;
      var remaining = dp.lungeDistance - d.lungeTravelled;
      var stepLen = Math.min(v * dt, remaining);
      d.x += d.facing.x * stepLen;
      d.y += d.facing.y * stepLen;
      d.lungeTravelled += stepLen;
      d.lungeTimer += dt;
      d.speed = v;
      if (dp.lungeDistance - d.lungeTravelled <= 1e-6 || d.lungeTimer >= dp.lungeDuration + 1e-9) {
        // clip any leftover so total is exact
        var left = dp.lungeDistance - d.lungeTravelled;
        if (left > 0) {
          d.x += d.facing.x * left;
          d.y += d.facing.y * left;
          d.lungeTravelled = dp.lungeDistance;
        }
        clampDummyToWorld(s);
        d.mode = "recovering";
        d.speed = 0;
        d.recoveryTimer = dp.recoveryTime;
      }
    }
  }

  function detects(s, c) {
    var d = s.dummy, cp = s.params.car;
    if (d.mode === "destroyed") return false;
    var dx = d.x - c.x, dy = d.y - c.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > cp.detectRange) return false;
    var ch = Math.cos(c.heading), sh = Math.sin(c.heading);
    var lx = dx * ch + dy * sh;
    var ly = -dx * sh + dy * ch;
    if (lx <= 0) return false;
    return Math.atan2(Math.abs(ly), lx) <= cp.detectHalfAngleDeg * DEG;
  }

  function computeRoute(s, c) {
    var p = s.params, cp = p.car, d = s.dummy;
    var corridor = cp.width / 2 + p.dummy.radius + cp.swerveClearance;
    var targetY = p.road.y;
    if (d.x > c.x - cp.length / 2 && Math.abs(d.y - p.road.y) < corridor) {
      targetY = d.y >= p.road.y ? d.y - corridor : d.y + corridor;
    }
    var lim = p.road.halfWidth - cp.width / 2;
    targetY = clamp(targetY, p.road.y - lim, p.road.y + lim);
    var vx = cp.commitDistance, vy = targetY - c.y;
    var l = Math.sqrt(vx * vx + vy * vy);
    return { route: { x: vx / l, y: vy / l }, targetY: targetY };
  }

  function updateCar(s, dt) {
    var p = s.params, cp = p.car, d = s.dummy;
    var lim = p.road.halfWidth - cp.width / 2;
    var minY = p.road.y - lim, maxY = p.road.y + lim;
    var c = s.car;

    if (!c) {
      if (!s.traffic) return;
      s.spawnTimer += dt;
      if (s.spawnTimer >= cp.respawnDelay - 1e-9) {
        s.car = {
          x: -cp.length, y: p.road.y, heading: 0, speed: cp.cruiseSpeed,
          mode: "cruising", braking: false, route: null
        };
        s.spawnTimer = 0;
      }
      return;
    }

    // pass reset
    if (c.mode === "detected" || c.mode === "committed") {
      if (d.mode === "destroyed" || (c.x - d.x) > cp.length) {
        c.mode = "cruising";
        c.route = null;
        c.lockedRoute = null;
        c.lockedTargetY = null;
      }
    }
    // detection
    if (c.mode === "cruising" && detects(s, c)) {
      c.mode = "detected";
    }
    // route
    if (c.mode === "detected") {
      var r = computeRoute(s, c);
      c.route = r.route;
      c.targetY = r.targetY;
      var ddx = d.x - c.x, ddy = d.y - c.y;
      if (Math.sqrt(ddx * ddx + ddy * ddy) <= cp.commitDistance) {
        c.lockedRoute = { x: r.route.x, y: r.route.y };
        c.lockedTargetY = r.targetY;
        c.mode = "committed";
      }
    }

    // steering
    var targetAngle;
    if (c.mode === "detected") {
      targetAngle = Math.atan2(c.route.y, c.route.x);
    } else if (c.mode === "committed") {
      if (!c.lockedRoute) c.lockedRoute = { x: c.route.x, y: c.route.y };
      if (c.lockedTargetY === undefined || c.lockedTargetY === null) c.lockedTargetY = c.y;
      if (Math.abs(c.y - c.lockedTargetY) <= 1.5) targetAngle = 0;
      else targetAngle = Math.atan2(c.lockedRoute.y, c.lockedRoute.x);
    } else {
      var ty = clamp(p.road.y, minY, maxY);
      targetAngle = Math.atan2(ty - c.y, cp.commitDistance);
    }
    var diff = wrapAngle(targetAngle - c.heading);
    var maxd = cp.maxSteerRateDeg * DEG * dt;
    c.heading += clamp(diff, -maxd, maxd);

    // speed
    var prev = c.speed;
    if (c.mode === "cruising") {
      c.speed = Math.min(cp.cruiseSpeed, c.speed + cp.brakeDecel * dt);
      if (c.speed < prev) c.speed = prev;
    } else if (c.speed > cp.minSpeed) {
      c.speed = Math.max(cp.minSpeed, c.speed - cp.brakeDecel * dt);
    }
    c.braking = c.speed < prev;

    // move
    c.x += Math.cos(c.heading) * c.speed * dt;
    c.y += Math.sin(c.heading) * c.speed * dt;
    c.y = clamp(c.y, minY, maxY);

    if (c.x - cp.length / 2 > p.world.width) {
      s.car = null;
      s.spawnTimer = 0;
    }
  }

  function collide(s) {
    var c = s.car, d = s.dummy, p = s.params;
    if (!c || d.mode === "destroyed") {
      s.contactActive = false;
      return;
    }
    var L = p.car.length, W = p.car.width, r = p.dummy.radius;
    var ch = Math.cos(c.heading), sh = Math.sin(c.heading);
    var dx = d.x - c.x, dy = d.y - c.y;
    var lx = dx * ch + dy * sh;
    var ly = -dx * sh + dy * ch;
    var cx = clamp(lx, -L / 2, L / 2);
    var cy = clamp(ly, -W / 2, W / 2);
    var ex = lx - cx, ey = ly - cy;
    var d2 = ex * ex + ey * ey;
    var overlap = d2 < r * r;
    if (!overlap) {
      s.contactActive = false;
      return;
    }
    if (s.contactActive) return;
    s.contactActive = true;

    var rear = lx < -L / 4;
    var wasLunging = d.mode === "lunging";

    // push out
    var nlx, nly, eps = 0.01;
    if (d2 > 1e-12) {
      var dist = Math.sqrt(d2);
      nlx = cx + ex / dist * (r + eps);
      nly = cy + ey / dist * (r + eps);
    } else {
      var pxr = L / 2 - Math.abs(lx), pyr = W / 2 - Math.abs(ly);
      nlx = lx; nly = ly;
      if (pxr < pyr) nlx = (lx >= 0 ? 1 : -1) * (L / 2 + r + eps);
      else nly = (ly >= 0 ? 1 : -1) * (W / 2 + r + eps);
    }
    d.x = c.x + nlx * ch - nly * sh;
    d.y = c.y + nlx * sh + nly * ch;
    clampDummyToWorld(s);

    if (wasLunging) {
      d.mode = "idle";
      d.speed = 0;
      d.holdTime = 0;
    }

    if (!rear) {
      var dmg = p.damage.base + p.damage.perSpeed * c.speed;
      if (wasLunging) dmg *= p.damage.lungeMultiplier;
      var loss = Math.min(d.health, dmg);
      d.health -= loss;
      s.score += loss;
      if (d.health <= 0) {
        d.health = 0;
        d.mode = "destroyed";
        s.bodiesDestroyed += 1;
        d.speed = 0;
        d.resetTimer = p.reset.delay;
      }
    }
  }

  function step(state, input, dt) {
    input = input || { dx: 0, dy: 0, lunge: false };
    state.time += dt;
    updateDummy(state, input, dt);
    updateCar(state, dt);
    collide(state);
    state.prevLunge = !!input.lunge;
    return state;
  }

  var api = { createSim: createSim, step: step, PARAMS: PARAMS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DummiesSim = api;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));


# FILE index.html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>DUMMIES</title>
<style>
  html, body { margin: 0; height: 100%; background: #1c1e21; overflow: hidden; }
  canvas { display: block; position: absolute; left: 0; top: 0; }
</style>
</head>
<body>
<canvas id="c" width="960" height="540"></canvas>
<script src="sim.js"></script>
<script>
(function () {
  var C = {
    background: "#1c1e21", road: "#3a3d42", roadEdge: "#8a8d92",
    dummy: "#f2c94c", dummyLunging: "#ffe58a", dummyRecovering: "#9a7d1f", dummyDestroyed: "#6b2a2a",
    car: "#d9534f", wedge: "#fff7a8", wedgeAlpha: 0.22,
    chevronUpdating: "#4fc3f7", chevronLocked: "#ff8a00",
    commitRing: "#ffffff", commitRingAlpha: 0.5,
    brakeLightsOn: "#ff1744", brakeLightsOff: "#5a1a1a", labelText: "#e6e6e6"
  };
  var PROMPT = "Arrows/WASD to move (hold to run) - SPACE to lunge - lure the car, step away, then lunge into its locked path";
  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");
  var P = DummiesSim.PARAMS;
  var state = DummiesSim.createSim({ seed: 1, traffic: true });

  function resize() {
    var s = Math.min(window.innerWidth / 960, window.innerHeight / 540);
    canvas.style.width = (960 * s) + "px";
    canvas.style.height = (540 * s) + "px";
    canvas.style.left = ((window.innerWidth - 960 * s) / 2) + "px";
    canvas.style.top = ((window.innerHeight - 540 * s) / 2) + "px";
  }
  window.addEventListener("resize", resize);
  resize();

  var keys = {};
  var GAME = {
    ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1,
    KeyW: 1, KeyA: 1, KeyS: 1, KeyD: 1, Space: 1
  };
  window.addEventListener("keydown", function (e) {
    if (GAME[e.code]) { e.preventDefault(); keys[e.code] = true; }
  });
  window.addEventListener("keyup", function (e) {
    if (GAME[e.code]) { e.preventDefault(); keys[e.code] = false; }
  });
  window.addEventListener("blur", function () { keys = {}; });

  function readInput() {
    var dx = 0, dy = 0;
    if (keys.ArrowLeft || keys.KeyA) dx -= 1;
    if (keys.ArrowRight || keys.KeyD) dx += 1;
    if (keys.ArrowUp || keys.KeyW) dy -= 1;
    if (keys.ArrowDown || keys.KeyS) dy += 1;
    return { dx: dx, dy: dy, lunge: !!keys.Space };
  }

  function chevronPath(size) {
    ctx.beginPath();
    ctx.moveTo(-size * 0.6, -size);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(-size * 0.6, size);
  }

  function draw() {
    var s = state, car = s.car, d = s.dummy;
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.background;
    ctx.fillRect(0, 0, 960, 540);

    var ry = P.road.y, hw = P.road.halfWidth;
    ctx.fillStyle = C.road;
    ctx.fillRect(0, ry - hw, 960, hw * 2);
    ctx.fillStyle = C.roadEdge;
    ctx.fillRect(0, ry - hw - 2, 960, 2);
    ctx.fillRect(0, ry + hw, 960, 2);

    if (car) {
      // wedge
      var half = P.car.detectHalfAngleDeg * Math.PI / 180;
      ctx.globalAlpha = C.wedgeAlpha;
      ctx.fillStyle = C.wedge;
      ctx.beginPath();
      ctx.moveTo(car.x, car.y);
      ctx.arc(car.x, car.y, P.car.detectRange, car.heading - half, car.heading + half);
      ctx.closePath();
      ctx.fill();

      // commit ring
      if (car.mode === "committed") {
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = C.commitRing;
        ctx.beginPath();
        ctx.arc(car.x, car.y, P.car.commitDistance, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalAlpha = C.commitRingAlpha;
        ctx.strokeStyle = C.commitRing;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(car.x, car.y, P.car.commitDistance, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // car body
      var L = P.car.length, W = P.car.width;
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.heading);
      ctx.fillStyle = C.car;
      ctx.fillRect(-L / 2, -W / 2, L, W);
      ctx.fillStyle = car.braking ? C.brakeLightsOn : C.brakeLightsOff;
      ctx.fillRect(-L / 2, -W / 2 + 2, 5, 8);
      ctx.fillRect(-L / 2, W / 2 - 10, 5, 8);
      ctx.restore();

      // chevron
      if ((car.mode === "detected" || car.mode === "committed") && car.route) {
        var rt = car.route;
        ctx.save();
        ctx.translate(car.x + rt.x * P.car.commitDistance, car.y + rt.y * P.car.commitDistance);
        ctx.rotate(Math.atan2(rt.y, rt.x));
        if (car.mode === "committed") {
          ctx.fillStyle = C.chevronLocked;
          ctx.strokeStyle = C.chevronLocked;
          ctx.lineWidth = 6;
          ctx.lineJoin = "round";
          chevronPath(16);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.strokeStyle = C.chevronUpdating;
          ctx.lineWidth = 3;
          chevronPath(16);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // dummy
    var r = P.dummy.radius;
    if (d.mode === "destroyed") {
      ctx.strokeStyle = C.dummyDestroyed;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(d.x - r, d.y - r); ctx.lineTo(d.x + r, d.y + r);
      ctx.moveTo(d.x + r, d.y - r); ctx.lineTo(d.x - r, d.y + r);
      ctx.stroke();
    } else {
      ctx.fillStyle = d.mode === "lunging" ? C.dummyLunging :
        (d.mode === "recovering" ? C.dummyRecovering : C.dummy);
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.facing.x * 14, d.y + d.facing.y * 14);
      ctx.stroke();
    }

    // HUD
    ctx.fillStyle = C.labelText;
    ctx.font = "16px monospace";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText("Health: " + Math.round(d.health), 12, 10);
    ctx.fillText("Score: " + Math.round(s.score), 160, 10);
    ctx.fillText("Bodies destroyed: " + s.bodiesDestroyed, 300, 10);
    ctx.font = "13px monospace";
    ctx.textBaseline = "bottom";
    ctx.fillText(PROMPT, 12, 530);
  }

  var DT = 1 / 60, acc = 0, last = null;
  function frame(t) {
    if (last === null) last = t;
    var f = (t - last) / 1000;
    last = t;
    if (f > 0.25) f = 0.25;
    acc += f;
    while (acc >= DT) {
      DummiesSim.step(state, readInput(), DT);
      acc -= DT;
    }
    draw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
</script>
</body>
</html>
