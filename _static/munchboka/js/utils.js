// Placeholder JS to verify asset registration
window.munchbokaEdutools = window.munchbokaEdutools || {};
console.debug("munchboka-edutools: utils.js loaded");

(function () {
	function renderKatexInTables(root) {
		if (!root) root = document;
		if (typeof window.renderMathInElement !== "function") return false;

		const containers = root.querySelectorAll(
			".munchboka-table-container table[data-katex='true']"
		);
		if (!containers || containers.length === 0) return true;

		containers.forEach((el) => {
			if (el && el.dataset && el.dataset.katexRendered === "true") return;
			try {
				window.renderMathInElement(el, {
					delimiters: [
						{ left: "$$", right: "$$", display: true },
						{ left: "\\(", right: "\\)", display: false },
						{ left: "$", right: "$", display: false },
					],
					throwOnError: false,
				});
				if (el && el.dataset) el.dataset.katexRendered = "true";
			} catch (_e) {
				// Non-fatal: if KaTeX fails, leave raw text.
			}
		});

		return true;
	}

	function scheduleKatexRendering() {
		// KaTeX auto-render may load after this file; retry for a bit.
		let tries = 0;
		(function retry() {
			tries += 1;
			const ok = renderKatexInTables(document);
			if (ok || tries >= 80) return;
			setTimeout(retry, 150);
		})();
	}

	document.addEventListener("DOMContentLoaded", function () {
		scheduleKatexRendering();

		// Render tables that may appear later (e.g. dynamic tabs/dropdowns).
		try {
			const obs = new MutationObserver(function (mutations) {
				for (const m of mutations) {
					if (!m.addedNodes) continue;
					for (const n of m.addedNodes) {
						if (!(n instanceof Element)) continue;
						// Fast path: if a table was inserted, render under it.
						if (
							n.matches &&
							(n.matches(".munchboka-table-container") ||
								n.matches("table[data-katex='true']") ||
								n.querySelector?.("table[data-katex='true']"))
						) {
							renderKatexInTables(n);
						}
					}
				}
			});
			obs.observe(document.body, { childList: true, subtree: true });
		} catch (_e) {
			// Non-fatal
		}
	});

	// One extra attempt once everything is loaded.
	window.addEventListener("load", function () {
		scheduleKatexRendering();
	});
})();
