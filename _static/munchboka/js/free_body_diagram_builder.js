(function () {
    "use strict";

    // Direct port of _free_body_geometry.py's pure math (object geometry, force
    // defaults, collinear-force offsetting) so the live preview matches the
    // real `free-body-diagram` directive's behavior as closely as possible.

    var DEFAULT_FORCE_COLOR = {
        gravity: "#000000", normal: "#0000ff", friction: "#ffa500",
        "air-resistance": "#008080", custom: "#800080"
    };
    var DEFAULT_FORCE_NAME = {
        gravity: "$\\vec G$", normal: "$\\vec N$", friction: "$\\vec R$",
        "air-resistance": "$\\vec L$", custom: ""
    };
    var FORCE_KIND_LABELS = [
        ["gravity", "Gravitasjon"], ["normal", "Normalkraft"],
        ["friction", "Friksjon"], ["air-resistance", "Luftmotstand"],
        ["custom", "Custom"]
    ];
    var OBJECT_KIND_LABELS = [["ball", "ball"], ["square", "square (kloss)"], ["toy-car", "toy-car (bil)"]];

    if (window.JXG) JXG.Options.text.useKatex = true;

    function numberOr(value, fallback) {
        var n = parseFloat(value);
        return Number.isFinite(n) ? n : fallback;
    }

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

    // JSXGraph's arrowhead `<marker>` fill relies on the SVG2 `context-stroke`
    // keyword, which isn't reliably supported everywhere and falls back to
    // the SVG default (black) when it isn't. Force the marker's own fill
    // explicitly to the force's color so it's never wrong (and so the color
    // survives a static, standalone export where context-stroke definitely
    // won't resolve).
    function fixArrowheadColor(arrowEl, color) {
        if (!arrowEl || !arrowEl.rendNode) return;
        var ref = arrowEl.rendNode.getAttribute("marker-end") || arrowEl.rendNode.getAttribute("marker-start");
        var match = ref && /url\(["']?#([^"')]+)["']?\)/.exec(ref);
        var marker = match && document.getElementById(match[1]);
        if (!marker) return;
        marker.setAttribute("fill", color);
        marker.setAttribute("stroke", color);
        var path = marker.querySelector("path");
        if (path) { path.setAttribute("fill", color); path.setAttribute("stroke", color); }
    }

    // HTML/foreignObject labels rely on browser layout and are ignored by many
    // SVG viewers. Export each formula as self-contained vector paths instead.
    function buildStandaloneSvg(board, renderer, texts) {
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

        texts.forEach(function (text) {
            var node = text.el.rendNode;
            var r = node.getBoundingClientRect();
            if (!r.width || !r.height) return;
            var formula = new DOMParser().parseFromString(renderer.render(text.source), "image/svg+xml").documentElement;
            var bounds = formula.getAttribute("viewBox").split(/\s+/).map(Number);
            var style = getComputedStyle(node.querySelector(".katex") || node);
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
            formula.setAttribute("aria-label", text.source);
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

    function option(value, text) {
        var o = el("option", {value: value});
        o.textContent = text;
        return o;
    }

    function makeRow(fields, onRemove) {
        var row = el("div", {class: "plot-builder-row"});
        fields.forEach(function (field) { row.appendChild(field); });
        if (onRemove) {
            var remove = el("button", {type: "button", class: "plot-builder-remove", "aria-label": "Fjern"});
            remove.textContent = "✕";
            remove.addEventListener("click", onRemove);
            row.appendChild(remove);
        }
        return row;
    }

    // --- Geometry (mirrors _free_body_geometry.py) ---

    function buildObject(kind, size, cx, cy, color, alpha) {
        if (kind === "square") {
            var half = size / 2;
            var corners = [[cx - half, cy - half], [cx + half, cy - half], [cx + half, cy + half], [cx - half, cy + half]];
            return {
                create: function (board) {
                    board.create("polygon", corners, {
                        fillColor: color, fillOpacity: alpha, withLabel: false,
                        vertices: {visible: false}, borders: {strokeColor: color}, fixed: true, highlight: false
                    });
                },
                centroid: [cx, cy], contact: [cx, cy - half], radius: half
            };
        }
        if (kind === "toy-car") {
            var bodyW = size, bodyH = size * 0.45, wheelR = size * 0.14;
            var bodyBottom = cy - bodyH / 2, bodyTop = bodyBottom + bodyH;
            var body = [[cx - bodyW / 2, bodyBottom], [cx + bodyW / 2, bodyBottom], [cx + bodyW / 2, bodyTop], [cx - bodyW / 2, bodyTop]];
            var wheelX = bodyW * 0.3;
            return {
                create: function (board) {
                    board.create("polygon", body, {
                        fillColor: color, fillOpacity: alpha, withLabel: false,
                        vertices: {visible: false}, borders: {strokeColor: color}, fixed: true, highlight: false
                    });
                    [cx - wheelX, cx + wheelX].forEach(function (wx) {
                        board.create("circle", [[wx, bodyBottom], wheelR], {
                            fillColor: "gray", fillOpacity: 0.2, withLabel: false, fixed: true, highlight: false, strokeColor: "gray"
                        });
                    });
                },
                centroid: [cx, cy], contact: [cx + wheelX, bodyBottom - wheelR], radius: bodyW / 2
            };
        }
        // ball (default)
        var r = size / 2;
        return {
            create: function (board) {
                board.create("circle", [[cx, cy], r], {
                    fillColor: color, fillOpacity: alpha, withLabel: false,
                    center: {visible: false, withLabel: false}, strokeColor: color, fixed: true, highlight: false
                });
            },
            centroid: [cx, cy], contact: [cx, cy - r], radius: r
        };
    }

    function defaultAttachment(kind, obj, velocity) {
        if (kind === "gravity") return {point: obj.centroid, direction: [0, -1]};
        if (kind === "normal") return {point: obj.contact, direction: [0, 1]};
        if (kind === "friction") {
            if (!velocity || Math.abs(velocity[0]) < 1e-9) return {point: null, direction: null};
            return {point: obj.contact, direction: [velocity[0] > 0 ? -1 : 1, 0]};
        }
        if (kind === "air-resistance") {
            if (!velocity) return {point: null, direction: null};
            var leading = [obj.centroid[0] + velocity[0] * obj.radius, obj.centroid[1] + velocity[1] * obj.radius];
            return {point: leading, direction: [-velocity[0], -velocity[1]]};
        }
        return {point: null, direction: null}; // custom
    }

    function perpendicular(direction) { return [-direction[1], direction[0]]; }

    function collinearGroups(forces, tol) {
        tol = tol || 1e-6;
        var groups = [], assigned = forces.map(function () { return false; });
        for (var i = 0; i < forces.length; i++) {
            if (assigned[i]) continue;
            var group = [i];
            assigned[i] = true;
            var px = forces[i].point[0], py = forces[i].point[1];
            var dx = forces[i].direction[0], dy = forces[i].direction[1];
            for (var j = i + 1; j < forces.length; j++) {
                if (assigned[j]) continue;
                var other = forces[j];
                var ox = other.point[0], oy = other.point[1];
                var odx = other.direction[0], ody = other.direction[1];
                if (Math.abs(dx * ody - dy * odx) > tol) continue;
                var vx = ox - px, vy = oy - py;
                if (Math.hypot(vx, vy) > tol && Math.abs(dx * vy - dy * vx) > tol) continue;
                group.push(j);
                assigned[j] = true;
            }
            groups.push(group);
        }
        return groups;
    }

    function assignDrawPoints(forces, spacing) {
        collinearGroups(forces).forEach(function (group) {
            var perp = perpendicular(forces[group[0]].direction);
            group.forEach(function (index, rank) {
                var force = forces[index];
                var offset = (force.offset !== null && force.offset !== undefined) ? force.offset : (rank + 1) * spacing;
                force.drawPoint = [force.point[0] + perp[0] * offset, force.point[1] + perp[1] * offset];
            });
        });
    }

    function finalizeForce(force) {
        var dpx = force.drawPoint[0], dpy = force.drawPoint[1];
        var ux = force.direction[0], uy = force.direction[1];
        force.tip = [dpx + ux * force.length, dpy + uy * force.length];
        if (force.name) {
            var off = force.length * 0.08 + 0.05;
            force.labelPoint = [dpx + ux * (force.length + off), dpy + uy * (force.length + off)];
        }
    }

    function computeBounds(obj, forces) {
        var r = obj.radius;
        var points = [obj.centroid, obj.contact,
            [obj.centroid[0] - r, obj.centroid[1] - r], [obj.centroid[0] + r, obj.centroid[1] + r]];
        forces.forEach(function (f) { points.push(f.point, f.drawPoint, f.tip); });
        var xs = points.map(function (p) { return p[0]; }), ys = points.map(function (p) { return p[1]; });
        var xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs);
        var ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys);
        var span = Math.max(xmax - xmin, ymax - ymin, 1e-6);
        var margin = span * 0.25;
        return {xmin: xmin - margin, xmax: xmax + margin, ymin: ymin - margin, ymax: ymax + margin, span: span, margin: margin};
    }

    function drawAxisIndicator(board, xmin, ymin, span, margin, textsForExport) {
        var extent = span * 0.18, gap = extent * 0.2;
        var ox = xmin + margin * 0.5, oy = ymin + margin * 0.5;
        board.create("arrow", [[ox, oy], [ox + extent, oy]], {strokeColor: "black", strokeWidth: 1.5, fixed: true, highlight: false});
        var xText = board.create("text", [ox + extent + gap, oy, "x"], {fontSize: 14, fixed: true, anchorX: "left", anchorY: "middle", highlight: false});
        board.create("arrow", [[ox, oy], [ox, oy + extent]], {strokeColor: "black", strokeWidth: 1.5, fixed: true, highlight: false});
        var yText = board.create("text", [ox, oy + extent + gap, "y"], {fontSize: 14, fixed: true, anchorX: "middle", anchorY: "bottom", highlight: false});
        textsForExport.push({el: xText, source: "x"}, {el: yText, source: "y"});
    }

    // --- Widget ---

    function initialize(host) {
        if (host.dataset.initialized) return;
        host.dataset.initialized = "true";
        host.textContent = "";

        var boardId = (host.id || "fbd-builder") + "-board";
        var state = {board: null};

        var layout = el("div", {class: "plot-builder-layout"});
        var controls = el("div", {class: "plot-builder-controls"});
        var fieldsets = el("div", {class: "plot-builder-fieldsets"});
        var boardWrap = el("div", {class: "plot-builder-board-wrap"});
        var boardWidth = host.dataset.boardWidth || "640px";
        var boardHeight = parseFloat(host.dataset.boardHeight) || 480;
        var boardEl = el("div", {
            class: "plot-builder-board", id: boardId,
            style: "max-width:" + boardWidth + ";aspect-ratio:" + (parseFloat(boardWidth) || 640) + "/" + boardHeight
        });
        var status = el("div", {class: "plot-builder-status"});
        boardWrap.appendChild(boardEl);
        boardWrap.appendChild(status);
        controls.appendChild(fieldsets);
        layout.appendChild(controls);
        layout.appendChild(boardWrap);
        host.appendChild(layout);

        // --- Object ---
        var objFieldset = el("fieldset", {}, [el("legend", {text: "Objekt"})]);
        var objKindSelect = el("select", {});
        OBJECT_KIND_LABELS.forEach(function (pair) { objKindSelect.appendChild(option(pair[0], pair[1])); });
        var objSizeInput = el("input", {type: "number", step: "any", min: "0.01", value: "1.6"});
        var objXInput = el("input", {type: "number", step: "any", class: "plot-builder-xy", placeholder: "x", value: "0"});
        var objYInput = el("input", {type: "number", step: "any", class: "plot-builder-xy", placeholder: "y", value: "0"});
        var objColorInput = el("input", {type: "color", value: "#008080", title: "Farge"});
        var objAlphaInput = el("input", {type: "number", step: "any", min: "0", max: "1", placeholder: "0.2"});
        [el("label", {text: "objekttype"}), objKindSelect,
         el("label", {text: "st\u00f8rrelse"}), objSizeInput].forEach(function (n) { objFieldset.appendChild(n); });
        objFieldset.appendChild(makeRow([objXInput, objYInput, objColorInput, objAlphaInput]));
        fieldsets.appendChild(objFieldset);

        // --- Velocity ---
        var velFieldset = el("fieldset", {}, [el("legend", {text: "Hastighet"})]);
        var velocityAngleInput = el("input", {type: "number", step: "any", placeholder: "f.eks. 30 (grader, valgfritt)"});
        velFieldset.appendChild(el("label", {text: "retning (grader fra +x, tom = ingen hastighet)"}));
        velFieldset.appendChild(velocityAngleInput);
        fieldsets.appendChild(velFieldset);

        // --- Forces ---
        var forceFieldset = el("fieldset", {}, [el("legend", {text: "Krefter"})]);
        var forceList = el("div");
        forceFieldset.appendChild(forceList);
        var addForceBtn = el("button", {type: "button", class: "plot-builder-add"});
        addForceBtn.textContent = "+ Legg til kraft";
        forceFieldset.appendChild(addForceBtn);
        fieldsets.appendChild(forceFieldset);
        var forceRows = [];

        function addForceRow(kind, length, offset) {
            var kindSelect = el("select", {});
            FORCE_KIND_LABELS.forEach(function (pair) { kindSelect.appendChild(option(pair[0], pair[1])); });
            kindSelect.value = kind || "gravity";
            var lengthInput = el("input", {type: "number", step: "any", min: "0.01", class: "plot-builder-xy", placeholder: "lengde", value: length || "0.4"});
            var lengthLabel = el("label", {class: "fbd-length", text: "lengde"}, [lengthInput]);
            var colorInput = el("input", {type: "color", value: DEFAULT_FORCE_COLOR[kindSelect.value], title: "Farge"});
            var nameInput = el("input", {type: "text", placeholder: DEFAULT_FORCE_NAME[kindSelect.value] || "navn"});
            kindSelect.addEventListener("change", function () {
                colorInput.value = DEFAULT_FORCE_COLOR[kindSelect.value] || "#000000";
                nameInput.placeholder = DEFAULT_FORCE_NAME[kindSelect.value] || "navn";
                directionLabel.hidden = kindSelect.value !== "custom";
                scheduleRebuild();
            });

            var offsetInput = el("input", {type: "number", step: "any", class: "plot-builder-xy", placeholder: "offset", "aria-label": "Offset", value: offset == null ? "0" : offset});
            var offsetLabel = el("label", {class: "fbd-offset", text: "Offset"}, [offsetInput]);

            var directionInput = el("input", {type: "number", step: "any", class: "plot-builder-xy", "aria-label": "Retning (grader)", value: "0"});
            var directionLabel = el("label", {class: "fbd-direction", text: "Retning (grader)"}, [directionInput]);
            directionLabel.hidden = kindSelect.value !== "custom";
            var error = el("span", {class: "plot-builder-error"});
            var rowData = {
                kindSelect: kindSelect, lengthInput: lengthInput, colorInput: colorInput, nameInput: nameInput,
                offsetInput: offsetInput, directionInput: directionInput, error: error
            };
            var row = makeRow([kindSelect, lengthLabel, colorInput, nameInput, offsetLabel, directionLabel], function () {
                forceRows = forceRows.filter(function (r) { return r !== rowData; });
                wrapper.remove();
                scheduleRebuild();
            });
            var wrapper = el("div");
            wrapper.appendChild(row);
            wrapper.appendChild(error);
            forceList.appendChild(wrapper);
            forceRows.push(rowData);
            scheduleRebuild();
        }
        addForceBtn.addEventListener("click", function () { addForceRow(); });

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
                var source = buildStandaloneSvg(state.board, renderer, state.textsForExport || []);
                if (!/^<\?xml/.test(source)) source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
                var blob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
                var url = URL.createObjectURL(blob);
                var a = el("a", {href: url, download: "free-body-diagram.svg"});
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

        function resolveForceRow(row, obj, velocity) {
            var kind = row.kindSelect.value;
            var length = numberOr(row.lengthInput.value, null);
            if (length === null || length <= 0) return {error: "Oppgi en positiv lengde."};

            var defaults = defaultAttachment(kind, obj, velocity);
            var point = defaults.point, direction = defaults.direction;
            if (kind === "custom") {
                var degrees = numberOr(row.directionInput.value, null);
                if (degrees === null) return {error: "Oppgi retning i grader."};
                var radians = degrees * Math.PI / 180;
                point = obj.centroid;
                direction = [Math.cos(radians), Math.sin(radians)];
            }

            if (!point || !direction) {
                return {error: "Oppgi hastighet for denne krafttypen."};
            }
            var name = row.nameInput.value.trim() || DEFAULT_FORCE_NAME[kind] || "";
            var offsetRaw = row.offsetInput.value.trim();
            var offset = offsetRaw === "" ? null : numberOr(offsetRaw, null);
            return {force: {kind: kind, length: length, name: name, color: row.colorInput.value, point: point, direction: direction, offset: offset}};
        }

        function rebuild() {
            var size = numberOr(objSizeInput.value, 1.6);
            if (!(size > 0)) { status.textContent = "St\u00f8rrelse m\u00e5 v\u00e6re positiv."; return; }
            if (!window.JXG) { status.textContent = "JSXGraph kunne ikke lastes."; return; }

            var cx = numberOr(objXInput.value, 0), cy = numberOr(objYInput.value, 0);
            var alphaRaw = objAlphaInput.value.trim();
            var alpha = alphaRaw === "" ? 0.2 : numberOr(alphaRaw, 0.2);
            var obj = buildObject(objKindSelect.value, size, cx, cy, objColorInput.value, alpha);

            var angleRaw = velocityAngleInput.value.trim();
            var velocity = null;
            if (angleRaw !== "") {
                var rad = numberOr(angleRaw, 0) * Math.PI / 180;
                velocity = [Math.cos(rad), Math.sin(rad)];
            }

            var forces = [];
            var anyError = false;
            forceRows.forEach(function (row) {
                row.error.textContent = "";
                var result = resolveForceRow(row, obj, velocity);
                if (result.error) { row.error.textContent = result.error; anyError = true; return; }
                forces.push(result.force);
            });

            if (state.board) {
                try { JXG.JSXGraph.freeBoard(state.board); } catch (e) { /* ignore */ }
                state.board = null;
            }
            if (!forces.length) {
                status.textContent = anyError ? "Ingen gyldige krefter \u00e5 tegne enn\u00e5." : "Legg til minst \u00e9n kraft.";
                return;
            }
            status.textContent = "";

            var spacing = Math.max(obj.radius * 0.22, 0.08);
            assignDrawPoints(forces, spacing);
            forces.forEach(finalizeForce);
            var bounds = computeBounds(obj, forces);

            var board = JXG.JSXGraph.initBoard(boardId, {
                boundingbox: [bounds.xmin, bounds.ymax, bounds.xmax, bounds.ymin],
                axis: false, showCopyright: false, showNavigation: false, keepaspectratio: true,
                pan: {enabled: false}, zoom: {enabled: false},
                // JSXGraph's own resize observer redraws (and so un-fixes,
                // see fixArrowheadColor) shortly after creation; we already
                // fully rebuild on every input change, so it's not needed.
                resize: {enabled: false}
            });
            obj.create(board);
            var arrowsToFix = [];
            state.textsForExport = [];
            forces.forEach(function (force) {
                board.create("point", force.point, {name: "", withLabel: false, fixed: true, size: 3, color: "black", highlight: false});
                if (Math.hypot(force.drawPoint[0] - force.point[0], force.drawPoint[1] - force.point[1]) > 1e-9) {
                    board.create("segment", [force.point, force.drawPoint], {
                        dash: 1, strokeColor: force.color, strokeWidth: 1, fixed: true, withLabel: false, highlight: false
                    });
                }
                var vector = board.create("arrow", [force.drawPoint, force.tip], {strokeColor: force.color, strokeWidth: 2, fixed: true, highlight: false});
                arrowsToFix.push({el: vector, color: force.color});
                if (force.name) {
                    var nameSource = toKatexSource(force.name);
                    var label = board.create("text", [force.labelPoint[0], force.labelPoint[1], nameSource], {
                        fontSize: 16, fixed: true, anchorX: "middle", anchorY: "middle", highlight: false
                    });
                    state.textsForExport.push({el: label, source: nameSource});
                }
            });
            drawAxisIndicator(board, bounds.xmin, bounds.ymin, bounds.span, bounds.margin, state.textsForExport);
            board.update();
            // The arrowhead <marker> isn't rendered until after this update
            // pass, so the color fix (see fixArrowheadColor) must come after.
            arrowsToFix.forEach(function (entry) { fixArrowheadColor(entry.el, entry.color); });
            state.board = board;
        }

        // Start with gravity only; other forces are added through the controls.
        velocityAngleInput.value = "30";
        addForceRow("gravity", "0.5");
        rebuild();
    }

    function boot() {
        document.querySelectorAll(".munch-fbd-builder").forEach(initialize);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
})();
