const NOTIFICATION_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQTX79HwAElwJzVt2vfAAAAABJRU5ErkJggg==';
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

function showNotification(tabId, isTest, done) {
  const notificationId = `wooclap-${Date.now()}`;
  if (Number.isInteger(tabId)) notificationSources.set(notificationId, tabId);
  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: NOTIFICATION_ICON,
    title: isTest ? 'WOOCLAP 通知测试' : 'WOOCLAP 有新题目',
    message: isTest ? 'Windows 通知工作正常。' : '打开 WOOCLAP 标签页查看并作答。',
    priority: 0,
  }, () => {
    const error = chrome.runtime.lastError?.message;
    if (error) {
      saveDiagnostic('failed', error);
      done?.({ ok: false, message: error });
      return;
    }
    saveDiagnostic('sent', isTest ? '测试通知已交给 Windows。' : '新题通知已交给 Windows。');
    done?.({ ok: true });
  });
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
    chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
      if (enabled) showNotification(sender.tab?.id, false);
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
      showNotification(undefined, true, sendResponse);
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
