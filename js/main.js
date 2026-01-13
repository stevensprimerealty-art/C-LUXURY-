document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     MENU (SAFE)
  ============================= */
  const menuBtn = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu-panel");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("closeMenuBtn");

  const openMenu = () => {
    if (!menu || !overlay) return;
    menu.classList.add("open");
    overlay.hidden = false;
  };

  const closeMenu = () => {
    if (!menu || !overlay) return;
    menu.classList.remove("open");
    overlay.hidden = true;
  };

  menuBtn?.addEventListener("click", () => {
    menu.classList.contains("open") ? closeMenu() : openMenu();
  });

  overlay?.addEventListener("click", closeMenu);
  closeBtn?.addEventListener("click", closeMenu);

  /* =============================
     HERO SLIDER (STABLE)
  ============================= */
  const bg = document.querySelectorAll(".hero-bg");
  const title = document.getElementById("heroTitle");
  const text = document.getElementById("heroSubtext");
  const dotsWrap = document.getElementById("heroDots");
  const content = document.getElementById("heroContent");

  if (!bg.length || !title || !dotsWrap) return;

  const slides = [
    { img:"hero-01.jpg", title:"A NEW YEAR<br>WITH PRESENCE", text:"", align:"center" },
    { img:"hero-02.jpg", title:"SILENCE<br>CONNOTES NOISE", text:"", align:"center" },
    { img:"hero-03.jpg", title:"LUXURY<br>WITHOUT NOISE", text:"", align:"center" },
    { img:"hero-04.jpg", title:"PRESENCE<br>WITHOUT NOISE", text:"Calm design. Intentional form.", align:"right" },
    { img:"hero-05.jpg", title:"SILENCE<br>IS POWER", text:"Minimal. Controlled.", align:"right" }
  ];

  let i = 0;
  let active = 0;
  let timer;

  slides.forEach(s => {
    const img = new Image();
    img.src = `assets/images/hero/${s.img}`;
  });

  function renderDots() {
    dotsWrap.innerHTML = slides.map((_, idx) =>
      `<button class="hero-dot${idx === i ? " active" : ""}" aria-label="Slide ${idx+1}"></button>`
    ).join("");

    dotsWrap.querySelectorAll(".hero-dot").forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        i = idx;
        show();
        restart();
      });
    });
  }

  function show() {
    const s = slides[i];
    const next = active ^ 1;

    content.classList.remove("is-in");

    setTimeout(() => {
      bg[next].style.backgroundImage = `url(assets/images/hero/${s.img})`;
      bg[next].classList.add("active");
      bg[active].classList.remove("active");
      active = next;

      content.classList.toggle("align-right", s.align === "right");
      content.classList.toggle("align-center", s.align !== "right");
      title.innerHTML = s.title;
      text.innerHTML = s.text;

      requestAnimationFrame(() => {
        content.classList.add("is-in");
      });

      renderDots();
    }, 180);
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => {
      i = (i + 1) % slides.length;
      show();
    }, 4500);
  }

  bg[0].style.backgroundImage = `url(assets/images/hero/${slides[0].img})`;
  bg[0].classList.add("active");

  show();
  restart();

  /* =============================
     SCROLL REVEAL (SAFE)
  ============================= */
  const reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => obs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("is-visible"));
  }

  /* =============================
     SEARCH
  ============================= */
  document.getElementById("searchBtn")?.addEventListener("click", () => {
    window.open("https://mrcharliestxs.myshopify.com/search", "_blank");
  });

});
