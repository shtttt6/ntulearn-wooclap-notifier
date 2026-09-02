const enabledInput = document.querySelector('#enabled');
const monitorState = document.querySelector('#monitor-state');
const monitorContent = document.querySelector('#monitor-content');
const notificationResult = document.querySelector('#notification-result');
const phoneToggle = document.querySelector('#phone-toggle');
const phoneSettings = document.querySelector('#phone-settings');

const FIELDS = {
  bark: {
    inputs: { barkKey: '#bark-key' },
    status: '#bark-status',
    savedText: 'Bark 配置已保存',
  },
  ntfy: {
    inputs: {
      ntfyServer: '#ntfy-server',
      ntfyTopic: '#ntfy-topic',
      ntfyUser: '#ntfy-user',
      ntfyPass: '#ntfy-pass',
    },
    status: '#ntfy-status',
    savedText: 'ntfy 配置已保存',
  },
};

function showError(message) {
  notificationResult.textContent = message;
  notificationResult.classList.remove('hidden');
}

function clearError() {
  notificationResult.textContent = '';
  notificationResult.classList.add('hidden');
}

function showSavedStatus(channel) {
  const status = document.querySelector(FIELDS[channel].status);
  status.textContent = FIELDS[channel].savedText;
  setTimeout(() => {
    status.textContent = '';
  }, 2500);
}

function loadState() {
  chrome.runtime.sendMessage({ type: 'get-popup-status' }, (status) => {
    if (chrome.runtime.lastError || !status) {
      showError('请重新加载扩展');
      return;
    }
    enabledInput.checked = status.enabled !== false;
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

function loadPushSettings() {
  const defaults = {};
  for (const { inputs } of Object.values(FIELDS)) {
    for (const key of Object.keys(inputs)) defaults[key] = '';
  }
  chrome.storage.local.get(defaults, (stored) => {
    for (const { inputs } of Object.values(FIELDS)) {
      for (const [key, selector] of Object.entries(inputs)) {
        document.querySelector(selector).value = stored[key];
      }
    }
  });
}

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

enabledInput.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: enabledInput.checked });
});

phoneToggle.addEventListener('click', () => {
  const expanded = phoneSettings.classList.toggle('hidden') === false;
  phoneToggle.setAttribute('aria-expanded', String(expanded));
  phoneToggle.textContent = expanded ? '手机推送（Bark / ntfy）▾' : '手机推送（Bark / ntfy）▸';
});

for (const [channel, config] of Object.entries(FIELDS)) {
  document.querySelector(`#save-${channel}`).addEventListener('click', async () => {
    const values = {};
    for (const [key, selector] of Object.entries(config.inputs)) {
      values[key] = document.querySelector(selector).value.trim();
    }
    await new Promise((resolve) => chrome.storage.local.set(values, resolve));
    showSavedStatus(channel);
    if (channel === 'ntfy') {
      await ensureNtfyServerPermission(values.ntfyServer);
    }
  });
}

for (const button of document.querySelectorAll('[data-test]')) {
  button.addEventListener('click', () => {
    button.disabled = true;
    chrome.runtime.sendMessage({ type: button.dataset.test }, (result) => {
      button.disabled = false;
      if (chrome.runtime.lastError) {
        showError(chrome.runtime.lastError.message);
      } else if (result?.message) {
        showError(result.message);
      }
      loadState();
    });
  });
}

loadState();
loadPushSettings();
setInterval(loadState, 1000);
