const test = require('node:test');
const assert = require('node:assert/strict');

test('manifest injects the detector into every matching WOOCLAP frame', () => {
  const manifest = require('../manifest.json');

  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.content_scripts[0].matches, ['https://app.wooclap.com/*']);
  assert.equal(manifest.content_scripts[0].all_frames, true);
  assert.deepEqual(manifest.permissions, ['notifications', 'storage', 'tabs']);
});

test('manifest exposes the monitoring controls in an action popup', () => {
  delete require.cache[require.resolve('../manifest.json')];
  const manifest = require('../manifest.json');

  assert.equal(manifest.action.default_popup, 'src/popup.html');
});

test('manifest uses the product name NTULearn WOOCLAP Notifier', () => {
  delete require.cache[require.resolve('../manifest.json')];
  const manifest = require('../manifest.json');

  assert.equal(manifest.name, 'NTULearn WOOCLAP Notifier');
});
