class InteractiveCodeSetup {
    constructor(containerId, initialCode) {
        this.containerId = containerId;
        this.initialCode = initialCode;
        this.uniqueId = this.generateUUID();
        console.log("Unique ID:", this.uniqueId);

        // HTML element IDs
        this.editorId = `code-editor-${this.uniqueId}`;
        this.runButtonId = `run-button-${this.uniqueId}`;
        this.resetButtonId = `reset-button-${this.uniqueId}`;
        this.cancelButtonId = `cancel-button-${this.uniqueId}`;
        this.outputId = `output-${this.uniqueId}`;
        this.errorBoxId = `error-box-${this.uniqueId}`;

        // Store instances of CodeEditor and PythonRunner
        this.editorInstance = null;
        this.runnerInstance = null;


        // Initialize the editor setup
        this.createEditorHTML();
        this.setupInteractiveEditor();
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    createEditorHTML() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found.`);
            return;
        }

        const runIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
</svg>
`;
        const resetIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
</svg>
`;

        const cancelIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
</svg>
`;

        const html = `
            <div>
                <textarea id="${this.editorId}" name="code-${this.uniqueId}">${this.initialCode}</textarea>
                
                <button id="${this.runButtonId}" class="button button-run">Kjør kode ${runIcon}</button>
                <button id="${this.resetButtonId}" class="button button-reset">Reset kode ${resetIcon}</button>
                <button id="${this.cancelButtonId}" class="button button-cancel">Avbryt kjøring ${cancelIcon}</button>
            </div>
            <div id="${this.errorBoxId}"></div>
            <pre id="${this.outputId}" class="pythonoutput"></pre>
        `;

        container.innerHTML = html;
    }

    setupInteractiveEditor() {
        this.editorInstance = new CodeEditor(this.editorId); // Initialize the CodeEditor
        this.runnerInstance = new PythonRunner(this.outputId, this.errorBoxId); // Initialize the PythonRunner

        // Add event listeners for buttons
        document.getElementById(this.runButtonId).addEventListener("click", () => this.runCode());
        document.getElementById(this.resetButtonId).addEventListener("click", () => this.resetCode());
        document.getElementById(this.cancelButtonId).addEventListener("click", () => this.cancelCodeExecution());
    }

    

    runCode() {
        this.clearOutput();
        this.runnerInstance.run(this.editorInstance); // Pass the editor instance to PythonRunner for execution
    }

    resetCode() {
        this.clearOutput();
        this.editorInstance.resetEditor(this.initialCode); // Reset the editor content to the initial code
    }

    cancelCodeExecution() {
        if (this.runnerInstance.workerManager) {
            this.runnerInstance.workerManager.restartWorker(); // Restart the worker to cancel code execution
        }
    }

    clearOutput() {
        document.getElementById(this.outputId).textContent = "";
        document.getElementById(this.errorBoxId).textContent = "";
    }
}


function makeInteractiveCode(containerId, initialCode) {
    return new InteractiveCodeSetup(containerId, initialCode);
}