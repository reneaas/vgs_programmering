(function () {
  const DEFAULT_DELAY_SECONDS = 300;
  const VISIBILITY_THRESHOLD = 0.01;
  const START_MARGIN_PX = 240;
  const UPDATE_INTERVAL_MS = 1000;

  // Map: div.solution-2 element → entry
  const stateByElement = new Map();
  // Set of trigger elements already passed to visibilityObserver.observe()
  const observedTriggers = new Set();

  let activeModal = null;
  let modalElements = null;
  let visibilityObserver = null;

  function createState() {
    return {
      startedAt: null,
      bypassed: false,
    };
  }

  function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;

    if (minutes <= 0) {
      return `${remainder} sek`;
    }

    if (remainder === 0) {
      return `${minutes} min`;
    }

    return `${minutes} min ${remainder} s`;
  }

  function elapsedSeconds(entry) {
    if (!entry.state.startedAt) return 0;
    return Math.max(0, Math.floor((Date.now() - entry.state.startedAt) / 1000));
  }

  function remainingSeconds(entry) {
    return Math.max(0, entry.delaySeconds - elapsedSeconds(entry));
  }

  function isLocked(entry) {
    if (entry.delaySeconds <= 0) return false;
    if (entry.state.bypassed) return false;
    if (!entry.state.startedAt) return false;
    return remainingSeconds(entry) > 0;
  }

  function ensureStatusNode(entry) {
    if (entry.statusNode && entry.statusNode.isConnected) {
      return entry.statusNode;
    }

    const statusNode = document.createElement("div");
    statusNode.className = "solution-lock-status";
    statusNode.setAttribute("aria-live", "polite");
    entry.statusNode = statusNode;
    // Append to the wrapper — NOT between button and content, because
    // solution2.js uses btn.nextElementSibling to find the content div
    // and would break if we insert anything in between.
    entry.element.appendChild(statusNode);
    return statusNode;
  }

  function updateStatus(entry) {
    const statusNode = ensureStatusNode(entry);
    const started = Boolean(entry.state.startedAt);

    if (isLocked(entry)) {
      entry.element.classList.add("solution-soft-locked");
      statusNode.hidden = false;
      statusNode.textContent = `Løsningsforslag åpnes automatisk om ${formatDuration(remainingSeconds(entry))}. Du bør prøve litt til før du sjekker løsningsforslaget.`;
      return;
    }

    entry.element.classList.remove("solution-soft-locked");
    if (!started && entry.delaySeconds > 0) {
      statusNode.hidden = false;
      statusNode.textContent = `Løsningsforslag åpnes automatisk om ${formatDuration(entry.delaySeconds)}. Du bør prøve litt til før du sjekker løsningsforslaget.`;
      return;
    }

    statusNode.hidden = true;
    statusNode.textContent = "";
  }

  function ensureStarted(entry) {
    if (entry.delaySeconds <= 0 || entry.state.startedAt) {
      return;
    }

    entry.state.startedAt = Date.now();
    updateStatus(entry);
    updateModal();
  }

  function isNearViewport(element) {
    if (!(element instanceof Element)) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;

    return rect.top <= viewportHeight + START_MARGIN_PX && rect.bottom >= -START_MARGIN_PX;
  }

  function startVisibleSolutions() {
    stateByElement.forEach((entry) => {
      if (entry.state.startedAt) {
        return;
      }

      if (isNearViewport(entry.triggerElement)) {
        ensureStarted(entry);
      }
    });
  }

  // Open the solution by simulating a click on the toggle button.
  // Because bypassed=true at call time, isLocked() will be false in the
  // capture handler so the click flows through to solution2.js normally.
  function openSolution(entry) {
    if (entry.toggleBtn.getAttribute("aria-expanded") !== "true") {
      entry.toggleBtn.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, view: window })
      );
    }
  }

  function closeModal() {
    if (!modalElements) return;
    modalElements.backdrop.hidden = true;
    activeModal = null;
  }

  function ensureModal() {
    if (modalElements) {
      return modalElements;
    }

    const backdrop = document.createElement("div");
    backdrop.className = "solution-lock-modal-backdrop";
    backdrop.hidden = true;

    const dialog = document.createElement("div");
    dialog.className = "solution-lock-modal";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "solution-lock-modal-title");

    dialog.innerHTML = `
      <h3 id="solution-lock-modal-title">Vent litt med løsningen</h3>
      <p class="solution-lock-modal-text">
        Du har bare prøvd på oppgaven i <strong data-role="tried"></strong>.
        Du bør gi deg selv <strong data-role="remaining"></strong> til på å prøve først før du ser på løsningen.
      </p>
      <p class="solution-lock-modal-countdown" data-role="countdown"></p>
      <div class="solution-lock-modal-actions">
        <button type="button" class="solution-lock-modal-button secondary" data-action="cancel">Fortsett å prøve</button>
        <button type="button" class="solution-lock-modal-button primary" data-action="override">Vis løsning nå</button>
      </div>
    `;

    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        closeModal();
      }
    });

    dialog.querySelector("[data-action='cancel']").addEventListener("click", () => {
      closeModal();
    });

    dialog.querySelector("[data-action='override']").addEventListener("click", () => {
      if (!activeModal) return;
      const entry = activeModal;
      entry.state.bypassed = true;
      updateStatus(entry);
      closeModal();
      openSolution(entry);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && activeModal) {
        closeModal();
      }
    });

    modalElements = {
      backdrop,
      tried: dialog.querySelector("[data-role='tried']"),
      remaining: dialog.querySelector("[data-role='remaining']"),
      countdown: dialog.querySelector("[data-role='countdown']"),
    };

    return modalElements;
  }

  function updateModal() {
    if (!activeModal || !modalElements) return;

    const tried = elapsedSeconds(activeModal);
    const remaining = remainingSeconds(activeModal);

    if (!isLocked(activeModal)) {
      const entry = activeModal;
      closeModal();
      openSolution(entry);
      return;
    }

    modalElements.tried.textContent = formatDuration(tried);
    modalElements.remaining.textContent = formatDuration(remaining);
    modalElements.countdown.textContent = `Nedtelling: ${formatDuration(remaining)}`;
  }

  function openModal(entry) {
    ensureModal();
    activeModal = entry;
    modalElements.backdrop.hidden = false;
    updateModal();
  }

  function handleLockedClick(entry, event) {
    // If not started yet, start the timer on first interaction
    if (entry.delaySeconds > 0 && !entry.state.startedAt) {
      ensureStarted(entry);
    }

    if (!isLocked(entry)) {
      return; // let the event through to solution2.js
    }

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
    openModal(entry);
  }

  function registerSolution(element) {
    if (stateByElement.has(element)) {
      return;
    }

    const toggleBtn = element.querySelector(":scope > button.solution-2-toggle");
    if (!toggleBtn) return;

    const rawDelay = toggleBtn.dataset.delaySeconds;
    if (!rawDelay) return; // no timer for this solution

    const delaySeconds = parseInt(rawDelay, 10);
    if (!(delaySeconds > 0)) return;

    // Start the timer when the nearest parent answer block becomes visible.
    // The answer directive now renders as div.answer-2; fall back to the
    // solution-2 element itself when there is no enclosing answer.
    const answerParent = element.closest(".answer-2");
    const triggerElement = answerParent || element;

    const solutionId =
      element.dataset.solutionId ||
      element.id ||
      `solution-${stateByElement.size + 1}`;

    const entry = {
      element,       // div.solution-2
      toggleBtn,     // button.solution-2-toggle
      triggerElement, // what the IntersectionObserver watches
      statusNode: null,
      solutionId,
      delaySeconds: Number.isFinite(delaySeconds) ? delaySeconds : DEFAULT_DELAY_SECONDS,
      state: createState(),
    };

    stateByElement.set(element, entry);

    // Intercept button clicks in the capture phase so we can block them
    // before solution2.js's bubble-phase handler fires.
    toggleBtn.addEventListener(
      "click",
      (event) => {
        handleLockedClick(entry, event);
      },
      true
    );

    toggleBtn.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        handleLockedClick(entry, event);
      },
      true
    );

    if (visibilityObserver && !observedTriggers.has(triggerElement)) {
      visibilityObserver.observe(triggerElement);
      observedTriggers.add(triggerElement);
    }

    updateStatus(entry);
  }

  function observeSolutions() {
    if (!("IntersectionObserver" in window)) {
      visibilityObserver = null;
      startVisibleSolutions();
      window.addEventListener("scroll", startVisibleSolutions, { passive: true });
      window.addEventListener("resize", startVisibleSolutions);
      return;
    }

    visibilityObserver = new IntersectionObserver(
      (observerEntries) => {
        observerEntries.forEach((observerEntry) => {
          if (!observerEntry.isIntersecting) return;
          if (observerEntry.intersectionRatio < VISIBILITY_THRESHOLD) return;

          // Start all solution entries that use this trigger element
          stateByElement.forEach((entry) => {
            if (entry.triggerElement === observerEntry.target) {
              ensureStarted(entry);
            }
          });

          visibilityObserver.unobserve(observerEntry.target);
        });
      },
      {
        threshold: [VISIBILITY_THRESHOLD],
        rootMargin: `${START_MARGIN_PX}px 0px ${START_MARGIN_PX}px 0px`,
      }
    );

    stateByElement.forEach((entry) => {
      if (!observedTriggers.has(entry.triggerElement)) {
        visibilityObserver.observe(entry.triggerElement);
        observedTriggers.add(entry.triggerElement);
      }
    });

    startVisibleSolutions();
  }

  function initializeSolutions(root = document) {
    if (!(root instanceof Element) && root !== document) {
      return;
    }

    const buttons =
      root === document
        ? root.querySelectorAll("button.solution-2-toggle[data-delay-seconds]")
        : root.matches("button.solution-2-toggle[data-delay-seconds]")
          ? [root]
          : root.querySelectorAll("button.solution-2-toggle[data-delay-seconds]");

    buttons.forEach((btn) => {
      const wrapper = btn.parentElement;
      if (wrapper && wrapper.classList.contains("solution-2")) {
        registerSolution(wrapper);
      }
    });
  }

  function observeDocument() {
    if (!document.body) {
      return;
    }

    const documentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) {
            return;
          }

          initializeSolutions(node);
        });
      });
    });

    documentObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function tick() {
    stateByElement.forEach((entry) => updateStatus(entry));
    updateModal();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initializeSolutions(document);
    observeSolutions();
    observeDocument();
    window.setInterval(tick, UPDATE_INTERVAL_MS);
  });
})();

