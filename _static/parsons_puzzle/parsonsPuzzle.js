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
        this.feedback = document.getElementById(this.feedbackId);
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

        document.addEventListener('mousemove', (event) => {
            this.cursorX = event.clientX;
            this.cursorY = event.clientY;
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
        this.feedbackId = `feedback-${uniqueId}`;
        this.draggableId = `draggable-code-${uniqueId}`;
        this.toastId = `toast-${uniqueId}`;


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
            <div id="${this.toastId}" class="toast" style="display: none;">
                <p>Riktig! 🔥</p>
            </div>
            <div id="${this.draggableId}" class="draggable-code"></div>
            <div id="${this.dropAreaId}" class="drop-area"></div>
            <div class="button-container">
                <button id="${this.checkSolutionId}" class="button button-check-solution">Sjekk løsning ${checkSolutionIcon}</button>
                <button id="${this.resetButtonId}" class="button button-reset-puzzle">Reset puslespill ${resetIcon}</button>
            </div>
            <div id="${this.feedbackId}" class="feedback"></div>
        `;

        container.innerHTML = html;
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
            this.feedback.textContent = 'Riktig!';
            this.feedback.style.color = 'green';

            console.log("onSolvedCallback: ", this.onSolvedCallback);
            if (this.onSolvedCallback) {
                this.showToast();
                console.log("Calling callback function now!");
                this.onSolvedCallback(fullCode);
            }
            else {
                this.solutionModal.style.display = 'block';
            }
            return true;
        } else {
            this.feedback.textContent = 'Prøv igjen!';
            this.feedback.style.color = 'red';
            return false;
        }
    }

    showToast() {
        const toast = this.createToast();
        console.log("toast: ", toast);

        console.log("X = ", this.cursorX);
        console.log("Y = ", this.cursorY);

        toast.style.top = `${this.cursorY - 150}px`;
        toast.style.left = `${this.cursorX}px`;

        toast.style.display = 'block';

        

        setTimeout(() => {
            toast.style.display = 'none';
        }, 2500); // Display for 2.5 seconds (2000 ms)

    }

    createToast() {
        const toast = document.createElement('div');
        toast.id = `toast-${this.puzzleContainerId}`;
        toast.className = 'toast';
        toast.style.display = 'none';
        toast.innerHTML = `
            <p>Riktig! Bra jobba! 🔥</p>
        `;

        document.body.appendChild(toast);
        return toast;
    }

    createSolutionModal(puzzleContainerId) {
        const modal = document.createElement('div');
        modal.id = `solutionModal-${puzzleContainerId}`;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <pre><code id="fullCode-${puzzleContainerId}" class="highlight python"></code></pre>
                <button id="copyCodeButton-${puzzleContainerId}" class="button button-check-solution">Bra jobba! 🔥 Kopier koden!</button>
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