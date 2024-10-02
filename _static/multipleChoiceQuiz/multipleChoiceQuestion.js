// Generate UUID function
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class MultipleChoiceQuestion {
    constructor({ id, content, answers }) {
        this.id = id;
        this.content = content;
        this.answers = answers;
        shuffleArray(this.answers); // Shuffle the answers
        this.selectedAnswers = new Set();
        this.elements = {}; // Store elements for easy access
    }

    render(containerId) {
        const container = document.getElementById(containerId);
    
        // Create question element
        const questionCard = document.createElement('div');
        questionCard.classList.add('question-card');
        questionCard.innerHTML = this.content;
    
        // Append the question card to the container first
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
        this.answers.forEach((answer, index) => {
            const answerCard = document.createElement('div');
            answerCard.classList.add('answer-card');
            answerCard.innerHTML = answer.content;
            answerCard.dataset.index = index;
    
            // Append the answer card to the answers grid first
            answersGrid.appendChild(answerCard);
    
            // Render LaTeX in the answer
            this.renderMathInElement(answerCard);
    
            // Apply syntax highlighting to the answer card
            this.applySyntaxHighlighting(answerCard);
    
            // Add click event to handle selection
            answerCard.addEventListener('click', () => this.toggleSelection(answerCard));
        });
    
        // Store elements for later access
        this.elements.container = container;
        this.elements.questionCard = questionCard;
        this.elements.answersGrid = answersGrid;
    }
    

    toggleSelection(answerCard) {
        const index = answerCard.dataset.index;
        if (this.selectedAnswers.has(index)) {
            this.selectedAnswers.delete(index);
            answerCard.classList.remove('selected');
        } else {
            // If single-choice, deselect other answers
            if (this.isSingleChoice()) {
                this.selectedAnswers.clear();
                const allAnswerCards = this.elements.answersGrid.querySelectorAll('.answer-card');
                allAnswerCards.forEach(card => card.classList.remove('selected'));
            }
            this.selectedAnswers.add(index);
            answerCard.classList.add('selected');
        }
    }

    checkAnswers(showAlert = true) {
        // Compare selected answers with correct answers
        const correctIndices = this.answers
            .map((answer, index) => (answer.isCorrect ? index.toString() : null))
            .filter(index => index !== null);
    
        const isCorrect =
            this.selectedAnswers.size === correctIndices.length &&
            [...this.selectedAnswers].every(index => correctIndices.includes(index));
    
        // Provide visual feedback
        if (isCorrect) {
            this.elements.questionCard.classList.add('correct');
        } else {
            this.elements.questionCard.classList.add('incorrect');
        }
    
        // Optionally display feedback if showAlert is true
        if (showAlert) {
            alert(isCorrect ? 'Correct!' : 'Incorrect. Please try again.');
        }
    
        return isCorrect;
    }

    reset() {
        // Reset selections and visual feedback
        this.selectedAnswers.clear();
        const allAnswerCards = this.elements.answersGrid.querySelectorAll('.answer-card');
        allAnswerCards.forEach(card => card.classList.remove('selected'));
        this.elements.questionCard.classList.remove('correct', 'incorrect');
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
