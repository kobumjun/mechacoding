const siteHeader = document.querySelector("[data-site-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navClose = document.querySelector("[data-nav-close]");
const navLinks = document.querySelectorAll(".nav-link");
const revealTargets = document.querySelectorAll(".fade-in");
const heroRevealTargets = document.querySelectorAll(".hero-reveal");
const heroCarousel = document.querySelector("[data-hero-carousel]");
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

  if (navClose) {
    navClose.addEventListener("click", () => {
      closeMenu();
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
    }
  });
}

if (heroCarousel) {
  const slides = heroCarousel.querySelectorAll(".hero-carousel-slide");
  const panels = heroCarousel.querySelectorAll(".hero-carousel-panel");
  const dots = heroCarousel.querySelectorAll(".hero-carousel-dot");
  let current = 0;
  let timerId = 0;
  const intervalMs = 5000;

  const src01 = "./images/hero/hero-slide-01.jpg";
  const srcMain = "./images/hero/hero-main.jpg";

  heroCarousel.querySelectorAll(".hero-carousel-img").forEach((img) => {
    img.addEventListener("error", () => {
      const url = img.getAttribute("src") || "";
      if (url.includes("program-collaborative") || url.includes("program-foundation")) {
        img.src = src01;
        return;
      }
      if (url.includes("hero-slide-01")) {
        img.src = srcMain;
        return;
      }
      img.style.display = "none";
    });
  });

  const goTo = (index) => {
    const n = slides.length;
    if (n === 0) return;
    current = ((index % n) + n) % n;
    slides.forEach((el, i) => el.classList.toggle("is-active", i === current));
    panels.forEach((el, i) => el.classList.toggle("is-active", i === current));
    dots.forEach((el, i) => {
      el.classList.toggle("is-active", i === current);
      el.setAttribute("aria-selected", i === current ? "true" : "false");
    });
  };

  const next = () => goTo(current + 1);

  const resetTimer = () => {
    window.clearInterval(timerId);
    timerId = window.setInterval(next, intervalMs);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      resetTimer();
    });
  });

  if (slides.length > 0) {
    resetTimer();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      window.clearInterval(timerId);
    } else if (slides.length > 0) {
      resetTimer();
    }
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
