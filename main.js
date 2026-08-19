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
