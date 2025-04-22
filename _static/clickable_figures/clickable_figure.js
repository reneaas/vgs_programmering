document.addEventListener('DOMContentLoaded', function() {
    // Initialize lightbox for all clickable figures
    initClickableFigures();

    // Watch for theme changes
    watchThemeChanges();

    function initClickableFigures() {
        document.querySelectorAll('.clickable-figure').forEach(figure => {
            const img = figure.querySelector('img');
            if (!img) return;

            // Avoid adding multiple listeners
            if (img.dataset.zoomReady === 'true') return;
            img.dataset.zoomReady = 'true';

            // Get the alt text or figcaption as the caption
            let caption = '';
            const figcaption = figure.querySelector('figcaption');
            if (figcaption) {
                caption = figcaption.innerHTML;
            } else if (img.alt) {
                caption = img.alt;
            }

            // Make the cursor indicate it's clickable
            img.style.cursor = 'zoom-in';

            // Add zoom indicator if not already present
            if (!figure.querySelector('.zoom-indicator')) {
                const zoomIndicator = document.createElement('div');
                zoomIndicator.className = 'zoom-indicator';
                zoomIndicator.innerHTML = '🔍';
                figure.appendChild(zoomIndicator);
            }

            // Add click event listener to image
            img.addEventListener('click', function(e) {
                e.preventDefault();
                const figureClasses = Array.from(figure.classList);
                showLightbox(img.src, caption, figureClasses);
            });
        });
    }

    function watchThemeChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-mode') {
                    const currentTheme = document.body.getAttribute('data-mode');
                    const lightbox = document.querySelector('.clickable-figure-lightbox');
                    if (lightbox) {
                        lightbox.setAttribute('data-theme', currentTheme);
                    }
                }
            });
        });

        observer.observe(document.body, { attributes: true });
    }

    function ensureKaTeXLoaded() {
        return new Promise((resolve, reject) => {
            if (window.katex && window.renderMathInElement) {
                resolve();
                return;
            }

            Promise.all([
                loadCSS('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'),
                loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js')
                    .then(() => loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js'))
            ])
            .then(resolve)
            .catch(reject);
        });

        function loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        function loadCSS(url) {
            return new Promise((resolve) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.onload = resolve;
                document.head.appendChild(link);
            });
        }
    }

    function renderMathInLightbox(element) {
        if (window.renderMathInElement) {
            try {
                renderMathInElement(element, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ],
                    throwOnError: false
                });
            } catch (e) {
                console.error('Error rendering math:', e);
            }
        }
    }

    function showLightbox(src, caption, figureClasses) {
        // ✅ Prevent multiple lightboxes
        if (document.querySelector('.clickable-figure-lightbox')) return;

        const currentTheme = document.body.getAttribute('data-mode') || 'light';

        const lightbox = document.createElement('div');
        lightbox.className = 'clickable-figure-lightbox';
        lightbox.setAttribute('data-theme', currentTheme);

        const imgContainer = document.createElement('div');
        imgContainer.className = 'lightbox-image-container';

        const img = document.createElement('img');
        img.src = src;

        lightbox.classList.add('adaptive-figure');
        img.classList.add('adaptive-figure');

        if (figureClasses && figureClasses.length) {
            figureClasses.forEach(cls => img.classList.add(cls));
        }

        imgContainer.appendChild(img);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close lightbox');
        closeBtn.setAttribute('type', 'button');

        let captionEl = null;
        if (caption) {
            captionEl = document.createElement('div');
            captionEl.className = 'lightbox-caption';
            captionEl.innerHTML = caption;
        }

        lightbox.appendChild(closeBtn);
        lightbox.appendChild(imgContainer);
        if (captionEl) lightbox.appendChild(captionEl);

        document.body.appendChild(lightbox);
        void lightbox.offsetWidth;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (captionEl && (caption.includes('$') || caption.includes('\\(') || caption.includes('\\['))) {
            ensureKaTeXLoaded()
                .then(() => renderMathInLightbox(captionEl))
                .catch(err => console.error('Failed to load KaTeX:', err));
        }

        // --- Unified removal logic ---
        const removeLightbox = () => {
            if (!lightbox || !document.body.contains(lightbox)) return;
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escHandler);
        };

        const escHandler = (e) => {
            if (e.key === 'Escape') {
                removeLightbox();
            }
        };

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeLightbox();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                removeLightbox();
            }
        });

        document.addEventListener('keydown', escHandler);
    }
});
