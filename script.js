const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

document.querySelectorAll("[data-project-gallery]").forEach((gallery) => {
  const primary = gallery.querySelector(".project-image-primary");
  const secondary = gallery.querySelector(".project-image-secondary");

  function showImage(showSecondary) {
    gallery.classList.toggle("is-secondary", showSecondary);
    gallery.setAttribute("aria-pressed", String(showSecondary));
    primary.setAttribute("aria-hidden", String(showSecondary));
    secondary.setAttribute("aria-hidden", String(!showSecondary));
  }

  gallery.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") showImage(true);
  });
  gallery.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") showImage(false);
  });
  gallery.addEventListener("click", () => {
    showImage(!gallery.classList.contains("is-secondary"));
  });
  gallery.addEventListener("blur", () => showImage(false));
});
