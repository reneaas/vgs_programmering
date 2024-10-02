class SequentialMultipleChoiceQuiz {
    constructor(containerId, questionsData) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error('Container not found');
        }
        this.questionsData = questionsData;
        this.totalQuestions = questionsData.length;
        this.currentQuestionIndex = 0;
        this.uniqueId = generateUUID();
        this.init();
    }

    init() {
        this.generateHTML();
        this.showQuestion();
    }

    generateHTML() {
        // Set up the main structure
        this.container.innerHTML = `
            <div id="question-counter-${this.uniqueId}" class="question-counter"></div>
            <div id="question-container-${this.uniqueId}" class="mcq-container"></div>
            <div class="button-container">
                <button id="submit-answer-${this.uniqueId}" class="button button-run">Sjekk svar</button>
            </div>
            <!-- Toast Notifications -->
            <div id="toast-success-${this.uniqueId}" class="toast toast-success" style="display: none;">
                <p>Riktig! 🎉</p>
            </div>
            <div id="toast-error-${this.uniqueId}" class="toast toast-error" style="display: none;">
                <p>Prøv igjen!</p>
            </div>
        `;

        // Add event listener for the submit button
        document.getElementById(`submit-answer-${this.uniqueId}`).addEventListener('click', () => this.submitAnswer());

        // Initialize cursor position for toast
        document.addEventListener('mousemove', (event) => {
            this.cursorX = event.clientX;
            this.cursorY = event.clientY;
        });
    }

    showQuestion() {
        const questionData = this.questionsData[this.currentQuestionIndex];
        if (!questionData) {
            this.finishQuiz();
            return;
        }

        // Update the question counter
        const counter = document.getElementById(`question-counter-${this.uniqueId}`);
        counter.textContent = `Spørsmål ${this.currentQuestionIndex + 1} / ${this.totalQuestions}`;

        // Clear the question container before rendering the new question
        const questionContainer = document.getElementById(`question-container-${this.uniqueId}`);
        questionContainer.innerHTML = ''; // Clear previous question

        // Render the new question
        this.currentQuestion = new MultipleChoiceQuestion(questionData);
        this.currentQuestion.render(`question-container-${this.uniqueId}`);
    }

    submitAnswer() {
        const isCorrect = this.currentQuestion.checkAnswers(false); // Pass 'false' to suppress alerts

        if (isCorrect) {
            this.showToast('success');
            // Move to the next question after a short delay
            setTimeout(() => {
                this.currentQuestionIndex++;
                if (this.currentQuestionIndex < this.totalQuestions) {
                    this.showQuestion();
                } else {
                    this.finishQuiz();
                }
            }, 1000); // Delay to allow the user to see the feedback
        } else {
            this.showToast('error');
            // Optionally, allow the user to retry or move on
            // For immediate move to next question, uncomment below
            /*
            setTimeout(() => {
                this.currentQuestionIndex++;
                if (this.currentQuestionIndex < this.totalQuestions) {
                    this.showQuestion();
                } else {
                    this.finishQuiz();
                }
            }, 1500);
            */
        }
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
        }, 1500); // Display for 1.5 seconds
    }

    finishQuiz() {
        // Clear the container and display a completion message
        this.container.innerHTML = `
            <div class="quiz-completion-message">
                <p>Da var quizen ferdig! 🎉</p>
            </div>
        `;
    }
}
