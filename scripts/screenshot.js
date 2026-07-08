// Run: node scripts/screenshot.js
// Requires: npx (ships with Node) — no local install needed
const { execSync } = require('child_process');
const path = require('path');

const url = 'https://contentflowdigital321-cell.github.io/healthcare/';
const out = path.join(__dirname, '..', 'screenshot.png');

execSync(
  `npx playwright screenshot --browser chromium --viewport-size "1280,800" "${url}" "${out}"`,
  { stdio: 'inherit' }
);
