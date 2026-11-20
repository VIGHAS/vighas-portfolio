/* =========================================================
   Vighas K S — Portfolio engine
   Shared layout, theme, animations and per-page renderers.
   ========================================================= */
(function () {
  "use strict";

  // Site content, loaded from /content/*.json (edited via /admin)
  let D;
  let S = {}; // content/site.json: menu, footer, labels, theme
  let T = {}; // content/pages/<page>.json: this page's fixed text
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = document.body.dataset.page || "home";

  /* ---------- Icons (Lucide-style, stroke based) ---------- */
  const ICONS = {
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    trending: '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowUp: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    grad: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    server: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
    git: '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'
  };
  const icon = (name, cls = "") =>
    `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Emphasise numbers / metrics inside resume sentences
  const escText = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const emphasise = (s) => escText(s).replace(/(~?\d+(?:\.\d+)*\+?%?|CVE-\d{4}-\d+)/g, "<strong>$1</strong>");
  // Official badge image with a CSS hexagon fallback if the image is missing
  const certBadge = (c) => `
    <div class="badge-media${c.badge ? "" : " no-img"}">
      ${c.badge ? `<img src="${esc(c.badge)}" alt="${esc(c.name)} badge" loading="lazy">` : ""}
      <div class="badge ${esc(c.color)}">${esc(c.code)}<small>${esc(c.issuer.split(" ")[0])}</small></div>
    </div>`;
  const wireBadges = (root) => {
    $$(".badge-media img", root).forEach((img) => {
      const fail = () => img.parentElement.classList.add("no-img");
      img.addEventListener("error", fail);
      if (img.complete && img.naturalWidth === 0) fail();
    });
  };
  // Editable text: page file first, then site file, then the given fallback
  const pick = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
  const tx = (path, fallback = "") => {
    const v = pick(T, path) ?? pick(S, path);
    return typeof v === "string" && v.trim() !== "" ? v : fallback;
  };
  // **bold** and *gradient* markup for headings and paragraphs
  const rich = (s) => escText(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, '<span class="grad-text">$1</span>');
  const initials = (name) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  /* ---------- Navigation config ---------- */
  const NAV = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "about", label: "About", href: "about.html" },
    { id: "experience", label: "Experience", href: "experience.html" },
    { id: "skills", label: "Skills", href: "skills.html" },
    { id: "certifications", label: "Certifications", href: "certifications.html" },
    { id: "contact", label: "Contact", href: "contact.html" }
  ];

  /* ---------- Theme ---------- */
  const storage = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    storage.set("theme", next);
  }

  /* ---------- Layout: header, footer, chrome ---------- */
  function renderChrome() {
    const p = D.profile;
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <nav class="nav container" aria-label="Main">
        <a href="index.html" class="logo" aria-label="${esc(p.name)} home">
          <span class="logo-mark">${initials(p.name)}</span>
          <span>${esc(p.name)}<small>${esc(tx("header.logoTagline", "~/devsecops"))}</small></span>
        </a>
        <ul class="nav-links" id="nav-links">
          ${NAV.map((n) => `<li><a href="${n.href}" class="${n.id === page ? "active" : ""}" ${n.id === page ? 'aria-current="page"' : ""}>${esc(tx("nav." + n.id, n.label))}</a></li>`).join("")}
        </ul>
        <div class="nav-actions">
          <button class="icon-btn theme-toggle" id="theme-toggle" aria-label="Toggle colour theme">${icon("moon", "moon")}${icon("sun", "sun")}</button>
          <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">${icon("menu", "bars")}${icon("x", "x")}</button>
        </div>
      </nav>`;
    document.body.prepend(header);

    const chrome = document.createElement("div");
    chrome.innerHTML = `
      <div class="progress" id="progress"></div>
      <div class="bg-glow"></div><div class="bg-grid"></div>
      <canvas id="bg-canvas" aria-hidden="true"></canvas>`;
    document.body.prepend(...chrome.children);

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <a href="index.html" class="logo"><span class="logo-mark">${initials(p.name)}</span><span>${esc(p.name)}<small>${esc(p.role)}</small></span></a>
            <p>${rich(tx("footer.tagline", `Building secure, automated and cost-efficient cloud platforms on ${p.specialty}.`))}</p>
          </div>
          <div>
            <h4>${esc(tx("footer.pagesHeading", "Pages"))}</h4>
            <ul>${NAV.map((n) => `<li><a href="${n.href}">${esc(tx("nav." + n.id, n.label))}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h4>${esc(tx("footer.connectHeading", "Connect"))}</h4>
            <ul>
              <li><a href="mailto:${esc(p.email)}">${esc(tx("footer.emailLink", "Email"))}</a></li>
              <li><a href="${esc(p.linkedin)}" target="_blank" rel="noopener">${esc(tx("footer.linkedinLink", "LinkedIn"))}</a></li>
              <li><a href="${esc(p.resume)}" target="_blank" rel="noopener">${esc(tx("footer.resumeLink", "Resume (PDF)"))}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${esc(p.name)}. ${esc(tx("footer.copyright", "All rights reserved."))}</span>
          <span>${esc(tx("footer.signature", "terraform apply --auto-approve ✓"))}</span>
        </div>
      </div>`;
    document.body.append(footer);

    const top = document.createElement("button");
    top.className = "icon-btn to-top";
    top.id = "to-top";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = icon("arrowUp");
    document.body.append(top);

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.id = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);

    // Events
    $("#theme-toggle").addEventListener("click", toggleTheme);
    const menuBtn = $("#menu-toggle");
    const links = $("#nav-links");
    menuBtn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      menuBtn.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    const progress = $("#progress");
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      header.classList.toggle("scrolled", y > 10);
      top.classList.toggle("show", y > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  let toastTimer;
  function showToast(msg, type = "ok") {
    const t = $("#toast");
    t.className = "toast" + (type === "error" ? " error" : "");
    t.innerHTML = icon(type === "error" ? "alert" : "check") + `<span>${esc(msg)}</span>`;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  /* ---------- Theme colours (content/site.json) ---------- */
  const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
  const hexToRGB = (hex) => {
    const h = hex.length === 4 ? hex.replace(/[0-9a-f]/gi, (c) => c + c).slice(1) : hex.slice(1);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");
  };
  const canvasRGB = { dark: "34,211,238", light: "79,70,229" };
  function applyTheme() {
    const th = S.theme || {};
    const vars = (c = {}) => [["--primary", c.primary], ["--grad-mid", c.middle], ["--secondary", c.secondary], ["--accent", c.accent]]
      .filter(([, v]) => typeof v === "string" && HEX.test(v))
      .map(([k, v]) => `${k}:${v}`).join(";");
    const style = document.createElement("style");
    style.textContent = `:root{${vars(th.dark)}}:root[data-theme="light"]{${vars(th.light)}}`;
    document.head.append(style);
    if (th.dark && HEX.test(th.dark.primary || "")) canvasRGB.dark = hexToRGB(th.dark.primary);
    if (th.light && HEX.test(th.light.primary || "")) canvasRGB.light = hexToRGB(th.light.primary);
    // Default theme applies only until the visitor picks one with the toggle
    if ((th.defaultTheme === "dark" || th.defaultTheme === "light") && !storage.get("theme")) {
      document.documentElement.dataset.theme = th.defaultTheme;
    }
  }

  /* ---------- Fixed page text (content/pages/*.json) ---------- */
  function applyText() {
    $$("[data-t]").forEach((el) => {
      const v = tx(el.dataset.t);
      if (v) el.innerHTML = rich(v);
    });
    $$("[data-t-placeholder]").forEach((el) => {
      const v = tx(el.dataset.tPlaceholder);
      if (v) el.placeholder = v;
    });
    const title = tx("meta.title");
    if (title) document.title = title;
    const desc = tx("meta.description");
    const meta = document.querySelector('meta[name="description"]');
    if (desc && meta) meta.content = desc;
  }

  /* ---------- Animated network background ---------- */
  function initCanvas() {
    const canvas = $("#bg-canvas");
    if (!canvas || reduceMotion || (S.theme && S.theme.animatedBackground === false)) return;
    const ctx = canvas.getContext("2d");
    let w, h, nodes, raf;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(80, Math.floor((w * h) / 22000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const light = document.documentElement.dataset.theme === "light";
      const rgb = light ? canvasRGB.light : canvasRGB.dark;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = dx * dx + dy * dy;
          if (dist < 17000) {
            ctx.strokeStyle = `rgba(${rgb},${0.14 * (1 - dist / 17000)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
        const md = mdx * mdx + mdy * mdy;
        if (md < 30000) {
          ctx.strokeStyle = `rgba(${rgb},${0.35 * (1 - md / 30000)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = `rgba(${rgb},0.6)`;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize(); draw();
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf); else draw();
    });
  }

  /* ---------- Reveal on scroll + counters ---------- */
  function initReveal() {
    const els = $$(".reveal, .reveal-left, [data-count], .pipeline, .ring");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => { el.classList.add("in"); if (el.dataset.count) countUp(el); if (el.classList.contains("ring")) fillRing(el); });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("in");
        if (el.dataset.count) countUp(el);
        if (el.classList.contains("ring")) fillRing(el);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  }

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
    const dur = 1600, start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function fillRing(el) {
    const bar = $(".bar", el);
    const len = 2 * Math.PI * 52;
    const pct = parseFloat(el.dataset.value) / parseFloat(el.dataset.max);
    bar.style.strokeDashoffset = String(len * (1 - pct));
  }

  /* ---------- Card spotlight ---------- */
  function initSpotlight() {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    }, { passive: true });
  }

  /* ---------- Page transitions ---------- */
  function initTransitions() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a || reduceMotion) return;
      const href = a.getAttribute("href");
      if (!href || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (/^(https?:|mailto:|tel:|#)/.test(href) || !/\.html(#.*)?$/.test(href)) return;
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname) return;
      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(() => { location.href = href; }, 220);
    });
    // Restore page if user navigates back via bfcache
    window.addEventListener("pageshow", (e) => { if (e.persisted) document.body.classList.remove("is-leaving"); });
  }

  /* ---------- Typing effect ---------- */
  function initTyping(el, words) {
    if (!el) return;
    if (reduceMotion) { el.textContent = words[0]; return; }
    let w = 0, c = 0, deleting = false;
    const tick = () => {
      const word = words[w];
      el.textContent = word.slice(0, c);
      if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1800); }
      if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
      c += deleting ? -1 : 1;
      setTimeout(tick, deleting ? 35 : 75);
    };
    tick();
  }

  /* ---------- Terminal animation ---------- */
  // *word* in a terminal line is shown in the highlight colour
  const termRich = (s) => escText(s).replace(/\*([^*]+)\*/g, '<span class="hl">$1</span>');
  const TERM_TYPES = ["cmd", "out", "ok", "warn"];
  function initTerminal(el) {
    if (!el) return;
    const prompt = tx("terminal.prompt", "vighas@azure:~$").replace(/["\\]/g, "");
    el.style.setProperty("--prompt", `"${prompt} "`);
    const lines = pick(T, "terminal.lines");
    const script = (Array.isArray(lines) ? lines : [])
      .filter((l) => l && typeof l.text === "string")
      .map((l) => [TERM_TYPES.includes(l.type) ? l.type : "out", l.text]);
    if (!script.length) return;
    if (reduceMotion) {
      el.innerHTML = script.map(([t, s]) => `<div class="ln ${t}">${termRich(s)}</div>`).join("");
      return;
    }
    let i = 0;
    const next = () => {
      if (i >= script.length) {
        setTimeout(() => { el.innerHTML = ""; i = 0; next(); }, 6000);
        return;
      }
      const [type, text] = script[i++];
      const line = document.createElement("div");
      line.className = "ln " + type;
      el.append(line);
      if (type === "cmd") {
        const plain = text.replace(/\*/g, "");
        let c = 0;
        const typeChar = () => {
          line.textContent = plain.slice(0, ++c);
          if (c < plain.length) setTimeout(typeChar, 38 + Math.random() * 40);
          else setTimeout(next, 380);
        };
        typeChar();
      } else {
        line.innerHTML = termRich(text);
        setTimeout(next, 520);
      }
    };
    setTimeout(next, 600);
  }

  /* ---------- Copy to clipboard ---------- */
  function initCopy() {
    document.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        showToast(tx("labels.copied", "Copied to clipboard"));
      } catch (err) {
        showToast(tx("labels.copyFailed", "Couldn't copy, please copy it manually"), "error");
      }
    });
  }

  /* =========================================================
     PAGE RENDERERS
     ========================================================= */
  const pages = {
    home() {
      const p = D.profile;
      $("#hero-name").textContent = p.firstName;
      $("#hero-summary").textContent = p.heroSummary || "";
      if (p.available === false) $("#status-pill").remove();
      $("#hero-resume").href = p.resume;
      $("#hero-socials").innerHTML = `
        <a class="icon-btn" href="mailto:${esc(p.email)}" aria-label="Email">${icon("mail")}</a>
        <a class="icon-btn" href="${esc(p.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon("linkedin")}</a>
        <a class="icon-btn" href="tel:${esc(p.phone.replace(/\s+/g, ""))}" aria-label="Phone">${icon("phone")}</a>`;
      initTyping($("#typed"), p.roles);

      // Profile photo: show the initials placeholder if the image is missing
      const photo = $("#hero-photo");
      photo.src = p.photo;
      photo.alt = `Photo of ${p.name}`;
      $("#avatar .avatar-fallback").textContent = initials(p.name);
      const noPhoto = () => $("#avatar").classList.add("no-photo");
      photo.addEventListener("error", noPhoto);
      if (photo.complete && photo.naturalWidth === 0) noPhoto();

      // Start the terminal only when it scrolls into view
      const term = $("#term-body");
      if ("IntersectionObserver" in window) {
        const tio = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) { tio.disconnect(); initTerminal(term); }
        }, { threshold: 0.3 });
        tio.observe(term);
      } else {
        initTerminal(term);
      }

      $("#stats").innerHTML = D.stats.map((s, i) => `
        <div class="stat reveal" style="--d:${i * 0.08}s">
          <div class="stat-value grad-text" data-count="${s.value}" data-prefix="${s.prefix || ""}" data-suffix="${s.suffix || ""}">0</div>
          <div class="stat-label">${esc(s.label)}</div>
        </div>`).join("");

      $("#home-certs").innerHTML = D.certifications.map((c, i) => `
        <article class="card lift home-cert reveal" style="--d:${i * 0.1}s">
          ${certBadge(c)}
          <div>
            <span class="chip">${icon("calendar")}${esc(c.date)}</span>
            <h3>${esc(c.name)}</h3>
            <p>${esc(c.issuer)}</p>
            <a class="verify-link" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(tx("labels.verifyCredential", "Verify credential"))} ${icon("external")}</a>
          </div>
        </article>`).join("");
      wireBadges($("#home-certs"));

      $("#pillars").innerHTML = D.pillars.map((x, i) => `
        <a href="experience.html#${x.id}" class="card lift pillar reveal" style="--d:${i * 0.07}s">
          <div class="card-icon">${icon(x.icon)}</div>
          <h3>${esc(x.title)}</h3>
          <p>${esc(x.text)}</p>
          <span class="more">${esc(tx("labels.explore", "Explore"))} ${icon("arrow")}</span>
        </a>`).join("");

      $("#highlights").innerHTML = D.highlights.map((h, i) => `
        <article class="card lift highlight reveal" style="--d:${(i % 3) * 0.08}s">
          <div class="hi-top"><div class="card-icon">${icon(h.icon)}</div><span class="metric">${esc(h.metric)}</span></div>
          <h3>${esc(h.title)}</h3>
          <p>${esc(h.text)}</p>
        </article>`).join("");

      const items = D.marquee.map((m) => `<span class="marquee-item">${esc(m)}</span>`).join("");
      $("#marquee").innerHTML = items + items.replace(/<span /g, '<span aria-hidden="true" ');
    },

    about() {
      const p = D.profile;
      $("#summary").innerHTML = `<p>${rich(D.summary)}</p>`;
      const facts = [
        ["user", tx("facts.name", "Name"), esc(p.name)],
        ["briefcase", tx("facts.role", "Role"), esc(p.role)],
        ["pin", tx("facts.location", "Based in"), esc(p.location)],
        ["cloud", tx("facts.focus", "Focus"), esc(`${p.specialty} · DevSecOps`)],
        ["mail", tx("facts.email", "Email"), `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`]
      ];
      $("#facts").innerHTML = facts.map(([ic, k, v]) => `<div class="fact">${icon(ic)}<span>${esc(k)}</span><b>${v}</b></div>`).join("");
      $("#about-resume").href = p.resume;

      $("#principles").innerHTML = D.principles.map((x, i) => `
        <div class="card lift reveal" style="--d:${i * 0.08}s">
          <div class="card-icon">${icon(x.icon)}</div>
          <h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>
        </div>`).join("");

      const C = 2 * Math.PI * 52;
      $("#education").innerHTML = D.education.map((e) => `
        <div class="card edu-card reveal">
          <div class="card-icon" style="margin:0;width:64px;height:64px">${icon("grad")}</div>
          <div>
            <h3>${esc(e.degree)}</h3>
            <div class="edu-meta">
              <span>${icon("award")}${esc(e.school)}</span>
              <span>${icon("pin")}${esc(e.location)}</span>
              <span>${icon("calendar")}${esc(e.period)}</span>
            </div>
          </div>
          <div class="ring" data-value="${e.cgpa}" data-max="${e.outOf}">
            <svg viewBox="0 0 120 120">
              <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--primary)"/><stop offset="1" style="stop-color:var(--secondary)"/></linearGradient></defs>
              <circle class="track" cx="60" cy="60" r="52"/>
              <circle class="bar" cx="60" cy="60" r="52" stroke-dasharray="${C}" stroke-dashoffset="${C}"/>
            </svg>
            <div class="ring-label"><b>${e.cgpa}</b><small>${esc(tx("education.cgpaLabel", "CGPA"))} / ${e.outOf}</small></div>
          </div>
        </div>`).join("");
    },

    experience() {
      const jobs = D.experience;
      // Filter buttons: one per category key, merged across all jobs
      const cats = [];
      jobs.forEach((job) => job.groups.forEach((g) => {
        const c = cats.find((x) => x.id === g.id);
        if (c) c.count += g.items.length;
        else cats.push({ id: g.id, icon: g.icon, label: g.title.split(" &")[0].split(",")[0], count: g.items.length });
      }));
      const total = cats.reduce((n, c) => n + c.count, 0);
      $("#filters").innerHTML =
        `<button class="filter-btn active" data-filter="all">${esc(tx("labels.all", "All"))} <span class="count">${total}</span></button>` +
        cats.map((c) => `<button class="filter-btn" data-filter="${esc(c.id)}">${icon(c.icon)}${esc(c.label)} <span class="count">${c.count}</span></button>`).join("");

      $("#jobs").innerHTML = jobs.map((job) => `
        <div class="job">
          <div class="card company-card reveal">
            <div class="company-left">
              <div class="company-logo">${initials(job.company)}</div>
              <div><h2>${esc(job.company)}</h2><div class="role">${esc(job.role)}</div></div>
            </div>
            <div class="company-meta">
              <span class="chip">${icon("pin")}${esc(job.location)}</span>
              <span class="chip">${icon("calendar")}${esc(job.period)}</span>
              ${job.current ? `<span class="chip live"><span class="pulse"></span>${esc(tx("labels.currentRole", "Current role"))}</span>` : ""}
            </div>
          </div>
          <div class="timeline">
            ${job.groups.map((g) => `
              <section class="tl-group" data-group="${esc(g.id)}">
                <span class="tl-dot"></span>
                <div class="tl-head reveal-left">
                  <div class="card-icon">${icon(g.icon)}</div>
                  <div><h3>${esc(g.title)}</h3><small>${g.items.length} ${esc(tx("labels.achievements", "achievements"))}</small></div>
                </div>
                <div class="tl-items">
                  ${g.items.map((it, i) => `
                    <article class="card tl-item reveal" style="--d:${i * 0.05}s">
                      <span class="check">${icon("check")}</span>
                      <div>
                        <p>${emphasise(it.text)}</p>
                        <div class="tags">${(it.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
                      </div>
                    </article>`).join("")}
                </div>
              </section>`).join("")}
          </div>
        </div>`).join("");

      const apply = (f) => {
        $$(".filter-btn").forEach((b) => b.classList.toggle("active", b.dataset.filter === f));
        $$(".job").forEach((job) => {
          let any = false;
          $$(".tl-group", job).forEach((g) => {
            const show = f === "all" || g.dataset.group === f;
            g.classList.toggle("hidden", !show);
            if (show) any = true;
            if (show && f !== "all") $$(".reveal, .reveal-left", g).forEach((el) => el.classList.add("in"));
          });
          job.classList.toggle("hidden", !any);
          if (any && f !== "all") $$(".company-card", job).forEach((el) => el.classList.add("in"));
        });
      };
      $("#filters").addEventListener("click", (e) => {
        const b = e.target.closest(".filter-btn");
        if (!b) return;
        apply(b.dataset.filter);
        history.replaceState(null, "", b.dataset.filter === "all" ? location.pathname : "#" + b.dataset.filter);
      });
      const hash = location.hash.slice(1);
      if (hash && cats.some((c) => c.id === hash)) {
        apply(hash);
        setTimeout(() => $("#filters").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }), 100);
      }
    },

    skills() {
      $("#pipeline").innerHTML = D.pipeline.map((s, i) => `
        <div class="stage reveal" style="--d:${i * 0.12}s">
          <div class="stage-node">${icon(s.icon)}<span>${i + 1}</span></div>
          <h4>${esc(s.step)}</h4>
          <ul>${s.tools.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </div>`).join("");

      $("#skills").innerHTML = D.skills.map((s, i) => `
        <div class="card skill-card reveal" style="--d:${(i % 3) * 0.08}s">
          <div class="sk-head">
            <div><div class="card-icon">${icon(s.icon)}</div><h3>${esc(s.category)}</h3></div>
            <span class="sk-count">${String(s.items.length).padStart(2, "0")}</span>
          </div>
          <div class="skill-chips">${s.items.map((x) => `<span class="skill-chip">${esc(x)}</span>`).join("")}</div>
        </div>`).join("");

      const input = $("#skill-search");
      const none = $("#no-results");
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        let shown = 0;
        $$(".skill-card").forEach((card) => {
          const cat = $("h3", card).textContent.toLowerCase();
          let hit = !q || cat.includes(q);
          $$(".skill-chip", card).forEach((chip) => {
            const m = q && chip.textContent.toLowerCase().includes(q);
            chip.classList.toggle("match", !!m);
            if (m) hit = true;
          });
          card.classList.toggle("hidden", !hit);
          if (hit) { shown++; card.classList.add("in"); }
        });
        none.classList.toggle("show", shown === 0);
      });
    },

    certifications() {
      $("#certs").innerHTML = D.certifications.map((c, i) => `
        <article class="card lift cert-card reveal" style="--d:${i * 0.1}s">
          <div class="cert-top">
            ${certBadge(c)}
            <div><h3>${esc(c.name)}</h3><div class="issuer">${esc(c.issuer)}</div></div>
          </div>
          <div class="cert-foot">
            <span class="chip">${icon("calendar")}${esc(tx("labels.issued", "Issued"))} ${esc(c.date)}</span>
            <a class="verify-link" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(tx("labels.verifyCredential", "Verify credential"))} ${icon("external")}</a>
          </div>
        </article>`).join("");
      wireBadges($("#certs"));

      const e = D.education[0];
      $("#edu-mini").innerHTML = `
        <div class="card lift reveal">
          <div class="card-icon">${icon("grad")}</div>
          <h3>${esc(e.degree)}</h3>
          <p>${esc(e.school)}, ${esc(e.location)} · ${esc(e.period)} · ${esc(tx("education.cgpaLabel", "CGPA"))} ${e.cgpa}</p>
        </div>`;
    },

    contact() {
      const p = D.profile;
      const items = [
        { ic: "mail", k: tx("cards.email", "Email"), v: p.email, href: `mailto:${p.email}`, copy: p.email },
        { ic: "phone", k: tx("cards.phone", "Phone"), v: p.phone, href: `tel:${p.phone.replace(/\s+/g, "")}`, copy: p.phone },
        { ic: "linkedin", k: tx("cards.linkedin", "LinkedIn"), v: tx("cards.linkedinText", "Connect with me"), href: p.linkedin, ext: true },
        { ic: "pin", k: tx("cards.location", "Location"), v: p.location }
      ];
      $("#contact-list").innerHTML = items.map((it, i) => `
        <div class="card lift contact-item reveal" style="--d:${i * 0.07}s">
          <div class="card-icon">${icon(it.ic)}</div>
          <div><span>${esc(it.k)}</span>${it.href ? `<a href="${esc(it.href)}" ${it.ext ? 'target="_blank" rel="noopener"' : ""}><b>${esc(it.v)}</b></a>` : `<b>${esc(it.v)}</b>`}</div>
          ${it.copy ? `<button class="icon-btn copy-btn" data-copy="${esc(it.copy)}" aria-label="Copy ${esc(it.k)}">${icon("copy")}</button>` : ""}
        </div>`).join("");

      // Netlify Forms — AJAX submit
      const form = $("#contact-form");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = $("button[type=submit]", form);
        btn.disabled = true;
        const label = btn.innerHTML;
        btn.textContent = tx("form.sending", "Sending…");
        try {
          const res = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(new FormData(form)).toString()
          });
          if (!res.ok) throw new Error(res.status);
          form.reset();
          showToast(tx("form.success", "Thanks! Your message has been sent."));
        } catch (err) {
          showToast(tx("form.error", "Sending failed. Please email me directly."), "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = label;
        }
      });
    },

    notfound() {}
  };

  /* ---------- Boot ---------- */
  function boot() {
    applyTheme();
    applyText();
    renderChrome();
    // Fill shared icon placeholders: <i data-icon="arrow"></i>
    $$("[data-icon]").forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
    // Shared resume links
    $$("[data-resume]").forEach((a) => { a.href = D.profile.resume; });
    (pages[page] || (() => {}))();
    initCanvas();
    initReveal();
    initSpotlight();
    initTransitions();
    initCopy();
  }

  /* ---------- Content loading ---------- */
  const CONTENT = ["profile", "home", "about", "experience", "skills", "certifications"];
  async function loadContent() {
    // Resolve content/ relative to this script, so every page (and 404) finds it
    const base = document.querySelector('script[src*="main.js"]').src.replace(/assets\/js\/main\.js.*$/, "");
    const files = await Promise.all(CONTENT.map((name) =>
      fetch(`${base}content/${name}.json`, { cache: "no-cache" }).then((r) => {
        if (!r.ok) throw new Error(`content/${name}.json: ${r.status}`);
        return r.json();
      })
    ));
    const [profile, home, about, experience, skills, certs] = files;
    // Text files are optional: if one is missing, the HTML's built-in text stays
    const optional = (path) => fetch(`${base}content/${path}`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
    [S, T] = await Promise.all([optional("site.json"), optional(`pages/${page === "notfound" ? "404" : page}.json`)]);
    return {
      profile,
      summary: about.summary || "",
      principles: about.principles || [],
      education: about.education || [],
      stats: home.stats || [],
      pillars: home.pillars || [],
      highlights: home.highlights || [],
      marquee: home.marquee || [],
      experience: experience.jobs || [],
      skills: skills.categories || [],
      pipeline: skills.pipeline || [],
      certifications: certs.certifications || []
    };
  }

  async function start() {
    try {
      D = await loadContent();
    } catch (err) {
      console.error(err);
      document.querySelector("main").innerHTML = `
        <section class="notfound"><div class="container">
          <h1 class="grad-text" style="font-size:3rem">Content failed to load</h1>
          <p>Opened the file directly? Run a local server instead:<br><code>python -m http.server 8000</code></p>
        </div></section>`;
      return;
    }
    boot();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
