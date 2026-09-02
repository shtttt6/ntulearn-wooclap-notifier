(function attachBarkCore(root) {
  const DEFAULT_SERVER = 'https://api.day.app';
  const KEY_PATTERN = /^[-_A-Za-z0-9]{10,}$/;

  // 接受裸 Device Key，也接受从 Bark App 复制的完整 URL
  // （如 https://api.day.app/<key>/这里改成你的推送内容），自建服务器地址一并识别。
  function parseBarkInput(input) {
    const text = String(input || '').trim();
    if (!/^https?:\/\//i.test(text)) return { key: text };
    try {
      const url = new URL(text);
      const [key] = url.pathname.split('/').filter(Boolean);
      return { key: key || '', serverUrl: `${url.protocol}//${url.host}` };
    } catch {
      return { key: '' };
    }
  }

  // Bark 官方服务器在国内可直连，经它自己的 APNs 通道投递到 iPhone，无需代理。
  function buildBarkRequest({ deviceKey, serverUrl, title = '', message = '' } = {}) {
    const parsed = parseBarkInput(deviceKey);
    const key = parsed.key;
    if (!KEY_PATTERN.test(key)) return null;
    const base = String(serverUrl || '').trim() || parsed.serverUrl || DEFAULT_SERVER;
    return {
      url: `${base.replace(/\/+$/, '')}/push`,
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ device_key: key, title: String(title), body: String(message), group: 'wooclap' }),
      },
    };
  }

  const api = { parseBarkInput, buildBarkRequest };
  root.WooclapBarkCore = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
}(globalThis));
