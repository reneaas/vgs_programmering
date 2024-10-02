class PythonRunner {
    constructor(outputId, errorBoxId) {
        this.outputId = outputId;            // ID of the HTML element where output will be displayed
        this.errorBoxId = errorBoxId;        // ID of the HTML element for displaying errors
        this.workerManager = new WorkerManager();
        this.workerManager.setMessageCallback(this.handleWorkerMessage.bind(this)); // Set the message callback
        this.workerManager.setErrorCallback(this.handleWorkerError.bind(this));     // Set the error callback
        this.pyConsoleScript = this.getPyConsoleScript();  // Load the Python console script
    }

    /**
     * Prepares and runs the code provided in the editor.
     * @param {Object} editor - The CodeMirror editor instance containing the code.
     */
    async run(editor, outputId = null) {
        this.editorInstance = editor;
        this.editorInstance.clearLineHighlights();
        let code = editor.getValue();
        this.currentCode = code;

        if (outputId) {
            this.outputId = outputId;
        }

        // Handle input statements and modify the code accordingly
        const inputStatements = this.findInputStatements(this.currentCode);
        if (inputStatements.length > 0) {
            const userValues = await this.getUserInputs(inputStatements);
            this.currentCode = this.replaceInputStatements(this.currentCode, userValues);
            console.log("Modified code:", this.currentCode);
        }
 
        // Prepare the final code to be run (including custom eval functions, etc.)

        // Extract and load necessary packages
        const packages = this.extractPackageNames(this.currentCode);

        console.log("Packages to load:", packages);
        if (packages.length > 0) {
            this.workerManager.loadPackages(packages);
        } else {
            this.workerManager.runCode(this.pyConsoleScript);
            this.workerManager.runCode(this.currentCode);
        }
    }

    /**
     * Handles incoming messages from the WorkerManager.
     * @param {Object} data - The parsed message data from the worker.
     */
    handleWorkerMessage(data) {
        const { type, msg } = data;
        console.log("Message from worker:", data);
        const outputElement = document.getElementById(this.outputId);

        if (!outputElement) {
            console.error("Output element not found:", this.outputId);
            return;
        }

        if (type === 'stdout') {
            let escapedMsg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;'); //Escape the symbols '<' and '>'
            outputElement.innerHTML += this.formatErrorMessage(escapedMsg);
            this.highlightLine(this.editorInstance, escapedMsg);
            this.scrollToBottom(outputElement);

        } else if (type === 'stderr') {
            console.log("Error message:", msg);

        } else if (type === 'packagesLoaded') {
            // After loading packages, execute the code
            console.log("Packages loaded successfully.");
            this.workerManager.runCode(this.pyConsoleScript);
            this.workerManager.runCode(this.currentCode);
        }
    }

    scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    }

    /**
     * Handles errors from the WorkerManager.
     * @param {ErrorEvent} error - The error event from the worker.
     */
    handleWorkerError(error) {
        const errorElement = document.getElementById(this.errorBoxId);
        if (errorElement) {
            errorElement.textContent = `Error: ${error.message}`;
        }
    }

    /**
     * Executes Python code using the worker.
     * @param {string} code - The Python code to be executed.
     */
    executeCode(code) {
        this.currentCode = code; // Store the current code for later use
        this.workerManager.runCode(this.pyConsoleScript); // Load the Python console setup first
        this.workerManager.runCode(code); // Execute the user’s code
    }

    /**
     * Formats output messages for display.
     * @param {string} msg - The message to be formatted.
     * @returns {string} - The formatted message.
     */
    formatOutput(msg) {
        return msg;
    }


    highlightLine(editor, msg) {
        const linePattern = /File "&lt;exec&gt;", line (\d+)/g;
        const match = linePattern.exec(msg);
        if (match) {
            const lineNumber = parseInt(match[1]) - 1;
            console.log("Highlighting line:", lineNumber);
            editor.highlightLine(lineNumber);
        }
    }

    formatErrorMessage(errorMsg) {
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
                this.addAdmonitionToContainer(title, content, this.errorBoxId); 
            }
        }
    
        
    
        // Highlight the line number in the pattern 'File "<exec>", line <number>'
        const fileLinePattern = /File "&lt;exec&gt;", line (\d+)/g;
        formattedMessage = formattedMessage.replace(fileLinePattern, (match, p1) => {
            return match.replace(`line ${p1}`, `<span class="error-line">line ${p1}</span>`);
        });
    
        return formattedMessage;
    }

    addAdmonitionToContainer(title, content, errorBoxId) {
        const container = document.getElementById(errorBoxId);
        if (container) {
            container.innerHTML = this.createAdmonition(title, content);
        }
    }

    createAdmonition(title, content) {
        return `
            <div class="admonition pythonerror margin">
                <p class="admonition-title">${title}</p>
                <p>${content}</p>
            </div>
        `;
    }

    /**
     * Extracts package names from the code based on import statements.
     * @param {string} code - The Python code to be analyzed.
     * @returns {Array<string>} - An array of package names.
     */
    extractPackageNames(code) {
        // Matches "import <package> as <alias>" and "import <package>"
        const importRegex = /^\s*import\s+([^;\s]+)\s*/gm;
    
        // Matches "from <package> import <something>"
        const fromImportRegex = /^\s*from\s+([^;\s]+)\s+import/gm;
    
        const packages = new Set();
        const standardLibs = new Set([
            'abc', 'aifc', 'argparse', 'array', 'ast', 'asynchat', 'asyncio', 'asyncore', 'atexit', 'audioop', 'base64', 
            'bdb', 'binascii', 'binhex', 'bisect', 'builtins', 'bz2', 'cProfile', 'calendar', 'cgi', 'cgitb', 'chunk', 
            'cmath', 'cmd', 'code', 'codecs', 'codeop', 'collections', 'colorsys', 'compileall', 'concurrent', 'configparser', 
            'contextlib', 'copy', 'copyreg', 'crypt', 'csv', 'ctypes', 'curses', 'dataclasses', 'datetime', 'dbm', 'decimal', 
            'difflib', 'dis', 'distutils', 'doctest', 'email', 'encodings', 'ensurepip', 'enum', 'errno', 'faulthandler', 
            'fcntl', 'filecmp', 'fileinput', 'fnmatch', 'formatter', 'fractions', 'ftplib', 'functools', 'gc', 'getopt', 
            'getpass', 'gettext', 'glob', 'grp', 'gzip', 'hashlib', 'heapq', 'hmac', 'html', 'http', 'imaplib', 'imghdr', 
            'imp', 'importlib', 'inspect', 'io', 'ipaddress', 'itertools', 'json', 'keyword', 'lib2to3', 'linecache', 'locale', 
            'logging', 'lzma', 'mailbox', 'mailcap', 'marshal', 'math', 'mimetypes', 'mmap', 'modulefinder', 'msilib', 'msvcrt', 
            'multiprocessing', 'netrc', 'nntplib', 'numbers', 'operator', 'optparse', 'os', 'ossaudiodev', 'parser', 'pathlib', 
            'pdb', 'pickle', 'pickletools', 'pipes', 'pkgutil', 'platform', 'plistlib', 'poplib', 'posix', 'pprint', 'profile', 
            'pstats', 'pty', 'pwd', 'py_compile', 'pyclbr', 'pydoc', 'queue', 'quopri', 'random', 're', 'readline', 'reprlib', 
            'resource', 'rlcompleter', 'runpy', 'sched', 'secrets', 'select', 'selectors', 'shelve', 'shlex', 'shutil', 'signal', 
            'site', 'smtpd', 'smtplib', 'sndhdr', 'socket', 'socketserver', 'spwd', 'sqlite3', 'ssl', 'stat', 'statistics', 
            'string', 'stringprep', 'struct', 'subprocess', 'sunau', 'symbol', 'symtable', 'sys', 'sysconfig', 'tabnanny', 
            'tarfile', 'telnetlib', 'tempfile', 'termios', 'test', 'textwrap', 'threading', 'time', 'timeit', 'tkinter', 'token', 
            'tokenize', 'trace', 'traceback', 'tracemalloc', 'tty', 'turtle', 'turtledemo', 'types', 'typing', 'unicodedata', 
            'unittest', 'urllib', 'uu', 'uuid', 'venv', 'warnings', 'wave', 'weakref', 'webbrowser', 'winreg', 'winsound', 
            'wsgiref', 'xdrlib', 'xml', 'xmlrpc', 'zipapp', 'zipfile', 'zipimport', 'zlib'
        ]);
    
        let match;
    
        // Process "import" statements
        while ((match = importRegex.exec(code)) !== null) {
            const packageName = match[1].split('.')[0];
            if (!standardLibs.has(packageName)) {
                packages.add(packageName);
            }
        }
    
        // Process "from ... import" statements
        while ((match = fromImportRegex.exec(code)) !== null) {
            const packageName = match[1].split('.')[0];
            if (!standardLibs.has(packageName)) {
                packages.add(packageName);
            }
        }
    
        console.log("Packages to load:", Array.from(packages));
    
        return Array.from(packages);
    }

    /**
     * Prepares the Python console setup script.
     * @returns {string} - The Python console setup script.
     */
    getPyConsoleScript() {
        return `
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
    }

    /**
     * Creates an admonition block for displaying known Python error explanations.
     * @param {string} title - The title of the admonition block (e.g., "SyntaxError").
     * @param {string} content - The content explaining the error.
     * @returns {string} - The HTML content for the admonition block.
     */
    createAdmonition(title, content) {
        return `
        <div class="admonition pythonerror margin">
            <p class="admonition-title">${title}</p>
            <p>${content}</p>
        </div>
        `;
    }


    /**
     * Finds input statements in the code.
     * @param {string} code - The Python code to be analyzed.
     * @returns {Array<Object>} - An array of input statements found.
     */
    findInputStatements(code) {
        const inputRegex = /(\w+)\s*=\s*(float|eval)?\(?input\(["'](.*?)["']\)\)?/g;
        let match;
        let inputs = [];

        while ((match = inputRegex.exec(code)) !== null) {
            inputs.push({
                variable: match[1],
                promptText: match[3]
            });
        }

        return inputs;
    }

    /**
     * Prompts the user for input when input statements are found in the code.
     * @param {Array<Object>} inputs - An array of input statements.
     * @returns {Object} - A dictionary of user inputs mapped to variable names.
     */
    async getUserInputs(inputs) {
        let userValues = {};

        for (let input of inputs) {
            let promptText = input.promptText.replace(/['"]+/g, '');
            let userValue = await this.promptUser(promptText);
            userValues[input.variable] = userValue;
        }

        return userValues;
    }

    /**
     * Prompts the user for input.
     * @param {string} promptText - The text to display in the prompt.
     * @returns {Promise<string>} - A promise that resolves with the user input.
     */
    promptUser(promptText) {
        return new Promise((resolve) => {
            let userInput = prompt(promptText);
            resolve(userInput);
        });
    }

    /**
     * Replaces input statements in the code with user-provided values. 
     * @param {string} code - The Python code.
     * @param {Object} userValues - A dictionary of user-provided values.
     * @returns {string} - The modified code with input statements replaced.
     */

    replaceInputStatements(code, userValues) {
        let codeLines = code.split('\n');
    
        codeLines = codeLines.map(line => {
            for (let variable in userValues) {
                console.log("Variable: ", variable);
                // Adjust the regex to handle Unicode characters in variable names
                const inputRegex = new RegExp(`\\b${variable}\\b\\s*=\\s*(float|int|eval)?\\(?input\\(.*?\\)\\)?`, 'gu');
    
                if (inputRegex.test(line)) {
                    let userValue = userValues[variable];
    
                    // Detect the type of the user input
                    if (!isNaN(userValue)) {
                        // Check if the input is a number (int or float)
                        //userValue = Number(userValue); // Convert the string to a number
                    } else if (typeof userValue === 'string') {
                        // Check if the input is a string and doesn't contain only numbers
                        userValue = `"${userValue}"`; // Add quotes around string inputs
                    }
                    
                    line = line.replace(inputRegex, `${variable} = ${userValue}`);
                }
            }
            return line;
        });
    
        return codeLines.join('\n');
    }
}



// stepByStepPythonRunner.js

class StepByStepPythonRunner extends PythonRunner {
    constructor(outputId, errorBoxId, codeSetupInstance) {
        super(outputId, errorBoxId);
        this.codeSetupInstance = codeSetupInstance;
        this.pyodide = null;
        this.initializePyodide();
    }

    async initializePyodide() {
        this.pyodide = await loadPyodide();
    }

    async run(editor) {
        const code = editor.getValue();
        await this.executeCodeStepByStep(code);
    }

    async executeCodeStepByStep(code) {
        try {
            const executionStates = await this.getExecutionStates(code);
            this.codeSetupInstance.updateExecutionStates(executionStates);
        } catch (err) {
            this.handleExecutionError(err);
        }
    }

    async getExecutionStates(code) {
        // Import necessary modules in Pyodide
        await this.pyodide.loadPackage('micropip');
        await this.pyodide.runPythonAsync(`
            import sys
            sys.setrecursionlimit(1000)
            import json
            import sys
            sys.modules['_pydevd_frame_eval'] = None
        `);

        // Define the code to extract execution states
        const traceScript = `
def trace_calls(frame, event, arg):
    if event != 'line':
        return
    co = frame.f_code
    func_name = co.co_name
    line_no = frame.f_lineno
    locals_copy = frame.f_locals.copy()
    execution_state = {
        'lineNumber': line_no,
        'locals': locals_copy
    }
    execution_states.append(execution_state)
    return trace_calls

execution_states = []
sys.settrace(trace_calls)
try:
    exec(code, {})
except Exception as e:
    execution_states.append({'error': str(e)})
finally:
    sys.settrace(None)
`;
        // Inject the user code into the script
        const fullScript = `code = """${code}"""\n` + traceScript + `\njson.dumps(execution_states)`;

        // Run the script in Pyodide
        const result = await this.pyodide.runPythonAsync(fullScript);

        // Parse the result
        const executionStates = JSON.parse(result);
        return executionStates;
    }

    handleExecutionError(error) {
        const errorBoxElement = document.getElementById(this.errorBoxId);
        if (errorBoxElement) {
            errorBoxElement.textContent = error.message;
        }
    }
}