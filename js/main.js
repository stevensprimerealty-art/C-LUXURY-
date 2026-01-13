/* ================================
   C-LUXURY main.js (clean + safe)
   ================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------
     LOADER (hide)
  ---------------------------- */
  const loader = document.querySelector(".site-loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("hidden"), 700);
  });

  /* ----------------------------
     MENU TOGGLE (simple)
     (uses your existing .menu-panel)
  ---------------------------- */
  const menuBtn = document.querySelector(".menu-toggle");
  const menuPanel = document.querySelector(".menu-panel");

  // Backdrop (so you can tap outside to close)
  let menuBackdrop = document.querySelector(".menu-backdrop");
  if (!menuBackdrop) {
    menuBackdrop = document.createElement("div");
    menuBackdrop.className = "menu-backdrop";
    document.body.appendChild(menuBackdrop);
  }

  function openMenu() {
    menuPanel?.classList.add("open");
    menuBackdrop?.classList.add("open");
  }
  function closeMenu() {
    menuPanel?.classList.remove("open");
    menuBackdrop?.classList.remove("open");
  }

  menuBtn?.addEventListener("click", () => {
    if (!menuPanel) return;
    menuPanel.classList.contains("open") ? closeMenu() : openMenu();
  });

  menuBackdrop?.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ----------------------------
     REVEAL ON SCROLL
  ---------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ----------------------------
     HERO SLIDER (4.5s, cinematic)
  ---------------------------- */
  const hero = document.getElementById("homeHero");
  const bgLayers = document.querySelectorAll(".hero-bg");
  const heroContent = document.getElementById("heroContent");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtext = document.getElementById("heroSubtext");
  const heroDotsWrap = document.getElementById("heroDots");

  // ✅ MUST match your filenames exactly
  const HERO_SLIDES = [
    {
      image: "assets/images/hero/hero-01.jpg",
      title: "A NEW YEAR<br>WITH PRESENCE",
      text: "",
      align: "center",
      posDesktop: "center center",
      posMobile: "50% 35%",
    },
    {
      image: "assets/images/hero/hero-02.jpg",
      title: "SILENCE<br>CONNOTES NOISE",
      text: "",
      align: "center",
      posDesktop: "center center",
      posMobile: "50% 32%",
    },
    {
      image: "assets/images/hero/hero-03.jpg",
      title: "LUXURY<br>WITHOUT NOISE",
      text: "",
      align: "center",
      posDesktop: "center center",
      posMobile: "50% 30%",
    },
    {
      image: "assets/images/hero/hero-04.jpg",
      title: "PRESENCE<br>WITHOUT NOISE",
      text: "Calm design. Intentional form.<br>Confidence that doesn’t shout.",
      align: "right",
      posDesktop: "center center",
      posMobile: "50% 28%",
    },
    {
      image: "assets/images/hero/hero-05.jpg",
      title: "SILENCE<br>IS POWER",
      text: "Minimal. Controlled.<br>Every detail is deliberate.",
      align: "right",
      posDesktop: "center center",
      posMobile: "50% 30%",
    },
    {
      image: "assets/images/hero/hero-06.jpg",
      title: "LUXURY<br>WITHOUT NOISE",
      text: "Quiet confidence.<br>Timeless identity.",
      align: "right",
      posDesktop: "center center",
      posMobile: "50% 32%",
    },
  ];

  // Preload
  HERO_SLIDES.forEach((s) => {
    const img = new Image();
    img.src = s.image;
  });

  const HOLD_MS = 4500; // ✅ your rule
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  let heroCurrent = 0;
  let activeBg = 0;
  let heroTimer = null;

  function stopHeroAuto() {
    if (heroTimer) {
      clearInterval(heroTimer);
      heroTimer = null;
    }
  }
  function startHeroAuto() {
    stopHeroAuto();
    heroTimer = setInterval(() => {
      heroCurrent = (heroCurrent + 1) % HERO_SLIDES.length;
      applyHeroSlide(heroCurrent);
      updateActiveDot();
    }, HOLD_MS);
  }

  function setTextOut() {
    heroContent?.classList.remove("is-in");
    heroContent?.classList.add("is-out");
  }
  function setTextIn() {
    heroContent?.classList.remove("is-out");
    heroContent?.classList.add("is-in");
  }

  function setAlign(mode) {
    if (!heroContent) return;
    heroContent.classList.remove("align-center", "align-right");
    heroContent.classList.add(mode === "right" ? "align-right" : "align-center");
  }

  function renderHeroDots() {
    if (!heroDotsWrap) return;
    heroDotsWrap.innerHTML = HERO_SLIDES.map((_, i) => {
      return `<button class="hero-dot ${i === heroCurrent ? "active" : ""}" type="button" aria-label="Hero slide ${i + 1}"></button>`;
    }).join("");

    heroDotsWrap.querySelectorAll(".hero-dot").forEach((dot, i) => {
      dot.addEventListener("click", () => {
        heroCurrent = i;
        applyHeroSlide(heroCurrent);
        updateActiveDot();
        startHeroAuto();
      });
    });
  }

  function updateActiveDot() {
    if (!heroDotsWrap) return;
    heroDotsWrap.querySelectorAll(".hero-dot").forEach((d, i) => {
      d.classList.toggle("active", i === heroCurrent);
    });
  }

  function applyHeroSlide(idx) {
    if (!bgLayers.length || !heroTitle || !heroSubtext) return;

    const slide = HERO_SLIDES[idx];
    const nextBg = activeBg === 0 ? 1 : 0;

    setTextOut();

    setTimeout(() => {
      // background crossfade
      bgLayers[nextBg].style.backgroundImage = `url(${slide.image})`;
      bgLayers[nextBg].style.backgroundPosition = isMobile() ? slide.posMobile : slide.posDesktop;

      bgLayers[nextBg].classList.add("active");
      bgLayers[activeBg].classList.remove("active");
      activeBg = nextBg;

      // text swap
      setAlign(slide.align);
      heroTitle.innerHTML = slide.title;
      heroSubtext.innerHTML = slide.text || "";

      requestAnimationFrame(() => setTextIn());
    }, 180);
  }

  // init hero
  if (hero && bgLayers[0] && bgLayers[1]) {
    bgLayers[0].style.backgroundImage = `url(${HERO_SLIDES[0].image})`;
    bgLayers[1].style.backgroundImage = `url(${HERO_SLIDES[0].image})`;
    bgLayers[0].style.backgroundPosition = isMobile() ? HERO_SLIDES[0].posMobile : HERO_SLIDES[0].posDesktop;
    bgLayers[1].style.backgroundPosition = isMobile() ? HERO_SLIDES[0].posMobile : HERO_SLIDES[0].posDesktop;

    setAlign(HERO_SLIDES[0].align);
    heroTitle.innerHTML = HERO_SLIDES[0].title;
    heroSubtext.innerHTML = HERO_SLIDES[0].text || "";

    renderHeroDots();
    setTextIn();
    startHeroAuto();

    // pause on hover desktop
    hero.addEventListener("mouseenter", stopHeroAuto);
    hero.addEventListener("mouseleave", startHeroAuto);

    // resize keeps positioning
    window.addEventListener("resize", () => {
      const slide = HERO_SLIDES[heroCurrent];
      bgLayers.forEach((layer) => {
        layer.style.backgroundPosition = isMobile() ? slide.posMobile : slide.posDesktop;
      });
    });
  }

  /* ----------------------------
     CART COUNT (won’t crash)
     (GitHub pages can't read Shopify cart due to CORS; default 0)
  ---------------------------- */
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) {
    cartCountEl.textContent = "0";
    cartCountEl.classList.add("is-empty");
  }
});
