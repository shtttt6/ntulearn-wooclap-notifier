importScripts('ntfy-core.js');
importScripts('bark-core.js');

const NOTIFICATION_ICON_PATH = 'assets/notification-icon-128.png';
const NTFY_PUSH = { title: 'WOOCLAP 有新题目', message: '打开 WOOCLAP 页面查看并作答。' };
const NTFY_TEST_PUSH = { title: 'WOOCLAP 测试推送', message: 'ntfy 手机推送工作正常。' };
const BARK_PUSH = { title: 'WOOCLAP 有新题目', message: '打开 WOOCLAP 页面查看并作答。' };
const BARK_TEST_PUSH = { title: 'WOOCLAP 测试推送', message: 'Bark 手机推送工作正常。' };
const FALLBACK_NOTIFICATION_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQTX79HwAElwJzVt2vfAAAAABJRU5ErkJggg==';
const notificationSources = new Map();
const EMPTY_MONITOR_STATUS = {
  summary: '尚未读取到 WOOCLAP 内容。',
  isQuestion: false,
  checkedAt: 0,
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('enabled', ({ enabled }) => {
    if (enabled === undefined) chrome.storage.local.set({ enabled: true });
  });
});

function saveDiagnostic(state, message) {
  chrome.storage.local.set({
    notificationDiagnostic: {
      state,
      message,
      updatedAt: Date.now(),
    },
  });
}

function createNotification(notificationId, iconUrl, isTest, done, isFallback = false) {
  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl,
    title: isTest ? 'WOOCLAP 通知测试' : 'WOOCLAP 有新题目',
    message: isTest ? '系统通知工作正常。' : '打开 WOOCLAP 标签页查看并作答。',
    priority: 0,
  }, () => {
    const error = chrome.runtime.lastError?.message;
    if (error && !isFallback) {
      createNotification(notificationId, FALLBACK_NOTIFICATION_ICON, isTest, done, true);
      return;
    }
    if (error) {
      saveDiagnostic('failed', error);
      done?.({ ok: false, message: error });
      return;
    }
    saveDiagnostic('sent', isTest ? '测试通知已交给系统通知服务。' : '新题通知已交给系统通知服务。');
    done?.({ ok: true });
  });
}

function sendNtfyPush({ ntfyTopic: topic, ntfyServer: serverUrl, ntfyUser: username, ntfyPass: password }, { title, message }, done) {
  const request = globalThis.WooclapNtfyCore.buildNtfyRequest({ topic, serverUrl, username, password, title, message });
  if (!request) {
    done?.({ ok: false, message: 'ntfy 频道名无效，只能包含字母、数字、下划线和中划线。' });
    return;
  }
  fetch(request.url, request.options)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      done?.({ ok: true });
    })
    .catch((error) => {
      done?.({ ok: false, message: `ntfy 推送失败：${error.message}` });
    });
}

function sendBarkPush({ barkKey: deviceKey, barkServer: serverUrl }, { title, message }, done) {
  const request = globalThis.WooclapBarkCore.buildBarkRequest({ deviceKey, serverUrl, title, message });
  if (!request) {
    done?.({ ok: false, message: 'Bark Device Key 无效。' });
    return;
  }
  fetch(request.url, request.options)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      done?.({ ok: true });
    })
    .catch((error) => {
      done?.({ ok: false, message: `Bark 推送失败：${error.message}` });
    });
}

function showNotification(tabId, isTest, done) {
  const notificationId = `wooclap-${Date.now()}`;
  if (Number.isInteger(tabId)) notificationSources.set(notificationId, tabId);
  createNotification(notificationId, chrome.runtime.getURL(NOTIFICATION_ICON_PATH), isTest, done);
}

function getPopupStatus(done) {
  chrome.storage.local.get({
    enabled: true,
    monitorStatus: EMPTY_MONITOR_STATUS,
    notificationDiagnostic: { state: 'unknown', message: '尚未发送测试通知。', updatedAt: 0 },
  }, (stored) => {
    chrome.notifications.getPermissionLevel((permissionLevel) => {
      done({ ...stored, permissionLevel });
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'new-question') {
    chrome.storage.local.get({ enabled: true, ntfyTopic: '', barkKey: '' }, (settings) => {
      if (!settings.enabled) return;
      showNotification(sender.tab?.id, false);
      if (settings.ntfyTopic.trim()) sendNtfyPush(settings, NTFY_PUSH);
      if (settings.barkKey.trim()) sendBarkPush(settings, BARK_PUSH);
    });
  }

  if (message?.type === 'monitor-update') {
    chrome.storage.local.set({
      monitorStatus: {
        summary: String(message.summary || EMPTY_MONITOR_STATUS.summary).slice(0, 280),
        isQuestion: Boolean(message.isQuestion),
        checkedAt: Date.now(),
        tabId: sender.tab?.id,
      },
    });
  }

  if (message?.type === 'test-notification') {
    chrome.notifications.getPermissionLevel((permissionLevel) => {
      if (permissionLevel !== 'granted') {
        const messageText = `Chrome 通知权限当前为：${permissionLevel}`;
        saveDiagnostic('failed', messageText);
        sendResponse({ ok: false, message: messageText });
        return;
      }
      chrome.storage.local.get({ ntfyTopic: '', ntfyServer: '', ntfyUser: '', ntfyPass: '', barkKey: '', barkServer: '' }, (settings) => {
        showNotification(undefined, true, (result) => {
          const messages = [result.message];
          let ok = result.ok;
          let pending = 1;
          const finish = () => {
            if (--pending === 0) sendResponse({ ok, message: messages.filter(Boolean).join('；') });
          };
          if (settings.ntfyTopic.trim()) {
            pending++;
            sendNtfyPush(settings, NTFY_TEST_PUSH, (push) => {
              ok = ok && push.ok;
              messages.push(push.message);
              finish();
            });
          }
          if (settings.barkKey.trim()) {
            pending++;
            sendBarkPush(settings, BARK_TEST_PUSH, (push) => {
              ok = ok && push.ok;
              messages.push(push.message);
              finish();
            });
          }
          finish();
        });
      });
    });
    return true;
  }

  if (message?.type === 'get-popup-status') {
    getPopupStatus(sendResponse);
    return true;
  }
});

chrome.notifications.onClicked.addListener((notificationId) => {
  const tabId = notificationSources.get(notificationId);
  if (!Number.isInteger(tabId)) return;
  chrome.tabs.update(tabId, { active: true }, (tab) => {
    if (chrome.runtime.lastError || !Number.isInteger(tab?.windowId)) return;
    chrome.windows.update(tab.windowId, { focused: true }, () => {
      if (chrome.runtime.lastError) {
        // Ignored
      }
    });
  });
});
