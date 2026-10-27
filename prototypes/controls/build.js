#!/usr/bin/env node
// DUMMIES controls prototype (GDD Edits 73–74). Bundles the registry values, core.js, pads.js and app.js with Phaser 3.90.0 into
//   dummies_controls.html  — one self-contained file (Phaser inlined; opens offline, no server);
//   controls_page.html     — the same page as a fragment for the hosted page (Phaser from jsDelivr), for phones.
// Every number the prototype uses is a registry ID read here from content/params/tuning.parameters.json.
'use strict';
const fs = require('fs'), path = require('path');
const here = __dirname, root = path.resolve(here, '..', '..');
const reg = JSON.parse(fs.readFileSync(path.join(root, 'content', 'params', 'tuning.parameters.json'), 'utf8'));
const IDS = [
  'movement.walkSpeed', 'movement.runSpeed', 'movement.rampSeconds', 'movement.turnRate', 'movement.turningSpeedFraction', 'movement.alignThreshold',
  'movement.stopSeconds', 'movement.counterPressAngle', 'movement.counterPressStop', 'movement.lungeDistance', 'movement.lungeDuration',
  'movement.lungeRecovery', 'movement.lungeFastTimeFraction', 'movement.lungeFastDistanceFraction', 'movement.directTurnRate', 'movement.pivotAngle',
  'movement.pivotRate', 'proto.turnModel', 'body.radius', 'props.cone.radius', 'props.cone.pickupEdgeRange', 'upgrades.carrySpeed', 'world.laneWidth',
  'vehicles.scale', 'vehicles.sedan.length', 'vehicles.sedan.width', 'vehicles.sedan.cruiseSpeed', 'vehicles.van.length', 'vehicles.van.width',
  'vehicles.van.cruiseSpeed', 'proto.input.deadzone', 'proto.input.stickOuter', 'proto.input.aimDeadzone', 'proto.input.mouseAimSeconds',
  'proto.input.touchDeadzone', 'proto.input.touchOuter', 'proto.input.touchFloat', 'proto.input.padSetupHoldSeconds',
  'ui.touch.stickRadius', 'ui.touch.lungeRadius', 'ui.touch.grabRadius', 'ui.touch.margin', 'ui.touch.viewHeight',
];
const RETIRED = (e) => /^retired/.test(e.status || '');
const byId = new Map(reg.entries.map((e) => [e.id, e.default]));
const retired = new Set(reg.entries.filter(RETIRED).map((e) => e.id));
const missing = IDS.filter((id) => !byId.has(id) || retired.has(id));
if (missing.length) { console.error('not in the registry, or retired: ' + missing.join(', ')); process.exit(1); }
const P = Object.fromEntries(IDS.map((id) => [id, byId.get(id)]));
const params = `window.CTRL_P = ${JSON.stringify(P)}; window.CTRL_BUILD = ${JSON.stringify(reg.registryVersion.split('-')[0])}; // registry ${reg.registryVersion}`;
const core = fs.readFileSync(path.join(here, 'core.js'), 'utf8'), pads = fs.readFileSync(path.join(here, 'pads.js'), 'utf8'), app = fs.readFileSync(path.join(here, 'app.js'), 'utf8');
const phaser = fs.readFileSync(path.join(here, 'vendor', 'phaser-3.90.0.min.js'), 'utf8');

const TITLE = 'Dummies Control Test';
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Silkscreen&display=swap">';
const CSS = `<style>
/* One look: the FARSIGHT night yard. The canvas fills the screen; the HUD and touch controls live inside it. */
:root { --bg: #0b1016; --fg: #dfe7ec; color-scheme: dark; }
html, body { height: 100%; margin: 0; background: var(--bg); color: var(--fg); overflow: hidden; overscroll-behavior: none;
  touch-action: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }
#game { position: relative; width: 100%; height: 100%; }
#game canvas { display: block; touch-action: none; outline: none; }
</style>`;
const BODY = '<div id="game" aria-label="DUMMIES control test. Keyboard, mouse, gamepad or touch (landscape)."></div>';
const scripts = (lib) => `${lib}\n<script>\n${params}\n${core}\n${pads}\n${app}\n</script>`;

const full = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="screen-orientation" content="landscape"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">
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
fs.writeFileSync(path.join(here, 'dummies_controls.html'), full);
fs.writeFileSync(path.join(here, 'controls_page.html'), page);
console.log('dummies_controls.html', full.length, 'bytes · controls_page.html', page.length, 'bytes · registry', reg.registryVersion);
