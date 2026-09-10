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

/* --- Карусель отзывов: свайп + стрелки + точки, по кругу --- */
(function reviewsCarousel(){
  const track = document.getElementById("reviewsTrack");
  const prev  = document.getElementById("rvPrev");
  const next  = document.getElementById("rvNext");
  const dots  = document.getElementById("rvDots");
  if (!track || !prev || !next || !dots) return;

  const cards = Array.from(track.children);
  if (!cards.length) return;

  /* шаг = ширина карточки + gap; на десктопе в кадре две карточки, на телефоне одна */
  function step(){
    if (cards.length < 2) return cards[0].offsetWidth || 1;
    return (cards[1].offsetLeft - cards[0].offsetLeft) || 1;
  }
  function perView(){ return Math.max(1, Math.round(track.clientWidth / step())); }
  function pages(){ return Math.max(1, Math.ceil(cards.length / perView())); }
  function maxScroll(){ return track.scrollWidth - track.clientWidth; }

  function currentPage(){
    if (track.scrollLeft >= maxScroll() - 1) return pages() - 1;   /* хвост всегда последняя страница */
    return Math.min(pages() - 1, Math.round(track.scrollLeft / (step() * perView())));
  }
  function goTo(page){
    const p = (page + pages()) % pages();                          /* зацикливание в обе стороны */
    track.scrollTo({ left: Math.min(p * perView() * step(), maxScroll()), behavior: "smooth" });
  }

  let dotEls = [];
  function buildDots(){
    if (dotEls.length === pages()) return;
    dots.innerHTML = "";
    dotEls = [];
    for (let i = 0; i < pages(); i++){
      const b = document.createElement("button");
      b.type = "button";
      b.className = "rv-dot";
      b.setAttribute("aria-label", "Отзывы, страница " + (i + 1));
      b.addEventListener("click", () => goTo(i));
      dots.appendChild(b);
      dotEls.push(b);
    }
  }
  function sync(){
    buildDots();
    const i = currentPage();
    dotEls.forEach((d, k) => d.classList.toggle("is-active", k === i));
  }

  prev.addEventListener("click", () => goTo(currentPage() - 1));
  next.addEventListener("click", () => goTo(currentPage() + 1));

  /* стрелки с клавиатуры, когда лента в фокусе */
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight"){ e.preventDefault(); goTo(currentPage() + 1); }
    if (e.key === "ArrowLeft" ){ e.preventDefault(); goTo(currentPage() - 1); }
  });

  let t = null;
  track.addEventListener("scroll", () => { clearTimeout(t); t = setTimeout(sync, 80); }, { passive: true });
  window.addEventListener("resize", () => { dotEls = []; sync(); });
  sync();
})();
