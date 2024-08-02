

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}



// Setter opp pyodide og cacher den for gjentatt bruk.
let packages = ["numpy"]
let cachedPyodide = null;
async function initializePyodide() {
    if (!cachedPyodide) {
        console.log('Initializing Pyodide...');
        cachedPyodide = await loadPyodide();
        await cachedPyodide.loadPackage(packages);
        console.log('Pyodide initialized.');
    }
    return cachedPyodide;
}

// Setter opp code editor med code mirror
async function setupEditor(pyodide, editorId, buttonId, outputId) {
    const lightTheme = "github-light";
    const darkTheme = "github-dark";


    function getCurrentTheme() {
        const mode = document.documentElement.getAttribute('data-mode');
        // console.log("Mode: " + mode); // Debugging line for check `mode` value
    
        if (mode === 'dark') {
            return darkTheme;
        } else if (mode === 'light') {
            return lightTheme;
        } else if (mode === 'auto') {
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDarkScheme ? darkTheme : lightTheme;
        }
    }

    console.log("Current theme: " + getCurrentTheme()); // Debugging line to check current theme
    
    let editor = CodeMirror.fromTextArea(document.getElementById(editorId), {
        mode: "python",
        lineNumbers: true,
        theme: getCurrentTheme(), // Other themes at https://codemirror.net/5/demo/theme.html#default
        tabSize: 4,
        indentUnit: 4,
    });

    // Apply the overlay mode
    editor.addOverlay({
        token: function(stream, state) {
            if (stream.match("# TODO")) {
                return "todo";
            } else if (stream.match("# FIKSMEG")) {
                return "fiksmeg";
            } else if (stream.match("# FIKS MEG")) {
                return "fiksmeg";
            } else if (stream.match("# NOTE")) {
                return "note";
            }
            while (stream.next() != null && 
                !stream.match("# TODO", false) && 
                !stream.match("# FIKSMEG", false) && 
                !stream.match("# FIKS MEG", false) && 
                !stream.match("# NOTE", false)) {}
            return null;
        }
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'data-mode') {
                // console.log('data-mode attribute changed'); // Debugging line to check attribute change
                editor.setOption('theme', getCurrentTheme());
            }
        });
    });


    // Start observing the document's data-mode attribute for changes
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-mode']
    });

    // Initial theme setup
    editor.setOption('theme', getCurrentTheme());
    
    let runButton = document.getElementById(buttonId);
    let output = document.getElementById(outputId);

    runButton.addEventListener("click", async () => {
        let code = editor.getValue();

        try {
            pyodide.runPythonAsync(`
                import sys
                from js import console
                class PyConsole:
                    def __init__(self):
                        self.buffer = ""
                    def write(self, msg):
                        self.buffer += msg
                    def flush(self):
                        console.log(self.buffer)
                        self.buffer = ""

                sys.stdout = PyConsole()
                sys.stderr = PyConsole()
            `);


            if (code.includes('input(')) {
                await pyodide.runPythonAsync(`
                    import builtins
                    from js import document, window

                    def input(prompt=""):
                        try:
                            output = document.getElementById("${outputId}")
                            output.textContent += prompt  # Display the prompt text in the output element
                            user_input = window.prompt(prompt)
                            if user_input is None:
                                user_input = ""
                            output.textContent += user_input + "\\n"  # Append the user input to the output element
                            return user_input
                        except Exception as e:
                            output.textContent += "Error: " + str(e) + "\\n"
                            raise e

                    builtins.input = input
                `);
            }

            
            
            // await pyodide.runPythonAsync(code);
            await pyodide.runPythonAsync(code);
            let result = pyodide.globals.get("sys").stdout.buffer;
            output.textContent = result;
        } catch (err) {
            // pyodide.runPython("import traceback; traceback.print_exception(sys.last_value)");
            let errorMsg = pyodide.globals.get("sys").stderr.buffer;
            output.textContent = `Error: ${errorMsg}`;
            console.log("Error caught in JavaScript:", err);
        }
    });
}

// Lazy load the editor and Pyodide when the editor comes into view
function lazyLoadEditor(editorId, buttonId, outputId) {
    const editorElement = document.getElementById(editorId);
    const observer = new IntersectionObserver(debounce(async (entries, observer) => {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
                if (!cachedPyodide) {
                    cachedPyodide = await initializePyodide();
                }
                await setupEditor(cachedPyodide, editorId, buttonId, outputId);
            }
        });
    }, 10), { threshold: 0.1 }); // 200ms debounce delay

    observer.observe(editorElement);
}