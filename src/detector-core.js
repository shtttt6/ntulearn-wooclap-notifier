(function attachDetectorCore(root) {
  const NAVIGATION_LABELS = new Set(['previous', 'next']);
  const ANSWER_CONTROL_TYPES = new Set([
    'input',
    'textarea',
    'select',
    'contenteditable',
    'radio',
    'checkbox',
    'answer-button',
  ]);

  function normalizeText(text) {
    return String(text || '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter((word) => !NAVIGATION_LABELS.has(word.toLowerCase()))
      .join(' ');
  }

  function normalizeSnapshot(snapshot) {
    return {
      text: normalizeText(snapshot && snapshot.text),
      controls: Array.from(new Set((snapshot && snapshot.controls) || []))
        .map((control) => String(control).toLowerCase())
        .sort(),
      markup: String((snapshot && snapshot.markup) || '')
        .replace(/\s+/g, ' ')
        .trim(),
    };
  }

  function isAnswerableQuestion(snapshot) {
    return snapshot.controls.some((control) => ANSWER_CONTROL_TYPES.has(control));
  }

  function fingerprint(snapshot) {
    return JSON.stringify(normalizeSnapshot(snapshot));
  }

  function formatMonitorSummary(snapshot) {
    const text = normalizeSnapshot(snapshot).text;
    return text ? text.slice(0, 280) : '等待 WOOCLAP 内容加载…';
  }

  function nextDetectionState(previousState, snapshot) {
    const state = previousState || {};
    const normalized = normalizeSnapshot(snapshot);
    const currentFingerprint = JSON.stringify(normalized);

    if (!state.baselineFingerprint) {
      return {
        state: {
          baselineFingerprint: currentFingerprint,
          notifiedFingerprint: '',
        },
        shouldNotify: false,
        preview: '',
      };
    }

    const shouldNotify = state.notifiedFingerprint !== currentFingerprint;

    return {
      state: {
        baselineFingerprint: state.baselineFingerprint,
        notifiedFingerprint: shouldNotify ? currentFingerprint : (state.notifiedFingerprint || ''),
      },
      shouldNotify,
      preview: normalized.text.slice(0, 120),
    };
  }

  const api = {
    normalizeSnapshot,
    isAnswerableQuestion,
    nextDetectionState,
    fingerprint,
    formatMonitorSummary,
  };
  root.WooclapDetectorCore = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
}(globalThis));
