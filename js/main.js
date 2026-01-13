document.documentElement.classList.remove("no-js");

document.addEventListener("DOMContentLoaded", () => {
  // rest of your existing code
});

/* =============================
   C-LUXURY main.js (FINAL - FIXED)
   ============================= */

document.addEventListener("DOMContentLoaded", () => {
  // rest of your code stays EXACTLY the same
  /* =============================
     MENU
  ============================= */
  const menuBtn = document.querySelector(".menu-toggle");
  const menuPanel = document.querySelector(".menu-panel");
  const closeBtn = document.getElementById("closeMenuBtn");
  const overlay = document.getElementById("overlay");

  function openMenu() {
    if (!menuPanel) return;
    menuPanel.classList.add("open");
    overlay && (overlay.hidden = false, overlay.classList.add("open"));
    menuBtn?.setAttribute("aria-expanded", "true");
    menuPanel.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    if (!menuPanel) return;
    menuPanel.classList.remove("open");
    overlay && (overlay.classList.remove("open"), overlay.hidden = true);
    menuBtn?.setAttribute("aria-expanded", "false");
    menuPanel.setAttribute("aria-hidden", "true");
  }

  menuBtn?.addEventListener("click", () =>
    menuPanel?.classList.contains("open") ? closeMenu() : openMenu()
  );
  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);
  document.addEventListener("keydown", e => e.key === "Escape" && closeMenu());

  /* =============================
     HERO SLIDER
  ============================= */
  const bgLayers = document.querySelectorAll(".hero-bg");
  const heroContent = document.getElementById("heroContent");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtext = document.getElementById("heroSubtext");
  const heroDotsWrap = document.getElementById("heroDots");

  const HOLD_MS = 4500;
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches();

  const SLIDES = [
    { image:"assets/images/hero/hero-01.jpg", title:"A NEW YEAR<br>WITH PRESENCE", text:"", align:"center", posM:"50% 35%" },
    { image:"assets/images/hero/hero-02.jpg", title:"SILENCE<br>CONNOTES NOISE", text:"", align:"center", posM:"50% 32%" },
    { image:"assets/images/hero/hero-03.jpg", title:"LUXURY<br>WITHOUT NOISE", text:"", align:"center", posM:"50% 30%" },
    { image:"assets/images/hero/hero-04.jpg", title:"PRESENCE<br>WITHOUT NOISE", text:"Calm design. Intentional form.<br>Confidence that doesn’t shout.", align:"right", posM:"50% 28%" },
    { image:"assets/images/hero/hero-05.jpg", title:"SILENCE<br>IS POWER", text:"Minimal. Controlled.<br>Every detail is deliberate.", align:"right", posM:"50% 30%" },
    { image:"assets/images/hero/hero-06.jpg", title:"LUXURY<br>WITHOUT NOISE", text:"Quiet confidence.<br>Timeless identity.", align:"right", posM:"50% 32%" }
  ];

  let index = 0, bg = 0, timer;

  SLIDES.forEach(s => new Image().src = s.image);

  function applySlide(i) {
    const s = SLIDES[i];
    const next = bg ^ 1;

    heroContent.classList.remove("is-in");
    heroContent.classList.add("is-out");

    setTimeout(() => {
      bgLayers[next].style.backgroundImage = `url(${s.image})`;
      bgLayers[next].style.backgroundPosition = isMobile() ? s.posM : "center center";
      bgLayers[next].classList.add("active");
      bgLayers[bg].classList.remove("active");
      bg = next;

      heroContent.classList.toggle("align-right", s.align === "right");
      heroContent.classList.toggle("align-center", s.align !== "right");
      heroTitle.innerHTML = s.title;
      heroSubtext.innerHTML = s.text || "";

      requestAnimationFrame(() => {
        heroContent.classList.remove("is-out");
        heroContent.classList.add("is-in");
      });
    }, 180);
  }

  function renderDots() {
    heroDotsWrap.innerHTML = SLIDES.map((_, i) =>
      `<button class="hero-dot${i===index?" active":""}" aria-label="Slide ${i+1}"></button>`
    ).join("");

    heroDotsWrap.querySelectorAll(".hero-dot").forEach((d,i)=>{
      d.onclick = () => { index=i; applySlide(i); restart(); };
    });
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => {
      index = (index+1)%SLIDES.length;
      applySlide(index);
      renderDots();
    }, HOLD_MS);
  }

  if (bgLayers.length && heroTitle) {
    bgLayers[0].style.backgroundImage = `url(${SLIDES[0].image})`;
    bgLayers[0].classList.add("active");
    renderDots();
    restart();
  }

  /* =============================
     SEARCH
  ============================= */
  document.getElementById("searchBtn")?.addEventListener("click", () =>
    window.open("https://mrcharliestxs.myshopify.com/search", "_blank", "noopener")
  );

  /* =============================
     SCROLL REVEAL (FIXED)
  ============================= */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("is-visible");
        revealObs.unobserve(e.target);
      }
    });
  },{ threshold:.15 });

  revealEls.forEach(el=>revealObs.observe(el));

  /* =============================
     INERTIA SWIPE (SAFE)
  ============================= */
  const track = document.getElementById("swipeTrack");
  if(!track) return;

  let down=false,startX=0,scrollX=0,vel=0,lastX=0,lastT=0,raf;

  const stop=()=>raf&&cancelAnimationFrame(raf);
  const inertia=()=>{
    vel*=.94;
    track.scrollLeft-=vel*16;
    if(Math.abs(vel)>.05) raf=requestAnimationFrame(inertia);
  };

  track.addEventListener("mousedown",e=>{
    down=true; startX=e.clientX; scrollX=track.scrollLeft;
    lastX=startX; lastT=performance.now(); vel=0; stop();
  });

  window.addEventListener("mousemove",e=>{
    if(!down) return;
    const dx=e.clientX-startX;
    track.scrollLeft=scrollX-dx;
    const now=performance.now();
    vel=(e.clientX-lastX)/(now-lastT||1)*.7+vel*.3;
    lastX=e.clientX; lastT=now;
  });

  window.addEventListener("mouseup",()=>{ if(down){ down=false; inertia(); } });

  track.addEventListener("wheel",()=>{ stop(); vel=0; },{passive:true});
});
