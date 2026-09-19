class ParsonsPuzzle {
    constructor(puzzleContainerId, codeString, onSolvedCallback = null, options = {}) {
        // Backwards compatibility: allow third arg to be options
        if (onSolvedCallback && typeof onSolvedCallback === 'object') {
            options = onSolvedCallback;
            onSolvedCallback = null;
        }

        this.puzzleContainerId = puzzleContainerId;
        this.puzzleContainer = document.getElementById(puzzleContainerId);
        this.codeString = codeString;
        this.onSolvedCallback = onSolvedCallback;

        this.lang = (options && options.lang) ? options.lang : 'python';
        this.chunkMarker = (options && options.chunkMarker) ? options.chunkMarker : null;

        this.indentationMode = (options && options.indentationMode)
            ? String(options.indentationMode).trim().toLowerCase()
            : 'fixed';
        if (!['fixed', 'student'].includes(this.indentationMode)) {
            this.indentationMode = 'fixed';
        }

        this.indentSize = (options && Number.isFinite(options.indentSize))
            ? Math.max(1, Math.floor(options.indentSize))
            : this.inferIndentSize(codeString);

        // Pixels per indentation level used for snapping.
        this.indentationWidth = (options && Number.isFinite(options.indentationWidth))
            ? Math.max(10, Math.floor(options.indentationWidth))
            : 40;

        this.generateHTML();

        this.dropArea = document.getElementById(this.dropAreaId);
        this.checkButton = document.getElementById(this.checkSolutionId);
        this.resetButton = document.getElementById(this.resetButtonId);
        this.draggableCodeContainer = document.getElementById(this.draggableId);
        this.toast = document.getElementById(this.toastId);

        this.solutionModal = this.createSolutionModal(puzzleContainerId);
        this.fullCodeElement = this.solutionModal.querySelector(`#fullCode-${puzzleContainerId}`);
        this.closeModalButton = this.solutionModal.querySelector('.close');
        this.copyCodeButton = this.solutionModal.querySelector(`#copyCodeButton-${puzzleContainerId}`);

        this.codeBlocks = this.preprocessCode(codeString);
        this.shuffledCodeBlocks = this.shuffleArray(this.codeBlocks.slice());

        if (this.indentationMode === 'student') {
            this.maxIndentationLevel = Math.max(
                0,
                ...this.codeBlocks
                    .filter((obj) => !obj.isEmpty)
                    .map((obj) => obj.expectedIndentation ?? 0)
            );

            this.dropArea.classList.add('parsons-drop-area--indent');
            this.draggableCodeContainer.classList.add('parsons-draggable-code--indent');

            this.renderDraggableCodeIndentationMode(this.draggableCodeContainer, this.shuffledCodeBlocks);
            this.createDropAreaPlaceholder(this.dropArea);
            this.addIndentationGuides(this.dropArea);
            this.enableIndentationDragAndDrop();
        } else {
            this.renderDraggableCode(this.draggableCodeContainer, this.shuffledCodeBlocks);
            this.createPlaceholder(this.dropArea);
            this.enableDragAndDrop(this.draggableCodeContainer, this.dropArea);
        }


        this.isSolved = false;
        
        this.addEventListeners();
    }

    inferIndentSize(codeString) {
        const lines = String(codeString).split('\n');
        const counts = [];
        for (const line of lines) {
            if (!line.trim()) continue;
            const spaces = this.countLeadingSpaces(line);
            if (spaces > 0) counts.push(spaces);
        }

        if (counts.length === 0) return 4;

        const gcd2 = (a, b) => {
            let x = Math.abs(a);
            let y = Math.abs(b);
            while (y) {
                const t = x % y;
                x = y;
                y = t;
            }
            return x;
        };

        let g = counts[0];
        for (let i = 1; i < counts.length; i++) {
            g = gcd2(g, counts[i]);
            if (g === 1) break;
        }

        // Keep it reasonable; fall back to 4 if we get something odd.
        if (g >= 1 && g <= 8) return g;
        return 4;
    }

    countLeadingSpaces(line) {
        const match = String(line).match(/^[\t ]*/);
        if (!match) return 0;
        const prefix = match[0];
        let count = 0;
        for (const ch of prefix) {
            count += (ch === '\t') ? this.indentSize : 1;
        }
        return count;
    }

    deindentLine(line, spaces) {
        if (spaces <= 0) return line;
        let remaining = spaces;
        let i = 0;
        while (i < line.length && remaining > 0) {
            const ch = line[i];
            if (ch === ' ') {
                remaining -= 1;
                i += 1;
                continue;
            }
            if (ch === '\t') {
                remaining -= this.indentSize;
                i += 1;
                continue;
            }
            break;
        }
        return line.slice(i);
    }


    addEventListeners() {
        this.checkButton.addEventListener('click', () => this.checkSolution());
        this.resetButton.addEventListener('click', () => {
            this.reset();
            this.reshuffle();
        });
        this.closeModalButton.addEventListener('click', () => this.solutionModal.style.display = 'none');
        this.copyCodeButton.addEventListener('click', () => {
            navigator.clipboard.writeText(this.fullCodeElement.textContent).then(() => {
                alert('Du har kopiert koden!');
            });
        });
    }

    generateHTML() {
        const container = document.getElementById(this.puzzleContainerId);
        if (!container) {
            console.error(`Container with ID ${this.puzzleContainerId} not found.`);
            return;
        }
    
        const uniqueId = generateUUID();
        this.dropAreaId = `drop-area-${uniqueId}`;
        this.checkSolutionId = `check-solution-${uniqueId}`;
        this.resetButtonId = `reset-button-${uniqueId}`;
        this.draggableId = `draggable-code-${uniqueId}`;
        this.toastSuccessId = `toast-success-${uniqueId}`;
        this.toastErrorId = `toast-error-${uniqueId}`;
    
        const checkSolutionIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        `;

        const resetIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
        </svg>
        `;
    
        const html = `
            <!-- Toast Notifications -->
            <div id="${this.toastSuccessId}" class="toast toast-success" style="display: none;">
                <p>Riktig! 🎉</p>
            </div>
            <div id="${this.toastErrorId}" class="toast toast-error" style="display: none;">
                <p>Prøv igjen!</p>
            </div>
            <div id="${this.draggableId}" class="draggable-code"></div>
            <div id="${this.dropAreaId}" class="drop-area"></div>
            <div class="button-container">
                <button id="${this.checkSolutionId}" class="button button-check-solution">Sjekk løsning ${checkSolutionIcon}</button>
                <button id="${this.resetButtonId}" class="button button-reset-puzzle">Reset puslespill ${resetIcon}</button>
            </div>
        `;
    
        container.innerHTML = html;
    
        // Get references to the toast elements
        this.toastSuccess = document.getElementById(this.toastSuccessId);
        this.toastError = document.getElementById(this.toastErrorId);
    }
    

    preprocessCode(codeString) {
        const lines = codeString.split('\n');

        const markerPatterns = this.buildChunkMarkerPatterns(this.chunkMarker);

        const hasStartEndMarkers = markerPatterns
            ? lines.some((line) => markerPatterns.start.test(line) || markerPatterns.end.test(line))
            : false;

        const hasSeparatorMarkers = markerPatterns
            ? lines.some((line) => markerPatterns.separator.test(line))
            : false;

        // Default behavior (no markers): keep the current one-line-per-block approach.
        if (!hasStartEndMarkers && !hasSeparatorMarkers) {
            return lines.map((line, index) => {
                let renderedLine = line;
                if (line.includes(';')) {
                    const parts = line.split(';');
                    renderedLine = parts.map(part => part.trim() === '' ? '' : part).join('\n');
                }

                const leadingSpaces = this.countLeadingSpaces(line);
                const expectedIndentation = Math.round(leadingSpaces / this.indentSize);
                const displayBlock = renderedLine
                    .split('\n')
                    .map((l) => this.deindentLine(l, leadingSpaces))
                    .join('\n');

                return {
                    block: renderedLine,
                    output: renderedLine,
                    displayBlock,
                    order: index,
                    expectedIndentation,
                    isEmpty: line.trim() === ''
                };
            });
        }

        // Prefer explicit start/end chunking when present.
        if (hasStartEndMarkers) {
            const pieces = [];
            let inChunk = false;
            let currentChunk = [];

            for (const line of lines) {
                if (markerPatterns.start.test(line)) {
                    // Starting a new chunk: flush any existing chunk first.
                    if (inChunk) {
                        pieces.push({ type: 'chunk', lines: currentChunk });
                        currentChunk = [];
                    }
                    inChunk = true;
                    continue;
                }

                if (markerPatterns.end.test(line)) {
                    if (inChunk) {
                        pieces.push({ type: 'chunk', lines: currentChunk });
                        currentChunk = [];
                        inChunk = false;
                    }
                    continue;
                }

                if (inChunk) {
                    currentChunk.push(line);
                } else {
                    pieces.push({ type: 'line', line });
                }
            }

            // Unclosed chunk: treat remainder as chunk.
            if (inChunk) {
                pieces.push({ type: 'chunk', lines: currentChunk });
            }

            const blocks = [];
            let order = 0;

            for (const piece of pieces) {
                if (piece.type === 'line') {
                    const line = piece.line;
                    let renderedLine = line;
                    if (line.includes(';')) {
                        const parts = line.split(';');
                        renderedLine = parts.map(part => part.trim() === '' ? '' : part).join('\n');
                    }

                    const leadingSpaces = this.countLeadingSpaces(line);
                    const expectedIndentation = Math.round(leadingSpaces / this.indentSize);
                    const displayBlock = renderedLine
                        .split('\n')
                        .map((l) => this.deindentLine(l, leadingSpaces))
                        .join('\n');

                    blocks.push({
                        block: renderedLine,
                        output: renderedLine,
                        displayBlock,
                        order: order++,
                        expectedIndentation,
                        isEmpty: line.trim() === ''
                    });
                    continue;
                }

                // piece.type === 'chunk'
                const expandedLines = [];
                for (const chunkLine of piece.lines) {
                    if (chunkLine.includes(';')) {
                        const parts = chunkLine.split(';');
                        const expanded = parts.map(part => part.trim() === '' ? '' : part).join('\n');
                        expandedLines.push(...expanded.split('\n'));
                    } else {
                        expandedLines.push(chunkLine);
                    }
                }

                const outputText = expandedLines.join('\n');
                const blockText = expandedLines
                    .filter((l) => l.trim() !== '')
                    .join('\n');

                const nonEmpty = expandedLines.filter((l) => l.trim() !== '');
                const baselineSpaces = nonEmpty.length
                    ? Math.min(...nonEmpty.map((l) => this.countLeadingSpaces(l)))
                    : 0;
                const expectedIndentation = Math.round(baselineSpaces / this.indentSize);

                const displayBlock = blockText
                    .split('\n')
                    .map((l) => this.deindentLine(l, baselineSpaces))
                    .join('\n');

                blocks.push({
                    block: blockText,
                    output: outputText,
                    displayBlock,
                    order: order++,
                    expectedIndentation,
                    isEmpty: blockText.trim() === ''
                });
            }

            return blocks;
        }

        // Separator behavior: group multiple lines into chunks separated by marker lines.
        const chunks = [];
        let current = [];

        for (const line of lines) {
            if (markerPatterns.separator.test(line)) {
                chunks.push(current);
                current = [];
                continue;
            }
            current.push(line);
        }
        chunks.push(current);

        return chunks.map((chunkLines, chunkIndex) => {
            const expandedLines = [];

            // Keep the existing ";" convenience inside chunks.
            for (const line of chunkLines) {
                if (line.includes(';')) {
                    const parts = line.split(';');
                    const expanded = parts.map(part => part.trim() === '' ? '' : part).join('\n');
                    expandedLines.push(...expanded.split('\n'));
                } else {
                    expandedLines.push(line);
                }
            }

            const outputText = expandedLines.join('\n');
            const blockText = expandedLines
                .filter((line) => line.trim() !== '')
                .join('\n');

            const nonEmpty = expandedLines.filter((l) => l.trim() !== '');
            const baselineSpaces = nonEmpty.length
                ? Math.min(...nonEmpty.map((l) => this.countLeadingSpaces(l)))
                : 0;
            const expectedIndentation = Math.round(baselineSpaces / this.indentSize);

            const displayBlock = blockText
                .split('\n')
                .map((l) => this.deindentLine(l, baselineSpaces))
                .join('\n');

            return {
                block: blockText,
                output: outputText,
                displayBlock,
                order: chunkIndex,
                expectedIndentation,
                isEmpty: blockText.trim() === ''
            };
        });
    }

    buildChunkMarkerPatterns(marker) {
        if (!marker) {
            return null;
        }

        const trimmed = String(marker).trim();
        if (!trimmed) {
            return null;
        }

        const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Normalize base token to support explicit "-start"/"-end" variants.
        const stripSuffix = (token) => token.replace(/(?:-start|-end)\s*$/i, '').trim();

        if (trimmed.startsWith('#')) {
            const afterHashRaw = trimmed.slice(1).trim();
            const baseToken = stripSuffix(afterHashRaw);
            const baseEscaped = escapeRegex(baseToken);

            // If marker is just '#', treat it as a generic comment marker.
            if (!baseToken) {
                return {
                    separator: /^\s*#\s*$/, // unlikely but keeps behavior predictable
                    start: /^\s*#\s*-start\s*$/,
                    end: /^\s*#\s*-end\s*$/,
                };
            }

            return {
                separator: new RegExp(`^\\s*#\\s*${baseEscaped}\\s*$`),
                start: new RegExp(`^\\s*#\\s*${baseEscaped}\\s*-start\\s*$`),
                end: new RegExp(`^\\s*#\\s*${baseEscaped}\\s*-end\\s*$`),
            };
        }

        // Non-comment markers: exact match + "-start"/"-end" variants.
        const baseToken = stripSuffix(trimmed);
        const baseEscaped = escapeRegex(baseToken);
        return {
            separator: new RegExp(`^\\s*${baseEscaped}\\s*$`),
            start: new RegExp(`^\\s*${baseEscaped}\\s*-start\\s*$`),
            end: new RegExp(`^\\s*${baseEscaped}\\s*-end\\s*$`),
        };
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    renderDraggableCode(container, codeBlockObjects) {
        container.innerHTML = '';
        codeBlockObjects.forEach((obj) => {
            if (!obj.isEmpty) {
                const lineElement = document.createElement('div');
                lineElement.className = 'draggable';
                lineElement.draggable = true;
                lineElement.dataset.order = obj.order;
                lineElement.innerHTML = `<pre class="highlight ${this.escapeHTML(this.lang)}"><code>${this.escapeHTML(obj.block)}</code></pre>`;
                container.appendChild(lineElement);
                hljs.highlightElement(lineElement.querySelector('code'));
            }
        });
    }

    renderDraggableCodeIndentationMode(container, codeBlockObjects) {
        container.innerHTML = '';
        codeBlockObjects.forEach((obj) => {
            if (!obj.isEmpty) {
                const tile = document.createElement('div');
                tile.className = 'draggable parsons-tile';
                tile.dataset.order = obj.order;
                tile.dataset.expectedIndentation = String(obj.expectedIndentation ?? 0);
                tile.dataset.currentIndentation = '0';
                const text = (obj.displayBlock != null) ? obj.displayBlock : obj.block;
                tile.innerHTML = `<pre class="highlight ${this.escapeHTML(this.lang)}"><code>${this.escapeHTML(text)}</code></pre>`;
                container.appendChild(tile);
                hljs.highlightElement(tile.querySelector('code'));
            }
        });
    }

    escapeHTML(str) {
        return str.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
    }

    checkSolution() {
        if (this.indentationMode === 'student') {
            const droppedTiles = Array.from(this.dropArea.querySelectorAll('.parsons-tile'));
            const dropped = droppedTiles.map(tile => ({
                order: parseInt(tile.dataset.order),
                indentation: parseInt(tile.dataset.currentIndentation || '0')
            }));

            const correct = this.codeBlocks
                .filter(obj => !obj.isEmpty)
                .slice()
                .sort((a, b) => a.order - b.order)
                .map(obj => ({
                    order: obj.order,
                    indentation: parseInt(String(obj.expectedIndentation ?? 0))
                }));

            const isCorrect = dropped.length === correct.length
                && dropped.every((d, i) => d.order === correct[i].order && d.indentation === correct[i].indentation);

            const fullCode = this.codeBlocks
                .slice()
                .sort((a, b) => a.order - b.order)
                .map(obj => obj.output ?? obj.block)
                .join('\n');

            this.fullCodeElement.textContent = fullCode;
            hljs.highlightElement(this.fullCodeElement);

            if (isCorrect) {
                this.showToast('success');
                if (this.onSolvedCallback) {
                    setTimeout(() => {
                        this.onSolvedCallback(fullCode);
                    }, 1500);
                } else {
                    this.solutionModal.style.display = 'block';
                }
                return true;
            }

            this.showToast('error');
            return false;
        }

        const droppedItems = Array.from(this.dropArea.children).filter(item => !item.classList.contains('placeholder'));
        const droppedOrder = droppedItems.map(item => parseInt(item.dataset.order));
        // Build the full code in original order, INCLUDING empty blocks.
        // Empty blocks are not draggable tiles, but represent blank lines/spacing in the authored code.
        const fullCode = this.codeBlocks
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(obj => obj.output ?? obj.block)
            .join('\n');
        this.fullCodeElement.textContent = fullCode;
        console.log("fullCode: \n", fullCode);


        hljs.highlightElement(this.fullCodeElement);
        const correctOrder = this.codeBlocks
            .filter(obj => !obj.isEmpty)
            .sort((a, b) => a.order - b.order)
            .map(obj => obj.order);
        if (JSON.stringify(droppedOrder) === JSON.stringify(correctOrder)) {
            this.showToast('success');
            console.log("onSolvedCallback: ", this.onSolvedCallback);
            if (this.onSolvedCallback) {
                
                console.log("Calling callback function now!");
                setTimeout(() => {
                    this.onSolvedCallback(fullCode);
                }, 1500); // Display for 2.5 seconds
            }
            else {
                this.solutionModal.style.display = 'block';
            }
            return true;
        } else {
            this.showToast('error');
            return false;
        }
    }

    showToast(type) {
        const toast = type === 'success' ? this.toastSuccess : this.toastError;

        console.log("Toast: ", toast);
        if (!toast) {
            console.error(`Toast element not found for type ${type}.`);
            return;
        }
    
        // Ensure the puzzle container is positioned relatively
        const containerStyle = getComputedStyle(this.puzzleContainer);
        if (containerStyle.position === 'static') {
            this.puzzleContainer.style.position = 'relative';
        }
    
        // Position the toast in the center of the puzzle container
        toast.style.position = 'absolute';
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
        toast.style.display = 'block';
    
        // Hide the toast after a delay
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2500); // Display for 2.5 seconds
    }
    

    createSolutionModal(puzzleContainerId) {
        const modal = document.createElement('div');
        modal.id = `solutionModal-${puzzleContainerId}`;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <pre><code id="fullCode-${puzzleContainerId}" class="highlight ${this.escapeHTML(this.lang)}"></code></pre>
                <button id="copyCodeButton-${puzzleContainerId}" class="button button-check-solution">Riktig! 🔥 Kopier koden!</button>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    createPlaceholder(dropArea) {
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = 'Dra og dropp kode her!';
        dropArea.appendChild(placeholder);
    }

    createDropAreaPlaceholder(dropArea) {
        const existing = dropArea.querySelector('.placeholder');
        if (existing) return;
        this.createPlaceholder(dropArea);
    }

    addIndentationGuides(container) {
        // Clear any old guides/preview (e.g., after reset).
        container.querySelectorAll('.parsons-indentation-guide').forEach((el) => el.remove());
        container.querySelectorAll('.parsons-indentation-preview').forEach((el) => el.remove());

        container.style.position = 'relative';

        const style = getComputedStyle(container);
        this.dropAreaPaddingLeft = parseFloat(style.paddingLeft || '0') || 0;

        // Live indentation preview column.
        this.indentationPreview = document.createElement('div');
        this.indentationPreview.className = 'parsons-indentation-preview';
        this.indentationPreview.style.width = `${this.indentationWidth}px`;
        this.indentationPreview.style.display = 'none';
        container.appendChild(this.indentationPreview);

        // Guides for each allowed indentation level (including 0).
        this.indentationGuides = [];
        for (let i = 0; i <= this.maxIndentationLevel; i++) {
            const guide = document.createElement('div');
            guide.className = 'parsons-indentation-guide';
            guide.dataset.level = String(i);
            guide.style.left = `${this.dropAreaPaddingLeft + i * this.indentationWidth}px`;
            container.appendChild(guide);
            this.indentationGuides.push(guide);
        }
    }

    computeIndentLevelFromClientX(clientX) {
        if (!this.dropArea) return 0;

        const dropRect = this.dropArea.getBoundingClientRect();
        const paddingLeft = Number.isFinite(this.dropAreaPaddingLeft)
            ? this.dropAreaPaddingLeft
            : (parseFloat(getComputedStyle(this.dropArea).paddingLeft || '0') || 0);

        // Snap based on the tile's upper-left corner within the drop area's *content* box.
        // This makes indent=0 feel natural even when the tile is cursor-centered.
        const tileLeftClientX = clientX - (this.dragOffsetX || 0);
        const relativeLeft = tileLeftClientX - dropRect.left - paddingLeft;

        let indentLevel = Math.round(relativeLeft / this.indentationWidth);
        indentLevel = Math.max(0, Math.min(indentLevel, this.maxIndentationLevel));
        return indentLevel;
    }

    setIndentationPreview(indentLevel) {
        if (!this.indentationPreview) return;

        const paddingLeft = Number.isFinite(this.dropAreaPaddingLeft) ? this.dropAreaPaddingLeft : 0;
        this.indentationPreview.style.left = `${paddingLeft + indentLevel * this.indentationWidth}px`;
        this.indentationPreview.dataset.level = String(indentLevel);
        this.indentationPreview.style.display = '';

        if (Array.isArray(this.indentationGuides)) {
            this.indentationGuides.forEach((g) => {
                g.classList.toggle('is-active', g.dataset.level === String(indentLevel));
            });
        }
    }

    clearIndentationPreview() {
        if (this.indentationPreview) {
            this.indentationPreview.style.display = 'none';
        }
        if (Array.isArray(this.indentationGuides)) {
            this.indentationGuides.forEach((g) => g.classList.remove('is-active'));
        }
        this.pendingIndentLevel = null;
    }

    enableIndentationDragAndDrop() {
        // IMPORTANT: This must be idempotent.
        // Reset/reshuffle moves tiles around; we should not attach per-tile listeners each time,
        // otherwise we stack handlers and a single mousedown can trigger multiple drags.
        if (this._indentationDnDEnabled) return;
        this._indentationDnDEnabled = true;

        this._indentationMouseDownHandler = (e) => {
            const tile = e.target && e.target.closest ? e.target.closest('.parsons-tile') : null;
            if (!tile) return;
            if (!this.puzzleContainer || !this.puzzleContainer.contains(tile)) return;
            if (this.currentTile) return;
            if (tile.classList.contains('parsons-dragging')) return;
            this.indentDragStart(e, tile);
        };

        this.puzzleContainer.addEventListener('mousedown', this._indentationMouseDownHandler);
    }

    indentDragStart(e, tile) {
        // Only left click / primary touch.
        if (e.button != null && e.button !== 0) return;
        e.preventDefault();

        this.currentTile = tile;
        this.dragOriginalParent = tile.parentElement;
        this.pendingIndentLevel = null;

        this.dragPlaceholder = document.createElement('div');
        this.dragPlaceholder.className = 'parsons-drag-placeholder';
        this.dragPlaceholder.style.height = `${tile.offsetHeight}px`;

        tile.parentElement.insertBefore(this.dragPlaceholder, tile.nextSibling);

        const rect = tile.getBoundingClientRect();
        // Natural pickup: keep the cursor's grab point within the tile.
        // Indentation snapping still tracks the tile's upper-left via dragOffsetX.
        this.dragOffsetX = e.clientX - rect.left;
        this.dragOffsetY = e.clientY - rect.top;

        document.body.appendChild(tile);
        // Use fixed positioning so clientX/clientY map directly (no scroll mismatch).
        tile.style.position = 'fixed';
        tile.style.zIndex = '1000';
        tile.style.width = `${rect.width}px`;
        tile.classList.add('parsons-dragging');

        this.indentDragMoveBound = (ev) => this.indentDragMove(ev);
        this.indentDragEndBound = (ev) => this.indentDragEnd(ev);

        document.addEventListener('mousemove', this.indentDragMoveBound);
        document.addEventListener('mouseup', this.indentDragEndBound);

        this.indentMoveAt(e.clientX, e.clientY);
    }

    indentMoveAt(clientX, clientY) {
        if (!this.currentTile) return;
        this.currentTile.style.left = `${clientX - this.dragOffsetX}px`;
        this.currentTile.style.top = `${clientY - this.dragOffsetY}px`;
    }

    updateDropPreview(indentLevel, enabled) {
        if (!this.dragPlaceholder) return;
        if (!enabled) {
            this.dragPlaceholder.classList.remove('parsons-drop-preview');
            this.dragPlaceholder.style.marginLeft = '';
            this.dragPlaceholder.style.width = '';
            this.dragPlaceholder.dataset.level = '';
            return;
        }

        const indentPx = indentLevel * this.indentationWidth;
        this.dragPlaceholder.classList.add('parsons-drop-preview');
        this.dragPlaceholder.style.marginLeft = `${indentPx}px`;
        this.dragPlaceholder.style.width = `calc(100% - ${indentPx}px)`;
        this.dragPlaceholder.dataset.level = String(indentLevel);
    }

    indentDragMove(e) {
        e.preventDefault();
        this.indentMoveAt(e.clientX, e.clientY);

        const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
        const isOverDrop = elementsBelow.some((el) => el === this.dropArea || this.dropArea.contains(el));
        const isOverPool = elementsBelow.some((el) => el === this.draggableCodeContainer || this.draggableCodeContainer.contains(el));

        const newParent = isOverDrop ? this.dropArea : (isOverPool ? this.draggableCodeContainer : null);
        if (!newParent) return;

        // Live indentation feedback while hovering over the drop area.
        if (isOverDrop) {
            const indentLevel = this.computeIndentLevelFromClientX(e.clientX);
            this.pendingIndentLevel = indentLevel;
            this.setIndentationPreview(indentLevel);
            // Snap the visual indentation while dragging so placement is easy.
            this.currentTile.style.paddingLeft = `${indentLevel * this.indentationWidth}px`;
            this.updateDropPreview(indentLevel, true);
        } else {
            this.clearIndentationPreview();
            // In the pool, show tiles without indentation.
            this.currentTile.style.paddingLeft = '';
            this.updateDropPreview(0, false);
        }

        if (this.dragPlaceholder.parentElement !== newParent) {
            this.dragPlaceholder.remove();
            newParent.appendChild(this.dragPlaceholder);
        }

        const selector = '.parsons-tile:not(.parsons-dragging)';
        const siblings = Array.from(newParent.querySelectorAll(selector));
        let insertBefore = null;
        for (const sib of siblings) {
            const rect = sib.getBoundingClientRect();
            if (e.clientY < rect.top + rect.height / 2) {
                insertBefore = sib;
                break;
            }
        }

        if (insertBefore) {
            newParent.insertBefore(this.dragPlaceholder, insertBefore);
        } else {
            newParent.appendChild(this.dragPlaceholder);
        }
    }

    indentDragEnd(e) {
        e.preventDefault();

        document.removeEventListener('mousemove', this.indentDragMoveBound);
        document.removeEventListener('mouseup', this.indentDragEndBound);

        const finalParent = this.dragPlaceholder.parentElement;

        if (finalParent === this.dropArea) {
            const indentLevel = (this.pendingIndentLevel != null)
                ? this.pendingIndentLevel
                : this.computeIndentLevelFromClientX(e.clientX);
            this.currentTile.dataset.currentIndentation = String(indentLevel);
            this.currentTile.style.paddingLeft = `${indentLevel * this.indentationWidth}px`;
        } else {
            // In the pool, indentation doesn't apply.
            this.currentTile.dataset.currentIndentation = '0';
            this.currentTile.style.paddingLeft = '';
        }

        this.clearIndentationPreview();
        this.updateDropPreview(0, false);

        this.currentTile.style.position = '';
        this.currentTile.style.left = '';
        this.currentTile.style.top = '';
        this.currentTile.style.zIndex = '';
        this.currentTile.style.width = '';
        this.currentTile.classList.remove('parsons-dragging');

        finalParent.insertBefore(this.currentTile, this.dragPlaceholder);
        this.dragPlaceholder.remove();

        this.currentTile = null;
        this.dragPlaceholder = null;

        // Toggle the drop-area placeholder message.
        const placeholder = this.dropArea.querySelector('.placeholder');
        const tilesInDrop = this.dropArea.querySelectorAll('.parsons-tile').length;
        if (placeholder) {
            placeholder.style.display = tilesInDrop === 0 ? '' : 'none';
        }
    }


    enableDragAndDrop(draggableContainer, dropArea) {
        const draggables = draggableContainer.querySelectorAll('.draggable');
        
        // Event listeners for drag start and drag end
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', (e) => this.dragStart(e));
            draggable.addEventListener('dragend', (e) => this.dragEnd(e, dropArea));  // Always pass dropArea to manage the placeholder correctly
        });
    
        // Event listeners for drop area and draggable area
        [dropArea, draggableContainer].forEach(container => {
            container.addEventListener('dragover', (e) => this.dragOver(e, container));
            container.addEventListener('drop', (e) => this.drop(e, container, this.dropArea.querySelector('.placeholder')));  // Always manage placeholder from dropArea
        });
    
        // New event listeners to ensure no lingering active state after a drop
        dropArea.addEventListener('drop', () => {
            // Temporarily disable pointer events on all draggables to clear active state
            const allDraggables = document.querySelectorAll('.draggable');
            allDraggables.forEach(item => {
                item.style.pointerEvents = 'none';
            });
    
            // Re-enable pointer events after a short delay
            setTimeout(() => {
                allDraggables.forEach(item => {
                    item.style.pointerEvents = '';
                });
            }, 100); // Short delay to allow the active state to clear
        });
    }
    

    dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.order);
        e.target.classList.add('dragging');


        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);
    }

    // Ensure dragEnd method doesn't remove the placeholder incorrectly
    dragEnd(e, dropArea) {
        e.target.style.display = 'block';
        e.target.classList.remove('dragging');

        this.updatePlaceholderVisibility(this.dropArea, this.draggableCodeContainer);  // Ensure placeholder visibility is updated based on both areas
    }

    dragOver(e, dropArea) {
        e.preventDefault();
        const draggable = document.querySelector('.dragging');
        const afterElement = this.getDragAfterElement(e.clientY, dropArea);
        if (afterElement == null) {
            dropArea.insertBefore(draggable, dropArea.querySelector('.placeholder'));
        } else {
            const box = afterElement.getBoundingClientRect();
            const offset = e.clientY - box.top;
            if (offset < box.height / 2) {
                dropArea.insertBefore(draggable, afterElement);
            } else {
                dropArea.insertBefore(draggable, afterElement.nextSibling);
            }
        }
    }


    // Update the drop method to handle placeholder correctly
    drop(e, container, placeholder) {
        e.preventDefault();
        const draggableElement = document.querySelector('.dragging');
        const targetDropArea = e.target.closest('.drop-area');
        const targetDraggableArea = e.target.closest('.draggable-code');  // Handle re-adding to the draggable area
        const afterElement = this.getDragAfterElement(e.clientY, targetDropArea || targetDraggableArea);

        if (afterElement == null) {
            (targetDropArea || targetDraggableArea).insertBefore(draggableElement, placeholder);
        } else {
            const box = afterElement.getBoundingClientRect();
            const offset = e.clientY - box.top;
            if (offset < box.height / 2) {
                (targetDropArea || targetDraggableArea).insertBefore(draggableElement, afterElement);
            } else {
                (targetDropArea || targetDraggableArea).insertBefore(draggableElement, afterElement.nextSibling);
            }
        }
        this.updatePlaceholderVisibility(this.dropArea, this.draggableCodeContainer);  // Update placeholder visibility for both areas
    }

    // Updated updatePlaceholderVisibility to consider both areas
    updatePlaceholderVisibility(dropArea, draggableCodeContainer) {
        const dropAreaBlockCount = dropArea.querySelectorAll('.draggable').length;
        const draggableBlockCount = draggableCodeContainer.querySelectorAll('.draggable').length;
        
        console.log("dropAreaBlockCount: ", dropAreaBlockCount);
        const placeholder = dropArea.querySelector('.placeholder');
        if (draggableBlockCount === 0) {
            if (placeholder) placeholder.style.display = 'none';  // Hide if no blocks in drop area
        } else {
            if (!placeholder) {
                this.createPlaceholder(dropArea);  // Create if missing
            }
            placeholder.style.display = '';  // Show if blocks exist
        }

        // Ensure the placeholder is always at the end of the drop area when visible
        if (placeholder && dropAreaBlockCount > 0) {
            dropArea.appendChild(placeholder);
        }
    }

    getDragAfterElement(y, dropArea) {
        const draggableElements = [...dropArea.querySelectorAll('.draggable:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    reset() {
        if (this.indentationMode === 'student') {
            const tiles = Array.from(this.dropArea.querySelectorAll('.parsons-tile'));
            tiles.forEach((tile) => {
                tile.dataset.currentIndentation = '0';
                tile.style.paddingLeft = '';
                this.draggableCodeContainer.appendChild(tile);
            });
            const poolTiles = Array.from(this.draggableCodeContainer.querySelectorAll('.parsons-tile'));
            this.shuffleArray(poolTiles).forEach((el) => this.draggableCodeContainer.appendChild(el));

            const placeholder = this.dropArea.querySelector('.placeholder');
            if (placeholder) placeholder.style.display = '';
            else this.createDropAreaPlaceholder(this.dropArea);

            // Re-bind handlers because reshuffling moves nodes around.
            // (Binding is delegated and idempotent; no need to re-bind here.)
            return;
        }

        this.feedback.textContent = '';
        const draggableElements = this.dropArea.querySelectorAll('.draggable');
        draggableElements.forEach(element => {
            this.draggableCodeContainer.appendChild(element);
        });
        const originalShuffledOrder = Array.from(this.draggableCodeContainer.querySelectorAll('.draggable'));
        this.shuffleArray(originalShuffledOrder).forEach(element => {
            this.draggableCodeContainer.appendChild(element);
        });
        const placeholder = this.dropArea.querySelector('.placeholder');
        if (placeholder) {
            placeholder.style.display = '';
        } else {
            this.createPlaceholder(this.dropArea);
        }
    }

    reshuffle() {
        const originalShuffledOrder = Array.from(this.draggableCodeContainer.querySelectorAll('.draggable'));
        this.shuffleArray(originalShuffledOrder).forEach(element => {
            this.draggableCodeContainer.appendChild(element);
        });
    }
}


function makeParsonsPuzzle(puzzleContainerId, codeString) {
    new ParsonsPuzzle(puzzleContainerId, codeString);
}


function makeCallbackFunction(puzzleContainerId, editorId) {
    function callbackFunction(fullCode) {
        document.getElementById(puzzleContainerId).style.display = 'none';
        let editorContainer = document.getElementById(editorId);
        editorContainer.style.display = 'block';

        makeInteractiveCode(editorId, fullCode);
    }

    return callbackFunction;
}


class IndentationParsonsPuzzle extends ParsonsPuzzle {
    constructor(puzzleContainerId, codeString, onSolvedCallback = null) {
        super(puzzleContainerId, codeString, onSolvedCallback, { indentationMode: 'student' });
    }
}
