class InteractiveCodeSetup {
    constructor(containerId, initialCode, preloadPackages = null) {
        this.containerId = containerId;
        this.initialCode = initialCode;
        this.preloadPackages = preloadPackages;
        console.log("InteractiveCodeSetup - Preload packages:", this.preloadPackages);
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
            <div class="ic-container">
                <textarea id="${this.editorId}" name="code-${this.uniqueId}">${this.initialCode}</textarea>
                
                <button id="${this.runButtonId}" class="button button-run">Kjør kode ${runIcon}</button>
                <button id="${this.resetButtonId}" class="button button-reset">Reset kode ${resetIcon}</button>
                <button id="${this.cancelButtonId}" class="button button-cancel">Avbryt kjøring ${cancelIcon}</button>
            </div>
            <div id="${this.errorBoxId}"></div>
            <pre id="${this.outputId}" class="pythonoutput" data-placeholder="Kjør programmet for å se resultatet"></pre>
        `;

        container.innerHTML = html;
    }

    setupInteractiveEditor() {
        this.editorInstance = new CodeEditor(this.editorId); // Initialize the CodeEditor
        this.runnerInstance = new PythonRunner(this.outputId, this.errorBoxId, this.preloadPackages); // Initialize the PythonRunner

        // Add event listeners for buttons
        document.getElementById(this.runButtonId).addEventListener("click", () => this.runCode());
        document.getElementById(this.resetButtonId).addEventListener("click", () => this.resetCode());
        document.getElementById(this.cancelButtonId).addEventListener("click", () => this.cancelCodeExecution());

        // Set up localStorage persistence
        this.setupLocalStoragePersistence();
    }

    setupLocalStoragePersistence() {
        const storageKey = `interactive-code-${this.containerId}`;
        
        // Restore saved code if available
        const restoreState = () => {
            if (this.editorInstance && this.editorInstance.editor) {
                try {
                    const savedCode = localStorage.getItem(storageKey);
                    if (savedCode && savedCode !== this.initialCode) {
                        this.editorInstance.editor.setValue(savedCode);
                    }
                    // Update timestamp
                    localStorage.setItem(storageKey + '-timestamp', Date.now().toString());
                } catch (e) {
                    // Silently fail if restore fails
                }
            } else {
                // Retry if editor not ready
                setTimeout(restoreState, 100);
            }
        };
        
        // Start restoration
        setTimeout(restoreState, 100);

        // Save code when page unloads
        window.addEventListener('beforeunload', () => {
            this.saveState(storageKey);
        });

        // Also save when editor content changes (debounced)
        let saveTimeout = null;
        if (this.editorInstance && this.editorInstance.editor) {
            this.editorInstance.editor.on('change', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    this.saveState(storageKey);
                }, 1000); // Save 1 second after user stops typing
            });
        }
    }

    saveState(storageKey) {
        if (!this.editorInstance || !this.editorInstance.editor) return;
        try {
            const code = this.editorInstance.getValue();
            localStorage.setItem(storageKey, code);
            localStorage.setItem(storageKey + '-timestamp', Date.now().toString());
        } catch (e) {
            // If quota exceeded, try cleanup and retry
            if (e.name === 'QuotaExceededError') {
                this.cleanupOldStates();
                try {
                    const code = this.editorInstance.getValue();
                    localStorage.setItem(storageKey, code);
                    localStorage.setItem(storageKey + '-timestamp', Date.now().toString());
                } catch (retryError) {
                    // Still failed - silently give up
                }
            }
        }
    }

    cleanupOldStates() {
        try {
            // Find all interactive code states with timestamps
            const codeStates = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('interactive-code-') && key.endsWith('-timestamp')) {
                    const stateKey = key.replace('-timestamp', '');
                    const timestamp = parseInt(localStorage.getItem(key) || '0', 10);
                    codeStates.push({ key: stateKey, timestamp: timestamp });
                }
            }
            
            // Sort by timestamp (oldest first)
            codeStates.sort((a, b) => a.timestamp - b.timestamp);
            
            // Delete oldest 25% of states (minimum 1, maximum 10)
            const numToDelete = Math.max(1, Math.min(10, Math.floor(codeStates.length * 0.25)));
            for (let i = 0; i < numToDelete && i < codeStates.length; i++) {
                localStorage.removeItem(codeStates[i].key);
                localStorage.removeItem(codeStates[i].key + '-timestamp');
            }
        } catch (e) {
            // Cleanup failed - silently continue
        }
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


function makeInteractiveCode(containerId, initialCode, preloadPackages = null) {
    return new InteractiveCodeSetup(containerId, initialCode, preloadPackages);
}


// predictionInteractiveCodeSetup.js

class PredictionInteractiveCodeSetup extends InteractiveCodeSetup {
    constructor(containerId, initialCode) {
        super(containerId, initialCode);

        // Additional IDs for the prediction feature
        this.predictionInputId = `prediction-input-${this.uniqueId}`;
        this.lockPredictionButtonId = `lock-prediction-button-${this.uniqueId}`;
        this.predictionDisplayId = `prediction-display-${this.uniqueId}`;
        this.predictionOutputId = `prediction-output-${this.uniqueId}`;
        this.predictionOutputContainerId = `prediction-output-container-${this.uniqueId}`;
        this.predictionContainerId = `prediction-container-${this.uniqueId}`;
        // this.initialCode = initialCode;

        // Flag to track whether the prediction has been displayed
        this.predictionDisplayed = false;

        // Modify the HTML to include prediction elements
        this.addPredictionHTML();

        // Set up the prediction feature
        this.setupPredictionFeature();
    }

    addPredictionHTML() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found.`);
            return;
        }

        // Build the prediction input HTML
        const predictionHtml = `
            <div id="${this.predictionContainerId}" class="prediction-container ic-container">
            <textarea id="${this.predictionInputId}" rows="3" placeholder="Skriv inn svaret ditt her! \n \nTrykk på Enter (&#9166;) for en ny linje."></textarea>
            <button id="${this.lockPredictionButtonId}" class="button button-run">Sjekk svaret!</button>
            </div>
        `;

        // Insert the prediction input after the existing editor HTML
        container.insertAdjacentHTML('beforeend', predictionHtml);

        // Create the prediction-output container
        const predictionOutputContainer = document.createElement('div');
        predictionOutputContainer.id = this.predictionOutputContainerId;
        predictionOutputContainer.className = 'prediction-output-container';
        predictionOutputContainer.style.display = 'none';

        // Create the prediction display
        const predictionDisplay = document.createElement('div');
        predictionDisplay.className = 'prediction-display';
        predictionDisplay.innerHTML = `
            <h3>Ditt svar:</h3>
            <pre id="${this.predictionDisplayId}"></pre>
        `;

        // Create the output display for prediction phase
        const outputDisplay = document.createElement('div');
        outputDisplay.className = 'output-display';
        outputDisplay.innerHTML = `
            <h3>Faktisk utskrift:</h3>
            <pre id="${this.predictionOutputId}" class="pythonoutput"></pre>
        `;

        // Append the displays to the prediction-output container
        predictionOutputContainer.appendChild(predictionDisplay);
        predictionOutputContainer.appendChild(outputDisplay);

        // Append the prediction-output container after the error box
        const errorBoxElement = document.getElementById(this.errorBoxId);
        if (errorBoxElement) {
            errorBoxElement.insertAdjacentElement('afterend', predictionOutputContainer);
        } else {
            console.error(`Error box element with ID ${this.errorBoxId} not found.`);
            container.appendChild(predictionOutputContainer);
        }

        // Save a reference to the original output element
        this.originalOutputElement = document.getElementById(this.outputId);
    }

    

    setupPredictionFeature() {
        // Make the code editor read-only initially
        // Use setTimeout to ensure the editor is fully initialized
        const setupReadOnly = () => {
            // Check if editor instance exists and has been properly initialized
            if (this.editorInstance && this.editorInstance.editor) {
                console.log("Setting editor to read-only");
                this.editorInstance.editor.setOption('readOnly', true);
                
                // Hide the buttons now that we know the editor is ready
                document.getElementById(this.runButtonId).style.display = 'none';
                document.getElementById(this.resetButtonId).style.display = 'none';
                document.getElementById(this.cancelButtonId).style.display = 'none';
            } else {
                console.log("Editor not ready yet, retrying in 100ms...");
                // Retry after a short delay
                setTimeout(setupReadOnly, 100);
            }
        };
    
        // Start the setup process
        setupReadOnly();


        // this.editorInstance.editor.setOption('readOnly', true);

        // // Hide the run/reset/cancel buttons until the prediction is made
        // document.getElementById(this.runButtonId).style.display = 'none';
        // document.getElementById(this.resetButtonId).style.display = 'none';
        // document.getElementById(this.cancelButtonId).style.display = 'none';

        // Add event listener for the lock prediction button
        document.getElementById(this.lockPredictionButtonId).addEventListener("click", () => this.lockPrediction());
    }

    lockPrediction() {
        const prediction = document.getElementById(this.predictionInputId).value;

        // Store the prediction
        this.prediction = prediction;

        // Hide the prediction input area
        const predictionContainer = document.getElementById(this.predictionContainerId);
        if (predictionContainer) {
            predictionContainer.style.display = 'none';
        }

        // Make the code editor editable
        this.editorInstance.editor.setOption('readOnly', false);

        // Show the run/reset/cancel buttons
        document.getElementById(this.runButtonId).style.display = 'inline-block';
        document.getElementById(this.resetButtonId).style.display = 'inline-block';
        document.getElementById(this.cancelButtonId).style.display = 'inline-block';

        // Automatically run the code
        this.runCode();
    }

    runCode() {
        if (this.predictionDisplayed) {
            // Replace with a new InteractiveCodeSetup instance
            this.initialCode = this.editorInstance.getValue();
            this.replaceWithInteractiveCodeSetup();

        } else {
            // First run after prediction is locked in
            this.clearOutput();
            this.runnerInstance.run(this.editorInstance, this.predictionOutputId); // Pass the new output ID

            // Display the prediction and output side by side
            this.displayPredictionAndOutput();

            // Set flag to indicate prediction has been displayed
            this.predictionDisplayed = true;
        }
    }

    resetCode() {
        if (this.predictionDisplayed) {
            // Replace with a new InteractiveCodeSetup instance
            this.replaceWithInteractiveCodeSetup();
        } else {
            // First reset (unlikely, but handle just in case)
            this.clearOutput();
            this.editorInstance.resetEditor(this.initialCode);
        }
    }

    cancelCodeExecution() {
        if (this.predictionDisplayed) {
            // Replace with a new InteractiveCodeSetup instance
            this.replaceWithInteractiveCodeSetup();
        } else {
            // First cancel after prediction is locked in
            if (this.runnerInstance.workerManager) {
                this.runnerInstance.workerManager.restartWorker();
            }
        }
    }

    replaceWithInteractiveCodeSetup() {
        // Get the container element
        const container = document.getElementById(this.containerId);
        if (container) {
            // Clear the container's content
            container.innerHTML = '';

            // Create a new instance of InteractiveCodeSetup
            new InteractiveCodeSetup(this.containerId, this.initialCode);
        } else {
            console.error(`Container with ID ${this.containerId} not found.`);
        }
    }

    displayPredictionAndOutput() {
        // Display the user's prediction
        document.getElementById(this.predictionDisplayId).textContent = this.prediction;

        // Hide the original output element
        if (this.originalOutputElement) {
            this.originalOutputElement.style.display = 'none';
        }

        // Show the prediction-output container
        document.getElementById(this.predictionOutputContainerId).style.display = 'flex';
    }

    clearOutput() {
        if (this.predictionDisplayed) {
            const outputElement = document.getElementById(this.predictionOutputId);
            if (outputElement) {
                outputElement.textContent = "";
            }
        } else {
            const outputElement = document.getElementById(this.outputId);
            if (outputElement) {
                outputElement.textContent = "";
            }
        }
        const errorBoxElement = document.getElementById(this.errorBoxId);
        if (errorBoxElement) {
            errorBoxElement.textContent = "";
        }
    }
}

// Function to initialize the prediction code editor
function makePredictionInteractiveCode(containerId, initialCode) {
    return new PredictionInteractiveCodeSetup(containerId, initialCode);
}