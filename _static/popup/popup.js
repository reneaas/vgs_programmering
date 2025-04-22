console.log("✅ popup.js loaded");

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".popup-wrapper").forEach(wrapper => {
    const trigger = wrapper.querySelector(".popup-trigger");
    const bubble = wrapper.querySelector(".popup-bubble");

    if (!trigger || !bubble) return;

    let hideTimeout;

    const showBubble = () => {
      clearTimeout(hideTimeout);
      document.querySelectorAll(".popup-bubble").forEach(b => b.style.display = "none");
      bubble.style.display = "block";

      if (window.renderMathInElement) {
        renderMathInElement(bubble, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      }
    };

    const hideBubble = () => {
      hideTimeout = setTimeout(() => {
        bubble.style.display = "none";
      }, 200);
    };

    // Click toggle
    trigger.addEventListener("click", e => {
      e.stopPropagation();
      const visible = bubble.style.display === "block";
      document.querySelectorAll(".popup-bubble").forEach(b => b.style.display = "none");
      if (!visible) showBubble();
    });

    // Hover
    trigger.addEventListener("mouseenter", showBubble);
    trigger.addEventListener("mouseleave", hideBubble);
    bubble.addEventListener("mouseenter", () => clearTimeout(hideTimeout));
    bubble.addEventListener("mouseleave", hideBubble);

    // Global close
    document.addEventListener("click", () => bubble.style.display = "none");
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        bubble.style.display = "none";
      }
    });

    // ✅ Render math in the trigger label itself
    if (window.renderMathInElement) {
      renderMathInElement(trigger, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    }
  });
});
