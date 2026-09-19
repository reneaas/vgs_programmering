/**
 * Theme Manager for CAS Popup Dialogs
 * 
 * Ensures that jQuery UI dialogs respect the PyData Sphinx Theme's
 * light/dark mode by dynamically applying the data-mode attribute
 * to dialog elements.
 */

(function() {
    'use strict';
    
    /**
     * Gets the current theme mode from the html element
     * @returns {string} 'light', 'dark', or 'auto'
     */
    function getCurrentTheme() {
        const html = document.documentElement;
        return html.getAttribute('data-mode') || 'light';
    }
    
    /**
     * Applies the current theme to all ui-dialog elements
     */
    function applyThemeToDialogs() {
        const theme = getCurrentTheme();
        const dialogs = document.querySelectorAll('.ui-dialog');
        
        dialogs.forEach(dialog => {
            // Remove old theme attributes
            dialog.removeAttribute('data-mode');
            // Apply current theme
            dialog.setAttribute('data-mode', theme);
        });
    }
    
    /**
     * Observer to watch for theme changes on the html element
     */
    function setupThemeObserver() {
        const html = document.documentElement;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-mode') {
                    applyThemeToDialogs();
                }
            });
        });
        
        observer.observe(html, {
            attributes: true,
            attributeFilter: ['data-mode']
        });
    }
    
    /**
     * Observer to watch for new dialogs being added to the DOM
     */
    function setupDialogObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('ui-dialog')) {
                            const theme = getCurrentTheme();
                            node.setAttribute('data-mode', theme);
                        }
                        // Also check children
                        if (node.querySelectorAll) {
                            const dialogs = node.querySelectorAll('.ui-dialog');
                            dialogs.forEach(dialog => {
                                const theme = getCurrentTheme();
                                dialog.setAttribute('data-mode', theme);
                            });
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: false
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            applyThemeToDialogs();
            setupThemeObserver();
            setupDialogObserver();
        });
    } else {
        applyThemeToDialogs();
        setupThemeObserver();
        setupDialogObserver();
    }
})();
