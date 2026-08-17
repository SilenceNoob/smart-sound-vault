# Smart Sound Vault

[English](README.md) | [简体中文](README.zh-CN.md)

一款桌面音效库管理工具，支持基于 CLAP 的语义音频搜索、专业播放处理、
AI 音效生成，以及面向 DAW 的高效导出。项目使用 Rust 开发，技术栈包括
`egui`/`eframe`、`wgpu`、`rodio`/`symphonia` 和 `ort`（ONNX Runtime）。

Smart Sound Vault 面向拥有大量音效素材的用户：组织音频文件夹，通过关键词
或“语义”快速搜索，配合波形 / 频谱编辑器进行试听与处理，最后将处理结果
导出或直接拖拽到 DAW 中。

## 主要功能

- **素材库管理**
  - 扫描文件夹并自动监听文件系统变化
  - 适合大型素材库，可承载 8 万以上音效文件
  - 文件树、最近使用、标签、批量打标签、重命名和删除
  - 元数据展示（格式、时长、采样率、声道、位深、文件大小）
- **搜索**
  - 基于 SQLite FTS5 的关键词搜索（支持 `#标签` 过滤）
  - 基于 CLAP 音频 / 文本嵌入的语义搜索
  - FTS5 + CLAP 混合搜索，使用倒数排名融合（RRF）合并结果
  - 可选接入 DeepSeek，自动翻译非英语搜索语句
  - 基于 CLAP 标签的零样本自动打标签
- **播放与处理**
  - 波形图 + 频谱图，支持框选编辑
  - 播放、暂停、跳转、循环，以及无缝交叉淡化循环
  - 淡入淡出、音量、播放速度、保持音高变速
  - 每个声音可保存参数均衡器（EQ）
  - 响度归一化：关闭、自动或手动设置目标 dBFS
  - 实时电平表
- **导出**
  - 导出选区或整个音频，所有效果都会烘焙进导出结果
  - 支持导出到指定目录或默认导出目录
  - 可直接将处理后的音频拖入 DAW 或文件管理器
- **AI 音效生成**
  - 用自然语言描述声音，通过 ElevenLabs 生成（需要可选 API key）
  - 支持无缝循环和可选时长
- **易用性**
  - 英文 / 简体中文界面
  - 主题系统、自定义调色板和背景图片
  - 常用编辑操作支持撤销 / 重做
  - 从 GitHub Releases 自动更新，并可回滚到上一版本

## 下载

从 [Releases](../../releases) 获取对应平台的最新版本：

| 平台 | 安装包 |
|------|--------|
| Linux x86_64 | `smart-sound-vault-v*-x86_64-unknown-linux-gnu.tar.gz` |
| Windows x86_64 | `smart-sound-vault-v*-x86_64-pc-windows-msvc.zip` |
| macOS（Apple Silicon） | `smart-sound-vault-v*-arm64.dmg` |

发布 macOS Intel 版本时，文件名格式为 `smart-sound-vault-v*-x64.dmg`。

## 安装

### Linux

```bash
tar xzf smart-sound-vault-v*-x86_64-unknown-linux-gnu.tar.gz
./smart-sound-vault
```

### Windows

解压压缩包，双击 `smart-sound-vault.exe`。
如果 Windows SmartScreen 提示未知应用，选择
**更多信息 → 仍要运行**。

### macOS

打开 `.dmg`，将 **Smart Sound Vault** 拖入 `Applications`。

应用未经过 Apple 公证，因此首次启动可能提示“已损坏”或无法打开。
清除隔离属性后重新启动即可：

```bash
xattr -cr "/Applications/Smart Sound Vault.app"
```

## 首次启动

- 首次运行时，应用会提示下载语义搜索所需的 AI 模型（约 600 MB）。
  模型下载源可在 **设置** 中切换为 Hugging Face 或 ModelScope。
- 可通过 **文件 → 打开** 打开单个声音文件，或通过
  **库 → 设置库文件夹** 索引整个素材库。
- DeepSeek（搜索语句翻译）和 ElevenLabs（音效生成）API key 均为可选，
  可在 **设置** 中配置。

## 自动更新

在 **关于** 窗口中点击 **检查更新**。应用会下载新版本、备份当前版本并自动
重启。如果新版本出现问题，可在关于窗口中使用 **恢复上一版本** 进行回滚。

## 从源码构建

环境要求：

- 较新版本的稳定 Rust 工具链（推荐使用 `rustup`）
- 可正常工作的桌面窗口系统和音频栈
- 首次构建需要网络（`ort` 依赖会下载 ONNX Runtime 二进制文件）

```bash
cargo run --release   # 运行应用
cargo test            # 运行测试
```

构建说明：

- Linux / Windows 构建默认使用 CUDA 版 ONNX Runtime
  （`.cargo/config.toml` 设置了 `ORT_CUDA_VERSION=13`）。
  如需更广泛的 CUDA 驱动兼容性，可使用
  `ORT_CUDA_VERSION=cu12 cargo build --release`。
  CUDA 版本在无 NVIDIA GPU 的机器上仍可使用 CPU 运行。
- Windows 构建同时包含 DirectML 支持，可在无 CUDA 环境下使用 GPU 加速。
- macOS 构建使用 CoreML。
- 仓库中的 `models/` 目录故意保持为空。模型文件会在运行时下载，并通过
  SHA-256 校验。

## 发布

使用以下脚本构建并上传到 GitHub Releases：

```bash
scripts/publish.sh [--gen-notes] [tag] [target]
```

例如：

```bash
scripts/publish.sh v0.2.0 x86_64-pc-windows-msvc
```

该脚本需要安装并登录 GitHub CLI（`gh`）。

## 数据与配置

Smart Sound Vault 将所有状态保存在对应平台的数据目录中：

| 平台 | 位置 |
|------|------|
| Windows | `%APPDATA%\smart-sound-vault` |
| macOS | `~/Library/Application Support/smart-sound-vault` |
| Linux | `~/.local/share/smart-sound-vault`（素材库、索引、模型）和 `~/.config/smart-sound-vault`（设置、日志） |

其中包括 `config.toml`、SQLite 素材库数据库、日志、HNSW 搜索索引和已下载
的模型文件。

## 常见问题

**Windows 上画面渲染异常**

界面通过 `wgpu` 渲染。如果只有某一台机器出现文字错乱或背景花屏，而其他
机器正常，可尝试强制切换图形后端：

```powershell
$env:WGPU_BACKEND="dx12"; .\smart-sound-vault.exe
$env:WGPU_BACKEND="opengl"; .\smart-sound-vault.exe
$env:WGPU_BACKEND="vulkan"; .\smart-sound-vault.exe
```

如果只有某个后端异常，通常是 GPU 驱动问题。请更新显卡驱动、关闭第三方
覆盖层（overlay），并尝试在 Windows 中关闭“硬件加速 GPU 计划”。

**macOS 提示“应用已损坏”**

参见上方安装说明。应用未签名，使用 `xattr -cr` 可移除隔离属性。

**首次构建下载量很大**

`ort` 依赖在首次编译时会下载预编译的 ONNX Runtime 二进制文件，应用在首次
启动时还会下载 AI 模型，两者都需要联网。
