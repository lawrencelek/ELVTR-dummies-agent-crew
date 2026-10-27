#!/usr/bin/env node
// DUMMIES jump test (GDD Edit 76). Bundles the registry values, jump.js, ../controls/core.js, ../controls/pads.js and app.js
// with Phaser 3.90.0 into
//   dummies_jump.html — one self-contained file (Phaser inlined; opens offline, no server; gamepads work here);
//   jump_page.html    — the same page as a fragment for a hosted page (Phaser from jsDelivr), for phones.
// Every number the yard uses is a registry ID read here from content/params/tuning.parameters.json.
'use strict';
const fs = require('fs'), path = require('path');
const here = __dirname, root = path.resolve(here, '..', '..'), ctrl = path.join(here, '..', 'controls');
const reg = JSON.parse(fs.readFileSync(path.join(root, 'content', 'params', 'tuning.parameters.json'), 'utf8'));
const IDS = [
  'movement.walkSpeed', 'movement.runSpeed', 'movement.rampSeconds', 'movement.turnRate', 'movement.turningSpeedFraction', 'movement.alignThreshold',
  'movement.stopSeconds', 'movement.counterPressAngle', 'movement.counterPressStop', 'movement.lungeDistance', 'movement.lungeDuration',
  'movement.lungeRecovery', 'movement.lungeFastTimeFraction', 'movement.lungeFastDistanceFraction', 'movement.directTurnRate', 'movement.pivotAngle',
  'movement.pivotRate', 'upgrades.carrySpeed', 'body.radius', 'world.laneWidth', 'world.jumpableHeight', 'world.jumpableDepth',
  'upgrades.jumpAirtime', 'proto.jump.runToClear', 'upgrades.jumpHeight', 'upgrades.jumpRecovery', 'upgrades.jumpMaxSpeed', 'upgrades.jumpAirAccel',
  'vehicles.scale', 'vehicles.sedan.length', 'vehicles.sedan.width', 'vehicles.sedan.height', 'vehicles.sedan.cruiseSpeed',
  'vehicles.van.length', 'vehicles.van.width', 'vehicles.van.height', 'vehicles.van.cruiseSpeed',
  'vehicles.bus.length', 'vehicles.bus.width', 'vehicles.bus.height', 'vehicles.bus.cruiseSpeed',
  'proto.input.deadzone', 'proto.input.stickOuter', 'proto.input.touchDeadzone', 'proto.input.touchOuter', 'proto.input.padSetupHoldSeconds',
  'ui.touch.stickRadius', 'ui.touch.faceRadius', 'ui.touch.margin',
];
const RETIRED = (e) => /^retired/.test(e.status || '');
const byId = new Map(reg.entries.map((e) => [e.id, e.default]));
const retired = new Set(reg.entries.filter(RETIRED).map((e) => e.id));
const missing = IDS.filter((id) => !byId.has(id) || retired.has(id));
if (missing.length) { console.error('not in the registry, or retired: ' + missing.join(', ')); process.exit(1); }
const P = Object.fromEntries(IDS.map((id) => [id, byId.get(id)]));
const BUILD = reg.registryVersion.split('-')[0];
const params = `window.JUMP_P = ${JSON.stringify(P)}; window.JUMP_BUILD = ${JSON.stringify(BUILD)}; // registry ${reg.registryVersion}`;
const read = (...p) => fs.readFileSync(path.join(...p), 'utf8');
const jump = read(here, 'jump.js'), core = read(ctrl, 'core.js'), pads = read(ctrl, 'pads.js'), app = read(here, 'app.js');
const phaser = read(ctrl, 'vendor', 'phaser-3.90.0.min.js');

const TITLE = 'Dummies Jump Test';
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Silkscreen&display=swap">';
const CSS = `<style>
/* The FARSIGHT night yard. The canvas fills the screen; the panel, the side view and the touch controls live inside it. */
:root { --bg: #0b1016; --fg: #dfe7ec; color-scheme: dark; }
html, body { height: 100%; margin: 0; background: var(--bg); color: var(--fg); overflow: hidden; overscroll-behavior: none;
  touch-action: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }
#game { position: relative; width: 100%; height: 100%; height: 100dvh; }
#game canvas { display: block; touch-action: none; outline: none; }
</style>`;
const BODY = '<div id="game" aria-label="DUMMIES jump test. Keyboard, gamepad, or touch on phones and tablets (landscape)."></div>';
const scripts = (lib) => `${lib}\n<script>\n${params}\n${jump}\n${core}\n${pads}\n${app}\n</script>`;

const full = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">
<title>${TITLE}</title>
${FONTS}
${CSS}
</head>
<body>
${BODY}
${scripts(`<script>\n${phaser}\n</script>`)}
</body>
</html>
`;
const page = `<title>${TITLE}</title>
${FONTS}
${CSS}
${BODY}
${scripts('<script src="https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js"></script>')}
`;
fs.writeFileSync(path.join(here, 'dummies_jump.html'), full);
fs.writeFileSync(path.join(here, 'jump_page.html'), page);
console.log('dummies_jump.html', full.length, 'bytes · jump_page.html', page.length, 'bytes · registry', reg.registryVersion);
