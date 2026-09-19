(function () {
  const STORAGE_KEY = "od-enabled";
  function setEnabled(on) {
    const root = document.documentElement;
    root.classList.toggle("od-enabled", !!on);
    const btn = document.getElementById("od-toggle");
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");
    try { localStorage.setItem(STORAGE_KEY, on ? "1" : "0"); } catch (_) {}
  }
  function getEnabled() {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch (_) { return false; }
  }
  function ensureButton() {
    // Prefer an existing icon_links anchor with title “Accessibility”
    let btn = document.querySelector('a[title="Accessibility"]');
    const themeBtn = document.querySelector('button.theme-switch-button, [data-theme-switch]');
    if (btn) {
      btn.id = "od-toggle";
      btn.setAttribute("role", "button");
      btn.setAttribute("aria-pressed", "false");
      // Place it to the left of the theme toggle
      if (themeBtn && themeBtn.parentNode) {
        themeBtn.parentNode.insertBefore(btn, themeBtn);
      }
      return btn;
    }
    if (!themeBtn) return null;
    // Otherwise, insert a new button to the left of the theme toggle
    btn = document.createElement("a");
    btn.href = "javascript:void(0)";
    btn.id = "od-toggle";
    btn.title = "Accessibility";
    btn.className = "headerbtn od-toggle";
    btn.setAttribute("role", "button");
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = '<i class="fa-solid fa-universal-access fa-xl"></i>';
    themeBtn.parentNode.insertBefore(btn, themeBtn); // insert before = to the left
    return btn;
  }
  function init() {
    const enabled = getEnabled();
    setEnabled(enabled);
    let btn = document.getElementById("od-toggle") || ensureButton();
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      setEnabled(!document.documentElement.classList.contains("od-enabled"));
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();