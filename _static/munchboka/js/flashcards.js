(function () {
  function renderMathIn(element) {
    if (typeof window !== 'undefined' && typeof window.renderMathInElement === 'function') {
      window.renderMathInElement(element, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
        ],
      });
    }
  }

  function highlightCode(element) {
    if (typeof window !== 'undefined' && window.hljs && typeof window.hljs.highlightElement === 'function') {
      const blocks = element.querySelectorAll('code');
      blocks.forEach((b) => window.hljs.highlightElement(b));
    }
  }

  function createFlashcards(root, cfg) {
    const cards = Array.isArray(cfg.cards) ? cfg.cards.slice() : [];
    const opts = cfg.options || {};
    const showProgress = !!opts.show_progress;
    let index = Number.isFinite(opts.start_index) ? Math.max(0, Math.min(cards.length - 1, opts.start_index)) : 0;
    let side = 'front';
    let renderedIndex = -1;

    if (opts.shuffle && cards.length > 1) {
      for (let i = cards.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    }

    root.innerHTML = '';
    root.classList.add('flashcards-root');

    const cardShell = document.createElement('div');
    cardShell.className = 'flashcards-card-shell';

    const card = document.createElement('div');
    card.className = 'flashcards-card';

    const header = document.createElement('div');
    header.className = 'flashcards-header';

    const sideLabel = document.createElement('div');
    sideLabel.className = 'flashcards-pill';

    const progress = document.createElement('div');
    progress.className = 'flashcards-progress';

    header.appendChild(sideLabel);
    header.appendChild(progress);

    const body = document.createElement('div');
    body.className = 'flashcards-body';

    const flipWrap = document.createElement('div');
    flipWrap.className = 'flashcards-flip';

    const flipInner = document.createElement('div');
    flipInner.className = 'flashcards-flip-inner';

    const frontDiv = document.createElement('div');
    frontDiv.className = 'flashcards-face front';

    const backDiv = document.createElement('div');
    backDiv.className = 'flashcards-face back';

    flipInner.appendChild(frontDiv);
    flipInner.appendChild(backDiv);
    flipWrap.appendChild(flipInner);
    body.appendChild(flipWrap);

    const footer = document.createElement('div');
    footer.className = 'flashcards-footer';

    const hint = document.createElement('div');
    hint.textContent = 'Tips: bruk Space for å snu kortet';

    const controls = document.createElement('div');
    controls.className = 'flashcards-controls';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'flashcards-btn';
    prevBtn.textContent = '← Forrige';

    const flipBtn = document.createElement('button');
    flipBtn.type = 'button';
    flipBtn.className = 'flashcards-btn flashcards-btn-primary';
    flipBtn.textContent = 'Snu kortet';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'flashcards-btn';
    nextBtn.textContent = 'Neste →';

    controls.appendChild(prevBtn);
    controls.appendChild(flipBtn);
    controls.appendChild(nextBtn);

    footer.appendChild(hint);
    footer.appendChild(controls);

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);
    cardShell.appendChild(card);
    root.appendChild(cardShell);

    function updateUI() {
      root.dataset.side = side;
      sideLabel.textContent = side === 'front' ? 'Forside' : 'Bakside';
      progress.textContent = showProgress ? `Kort ${index + 1} / ${cards.length}` : '';
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === cards.length - 1;
      flipBtn.disabled = false;
    }

    function renderCurrentCardIfNeeded() {
      if (!cards.length) return;
      if (renderedIndex === index) return;

      const current = cards[index] || { front: '', back: '' };
      frontDiv.innerHTML = current.front || '';
      backDiv.innerHTML = current.back || '';

      // Render both faces once per card so flipping is instant.
      [frontDiv, backDiv].forEach((el) => {
        renderMathIn(el);
        highlightCode(el);
      });

      renderedIndex = index;
    }

    function update() {
      if (!cards.length) {
        renderedIndex = -1;
        frontDiv.innerHTML = '<em>Ingen kort.</em>';
        backDiv.innerHTML = '';
        root.dataset.side = 'front';
        sideLabel.textContent = 'Kort';
        progress.textContent = '';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        flipBtn.disabled = true;
        return;
      }

      renderCurrentCardIfNeeded();
      updateUI();
    }

    function flip() {
      side = side === 'front' ? 'back' : 'front';
      // Flipping should be instant; do not rerender content here.
      updateUI();
    }

    function prev() {
      if (index > 0) {
        index -= 1;
        side = 'front';
        update();
      }
    }

    function next() {
      if (index < cards.length - 1) {
        index += 1;
        side = 'front';
        update();
      }
    }

    flipBtn.addEventListener('click', flip);
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    root.tabIndex = 0;
    root.addEventListener('keydown', (ev) => {
      if (ev.key === ' ' || ev.code === 'Space') {
        ev.preventDefault();
        flip();
      } else if (ev.key === 'ArrowLeft') {
        prev();
      } else if (ev.key === 'ArrowRight') {
        next();
      }
    });

    update();
  }

  function init() {
    const containers = document.querySelectorAll('.flashcards-container');
    containers.forEach((c) => {
      try {
        const script = c.querySelector('.flashcards-data');
        const raw = script && script.textContent ? script.textContent : c.getAttribute('data-config') || '{}';
        const cfg = JSON.parse(raw);
        createFlashcards(c, cfg);
      } catch (e) {
        console.error('flashcards: init failed', e);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
