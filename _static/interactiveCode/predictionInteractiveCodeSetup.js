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
            <div id="${this.predictionContainerId}" class="prediction-container">
            <textarea id="${this.predictionInputId}" rows="3" placeholder="Skriv inn svaret ditt her! \n \nTrykk på Enter (&#9166;) for en ny linje."></textarea>
            <button id="${this.lockPredictionButtonId}" class="button button-lock-prediction">Sjekk svaret!</button>
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
        this.editorInstance.editor.setOption('readOnly', true);

        // Hide the run/reset/cancel buttons until the prediction is made
        document.getElementById(this.runButtonId).style.display = 'none';
        document.getElementById(this.resetButtonId).style.display = 'none';
        document.getElementById(this.cancelButtonId).style.display = 'none';

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