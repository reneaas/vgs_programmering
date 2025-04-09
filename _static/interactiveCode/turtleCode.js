function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}


class TurtleCode {
    /**
     * @param {string} containerId - ID of an existing <div> that will hold this environment.
     * @param {string} [initialCode=""] - Initial Python code to display in the editor.
     * @param {Object} [cmOptions={}] - Additional CodeMirror options to merge in.
     */
    constructor(containerId, initialCode = "", cmOptions = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id="${containerId}" not found.`);
        }
        this.initialCode = initialCode;
        this.cmOptions = cmOptions;
    
        this.uniqueSuffix = generateUUID(); // to avoid ID collisions
    
        this.createUI();
      
        // Initialize your existing CodeEditor on the created <textarea>
        this.editor = new CodeEditor(this.textAreaEl.id);
        this.editor.setValue(this.initialCode);

        this.runButtonEl.addEventListener("click", () => this.runCode());
    }
  
    createUI() {
        // Clear any existing content in the container
        this.container.innerHTML = "";

        // A flex container to hold the editor (left) and the turtle div (right)
        const editorAndCanvasContainer = document.createElement("div");

        editorAndCanvasContainer.classList.add("turtle-env"); // for styling

        editorAndCanvasContainer.style.display = "flex";
        editorAndCanvasContainer.style.flexWrap = "wrap"; // in case of narrow screens
        editorAndCanvasContainer.style.width = "100%";

        // --- LEFT COLUMN: Editor, Run Button, Output ---
        const editorContainer = document.createElement("div");

        editorContainer.classList.add("turtle-left"); // for styling

        editorContainer.style.flex = "1";          // Take 50% of available width
        editorContainer.style.minWidth = "100px";  // Reasonable min width
        editorContainer.style.display = "flex";
        editorContainer.style.flexDirection = "column";

        // Textarea for CodeMirror
        this.textAreaEl = document.createElement("textarea");
        this.textAreaEl.id = `skulpt-editor-${this.uniqueSuffix}`;
        // Hide the raw <textarea> so CodeMirror can replace it
        this.textAreaEl.style.display = "none";
        editorContainer.appendChild(this.textAreaEl);

        // Run Button
        this.runButtonEl = document.createElement("button");
        this.runButtonEl.className = "button button-run";
        this.runButtonEl.id = `skulpt-run-btn-${this.uniqueSuffix}`;
        this.runButtonEl.textContent = "Kjør kode";
        this.runButtonEl.style.margin = "1em 0";
        editorContainer.appendChild(this.runButtonEl);

        // Output <pre>
        this.outputEl = document.createElement("pre");
        this.outputEl.className = "pythonoutput";
        this.outputEl.id = `skulpt-output-${this.uniqueSuffix}`;
        this.outputEl.style.border = "1px solid #ccc";
        this.outputEl.style.padding = "8px";
        this.outputEl.style.minHeight = "2em";
        this.outputEl.style.whiteSpace = "pre-wrap";
        editorContainer.appendChild(this.outputEl);

        editorAndCanvasContainer.appendChild(editorContainer);

        // --- RIGHT COLUMN: Turtle Div ---
        const canvasContainer = document.createElement("div");

        // canvasContainer.classList.add("turtle-right"); // for styling

        canvasContainer.style.flex = "1";          // Take the other 50%
        canvasContainer.style.minWidth = "350px";  // Reasonable min width
        canvasContainer.style.display = "flex";
        canvasContainer.style.flexDirection = "column";
        canvasContainer.style.alignItems = "center";
        canvasContainer.style.justifyContent = "center";

        // Turtle div
        this.canvasEl = document.createElement("div");
        this.canvasEl.id = `skulpt-canvas-${this.uniqueSuffix}`;
        this.canvasEl.style.border = "1px solid #ccc";
        this.canvasEl.style.width = "95%";   // Adjust as needed
        this.canvasEl.style.height = "400px"; 
        this.canvasEl.style.marginTop = "0em";
        this.canvasEl.style.boxSizing = "border-box";
        canvasContainer.appendChild(this.canvasEl);

        editorAndCanvasContainer.appendChild(canvasContainer);

        // Finally, append the flex container into the main container
        this.container.appendChild(editorAndCanvasContainer);
    }
  
    runCode() {
        let userCode = this.editor.getValue();
        this.outputEl.innerHTML = ""; // clear output


        const mode = document.documentElement.getAttribute("data-mode");
        // default to black
        let forcedColor = "black";
        if (mode === "dark") {
            forcedColor = "white";
        }
        else if (mode === "light") {
            forcedColor = "black";
        }
        else if (mode === "auto") {
            const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
            forcedColor = prefersDarkScheme ? "white" : "black";
        }

        console.log("Mode", mode);


        // Safely prepend a snippet that ensures turtle is white
        // We also do a basic check to ensure turtle is imported before coloring
        // (some users might not have "import turtle" at all).
        // "import turtle" will just re-import gracefully if the user already had it.
        const snippet = `
try:
    import turtle
    turtle.color("${forcedColor}")
    screen = turtle.Screen()

    # screen.setup(width=300, height=300)

    # Set a coordinate system so the center of the visible area is (0,0).
    # For example, left = -200, right = 200, bottom = -150, top = 150
    # screen.setworldcoordinates(-200, -150, 200, 150)
except:
    pass

`;
        userCode = snippet + userCode;
  
        // Output function for Python's print
        const outf = (text) => {
            this.outputEl.innerHTML += text;
        };
  
        // Helper for Skulpt to read built-in libs
        const builtinRead = (filename) => {
            if (!Sk.builtinFiles || !Sk.builtinFiles["files"][filename]) {
                throw new Error("File not found: " + filename);
            }
            return Sk.builtinFiles["files"][filename];
        };
  
        // Configure Skulpt
        Sk.pre = this.outputEl.id;
        Sk.configure({
            output: outf,
            read: builtinRead,
            python3: true,
        });
  
        // Point turtle to our <div>
        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = this.canvasEl.id;
  
        // Asynchronously run the code
        Sk.misceval.asyncToPromise(() => {
            return Sk.importMainWithBody("<stdin>", false, userCode, true);
        }).then(
            () => {
                // success
            },
            (err) => {
                // error
                this.outputEl.innerHTML = err.toString();
            }
        );
    }
}

function makeTurtleCode(containerId, initialCode = "", cmOptions = {}) {
    return new TurtleCode(containerId, initialCode, cmOptions);
}
