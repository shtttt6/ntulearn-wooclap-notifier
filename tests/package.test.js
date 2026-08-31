const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const assert = require('node:assert/strict');

test('package includes the blue-white icon asset', () => {
  const rootDir = path.resolve(__dirname, '..');
  const manifest = require('../manifest.json');
  const packagePath = path.join(
    rootDir,
    'dist',
    `ntulearn-wooclap-notifier-v${manifest.version}.zip`,
  );

  execFileSync(process.execPath, ['scripts/package.js'], { cwd: rootDir });
  assert.equal(fs.existsSync(packagePath), true);

  const contents = execFileSync('tar', ['-tf', packagePath], { cwd: rootDir, encoding: 'utf8' });
  assert.match(contents, /assets\/ntulearn-wooclap-notifier-icon-blue-white\.png/);
});
