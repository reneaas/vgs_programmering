// Generate UUID function
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class MultipleChoiceQuestion {
    constructor({ id, content, answers }) {
        this.id = id;
        this.content = content;
        this.answers = answers.map((answer) => {
            if (!answer.hasOwnProperty('id')) {
                answer.id = generateUUID();
            }
            return answer;
        });
        this.selectedAnswers = new Set();
        this.elements = {}; // Store elements for easy access
        this.correctlyAnswered = false; // Track if the question is correctly answered
    }

    shuffleAnswers() {
        shuffleArray(this.answers);
    }

    render(containerId) {
        const container = document.getElementById(containerId);

        // Create question element
        const questionCard = document.createElement('div');
        questionCard.classList.add('question-card');
        questionCard.innerHTML = this.content;

        // Append the question card to the container
        container.appendChild(questionCard);

        // Render LaTeX in the question
        this.renderMathInElement(questionCard);

        // Apply syntax highlighting to the question card
        this.applySyntaxHighlighting(questionCard);

        // Create answers container
        const answersGrid = document.createElement('div');
        answersGrid.classList.add('answers-grid');

        // Append the answers grid to the container
        container.appendChild(answersGrid);

        // Create answer elements
        this.answers.forEach((answer) => {
            const answerCard = document.createElement('div');
            answerCard.classList.add('answer-card');
            answerCard.innerHTML = answer.content;
            answerCard.dataset.answerId = answer.id;

            // Append the answer card to the answers grid
            answersGrid.appendChild(answerCard);

            // Render LaTeX in the answer
            this.renderMathInElement(answerCard);

            // Apply syntax highlighting to the answer card
            this.applySyntaxHighlighting(answerCard);

            // Mark as selected if previously selected
            if (this.selectedAnswers.has(answer.id)) {
                answerCard.classList.add('selected');
            }

            // Disable interaction if question is correctly answered
            if (this.correctlyAnswered) {
                answerCard.classList.add('disabled');
            } else {
                // Add click event to handle selection
                answerCard.addEventListener('click', () => this.toggleSelection(answerCard));
            }
        });

        // Store elements for later access
        this.elements.container = container;
        this.elements.questionCard = questionCard;
        this.elements.answersGrid = answersGrid;

        // Apply correct class if previously answered correctly
        if (this.correctlyAnswered) {
            this.elements.questionCard.classList.add('correct');
        }
    }

    toggleSelection(answerCard) {
        const answerId = answerCard.dataset.answerId;
        if (this.selectedAnswers.has(answerId)) {
            this.selectedAnswers.delete(answerId);
            answerCard.classList.remove('selected');
        } else {
            // If single-choice, deselect other answers
            if (this.isSingleChoice()) {
                this.selectedAnswers.clear();
                const allAnswerCards = this.elements.answersGrid.querySelectorAll('.answer-card');
                allAnswerCards.forEach(card => card.classList.remove('selected'));
            }
            this.selectedAnswers.add(answerId);
            answerCard.classList.add('selected');
        }
    }

    checkAnswers(showAlert = true) {
        // Get the correct answer IDs
        const correctAnswerIds = this.answers
            .filter(answer => answer.isCorrect)
            .map(answer => answer.id);

        // Compare selectedAnswers with correctAnswerIds
        const isCorrect =
            this.selectedAnswers.size === correctAnswerIds.length &&
            [...this.selectedAnswers].every(id => correctAnswerIds.includes(id));

        // Provide visual feedback
        if (isCorrect) {
            this.elements.questionCard.classList.remove('incorrect'); // ✅ Remove incorrect class
            this.elements.questionCard.classList.add('correct');
            this.correctlyAnswered = true; // Mark question as correctly answered
            // Disable further interaction
            const allAnswerCards = this.elements.answersGrid.querySelectorAll('.answer-card');
            allAnswerCards.forEach(card => {
                card.classList.add('disabled');

                const newCard = card.cloneNode(true);
                card.parentNode.replaceChild(newCard, card);
            });
        } else {
            this.elements.questionCard.classList.add('incorrect');
        }

        // Optionally display feedback if showAlert is true
        if (showAlert) {
            alert(isCorrect ? 'Correct!' : 'Incorrect. Please try again.');
        }

        return isCorrect;
    }

    markAsCorrectlyAnswered() {
        this.correctlyAnswered = true;
    }

    isSingleChoice() {
        // Determine if the question is single-choice
        const correctAnswersCount = this.answers.filter(answer => answer.isCorrect).length;
        return correctAnswersCount === 1;
    }

    renderMathInElement(element) {
        // Ensure KaTeX renders LaTeX inside the element
        renderMathInElement(element, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\[', right: '\\]', display: true },
                { left: '\\(', right: '\\)', display: false }
                // ... other delimiters if needed ...
            ]
        });
    }

    applySyntaxHighlighting(element) {
        // Apply syntax highlighting to code blocks
        const codeBlocks = element.querySelectorAll('code');
        codeBlocks.forEach(block => {
            hljs.highlightElement(block);
        });
    }
}
