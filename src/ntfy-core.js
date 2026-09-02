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

  function encodeBasicAuth(username, password) {
    return `Basic ${btoa(unescape(encodeURIComponent(`${username}:${password}`)))}`;
  }

  function buildNtfyRequest({ topic, serverUrl = DEFAULT_SERVER, message = '', title = '', priority = 'high', tags = ['bell'], username = '', password = '' } = {}) {
    const cleanTopic = String(topic || '').trim();
    if (!TOPIC_PATTERN.test(cleanTopic)) return null;
    const headers = {};
    if (username) headers.Authorization = encodeBasicAuth(username, password);
    if (title) headers['X-Title'] = encodeHeaderValue(title);
    if (priority) headers['X-Priority'] = String(priority);
    if (tags && tags.length) headers['X-Tags'] = tags.map(encodeHeaderValue).join(',');
    const base = String(serverUrl || '').trim() || DEFAULT_SERVER;
    return {
      url: `${base.replace(/\/+$/, '')}/${cleanTopic}`,
      options: { method: 'POST', headers, body: String(message) },
    };
  }

  const api = { encodeHeaderValue, buildNtfyRequest };
  root.WooclapNtfyCore = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
}(globalThis));
