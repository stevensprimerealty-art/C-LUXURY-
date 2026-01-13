
/* ================================
   C-LUXURY main.js (menu drawer)
   ================================ */

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeMenuBtn");
  const overlay = document.getElementById("overlay");
  const drawer = document.getElementById("menuDrawer");

  function openMenu() {
    if (!overlay || !drawer || !menuBtn) return;
    overlay.hidden = false;
    overlay.classList.add("open");
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    if (!overlay || !drawer || !menuBtn) return;
    overlay.classList.remove("open");
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";

    // wait for fade-out then hide overlay
    window.setTimeout(() => {
      overlay.hidden = true;
    }, 220);
  }

  menuBtn?.addEventListener("click", () => {
    const isOpen = drawer?.classList.contains("open");
    if (isOpen) closeMenu();
    else openMenu();
  });

  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
});
