const enabledInput = document.querySelector('#enabled');
const testButton = document.querySelector('#test-notification');
const ntfyTopicInput = document.querySelector('#ntfy-topic');
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

chrome.storage.local.get({ ntfyTopic: '' }, ({ ntfyTopic }) => {
  ntfyTopicInput.value = ntfyTopic;
});

ntfyTopicInput.addEventListener('change', () => {
  chrome.storage.local.set({ ntfyTopic: ntfyTopicInput.value.trim() });
});

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
