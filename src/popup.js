const enabledInput = document.querySelector('#enabled');
const testButton = document.querySelector('#test-notification');
const ntfyServerInput = document.querySelector('#ntfy-server');
const ntfyTopicInput = document.querySelector('#ntfy-topic');
const ntfyUserInput = document.querySelector('#ntfy-user');
const ntfyPassInput = document.querySelector('#ntfy-pass');
const barkKeyInput = document.querySelector('#bark-key');
const ntfyToggle = document.querySelector('#ntfy-toggle');
const ntfySettings = document.querySelector('#ntfy-settings');
const monitorState = document.querySelector('#monitor-state');
const monitorContent = document.querySelector('#monitor-content');
const notificationResult = document.querySelector('#notification-result');

function showError(message) {
  notificationResult.textContent = message;
  notificationResult.classList.remove('hidden');
}

function clearError() {
  notificationResult.textContent = '';
  notificationResult.classList.add('hidden');
}

function loadState() {
  chrome.runtime.sendMessage({ type: 'get-popup-status' }, (status) => {
    if (chrome.runtime.lastError || !status) {
      showError('请重新加载扩展');
      return;
    }
    enabledInput.checked = status.enabled;
    monitorState.textContent = status.monitorStatus.isQuestion ? '发现新题' : '监测中';
    monitorState.dataset.question = String(status.monitorStatus.isQuestion);
    monitorContent.textContent = status.monitorStatus.summary;
    if (status.notificationDiagnostic.state === 'failed') {
      showError(status.notificationDiagnostic.message);
    } else {
      clearError();
    }
  });
}

enabledInput.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: enabledInput.checked });
});

chrome.storage.local.get({ ntfyTopic: '', ntfyServer: '', ntfyUser: '', ntfyPass: '', barkKey: '' }, (settings) => {
  ntfyTopicInput.value = settings.ntfyTopic;
  ntfyServerInput.value = settings.ntfyServer;
  ntfyUserInput.value = settings.ntfyUser;
  ntfyPassInput.value = settings.ntfyPass;
  barkKeyInput.value = settings.barkKey;
});

const ntfyFields = [
  ['#ntfy-topic', 'ntfyTopic'],
  ['#ntfy-user', 'ntfyUser'],
  ['#ntfy-pass', 'ntfyPass'],
  ['#bark-key', 'barkKey'],
];
for (const [selector, key] of ntfyFields) {
  document.querySelector(selector).addEventListener('change', (event) => {
    chrome.storage.local.set({ [key]: event.target.value.trim() });
  });
}

ntfyToggle.addEventListener('click', () => {
  const expanded = ntfySettings.classList.toggle('hidden') === false;
  ntfyToggle.setAttribute('aria-expanded', String(expanded));
  ntfyToggle.textContent = expanded ? '手机推送（ntfy）▾' : '手机推送（ntfy）▸';
});

ntfyServerInput.addEventListener('change', async (event) => {
  const serverUrl = event.target.value.trim();
  chrome.storage.local.set({ ntfyServer: serverUrl });
  await ensureNtfyServerPermission(serverUrl);
});

async function ensureNtfyServerPermission(serverUrl) {
  let originPattern;
  try {
    originPattern = `${new URL(serverUrl).origin}/*`;
  } catch {
    return;
  }
  if (originPattern === 'https://ntfy.sh/*') return;
  const granted = await new Promise((resolve) => {
    chrome.permissions.contains({ origins: [originPattern] }, (has) => {
      if (has || chrome.runtime.lastError) {
        resolve(Boolean(has));
        return;
      }
      chrome.permissions.request({ origins: [originPattern] }, resolve);
    });
  });
  if (!granted) {
    showError(`未授权扩展访问 ${originPattern}，手机推送将无法发送。`);
  }
}

testButton.addEventListener('click', () => {
  testButton.disabled = true;
  chrome.runtime.sendMessage({ type: 'test-notification' }, (result) => {
    testButton.disabled = false;
    if (chrome.runtime.lastError) {
      showError(chrome.runtime.lastError.message);
    } else if (result?.message) {
      showError(result.message);
    }
    loadState();
  });
});

loadState();
setInterval(loadState, 1000);
