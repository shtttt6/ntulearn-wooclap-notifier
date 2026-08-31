const test = require('node:test');
const assert = require('node:assert/strict');
const {
  normalizeSnapshot,
  isAnswerableQuestion,
  nextDetectionState,
  formatMonitorSummary,
} = require('../src/detector-core.js');

test('removes navigation labels and normalizes whitespace from snapshots', () => {
  const snapshot = normalizeSnapshot({
    text: '  Which   model\n is correct?  Previous  Next ',
    controls: ['radio'],
  });

  assert.deepEqual(snapshot, {
    text: 'Which model is correct?',
    controls: ['radio'],
    markup: '',
  });
});

test('does not classify a slide with only navigation controls as a question', () => {
  assert.equal(
    isAnswerableQuestion({ text: 'Markov Chains Next', controls: ['navigation'] }),
    false,
  );
});

test('classifies visible answer controls as a question', () => {
  assert.equal(
    isAnswerableQuestion({ text: 'Which model is correct?', controls: ['radio', 'radio'] }),
    true,
  );
});

test('records the first settled page state without notifying', () => {
  const transition = nextDetectionState({}, {
    text: 'Markov Chains Next',
    controls: ['navigation'],
  });

  assert.equal(transition.shouldNotify, false);
  assert.notEqual(transition.state.baselineFingerprint, '');
});

test('notifies once when a new answerable question follows the baseline', () => {
  const baseline = nextDetectionState({}, {
    text: 'Markov Chains Next',
    controls: ['navigation'],
  });
  const question = nextDetectionState(baseline.state, {
    text: 'Which model is correct? Previous Next',
    controls: ['radio', 'radio'],
  });

  assert.equal(question.shouldNotify, true);
  assert.equal(question.preview, 'Which model is correct?');
});

test('notifies when any settled page content changes after the baseline', () => {
  const baseline = nextDetectionState({}, {
    text: 'Welcome to the session',
    controls: [],
  });
  const update = nextDetectionState(baseline.state, {
    text: 'Teacher has opened a new slide',
    controls: [],
  });

  assert.equal(update.shouldNotify, true);
  assert.equal(update.preview, 'Teacher has opened a new slide');
});

test('notifies when a single-button image-label question replaces the baseline', () => {
  const baseline = nextDetectionState({}, {
    text: 'Welcome to the session',
    controls: [],
  });
  const update = nextDetectionState(baseline.state, {
    text: 'Enter the correct choice or 0 if none is correct. 1',
    controls: [],
    markup: '<img alt="Background of the Label An Image question"><button aria-label="Element to be identified number 1">1</button>',
  });

  assert.equal(update.shouldNotify, true);
});

test('notifies when image-label markup changes without a text change', () => {
  const baseline = nextDetectionState({}, {
    text: 'Enter the correct choice or 0 if none is correct. 1',
    controls: [],
    markup: '<img alt="Background image A"><button aria-label="Element number 1">1</button>',
  });
  const update = nextDetectionState(baseline.state, {
    text: 'Enter the correct choice or 0 if none is correct. 1',
    controls: [],
    markup: '<img alt="Background image B"><button aria-label="Element number 1">1</button>',
  });

  assert.equal(update.shouldNotify, true);
});

test('suppresses repeated renders of the same question', () => {
  const baseline = nextDetectionState({}, { text: 'Welcome Next', controls: ['navigation'] });
  const firstQuestion = nextDetectionState(baseline.state, {
    text: 'Select every true statement',
    controls: ['checkbox', 'checkbox'],
  });
  const repeat = nextDetectionState(firstQuestion.state, {
    text: ' Select every  true statement Previous Next ',
    controls: ['checkbox', 'checkbox'],
  });

  assert.equal(firstQuestion.shouldNotify, true);
  assert.equal(repeat.shouldNotify, false);
});

test('formats a readable current-content summary without navigation controls', () => {
  assert.equal(
    formatMonitorSummary({ text: '  Markov   Chains\n Previous Next ', controls: ['navigation'] }),
    'Markov Chains',
  );
});

test('uses a waiting label when WOOCLAP has no readable main content yet', () => {
  assert.equal(
    formatMonitorSummary({ text: '', controls: [] }),
    '等待 WOOCLAP 内容加载…',
  );
});
