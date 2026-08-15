document.addEventListener("click", (event) => {

  const element = event.target.closest("a, button");

  if (!element) return;

  // Buttons that specifically need the loader
  if (element.dataset.loader === "true") {

    const loader = document.getElementById("pageLoader");

    if (loader) {
      loader.classList.remove("hide");
    }

    // Give the animation time to appear
    setTimeout(() => {
      // Do nothing here.
      // buyPlan() will continue normally.
    }, 300);

    return;
  }


  // =========================================
  // NORMAL LINKS
  // =========================================

  if (element.tagName !== "A") return;

  const href = element.getAttribute("href");

  if (
    !href ||
    href === "#" ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:") ||
    element.target === "_blank"
  ) {
    return;
  }

  const loader = document.getElementById("pageLoader");

  if (!loader) return;

  event.preventDefault();

  loader.classList.remove("hide");

  setTimeout(() => {
    window.location.href = href;
  }, 300);

});