from docutils import nodes
from docutils.parsers.rst import Directive, directives
from sphinx.util.docutils import SphinxDirective
from sphinx.util import logging

logger = logging.getLogger(__name__)


class ProblemLevelDirective(SphinxDirective):
    """Directive for creating problem boxes with different difficulty levels."""

    has_content = True
    required_arguments = 1  # The title of the problem
    optional_arguments = 0
    final_argument_whitespace = True
    option_spec = {
        "level": directives.unchanged,
    }

    def run(self):
        title = self.arguments[0]
        level = self.options.get("level", 1)

        # Create the admonition node
        admonition_node = nodes.admonition()
        admonition_node["classes"] = ["admonition", f"problem-level-{level}"]

        # Create the title node
        title_node = nodes.title(text=title)
        admonition_node += title_node

        # Parse the content
        self.state.nested_parse(self.content, self.content_offset, admonition_node)

        return [admonition_node]


# Create level-specific directives
class ProblemLevel1Directive(ProblemLevelDirective):
    def run(self):
        if not self.arguments:
            self.arguments = ["Oppgave"]
        self.options["level"] = 1
        return super().run()


class ProblemLevel2Directive(ProblemLevelDirective):
    def run(self):
        if not self.arguments:
            self.arguments = ["Oppgave"]
        self.options["level"] = 2
        return super().run()


class ProblemLevel3Directive(ProblemLevelDirective):
    def run(self):
        if not self.arguments:
            self.arguments = ["Oppgave"]
        self.options["level"] = 3
        return super().run()


def setup(app):
    app.add_directive("problem", ProblemLevelDirective)
    app.add_directive("problem-level-1", ProblemLevel1Directive)
    app.add_directive("problem-level-2", ProblemLevel2Directive)
    app.add_directive("problem-level-3", ProblemLevel3Directive)

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
