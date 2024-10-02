class MultipleChoiceQuiz {
    constructor(containerId, questionsData) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error('Container not found');
        }
        this.uniqueId = generateUUID();
        this.questionsData = questionsData;
        this.questions = [];
        this.init();
    }

    init() {
        this.generateHTML();
        this.createQuestions();
    }

    generateHTML() {
        // Clear the container and set up the main structure
        this.container.innerHTML = `
            <div id="quiz-container-${this.uniqueId}" class="quiz-container"></div>
            <div class="button-container">
                <button id="check-answers-${this.uniqueId}" class="button button-run">Sjekk svarene</button>
                <button id="reset-quiz-${this.uniqueId}" class="button button-reset">Reset quiz</button>
            </div>
            <!-- Toast Notifications -->
            <div id="toast-success-${this.uniqueId}" class="toast toast-success" style="display: none;">
                <p>Alt riktig! 🎉</p>
            </div>
            <div id="toast-error-${this.uniqueId}" class="toast toast-error" style="display: none;">
                <p>Noen av svarene er ikke rett. <br> Prøv igjen!</p>
            </div>
        `;

        // Add event listeners for buttons
        document.getElementById(`check-answers-${this.uniqueId}`).addEventListener('click', () => this.checkAnswers());
        document.getElementById(`reset-quiz-${this.uniqueId}`).addEventListener('click', () => this.resetQuiz());

        // Initialize cursor position for toast
        document.addEventListener('mousemove', (event) => {
            this.cursorX = event.clientX;
            this.cursorY = event.clientY;
        });
    }

    createQuestions() {
        const quizContainer = document.getElementById(`quiz-container-${this.uniqueId}`);
        this.questionsData.forEach((data) => {
            // Assign a unique ID if not provided
            if (!data.id) {
                data.id = generateUUID();
            }
            const mcq = new MultipleChoiceQuestion(data);
            this.questions.push(mcq);

            // Create a container for the question
            const questionContainer = document.createElement('div');
            questionContainer.id = `mcq-container-${data.id}`;
            questionContainer.classList.add('mcq-container');

            // Append the question container to the quiz container
            quizContainer.appendChild(questionContainer);

            // Render the question inside its container
            mcq.render(questionContainer.id);
        });
    }

    checkAnswers() {
        let allCorrect = true;
        this.questions.forEach((question) => {
            const isCorrect = question.checkAnswers(false); // Pass 'false' to suppress alerts
            if (!isCorrect) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            this.showToast('success');
        } else {
            this.showToast('error');
        }
    }

    resetQuiz() {
        this.questions.forEach((question) => {
            question.reset();
        });
        // Remove visual feedback
        this.questions.forEach((question) => {
            question.elements.questionCard.classList.remove('correct', 'incorrect');
        });
    }

    showToast(type) {
        const toastId = type === 'success' ? `toast-success-${this.uniqueId}` : `toast-error-${this.uniqueId}`;
        const toast = document.getElementById(toastId);

        // Position the toast near the cursor
        toast.style.top = `${this.cursorY - 150}px`;
        toast.style.left = `${this.cursorX}px`;
        toast.style.display = 'block';

        // Hide the toast after a delay
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2500); // Display for 2.5 seconds
    }
}
