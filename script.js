// script.js
(() => {
  // year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // smooth anchor scroll (optional – modern nice feel)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // mobile menu
  const burger = document.getElementById("burger");
  const mobile = document.getElementById("mobileMenu");
  if (burger && mobile) {
    burger.addEventListener("click", () => {
      const open = mobile.style.display === "block";
      mobile.style.display = open ? "none" : "block";
      burger.setAttribute("aria-expanded", String(!open));
    });

    mobile.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobile.style.display = "none";
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  }, { threshold: 0.14 });

  revealEls.forEach(el => io.observe(el));

  // Gentle hero parallax (mouse move)
  const hero = document.querySelector(".hero");
  const blobs = document.querySelector(".bgBlobs");
  if (hero && blobs) {
    let raf = null;
    window.addEventListener("mousemove", (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        blobs.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  // project slider
  const track = document.getElementById("pTrack");
  const dotsWrap = document.getElementById("pDots");
  const prev = document.getElementById("pPrev");
  const next = document.getElementById("pNext");
  const slider = document.getElementById("pSlider");

  if (track && dotsWrap && prev && next) {
    const slides = Array.from(track.querySelectorAll(".projectSlide"));
    let i = 0;
    let timer = null;

    const renderDots = () => {
      dotsWrap.innerHTML = "";
      slides.forEach((_, idx) => {
        const b = document.createElement("button");
        b.className = "dotBtn" + (idx === i ? " active" : "");
        b.addEventListener("click", () => go(idx));
        dotsWrap.appendChild(b);
      });
    };

    const update = () => {
      track.style.transform = `translateX(${-i * 100}%)`;
      dotsWrap.querySelectorAll(".dotBtn").forEach((d, idx) => {
        d.classList.toggle("active", idx === i);
      });
    };

    const go = (idx) => {
      i = (idx + slides.length) % slides.length;
      update();
      restart();
    };

    const n = () => go(i + 1);
    const p = () => go(i - 1);

    prev.addEventListener("click", p);
    next.addEventListener("click", n);

    // swipe
    if (slider) {
      let startX = 0;
      let dragging = false;

      slider.addEventListener("pointerdown", (e) => {
        dragging = true;
        startX = e.clientX;
        slider.setPointerCapture(e.pointerId);
      });
      slider.addEventListener("pointerup", (e) => {
        if (!dragging) return;
        dragging = false;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 40) dx < 0 ? n() : p();
      });
      slider.addEventListener("pointercancel", () => dragging = false);

      slider.addEventListener("mouseenter", () => stop());
      slider.addEventListener("mouseleave", () => start());
    }

    const start = () => {
      stop();
      timer = setInterval(n, 6500);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const restart = () => start();

    renderDots();
    update();
    start();

    // keyboard
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") p();
      if (e.key === "ArrowRight") n();
    });
  }

  // tabs
  const tabBtns = Array.from(document.querySelectorAll(".tabBtn"));
  const tabs = Array.from(document.querySelectorAll(".tabContent"));

  const showTab = (id) => {
    tabs.forEach(t => t.classList.toggle("show", t.id === id));
    tabBtns.forEach(b => {
      const active = b.dataset.tab === id;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", String(active));
    });
  };

  tabBtns.forEach(b => {
    b.addEventListener("click", () => showTab(b.dataset.tab));
  });
})();
// ===== Map Slider =====
const mapTrack = document.getElementById("mapTrack");
const mapDotsWrap = document.getElementById("mapDots");
const mapPrev = document.getElementById("mapPrev");
const mapNext = document.getElementById("mapNext");

if(mapTrack){
  const slides = Array.from(mapTrack.children);
  let index = 0;

  const updateMap = () => {
    mapTrack.style.transform = `translateX(${-index * 100}%)`;
    document.querySelectorAll(".mapDot").forEach((dot,i)=>{
      dot.classList.toggle("active", i === index);
    });
  };

  slides.forEach((_,i)=>{
    const dot = document.createElement("div");
    dot.className = "mapDot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", ()=>{ index = i; updateMap(); });
    mapDotsWrap.appendChild(dot);
  });

  mapPrev.addEventListener("click", ()=>{
    index = (index - 1 + slides.length) % slides.length;
    updateMap();
  });

  mapNext.addEventListener("click", ()=>{
    index = (index + 1) % slides.length;
    updateMap();
  });
}
// ===== Testimonials Slider =====
const tTrack = document.getElementById("tTrack");
const tDotsWrap = document.getElementById("tDots");
const tPrev = document.getElementById("tPrev");
const tNext = document.getElementById("tNext");
const tSlider = document.getElementById("tSlider");

if (tTrack && tDotsWrap && tPrev && tNext) {
  const slides = Array.from(tTrack.querySelectorAll(".tSlide"));
  let i = 0;
  let timer = null;

  const renderDots = () => {
    tDotsWrap.innerHTML = "";
    slides.forEach((_, idx) => {
      const b = document.createElement("button");
      b.className = "tDot" + (idx === i ? " active" : "");
      b.setAttribute("aria-label", `Отзыв ${idx + 1}`);
      b.addEventListener("click", () => go(idx));
      tDotsWrap.appendChild(b);
    });
  };

  const update = () => {
    tTrack.style.transform = `translateX(${-i * 100}%)`;
    tDotsWrap.querySelectorAll(".tDot").forEach((d, idx) => {
      d.classList.toggle("active", idx === i);
    });
  };

  const go = (idx) => {
    i = (idx + slides.length) % slides.length;
    update();
    restart();
  };

  const n = () => go(i + 1);
  const p = () => go(i - 1);

  tPrev.addEventListener("click", p);
  tNext.addEventListener("click", n);

  // swipe support
  if (tSlider) {
    let startX = 0;
    let dragging = false;

    tSlider.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX;
      tSlider.setPointerCapture(e.pointerId);
    });

    tSlider.addEventListener("pointerup", (e) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) dx < 0 ? n() : p();
    });

    tSlider.addEventListener("pointercancel", () => dragging = false);
    tSlider.addEventListener("mouseenter", () => stop());
    tSlider.addEventListener("mouseleave", () => start());
  }

  const start = () => {
    stop();
    timer = setInterval(n, 8000); // чуть медленнее, чтобы читать
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const restart = () => start();

  renderDots();
  update();
  start();

  // keyboard when visible (optional)
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") p();
    if (e.key === "ArrowRight") n();
  });
}
