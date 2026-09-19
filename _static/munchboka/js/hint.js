(function () {
  "use strict";

  var TOGGLES = [
    {
      buttonClass: "hint-toggle",
      contentClass: "hint-content",
      hideLabel: "Skjul",
    },
  ];

  function cancelContentTransition(content) {
    if (content._munchbokaToggleCleanup) {
      content.removeEventListener("transitionend", content._munchbokaToggleCleanup);
      content._munchbokaToggleCleanup = null;
    }
    content.style.transition = "";
  }

  function openContent(content, wrapper) {
    cancelContentTransition(content);
    var currentHeight = content.getBoundingClientRect().height;
    content.style.display = "block";
    content.style.height = currentHeight + "px";
    content.style.overflow = "hidden";
    // Force reflow so the height transition fires from the measured height.
    content.getBoundingClientRect();
    content.style.transition = "height 0.3s ease";
    content.style.height = content.scrollHeight + "px";
    if (wrapper) wrapper.classList.add("is-open");
    content._munchbokaToggleCleanup = function cleanup(event) {
      if (event.target !== content || event.propertyName !== "height") {
        return;
      }
      content.style.height = "";
      content.style.overflow = "";
      content.style.transition = "";
      content._munchbokaToggleCleanup = null;
      content.removeEventListener("transitionend", cleanup);
    };
    content.addEventListener("transitionend", content._munchbokaToggleCleanup);
  }

  function closeContent(content, wrapper) {
    cancelContentTransition(content);
    content.style.height = content.getBoundingClientRect().height + "px";
    content.style.overflow = "hidden";
    // Force reflow so the transition fires from the measured height
    content.getBoundingClientRect();
    content.style.transition = "height 0.3s ease";
    content.style.height = "0";
    if (wrapper) wrapper.classList.remove("is-open");
    content._munchbokaToggleCleanup = function cleanup(event) {
      if (event.target !== content || event.propertyName !== "height") {
        return;
      }
      content.style.display = "none";
      content.style.height = "";
      content.style.overflow = "";
      content.style.transition = "";
      content._munchbokaToggleCleanup = null;
      content.removeEventListener("transitionend", cleanup);
    };
    content.addEventListener("transitionend", content._munchbokaToggleCleanup);
  }

  function initToggle(btn, config) {
    if (btn.dataset.munchbokaToggleBound === "true") {
      return;
    }
    btn.dataset.munchbokaToggleBound = "true";

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
