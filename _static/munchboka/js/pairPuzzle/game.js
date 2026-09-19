function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
  
  
class Game {
  constructor(containerId, pairs) {
    this.containerId = containerId;
    this.uniqueId = generateUUID();
    this.container = document.getElementById(containerId);
    this.pairs = pairs;
    this.items = [];
    this.dropZones = [];
    this.init();
  }

  init() {
      this.generateHTML();
      this.createItems();
      this.createDropZones();
      this.toast = this.createToast();

      document.getElementById(`check-answer-${this.uniqueId}`).addEventListener('click', () => this.checkAnswer());
      document.getElementById(`reset-puzzle-${this.uniqueId}`).addEventListener('click', () => this.resetPuzzle());

      document.addEventListener('mousemove', (event) => {
          this.cursorX = event.clientX;
          this.cursorY = event.clientY;

      });
  }

  generateHTML() {
    if (!this.container) {
      throw new Error('Container not found');
    }

    const uniqueId = this.uniqueId;

    this.container.innerHTML = `
    <div id="draggable-container-${uniqueId}" class="draggable-container"></div>
    <div id="dropzone-container-${uniqueId}" class="drop-zone-container"></div>
    <div class="button-container">
        <button id="check-answer-${uniqueId}" class="button button-run">Sjekk svaret!</button>
        <button id="reset-puzzle-${uniqueId}" class="button button-reset">Reset puslespill</button>
    </div>
      <!-- Toast Notification -->
    <div id="toast-${uniqueId}" class="toast" style="display: none;">
        <p>Riktig! Bra jobba 🔥</p>
    </div>
    `;
  }


  createItems() {
    const itemsContainer = document.getElementById(`draggable-container-${this.uniqueId}`);
    this.pairs.forEach((group, groupIndex) => {
      group.forEach((item, itemIndex) => {
        const draggableItem = new DraggableItem(`item-${groupIndex}-${itemIndex}`, item, groupIndex);
        this.items.push(draggableItem);
      });
    });
  
    // Shuffle items before adding them to the container
    this.items.sort(() => 0.5 - Math.random());
    this.items.forEach((item) => itemsContainer.appendChild(item.createElement()));
  }

  createDropZones() {
    const dropzonesContainer = document.getElementById(`dropzone-container-${this.uniqueId}`);
    this.pairs.forEach((_, index) => {
      const dropZone = new DropZone(index, this.uniqueId, this);
      this.dropZones.push(dropZone);
      dropzonesContainer.appendChild(dropZone.createElement());
    });
  }

  getItemById(id) {
    return this.items.find((item) => item.id === id);
  }

  getDropZoneContainingItem(item) {
    return this.dropZones.find(zone => zone.items.includes(item));
  }

  getDraggableContainer() {
    return document.getElementById(`draggable-container-${this.uniqueId}`);
  }


  async checkAnswer() {
    const results = await Promise.all(this.dropZones.map((zone) => zone.isCorrect()));
    results.forEach((isCorrect, index) => {
        const dropZone = this.dropZones[index];
        if (isCorrect) {
            dropZone.setCorrect(); // Set drop zone to green
        } else {
            dropZone.setIncorrect(); // Set drop zone to red
        }
    });

    const allCorrect = results.every(result => result);
    if (allCorrect) {
        this.showToast();
    }
}

  resetPuzzle() {
    // Reset puzzle by returning all items back to the draggable container
    const draggableContainer = this.getDraggableContainer();
    this.items.forEach(item => {
      draggableContainer.appendChild(item.element);
      item.element.style.opacity = '1';
    });

    // Clear the drop zones
    this.dropZones.forEach(zone => zone.clear());
  }

  createToast() {
      const toast = document.createElement('div');
      toast.id = `toast-${this.uniqueId}`;
      toast.className = 'toast';
      toast.style.display = 'none';
      toast.innerHTML = `
          <p>Riktig! 🔥</p>
      `;

      document.body.appendChild(toast);
      return toast;
  }

  showToast() {
      console.log("toast: ", this.toast);

      console.log("X = ", this.cursorX);
      console.log("Y = ", this.cursorY);

      this.toast.style.top = `${this.cursorY - 150}px`;
      this.toast.style.left = `${this.cursorX}px`;

      this.toast.style.display = 'block';

      

      setTimeout(() => {
          this.toast.style.display = 'none';
      }, 2500); // Display for 2.5 seconds (2000 ms)

  }
}


function initGame(containerId, pairs) {
  return new Game(containerId, pairs);
}