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
- 📱 **手机同步推送（可选）**：填入 ntfy 频道名后，新题提醒会同步推送到 Android / iPhone 上的 ntfy App，浏览器关闭页面之外的任何场景都不会错过。

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

## 📱 手机推送（ntfy，可选）

扩展支持把新题通知同步推送到手机，基于免费开源的 [ntfy](https://ntfy.sh/) 服务：

1. 在手机上安装 ntfy App（[Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy) / [iOS](https://apps.apple.com/us/app/ntfy/id1625396347)），也可以访问 [ntfy.sh](https://ntfy.sh/) 网页端订阅。
2. 在 App 中**订阅一个自定义频道**（Topic），频道名只允许字母、数字、`-`、`_`，例如 `wooclap-8k2m9x`。**频道名等同于密码**，请使用不易猜测的名字并妥善保管。
3. 在扩展弹窗的 **“手机推送频道（ntfy）”** 中填入同一频道名，回车保存。
4. 点击 **“测试”** 按钮，手机应同步收到推送；不填或清空频道名则完全关闭手机推送。

隐私说明：推送到手机时仅发送固定的提醒文案（“WOOCLAP 有新题目”），**不包含任何课程、题目或页面内容**；也可以将扩展中的服务器指向你自建的 ntfy 实例以实现完全私有（需自行修改 `src/ntfy-core.js` 中的默认服务器地址并调整 `manifest.json` 的 `host_permissions`）。

---

## ⚠️ 免责声明

- 本项目为第三方开源辅助工具，与 **南洋理工大学 (NTU)** 及 **Wooclap** 官方无任何隶属或关联。
- 本扩展仅用于**新题到达时的桌面通知提醒**，**绝不包含任何自动答题、自动填写或脚本辅助功能**，所有课堂互动与作答均由使用者自行完成。

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 协议开源。
