# Smart Sound Vault

A desktop sound library manager with semantic search, AI generation, and pro audio tools.

桌面端音效库管理工具，支持语义搜索、AI 生成与专业音频处理。

## Features

- **Hybrid search** — keyword (FTS5) + semantic (CLAP embeddings) fused ranking
- **AI sound generation** — generate sounds from text prompts (ElevenLabs)
- **Non-English search** — auto-translates queries via DeepSeek
- **Audio tools** — waveform, spectrogram, EQ, loudness normalization, time-stretch, trim, crossfade, loop
- **Tagging** — organize and filter your library
- **Theming** — dark/light/custom palettes, background image
- **Auto-update** — built-in self-update from GitHub Releases

## Download

Grab the latest build for your platform from [Releases](../../releases):

| Platform | Asset |
|----------|-------|
| Linux x86_64 | `smart-sound-vault-v*-*-x86_64-unknown-linux-gnu.tar.gz` |
| Windows x86_64 | `smart-sound-vault-v*-*-x86_64-pc-windows-msvc.zip` |
| macOS (Intel) | `smart-sound-vault-v*-*-x86_64-apple-darwin.tar.gz` |
| macOS (Apple Silicon) | `smart-sound-vault-v*-*-aarch64-apple-darwin.tar.gz` |

## Install

**Linux**
```bash
tar xzf smart-sound-vault-v*-x86_64-unknown-linux-gnu.tar.gz
./smart-sound-vault
```

**Windows** — unzip, then double-click `smart-sound-vault.exe`.

**macOS** — extract and run. On first launch: right-click → Open to bypass Gatekeeper.

## Auto-update

In the **About** window, click **Check for Updates**. The app downloads the new version, backs up the previous one, and restarts. If a new version misbehaves, use **Restore Previous Version** in the same window.

打开 **关于** 窗口，点 **检查更新**。应用会下载新版本、备份上一版本并重启。新版有问题可在同窗口点 **还原上一版本**。

## Notes

- First launch downloads AI models (~600 MB) for semantic search — a prompt guides you through it.
- DeepSeek (translation) and ElevenLabs (generation) API keys are optional, set in Settings.

---

*Closed-source project. This repository hosts release binaries only.*
