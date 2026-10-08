(function () {
    "use strict";

    var PALETTE = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c", "#0891b2"];

    // Every JSXGraph text element (point/axis labels, free text) renders through KaTeX.
    if (window.JXG) JXG.Options.text.useKatex = true;

    function numberOr(value, fallback) {
        var n = parseFloat(value);
        return Number.isFinite(n) ? n : fallback;
    }

    // KaTeX treats the whole string as math source; accept an optional $...$
    // wrapper (matching the `plot` directive's convention) and strip it.
    function toKatexSource(raw) {
        var text = (raw || "").trim();
        var m = /^\$(.*)\$$/.exec(text);
        return m ? m[1] : text;
    }

    // Load the isolated TeX-to-path renderer only when an SVG is requested.
    var mathSvgUrl = new URL("../vendor/mathjax-fbd/tex-svg.min.js", document.currentScript.src).href;
    var mathSvgPromise = null;
    function getMathSvgForExport() {
        if (window.MunchFbdMathSvg) return Promise.resolve(window.MunchFbdMathSvg);
        if (!mathSvgPromise) {
            mathSvgPromise = new Promise(function (resolve, reject) {
                var script = document.createElement("script");
                script.src = mathSvgUrl;
                script.onload = function () { resolve(window.MunchFbdMathSvg); };
                script.onerror = function () {
                    script.remove();
                    mathSvgPromise = null;
                    reject(new Error("Kunne ikke laste matematikk for SVG-eksport."));
                };
                document.head.appendChild(script);
            });
        }
        return mathSvgPromise;
    }

    // HTML/foreignObject labels rely on browser layout and are ignored by many
    // SVG viewers. Export each formula as self-contained vector paths instead.
    function buildStandaloneSvg(board, renderer) {
        var liveSvg = board.renderer.svgRoot;
        var rect = liveSvg.getBoundingClientRect();
        var svg = liveSvg.cloneNode(true);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg.querySelectorAll("foreignObject").forEach(function (node) { node.remove(); });
        var width = board.canvasWidth, height = board.canvasHeight;
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.setAttribute("viewBox", "0 0 " + width + " " + height);

        // KaTeX retains the original TeX in each HTML label's annotation.
        // Native SVG labels (including ticks) are already present in the clone.
        liveSvg.parentNode.querySelectorAll(".JXGtext").forEach(function (node) {
            if (liveSvg.contains(node)) return;
            var r = node.getBoundingClientRect();
            if (!r.width || !r.height) return;
            var annotation = node.querySelector('annotation[encoding="application/x-tex"]');
            var style = getComputedStyle(node.querySelector(".katex") || node);
            if (style.visibility === "hidden" || style.display === "none") return;
            if (!annotation) {
                // Keep ordinary (or invalid-TeX fallback) text visible as SVG text.
                var plain = document.createElementNS("http://www.w3.org/2000/svg", "text");
                plain.textContent = node.textContent;
                plain.setAttribute("x", (r.left + r.width / 2 - rect.left) * width / rect.width);
                plain.setAttribute("y", (r.top + r.height / 2 - rect.top) * height / rect.height);
                plain.setAttribute("text-anchor", "middle");
                plain.setAttribute("dominant-baseline", "central");
                plain.setAttribute("font-size", style.fontSize);
                plain.setAttribute("font-family", style.fontFamily);
                plain.setAttribute("fill", style.color);
                svg.appendChild(plain);
                return;
            }
            var source = annotation.textContent;
            var formula = new DOMParser().parseFromString(renderer.render(source), "image/svg+xml").documentElement;
            var bounds = formula.getAttribute("viewBox").split(/\s+/).map(Number);
            // MathJax's viewBox uses 1000 units per em. Preserve the live label's
            // visual centre, size and colour, including CSS-scaled boards.
            var em = parseFloat(style.fontSize);
            var w = bounds[2] * em / 1000, h = bounds[3] * em / 1000;
            formula.setAttribute("x", (r.left + r.width / 2 - rect.left) * width / rect.width - w / 2);
            formula.setAttribute("y", (r.top + r.height / 2 - rect.top) * height / rect.height - h / 2);
            formula.setAttribute("width", w);
            formula.setAttribute("height", h);
            formula.removeAttribute("style");
            formula.setAttribute("color", style.color);
            formula.setAttribute("overflow", "visible");
            formula.setAttribute("aria-label", source);
            svg.appendChild(document.importNode(formula, true));
        });
        return new XMLSerializer().serializeToString(svg);
    }

    function el(tag, attrs, children) {
        var node = document.createElement(tag);
        if (attrs) for (var key in attrs) {
            if (key === "text") node.textContent = attrs[key];
            else node.setAttribute(key, attrs[key]);
        }
        (children || []).forEach(function (child) { node.appendChild(child); });
        return node;
    }

    function makeRow(fields, onRemove) {
        var row = el("div", {class: "plot-builder-row"});
        fields.forEach(function (field) { row.appendChild(field); });
        var remove = el("button", {type: "button", class: "plot-builder-remove", "aria-label": "Fjern"});
        remove.textContent = "✕";
        remove.addEventListener("click", onRemove);
        row.appendChild(remove);
        return row;
    }

    function initialize(host) {
        if (host.dataset.initialized) return;
        host.dataset.initialized = "true";
        host.textContent = "";

        var boardId = (host.id || "plot-builder") + "-board";
        var state = {board: null, colorIndex: 0};

        var layout = el("div", {class: "plot-builder-layout"});
        var controls = el("div", {class: "plot-builder-controls"});
        var fieldsets = el("div", {class: "plot-builder-fieldsets"});
        var boardWrap = el("div", {class: "plot-builder-board-wrap"});
        var boardWidth = host.dataset.boardWidth || "640px";
        var boardHeight = parseFloat(host.dataset.boardHeight) || 480;
        var boardEl = el("div", {
            class: "plot-builder-board", id: boardId,
            // Shrinks to fit a narrow container, but never exceeds the configured size,
            // keeping its aspect ratio intact either way.
            style: "max-width:" + boardWidth + ";aspect-ratio:" + (parseFloat(boardWidth) || 640) + "/" + boardHeight
        });
        var status = el("div", {class: "plot-builder-status"});
        boardWrap.appendChild(boardEl);
        boardWrap.appendChild(status);
        controls.appendChild(fieldsets);
        layout.appendChild(controls);
        layout.appendChild(boardWrap);
        host.appendChild(layout);

        // --- Range + ticks ---
        var rangeFieldset = el("fieldset", {}, [el("legend", {text: "Koordinatsystem"})]);
        var rangeGrid = el("div", {class: "plot-builder-range-grid"});
        function rangeInput(labelText, value) {
            var wrap = el("div");
            wrap.appendChild(el("label", {text: labelText}));
            var input = el("input", {type: "number", step: "any", value: value});
            wrap.appendChild(input);
            rangeGrid.appendChild(wrap);
            return input;
        }
        var xminInput = rangeInput("xmin", "-10");
        var xmaxInput = rangeInput("xmax", "10");
        var yminInput = rangeInput("ymin", "-10");
        var ymaxInput = rangeInput("ymax", "10");
        var xtickInput = rangeInput("x-steg", "1");
        var ytickInput = rangeInput("y-steg", "1");
        rangeFieldset.appendChild(rangeGrid);
        var xlabelInput = el("input", {type: "text", placeholder: "f.eks. $x$"});
        var ylabelInput = el("input", {type: "text", placeholder: "f.eks. $y$"});
        var labelRow = el("div", {class: "plot-builder-range-grid"});
        [["x-akse", xlabelInput], ["y-akse", ylabelInput]].forEach(function (pair) {
            var wrap = el("div");
            wrap.appendChild(el("label", {text: pair[0]}));
            wrap.appendChild(pair[1]);
            labelRow.appendChild(wrap);
        });
        rangeFieldset.appendChild(labelRow);
        fieldsets.appendChild(rangeFieldset);

        // --- Functions ---
        var fnFieldset = el("fieldset", {}, [el("legend", {text: "Funksjoner"})]);
        var fnList = el("div");
        fnFieldset.appendChild(fnList);
        var addFnBtn = el("button", {type: "button", class: "plot-builder-add"});
        addFnBtn.textContent = "+ Legg til funksjon";
        fnFieldset.appendChild(addFnBtn);
        fieldsets.appendChild(fnFieldset);
        var fnRows = [];

        function addFunctionRow(expr) {
            var color = PALETTE[state.colorIndex % PALETTE.length];
            state.colorIndex++;
            var colorInput = el("input", {type: "color", value: color, title: "Farge"});
            var exprInput = el("input", {type: "text", placeholder: "f.eks. x^2 - 2*x", value: expr || ""});
            var domainFromInput = el("input", {type: "number", step: "any", class: "plot-builder-domain", placeholder: "fra"});
            var domainToInput = el("input", {type: "number", step: "any", class: "plot-builder-domain", placeholder: "til"});
            var error = el("span", {class: "plot-builder-error"});
            var rowData = {
                colorInput: colorInput, exprInput: exprInput,
                domainFromInput: domainFromInput, domainToInput: domainToInput, error: error
            };
            var row = makeRow([colorInput, exprInput, el("span", {class: "plot-builder-domain-label", text: "domene:"}), domainFromInput, domainToInput], function () {
                fnRows = fnRows.filter(function (r) { return r !== rowData; });
                wrapper.remove();
                scheduleRebuild();
            });
            var wrapper = el("div");
            wrapper.appendChild(row);
            wrapper.appendChild(error);
            fnList.appendChild(wrapper);
            rowData.wrapper = wrapper;
            fnRows.push(rowData);
            scheduleRebuild();
        }
        addFnBtn.addEventListener("click", function () { addFunctionRow(""); });

        // --- Points ---
        var ptFieldset = el("fieldset", {}, [el("legend", {text: "Punkter"})]);
        var ptList = el("div");
        ptFieldset.appendChild(ptList);
        var addPtBtn = el("button", {type: "button", class: "plot-builder-add"});
        addPtBtn.textContent = "+ Legg til punkt";
        ptFieldset.appendChild(addPtBtn);
        fieldsets.appendChild(ptFieldset);
        var ptRows = [];

        function addPointRow() {
            var xInput = el("input", {type: "number", step: "any", class: "plot-builder-xy", placeholder: "x", value: "0"});
            var yInput = el("input", {type: "number", step: "any", class: "plot-builder-xy", placeholder: "y", value: "0"});
            var labelInput = el("input", {type: "text", placeholder: "navn (valgfritt)"});
            var rowData = {xInput: xInput, yInput: yInput, labelInput: labelInput};
            var row = makeRow([xInput, yInput, labelInput], function () {
                ptRows = ptRows.filter(function (r) { return r !== rowData; });
                row.remove();
                scheduleRebuild();
            });
            ptList.appendChild(row);
            ptRows.push(rowData);
            scheduleRebuild();
        }
        addPtBtn.addEventListener("click", addPointRow);

        // --- Text labels ---
        var txtFieldset = el("fieldset", {}, [el("legend", {text: "Tekst"})]);
        var txtList = el("div");
        txtFieldset.appendChild(txtList);
        var addTxtBtn = el("button", {type: "button", class: "plot-builder-add"});
        addTxtBtn.textContent = "+ Legg til tekst";
        txtFieldset.appendChild(addTxtBtn);
        fieldsets.appendChild(txtFieldset);
        var txtRows = [];

        function addTextRow() {
            var xInput = el("input", {type: "number", step: "any", class: "plot-builder-xy", placeholder: "x", value: "0"});
            var yInput = el("input", {type: "number", step: "any", class: "plot-builder-xy", placeholder: "y", value: "0"});
            var textInput = el("input", {type: "text", placeholder: "tekst"});
            var rowData = {xInput: xInput, yInput: yInput, textInput: textInput};
            var row = makeRow([xInput, yInput, textInput], function () {
                txtRows = txtRows.filter(function (r) { return r !== rowData; });
                row.remove();
                scheduleRebuild();
            });
            txtList.appendChild(row);
            txtRows.push(rowData);
            scheduleRebuild();
        }
        addTxtBtn.addEventListener("click", addTextRow);

        // --- Download ---
        var downloadBtn = el("button", {type: "button", class: "plot-builder-download"});
        downloadBtn.textContent = "Last ned som SVG";
        downloadBtn.addEventListener("click", function () { downloadSvg(); });
        controls.appendChild(downloadBtn);

        function downloadSvg() {
            if (!state.board) return;
            downloadBtn.disabled = true;
            getMathSvgForExport().then(function (renderer) {
                return document.fonts.ready.then(function () { return renderer; });
            }).then(function (renderer) {
                var source = buildStandaloneSvg(state.board, renderer);
                if (!/^<\?xml/.test(source)) source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
                var blob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
                var url = URL.createObjectURL(blob);
                var a = el("a", {href: url, download: "plot.svg"});
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
            }).catch(function (err) {
                status.textContent = "Kunne ikke eksportere SVG: " + err.message;
            }).finally(function () {
                downloadBtn.disabled = false;
            });
        }

        // --- Rebuild ---
        var rebuildTimer = null;
        function scheduleRebuild() {
            if (rebuildTimer) clearTimeout(rebuildTimer);
            rebuildTimer = setTimeout(rebuild, 120);
        }
        controls.addEventListener("input", scheduleRebuild);

        function rebuild() {
            var xmin = numberOr(xminInput.value, -10);
            var xmax = numberOr(xmaxInput.value, 10);
            var ymin = numberOr(yminInput.value, -10);
            var ymax = numberOr(ymaxInput.value, 10);
            var xtick = Math.abs(numberOr(xtickInput.value, 1)) || 1;
            var ytick = Math.abs(numberOr(ytickInput.value, 1)) || 1;

            if (!(xmax > xmin) || !(ymax > ymin)) {
                status.textContent = "xmax må være større enn xmin, og ymax større enn ymin.";
                return;
            }
            status.textContent = "";

            if (!window.JXG) {
                status.textContent = "JSXGraph kunne ikke lastes.";
                return;
            }

            if (state.board) {
                try { JXG.JSXGraph.freeBoard(state.board); } catch (e) { /* ignore */ }
                state.board = null;
            }

            var board = JXG.JSXGraph.initBoard(boardId, {
                boundingbox: [xmin, ymax, xmax, ymin],
                axis: true,
                showCopyright: false,
                showNavigation: false,
                keepaspectratio: false,
                pan: {enabled: false},
                zoom: {enabled: false}
            });
            board.defaultAxes.x.setAttribute({ticks: {ticksDistance: xtick, insertTicks: false, minorTicks: 0}});
            board.defaultAxes.y.setAttribute({ticks: {ticksDistance: ytick, insertTicks: false, minorTicks: 0}});
            var xlabel = xlabelInput.value.trim();
            var ylabel = ylabelInput.value.trim();
            var xlabelSource = toKatexSource(xlabel), ylabelSource = toKatexSource(ylabel);
            // Line.getLabelAnchor() only recognizes "last"/"first" (anchors to
            // point2/point1 directly) for axis-aligned lines; direction tokens
            // like "rt"/"top" compare screen-x only and fall back to the
            // midpoint for a vertical line, which misplaced the y-axis label.
            board.defaultAxes.x.setAttribute({
                name: xlabelSource, withLabel: !!xlabel,
                label: {position: "last", offset: [0, 14]}
            });
            board.defaultAxes.y.setAttribute({
                name: ylabelSource, withLabel: !!ylabel,
                // "last" defaults to anchorX "right" (text extends left, over
                // the axis line); force "left" so it extends clear of it.
                label: {position: "last", anchorX: "left", offset: [6, 0]}
            });

            fnRows.forEach(function (row) {
                var expr = row.exprInput.value.trim();
                row.error.textContent = "";
                if (!expr) return;
                try {
                    var fn = board.jc.snippet(expr, true, "x", true);
                    var from = numberOr(row.domainFromInput.value, null);
                    var to = numberOr(row.domainToInput.value, null);
                    var parents = (from !== null && to !== null) ? [fn, from, to] : [fn];
                    board.create("functiongraph", parents, {strokeColor: row.colorInput.value, strokeWidth: 2});
                } catch (err) {
                    row.error.textContent = "Kunne ikke tolke uttrykket: " + err.message;
                }
            });

            ptRows.forEach(function (row) {
                var x = numberOr(row.xInput.value, null);
                var y = numberOr(row.yInput.value, null);
                if (x === null || y === null) return;
                var label = row.labelInput.value;
                var labelSource = toKatexSource(label);
                board.create("point", [x, y], {
                    name: labelSource, withLabel: !!label, fixed: true, size: 3, color: "#111827"
                });
            });

            txtRows.forEach(function (row) {
                var x = numberOr(row.xInput.value, null);
                var y = numberOr(row.yInput.value, null);
                var text = row.textInput.value;
                if (x === null || y === null || !text) return;
                var textSource = toKatexSource(text);
                board.create("text", [x, y, textSource], {fontSize: 16, fixed: true});
            });

            board.update();
            state.board = board;
        }

        // Seed with one example function so the board isn't empty on load.
        addFunctionRow("x^2 - 2*x");
        addPointRow();
        rebuild();
    }

    function boot() {
        document.querySelectorAll(".munch-plot-builder").forEach(initialize);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
})();
