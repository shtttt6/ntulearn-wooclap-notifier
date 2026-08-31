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
- ⚡ **智能防误报**：进房与刷新自动建立基线，过滤普通讲义幻灯片与翻页按钮，不误报、不打扰。
- 📊 **状态面板**：点击插件图标可实时查看当前捕获的题目摘要，支持一键发送测试通知。

---

## 🔔 通知机制说明

- **原生系统集成**：扩展通过 Chrome 标准 API 直接调用 Windows 10/11 的系统通知服务，在屏幕右下角弹出原生横幅。
- **后台与全屏感知**：无需将 WOOCLAP 保持在屏幕前台，最小化浏览器或全屏使用其他软件时均可正常接收提醒。
- **通知中心留存**：若暂时离开座位，通知会自动收纳在 Windows **通知中心**（按 `Win + N` 或 `Win + A` 查看），不会遗漏。
- **使用排查**：若未收到弹窗，请检查 Windows **“设置 -> 系统 -> 通知”** 中是否已允许 Google Chrome 发送通知，并确认未开启“专注助手 / 请勿打扰”。

---

## 🛠️ 工作流程

1. **页面监测**：后台监听 WOOCLAP 页面变动，防抖等待渲染稳定。
2. **新题识别**：提取页面文本与交互控件，比对基线指纹，判断是否为新题。
3. **桌面通知**：触发 Windows 桌面通知，点击通知一键跳转回作答页面。

---

## 🚀 安装方法

1. 下载最新发布的 `ntulearn-wooclap-notifier-v*.zip` 并解压（或直接 clone 源码）。
2. 在 Chrome 浏览器打开 `chrome://extensions/`，开启右上角的 **开发者模式**。
3. 点击左上角的 **加载已解压的扩展程序**，选择插件文件夹即可。

> [!TIP]
> 建议在 Chrome 工具栏将插件图标固定（Pin），点击图标可点击“测试”按钮确认系统通知正常。

---

## 📖 使用说明

1. 正常进入 NTU Learn 并打开 WOOCLAP 页面。
2. 保持页面在后台打开，老师发布新题目时 Windows 会自动弹窗提醒。
3. 点击通知直接切回页面作答。

---

## ⚠️ 免责声明

- 本项目为第三方开源辅助工具，与 **南洋理工大学 (NTU)** 及 **Wooclap** 官方无任何隶属或关联。
- 本扩展仅用于**新题到达时的桌面通知提醒**，**绝不包含任何自动答题、自动填写或脚本辅助功能**，所有课堂互动与作答均由使用者自行完成。

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 协议开源。

