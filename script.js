const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function setNavState(isOpen) {
  nav.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

navToggle.addEventListener("click", () => {
  setNavState(!nav.classList.contains("open"));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    setNavState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    setNavState(false);
    navToggle.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980 && nav.classList.contains("open")) {
    setNavState(false);
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

document.querySelectorAll("[data-project-gallery]").forEach((gallery) => {
  const primary = gallery.querySelector(".project-image-primary");
  const secondary = gallery.querySelector(".project-image-secondary");

  function showImage(showSecondary) {
    gallery.classList.toggle("is-secondary", showSecondary);
    primary.setAttribute("aria-hidden", String(showSecondary));
    secondary.setAttribute("aria-hidden", String(!showSecondary));
  }

  gallery.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") showImage(true);
  });
  gallery.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") showImage(false);
  });
  gallery.addEventListener("blur", () => showImage(false));
});

const lightbox = document.querySelector("[data-lightbox]");

if (lightbox) {
  const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
  const lightboxTitle = lightbox.querySelector("[data-lightbox-title]");
  const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
  const lightboxCounter = lightbox.querySelector("[data-lightbox-counter]");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  const previousButton = lightbox.querySelector("[data-lightbox-prev]");
  const nextButton = lightbox.querySelector("[data-lightbox-next]");

  let galleryImages = [];
  let currentImageIndex = 0;
  let activeTrigger = null;

  function updateLightbox() {
    const currentImage = galleryImages[currentImageIndex];
    const hasMultipleImages = galleryImages.length > 1;

    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt;
    lightboxCaption.textContent = currentImage.alt;
    lightboxCounter.textContent = `${currentImageIndex + 1} de ${galleryImages.length}`;
    previousButton.hidden = !hasMultipleImages;
    nextButton.hidden = !hasMultipleImages;
  }

  function changeImage(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    updateLightbox();
  }

  document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      activeTrigger = trigger;
      galleryImages = Array.from(trigger.querySelectorAll("img")).map((image) => ({
        src: image.currentSrc || image.src,
        alt: image.alt,
      }));
      currentImageIndex = 0;
      lightboxTitle.textContent = trigger.dataset.lightboxTitle;
      updateLightbox();
      document.body.classList.add("lightbox-open");
      lightbox.showModal();
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", () => lightbox.close());
  previousButton.addEventListener("click", () => changeImage(-1));
  nextButton.addEventListener("click", () => changeImage(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener("keydown", (event) => {
    if (galleryImages.length < 2) return;
    if (event.key === "ArrowLeft") changeImage(-1);
    if (event.key === "ArrowRight") changeImage(1);
  });

  lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    if (activeTrigger) activeTrigger.focus();
  });
}
