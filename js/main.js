const siteHeader = document.querySelector("[data-site-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = document.querySelectorAll(".nav-link");
const revealTargets = document.querySelectorAll(".fade-in");
const heroRevealTargets = document.querySelectorAll(".hero-reveal");
const rootStyle = window.getComputedStyle(document.documentElement);
const headerScrollThreshold = Number.parseInt(rootStyle.getPropertyValue("--hero-scroll-threshold"), 10) || 16;

const updateHeaderState = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > headerScrollThreshold);
};

const closeMenu = () => {
  if (!menuToggle || !nav) return;
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
};

const openMenu = () => {
  if (!menuToggle || !nav) return;
  nav.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
      return;
    }
    openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) closeMenu();
    });
  });
}

if (heroRevealTargets.length > 0) {
  heroRevealTargets.forEach((item, index) => {
    window.setTimeout(() => {
      item.classList.add("is-visible");
    }, 200 + index * 80);
  });
}

if (revealTargets.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) closeMenu();
});
updateHeaderState();
