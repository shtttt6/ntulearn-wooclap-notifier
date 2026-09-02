<p align="center">
  <img src="assets/ntulearn-wooclap-notifier-icon-blue-white.png" width="100" alt="NTULearn WOOCLAP Notifier Logo" style="border-radius: 18px;">
</p>

<h1 align="center">NTULearn WOOCLAP Notifier</h1>

<p align="center">
  为 NTULearn 中的 WOOCLAP 打造的新题通知 Chrome 扩展。
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=flat-square" alt="Manifest V3">
  <img src="https://img.shields.io/badge/Chrome-%3E%3D%2088-green?style=flat-square" alt="Chrome >= 88">
  <img src="https://img.shields.io/badge/License-MIT-orange?style=flat-square" alt="MIT License">
</p>

---

## ✨ 核心特性

- 🔔 **系统原生桌面通知（Windows / macOS）**：通过 Chrome 标准 API 调起系统级原生通知（Windows 屏幕右下角 Toast、macOS 屏幕右上角通知中心横幅，均带提示音），浏览器在后台或最小化时也能即时提醒。
- 🎯 **一键直达作答**：点击通知横幅，自动唤醒并置顶 Chrome 窗口，直达对应的 WOOCLAP 课堂标签页。
- 🛡️ **安全与隐私**：纯本地运行，不上传任何数据，不自动答题，不读取敏感 Cookie。
- ⚡ **稳定更新通知**：首次加载或刷新时自动建立基线；此后 WOOCLAP 页面出现新的稳定内容快照时发送一次通知，重复渲染同一状态不会重复提醒。
- 📊 **状态面板**：点击插件图标可实时查看当前捕获的题目摘要，支持一键发送测试通知。
- 📱 **手机同步推送（可选）**：支持 [ntfy](https://ntfy.sh/)（官方服务器或自建，Android / iOS）与 **Bark**（iPhone 推荐，国内直连免代理）两种通道，新题提醒同步推送到手机，浏览器之外也不会错过。

---

## 🔔 通知机制说明

- **原生系统集成**：扩展通过 Chrome 标准 API 调起操作系统原生通知，同时支持 **Windows 10/11**（屏幕右下角 Toast 横幅）与 **macOS**（屏幕右上角通知中心横幅）。
- **后台与全屏感知**：无需将 WOOCLAP 保持在屏幕前台，最小化浏览器或全屏使用其他软件时均可正常接收提醒。
- **通知中心留存**：若暂时离开座位，通知会自动收纳在系统**通知中心**——Windows 按 `Win + N` 查看，macOS 点击屏幕右上角菜单栏时钟图标（或从右侧轻扫打开）查看，不会遗漏。
- **使用排查**：
  - **Windows**：检查 **“设置 -> 系统 -> 通知”** 中是否已允许 Google Chrome 发送通知，并确认未开启“专注助手 / 请勿打扰”。
  - **macOS**：检查 **“系统设置 -> 通知”** 中 Google Chrome 的通知是否为“允许”，并确认未开启“勿扰模式 / 专注模式”；若 Chrome 曾弹出“是否允许发送通知”的系统授权框，需选择允许（错过可在“系统设置 -> 通知”中补开）。

---

## 🛠️ 工作流程

1. **页面监测**：后台监听 WOOCLAP 页面变动，并在短暂防抖后等待渲染稳定。
2. **快照比对**：提取页面文本、交互控件和页面结构；首次稳定状态只作为基线记录，后续出现不同快照时才触发提醒。
3. **桌面通知**：触发系统原生通知（Windows / macOS），点击通知即可一键跳转回对应作答页面。

---

## 🚀 安装方法

### 方式一：安装 Release（推荐）

1. 在 [Releases](https://github.com/shtttt6/ntulearn-wooclap-notifier/releases) 下载最新的 `ntulearn-wooclap-notifier-v*.zip`，并先解压 ZIP 文件。
2. 在 Chrome 地址栏打开 `chrome://extensions/`，开启右上角的 **开发者模式**。
3. 点击左上角的 **加载未打包的扩展程序**（部分 Chrome 语言版本会显示为“加载已解压的扩展程序”）。
4. 选择**解压后直接包含 `manifest.json` 的文件夹**。
5. 看到 **NTULearn WOOCLAP Notifier** 扩展卡片后，即表示安装完成。

### 方式二：从源码安装

```bash
git clone https://github.com/shtttt6/ntulearn-wooclap-notifier.git
cd ntulearn-wooclap-notifier
```

然后按上方第 2–5 步操作，选择仓库根目录（包含 `manifest.json` 的目录）。

### 更新与排查

- **更新扩展**：下载并解压新版本后，使用新文件夹重新加载扩展；若仍使用同一个已加载文件夹，覆盖文件后点击扩展卡片右下角的圆形 **重新加载** 图标。
- **`Service Worker（无效）`**：对 Manifest V3 扩展通常只表示后台 Service Worker 当前处于空闲状态，不表示安装失败。
- **红色“错误”按钮**：表示扩展记录到实际运行错误；点击它可查看详细原因。重新加载后再点击弹窗中的“测试”按钮，确认通知工作正常。

> [!TIP]
> 建议在 Chrome 工具栏将插件图标固定（Pin），点击图标可点击“测试”按钮确认系统通知正常。

---

## 📖 使用说明

1. 正常进入 NTU Learn 并打开 WOOCLAP 页面。
2. 保持页面在后台打开；首次加载仅建立监测基线，之后页面出现新的稳定内容时系统会自动弹窗提醒。
3. 点击通知直接切回页面查看或作答。

## 📱 手机推送（可选）

扩展支持把新题通知同步推送到手机，内置 **Bark** 和 **ntfy** 两个通道，可以只用其中一个，也可以同时开启（新题到达时两个都会发）。

> [!TIP]
> **iPhone 用户直接选 Bark**：国内直连、不需要任何代理、配置只需粘贴一条 URL。ntfy 的 iOS 实时推送受苹果机制限制，自建服务器场景下还要额外解决网络问题（见下文"常见问题"），除非你本身就有自建 ntfy 服务器的需求，否则没必要。

### Bark 配置（iPhone，推荐）

1. iPhone 在 App Store 安装 [Bark](https://apps.apple.com/app/bark-customed-notifications/id1403753865)（免费开源）。
2. 首次打开时**务必允许系统通知授权**（可在 设置 → 通知 → Bark 中检查）。
3. 打开 Bark 首页，会看到一条示例 URL，形如 `https://api.day.app/<DeviceKey>/这里改成你的推送内容`，**把整条 URL 复制**。
4. 在扩展弹窗 → "手机推送"面板 → **Bark** 卡片中粘贴这条 URL（整条粘贴即可，扩展会自动提取其中的 Device Key），点击 **保存**。
5. 点击弹窗中的 **测试 Bark** 按钮，手机锁屏状态下应立即弹出横幅。

原理说明：Bark 走其官方服务器（`api.day.app`，国内可直连）中转苹果 APNs，因此**不依赖任何代理**，电脑上的代理软件开不开都不影响。推送内容为固定文案（"WOOCLAP 有新题目"），不包含课程、题目或页面内容。进阶用户也可以自建 [bark-server](https://github.com/finb/bark-server)，把自建地址的整条 URL 粘入即可（扩展会自动识别服务器地址）。

### ntfy 配置（Android / iOS / 网页，支持自建）

1. 在手机上安装 ntfy App（[Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy) / [iOS](https://apps.apple.com/us/app/ntfy/id1625396347)），或使用网页端订阅。
2. 在 App 中**订阅一个自定义频道**（Topic）。频道名只允许字母、数字、`-`、`_`（如 `wooclap-8k2m9x`）。**在公开服务器上，频道名等同于密码**，请使用不易猜测的名字。
3. 在扩展弹窗 → "手机推送"面板 → **ntfy** 卡片中填写：
   - **服务器地址**：使用官方 ntfy.sh 则留空；自建服务器填实例地址（如 `http://192.168.x.x:8080`），保存时会弹出 Chrome 访问授权，选择允许；
   - **频道（Topic）**：与手机 App 订阅的相同；
   - **账号 / 密码**：自建服务器开启 `auth-default-access: deny-all` 时必填，官方 ntfy.sh 留空。
4. 点击 **保存**，再点弹窗中的 **测试 ntfy** 按钮验证。

### ntfy 常见问题

- **iPhone 收到了消息但要手动刷新才显示**：这是 iOS 平台限制——App 退后台即被系统冻结，横幅通知必须经苹果 APNs 投递，而 APNs 推送必须由持有 ntfy App 推送凭证的 ntfy.sh 官方服务器代发。因此**自建服务器必须能访问 `https://ntfy.sh`**（在 `server.yml` 配置 `upstream-base-url: "https://ntfy.sh"`；转发给上游的只有消息 ID 和 topic 哈希，内容不外泄）。若你的网络访问不了 ntfy.sh（国内网络通常如此），需要让服务器走代理，并在手机 App 中删除订阅后重新添加一次以重注册推送通道。无法满足条件时，iPhone 请改用 Bark。
- **Android 收不到或延迟**：在 ntfy App 中对该订阅开启**即时交付（Instant delivery）**，并在系统设置中把 ntfy 的电池优化设为"不限制"。
- **点"测试 ntfy"提示"尚未配置 ntfy 频道"**：频道名没有保存，填好后记得点 **保存**。
- **提示"未授权扩展访问 …"**：自建服务器地址保存时的 Chrome 授权弹窗被拒绝过，到 `chrome://extensions` → 本扩展 → 详情 → 网站访问权限 中重新允许。
- **更换了服务器地址 / 端口**：重新填入并保存（会再次弹授权），手机 App 端同步修改 Default server。
- **自建服务器认证失败**：检查账号密码是否与服务器用户库一致（`ntfy user` 命令或管理面板可查）。
- **推送内容会泄露课程信息吗**：不会。两个通道都只发送固定文案（"WOOCLAP 有新题目"），**不包含任何课程、题目或页面内容**。

---

## ⚠️ 免责声明

- 本项目为第三方开源辅助工具，与 **南洋理工大学 (NTU)** 及 **Wooclap** 官方无任何隶属或关联。
- 本扩展仅用于**新题到达时的桌面通知提醒**，**绝不包含任何自动答题、自动填写或脚本辅助功能**，所有课堂互动与作答均由使用者自行完成。

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 协议开源。
