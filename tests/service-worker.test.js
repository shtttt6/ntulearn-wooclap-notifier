const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const zlib = require('node:zlib');

function loadWorker({ permissionLevel = 'granted', notificationError } = {}) {
  const listeners = {};
  const stored = {};
  const notifications = [];
  const chrome = {
    runtime: {
      lastError: undefined,
      onInstalled: { addListener(listener) { listeners.installed = listener; } },
      onMessage: { addListener(listener) { listeners.message = listener; } },
    },
    storage: {
      local: {
        get(defaults, callback) { callback({ ...defaults, ...stored }); },
        set(values, callback) { Object.assign(stored, values); callback?.(); },
      },
    },
    notifications: {
      create(id, options, callback) {
        notifications.push({ id, options });
        chrome.runtime.lastError = notificationError ? { message: notificationError } : undefined;
        callback();
        chrome.runtime.lastError = undefined;
      },
      getPermissionLevel(callback) { callback(permissionLevel); },
      onClicked: { addListener(listener) { listeners.notificationClick = listener; } },
    },
    tabs: { update() {} },
    windows: { update() {} },
  };
  const source = fs.readFileSync(path.join(__dirname, '../src/service-worker.js'), 'utf8');
  vm.runInNewContext(source, { chrome, Map, Number, Date, String, Boolean });
  return { listeners, stored, notifications };
}

test('returns a visible diagnostic when a test notification cannot be created', () => {
  const worker = loadWorker({ notificationError: 'Notifications are disabled' });
  let response;

  const keepsChannelOpen = worker.listeners.message(
    { type: 'test-notification' },
    {},
    (value) => { response = value; },
  );

  assert.equal(keepsChannelOpen, true);
  assert.equal(response.ok, false);
  assert.equal(response.message, 'Notifications are disabled');
  assert.equal(worker.stored.notificationDiagnostic.state, 'failed');
});

test('records a successful test-notification diagnostic', () => {
  const worker = loadWorker();
  let response;

  worker.listeners.message({ type: 'test-notification' }, {}, (value) => { response = value; });

  assert.equal(response.ok, true);
  assert.equal(worker.notifications.length, 1);
  assert.equal(worker.stored.notificationDiagnostic.state, 'sent');
});

test('uses a decodable local PNG as the required notification icon', () => {
  const worker = loadWorker();
  worker.listeners.message({ type: 'test-notification' }, {}, () => {});
  const iconUrl = worker.notifications[0].options.iconUrl;
  const image = Buffer.from(iconUrl.replace('data:image/png;base64,', ''), 'base64');
  let cursor = 8;
  const idatChunks = [];

  while (cursor < image.length) {
    const size = image.readUInt32BE(cursor);
    const type = image.subarray(cursor + 4, cursor + 8).toString('ascii');
    if (type === 'IDAT') idatChunks.push(image.subarray(cursor + 8, cursor + 8 + size));
    cursor += size + 12;
  }

  assert.doesNotThrow(() => zlib.inflateSync(Buffer.concat(idatChunks)));
});
