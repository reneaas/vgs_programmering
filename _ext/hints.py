from docutils import nodes
from docutils.parsers.rst import Directive, directives
from sphinx.util.docutils import SphinxDirective
from sphinx.util import logging

logger = logging.getLogger(__name__)


class HintsDirective(SphinxDirective):
    has_content = True
    required_arguments = 0
    optional_arguments = 1
    final_argument_whitespace = True

    option_spec = {
        "dropdown": directives.unchanged,
    }

    def run(self):
        if len(self.arguments) > 0:
            title = self.arguments[0]
        else:
            title = "Hint"

        # Create the admonition node
        admonition_node = nodes.admonition()
        admonition_node["classes"] = ["admonition", "hints"]

        if "dropdown" in self.options:
            dropdown_val = int(self.options["dropdown"])
        else:
            dropdown_val = 1

        if dropdown_val == 1:
            admonition_node["classes"].append("dropdown")

        # Create the title node
        title_node = nodes.title(text=title)
        admonition_node += title_node

        # Parse the content
        self.state.nested_parse(self.content, self.content_offset, admonition_node)

        return [admonition_node]


def setup(app):
    app.add_directive("hints", HintsDirective)

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
