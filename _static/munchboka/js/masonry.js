/* Natural-height cards. The DOM is never reordered or reparented. */
(() => {
    "use strict";
    const printing = window.matchMedia("print");

    function initialize(container) {
        if (container.dataset.masonryInitialized || !window.ResizeObserver) return;
        container.dataset.masonryInitialized = "true";
        const cards = Array.from(container.children).filter(
            child => child.classList.contains("mb-masonry-card")
        );
        if (!cards.length) return;
        const columns = container.dataset.columns.split(/\s+/).map(Number);
        let pending = false;
        let lastWidth = -1;

        function setProperty(element, name, value) {
            if (element.style.getPropertyValue(name) !== value) {
                element.style.setProperty(name, value);
            }
        }

        function layout() {
            pending = false;
            if (printing.matches) return;
            const width = container.clientWidth;
            if (!width) return; // ResizeObserver retries when a hidden tab opens.
            const count = columns.length === 1 ? columns[0]
                : columns[width < 600 ? 0 : width < 900 ? 1 : 2];
            const style = getComputedStyle(container);
            const gap = parseFloat(style.columnGap) || 0;
            const cardWidth = Math.max(0, (width - gap * (count - 1)) / count);
            const heights = Array(count).fill(0);
            const rtl = style.direction === "rtl";
            container.dataset.ready = "true";
            // Apply widths together, then measure all heights in one layout pass.
            cards.forEach(card => setProperty(card, "--mb-card-width", `${cardWidth}px`));
            const sizes = cards.map(card => card.getBoundingClientRect().height);
            cards.forEach((card, index) => {
                const column = container.dataset.placement === "alternating"
                    ? index % count : heights.indexOf(Math.min(...heights));
                const physicalColumn = rtl ? count - column - 1 : column;
                setProperty(card, "--mb-card-left", `${physicalColumn * (cardWidth + gap)}px`);
                setProperty(card, "--mb-card-top", `${heights[column]}px`);
                heights[column] += sizes[index] + gap;
            });
            setProperty(container, "height", `${Math.max(...heights) - gap}px`);
        }

        function schedule() {
            if (!pending) {
                pending = true;
                requestAnimationFrame(layout);
            }
        }

        const observer = new ResizeObserver(entries => {
            let changed = false;
            for (const entry of entries) {
                if (entry.target !== container) changed = true;
                else if (entry.contentRect.width !== lastWidth) {
                    lastWidth = entry.contentRect.width;
                    changed = true;
                }
            }
            if (changed) schedule();
        });
        observer.observe(container);
        cards.forEach(card => observer.observe(card));
        window.addEventListener("resize", schedule);
        printing.addEventListener("change", schedule);
        window.addEventListener("afterprint", schedule);
        schedule();
    }

    function start() {
        document.querySelectorAll(".mb-masonry").forEach(initialize);
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, {once: true});
    } else start();
})();
