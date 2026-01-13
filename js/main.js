/* ================================
   C-LUXURY main.js (FINAL)
   - Menu open/close (X + overlay + Esc)
   - Hero crossfade every 4.5s (each image has its own text)
   - Dot timer ring restarts each slide
   - Search button opens Shopify search
   - Scroll reveal (cinematic fade-up) for .reveal
   - Apple-like inertia swipe for #swipeTrack
   ================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------
     MENU
  ---------------------------- */
  const menuBtn = document.querySelector(".menu-toggle");
  const menuPanel = document.querySelector(".menu-panel");
  const closeBtn = document.getElementById("closeMenuBtn");
  const overlay = document.getElementById("overlay");

  function openMenu() {
    if (!menuPanel) return;
    menuPanel.classList.add("open");
    if (overlay) {
      overlay.hidden = false;
      overlay.classList.add("open");
    }
    menuBtn?.setAttribute("aria-expanded", "true");
    menuPanel.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    if (!menuPanel) return;
    menuPanel.classList.remove("open");
    if (overlay) {
      overlay.classList.remove("open");
      overlay.hidden = true;
    }
    menuBtn?.setAttribute("aria-expanded", "false");
    menuPanel.setAttribute("aria-hidden", "true");
  }

  menuBtn?.addEventListener("click", () => {
    if (!menuPanel) return;
    menuPanel.classList.contains("open") ? closeMenu() : openMenu();
  });

  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  document.querySelectorAll(".drawer-link").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

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

  const HOLD_MS = 4500;
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

    heroDotsWrap.innerHTML = HERO_SLIDES.map((_, i) =>
      `<button class="hero-dot ${i === heroCurrent ? "active" : ""}" type="button" aria-label="Hero slide ${i + 1}"></button>`
    ).join("");

    heroDotsWrap.querySelectorAll(".hero-dot").forEach((dot, i) => {
      dot.addEventListener("click", () => {
        heroCurrent = i;
        applyHeroSlide(heroCurrent);
        updateActiveDot(true);
        startHeroAuto();
      });
    });
  }

  function updateActiveDot(restartRing = false) {
    if (!heroDotsWrap) return;

    heroDotsWrap.querySelectorAll(".hero-dot").forEach((d, i) => {
      const shouldBeActive = i === heroCurrent;
      d.classList.remove("active");
      if (shouldBeActive) {
        if (restartRing) void d.offsetWidth;
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
      bgLayers[nextBg].style.backgroundImage = `url(${slide.image})`;
      bgLayers[nextBg].style.backgroundPosition = isMobile() ? slide.posMobile : slide.posDesktop;

      bgLayers[nextBg].classList.add("active");
      bgLayers[activeBg].classList.remove("active");
      activeBg = nextBg;

      setAlign(slide.align);
      heroTitle.innerHTML = slide.title;
      heroSubtext.innerHTML = slide.text || "";

      requestAnimationFrame(setTextIn);
    }, 180);
  }

  if (hero && bgLayers[0] && bgLayers[1] && heroTitle && heroSubtext) {
    const first = HERO_SLIDES[0];

    bgLayers[0].style.backgroundImage = `url(${first.image})`;
    bgLayers[1].style.backgroundImage = `url(${first.image})`;
    bgLayers[0].style.backgroundPosition = isMobile() ? first.posMobile : first.posDesktop;
    bgLayers[1].style.backgroundPosition = isMobile() ? first.posMobile : first.posDesktop;

    setAlign(first.align);
    heroTitle.innerHTML = first.title;
    heroSubtext.innerHTML = first.text || "";

    renderHeroDots();
    updateActiveDot(true);
    setTextIn();
    startHeroAuto();

    window.addEventListener("resize", () => {
      const slide = HERO_SLIDES[heroCurrent];
      bgLayers.forEach((layer) => {
        layer.style.backgroundPosition = isMobile() ? slide.posMobile : slide.posDesktop;
      });
    });
  }

  /* ----------------------------
     SEARCH BUTTON
  ---------------------------- */
  const searchBtn = document.getElementById("searchBtn");
  searchBtn?.addEventListener("click", () => {
    window.open("https://mrcharliestxs.myshopify.com/search", "_blank", "noopener");
  });

/* ----------------------------
   SCROLL REVEAL (cinematic)
   Uses ONLY: .reveal + .is-visible
---------------------------- */
const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  revealEls.forEach((el) => obs.observe(el));
}
  /* ----------------------------
     APPLE-LIKE INERTIA SWIPE
     ✅ Targets your actual HTML: #swipeTrack
  ---------------------------- */
  const swipeTrack = document.getElementById("swipeTrack");

  if (swipeTrack) {
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let rafId = null;

    const stopInertia = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };

    const beginInertia = () => {
      stopInertia();
      const friction = 0.94;
      const minV = 0.06;

      const step = () => {
        swipeTrack.scrollLeft -= velocity * 16;
        velocity *= friction;

        if (Math.abs(velocity) > minV) {
          rafId = requestAnimationFrame(step);
        } else {
          stopInertia();
        }
      };

      rafId = requestAnimationFrame(step);
    };

    const pointerDown = (clientX) => {
      isDown = true;
      swipeTrack.classList.add("is-dragging");
      stopInertia();

      startX = clientX;
      startScrollLeft = swipeTrack.scrollLeft;

      lastX = clientX;
      lastTime = performance.now();
      velocity = 0;
    };

    const pointerMove = (clientX) => {
      if (!isDown) return;

      const walk = clientX - startX;
      swipeTrack.scrollLeft = startScrollLeft - walk;

      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dx = clientX - lastX;

      const v = dx / dt;
      velocity = velocity * 0.7 + v * 0.3;

      lastX = clientX;
      lastTime = now;
    };

    const pointerUp = () => {
      if (!isDown) return;
      isDown = false;
      swipeTrack.classList.remove("is-dragging");
      beginInertia();
    };

    swipeTrack.addEventListener("mousedown", (e) => {
      e.preventDefault();
      pointerDown(e.clientX);
    });

    window.addEventListener("mousemove", (e) => pointerMove(e.clientX));
    window.addEventListener("mouseup", pointerUp);

    swipeTrack.addEventListener("touchstart", (e) => {
      if (!e.touches?.[0]) return;
      pointerDown(e.touches[0].clientX);
    }, { passive: true });

    swipeTrack.addEventListener("touchmove", (e) => {
      if (!e.touches?.[0]) return;
      pointerMove(e.touches[0].clientX);
    }, { passive: true });

    swipeTrack.addEventListener("touchend", pointerUp);
    swipeTrack.addEventListener("mouseleave", pointerUp);

    swipeTrack.addEventListener("wheel", () => {
      stopInertia();
      velocity = 0;
    }, { passive: true });
  }
});
