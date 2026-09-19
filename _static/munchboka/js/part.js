(function () {
  "use strict";

  function openBody(body, outer, btn) {
    body.style.display = "block";
    body.style.height = "0";
    body.style.overflow = "hidden";
    body.getBoundingClientRect(); // force reflow
    body.style.transition = "height 0.3s ease";
    body.style.height = body.scrollHeight + "px";
    outer.classList.add("part-open");
    if (btn) btn.textContent = btn.dataset.open;
    body.addEventListener("transitionend", function cleanup() {
      body.style.height = "";
      body.style.overflow = "";
      body.style.transition = "";
      body.removeEventListener("transitionend", cleanup);
    }, { once: true });
  }

  function closeBody(body, outer, btn) {
    body.style.height = body.scrollHeight + "px";
    body.style.overflow = "hidden";
    body.getBoundingClientRect(); // force reflow
    body.style.transition = "height 0.3s ease";
    body.style.height = "0";
    outer.classList.remove("part-open");
    if (btn) btn.textContent = btn.dataset.closed;
    body.addEventListener("transitionend", function cleanup() {
      body.style.display = "none";
      body.style.height = "";
      body.style.overflow = "";
      body.style.transition = "";
      body.removeEventListener("transitionend", cleanup);
    }, { once: true });
  }

  function init() {
    document.querySelectorAll("div.part").forEach(function (outer) {
      var body = outer.querySelector(":scope > .part-body");
      var btn = outer.querySelector("button.part-toggle");
      if (!body) return;

      // Set initial display state without animation
      if (!outer.classList.contains("part-open")) {
        body.style.display = "none";
      }

      if (btn) {
        btn.addEventListener("click", function () {
          var isOpen = body.style.display !== "none";
          if (isOpen) {
            closeBody(body, outer, btn);
          } else {
            openBody(body, outer, btn);
          }
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
