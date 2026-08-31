(function startWooclapObserver() {
  const { formatMonitorSummary, isAnswerableQuestion, nextDetectionState } = globalThis.WooclapDetectorCore;
  const NAVIGATION_TEXT = new Set(['previous', 'next']);
  let detectorState = {};
  let activeMain = null;
  let mainObserver = null;
  let settleTimer = null;

  function isVisible(element) {
    return element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
  }

  function nonNavigationButtons(main) {
    return Array.from(main.querySelectorAll('button'))
      .filter(isVisible)
      .filter((button) => {
        const label = (button.getAttribute('aria-label') || button.innerText || '').trim().toLowerCase();
        return label && !NAVIGATION_TEXT.has(label);
      });
  }

  function getSnapshot(main) {
    const clone = main.cloneNode(true);
    const controls = Array.from(main.querySelectorAll(
      'input, textarea, select, [contenteditable="true"], [role="radio"], [role="checkbox"]',
    ))
      .filter(isVisible)
      .map((element) => {
        if (element.matches('[role="radio"], input[type="radio"]')) return 'radio';
        if (element.matches('[role="checkbox"], input[type="checkbox"]')) return 'checkbox';
        if (element.matches('textarea')) return 'textarea';
        if (element.matches('select')) return 'select';
        if (element.matches('[contenteditable="true"]')) return 'contenteditable';
        return 'input';
      });

    if (nonNavigationButtons(main).length >= 2) controls.push('answer-button');
    return { text: clone.innerText, controls, markup: clone.innerHTML };
  }

  function assessCurrentMain() {
    const main = document.querySelector('main');
    if (!main) return;
    const snapshot = getSnapshot(main);
    const transition = nextDetectionState(detectorState, snapshot);
    detectorState = transition.state;
    chrome.runtime.sendMessage({
      type: 'monitor-update',
      summary: formatMonitorSummary(snapshot),
      isQuestion: isAnswerableQuestion(snapshot),
    }, () => {
      if (chrome.runtime.lastError) {
        // Suppress unchecked lastError warning if background is idle
      }
    });
    if (transition.shouldNotify) {
      chrome.runtime.sendMessage({ type: 'new-question' }, () => {
        if (chrome.runtime.lastError) {
          // Suppress unchecked lastError warning if background is idle
        }
      });
    }
  }

  function scheduleAssessment() {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(assessCurrentMain, 1000);
  }

  function attachToMain() {
    const main = document.querySelector('main');
    if (!main || main === activeMain) return;
    mainObserver?.disconnect();
    activeMain = main;
    mainObserver = new MutationObserver(scheduleAssessment);
    mainObserver.observe(main, { childList: true, subtree: true, characterData: true, attributes: true });
    scheduleAssessment();
  }

  const documentObserver = new MutationObserver(attachToMain);
  documentObserver.observe(document.documentElement, { childList: true, subtree: true });
  attachToMain();
}());
