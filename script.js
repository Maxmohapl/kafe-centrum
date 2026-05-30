const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("[data-year]");
const brandButtons = document.querySelectorAll("[data-brand-button]");

if (year) {
  year.textContent = new Date().getFullYear();
}

let lastScrollY = window.scrollY;
const setHeaderState = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 8);
  if (header) {
    if (y > lastScrollY && y > 140) {
      // scrolling down — hide
      header.classList.add("is-hidden");
    } else if (y < lastScrollY - 4 || y <= 8) {
      // scrolling up (or at the very top) — show
      header.classList.remove("is-hidden");
    }
  }
  lastScrollY = y;
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

brandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isActive = button.getAttribute("aria-pressed") === "true";

    button.classList.toggle("is-active", !isActive);
    button.setAttribute("aria-pressed", String(!isActive));
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => observer.observe(item));

// Fallback: some embedded/preview contexts never fire IntersectionObserver,
// which would leave .reveal content stuck invisible. Reveal items as they
// enter the viewport via scroll/load, and guarantee everything shows shortly
// after load so content is never permanently hidden.
const revealInView = () => {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < vh * 0.94 && rect.bottom > 0) {
      item.classList.add("is-visible");
    }
  });
};

revealInView();
window.addEventListener("load", () => {
  revealInView();
  setTimeout(revealInView, 250);
});
window.addEventListener("scroll", revealInView, { passive: true });
setTimeout(() => revealItems.forEach((item) => item.classList.add("is-visible")), 1600);
