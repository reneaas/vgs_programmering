

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".popup-wrapper").forEach(wrapper => {
    const trigger = wrapper.querySelector(".popup-trigger");
    const bubble = wrapper.querySelector(".popup-bubble");

    if (!trigger || !bubble) return;

    let hideTimeout;

    // Move bubble to body
    const bodyBubble = bubble.cloneNode(true);
    bodyBubble.style.display = "none";
    document.body.appendChild(bodyBubble);

    const positionBubble = () => {
      const rect = trigger.getBoundingClientRect();
      bodyBubble.style.position = "absolute";
      bodyBubble.style.left = `${rect.left + window.scrollX}px`;
      bodyBubble.style.top = `${rect.bottom + 6 + window.scrollY}px`;
      bodyBubble.style.zIndex = "9999";
    };

    const showBubble = () => {
      clearTimeout(hideTimeout);
      document.querySelectorAll(".popup-bubble").forEach(b => b.style.display = "none");
      positionBubble();
      bodyBubble.style.display = "block";

      if (window.renderMathInElement) {
        renderMathInElement(bodyBubble, {
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
        bodyBubble.style.display = "none";
      }, 200);
    };

    // Click toggle
    trigger.addEventListener("click", e => {
      e.stopPropagation();
      const visible = bodyBubble.style.display === "block";
      document.querySelectorAll(".popup-bubble").forEach(b => b.style.display = "none");
      if (!visible) showBubble();
    });

    // Hover
    trigger.addEventListener("mouseenter", showBubble);
    trigger.addEventListener("mouseleave", hideBubble);
    bodyBubble.addEventListener("mouseenter", () => clearTimeout(hideTimeout));
    bodyBubble.addEventListener("mouseleave", hideBubble);

    // Global close
    document.addEventListener("click", () => bodyBubble.style.display = "none");
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        bodyBubble.style.display = "none";
      }
    });

    // Render math in the trigger
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
