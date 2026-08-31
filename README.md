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

- 🔔 **Windows 原生桌面弹窗**：通过 Chrome 调起 Windows 系统原生通知（屏幕右下角 Toast 弹窗与提示音），浏览器在后台或最小化时也能即时提醒。
- 🎯 **一键直达作答**：点击右下角通知横幅，自动唤醒并置顶 Chrome 窗口，直达对应的 WOOCLAP 课堂标签页。
- 🛡️ **安全与隐私**：纯本地运行，不上传任何数据，不自动答题，不读取敏感 Cookie。
- ⚡ **稳定更新通知**：首次加载或刷新时自动建立基线；此后 WOOCLAP 页面出现新的稳定内容快照时发送一次通知，重复渲染同一状态不会重复提醒。
- 📊 **状态面板**：点击插件图标可实时查看当前捕获的题目摘要，支持一键发送测试通知。

---

## 🔔 通知机制说明

- **原生系统集成**：扩展通过 Chrome 标准 API 直接调用 Windows 10/11 的系统通知服务，在屏幕右下角弹出原生横幅。
- **后台与全屏感知**：无需将 WOOCLAP 保持在屏幕前台，最小化浏览器或全屏使用其他软件时均可正常接收提醒。
- **通知中心留存**：若暂时离开座位，通知会自动收纳在 Windows **通知中心**（按 `Win + N` 或 `Win + A` 查看），不会遗漏。
- **使用排查**：若未收到弹窗，请检查 Windows **“设置 -> 系统 -> 通知”** 中是否已允许 Google Chrome 发送通知，并确认未开启“专注助手 / 请勿打扰”。

---

## 🛠️ 工作流程

1. **页面监测**：后台监听 WOOCLAP 页面变动，并在短暂防抖后等待渲染稳定。
2. **快照比对**：提取页面文本、交互控件和页面结构；首次稳定状态只作为基线记录，后续出现不同快照时才触发提醒。
3. **桌面通知**：触发 Windows 桌面通知，点击通知即可一键跳转回对应作答页面。

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
2. 保持页面在后台打开；首次加载仅建立监测基线，之后页面出现新的稳定内容时 Windows 会自动弹窗提醒。
3. 点击通知直接切回页面查看或作答。

---

## ⚠️ 免责声明

- 本项目为第三方开源辅助工具，与 **南洋理工大学 (NTU)** 及 **Wooclap** 官方无任何隶属或关联。
- 本扩展仅用于**新题到达时的桌面通知提醒**，**绝不包含任何自动答题、自动填写或脚本辅助功能**，所有课堂互动与作答均由使用者自行完成。

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 协议开源。
