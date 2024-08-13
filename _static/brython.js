// let brythonWorker = new Worker("_static/brythonWorker.js");

let brythonWorker = null;

const initWorkerScript = `
importScripts('https://cdn.jsdelivr.net/npm/brython@3.10/brython.min.js');

self.onmessage = function(event) {
    const { code, outputId } = event.data;
    
    // Redirect print statements to the main thread
    __BRYTHON__.stdout.write = function(msg) {
        self.postMessage({ type: 'stdout', msg: msg });
    };
    __BRYTHON__.stderr.write = function(msg) {
        self.postMessage({ type: 'stderr', msg: msg });
    };

    // Execute the Python code
    try {
        eval(__BRYTHON__.python_to_js(code));
    } catch (err) {
        self.postMessage({ type: 'stderr', msg: err });
    }

    // Notify completion
    self.postMessage({ type: 'done' });
};

brython();
`;


function runBrythonCode(editor, outputId) {
    const code = editor.getValue();
    const output = document.getElementById(outputId);

    // Clear previous output
    output.textContent = '';


    // Create a new web worker
    if (!brythonWorker) {
        brythonWorker = new Worker(URL.createObjectURL(new Blob([initWorkerScript], { type: 'application/javascript' })));
    }

    // if (!brythonWorker) {
    //     brythonWorker = new Worker('_static/brythonWorker.js');
    // }

    // Handle messages from the worker
    brythonWorker.onmessage = function(event) {
        const { type, msg } = event.data;
        if (type === 'stdout' || type === 'stderr') {
            output.textContent += msg;
        }
    };

    // Send the code to the worker
    brythonWorker.postMessage({ code: code, outputId: outputId });
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

function getEditorBrython(editorId) {
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

function setupEditorBrython(editorId, buttonId, resetButtonId, cancelButtonId, outputId) {
    let editor = getEditor(editorId);
    const initialCode = editor.getValue();

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

    let runButton = document.getElementById(buttonId);
    runButton.addEventListener("click", () => {
        runBrythonCode(editor, outputId);
    });

    let resetButton = document.getElementById(resetButtonId);
    resetButton.addEventListener("click", () => {
        editor.setValue(initialCode);
        document.getElementById(outputId).textContent = "";
    });

    let cancelButton = document.getElementById(cancelButtonId);
    cancelButton.addEventListener("click", () => {
        if (brythonWorker) {
            brythonWorker.terminate();
            brythonWorker = null;
            document.getElementById(outputId).textContent += "\nExecution cancelled.";
        }
    });
}
