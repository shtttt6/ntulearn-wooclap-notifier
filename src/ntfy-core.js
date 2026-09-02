(function attachNtfyCore(root) {
  const DEFAULT_SERVER = 'https://ntfy.sh';
  const TOPIC_PATTERN = /^[-_A-Za-z0-9]{1,64}$/;

  // HTTP header values must be byte strings; Chinese/emoji titles need RFC 2047 encoding.
  function encodeHeaderValue(value) {
    const text = String(value || '');
    return /^[\x20-\x7e]*$/.test(text)
      ? text
      : `=?utf-8?B?${btoa(unescape(encodeURIComponent(text)))}?=`;
  }

  function buildNtfyRequest({ topic, serverUrl = DEFAULT_SERVER, message = '', title = '', priority = 'high', tags = ['bell'] } = {}) {
    const cleanTopic = String(topic || '').trim();
    if (!TOPIC_PATTERN.test(cleanTopic)) return null;
    const headers = {};
    if (title) headers['X-Title'] = encodeHeaderValue(title);
    if (priority) headers['X-Priority'] = String(priority);
    if (tags && tags.length) headers['X-Tags'] = tags.map(encodeHeaderValue).join(',');
    return {
      url: `${String(serverUrl).replace(/\/+$/, '')}/${cleanTopic}`,
      options: { method: 'POST', headers, body: String(message) },
    };
  }

  const api = { encodeHeaderValue, buildNtfyRequest };
  root.WooclapNtfyCore = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
}(globalThis));
