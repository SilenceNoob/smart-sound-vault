# Smart Sound Vault

A desktop sound library manager with semantic search, AI generation, and pro audio tools.

## Download

Grab the latest build for your platform from [Releases](../../releases):

| Platform | Download |
|----------|----------|
| Linux x86_64 | `smart-sound-vault-v*-*-x86_64-unknown-linux-gnu.tar.gz` |
| Windows x86_64 | `smart-sound-vault-v*-*-x86_64-pc-windows-msvc.zip` |
| macOS (Apple Silicon) | `smart-sound-vault-v*-arm64.dmg` |

## Install

**Linux** — extract and run:
```bash
tar xzf smart-sound-vault-v*-x86_64-unknown-linux-gnu.tar.gz
./smart-sound-vault
```

**Windows** — unzip, double-click `smart-sound-vault.exe`.

**macOS** — open the `.dmg`, drag `Smart Sound Vault` into `Applications`.

> First launch may show "damaged, can't be opened". This is macOS blocking an
> unsigned app — the file is fine. Run this in Terminal, then launch again:
> ```bash
> xattr -cr "/Applications/Smart Sound Vault.app"
> ```
>

## Auto-update

In the **About** window, click **Check for Updates**. The app downloads the new version, backs up the previous one, and restarts. If a new version misbehaves, use **Restore Previous Version**.

## Notes

- First launch downloads AI models (~600 MB) for semantic search — a prompt guides you through it.
- DeepSeek (translation) and ElevenLabs (generation) API keys are optional, set in Settings.

---

*Closed-source project. This repository hosts release binaries only.*
