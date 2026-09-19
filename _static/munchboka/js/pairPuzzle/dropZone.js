class DropZone {
  constructor(id, uniqueId, gameInstance) {
    this.id = id;
    this.uniqueId = uniqueId;
    this.items = [];
    this.element = null;
    this.placeholder = null;
    this.game = gameInstance;
  }

  createElement() {
    const div = document.createElement('div');
    div.classList.add('drop-zone');
    div.dataset.id = this.id;
    this.element = div;

    // Create and add the placeholder element
    this.placeholder = this.createPlaceholder();
    div.appendChild(this.placeholder);

    this.addDropEvents();
    return div;
  }

  createPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.textContent = 'Dra og dropp her'; // Customize your placeholder text here
    return placeholder;
  }

  addDropEvents() {
    this.element.addEventListener('dragover', (e) => {
      e.preventDefault(); // Necessary to allow dropping
      this.element.classList.add('dropped');
    });

    this.element.addEventListener('dragleave', () => {
      this.element.classList.remove('dropped');
    });

    this.element.addEventListener('drop', (e) => {
      e.preventDefault();
      const itemId = e.dataTransfer.getData('text/plain');
      const droppedItem = this.game.getItemById(itemId);
      if (droppedItem) {
        // If the item was previously in another drop zone or draggable container, remove it from there
        const previousZone = this.game.getDropZoneContainingItem(droppedItem);
        if (previousZone) {
          previousZone.removeItem(droppedItem);
        } else {
          const draggableContainer = this.game.getDraggableContainer();
          draggableContainer.removeChild(droppedItem.element);
        }

        this.items.push(droppedItem);
        droppedItem.element.style.opacity = '1'; // Ensure the item becomes visible after being dropped
        this.element.insertBefore(droppedItem.element, this.placeholder); // Always append the item before the placeholder

        // Re-render LaTeX in the drop zone
        renderMathInElement(droppedItem.element, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false }
          ]
        });

        this.element.classList.remove('dropped');
      }

      // Update placeholder visibility
      this.updatePlaceholderVisibility();
    });
  }

  updatePlaceholderVisibility() {
    // Show the placeholder if there are less than two items
    if (this.items.length < 2) {
      this.placeholder.style.display = 'block';
      this.element.appendChild(this.placeholder); // Ensure placeholder is always at the bottom
    } else {
      this.placeholder.style.display = 'none';
    }
  }

  removeItem(item) {
    // Remove the item from the items array
    this.items = this.items.filter(i => i.id !== item.id);
    this.updatePlaceholderVisibility();
  }

  clear() {
    this.items = [];
    this.element.innerHTML = ''; // Clear all children elements
    this.element.appendChild(this.placeholder); // Re-add the placeholder
    this.updatePlaceholderVisibility();
    this.resetColor();
  }

  isCorrect() {
    if (this.items.length !== 2) return false;
    return this.items[0].pairId === this.items[1].pairId;
  }

  // Add color feedback to the drop zone
  setCorrect() {
    this.element.style.backgroundColor = 'rgba(0, 128, 0, 0.5)';
  }

  setIncorrect() {
    this.element.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
  }

  resetColor() {
    this.element.style.backgroundColor = '';
  }
}
