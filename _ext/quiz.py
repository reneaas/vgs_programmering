from docutils import nodes
from docutils.parsers.rst import Directive, directives
from sphinx.util.docutils import SphinxDirective
import json
import uuid
import re
import os


class QuizDirective(SphinxDirective):
    """Directive for embedding interactive quizzes."""

    has_content = True
    required_arguments = 1  # Quiz ID/name
    optional_arguments = 0
    final_argument_whitespace = True
    option_spec = {
        "shuffle": directives.flag,
    }

    def run(self):
        title = self.arguments[0]

        # Create the admonition node
        admonition_node = nodes.admonition()
        admonition_node["classes"] = ["admonition", "quiz"]

        # Create the title node
        title_node = nodes.title(text=title)
        admonition_node += title_node

        # Parse the content
        # self.state.nested_parse(self.content, self.content_offset, admonition_node)

        container_id = f"quiz-container-{uuid.uuid4().hex}"

        # Parse quiz content
        quiz_data = self._parse_quiz_content()

        # Create the HTML output
        html = f"""
        <!-- Container for the quiz -->
        <div id="{container_id}" class="quiz-main-container"></div>

        <!-- Include KaTeX for LaTeX rendering -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
        <script defer src="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex/dist/contrib/auto-render.min.js"></script>

        <script type="text/javascript">
            document.addEventListener("DOMContentLoaded", () => {{
                // Define your questions and answers
                const questionsData = {json.dumps(quiz_data, ensure_ascii=False)};

                // Initialize the multiple-choice quiz
                const quiz = new SequentialMultipleChoiceQuiz('{container_id}', questionsData);
            }});
        </script>
        """

        raw_node = nodes.raw("", html, format="html")
        admonition_node += raw_node

        return [admonition_node]

    def _parse_quiz_content(self):
        """Parse the directive content into quiz questions data."""
        questions = []
        current_question = None
        current_answers = []

        for line in self.content:
            line = line.strip()

            # Skip empty lines
            if not line:
                continue

            # New question starts with Q:
            if line.startswith("Q:"):
                # Save previous question if exists
                if current_question:
                    questions.append(
                        {"content": current_question, "answers": current_answers}
                    )

                # Start new question and process newlines
                question_text = line[2:].strip()
                # Replace \\n with actual newlines for code blocks
                question_text = self._process_code_blocks(question_text)
                current_question = question_text
                current_answers = []

            # Correct answer starts with +
            elif line.startswith("+"):
                answer_text = line[1:].strip()
                # Process code blocks in answers too
                answer_text = self._process_code_blocks(answer_text)
                current_answers.append({"content": answer_text, "isCorrect": True})

            # Incorrect answer starts with -
            elif line.startswith("-"):
                answer_text = line[1:].strip()
                # Process code blocks in answers too
                answer_text = self._process_code_blocks(answer_text)
                current_answers.append({"content": answer_text, "isCorrect": False})

        # Add the last question
        if current_question:
            questions.append({"content": current_question, "answers": current_answers})

        return questions

    def _process_code_blocks(self, text):
        """Process code blocks to handle newlines properly."""

        # Helper function to process code blocks by type
        def replace_newlines(match):
            code = match.group(2)  # The actual code content
            lang = match.group(1)  # The language class (python or console)

            # Replace escaped newlines with actual newlines
            code = code.replace("\\n", "\n")
            return f'<pre><code class="{lang}">{code}</code></pre>'

        # Find all code blocks with any class and process them
        pattern = r'<pre><code class="([\w-]+)">(.*?)</code></pre>'
        return re.sub(pattern, replace_newlines, text, flags=re.DOTALL)


def setup(app):
    app.add_directive("quiz", QuizDirective)

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
