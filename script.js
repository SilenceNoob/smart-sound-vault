/* ═══════════════════════════════════════════════════════════
   Smart Sound Vault — Landing Page Scripts
   ① 中英双语切换（data-i18n + 字典）
   ② Hero Canvas 频谱动画（低开销）
   ③ 滚动入场动画（IntersectionObserver）
   ④ 平滑锚点滚动（CSS scroll-behavior + 折叠菜单关闭）
   ⑤ 移动端汉堡菜单
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ─────────────────────────────────────────
     1. i18n 字典
     注意：值为受信任的自有文案，applyLang 用 innerHTML 写入，
     因此可在文案里包含 <br> 等简单标签。
  ───────────────────────────────────────── */
  const I18N = {
    zh: {
      "meta.title": "Smart Sound Vault — 为独立游戏开发者打造的智能音效库",
      "nav.features": "功能",
      "nav.download": "下载",
      "nav.sponsor": "赞助",
      "nav.cta": "下载",

      "hero.badge": "v0.1.3 · 永久免费 · 开源",
      "hero.title": "用 AI 重新定义音效搜索",
      "hero.sub": "为独立游戏开发者打造的智能音效库：用自然语言描述就能找到“听起来像”的音效，<br class=\"desktop-br\" />还能用 AI 直接生成全新音效。专业编辑、GPU 加速、数据全在本地 —— 永久免费。",
      "hero.cta1": "立即下载",
      "hero.cta2": "查看 GitHub",
      "hero.b1": "3 种搜索模式",
      "hero.b2": "跨 3 大平台",
      "hero.b3": "100% 本地 &amp; 免费",
      "hero.b4": "GPU 加速",

      "features.eyebrow": "核心功能",
      "features.title": "一个工具，管整个音效工作流",
      "features.desc": "从“找到声音”到“调出想要的声音”，Smart Sound Vault 覆盖独立开发者的完整音效链路。",

      "f.search.title": "三种搜索模式，想找就能找到",
      "f.search.desc": "关键词搜索基于 SQLite FTS5 全文检索与 BM25 排序；语义搜索用 CLAP 模型理解“雨打铁皮屋顶”这样的自然语言描述；混合搜索以 RRF 算法融合两者 —— 精准与联想，我全都要。",
      "f.search.m1": "FTS5 全文检索 · BM25 排序",
      "f.search.m2": "CLAP 语义理解 · 描述即搜索",
      "f.search.m3": "RRF 融合 · 精准 + 联想",
      "f.search.r1": "rain_on_metal_roof_01.wav",
      "f.search.r2": "heavy_rain_tin_shelter.wav",
      "f.search.r3": "storm_roof_ambience_loop.wav",

      "f.translate.title": "AI 翻译桥",
      "f.translate.desc": "用任意语言输入搜索词，DeepSeek 自动翻译成英文关键词再检索；可展开查看 LLM 的思考过程，内置 LRU 缓存让重复查询秒回。",
      "f.generate.title": "AI 音效生成",
      "f.generate.desc": "接入 ElevenLabs，用自然语言描述直接生成全新音效 —— “适合电影预告片大场面的宏大轰鸣声”。支持任意语言输入、自动时长、无缝循环，生成即入库并打上 AI 标签。",
      "f.wave.title": "波形 + 频谱可视化",
      "f.wave.desc": "专业级波形查看器，框选任意区段即可导出 WAV；频谱图让频率结构一目了然。",
      "f.eq.title": "EQ 均衡器 + 响度归一化",
      "f.eq.desc": "参数化 EQ（Peaking / Low Shelf / High Shelf）、响度归一化（Auto / Manual 目标 dBFS），外加变速、保持音高、交叉淡化、淡入淡出等完整播放控制。",
      "f.library.title": "智能音库管理",
      "f.library.desc": "文件夹监控自动增量索引，新增修改即时入库；灵活标签系统、批量打标 / 删除 / 导出；基于 lofty 自动提取 title / artist / album / genre 元数据。",
      "f.gpu.title": "GPU 加速 &amp; 本地隐私",
      "f.gpu.desc": "CUDA / DirectML / CoreML 加速 ONNX 推理，无 GPU 自动回退 CPU，崩溃自动降级。模型可从 HuggingFace 或 ModelScope 下载，所有数据存本地 SQLite，绝不上传。",
      "f.theme.title": "精致的可定制外观",
      "f.theme.desc": "跟随系统 / 暗色 / 亮色 / 自定义调色板，面板背景、控件、强调色等十几项可调；还能设置自定义背景图片、模糊度与不透明度。",
      "f.cross.title": "跨平台 + 自更新",
      "f.cross.desc": "Rust + egui 构建的原生应用，Windows / Linux / macOS 全平台支持；内置从 GitHub Releases 自动检查并更新，永远用最新版。",

      "dl.eyebrow": "下载",
      "dl.title": "全平台原生支持",
      "dl.desc": "选择你的平台，从 GitHub Releases 获取最新版本。",
      "dl.win": "Windows 10 / 11 · 支持 CUDA 与 DirectML 加速",
      "dl.linux": "主流发行版 · 支持 CUDA 加速",
      "dl.mac": "macOS · 支持 CoreML 加速",
      "dl.btn": "下载 v0.1.3",
      "dl.meta": "当前版本 v0.1.3 · 永久免费 · 数据全部存储在本地",
      "dl.changelog": "查看更新日志",

      "sp.eyebrow": "定价与赞助",
      "sp.title": "永久免费，真心实意",
      "sp.free": "永久免费",
      "sp.freeSub": "Free Forever",
      "sp.f1": "开源透明，代码可查",
      "sp.f2": "无订阅、无广告、无内购",
      "sp.f3": "无功能阉割，更新永远免费",
      "sp.f4": "数据全在本地，隐私无忧",
      "sp.coffee": "请作者喝杯咖啡",
      "sp.coffeeDesc": "如果这个工具对你有帮助，欢迎支持项目的持续开发。完全自愿，不赞助也能用全部功能。",
      "sp.bili": "B 站支持",
      "sp.qr": "二维码占位",

      "footer.tagline": "为独立游戏开发者打造的智能音效库。",
      "footer.links": "快速链接",
      "footer.releases": "Releases 下载",
      "footer.email": "联系作者",
      "footer.settings": "偏好设置",
      "footer.hint": "软件内支持明暗主题与自定义调色板",

      "demo.query": "雨打铁皮屋顶",

      "tab.0": "搜索",
      "tab.1": "翻译桥",
      "tab.2": "音效生成",
      "tab.3": "波形频谱",
      "tab.4": "EQ 响度",
      "tab.5": "音库管理",
      "tab.6": "GPU·隐私",
      "tab.7": "外观主题",
      "tab.8": "跨平台"
    },

    en: {
      "meta.title": "Smart Sound Vault — The AI Sound Library for Indie Game Devs",
      "nav.features": "Features",
      "nav.download": "Download",
      "nav.sponsor": "Sponsor",
      "nav.cta": "Download",

      "hero.badge": "v0.1.3 · Free Forever · Open Source",
      "hero.title": "Find any sound. Describe it, not name it.",
      "hero.sub": "The AI-powered sound library for indie game developers.<br class=\"desktop-br\" />Semantic search, AI sound generation, pro-grade editing — 100% local, free forever.",
      "hero.cta1": "Download Now",
      "hero.cta2": "View on GitHub",
      "hero.b1": "3 Search Modes",
      "hero.b2": "3 Platforms",
      "hero.b3": "100% Local &amp; Free",
      "hero.b4": "GPU Accelerated",

      "features.eyebrow": "Features",
      "features.title": "One tool for your entire sound workflow",
      "features.desc": "From finding the sound to shaping it — Smart Sound Vault covers the full audio pipeline for indie developers.",

      "f.search.title": "Three search modes. Always findable.",
      "f.search.desc": "Keyword search runs on SQLite FTS5 with BM25 ranking; semantic search uses a CLAP model to understand natural-language descriptions like “rain on a tin roof”; hybrid search fuses both with RRF — precision and serendipity, together.",
      "f.search.m1": "FTS5 full-text · BM25 ranking",
      "f.search.m2": "CLAP semantics · describe to search",
      "f.search.m3": "RRF fusion · precision + recall",
      "f.search.r1": "rain_on_metal_roof_01.wav",
      "f.search.r2": "heavy_rain_tin_shelter.wav",
      "f.search.r3": "storm_roof_ambience_loop.wav",

      "f.translate.title": "AI Translate Bridge",
      "f.translate.desc": "Type your query in any language — DeepSeek translates it into English keywords before searching. Inspect the LLM's reasoning chain, and enjoy instant repeats thanks to the built-in LRU cache.",
      "f.generate.title": "AI Sound Generation",
      "f.generate.desc": "Powered by ElevenLabs: describe a brand-new sound in natural language — “an epic cinematic trailer boom”. Any language, automatic duration, seamless loops, auto-imported with an AI tag.",
      "f.wave.title": "Waveform + Spectrogram",
      "f.wave.desc": "A pro waveform viewer: select any region and export it as WAV. The spectrogram lays frequency structure bare.",
      "f.eq.title": "EQ + Loudness Normalization",
      "f.eq.desc": "Parametric EQ (Peaking / Low Shelf / High Shelf), loudness normalization (Auto / Manual target dBFS), plus full playback control: speed, pitch preservation, crossfade, fade in/out.",
      "f.library.title": "Smart Library Management",
      "f.library.desc": "Folder watching with automatic incremental indexing; a flexible tag system with batch tag / delete / export; metadata auto-extraction via lofty (title / artist / album / genre).",
      "f.gpu.title": "GPU Acceleration &amp; Local Privacy",
      "f.gpu.desc": "CUDA / DirectML / CoreML accelerate ONNX inference, with automatic CPU fallback and crash-safe degradation. Models download from HuggingFace or ModelScope. Everything stays in local SQLite — nothing is uploaded.",
      "f.theme.title": "Beautiful, Customizable UI",
      "f.theme.desc": "Follow system / dark / light / fully custom palettes — tune a dozen colors from panels to accents. Add a custom background image with blur and opacity control.",
      "f.cross.title": "Cross-platform + Self-update",
      "f.cross.desc": "A native app built with Rust + egui for Windows / Linux / macOS, with built-in update checks straight from GitHub Releases.",

      "dl.eyebrow": "Download",
      "dl.title": "Native on every platform",
      "dl.desc": "Pick your platform and grab the latest build from GitHub Releases.",
      "dl.win": "Windows 10 / 11 · CUDA &amp; DirectML",
      "dl.linux": "Major distros · CUDA support",
      "dl.mac": "macOS · CoreML acceleration",
      "dl.btn": "Download v0.1.3",
      "dl.meta": "v0.1.3 · Free forever · All data stays local",
      "dl.changelog": "View changelog",

      "sp.eyebrow": "Pricing &amp; Sponsorship",
      "sp.title": "Free forever. For real.",
      "sp.free": "Free Forever",
      "sp.freeSub": "No subscription. No ads. No catch.",
      "sp.f1": "Open source, fully auditable",
      "sp.f2": "No subscriptions, ads, or IAP",
      "sp.f3": "No feature locks — updates stay free",
      "sp.f4": "Local-first data, total privacy",
      "sp.coffee": "Buy the author a coffee",
      "sp.coffeeDesc": "If this tool helps you, consider supporting continued development. Entirely optional — every feature works either way.",
      "sp.bili": "Support on Bilibili",
      "sp.qr": "QR placeholder",

      "footer.tagline": "The AI sound library for indie game developers.",
      "footer.links": "Quick Links",
      "footer.releases": "Releases",
      "footer.email": "Contact",
      "footer.settings": "Preferences",
      "footer.hint": "In-app dark/light themes &amp; custom palettes",

      "demo.query": "rain on a tin roof",

      "tab.0": "Search",
      "tab.1": "Translate",
      "tab.2": "Generate",
      "tab.3": "Waveform",
      "tab.4": "EQ",
      "tab.5": "Library",
      "tab.6": "GPU·Privacy",
      "tab.7": "Theme",
      "tab.8": "Platform"
    }
  };

  const STORAGE_KEY = "ssv-lang";

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
    return (navigator.language || "en").toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  let currentLang = detectLang();

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    const dict = I18N[lang];

    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = dict["meta.title"];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    // 切换按钮高亮当前语言
    document.querySelectorAll(".lang-toggle .lang-opt").forEach(function (opt) {
      opt.classList.toggle("active", opt.getAttribute("data-lang") === lang);
    });

    // 搜索演示动画的文案也要跟着切换
    restartSearchDemo();
    updateShotCaption();
  }

  ["lang-toggle", "lang-toggle-footer"].forEach(function (id) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", function () {
        applyLang(currentLang === "zh" ? "en" : "zh");
      });
    }
  });

  /* ─────────────────────────────────────────
     2. Hero Canvas 频谱动画
     低开销策略：
       - DPR 上限 1.5（高分屏不渲染多余像素）
       - 帧率上限 ~40fps
       - 标签页隐藏 / Hero 滚出视口时暂停
       - prefers-reduced-motion 时只画一帧静态画面
  ───────────────────────────────────────── */
  const canvas = document.getElementById("wave-canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const FRAME_INTERVAL = 1000 / 40; // 40fps 上限
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, running = true, inView = true, lastFrame = 0, rafId = null;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = Math.floor(rect.width * DPR);
      H = Math.floor(rect.height * DPR);
      canvas.width = W;
      canvas.height = H;
      if (reduceMotion) drawFrame(0); // 静态画面
    }

    function drawFrame(t) {
      ctx.clearRect(0, 0, W, H);

      const barCount = Math.max(36, Math.min(110, Math.floor(W / (14 * DPR))));
      const gap = 3 * DPR;
      const barW = (W - gap * (barCount - 1)) / barCount;
      const baseY = H;              // 从画布底部生长，只做底部氛围带
      const maxH = H * 0.28;

      // 青绿 → 紫 渐变
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
      grad.addColorStop(1, "rgba(74, 222, 128, 0.75)");
      ctx.fillStyle = grad;

      for (let i = 0; i < barCount; i++) {
        // 多组正弦叠加 → 平滑的伪随机律动
        const n =
          Math.sin(t * 0.0012 + i * 0.35) * 0.45 +
          Math.sin(t * 0.0021 + i * 0.11) * 0.35 +
          Math.sin(t * 0.0007 + i * 0.62) * 0.20;
        const h = Math.max(2 * DPR, (0.15 + 0.85 * Math.abs(n)) * maxH);
        const x = i * (barW + gap);
        const y = baseY - h;

        // 顶部衰减：越高的柱子越透明，避免压住文字
        ctx.globalAlpha = 0.75 * (1 - (h / maxH) * 0.55);
        roundRect(ctx, x, y, barW, h, barW / 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function roundRect(c, x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }

    function loop(t) {
      rafId = requestAnimationFrame(loop);
      if (!running || !inView) return;
      if (t - lastFrame < FRAME_INTERVAL) return; // 限帧
      lastFrame = t;
      drawFrame(t);
    }

    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
    });

    // Hero 滚出视口即暂停绘制
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(canvas);

    window.addEventListener("resize", resize);
    resize();
    if (!reduceMotion) rafId = requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────────
     3. 滚动入场动画（IntersectionObserver）
  ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".reveal");
  // 同组元素依次淡入：给同一父容器内的 reveal 加递增延迟
  const groups = new Map();
  revealEls.forEach(function (el) {
    const parent = el.parentElement;
    const idx = (groups.get(parent) || 0);
    el.style.setProperty("--reveal-delay", Math.min(idx * 0.08, 0.4) + "s");
    groups.set(parent, idx + 1);
  });

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ─────────────────────────────────────────
     4. 平滑滚动 + 移动端菜单联动
     （CSS 已开 scroll-behavior: smooth 与 scroll-padding-top，
        这里只需在点击锚点后收起移动端菜单）
  ───────────────────────────────────────── */
  const navLinks = document.getElementById("nav-links");
  const hamburger = document.getElementById("hamburger");

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () {
      closeMenu();
    });
  });

  /* ─────────────────────────────────────────
     5. 移动端汉堡菜单
  ───────────────────────────────────────── */
  function closeMenu() {
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }
  hamburger.addEventListener("click", function () {
    const open = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(open));
  });
  // Esc 关闭菜单
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ─────────────────────────────────────────
     6. 搜索演示小动画：打字 → 出结果 → 循环
  ───────────────────────────────────────── */
  const demoInput = document.getElementById("demo-input");
  const demoResults = document.querySelectorAll("#demo-results li");
  let demoTimer = null;

  function restartSearchDemo() {
    if (!demoInput) return;
    if (demoTimer) clearTimeout(demoTimer);
    demoInput.textContent = "";
    demoResults.forEach(function (li) { li.classList.remove("show"); });

    const query = I18N[currentLang]["demo.query"];
    let i = 0;

    function typeNext() {
      if (i <= query.length) {
        demoInput.textContent = query.slice(0, i);
        i++;
        demoTimer = setTimeout(typeNext, 90);
      } else {
        // 打完后依次弹出结果
        demoResults.forEach(function (li, idx) {
          setTimeout(function () { li.classList.add("show"); }, 350 * (idx + 1));
        });
        // 停留 3.5s 后循环
        demoTimer = setTimeout(restartSearchDemo, 350 * demoResults.length + 3500);
      }
    }
    typeNext();
  }

  /* ─────────────────────────────────────────
     7. 截图轮播
     - 自动播放（5s），hover/聚焦轮播区时暂停
     - 箭头 / 圆点切换
     - hover、点击或键盘聚焦功能卡时切到对应截图
  ───────────────────────────────────────── */
  // 与 HTML 中 .shot-slide 的顺序一一对应；label 复用功能卡标题的 i18n key
  const SHOTS = [
    { label: "f.search.title" },
    { label: "f.translate.title" },
    { label: "f.generate.title" },
    { label: "f.wave.title" },
    { label: "f.eq.title" },
    { label: "f.library.title" },
    { label: "f.gpu.title" },
    { label: "f.theme.title" },
    { label: "f.cross.title" }
  ];

  const carousel = document.getElementById("shot-carousel");
  const track = document.getElementById("shot-track");
  const dotsBox = document.getElementById("shot-dots");
  const caption = document.getElementById("shot-caption");
  const slides = track ? Array.from(track.querySelectorAll(".shot-slide")) : [];
  let shotIndex = 0;
  let shotTimer = null;
  let shotPaused = false;

  function updateShotCaption() {
    if (!caption || !SHOTS.length) return;
    caption.innerHTML = "<b>" + String(shotIndex + 1).padStart(2, "0") +
      " / " + String(SHOTS.length).padStart(2, "0") + "</b>";
  }

  function goToShot(i) {
    if (!slides.length) return;
    shotIndex = (i + slides.length) % slides.length;
    slides.forEach(function (s, idx) { s.classList.toggle("active", idx === shotIndex); });
    if (dotsBox) {
      Array.from(dotsBox.children).forEach(function (d, idx) {
        d.classList.toggle("active", idx === shotIndex);
      });
    }
    // 联动功能标签高亮
    document.querySelectorAll(".shot-tab").forEach(function (tab) {
      tab.classList.toggle("active", parseInt(tab.getAttribute("data-slide"), 10) === shotIndex);
    });
    updateShotCaption();
  }

  function startShotAutoplay() {
    if (reduceMotionQuery.matches) return; // 减少动态时不自动播放
    stopShotAutoplay();
    shotTimer = setInterval(function () {
      if (!shotPaused && !document.hidden) goToShot(shotIndex + 1);
    }, 5000);
  }
  function stopShotAutoplay() {
    if (shotTimer) { clearInterval(shotTimer); shotTimer = null; }
  }

  if (carousel && slides.length) {
    // 圆点
    SHOTS.forEach(function (_, i) {
      const dot = document.createElement("button");
      dot.className = "shot-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Screenshot " + (i + 1));
      dot.addEventListener("click", function () { goToShot(i); startShotAutoplay(); });
      dotsBox.appendChild(dot);
    });

    document.getElementById("shot-prev").addEventListener("click", function () {
      goToShot(shotIndex - 1); startShotAutoplay();
    });
    document.getElementById("shot-next").addEventListener("click", function () {
      goToShot(shotIndex + 1); startShotAutoplay();
    });

    // hover / 聚焦轮播区时暂停自动播放
    carousel.addEventListener("mouseenter", function () { shotPaused = true; });
    carousel.addEventListener("mouseleave", function () { shotPaused = false; });
    carousel.addEventListener("focusin", function () { shotPaused = true; });
    carousel.addEventListener("focusout", function () { shotPaused = false; });

    // 功能标签点击切换（hover 也跟随，方便浏览）
    document.querySelectorAll(".shot-tab").forEach(function (tab) {
      const idx = parseInt(tab.getAttribute("data-slide"), 10);
      tab.addEventListener("click", function () { goToShot(idx); startShotAutoplay(); });
      tab.addEventListener("mouseenter", function () { goToShot(idx); });
    });

    goToShot(0);
    startShotAutoplay();
  }

  /* ─────────────────────────────────────────
     初始化
  ───────────────────────────────────────── */
  applyLang(currentLang); // 会顺带启动搜索演示动画与轮播标题
})();
