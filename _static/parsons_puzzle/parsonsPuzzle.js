class ParsonsPuzzle {
    constructor(puzzleContainerId, codeString, onSolvedCallback = null) {
        this.puzzleContainerId = puzzleContainerId;
        this.puzzleContainer = document.getElementById(puzzleContainerId);
        this.codeString = codeString;
        this.onSolvedCallback = onSolvedCallback;

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

        this.renderDraggableCode(this.draggableCodeContainer, this.shuffledCodeBlocks);
        this.createPlaceholder(this.dropArea);
        this.enableDragAndDrop(this.draggableCodeContainer, this.dropArea);


        this.isSolved = false;
        
        this.addEventListeners();
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
        return lines.map((line, index) => {
            let trimmedLine = line.trim();
            if (line.includes(';')) {
                const parts = line.split(';');
                trimmedLine = parts.map(part => part.trim() === '' ? '' : part).join('\n');
            }
            return {
                block: line.includes(';') ? trimmedLine : line,
                order: index,
                isEmpty: line.trim() === ''
            };
        });
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
                lineElement.innerHTML = `<pre class="highlight python"><code>${this.escapeHTML(obj.block)}</code></pre>`;
                container.appendChild(lineElement);
                hljs.highlightElement(lineElement.querySelector('code'));
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
        const droppedItems = Array.from(this.dropArea.children).filter(item => !item.classList.contains('placeholder'));
        const droppedOrder = droppedItems.map(item => parseInt(item.dataset.order));
        const fullCode = this.codeBlocks.sort((a, b) => a.order - b.order).map(obj => obj.block).join('\n');
        this.fullCodeElement.textContent = fullCode;
        console.log("fullCode: \n", fullCode);


        hljs.highlightElement(this.fullCodeElement);
        const correctOrder = this.codeBlocks.filter(obj => !obj.isEmpty).sort((a, b) => a.order - b.order).map(obj => obj.order);
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
                <pre><code id="fullCode-${puzzleContainerId}" class="highlight python"></code></pre>
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
        super(puzzleContainerId, codeString, onSolvedCallback);

        // Override codeBlocks with preprocessed code
        this.codeBlocks = this.preprocessCodeWithIndentation(codeString);

        // Determine the maximum indentation level required by the code
        this.maxIndentationLevel = Math.max(...this.codeBlocks.map(obj => obj.expectedIndentation));

        // Initialize indentation settings
        this.indentationWidth = 40; // Pixels per indentation level

        // Shuffle the code blocks
        this.shuffledCodeBlocks = this.shuffleArray(this.codeBlocks.slice());

        // Render the draggable code lines
        this.renderDraggableCodeLines(this.draggableCodeContainer, this.shuffledCodeBlocks);

        // Add visual guides for indentation levels
        this.addIndentationGuides(this.dropArea);

        // Enable custom drag-and-drop functionality
        this.enableCustomDragAndDrop();
    }

    // Override the preprocessCode method to handle indentation
    preprocessCodeWithIndentation(codeString) {
        const lines = codeString.split('\n');
        return lines.map((line, index) => {
            const leadingSpaces = line.match(/^\s*/)[0].length;
            const indentLevel = leadingSpaces / 4; // Assuming 4 spaces per indent level
            const trimmedLine = line.trim();
            return {
                block: trimmedLine,
                order: index,
                expectedIndentation: indentLevel,
                isEmpty: trimmedLine === ''
            };
        });
    }

    // Render draggable code lines
    renderDraggableCodeLines(container, codeBlockObjects) {
        container.innerHTML = '';
        codeBlockObjects.forEach((obj) => {
            if (!obj.isEmpty) {
                const lineElement = document.createElement('div');
                lineElement.className = 'code-line';
                lineElement.dataset.order = obj.order;
                lineElement.dataset.expectedIndentation = obj.expectedIndentation;
                lineElement.dataset.currentIndentation = 0; // Initialize current indentation to 0

                // Code content
                const codeContent = document.createElement('pre');
                codeContent.className = 'highlight python code-content';
                codeContent.innerHTML = `<code>${this.escapeHTML(obj.block)}</code>`;

                // Assemble line element
                lineElement.appendChild(codeContent);

                container.appendChild(lineElement);
                hljs.highlightElement(codeContent.querySelector('code'));
            }
        });
    }

    // Add visual indentation guides to the drop area
    addIndentationGuides(container) {
        container.style.position = 'relative';
        for (let i = 1; i <= this.maxIndentationLevel; i++) {
            const guide = document.createElement('div');
            guide.className = 'indentation-guide';
            guide.style.left = `${i * this.indentationWidth}px`;
            container.appendChild(guide);
        }
    }

    // Enable custom drag-and-drop functionality
    enableCustomDragAndDrop() {
        const codeLines = this.puzzleContainer.querySelectorAll('.code-line');
        codeLines.forEach(codeLine => {
            codeLine.addEventListener('mousedown', (e) => this.dragStart(e, codeLine));
        });
    }

    dragStart(e, codeLine) {
        e.preventDefault();
        this.currentCodeLine = codeLine;
        this.startX = e.clientX;
        this.startY = e.clientY;

        this.originalParent = codeLine.parentElement;
        this.placeholder = document.createElement('div');
        this.placeholder.className = 'placeholder-code-line';
        this.placeholder.style.height = `${codeLine.offsetHeight}px`;

        // Insert placeholder
        codeLine.parentElement.insertBefore(this.placeholder, codeLine.nextSibling);

        // Move code line to body for absolute positioning
        document.body.appendChild(codeLine);
        codeLine.style.position = 'absolute';
        codeLine.style.zIndex = 1000;
        codeLine.classList.add('dragging');

        this.moveAt(e.pageX, e.pageY);

        document.addEventListener('mousemove', this.dragMove.bind(this));
        document.addEventListener('mouseup', this.dragEnd.bind(this));
    }

    moveAt(pageX, pageY) {
        this.currentCodeLine.style.left = pageX - this.currentCodeLine.offsetWidth / 2 + 'px';
        this.currentCodeLine.style.top = pageY - this.currentCodeLine.offsetHeight / 2 + 'px';
    }

    dragMove(e) {
        e.preventDefault();
        this.moveAt(e.pageX, e.pageY);

        // Check for potential drop targets
        const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
        const dropArea = this.dropArea;
        const draggableArea = this.draggableCodeContainer;

        let newParent = null;
        if (elementsBelow.includes(dropArea)) {
            newParent = dropArea;
        } else if (elementsBelow.includes(draggableArea)) {
            newParent = draggableArea;
        }

        if (newParent && this.currentCodeLine.parentElement !== newParent) {
            this.placeholder.remove();
            newParent.appendChild(this.placeholder);
        }

        // Adjust placeholder position within new parent
        const codeLines = Array.from(newParent.querySelectorAll('.code-line:not(.dragging)'));
        let insertBeforeElement = null;
        for (let codeLine of codeLines) {
            const rect = codeLine.getBoundingClientRect();
            if (e.clientY < rect.top + rect.height / 2) {
                insertBeforeElement = codeLine;
                break;
            }
        }

        if (insertBeforeElement) {
            newParent.insertBefore(this.placeholder, insertBeforeElement);
        } else {
            newParent.appendChild(this.placeholder);
        }
    }

    dragEnd(e) {
        e.preventDefault();
        document.removeEventListener('mousemove', this.dragMove.bind(this));
        document.removeEventListener('mouseup', this.dragEnd.bind(this));

        // Snap to indentation level
        const dropAreaRect = this.dropArea.getBoundingClientRect();
        const relativeX = e.clientX - dropAreaRect.left;
        let indentLevel = Math.round(relativeX / this.indentationWidth);
        indentLevel = Math.max(0, Math.min(indentLevel, this.maxIndentationLevel));

        this.currentCodeLine.dataset.currentIndentation = indentLevel;
        this.currentCodeLine.style.paddingLeft = `${indentLevel * this.indentationWidth}px`;

        // Remove styles added during dragging
        this.currentCodeLine.style.position = '';
        this.currentCodeLine.style.left = '';
        this.currentCodeLine.style.top = '';
        this.currentCodeLine.style.zIndex = '';
        this.currentCodeLine.classList.remove('dragging');

        // Insert the code line into the new parent
        this.placeholder.parentElement.insertBefore(this.currentCodeLine, this.placeholder);
        this.placeholder.remove();

        this.currentCodeLine = null;
    }

    // Override the checkSolution method to include indentation
    checkSolution() {
        const droppedItems = Array.from(this.dropArea.querySelectorAll('.code-line'));
        const droppedOrder = droppedItems.map(item => ({
            order: parseInt(item.dataset.order),
            indentation: parseInt(item.dataset.currentIndentation)
        }));

        // Get the expected order and indentation
        const correctOrder = this.codeBlocks.filter(obj => !obj.isEmpty).map(obj => ({
            order: obj.order,
            indentation: obj.expectedIndentation
        }));

        // Compare the student's solution with the correct one
        const isCorrect = this.compareSolutions(droppedOrder, correctOrder);

        // Prepare the full code with student's indentation for display
        const fullCode = droppedItems.map(item => {
            const numSpaces = parseInt(item.dataset.currentIndentation) * 4; // Assuming 4 spaces per indent level
            const indentation = ' '.repeat(numSpaces);
            const codeLine = this.codeBlocks.find(obj => obj.order === parseInt(item.dataset.order)).block;
            return indentation + codeLine;
        }).join('\n');

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
        } else {
            this.showToast('error');
            return false;
        }
    }

    // Helper method to compare solutions
    compareSolutions(droppedOrder, correctOrder) {
        if (droppedOrder.length !== correctOrder.length) {
            return false;
        }
        for (let i = 0; i < droppedOrder.length; i++) {
            if (droppedOrder[i].order !== correctOrder[i].order ||
                droppedOrder[i].indentation !== correctOrder[i].indentation) {
                return false;
            }
        }
        return true;
    }
}
