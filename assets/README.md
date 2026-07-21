# Smart Sound Vault 落地页 — 维护与部署手册

纯静态网站，无任何构建步骤。整包上传服务器即可用。

```
landing/
├── index.html        # 完整页面（所有板块）
├── styles.css        # 全部样式（CSS 变量定义主题色，见文件顶部 :root）
├── script.js         # 语言切换 / Canvas 频谱动画 / 滚动动画 / 汉堡菜单
└── assets/
    ├── logo.svg      # 音波 + 盾牌 Logo
    └── README.md     # 本文件
```

---

## 一、截图占位清单

功能板块的 9 张截图已**全部集中到搜索模式大卡底部的轮播**中（`.shot-carousel`），
每张 slide 里是一个占位 div，用户 hover/点击功能卡或用箭头、圆点切换。
替换方式：**把 slide 里的占位 div 换成 `<img>`**（样式已内置，会自动裁切填满）：

```html
<!-- 替换前（index.html → #shot-track 内对应的 slide） -->
<div class="screenshot-placeholder" data-shot="ai-translate">…</div>

<!-- 替换后（推荐：直接换成 img，保留同款 class 保持圆角与填满） -->
<img class="screenshot-placeholder" src="assets/shots/ai-translate.webp" alt="AI 翻译桥界面截图" loading="lazy" />
```

建议把截图放到 `assets/shots/` 目录，优先用 WebP（比 PNG 小 60%+）。

| # | `data-shot` | 轮播顺序 | 建议截图内容 | 推荐尺寸 |
|---|-------------|----------|--------------|----------|
| 1 | `search-modes` | 第 1 张（默认显示） | 混合搜索界面，中文查询词 + 结果列表 | 1600×1000 (16:10) |
| 2 | `ai-translate` | 第 2 张（hover「AI 翻译桥」卡触发） | 翻译桥面板，展示思考过程展开态 | 1600×1000 |
| 3 | `ai-generate` | 第 3 张 | ElevenLabs 生成面板 + 生成结果 | 1600×1000 |
| 4 | `waveform` | 第 4 张 | 波形选区 + 频谱图界面 | 1600×1000 |
| 5 | `eq` | 第 5 张 | EQ 调节界面（三条频段曲线） | 1600×1000 |
| 6 | `library` | 第 6 张 | 音效列表 + 标签栏 + 批量操作 | 1600×1000 |
| 7 | `gpu-privacy` | 第 7 张 | 设置页 GPU 加速与模型源选项 | 1600×1000 |
| 8 | `theme` | 第 8 张 | 主题/调色板设置界面 | 1600×1000 |
| 9 | `cross-platform` | 第 9 张 | 更新提示弹窗或三平台界面拼图 | 1600×1000 |
| 10 | `qr-bilibili` | 赞助卡 · 二维码（不在轮播内） | B 站主页二维码（方形，见下节） | 400×400 (1:1) |

> 小提示：只替换部分截图也可以，未替换的 slide 会继续显示占位框，轮播照常工作。

> 截图建议用软件暗色主题截取，与页面风格统一；Retina 屏直接截即为 2x 清晰度。

## 二、二维码 / 占位链接替换

1. **B 站二维码**：目前 `data-shot="qr-bilibili"` 是图形占位。换成：
   ```html
   <img class="screenshot-placeholder qr-placeholder" src="assets/qr-bilibili.png" alt="B 站主页二维码" />
   ```
2. **Ko-fi 链接**：当前是占位 `https://ko-fi.com/zzxxh`，上线前请核对（在 `index.html` 搜 `ko-fi.com`）。
3. **联系邮箱**：页脚 `zzxxh@example.com` 是占位（搜 `mailto:` 替换）。
4. **版本号**：发布新版时全局搜索 `v0.1.3` 替换（index.html 共 4 处 + script.js 字典 2 处）。

## 三、Slogan 候选（已选第 1 组，可在字典里替换）

| # | 中文 | English |
|---|------|---------|
| 1 ✅ | 用 AI 重新定义音效搜索 | Find any sound. Describe it, not name it. |
| 2 | 为独立游戏开发者打造的智能音效库 | The AI-powered sound library for indie game developers |
| 3 | 描述声音，而不是背诵文件名 | Search sounds by describing them — not by filename |

替换位置：`script.js` 中 `I18N.zh["hero.title"]` / `I18N.en["hero.title"]`。

## 四、部署到阿里云 ECS + nginx

### 1. 上传文件

```bash
# 本地执行：整包上传到服务器
scp -r landing/ root@<服务器IP>:/var/www/smart-sound-vault

# 或用 rsync（后续更新更快）
rsync -avz --delete landing/ root@<服务器IP>:/var/www/smart-sound-vault/
```

### 2. 安装 nginx（Alibaba Cloud Linux 用 dnf，Ubuntu 用 apt）

```bash
# Alibaba Cloud Linux
sudo dnf install -y nginx
sudo systemctl enable --now nginx

# Ubuntu
sudo apt update && sudo apt install -y nginx
sudo systemctl enable --now nginx

# 安全组：阿里云控制台 → ECS 安全组 → 放行 80 / 443 端口
sudo firewall-cmd --permanent --add-service=http --add-service=https && sudo firewall-cmd --reload
```

### 3. nginx 配置

新建 `/etc/nginx/conf.d/smart-sound-vault.conf`：

```nginx
# HTTP → HTTPS 跳转
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$host$request_uri;
}

# HTTPS 主站
server {
    listen 443 ssl;
    http2 on;
    server_name your-domain.com www.your-domain.com;

    # ── SSL 证书（certbot 申请后路径如下；用阿里云证书则换成下载的 .pem/.key）
    ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;

    root  /var/www/smart-sound-vault;
    index index.html;

    # ── gzip 压缩
    gzip            on;
    gzip_vary       on;
    gzip_min_length 1k;
    gzip_comp_level 6;
    gzip_types      text/plain text/css application/javascript application/json
                    image/svg+xml font/woff2;

    # ── index.html 不缓存（保证发版即时生效）
    location = /index.html {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # ── 静态资源长缓存（CSS/JS/图片，改文件名即可强制刷新）
    location ~* \.(css|js|svg|png|jpg|jpeg|webp|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

检查并重载：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 4. 申请 HTTPS 证书

```bash
# 方式 A：certbot（Let's Encrypt，免费自动续期）
sudo dnf install -y certbot python3-certbot-nginx   # Ubuntu: sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo certbot renew --dry-run   # 验证自动续期

# 方式 B：阿里云免费 DV 证书
# 控制台 → SSL 证书 → 免费证书 → 申请后下载 nginx 格式，
# 把 .pem / .key 上传到 /etc/nginx/ssl/ 并修改上面配置中的路径
```

### ⚠️ 重要提醒：ICP 备案

**中国大陆地域的 ECS 绑定域名前，必须先在阿里云完成 ICP 备案**（控制台 → 备案系统），
否则 80/443 端口会被拦截、域名无法访问。备案通常需 3–20 个工作日。
在备案完成前，可先用服务器 IP + 非常用端口临时预览，或将站点部署到境外/香港地域 ECS。

---

## 五、自查清单

- [x] 双击 `index.html` 即可离线打开（字体走 CDN，加载失败自动回退系统字体）
- [x] 中/EN 切换无残留文案（全部文案集中在 `script.js` 的 `I18N` 字典）
- [x] 断点：>960px 桌面 / ≤960px 平板 / ≤640px 手机（汉堡菜单）
- [x] 所有下载按钮 → `https://github.com/silencenoob/smart-sound-vault/releases`
- [x] Canvas 动画：DPR ≤1.5、40fps 限帧、滚出视口/切后台自动暂停、`prefers-reduced-motion` 静态化
- [x] 图标全部内联 SVG，无外部图标库依赖
