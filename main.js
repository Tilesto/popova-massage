/* =========================================================
   Массаж · Александра Попова — логика лендинга
   ========================================================= */

/* --- ЕДИНСТВЕННОЕ МЕСТО со ссылкой на запись -------------
   Заказчица заведёт свой профиль DIKIDI — заменить ссылку тут.
   Пока временно ведёт на профиль мастера в салоне «До/после».      */
const BOOKING_URL = "https://dikidi.net/2049941?p=2.pi-mi-ssm&o=11&m=4396455";

document.querySelectorAll("[data-book]").forEach(el => {
  el.setAttribute("href", BOOKING_URL);
  el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener");
});

/* --- Год в подвале --- */
const yr = document.getElementById("year");
if (yr) yr.textContent = new Date().getFullYear();

/* --- Переключатель темы (система → toggle, с запоминанием) --- */
(function themeToggle(){
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");        // 'light' | 'dark' | null
  if (saved) root.setAttribute("data-theme", saved);

  function current(){
    const attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (btn){
    btn.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }
})();

/* --- Reveal при скролле --- */
(function reveal(){
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)){ els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .14, rootMargin: "0px 0px -40px 0px" });
  els.forEach(e => io.observe(e));
})();

/* --- Аврора на canvas (тёплые плавающие пятна) --- */
(function aurora(){
  const canvas = document.getElementById("aurora");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  const css = getComputedStyle(document.documentElement);
  let colors = [];
  function loadColors(){
    colors = ["--aurora-1","--aurora-2","--aurora-3","--aurora-4"]
      .map(v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#d9a878");
  }
  loadColors();

  let w, h, dpr, blobs, raf;
  function size(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function init(){
    size();
    blobs = colors.map((c, i) => ({
      c,
      x: Math.random() * w, y: Math.random() * h,
      r: Math.max(w, h) * (0.38 + Math.random() * 0.28),
      dx: (Math.random() - .5) * .3, dy: (Math.random() - .5) * .3,
      p: Math.random() * Math.PI * 2
    }));
  }
  let t = 0;
  function draw(){
    ctx.clearRect(0, 0, w, h);
    ctx.filter = "blur(50px)";
    t += 0.005;
    blobs.forEach(b => {
      b.x += b.dx + Math.sin(t + b.p) * .35;
      b.y += b.dy + Math.cos(t * .8 + b.p) * .35;
      if (b.x < -b.r) b.x = w + b.r; if (b.x > w + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = h + b.r; if (b.y > h + b.r) b.y = -b.r;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, b.c); g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.filter = "none";
    raf = requestAnimationFrame(draw);
  }
  init(); draw();

  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(init, 200); });
  // Пересобрать цвета при смене темы
  const mo = new MutationObserver(() => { loadColors(); blobs.forEach((b, i) => b.c = colors[i % colors.length]); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    loadColors(); blobs.forEach((b, i) => b.c = colors[i % colors.length]);
  });
})();
