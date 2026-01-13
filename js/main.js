/* ================================
   C-LUXURY main.js (FINAL)
   - Menu open/close works (X works)
   - Hero crossfade every 4.5s
   - Dot timer ring restarts each slide
   - Shop Now button stays still
   ================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------
     MENU (open/close)
  ---------------------------- */
  const menuBtn = document.querySelector(".menu-toggle");
  const menuPanel = document.querySelector(".menu-panel");
  const closeBtn = document.getElementById("closeMenuBtn");
  const overlay = document.getElementById("overlay");

  function openMenu() {
    if (!menuPanel) return;
    menuPanel.classList.add("open");
    overlay?.classList.add("open");
    if (overlay) overlay.hidden = false;

    menuBtn?.setAttribute("aria-expanded", "true");
    menuPanel.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    if (!menuPanel) return;
    menuPanel.classList.remove("open");
    overlay?.classList.remove("open");
    if (overlay) overlay.hidden = true;

    menuBtn?.setAttribute("aria-expanded", "false");
    menuPanel.setAttribute("aria-hidden", "true");
  }

  menuBtn?.addEventListener("click", () => {
    if (!menuPanel) return;
    menuPanel.classList.contains("open") ? closeMenu() : openMenu();
  });

  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ----------------------------
     HERO SLIDER (4.5s)
  ---------------------------- */
  const hero = document.getElementById("homeHero");
  const bgLayers = document.querySelectorAll(".hero-bg");
  const heroContent = document.getElementById("heroContent");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtext = document.getElementById("heroSubtext");
  const heroDotsWrap = document.getElementById("heroDots");

  const HOLD_MS = 4500; // ✅ your rule
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

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

  // Preload images
  HERO_SLIDES.forEach((s) => {
    const img = new Image();
    img.src = s.image;
  });

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
      updateActiveDot(true);
    }, HOLD_MS);
  }

  function setAlign(mode) {
    if (!heroContent) return;
    heroContent.classList.remove("align-center", "align-right");
    heroContent.classList.add(mode === "right" ? "align-right" : "align-center");
  }

  function setTextOut() {
    heroContent?.classList.remove("is-in");
    heroContent?.classList.add("is-out");
  }

  function setTextIn() {
    heroContent?.classList.remove("is-out");
    heroContent?.classList.add("is-in");
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
        updateActiveDot(true);
        startHeroAuto();
      });
    });
  }

  // restartRing=true forces CSS animation restart on active dot
  function updateActiveDot(restartRing = false) {
    if (!heroDotsWrap) return;

    heroDotsWrap.querySelectorAll(".hero-dot").forEach((d, i) => {
      const shouldBeActive = i === heroCurrent;

      // remove first (so the ring animation can restart)
      d.classList.remove("active");

      if (shouldBeActive) {
        if (restartRing) {
          // force reflow
          void d.offsetWidth;
        }
        d.classList.add("active");
      }
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
    updateActiveDot(true);
    setTextIn();
    startHeroAuto();

    // keep positions correct on resize
    window.addEventListener("resize", () => {
      const slide = HERO_SLIDES[heroCurrent];
      bgLayers.forEach((layer) => {
        layer.style.backgroundPosition = isMobile() ? slide.posMobile : slide.posDesktop;
      });
    });
  }

  /* ----------------------------
     SEARCH BUTTON (Shopify search)
     (opens Shopify search page)
  ---------------------------- */
  const searchBtn = document.getElementById("searchBtn");
  searchBtn?.addEventListener("click", () => {
    window.open("https://mrcharliestxs.myshopify.com/search", "_blank", "noopener");
  });
});
