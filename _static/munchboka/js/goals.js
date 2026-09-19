(function () {
  "use strict";

  var TOGGLES = [
    {
      buttonClass: "goals-toggle",
      contentClass: "goals-content",
      hideLabel: "Skjul",
    },
  ];

  function openContent(content, wrapper) {
    content.style.display = "block";
    content.style.height = "0";
    content.style.overflow = "hidden";
    // Force reflow so the height transition fires from 0
    content.getBoundingClientRect();
    content.style.transition = "height 0.3s ease";
    content.style.height = content.scrollHeight + "px";
    if (wrapper) wrapper.classList.add("is-open");
    content.addEventListener("transitionend", function cleanup() {
      content.style.height = "";
      content.style.overflow = "";
      content.style.transition = "";
      content.removeEventListener("transitionend", cleanup);
    }, { once: true });
  }

  function closeContent(content, wrapper) {
    content.style.height = content.scrollHeight + "px";
    content.style.overflow = "hidden";
    // Force reflow so the transition fires from the measured height
    content.getBoundingClientRect();
    content.style.transition = "height 0.3s ease";
    content.style.height = "0";
    if (wrapper) wrapper.classList.remove("is-open");
    content.addEventListener("transitionend", function cleanup() {
      content.style.display = "none";
      content.style.height = "";
      content.style.overflow = "";
      content.style.transition = "";
      content.removeEventListener("transitionend", cleanup);
    }, { once: true });
  }

  function initToggle(btn, config) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var content = btn.nextElementSibling;
      var wrapper = btn.parentElement;
      if (!content || !content.classList.contains(config.contentClass)) {
        return;
      }

      if (expanded) {
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = btn.dataset.label;
        closeContent(content, wrapper);
      } else {
        btn.setAttribute("aria-expanded", "true");
        btn.textContent = config.hideLabel;
        openContent(content, wrapper);
      }
    });
  }

  function init() {
    TOGGLES.forEach(function (config) {
      document.querySelectorAll("button." + config.buttonClass).forEach(function (btn) {
        initToggle(btn, config);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
