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
        this.correctlyAnsweredQuestions = new Set(); // Track correctly answered questions
        this.questionInstances = {}; // Store instances of MultipleChoiceQuestion
        this.isFinished = false; // Track completion without destroying UI
        this.init();
    }

    init() {
        this.generateHTML();
        this.showQuestion();
    }

    generateHTML() {
        // Set up the main structure with Previous and Next buttons
        this.container.innerHTML = `
            <div id="question-counter-${this.uniqueId}" class="question-counter"></div>
            <div id="question-container-${this.uniqueId}" class="mcq-container"></div>
            <div class="button-container">
                <button id="prev-question-${this.uniqueId}" class="button button-prev">← Forrige</button>
                <button id="submit-answer-${this.uniqueId}" class="button button-run">Sjekk svar</button>
                <button id="next-question-${this.uniqueId}" class="button button-next">Neste →</button>
            </div>
            <div id="quiz-completion-${this.uniqueId}" class="quiz-completion-message" style="display: none;">
                <p>Da var quizen ferdig! 🎉</p>
            </div>
            <!-- Toast Notifications -->
            <div id="toast-success-${this.uniqueId}" class="toast toast-success" style="display: none;">
                <p>Riktig! 🎉</p>
            </div>
            <div id="toast-error-${this.uniqueId}" class="toast toast-error" style="display: none;">
                <p>Prøv igjen!</p>
            </div>
        `;

        // Add event listeners for the buttons
        document.getElementById(`submit-answer-${this.uniqueId}`).addEventListener('click', () => this.submitAnswer());
        document.getElementById(`prev-question-${this.uniqueId}`).addEventListener('click', () => this.goToPreviousQuestion());
        document.getElementById(`next-question-${this.uniqueId}`).addEventListener('click', () => this.goToNextQuestion());
    }

    showQuestion() {
        // If we moved beyond the virtual completion card, clamp back
        if (this.currentQuestionIndex > this.totalQuestions) {
            this.currentQuestionIndex = this.totalQuestions;
        }
    
        // Update the question counter (hide count on completion card)
        const counter = document.getElementById(`question-counter-${this.uniqueId}`);
        if (this.currentQuestionIndex === this.totalQuestions) {
            counter.textContent = '';
        } else {
            counter.textContent = `Spørsmål ${this.currentQuestionIndex + 1} / ${this.totalQuestions}`;
        }
    
        // Clear the question container before rendering the new question
        const questionContainer = document.getElementById(`question-container-${this.uniqueId}`);
        questionContainer.innerHTML = ''; // Clear previous question

        // If we are on the virtual completion card, show the completion banner
        // and do NOT render a question (buttons remain for navigation)
        const banner = document.getElementById(`quiz-completion-${this.uniqueId}`);
        if (this.currentQuestionIndex === this.totalQuestions) {
            if (banner) banner.style.display = 'block';
            this.updateNavigationButtons();
            return;
        } else if (banner) {
            banner.style.display = 'none';
        }

        const questionData = this.questionsData[this.currentQuestionIndex];
        if (!questionData) {
            return; // Nothing to show
        }
    
        // Check if we already have an instance of the question
        if (this.questionInstances.hasOwnProperty(this.currentQuestionIndex)) {
            // Retrieve the existing instance
            this.currentQuestion = this.questionInstances[this.currentQuestionIndex];
        } else {
            // Create a new instance and store it
            this.currentQuestion = new MultipleChoiceQuestion(questionData);
            // Shuffle the answers on first creation
            this.currentQuestion.shuffleAnswers();
            this.questionInstances[this.currentQuestionIndex] = this.currentQuestion;
        }
    
        // Render the question
        this.currentQuestion.render(`question-container-${this.uniqueId}`);
    
        // Update navigation buttons and other UI elements
        this.updateNavigationButtons();
    }
    

    submitAnswer() {
        // Disable the submit button to prevent multiple clicks
        const submitButton = document.getElementById(`submit-answer-${this.uniqueId}`);
        submitButton.disabled = true;
    
        const isCorrect = this.currentQuestion.checkAnswers(false); // Pass 'false' to suppress alerts
    
        if (isCorrect) {
            this.correctlyAnsweredQuestions.add(this.currentQuestionIndex); // Track correct answer
            this.showToast('success');
            // Mark the question as correctly answered
            this.currentQuestion.markAsCorrectlyAnswered();
            // Update navigation buttons after a short delay
            setTimeout(() => {
                this.updateNavigationButtons();
            }, 800); // Delay to allow the user to see the feedback
        } else {
            this.showToast('error');
            // Re-enable the submit button so the user can try again
            setTimeout(() => {
                submitButton.disabled = false;
            }, 1500); // Match the toast display time
        }
    }
    

    showToast(type) {
        const toastId = type === 'success' ? `toast-success-${this.uniqueId}` : `toast-error-${this.uniqueId}`;
        const toast = document.getElementById(toastId);

        if (!toast) {
            console.error(`Toast element with ID ${toastId} not found.`);
            return;
        }

        // Ensure the container is positioned relatively
        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }

        // Display the toast in the center of the container
        toast.style.position = 'absolute';
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
        toast.style.display = 'block';

        // Hide the toast after a delay
        setTimeout(() => {
            toast.style.display = 'none';
        }, 1500); // Display for 1.5 seconds
    }

    finishQuiz() {
        // Mark finished and show completion banner, keep UI for navigation
        this.isFinished = true;
        const banner = document.getElementById(`quiz-completion-${this.uniqueId}`);
        if (banner) {
            banner.style.display = 'block';
        }
    }


    updateNavigationButtons() {
        const prevButton = document.getElementById(`prev-question-${this.uniqueId}`);
        const nextButton = document.getElementById(`next-question-${this.uniqueId}`);
        const submitButton = document.getElementById(`submit-answer-${this.uniqueId}`);

        const currentIndex = this.currentQuestionIndex;

        // Show or hide the Previous button
        if (currentIndex === 0 || !this.correctlyAnsweredQuestions.has(currentIndex - 1)) {
            prevButton.style.display = 'none'; // Hide the button
        } else {
            prevButton.style.display = ''; // Show the button
        }

        // Show or hide the Next button
        if (currentIndex === this.totalQuestions) {
            nextButton.style.display = 'none'; // No next beyond completion card
        } else if (this.correctlyAnsweredQuestions.has(currentIndex)) {
            nextButton.style.display = ''; // Show the button (including on last real question)
        } else {
            nextButton.style.display = 'none'; // Hide the button
        }

        // Disable/hide the submit button on completion card; otherwise disable if already correct
        if (currentIndex === this.totalQuestions) {
            submitButton.style.display = 'none';
        } else {
            submitButton.style.display = '';
            submitButton.disabled = this.correctlyAnsweredQuestions.has(currentIndex);
        }
    }

    goToPreviousQuestion() {
        if (this.currentQuestionIndex > 0 && this.correctlyAnsweredQuestions.has(this.currentQuestionIndex - 1)) {
            this.currentQuestionIndex--;
            this.showQuestion();
            // this.scrollToQuizContainer(); // Scroll to the quiz container
        }
    }

    goToNextQuestion() {
        if (this.currentQuestionIndex === this.totalQuestions) {
            return; // Already at completion card
        }
        if (this.correctlyAnsweredQuestions.has(this.currentQuestionIndex)) {
            if (this.currentQuestionIndex < this.totalQuestions - 1) {
                this.currentQuestionIndex++;
                this.showQuestion();
            } else if (this.currentQuestionIndex === this.totalQuestions - 1) {
                // Move to virtual completion card
                this.currentQuestionIndex = this.totalQuestions;
                this.finishQuiz();
                this.showQuestion();
            }
            // this.scrollToQuizContainer(); // Scroll to the quiz container
        }
    }

    scrollToQuizContainer() {
        this.container.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    }
}
