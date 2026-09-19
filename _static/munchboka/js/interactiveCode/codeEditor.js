


class CodeEditor {
    constructor(editorId) {
        this.editorId = editorId;          // ID of the HTML textarea element to convert to a code editor
        this.loadAddons().then(() => {
            this.editor = this.initializeEditor(editorId); // Initialize the CodeMirror editor instance
            this.editor = this.addCommentOverlay(this.editor); // Add custom overlay for highlighting comments
            this.setupThemeListener();         // Set up a listener to detect and apply theme changes
            this.refreshOnVisibilityChange(); // Add this line
        });

        // this.editor = this.initializeEditor(editorId); // Initialize the CodeMirror editor instance
        // this.editor = this.addCommentOverlay(this.editor); // Add custom overlay for highlighting comments
        // this.setupThemeListener();         // Set up a listener to detect and apply theme changes
        // this.refreshOnVisibilityChange(); // Add this line
    }

    /**
     * Initializes the CodeMirror editor with custom settings.
     * @param {string} editorId - The ID of the textarea element to enhance with CodeMirror.
     * @returns {Object} - The initialized CodeMirror editor instance.
     */
    initializeEditor(editorId) {
        const self = this;
        const editor = CodeMirror.fromTextArea(document.getElementById(editorId), {
            mode: {
                name: "python",            // Language mode set to Python
                version: 3,                 // Python 3 syntax
            },
            lineNumbers: true,             // Enable line numbers
            theme: this.getCurrentTheme(), // Set the initial theme based on user preference
            tabSize: 4,                    // Set the tab size for indentation
            indentUnit: 4,                 // Number of spaces per indentation level
            matchBrackets: true,          // Highlight matching brackets
            autoCloseBrackets: true,      // Automatically close brackets
            extraKeys: {
                // Tab navigates placeholders if a snippet is active; otherwise inserts spaces
                Tab: (cm) => {
                    const st = cm.state && cm.state.snippetPH;
                    if (st && Array.isArray(st.markers) && st.markers.length) {
                        // Try to move to the next existing marker
                        let i = st.index + 1;
                        let moved = false;
                        while (i < st.markers.length) {
                            const pos = st.markers[i] && st.markers[i].find();
                            if (pos) {
                                st.index = i;
                                cm.setSelection(pos.from, pos.to);
                                moved = true;
                                break;
                            }
                            i++;
                        }
                        if (!moved) {
                            // No further placeholders: clear and fall back to normal Tab
                            this.clearSnippetPlaceholders(cm);
                            this.replaceTabWithSpaces(cm);
                        }
                        return; // handled
                    }
                    this.replaceTabWithSpaces(cm);
                },
                "Enter": function(cm) {
                    // If a completion popup is open, let it handle Enter
                    if (cm.state && cm.state.completionActive) {
                        return CodeMirror.Pass;
                    }
                    // Try snippet expansion first
                    if (self.tryExpandSnippet(cm)) return;

                    var cursor = cm.getCursor();
                    var line = cm.getLine(cursor.line);
                    var currentIndent = line.match(/^\s*/)[0];  // Get current indentation level


                    if (cursor.ch === 0) {
                        var currentLine = cm.getLine(cursor.line);
                        var currentIndent = currentLine.match(/^\s*/)[0];
                        cm.replaceSelection("\n" + currentIndent);
                        return;
                    }

                    // Rest of your existing logic
                    if (line.trim() === '') {
                        var nextLine = cursor.line < cm.lineCount() - 1 ? cm.getLine(cursor.line + 1) : "";
                        var nextIndent = nextLine ? nextLine.match(/^\s*/)[0] : "";
                        
                        if (nextLine === "" || nextIndent.length < currentIndent.length) {
                            let reducedIndent = currentIndent.slice(0, Math.max(0, currentIndent.length - cm.getOption("indentUnit")));
                            cm.replaceSelection("\n" + reducedIndent);
                        } else {
                            cm.replaceSelection("\n" + currentIndent);
                        }
                    } else if (/:\s*$/.test(line)) {
                        cm.replaceSelection("\n" + currentIndent + Array(cm.getOption("indentUnit") + 1).join(" "));
                    } else {
                        cm.replaceSelection("\n" + currentIndent);
                    }
                },
                "Shift-Enter": function(cm) {
                    // Always create a new line with the same indentation as the current line
                    var cursor = cm.getCursor();
                    var line = cm.getLine(cursor.line);
                    var currentIndent = line.match(/^\s*/)[0];
                    cm.replaceSelection("\n" + currentIndent);
                },
                "Ctrl-.": "toggleComment",     // For Windows/Linux
                "Cmd-.": "toggleComment",       // For Mac
                "Ctrl-Space": "autocomplete",
                // Shift-Tab navigates to previous placeholder when available
                "Shift-Tab": (cm) => {
                    const st = cm.state && cm.state.snippetPH;
                    if (st && Array.isArray(st.markers) && st.markers.length) {
                        let i = st.index - 1;
                        while (i >= 0) {
                            const pos = st.markers[i] && st.markers[i].find();
                            if (pos) {
                                st.index = i;
                                cm.setSelection(pos.from, pos.to);
                                return;
                            }
                            i--;
                        }
                        // No previous valid marker; keep current selection as-is
                    }
                },
                // Placeholder navigation for snippets
                "Ctrl-]": cm => this.selectNextPlaceholder(cm),
                "Cmd-]": cm => this.selectNextPlaceholder(cm),
                "Ctrl-[": cm => this.selectPrevPlaceholder(cm),
                "Cmd-[": cm => this.selectPrevPlaceholder(cm),

                "Backspace": function(cm) {
                    // Get cursor position
                    const cursor = cm.getCursor();
                    const line = cm.getLine(cursor.line);
                    
                    // Check if we're at an empty line with indentation
                    if (line.trim() === '' && cursor.ch > 0 && cursor.ch % 4 === 0) {
                        // Delete 4 spaces (one indentation level)
                        cm.replaceRange("", 
                            {line: cursor.line, ch: cursor.ch - 4}, 
                            {line: cursor.line, ch: cursor.ch});
                    } else {
                        // Normal backspace behavior
                        CodeMirror.commands.delCharBefore(cm);
                    }
                },
                    
            },

        });

        // Show snippet hint popup as user types letters/underscore
        editor.on('inputRead', function(cm, change) {
            try {
                if (!change || !change.text) return;
                // Trigger on single-character word-like input
                if (change.text.length === 1 && /^[A-Za-z_]$/.test(change.text[0])) {
                    self.triggerSnippetHint(cm);
                }
            } catch (e) {
                // fail-safe
                console.debug('snippet hint inputRead error', e);
            }
        });

        return editor;
    }


    async loadAddons() {
        // Only load addons if CodeMirror exists
        if (typeof CodeMirror === 'undefined') {
            console.error("CodeMirror not found! Addons will not be loaded.");
            return;
        }

        const addons = [
            // Core editing helpers
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/matchbrackets.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/closebrackets.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/comment/comment.min.js',
            // Show-hint for autocomplete popup
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/show-hint.min.js',
        ];

        const styles = [
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/show-hint.min.css',
        ];

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const loadStyle = (href) => {
            return new Promise((resolve, reject) => {
                // Avoid duplicate loads
                if ([...document.styleSheets].some(s => s.href === href)) return resolve();
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        };

        for (const href of styles) {
            try {
                await loadStyle(href);
                console.log(`Loaded CSS: ${href}`);
            } catch (error) {
                console.error(`Failed to load CSS: ${href}`, error);
            }
        }

        for (const addon of addons) {
            try {
                await loadScript(addon);
                console.log(`Loaded: ${addon}`);
            } catch (error) {
                console.error(`Failed to load: ${addon}`, error);
            }
        }
    }

    /**
     * Replaces the tab key press with spaces for consistent indentation.
     * @param {Object} cm - The CodeMirror instance.
     */
    replaceTabWithSpaces(cm) {
        let spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
    }

    // ---------- Snippets ----------
    // Simple snippet dictionary (keyword -> template and initial selection word)
    getSnippets() {
        return {
            // Norwegian-friendly placeholders
            "for": {
                template: "for n in range(start, stopp, avstand):\n    print(n)",
                caretWords: ["start", "stopp", "avstand"]
            },
            "if": {
                template: "if betingelse:\n    pass",
                caretWords: ["betingelse", "pass"]
            },
            "while": {
                template: "while betingelse:\n    pass",
                caretWords: ["betingelse", "pass"]
            },
            "if-else": {
                template: "if betingelse:\n    pass\nelse:\n    pass",
                caretWords: ["betingelse"]
            },
            "funksjon": {
                template: "def funksjonsnavn(variabel):\n    return funksjonsuttrykk",
                caretWords: ["funksjonsnavn", "variabel", "funksjonsuttrykk"]
            },
            "sum": {
                template: "s = 0\nfor n in range(start, stopp, avstand):\n    a = formel\n    s = s + a",
                caretWords: ["start", "stopp", "avstand", "formel"]
            },
            "print": {
                template: "print(verdi)",
                caretWords: ["verdi"]
            },
            "print-f": {
                template: "print(f\"{variabel = }\")",
                caretWords: ["variabel"]
            },
            "likning": {
                template: "for x in range(start, stopp, avstand):\n    if venstre_side == høyre_side:\n        print(x)",
                caretWords: ["start", "stopp", "avstand", "venstre_side", "høyre_side"]
            },
            "log": {
                template: "def log(x):\n    import math\n    return math.log(x)",
                caretWords: []
            },
            "exp": {
                template: "def exp(x):\n    import math\n    return math.exp(x)",
                caretWords: []
            },
            "log10": {
                template: "def log10(x):\n    import math\n    return math.log10(x)",
                caretWords: []
            },
            "log2": {
                template: "def log2(x):\n    import math\n    return math.log2(x)",
                caretWords: []
            },
        };
    }

    // Expand snippet if the current line is exactly a keyword (ignoring leading spaces)
    tryExpandSnippet(cm) {
        const cur = cm.getCursor();
        const lineText = cm.getLine(cur.line);
        const leadingWSMatch = lineText.match(/^\s*/);
        const leadingWS = leadingWSMatch ? leadingWSMatch[0] : "";
        const trimmed = lineText.slice(leadingWS.length);

        const snippets = this.getSnippets();
        const snip = snippets[trimmed];
        if (!snip) return false;

    const { template, caretWords } = snip;

        // Indent template according to current indentation and editor indent unit
        const indented = this.buildIndentedTemplate(cm, leadingWS, template);

        cm.operation(() => {
            // Replace entire current line with the snippet to avoid duplicate indentation
            cm.replaceRange(
                indented,
                { line: cur.line, ch: 0 },
                { line: cur.line, ch: lineText.length }
            );

            // Prepare placeholders and select the first, if any
            this.postInsertSnippet(cm, cur.line, indented, caretWords);
        });

        return true;
    }

    // Build an indented template that honors the editor's indentUnit.
    // For each template line, count its leading whitespace (spaces/tabs), convert to indent levels,
    // and prefix with the current line's indentation plus that many indent levels.
    buildIndentedTemplate(cm, leadingWS, template) {
        const unit = cm.getOption('indentUnit') || 4;
        const indentStr = ' '.repeat(unit);
        const toLevels = (ws) => {
            let count = 0;
            for (let i = 0; i < ws.length; i++) {
                count += (ws[i] === '\t') ? unit : 1;
            }
            return Math.floor(count / unit);
        };
        const lines = template.split('\n');
        return lines.map(line => {
            const m = line.match(/^[ \t]*/)[0];
            const level = toLevels(m);
            const content = line.slice(m.length);
            return leadingWS + indentStr.repeat(level) + content;
        }).join('\n');
    }

    // Trigger snippet hint popup as the user types
    triggerSnippetHint(cm) {
        if (!CodeMirror || !CodeMirror.showHint) return;
        CodeMirror.showHint(cm, (cm_) => this.snippetHint(cm_), { completeSingle: false });
    }

    // Custom hint provider that suggests snippet keywords and inserts templates
    snippetHint(cm) {
        const cur = cm.getCursor();
        const lineText = cm.getLine(cur.line);
        const leadingWSMatch = lineText.match(/^\s*/);
        const leadingWS = leadingWSMatch ? leadingWSMatch[0] : "";

        // Determine the current word before the cursor
        let startCh = cur.ch;
        while (startCh > 0 && /[A-Za-z_]/.test(lineText.charAt(startCh - 1))) startCh--;
        const prefix = lineText.slice(startCh, cur.ch);

        // Only offer snippet completions when typing at indentation start
        if (startCh !== leadingWS.length) {
            return { list: [], from: { line: cur.line, ch: cur.ch }, to: { line: cur.line, ch: cur.ch } };
        }

        const snippets = this.getSnippets();
        const keys = Object.keys(snippets).filter(k => k.indexOf(prefix) === 0);

        const list = keys.map(key => {
            const { template } = snippets[key];
            return {
                text: key,
                displayText: `${key} — ${template.split('\n')[0]}…`,
                hint: (cmPick) => {
                    // Replace the current word with the snippet template, with indentation
                    const { template: tpl, caretWords } = snippets[key];
                    const indented = this.buildIndentedTemplate(cmPick, leadingWS, tpl);
                    cmPick.operation(() => {
                        // Replace from start of line to cursor to include indentation
                        cmPick.replaceRange(
                            indented,
                            { line: cur.line, ch: 0 },
                            { line: cur.line, ch: cur.ch }
                        );
                        // Prepare placeholders and select the first
                        this.postInsertSnippet(cmPick, cur.line, indented, caretWords);
                    });
                }
            };
        });

        return {
            list,
            from: { line: cur.line, ch: startCh },
            to: { line: cur.line, ch: cur.ch }
        };
    }

    // After inserting a snippet, create live markers for placeholders and select the first
    postInsertSnippet(cm, baseLine, indented, caretWords) {
        const words = Array.isArray(caretWords) ? caretWords : (caretWords ? [caretWords] : []);
        const lines = indented.split('\n');
        const markers = [];

        if (words.length) {
            for (let i = 0; i < lines.length; i++) {
                for (const w of words) {
                    let idx = -1, fromCh = 0;
                    while ((idx = lines[i].indexOf(w, fromCh)) !== -1) {
                        const from = { line: baseLine + i, ch: idx };
                        const to = { line: baseLine + i, ch: idx + w.length };
                        const m = cm.getDoc().markText(from, to, { inclusiveLeft: true, inclusiveRight: true });
                        markers.push(m);
                        fromCh = idx + w.length;
                    }
                }
            }
        }

        cm.state.snippetPH = { markers, index: 0 };

        // Helper to select current marker if it still exists
        const selectIndex = (idx) => {
            if (!markers.length) return false;
            const mk = markers[idx];
            if (!mk) return false;
            const pos = mk.find();
            if (!pos) return false; // marker cleared by edit
            cm.setSelection(pos.from, pos.to);
            return true;
        };

        if (!selectIndex(0)) {
            // Fallback: put cursor at end of first inserted line
            cm.setCursor({ line: baseLine, ch: lines[0].length });
        }
    }

    // Move to the next existing placeholder marker
    selectNextPlaceholder(cm) {
        const st = cm.state && cm.state.snippetPH;
        if (!st || !st.markers || !st.markers.length) return;
        let i = st.index + 1;
        while (i < st.markers.length) {
            const pos = st.markers[i] && st.markers[i].find();
            if (pos) {
                st.index = i;
                cm.setSelection(pos.from, pos.to);
                return;
            }
            i++;
        }
        // No further placeholders: clear state
        this.clearSnippetPlaceholders(cm);
    }

    // Move to the previous existing placeholder marker
    selectPrevPlaceholder(cm) {
        const st = cm.state && cm.state.snippetPH;
        if (!st || !st.markers || !st.markers.length) return;
        let i = st.index - 1;
        while (i >= 0) {
            const pos = st.markers[i] && st.markers[i].find();
            if (pos) {
                st.index = i;
                cm.setSelection(pos.from, pos.to);
                return;
            }
            i--;
        }
        // No previous: keep current or clear if current is gone
        const cur = st.markers[st.index] && st.markers[st.index].find();
        if (!cur) this.clearSnippetPlaceholders(cm);
    }

    clearSnippetPlaceholders(cm) {
        const st = cm.state && cm.state.snippetPH;
        if (!st) return;
        if (st.markers) {
            st.markers.forEach(m => { try { m.clear(); } catch(_){} });
        }
        delete cm.state.snippetPH;
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
                    "????",
                ];

                for (const keyword of keywords) {
                    if (stream.match(keyword)) {
                        // Special-case: map "# <--" to the same class as TODO
                        if (keyword === "# <--") {
                            return "todo";
                        }
                        return keyword
                            .replace("# ", "")
                            .toLowerCase()
                            .replace(" ", "")
                            .replace(/\?+/g, "question");
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