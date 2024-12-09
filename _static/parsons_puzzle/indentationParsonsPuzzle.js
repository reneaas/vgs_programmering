// class IndentationParsonsPuzzle extends ParsonsPuzzle {
//     constructor(puzzleContainerId, codeString, onSolvedCallback = null) {
//         super(puzzleContainerId, codeString, onSolvedCallback);

//         // Override codeBlocks with preprocessed code
//         this.codeBlocks = this.preprocessCodeWithIndentation(codeString);

//         // Shuffle the code blocks
//         this.shuffledCodeBlocks = this.shuffleArray(this.codeBlocks.slice());

//         // Render the draggable code with indentation controls
//         this.renderDraggableCodeWithIndentation(this.draggableCodeContainer, this.shuffledCodeBlocks);

//         // Enable drag-and-drop functionality
//         this.enableDragAndDrop(this.draggableCodeContainer, this.dropArea);
//     }

//     // Override the preprocessCode method to handle indentation
//     preprocessCodeWithIndentation(codeString) {
//         const lines = codeString.split('\n');
//         return lines.map((line, index) => {
//             const leadingSpaces = line.match(/^\s*/)[0].length;
//             const trimmedLine = line.trim();
//             return {
//                 block: trimmedLine,
//                 order: index,
//                 expectedIndentation: leadingSpaces,
//                 isEmpty: trimmedLine === ''
//             };
//         });
//     }

//     // Render draggable code with indentation controls
//     renderDraggableCodeWithIndentation(container, codeBlockObjects) {
//         container.innerHTML = '';
//         codeBlockObjects.forEach((obj) => {
//             if (!obj.isEmpty) {
//                 const lineElement = document.createElement('div');
//                 lineElement.className = 'draggable';
//                 lineElement.draggable = true;
//                 lineElement.dataset.order = obj.order;
//                 lineElement.dataset.expectedIndentation = obj.expectedIndentation;
//                 lineElement.dataset.currentIndentation = 0; // Initialize current indentation to 0

//                 // Code content
//                 const codeContent = document.createElement('pre');
//                 codeContent.className = 'highlight python code-content';
//                 codeContent.innerHTML = `<code>${this.escapeHTML(obj.block)}</code>`;

//                 // Create indentation controls
//                 const indentationControls = document.createElement('div');
//                 indentationControls.className = 'indentation-controls';

//                 const decreaseIndentButton = document.createElement('button');
//                 decreaseIndentButton.className = 'indent-button decrease-indent';
//                 decreaseIndentButton.textContent = '←'; // Left arrow
//                 decreaseIndentButton.addEventListener('click', (e) => {
//                     e.stopPropagation();
//                     this.changeIndentation(lineElement, -1); // Decrease indentation level
//                 });

//                 const increaseIndentButton = document.createElement('button');
//                 increaseIndentButton.className = 'indent-button increase-indent';
//                 increaseIndentButton.textContent = '→'; // Right arrow
//                 increaseIndentButton.addEventListener('click', (e) => {
//                     e.stopPropagation();
//                     this.changeIndentation(lineElement, 1); // Increase indentation level
//                 });

//                 indentationControls.appendChild(decreaseIndentButton);
//                 indentationControls.appendChild(increaseIndentButton);

//                 // Assemble line element
//                 lineElement.appendChild(indentationControls);
//                 lineElement.appendChild(codeContent);

//                 container.appendChild(lineElement);
//                 hljs.highlightElement(codeContent.querySelector('code'));
//             }
//         });
//     }

//     // Method to change indentation
//     changeIndentation(lineElement, change) {
//         let currentIndent = parseInt(lineElement.dataset.currentIndentation);
//         currentIndent += change;

//         // Ensure indentation is not negative
//         if (currentIndent < 0) {
//             currentIndent = 0;
//         }

//         lineElement.dataset.currentIndentation = currentIndent;
//         lineElement.style.paddingLeft = `${currentIndent * 20}px`; // 20px per indent level
//     }

//     // Override the checkSolution method to include indentation
//     checkSolution() {
//         const droppedItems = Array.from(this.dropArea.children).filter(item => !item.classList.contains('placeholder'));
//         const droppedOrder = droppedItems.map(item => ({
//             order: parseInt(item.dataset.order),
//             indentation: parseInt(item.dataset.currentIndentation)
//         }));

//         // Get the expected order and indentation
//         const correctOrder = this.codeBlocks.filter(obj => !obj.isEmpty).map(obj => ({
//             order: obj.order,
//             indentation: obj.expectedIndentation
//         }));

//         // Compare the student's solution with the correct one
//         const isCorrect = this.compareSolutions(droppedOrder, correctOrder);

//         // Prepare the full code with student's indentation for display
//         const fullCode = droppedItems.map(item => {
//             const numSpaces = parseInt(item.dataset.currentIndentation) * 4; // Assuming 4 spaces per indent level
//             const indentation = ' '.repeat(numSpaces);
//             const codeLine = this.codeBlocks.find(obj => obj.order === parseInt(item.dataset.order)).block;
//             return indentation + codeLine;
//         }).join('\n');

//         this.fullCodeElement.textContent = fullCode;
//         hljs.highlightElement(this.fullCodeElement);

//         if (isCorrect) {
//             this.showToast('success');
//             if (this.onSolvedCallback) {
//                 setTimeout(() => {
//                     this.onSolvedCallback(fullCode);
//                 }, 1500);
//             } else {
//                 this.solutionModal.style.display = 'block';
//             }
//             return true;
//         } else {
//             this.showToast('error');
//             return false;
//         }
//     }

//     // Helper method to compare solutions
//     compareSolutions(droppedOrder, correctOrder) {
//         if (droppedOrder.length !== correctOrder.length) {
//             return false;
//         }
//         for (let i = 0; i < droppedOrder.length; i++) {
//             if (droppedOrder[i].order !== correctOrder[i].order ||
//                 droppedOrder[i].indentation !== correctOrder[i].indentation) {
//                 return false;
//             }
//         }
//         return true;
//     }
// }
