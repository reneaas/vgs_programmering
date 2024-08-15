


let worker = null;

const pyConsoleScript = `
import sys
from js import postMessage
import json

class PyConsole:
    def __init__(self):
        self.buffer = ""

    def write(self, msg):
        self.buffer += msg
        if "\\n" in msg:
            self.flush()

    def flush(self):
        if self.buffer:
            try:
                postMessage(json.dumps({'type': 'stdout', 'msg': self.buffer}))
            except Exception as e:
                self.handle_error(e)

        self.buffer = ""

    def handle_error(self, e):
        error_message = str(e)
        postMessage(json.dumps({'type': 'stderr', 'msg': error_message}))

sys.stdout = PyConsole()
sys.stderr = PyConsole()
`;


const customInputScript = (outputId) => `
    import builtins
    from js import document, window

    def input(prompt=""):
        try:
            output = document.getElementById("${outputId}")
            output.textContent += prompt
            user_input = window.prompt(prompt)
            if user_input is None:
                user_input = ""
            output.textContent += user_input + "\\n"
            return user_input
        except Exception as e:
            output.textContent += "Error: " + str(e) + "\\n"
            raise e

    builtins.input = input
`;


function initializeWorker(outputId) {
    const workerScript = `
        importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js');

        let pyodideReadyPromise = loadPyodide();
        let pyodide;
        let firstrun = true;
        let initialGlobals = new Set();

        async function resetPyodide() {
            const currentGlobals = new Set(pyodide.globals.keys());
            const globalsToClear = Array.from(currentGlobals).filter(x => !initialGlobals.has(x));
            for (const key of globalsToClear) {
                pyodide.globals.delete(key);
            }
            console.log("Globals cleared:", globalsToClear);
        }


        onmessage = async (event) => {
            await pyodideReadyPromise;
            if (event.data.type === 'init') {
                pyodide = await pyodideReadyPromise;
            }
            if (event.data.type === 'runCode') {
                const { code } = event.data;
                try {
                    await resetPyodide();
                    await pyodide.runPythonAsync(code);
                } catch (err) {
                    postMessage({ type: 'stderr', 'msg': String(err) });
                }
            }

            if (event.data.type === 'loadPackage') {
                const { packages } = event.data;
                try {
                    await pyodide.loadPackage(packages);
                    postMessage(JSON.stringify({ type: 'packagesLoaded' }));
                } catch (err) {
                    postMessage(JSON.stringify({ type: 'stderr', msg: String(err)}));
                }
            }
        };
    `;






    if (!worker) {
        const workerBlob = new Blob([workerScript], { type: 'application/javascript' });
        worker = new Worker(URL.createObjectURL(workerBlob));
    }

    worker.onmessage = async function(event) {
        console.log("Received message:", event.data);  // Helpful for debugging
        let data;
        try {
            data = JSON.parse(event.data);
        } catch (e) {
            console.error("Failed to parse message data:", event.data);
            return;
        }
        const { type, msg } = data;
        const outputElement = document.getElementById(outputId);
        if (!outputElement) {
            console.error("Output element not found:", outputId);
            return;
        }
    
        if (type === 'stdout') {
            // Check if stdout contains error messages like SyntaxError
            if (/Error/.test(msg)) {
                outputElement.innerHTML += formatErrorMessage(msg); // Treat as error message
            } else {
                outputElement.innerHTML += msg;  // Append regular output
            }
        } else if (type === 'stderr') {
            outputElement.innerHTML += formatErrorMessage(msg); // Always format stderr messages
        }
    };

    worker.onerror = function(error) {
        console.log('Error from worker:', error);
        const outputElement = document.getElementById(outputId);
        if (outputElement) {
            outputElement.textContent += `Error: ${error.message}`;
        }
    };

    worker.postMessage({ type: 'init' });
}

async function runCode(editor, outputId, errorBoxId) {
    let code = editor.getValue();
    console.log("Initial code: ", code);
    // Search code for input statements
    const inputStatements = findInputStatements(code);
    if (inputStatements.length > 0) {
        // If input statements are found, prompt the user for input
        let userValues = await getUserInputs(inputStatements);

        save_eval_code = `
def safe_eval(user_input):
    try:
        return float(user_input) if '.' in user_input else int(user_input)
    except ValueError:
        return user_input
\n
`;

        code = replaceInputStatements(code, userValues);
        code = save_eval_code + code;
        console.log("Modified code: ", code);
    }

    worker.onmessage = function(event) {
        console.log("Received message:", event.data);  // Helpful for debugging
        let data;
        try {
            data = JSON.parse(event.data);
        } catch (e) {
            console.error("Failed to parse message data:", event.data);
            return;
        }
        const { type, msg } = data;
        const outputElement = document.getElementById(outputId);
        if (!outputElement) {
            console.error("Output element not found:", outputId);
            return;
        }
    
        if (type === 'stdout') {
            // Check if stdout contains error messages like SyntaxError
            if (/Error/.test(msg)) {
                outputElement.innerHTML += formatErrorMessage(msg, errorBoxId); // Treat as error message
                scrollToBottom(outputElement);
            } else {
                outputElement.innerHTML += formatErrorMessage(msg, errorBoxId);  // Append regular output
                scrollToBottom(outputElement);
            }
        } else if (type === 'stderr') {
            outputElement.innerHTML += formatErrorMessage(msg, errorBoxId); // Always format stderr messages
            scrollToBottom(outputElement);
        }

        if (type === 'packagesLoaded') {
            worker.postMessage({ type: 'runCode', code: pyConsoleScript });
            // Finally, run the user's code
            worker.postMessage({ type: 'runCode', code: code });
        }

    };

    // Ensure the worker is initialized before posting messages
    if (!worker) {
        initializeWorker(outputId);
    }

    // Request web worker to load missing packages
    const packages = extractPackageNames(code); // Search for import statements in the code
    if (packages.length > 0) {
        worker.postMessage({ type: 'loadPackage', packages });
    }
    else {
        worker.postMessage({ type: 'runCode', code: pyConsoleScript });
        // Finally, run the user's code
        worker.postMessage({ type: 'runCode', code: code });
    }
    
}

function getCurrentTheme() {
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

function addcommentOverlayMode(editor) {
    editor.addOverlay({
        token: function(stream) {
            const keywords = ["# TODO", "# FIKSMEG", "# FIKS MEG", "# NOTE", "# FYLL INN"];
            for (const keyword of keywords) {
                if (stream.match(keyword)) {
                    return keyword.replace("# ", "").toLowerCase().replace(" ", "");
                }
            }
            while (stream.next() != null && !keywords.some(keyword => stream.match(keyword, false))) {}
            return null;
        }
    });
    return editor;
}

function getEditor(editorId) {
    let editor = CodeMirror.fromTextArea(document.getElementById(editorId), {
        mode: {
            name: "python",
            overlay: "commentOverlay",
        },
        lineNumbers: true,
        theme: getCurrentTheme(),
        tabSize: 4,
        indentUnit: 4,
        extraKeys: {
            Tab: function(cm) {
                let spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                cm.replaceSelection(spaces);
            }
        }
    });
    editor = addcommentOverlayMode(editor);
    return editor;
}

function setupEditor(editorId, runButtonId, cancelButtonId, resetButtonId, outputId, errorBoxId) {
    let editor = getEditor(editorId);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'data-mode') {
                editor.setOption('theme', getCurrentTheme());
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-mode']
    });

    editor.setOption('theme', getCurrentTheme());

    let runButton = document.getElementById(runButtonId);
    if (runButton) {
        runButton.addEventListener("click", async () => {
            clearAdmonitionContainer(errorBoxId);
            const outputElement = document.getElementById(outputId);
            if (outputElement) {
                outputElement.textContent = "";
            }
            await runCode(editor, outputId, errorBoxId);
        });
    }

    let cancelButton = document.getElementById(cancelButtonId);
    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            if (worker) {
                worker.terminate();
                worker = null;
                initializeWorker(outputId);
            }
        });
    }

    let resetButton = document.getElementById(resetButtonId);
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            clearAdmonitionContainer(errorBoxId);
            editor.setValue(document.getElementById(editorId).value);
            const outputElement = document.getElementById(outputId);
            if (outputElement) {
                outputElement.textContent = "";
            }
        });
    }

    initializeWorker(outputId);
}



function createAdmonition(title, content) {
    return `
        <div class="admonition pythonerror margin">
            <p class="admonition-title">${title}</p>
            <p>${content}</p>
        </div>
    `;
}

function extractPackageNames(code) {
    // Matches "import <package> as <alias>" and "import <package>"
    const importRegex = /^\s*import\s+([^;\s]+)\s*/g;

    // Matches "from <package> import <something>"
    const fromImportRegex = /^\s*from\s+([^;\s]+)\s+import/g;

    const packages = new Set();
    let match;

    // Process "import" statements
    while ((match = importRegex.exec(code)) !== null) {
        // If the package includes a dot (like "matplotlib.pyplot"), take only the first part
        packages.add(match[1].split('.')[0]);
    }

    // Process "from ... import" statements
    while ((match = fromImportRegex.exec(code)) !== null) {
        // Capture the complete module/package path before the import
        packages.add(match[1].split('.')[0]);
    }

    return Array.from(packages);
}


function formatErrorMessage(errorMsg, errorBoxId) {
    let formattedMessage = errorMsg;
    let content = '';
    let title = '';
    let knownError = false;
    // Highlight the error type
    const errorTypeMatch = errorMsg.match(/(\w+Error):/);
    if (errorTypeMatch) {

        formattedMessage = formattedMessage.replace(errorTypeMatch[1], `<span class="error-type">${errorTypeMatch[1]}</span>`);
        
        if (errorTypeMatch[1] === 'SyntaxError') {
            console.log("Adding admonition for SyntaxError");
            title = 'SyntaxError';
            content = `
                SyntaxError er en feil som oppstår når du skriver kode som ikke følger reglene for Python kode. 
                I meldingen står det typisk hvor i koden feilen oppstod og hva som er feil. 
                Typiske tilfeller:
                <li> Du har glemt kolon (:) etter en for- eller while-setning. </li>
                <li> Du har glemt å lukke en parentes, klammeparentes eller tekststreng. </li>
                <li> Du har glemt gangetegn. Da står det "invalid decimal literal". </li>
            `;
            knownError = true;
        }

        else if (errorTypeMatch[1] === 'NameError') {
            title = 'NameError';
            content = `
                NameError er en feil som oppstår når du prøver å bruke en variabel som ikke er definert.
                Typiske tilfeller: 
                <li> Du har glemt å definere variabelen </li>
                <li> Du har brukt stor bokstav når det skulle vært liten. </li>
                <li> Du har en skrivefeil i variabelnavnet. </li>
            `;
            knownError = true;
        }

        else if (errorTypeMatch[1] === 'TypeError') {
            title = 'TypeError';
            content = `
                TypeError er en feil som oppstår når du prøver å bruke en variabel på en måte som ikke er lov.
                Typiske tilfeller:
                <li> Du har prøvd en parentes inntil en variabel. Da står det at variabelen ikke er "callable". </li>
                <li> Du har prøvd å gjøre regneoperasjon med noe som ikke er et tall. </li>
                <li> Du har glemt å returnere verdien i en funksjon. </li>
                <li> Du prøver å bruke desimaltall med range-funksjonen. </li>
            `;
            knownError = true;
        }

        else if (errorTypeMatch[1] === 'IndentationError') {
            title = 'IndentationError';
            content = `
                IndentationError er en feil som oppstår når du har feil innrykk i koden din.
                Typiske tilfeller:
                <li> Du har glemt innrykk rett etter en for- eller while-setning. </li>
                <li> Du har forskjellig innrykk i samme for- eller while-løkke. </li>
                <li> Du har glemt innrykk i en Pythonfunksjon. </li>
            `;
            knownError = true;
        }

        else if (errorTypeMatch[1] === 'IndexError') {
            title = 'IndexError';
            content = `
                IndexError er en feil som oppstår når du prøver å hente ut et element fra en liste som ikke finnes.
                Typiske tilfeller:
                <li> Du har prøvd å hente ut et element fra en tom liste. </li>
                <li> Du har prøvd å hente ut et element fra en liste på en indeks som ikke finnes. </li>
                <li> Du har brukt en indeks som er for stor for listen. Da står det "list index out of range". </li>
            `;
            knownError = true;
        }

        else if (errorTypeMatch[1] === 'KeyError') {
            title = 'KeyError';
            content = `
                KeyError er en feil som oppstår når du prøver å hente ut en nøkkel fra et dictionary som ikke finnes.
            `;
            knownError = true;
        }

        else if (errorTypeMatch[1] === 'ValueError') {
            title = 'ValueError';
            content = `
                ValueError er en feil som oppstår når du prøver å bruke en verdi på en måte som ikke er lov.
                Typiske tilfeller:
                <li> Du har brukt en verdi utenfor definisjonsmengden til en matematisk funksjon. For eksempel negative tall i kvadratrot eller logaritmer. </li>
                <li> Du har prøvd å konvertere en streng til et tall, men strengen inneholder ikke et tall. </li>
                <li> Du har prøvd å konvertere en streng til et tall med feil format. </li>
            `;
            knownError = true;
        }

        else if (errorTypeMatch[1] === 'ZeroDivisionError') {
            title = 'ZeroDivisionError';
            content = `Feilen oppstår når du deler med null.`
            knownError = true;
        }

        else if (errorTypeMatch[1] === 'OverflowError') {
            title = 'OverflowError';
            content = `
                Feilen oppstår når et tall blir for stort til å bli representert på datamaskin. Du har i praksis regnet ut uendelig.
            `;
            knownError = true;
        }

        else if (errorTypeMatch[1] === 'ModuleNotFoundError') {
            title = 'ModuleNotFoundError';
            content = `
                ModuleNotFoundError er en feil som oppstår når du prøver å importere et Python-bibliotek som ikke er installert.
                En av pakkene du har prøvd i å installere er dessverre ikke tilgjengelig.
            `;
            knownError = true;
        }

        if (knownError) {
            addAdmonitionToContainer(title, content, errorBoxId); 
        }
    }

    

    // Highlight the line number in the pattern 'File "<exec>", line <number>'
    const fileLinePattern = /File "<exec>", line (\d+)/g;
    formattedMessage = formattedMessage.replace(fileLinePattern, (match, p1) => {
        return match.replace(`line ${p1}`, `<span class="error-line">line ${p1}</span>`);
    });

    return formattedMessage;
}

function addAdmonitionToContainer(title, content, errorBoxId) {
    const container = document.getElementById(errorBoxId);
    if (container) {
        container.innerHTML = createAdmonition(title, content);
    }
}

function clearAdmonitionContainer(errorBoxId) {
    const container = document.getElementById(errorBoxId);
    if (container) {
        container.innerHTML = '';
    }
}


function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}



// Helper functions for simulating the input function

function findInputStatements(code) {
    // Regular expression to find input statements within `float(input(...))`, `eval(input(...))`, and `input(...)`
    const inputRegex = /(\w+)\s*=\s*(float|eval)?\(?input\(["'](.*?)["']\)\)?/g;
    let match;
    let inputs = [];

    while ((match = inputRegex.exec(code)) !== null) {
        inputs.push({
            variable: match[1],      // The variable that stores the input value
            promptText: match[3]      // The prompt text within input()
        });
    }

    return inputs;
}




async function getUserInputs(inputs) {
    let userValues = {};

    for (let input of inputs) {
        // Remove quotes around the prompt text if present
        let promptText = input.promptText.replace(/['"]+/g, '');

        // Prompt the user for input
        let userValue = await promptUser(promptText);

        // Store the value associated with the variable name
        userValues[input.variable] = userValue;
    }

    return userValues;
}

function promptUser(promptText) {
    return new Promise((resolve) => {
        let userInput = prompt(promptText);
        resolve(userInput);
    });
}


function replaceInputStatements(code, userValues) {
    // Split the code into lines
    let codeLines = code.split('\n');

    // Iterate over each line and replace the input statements
    codeLines = codeLines.map(line => {
        for (let variable in userValues) {
            // Regex to match `float(input(...))` or `eval(input(...))`
            const floatInputRegex = new RegExp(`\\s*${variable}\\s*=\\s*float\\(input\\(.*?\\)\\)`, 'g');
            const evalInputRegex = new RegExp(`\\s*${variable}\\s*=\\s*eval\\(input\\(.*?\\)\\)`, 'g');
            const inputRegex = new RegExp(`\\s*${variable}\\s*=\\s*input\\(.*?\\)`, 'g');

            // Replace the matching pattern with the try-except block
            if (floatInputRegex.test(line) || evalInputRegex.test(line) || inputRegex.test(line)) {
                line = `
${variable} = safe_eval(${JSON.stringify(userValues[variable])})
`.trim(); // .trim() is used to remove leading and trailing whitespace for clean code formatting
            }
        }
        return line;
    });
    // Join the modified lines back into a single code block
    return codeLines.join('\n');
}




