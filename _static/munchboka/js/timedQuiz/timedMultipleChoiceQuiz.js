class TimedMultipleChoiceQuiz {
    constructor(containerId, questionsData, timeLimit = 60) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error('Container not found');
        }
        this.questionsData = questionsData;
        this.timeLimit = timeLimit; // Time limit in seconds
        this.remainingTime = timeLimit;
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        this.questionsAttempted = 0;
        this.uniqueId = generateUUID();
        this.correctlyAnsweredQuestions = new Set(); // Track correctly answered questions
        this.init();
    }

    init() {
        // Shuffle the questions
        this.shuffleQuestions();

        // Generate the HTML structure
        this.generateHTML();

        // Wait for the user to start the quiz
    }

    shuffleQuestions() {
        for (let i = this.questionsData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questionsData[i], this.questionsData[j]] = [this.questionsData[j], this.questionsData[i]];
        }
    }

    generateHTML() {
        // Set up the main structure
        this.container.innerHTML = `
            <div id="timer-container-${this.uniqueId}" class="timer-container" style="display: none;">
                <div id="progress-bar-${this.uniqueId}" class="progress-bar"></div>
                <span id="timer-${this.uniqueId}" class="timer-text">${this.formatTime(this.remainingTime)}</span>
            </div>
            <div id="question-container-${this.uniqueId}" class="mcq-container" style="display: none;"></div>
            <div class="button-container">
                <button id="start-quiz-${this.uniqueId}" class="button button-run">Start Quiz</button>
                <button id="submit-answer-${this.uniqueId}" class="button button-run" style="display: none;">Sjekk svar</button>
            </div>
            <!-- Toast Notifications -->
            <div id="toast-success-${this.uniqueId}" class="toast toast-success" style="display: none;">
                <p>Riktig! 🎉</p>
            </div>
            <div id="toast-error-${this.uniqueId}" class="toast toast-error" style="display: none;">
                <p>Feil svar!</p>
            </div>
        `;

        // Add event listener for the start button
        document.getElementById(`start-quiz-${this.uniqueId}`).addEventListener('click', () => this.startQuiz());
    }

    startQuiz() {
        // Hide the start button
        const startButton = document.getElementById(`start-quiz-${this.uniqueId}`);
        startButton.style.display = 'none';

        // Show the timer container
        const timerContainer = document.getElementById(`timer-container-${this.uniqueId}`);
        timerContainer.style.display = 'block';

        // Show the question container
        const questionContainer = document.getElementById(`question-container-${this.uniqueId}`);
        questionContainer.style.display = 'block';

        // Show the submit button
        const submitButton = document.getElementById(`submit-answer-${this.uniqueId}`);
        submitButton.style.display = 'inline-block';

        // Add event listener for the submit button
        submitButton.addEventListener('click', () => this.submitAnswer());

        // Start the timer
        this.startTimer();

        // Show the first question
        this.showQuestion();
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    startTimer() {
        this.updateTimerUI();
        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            this.updateTimerUI();

            if (this.remainingTime <= 0) {
                this.endQuiz();
            }
        }, 1000);
    }

    updateTimerUI() {
        // Update the timer text
        const timerText = document.getElementById(`timer-${this.uniqueId}`);
        timerText.textContent = this.formatTime(this.remainingTime);
    
        // Update the progress bar
        const progressBar = document.getElementById(`progress-bar-${this.uniqueId}`);
        const percentage = (this.remainingTime / this.timeLimit) * 100;
        progressBar.style.width = `${percentage}%`;
    
        // Remove existing state classes
        progressBar.classList.remove('progress-bar-warning', 'progress-bar-danger');
    
        // Change the color of the progress bar if time is running out
        if (percentage <= 20) {
            progressBar.classList.add('progress-bar-danger'); // Red
        } else if (percentage <= 50) {
            progressBar.classList.add('progress-bar-warning'); // Yellow
        } else {
            // Default is green, no additional class needed
        }
    }

    showQuestion() {
        // Increment the number of questions attempted
        if (this.currentQuestionIndex >= this.questionsData.length) {
            this.endQuiz();
            return;
        }

        this.questionsAttempted++;

        if (this.currentQuestionIndex >= this.questionsData.length) {
            // Restart from the first question if we've reached the end
            this.currentQuestionIndex = 0;
            // Optionally reshuffle the questions here
            // this.shuffleQuestions();
        }

        const questionData = this.questionsData[this.currentQuestionIndex];

        // Clear the question container before rendering the new question
        const questionContainer = document.getElementById(`question-container-${this.uniqueId}`);
        questionContainer.innerHTML = ''; // Clear previous question

        // Render the new question
        this.currentQuestion = new MultipleChoiceQuestion(questionData);
        this.currentQuestion.shuffleAnswers();
        this.currentQuestion.render(`question-container-${this.uniqueId}`);
    }

    submitAnswer() {
        const isCorrect = this.currentQuestion.checkAnswers(false); // Pass 'false' to suppress alerts

        if (isCorrect) {
            this.correctAnswers++;
            this.correctlyAnsweredQuestions.add(this.currentQuestionIndex); // Track correct answer
            this.currentQuestion.markAsCorrectlyAnswered();

            // this.showToast('success');
        } else {
            // this.showToast('error');
        }

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.showQuestion();
        }, 500);

        // Move to the next question immediately
        // this.currentQuestionIndex++;
        // this.showQuestion();
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

        // Hide the toast after a short delay
        setTimeout(() => {
            toast.style.display = 'none';
        }, 500); // Display for 0.5 seconds
    }

    endQuiz() {
        // Stop the timer
        clearInterval(this.timerInterval);

        // Determine the appropriate message
        let completionMessage;
        if (this.remainingTime <= 0) {
            completionMessage = `Tiden er ute! Du svarte riktig på ${this.correctAnswers} av ${this.questionsAttempted} spørsmål. 🎉`;
        } else {
            completionMessage = `Du har fullført quizen! Du svarte riktig på ${this.correctAnswers} av ${this.questionsAttempted} spørsmål. 🎉`;
        }

        // Clear the container and display the final score
        this.container.innerHTML = `
            <div class="quiz-completion-message">
                <p>${completionMessage}</p>
                <button id="restart-quiz-${this.uniqueId}" class="button button-run">Start på nytt</button>
            </div>
        `;

        // Add event listener to restart the quiz
        document.getElementById(`restart-quiz-${this.uniqueId}`).addEventListener('click', () => this.restartQuiz());
    }

    restartQuiz() {
        // Reset variables
        this.remainingTime = this.timeLimit;
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        this.questionsAttempted = 0;

        // Shuffle questions again
        this.shuffleQuestions();

        // Reinitialize the quiz
        this.init();
    }
}
