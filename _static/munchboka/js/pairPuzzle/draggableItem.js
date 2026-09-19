class DraggableItem {
  constructor(id, content, pairId) {
    this.id = id;
    this.content = content;
    this.pairId = pairId;
    this.element = null;
  }

  createElement() {
    const div = document.createElement('div');
    div.classList.add('draggable-item');
    div.setAttribute('draggable', 'true');
    div.dataset.id = this.id;
    div.dataset.pairId = this.pairId;

    // Set the inner HTML content directly
    div.innerHTML = this.content;
    this.element = div;

    // Apply syntax highlighting if there is a <pre><code> block
    if (this.containsCodeBlock(this.content)) {
      // Only try to highlight if hljs (highlight.js) is available
      if (typeof hljs !== 'undefined') {
        hljs.highlightElement(div.querySelector('code'));
      }
    }

    // Render LaTeX math
    this.renderMath();

    this.addDragEvents();
    return div;
  }

  containsCodeBlock(content) {
    // Check if the content contains a <pre><code> block
    return /<pre><code[\s\S]*<\/code><\/pre>/.test(content);
  }

  renderMath() {
    // Ensure KaTeX renders LaTeX inside the item
    renderMathInElement(this.element, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ]
    });
  }

  addDragEvents() {
    this.element.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', this.id);
      setTimeout(() => {
        this.element.style.opacity = '0'; // Hide the item temporarily while dragging
      }, 0);
    });

    this.element.addEventListener('dragend', () => {
      this.element.style.opacity = '1'; // Show the item again when dragging ends
    });
  }
}
