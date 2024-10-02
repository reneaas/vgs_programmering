class CodeEditor {
    constructor(editorId) {
        this.editorId = editorId;          // ID of the HTML textarea element to convert to a code editor
        this.editor = this.initializeEditor(editorId); // Initialize the CodeMirror editor instance
        this.editor = this.addCommentOverlay(this.editor); // Add custom overlay for highlighting comments
        this.setupThemeListener();         // Set up a listener to detect and apply theme changes
        this.refreshOnVisibilityChange(); // Add this line
    }

    /**
     * Initializes the CodeMirror editor with custom settings.
     * @param {string} editorId - The ID of the textarea element to enhance with CodeMirror.
     * @returns {Object} - The initialized CodeMirror editor instance.
     */
    initializeEditor(editorId) {
        return CodeMirror.fromTextArea(document.getElementById(editorId), {
            mode: {
                name: "python",            // Language mode set to Python
                version: 3,                 // Python 3 syntax
            },
            lineNumbers: true,             // Enable line numbers
            theme: this.getCurrentTheme(), // Set the initial theme based on user preference
            tabSize: 4,                    // Set the tab size for indentation
            indentUnit: 4,                 // Number of spaces per indentation level
            extraKeys: {
                Tab: cm => this.replaceTabWithSpaces(cm), // Replace tab key press with spaces
                "Enter": function(cm) {
                    var cursor = cm.getCursor();
                    var line = cm.getLine(cursor.line);
                    var currentIndent = line.match(/^\s*/)[0];  // Get current indentation level

                    if (/:\s*$/.test(line)) {
                        // If line ends with a colon, add an extra indent
                        cm.replaceSelection("\n" + currentIndent + Array(cm.getOption("indentUnit") + 1).join(" "), "end");
                    } else {
                        // Otherwise, maintain the current indent level
                        cm.replaceSelection("\n" + currentIndent, "end");
                    }
                    }
            },
        });
    }

    /**
     * Replaces the tab key press with spaces for consistent indentation.
     * @param {Object} cm - The CodeMirror instance.
     */
    replaceTabWithSpaces(cm) {
        let spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
    }

    /**
     * Dynamically determines and applies the current theme based on user preference.
     * @returns {string} - The theme name to be applied.
     */
    getCurrentTheme() {
        const mode = document.documentElement.getAttribute('data-mode');
        const lightTheme = "github-light";
        const darkTheme = "github-dark-high-contrast";

        if (mode === 'dark') {
            return darkTheme;
        } else if (mode === 'light') {
            return lightTheme;
        } else if (mode === 'auto') {
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDarkScheme ? darkTheme : lightTheme;
        }
    }

    /**
     * Sets up a listener to dynamically update the theme when the user changes it.
     */
    setupThemeListener() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'data-mode') {
                    this.editor.setOption('theme', this.getCurrentTheme());
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-mode'],
        });

        // Set the initial theme when the editor is first initialized
        this.editor.setOption('theme', this.getCurrentTheme());
    }

    /**
     * Adds a custom overlay for highlighting specific comments for 
     * Supports # TODO, # FIKS MEG, # FYLL INN, # NOTE, # FIKSMEG, # IGNORER
     * @returns {Object} - The overlay mode configuration for CodeMirror.
     */
    addCommentOverlay(editor) {
        editor.addOverlay({
            token: function(stream) {
                const keywords = [
                    "# TODO", 
                    "# FIKSMEG", 
                    "# FIKS MEG", 
                    "# NOTE", 
                    "# FYLL INN", 
                    "# IGNORER", 
                    "# IKKE RØR",
                    "# FOKUS",
                    "# FORKLARING",
                    "# <--",
                    "# MERK",
                ];

                for (const keyword of keywords) {
                    if (stream.match(keyword) || (keyword === "# TODO" && stream.match("# <--"))) {
                        return keyword.replace("# ", "").toLowerCase().replace(" ", "");
                    }
                }
                
                while (stream.next() != null && !keywords.some(keyword => stream.match(keyword, false))) {}
                return null;
            }
        });
        return editor;
    }

    /**
     * Sets the code in the editor to a specified value.
     * @param {string} code - The code to set in the editor.
     */
    setValue(code) {
        this.editor.setValue(code);
    }

    /**
     * Gets the current value (code) from the editor.
     * @returns {string} - The code currently in the editor.
     */
    getValue() {
        return this.editor.getValue();
    }

    /**
     * Clears the editor content and optionally resets it to its initial value.
     * @param {string} [initialValue=""] - The initial code value to reset the editor to (optional).
     */
    resetEditor(initialValue = "") {
        this.editor.setValue(initialValue);
    }

    /**
     * Highlights a specific line in the editor (useful for debugging or showing errors).
     * @param {number} line - The line number to highlight (0-indexed).
     */
    highlightLine(line) {
        console.log("Highlighting line", line);
        this.editor.addLineClass(line, "background", "cm-highlight");
    }

    removehighlightLine(line) {
        this.editor.removeLineClass(line, "background", "line-highlight-red");
    }

    clearLineHighlights() {
        for (let i = 0; i < this.editor.lineCount(); i++) {
            this.editor.removeLineClass(i, "background", "cm-highlight");
        }
    }

    /**
     * Scrolls the editor to a specified line, useful for showing errors or results.
     * @param {number} line - The line number to scroll to (0-indexed).
     */
    scrollToLine(line) {
        this.editor.scrollIntoView({ line: line, ch: 0 }, 200);
    }

    refreshOnVisibilityChange() {
        const editorElement = this.editor.getWrapperElement();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.editor.refresh();
                }
            });
        }, { threshold: 0.1 });
    
        observer.observe(editorElement);
    }
}