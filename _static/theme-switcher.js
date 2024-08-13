document.addEventListener('DOMContentLoaded', function() {
    function applyTheme() {
        const mode = document.documentElement.getAttribute('data-mode') || 'light'; // Default to 'light' if not set
        const lightTheme = document.getElementById('highlight-theme-light');
        const darkTheme = document.getElementById('highlight-theme-dark');
        
        const puzzleContainers = document.querySelectorAll('.puzzle-container'); // Select puzzle containers
        
        if (mode === 'dark') {
            lightTheme.disabled = true;
            darkTheme.disabled = false;
            puzzleContainers.forEach(container => {
                container.classList.remove('puzzle-container-light');
                container.classList.add('puzzle-container-dark');
            });
        } else if (mode === 'light') {
            lightTheme.disabled = false;
            darkTheme.disabled = true;
            puzzleContainers.forEach(container => {
                container.classList.remove('puzzle-container-dark');
                container.classList.add('puzzle-container-light');
            });
        } else if (mode === 'auto') {
            // Auto-detect based on system preferences
            const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
            lightTheme.disabled = prefersDarkScheme;
            darkTheme.disabled = !prefersDarkScheme;
            puzzleContainers.forEach(container => {
                container.classList.remove('puzzle-container-light', 'puzzle-container-dark');
                if (prefersDarkScheme) {
                    container.classList.add('puzzle-container-dark');
                } else {
                    container.classList.add('puzzle-container-light');
                }
            });
        }
    }

    // Apply the correct theme initially
    applyTheme();

    // If the mode can change dynamically, observe and reapply the theme
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
});
