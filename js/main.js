// ENABLE JS MODE
document.documentElement.classList.remove("no-js");

/* =============================
   C-LUXURY main.js — FINAL FIXED
============================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     MENU
  ============================= */
  const menuBtn = document.querySelector(".menu-toggle");
  const menuPanel = document.querySelector(".menu-panel");
  const closeBtn = document.getElementById("closeMenuBtn");
  const overlay = document.getElementById("overlay");

  const openMenu = () => {
    if (!menuPanel) return;
    menuPanel.classList.add("open");
    overlay.hidden = false;
    overlay.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    menuPanel.classList.remove("open");
    overlay.classList.remove("open");
    overlay.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
  };

  menuBtn?.addEventListener("click", () =>
    menuPanel.classList.contains("open") ? closeMenu() : openMenu()
  );
  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);
  document.addEventListener("keydown", e => e.key === "Escape" && closeMenu());

  /* =============================
     HERO SLIDER (WORKING)
  ============================= */
  const bgLayers = document.querySelectorAll(".hero-bg");
  const heroContent = document.getElementById("heroContent");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtext = document.getElementById("heroSubtext");
  const heroDots = document.getElementById("heroDots");

  const HOLD = 4500;
  let index = 0;
  let activeBg = 0;
  let timer;

  const slides = [
    { img:"hero-01.jpg", title:"A NEW YEAR<br>WITH PRESENCE", text:"", align:"center" },
    { img:"hero-02.jpg", title:"SILENCE<br>CONNOTES NOISE", text:"", align:"center" },
    { img:"hero-03.jpg", title:"LUXURY<br>WITHOUT NOISE", text:"", align:"center" },
    { img:"hero-04.jpg", title:"PRESENCE<br>WITHOUT NOISE", text:"Calm design.<br>Confidence.", align:"right" },
    { img:"hero-05.jpg", title:"SILENCE<br>IS POWER", text:"Minimal. Controlled.", align:"right" },
    { img:"hero-06.jpg", title:"LUXURY<br>WITHOUT NOISE", text:"Timeless identity.", align:"right" }
  ];

  slides.forEach(s => new Image().src = `assets/images/hero/${s.img}`);

  const renderDots = () => {
    heroDots.innerHTML = slides.map((_, i) =>
      `<button class="hero-dot${i===index?' active':''}"></button>`
    ).join("");

    heroDots.querySelectorAll(".hero-dot").forEach((dot,i)=>{
      dot.onclick = () => { index=i; changeSlide(); restart(); };
    });
  };

  const changeSlide = () => {
    const slide = slides[index];
    const next = activeBg ^ 1;

    heroContent.classList.remove("is-in");
    heroContent.classList.add("is-out");

    setTimeout(() => {
      bgLayers[next].style.backgroundImage =
        `url(assets/images/hero/${slide.img})`;

      bgLayers[next].classList.add("active");
      bgLayers[activeBg].classList.remove("active");
      activeBg = next;

      heroContent.classList.toggle("align-right", slide.align === "right");
      heroContent.classList.toggle("align-center", slide.align !== "right");
      heroTitle.innerHTML = slide.title;
      heroSubtext.innerHTML = slide.text;

      requestAnimationFrame(() => {
        heroContent.classList.remove("is-out");
        heroContent.classList.add("is-in");
      });
    }, 200);

    renderDots();
  };

  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      index = (index + 1) % slides.length;
      changeSlide();
    }, HOLD);
  };

  bgLayers[0].style.backgroundImage =
    `url(assets/images/hero/${slides[0].img})`;
  bgLayers[0].classList.add("active");

  renderDots();
  restart();

  /* =============================
     SEARCH
  ============================= */
  document.getElementById("searchBtn")?.addEventListener("click", () =>
    window.open("https://mrcharliestxs.myshopify.com/search", "_blank")
  );

  /* =============================
     SCROLL REVEAL
  ============================= */
  const reveals = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }
    });
  },{threshold:.15});

  reveals.forEach(r=>obs.observe(r));

  /* =============================
     INERTIA SWIPE
  ============================= */
  const track = document.getElementById("swipeTrack");
  if (!track) return;

  let down=false,start=0,scroll=0,vel=0,last=0,lastT=0,raf;

  const stop=()=>raf&&cancelAnimationFrame(raf);
  const inertia=()=>{
    vel*=0.94;
    track.scrollLeft-=vel*16;
    if(Math.abs(vel)>0.05) raf=requestAnimationFrame(inertia);
  };

  track.addEventListener("mousedown",e=>{
    down=true; start=e.clientX; scroll=track.scrollLeft;
    last=start; lastT=performance.now(); vel=0; stop();
  });

  window.addEventListener("mousemove",e=>{
    if(!down) return;
    const dx=e.clientX-start;
    track.scrollLeft=scroll-dx;
    const now=performance.now();
    vel=(e.clientX-last)/(now-lastT||1)*0.7+vel*0.3;
    last=e.clientX; lastT=now;
  });

  window.addEventListener("mouseup",()=>{
    if(down){ down=false; inertia(); }
  });

});
