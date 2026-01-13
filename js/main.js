document.addEventListener("DOMContentLoaded", () => {

  /* HERO */
  const bgLayers = document.querySelectorAll(".hero-bg");
  const heroContent = document.getElementById("heroContent");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtext = document.getElementById("heroSubtext");
  const heroDots = document.getElementById("heroDots");

  const slides = [
    { img:"hero-01.jpg", title:"A NEW YEAR<br>WITH PRESENCE", text:"", align:"center" },
    { img:"hero-02.jpg", title:"SILENCE<br>CONNOTES NOISE", text:"", align:"center" },
    { img:"hero-03.jpg", title:"LUXURY<br>WITHOUT NOISE", text:"", align:"center" },
    { img:"hero-04.jpg", title:"PRESENCE<br>WITHOUT NOISE", text:"Calm design.<br>Confidence.", align:"right" },
    { img:"hero-05.jpg", title:"SILENCE<br>IS POWER", text:"Minimal. Controlled.", align:"right" }
  ];

  let index = 0;
  let activeBg = 0;

  function renderDots() {
    heroDots.innerHTML = slides.map((_, i) =>
      `<button class="hero-dot${i===index?' active':''}"></button>`
    ).join("");

    heroDots.querySelectorAll(".hero-dot").forEach((dot,i)=>{
      dot.onclick = () => {
        index = i;
        changeSlide();
      };
    });
  }

  function changeSlide() {
    const slide = slides[index];
    const next = activeBg ^ 1;

    bgLayers[next].style.backgroundImage =
      `url(assets/images/hero/${slide.img})`;

    bgLayers[next].classList.add("active");
    bgLayers[activeBg].classList.remove("active");
    activeBg = next;

    heroContent.classList.toggle("align-right", slide.align === "right");
    heroContent.classList.toggle("align-center", slide.align !== "right");
    heroTitle.innerHTML = slide.title;
    heroSubtext.innerHTML = slide.text;

    heroContent.classList.add("is-in");
    renderDots();
  }

  changeSlide();
  setInterval(() => {
    index = (index + 1) % slides.length;
    changeSlide();
  }, 4500);
});
