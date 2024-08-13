
/**
 * Initializes a Parsons puzzle by setting up the drag-and-drop elements,
 * the solution checking mechanism, and the reset functionality.
 * @param {string} puzzleContainerId - The ID of the puzzle container element.
 * @param {string} codeString - The code as a single string to be split and randomized.
 */
function initializeParsonsPuzzle(puzzleContainerId, codeString) {
    const puzzleContainer = document.getElementById(puzzleContainerId);
    const dropArea = puzzleContainer.querySelector('#drop-area');
    const checkButton = puzzleContainer.querySelector('#check-solution');
    const resetButton = puzzleContainer.querySelector('#reset-puzzle');
    const feedback = puzzleContainer.querySelector('#feedback');
    const draggableCodeContainer = puzzleContainer.querySelector('#draggable-code');
  
    const solutionModal = createSolutionModal(puzzleContainerId);
    const fullCodeElement = solutionModal.querySelector(`#fullCode-${puzzleContainerId}`);
    const closeModalButton = solutionModal.querySelector('.close');
    const copyCodeButton = solutionModal.querySelector(`#copyCodeButton-${puzzleContainerId}`);

  
    // Preprocess and shuffle the code once, then keep it stored in a variable
    let codeBlocks = preprocessCode(codeString);
    let shuffledCodeBlocks = shuffleArray(codeBlocks.slice()); // Shuffle and store the shuffled order
  
    renderDraggableCode(draggableCodeContainer, shuffledCodeBlocks);
    createPlaceholder(dropArea);
    enableDragAndDrop(draggableCodeContainer, dropArea);

  
    checkButton.addEventListener('click', () => {
        checkSolution(dropArea, codeBlocks, feedback, fullCodeElement, solutionModal);
    });
  
    resetButton.addEventListener('click', () => {
        //resetPuzzle(draggableCodeContainer, dropArea, shuffledCodeBlocks, feedback);
        reset();
        reshuffle();
    });
  
    closeModalButton.addEventListener('click', () => {
        solutionModal.style.display = 'none';
    });
  
    copyCodeButton.addEventListener('click', () => {
        navigator.clipboard.writeText(fullCodeElement.textContent).then(() => {
            alert('Du har kopiert koden!');
        });
    });



}

/**
 * Resets the puzzle to its shuffled state, clearing the drop area and feedback.
 * @param {HTMLElement} draggableContainer - The container holding the draggable elements.
 * @param {HTMLElement} dropArea - The drop area where elements were dropped.
 * @param {Array} shuffledCodeBlocks - The shuffled code block objects to reset to.
 * @param {HTMLElement} feedbackElement - The element displaying feedback.
 */


function reset() {
    console.log('Reset function called');

    const dropArea = document.querySelector('#drop-area');
    const draggableCodeContainer = document.querySelector('#draggable-code');
    const originalShuffledOrder = Array.from(draggableCodeContainer.querySelectorAll('.draggable')); // Store original order or reshuffle as needed
    const feedbackElement = document.querySelector('#feedback');

    // Clear feedback text
    feedbackElement.textContent = '';  // Reset the text content of the feedback element

    if (!dropArea) {
        console.error('Drop area not found');
        return;
    }

    if (!draggableCodeContainer) {
        console.error('Draggable code container not found');
        return;
    }

    // Move all draggable elements back to the original container
    const draggableElements = dropArea.querySelectorAll('.draggable');
    draggableElements.forEach(element => {
        console.log(`Moving element ${element.id} back to draggable code container`);
        draggableCodeContainer.appendChild(element);
    });

    shuffleArray(originalShuffledOrder).forEach(element => {
        draggableCodeContainer.appendChild(element);
    });

    // Reset placeholder visibility
    const placeholder = dropArea.querySelector('.placeholder');
    if (placeholder) {
        console.log('Showing placeholder');
        placeholder.style.display = '';
    } else {
        console.error('Placeholder not found');
    }

    // Additional reset logic if any
    console.log('Reset function completed');
}

function reshuffle() {
    const draggableCodeContainer = document.querySelector('#draggable-code');
    const originalShuffledOrder = Array.from(draggableCodeContainer.querySelectorAll('.draggable')); // Store original order or reshuffle as needed

    shuffleArray(originalShuffledOrder).forEach(element => {
        draggableCodeContainer.appendChild(element);
    });
}






// /**
//  * Preprocesses the code by grouping semicolon-separated lines into single blocks,
//  * preserving indentation, and removing the semicolons from the puzzle representation.
//  * @param {string} codeString - The full code as a string.
//  * @returns {Array} - An array of objects containing the code blocks with their original order.
//  */
// function preprocessCode(codeString) {
//     const blocks = codeString.split('\n').reduce((acc, line, index) => {
//         if (line.includes(';')) {
//             // Split the line by semicolons and trim each part, preserving indentation
//             const parts = line.split(';').map(part => part.match(/^\s*/) + part.trim()).filter(part => part !== '');
//             acc.push({
//                 block: parts.join('\n'),  // Join parts into a single block with each part on a new line
//                 order: index
//             });
//         } else {
//             const trimmedLine = line.match(/^\s*/) + line.trim(); // Preserve indentation
//             if (trimmedLine.trim()) {  // Ensure no empty blocks are created
//                 acc.push({
//                     block: trimmedLine,
//                     order: index
//                 });
//             }
//         }
//         return acc;
//     }, []);

//     return blocks;
// }

function preprocessCode(codeString) {
    const lines = codeString.split('\n');
    return lines.map((line, index) => {
        let trimmedLine = line.trim();

        if (line.includes(';')) {
            const parts = line.split(';').map(part => part.trim()).filter(part => part !== '');
            trimmedLine = parts.join('\n'); // Join parts into a single block with each part on a new line
        }

        return {
            block: line.includes(';') ? trimmedLine : line,
            order: index,
            isEmpty: line.trim() === '' // Add an `isEmpty` property to track empty lines
        };
    });
}




function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// function renderDraggableCode(container, codeBlockObjects) {
//     container.innerHTML = '';  // Clear the container
//     codeBlockObjects.forEach((obj) => {
//         const lineElement = document.createElement('div');
//         lineElement.className = 'draggable';
//         lineElement.draggable = true;
//         lineElement.dataset.order = obj.order;
        
//         lineElement.innerHTML = `<pre class="highlight python"><code>${escapeHTML(obj.block)}</code></pre>`;
        
//         container.appendChild(lineElement);
//         hljs.highlightElement(lineElement.querySelector('code'));
//     });
// }


function renderDraggableCode(container, codeBlockObjects) {
    container.innerHTML = '';  // Clear the container
    codeBlockObjects.forEach((obj) => {
        if (!obj.isEmpty) { // Skip rendering for empty lines
            const lineElement = document.createElement('div');
            lineElement.className = 'draggable';
            lineElement.draggable = true;
            lineElement.dataset.order = obj.order;
            
            lineElement.innerHTML = `<pre class="highlight python"><code>${escapeHTML(obj.block)}</code></pre>`;
            
            container.appendChild(lineElement);
            hljs.highlightElement(lineElement.querySelector('code'));
        }
    });
}


function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

// /**
//  * Checks the solution by comparing the order of elements in the drop area
//  * with the original order of the code blocks.
//  * @param {HTMLElement} dropArea - The drop area containing the ordered elements.
//  * @param {Array} codeBlockObjects - The original code block objects to check against.
//  * @param {HTMLElement} feedbackElement - The element to display feedback to the user.
//  * @param {HTMLElement} fullCodeElement - The element where the full code will be displayed.
//  * @param {HTMLElement} solutionModal - The modal to display the full code.
//  */
// function checkSolution(dropArea, codeBlockObjects, feedbackElement, fullCodeElement, solutionModal) {
//     const droppedItems = Array.from(dropArea.children).filter(item => !item.classList.contains('placeholder'));
//     const droppedOrder = droppedItems.map(item => parseInt(item.dataset.order));

//     // Sort the codeBlockObjects based on their original order to get the correct sequence
//     const correctOrder = codeBlockObjects.slice().sort((a, b) => a.order - b.order).map(obj => obj.order);

//     if (JSON.stringify(droppedOrder) === JSON.stringify(correctOrder)) {
//         feedbackElement.textContent = 'Riktig!';
//         feedbackElement.style.color = 'green';

//         // Combine the full code and show it in the modal, preserving indentation
//         const fullCode = droppedItems.map(item => item.querySelector('code').textContent).join('\n');
//         fullCodeElement.textContent = fullCode;

//         // Apply syntax highlighting to the full code
//         hljs.highlightElement(fullCodeElement);

//         solutionModal.style.display = 'block';
//     } else {
//         feedbackElement.textContent = 'Prøv igjen!';
//         feedbackElement.style.color = 'red';
//     }
// }


function checkSolution(dropArea, codeBlockObjects, feedbackElement, fullCodeElement, solutionModal) {
    const droppedItems = Array.from(dropArea.children).filter(item => !item.classList.contains('placeholder'));
    const droppedOrder = droppedItems.map(item => parseInt(item.dataset.order));

    // Combine all code blocks based on their order to form the full code, including empty lines
    const fullCode = codeBlockObjects.sort((a, b) => a.order - b.order)
                         .map(obj => obj.block)
                         .join('\n');
    
    fullCodeElement.textContent = fullCode;
    hljs.highlightElement(fullCodeElement);

    // Solution correctness check remains unchanged
    const correctOrder = codeBlockObjects.filter(obj => !obj.isEmpty)
                                         .sort((a, b) => a.order - b.order)
                                         .map(obj => obj.order);
    if (JSON.stringify(droppedOrder) === JSON.stringify(correctOrder)) {
        feedbackElement.textContent = 'Riktig!';
        feedbackElement.style.color = 'green';
        solutionModal.style.display = 'block';
    } else {
        feedbackElement.textContent = 'Prøv igjen!';
        feedbackElement.style.color = 'red';
    }
}



function createSolutionModal(puzzleContainerId) {
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


function createPlaceholder(dropArea) {
    // Always start fresh
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.textContent = 'Dra og dropp kode her!';
    dropArea.appendChild(placeholder);
}



/**
 * Enables drag-and-drop functionality for the draggable elements and the drop area.
 * @param {HTMLElement} draggableContainer - The container holding the draggable elements.
 * @param {HTMLElement} dropArea - The drop area where elements can be dropped.
 */
function enableDragAndDrop(draggableContainer, dropArea) {
    const draggables = draggableContainer.querySelectorAll('.draggable');
    const placeholder = dropArea.querySelector('.placeholder');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', (e) => {
            dragEnd(e);
        });
    });

    dropArea.addEventListener('dragover', (e) => dragOver(e, dropArea, placeholder));
    dropArea.addEventListener('drop', (e) => {
        drop(e);
    });

    // Ensure placeholder text is shown after reset
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.order);
    e.target.classList.add('dragging');
    setTimeout(() => {
        e.target.style.display = 'none';
    }, 0); // Hide the element briefly while dragging
}

function dragEnd(e) {
    e.target.style.display = 'block';
    e.target.classList.remove('dragging');
}

function dragOver(e, dropArea, placeholder) {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY, dropArea);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        dropArea.insertBefore(draggable, placeholder);
    } else {
        dropArea.insertBefore(draggable, afterElement);
    }

    dropArea.appendChild(placeholder);
}


// function dragOver(e, dropArea, placeholder) {
//     e.preventDefault();

//     const afterElement = getDragAfterElement(e.clientY, dropArea);
//     const draggable = document.querySelector('.dragging');

//     // Debugging output to understand the state when error occurs
//     console.log('Drag Over:', {
//         afterElement,
//         draggable,
//         placeholder,
//         children: Array.from(dropArea.children).map(child => child.className)
//     });

//     if (!draggable) {
//         console.error('No element is currently being dragged.');
//         return;
//     }

//     // Confirm both elements are in the correct parent
//     if (afterElement === null) {
//         if (placeholder.parentNode !== dropArea) {
//             console.error('Placeholder not in dropArea when attempting to append at the end.');
//             dropArea.appendChild(placeholder);
//         }
//         dropArea.appendChild(placeholder);
//     } else {
//         if (afterElement.parentNode !== dropArea) {
//             console.error('Attempting to insert before an element not in dropArea.');
//             return; // Avoid executing insertBefore
//         }
//         dropArea.insertBefore(placeholder, afterElement);
//     }
// }





function drop(e) {
    e.preventDefault();
    const draggableElement = document.querySelector('.dragging');
    const dropArea = e.target.closest('#drop-area');
    dropArea.insertBefore(draggableElement, dropArea.querySelector('.placeholder'));
    draggableElement.classList.remove('dragging');

    // Pass the draggableCodeContainer reference correctly
    const draggableCodeContainer = document.querySelector('#draggable-code');
    updatePlaceholderVisibility(dropArea, draggableCodeContainer);
}




function updatePlaceholderVisibility(dropArea, draggableCodeContainer) {
    const draggableItems = draggableCodeContainer.querySelectorAll('.draggable').length;

    // If all draggable elements are in the drop area, hide the placeholder
    if (draggableItems === 0) {
        dropArea.querySelector('.placeholder').style.display = 'none';
    } else {
        dropArea.querySelector('.placeholder').style.display = ''; // Ensure it's visible if not all are placed
    }
}



// function getDragAfterElement(y, dropArea) {
//     const draggableElements = [...dropArea.querySelectorAll('.draggable:not(.dragging)')];

//     return draggableElements.reduce((closest, child) => {
//         const box = child.getBoundingClientRect();
//         const offset = y - box.top - box.height / 2;
//         if (offset < 0 && offset > closest.offset) {
//             return { offset: offset, element: child };
//         } else {
//             return closest;
//         }
//     }, { offset: Number.NEGATIVE_INFINITY }).element;
// }

function getDragAfterElement(y, dropArea) {
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





/**
 * Creates a placeholder text inside the drop area.
 * @param {HTMLElement} dropArea - The drop area element.
 */
function createPlaceholderText(dropArea) {
    const placeholderText = document.createElement('div');
    placeholderText.className = 'placeholder-text';
    placeholderText.textContent = "Dra og dropp kodelinjer her!";
    dropArea.appendChild(placeholderText);
}
