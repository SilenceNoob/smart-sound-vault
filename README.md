# Smart Sound Vault

[English](README.md) | [简体中文](README.zh-CN.md)

A desktop sound library manager with CLAP-based semantic audio search, pro
playback tools, AI sound generation, and DAW-friendly export. Built with Rust,
`egui`/`eframe`, `wgpu`, `rodio`/`symphonia`, and `ort` (ONNX Runtime).

Smart Sound Vault is designed for people with large sound-effect collections:
organize a folder of audio files, search it by keyword *or by meaning*, preview
with a full waveform/spectrogram editor, then export or drag the processed
result straight into a DAW.

## Highlights

- **Library management**
  - Folder scanning with automatic file-system watching
  - Large-library friendly: designed for collections of 80k+ sounds
  - File tree, recent files, tags, batch tagging, rename, and delete
  - Metadata display (format, duration, sample rate, channels, bit depth, size)
- **Search**
  - Keyword search via SQLite FTS5 (supports `#tag` filters)
  - Semantic search with CLAP audio/text embeddings
  - Hybrid search that fuses FTS5 + CLAP results with reciprocal rank fusion
  - Optional DeepSeek-powered translation for non-English queries
  - Zero-shot auto-tagging using CLAP labels
- **Playback and processing**
  - Waveform + spectrogram view with selection editing
  - Play, pause, seek, loop, and seamless crossfade looping
  - Fade in/out, volume, playback speed, and preserve-pitch time stretching
  - Per-sound parametric EQ (peaking, low/high shelf, preamp)
  - Loudness normalization: off, auto, or manual target dBFS
  - Real-time level meter
- **Export**
  - Export a selection or the whole file with all effects baked in
  - Export to a chosen directory or the configured default directory
  - Drag processed audio directly to a DAW / file manager
- **AI sound generation**
  - Describe a sound and generate it with ElevenLabs (optional API key)
  - Seamless loop option and optional duration
- **Quality of life**
  - English / 简体中文 UI
  - Theme system, custom color palette, and background image
  - Undo/redo for common edits
  - Self-update from GitHub Releases with rollback to the previous version

## Download

Grab the latest build for your platform from
[Releases](../../releases):

| Platform | Package |
|----------|---------|
| Linux x86_64 | `smart-sound-vault-v*-x86_64-unknown-linux-gnu.tar.gz` |
| Windows x86_64 | `smart-sound-vault-v*-x86_64-pc-windows-msvc.zip` |
| macOS (Apple Silicon) | `smart-sound-vault-v*-arm64.dmg` |

macOS Intel builds are published as `smart-sound-vault-v*-x64.dmg` when
available.

## Install

### Linux

```bash
tar xzf smart-sound-vault-v*-x86_64-unknown-linux-gnu.tar.gz
./smart-sound-vault
```

### Windows

Unzip the archive and double-click `smart-sound-vault.exe`.
If Windows SmartScreen warns that the app is unknown, choose
**More info → Run anyway**.

### macOS

Open the `.dmg` and drag **Smart Sound Vault** into `Applications`.

The app is not notarized, so the first launch may report that it is
"damaged" or blocked. Clear the quarantine flag, then launch again:

```bash
xattr -cr "/Applications/Smart Sound Vault.app"
```

## First launch

- On first run the app offers to download the AI models required for semantic
  search (roughly 600 MB). The model source can be switched between Hugging
  Face and ModelScope in **Settings**.
- Open a sound with **File → Open**, or set a library folder with
  **Library → Set Library Folder** to index a whole collection.
- DeepSeek (query translation) and ElevenLabs (sound generation) API keys are
  optional and can be configured in **Settings**.

## Auto-update

Open **About** and click **Check for Updates**. Smart Sound Vault downloads the
new release, backs up the current binary, and restarts automatically. If a new
version misbehaves, use **Restore Previous Version** in the About window.

## Building from source

Prerequisites:

- A recent stable Rust toolchain (`rustup`)
- A desktop platform with a working window system and audio stack
- Network access on the first build (ONNX Runtime binaries are downloaded by
  the `ort` crate)

```bash
cargo run --release   # run
cargo test            # run the test suite
```

Build notes:

- Linux/Windows builds use the CUDA variant of ONNX Runtime by default
  (`.cargo/config.toml` sets `ORT_CUDA_VERSION=13`). Build with
  `ORT_CUDA_VERSION=cu12` if you need broader CUDA driver coverage. The CUDA
  runtime still works on CPU-only machines.
- Windows builds also include DirectML support for GPU-agnostic acceleration.
- macOS builds use CoreML.
- The `models/` directory in this repository is intentionally empty. Model
  files are downloaded at runtime and verified with SHA-256.

## Releasing

Releases are built and uploaded to GitHub Releases with:

```bash
scripts/publish.sh [--gen-notes] [tag] [target]
```

For example:

```bash
scripts/publish.sh v0.2.0 x86_64-pc-windows-msvc
```

The script requires the GitHub CLI (`gh`) to be installed and authenticated.

## Data and configuration

Smart Sound Vault stores all state under the platform data directories:

| Platform | Location |
|----------|----------|
| Windows | `%APPDATA%\smart-sound-vault` |
| macOS | `~/Library/Application Support/smart-sound-vault` |
| Linux | `~/.local/share/smart-sound-vault` (library, index, models) and `~/.config/smart-sound-vault` (settings, logs) |

This includes `config.toml`, the SQLite library database, logs, the HNSW
search index, and downloaded models.

## Troubleshooting

**Graphics corruption on Windows**

The UI renders through `wgpu`. If text glyphs or the background look corrupted
on a specific machine while other machines are fine, try forcing a different
graphics backend before reporting the issue:

```powershell
$env:WGPU_BACKEND="dx12"; .\smart-sound-vault.exe
$env:WGPU_BACKEND="opengl"; .\smart-sound-vault.exe
$env:WGPU_BACKEND="vulkan"; .\smart-sound-vault.exe
```

If only one backend misbehaves, the problem is usually a GPU driver issue.
Update the GPU driver, disable third-party overlays, and try disabling
Hardware-Accelerated GPU Scheduling in Windows.

**macOS "damaged app"**

See the install section above. The binary is unsigned; `xattr -cr` removes the
quarantine flag.

**First build downloads a lot of data**

The `ort` dependency downloads prebuilt ONNX Runtime binaries on the first
compile, and the app downloads AI models on first launch. Both require network
access.
