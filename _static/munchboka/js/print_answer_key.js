/**
 * Print Answer Key Generator
 * ==========================
 * 
 * This script collects all answer directives from the page and creates
 * an answer key section at the end when printing or exporting to PDF.
 * 
 * Features:
 * - Collects all .answer admonitions
 * - Links each answer to its parent exercise
 * - Creates a formatted answer key page
 * - Only activates when printing
 */

(function() {
    'use strict';
    
    // Check if we're in print mode
    function isPrintMode() {
        return window.matchMedia('print').matches;
    }
    
    // Get exercise number/title from an element
    function getExerciseInfo(element) {
        // Find the parent exercise
        const exercise = element.closest('.admonition.exercise');
        if (!exercise) {
            return null;
        }
        
        // Try to get the exercise title
        const titleElement = exercise.querySelector('.admonition-title');
        if (titleElement) {
            return {
                element: exercise,
                title: titleElement.textContent.trim(),
                id: exercise.id || `exercise-${Date.now()}-${Math.random()}`
            };
        }
        
        return null;
    }
    
    // Get the part letter from tab-item if inside tabs
    function getPartLetter(answerElement) {
        // Check if inside a tab-item
        const tabContent = answerElement.closest('.sd-tab-content');
        if (!tabContent) {
            return null;
        }
        
        // Try to find the corresponding tab set with tabs-parts class
        const tabSet = tabContent.closest('.sd-tab-set.tabs-parts');
        if (!tabSet) {
            return null;
        }
        
        // Get all DIRECT child tab contents (not nested ones)
        const allTabContents = Array.from(tabSet.children).filter(
            child => child.classList && child.classList.contains('sd-tab-content')
        );
        const index = allTabContents.indexOf(tabContent);
        
        if (index >= 0) {
            // Convert index to letter (a, b, c, ...)
            return String.fromCharCode(97 + index);
        }
        
        return null;
    }
    
    // Extract answer content (without the title)
    function getAnswerContent(answerElement) {
        const clone = answerElement.cloneNode(true);
        
        // Remove the title
        const title = clone.querySelector('.admonition-title');
        if (title) {
            title.remove();
        }
        
        // Remove any nested solution, hints, or other answer admonitions
        const nestedAdmonitions = clone.querySelectorAll('.admonition.solution, .admonition.hints, .admonition.answer');
        nestedAdmonitions.forEach(admonition => {
            admonition.remove();
        });
        
        return clone.innerHTML;
    }
    
    // Renumber exercises sequentially, skipping hidden quiz exercises
    function renumberExercises() {
        // Find all exercise admonitions
        const allExercises = document.querySelectorAll('.admonition.exercise');
        let visibleNumber = 1;
        
        allExercises.forEach(exercise => {
            // Check if this exercise contains a quiz (would be hidden in print)
            const hasQuiz = exercise.querySelector('.quiz-main-container') !== null;
            
            if (!hasQuiz) {
                // Store original number and renumber
                const titleElement = exercise.querySelector('.admonition-title');
                if (titleElement) {
                    // Store original text if not already stored
                    if (!titleElement.dataset.originalText) {
                        titleElement.dataset.originalText = titleElement.textContent;
                    }
                    
                    // Replace exercise number
                    const titleText = titleElement.dataset.originalText;
                    const newText = titleText.replace(/Oppgave\s+\d+/i, `Oppgave ${visibleNumber}`);
                    titleElement.textContent = newText;
                    
                    visibleNumber++;
                }
            }
        });
    }

    // Restore original exercise numbers after printing
    function restoreExerciseNumbers() {
        const allExercises = document.querySelectorAll('.admonition.exercise');
        
        allExercises.forEach(exercise => {
            const titleElement = exercise.querySelector('.admonition-title');
            if (titleElement && titleElement.dataset.originalText) {
                titleElement.textContent = titleElement.dataset.originalText;
                delete titleElement.dataset.originalText;
            }
        });
    }
    
    // Create the answer key section
    function createAnswerKey() {
        // Find all answer elements (explicitly only answers, not solutions or hints)
        // Use a more specific selector to avoid any confusion
        const allAnswers = document.querySelectorAll('div.answer, .admonition.answer');
        
        // Filter to only include actual answer elements (not solutions/hints)
        const answers = Array.from(allAnswers).filter(el => {
            // Must have 'answer' class
            if (!el.classList.contains('answer')) return false;
            // Must NOT have 'solution' or 'hints' class
            if (el.classList.contains('solution') || el.classList.contains('hints')) return false;
            return true;
        });
        
        if (answers.length === 0) {
            return; // No answers to collect
        }
        
        const answerData = [];
        
        // Collect all answers with their exercise info
        answers.forEach(answer => {
            const exerciseInfo = getExerciseInfo(answer);
            if (!exerciseInfo) {
                return; // Skip if not in an exercise
            }
            
            const part = getPartLetter(answer);
            const content = getAnswerContent(answer);
            
            answerData.push({
                exerciseTitle: exerciseInfo.title,
                exerciseId: exerciseInfo.id,
                part: part,
                content: content
            });
        });
        
        if (answerData.length === 0) {
            return; // No valid answers found
        }
        
        // Create the answer key section
        const answerKeySection = document.createElement('div');
        answerKeySection.className = 'answer-key-section';
        answerKeySection.innerHTML = '<h1>Fasit</h1>';
        
        // Group answers by exercise
        const groupedAnswers = {};
        answerData.forEach(answer => {
            // Use exercise ID as key to avoid collisions between exercises with same title
            const key = answer.exerciseId;
            if (!groupedAnswers[key]) {
                groupedAnswers[key] = {
                    title: answer.exerciseTitle,
                    answers: []
                };
            }
            groupedAnswers[key].answers.push(answer);
        });
        
        // Create HTML for each exercise's answers
        Object.keys(groupedAnswers).forEach(exerciseId => {
            const exerciseData = groupedAnswers[exerciseId];
            const exerciseAnswers = exerciseData.answers;
            
            const exerciseSection = document.createElement('div');
            exerciseSection.className = 'answer-key-item';
            
            const reference = document.createElement('div');
            reference.className = 'answer-reference';
            reference.textContent = exerciseData.title;
            exerciseSection.appendChild(reference);
            
            exerciseAnswers.forEach(answer => {
                const answerDiv = document.createElement('div');
                answerDiv.className = 'answer-content';
                
                if (answer.part) {
                    const partLabel = document.createElement('strong');
                    partLabel.textContent = `${answer.part}) `;
                    answerDiv.appendChild(partLabel);
                }
                
                const contentDiv = document.createElement('div');
                contentDiv.innerHTML = answer.content;
                contentDiv.style.display = 'inline';
                answerDiv.appendChild(contentDiv);
                
                exerciseSection.appendChild(answerDiv);
            });
            
            answerKeySection.appendChild(exerciseSection);
        });
        
        // Append to the end of the main content
        const mainContent = document.querySelector('main') || 
                           document.querySelector('.bd-article') || 
                           document.body;
        mainContent.appendChild(answerKeySection);
    }
    
    // Setup print event listeners
    function setupPrintListeners() {
        // Before print: renumber exercises and create answer key
        window.addEventListener('beforeprint', function() {
            renumberExercises();
            createAnswerKey();
        });
        
        // After print: restore exercise numbers and remove answer key
        window.addEventListener('afterprint', function() {
            restoreExerciseNumbers();
            const answerKey = document.querySelector('.answer-key-section');
            if (answerKey) {
                answerKey.remove();
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPrintListeners);
    } else {
        setupPrintListeners();
    }
    
    // Also check for print media query changes (for PDF export tools)
    if (window.matchMedia) {
        const printMediaQuery = window.matchMedia('print');
        printMediaQuery.addListener(function(mq) {
            if (mq.matches) {
                renumberExercises();
                createAnswerKey();
            } else {
                restoreExerciseNumbers();
                const answerKey = document.querySelector('.answer-key-section');
                if (answerKey) {
                    answerKey.remove();
                }
            }
        });
    }
})();
